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

export class HomePageService {

    private actionUrlforPrinting: string;
    private actionUrlforProfile: string;
    private headerApiuser: string;
    private headerCurrency: string;
    private salesOffice: string;

    constructor(private routerExtensions: RouterExtensions, private _http: Http, private _configuration: Configuration, private _shared: CheckinOrderService) {
        this.actionUrlforProfile = _configuration.ServerWithApiUrlProfile;
        this.headerApiuser = _configuration.HeaderApiuser;
        this.actionUrlforPrinting = _configuration.HostPrinter;
        this.headerCurrency = this._shared.GetCurrency();
        this.salesOffice = this._shared.GetUserPointofSale();

    }
    public getCityService(): Observable<any> {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        return this._http.get(this.actionUrlforPrinting + "locations", { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }
    public GetAccountProfile(salesOffice:string = "", currency:string = ""): Observable<any> {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency",currency);  
        headers.append("http_salesoffice",salesOffice); 
        console.log(JSON.stringify(this.actionUrlforProfile));
        return this._http.get(this.actionUrlforProfile, { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

    }

}