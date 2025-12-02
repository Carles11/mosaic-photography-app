import { PrimaryButton } from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { DownloadOption } from "@/4-shared/lib/getAvailableDownloadOptionsForImage";
import { GalleryImage } from "@/4-shared/types/gallery";
import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { styles } from "./DownloadOptionsPanel.styles";

type DownloadOptionsPanelProps = {
  originalOption?: DownloadOption | null;
  webpOptions: DownloadOption[];
  selectedImage: Pick<GalleryImage, "print_quality" | "width" | "height">;
  onDownloadOption: (option: DownloadOption) => void;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
};

export const DownloadOptionsPanel: React.FC<DownloadOptionsPanelProps> = ({
  originalOption,
  webpOptions,
  selectedImage,
  onDownloadOption,
  style,
  onClose,
}) => {
  return (
    <ThemedView style={[styles.panelContainer, style]}>
      {/* Close button in corner */}
      {onClose && (
        <Pressable
          onPress={onClose}
          style={{ alignSelf: "flex-end", marginBottom: 8 }}
          accessibilityLabel="Close"
        >
          <ThemedText
            type="defaultSemiBold"
            style={{ fontSize: 24, color: "#fff" }}
          >
            ×
          </ThemedText>
        </Pressable>
      )}
      {originalOption && (
        <ThemedView style={[styles.originalBlock]}>
          <ThemedView style={styles.originalTitleRow}>
            <ThemedText type="defaultSemiBold">Choose your option</ThemedText>
            <ThemedView style={styles.bestQualityBadge}>
              <ThemedText style={styles.bestQualityBadgeText}>
                QUALITY:{" "}
                {selectedImage.print_quality?.toUpperCase() ?? "UNKNOWN"}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedText style={styles.qualityLine}>
            Best available printing quality: ({selectedImage.width}px x{" "}
            {selectedImage.height}px)
          </ThemedText>

          <ThemedText style={styles.collectorsNote}>
            Limited-time free download • Official Mosaic collection
          </ThemedText>
          <PrimaryButton
            title={`Download For Print`}
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

      <ThemedView style={styles.webpBlock}>
        <ThemedView style={styles.webpTitleRow}>
          <ThemedText>Fast & Free (for digital use)</ThemedText>
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
    </ThemedView>
  );
};
