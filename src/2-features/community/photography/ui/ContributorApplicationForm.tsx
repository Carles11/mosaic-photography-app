import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./ContributorApplicationForm.styles";

const STORAGE_KEY = "contributorApplication";

const WORK_TYPES = ["Analogue", "Digital", "Both"] as const;
const NUDITY_OPTIONS = ["Artistic nude", "Non-nude", "Both"] as const;

const TEXT_FIELDS = [
  "name",
  "email",
  "confirmEmail",
  "location",
  "instagram",
  "portfolio",
  "imageGallery",
] as const;

type FormData = {
  name: string;
  email: string;
  confirmEmail: string;
  location: string;
  instagram: string;
  portfolio: string;
  imageGallery: string;
  message: string;
  workType: string;
  nudity: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  confirmEmail: "",
  location: "",
  instagram: "",
  portfolio: "",
  imageGallery: "",
  message: "",
  workType: "",
  nudity: "",
};

export default function ContributorApplicationForm() {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [rightsAccepted, setRightsAccepted] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData | "rights", string>>
  >({});

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.rightsAccepted) setRightsAccepted(parsed.rightsAccepted);
      } catch {}
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ formData, rightsAccepted }),
    );
  }, [formData, rightsAccepted]);

  const set = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const normalizeInstagram = (raw: string): string | null => {
    let u = raw.trim().replace(/^@/, "");
    const match = u.match(
      /(?:instagram\.com\/|instagr\.am\/)([a-zA-Z0-9_.]+)/,
    );
    if (match) u = match[1];
    return /^[a-zA-Z0-9_.]{1,30}$/.test(u) ? `@${u}` : null;
  };

  const normalizeUrl = (raw: string): string | null => {
    let url = raw.trim().replace(/\s/g, "");
    if (!url) return null;
    if (!url.startsWith("http://") && !url.startsWith("https://"))
      url = `https://${url}`;
    try {
      new URL(url);
      return url;
    } catch {
      return null;
    }
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    let valid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }
    if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = "Email addresses do not match";
      valid = false;
    }
    if (formData.instagram && normalizeInstagram(formData.instagram) === null) {
      newErrors.instagram = "Invalid Instagram username";
      valid = false;
    }
    if (formData.portfolio && normalizeUrl(formData.portfolio) === null) {
      newErrors.portfolio = "Invalid portfolio URL";
      valid = false;
    }
    if (formData.imageGallery && normalizeUrl(formData.imageGallery) === null) {
      newErrors.imageGallery = "Invalid gallery URL";
      valid = false;
    }
    if (!formData.workType) {
      newErrors.workType = "Please select your work type";
      valid = false;
    }
    if (!formData.nudity) {
      newErrors.nudity = "Please select nudity preference";
      valid = false;
    }
    if (!rightsAccepted) {
      newErrors.rights = "Please confirm you own the rights";
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    const formattedInstagram = formData.instagram
      ? normalizeInstagram(formData.instagram) ?? formData.instagram
      : "Not provided";
    const formattedPortfolio = formData.portfolio
      ? normalizeUrl(formData.portfolio) ?? formData.portfolio
      : "Not provided";
    const formattedGallery = formData.imageGallery
      ? normalizeUrl(formData.imageGallery) ?? formData.imageGallery
      : "Not provided";

    const emailBody = `
NEW CONTRIBUTOR APPLICATION

Name: ${formData.name || "Not provided"}
Email: ${formData.email}
Location: ${formData.location || "Not provided"}
Instagram: ${formattedInstagram}
Portfolio: ${formattedPortfolio}
Image Gallery: ${formattedGallery}
Work type: ${formData.workType}
Artistic nudity: ${formData.nudity}

ARTISTIC STATEMENT
${formData.message || "No message provided."}

RIGHTS CONFIRMATION
\u2713 Applicant confirmed ownership or control of rights

Submitted: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
`.trim();

    const subject = encodeURIComponent(
      `New Contributor Application: ${formData.name || "Anonymous"} - Mosaic Gallery`,
    );
    const body = encodeURIComponent(emailBody);

    Linking.openURL(
      `mailto:submissions@mosaic.photography?subject=${subject}&body=${body}`,
    );
  };

  const handleClear = () => {
    Alert.alert("Clear form", "Remove all saved form data?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          setFormData(EMPTY_FORM);
          setRightsAccepted(false);
          setErrors({});
          AsyncStorage.removeItem(STORAGE_KEY);
        },
      },
    ]);
  };

  return (
    <View style={styles.form}>
      {TEXT_FIELDS.map((field) => (
        <View key={field} style={styles.formGroup}>
          <Text style={styles.label}>
            {field === "confirmEmail"
              ? "Repeat email *"
              : field === "imageGallery"
                ? "Link to image gallery"
                : field.charAt(0).toUpperCase() + field.slice(1)}
            {["email", "name"].includes(field) ? " *" : ""}
          </Text>
          <TextInput
            style={[styles.input, errors[field] ? styles.inputError : null]}
            value={formData[field]}
            onChangeText={set(field)}
            keyboardType={
              field === "email" || field === "confirmEmail"
                ? "email-address"
                : "default"
            }
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors[field] && (
            <Text style={styles.errorText}>{errors[field]}</Text>
          )}
        </View>
      ))}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Work type *</Text>
        {WORK_TYPES.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.radioRow}
            onPress={() => set("workType")(option)}
          >
            <View
              style={[
                styles.radio,
                formData.workType === option && styles.radioSelected,
              ]}
            />
            <Text style={styles.radioLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
        {errors.workType && (
          <Text style={styles.errorText}>{errors.workType}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nudity preference *</Text>
        {NUDITY_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.radioRow}
            onPress={() => set("nudity")(option)}
          >
            <View
              style={[
                styles.radio,
                formData.nudity === option && styles.radioSelected,
              ]}
            />
            <Text style={styles.radioLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
        {errors.nudity && (
          <Text style={styles.errorText}>{errors.nudity}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tell us about your work</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={formData.message}
          onChangeText={set("message")}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          placeholder="Share anything about your work, process, cameras, formats..."
          placeholderTextColor="#555"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Rights & Licensing</Text>
        <Text style={styles.hintText}>
          By applying, you confirm that any photographs later submitted are your
          own work or that you have the necessary rights to license them.
        </Text>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => {
            setRightsAccepted((v) => !v);
            setErrors((e) => ({ ...e, rights: undefined }));
          }}
        >
          <View
            style={[styles.checkbox, rightsAccepted && styles.checkboxChecked]}
          >
            {rightsAccepted && (
              <Text style={styles.checkmark}>{"\u2713"}</Text>
            )}
          </View>
          <Text style={styles.checkboxLabel}>
            I confirm that I own or control the rights to the photographs I may
            submit.
          </Text>
        </TouchableOpacity>
        {errors.rights && (
          <Text style={styles.errorText}>{errors.rights}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Preview & send application</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.clearButtonText}>Clear form</Text>
      </TouchableOpacity>

      <Text style={styles.formFooter}>
        This will open your email app with a pre-filled message. Your
        application is automatically saved on this device until you clear it.
      </Text>
    </View>
  );
}
