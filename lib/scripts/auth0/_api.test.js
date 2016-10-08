/* globals jest, describe, it, expect */
const EventEmitter = require('events');

let mockWreck;

jest.mock('wreck', () => ({
  defaults: () => mockWreck(),
}));

const Auth0 = require('./_api');

const mockLogger = jest.fn(() => ({
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
}));

describe('auth0 API', () => {
  it('constructs', () => {
    const env = Object.assign({}, process.env);
    // not crazy about main knowing about required config of other scripts but whaddaya gonna do
    process.env.AUTH0_API_URL = 'https://test.tld';
    process.env.AUTH0_TOKEN = 'AUTH0_TOKEN';

    mockWreck = jest.fn(() => new EventEmitter());

    const a = new Auth0(mockLogger());
    expect(a).toBeDefined();
    expect(a.wreck).toBeDefined();
    expect(a.logger).toBeDefined();

    // cleanup
    process.env = env;
  });

  it('logs requests to debug', () => new Promise((resolve) => {
    mockWreck = jest.fn(() => new EventEmitter());
    const l = mockLogger();
    const a = new Auth0(l);
    a.wreck.on('request', () => {
      expect(l.debug).toHaveBeenCalled();
      resolve();
    });

    a.wreck.emit('request', ('test', 'works'));
  }));

  describe('createUser', () => {
    it('logs error', () => new Promise((resolve) => {
      const testUser = { email: 'test@test.tld' };
      const testErr = new Error('api-createUser-err');
      const mockPost = jest.fn((path, options, cb) => {
        expect(path).toBe('/users');
        expect(options).toEqual({
          payload: testUser,
        });
        cb(testErr);
      });
      mockWreck = jest.fn(() => {
        const w = new EventEmitter();
        w.post = mockPost;
        return w;
      });
      const l = mockLogger();
      const a = new Auth0(l);
      a.createUser(testUser)
      .catch((reason) => {
        expect(reason).toBe(testErr);
        expect(l.error).toHaveBeenCalled();
        resolve();
      });
    }));

    it('logs rejected payload', () => new Promise((resolve) => {
      const testUser = { email: 'test@test.tld' };
      const testPayload = 'api-createUser-err';
      const mockPost = jest.fn((path, options, cb) => {
        expect(path).toBe('/users');
        expect(options).toEqual({
          payload: testUser,
        });
        cb(null, { statusCode: 400 }, testPayload);
      });
      mockWreck = jest.fn(() => {
        const w = new EventEmitter();
        w.post = mockPost;
        return w;
      });
      const l = mockLogger();
      const a = new Auth0(l);
      a.createUser(testUser)
      .catch((reason) => {
        expect(reason).toBe(testPayload);
        expect(l.error).toHaveBeenCalled();
        resolve();
      });
    }));

    it('succeeds', () => new Promise((resolve) => {
      const testUser = { email: 'test@test.tld' };
      const mockPost = jest.fn((path, options, cb) => {
        expect(path).toBe('/users');
        expect(options).toEqual({
          payload: testUser,
        });
        cb(null, { statusCode: 201 }, '');
      });
      mockWreck = jest.fn(() => {
        const w = new EventEmitter();
        w.post = mockPost;
        return w;
      });
      const l = mockLogger();
      const a = new Auth0(l);
      a.createUser(testUser).then(resolve);
    }));
  });

  describe('findUser', () => {
    it('logs error', () => new Promise((resolve) => {
      const slackId = 'UABC123';
      const testErr = new Error('api-findUser-err');
      const mockGet = jest.fn((path, cb) => {
        expect(path).toContain('/users?');
        expect(path).toContain(slackId);
        cb(testErr);
      });
      mockWreck = jest.fn(() => {
        const w = new EventEmitter();
        w.get = mockGet;
        return w;
      });
      const l = mockLogger();
      const a = new Auth0(l);
      a.findUser(slackId)
      .catch((reason) => {
        expect(reason).toBe(testErr);
        expect(l.error).toHaveBeenCalled();
        resolve();
      });
    }));

    it('rejects bad response', () => new Promise((resolve) => {
      const slackId = 'UABC123';
      const mockGet = jest.fn((path, cb) => {
        expect(path).toContain('/users?');
        expect(path).toContain(slackId);
        cb(null, { statusCode: 400 }, '');
      });
      mockWreck = jest.fn(() => {
        const w = new EventEmitter();
        w.get = mockGet;
        return w;
      });
      const l = mockLogger();
      const a = new Auth0(l);
      a.findUser(slackId)
      .catch((reason) => {
        expect(reason).toBe('💩 Did not find exactly 1 user');
        expect(l.error).toHaveBeenCalled();
        resolve();
      });
    }));

    it('rejects multiple users', () => new Promise((resolve) => {
      const slackId = 'UABC123';
      const mockGet = jest.fn((path, cb) => {
        expect(path).toContain('/users?');
        expect(path).toContain(slackId);
        cb(null, { statusCode: 200 }, [1, 2]);
      });
      mockWreck = jest.fn(() => {
        const w = new EventEmitter();
        w.get = mockGet;
        return w;
      });
      const l = mockLogger();
      const a = new Auth0(l);
      a.findUser(slackId)
      .catch((reason) => {
        expect(reason).toBe('💩 Did not find exactly 1 user');
        expect(l.error).toHaveBeenCalled();
        resolve();
      });
    }));

    it('succeeds', () => new Promise((resolve) => {
      const slackId = 'UABC123';
      const mockGet = jest.fn((path, cb) => {
        expect(path).toContain('/users?');
        expect(path).toContain(slackId);
        cb(null, { statusCode: 200 }, [1]);
      });
      mockWreck = jest.fn(() => {
        const w = new EventEmitter();
        w.get = mockGet;
        return w;
      });
      const l = mockLogger();
      const a = new Auth0(l);
      a.findUser(slackId).then(resolve);
    }));
  });

  describe('deleteUser', () => {
    it('logs error', () => new Promise((resolve) => {
      const testUser = 'email|r4nD';
      const testErr = new Error('api-deleteUser-err');
      const mockDelete = jest.fn((path, cb) => {
        expect(path).toBe(`/users/${testUser}`);
        cb(testErr);
      });
      mockWreck = jest.fn(() => {
        const w = new EventEmitter();
        w.delete = mockDelete;
        return w;
      });
      const l = mockLogger();
      const a = new Auth0(l);
      a.deleteUser(testUser)
      .catch((reason) => {
        expect(reason).toBe(testErr);
        expect(l.error).toHaveBeenCalled();
        resolve();
      });
    }));

    it('logs rejected payload', () => new Promise((resolve) => {
      const testUser = 'email|r4nD';
      const testPayload = 'api-deleteUser-err';
      const mockDelete = jest.fn((path, cb) => {
        expect(path).toBe(`/users/${testUser}`);
        cb(null, { statusCode: 400 }, testPayload);
      });
      mockWreck = jest.fn(() => {
        const w = new EventEmitter();
        w.delete = mockDelete;
        return w;
      });
      const l = mockLogger();
      const a = new Auth0(l);
      a.deleteUser(testUser)
      .catch((reason) => {
        expect(reason).toBe(testPayload);
        expect(l.error).toHaveBeenCalled();
        resolve();
      });
    }));

    it('succeeds', () => new Promise((resolve) => {
      const testUser = 'email|r4nD';
      const mockDelete = jest.fn((path, cb) => {
        expect(path).toBe(`/users/${testUser}`);
        cb(null, { statusCode: 204 }, '');
      });
      mockWreck = jest.fn(() => {
        const w = new EventEmitter();
        w.delete = mockDelete;
        return w;
      });
      const l = mockLogger();
      const a = new Auth0(l);
      a.deleteUser(testUser).then(resolve);
    }));
  });
});
