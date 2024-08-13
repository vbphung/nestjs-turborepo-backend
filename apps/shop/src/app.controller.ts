import { Body, Controller, Get, Post } from "@nestjs/common"
import { IPet } from "@niall/pet"
import { AppService } from "./app.service"

class CreatePetsReq {
  names: string[]
}

class ListPetsRes extends CreatePetsReq {}

@Controller()
export class AppController {
  constructor(private readonly app: AppService) {}

  @Post()
  async createPets(@Body() body: CreatePetsReq): Promise<IPet[]> {
    return await this.app.createPets(body.names)
  }

  @Get()
  async listPets(@Body() body: ListPetsRes): Promise<IPet[]> {
    return await this.app.listPets(body.names)
  }
}
