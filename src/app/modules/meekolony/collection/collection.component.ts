import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Nft } from '@metaplex-foundation/js';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  forkJoin,
  map,
  BehaviorSubject,
  Subject,
  Observable,
  takeUntil,
  Subscription,
  interval,
  timer,
  switchMap,
} from 'rxjs';
import {
  CollectionListingRequest,
  CollectionSymbolRequest,
  GetNFTByAddressRequest,
} from 'src/app/interfaces/api-request';
import {
  MagicEdenCollection,
  MagicEdenCollectionActivity,
  MagicEdenCollectionStats,
  SolanaCollectionStats,
} from 'src/app/interfaces/api-response';
import { MeekolonyService } from '../meekolony.service';
import { NftDetailComponent } from '../nft-detail/nft-detail.component';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements OnInit, OnDestroy {
  collectionData: MagicEdenCollection[] = [];
  meCollectionInfo!: MagicEdenCollectionStats;
  solanaCollectionInfo!: SolanaCollectionStats;
  collectionActivities!: CollectionActivityDataSource;
  defaultCollectionSymbol = '';
  pageIndex = 1;
  pageSize = 12;
  isLoading = false;
  private destroy$ = new Subject();
  refreshInterval!: number;
  listingSubscription!: Subscription;
  activitySubscription!: Subscription;

  constructor(
    private meekoService: MeekolonyService,
    private modalService: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private messageService: NzMessageService
  ) {
    this.defaultCollectionSymbol = this.meekoService.defaultCollectionSymbol;
    this.refreshInterval = this.meekoService.refreshInterval;
    this.refreshComponent();
  }

  ngOnInit(): void {
    this.loadCollectionInfo();
    this.loadCollection();
    this.collectionActivities
      .completed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.messageService.info('All activites has been loaded');
      });
  }

  ngOnDestroy(): void {
    this.listingSubscription?.unsubscribe();
    this.activitySubscription?.unsubscribe();
    this.destroy$.next(0);
    this.destroy$.complete();
  }

  loadCollectionInfo() {
    this.isLoading = true;

    forkJoin([
      this.meekoService.getMECollectionInfo({
        collectionSymbol: this.defaultCollectionSymbol,
      } as CollectionSymbolRequest),
      this.meekoService.getSolanaCollectionInfo({
        collectionSymbol: this.defaultCollectionSymbol,
      } as CollectionSymbolRequest),
    ])
      .pipe(
        map(([meInfo, solanaInfo]) => {
          this.meCollectionInfo = meInfo;
          this.solanaCollectionInfo = solanaInfo;
        })
      )
      .subscribe()
      .add(() => (this.isLoading = false));
  }

  refreshComponent(): void {
    this.isLoading = true;
    this.pageIndex = 1;
    this.collectionData = [];
    this.collectionActivities = new CollectionActivityDataSource(
      this.meekoService,
      this.defaultCollectionSymbol
    );
  }

  loadCollection() {
    this.listingSubscription = timer(0, this.refreshInterval)
      .pipe(
        switchMap((x) => {
          this.refreshComponent();
          return this.meekoService.getCollectionListing({
            collectionSymbol: this.defaultCollectionSymbol,
            offset: this.getCurrentOffset(),
            limit: this.pageSize,
          } as CollectionListingRequest);
        })
      )
      .subscribe((listingData: MagicEdenCollection[]) => {
        if (listingData.length > 0) {
          this.pageIndex++;
          this.collectionData.push(...listingData);
        }

        this.isLoading = false;
      });
  }

  loadMoreCollection() {
    this.meekoService
      .getCollectionListing({
        collectionSymbol: this.defaultCollectionSymbol,
        offset: this.getCurrentOffset(),
        limit: this.pageSize,
      } as CollectionListingRequest)
      .subscribe((listingData: MagicEdenCollection[]) => {
        if (listingData.length > 0) {
          this.pageIndex++;
          this.collectionData.push(...listingData);
        } else {
          this.messageService.info(
            'All NFTs for this collection has been loaded'
          );
        }
      })
      .add(() => (this.isLoading = false));
  }

  getCurrentOffset(): number {
    if (this.pageIndex == 1) {
      return 0;
    }

    return this.pageIndex * this.pageSize;
  }

  loadNFTInfo(mintAddress: string) {
    this.isLoading = true;

    const serviceRequest = { mintAddress } as GetNFTByAddressRequest;
    this.meekoService
      .getNFTInfoByMintAddress(serviceRequest)
      .subscribe((data: Nft) => {
        this.openNFTInfoModal(data);
      })
      .add(() => (this.isLoading = false));
  }

  openNFTInfoModal(nft: Nft): void {
    const modal = this.modalService.create({
      nzTitle: nft.name,
      nzContent: NftDetailComponent,
      nzComponentParams: { nft },
      nzViewContainerRef: this.viewContainerRef,
      nzWidth: '85%',
      nzFooter: null,
    });
  }

  applyAddressMask(rawAddress: string) {
    if (!rawAddress) {
      return;
    }

    return (
      rawAddress.slice(0, 4) + '...' + rawAddress.slice(rawAddress.length - 4)
    );
  }
}

class CollectionActivityDataSource extends DataSource<MagicEdenCollectionActivity> {
  private pageSize = 10;
  private pageIndex = 0;
  private cachedData: MagicEdenCollectionActivity[] = [];
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<MagicEdenCollectionActivity[]>(
    this.cachedData
  );
  private complete$ = new Subject<void>();
  private disconnect$ = new Subject<void>();

  constructor(
    private meekoService: MeekolonyService,
    private collectionSymbol: string
  ) {
    super();
  }

  completed(): Observable<void> {
    return this.complete$.asObservable();
  }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<MagicEdenCollectionActivity[]> {
    this.setup(collectionViewer);
    return this.dataStream;
  }

  disconnect(): void {
    this.disconnect$.next();
    this.disconnect$.complete();
  }

  private setup(collectionViewer: CollectionViewer): void {
    this.fetchPage(0);
    collectionViewer.viewChange
      .pipe(takeUntil(this.complete$), takeUntil(this.disconnect$))
      .subscribe((range) => {
        if (this.cachedData.length >= 500) {
          // prevent web app from getting too heavy
          this.flagAsCompleted();
        } else {
          const endPage = this.getPageForIndex(range.end);
          this.fetchPage(endPage + 1);
        }
      });
  }

  private flagAsCompleted() {
    this.complete$.next();
    this.complete$.complete();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  getCurrentOffset(pageIndex = this.pageIndex): number {
    return pageIndex * this.pageSize;
  }

  private fetchPage(page: number): void {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    this.meekoService
      .getCollectionActivities({
        collectionSymbol: this.collectionSymbol,
        offset: this.getCurrentOffset(),
        limit: this.pageSize,
      } as CollectionListingRequest)
      .subscribe((res) => {
        if (res.length > 0) {
          this.pageIndex++;
          this.cachedData.push(...res);
          this.dataStream.next(this.cachedData);
        } else {
          this.flagAsCompleted();
        }
      });
  }
}
