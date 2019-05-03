const {ApolloServer} = require('apollo-server');
const typeDefs = require('./typeDefs.js');

const mongooseORM = require('../mongoose/orm.js');

mongooseORM.getHotArticle('Gossiping');
const resolvers = {
  Query: {
    hello: () => 'world',
    // needMarkArticle: () => {},
    needMarkArticle: (root, args, context) => {
      const {kanban} = args;
      console.log(kanban);
      return mongooseORM.getHotArticle(kanban);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

/**
 * 初始化
 */
function init() {
  server.listen().then(({url}) => {
    console.log(`? Server ready at ${url}`);
  });
}

module.exports = {
  init,
};
