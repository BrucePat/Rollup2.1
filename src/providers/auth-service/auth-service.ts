import { Injectable } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Http, Headers} from '@angular/http';
import {Nav, NavController } from 'ionic-angular';
import {Events} from 'ionic-angular';
import { CardPage } from '../../pages/card/card';
import { CoursesPage } from '../../pages/courses/courses';
import { RegistrationPage } from '../../pages/registration/registration';
import {App} from 'ionic-angular';
import {Storage} from '@ionic/storage';

export class User {

  name: string;
  email: string;
  password: string;
  society: string;
 
  constructor(name: string, email: string, society: string, password: string, public storage: Storage) {
    this.name = name;
    this.email = email;    
    this.society = society;
    this.password = password;
   }
   
}
 
@Injectable()
export class AuthService {
@ViewChild('Nav') nav: Nav;
 
  constructor(public http: Http, private app: App, private storage: Storage){
   
  }
  
  currentUser: User;
  response = {};
  data = {};

  public login(credentials) {
  let nav = this.app.getActiveNav();
  console.log("logging in");
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        this.http.get('http://golf-rollup.co.uk/society/login.php?email='+credentials.email+'&password='+credentials.password, "")
        .map(res => res.json())
        .subscribe(res => {
        if (res === 1) {
        observer.next(res);
        observer.complete();
        this.storage.set('email', credentials.email).then(() => {
         }); 
        this.storage.set('password', credentials.password).then(() => {
          });
        
           
       nav.setRoot(CoursesPage);
      } else {

      alert("No records found! Please Register");
        nav.push(RegistrationPage); 
      }
       }, (err) => {
      alert("failed");
      
      });
      
                 
        let access = (credentials.password === credentials.password && credentials.email === credentials.email);
        let currentUser =  ('email:'+credentials.email + ', password:' + credentials.password );
        console.log(credentials.email);
        console.log(currentUser);
        observer.next(access);
        //observer.complete();
      });
    }
  };
  public setting(set) {
  return Observable.create(observer => {
  this.http.get('http://golf-rollup.co.uk/society/appSettings.php?shots='+set.shots+'&adjhcp='+set.adjHcp+'&club='+set.society+'&Course1='+set.selectedClub1+'&Course2='+set.selectedClub2+'&Course3='+set.selectedClub3+'&Course4='+set.selectedClub4+'&Course5='+set.selectedClub5+'&Course6='+set.selectedClub6+'&yr='+set.year, "")
    
    .subscribe(res => {
      observer.next(res);
        observer.complete();
    })
    })
}
  public register(credentials) {

  let nav = this.app.getActiveNav();
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {

   this.http.post('http://golf-rollup.co.uk/society/AppRegister.php?name='+credentials.name+'&email='+credentials.email+'&society='+credentials.society+'&password='+credentials.password, "")
    
    .subscribe(res => {
       this.storage.set('name', credentials.name).then(() => {
       this.storage.set('society', credentials.society).then(() => {
          
      nav.setRoot(CardPage);
          }); 
        });
       
   }, (err) => {
    alert("failed");
    });

      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }


public registration(credentials) {
let nav = this.app.getActiveNav();
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {

   this.http.post('http://golf-rollup.co.uk/society/AppRegister.php?name='+credentials.name+'&email='+credentials.email+'&society='+credentials.society+'&password='+credentials.password, "")
    
    .subscribe(res => {
        this.storage.set('name', credentials.name).then(() => {
        this.storage.set('society', credentials.society).then(() => {
          
      nav.setRoot(CardPage);
          }); 
        });
    }, (err) => {
    alert("failed");
    });

      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }



  
  public getUserInfo() : User {
    return this.currentUser;
  }
 
  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}