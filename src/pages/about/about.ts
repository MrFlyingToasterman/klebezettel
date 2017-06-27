import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//Import für Dateioperationen; Schreiben; Lesen
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  bytesfree = this.file.getFreeDiskSpace();

  constructor(public navCtrl: NavController, private file: File) {

  }

}
