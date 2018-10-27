import { createToken, ITokenConfig, TokenType } from "chevrotain";

export const keywordTokens: TokenType[] = [];

function c(config: ITokenConfig): TokenType {
  const token = createToken(config);
  keywordTokens.push(token);
  return token;
}

export const SyntaxToken = c({
  name: 'SyntaxToken',
  pattern: /syntax/,
});

export const ImportToken = c({
  name: 'ImportToken',
  pattern: /import/,
});
