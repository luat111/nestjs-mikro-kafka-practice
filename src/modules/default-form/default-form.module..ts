import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import DefaultFormEntity from 'src/entities/default-form.entity';
import { LoggerModule } from '../logger/logger.module';
import { SpecCateModule } from '../spec-category/spec-category.module';
import { SpecValueModule } from '../spec-value/spec-value.module';
import { SpecificationModule } from '../specification/specification.module';
import { DefaultFormController } from './default-form.controller';
import { DefaultFormService } from './default-form.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([DefaultFormEntity], 'dbLocal'),
    LoggerModule,
    forwardRef(() => SpecCateModule),
    forwardRef(() => SpecValueModule),
    forwardRef(() => SpecificationModule),
  ],
  controllers: [DefaultFormController],
  providers: [
    {
      provide: 'IDefaultFormService',
      useClass: DefaultFormService,
    },
  ],
  exports: ['IDefaultFormService'],
})
export class DefaultFormModule {}
