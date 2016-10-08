/* globals jest, describe, it, expect */

const mockStartRTM = jest.fn();

jest.mock('winston', () => ({
  debug: () => {},
  error: () => {},
}));

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
  it('all good', () => {
    mockStartRTM.mockImplementationOnce(cb => cb(null, {}, { testing: true }));

    lib.start();
  });

  it('error starting RTM', () => {
    mockStartRTM.mockImplementationOnce(cb => cb(new Error('testing')));

    lib.start();
  });

  it('sets logger level to debug when env var is set', () => {
    mockStartRTM.mockImplementationOnce(cb => cb(null, {}, { testing: true }));

    process.env.DEBUG = true;

    lib.start();

    // cleanup
    delete process.env.DEBUG;
  });
});
