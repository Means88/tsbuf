import { Path } from '../../visitor/path';
import { Visitor } from '../../visitor/type';

export class EnumVisitor {
  private readonly enums: BaseNode[] = [];

  private readonly visitor: Visitor = {
    Proto: {
      exit: (path: Path): void => {
        path.context.enums = this.enums;
      },
    },
    Enum: {
      exit: (path: Path): void => {
        this.enums.push(path.node);
      },
    },
  };

  public getVisitor(): Visitor {
    return this.visitor;
  }
}
