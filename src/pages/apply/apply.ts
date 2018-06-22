import { Component } from '@angular/core';
import { IonicPage, NavController, Events, NavParams,LoadingController, ToastController } from 'ionic-angular';
import { ApiserviceProvider } from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';
@IonicPage()
@Component({
  selector: 'page-apply',
  templateUrl: 'apply.html',
})
export class ApplyPage {
    paypref: any=[];
data={
  pay:'',
  startdate:'',
  available:'',
  otherinfo:''
}
userdata:any=[];
myDate= new Date().toISOString();
  constructor(     
    public navCtrl: NavController, 
    public navParams: NavParams,
    public apiservice: ApiserviceProvider,
    private http: Http,
      public loadingCtrl: LoadingController,
    public events : Events,
    public toastCtrl: ToastController
    ) 
  {
     // alert(this.navParams.get('index'));
    if (localStorage.getItem('userdata')) {
      this.userdata = JSON.parse(localStorage.getItem('userdata'));
      console.log(this.userdata);
    }
    if(localStorage.getItem('paytype')){
        var paypref = JSON.parse(localStorage.getItem('paytype'));
        for(let i in paypref){
            if(paypref[i] == 'comm' || paypref[i] == 'commission'){
                if(this.paypref.indexOf("Commission")== -1){
                    this.paypref.push('Commission');
                }

            } else if (paypref[i]=='booth' || paypref[i]=='Booth_Rent'){
               if(this.paypref.indexOf("Booth Rent")== -1){
                    this.paypref.push('Booth Rent');
               }
            } else {
                if(this.paypref.indexOf("Salary")== -1){
                 this.paypref.push('Salary');
               }
            }
        }
        
        console.log(this.paypref)
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyPage');
  }

  submit(formdata){
    
    if(this.data.pay == 'Commission'){
         this.data.pay = 'comm'
    } else if (this.data.pay=='Booth Rent'){
       this.data.pay = 'booth'
    } else {
       this.data.pay = 'salary';
    }
        
    let postdata={
      user_id : this.userdata.data.id,
      salonjob_id : this.navParams.get('salonid'),
      position: this.navParams.get('position'),
      paytype: this.data.pay,
      startdate : this.data.startdate,
      availability: '',//this.data.available,
      otherinfo : this.data.otherinfo
    }
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
    let options = new RequestOptions({headers: headers});
 let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: 'Loading Please Wait...'
    });
    loading.present();
    this.http.post(this.apiservice.base_url + '/salonjobs/applyjobs', postdata, options)
        .map(res => res.json())
        .subscribe((response) => {
          console.log(response)
                   loading.dismiss();
          if(response.status == true){
             let toast = this.toastCtrl.create({
                message: response.msg,
                duration: 3000,
                position: 'top'
            });
            toast.present();
            this.data={
              pay:'',
              startdate:'',
              available:'',
              otherinfo:''
            }
              this.events.publish('update_status',this.navParams.get('index'));
            
          }
        }, (err)=>{
           loading.dismiss();
           this.apiservice.network_err();

       })
  }

}
