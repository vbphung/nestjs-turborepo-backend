import { NestFactory } from "@nestjs/core"
import { Log, otelSdk } from "@niall/otel"
import { AppModule } from "./app.module"

async function bootstrap() {
  otelSdk.start()

  const app = await NestFactory.createMicroservice(AppModule)
  app.useLogger(app.get(Log))

  await app.listen()
}

bootstrap()
