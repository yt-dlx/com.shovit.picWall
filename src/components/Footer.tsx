/* ============================================================================================ */
// src/components/Footer.tsx
/* ============================================================================================ */
import { memo } from "react";
import Colorizer from "@/utils/colorize";
import { Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { moderateScale, verticalScale } from "react-native-size-matters";
/* ============================================================================================ */
/* ============================================================================================ */
const Footer: React.FC = memo(() => (
  <View style={{ position: "relative", width: "100%", padding: moderateScale(8), backgroundColor: Colorizer("#171819", 1.0) }}>
    <Text style={{ textAlign: "center", fontSize: moderateScale(14), fontFamily: "Kurale", color: Colorizer("#F4F4F5", 1.0) }}>
      Crafted with <AntDesign name="heart" size={moderateScale(15)} color={Colorizer("#FF000D", 1.0)} /> in India. All rights reserved
    </Text>
  </View>
));
Footer.displayName = "Footer";
export default Footer;
/* ============================================================================================ */
/* ============================================================================================ */
