import { BottomSheetModal } from "@/4-shared/components/bottom-sheet/ui/BottomSheetModal";
import { DownloadOptionsPanel } from "@/4-shared/components/download-options/ui/DownloadOptionsPanel";
import { HrLine } from "@/4-shared/components/elements/horizontal-line-hr";
import { IconSymbol } from "@/4-shared/components/elements/icon-symbol";
import { ThemedText } from "@/4-shared/components/themed-text";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { BottomSheetThreeDotsMenuProps } from "@/4-shared/types";
import { showErrorToast } from "@/4-shared/utility/toast/Toast";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./BottomSheetThreeDotsMenu.styles";

function isRefObject<T>(ref: React.Ref<T>): ref is React.RefObject<T> {
  return !!ref && typeof ref !== "function";
}

export const BottomSheetThreeDotsMenu = forwardRef<
  any,
  BottomSheetThreeDotsMenuProps
>(
  (
    {
      onClose,
      selectedImage,
      onShare,
      downloadOptions = [],
      onDownloadOption,
      onReport,
      user,
      router,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);

    // Reset Download Options menu on sheet close!
    const handleDismiss = useCallback(() => {
      setShowDownloadOptions(false);
      onClose();
    }, [onClose]);

    // Unified handler for reporting images
    const handleReportPress = useCallback(() => {
      if (!user) {
        showErrorToast("Please log in to use this feature.");
        if (
          isRefObject(ref) &&
          ref.current &&
          typeof ref.current.dismiss === "function"
        ) {
          ref.current.dismiss();
        }
        setTimeout(() => {
          router?.push("/auth/login");
        }, 400);
      } else if (onReport) {
        onReport();
        if (
          isRefObject(ref) &&
          ref.current &&
          typeof ref.current.dismiss === "function"
        ) {
          ref.current.dismiss();
        }
      }
    }, [user, onReport, ref, router]);

    const originalOption = downloadOptions.find((opt) => opt.isOriginal);
    const webpOptions = downloadOptions.filter((opt) => !opt.isOriginal);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["70%"]}
        onDismiss={handleDismiss}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.sheetView}>
          <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
            {selectedImage && (
              <>
                <ThemedText style={styles.author}>
                  {selectedImage.author}, {selectedImage.year}
                </ThemedText>
                <ThemedText style={styles.description}>
                  {selectedImage.description}
                </ThemedText>
                <HrLine />
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
                  <DownloadOptionsPanel
                    originalOption={originalOption}
                    webpOptions={webpOptions}
                    selectedImage={selectedImage}
                    onDownloadOption={onDownloadOption ?? (() => {})}
                  />
                )}
                <HrLine />
                <ActionRow
                  icon="flag"
                  label="Report this image"
                  color={theme?.error ?? "#E74C3C"}
                  onPress={handleReportPress}
                  textColor={theme.favoriteIcon}
                  accessibilityLabel="Report image"
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
  accessibilityLabel?: string;
};

const ActionRow: React.FC<ActionRowProps> = ({
  icon,
  label,
  color,
  onPress,
  textColor,
  accessibilityLabel,
}) => (
  <>
    <HrLine />
    <SafeAreaView
      style={[styles.actionRow]}
      edges={[]}
      onTouchEnd={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
    >
      <IconSymbol type="material" name={icon} size={17} color={color} />
      <ThemedText style={{ color: textColor, marginLeft: 5 }}>
        {label}
      </ThemedText>
    </SafeAreaView>
  </>
);
