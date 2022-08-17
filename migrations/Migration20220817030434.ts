import { Migration } from '@mikro-orm/migrations';

export class Migration20220817030434 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "specification_entity" drop constraint "specification_entity_cate_id_foreign";');

    this.addSql('alter table "spec_value_entity" drop constraint "spec_value_entity_specificaiton_id_foreign";');

    this.addSql('alter table "specification_entity" alter column "cate_id" drop default;');
    this.addSql('alter table "specification_entity" alter column "cate_id" type uuid using ("cate_id"::text::uuid);');
    this.addSql('alter table "specification_entity" alter column "cate_id" drop not null;');
    this.addSql('alter table "specification_entity" add constraint "specification_entity_cate_id_foreign" foreign key ("cate_id") references "spec_category_entity" ("id") on update set null on delete cascade;');

    this.addSql('alter table "spec_value_entity" alter column "specificaiton_id" drop default;');
    this.addSql('alter table "spec_value_entity" alter column "specificaiton_id" type uuid using ("specificaiton_id"::text::uuid);');
    this.addSql('alter table "spec_value_entity" alter column "specificaiton_id" drop not null;');
    this.addSql('alter table "spec_value_entity" add constraint "spec_value_entity_specificaiton_id_foreign" foreign key ("specificaiton_id") references "specification_entity" ("id") on update set null on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "specification_entity" drop constraint "specification_entity_cate_id_foreign";');

    this.addSql('alter table "spec_value_entity" drop constraint "spec_value_entity_specificaiton_id_foreign";');

    this.addSql('alter table "specification_entity" alter column "cate_id" drop default;');
    this.addSql('alter table "specification_entity" alter column "cate_id" type uuid using ("cate_id"::text::uuid);');
    this.addSql('alter table "specification_entity" alter column "cate_id" set not null;');
    this.addSql('alter table "specification_entity" add constraint "specification_entity_cate_id_foreign" foreign key ("cate_id") references "spec_category_entity" ("id") on update cascade;');

    this.addSql('alter table "spec_value_entity" alter column "specificaiton_id" drop default;');
    this.addSql('alter table "spec_value_entity" alter column "specificaiton_id" type uuid using ("specificaiton_id"::text::uuid);');
    this.addSql('alter table "spec_value_entity" alter column "specificaiton_id" set not null;');
    this.addSql('alter table "spec_value_entity" add constraint "spec_value_entity_specificaiton_id_foreign" foreign key ("specificaiton_id") references "specification_entity" ("id") on update cascade;');
  }

}
