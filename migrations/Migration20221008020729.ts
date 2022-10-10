import { Migration } from '@mikro-orm/migrations';

export class Migration20221008020729 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Products" drop constraint "Products_name_unique";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Products" add constraint "Products_name_unique" unique ("name");');
  }

}
