import { expect } from 'chai';
import { ProtobufLexer, ProtobufParser } from '../src/parser';

describe('syntax', () => {
  it('should parse import statement', () => {
    const result = ProtobufLexer.tokenize('import "../comment/comment.proto";');
    const parser = new ProtobufParser();
    parser.input = result.tokens;
    const ast = (parser as any).importStatement();
    expect(ast.type).to.equal('ImportStatement');
    expect(ast.value.type).to.equal('StringLiteral');
    expect(ast.value.value).to.equal('../comment/comment.proto');
  });
});
