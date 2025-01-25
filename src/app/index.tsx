/* ============================================================================================================================== */
// src/app/index.tsx
/* ============================================================================================================================== */
import clsx from "clsx";
import { Link } from "expo-router";
import { Image } from "expo-image";
import colorize from "@/utils/colorize";
import imageSets from "@/utils/static";
import Constants from "expo-constants";
import Footer from "@/components/Footer";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollingSlotProps } from "@/types/components";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { Text, View, TouchableOpacity, Linking } from "react-native";
import { FC, JSX, memo, useEffect, useState, useMemo } from "react";
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
  return { updateRequired, currentVersion, serverVersion };
};
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const UpdateDialog: FC<{ serverVersion: string; currentVersion: string }> = ({ currentVersion, serverVersion }) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  useEffect(() => {
    scale.value = withTiming(1, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });
  }, [opacity, scale]);
  return (
    <View className={clsx("absolute", "top-0", "left-0", "right-0", "bottom-0", "justify-center", "items-center", "p-4", "z-[1000]")}>
      <Animated.View style={{ backgroundColor: colorize("#0C0C0C", 1.0) }} className={clsx("absolute", "top-0", "left-0", "right-0", "bottom-0")} />
      <View style={{ backgroundColor: colorize("#0C0C0C", 0.8) }} className={clsx("rounded-full", "p-1", "justify-center", "items-center")}>
        <Image
          cachePolicy="disk"
          contentFit="contain"
          alt="image-placeholder"
          source={require("@/assets/images/logo.jpg")}
          style={{ width: 150, height: 150, borderRadius: 9999, borderWidth: 1, borderColor: colorize("#FFFFFF", 1.0) }}
        />
      </View>
      <View className={clsx("items-center")}>
        <Text style={{ fontFamily: "Jersey", color: colorize("#FFFFFF", 1.0) }} className={clsx("text-4xl", "m-6")}>
          Update Required
        </Text>
        <View className={clsx("mb-4", "items-center")}>
          <Text style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 0.8) }} className={clsx("text-lg")}>
            - Current Version: {currentVersion}
          </Text>
          <Text style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 0.8) }} className={clsx("text-lg")}>
            - Latest Version: {serverVersion}
          </Text>
        </View>
        <Text style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 1.0) }} className={clsx("text-xl", "px-2", "mb-4")}>
          Please update the app to continue using picWall
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: colorize("#FFFFFF", 1.0) }}
          className={clsx("mt-2", "px-5", "py-2", "rounded-2xl", "overflow-hidden")}
          onPress={() => Linking.openURL("market://details?id=com.shovit.picWall")}
        >
          <Text style={{ fontFamily: "Kurale", color: colorize("#0C0C0C", 1.0) }} className={clsx("text-xl")}>
            Update Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
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
    <View className={clsx("flex-1", "overflow-hidden", "p-0.5")}>
      <Animated.View style={animatedStyle} className={clsx("flex-col")} shouldRasterizeIOS renderToHardwareTextureAndroid>
        {images.concat(images).map((uri, idx) => (
          <Image
            source={uri}
            contentFit="cover"
            cachePolicy="disk"
            key={`${uri}-${idx}`}
            alt="image-placeholder"
            style={{ width: "100%", height: imageHeight, borderRadius: 12, marginBottom: 4, backgroundColor: colorize("#1A1A1A", 0.4) }}
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
  const scale = useSharedValue(0.5);
  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(1.2, { duration: 4000 }), withTiming(1.0, { duration: 4000 })), -1, true);
  }, [scale]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={animatedStyle}>
      <View style={{ backgroundColor: colorize("#0C0C0C", 0.8) }} className={clsx("rounded-full", "p-1", "justify-center", "items-center")}>
        <Image
          cachePolicy="disk"
          contentFit="contain"
          alt="image-placeholder"
          source={require("@/assets/images/logo.jpg")}
          style={{ width: 150, height: 150, borderRadius: 9999, borderWidth: 1, borderColor: colorize("#FFFFFF", 1.0) }}
        />
      </View>
    </Animated.View>
  );
});
AnimatedTitle.displayName = "AnimatedTitle";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const DevMsgModal = memo<{ visible: boolean; onClose: () => void }>(({ visible, onClose }) => {
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
  }, [opacity, scale, visible]);
  const backdropStyle = useAnimatedStyle(() => ({ opacity: opacity.value * 0.9 }));
  const modalStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ scale: scale.value }] }));
  if (!visible) return null;
  return (
    <View className={clsx("absolute", "top-0", "left-0", "right-0", "bottom-0", "justify-center", "items-center", "z-[1000]")}>
      <Animated.View style={backdropStyle} className={clsx("absolute", "top-0", "left-0", "right-0", "bottom-0")} />
      <Animated.View style={[modalStyle, { backgroundColor: colorize("#0C0C0C", 1.0), borderColor: colorize("#FFFFFF", 1.0) }]} className={clsx("rounded-3xl", "p-12", "border-4")}>
        <View className={clsx("items-center")}>
          <Text style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 1.0) }} className={clsx("text-3xl", "m-6")}>
            👋🏻 Hello From Dev
          </Text>
          <Text style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 1.0) }} className={clsx("text-2xl", "underline", "mt-8")}>
            We Hate Ads (💀) !!
          </Text>
          <Text style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 1.0) }} className={clsx("text-lg", "p-2", "mb-4")}>
            However It&apos;s The Only Free Way To Provide You AI-Generated Wallpapers Everyday. Hope You Understand 💘
          </Text>
          <TouchableOpacity style={{ backgroundColor: colorize("#FFFFFF", 1.0) }} className={clsx("mt-2", "px-5", "py-2", "rounded-2xl", "overflow-hidden")} onPress={onClose} disabled={countdown > 0}>
            <Text style={{ fontFamily: "Kurale", color: colorize("#0C0C0C", 1.0) }} className={clsx("text-base")}>
              {countdown > 0 ? `Please Read: ${countdown}s` : "I understand!"}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
});
DevMsgModal.displayName = "DevMsgModal";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
export default function BasePage(): JSX.Element {
  const buttonGlow = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const buttonRotate = useSharedValue(0);
  const [showModal, setShowModal] = useState(true);
  const { updateRequired, currentVersion, serverVersion } = useVersionCheck();
  useEffect(() => {
    buttonGlow.value = withRepeat(withSequence(withTiming(1, { duration: 2000 }), withTiming(0, { duration: 2000 })), -1, true);
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
  if (updateRequired) return <UpdateDialog currentVersion={currentVersion} serverVersion={serverVersion} />;
  return (
    <View style={{ backgroundColor: colorize("#0C0C0C", 1.0) }} className={clsx("flex-1")}>
      <DevMsgModal visible={showModal} onClose={() => setShowModal(false)} />
      <View className={clsx("flex-1", "justify-center", "items-center", "relative")}>
        <View className={clsx("flex-row", "h-full", "overflow-hidden", "relative")}>
          {imageSets.map((images, slotIndex) => (
            <ScrollingSlot key={slotIndex} images={images} delay={slotIndex * 400} reverse={false} />
          ))}
          <LinearGradient
            colors={[colorize("#0C0C0C", 1.0), colorize("#0C0C0C", 0.4), colorize("#0C0C0C", 0.1), colorize("#0C0C0C", 0.4), colorize("#0C0C0C", 1.0)]}
            locations={[0, 0.2, 0.4, 0.5, 1]}
            className={clsx("absolute", "top-0", "left-0", "right-0", "bottom-0")}
          />
          <View className={clsx("absolute", "top-0", "left-0", "right-0", "bottom-0", "justify-center", "items-center", "mt-14")}>
            <AnimatedTitle />
            <Animated.View entering={FadeInDown.delay(600).duration(1500).springify()}>
              <View>
                <Text style={{ fontFamily: "Jersey", color: colorize("#FFFFFF", 1.0) }} className={clsx("text-8xl", "text-center")}>
                  picWall
                </Text>
                <Animated.View entering={FadeInDown.delay(600).duration(1500).springify()} className={clsx("self-center")}>
                  <View style={{ backgroundColor: colorize("#0C0C0C", 0.6) }} className={clsx("rounded-full", "px-3", "py-1")}>
                    <Text style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 1.0) }} className={clsx("text-xs", "text-center")}>
                      Crafted with <AntDesign name="heart" size={12} color={colorize("#FF000D", 1.0)} /> in India. All rights reserved
                    </Text>
                  </View>
                </Animated.View>
              </View>
              <Link href="./Home" asChild>
                <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut} className={clsx("mt-40", "rounded-[50px]", "overflow-hidden")}>
                  <Animated.View style={[buttonAnimatedStyle, { shadowColor: colorize("#0C0C0C", 1.0), shadowOffset: { width: 0, height: 4 } }]}>
                    <View style={{ backgroundColor: colorize("#FFFFFF", 1.0) }} className={clsx("py-4", "flex-row", "items-center", "justify-center")}>
                      <FontAwesome5 name="camera-retro" size={32} color={colorize("#0C0C0C", 1.0)} className={clsx("mr-3")} />
                      <Text style={{ fontFamily: "Kurale", color: colorize("#0C0C0C", 1.0) }} className={clsx("text-lg")}>
                        Let&apos;s Explore Wallpapers
                      </Text>
                    </View>
                  </Animated.View>
                </TouchableOpacity>
              </Link>
              <Animated.View entering={FadeIn.delay(1200).duration(1500)} className={clsx("mt-2", "px-5", "items-center")}>
                <Text style={{ fontFamily: "Kurale", color: colorize("#FF000D", 0.8) }} className={clsx("text-sm", "text-center", "mb-1")}>
                  Perfect AI Wallpapers, Every Day!
                </Text>
                <Text style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 0.6) }} className={clsx("text-[10px]", "text-center", "max-w-[300px]")}>
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
}
/* ============================================================================================================================== */
/* ============================================================================================================================== */
