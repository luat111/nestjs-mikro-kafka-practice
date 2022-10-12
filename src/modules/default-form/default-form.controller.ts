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
import { GetDefaultFormDTO } from './dto/get-default-form.dto';
import { GetOneDefaultFormDTO } from './dto/default-form.dto';
import { UpdateDefaultFormDTO } from './dto/update-default-form.dto';
import { IDefaultFormService } from './interface/default-form.interface';
import { CreateDefaultFormDTO } from './dto/create-default-form.dto';

@ApiTags('default-forms')
@Controller('default-forms')
export class DefaultFormController {
  constructor(
    @Inject('IDefaultFormService')
    private readonly defaultFormSerivce: IDefaultFormService,
  ) {}

  @Get()
  async getAll(@Query() query: GetDefaultFormDTO) {
    try {
      return await this.defaultFormSerivce.getAll(query);
    } catch (err) {
      throw new BadRequest(DefaultFormController.name, err);
    }
  }

  @Get(':id')
  async getOne(@Param() params: GetOneDefaultFormDTO) {
    try {
      const { id } = params;
      return await this.defaultFormSerivce.getOne(id);
    } catch (err) {
      throw new BadRequest(DefaultFormController.name, err);
    }
  }

  @Post()
  async create(@Body() body: CreateDefaultFormDTO) {
    try {
      return await this.defaultFormSerivce.create(body);
    } catch (err) {
      throw new BadRequest(DefaultFormController.name, err);
    }
  }

  @Put()
  async update(@Body() body: UpdateDefaultFormDTO) {
    try {
      return await this.defaultFormSerivce.update(body);
    } catch (err) {
      throw new BadRequest(DefaultFormController.name, err);
    }
  }

  @Delete(':id')
  async remove(@Param() params: GetOneDefaultFormDTO) {
    try {
      const { id } = params;
      return await this.defaultFormSerivce.remove(id);
    } catch (err) {
      throw new BadRequest(DefaultFormController.name, err);
    }
  }
}
