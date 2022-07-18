import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { VideoService } from '../services/video.service';
import { Capacitor, Plugins } from '@capacitor/core';
import * as WebVPPlugin from 'capacitor-video-player';
// eslint-disable-next-line @typescript-eslint/naming-convention
const { CapacitorVideoPlayer } = Plugins;
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { UploadService } from '../services/upload-service.service';
import { VideoPlayer, VideoOptions } from '@ionic-native/video-player/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
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
export class Tab2Page {
  @ViewChild('video') captureElement: ElementRef;
  videoOptions: VideoOptions;
  mediaRecorder: any;
  isRecording = false;
  selectedVideos = [];

  constructor(public videoService: VideoService,
    private changeDetector: ChangeDetectorRef,
    public uploadService: UploadService,
    private videoPlayer: VideoPlayer) {
      this.videoOptions = {
        volume: 0.7
      };
  }

  getSelected(video){
    if (this.selectedVideos.indexOf(video) === -1) {
      return false;
    }
    return true;
  }
  selectVideo(video) {
    if (this.selectedVideos.indexOf(video) === -1) {
      this.selectedVideos.push(video);
    }else{
      this.selectedVideos = this.selectedVideos.filter(item => item !== video);
    }
    console.log(video);
  }
  uploadVideos() {
    const imageAmount = this.selectedVideos.length;
    if(imageAmount>0){
        alert(`Uploading ${imageAmount} Videos`);
        this.uploadService.uploadVideos(this.selectedVideos);
        this.selectedVideos=[];
    }else{
      alert(`No Videos selected, please select some videos`);
    }
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  async ngAfterViewInit() {
    await this.videoService.loadVideos();
  }

  async recordVideo() {
    // Create a stream of video capturing
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user'
      },
      audio: true
    });

    // Show the stream inside our video object
    this.captureElement.nativeElement.srcObject = stream;
    const options = {mimeType: 'video/webm'};
    this.mediaRecorder = new MediaRecorder(stream, options);
    const chunks = [];
    // Store the video on stop
    this.mediaRecorder.onstop = async (event) => {
      const videoBuffer = new Blob(chunks, { type: 'video/webm' });
      await this.videoService.storeVideo(videoBuffer);
      this.changeDetector.detectChanges();
    };
    // Store chunks of recorded video
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    // Start recording wth chunks of data
    this.mediaRecorder.start(100);
    this.isRecording = true;
  }

  stopRecord() {
    this.mediaRecorder.stop();
    this.mediaRecorder = null;
    this.captureElement.nativeElement.srcObject = null;
    this.isRecording = false;
  }

  /*async play(video) {
    // Get the video as base64 data
    const realUrl = await this.videoService.getVideoUrl(video);
    // Show the player fullscreen
    await this.videoPlayer.initPlayer({
      mode: 'fullscreen',
      url: realUrl,
      playerId: 'fullscreen',
      componentTag: 'app-home'
    });
  }*/
  play(video) {
    console.log(video);
    this.videoPlayer.play(video).then(() => {
      console.log('video finished');
    }).catch(error => {
      console.log(error);
    });
  }
}
