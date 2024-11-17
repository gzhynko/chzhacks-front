import { TodoListItem } from "@/model/TodoListItem";
import { Feature, FeatureCollection, Polygon } from "geojson";

export type FarmFieldDTO = Feature<Polygon>

export interface FarmFieldProperties {
  fieldId: string;
  fieldName: string;
  areaAcre: number;
  cropType: string;
  cropPlanted: Date;
  cropHarvest: Date;
  todoList: TodoListItem[];
}

export type FarmFieldGeoJSONCollection = FeatureCollection<Polygon, FarmFieldProperties>;
