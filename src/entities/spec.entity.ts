import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import ProductEntity from './product.entity';
import CategorySpecificationEntity from './spec_category.entity';
import SpecificationValueEntity from './spec_value.entity';

@Entity({ tableName: 'Specifications' })
class SpecificationEntity {
  @PrimaryKey()
  id: string;

  @Property()
  name: string;

  @ManyToOne(() => CategorySpecificationEntity)
  cate: CategorySpecificationEntity;

  @OneToMany(
    () => SpecificationValueEntity,
    (specValue) => specValue.specificaiton,
    { orphanRemoval: true },
  )
  specValues: Collection<SpecificationValueEntity>;

  @ManyToMany(() => ProductEntity, (products) => products.specs)
  products: Collection<ProductEntity>;
}

export default SpecificationEntity;
