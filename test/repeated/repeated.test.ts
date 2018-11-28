import * as path from 'path';
import { compare } from '../utils';

describe('repeated', () => {
  it('should generate repeated field', () => {
    const protoFileName = path.resolve(__dirname, './repeated.proto');
    const tsFileName = path.resolve(__dirname, './repeated.ts');
    compare(protoFileName, tsFileName);
  });
});
