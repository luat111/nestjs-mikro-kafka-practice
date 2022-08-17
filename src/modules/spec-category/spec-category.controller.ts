import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import HttpBadRequestException from 'src/core/exceptions/bad-request.exception';
import { CreateSpecCategoryDTO } from './dto/create-spec-category.dto';
import { GetOneSpecCategoryDTO } from './dto/spec-category.dto';
import { UpdateSpecCategoryDTO } from './dto/update-spec-category.dto';
import { SpecCateService } from './spec-category.service';

@ApiTags('spec-category')
@Controller('spec-category')
export class SpecCateController {
  serviceName = 'SpecCategoryController';
  constructor(private readonly specCateSerivce: SpecCateService) {}

  @Get()
  async getAll() {
    try {
      const cates = await this.specCateSerivce.getAll();
      return cates;
    } catch (err) {
      throw new HttpBadRequestException(this.serviceName, err);
    }
  }

  @Get(':id')
  async getOne(@Param() params: GetOneSpecCategoryDTO) {
    try {
      const { id } = params;
      const cate = await this.specCateSerivce.getOne(id);
      return cate;
    } catch (err) {
      throw new HttpBadRequestException(this.serviceName, err);
    }
  }

  @Post()
  async create(@Body() body: CreateSpecCategoryDTO) {
    try {
      const cate = await this.specCateSerivce.create(body);
      return cate;
    } catch (err) {
      throw new HttpBadRequestException(this.serviceName, err);
    }
  }

  @Put()
  async update(@Body() body: UpdateSpecCategoryDTO) {
    try {
      const cate = await this.specCateSerivce.update(body);
      return cate;
    } catch (err) {
      throw new HttpBadRequestException(this.serviceName, err);
    }
  }

  @Delete(':id')
  async remove(@Param() params: GetOneSpecCategoryDTO) {
    try {
      const { id } = params;
      const cate = await this.specCateSerivce.remove(id);
      return cate;
    } catch (err) {
      throw new HttpBadRequestException(this.serviceName, err);
    }
  }
}
