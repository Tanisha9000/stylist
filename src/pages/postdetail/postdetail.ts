import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { DetailPage } from '../detail/detail';
import {ApplyPage} from '../apply/apply';
import { ApiserviceProvider } from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-postdetail',
  templateUrl: 'postdetail.html',
})
export class PostdetailPage {
    ohho: number=0;
  position: any;
  notification_bit:any = false;
  salonid: any;
  userdata : any = {};
  role : any = '';
  create: any;
  image: string;
  url: any;
  applied_already:any=0;
  singledetail:any=[];
  pref_to_show:any = [];
  paypreference:any=[];
data: Array<{title: string, details: string, icon: string, showDetails: boolean}> = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public apiservice: ApiserviceProvider,
    private http: Http,
  public loadingCtrl :LoadingController) 
  {
      console.log(this.navParams.get('applied'), 'aplplefasdf');
      this.applied_already = this.navParams.get('applied')
     // alert(this.navParams.get('notification'))
      if(this.navParams.get('notification') == true ){
          this.notification_bit = true;
      }
      this.getdetail();
    for(let i = 0; i < 1; i++ ){
      this.data.push({
          title: 'Title '+i,
          details: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          icon: 'ios-arrow-down',
          showDetails: true
        });
    }
  }

  toggleDetails(data) {
    this.ohho = 1;  
    if (data.showDetails) {
        data.showDetails = false;
        data.icon = 'ios-arrow-down';
    } else {
        data.showDetails = true;
        data.icon = 'ios-arrow-up';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostdetailPage');
  //  this.getdetail();
  }
  ionViewDidLeave() {
    console.log('ionViewDidLoad PostdetailPage');
  //  this.singledetail=[];
  }
  getdetail(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

  let postdata={
      job_id : this.navParams.get('jobid'),
    }
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
    let options = new RequestOptions({headers: headers});
    this.http.post(this.apiservice.base_url + '/salonjobs/jobdetail', postdata, options)
        .map(res => res.json())
        .subscribe((response) => {
          loading.dismiss();
          console.log(response)
          if(response.status == true){
            this.url = response.salonbaseurl;
  //          for (let ho of response.data[0]) {
               if(response.data[0].payperfences){
               this.paypreference = JSON.parse(response.data[0].payperfences);
               
               this.pref_to_show = [];
               for(let i in this.paypreference){
                    if(this.paypreference[i] == 'comm' || this.paypreference[i] == 'commission'){
                        if(this.pref_to_show.indexOf("Commission")== -1){
                            this.pref_to_show.push('Commission');
                        }
                        
                    } else if (this.paypreference[i]=='booth' || this.paypreference[i]=='Booth_Rent'){
                       if(this.pref_to_show.indexOf("Booth Rent")== -1){
                            this.pref_to_show.push('Booth Rent');
                       }
                    } else {
                        if(this.pref_to_show.indexOf("Salary")== -1){
                         this.pref_to_show.push('Salary');
                       }
                    }
                }
             
               
               console.log(this.paypreference)
               }
                if(response.data[0].salon.image == ""){
                    this.image = "assets/imgs/person.png"; 
                }else{
                    this.image = this.url+""+response.data[0].salon.image;
                }
                var str = response.data[0].created;
                var str1 = str.search('T');
                if (str1 != -1) {
                    var split = str.split('T');
                    console.log(split)
                    this.create = split[0];
                    console.log(this.create)
                } else {
                    this.create = str1;
                }

                this.singledetail.push({'url': this.image, 'restdata': response.data[0],'created':this.create,'paypreference' :this.paypreference});
  //          }
            console.log(this.singledetail)
            this.salonid = response.data[0].id;
            this.position = response.data[0].jobtitle;
          }
        })
  }

  detail_go(){
    this.navCtrl.push(DetailPage);
  }
  applyform(){
      localStorage.setItem('paytype', JSON.stringify(this.paypreference));
      this.navCtrl.push(ApplyPage,{
        salonid : this.salonid,
        position : this.position,
        index : this.navParams.get('index') // from last page
      });
    }
}
