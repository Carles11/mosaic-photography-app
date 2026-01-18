import { DownloadOptionsPanel } from "@/4-shared/components/download-options/ui/DownloadOptionsPanel";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { logEvent } from "@/4-shared/firebase";
import { getAvailableDownloadOptionsForImage } from "@/4-shared/lib/getAvailableDownloadOptionsForImage";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { ZoomGalleryModalProps } from "@/4-shared/types/gallery";
import { downloadImageToDevice } from "@/4-shared/utility/downloadImage";
import {
  showErrorToast,
  showSuccessToast,
} from "@/4-shared/utility/toast/Toast";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Dimensions, Modal, Platform, TouchableOpacity } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { ZoomImage } from "./ImageZoom";
import { styles } from "./ZoomGalleryModal.styles";

const { width, height } = Dimensions.get("window");

export const ZoomGalleryModal: React.FC<ZoomGalleryModalProps> = ({
  images,
  visible,
  initialIndex = 0,
  onClose,
}) => {
  const carouselRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [showDownloadPanel, setShowDownloadPanel] = useState(false);

  const { theme } = useTheme();

  React.useEffect(() => {
    if (visible) setCurrentIndex(initialIndex);
  }, [visible, initialIndex]);

  const router = useRouter();
  const { user } = useAuthSession();

  if (!images.length) return null;

  // Get download options for current image
  const currentImage = images[currentIndex];
  const allOptions = getAvailableDownloadOptionsForImage(currentImage);
  const originalOption = allOptions.find((o) => o.isOriginal);
  const webpOptions = allOptions.filter(
    (o) => o.format === "webp" && !o.isOriginal,
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      hardwareAccelerated
      statusBarTranslucent
    >
      <ThemedView style={styles.modalBackground}>
        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          accessibilityLabel="Close"
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Download button */}
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => setShowDownloadPanel(true)}
          accessibilityLabel="Download image"
        >
          <Ionicons name="download-outline" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Index indicator */}
        <ThemedView style={styles.indexIndicator}>
          <ThemedText style={styles.indexText}>
            {currentIndex + 1} / {images.length}
          </ThemedText>
        </ThemedView>

        <Carousel
          ref={carouselRef}
          data={images}
          width={width}
          height={height}
          loop={false}
          enabled={true}
          style={{ flex: 1 }}
          pagingEnabled
          snapEnabled
          defaultIndex={initialIndex}
          onSnapToItem={setCurrentIndex}
          renderItem={({ item }) => (
            <ThemedView style={styles.imageWrapper}>
              <ZoomImage
                image={item}
                minScale={1}
                maxScale={5}
                doubleTapScale={3}
                style={{ width, height }}
                imageStyle={{ width, height }}
              />
            </ThemedView>
          )}
          windowSize={5}
        />

        {/* Download options panel as overlay */}
        {showDownloadPanel && (
          <DownloadOptionsPanel
            originalOption={originalOption}
            webpOptions={webpOptions}
            selectedImage={currentImage}
            onDownloadOption={async (option) => {
              if (Platform.OS === "ios" && option.format === "webp") {
                showErrorToast(
                  "Please choose the print option. WebP images can't be saved to Photos on iOS.",
                );
                onClose();
                return;
              }
              await downloadImageToDevice({
                option,
                selectedImage: currentImage,
                user,
                logEvent,
                showSuccessToast,
                showErrorToast,
                onRequireLogin: () => {
                  setShowDownloadPanel(false);
                  onClose();
                  router.push("/auth/login");
                },
                origin: "zoom-gallery",
              });
              setShowDownloadPanel(false);
              onClose();
            }}
            onClose={() => setShowDownloadPanel(false)}
            style={[
              styles.downloadOptionsPanel,
              { backgroundColor: theme.background },
            ]}
          />
        )}
      </ThemedView>
    </Modal>
  );
};
