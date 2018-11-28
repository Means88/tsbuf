import { expect } from 'chai';
import * as fs from 'fs';
import * as prettier from 'prettier';
import { exportSource, GenerateMode } from '../src';
import { Parser } from '../src/parser';
import { Generator } from '../src/typescript/generator';

export function compare(protoFile: string, tsFile: string, mode: GenerateMode = GenerateMode.Module): void {
  const proto = fs.readFileSync(protoFile).toString();
  const message = fs.readFileSync(tsFile).toString();

  const ast = Parser.parse(proto);
  const generator = new Generator(ast);
  const interfaces = generator.getResult();
  expect(interfaces).not.to.equal(null);
  const text = exportSource(interfaces, mode);

  const formattedText = prettier.format(text, { parser: 'typescript' });
  const formattedMessage = prettier.format(message, { parser: 'typescript' });
  expect(formattedText).to.equal(formattedMessage);
}
