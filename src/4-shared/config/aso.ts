export const ASO = {
  // Home / Main listing
  home: {
    title: "Mosaic — Vintage Photography",
    // Keep description clear, tasteful, and mention nudity as optional & age-gated
    description:
      "Discover Mosaic’s curated gallery of high‑resolution public‑domain vintage photography. Explore historical, museum‑grade images — some include tasteful artistic nudity (hidden by default and available only after a one‑time 18+ confirmation). Powerful filters, downloads, and photographer pages make discovery easy and educational.",
    // Safer, prioritized keywords for discovery (avoid repeated raw 'nude' tokens; include 'artistic nudity' with qualifier)
    keywords: [
      "public domain photography",
      "vintage photos",
      "public domain vintage photos",
      "historical photography",
      "artistic nudity",
      "historical nude photography",
      "curated photo gallery",
      "museum photography",
      "museum‑grade images",
      "high resolution photos",
      "download vintage photos",
      "photographer biographies",
      "archival images",
      "classic photography",
      "educational images",
      "free vintage images",
      "public domain art",
      "retro photography",
      "printable prints",
      "photo collections",
      "photo filters",
      "photo archive",
      "timeless photo art",
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
        photographer ?? "a legendary photographer"
      } on ${appName} — curated, public domain photography preserved for everyone. ${
        url ?? ""
      }`,
    // helpful text you can copy into reviewer notes when submitting builds
    reviewNotes:
      "This app includes optional, age‑gated artistic nudity from public‑domain / historical imagery. Nudity is hidden by default and requires a one‑time 18+ confirmation. The Filters UI and age confirmation are available from the Home screen. No explicit images are shown in store assets.",
  },

  // Favorites
  favorites: {
    title: "Favorites — Mosaic",
    description:
      "Your private list of favorite public‑domain vintage photographs. Curate, revisit, and download your best historical images.",
    keywords: [
      "favorites",
      "saved photos",
      "curated images",
      "my gallery",
      "public domain",
      "vintage photography",
      "archival favorites",
      "photo collection",
      "bookmark photos",
      "download images",
    ],
  },

  // Collections
  collections: {
    title: "Collections — Mosaic",
    description:
      "Organize your favorite images into themed collections. Group, curate, and share historical public‑domain photography with others.",
    keywords: [
      "collections",
      "curated collections",
      "photo collections",
      "vintage photography",
      "public domain",
      "favorites",
      "themed galleries",
      "archive collections",
      "curation tools",
    ],
    emptyTitle: "No collections yet",
    emptyText: "Create your first collection to organize your favorite images.",
  },

  // Collection detail
  collectionDetail: {
    title: (name: string) => `${name || "Mosaic Collection"}`,
    description: (desc: string, count: number) =>
      `${desc} — ${count} images in this curated collection of public‑domain vintage photography.`,
    keywords: [
      "collection",
      "curated collection",
      "vintage photography",
      "photo curation",
      "public domain images",
      "gallery",
      "Mosaic",
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
      `Check out my collection "${name}" on Mosaic — ${description ? `${description} — ` : ""}${
        count ? `${count} images. ` : ""
      }View it here: ${url ?? ""}`,
  },

  // Photographer page
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
      } | Mosaic`,
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
      `Discover the vintage photography of ${name ?? ""} ${surname ?? ""}${
        origin ? " (" + origin + ")" : ""
      }. View biography, gallery (${galleryCount ?? 0} images), and historical context. Some historic images may include tasteful artistic nudity — hidden by default and age‑gated.`,
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
        "vintage photography",
        "public domain photography",
        "historical photos",
        "photographer biography",
        "archival images",
        "artistic nudity",
        "historical nude photography",
        name ?? "",
        surname ?? "",
        "Mosaic",
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
      }'s vintage photography on Mosaic — view ${galleryCount ?? 0} images, bio, and milestones. ${url ?? ""}`,
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
      title: `${name ?? ""} ${surname ?? ""} – Vintage Photography | Mosaic`,
      description: `Explore ${name ?? ""} ${
        surname ?? ""
      }'s biography and curated vintage photography. Some historical images may be age‑gated due to artistic nudity.`,
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
      title: `${name ?? ""} ${surname ?? ""} – Vintage Photography | Mosaic`,
      description: `Explore the vintage photography and biography of ${
        name ?? ""
      } ${surname ?? ""}. View gallery (${galleryCount ?? 0} images) at Mosaic.`,
      images: [
        ogImageUrl || "https://www.mosaic.photography/images/og-image.jpg",
      ],
    }),
  },

  // Photographers list
  photographers: {
    title: "Photographers — Mosaic",
    description:
      "Browse our curated list of legendary vintage photographers. Discover galleries, biographies, and historic photo series that shaped photography.",
    keywords: [
      "photographers",
      "vintage photographers",
      "public domain artists",
      "classic photographers",
      "photo creators",
      "photographer gallery",
      "vintage photography",
      "biographies",
      "art history",
      "archival images",
      "Mosaic",
    ],
    emptyTitle: "No photographers yet",
    emptyText: "No photographers found. Please check back soon.",
    shareTemplate: ({
      photographer,
      url,
      appName = "Mosaic",
    }: {
      photographer?: string;
      url?: string;
      appName?: string;
    }) =>
      `Discover legendary photographer${photographer ? " " + photographer : "s"} on ${appName} — explore classic public domain photography. ${url ?? ""}`,
  },
};
