const graphqlServer = require('./graphql/server.js');
const pttBackup = require('./service/pttBackup.js');

// console.log('run');
// const startTime = new Date();
// pttBackup.newArticle('Gossiping', 200000-25000, 50, 760000).then(() => {
//   console.log('總共花費時間', (new Date() - startTime)/1000, '秒');
// }).catch((err) => {
//   console.log('error!');
// });

/**
 * 運行 Backup
 * @param  {string} kanban 看板名稱
 */
function runBackup(kanban) {
  try {
    const startTime = new Date();
    pttBackup.newArticle(kanban, 5000, 50).then(() => {
      console.log('總共花費時間', (new Date() - startTime)/1000, '秒');
      runBackup(kanban);
    }).catch((err) => {
      runBackup(kanban);
    });
  } catch (e) {
    runBackup(kanban);
  }
}

// runBackup('Gossiping');

graphqlServer.init();
