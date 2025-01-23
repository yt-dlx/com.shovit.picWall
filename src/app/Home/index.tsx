// /src/app/Home/index.tsx
/* ============================================================================================ */
/* ============================================================================================ */
import { Animated, View, Text, TouchableOpacity, FlatList, StatusBar, ScrollView, TextInput, Modal, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { Easing, useSharedValue, useAnimatedStyle, withTiming, withRepeat } from "react-native-reanimated";
import { SubImagesProps, CardProps, CategoryButtonProps } from "@/types/components";
import React, { useEffect, useRef, useCallback, useState, memo, FC } from "react";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { createPreviewLink, createDownloadLink } from "@/utils/linker";
import { EnvironmentEntry, ImageMetadata } from "@/types/database";
import { LinearGradient } from "expo-linear-gradient";
import HAnimated from "@/components/HAnimated";
import Footer from "@/components/Footer";
import Colorizer from "@/utils/Colorizer";
import { fetchAllData } from "@/utils/api";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Link } from "expo-router";
/* ============================================================================================ */
/* ============================================================================================ */
type ParentKey = string;
interface Category {
  name: ParentKey | "Everything";
  subcategories: string[];
  database: Partial<Record<string, Record<string, EnvironmentEntry>>>;
}
interface CategoryButtonExtendedProps extends CategoryButtonProps {
  selected: boolean;
  onPress: () => void;
}
interface CategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (parent: ParentKey | "Everything", child?: string) => void;
  rawCategoriesArray: Category[];
}
interface HeaderComponentProps {
  onSearch: (text: string) => void;
  selectedCategory: ParentKey | "Everything";
  onSelectCategory: (parent: ParentKey | "Everything", child?: string) => void;
  rawCategoriesArray: Category[];
}
/* ============================================================================================ */
/* ============================================================================================ */
const CategoryModal: FC<CategoryModalProps> = ({ isVisible, onClose, onSelectCategory, rawCategoriesArray }) => {
  const [activeParent, setActiveParent] = useState<ParentKey | "Everything">(rawCategoriesArray.find((cat) => cat.name !== "Everything")?.name || "Everything");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [previewLinks, setPreviewLinks] = useState<Record<string, string>>({});
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const generatePreviewLinks = useCallback(() => {
    const newLinks: Record<string, string> = {};
    rawCategoriesArray.forEach((cat) => {
      if (cat.name === "Everything") return;
      const combinedEnvs: EnvironmentEntry[] = [];
      cat.subcategories
        .filter((sub) => sub !== "Everything")
        .forEach((sub) => {
          const subObj = cat.database[sub];
          if (subObj) combinedEnvs.push(...Object.values(subObj));
        });
      if (combinedEnvs.length) {
        const firstEnv = combinedEnvs[0];
        if (firstEnv.images.length) newLinks[cat.name] = createPreviewLink(firstEnv.images[0]);
      }
      cat.subcategories.forEach((subCat) => {
        const subObj = cat.database[subCat];
        if (subObj) {
          const envEntries = Object.values(subObj);
          if (envEntries.length && envEntries[0].images.length) newLinks[`${cat.name}-${subCat}`] = createPreviewLink(envEntries[0].images[0]);
        }
      });
    });
    setPreviewLinks(newLinks);
  }, [rawCategoriesArray]);

  const handleClose = () => {
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 20, mass: 0.8, stiffness: 100 }).start(() => {
      setModalVisible(false);
      onClose();
    });
  };

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      slideAnim.setValue(0);
      Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true, damping: 20, mass: 0.8, stiffness: 100 }).start();
      generatePreviewLinks();
    }
  }, [isVisible, generatePreviewLinks, slideAnim]);

  useEffect(() => {
    if (modalVisible) scale.setValue(1);
  }, [modalVisible, scale]);

  if (!modalVisible) return null;
  const translateY = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [Dimensions.get("window").height, 0] });

  return (
    <Modal visible transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Animated.View style={[{ transform: [{ translateY }] }, { height: Dimensions.get("window").height * 0.9 }]}>
          <BlurView intensity={80} tint="dark" experimentalBlurMethod="dimezisBlurView" style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }} />
          <View style={{ flex: 1, backgroundColor: "transparent", borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 }}>
              <Text style={{ fontFamily: "PlayfairDisplay_Black", fontSize: 22, color: "#FFFFFF", letterSpacing: 0.5 }}>Categories & Styles</Text>
              <TouchableOpacity onPress={handleClose} style={{ padding: 8 }}>
                <FontAwesome5 name="times" size={24} color={Colorizer("#FFFFFF", 0.8)} />
              </TouchableOpacity>
            </View>
            <View style={{ height: 150 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {rawCategoriesArray
                  .filter((cat) => cat.name !== "Everything")
                  .map((category) => (
                    <TouchableOpacity
                      key={category.name}
                      onPress={() => {
                        setActiveParent(category.name);
                        setSelectedSubcategory(null);
                      }}
                      style={{ width: 100, height: 150, marginRight: 8, borderRadius: 8, overflow: "hidden", borderWidth: activeParent === category.name ? 2 : 0, borderColor: "#FFFFFF" }}
                    >
                      <Image source={{ uri: previewLinks[category.name] }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                      <LinearGradient colors={["transparent", Colorizer("#0C0C0C", 0.9)]} style={{ position: "absolute", width: "100%", height: "100%" }} />
                      <Text
                        style={{
                          position: "absolute",
                          bottom: 8,
                          left: 8,
                          right: 8,
                          fontFamily: "PlayfairDisplay_Bold",
                          fontSize: 14,
                          color: "#FFFFFF",
                          textAlign: "center",
                          textShadowOffset: { width: 1, height: 1 },
                          textShadowRadius: 2
                        }}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
            <View style={{ flex: 1 }}>
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                  {rawCategoriesArray
                    .find((c) => c.name === activeParent)
                    ?.subcategories.sort((a, b) => (a === "Everything" ? -1 : b === "Everything" ? 1 : 0))
                    .map((child) => (
                      <TouchableOpacity
                        key={child}
                        onPress={() => {
                          setSelectedSubcategory(child);
                          onSelectCategory(activeParent, child === "Everything" ? "Everything" : child);
                          handleClose();
                        }}
                        style={{ width: "48%", marginBottom: 16 }}
                      >
                        <View
                          style={{
                            elevation: 4,
                            aspectRatio: 1,
                            shadowRadius: 6,
                            borderRadius: 12,
                            overflow: "hidden",
                            shadowOpacity: 0.3,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            borderWidth: selectedSubcategory === child ? 2 : 1,
                            borderColor: selectedSubcategory === child ? "#FFFFFF" : "rgba(255,255,255,0.2)"
                          }}
                        >
                          {child === "Everything" ? (
                            <Image source={require("@/assets/images/Everything.gif")} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                          ) : (
                            <Image source={{ uri: previewLinks[`${activeParent}-${child}`] }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                          )}
                          <LinearGradient colors={["transparent", Colorizer("#0C0C0C", 0.8)]} style={{ position: "absolute", inset: 0 }} />
                          <Text
                            style={{
                              left: 12,
                              right: 12,
                              bottom: 12,
                              fontSize: 14,
                              textAlign: "center",
                              color: "#FFFFFF",
                              position: "absolute",
                              textShadowRadius: 2,
                              textShadowOffset: { width: 1, height: 1 },
                              fontFamily: "PlayfairDisplay_SemiBold"
                            }}
                          >
                            {child}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
/* ============================================================================================ */
/* ============================================================================================ */
const SearchBar: FC<{ onSearch: (text: string) => void }> = memo(({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };
  return (
    <View style={{ padding: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: Colorizer("#242424", 1.0), borderRadius: 12, paddingHorizontal: 12, height: 30 }}>
        <FontAwesome5 name="search" size={16} color={Colorizer("#FFFFFF", 0.6)} />
        <TextInput
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Search by image name..."
          placeholderTextColor={Colorizer("#FFFFFF", 0.6)}
          style={{ flex: 1, marginLeft: 8, fontFamily: "PlayfairDisplay_Black", color: Colorizer("#FFFFFF", 1.0) }}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <FontAwesome5 name="times" size={16} color={Colorizer("#FFFFFF", 0.6)} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});
SearchBar.displayName = "SearchBar";
/* ============================================================================================ */
/* ============================================================================================ */
const SubImages: FC<SubImagesProps> = memo(({ images, onImagePress }) => (
  <View style={{ flex: 1, justifyContent: "flex-start" }}>
    {images.data.map((image, index) => {
      const fullDataIndex = images.allData.findIndex((img) => img.original_file_name === image.original_file_name);
      return (
        <Link
          key={index}
          href={{
            pathname: "/Shared",
            params: {
              data: JSON.stringify({ environment_title: images.environment_title, selectedIndex: fullDataIndex, data: images.allData })
            }
          }}
          asChild
        >
          <TouchableOpacity onPress={() => onImagePress(image.previewLink as string, fullDataIndex)} style={{ flex: 1 }}>
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: image.previewLink as string }}
                style={{
                  height: 60,
                  width: "100%",
                  borderWidth: 1,
                  borderColor: Colorizer("#FFFFFF", 0.5),
                  borderRadius: 12
                }}
                cachePolicy="disk"
                contentFit="cover"
              />
              <Text
                style={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  paddingHorizontal: 8,
                  fontSize: 10,
                  fontFamily: "PlayfairDisplay_Regular",
                  color: Colorizer("#0C0C0C", 1.0),
                  backgroundColor: Colorizer(image.primary, 1.0),
                  borderRadius: 12
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
/* ============================================================================================ */
/* ============================================================================================ */
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
        Animated.sequence([Animated.timing(fadeAnim, { toValue: 0.4, duration: 500, useNativeDriver: true }), Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true })]),
        Animated.sequence([Animated.timing(scaleAnim, { toValue: 0.95, duration: 500, useNativeDriver: true }), Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true })])
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
    <View style={{ position: "relative", margin: 1, borderRadius: 12, overflow: "hidden", shadowColor: "#0C0C0C", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 3 }}>
      <Link
        href={{
          pathname: "/Shared",
          params: {
            data: JSON.stringify({
              environment_title: data.environment_title,
              selectedIndex: currentIndex,
              data: data.images
            })
          }
        }}
        asChild
      >
        <TouchableOpacity>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
            <View style={{ position: "relative", width: "100%", aspectRatio: 9 / 16, overflow: "hidden" }}>
              <Animated.Image source={{ uri: currentImage }} style={{ width: "100%", height: "100%" }} onLoadStart={() => setLoading(true)} onLoad={() => setLoading(false)} />
              {loading && (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: Colorizer("#0C0C0C", 0.2) }]} className="flex items-center justify-center">
                  <ActivityIndicator size="large" color={Colorizer("#FFFFFF", 1.0)} />
                </View>
              )}
              <View
                style={{
                  top: 8,
                  left: 8,
                  borderRadius: 8,
                  paddingVertical: 4,
                  position: "absolute",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 6,
                  backgroundColor: Colorizer("#0C0C0C", 0.8)
                }}
              >
                <MaterialCommunityIcons name="movie-filter" size={16} color={Colorizer("#25BE8B", 1.0)} style={{ marginRight: 4 }} />
                <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "500" }}>Freemium (watch 1 Ad)</Text>
              </View>
              <View style={{ position: "absolute", bottom: -2, left: 0, right: 0 }}>
                <View style={[StyleSheet.absoluteFill, { backgroundColor: Colorizer(data.images[currentIndex].primary, 1.0) }]} />
                <View style={{ padding: 4, margin: 4 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 14,
                        marginRight: 8,
                        fontWeight: "600",
                        fontFamily: "System",
                        color: Colorizer("#FFFFFF", 1.0)
                      }}
                    >
                      {data.images[currentIndex].original_file_name.replace(/_/g, " ").replace(".jpg", "")}
                    </Text>
                    <View style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Text style={{ color: Colorizer("#FFFFFF", 1.0), fontSize: 10 }}>{data.images[currentIndex].primary}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
          <View style={{ position: "absolute", top: "40%", right: 8, padding: 4, transform: [{ translateY: -60 }], borderRadius: 8 }}>
            <View style={[StyleSheet.absoluteFillObject, { borderRadius: 8, overflow: "hidden", backgroundColor: Colorizer("#0C0C0C", 0.9) }]} />
            {data.images.slice(0, 3).map((img, idx) => (
              <TouchableOpacity key={idx} onPress={() => animateTransition(idx)} style={{ marginBottom: idx < 2 ? 2 : 0 }}>
                <Image
                  source={{ uri: img.previewLink }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 8,
                    opacity: currentIndex === idx ? 1 : 0.8,
                    borderColor: Colorizer("#FFFFFF", 1.0),
                    borderWidth: currentIndex === idx ? 2 : 0
                  }}
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
/* ============================================================================================ */
/* ============================================================================================ */
/* ============================================================================================ */
/* ============================================================================================ */
interface CategoryButtonExtendedProps extends CategoryButtonProps {
  selected: boolean;
  onPress: () => void;
  rawCategoriesArray: Category[];
}
const CategoryButton: FC<CategoryButtonExtendedProps> = memo(({ category, selected, onPress, rawCategoriesArray }) => {
  const [currentImage, setCurrentImage] = useState<string>("");
  const updateShuffleImage = useCallback(() => {
    if (category === "Categories") {
      const allImages: string[] = [];
      rawCategoriesArray.forEach((cat: Category) => {
        if (cat.name === "Everything") return;
        cat.subcategories
          .filter((s: string) => s !== "Everything")
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
    <TouchableOpacity onPress={() => onPress()} style={{ flex: 1, height: 45, margin: 2, borderRadius: 8, overflow: "hidden" }}>
      <View style={{ borderRadius: 8, overflow: "hidden", width: "100%", height: "100%" }}>
        <Image source={category === "Everything" ? require("@/assets/images/Shuffle.gif") : { uri: currentImage }} style={{ width: "100%", height: "100%", borderRadius: 8 }} contentFit="cover" />
        <LinearGradient colors={["transparent", Colorizer("#0C0C0C", 0.6), Colorizer("#0C0C0C", 0.8)]} style={{ position: "absolute", width: "100%", height: "100%", borderRadius: 8 }} />
        <View
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 8,
            position: "absolute",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center"
          }}
        >
          <MaterialCommunityIcons name={category === "Categories" ? "image-filter-vintage" : "dice-multiple"} size={15} color={Colorizer("#FFFFFF", 1.0)} style={{ marginRight: 4 }} />
          <Text style={{ fontFamily: "PlayfairDisplay_Regular", color: Colorizer("#FFFFFF", 1.0), fontSize: 15, textAlign: "center" }}>{category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});
CategoryButton.displayName = "CategoryButton";
/* ============================================================================================ */
/* ============================================================================================ */
const HeaderComponent: FC<HeaderComponentProps> = memo(({ selectedCategory, onSelectCategory, onSearch, rawCategoriesArray }) => {
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
      <View style={{ marginHorizontal: -8 }}>
        <HAnimated />
      </View>
      <View style={{ marginTop: 30, paddingRight: 6, paddingLeft: 6, paddingBottom: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Animated.View style={leftIconStyle}>
            <FontAwesome5 name="caret-left" size={24} color={Colorizer("#FFFFFF", 1.0)} />
          </Animated.View>
          <Text style={{ fontFamily: "PlayfairDisplay_Black", fontSize: 20, color: Colorizer("#FFFFFF", 1.0), textAlign: "center", marginHorizontal: 10 }}>Explore AI Generated Wallpapers</Text>
          <Animated.View style={rightIconStyle}>
            <FontAwesome5 name="caret-right" size={24} color={Colorizer("#FFFFFF", 1.0)} />
          </Animated.View>
        </View>
        <SearchBar onSearch={onSearch} />
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <CategoryButton category="Everything" selected={selectedCategory === "Everything"} onPress={() => onSelectCategory("Everything")} rawCategoriesArray={rawCategoriesArray} />
          <CategoryButton category="Categories" selected={false} onPress={() => setModalVisible(true)} rawCategoriesArray={rawCategoriesArray} />
        </View>
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
/* ============================================================================================ */
/* ============================================================================================ */
const EnvironmentItem: FC<{ item: EnvironmentEntry }> = memo(({ item }) => (
  <View style={{ flex: 1, margin: 1 }}>
    <Card data={item} />
  </View>
));
EnvironmentItem.displayName = "EnvironmentItem";
/* ============================================================================================ */
/* ============================================================================================ */
function generateCategories(apiData: Record<string, any>) {
  let shuffleDB: Record<string, EnvironmentEntry> = {};
  const categoriesArray: Category[] = [{ name: "Everything", subcategories: [], database: {} }];

  Object.keys(apiData).forEach((parent) => {
    const subObj = apiData[parent];
    const subCategories = Object.keys(subObj);
    const db: Partial<Record<string, Record<string, EnvironmentEntry>>> = {};

    subCategories.forEach((subKey) => {
      const environmentEntries = subObj[subKey];
      shuffleDB = { ...shuffleDB, ...environmentEntries };
      db[subKey] = environmentEntries;
    });

    categoriesArray.push({
      name: parent,
      subcategories: [...subCategories, "Everything"],
      database: db
    });
  });

  return { categoriesArray, shuffleDB };
}
/* ============================================================================================ */
/* ============================================================================================ */
export default function HomePage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredData, setFilteredData] = useState<EnvironmentEntry[]>([]);
  const [selectedParent, setSelectedParent] = useState<ParentKey | "Everything">("Everything");
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [rawCategoriesArray, setRawCategoriesArray] = useState<Category[]>([]);
  const [shuffleDB, setShuffleDB] = useState<Record<string, EnvironmentEntry>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const apiData = await fetchAllData();
        const { categoriesArray, shuffleDB: newShuffleDB } = generateCategories(apiData);
        setRawCategoriesArray(categoriesArray);
        setShuffleDB(newShuffleDB);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const getAllCombinedData = useCallback(() => Object.values(shuffleDB), [shuffleDB]);

  const processImageUrls = useCallback((entry: EnvironmentEntry): EnvironmentEntry => {
    return {
      ...entry,
      images: entry.images.map((image: ImageMetadata) => ({
        ...image,
        previewLink: createPreviewLink(image),
        downloadLink: createDownloadLink(image)
      }))
    };
  }, []);

  const fetchData = useCallback(() => {
    if (selectedParent === "Everything") {
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
        .filter((s) => s !== "Everything")
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

    if (selectedChild === "Everything") {
      const combinedEntries: EnvironmentEntry[] = [];
      catObj.subcategories
        .filter((sub) => sub !== "Everything")
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

  const onSelectCategory = useCallback((parent: ParentKey | "Everything", child?: string) => {
    if (parent === "Everything") {
      setSelectedParent("Everything");
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
          <Text style={{ fontFamily: "PlayfairDisplay_Regular", color: Colorizer("#FFFFFF", 0.8), fontSize: 16, textAlign: "center" }}>No images found matching "{searchQuery}".</Text>
          <Text style={{ fontFamily: "PlayfairDisplay_Regular", color: Colorizer("#FFFFFF", 0.8), fontSize: 16, textAlign: "center" }}>You may request images from "Account" Section.</Text>
        </View>
      );
    }
    return null;
  }, [searchQuery]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colorizer("#0C0C0C", 1.0) }}>
        <ActivityIndicator size="large" color={Colorizer("#FFFFFF", 1.0)} />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: Colorizer("#0C0C0C", 1.0), flex: 1, position: "relative" }}>
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
        ListHeaderComponent={<HeaderComponent selectedCategory={selectedParent} onSelectCategory={onSelectCategory} onSearch={handleSearch} rawCategoriesArray={rawCategoriesArray} />}
      />
    </View>
  );
}
