const fetch = require('node-fetch');

module.exports.Mutation = {
  async postPhoto(parent, args, { db, user }) {
    // User must be authenticated. This context variable is defined for each request (see index.js)
    if (!user) {
      throw new Error('Please log in to perform this operation.');
    }

    const newPhoto = {
      ...args.input,
      postedBy: user.githubLogin,
      createdAt: new Date(),
    };

    const { insertedId } = await db.collection('photos').insertOne(newPhoto);

    return {
      id: insertedId,
      ...newPhoto,
    };
  },

  async authenticateWithGithub(parent, { code }, { db }) {
    let {
      message,
      access_token,
      avatar_url,
      login,
      name,
    } = await authoriseWithGithub({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    });

    if (message) {
      throw new Error(message);
    }

    let latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url,
    };

    const { ops: [user] } = await db
      .collection('users')
      .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });

    return { user, token: access_token };
  },

  async addFakeUsers(parent, { count }, { db }) {
    const randomUserAPI = `https://randomuser.me/api/?results=${count}`;

    const { results } = await fetch(randomUserAPI)
      .then(res => res.json());

      const users = results.map(user => ({
      githubLogin: user.login.username,
      name: `${user.name.first} ${user.name.last}`,
      avatar: user.picture.thumbnail,
      githubToken: user.login.sha1,
    }));

    await db.collection('users').insertMany(users);

    return users;
  },

  async authenticateFakeUser(parent, { githubLogin }, { db }) {
    const user = await db.collection('users').findOne({ githubLogin });

    if (!user) {
      throw new Error(`User '${githubLogin}' not found.`);
    }

    return {
      user,
      token: user.githubToken,
    };
  },
};
