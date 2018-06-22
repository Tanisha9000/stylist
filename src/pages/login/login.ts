import {Component} from '@angular/core';
import {IonicPage,Platform, NavController, NavParams, ToastController} from 'ionic-angular';
import { Events } from 'ionic-angular';
import {ForgotPage} from '../forgot/forgot';
import {SignupPage} from '../signup/signup';
import {HomePage} from '../home/home';
import {FilterPage} from '../filter/filter';
import {Http, Headers, RequestOptions} from '@angular/http';
import {ApiserviceProvider} from '../../providers/apiservice/apiservice';
import {ProfilePage} from '../profile/profile';
import { FCM } from '@ionic-native/fcm';
@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    bit: any=0;
    data = {
        email: '',
        pass: ''
    }
    token : any = '';
    inputtype: any = "password";
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public apiservice: ApiserviceProvider,
        private http: Http,
        public toastCtrl: ToastController,
        public events: Events,
        public fcm : FCM,
        public platform : Platform) {
//        if(localStorage.getItem('userdata')){
//            this.navCtrl.setRoot(ProfilePage);
//        }
        this.get_token()
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    forgot_go() {
        this.navCtrl.push(ForgotPage);
    }
    signup_go() {
        this.navCtrl.push(SignupPage);
    }
    eyeclicked(val) {
     //   alert(val)
        if (val == "text") {
            this.inputtype = "password";
        } else if (val == "password") {
            this.inputtype = "text";
        }
    }

    get_token(){
        if(this.platform.is('cordova')){
            this.fcm.getToken().then(token => {
               // alert('token');
                //alert(token);
             
                if(token == ''){
                   this.fcm.onTokenRefresh().subscribe(token1 => {
                        //alert('token1')
                        //alert(token1)
                        this.token = token1
                   });
                } else {
                    this.token = token;
                }
                
            });
        } else {
            //alert('browser')
            this.token = 'logged_in_from_browser'
        }  
    }

    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }
    login(formdata) {
        var postdata = {
            username: formdata.value.email,
            password: formdata.value.pass,
            token : this.token
        }
        var serialized_all = this.serializeObj(postdata);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.apiservice.base_url + '/users/login', serialized_all, options)
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
                    this.bit=1;
                    var useable_data = {
                            data : response.data,
                            base_url : response.salonbaseurl,
                            userbaseurl : response.userbaseurl
                     };
                     localStorage.setItem('advertisement',this.bit)
                    localStorage.setItem('userdata',JSON.stringify(useable_data));
                     this.events.publish('userdata', response.data);
                     this.navCtrl.push(FilterPage);
                } else {
                    toast.present();
                }
            })

    }

}
