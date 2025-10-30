import { BottomSheetModal } from "@/4-shared/components/bottom-sheet/ui/BottomSheetModal";
import { HrLine } from "@/4-shared/components/elements/horizontal-line-hr";
import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { ThemedText } from "@/4-shared/components/themed-text";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { GalleryImage } from "@/4-shared/types/gallery";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";
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
    },
    ref
  ) => {
    const { theme } = useTheme();

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["40%"]}
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
                <ActionRow
                  icon="download"
                  label="Download image"
                  color={theme.icon}
                  onPress={onDownload}
                  textColor={theme.text}
                />
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
