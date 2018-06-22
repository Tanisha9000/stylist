import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {Http, Headers, RequestOptions} from '@angular/http';
import {ApiserviceProvider} from '../../providers/apiservice/apiservice';
import 'rxjs/add/operator/map';
import {FilterPage} from '../filter/filter';
import {LoginPage} from '../login/login';

@IonicPage()
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html',
})
export class SignupPage {
    rolee: string;
    m :number;
    data = {
        username: '',
        address: '',
        email: '',
        phone: '',
        password: '',
        cpassword: '',
        role: '',
        question:''

    }
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public apiservice: ApiserviceProvider,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private http: Http,
        public toastCtrl: ToastController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SignupPage');
    }
    onInput(e) {
        console.log(e);
        console.log("input is triggered");
        if (this.data.password == "") {
            let alert = this.alertCtrl.create({
                title: 'Error ',
                subTitle: 'Enter password first',
                buttons: ['OK']
            });
            alert.present();
        } else {
            if (this.data.password == this.data.cpassword) {
                this.m = 1;
                setTimeout(() => {
                    this.m = 3;
                }, 2000)
            } else {
                this.m = 0;
            }
        }
    }
    notify(vall){
        console.log(vall)
        if(vall == "stylist"){
            this.rolee = "Salon Personnel";
        }
        if(vall == "salon"){
            this.rolee = "Salon Owner";
        }
    }
    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }

    home_go(formdata) {
        console.log(formdata.value)
        if (formdata.value.password != formdata.value.cpassword) {
            let alert = this.alertCtrl.create({
                title: 'Error ',
                subTitle: 'Passwords must match.',
                buttons: ['Try Again']
            });
            alert.present();
        } else {
        if(formdata.value.rr == 0){
            let alert = this.alertCtrl.create({
                title: 'Alert',
                subTitle: 'SORRY! You must be at least 18 years old to continue.',
                buttons: ['Dismiss']
            });
            alert.present();
            
        } else {

            var postdata = {
                email: formdata.value.email,
                password: formdata.value.password,
                phone_number: formdata.value.phone,
                role: formdata.value.role,
                eligible: formdata.value.rr,
                name: formdata.value.username,
                address: formdata.value.address
            }
            var serialized_all = this.serializeObj(postdata);
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
            let options = new RequestOptions({headers: headers});
            this.http.post(this.apiservice.base_url + '/users/signup', serialized_all, options)
                .map(res => res.json())
                .subscribe((response) => {
                    console.log(response);
                    let toast = this.toastCtrl.create({
                            message: response.msg,
                            duration: 3000,
                            position: 'top'
                        });
                    if(response.status == true){
                        toast.present();
                     //   localStorage.setItem('userdata',JSON.stringify(response.data));
                        this.navCtrl.push(LoginPage);
                    }else{
                        toast.present();
                    }
                })
            }
        }

    }


}
