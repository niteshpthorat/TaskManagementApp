import * as ReactOriginal from 'react';

module.exports = {
  ...ReactOriginal,
  useReducer: jest.fn((reducer, initialState) => [
    initialState,
    jest.fn()
  ])
};
