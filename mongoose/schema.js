const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  authorID: {type: String},
  authorNickName: {type: String},
  title: {type: String},
  createAt: {type: Date},
  content: {type: String},
});

const CommentSchema = new Schema({
  kanban: {type: String},
  articleID: {type: String},
  floor: {type: Number},
  userID: {type: String},
  score: {type: Number},
  content: {type: String},
});

const Article = mongoose.model('Article', ArticleSchema);
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = {
  Article,
  Comment,
};
