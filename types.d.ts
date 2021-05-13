export type WebOrderPayload = {
  ItemCount: number;
  TotalAmountNormalized: number;
  DayOfWeek: string;
  TimeOfDayNormalized: number;
  MainItemCount: number;
  MediumItemCount: number;
  SmallItemCount: number;
  DeliveryType: "Collection" | "Delivery";
  MenuItemIdsInBasket: string; 
};

export type Data = {
  lhs: string[];
  rhs: string[];
  support: number[];
  confidence: number[];
  lift: number[];
  count: number[];
};
type Rule = {
  lhs: string;
  rhs: string;
  lift: number;
  confidence: number;
  support: number;
  count: number;
};

export type SageResponse = [
  {
    closest_cluster: number;
    distance_to_cluster: number;
  }
];
