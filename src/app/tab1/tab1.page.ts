import { PhotoService } from '../services/photo.service';
import { AnimationController } from '@ionic/angular';
import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { UploadService } from '../services/upload-service.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  animations: [
    trigger('selectItem', [
      // ...
      state('notSelected', style({
        height: 'auto',
        opacity: 1,
        backgroundColor: 'transparent'
      })),
      state('selected', style({
        height: 'auto',
        opacity: 0.4,
        backgroundColor: 'grey'
      })),
      transition('notSelected => selected', [
        animate('0.5s')
      ]),
      transition('selected => notSelected', [
        animate('0.5s')
      ]),
    ]),
  ],
})

export class Tab1Page {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  selected_images = [];
  constructor(private animationCtrl: AnimationController,
    public photoService: PhotoService,
    public uploadService: UploadService) {
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
  openLeaderboard(){
    window.open('https://www.letsfishroatan.com/#TOURNAMENT', '_blank');
  }
  uploadImages() {
    const imageAmount = this.selected_images.length;
    if(imageAmount>0){
        alert(`Uploading ${imageAmount} Images`);
        this.uploadService.uploadImages(this.selected_images);
        this.selected_images=[];
    }else{
      alert(`No images selected, please select some images`);
    }
  }
  getSelected(photo){
    if (this.selected_images.indexOf(photo) === -1) {
      return false;
    }
    return true;
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  async ngOnInit() {
    await this.photoService.loadSaved();
    console.log(this.photoService.photos);
  }
  selectImage(photo) {
    if (this.selected_images.indexOf(photo) === -1) {
      this.selected_images.push(photo);
    }else{
      this.selected_images = this.selected_images.filter(item => item !== photo);
    }
    console.log(photo);
  }
}
