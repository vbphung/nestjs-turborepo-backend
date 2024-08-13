import { Inject, Injectable, OnModuleInit } from "@nestjs/common"
import { Consumer, EachMessagePayload } from "kafkajs"
import { kafkaConsumerProvider } from "./app.config"

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject(kafkaConsumerProvider) private readonly consumer: Consumer,
  ) {}

  async onModuleInit() {
    await this.consumer.run({
      autoCommit: true,
      eachMessage: async (msg: EachMessagePayload) => {
        console.log(msg.message.offset, msg.message.value)
      },
    })
  }
}
