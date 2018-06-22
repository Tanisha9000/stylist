import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostjobsPage } from './postjobs';

@NgModule({
  declarations: [
    PostjobsPage,
  ],
  imports: [
    IonicPageModule.forChild(PostjobsPage),
  ],
})
export class PostjobsPageModule {}
