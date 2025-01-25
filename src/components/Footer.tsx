/* ============================================================================================ */
// src/components/Footer.tsx
/* ============================================================================================ */
import { clsx } from "clsx";
import { Platform } from "react-native";
import colorize from "@/utils/colorize";
import { Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
/* ============================================================================================ */
const Footer: React.FC = () => (
  <View
    className={clsx("w-full p-2", Platform.OS === "web" ? "web:shadow-lg" : "shadow-md")}
    style={{
      ...Platform.select({ web: { borderTopWidth: 1 } }),
      backgroundColor: colorize(Platform.select({ ios: "#FEFEFE", android: "#FAFAFA", web: "#F8F9FC" }) ?? "#FFFFFF", 1)
    }}
  >
    <View
      className="rounded-full px-3 py-2"
      style={{
        ...Platform.select({ web: { boxShadow: "0 4px 12px -2px rgba(0,0,0,0.25)" } }),
        backgroundColor: colorize(Platform.select({ ios: "#0C0C0C", android: "#1A1A1A", web: "#020617" }) ?? "#0C0C0C", 0.6)
      }}
    >
      <Text
        className="text-center text-xs web:text-sm"
        style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 1), fontSize: Platform.select({ ios: 14, android: 13, web: 15 }), ...Platform.select({ android: { includeFontPadding: false } }) }}
      >
        Crafted with <AntDesign name="heart" size={Platform.select({ ios: 14, default: 15 })} color={colorize("#FF000D", 1)} /> in India
      </Text>
    </View>
  </View>
);
export default Footer;
/* ============================================================================================ */
