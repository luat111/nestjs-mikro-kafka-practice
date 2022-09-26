import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import HttpBadRequestException from 'src/core/exceptions/bad-request.exception';
import { GetProductDTO } from './dto/get-product.dto';
import { GetOneProductDTO } from './dto/product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ProductService } from './product.service';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productSerivce: ProductService) {}

  @Get('sync')
  async sync() {
    try {
      return await this.productSerivce.syncProduct();
    } catch (err) {
      throw new HttpBadRequestException(ProductController.name, err);
    }
  }

  @Get()
  async getAll(
    @Query() query: GetProductDTO,
  ) {
    try {
      return await this.productSerivce.getAll(query);
    } catch (err) {
      throw new HttpBadRequestException(ProductController.name, err);
    }
  }

  @Get(':id')
  async getOne(@Param() params: GetOneProductDTO) {
    try {
      const { id } = params;
      return await this.productSerivce.getOne(id);
    } catch (err) {
      throw new HttpBadRequestException(ProductController.name, err);
    }
  }

  @Put()
  async update(@Body() body: UpdateProductDTO) {
    try {
      return await this.productSerivce.update(body);
    } catch (err) {
      throw new HttpBadRequestException(ProductController.name, err);
    }
  }
}
