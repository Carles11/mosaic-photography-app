import type { ContributorWithFeatured } from "@/2-features/community/photography/api/fetchContributorsList";
import { fetchContributorsList } from "@/2-features/community/photography/api/fetchContributorsList";
import ContributorApplicationForm from "@/2-features/community/photography/ui/ContributorApplicationForm";
import { getBestUrlForWidth } from "@/4-shared/lib/getAllS3Urls";
import { showErrorToast } from "@/4-shared/utility/toast/Toast";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { styles } from "./CommunityPhotographyScreen.styles";

type NudityFilter = "all" | "nude" | "not-nude";

const NUDITY_FILTERS: { label: string; value: NudityFilter }[] = [
  { label: "All", value: "all" },
  { label: "Not Nude", value: "not-nude" },
  { label: "Nude", value: "nude" },
];

const nudityLabel = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const map: Record<string, string> = {
    nude: "Nude",
    "not-nude": "Not Nude",
    mixed: "Mixed",
  };
  return map[value] ?? null;
};

export default function CommunityPhotographyScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const ctaRef = useRef<View>(null);
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width > 600 ? (width - 48) / 2 : width - 32;

  const [contributors, setContributors] = useState<ContributorWithFeatured[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [nudityFilter, setNudityFilter] = useState<NudityFilter>("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchContributorsList();
        setContributors(data);
      } catch (e) {
        const msg = "Failed to load community contributors.";
        showErrorToast(msg);
        setError(msg);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleShare = async () => {
    await Share.share({
      message:
        "Mosaic Photography Community \u2013 Contemporary photographers with a timeless eye",
      url: "https://www.mosaic.photography/community/photography",
    });
  };

  const filteredContributors =
    nudityFilter === "all"
      ? contributors
      : contributors.filter((c) => {
          if (nudityFilter === "not-nude")
            return c.nudity === "not-nude" || c.nudity === "mixed" || !c.nudity;
          return c.nudity === "nude";
        });

  const handleToggleForm = () => {
    const next = !formOpen;
    setFormOpen(next);
    if (next) {
      setTimeout(() => {
        ctaRef.current?.measure((_x, y) => {
          scrollRef.current?.scrollTo({ y: Math.max(0, y - 20), animated: true });
        });
      }, 250);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.icon }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { borderColor: theme.border }]}
          onPress={() => {
            setLoading(true);
            setError(null);
            fetchContributorsList()
              .then(setContributors)
              .catch(() => setError("Failed to load community contributors."))
              .finally(() => setLoading(false));
          }}
        >
          <Text style={[styles.retryButtonText, { color: theme.icon }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={[styles.page, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.pageTitle, { color: theme.text }]}>
          The community
        </Text>
        <Text style={[styles.pageSubTitle, { color: theme.icon }]}>
          Contemporary photographers and visual artists who share selected work
          through Mosaic Photography.
        </Text>
        <Text style={[styles.intro, { color: theme.icon }]}>
          Unlike the public domain archive, these photographs are contemporary
          works owned by the photographers who made them, presented here by
          their choice. Mosaic displays them. The photographers keep everything
          else.
        </Text>
        <Text style={[styles.intro, { color: theme.icon }]}>
          Mosaic favors photographers whose work (analog or digital) embodies a
          thoughtful, vintage, timeless approach to image-making.
        </Text>
        <TouchableOpacity
          style={[styles.shareButton, { borderColor: theme.border }]}
          onPress={handleShare}
        >
          <Text style={[styles.shareButtonText, { color: theme.icon }]}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={[styles.sectionTitle, { color: theme.text, borderLeftColor: theme.icon }]}>
          How community contributor collections work
        </Text>
        <View style={[styles.infoCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
          {[
            "Your photographs remain yours, always.",
            "You choose how others may use them.",
            "Mosaic never claims ownership of your work.",
            "Every photographer confirms they hold the rights to what they submit.",
          ].map((item) => (
            <Text key={item} style={[styles.bulletItem, { color: theme.icon }]}>
              {"\u2022 "}
              {item}
            </Text>
          ))}
        </View>
      </View>

      {/* CTA / Share Your Work */}
      <View
        ref={ctaRef}
        style={[styles.ctaSection, { backgroundColor: theme.background, borderColor: theme.border }]}
      >
        <Text style={[styles.ctaTitle, { color: theme.text }]}>Share Your Work</Text>
        <Text style={[styles.ctaText, { color: theme.icon }]}>
          Mosaic welcomes photographers whose work aligns with the spirit of the
          archive: thoughtful image-making, strong visual storytelling, and a
          respect for photographic heritage.
        </Text>
        <Text style={[styles.ctaText, { color: theme.icon }]}>
          Contributors retain copyright to their work and choose the license
          under which their images are made available.
        </Text>
        <TouchableOpacity
          style={[styles.ctaButton, { borderColor: theme.border }]}
          onPress={handleToggleForm}
        >
          <Text style={[styles.ctaButtonText, { color: theme.text }]}>
            {formOpen ? "\u2715 Cancel" : "Apply to contribute"}
          </Text>
        </TouchableOpacity>

        {formOpen && <ContributorApplicationForm />}
      </View>

      {/* Nudity filter pills */}
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
              onPress={() => setNudityFilter(f.value)}
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

      <Text style={[styles.sectionTitle, { color: theme.text, borderLeftColor: theme.icon }]}>
        Community Collections
      </Text>
      {!contributors || contributors.length === 0 ? (
        <Text style={[styles.emptyState, { color: theme.icon }]}>
          The gallery is growing. More contributors coming soon.
        </Text>
      ) : filteredContributors.length === 0 ? (
        <Text style={[styles.emptyState, { color: theme.icon }]}>
          No contributors match the selected filter.
        </Text>
      ) : (
        <View style={styles.grid}>
          {filteredContributors.map((c) => {
            const imageUrl = c.featuredImage?.s3Progressive
              ? getBestUrlForWidth(c.featuredImage.s3Progressive, CARD_WIDTH)
              : (c.featuredImage?.url ?? null);
            const badge = nudityLabel(c.nudity);

            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.card, { width: CARD_WIDTH, backgroundColor: theme.background, borderColor: theme.border, borderWidth: 1 }]}
                onPress={() => router.push(`/community/photography/${c.slug}`)}
                activeOpacity={0.85}
              >
                <View style={[styles.cardImageWrapper, { backgroundColor: theme.border }]}>
                  {imageUrl ? (
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.avatarPlaceholder, { backgroundColor: theme.border }]} />
                  )}
                  {badge && (
                    <View style={styles.cardBadge}>
                      <Text style={styles.cardBadgeText}>{badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.cardName, { color: theme.text }]}>{c.name}</Text>
                <View style={styles.cardMeta}>
                  <Text style={[styles.cardMetaText, { color: theme.icon }]}>
                    {c.country || "Global"}
                  </Text>
                  {c.license_default && (
                    <Text style={[styles.licenseText, { color: theme.icon }]}>
                      {c.license_default}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
