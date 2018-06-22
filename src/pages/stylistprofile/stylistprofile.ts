import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController } from 'ionic-angular';
import { WorkhistoryPage } from '../workhistory/workhistory';
import { ApiserviceProvider } from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-stylistprofile',
  templateUrl: 'stylistprofile.html',
})
export class StylistprofilePage {
    otherinfo: any;
    ohho: number=0;
    qqiit: number=0;
    applicant_user_id :any = '';
    startdate: any;
    avail: any;
    userdata:any = {};
    paytype: any;
    position: any;
    paypref: any;
    skills: any;
    licensed: string;
    license_details:any = {};
    location: any;
    aboutus: any;
    language: any;
    phone: any;
    email: any;
    workexp: any;
    ownername: any;
    review_status : any = 1;
    url: any;
    vendorimage = "assets/imgs/person.png";
    bit :any=0;

	data: Array<{title: string, details: string, icon: string, showDetails: boolean}> = [];
        other: Array<{title1: string, details1: string, icon1: string, showDetails1: boolean}> = [];

 constructor(
     public navCtrl: NavController, 
     public navParams: NavParams,
     public apiservice: ApiserviceProvider,
     private http: Http,
     public events : Events,
     public loadingCtrl: LoadingController) {
    this.getDetail();
 	 for(let i = 0; i < 2; i++ ){
      this.data.push({
          title: 'Title '+i,
          details: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          icon: 'ios-arrow-down',
          showDetails: false
        });
    }
    this.userdata = JSON.parse(localStorage.getItem('userdata'));
    this.review_status = this.navParams.get('review_status')
    //alert(this.review_status);
  }
 
  toggleDetails(data) {
      this.qqiit = 1;
    if (data.showDetails) {
        data.showDetails = false;
        data.icon = 'ios-arrow-down';
    } else {
        data.showDetails = true;
        data.icon = 'ios-arrow-up';
    }
  }
    toggleData(other) {
        this.ohho =1;
    if (other.showDetails1) {
        other.showDetails1 = false;
        other.icon1 = 'ios-arrow-down';
    } else {
        other.showDetails1 = true;
        other.icon1 = 'ios-arrow-up';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StylistprofilePage');
  }

  workhistory()
  { 
    console.log('workhistory')
    this.bit = 1;
    localStorage.setItem('workhistory',this.bit)
    this.navCtrl.push(WorkhistoryPage, { id : this.applicant_user_id });
  }

  getDetail(){
    let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });

    loading.present();
    let postdata = {
            user_id: this.navParams.get('styid'),
            job_id : this.navParams.get('job')
        }
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.apiservice.base_url + '/salonjobs/getstylistjobinfo', postdata, options)
            .map(res => res.json())
            .subscribe((response) => {
                loading.dismiss();
                console.log(response);
                 if (response.status == true) {
                     if (response.data[0].userdetail.image == "") {
                         this.vendorimage = "assets/imgs/person.png";
                     } else {
                         this.url = response.userbaseurl;
                         this.vendorimage = this.url+""+response.data[0].userdetail.image;
                     }
                      this.ownername = response.data[0].user.name;
                      console.log(this.ownername)
                      this.workexp = response.data[0].userdetail.work_experince+" "+'years';                
                      this.email = response.data[0].user.email;
                      this.phone = response.data[0].user.phone;              
                      this.location = response.data[0].userdetail.location_prefrence;
                      this.aboutus = response.data[0].userdetail.about_me;
                      //this.skills = response.data[0].userdetail.skill;      
                      this.position = response.data[0].position;
                     var paytype = response.data[0].paytype;
                      
                      if(paytype == 'comm' || paytype == 'commission'){
                                    this.paytype = "Commission";
                                } else if (paytype=='booth' || paytype=='Booth_Rent'){
                                   this.paytype = "Booth Rent";
                                } else {
                                    this.paytype = "Salary";
                                }
                      
                      
                      this.avail = response.data[0].availability;
                      this.otherinfo = response.data[0].otherinfo;
                      this.startdate = response.data[0].startdate;
                      if(response.data[0].salonjobs.payperfences){
                           var paypref = JSON.parse(response.data[0].salonjobs.payperfences);
                           this.paypref = [];
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
                       
                        
                        
                      }
                     if (response.data[0].userdetail.licensed == false) {
                         this.licensed = "no";
                     } else {
                         this.licensed = "yes";
                         this.license_details = {
                            licence_state:response.data[0].userdetail.licence_state,
                            licence_type:response.data[0].userdetail.licence_type,
                            license_number:response.data[0].userdetail.license_number
                         }
                     }               
                     this.applicant_user_id = response.data[0].user.id;
                     console.log( this.skills);
                    if(response.data[0].userdetail.skill){                                            
                       // let split = (response.data[0].userdetail.skill).split(',');
                       
                        if ((response.data[0].userdetail.skill).search('"{"otherdata"')) {
                                console.log(response.data[0].userdetail.skill.split('{'))
                                var skills = response.data[0].userdetail.skill.split('{')[0];
                                var my_skills = response.data[0].userdetail.skill.split('{')[1];
                                var first = '"otherdata":'
                                var sec = "}"
                                    if(my_skills != undefined){
                                        this.skills = skills + ' ' + JSON.parse(my_skills.match(new RegExp(first + "(.*)" + sec))[1]);
                                    } else {
                                    this.skills = skills 
                                    }
                                
                                console.log(this.skills)
                        }else{
                            this.skills = response.data[0].userdetail.skill;
                        }
                                                                
                    }
                 }
            })
  }

    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }
    
    accept(){
        
        console.log('hit')
         let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
    //loading.present();
    let postdata = {
        user_id: this.userdata.data.id,
        jobapply_id : this.navParams.get('job')
    }
    
    console.log(postdata);
    var serialized = this.serializeObj(postdata)
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
    let options = new RequestOptions({headers: headers});
    this.http.post(this.apiservice.base_url + '/salonjobs/acceptjobbyowner', serialized, options)
        .map(res => res.json())
        .subscribe((response) => {
            loading.dismiss();
            console.log(response);
            if (response.status == true) {
                this.apiservice.simpleToast(response.msg, 3000, 'top' )
                this.review_status = 2;
                this.events.publish('index', this.navParams.get('index'));
            } else {
                this.apiservice.simpleToast(response.msg, 3000, 'top' )
            }
        }, err=>{
            loading.present();
            this.apiservice.simpleToast("Network error", 3000, 'top' )
        })
        
    }
}
