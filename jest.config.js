// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: "jest-expo",
  testPathIgnorePatterns: ["/node_modules", "/android", "/ios"],
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "jest-styled-components",
  ],
  setupFiles: ["./path/to/jestSetupFile.js"],
}

module.exports = config
