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
import { HandleErrorExtractData } from "./handleError_extractData.service";


declare var NSHTTPCookieStorage, NSHTTPCookie;

@Injectable()
export class DataService {

    private actionUrl: string;
    private headerApiuser: string;
    private headerCurrency: string;
    private actionUrlforPaxOrderID: string;
    private actionUrlforPaxByFlight: string;
    private actionUrlforCheckIn: string;
    private actionUrlforProfile: string;
    private officeName:string;
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
    private actionUrlforWorkStation: string;
    private action;
    private parent: any;
    private actionUrlforPrinting: string;
    private actionURLDRS:string;
    constructor(private routerExtensions: RouterExtensions, private _http: Http, private _configuration: Configuration, private _shared: CheckinOrderService) {
        this.parent = this;
        this.actionUrlforLogin = _configuration.ServerWithApiUrlForSiteminderLogin;
        this.actionUrl = _configuration.ServerWithApiUrlEmd;
        this.headerApiuser = _configuration.HeaderApiuser;
        // this.officeName =_configuration.OfficeName;
        this.headerCurrency = this._shared.GetCurrency();
        this.salesOffice = this._shared.GetUserPointofSale();
        console.log(this.salesOffice);
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
        this.actionUrlforWorkStation = _configuration.ServerWithApiUrlWorkStation;
        this.actionUrlforPrinting = _configuration.HostPrinter;
        this.actionURLDRS=_configuration.CompensationType;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    public documentType(): Observable<any> {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        console.log(this.actionUrlforPrinting)
        return this._http.get(this.actionUrlforPrinting + 'reference?get=adcscreen', { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
    }

    // public getCityService(): Observable<any> {
    //     let headers = new Headers();
    //     headers.append("ApiUser", this.headerApiuser);
    //     return this._http.get(this.actionUrlforPrinting+"locations", { headers: headers })
    //         .map(response => response.json())
    //         .catch(HandleErrorExtractData.handleErrors);
    // }

    

    public SearchEMDByPNR(id: string): Observable<Passenger> {

        var sDate = new Date();
        console.log('SearchEMDByPNR Service --------------- Start Date Time : ' + sDate);
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.get(this.actionUrl + "search?query=y&id=" + id, { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

    }

    
    
    public SearchOfficeNameByWorkStation(WorkstationRequest: any): Observable<any> {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        console.log(JSON.stringify(WorkstationRequest));
        return this._http.get(this.actionUrlforDevicePrinter+WorkstationRequest+"?OfficeName=true", { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

    }

    public SearchPrinterDeviceByWorkStation(WorkstationName: any): Observable<any> {
        
                let headers = new Headers();
                headers.append("ApiUser", this.headerApiuser);
                headers.append("http_currency", this.headerCurrency);
                headers.append("http_salesoffice", this.salesOffice);
                console.log(JSON.stringify(this.actionUrlforDevicePrinter + WorkstationName));
                return this._http.get(this.actionUrlforDevicePrinter + WorkstationName, { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
        
            }

    public GetBaggage(request:any,orderID: string): Observable<any> {
        console.log(request);
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.post(this.actionUrlforBaggage + orderID,JSON.stringify(request), { headers: headers })
            .map(HandleErrorExtractData.extractData)

            .catch(HandleErrorExtractData.handleErrors);

    }

    public GetPrice(request: any, currency: any): Observable<any> {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        console.log(currency);
        headers.append("http_currency", currency);
        return this._http.post(this.actionUrlforPrice, JSON.stringify(request), { headers: headers })
            .map(HandleErrorExtractData.extractData)

            .catch(HandleErrorExtractData.handleErrors);

    }

    

    public GetFlightInfo(flightcode: string, date: string): Observable<any> {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        
        return this._http.get(this.actionUrlforPaxByFlight + date + "/" + flightcode + "?origin=" + this.salesOffice.substr(0,3), { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
    }

    public FQTV(): Observable<any> {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.get(this.actionUrlforFQTV, { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

    }

    

    public Tier(date: string, flightnumber: string, city: string): Observable<any> {


        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.get(this.actionUrlforPaxByFlight + date + "/" + flightnumber + "/" + city + "/passengers/all", { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

    }

    
 
    

    public Status(date: string, flightnumber: string,DepatureCity:string): Observable<any> {


        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.get(this.actionUrlforPaxByFlight + date + "/" + flightnumber+"?departure="+DepatureCity, { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

    }
    
    public StatusCompensation(date: string, flightnumber: string): Observable<any> {
        
        
                let headers = new Headers();
                headers.append("ApiUser", this.headerApiuser);
                headers.append("http_currency", this.headerCurrency);
                headers.append("http_salesoffice", this.salesOffice);
                return this._http.get(this.actionUrlforPaxByFlight + date + "/" + flightnumber, { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
        
            }

    
    
            public UpgradeOrDownGradeChanges(request: any): Observable<any> {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.post(this.actionUrlforCheckIn + "upgrade", JSON.parse(JSON.stringify(request)), { headers: headers })
            .map(HandleErrorExtractData.extractData)
    }

    public BookingCountDisplay(date: string, flightnumber: string, origin: string): Observable<any> {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.get(this.actionUrlforbookingcount + date + "/" + flightnumber + "/" + origin + "/" + "bookingcount", { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

    }

    public GetBagTag(request: any): Observable<any> {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.post(this.actionUrlforBagTag, JSON.parse(JSON.stringify(request)), { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }
    
    private extractData(res: Response) {
        console.log(res);
        if (res.text().indexOf('Siteminder - Login') > -1) {
            throw "SessionTimeout"
        }
        let body = res.json();
        if (body.BadRequest != undefined) {
            if (body.ErrorMessage != undefined) {
                throw (body.ErrorMessage);
            } else {
                throw (body.genericMessage);
            }
        }
        return body;
    }

    private handleError(error: Response) {
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
        } else {
            console.error("Error " + error);
            console.log("Handler Ready");
            console.log("hi");
            // this.displayStandardproductsDialog();                        
            return Observable.throw(cookies || 'Server error');

        }

    }

    public FQTVUpdate(request: any, OrderId: string): Observable<any> {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.post(this.actionUrlforPaxOrderID + OrderId + "/traveler/update", JSON.parse(JSON.stringify(request)), { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }

}

