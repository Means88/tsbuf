export interface A {}

export namespace A {
  export interface B {}

  export namespace B {
    export interface C {
      b: B;
    }
  }
}
