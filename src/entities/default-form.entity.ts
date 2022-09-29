import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
} from '@mikro-orm/core';
import SpecCategoryEntity from './spec-category.entity';
import SpecValueEntity from './spec-value.entity';
import SpecificationEntity from './specification.entity';

@Entity()
class DefaultFormEntity {
  @PrimaryKey()
  id: string;

  @ManyToMany(() => SpecValueEntity, (values) => values.defaultForms, {
    owner: true,
    cascade: [Cascade.ALL],
  })
  specValues: Collection<SpecValueEntity>;
  @ManyToMany(() => SpecificationEntity, (specs) => specs.defaultForms, {
    owner: true,
    cascade: [Cascade.ALL],
  })
  specs: Collection<SpecificationEntity>;
  @ManyToMany(() => SpecCategoryEntity, (cates) => cates.defaultForms, {
    owner: true,
    cascade: [Cascade.ALL],
  })
  specCates: Collection<SpecCategoryEntity>;
}

export default DefaultFormEntity;
