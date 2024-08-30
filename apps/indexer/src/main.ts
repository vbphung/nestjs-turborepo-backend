import { NestFactory } from "@nestjs/core"
import { startOtlpSdk } from "@niall/otlp"
import { Logger } from "@niall/pino"
import { otelMetricPort, otelTraceUrl, pkg } from "./app.config"
import { AppModule } from "./app.module"

async function bootstrap() {
  startOtlpSdk({
    metricPort: otelMetricPort,
    traceUrl: otelTraceUrl,
    service: pkg.name,
  })

  const app = await NestFactory.createMicroservice(AppModule)
  app.useLogger(app.get(Logger))

  await app.listen()
}

bootstrap()
