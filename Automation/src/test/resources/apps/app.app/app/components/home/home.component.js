"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var router_2 = require("nativescript-angular/router");
var page_1 = require("ui/page");
var dialogs = require("ui/dialogs");
//external modules and plugins
var ApplicationSettings = require("application-settings");
var moment = require("moment");
var Toast = require("nativescript-toast");
//app references
var index_1 = require("../../shared/services/index");
var index_2 = require("../../shared/interface/index");
var index_3 = require("../../shared/utils/index");
var app_executiontime_1 = require("../../app.executiontime");
var app_constants_1 = require("../../app.constants");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(_homepage, page, _service, routerExtensions, _dataService, _timeoutService, activatedRouter, router, location, _shared, _compservices) {
        this._homepage = _homepage;
        this.page = page;
        this._service = _service;
        this.routerExtensions = routerExtensions;
        this._dataService = _dataService;
        this._timeoutService = _timeoutService;
        this.activatedRouter = activatedRouter;
        this.router = router;
        this.location = location;
        this._shared = _shared;
        this._compservices = _compservices;
        this.ProfileArray = new index_2.AccontProfileModel.AccountProfileTemplate();
        this.searchString = "";
        this.index = null;
        this.cityList = [];
        this.filterCityList = [];
        this.filterCityCode = [];
        this.AgentProfileList = [];
        this.isCompensationDisabled = false;
        this.isPrevDaySalesReportNotClosed = false;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.isError = false;
        this.errorMessage = "";
        this.loaderProgress = new index_2.LoaderProgress();
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover";
        this.loaderProgress.initLoader(this.pageCont);
        UIApplication.sharedApplication.setStatusBarHiddenAnimated(false, false);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this._shared.SetBagTag(null);
        // this.getCity();
        var date = this._shared.GetDateFormat();
        if (date != "Select Date Format") {
            this.getDateFormat = date;
        }
        else {
            this.getDateFormat = "DD MMM YYYY";
        }
        this._timeoutService.startWatch();
        var label = this.pageCont.nativeElement;
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe", function (args) {
            self._timeoutService.resetWatch();
        });
        this.loaderProgress.hideLoader();
        this.isCompensationDisabled = ApplicationSettings.getBoolean("compensationEnabled", false);
        ;
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled", false);
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled", false);
        this.ProfileArray = this._shared.GetAgentProfileList();
        this.ProfileArray.PointOfSales.forEach(function (agentData, agentIndex) {
            var agentList = agentData.AirportCode + "  " + agentData.Name;
            _this.AgentProfileList.push(agentList);
        });
        // this.getProfile();
        // this.getPrinterDetails();
    };
    HomeComponent.prototype.getSalesReport = function () {
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
        }, function (err) {
            console.log("Couldnt find information" + err);
            _this.handleServiceError(err);
            _this.loaderProgress.hideLoader();
        });
    };
    HomeComponent.prototype.getCity = function () {
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
            }, function (error) {
                _this.handleServiceError(error);
                console.log(error);
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
    /**
     * get profile information of the logged in user
     **/
    HomeComponent.prototype.getProfile = function (salesOffice, currency) {
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
                _this.ProfileArray = new index_2.AccontProfileModel.AccountProfileTemplate();
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
                _this.getCity();
            }, function (error) {
                _this.handleServiceError(error);
                console.log(error);
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
    HomeComponent.prototype.changeAgentLocation = function () {
        var _this = this;
        var options = {
            title: "Change Sales Office",
            message: "Select Sales Office",
            cancelButtonText: "Cancel",
            actions: this.AgentProfileList
        };
        dialogs.action(options).then(function (result) {
            if (result != "Cancel") {
                var SelectedAgent = result;
                var airportCode_1 = result.substr(0, 3);
                var posName_1 = result.substr(5);
                var posId = _this.ProfileArray.PointOfSales.filter(function (m) { return m.AirportCode === airportCode_1 && m.Name === posName_1; });
                // this.ProfileArray.PointOfSales[0].AirportCode = result.substr(0, 3);
                // console.log(result.substr(5));
                // let Id = this.ProfileArray.PointOfSales.filter(m => m.Name == result.substr(5))[0].ID;
                // this._shared.SetUserPointofSale(posId);
                // this.userdetails = this.ProfileArray.PointOfSales[0].AirportCode + " | " + moment().format("DD MMM YYYY") + " | " + this.ProfileArray.Username;
                // ApplicationSettings.setString("userdetails", this.userdetails);
                if (posId.length > 0)
                    _this.changeAgentCurrency(posId[0].ID);
                else
                    Toast.makeText('Invalid Point Of Sales.');
            }
        });
    };
    HomeComponent.prototype.changeAgentCurrency = function (posID) {
        var _this = this;
        var currency = this.ProfileArray.PointOfSales.filter(function (m) { return m.ID == posID; })[0].currencies;
        var options = {
            title: "Change Currencies",
            message: "Select Currency",
            cancelButtonText: "Cancel",
            actions: currency
        };
        dialogs.action(options).then(function (result) {
            if (result != "Cancel") {
                var SelectedAgent = result;
                console.log(result);
                _this._shared.SetCurrency(result);
                _this.getProfile(posID, result);
            }
        });
    };
    HomeComponent.prototype.navigateToSearch = function () {
        if (this.isCheckinDisabled == true) {
            var profile = JSON.stringify(this.ProfileArray);
            this.routerExtensions.navigate(["search"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                }
            });
        }
    };
    HomeComponent.prototype.navigateToDepartures = function () {
        if (this.isGateDisabled == true) {
            this.routerExtensions.navigate(["departhome"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                }
            });
        }
    };
    HomeComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    HomeComponent.prototype.navigateToCompensation = function () {
        if (this.isCompensationDisabled == true) {
            this.routerExtensions.navigate(["compensation"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                }
            });
        }
        else {
            Toast.makeText("Compensation Not applicable").show();
        }
    };
    HomeComponent.prototype.handleServiceError = function (error) {
        var _this = this;
        var errorMessage = error.toString();
        if (errorMessage.indexOf("SessionTimeout") > -1) {
            var options = {
                title: "Session Time Out",
                message: "Your session has been time out",
                okButtonText: "OK"
            };
            dialogs.alert(options).then(function () {
                _this.routerExtensions.navigate([""], {
                    animated: true,
                    transition: {
                        name: "slide",
                        duration: 600,
                        curve: "linear"
                    }
                });
            });
            // this.loaderProgress.hideLoader();
        }
        else {
            Toast.makeText(errorMessage).show();
        }
    };
    __decorate([
        core_1.ViewChild('pagecontainer'),
        __metadata("design:type", core_1.ElementRef)
    ], HomeComponent.prototype, "pageCont", void 0);
    HomeComponent = __decorate([
        core_1.Component({
            selector: "home-page",
            providers: [index_1.DataService, app_constants_1.Configuration, index_1.PassengerService, index_1.HomePageService, index_1.CompensationService],
            templateUrl: "./components/home/home.component.html",
            styleUrls: ["./components/home/home.component.css"]
        }),
        __metadata("design:paramtypes", [index_1.HomePageService,
            page_1.Page,
            index_1.PassengerService,
            router_2.RouterExtensions,
            index_1.DataService,
            index_1.TimeOutService,
            router_1.ActivatedRoute,
            router_1.Router, common_1.Location, index_1.CheckinOrderService, index_1.CompensationService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyxzQ0FBeUU7QUFDekUsMENBQTJFO0FBQzNFLDBDQUEyQztBQUMzQyxzREFBZ0U7QUFDaEUsZ0NBQStCO0FBRS9CLG9DQUF1QztBQUN2Qyw4QkFBOEI7QUFDOUIsMERBQTREO0FBQzVELCtCQUFpQztBQUdqQywwQ0FBNEM7QUFDNUMsZ0JBQWdCO0FBQ2hCLHFEQUF1SjtBQUN2SixzREFBaUY7QUFFakYsa0RBQXNEO0FBQ3RELDZEQUEyRDtBQUMzRCxxREFBb0Q7QUFTcEQ7SUFvQkksdUJBQW1CLFNBQTBCLEVBQ2pDLElBQVUsRUFDWCxRQUEwQixFQUN6QixnQkFBa0MsRUFDbkMsWUFBeUIsRUFDekIsZUFBK0IsRUFDOUIsZUFBK0IsRUFDL0IsTUFBYyxFQUFVLFFBQWtCLEVBQVMsT0FBNEIsRUFBUyxhQUFrQztRQVBuSCxjQUFTLEdBQVQsU0FBUyxDQUFpQjtRQUNqQyxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1gsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFDekIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNuQyxpQkFBWSxHQUFaLFlBQVksQ0FBYTtRQUN6QixvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFDOUIsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBQy9CLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7UUFBUyxrQkFBYSxHQUFiLGFBQWEsQ0FBcUI7UUFyQi9ILGlCQUFZLEdBQThDLElBQUksMEJBQWtCLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUcxRyxpQkFBWSxHQUFHLEVBQUUsQ0FBQztRQUNsQixVQUFLLEdBQVEsSUFBSSxDQUFDO1FBRWxCLGFBQVEsR0FBK0MsRUFBRSxD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QztTQUN2QzthQUNJO1lBQ0QsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN2QztJQUNMLENBQUM7SUF6VDJCO1FBQTNCLGdCQUFTLENBQUMsZUFBZSxDQUFDO2tDQUFXLGlCQUFVO21EQUFDO0lBRnhDLGFBQWE7UUFOekIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFNBQVMsRUFBRSxDQUFDLG1CQUFXLEVBQUUsNkJBQWEsRUFBRSx3QkFBZ0IsRUFBRSx1QkFBZSxFQUFFLDJCQUFtQixDQUFDO1lBQy9GLFdBQVcsRUFBRSx1Q0FBdUM7WUFDcEQsU0FBUyxFQUFFLENBQUMsc0NBQXNDLENBQUM7U0FDdEQsQ0FBQzt5Q0FxQmdDLHVCQUFlO1lBQzNCLFdBQUk7WUFDRCx3QkFBZ0I7WUFDUCx5QkFBZ0I7WUFDckIsbUJBQVc7WUFDUixzQkFBYztZQUNiLHVCQUFjO1lBQ3ZCLGVBQU0sRUFBb0IsaUJBQVEsRUFBa0IsMkJBQW1CLEVBQXdCLDJCQUFtQjtPQTNCN0gsYUFBYSxDQTRUekI7SUFBRCxvQkFBQztDQUFBLEFBNVRELElBNFRDO0FBNVRZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLy9hbmd1bGFyICYgbmF0aXZlc2NyaXB0IHJlZmVyZW5jZXNcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvbkV4dHJhcywgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcclxuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucywgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBHcmlkTGF5b3V0IH0gZnJvbSBcInVpL2xheW91dHMvZ3JpZC1sYXlvdXRcIjtcclxuaW1wb3J0IGRpYWxvZ3MgPSByZXF1aXJlKFwidWkvZGlhbG9nc1wiKTtcclxuLy9leHRlcm5hbCBtb2R1bGVzIGFuZCBwbHVnaW5zXHJcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tIFwibW9tZW50XCI7XHJcbmltcG9ydCAqIGFzIGdlc3R1cmVzIGZyb20gXCJ1aS9nZXN0dXJlc1wiO1xyXG5pbXBvcnQgKiBhcyBMYWJlbE1vZHVsZSBmcm9tIFwidWkvbGFiZWxcIjtcclxuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcclxuLy9hcHAgcmVmZXJlbmNlc1xyXG5pbXBvcnQgeyBEYXRhU2VydmljZSwgQ2hlY2tpbk9yZGVyU2VydmljZSwgUGFzc2VuZ2VyU2VydmljZSwgVGltZU91dFNlcnZpY2UsIENvbXBlbnNhdGlvblNlcnZpY2UsIEhvbWVQYWdlU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvaW5kZXhcIjtcclxuaW1wb3J0IHsgTG9hZGVyUHJvZ3Jlc3MsIEFjY29udFByb2ZpbGVNb2RlbCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvaW50ZXJmYWNlL2luZGV4XCJcclxuaW1wb3J0IHsgT3JkZXIsIENpdHlDb2RlQ29sbGVjdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbW9kZWwvaW5kZXhcIjtcclxuaW1wb3J0IHsgQ29udmVydGVycyB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IHsgQXBwRXhlY3V0aW9udGltZSB9IGZyb20gXCIuLi8uLi9hcHAuZXhlY3V0aW9udGltZVwiO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vLi4vYXBwLmNvbnN0YW50cyc7XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogXCJob21lLXBhZ2VcIixcclxuICAgIHByb3ZpZGVyczogW0RhdGFTZXJ2aWNlLCBDb25maWd1cmF0aW9uLCBQYXNzZW5nZXJTZXJ2aWNlLCBIb21lUGFnZVNlcnZpY2UsIENvbXBlbnNhdGlvblNlcnZpY2VdLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9jb21wb25lbnRzL2hvbWUvaG9tZS5jb21wb25lbnQuaHRtbFwiLFxyXG4gICAgc3R5bGVVcmxzOiBbXCIuL2NvbXBvbmVudHMvaG9tZS9ob21lLmNvbXBvbmVudC5jc3NcIl1cclxufSlcclxuZXhwb3J0IGNsYXNzIEhvbWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICAgIEBWaWV3Q2hpbGQoJ3BhZ2Vjb250YWluZXInKSBwYWdlQ29udDogRWxlbWVudFJlZjtcclxuICAgIHB1YmxpYyBpc0Vycm9yOiBib29sZWFuO1xyXG4gICAgcHVibGljIGVycm9yTWVzc2FnZTogc3RyaW5nO1xyXG4gICAgcHVibGljIGxvYWRlclByb2dyZXNzOiBMb2FkZXJQcm9ncmVzcztcclxuICAgIHB1YmxpYyBQcm9maWxlQXJyYXk6IEFjY29udFByb2ZpbGVNb2RlbC5BY2NvdW50UHJvZmlsZVRlbXBsYXRlID0gbmV3IEFjY29udFByb2ZpbGVNb2RlbC5BY2NvdW50UHJvZmlsZVRlbXBsYXRlKCk7XHJcbiAgICBwdWJsaWMgUHJvZmlsZURldGFpbHM6IGFueTtcclxuICAgIHB1YmxpYyB1c2VyZGV0YWlsczogYW55O1xyXG4gICAgcHVibGljIHNlYXJjaFN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgaW5kZXg6IGFueSA9IG51bGw7XHJcbiAgICBwdWJsaWMgZ2V0RGF0ZUZvcm1hdDogYW55O1xyXG4gICAgcHVibGljIGNpdHlMaXN0OiBBcnJheTxDaXR5Q29kZUNvbGxlY3Rpb24uQ29sbGVjdGlvbkVudGl0eT4gPSBbXTtcclxuICAgIHB1YmxpYyBmaWx0ZXJDaXR5TGlzdDogQXJyYXk8Q2l0eUNvZGVDb2xsZWN0aW9uLkNvbGxlY3Rpb25FbnRpdHk+ID0gW107XHJcbiAgICBwdWJsaWMgZmlsdGVyQ2l0eUNvZGU6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuICAgIHB1YmxpYyBBZ2VudFByb2ZpbGVMaXN0OiBBcnJheTxhbnk+ID0gW107XHJcbiAgICBwdWJsaWMgaXNDb21wZW5zYXRpb25EaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzUHJldkRheVNhbGVzUmVwb3J0Tm90Q2xvc2VkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNDaGVja2luRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBpc0dhdGVEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIF9ob21lcGFnZTogSG9tZVBhZ2VTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgcGFnZTogUGFnZSxcclxuICAgICAgICBwdWJsaWMgX3NlcnZpY2U6IFBhc3NlbmdlclNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXJFeHRlbnNpb25zOiBSb3V0ZXJFeHRlbnNpb25zLFxyXG4gICAgICAgIHB1YmxpYyBfZGF0YVNlcnZpY2U6IERhdGFTZXJ2aWNlLFxyXG4gICAgICAgIHB1YmxpYyBfdGltZW91dFNlcnZpY2U6IFRpbWVPdXRTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgYWN0aXZhdGVkUm91dGVyOiBBY3RpdmF0ZWRSb3V0ZSxcclxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIGxvY2F0aW9uOiBMb2NhdGlvbiwgcHVibGljIF9zaGFyZWQ6IENoZWNraW5PcmRlclNlcnZpY2UsIHB1YmxpYyBfY29tcHNlcnZpY2VzOiBDb21wZW5zYXRpb25TZXJ2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MgPSBuZXcgTG9hZGVyUHJvZ3Jlc3MoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCd+L2ltYWdlcy9sb2dpbl9iYWNrLmpwZWcnKVwiO1xyXG4gICAgICAgIHRoaXMucGFnZS5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9IFwiY292ZXJcIjtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmluaXRMb2FkZXIodGhpcy5wYWdlQ29udCk7XHJcbiAgICAgICAgVUlBcHBsaWNhdGlvbi5zaGFyZWRBcHBsaWNhdGlvbi5zZXRTdGF0dXNCYXJIaWRkZW5BbmltYXRlZChmYWxzZSwgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMudXNlcmRldGFpbHMgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcInVzZXJkZXRhaWxzXCIsIFwiXCIpO1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZC5TZXRCYWdUYWcobnVsbCk7XHJcbiAgICAgICAgLy8gdGhpcy5nZXRDaXR5KCk7XHJcbiAgICAgICAgbGV0IGRhdGUgPSB0aGlzLl9zaGFyZWQuR2V0RGF0ZUZvcm1hdCgpO1xyXG4gICAgICAgIGlmIChkYXRlICE9IFwiU2VsZWN0IERhdGUgRm9ybWF0XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5nZXREYXRlRm9ybWF0ID0gZGF0ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0RGF0ZUZvcm1hdCA9IFwiREQgTU1NIFlZWVlcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fdGltZW91dFNlcnZpY2Uuc3RhcnRXYXRjaCgpO1xyXG5cclxuICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLnBhZ2VDb250Lm5hdGl2ZUVsZW1lbnRcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG9ic2VydmVyID0gbGFiZWwub24oXCJsb2FkZWQsIHRhcCwgbG9uZ1ByZXNzLCBzd2lwZVwiLCBmdW5jdGlvbiAoYXJnczogZ2VzdHVyZXMuR2VzdHVyZUV2ZW50RGF0YSkge1xyXG4gICAgICAgICAgICBzZWxmLl90aW1lb3V0U2VydmljZS5yZXNldFdhdGNoKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgdGhpcy5pc0NvbXBlbnNhdGlvbkRpc2FibGVkID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiY29tcGVuc2F0aW9uRW5hYmxlZFwiLGZhbHNlKTs7XHJcbiAgICAgICAgdGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNoZWNraW5EaXNhYmxlZFwiLGZhbHNlKTtcclxuICAgICAgICB0aGlzLmlzR2F0ZURpc2FibGVkID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiZ2F0ZURpc2FibGVkXCIsIGZhbHNlKTtcclxuICAgICAgICB0aGlzLlByb2ZpbGVBcnJheSA9dGhpcy5fc2hhcmVkLkdldEFnZW50UHJvZmlsZUxpc3QoKTtcclxuICAgICAgICB0aGlzLlByb2ZpbGVBcnJheS5Qb2ludE9mU2FsZXMuZm9yRWFjaCgoYWdlbnREYXRhLCBhZ2VudEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBhZ2VudExpc3QgPSBhZ2VudERhdGEuQWlycG9ydENvZGUgKyBcIiAgXCIgKyBhZ2VudERhdGEuTmFtZVxyXG4gICAgICAgICAgICB0aGlzLkFnZW50UHJvZmlsZUxpc3QucHVzaChhZ2VudExpc3QpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLy8gdGhpcy5nZXRQcm9maWxlKCk7XHJcbiAgICAgICAgLy8gdGhpcy5nZXRQcmludGVyRGV0YWlscygpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNhbGVzUmVwb3J0KCkge1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgIHRoaXMuX2NvbXBzZXJ2aWNlcy5nZXRTYWxlT2ZmaWNlUmVwb3J0KCkuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2FsZXMgcmVwb3J0OlwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5IYXNPcGVuUGFzdER1ZVNhbGVzUmVwb3J0cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc1ByZXZEYXlTYWxlc1JlcG9ydE5vdENsb3NlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzQ29tcGVuc2F0aW9uRGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJDbG9zZSBwcmV2aW91cyBkYXkgU2FsZXMgUmVwb3J0aW5nIHRvIHByb2NlZWQuXCIpLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuXHJcbiAgICAgICAgfSwgZXJyID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZG50IGZpbmQgaW5mb3JtYXRpb25cIiArIGVycik7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBnZXRDaXR5KCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IEdldENpdHlUeXBlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hvbWVwYWdlLmdldENpdHlTZXJ2aWNlKClcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5kaXIoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IENvbXBhbnNhdGlvbkRldGFpbHM6IGFueSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coQ29tcGFuc2F0aW9uRGV0YWlscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaXR5TGlzdCA9IGRhdGEuQ29sbGVjdGlvbjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLnNldENpdHlMaXN0KHRoaXMuY2l0eUxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKHRoaXMuY2l0eUxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNldFRpbWVvdXQoKCkgPT4sIDUwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2FsZXNSZXBvcnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKVxyXG5cclxuICAgICAgICAgICAgICAgIH0sIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IEdldENpdHlUeXBlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IEdldENpdHlUeXBlIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZ2V0IHByb2ZpbGUgaW5mb3JtYXRpb24gb2YgdGhlIGxvZ2dlZCBpbiB1c2VyXHJcbiAgICAgKiovXHJcbiAgICBwcml2YXRlIGdldFByb2ZpbGUoc2FsZXNPZmZpY2U6IHN0cmluZyA9IFwiXCIsIGN1cnJlbmN5OiBzdHJpbmcgPSBcIlwiKTogdm9pZCB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldEFjY291bnRQcm9maWxlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9ob21lcGFnZS5HZXRBY2NvdW50UHJvZmlsZShzYWxlc09mZmljZSwgY3VycmVuY3kpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJVc2VyTmFtZVwiLCBkYXRhLlVzZXJuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlByaXZpbGFnZTpcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ2hlY2tpbkRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0dhdGVEaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDb21wZW5zYXRpb25EaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRBZ2VudFByaXZpbGFnZShkYXRhLlByaXZpbGVnZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuUHJpdmlsZWdlcy5mb3JFYWNoKChwcml2aWxhZ2UsIEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcml2aWxhZ2UuTmFtZSA9PSBcIklzc3VlTG93ZXJDb21wZW5zYXRpb25BaXJwb3J0XCIgfHwgcHJpdmlsYWdlLk5hbWUgPT0gXCJJc3N1ZUhpZ2hlckNvbXBlbnNhdGlvbkFpcnBvcnRcIiB8fCBwcml2aWxhZ2UuTmFtZSA9PSBcIklzc3VlTG93ZXJDb21wZW5zYXRpb25DdXN0b21lckNhcmVcIiB8fCBwcml2aWxhZ2UuTmFtZSA9PSBcIklzc3VlTWVkaXVtQ29tcGVuc2F0aW9uQ3VzdG9tZXJDYXJlXCIgfHwgcHJpdmlsYWdlLk5hbWUgPT0gXCJJc3N1ZUhpZ2hlckNvbXBlbnNhdGlvbkN1c3RvbWVyQ2FyZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImluc2lkZSBwcml2aWxhZ2VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ29tcGVuc2F0aW9uRGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcml2aWxhZ2UuTmFtZSA9PSBcIkFjY2Vzc0NoZWNraW5Xb3JrZmxvd1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ2hlY2tpbkRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBpZiAocHJpdmlsYWdlLk5hbWUgPT0gXCJBY2Nlc3NHYXRlV29ya2Zsb3dcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0dhdGVEaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwiY2FycmllckNvZGVcIiwgZGF0YS5DYXJyaWVyQ29kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiY2hlY2tpbkRpc2FibGVkXCIsIHRoaXMuaXNDaGVja2luRGlzYWJsZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0Qm9vbGVhbihcImdhdGVEaXNhYmxlZFwiLCB0aGlzLmlzR2F0ZURpc2FibGVkKTtcclxuICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldEJvb2xlYW4oXCJjb21wZW5zYXRpb25FbmFibGVkXCIsIHRoaXMuaXNDb21wZW5zYXRpb25EaXNhYmxlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5Qcm9maWxlRGV0YWlscyA9IDxPcmRlci5Sb290T2JqZWN0PmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Qcm9maWxlQXJyYXkgPSBuZXcgQWNjb250UHJvZmlsZU1vZGVsLkFjY291bnRQcm9maWxlVGVtcGxhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlByb2ZpbGVBcnJheSA9IENvbnZlcnRlcnMuQ29udmVydFRvQWNjb3VudFByb2ZpbGVUZW1wbGF0ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnVzZXJkZXRhaWxzID0gdGhpcy5Qcm9maWxlQXJyYXkuUG9pbnRPZlNhbGVzWzBdLkFpcnBvcnRDb2RlICsgXCIgfCBcIiArIG1vbWVudCgpLmZvcm1hdCh0aGlzLmdldERhdGVGb3JtYXQpICsgXCIgfCBcIiArIHRoaXMuUHJvZmlsZUFycmF5LlVzZXJuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkZWZhdWx0UE9TID0gdGhpcy5Qcm9maWxlQXJyYXkuUG9pbnRPZlNhbGVzLmZpbHRlcihtID0+IG0uQWdlbnRDb2RlID09PSB0aGlzLlByb2ZpbGVBcnJheS5SZXF1ZXN0b3JfSUQgJiYgbS5BaXJwb3J0Q29kZSA9PT0gdGhpcy5Qcm9maWxlQXJyYXkuUGh5c2ljYWxMb2NhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZmF1bHRQT1MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJkZXRhaWxzID0gZGVmYXVsdFBPU1swXS5BaXJwb3J0Q29kZSArIFwiIHwgXCIgKyBtb21lbnQoKS5mb3JtYXQodGhpcy5nZXREYXRlRm9ybWF0KSArIFwiIHwgXCIgKyB0aGlzLlByb2ZpbGVBcnJheS5Vc2VybmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFVzZXJQb2ludG9mU2FsZShkZWZhdWx0UE9TWzBdLklEKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJkZXRhaWxzID0gdGhpcy5Qcm9maWxlQXJyYXkuUG9pbnRPZlNhbGVzWzBdLkFpcnBvcnRDb2RlICsgXCIgfCBcIiArIG1vbWVudCgpLmZvcm1hdCh0aGlzLmdldERhdGVGb3JtYXQpICsgXCIgfCBcIiArIHRoaXMuUHJvZmlsZUFycmF5LlVzZXJuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0VXNlclBvaW50b2ZTYWxlKHRoaXMuUHJvZmlsZUFycmF5LlBvaW50T2ZTYWxlc1swXS5JRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwidXNlcmRldGFpbHNcIiwgdGhpcy51c2VyZGV0YWlscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFVzZXJQcm9maWxlKHRoaXMuUHJvZmlsZUFycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0Q3VycmVuY3kodGhpcy5Qcm9maWxlQXJyYXkuSVNPQ3VycmVuY3lDb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkFnZW50UHJvZmlsZUxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlByb2ZpbGVBcnJheS5Qb2ludE9mU2FsZXMuZm9yRWFjaCgoYWdlbnREYXRhLCBhZ2VudEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZ2VudExpc3QgPSBhZ2VudERhdGEuQWlycG9ydENvZGUgKyBcIiAgXCIgKyBhZ2VudERhdGEuTmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkFnZW50UHJvZmlsZUxpc3QucHVzaChhZ2VudExpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDaXR5KCk7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldEFjY291bnRQcm9maWxlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0QWNjb3VudFByb2ZpbGUgU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlRGF0ZSkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGNoYW5nZUFnZW50TG9jYXRpb24oKSB7XHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBcIkNoYW5nZSBTYWxlcyBPZmZpY2VcIixcclxuICAgICAgICAgICAgbWVzc2FnZTogXCJTZWxlY3QgU2FsZXMgT2ZmaWNlXCIsXHJcbiAgICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgIGFjdGlvbnM6IHRoaXMuQWdlbnRQcm9maWxlTGlzdFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT0gXCJDYW5jZWxcIikge1xyXG4gICAgICAgICAgICAgICAgdmFyIFNlbGVjdGVkQWdlbnQgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWlycG9ydENvZGUgPSByZXN1bHQuc3Vic3RyKDAsIDMpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvc05hbWUgPSByZXN1bHQuc3Vic3RyKDUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvc0lkID0gdGhpcy5Qcm9maWxlQXJyYXkuUG9pbnRPZlNhbGVzLmZpbHRlcihtID0+IG0uQWlycG9ydENvZGUgPT09IGFpcnBvcnRDb2RlICYmIG0uTmFtZSA9PT0gcG9zTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLlByb2ZpbGVBcnJheS5Qb2ludE9mU2FsZXNbMF0uQWlycG9ydENvZGUgPSByZXN1bHQuc3Vic3RyKDAsIDMpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0LnN1YnN0cig1KSk7XHJcbiAgICAgICAgICAgICAgICAvLyBsZXQgSWQgPSB0aGlzLlByb2ZpbGVBcnJheS5Qb2ludE9mU2FsZXMuZmlsdGVyKG0gPT4gbS5OYW1lID09IHJlc3VsdC5zdWJzdHIoNSkpWzBdLklEO1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fc2hhcmVkLlNldFVzZXJQb2ludG9mU2FsZShwb3NJZCk7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLnVzZXJkZXRhaWxzID0gdGhpcy5Qcm9maWxlQXJyYXkuUG9pbnRPZlNhbGVzWzBdLkFpcnBvcnRDb2RlICsgXCIgfCBcIiArIG1vbWVudCgpLmZvcm1hdChcIkREIE1NTSBZWVlZXCIpICsgXCIgfCBcIiArIHRoaXMuUHJvZmlsZUFycmF5LlVzZXJuYW1lO1xyXG4gICAgICAgICAgICAgICAgLy8gQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJ1c2VyZGV0YWlsc1wiLCB0aGlzLnVzZXJkZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgIGlmIChwb3NJZC5sZW5ndGggPiAwKSB0aGlzLmNoYW5nZUFnZW50Q3VycmVuY3kocG9zSWRbMF0uSUQpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBUb2FzdC5tYWtlVGV4dCgnSW52YWxpZCBQb2ludCBPZiBTYWxlcy4nKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlQWdlbnRDdXJyZW5jeShwb3NJRDogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbmN5ID0gdGhpcy5Qcm9maWxlQXJyYXkuUG9pbnRPZlNhbGVzLmZpbHRlcihtID0+IG0uSUQgPT0gcG9zSUQpWzBdLmN1cnJlbmNpZXM7XHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBcIkNoYW5nZSBDdXJyZW5jaWVzXCIsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiU2VsZWN0IEN1cnJlbmN5XCIsXHJcbiAgICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgIGFjdGlvbnM6IGN1cnJlbmN5XHJcbiAgICAgICAgfTtcclxuICAgICAgICBkaWFsb2dzLmFjdGlvbihvcHRpb25zKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSBcIkNhbmNlbFwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgU2VsZWN0ZWRBZ2VudCA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0Q3VycmVuY3kocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0UHJvZmlsZShwb3NJRCwgcmVzdWx0KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVUb1NlYXJjaCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9maWxlOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0aGlzLlByb2ZpbGVBcnJheSlcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcInNlYXJjaFwiXSwge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVUb0RlcGFydHVyZXMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNHYXRlRGlzYWJsZWQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiZGVwYXJ0aG9tZVwiXSwge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVUb1NldHRpbmcoKSB7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcInNldHRpbmdcIl0sIHtcclxuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBuYXZpZ2F0ZVRvQ29tcGVuc2F0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzQ29tcGVuc2F0aW9uRGlzYWJsZWQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY29tcGVuc2F0aW9uXCJdLCB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkNvbXBlbnNhdGlvbiBOb3QgYXBwbGljYWJsZVwiKS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaGFuZGxlU2VydmljZUVycm9yKGVycm9yOiBhbnkpIHtcclxuICAgICAgICB2YXIgZXJyb3JNZXNzYWdlID0gZXJyb3IudG9TdHJpbmcoKTtcclxuICAgICAgICBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJTZXNzaW9uVGltZW91dFwiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiU2Vzc2lvbiBUaW1lIE91dFwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGJlZW4gdGltZSBvdXRcIixcclxuICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPS1wiXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiXCJdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGVycm9yTWVzc2FnZSkuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==