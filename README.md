# Nest Emitter

Strongly 💪🏼 Typed Eventemitter Module For [Nestjs](https://github.com/nestjs/nest) Framework 🦁

## Quick Overview

Never wondered if there is a way to have a strongly typed way to use event emitter names ?

Never wondered why your event emitter not working as intended and then realized that there
was a typo on your events name ? if so, then this ones for you :smile: .

## How ?

By Declaring events using a simple interface mapping event names to their payloads to get stricter versions of `emit`, `on`, and other common EventEmitter APIs.

and not only that, it will work with any kind of `EventEmitter` that implements [`NodeJS.Events`](https://nodejs.org/api/events.html).

## Install

#### IMPORTANT: you will need typescript 3.0+

```bash
npm install nest-emitter
```
or 

```bash
yarn add nest-emitter
```

## Usage

As Normal Import `NestEmitterModule` into your root module _(aka `AppModule`)_

the `NestEmitterModule#forRoot(emitter: NodeJS.Events)` takes any event emitter that that implements `NodeJS.Events`.

for simplicity i will use nodejs built-in eventemitter, but of course you can use what you need.

```ts
// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';
@Module({
  imports: [NestEmitterModule.forRoot(new EventEmitter())],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

now it's time to define our events, let's add two events
one called `notification` and it's payload will be a string.
and another one is `newRequest` and it's payload will be function that has one arg of type `Request`.

```ts
// app.events.ts
interface AppEvents {
  notification: string;
  // as a side note: that is equivalent to
  // newRequest: Express.Request;
  newRequest: (req: Express.Request) => void;
}
```

after that let's bring up our secret weapon; the `StrictEventEmitter`

```ts
// app.events.ts
import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'nest-emitter';

interface AppEvents {
  notification: string;
  newRequest: (req: Express.Request) => void;
}

export type MyEventEmitter = StrictEventEmitter<EventEmitter, AppEvents>;
```

good good, now let's use it.

> :+1: TIP: Keep all of your events in a separate file like `{prefix}.events.ts`

i will use it to send a notificaion when we got a request

```ts
// app.controller.ts

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
  root(@Req() req: Express.Request): string {
    this.emitter.emit('notification', 'new req');
    // this will throw an error at compile-time
    // as `notification` event only accepts `string`
    // this.emitter.emit('notification', 1234);
    this.emitter.emit('newRequest', req);
    return this.appService.root();
  }
}
```

did you notic `@InjectEventEmitter()` ? you guessed it, it's a helper decorator to get the instance of the underlying eventemitter.

now on the other side

```ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { MyEventEmitter } from 'app.events';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@InjectEventEmitter() private readonly emitter: MyEventEmitter) {}
  onModuleInit() {
    this.emitter.on('notification', async msg => await this.onNotification(msg));
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
```

and that's it, easy ? now let's Dive in.

## In Depth

#### Event Records

Event records are interfaces or object types that map event names to the event's payload types. In the following example, three events are declared:

```ts
interface AppEvents {
  req: (request: Express.Request, response: Express.Response) => void;
  done: void;
  conn: Connection;
}
```

Each event shows one of three ways to type the event payloads:

1.  **Function type:** Parameters are the event payload. The return type is ignored.
1.  **`void`:** A shortcut for an event with no payload, i.e. `() => void`
1.  **Anything else:** A shortcut for an event with one payload, for example `(p: number) => void` can be written as just `number`.

#### StrictEventEmitter<TEmitterType, TEventRecord, TEmitRecord = TEventRecord>

The default export. A generic type that takes three type parameters:

1.  _TEmitterType_: Your EventEmitter type (e.g. node's EventEmitter or socket.io socket)
2.  _TEventRecord_: A type mapping event names to event payloads
3.  _TEmitRecord_: Optionally, a similar type mapping things you can emit.

The third parameter is handy when typing web sockets where client and server can listen to and emit different events. For example, if you are using socket.io:

```ts
// create types representing the server side and client
// side sockets
export type ServerSocket =
  StrictEventEmitter<SocketIO.Socket, EventsFromServer, EventsFromClient>;
export type ClientSocket =
  StrictEventEmitter<SocketIOClient.Socket, EventsFromClient, EventsFromServer>;

// elsewhere on server
let serverSocket: ServerSocket = new SocketIO.Socket();
serverSocket.on(/* only events that are sent from the client are allowed */, ...)
serverSocket.emit(/* only events that are emitted from the server are allowed */, ...)

// elsewhere on client
let clientSocket: ClientSocket = new SocketIOClient.Socket();
clientSocket.on(/* only events that are sent from the server are allowed */, ...)
clientSocket.emit(/* only events that are emitted from the client are allowed */, ...)
```

for more information about `StrictEventEmitter` see [@bterlson 's library](https://github.com/bterlson/strict-event-emitter-types)



## CHANGELOG

See [CHANGELOG](CHANGELOG.md) for more information.

## Contributing

You are welcome to contribute to this project, just open a PR.

## Authors

- **Shady Khalifa** ([@shekohex](https://github.com/shekohex)) - _Initial work_
- **Brian Terlson** ([@bterlson](https://github.com/bterlson)) - _strict event emitter types_

See also the list of [contributors](https://github.com/shekohex/nest-router/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
