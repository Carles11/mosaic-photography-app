import { File, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";
import { DownloadImageProps } from "../types";

export async function downloadImageToDevice({
  option,
  selectedImage,
  user,
  logEvent,
  showSuccessToast,
  showErrorToast,
  onRequireLogin,
  origin,
}: DownloadImageProps) {
  if (!selectedImage) return;
  if (!user) {
    if (onRequireLogin) onRequireLogin();
    showErrorToast("Please log in to download images.");
    return;
  }

  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      showErrorToast("We need your permission to save files to your device.");
      return;
    }

    const fileName = option.url.split("/").pop() ?? "image.webp";
    const destinationFile = new File(Paths.document, fileName);
    const file = await File.downloadFileAsync(option.url, destinationFile);
    await MediaLibrary.saveToLibraryAsync(file.uri);

    const hint =
      Platform.OS === "android"
        ? "You’ll find the image in your Gallery app, usually in the Downloads or Pictures folder."
        : "You’ll find the image in your Photos app, in the Recents album.";
    showSuccessToast(`Image saved to your device!`, hint);

    if (logEvent) {
      logEvent("image_download", {
        imageId: selectedImage.id,
        option: option.folder,
        origin,
      });
    }
  } catch (error) {
    console.log("Error downloading image:", error);
    showErrorToast("Failed to download image.");
  }
}
