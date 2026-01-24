import { StyleSheet } from "react-native";

const createStyles = (theme: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    content: {
      paddingBottom: 24,
    },

    // Header
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: 8,
    },
    backTouchable: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 6,
    },
    backText: {
      fontSize: 28,
      color: theme.mutedText ?? "#bbb",
    },
    headerTextWrap: {
      flex: 1,
    },
    h1: {
      fontSize: 30,
      fontWeight: "800",
      color: theme.text ?? "#fff",
    },
    h2: {
      marginTop: 6,
      fontSize: 14,
      color: theme.mutedText ?? "#bdbdbd",
      opacity: 0.95,
    },

    // Big highlighted card (detailed)
    bigCardContainer: {
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1.8,
      borderColor: theme.accent ?? "#F7D874",
      backgroundColor: theme.background ?? "#151515",
    },
    bigCardInner: {
      padding: 18,
      paddingTop: 22,
    },
    bigCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    radioAndLabel: {
      flexDirection: "row",
      alignItems: "center",
    },
    radioCircle: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: "rgba(255,255,255,0.2)",
      marginRight: 12,
    },
    // Highlight color for selected radio (uses theme.highlight or fallback)
    radioSelected: {
      borderColor: (theme.highlight as string) ?? "#F7D874",
      backgroundColor: (theme.highlight as string) ?? "#F7D874",
    },
    bigCardTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: theme.text ?? "#fff",
    },
    bigCardPrice: {
      fontSize: 20,
      fontWeight: "900",
      color: theme.text ?? "#fff",
    },
    bigCardSub: {
      fontSize: 13,
      color: theme.mutedText ?? "#bdbdbd",
      marginBottom: 12,
    },

    bullets: {
      marginTop: 6,
    },
    bulletRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    bulletDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.accent ?? "#00A3FF",
      marginTop: 6,
      marginRight: 10,
    },
    bulletText: {
      color: theme.mutedText ?? "#cfcfcf",
      fontSize: 13,
      lineHeight: 18,
      flex: 1,
    },

    // Compact cards (simple outline)
    compactCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: theme.mutedText ?? "#687076",
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 14,
      marginBottom: 12,
      backgroundColor: "transparent",
    },
    compactCardSelected: {
      borderColor: theme.accent ?? "#F7D874",
      backgroundColor: theme.background ?? "#151515",
    },
    compactLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    radioSmall: {
      width: 14,
      height: 14,
      borderRadius: 7,
      borderWidth: 2,
      borderColor: (theme.mutedText as string) ?? "#687076",
      marginRight: 10,
    },
    // Small radio selected highlight (yellow)
    radioSmallSelected: {
      backgroundColor: (theme.accent as string) ?? "#F7D874",
      borderColor: (theme.accent as string) ?? "#F7D874",
    },
    compactTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text ?? "#fff",
    },
    compactSub: {
      fontSize: 12,
      color: theme.mutedText ?? "#bdbdbd",
    },
    compactPrice: {
      fontSize: 16,
      fontWeight: "900",
      color: theme.text ?? "#fff",
    },

    // Star / ribbon for recommended card (lifetime only)
    starRibbon: {
      position: "absolute",
      right: -6,
      top: -6,
      backgroundColor: theme.accent ?? "#F7D874",
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderTopRightRadius: 14,
      borderBottomLeftRadius: 14,
      zIndex: 10,
    },
    starText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "900",
    },

    // Shadow helper (soft)
    shadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 14,
      elevation: 6,
    },

    // Bottom CTA area
    bottom: {
      paddingHorizontal: 18,
      paddingVertical: 14,
      borderTopWidth: 1,
      borderTopColor: "rgba(255,255,255,0.03)",
      backgroundColor: theme.background ?? "#000",
    },
    makePayment: {
      width: "100%",
      borderRadius: 28,
      paddingVertical: 14,
      // If PrimaryButton expects background styling, tweak below
      backgroundColor: theme.buttonBackgroundColor ?? "#0096FF",
    },
    maybeLater: {
      marginTop: 10,
      width: "100%",
      borderRadius: 10,
      paddingVertical: 12,
    },
  });

export default createStyles;
