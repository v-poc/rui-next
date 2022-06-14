import os from 'os';
import { createRequire } from 'module';
import path from 'upath';
import fs from 'fs-extra';
import { camelCase, upperFirst } from 'lodash-es';
import { execaCommandSync, execaSync, execa } from 'execa';
import { bundleRequire } from 'bundle-require';
import { parse, extract, strip } from 'jest-docblock';
import grayMatter from 'gray-matter';
import { parseSlides } from './parse-slides.js';
import { GitContributor } from './types.js';

export async function requireModule(filepath: string) {
  const { mod } = await bundleRequire({ filepath });
  return mod?.default ?? mod;
}

export function requireResolve(request: string, path: string) {
  return createRequire(path).resolve(request);
}

export function pascalCase(str: string): string {
  return upperFirst(camelCase(str));
}

export function slash(p: string): string {
  return p.replace(/\\/g, '/');
}

export function ensureLeadingSlash(p: string) {
  // ensure start slash
  if (!p.startsWith('/')) {
    p = '/' + p;
  }
  return p;
}

export function removeLeadingSlash(p: string) {
  return p.replace(/^\//, '');
}

export function removeTrailingSlash(p: string) {
  if (p !== '/') {
    p = p.replace(/\/$/, '');
  }
  return p;
}

/**
 * Whether the current system is windows
 */
export const isWindows = os.platform() === 'win32';

export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id);
}

/**
 * clean the query string and hash string in the path
 */
export function cleanPath(id: string): string {
  return id.replace(/(\?|#).*/, '');
}

/**
 * Disable console.log
 */
export function trapConsole() {
  const consoleLog = global.console.log;
  global.console.log = (() => {
    // ...
  }) as any;

  return () => {
    global.console.log = consoleLog;
  };
}

export const dynamicImport = new Function('file', 'return import(file)');

/**
 * Extract and parse doc block in file content
 */
export function extractDocBlock(fileContent: string) {
  return parse(extract(fileContent));
}

/**
 * Strip doc block in file content
 */
export function stripDocBlock(fileContent: string) {
  return strip(fileContent);
}

/**
 * Extract front matter in markdown
 */
export function extractFrontMatter(fileContent: string) {
  const { data: frontMatter, content } = grayMatter(fileContent);

  if (frontMatter.title === undefined) {
    frontMatter.title = extractMarkdownTitle(content);
  }

  if (frontMatter.slide) {
    frontMatter.slideCount = parseSlides(content).length;
  }

  return frontMatter;
}

/**
 * Extract markdown title (h1)
 */
export function extractMarkdownTitle(content: string) {
  const match = content.match(/^#\s+(.*)$/m);
  return match?.[1];
}

let isGitRepo: boolean;

/**
 * Check to see if it's a git repository
 */
export function checkGitRepo(cwd = process.cwd()): boolean {
  if (typeof isGitRepo === 'undefined') {
    try {
      execaCommandSync('git log', { cwd });
      isGitRepo = true;
    } catch {
      isGitRepo = false;
    }
  }

  return isGitRepo;
}

let gitRoot: string;

/**
 * Get the root directory of a git repository by file path
 */
export function getGitRoot(filePath: string) {
  if (!checkGitRepo()) {
    return '';
  }

  if (!gitRoot) {
    const { stdout } = execaSync('git', ['rev-parse', '--show-toplevel'], {
      cwd: fs.statSync(filePath).isDirectory()
        ? filePath
        : path.dirname(filePath),
    });
    gitRoot = stdout;
  }

  return gitRoot;
}

/**
 * Get the git created time of a file
 */
export async function getGitCreatedTime(filePath: string) {
  if (!checkGitRepo()) {
    return undefined;
  }

  const { stdout } = await execa('git', [
    '--no-pager',
    'log',
    '--diff-filter=A',
    '--format=%at',
    filePath,
  ]);

  return stdout ? Number.parseInt(stdout) * 1000 : undefined;
}

/**
 * Get the git updated time of a file
 */
export async function getGitUpdatedTime(filePath: string) {
  if (!checkGitRepo()) {
    return undefined;
  }

  const { stdout } = await execa('git', [
    '--no-pager',
    'log',
    '-1',
    '--format=%at',
    filePath,
  ]);

  return stdout ? Number.parseInt(stdout) * 1000 : undefined;
}

/**
 * Get the git contributors
 */
export async function getGitContributors(
  filePath: string
): Promise<GitContributor[]> {
  if (!checkGitRepo()) {
    return [];
  }

  // FIXME: cause error
  try {
    const { stdout } = await execa('git', [
      '--no-pager',
      'shortlog',
      '-nes',
      '--',
      filePath,
    ]);

    return stdout
      .split('\n')
      .map(item => item.trim().match(/^(\d+)\t(.*) <(.*)>$/))
      .filter((item): item is RegExpMatchArray => item !== null)
      .map(([, commits, name, email]) => ({
        name,
        email,
        commits: Number.parseInt(commits),
      }));
  } catch (e) {
    return [];
  }
}

export function compose(...fns: any[]) {
  return function composed(...params: any[]) {
    return fns.reduce((res, fn, index) => {
      return index === 0 ? fn(...params) : fn(res);
    }, undefined);
  };
}
