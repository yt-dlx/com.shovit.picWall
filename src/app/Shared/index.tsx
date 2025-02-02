/* ============================================================================================================================== */
// src/app/Shared/index.tsx
/* ============================================================================================================================== */
import { Image } from "expo-image";
import useAd from "@/hooks/useAd";
import colorize from "@/utils/colorize";
import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { View, Text, ActivityIndicator, StatusBar, Animated } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
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
const CardContainer: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <View
    style={[
      {
        borderRadius: wp("5%"),
        backgroundColor: "rgba(17, 17, 17, 0.95)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: hp("0.5%") },
        shadowOpacity: 0.3,
        shadowRadius: wp("2%"),
        elevation: 5,
        padding: wp("6%")
      },
      style
    ]}
  >
    {children}
  </View>
);
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
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
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
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true
    }).start();
  }, [opacity, scaleAnim]);
  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <Image
        contentFit="cover"
        alt="Advertisement background"
        accessibilityLabel="Advertisement background"
        source={require("@/assets/images/admob.jpg")}
        style={{
          position: "absolute",
          width: wp("100%"),
          height: hp("100%"),
          opacity: 0.8
        }}
      />
      <Animated.View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: wp("6%"),
          transform: [{ scale: scaleAnim }]
        }}
      >
        <CardContainer>
          {selectedImage && (
            <View
              style={{
                height: hp("25%"),
                width: wp("40%"),
                overflow: "hidden",
                borderRadius: wp("4%"),
                marginBottom: hp("4%"),
                backgroundColor: colorize("#111111", 1.0),
                borderWidth: wp("0.8%"),
                borderColor: colorize("#F4F4F5", 0.2),
                shadowColor: "#000",
                shadowOffset: { width: 0, height: hp("0.25%") },
                shadowOpacity: 0.25,
                shadowRadius: wp("1%"),
                elevation: 5
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
                <Animated.View
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: [{ translateX: -wp("12%") }, { translateY: -wp("12%") }, { scale: scaleAnim }],
                    opacity: opacity
                  }}
                >
                  <FontAwesome6 name="download" size={wp("7%")} color={colorize("#F4F4F5", 1.0)} />
                </Animated.View>
              )}
            </View>
          )}
          {!imageLoaded && <ActivityIndicator size={wp("10%")} color={colorize("#F4F4F5", 1.0)} style={{ marginVertical: hp("2%") }} />}
          {adError ? (
            <View style={{ alignItems: "center", marginTop: hp("2%") }}>
              <Text
                style={{
                  color: colorize("#FF6B6B", 1.0),
                  fontSize: wp("4%"),
                  fontFamily: "Lobster",
                  textAlign: "center",
                  marginBottom: hp("1%")
                }}
              >
                Reward not received. Please try again.
              </Text>
            </View>
          ) : (
            <View style={{ alignItems: "center", marginTop: hp("2%") }}>
              <Text
                style={{
                  color: colorize("#F4F4F5", 1.0),
                  fontSize: wp("5.5%"),
                  fontFamily: "Lobster",
                  fontWeight: "600",
                  marginBottom: hp("2%")
                }}
              >
                Preparing Your Experience
              </Text>
              <Text
                style={{
                  color: colorize("#F4F4F5", 0.8),
                  fontSize: wp("3.5%"),
                  fontFamily: "Markazi",
                  textAlign: "center",
                  lineHeight: hp("2.5%")
                }}
              >
                After watching the ad, you'll be redirected to your selected content.
              </Text>
              <Text
                style={{
                  color: colorize("#F4F4F5", 0.9),
                  fontSize: wp("4%"),
                  fontFamily: "Markazi",
                  marginTop: hp("3%")
                }}
              >
                Redirecting in {countdown} seconds...
              </Text>
            </View>
          )}
        </CardContainer>
      </Animated.View>
    </View>
  );
}
/* ============================================================================================================================== */
/* ============================================================================================================================== */
