import { BottomSheetModal as ReusableBottomSheetModal } from "@/4-shared/components/bottom-sheet/ui/BottomSheetModal";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./BottomSheetFilterMenu.styles";

import AgeGateModal from "@/4-shared/components/age-gate/AgeGateModal";
import { logEvent } from "@/4-shared/firebase";
import useNudityConsent from "@/4-shared/hooks/use-nudity-consent";
import { BottomSheetFilterMenuProps } from "@/4-shared/types";

interface Props extends BottomSheetFilterMenuProps {
  /**
   * When false, the photographer search / author chips are hidden.
   * Default: true (show the author filter — used on the main gallery).
   */
  showAuthorFilter?: boolean;
}

export const BottomSheetFilterMenu: React.FC<Props> = ({
  isOpen,
  filters,
  setFilters,
  resetFilters,
  onClose,
  photographerNames,
  showAuthorFilter = true,
}) => {
  const bottomSheetModalRef = useRef<any>(null);
  const { theme } = useTheme();
  const snapPoints = Platform.OS === "android" ? ["80%"] : ["60%"];
  const [photographerSearch, setPhotographerSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isOpen]);

  const filteredPhotographers = useMemo(() => {
    const query = photographerSearch.trim().toLowerCase();
    if (!query) return []; // show nothing until user types
    return (photographerNames ?? []).filter((name) =>
      name.toLowerCase().includes(query)
    );
  }, [photographerNames, photographerSearch]);

  // Toggle photographer selection in filters.author[]
  const toggleAuthor = (name: string) => {
    const current = filters.author ?? [];
    if (current.includes(name)) {
      setFilters({ ...filters, author: current.filter((a) => a !== name) });
    } else {
      setFilters({ ...filters, author: [...current, name] });
    }
  };

  // Clear button resets photographer selection
  const clearAuthors = () => {
    setFilters({ ...filters, author: [] });
    setPhotographerSearch("");
  };

  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    onClose();
  }, [onClose]);

  const handleChange = (key: keyof typeof filters, value: any) => {
    setFilters({
      ...filters,
      [key]: filters[key] === value ? undefined : value,
    });
  };

  const handleYearRangeChange = (field: "from" | "to", value: string) => {
    const year = filters.year ?? { from: 0, to: 0 };
    const yearValue = {
      ...year,
      [field]: value === "" ? 0 : Number(value),
    };
    setFilters({
      ...filters,
      year: { from: yearValue.from, to: yearValue.to },
    });
  };

  const handleTextChange = (value: string) => {
    setFilters({ ...filters, text: value });
  };

  const handleClearText = () => {
    setFilters({ ...filters, text: "" });
  };

  // Nudity current value default to "not-nude"
  const currentNudity = (filters as any).nudity ?? "not-nude";

  // Age-gate state
  const [ageGateVisible, setAgeGateVisible] = useState(false);
  const [pendingNudityValue, setPendingNudityValue] = useState<string | null>(
    null
  );

  const { hasConsent, confirmConsent } = useNudityConsent();

  // New handler for nudity option selection
  const handleNuditySelection = async (value: string) => {
    // If selecting the hide option, apply immediately
    if (value === "not-nude") {
      handleChange("nudity", value);
      logEvent("nudity_selection", { value });
      return;
    }

    // For 'nude' or 'all', check consent
    try {
      const consent = await hasConsent();
      if (consent) {
        handleChange("nudity", value);
        logEvent("nudity_opt_in", { method: "existing_consent", value });
      } else {
        // show age gate modal and store pending value
        setPendingNudityValue(value);
        setAgeGateVisible(true);
        logEvent("nudity_agegate_shown", { origin: "filters_menu" });
      }
    } catch (e) {
      // fallback: show age gate
      setPendingNudityValue(value);
      setAgeGateVisible(true);
      logEvent("nudity_agegate_shown", {
        origin: "filters_menu",
        error: String(e),
      });
    }
  };

  const handleAgeGateConfirm = async (payload: { confirmedAt: string }) => {
    setAgeGateVisible(false);
    if (!pendingNudityValue) return;
    try {
      await confirmConsent(payload);
      handleChange("nudity", pendingNudityValue);
      logEvent("nudity_opt_in", {
        method: "age_gate",
        value: pendingNudityValue,
      });
    } catch (e) {
      console.warn("Failed to persist nudity consent:", e);
    } finally {
      setPendingNudityValue(null);
    }
  };

  const handleAgeGateCancel = () => {
    setAgeGateVisible(false);
    setPendingNudityValue(null);
    logEvent("nudity_opt_out", { origin: "filters_menu" });
  };

  // Photographer names helper (existing)
  const photographerNamesList = useMemo(() => {
    const set = new Set<string>();
    photographerNames?.forEach((n) => set.add(n));
    return Array.from(set).sort();
  }, [photographerNames]);

  return (
    <>
      <ReusableBottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onDismiss={handleClose}
        handleIndicatorStyle={{
          backgroundColor: theme.buttonBorderColor,
          height: 4,
          borderRadius: 4,
          width: 32,
        }}
        enablePanDownToClose
      >
        <BottomSheetScrollView contentContainerStyle={styles.container}>
          <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
            <View style={{ flex: 1 }}>
              <ThemedText type="title" style={styles.title}>
                Gallery Filters
              </ThemedText>

              {/* Text search */}
              <ThemedText type="subtitle" style={styles.label}>
                Search by keywords
              </ThemedText>
              <View style={styles.textSearchContainer}>
                <BottomSheetTextInput
                  style={styles.input}
                  value={filters.text ?? ""}
                  placeholder="Type to search images..."
                  onChangeText={handleTextChange}
                  placeholderTextColor={theme.inputPlaceholderColor}
                  returnKeyType="search"
                  autoCorrect={false}
                  autoCapitalize="none"
                />
                {filters.text ? (
                  <Pressable
                    onPress={handleClearText}
                    style={styles.clearButton}
                  >
                    <ThemedText style={styles.clearButtonText}>✕</ThemedText>
                  </Pressable>
                ) : null}
              </View>

              {/* Photographer search & chips (keeps existing behavior) */}
              {showAuthorFilter && (
                <>
                  <ThemedText type="subtitle" style={styles.label}>
                    Search by photographer
                  </ThemedText>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <BottomSheetTextInput
                      style={[styles.input, { flex: 1 }]}
                      value={photographerSearch}
                      onChangeText={setPhotographerSearch}
                      placeholder="Search photographer..."
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={clearAuthors}
                      style={styles.clearButton}
                    >
                      <ThemedText style={styles.clearButtonText}>
                        Clear
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.chipsRow}>
                    {filteredPhotographers.length === 0 ? (
                      <ThemedText style={styles.noResult}>
                        No results
                      </ThemedText>
                    ) : null}
                    {filteredPhotographers.map((name) => {
                      const selected = (filters.author ?? []).includes(name);
                      return (
                        <TouchableOpacity
                          key={name}
                          style={[styles.chip, selected && styles.chipSelected]}
                          onPress={() => toggleAuthor(name)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              selected && styles.chipTextSelected,
                            ]}
                          >
                            {name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              )}

              {/* Gender filter (unchanged) */}
              <ThemedText type="subtitle" style={styles.label}>
                Gender
              </ThemedText>
              <ThemedView style={styles.row}>
                {["male", "female", "mixed couples"].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.option,
                      filters.gender === opt && styles.optionActive,
                    ]}
                    onPress={() => handleChange("gender", opt)}
                  >
                    <ThemedText
                      style={filters.gender === opt && styles.optionActiveText}
                    >
                      {opt}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedView>

              {/* Nudity Filter (three-state) */}
              <ThemedText type="subtitle" style={styles.label}>
                Nudity
              </ThemedText>
              <ThemedView style={styles.row}>
                {[
                  { key: "not-nude", label: "Hide nudes (default)" },
                  { key: "nude", label: "Only nudes" },
                  { key: "all", label: "Include nudes" },
                ].map((opt) => (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      styles.option,
                      currentNudity === opt.key && styles.optionActive,
                    ]}
                    onPress={() => handleNuditySelection(opt.key)}
                  >
                    <ThemedText
                      style={
                        currentNudity === opt.key && styles.optionActiveText
                      }
                    >
                      {opt.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedView>

              {/* Orientation, Color, Print Quality, Year etc. (unchanged) */}
              <ThemedText type="subtitle" style={styles.label}>
                Orientation
              </ThemedText>
              <ThemedView style={styles.row}>
                {["vertical", "horizontal"].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.option,
                      filters.orientation === opt && styles.optionActive,
                    ]}
                    onPress={() => handleChange("orientation", opt)}
                  >
                    <ThemedText
                      style={
                        filters.orientation === opt && styles.optionActiveText
                      }
                    >
                      {opt}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedView>

              <ThemedText type="subtitle" style={styles.label}>
                Color
              </ThemedText>
              <ThemedView style={styles.row}>
                {["color", "bw"].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.option,
                      filters.color === opt && styles.optionActive,
                    ]}
                    onPress={() => handleChange("color", opt)}
                  >
                    <ThemedText
                      style={filters.color === opt && styles.optionActiveText}
                    >
                      {opt}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedView>

              <ThemedText type="subtitle" style={styles.label}>
                Print Quality
              </ThemedText>
              <ThemedView style={styles.row}>
                {["standard", "good", "excellent", "professional"].map(
                  (opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.option,
                        filters.print_quality === opt && styles.optionActive,
                      ]}
                      onPress={() => handleChange("print_quality", opt)}
                    >
                      <ThemedText
                        style={
                          filters.print_quality === opt &&
                          styles.optionActiveText
                        }
                      >
                        {opt}
                      </ThemedText>
                    </TouchableOpacity>
                  )
                )}
              </ThemedView>

              <ThemedText type="subtitle" style={styles.label}>
                Year Range
              </ThemedText>
              <ThemedView style={styles.row}>
                <BottomSheetTextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={filters.year?.from?.toString() ?? ""}
                  placeholder="From"
                  onChangeText={(v) => handleYearRangeChange("from", v)}
                  placeholderTextColor={theme.inputPlaceholderColor}
                  returnKeyType="done"
                />
                <ThemedText style={{ marginHorizontal: 8 }}>–</ThemedText>
                <BottomSheetTextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={filters.year?.to?.toString() ?? ""}
                  placeholder="To"
                  onChangeText={(v) => handleYearRangeChange("to", v)}
                  placeholderTextColor={theme.inputPlaceholderColor}
                  returnKeyType="done"
                />
              </ThemedView>

              {/* Actions */}
              <ThemedView style={styles.actionsRow}>
                <ThemedView style={{ flexDirection: "row" }}>
                  <PrimaryButton
                    title="Reset"
                    onPress={() => resetFilters()}
                    style={{
                      marginRight: 8,
                      paddingVertical: 2,
                      paddingHorizontal: 8,
                    }}
                  />
                  <SecondaryButton
                    title="Close"
                    onPress={handleClose}
                    style={{ paddingVertical: 2, paddingHorizontal: 8 }}
                  />
                </ThemedView>
              </ThemedView>
            </View>
          </SafeAreaView>
        </BottomSheetScrollView>
      </ReusableBottomSheetModal>

      <AgeGateModal
        visible={ageGateVisible}
        onConfirm={handleAgeGateConfirm}
        onCancel={handleAgeGateCancel}
      />
    </>
  );
};

export default BottomSheetFilterMenu;
