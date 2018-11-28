import * as path from 'path';
import { compare } from '../utils';

describe('one of', () => {
  it('should generate one of', () => {
    const protoFileName = path.resolve(__dirname, './one-of.proto');
    const tsFileName = path.resolve(__dirname, './one-of.ts');
    compare(protoFileName, tsFileName);
  });
});
