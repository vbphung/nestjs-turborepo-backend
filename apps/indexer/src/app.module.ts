import { Module } from "@nestjs/common"
import { KafkaModule } from "@niall/kafka"
import { AppService } from "./app.service"

@Module({
  imports: [KafkaModule],
  providers: [AppService],
})
export class AppModule {}
