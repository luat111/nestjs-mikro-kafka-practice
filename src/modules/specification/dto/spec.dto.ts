import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import ProductEntity from 'src/entities/product.entity';
import SpecValueEntity from 'src/entities/spec-value.entity';
import { SpecCategoryDTO } from 'src/modules/spec-category/dto/spec-category.dto';

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
  @IsString()
  @Type(() => Number)
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
  @Type(() => SpecValueEntity)
  specValues: SpecValueEntity[];

  @IsArray()
  @Type(() => ProductEntity)
  products: ProductEntity[];
}

export class GetOneSpecDTO extends PickType(SpecDTO, ['id']) {}
