import { GenerateMode } from './const';

export interface InterfaceTreeNormalField {
  type: 'normal';
  typeName: Type;
  name: string;
  repeated: boolean;
  optional?: boolean;
}

export interface InterfaceTreeRpc {
  type: 'rpc';
  typeName: Type;
  name: string;
  argTypeName: Type;
  returnTypeName: Type;
  optional?: boolean;
  repeated?: boolean
}

export interface InterfaceTreeMapField {
  type: 'map';
  typeName: Type;
  name: string;
  repeated?: false;
  optional?: boolean;
}

type InterfaceTreeField = InterfaceTreeNormalField | InterfaceTreeMapField | InterfaceTreeRpc;

export interface InterfaceTree {
  node: {
    name: string;
    fields: InterfaceTreeField[];
  };
  children: InterfaceTree[];
}

function getType(field: InterfaceTreeField, it: InterfaceTree): string {
  const scopeNames = it.children.map(c => c.node.name);
  const name = typeMapping(field.typeName);
  let fullName = scopeNames.indexOf(name) === -1 ? name : `${it.node.name}.${name}`;
  if (field.repeated) {
    fullName += '[]';
  }
  return fullName;
}

function getRpcArgTypeName(field: InterfaceTreeRpc, it: InterfaceTree): string {
  const scopeNames = it.children.map(c => c.node.name);
  const name = typeMapping(field.argTypeName);
  let fullName = scopeNames.indexOf(name) === -1 ? name : `${it.node.name}.${name}`;
  if (field.repeated) {
    fullName += '[]';
  }
  return fullName;
}

function getRpcArgReturnTypeName(field: InterfaceTreeRpc, it: InterfaceTree): string {
  const scopeNames = it.children.map(c => c.node.name);
  const name = typeMapping(field.returnTypeName);
  let fullName = scopeNames.indexOf(name) === -1 ? name : `${it.node.name}.${name}`;
  if (field.repeated) {
    fullName += '[]';
  }
  return fullName;
}

function generateRpc(f: InterfaceTreeRpc, it: InterfaceTree): string {
  return `${f.name.charAt(0).toLowerCase() + f.name.substr(1)}(request: ${getRpcArgTypeName(f, it)}): Observable<${getRpcArgReturnTypeName(f, it)}>;`
}

function generateNormalField(f: InterfaceTreeNormalField, it: InterfaceTree): string {
  return `${f.name}${f.optional ? '?' : ''}: ${getType(f, it)};`;
}

function generateMapField(f: InterfaceTreeMapField, it: InterfaceTree): string {
  return `${f.name}${f.optional ? '?' : ''}: {
    [key: string]: ${getType(f, it)},
  };`;
}

export const generateInterface = (mode: GenerateMode) => (i: InterfaceTree): string =>
  `
${mode === GenerateMode.Global ? '' : 'export '}interface ${i.node.name} {
  ${i.node.fields
    .map((f: InterfaceTreeField) => {
      if (f.type === 'normal') {
        return generateNormalField(f, i);
      }
      if (f.type === 'rpc') {
        return generateRpc(f, i);
      }
      if (f.type === 'map') {
        return generateMapField(f, i);
      }
      return '';
    })
    .join('')}
}

${
    i.children.length <= 0
      ? ''
      : `${mode === GenerateMode.Global ? 'declare' : 'export'} namespace ${i.node.name} {
  ${i.children.map(j => generateInterface(GenerateMode.Module)(j)).join('\n')}
}`
  }`;

function typeMapping(typeName: Type): string {
  if (typeName.type === 'KeywordType') {
    return keywordTypeMapping(typeName);
  }
  return extendedTypeMapping(typeName);
}

function keywordTypeMapping(typeName: KeywordType): string {
  const map: any = {
    bool: 'boolean',
    string: 'string',
    bytes: 'string',

    int32: 'number',
    fixed32: 'number',
    uint32: 'number',
    sint32: 'number',
    sfixed32: 'number',

    int64: 'string',
    fixed64: 'string',
    uint64: 'string',
    sint64: 'string',
    sfixed64: 'string',

    float: 'number',
    double: 'number',
  };
  return map[typeName.typeName] || 'any';
}

function extendedTypeMapping(typeName: ExtendedType): string {
  if (!typeName.path || typeName.path.length === 0) {
    return typeName.identifier.name;
  }
  return [...typeName.path.map(id => id.name), typeName.identifier.name].join('.');
}
