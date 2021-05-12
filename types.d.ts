export type WebOrderPayload = {
  DayOfWeek: string;
  DeliveryType: number;
  ItemCount: number;
  MainItemCount: number;
  MediumItemCount: number;
  MenuItemIdsInBasket: string;
  SmallItemCount: number;
  TimeOfDayNormalized: number;
  TotalAmountNormalized: number;
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
