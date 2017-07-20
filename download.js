const fs = require('fs');

const saveImg = require('./utils/saveImg');
const  config = require('./config');

let {currentImgType} = config;

let path = `./data/${currentImgType}.json`;

let data = JSON.parse(fs.readFileSync(path));

console.time('download imgs...')
for (let value of data) {
  saveImg(value)
}
console.timeEnd('download imgs...')