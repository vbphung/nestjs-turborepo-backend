import { Injectable, OnModuleInit } from "@nestjs/common"
import { KafkaService } from "@niall/kafka"

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly kafka: KafkaService) {}

  async onModuleInit() {
    console.log(await this.kafka.sayHello())
  }
}
