import { supabase } from "@/4-shared/api/supabaseClient";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Platform, ScrollView, TextInput } from "react-native";
import { styles } from "./CreateCollectionSheet.styles";

export type CreateCollectionSheetRef = {
  open: () => void;
  close: () => void;
};

type Props = {
  onCreated?: () => void;
  debug?: boolean;
};

const CreateCollectionSheet = forwardRef<CreateCollectionSheetRef, Props>(
  ({ onCreated }, ref) => {
    const { user } = useAuthSession();
    const { theme } = useTheme();
    const sheetRef = useRef<BottomSheetModal>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useImperativeHandle(ref, () => ({
      open: () => {
        sheetRef.current?.present();
      },
      close: () => {
        sheetRef.current?.dismiss();
      },
    }));

    const handleCreate = async () => {
      setError("");
      if (!user?.id) {
        setError("You must be logged in.");
        return;
      }
      if (!name.trim()) {
        setError("Please provide a collection name.");
        return;
      }
      setLoading(true);
      try {
        const { error } = await supabase.from("collections").insert({
          name: name.trim(),
          description: description.trim() || null,
          user_id: user.id,
        });
        if (error) {
          setError("Failed to create collection.");
        } else {
          setName("");
          setDescription("");
          if (onCreated) onCreated();
        }
      } catch {
        setError("Failed to create collection.");
      }
      setLoading(false);
    };

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={["90%"]}
        enablePanDownToClose
        index={0}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        handleIndicatorStyle={{ backgroundColor: theme.text }}
        backgroundStyle={{ backgroundColor: theme.background }}
        onChange={() => {}}
      >
        <BottomSheetView
          style={{
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: 10,
            backgroundColor: theme.background,
            alignItems: "stretch",
            justifyContent: "flex-start",
          }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: Platform.OS === "android" ? 64 : 0,
            }}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText type="title" style={{ marginBottom: 8 }}>
              Create New Collection
            </ThemedText>
            {error ? (
              <ThemedText style={{ color: "red", marginBottom: 6 }}>
                {error}
              </ThemedText>
            ) : null}
            <TextInput
              placeholder="Collection name"
              style={[
                styles.sheetInput,
                {
                  borderColor: theme.border,
                  color: theme.text,
                  fontFamily: theme.fontFamily,
                  backgroundColor: theme.buttonBackgroundColor,
                  marginBottom: 12,
                },
              ]}
              value={name}
              onChangeText={setName}
              editable={!loading}
              returnKeyType="next"
            />
            <TextInput
              placeholder="Description (optional)"
              style={[
                styles.sheetInput,
                {
                  borderColor: theme.border,
                  color: theme.text,
                  fontFamily: theme.fontFamily,
                  backgroundColor: theme.buttonBackgroundColor,
                  marginBottom: 12,
                  minHeight: 40,
                  textAlignVertical: "top",
                },
              ]}
              value={description}
              onChangeText={setDescription}
              editable={!loading}
              multiline
              maxLength={150}
            />
            <ThemedView
              style={[
                styles.editActions,
                { backgroundColor: theme.background },
              ]}
            >
              <PrimaryButton
                title={loading ? "Creating..." : "Create"}
                onPress={handleCreate}
                disabled={loading || !name.trim()}
                style={{
                  flex: 1,
                  backgroundColor: theme.buttonBackgroundColor,
                }}
                textStyles={{ color: theme.buttonTextColor }}
              />
              <SecondaryButton
                title="Cancel"
                onPress={() => sheetRef.current?.dismiss()}
                disabled={loading}
                style={{
                  flex: 1,
                  backgroundColor: theme.buttonBackgroundColor,
                }}
                textStyles={{ color: theme.buttonTextColor }}
              />
            </ThemedView>
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default CreateCollectionSheet;
