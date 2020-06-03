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

export class SeatMapService {
    private actionUrlforSeatMap: string;
    private actionUrlforAssignSeat: string;
    private headerApiuser: string;
    private headerCurrency: string;
    private salesOffice: string;
    private headers: Headers;
    constructor(private routerExtensions: RouterExtensions, private _http: Http, private _configuration: Configuration, private _shared: CheckinOrderService) {
        this.actionUrlforSeatMap = _configuration.ServerWithApiUrlSeatMap;
        this.actionUrlforAssignSeat = _configuration.ServerWithApiUrlAssignSeat;
        this.headerApiuser = _configuration.HeaderApiuser;
        this.headerCurrency = this._shared.GetCurrency();
        this.salesOffice = this._shared.GetUserPointofSale();
    }
    public GetSeatMap(FlightNumber: string, Date: string, Origin: string, GivenName: string,SurName : string,SeqNum : number, OrderId : string): Observable<any> {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        console.log("getSeatMap url" + this.actionUrlforSeatMap + Date + "/" + FlightNumber + "/" + Origin + "/seatmapbypax?gname="+GivenName+"&pnr="+OrderId+"&sname="+SurName);
        return this._http.post(this.actionUrlforSeatMap + Date + "/" + FlightNumber + "/" + Origin + "/seatmapbypax?gname="+GivenName+"&pnr="+OrderId+"&sname="+SurName, {}, { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

    }
    public GetSeatMapOtherFlight(FlightNumber: string, Date: string, Origin: string, Destination: string, PaxStructure: any): Observable<any> {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        console.log("getSeatMap url" + this.actionUrlforSeatMap + Date + "/" + FlightNumber + "/" + Origin + "/seatmap?destination=" + Destination);
        return this._http.post(this.actionUrlforSeatMap + Date + "/" + FlightNumber + "/" + Origin + "/seatmap?destination=" + Destination, JSON.parse(JSON.stringify(PaxStructure)) ,{ headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

    }
    public AssignSeat(request: any): Observable<any> {
        
        
                let headers = new Headers();
                console.log("Request at post:" + JSON.stringify(request));
                headers.append("ApiUser", this.headerApiuser);
                headers.append("http_currency", this.headerCurrency);
                headers.append("http_salesoffice", this.salesOffice);
                return this._http.post(this.actionUrlforAssignSeat, JSON.parse(JSON.stringify(request)), { headers: headers })
                    .map(HandleErrorExtractData.extractData)
        
                    .catch(HandleErrorExtractData.handleErrors);
        
            }
}