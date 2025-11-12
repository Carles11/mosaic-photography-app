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
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Platform, ScrollView } from "react-native";
import { styles } from "./CreateCollectionSheet.styles";

export type CreateCollectionSheetRef = {
  open: () => void;
  close: () => void;
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

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => {
        sheetRef.current?.present();
      },
      close: () => {
        sheetRef.current?.dismiss();
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
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.sheet,
            {
              paddingBottom: Platform.OS === "android" ? 64 : 0,
            },
          ]}
          showsVerticalScrollIndicator={false}
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
        </ScrollView>
      </ReusableBottomSheetModal>
    );
  }
);

export default CreateCollectionSheet;
