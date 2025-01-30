import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import stylisticPlugin from "@stylistic/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        plugins: {
            "@stylistic": stylisticPlugin,
        },
        rules: {
            "@stylistic/semi": "error",
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/indent": ["error", 4],
            "@stylistic/comma-dangle": ["error", "always-multiline"],
            "@stylistic/no-trailing-spaces": "error",
            "@stylistic/object-curly-spacing": ["error", "always"],
            "@stylistic/no-multiple-empty-lines": ["error", {
                max: 1,
                maxEOF: 0,
                maxBOF: 0,
            }],
            "@stylistic/padding-line-between-statements": [
                "error",
                { blankLine: "always", prev: "*", next: "return" },
                { blankLine: "always", prev: "block-like", next: "*" },
                { blankLine: "always", prev: "*", next: "block-like" },
                { blankLine: "always", prev: "export", next: "export" },
            ],
        },
    },
];

export default eslintConfig;