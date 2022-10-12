import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import SpecCategoryEntity from './spec-category.entity';
import SpecValueEntity from './spec-value.entity';
import SpecificationEntity from './specification.entity';

@Entity()
class DefaultFormEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Property({ nullable: false, unique: true })
  name!: string;

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
