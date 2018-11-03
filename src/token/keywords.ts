import { createToken, ITokenConfig, Lexer, TokenType } from 'chevrotain';

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

export const MessageToken = c({
  name: 'MessageToken',
  pattern: /\bmessage\b/,
});

export const EnumToken = c({
  name: 'EnumToken',
  pattern: /\benum\b/,
});

const FieldRuleKeywordToken = createToken({
  name: 'FieldRuleKeywordToken',
  pattern: Lexer.NA,
});

export const RepeatedToken = c({
  name: 'RepeatedToken',
  pattern: '\brepeated\b',
  categories: [FieldRuleKeywordToken],
});

export const RequiredToken = c({
  name: 'RequiredToken',
  pattern: '\brequired\b',
  categories: [FieldRuleKeywordToken],
});

export const OptionalToken = c({
  name: 'OptionalToken',
  pattern: '\boptional\b',
  categories: [FieldRuleKeywordToken],
});

export const DefaultToken = c({
  name: 'DefaultToken',
  pattern: '\bdefault\b',
});

// types
export const KeywordTypeToken = c({
  name: 'KeywordTypeToken',
  pattern: Lexer.NA,
});

function d(config: ITokenConfig): TokenType {
  const token = c(config);
  if (!token.CATEGORIES) {
    token.CATEGORIES = [];
  }
  token.CATEGORIES.push(KeywordTypeToken);
  return token;
}

export const DoubleToken = d({
  name: 'DoubleToken',
  pattern: /\bdouble\b/,
});

export const FloatToken = d({
  name: 'FloatToken',
  pattern: /\bfloat\b/,
});

export const Int32Token = d({
  name: 'Int32Token',
  pattern: /\bint32\b/,
});

export const Int64Token = d({
  name: 'Int64Token',
  pattern: /\bint64\b/,
});

export const UInt32Token = d({
  name: 'UInt32Token',
  pattern: /\buint32\b/,
});

export const UInt64Token = d({
  name: 'UInt64Token',
  pattern: /\buint64\b/,
});

export const SInt32Token = d({
  name: 'SInt32Token',
  pattern: /\bsint32\b/,
});

export const SInt64Token = d({
  name: 'SInt64Token',
  pattern: /\bsint64\b/,
});

export const Fixed32Token = d({
  name: 'Fixed32Token',
  pattern: /\bfixed32\b/,
});

export const Fixed64Token = d({
  name: 'Fixed64Token',
  pattern: /\bfixed64\b/,
});

export const SFixed32Token = d({
  name: 'SFixed32Token',
  pattern: /\bsfixed32\b/,
});

export const SFixed64Token = d({
  name: 'SFixed64Token',
  pattern: /\bsfixed64\b/,
});

export const BoolToken = d({
  name: 'BoolToken',
  pattern: /\bbool\b/,
});

export const StringToken = d({
  name: 'StringToken',
  pattern: /\bstring\b/,
});

export const BytesToken = d({
  name: 'BytesToken',
  pattern: /\bbytes\b/,
});
