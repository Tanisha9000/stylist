import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {ApiserviceProvider} from '../../providers/apiservice/apiservice';
import {Http, Headers, RequestOptions} from '@angular/http';

@IonicPage()
@Component({
    selector: 'page-stylistprofiledetail',
    templateUrl: 'stylistprofiledetail.html',
})
export class StylistprofiledetailPage {

    ppit: number = 0;
    bit: number = 0;
    email: any;
    phone: any;
    aboutus: any;
    paypref: any;
    licensed: string;
    language: any;
    location: any;
    workexp: any;
    profession:any = ''
    ownername: any;
    url: any;
    skills: any = [];
    data: Array<{title: string, details: string, icon: string, showDetails: boolean}> = [];
    data1: Array<{title1: string, details1: string, icon1: string, showDetails1: boolean}> = [];

    vendorimage = "assets/imgs/person.png";   //displays profile picture

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public apiservice: ApiserviceProvider,
        private http: Http,
        public loadingCtrl: LoadingController) {
        console.log(this.navParams.get('id'));
        this.getDetail();
        for (let i = 0; i < 2; i++) {
            this.data.push({
                title: 'Title ' + i,
                details: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                icon: 'ios-arrow-down',
                showDetails: false
            });
        }
        for (let j = 0; j < 2; j++) {
            this.data1.push({
                title1: 'Title ' + j,
                details1: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                icon1: 'ios-arrow-down',
                showDetails1: false
            });
        }

    }

    toggleDetails(data) {
        this.ppit = 1;
        if (data.showDetails) {
            data.showDetails = false;
            data.icon = 'ios-arrow-down';
        } else {
            data.showDetails = true;
            data.icon = 'ios-arrow-up';
        }
    }
    toggleData(data1) {
        this.bit = 1;
        if (data1.showDetails1) {
            data1.showDetails1 = false;
            data1.icon1 = 'ios-arrow-down';

        } else {
            data1.showDetails1 = true;
            data1.icon1 = 'ios-arrow-up';
        }
    }
    getDetail() {
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });

        loading.present();
        let postdata = {
            user_id: this.navParams.get('id'),
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
                    if (response.data.user_detail[0].image == "") {
                        this.vendorimage = "assets/imgs/person.png";
                    } else {
                        this.url = response.userbaseurl;
                        this.vendorimage = this.url + "" + response.data.user_detail[0].image;
                    }
                    this.ownername = response.data.name;
                    this.profession = response.data.user_detail[0].profession;
                    console.log(this.profession)
                    this.workexp = response.data.user_detail[0].work_experince + " " + 'years';
                    this.email = response.data.email;
                    this.phone = response.data.phone;
                    //this.language = response.data.user_detail[0].city_id;
                    this.language = []; 
                    var llang = response.data.user_detail[0].language_id; 
                    for(let i in llang){
                        this.language.push(llang[i].name)
                    }
                    this.location = response.data.user_detail[0].location_prefrence;
                    this.aboutus = response.data.user_detail[0].about_me;
                    if (response.data.user_detail[0].licensed == false) {
                        this.licensed = "no";
                    } else {
                        this.licensed = "yes";
                    }
                    if(response.data.user_detail[0].pay_preference !=''){
                        this.paypref = JSON.parse(response.data.user_detail[0].pay_preference);
                    }
                    
                    if (response.data.user_detail[0].skill) {
                        let str = response.data.user_detail[0].skill;
                        let str1 = str.search(",");
                        console.log(str1)
                        if (str1 != -1) {
                            let split = str.split(',');
                            if ((response.data.user_detail[0].skill).search('{"otherdata"')) {
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
                            console.log(this.skills);
                            for (let j in split) {
                                console.log(split[j])
                                if (split[j].search('{"otherdata"') != -1) {
                                    console.log(split)
                                    let dataaa = JSON.parse(split[j]).otherdata;
                                    console.log(dataaa)
                                    this.skills.push(dataaa)
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

                        } else {
                            if ((response.data.user_detail[0].skill).search('"{"otherdata"')) {
                                console.log('searched')
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
                            console.log('last else part')
                                this.skills.push(str)
                            }
                        }
                    }
                    console.log(this.skills)
                    //                    if (response.data.user_detail[0].skill) {
                    //                        let split = (response.data.user_detail[0].skill).split(',');
                    //                        for (let item of split) {
                    //                            console.log(typeof (item))
                    //                            if ((response.data.user_detail[0].skill).search('{"otherdata"')) {
                    //                                let String = (item).substr(item.lastIndexOf(":") + 1, item.lastIndexOf(";"));
                    //                                console.log(String);
                    //                                this.skills = response.data.user_detail[0].skill + "," + String;
                    //                                delete split[item];
                    //                            } else {
                    //                                this.skills = response.data.user_detail[0].skill;
                    //                            }
                    //                        }
                    //                    }

                }
            }, err=>{
                 loading.dismiss();
                 this.apiservice.network_err();
            })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad StylistprofiledetailPage');
    }



}