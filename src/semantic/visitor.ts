import { Path } from '../visitor/path';
import { Scope } from '../visitor/scope';
import { ScopeStack } from '../visitor/scope-stack';
import { Visitor, WalkAction } from '../visitor/type';

function pushScope(path: Path): void {
  const topScope = path.context.scopeStack.getTopScope();
  path.context.scopeStack.pushScope(new Scope(path, topScope));
}

function popScope(path: Path): Nullable<Scope> {
  return path.context.scopeStack.popScope();
}

export const semanticVisitor: Visitor = {
  Proto: {
    enter(path: Path): void {
      const scopeStack = new ScopeStack();
      path.context.scopeStack = scopeStack;
    },
    in(path: Path, walk: WalkAction): void {
      const proto = path.node as Proto;
      path.context.scopeStack.pushScope(new Scope(path, null));
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
  Message(path: Path, walk: WalkAction): void {
    const message = path.node as Message;
    walk(message.name);
    pushScope(path);
    for (const node of message.body) {
      walk(node);
    }
    popScope(path);
  },
  Oneof(path: Path, walk: WalkAction): void {
    const oneof = path.node as Oneof;
    walk(oneof.name);
    for (const node of oneof.body) {
      walk(node);
    }
  },
  Identifier(path: Path, _walk: WalkAction): void {
    path.context.scopeStack.createBinding(path);
  },
  Service(path: Path, walk: WalkAction): void {
    const service = path.node as Service;
    for (const rpc of service.body) {
      walk(rpc);
    }
  },
};
