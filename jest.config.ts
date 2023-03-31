// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getJestProjects } = require("@nrwl/jest");

export default {
  coverageDirectory: "coverage",
  projects: getJestProjects()
};
