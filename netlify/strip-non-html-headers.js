/**
 * Set headers on all requests with a `/*` rule in netlify.toml,
 * then use this edge function to strip headers from non-HTML responses,
 * where they are mostly superfluous.
 * @see https://dev.to/philw_/using-a-netlify-edge-worker-to-cut-down-on-header-bloat-by-removing-html-only-headers-from-your-static-assets-3nh9
 * @see https://webhint.io/docs/user-guide/hints/hint-no-html-only-headers
 */
export default async (_request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type");

  if (
    !contentType ||
    contentType.startsWith("text/html") ||
    contentType.startsWith("text/plain")
  ) {
    return response;
  }

  const htmlOnlyHeaders = [
    "content-security-policy",
    "x-content-security-policy",
    "x-ua-compatible",
    "x-webkit-csp",
    "x-xss-protection",
    "x-frame-options",
  ];

  response.headers.forEach((_value, key, object) => {
    // Pass through CSP headers for JS files.
    if (
      contentType.startsWith("text/javascript") &&
      (key === "content-security-policy" || key === "x-content-security-policy")
    ) {
      context.log("Ignoring as a JS file");
      return;
    }

    if (htmlOnlyHeaders.includes(key.toLowerCase())) {
      object.delete(key);
    }
  });

  return response;
};
