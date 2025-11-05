export const ASO = {
  home: {
    title: "Public Domain Vintage Photography | Mosaic Gallery",
    description:
      "Discover Mosaic’s curated gallery of public domain vintage photography. Explore timeless images from legendary photographers—preserved, free, and ready to inspire.",
    keywords: [
      "public domain photography",
      "vintage photography",
      "public domain art",
      "retro photography",
      "classic photo gallery",
      "free to use photography",
      "legendary photographers",
      "high-resolution image downloads",
      "timeless photo art",
      "historical photography",
      "creative commons",
      "open access images",
      "museum quality prints",
      "collectible vintage photography",
      "printable vintage photos",
      "copyright-free images",
    ],
    shareTemplate: ({
      imageTitle,
      photographer,
      appName = "Mosaic Photography Gallery",
      url,
    }: {
      imageTitle?: string;
      photographer?: string;
      url?: string;
      appName?: string;
    }) =>
      `Check out "${imageTitle ?? "a vintage photo"}" by ${
        photographer ?? "legendary photographers"
      } on ${appName} — public domain vintage photography preserved and shared for everyone. ${
        url ?? ""
      }`,
  },
  // Add more screens as needed
};
