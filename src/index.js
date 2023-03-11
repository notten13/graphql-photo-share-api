const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const { readFileSync } = require('fs');
const { MongoClient } = require('mongodb');
const graphQlPlayground = require('graphql-playground-middleware-express').default;

const { resolvers } = require('./resolvers');
const typeDefs = readFileSync('./src/typeDefs.graphql', 'UTF-8');

async function start() {
  const app = new express();

  const dbClient = await MongoClient.connect(
    process.env.DB_HOST,
    { useNewUrlParser: true },
  );
  const db = dbClient.db();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Context is an object available to all resolvers
    context: async ({ req }) => {
      const githubToken = req.headers.authorization;
      const user = await db.collection('users').findOne({ githubToken });
      return { db, user };
    },
  });

  server.applyMiddleware({ app });

  app.get('/', (req, res) => res.send('Photo Share API'));

  app.get('/playground', graphQlPlayground({ endpoint: '/graphql' }));

  app.listen({ port: 3000 }, () => {
    console.log('PhotoShare server listening on port 3000!');
  });
}

start();

