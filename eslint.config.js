import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  pluginJs.configs.recommended,
  {
    files: ["src/**/*.js", "./*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        global: "readonly",
      },
    },
    rules: {
      // Set max line length (e.g., 80 characters)
      "max-len": [
        "warn",
        {
          code: 80,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
    },
  },
  {
    files: ["tests/**/*.test.js"],
    rules: {
      "no-unused-vars": "off",
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        global: "readonly",
      },
    },
  },
];
