import { Component } from "@angular/core";
import { Observable, } from 'rxjs/Rx';
import { Response} from '@angular/http'

export class AppExecutiontime {

    
    public static ExecutionTime(sTime: any, eTime: any): any {
        var eventStartTime = new Date(sTime);
        var eventEndTime = new Date(eTime);
        return eventEndTime.valueOf() - eventStartTime.valueOf();
    }
    // public static  handleErrors (error: Response | any) {    
    //     console.log("HandleErrors");
    //     let errMsg: string;
    //     errMsg = error.message ? error.message : error.toString();
    //     console.error(errMsg);
    //     return Observable.throw(errMsg);
    // }

    public static handleErrors(error: Response|any) {
        console.log("Handler Ready");
        const cookies: any = NSHTTPCookieStorage.sharedHTTPCookieStorage.cookies;
        if (typeof cookies !== 'undefined') {
            //     this.Output = "No Cookie(s) Available";
            for (let i = 0; i < cookies.count; i++) {
                const cookie: any = cookies.objectAtIndex(i);
                if (cookie.name == "SMSESSION")
                    console.log(cookie);
            }
            console.error("Error from Service " + error);
            // var errorMessage = error.toString();
            // if (errorMessage.indexOf("Unrecognized token '<'") == -1) {
            //     console.log("hi");
            //     return Observable.throw(error.json().data || 'Server error');
            // }
            // else {
            //     console.log("else");
            //     return Observable.throw(error);
            // }
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
            console.error("Error " + error);
            console.log("Handler Ready");
            console.log("hi");
            // this.displayStandardproductsDialog();                        
            return Observable.throw(cookies || 'Server error');

        }

    }
   

}