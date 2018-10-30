import { createToken, ITokenConfig, Lexer, TokenType } from 'chevrotain';

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
  // group: "singleLineComments"
});

export const EqualToken = c({
  name: 'EqualToken',
  pattern: /=/,
});

export const StringLiteralToken = c({
  name: 'StringLiteralToken',
  pattern: /"(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/,
});

export const IdentifierToken = c({
  name: 'IdentifierToken',
  pattern: /[a-zA-Z_][a-zA-Z_0-9]*/,
});
