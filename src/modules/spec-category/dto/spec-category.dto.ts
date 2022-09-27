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
  @IsBoolean()
  isAdvanced: boolean;

  @ApiProperty()
  @IsBoolean()
  hidden: boolean;

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

  @IsArray()
  @Type(() => SpecDTO)
  specs: SpecDTO[];

  @IsArray()
  @Type(() => ProductEntity)
  products: ProductEntity[];
}

export class GetOneSpecCategoryDTO extends PickType(SpecCategoryDTO, ['id']) {}
