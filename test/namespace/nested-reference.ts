export interface Foo {
  foo: string;
  bar: Foo.Bar;
}

export namespace Foo {
  export interface Bar {
    bar: string;
  }
}

export interface Bar {
  bar: Foo.Bar;
}
