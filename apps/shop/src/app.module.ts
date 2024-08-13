import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { PetModule } from "@niall/pet"
import { mongoDb, mongoUri } from "./app.config"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, {
      dbName: mongoDb,
    }),
    PetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
