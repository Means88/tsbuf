import { Binding, BindingKind } from './binding';
import { Path } from './path';

export class Scope {
  public readonly path: Path;
  public readonly parent: Nullable<Scope>;
  public readonly block: BaseNode;
  public readonly parentBlock: Nullable<BaseNode>;
  public readonly bindings: { [id: string]: Binding } = {};

  public constructor(path: Path, parentScope: Nullable<Scope>) {
    this.path = path;
    this.parent = parentScope;
    this.block = path.node;
    this.parentBlock = path.parent;
  }

  public createBinding(path: Path): boolean {
    if (path.node.type !== 'Identifier') {
      throw new Error(`Should bind with Identifier but got ${path.node.type}`);
    }
    if (!path.parent) {
      throw new Error('Identifier found in top level');
    }
    let bindingKind;
    if (path.parent.type === 'Message') {
      bindingKind = BindingKind.MESSAGE;
    }
    if (path.parent.type === 'Enum') {
      bindingKind = BindingKind.ENUM;
    }
    if (!bindingKind) {
      return false;
    }

    const identifier = path.node as Identifier;
    this.bindings[identifier.name] = new Binding({
      id: identifier,
      path,
      scope: this,
      kind: bindingKind,
    });
    return true;
  }
}
