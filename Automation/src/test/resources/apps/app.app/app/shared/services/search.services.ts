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

export class SearchService {
   
    private headerApiuser: string;
    private headerCurrency: string;
    private salesOffice: string;
    private headers: Headers;
    private actionUrlforPaxOrderID: string;
    
    constructor(private routerExtensions: RouterExtensions, private _http: Http, private _configuration: Configuration, private _shared: CheckinOrderService) {
        this.actionUrlforPaxOrderID = _configuration.ServerWithApiUrlOrders;
        this.headerApiuser = _configuration.HeaderApiuser;
        this.headerCurrency = this._shared.GetCurrency();
        this.salesOffice = this._shared.GetUserPointofSale();
    }
        
    public SearchPaxByEticket(id: string): Observable<any> {
        
                let headers = new Headers();
                headers.append("ApiUser", this.headerApiuser);
                headers.append("http_currency", this.headerCurrency);
                headers.append("http_salesoffice", this.salesOffice);
                return this._http.get(this.actionUrlforPaxOrderID + "search?query=" + id, { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
        
            }
    public SearchPaxByOrderID(id: string): Observable<any> {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.get(this.actionUrlforPaxOrderID + id + "?apis=true&&ckin=true&&tktdtl=true&&emddtl=true", { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }
    public SearchPaxByFQTVID(id: string): Observable<any> {
        
        
                let headers = new Headers();
                headers.append("ApiUser", this.headerApiuser);
                headers.append("http_currency", this.headerCurrency);
                headers.append("http_salesoffice", this.salesOffice);
                return this._http.get(this.actionUrlforPaxOrderID + "Search?fqtv=" + id, { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
        
            }
    
    
}