import { typeMapping } from '../../util/type';
import { GenerateMode } from './const';

export interface RpcMethodField {
  type: 'rpc';
  name: string;
  argTypeName: Type;
  returnTypeName: Type;
}

export interface ServiceTree {
  name: string;
  methods: RpcMethodField[];
}

function generateGenrnicRpcMethod(method: RpcMethodField): string {
  return `${method.name}: {
    request: ${typeMapping(method.argTypeName)},
    response: ${typeMapping(method.returnTypeName)},
  };`;
}

export const generateService = (mode: GenerateMode) => (i: ServiceTree): string => `
${mode === GenerateMode.Global ? '' : 'export '}interface ${i.name} {
${i.methods.map(generateGenrnicRpcMethod).join('\n')}
}
`;
