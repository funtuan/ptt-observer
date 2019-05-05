const {gql} = require('apollo-server');

module.exports = gql`

  """
  文章內容
  """
  type Article {
    kanban: String,
    kid: Int,
    id: String,
    authorID: String,
    authorNickName: String,
    title: String,
    content: String,
    floor: Floor,
    tag: [Tag],
    mark: Boolean,
  }

  """
  留言樓層資訊
  """
  type Floor {
    total: Int,
    good: Int,
    bad: Int,
  }

  """
  標籤
  """
  type Tag {
    id: String,
    extent: Int,
  }

  """
  標籤內容
  """
  type TagName {
    id: String,
    name: String,
  }


  """
  標籤
  """
  input TagInput {
    id: String,
    extent: Int,
  }

  type Query {
    "取得需要mark的看板文章"
    needMarkArticle(kanban: String!, limit: Int): [Article],


    "取得標記清單"
    tagList: [TagName],
  }

  type Mutation {
    "新增貼文"
    markArticle(kanban: String!, id: String!, tag: [TagInput]!): Article,
  }
`;
