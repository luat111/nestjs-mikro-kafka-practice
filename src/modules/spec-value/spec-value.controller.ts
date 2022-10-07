import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import BadRequest from 'src/core/exceptions/bad-request.exception';
import { CreateSpecValueDTO } from './dto/create-spec-value.dto';
import { GetSpecValueDTO } from './dto/get-spec-value.dto';
import { GetFilterSpecValue, GetOneSpecValueDTO } from './dto/spec-value.dto';
import { UpdateSpecValueDTO } from './dto/update-spec-value.dto';
import {
  ISpecValue,
  ISpecValueService,
} from './interface/spec-value.interface';

@ApiTags('spec-value')
@Controller('spec-value')
export class SpecValueController {
  constructor(
    @Inject('ISpecValueService')
    private readonly specValueSerivce: ISpecValueService,
  ) {}

  @Get()
  async getAll(@Query() query: GetSpecValueDTO): Promise<ISpecValue[]> {
    try {
      const cates = await this.specValueSerivce.getAll(query);
      return cates;
    } catch (err) {
      throw new BadRequest(SpecValueController.name, err);
    }
  }

  @Get('filter/:specId')
  async getFilter(@Param() params: GetFilterSpecValue): Promise<ISpecValue[]> {
    try {
      const { specId } = params;
      const cates = await this.specValueSerivce.getFilter(specId);
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
