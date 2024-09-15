import { DynamicModule, Module } from "@nestjs/common"
import { context, trace } from "@opentelemetry/api"
import { Logger, LoggerModule, Params } from "nestjs-pino"
import Pino, { LoggerOptions } from "pino"

export { Logger }

const opts: LoggerOptions = {
  level: "info",
  formatters: {
    level(label) {
      return { level: label }
    },
    log(object) {
      const cur = trace.getSpan(context.active())
      if (!cur) return object
      const { spanId, traceId, traceFlags } = cur.spanContext()
      return { ...object, spanId, traceId, traceFlags }
    },
  },
}

const logger = Pino(opts)

@Module({})
export class PinoModule {
  static forRoot(excludedRoutes?: string[]): DynamicModule {
    const params: Params = {
      pinoHttp: { logger },
      exclude: excludedRoutes ?? [],
    }

    return {
      module: PinoModule,
      global: true,
      imports: [LoggerModule.forRoot(params)],
    }
  }
}
