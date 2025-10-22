import React from "react";
import { Text, View } from "react-native";
import Timeline from "react-native-timeline-flatlist";
import { TimelineItemModelProps } from "../../../4-shared/types";
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
  if (!events || events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No timeline events available.</Text>
      </View>
    );
  }
  const data = mapEventsToTimelineFlatlist(events);

  return (
    <View style={styles.timelineWrapper}>
      <Timeline
        data={data}
        circleSize={16}
        circleColor="#3498db" // must be a string, not null
        lineColor="#bbb" // must be a string, not null
        timeStyle={styles.timelineTime}
        titleStyle={styles.eventTitle}
        descriptionStyle={styles.eventDescription}
        showTime
        // options prop is NOT valid for this component!
      />
    </View>
  );
};

export default PhotographerTimeline;
