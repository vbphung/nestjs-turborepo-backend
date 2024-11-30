import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks"
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core"
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { NestInstrumentation } from "@opentelemetry/instrumentation-nestjs-core"
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino"
import { B3InjectEncoding, B3Propagator } from "@opentelemetry/propagator-b3"
import { JaegerPropagator } from "@opentelemetry/propagator-jaeger"
import { Resource } from "@opentelemetry/resources"
import { NodeSDK, tracing } from "@opentelemetry/sdk-node"
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions"

class OtlpOpts {
  metricPort: number
  traceUrl: string
  service: string
}

export function startOtlpSdk(opts: OtlpOpts): void {
  const { metricPort, traceUrl } = opts

  const metricReader = new PrometheusExporter({
    port: metricPort ?? 8081,
  })

  const traceExporter = new OTLPTraceExporter({
    url: `${traceUrl}/v1/traces`,
  })

  const spanProcessor = new tracing.BatchSpanProcessor(traceExporter)

  const sdk = new NodeSDK({
    serviceName: opts.service,
    metricReader,
    traceExporter,
    spanProcessors: [spanProcessor],
    contextManager: new AsyncLocalStorageContextManager(),
    instrumentations: [
      getNodeAutoInstrumentations(),
      new NestInstrumentation(),
      new PinoInstrumentation(),
    ],
    textMapPropagator: new CompositePropagator({
      propagators: [
        new JaegerPropagator(),
        new W3CTraceContextPropagator(),
        new W3CBaggagePropagator(),
        new B3Propagator(),
        new B3Propagator({ injectEncoding: B3InjectEncoding.MULTI_HEADER }),
      ],
    }),
    resource: new Resource({ [ATTR_SERVICE_NAME]: opts.service }),
  })

  process.on("SIGTERM", () => shutdown(sdk))

  sdk.start()
}

async function shutdown(sdk: NodeSDK): Promise<void> {
  try {
    await sdk.shutdown()
    console.log("Tracing terminated")
  } catch (error) {
    console.error("Error terminating tracing", error)
  } finally {
    process.exit(0)
  }
}
