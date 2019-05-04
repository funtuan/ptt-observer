const graphqlServer = require('./graphql/server.js');
const pttBackup = require('./service/pttBackup.js');

console.log('run');
const startTime = new Date();
pttBackup.newArticle('Gossiping', 200000-107000, 50, 678100).then(() => {
  console.log('總共花費時間', (new Date() - startTime)/1000, '秒');
}).catch((err) => {
  console.log('error!');
});


// runBackup('Gossiping');

graphqlServer.init();
// pttBackup.run('Gossiping', 5000, 50);
