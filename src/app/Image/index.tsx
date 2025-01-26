/* ============================================================================================================================== */
// src/app/Image/index.tsx
/* ============================================================================================================================== */
import { Image } from "expo-image";
import colorize from "@/utils/colorize";
import useAppState from "@/utils/store";
import Footer from "@/components/Footer";
import * as FileSystem from "expo-file-system";
import { ImageMetadata } from "@/types/database";
import { useLocalSearchParams } from "expo-router";
import * as MediaLibrary from "expo-media-library";
import { LinearGradient } from "expo-linear-gradient";
import { setWallpaper, TYPE_SCREEN } from "rn-wallpapers";
import { createPreviewLink, createDownloadLink } from "@/utils/linker";
import React, { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import { FontAwesome5, MaterialIcons, Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { View, Text, Dimensions, StatusBar, ActivityIndicator, TouchableOpacity, Alert, Modal, Animated, Easing, ScrollView } from "react-native";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const { width: screenWidth } = Dimensions.get("window");
interface DownloadButtonProps {
  onDownload?: (event: unknown) => void;
  colors: { primary: string; secondary: string; tertiary: string };
}
interface OtherImagesProps {
  tertiaryColor: string;
  primaryColor: string;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  otherImages: { img: ImageMetadata; idx: number }[];
}
interface WallModalProps {
  visible: boolean;
  onCancel: () => void;
  primaryColor: string;
  onComplete: () => void;
  wallType: "HOME" | "LOCK" | "BOTH";
}
interface FullScreenViewProps {
  isFullScreen: boolean;
  selectedIndex: number;
  data: ImageMetadata[];
  environment_title: string;
  selectedImage: ImageMetadata;
  setIsFullScreen: (isFullScreen: boolean) => void;
}
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const SuccessModal: React.FC<{ visible: boolean; message: string; onClose: () => void }> = memo(({ visible, message, onClose }) => {
  const [modalAnim] = useState(new Animated.Value(0));
  useEffect(() => {
    if (visible) Animated.timing(modalAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    else Animated.timing(modalAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  }, [visible, modalAnim]);
  const backdropStyle = { opacity: modalAnim };
  const scale = modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] });
  const modalStyle = { opacity: modalAnim, transform: [{ scale }] };
  if (!visible) return null;
  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
      <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colorize("#171819", 0.5) }, backdropStyle]} />
      <Animated.View style={[{ width: "80%", borderRadius: 24, padding: 20, borderWidth: 4, backgroundColor: colorize("#171819", 1.0), borderColor: colorize("#25BE8B", 1.0) }, modalStyle]}>
        <View style={{ alignItems: "center" }}>
          <Ionicons name="checkmark-done-circle" size={50} color={colorize("#25BE8B", 1.0)} />
          <Text style={{ marginTop: 10, fontSize: 48, fontFamily: "Kurale", color: colorize("#25BE8B", 1.0) }}> Success </Text>
          <Text style={{ marginVertical: 10, textAlign: "center", fontSize: 18, fontFamily: "Kurale", color: colorize("#25BE8B", 1.0) }}> {message} </Text>
          <TouchableOpacity
            style={{ marginTop: 10, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, overflow: "hidden", backgroundColor: colorize("#25BE8B", 0.4), minWidth: 120, minHeight: 44 }}
            onPress={onClose}
            accessibilityLabel="Close success modal"
          >
            <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: 18, fontFamily: "Kurale" }}> OK </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
});
SuccessModal.displayName = "SuccessModal";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const ErrorModal: React.FC<{ visible: boolean; message: string; onClose: () => void }> = memo(({ visible, message, onClose }) => {
  const [modalAnim] = useState(new Animated.Value(0));
  useEffect(() => {
    if (visible) Animated.timing(modalAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    else Animated.timing(modalAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  }, [visible, modalAnim]);
  const backdropStyle = { opacity: modalAnim };
  const scale = modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] });
  const modalStyle = { opacity: modalAnim, transform: [{ scale }] };
  if (!visible) return null;
  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
      <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colorize("#171819", 0.5) }, backdropStyle]} />
      <Animated.View style={[{ width: "80%", borderRadius: 24, padding: 20, borderWidth: 4, backgroundColor: colorize("#171819", 1.0), borderColor: colorize("#F4F4F5", 1.0) }, modalStyle]}>
        <View style={{ alignItems: "center" }}>
          <MaterialIcons name="error" size={50} color={colorize("#F4F4F5", 1.0)} />
          <Text style={{ marginTop: 10, fontSize: 48, fontFamily: "Kurale", color: colorize("#F4F4F5", 1.0) }}> Error </Text>
          <Text style={{ marginVertical: 10, textAlign: "center", fontSize: 18, fontFamily: "Kurale", color: colorize("#F4F4F5", 1.0) }}> {message} </Text>
          <TouchableOpacity
            style={{ marginTop: 10, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, overflow: "hidden", backgroundColor: colorize("#F4F4F5", 0.4), minWidth: 120, minHeight: 44 }}
            onPress={onClose}
            accessibilityLabel="Close error modal"
          >
            <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: 18, fontFamily: "Kurale" }}> OK </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
});
ErrorModal.displayName = "ErrorModal";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const DownloadingModal: React.FC<{ visible: boolean; percentage: number; downloadRate: number; eta: number; primaryColor: string }> = memo(
  ({ visible, percentage, downloadRate, eta, primaryColor }) => {
    const [progressAnim] = useState(new Animated.Value(percentage / 100));
    useEffect(() => {
      Animated.timing(progressAnim, { toValue: percentage / 100, duration: 500, easing: Easing.linear, useNativeDriver: false }).start();
    }, [percentage, progressAnim]);
    const widthInterpolated = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
    const formatBytes = useCallback((bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }, []);
    const formatTime = useCallback((seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}m ${s}s`;
    }, []);
    if (!visible) return null;
    return (
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colorize("#171819", 0.5) }} />
        <View style={{ width: "80%", borderRadius: 24, padding: 20, borderWidth: 4, backgroundColor: colorize("#171819", 1.0), borderColor: colorize(primaryColor, 1.0) }}>
          <View style={{ alignItems: "center" }}>
            <MaterialIcons name="cloud-download" size={50} color={colorize(primaryColor, 1.0)} />
            <Text style={{ marginTop: 10, fontSize: 48, fontFamily: "Kurale", color: colorize(primaryColor, 1.0) }}> Downloading... </Text>
            <Text style={{ marginTop: 16, fontSize: 30, fontFamily: "Kurale", color: colorize(primaryColor, 1.0) }}> {percentage.toFixed(1)}% </Text>
            <View style={{ width: "100%", height: 12, borderRadius: 9999, overflow: "hidden", marginTop: 16, backgroundColor: colorize("#242424", 1.0) }}>
              <Animated.View style={{ width: widthInterpolated, backgroundColor: colorize(primaryColor, 1.0), height: "100%" }} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 16 }}>
              <Text style={{ fontSize: 18, fontFamily: "Kurale", color: colorize(primaryColor, 1.0) }}> {formatBytes(downloadRate)}/s </Text>
              <Text style={{ fontSize: 18, fontFamily: "Kurale", color: colorize(primaryColor, 1.0) }}> ETA: {formatTime(eta)} </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
);
DownloadingModal.displayName = "DownloadingModal";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const PreviewImage: React.FC<{ selectedImage: ImageMetadata; screenWidth: number; onViewFullScreen: () => void }> = memo(({ selectedImage, screenWidth, onViewFullScreen }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const aspectRatio = selectedImage.width / selectedImage.height;
  const imageHeight = useMemo(() => (screenWidth / aspectRatio) * 0.7, [screenWidth, aspectRatio]);
  const scaleValue = useRef(new Animated.Value(1.1)).current;
  useEffect(() => {
    const animation = Animated.sequence([
      Animated.timing(scaleValue, { toValue: 1.4, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1.1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
    ]);
    Animated.loop(animation).start();
  }, [scaleValue]);
  const lowResLink = useMemo(() => createPreviewLink(selectedImage), [selectedImage]);
  const highResLink = useMemo(() => lowResLink.replace("min", "max"), [lowResLink]);
  return (
    <View style={{ position: "relative" }}>
      {imageLoading && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: colorize("#171819", 1.0), zIndex: 40 }}>
          <ActivityIndicator size="large" color={colorize(selectedImage.primary, 1.0)} accessibilityLabel="Loading image" />
          <Text style={{ marginTop: 10, fontFamily: "Kurale", color: colorize(selectedImage.primary, 1.0) }}> Loading HD Image Preview... </Text>
        </View>
      )}
      <Animated.View style={[{ width: "100%", height: imageHeight, overflow: "hidden", borderTopLeftRadius: 20, borderTopRightRadius: 20, transform: [{ scale: scaleValue }] }]}>
        <Image
          contentFit="cover"
          cachePolicy="disk"
          alt="Wallpaper preview"
          source={{ uri: highResLink }}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          style={{ width: "100%", height: "100%", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
          onError={() => {
            setImageLoading(false);
            Alert.alert("Error", "Failed to load image. Please try again.");
          }}
        />
      </Animated.View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onViewFullScreen}
        style={{
          position: "absolute",
          bottom: 8,
          left: 16,
          right: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colorize(selectedImage.secondary, 0.9),
          borderColor: colorize(selectedImage.primary, 1.0),
          borderRadius: 20,
          borderWidth: 2,
          zIndex: 50,
          minHeight: 44
        }}
        accessibilityLabel="Set as wallpaper"
      >
        <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: 18, fontFamily: "Kurale" }}> Set as Wallpaper </Text>
        <FontAwesome6 name="mobile-button" size={15} color={colorize("#F4F4F5", 1.0)} style={{ marginHorizontal: 4 }} />
        <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: 18, fontFamily: "Kurale" }}> (Full-Screen View) </Text>
      </TouchableOpacity>
    </View>
  );
});
PreviewImage.displayName = "PreviewImage";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const DownloadButton: React.FC<DownloadButtonProps> = memo(({ onDownload, colors }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, { toValue: 1.08, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scaleValue, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [scaleValue]);
  return (
    <TouchableOpacity
      onPress={onDownload}
      activeOpacity={0.8}
      style={{ marginTop: 8, borderRadius: 16, overflow: "hidden", backgroundColor: colorize(colors.primary, 0.4), minHeight: 44 }}
      accessibilityLabel="Download wallpaper"
    >
      <Animated.View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 12, transform: [{ scale: scaleValue }] }}>
        <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: 18, fontFamily: "Kurale" }}> Download Wallpaper </Text>
        <FontAwesome5 name="download" size={15} color={colorize("#F4F4F5", 1.0)} style={{ marginHorizontal: 8 }} />
        <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: 18, fontFamily: "Kurale" }}> (Highest Quality) </Text>
      </Animated.View>
    </TouchableOpacity>
  );
});
DownloadButton.displayName = "DownloadButton";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const OtherImages: React.FC<OtherImagesProps> = memo(({ otherImages, setCurrentIndex, primaryColor, tertiaryColor, currentIndex }) => {
  const uniqueFileNames = useMemo(() => new Set<string>(), []);
  const uniqueImages = useMemo(
    () =>
      otherImages.filter((item) => {
        if (!item || !item.img) return false;
        const { img } = item;
        if (uniqueFileNames.has(img.original_file_name) || img.original_file_name === otherImages[currentIndex]?.img?.original_file_name) return false;
        uniqueFileNames.add(img.original_file_name);
        return true;
      }),
    [otherImages, currentIndex, uniqueFileNames]
  );
  return (
    <View style={{ padding: 4, marginVertical: 8, borderRadius: 16, backgroundColor: colorize(primaryColor, 0.2) }}>
      <View style={{ padding: 4, borderRadius: 16, backgroundColor: colorize(tertiaryColor, 0.2) }}>
        <Text style={{ marginLeft: 8, fontSize: 20, fontFamily: "Kurale", color: colorize("#F4F4F5", 1.0) }}> Other Wallpapers: </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 4 }}>
          {uniqueImages.map(({ img, idx }) => {
            if (!img) return null;
            const lowResLink = createPreviewLink(img);
            return (
              <TouchableOpacity
                key={idx}
                style={{ position: "relative", borderRadius: 10, overflow: "hidden", marginHorizontal: 2, flex: 1, aspectRatio: 9 / 16, borderWidth: 1, borderColor: colorize(primaryColor, 1.0) }}
                onPress={() => setCurrentIndex(idx)}
                accessibilityLabel={`Select wallpaper ${img.original_file_name}`}
              >
                <Image alt="Wallpaper thumbnail" source={{ uri: lowResLink }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                <View style={{ position: "absolute", top: 4, left: 4, backgroundColor: colorize("#000000", 0.5), paddingHorizontal: 4, paddingVertical: 4, borderRadius: 8 }}>
                  <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: 12, fontFamily: "Kurale" }}> {img.original_file_name.replace(".jpg", "")} </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
});
OtherImages.displayName = "OtherImages";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const WallModal: React.FC<WallModalProps> = memo(({ visible, onComplete, onCancel, wallType, primaryColor }) => {
  const [modalAnim] = useState(new Animated.Value(0));
  const countdownRef = useRef<NodeJS.Timeout>();
  const [countdown, setCountdown] = useState(3);
  useEffect(() => {
    if (visible) {
      setCountdown(3);
      Animated.timing(modalAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      Animated.timing(modalAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      clearInterval(countdownRef.current);
    }
    return () => {
      clearInterval(countdownRef.current);
    };
  }, [visible, modalAnim, onComplete]);
  const backdropStyle = { opacity: modalAnim };
  const scale = modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] });
  const modalStyle = { opacity: modalAnim, transform: [{ scale }] };
  if (!visible) return null;
  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
      <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colorize("#171819", 0.5) }, backdropStyle]} />
      <Animated.View style={[{ width: "80%", borderRadius: 24, padding: 20, borderWidth: 4, backgroundColor: colorize("#171819", 1.0), borderColor: colorize(primaryColor, 1.0) }, modalStyle]}>
        <View style={{ alignItems: "center" }}>
          <MaterialIcons name="warning" size={50} color={colorize(primaryColor, 1.0)} />
          <Text style={{ marginTop: 10, fontSize: 48, fontFamily: "Kurale", color: colorize(primaryColor, 1.0) }}>
            {wallType === "BOTH" ? "Setting Both Screens" : wallType === "HOME" ? "Setting HomeScreen" : "Setting LockScreen"}
          </Text>
          <Text style={{ marginVertical: 10, textAlign: "center", fontSize: 18, fontFamily: "Kurale", color: colorize(primaryColor, 1.0) }}>
            Due to Android&apos;s Material Style, the system UI will restart after setting the wallpaper. This is normal behavior.
          </Text>
          <Text style={{ marginVertical: 16, fontSize: 48, fontFamily: "Kurale", color: colorize(primaryColor, 1.0) }}> {countdown} </Text>
          <TouchableOpacity
            style={{ marginTop: 10, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, overflow: "hidden", backgroundColor: colorize(primaryColor, 0.4), minWidth: 120, minHeight: 44 }}
            onPress={() => {
              clearInterval(countdownRef.current);
              onCancel();
            }}
            accessibilityLabel="Cancel wallpaper setting"
          >
            <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: 18, fontFamily: "Kurale" }}> Cancel </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
});
WallModal.displayName = "WallModal";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const FullScreenView: React.FC<FullScreenViewProps> = memo(({ isFullScreen, setIsFullScreen, selectedImage, selectedIndex, data, environment_title }) => {
  const [showWallModal, setShowWallModal] = useState(false);
  const [wallType, setWallType] = useState<"HOME" | "LOCK" | "BOTH">("HOME");
  const saveCurrentState = useCallback(async () => {
    const { setLastState } = useAppState.getState();
    const stateToSave = { selectedIndex, data, environment_title };
    setLastState(stateToSave);
  }, [selectedIndex, data, environment_title]);
  const handleWallpaperSet = useCallback(async () => {
    await saveCurrentState();
    const lowResLink = createPreviewLink(selectedImage);
    const highResLink = lowResLink.replace("min", "max");
    await setWallpaper({ uri: highResLink }, TYPE_SCREEN[wallType]);
    setShowWallModal(false);
  }, [saveCurrentState, selectedImage, wallType]);
  return (
    <Modal visible={isFullScreen} transparent={false} onRequestClose={() => setIsFullScreen(false)} presentationStyle="fullScreen" statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: colorize("#171819", 1.0) }}>
        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }} showsHorizontalScrollIndicator={false}>
          <Image
            contentFit="fill"
            alt="Wallpaper full view"
            source={{ uri: createPreviewLink(selectedImage).replace("min", "max") }}
            style={{ height: "100%", width: (Dimensions.get("window").height * 9) / 16 }}
          />
        </ScrollView>
        <View style={{ position: "absolute", bottom: 8, left: 10, right: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <LinearGradient
            end={[1, 0]}
            start={[0, 0]}
            style={{ flex: 1, height: 40, borderTopLeftRadius: 5, borderBottomLeftRadius: 20, marginHorizontal: 1 }}
            colors={[colorize(selectedImage.primary, 1.0), colorize(selectedImage.primary, 0.9), colorize(selectedImage.primary, 0.8)]}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", height: "100%" }}
              onPress={() => {
                setWallType("LOCK");
                setShowWallModal(true);
              }}
              accessibilityLabel="Set lockscreen wallpaper"
            >
              <Ionicons name="image" size={20} color={colorize("#F4F4F5", 1.0)} style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 12, color: "#F4F4F5", fontFamily: "Kurale" }}>Set LockScreen</Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            end={[1, 0]}
            start={[0, 0]}
            style={{ flex: 1, height: 40, marginHorizontal: 1 }}
            colors={[colorize(selectedImage.primary, 1.0), colorize(selectedImage.primary, 0.9), colorize(selectedImage.primary, 0.8)]}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", height: "100%" }}
              onPress={() => {
                setWallType("HOME");
                setShowWallModal(true);
              }}
              accessibilityLabel="Set homescreen wallpaper"
            >
              <Ionicons name="image" size={20} color={colorize("#F4F4F5", 1.0)} style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 12, color: "#F4F4F5", fontFamily: "Kurale" }}>Set HomeScreen</Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            end={[1, 0]}
            start={[0, 0]}
            style={{ flex: 1, height: 40, borderTopRightRadius: 5, borderBottomRightRadius: 20, marginHorizontal: 1 }}
            colors={[colorize(selectedImage.primary, 1.0), colorize(selectedImage.primary, 0.9), colorize(selectedImage.primary, 0.8)]}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", height: "100%" }}
              onPress={() => {
                setWallType("BOTH");
                setShowWallModal(true);
              }}
              accessibilityLabel="Set both screens wallpaper"
            >
              <Ionicons name="image" size={20} color={colorize("#F4F4F5", 1.0)} style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 12, color: "#F4F4F5", fontFamily: "Kurale" }}>Set BothScreens</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <WallModal visible={showWallModal} onComplete={handleWallpaperSet} onCancel={() => setShowWallModal(false)} wallType={wallType} primaryColor={selectedImage.primary} />
      </View>
    </Modal>
  );
});
FullScreenView.displayName = "FullScreenView";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
export default function ImagePage(): JSX.Element {
  const params = useLocalSearchParams();
  const [eta, setEta] = useState<number>(0);
  const rawDataString = params.data as string;
  const Sanitized = useMemo(() => JSON.parse(rawDataString), [rawDataString]);
  const downloadStartTime = useRef<number>(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [percentage, setPercentage] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadRate, setDownloadRate] = useState<number>(0);
  const [alertIcon, setAlertIcon] = useState<"error" | "checkmark-done-circle">("checkmark-done-circle");
  const [currentIndex, setCurrentIndex] = useState(() => {
    const parsedIndex = parseInt(Sanitized.selectedIndex);
    return !isNaN(parsedIndex) ? parsedIndex : 0;
  });
  const selectedImage = useMemo(() => Sanitized.data[currentIndex] as ImageMetadata, [Sanitized.data, currentIndex]);
  const environmentTitle = useMemo(() => Sanitized.environment_title as string, [Sanitized.environment_title]);
  const showAlert = useCallback((title: string, message: string, iconName: "error" | "checkmark-done-circle") => {
    setAlertMessage(message);
    setAlertIcon(iconName);
    setAlertVisible(true);
  }, []);
  const hideAlert = useCallback(() => setAlertVisible(false), []);
  const downloadAndSaveImage = useCallback(async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        showAlert("Permission Required", "Please grant media library permissions to save the image.", "error");
        return;
      }
      setIsDownloading(true);
      setPercentage(0);
      setDownloadRate(0);
      setEta(0);
      downloadStartTime.current = Date.now();
      const fileUri = FileSystem.documentDirectory + selectedImage.original_file_name;
      const highResLink = createDownloadLink(selectedImage).replace("min", "max");
      const downloadResumable = FileSystem.createDownloadResumable(highResLink, fileUri, {}, (downloadProgressEvent) => {
        const progress = downloadProgressEvent.totalBytesWritten / downloadProgressEvent.totalBytesExpectedToWrite;
        setPercentage(progress * 100);
        const elapsedTime = (Date.now() - downloadStartTime.current) / 1000;
        if (elapsedTime > 0) {
          const rate = downloadProgressEvent.totalBytesWritten / elapsedTime;
          setDownloadRate(rate);
          const remainingBytes = downloadProgressEvent.totalBytesExpectedToWrite - downloadProgressEvent.totalBytesWritten;
          const estimatedTime = remainingBytes / rate;
          setEta(estimatedTime);
        }
      });
      const result = await downloadResumable.downloadAsync();
      if (!result || !result.uri) {
        showAlert("Download Failed", "Unable to download the image.", "error");
        setIsDownloading(false);
        return;
      }
      const asset = await MediaLibrary.createAssetAsync(result.uri);
      const album = await MediaLibrary.getAlbumAsync("Download");
      if (!album) await MediaLibrary.createAlbumAsync("Download", asset, false);
      else await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      setIsDownloading(false);
      showAlert("Success", "The image has been saved to your gallery.", "checkmark-done-circle");
    } catch (error) {
      setIsDownloading(false);
      showAlert("Error", "An error occurred while downloading or saving the image." + error, "error");
    }
  }, [selectedImage, showAlert]);
  const allImages = useMemo(() => Sanitized.data as ImageMetadata[], [Sanitized.data]);
  const allImagesWithIndex = useMemo(() => allImages.map((img, idx) => ({ img, idx })), [allImages]);
  const otherImages = useMemo(() => allImagesWithIndex.filter((item) => item.idx !== currentIndex), [allImagesWithIndex, currentIndex]);
  return (
    <View style={{ flex: 1, backgroundColor: colorize("#171819", 1.0) }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView style={{ flex: 1 }}>
        <PreviewImage selectedImage={selectedImage} screenWidth={screenWidth} onViewFullScreen={() => setIsFullScreen(true)} />
        <View style={{ padding: 16, borderWidth: 2, borderRadius: 24, borderColor: colorize(selectedImage.primary, 1.0), backgroundColor: colorize("#171819", 1.0) }}>
          <Text style={{ marginBottom: 8, fontSize: 30, textAlign: "center", fontFamily: "Kurale", color: colorize(selectedImage.primary, 1.0) }}>
            {selectedImage.original_file_name.replace(".jpg", "")}
          </Text>
          {[
            { label: "Mode", value: selectedImage.mode },
            { label: "FileSize", value: `${selectedImage.megabytes} mb` },
            { label: "Dimensions", value: `${selectedImage.width} x ${selectedImage.height}` }
          ].map((item, index) => (
            <View key={index} style={{ flexDirection: "row", alignItems: "center", marginVertical: 8 }}>
              <FontAwesome5 name={index === 0 ? "adjust" : index === 1 ? "file-alt" : "ruler-combined"} size={16} color={colorize(selectedImage.primary, 1.0)} style={{ marginLeft: 4 }} />
              <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 4 }}>
                <Text style={{ fontFamily: "Kurale", color: colorize(selectedImage.primary, 1.0) }}> {item.label}: </Text>
                <Text style={{ marginLeft: 8, fontFamily: "Kurale", color: colorize(selectedImage.primary, 1.0) }}> {item.value} </Text>
              </View>
            </View>
          ))}
          <DownloadButton onDownload={downloadAndSaveImage} colors={{ primary: selectedImage.primary, secondary: selectedImage.primary, tertiary: selectedImage.primary }} />
          <OtherImages otherImages={otherImages} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} primaryColor={selectedImage.primary} tertiaryColor={selectedImage.tertiary} />
        </View>
        <Footer />
      </ScrollView>
      <FullScreenView isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} selectedImage={selectedImage} selectedIndex={currentIndex} data={allImages} environment_title={environmentTitle} />
      <DownloadingModal visible={isDownloading} percentage={percentage} downloadRate={downloadRate} eta={eta} primaryColor={selectedImage.primary} />
      <SuccessModal visible={alertVisible && alertIcon === "checkmark-done-circle"} message={alertMessage} onClose={hideAlert} />
      <ErrorModal visible={alertVisible && alertIcon === "error"} message={alertMessage} onClose={hideAlert} />
    </View>
  );
}
/* ============================================================================================================================== */
/* ============================================================================================================================== */
