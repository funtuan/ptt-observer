/* eslint-disable no-invalid-this*/

const request = require('request');
const cheerio = require('cheerio');

/**
 * ptt 主爬蟲
 */
class Crawler {
  /**
   * 爬蟲初始化
   * @param {string} baseURL 爬蟲目標網址
   */
  constructor(baseURL = 'https://www.ptt.cc/bbs/') {
    this.baseURL = baseURL;
  }

  /**
   * 取得看板文章清單
   * @param  {string} name  看板名稱
   * @param  {number} start 開始文章kid
   * @param  {number} end   結束文章kid
   * @return {object}       文章清單
   */
  getKanbanList(name, start, end) {
    return new Promise((resolve, reject) => {
      const task = [];
      let now = start;
      while (now < end) {
        const page = Math.floor(now/20) + 1;
        task.push(this.getOneList(name, page));
        now = page * 20;
      }

      const list = [];
      Promise.all(task).then((items) => {
        items.forEach((item) => {
          item.forEach((article) => {
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
   * @param  {string} name 看板名稱
   * @param  {number} page 看板頁網址頁號
   * @return {object}      單頁文章清單
   */
  getOneList(name, page) {
    const option = {
      url: `${this.baseURL}${name}/index${page?page:''}.html`,
      headers: {
        'Cookie': 'over18=1',
      },
    };
    return new Promise((resolve, reject) => {
      request(option, function(error, response, body) {
        if (error)reject(error);
        const list = [];
        const $ = cheerio.load(body);
        $('.r-ent').each(function(i, elem) {
          const children$ = cheerio.load($(this).html());
          if (children$('.title a').attr('href')) {
            list.push({
              kanban: name,
              kid: (page-1)*20 + i,
              id: children$('.title a').attr('href')
                  .replace(`/bbs/${name}/`, '').replace(`.html`, ''),
              title: children$('.title a').text(),
              nrec: children$('.nrec').text()
                    ?children$('.nrec').text():'',
            });
          }
        });
        resolve(list);
      });
    });
  }


  /**
   * 取得單一文章內容
   * @param  {string} name 看板名稱
   * @param  {string} id   文章id
   * @return {object}      文章內容
   */
  getArticle(name, id) {
    const option = {
      url: `${this.baseURL}${name}/${id}.html`,
      headers: {
        'Cookie': 'over18=1',
      },
    };
    return new Promise((resolve, reject) => {
      request(option, function(error, response, body) {
        if (error)reject(error);
        const $ = cheerio.load(body);
        const article = {
          authorID: $('.article-metaline .article-meta-value')['0']
              .children[0].data.split(' (')[0],
          authorNickName: $('.article-metaline .article-meta-value')['0']
              .children[0].data.split(' (')[1].replace(`)`, ''),
          title: $('.article-metaline .article-meta-value')['1']
              .children[0].data,
          createAt: $('.article-metaline .article-meta-value')['2']
              .children[0].data,
          content: $('.article-metaline .article-meta-value')['2']
              .parent.next.data,
          comment: [],
        };
        $('.push').each(function(i, elem) {
          const children$ = cheerio.load($(this).html());
          if (children$('.push-tag').text()) {
            const tag = children$('.push-tag').text();
            article.comment.push({
              id: i+1,
              score: tag === '推 '?1:(tag === '噓 '?-1:0),
              userID: children$('.push-userid').text(),
              content: children$('.push-content').text(),
              createAt: children$('.push-ipdatetime').text().replace(`\n`, ''),
            });
          }
        });
        resolve(article);
      });
    });
  }
}

module.exports = {
  Crawler,
};
