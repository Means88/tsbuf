import { expect } from 'chai';
import { ProtobufLexer, ProtobufParser } from "../src/parser";

describe('syntax', () => {
  it('should parse package declaration', () => {
    const result = ProtobufLexer.tokenize('package package_idl;');
    const parser = new ProtobufParser();
    parser.input = result.tokens;
    const ast = (parser as any).packageDeclaration();
    expect(ast.type).to.equal('PackageDeclaration');
    expect(ast.id.type).to.equal('Identifier');
    expect(ast.id.name).to.equal('package_idl');
  });
});
