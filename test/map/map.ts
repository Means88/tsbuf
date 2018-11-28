export interface Foo {
  foo: {
    [key: string]: string;
  };
  bar: {
    [key: string]: number;
  };
}

export interface Bar {
  foo: {
    [key: string]: Foo;
  };
}
