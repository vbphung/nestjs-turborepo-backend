import { Inject, Injectable } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { IPet, PetRepo } from "@niall/pet"
import { Producer } from "kafkajs"
import { generate } from "randomstring"
import { kafkaProducerProvider, kafkaTopic } from "./app.config"

@Injectable()
export class AppService {
  constructor(
    private readonly pets: PetRepo,
    @Inject(kafkaProducerProvider) private readonly kafka: Producer,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async happyPush(): Promise<void> {
    const names: string[] = []
    for (let i = 0; i < 8; i++) {
      names.push(generate())
    }

    console.log(JSON.stringify(await this.createPets(names)))
  }

  async createPets(names: string[]): Promise<IPet[]> {
    const now = new Date()
    const recs = await this.pets.createList(
      names.map((name) => ({ name, createdAt: now })),
    )
    await this.kafka.send({
      topic: kafkaTopic,
      messages: [{ value: JSON.stringify(recs) }],
    })

    return recs
  }

  async listPets(names: string[]): Promise<IPet[]> {
    return await this.pets.listByNames(names)
  }
}
