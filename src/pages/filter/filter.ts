import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {ApiserviceProvider} from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';
import { StylistapplicantsPage } from '../stylistapplicants/stylistapplicants';

@IonicPage()
@Component({
    selector: 'page-filter',
    templateUrl: 'filter.html',
})
export class FilterPage {
    data = {
        pass: '',
        zip: ''
    }
    chk = {
        beauti: false,
        assis: false,
        blade: false,
        barber: false,
        wax: false,
        makeup: false,
        recep: false,
        manager: false
    }
    category: any = [];
    filter: any = [];
    userdata: any = [];
    role: any;
    profession: any = [];
    city:any=[];
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        public apiservice: ApiserviceProvider,
        public toastCtrl: ToastController,
        private http: Http) {
        this.getloc();
        if (localStorage.getItem('userdata')) {

            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            console.log(this.userdata);
            this.role = this.userdata.data.role;
        }

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FilterPage');
    }
    check() {
        if(this.navCtrl.getPrevious()){
            if((this.navCtrl.getPrevious().name) === 'StylistapplicantsPage'){
                this.navCtrl.push(StylistapplicantsPage);   
            }else{
                this.navCtrl.push(HomePage, { showadd : true });
//alert("homepage2")
            } 
        }else{
            this.navCtrl.push(HomePage, { showadd : true });
           // alert("homepage")
        }
    }
    getloc() {
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        loading.present();
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.apiservice.base_url + '/cities/langcity', '', options)
            .map(res => res.json())
            .subscribe((response) => {
                loading.dismiss();
                console.log(response);
                for (let k of response.profession) {
                    this.profession.push(k);
                }
                for (let i of response.city) {
                    this.city.push(i);
                }
            })
    }
    checkvalue(val, index, name, id) {
        console.log("value of checkbox " + val);
        console.log("index is" + index);
        console.log("name is" + name)
        console.log("id is" + id)
        if(val == true){
            this.category.push(id);
        } else {
            for(let i in this.category){
                if(this.category[i] == id){
                    this.category.splice(i,1);
                }
            }
        }
        
        console.log(this.category);
        
    }

    home_go() {
        if (this.role == 'salon') {
            var postdata = {
                zip: this.data.zip,
                state: this.data.pass,
                profession: this.category,
                role: 'stylist'
            }
            console.log(postdata)
            if (postdata.zip == "") {
                delete postdata.zip;
            }
            if (postdata.state == "") {
                delete postdata.state;
            }
            if (postdata.profession.length == 0) {
                delete postdata.profession;
            }
            console.log(postdata);
            if(this.data.zip == "" && this.data.pass == "" && this.category.length == 0){
              let alert = this.alertCtrl.create({
                title: 'Alert!',
                subTitle: 'Please enter atleast one field',
                buttons: ['Ok']
              });
              alert.present();
            }else{
            //  var serialized_all = this.serializeObj(postdata);
            //        return false;
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
            let options = new RequestOptions({headers: headers});
            this.http.post(this.apiservice.base_url + '/users/filteruser', postdata, options)
                .map(res => res.json())
                .subscribe((response) => {
                    console.log(response);
                    let toast = this.toastCtrl.create({
                        message: response.msg,
                        duration: 3000,
                        position: 'top'
                    });
                    if (response.status == true) {
                        toast.present();
//                        console.log(this.filter)
                        var useable_data = {
                            data : response.data,
                            base_url : response.base_url
                        };
                        console.log(useable_data);
                        localStorage.setItem('filterdata', JSON.stringify(useable_data));
                        if(this.navCtrl.getPrevious()!=null){
                            if((this.navCtrl.getPrevious().name) === 'StylistapplicantsPage'){
                                this.navCtrl.push(StylistapplicantsPage);   
                            }else{
                                this.navCtrl.push(HomePage, { showadd : true });
                            } 
                        }
                                         
                    } else {
                        toast.present();
                    }
                })
                
            }
        }

        if (this.role == 'stylist') {
            var postdata1 = {
                zip: this.data.zip,
                state: this.data.pass,
                role: 'salon',
                user_id : this.userdata.data.id
            }
            console.log(postdata1)
            if (postdata1.zip == "") {
                delete postdata1.zip;
            }
            if (postdata1.state == "") {
                delete postdata1.state;
            }

            console.log(postdata1);
            if(this.data.zip == "" && this.data.pass == ""){
              let alert = this.alertCtrl.create({
                title: 'Alert!',
                subTitle: 'Please enter atleast one field',
                buttons: ['Ok']
              });
              alert.present();
            }else{ 
            // var serialized_all = this.serializeObj(postdata1);
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
            let options = new RequestOptions({headers: headers});
            this.http.post(this.apiservice.base_url + '/users/fill', postdata1, options)
                .map(res => res.json())
                .subscribe((response) => {
                    console.log(response);
                    let toast = this.toastCtrl.create({
                        message: response.msg,
                        duration: 3000,
                        position: 'top'
                    });
                    if (response.status == true) {
                        toast.present();
                        var useable_data = {
                            data : response.data,
                            base_url : response.salonbaseurl
                        };
                        localStorage.setItem('filterdata', JSON.stringify(useable_data));
                        this.navCtrl.push(HomePage, { showadd : true });
                    } else {
                        toast.present();
                    }
                })
        }

    }
    }

    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }

}
