import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { PetRepo } from "./pet.repo"
import { Pet, PetSchema } from "./pet.schema"

@Module({
  imports: [MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }])],
  providers: [PetRepo],
  exports: [PetRepo],
})
export class PetModule {}
