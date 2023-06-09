const fetch = require('node-fetch');

const requestAuthToken = credentials => fetch(
  `https://github.com/login/oauth/access_token`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(credentials)
  })
  .then(res => res.json())
  .catch(error => {
    throw new Error(JSON.stringify(error));
  })
;

const requestGithubUserAccount = token => fetch(`https://api.github.com/user?access_token=${token}`)
  .then(res => res.json())
  .catch(error => {
    throw new Error(JSON.stringify(error));
  });

authoriseWithGithub = async (credentials) => {
  const { access_token } = await requestAuthToken(credentials);
  const githubUser = await requestGithubUserAccount(access_token);
  return { ...githubUser, access_token };
}

module.exports = {
  authoriseWithGithub,
};
