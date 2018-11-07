export class Path {
  public readonly parent: Nullable<Path> = null;
  public readonly node: BaseNode;

  public constructor(node: BaseNode, parent?: Nullable<Path>) {
    this.node = node;
    this.parent = parent || null;
  }
}
