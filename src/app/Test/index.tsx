// src/app/Test/index.tsx
/* ============================================================================================================================== */
/* ============================================================================================================================== */
import { Image } from "expo-image";
import { FC, useEffect } from "react";
import colorize from "@/utils/colorize";
import { Text, View } from "react-native";
import Footer from "@/components/Footer";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
/* ============================================================================================================================== */
const ErrorPage: FC = () => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  useEffect(() => {
    scale.value = withTiming(1, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });
  }, [opacity, scale]);
  return (
    <View
      style={{
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: "relative",
        alignItems: "center",
        borderLeftWidth: wp(0.4),
        borderRightWidth: wp(0.4),
        justifyContent: "flex-start",
        borderBottomWidth: wp(0.4),
        borderColor: colorize("#BE3025", 1.0),
        backgroundColor: colorize("#171717", 1.0)
      }}
    >
      <View style={{ position: "absolute", top: hp("10%"), left: 0, right: 0, justifyContent: "center", alignItems: "center" }}>
        <Image
          cachePolicy="disk"
          contentFit="contain"
          accessibilityLabel="picWallLogo"
          source={require("@/assets/images/logo.jpg")}
          style={{ width: wp(40), height: wp(40), borderWidth: wp(0.5), borderRadius: wp(50), borderColor: colorize("#BE3025", 1.0) }}
        />
      </View>
      <View style={{ alignItems: "center", marginTop: hp("20%") }}>
        <Text style={{ marginTop: wp("20%"), fontSize: wp("12%"), fontFamily: "Lobster", color: colorize("#BE3025", 1.0), textDecorationLine: "underline" }}>Oops Error</Text>
      </View>
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1 }}>
        <Footer />
      </View>
    </View>
  );
};
ErrorPage.displayName = "ErrorPage";
export default ErrorPage;
/* ============================================================================================================================== */
/* ============================================================================================================================== */
