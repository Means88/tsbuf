import * as path from 'path';
import { compare } from '../utils';

describe('namespace', () => {
  it('should generate namespace', () => {
    const fileName = path.resolve(__dirname, './namespace.proto');
    const tsFileName = path.resolve(__dirname, './namespace.ts');
    compare(fileName, tsFileName);
  });
});
