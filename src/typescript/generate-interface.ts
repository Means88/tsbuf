import { semanticVisitor } from '../semantic/visitor';
import { Path } from '../visitor/path';
import { Action, Actions, Visitor } from '../visitor/type';
import { tsVisitor } from './visitor';

export class Generator {
  private static readonly noop = (): void => {
    // pass
  };

  private static getActions(node: BaseNode, visitor: Visitor): Actions {
    if (typeof visitor[node.type] === 'function') {
      return {
        enter: visitor[node.type] as Action,
        exit: Generator.noop,
      };
    }
    return {
      enter: Generator.noop,
      exit: Generator.noop,
      ...visitor[node.type],
    };
  }

  private readonly ast: BaseNode;
  private readonly visitors: any[];
  private readonly context: any = {};
  private currentNode: Nullable<BaseNode> = null;

  public constructor(ast: BaseNode, plugins: any[] = []) {
    this.ast = ast;
    this.visitors = [tsVisitor, ...plugins, semanticVisitor];
  }

  public getInterfaces(): any {
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
      actions.exit(currentPath, this.walk);
    }
    this.currentNode = lastNode;
  };
}
