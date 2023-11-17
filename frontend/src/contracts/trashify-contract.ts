import {Trashify__factory as TrashifyFactory} from "@/typechain"

const trashifyIntraface = TrashifyFactory.createInterface()

export const trashifyContract = {
  trashifyIntraface,
  factory: TrashifyFactory
}
