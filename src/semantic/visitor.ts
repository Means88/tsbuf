import { Binding } from '../visitor/binding';
import { Path } from '../visitor/path';
import { Scope } from '../visitor/scope';
import { Action, Actions, Visitor, WalkAction } from '../visitor/type';

const scopeStack: Scope[] = [];

function getTopScope(): Scope {
  return scopeStack.slice(-1)[0];
}

function getBinding(id: string): Nullable<Binding> {
  let scope: Nullable<Scope> = getTopScope();
  while (scope !== null) {
    if (id in scope.bindings) {
      return scope.bindings[id];
    }
    scope = scope.parent;
  }
  return null;
}

export const semanticVisitor: Visitor = {
  Proto: {
    enter(path: Path, walk: WalkAction): void {
      const proto = path.node as Proto;
      scopeStack.push(new Scope(path, null));
      for (const node of proto.body) {
        walk(node);
      }
    },
    exit(): void {
      scopeStack.pop();
    },
  },
  Enum(path: Path, walk: WalkAction): void {
    const enumeration = path.node as Enum;
    walk(enumeration.name);
    for (const node of enumeration.body) {
      walk(node);
    }
  },
  EnumField(path: Path, walk: WalkAction): void {
    const enumField = path.node as EnumField;
    walk(enumField.name);
    walk(enumField.value);
    for (const option of enumField.options || []) {
      walk(option);
    }
  },
  EnumValueOption(path: Path, walk: WalkAction): void {
    const enumValueOption = path.node as EnumValueOption;
    walk(enumValueOption.name);
    walk(enumValueOption.value);
  },
  Identifier(path: Path, walk: WalkAction): void {
    getTopScope().createBinding(path);
  },
};
