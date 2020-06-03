import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/catch';
import * as dialogs from "ui/dialogs";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import * as ApplicationSettings from "application-settings";
import { HandleErrorExtractData } from "./handleError_extractData.service";
import { Configuration } from '../../app.constants';
import { CheckinOrderService } from "./checkinorder.service";

@Injectable()

export class LoginService {
    
    private actionUrlforProfile: string;
    private actionUrlwithAPI : string;
    private salesOffice: string;
    private headers: Headers;
    private headerCurrency: string;
    private actionUrlforLogin: string;
    private headerApiuser: string;
    public  startupTable:string;
    
    constructor(private routerExtensions: RouterExtensions, private _http: Http, private _configuration: Configuration, private _shared: CheckinOrderService) {
        this.actionUrlforLogin = _configuration.ServerWithApiUrlForSiteminderLogin;
        this.startupTable = _configuration.HostPrinter;
        this.headerApiuser = _configuration.HeaderApiuser;
        this.headerCurrency = this._shared.GetCurrency();
        this.salesOffice = this._shared.GetUserPointofSale();
        this.actionUrlforProfile = _configuration.ServerWithApiUrlProfile;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.headerApiuser = _configuration.HeaderApiuser;

        
    }
    public login(username: any, Password: any): Observable<any> {
        let headers = new Headers();
        console.log("here");
        let requestData =
            "USER=" + username.toString() +
            "&PASSWORD=" + encodeURIComponent(Password.toString()) +
            "&TARGET=" + encodeURIComponent(this.actionUrlforProfile) +
            "&LOCATION=" + encodeURIComponent(this.actionUrlforProfile);
        headers.append('content-type', 'application/x-www-form-urlencoded');
        let option = new RequestOptions({ headers: headers, withCredentials: true })
        console.log(JSON.stringify(this.actionUrlforLogin));
        console.log(JSON.stringify(requestData));
        return this._http.post(this.actionUrlforLogin + 'siteminderagent/forms/login.fcc', requestData, option).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
    }
    public StatupTable(): Observable<any> {
        
            let headers = new Headers();
            headers.append("ApiUser", this.headerApiuser);
                return this._http.get(this.startupTable+"reference/startup", { headers: headers })
                    .map(HandleErrorExtractData.extractData)
                    .catch(HandleErrorExtractData.handleErrors);
            }
}