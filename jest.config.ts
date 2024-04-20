// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getJestProjects } = require("@nx/jest");

export default {
  coverageDirectory: "coverage",
  projects: getJestProjects()
};
