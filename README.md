# tsbuf  [![npm@version](https://img.shields.io/npm/v/tsbuf.svg)](https://www.npmjs.com/package/tsbuf) [![Build Status](https://travis-ci.org/Means88/tsbuf.svg?branch=master)](https://travis-ci.org/Means88/tsbuf) [![Coverage Status](https://coveralls.io/repos/github/Means88/tsbuf/badge.svg?branch=master)](https://coveralls.io/github/Means88/tsbuf?branch=master)

Generate TypeScript enum and interface with proto buffer.

## Usage
```bash
npm install -g tsbuf
tsbuf example/proto -o example/typescript/global
# or
tsbuf example/proto -o example/typescript/module -m module

```
See `example/`

```console
$ tsbuf -h
Usage: tsbuf [options] <inputPath>

protobuf-parser
Generate TypeScript interface with Protobuf.

Options:
  -V, --version          output the version number
  -o, --output <output>  output path (default: ".")
  -m, --mode <mode>      "global": Global Definition, "module": Module Definition (default: "global")
  -h, --help             output usage information

```

## Example

```proto
syntax = "proto3";

service MyService {
  rpc rpcMethod(Fruit) returns (Package) {}
}

enum Fruit {
  Apple = 0;
  Banana = 1;
}

message Package {
  string id = 1;
  float price = 2;
}

```
Will be transformed to

```typescript
interface MyService {
  rpcMethod: {
    request: Request;
    response: Response;
  };
}

declare enum Fruit {
  Apple = 0,
  Banana = 1,
}

interface Package {
  id: string;
  price: number;
}
```
Or TypeScript module
```typescript
export interface MyService {
  rpcMethod: {
    request: Request;
    response: Response;
  };
}

export enum Fruit {
  Apple = 0,
  Banana = 1,
}

export interface Package {
  id: string;
  price: number;
}

```

## Roadmap

- [x] Basic Support
- [x] ExtendedType Field
- [x] Cli
- [x] Oneof Field
- [x] Map Field
- [x] Nested Type
- [x] Generate Global Declaration
- [x] Import (Generate Module)
- [ ] Other Options

## License
MIT
