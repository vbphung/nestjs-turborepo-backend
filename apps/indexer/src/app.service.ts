import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common"
import { Consumer, EachMessagePayload } from "kafkajs"
import { kafkaConsumerProvider } from "./app.config"

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name)

  constructor(
    @Inject(kafkaConsumerProvider) private readonly consumer: Consumer,
  ) {}

  async onModuleInit() {
    await this.consumer.run({
      autoCommit: true,
      eachMessage: async (msg: EachMessagePayload) => {
        this.logger.log(msg.message.value.toString())
      },
    })
  }
}
