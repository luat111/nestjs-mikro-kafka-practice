import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import GroupEntity from 'src/entities/group.entity';
import StaffGroupEntity from 'src/entities/staff-group.entity';
import StaffEntity from 'src/entities/staff.entity';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(StaffEntity, 'dbStaging')
    private readonly staffRepoStg: EntityRepository<StaffEntity>,
    @InjectRepository(GroupEntity, 'dbStaging')
    private readonly groupRepoStg: EntityRepository<GroupEntity>,
    @InjectRepository(StaffGroupEntity, 'dbStaging')
    private readonly staffGroupRepoStg: EntityRepository<StaffGroupEntity>,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async getAll() {
    try {
      const res = await this.staffRepoStg.find(
        {},
        {
          populate: ['staffGroups.GroupId'],
        },
      );

      return res;
    } catch (err) {
      console.log(err);
    }
  }
}
