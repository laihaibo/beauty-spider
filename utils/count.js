const fs = require('fs');
const config = require('../config');

let {currentImgType} = config;
let path  =`../data/${currentImgType}.json`;

let data = JSON.parse(fs.readFileSync(path));

let count = data.reduce((prev,cur)=>prev+cur.imgList.length,0);

module.exports = count;