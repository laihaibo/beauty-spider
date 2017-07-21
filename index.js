'use strict';

// 引入所需的库
const fs = require("fs");
const mkdirp = require('mkdirp');
const cheerio = require('cheerio');
const request = require('superagent');
require('superagent-charset')(request);

const saveData = require('./utils/saveData');
const getConfig = require('./config');
let config = getConfig();
let {
  currentImgType,
  allImgType
} = config;


// 获取指定url的html内容，该网站编码为utf-8
const getHtml = url => {
  return new Promise((resolve, reject) => {
    request.get(url).set({
      'Referer': 'https://www.google.com',
      'Accept': 'image/webp,image/*,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3091.0 Safari/537.36'
    }).charset('utf-8').end((err, res) => {
      err ? reject(err) : resolve(cheerio.load(res.text));
    })
  })
}

// 页码
const getPages = (doms) => {
  return [...new Set(doms.map(function (i, el) {
    let num = el.attribs.href.split('/').pop().split('.').shift()
    return num === '' ? 1 : parseInt(num, 10)
    // return el.attribs
  }).get())].reduce((prev, cur) => Math.max(prev, cur), 0)
}

const getImgPages = (doms) => {
  return doms.map(function (i, el) {
    let num = el.attribs.href.split('/');
    return num.length === 3 ? 1 : parseInt(num.pop().split('.').shift(), 10);
    // return num;
  }).get().reduce((prev, cur) => Math.max(prev, cur), 0)
}

//获取指定页码范围内的所有图册代码
const getAlbums = (startUrl) => {
  return new Promise((resolve, reject) => {
    let albums = [];
    let getQuery = async startUrl => {
      try {
        let $ = await getHtml(startUrl);
        let pages = getPages($('#listdiv .pagesYY a'));
        // let pages = 20;
        for (let i = 1; i <= pages; i++) { // <=在只有一页时可以用
          let pageUrl = i === 1 ? startUrl : `${startUrl + i}.html`
          let $ = await getHtml(pageUrl);

          // 更新pages
          pages = getPages($('#listdiv .pagesYY a'));

          $('.galleryli_title a').each(function () {
            albums.push({
              title: $(this).text(),
              url: `https://www.nvshens.com${$(this).attr("href")}`,
              imgList: [],
              id: parseInt($(this).attr("href").split('/')[2], 10)
            })
          })
        }
        resolve(albums);
        // console.log(albums);
      } catch (error) {
        console.log(error);
      }
    }
    getQuery(startUrl);
  })
}

//获取指定页码范围内的所有图册代码
const getImgList = (startUrl) => {
  return new Promise((resolve, reject) => {
    // console.log(`开始爬取 ${startUrl} ...`);
    let albums = [];
    let getQuery = async startUrl => {
      try {
        let $ = await getHtml(startUrl);
        // let pages = $('#pages a').length;
        let pages = getImgPages($('#pages a'));
        for (let i = 1; i <= pages; i++) {
          let pageUrl = i === 1 ? startUrl : `${startUrl + i}.html`;
          let $ = await getHtml(pageUrl);

          // 更新pageUrl
          pages = getImgPages($('#pages a'));

          $('#hgallery img').each(function () {
            let url = $(this).attr('src');
            let fileName = url.split('/').pop();
            let id = parseInt(fileName.split('.')[0], 10);
            albums.push({
              url,
              fileName,
              id
            })
          })
        }
        resolve(albums);
        // console.log(`爬取 ${startUrl} 结束...`)
      } catch (error) {
        console.log(error);
      }
    }
    getQuery(startUrl);
  })
}

const doSpider = async() => {
  try {
    let albums = await getAlbums(allImgType[currentImgType]);
    for (let album of albums) {
      let imgList = await getImgList(album.url);
      album.imgList = imgList;
    }

    let jsonPath = `./data`;
    mkdirp(jsonPath, function (err) {
      if (err) {
        console.log(`Error: ${err} in makedir of Json`);
      }
    });
    saveData(`${jsonPath}/${currentImgType}.json`, albums);
  } catch (error) {
    console.log(error);
  }
}

console.time(`doSpider ${currentImgType}...`)
doSpider();
console.timeEnd(`doSpider ${currentImgType}...`)