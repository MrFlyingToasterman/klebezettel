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

//Global varz
lang:string;
fontsize:string;
welcomemsg_toogler:string;
//Lang Varz
reminder:string;
wrotedata:string;
header:string;
fontsite_text:string;
lang_text:string;
welcomemsg_toogle:string;

  constructor(public navCtrl: NavController, private storage: Storage, public toastCtrl: ToastController) {
    //Read DB and get lang
    storage.get("lang").then((val) => {
      this.lang = val;
      console.log("[INFO] DB loaded lang");
    });

    this.langInit();

    //Read DB and get fontsize
    storage.get("fontsize").then((val) => {
      this.fontsize = val;
      console.log("[INFO] DB loaded fontsize");
    });

    //Read DB and get fontsize
    storage.get("welcomemsg_toogler").then((val) => {
      this.welcomemsg_toogler = val;
      console.log("[INFO] DB loaded welcomemsg_toogler");
    });

    //Waiting for Promise
    setTimeout(() => {
      //Reminder for saving
      this.toastSTRG(this.reminder, "top");
    }, 2000);
  }

  saveSettings() {
    this.storage.set("lang", this.lang);
    this.storage.set("fontsize", this.fontsize);
    this.storage.set("welcomemsg_toogler", this.welcomemsg_toogler);
    console.log("[INFO] Wrote new data to DB");
    this.toastSTRG(this.wrotedata, "top");
  }

  toastSTRG(msg:string, position:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: position,
      duration: 3000
    });
    toast.present();
  }

  langInit() {
    //Wait for Promise
    setTimeout(() => {
      console.log("[INFO] Starting langSetup for >" + this.lang + "<");
      switch(this.lang) {
        case "en":
          console.log("[INFO] Settings loading lang: >en<");
          this.reminder = "Do not forget to save your config!";
          this.wrotedata = "Config saved!";
          this.header = "Settings";
          this.fontsite_text = "Fontsize";
          this.lang_text = "Language";
          this.welcomemsg_toogle = "Enable welcome msg";
        break;
        case "de":
          console.log("[INFO] Settings loading lang: >de<");
          this.reminder = "Vergessen Sie nicht Ihre Konfiguration zu speichern!";
          this.wrotedata = "Konfiguration gespeichert!";
          this.header = "Einstellungen";
          this.fontsite_text = "Schriftgröße";
          this.lang_text = "Sprache";
          this.welcomemsg_toogle = "Willkommensnachricht";
        break;
        default:
          console.log("[FAIL] Micro$oft be like: Something happend.. (Maybe the Promise was not send, slow device ?)");
        break;
      }
    }, 1000);

  }

}
