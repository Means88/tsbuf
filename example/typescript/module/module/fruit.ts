export enum Fruit {
  Apple = 0,
  Banana = 1,
}

export interface Basket {
  fruit_list: Fruit[];
  name: string;
  price: number;
}
