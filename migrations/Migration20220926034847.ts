import { Migration } from '@mikro-orm/migrations';

export class Migration20220926034847 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "spec_value_entity" drop constraint "spec_value_entity_specificaiton_id_foreign";');

    this.addSql('alter table "spec_value_entity" rename column "specificaiton_id" to "specification_id";');
    this.addSql('alter table "spec_value_entity" add constraint "spec_value_entity_specification_id_foreign" foreign key ("specification_id") references "specification_entity" ("id") on update set null on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "spec_value_entity" drop constraint "spec_value_entity_specification_id_foreign";');

    this.addSql('alter table "spec_value_entity" rename column "specification_id" to "specificaiton_id";');
    this.addSql('alter table "spec_value_entity" add constraint "spec_value_entity_specificaiton_id_foreign" foreign key ("specificaiton_id") references "specification_entity" ("id") on update set null on delete cascade;');
  }

}
