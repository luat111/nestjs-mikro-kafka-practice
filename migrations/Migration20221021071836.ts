import { Migration } from '@mikro-orm/migrations';

export class Migration20221021071836 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "specification_entity" drop constraint "specification_entity_cate_id_foreign";');

    this.addSql('alter table "spec_value_entity" drop constraint "spec_value_entity_specification_id_foreign";');

    this.addSql('alter table "specification_entity" add constraint "specification_entity_cate_id_foreign" foreign key ("cate_id") references "spec_category_entity" ("id") on update set null on delete set null;');

    this.addSql('alter table "spec_value_entity" add constraint "spec_value_entity_specification_id_foreign" foreign key ("specification_id") references "specification_entity" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "specification_entity" drop constraint "specification_entity_cate_id_foreign";');

    this.addSql('alter table "spec_value_entity" drop constraint "spec_value_entity_specification_id_foreign";');

    this.addSql('alter table "specification_entity" add constraint "specification_entity_cate_id_foreign" foreign key ("cate_id") references "spec_category_entity" ("id") on update set null on delete cascade;');

    this.addSql('alter table "spec_value_entity" add constraint "spec_value_entity_specification_id_foreign" foreign key ("specification_id") references "specification_entity" ("id") on update set null on delete cascade;');
  }

}
