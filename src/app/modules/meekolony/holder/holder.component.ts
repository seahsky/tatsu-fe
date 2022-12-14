import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Metadata, JsonMetadata, Nft } from '@metaplex-foundation/js';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription, switchMap, timer } from 'rxjs';
import {
  GetNFTByAddressRequest,
  GetNFTsByAddressRequest,
} from 'src/app/interfaces/api-request';
import { MeekolonyService } from '../meekolony.service';
import { NftDetailComponent } from '../nft-detail/nft-detail.component';

@Component({
  selector: 'app-holder',
  templateUrl: './holder.component.html',
  styleUrls: ['./holder.component.scss'],
})
export class HolderComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup;
  isLoading = false;
  pageIndex = 1;
  pageSize = 12;
  nftData: Nft[] = [];
  currentWalletAddress = '';
  refreshInterval!: number;
  listingSubscription!: Subscription;

  constructor(
    private meekoService: MeekolonyService,
    private modalService: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private fb: FormBuilder,
    private messageService: NzMessageService
  ) {
    this.refreshInterval = this.meekoService.refreshInterval;
    this.searchForm = this.fb.group({
      walletAddress: [''],
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.listingSubscription?.unsubscribe();
  }

  getCurrentOffset(): number {
    if (this.pageIndex == 1) {
      return 0;
    }

    return this.pageIndex * this.pageSize;
  }

  refreshComponent(): void {
    this.isLoading = true;
    this.pageIndex = 1;
    this.nftData = [];
  }

  loadNFTInfo(mintAddress: string) {
    this.isLoading = true;

    const serviceRequest = { mintAddress } as GetNFTByAddressRequest;

    this.listingSubscription = timer(0, this.refreshInterval)
      .pipe(
        switchMap((x) => {
          this.refreshComponent();
          return this.meekoService.getNFTInfoByMintAddress(serviceRequest);
        })
      )
      .subscribe((data: Nft) => {
        this.openNFTInfoModal(data);
        this.isLoading = false;
      });
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

  loadNFTs(walletAddress = this.currentWalletAddress) {
    this.isLoading = true;

    this.meekoService
      .getNFTsByWalletAddress({
        walletAddress,
        offset: this.getCurrentOffset(),
        limit: this.pageSize,
      } as GetNFTsByAddressRequest)
      .subscribe((data: Nft[]) => {
        if (data.length > 0) {
          this.pageIndex++;
          this.nftData.push(...data);
        } else {
          this.messageService.info('All NFTs for this wallet has been loaded');
        }
      })
      .add(() => (this.isLoading = false));
  }

  onSubmit() {
    this.currentWalletAddress =
      this.searchForm.get('walletAddress')?.value ?? '';
    this.loadNFTs();
  }
}
