const PttCrawler = require('../Model/PttCrawler.js');
const mongooseORM = require('../mongoose/orm.js');

const pttCrawler = new PttCrawler();
mongooseORM.init();

/**
 * 備份看板內最新幾篇文章
 * @param  {string} kanban   看板名稱
 * @param  {number} amount   數量
 * @param  {number} interval 備份間隔頻率
 * @param  {number} startVid 自定義起始vid
 * @return {null}            空
 */
function newArticle(kanban, amount, interval, startVid) {
  return new Promise((resolve, reject) => {
    pttCrawler.getKanbanLastVid(kanban).then((newVid) => {
      if (startVid)newVid = startVid;
      let vid = newVid;
      let task = Promise.resolve();
      while (vid > newVid - amount) {
        const start = vid - interval +1;
        const end = vid;

        task = task.then(() => {
          console.log(`取得文章 ${start} 到 ${end} （vid）`);
          return saveListArticle(kanban, start, end);
        });
        vid = vid - interval;
      }
      task.then((value) => {
        resolve(value);
      }).catch((err) => {
        reject(err);
      });
    });
  });
}

/**
 * 備份看板清單內多篇文章
 * @param  {string} kanban  看板名稱
 * @param  {number} start   開始文章kid
 * @param  {number} end     結束文章kid
 * @return {null}           空
 */
function saveListArticle(kanban, start, end) {
  return new Promise((resolve, reject) => {
    pttCrawler.getKanbanList(kanban, start, end).then((value) => {
      const task = [];
      value.forEach((item)=>{
        task.push(saveArticle(item));
      });
      Promise.all(task).then((value) => {
        resolve(value);
      }).catch((err) => {
        reject(err);
      });
    });
  });
}

/**
 * 備份單篇文章
 * @param  {string} kanban  看板名稱
 * @param  {number} kid     文章kid
 * @param  {string} id      文章id
 * @return {null}           空
 */
function saveArticle({kanban, kid, id}) {
  return new Promise((resolve, reject) => {
    pttCrawler.getArticle(kanban, id).then((value) => {
      value.kanban = kanban;
      value.kid = kid;
      value.id = id;
      value.floor = {
        total: value.comment.length,
        good: value.comment.filter((item) => item.score === 1).length,
        bad: value.comment.filter((item) => item.score === -1).length,
      };
      mongooseORM.getArticleFloor({kanban, kid, id}).then((floor) => {
        mongooseORM.saveArticle(value);
        const task = [];
        value.comment.forEach((item)=>{
          item.kanban = kanban;
          item.articleID = id;
          if (item.floor > floor.total) {
            task.push(mongooseORM.saveComment(item));
          }
        });
        Promise.all(task).then(() => {
          resolve();
        });
      });
    }).catch((err) => {
      resolve();
    });
  });
}

// saveListArticle('Gossiping', 786323, 786347);

module.exports = {
  newArticle,
};
