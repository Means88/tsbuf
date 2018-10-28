import { createToken, ITokenConfig, Lexer, TokenType } from "chevrotain";

export const keywordTokens: TokenType[] = [];

const Keyword = createToken({
  name: 'Keyword',
  pattern: Lexer.NA,
});

function c(config: ITokenConfig): TokenType {
  const token = createToken(config);
  if (!token.CATEGORIES) {
    token.CATEGORIES = [];
  }
  token.CATEGORIES.push(Keyword);
  keywordTokens.push(token);
  return token;
}

export const SyntaxToken = c({
  name: 'SyntaxToken',
  pattern: /\bsyntax\b/,
});

export const PackageToken = c({
  name: 'PackageToken',
  pattern: /\bpackage\b/,
});

export const ImportToken = c({
  name: 'ImportToken',
  pattern: /\bimport\b/,
});

export const OptionToken = c({
  name: 'OptionToken',
  pattern: /\boption\b/,
});
