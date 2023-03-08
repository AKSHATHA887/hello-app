const mockPassport = {
  use: jest.fn(),
  initialize: jest.fn(() => () => 'init'),
  authenticate: jest.fn(() => () => 'authenticate'),
};
jest.mock(
  'passport',
  () => mockPassport
); /* eslint-disable @typescript-eslint/no-unused-vars */
import app from '../../src/app';
import passport from 'passport';

describe('app', () => {
  it('works', async () => {
    // test just to confirm app is exportable
    expect(app).toBeTruthy();
    // arrange
    // act
    // assert
  });
});
