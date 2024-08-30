import { NestFactory } from "@nestjs/core"
import { otelSdk } from "@niall/otel"
import { AppModule } from "./app.module"

async function bootstrap() {
  otelSdk.start()

  const app = await NestFactory.createMicroservice(AppModule)
  await app.listen()
}

bootstrap()
