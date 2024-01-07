export interface ITourCompareDestination {
  placeId: string;
  destination: string;
  dest_type?: string;
  lat?: number;
  lng?: number;
}

export interface IRoomInfo {
  adults: number;
  childrens: any[];
}
