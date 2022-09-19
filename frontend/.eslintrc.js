module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-empty": [
      "error",
      {
        allowEmptyCatch: true,
      },
    ],
    // https://github.com/typescript-eslint/typescript-eslint/issues/2063#issuecomment-675156492=
    "@typescript-eslint/ban-types": [
      "error",
      {
        extendDefaults: true,
        types: {
          "{}": false,
        },
      },
    ],
    curly: ["error", "all"],
    "@typescript-eslint/naming-convention": [
      "warn",
      {
        selector: "default",
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },
      // Functions may be components in PascalCase
      {
        selector: "function",
        format: ["PascalCase", "camelCase"],
        leadingUnderscore: "allow",
      },
      {
        selector: "variable",
        format: ["PascalCase", "camelCase"],
        leadingUnderscore: "allow",
      },
      {
        selector: "variable",
        modifiers: ["global"],
        format: ["PascalCase", "camelCase", "UPPER_CASE"],
        leadingUnderscore: "allow",
      },
      {
        selector: "variable",
        modifiers: ["destructured"],
        format: null,
      },
      {
        selector: "objectLiteralProperty",
        format: null,
      },
      // Sometimes type property might be components in PascalCase
      {
        selector: "typeProperty",
        format: ["PascalCase", "camelCase"],
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
      {
        selector: "enumMember",
        format: ["UPPER_CASE"],
      },
    ],
  },
};
