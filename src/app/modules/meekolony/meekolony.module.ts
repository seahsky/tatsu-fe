import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionComponent } from './collection/collection.component';
import { HolderComponent } from './holder/holder.component';
import { NftDetailComponent } from './nft-detail/nft-detail.component';
import { MeekolonyService } from './meekolony.service';
import { RouterModule, Routes } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzListModule } from 'ng-zorro-antd/list';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import { SearchOutline } from '@ant-design/icons-angular/icons';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpinModule } from 'ng-zorro-antd/spin';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'collection',
    pathMatch: 'full',
  },
  {
    path: 'collection',
    component: CollectionComponent,
  },
  {
    path: 'holder',
    component: HolderComponent,
  },
];

const icons: IconDefinition[] = [SearchOutline];

@NgModule({
  declarations: [CollectionComponent, HolderComponent, NftDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NzLayoutModule,
    NzGridModule,
    NzListModule,
    NzCardModule,
    NzModalModule,
    ScrollingModule,
    NzMessageModule,
    NzDescriptionsModule,
    NzCollapseModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule.forChild(icons),
    NzFormModule,
    NzSpinModule,
  ],
  providers: [MeekolonyService],
})
export class MeekolonyModule {}
