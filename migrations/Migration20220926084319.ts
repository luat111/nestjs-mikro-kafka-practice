import { Migration } from '@mikro-orm/migrations';

export class Migration20220926084319 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "specification_entity" alter column "cate_id" drop default;');
    this.addSql('alter table "specification_entity" alter column "cate_id" type uuid using ("cate_id"::text::uuid);');
    this.addSql('alter table "specification_entity" alter column "cate_id" set not null;');

    this.addSql('alter table "spec_value_entity" alter column "specification_id" drop default;');
    this.addSql('alter table "spec_value_entity" alter column "specification_id" type uuid using ("specification_id"::text::uuid);');
    this.addSql('alter table "spec_value_entity" alter column "specification_id" set not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "specification_entity" alter column "cate_id" drop default;');
    this.addSql('alter table "specification_entity" alter column "cate_id" type uuid using ("cate_id"::text::uuid);');
    this.addSql('alter table "specification_entity" alter column "cate_id" drop not null;');

    this.addSql('alter table "spec_value_entity" alter column "specification_id" drop default;');
    this.addSql('alter table "spec_value_entity" alter column "specification_id" type uuid using ("specification_id"::text::uuid);');
    this.addSql('alter table "spec_value_entity" alter column "specification_id" drop not null;');
  }

}
