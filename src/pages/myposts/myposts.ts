import {Component} from '@angular/core';
import {NavController, ToastController, AlertController,LoadingController, Events} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {PostdetailPage} from '../postdetail/postdetail';
import { EditjobsPage } from '../editjobs/editjobs';
import {ApiserviceProvider} from '../../providers/apiservice/apiservice';

@Component({
    selector: 'page-myposts',
    templateUrl: 'myposts.html'
})
export class MypostsPage {
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
        public alertCtrl : AlertController,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
    ){
        if (localStorage.getItem('userdata')) {
            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            console.log(this.userdata);
            this.role = this.userdata.data.role;
            this.homesalonData();
        }  
    }
    
    doRefresh(refresher) {
        console.log('Begin async operation', refresher);
        setTimeout(() => {
          console.log('Async operation has ended');
          this.allsalons = []
          this.homesalonData();
          refresher.complete();
        }, 2000);
      }
    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }
    homesalonData() {
        //        var serialized_all = this.serializeObj(postdata);
        let postdata={
            salon_id : this.userdata.data.user_details[0].salons[0].id
        }
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        loading.present();
       
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.apiservice.base_url + '/salons/indexsalonrequirements', postdata, options)
            .map(res => res.json())
            .subscribe((response) => {
                loading.dismiss();
                console.log(response);
              //  alert(response);
                if (response.status == true) {
                    this.url = response.salonbaseurl;
                    for (let data of response.data) {
                        if(data.salon.image == ""){
                            this.image = "assets/imgs/person.png"; 
                        }else{
                            this.image = this.url+""+data.salon.image;
                        }
                        var str = data.created;
                        var str1 = str.search('T');
                        if (str1 != -1) {
                            var split = str.split('T');
                            this.create = split[0];
                        } else {
                            this.create = str1;
                        }
                        console.log(data)
                        this.allsalons.push({'url': this.image, 'restData': data,'created':this.create});
                    }
                } else {
                    let toast = this.toastCtrl.create({
                        message: 'Oops!There is no data',
                        duration: 3000,
                        position: 'top'
                    });
                    toast.present();
                }

            }, (err)=>{
                 loading.dismiss();
                this.apiservice.network_err();
               
            })
    }

    edit(id){
        console.log(id);
        this.navCtrl.push(EditjobsPage, { id : id});
    }

delete(id,index){
//alert(ind)

  let confirmPop = this.alertCtrl.create({
    title: 'Confirm Delete',
    message: 'Do you want to delete this job?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Yes',
        handler: () => {
          let post = {
               job_id : id
        }
        var serialized_all = this.serializeObj(post);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        loading.present();
        this.http.post(this.apiservice.base_url + '/salons/deletesalonrequirements', post, options)
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
                this.allsalons.splice(index,1)
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
    ]
  });
  confirmPop.present();

        

    }

}
