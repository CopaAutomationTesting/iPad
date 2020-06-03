//angular & nativescript references
import { Injectable } from "@angular/core";
import { Observable as RxObservable } from "rxjs/Observable";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";

@Injectable()
export class MessageService {

    private headers: Headers;
    public MessageDetail:any;
    public apiHost:string = './../message.json';
    constructor(private _http: Http) {
    }
    getMessage():any {
        return this._http.get(this.apiHost)
        .toPromise()
        .then((response) => 
        { 
            return response.json(); 
        }).catch((err) => 
        { 
            console.log(err); 
        });
    }

}