/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"],
  testMatch: ["**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }]
  },
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  // (opcional, ajuda a evitar que o Jest varra o dist/)
  testPathIgnorePatterns: ["/node_modules/", "/dist/"]
};
