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

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  items = [];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private file: File, public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController) {
    this.readFiles();
  }

  presentActionSheet(item: string) {
   let actionSheet = this.actionSheetCtrl.create({
     title: 'Modify your note',
     buttons: [
       {
         icon: 'trash',
         text: 'Delete',
         role: 'destructive',
         handler: () => {
           console.log("[WARN] Destructive clicked for: >" + item + "< ");
           this.file.removeFile(this.file.dataDirectory, item);
           console.log("[WARN] Removed: >" + item + "< ");
           this.readFiles();
         }
       },{
         icon: 'close',
         text: 'Cancel',
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
      title: 'Create note',
      message: "Enter a name for the new note",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          id: 'inputField0'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('[INFO] Cancel clicked');
          }
        },
        {
          text: 'Save',
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

//Print selected item and run Modal Popup
itemSelected(item: string) {
    //console.log("[INFO] Selected Item >" + item + "<");
    let modal = this.modalCtrl.create(ModalContentPage, item);
    modal.present().catch((err) => {
      console.log("[WARN] " + err);
    });
}



readFiles() {
  console.log("[INFO] Starting refresh");
  this.file.listDir(this.file.dataDirectory, "").then(
  (files) => {
    for (let f of files) {
      console.log("[INFO] Files >" + f.name + "<");
    }
    //Clean Array
    this.items = [ '', '' ];
    var i2 = 0;
    for (var i = 0; i < files.length; i++) {
      if (files[i].name != "Documents" && files[i].name != "files") {
        this.items[i2] = "" + files[i].name;
        i2++;
      }
    }
  }).catch((err) => {
    console.log("[WARN] Errors >" + err + "<");
    //this.readFiles(); //On some slow devices this will need a kick
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

    someEventFunc() {
      // This is an example usage of the above functions
      this.createFileAndWrite("Hello World - someEventFunc was called", "Testfile.txt");
    }


}
