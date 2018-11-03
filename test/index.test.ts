import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import { Parser } from '../src/index';

const fileName = path.resolve(__dirname, './proto/message.proto');
const proto = fs.readFileSync(fileName).toString();

describe('index', () => {
  it('should pass', () => {
    expect(0).to.equal(0);
  });

  it('should parse without exception', () => {
    Parser.parse(proto);
  });
});
