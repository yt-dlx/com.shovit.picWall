/* ============================================================================================ */
// src/components/Footer.tsx
/* ============================================================================================ */
import { memo } from "react";
import Colorizer from "@/utils/colorize";
import { Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
/* ============================================================================================ */
/* ============================================================================================ */
const Footer: React.FC = memo(() => (
  <View style={{ position: "relative", width: "100%", padding: 8, backgroundColor: Colorizer("#0C0C0C", 1.0) }}>
    <Text style={{ textAlign: "center", fontSize: 14, fontFamily: "Kurale", color: Colorizer("#FFFFFF", 1.0) }}>
      Crafted with <AntDesign name="heart" size={15} color={Colorizer("#FF000D", 1.0)} /> in India. All rights reserved
    </Text>
  </View>
));
Footer.displayName = "Footer";
export default Footer;
/* ============================================================================================ */
/* ============================================================================================ */
