const mongoose = require('mongoose');
const DB_URL = 'mongodb://mongo';
const {Article, Comment, TagList} = require('./schema.js');

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
        },
      },
      {$sort: {hot: -1}},
      {$limit: limit},
    ]).exec((err, result) => {
      console.log(result);
      resolve(result);
    });
  });
}

/**
 * 文章標記
 * @param  {string} kanban 看板名稱
 * @param  {string} id     文章id
 * @param  {object} tag    傾向標記
 * @return {object}        文章
 */
function markArticle(kanban, id, tag) {
  return new Promise(function(resolve, reject) {
    Article.findOne({kanban, id}, function(err, doc) {
      if (err) {
        reject(err);
        return;
      }
      if (doc) {
        doc.tag = tag;
        doc.mark = true;
        doc.updateAt = new Date();
        doc.save();
        resolve(doc);
      } else {
        reject(new Error('找不到此文章'));
      }
    });
  });
}

/**
 * 取得標籤清單
 * @return {object}        標籤清單
 */
function getTagList() {
  return new Promise(function(resolve, reject) {
    TagList.find({}, function(err, doc) {
      if (err) {
        reject(err);
        return;
      }
      resolve(doc);
    });
  });
}

/**
 * 檢查重複文章且刪除
 * @param  {string} kanban  看板名稱
 * @param  {String} id      文章id
 * @return {Boolean}        刪除是否成功
 */
function checkRepeatDelete(kanban, id) {
  return new Promise(function(resolve, reject) {
    Article.find({kanban, id}, function(err, doc) {
      if (err) {
        reject(err);
        return;
      }
      if (doc.length > 1) {
        Article.find({_id: doc[1]._id}).remove().exec();
        resolve(true);
      } else {
        resolve(false);
      }
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
  markArticle,
  getTagList,
  checkRepeatDelete,
};
