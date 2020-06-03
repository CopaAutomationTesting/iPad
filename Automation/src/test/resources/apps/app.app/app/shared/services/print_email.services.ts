//angular & nativescript references
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

//app references
import { Passenger } from '../model/index';
import { order, PaxTemplate } from '../interface/index';
import { Configuration } from '../../app.constants';
import { AppExecutiontime } from "../../app.executiontime";
import { CheckinOrderService } from "./checkinorder.service";
import {  HandleErrorExtractData } from "./handleError_extractData.service";


declare var NSHTTPCookieStorage, NSHTTPCookie;

@Injectable()
export class PrintEmailService {
    private actionUrl: string;
    private headerApiuser: string;
    private headerCurrency: string;
    private actionUrlforPaxOrderID: string;
    private actionUrlforPaxByFlight: string;
    private actionUrlforCheckIn: string;
    private actionUrlforProfile: string;
    private salesOffice: string;
    private headers: Headers;
    public PassengerDetails: order;
    private actionUrlforBaggage: string;
    private actionUrlforPrice: string;
    private actionUrlforSeatMap: string;
    private actionUrlforAssignSeat: string;
    private actionUrlforbookingcount: string;
    private actionUrlforOffload: string;
    private actionUrlforBagTag: string;
    private actionUrlforFQTV: string
    private actionUrlforLogin: string;
    private actionUrlforDevicePrinter: string;
    private action;
    private parent: any;
    private actionUrlforPrinting: string;
    private actionUrlforRemarks:string;
    private actionUrlforRemarksCheckin:string;

    constructor(private routerExtensions: RouterExtensions, private _http: Http, private _configuration: Configuration, private _shared: CheckinOrderService) {
        this.parent = this;
        this.actionUrlforLogin = _configuration.ServerWithApiUrlForSiteminderLogin;
        this.actionUrl = _configuration.ServerWithApiUrlEmd;
        this.headerApiuser = _configuration.HeaderApiuser;
        this.headerCurrency = this._shared.GetCurrency();
        this.salesOffice = this._shared.GetUserPointofSale();
        this.actionUrlforPaxOrderID = _configuration.ServerWithApiUrlOrders;
        this.actionUrlforPaxByFlight = _configuration.ServerWithApiUrlFlights;
        this.actionUrlforCheckIn = _configuration.ServerWithApiUrlCheckin;
        this.actionUrlforBaggage = _configuration.ServerWithApiUrlBaggage;
        this.actionUrlforPrice = _configuration.ServerWithApiUrlPrice;
        this.actionUrlforProfile = _configuration.ServerWithApiUrlProfile;
        this.actionUrlforSeatMap = _configuration.ServerWithApiUrlSeatMap;
        this.actionUrlforAssignSeat = _configuration.ServerWithApiUrlAssignSeat;
        this.actionUrlforbookingcount = _configuration.ServerWithApiUrlbookingcount;
        this.actionUrlforOffload = _configuration.ServerWithApiUrlOffload;
        this.actionUrlforBagTag = _configuration.ServerWithApiUrlBagTag;
        this.actionUrlforFQTV = _configuration.ServerWithApiUrlFQTV;
        this.actionUrlforDevicePrinter = _configuration.ServerWithApiUrlPrinterDevice;
        this.actionUrlforPrinting = _configuration.HostPrinter;
        this.actionUrlforRemarks = _configuration.Remarks;
        this.actionUrlforRemarksCheckin = _configuration.RemarksCheckin;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    public PrintBoardingPass(request: any): Observable<any> {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.post(this.actionUrlforPrinting + "checkin/boardingpasses", JSON.parse(JSON.stringify(request)), { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }

    public PrintBagTag(request: any): Observable<any> {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.post(this.actionUrlforPrinting + "checkin/bagtags", JSON.parse(JSON.stringify(request)), { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }

    public SendBaordingPassEmail(request: any): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        return this._http.post('http://204.26.136.143:8080/tr-common-printing-webservice/outputrequest', JSON.parse(JSON.stringify(request)), { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }
    public Remarks(request:any) :Observable<any>{
        console.log("in");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        return this._http.post(this.actionUrlforRemarks, JSON.parse(JSON.stringify(request)), { headers: headers })
        .map(HandleErrorExtractData.extractData)
        .catch(HandleErrorExtractData.handleErrors);
    }
    public RemarksCheckin(request:any) :Observable<any>{
        console.log("in");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        return this._http.post(this.actionUrlforRemarksCheckin, JSON.parse(JSON.stringify(request)), { headers: headers })
        .map(HandleErrorExtractData.extractData)
        .catch(HandleErrorExtractData.handleErrors);
    }
}