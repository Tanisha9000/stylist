import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,LoadingController } from 'ionic-angular';
import { ApiserviceProvider } from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';

/**
 * Generated class for the PostjobsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-postjobs',
  templateUrl: 'postjobs.html',
})
export class PostjobsPage {
  dataa = {
    profess :'',
    quali:'',
    work:'',
    loc:'',
    zip : ''
  }
  userdata:any=[];
  pref:any=[];
  city:any=[];
  profession:any=[];
  check={
    booth: false,
    salary: false,
    comm: false
  }
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public apiservice: ApiserviceProvider,
    private http: Http,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,) 
  {
    if (localStorage.getItem('userdata')) {
      this.userdata = JSON.parse(localStorage.getItem('userdata'));
      console.log(this.userdata);
     }
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostjobsPage');
    this.getloc();
  }
  getloc() {
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
    let options = new RequestOptions({headers: headers});
    this.http.post(this.apiservice.base_url + '/cities/langcity', '', options)
        .map(res => res.json())
        .subscribe((response) => {
            console.log(response);
            for (let i of response.city) {
                this.city.push(i);
            }
            for (let k of response.profession) {
              this.profession.push(k);
          }
        })
}

    check_value(name, value){
      
        for(let i in this.pref){
            if(value == false){
                this.pref.splice(i,1);
            }
           
        }    
    }
  submitt(frmdata){
    for (let j in Object.keys(this.check)) {
      if (this.check[Object.keys(this.check)[j]] == true) {
        for(let i in this.pref){
              console.log(Object.keys(this.check)[j], this.pref[i]);
              if (this.pref[i] == JSON.stringify(Object.keys(this.check)[j])){
                  
              } else {
          this.pref.push(Object.keys(this.check)[j])
      }
        }
        if(this.pref.length == 0){
           this.pref.push(Object.keys(this.check)[j])
        } 
      console.log(this.pref)
    }
    }
    if(this.pref.length == 0){
        this.apiservice.simpleToast('Please select at least one pay preferences.', 3000,'middle');
    } else {
    let postdata={
      salon_id : this.userdata.data.user_details[0].salons[0].id,
      jobtitle : frmdata.value.profess,
      description : '',
      salary : '',
      qualification : frmdata.value.quali,
      experience : frmdata.value.work,
      location : frmdata.value.loc.name,
      state_id : frmdata.value.loc.id,
      zip : frmdata.value.zip,
      payperfences : this.pref,
      startdate : '',
      enddate : '',
      joindate : '',
    }
    console.log(postdata)
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
    let options = new RequestOptions({headers: headers});

 let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: 'Loading Please Wait...'
    });

//return false;
    loading.present();
    this.http.post(this.apiservice.base_url + '/salonjobs/postjob', postdata, options)
        .map(res => res.json())
        .subscribe((response) => {
             loading.dismiss();
          console.log(response)
          let toast = this.toastCtrl.create({
            message: response.msg,
            duration: 3000,
            position: 'top'
        });
        if(response.status == true){
          toast.present();
          this.dataa={
            profess :'',
            quali:'',
            work:'',
            loc:'',
            zip: ''
          }
          this.check={
            booth: false,
            salary: false,
            comm: false
          }
          this.pref = [];
        }
        }, (err)=>{
                 loading.dismiss();
                this.apiservice.network_err();
               
            })
  }
}

}
