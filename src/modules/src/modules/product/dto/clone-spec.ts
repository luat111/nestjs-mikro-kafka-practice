import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CloneSpecDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  form: string;
}

export class CloneSpecBySubCateDTO extends OmitType(CloneSpecDTO, ['id']) {
  @ApiProperty()
  @IsString()
  idSubCate: string;
}
