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

  photographer: {
    // Dynamic ASO title
    title: ({
      name,
      surname,
      origin,
    }: {
      name?: string;
      surname?: string;
      origin?: string;
    }) =>
      `${name ?? ""} ${surname ?? ""} – Vintage Nude Photography${
        origin ? " (" + origin + ")" : ""
      } | Mosaic Gallery`,

    // Dynamic ASO description
    description: ({
      name,
      surname,
      origin,
      galleryCount,
    }: {
      name?: string;
      surname?: string;
      origin?: string;
      galleryCount?: number;
    }) =>
      `Discover the vintage nude photography of ${name ?? ""} ${surname ?? ""}${
        origin ? " (" + origin + ")" : ""
      }, legendary in public domain art. View biography, gallery (${
        galleryCount ?? 0
      } images), and historical milestones at Mosaic Photography.`,

    // Dynamic keywords
    keywords: ({
      name,
      surname,
      origin,
    }: {
      name?: string;
      surname?: string;
      origin?: string;
    }) =>
      [
        "vintage nude photography",
        "public domain",
        "classic nude art",
        "gallery",
        "iconic photographers",
        name ?? "",
        surname ?? "",
        "Mosaic Gallery",
        origin ?? "",
      ].filter((kw) => !!kw && kw.length > 0),

    // Dynamic share-template for social/analytics
    shareTemplate: ({
      name,
      surname,
      galleryCount,
      url,
    }: {
      name?: string;
      surname?: string;
      galleryCount?: number;
      url?: string;
    }) =>
      `Explore ${name ?? ""} ${
        surname ?? ""
      }'s vintage nude photography on Mosaic Gallery — view ${
        galleryCount ?? 0
      } images, bio, and milestones. ${url ?? ""}`,

    // Dynamic OpenGraph meta (for universal future support)
    openGraph: ({
      name,
      surname,
      origin,
      ogImageUrl,
      galleryCount,
      canonicalUrl,
    }: {
      name?: string;
      surname?: string;
      origin?: string;
      ogImageUrl?: string;
      galleryCount?: number;
      canonicalUrl?: string;
    }) => ({
      title: `${name ?? ""} ${
        surname ?? ""
      } – Vintage Nude Photography | Mosaic Gallery`,
      description: `Explore ${name ?? ""} ${
        surname ?? ""
      }'s biography, public domain nude photography, and curated gallery. Discover classic art and historical milestones.`,
      type: "profile",
      url: canonicalUrl || "",
      images: [
        ogImageUrl || "https://www.mosaic.photography/images/og-image.jpg",
      ],
      profile: {
        firstName: name ?? "",
        lastName: surname ?? "",
      },
    }),

    twitter: ({
      name,
      surname,
      ogImageUrl,
      galleryCount,
    }: {
      name?: string;
      surname?: string;
      ogImageUrl?: string;
      galleryCount?: number;
    }) => ({
      card: "summary_large_image",
      title: `${name ?? ""} ${
        surname ?? ""
      } – Vintage Nude Photography | Mosaic Gallery`,
      description: `Explore the vintage nude photography and biography of ${
        name ?? ""
      } ${surname ?? ""}, legendary public domain artist. View gallery (${
        galleryCount ?? 0
      } images) at Mosaic Photography.`,
      images: [
        ogImageUrl || "https://www.mosaic.photography/images/og-image.jpg",
      ],
    }),
  },
};
