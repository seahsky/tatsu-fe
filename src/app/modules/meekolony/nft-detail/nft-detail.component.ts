import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Nft } from '@metaplex-foundation/js';
import { NFTActivitesListingRequest } from 'src/app/interfaces/api-request';
import { MagicEdenActivity } from 'src/app/interfaces/api-response';
import { MeekolonyService } from '../meekolony.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Subject, Observable, takeUntil } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-nft-detail',
  templateUrl: './nft-detail.component.html',
  styleUrls: ['./nft-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NftDetailComponent implements OnInit, OnDestroy {
  nft!: Nft;
  nftActivities!: NFTActivityDataSource;
  pageIndex = 1;
  pageSize = 10;
  isLoading = false;
  private destroy$ = new Subject();

  constructor(
    private meekoService: MeekolonyService,
    private messageService: NzMessageService
  ) {}

  ngOnInit(): void {
    if (this.nft) {
      this.nftActivities = new NFTActivityDataSource(
        this.meekoService,
        this.nft.address.toString()
      );
      this.nftActivities
        .completed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.messageService.info('All activites has been loaded');
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(0);
    this.destroy$.complete();
  }

  getCurrentOffset(pageIndex = this.pageIndex): number {
    if (pageIndex == 1) {
      return 0;
    }

    return pageIndex * this.pageSize;
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

class NFTActivityDataSource extends DataSource<MagicEdenActivity> {
  private pageSize = 10;
  private pageIndex = 0;
  private cachedData: MagicEdenActivity[] = [];
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<MagicEdenActivity[]>(
    this.cachedData
  );
  private complete$ = new Subject<void>();
  private disconnect$ = new Subject<void>();

  constructor(
    private meekoService: MeekolonyService,
    private mintAddress: string
  ) {
    super();
  }

  completed(): Observable<void> {
    return this.complete$.asObservable();
  }

  connect(collectionViewer: CollectionViewer): Observable<MagicEdenActivity[]> {
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
      .getNFTActivities({
        mintAddress: this.mintAddress,
        offset: this.getCurrentOffset(),
        limit: this.pageSize,
      } as NFTActivitesListingRequest)
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
