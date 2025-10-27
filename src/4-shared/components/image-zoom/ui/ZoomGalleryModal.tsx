import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Dimensions, Modal, Text, TouchableOpacity, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { ZoomImage } from "./ImageZoom";
import { styles } from "./ZoomGalleryModal.styles";

const { width, height } = Dimensions.get("window");

type GalleryImage = {
  width?: number;
  filename: string;
  base_url: string;
  [key: string]: any; // allow extra fields (id, author, etc.)
};

type ZoomGalleryModalProps = {
  images: GalleryImage[];
  visible: boolean;
  initialIndex?: number;
  onClose: () => void;
};

export const ZoomGalleryModal: React.FC<ZoomGalleryModalProps> = ({
  images,
  visible,
  initialIndex = 0,
  onClose,
}) => {
  const carouselRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    if (visible) setCurrentIndex(initialIndex);
  }, [visible, initialIndex]);

  if (!images.length) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      hardwareAccelerated
      statusBarTranslucent
    >
      <View style={styles.modalBackground}>
        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          accessibilityLabel="Close"
        >
          <Ionicons name="close" size={32} color="#fff" />
        </TouchableOpacity>
        {/* Index indicator */}
        <View style={styles.indexIndicator}>
          <Text style={styles.indexText}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
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
            <View style={styles.imageWrapper}>
              <ZoomImage
                image={item}
                minScale={1}
                maxScale={5}
                doubleTapScale={3}
                style={{ width, height }}
                imageStyle={{ width, height }}
              />
            </View>
          )}
          windowSize={5}
        />
      </View>
    </Modal>
  );
};
