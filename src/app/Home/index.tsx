/* ============================================================================================================================== */
// /src/app/Home/index.tsx
/* ============================================================================================================================== */
import { Link } from "expo-router";
import { Image } from "expo-image";
import colorize from "@/utils/colorize";
import Footer from "@/components/Footer";
import { fetchAllData } from "@/utils/sercon";
import AniHead from "@/components/AniHead";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "@react-native-community/blur";
import { EnvironmentEntry, ImageMetadata } from "@/types/database";
import { createPreviewLink, createDownloadLink } from "@/utils/linker";
import { useEffect, useRef, useCallback, useState, memo, FC, useMemo } from "react";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { SubImagesProps, CardProps, CategoryButtonProps } from "@/types/components";
import { Easing, useSharedValue, useAnimatedStyle, withTiming, withRepeat } from "react-native-reanimated";
import { Animated, View, Text, TouchableOpacity, FlatList, StatusBar, ScrollView, TextInput, Modal, ActivityIndicator, StyleSheet, Dimensions, Platform } from "react-native";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
type ParentKey = string;
interface Category {
  subcategories: string[];
  name: ParentKey | "Combined";
  database: Partial<Record<string, Record<string, EnvironmentEntry>>>;
}
interface CategoryButtonExtendedProps extends CategoryButtonProps {
  count?: number;
  selected: boolean;
  onPress: () => void;
  rawCategoriesArray: Category[];
}
interface CategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedCategory: string;
  rawCategoriesArray: Category[];
  onSelectCategory: (parent: ParentKey | "Combined", child?: string) => void;
}
interface HeaderComponentProps {
  mixedCount: number;
  onSearch: (text: string) => void;
  rawCategoriesArray: Category[];
  selectedCategory: ParentKey | "Combined";
  onSelectCategory: (parent: ParentKey | "Combined", child?: string) => void;
}
/* ============================================================================================================================== */
/* ============================================================================================================================== */
function generateCategories(apiData: Record<string, any>) {
  let shuffleDB: Record<string, EnvironmentEntry> = {};
  const categoriesArray: Category[] = [{ name: "Combined", subcategories: [], database: {} }];
  Object.keys(apiData).forEach((parent) => {
    const subObj = apiData[parent];
    const subCategories = Object.keys(subObj);
    const db: Partial<Record<string, Record<string, EnvironmentEntry>>> = {};
    subCategories.forEach((subKey) => {
      const environmentEntries = subObj[subKey];
      shuffleDB = { ...shuffleDB, ...environmentEntries };
      db[subKey] = environmentEntries;
    });
    categoriesArray.push({ name: parent, subcategories: [...subCategories, "Combined"], database: db });
  });
  return { categoriesArray, shuffleDB };
}
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const CategoryModal: FC<CategoryModalProps> = memo(({ isVisible, onClose, onSelectCategory, rawCategoriesArray }) => {
  const [activeParent, setActiveParent] = useState<ParentKey | "Combined">(rawCategoriesArray.find((cat) => cat.name !== "Combined")?.name || "Combined");
  const [currentIndices, setCurrentIndices] = useState<Record<string, number>>({});
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [previewLinks, setPreviewLinks] = useState<Record<string, string[]>>({});
  const generatePreviewLinks = useCallback(() => {
    const newLinks: Record<string, string[]> = {};
    rawCategoriesArray.forEach((cat) => {
      if (cat.name === "Combined") return;
      const combinedEnvs: EnvironmentEntry[] = [];
      cat.subcategories
        .filter((s: string) => s !== "Combined")
        .forEach((sub: string) => {
          const subObj = cat.database[sub];
          if (subObj) combinedEnvs.push(...Object.values(subObj));
        });
      if (combinedEnvs.length) {
        const allParentImages = combinedEnvs.flatMap((env) => env.images);
        newLinks[cat.name] = allParentImages.map(createPreviewLink);
      }
      cat.subcategories.forEach((subCat) => {
        const subObj = cat.database[subCat];
        if (subObj) {
          const allSubImages = Object.values(subObj).flatMap((env) => env.images);
          if (allSubImages.length) newLinks[`${cat.name}-${subCat}`] = allSubImages.map(createPreviewLink);
        }
      });
    });
    setPreviewLinks(newLinks);
  }, [rawCategoriesArray]);

  useEffect(() => {
    if (!isVisible) return;
    const intervals: NodeJS.Timeout[] = [];
    Object.keys(previewLinks).forEach((key) => {
      const interval = setInterval(() => {
        setCurrentIndices((prev) => ({ ...prev, [key]: ((prev[key] || 0) + 1) % (previewLinks[key]?.length || 1) }));
      }, 2000);
      intervals.push(interval);
    });
    return () => intervals.forEach(clearInterval);
  }, [isVisible, previewLinks]);

  useEffect(() => {
    if (isVisible) generatePreviewLinks();
  }, [isVisible, generatePreviewLinks]);

  if (!isVisible) return null;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View style={{ height: Dimensions.get("window").height * 0.8 }}>
          <BlurView
            blurType="dark"
            blurAmount={80}
            style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
            overlayColor={Platform.OS === "android" ? colorize("#0C0C0C", 0.0) : colorize("#0C0C0C", 0.0)}
          />
          <View style={{ flex: 1, backgroundColor: colorize("#0C0C0C", 0.9), overflow: "hidden" }}>
            <View
              style={{
                padding: 10,
                borderTopWidth: 4,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderColor: colorize("#FFFFFF", 1.0),
                backgroundColor: colorize("#0C0C0C", 0.8)
              }}
            >
              <Text style={{ fontFamily: "Jersey", fontSize: 70, color: colorize("#FFFFFF", 1.0) }}> All Categories</Text>
            </View>
            <View style={{ height: 180, backgroundColor: colorize("#0C0C0C", 0.8), borderColor: colorize("#FFFFFF", 1.0), borderBottomWidth: 4 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 2 }}>
                {rawCategoriesArray
                  .filter((cat) => cat.name !== "Combined")
                  .map((category) => {
                    const currentIndex = currentIndices[category.name] || 0;
                    const images = previewLinks[category.name] || [];
                    return (
                      <TouchableOpacity
                        key={category.name}
                        onPress={() => {
                          setActiveParent(category.name);
                          setSelectedSubcategory(null);
                        }}
                        style={{
                          width: 100,
                          height: 180,
                          marginRight: 4,
                          overflow: "hidden",
                          borderTopLeftRadius: 15,
                          borderTopRightRadius: 15,
                          borderColor: colorize("#FFFFFF", 1.0),
                          borderWidth: activeParent === category.name ? 4 : 0
                        }}
                        accessibilityLabel={`Select ${category.name} category`}
                      >
                        {images.length > 0 && <Image alt="Category preview" source={{ uri: images[currentIndex] }} style={{ width: "100%", height: "100%" }} contentFit="cover" />}
                        <LinearGradient
                          end={{ x: 0.5, y: 0 }}
                          start={{ x: 0.5, y: 1 }}
                          locations={[0, 0.2, 0.4]}
                          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
                          colors={[colorize("#0C0C0C", 0.9), colorize("#0C0C0C", 0.7), "transparent"]}
                        />
                        <Text
                          style={{
                            left: 8,
                            right: 8,
                            bottom: 8,
                            fontSize: 14,
                            textAlign: "center",
                            position: "absolute",
                            textShadowRadius: 4,
                            fontFamily: "Kurale",
                            color: colorize("#FFFFFF", 1.0),
                            textShadowColor: colorize("#0C0C0C", 0.9),
                            textShadowOffset: { width: 1, height: 1 }
                          }}
                        >
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
              </ScrollView>
            </View>
            <View style={{ flex: 1, marginTop: 10 }}>
              <ScrollView contentContainerStyle={{ padding: 10 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                  {rawCategoriesArray
                    .find((c) => c.name === activeParent)
                    ?.subcategories.sort((a, b) => (a === "Combined" ? -1 : b === "Combined" ? 1 : 0))
                    .map((child) => {
                      const key = `${activeParent}-${child}`;
                      const currentIndex = currentIndices[key] || 0;
                      const images = previewLinks[key] || [];
                      const isMixed = child === "Combined";
                      const activeCat = rawCategoriesArray.find((c) => c.name === activeParent);
                      let displayName = child;
                      let count = 0;
                      if (isMixed && activeCat) {
                        count = activeCat.subcategories
                          .filter((s) => s !== "Combined")
                          .reduce((acc, sub) => {
                            const subDB = activeCat.database[sub];
                            return acc + (subDB ? Object.keys(subDB).length : 0);
                          }, 0);
                        displayName = `All (${count})`;
                      }
                      return (
                        <TouchableOpacity
                          key={child}
                          onPress={() => {
                            setSelectedSubcategory(child);
                            onSelectCategory(activeParent, child === "Combined" ? "Combined" : child);
                            onClose();
                          }}
                          style={{ width: "49%", marginBottom: 10 }}
                          accessibilityLabel={`Select ${child} subcategory`}
                        >
                          <View
                            style={{
                              elevation: 4,
                              aspectRatio: 1,
                              borderWidth: 2,
                              borderRadius: 15,
                              overflow: "hidden",
                              borderColor: selectedSubcategory === child ? colorize("#FFFFFF", 1.0) : colorize("#0C0C0C", 1.0),
                              backgroundColor: selectedSubcategory === child ? colorize("#FFFFFF", 1.0) : colorize("#0C0C0C", 1.0)
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                marginBottom: 4,
                                textAlign: "center",
                                fontFamily: "Kurale",
                                color: selectedSubcategory === child ? colorize("#0C0C0C", 1.0) : colorize("#FFFFFF", 1.0)
                              }}
                            >
                              {displayName}
                            </Text>
                            {child === "Combined" ? (
                              <Image alt="Combined category preview" source={require("@/assets/images/Combined.gif")} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                            ) : (
                              images.length > 0 && <Image alt="Subcategory preview" source={{ uri: images[currentIndex] }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
});
CategoryModal.displayName = "CategoryModal";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const SearchBar: FC<{ onSearch: (text: string) => void }> = memo(({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };
  return (
    <View style={{ marginTop: 5 }}>
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colorize("#242424", 1.0), borderRadius: 15, paddingHorizontal: 12, height: 44 }}>
        <FontAwesome5 name="search" size={16} color={colorize("#FFFFFF", 0.8)} />
        <TextInput
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Search by image name..."
          placeholderTextColor={colorize("#FFFFFF", 0.6)}
          style={{ flex: 1, marginLeft: 8, fontSize: 16, fontFamily: "Jersey", color: colorize("#FFFFFF", 1.0) }}
          accessibilityLabel="Search wallpapers"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")} style={{ padding: 8 }} accessibilityLabel="Clear search">
            <FontAwesome5 name="times" size={16} color={colorize("#FFFFFF", 0.8)} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});
SearchBar.displayName = "SearchBar";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const SubImages: FC<SubImagesProps> = memo(({ images, onImagePress }) => (
  <View style={{ flex: 1, justifyContent: "flex-start" }}>
    {images.data.map((image, index) => {
      const fullDataIndex = images.allData.findIndex((img) => img.original_file_name === image.original_file_name);
      return (
        <Link key={index} href={{ pathname: "/Shared", params: { data: JSON.stringify({ environment_title: images.environment_title, selectedIndex: fullDataIndex, data: images.allData }) } }} asChild>
          <TouchableOpacity onPress={() => onImagePress(image.previewLink as string, fullDataIndex)} style={{ flex: 1, padding: 4 }} accessibilityLabel="View wallpaper details">
            <View style={{ position: "relative" }}>
              <Image
                contentFit="cover"
                cachePolicy="disk"
                alt="Wallpaper preview"
                source={{ uri: image.previewLink as string }}
                style={{ height: 60, width: "100%", borderWidth: 1, borderColor: colorize("#FFFFFF", 0.5), borderRadius: 15 }}
              />
              <Text
                style={{
                  right: 4,
                  bottom: 4,
                  fontSize: 12,
                  borderRadius: 15,
                  position: "absolute",
                  paddingHorizontal: 8,
                  fontFamily: "Kurale",
                  color: colorize("#0C0C0C", 1.0),
                  backgroundColor: colorize(image.primary, 1.0)
                }}
              >
                {image.primary.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
      );
    })}
  </View>
));
SubImages.displayName = "SubImages";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const Card: FC<CardProps> = memo(({ data }) => {
  const [currentImage, setCurrentImage] = useState<string>(data.images[0]?.previewLink as string);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [loading, setLoading] = useState<boolean>(false);
  const updateImageState = useCallback(
    (nextIndex: number) => {
      setCurrentIndex(nextIndex);
      setCurrentImage(data.images[nextIndex]?.previewLink as string);
    },
    [data.images]
  );
  const animateTransition = useCallback(
    (nextIndex: number) => {
      Animated.parallel([
        Animated.sequence([Animated.timing(fadeAnim, { toValue: 0.4, duration: 400, useNativeDriver: true }), Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true })]),
        Animated.sequence([Animated.timing(scaleAnim, { toValue: 0.98, duration: 400, useNativeDriver: true }), Animated.timing(scaleAnim, { toValue: 1, duration: 400, useNativeDriver: true })])
      ]).start(() => updateImageState(nextIndex));
    },
    [fadeAnim, scaleAnim, updateImageState]
  );
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % data.images.length;
      animateTransition(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, data.images.length, animateTransition]);
  return (
    <View style={{ position: "relative", margin: 1, borderRadius: 15, overflow: "hidden", shadowColor: "#0C0C0C", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 3 }}>
      <Link href={{ pathname: "/Shared", params: { data: JSON.stringify({ environment_title: data.environment_title, selectedIndex: currentIndex, data: data.images }) } }} asChild>
        <TouchableOpacity accessibilityLabel="View full wallpaper">
          <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
            <View style={{ position: "relative", width: "100%", height: 400, overflow: "hidden" }}>
              <Image
                contentFit="cover"
                cachePolicy="disk"
                alt="Wallpaper image"
                source={{ uri: currentImage }}
                onLoad={() => setLoading(false)}
                onLoadStart={() => setLoading(true)}
                style={{ width: "100%", height: "100%" }}
              />
              {loading && (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: colorize("#0C0C0C", 0.2) }]} className="flex items-center justify-center">
                  <ActivityIndicator size="large" color={colorize("#FFFFFF", 1.0)} accessibilityLabel="Loading image" />
                </View>
              )}
              <View
                style={{
                  top: 8,
                  left: 8,
                  borderRadius: 15,
                  paddingVertical: 4,
                  position: "absolute",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 6,
                  backgroundColor: colorize("#0C0C0C", 0.9)
                }}
              >
                <MaterialCommunityIcons name="movie-filter" size={16} color={colorize("#FF000D", 1.0)} style={{ marginRight: 4 }} />
                <Text style={{ color: "#FFFFFF", fontSize: 12, fontFamily: "Kurale" }}>Freemium (Watch an Ad)</Text>
              </View>
              <View style={{ position: "absolute", bottom: -2, left: 0, right: 0 }}>
                <View style={[StyleSheet.absoluteFill, { backgroundColor: colorize(data.images[currentIndex].primary, 1.0) }]} />
                <View style={{ padding: 4, margin: 4 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <Text style={{ flex: 1, fontSize: 14, marginRight: 8, color: colorize("#FFFFFF", 1.0), fontFamily: "Kurale" }}>
                      {data.images[currentIndex].original_file_name.replace(/_/g, " ").replace(".jpg", "")}
                    </Text>
                    <View style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Text style={{ fontSize: 12, color: colorize("#FFFFFF", 1.0), fontFamily: "Kurale" }}> {data.images[currentIndex].primary} </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
          <View style={{ position: "absolute", top: "35%", right: 8, padding: 4, transform: [{ translateY: -70 }], borderRadius: 15 }}>
            <View style={[StyleSheet.absoluteFillObject, { borderRadius: 15, overflow: "hidden", backgroundColor: colorize("#0C0C0C", 0.8) }]} />
            {data.images.slice(0, 3).map((img, idx) => (
              <TouchableOpacity key={idx} onPress={() => animateTransition(idx)} style={{ marginBottom: idx < 2 ? 2 : 0 }} accessibilityLabel="Select thumbnail">
                <Image
                  alt="Wallpaper thumbnail"
                  source={{ uri: img.previewLink }}
                  style={{
                    width: 60,
                    height: 80,
                    ...(idx === 1 && { borderRadius: 0 }),
                    opacity: currentIndex === idx ? 1 : 0.8,
                    borderColor: colorize("#FFFFFF", 1.0),
                    borderWidth: currentIndex === idx ? 2 : 0,
                    ...(idx === 0 && { borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }),
                    ...(idx === 2 && { borderBottomLeftRadius: 8, borderBottomRightRadius: 8, borderTopLeftRadius: 0, borderTopRightRadius: 0 })
                  }}
                  cachePolicy="disk"
                  contentFit="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
});
Card.displayName = "Card";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const CategoryButton: FC<CategoryButtonExtendedProps> = memo(({ category, onPress, rawCategoriesArray, count }) => {
  const [currentImage, setCurrentImage] = useState<string>("");
  const updateShuffleImage = useCallback(() => {
    if (category === "Categories") {
      const allImages: string[] = [];
      rawCategoriesArray.forEach((cat: Category) => {
        if (cat.name === "Combined") return;
        cat.subcategories
          .filter((s: string) => s !== "Combined")
          .forEach((sub: string) => {
            const subObj = cat.database[sub];
            if (subObj) {
              Object.values(subObj).forEach((env: EnvironmentEntry) => {
                env.images.forEach((img: ImageMetadata) => {
                  allImages.push(createPreviewLink(img));
                });
              });
            }
          });
      });
      if (allImages.length) setCurrentImage(allImages[Math.floor(Math.random() * allImages.length)]);
    }
  }, [category, rawCategoriesArray]);
  useEffect(() => {
    updateShuffleImage();
  }, [updateShuffleImage]);
  return (
    <TouchableOpacity onPress={() => onPress()} style={{ flex: 1, height: 60, margin: 4, borderRadius: 15, overflow: "hidden", minWidth: 120 }} accessibilityLabel={`Browse ${category}`}>
      <View style={{ borderRadius: 15, overflow: "hidden", width: "100%", height: "100%" }}>
        <Image
          contentFit="cover"
          alt="Category background"
          style={{ width: "100%", height: "100%", borderRadius: 15 }}
          source={category === "Combined" ? require("@/assets/images/Shuffle.gif") : { uri: currentImage }}
        />
        <LinearGradient colors={[colorize("#0C0C0C", 0.7), colorize("#0C0C0C", 0.7)]} style={{ position: "absolute", width: "100%", height: "100%", borderRadius: 15 }} />
        <View style={{ width: "100%", height: "100%", borderRadius: 15, position: "absolute", alignItems: "center", flexDirection: "row", justifyContent: "center" }}>
          <MaterialCommunityIcons name={category === "Categories" ? "image-filter-vintage" : "dice-multiple"} size={20} color={colorize("#FFFFFF", 1.0)} style={{ marginRight: 4 }} />
          <Text style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 1.0), fontSize: 18, textAlign: "center" }}> {category === "Combined" ? `All (${count})` : category} </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});
CategoryButton.displayName = "CategoryButton";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const HeaderComponent: FC<HeaderComponentProps> = memo(({ selectedCategory, onSelectCategory, onSearch, rawCategoriesArray, mixedCount }) => {
  const fadeInValue = useSharedValue(0);
  const leftIconTranslate = useSharedValue(0);
  const rightIconTranslate = useSharedValue(0);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeInStyle = useAnimatedStyle(() => ({ opacity: fadeInValue.value }));
  const leftIconStyle = useAnimatedStyle(() => ({ transform: [{ translateX: leftIconTranslate.value }] }));
  const rightIconStyle = useAnimatedStyle(() => ({ transform: [{ translateX: rightIconTranslate.value }] }));
  useEffect(() => {
    fadeInValue.value = withTiming(1, { duration: 1200, easing: Easing.ease });
    leftIconTranslate.value = withRepeat(withTiming(-20, { duration: 800, easing: Easing.ease }), -1, true);
    rightIconTranslate.value = withRepeat(withTiming(20, { duration: 800, easing: Easing.ease }), -1, true);
  }, [fadeInValue, leftIconTranslate, rightIconTranslate]);
  return (
    <Animated.View style={fadeInStyle}>
      <View style={{ marginHorizontal: -10 }}>
        <AniHead />
      </View>
      <View style={{ marginTop: 20, paddingRight: 6, paddingLeft: 6, paddingBottom: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Animated.View style={leftIconStyle}>
            <FontAwesome5 name="caret-left" size={24} color={colorize("#FFFFFF", 1.0)} />
          </Animated.View>
          <Text style={{ fontFamily: "Jersey", fontSize: 30, color: colorize("#FFFFFF", 1.0), textAlign: "center", marginHorizontal: 10 }}> Explore AI Generated Wallpapers </Text>
          <Animated.View style={rightIconStyle}>
            <FontAwesome5 name="caret-right" size={24} color={colorize("#FFFFFF", 1.0)} />
          </Animated.View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
          <CategoryButton category="Combined" selected={selectedCategory === "Combined"} onPress={() => onSelectCategory("Combined")} rawCategoriesArray={rawCategoriesArray} count={mixedCount} />
          <CategoryButton category="Categories" selected={false} onPress={() => setModalVisible(true)} rawCategoriesArray={rawCategoriesArray} />
        </View>
        <SearchBar onSearch={onSearch} />
        <CategoryModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelectCategory={onSelectCategory}
          selectedCategory={String(selectedCategory)}
          rawCategoriesArray={rawCategoriesArray}
        />
      </View>
    </Animated.View>
  );
});
HeaderComponent.displayName = "HeaderComponent";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
const EnvironmentItem: FC<{ item: EnvironmentEntry }> = memo(({ item }) => (
  <View style={{ flex: 1, margin: 1 }}>
    <Card data={item} />
  </View>
));
EnvironmentItem.displayName = "EnvironmentItem";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
export default function HomePage(): JSX.Element {
  const [selectedParent, setSelectedParent] = useState<ParentKey | "Combined">("Combined");
  const [shuffleDB, setShuffleDB] = useState<Record<string, EnvironmentEntry>>({});
  const [rawCategoriesArray, setRawCategoriesArray] = useState<Category[]>([]);
  const mixedCount = useMemo(() => Object.keys(shuffleDB).length, [shuffleDB]);
  const [filteredData, setFilteredData] = useState<EnvironmentEntry[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    const loadData = async () => {
      try {
        const apiData = await fetchAllData();
        const { categoriesArray, shuffleDB: newShuffleDB } = generateCategories(apiData);
        setRawCategoriesArray(categoriesArray);
        setShuffleDB(newShuffleDB);
      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Failed to load wallpapers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  const getAllCombinedData = useCallback(() => Object.values(shuffleDB), [shuffleDB]);
  const processImageUrls = useCallback((entry: EnvironmentEntry): EnvironmentEntry => {
    return { ...entry, images: entry.images.map((image: ImageMetadata) => ({ ...image, previewLink: createPreviewLink(image), downloadLink: createDownloadLink(image) })) };
  }, []);
  const fetchData = useCallback(() => {
    if (selectedParent === "Combined") {
      const allEntries = getAllCombinedData().map(processImageUrls);
      const shuffled = [...allEntries].sort(() => Math.random() - 0.5);
      setFilteredData(shuffled);
      return;
    }
    const catObj = rawCategoriesArray.find((c) => c.name === selectedParent);
    if (!catObj) {
      setFilteredData([]);
      return;
    }
    if (!selectedChild) {
      const bigCombine: EnvironmentEntry[] = [];
      catObj.subcategories
        .filter((s) => s !== "Combined")
        .forEach((sub) => {
          const subEnv = catObj.database[sub];
          if (!subEnv) return;
          bigCombine.push(...Object.values(subEnv));
        });
      const processed = bigCombine.map(processImageUrls);
      const shuffled = [...processed].sort(() => Math.random() - 0.5);
      setFilteredData(shuffled);
      return;
    }
    if (selectedChild === "Combined") {
      const combinedEntries: EnvironmentEntry[] = [];
      catObj.subcategories
        .filter((sub) => sub !== "Combined")
        .forEach((sub) => {
          const subObj = catObj.database[sub];
          if (!subObj) return;
          Object.values(subObj).forEach((env) => {
            combinedEntries.push(env);
          });
        });
      const processed = combinedEntries.map(processImageUrls);
      const shuffled = [...processed].sort(() => Math.random() - 0.5);
      setFilteredData(shuffled);
      return;
    }
    const subObj = catObj.database[selectedChild];
    if (!subObj) {
      setFilteredData([]);
      return;
    }
    const processed = Object.values(subObj).map(processImageUrls);
    const shuffled = [...processed].sort(() => Math.random() - 0.5);
    setFilteredData(shuffled);
  }, [selectedParent, selectedChild, getAllCombinedData, processImageUrls, rawCategoriesArray]);
  const handleSearch = useCallback(
    (text: string) => {
      setSearchQuery(text);
      const searchText = text.toLowerCase().trim();
      if (!searchText) {
        fetchData();
        return;
      }
      setFilteredData((prev) => {
        const results = prev
          .map((entry) => {
            const matchedImgs = entry.images.filter((img) => img.original_file_name.toLowerCase().replace(/_/g, " ").replace(".jpg", "").includes(searchText));
            return { ...entry, images: matchedImgs };
          })
          .filter((x) => x.images.length > 0);
        return results;
      });
    },
    [fetchData]
  );
  useEffect(() => {
    fetchData();
  }, [fetchData, selectedParent, selectedChild]);
  const onSelectCategory = useCallback((parent: ParentKey | "Combined", child?: string) => {
    if (parent === "Combined") {
      setSelectedParent("Combined");
      setSelectedChild("");
      return;
    }
    setSelectedParent(parent);
    setSelectedChild(child || "");
  }, []);
  const renderItem = useCallback(({ item }: { item: EnvironmentEntry }) => <EnvironmentItem item={item} />, []);
  const keyExtractor = useCallback((item: EnvironmentEntry) => item.environment_title, []);
  const renderEmptyList = useCallback(() => {
    if (searchQuery) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 1.0), fontSize: 16, textAlign: "center" }}> No images found matching &quot;{searchQuery}&quot;. </Text>
          <Text style={{ fontFamily: "Kurale", color: colorize("#FFFFFF", 1.0), fontSize: 16, textAlign: "center" }}> You may request images from &quot;Account&quot; Section. </Text>
        </View>
      );
    }
    return null;
  }, [searchQuery]);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colorize("#0C0C0C", 1.0) }}>
        <ActivityIndicator size="large" color={colorize("#FFFFFF", 1.0)} accessibilityLabel="Loading content" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colorize("#0C0C0C", 1.0) }}>
        <Text style={{ color: colorize("#FFFFFF", 1.0), fontSize: 16, fontFamily: "Kurale" }}>{error}</Text>
      </View>
    );
  }
  return (
    <View style={{ backgroundColor: colorize("#0C0C0C", 1.0), flex: 1, position: "relative" }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <FlatList
        windowSize={2}
        data={filteredData}
        numColumns={2}
        initialNumToRender={4}
        renderItem={renderItem}
        maxToRenderPerBatch={6}
        keyExtractor={keyExtractor}
        removeClippedSubviews
        ListFooterComponent={Footer}
        ListEmptyComponent={renderEmptyList}
        updateCellsBatchingPeriod={50}
        contentContainerStyle={{ padding: 1 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListHeaderComponent={
          <HeaderComponent selectedCategory={selectedParent} onSelectCategory={onSelectCategory} onSearch={handleSearch} rawCategoriesArray={rawCategoriesArray} mixedCount={mixedCount} />
        }
      />
    </View>
  );
}
/* ============================================================================================================================== */
/* ============================================================================================================================== */
