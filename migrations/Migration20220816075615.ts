import { Migration } from '@mikro-orm/migrations';

export class Migration20220816075615 extends Migration {

  async up(): Promise<void> {
    
    this.addSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    this.addSql('create table "Products" ("id" varchar(255) not null, "publish" boolean not null, constraint "Products_pkey" primary key ("id"));');

    this.addSql('create table "spec_category_entity" ("id" uuid not null default uuid_generate_v4(), "name" varchar(255) not null, "is_advanced" boolean not null default false, "created_at" timestamp not null default current_timestamp, "updated_at" timestamp not null default current_timestamp, constraint "spec_category_entity_pkey" primary key ("id"));');
    this.addSql('alter table "spec_category_entity" add constraint "spec_category_entity_name_unique" unique ("name");');

    this.addSql('create table "products_spec_cates" ("product_entity_id" varchar(255) not null, "spec_category_entity_id" uuid not null, constraint "products_spec_cates_pkey" primary key ("product_entity_id", "spec_category_entity_id"));');

    this.addSql('create table "specification_entity" ("id" uuid not null default uuid_generate_v4(), "name" varchar(255) not null, "created_at" timestamp not null default current_timestamp, "updated_at" timestamp not null default current_timestamp, "cate_id" uuid not null, constraint "specification_entity_pkey" primary key ("id"));');

    this.addSql('create table "products_specs" ("product_entity_id" varchar(255) not null, "specification_entity_id" uuid not null, constraint "products_specs_pkey" primary key ("product_entity_id", "specification_entity_id"));');

    this.addSql('create table "spec_value_entity" ("id" uuid not null default uuid_generate_v4(), "name" varchar(255) not null, "created_at" timestamp not null default current_timestamp, "updated_at" timestamp not null default current_timestamp, "specificaiton_id" uuid not null, constraint "spec_value_entity_pkey" primary key ("id"));');

    this.addSql('create table "products_spec_values" ("product_entity_id" varchar(255) not null, "spec_value_entity_id" uuid not null, constraint "products_spec_values_pkey" primary key ("product_entity_id", "spec_value_entity_id"));');

    this.addSql('alter table "products_spec_cates" add constraint "products_spec_cates_product_entity_id_foreign" foreign key ("product_entity_id") references "Products" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "products_spec_cates" add constraint "products_spec_cates_spec_category_entity_id_foreign" foreign key ("spec_category_entity_id") references "spec_category_entity" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "specification_entity" add constraint "specification_entity_cate_id_foreign" foreign key ("cate_id") references "spec_category_entity" ("id") on update cascade;');

    this.addSql('alter table "products_specs" add constraint "products_specs_product_entity_id_foreign" foreign key ("product_entity_id") references "Products" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "products_specs" add constraint "products_specs_specification_entity_id_foreign" foreign key ("specification_entity_id") references "specification_entity" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "spec_value_entity" add constraint "spec_value_entity_specificaiton_id_foreign" foreign key ("specificaiton_id") references "specification_entity" ("id") on update cascade;');

    this.addSql('alter table "products_spec_values" add constraint "products_spec_values_product_entity_id_foreign" foreign key ("product_entity_id") references "Products" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "products_spec_values" add constraint "products_spec_values_spec_value_entity_id_foreign" foreign key ("spec_value_entity_id") references "spec_value_entity" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "products_spec_cates" drop constraint "products_spec_cates_product_entity_id_foreign";');

    this.addSql('alter table "products_specs" drop constraint "products_specs_product_entity_id_foreign";');

    this.addSql('alter table "products_spec_values" drop constraint "products_spec_values_product_entity_id_foreign";');

    this.addSql('alter table "products_spec_cates" drop constraint "products_spec_cates_spec_category_entity_id_foreign";');

    this.addSql('alter table "specification_entity" drop constraint "specification_entity_cate_id_foreign";');

    this.addSql('alter table "products_specs" drop constraint "products_specs_specification_entity_id_foreign";');

    this.addSql('alter table "spec_value_entity" drop constraint "spec_value_entity_specificaiton_id_foreign";');

    this.addSql('alter table "products_spec_values" drop constraint "products_spec_values_spec_value_entity_id_foreign";');

    this.addSql('drop table if exists "Products" cascade;');

    this.addSql('drop table if exists "spec_category_entity" cascade;');

    this.addSql('drop table if exists "products_spec_cates" cascade;');

    this.addSql('drop table if exists "specification_entity" cascade;');

    this.addSql('drop table if exists "products_specs" cascade;');

    this.addSql('drop table if exists "spec_value_entity" cascade;');

    this.addSql('drop table if exists "products_spec_values" cascade;');
  }

}
