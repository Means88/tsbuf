import * as path from 'path';
import { GenerateMode } from './const';

function calculatePath(src: string, from: string, root: string): string {
  const absoluteSrcPath = path.resolve(src);
  const absoluteFromPath = path.resolve(root, from);
  return path.relative(absoluteSrcPath, absoluteFromPath);
}

export const generateImport = (mode: GenerateMode = GenerateMode.Global, fileName?: string, rootDir?: string) => (
  importStatement: ImportStatement,
): string => {
  if (mode === GenerateMode.Global) {
    return '';
  }
  if (!fileName || !rootDir) {
    return `import * from '${importStatement.path.value}';`;
  }
  return `import * from '${calculatePath(fileName, importStatement.path.value, rootDir)}';`;
};

export const generateExport = (mode: GenerateMode = GenerateMode.Global, fileName?: string, rootDir?: string) => (
  importStatement: ImportStatement,
): string => {
  if (mode === GenerateMode.Global) {
    return '';
  }
  if (!importStatement.public) {
    return `export * from ${importStatement.path.value};`;
  }
  if (!fileName || !rootDir) {
    return `export * from '${importStatement.path.value}';`;
  }
  return `export * from '${calculatePath(fileName, importStatement.path.value, rootDir)}';`;
};
