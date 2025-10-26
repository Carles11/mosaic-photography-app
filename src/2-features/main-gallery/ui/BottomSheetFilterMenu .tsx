import { BottomSheetModal as ReusableBottomSheetModal } from "@/4-shared/components/bottom-sheet/ui/BottomSheetModal";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryFilter } from "@/4-shared/types";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef } from "react";
import { Platform, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./BottomSheetFilterMenu.styles";

type BottomSheetFilterMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  filters: GalleryFilter;
  setFilters: (filters: GalleryFilter) => void;
  resetFilters: () => void;
};

export const BottomSheetFilterMenu: React.FC<BottomSheetFilterMenuProps> = ({
  isOpen,
  filters,
  setFilters,
  resetFilters,
  onClose,
}) => {
  const bottomSheetModalRef = useRef<any>(null);
  const { theme } = useTheme();
  // snapPoints define sheet height (can adjust for your app)
  const snapPoints = Platform.OS === "web" ? ["40%"] : ["60%"];

  // Present/dismiss modal as controlled by parent
  useEffect(() => {
    if (isOpen) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isOpen]);

  // Handle sheet close
  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    onClose();
  }, [onClose]);

  // Filter change helpers
  const handleChange = (key: keyof typeof filters, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  // Year filter: Range picker via basic TextInputs (customize as needed)
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

  return (
    <ReusableBottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={handleClose}
      style={[
        styles.sheet,
        { borderWidth: 1, borderColor: theme.buttonBorderColor },
      ]}
      backgroundStyle={{ backgroundColor: theme.background }}
      handleIndicatorStyle={{
        backgroundColor: theme.buttonBorderColor,
        height: 4,
        borderRadius: 4,
        width: 32,
      }}
    >
      <BottomSheetView style={styles.container}>
        <SafeAreaView
          edges={["bottom"]}
          style={{
            flex: 1,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <ThemedText
            type="title"
            style={[styles.title, { color: theme.text }]}
          >
            Gallery Filters
          </ThemedText>
          {/* Gender Filter */}
          <ThemedText
            type="subtitle"
            style={[styles.label, { color: theme.text }]}
          >
            Gender
          </ThemedText>
          <ThemedView
            style={[styles.row, { backgroundColor: theme.background }]}
          >
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
                  style={[
                    styles.optionText,
                    { color: theme.text },
                    filters.gender === opt && styles.optionActiveText,
                  ]}
                >
                  {opt}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
          {/* Orientation Filter */}
          <ThemedText
            type="subtitle"
            style={[styles.label, { color: theme.text }]}
          >
            Orientation
          </ThemedText>
          <ThemedView
            style={[styles.row, { backgroundColor: theme.background }]}
          >
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
                  style={[
                    styles.optionText,
                    { color: theme.text },
                    filters.orientation === opt && styles.optionActiveText,
                  ]}
                >
                  {opt}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
          {/* Color Filter */}
          <ThemedText
            type="subtitle"
            style={[styles.label, { color: theme.text }]}
          >
            Color
          </ThemedText>
          <ThemedView
            style={[styles.row, { backgroundColor: theme.background }]}
          >
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
                  style={[
                    styles.optionText,
                    { color: theme.text },
                    filters.color === opt && styles.optionActiveText,
                  ]}
                >
                  {opt}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
          {/* Print Quality Filter */}
          <ThemedText
            type="subtitle"
            style={[styles.label, { color: theme.text }]}
          >
            Print Quality
          </ThemedText>
          <ThemedView
            style={[styles.row, { backgroundColor: theme.background }]}
          >
            {["standard", "good", "excellent", "professional"].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.option,

                  filters.print_quality === opt && styles.optionActive,
                ]}
                onPress={() => handleChange("print_quality", opt)}
              >
                <ThemedText
                  style={[
                    styles.optionText,
                    { color: theme.text },
                    filters.print_quality === opt && styles.optionActiveText,
                  ]}
                >
                  {opt}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
          {/* Year Range Filter */}
          <ThemedText
            type="subtitle"
            style={[styles.label, { color: theme.text }]}
          >
            Year Range
          </ThemedText>
          <ThemedView
            style={[styles.row, { backgroundColor: theme.background }]}
          >
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={filters.year?.from?.toString() ?? ""}
              placeholder="From"
              onChangeText={(v) => handleYearRangeChange("from", v)}
            />
            <ThemedText style={{ marginHorizontal: 8 }}>–</ThemedText>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={filters.year?.to?.toString() ?? ""}
              placeholder="To"
              onChangeText={(v) => handleYearRangeChange("to", v)}
            />
          </ThemedView>
          {/* Actions */}
          <ThemedView
            style={[styles.actionsRow, { backgroundColor: theme.background }]}
          >
            <ThemedView
              style={{
                flexDirection: "row",
                backgroundColor: theme.background,
              }}
            >
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
                style={{
                  paddingVertical: 2,
                  paddingHorizontal: 8,
                }}
              />
            </ThemedView>
          </ThemedView>
        </SafeAreaView>
      </BottomSheetView>
    </ReusableBottomSheetModal>
  );
};
