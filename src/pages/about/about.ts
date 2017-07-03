import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//Import für SQL
import { Storage } from '@ionic/storage';
//Import für Toast
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

//Hardcoded in the Moment!
lang:string;
fontsize:string;

  constructor(public navCtrl: NavController, private storage: Storage, public toastCtrl: ToastController) {
    //Read DB and get lang
    storage.get("lang").then((val) => {
      this.lang = val;
      console.log("[INFO] DB loaded lang");
    });
    //Read DB and get fontsize
    storage.get("fontsize").then((val) => {
      this.fontsize = val;
      console.log("[INFO] DB loaded fontsize");
    });

    //Reminder for saving
    this.toastSTRG("Do not forget to save your config!", "top");
  }

  saveSettings() {
    this.storage.set("lang", this.lang);
    this.storage.set("fontsize", this.fontsize);
    console.log("[INFO] Wrote new data to DB");
    this.toastSTRG("Config saved!", "top");
  }

  toastSTRG(msg:string, position:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: position,
      duration: 3000
    });
    toast.present();
  }

}
