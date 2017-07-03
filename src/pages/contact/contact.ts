import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//Import für SQL
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  //Global Varz
  //Lang varz
  lang:string;
  header:string;
  source:string;

  constructor(public navCtrl: NavController, private storage: Storage) {
    this.langInit();
  }

  langInit() {
    this.storage.get("lang").then((val) => {
      this.lang = val;
      console.log("[INFO] DB loaded lang");
    });
    //Wait for Promise
    setTimeout(() => {
      console.log("[INFO] Starting langSetup for >" + this.lang + "<");
      switch(this.lang) {
        case "en":
          console.log("[INFO] Home loading lang: >en<");
          this.header = "Contact";
          this.source = "Source:";
        break;
        case "de":
          console.log("[INFO] Home loading lang: >de<");
          this.header = "Kontakt";
          this.source = "Quellcode:";
        break;
        default:
          console.log("[FAIL] Micro$oft be like: Something happend.. (Maybe the Promise was not send, slow device ?)");
        break;
      }
    }, 400);

  }

}
