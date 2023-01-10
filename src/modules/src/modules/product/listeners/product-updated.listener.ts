import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ElasticSearchService } from 'src/modules/elasticsearch/elasticsearch.service';
import { ProductUpdatedEvent } from '../events/product-updated.event';

@Injectable()
export class ProductUpdatedListener {
  constructor(private readonly elasticService: ElasticSearchService) {}
  @OnEvent('product.updated')
  handleProductUpdatedEvent(event: ProductUpdatedEvent) {
    this.elasticService.updateIndex({
      ...event,
    });
  }
}
