import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ElasticSearchService } from 'src/modules/elasticsearch/elasticsearch.service';
import { ProductCreatedEvent } from '../events/product-created.event';

@Injectable()
export class ProductCreatedListener {
  constructor(private readonly elasticService: ElasticSearchService) {}
  @OnEvent('product.created')
  handleProductCreatedEvent(event: ProductCreatedEvent) {
    this.elasticService.indexOne({
      ...event,
    });
  }
}
