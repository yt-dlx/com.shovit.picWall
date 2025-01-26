/* ============================================================================================ */
// src/utils/HeaderAnimated.tsx
/* ============================================================================================ */
import imageSets from "@/utils/static";
import Colorizer from "@/utils/colorize";
import { Text, View, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, memo, useMemo } from "react";
import { ScrollingSlotProps } from "@/types/components";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, withDelay, FadeInDown } from "react-native-reanimated";
/* ============================================================================================ */
/* ============================================================================================ */
const ScrollingSlot: React.FC<ScrollingSlotProps> = memo(({ images, reverse, delay }) => {
  const imageHeight = 200;
  const opacity = useSharedValue(0);
  const scrollValue = useSharedValue(0);
  const totalHeight = useMemo(() => images.length * imageHeight, [images]);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 1000 }));
    scrollValue.value = withDelay(delay, withRepeat(withTiming(totalHeight, { duration: 10000 }), -1, reverse));
  }, [scrollValue, totalHeight, reverse, delay, opacity]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -scrollValue.value % totalHeight }], opacity: opacity.value }));
  return (
    <View style={{ flex: 1, overflow: "hidden", padding: 4 }}>
      <Animated.View style={[animatedStyle, { flexDirection: "column" }]}>
        {images.concat(images).map((uri: string, idx: number) => (
          <Image alt="Wallpaper preview" key={idx} source={{ uri }} style={{ width: "100%", height: imageHeight, borderRadius: 12, marginBottom: 4 }} resizeMode="cover" blurRadius={1.5} />
        ))}
      </Animated.View>
    </View>
  );
});
ScrollingSlot.displayName = "ScrollingSlot";
/* ============================================================================================ */
/* ============================================================================================ */
const AnimatedTitle: React.FC = memo(() => {
  const scale = useSharedValue(0.95);
  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(1.05, { duration: 2000 }), withTiming(0.95, { duration: 2000 })), -1, true);
  }, [scale]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[animatedStyle, { alignItems: "center", marginTop: 40 }]}>
      <View style={{ backgroundColor: Colorizer("#1B1C1D", 0.6), borderRadius: 9999, padding: 4 }}>
        <Image
          resizeMode="contain"
          alt="App logo"
          source={require("@/assets/images/logo.jpg")}
          style={{ width: 96, height: 96, borderRadius: 9999, borderWidth: 2, borderColor: Colorizer("#FFFFFF", 1.0) }}
        />
      </View>
    </Animated.View>
  );
});
AnimatedTitle.displayName = "AnimatedTitle";
/* ============================================================================================ */
/* ============================================================================================ */
const HAnimated: React.FC = memo(() => {
  const imageSetsMemo = useMemo(() => imageSets, []);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={{ flexDirection: "row", overflow: "hidden", borderRadius: 12, height: 300, position: "relative" }}>
        {imageSetsMemo.map((images, slotIndex) => (
          <ScrollingSlot key={slotIndex} images={images} reverse={slotIndex % 2 === 0} delay={slotIndex * 200} />
        ))}
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", borderRadius: 8, overflow: "hidden" }}>
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: Colorizer("#1B1C1D", 0.5) }} />
          <View style={{ position: "absolute", justifyContent: "center", alignItems: "center", margin: 8, padding: 4 }}>
            <View style={{ flexDirection: "row", marginBottom: 4 }}>
              <AnimatedTitle />
            </View>
            <Text style={{ fontFamily: "Jersey", fontSize: 65, marginTop: 15, color: Colorizer("#FFFFFF", 1.0), lineHeight: 52 }}> picWall </Text>
            <Animated.View style={{ alignSelf: "center" }} entering={FadeInDown.delay(600).duration(1500).springify()}>
              <View style={{ backgroundColor: Colorizer("#1B1C1D", 0.6), borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 4 }}>
                <Text style={{ fontFamily: "Kurale", color: Colorizer("#FFFFFF", 1.0), fontSize: 12, textAlign: "center" }}>
                  Crafted with <AntDesign name="heart" size={10} color={Colorizer("#FF000D", 1.0)} /> in India. All rights reserved
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
