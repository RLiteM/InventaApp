import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";


export default [
  {
    files: ["**/*.{js,jsx}"],
    ...pluginReactConfig,
    languageOptions: {
      ...pluginReactConfig.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": "warn",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": ["error", { "varsIgnorePattern": "^[A-Z_].*$", "argsIgnorePattern": "^$" }],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  pluginJs.configs.recommended,
];
