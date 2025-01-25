/* ============================================================================================ */
// src/utils/HeaderAnimated.tsx
/* ============================================================================================ */
import { clsx } from "clsx";
import imageSets from "@/utils/static";
import colorize from "@/utils/colorize";
import React, { useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Text, View, Image, Platform } from "react-native";
import type { ScrollingSlotProps } from "@/types/components";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, withDelay, FadeInDown } from "react-native-reanimated";
/* ============================================================================================ */
/* ============================================================================================ */
const ScrollingSlot: React.FC<ScrollingSlotProps> = ({ images, reverse, delay }) => {
  const imageHeight = 200;
  const totalHeight = images.length * imageHeight;
  const scrollValue = useSharedValue(0);
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 1000 }));
    scrollValue.value = withDelay(delay, withRepeat(withTiming(totalHeight, { duration: 10000 }), -1, reverse));
  }, [scrollValue, totalHeight, reverse, delay, opacity]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -scrollValue.value % totalHeight }], opacity: opacity.value }));
  return (
    <View className={clsx("flex-1 overflow-hidden p-1", { "web:shadow-xl": Platform.OS === "web" })}>
      <Animated.View className="flex-col" style={animatedStyle}>
        {images.concat(images).map((uri, idx) => (
          <Image
            key={idx}
            alt="image-placeholder"
            source={{ uri }}
            className="w-full rounded-xl mb-1"
            style={{ height: imageHeight, ...Platform.select({ android: { elevation: 8 }, ios: { shadowColor: colorize("#000", 0.2), shadowRadius: 8 } }) }}
          />
        ))}
      </Animated.View>
    </View>
  );
};
/* ============================================================================================ */
/* ============================================================================================ */
const AnimatedTitle: React.FC = () => {
  const scale = useSharedValue(0.95);
  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(1.05, { duration: 2000 }), withTiming(0.95, { duration: 2000 })), -1, true);
  }, [scale]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={animatedStyle} className="items-center mt-10">
      <View className="rounded-full p-1" style={{ backgroundColor: colorize("#0C0C0C", 0.6), ...Platform.select({ web: { boxShadow: "0 8px 24px -4px rgba(0,0,0,0.4)" } }) }}>
        <Image
          alt="image-placeholder"
          source={require("@/assets/images/logo.jpg")}
          className="w-24 h-24 rounded-full border-2"
          style={{ borderColor: colorize(Platform.select({ ios: "#FFF", android: "#FAFAFA", web: "#F8F9FC" }) ?? "#FFFFFF", 1) }}
        />
      </View>
    </Animated.View>
  );
};
/* ============================================================================================ */
/* ============================================================================================ */
export default function HAnimated(): JSX.Element {
  return (
    <View className="flex-1 items-center justify-center ios:bg-[#fefefe] android:bg-[#fafafa] web:bg-gray-100">
      <View className="flex-row overflow-hidden rounded-xl relative" style={{ height: 300 }}>
        {imageSets.map((images, slotIndex) => (
          <ScrollingSlot key={slotIndex} {...{ images, reverse: slotIndex % 2 === 0, delay: slotIndex * 200 }} />
        ))}
        <View className="absolute inset-0 justify-center items-center rounded overflow-hidden">
          <View style={{ backgroundColor: colorize(Platform.select({ ios: "#0C0C0C", android: "#1A1A1A", web: "#020617" }) ?? "#0C0C0C", 0.5) }} className="absolute inset-0" />
          <View className="m-2 p-1 absolute justify-center items-center">
            <View className="flex-row mb-1">
              <AnimatedTitle />
            </View>
            <Text
              className="web:font-bold"
              style={{
                lineHeight: 52,
                fontFamily: "Jersey",
                color: colorize("#FFFFFF", 1),
                fontSize: Platform.select({ ios: 65, android: 60, web: 72 }),
                ...Platform.select({ web: { textShadow: "0 2px 8px rgba(0,0,0,0.3)" } })
              }}
            >
              picWall
            </Text>
            <Animated.View entering={FadeInDown.delay(600).duration(1500).springify()}>
              <View className="rounded-full px-3 py-1" style={{ backgroundColor: colorize("#0C0C0C", 0.6), ...Platform.select({ web: { boxShadow: "0 4px 12px -2px rgba(0,0,0,0.25)" } }) }}>
                <Text className="text-xs web:text-sm" style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 1), ...Platform.select({ android: { includeFontPadding: false } }) }}>
                  Crafted with <AntDesign name="heart" size={10} color={colorize("#FF000D", 1)} /> in India. All rights reserved
                </Text>
              </View>
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
}
/* ============================================================================================ */
/* ============================================================================================ */
