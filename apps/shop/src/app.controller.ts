import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { ApiCreatedResponse, ApiOkResponse, ApiProperty } from "@nestjs/swagger"
import { IPet, PetSort, SortOrder } from "@niall/pet"
import { IsArray, IsEnum, IsNotEmpty, Max, Min } from "class-validator"
import { AppService } from "./app.service"
import { Type } from "class-transformer"

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

class Pagination implements PetSort {
  @ApiProperty({ example: 1 })
  @Min(0)
  @Type(() => Number)
  page: number

  @ApiProperty({ example: 16 })
  @Min(8)
  @Max(512)
  @Type(() => Number)
  limit: number

  @ApiProperty({ example: SortOrder.ASC })
  @IsEnum(SortOrder)
  @Type(() => Number)
  name?: SortOrder

  @ApiProperty({ example: SortOrder.DESC })
  @IsEnum(SortOrder)
  @Type(() => Number)
  createdAt?: SortOrder
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
    return await this.app.listPets(query.page, query.limit, query)
  }
}
