//angular & nativescript references
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import { Observable } from 'rxjs/Rx';
import { RouterExtensions } from "nativescript-angular/router";
import * as dialogs from "ui/dialogs";

//app references
import { Configuration } from '../../app.constants';

declare var NSHTTPCookieStorage, NSHTTPCookie;


@Injectable()
export class PaymentService {

    private actionUrl: string;
    private headers: Headers;

    constructor(private _http: Http, private _configuration: Configuration, private routerExtensions: RouterExtensions) {

        var config = _configuration;
        this.actionUrl = config.ServerWithApiUrlOrders;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    public PostPayment(request: any, id: string): Observable<any> {
        let headers = new Headers();
        headers.append("ApiUser", "osOk7lupocQBiED/uZtYPYWkaqlL06bvmKtSWJoUlPY=");
        console.log(JSON.stringify(request));
        var actionLink: any = "http://usclssoat258.airservices.eds.com:12499/api/purchase"
        return this._http.post(actionLink, JSON.parse(JSON.stringify(request)), { headers: headers })
            .map(response => response.json())
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        console.log(res);	
		if (res.text().indexOf('Siteminder - Login') > -1) {
			throw "SessionTimeout"
		}
        let body = res.json();
        if(body.BadRequest != undefined){
            if(body.ErrorMessage !=undefined){
                throw(body.ErrorMessage);
            }else{
                throw(body.genericMessage);
            }
        }
		return body;
    }

    private handleError(error: Response) {
        const cookies: any = NSHTTPCookieStorage.sharedHTTPCookieStorage.cookies;
        if (typeof cookies !== 'undefined') {
            //     this.Output = "No Cookie(s) Available";
            for (let i = 0; i < cookies.count; i++) {
                const cookie: any = cookies.objectAtIndex(i);
                if (cookie.name == "SMSESSION")
                    console.log(cookie);
            }
            console.error("Error from Service " + error);
            //  var errorMessage = error.toString();
            // if (errorMessage.indexOf("Unrecognized token '<'") == -1) {
            //         console.log("hi");
            //         return Observable.throw(error.json().data || 'Server error');
            // }
            // else {
            //         console.log("else");                                
            //         return Observable.throw(error);


            // }
            // return Observable.throw(error.json().data || 'Server error');
            if (error.status === 0) {
                return Observable.throw('Unable to Connect. Verify Network.');
            } else if (error.status == 200){
                return Observable.throw('Unable to connect to server. Network Error.');
            } else if (error.status == 400){
                return Observable.throw('Unable to get response. Bad Request. [400]');
            } else if (error.status == 404) {
                return Observable.throw('Unable to connect to server. Network Error. [404]');
            } else if (error.status == 500) {
                return Observable.throw('Internal Server Error [500].');
            }else if (error.status == 502) {
                return Observable.throw('unable to received a valid response.Bad GateWay [502]');
            } else {
                return Observable.throw(error);
            }
        } else {
            console.error("Error from Service " + error);

            return Observable.throw(cookies || 'Server error');

        }
    }

}