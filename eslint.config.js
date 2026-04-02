export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      semi: ["error", "never"],
      quotes: ["error", "single"],
      indent: ["error", 2],
    },
  },
];
