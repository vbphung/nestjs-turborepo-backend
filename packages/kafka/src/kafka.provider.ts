import { SchemaRegistry } from "@kafkajs/confluent-schema-registry"
import { SchemaRegistryAPIClientArgs } from "@kafkajs/confluent-schema-registry/dist/api"
import { Provider } from "@nestjs/common"
import {
  Consumer,
  ConsumerConfig,
  Kafka,
  KafkaConfig,
  Producer,
  ProducerConfig,
} from "kafkajs"

interface IKafkaConsumerOptions extends ConsumerConfig {
  topics: string[]
}

export interface IKafkaModuleOptions {
  connect: KafkaConfig
  producer?: ProducerConfig
  consumer?: IKafkaConsumerOptions
  schemaRegistry?: SchemaRegistryAPIClientArgs
}

export function getConnectProvider(name: string, conf: KafkaConfig): Provider {
  return {
    provide: `${name}_KAFKA_CONNECT`,
    useFactory: (): Kafka => {
      return new Kafka(conf)
    },
  }
}

export function getProducerProvider(
  name: string,
  conf: ProducerConfig,
): Provider {
  return {
    provide: `${name}_KAFKA_PRODUCER`,
    useFactory: async (kafka: Kafka): Promise<Producer> => {
      const prod = kafka.producer(conf)
      await prod.connect()
      return prod
    },
    inject: [`${name}_KAFKA_CONNECT`],
  }
}

export function getConsumerProvider(
  name: string,
  conf: IKafkaConsumerOptions,
): Provider {
  return {
    provide: `${name}_KAFKA_CONSUMER`,
    useFactory: async (kafka: Kafka): Promise<Consumer> => {
      const consumer = kafka.consumer(conf)
      await consumer.connect()
      await Promise.all(
        conf.topics.map(async (topic) => {
          await consumer.subscribe({ topic })
        }),
      )
      return consumer
    },
    inject: [`${name}_KAFKA_CONNECT`],
  }
}

export function getSchemaRegistryProvider(
  name: string,
  conf: SchemaRegistryAPIClientArgs,
): Provider {
  return {
    provide: `${name}_SCHEMA_REGISTRY`,
    useFactory: (): SchemaRegistry => {
      return new SchemaRegistry(conf)
    },
  }
}
