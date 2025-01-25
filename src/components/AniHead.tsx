/* ============================================================================================ */
// src/utils/HeaderAnimated.tsx
/* ============================================================================================ */
import clsx from "clsx";
import imageSets from "@/utils/static";
import colorize from "@/utils/colorize";
import { Text, View, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React, { memo, useEffect, useMemo } from "react";
import { ScrollingSlotProps } from "@/types/components";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, withDelay, FadeInDown } from "react-native-reanimated";
/* ============================================================================================ */
/* ============================================================================================ */
const ScrollingSlot = memo<ScrollingSlotProps>(({ images, reverse, delay }) => {
  const imageHeight = 200;
  const opacity = useSharedValue(0);
  const scrollValue = useSharedValue(0);
  const totalHeight = useMemo(() => images.length * imageHeight, [images]);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 1000 }));
    scrollValue.value = withDelay(delay, withRepeat(withTiming(totalHeight, { duration: 10000 }), -1, reverse));
  }, [scrollValue, totalHeight, reverse, delay, opacity]);
  const doubledImages = useMemo(() => images.concat(images), [images]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -scrollValue.value % totalHeight }], opacity: opacity.value }));
  return (
    <View className={clsx("flex-1", "overflow-hidden", "p-1")}>
      <Animated.View className={clsx("flex-col")} style={animatedStyle}>
        {doubledImages.map((uri: string, idx: number) => (
          <Image
            source={{ uri }}
            blurRadius={1.5}
            key={`${uri}-${idx}`}
            resizeMode="cover"
            alt="image-placeholder"
            style={{ width: "100%", height: imageHeight, borderRadius: 12, marginBottom: 4, backgroundColor: colorize("#1A1A1A", 0.4) }}
          />
        ))}
      </Animated.View>
    </View>
  );
});
ScrollingSlot.displayName = "ScrollingSlot";
/* ============================================================================================ */
/* ============================================================================================ */
const AnimatedTitle = memo(() => {
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
          style={{ width: 96, height: 96, borderRadius: 9999, borderWidth: 2, borderColor: colorize("#FFFFFF", 1.0) }}
        />
      </View>
    </Animated.View>
  );
});
AnimatedTitle.displayName = "AnimatedTitle";
/* ============================================================================================ */
/* ============================================================================================ */
const HAnimated = memo(() => {
  const gradientOverlay = useMemo(() => [colorize("#0C0C0C", 0.5)], []);
  return (
    <View className={clsx("flex-1", "items-center", "justify-center")}>
      <View className={clsx("flex-row", "overflow-hidden", "rounded-xl", "h-[300px]", "relative")}>
        {imageSets.map((images, slotIndex) => (
          <ScrollingSlot key={slotIndex} images={images} reverse={slotIndex % 2 === 0} delay={slotIndex * 200} />
        ))}
        <View className={clsx("absolute", "top-0", "left-0", "right-0", "bottom-0", "justify-center", "items-center", "rounded", "overflow-hidden")}>
          <View className={clsx("absolute", "top-0", "left-0", "right-0", "bottom-0")} style={{ backgroundColor: gradientOverlay[0] }} />
          <View className={clsx("absolute", "justify-center", "items-center", "m-2", "p-1")}>
            <View className={clsx("flex-row", "mb-1")}>
              <AnimatedTitle />
            </View>
            <Text className={clsx("text-[65px]", "mt-4")} style={{ fontFamily: "Jersey", color: colorize("#FFFFFF", 1.0), lineHeight: 52 }}>
              picWall
            </Text>
            <Animated.View entering={FadeInDown.delay(600).duration(1500).springify()} className={clsx("self-center")}>
              <View className={clsx("rounded-full", "px-3", "py-1")} style={{ backgroundColor: colorize("#0C0C0C", 0.6) }}>
                <Text className={clsx("text-xs", "text-center")} style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 1.0) }}>
                  Crafted with <AntDesign name="heart" size={10} color={colorize("#FF000D", 1.0)} /> in India. All rights reserved
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
/* ============================================================================================ */
/* ============================================================================================ */
