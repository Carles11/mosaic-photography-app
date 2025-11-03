import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import { TimelineItemModelProps } from "@/4-shared/types";
import React from "react";
import Timeline from "react-native-timeline-flatlist";
import { styles } from "./Timeline.styles";

interface TimelineProps {
  events: TimelineItemModelProps[];
}

function mapEventsToTimelineFlatlist(events: TimelineItemModelProps[]) {
  return events.map((item, idx) => ({
    time: item.cardSubtitle || item.eventType || "",
    title: item.cardTitle || "",
    description: [
      item.cardDetailedText,
      item.media?.name ? `Media: ${item.media.name}` : "",
      item.media?.source?.url ? `URL: ${item.media.source.url}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    circleColor: item.eventType === "personal" ? "#3498db" : "#c0392b",
    lineColor: "#bbb",
    key: `event-${idx}`,
  }));
}

export const PhotographerTimeline: React.FC<TimelineProps> = ({ events }) => {
  const { theme } = useTheme();

  if (!events || events.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>
          No timeline events available.
        </ThemedText>
      </ThemedView>
    );
  }
  const data = mapEventsToTimelineFlatlist(events);
  return (
    <ThemedView style={styles.timelineWrapper}>
      <Timeline
        data={data}
        circleSize={16}
        circleColor={theme.primary}
        lineColor={theme.border}
        timeStyle={[styles.timelineTime, { color: theme.text }]}
        titleStyle={[styles.eventTitle, { color: theme.text }]}
        descriptionStyle={[styles.eventDescription, { color: theme.text }]}
        showTime
        // options prop is NOT valid for this component!
      />
    </ThemedView>
  );
};
