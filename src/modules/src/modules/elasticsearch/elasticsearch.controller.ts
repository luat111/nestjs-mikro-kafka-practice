import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/role.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { ProductDTO, QueryDTO } from './dto/product.dto';
import { ElasticSearchService } from './elasticsearch.service';

@ApiBearerAuth()
@ApiTags('elasticsearch')
@Controller('elasticsearch')
export class ElasticSearchController {
  constructor(private readonly elasticSearchService: ElasticSearchService) {}

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles('Administration')
  @Get('index')
  async get() {
    return await this.elasticSearchService.indexProducts();
  }

  @Get('search')
  async search(@Query() query: QueryDTO) {
    const { search = '', limit = 20, offset = 0, min, max } = query;
    return await this.elasticSearchService.search({
      search,
      limit,
      offset,
      min,
      max,
    });
  }

  @Get('getall')
  async getAll() {
    return await this.elasticSearchService.getAllIndex();
  }

  @Post('index-one')
  async indexOne(@Body() product: ProductDTO) {
    return await this.elasticSearchService.indexOne(product);
  }

  @Put('update-one')
  async updateOne(@Body() product: ProductDTO) {
    return await this.elasticSearchService.updateIndex(product);
  }

  @Delete('remove-one/:id')
  async removeOne(@Param() params) {
    const { id } = params;
    return await this.elasticSearchService.removeIndex(id);
  }

  @Delete('clearall')
  async clearAll() {
    return await this.elasticSearchService.clearAllIndex();
  }
}
