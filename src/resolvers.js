const { authoriseWithGithub } = require('./lib/githubAuth');

const { Query } = require('./resolvers/Query');
const { Mutation } = require('./resolvers/Mutation');
const { User, Photo, DateTime } = require('./resolvers/Type');

const resolvers = {
  Query,
  Mutation,
  User,
  Photo,
  DateTime,
};

module.exports.resolvers = resolvers;
