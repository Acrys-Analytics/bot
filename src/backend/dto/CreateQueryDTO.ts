import { Regions } from "twisted/dist/constants";
import { QueryType } from "./PrismaTypes.js";

export interface CreateQueryDTO {
  depth: number;
  type: QueryType;
  region: Regions;
  search: string;
}
