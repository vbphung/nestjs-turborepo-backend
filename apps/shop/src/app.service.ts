import { Injectable } from "@nestjs/common"
import { IPet, PetService } from "@niall/pet"

@Injectable()
export class AppService {
  constructor(private readonly pets: PetService) {}

  async createPets(names: string[]): Promise<IPet[]> {
    const now = new Date()
    return await this.pets.createList(
      names.map((name) => ({ name, createdAt: now })),
    )
  }

  async listPets(names: string[]): Promise<IPet[]> {
    return await this.pets.listByNames(names)
  }
}
