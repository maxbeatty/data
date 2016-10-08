/* globals jest, describe, it, expect */
const mockCreateUser = jest.fn();
jest.mock('./_api', () => jest.fn(() => ({
  createUser: mockCreateUser,
  findUser: () => Promise.resolve({ user_id: 1 }),
  deleteUser: () => Promise.resolve(),
})));
jest.mock('./help');

const mockSlackApiUsersInfo = jest.fn();
const mockLogger = {
  debug: () => {},
  error: () => {},
};

const auth0 = require('./index.js');

describe('auth0', () => {
  let addCb;
  let rmCb;

  it('register', () => {
    // should really be a better way to test multiple listeners
    let callCount = 0;

    auth0({
      hears: (patterns, types, callback) => {
        callCount += 1;

        switch (callCount) {
          // add
          case 1: {
            expect(patterns.length).toBe(1);
            expect(patterns[0].toString()).toContain('add');
            expect(types).toEqual(['direct_mention']);

            addCb = callback;
            break;
          }
          // remove
          case 2: {
            expect(patterns.length).toBe(1);
            expect(patterns[0].toString()).toContain('remove');
            expect(types).toEqual(['direct_mention']);

            rmCb = callback;
            break;
          }
          default: {
            throw new Error('unexpected call to controller.hears in auth0/index.js');
          }
        }
      },
    }, mockLogger);
  });

  describe('add', () => {
    it('catch', () => new Promise((resolve) => {
      expect(addCb).toBeDefined();
      const mockMessage = { match: ['', 'UABC123'] };

      mockSlackApiUsersInfo.mockImplementationOnce((query, cb) => cb(new Error('auth0-add-catch')));

      addCb({
        api: {
          users: {
            info: mockSlackApiUsersInfo,
          },
        },
        reply: (message, text) => {
          expect(message).toEqual(mockMessage);
          expect(text).toEqual('💩 problem calling Slack API. check my logs');
          resolve();
        },
      }, mockMessage);
    }));

    describe('unqualified user', () => {
      it('no bots', () => new Promise((resolve) => {
        const mockMessage = { match: ['', 'UABC123'] };

        mockSlackApiUsersInfo.mockImplementationOnce((query, cb) => cb(null, {
          ok: true,
          user: { is_bot: true },
        }));

        addCb({
          api: {
            users: {
              info: mockSlackApiUsersInfo,
            },
          },
          reply: (message, text) => {
            expect(message).toEqual(mockMessage);
            expect(text).toEqual('Sorry, I\'m afraid I can\'t add other bots, restricted users, or deleted users');
            resolve();
          },
        }, mockMessage);
      }));

      it('no restricted', () => new Promise((resolve) => {
        const mockMessage = { match: ['', 'UABC123'] };

        mockSlackApiUsersInfo.mockImplementationOnce((query, cb) => cb(null, {
          ok: true,
          user: { is_bot: false, is_restricted: true },
        }));

        addCb({
          api: {
            users: {
              info: mockSlackApiUsersInfo,
            },
          },
          reply: (message, text) => {
            expect(message).toEqual(mockMessage);
            expect(text).toEqual('Sorry, I\'m afraid I can\'t add other bots, restricted users, or deleted users');
            resolve();
          },
        }, mockMessage);
      }));

      it('no ultra restricted', () => new Promise((resolve) => {
        const mockMessage = { match: ['', 'UABC123'] };

        mockSlackApiUsersInfo.mockImplementationOnce((query, cb) => cb(null, {
          ok: true,
          user: { is_bot: false, is_restricted: false, is_ultra_restricted: true },
        }));

        addCb({
          api: {
            users: {
              info: mockSlackApiUsersInfo,
            },
          },
          reply: (message, text) => {
            expect(message).toEqual(mockMessage);
            expect(text).toEqual('Sorry, I\'m afraid I can\'t add other bots, restricted users, or deleted users');
            resolve();
          },
        }, mockMessage);
      }));

      it('no deleted', () => new Promise((resolve) => {
        const mockMessage = { match: ['', 'UABC123'] };

        mockSlackApiUsersInfo.mockImplementationOnce((query, cb) => cb(null, {
          ok: true,
          user: { is_bot: false, is_restricted: false, is_ultra_restricted: false, deleted: true },
        }));

        addCb({
          api: {
            users: {
              info: mockSlackApiUsersInfo,
            },
          },
          reply: (message, text) => {
            expect(message).toEqual(mockMessage);
            expect(text).toEqual('Sorry, I\'m afraid I can\'t add other bots, restricted users, or deleted users');
            resolve();
          },
        }, mockMessage);
      }));
    });

    describe('create', () => {
      it('success', () => new Promise((resolve) => {
        const mockMessage = { match: ['', 'UABC123'] };

        mockSlackApiUsersInfo.mockImplementationOnce((query, cb) => cb(null, {
          ok: true,
          user: {
            is_bot: false,
            is_restricted: false,
            is_ultra_restricted: false,
            deleted: false,
            profile: {
              email: 'test@test.tld',
            },
          },
        }));

        mockCreateUser.mockImplementationOnce(() => Promise.resolve());

        addCb({
          api: {
            users: {
              info: mockSlackApiUsersInfo,
            },
          },
          reply: (message, text) => {
            expect(message).toEqual(mockMessage);
            expect(text).toEqual('Successfully added <@UABC123> (test@test.tld) to Auth0!');
            resolve();
          },
        }, mockMessage);
      }));

      it('fail', () => new Promise((resolve) => {
        const mockMessage = { match: ['', 'UABC123'] };

        mockSlackApiUsersInfo.mockImplementationOnce((query, cb) => cb(null, {
          ok: true,
          user: {
            is_bot: false,
            is_restricted: false,
            is_ultra_restricted: false,
            deleted: false,
            profile: {
              email: 'test@test.tld',
            },
          },
        }));

        mockCreateUser.mockImplementationOnce(() => Promise.reject());

        addCb({
          api: {
            users: {
              info: mockSlackApiUsersInfo,
            },
          },
          reply: (message, text) => {
            expect(message).toEqual(mockMessage);
            expect(text).toEqual('💩 didn\'t create user in Auth0. check my logs');
            resolve();
          },
        }, mockMessage);
      }));
    });
  });

  describe('remove', () => {
    it('success', () => new Promise((resolve) => {
      expect(rmCb).toBeDefined();
      const mockMessage = { match: ['', 'UABC123'] };
      mockSlackApiUsersInfo.mockImplementationOnce((query, cb) => cb(null, {
        ok: true,
        user: {},
      }));

      rmCb({
        api: {
          users: {
            info: mockSlackApiUsersInfo,
          },
        },
        reply: (message, text) => {
          expect(message).toEqual(mockMessage);
          expect(text).toEqual('Successfully deleted <@UABC123> from Auth0');
          resolve();
        },
      }, mockMessage);
    }));

    it('bot api fail', () => new Promise((resolve) => {
      const mockMessage = { match: ['', 'UABC123'] };
      mockSlackApiUsersInfo.mockImplementationOnce((query, cb) => cb(new Error('remove-bot-api-fail')));

      rmCb({
        api: {
          users: {
            info: mockSlackApiUsersInfo,
          },
        },
        reply: (message, text) => {
          expect(message).toEqual(mockMessage);
          expect(text).toEqual('💩 problem calling Slack API. check my logs');
          resolve();
        },
      }, mockMessage);
    }));

    it('slack api fail', () => new Promise((resolve) => {
      const mockMessage = { match: ['', 'UABC123'] };
      mockSlackApiUsersInfo.mockImplementationOnce((query, cb) => cb(null, {
        ok: false,
      }));

      rmCb({
        api: {
          users: {
            info: mockSlackApiUsersInfo,
          },
        },
        reply: (message, text) => {
          expect(message).toEqual(mockMessage);
          expect(text).toEqual('💩 bad response from Slack API. check my logs');
          resolve();
        },
      }, mockMessage);
    }));
  });
});
