import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController } from 'ionic-angular';
import { ApiserviceProvider } from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';
import {PostdetailPage} from '../postdetail/postdetail';

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
    userdata: any = [];
    role : any = '';
    list : any = [];
    constructor (
        public navCtrl: NavController, 
        public navParams: NavParams,
        public http: Http,
        public apiservice: ApiserviceProvider,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
    ) {
        if (localStorage.getItem('userdata')) {
            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            console.log(this.userdata);
            this.role = this.userdata.data.role;
        }
        //alert('s')
        this.get_list();
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

   doRefresh(refresher) {
        console.log('Begin async operation', refresher);
        this.get_list();
        setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
        }, 2000);
      }

     public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }
    get_list(){
        let postdata={
            user_id : this.userdata.data.id,
            role : this.userdata.data.role
        }
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        var serialized = this.serializeObj(postdata);
  //     alert(JSON.stringify(postdata))
//return false;
        loading.present();
        
        //loading.dismiss();
        //http://netin.gangtask.com/salon/api/notifications/showallnotifications
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.apiservice.base_url + '/notifications/showallnotifications', serialized, options)
            .map(res => res.json())
            .subscribe((response) => {
                loading.dismiss();
                console.log(response);
              //  alert(response);
                if (response.status == true) {
                    this.list = response.data;
                } else {
                
                }
                this.apiservice.simpleToast(response.msg, 3000, 'top');
                
        }, err => {
            
             loading.dismiss();
             this.apiservice.simpleToast("Network error.", 3000, 'top');
        })
    }

    see_details(id){
        console.log(id)
        this.navCtrl.push(PostdetailPage,{
            jobid : id,
            notification : true
        });
    }

}
