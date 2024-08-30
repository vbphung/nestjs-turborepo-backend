import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks"
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core"
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { B3InjectEncoding, B3Propagator } from "@opentelemetry/propagator-b3"
import { NodeSDK } from "@opentelemetry/sdk-node"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"

class OtelOpts {
  metricPort: number
  traceUrl: string
}

export function startOtelSdk(opts: OtelOpts): void {
  const { metricPort, traceUrl } = opts

  const metricReader = new PrometheusExporter({
    port: metricPort ?? 8081,
  })

  const traceExported = new OTLPTraceExporter({
    url: `${traceUrl}/v1/traces`,
  })

  const spanProcessor = new BatchSpanProcessor(traceExported)

  const sdk = new NodeSDK({
    metricReader,
    spanProcessors: [spanProcessor],
    contextManager: new AsyncLocalStorageContextManager(),
    instrumentations: [getNodeAutoInstrumentations()],
    textMapPropagator: new CompositePropagator({
      propagators: [
        new W3CTraceContextPropagator(),
        new W3CBaggagePropagator(),
        new B3Propagator(),
        new B3Propagator({ injectEncoding: B3InjectEncoding.MULTI_HEADER }),
      ],
    }),
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
