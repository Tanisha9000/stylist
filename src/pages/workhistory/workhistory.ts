import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ToastController,AlertController} from 'ionic-angular';
import {AddworkhistoryPage} from '../addworkhistory/addworkhistory';
import {EditworkhistoryPage} from '../editworkhistory/editworkhistory';
import {ApiserviceProvider} from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';
@IonicPage()
@Component({
    selector: 'page-workhistory',
    templateUrl: 'workhistory.html',
})
export class WorkhistoryPage {
    buttonn: number;
    desc: String='';
    user_id: any = '';
    userdata: any = [];
    worklist: any = [];
    // change = "txt";
    userimage = "../assets/imgs/person.png";
    bit: number;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public apiservice: ApiserviceProvider,
        private http: Http,
        private alertCtrl : AlertController,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController) {

        if (localStorage.getItem('userdata')) {
            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            console.log(this.userdata);

        }

        if (navParams.get('id') != undefined) {
            this.user_id = navParams.get('id'); // coming from salon
            console.log('from salon', this.user_id)
        } else {
            this.user_id = this.userdata.data.id;
            console.log('current user', this.user_id)
        }

        this.getdata();
    }
    ionViewWillEnter() {
        if (localStorage.getItem('workhistory')) {
            this.bit = JSON.parse(localStorage.getItem('workhistory'));
            console.log(this.bit)
        }
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad WorkhistoryPage');
    }

    addworkhistory() {
        this.navCtrl.push(AddworkhistoryPage);
    }
    deletework(work_id,ind){
//alert(ind)

  let confirmPop = this.alertCtrl.create({
    title: 'Confirm Delete',
    message: 'Do you want to delete work history?',
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
               workhistory_id : work_id
        }
        var serialized_all = this.serializeObj(post);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        loading.present();
        this.http.post(this.apiservice.base_url + '/workexperiences/deletesingleworkhistory', serialized_all, options)
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
                this.worklist.splice(ind,1)
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
    view(workidd) {
        console.log(workidd)
        if(this.userdata.data.role == 'stylist'){
            this.navCtrl.push(EditworkhistoryPage,{
            workid : workidd
            })
        } 
    }

    read(cla, ind) {
        console.log('changes')
        console.log(ind)
        console.log(this.worklist[ind].restdata.change)
        //   console.log(cla.ind)
        if (cla == "txt") {
            this.worklist[ind].restdata.change = "txttanisha";
            //this.change= "txttanisha"; 
        } else {
            let toast = this.toastCtrl.create({
                message: "Nothing to show more",
                duration: 3000,
                position: 'top'
            });
            toast.present();
        }
    }

    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }

    getdata() {
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });

        loading.present();
        var postdata = {
            user_id: this.user_id
        }
        var serialized_all = this.serializeObj(postdata);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.apiservice.base_url + '/workexperiences/workhistory', serialized_all, options)
            .map(res => res.json())
            .subscribe((response) => {
                loading.dismiss();
                console.log(response);
                let toast = this.toastCtrl.create({
                    message: response.msg,
                    duration: 3000,
                    position: 'top'
                });
                if (response.status == true) {
                    toast.present();
                    for (let i of response.data) {
                        if(i.description){

                       
                        this.desc = i.description;
                        if (this.desc.length < 75) {
                            i.buttonn = 0;
                            i.change = "txttanisha";
                        } else {
                            i.buttonn = 1;
                            i.change = "txt";
                        }
                        console.log(this.desc.length)
                        if (i.image) {
                            this.userimage = this.userdata.base_url + "" + i.image;
                        } else {
                            this.userimage = "assets/imgs/person.png";
                        }

                        this.worklist.push({'img': this.userimage, 'restdata': i});
                        }
                    }
                    console.log(this.worklist)
                } else {
                    toast.present();
                }
            }, (err) => {
                loading.dismiss();
                this.apiservice.network_err();
            })
    }

}
