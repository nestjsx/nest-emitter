import { Module, DynamicModule, Global, Provider } from '@nestjs/common';
import { EVENT_EMITTER_TOKEN } from './constants';
import { StrictEventEmitter } from './strong-emitter';
@Global()
@Module({})
export class NestEmitterModule {
  public static forRoot<TEventRecord, TEmitRecord = TEventRecord>(
    emitter: NodeJS.Events,
  ): DynamicModule {
    // FIXME: fix the types errors here !
    const instance: StrictEventEmitter<NodeJS.Events, TEventRecord, TEmitRecord> = emitter;
    const providers: Provider[] = [{ provide: EVENT_EMITTER_TOKEN, useValue: instance }];
    return { module: NestEmitterModule, components: providers, exports: providers };
  }
}
