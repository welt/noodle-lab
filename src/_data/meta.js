import dotenv from "dotenv";
dotenv.config();

export default function () {
  return {
    ogDescription: "Carefree vanilla JavaScript codez, for fun.",
    ogTitle: "Hallo Welt",
    logEnabled: process.env.LOG_LEVEL === "1",
    repoUser: process.env.REPO_USER,
    repoName: process.env.REPO_NAME,
    repoUrl: `https://github.com/${process.env.REPO_USER}/${process.env.REPO_NAME}`,
    env: process.env.ELEVENTY_ENV,
  };
}
