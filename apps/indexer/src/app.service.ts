import { SchemaRegistry } from "@kafkajs/confluent-schema-registry"
import { Inject, Injectable, OnModuleInit } from "@nestjs/common"
import { Consumer, EachMessagePayload } from "kafkajs"
import {
  kafkaConsumerProvider,
  kafkaSchemaRegistryProvider,
} from "./app.config"

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject(kafkaConsumerProvider) private readonly consumer: Consumer,
    @Inject(kafkaSchemaRegistryProvider)
    private readonly schemaRegistry: SchemaRegistry,
  ) {}

  async onModuleInit() {
    this.consumer.run({
      autoCommit: true,
      eachMessage: async (msg: EachMessagePayload) => {
        const payload = await this.schemaRegistry.decode(msg.message.value)
        console.log(msg.message.offset, payload)
      },
    })
  }
}
