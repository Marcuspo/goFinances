// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  testPathIgnorePatterns: ["/node_modules", "/android", "/ios"],
  preset: "jest-expo",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
}

module.exports = config
