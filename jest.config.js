module.exports = {
  testEnvironment: "node",
  silent: true,
  transform: {
    "^.+\\.(js|mjs)$": "babel-jest",
  },
  transformIgnorePatterns: [],
  moduleNameMapper: {
    "\\.(css|less|scss|sss|styl)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/path/to/mock/file.js",
  },
  moduleFileExtensions: ["js", "mjs", "jsx", "json", "node"],
  roots: ["<rootDir>/__tests__"],
  testMatch: ["**/__tests__/**/*.+(ts|tsx|js)"],
};
