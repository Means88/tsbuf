import { IToken } from 'chevrotain';
import { BaseNode } from './types';

function partial<T, K extends keyof T>(obj: T, fields: K[]): Pick<T, K> {
  const result: Partial<T> = {};
  fields.forEach(f => {
    result[f] = obj[f];
  });
  return result as Pick<T, K>;
}

export function startBy(token: IToken | BaseNode): Partial<Pick<IToken, 'startLine' | 'startColumn' | 'startOffset'>> {
  return partial(token, ['startLine', 'startColumn', 'startOffset']);
}

export function endBy(token: IToken | BaseNode): Partial<Pick<IToken, 'endLine' | 'endColumn' | 'endOffset'>> {
  return partial(token, ['endLine', 'endColumn', 'endOffset']);
}
