import { Migration } from '@mikro-orm/migrations';

export class Migration20221123064554 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Products" add column "uri" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Products" drop column "uri";');
  }

}
