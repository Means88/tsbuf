import * as path from 'path';
import { compare } from '../utils';

describe('map', () => {
  it('should generate map field', () => {
    const protoFileName = path.resolve(__dirname, './map.proto');
    const tsFileName = path.resolve(__dirname, './map.ts');
    compare(protoFileName, tsFileName);
  });
});
