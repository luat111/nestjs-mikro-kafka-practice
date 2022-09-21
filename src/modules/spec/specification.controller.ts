import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SpecificationService } from './specification.service';

@ApiTags('Specifications')
@Controller('Specifications')
export class SpecificationController {
  constructor(private readonly specService: SpecificationService) {}

  @Get()
  getHello() {
    return this.specService.getAll();
  }
}
