const PttCrawler = require('./Model/PttCrawler.js');
const mongooseORM = require('./mongoose/orm.js');

const pttCrawler = new PttCrawler();

mongooseORM.init();
pttCrawler.getArticle('Gossiping', 'M.1556768660.A.DCC').then((value) => {
  console.log(value);
  value.ID = 'M.1556768660.A.DCC';
  value.kid = 1234567;
  mongooseORM.saveArticle(value);
  value.comment.forEach((item)=>{
    item.kanban = 'Gossiping';
    item.articleID = 'M.1556768660.A.DCC';
    mongooseORM.saveComment(item);
  });
});
