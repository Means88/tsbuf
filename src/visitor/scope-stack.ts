import { Binding } from './binding';
import { Path } from './path';
import { Scope } from './scope';

export class ScopeStack {
  private readonly stack: Scope[] = [];

  public pushScope(scope: Scope): void {
    this.stack.push(scope);
  }

  public popScope(): Nullable<Scope> {
    return this.stack.pop() || null;
  }

  public getBinding(id: string): Nullable<Binding> {
    let scope: Nullable<Scope> = this.getTopScope();
    while (scope !== null) {
      if (id in scope.bindings) {
        return scope.bindings[id];
      }
      scope = scope.parent;
    }
    return null;
  }

  public createBinding(path: Path): boolean {
    return this.getTopScope().createBinding(path);
  }

  private getTopScope(): Scope {
    return this.stack.slice(-1)[0] || null;
  }
}
