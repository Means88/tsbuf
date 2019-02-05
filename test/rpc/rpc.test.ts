import * as path from 'path';
import { compare } from '../utils';

describe('rpc', () => {
  it('should generate rpc field', () => {
    const protoFileName = path.resolve(__dirname, './rpc.proto');
    const tsFileName = path.resolve(__dirname, './rpc.ts');
    compare(protoFileName, tsFileName);
  });
});
