import { BottomSheetModal as ReusableBottomSheetModal } from "@/4-shared/components/bottom-sheet/ui/BottomSheetModal";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef } from "react";
import { Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./BottomSheetFilterMenu.styles";

import { BottomSheetFilterMenuProps } from "@/4-shared/types";

export const BottomSheetFilterMenu: React.FC<BottomSheetFilterMenuProps> = ({
  isOpen,
  filters,
  setFilters,
  resetFilters,
  onClose,
}) => {
  const bottomSheetModalRef = useRef<any>(null);
  const { theme } = useTheme();
  const snapPoints = Platform.OS === "web" ? ["40%"] : ["60%"];

  useEffect(() => {
    if (isOpen) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    onClose();
  }, [onClose]);

  const handleChange = (key: keyof typeof filters, value: any) => {
    setFilters({ ...filters, [key]: value });
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
          <ThemedText type="title" style={styles.title}>
            Gallery Filters
          </ThemedText>
          {/* Gender Filter */}
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
          {/* Orientation Filter */}
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
                  style={filters.orientation === opt && styles.optionActiveText}
                >
                  {opt}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
          {/* Color Filter */}
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
          {/* Print Quality Filter */}
          <ThemedText type="subtitle" style={styles.label}>
            Print Quality
          </ThemedText>
          <ThemedView style={styles.row}>
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
                  style={
                    filters.print_quality === opt && styles.optionActiveText
                  }
                >
                  {opt}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
          {/* Year Range Filter */}
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
            <ThemedView
              style={{
                flexDirection: "row",
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
