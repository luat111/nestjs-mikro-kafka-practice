import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import SpecValueEntity from 'src/entities/spec-value.entity';
import { SpecValueController } from './spec-value.controller';
import { SpecValueService } from './spec-value.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([SpecValueEntity], 'dbStaging'),
    MikroOrmModule.forFeature([SpecValueEntity], 'dbLocal'),
  ],
  controllers: [SpecValueController],
  providers: [SpecValueService],
  exports: [SpecValueService],
})
export class SpecValueModule {}
