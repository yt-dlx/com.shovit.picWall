const { withNativeWind } = require("nativewind/metro");
const { getDefaultConfig } = require("expo/metro-config");
module.exports = withNativeWind(getDefaultConfig(__dirname), { input: "./global.css" });
