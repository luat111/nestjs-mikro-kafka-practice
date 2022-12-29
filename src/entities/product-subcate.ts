import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import ProductEntity from './product.entity';

@Entity({ tableName: 'ProductSubcategories' })
class ProductSubCateEntity {
  @PrimaryKey()
  id: string;

  @ManyToOne({
    entity: () => ProductEntity,
    inversedBy: 'subCates',
    joinColumn: 'ProductId',
    referenceColumnName: 'id',
  })
  ProductId: ProductEntity;

  @Property({ fieldName: 'SubCategoryId' })
  SubCategoryId: string;
}

export default ProductSubCateEntity;
