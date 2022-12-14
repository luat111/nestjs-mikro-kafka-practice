import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import DefaultFormEntity from './default-form.entity';
import ProductEntity from './product.entity';
import SpecCategoryEntity from './spec-category.entity';
import SpecValueEntity from './spec-value.entity';

@Entity()
class SpecificationEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property({ nullable: false, unique: true })
  name!: string;

  @Property({ nullable: true })
  url: string;

  @Property({ default: 0 })
  indexPos: number;

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
    onUpdate: () => new Date(),
    getter: true,
  })
  updatedAt!: Date;

  @ManyToOne(() => SpecCategoryEntity, {
    cascade: [Cascade.PERSIST],
    onDelete: 'set null',
    onUpdateIntegrity: 'set null',
    nullable: false,
  })
  cate: SpecCategoryEntity;

  @OneToMany(() => SpecValueEntity, (specValue) => specValue.specification, {
    cascade: [Cascade.ALL],
  })
  specValues: Collection<SpecValueEntity>;

  @ManyToMany(() => ProductEntity, (products) => products.specs, {
    cascade: [Cascade.PERSIST],
  })
  products: Collection<ProductEntity>;

  @ManyToMany(() => DefaultFormEntity, (form) => form.specs, {
    cascade: [Cascade.PERSIST],
  })
  defaultForms: Collection<DefaultFormEntity>;
}

export default SpecificationEntity;
