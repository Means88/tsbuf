import { expect } from 'chai';
import { ProtobufLexer, ProtobufParser } from '../src/parser';

const member = 'Apple = 1;';

const content = `
enum Fruit {
  Apple = 1;
  Banana = 2;
}
`;

describe('syntax', () => {
  it('should parse enum member', () => {
    const result = ProtobufLexer.tokenize(member);
    const parser = new ProtobufParser();
    parser.input = result.tokens;
    const ast = (parser as any).enumMember();
    expect(ast.type).to.equal('EnumMember');
    expect(ast.id.type).to.equal('Identifier');
    expect(ast.id.name).to.equal('Apple');
    expect(ast.value.type).to.equal('IntegerLiteral');
    expect(ast.value.value).to.equal(1);
  });

  it('should parse enum declaration', () => {
    const result = ProtobufLexer.tokenize(content.trim());
    const parser = new ProtobufParser();
    parser.input = result.tokens;
    const ast = (parser as any).enumDeclaration();
    expect(ast.type).to.equal('EnumDeclaration');
    expect(ast.id.type).to.equal('Identifier');
    expect(ast.id.name).to.equal('Fruit');
    expect(ast.members.length).to.equal(2);
  });
});
