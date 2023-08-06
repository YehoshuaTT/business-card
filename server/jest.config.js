// jest.config.js
module.exports = {
  silent: true,
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {},
  transformIgnorePatterns: [],

  // Use the module name mapper to handle imports from non-JS files, if needed
  moduleNameMapper: {
    "\\.(css|less|scss|sss|styl)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/path/to/mock/file.js",
  },
  moduleFileExtensions: ["js", "jsx", "json", "node"],
};
