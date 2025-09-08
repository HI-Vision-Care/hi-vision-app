module.exports = function (api) {
  api.cache(true);
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],

    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],

          alias: {
            "@": "./",
            "@components": "./components",
            "@components/*": "./components/*",
            "tailwind.config": "./tailwind.config.js",
          },
        },
      ],
         'react-native-reanimated/plugin',
    ],
  };
};
