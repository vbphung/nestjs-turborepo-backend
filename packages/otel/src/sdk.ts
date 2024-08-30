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

const metricPort = Number(process.env.OTEL_METRIC_PORT)
const traceUrl = process.env.OTEL_TRACE_URL

function getOtelSdk(): NodeSDK {
  const metricReader = new PrometheusExporter({
    port: metricPort ?? 8081,
  })

  const traceExported = new OTLPTraceExporter({
    url: `${traceUrl}/v1/traces`,
  })

  const spanProcessor = new BatchSpanProcessor(traceExported)

  return new NodeSDK({
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
}

const otelSdk = getOtelSdk()

process.on("SIGTERM", async () => {
  try {
    await otelSdk.shutdown()
    console.log("Tracing terminated")
  } catch (error) {
    console.error("Error terminating tracing", error)
  } finally {
    process.exit(0)
  }
})

export { otelSdk }
