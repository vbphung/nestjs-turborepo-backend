import { DynamicModule, Module } from "@nestjs/common"
import Client, { Cluster, Redis } from "ioredis"
import Redlock from "redlock"
import { REDIS_CLIENT } from "./constants"
import { RedisService } from "./redis.service"

@Module({})
export class RedisModule {
  static forRoot(hosts: string[][]): DynamicModule {
    if (
      !hosts ||
      hosts.length <= 0 ||
      hosts.every((h) => !h || h.length <= 0)
    ) {
      throw new Error("At least one host is required")
    }

    const clts: (Redis | Cluster)[] = []
    for (const h of hosts) {
      if (!h || h.length <= 0) {
        continue
      } else if (h.length <= 1) {
        clts.push(new Client(h[0]))
      } else {
        clts.push(new Cluster(h))
      }
    }

    const redlock = new Redlock(clts, {
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
          provide: REDIS_CLIENT,
          useValue: clts[0],
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
