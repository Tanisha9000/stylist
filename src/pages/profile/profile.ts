import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {EditprofilePage} from '../editprofile/editprofile';
import {ApiserviceProvider} from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';
@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {
    field: number = 0;
    ownerfirstname: any;
    ownerlastname: any;
    dataaa: any;
    city_id: any;
    exp: any;
    zip: any;
    url: any;
    state: any='';
    businessname: any;
    userdata: any = []; //holds user data
    salondata: any = []; //stores salon data
    role: any; //stores role i.e salon or stylist
    vendorimage = "assets/imgs/person.png";//displays profile picture
    name: any;
    ownername: any;
    address: any;
    email: any;
    phone: any;
    dob: any;
    profession: any;
    language: any;
    location: any;
    licensed: any;
    licensetype: any;
    licensestate: any;
    licenseno: any;
    aboutus: any;
    skills: any = [];
    paypref = [];
    experience: any;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public apiservice: ApiserviceProvider,
        private http: Http,
        public loadingCtrl: LoadingController
    ) {
        if (localStorage.getItem('userdata')) {
            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            console.log(this.userdata);
            this.role = this.userdata.data.role;
            if (this.role == "stylist") {
                this.getStylistData();
            } else {
                this.getdata();
            }
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ProfilePage');
    }
    editprofile() {
        this.navCtrl.push(EditprofilePage);
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
        let postdata = {
            user_id: this.userdata.data.id,
        }
        //   var serialized_all = this.serializeObj(postdata);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.apiservice.base_url + '/users/userinfo', postdata, options)
            .map(res => res.json())
            .subscribe((response) => {
                loading.dismiss();
                console.log(response);
                if (response.status == true) {
                    if (response.data.salons[0].image == "") {
                        this.vendorimage = "assets/imgs/person.png";
                    } else {
                        this.url = response.salonbaseurl;
                        this.vendorimage = this.url + "" + response.data.salons[0].image;
                        console.log(this.vendorimage)
                    }
                    this.businessname = response.data.salons[0].name;
                    if (response.data.name) {
                        var split = (response.data.name).split(" ");
                        this.ownerfirstname = split[0];
                        this.ownerlastname = split[1];
                    }
                    //     this.ownername = response.data.name;
                    this.address = response.data.salons[0].address;
                    this.email = response.data.email;
                    this.phone = response.data.salons[0].phone;
                    console.log(response.data.salons[0].phone);
                    this.aboutus = response.data.salons[0].description;
                    this.experience = response.data.salons[0].experiance + " " + 'years';
                    if(response.data.salons[0].experiance == ''){
                        this.experience= '';
                    }
                    this.licensetype = response.data.salons[0].license_type;
                    this.licensestate = response.data.salons[0].licence_state;
                    if(response.data.salons[0].state){
                        this.state = response.data.salons[0].state;
                    } 
                    this.location = response.data.salons[0].city_id;
                    if (response.data.salons[0].zip == 0) {
                        this.zip = "";
                    } else {
                        this.zip = response.data.salons[0].zip;
                    }
                    if (response.data.salons[0].payperferences) {
                        let str = response.data.salons[0].payperferences;
                        console.log(str)
                        console.log(JSON.parse(str))
                        let parsed_str = JSON.parse(str)
                        for (let j in parsed_str) {
                            if (parsed_str[j].search('{"otherdata"') != -1) {
                                console.log(parsed_str)
                                this.dataaa = JSON.parse(parsed_str[j]).otherdata;
                                console.log(this.dataaa)
                                this.paypref.push(this.dataaa)
                                console.log(this.paypref)
                                delete parsed_str[j];
                            }
                            if (parsed_str[j] == "other") {
                                delete parsed_str[j];
                                continue;
                            } else {
                                if (parsed_str[j] != undefined)
                                    this.paypref.push(parsed_str[j]);
                            }
                        }
                        console.log(this.paypref)
                    }
                }
            }, err=>{
                 loading.dismiss();
                 this.apiservice.network_err();
            })
    }
    getStylistData() {
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });

        loading.present();
        let postdata = {
            user_id: this.userdata.data.id,
        }
        //   var serialized_all = this.serializeObj(postdata);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.apiservice.base_url + '/users/userinfo', postdata, options)
            .map(res => res.json())
            .subscribe((response) => {
                loading.dismiss();
                console.log(response);
                if (response.status == true) {
                    this.url = response.userbaseurl;
                    if (response.data.user_detail[0].image == "") {
                        this.vendorimage = "assets/imgs/person.png";
                    } else {
                        this.url = response.userbaseurl;
                        this.vendorimage = this.url + "" + response.data.user_detail[0].image;
                        //   this.vendorimage = response.data.user_detail[0].image;
                    }

                    this.ownername = response.data.name;
                    this.address = response.data.user_detail[0].address;
                    this.city_id = response.data.user_detail[0].city_id;
                    this.email = response.data.email;
                    this.phone = response.data.phone;
                    this.dob = response.data.user_detail[0].dob;
                    this.profession = response.data.user_detail[0].profession;
                    this.language = []; 
                    var llang = response.data.user_detail[0].language_id; 
                    for(let i in llang){
                            this.language.push(llang[i].name)
                    }
                    //this.language = response.data.user_detail[0].language_id;
                    this.location = response.data.user_detail[0].location_prefrence;
                    this.licensetype = response.data.user_detail[0].licence_type;
                    if(response.data.user_detail[0].city){
                         this.state = response.data.user_detail[0].city.name;
                    }
                   
                    this.licensestate = response.data.user_detail[0].licence_state;
                    this.licenseno = response.data.user_detail[0].license_number;
                    this.aboutus = response.data.user_detail[0].about_me;
                    if (response.data.user_detail[0].work_experince == null || response.data.user_detail[0].work_experince == "null") {
                        this.exp = "";
                    } else {
                        this.exp = response.data.user_detail[0].work_experince + " " + "years";
                    }
                    if (response.data.user_detail[0].zip == 0) {
                        this.zip = "";
                    } else {
                        this.zip = response.data.user_detail[0].zip;
                    }
                    if (response.data.user_detail[0].licensed == false) {
                        this.licensed = "no";
                        this.field = 1;
                    } else {
                        this.licensed = "yes";
                    }
                    if (response.data.user_detail[0].skill) {
                        let str = response.data.user_detail[0].skill;
                        let str1 = str.search(",");
                        if (str1 != -1) {
                            let split = str.split(',');
                           // if ((response.data.user_detail[0].skill).search('{"otherdata"')) {
                             //   var my_skills = response.data.user_detail[0].skill.split('{')[1];
                              //  if (my_skills != undefined) {
                               //     var first = '"otherdata":';
                               //     var sec = "}";
                               //     var xx = JSON.parse(my_skills.match(new RegExp(first + "(.*)" + sec))[1]).split(',');
                               //     for (let k in xx) {
                               //         console.log(xx[k]);
                               //         this.skills.push(xx[k]);
                             //       }
                             //   }

                            //}
                            console.log(this.skills);
                            for (let j in split) {
                                console.log(split[j])
                                if (split[j].search('{"otherdata"') != -1) {
                                    console.log(split)
                                    this.dataaa = JSON.parse(split[j]).otherdata;
                                    console.log(this.dataaa)
                                    this.skills.push(this.dataaa)
                                    console.log(this.skills)
                                    delete split[j];
                                }
                                if (split[j] == "other") {
                                    delete split[j];
                                    continue;
                                } else {
                                    if (split[j] != undefined)
                                        this.skills.push(split[j]);
                                }
                            }
                             if ((response.data.user_detail[0].skill).search('"{"otherdata"')) {
                                var my_skills = response.data.user_detail[0].skill.split('{')[1];
                                if (my_skills != undefined) {
                                    var first = '"otherdata":';
                                    var sec = "}";
                                    var xx = JSON.parse(my_skills.match(new RegExp(first + "(.*)" + sec))[1]).split(',');
                                    for (let k in xx) {
                                        console.log(xx[k]);
                                        this.skills.push(xx[k]);
                                    }
                                }

                            }

                        } else {
                            if ((response.data.user_detail[0].skill).search('"{"otherdata"')) {
                                var my_skills = response.data.user_detail[0].skill.split('{')[1];
                                if (my_skills != undefined) {
                                    var first = '"otherdata":';
                                    var sec = "}";
                                    var xx = JSON.parse(my_skills.match(new RegExp(first + "(.*)" + sec))[1]).split(',');
                                    for (let k in xx) {
                                        console.log(xx[k]);
                                        this.skills.push(xx[k]);
                                    }
                                }

                            }else{
                            this.skills.push(str)
                            }
                        }
                    }

                    if (response.data.user_detail[0].pay_preference!='') {
                        this.paypref = JSON.parse(response.data.user_detail[0].pay_preference);
                        console.log(this.paypref)
                        //  console.log(JSON.parse(str))
                    }
                }
            }, err=>{
                 loading.dismiss();
                 this.apiservice.network_err();
            })
    }

}
