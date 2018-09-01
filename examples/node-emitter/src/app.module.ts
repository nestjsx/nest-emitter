import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestEmitterModule } from "nest-emitter";
import { EventEmitter } from 'events';
@Module({
  imports: [NestEmitterModule.forRoot(new EventEmitter)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
