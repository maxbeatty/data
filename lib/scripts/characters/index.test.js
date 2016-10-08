/* globals it, expect */
const characters = require('./index');

it('hears "*character*" and replies with character', () => {
  characters({
    hears: (patterns, types, callback) => {
      expect(patterns).toBe('(.*)character(.*)');
      expect(types).toEqual(['direct_message', 'direct_mention', 'mention']);

      const mockMessage = { cool: 'beans' };

      callback({
        reply: (message, text) => {
          expect(message).toEqual(mockMessage);
          expect(text).toMatch(/^\n\*Name\*:\s(.+)\n\*Rank\*:\s(.+)/);
        },
      }, mockMessage);
    },
  }, { debug: () => {} });
});
