import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//Import für Alert Dialoge
import { AlertController } from 'ionic-angular';
//Import für Dateioperationen; Schreiben; Lesen
import { File } from '@ionic-native/file';
//Import für Popup Menu
import { ActionSheetController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private file: File, public actionSheetCtrl: ActionSheetController) {

  }

  presentActionSheet() {
   let actionSheet = this.actionSheetCtrl.create({
     title: 'Modify your note',
     buttons: [
       {
         icon: 'trash',
         text: 'Delete',
         role: 'destructive',
         handler: () => {
           console.log('Destructive clicked');
         }
       },{
         icon: 'close',
         text: 'Cancel',
         role: 'cancel',
         handler: () => {
           console.log('Cancel clicked');
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
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  items = [
    'Pokémon Yellow',
    'Super Metroid',
    'Mega Man X',
    'The Legend of Zelda',
    'Pac-Man',
    'Super Mario World',
    'Street Fighter II',
    'Half Life',
    'Final Fantasy VII',
    'Star Fox',
    'Tetris',
    'Donkey Kong III',
    'GoldenEye 007',
    'Doom',
    'Fallout',
    'GTA',
    'Halo'
];

itemSelected(item: string) {
    console.log("Selected Item", item);
}


createFileAndWrite(text: string, filename: string) {
        this.file.checkFile(this.file.dataDirectory, filename)
        .then(doesExist => {
            console.log("doesExist : " + doesExist);
            if(!doesExist) {
                return this.file.createFile(this.file.dataDirectory, filename, false)
                .then(FileEntry => this.writeToFile(text, filename))
                .catch(err => console.log('Couldnt create file'));
            }
            return this.writeToFile(text, filename);
        }).catch(err => console.log('Directory doesnt exist'));
    }

    writeToFile(text: string, filename: string) {
        this.file.writeExistingFile(this.file.dataDirectory, filename, text)
    }

    someEventFunc() {
      // This is an example usage of the above functions
      this.createFileAndWrite("Hello World - someEventFunc was called", "Testfile");
    }


}
