import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { IPet, PetSort, SortOrder } from "./pet.interface"
import { Pet } from "./pet.schema"

@Injectable()
export class PetRepo {
  constructor(@InjectModel(Pet.name) private readonly model: Model<Pet>) {}

  async createList(pets: IPet[]): Promise<IPet[]> {
    return await this.model.insertMany(pets, { ordered: false })
  }

  async listByNames(names: string[]): Promise<IPet[]> {
    return await this.model.find({ name: { $in: names } }).exec()
  }

  async listAll(page: number, limit: number, sort: PetSort): Promise<IPet[]> {
    let s: PetSort = {}
    ;(Object.keys(this) as Array<keyof IPet>).forEach((k) => {
      s[k] = sort[k] ?? SortOrder.DESC
    })

    return await this.model.find().skip(page).limit(limit).sort(s).exec()
  }
}
