import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
        origin:  ['http://localhost:4200', 'https://app.svandis.io']});
  await app.listen(3000);
}
bootstrap();
