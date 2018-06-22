import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {ApiserviceProvider} from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';
import {LoginPage} from '../login/login';

@IonicPage()
@Component({
    selector: 'page-changepassword',
    templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {
    data = {
        pass: '',
        repassword: ''
    }
    userdata: any = [];
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public apiservice: ApiserviceProvider,
        private http: Http,
        public toastCtrl: ToastController) {
        if (localStorage.getItem('userdata')) {
            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            console.log(this.userdata);
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ChangepasswordPage');
    }

    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }
    submitt(dataa) {
        var postdata = {
            id: this.userdata.data.id,
            old_password: dataa.value.pass,
            new_password: dataa.value.repassword
        }
        var serialized_all = this.serializeObj(postdata);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.apiservice.base_url + '/users/changepassword', serialized_all, options)
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
                                    localStorage.clear();
                                    this.navCtrl.setRoot(LoginPage);
                                } else {
                                    toast.present();
                                }
            })

    }

}
