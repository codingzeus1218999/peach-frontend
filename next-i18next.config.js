module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "sv"],
  },
  react: {
    useSuspense: false,
  },
  ns: ["translations"],
  defaultNS: "translations",
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/locales",
};
