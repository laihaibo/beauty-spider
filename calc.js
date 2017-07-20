const fs = require('fs');
const getConfig = require('./config');
let config = getConfig();
let {
  currentImgType,
  allImgType
} = config;

let path = `./data/${currentImgType}.json`;

let data = JSON.parse(fs.readFileSync(path));

let count = data.reduce((prev, cur) => prev + cur.imgList.length, 0);

console.log(`共${data.length}个相册，共${count}张图片`);