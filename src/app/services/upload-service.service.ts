/* eslint-disable one-var */
/* eslint-disable no-bitwise */
import { Injectable } from '@angular/core';
import { FTP } from '@awesome-cordova-plugins/ftp/ngx';
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private ftp: FTP) {
    this.ftp
      .connect('ftpupload.net', 'lblog_32136658', 'tfdg4k')
      .then((res: any) => {
        console.log('Login successful', res);
      })
      .catch((error: any) => console.error(error));
    }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  uploadImages(selected_images: any[]) {
    selected_images.forEach(async (element) => {
      const info = prompt('Please fill information', 'Enter Boat, Captain Name, Fish in the format Boat_Captain_Fish');
      const remoteName = `/images/${info}.${this.getExtension(element.filepath)}`;
      await this.uploadItems(element.filepath, remoteName);
    });
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  uploadVideos(selected_videos: any[]) {
    selected_videos.forEach(async (element) => {
      const info = prompt('Please fill information', 'Enter Boat, Captain Name, Fish in the format Boat_Captain_Fish');
      const remoteName = `/videos/${info}.${this.getExtension(element)}`;
      await this.uploadItems(element, remoteName);
    });
  }

  async uploadItems(localFilePath, ftpFilePath) {
    this.ftp.upload(localFilePath, ftpFilePath).subscribe();
  }

  getHash(str: string, seed: number) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  };
  getExtension(fileName){
    return (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined;
  }
}
