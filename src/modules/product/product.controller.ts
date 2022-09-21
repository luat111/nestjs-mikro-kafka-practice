import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddSpecDTO, GetOneDTO } from './dto/product.dto';
import { ProductService } from './product.serivce';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productSerivce: ProductService) {}

  @Get()
  getHello() {
    return this.productSerivce.getAll();
  }

  @Get('/raw/:id')
  async getOneRaw(@Param() params: GetOneDTO) {
    const { id } = params;
    return await this.productSerivce.getOneRaw(id);
  }

  @Get(':id')
  async getOne(@Param() params: GetOneDTO) {
    const { id } = params;
    return await this.productSerivce.getOne(id);
  }

  @Get('bulk-create')
  bulkCreate() {
    return this.productSerivce.bulkCreate();
  }

  @Post('add-spec')
  async addSpec(@Body() body: AddSpecDTO) {
    return await this.productSerivce.addSpec(body);
  }
}
