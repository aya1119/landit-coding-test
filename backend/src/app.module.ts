import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpotModule } from './spot/spot.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
 ConfigModule.forRoot({
      isGlobal: true,
    }),   

    TypeOrmModule.forRoot({
      
      type: 'postgres',
　　　host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASS ?? 'postgres',
      database: process.env.DB_NAME ?? 'landit',
      autoLoadEntities: true,
      synchronize: true,
    }),
    SpotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

