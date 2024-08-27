import { NestFactory } from "@nestjs/core"
import { getOtelSdk } from "@niall/otel"
import { AppModule } from "./app.module"

async function bootstrap() {
  const otel = getOtelSdk()
  otel.start()

  const app = await NestFactory.create(AppModule)
  await app.listen(3000)
}

bootstrap()
