import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import HttpBadRequestException from 'src/core/exceptions/bad-request.exception';
import { CreateSpecDTO } from './dto/create-spec.dto';
import { GetOneSpecDTO } from './dto/spec.dto';
import { UpdateSpecDTO } from './dto/update-spec.dto';
import { SpecificationService } from './specification.service';

@ApiTags('specification')
@Controller('specification')
export class SpecificationController {
  constructor(private readonly specSerivce: SpecificationService) {}

  @Get()
  async getAll() {
    try {
      const cates = await this.specSerivce.getAll();
      return cates;
    } catch (err) {
      throw new HttpBadRequestException(SpecificationController.name, err);
    }
  }

  @Get(':id')
  async getOne(@Param() params: GetOneSpecDTO) {
    try {
      const { id } = params;
      const cate = await this.specSerivce.getOne(id);
      return cate;
    } catch (err) {
      throw new HttpBadRequestException(SpecificationController.name, err);
    }
  }

  @Post()
  async create(@Body() body: CreateSpecDTO) {
    try {
      const cate = await this.specSerivce.create(body);
      return cate;
    } catch (err) {
      throw new HttpBadRequestException(SpecificationController.name, err);
    }
  }

  @Put()
  async update(@Body() body: UpdateSpecDTO) {
    try {
      const cate = await this.specSerivce.update(body);
      return cate;
    } catch (err) {
      throw new HttpBadRequestException(SpecificationController.name, err);
    }
  }

  @Delete(':id')
  async remove(@Param() params: GetOneSpecDTO) {
    try {
      const { id } = params;
      const cate = await this.specSerivce.remove(id);
      return cate;
    } catch (err) {
      throw new HttpBadRequestException(SpecificationController.name, err);
    }
  }
}
