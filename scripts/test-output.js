const { spawnSync } = require('child_process');
const fs = require('fs');

const jestBin = require.resolve('jest/bin/jest');

const result = spawnSync(process.execPath, [jestBin, '--runInBand', '--no-color'], {
  encoding: 'utf8',
  stdio: 'pipe',
  env: {
    ...process.env,
    FORCE_COLOR: '0',
    NO_COLOR: '1'
  }
});

const output = `${result.stdout || ''}${result.stderr || ''}`
  .replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, '');

fs.writeFileSync('test output.md', output);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
