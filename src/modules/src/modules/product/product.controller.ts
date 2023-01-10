import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/role.decorator';
import BadRequest from 'src/core/exceptions/bad-request.exception';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { CloneSpecBySubCateDTO, CloneSpecDTO } from './dto/clone-spec';
import { CreateProductDTO } from './dto/create-product.dto';
import { GetProductDTO } from './dto/get-product.dto';
import { GetOneProductDTO } from './dto/product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { IProductSerivce } from './interface/product.interface';

@ApiBearerAuth()
@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    @Inject('IProductService')
    private readonly productSerivce: IProductSerivce,
  ) {}

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles('Administration')
  @Get('sync')
  async sync() {
    try {
      return await this.productSerivce.syncProduct();
    } catch (err) {
      throw new BadRequest(ProductController.name, err);
    }
  }
  
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles('Administration')
  @Get('sync-cate')
  async syncCate() {
    try {
      return await this.productSerivce.syncCate();
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

  @Post()
  async create(@Body() body: CreateProductDTO) {
    try {
      return await this.productSerivce.create(body);
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
  async cloneSpec(@Param() params: CloneSpecDTO) {
    try {
      const { id, form } = params;
      return await this.productSerivce.cloneSpec(id, form);
    } catch (err) {
      throw new BadRequest(ProductController.name, err);
    }
  }

  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)
  @Roles('Administration')
  @Post('clone/:idSubCate/form/:form')
  async cloneSpecBySubCate(@Param() params: CloneSpecBySubCateDTO) {
    try {
      const { idSubCate, form } = params;
      return await this.productSerivce.cloneSpecBySubCate(idSubCate, form);
    } catch (err) {
      throw new BadRequest(ProductController.name, err);
    }
  }
}
