const { GraphQLScalarType } = require('graphql');

module.exports.Photo = {
  id: (parent) => parent._id,
  url: (parent) => `https://monsite.com/photos/${parent.id}.png`,
  postedBy: (parent, args, { db }) => db.collection('users').findOne({ githubLogin: parent.postedBy }),
};

module.exports.User = {
  photos: (parent, args, { db }) => db.collection('photos').find({ postedBy: parent.githubLogin }).toArray(),
};

module.exports.DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'A valid date value',
  parseValue: value => new Date(value),
  serialize: value => new Date(value).toISOString(),
  parseLiteral: ast => ast.value,
});
