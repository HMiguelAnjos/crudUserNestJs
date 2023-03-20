import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://admin:admin@localhost:5672`],
      queue: 'sendEmail',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
