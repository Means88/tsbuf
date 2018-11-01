import { IParserConfig, IToken, Lexer, Parser } from 'chevrotain';
import {
  EnumToken,
  EqualToken,
  IdentifierToken,
  ImportToken,
  IntegerToken,
  keywordTokens,
  LeftBracketToken,
  LineCommentToken,
  LineTerminatorToken,
  OptionToken,
  PackageToken,
  RightBracketToken,
  SemicolonToken,
  StringLiteralToken,
  SyntaxToken,
  tokens,
} from './token';
import {
  Comment,
  EnumDeclaration,
  EnumMember,
  Identifier,
  ImportStatement,
  IntegerLiteral,
  OptionStatement,
  PackageDeclaration,
  StringLiteral,
  SyntaxDeclaration,
} from './types';
import { endBy, startBy } from './utils';

const allTokens = [...keywordTokens, ...tokens];
export const ProtobufLexer = new Lexer(allTokens);

export class ProtobufParser extends Parser {
  public constructor(config?: IParserConfig) {
    super(allTokens, { outputCst: false, ...config });
    const p = this;
    const $: any = this;

    // // comment
    p.RULE(
      'lineComment',
      (): Comment => {
        const commentToken = p.CONSUME(LineCommentToken);
        return {
          type: 'CommentLine',
          value: commentToken.image,
          ...startBy(commentToken),
          ...endBy(commentToken),
        };
      },
    );

    // syntax = "proto3";
    p.RULE(
      'syntaxDeclaration',
      (): SyntaxDeclaration => {
        const syntaxToken = p.CONSUME(SyntaxToken);
        p.CONSUME(EqualToken);
        const valueNode = p.SUBRULE<StringLiteral>($.stringLiteral);
        const semiToken = p.CONSUME(SemicolonToken);
        return {
          type: 'SyntaxDeclaration',
          value: valueNode,
          ...startBy(syntaxToken),
          ...endBy(semiToken),
        };
      },
    );

    // package some_idl;
    p.RULE(
      'packageDeclaration',
      (): PackageDeclaration => {
        const packageToken = p.CONSUME(PackageToken);
        const idNode = p.SUBRULE<Identifier>($.identifier);
        const semiToken = p.CONSUME(SemicolonToken);
        return {
          type: 'PackageDeclaration',
          id: idNode,
          ...startBy(packageToken),
          ...endBy(semiToken),
        };
      },
    );

    // import "something_else.proto";
    p.RULE(
      'importStatement',
      (): ImportStatement => {
        const importToken = p.CONSUME(ImportToken);
        const valueNode = p.SUBRULE<StringLiteral>($.stringLiteral);
        const semiToken = p.CONSUME(SemicolonToken);
        return {
          type: 'ImportStatement',
          value: valueNode,
          ...startBy(importToken),
          ...endBy(semiToken),
        };
      },
    );

    // option go_package = "means88.com/go/pkg";
    p.RULE(
      'optionStatement',
      (): OptionStatement => {
        const optionToken = p.CONSUME(OptionToken);
        const idNode = p.SUBRULE<Identifier>($.identifier);
        p.CONSUME(EqualToken);
        const valueNode = p.SUBRULE<StringLiteral>($.stringLiteral);
        const semiToken = p.CONSUME(SemicolonToken);
        return {
          type: 'OptionStatement',
          id: idNode,
          value: valueNode,
          ...startBy(optionToken),
          ...endBy(semiToken),
        };
      },
    );

    p.RULE(
      'enumMember',
      (): EnumMember => {
        const identifier = p.SUBRULE<Identifier>($.identifier);
        p.CONSUME(EqualToken);
        const integerNode = p.SUBRULE<IntegerLiteral>($.integerLiteral);
        const semiToken = p.CONSUME(SemicolonToken);
        return {
          type: 'EnumMember',
          id: identifier,
          value: integerNode,
          ...startBy(identifier),
          ...endBy(semiToken),
        };
      },
    );

    /**
     * enum Fruit {
     *   Apple = 1;
     *   Banana = 2;
     * }
     */
    p.RULE(
      'enumDeclaration',
      (): EnumDeclaration => {
        const enumToken = p.CONSUME(EnumToken);
        const identifier = p.SUBRULE<Identifier>($.identifier);
        const members: EnumMember[] = [];
        p.CONSUME(LeftBracketToken);
        p.MANY(() => {
          members.push(p.SUBRULE<EnumMember>($.enumMember));
        });
        const rightBracketToken = p.CONSUME(RightBracketToken);
        return {
          type: 'EnumDeclaration',
          id: identifier,
          members,
          ...startBy(enumToken),
          ...endBy(rightBracketToken),
        };
      },
    );

    // "string"
    p.RULE(
      'stringLiteral',
      (): StringLiteral => {
        const stringToken = p.CONSUME(StringLiteralToken);
        return {
          type: 'StringLiteral',
          value: stringToken.image.slice(1, -1),
          ...startBy(stringToken),
          ...endBy(stringToken),
        };
      },
    );

    // 123
    p.RULE(
      'integerLiteral',
      (): IntegerLiteral => {
        const integerToken = p.CONSUME(IntegerToken);
        return {
          type: 'IntegerLiteral',
          value: parseInt(integerToken.image, 10),
          ...startBy(integerToken),
          ...endBy(integerToken),
        };
      },
    );

    p.RULE(
      'identifier',
      (): Identifier => {
        const idToken = p.CONSUME(IdentifierToken);
        return {
          type: 'Identifier',
          name: idToken.image,
          ...startBy(idToken),
          ...endBy(idToken),
        };
      },
    );

    this.performSelfAnalysis();
  }
}
