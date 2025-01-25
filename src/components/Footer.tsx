/* ============================================================================================ */
// src/components/Footer.tsx
/* ============================================================================================ */
import Colorizer from "@/utils/colorize";
import { Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
/* ============================================================================================ */
/* ============================================================================================ */
const Footer: React.FC = () => (
  <View style={{ position: "relative", width: "100%", padding: 8, backgroundColor: Colorizer("#0C0C0C", 1.0) }}>
    <View style={{ borderRadius: 9999, padding: 12, backgroundColor: Colorizer("#0C0C0C", 0.6) }}>
      <Text style={{ textAlign: "center", fontSize: 14, fontFamily: "Kurale", color: Colorizer("#FFFFFF", 1.0) }}>
        Crafted with <AntDesign name="heart" size={15} color={Colorizer("#FF000D", 1.0)} /> in India. All rights reserved
      </Text>
    </View>
  </View>
);
export default Footer;
/* ============================================================================================ */
/* ============================================================================================ */
