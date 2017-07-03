import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

//Hardcoded in the Moment!
lang:string = "en";
fontsize = 20;

  constructor(public navCtrl: NavController) {

  }

}
