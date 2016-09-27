/* globals test, expect */
const hello = require('./index.js');

test('hears "hello" and replies', () => {
  hello({
    hears: (patterns, types, callback) => {
      expect(patterns).toBe('hello');
      expect(types).toEqual(['direct_message', 'direct_mention', 'mention']);

      const mockMessage = { cool: 'beans' };

      callback({
        reply: (message, text) => {
          expect(message).toEqual(mockMessage);
          expect(text).toBe('Hello. How are you seeking advice?');
        },
      }, mockMessage);
    },
  });
});
