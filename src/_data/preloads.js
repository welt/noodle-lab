import dotenv from "dotenv";
dotenv.config();

export default function () {
  const siteUrl = process.env.SITE_URL;
  return {
    "https://api.github.com": "preconnect",
    "https://api.openf1.org": "preconnect",
    "https://api.carbonintensity.org.uk": "preconnect",
  };
}
