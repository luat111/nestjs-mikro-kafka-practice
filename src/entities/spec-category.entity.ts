import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import ProductEntity from './product.entity';
import SpecificationEntity from './specification.entity';

@Entity()
class SpecCategoryEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property({ nullable: false, unique: true })
  name!: string;

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
    extra: 'on update current_timestamp',
    getter: true,
  })
  updatedAt!: Date;

  @OneToMany(() => SpecificationEntity, (spec) => spec.cate, {
    cascade: [Cascade.ALL],
  })
  specs: Collection<SpecificationEntity>;

  @ManyToMany(() => ProductEntity, (products) => products.specCates, {
    cascade: [Cascade.ALL],
  })
  products: Collection<ProductEntity>;
}

export default SpecCategoryEntity;
