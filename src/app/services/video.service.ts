import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  public videos = [];
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types, @typescript-eslint/naming-convention
  private VIDEOS_KEY: string = 'videos';

  constructor() {}

  async loadVideos() {
    const videoList = await Storage.get({ key: this.VIDEOS_KEY });
    this.videos = JSON.parse(videoList.value) || [];
  }

  async storeVideo(blob) {
    const fileName = new Date().getTime() + '.mp4';

    const base64Data = await this.convertBlobToBase64(blob) as string;
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    // Add file to local array
    this.videos.unshift(savedFile.uri);

    // Write information to storage
    return Storage.set({
      key: this.VIDEOS_KEY,
      value: JSON.stringify(this.videos)
    });
  }
  // Load video as base64 from url
  async getVideoUrl(fullPath) {
    const filePath = fullPath.substr(fullPath.lastIndexOf('/') + 1);
    const file = await Filesystem.readFile({
      path: filePath,
      directory: Directory.Data
    });
    return `data:video/mp4;base64,${file.data}`;
  }
  // Helper function
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
