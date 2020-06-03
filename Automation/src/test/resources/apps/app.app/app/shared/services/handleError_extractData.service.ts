import { Component } from "@angular/core";
import { Observable, } from 'rxjs/Rx';
import { Response } from '@angular/http'

export class HandleErrorExtractData {

    public static handleErrors(error: Response | any) {
        console.log("Handler Ready" + JSON.stringify(error));

        if (error.status === 0) {
            return Observable.throw('Unable to Connect. Verify Network.');
        } else if (error.status == 200) {
            return Observable.throw('Unable to connect to server. Network Error.');
        } else if (error.status == 400) {
            return Observable.throw('Unable to get response. Bad Request. [400]');
        } else if (error.status == 404) {
            return Observable.throw('Unable to connect to server. Network Error. [404]');
        } else if (error.status == 500) {
            return Observable.throw('Internal Server Error [500].');
        } else if (error.status == 502) {
            return Observable.throw('unable to received a valid response.Bad GateWay [502]');
        } else {
            return Observable.throw(error);
        }
    }

    public static extractData(res: Response) {
        console.log(res);
        if (res.text().indexOf('Siteminder - Login') > -1) {
            throw "SessionTimeout"
        }
        if (res.text().indexOf('Siteminder - Logout') > -1) {
            throw "Unable to connect to server. Network Error."
        }        
        if (res.text().indexOf('document.AUTOSUBMIT.submit()') > -1) {
            throw "SessionTimeout"
        }
        let body = res.json();
        if (body.BadRequest != undefined) {
            if (body.ErrorMessage != undefined) {
                throw (body.ErrorMessage);
            } else if (body.errMessage != undefined) {
                throw (body.errMessage);
            } else {
                throw (body.genericMessage);
            }
        }
        return body;
    }

}
