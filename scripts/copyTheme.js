import fs from 'fs-extra';
import chokidar from 'chokidar';
import { normalizePath } from 'vite';

function toDist(file) {
  return normalizePath(file).replace(/^src\//, 'dist/');
}

if (process.argv[2] === '-w') {
  // copy files in theme to the dist directory whenever they change.
  chokidar
    .watch('src/theme/**/*', { ignored: ['**/tsconfig.json'] })
    .on('change', file => fs.copy(file, toDist(file)))
    .on('add', file => fs.copy(file, toDist(file)))
    .on('unlink', file => fs.remove(toDist(file)));
} else {
  fs.copySync('src/theme', 'dist/theme', {
    filter: src => !src.endsWith('tsconfig.json'),
  });
}
