// src/components/Footer.tsx
/* ============================================================================================================================== */
/* ============================================================================================================================== */
import { memo } from "react";
import colorize from "@/utils/colorize";
import { Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const Footer: React.FC = memo(() => {
  return (
    <View style={{ padding: wp(2), backgroundColor: colorize("#171717", 1.0) }}>
      <Text
        style={{
          textAlign: "center",
          fontSize: wp(4),
          fontFamily: "Lobster",
          color: colorize("#F4F4F5", 1.0)
        }}
      >
        Crafted with
        <Text>
          <AntDesign name="heart" size={wp(5)} color={colorize("#BE3025", 1.0)} />
        </Text>
        in India. All rights reserved
      </Text>
    </View>
  );
});
Footer.displayName = "Footer";
export default Footer;
/* ============================================================================================================================== */
/* ============================================================================================================================== */
