import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//Import für Alert Dialoge
import { AlertController } from 'ionic-angular';
//Import für Dateioperationen; Schreiben; Lesen
import { File } from '@ionic-native/file';
//Import für Popup Menu
import { ActionSheetController } from 'ionic-angular';
//Import für Modal Popup
import { ModalController } from 'ionic-angular';
//Import für zugriff auf modal-content
import { ModalContentPage } from "../modal-content/modal-content"
//Import für SQL
import { Storage } from '@ionic/storage';
//Import für Event Handeling über Broadcast
import { Events } from 'ionic-angular';
//Import für Toast
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  //Global Varz
  items = [];
  welcomemsg_toogler:boolean;
  //Lang Varz
  lang:string;
  welcomemsg:string;
  header:string;
  create_note:string;
  titel:string;
  cancel:string;
  save:string;
  delete:string;
  addnotemsg:string;
  modify:string;
  rename:string;
  rename_text:string;
  copy:string;
  copy_msg:string;
  confirm:string;
  confirm_msg:string;
  agree:string;
  disagree:string;
  file_removed_msg:string;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private file: File, public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController, private storage: Storage, public events: Events, public toastCtrl: ToastController) {
    //Initial Setup for DB
    storage.get("initialsetup").then((val) => {
      if (val == null) {
        console.log("[INFO] INITIAL SETUP! Setting up Database!");
        //Writing to Database
        storage.set("initialsetup", "1");
        storage.set("lang", "en");
        storage.set("fontsize", "20");
        storage.set("fontcolor", "black");
        storage.set("bgcolor", "white");
        storage.set("autosave", "false");
        storage.set("welcomemsg_toogler", "true");
        storage.set("save_hint", "0");
      }
    });
    //Waiting for Promise | Hopefully this helps to avoid the InitialStart Crash
    setTimeout(() => {
      this.langInit();
    }, 900);
    this.readFiles();
    events.subscribe('shouldReloadData', () => {
      //Waiting for ReloadEvent
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    });
  }

  presentActionSheet(item: string) {
   let actionSheet = this.actionSheetCtrl.create({
     title: this.modify,
     buttons: [
       {
         icon: "trash",
         text: this.delete,
         role: "destructive",
         handler: () => {
           console.log("[WARN] Destructive clicked for: >" + item + "< ");
           this.showConfirm(item);
         }
       },{
         icon: "md-color-wand",
         text: this.rename,
         handler: () => {
           console.log("[WARN] Rename clicked for: >" + item + "< ");
           this.renamePrompt(item);
         }
       },{
         icon: "md-copy",
         text: this.copy,
         handler: () => {
           console.log("[INFO] copy clicked for: >" + item + "< ");
           this.file.copyFile(this.file.dataDirectory, item, this.file.dataDirectory, this.copy_msg + item);
           setTimeout(() => {
             this.readFiles();
           }, 900);
         }
       },{
         icon: 'close',
         text: this.cancel,
         role: 'cancel',
         handler: () => {
           console.log('[INFO] Cancel clicked');
         }
       }
     ]
   });
   actionSheet.present();
 }

  addNote() {
    let prompt = this.alertCtrl.create({
      title: this.create_note,
      message: this.addnotemsg,
      inputs: [
        {
          name: "title",
          placeholder: this.titel,
          id: "inputField0"
        },
      ],
      buttons: [
        {
          text: this.cancel,
          handler: data => {
            console.log("[INFO] Cancel clicked");
          }
        },
        {
          text: this.save,
          handler: data => {
            console.log("[INFO] Saved clicked >" + data.title + "<");
            this.file.createFile(this.file.dataDirectory, data.title + ".txt", false);
            this.readFiles();
          }
        }
      ]
    });
    prompt.present().then( () => {
      document.getElementById('inputField0').focus();
    });
  }

  renamePrompt(item:string) {
    let prompt = this.alertCtrl.create({
      title: this.rename,
      message: this.rename_text,
      inputs: [
        {
          name: "title",
          placeholder: this.titel,
          id: "inputField1"
        },
      ],
      buttons: [
        {
          text: this.cancel,
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.rename,
          handler: data => {
            console.log("Saved clicked");
            console.log("[WARN] Rename >" + item + "< to >" + data.title + ".txt<");
            this.file.moveFile(this.file.dataDirectory, item, this.file.dataDirectory, data.title + ".txt");
            setTimeout(() => {
              this.readFiles();
            }, 900);
          }
        }
      ]
    });
    prompt.present();
    //document.getElementById('inputField1').focus();
  }

//Print selected item and run Modal Popup
itemSelected(item: string) {
    let modal = this.modalCtrl.create(ModalContentPage, item);
    modal.present().catch((err) => {
      console.log("[WARN] " + err);
    });
}

showConfirm(item:string) {
    let confirm = this.alertCtrl.create({
      title: this.confirm,
      message: this.confirm_msg,
      buttons: [
        {
          text: this.disagree,
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: this.agree,
          handler: () => {
            console.log('Agree clicked');
            this.file.removeFile(this.file.dataDirectory, item);
            console.log("[WARN] Removed: >" + item + "< ");
            this.readFiles();
            this.toastSTRG(this.file_removed_msg, "top");
          }
        }
      ]
    });
    confirm.present();
  }

readFiles() {
  console.log("[INFO] Starting refresh");
  this.file.listDir(this.file.dataDirectory, "").then( (files) => {
    for (let f of files) {
      console.log("[INFO] Files >" + f.name + "<");
    }
    //Clean Array
    this.items = [];
    this.items = [null];
    var i2 = 0;
    for (var i = 0; i < files.length; i++) {
      if (files[i].name != "Documents" && files[i].name != "files") {
        this.items[i2] = "" + files[i].name;
        i2++;
      }
    }
  }).catch((err) => {
    console.log("[WARN] Errors >" + err + "<");
    setTimeout(() => {
      this.readFiles(); //On some slow devices this will need a kick
    }, 1000);
  });
}


createFileAndWrite(text: string, filename: string) {
        this.file.checkFile(this.file.dataDirectory, filename)
        .then(doesExist => {
            console.log("doesExist : " + doesExist);
            if(!doesExist) {
                return this.file.createFile(this.file.dataDirectory, filename, false)
                .then(FileEntry => this.writeToFile(text, filename))
                .catch(err => console.log('[WARN] Couldnt create file'));
            }
            return this.writeToFile(text, filename);
        }).catch(err => console.log('[WARN] Directory doesnt exist' + err));
    }

    writeToFile(text: string, filename: string) {
        this.file.writeExistingFile(this.file.dataDirectory, filename, text)
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
      this.storage.get("lang").then((val) => {
        this.lang = val;
        console.log("[INFO] DB loaded lang");
      });
      this.storage.get("welcomemsg_toogler").then((val) => {
        this.welcomemsg_toogler = val;
        console.log("[INFO] DB loaded welcomemsg_toogler");
      });
      //Wait for Promise
      setTimeout(() => {
        console.log("[INFO] Starting langSetup for >" + this.lang + "<");
        switch(this.lang) {
          case "en":
            console.log("[INFO] Home loading lang: >en<");
            this.welcomemsg = "Welcome to Klebezettel!";
            this.header = "Notes";
            this.addnotemsg = "Enter a name for the new note";
            this.create_note = "Create note";
            this.titel = "Title";
            this.cancel = "Cancel";
            this.save = "Save";
            this.delete = "Delete";
            this.modify = "Modify your note";
            this.rename = "Rename";
            this.rename_text = "Enter a new name:";
            this.copy = "Copy";
            this.copy_msg = "[COPY] ";
            this.confirm = "Are you sure ?";
            this.confirm_msg = "After you delete a file, its gone forever!";
            this.agree = "Agree";
            this.disagree = "Disagree";
            this.file_removed_msg = "File removed!";
          break;
          case "de":
            console.log("[INFO] Home loading lang: >de<");
            this.welcomemsg = "Willkommen zu Klebezettel!";
            this.header = "Notizen";
            this.addnotemsg = "Tragen Sie einen Namen für die neue Notiz ein";
            this.create_note = "Neue Notiz erstellen";
            this.titel = "Titel";
            this.cancel = "Abbrechen";
            this.save = "Speichern";
            this.delete = "Löschen";
            this.modify = "Bearbeiten Sie Ihre Notizen";
            this.rename = "Umbenennen";
            this.rename_text = "Tragen Sie den gewünschten Namen ein:";
            this.copy = "Duplikat anfertigen";
            this.copy_msg = "[KOPIE] ";
            this.confirm = "Sind Sie sicher ?";
            this.confirm_msg = "Nachdem Sie die Datei gelöscht haben ist sie für immer weg!";
            this.agree = "Legitimieren";
            this.disagree = "Ablehnen";
            this.file_removed_msg = "Datei gelöscht!";
          break;
          default:
            console.log("[FAIL] Micro$oft be like: Something happend.. (Maybe the Promise was not send, slow device ?)");
          break;
        }
        console.log("[INFO] Activate welcomemsg >" + this.welcomemsg_toogler + "<");
        if (this.welcomemsg_toogler != true) {
          this.welcomemsg = "";
          console.log("[INFO] Reset Welcome MSG");
        }
      }, 1000);


    }

    refreshMe() {
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }


}
