import dateFilter from "./scripts/dateFilter.js";
import dotenv from "dotenv";
dotenv.config();

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/fonts/**/*.*");
  eleventyConfig.addPassthroughCopy("./src/images/**/*.{png,jpg,webp}");
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/media/**/*.{mp3,mp4,webm}");
  eleventyConfig.addWatchTarget("./src/js/");
  eleventyConfig.addWatchTarget("./src/scss/");
  eleventyConfig.addFilter("date", dateFilter);

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
    },
    templateFormats: ["html", "hbs", "njk", "md", "11ty.js"],
  };
}
