import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import ProductEntity from './product.entity';
import SpecificationEntity from './specification.entity';

@Entity()
class SpecValueEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property({ nullable: false })
  name: string;

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

  @ManyToOne(() => SpecificationEntity, {
    cascade: [Cascade.ALL],
    onUpdateIntegrity: 'set null',
    onDelete: 'cascade',
  })
  specificaiton: SpecificationEntity;

  @ManyToMany(() => ProductEntity, (products) => products.specValues, {
    cascade: [Cascade.ALL],
  })
  products: Collection<ProductEntity>;
}

export default SpecValueEntity;
