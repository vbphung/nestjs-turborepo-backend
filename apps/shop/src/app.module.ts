import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { KafkaModule } from "@niall/kafka"
import { OtlpModule } from "@niall/otlp"
import { PetModule } from "@niall/pet"
import { PinoModule } from "@niall/pino"
import {
  excludedRoutes,
  kafkaBroker,
  kafkaName,
  mongoDb,
  mongoUri,
} from "./app.config"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

@Module({
  imports: [
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
    OtlpModule.forRoot({
      metrics: {
        hostMetrics: true,
        apiMetrics: {
          enable: true,
          ignoreRoutes: excludedRoutes,
        },
      },
    }),
    PinoModule.forRoot(excludedRoutes),
    PetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
