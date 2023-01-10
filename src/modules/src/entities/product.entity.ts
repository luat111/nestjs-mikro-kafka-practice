import {
  Cascade,
  Collection,
  Entity,
  Filter,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import CategoryEntity from './categories';
import ProductSubCateEntity from './product-subcate';
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

  @Property({ nullable: true })
  uri: string;

  @Property()
  publish: boolean;

  @Property({ fieldName: 'salePrice', nullable: true })
  salePrice: number;

  @Property({ nullable: true, fieldName: 'productPhoto' })
  productPhoto: string;

  @ManyToOne({
    entity: () => CategoryEntity,
    inversedBy: 'products',
    joinColumn: 'CategoryId',
    referenceColumnName: 'id',
    nullable: true,
  })
  CategoryId: CategoryEntity;

  @OneToMany(() => ProductSubCateEntity, (e) => e.ProductId)
  subCates: Collection<ProductSubCateEntity>;

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
