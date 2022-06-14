/**
 * https://github.com/vuejs/vitepress/blob/main/scripts/release.js
 */
import path from 'path';
import { fileURLToPath, URL } from 'url';
import fs from 'fs-extra';
import semver from 'semver';
import execa from 'execa';
import { Listr } from 'listr2';

const pkgPath = fileURLToPath(new URL('../package.json', import.meta.url));
const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

const currentVersion = pkgJson.version;

const releaseTypeChoices = ['patch', 'minor', 'major']
  .map(type => {
    const v = semver.inc(currentVersion, type);
    return `${type} (${v})`;
  })
  .concat(['custom']);

async function main() {
  const tasks = new Listr([
    {
      title: 'Confirm release version',
      task: async (ctx, task) => {
        const releaseType = await task.prompt({
          type: 'Select',
          message: 'Select release type',
          choices: releaseTypeChoices,
        });

        let targetVersion;

        if (releaseType === 'custom') {
          targetVersion = await task.prompt({
            type: 'Input',
            message: 'Input custom version',
            initial: currentVersion,
          });
        } else {
          targetVersion = releaseType.match(/\((.*)\)/)[1];
        }

        if (!semver.valid(targetVersion)) {
          throw new Error(`Invalid target version: ${targetVersion}`);
        }

        const confirm = await task.prompt({
          type: 'Confirm',
          message: `Releasing v${targetVersion}. Confirm?`,
        });

        if (confirm) {
          ctx.targetVersion = targetVersion;
          task.output = targetVersion;
        } else {
          ctx.skip = true;
        }
      },
      options: {
        persistentOutput: true,
      },
    },
    {
      title: 'Update package version',
      skip: ctx => ctx.skip,
      task: async ctx => {
        const pkgPath = path.resolve(__dirname, '../package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

        pkg.version = ctx.targetVersion;
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
      },
    },
    {
      title: 'Build package',
      skip: ctx => ctx.skip,
      task: async () => {
        await execa('pnpm', ['build']);
      },
    },
    {
      title: 'Update changelog',
      skip: ctx => ctx.skip,
      task: async (ctx, task) => {
        await execa('pnpm', ['changelog']);
        await execa('pnpm', ['prettier', '--write', 'CHANGELOG.md']);

        const good = await task.prompt({
          type: 'confirm',
          message: `Changelog updated. Does it look good?`,
        });
        if (!good) {
          ctx.skip = true;
        }
      },
    },
    {
      title: 'Commit changes to the Git and create a tag',
      skip: ctx => ctx.skip,
      task: async ctx => {
        await execa('git', ['add', 'CHANGELOG.md', 'package.json']);
        await execa('git', ['commit', '-m', `release: v${ctx.targetVersion}`]);
        await execa('git', ['tag', `v${ctx.targetVersion}`]);
      },
    },
    {
      title: 'Publish package',
      skip: ctx => ctx.skip,
      task: async () => {
        await execa('pnpm', ['publish', '--ignore-scripts', '--no-git-checks']);
      },
    },
    {
      title: 'Push to GitHub',
      skip: ctx => ctx.skip,
      task: async ctx => {
        await execa('git', [
          'push',
          'origin',
          `refs/tags/v${ctx.targetVersion}`,
        ]);
        await execa('git', ['push']);
      },
    },
  ]);

  tasks.run().catch(err => {
    if (!err.message.startsWith('Cancelled')) {
      console.error(err);
    }
  });
}

main();
