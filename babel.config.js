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
            "tailwind.config": "./tailwind.config.js",
          },
        },
      ],
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env", // import { X } from '@env'
          path: ".env", // file .env nằm ở gốc
          safe: false, // nếu đặt true thì cần có .env.example
          allowUndefined: true, // để biến không có giá trị vẫn không crash
        },
      ],
    ],
  };
};
