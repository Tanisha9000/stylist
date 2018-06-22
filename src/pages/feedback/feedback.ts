import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController} from 'ionic-angular';
import {ApiserviceProvider} from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';

@IonicPage()
@Component({
    selector: 'page-feedback',
    templateUrl: 'feedback.html',
})
export class FeedbackPage {
    unclass: string = "satisfiedbtn ";
    data = {
        comment: '',
        review:0
    }
    userdata: any = [];
    bit: any='';
    chgclass: string = "satisfiedbtn green";
    //dusribit:number=0;
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
            // this.data.review = 3;
        }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FeedbackPage');
    }
    onModelChange(event){
        console.log(event)
        this.data.review = event;
    }
    satisfy() {
        //this.bit = 1;
        //this.chgclass = "babi";
        //if (this.bit == 0) {
        this.bit = 1;
        this.chgclass = "babi";
        this.unclass = "satisfiedbtn ";
        //}
        console.log(this.bit)
    }
    unsatisfy() {
        //this.bit = 0;
        //this.unclass = "unsatisfy";
        //if (this.bit == 1 && this.chgclass == "babi") {
            this.bit = 0;
            this.chgclass = "satisfiedbtn green";
            this.unclass = "unsatisfy grey";
        //}
        //if (this.bit == 0) {
        //    this.unclass = "unsatisfy";
        //}
        console.log(this.bit)
    }
    feedback() {
            //alert(this.bit);
this.bit=this.bit.toString();
!this.bit
        if (this.bit == "") {
             console.log(this.bit);
            let alert1 = this.alertCtrl.create({
                title: 'Alert!',
                subTitle: 'Please select whether satisfied or unsatisfied!',
                buttons: ['Ok']
            });
            alert1.present();
        } else {
            let postdata = {
                user_id: this.userdata.data.id,
                salon_id: null,
                comment: this.data.comment,
                status: this.bit,
                rating : this.data.review
            }
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
            let options = new RequestOptions({headers: headers});
            this.http.post(this.apiservice.base_url + '/salons/addcomment', postdata, options)
                .map(res => res.json())
                .subscribe((response) => {
                    console.log(response);
                    if (response.status == true) {
                        let toast = this.toastCtrl.create({
                            message: response.msg,
                            duration: 3000,
                            position: 'top'
                        });
                        toast.present();
                        this.data = {
                            comment: '',
                            review:0
                        }
                        this.unclass = "satisfiedbtn ";
                        this.chgclass = "satisfiedbtn green";
                    }
                })

        }

    }

}
