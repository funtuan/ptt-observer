const {ApolloServer} = require('apollo-server');
const typeDefs = require('./typeDefs.js');

const mongooseORM = require('../mongoose/orm.js');

const resolvers = {
  Query: {
    needMarkArticle: (root, args, context) => {
      const {kanban} = args;
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
