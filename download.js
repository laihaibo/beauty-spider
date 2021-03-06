const fs = require('fs');

const saveImg = require('./utils/saveImg');
const getConfig = require('./config');
let config = getConfig();

let {
  currentImgType,
  allImgType
} = config;

let path = `./data/${currentImgType}.json`;

let data = JSON.parse(fs.readFileSync(path));

console.time('download imgs...')
for (let value of data) {
  saveImg(value)
}
console.timeEnd('download imgs...')

// console.log(fs.existsSync('./config.js'));