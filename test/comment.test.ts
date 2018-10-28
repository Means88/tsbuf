import { expect } from 'chai';
import { ProtobufLexer, ProtobufParser } from "../src/parser";

describe('comment', () => {
  it('should parse line comment', () => {
    const result = ProtobufLexer.tokenize('// comment');
    const parser = new ProtobufParser();
    parser.input = result.tokens;
    const ast = (parser as any).lineComment();
    expect(ast.type).to.equal('CommentLine');
    expect(ast.value).to.equal('// comment');
    expect(ast.startLine).to.equal(1);
    expect(ast.endLine).to.equal(1);
    expect(ast.startColumn).to.equal(1);
    expect(ast.endColumn).to.equal(10);
    expect(ast.startOffset).to.equal(0);
    expect(ast.endOffset).to.equal(9);
  });
});
