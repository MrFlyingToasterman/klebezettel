import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//Import für SQL
import { Storage } from '@ionic/storage';
//Import für Toast
import { ToastController } from 'ionic-angular';
//Import für Event Handeling über Broadcast
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

//Global varz
lang:string;
fontsize:string;
welcomemsg_toogler:string;
save_hint:string;
font_color:string;
bg_color:string;
//Lang Varz
reminder:string;
wrotedata:string;
header:string;
fontsite_text:string;
lang_text:string;
welcomemsg_toogle:string;
font_color_text:string;
bg_color_text:string;
black:string;
red:string;
blue:string;
yellow:string;
orange:string;
white:string;
green:string;
tardis:string;

  constructor(public navCtrl: NavController, private storage: Storage, public toastCtrl: ToastController, public events: Events) {

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
    //Promiseo'mon: Im gonna catch u all!
    setTimeout(() => {
      //Read DB and get fontcolor
      storage.get("fontcolor").then((val) => {
        this.font_color = val;
        console.log("[INFO] DB loaded fontcolor");
      });
    }, 1000);
    setTimeout(() => {
      //Read DB and get bgcolor
      storage.get("bgcolor").then((val) => {
        this.bg_color = val;
        console.log("[INFO] DB loaded bgcolor");
      });
  }, 1000);
    //Read DB and get save_hint
    storage.get("save_hint").then((val) => {
      this.save_hint = val;
      console.log("[INFO] DB loaded savehint");
    });

    //Read DB and get fontsize
    storage.get("welcomemsg_toogler").then((val) => {
      this.welcomemsg_toogler = val;
      console.log("[INFO] DB loaded welcomemsg_toogler");
    });

    //Waiting for Promise
    if(this.save_hint == "0") {
      setTimeout(() => {
        //Reminder for saving
        this.toastSTRG(this.reminder, "top");
      }, 2000);
      storage.set("save_hint", "1");
    }
  }

  saveSettings() {
    this.storage.set("lang", this.lang);
    this.storage.set("fontsize", this.fontsize);
    this.storage.set("welcomemsg_toogler", this.welcomemsg_toogler);
    this.storage.set("fontcolor", this.font_color);
    this.storage.set("bgcolor", this.bg_color);
    console.log("[INFO] Wrote new data to DB");
    this.toastSTRG(this.wrotedata, "top");
    //Refresh - Help me navCtrl, you're my only hope
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
    this.events.publish("shouldReloadData");
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
          this.font_color_text = "Font color:";
          this.bg_color_text = "Background color:";
          this.black = "Black";
          this.red = "Red";
          this.blue = "Blue";
          this.yellow = "Yellow";
          this.orange = "Orange";
          this.white = "White";
          this.green = "Green";
          this.tardis = "Tardis Blue";
        break;
        case "de":
          console.log("[INFO] Settings loading lang: >de<");
          this.reminder = "Vergessen Sie nicht Ihre Konfiguration zu speichern!";
          this.wrotedata = "Konfiguration gespeichert!";
          this.header = "Einstellungen";
          this.fontsite_text = "Schriftgröße";
          this.lang_text = "Sprache";
          this.welcomemsg_toogle = "Willkommensnachricht";
          this.font_color_text = "Textfarbe:";
          this.bg_color_text = "Hintergrundfarbe:";
          this.black = "Schwarz";
          this.red = "Rot";
          this.blue = "Blau";
          this.yellow = "Gelb";
          this.orange = "Orange";
          this.white = "Weiß";
          this.green = "Grün";
          this.tardis = "Tardis Blau";
        break;
        default:
          console.log("[FAIL] Micro$oft be like: Something happend.. (Maybe the Promise was not send, slow device ?)");
        break;
      }
    }, 1000);

  }

}
