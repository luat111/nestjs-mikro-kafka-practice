import { MikroORM } from '@mikro-orm/core';
import { InjectMikroORM, InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import BadRequest from 'src/core/exceptions/bad-request.exception';
import NotFoundRecord from 'src/core/exceptions/not-found.exception';
import StaffEntity from 'src/entities/staff.entity';
import { comparePasswords } from 'src/utils/bcrypt';
import { LoggerService } from '../logger/logger.service';
import { IStaff } from './interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectMikroORM('dbStaging')
    private readonly orm: MikroORM,
    @InjectRepository(StaffEntity, 'dbStaging')
    private readonly staffRepoStg: EntityRepository<StaffEntity>,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async findByUserName(username: string): Promise<IStaff> {
    try {
      const staff = await this.staffRepoStg.findOne(
        { username: username },
        {
          populate: ['staffGroups.GroupId'],
        },
      );

      if (!staff) throw new NotFoundRecord(username);

      return staff;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequest(AuthService.name, err);
    } finally {
      this.orm.em.clear();
    }
  }

  async validateUser(username: string, pass: string): Promise<IStaff | null> {
    const staff = await this.findByUserName(username);
    const isCorrectPassword = comparePasswords(pass, staff?.password || '');

    if (staff && isCorrectPassword) return staff;

    return null;
  }

  getAccessToken(username: string, staffId: string): string {
    return this.jwtService.sign(
      { username, staffId },
      {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<number>('jwt.expire'),
      },
    );
  }
}
