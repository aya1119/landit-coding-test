import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Frontend(Next.js)からのアクセス許可
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3002",
    ],
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 3001);
	
  await app.listen(port);

  console.log(`🚀 API running on http://localhost:${port}`);
}

bootstrap();
