import { Body, Controller, Get, Post } from "@nestjs/common"
import { ApiCreatedResponse, ApiOkResponse, ApiProperty } from "@nestjs/swagger"
import { IPet } from "@niall/pet"
import { AppService } from "./app.service"

class CreatePetsReq {
  @ApiProperty()
  names: string[]
}

class Pet implements IPet {
  @ApiProperty()
  name: string

  @ApiProperty()
  createdAt: Date
}

@Controller()
export class AppController {
  constructor(private readonly app: AppService) {}

  @Post("/pets")
  @ApiCreatedResponse({ type: [Pet] })
  async createPets(@Body() body: CreatePetsReq): Promise<IPet[]> {
    return await this.app.createPets(body.names)
  }

  @Get("/pets")
  @ApiOkResponse({ type: [Pet] })
  async listPets(): Promise<IPet[]> {
    return await this.app.listPets()
  }
}
