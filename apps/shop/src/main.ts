import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { startOtlpSdk } from "@niall/otlp"
import { Logger } from "@niall/pino"
import { setupGracefulShutdown } from "nestjs-graceful-shutdown"
import {
  apiPort,
  apiPrefix,
  otelMetricPort,
  otelTraceUrl,
  pkg,
  swaggerPrefix,
} from "./app.config"
import { AppModule } from "./app.module"

async function bootstrap() {
  startOtlpSdk({
    metricPort: otelMetricPort,
    traceUrl: otelTraceUrl,
    service: pkg.name,
  })

  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix(apiPrefix)
  app.useLogger(app.get(Logger))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  const docsConf = new DocumentBuilder()
    .setTitle(pkg.name.toUpperCase())
    .setDescription(pkg.description)
    .setVersion(pkg.version)
    .build()

  const docs = SwaggerModule.createDocument(app, docsConf)
  SwaggerModule.setup(swaggerPrefix, app, docs)

  setupGracefulShutdown({ app })

  app.get(Logger)?.log(`Listening on http://localhost:${apiPort}/${apiPrefix}`)

  await app.listen(apiPort)
}

bootstrap()
