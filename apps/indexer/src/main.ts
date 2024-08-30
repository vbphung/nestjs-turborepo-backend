import { NestFactory } from "@nestjs/core"
import { Logger } from "@niall/log"
import { startOtelSdk } from "@niall/otel"
import { otelMetricPort, otelTraceUrl } from "./app.config"
import { AppModule } from "./app.module"

async function bootstrap() {
  startOtelSdk({
    metricPort: otelMetricPort,
    traceUrl: otelTraceUrl,
  })

  const app = await NestFactory.createMicroservice(AppModule)
  app.useLogger(app.get(Logger))

  await app.listen()
}

bootstrap()
