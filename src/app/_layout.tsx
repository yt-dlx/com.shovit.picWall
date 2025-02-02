// src/app/_layout.tsx
/* ============================================================================================================================== */
/* ============================================================================================================================== */
import "../../global.css";
import React from "react";
import { useFonts } from "expo-font";
import colorize from "@/utils/colorize";
import useAppState from "@/utils/store";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, StatusBar, View } from "react-native";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const router = useRouter();
  const [loaded, error] = useFonts({ Markazi: require("@/assets/fonts/Markazi.ttf"), Lobster: require("@/assets/fonts/Lobster.ttf") });
  React.useEffect(() => {
    const initializeApp = async () => {
      if (loaded && !error) {
        await SplashScreen.hideAsync();
        const { lastState, hasRedirected, setRedirected, clearState } = useAppState.getState();
        if (lastState && !hasRedirected) {
          router.push("/Home");
          router.push({ pathname: "/Image", params: { data: JSON.stringify({ data: lastState.data, selectedIndex: lastState.selectedIndex, environment_title: lastState.environment_title || "Default Title" }) } });
          setRedirected(true);
        } else if (hasRedirected) clearState();
      }
    };
    initializeApp();
  }, [loaded, error, router]);
  if (!loaded && !error) return null;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colorize("#111111", 1.0) }}>
      <StatusBar backgroundColor="#111111" barStyle="light-content" />
      <LinearGradient
        colors={[colorize("#111111", 1.0), colorize("#111111", 0.8), colorize("#111111", 0.6), colorize("#111111", 0.4), colorize("#111111", 0.2), "transparent"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 100, zIndex: 50 }}
      />
      <View style={{ flex: 1, backgroundColor: colorize("#111111", 1.0) }} className="capitalize">
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </SafeAreaView>
  );
}
/* ============================================================================================================================== */
/* ============================================================================================================================== */
