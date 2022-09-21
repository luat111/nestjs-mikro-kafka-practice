import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsString } from 'class-validator';

export class ProductDTO {
  @IsString()
  id: string;

  @IsBoolean()
  publish: boolean;
}

export class AddSpecDTO {
  @ApiProperty()
  @IsString()
  productId: string;
  
  @ApiProperty()
  @IsArray()
  @Type(() => String)
  idSpecs: string[];
}

export class GetOneDTO {
  @ApiProperty()
  @IsString()
  id:string;
}