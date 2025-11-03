import { submitReport } from "@/4-shared/api/reportsApi";
import {
  BottomSheetModal,
  BottomSheetModalRef,
} from "@/4-shared/components/bottom-sheet/ui/BottomSheetModal";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, TextInput, View } from "react-native";

export type ReportTarget = {
  commentId?: string;
  imageId?: number;
  reportedUserId?: string;
};

export type ReportBottomSheetRef = {
  open: (target: ReportTarget) => void;
  close: () => void;
};

type Props = {
  onReported?: () => void;
  onClose?: () => void;
};

const REPORT_REASONS = [
  "Spam",
  "Inappropriate language",
  "Harassment or hate speech",
  "Copyright violation",
  "Other",
];

export const ReportBottomSheet = forwardRef<ReportBottomSheetRef, Props>(
  ({ onReported, onClose }, ref) => {
    const sheetRef = useRef<BottomSheetModalRef>(null);
    const { user } = useAuthSession();
    const { theme } = useTheme();
    const [target, setTarget] = useState<ReportTarget | null>(null);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [customReason, setCustomReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      open: (newTarget: ReportTarget) => {
        setTarget(newTarget);
        setSelectedReason(null);
        setCustomReason("");
        setFeedback(null);
        setTimeout(() => {
          sheetRef.current?.present();
        }, 0);
      },
      close: () => {
        sheetRef.current?.dismiss();
      },
    }));

    const handleSheetDismiss = () => {
      setTarget(null);
      setSelectedReason(null);
      setCustomReason("");
      setFeedback(null);
      if (onClose) onClose();
    };

    const handleSubmit = useCallback(async () => {
      if (
        !user?.id ||
        !target ||
        !selectedReason ||
        (selectedReason === "Other" && !customReason.trim())
      ) {
        setFeedback("Please select a reason.");
        return;
      }
      setLoading(true);
      setFeedback(null);

      const reasonToSend =
        selectedReason === "Other" ? customReason.trim() : selectedReason;
      const { commentId, imageId, reportedUserId } = target;

      const { error } = await submitReport({
        reporter_id: user.id,
        comment_id: commentId ?? null,
        image_id: imageId ?? null,
        reported_user_id: reportedUserId ?? null,
        reason: reasonToSend,
      });

      setLoading(false);

      if (error) {
        if (error) {
          setFeedback(`Failed to submit report: Please try again.`);
        }
      } else {
        setFeedback("Report submitted. Thank you!");
        if (onReported) onReported();
        setTimeout(() => {
          sheetRef.current?.dismiss();
        }, 1200);
      }
    }, [user, target, selectedReason, customReason, onReported]);

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={["38%", "60%"]}
        enablePanDownToClose
        onDismiss={handleSheetDismiss}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        index={0}
      >
        <BottomSheetView
          style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}
        >
          <ThemedText type="title" style={{ marginBottom: 8 }}>
            Report {target?.commentId ? "Comment" : "Image"}
          </ThemedText>
          <ThemedText type="subtitle" style={{ marginBottom: 10 }}>
            Please select a reason:
          </ThemedText>
          <ThemedView style={{ marginBottom: 12 }}>
            {REPORT_REASONS.map((reason) => (
              <PrimaryButton
                key={reason}
                title={reason}
                style={{
                  marginBottom: 8,
                  backgroundColor:
                    selectedReason === reason
                      ? theme.accent
                      : theme.buttonBackgroundColor,
                  borderColor: theme.buttonBorderColor,
                  borderWidth: theme.buttonBorderWidth,
                  borderRadius: theme.buttonBorderRadius,
                }}
                textStyles={{
                  color:
                    selectedReason === reason
                      ? theme.buttonTextColorSecondary
                      : "#fff",
                  fontFamily: theme.fontFamily,
                }}
                onPress={() => setSelectedReason(reason)}
                disabled={loading}
              />
            ))}
          </ThemedView>
          {selectedReason === "Other" && (
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: theme.inputBorderColor,
                borderRadius: theme.inputBorderRadius,
                padding: theme.inputPadding,
                marginBottom: 10,
                color: theme.inputTextColor,
                backgroundColor: theme.inputBackgroundColor,
                fontFamily: theme.fontFamily,
                fontSize: 16,
              }}
              value={customReason}
              onChangeText={setCustomReason}
              placeholder="Describe the reason"
              placeholderTextColor={theme.inputPlaceholderColor}
              editable={!loading}
            />
          )}
          {feedback && (
            <ThemedText
              style={{
                color: feedback.toLowerCase().includes("thank")
                  ? theme.success
                  : theme.error,
                marginTop: 4,
                marginBottom: 4,
                fontSize: 15,
                textAlign: "center",
              }}
            >
              {feedback}
            </ThemedText>
          )}
          {loading ? (
            <ActivityIndicator
              style={{ marginVertical: 12 }}
              color={theme.primary}
            />
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <PrimaryButton
                title="Submit"
                onPress={handleSubmit}
                disabled={
                  !selectedReason ||
                  (selectedReason === "Other" && !customReason.trim()) ||
                  loading
                }
                style={{ flex: 1, marginRight: 6 }}
              />
              <SecondaryButton
                title="Cancel"
                onPress={() => sheetRef.current?.dismiss()}
                style={{ flex: 1, marginLeft: 6 }}
                disabled={loading}
              />
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

ReportBottomSheet.displayName = "ReportBottomSheet";
