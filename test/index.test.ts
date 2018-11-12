import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import { Parser } from '../src/parser';

const fileName = path.resolve(__dirname, './proto/message.proto');
const proto = fs.readFileSync(fileName).toString();

describe('index', () => {
  it('should pass', () => {
    expect(0).to.equal(0);
  });

  it('should parse without exception', () => {
    const ast = Parser.parse(proto);
    expect(ast).not.to.equal(null);
  });
});
