export class Path {
  public readonly parent: Nullable<BaseNode> = null;

  public readonly node: BaseNode;

  public readonly context: any;

  public constructor(
    node: BaseNode,
    parent: Nullable<BaseNode> = null,
    context: any = null,
  ) {
    this.node = node;
    this.parent = parent || null;
    this.context = context;
  }
}
