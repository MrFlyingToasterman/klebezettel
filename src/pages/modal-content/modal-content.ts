import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//Import für Modal Popup
import { ViewController } from 'ionic-angular';
//Import für Dateioperationen; Schreiben; Lesen
import { File } from '@ionic-native/file';
//Import für Toast
import { ToastController } from 'ionic-angular';


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

  item: string = "";
  inputValue:string;
  value: string = "";

  constructor(public navCtrl: NavController, public params: NavParams, public viewCtrl: ViewController, private file: File, public toastCtrl: ToastController) {
    this.item = this.params.get('filename');
    console.log("[INFO] Opening File: >" + this.item + "<");
    //Read Text from File
    this.file.readAsText(this.file.dataDirectory, this.item).then((content)=> {
      this.value = content;
    })
    //Set focus on ion-textarea
    //document.getElementById('thoughtsBox').focus(); //Currently not working, idk y; returns null
  }

  dismiss() {
    console.log("[INFO] Writing Stuff to >" +  this.item + "<");
    console.log("[INFO] Content to save: >" + this.inputValue + "<");
    this.file.writeExistingFile(this.file.dataDirectory, this.item, this.inputValue);
    this.presentToast();
    this.viewCtrl.dismiss();
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Saved note',
      duration: 1000
    });
    toast.present();
  }

}
