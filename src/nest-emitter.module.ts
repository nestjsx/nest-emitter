import { Module, DynamicModule, Global, Provider } from '@nestjs/common';
import { EVENT_EMITTER_TOKEN } from './constants';
type NestEmitter = NodeJS.Events;
@Global()
@Module({})
export class NestEmitterModule {
  public static forRoot(emitter: NestEmitter): DynamicModule {
    const providers: Provider[] = [{ provide: EVENT_EMITTER_TOKEN, useValue: emitter }];
    return { module: NestEmitterModule, providers, exports: providers };
  }
}
