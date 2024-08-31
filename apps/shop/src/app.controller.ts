import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { ApiCreatedResponse, ApiOkResponse, ApiProperty } from "@nestjs/swagger"
import { IPet } from "@niall/pet"
import { Type } from "class-transformer"
import { IsArray, IsNotEmpty, Max, Min } from "class-validator"
import { AppService } from "./app.service"

class CreatePetsReq {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  names: string[]
}

class Pet implements IPet {
  @ApiProperty()
  name: string

  @ApiProperty()
  createdAt: Date
}

class Pagination {
  @ApiProperty({ example: 1 })
  @Min(0)
  @Type(() => Number)
  page: number

  @ApiProperty({ example: 16 })
  @Min(8)
  @Max(512)
  @Type(() => Number)
  limit: number
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
  async listPets(@Query() query: Pagination): Promise<IPet[]> {
    return await this.app.listPets(query.page, query.limit)
  }
}
