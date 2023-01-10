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
  IsUUID,
} from 'class-validator';
import { DefaultFormDTO } from 'src/modules/default-form/dto/default-form.dto';
import { ProductDTO } from 'src/modules/product/dto/product.dto';
import { SpecDTO } from 'src/modules/specification/dto/spec.dto';

export class SpecValueDTO {
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
  isFilter: boolean;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @Type(() => SpecDTO)
  specification: SpecDTO;

  @IsArray()
  @Type(() => ProductDTO)
  products: ProductDTO[];

  @IsArray()
  @Type(() => DefaultFormDTO)
  defaultForms: DefaultFormDTO[];
}

export class GetOneSpecValueDTO extends PickType(SpecValueDTO, ['id']) {}

export class GetFilterSpecValue {
  @ApiProperty()
  @IsUUID()
  specId: string;
}
