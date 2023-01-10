import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { SpecCategoryDTO } from 'src/modules/spec-category/dto/spec-category.dto';
import { SpecValueDTO } from 'src/modules/spec-value/dto/spec-value.dto';
import { SpecDTO } from 'src/modules/specification/dto/spec.dto';

export class ProductDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  uri: string;

  @ApiProperty()
  @IsBoolean()
  publish: boolean;

  @ApiProperty()
  @IsString()
  productPhoto: string;

  @ApiProperty()
  @IsNumber()
  salePrice: number;

  @ApiProperty()
  @IsString()
  CategoryId: string;

  specValues?: SpecValueDTO[];

  specs?: SpecDTO[];

  specCates?: SpecCategoryDTO[];

  @ApiProperty()
  subCates: any[];
}

export class GetOneProductDTO extends PickType(ProductDTO, ['id']) {}
