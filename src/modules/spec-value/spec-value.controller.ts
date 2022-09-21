import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SpecificationValueService } from './spec-value.service';

@ApiTags('SpecValue')
@Controller('spec-value')
export class SpecValueController {
  constructor(private readonly specValueService: SpecificationValueService) {}

  @Get()
  async getAll(){
    return this.specValueService.getAll()
  }
}
