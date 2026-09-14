export type OpenSeaNft = {
  identifier?: string;
  collection?: string;
  contract?: string;
  token_standard?: string;
  name?: string;
  description?: string;
  image_url?: string;
  display_image_url?: string;
  display_animation_url?: string | null;
  metadata_url?: string;
  opensea_url?: string;
  updated_at?: string;
  is_disabled?: boolean;
  is_nsfw?: boolean;
  traits?: { trait_type?: string; value?: string | number }[];
};

export type OpenSeaCollection = {
  collection?: string;
  name?: string;
  description?: string;
  image_url?: string;
  banner_image_url?: string;
  owner?: string;
  safelist_status?: string;
  category?: string;
  is_disabled?: boolean;
  is_nsfw?: boolean;
  trait_offers_enabled?: boolean;
  collection_offers_enabled?: boolean;
  opensea_url?: string;
  project_url?: string;
  wiki_url?: string;
  discord_url?: string;
  telegram_url?: string;
  twitter_username?: string;
  instagram_username?: string;
  contracts?: { address: string; chain: string }[];
  total_supply?: number;
  created_date?: string;
};

export type TraitDraft = { trait_type: string; value: string };

export type MetadataPackage = {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  animation_url?: string;
  background_color?: string;
  attributes: TraitDraft[];
  compiler: string;
};
