import * as prettier from 'prettier';

import { GenerateMode } from './generator/const';
import { generateEnum } from './generator/enum';
import { generateInterface, InterfaceTree } from './generator/interface';
import { generateService, ServiceTree } from './generator/service';

function isGenerateMode(a: any): a is GenerateMode {
  return a === GenerateMode.Global || a === GenerateMode.Module;
}

export function exportSource(result: any, mode: GenerateMode = GenerateMode.Global): string {
  const services: string = result.services.map((i: ServiceTree) => generateService(mode)(i)).join('\n');
  const enums: string = result.enums.map(generateEnum(mode)).join('\n');
  const interfaces: string = result.interfaces.map((i: InterfaceTree) => generateInterface(mode)(i)).join('\n');
  const text = `${services}\n${enums}\n${interfaces}`;
  return prettier.format(text, { parser: 'typescript' });
}

export { GenerateMode };
