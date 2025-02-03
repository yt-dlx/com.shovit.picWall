// src/components/AniHead.tsx
/* ============================================================================================================================== */
/* ============================================================================================================================== */
import imageSets from "@/utils/static";
import colorize from "@/utils/colorize";
import { Text, View, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, memo, useMemo } from "react";
import { ScrollingSlotProps } from "@/types/components";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, withDelay, FadeInDown } from "react-native-reanimated";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const ScrollingSlot: React.FC<ScrollingSlotProps> = memo(({ images, reverse, delay }) => {
  const wp = (percentage: number) => (320 * percentage) / 100;
  const hp = (percentage: number) => (568 * percentage) / 100;
  const imageHeight = hp(25);
  const opacity = useSharedValue(0);
  const scrollValue = useSharedValue(0);
  const totalHeight = useMemo(() => images.length * imageHeight, [images]);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 1000 }));
    scrollValue.value = withDelay(delay, withRepeat(withTiming(totalHeight, { duration: 10000 }), -1, reverse));
  }, [scrollValue, totalHeight, reverse, delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -scrollValue.value % totalHeight }],
    opacity: opacity.value
  }));

  return (
    <View style={{ flex: 1, overflow: "hidden", padding: wp(1) }}>
      <Animated.View style={[animatedStyle, { flexDirection: "column" }]}>
        {images.concat(images).map((uri: string, idx: number) => (
          <Image alt="Wallpaper preview" key={idx} source={{ uri }} style={{ width: "100%", height: imageHeight, borderRadius: wp(3), marginBottom: hp(0.5) }} resizeMode="cover" blurRadius={1.5} />
        ))}
      </Animated.View>
    </View>
  );
});
ScrollingSlot.displayName = "ScrollingSlot";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const AnimatedTitle: React.FC = memo(() => {
  const wp = (percentage: number) => (320 * percentage) / 100;
  const hp = (percentage: number) => (568 * percentage) / 100;
  const scale = useSharedValue(0.95);

  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(1.05, { duration: 2000 }), withTiming(0.95, { duration: 2000 })), -1, true);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View style={[animatedStyle, { alignItems: "center", marginTop: hp(5) }]}>
      <View style={{ backgroundColor: colorize("#171717", 0.6), borderRadius: wp(50), padding: wp(1) }}>
        <Image
          alt="picWallLogo"
          resizeMode="contain"
          source={require("@/assets/images/logo.jpg")}
          style={{
            width: wp(24),
            height: wp(24),
            borderRadius: wp(50),
            borderWidth: wp(0.5),
            borderColor: colorize("#F4F4F5", 1.0)
          }}
        />
      </View>
    </Animated.View>
  );
});
AnimatedTitle.displayName = "AnimatedTitle";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const HAnimated: React.FC = memo(() => {
  const wp = (percentage: number) => (320 * percentage) / 100;
  const hp = (percentage: number) => (568 * percentage) / 100;
  const rf = (size: number, factor = 0.5) => {
    const ratio = (size * 320) / 390;
    return size + (ratio - size) * factor;
  };
  const imageSetsMemo = useMemo(() => imageSets, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={{ flexDirection: "row", overflow: "hidden", borderRadius: wp(3), height: hp(50), position: "relative" }}>
        {imageSetsMemo.map((images, slotIndex) => (
          <ScrollingSlot key={slotIndex} images={images} reverse={slotIndex % 2 === 0} delay={slotIndex * 200} />
        ))}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: wp(2),
            overflow: "hidden"
          }}
        >
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colorize("#171717", 0.5) }} />
          <View style={{ position: "absolute", justifyContent: "center", alignItems: "center", margin: wp(2), padding: wp(1) }}>
            <View style={{ flexDirection: "row", marginBottom: hp(0.5) }}>
              <AnimatedTitle />
            </View>
            <Text
              style={{
                fontFamily: "Lobster",
                fontSize: rf(50),
                marginTop: hp(2),
                color: colorize("#F4F4F5", 1.0),
                lineHeight: rf(52)
              }}
            >
              picWall
            </Text>
            <Animated.View style={{ alignSelf: "center" }} entering={FadeInDown.delay(600).duration(1500).springify()}>
              <View
                style={{
                  backgroundColor: colorize("#171717", 0.6),
                  borderRadius: wp(50),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(0.5)
                }}
              >
                <Text
                  style={{
                    fontFamily: "Markazi",
                    color: colorize("#F4F4F5", 1.0),
                    fontSize: rf(12),
                    textAlign: "center"
                  }}
                >
                  Crafted with
                  <Text>
                    <AntDesign name="heart" size={rf(12)} color={colorize("#FF000D", 1.0)} />
                  </Text>
                  in India. All rights reserved
                </Text>
              </View>
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
});
HAnimated.displayName = "HAnimated";
export default HAnimated;
/* ============================================================================================================================== */
/* ============================================================================================================================== */
