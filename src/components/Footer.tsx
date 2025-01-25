/* ============================================================================================ */
// src/components/Footer.tsx
/* ============================================================================================ */
import clsx from "clsx";
import colorize from "@/utils/colorize";
import { Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
/* ============================================================================================ */
/* ============================================================================================ */
const Footer: React.FC = () => (
  <View className={clsx("relative", "w-full", "p-2")} style={{ backgroundColor: colorize("#0C0C0C", 1.0) }}>
    <Text className={clsx("text-center", "text-lg")} style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 1.0) }}>
      Crafted with <AntDesign name="heart" size={15} color={colorize("#FF000D", 1.0)} /> in India. All rights reserved
    </Text>
  </View>
);
export default Footer;
/* ============================================================================================ */
/* ============================================================================================ */
