import { camelCase } from '../../util/string';
import { typeMapping } from '../../util/type';
import { GenerateMode } from './const';

export interface InterfaceTreeNormalField {
  type: 'normal';
  typeName: Type;
  name: string;
  repeated: boolean;
  optional?: boolean;
}

export interface InterfaceTreeMapField {
  type: 'map';
  typeName: Type;
  name: string;
  repeated?: false;
  optional?: boolean;
}

type InterfaceTreeField = InterfaceTreeNormalField | InterfaceTreeMapField;

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
