module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.jsx?$": "babel-jest",
      "^.+\\.css$": "jest-transform-css"
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    moduleNameMapper: {
      '\\.css$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: ["/node_modules/"],
  };
  