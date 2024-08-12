import { DynamicModule, Module, Provider } from "@nestjs/common"
import {
  getConnectProvider,
  getConsumerProvider,
  getProducerProvider,
  getSchemaRegistryProvider,
  IKafkaModuleOptions,
} from "./kafka.provider"

@Module({})
export class KafkaModule {
  static register(name: string, opts: IKafkaModuleOptions): DynamicModule {
    if (!opts.connect) {
      throw new Error("KafkaModule.register: connect is required")
    }

    if (!name) {
      throw new Error("KafkaModule.register: name is required")
    }

    name = name.toUpperCase()

    type provOpt = {
      opt: any
      getProv: (name: string, conf: any) => Provider
    }
    const provOpts: provOpt[] = []
    provOpts.push({ opt: opts.connect, getProv: getConnectProvider })
    provOpts.push({ opt: opts.producer, getProv: getProducerProvider })
    provOpts.push({ opt: opts.consumer, getProv: getConsumerProvider })
    provOpts.push({
      opt: opts.schemaRegistry,
      getProv: getSchemaRegistryProvider,
    })

    const provs: Provider[] = []
    for (const opts of provOpts) {
      if (opts.opt) {
        provs.push(opts.getProv(name, opts.opt))
      }
    }

    return {
      module: KafkaModule,
      providers: provs,
      exports: provs,
    }
  }
}
