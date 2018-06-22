import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'; 
import {HttpModule} from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { StartPage } from '../pages/start/start';
import { LoginPage } from '../pages/login/login';
import { ForgotPage } from '../pages/forgot/forgot';
import { SignupPage } from '../pages/signup/signup';
import { FilterPage } from '../pages/filter/filter';
import { PostdetailPage } from '../pages/postdetail/postdetail';
import { DetailPage } from '../pages/detail/detail';
import { ProfilePage } from '../pages/profile/profile';
import { WorkhistoryPage } from '../pages/workhistory/workhistory';
import { EditprofilePage } from '../pages/editprofile/editprofile';
import { AdvertisementPage } from '../pages/advertisement/advertisement';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StylistprofiledetailPage } from '../pages/stylistprofiledetail/stylistprofiledetail';
import { PostjobsPage } from '../pages/postjobs/postjobs';
import { EditjobsPage } from '../pages/editjobs/editjobs';
import { StylistapplicantsPage } from '../pages/stylistapplicants/stylistapplicants';
import { PrivacypolicyPage } from '../pages/privacypolicy/privacypolicy';
import { ChangepasswordPage } from '../pages/changepassword/changepassword';
import { FeedbackPage } from '../pages/feedback/feedback';
import { ContactusPage } from '../pages/contactus/contactus';
import { AddworkhistoryPage } from '../pages/addworkhistory/addworkhistory';
import { EditworkhistoryPage } from '../pages/editworkhistory/editworkhistory';
import { SalonprofilePage } from '../pages/salonprofile/salonprofile';
import { ApplyPage } from '../pages/apply/apply';
import { Filter2Page } from '../pages/filter2/filter2';
import { MypostsPage } from '../pages/myposts/myposts';
import { SaloneditprofilePage } from '../pages/saloneditprofile/saloneditprofile';
import { StylistprofilePage } from '../pages/stylistprofile/stylistprofile';
import { NotificationsPage } from '../pages/notifications/notifications';
import { ApiserviceProvider } from '../providers/apiservice/apiservice';
import { Network } from '@ionic-native/network';
import { Ionic2RatingModule } from "ionic2-rating";
import { FCM } from '@ionic-native/fcm';
import {PipesModule} from '../pipes/pipes.module';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    StartPage,
    LoginPage,
    ForgotPage,
    SignupPage,
    FilterPage,
    PostdetailPage,
    DetailPage,
    ProfilePage,
    WorkhistoryPage,
    EditprofilePage,
    StylistprofiledetailPage,
    PostjobsPage,
    EditjobsPage,
    StylistapplicantsPage,
    PrivacypolicyPage,
    ChangepasswordPage,
    FeedbackPage,
    AddworkhistoryPage,
    SalonprofilePage,
    SaloneditprofilePage,
    ApplyPage,
    Filter2Page,
    StylistprofilePage,
    AdvertisementPage,
    NotificationsPage,
    EditworkhistoryPage,
    MypostsPage,
    ContactusPage
    
  ],
  imports: [
    BrowserModule,
     HttpClientModule,
     HttpModule,
     Ionic2RatingModule,
    IonicModule.forRoot(MyApp),
     PipesModule.forRoot()
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    StartPage,
    LoginPage,
    ForgotPage,
    SignupPage,
    FilterPage,
    PostdetailPage,
    DetailPage,
    ProfilePage,
    WorkhistoryPage,
    EditprofilePage,
    StylistprofiledetailPage,
    PostjobsPage,
    EditjobsPage,
    StylistapplicantsPage,
    PrivacypolicyPage,
    ChangepasswordPage,
    FeedbackPage,
    AddworkhistoryPage,
    SalonprofilePage,
    SaloneditprofilePage,
    ApplyPage,
    Filter2Page,
    StylistprofilePage,
    AdvertisementPage,
    NotificationsPage,
    EditworkhistoryPage,
    MypostsPage,
    ContactusPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClientModule,
    Camera,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiserviceProvider,
    FCM
  ]
})
export class AppModule {}
