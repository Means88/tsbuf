import * as path from 'path';
import { GenerateMode } from '../../src';
import { compare } from '../utils';

describe('namespace', () => {
  it('should generate namespace', () => {
    const fileName = path.resolve(__dirname, './namespace.proto');
    const tsFileName = path.resolve(__dirname, './namespace.ts');
    compare(fileName, tsFileName);
  });

  it('should generate global namespace', () => {
    const fileName = path.resolve(__dirname, './namespace.proto');
    const tsFileName = path.resolve(__dirname, './namespace.global.ts');
    compare(fileName, tsFileName, GenerateMode.Global);
  });

  it('should generate nested type', () => {
    const fileName = path.resolve(__dirname, './nested-reference.proto');
    const tsFileName = path.resolve(__dirname, './nested-reference.ts');
    compare(fileName, tsFileName);
  });
});
