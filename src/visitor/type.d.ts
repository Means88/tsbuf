import { Path } from './path';

type WalkAction = (node: BaseNode) => void;
type Action = (path: Path, walk: WalkAction) => void;
interface Visitor {
  [key: string]: Action | Partial<Actions>;
}

interface Actions {
  enter: Action;
  exit: Action;
}
