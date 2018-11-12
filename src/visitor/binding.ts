import { Path } from './path';
import { Scope } from './scope';

export enum BindingKind {
  MESSAGE = 'message',
  ENUM = 'enum',
}

export class Binding {
  public readonly id: Identifier;
  public readonly scope: Scope;
  public readonly path: Path;
  public readonly kind: BindingKind;

  public constructor(params: { id: Identifier; scope: Scope; path: Path; kind: BindingKind }) {
    this.id = params.id;
    this.scope = params.scope;
    this.path = params.path;
    this.kind = params.kind;
  }
}
