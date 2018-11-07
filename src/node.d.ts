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
  identify: Identify;
}

interface Option extends BaseNode {
  type: 'Option';
  name: OptionName;
  value: Constant;
}

interface OptionName extends BaseNode {
  type: 'OptionName';
  namespace: Identify | FullIdentify;
  fields: Identify[];
}

interface Enum extends BaseNode {
  type: 'Enum';
  name: Identify;
  body: [];
}

interface EnumField extends BaseNode {
  type: 'EnumField';
  name: Identify;
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
  name: Identify;
  body: [];
}

interface Field extends BaseNode {
  type: 'Field';
  repeated: boolean;
  typeName: Type;
  name: Identify;
  value: IntegerLiteral;
  options: Nullable<FieldOption[]>;
}

interface MapField extends BaseNode {
  type: 'MapField';
  keyTypeName: Type;
  valueTypeName: Type;
  name: Identify;
  value: IntegerLiteral;
  options: Nullable<FieldOption[]>;
}

interface Oneof extends BaseNode {
  type: 'OneofField';
  name: Identify;
  body: Array<OneofField | EmptyStatement>;
}

interface OneofField extends BaseNode {
  typeName: Type;
  name: Identify;
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
  name: Identify;
  root: boolean;
  path: Identify[];
}

type Constant = FullIdentify | StringLiteral | IntegerLiteral;

interface Identify extends BaseNode {
  type: 'Identify';
  name: string;
}

interface FullIdentify extends BaseNode {
  type: 'FullIdentify';
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
