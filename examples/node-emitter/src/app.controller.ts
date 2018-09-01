import { Get, Controller, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectEventEmitter } from 'nest-emitter';
import { MyEventEmitter } from 'app.events';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectEventEmitter() private readonly emitter: MyEventEmitter,
  ) {}

  @Get()
  root(@Req() req): string {
    this.emitter.emit('notification', 'new req');
    this.emitter.emit('newRequest', req);
    return this.appService.root();
  }
}
