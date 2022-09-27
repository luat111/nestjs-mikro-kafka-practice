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
import BadRequest from 'src/core/exceptions/bad-request.exception';
import { CreateSpecValueDTO } from './dto/create-spec-value.dto';
import { GetOneSpecValueDTO } from './dto/spec-value.dto';
import { UpdateSpecValueDTO } from './dto/update-spec-value.dto';
import { ISpecValue } from './interface/spec-value.interface';
import { SpecValueService } from './spec-value.service';

@ApiTags('spec-value')
@Controller('spec-value')
export class SpecValueController {
  constructor(private readonly specValueSerivce: SpecValueService) {}

  @Get()
  async getAll(): Promise<ISpecValue[]> {
    try {
      const cates = await this.specValueSerivce.getAll();
      return cates;
    } catch (err) {
      throw new BadRequest(SpecValueController.name, err);
    }
  }

  @Get(':id')
  async getOne(@Param() params: GetOneSpecValueDTO): Promise<ISpecValue> {
    try {
      const { id } = params;
      const cate = await this.specValueSerivce.getOne(id);
      return cate;
    } catch (err) {
      throw new BadRequest(SpecValueController.name, err);
    }
  }

  @Post()
  async create(@Body() body: CreateSpecValueDTO): Promise<ISpecValue> {
    try {
      const cate = await this.specValueSerivce.create(body);
      return cate;
    } catch (err) {
      throw new BadRequest(SpecValueController.name, err);
    }
  }

  @Put()
  async update(@Body() body: UpdateSpecValueDTO): Promise<ISpecValue> {
    try {
      const cate = await this.specValueSerivce.update(body);
      return cate;
    } catch (err) {
      throw new BadRequest(SpecValueController.name, err);
    }
  }

  @Delete(':id')
  async remove(@Param() params: GetOneSpecValueDTO): Promise<string> {
    try {
      const { id } = params;
      const cate = await this.specValueSerivce.remove(id);
      return cate;
    } catch (err) {
      throw new BadRequest(SpecValueController.name, err);
    }
  }
}
