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
        const response = await fetch(__DEV__ ? "http://192.168.23.98:3000/api/version" : "https://picwall-server.netlify.app/api/version", {
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
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  useEffect(() => {
    scale.value = withTiming(1, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });
  }, [opacity, scale]);
  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", padding: 16, zIndex: 1000 }}>
      <Animated.View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colorize("#0C0C0C", 1.0) }} />
      <View style={{ borderRadius: 9999, padding: 4, backgroundColor: colorize("#0C0C0C", 0.8), justifyContent: "center", alignItems: "center" }}>
        <Image
          cachePolicy="disk"
          contentFit="contain"
          accessibilityLabel="App logo"
          source={require("@/assets/images/logo.jpg")}
          style={{ width: 150, height: 150, borderWidth: 1, borderRadius: 9999, borderColor: colorize("#FFFFFF", 1.0) }}
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={{ margin: 24, fontSize: 36, fontFamily: "Jersey", color: colorize("#FFFFFF", 1.0) }}> Update Required </Text>
        <View style={{ marginBottom: 16, alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontFamily: "Kurale", color: colorize("#FFFFFF", 1.0) }}> - Current Version: {currentVersion} </Text>
          <Text style={{ fontSize: 18, fontFamily: "Kurale", color: colorize("#FFFFFF", 1.0) }}> - Latest Version: {serverVersion} </Text>
        </View>
        <Text style={{ paddingHorizontal: 8, fontSize: 20, marginBottom: 16, fontFamily: "Kurale", color: colorize("#FFFFFF", 1.0) }}>Please update the app to continue using picWall</Text>
        <TouchableOpacity
          style={{ marginTop: 10, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 16, overflow: "hidden", backgroundColor: colorize("#FFFFFF", 1.0), minWidth: 200, minHeight: 44 }}
          onPress={() => Linking.openURL("market://details?id=com.shovit.picWall")}
          accessibilityLabel="Update application"
        >
          <Text style={{ fontSize: 20, fontFamily: "Kurale", color: colorize("#0C0C0C", 1.0) }}> Update Now </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
UpdateDialog.displayName = "UpdateDialog";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const ScrollingSlot = memo<ScrollingSlotProps>(({ images, delay }) => {
  const imageHeight = 200;
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const scrollValue = useSharedValue(0);
  const totalHeight = useMemo(() => images.length * imageHeight, [images]);
  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 20, stiffness: 50 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 0 }));
    scrollValue.value = withDelay(delay, withRepeat(withTiming(totalHeight, { duration: 60000, easing: Easing.linear }), -1));
  }, [delay, opacity, scale, scrollValue, totalHeight]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -scrollValue.value % totalHeight }, { scale: scale.value }], opacity: opacity.value }));
  return (
    <View style={{ flex: 1, overflow: "hidden", padding: 2 }}>
      <Animated.View style={animatedStyle} shouldRasterizeIOS renderToHardwareTextureAndroid>
        {images.concat(images).map((uri, idx) => (
          <Image alt="Wallpaper image" source={uri} key={`${uri}-${idx}`} contentFit="cover" cachePolicy="disk" style={{ height: 200, borderRadius: 15, width: "100%", marginBottom: 4 }} />
        ))}
      </Animated.View>
    </View>
  );
});
ScrollingSlot.displayName = "ScrollingSlot";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const AnimatedTitle = memo(() => {
  const scale = useSharedValue(0.5);
  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(1.2, { duration: 4000 }), withTiming(1.0, { duration: 4000 })), -1, true);
  }, [scale]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={animatedStyle}>
      <View style={{ borderRadius: 9999, padding: 4, backgroundColor: colorize("#0C0C0C", 0.8), justifyContent: "center", alignItems: "center" }}>
        <Image
          cachePolicy="disk"
          contentFit="contain"
          accessibilityLabel="App logo"
          source={require("@/assets/images/logo.jpg")}
          style={{ width: 150, height: 150, borderWidth: 1, borderRadius: 9999, borderColor: colorize("#FFFFFF", 1.0) }}
        />
      </View>
    </Animated.View>
  );
});
AnimatedTitle.displayName = "AnimatedTitle";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const BasePage = memo(() => {
  const buttonGlow = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const buttonRotate = useSharedValue(0);
  const { updateRequired, currentVersion, serverVersion } = useVersionCheck();
  useEffect(() => {
    buttonGlow.value = withRepeat(withSequence(withTiming(1, { duration: 2000 }), withTiming(0, { duration: 2000 })), -1, true);
  }, [buttonGlow]);
  const onPressIn = () => {
    buttonScale.value = withSpring(0.94, { damping: 15, stiffness: 90 });
    buttonRotate.value = withSpring(-2, { damping: 15, stiffness: 90 });
  };
  const onPressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 90 });
    buttonRotate.value = withSpring(0, { damping: 15, stiffness: 90 });
  };
  if (updateRequired) return <UpdateDialog currentVersion={currentVersion} serverVersion={serverVersion} />;
  return (
    <View style={{ flex: 1, backgroundColor: colorize("#0C0C0C", 1.0) }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", position: "relative" }}>
        <View style={{ flexDirection: "row", height: "100%", overflow: "hidden", position: "relative" }}>
          {imageSets.map((images, slotIndex) => (
            <ScrollingSlot key={slotIndex} images={images} delay={slotIndex * 400} reverse={false} />
          ))}
          <LinearGradient
            colors={[colorize("#0C0C0C", 1.0), colorize("#0C0C0C", 0.4), colorize("#0C0C0C", 0.1), colorize("#0C0C0C", 0.4), colorize("#0C0C0C", 1.0)]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            locations={[0, 0.2, 0.4, 0.5, 1]}
          />
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", marginTop: 56 }}>
            <AnimatedTitle />
            <Animated.View entering={FadeInDown.delay(600).duration(1500).springify()}>
              <View>
                <Text style={{ fontSize: 100, fontFamily: "Jersey", color: colorize("#FFFFFF", 1.0), textAlign: "center" }}>picWall</Text>
                <Animated.View style={{ alignSelf: "center" }} entering={FadeInDown.delay(600).duration(1500).springify()}>
                  <View style={{ borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: colorize("#0C0C0C", 0.9) }}>
                    <Text style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 1.0), fontSize: 12, textAlign: "center" }}>
                      Crafted with <AntDesign name="heart" size={12} color={colorize("#FF000D", 1.0)} /> in India. All rights reserved
                    </Text>
                  </View>
                </Animated.View>
              </View>
              <Link href="./Home" asChild>
                <TouchableOpacity
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                  style={{ marginTop: 180, borderRadius: 50, overflow: "hidden", minWidth: 240, minHeight: 60 }}
                  accessibilityLabel="Navigate to Home screen"
                >
                  <View style={[{ shadowColor: colorize("#0C0C0C", 1.0), shadowOffset: { width: 0, height: 4 } }]}>
                    <View style={{ paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: colorize("#FFFFFF", 1.0) }}>
                      <FontAwesome5 name="camera-retro" size={32} color={colorize("#0C0C0C", 1.0)} />
                      <Text style={{ fontSize: 35, fontFamily: "Jersey", color: colorize("#0C0C0C", 1.0) }}> Let&apos;s Explore </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
              <Animated.View entering={FadeIn.delay(1200).duration(1500)} style={{ marginTop: 10, paddingHorizontal: 20, alignItems: "center" }}>
                <Text style={{ fontFamily: "Jersey", color: colorize("#FFFFFF", 1.0), fontSize: 15, textAlign: "center", marginBottom: 4 }}>Perfect AI Wallpapers, Every Day!</Text>
                <Text style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 0.9), fontSize: 10, textAlign: "center", maxWidth: 300 }}>
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
BasePage.displayName = "BasePage";
export default BasePage;
