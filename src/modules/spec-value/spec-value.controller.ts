import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SpecValueService } from './spec-value.service';

@ApiTags('spec-value')
@Controller('spec-value')
export class SpecValueController {
  constructor(private readonly specValueSerivce: SpecValueService) {}
}
