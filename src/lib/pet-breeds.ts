const BREED_LABELS: Record<string, string> = {
  shibainu: "柴犬",
  goldenretriever: "黃金獵犬",
  labradorretriever: "拉布拉多",
  frenchbulldog: "法國鬥牛犬",
  welshcorgi: "柯基犬",
  poodle: "貴賓犬",
  britishshorthair: "英國短毛貓",
  ragdoll: "布偶貓",
  persian: "波斯貓",
  mainecoon: "緬因貓",
  scottishfold: "蘇格蘭摺耳貓",
  domesticshorthair: "米克斯貓",
};

const BREED_ALIASES: Record<string, string> = {
  柴犬: "shibainu",
  shiba: "shibainu",
  shibainu: "shibainu",
  黃金獵犬: "goldenretriever",
  goldenretriever: "goldenretriever",
  拉布拉多: "labradorretriever",
  labrador: "labradorretriever",
  labradorretriever: "labradorretriever",
  法鬥: "frenchbulldog",
  法國鬥牛犬: "frenchbulldog",
  frenchbulldog: "frenchbulldog",
  柯基: "welshcorgi",
  柯基犬: "welshcorgi",
  corgi: "welshcorgi",
  welshcorgi: "welshcorgi",
  貴賓: "poodle",
  貴賓犬: "poodle",
  poodle: "poodle",
  英短: "britishshorthair",
  英國短毛貓: "britishshorthair",
  britishshorthair: "britishshorthair",
  布偶: "ragdoll",
  布偶貓: "ragdoll",
  ragdoll: "ragdoll",
  波斯: "persian",
  波斯貓: "persian",
  persian: "persian",
  緬因: "mainecoon",
  緬因貓: "mainecoon",
  mainecoon: "mainecoon",
  摺耳: "scottishfold",
  蘇格蘭摺耳貓: "scottishfold",
  scottishfold: "scottishfold",
  米克斯貓: "domesticshorthair",
  domesticshorthair: "domesticshorthair",
};

function normalizeBreedKey(breed?: string | null): string | null {
  if (!breed) {
    return null;
  }

  const normalized = breed.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
  if (!normalized) {
    return null;
  }

  return BREED_ALIASES[normalized] ?? normalized;
}

export function breedLabel(breed?: string | null): string {
  const key = normalizeBreedKey(breed);
  if (!key) {
    return "";
  }

  return BREED_LABELS[key] ?? (breed ?? "");
}

export function breedSuggestions(type: "dog" | "cat"): string[] {
  if (type === "cat") {
    return ["英國短毛貓", "布偶貓", "波斯貓", "緬因貓", "蘇格蘭摺耳貓", "米克斯貓"];
  }

  return ["柴犬", "黃金獵犬", "拉布拉多", "法國鬥牛犬", "柯基犬", "貴賓犬"];
}
