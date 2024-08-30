import { Module } from "@nestjs/common"
import { KafkaModule } from "@niall/kafka"
import { OtlpModule } from "@niall/otlp"
import { PinoModule } from "@niall/pino"
import { kafkaBroker, kafkaGroupId, kafkaName, kafkaTopic } from "./app.config"
import { AppService } from "./app.service"

@Module({
  imports: [
    KafkaModule.register(kafkaName, {
      connect: {
        brokers: [kafkaBroker],
        connectionTimeout: 1000,
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
    }),
    OtlpModule.forRoot({
      metrics: {
        hostMetrics: true,
        apiMetrics: { enable: false },
      },
    }),
    PinoModule.forRoot(),
  ],
  providers: [AppService],
})
export class AppModule {}
