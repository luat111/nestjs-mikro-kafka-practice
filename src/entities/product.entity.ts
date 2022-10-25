import {
  Cascade,
  Collection,
  Entity,
  Filter,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import SpecCategoryEntity from './spec-category.entity';
import SpecValueEntity from './spec-value.entity';
import SpecificationEntity from './specification.entity';

@Entity({ tableName: 'Products' })
@Filter({
  name: 'getPublish',
  cond: () => ({
    publish: true,
  }),
  default: false,
})
class ProductEntity {
  @PrimaryKey()
  id: string;

  @Property({ nullable: false })
  name: string;

  @Property()
  publish: boolean;

  @ManyToMany(() => SpecValueEntity, (values) => values.products, {
    owner: true,
    cascade: [Cascade.PERSIST],
  })
  specValues: Collection<SpecValueEntity>;
  @ManyToMany(() => SpecificationEntity, (specs) => specs.products, {
    owner: true,
    cascade: [Cascade.PERSIST],
  })
  specs: Collection<SpecificationEntity>;
  @ManyToMany(() => SpecCategoryEntity, (cates) => cates.products, {
    owner: true,
    cascade: [Cascade.PERSIST],
  })
  specCates: Collection<SpecCategoryEntity>;
}

export default ProductEntity;
