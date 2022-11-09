import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import StaffGroupEntity from './staff-group.entity';

@Entity({ tableName: 'Staffs' })
class StaffEntity {
  @PrimaryKey()
  id: string;

  @Property()
  username: string;

  @Property()
  password: string;

  @Property()
  role: string;

  @Property()
  email: string;

  @OneToMany(() => StaffGroupEntity, (staffGroup) => staffGroup.StaffId)
  staffGroups: Collection<StaffGroupEntity>;
}

export default StaffEntity;
