import { Path } from '../../visitor/path';
import { Visitor } from '../../visitor/type';

export class ImportVisitor {
  private readonly imports: ImportStatement[] = [];

  private readonly visitor: Visitor = {
    Proto: {
      enter: (path: Path): void => {
        path.context.imports = this.imports;
      },
    },
    ImportStatement: {
      exit: (path: Path): void => {
        const importStatement = path.node as ImportStatement;
        this.imports.push(importStatement);
      },
    },
  };

  public getVisitor(): Visitor {
    return this.visitor;
  }
}
