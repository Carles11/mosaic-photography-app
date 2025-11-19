import AsyncStorage from "@react-native-async-storage/async-storage";

const MAGIC_LINK_EMAIL_KEY = "magic_link_email";

export const saveMagicLinkEmail = async (email: string) => {
  try {
    await AsyncStorage.setItem(MAGIC_LINK_EMAIL_KEY, email);
  } catch {}
};

export const getMagicLinkEmail = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(MAGIC_LINK_EMAIL_KEY);
  } catch {
    return null;
  }
};

export const clearMagicLinkEmail = async () => {
  try {
    await AsyncStorage.removeItem(MAGIC_LINK_EMAIL_KEY);
  } catch {}
};
