import { expect } from 'chai';
import { ProtobufLexer, ProtobufParser } from "../src/parser";

describe('syntax', () => {
  it('should parse syntax statement', () => {
    const result = ProtobufLexer.tokenize('syntax = "proto3";');
    const parser = new ProtobufParser();
    parser.input = result.tokens;
    const ast = (parser as any).syntaxDeclaration();
    expect(ast.type).to.equal('SyntaxDeclaration');
    expect(ast.value.type).to.equal('StringLiteral');
    expect(ast.value.value).to.equal('proto3');
  });
});
