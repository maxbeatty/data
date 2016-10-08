/* globals it, expect */
const help = require('./help.js');

it('help', () => {
  help({
    hears: (patterns, types, callback) => {
      expect(patterns.length).toBe(1);
      expect(patterns[0].toString()).toContain('help');
      expect(types).toEqual(['direct_mention', 'direct_message']);

      const mockMessage = {};

      callback({
        reply: (message, text) => {
          expect(message).toEqual(mockMessage);
          expect(text).toEqual('Auth0 usage: `add @user to Auth0` or `remove @user from Auth0`');
        },
      }, mockMessage);
    },
  }, { debug: () => {} });
});
