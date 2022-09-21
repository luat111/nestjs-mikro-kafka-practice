import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import ProductEntity from './product.entity';
import SpecificationEntity from './spec.entity';

@Entity({ tableName: 'CategorySpecification' })
class CategorySpecificationEntity {
  @PrimaryKey()
  id: string;

  @Property()
  name: string;

  @OneToMany(() => SpecificationEntity, (spec) => spec.cate, {
    orphanRemoval: true,
  })
  specs: Collection<SpecificationEntity>;

  @ManyToMany(() => ProductEntity, (products) => products.specCates)
  products: Collection<ProductEntity>;
}

export default CategorySpecificationEntity;
