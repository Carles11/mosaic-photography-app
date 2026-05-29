import { PrimaryButton } from "@/4-shared/components/buttons/variants";
import { ThemedText } from "@/4-shared/components/themed-text";
import { ThemedView } from "@/4-shared/components/themed-view";
import { useTheme } from "@/4-shared/theme/ThemeProvider";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./AboutScreen.styles";

const KO_FI_URL = "https://ko-fi.com/Q5Q6R6S40";
const INSTAGRAM_URL = "https://www.instagram.com/analogue_carles";
const GITHUB_URL = "https://github.com/Carles11/mosaic-photography-app";

const openLink = (url: string) => {
  WebBrowser.openBrowserAsync(url).catch(() => {});
};

export const AboutScreen: React.FC = () => {
  const { theme } = useTheme();

  const handleSupport = useCallback(() => openLink(KO_FI_URL), []);
  const handleInstagram = useCallback(() => openLink(INSTAGRAM_URL), []);
  const handleGithub = useCallback(() => openLink(GITHUB_URL), []);

  return (
    <SafeAreaView
      style={[styles.page, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* What Mosaic is */}
        <ThemedView style={styles.section}>
          <ThemedText type="title">What is Mosaic?</ThemedText>
          <ThemedText style={styles.body}>
            Mosaic is a free, ad-free archive of public domain photography —
            images from the late 19th and early 20th centuries, when photography
            was still finding out what it could be. Every image is free to
            browse, download, and share. No strings attached.
          </ThemedText>

          <ThemedText style={[styles.body, { marginTop: 8 }]}>
            Every image in Mosaic is in the public domain: works whose authors
            passed away more than 70 years ago, meaning no copyright applies in
            most jurisdictions in the world. Our primary source is Wikimedia
            Commons, the largest freely licensed media archive on the internet.
          </ThemedText>

          <ThemedText style={[styles.body, { marginTop: 8 }]}>
            Image quality varies by age and origin — these are digitised
            originals, not studio shoots. Most are served at over 3,000 pixels
            on the longest side, which is more than enough to fill any screen or
            make a decent print.
          </ThemedText>
          <TouchableOpacity
            style={[styles.instaRow, { borderColor: theme.border }]}
            onPress={() =>
              openLink("https://www.instagram.com/mosaic.photography.gallery/")
            }
            activeOpacity={0.75}
          >
            <ThemedText style={styles.instaHandle}>
              📷 @mosaic.photography.gallery
            </ThemedText>
            <ThemedText style={[styles.instaCaption, { opacity: 0.55 }]}>
              Follow Mosaic on Instagram
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* The person behind it */}
        <ThemedView style={styles.section}>
          <ThemedText type="title">Who made this?</ThemedText>
          <ThemedText style={styles.body}>
            I'm Carles — a Spanish developer and analogue photographer currently
            living in Santiago de Chile. I built Mosaic because I kept losing
            track of the photographers and images I loved, and nothing out there
            felt right for this kind of archive.
          </ThemedText>

          <ThemedText style={[styles.body, { marginTop: 8 }]}>
            No team, no funding, no ads. Just spare time and a genuine love for
            old photographs and the people who made them.
          </ThemedText>

          <TouchableOpacity
            style={[styles.instaRow, { borderColor: theme.border }]}
            onPress={handleInstagram}
            activeOpacity={0.75}
          >
            <ThemedText style={styles.instaHandle}>
              📷 @analogue_carles
            </ThemedText>
            <ThemedText style={[styles.instaCaption, { opacity: 0.55 }]}>
              My personal analogue photography
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Open source */}
        <ThemedView style={styles.section}>
          <ThemedText type="title">Open source</ThemedText>
          <ThemedText style={styles.body}>
            Mosaic is fully open source. The code is on GitHub — feel free to
            explore, report issues, or contribute.
          </ThemedText>
          <TouchableOpacity
            style={[styles.linkRow, { borderColor: theme.border }]}
            onPress={handleGithub}
            activeOpacity={0.75}
          >
            <ThemedText style={styles.linkText}>
              github.com/Carles11/mosaic-photography-app →
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Support */}
        <ThemedView style={styles.section}>
          <ThemedText type="title">Support Mosaic</ThemedText>
          <ThemedText style={styles.body}>
            Keeping Mosaic running has a cost — hosting, storage, and more hours
            than I care to count. But Mosaic is free, and I'd like to keep it
            that way. If it's ever given you a moment worth having, a small
            contribution helps more than you'd think.
          </ThemedText>
          <PrimaryButton
            title="☕  Support on Ko-fi"
            onPress={handleSupport}
            style={styles.supportButton}
          />
        </ThemedView>

        {/* Footer */}
        <ThemedText style={[styles.footer, { opacity: 0.35 }]}>
          Mosaic · Free forever · No ads · Public domain
        </ThemedText>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;
