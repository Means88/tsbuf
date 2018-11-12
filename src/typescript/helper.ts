import * as prettier from 'prettier';

export function exportText(result: any): string {
  const enums: string = result.enums.map(generateEnum).join('\n');
  const interfaces: string = result.interfaces.map(generateInterface).join('\n');
  const text = enums + interfaces;
  return prettier.format(text, { parser: 'typescript' });
}

export function generateEnum(ast: Enum): string {
  return `
    declare enum ${ast.name.name} {
      ${ast.body.map((f: EnumField): string => `${f.name.name} = ${f.value.value},`).join('\n')}
    }
  `;
}

export function generateInterface(ast: Message): string {
  return `
    interface ${ast.name.name} {
      ${ast.body.map((f: Field): string => `${f.name.name}: ${keywordTypeMapping(f.typeName as KeywordType)}`)}
    }
  `;
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
