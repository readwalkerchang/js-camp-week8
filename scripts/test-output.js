const { spawnSync } = require('child_process');
const fs = require('fs');

const jestBin = require.resolve('jest/bin/jest');

const result = spawnSync(process.execPath, [jestBin, '--runInBand'], {
  encoding: 'utf8',
  stdio: 'pipe'
});

const output = `${result.stdout || ''}${result.stderr || ''}`;

fs.writeFileSync('test output.md', output);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
