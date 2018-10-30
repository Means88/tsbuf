export interface BaseNode {
  type: string;
  startLine?: number;
  endLine?: number;
  startColumn?: number;
  endColumn?: number;
  startOffset?: number;
  endOffset?: number;
  // fileName: string;
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
  value: StringLiteral;
}

export interface PackageDeclaration extends BaseNode {
  type: 'PackageDeclaration';
  id: Identifier;
}

export interface OptionStatement extends BaseNode {
  type: 'OptionStatement';
  id: Identifier;
  value: StringLiteral;
}

// statements

export type Statement = Node;

export interface ImportStatement extends BaseNode {
  type: 'ImportStatement';
  value: StringLiteral;
}

export interface BlockStatement extends BaseNode {
  type: 'BlockStatement';
  body: Statement[];
}

export interface RangeStatement extends BaseNode {
  type: 'RangeStatement';
  from: NumbericLiteral;
  to: NumbericLiteral;
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
  repeated: boolean;
  value: KeywordType | Identifier;
}

export interface MessageDeclarationMember extends BaseNode {
  type: 'MessageDeclarationMember';
  typeAnnotation: TypeAnnotation;
  id: Identifier;
  value: NumbericLiteral;
}

export interface MessageReversedValue extends BaseNode {
  type: 'MessageReversedValue';
  value: NumbericLiteral | RangeStatement | StringLiteral;
}

export interface MessageReversedMember extends BaseNode {
  type: 'MessageReversedMember';
  reversedType: 'string' | 'number';
  value: MessageReversedValue[];
}

export type MessageMember = MessageDeclarationMember | MessageReversedMember;

export interface MessageDeclaration extends BaseNode {
  type: 'MessageDeclaration';
  id: Identifier;
  members: MessageMember[];
}
