import { Path } from '../visitor/path';
import { Visitor } from '../visitor/type';

export const tsVisitor: Visitor = {
  Proto(path: Path): void {
    path.context.enums = [];
    path.context.interfaces = [];
  },
  Enum: {
    exit(path: Path): void {
      path.context.enums.push(path.node);
    },
  },
  Message: {
    exit(path: Path): void {
      path.context.interfaces.push(path.node);
    },
  },
};
