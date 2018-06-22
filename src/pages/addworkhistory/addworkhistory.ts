import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import {ApiserviceProvider} from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';
import {WorkhistoryPage} from '../workhistory/workhistory';
@IonicPage()
@Component({
    selector: 'page-addworkhistory',
    templateUrl: 'addworkhistory.html',
})
export class AddworkhistoryPage {
data={
    username:'',
    position:'',
    datefrom:'',
    dateto:'',
    desc:''
}
userdata :any=[];
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public apiservice: ApiserviceProvider,
        private http: Http,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController) 
    {
        this.userdata = JSON.parse(localStorage.getItem('userdata'));
        console.log(this.userdata)
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AddworkhistoryPage');
    }
    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }
    addwork(formdata) {
        var postdata = {
            user_id: this.userdata.data.id,
            position: formdata.value.position,
            salon_name: formdata.value.username,
            start_date: formdata.value.datefrom,
            end_date: formdata.value.dateto,
            description: formdata.value.desc 
        }
        var serialized_all = this.serializeObj(postdata);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
       let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });

        loading.present();
        this.http.post(this.apiservice.base_url + '/workexperiences/add_workhistory', serialized_all, options)
            .map(res => res.json())
            .subscribe((response) => {
                console.log(response);
                loading.dismiss();
                let toast = this.toastCtrl.create({
                    message: response.msg,
                    duration: 3000,
                    position: 'top'
                });
                if (response.status == true) {
                    toast.present();
                    this.navCtrl.push(WorkhistoryPage)
                } else {
                    toast.present();
                }
            },(err)=>{
                 loading.dismiss();
                 let toast = this.toastCtrl.create({
                    message: 'Network error. Please try again.',
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
            })

    }

}
