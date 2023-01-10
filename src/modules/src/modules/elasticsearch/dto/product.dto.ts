// import { Category } from 'src/entities/categories';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductDTO {
  id: string;
  name?: string;
  uri?: string;
  productPhoto?: string;
  publish: boolean;
  CategoryId?: string;
}

export class QueryDTO {
  @ApiPropertyOptional()
  search: string;

  @ApiPropertyOptional()
  limit: number;

  @ApiPropertyOptional()
  offset: number;

  @ApiPropertyOptional()
  min: number;

  @ApiPropertyOptional()
  max: number;
}
