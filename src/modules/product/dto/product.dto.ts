import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
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
  @IsBoolean()
  publish: boolean;

  specValues?: SpecValueDTO[];

  specs?: SpecDTO[];

  specCates?: SpecCategoryDTO[];
}

export class GetOneProductDTO extends PickType(ProductDTO, ['id']) {}
