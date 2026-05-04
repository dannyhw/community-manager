const { getDefaultConfig } = require("expo/metro-config");
const { withStorybook } = require("@storybook/react-native/withStorybook");
const { withRozenite } = require("@rozenite/metro");

const config = getDefaultConfig(__dirname);

module.exports = withRozenite(
  withStorybook(config, {
    websockets: "auto",
    experimental_mcp: true,
  }),
  {
    enabled: true,
  },
);
