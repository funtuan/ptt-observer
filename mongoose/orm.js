const mongoose = require('mongoose');
const DB_URL = 'mongodb://mongo';
const {Article, Comment} = require('./schema.js');

/**
 * 初始化
 */
function init() {
  mongoose.connect(DB_URL);
}

/**
 * 儲存留言
 * @param  {object} comment 留言物件
 * @return {object}         結果
 */
function saveComment({kanban, articleID, floor, userID, score, content}) {
  const comment = new Comment({
    kanban,
    articleID,
    floor,
    userID,
    score,
    content,
  });
  return new Promise(function(resolve, reject) {
    comment.save((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

module.exports = {
  init,
  saveComment,
};
