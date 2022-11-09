import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import StaffGroupEntity from './staff-group.entity';

@Entity({ tableName: 'Groups' })
class GroupEntity {
  @PrimaryKey()
  id: string;

  @Property()
  name: string;

  @OneToMany(() => StaffGroupEntity, (staffGroup) => staffGroup.GroupId)
  staffGroups: Collection<StaffGroupEntity>;
}

export default GroupEntity;
