import { expect } from 'chai';
import { ProtobufLexer, ProtobufParser } from "../src/parser";

describe('syntax', () => {
  it('should parse package declaration', () => {
    const result = ProtobufLexer.tokenize('option go_package = "means88.com/go/pkg";');
    const parser = new ProtobufParser();
    parser.input = result.tokens;
    const ast = (parser as any).optionStatement();
    expect(ast.type).to.equal('OptionStatement');
    expect(ast.id.type).to.equal('Identifier');
    expect(ast.id.name).to.equal('go_package');
    expect(ast.value.type).to.equal('StringLiteral');
    expect(ast.value.value).to.equal('means88.com/go/pkg');
  });
});
