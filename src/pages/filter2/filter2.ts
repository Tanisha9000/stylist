import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController , ModalController, Platform} from 'ionic-angular';

/**
 * Generated class for the Filter2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filter2',
  templateUrl: 'filter2.html',
})
export class Filter2Page {

  constructor(public navCtrl: NavController,  public platform: Platform,   public params: NavParams,  public viewCtrl: ViewController) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Filter2Page');
  }
 dismiss() {
    this.viewCtrl.dismiss();
  }
}
