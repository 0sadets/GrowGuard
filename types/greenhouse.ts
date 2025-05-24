export type GreenhouseStatus = "good" | "warning" | "error" | "nodata" | "loading";
export interface Greenhouse {
  id: number;
  name: string;
  status: GreenhouseStatus;
  length: number;
  width: number;
  height: number;
  season: string;
  location:string;
//   plants:
}
