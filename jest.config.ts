const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const esModules = ["ansi-styles"].join("|");

const jestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$",
  preset: "ts-jest",
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/coverage",
    "<rootDir>/dist",
  ],
  coveragePathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/coverage",
    "<rootDir>/dist",
    "<rootDir>/src/types",
    "<rootDir>/src/lib",
    "<rootDir>/src/locales",
    "<rootDir>/src/constants",
    "<rootDir>/src/assets",
    "<rootDir>/public",
    "\\.config\\.(ts|js)$",
  ],
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
    "@pages/(.*)": "<rootDir>/src/app/$1",
    "@/components/(.*)": "<rootDir>/src/components/$1",
    "@/serverApi/(.*)": "<rootDir>/serverApi/$1", 
    "@/context/(.*)": "<rootDir>/src/context/$1",
    "@/lib/(.*)": "<rootDir>/src/lib/$1",
    "@/network/(.*)": "<rootDir>/src/network/$1",
    "@/helper/(.*)": "<rootDir>/src/helper/$1",
    "@styles/(.*)": "<rootDir>/styles/$1",
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(css|sass|scss)$": "<rootDir>/mocks/styleMock.js",
    "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$": `<rootDir>/fileMock.js`,
    arcgis: `<rootDir>/mocks/esriMock.js`,
    mixpanel: `<rootDir>/mocks/mixpanelMock.js`,
    uuid: require.resolve("uuid"),
  },
  coverageDirectory: "coverage",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!${esModules})`,
    "/node_modules/(?!d3)/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};

module.exports = createJestConfig(jestConfig);
