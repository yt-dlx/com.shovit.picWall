/* ============================================================================================================================== */
// src/app/index.tsx
/* ============================================================================================================================== */
import { Link } from "expo-router";
import { Image } from "expo-image";
import colorize from "@/utils/colorize";
import imageSets from "@/utils/static";
import Constants from "expo-constants";
import Footer from "@/components/Footer";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollingSlotProps } from "@/types/components";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { FC, memo, useEffect, useState, useMemo } from "react";
import { Text, View, TouchableOpacity, Linking } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, withSpring, Easing, FadeIn, FadeInDown, withDelay } from "react-native-reanimated";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const useVersionCheck = () => {
  const [serverVersion, setServerVersion] = useState("");
  const [currentVersion, setCurrentVersion] = useState("");
  const [updateRequired, setUpdateRequired] = useState(false);
  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch("https://picwall-server.netlify.app/api/version", {
          headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const receivedVersion = data?.version || data?.data?.version;
        const current = Constants.expoConfig?.version || "";
        setCurrentVersion(current);
        setServerVersion(receivedVersion);
        setUpdateRequired(receivedVersion !== current);
      } catch (error) {
        console.error("Version check failed:", error);
        setUpdateRequired(false);
      }
    };
    checkVersion();
    const interval = setInterval(checkVersion, 300000);
    return () => clearInterval(interval);
  }, []);
  return useMemo(() => ({ updateRequired, currentVersion, serverVersion }), [updateRequired, currentVersion, serverVersion]);
};
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const UpdateDialog: FC<{ serverVersion: string; currentVersion: string }> = memo(({ currentVersion, serverVersion }) => {
  const scale = useSharedValue(moderateScale(0.8));
  const opacity = useSharedValue(0);
  useEffect(() => {
    scale.value = withTiming(moderateScale(1), { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });
  }, [opacity, scale]);
  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", padding: moderateScale(16), zIndex: 1000 }}>
      <Animated.View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colorize("#171819", 1.0) }} />
      <View style={{ borderRadius: verticalScale(9999), padding: moderateScale(4), backgroundColor: colorize("#171819", 0.8), justifyContent: "center", alignItems: "center" }}>
        <Image
          cachePolicy="disk"
          contentFit="contain"
          accessibilityLabel="App logo"
          source={require("@/assets/images/logo.jpg")}
          style={{ width: verticalScale(150), height: verticalScale(150), borderWidth: moderateScale(1), borderRadius: verticalScale(9999), borderColor: colorize("#F4F4F5", 1.0) }}
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={{ margin: verticalScale(24), fontSize: moderateScale(36), fontFamily: "Zoika", color: colorize("#F4F4F5", 1.0) }}> Update Required </Text>
        <View style={{ marginBottom: verticalScale(16), alignItems: "center" }}>
          <Text style={{ fontSize: moderateScale(18), fontFamily: "Kurale", color: colorize("#F4F4F5", 1.0) }}> - Current Version: {currentVersion} </Text>
          <Text style={{ fontSize: moderateScale(18), fontFamily: "Kurale", color: colorize("#F4F4F5", 1.0) }}> - Latest Version: {serverVersion} </Text>
        </View>
        <Text style={{ paddingHorizontal: moderateScale(8), fontSize: moderateScale(20), marginBottom: verticalScale(16), fontFamily: "Kurale", color: colorize("#F4F4F5", 1.0) }}>
          Please update the app to continue using picWall
        </Text>
        <TouchableOpacity
          style={{
            marginTop: verticalScale(10),
            paddingHorizontal: moderateScale(32),
            paddingVertical: verticalScale(16),
            borderRadius: moderateScale(16),
            overflow: "hidden",
            backgroundColor: colorize("#F4F4F5", 1.0),
            minWidth: moderateScale(200),
            minHeight: verticalScale(44)
          }}
          onPress={() => Linking.openURL("market://details?id=com.shovit.picWall")}
          accessibilityLabel="Update application"
        >
          <Text style={{ fontSize: moderateScale(20), fontFamily: "Kurale", color: colorize("#171819", 1.0) }}> Update Now </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
UpdateDialog.displayName = "UpdateDialog";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const ScrollingSlot = memo<ScrollingSlotProps>(({ images, delay }) => {
  const imageHeight = verticalScale(200);
  const scale = useSharedValue(moderateScale(0.9));
  const opacity = useSharedValue(0);
  const scrollValue = useSharedValue(0);
  const totalHeight = useMemo(() => images.length * imageHeight, [images]);
  useEffect(() => {
    scale.value = withDelay(delay, withSpring(moderateScale(1), { damping: 20, stiffness: 50 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 0 }));
    scrollValue.value = withDelay(delay, withRepeat(withTiming(totalHeight, { duration: 60000, easing: Easing.linear }), -1));
  }, [delay, opacity, scale, scrollValue, totalHeight]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -scrollValue.value % totalHeight }, { scale: scale.value }], opacity: opacity.value }));
  return (
    <View style={{ flex: 1, overflow: "hidden", padding: moderateScale(2) }}>
      <Animated.View style={animatedStyle} shouldRasterizeIOS renderToHardwareTextureAndroid>
        {images.concat(images).map((uri, idx) => (
          <Image
            alt="Wallpaper image"
            source={uri}
            key={`${uri}-${idx}`}
            contentFit="cover"
            cachePolicy="disk"
            style={{ height: verticalScale(200), borderRadius: moderateScale(15), width: "100%", marginBottom: verticalScale(4) }}
          />
        ))}
      </Animated.View>
    </View>
  );
});
ScrollingSlot.displayName = "ScrollingSlot";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const AnimatedTitle = memo(() => {
  const scale = useSharedValue(moderateScale(0.5));
  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(moderateScale(1.2), { duration: 4000 }), withTiming(moderateScale(1.0), { duration: 4000 })), -1, true);
  }, [scale]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={animatedStyle}>
      <View style={{ borderRadius: verticalScale(9999), padding: moderateScale(4), backgroundColor: colorize("#171819", 0.8), justifyContent: "center", alignItems: "center" }}>
        <Image
          cachePolicy="disk"
          contentFit="contain"
          accessibilityLabel="App logo"
          source={require("@/assets/images/logo.jpg")}
          style={{ width: verticalScale(150), height: verticalScale(150), borderWidth: moderateScale(1), borderRadius: verticalScale(9999), borderColor: colorize("#F4F4F5", 1.0) }}
        />
      </View>
    </Animated.View>
  );
});
AnimatedTitle.displayName = "AnimatedTitle";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const EntryPage = memo(() => {
  const buttonGlow = useSharedValue(0);
  const buttonScale = useSharedValue(moderateScale(1));
  const buttonRotate = useSharedValue(0);
  const { updateRequired, currentVersion, serverVersion } = useVersionCheck();
  useEffect(() => {
    buttonGlow.value = withRepeat(withSequence(withTiming(1, { duration: 2000 }), withTiming(0, { duration: 2000 })), -1, true);
  }, [buttonGlow]);
  const onPressIn = () => {
    buttonScale.value = withSpring(moderateScale(0.94), { damping: 15, stiffness: 90 });
    buttonRotate.value = withSpring(-2, { damping: 15, stiffness: 90 });
  };
  const onPressOut = () => {
    buttonScale.value = withSpring(moderateScale(1), { damping: 15, stiffness: 90 });
    buttonRotate.value = withSpring(0, { damping: 15, stiffness: 90 });
  };
  if (updateRequired) return <UpdateDialog currentVersion={currentVersion} serverVersion={serverVersion} />;
  return (
    <View style={{ flex: 1, backgroundColor: colorize("#171819", 1.0) }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", position: "relative" }}>
        <View style={{ flexDirection: "row", height: "100%", overflow: "hidden", position: "relative" }}>
          {imageSets.map((images, slotIndex) => (
            <ScrollingSlot key={slotIndex} images={images} delay={slotIndex * 400} reverse={false} />
          ))}
          <LinearGradient
            colors={[colorize("#171819", 1.0), colorize("#171819", 0.4), colorize("#171819", 0.1), colorize("#171819", 0.4), colorize("#171819", 1.0)]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            locations={[0, 0.2, 0.4, 0.5, 1]}
          />
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", marginTop: verticalScale(56) }}>
            <AnimatedTitle />
            <Animated.View entering={FadeInDown.delay(600).duration(1500).springify()}>
              <View>
                <Text style={{ fontSize: moderateScale(100), fontFamily: "Zoika", color: colorize("#F4F4F5", 1.0), textAlign: "center" }}>picWall</Text>
                <Animated.View style={{ alignSelf: "center" }} entering={FadeInDown.delay(600).duration(1500).springify()}>
                  <View style={{ borderRadius: verticalScale(9999), paddingHorizontal: moderateScale(12), paddingVertical: verticalScale(4), backgroundColor: colorize("#171819", 0.9) }}>
                    <Text style={{ fontFamily: "Kurale", color: colorize("#F4F4F5", 1.0), fontSize: moderateScale(12), textAlign: "center" }}>
                      Crafted with <AntDesign name="heart" size={moderateScale(12)} color={colorize("#FF000D", 1.0)} /> in India. All rights reserved
                    </Text>
                  </View>
                </Animated.View>
              </View>
              <Link href="./Home" asChild>
                <TouchableOpacity
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                  style={{ marginTop: verticalScale(180), borderRadius: verticalScale(50), overflow: "hidden", minWidth: moderateScale(240), minHeight: verticalScale(60) }}
                  accessibilityLabel="Navigate to Home screen"
                >
                  <View style={[{ shadowColor: colorize("#171819", 1.0), shadowOffset: { width: 0, height: verticalScale(4) } }]}>
                    <View style={{ paddingVertical: verticalScale(16), flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: colorize("#F4F4F5", 1.0) }}>
                      <FontAwesome5 name="camera-retro" size={moderateScale(32)} color={colorize("#171819", 1.0)} />
                      <Text style={{ fontSize: moderateScale(30), fontFamily: "Zoika", color: colorize("#171819", 1.0) }}> Let&apos;s Explore </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
              <Animated.View entering={FadeIn.delay(1200).duration(1500)} style={{ marginTop: verticalScale(10), paddingHorizontal: moderateScale(20), alignItems: "center" }}>
                <Text style={{ fontFamily: "Kurale", color: colorize("#FF000D", 1.0), fontSize: moderateScale(15), textAlign: "center", marginBottom: verticalScale(4) }}>
                  Perfect AI Wallpapers, Every Day!
                </Text>
                <Text style={{ fontFamily: "Kurale", color: colorize("#F4F4F5", 0.9), fontSize: moderateScale(10), textAlign: "center", maxWidth: moderateScale(300) }}>
                  Transform your screens with stunning, AI-curated wallpapers tailored to your style. Explore breathtaking collections, share your favorite moments, and discover awe-inspiring
                  photographs from around the globe. Start your journey today – where every wallpaper tells a story!
                </Text>
              </Animated.View>
            </Animated.View>
          </View>
        </View>
      </View>
      <Footer />
    </View>
  );
});
EntryPage.displayName = "EntryPage";
export default EntryPage;
/* ============================================================================================ */
/* ============================================================================================ */
