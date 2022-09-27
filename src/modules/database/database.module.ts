import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      contextName: 'dbStaging',
      useFactory: (configService: ConfigService) => ({
        dbName: configService.get<string>('db.DB_DATABASE'),
        user: configService.get<string>('db.DB_USERNAME'),
        password: configService.get<string>('db.DB_PASSWORD'),
        host: configService.get<string>('db.DB_HOST'),
        port: configService.get<number>('db.DB_PORT'),
        type: 'postgresql',
        autoLoadEntities: true,
        allowGlobalContext: true,
        registerRequestContext: false,
      }),
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      contextName: 'dbLocal',
      useFactory: (configService: ConfigService) => ({
        dbName: configService.get<string>('dbLocal.DB_DATABASE_LOCAL'),
        user: configService.get<string>('dbLocal.DB_USERNAME_LOCAL'),
        password: configService.get<string>('dbLocal.DB_PASSWORD_LOCAL'),
        host: configService.get<string>('dbLocal.DB_HOST_LOCAL'),
        port: configService.get<number>('dbLocal.DB_PORT_LOCAL'),
        type: 'postgresql',
        autoLoadEntities: true,
        allowGlobalContext: true,
        registerRequestContext: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
