import dateFilter from "./scripts/dateFilter.js";
import dotenv from "dotenv";
dotenv.config();

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/fonts/**/*.*");
  eleventyConfig.addPassthroughCopy("./src/images/**/*.{png,jpg,webp}");
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/media/**/*.{mp3,mp4,webm,jpg,png}");
  eleventyConfig.addPassthroughCopy("./src/workers/worker.*.js");
  eleventyConfig.addWatchTarget("./src/js/");
  eleventyConfig.addWatchTarget("./src/scss/");
  eleventyConfig.addFilter("date", dateFilter);
  eleventyConfig.addShortcode("year", () => {
    return String(new Date().getFullYear());
  });
  eleventyConfig.addShortcode("nonce", () => {
    const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return nonce;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
    },
    templateFormats: ["html", "hbs", "njk", "md", "11ty.js"],
  };
}
