// src/app/_layout.tsx
import "@/global.css";
import React from "react";
import { useFonts } from "expo-font";
import useAppState from "@/utils/store";
import Colorizer from "@/utils/Colorizer";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, StatusBar, View } from "react-native";
/* ============================================================================================ */
/* ============================================================================================ */
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const router = useRouter();
  const [loaded, error] = useFonts({
    PlayfairDisplay_Black: require("@/assets/fonts/PlayfairDisplay-Black.ttf"),
    PlayfairDisplay_BlackItalic: require("@/assets/fonts/PlayfairDisplay-BlackItalic.ttf"),
    PlayfairDisplay_Bold: require("@/assets/fonts/PlayfairDisplay-Bold.ttf"),
    PlayfairDisplay_BoldItalic: require("@/assets/fonts/PlayfairDisplay-BoldItalic.ttf"),
    PlayfairDisplay_ExtraBold: require("@/assets/fonts/PlayfairDisplay-ExtraBold.ttf"),
    PlayfairDisplay_ExtraBoldItalic: require("@/assets/fonts/PlayfairDisplay-ExtraBoldItalic.ttf"),
    PlayfairDisplay_Italic: require("@/assets/fonts/PlayfairDisplay-Italic.ttf"),
    PlayfairDisplay_Medium: require("@/assets/fonts/PlayfairDisplay-Medium.ttf"),
    PlayfairDisplay_MediumItalic: require("@/assets/fonts/PlayfairDisplay-MediumItalic.ttf"),
    PlayfairDisplay_Regular: require("@/assets/fonts/PlayfairDisplay-Regular.ttf"),
    PlayfairDisplay_SemiBold: require("@/assets/fonts/PlayfairDisplay-SemiBold.ttf"),
    PlayfairDisplay_SemiBoldItalic: require("@/assets/fonts/PlayfairDisplay-SemiBoldItalic.ttf")
  });
  React.useEffect(() => {
    const initializeApp = async () => {
      if (loaded && !error) {
        await SplashScreen.hideAsync();
        const { lastState, hasRedirected, setRedirected, clearState } = useAppState.getState();
        if (lastState && !hasRedirected) {
          router.push("/Home");
          router.push({
            pathname: "/Image",
            params: { data: JSON.stringify({ data: lastState.data, selectedIndex: lastState.selectedIndex, environment_title: lastState.environment_title || "Default Title" }) }
          });
          setRedirected(true);
        } else if (hasRedirected) clearState();
      }
    };
    initializeApp();
  }, [loaded, error, router]);
  if (!loaded && !error) return null;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colorizer("#0C0C0C", 1.0) }}>
      <StatusBar backgroundColor="#0C0C0C" barStyle="light-content" />
      <LinearGradient
        colors={[Colorizer("#0C0C0C", 1.0), Colorizer("#0C0C0C", 0.8), Colorizer("#0C0C0C", 0.6), Colorizer("#0C0C0C", 0.4), Colorizer("#0C0C0C", 0.2), "transparent"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 100, zIndex: 50 }}
      />
      <View style={{ flex: 1, backgroundColor: Colorizer("#0C0C0C", 1.0) }} className="capitalize">
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </SafeAreaView>
  );
}
