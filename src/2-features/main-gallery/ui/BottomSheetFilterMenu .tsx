import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useRef } from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useGalleryFilters } from "../filters/useGalleryFilters";
import { styles } from "./BottomSheetFilterMenu.styles";

type BottomSheetFilterMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const BottomSheetFilterMenu: React.FC<BottomSheetFilterMenuProps> = ({
  isOpen,
  onClose,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { filters, setFilters, resetFilters } = useGalleryFilters();

  // snapPoints define sheet height (can adjust for your app)
  const snapPoints = Platform.OS === "web" ? ["40%"] : ["60%"];

  // Handle sheet close
  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
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
    <>
      <Text>BottomSheetFilterMenu MOUNTED</Text>
      <BottomSheet
        ref={bottomSheetRef}
        index={isOpen ? 0 : -1}
        snapPoints={["50%", "90%"]}
        enablePanDownToClose
        onClose={handleClose}
        // style={styles.sheet}
        // backgroundStyle={styles.sheetBackground}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Gallery Filters</Text>
          {/* Gender Filter */}
          <Text style={styles.label}>Gender</Text>
          <View style={styles.row}>
            {["male", "female", "mixed"].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.option,
                  filters.gender === opt && styles.optionActive,
                ]}
                onPress={() => handleChange("gender", opt)}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Orientation Filter */}
          <Text style={styles.label}>Orientation</Text>
          <View style={styles.row}>
            {["portrait", "landscape", "square"].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.option,
                  filters.orientation === opt && styles.optionActive,
                ]}
                onPress={() => handleChange("orientation", opt)}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Color Filter */}
          <Text style={styles.label}>Color</Text>
          <View style={styles.row}>
            {["color", "black-white"].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.option,
                  filters.color === opt && styles.optionActive,
                ]}
                onPress={() => handleChange("color", opt)}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Print Quality Filter */}
          <Text style={styles.label}>Print Quality</Text>
          <View style={styles.row}>
            {["high", "medium", "low"].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.option,
                  filters.print_quality === opt && styles.optionActive,
                ]}
                onPress={() => handleChange("print_quality", opt)}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Year Range Filter */}
          <Text style={styles.label}>Year Range</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={filters.year?.from?.toString() ?? ""}
              placeholder="From"
              onChangeText={(v) => handleYearRangeChange("from", v)}
            />
            <Text style={{ marginHorizontal: 8 }}>–</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={filters.year?.to?.toString() ?? ""}
              placeholder="To"
              onChangeText={(v) => handleYearRangeChange("to", v)}
            />
          </View>
          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </>
  );
};
