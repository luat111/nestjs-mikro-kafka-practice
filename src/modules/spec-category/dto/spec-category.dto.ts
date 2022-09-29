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
  @IsString()
  @Type(() => Number)
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
  @Type(() => ProductEntity)
  products: ProductEntity[];
}

export class GetOneSpecCategoryDTO extends PickType(SpecCategoryDTO, ['id']) {}
