import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiserviceProvider {
public base_url:string ="http://netin.gangtask.com/salon/api";
  constructor(public http: Http, public toastCtrl : ToastController) {
    console.log('Hello ApiserviceProvider Provider');
  }
  
  
    simpleToast(msg,time,position){
          let toast = this.toastCtrl.create({
              message: msg,
              duration: time,
              position: position
          });

          toast.present();
    }

    network_err(){
        let toast = this.toastCtrl.create({
                message: 'Network error. Please try again.',
                duration: 3000,
                position: 'bottom'
        });
        toast.present();
    }

} 
