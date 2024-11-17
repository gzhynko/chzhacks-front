import { Feature, FeatureCollection, Polygon } from "geojson";

export type FarmFieldDTO = Feature<Polygon>

export interface FarmFieldProperties {
  fieldId: string;
  fieldName: string;
  fieldSize: number;
  cropType: string;
  cropPlanted: Date;
  cropHarvest: Date;
}

export type FarmFieldGeoJSONCollection = FeatureCollection<Polygon, FarmFieldProperties>;
