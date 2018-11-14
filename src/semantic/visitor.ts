import { Path } from '../visitor/path';
import { Scope } from '../visitor/scope';
import { ScopeStack } from '../visitor/scope-stack';
import { Action, Actions, Visitor, WalkAction } from '../visitor/type';

export const semanticVisitor: Visitor = {
  Proto: {
    enter(path: Path, walk: WalkAction): void {
      const proto = path.node as Proto;
      const scopeStack = new ScopeStack();
      path.context.scopeStack = scopeStack;
      scopeStack.pushScope(new Scope(path, null));
      for (const node of proto.body) {
        walk(node);
      }
    },
    exit(path: Path): void {
      path.context.scopeStack.popScope();
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
    path.context.scopeStack.createBinding(path);
  },
};
