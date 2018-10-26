export interface BaseNode {
  type: string;
  start: number;
  end: number;
  fileName: string;
}

export type Node = BaseNode & { [key: string]: any };

export interface Comment extends BaseNode {
  type: 'CommentBlock' | 'CommentLine';
  value: string;
}

export interface NumbericLiteral extends BaseNode {
  type: 'NumericLiteral';
  value: number;
}

export interface StringLiteral extends BaseNode {
  type: 'StringLiteral';
  value: string;
}

export type KeywordType =
  | 'DoubleKeyword'
  | 'FloatKeyword'
  | 'Int32Keyword'
  | 'Int64Keyword'
  | 'UInt32Keyword'
  | 'UInt64Keyword'
  | 'SInt32Keyword'
  | 'SInt64Keyword'
  | 'Fixed32Keyword'
  | 'Fixed64Keyword'
  | 'SFixed32Keyword'
  | 'SFixed64Keyword'
  | 'BoolKeyword'
  | 'StringKeyword'
  | 'BytesKeyword';

export interface Identifier extends BaseNode {
  type: 'Identifier';
  name: string;
}

// declarations

export interface SyntaxDeclaration extends BaseNode {
  type: 'SyntaxDeclaration';
  value: 'proto2' | 'proto3';
}

export interface PackageDeclaration extends BaseNode {
  type: 'PackageDeclaration';
  value: string;
}

export interface OptionDeclaration extends BaseNode {
  type: 'OptionDeclaration';
  name: string;
  value: string;
}

// statements

export type Statement = Node;

export interface BlockStatement extends BaseNode {
  type: 'BlockStatement';
  body: Statement[];
}

// enum

export interface EnumMember extends BaseNode {
  type: 'EnumMember';
  id: Identifier;
  value: NumbericLiteral;
}

export interface EnumDeclaration extends BaseNode {
  type: 'EnumDeclaration';
  id: Identifier;
  members: EnumMember[];
}

// message

export interface TypeAnnotation extends BaseNode {
  type: 'TypeAnnotation';
  optional: boolean;
  value: KeywordType | Identifier;
}

export interface MessageMember extends BaseNode {
  type: 'MessageMember';
  typeAnnotation: TypeAnnotation;
  id: Identifier;
  value: NumbericLiteral;
}

export interface MessageDeclaration extends BaseNode {
  type: 'MessageDeclaration';
  id: Identifier;
  members: MessageMember[];
}
