"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var router_2 = require("nativescript-angular/router");
var page_1 = require("ui/page");
var moment = require("moment");
var connectivity = require("connectivity");
var zebra = require("nativescript-print-zebra");
// import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
//external modules and plugins
var ApplicationSettings = require("application-settings");
var Toast = require("nativescript-toast");
// import * as IQKeyboardManager from 'nativescript-iqkeyboardmanager'
//app references
var index_1 = require("../../shared/interface/index");
var index_2 = require("../../shared/services/index");
var app_executiontime_1 = require("../../app.executiontime");
var app_constants_1 = require("../../app.constants");
var http_1 = require("@angular/http");
var index_3 = require("../../shared/utils/index");
console.log(ApplicationSettings.getString('printer', ''));
var passwordTextField;
var LoginComponent = /** @class */ (function () {
    function LoginComponent(_compservices, _homepage, _http, _login, page, routerExtensions, _timeoutService, route, router, _dataService, location, _shared) {
        this._compservices = _compservices;
        this._homepage = _homepage;
        this._http = _http;
        this._login = _login;
        this.page = page;
        this.routerExtensions = routerExtensions;
        this._timeoutService = _timeoutService;
        this.route = route;
        this.router = router;
        this._dataService = _dataService;
        this.location = location;
        this._shared = _shared;
        this.iqKeyboard = IQKeyboardManager.sharedManager();
        this.isButtonEnabled = false;
        this.UserName = "";
        this.PassWord = "";
        this.index = null;
        this.profileDetails = [];
        this.idleState = 'Not started.';
        this.timedOut = false;
        this.Output = "";
        this.ProfileArray = new index_1.AccontProfileModel.AccountProfileTemplate();
        this.cityList = [];
        this.filterCityList = [];
        this.filterCityCode = [];
        this.AgentProfileList = [];
        this.isCompensationDisabled = false;
        this.isPrevDaySalesReportNotClosed = false;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.iqKeyboard.enableAutoToolbar = true;
        ApplicationSettings.setString('apiurl', "http://ustlssoam316.airservices.svcs.entsvcs.net:8980/");
        this.iqKeyboard.goNext(),
            this.isError = false;
        this.errorMessage = "";
        this.loaderProgress = new index_1.LoaderProgress();
        var connectionType = connectivity.getConnectionType();
        switch (connectionType) {
            case connectivity.connectionType.none:
                alert("No internet connection ");
                break;
            case connectivity.connectionType.wifi:
                console.log("wifi");
                break;
            case connectivity.connectionType.mobile:
                console.log("mobile");
                break;
            default:
                break;
        }
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.page.actionBarHidden = true;
        this.page.style.backgroundImage = "url('~/images/clouds_body.jpg')";
        this.page.style.backgroundSize = "cover ";
        this.page.style.backgroundPosition = "-10";
        UIApplication.sharedApplication.setStatusBarHiddenAnimated(true, false);
        this.loaderProgress.initLoader(this.pageCont);
        var date = this._shared.GetDateFormat();
        if (date != "Select Date Format") {
            this.getDateFormat = date;
        }
        else {
            this.getDateFormat = "DD MMM YYYY";
        }
        connectivity.startMonitoring(function (newConnectionType) {
            switch (newConnectionType) {
                case connectivity.connectionType.none:
                    // this.connectionType = "None";
                    alert("No internet connection");
                    break;
                case connectivity.connectionType.wifi:
                    // this.connectionType = "Wi-Fi";
                    console.log("Connection type changed to WiFi.");
                    break;
                case connectivity.connectionType.mobile:
                    // this.connectionType = "Mobile";
                    console.log("Connection type changed to mobile.");
                    break;
                default:
                    break;
            }
        });
        this.getBluetoothPrinterDetails();
        console.log(ApplicationSettings.getString('apiurl', ''));
        var label = this.pageCont.nativeElement;
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();
        });
    };
    // getProfile(): void {
    //     try {
    //         var sDate = new Date();
    //         console.log('GetAccountProfile Service --------------- Start Date Time : ' + sDate);
    //         this.loaderProgress.showLoader();
    //         this.profileDetails.push({ userName: "cm.pty.agent", apiUserKey: "osOk7lupocQBiED/uZtYPYWkaqlL06bvmKtSWJoUlPY=" });
    //         this.profileDetails.push({ userName: "cm.lax.agent", apiUserKey: "zs9c+D35ChVxt5Y40jUsaQBmslSeVv2Rk2k4Vh+jSe0=" });
    //         this.profileDetails.push({ userName: "cm.crc.agent", apiUserKey: "74/sNpCdU/063cGV30YiihV4SnpBGdee3vF0A02/8EU=" });
    //         this.profileDetails.push({ userName: "cm.mex.agent", apiUserKey: "b4ASfQ+INPYNUwJhzUu0ykb4pzFSSLP0snuA4KP5W+8=" });
    //         this.profileDetails.push({ userName: "cm.bog.agent", apiUserKey: "I3GilbrWqYtCZSj20Ofc4Q8wO2WymKDfDzMiQs4OWGw=" });
    //         this.profileDetails.push({ userName: "cm.gru.agent", apiUserKey: "t+HuOwt45+MJBmLkOPSLduYS2X3/yBAmq3953xlCWCs=" });
    //         this.profileDetails.push({ userName: "cm.scl.agent", apiUserKey: "lidWAJLNBL/h+4e/IBDQCGTce9e09ZotmjPyTWtdfD8=" });
    //         this.profileDetails.push({ userName: "cm.eze.agent", apiUserKey: "8f2ogbvrbobfPiptMNXnSsR7C9QG3hjxpyMYZGZu9iE=" });
    //         this.profileDetails.push({ userName: "cm.yyz.agent", apiUserKey: "C0dLacDdgW8wBBMk26KE1+jxRYLlegw2MrGEw1B8Ghw=" });
    //         this.profileDetails.push({ userName: "cm.mvd.agent", apiUserKey: "q/BPx4Wk1UeBnDKuRNEA2kMbJ1H7dO3+Bf1XW8/J4fQ=" });
    //         this.profileDetails.push({ userName: "cm.puj.agent", apiUserKey: "ov68V7zyS74SklDCdVo6WQEzWWCtbKNHLvw8fCXzb/k=" });
    //         this.profileDetails.push({ userName: "cm.sju.agent", apiUserKey: "DuIBPFxkEvD1ec2kLgW50VyPea9ghxCWi82X+UzVpcE=" });
    //         this.profileDetails.push({ userName: "cm.pty.sr", apiUserKey: "xOTd5k5OpW+lOiGi/8BYJjWLUHVD+emmKLMrSs5RWqE=" });
    //         this.profileDetails.push({ userName: "cm.lax.sr", apiUserKey: "IbF2ZNkYZmN3595PeuQD0XtJQFZzzL/MHt0RvxJVXeQ=" });
    //         this.profileDetails.push({ userName: "cm.cor.agent1", apiUserKey: "LOe1LhDb08a6NAaUwu8oBBHc2jEFyJnrqNswb9xhcgs=" });
    //         this.profileDetails.push({ userName: "cm.cor.agent2", apiUserKey: "DUcRXYhYX//Kl23oiYAIXfA3OEdwPrFWco+YEQa9xc0=" });
    //         this.profileDetails.push({ userName: "cm.cor.sprvsr", apiUserKey: "6GPvjz2kWJL8w+7cBKgd8FMXIy6VY6WTW7BDsnyVzZk=" });
    //         var profile = this.profileDetails.filter(m => m.userName == this.UserName.trim().toLowerCase());
    //         console.dir(profile);
    //         if (profile != null && profile.length > 0) {
    //             ApplicationSettings.setString("apiUserKey", profile[0].apiUserKey);
    //             this.routerExtensions.navigate(["home"], {
    //                 transition: {
    //                     name: "fade",
    //                     duration: 600,
    //                     curve: "linear"
    //                 },
    //                 queryParams:
    //                     {
    //                         "data": profile,
    //                     }
    //             });
    //         }
    //         else {
    //             this.isError = true;
    //             this.errorMessage = "Invalid UserID or Password";
    //         }
    //         this.loaderProgress.hideLoader();
    //     }
    //     catch (error) {
    //         console.log(error.message);
    //         this.loaderProgress.hideLoader();
    //     }
    //     finally {
    //         var eDate = new Date();
    //         console.log('GetAccountProfile Service --------------- End Date Time : ' + eDate);
    //         console.log('GetAccountProfile Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
    //     }
    // }
    LoginComponent.prototype.getProfile = function (salesOffice, currency) {
        var _this = this;
        if (salesOffice === void 0) { salesOffice = ""; }
        if (currency === void 0) { currency = ""; }
        try {
            var sDate = new Date();
            console.log('GetAccountProfile Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            this._homepage.GetAccountProfile(salesOffice, currency)
                .subscribe(function (data) {
                ApplicationSettings.setString("UserName", data.Username);
                // console.log("Privilage:" + JSON.stringify(data));
                _this.isCheckinDisabled = false;
                _this.isGateDisabled = false;
                _this.isCompensationDisabled = false;
                _this._shared.setAgentPrivilage(data.Privileges);
                data.Privileges.forEach(function (privilage, Index) {
                    if (privilage.Name == "IssueLowerCompensationAirport" || privilage.Name == "IssueHigherCompensationAirport" || privilage.Name == "IssueLowerCompensationCustomerCare" || privilage.Name == "IssueMediumCompensationCustomerCare" || privilage.Name == "IssueHigherCompensationCustomerCare") {
                        console.log("inside privilage");
                        _this.isCompensationDisabled = true;
                    }
                    if (privilage.Name == "AccessCheckinWorkflow") {
                        _this.isCheckinDisabled = true;
                    }
                    if (privilage.Name == "AccessGateWorkflow") {
                        _this.isGateDisabled = true;
                    }
                });
                ApplicationSettings.setString("carrierCode", data.CarrierCode);
                ApplicationSettings.setBoolean("checkinDisabled", _this.isCheckinDisabled);
                ApplicationSettings.setBoolean("gateDisabled", _this.isGateDisabled);
                ApplicationSettings.setBoolean("compensationEnabled", _this.isCompensationDisabled);
                // this.ProfileDetails = <Order.RootObject>data;
                _this.ProfileArray = new index_1.AccontProfileModel.AccountProfileTemplate();
                _this.ProfileArray = index_3.Converters.ConvertToAccountProfileTemplate(data);
                // this.userdetails = this.ProfileArray.PointOfSales[0].AirportCode + " | " + moment().format(this.getDateFormat) + " | " + this.ProfileArray.Username;
                var defaultPOS = _this.ProfileArray.PointOfSales.filter(function (m) { return m.AgentCode === _this.ProfileArray.Requestor_ID && m.AirportCode === _this.ProfileArray.PhysicalLocation; });
                if (defaultPOS.length > 0) {
                    _this.userdetails = defaultPOS[0].AirportCode + " | " + moment().format(_this.getDateFormat) + " | " + _this.ProfileArray.Username;
                    _this._shared.SetUserPointofSale(defaultPOS[0].ID);
                }
                else {
                    _this.userdetails = _this.ProfileArray.PointOfSales[0].AirportCode + " | " + moment().format(_this.getDateFormat) + " | " + _this.ProfileArray.Username;
                    _this._shared.SetUserPointofSale(_this.ProfileArray.PointOfSales[0].ID);
                }
                ApplicationSettings.setString("userdetails", _this.userdetails);
                _this._shared.SetUserProfile(_this.ProfileArray);
                _this._shared.SetCurrency(_this.ProfileArray.ISOCurrencyCode);
                _this.AgentProfileList = [];
                _this.ProfileArray.PointOfSales.forEach(function (agentData, agentIndex) {
                    var agentList = agentData.AirportCode + "  " + agentData.Name;
                    _this.AgentProfileList.push(agentList);
                });
                _this._shared.SetAgentProfileList(_this.ProfileArray);
                _this.getCity();
            }, function (error) {
                console.log("Couldnt find information for this Profile " + error);
                _this.loaderProgress.hideLoader();
            }, function () {
                // sthis.loaderProgress.hideLoader();
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('GetAccountProfile Service --------------- End Date Time : ' + eDate);
            console.log('GetAccountProfile Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    LoginComponent.prototype.getCity = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetCityType Service --------------- Start Date Time : ' + sDate);
            this._homepage.getCityService()
                .subscribe(function (data) {
                // console.dir(data);
                var CompansationDetails = data;
                console.log(CompansationDetails);
                _this.cityList = data.Collection;
                _this._shared.setCityList(_this.cityList);
                // console.dir(this.cityList);
                // setTimeout(() =>, 5000);
                _this.getSalesReport();
                // this.loaderProgress.hideLoader()
            }, function (err) {
                console.log("c");
                _this.loaderProgress.hideLoader();
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('Get GetCityType Service --------------- End Date Time : ' + eDate);
            console.log('Get GetCityType Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    LoginComponent.prototype.getSalesReport = function () {
        var _this = this;
        this.loaderProgress.showLoader();
        this._compservices.getSaleOfficeReport().subscribe(function (data) {
            console.log("Sales report:" + JSON.stringify(data));
            if (data.HasOpenPastDueSalesReports) {
                _this.isPrevDaySalesReportNotClosed = true;
                _this.isCompensationDisabled = false;
                _this.loaderProgress.hideLoader();
                Toast.makeText("Close previous day Sales Reporting to proceed.").show();
            }
            _this.loaderProgress.hideLoader();
            _this.navigatetohome();
        }, function (err) {
            console.log("Couldnt find information" + err);
            _this.handleServiceError(err);
            _this.loaderProgress.hideLoader();
        });
    };
    LoginComponent.prototype.getBluetoothPrinterDetails = function () {
        var discovery = new zebra.Discovery();
        var self = this;
        discovery.searchBluetooth().then(function (printers) {
            var count = printers.length;
            if (count === 0) {
                console.log("message", "Unable to find");
                // Toast.makeText("No Device found").show();
            }
            else if (count >= 1) {
                // We found a valid printer
                var actions = [];
                console.dir(printers);
                printers.forEach(function (element) {
                    actions.push(element.address);
                });
                ApplicationSettings.setString('printer', actions[0]);
                // let options = {
                //     title: "Bluetooth Printer",
                //     message: "Select Printer",
                //     cancelButtonText: "Cancel",
                //     actions: actions
                // };
                // dialogs.action(options).then((result) => {
                //     console.log(result);
                //     ApplicationSettings.setString('printer', result);
                //     // self.bltPrinter = result;
                // }, (err) => {
                // });
            }
        });
    };
    LoginComponent.prototype.loginSubmit = function () {
        if (this.UserName != "" && this.PassWord != "") {
            this.authenticateUser();
        }
        else {
            this.isError = true;
            // this.errorMessage = "Invalid UserName/Password";
            if (this.PassWord == "" && this.UserName != "") {
                this.errorMessage = "Please enter a Password";
            }
            else if (this.UserName == "" && this.PassWord != "") {
                this.errorMessage = "Please enter a UserName";
            }
            else {
                this.errorMessage = "Please enter a UserName and Password";
            }
        }
    };
    LoginComponent.prototype.authenticateUser = function () {
        var _this = this;
        console.log("Start Login");
        this.loaderProgress.showLoader();
        //    let requestData = 
        //     "USER=" + this.UserName.toString()+
        //     "&PASSWORD=" + encodeURIComponent(this.PassWord.toString())+
        //     "&TARGET=" + encodeURIComponent("http://pssguicmm.airservices.svcs.entsvcs.net:8980/api/account/profile") +
        //     "&LOCATION=" + encodeURIComponent("/css") ;
        // console.log(JSON.stringify(requestData));
        this._login.login(this.UserName, this.PassWord).subscribe(function (res) {
            var result = res;
            console.dir(result);
            console.log("success");
            _this._login.StatupTable().subscribe(function (result) {
                _this._shared.SetStartupTable(result);
            });
            // this.navigatetohome();
            _this.getProfile();
        }, function (err) {
            //  this.isError = true;
            //  this.errorMessage = "Invalid Username/Password";
            _this.handleServiceError(err);
            _this.loaderProgress.hideLoader();
            // var errorMessage = err.toString();
            // if (errorMessage.indexOf("Unrecognized token '<'") != -1) {
            //     console.log(err);
            //     this.isError = true;
            //     this.errorMessage = "Invalid Username/Password";
            //     this.loaderProgress.hideLoader();
            // } else {
            //     Toast.makeText("Unable to connect to the server").show();
            //     this.loaderProgress.hideLoader();
            // }
        });
    };
    // Siteminder Code ends
    LoginComponent.prototype.isCookieSet = function () {
        var cookies = NSHTTPCookieStorage.sharedHTTPCookieStorage.cookies;
        if (typeof cookies !== 'undefined') {
            this.Output = "No Cookie(s) Available";
            for (var i = 0; i < cookies.count; i++) {
                var cookie = cookies.objectAtIndex(i);
                if (cookie.name == "SMSESSION") {
                    this.Output = cookie.name + ":\n" + cookie.value;
                    console.log("Cookie Value");
                    // ApplicationSettings.setString("cookievalue","cookie.value");
                    console.log(cookie.value);
                }
            }
        }
        else {
            this.Output = "No Cookie(s) Available";
        }
    };
    LoginComponent.prototype.onChange = function (args) {
        if (this.UserName == "" && this.PassWord == "") {
            this.isButtonEnabled = false;
        }
        else {
            this.isButtonEnabled = true;
        }
    };
    LoginComponent.prototype.navigatetohome = function () {
        this.loaderProgress.hideLoader();
        this.routerExtensions.navigate(["home"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    LoginComponent.prototype.userNameReturnPress = function (args) {
        passwordTextField = this.page.getViewById("password");
        passwordTextField.focus();
    };
    LoginComponent.prototype.handleServiceError = function (error) {
        var errorMessage = error.toString();
        if (errorMessage.indexOf("SessionTimeout") > -1) {
            Toast.makeText("Invalid Username or Password").show();
            // this.loaderProgress.hideLoader();
        }
        else {
            Toast.makeText(errorMessage).show();
        }
    };
    __decorate([
        core_1.ViewChild('pagecontainer'),
        __metadata("design:type", core_1.ElementRef)
    ], LoginComponent.prototype, "pageCont", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            selector: "login-page",
            providers: [index_2.DataService, app_constants_1.Configuration, index_2.LoginService, index_2.HomePageService, index_2.CompensationService],
            templateUrl: "./components/login/login.component.html",
            styleUrls: ["./components/login/login.component.css"]
        }),
        __metadata("design:paramtypes", [index_2.CompensationService, index_2.HomePageService, http_1.Http, index_2.LoginService, page_1.Page, router_2.RouterExtensions, index_2.TimeOutService, router_1.ActivatedRoute, router_1.Router, index_2.DataService, common_1.Location, index_2.CheckinOrderService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJGO0FBQzNGLDBDQUEyRTtBQUMzRSwwQ0FBMkM7QUFDM0Msc0RBQStEO0FBQy9ELGdDQUErQjtBQUMvQiwrQkFBaUM7QUFDakMsMkNBQTZDO0FBRzdDLGdEQUFrRDtBQUdsRCxnRUFBZ0U7QUFFaEUsOEJBQThCO0FBQzlCLDBEQUE0RDtBQUM1RCwwQ0FBNEM7QUFDNUMsc0VBQXNFO0FBRXRFLGdCQUFnQjtBQUNoQixzREFBK0U7QUFDL0UscURBQWdKO0FBQ2hKLDZEQUEyRDtBQUMzRCxxREFBb0Q7QUFFcEQsc0NBQThEO0FBQzlELGtEQUFzRDtBQUl0RCxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxRCxJQUFJLGlCQUFzQyxDQUFBO0FBTzFDO0lBMkJJLHdCQUFtQixhQUFrQyxFQUFRLFNBQTBCLEVBQVMsS0FBVyxFQUFTLE1BQW1CLEVBQVUsSUFBVSxFQUFVLGdCQUFrQyxFQUFTLGVBQStCLEVBQVUsS0FBcUIsRUFBVSxNQUFjLEVBQVMsWUFBeUIsRUFBVSxRQUFrQixFQUFRLE9BQTRCO1FBQXJYLGtCQUFhLEdBQWIsYUFBYSxDQUFxQjtRQUFRLGNBQVMsR0FBVCxTQUFTLENBQWlCO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBTTtRQUFTLFdBQU0sR0FBTixNQUFNLENBQWE7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUFTLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUFVLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQVUsYUFBUSxHQUFSLFFB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S0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BDLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQzdDLEtBQUssQ0FBQyxRQUFRLENBQUMsOEJBQThCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN0RCxvQ0FBb0M7U0FDdkM7YUFDRztZQUNBLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDdkM7SUFDTCxDQUFDO0lBdFoyQjtRQUEzQixnQkFBUyxDQUFDLGVBQWUsQ0FBQztrQ0FBVyxpQkFBVTtvREFBQztJQTFCeEMsY0FBYztRQU4xQixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFlBQVk7WUFDdEIsU0FBUyxFQUFFLENBQUMsbUJBQVcsRUFBRSw2QkFBYSxFQUFDLG9CQUFZLEVBQUMsdUJBQWUsRUFBQywyQkFBbUIsQ0FBQztZQUN4RixXQUFXLEVBQUUseUNBQXlDO1lBQ3RELFNBQVMsRUFBRSxDQUFDLHdDQUF3QyxDQUFDO1NBQ3hELENBQUM7eUNBNEJvQywyQkFBbUIsRUFBbUIsdUJBQWUsRUFBZ0IsV0FBSSxFQUFnQixvQkFBWSxFQUFnQixXQUFJLEVBQTRCLHlCQUFnQixFQUEwQixzQkFBYyxFQUFpQix1QkFBYyxFQUFrQixlQUFNLEVBQXVCLG1CQUFXLEVBQW9CLGlCQUFRLEVBQWlCLDJCQUFtQjtPQTNCL1gsY0FBYyxDQWtiMUI7SUFBRCxxQkFBQztDQUFBLEFBbGJELElBa2JDO0FBbGJZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvbkV4dHJhcywgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcclxuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XHJcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tIFwibW9tZW50XCI7XHJcbmltcG9ydCAqIGFzIGNvbm5lY3Rpdml0eSBmcm9tIFwiY29ubmVjdGl2aXR5XCI7XHJcbmltcG9ydCB0ZXh0RmllbGQgPSByZXF1aXJlKFwidWkvdGV4dC1maWVsZFwiKTtcclxuaW1wb3J0ICogYXMgZ2VzdHVyZXMgZnJvbSBcInVpL2dlc3R1cmVzXCI7XHJcbmltcG9ydCAqIGFzIHplYnJhIGZyb20gJ25hdGl2ZXNjcmlwdC1wcmludC16ZWJyYSc7XHJcbmltcG9ydCBkaWFsb2dzID0gcmVxdWlyZShcInVpL2RpYWxvZ3NcIik7XHJcblxyXG4vLyBpbXBvcnQge0lkbGUsIERFRkFVTFRfSU5URVJSVVBUU09VUkNFU30gZnJvbSAnQG5nLWlkbGUvY29yZSc7XHJcblxyXG4vL2V4dGVybmFsIG1vZHVsZXMgYW5kIHBsdWdpbnNcclxuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcclxuLy8gaW1wb3J0ICogYXMgSVFLZXlib2FyZE1hbmFnZXIgZnJvbSAnbmF0aXZlc2NyaXB0LWlxa2V5Ym9hcmRtYW5hZ2VyJ1xyXG5cclxuLy9hcHAgcmVmZXJlbmNlc1xyXG5pbXBvcnQgeyBMb2FkZXJQcm9ncmVzcyxBY2NvbnRQcm9maWxlTW9kZWx9IGZyb20gXCIuLi8uLi9zaGFyZWQvaW50ZXJmYWNlL2luZGV4XCJcclxuaW1wb3J0IHsgRGF0YVNlcnZpY2UsIFRpbWVPdXRTZXJ2aWNlLCBDaGVja2luT3JkZXJTZXJ2aWNlLExvZ2luU2VydmljZSxIb21lUGFnZVNlcnZpY2UsQ29tcGVuc2F0aW9uU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvaW5kZXhcIjtcclxuaW1wb3J0IHsgQXBwRXhlY3V0aW9udGltZSB9IGZyb20gXCIuLi8uLi9hcHAuZXhlY3V0aW9udGltZVwiO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vLi4vYXBwLmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IE9yZGVyLCBDaXR5Q29kZUNvbGxlY3Rpb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkL21vZGVsL2luZGV4XCI7XHJcbmltcG9ydCB7IEh0dHAsIEhlYWRlcnMsIFJlcXVlc3RPcHRpb25zIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcbmltcG9ydCB7IENvbnZlcnRlcnMgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3V0aWxzL2luZGV4XCI7XHJcblxyXG5cclxuZGVjbGFyZSB2YXIgTlNIVFRQQ29va2llU3RvcmFnZSwgTlNIVFRQQ29va2llO1xyXG5jb25zb2xlLmxvZyhBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygncHJpbnRlcicsICcnKSk7XHJcbnZhciBwYXNzd29yZFRleHRGaWVsZDogdGV4dEZpZWxkLlRleHRGaWVsZFxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiBcImxvZ2luLXBhZ2VcIixcclxuICAgIHByb3ZpZGVyczogW0RhdGFTZXJ2aWNlLCBDb25maWd1cmF0aW9uLExvZ2luU2VydmljZSxIb21lUGFnZVNlcnZpY2UsQ29tcGVuc2F0aW9uU2VydmljZV0sXHJcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2NvbXBvbmVudHMvbG9naW4vbG9naW4uY29tcG9uZW50Lmh0bWxcIixcclxuICAgIHN0eWxlVXJsczogW1wiLi9jb21wb25lbnRzL2xvZ2luL2xvZ2luLmNvbXBvbmVudC5jc3NcIl1cclxufSlcclxuZXhwb3J0IGNsYXNzIExvZ2luQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICAgIHB1YmxpYyBpcUtleWJvYXJkID0gSVFLZXlib2FyZE1hbmFnZXIuc2hhcmVkTWFuYWdlcigpO1xyXG4gICAgLy8gY29uc3QgaXFLZXlib2FyZCA9IElRS2V5Ym9hcmRNYW5hZ2VyLnNoYXJlZE1hbmFnZXIoKTtcclxuICAgIGlzRXJyb3I6IGJvb2xlYW47XHJcbiAgICBlcnJvck1lc3NhZ2U6IHN0cmluZztcclxuICAgIGlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgVXNlck5hbWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBQYXNzV29yZDogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBpbmRleDogYW55ID0gbnVsbDtcclxuICAgIGxvYWRlclByb2dyZXNzOiBMb2FkZXJQcm9ncmVzcztcclxuICAgIHB1YmxpYyBwcm9maWxlRGV0YWlsczogYW55W10gPSBbXTtcclxuICAgIGlkbGVTdGF0ZSA9ICdOb3Qgc3RhcnRlZC4nO1xyXG4gICAgdGltZWRPdXQgPSBmYWxzZTtcclxuICAgIE91dHB1dDogc3RyaW5nID0gXCJcIlxyXG4gICAgcHVibGljIFByb2ZpbGVBcnJheTogQWNjb250UHJvZmlsZU1vZGVsLkFjY291bnRQcm9maWxlVGVtcGxhdGUgPSBuZXcgQWNjb250UHJvZmlsZU1vZGVsLkFjY291bnRQcm9maWxlVGVtcGxhdGUoKTtcclxuICAgIHB1YmxpYyBQcm9maWxlRGV0YWlsczogYW55O1xyXG4gICAgcHVibGljIHVzZXJkZXRhaWxzOiBhbnk7XHJcbiAgICBwdWJsaWMgZ2V0RGF0ZUZvcm1hdDogYW55O1xyXG4gICAgcHVibGljIGNpdHlMaXN0OiBBcnJheTxDaXR5Q29kZUNvbGxlY3Rpb24uQ29sbGVjdGlvbkVudGl0eT4gPSBbXTtcclxuICAgIHB1YmxpYyBmaWx0ZXJDaXR5TGlzdDogQXJyYXk8Q2l0eUNvZGVDb2xsZWN0aW9uLkNvbGxlY3Rpb25FbnRpdHk+ID0gW107XHJcbiAgICBwdWJsaWMgZmlsdGVyQ2l0eUNvZGU6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuICAgIHB1YmxpYyBBZ2VudFByb2ZpbGVMaXN0OiBBcnJheTxhbnk+ID0gW107XHJcbiAgICBwdWJsaWMgaXNDb21wZW5zYXRpb25EaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzUHJldkRheVNhbGVzUmVwb3J0Tm90Q2xvc2VkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNDaGVja2luRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBpc0dhdGVEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgQFZpZXdDaGlsZCgncGFnZWNvbnRhaW5lcicpIHBhZ2VDb250OiBFbGVtZW50UmVmO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIF9jb21wc2VydmljZXM6IENvbXBlbnNhdGlvblNlcnZpY2UscHVibGljIF9ob21lcGFnZTogSG9tZVBhZ2VTZXJ2aWNlLHByaXZhdGUgX2h0dHA6IEh0dHAsIHB1YmxpYyBfbG9naW46TG9naW5TZXJ2aWNlLCBwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9ucywgcHVibGljIF90aW1lb3V0U2VydmljZTogVGltZU91dFNlcnZpY2UsIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwdWJsaWMgX2RhdGFTZXJ2aWNlOiBEYXRhU2VydmljZSwgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24scHVibGljIF9zaGFyZWQ6IENoZWNraW5PcmRlclNlcnZpY2UpIHtcclxuICAgICAgICB0aGlzLmlxS2V5Ym9hcmQuZW5hYmxlQXV0b1Rvb2xiYXIgPSB0cnVlO1xyXG4gICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCdhcGl1cmwnLCBcImh0dHA6Ly91c3Rsc3NvYW0zMTYuYWlyc2VydmljZXMuc3Zjcy5lbnRzdmNzLm5ldDo4OTgwL1wiKTtcclxuICAgICAgICB0aGlzLmlxS2V5Ym9hcmQuZ29OZXh0KCksXHJcbiAgICAgICAgICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gXCJcIjtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzID0gbmV3IExvYWRlclByb2dyZXNzKCk7XHJcbiAgICAgICAgbGV0IGNvbm5lY3Rpb25UeXBlID0gY29ubmVjdGl2aXR5LmdldENvbm5lY3Rpb25UeXBlKCk7XHJcbiAgICAgICAgc3dpdGNoIChjb25uZWN0aW9uVHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIGNvbm5lY3Rpdml0eS5jb25uZWN0aW9uVHlwZS5ub25lOlxyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJObyBpbnRlcm5ldCBjb25uZWN0aW9uIFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNvbm5lY3Rpdml0eS5jb25uZWN0aW9uVHlwZS53aWZpOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ3aWZpXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgY29ubmVjdGl2aXR5LmNvbm5lY3Rpb25UeXBlLm1vYmlsZTpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibW9iaWxlXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICB0aGlzLnBhZ2UuYWN0aW9uQmFySGlkZGVuID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnBhZ2Uuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJ34vaW1hZ2VzL2Nsb3Vkc19ib2R5LmpwZycpXCI7XHJcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRTaXplID0gXCJjb3ZlciBcIjtcclxuICAgICAgICB0aGlzLnBhZ2Uuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gXCItMTBcIjtcclxuICAgICAgICBVSUFwcGxpY2F0aW9uLnNoYXJlZEFwcGxpY2F0aW9uLnNldFN0YXR1c0JhckhpZGRlbkFuaW1hdGVkKHRydWUsIGZhbHNlKTtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmluaXRMb2FkZXIodGhpcy5wYWdlQ29udCk7XHJcbiAgICAgICAgbGV0IGRhdGUgPSB0aGlzLl9zaGFyZWQuR2V0RGF0ZUZvcm1hdCgpO1xyXG4gICAgICAgIGlmIChkYXRlICE9IFwiU2VsZWN0IERhdGUgRm9ybWF0XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5nZXREYXRlRm9ybWF0ID0gZGF0ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0RGF0ZUZvcm1hdCA9IFwiREQgTU1NIFlZWVlcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29ubmVjdGl2aXR5LnN0YXJ0TW9uaXRvcmluZygobmV3Q29ubmVjdGlvblR5cGU6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG5ld0Nvbm5lY3Rpb25UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIGNvbm5lY3Rpdml0eS5jb25uZWN0aW9uVHlwZS5ub25lOlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuY29ubmVjdGlvblR5cGUgPSBcIk5vbmVcIjtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIk5vIGludGVybmV0IGNvbm5lY3Rpb25cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIGNvbm5lY3Rpdml0eS5jb25uZWN0aW9uVHlwZS53aWZpOlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuY29ubmVjdGlvblR5cGUgPSBcIldpLUZpXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb25uZWN0aW9uIHR5cGUgY2hhbmdlZCB0byBXaUZpLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgY29ubmVjdGl2aXR5LmNvbm5lY3Rpb25UeXBlLm1vYmlsZTpcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmNvbm5lY3Rpb25UeXBlID0gXCJNb2JpbGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbm5lY3Rpb24gdHlwZSBjaGFuZ2VkIHRvIG1vYmlsZS5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2V0Qmx1ZXRvb3RoUHJpbnRlckRldGFpbHMoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZygnYXBpdXJsJywgJycpKTtcclxuICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLnBhZ2VDb250Lm5hdGl2ZUVsZW1lbnRcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG9ic2VydmVyID0gbGFiZWwub24oXCJsb2FkZWQsIHRhcCwgbG9uZ1ByZXNzLCBzd2lwZSwgbmdNb2RlbENoYW5nZVwiLCBmdW5jdGlvbiAoYXJnczogZ2VzdHVyZXMuR2VzdHVyZUV2ZW50RGF0YSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkV2ZW50OiBcIiArIGFyZ3MuZXZlbnROYW1lKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5fdGltZW91dFNlcnZpY2UudGltZXIpO1xyXG4gICAgICAgICAgICBzZWxmLl90aW1lb3V0U2VydmljZS5yZXNldFdhdGNoKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGdldFByb2ZpbGUoKTogdm9pZCB7XHJcblxyXG4gICAgLy8gICAgIHRyeSB7XHJcbiAgICAvLyAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCdHZXRBY2NvdW50UHJvZmlsZSBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBTdGFydCBEYXRlIFRpbWUgOiAnICsgc0RhdGUpO1xyXG4gICAgLy8gICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcclxuICAgIC8vICAgICAgICAgdGhpcy5wcm9maWxlRGV0YWlscy5wdXNoKHsgdXNlck5hbWU6IFwiY20ucHR5LmFnZW50XCIsIGFwaVVzZXJLZXk6IFwib3NPazdsdXBvY1FCaUVEL3VadFlQWVdrYXFsTDA2YnZtS3RTV0pvVWxQWT1cIiB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5wcm9maWxlRGV0YWlscy5wdXNoKHsgdXNlck5hbWU6IFwiY20ubGF4LmFnZW50XCIsIGFwaVVzZXJLZXk6IFwienM5YytEMzVDaFZ4dDVZNDBqVXNhUUJtc2xTZVZ2MlJrMms0VmgralNlMD1cIiB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5wcm9maWxlRGV0YWlscy5wdXNoKHsgdXNlck5hbWU6IFwiY20uY3JjLmFnZW50XCIsIGFwaVVzZXJLZXk6IFwiNzQvc05wQ2RVLzA2M2NHVjMwWWlpaFY0U25wQkdkZWUzdkYwQTAyLzhFVT1cIiB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5wcm9maWxlRGV0YWlscy5wdXNoKHsgdXNlck5hbWU6IFwiY20ubWV4LmFnZW50XCIsIGFwaVVzZXJLZXk6IFwiYjRBU2ZRK0lOUFlOVXdKaHpVdTB5a2I0cHpGU1NMUDBzbnVBNEtQNVcrOD1cIiB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5wcm9maWxlRGV0YWlscy5wdXNoKHsgdXNlck5hbWU6IFwiY20uYm9nLmFnZW50XCIsIGFwaVVzZXJLZXk6IFwiSTNHaWxicldxWXRDWlNqMjBPZmM0UTh3TzJXeW1LRGZEek1pUXM0T1dHdz1cIiB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5wcm9maWxlRGV0YWlscy5wdXNoKHsgdXNlck5hbWU6IFwiY20uZ3J1LmFnZW50XCIsIGFwaVVzZXJLZXk6IFwidCtIdU93dDQ1K01KQm1Ma09QU0xkdVlTMlgzL3lCQW1xMzk1M3hsQ1dDcz1cIiB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5wcm9maWxlRGV0YWlscy5wdXNoKHsgdXNlck5hbWU6IFwiY20uc2NsLmFnZW50XCIsIGFwaVVzZXJLZXk6IFwibGlkV0FKTE5CTC9oKzRlL0lCRFFDR1RjZTllMDlab3RtalB5VFd0ZGZEOD1cIiB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5wcm9maWxlRGV0YWlscy5wdXNoKHsgdXNlck5hbWU6IFwiY20uZXplLmFnZW50XCIsIGFwaVVzZXJLZXk6IFwiOGYyb2didnJib2JmUGlwdE1OWG5Tc1I3QzlRRzNoanhweU1ZWkdadTlpRT1cIiB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5wcm9maWxlRGV0YWlscy5wdXNoKHsgdXNlck5hbWU6IFwiY20ueXl6LmFnZW50XCIsIGFwaVVzZXJLZXk6IFwiQzBkTGFjRGRnVzh3QkJNazI2S0UxK2p4UllMbGVndzJNckdFdzFCOEdodz1cIiB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5wcm9maWxlRGV0YWlscy5wdXNoKHsgdXNlck5hbWU6IFwiY20ubXZkLmFnZW50XCIsIGFwaVVzZXJLZXk6IFwicS9CUHg0V2sxVWVCbkRLdVJORUEya01iSjFIN2RPMytCZjFYVzgvSjRmUT1cIiB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5wcm9maWxlRGV0YWlscy5wdXNoKHsgdXNlck5hbWU6IFwiY20ucHVqLmFnZW50XCIsIGFwaVVzZXJLZXk6IFwib3Y2OFY3enlTNzRTa2xEQ2RWbzZXUUV6V1dDdGJLTkhMdnc4ZkNYemIvaz1cIiB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5wcm9maWxlRGV0YWlscy5wdXNoKHsgdXNlck5hbWU6IFwiY20uc2p1LmFnZW50XCIsIGFwaVVzZXJLZXk6IFwiRHVJQlBGeGtFdkQxZWMya0xnVzUwVnlQZWE5Z2h4Q1dpODJYK1V6VnBjRT1cIiB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5wcm9maWxlRGV0YWlscy5wdXNoKHsgdXNlck5hbWU6IFwiY20ucHR5LnNyXCIsIGFwaVVzZXJLZXk6IFwieE9UZDVrNU9wVytsT2lHaS84QllKaldMVUhWRCtlbW1LTE1yU3M1UldxRT1cIiB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5wcm9maWxlRGV0YWlscy5wdXNoKHsgdXNlck5hbWU6IFwiY20ubGF4LnNyXCIsIGFwaVVzZXJLZXk6IFwiSWJGMlpOa1labU4zNTk1UGV1UUQwWHRKUUZaenpML01IdDBSdnhKVlhlUT1cIiB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5wcm9maWxlRGV0YWlscy5wdXNoKHsgdXNlck5hbWU6IFwiY20uY29yLmFnZW50MVwiLCBhcGlVc2VyS2V5OiBcIkxPZTFMaERiMDhhNk5BYVV3dThvQkJIYzJqRUZ5Sm5ycU5zd2I5eGhjZ3M9XCIgfSk7XHJcbiAgICAvLyAgICAgICAgIHRoaXMucHJvZmlsZURldGFpbHMucHVzaCh7IHVzZXJOYW1lOiBcImNtLmNvci5hZ2VudDJcIiwgYXBpVXNlcktleTogXCJEVWNSWFloWVgvL0tsMjNvaVlBSVhmQTNPRWR3UHJGV2NvK1lFUWE5eGMwPVwiIH0pO1xyXG4gICAgLy8gICAgICAgICB0aGlzLnByb2ZpbGVEZXRhaWxzLnB1c2goeyB1c2VyTmFtZTogXCJjbS5jb3Iuc3BydnNyXCIsIGFwaVVzZXJLZXk6IFwiNkdQdmp6MmtXSkw4dys3Y0JLZ2Q4Rk1YSXk2Vlk2V1RXN0JEc255Vnpaaz1cIiB9KTtcclxuICAgIC8vICAgICAgICAgdmFyIHByb2ZpbGUgPSB0aGlzLnByb2ZpbGVEZXRhaWxzLmZpbHRlcihtID0+IG0udXNlck5hbWUgPT0gdGhpcy5Vc2VyTmFtZS50cmltKCkudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAvLyAgICAgICAgIGNvbnNvbGUuZGlyKHByb2ZpbGUpO1xyXG4gICAgLy8gICAgICAgICBpZiAocHJvZmlsZSAhPSBudWxsICYmIHByb2ZpbGUubGVuZ3RoID4gMCkge1xyXG5cclxuICAgIC8vICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwiYXBpVXNlcktleVwiLCBwcm9maWxlWzBdLmFwaVVzZXJLZXkpO1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImhvbWVcIl0sIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiZmFkZVwiLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgLy8gICAgICAgICAgICAgICAgIH0sXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgcXVlcnlQYXJhbXM6XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiBwcm9maWxlLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBcIkludmFsaWQgVXNlcklEIG9yIFBhc3N3b3JkXCI7XHJcblxyXG5cclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcclxuICAgIC8vICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIGZpbmFsbHkge1xyXG4gICAgLy8gICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZygnR2V0QWNjb3VudFByb2ZpbGUgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlRGF0ZSk7XHJcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCdHZXRBY2NvdW50UHJvZmlsZSBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFByb2ZpbGUoc2FsZXNPZmZpY2U6IHN0cmluZyA9IFwiXCIsIGN1cnJlbmN5OiBzdHJpbmcgPSBcIlwiKTogdm9pZCB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldEFjY291bnRQcm9maWxlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9ob21lcGFnZS5HZXRBY2NvdW50UHJvZmlsZShzYWxlc09mZmljZSwgY3VycmVuY3kpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJVc2VyTmFtZVwiLCBkYXRhLlVzZXJuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlByaXZpbGFnZTpcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ2hlY2tpbkRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0dhdGVEaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDb21wZW5zYXRpb25EaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRBZ2VudFByaXZpbGFnZShkYXRhLlByaXZpbGVnZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuUHJpdmlsZWdlcy5mb3JFYWNoKChwcml2aWxhZ2UsIEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcml2aWxhZ2UuTmFtZSA9PSBcIklzc3VlTG93ZXJDb21wZW5zYXRpb25BaXJwb3J0XCIgfHwgcHJpdmlsYWdlLk5hbWUgPT0gXCJJc3N1ZUhpZ2hlckNvbXBlbnNhdGlvbkFpcnBvcnRcIiB8fCBwcml2aWxhZ2UuTmFtZSA9PSBcIklzc3VlTG93ZXJDb21wZW5zYXRpb25DdXN0b21lckNhcmVcIiB8fCBwcml2aWxhZ2UuTmFtZSA9PSBcIklzc3VlTWVkaXVtQ29tcGVuc2F0aW9uQ3VzdG9tZXJDYXJlXCIgfHwgcHJpdmlsYWdlLk5hbWUgPT0gXCJJc3N1ZUhpZ2hlckNvbXBlbnNhdGlvbkN1c3RvbWVyQ2FyZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImluc2lkZSBwcml2aWxhZ2VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ29tcGVuc2F0aW9uRGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcml2aWxhZ2UuTmFtZSA9PSBcIkFjY2Vzc0NoZWNraW5Xb3JrZmxvd1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ2hlY2tpbkRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBpZiAocHJpdmlsYWdlLk5hbWUgPT0gXCJBY2Nlc3NHYXRlV29ya2Zsb3dcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0dhdGVEaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwiY2FycmllckNvZGVcIiwgZGF0YS5DYXJyaWVyQ29kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiY2hlY2tpbkRpc2FibGVkXCIsIHRoaXMuaXNDaGVja2luRGlzYWJsZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0Qm9vbGVhbihcImdhdGVEaXNhYmxlZFwiLCB0aGlzLmlzR2F0ZURpc2FibGVkKTtcclxuICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldEJvb2xlYW4oXCJjb21wZW5zYXRpb25FbmFibGVkXCIsIHRoaXMuaXNDb21wZW5zYXRpb25EaXNhYmxlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5Qcm9maWxlRGV0YWlscyA9IDxPcmRlci5Sb290T2JqZWN0PmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Qcm9maWxlQXJyYXkgPSBuZXcgQWNjb250UHJvZmlsZU1vZGVsLkFjY291bnRQcm9maWxlVGVtcGxhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlByb2ZpbGVBcnJheSA9IENvbnZlcnRlcnMuQ29udmVydFRvQWNjb3VudFByb2ZpbGVUZW1wbGF0ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnVzZXJkZXRhaWxzID0gdGhpcy5Qcm9maWxlQXJyYXkuUG9pbnRPZlNhbGVzWzBdLkFpcnBvcnRDb2RlICsgXCIgfCBcIiArIG1vbWVudCgpLmZvcm1hdCh0aGlzLmdldERhdGVGb3JtYXQpICsgXCIgfCBcIiArIHRoaXMuUHJvZmlsZUFycmF5LlVzZXJuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkZWZhdWx0UE9TID0gdGhpcy5Qcm9maWxlQXJyYXkuUG9pbnRPZlNhbGVzLmZpbHRlcihtID0+IG0uQWdlbnRDb2RlID09PSB0aGlzLlByb2ZpbGVBcnJheS5SZXF1ZXN0b3JfSUQgJiYgbS5BaXJwb3J0Q29kZSA9PT0gdGhpcy5Qcm9maWxlQXJyYXkuUGh5c2ljYWxMb2NhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZmF1bHRQT1MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJkZXRhaWxzID0gZGVmYXVsdFBPU1swXS5BaXJwb3J0Q29kZSArIFwiIHwgXCIgKyBtb21lbnQoKS5mb3JtYXQodGhpcy5nZXREYXRlRm9ybWF0KSArIFwiIHwgXCIgKyB0aGlzLlByb2ZpbGVBcnJheS5Vc2VybmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFVzZXJQb2ludG9mU2FsZShkZWZhdWx0UE9TWzBdLklEKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJkZXRhaWxzID0gdGhpcy5Qcm9maWxlQXJyYXkuUG9pbnRPZlNhbGVzWzBdLkFpcnBvcnRDb2RlICsgXCIgfCBcIiArIG1vbWVudCgpLmZvcm1hdCh0aGlzLmdldERhdGVGb3JtYXQpICsgXCIgfCBcIiArIHRoaXMuUHJvZmlsZUFycmF5LlVzZXJuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0VXNlclBvaW50b2ZTYWxlKHRoaXMuUHJvZmlsZUFycmF5LlBvaW50T2ZTYWxlc1swXS5JRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwidXNlcmRldGFpbHNcIiwgdGhpcy51c2VyZGV0YWlscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFVzZXJQcm9maWxlKHRoaXMuUHJvZmlsZUFycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0Q3VycmVuY3kodGhpcy5Qcm9maWxlQXJyYXkuSVNPQ3VycmVuY3lDb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkFnZW50UHJvZmlsZUxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlByb2ZpbGVBcnJheS5Qb2ludE9mU2FsZXMuZm9yRWFjaCgoYWdlbnREYXRhLCBhZ2VudEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZ2VudExpc3QgPSBhZ2VudERhdGEuQWlycG9ydENvZGUgKyBcIiAgXCIgKyBhZ2VudERhdGEuTmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkFnZW50UHJvZmlsZUxpc3QucHVzaChhZ2VudExpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldEFnZW50UHJvZmlsZUxpc3QodGhpcy5Qcm9maWxlQXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q2l0eSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ291bGRudCBmaW5kIGluZm9ybWF0aW9uIGZvciB0aGlzIFByb2ZpbGUgXCIgKyBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldEFjY291bnRQcm9maWxlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0QWNjb3VudFByb2ZpbGUgU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlRGF0ZSkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2l0eSgpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcclxuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRDaXR5VHlwZSBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBTdGFydCBEYXRlIFRpbWUgOiAnICsgc0RhdGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9ob21lcGFnZS5nZXRDaXR5U2VydmljZSgpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBDb21wYW5zYXRpb25EZXRhaWxzOiBhbnkgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKENvbXBhbnNhdGlvbkRldGFpbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2l0eUxpc3QgPSBkYXRhLkNvbGxlY3Rpb247XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRDaXR5TGlzdCh0aGlzLmNpdHlMaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRpcih0aGlzLmNpdHlMaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXRUaW1lb3V0KCgpID0+LCA1MDAwKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFNhbGVzUmVwb3J0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKClcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IEdldENpdHlUeXBlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IEdldENpdHlUeXBlIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0U2FsZXNSZXBvcnQoKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY29tcHNlcnZpY2VzLmdldFNhbGVPZmZpY2VSZXBvcnQoKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTYWxlcyByZXBvcnQ6XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICAgICAgICAgIGlmIChkYXRhLkhhc09wZW5QYXN0RHVlU2FsZXNSZXBvcnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzUHJldkRheVNhbGVzUmVwb3J0Tm90Q2xvc2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNDb21wZW5zYXRpb25EaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkNsb3NlIHByZXZpb3VzIGRheSBTYWxlcyBSZXBvcnRpbmcgdG8gcHJvY2VlZC5cIikuc2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICB0aGlzLm5hdmlnYXRldG9ob21lKCk7XHJcbiAgICAgICAgfSwgZXJyID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZG50IGZpbmQgaW5mb3JtYXRpb25cIiArIGVycik7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9IFxyXG4gICAgZ2V0Qmx1ZXRvb3RoUHJpbnRlckRldGFpbHMoKSB7XHJcbiAgICAgICAgbGV0IGRpc2NvdmVyeSA9IG5ldyB6ZWJyYS5EaXNjb3ZlcnkoKTtcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgZGlzY292ZXJ5LnNlYXJjaEJsdWV0b290aCgpLnRoZW4oZnVuY3Rpb24gKHByaW50ZXJzKSB7XHJcbiAgICAgICAgICAgIHZhciBjb3VudCA9IHByaW50ZXJzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb3VudCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtZXNzYWdlXCIsIFwiVW5hYmxlIHRvIGZpbmRcIik7XHJcbiAgICAgICAgICAgICAgICAvLyBUb2FzdC5tYWtlVGV4dChcIk5vIERldmljZSBmb3VuZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY291bnQgPj0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gV2UgZm91bmQgYSB2YWxpZCBwcmludGVyXHJcbiAgICAgICAgICAgICAgICB2YXIgYWN0aW9uczogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kaXIocHJpbnRlcnMpO1xyXG4gICAgICAgICAgICAgICAgcHJpbnRlcnMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnB1c2goZWxlbWVudC5hZGRyZXNzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3ByaW50ZXInLCBhY3Rpb25zWzBdKTtcclxuICAgICAgICAgICAgICAgIC8vIGxldCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHRpdGxlOiBcIkJsdWV0b290aCBQcmludGVyXCIsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgbWVzc2FnZTogXCJTZWxlY3QgUHJpbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIGNhbmNlbEJ1dHRvblRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgYWN0aW9uczogYWN0aW9uc1xyXG4gICAgICAgICAgICAgICAgLy8gfTtcclxuICAgICAgICAgICAgICAgIC8vIGRpYWxvZ3MuYWN0aW9uKG9wdGlvbnMpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ3ByaW50ZXInLCByZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIHNlbGYuYmx0UHJpbnRlciA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIC8vIH0sIChlcnIpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgbG9naW5TdWJtaXQoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLlVzZXJOYW1lICE9IFwiXCIgJiYgdGhpcy5QYXNzV29yZCAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRlVXNlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgLy8gdGhpcy5lcnJvck1lc3NhZ2UgPSBcIkludmFsaWQgVXNlck5hbWUvUGFzc3dvcmRcIjtcclxuICAgICAgICAgICAgaWYgKHRoaXMuUGFzc1dvcmQgPT0gXCJcIiAmJiB0aGlzLlVzZXJOYW1lICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gXCJQbGVhc2UgZW50ZXIgYSBQYXNzd29yZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuVXNlck5hbWUgPT0gXCJcIiAmJiB0aGlzLlBhc3NXb3JkICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gXCJQbGVhc2UgZW50ZXIgYSBVc2VyTmFtZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBcIlBsZWFzZSBlbnRlciBhIFVzZXJOYW1lIGFuZCBQYXNzd29yZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhdXRoZW50aWNhdGVVc2VyKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU3RhcnQgTG9naW5cIik7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XHJcbiAgICAgICAgLy8gICAgbGV0IHJlcXVlc3REYXRhID0gXHJcbiAgICAgICAgLy8gICAgIFwiVVNFUj1cIiArIHRoaXMuVXNlck5hbWUudG9TdHJpbmcoKStcclxuICAgICAgICAvLyAgICAgXCImUEFTU1dPUkQ9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy5QYXNzV29yZC50b1N0cmluZygpKStcclxuICAgICAgICAvLyAgICAgXCImVEFSR0VUPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KFwiaHR0cDovL3Bzc2d1aWNtbS5haXJzZXJ2aWNlcy5zdmNzLmVudHN2Y3MubmV0Ojg5ODAvYXBpL2FjY291bnQvcHJvZmlsZVwiKSArXHJcbiAgICAgICAgLy8gICAgIFwiJkxPQ0FUSU9OPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KFwiL2Nzc1wiKSA7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVxdWVzdERhdGEpKTtcclxuICAgICAgICB0aGlzLl9sb2dpbi5sb2dpbih0aGlzLlVzZXJOYW1lLCB0aGlzLlBhc3NXb3JkKS5zdWJzY3JpYmUoKHJlcykgPT4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gcmVzO1xyXG4gICAgICAgICAgICBjb25zb2xlLmRpcihyZXN1bHQpO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9naW4uU3RhdHVwVGFibGUoKS5zdWJzY3JpYmUoKHJlc3VsdCk9PntcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0U3RhcnR1cFRhYmxlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5uYXZpZ2F0ZXRvaG9tZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRQcm9maWxlKCk7XHJcbiAgICAgICAgICAgXHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgdGhpcy5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIC8vICB0aGlzLmVycm9yTWVzc2FnZSA9IFwiSW52YWxpZCBVc2VybmFtZS9QYXNzd29yZFwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIGVycm9yTWVzc2FnZSA9IGVyci50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGlmIChlcnJvck1lc3NhZ2UuaW5kZXhPZihcIlVucmVjb2duaXplZCB0b2tlbiAnPCdcIikgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuaXNFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBcIkludmFsaWQgVXNlcm5hbWUvUGFzc3dvcmRcIjtcclxuICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIFRvYXN0Lm1ha2VUZXh0KFwiVW5hYmxlIHRvIGNvbm5lY3QgdG8gdGhlIHNlcnZlclwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgfVxyXG4gICAgLy8gU2l0ZW1pbmRlciBDb2RlIGVuZHNcclxuXHJcbiAgICBpc0Nvb2tpZVNldCgpIHtcclxuICAgICAgICBjb25zdCBjb29raWVzOiBhbnkgPSBOU0hUVFBDb29raWVTdG9yYWdlLnNoYXJlZEhUVFBDb29raWVTdG9yYWdlLmNvb2tpZXM7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb29raWVzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aGlzLk91dHB1dCA9IFwiTm8gQ29va2llKHMpIEF2YWlsYWJsZVwiO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb2tpZXMuY291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29va2llOiBhbnkgPSBjb29raWVzLm9iamVjdEF0SW5kZXgoaSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29va2llLm5hbWUgPT0gXCJTTVNFU1NJT05cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuT3V0cHV0ID0gY29va2llLm5hbWUgKyBcIjpcXG5cIiArIGNvb2tpZS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvb2tpZSBWYWx1ZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcImNvb2tpZXZhbHVlXCIsXCJjb29raWUudmFsdWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY29va2llLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuT3V0cHV0ID0gXCJObyBDb29raWUocykgQXZhaWxhYmxlXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvbkNoYW5nZShhcmdzOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5Vc2VyTmFtZSA9PSBcIlwiICYmIHRoaXMuUGFzc1dvcmQgPT0gXCJcIikge1xyXG4gICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgbmF2aWdhdGV0b2hvbWUoKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImhvbWVcIl0sIHtcclxuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXNlck5hbWVSZXR1cm5QcmVzcyhhcmdzOiBhbnkpIHtcclxuICAgICAgICBwYXNzd29yZFRleHRGaWVsZCA9IHRoaXMucGFnZS5nZXRWaWV3QnlJZDx0ZXh0RmllbGQuVGV4dEZpZWxkPihcInBhc3N3b3JkXCIpO1xyXG4gICAgICAgIHBhc3N3b3JkVGV4dEZpZWxkLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlU2VydmljZUVycm9yKGVycm9yOiBhbnkpIHtcclxuICAgICAgICB2YXIgZXJyb3JNZXNzYWdlID0gZXJyb3IudG9TdHJpbmcoKTtcclxuICAgICAgICBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJTZXNzaW9uVGltZW91dFwiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiSW52YWxpZCBVc2VybmFtZSBvciBQYXNzd29yZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChlcnJvck1lc3NhZ2UpLnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59Il19