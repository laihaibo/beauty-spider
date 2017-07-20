/**
 * 保存数据到本地
 *
 * @param {string} path 保存数据的文件夹
 * @param {array} movies 电影信息数组
 */

const fs = require('fs');

function saveData(path, movies) {
    // console.log(movies);
    // 调用 fs.writeFile 方法保存数据到本地
    // fs.writeFile(filename, data[, options], callback)
    // fs.writeFile 方法第一个参数是需要保存在本地的文件名称（包含路径）
    // 第二个参数是文件数据
    // 然后有个可选参数，可以是 encoding，mode 或者 flag
    // 最后一个参数是一个回调函数
    fs.writeFile(path, JSON.stringify(movies, null, ' '), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('Data saved');
    });
}

module.exports = saveData;