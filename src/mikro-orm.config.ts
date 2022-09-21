import { Options } from '@mikro-orm/core';

import configurations from './config/configurations';
import ProductEntity from './entities/product.entity';
import SpecificationEntity from './entities/spec.entity';
import CategorySpecificationEntity from './entities/spec_category.entity';
import SpecificationValueEntity from './entities/spec_value.entity';

const config = configurations().dbLocal;

const MikroOrmConfig: Options = {
  entities: [
    ProductEntity,
    SpecificationEntity,
    SpecificationValueEntity,
    CategorySpecificationEntity,
  ],
  type: 'postgresql',
  dbName: config['DB_DATABASE_LOCAL'],
  user: config['DB_USERNAME_LOCAL'],
  password: config['DB_PASSWORD_LOCAL'],
  host: config['DB_HOST_LOCAL'],
  port: Number(config['DB_PORT_LOCAL']),
};

export default MikroOrmConfig;
