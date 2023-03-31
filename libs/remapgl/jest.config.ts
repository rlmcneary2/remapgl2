/* eslint-disable */
export default {
  displayName: "remapgl",
  preset: "../../jest.preset.js",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  transform: {
    "^.+\\.[tj]sx?$": [
      "babel-jest",
      { cwd: __dirname, configFile: "./babel-jest.config.json" }
    ]
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"]
};
