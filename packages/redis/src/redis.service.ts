import { Injectable } from "@nestjs/common"
import { parse, stringify } from "flatted"
import Client from "ioredis"
import Redlock from "redlock"

const defaultDur = 1000

@Injectable()
export class RedisService {
  constructor(
    private readonly redlock: Redlock,
    private readonly client: Client,
  ) {}

  async set(key: string, val: any, ttl: number): Promise<void> {
    const resource = `lock:${key}`
    const lock = await this.redlock.acquire([resource], defaultDur)
    await this.client.set(key, stringify(val), "PX", ttl)
    lock.release()
  }

  async get(key: string): Promise<any> {
    const val = await this.client.get(key)
    return val ? parse(val) : null
  }
}
