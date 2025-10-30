import { BottomSheetModal } from "@/4-shared/components/bottom-sheet/ui/BottomSheetModal";
import { OnlyTextButton } from "@/4-shared/components/buttons/variants";
import { HrLine } from "@/4-shared/components/elements/horizontal-line-hr";
import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { ThemedText } from "@/4-shared/components/themed-text";
import { DownloadOption } from "@/4-shared/lib/getAvailableDownloadOptionsForImage";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types/gallery";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./BottomSheetThreeDotsMenu.styles";

type BottomSheetThreeDotsMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedImage: GalleryImage | null;
  onAddToFavorites?: () => void;
  isFavorite?: (imageId: string | number) => void;
  onShare?: () => void;
  onDownload?: () => void;
  downloadOptions?: DownloadOption[];
  onDownloadOption?: (option: DownloadOption) => void;
};

export const BottomSheetThreeDotsMenu = forwardRef<
  any,
  BottomSheetThreeDotsMenuProps
>(
  (
    {
      isOpen,
      onClose,
      selectedImage,
      onAddToFavorites,
      isFavorite,
      onShare,
      onDownload,
      downloadOptions = [],
      onDownloadOption,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);

    // Separate original from webp options
    const originalOption = downloadOptions.find((opt) => opt.isOriginal);
    const webpOptions = downloadOptions.filter((opt) => !opt.isOriginal);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["70%"]}
        onDismiss={onClose}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.sheetView}>
          <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
            {selectedImage && (
              <>
                <ThemedText style={[styles.author, { color: theme.text }]}>
                  {selectedImage.author}, {selectedImage.year}
                </ThemedText>
                <ThemedText style={[styles.description, { color: theme.text }]}>
                  {selectedImage.description}
                </ThemedText>
                <HrLine />
                <ActionRow
                  icon="favorite-border"
                  label={
                    isFavorite ? "Remove from Favorites" : "Add to Favorites"
                  }
                  color={theme.favoriteIcon}
                  onPress={onAddToFavorites}
                  textColor={theme.text}
                />
                <ActionRow
                  icon="share"
                  label="Share this image"
                  color={theme.shareIcon}
                  onPress={onShare}
                  textColor={theme.text}
                />
                {/* Download options */}
                <ActionRow
                  icon="download"
                  label="Download options"
                  color={theme.icon}
                  onPress={() => setShowDownloadOptions((show) => !show)}
                  textColor={theme.text}
                />
                {showDownloadOptions && (
                  <View style={{ marginTop: 8, marginBottom: 8 }}>
                    {originalOption && (
                      <OnlyTextButton
                        title={`Original file (${selectedImage.width}px/${selectedImage.height}px)`}
                        onPress={() =>
                          onDownloadOption && onDownloadOption(originalOption)
                        }
                        style={{ marginBottom: 6 }}
                      />
                    )}
                    <ThemedText
                      style={[
                        styles.downloadOptionsTitle,
                        { color: theme.text },
                      ]}
                    >
                      Download resized versions in .webp format:
                    </ThemedText>
                    <View style={styles.downloadOptionRow}>
                      {webpOptions.map((option) => (
                        <OnlyTextButton
                          key={option.url}
                          title={`${option.width}px`}
                          onPress={() =>
                            onDownloadOption && onDownloadOption(option)
                          }
                          style={styles.downloadOptionButton}
                          textStyle={{
                            minWidth: 45,
                            maxWidth: 70,
                            paddingHorizontal: 0,
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        />
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}
          </SafeAreaView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

type ActionRowProps = {
  icon: string;
  label: string;
  color: string;
  onPress?: () => void;
  textColor: string;
};

const ActionRow: React.FC<ActionRowProps> = ({
  icon,
  label,
  color,
  onPress,
  textColor,
}) => (
  <React.Fragment>
    <HrLine />
    <SafeAreaView
      style={[styles.actionRow]}
      edges={[]}
      onTouchEnd={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <IconSymbol type="material" name={icon} size={17} color={color} />
      <ThemedText style={{ color: textColor }}>{label}</ThemedText>
    </SafeAreaView>
  </React.Fragment>
);
