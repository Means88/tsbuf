import * as prettier from 'prettier';

import { GenerateMode } from './generator/const';
import { generateEnum } from './generator/enum';
import { generateInterface, InterfaceTree } from './generator/interface';

export function exportSource(result: any, mode: GenerateMode = GenerateMode.Global): string {
  const enums: string = result.enums.map(generateEnum(mode)).join('\n');
  const interfaces: string = result.interfaces.map((i: InterfaceTree) => generateInterface(mode)(i)).join('\n');
  const text = `${enums}\n${interfaces}`;
  return prettier.format(text, { parser: 'typescript' });
}

export { GenerateMode };
