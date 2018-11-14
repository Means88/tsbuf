import * as path from 'path';
import { compare } from '../utils';

describe('mixed', () => {
  it('should generate mixed', () => {
    const fileName = path.resolve(__dirname, './message.proto');
    const tsFileName = path.resolve(__dirname, './message.ts');
    compare(fileName, tsFileName);
  });

  it('should generate extended type', () => {
    const fileName = path.resolve(__dirname, './extended.proto');
    const tsFileName = path.resolve(__dirname, './extended.ts');
    compare(fileName, tsFileName);
  });
});
