import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, LoadingController, Events } from 'ionic-angular';
import { FilterPage } from '../filter/filter';
import {StylistprofilePage} from '../stylistprofile/stylistprofile';
import { ApiserviceProvider } from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-stylistapplicants',
  templateUrl: 'stylistapplicants.html',
})
export class StylistapplicantsPage {
    msg: string;
  image: string;
  url: any;
applicants:any=[];
userdata:any=[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public apiservice: ApiserviceProvider,
    private http: Http,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public events : Events) 
  {
    this.events.subscribe('index', (res)=>{
          this.applicants[res].restdata.jobapplie.review = 2;
    })
    
    if (localStorage.getItem('userdata')) {
        this.userdata = JSON.parse(localStorage.getItem('userdata'));
        console.log(this.userdata);
        this.stylistapplicants();
    }else{
        let toast = this.toastCtrl.create({
            message: 'Oops!There is no data',
            duration: 3000,
            position: 'top'
        });
        toast.present();       
    }
    
    //alert(JSON.stringify(this.userdata))
    
  }
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    if (localStorage.getItem('userdata')) {
        this.userdata = JSON.parse(localStorage.getItem('userdata'));
        console.log(this.userdata);
        this.stylistapplicants();
    }else{
        let toast = this.toastCtrl.create({
            message: 'Oops!There is no data',
            duration: 3000,
            position: 'top'
        });
        toast.present();       
    }
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StylistapplicantsPage');
  }
  
  filter_go(){
    this.navCtrl.push(FilterPage);
  }
   public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }
  stylistprofile(idd,jobid,index,review_status){
    
    var data = {
       user_id:this.userdata.data.id,
       jobapply_id:jobid
    }
    var postdata = this.serializeObj(data);
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
    let options = new RequestOptions({headers: headers});
    if(review_status != 2){
       this.http.post(this.apiservice.base_url + '/salonjobs/reviewjob', postdata, options)
        .map(res => res.json())
        .subscribe((response) => {
            //alert(JSON.stringify(response));
            if (response.status == true) {
                this.applicants[index].restdata.jobapplie.review = 1;          
            } else {
                this.applicants[index].restdata.jobapplie.review = this.applicants[index].restdata.jobapplie.review;
            }
        }, (err)=>{
                // loading.dismiss();
                this.apiservice.network_err();
               
            }) 
    } else {
        this.applicants[index].restdata.jobapplie.review = 2;
    }
    
        
     
     this.navCtrl.push(StylistprofilePage,{
        styid : idd,
        job:jobid,
        review_status : review_status,
        index : index // to be used on pop
     }); 
    
     
  }
  
  stylistapplicants() {
    this.applicants=[];
    console.log('entered function')
    let postdata={
      salon_id: this.userdata.data.user_details[0].salons[0].id
    }
    let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: 'Loading Please Wait...'
    });
    loading.present();
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
    let options = new RequestOptions({headers: headers});
    this.http.post(this.apiservice.base_url + '/salonjobs/getstylistlist', postdata, options)
        .map(res => res.json())
        .subscribe((response) => {
            loading.dismiss();
            console.log(response);
            if (response.status == true) {
                this.url = response.userbaseurl;
                for (let ho of response.data) {
                    if(ho.userdetail.image == ""){
                        this.image = "assets/imgs/person.png"; 
                    }else{
                        this.image = this.url+""+ho.userdetail.image;
                    }
                    //console.log(ho);
                    this.applicants.push({'url': this.image, 'restdata': ho});
                }
                console.log(this.applicants)
            } else {
            this.msg = "Oops! There are no submissions."
//                let toast = this.toastCtrl.create({
//                    message: 'Oops!There is no data',
//                    duration: 3000,
//                    position: 'top'
//                });
//                toast.present();       
            }

        }, (err)=>{
                 loading.dismiss();
                this.apiservice.network_err();
               
            })
}

}
