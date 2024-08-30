import { Inject, Injectable, Logger } from "@nestjs/common"
import { IPet, PetRepo } from "@niall/pet"
import { Producer } from "kafkajs"
import { kafkaProducerProvider, kafkaTopic } from "./app.config"

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)

  constructor(
    private readonly pets: PetRepo,
    @Inject(kafkaProducerProvider) private readonly kafka: Producer,
  ) {}

  async createPets(names: string[]): Promise<IPet[]> {
    const now = new Date()
    const recs = await this.pets.createList(
      names.map((name) => ({ name, createdAt: now })),
    )
    await this.kafka.send({
      topic: kafkaTopic,
      messages: [{ value: JSON.stringify(recs) }],
    })

    this.logger.log(JSON.stringify(recs))

    return recs
  }

  async listPets(): Promise<IPet[]> {
    return await this.pets.listAll()
  }
}
