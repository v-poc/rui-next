/**
 * modify from vite-plugin-react-pages
 */
import type { Root } from 'mdast';
import ts from 'typescript';
import {
  MDX_TS_INFO_RE,
  TS_INFO_MODULE_ID_PREFIX,
} from '../../common/constants.js';

export interface TsInterfaceInfo {
  name: string;
  description: string;
  properties: TsInterfacePropertyInfo[];
}

export interface TsInterfacePropertyInfo {
  name: string;
  type: string;
  description: string;
  optional: boolean;
  defaultValue: string | undefined;
}

const defaultTsConfig: ts.CompilerOptions = {
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
};

export function extractInterfaceInfo(
  filePath: string,
  exportName: string,
  options: ts.CompilerOptions = defaultTsConfig
): TsInterfaceInfo {
  // Build a program using the set of root file names in fileNames
  const program = ts.createProgram([filePath], options);
  // Get the checker, we will use it to find more about classes
  const checker = program.getTypeChecker();

  const sourceFile = program.getSourceFile(filePath)!;

  // inspired by
  // https://github.com/microsoft/rushstack/blob/6ca0cba723ad8428e6e099f12715ce799f29a73f/apps/api-extractor/src/analyzer/ExportAnalyzer.ts#L702
  // and https://stackoverflow.com/a/58885450
  const fileSymbol = checker.getSymbolAtLocation(sourceFile);

  if (!fileSymbol || !fileSymbol.exports) {
    throw new Error(`[pressify] Unexpected fileSymbol. ${filePath}`);
  }

  const escapedExportName = ts.escapeLeadingUnderscores(exportName);
  const exportSymbol = fileSymbol.exports.get(escapedExportName);

  if (!exportSymbol) {
    throw new Error(
      `[pressify] Named export '${exportName}' is not found in file ${filePath}`
    );
  }

  const sourceDeclareSymbol = getAliasedSymbolIfNecessary(exportSymbol);
  const sourceDeclaration = sourceDeclareSymbol.declarations?.[0];

  if (!sourceDeclaration) {
    throw new Error(
      `[pressify] Can not find sourceDeclaration for ${exportName}`
    );
  }

  const interfaceInfo = collectInterfaceInfo(
    sourceDeclaration,
    sourceDeclareSymbol
  );

  return interfaceInfo;

  function getAliasedSymbolIfNecessary(symbol: ts.Symbol) {
    if ((symbol.flags & ts.SymbolFlags.Alias) !== 0) {
      return checker.getAliasedSymbol(symbol);
    }
    return symbol;
  }

  function collectInterfaceInfo(
    sourceDeclaration: ts.Declaration,
    sourceSymbol: ts.Symbol
  ) {
    if (!ts.isInterfaceDeclaration(sourceDeclaration)) {
      throw new Error(`[pressify] Target is not an InterfaceDeclaration`);
    }

    if (!sourceSymbol) {
      throw new Error(`[pressify] Can not find symbol`);
    }

    const name = sourceDeclaration.name.getText();
    const description = ts.displayPartsToString(
      sourceSymbol.getDocumentationComment(checker)
    );

    const propertiesInfo: TsInterfacePropertyInfo[] = [];

    // extract property info
    sourceSymbol.members?.forEach(member => {
      const { name: memberName, valueDeclaration } = member;

      if (
        !valueDeclaration ||
        (!ts.isPropertySignature(valueDeclaration) &&
          !ts.isMethodSignature(valueDeclaration))
      ) {
        throw new Error(
          `[pressify] Unexpected declaration type in interface. name: ${memberName}, kind: ${
            ts.SyntaxKind[valueDeclaration?.kind as ts.SyntaxKind]
          }`
        );
      }

      const typeText = valueDeclaration.type?.getText() ?? '';
      const description = ts.displayPartsToString(
        member.getDocumentationComment(checker)
      );
      const optional = Boolean(member.getFlags() & ts.SymbolFlags.Optional);

      // get defaultValue from jsDocTags
      const jsDocTags = member.getJsDocTags();
      const defaultValueTag = jsDocTags.find(
        t => t.name === 'defaultValue' || 'default'
      );
      const defaultValue = defaultValueTag?.text?.[0]?.text;

      propertiesInfo.push({
        name: memberName,
        type: typeText,
        description,
        defaultValue,
        optional,
      });
    });

    return {
      name,
      description,
      properties: propertiesInfo,
    };
  }

  /** True if this is visible outside this file, false otherwise */
  function isNodeExported(node: ts.Node): boolean {
    return (
      (ts.getCombinedModifierFlags(node as ts.Declaration) &
        ts.ModifierFlags.Export) !==
        0 &&
      !!node.parent &&
      node.parent.kind === ts.SyntaxKind.SourceFile
    );
  }
}

function getComment(declaration: ts.Declaration, sourceFileFullText: string) {
  // Compiler internal:
  // https://github.com/microsoft/TypeScript/blob/66ecfcbd04b8234855a673adb85e5cff3f8458d4/src/compiler/utilities.ts#L1202
  const ranges = (ts as any).getJSDocCommentRanges.call(
    ts,
    declaration,
    sourceFileFullText
  );

  if (!ranges || !ranges.length) {
    return;
  }

  const range = ranges[ranges.length - 1];
  if (!range) {
    return;
  }

  return sourceFileFullText.slice(range.pos, range.end);
}

/**
 * ref:
 *
 * https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
 *
 * https://stackoverflow.com/questions/59838013/how-can-i-use-the-ts-compiler-api-to-find-where-a-variable-was-defined-in-anothe
 *
 * https://stackoverflow.com/questions/60249275/typescript-compiler-api-generate-the-full-properties-arborescence-of-a-type-ide
 *
 * https://stackoverflow.com/questions/47429792/is-it-possible-to-get-comments-as-nodes-in-the-ast-using-the-typescript-compiler
 *
 * Instructions of learning ts compiler:
 * https://stackoverflow.com/a/58885450
 *
 * https://learning-notes.mistermicheels.com/javascript/typescript/compiler-api/
 */

export function getTsInfoModuleId(filePath: string, exportName: string) {
  return `${TS_INFO_MODULE_ID_PREFIX}__${exportName}__${filePath}`;
}

export function extractTsInfoPathAndName(id: string) {
  const [, exportName, filePath] =
    id.slice(TS_INFO_MODULE_ID_PREFIX.length).match(/__(.*?)__(.*)/) || [];
  return { filePath, exportName };
}

export function tsInfoMdxPlugin() {
  return function TsInfoTransformer(tree: Root) {
    const addImports: string[] = [];

    tree.children.forEach((child: any) => {
      if ((child.type as string) === 'jsx') {
        const regexp = MDX_TS_INFO_RE;
        const [, src, name] = (child.value as string).match(regexp) || [];

        if (src && name) {
          const imported = `__tsInfo_${addImports.length}`;
          addImports.push(
            `import * as ${imported} from '${getTsInfoModuleId(src, name)}';`
          );
          child.value = `<TsInfo {...${imported}} />`;
        }
      }
    });

    tree.children.unshift(
      ...addImports.map(importStr => {
        return {
          type: 'import',
          value: importStr,
        } as any;
      })
    );
  };
}

export function loadTsInfo(id: string) {
  const { filePath, exportName } = extractTsInfoPathAndName(id);
  const tsInfo = extractInterfaceInfo(filePath, exportName);

  return `export const info = ${JSON.stringify(tsInfo)}`;
}
