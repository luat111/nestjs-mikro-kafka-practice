import { Migration } from '@mikro-orm/migrations';

export class Migration20220817092428 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "spec_category_entity" add column "hidden" boolean not null default false, add column "is_filter" boolean not null default false;');

    this.addSql('alter table "specification_entity" add column "is_filter" boolean not null default false;');

    this.addSql('alter table "spec_value_entity" add column "is_filter" boolean not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "spec_category_entity" drop column "hidden";');
    this.addSql('alter table "spec_category_entity" drop column "is_filter";');

    this.addSql('alter table "specification_entity" drop column "is_filter";');

    this.addSql('alter table "spec_value_entity" drop column "is_filter";');
  }

}
