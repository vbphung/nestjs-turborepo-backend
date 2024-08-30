import { config } from "dotenv"

export const kafkaName = "YOUR_VOICE_MATTERS"
export const kafkaConsumerProvider = `${kafkaName}_KAFKA_CONSUMER`
export const kafkaProducerProvider = `${kafkaName}_KAFKA_PRODUCER`
export const kafkaSchemaRegistryProvider = `${kafkaName}_SCHEMA_REGISTRY`

config()

export const kafkaBroker = process.env.KAFKA_BROKER
export const kafkaUsername = process.env.KAFKA_USERNAME
export const kafkaPassword = process.env.KAFKA_PASSWORD
export const kafkaGroupId = process.env.KAFKA_GROUP_ID
export const kafkaTopic = process.env.KAFKA_TOPIC
export const kafkaSchemaRegistryUrl = process.env.KAFKA_SCHEMA_REGISTRY_URL
export const kafkaSchemaRegistryUsername =
  process.env.KAFKA_SCHEMA_REGISTRY_USERNAME
export const kafkaSchemaRegistryPassword =
  process.env.KAFKA_SCHEMA_REGISTRY_PASSWORD

export const otelMetricPort = Number(process.env.OTEL_METRIC_PORT)
export const otelTraceUrl = process.env.OTEL_TRACE_URL
