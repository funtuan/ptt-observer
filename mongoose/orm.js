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
    {kanban, kid, id, articleID, authorID, authorNickName, title, content, floor, createAt}) {
  createAt = new Date(createAt);
  const article = new Article({
    kanban,
    kid,
    id,
    authorID,
    authorNickName,
    title,
    content,
    floor,
    tag: [],
    createAt,
    updateAt: new Date(),
  });
  return new Promise(function(resolve, reject) {
    Article.findOne({kanban, kid, id}, function(err, doc) {
      if (err) reject(err);
      if (!doc) {
        article.save((err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      } else {
        doc.content = content;
        doc.floor = floor;
        doc.updateAt = new Date();
        doc.save((err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      }
    });
  });
}

/**
 * 取得文章留言樓層狀態
 * @param  {object} article 文章條件
 * @return {object}         結果
 */
function getArticleFloor({kanban, kid, id}) {
  return new Promise((resolve, reject) => {
    Article.findOne({kanban, kid, id}, 'floor', function(err, doc) {
      if (err) reject(err);
      if (doc) {
        resolve(doc.floor);
      } else {
        resolve({
          total: 0,
          good: 0,
          bad: 0,
        });
      }
    });
  });
}

/**
 * 取得熱門文章
 * @param  {string} kanban 看板名稱
 * @param  {number} limit  取得數量
 * @return {[type]}        [description]
 */
function getHotArticle(kanban, limit=1) {
  return new Promise((resolve, reject) => {
    Article.aggregate([
      {$match: {kanban, mark: null}},
      {
        $project: {
          hot: {$sum: ['$floor.good', '$floor.bad']},
          kanban: 1,
          kid: 1,
          id: 1,
          authorID: 1,
          authorNickName: 1,
          title: 1,
          content: 1,
          floor: 1,
          tag: 1,
          mark: 1,
        }
      },
      {$sort: {hot: -1}},
      {$limit: limit},
    ]).exec((err, result) => {
      resolve(result);
    });
  });
}

// getHotArticle('Gossiping');

module.exports = {
  init,
  saveComment,
  saveArticle,
  getArticleFloor,
  getHotArticle,
};
