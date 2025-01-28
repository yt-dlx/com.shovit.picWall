/* ============================================================================================================================== */
// src/app/Shared/index.tsx
/* ============================================================================================================================== */
import { Image } from "expo-image";
import useAd from "@/hooks/useAd";
import colorize from "@/utils/colorize";
import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { View, Text, ActivityIndicator, Dimensions, StatusBar, Animated, TouchableOpacity } from "react-native";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const { width, height } = Dimensions.get("screen");
interface ImageData {
  primary: string;
  previewLink: string;
  original_file_name: string;
}
interface ParsedData {
  data: ImageData[];
  selectedIndex: number;
  environment_title: string;
}
/* ============================================================================================================================== */
/* ============================================================================================================================== */
export default function SharedPage(): JSX.Element {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [adError, setAdError] = useState(false);
  const [adEarned, setAdEarned] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const opacity = useRef(new Animated.Value(0)).current;
  let parsedData: ParsedData | null = null;
  if (params.data) {
    const dataParam = Array.isArray(params.data) ? params.data[0] : params.data;
    parsedData = JSON.parse(dataParam) as ParsedData;
  }
  const selectedImage = parsedData?.data[parsedData.selectedIndex]?.previewLink.replace("min", "max") || null;
  const { showAd, adLoaded } = useAd({
    onRewardEarned: () => setAdEarned(true),
    onAdClosed: () => {
      if (!adEarned) setAdError(true);
    }
  });
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          if (!adLoaded && !adEarned) router.replace({ pathname: "/Image", params });
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [adLoaded, adEarned, router, params]);
  useEffect(() => {
    if (adLoaded) showAd();
  }, [adLoaded, showAd]);
  useEffect(() => {
    if (adEarned && imageLoaded) router.replace({ pathname: "/Image", params });
  }, [adEarned, imageLoaded, router, params]);
  useEffect(() => {
    Animated.loop(
      Animated.sequence([Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: true }), Animated.timing(opacity, { toValue: 0, duration: 1000, useNativeDriver: true })])
    ).start();
  }, [opacity]);
  const handleTryAgain = () => {
    setAdError(false);
    if (adLoaded) showAd();
  };
  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <Image
        accessibilityLabel="Advertisement background"
        alt="Advertisement background"
        source={require("@/assets/images/admob.jpg")}
        style={{ position: "absolute", width, height, top: 0, left: 0 }}
        contentFit="cover"
      />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <View
          style={{
            borderRadius: 20,
            position: "relative",
            alignItems: "center",
            paddingTop: height / 8,
            paddingBottom: height / 8,
            paddingHorizontal: width / 4,
            backgroundColor: colorize("#111111", 0.9)
          }}
        >
          {selectedImage && (
            <View
              style={{
                width: width / 3,
                borderWidth: 2,
                borderRadius: 8,
                height: height / 4,
                marginBottom: 24,
                overflow: "hidden",
                position: "relative",
                borderColor: colorize("#F4F4F5", 1.0),
                backgroundColor: colorize("#111111", 1.0)
              }}
            >
              <Image
                contentFit="cover"
                source={{ uri: selectedImage }}
                onLoadEnd={() => setImageLoaded(true)}
                style={{ width: "100%", height: "100%" }}
                accessibilityLabel="Selected wallpaper preview"
                alt={`SelectedWallpaperPreview${selectedImage}`}
              />
              {!imageLoaded && (
                <Animated.View style={{ position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -12 }, { translateY: -12 }], opacity: opacity }}>
                  <FontAwesome6 name="download" size={24} color={colorize("#F4F4F5", 1.0)} />
                </Animated.View>
              )}
            </View>
          )}
          {!imageLoaded && <ActivityIndicator size="large" color={colorize("#F4F4F5", 1.0)} accessibilityLabel="Loading image" />}
          {adError && (
            <View style={{ marginTop: 16, alignItems: "center" }}>
              <Text style={{ color: colorize("#FF0000", 1.0), textAlign: "center", marginBottom: 8, fontFamily: "Merriweather" }}> Reward not received. Please try again. </Text>
              {/* <TouchableOpacity
onPress={handleTryAgain}
style={{ backgroundColor: colorize("#F4F4F5", 1.0), paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, minWidth: 120, minHeight: 44 }}
accessibilityLabel="Try again"
>
<Text style={{ color: colorize("#111111", 1.0), fontFamily: "Merriweather", textAlign: "center" }}>Try Again</Text>
</TouchableOpacity> */}
            </View>
          )}
          {!adError && (
            <View style={{ marginTop: 24, alignItems: "center" }}>
              <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: 18, textAlign: "center", marginBottom: 16, fontFamily: "Merriweather" }}> Preparing Your Experience </Text>
              <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: 14, textAlign: "center", fontFamily: "Merriweather" }}>
                After watching the ad, you&apos;ll be redirected to your selected content.
              </Text>
              <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: 18, textAlign: "center", marginTop: 16, fontFamily: "Merriweather" }}>Redirecting in {countdown} seconds...</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
/* ============================================================================================================================== */
/* ============================================================================================================================== */
