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
function saveComment({kanban, articleID, floor, userID, score, content, createAt}) {
  createAt = new Date(createAt);
  const comment = new Comment({
    kanban,
    articleID,
    floor,
    userID,
    score,
    content,
    createAt,
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

/**
 * 儲存留言
 * @param  {object} article 文章物件
 * @return {object}         結果
 */
function saveArticle(
    {kanban, kid, ID, articleID, authorID, authorNickName, title, content, createAt}) {
  const article = new Article({
    kanban,
    kid,
    ID,
    authorID,
    authorNickName,
    title,
    content,
    createAt,
    updateAt: new Date(),
  });
  return new Promise(function(resolve, reject) {
    article.save((err, res) => {
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
  saveArticle,
};
