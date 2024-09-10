import { Inject, Injectable } from "@nestjs/common"
import { parse, stringify } from "flatted"
import { Cluster, Redis } from "ioredis"
import Redlock, { Lock } from "redlock"
import { REDIS_CLIENT } from "./constants"

@Injectable()
export class RedisService {
  constructor(
    private readonly redlock: Redlock,
    @Inject(REDIS_CLIENT) private readonly client: Redis | Cluster,
  ) {}

  async lock(key: string, ttl = 1000): Promise<Lock> {
    const resource = `lock:${key}`
    return await this.redlock.acquire([resource], ttl)
  }

  async release(lock: Lock): Promise<void> {
    await this.redlock.release(lock)
  }

  async set(key: string, val: any, ttl = 1000): Promise<void> {
    await this.client.set(key, stringify(val), "PX", ttl)
  }

  async get(key: string): Promise<any> {
    const val = await this.client.get(key)
    return val ? parse(val) : null
  }
}
