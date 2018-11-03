Top
  = Proto

// Skip
__
  = (WhiteSpace / LineTerminatorSequence / Comment)*

_
  = (WhiteSpace / MultiLineCommentNoLineTerminator)*

// Separator, Space
Zs = [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]

WhiteSpace "whitespace"
  = "\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"
  / Zs

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

SourceCharacter
  = .

Comment
  = MultiLineComment / SingleLineComment

MultiLineComment
  = "/*" (!"*/" SourceCharacter)* "*/"

MultiLineCommentNoLineTerminator
  = "/*" (!("*/" / LineTerminator) SourceCharacter)* "*/"

SingleLineComment
  = "//" (!LineTerminator SourceCharacter)*

// Letters and digits
Letter
  = [A-Za-z]

DecimalDigit
  = [0-9]

OctalDigit
  = [0-7]

HexDigit
  = [0-9A-Fa-f]


// Identifiers
Ident
  = Letter (Letter / DecimalDigit / "_")* {
    return {
      type: 'Identify',
      name: text(),
    }
  }

FullIdent
  = Ident ("." Ident)* {
    return {
      type: 'FullIdentify',
      name: text(),
    }
  }

MessageName
  = Ident

EnumName
  = Ident

FieldName
  = Ident

OneofName
  = Ident

MapName
  = Ident

ServiceName
  = Ident

RpcName
  = Ident

MessageType
  = "."? (Ident ".")? MessageName

EnumType
  = "."? (Ident ".") EnumName

// Integer Literals

IntLit
  = DecimalLit { return { type: 'IntegerLiteral', value: parseInt(text(), 10) } }
  / OctalLit  { return { type: 'IntegerLiteral', value: parseInt(text(), 8) } }
  / HexLit { return { type: 'IntegerLiteral', value: parseInt(text(), 16) } }

DecimalLit
  = [1-9] DecimalDigit*

OctalLit
  = "0" OctalDigit*

HexLit
  = "0" [Xx] HexDigit+

// Floating-point literals

FloatLit
  = (Decimals "." Decimals? Exponent? / Decimals Exponent / "." Decimals Exponent?) / "inf" / "nan" {
    return {
      type: 'FloatLiteral',
      value: parseFloat(text()),
    }
  }

Decimals
  = DecimalDigit+

Exponent
  = [Ee] [+-] Decimals

// Boolean

BoolLit
  = "true" / "false" { return { type: 'BooLiteral', value: text() === "true" }}

// String literals

StrLit
  = "'" str:SingleStringChar* "'" { return { type: 'StringLiteral', value: str.join('') }}
  / '"' str:DoubleStringChar* '"' { return { type: 'StringLiteral', value: str.join('') }}

SingleStringChar
  = HexEscape / OctEscape / CharEscape / [^\0\n\\']

DoubleStringChar
  = HexEscape / OctEscape / CharEscape / [^\0\n\\"]

CharValue
  = HexEscape / OctEscape / CharEscape / [^\0\n\\]

HexEscape
  = '\\' [Xx] HexDigit HexDigit

OctEscape
  = '\\' OctalDigit OctalDigit OctalDigit

CharEscape
  = '\\' [abfnrtv\\'"]

Quote
  = "'" / '"'

// EmptyStatement

EmptyStatement
  = ";"

// Constant

Constant
  = FullIdent / ([-+] _ IntLit) / ([-+] _ FloatLit) / StrLit / BoolLit

// Syntax

Syntax = "syntax" _ "=" _ Quote "proto3" Quote _ ";" {
  return {
    type: 'SyntaxStatement',
    version: 'proto3',
  }
}

// Import Statement

Import
  = "import" _ decorator:("weak" / "public")? _ path:StrLit _ ";" {
    return {
      type: "ImportStatement",
      path,
      public: decorator === "public",
    }
  }

// Package

Package
  = "package" _ identify:FullIdent _ ";" {
    return {
      type: 'PackageStatement',
      identify,
    }
  }

// Option

Option
  = "option" _ name:OptionName _ "=" _ value:Constant _ ";" {
    return {
      type: 'Option',
      name,
      value,
    }
  }

OptionName
  = (Ident / "(" FullIdent ")") ("." Ident)* {
    return text()
  }

// Field

Type = ExtendedType / KeyType

ExtendedType
  = identify:(EnumType / MessageType) {
    return {
      type: 'ExtendedType',
      identify,
    }
  }

KeywordType
  = ("double" / "float" / "int32" / "int64" / "uint32" / "uint64"
    / "sint32" / "sint64" / "fixed32" / "fixed64" / "sfixed32"
    / "sfixed64" / "bool" / "string" / "bytes") {
    return {
      type: 'KeywordType',
      typeName: text(),
    }
  }

FieldNumber = IntLit;

// Normal field

Field
  = ("repeated" _)? Type _ FieldName _ "=" _ FieldNumber _ ("[" _ FieldOptions _ "]")? ";"

FieldOptions
  = FieldOption (_ "," _ FieldOption)*

FieldOption
  = OptionName _ "=" _ Constant

// Oneof and oneof field

Oneof
  = "oneof" _ OneofName _ "{" _ (OneofField / EmptyStatement) _ "}"

OneofField
  = Type _ FieldName _ "=" _ FieldNumber _ ("[" _ FieldOptions _ "]") _ ";"

// Map field

MapField
  = "map" _ "<" _ KeyType _ "," _ Type _ ">" _ MapName _ "=" _ FieldNumber _ ("[" _ FieldOptions _ "]")? _ ";"

KeyType
  = "int32" / "int64" / "uint32" / "uint64" / "sint32" / "sint64" /
    "fixed32" / "fixed64" / "sfixed32" / "sfixed64" / "bool" / "string"

// Reversed

Reversed
  = "reversed" _ (Ranges / FieldNames) _ ";"

Ranges
  = Range _ ("," _ Range)*

Range
  = IntLit _ ("to" _ (IntLit / "max"))?

FieldNames
  = FieldName _ ("," _ FieldName)*

// Top Level definitions

// Enum definition

Enum
  = "enum" _ EnumName __ EnumBody

EnumBody
  = "{" __ (__ (Option / EnumField / EmptyStatement) __)* __ "}"

EnumField
  = Ident _ "=" _ IntLit _ ("[" _ EnumValueOption _ ("," _ EnumValueOption)* _ "]")? _ ";"

EnumValueOption
  = OptionName _ "=" _ Constant

// Message definition

Message
  = "message" _ MessageName __ MessageBody

MessageBody
  = "{" (__ (Field / Enum / Message / Option / Oneof / MapField / Reversed / EmptyStatement) __)* "}"

// Service definition

Service
  = "service" _ ServiceName __ "{" __ (Option / Rpc / EmptyStatement)* __ "}"

Rpc
  = "rpc" _ RpcName _ "(" _ "stream"? _ MessageType _ ")" _ "returns" _ "(" _ "stream"? _ MessageType _ ")" __ (("{" __ (Option / EmptyStatement) __ "}") / ";")

// Proto file

Proto
  = __ Syntax __ (__(Import / Package / Option / TopLevelDef / EmptyStatement)__)* __

TopLevelDef
  = Message / Enum / Service
