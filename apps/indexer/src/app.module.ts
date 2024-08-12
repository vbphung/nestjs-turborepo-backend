import { Module } from "@nestjs/common"
import { KafkaModule } from "@niall/kafka"
import {
  kafkaBroker,
  kafkaGroupId,
  kafkaName,
  kafkaPassword,
  kafkaSchemaRegistryPassword,
  kafkaSchemaRegistryUrl,
  kafkaSchemaRegistryUsername,
  kafkaTopic,
  kafkaUsername,
} from "./app.config"
import { AppService } from "./app.service"

@Module({
  imports: [
    KafkaModule.register(kafkaName, {
      connect: {
        brokers: [kafkaBroker],
        connectionTimeout: 1000,
        sasl: {
          mechanism: "plain",
          username: kafkaUsername,
          password: kafkaPassword,
        },
        retry: {
          restartOnFailure: () => Promise.resolve(true),
          retries: 5,
        },
      },
      consumer: {
        topics: [kafkaTopic],
        groupId: kafkaGroupId,
        heartbeatInterval: 3000,
        maxBytesPerPartition: 1000000,
      },
      schemaRegistry: {
        host: kafkaSchemaRegistryUrl,
        auth: {
          username: kafkaSchemaRegistryUsername,
          password: kafkaSchemaRegistryPassword,
        },
      },
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
