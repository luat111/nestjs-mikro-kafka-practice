import { Migration } from '@mikro-orm/migrations';

export class Migration20220816032242 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "products_spec_cates" ("product_entity_id" varchar(255) not null, "category_specification_entity_id" varchar(255) not null, constraint "products_spec_cates_pkey" primary key ("product_entity_id", "category_specification_entity_id"));');

    this.addSql('create table "products_specs" ("product_entity_id" varchar(255) not null, "specification_entity_id" varchar(255) not null, constraint "products_specs_pkey" primary key ("product_entity_id", "specification_entity_id"));');

    this.addSql('create table "products_spec_values" ("product_entity_id" varchar(255) not null, "specification_value_entity_id" varchar(255) not null, constraint "products_spec_values_pkey" primary key ("product_entity_id", "specification_value_entity_id"));');

    this.addSql('alter table "products_spec_cates" add constraint "products_spec_cates_product_entity_id_foreign" foreign key ("product_entity_id") references "Products" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "products_spec_cates" add constraint "products_spec_cates_category_specification_entity_id_foreign" foreign key ("category_specification_entity_id") references "CategorySpecification" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "products_specs" add constraint "products_specs_product_entity_id_foreign" foreign key ("product_entity_id") references "Products" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "products_specs" add constraint "products_specs_specification_entity_id_foreign" foreign key ("specification_entity_id") references "Specifications" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "products_spec_values" add constraint "products_spec_values_product_entity_id_foreign" foreign key ("product_entity_id") references "Products" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "products_spec_values" add constraint "products_spec_values_specification_value_entity_id_foreign" foreign key ("specification_value_entity_id") references "SpecificationValues" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "products_spec_cates" cascade;');

    this.addSql('drop table if exists "products_specs" cascade;');

    this.addSql('drop table if exists "products_spec_values" cascade;');
  }

}
