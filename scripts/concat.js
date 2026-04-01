const fs = require('fs');
const path = require('path');

function getJsFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.js'))
    .sort()
    .map((file) => path.join(dir, file));
}

const inputFiles = [
  ...getJsFiles(path.join('.', 'src')),
  ...getJsFiles(path.join('.', 'lib')),
  ...getJsFiles(path.join('.', 'dist', 'shaders'))
];

const output = inputFiles
  .map((filePath) => fs.readFileSync(filePath, 'utf-8'))
  .join('\n');

fs.writeFileSync(path.join('.', 'dist', 'game-concatenated.js'), output, 'utf-8');
