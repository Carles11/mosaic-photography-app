import { PrimaryButton } from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { DownloadOption } from "@/4-shared/lib/getAvailableDownloadOptionsForImage";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types/gallery";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { styles } from "./DownloadOptionsPanel.styles";

type DownloadOptionsPanelProps = {
  originalOption?: DownloadOption | null;
  webpOptions: DownloadOption[];
  selectedImage: Pick<GalleryImage, "print_quality" | "width" | "height">;
  onDownloadOption: (option: DownloadOption) => void;
  style?: StyleProp<ViewStyle>;
};

export const DownloadOptionsPanel: React.FC<DownloadOptionsPanelProps> = ({
  originalOption,
  webpOptions,
  selectedImage,
  onDownloadOption,
  style,
}) => {
  const { theme, mode } = useTheme();
  console.log("DownloadOptionsPanel render with mode:", mode);

  return (
    <ThemedView style={[styles.panelContainer, style]}>
      {originalOption && (
        <ThemedView style={[styles.originalBlock]}>
          <ThemedView style={styles.originalTitleRow}>
            <ThemedText
              type="defaultSemiBold"
              style={{ backgroundColor: theme.background }}
            >
              Original Masterpiece
            </ThemedText>
            <ThemedView style={styles.bestQualityBadge}>
              <ThemedText style={styles.bestQualityBadgeText}>
                BEST QUALITY
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedText style={styles.qualityLine}>
            Best available printing quality:{" "}
            {selectedImage.print_quality?.toUpperCase() ?? "UNKNOWN"} (
            {selectedImage.width}px x {selectedImage.height}px)
          </ThemedText>

          <ThemedText style={styles.collectorsNote}>
            Limited-time free download • Official Mosaic collection
          </ThemedText>
          <PrimaryButton
            title={`Download Original`}
            onPress={() => onDownloadOption(originalOption)}
            style={styles.downloadOriginalButton}
            textStyles={styles.downloadOriginalButtonText}
            iconLeft={{
              name: "star",
              type: "material",
              color: "#633",
              size: 20,
            }}
          />
        </ThemedView>
      )}

      <ThemedView
        style={[styles.webpBlock, { backgroundColor: theme.background }]}
      >
        <ThemedView style={styles.webpTitleRow}>
          <ThemedText>Fast & Free (for Devices)</ThemedText>
          <ThemedView style={styles.webpBadge}>
            <ThemedText style={styles.webpBadgeText}>WEBP</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedText style={styles.webpDesc}>
          Optimized for sharing, screens, & lightning-fast download.
        </ThemedText>
        <ThemedView style={styles.downloadOptionRow}>
          {webpOptions.map((option) => (
            <PrimaryButton
              key={option.url}
              title={`${option.width}px`}
              onPress={() => onDownloadOption(option)}
              style={styles.downloadWebpButton}
              textStyles={styles.downloadWebpButtonText}
              iconLeft={{
                name: "cloud-download",
                type: "material",
                color: "#fff",
                size: 20,
              }}
            />
          ))}
        </ThemedView>
      </ThemedView>
      <ThemedText style={styles.customRequestText}>
        Need another size or custom use? Contact us for special requests!
      </ThemedText>
    </ThemedView>
  );
};
