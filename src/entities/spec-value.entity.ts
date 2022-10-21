import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import DefaultFormEntity from './default-form.entity';
import ProductEntity from './product.entity';
import SpecificationEntity from './specification.entity';

@Entity()
class SpecValueEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property({ nullable: false, unique: true })
  name: string;

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

  @ManyToOne(() => SpecificationEntity, {
    cascade: [Cascade.PERSIST],
    onDelete: 'set null',
    nullable: false,
  })
  specification: SpecificationEntity;

  @ManyToMany(() => ProductEntity, (products) => products.specValues, {
    cascade: [Cascade.PERSIST],
  })
  products: Collection<ProductEntity>;

  @ManyToMany(() => DefaultFormEntity, (form) => form.specValues, {
    cascade: [Cascade.PERSIST],
  })
  defaultForms: Collection<DefaultFormEntity>;
}

export default SpecValueEntity;
