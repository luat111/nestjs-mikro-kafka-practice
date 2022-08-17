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
import ProductEntity from './product.entity';
import SpecCategoryEntity from './spec-category.entity';
import SpecValueEntity from './spec-value.entity';

@Entity()
class SpecificationEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property({ nullable: false })
  name!: string;

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

  @ManyToOne(() => SpecCategoryEntity, {
    cascade: [Cascade.ALL],
    onDelete: 'cascade',
    onUpdateIntegrity: 'set null',
  })
  cate: SpecCategoryEntity;

  @OneToMany(() => SpecValueEntity, (specValue) => specValue.specificaiton, {
    cascade: [Cascade.ALL],
  })
  specValues: Collection<SpecValueEntity>;

  @ManyToMany(() => ProductEntity, (products) => products.specs, {
    cascade: [Cascade.ALL],
  })
  products: Collection<ProductEntity>;
}

export default SpecificationEntity;
