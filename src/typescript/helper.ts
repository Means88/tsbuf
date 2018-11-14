import * as prettier from 'prettier';

export enum GenerateMode {
  Global = 0,
  MODULE = 1,
}

const generateEnum = (mode: GenerateMode = GenerateMode.Global) => (ast: Enum): string =>
  `
    ${mode === GenerateMode.Global ? 'declare' : 'export'} enum ${ast.name.name} {
      ${ast.body.map((f: EnumField): string => `${f.name.name} = ${f.value.value},`).join('\n')}
    }
  `;

const generateInterface = (mode: GenerateMode = GenerateMode.Global) => (ast: Message): string =>
  `
    ${mode === GenerateMode.Global ? '' : 'export '}interface ${ast.name.name} {
      ${ast.body.map((f: Field): string => `${f.name.name}: ${typeMapping(f.typeName as KeywordType)}`)}
    }
  `;

export function exportText(result: any, mode: GenerateMode = GenerateMode.Global): string {
  const enums: string = result.enums.map(generateEnum(mode)).join('\n');
  const interfaces: string = result.interfaces.map(generateInterface(mode)).join('\n');
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
  return typeName.identifier.name;
}
