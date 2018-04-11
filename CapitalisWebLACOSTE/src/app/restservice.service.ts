import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http' 
 
import { World, Pallier, Product } from './world';

@Injectable()
export class RestserviceService {
  server = "http://localhost:8080/mavenproject1/";
  user = "";

  constructor(private http : Http) { }

  getUser(){
    return this.user;
  }

  getServer(){
    return this.server;
  }

  setUser( data : string){
    this.user =data;
  }

  private handleError(error: any): Promise<any> { 
    console.error('An error occurred', error);    return Promise.reject(error.message || error); } 
   
  private setHeaders(user:string) : Headers {
    var headers = new Headers();
    headers.append("X-User",user);
    headers.append("Access-Control-Allow-Origin","true");
    

    return headers;
  }

  getWorld(): Promise<World> {     
    return this.http.get(this.server +
      "webresources/generic/world-json"
      , {headers: this.setHeaders(this.user)}    
    ).toPromise().then(response =>response
      .json()).catch(this.handleError); 
  };
  
  putManager(manager : Pallier): Promise<Response> {
    return this.http.put(this.server + "webresources/generic/manager",
          manager, { headers: this.setHeaders(this.user)} )     
          .toPromise(); 
  }

  putProduct(product : Product): Promise<Response> {
    return this.http.put(this.server + "webresources/generic/product",
          product, { headers: this.setHeaders(this.user)} )     
          .toPromise(); 
  }
}
