import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController} from 'ionic-angular';
import {ApiserviceProvider} from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';

@IonicPage()
@Component({
    selector: 'page-contactus',
    templateUrl: 'contactus.html',
})
export class ContactusPage {
userdata:any =''
    data:any = {};
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public apiservice: ApiserviceProvider,
        private http: Http,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController) {
            if (localStorage.getItem('userdata')) {
                this.userdata = JSON.parse(localStorage.getItem('userdata'));
                console.log(this.userdata);
            }
        }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FeedbackPage');
    }
   
    
    feedback() {
           console.log(this.data)
           //users/contactus
           var post_data = {
               name : this.data.name,
               email: this.data.email,
               message: this.data.message,
               role : this.userdata.data.role
           }
            let loading = this.loadingCtrl.create({
                spinner: 'hide',
                content: 'Please Wait...'
            });
            loading.present();
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
            let options = new RequestOptions({headers: headers});
            this.http.post(this.apiservice.base_url + '/users/contactus', post_data, options)
                .map(res => res.json())
                .subscribe((response) => {
                    console.log(response);
                     loading.dismiss();
                    let toast = this.toastCtrl.create({
                            message: response.msg,
                            duration: 3000,
                            position: 'top'
                        });
                    if(response.status == true){
                        toast.present();
                        this.data = {
                            name : '',
                            email: '',
                            message: '',
                        };
                    }else{
                        toast.present();
                    }
                },err=>{
                     loading.dismiss();
                      this.apiservice.network_err();
                })
    }

}
