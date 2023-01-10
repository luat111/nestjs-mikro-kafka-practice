import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { default as axios } from 'axios';
import BadRequest from 'src/core/exceptions/bad-request.exception';
import ProductEntity from 'src/entities/product.entity';
import { stringToSlug } from 'src/utils/stringToSlug';
import { LoggerService } from '../logger/logger.service';
import { ProductDTO, QueryDTO } from './dto/product.dto';

@Injectable()
export class ElasticSearchService {
  index: string = 'products';
  constructor(
    @InjectRepository(ProductEntity, 'dbStaging')
    private readonly productsRepository: EntityRepository<ProductEntity>,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(ElasticSearchService.name);
  }

  getAll(): Promise<ProductEntity[]> {
    return this.productsRepository.find(null, {
      fields: [
        'id',
        'name',
        'productPhoto',
        'uri',
        'publish',
        'CategoryId',
        'salePrice',
      ],
      populate: ['CategoryId'],
    });
  }

  getOneProduct(id: string): Promise<ProductEntity> {
    return this.productsRepository.findOne(
      { id: id },
      { populate: ['CategoryId'] },
    );
  }

  async settingIndex(index: string): Promise<boolean> {
    try {
      await axios.put(
        `${this.configService.get<string>('es.es_node')}/${index}`,
        {
          settings: {
            analysis: {
              analyzer: {
                product_custom_analyzer: {
                  tokenizer: 'standard',
                  char_filter: ['my_char_filter'],
                  filter: ['lowercase', 'classic'],
                },
              },
              char_filter: {
                my_char_filter: {
                  type: 'pattern_replace',
                  pattern: '(\\w+)/(?=\\w)',
                  replacement: '$1',
                },
              },
            },
          },
          mappings: {
            properties: {
              name: {
                type: 'text',
                analyzer: 'product_custom_analyzer',
                index_prefixes: {
                  min_chars: 1,
                  max_chars: 10,
                },
              },
              nameSlug: {
                type: 'text',
                analyzer: 'product_custom_analyzer',
                copy_to: 'suggestStr',
                index_prefixes: {
                  min_chars: 1,
                  max_chars: 10,
                },
              },
              cateName: {
                type: 'text',
                copy_to: 'suggestStr',
              },
              cateSlug: {
                type: 'text',
                copy_to: 'suggestStr',
              },
              salePrice: {
                type: 'integer',
              },
              productPhoto: {
                type: 'text',
              },
              id: {
                type: 'keyword',
              },
              suggestStr: {
                type: 'completion',
              },
            },
          },
        },
        {
          auth: {
            username: this.configService.get<string>('es.es_user'),
            password: this.configService.get<string>('es.es_pwd'),
          },
        },
      );

      return true;
    } catch (err) {
      console.log(err);

      this.logger.error(err);
      throw new BadRequest(ElasticSearchService.name, err);
    }
  }

  async indexProducts(): Promise<boolean> {
    try {
      const listProducts = await this.getAll();
      await this.clearAllIndex();
      await this.settingIndex(this.index);
      await Promise.all(
        listProducts.map(async (product) => {
          const {
            CategoryId,
            subCates,
            specCates,
            specValues,
            specs,
            name,
            ...rest
          } = product;
          this.elasticsearchService.index({
            index: this.index,
            document: {
              ...rest,
              name,
              suggestStr: name,
              nameSlug: stringToSlug(name),
              cateName: CategoryId.name,
              cateSlug: stringToSlug(CategoryId.name),
            },
          });
        }),
      );

      return true;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ElasticSearchService.name, err);
    }
  }

  async clearAllIndex(): Promise<boolean> {
    try {
      await this.elasticsearchService.indices.delete({
        index: '_all',
      });

      return true;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ElasticSearchService.name, err);
    }
  }

  async search({ search, limit, offset, min, max }: QueryDTO): Promise<any> {
    try {
      const rangePrice = this.rangePrice(min, max)
        ? [
            {
              range: {
                salePrice: this.rangePrice(min, max),
              },
            },
          ]
        : [];

      const { hits: results, suggest } = await this.elasticsearchService.search(
        {
          index: this.index,
          body: {
            from: offset,
            size: limit,
            query: {
              boosting: {
                positive: {
                  bool: {
                    must: [...this.query(search), ...rangePrice],
                  },
                },
                negative: {
                  bool: {
                    should: [
                      {
                        bool: {
                          must: [
                            {
                              match: {
                                cateName: 'Phụ kiện',
                              },
                            },
                            ...rangePrice,
                            ...this.query(search),
                          ],
                        },
                      },
                      {
                        bool: {
                          must: [
                            {
                              match: {
                                cateName: 'Work Setup',
                              },
                            },
                            ...rangePrice,
                            ...this.query(search),
                          ],
                        },
                      },
                    ],
                  },
                },
                negative_boost: 0.3,
              },
            },
            suggest: {
              suggest: {
                prefix: search,
                completion: {
                  size: 1,
                  field: 'suggestStr',
                  skip_duplicates: true,
                },
              },
            },
          },
        },
      );

      const { hits: resultsRelated } = await this.elasticsearchService.search({
        index: this.index,
        body: {
          from: offset,
          size: limit,
          query: {
            more_like_this: {
              fields: ['name', 'cate', 'cateSlug', 'nameSlug'],
              like: search,
              min_term_freq: 1,
              max_query_terms: 12,
            },
          },
        },
      });

      return {
        suggestion: suggest.suggest[0]?.options[0]?.text || search,
        resultsRelated: resultsRelated.hits.map((p) => p._source),
        count: results.total['value'] || 0,
        rows: results.hits.map((p) => p._source),
      };
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ElasticSearchService.name, err);
    }
  }

  async getAllIndex(): Promise<{ count: unknown | number; rows: unknown }> {
    try {
      const { hits: results } = await this.elasticsearchService.search({
        index: this.index,
        body: {
          query: {
            match_all: {},
          },
        },
      });

      return {
        count: results.total['value'] || 0,
        rows: results.hits.map((e) => e._source),
      };
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ElasticSearchService.name, err);
    }
  }

  async indexOne(product: ProductDTO): Promise<boolean> {
    try {
      const cateName = (await this.getOneProduct(product.id)).CategoryId.name;

      const { CategoryId, name, ...rest } = product;
      await this.elasticsearchService.index({
        index: this.index,
        document: {
          ...rest,
          name,
          suggestStr: name,
          nameSlug: stringToSlug(name),
          cateName: cateName,
          cateSlug: stringToSlug(cateName),
        },
      });

      return true;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ElasticSearchService.name, err);
    }
  }

  async removeIndex(productId: string): Promise<boolean> {
    try {
      await this.elasticsearchService.deleteByQuery({
        index: this.index,
        body: {
          query: {
            match: {
              id: productId,
            },
          },
        },
      });
      return true;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ElasticSearchService.name, err);
    }
  }

  async updateIndex(product: ProductDTO): Promise<boolean> {
    try {
      const { id, CategoryId, ...rest } = product;

      await this.elasticsearchService.updateByQuery({
        index: this.index,
        body: {
          query: {
            match: {
              id: id,
            },
          },
          script: {
            source: this.bodyUpdate(rest),
          },
        },
      });

      return true;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ElasticSearchService.name, err);
    }
  }

  rangePrice(min: number, max: number) {
    try {
      if (!min && !max) return null;

      const range = [...arguments].reduce((newObj, current, index) => {
        const curValue = Number(current);
        if (curValue === 0 || !current) return newObj;

        Object.assign(newObj, {
          [index === 0 ? 'gte' : 'lte']: curValue,
        });

        return newObj;
      }, {});

      if (Object.keys(range).length <= 0) return null;
      return range;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(ElasticSearchService.name, err);
    }
  }

  typeSearch(search: string) {
    return search.split(' ').length >= 3 ? 'cross_fields' : 'phrase_prefix';
  }

  bodyUpdate(product: any): string {
    let script = Object.entries(product).reduce(
      (newScript: string, [key, value]) => {
        newScript += `ctx._source['${key}']='${value}'; `;
        return newScript;
      },
      '',
    );

    script += `ctx._source['nameSlug']='${stringToSlug(product.name)}'; `;
    script += `ctx._source['suggestStr']='${product.name}'; `;

    return script;
  }

  query(search: string): any {
    return [
      {
        multi_match: {
          query: search || '',
          type: this.typeSearch(search),
          fields: ['name', 'cateName', 'nameSlug', 'cateSlug'],
          boost: 1,
        },
      },
      {
        match: {
          publish: true,
        },
      },
    ];
  }
}
