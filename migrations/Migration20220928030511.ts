import { Migration } from '@mikro-orm/migrations';

export class Migration20220928030511 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "spec_category_entity" add column "url" varchar(255) null, add column "index_pos" int not null default 0;');
    this.addSql('alter table "spec_category_entity" alter column "updated_at" type timestamp using ("updated_at"::timestamp);');

    this.addSql('alter table "specification_entity" add column "url" varchar(255) null, add column "index_pos" int not null default 0;');
    this.addSql('alter table "specification_entity" alter column "updated_at" type timestamp using ("updated_at"::timestamp);');
    this.addSql('alter table "specification_entity" add constraint "specification_entity_name_unique" unique ("name");');

    this.addSql('alter table "spec_value_entity" add column "url" varchar(255) null, add column "index_pos" int not null default 0;');
    this.addSql('alter table "spec_value_entity" alter column "updated_at" type timestamp using ("updated_at"::timestamp);');
    this.addSql('alter table "spec_value_entity" add constraint "spec_value_entity_name_unique" unique ("name");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "spec_category_entity" alter column "updated_at" type timestamp using ("updated_at"::timestamp);');
    this.addSql('alter table "spec_category_entity" drop column "url";');
    this.addSql('alter table "spec_category_entity" drop column "index_pos";');

    this.addSql('alter table "spec_value_entity" alter column "updated_at" type timestamp using ("updated_at"::timestamp);');
    this.addSql('alter table "spec_value_entity" drop constraint "spec_value_entity_name_unique";');
    this.addSql('alter table "spec_value_entity" drop column "url";');
    this.addSql('alter table "spec_value_entity" drop column "index_pos";');

    this.addSql('alter table "specification_entity" alter column "updated_at" type timestamp using ("updated_at"::timestamp);');
    this.addSql('alter table "specification_entity" drop constraint "specification_entity_name_unique";');
    this.addSql('alter table "specification_entity" drop column "url";');
    this.addSql('alter table "specification_entity" drop column "index_pos";');
  }

}
