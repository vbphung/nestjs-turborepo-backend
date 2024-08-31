import { DynamicModule, Module } from "@nestjs/common"
import { context, trace } from "@opentelemetry/api"
import { Logger, LoggerModule, Params } from "nestjs-pino"
import { Options } from "pino-http"

export { Logger }

const opts: Options = {
  formatters: {
    log(object) {
      const cur = trace.getSpan(context.active())
      if (!cur) return object
      const { spanId, traceId, traceFlags } = cur.spanContext()
      return { ...object, spanId, traceId, traceFlags }
    },
  },
}

@Module({})
export class PinoModule {
  static forRoot(excludedRoutes?: string[]): DynamicModule {
    const params: Params = {
      pinoHttp: opts,
      exclude: excludedRoutes ?? [],
    }

    return {
      module: PinoModule,
      global: true,
      imports: [LoggerModule.forRoot(params)],
    }
  }
}
