import { Path } from './path';

type WalkAction = (node: BaseNode) => void;

const baseVisitor = {
  Proto(path: Path, walk: WalkAction): void {
    const proto = path.node as Proto;
    for (const node of proto.body) {
      walk(node);
    }
  },
};

class Generator {
  private static readonly noop = (): void => {
    // pass
  };

  private static getAction(node: BaseNode, visitor: any): ((path: Path, walk: WalkAction) => void) {
    return visitor[node.type] || Generator.noop;
  }

  private readonly ast: BaseNode;
  private readonly visitors: any[];
  private currentPath: Path;

  public constructor(ast: BaseNode, plugins: any[] = []) {
    this.ast = ast;
    this.visitors = [baseVisitor, ...plugins];
    this.currentPath = new Path(ast, null);
  }

  public walkRoot(): void {
    this.walk(this.ast);
  }

  private readonly walk = (node: BaseNode): void => {
    const lastPath = this.currentPath;
    this.currentPath = new Path(node, this.currentPath);
    for (const visitor of this.visitors) {
      const action = Generator.getAction(node, visitor);
      action(this.currentPath, this.walk);
    }
    this.currentPath = lastPath;
  };
}
