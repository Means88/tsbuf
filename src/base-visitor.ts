import { Path } from './path';

export type WalkAction = (node: BaseNode) => void;

export const baseVisitor = {
  Proto(path: Path, walk: WalkAction): void {
    const proto = path.node as Proto;
    for (const node of proto.body) {
      walk(node);
    }
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
  Identify(path: Path, walk: WalkAction): void {
    const id = path.node as Identify;
  },
};
