import {
  Collection,
  Entity,
  Filter,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import SpecificationEntity from './spec.entity';
import CategorySpecificationEntity from './spec_category.entity';
import SpecificationValueEntity from './spec_value.entity';

@Entity({ tableName: 'Products' })
@Filter({
  name: 'getPublish',
  cond: () => ({
    publish: true,
  }),
  default: true,
})
class ProductEntity {
  @PrimaryKey()
  id: string;

  @Property()
  publish: boolean;

  @ManyToMany(() => SpecificationValueEntity, (values) => values.products, {
    owner: true,
  })
  specValues: Collection<SpecificationValueEntity>;
  @ManyToMany(() => SpecificationEntity, (specs) => specs.products, {
    owner: true,
  })
  specs: Collection<SpecificationEntity>;
  @ManyToMany(() => CategorySpecificationEntity, (cates) => cates.products, {
    owner: true,
  })
  specCates: Collection<CategorySpecificationEntity>;
}

export default ProductEntity;
