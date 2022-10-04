export interface CollectionSymbolRequest {
  collectionSymbol: string;
}

export interface ListingRequest {
  offset: number;
  limit: number;
}

export interface CollectionListingRequest
  extends CollectionSymbolRequest,
    ListingRequest {}

export interface GetNFTsByAddressRequest extends ListingRequest {
  walletAddress: string;
}

export interface GetNFTByAddressRequest {
  mintAddress: string;
}

export interface NFTActivitesListingRequest extends ListingRequest {
  mintAddress: string;
}
