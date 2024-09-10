import { Inject, Injectable, Logger } from "@nestjs/common"
import { OtelMethodCounter, Span, TraceService } from "@niall/otlp"
import { IPet, PetRepo, PetSort } from "@niall/pet"
import { RedisService } from "@niall/redis"
import { Producer } from "kafkajs"
import { kafkaProducerProvider, kafkaTopic } from "./app.config"

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)

  constructor(
    private readonly pets: PetRepo,
    @Inject(kafkaProducerProvider) private readonly kafka: Producer,
    private readonly redis: RedisService,
    private readonly trace: TraceService,
  ) {}

  @Span("createPets")
  @OtelMethodCounter()
  async createPets(names: string[]): Promise<IPet[]> {
    const span = this.trace.getSpan()

    const now = new Date()
    const recs = await this.pets.createList(
      names.map((name) => ({ name, createdAt: now })),
    )
    await this.kafka.send({
      topic: kafkaTopic,
      messages: [{ value: JSON.stringify(recs) }],
    })

    this.logger.log(JSON.stringify(recs))

    if (!span) {
      this.logger.error("Span not found")
    } else {
      span.addEvent("pets created", { count: recs.length }).end()
    }

    return recs
  }

  @Span("listPets")
  @OtelMethodCounter()
  async listPets(page: number, limit: number, sort: PetSort): Promise<IPet[]> {
    const key = `pets:${page}:${limit}`
    const cached = await this.redis.get(key)
    if (cached) {
      return cached
    }

    const recs = await this.pets.listAll(page, limit, sort)
    if (recs && recs.length > 0) {
      await this.redis.set(key, recs, 1000)
    }

    return recs
  }
}
