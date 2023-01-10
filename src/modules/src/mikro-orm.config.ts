import { Options } from '@mikro-orm/core';

import configurations from './config/configurations';
import CategoryEntity from './entities/categories';
import DefaultFormEntity from './entities/default-form.entity';
import GroupEntity from './entities/group.entity';
import ProductSubCateEntity from './entities/product-subcate';
import ProductEntity from './entities/product.entity';
import SpecCategoryEntity from './entities/spec-category.entity';
import SpecValueEntity from './entities/spec-value.entity';
import SpecificationEntity from './entities/specification.entity';
import StaffGroupEntity from './entities/staff-group.entity';
import StaffEntity from './entities/staff.entity';

const config = configurations().dbLocal;

const MikroOrmConfig: Options = {
  entities: [
    ProductEntity,
    SpecificationEntity,
    SpecCategoryEntity,
    SpecValueEntity,
    DefaultFormEntity,
    ProductSubCateEntity,
    StaffEntity,
    StaffGroupEntity,
    CategoryEntity,
    GroupEntity
  ],
  type: 'postgresql',
  dbName: config['DB_DATABASE_LOCAL'],
  user: config['DB_USERNAME_LOCAL'],
  password: config['DB_PASSWORD_LOCAL'],
  host: config['DB_HOST_LOCAL'],
  port: Number(config['DB_PORT_LOCAL']),
};

export default MikroOrmConfig;
