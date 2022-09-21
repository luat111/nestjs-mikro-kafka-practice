import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SpecificationCategoryService } from './spec-category.service';

@ApiTags('SpecCateogry')
@Controller('spec-cateogry')
export class SpecCateogryController {
  constructor(private readonly specCategoryService: SpecificationCategoryService) {}

  @Get()
  async getAll(){
    return this.specCategoryService.getAll()
  }
}
