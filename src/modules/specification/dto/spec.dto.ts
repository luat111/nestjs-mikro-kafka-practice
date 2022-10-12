import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DefaultFormDTO } from 'src/modules/default-form/dto/default-form.dto';
import { ProductDTO } from 'src/modules/product/dto/product.dto';
import { SpecCategoryDTO } from 'src/modules/spec-category/dto/spec-category.dto';
import { SpecValueDTO } from 'src/modules/spec-value/dto/spec-value.dto';

export class SpecDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  indexPos: number;

  @ApiProperty()
  @IsBoolean()
  isFilter: boolean;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @Type(() => SpecCategoryDTO)
  cate: SpecCategoryDTO;

  @IsArray()
  @Type(() => SpecValueDTO)
  specValues: SpecValueDTO[];

  @IsArray()
  @Type(() => ProductDTO)
  products: ProductDTO[];

  @IsArray()
  @Type(() => DefaultFormDTO)
  defaultForms: DefaultFormDTO[];
}

export class GetOneSpecDTO extends PickType(SpecDTO, ['id']) {}
