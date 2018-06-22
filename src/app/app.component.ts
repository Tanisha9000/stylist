import {Component, ViewChild} from '@angular/core';
import {Nav, Platform, AlertController, NavController, LoadingController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {ListPage} from '../pages/list/list';
import {StartPage} from '../pages/start/start';
import {LoginPage} from '../pages/login/login';
import {ForgotPage} from '../pages/forgot/forgot';
import {SignupPage} from '../pages/signup/signup';
import {FilterPage} from '../pages/filter/filter';
import {PostdetailPage} from '../pages/postdetail/postdetail';
import {DetailPage} from '../pages/detail/detail';
import {ProfilePage} from '../pages/profile/profile';
import {WorkhistoryPage} from '../pages/workhistory/workhistory';
import {EditprofilePage} from '../pages/editprofile/editprofile';
//import {StylistprofiledetailPage} from '../pages/stylistprofiledetail/stylistprofiledetail';
import {PostjobsPage} from '../pages/postjobs/postjobs';
import {StylistapplicantsPage} from '../pages/stylistapplicants/stylistapplicants';
import {PrivacypolicyPage} from '../pages/privacypolicy/privacypolicy';
import {ChangepasswordPage} from '../pages/changepassword/changepassword';
import {FeedbackPage} from '../pages/feedback/feedback';
import { ContactusPage } from '../pages/contactus/contactus';
import {AddworkhistoryPage} from '../pages/addworkhistory/addworkhistory';
import {SalonprofilePage} from '../pages/salonprofile/salonprofile';
import {SaloneditprofilePage} from '../pages/saloneditprofile/saloneditprofile';
import { NotificationsPage } from '../pages/notifications/notifications';
import { ApplyPage } from '../pages/apply/apply';
import { Events } from 'ionic-angular';
import { MypostsPage } from '../pages/myposts/myposts';
import { Network } from '@ionic-native/network';
import { FCM } from '@ionic-native/fcm';
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    imgdata: any ;
    activePage: any;
    @ViewChild(Nav) nav: Nav;

    rootPage: any = '';
    public alertShown: boolean = false;
    pages: any;
    salonpages: any;
    userdata: any = [];
    role: any;
    userimage:any;
    name:any;
    constructor(public platform: Platform, public fcm : FCM,private network: Network,public statusBar: StatusBar, public splashScreen: SplashScreen, private alertCtrl: AlertController,public loadingCtrl: LoadingController,public events: Events) {
        this.initializeApp();
        events.subscribe('userdata', (userdata) => {
            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            this.role = this.userdata.data.role;
            this.setMenu();
            if (this.userdata.data.role == 'salon') {
                if (this.userdata.data.user_details[0].salons[0].image) {
                    this.userimage = this.userdata.base_url + "" + this.userdata.data.user_details[0].salons[0].image;
                    console.log(this.userimage)
                } else {
                    this.userimage = "assets/imgs/person.png";
                }
            }
            if(this.userdata.data.role == 'stylist'){
                if(this.userdata.data.user_details[0].user_detail[0].image){
                    this.userimage = this.userdata.userbaseurl + "" + this.userdata.data.user_details[0].user_detail[0].image;
                }else{
                   this.userimage = "assets/imgs/person.png"; 
                }
            }

            this.name = this.userdata.data.name; 
            console.log(this.name)
        });
        events.subscribe('imgdata',(immgg)=>{
            this.userdata = JSON.parse(localStorage.getItem('userdata'));
            if(localStorage.getItem('imgdata')){
            this.imgdata = localStorage.getItem('imgdata');
            this.role = this.userdata.data.role;    
            if (this.userdata.data.role == 'salon') {
                console.log(this.imgdata)
                if (this.imgdata) {
                    this.userimage = this.userdata.base_url+""+this.imgdata;
                    console.log(this.userimage)
                } else {
                    this.userimage = "assets/imgs/person.png";
                }
            } 
                
            }
       
        })
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
           //alert('Updated! Hurray')
            if(this.platform.is('cordova')){
                this.fcm.onNotification().subscribe(data => {
                    //alert('notification received')
                    //alert(JSON.stringify(data));
                    if(data.wasTapped){
                      //alert("Received in background");
                      // alert(JSON.stringify(data));
                        if (localStorage.getItem('userdata')) {
                           
                            this.userdata = JSON.parse(localStorage.getItem('userdata'));
                            this.role = this.userdata.data.role;
                            this.setMenu();
                            this.nav.setRoot(FilterPage);
                            this.nav.push(NotificationsPage);
                        } else {
                            // login page
                            this.nav.setRoot(StartPage);
                            this.nav.push(LoginPage);
                        }
                    } else {
                      //alert("Received in foreground");
                      //alert(JSON.stringify(data));
                        if (localStorage.getItem('userdata')) {
                              // show alert
                        var prom = this.alertCtrl.create({
                            title: 'Notification',
                            message: data.title,
                            buttons: [
                              {
                                text: 'Cancel',
                                role: 'cancel',
                                handler: () => {
                                  console.log('Cancel clicked');
                                }
                              },
                              {
                                text: 'View',
                                handler: () => {
                                  this.nav.push(NotificationsPage);
                                }
                              }
                            ]
                          });
                          prom.present();

                        } else {
                            // login page
                            this.nav.setRoot(StartPage);
                            this.nav.push(LoginPage);
                            
                        }
                    };
                });
            }

            if (localStorage.getItem('userdata')) {
                this.userdata = JSON.parse(localStorage.getItem('userdata'));
               
                this.role = this.userdata.data.role;
                
                this.setMenu();
            if (this.userdata.data.role == 'salon') {
                
                if (this.userdata.data.user_details[0].salons[0].image) {
                    this.userimage = this.userdata.base_url + "" + this.userdata.data.user_details[0].salons[0].image;
                } else {
                    this.userimage = "assets/imgs/person.png";
                }
            }
            if(this.userdata.data.role == 'stylist'){
                if(this.userdata.data.user_details[0].user_detail[0].image){
                    this.userimage = this.userdata.userbaseurl + "" + this.userdata.data.user_details[0].user_detail[0].image;
                }else{
                   this.userimage = "assets/imgs/person.png"; 
                }
            }
                this.name = this.userdata.data.name;                  
                this.nav.setRoot(FilterPage);
                
            }else{
                this.nav.setRoot(StartPage);
            }
            this.platform.registerBackButtonAction(() => {
                if (this.alertShown == false) {
                    this.myHandlerFunction();
                }
            }, 0)
            
// watch network for a disconnect
let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
    console.log('network was disconnected :-(');
    let alert = this.alertCtrl.create({
        title: 'Alert!',
        subTitle: 'Oops!network was disconnected :-(',
        buttons: ['Dismiss']
      });
      alert.present();
  });  
  // stop disconnect watch
  disconnectSubscription.unsubscribe();
  // watch network for a connection
  let connectSubscription = this.network.onConnect().subscribe(() => {
    console.log('network connected!');
    let alert = this.alertCtrl.create({
        title: 'Alert!',
        subTitle: 'Network connected!',
        buttons: ['Dismiss']
      });
      alert.present();
    setTimeout(() => {
      if (this.network.type === 'wifi') {
        console.log('we got a wifi connection, woohoo!');
      }
    }, 3000);
  }); 
  // stop connect watch
  connectSubscription.unsubscribe();
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
    
    setMenu(){
        console.log(this.role);
        // used for an example of ngFor and navigation
        if(this.role == 'stylist') {           
            this.pages = [
                {title: 'Personnel Home',component: HomePage, icon: 'assets/imgs/home.png'},
                {title: 'Profile', component: ProfilePage, icon: 'assets/imgs/profile.png'},
                {title: 'Work History', component: WorkhistoryPage, icon: 'assets/imgs/history.png'},
                {title: 'Notifications', component: NotificationsPage, icon: 'assets/imgs/bell.png'},
                {title: 'Change Password', component: ChangepasswordPage, icon: 'assets/imgs/password.png'},
                {title: 'Feedback', component: FeedbackPage, icon: 'assets/imgs/feedback1.png'},
                {title: 'Privacy Policy', component: PrivacypolicyPage, icon: 'assets/imgs/privacypolicy.png'},
                {title: 'Contact Us', component: ContactusPage, icon: 'assets/imgs/call.png'},
                {title: 'Logout', icon: 'assets/imgs/feedback.png'}
            ];

        }
        if(this.role == 'salon') {
            this.pages = [
                {title: 'Salon Home', component: HomePage, icon: 'assets/imgs/home.png'},
                {title: 'Salon Profile', component: ProfilePage, icon: 'assets/imgs/profile.png'},
                {title: 'Post Jobs', component: PostjobsPage, icon: 'assets/imgs/postjob.png'},
                {title: 'My Jobs', component: MypostsPage, icon: 'assets/imgs/myjobs.png'},
                {title: 'Jobs Submitted', component: StylistapplicantsPage, icon: 'assets/imgs/applicant.png'},
                {title: 'Notifications', component: NotificationsPage, icon: 'assets/imgs/bell.png'},
                {title: 'Change Password', component: ChangepasswordPage, icon: 'assets/imgs/password.png'},
                {title: 'Feedback', component: FeedbackPage, icon: 'assets/imgs/feedback1.png'},
                {title: 'Privacy Policy', component: PrivacypolicyPage, icon: 'assets/imgs/privacypolicy.png'},
                {title: 'Contact Us', component: ContactusPage, icon: 'assets/imgs/call.png'},
                {title: 'Logout', icon: 'assets/imgs/feedback.png'}

            ];
        }
    }
    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        console.log(page)
        
        if(page.title == "Salon Home" || page.title == "Personnel Home"){
            console.log('testing')
            if(localStorage.getItem('filterdata')){
                localStorage.removeItem('filterdata')
                this.events.publish('hitallhome', page.title); 
            }            
        }
        this.nav.setRoot(page.component);
        this.activePage = page;
        if (page.title == "Logout") {
            let pro = this.alertCtrl.create({
                title: 'Confirm',
                message: 'Do you want to logout?',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'Ok',
                        handler: () => {
                            console.log('Ok clicked');
                            localStorage.clear();
                            this.nav.setRoot(StartPage);
                        }
                    }
                ]
            });
            pro.present();

        }
        
    }
    myHandlerFunction() {
        //        let toast = this.toastCtrl.create({
        //      message: "Press Again to Confirm Exit",
        //      duration: 3000
        //    });
        //    toast.present();     
        let alert = this.alertCtrl.create({
            title: 'Do you want to exit?',
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        navigator['app'].exitApp();
                        console.log('Ok clicked');
                        localStorage.clear();
//                        alert.dismiss().then(() => {
//                            this.nav.pop();
//                        });
//                        return false;

                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('cancel clicked');
                        this.alertShown = false;
//                        alert.dismiss().then(() => {
//                            this.nav.pop();
//                        });
//                        return false;
                    }
                },
            ]
        });
        alert.present().then(() => {
            this.alertShown = true;
        });
    }


}
