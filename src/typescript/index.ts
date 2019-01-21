import * as prettier from 'prettier';

import { GenerateMode, RPCMethodType } from './generator/const';
import { generateEnum } from './generator/enum';
import { generateInterface, InterfaceTree } from './generator/interface';

export function exportSource(result: any, mode: GenerateMode = GenerateMode.Global, rpcMethodType: RPCMethodType = RPCMethodType.AsIs): string {
  const enums: string = result.enums.map(generateEnum(mode)).join('\n');
  const interfaces: string = result.interfaces.map((i: InterfaceTree) => generateInterface(mode, rpcMethodType)(i)).join('\n');
  const text = `${enums}\n${interfaces}`;
  return prettier.format(text, { parser: 'typescript' });
}

export { GenerateMode };
