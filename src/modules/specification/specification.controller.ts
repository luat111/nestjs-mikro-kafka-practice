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
import { List } from 'src/core/interfaces';
import ISpecification from 'src/entities/specification.entity';
import { CreateSpecDTO } from './dto/create-spec.dto';
import { GetSpecDTO } from './dto/get-spec.dto';
import { GetOneSpecDTO } from './dto/spec.dto';
import { UpdateSpecDTO } from './dto/update-spec.dto';
import { ISpecificationService } from './interface/specification.interface';

@ApiTags('specification')
@Controller('specification')
export class SpecificationController {
  constructor(
    @Inject('ISpecificationService')
    private readonly specSerivce: ISpecificationService,
  ) {}

  @Get()
  async getAll(@Query() query: GetSpecDTO): Promise<List<ISpecification>> {
    try {
      const specs = await this.specSerivce.getAll(query);
      return specs;
    } catch (err) {
      throw new BadRequest(SpecificationController.name, err);
    }
  }

  @Get('filter')
  async getFilter(): Promise<ISpecification[]> {
    try {
      const specs = await this.specSerivce.getFilter();
      return specs;
    } catch (err) {
      throw new BadRequest(SpecificationController.name, err);
    }
  }

  @Get(':id')
  async getOne(@Param() params: GetOneSpecDTO): Promise<ISpecification> {
    try {
      const { id } = params;
      const spec = await this.specSerivce.getOne(id);
      return spec;
    } catch (err) {
      throw new BadRequest(SpecificationController.name, err);
    }
  }

  @Post()
  async create(@Body() body: CreateSpecDTO): Promise<ISpecification> {
    try {
      const spec = await this.specSerivce.create(body);
      return spec;
    } catch (err) {
      throw new BadRequest(SpecificationController.name, err);
    }
  }

  @Put()
  async update(@Body() body: UpdateSpecDTO): Promise<ISpecification> {
    try {
      const spec = await this.specSerivce.update(body);
      return spec;
    } catch (err) {
      throw new BadRequest(SpecificationController.name, err);
    }
  }

  @Delete(':id')
  async remove(@Param() params: GetOneSpecDTO): Promise<string> {
    try {
      const { id } = params;
      const spec = await this.specSerivce.remove(id);
      return spec;
    } catch (err) {
      throw new BadRequest(SpecificationController.name, err);
    }
  }
}
