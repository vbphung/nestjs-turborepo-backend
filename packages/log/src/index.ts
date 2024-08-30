import { Global, Module } from "@nestjs/common"
import { context, trace } from "@opentelemetry/api"
import { Logger, LoggerModule } from "nestjs-pino"
import { Options } from "pino-http"

export { Logger }

const opts: Options = {
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

@Global()
@Module({
  imports: [LoggerModule.forRoot({ pinoHttp: opts })],
})
export class LogModule {}
