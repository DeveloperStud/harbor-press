import type { MetadataPackage, TraitDraft } from "./types";

export function buildMetadata(input: {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  animation_url?: string;
  background_color?: string;
  attributes: TraitDraft[];
}): MetadataPackage {
  return {
    name: input.name.trim(),
    description: input.description.trim(),
    image: input.image.trim(),
    external_url: input.external_url?.trim() || undefined,
    animation_url: input.animation_url?.trim() || undefined,
    background_color: input.background_color?.replace("#", "").trim() || undefined,
    attributes: input.attributes.filter((t) => t.trait_type.trim() && String(t.value).trim()),
    compiler: "Harbor Press",
  };
}

export function metadataFilename(name: string) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "token"}-metadata.json`;
}
