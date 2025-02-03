// src/app/Update/index.tsx
/* ============================================================================================================================== */
/* ============================================================================================================================== */
import { Image } from "expo-image";
import { FC, useEffect } from "react";
import colorize from "@/utils/colorize";
import { Entypo } from "@expo/vector-icons";
import { useVersionCheck } from "@/hooks/useVersionCheck";
import { Text, View, TouchableOpacity, Linking } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const UpdatePage: FC = () => {
  const { updateRequired, currentVersion, serverVersion } = useVersionCheck();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  useEffect(() => {
    scale.value = withTiming(1, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });
  }, [opacity, scale]);
  if (!updateRequired) {
    return (
      <View style={{ flex: 1, backgroundColor: colorize("#171717", 1.0) }}>
        <Text style={{ color: "#F4F4F5", textAlign: "center", marginTop: hp("50%") }}>No Update Required</Text>
      </View>
    );
  }
  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", padding: wp("4%"), zIndex: 1000 }}>
      <View style={{ borderRadius: wp("10%"), padding: wp("2%"), backgroundColor: colorize("#171717", 0.8), justifyContent: "center", alignItems: "center" }}>
        <Image
          cachePolicy="disk"
          contentFit="contain"
          accessibilityLabel="picWallLogo"
          source={require("@/assets/images/logo.jpg")}
          style={{ width: wp("40%"), height: wp("40%"), borderWidth: wp("0.5%"), borderRadius: wp("20%"), borderColor: colorize("#F4F4F5", 1.0) }}
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={{ margin: wp("6%"), fontSize: wp("9%"), fontFamily: "Lobster", color: colorize("#F4F4F5", 1.0) }}> Update Required </Text>
        <View style={{ marginBottom: hp("2%"), alignItems: "center" }}>
          <Text style={{ fontSize: wp("4.5%"), fontFamily: "Markazi", color: colorize("#F4F4F5", 1.0) }}> Current Version: {currentVersion} </Text>
          <Text style={{ fontSize: wp("4.5%"), fontFamily: "Markazi", color: colorize("#F4F4F5", 1.0) }}> Latest Version: {serverVersion} </Text>
        </View>
        <TouchableOpacity
          style={{ marginTop: hp("10%"), flexDirection: "row", alignItems: "center", borderRadius: wp("12.5%"), paddingVertical: hp("2%"), justifyContent: "center", paddingHorizontal: wp("10%"), backgroundColor: colorize("#F4F4F5", 1.0) }}
          onPress={() => Linking.openURL("market://details?id=com.shovit.picWall")}
        >
          <Entypo name="google-play" size={wp("8%")} color={colorize("#171717", 1.0)} />
          <Text style={{ fontSize: wp("5%"), fontFamily: "Lobster", color: colorize("#171717", 1.0), marginLeft: wp("4%") }}> Open Play Store ... </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
UpdatePage.displayName = "UpdatePage";
export default UpdatePage;
/* ============================================================================================================================== */
/* ============================================================================================================================== */
