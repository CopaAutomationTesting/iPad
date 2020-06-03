//angular & nativescript references
import { Injectable ,Component} from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as dialogs from "ui/dialogs";
import { RouterExtensions } from "nativescript-angular/router";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

//external modules and plugins
import * as moment from "moment";

//app references
import { GetPassenger } from '../interface/index';
import { Configuration } from '../../app.constants';
import { AppExecutiontime } from "../../app.executiontime";
import {  CheckinOrderService } from "./checkinorder.service";
import {  HandleErrorExtractData } from "./handleError_extractData.service";
import * as ApplicationSettings from "application-settings";
declare var NSHTTPCookieStorage, NSHTTPCookie;

@Injectable()
@Component({
    selector: "departurehome-app",
    // providers: [DataService, Configuration],
    // templateUrl: "./components/departurehome/departurehome.component.html"
})
export class PassengerService {

    private actionUrl: string;
    private actionUrlForReqDocs: string;
    private actionUrlForValidate: string;
    private actionUrlPost: string;
    private actionUrlCountries: string;
    private actionUrlCities: string;
    private headers: Headers;
    private headerApiuser: string;
    private headerCurrency:string;
    private salesOffice:string;

    constructor(private routerExtensions: RouterExtensions,private _http: Http, private _configuration: Configuration, private _shared:CheckinOrderService) {

        var config = _configuration;
        this.headerApiuser = config.HeaderApiuser;
        this.headerCurrency =this._shared.GetCurrency();
        this.salesOffice = this._shared.GetUserPointofSale();        
        this.actionUrl = config.ServerWithApiUrlGetPassenger;
        this.actionUrlForReqDocs = config.ServerWithApiUrlGetReqDocuments;
        this.actionUrlForValidate = config.ServerWithApiUrlValidatePassenger;
        this.actionUrlPost = config.ServerWithApiUrlAddPassenger;
        this.actionUrlCountries = config.ServerWithApiUrlCountries;
        this.actionUrlCities = config.ServerWithApiUrlCities;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    public GetPassenger(orderID: string, boardingLocation: string = ""): Observable<any> {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);   
        headers.append("http_currency",this.headerCurrency);  
        headers.append("http_salesoffice",this.salesOffice);
        // return this._http.get(this.actionUrl + orderID + "?apis=true&&ckin=true&&tktdtl=true&&emddtl=true", { headers: headers })
        //     .map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
        var POSLocation = ApplicationSettings.getString("userdetails", "").substr(0, 3);
        let request = "?" + "apis=true&ckin=true&ckinsrchwin=true&shrtck=true&tktdtl=true";
        if(boardingLocation.trim().length>0){
            request += "&brdloc=" + boardingLocation;
        }else{
            request += "&brdloc=" + POSLocation;            
        } 
        return this._http.get(this.actionUrl + orderID + request, { headers: headers })
            .map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

    }
    public GetPassengerrefresh(orderID: string, boardingLocation: string = ""): Observable<any> {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);   
        headers.append("http_currency",this.headerCurrency);  
        headers.append("http_salesoffice",this.salesOffice);
        // return this._http.get(this.actionUrl + orderID + "?apis=true&&ckin=true&&tktdtl=true&&emddtl=true", { headers: headers })
        //     .map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
        var POSLocation = ApplicationSettings.getString("userdetails", "").substr(0, 3);
        let request = "?" + "apis=true&ckin=true&ckinsrchwin=true&shrtck=true&tktdtl=true&refresh=true";
        if(boardingLocation.trim().length>0){
            request += "&brdloc=" + boardingLocation;
        }else{
            request += "&brdloc=" + POSLocation;            
        } 
        return this._http.get(this.actionUrl + orderID + request, { headers: headers })
            .map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

    }

    public AddPassenger(request: any, orderID: string): Observable<any> {

        let headers = new Headers();
        // headers.append("ApiUser", this.headerApiuser);   
        // headers.append("http_currency",this.headerCurrency);  
        // headers.append("http_salesoffice",this.salesOffice);
        headers.append("ApiUser", "osOk7lupocQBiED/uZtYPYWkaqlL06bvmKtSWJoUlPY=");
       // return this._http.post(this.actionUrlPost + orderID + "/apis", JSON.stringify(request), { headers: headers })
        return this._http.post(this.actionUrlPost + orderID + "/apis", JSON.stringify(request), { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }

    public StatupTable(): Observable<any> {

        let headers = new Headers();
        headers.append("ApiUser", "osOk7lupocQBiED/uZtYPYWkaqlL06bvmKtSWJoUlPY=");
        return this._http.post("http://ustlssoat258.airservices.svcs.entsvcs.net:12499/api/reference/startup", { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);
    }

    public UpdatePassenger(request: any, orderID: string): Observable<any> {
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);   
        headers.append("http_currency",this.headerCurrency);  
        headers.append("http_salesoffice",this.salesOffice);
        return this._http.post(this.actionUrlPost + orderID + "/traveler/update?tktdtl=true&apis=true&ckin=true&emddtl=true", JSON.stringify(request), { headers: headers })
            .map(HandleErrorExtractData.extractData)
            .catch(HandleErrorExtractData.handleErrors);

    }

    public GetRequiredDocuments(orderID: string): Observable<GetPassenger> {

        var sDate = new Date();
        console.log('Get Required Document Service --------------- Start Date Time : ' + sDate);
        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);   
        headers.append("http_currency",this.headerCurrency);  
        headers.append("http_salesoffice",this.salesOffice);
        return this._http.get(this.actionUrlForReqDocs + orderID + "/apis/documents", { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
    }

    public GetValidatePassenger(request: any, orderID: string): Observable<GetPassenger> {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);   
        headers.append("http_currency",this.headerCurrency);  
        headers.append("http_salesoffice",this.salesOffice);
        return this._http.post(this.actionUrlForReqDocs + orderID + "/apis/validate", JSON.stringify(request), { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

    }

    public GetCountries(): Observable<any> {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);   
        headers.append("http_currency",this.headerCurrency);  
        headers.append("http_salesoffice",this.salesOffice);
        return this._http.get(this.actionUrlCountries, { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);

    }

    public GetCities(code: string): Observable<any> {

        let headers = new Headers();
        headers.append("ApiUser", this.headerApiuser);   
        headers.append("http_currency",this.headerCurrency);  
        headers.append("http_salesoffice",this.salesOffice);
        return this._http.get(this.actionUrlCities + code, { headers: headers }).map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
    }

    public LogOut() {
        dialogs.confirm("Do you want to Logout?").then(result => {
            console.log("Dialog result: " + result);
            if (result) {
                this._shared.SetCurrency(null);
                this.navigateToLogin();
            }
        });
    }
    public navigateToLogin() {
        this.routerExtensions.navigate([""], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    }

    private extractData(res: Response) {
        console.log(res);	
		if (res.text().indexOf('Siteminder - Login') > -1) {
			throw "SessionTimeout"
		}
        let body = res.json();
        if(body.BadRequest != undefined){
            if(body.ErrorMessage !=undefined){
                throw(body.ErrorMessage);
            }else{
                throw(body.genericMessage);
            }
        }
		return body;
    }

    private handleErrors(error: Response | any) {
        // alert("Unable to connect to the remote server");
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
            var errorMessage = error.toString();
            // if (errorMessage.indexOf("Unrecognized token '<'") == -1) {
            //     console.log("HandleErrors");
            //     let errMsg: string;
            //     if (error instanceof Response) {
            //         const body = error.json() || '';
            //         const err = body.error || JSON.stringify(body);
            //         errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            //     } else {
            //         errMsg = error.message ? error.message : error.toString();
            //     }
            //     console.error(errMsg);
            //     return Observable.throw(errMsg);
            // }
            // else {
            //     console.log("else");
            //     return Observable.throw(error);
                
            // }
            if (error.status === 0) {
                return Observable.throw('Unable to Connect. Verify Network.');
            } else if (error.status == 200){
                return Observable.throw('Unable to connect to server. Network Error.');
            } else if (error.status == 400){
                return Observable.throw('Unable to get response. Bad Request. [400]');
            } else if (error.status == 404) {
                return Observable.throw('Unable to connect to server. Network Error. [404]');
            } else if (error.status == 500) {
                return Observable.throw('Internal Server Error [500].');
            }else if (error.status == 502) {
                return Observable.throw('unable to received a valid response.Bad GateWay [502]');
            }else {
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


    
}