import * as path from 'path';
import { compare } from '../utils';

describe('enum', () => {
  it('should generate enum', () => {
    const protoFileName = path.resolve(__dirname, './enum.proto');
    const tsFileName = path.resolve(__dirname, './enum.ts');
    compare(protoFileName, tsFileName);
  });
});
