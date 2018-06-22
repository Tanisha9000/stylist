import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {ApiserviceProvider} from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';
import {LoginPage} from '../login/login';

@IonicPage()
@Component({
    selector: 'page-forgot',
    templateUrl: 'forgot.html',
})
export class ForgotPage {
    data = {
        email: ''
    }
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public apiservice: ApiserviceProvider,
        private http: Http,
        public toastCtrl: ToastController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ForgotPage');
    }
    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }
    forgot(formdata) {
        var postdata = {
            email: formdata.value.email,
        }
        var serialized_all = this.serializeObj(postdata);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.apiservice.base_url + '/users/forgot', serialized_all, options)
            .map(res => res.json())
            .subscribe((response) => {
                console.log(response);
                let toast = this.toastCtrl.create({
                    message: response.msg,
                    duration: 3000,
                    position: 'top'
                });
                if (response.status == true) {
                    toast.present();
                    this.navCtrl.setRoot(LoginPage);
                } else {
                    toast.present();
                }
            })
    }

}
