const fs = require('fs');
const mkdirp = require('mkdirp');
const request = require('superagent');
require('superagent-charset')(request);

// 保存一张图片
let saveOne = (title, url, fileName) => {
  return new Promise((resolve, reject) => {
    let path = `./img/${title}/${fileName}`;
    let isExit = fs.existsSync(path);
    if (!isExit) {
      request.get(url).set({
        'Referer': 'https://www.google.com',
        'Accept': 'image/webp,image/*,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3091.0 Safari/537.36'
      }).end((err, res) => {
        if (err) {
          console.log(`Error: ${err} in getting ${url}`)
        }
        fs.writeFile(path, res.body, function (err) {
          if (err) console.log(`Error: ${err} in downloading ${url}`)
        });
        resolve();
      })
    } else {
      resolve();
    }

  })
}

//保存一个相册下的多张图片
function saveImg({
  title,
  imgList
}) {

  mkdirp(`./img/${title}`, function (err) {
    if (err) {
      console.log(`Error: ${err} in makedir ${title}`);
    }
  });
  let getQuery = async() => {
    try {
      console.log(`开始下载 ${title} 相册的图片 ....`);
      for (let {
          url,
          fileName
        } of imgList) {
        await saveOne(title, url, fileName);
      }
      console.log(`下载 ${title} 相册的图片结束 ....`);
    } catch (error) {
      console.log(error);
    }
  }
  console.time(`download ${title}...`)
  getQuery();
  console.timeEnd(`download ${title}...`)
}

module.exports = saveImg;