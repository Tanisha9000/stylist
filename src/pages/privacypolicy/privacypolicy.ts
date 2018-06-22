import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';
import { ApiserviceProvider } from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-privacypolicy',
  templateUrl: 'privacypolicy.html',
})
export class PrivacypolicyPage {
  content:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public apiservice: ApiserviceProvider,
    private http: Http,
    public loadingCtrl: LoadingController,
   ) {
     this.getloc();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivacypolicyPage');
  }
  public serializeObj(obj) {
    var result = [];
    for (var property in obj)
        result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
}
getloc() {
  let loading = this.loadingCtrl.create({
    spinner: 'hide',
    content: 'Loading Please Wait...'
});
loading.present();
  let postdata={
    name: 'privacypolicy'
  }
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
    let options = new RequestOptions({headers: headers});
    this.http.post(this.apiservice.base_url + '/users/staticpage', postdata, options)
        .map(res => res.json())
        .subscribe((response) => {
          loading.dismiss();
            console.log(response);
            if(response.status == true){
            this.content = response.data[0].content;
           }
        })
}

}
