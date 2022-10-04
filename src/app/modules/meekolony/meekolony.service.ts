import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Nft } from '@metaplex-foundation/js';
import {
  CollectionListingRequest,
  CollectionSymbolRequest,
  GetNFTByAddressRequest,
  GetNFTsByAddressRequest,
  NFTActivitesListingRequest,
} from 'src/app/interfaces/api-request';
import {
  MagicEdenActivity,
  MagicEdenCollection,
  MagicEdenCollectionActivity,
  MagicEdenCollectionStats,
  SolanaCollectionStats,
} from 'src/app/interfaces/api-response';

@Injectable()
export class MeekolonyService {
  private _defaultCollectionSymbol = 'meekolony';
  constructor(private http: HttpClient) {}

  get defaultCollectionSymbol() {
    return this._defaultCollectionSymbol;
  }

  getSolanaCollectionInfo(request: CollectionSymbolRequest) {
    return this.http.get<SolanaCollectionStats>('solana/collection', {
      params: { ...request },
    });
  }

  getMECollectionInfo(request: CollectionSymbolRequest) {
    return this.http.get<MagicEdenCollectionStats>('magic-eden/collection', {
      params: { ...request },
    });
  }

  getCollectionListing(request: CollectionListingRequest) {
    return this.http.get<MagicEdenCollection[]>(
      'magic-eden/collection/listing',
      {
        params: { ...request },
      }
    );
  }

  getCollectionActivities(request: CollectionListingRequest) {
    return this.http.get<MagicEdenCollectionActivity[]>(
      'magic-eden/collection/activities',
      {
        params: { ...request },
      }
    );
  }

  getNFTInfoByMintAddress(request: GetNFTByAddressRequest) {
    return this.http.get<Nft>(`magic-eden/nft/${request.mintAddress}`);
  }

  getNFTActivities(request: NFTActivitesListingRequest) {
    return this.http.get<MagicEdenActivity[]>(
      `magic-eden/nft/${request.mintAddress}/activities`,
      { params: { offset: request.offset, limit: request.limit } }
    );
  }

  getNFTsByWalletAddress(request: GetNFTsByAddressRequest) {
    return this.http.get<Nft[]>(
      `magic-eden/nft/list/${request.walletAddress}`,
      { params: { offset: request.offset, limit: request.limit } }
    );
  }
}
