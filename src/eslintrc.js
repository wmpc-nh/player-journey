// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react", "jsx-a11y"],
  rules: {
    "react/react-in-jsx-scope": "off", // not needed in React 17+
    "react/prop-types": "off", // optional if you're using TypeScript or prop validation elsewhere
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
