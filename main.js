const pttBackup = require('./service/pttBackup.js');

console.log('run');
const startTime = new Date();
pttBackup.newArticle('Gossiping', 200000-25000, 50, 760000).then(() => {
  console.log('總共花費時間', (new Date() - startTime)/1000, '秒');
}).catch((err) => {
  console.log('error!');
});
