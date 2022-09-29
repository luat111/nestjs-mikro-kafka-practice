import { Migration } from '@mikro-orm/migrations';

export class Migration20220928032129 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "default_form_entity" ("id" varchar(255) not null, constraint "default_form_entity_pkey" primary key ("id"));');

    this.addSql('create table "default_form_entity_spec_cates" ("default_form_entity_id" varchar(255) not null, "spec_category_entity_id" uuid not null, constraint "default_form_entity_spec_cates_pkey" primary key ("default_form_entity_id", "spec_category_entity_id"));');

    this.addSql('create table "default_form_entity_specs" ("default_form_entity_id" varchar(255) not null, "specification_entity_id" uuid not null, constraint "default_form_entity_specs_pkey" primary key ("default_form_entity_id", "specification_entity_id"));');

    this.addSql('create table "default_form_entity_spec_values" ("default_form_entity_id" varchar(255) not null, "spec_value_entity_id" uuid not null, constraint "default_form_entity_spec_values_pkey" primary key ("default_form_entity_id", "spec_value_entity_id"));');

    this.addSql('alter table "default_form_entity_spec_cates" add constraint "default_form_entity_spec_cates_default_form_entity_id_foreign" foreign key ("default_form_entity_id") references "default_form_entity" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "default_form_entity_spec_cates" add constraint "default_form_entity_spec_cates_spec_category_entity_id_foreign" foreign key ("spec_category_entity_id") references "spec_category_entity" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "default_form_entity_specs" add constraint "default_form_entity_specs_default_form_entity_id_foreign" foreign key ("default_form_entity_id") references "default_form_entity" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "default_form_entity_specs" add constraint "default_form_entity_specs_specification_entity_id_foreign" foreign key ("specification_entity_id") references "specification_entity" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "default_form_entity_spec_values" add constraint "default_form_entity_spec_values_default_form_entity_id_foreign" foreign key ("default_form_entity_id") references "default_form_entity" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "default_form_entity_spec_values" add constraint "default_form_entity_spec_values_spec_value_entity_id_foreign" foreign key ("spec_value_entity_id") references "spec_value_entity" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "default_form_entity_spec_cates" drop constraint "default_form_entity_spec_cates_default_form_entity_id_foreign";');

    this.addSql('alter table "default_form_entity_specs" drop constraint "default_form_entity_specs_default_form_entity_id_foreign";');

    this.addSql('alter table "default_form_entity_spec_values" drop constraint "default_form_entity_spec_values_default_form_entity_id_foreign";');

    this.addSql('drop table if exists "default_form_entity" cascade;');

    this.addSql('drop table if exists "default_form_entity_spec_cates" cascade;');

    this.addSql('drop table if exists "default_form_entity_specs" cascade;');

    this.addSql('drop table if exists "default_form_entity_spec_values" cascade;');
  }

}
