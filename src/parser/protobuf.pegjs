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
      type: 'Identifier',
      name: text(),
    }
  }

FullIdent
  = Ident ("." Ident)* {
    return {
      type: 'FullIdentifier',
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
  = root:"."? path:(Ident ".")* name:MessageName {
    return {
      type: 'ExtendedType',
      identifier: name,
      root: Boolean(root),
      path: path ? path.map(i => i[0]) : [],
    }
  }

EnumType
  = root:"."? path:(Ident ".")* name:EnumName {
    return {
      type: 'ExtendedType',
      identifier: name,
      root: Boolean(root),
      path: path ? path.map(i => i[0]) : [],
    }
  }
// Integer Literals

IntLit
  = [-+]? _ DecimalLit { return { type: 'IntegerLiteral', value: parseInt(text(), 10) } }
  / [-+]? _ OctalLit  { return { type: 'IntegerLiteral', value: parseInt(text(), 8) } }
  / [-+]? _ HexLit { return { type: 'IntegerLiteral', value: parseInt(text(), 16) } }

DecimalLit
  = [1-9] DecimalDigit*

OctalLit
  = "0" OctalDigit*

HexLit
  = "0" [Xx] HexDigit+

// Floating-point literals

FloatLit
  = [-+]? _ (Decimals "." Decimals? Exponent? / Decimals Exponent / "." Decimals Exponent?) / "inf" / "nan" {
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
  = FullIdent
  / IntLit
  / FloatLit
  / StrLit
  / BoolLit

// Syntax

Syntax = "syntax" _ "=" _ Quote "proto3" Quote _ ";" {
  return {
    type: 'Syntax',
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
  = "package" _ identifier:FullIdent _ ";" {
    return {
      type: 'Package',
      identifier,
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
  = namespace:(Ident / "(" FullIdent ")") fields:("." Ident)* {
    return {
      type: 'OptionName',
      namespace: Array.isArray(namespace) ? namespace[1] : namespace,
      fields: fields && fields.map(i => i[1]),
    }
  }

// Field

Type = KeywordType / ExtendedType

ExtendedType
  = identifier:(EnumType / MessageType) {
    return identifier;
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
  = repeated:("repeated" _)? typeName:Type _ name:FieldName _ "=" _ value:FieldNumber _ options:FieldOptions? ";" {
    return {
      type: 'Field',
      repeated: Boolean(repeated),
      typeName,
      name,
      value,
      options,
    }
  }

FieldOptions
  = "[" _ head:FieldOption tail:(_ "," _ FieldOption)* _ "]" {
    return [head, ...(tail ? tail.map(i => i[3]) : [])];
  }

FieldOption
  = name:OptionName _ "=" _ value:Constant {
    return {
      type: 'FieldOption',
      name,
      value,
    }
  }

// Oneof and oneof field

Oneof
  = "oneof" _ name:OneofName __ "{" __ body:(__ (OneofField / EmptyStatement) __)* __ "}" {
    return {
      type: 'Oneof',
      name,
      body: body ? body.map(i => i[1]) : [],
    }
  }

OneofField
  = typeName:Type _ name:FieldName _ "=" _ value:FieldNumber _ options:("[" _ FieldOptions _ "]")? _ ";" {
    return {
      type: 'OneofField',
      typeName,
      name,
      value,
      options: options && options.map(o => o[2]),
    }
  }

// Map field

MapField
  = "map" _ "<" _ keyTypeName:KeyType _ "," _ valueTypeName:Type _ ">" _ name:MapName _ "=" _ value:FieldNumber _ options:("[" _ FieldOptions _ "]")? _ ";" {
    return {
      type: 'MapField',
      keyTypeName,
      valueTypeName,
      name,
      value,
      option: options && options[2],
    }
  }

KeyType
  = "int32" / "int64" / "uint32" / "uint64" / "sint32" / "sint64" /
    "fixed32" / "fixed64" / "sfixed32" / "sfixed64" / "bool" / "string" {
    return {
      type: 'KeywordType',
      typeName: text(),
    }
  }

// Reversed

Reversed
  = "reversed" _ value:(Ranges / FieldNames) _ ";" {
    return {
      type: 'Reversed',
      value,
    }
  }

Ranges
  = head:Range _ tails:("," _ Range)* {
    return {
      type: 'Ranges',
      values: [head, tails ? tails.map(i => i[2]) : []]
    }
  }

Range
  = from:IntLit _ to:("to" _ (IntLit / "max"))? {
    return {
      type: 'Range',
      from,
      to: to && to[2],
    }
  }

FieldNames
  = head:FieldName _ tail:("," _ FieldName)* {
    return {
      type: 'FieldNames',
      value: [head, ...(tail ? tail.map(i => i[2]) : [])]
    }
  }

// Top Level definitions

// Enum definition

Enum
  = "enum" _ name:EnumName __ body:EnumBody {
    return {
      type: 'Enum',
      name,
      body,
    }
  }

EnumBody
  = "{" __ body:(__ (Option / EnumField / EmptyStatement) __)* __ "}" {
    return body ? body.map(i => i[1]) : [];
  }

EnumField
  = name:Ident _ "=" _ value:IntLit _ options:EnumValueOptions? _ ";" {
    return {
      type: 'EnumField',
      name,
      value,
      options,
    }
  }

EnumValueOptions
  = "[" _ head:EnumValueOption _ tail:("," _ EnumValueOption)* _ "]" {
    return [head, ...(tail ? tail.map(i => i[2]) : [])];
  }

EnumValueOption
  = name:OptionName _ "=" _ value:Constant {
    return {
      type: 'EnumValueOption',
      name,
      value,
    }
  }

// Message definition

Message
  = "message" _ name:MessageName __ body:MessageBody {
    return {
      type: 'Message',
      name,
      body,
    }
  }

MessageBody
  = "{" body:(__ (Field / Enum / Message / Option / Oneof / MapField / Reversed / EmptyStatement) __)* "}" {
    return body ? body.map(i => i[1]) : [];
  }

// Service definition

Service
  = "service" _ name:ServiceName __ body:ServiceBody {
    return {
      type: 'Service',
      name,
      body,
    }
  }

ServiceBody
  = "{" __ body:(Option / Rpc / EmptyStatement)* __ "}" {
    return body;
  }

Rpc
  = "rpc" _ name:RpcName _ "(" _ argStream:"stream"? _ argTypeName:MessageType _ ")" _ "returns" _ "(" _ returnStream:"stream"? _ returnTypeName:MessageType _ ")" __ body:(RpcBody / ';') {
    return {
      type: 'Rpc',
      name,
      argStream: argStream !== null,
      argTypeName,
      returnStream: returnStream !== null,
      returnTypeName,
      body: body === ';' ? null : body,
    }
  }

RpcBody
  = "{" __ body:(Option / EmptyStatement)* __ "}" {
    return {
      type: 'RpcBody',
      body,
    }
  }

// Proto file

Proto
  = __ syntax:Syntax __ body:(__(Import / Package / Option / TopLevelDef / EmptyStatement)__)* __ {
    return {
      type: 'Proto',
      syntax,
      body: body && body.map(i => i[1]),
    }
  }

TopLevelDef
  = Message / Enum / Service
