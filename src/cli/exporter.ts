import chalk from 'chalk';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as prettier from 'prettier';
import { Parser } from '../parser';

import { GenerateMode } from '../typescript';
import { Generator } from '../typescript/generator';
import { generateEnum } from '../typescript/generator/enum';
import { generateExport, generateImport } from '../typescript/generator/import';
import { generateInterface, InterfaceTree } from '../typescript/generator/interface';

// tslint:disable no-console
export const logger = {
  log(a: string = ''): void {
    console.log(a);
  },
  success(a: string = ''): void {
    console.log(`${chalk.green('success')} ${a}`);
  },
  error(a: string = ''): void {
    console.log(`${chalk.red('error')} ${a}`);
  },
  warning(a: string = ''): void {
    console.log(`${chalk.yellow('warning')} ${a}`);
  },
  pri(a: string = ''): void {
    console.log(`${chalk.blue(a)}`);
  },
};

export function exportSource(
  result: any,
  mode: GenerateMode = GenerateMode.Global,
  fileName?: string,
  rootDir?: string,
): string {
  const importStatements: string = result.imports.map(generateImport(mode, fileName, rootDir)).join('\n');
  const enums: string = result.enums.map(generateEnum(mode)).join('\n');
  const interfaces: string = result.interfaces.map((i: InterfaceTree) => generateInterface(mode)(i)).join('\n');
  const exportStatements: string = result.imports.map(generateExport(mode, fileName, rootDir)).join('\n');
  const text = `import { Observable } from 'rxjs';\n${importStatements}\n\n${enums}\n${interfaces}\n\n${exportStatements}`;
  return prettier.format(text, { parser: 'typescript' });
}

export function exportSingleFile(inputFileName: string, outputFileName: string, mode: GenerateMode): void {
  const proto = fs.readFileSync(inputFileName).toString();
  const ast = Parser.parse(proto);
  const generator = new Generator(ast);
  const interfaces = generator.getResult();
  const text = exportSource(interfaces, mode);

  mkdirp.sync(path.dirname(outputFileName));
  fs.writeFileSync(outputFileName, text);
}

function replaceExt(filePath: string, oldExt: string, ext: string): string {
  return path.join(path.dirname(filePath), `${path.basename(filePath, oldExt)}${ext}`);
}

export class TypeScriptExporter {
  private readonly visitedPath: Set<string> = new Set<string>();
  private readonly membersByFile: {
    [path: string]: string[];
  } = {};

  /**
   *
   * @param mode - Generate mode
   * @param fileName - Current source file name
   * @param rootDir - Root directory path for Proto Buffer files
   * @param outDir - Root directory path for generated TypeScript files
   * @param onError - handleError, return true to continue
   * @return members in the file
   */
  private handleSource(
    mode: GenerateMode = GenerateMode.Global,
    fileName: string,
    rootDir: string,
    outDir: string,
    onError?: (fileName: string) => boolean,
  ): string[] {
    try {
      if (this.visitedPath.has(fileName)) {
        return this.membersByFile[fileName];
      }
      this.visitedPath.add(fileName);
      const proto = fs.readFileSync(fileName).toString();
      const ast = Parser.parse(proto);
      const generator = new Generator(ast);
      const result = generator.getResult();

      let members: string[] = [];

      // Dependencies
      let importString = '';
      let exportString = '';
      for (const importStatement of result.imports as ImportStatement[]) {
        const fullDependencyPath = path.resolve(rootDir, importStatement.path.value);
        const relativeDependencyPath = path.relative(path.dirname(fileName), fullDependencyPath);
        const importedMembers = this.handleSource(mode, fullDependencyPath, rootDir, outDir, onError);
        if (mode !== GenerateMode.Module) {
          continue;
        }
        let tsDependencyPath = replaceExt(relativeDependencyPath, '.proto', '');
        if (!tsDependencyPath.startsWith('.')) {
          tsDependencyPath = `.${path.sep}${tsDependencyPath}`;
        }
        importString += `import { ${importedMembers.join(', ')} } from '${tsDependencyPath}';\n`;
        if (!importStatement.public) {
          continue;
        }
        members = members.concat(importedMembers);
        exportString += `export * from '${tsDependencyPath}';`;
      }

      // Enum
      const enumString: string = result.enums.map(generateEnum(mode)).join('\n');
      members = members.concat(result.enums.map((enumAst: Enum) => enumAst.name.name));

      // Interface
      const interfaceString: string = result.interfaces
        .map((i: InterfaceTree) => generateInterface(mode)(i))
        .join('\n');
      members = members.concat(result.interfaces.map((i: InterfaceTree) => i.node.name));

      const outputText = prettier.format([importString, enumString, interfaceString, exportString].join('\n'), {
        parser: 'typescript',
      });
      // Generate file
      const relativePath = path.relative(rootDir, fileName);
      const absoluteOutputPath = path.resolve(outDir, relativePath);
      const outputDir = path.dirname(absoluteOutputPath);
      const basename = path.basename(absoluteOutputPath, '.proto');
      const ext = `${mode === 'global' ? '.d' : ''}.ts`;
      const outputFileName = path.resolve(outputDir, `${basename}${ext}`);
      mkdirp.sync(path.dirname(outputFileName));
      fs.writeFileSync(outputFileName, outputText);
      logger.success(`Generate ${path.relative(outDir, outputFileName)}`);

      this.membersByFile[fileName] = members;

      return members;
    } catch (e) {
      this.visitedPath.delete(fileName);
      if (onError && onError(fileName)) {
        return [];
      }
      throw e;
    }
  }
}
