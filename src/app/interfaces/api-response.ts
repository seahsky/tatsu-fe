export interface MagicEdenCollectionStats {
  symbol: string;
  floorPrice: number;
  listedCount: number;
  volumeAll: number;
}

export interface MagicEdenCollection {
  pdaAddress: string;
  auctionHouse: string;
  tokenAddress: string;
  tokenMint: string;
  seller: string;
  tokenSize: number;
  price: number;
  rarity: {
    moonrank: MagicEdenCollectionRarityMoonRank;
    merarity: MagicEdenCollectionRarityME;
  };
  extra: {
    img: string;
  };
  expiry: number;
}

export interface MagicEdenCollectionRarityBase {
  rank: number;
}

export interface MagicEdenCollectionRarityMoonRank
  extends MagicEdenCollectionRarityBase {
  absolute_rarity: number;
  crawl: {
    id: string;
    created: Date;
    updated: Date;
    first_mint_ts: number;
    last_mint_ts: number;
    first_mint: string;
    last_mint: string;
    expected_pieces: number;
    seen_pieces: number;
    last_crawl_id: number;
    complete: boolean;
    blocked: boolean;
    unblock_at_ts: number;
  };
}

export interface MagicEdenCollectionRarityME
  extends MagicEdenCollectionRarityBase {
  tokenKey: string;
  score: number;
  totalSupply: number;
}

export interface MagicEdenActivity {
  signature: string;
  type: string;
  source: string;
  tokenMint: string;
  collectionSymbol: string;
  slot: number;
  blockTime: number;
  buyer: string;
  buyerReferral: string;
  seller: string;
  sellerReferral: string;
  price: number;
}

export interface MagicEdenCollectionActivity extends MagicEdenActivity {
  collection: string;
  image: string;
}

export interface SolanaCollectionStats {
  collection: {
    stats: {
      one_hour_volume: number;
      one_hour_change: number;
      one_hour_sales: number;
      one_hour_sales_change: number;
      one_hour_average_price: number;
      one_hour_difference: number;
      six_hour_volume: number;
      six_hour_change: number;
      six_hour_sales: number;
      six_hour_sales_change: number;
      six_hour_average_price: number;
      six_hour_difference: number;
      one_day_volume: number;
      one_day_change: number;
      one_day_sales: number;
      one_day_sales_change: number;
      one_day_average_price: number;
      one_day_difference: number;
      seven_day_volume: number;
      seven_day_change: number;
      seven_day_sales: number;
      seven_day_average_price: number;
      seven_day_difference: number;
      thirty_day_volume: number;
      thirty_day_change: number;
      thirty_day_sales: number;
      thirty_day_average_price: number;
      thirty_day_difference: number;
      total_volume: number;
      total_sales: number;
      total_supply: number;
      count: number;
      num_owners: number;
      average_price: number;
      num_reports: number;
      market_cap: number;
      floor_price: number;
    };
    banner_image_url: string;
    created_date: Date;
    default_to_fiat: boolean;
    description: string;
    external_url: string;
    featured: boolean;
    featured_image_url: string;
    image_url: string;
    name: string;
    short_description?: any;
    slug: string;
  };
}
