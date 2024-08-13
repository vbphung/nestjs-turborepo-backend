import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"
import { IPet } from "./pet.interface"

@Schema()
export class Pet implements IPet {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  createdAt: Date
}

export type PetDocument = HydratedDocument<Pet>
export const PetSchema = SchemaFactory.createForClass(Pet)
