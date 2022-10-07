import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { SpecCategoryDTO } from 'src/modules/spec-category/dto/spec-category.dto';
import { SpecValueDTO } from 'src/modules/spec-value/dto/spec-value.dto';
import { SpecDTO } from 'src/modules/specification/dto/spec.dto';

export class DefaultFormDTO {
  @ApiProperty()
  @IsString()
  id: string;

  specValues?: SpecValueDTO[];

  specs?: SpecDTO[];

  specCates?: SpecCategoryDTO[];
}

export class GetOneDefaultFormDTO extends PickType(DefaultFormDTO, ['id']) {}
