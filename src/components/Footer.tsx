/* ============================================================================================ */
// src/components/Footer.tsx
/* ============================================================================================ */
import { memo } from "react";
import colorize from "@/utils/colorize";
import { Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
/* ============================================================================================ */
/* ============================================================================================ */
const useResponsiveStyles = () => {
  const { width } = useWindowDimensions();
  const rf = (size: number, factor = 0.5) => {
    const ratio = (size * width) / 390;
    return size + (ratio - size) * factor;
  };
  return { rf };
};
/* ============================================================================================ */
/* ============================================================================================ */
const Footer: React.FC = memo(() => {
  const { rf } = useResponsiveStyles();
  return (
    <View className="relative w-full" style={{ padding: rf(8), backgroundColor: colorize("#111111", 1.0) }}>
      <Text style={{ textAlign: "center", fontSize: rf(14), fontFamily: "RobotoCondensed", color: colorize("#F4F4F5", 1.0) }}>
        Crafted with <AntDesign name="heart" size={rf(15)} color={colorize("#FF000D", 1.0)} /> in India. All rights reserved{" "}
      </Text>
    </View>
  );
});
Footer.displayName = "Footer";
export default Footer;
/* ============================================================================================ */
/* ============================================================================================ */
