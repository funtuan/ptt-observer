const graphqlServer = require('./graphql/server.js');
const pttBackup = require('./service/pttBackup.js');

// console.log('run');
// const startTime = new Date();
// pttBackup.newArticle('Gossiping', 200000-40000, 10, 750000).then(() => {
//   console.log('總共花費時間', (new Date() - startTime)/1000, '秒');
// }).catch((err) => {
//   console.log('error!');
// });


// runBackup('Gossiping');

graphqlServer.init();
pttBackup.run('Gossiping', 30000, 50);
