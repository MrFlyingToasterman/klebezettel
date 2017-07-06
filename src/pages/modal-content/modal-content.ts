import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//Import für Modal Popup
import { ViewController } from 'ionic-angular';
//Import für Dateioperationen; Schreiben; Lesen
import { File } from '@ionic-native/file';
//Import für Toast
import { ToastController } from 'ionic-angular';
//Import für SQL
import { Storage } from '@ionic/storage';
//Import für Alert Dialoge
import { AlertController } from 'ionic-angular';
//Import für Plattform z.B. um BackBtn Event abzufangen
import { Platform } from 'ionic-angular';


/**
 * Generated class for the ModalContentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-content',
  templateUrl: 'modal-content.html',
})
export class ModalContentPage {

  //Global varz
  lang:string;
  item: string = "";
  inputValue:string;
  value: string = "";
  fontsize:string = "";
  fontcolor:string = "";
  bgcolor:string = "";
  bbe:boolean = true;
  autosave:boolean;
  //Lang Varz
  savedmsg:string;
  placeholder:string;
  confirm:string;
  confirm_msg:string;
  agree:string;
  disagree:string;

  constructor(public navCtrl: NavController, public params: NavParams, public viewCtrl: ViewController, private file: File, public toastCtrl: ToastController, private storage: Storage, public alertCtrl: AlertController, public plt: Platform) {

    //Catch BackBTN Event
    plt.ready().then( ()=> {
      plt.registerBackButtonAction( ()=> {
        this.showConfirm();
      })
    });​

    //Read DB and get lang
    this.storage.get("lang").then((val) => {
      this.lang = val;
      console.log("[INFO] DB loaded lang");
    });

    //Read DB and get fontsize
    storage.get("fontsize").then((val) => {
      this.fontsize = val;
      console.log("[INFO] DB loaded fontsize");
    });

    //Read DB and get fontcolor
    storage.get("fontcolor").then((val) => {
      this.fontcolor = val;
      console.log("[INFO] DB loaded fontcolor");
    });

    //Read DB and get bgcolor
    storage.get("bgcolor").then((val) => {
      this.bgcolor = val;
      console.log("[INFO] DB loaded bgcolor");
    });

    //Read DB and get autosave
    storage.get("autosave").then((val) => {
      this.autosave = val;
      console.log("[INFO] DB loaded autosave");
    });

    //Loading Lang
    this.langInit();

    this.item = this.params.get("filename");
    console.log("[INFO] Opening File: >" + this.item + "<");
    //Read Text from File
    this.file.readAsText(this.file.dataDirectory, this.item).then((content)=> {
      this.value = content;
    })

    document.addEventListener("backbutton", () => {
      console.log("[WARN] BackBtn pushed");
      //console.log("TextboxVal: " + this.inputValue);
      //this.showConfirm();
      document.removeEventListener("backbutton");
    });

  }

  showConfirm() {
    if(this.autosave == true) {
      console.log("[INFO] Autosave = true!");
      this.bbe = false;
      this.dismiss();
    }
    if(this.value == null || this.value == "") {
      console.log("[WARN] Nothing to write");
      this.viewCtrl.dismiss();
      this.bbe = false;
    }
    if(this.bbe) {
      this.bbe = false;
      let confirm = this.alertCtrl.create({
        title: this.confirm,
        message: this.confirm_msg,
        buttons: [
          {
            text: this.disagree,
            handler: () => {
              console.log("Saved changes");
              this.dismiss();
            }
          },
          {
            text: this.agree,
            handler: () => {
              console.log("Discard changes");
              this.viewCtrl.dismiss();
            }
          }
        ]
      });
      confirm.present();
    }
  }

  dismiss() {
      console.log("[INFO] Writing Stuff to >" +  this.item + "<");
      this.inputValue = this.value + "";
      console.log("[INFO] Content to save: >" + this.inputValue + "<");
      this.file.writeExistingFile(this.file.dataDirectory, this.item, this.inputValue);
      this.presentToast();
      //Catch BackBTN Event
      this.plt.ready().then( ()=> {
        this.plt.registerBackButtonAction( ()=> {
          this.freeBBE(); //This is pretty useless. See it as kinda reset
        })
      });​
      this.viewCtrl.dismiss();
  }

  freeBBE() {
    this.bbe = true;
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.savedmsg,
      duration: 1000
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
          this.savedmsg = "Saved note";
          this.placeholder = "Enter your thoughts";
          this.confirm = "Discard changes ?";
          this.confirm_msg = "You did NOT save your file! Everything you've might have done is gone if you dont save!";
          this.agree = "Discard changes";
          this.disagree = "Save changes";
        break;
        case "de":
          console.log("[INFO] Settings loading lang: >de<");
          this.savedmsg = "Notiz gespeichert";
          this.placeholder = "Halten Sie Ihre Gedanken fest...";
          this.confirm = "Änderungen verwerfen ?";
          this.confirm_msg = "Alles was Sie verändert haben geht verloren wenn Sie nicht speichern!";
          this.agree = "Änderungen verwerfen";
          this.disagree = "Änderungen speichern";
        break;
        default:
          console.log("[FAIL] Micro$oft be like: Something happend.. (Maybe the Promise was not send, slow device ?)");
        break;
      }
    }, 1000);
  }

}
