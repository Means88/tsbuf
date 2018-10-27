import { expect } from 'chai';
import { readFileSync } from 'fs';
import * as path from 'path';
import { ProtobufLexer, ProtobufParser } from "../../src/parser";

const content = readFileSync(path.resolve(__dirname, './comment.proto')).toString('utf-8');

describe('comment', () => {
  it('should read file successfully', () => {
    expect(content).to.equal('// comment\n');
  });

  it('should parse line comment', () => {
    const result = ProtobufLexer.tokenize(content);
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
