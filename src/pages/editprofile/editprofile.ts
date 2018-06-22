import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, LoadingController, ActionSheetController, AlertController, Events} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {ApiserviceProvider} from '../../providers/apiservice/apiservice';
import {ProfilePage} from '../profile/profile';
import {Camera, CameraOptions} from '@ionic-native/camera';
@IonicPage()
@Component({
    selector: 'page-editprofile',
    templateUrl: 'editprofile.html',
})
export class EditprofilePage {
    responseskills: any = [];
    skills: any=''  
    field: number = 0;
    bit: number = 0;
    url: any;
    cityid: any;
    vendorimage = "assets/imgs/person.png"; //displays profile picture
    imglink: any; //stores image link
    image_data = "";
    userdata: any = []; //holds userdata from localstorage
    role: any //holds role i.e salon or stylist
    pref: any = [];
    dat = {                    //holds salon data
        businessname: '',
        address: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        //     dob:'',
        state: '',
        zipcode: '',
        experience: '',
        about: '',
        location: '',
        otherskill: '',
        licensestate: '',
        licensetype: ''
    }
    chk = {             //check box values of salon
        other: false
    }
    data:any = {                //holds data of stylist
        username: '',
        address: '',
        state: '',
        email: '',
        zip: '',
        phone: '',
        dob: '',
        yes: '',
        no: '',
        licensetype: '',
        licenseno: '',
        aboutme: '',
        workexp: '',
        location: '',
        licensestate: '',
        profession: '',
        profession_id : '',
        language: '',
        otherskill: '',
        city: ''
    }
    check = {                 //check box values of stylist
        Booth_Rent: false,
        Salary: false,
        Commission: false
    }
    paypref: any = [];
    salondata: any = [];
    city: any = [];
    language: any = [];
    profession: any = [];
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public apiservice: ApiserviceProvider,
        private http: Http,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public actionSheetCtrl: ActionSheetController,
        public alertCtrl: AlertController,
        private camera: Camera,
        public events: Events) {

        this.getloc();
        if (localStorage.getItem('userdata')) {
            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            console.log(this.userdata);
            this.role = this.userdata.data.role;
            setTimeout(() => {
            if (this.role == 'stylist') {
                this.getStylistData();
            } else {
                this.getuserdata();
            }
            }, 2000);
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EditprofilePage');
    }
    otherski(val) {
        console.log(val)
        if (val == true) {
            this.bit = 1;
        } else {
            this.bit = 0;
            this.dat.otherskill = "";
            this.data.otherskill = "";
        }

    }
    nolicense(lic) {

        if (lic == 0) {
            this.field = 1;
            console.log(this.field)
        } else {
            this.field = 0;
            console.log(this.field)
        }

    }

    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
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
                for (let j of response.lang) {
                    this.language.push(j);
                }
                for (let k of response.profession) {
                    this.profession.push(k);
                }
                for (let ski of response.skills) {
                    this.responseskills.push(ski);
                }
                
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
                        // this.vendorimage = response.data.user_detail[0].image;
                    }
                    this.data.city = response.data.user_detail[0].city_id;
                    this.data.username = response.data.name;
                    this.data.address = response.data.user_detail[0].address;
                    this.data.email = response.data.email;
                    this.data.phone = response.data.phone;
                    this.data.dob = response.data.user_detail[0].dob;
                    this.data.state = response.data.user_detail[0].state;
                    this.data.location = response.data.user_detail[0].location_prefrence;
                    this.data.licensetype = response.data.user_detail[0].licence_type;
                    this.data.licensestate = response.data.user_detail[0].licence_state;
                    this.data.workexp = response.data.user_detail[0].work_experince;
                    this.data.language = []; 
                    var llang = response.data.user_detail[0].language_id; 
                    for(let i in llang){
                            this.data.language.push(llang[i].id)
                    }
                    console.log(this.data.language)
                    if (response.data.user_detail[0].zip == 0) {
                        this.data.zip = "";
                    } else {
                        this.data.zip = response.data.user_detail[0].zip;
                    }
                    if (response.data.user_detail[0].about_me == null || response.data.user_detail[0].about_me == "null") {
                        this.data.aboutme = "";
                    } else {
                        this.data.aboutme = response.data.user_detail[0].about_me;
                    }
                    if (response.data.user_detail[0].license_number == null || response.data.user_detail[0].license_number == "null") {
                        this.data.licenseno = "";
                    } else {
                        this.data.licenseno = response.data.user_detail[0].license_number;
                    }
                    if (response.data.user_detail[0].profession == null || response.data.user_detail[0].profession == "null") {
                        this.data.profession = "";
                    } else {
                        
                        // = response.data.user_detail[0].profession;
                        this.data.profession_id = response.data.user_detail[0].profession_id;
                        
                        for(let i in this.profession){
                            console.log(this.profession[i].id,this.data.profession_id);
                            if(this.profession[i].id == this.data.profession_id){
                                this.data.profession = this.profession[i]
                            }
                        }
                        console.log(this.data.profession);
                    }
                    if (response.data.user_detail[0].licensed == false) {
                        this.data.no = "0";
                        this.field = 1;
                    } else {
                        this.data.yes = "1";
                    }
                    if (response.data.user_detail[0].skill) {
                        var str = response.data.user_detail[0].skill;
                        var str1 = str.search(",");
                        if (str1 != -1) {
                            var split = str.split(',');
                            console.log(this.responseskills)
                            for (let i in this.responseskills) {
                                for (let j in split) {
                                    if (this.responseskills[i].name == split[j]) {
                                        this.responseskills[i].check = true;
                                    }
                                }
                            }
                            if ((response.data.user_detail[0].skill).search('{"otherdata"')) {
                                console.log(response.data.user_detail[0].skill.split('{'))
                                var skills = response.data.user_detail[0].skill.split('{')[0];
                                var my_skills = response.data.user_detail[0].skill.split('{')[1];
                                if (my_skills != undefined) {
                                    this.bit = 1;
                                    var first = '"otherdata":'
                                    var sec = "}"
                                    this.skills = skills + ' ' + JSON.parse(my_skills.match(new RegExp(first + "(.*)" + sec))[1]);
                                    console.log(this.skills)
                                    this.chk.other = true;
                                    this.data.otherskill = JSON.parse(my_skills.match(new RegExp(first + "(.*)" + sec))[1])
                                }
                            }
                            //for (let j in split) {
                            //    console.log(split[j])
                            //    for (let i in Object.keys(this.chk)) {
                            //        if (Object.keys(this.chk)[i] == split[j]) {
                            //           this.chk[Object.keys(this.chk)[i]] = true;
                            //       }
                            //        if ((split[j]).includes('{')) {
                            //            this.bit = 1;
                            //            console.log(split[j]);
                            // this.data.otherskill = JSON.parse(split[j]).otherdata;
                            //            console.log(this.dat.otherskill)
                            //        }
                            //    }
                            //}
                        } else {
                            for (let i in Object.keys(this.chk)) {
                                if (Object.keys(this.chk)[i] == str) {
                                    this.chk[Object.keys(this.chk)[i]] = true;
                                }
                            }
                        }
                    }

                    if (response.data.user_detail[0].pay_preference) {
                        var str = JSON.parse(response.data.user_detail[0].pay_preference);
                        for(let i in str){
                            this.check[str[i]] = true;
                        }
                       // if (str1 != -1) {
                        //    var split = str.split(',');
                        //    for (let j in split) {
                        //        console.log(split[j])
                        //        for (let i in Object.keys(this.check)) {
                        //            if (Object.keys(this.check)[i] == split[j]) {
                        //                this.check[Object.keys(this.check)[i]] = true;
                        //            }
                        //        }
                       //     }
                       // } else {
                        //    for (let i in Object.keys(this.check)) {
                        //        if (Object.keys(this.check)[i] == str) {
                        //            this.check[Object.keys(this.check)[i]] = true;
                        //        }
                        
                    }
                }
            })
    }
    getuserdata() {
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });

        loading.present();
        let postdata = {
            user_id: this.userdata.data.id,
        }
        var serialized_all = this.serializeObj(postdata);
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
                    }
                    this.dat.businessname = response.data.salons[0].name;
                    var split = (response.data.name).split(' ');
                    this.dat.firstname = split[0];
                    this.dat.lastname = split[1];
                    this.dat.address = response.data.salons[0].address;
                    this.dat.email = response.data.email;
                    this.dat.phone = response.data.salons[0].phone;
                    this.dat.zipcode = response.data.salons[0].zip;
                    this.dat.state = response.data.salons[0].state;
                    this.dat.location = response.data.salons[0].city_id;
                    this.dat.about = response.data.salons[0].description;
                    this.dat.licensestate = response.data.salons[0].licence_state;
                    this.dat.licensetype = response.data.salons[0].license_type;
                    this.dat.experience = response.data.salons[0].experiance;
                    if (response.data.salons[0].payperferences) {
                        if(response.data.role =='salon'){
                            
                            if(response.data.salons[0].payperferences!=''){
                                var str = JSON.parse(response.data.salons[0].payperferences);
                                console.log(response.data.salons[0].payperferences);
                                for(let i in str){
                                    this.check[str[i]] = true;
                                    if(str[i] == 'booth'|| str[i] == 'Booth_Rent' || str[i] == 'Booth Rent' || str[i] == 'Booth_rent'){
                                        this.check['Booth_Rent'] = true;
                                    } else if (str[i] == 'comm' || str[i] == 'commission') {
                                        this.check['Commission'] = true;
                                    } else if(str[i] == 'Salary' || str[i] == 'salary') {
                                        this.check['Salary'] = true;   
                                    }
                                }
                            }
                            
                           // let str = response.data.salons[0].payperferences;
                           // let parsed_str = JSON.parse(str)
                           //         console.log(parsed_str)
                           // for(let i in parsed_str){
                           //     this.check[parsed_str[i]] = true;
                           // }
                                console.log(this.check)
                        } else {
                            let str = response.data.salons[0].payperferences;
                            let parsed_str = JSON.parse(str)
                            for (let k = 0; k < this.responseskills.length; k++) {
                                for (let j = 0; j < parsed_str.length; j++) {
                                    if (this.responseskills[k].name == parsed_str[j]) {
                                        this.responseskills[k].check = true;
                                    }
                                    if ((parsed_str[j]).includes('{')) {
                                        this.bit = 1;
                                        console.log('come')
                                        console.log(this.dat.otherskill)
                                        this.chk.other = true;
                                        this.dat.otherskill = JSON.parse(parsed_str[j]).otherdata;
                                        console.log(this.dat.otherskill)
                                    }
                                }
                            }
                        }
                    }

                }

            })
    }
    presentActionSheet() {
        const actionsheet = this.actionSheetCtrl.create({
            title: "Profile Photo",
            cssClass: 'title',
            buttons: [
                {
                    text: 'Camera',
                    icon: 'camera',
                    handler: () => {
                        this.getPicture(1); // 1 == Camera
                    }
                }, {
                    text: 'Gallery',
                    icon: 'images',
                    handler: () => {
                        this.getPicture(0); // 0 == Library
                    }
                },
                {
                    text: 'Remove',
                    role: 'destructive',
                    icon: 'trash',
                    handler: () => {
                        this.remove_photo();
                        console.log('Delete clicked');
                    }
                },
                //                {
                //                    //                text: 'Cancel',
                //                    icon: 'close',
                //                    cssClass: 'close',
                //                    role: 'close',
                //                    handler: () => {
                //                        console.log('Cancel clicked');
                //                        //  actionsheet.dismiss();
                //                    }
                //                },
            ]
        });
        actionsheet.present();
    }
    remove_photo() {
        let alert = this.alertCtrl.create({
            title: 'Confirm',
            message: 'Do you want to remove this photo?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('No clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        console.log('Yes clicked');
                        //          this.imglink = "../../assets/imgs/person.png";
                        this.vendorimage = "assets/imgs/person.png";
                    }
                }
            ]
        });
        alert.present();

    }
    getPicture(sourceType: number) {
        // You can check the values here:
        // https://github.com/driftyco/ionic-native/blob/master/src/plugins/camera.ts
        this.camera.getPicture({
            quality: 10,
            destinationType: 0, // DATA_URL
            sourceType: sourceType,
            allowEdit: true,
            saveToPhotoAlbum: false,
            correctOrientation: true
        }).then((imageData) => {
            this.image_data = imageData;
            this.vendorimage = 'data:image/jpeg;base64,' + imageData;
            //      this.postpic(imageData, bitt);
        }, (err) => {
            var toast = this.toastCtrl.create({
                message: JSON.stringify(err),
                duration: 3000,
                position: 'top'
            });
            toast.present();
        });
    }

    update(val) {
        console.log('value' + val)
        console.log(this.chk)
        for (let i in Object.keys(this.chk)) {
            console.log(this.chk[Object.keys(this.chk)[i]])
            if (this.chk[Object.keys(this.chk)[i]] == true) {
                console.log(Object.keys(this.chk)[i])
                this.paypref.push(Object.keys(this.chk)[i])
            }
            console.log(this.paypref)
        }
    }
    editstylist(frm) {
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        
        loading.present();
        if (this.responseskills.length > 0) {
            for (let ad in this.responseskills) {
                if (this.responseskills[ad].check == true) {
                    this.paypref.push(this.responseskills[ad].name);
                }
            }
            console.log("skills" + JSON.stringify(this.paypref));
        }
        //        for (let i in Object.keys(this.chk)) {
        //            if (this.chk[Object.keys(this.chk)[i]] == true) {
        //                this.paypref.push(Object.keys(this.chk)[i])
        //            }
        //        }
        if (this.chk.other == true) {
            console.log(this.data.otherskill)
            let oter = JSON.stringify({otherdata: this.data.otherskill})
            this.paypref.push(oter)
        }
        console.log(this.paypref)
        for (let j in Object.keys(this.check)) {
            if (this.check[Object.keys(this.check)[j]] == true) {
                //   if(Object.keys(this.check)[j] == "Booth_Rent"){
                //     var split = Object.keys(this.check)[j].split('_');  
                //     Object.keys(this.check)[j] = split[0]+" "+split[1];
                //     this.pref.push(concat)  
                //     (Object.keys(this.check)[j]).splice();
                //   }
               if(Object.keys(this.check)[j] == "Booth_Rent"){
                    this.pref.push('Booth Rent')
                } else {
                    this.pref.push(Object.keys(this.check)[j])
                }
            }
            
        }
        console.log(this.pref)
       //var lang = frm.value.language.split(',')
        var postdata = {
            user_id: this.userdata.data.id,
            name: frm.value.username,
            address: frm.value.address,
            city_id: frm.value.city,
            phone_number: frm.value.phone,
            dob: frm.value.dob,
            pay_preference: this.pref,
            skills: this.paypref,
            licensed: frm.value.rr,
            state: frm.value.state,
            license_type: frm.value.licensetype,
            language: frm.value.language,
            license_number: frm.value.licenseno,
            licence_state: frm.value.licensestate,
            location_prefrence: frm.value.location,
            about_me: frm.value.aboutme,
            profession: frm.value.profession.name,
            profession_id: frm.value.profession.id,
            work_experince: frm.value.workexp,
            image: this.image_data,
            zip: frm.value.zip
        }
        console.log(postdata);
//return false;
        var serialized_all = this.serializeObj(postdata);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.apiservice.base_url + '/users/editinfo', serialized_all, options)
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
                    //  alert('saved')
                    toast.present();
                    this.paypref = [];
                    this.pref = [];
                    this.navCtrl.push(ProfilePage)
                }
                toast.present();
            },err=>{
                 loading.dismiss();
            })

    }
    editsalon(Formdata) {
        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        
        loading.present();

        if (this.responseskills.length > 0) {
            for (let ad in this.responseskills) {
                if (this.responseskills[ad].check == true) {
                    this.paypref.push(this.responseskills[ad].name);
                }
            }
            console.log("skills" + JSON.stringify(this.paypref));
        }
        //        for (let i in Object.keys(this.chk)) {
        //            if (this.chk[Object.keys(this.chk)[i]] == true) {
        //                console.log(this.chk.other)
        //                this.paypref.push(Object.keys(this.chk)[i])
        //            }
        //        }
        for (let j in Object.keys(this.check)) {
            if (this.check[Object.keys(this.check)[j]] == true) {
                if(Object.keys(this.check)[j] == 'Booth_Rent' || Object.keys(this.check)[j] == 'Commission' || Object.keys(this.check)[j] == 'Salary' ){
                    if(Object.keys(this.check)[j] == "Booth_Rent"){
                        this.pref.push('Booth Rent')
                    } else {
                        this.pref.push(Object.keys(this.check)[j])
                    }
                } 
            }
            console.log(this.pref)
        }

        if (this.chk.other == true) {
            console.log(this.dat.otherskill)
            let oter = JSON.stringify({otherdata: this.dat.otherskill})
            this.paypref.push(oter)
        }

        console.log(this.paypref)
        var city_id;
        for(let i in this.city){
            if(this.city[i].name == Formdata.value.state){
                city_id = this.city[i].id
            }
        }



        var postdata = {
            id: this.userdata.data.user_details[0].salons[0].id,
            user_id: this.userdata.data.id,
            name: Formdata.value.businessname,
            firstname: Formdata.value.firstname,
            lastname: Formdata.value.lastname,
            address: Formdata.value.address,
            email: Formdata.value.email,
            phone: Formdata.value.phone,
            zip: Formdata.value.zipcode,
            state: Formdata.value.state,
            city_id: city_id,
            description: Formdata.value.about,
            experiance: Formdata.value.experience,
            payperferences: this.pref,
            image: this.image_data,
            //license_type: Formdata.value.licensetype,
            licence_state: Formdata.value.licensestate
        }
        console.log(postdata);
//return false;

        // var serialized_all = this.serializeObj(postdata);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.apiservice.base_url + '/users/editsalondata', postdata, options)
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
                    localStorage.setItem('imgdata', response.data.image);
                    this.events.publish('imgdata', response.data.image);
                    this.paypref = [];
                    this.navCtrl.push(ProfilePage)
                }
                toast.present();
            },err=>{
                 loading.dismiss();
            })
    }

}
