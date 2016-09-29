/* globals jest, describe, test, expect */

const mockStartRTM = jest.fn();

jest.mock('console');

jest.mock('botkit', () => ({
  slackbot: () => ({
    hears: () => {},
    spawn: () => ({
      startRTM: mockStartRTM,
    }),
  }),
}));

const lib = require('./index');

describe('main', () => {
  test('all good', () => {
    mockStartRTM.mockImplementationOnce(cb => cb(null, {}, { testing: true }));

    lib.start();
  });

  test('error starting RTM', () => {
    mockStartRTM.mockImplementationOnce(cb => cb(new Error('testing')));

    lib.start();
  });
});
