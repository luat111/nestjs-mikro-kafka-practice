import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SpecificationService } from './specification.service';

@ApiTags('specification')
@Controller('specification')
export class SpecificationController {
  constructor(private readonly specSerivce: SpecificationService) {}
}
