/* eslint-disable no-invalid-this*/

const request = require('request');
const cheerio = require('cheerio');

/**
 * ptt 爬蟲模組
 */
class PttCrawler {
  /**
   * 爬蟲初始化
   * @param {string} baseURL 爬蟲目標網址
   */
  constructor(baseURL = 'https://www.ptt.cc/bbs/') {
    this.baseURL = baseURL;
  }

  /**
   * 取得看板最後一篇文章 vid
   * @param  {string} kanban  看板名稱
   * @return {number}         vid
   */
  getKanbanLastVid(kanban) {
    const option = {
      url: `${this.baseURL}${kanban}/index.html`,
      headers: {
        'Cookie': 'over18=1',
      },
    };
    return new Promise((resolve, reject) => {
      request(option, (error, response, body) => {
        if (error)reject(error);
        const $ = cheerio.load(body);
        const page = $('#action-bar-container .action-bar .btn-group-paging')['0']
            .children[3].attribs.href.replace(`/bbs/Gossiping/index`, '').replace(`.html`, '');
        this.getOneList(kanban, parseInt(page)+1).then((value) => {
          resolve(page*20 + value.length);
        });
      });
    });
  }

  /**
   * 取得看板文章清單
   * @param  {string} kanban  看板名稱
   * @param  {number} start 開始文章kid
   * @param  {number} end   結束文章kid
   * @return {object}       文章清單
   */
  getKanbanList(kanban, start, end) {
    return new Promise((resolve, reject) => {
      let now = start;

      // 建立爬蟲任務清單
      const task = [];
      while (now < end) {
        const page = Math.floor(now/20) + 1;
        task.push(this.getOneList(kanban, page));
        now = page * 20;
      }

      const list = [];
      Promise.all(task).then((items) => {
        items.forEach((item) => {
          item.forEach((article) => {
            // 過濾 kid 範圍
            if (article.kid >= start && article.kid <= end) {
              list.push(article);
            }
          });
        });
        resolve(list);
      });
    });
  }

  /**
   * 取得單頁看板清單內容
   * @param  {string} kanban 看板名稱
   * @param  {number} page   看板頁網址頁號
   * @return {object}        單頁文章清單
   */
  getOneList(kanban, page) {
    const option = {
      url: `${this.baseURL}${kanban}/index${page?page:''}.html`,
      headers: {
        'Cookie': 'over18=1',
      },
    };
    return new Promise((resolve, reject) => {
      request(option, (error, response, body) => {
        if (error) {
          resolve([]);
        } else {
          const $ = cheerio.load(body
              .replace(`<div class="r-list-sep"></div>`, '<div class="r-ent">stopGetOneList</div>'));
          const list = [];

          let topArticle = false;
          // 取得文章清單
          $('.r-ent').each(function(i, elem) {
            if ($(this).html() === 'stopGetOneList')topArticle = true;
            const children$ = cheerio.load($(this).html());
            if (children$('.title a').attr('href') && !topArticle) {
              list.push({
                kanban,
                kid: (page-1)*20 + i,
                id: children$('.title a').attr('href')
                    .replace(`/bbs/${kanban}/`, '').replace(`.html`, ''),
                title: children$('.title a').text(),
                nrec: children$('.nrec').text()
                      ?children$('.nrec').text():'',
              });
            }
          });

          resolve(list);
        }
      });
    });
  }


  /**
   * 取得單一文章內容
   * @param  {string} kanban  看板名稱
   * @param  {string} id      文章id
   * @return {object}         文章內容
   */
  getArticle(kanban, id) {
    const option = {
      url: `${this.baseURL}${kanban}/${id}.html`,
      headers: {
        'Cookie': 'over18=1',
      },
    };
    return new Promise((resolve, reject) => {
      request(option, function(error, response, body) {
        if (error)reject(error);
        const $ = cheerio.load(body);
        console.log(id);

        const articleMeta = $('.article-metaline .article-meta-value');
        if (articleMeta['0'] && articleMeta['1'] && articleMeta['2']) {
          // 基本文章資訊
          const metaline = articleMeta['0']
              .children[0].data.split(' (');
          const article = {
            authorID: metaline[0],
            authorNickName: metaline[1]?metaline[1].replace(`)`, ''):'',
            title: articleMeta['1']
                .children[0].data,
            createAt: new Date(articleMeta['2']
                .children[0].data),
            content: articleMeta['2']
                .parent.next.data,
            comment: [],
          };

          // 取得留言內容
          $('.push').each(function(i, elem) {
            const children$ = cheerio.load($(this).html());
            if (children$('.push-tag').text()) {
              const tag = children$('.push-tag').text();
              article.comment.push({
                floor: i+1,
                score: tag === '推 '?1:(tag === '噓 '?-1:0),
                userID: children$('.push-userid').text(),
                content: children$('.push-content').text().replace(`: `, ''),
                createAt: children$('.push-ipdatetime').text().replace(`\n`, ''),
              });
            }
          });

          resolve(article);
        } else {
          reject(new Error('載入失敗'));
        }
      });
    });
  }
}

module.exports = PttCrawler;

const crawler = new PttCrawler();
// crawler.getKanbanLastVid('Gossiping').then((value) => {
//   console.log(value);
// });
// crawler.getOneList('Gossiping', 39362).then((value) => {
//   console.log(value);
// });
//
// crawler.getKanbanList('Gossiping', 786623, 786647).then((value) => {
//   console.log(value);
// });
// crawler.getArticle('Gossiping', 'M.1556768660.A.DCC').then((value) => {
//   console.log(value);
// });
