const qs = require('querystring');
const Joi = require('joi');
const Wreck = require('wreck');

class Auth0Api {
  constructor(logger) {
    this.logger = logger;

    const schema = Joi.object().keys({
      AUTH0_API_URL: Joi.string().regex(/^https:\/\//).required(),
      AUTH0_TOKEN: Joi.string().required(),
    }).unknown('true');

    const result = schema.validate(process.env);

    if (result.error) {
      this.logger.error('environment variables missing', result.error);
    }

    this.wreck = Wreck.defaults({
      baseUrl: process.env.AUTH0_API_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AUTH0_TOKEN}`,
      },
      json: true,
    });

    this.wreck.on('request', (uri, options) => this.logger.debug('wreck request', { uri, options }));
  }

  createUser(user) {
    const options = {
      payload: user,
    };

    return new Promise((resolve, reject) => {
      this.logger.info('Auth0 User Create', options);
      this.wreck.post('/users', options, (err, response, payload) => {
        if (err) {
          this.logger.error(err);
          reject(err);
        } else if (response.statusCode === 201) {
          resolve(payload);
        } else {
          this.logger.error(payload);
          reject(payload);
        }
      });
    });
  }

  findUser(slackId) {
    return new Promise((resolve, reject) => {
      const query = {
        search_engine: 'v2',
        fields: 'user_id',
        q: `slack_id:${slackId}`,
      };
      const q = qs.stringify(query);

      this.logger.info('Auth0 User Find', { query });
      this.wreck.get(`/users?${q}`, (err, response, payload) => {
        if (err) {
          this.logger.error(err);
          reject(err);
        } else {
          this.logger.debug('find users payload', payload);
          if (response.statusCode === 200 && payload.length === 1) {
            resolve(payload.pop());
          } else {
            this.logger.error(payload);
            reject('💩 Did not find exactly 1 user');
          }
        }
      });
    });
  }

  deleteUser(auth0UserId) {
    return new Promise((resolve, reject) => {
      this.logger.info('Auth0 User Delete', { auth0UserId });
      this.wreck.delete(`/users/${auth0UserId}`, (err, response, payload) => {
        if (err) {
          this.logger.error(err);
          reject(err);
        } else if (response.statusCode === 204) {
          resolve(payload);
        } else {
          this.logger.error(payload);
          reject(payload);
        }
      });
    });
  }
}

module.exports = Auth0Api;
