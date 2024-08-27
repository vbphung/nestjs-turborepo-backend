import { NestFactory } from "@nestjs/core"
import { getOtelSdk } from "@niall/otel"
import { AppModule } from "./app.module"

async function bootstrap() {
  const otel = getOtelSdk()
  otel.start()

  const app = await NestFactory.createMicroservice(AppModule)
  await app.listen()
}

bootstrap()
