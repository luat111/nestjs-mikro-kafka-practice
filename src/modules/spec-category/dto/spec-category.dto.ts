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
  @IsBoolean()
  isAdvanced: boolean;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @ApiProperty()
  @IsArray()
  @Type(() => SpecValueEntity)
  specs: SpecValueEntity[];

  @ApiProperty()
  @IsArray()
  @Type(() => ProductEntity)
  products: ProductEntity[];
}

export class GetOneSpecCategoryDTO extends PickType(SpecCategoryDTO, ['id']) {}
