import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

/** Flat config, native to Next 16's eslint-config-next. */
const config = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts", "out/**"] },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      // Inline styles appear only for one-off layout nudges; the design system
      // itself lives in src/styles/globals.css.
      "@next/next/no-img-element": "error",
    },
  },
];

export default config;

