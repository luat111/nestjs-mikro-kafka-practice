import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import GroupEntity from 'src/entities/group.entity';
import StaffGroupEntity from 'src/entities/staff-group.entity';
import StaffEntity from 'src/entities/staff.entity';
import { LoggerModule } from '../logger/logger.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    LoggerModule,
    MikroOrmModule.forFeature([StaffEntity], 'dbStaging'),
    MikroOrmModule.forFeature([GroupEntity], 'dbStaging'),
    MikroOrmModule.forFeature([StaffGroupEntity], 'dbStaging'),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
