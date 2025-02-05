// src/components/Footer.tsx
/* ============================================================================================================================== */
/* ============================================================================================================================== */
import { memo } from "react";
import colorize from "@/utils/colorize";
import { Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useVersionCheck } from "@/hooks/useVersionCheck";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const Footer: React.FC = memo(() => {
  const { currentVersion, serverVersion } = useVersionCheck();
  return (
    <View style={{ padding: wp(2), backgroundColor: colorize("#171717", 1.0) }}>
      <Text
        style={{
          fontSize: wp(4),
          textAlign: "center",
          fontFamily: "Lobster",
          color: colorize("#F4F4F5", 1.0)
        }}
      >
        Crafted with
        <AntDesign name="heart" size={wp(5)} color={colorize("#AF3C2E", 1.0)} />
        in India. All rights reserved
      </Text>
      <Text
        style={{
          fontSize: wp(3),
          textAlign: "center",
          fontFamily: "Markazi",
          color: colorize("#F4F4F5", 1.0)
        }}
      >
        App Version: {currentVersion} -x- Server Runtime: {serverVersion}
      </Text>
    </View>
  );
});
Footer.displayName = "Footer";
export default Footer;
/* ============================================================================================================================== */
/* ============================================================================================================================== */
