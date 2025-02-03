// src/app/index.tsx
/* ============================================================================================================================== */
/* ============================================================================================================================== */
import { Link } from "expo-router";
import { Image } from "expo-image";
import colorize from "@/utils/colorize";
import imageSets from "@/utils/static";
import Footer from "@/components/Footer";
import { memo, useEffect, useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollingSlotProps } from "@/types/components";
import { Text, View, TouchableOpacity } from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, withSpring, Easing, FadeIn, FadeInDown, withDelay } from "react-native-reanimated";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const ScrollingSlot = memo<ScrollingSlotProps>(({ images, delay }) => {
  const imageHeight = hp("30%");
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const scrollValue = useSharedValue(0);
  const totalHeight = useMemo(() => images.length * imageHeight, [images]);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 10 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 20, stiffness: 50 }));
    scrollValue.value = withDelay(delay, withRepeat(withTiming(totalHeight, { duration: 10000, easing: Easing.linear }), -1));
  }, [delay, opacity, scale, scrollValue, totalHeight]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -scrollValue.value % totalHeight }, { scale: scale.value }], opacity: opacity.value }));
  return (
    <View style={{ flex: 1, overflow: "hidden", padding: wp("0.5%") }}>
      <Animated.View style={animatedStyle}>
        {images.concat(images).map((uri, idx) => (
          <Image alt="Wallpaper image" source={uri} key={`${uri}-${idx}`} contentFit="cover" cachePolicy="disk" style={{ height: imageHeight, borderRadius: wp("4%"), width: "100%", marginBottom: hp("0.5%") }} />
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
      <View style={{ borderRadius: wp("10%"), padding: wp("2%"), justifyContent: "center", alignItems: "center" }}>
        <Image
          cachePolicy="disk"
          contentFit="contain"
          accessibilityLabel="App logo"
          source={require("@/assets/images/logo.jpg")}
          style={{ width: wp("40%"), height: wp("40%"), borderWidth: wp("0.5%"), borderRadius: wp("20%"), borderColor: colorize("#F4F4F5", 1.0) }}
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
  const buttonScale = useSharedValue(1);
  const buttonRotate = useSharedValue(0);
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
  return (
    <View style={{ flex: 1, backgroundColor: colorize("#171717", 1.0) }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", position: "relative" }}>
        <View style={{ flexDirection: "row", height: "100%", overflow: "hidden", position: "relative" }}>
          {imageSets.map((images, slotIndex) => (
            <ScrollingSlot key={slotIndex} images={images} delay={slotIndex * 400} reverse={true} />
          ))}
          <LinearGradient
            colors={[colorize("#171717", 1.0), colorize("#171717", 0.4), colorize("#171717", 0.1), colorize("#171717", 0.4), colorize("#171717", 1.0)]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            locations={[0, 0.2, 0.4, 0.5, 1]}
          />
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", marginTop: hp("8%") }}>
            <AnimatedTitle />
            <Animated.View entering={FadeInDown.delay(600).duration(1500).springify()}>
              <View>
                <Text style={{ fontSize: wp("20%"), fontFamily: "Lobster", color: colorize("#F4F4F5", 1.0), textAlign: "center" }}> picWall </Text>
                <Animated.View style={{ alignSelf: "center" }} entering={FadeInDown.delay(600).duration(1500).springify()}>
                  <View style={{ borderRadius: wp("10%"), paddingHorizontal: wp("6%"), paddingVertical: hp("1%"), backgroundColor: colorize("#171717", 0.9) }}>
                    <Text style={{ fontFamily: "Markazi", color: colorize("#F4F4F5", 1.0), fontSize: wp("3.25%"), textAlign: "center" }}>
                      Crafted with
                      <Text>
                        <AntDesign name="heart" size={wp("3%")} color={colorize("#BE3025", 1.0)} />
                      </Text>
                      in India. All rights reserved
                    </Text>
                  </View>
                </Animated.View>
              </View>
              <Link href="./Home" asChild>
                <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut} style={{ marginTop: hp("18%"), borderRadius: wp("12.5%"), overflow: "hidden" }}>
                  <View style={{ paddingVertical: hp("2%"), flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: colorize("#F4F4F5", 1.0), gap: wp("2%") }}>
                    <FontAwesome5 name="camera-retro" size={wp("8%")} color={colorize("#171717", 1.0)} />
                    <Text style={{ fontSize: wp("5%"), fontFamily: "Lobster", color: colorize("#171717", 1.0) }}> Let's Explore ... </Text>
                  </View>
                </TouchableOpacity>
              </Link>
              <Animated.View entering={FadeIn.delay(1200).duration(1500)} style={{ marginTop: hp("2%"), paddingHorizontal: wp("10%"), alignItems: "center" }}>
                <Text style={{ fontFamily: "Markazi", color: colorize("#F4F4F5", 0.9), fontSize: wp("3%"), maxWidth: wp("65%") }}>
                  Transform your screens with stunning, AI-curated wallpapers tailored to your style. Explore breathtaking collections, share your favorite moments, and discover awe-inspiring photographs from around the globe. Start your journey
                  today – where every wallpaper tells a story!
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
/* ============================================================================================================================== */
/* ============================================================================================================================== */
