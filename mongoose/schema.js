const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  kanban: {type: String},
  kid: {type: Number},
  ID: {type: String},
  authorID: {type: String},
  authorNickName: {type: String},
  title: {type: String},
  content: {type: String},
  createAt: {type: Date},
});

const CommentSchema = new Schema({
  kanban: {type: String},
  articleID: {type: String},
  floor: {type: Number},
  userID: {type: String},
  score: {type: Number},
  content: {type: String},
  createAt: {type: String},
});

const Article = mongoose.model('Article', ArticleSchema);
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = {
  Article,
  Comment,
};
