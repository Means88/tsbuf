import * as path from 'path';
import { compare } from '../utils';

describe('message', () => {
  it('should generate interface', () => {
    const protoFileName = path.resolve(__dirname, './message.proto');
    const tsFileName = path.resolve(__dirname, './message.ts');
    compare(protoFileName, tsFileName);
  });
});
