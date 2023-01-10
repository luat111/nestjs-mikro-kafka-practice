import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import DefaultFormEntity from './default-form.entity';
import ProductEntity from './product.entity';
import SpecificationEntity from './specification.entity';

@Entity()
class SpecCategoryEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property({ nullable: false, unique: true })
  name!: string;

  @Property({ nullable: true })
  url: string;

  @Property({ default: 0 })
  indexPos: number;

  @Property({ nullable: false, default: false })
  isAdvanced!: boolean;

  @Property({ nullable: false, default: false })
  hidden!: boolean;

  @Property({ nullable: false, default: false })
  isFilter!: boolean;

  @Property({
    columnType: 'timestamp',
    defaultRaw: `current_timestamp`,
    getter: true,
  })
  createdAt!: Date;

  @Property({
    columnType: 'timestamp',
    defaultRaw: 'current_timestamp',
    getter: true,
    onUpdate: () => new Date(),
  })
  updatedAt!: Date;

  @OneToMany(() => SpecificationEntity, (spec) => spec.cate, {
    cascade: [Cascade.ALL],
  })
  specs: Collection<SpecificationEntity>;

  @ManyToMany(() => ProductEntity, (products) => products.specCates, {
    cascade: [Cascade.PERSIST],
  })
  products: Collection<ProductEntity>;

  @ManyToMany(() => DefaultFormEntity, (form) => form.specCates, {
    cascade: [Cascade.PERSIST],
  })
  defaultForms: Collection<DefaultFormEntity>;
}

export default SpecCategoryEntity;
