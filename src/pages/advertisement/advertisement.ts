import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import {ApiserviceProvider} from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';
/**
 * Generated class for the AdvertisementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-advertisement',
  templateUrl: 'advertisement.html',
})
export class AdvertisementPage {
imageadd:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,public apiservice: ApiserviceProvider,
    private http: Http) {
    localStorage.removeItem('advertisement')
      this.getadd();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdvertisementPage');
  }
  
dismiss() {
    //alert('modal dismiss')
   this.viewCtrl.dismiss();
 }
 
  getadd(){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.apiservice.base_url + '/users/advertisement', '', options)
            .map(res => res.json())
            .subscribe((response) => {
                console.log(response);
                if(response.status == true){
                    
                   this.imageadd = response.advurl+""+response.data.imge;
                }else{
                    this.imageadd = "assets/imgs/noad.jpg"; 
                }
            })     
 }

}
