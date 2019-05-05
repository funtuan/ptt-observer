const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  kanban: {type: String},
  kid: {type: Number},
  id: {type: String},
  authorID: {type: String},
  authorNickName: {type: String},
  title: {type: String},
  content: {type: String},
  floor: {
    total: {type: Number},
    good: {type: Number},
    bad: {type: Number},
  },
  tag: [{
    id: {type: String},
    extent: {type: Number},
  }],
  mark: {type: Boolean},
  createAt: {type: Date},
  updateAt: {type: Date},
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

const TagListSchema = new Schema({
  id: {type: String},
  name: {type: String},
});

const Article = mongoose.model('Article', ArticleSchema);
const Comment = mongoose.model('Comment', CommentSchema);
const TagList = mongoose.model('Taglists', TagListSchema);

module.exports = {
  Article,
  Comment,
  TagList,
};
