import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//Import für Modal Popup
import { ViewController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public params: NavParams, public viewCtrl: ViewController) {
    this.item = this.params.get('filename');
    console.log("Opening File: >" + this.item + "<");
  }

  dismiss() {
      this.viewCtrl.dismiss();
  }

}
