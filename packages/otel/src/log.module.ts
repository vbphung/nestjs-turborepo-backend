import { DynamicModule, Global, Module } from "@nestjs/common"
import { context, trace } from "@opentelemetry/api"
import { OpenTelemetryModule } from "nestjs-otel"
import { OpenTelemetryModuleOptions } from "nestjs-otel/lib/interfaces"
import { Logger, LoggerModule } from "nestjs-pino"
import { Options } from "pino-http"

const loggerOpts: Options = {
  formatters: {
    log(object) {
      const cur = trace.getSpan(context.active())
      if (!cur) {
        return object
      }

      const { spanId, traceId, traceFlags } = cur.spanContext()
      return { ...object, spanId, traceId, traceFlags }
    },
  },
}

export const Log = Logger

@Global()
@Module({})
export class LogModule {
  static forRoot(otelOpts: OpenTelemetryModuleOptions): DynamicModule {
    return {
      module: LogModule,
      imports: [
        LoggerModule.forRoot({
          pinoHttp: loggerOpts,
        }),
        OpenTelemetryModule.forRoot(otelOpts),
      ],
    }
  }
}
