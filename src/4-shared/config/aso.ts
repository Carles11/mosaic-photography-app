export const ASO = {
  home: {
    title: "Public Domain Vintage Photography | Mosaic Gallery",
    description:
      "Discover Mosaic’s curated gallery of public domain vintage photography. Explore timeless images from legendary photographers—preserved, free, and ready to inspire.",
    keywords: [
      "public domain photography",
      "public domain nude photography",
      "vintage photos",
      "free vintage images",
      "classic photography",
      "public domain vintage photos",
      "vintage photography",
      "free vintage photos",
      "vintage nude photography",
      "public domain art",
      "retro photography",
      "retro nude photography",
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

  favorites: {
    title: "Favorites | Mosaic Gallery",
    description:
      "Access your private list of favorite public domain vintage photographs. Only you can view your own curated collection.",
    keywords: [
      "favorites",
      "favorite photos",
      "private favorites",
      "curated images",
      "nude photography",
      "photo gallery",
      "private gallery",
      "liked vintage photos",
      "saved images",
      "personal collection",
      "public domain",
      "vintage photography",
      "Mosaic Gallery",
    ],
  },

  collections: {
    title: "Collections | Mosaic Gallery",
    description:
      "Organize your favorite images into themed collections. Group, curate, and share your best public domain vintage photography.",
    keywords: [
      "collections",
      "curated collections",
      "nude photography collections",
      "photo collections",
      "gallery",
      "curated images",
      "vintage photography",
      "public domain",
      "favorites",
      "themed image sets",
      "Mosaic Gallery",
    ],
    emptyTitle: "No collections yet",
    emptyText: "Create your first collection to organize your favorite images.",
  },

  collectionDetail: {
    title: (name: string) => `${name || "Mosaic Gallery Collection"}`,
    description: (desc: string, count: number) =>
      `${desc} — ${count} images in this curated collection of public domain vintage photography.`,
    keywords: [
      "collection",
      "curated collection",
      "vintage nude photography",
      "vintage photography",
      "nude photography",
      "photo-curation",
      "curated",
      "public domain images",
      "gallery",
      "Mosaic Gallery",
    ],
    emptyTitle: "No images in this collection",
    emptyText:
      "Add some of your favorited images to this collection to start showcasing your collection.",
    shareTemplate: ({
      name,
      description,
      url,
      count,
    }: {
      name: string;
      description?: string;
      url?: string;
      count?: number;
    }) =>
      `Check out my collection "${name}" on Mosaic Gallery! ${
        description ? `${description} — ` : ""
      }${count ? `${count} images. ` : ""}View it here: ${url ?? ""}`,
  },

  photographer: {
    title: ({
      name,
      surname,
      origin,
    }: {
      name?: string;
      surname?: string;
      origin?: string;
    }) =>
      `${name ?? ""} ${surname ?? ""} – Vintage Photography${
        origin ? " (" + origin + ")" : ""
      } | Mosaic Gallery`,
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
        "vintage photography",
        "nude photography",
        "public domain photography",
        "public domain",
        "classic nude art",
        "gallery",
        "iconic photographers",
        name ?? "",
        surname ?? "",
        "Mosaic Gallery",
        origin ?? "",
      ].filter((kw) => !!kw && kw.length > 0),
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
