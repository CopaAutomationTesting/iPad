//angular & nativescript references
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

//app references
import { Passenger } from '../interface/index';
import { Configuration } from '../../app.constants';
import { AppExecutiontime } from "../../app.executiontime";
import {  CheckinOrderService } from "./checkinorder.service";
import {  HandleErrorExtractData } from "./handleError_extractData.service";

 @Injectable()
export class CheckinService {
 
    private actionUrl: string;
    private headers: Headers;
    private headerApiuser: string;
    private headerCurrency:string
    private salesOffice:string;
    private actionUrlforCheckIn: string;
    private actionUrlforOffload: string;
    private actionURLDRS:string;
    private actionUrlforbookingcount: string;
    private actionUrlforPaxByFlight: string;
    
    constructor(private _http: Http, private _configuration: Configuration,private _shared:CheckinOrderService) {
 
        var config = _configuration;
        this.actionUrl = config.ServerWithApiUrlCheckin;
        this.headerApiuser=config.HeaderApiuser;
        this.headerCurrency =this._shared.GetCurrency();
        this.salesOffice = this._shared.GetUserPointofSale();        
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.actionUrlforOffload = _configuration.ServerWithApiUrlOffload;
        this.actionURLDRS=_configuration.CompensationType;
        this.actionUrlforCheckIn = _configuration.checkin;
        this.actionUrlforbookingcount = _configuration.ServerWithApiUrlbookingcount;
        this.actionUrlforPaxByFlight = _configuration.ServerWithApiUrlFlights;
        
        
    }

    public PostCheckin (model) {
       
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);   
        headers.append("http_currency",this.headerCurrency);  
        headers.append("http_salesoffice",this.salesOffice);
        return this._http.post(this.actionUrl,JSON.stringify(model),
        { headers: headers }
        )
        .map(HandleErrorExtractData.extractData)
        .catch(HandleErrorExtractData.handleErrors);
    } 
    public Offload(request: any): Observable<any> {
        
        
                let headers = new Headers();
                console.log(JSON.stringify(request));
                headers.append("ApiUser", this.headerApiuser);
                headers.append("http_currency", this.headerCurrency);
                headers.append("http_salesoffice", this.salesOffice);
                return this._http.post(this.actionUrlforOffload, JSON.stringify(request), { headers: headers })
                    .map(HandleErrorExtractData.extractData)
        
                    .catch(HandleErrorExtractData.handleErrors);
        
            }
     public CheckInPax(request: any): Observable<any> {


         let headers = new Headers();
         console.log(JSON.stringify(request));
         headers.append("ApiUser", this.headerApiuser);
         headers.append("http_currency", this.headerCurrency);
         headers.append("http_salesoffice", this.salesOffice);
         return this._http.post(this.actionUrlforCheckIn, JSON.stringify(request), { headers: headers })
             .map(HandleErrorExtractData.extractData)

             .catch(HandleErrorExtractData.handleErrors);
         // return this._http.post("http://ustlssoat258.airservices.svcs.entsvcs.net:12499/api/checkin", JSON.stringify(request), { headers: headers })
         // .map(HandleErrorExtractData.extractData)

         // .catch(HandleErrorExtractData.handleErrors);
     }

     public CheckInPaxWithFqtv (request: any): Observable<any> {
        let headers = new Headers();
        console.log(JSON.stringify(request));
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.post(this.actionUrlforCheckIn+"?updateFQTV=true", JSON.stringify(request), { headers: headers })
            .map(HandleErrorExtractData.extractData)

            .catch(HandleErrorExtractData.handleErrors);
    }

     public DrsPage(Category: string, Subject: string, Page: string): Observable<any> {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
         if (Category != "" && Subject != "" && Page != "") {
             return this._http.get(this.actionURLDRS + "reference/agenthelp?catg=" + Category + "&page=" + Page + "&subj=" + Subject, { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
         } else if (Category != "" && Subject != "") {
             return this._http.get(this.actionURLDRS + "reference/agenthelp?catg=" + Category + "&subj=" + Subject, { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
         } else if (Category != "") {
             return this._http.get(this.actionURLDRS + "reference/agenthelp?catg=" + Category, { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
         } else {
             return this._http.get(this.actionURLDRS + "reference/agenthelp", { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

         }
    }

    public Inventory(date: string, flightnumber: string): Observable<any> {
        
        
                let headers = new Headers();
                headers.append("ApiUser", this.headerApiuser);
                headers.append("http_currency", this.headerCurrency);
                headers.append("http_salesoffice", this.salesOffice);
                return this._http.get(this.actionUrlforPaxByFlight + date + "/" + flightnumber + "/inventory", { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
        
            }
     public InBound(date: string, flightnumber: string, city: string): Observable<any> {


         let headers = new Headers();
         headers.append("ApiUser", this.headerApiuser);
         headers.append("http_currency", this.headerCurrency);
         headers.append("http_salesoffice", this.salesOffice);
         return this._http.get(this.actionUrlforPaxByFlight + date + "/" + flightnumber + "/" + city + "/inbound", { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

     }
     public OutBound(date: string, flightnumber: string, city: string): Observable<any> {


         let headers = new Headers();
         headers.append("ApiUser", this.headerApiuser);
         headers.append("http_currency", this.headerCurrency);
         headers.append("http_salesoffice", this.salesOffice);
         return this._http.get(this.actionUrlforPaxByFlight + date + "/" + flightnumber + "/" + city + "/outbound", { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

     }
     public BookingCountDisplay(date: string, flightnumber: string, origin: string): Observable<any> {

         let headers = new Headers();
         headers.append("ApiUser", this.headerApiuser);
         headers.append("http_currency", this.headerCurrency);
         headers.append("http_salesoffice", this.salesOffice);
         return this._http.get(this.actionUrlforbookingcount + date + "/" + flightnumber + "/" + origin + "/" + "bookingcount", { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

     }


   
}