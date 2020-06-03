import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/catch';
import * as dialogs from "ui/dialogs";
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
export class DepartureService {

    private actionUrl: string;
    private headerApiuser: string;
    private headerCurrency: string;
    private actionUrlforPaxByFlight: string;
    private salesOffice: string;
    private headers: Headers;
    private action;
    private parent: any;
    
    constructor( private _http: Http, private _configuration: Configuration, private _shared: CheckinOrderService) {
        this.parent = this;
        
        this.headerCurrency = this._shared.GetCurrency();
        this.salesOffice = this._shared.GetUserPointofSale();
        this.actionUrlforPaxByFlight = _configuration.ServerWithApiUrlFlights;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }
    public SearchDeparturesByLocationcode(locationcode: string, date: string, startTime: string,refresh:boolean): Observable<any> {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        console.log(date + "/" + locationcode + "/flightschedule?start=" + startTime);
        if(refresh){
            return this._http.get(this.actionUrlforPaxByFlight + date + "/" + locationcode + "/" + "flightschedule?refresh=true", { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
        }else{
            return this._http.get(this.actionUrlforPaxByFlight + date + "/" + locationcode + "/" + "flightschedule", { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
        }

    }
    public SearchAllPaxByFlight(id: string, date: string, flightcode: string, locationcode: string): Observable<any> {


        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        if (id == null || id == " " || id == "ALL") {
            return this._http.get(this.actionUrlforPaxByFlight + date + "/" + flightcode + "/" + locationcode + "/passengers" + "/all", { headers: headers })
                .map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
        }
        else {
            return this._http.get(this.actionUrlforPaxByFlight + date + "/" + flightcode + "/" + locationcode + "/passengers" + "/name" + "?pax=" + id, { headers: headers })
                .map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
            // return this._http.get("http://ustlssoat258.airservices.svcs.entsvcs.net:12499/api/flights/" + date + "/" + flightcode + "/" + locationcode + "/passengers" + "/all" + "?pax=" + id, { headers: headers })
            //         .map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

        }


    }


}