# tsbuf  [![npm@version](https://img.shields.io/npm/v/tsbuf.svg)](https://www.npmjs.com/package/tsbuf) [![Build Status](https://travis-ci.org/Means88/tsbuf.svg?branch=master)](https://travis-ci.org/Means88/tsbuf)

Generate TypeScript enum and interface with proto buffer.

## Usage
```bash
npm install -g protobuf-parser
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
