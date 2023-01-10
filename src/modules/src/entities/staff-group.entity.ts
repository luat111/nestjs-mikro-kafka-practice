import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import GroupEntity from './group.entity';
import StaffEntity from './staff.entity';

@Entity({ tableName: 'StaffGroups' })
class StaffGroupEntity {
  @PrimaryKey()
  id: string;

  @ManyToOne({
    entity: () => StaffEntity,
    inversedBy: 'staffGroups',
    joinColumn: 'StaffId',
    referenceColumnName: 'id',
  })
  StaffId: StaffEntity;

  @ManyToOne({
    entity: () => GroupEntity,
    inversedBy: 'staffGroups',
    joinColumn: 'GroupId',
    referenceColumnName: 'id',
  })
  GroupId: GroupEntity;
}

export default StaffGroupEntity;
