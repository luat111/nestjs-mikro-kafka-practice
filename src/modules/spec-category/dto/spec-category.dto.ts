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
import { SpecDTO } from 'src/modules/specification/dto/spec.dto';

export class SpecCategoryDTO {
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
  @Type(() => Boolean)
  @IsBoolean()
  isAdvanced: boolean;

  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  hidden: boolean;

  @ApiProperty()
  @Type(() => Boolean)
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

  @IsArray()
  @Type(() => SpecDTO)
  specs: SpecDTO[];

  @IsArray()
  @Type(() => ProductDTO)
  products: ProductDTO[];

  @IsArray()
  @Type(() => DefaultFormDTO)
  defaultForms: DefaultFormDTO[];
}

export class GetOneSpecCategoryDTO extends PickType(SpecCategoryDTO, ['id']) {}
