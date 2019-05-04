const {ApolloServer} = require('apollo-server');
const typeDefs = require('./typeDefs.js');

const mongooseORM = require('../mongoose/orm.js');

const resolvers = {
  Query: {
    needMarkArticle: (root, args, context) => {
      const {kanban, limit} = args;
      return mongooseORM.getHotArticle(kanban, limit);
    },
  },
  Mutation: {
    markArticle: (root, args, context) => {
      const {kanban, id, tag} = args;
      return mongooseORM.markArticle(kanban, id, tag);
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
