// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': './fileMock.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!d3-interpolate|d3-scale|d3-axis|d3-shape|@nivo/).+\\.js$',
  ],

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
};
