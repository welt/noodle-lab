import dotenv from "dotenv";
dotenv.config();

export default function () {
  console.log("REPO_USER:", process.env.REPO_USER); // Should print 'welt'

  return {
    ogDescription: "Lorem ipsum dolor sit amet",
    ogTitle: "Duis eu massa vitae nisi efficitur ornare",
    logEnabled: process.env.LOG_LEVEL === "1",
    repoUser: process.env.REPO_USER,
    repoName: process.env.REPO_NAME,
    repoUrl: `https://github.com/${process.env.REPO_USER}/${process.env.REPO_NAME}`,
    env: process.env.ELEVENTY_ENV,
  };
}
