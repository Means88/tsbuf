import { GenerateMode } from './const';

export const generateEnum = (mode: GenerateMode = GenerateMode.Global) => (ast: Enum): string =>
  `
    ${mode === GenerateMode.Global ? 'declare' : 'export'} enum ${ast.name.name} {
      ${ast.body.map((f: EnumField): string => `${f.name.name} = ${f.value.value},`).join('\n')}
    }
  `;
