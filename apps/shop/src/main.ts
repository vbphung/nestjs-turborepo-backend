import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { Log, otelSdk } from "@niall/otel"
import { description, name, version } from "../package.json"
import { AppModule } from "./app.module"

async function bootstrap() {
  otelSdk.start()

  const app = await NestFactory.create(AppModule)
  app.useLogger(app.get(Log))

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
