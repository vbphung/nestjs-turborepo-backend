import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { Logger } from "@niall/log"
import { startOtelSdk } from "@niall/otel"
import { description, name, version } from "../package.json"
import { otelMetricPort, otelTraceUrl } from "./app.config"
import { AppModule } from "./app.module"

async function bootstrap() {
  startOtelSdk({
    metricPort: otelMetricPort,
    traceUrl: otelTraceUrl,
  })

  const app = await NestFactory.create(AppModule)
  app.useLogger(app.get(Logger))

  const docsConf = new DocumentBuilder()
    .setTitle(name.toUpperCase())
    .setDescription(description)
    .setVersion(version)
    .build()

  const docs = SwaggerModule.createDocument(app, docsConf)
  SwaggerModule.setup("docs", app, docs)

  await app.listen(9000)
}

bootstrap()
