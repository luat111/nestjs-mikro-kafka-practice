import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import ProductEntity from './product.entity';

@Entity({ tableName: 'Categories' })
class CategoryEntity {
  @PrimaryKey()
  id: string;

  @Property()
  name: string;

  @Property()
  uri: string;

  @OneToMany(() => ProductEntity, (product: ProductEntity) => product.CategoryId)
  products: Collection<ProductEntity>;
}

export default CategoryEntity;