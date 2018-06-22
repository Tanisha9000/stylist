import {Component} from '@angular/core';
import {NavController, ToastController, LoadingController, Events} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {FilterPage} from '../filter/filter';
import {PostdetailPage} from '../postdetail/postdetail';
import {StylistprofiledetailPage} from '../stylistprofiledetail/stylistprofiledetail';
import {ApiserviceProvider} from '../../providers/apiservice/apiservice';
import { ModalController, NavParams } from 'ionic-angular';
import {AdvertisementPage} from '../advertisement/advertisement';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    homee: string;
    baseurl: any;
    allsalons :any= [];
    allstylists = [];
    userdata: any = [];
    role: any;
    create: any;
    filter: any = [];
    url: any;
    image: any;
    newdata:any=[];
    alldata:any=[];
    constructor(
        public navCtrl: NavController,
        public apiservice: ApiserviceProvider,
        private http: Http,
        public navParams : NavParams,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public events: Events,
        public modalCtrl: ModalController
        ) 
    {
        console.log('Tanisha(latest code)')
        //alert('home page')
        if(localStorage.getItem('advertisement')){
        this.addvertisement();
        }
      
        events.subscribe('hitallhome', (hitall) => {
//            localStorage.removeItem('filterdata')
            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            this.role = this.userdata.data.role;            
            if (this.userdata.data.role == 'salon') {
                this.homee = 'SALON HOME';
                this.homeStylistData(); 
                console.log('hi') 
            }else{
                this.homee = 'PERSONNEL HOME';
                this.homesalonData();
            }
        });
        events.subscribe('update_status', (index)=>{
            //alert(index);
            this.allsalons[index].restdata.jobapplies = ['0'];
        })
        if (localStorage.getItem('userdata')) {
            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            console.log(this.userdata);
            this.role = this.userdata.data.role;
            if (this.role == 'stylist') {
                this.homee = 'PERSONNEL HOME';
                if(localStorage.getItem('filterdata')){
                    this.newdata = JSON.parse(localStorage.getItem('filterdata'));
                    console.log(this.newdata)
                    this.allsalonfilter();  
                }else{
                    this.homesalonData();
                }
                
            }
            if (this.role == 'salon') {
                this.homee = 'SALON HOME';
                if (localStorage.getItem('filterdata')) {
                    this.newdata = JSON.parse(localStorage.getItem('filterdata'));
                    console.log(this.newdata)
                    this.allsalonfilter();
                }else{
                  this.homeStylistData();  
                }       
            }
        }
    }
    doRefresh(refresher) {
        console.log('Begin async operation', refresher);
    
        setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
        }, 2000);
      }
    allsalonfilter(){
        if(this.role == 'stylist'){
             this.url = this.newdata.base_url;
                    for (let ho of this.newdata.data) {
                        if(ho.salon.image == ""){
                            this.image = "assets/imgs/person.png"; 
                        }else{
                            this.image = this.url+""+ho.salon.image;
                        }
                        var str = ho.created;
                        var str1 = str.search('T');
                        if (str1 != -1) {
                            var split = str.split('T');
                            console.log(split)
                            this.create = split[0];
                            console.log(this.create)
                        } else {
                            this.create = str1;
                        }
                       
                        this.allsalons.push({'url': this.image, 'restdata': ho,'created':this.create});
                    }
                    console.log(this.allsalons)
        } else {
        this.baseurl = this.newdata.base_url;
        for (let ho of this.newdata.data) {
            console.log(this.newdata.data)
            if(ho.user_detail[0].image == ""){
               this.url = "assets/imgs/person.png"; 
            }else{
                this.url = this.baseurl+""+ho.user_detail[0].image;
            }
            var str = ho.created;
            var str1 = str.search('T');
            if (str1 != -1) {
                var split = str.split('T');
                console.log(split)
                this.create = split[0];
                console.log(this.create)
            } else {
                this.create = str1;
            }
            
            this.alldata.push({'created': this.create, 'restData': ho,'url' :this.url});
        }
        console.log(this.alldata)   
        }
    }
    filter_go() {
        this.navCtrl.push(FilterPage);
    }
    postdetail_go(jobid,i,applied_bit) {
        console.log(applied_bit.length)
        this.navCtrl.push(PostdetailPage,{
            jobid : jobid,
            index : i,
            applied : applied_bit.length
        });
    }
    detail(userid) {
        console.log(userid)
        this.navCtrl.push(StylistprofiledetailPage,{
            id : userid
        });
    }

    homesalonData() {
        //        var serialized_all = this.serializeObj(postdata);
        let postdata={
            user_id : this.userdata.data.id
        }
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        loading.present();
       
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.apiservice.base_url + '/salonjobs/getjoblist', postdata, options)
            .map(res => res.json())
            .subscribe((response) => {
                loading.dismiss();
                console.log(response);
              //  alert(response);
                if (response.status == true) {
                    this.url = response.salonbaseurl;
                    for (let ho of response.data) {
                        if(ho.salon.image == ""){
                            this.image = "assets/imgs/person.png"; 
                        }else{
                            this.image = this.url+""+ho.salon.image;
                        }
                        var str = ho.created;
                        var str1 = str.search('T');
                        if (str1 != -1) {
                            var split = str.split('T');
                            console.log(split)
                            this.create = split[0];
                            console.log(this.create)
                        } else {
                            this.create = str1;
                        }
                       // console.log(ho,'k');
                        this.allsalons.push({'url': this.image, 'restdata': ho,'created':this.create});
                    }
                    console.log(this.allsalons)
                } else {
                    let toast = this.toastCtrl.create({
                        message: 'Oops!There is no data',
                        duration: 3000,
                        position: 'top'
                    });
                    toast.present();
                }

                console.log(this.allsalons)

            }, (err)=>{
                 loading.dismiss();
                this.apiservice.network_err();
               
            })
    }

    homeStylistData() {
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        loading.present();
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.apiservice.base_url + '/users/stylist', '', options)
            .map(res => res.json())
            .subscribe((response) => {
                loading.dismiss();
                console.log(response);
                if (response.status == true) {
                    for (let ho of response.data) {
                        if(ho.user_detail[0].image == ""){
                            this.image = "assets/imgs/person.png"; 
                        }else{
                            this.image = this.userdata.userbaseurl+""+ho.user_detail[0].image;
                        }          
                        var str = ho.user_detail[0].created;
                        var str1 = str.search('T');
                        if (str1 != -1) {
                            var split = str.split('T');
                    //        console.log(split)
                            this.create = split[0];
                    //        console.log(this.create)
                        } else {
                            this.create = str1;
                        }
                        this.allstylists.push({'created': this.create, 'restData': ho,'image':this.image});
                    }
                } else {
                    let toast = this.toastCtrl.create({
                        message: 'Oops!There is no data',
                        duration: 3000,
                        position: 'top'
                    });
                    toast.present();
                }

                console.log(this.allstylists)
            }, (err)=>{
                 loading.dismiss();
                this.apiservice.network_err();
               
            })
    }
    
     addvertisement() {
        let contactModal = this.modalCtrl.create(AdvertisementPage);
        //alert('modal present')
     //     setTimeout(function(){
             contactModal.present();
       //  },500)
      }

}
