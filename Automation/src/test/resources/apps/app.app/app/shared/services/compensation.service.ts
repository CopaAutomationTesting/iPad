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
import { CheckinOrderService } from "./checkinorder.service";
import { HandleErrorExtractData } from "./handleError_extractData.service";
import { NativeScriptHttpModule } from 'nativescript-angular/http';
@Injectable()
export class CompensationService {

    private actionUrl: string;
    private actionTypeUrl: string;
    private actionOrderUrl: string;
    private actionCLT: string;
    private headers: Headers;
    private headerApiuser: string;
    private salesOffice: string;
    private headerCurrency: string;
    constructor(private _http: Http, private _https: NativeScriptHttpModule, private _configuration: Configuration, private _shared: CheckinOrderService) {

        // var config = _configuration;
        this.actionUrl = _configuration.CompensationType;
        this.actionTypeUrl = _configuration.CompensationType;
        this.actionOrderUrl = _configuration.CompensationOrders;
        this.actionCLT = _configuration.CompensationCLT;
        this.headerApiuser = _configuration.HeaderApiuser;
        this.headerCurrency = this._shared.GetCurrency();
        this.salesOffice = this._shared.GetUserPointofSale();
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.headers.append('Connection', 'keep-alive');
    }

    //Compensation Search Screen - Service
    public getPassengerType() {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        console.log("All Pax:" + JSON.stringify(this.actionUrl + "reference/getcompensationpassengertype"));
        return this._http.get(this.actionUrl + "reference/getcompensationpassengertype", { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }

    public getCompensationPaxList(date, flight, location, paxtype) {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        var flightnum = flight.substr(2);
        console.log(this.actionUrl + "compensation/" + date + "/" + flight + "/" + location + "/" + paxtype);
        return this._http.get(this.actionUrl + "compensation/" + date + "/CM/" + flightnum + "/" + location + "/" + paxtype, { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }
    public getSaleOfficeReport() {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        return this._http.get(this.actionUrl + "account/salesreports/status", { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }
    public GetAllPassenger(date: Date, flight: string) {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        console.log("All Pax:" + JSON.stringify(this.actionUrl + date + "/" + flight));
        return this._http.get(this.actionUrl + date + "/" + flight + "/pty/passengermarking/allpax", { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }

    public getPassengerTypeList(date: Date, flight: string, location: string, serviceType: string, ) {
        //oversold
        //misconnection
        //gradechange
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        var flightnum = flight.substr(2);
        console.log("All Pax:" + JSON.stringify(this.actionUrl + "compensation/" + date + "/" + flight + "/" + location + "/passengermarking/" + serviceType));
        return this._http.get(this.actionUrl + "compensation/" + date + "/CM/" + flightnum + "/" + location + "/passengermarking/" + serviceType, { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }

    public getPassengerByOrder(orderId: string) {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        return this._http.get(this.actionUrl + "compensation/CM/" + orderId + "/pnrpassengermarking?res=true", { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }
    public status(date: string, flightnumber: string, location : string): Observable<any> {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        return this._http.get(this.actionUrl + "flights/" + date + "/" + flightnumber + "?origin=" + location, { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

    }

    public getFQTV(search: string) {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        console.log(this.actionUrl + "orders/search?fqtv=" + search);
        return this._http.get(this.actionUrl + "orders/search?fqtv=" + search, { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }

    public getETKT(search: string) {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        return this._http.get(this.actionUrl + "compensation/CM/eticketpassengermarking?query=" + search, { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }
    //End
    //Passenger Screen - Services

    public getCompensationReasons(Request: any) {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        return this._http.post(this.actionUrl + "compensation/Reason", JSON.parse(JSON.stringify(Request)), { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }
    public saveCompensationReasons(response: any) {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        return this._http.post(this.actionUrl + "compensation/save/save", JSON.parse(JSON.stringify(response)), { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }
    public getEmailByOrderId(OrderID: any) {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        return this._http.get(this.actionUrl + "orders/" + OrderID + "?res=true", { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }

    public deleteCompensationReasons(response: any) {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        return this._http.post(this.actionUrl + "compensation/delete", JSON.parse(JSON.stringify(response)), { headers: headers })
            .map(res => res.json())
            .catch(AppExecutiontime.handleErrors);
    }
    public GetHeaderInformation(date: string, flights: string) {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        return this._http.get(this.actionUrl + date + "/" + flights + "/pty", { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }

    // End

    // Issue Compensation

    public postBreRequest(model: any) {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        console.log(JSON.stringify(this.actionCLT));
        return this._http.post(this.actionUrl + "compensation/breandsave", JSON.parse(JSON.stringify(model)), { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }
    public PostIssueCompensations(Request: any) {
        let urlconfig = NSURLSessionConfiguration.defaultSessionConfiguration;
        urlconfig.timeoutIntervalForRequest = 300.0;
        urlconfig.timeoutIntervalForResource = 300.0;
        // let urlconfig2 = NSMutableURLRequest.;
        // urlconfig2.timeoutIntervalForRequest  = 300.0;
        let headers = new Headers();
        headers.append('Accept', 'application/json, text/plain, */*');
        headers.append('Connection', 'keep-alive');
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        console.log(JSON.stringify(this.actionCLT));
        return this._http.post(this.actionUrl + "compensation/issuesave", JSON.parse(JSON.stringify(Request)), { headers: headers })
            .timeout(500000)
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }

    public PostEmailCompensation(Request: any) {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        console.log(JSON.stringify(this.actionUrl + "compensation/email/emd"));
        return this._http.post(this.actionUrl + "compensation/emailandsave/emd", JSON.parse(JSON.stringify(Request)), { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }
    public printEMDCompensationService(Request: any) {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        console.log(JSON.stringify(this.actionUrl + "compensation/printandsave/emd"));
        return this._http.post(this.actionUrl + "compensation/printandsave/emd", JSON.parse(JSON.stringify(Request)), { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }
    public printEMDBluetoothCompensationService(Request: any) {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        console.log(JSON.stringify(this.actionUrl + "compensation/bluetoothprint/emd"));
        return this._http.post(this.actionUrl + "compensation/bluetoothprint/emd", JSON.parse(JSON.stringify(Request)), { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }

    public updateEmailId(OrderId: any, Request: any) {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        console.log(JSON.stringify(this.actionCLT));
        return this._http.post(this.actionUrl + "orders/" + OrderId + "/traveler/update?res=true", JSON.parse(JSON.stringify(Request)), { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }
    public saveBluetoothPrint(response: any) {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);
        return this._http.post(this.actionUrl + "compensation/bluetoothprintsave", JSON.parse(JSON.stringify(response)), { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }

    //End

    // Print and Email

    // End

    private extractData(res: Response) {
        console.log("Extract data called");
        // console.log("Response:" + res.text());
        let body = res.json();
        return body.data || {};
    }


}