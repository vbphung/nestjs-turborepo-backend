export interface IPet {
  name: string
  createdAt: Date
}

export enum SortOrder {
  ASC = 1,
  DESC = -1,
}

export type PetSort = {
  [k in keyof IPet]?: SortOrder
}
