import type { ContributorWithFeatured } from "@/2-features/community/photography/api/fetchContributorsList";
import { fetchContributorsList } from "@/2-features/community/photography/api/fetchContributorsList";
import AgeGateModal from "@/4-shared/components/age-gate/AgeGateModal";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { logEvent } from "@/4-shared/firebase";
import useNudityConsent from "@/4-shared/hooks/use-nudity-consent";
import { ThemedText } from "@/4-shared/components/themed-text";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { styles } from "./CommunitySlider.styles";
import CommunitySliderCard from "./CommunitySliderCard";

type NudityFilter = "all" | "nude" | "not-nude";

const NUDITY_FILTERS: { label: string; value: NudityFilter }[] = [
  { label: "All", value: "all" },
  { label: "Not Nude", value: "not-nude" },
  { label: "Nude", value: "nude" },
];

export default function CommunitySlider() {
  const { theme } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [contributors, setContributors] = useState<ContributorWithFeatured[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [nudityFilter, setNudityFilter] = useState<NudityFilter>("not-nude");
  const [ageGateVisible, setAgeGateVisible] = useState(false);
  const [pendingNudityValue, setPendingNudityValue] = useState<string | null>(null);
  const { hasConsent, confirmConsent } = useNudityConsent();
  const { user } = useAuthSession();

  const CARD_WIDTH = 160;

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchContributorsList();
      setContributors(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredContributors =
    nudityFilter === "all"
      ? contributors
      : contributors.filter((c) => {
          if (nudityFilter === "not-nude")
            return c.nudity === "not-nude" || c.nudity === "mixed" || !c.nudity;
          return c.nudity === "nude";
        });

  const handleNuditySelection = async (value: NudityFilter) => {
    const userState = user?.id ? "logged_in" : "anonymous";

    try {
      logEvent("APP_nudity_selection", {
        value,
        origin: "community_slider",
        user_state: userState,
      });
    } catch { /* swallow */ }

    if (value === "not-nude") {
      setNudityFilter(value);
      return;
    }

    try {
      const consent = await hasConsent();
      if (consent) {
        setNudityFilter(value);
        try {
          logEvent("APP_nudity_opt_in", { method: "existing_consent", value });
        } catch { /* swallow */ }
      } else {
        setPendingNudityValue(value);
        setAgeGateVisible(true);
        try {
          logEvent("APP_nudity_agegate_shown", { origin: "community_slider" });
        } catch { /* swallow */ }
      }
    } catch (e) {
      setPendingNudityValue(value);
      setAgeGateVisible(true);
      try {
        logEvent("APP_nudity_agegate_shown", {
          origin: "community_slider",
          error: String(e),
        });
      } catch { /* swallow */ }
    }
  };

  const handleAgeGateConfirm = async (payload: { confirmedAt: string }) => {
    setAgeGateVisible(false);
    if (!pendingNudityValue) return;
    try {
      await confirmConsent(payload);
      setNudityFilter(pendingNudityValue as NudityFilter);
      logEvent("APP_nudity_opt_in", {
        method: "age_gate",
        value: pendingNudityValue,
      });
    } catch (e) {
      console.warn("Failed to persist nudity consent:", e);
    } finally {
      setPendingNudityValue(null);
    }
  };

  const handleAgeGateCancel = () => {
    setAgeGateVisible(false);
    setPendingNudityValue(null);
    logEvent("APP_nudity_opt_out", { origin: "community_slider" });
  };

  return (
    <View style={styles.section}>
      <ThemedText type="title">FROM THE COMMUNITY</ThemedText>
      <ThemedText type="subtitle">
        Contemporary photographers sharing selected work through Mosaic.
      </ThemedText>

      <View style={styles.filtersRow}>
        {NUDITY_FILTERS.map((f) => {
          const isActive = nudityFilter === f.value;
          return (
            <TouchableOpacity
              key={f.value}
              style={[
                styles.pill,
                {
                  borderColor: isActive ? theme.text : theme.border,
                  backgroundColor: isActive ? theme.text : "transparent",
                },
              ]}
              onPress={() => handleNuditySelection(f.value)}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: isActive ? theme.background : theme.icon },
                  isActive && styles.pillTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="small" />
        </View>
      ) : filteredContributors.length === 0 ? (
        <View style={styles.centered}>
          <Text style={[styles.emptyText, { color: theme.icon }]}>More contributors coming soon.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredContributors}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <CommunitySliderCard contributor={item} cardWidth={CARD_WIDTH} />
          )}
        />
      )}

      <TouchableOpacity
        style={styles.ctaLink}
        onPress={() => router.push("/community/photography")}
      >
        <Text style={[styles.ctaLinkText, { color: theme.icon }]}>Add your piece to the mosaic {"\u2192"}</Text>
      </TouchableOpacity>

      <AgeGateModal
        visible={ageGateVisible}
        onConfirm={handleAgeGateConfirm}
        onCancel={handleAgeGateCancel}
      />
    </View>
  );
}
