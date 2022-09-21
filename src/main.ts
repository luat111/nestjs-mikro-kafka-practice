import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swagger = new DocumentBuilder()
    .setTitle('Product Spec')
    .setDescription('Product specs API description')
    .setVersion('1.0')
    .addTag('Specs')
    .build();

  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('swagger', app, document);

  const config: ConfigService = app.get(ConfigService);
  await app.listen(config.get<number>('port'));
}
bootstrap();
