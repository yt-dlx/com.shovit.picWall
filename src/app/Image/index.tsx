// src/app/Image/index.tsx
/* ============================================================================================================================== */
/* ============================================================================================================================== */
import { Image } from "expo-image";
import colorize from "@/utils/colorize";
import useAppState from "@/utils/store";
import Footer from "@/components/Footer";
import * as FileSystem from "expo-file-system";
import { ImageMetadata } from "@/types/database";
import * as MediaLibrary from "expo-media-library";
import { BlurView } from "@react-native-community/blur";
import { useVersionCheck } from "@/hooks/useVersionCheck";
import { setWallpaper, TYPE_SCREEN } from "rn-wallpapers";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createPreviewLink, createDownloadLink } from "@/utils/linker";
import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { View, Text, Dimensions, StatusBar, ActivityIndicator, TouchableOpacity, Alert, Modal, Animated, Easing, ScrollView, StyleSheet, Platform } from "react-native";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
interface DownloadButtonProps {
  onDownload?: (event: unknown) => void;
}
interface OtherImagesProps {
  selectedFileName: string;
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
const { width: screenWidth } = Dimensions.get("window");
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const SuccessModal: React.FC<{ visible: boolean; message: string; onClose: () => void }> = memo(({ visible, message, onClose }) => {
  const [modalAnim] = useState(new Animated.Value(0));
  useEffect(() => {
    if (visible) Animated.timing(modalAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    else Animated.timing(modalAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  }, [visible, modalAnim]);
  if (!visible) return null;
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <BlurView blurType="dark" blurAmount={60} style={StyleSheet.absoluteFill} overlayColor={Platform.OS === "android" ? colorize("#171717", 0.0) : colorize("#171717", 0.0)} />
        <Animated.View style={[{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colorize("#171717", 0.8) }, { opacity: modalAnim }]}>
          <Image source={require("@/assets/images/logo.jpg")} style={{ width: wp(40), height: wp(40), borderWidth: wp(0.5), borderRadius: wp(50), borderColor: colorize("#25BE8B", 1.0) }} />
          <Text style={{ marginTop: hp(4), fontSize: wp(12), fontFamily: "Lobster", color: colorize("#25BE8B", 1.0), textDecorationLine: "underline" }}>Success</Text>
          <Text style={{ marginTop: hp(2), textAlign: "center", fontSize: hp(2.5), fontFamily: "Markazi", color: colorize("#F4F4F5", 1.0), paddingHorizontal: wp(5) }}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={{ marginTop: hp(4), paddingHorizontal: wp(8), paddingVertical: hp(2), borderRadius: wp(4), backgroundColor: colorize("#25BE8B", 0.4) }}>
            <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: hp(2.5), fontFamily: "Lobster" }}>OK</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
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
  const scale = modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] });
  const modalStyle = { opacity: modalAnim, transform: [{ scale }] };
  if (!visible) return null;
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <BlurView blurType="dark" blurAmount={60} style={StyleSheet.absoluteFill} overlayColor={Platform.OS === "android" ? colorize("#171717", 0.0) : colorize("#171717", 0.0)} />
        <Animated.View style={[{ flex: 1, width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: colorize("#171717", 0.8) }, modalStyle]}>
          <View style={{ alignItems: "center" }}>
            <Image source={require("@/assets/images/logo.jpg")} style={{ width: wp(40), height: wp(40), borderWidth: wp(0.5), borderRadius: wp(50), borderColor: colorize("#AF3C2E", 1.0) }} />
            <Text style={{ marginTop: hp(4), fontSize: wp(12), fontFamily: "Lobster", color: colorize("#AF3C2E", 1.0), textDecorationLine: "underline" }}> Oops Error </Text>
            <Text style={{ marginTop: hp(2), textAlign: "center", fontSize: hp(2.5), fontFamily: "Markazi", color: colorize("#F4F4F5", 1.0), paddingHorizontal: wp(5) }}> {message} </Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close error modal" style={{ marginTop: hp(4), paddingHorizontal: wp(8), paddingVertical: hp(2), borderRadius: wp(4), backgroundColor: colorize("#AF3C2E", 1.0) }}>
              <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: hp(2.5), fontFamily: "Lobster" }}> Okay Understood </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
});
ErrorModal.displayName = "ErrorModal";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const DownloadingModal: React.FC<{ visible: boolean; percentage: number; downloadRate: number; eta: number; primaryColor: string }> = memo(({ visible, percentage, downloadRate, eta, primaryColor }) => {
  const [progressAnim] = useState(new Animated.Value(percentage / 100));
  useEffect(() => {
    Animated.timing(progressAnim, { toValue: percentage / 100, duration: 500, easing: Easing.linear, useNativeDriver: false }).start();
  }, [percentage, progressAnim]);
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
    <Modal visible transparent animationType="slide">
      <View style={{ flex: 1 }}>
        <BlurView blurType="dark" blurAmount={60} style={StyleSheet.absoluteFill} overlayColor={Platform.OS === "android" ? colorize("#171717", 0.0) : colorize("#171717", 0.0)} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colorize("#171717", 0.8) }}>
          <Image source={require("@/assets/images/logo.jpg")} style={{ width: wp(40), height: wp(40), borderWidth: wp(0.5), borderRadius: wp(50), borderColor: colorize(primaryColor, 1.0) }} />
          <Text style={{ marginTop: hp(4), fontSize: wp(12), fontFamily: "Lobster", color: colorize(primaryColor, 1.0), textDecorationLine: "underline" }}>Downloading</Text>
          <Text style={{ marginTop: hp(2), fontSize: hp(3), fontFamily: "Markazi", color: colorize("#F4F4F5", 1.0) }}>{percentage.toFixed(1)}%</Text>
          <View style={{ width: wp(80), height: hp(1.5), borderRadius: 9999, overflow: "hidden", marginTop: hp(2), backgroundColor: colorize("#242424", 1.0) }}>
            <Animated.View style={{ width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }), backgroundColor: colorize(primaryColor, 1.0), height: "100%" }} />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", width: wp(80), marginTop: hp(2) }}>
            <Text style={{ fontSize: hp(2), fontFamily: "Markazi", color: colorize("#F4F4F5", 1.0) }}>{formatBytes(downloadRate)}/s</Text>
            <Text style={{ fontSize: hp(2), fontFamily: "Markazi", color: colorize("#F4F4F5", 1.0) }}>ETA: {formatTime(eta)}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
});
DownloadingModal.displayName = "DownloadingModal";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const PreviewImage: React.FC<{ selectedImage: ImageMetadata; screenWidth: number; onViewFullScreen: () => void; onDownload: () => void }> = memo(({ selectedImage, screenWidth, onViewFullScreen, onDownload }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const aspectRatio = selectedImage.width / selectedImage.height;
  const imageHeight = useMemo(() => (screenWidth / aspectRatio) * 0.8, [screenWidth, aspectRatio]);
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
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: colorize("#171717", 1.0), zIndex: 40 }}>
          <ActivityIndicator size="large" color={colorize(selectedImage.primary, 1.0)} accessibilityLabel="Loading image" /> <Text style={{ marginTop: hp(2), fontFamily: "Lobster", color: colorize("#F4F4F5", 1.0) }}>Loading HD Image Preview...</Text>
        </View>
      )}
      <Animated.View style={[{ width: "100%", height: imageHeight, overflow: "hidden", borderTopLeftRadius: wp(5), borderTopRightRadius: wp(5), transform: [{ scale: scaleValue }] }]}>
        <Image
          contentFit="cover"
          cachePolicy="disk"
          source={{ uri: highResLink }}
          alt={`WallpaperPreview${highResLink}`}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          style={{ width: "100%", height: "100%", borderTopLeftRadius: wp(5), borderTopRightRadius: wp(5) }}
          onError={() => {
            setImageLoading(false);
            Alert.alert("Error", "Failed to load image. Please try again.");
          }}
        />
      </Animated.View>
      <Text style={{ top: hp(6), left: wp(2), zIndex: 50, fontSize: hp(3.5), position: "absolute", fontFamily: "Lobster", color: colorize("#F4F4F5", 1.0) }}> {selectedImage.original_file_name.replace(".jpg", "")} </Text>
      <View style={{ position: "absolute", bottom: hp(0.5), left: wp(1), right: wp(1), flexDirection: "row", justifyContent: "space-between", zIndex: 50 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onViewFullScreen}
          accessibilityLabel="Set as wallpaper"
          style={{ flex: 1, marginRight: wp(0.5), borderTopLeftRadius: wp(2), borderBottomLeftRadius: wp(2), alignItems: "center", flexDirection: "row", paddingVertical: hp(1.5), justifyContent: "center", backgroundColor: colorize("#171717", 0.9) }}
        >
          <Ionicons name="image" size={hp(2)} color={colorize("#F4F4F5", 1.0)} style={{ marginRight: wp(2) }} /> <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: hp(2), fontFamily: "Lobster" }}>Set as Wallpaper</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onDownload}
          accessibilityLabel="Download wallpaper"
          style={{ flex: 1, marginLeft: wp(0.5), borderTopRightRadius: wp(2), borderBottomRightRadius: wp(2), alignItems: "center", flexDirection: "row", paddingVertical: hp(1.5), justifyContent: "center", backgroundColor: colorize("#171717", 0.9) }}
        >
          <MaterialIcons name="file-download" size={hp(2)} color={colorize("#F4F4F5", 1.0)} style={{ marginRight: wp(2) }} /> <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: hp(2), fontFamily: "Lobster" }}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
PreviewImage.displayName = "PreviewImage";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const SubImages: React.FC<OtherImagesProps> = memo(({ otherImages, setCurrentIndex, selectedFileName }) => {
  const uniqueImages = useMemo(() => {
    const uniqueFileNames = new Set<string>();
    return otherImages.filter(({ img, idx }) => {
      if (!img) return false;
      if (img.original_file_name === selectedFileName || uniqueFileNames.has(img.original_file_name)) return false;
      uniqueFileNames.add(img.original_file_name);
      return true;
    });
  }, [otherImages, selectedFileName]);
  return (
    <View style={{ borderRadius: wp(3) }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: hp(2) }}>
        <View style={{ flex: 1, height: 1, backgroundColor: colorize("#F4F4F5", 0.2) }} />
        <Text style={{ fontSize: hp(2.2), marginTop: wp(3), fontFamily: "Lobster", color: colorize("#F4F4F5", 1.0) }}>Similar Sub Wallpapers</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: colorize("#F4F4F5", 0.2) }} />
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {uniqueImages.map(({ img, idx }) => {
          const lowResLink = createPreviewLink(img);
          return (
            <TouchableOpacity
              key={idx}
              style={{ position: "relative", borderRadius: wp(2), overflow: "hidden", marginHorizontal: wp(0.5), flex: 1, aspectRatio: 9 / 16 }}
              onPress={() => setCurrentIndex(idx)}
              accessibilityLabel={`SelectWallpaper${img.original_file_name}`}
            >
              <Image alt={`WallpaperThumbnail${lowResLink}`} source={{ uri: lowResLink }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
              <View style={{ position: "absolute", top: wp(1), left: wp(1), backgroundColor: colorize("#171717", 0.5), paddingHorizontal: wp(2), paddingVertical: hp(1), borderRadius: wp(2) }}>
                <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: hp(1.5), fontFamily: "Markazi" }}>{img.original_file_name.replace(".jpg", "")}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});
SubImages.displayName = "SubImages";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const WallModal: React.FC<WallModalProps> = memo(({ visible, onComplete, onCancel, wallType, primaryColor }) => {
  const countdownRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [modalAnim] = useState(new Animated.Value(0));
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
      <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colorize("#171717", 0.5) }, backdropStyle]} />
      <Animated.View style={[{ width: wp(80), borderRadius: wp(6), padding: wp(5), borderWidth: 4, backgroundColor: colorize("#171717", 1.0), borderColor: colorize(primaryColor, 1.0) }, modalStyle]}>
        <View style={{ alignItems: "center" }}>
          <Text>
            <MaterialIcons name="warning" size={hp(6)} color={colorize(primaryColor, 1.0)} /> {wallType === "HOME" ? "Setting HomeScreen" : "Setting LockScreen"}
          </Text>
          <Text style={{ marginVertical: hp(1), textAlign: "center", fontSize: hp(2.5), fontFamily: "Markazi", color: colorize("#F4F4F5", 1.0) }}>
            Due to Android&apos;s Material Style, the system UI will restart after setting the wallpaper. This is normal behavior.
          </Text>
          <Text style={{ marginVertical: hp(2), fontSize: hp(6), fontFamily: "Markazi", color: colorize("#F4F4F5", 1.0) }}>{countdown}</Text>
          <TouchableOpacity
            style={{ marginTop: hp(2), paddingHorizontal: wp(5), paddingVertical: hp(1.5), borderRadius: wp(4), overflow: "hidden", backgroundColor: colorize(primaryColor, 0.4), minWidth: wp(30), minHeight: hp(5) }}
            onPress={() => {
              clearInterval(countdownRef.current);
              onCancel();
            }}
            accessibilityLabel="CancelWallpaperSetting"
          >
            <Text style={{ color: colorize("#F4F4F5", 1.0), fontSize: hp(2), fontFamily: "Lobster" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
});
WallModal.displayName = "WallModal";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const FullScreenView: React.FC<FullScreenViewProps> = ({ isFullScreen, setIsFullScreen, selectedImage, selectedIndex, data, environment_title }) => {
  const [wallType, setWallType] = useState<"HOME" | "LOCK">("HOME");
  const [showWallModal, setShowWallModal] = useState(false);
  const [rightArrowAnim] = useState(new Animated.Value(0));
  const [leftArrowAnim] = useState(new Animated.Value(0));
  useEffect(() => {
    if (isFullScreen) {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([Animated.timing(leftArrowAnim, { toValue: 1, duration: 1000, useNativeDriver: true }), Animated.timing(rightArrowAnim, { toValue: 1, duration: 1000, useNativeDriver: true })]),
          Animated.parallel([Animated.timing(leftArrowAnim, { toValue: 0, duration: 1000, useNativeDriver: true }), Animated.timing(rightArrowAnim, { toValue: 0, duration: 1000, useNativeDriver: true })])
        ])
      ).start();
    }
  }, [isFullScreen, leftArrowAnim, rightArrowAnim]);
  const leftArrowTranslate = leftArrowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
  const rightArrowTranslate = rightArrowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 10] });
  const saveCurrentState = useCallback(async () => {
    const { setLastState } = useAppState.getState();
    const stateToSave = { selectedIndex, data, environment_title };
    setLastState(stateToSave);
  }, [selectedIndex, data, environment_title]);
  const handleWallpaperSet = useCallback(async () => {
    await saveCurrentState();
    await setWallpaper({ uri: createPreviewLink(selectedImage).replace("min", "max") }, TYPE_SCREEN[wallType]);
    setShowWallModal(false);
  }, [saveCurrentState, selectedImage, wallType]);
  return (
    <Modal visible={isFullScreen} transparent={false} onRequestClose={() => setIsFullScreen(false)} presentationStyle="fullScreen" statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: colorize("#171717", 1.0) }}>
        <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }} showsHorizontalScrollIndicator={false}>
          <Image contentFit="fill" alt={`WallpaperFullView${createPreviewLink(selectedImage)}`} source={{ uri: createPreviewLink(selectedImage).replace("min", "max") }} style={{ height: "100%", width: (Dimensions.get("window").height * 9) / 16 }} />
        </ScrollView>
        <Animated.View style={{ zIndex: 50, left: wp(4), top: hp(45), padding: wp(2), position: "absolute", borderRadius: wp(50), transform: [{ translateX: leftArrowTranslate }] }}>
          <AntDesign name="caretleft" size={hp(4)} color={colorize("#F4F4F5", 1.0)} />
        </Animated.View>
        <Animated.View style={{ zIndex: 50, top: hp(45), right: wp(4), padding: wp(2), position: "absolute", borderRadius: wp(50), transform: [{ translateX: rightArrowTranslate }] }}>
          <AntDesign name="caretright" size={hp(4)} color={colorize("#F4F4F5", 1.0)} />
        </Animated.View>
        <View style={{ position: "absolute", bottom: hp(2), left: wp(3), right: wp(3), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View
            style={{
              flex: 1,
              height: hp(7),
              marginHorizontal: wp(0.5),
              borderTopLeftRadius: wp(3),
              borderBottomLeftRadius: wp(3),
              backgroundColor: colorize("#171717", 0.9)
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", height: "100%" }}
              onPress={() => {
                setWallType("LOCK");
                setShowWallModal(true);
              }}
              accessibilityLabel="Set lockscreen wallpaper"
            >
              <Ionicons name="image" size={hp(2)} color={colorize("#F4F4F5", 1.0)} style={{ marginRight: wp(2) }} />
              <Text style={{ fontSize: hp(1.8), color: colorize("#F4F4F5", 1.0), fontFamily: "Lobster" }}>Set LockScreen</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              height: hp(7),
              marginHorizontal: wp(0.5),
              borderTopRightRadius: wp(3),
              borderBottomRightRadius: wp(3),
              backgroundColor: colorize("#171717", 0.9)
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", height: "100%" }}
              onPress={() => {
                setWallType("HOME");
                setShowWallModal(true);
              }}
              accessibilityLabel="Set homescreen wallpaper"
            >
              <Ionicons name="image" size={hp(2)} color={colorize("#F4F4F5", 1.0)} style={{ marginRight: wp(2) }} />
              <Text style={{ fontSize: hp(1.8), color: colorize("#F4F4F5", 1.0), fontFamily: "Lobster" }}>Set HomeScreen</Text>
            </TouchableOpacity>
          </View>
        </View>
        <WallModal visible={showWallModal} onComplete={handleWallpaperSet} onCancel={() => setShowWallModal(false)} wallType={wallType} primaryColor={selectedImage.primary} />
      </View>
    </Modal>
  );
};
FullScreenView.displayName = "FullScreenView";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
export default function ImagePage(): JSX.Element {
  const router = useRouter();
  const { updateRequired } = useVersionCheck();
  useEffect(() => {
    if (updateRequired) {
      router.push("/Update");
      return;
    }
  }, [router, updateRequired]);
  const params = useLocalSearchParams();
  const [eta, setEta] = useState<number>(0);
  const rawDataString = params.data as string;
  const downloadStartTime = useRef<number>(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [percentage, setPercentage] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadRate, setDownloadRate] = useState<number>(0);
  const Sanitized = useMemo(() => JSON.parse(rawDataString), [rawDataString]);
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
    <View style={{ flex: 1, backgroundColor: colorize("#171717", 1.0) }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView style={{ flex: 1 }}>
        <PreviewImage selectedImage={selectedImage} screenWidth={screenWidth} onViewFullScreen={() => setIsFullScreen(true)} onDownload={downloadAndSaveImage} />
        <View style={{ padding: wp(0.5), borderWidth: 2, backgroundColor: colorize("#171717", 1.0) }}>
          <SubImages otherImages={otherImages} setCurrentIndex={setCurrentIndex} selectedFileName={selectedImage.original_file_name} />
        </View>
        <Footer />
      </ScrollView>
      <FullScreenView isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} selectedImage={selectedImage} selectedIndex={currentIndex} data={Sanitized.data} environment_title={environmentTitle} />
      <DownloadingModal visible={isDownloading} percentage={percentage} downloadRate={downloadRate} eta={eta} primaryColor={selectedImage.primary} />
      <SuccessModal visible={alertVisible && alertIcon === "checkmark-done-circle"} message={alertMessage} onClose={hideAlert} />
      <ErrorModal visible={alertVisible && alertIcon === "error"} message={alertMessage} onClose={hideAlert} />
    </View>
  );
}
/* ============================================================================================================================== */
/* ============================================================================================================================== */
