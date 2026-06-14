const fs = require('fs');
const path = require('path');
const tilesDir = 'tiles';

function getTilesList(dir, baseDir = '') {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getTilesList(fullPath, baseDir));
    } else if (file.endsWith('.png')) {
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      results.push('./' + relPath);
    }
  });
  return results;
}

const tilesList = getTilesList(tilesDir, __dirname);
tilesList.sort((a, b) => {
  const parse = (str) => str.match(/\d+/g).map(Number);
  const [az, ax, ay] = parse(a);
  const [bz, bx, by] = parse(b);
  return az - bz || ax - bx || ay - by;
});

const listStr = 'const TILES = [\n' + tilesList.map(t => '  "' + t + '"').join(',\n') + '\n];';
fs.writeFileSync('TILES_ARRAY.txt', listStr, 'utf8');
console.log('Done!');
