import { DynamicModule, Module } from "@nestjs/common"
import Client, { Cluster } from "ioredis"
import Redlock from "redlock"
import { RedisService } from "./redis.service"

@Module({})
export class RedisModule {
  static forRoot(hosts: string[]): DynamicModule {
    if (!hosts || hosts.length <= 0) {
      throw new Error("At least one host is required")
    }

    const cls = new Cluster(hosts)
    const redlock = new Redlock([cls], {
      driftFactor: 0.01,
      retryCount: 10,
      retryDelay: 200,
      retryJitter: 200,
      automaticExtensionThreshold: 500,
    })

    return {
      module: RedisModule,
      global: true,
      providers: [
        {
          provide: Client,
          useValue: cls,
        },
        {
          provide: Redlock,
          useValue: redlock,
        },
        RedisService,
      ],
      exports: [RedisService],
    }
  }
}
