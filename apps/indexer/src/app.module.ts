import { Module } from "@nestjs/common"
import { KafkaModule } from "@niall/kafka"
import { LogModule } from "@niall/log"
import { OtelModule } from "@niall/otel"
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
    OtelModule.forRoot({
      metrics: {
        hostMetrics: true,
        apiMetrics: { enable: false },
      },
    }),
    LogModule,
  ],
  providers: [AppService],
})
export class AppModule {}
