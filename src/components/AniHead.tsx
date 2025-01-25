/* ============================================================================================ */
// src/utils/HeaderAnimated.tsx
/* ============================================================================================ */
import clsx from "clsx";
import imageSets from "@/utils/static";
import colorize from "@/utils/colorize";
import React, { useEffect } from "react";
import { Text, View, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { ScrollingSlotProps } from "@/types/components";
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
    <View className={clsx("flex-1", "overflow-hidden", "p-1")}>
      <Animated.View style={[animatedStyle]} className={clsx("flex-col")}>
        {images.concat(images).map((uri: string, idx: number) => (
          <Image
            key={idx}
            source={{ uri }}
            blurRadius={1.5}
            resizeMode="cover"
            alt="image-placeholder"
            className={clsx("w-full", "rounded-xl", "mb-1")}
            style={{ height: imageHeight, backgroundColor: colorize("#1A1A1A", 0.4) }}
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
    <Animated.View style={animatedStyle} className={clsx("items-center", "mt-10")}>
      <View className={clsx("rounded-full", "p-1")} style={{ backgroundColor: colorize("#0C0C0C", 0.6) }}>
        <Image
          resizeMode="contain"
          alt="image-placeholder"
          source={require("@/assets/images/logo.jpg")}
          style={{ borderColor: colorize("#FFFFFF", 1.0) }}
          className={clsx("w-24", "h-24", "rounded-full", "border-2")}
        />
      </View>
    </Animated.View>
  );
};
/* ============================================================================================ */
/* ============================================================================================ */
export default function HAnimated(): JSX.Element {
  return (
    <View className={clsx("flex-1", "items-center", "justify-center")}>
      <View className={clsx("flex-row", "overflow-hidden", "rounded-xl", "h-[300px]", "relative")}>
        {imageSets.map((images, slotIndex) => (
          <ScrollingSlot key={slotIndex} images={images} reverse={slotIndex % 2 === 0} delay={slotIndex * 200} />
        ))}
        <View className={clsx("absolute", "top-0", "left-0", "right-0", "bottom-0", "justify-center", "items-center", "rounded", "overflow-hidden")}>
          <View className={clsx("absolute", "top-0", "left-0", "right-0", "bottom-0")} style={{ backgroundColor: colorize("#0C0C0C", 0.5) }} />
          <View className={clsx("absolute", "justify-center", "items-center", "m-2", "p-1")}>
            <View className={clsx("flex-row", "mb-1")}>
              <AnimatedTitle />
            </View>
            <Text className={clsx("text-center")} style={{ fontFamily: "Jersey", fontSize: 65, color: colorize("#FFFFFF", 1.0), lineHeight: 52 }}>
              picWall
            </Text>
            <Animated.View entering={FadeInDown.delay(600).duration(1500).springify()} className={clsx("self-center")}>
              <View className={clsx("rounded-full", "px-3", "py-1")} style={{ backgroundColor: colorize("#0C0C0C", 0.6) }}>
                <Text className={clsx("text-center", "text-xs")} style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 1.0) }}>
                  Crafted with <AntDesign name="heart" size={10} color={colorize("#FF000D", 1.0)} /> in India. All rights reserved
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
