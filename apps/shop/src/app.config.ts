import { config } from "dotenv"
import pkg from "../package.json"

export { pkg }
export const apiPort = 9000
export const apiPrefix = `api/${pkg.name}/v${pkg.version}`
export const swaggerPrefix = `${apiPrefix}/docs`
export const excludedRoutes = [
  `${apiPrefix}`,
  `${swaggerPrefix}`,
  `${swaggerPrefix}/swagger-ui-init.js`,
  `${swaggerPrefix}/swagger-ui.css`,
  `${swaggerPrefix}/swagger-ui-bundle.js`,
  `${swaggerPrefix}/swagger-ui-standalone-preset.js`,
  `${swaggerPrefix}/favicon-32x32.png`,
  `/favicon.ico`,
]

export const kafkaName = `YOUR_VOICE_MATTERS`
export const kafkaProducerProvider = `${kafkaName}_KAFKA_PRODUCER`
export const kafkaSchemaRegistryProvider = `${kafkaName}_SCHEMA_REGISTRY`

config()

export const mongoUri = process.env.MONGO_URI
export const mongoDb = process.env.MONGO_DB

export const kafkaBroker = process.env.KAFKA_BROKER
export const kafkaUsername = process.env.KAFKA_USERNAME
export const kafkaPassword = process.env.KAFKA_PASSWORD
export const kafkaTopic = process.env.KAFKA_TOPIC
export const kafkaSchemaRegistryUrl = process.env.KAFKA_SCHEMA_REGISTRY_URL
export const kafkaSchemaRegistryUsername =
  process.env.KAFKA_SCHEMA_REGISTRY_USERNAME
export const kafkaSchemaRegistryPassword =
  process.env.KAFKA_SCHEMA_REGISTRY_PASSWORD

export const redisHosts = process.env.REDIS_HOSTS.split(",")
export const redisClusterHosts = process.env.REDIS_CLUSTER_HOSTS.split(",")

export const otelMetricPort = Number(process.env.OTEL_METRIC_PORT)
export const otelTraceUrl = process.env.OTEL_TRACE_URL
