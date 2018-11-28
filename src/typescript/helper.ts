import * as prettier from 'prettier';

export interface InterfaceTreeNormalField {
  type: 'normal';
  typeName: Type;
  name: string;
  repeated: boolean;
}

export interface InterfaceTreeMapField {
  type: 'map';
  typeName: Type;
  name: string;
  repeated?: false;
}

type InterfaceTreeField = InterfaceTreeNormalField | InterfaceTreeMapField;

export interface InterfaceTree {
  node: {
    name: string;
    fields: InterfaceTreeField[];
  };
  children: InterfaceTree[];
}

export enum GenerateMode {
  Global = 'global',
  Module = 'module',
}

const generateEnum = (mode: GenerateMode = GenerateMode.Global) => (ast: Enum): string =>
  `
    ${mode === GenerateMode.Global ? 'declare' : 'export'} enum ${ast.name.name} {
      ${ast.body.map((f: EnumField): string => `${f.name.name} = ${f.value.value},`).join('\n')}
    }
  `;

function getType(field: InterfaceTreeField, it: InterfaceTree): string {
  const scopeNames = it.children.map(c => c.node.name);
  const name = typeMapping(field.typeName);
  let fullName = scopeNames.indexOf(name) === -1 ? name : `${it.node.name}.${name}`;
  if (field.repeated) {
    fullName += '[]';
  }
  return fullName;
}

function generateNormalField(f: InterfaceTreeNormalField, it: InterfaceTree): string {
  return `${f.name}: ${getType(f, it)};`;
}

function generateMapField(f: InterfaceTreeMapField, it: InterfaceTree): string {
  return `${f.name}: {
    [key: string]: ${getType(f, it)},
  };`;
}

const generateInterface = (mode: GenerateMode) => (i: InterfaceTree): string =>
  `
${mode === GenerateMode.Global ? '' : 'export '}interface ${i.node.name} {
  ${i.node.fields
    .map((f: InterfaceTreeField) => {
      if (f.type === 'normal') {
        return generateNormalField(f, i);
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

export function exportText(result: any, mode: GenerateMode = GenerateMode.Global): string {
  const enums: string = result.enums.map(generateEnum(mode)).join('\n');
  const interfaces: string = result.interfaces.map((i: InterfaceTree) => generateInterface(mode)(i)).join('\n');
  const text = enums + interfaces;
  return prettier.format(text, { parser: 'typescript' });
}

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
