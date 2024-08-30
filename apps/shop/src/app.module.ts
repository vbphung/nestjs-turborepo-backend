import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ScheduleModule } from "@nestjs/schedule"
import { KafkaModule } from "@niall/kafka"
import { LogModule } from "@niall/otel"
import { PetModule } from "@niall/pet"
import { kafkaBroker, kafkaName, mongoDb, mongoUri } from "./app.config"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(mongoUri, {
      dbName: mongoDb,
    }),
    KafkaModule.register(kafkaName, {
      connect: {
        brokers: [kafkaBroker],
        connectionTimeout: 1000,
        retry: {
          restartOnFailure: () => Promise.resolve(true),
          retries: 5,
        },
      },
      producer: {},
    }),
    LogModule.forRoot({
      metrics: {
        hostMetrics: true,
        apiMetrics: { enable: true },
      },
    }),
    PetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
