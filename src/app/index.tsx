// src/app/index.tsx;
import { Link } from "expo-router";
import { Image } from "expo-image";
import imageSets from "@/utils/static";
import Constants from "expo-constants";
import Colorizer from "@/utils/Colorizer";
import Footer from "@/components/Footer";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollingSlotProps } from "@/types/components";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { Text, View, TouchableOpacity, Linking } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, withSpring, Easing, FadeIn, FadeInDown, withDelay } from "react-native-reanimated";
// ============================================================================================
// ============================================================================================
const useVersionCheck = () => {
  const [updateRequired, setUpdateRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch("https://pic-wall.vercel.app/api/version");
        const { version: serverVersion } = await response.json();
        const currentVersion = Constants.expoConfig?.version;
        setUpdateRequired(serverVersion !== currentVersion);
        console.log("Current Version:", currentVersion);
        console.log("Server Version:", serverVersion);
      } catch (error) {
        console.error("Version check failed:", error);
        setUpdateRequired(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkVersion();
  }, []);
  return { updateRequired, isLoading };
};
// ============================================================================================
// ============================================================================================
const UpdateDialog: React.FC = () => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  useEffect(() => {
    scale.value = withTiming(1, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });
  }, [opacity, scale]);
  return (
    <View className="absolute inset-0 justify-center items-center p-4" style={{ zIndex: 1000 }}>
      <Animated.View className="absolute inset-0" style={[{ backgroundColor: Colorizer("#0C0C0C", 1.0) }]} />
      <View className="rounded-full p-1" style={{ backgroundColor: Colorizer("#0C0C0C", 0.8), justifyContent: "center", alignItems: "center" }}>
        <Image
          alt="logo"
          contentFit="contain"
          cachePolicy="disk"
          source={require("@/assets/images/logo.jpg")}
          style={{ width: 150, height: 150, borderWidth: 1, borderRadius: 9999, borderColor: Colorizer("#FFFFFF", 1.0) }}
        />
      </View>
      <View className="items-center">
        <Text className="m-6 text-4xl" style={{ fontFamily: "PlayfairDisplay_Black", color: Colorizer("#FFFFFF", 1.0) }}>
          Update Required
        </Text>
        <Text className="px-2 text-xl" style={{ fontFamily: "PlayfairDisplay_Regular", color: Colorizer("#FFFFFF", 1.0) }}>
          Please update the app to continue using picWall
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: Colorizer("#FFFFFF", 1.0) }}
          className="mt-2.5 px-5 py-2 rounded-2xl overflow-hidden"
          onPress={() => Linking.openURL("market://details?id=com.shovit.picWall")}
        >
          <Text className="text-xl" style={{ fontFamily: "PlayfairDisplay_Bold", color: Colorizer("#0C0C0C", 1.0) }}>
            Update Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
// ============================================================================================
// ============================================================================================
const ScrollingSlot: React.FC<ScrollingSlotProps> = ({ images, reverse, delay }) => {
  const imageHeight = 220;
  const totalHeight = images.length * imageHeight;
  const scrollValue = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 1500, easing: Easing.bezier(0.4, 0, 0.2, 1) }));
    scale.value = withDelay(delay, withSpring(1, { damping: 15, stiffness: 90 }));
    scrollValue.value = withDelay(delay, withRepeat(withTiming(totalHeight, { duration: 30000, easing: Easing.linear }), -1, reverse));
  }, [delay, opacity, reverse, scale, scrollValue, totalHeight]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -scrollValue.value % totalHeight }, { scale: scale.value }],
    opacity: opacity.value
  }));
  return (
    <View style={{ flex: 1, overflow: "hidden", padding: 2 }}>
      <Animated.View style={[animatedStyle]}>
        {images.concat(images).map((uri, idx) => (
          <Image key={idx} source={uri} contentFit="cover" cachePolicy="disk" style={{ shadowColor: Colorizer("#0C0C0C", 1.0), height: imageHeight, borderRadius: 15, width: "100%", margin: 2 }} />
        ))}
      </Animated.View>
    </View>
  );
};
// ============================================================================================
// ============================================================================================
const AnimatedTitle: React.FC = () => {
  const scale = useSharedValue(0.5);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 4000, easing: Easing.bezier(0.4, 0, 0.2, 1) }), withTiming(1.0, { duration: 4000, easing: Easing.bezier(0.4, 0, 0.2, 1) })),
      -1,
      true
    );
  }, [scale]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View
      style={[animatedStyle, { shadowColor: Colorizer("#0C0C0C", 1.0), shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12 }]}
      className="items-center mb-4"
      entering={FadeIn.delay(300).duration(1500)}
    >
      <View className="rounded-full p-1" style={{ backgroundColor: Colorizer("#0C0C0C", 0.8), justifyContent: "center", alignItems: "center" }}>
        <Image
          alt="logo"
          cachePolicy="disk"
          contentFit="contain"
          source={require("@/assets/images/logo.jpg")}
          style={{ width: 150, height: 150, borderWidth: 1, borderRadius: 9999, borderColor: Colorizer("#FFFFFF", 1.0) }}
        />
      </View>
    </Animated.View>
  );
};
// ============================================================================================
// ============================================================================================
const DevMsgModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const [countdown, setCountdown] = useState(__DEV__ ? 0 : 2);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  useEffect(() => {
    if (visible) {
      scale.value = withTiming(1, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(0.8, { duration: 300 });
    }
  }, [visible, opacity, scale]);
  const backdropStyle = useAnimatedStyle(() => ({ opacity: opacity.value * 0.9 }));
  const modalStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ scale: scale.value }] }));
  if (!visible) return null;
  return (
    <View className="absolute inset-0 justify-center items-center" style={{ zIndex: 1000 }}>
      <Animated.View className="absolute inset-0" style={[{ backgroundColor: Colorizer("#0C0C0C", 1.0) }, backdropStyle]} />
      <Animated.View className="rounded-3xl p-12 border-4" style={[{ backgroundColor: Colorizer("#0C0C0C", 1.0), borderColor: Colorizer("#FFFFFF", 1.0) }, modalStyle]}>
        <View className="items-center">
          <Text className="m-6 text-3xl" style={{ fontFamily: "PlayfairDisplay_Regular", color: Colorizer("#FFFFFF", 1.0) }}>
            👋🏻 Hello From Dev
          </Text>
          <Text className="text-2xl underline mt-8" style={{ fontFamily: "PlayfairDisplay_Regular", color: Colorizer("#FFFFFF", 1.0) }}>
            We Hate Ads (💀) !!
          </Text>
          <Text className="p-2 text-xl mb-4" style={{ fontFamily: "PlayfairDisplay_Regular", color: Colorizer("#FFFFFF", 1.0) }}>
            However It's The Only Free Way To Provide You AI-Generated Wallpapers Everyday. Hope You Understand 💘
          </Text>
          <TouchableOpacity className="mt-2.5 px-5 py-2 rounded-2xl overflow-hidden" style={{ backgroundColor: Colorizer("#FFFFFF", 1.0) }} onPress={onClose} disabled={countdown > 0}>
            <Text className="text-lg" style={{ fontFamily: "PlayfairDisplay_Regular", color: Colorizer("#0C0C0C", 1.0) }}>
              {countdown > 0 ? `Please Read: ${countdown}s` : "I understand!"}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};
// ============================================================================================
// ============================================================================================
export default function BasePage(): JSX.Element {
  const [showModal, setShowModal] = useState(true);
  const { updateRequired } = useVersionCheck();
  const buttonRotate = useSharedValue(0);
  const buttonGlow = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    buttonGlow.value = withRepeat(
      withSequence(withTiming(1, { duration: 2000, easing: Easing.bezier(0.4, 0, 0.2, 1) }), withTiming(0, { duration: 2000, easing: Easing.bezier(0.4, 0, 0.2, 1) })),
      -1,
      true
    );
  }, [buttonGlow]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }, { rotate: `${buttonRotate.value}deg` }],
    shadowOpacity: 0.3 + buttonGlow.value * 0.3,
    shadowRadius: 8 + buttonGlow.value * 4
  }));

  const onPressIn = () => {
    buttonScale.value = withSpring(0.94, { damping: 15, stiffness: 90 });
    buttonRotate.value = withSpring(-2, { damping: 15, stiffness: 90 });
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 90 });
    buttonRotate.value = withSpring(0, { damping: 15, stiffness: 90 });
  };
  if (updateRequired) return <UpdateDialog />;
  return (
    <View style={{ backgroundColor: Colorizer("#0C0C0C", 1.0) }} className="h-full w-full">
      <DevMsgModal visible={showModal} onClose={() => setShowModal(false)} />
      <View className="flex-1 justify-center items-center relative">
        <View className="flex-row h-full overflow-hidden relative">
          {imageSets.map((images, slotIndex) => (
            <ScrollingSlot key={slotIndex} images={images} reverse={slotIndex % 2 === 0} delay={slotIndex * 400} />
          ))}
          <LinearGradient
            colors={[Colorizer("#0C0C0C", 1.0), Colorizer("#0C0C0C", 0.4), Colorizer("#0C0C0C", 0.1), Colorizer("#0C0C0C", 0.4), Colorizer("#0C0C0C", 1.0)]}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
            locations={[0, 0.2, 0.4, 0.5, 1]}
          />
          <View className="absolute inset-0 justify-center items-center mt-14">
            <AnimatedTitle />
            <Animated.View entering={FadeInDown.delay(600).duration(1500).springify()}>
              <View>
                <Text className="text-center" style={{ fontSize: 80, fontFamily: "PlayfairDisplay_Black", color: Colorizer("#FFFFFF", 1.0), textShadowColor: Colorizer("#0C0C0C", 1.0) }}>
                  picWall
                </Text>
                <Animated.View style={{ alignSelf: "center" }} entering={FadeInDown.delay(600).duration(1500).springify()}>
                  <View style={{ backgroundColor: Colorizer("#0C0C0C", 0.6), borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 4 }}>
                    <Text style={{ fontFamily: "PlayfairDisplay_Regular", color: Colorizer("#FFFFFF", 1.0), fontSize: 10, textAlign: "center" }}>
                      Crafted with <AntDesign name="heart" size={10} color={Colorizer("#FFFFFF", 1.0)} /> in India. All rights reserved
                    </Text>
                  </View>
                </Animated.View>
              </View>
              <Link href="./Home" asChild>
                <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut} className="mt-44 rounded-full overflow-hidden">
                  <Animated.View style={[buttonAnimatedStyle, { shadowColor: Colorizer("#0C0C0C", 1.0), shadowOffset: { width: 0, height: 4 } }]}>
                    <View style={{ backgroundColor: Colorizer("#FFFFFF", 1.0) }} className="flex-row items-center justify-center py-4">
                      <FontAwesome5 name="camera-retro" size={32} color={Colorizer("#0C0C0C", 1.0)} style={{ marginRight: 12 }} />
                      <Text className="text-2xl" style={{ fontFamily: "PlayfairDisplay_Bold", color: Colorizer("#0C0C0C", 1.0) }}>
                        Let's Explore Wallpapers
                      </Text>
                    </View>
                  </Animated.View>
                </TouchableOpacity>
              </Link>
              <Animated.View entering={FadeIn.delay(1200).duration(1500)} style={{ marginTop: 10, paddingHorizontal: 20, alignItems: "center" }}>
                <Text style={{ fontFamily: "PlayfairDisplay_Regular", color: Colorizer("#FFFFFF", 0.8), fontSize: 15, textAlign: "center", marginBottom: 4 }}>Personalised AI Wallpapers</Text>
                <Text style={{ fontFamily: "PlayfairDisplay_Regular", color: Colorizer("#FFFFFF", 0.6), fontSize: 10, textAlign: "center", maxWidth: 300 }}>
                  Create stunning collections, share your moments, and discover amazing photographs from around the world. Join our community of passionate photographers today!
                </Text>
              </Animated.View>
            </Animated.View>
          </View>
        </View>
      </View>
      <Footer />
    </View>
  );
}
