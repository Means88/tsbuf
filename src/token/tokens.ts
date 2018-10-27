import { createToken, ITokenConfig, Lexer, TokenType } from "chevrotain";

export const tokens: TokenType[] = [];

function c(config: ITokenConfig): TokenType {
  const token = createToken(config);
  tokens.push(token);
  return token;
}

export const WhitespaceToken = c({
  name: 'WhitespaceToken',
  pattern: /[ \t\f]+/,
  group: Lexer.SKIPPED,
});

export const SemicolonToken = c({
  name: 'SemicolonToken',
  pattern: /;/,
});

export const LineTerminatorToken = c({
  name: 'LineTerminatorToken',
  pattern: /\n|\r|\r\n/,
  line_breaks: true,
});

export const LineCommentToken = c({
  name: 'LineCommentToken',
  pattern: /\/\/.*/,
});

export const EqualToken = c({
  name: 'EqualToken',
  pattern: /=/,
});

export const StringLiteralToken = c({
  name: 'StringLiteralToken',
  pattern: /"[^"]*"/,
});

