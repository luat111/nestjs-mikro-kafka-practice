import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import ProductEntity from './product.entity';
import SpecificationEntity from './spec.entity';

@Entity({ tableName: 'SpecificationValues' })
class SpecificationValueEntity {
  @PrimaryKey()
  id: string;

  @Property()
  name: string;

  @ManyToOne(() => SpecificationEntity)
  specificaiton: SpecificationEntity;

  @ManyToMany(() => ProductEntity, (products) => products.specValues )
  products: Collection<ProductEntity>;
}

export default SpecificationValueEntity;
