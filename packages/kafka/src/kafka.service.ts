import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common"

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {}

  async onModuleDestroy() {}

  async sayHello(): Promise<string> {
    return KafkaService.name
  }
}
