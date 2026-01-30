import { BottomSheetModal as ReusableBottomSheetModal } from "@/4-shared/components/bottom-sheet/ui/BottomSheetModal";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useCollections } from "@/4-shared/context/collections/CollectionsContext";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
import { styles } from "./CreateCollectionSheet.styles";

export type CreateCollectionSheetRef = {
  open: () => void;
  close: () => void;
  snapToIndex?: (index: number) => void;
  expand?: () => void;
};

type Props = {
  onCreated?: (createdId?: string) => void;
  debug?: boolean;
};

const CreateCollectionSheet = forwardRef<CreateCollectionSheetRef, Props>(
  ({ onCreated }, ref) => {
    const { user } = useAuthSession();
    const { createCollection } = useCollections();
    const { theme } = useTheme();
    const sheetRef = useRef<any>(null);

    // small dev-only visual debug style to help detect if the sheet is rendered
    const debugSheetStyle = __DEV__
      ? { backgroundColor: "rgba(255,0,0,0.03)" }
      : {};

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => {
        console.log(
          "CreateCollectionSheet [useImperativeHandle > open]",
          sheetRef.current,
        );
        try {
          sheetRef.current?.present();
        } catch (e) {
          console.warn("CreateCollectionSheet.present() threw:", e);
        }
        // small delay then try to snap/expand as a fallback for visibility
        setTimeout(() => {
          try {
            console.log(
              "CreateCollectionSheet: attempting snapToIndex/expand fallback",
              sheetRef.current,
            );
            sheetRef.current?.snapToIndex?.(0);
            sheetRef.current?.expand?.();
          } catch (err) {
            console.warn("CreateCollectionSheet fallback failed:", err);
          }
        }, 120);
      },
      close: () => {
        sheetRef.current?.dismiss();
      },
      snapToIndex: (index: number) => {
        try {
          sheetRef.current?.snapToIndex?.(index);
        } catch (e) {
          console.warn("CreateCollectionSheet.snapToIndex failed:", e);
        }
      },
      expand: () => {
        try {
          sheetRef.current?.expand?.();
        } catch (e) {
          console.warn("CreateCollectionSheet.expand failed:", e);
        }
      },
    }));

    const handleCreate = async () => {
      if (!user?.id) {
        // Context already does error toast, but safe to double-check
        return;
      }
      setLoading(true);
      const created = await createCollection({ name, description });
      setLoading(false);
      if (created) {
        setName("");
        setDescription("");
        if (onCreated) onCreated(created.id); // pass back created id if needed
      }
    };

    return (
      <ReusableBottomSheetModal
        ref={sheetRef}
        snapPoints={["90%"]}
        enablePanDownToClose
        index={0}
        onDismiss={() => {
          setName("");
          setDescription("");
        }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <BottomSheetView
          style={[
            styles.sheet,
            debugSheetStyle,
            {
              paddingBottom: Platform.OS === "android" ? 64 : 0,
            },
          ]}
        >
          <ThemedText type="subtitle" style={{ marginBottom: 8 }}>
            Create New Collection
          </ThemedText>
          <BottomSheetTextInput
            placeholder="Collection name"
            value={name}
            onChangeText={setName}
            editable={!loading}
            returnKeyType="next"
            style={{
              marginBottom: 10,
              padding: 12,
              borderRadius: 8,
              backgroundColor: theme.inputBackgroundColor,
              color: theme.inputTextColor,
              borderWidth: 1,
              borderColor: theme.inputBorderColor,
              fontSize: 16,
              fontFamily: theme.fontFamily,
            }}
            placeholderTextColor={theme.inputPlaceholderColor}
          />
          <BottomSheetTextInput
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            editable={!loading}
            multiline
            maxLength={150}
            style={{
              marginBottom: 10,
              padding: 12,
              borderRadius: 8,
              backgroundColor: theme.inputBackgroundColor,
              color: theme.inputTextColor,
              borderWidth: 1,
              borderColor: theme.inputBorderColor,
              fontSize: 16,
              fontFamily: theme.fontFamily,
            }}
            placeholderTextColor={theme.inputPlaceholderColor}
          />
          <ThemedView style={styles.editActions}>
            <PrimaryButton
              title={loading ? "Creating..." : "Create"}
              onPress={handleCreate}
              disabled={loading}
              style={{
                flex: 1,
              }}
            />
            <SecondaryButton
              title="Cancel"
              onPress={() => sheetRef.current?.dismiss()}
              disabled={loading}
              style={{
                flex: 1,
              }}
            />
          </ThemedView>
        </BottomSheetView>
      </ReusableBottomSheetModal>
    );
  },
);

export default CreateCollectionSheet;
