import { expect } from 'chai';
import { ProtobufLexer, ProtobufParser } from '../src/parser';

describe('syntax', () => {
  it('should parse string literal', () => {
    const result = ProtobufLexer.tokenize('"string"');
    const parser = new ProtobufParser();
    parser.input = result.tokens;
    const ast = (parser as any).stringLiteral();
    expect(ast.type).to.equal('StringLiteral');
    expect(ast.value).to.equal('string');
  });

  it('should parse identifier', () => {
    const result = ProtobufLexer.tokenize('package_name');
    const parser = new ProtobufParser();
    parser.input = result.tokens;
    const ast = (parser as any).identifier();
    expect(ast.type).to.equal('Identifier');
    expect(ast.name).to.equal('package_name');
  });
});
