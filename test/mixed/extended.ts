export enum Fruit {
  Apple = 0,
  Banana = 1,
}

export interface Package {
  id: string;
  price: number;
  fruit: Fruit;
}
