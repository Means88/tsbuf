export interface Foo {
  foo?: number;
  bar?: string;
}

export interface Bar {
  foo?: Foo;
  bar?: string;
}
