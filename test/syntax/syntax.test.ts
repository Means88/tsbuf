import { expect } from 'chai';
import { readFileSync } from 'fs';
import * as path from 'path';
import { ProtobufLexer, ProtobufParser } from "../../src/parser";

const content = readFileSync(path.resolve(__dirname, './syntax.proto')).toString('utf-8');

describe('syntax', () => {
  it('should parse syntax statement', () => {
    const result = ProtobufLexer.tokenize(content);
    const parser = new ProtobufParser();
    parser.input = result.tokens;
    const ast = (parser as any).syntaxDeclaration();
    expect(ast.type).to.equal('SyntaxDeclaration');
    expect(ast.value.type).to.equal('StringLiteral');
    expect(ast.value.value).to.equal('proto3');
  });
});
