import { Linking } from "react-native";

function parseParams(paramStr: string): Record<string, string> {
  return paramStr
    .replace(/^\?/, "")
    .split("&")
    .filter(Boolean)
    .reduce((acc, pair) => {
      const [key, val] = pair.split("=");
      if (key && val) acc[decodeURIComponent(key)] = decodeURIComponent(val);
      return acc;
    }, {} as Record<string, string>);
}

/**
 * Gets all URL params from both query (?token=...) and hash/fragment (#token=...).
 * - url: The URL to parse
 * Returns: params as key-value object
 */
export function getDeepLinkParams(url: string): Record<string, string> {
  if (!url) return {};
  let out: Record<string, string> = {};

  // Parse query params
  const qIdx = url.indexOf("?");
  if (qIdx !== -1) {
    // Find if a hash comes after query
    const hIdx = url.indexOf("#", qIdx);
    // Query segment ends at hash or at end of string
    const qStr = url.substring(qIdx + 1, hIdx === -1 ? undefined : hIdx);
    out = { ...out, ...parseParams(qStr) };
  }

  // Parse hash params
  const hIdx = url.indexOf("#");
  if (hIdx !== -1) {
    const hashStr = url.substring(hIdx + 1);
    out = { ...out, ...parseParams(hashStr) };
  }

  return out;
}

/**
 * Async convenience: Calls Linking.getInitialURL() and returns extracted params
 */
export async function getInitialDeepLinkParamsAsync(): Promise<
  Record<string, string>
> {
  const url = await Linking.getInitialURL();
  return url ? getDeepLinkParams(url) : {};
}
