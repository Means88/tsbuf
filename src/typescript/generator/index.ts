import { semanticVisitor } from '../../semantic/visitor';
import { Path } from '../../visitor/path';
import { Action, Actions, Visitor } from '../../visitor/type';

import { EnumVisitor } from '../visitors/enum';
import { ImportVisitor } from '../visitors/import';
import { InterfaceVisitor } from '../visitors/interface';
import { ServiceVisitor } from '../visitors/service';

export class Generator {
  private static readonly noop = (): void => {
    // pass
  };

  private static getActions(node: BaseNode, visitor: Visitor): Actions {
    if (typeof visitor[node.type] === 'function') {
      return {
        enter: Generator.noop,
        in: visitor[node.type] as Action,
        exit: Generator.noop,
      };
    }
    return {
      enter: Generator.noop,
      in: Generator.noop,
      exit: Generator.noop,
      ...visitor[node.type],
    };
  }

  private readonly ast: BaseNode;
  private readonly visitors: Visitor[];
  private readonly context: any = {};
  private currentNode: Nullable<BaseNode> = null;

  public constructor(ast: BaseNode, plugins: Visitor[] = []) {
    this.ast = ast;
    this.visitors = [
      new EnumVisitor().getVisitor(),
      new InterfaceVisitor().getVisitor(),
      new ServiceVisitor().getVisitor(),
      new ImportVisitor().getVisitor(),
      ...plugins,
      semanticVisitor,
    ];
  }

  public getResult(): any {
    this.walk(this.ast);
    return this.context;
  }

  private readonly walk = (node: BaseNode): void => {
    const lastNode = this.currentNode;
    this.currentNode = node;
    const currentPath = new Path(node, lastNode, this.context);
    for (const visitor of this.visitors) {
      const actions = Generator.getActions(node, visitor);
      actions.enter(currentPath, this.walk);
    }
    for (const visitor of this.visitors) {
      const actions = Generator.getActions(node, visitor);
      actions.in(currentPath, this.walk);
    }
    for (const visitor of this.visitors) {
      const actions = Generator.getActions(node, visitor);
      actions.exit(currentPath, this.walk);
    }
    this.currentNode = lastNode;
  };
}
