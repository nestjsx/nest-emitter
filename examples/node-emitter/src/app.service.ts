import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { MyEventEmitter } from 'app.events';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@InjectEventEmitter() private readonly emitter: MyEventEmitter) {}
  onModuleInit() {
    this.emitter.on(
      'notification',
      async msg => await this.onNotification(msg),
    );
    this.emitter.on('newRequest', async req => await this.onRequest(req));
  }
  root(): string {
    return 'Hello World!';
  }

  private async onNotification(msg: string) {
    console.log(`OnNotification: ${msg}`);
  }

  private async onRequest(req: Express.Request) {
    console.log(`OnRequest from: ${req['ip']}`);
  }
}
