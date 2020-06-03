"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var dialogs = require("ui/dialogs");
var router_1 = require("nativescript-angular/router");
var app_constants_1 = require("../../app.constants");
var checkinorder_service_1 = require("./checkinorder.service");
var handleError_extractData_service_1 = require("./handleError_extractData.service");
var ApplicationSettings = require("application-settings");
var PassengerService = /** @class */ (function () {
    function PassengerService(routerExtensions, _http, _configuration, _shared) {
        this.routerExtensions = routerExtensions;
        this._http = _http;
        this._configuration = _configuration;
        this._shared = _shared;
        var config = _configuration;
        this.headerApiuser = config.HeaderApiuser;
        this.headerCurrency = this._shared.GetCurrency();
        this.salesOffice = this._shared.GetUserPointofSale();
        this.actionUrl = config.ServerWithApiUrlGetPassenger;
        this.actionUrlForReqDocs = config.ServerWithApiUrlGetReqDocuments;
        this.actionUrlForValidate = config.ServerWithApiUrlValidatePassenger;
        this.actionUrlPost = config.ServerWithApiUrlAddPassenger;
        this.actionUrlCountries = config.ServerWithApiUrlCountries;
        this.actionUrlCities = config.ServerWithApiUrlCities;
        this.headers = new http_1.Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }
    PassengerService.prototype.GetPassenger = function (orderID, boardingLocation) {
        if (boardingLocation === void 0) { boardingLocation = ""; }
        var headers = new http_1.Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        // return this._http.get(this.actionUrl + orderID + "?apis=true&&ckin=true&&tktdtl=true&&emddtl=true", { headers: headers })
        //     .map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
        var POSLocation = ApplicationSettings.getString("userdetails", "").substr(0, 3);
        var request = "?" + "apis=true&ckin=true&ckinsrchwin=true&shrtck=true&tktdtl=true";
        if (boardingLocation.trim().length > 0) {
            request += "&brdloc=" + boardingLocation;
        }
        else {
            request += "&brdloc=" + POSLocation;
        }
        return this._http.get(this.actionUrl + orderID + request, { headers: headers })
            .map(handleError_extractData_service_1.HandleErrorExtractData.extractData).catch(handleError_extractData_service_1.HandleErrorExtractData.handleErrors);
    };
    PassengerService.prototype.GetPassengerrefresh = function (orderID, boardingLocation) {
        if (boardingLocation === void 0) { boardingLocation = ""; }
        var headers = new http_1.Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        // return this._http.get(this.actionUrl + orderID + "?apis=true&&ckin=true&&tktdtl=true&&emddtl=true", { headers: headers })
        //     .map(HandleErrorExtractData.extractData).catch(HandleErrorExtractData.handleErrors);
        var POSLocation = ApplicationSettings.getString("userdetails", "").substr(0, 3);
        var request = "?" + "apis=true&ckin=true&ckinsrchwin=true&shrtck=true&tktdtl=true&refresh=true";
        if (boardingLocation.trim().length > 0) {
            request += "&brdloc=" + boardingLocation;
        }
        else {
            request += "&brdloc=" + POSLocation;
        }
        return this._http.get(this.actionUrl + orderID + request, { headers: headers })
            .map(handleError_extractData_service_1.HandleErrorExtractData.extractData).catch(handleError_extractData_service_1.HandleErrorExtractData.handleErrors);
    };
    PassengerService.prototype.AddPassenger = function (request, orderID) {
        var headers = new http_1.Headers();
        // headers.append("ApiUser", this.headerApiuser);   
        // headers.append("http_currency",this.headerCurrency);  
        // headers.append("http_salesoffice",this.salesOffice);
        headers.append("ApiUser", "osOk7lupocQBiED/uZtYPYWkaqlL06bvmKtSWJoUlPY=");
        // return this._http.post(this.actionUrlPost + orderID + "/apis", JSON.stringify(request), { headers: headers })
        return this._http.post(this.actionUrlPost + orderID + "/apis", JSON.stringify(request), { headers: headers })
            .map(handleError_extractData_service_1.HandleErrorExtractData.extractData)
            .catch(handleError_extractData_service_1.HandleErrorExtractData.handleErrors);
    };
    PassengerService.prototype.StatupTable = function () {
        var headers = new http_1.Headers();
        headers.append("ApiUser", "osOk7lupocQBiED/uZtYPYWkaqlL06bvmKtSWJoUlPY=");
        return this._http.post("http://ustlssoat258.airservices.svcs.entsvcs.net:12499/api/reference/startup", { headers: headers })
            .map(handleError_extractData_service_1.HandleErrorExtractData.extractData)
            .catch(handleError_extractData_service_1.HandleErrorExtractData.handleErrors);
    };
    PassengerService.prototype.UpdatePassenger = function (request, orderID) {
        var headers = new http_1.Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.post(this.actionUrlPost + orderID + "/traveler/update?tktdtl=true&apis=true&ckin=true&emddtl=true", JSON.stringify(request), { headers: headers })
            .map(handleError_extractData_service_1.HandleErrorExtractData.extractData)
            .catch(handleError_extractData_service_1.HandleErrorExtractData.handleErrors);
    };
    PassengerService.prototype.GetRequiredDocuments = function (orderID) {
        var sDate = new Date();
        console.log('Get Required Document Service --------------- Start Date Time : ' + sDate);
        var headers = new http_1.Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.get(this.actionUrlForReqDocs + orderID + "/apis/documents", { headers: headers }).map(handleError_extractData_service_1.HandleErrorExtractData.extractData).catch(handleError_extractData_service_1.HandleErrorExtractData.handleErrors);
    };
    PassengerService.prototype.GetValidatePassenger = function (request, orderID) {
        var headers = new http_1.Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.post(this.actionUrlForReqDocs + orderID + "/apis/validate", JSON.stringify(request), { headers: headers }).map(handleError_extractData_service_1.HandleErrorExtractData.extractData).catch(handleError_extractData_service_1.HandleErrorExtractData.handleErrors);
    };
    PassengerService.prototype.GetCountries = function () {
        var headers = new http_1.Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.get(this.actionUrlCountries, { headers: headers }).map(handleError_extractData_service_1.HandleErrorExtractData.extractData).catch(handleError_extractData_service_1.HandleErrorExtractData.handleErrors);
    };
    PassengerService.prototype.GetCities = function (code) {
        var headers = new http_1.Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.get(this.actionUrlCities + code, { headers: headers }).map(handleError_extractData_service_1.HandleErrorExtractData.extractData).catch(handleError_extractData_service_1.HandleErrorExtractData.handleErrors);
    };
    PassengerService.prototype.LogOut = function () {
        var _this = this;
        dialogs.confirm("Do you want to Logout?").then(function (result) {
            console.log("Dialog result: " + result);
            if (result) {
                _this._shared.SetCurrency(null);
                _this.navigateToLogin();
            }
        });
    };
    PassengerService.prototype.navigateToLogin = function () {
        this.routerExtensions.navigate([""], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    PassengerService.prototype.extractData = function (res) {
        console.log(res);
        if (res.text().indexOf('Siteminder - Login') > -1) {
            throw "SessionTimeout";
        }
        var body = res.json();
        if (body.BadRequest != undefined) {
            if (body.ErrorMessage != undefined) {
                throw (body.ErrorMessage);
            }
            else {
                throw (body.genericMessage);
            }
        }
        return body;
    };
    PassengerService.prototype.handleErrors = function (error) {
        // alert("Unable to connect to the remote server");
        console.log("Handler Ready");
        var cookies = NSHTTPCookieStorage.sharedHTTPCookieStorage.cookies;
        if (typeof cookies !== 'undefined') {
            //     this.Output = "No Cookie(s) Available";
            for (var i = 0; i < cookies.count; i++) {
                var cookie = cookies.objectAtIndex(i);
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
                return Rx_1.Observable.throw('Unable to Connect. Verify Network.');
            }
            else if (error.status == 200) {
                return Rx_1.Observable.throw('Unable to connect to server. Network Error.');
            }
            else if (error.status == 400) {
                return Rx_1.Observable.throw('Unable to get response. Bad Request. [400]');
            }
            else if (error.status == 404) {
                return Rx_1.Observable.throw('Unable to connect to server. Network Error. [404]');
            }
            else if (error.status == 500) {
                return Rx_1.Observable.throw('Internal Server Error [500].');
            }
            else if (error.status == 502) {
                return Rx_1.Observable.throw('unable to received a valid response.Bad GateWay [502]');
            }
            else {
                return Rx_1.Observable.throw(error);
            }
        }
        else {
            console.error("Error " + error);
            console.log("Handler Ready");
            console.log("hi");
            // this.displayStandardproductsDialog();                        
            return Rx_1.Observable.throw(cookies || 'Server error');
        }
    };
    PassengerService = __decorate([
        core_1.Injectable(),
        core_1.Component({
            selector: "departurehome-app",
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions, http_1.Http, app_constants_1.Configuration, checkinorder_service_1.CheckinOrderService])
    ], PassengerService);
    return PassengerService;
}());
exports.PassengerService = PassengerService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc2VuZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYXNzZW5nZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyxzQ0FBcUQ7QUFDckQsc0NBQXdEO0FBQ3hELDhCQUFxQztBQUNyQyxpQ0FBK0I7QUFDL0IsbUNBQWlDO0FBQ2pDLG9DQUFzQztBQUN0QyxzREFBK0Q7QUFRL0QscURBQW9EO0FBRXBELCtEQUE4RDtBQUM5RCxxRkFBNEU7QUFDNUUsMERBQTREO0FBUzVEO0lBYUksMEJBQW9CLGdCQUFrQyxFQUFTLEtBQVcsRUFBVSxjQUE2QixFQUFVLE9BQTJCO1FBQWxJLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFNO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFvQjtRQUVsSixJQUFJLE1BQU0sR0FBRyxjQUFjLENBQUM7UUFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDO1FBQzFDLElBQUksQ0FBQyxjQUFjLEdBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNoRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQztRQUNyRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsTUFBTSxDQUFDLCtCQUErQixDQUFDO1FBQ2xFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxNQUFNLENBQUMsaUNBQWlDLENBQUM7UUFDckUsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsNEJBQTRCLENBQUM7UUFDekQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQztRQUMzRCxJQUFJLENB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SztnQkFDRixPQUFPLGVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDbEM7U0FDSjthQUFNO1lBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLGdFQUFnRTtZQUNoRSxPQUFPLGVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLGNBQWMsQ0FBQyxDQUFDO1NBRXREO0lBRUwsQ0FBQztJQXpPUSxnQkFBZ0I7UUFONUIsaUJBQVUsRUFBRTtRQUNaLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsbUJBQW1CO1NBR2hDLENBQUM7eUNBY3dDLHlCQUFnQixFQUFnQixXQUFJLEVBQTBCLDZCQUFhLEVBQWtCLDBDQUFtQjtPQWI3SSxnQkFBZ0IsQ0E2TzVCO0lBQUQsdUJBQUM7Q0FBQSxBQTdPRCxJQTZPQztBQTdPWSw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvL2FuZ3VsYXIgJiBuYXRpdmVzY3JpcHQgcmVmZXJlbmNlc1xuaW1wb3J0IHsgSW5qZWN0YWJsZSAsQ29tcG9uZW50fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHAsIFJlc3BvbnNlLCBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9SeCc7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL2NhdGNoJztcbmltcG9ydCAqIGFzIGRpYWxvZ3MgZnJvbSBcInVpL2RpYWxvZ3NcIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIE5hdmlnYXRpb25FeHRyYXMsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuLy9leHRlcm5hbCBtb2R1bGVzIGFuZCBwbHVnaW5zXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuXG4vL2FwcCByZWZlcmVuY2VzXG5pbXBvcnQgeyBHZXRQYXNzZW5nZXIgfSBmcm9tICcuLi9pbnRlcmZhY2UvaW5kZXgnO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uLy4uL2FwcC5jb25zdGFudHMnO1xuaW1wb3J0IHsgQXBwRXhlY3V0aW9udGltZSB9IGZyb20gXCIuLi8uLi9hcHAuZXhlY3V0aW9udGltZVwiO1xuaW1wb3J0IHsgIENoZWNraW5PcmRlclNlcnZpY2UgfSBmcm9tIFwiLi9jaGVja2lub3JkZXIuc2VydmljZVwiO1xuaW1wb3J0IHsgIEhhbmRsZUVycm9yRXh0cmFjdERhdGEgfSBmcm9tIFwiLi9oYW5kbGVFcnJvcl9leHRyYWN0RGF0YS5zZXJ2aWNlXCI7XG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuZGVjbGFyZSB2YXIgTlNIVFRQQ29va2llU3RvcmFnZSwgTlNIVFRQQ29va2llO1xuXG5ASW5qZWN0YWJsZSgpXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJkZXBhcnR1cmVob21lLWFwcFwiLFxuICAgIC8vIHByb3ZpZGVyczogW0RhdGFTZXJ2aWNlLCBDb25maWd1cmF0aW9uXSxcbiAgICAvLyB0ZW1wbGF0ZVVybDogXCIuL2NvbXBvbmVudHMvZGVwYXJ0dXJlaG9tZS9kZXBhcnR1cmVob21lLmNvbXBvbmVudC5odG1sXCJcbn0pXG5leHBvcnQgY2xhc3MgUGFzc2VuZ2VyU2VydmljZSB7XG5cbiAgICBwcml2YXRlIGFjdGlvblVybDogc3RyaW5nO1xuICAgIHByaXZhdGUgYWN0aW9uVXJsRm9yUmVxRG9jczogc3RyaW5nO1xuICAgIHByaXZhdGUgYWN0aW9uVXJsRm9yVmFsaWRhdGU6IHN0cmluZztcbiAgICBwcml2YXRlIGFjdGlvblVybFBvc3Q6IHN0cmluZztcbiAgICBwcml2YXRlIGFjdGlvblVybENvdW50cmllczogc3RyaW5nO1xuICAgIHByaXZhdGUgYWN0aW9uVXJsQ2l0aWVzOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBoZWFkZXJzOiBIZWFkZXJzO1xuICAgIHByaXZhdGUgaGVhZGVyQXBpdXNlcjogc3RyaW5nO1xuICAgIHByaXZhdGUgaGVhZGVyQ3VycmVuY3k6c3RyaW5nO1xuICAgIHByaXZhdGUgc2FsZXNPZmZpY2U6c3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByb3V0ZXJFeHRlbnNpb25zOiBSb3V0ZXJFeHRlbnNpb25zLHByaXZhdGUgX2h0dHA6IEh0dHAsIHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb24sIHByaXZhdGUgX3NoYXJlZDpDaGVja2luT3JkZXJTZXJ2aWNlKSB7XG5cbiAgICAgICAgdmFyIGNvbmZpZyA9IF9jb25maWd1cmF0aW9uO1xuICAgICAgICB0aGlzLmhlYWRlckFwaXVzZXIgPSBjb25maWcuSGVhZGVyQXBpdXNlcjtcbiAgICAgICAgdGhpcy5oZWFkZXJDdXJyZW5jeSA9dGhpcy5fc2hhcmVkLkdldEN1cnJlbmN5KCk7XG4gICAgICAgIHRoaXMuc2FsZXNPZmZpY2UgPSB0aGlzLl9zaGFyZWQuR2V0VXNlclBvaW50b2ZTYWxlKCk7ICAgICAgICBcbiAgICAgICAgdGhpcy5hY3Rpb25VcmwgPSBjb25maWcuU2VydmVyV2l0aEFwaVVybEdldFBhc3NlbmdlcjtcbiAgICAgICAgdGhpcy5hY3Rpb25VcmxGb3JSZXFEb2NzID0gY29uZmlnLlNlcnZlcldpdGhBcGlVcmxHZXRSZXFEb2N1bWVudHM7XG4gICAgICAgIHRoaXMuYWN0aW9uVXJsRm9yVmFsaWRhdGUgPSBjb25maWcuU2VydmVyV2l0aEFwaVVybFZhbGlkYXRlUGFzc2VuZ2VyO1xuICAgICAgICB0aGlzLmFjdGlvblVybFBvc3QgPSBjb25maWcuU2VydmVyV2l0aEFwaVVybEFkZFBhc3NlbmdlcjtcbiAgICAgICAgdGhpcy5hY3Rpb25VcmxDb3VudHJpZXMgPSBjb25maWcuU2VydmVyV2l0aEFwaVVybENvdW50cmllcztcbiAgICAgICAgdGhpcy5hY3Rpb25VcmxDaXRpZXMgPSBjb25maWcuU2VydmVyV2l0aEFwaVVybENpdGllcztcbiAgICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICAgICAgdGhpcy5oZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgdGhpcy5oZWFkZXJzLmFwcGVuZCgnQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgR2V0UGFzc2VuZ2VyKG9yZGVySUQ6IHN0cmluZywgYm9hcmRpbmdMb2NhdGlvbjogc3RyaW5nID0gXCJcIik6IE9ic2VydmFibGU8YW55PiB7XG5cbiAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgICAgICBoZWFkZXJzLmFwcGVuZChcIkFwaVVzZXJcIiwgdGhpcy5oZWFkZXJBcGl1c2VyKTsgICBcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJodHRwX2N1cnJlbmN5XCIsdGhpcy5oZWFkZXJDdXJyZW5jeSk7ICBcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJodHRwX3NhbGVzb2ZmaWNlXCIsdGhpcy5zYWxlc09mZmljZSk7XG4gICAgICAgIC8vIHJldHVybiB0aGlzLl9odHRwLmdldCh0aGlzLmFjdGlvblVybCArIG9yZGVySUQgKyBcIj9hcGlzPXRydWUmJmNraW49dHJ1ZSYmdGt0ZHRsPXRydWUmJmVtZGR0bD10cnVlXCIsIHsgaGVhZGVyczogaGVhZGVycyB9KVxuICAgICAgICAvLyAgICAgLm1hcChIYW5kbGVFcnJvckV4dHJhY3REYXRhLmV4dHJhY3REYXRhKS5jYXRjaChIYW5kbGVFcnJvckV4dHJhY3REYXRhLmhhbmRsZUVycm9ycyk7XG4gICAgICAgIHZhciBQT1NMb2NhdGlvbiA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcmRldGFpbHNcIiwgXCJcIikuc3Vic3RyKDAsIDMpO1xuICAgICAgICBsZXQgcmVxdWVzdCA9IFwiP1wiICsgXCJhcGlzPXRydWUmY2tpbj10cnVlJmNraW5zcmNod2luPXRydWUmc2hydGNrPXRydWUmdGt0ZHRsPXRydWVcIjtcbiAgICAgICAgaWYoYm9hcmRpbmdMb2NhdGlvbi50cmltKCkubGVuZ3RoPjApe1xuICAgICAgICAgICAgcmVxdWVzdCArPSBcIiZicmRsb2M9XCIgKyBib2FyZGluZ0xvY2F0aW9uO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJlcXVlc3QgKz0gXCImYnJkbG9jPVwiICsgUE9TTG9jYXRpb247ICAgICAgICAgICAgXG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiB0aGlzLl9odHRwLmdldCh0aGlzLmFjdGlvblVybCArIG9yZGVySUQgKyByZXF1ZXN0LCB7IGhlYWRlcnM6IGhlYWRlcnMgfSlcbiAgICAgICAgICAgIC5tYXAoSGFuZGxlRXJyb3JFeHRyYWN0RGF0YS5leHRyYWN0RGF0YSkuY2F0Y2goSGFuZGxlRXJyb3JFeHRyYWN0RGF0YS5oYW5kbGVFcnJvcnMpO1xuXG4gICAgfVxuICAgIHB1YmxpYyBHZXRQYXNzZW5nZXJyZWZyZXNoKG9yZGVySUQ6IHN0cmluZywgYm9hcmRpbmdMb2NhdGlvbjogc3RyaW5nID0gXCJcIik6IE9ic2VydmFibGU8YW55PiB7XG5cbiAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgICAgICBoZWFkZXJzLmFwcGVuZChcIkFwaVVzZXJcIiwgdGhpcy5oZWFkZXJBcGl1c2VyKTsgICBcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJodHRwX2N1cnJlbmN5XCIsdGhpcy5oZWFkZXJDdXJyZW5jeSk7ICBcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJodHRwX3NhbGVzb2ZmaWNlXCIsdGhpcy5zYWxlc09mZmljZSk7XG4gICAgICAgIC8vIHJldHVybiB0aGlzLl9odHRwLmdldCh0aGlzLmFjdGlvblVybCArIG9yZGVySUQgKyBcIj9hcGlzPXRydWUmJmNraW49dHJ1ZSYmdGt0ZHRsPXRydWUmJmVtZGR0bD10cnVlXCIsIHsgaGVhZGVyczogaGVhZGVycyB9KVxuICAgICAgICAvLyAgICAgLm1hcChIYW5kbGVFcnJvckV4dHJhY3REYXRhLmV4dHJhY3REYXRhKS5jYXRjaChIYW5kbGVFcnJvckV4dHJhY3REYXRhLmhhbmRsZUVycm9ycyk7XG4gICAgICAgIHZhciBQT1NMb2NhdGlvbiA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcmRldGFpbHNcIiwgXCJcIikuc3Vic3RyKDAsIDMpO1xuICAgICAgICBsZXQgcmVxdWVzdCA9IFwiP1wiICsgXCJhcGlzPXRydWUmY2tpbj10cnVlJmNraW5zcmNod2luPXRydWUmc2hydGNrPXRydWUmdGt0ZHRsPXRydWUmcmVmcmVzaD10cnVlXCI7XG4gICAgICAgIGlmKGJvYXJkaW5nTG9jYXRpb24udHJpbSgpLmxlbmd0aD4wKXtcbiAgICAgICAgICAgIHJlcXVlc3QgKz0gXCImYnJkbG9jPVwiICsgYm9hcmRpbmdMb2NhdGlvbjtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXF1ZXN0ICs9IFwiJmJyZGxvYz1cIiArIFBPU0xvY2F0aW9uOyAgICAgICAgICAgIFxuICAgICAgICB9IFxuICAgICAgICByZXR1cm4gdGhpcy5faHR0cC5nZXQodGhpcy5hY3Rpb25VcmwgKyBvcmRlcklEICsgcmVxdWVzdCwgeyBoZWFkZXJzOiBoZWFkZXJzIH0pXG4gICAgICAgICAgICAubWFwKEhhbmRsZUVycm9yRXh0cmFjdERhdGEuZXh0cmFjdERhdGEpLmNhdGNoKEhhbmRsZUVycm9yRXh0cmFjdERhdGEuaGFuZGxlRXJyb3JzKTtcblxuICAgIH1cblxuICAgIHB1YmxpYyBBZGRQYXNzZW5nZXIocmVxdWVzdDogYW55LCBvcmRlcklEOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuXG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICAgICAgLy8gaGVhZGVycy5hcHBlbmQoXCJBcGlVc2VyXCIsIHRoaXMuaGVhZGVyQXBpdXNlcik7ICAgXG4gICAgICAgIC8vIGhlYWRlcnMuYXBwZW5kKFwiaHR0cF9jdXJyZW5jeVwiLHRoaXMuaGVhZGVyQ3VycmVuY3kpOyAgXG4gICAgICAgIC8vIGhlYWRlcnMuYXBwZW5kKFwiaHR0cF9zYWxlc29mZmljZVwiLHRoaXMuc2FsZXNPZmZpY2UpO1xuICAgICAgICBoZWFkZXJzLmFwcGVuZChcIkFwaVVzZXJcIiwgXCJvc09rN2x1cG9jUUJpRUQvdVp0WVBZV2thcWxMMDZidm1LdFNXSm9VbFBZPVwiKTtcbiAgICAgICAvLyByZXR1cm4gdGhpcy5faHR0cC5wb3N0KHRoaXMuYWN0aW9uVXJsUG9zdCArIG9yZGVySUQgKyBcIi9hcGlzXCIsIEpTT04uc3RyaW5naWZ5KHJlcXVlc3QpLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSlcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0dHAucG9zdCh0aGlzLmFjdGlvblVybFBvc3QgKyBvcmRlcklEICsgXCIvYXBpc1wiLCBKU09OLnN0cmluZ2lmeShyZXF1ZXN0KSwgeyBoZWFkZXJzOiBoZWFkZXJzIH0pXG4gICAgICAgICAgICAubWFwKEhhbmRsZUVycm9yRXh0cmFjdERhdGEuZXh0cmFjdERhdGEpXG4gICAgICAgICAgICAuY2F0Y2goSGFuZGxlRXJyb3JFeHRyYWN0RGF0YS5oYW5kbGVFcnJvcnMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBTdGF0dXBUYWJsZSgpOiBPYnNlcnZhYmxlPGFueT4ge1xuXG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJBcGlVc2VyXCIsIFwib3NPazdsdXBvY1FCaUVEL3VadFlQWVdrYXFsTDA2YnZtS3RTV0pvVWxQWT1cIik7XG4gICAgICAgIHJldHVybiB0aGlzLl9odHRwLnBvc3QoXCJodHRwOi8vdXN0bHNzb2F0MjU4LmFpcnNlcnZpY2VzLnN2Y3MuZW50c3Zjcy5uZXQ6MTI0OTkvYXBpL3JlZmVyZW5jZS9zdGFydHVwXCIsIHsgaGVhZGVyczogaGVhZGVycyB9KVxuICAgICAgICAgICAgLm1hcChIYW5kbGVFcnJvckV4dHJhY3REYXRhLmV4dHJhY3REYXRhKVxuICAgICAgICAgICAgLmNhdGNoKEhhbmRsZUVycm9yRXh0cmFjdERhdGEuaGFuZGxlRXJyb3JzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgVXBkYXRlUGFzc2VuZ2VyKHJlcXVlc3Q6IGFueSwgb3JkZXJJRDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgICAgICBoZWFkZXJzLmFwcGVuZChcIkFwaVVzZXJcIiwgdGhpcy5oZWFkZXJBcGl1c2VyKTsgICBcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJodHRwX2N1cnJlbmN5XCIsdGhpcy5oZWFkZXJDdXJyZW5jeSk7ICBcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJodHRwX3NhbGVzb2ZmaWNlXCIsdGhpcy5zYWxlc09mZmljZSk7XG4gICAgICAgIHJldHVybiB0aGlzLl9odHRwLnBvc3QodGhpcy5hY3Rpb25VcmxQb3N0ICsgb3JkZXJJRCArIFwiL3RyYXZlbGVyL3VwZGF0ZT90a3RkdGw9dHJ1ZSZhcGlzPXRydWUmY2tpbj10cnVlJmVtZGR0bD10cnVlXCIsIEpTT04uc3RyaW5naWZ5KHJlcXVlc3QpLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSlcbiAgICAgICAgICAgIC5tYXAoSGFuZGxlRXJyb3JFeHRyYWN0RGF0YS5leHRyYWN0RGF0YSlcbiAgICAgICAgICAgIC5jYXRjaChIYW5kbGVFcnJvckV4dHJhY3REYXRhLmhhbmRsZUVycm9ycyk7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgR2V0UmVxdWlyZWREb2N1bWVudHMob3JkZXJJRDogc3RyaW5nKTogT2JzZXJ2YWJsZTxHZXRQYXNzZW5nZXI+IHtcblxuICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBjb25zb2xlLmxvZygnR2V0IFJlcXVpcmVkIERvY3VtZW50IFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJBcGlVc2VyXCIsIHRoaXMuaGVhZGVyQXBpdXNlcik7ICAgXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiaHR0cF9jdXJyZW5jeVwiLHRoaXMuaGVhZGVyQ3VycmVuY3kpOyAgXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiaHR0cF9zYWxlc29mZmljZVwiLHRoaXMuc2FsZXNPZmZpY2UpO1xuICAgICAgICByZXR1cm4gdGhpcy5faHR0cC5nZXQodGhpcy5hY3Rpb25VcmxGb3JSZXFEb2NzICsgb3JkZXJJRCArIFwiL2FwaXMvZG9jdW1lbnRzXCIsIHsgaGVhZGVyczogaGVhZGVycyB9KS5tYXAoSGFuZGxlRXJyb3JFeHRyYWN0RGF0YS5leHRyYWN0RGF0YSkuY2F0Y2goSGFuZGxlRXJyb3JFeHRyYWN0RGF0YS5oYW5kbGVFcnJvcnMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBHZXRWYWxpZGF0ZVBhc3NlbmdlcihyZXF1ZXN0OiBhbnksIG9yZGVySUQ6IHN0cmluZyk6IE9ic2VydmFibGU8R2V0UGFzc2VuZ2VyPiB7XG5cbiAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgICAgICBoZWFkZXJzLmFwcGVuZChcIkFwaVVzZXJcIiwgdGhpcy5oZWFkZXJBcGl1c2VyKTsgICBcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJodHRwX2N1cnJlbmN5XCIsdGhpcy5oZWFkZXJDdXJyZW5jeSk7ICBcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJodHRwX3NhbGVzb2ZmaWNlXCIsdGhpcy5zYWxlc09mZmljZSk7XG4gICAgICAgIHJldHVybiB0aGlzLl9odHRwLnBvc3QodGhpcy5hY3Rpb25VcmxGb3JSZXFEb2NzICsgb3JkZXJJRCArIFwiL2FwaXMvdmFsaWRhdGVcIiwgSlNPTi5zdHJpbmdpZnkocmVxdWVzdCksIHsgaGVhZGVyczogaGVhZGVycyB9KS5tYXAoSGFuZGxlRXJyb3JFeHRyYWN0RGF0YS5leHRyYWN0RGF0YSkuY2F0Y2goSGFuZGxlRXJyb3JFeHRyYWN0RGF0YS5oYW5kbGVFcnJvcnMpO1xuXG4gICAgfVxuXG4gICAgcHVibGljIEdldENvdW50cmllcygpOiBPYnNlcnZhYmxlPGFueT4ge1xuXG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJBcGlVc2VyXCIsIHRoaXMuaGVhZGVyQXBpdXNlcik7ICAgXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiaHR0cF9jdXJyZW5jeVwiLHRoaXMuaGVhZGVyQ3VycmVuY3kpOyAgXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiaHR0cF9zYWxlc29mZmljZVwiLHRoaXMuc2FsZXNPZmZpY2UpO1xuICAgICAgICByZXR1cm4gdGhpcy5faHR0cC5nZXQodGhpcy5hY3Rpb25VcmxDb3VudHJpZXMsIHsgaGVhZGVyczogaGVhZGVycyB9KS5tYXAoSGFuZGxlRXJyb3JFeHRyYWN0RGF0YS5leHRyYWN0RGF0YSkuY2F0Y2goSGFuZGxlRXJyb3JFeHRyYWN0RGF0YS5oYW5kbGVFcnJvcnMpO1xuXG4gICAgfVxuXG4gICAgcHVibGljIEdldENpdGllcyhjb2RlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuXG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJBcGlVc2VyXCIsIHRoaXMuaGVhZGVyQXBpdXNlcik7ICAgXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiaHR0cF9jdXJyZW5jeVwiLHRoaXMuaGVhZGVyQ3VycmVuY3kpOyAgXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiaHR0cF9zYWxlc29mZmljZVwiLHRoaXMuc2FsZXNPZmZpY2UpO1xuICAgICAgICByZXR1cm4gdGhpcy5faHR0cC5nZXQodGhpcy5hY3Rpb25VcmxDaXRpZXMgKyBjb2RlLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSkubWFwKEhhbmRsZUVycm9yRXh0cmFjdERhdGEuZXh0cmFjdERhdGEpLmNhdGNoKEhhbmRsZUVycm9yRXh0cmFjdERhdGEuaGFuZGxlRXJyb3JzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgTG9nT3V0KCkge1xuICAgICAgICBkaWFsb2dzLmNvbmZpcm0oXCJEbyB5b3Ugd2FudCB0byBMb2dvdXQ/XCIpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGlhbG9nIHJlc3VsdDogXCIgKyByZXN1bHQpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRDdXJyZW5jeShudWxsKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9Mb2dpbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcHVibGljIG5hdmlnYXRlVG9Mb2dpbigpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIlwiXSwge1xuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBleHRyYWN0RGF0YShyZXM6IFJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHRcblx0XHRpZiAocmVzLnRleHQoKS5pbmRleE9mKCdTaXRlbWluZGVyIC0gTG9naW4nKSA+IC0xKSB7XG5cdFx0XHR0aHJvdyBcIlNlc3Npb25UaW1lb3V0XCJcblx0XHR9XG4gICAgICAgIGxldCBib2R5ID0gcmVzLmpzb24oKTtcbiAgICAgICAgaWYoYm9keS5CYWRSZXF1ZXN0ICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBpZihib2R5LkVycm9yTWVzc2FnZSAhPXVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgdGhyb3coYm9keS5FcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhyb3coYm9keS5nZW5lcmljTWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblx0XHRyZXR1cm4gYm9keTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZUVycm9ycyhlcnJvcjogUmVzcG9uc2UgfCBhbnkpIHtcbiAgICAgICAgLy8gYWxlcnQoXCJVbmFibGUgdG8gY29ubmVjdCB0byB0aGUgcmVtb3RlIHNlcnZlclwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJIYW5kbGVyIFJlYWR5XCIpO1xuICAgICAgICBjb25zdCBjb29raWVzOiBhbnkgPSBOU0hUVFBDb29raWVTdG9yYWdlLnNoYXJlZEhUVFBDb29raWVTdG9yYWdlLmNvb2tpZXM7XG4gICAgICAgIGlmICh0eXBlb2YgY29va2llcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIC8vICAgICB0aGlzLk91dHB1dCA9IFwiTm8gQ29va2llKHMpIEF2YWlsYWJsZVwiO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29raWVzLmNvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb29raWU6IGFueSA9IGNvb2tpZXMub2JqZWN0QXRJbmRleChpKTtcbiAgICAgICAgICAgICAgICBpZiAoY29va2llLm5hbWUgPT0gXCJTTVNFU1NJT05cIilcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY29va2llKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmcm9tIFNlcnZpY2UgXCIgKyBlcnJvcik7XG4gICAgICAgICAgICB2YXIgZXJyb3JNZXNzYWdlID0gZXJyb3IudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIC8vIGlmIChlcnJvck1lc3NhZ2UuaW5kZXhPZihcIlVucmVjb2duaXplZCB0b2tlbiAnPCdcIikgPT0gLTEpIHtcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIkhhbmRsZUVycm9yc1wiKTtcbiAgICAgICAgICAgIC8vICAgICBsZXQgZXJyTXNnOiBzdHJpbmc7XG4gICAgICAgICAgICAvLyAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgY29uc3QgYm9keSA9IGVycm9yLmpzb24oKSB8fCAnJztcbiAgICAgICAgICAgIC8vICAgICAgICAgY29uc3QgZXJyID0gYm9keS5lcnJvciB8fCBKU09OLnN0cmluZ2lmeShib2R5KTtcbiAgICAgICAgICAgIC8vICAgICAgICAgZXJyTXNnID0gYCR7ZXJyb3Iuc3RhdHVzfSAtICR7ZXJyb3Iuc3RhdHVzVGV4dCB8fCAnJ30gJHtlcnJ9YDtcbiAgICAgICAgICAgIC8vICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgICAgICBlcnJNc2cgPSBlcnJvci5tZXNzYWdlID8gZXJyb3IubWVzc2FnZSA6IGVycm9yLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUuZXJyb3IoZXJyTXNnKTtcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdyhlcnJNc2cpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJlbHNlXCIpO1xuICAgICAgICAgICAgLy8gICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGVycm9yKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdygnVW5hYmxlIHRvIENvbm5lY3QuIFZlcmlmeSBOZXR3b3JrLicpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5zdGF0dXMgPT0gMjAwKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdygnVW5hYmxlIHRvIGNvbm5lY3QgdG8gc2VydmVyLiBOZXR3b3JrIEVycm9yLicpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5zdGF0dXMgPT0gNDAwKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdygnVW5hYmxlIHRvIGdldCByZXNwb25zZS4gQmFkIFJlcXVlc3QuIFs0MDBdJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnN0YXR1cyA9PSA0MDQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdygnVW5hYmxlIHRvIGNvbm5lY3QgdG8gc2VydmVyLiBOZXR3b3JrIEVycm9yLiBbNDA0XScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5zdGF0dXMgPT0gNTAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coJ0ludGVybmFsIFNlcnZlciBFcnJvciBbNTAwXS4nKTtcbiAgICAgICAgICAgIH1lbHNlIGlmIChlcnJvci5zdGF0dXMgPT0gNTAyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coJ3VuYWJsZSB0byByZWNlaXZlZCBhIHZhbGlkIHJlc3BvbnNlLkJhZCBHYXRlV2F5IFs1MDJdJyk7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJIYW5kbGVyIFJlYWR5XCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJoaVwiKTtcbiAgICAgICAgICAgIC8vIHRoaXMuZGlzcGxheVN0YW5kYXJkcHJvZHVjdHNEaWFsb2coKTsgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGNvb2tpZXMgfHwgJ1NlcnZlciBlcnJvcicpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgXG59Il19