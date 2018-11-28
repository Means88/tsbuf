type Nullable<T> = T | null;

interface BaseNode {
  type: string;
}

interface Proto extends BaseNode {
  type: 'Proto';
  syntax: Syntax;
  body: [];
}

interface Syntax extends BaseNode {
  type: 'Syntax';
  version: 'proto3';
}

interface ImportStatement extends BaseNode {
  type: 'ImportStatement';
  path: StringLiteral;
  public: boolean;
}

interface Package extends BaseNode {
  type: 'Package';
  identify: Identifier;
}

interface Option extends BaseNode {
  type: 'Option';
  name: OptionName;
  value: Constant;
}

interface OptionName extends BaseNode {
  type: 'OptionName';
  namespace: Identifier | FullIdentifier;
  fields: Identifier[];
}

interface Enum extends BaseNode {
  type: 'Enum';
  name: Identifier;
  body: EnumField[];
}

interface EnumField extends BaseNode {
  type: 'EnumField';
  name: Identifier;
  value: IntegerLiteral;
  options: Nullable<EnumValueOption[]>;
}

interface EnumValueOption extends BaseNode {
  type: 'EnumValueOption';
  name: OptionName;
  value: Constant;
}

interface Message extends BaseNode {
  type: 'Message';
  name: Identifier;
  body: Array<Field | Message | MapField | Oneof>;
}

interface Field extends BaseNode {
  type: 'Field';
  repeated: boolean;
  typeName: Type;
  name: Identifier;
  value: IntegerLiteral;
  options: Nullable<FieldOption[]>;
}

interface MapField extends BaseNode {
  type: 'MapField';
  keyTypeName: Type;
  valueTypeName: Type;
  name: Identifier;
  value: IntegerLiteral;
  options: Nullable<FieldOption[]>;
}

interface Oneof extends BaseNode {
  type: 'Oneof';
  name: Identifier;
  body: Array<OneofField | EmptyStatement>;
}

interface OneofField extends BaseNode {
  type: 'OneofField';
  typeName: Type;
  name: Identifier;
  value: IntegerLiteral;
  options: Nullable<FieldOption[]>;
}

interface FieldOption extends BaseNode {
  type: 'FieldOption';
  name: OptionName;
  value: Constant;
}

type Type = KeywordType | ExtendedType;

interface KeywordType extends BaseNode {
  type: 'KeywordType';
  typeName: string;
}

interface ExtendedType extends BaseNode {
  type: 'ExtendedType';
  identifier: Identifier;
  root: boolean;
  path: Identifier[];
}

type Constant = FullIdentifier | StringLiteral | IntegerLiteral;

interface Identifier extends BaseNode {
  type: 'Identifier';
  name: string;
}

interface FullIdentifier extends BaseNode {
  type: 'FullIdentifier';
  name: string;
}

interface StringLiteral extends BaseNode {
  type: 'StringLiteral';
  value: string;
}

interface IntegerLiteral extends BaseNode {
  type: 'IntegerLiteral';
  value: number;
}

interface EmptyStatement extends BaseNode {
  type: 'EmptyStatement';
}
