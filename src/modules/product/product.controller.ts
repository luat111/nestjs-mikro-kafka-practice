import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BadRequest from 'src/core/exceptions/bad-request.exception';
import { GetProductDTO } from './dto/get-product.dto';
import { GetOneProductDTO } from './dto/product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { IProductSerivce } from './interface/product.interface';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    @Inject('IProductService')
    private readonly productSerivce: IProductSerivce,
  ) {}

  @Get('sync')
  async sync() {
    try {
      return await this.productSerivce.syncProduct();
    } catch (err) {
      throw new BadRequest(ProductController.name, err);
    }
  }

  @Get()
  async getAll(@Query() query: GetProductDTO) {
    try {
      return await this.productSerivce.getAll(query);
    } catch (err) {
      throw new BadRequest(ProductController.name, err);
    }
  }

  @Get(':id')
  async getOne(@Param() params: GetOneProductDTO) {
    try {
      const { id } = params;
      return await this.productSerivce.getOne(id);
    } catch (err) {
      throw new BadRequest(ProductController.name, err);
    }
  }

  @Put()
  async update(@Body() body: UpdateProductDTO) {
    try {
      return await this.productSerivce.update(body);
    } catch (err) {
      throw new BadRequest(ProductController.name, err);
    }
  }

  @Patch(':id/form/:form')
  async cloneSpec(@Param() params: any) {
    try {
      const { id, form } = params;
      return await this.productSerivce.cloneSpec(id, form);
    } catch (err) {
      throw new BadRequest(ProductController.name, err);
    }
  }
}
