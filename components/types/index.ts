export interface ITourCompareDestination {
  placeId: string;
  destination: string;
  lat?: number;
  lng?: number;
}

export interface IRoomInfo {
  adults: number;
  childrens: any[];
}
