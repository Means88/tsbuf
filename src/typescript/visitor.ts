import { Path } from '../visitor/path';
import { Visitor } from '../visitor/type';
import { InterfaceTree } from './helper';

export class TsVisitor {
  private readonly rootInterfaces: InterfaceTree[] = [];
  private readonly interfaceScopeStack: InterfaceTree[] = [];

  private readonly visitor: Visitor = {
    Proto: {
      enter(path: Path): void {
        path.context.enums = [];
      },
      exit: (path: Path): void => {
        path.context.interfaces = this.rootInterfaces;
      },
    },
    Enum: {
      exit(path: Path): void {
        path.context.enums.push(path.node);
      },
    },
    Message: {
      enter: (path: Path): void => {
        const message = path.node as Message;
        const interfaceTree: InterfaceTree = {
          node: {
            name: message.name.name,
            fields: [],
          },
          children: [],
        };
        this.enterInterface(interfaceTree);
      },
      exit: (path: Path): void => {
        this.exitInterface();
      },
    },
    Field: {
      exit: (path: Path): void => {
        const field = path.node as Field;
        const iscope = this.getInterfaceScope();
        if (iscope === null) {
          throw new Error('Field should be included in Message.');
        }
        iscope.node.fields.push({
          typeName: field.typeName,
          name: field.name.name,
          repeated: field.repeated,
        });
      },
    },
  };

  public getVisitor(): Visitor {
    return this.visitor;
  }

  private enterInterface(i: InterfaceTree): void {
    if (this.interfaceScopeStack.length === 0) {
      this.rootInterfaces.push(i);
    } else {
      const iscope = this.getInterfaceScope() as InterfaceTree;
      iscope.children.push(i);
    }
    this.interfaceScopeStack.push(i);
  }

  private exitInterface(): void {
    this.interfaceScopeStack.pop();
  }

  private getInterfaceScope(): Nullable<InterfaceTree> {
    return this.interfaceScopeStack.slice(-1)[0] || null;
  }
}
