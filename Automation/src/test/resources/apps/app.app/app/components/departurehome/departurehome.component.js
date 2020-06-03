"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var router_2 = require("nativescript-angular/router");
var page_1 = require("ui/page");
var dialogs = require("ui/dialogs");
var moment = require("moment");
//external modules and plugins
var ApplicationSettings = require("application-settings");
var Toast = require("nativescript-toast");
//app references
var index_1 = require("../../shared/services/index");
var index_2 = require("../../shared/interface/index");
var index_3 = require("../../shared/utils/index");
var app_executiontime_1 = require("../../app.executiontime");
var app_constants_1 = require("../../app.constants");
var DepartureHomeComponent = /** @class */ (function () {
    function DepartureHomeComponent(_service, page, _shared, _timeoutService, routerExtensions, _dataService, router, location, activatedRouter, departureService) {
        this._service = _service;
        this.page = page;
        this._shared = _shared;
        this._timeoutService = _timeoutService;
        this.routerExtensions = routerExtensions;
        this._dataService = _dataService;
        this.router = router;
        this.location = location;
        this.activatedRouter = activatedRouter;
        this.departureService = departureService;
        this.DepartureArray = [];
        this.DepartureArraylatest = [];
        this.isCompensationEnabled = false;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.isError = false;
        this.errorMessage = "";
        this.loaderProgress = new index_2.LoaderProgress();
    }
    DepartureHomeComponent.prototype.ngOnInit = function () {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.loaderProgress.initLoader(this.pageCont);
        this.destination = "LAX";
        this.destinationinput = "";
        this.gatenumber = "";
        var departureDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
        this.date = departureDate.toString();
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled");
        var userlocation = this.userdetails;
        this.locationcode = userlocation.substring(0, 3);
        this.searchByDestination();
        var label = this.pageCont.nativeElement;
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();
        });
    };
    DepartureHomeComponent.prototype.showAllDepartures = function () {
        this.navigateToAllDepartures();
    };
    DepartureHomeComponent.prototype.searchByDestination = function (refresh) {
        var _this = this;
        if (refresh === void 0) { refresh = false; }
        try {
            var sDate = new Date();
            console.log('SearchDeparturesByLocationcode Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader('Loading Data...');
            var startTime = moment(sDate).format('HH:MM:SS');
            this.departureService.SearchDeparturesByLocationcode(this.locationcode, this.date, startTime, refresh)
                .subscribe(function (data) {
                _this.DepartureDetails = data;
                _this.DepartureArray = index_3.Converters.ConvertToDepartureTemplate(_this.DepartureDetails, _this.destinationinput, _this.gatenumber, "des");
                if (_this.DepartureArray.length == 0) {
                    Toast.makeText("No flights found").show();
                    //  this.navigateToSearch();
                }
                _this.DepartureArraylatest = _this.DepartureArray.slice(0, 12);
                _this.loaderProgress.hideLoader();
            }, function (error) {
                console.log("Couldnt find information for this OrderID " + error);
                _this.handleServiceError(error);
                // var errorMessage = error.toString();
                // if (errorMessage.indexOf("Unrecognized token '<'") != -1) {
                //     var options = {
                //         title: "Session Time Out",
                //         message: "Your session has been time out",
                //         okButtonText: "OK"
                //     };
                //     dialogs.alert(options).then(() => {
                //         this.navigateTologin();
                //     });
                // }
                _this.loaderProgress.hideLoader();
            }, function () {
                console.log(_this.DepartureArray.length);
                _this.loaderProgress.hideLoader();
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('SearchDeparturesByLocationcode Service --------------- End Date Time : ' + eDate);
            console.log('SearchDeparturesByLocationcode Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    DepartureHomeComponent.prototype.searchbygatenumber = function (args, refresh) {
        var _this = this;
        if (refresh === void 0) { refresh = false; }
        try {
            var sDate = new Date();
            console.log('SearchDeparturesByLocationcode Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader('Loading Data...');
            var startTime = moment(sDate).format('HH:MM:SS');
            this._shared.SetStartTime(sDate);
            // if (args == "") {
            this.departureService.SearchDeparturesByLocationcode(this.locationcode, this.date, startTime, refresh)
                .subscribe(function (data) {
                _this.DepartureDetails = data;
                _this.DepartureArray = index_3.Converters.ConvertToDepartureTemplate(_this.DepartureDetails, _this.destinationinput, _this.gatenumber, args);
                if (_this.DepartureArray.length == 0) {
                    Toast.makeText("No flights found").show();
                    //  this.navigateToSearch();
                }
                if (_this.destinationinput == "") {
                    _this.DepartureArraylatest = _this.DepartureArray.slice(0, 12);
                }
                else {
                    _this.DepartureArraylatest = _this.DepartureArray;
                }
                console.log(_this.DepartureArray);
                _this.loaderProgress.hideLoader();
            }, function (error) {
                console.log("Couldnt find information for this OrderID " + error);
                _this.handleServiceError(error);
                _this.loaderProgress.hideLoader();
            }, function () {
                console.log(_this.DepartureArray.length);
                _this.loaderProgress.hideLoader();
            });
            // } 
            // else {
            //     var nextInterval = moment(this._shared.GetStartTime()).add(12, 'hours').toString();
            //     var date = moment(nextInterval).format("YYYY-MM-DD").toString();
            //     var nextStartTime = moment(nextInterval).format('HH:MM:SS').toString();
            //     this.departureService.SearchDeparturesByLocationcode(this.locationcode, date, nextStartTime,refresh)
            //         .subscribe((data) => {
            //             this.DepartureDetails = <Departures.RootObject>data;
            //             this.DepartureArray = Converters.ConvertToDepartureTemplate(this.DepartureDetails, this.destinationinput, this.gatenumber);
            //             if (this.DepartureArray.length == 0) {
            //                 Toast.makeText("No flights found").show();
            //             }
            //             this.DepartureArraylatest = this.DepartureArray;
            //             this.loaderProgress.hideLoader();
            //         },
            //         error => {
            //             console.log("Couldnt find information for this OrderID " + error);
            //             this.handleServiceError(error);
            //             this.loaderProgress.hideLoader();
            //         },
            //         () => {
            //             console.log(this.DepartureArray.length);
            //             this.loaderProgress.hideLoader();
            //         })
            // }
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('SearchDeparturesByLocationcode Service --------------- End Date Time : ' + eDate);
            console.log('SearchDeparturesByLocationcode Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    DepartureHomeComponent.prototype.refresh = function () {
        this.searchByDestination(true);
    };
    DepartureHomeComponent.prototype.simpleTap = function () {
        //  alert("Its Tapped");
    };
    DepartureHomeComponent.prototype.onChange = function (args, index) {
        this._timeoutService.resetWatch();
        switch (index) {
            // case 0:
            //     if (this.gatenumber == "") {
            //         Toast.makeText("Please Enter Correct Gate number").show();
            //         //this.GateEmpty = true;
            //     }
            //     else {
            //         this.GateEmpty = false;
            //          this.Gatedirty = true;
            //     }
            case 1:
                if (this.destinationinput.length > 3) {
                    Toast.makeText("Please Enter Correct Destination").show();
                    //  this.DestEmpty = true;
                }
                else {
                    this.DestEmpty = false;
                    this.Destdirty = true;
                }
                break;
            case 2:
                if (this.gatenumber.length > 0) {
                    var reg = new RegExp('^[a-zA-Z0-9]*$');
                    var test = reg.test(this.gatenumber);
                    if (test == false) {
                        Toast.makeText("Please Enter correct Gate number").show();
                    }
                }
                else {
                    this.GateEmpty = false;
                    this.Gatedirty = true;
                }
        }
    };
    DepartureHomeComponent.prototype.navigateToAllDepartures = function () {
        this.routerExtensions.navigate(["departall"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    DepartureHomeComponent.prototype.navigateToSearch = function () {
        if (this.isCheckinDisabled == true) {
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
    DepartureHomeComponent.prototype.navigateToDepartures = function () {
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
    DepartureHomeComponent.prototype.navigateTologin = function () {
        this.routerExtensions.navigate([""], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    DepartureHomeComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    DepartureHomeComponent.prototype.toggleChecked = function (args) {
        this.DepartureArray.forEach(function (element, index) {
            element.IsChecked = false;
        });
        var pax = args;
        pax.IsChecked = true;
        this.navigateToPaxList(pax.FlightNumber, pax);
    };
    DepartureHomeComponent.prototype.navigateToPaxList = function (param, pax) {
        this.routerExtensions.navigate(["deppaxlist"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "data": param,
                "pax": JSON.stringify(pax)
            }
        });
    };
    DepartureHomeComponent.prototype.handleServiceError = function (error) {
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
    DepartureHomeComponent.prototype.navigateToCompensation = function () {
        if (this.isCompensationEnabled == true) {
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
    __decorate([
        core_1.ViewChild('pagecontainer'),
        __metadata("design:type", core_1.ElementRef)
    ], DepartureHomeComponent.prototype, "pageCont", void 0);
    DepartureHomeComponent = __decorate([
        core_1.Component({
            selector: "departurehome-app",
            providers: [index_1.DataService, app_constants_1.Configuration, index_1.PassengerService, index_1.DepartureService],
            templateUrl: "./components/departurehome/departurehome.component.html"
        }),
        __metadata("design:paramtypes", [index_1.PassengerService, page_1.Page, index_1.CheckinOrderService, index_1.TimeOutService, router_2.RouterExtensions, index_1.DataService, router_1.Router, common_1.Location, router_1.ActivatedRoute, index_1.DepartureService])
    ], DepartureHomeComponent);
    return DepartureHomeComponent;
}());
exports.DepartureHomeComponent = DepartureHomeComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwYXJ0dXJlaG9tZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZXBhcnR1cmVob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyxzQ0FBeUU7QUFDekUsMENBQTJFO0FBQzNFLDBDQUEyQztBQUMzQyxzREFBK0Q7QUFDL0QsZ0NBQStCO0FBQy9CLG9DQUFxQztBQUVyQywrQkFBaUM7QUFFakMsOEJBQThCO0FBQzlCLDBEQUE0RDtBQUM1RCwwQ0FBNEM7QUFFNUMsZ0JBQWdCO0FBQ2hCLHFEQUFtSTtBQUNuSSxzREFBNkY7QUFFN0Ysa0RBQXNEO0FBQ3RELDZEQUEyRDtBQUMzRCxxREFBb0Q7QUFRcEQ7SUF5QkksZ0NBQW1CLFFBQTBCLEVBQVUsSUFBVSxFQUFTLE9BQTRCLEVBQVMsZUFBK0IsRUFBVSxnQkFBa0MsRUFBUyxZQUF5QixFQUFVLE1BQWMsRUFBVSxRQUFrQixFQUFVLGVBQStCLEVBQVMsZ0JBQWtDO1FBQWpWLGFBQVEsR0FBUixRQUFRLENBQWtCO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQXFCO1FBQVMsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVU7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBUyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBbkI1VixtQkFBYyxHQUFvQyxFQUFFLENBQUM7UUFDckQseUJBQW9CLEdBQW9DLEVBQUUsQ0FBQztRQU81RCwwQkFBcUIsR0FBWSxLQUFLLENBQUM7UUFFdkMsc0JBQWlCLEdBQVksS0FBSyxDQUFDO1FBQ25DLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBU25DLElBQUksQ0FB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bUJBQVcsRUFBa0IsZUFBTSxFQUFvQixpQkFBUSxFQUEyQix1QkFBYyxFQUEyQix3QkFBZ0I7T0F6QjNWLHNCQUFzQixDQTJYbEM7SUFBRCw2QkFBQztDQUFBLEFBM1hELElBMlhDO0FBM1hZLHdEQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIi8vYW5ndWxhciAmIG5hdGl2ZXNjcmlwdCByZWZlcmVuY2VzXHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uRXh0cmFzLCBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcclxuaW1wb3J0ICogYXMgZGlhbG9ncyBmcm9tIFwidWkvZGlhbG9nc1wiXHJcbmltcG9ydCAqIGFzIGdlc3R1cmVzIGZyb20gXCJ1aS9nZXN0dXJlc1wiO1xyXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xyXG5cclxuLy9leHRlcm5hbCBtb2R1bGVzIGFuZCBwbHVnaW5zXHJcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCAqIGFzIFRvYXN0IGZyb20gJ25hdGl2ZXNjcmlwdC10b2FzdCc7XHJcblxyXG4vL2FwcCByZWZlcmVuY2VzXHJcbmltcG9ydCB7IERhdGFTZXJ2aWNlLCBQYXNzZW5nZXJTZXJ2aWNlLCBUaW1lT3V0U2VydmljZSwgQ2hlY2tpbk9yZGVyU2VydmljZSwgRGVwYXJ0dXJlU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvaW5kZXhcIjtcclxuaW1wb3J0IHsgRGVwYXJ0dXJlSW5mbywgRGVwYXJ0dXJlSW5mbzEsIExvYWRlclByb2dyZXNzIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9pbnRlcmZhY2UvaW5kZXhcIjtcclxuaW1wb3J0IHsgRGVwYXJ0dXJlcyB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbW9kZWwvaW5kZXhcIjtcclxuaW1wb3J0IHsgQ29udmVydGVycyB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IHsgQXBwRXhlY3V0aW9udGltZSB9IGZyb20gXCIuLi8uLi9hcHAuZXhlY3V0aW9udGltZVwiO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vLi4vYXBwLmNvbnN0YW50cyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiBcImRlcGFydHVyZWhvbWUtYXBwXCIsXHJcbiAgICBwcm92aWRlcnM6IFtEYXRhU2VydmljZSwgQ29uZmlndXJhdGlvbiwgUGFzc2VuZ2VyU2VydmljZSwgRGVwYXJ0dXJlU2VydmljZV0sXHJcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2NvbXBvbmVudHMvZGVwYXJ0dXJlaG9tZS9kZXBhcnR1cmVob21lLmNvbXBvbmVudC5odG1sXCJcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBEZXBhcnR1cmVIb21lQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBAVmlld0NoaWxkKCdwYWdlY29udGFpbmVyJykgcGFnZUNvbnQ6IEVsZW1lbnRSZWY7XHJcbiAgICBwdWJsaWMgaXNFcnJvcjogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBlcnJvck1lc3NhZ2U6IHN0cmluZztcclxuICAgIHByaXZhdGUgRGVwYXJ0dXJlRGV0YWlsczogYW55O1xyXG4gICAgcHJpdmF0ZSBEZXBhcnR1cmVBcnJheTogQXJyYXk8RGVwYXJ0dXJlSW5mbzEuRGVwYXJ0dXJlPiA9IFtdO1xyXG4gICAgcHJpdmF0ZSBEZXBhcnR1cmVBcnJheWxhdGVzdDogQXJyYXk8RGVwYXJ0dXJlSW5mbzEuRGVwYXJ0dXJlPiA9IFtdO1xyXG4gICAgcHVibGljIGxvY2F0aW9uY29kZTogc3RyaW5nO1xyXG4gICAgcHVibGljIGRlc3RpbmF0aW9uOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgZ2F0ZW51bWJlcjogc3RyaW5nO1xyXG4gICAgcHVibGljIGRlc3RpbmF0aW9uaW5wdXQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgZGF0ZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHVzZXJkZXRhaWxzOiBhbnk7XHJcbiAgICBwdWJsaWMgaXNDb21wZW5zYXRpb25FbmFibGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgbG9hZGVyUHJvZ3Jlc3M6IExvYWRlclByb2dyZXNzO1xyXG4gICAgcHVibGljIGlzQ2hlY2tpbkRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNHYXRlRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIEdhdGVFbXB0eTogYm9vbGVhbjtcclxuXHJcbiAgICBEZXN0RW1wdHk6IGJvb2xlYW47XHJcblxyXG4gICAgR2F0ZWRpcnR5OiBib29sZWFuO1xyXG5cclxuICAgIERlc3RkaXJ0eTogYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfc2VydmljZTogUGFzc2VuZ2VyU2VydmljZSwgcHJpdmF0ZSBwYWdlOiBQYWdlLCBwdWJsaWMgX3NoYXJlZDogQ2hlY2tpbk9yZGVyU2VydmljZSwgcHVibGljIF90aW1lb3V0U2VydmljZTogVGltZU91dFNlcnZpY2UsIHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9ucywgcHVibGljIF9kYXRhU2VydmljZTogRGF0YVNlcnZpY2UsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uLCBwcml2YXRlIGFjdGl2YXRlZFJvdXRlcjogQWN0aXZhdGVkUm91dGUsIHB1YmxpYyBkZXBhcnR1cmVTZXJ2aWNlOiBEZXBhcnR1cmVTZXJ2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MgPSBuZXcgTG9hZGVyUHJvZ3Jlc3MoKTtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCd+L2ltYWdlcy9sb2dpbl9iYWNrLmpwZWcnKVwiO1xyXG4gICAgICAgIHRoaXMucGFnZS5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9IFwiY292ZXIgXCI7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5pbml0TG9hZGVyKHRoaXMucGFnZUNvbnQpO1xyXG4gICAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBcIkxBWFwiO1xyXG4gICAgICAgIHRoaXMuZGVzdGluYXRpb25pbnB1dCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5nYXRlbnVtYmVyID0gXCJcIjtcclxuICAgICAgICBsZXQgZGVwYXJ0dXJlRGF0ZSA9IG5ldyBEYXRlKCkudG9KU09OKCkuc2xpY2UoMCwgMTApLnJlcGxhY2UoLy0vZywgJy0nKTtcclxuICAgICAgICB0aGlzLmRhdGUgPSBkZXBhcnR1cmVEYXRlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdGhpcy51c2VyZGV0YWlscyA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcmRldGFpbHNcIiwgXCJcIik7XHJcbiAgICAgICAgdGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNoZWNraW5EaXNhYmxlZFwiLCApO1xyXG4gICAgICAgIHRoaXMuaXNHYXRlRGlzYWJsZWQgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJnYXRlRGlzYWJsZWRcIiwgKTtcclxuICAgICAgICB0aGlzLmlzQ29tcGVuc2F0aW9uRW5hYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNvbXBlbnNhdGlvbkVuYWJsZWRcIiwgKTtcclxuICAgICAgICBsZXQgdXNlcmxvY2F0aW9uOiBTdHJpbmcgPSB0aGlzLnVzZXJkZXRhaWxzO1xyXG4gICAgICAgIHRoaXMubG9jYXRpb25jb2RlID0gdXNlcmxvY2F0aW9uLnN1YnN0cmluZygwLCAzKTtcclxuICAgICAgICB0aGlzLnNlYXJjaEJ5RGVzdGluYXRpb24oKTtcclxuICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLnBhZ2VDb250Lm5hdGl2ZUVsZW1lbnRcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG9ic2VydmVyID0gbGFiZWwub24oXCJsb2FkZWQsIHRhcCwgbG9uZ1ByZXNzLCBzd2lwZSwgbmdNb2RlbENoYW5nZVwiLCBmdW5jdGlvbiAoYXJnczogZ2VzdHVyZXMuR2VzdHVyZUV2ZW50RGF0YSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkV2ZW50OiBcIiArIGFyZ3MuZXZlbnROYW1lKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5fdGltZW91dFNlcnZpY2UudGltZXIpO1xyXG4gICAgICAgICAgICBzZWxmLl90aW1lb3V0U2VydmljZS5yZXNldFdhdGNoKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dBbGxEZXBhcnR1cmVzKCkge1xyXG4gICAgICAgIHRoaXMubmF2aWdhdGVUb0FsbERlcGFydHVyZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWFyY2hCeURlc3RpbmF0aW9uKHJlZnJlc2g6Ym9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlYXJjaERlcGFydHVyZXNCeUxvY2F0aW9uY29kZSBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBTdGFydCBEYXRlIFRpbWUgOiAnICsgc0RhdGUpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoJ0xvYWRpbmcgRGF0YS4uLicpO1xyXG4gICAgICAgICAgICB2YXIgc3RhcnRUaW1lID0gbW9tZW50KHNEYXRlKS5mb3JtYXQoJ0hIOk1NOlNTJyk7XHJcbiAgICAgICAgICAgIHRoaXMuZGVwYXJ0dXJlU2VydmljZS5TZWFyY2hEZXBhcnR1cmVzQnlMb2NhdGlvbmNvZGUodGhpcy5sb2NhdGlvbmNvZGUsIHRoaXMuZGF0ZSwgc3RhcnRUaW1lLHJlZnJlc2gpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5EZXBhcnR1cmVEZXRhaWxzID0gPERlcGFydHVyZXMuUm9vdE9iamVjdD5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRGVwYXJ0dXJlQXJyYXkgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb0RlcGFydHVyZVRlbXBsYXRlKHRoaXMuRGVwYXJ0dXJlRGV0YWlscywgdGhpcy5kZXN0aW5hdGlvbmlucHV0LCB0aGlzLmdhdGVudW1iZXIsXCJkZXNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuRGVwYXJ0dXJlQXJyYXkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJObyBmbGlnaHRzIGZvdW5kXCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gIHRoaXMubmF2aWdhdGVUb1NlYXJjaCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5EZXBhcnR1cmVBcnJheWxhdGVzdCA9IHRoaXMuRGVwYXJ0dXJlQXJyYXkuc2xpY2UoMCwgMTIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvbiBmb3IgdGhpcyBPcmRlcklEIFwiICsgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB2YXIgZXJyb3JNZXNzYWdlID0gZXJyb3IudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGVycm9yTWVzc2FnZS5pbmRleE9mKFwiVW5yZWNvZ25pemVkIHRva2VuICc8J1wiKSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRpdGxlOiBcIlNlc3Npb24gVGltZSBPdXRcIixcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIG1lc3NhZ2U6IFwiWW91ciBzZXNzaW9uIGhhcyBiZWVuIHRpbWUgb3V0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBkaWFsb2dzLmFsZXJ0KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMubmF2aWdhdGVUb2xvZ2luKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuRGVwYXJ0dXJlQXJyYXkubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgIHZhciBlRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWFyY2hEZXBhcnR1cmVzQnlMb2NhdGlvbmNvZGUgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlRGF0ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWFyY2hEZXBhcnR1cmVzQnlMb2NhdGlvbmNvZGUgU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlRGF0ZSkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VhcmNoYnlnYXRlbnVtYmVyKGFyZ3MscmVmcmVzaDpib29sZWFuPWZhbHNlKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlYXJjaERlcGFydHVyZXNCeUxvY2F0aW9uY29kZSBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBTdGFydCBEYXRlIFRpbWUgOiAnICsgc0RhdGUpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoJ0xvYWRpbmcgRGF0YS4uLicpO1xyXG4gICAgICAgICAgICB2YXIgc3RhcnRUaW1lID0gbW9tZW50KHNEYXRlKS5mb3JtYXQoJ0hIOk1NOlNTJyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRTdGFydFRpbWUoc0RhdGUpO1xyXG4gICAgICAgICAgICAvLyBpZiAoYXJncyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlcGFydHVyZVNlcnZpY2UuU2VhcmNoRGVwYXJ0dXJlc0J5TG9jYXRpb25jb2RlKHRoaXMubG9jYXRpb25jb2RlLCB0aGlzLmRhdGUsIHN0YXJ0VGltZSxyZWZyZXNoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5EZXBhcnR1cmVEZXRhaWxzID0gPERlcGFydHVyZXMuUm9vdE9iamVjdD5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkRlcGFydHVyZUFycmF5ID0gQ29udmVydGVycy5Db252ZXJ0VG9EZXBhcnR1cmVUZW1wbGF0ZSh0aGlzLkRlcGFydHVyZURldGFpbHMsIHRoaXMuZGVzdGluYXRpb25pbnB1dCwgdGhpcy5nYXRlbnVtYmVyLGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5EZXBhcnR1cmVBcnJheS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJObyBmbGlnaHRzIGZvdW5kXCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICB0aGlzLm5hdmlnYXRlVG9TZWFyY2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmRlc3RpbmF0aW9uaW5wdXQ9PVwiXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5EZXBhcnR1cmVBcnJheWxhdGVzdCA9IHRoaXMuRGVwYXJ0dXJlQXJyYXkuc2xpY2UoMCwgMTIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRGVwYXJ0dXJlQXJyYXlsYXRlc3QgPSB0aGlzLkRlcGFydHVyZUFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuRGVwYXJ0dXJlQXJyYXkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvbiBmb3IgdGhpcyBPcmRlcklEIFwiICsgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLkRlcGFydHVyZUFycmF5Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC8vIH0gXHJcbiAgICAgICAgICAgIC8vIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgLy8gICAgIHZhciBuZXh0SW50ZXJ2YWwgPSBtb21lbnQodGhpcy5fc2hhcmVkLkdldFN0YXJ0VGltZSgpKS5hZGQoMTIsICdob3VycycpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIC8vICAgICB2YXIgZGF0ZSA9IG1vbWVudChuZXh0SW50ZXJ2YWwpLmZvcm1hdChcIllZWVktTU0tRERcIikudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgLy8gICAgIHZhciBuZXh0U3RhcnRUaW1lID0gbW9tZW50KG5leHRJbnRlcnZhbCkuZm9ybWF0KCdISDpNTTpTUycpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmRlcGFydHVyZVNlcnZpY2UuU2VhcmNoRGVwYXJ0dXJlc0J5TG9jYXRpb25jb2RlKHRoaXMubG9jYXRpb25jb2RlLCBkYXRlLCBuZXh0U3RhcnRUaW1lLHJlZnJlc2gpXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLkRlcGFydHVyZURldGFpbHMgPSA8RGVwYXJ0dXJlcy5Sb290T2JqZWN0PmRhdGE7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuRGVwYXJ0dXJlQXJyYXkgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb0RlcGFydHVyZVRlbXBsYXRlKHRoaXMuRGVwYXJ0dXJlRGV0YWlscywgdGhpcy5kZXN0aW5hdGlvbmlucHV0LCB0aGlzLmdhdGVudW1iZXIpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBpZiAodGhpcy5EZXBhcnR1cmVBcnJheS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJObyBmbGlnaHRzIGZvdW5kXCIpLnNob3coKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLkRlcGFydHVyZUFycmF5bGF0ZXN0ID0gdGhpcy5EZXBhcnR1cmVBcnJheTtcclxuXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvbiBmb3IgdGhpcyBPcmRlcklEIFwiICsgZXJyb3IpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5EZXBhcnR1cmVBcnJheS5sZW5ndGgpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlYXJjaERlcGFydHVyZXNCeUxvY2F0aW9uY29kZSBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlYXJjaERlcGFydHVyZXNCeUxvY2F0aW9uY29kZSBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZWZyZXNoKCl7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hCeURlc3RpbmF0aW9uKHRydWUpOyBcclxuICAgIH1cclxuICAgIHNpbXBsZVRhcCgpIHtcclxuICAgICAgICAvLyAgYWxlcnQoXCJJdHMgVGFwcGVkXCIpO1xyXG4gICAgfVxyXG4gICAgb25DaGFuZ2UoYXJnczogYW55LCBpbmRleDogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fdGltZW91dFNlcnZpY2UucmVzZXRXYXRjaCgpO1xyXG4gICAgICAgIHN3aXRjaCAoaW5kZXgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGNhc2UgMDpcclxuXHJcbiAgICAgICAgICAgIC8vICAgICBpZiAodGhpcy5nYXRlbnVtYmVyID09IFwiXCIpIHtcclxuXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJQbGVhc2UgRW50ZXIgQ29ycmVjdCBHYXRlIG51bWJlclwiKS5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICAvLyAgICAgICAgIC8vdGhpcy5HYXRlRW1wdHkgPSB0cnVlO1xyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLkdhdGVFbXB0eSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLy8gICAgICAgICAgdGhpcy5HYXRlZGlydHkgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgLy8gICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXN0aW5hdGlvbmlucHV0Lmxlbmd0aCA+IDMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJQbGVhc2UgRW50ZXIgQ29ycmVjdCBEZXN0aW5hdGlvblwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gIHRoaXMuRGVzdEVtcHR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkRlc3RFbXB0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRGVzdGRpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2F0ZW51bWJlci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoJ15bYS16QS1aMC05XSokJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3QgPSByZWcudGVzdCh0aGlzLmdhdGVudW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiUGxlYXNlIEVudGVyIGNvcnJlY3QgR2F0ZSBudW1iZXJcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuR2F0ZUVtcHR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5HYXRlZGlydHkgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBuYXZpZ2F0ZVRvQWxsRGVwYXJ0dXJlcygpIHtcclxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiZGVwYXJ0YWxsXCJdLCB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVUb1NlYXJjaCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZWFyY2hcIl0sIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG5hdmlnYXRlVG9EZXBhcnR1cmVzKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzR2F0ZURpc2FibGVkID09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImRlcGFydGhvbWVcIl0sIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG5hdmlnYXRlVG9sb2dpbigpIHtcclxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiXCJdLCB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVUb1NldHRpbmcoKSB7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcInNldHRpbmdcIl0sIHtcclxuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB0b2dnbGVDaGVja2VkKGFyZ3M6IGFueSkge1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5EZXBhcnR1cmVBcnJheS5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBlbGVtZW50LklzQ2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBwYXggPSA8RGVwYXJ0dXJlSW5mbzEuRGVwYXJ0dXJlPmFyZ3M7XHJcbiAgICAgICAgcGF4LklzQ2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvUGF4TGlzdChwYXguRmxpZ2h0TnVtYmVyLCBwYXgpO1xyXG5cclxuXHJcbiAgICB9XHJcbiAgICBuYXZpZ2F0ZVRvUGF4TGlzdChwYXJhbTogc3RyaW5nLCBwYXg6IERlcGFydHVyZUluZm8xLkRlcGFydHVyZSkge1xyXG5cclxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiZGVwcGF4bGlzdFwiXSwge1xyXG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBcImRhdGFcIjogcGFyYW0sXHJcbiAgICAgICAgICAgICAgICBcInBheFwiOiBKU09OLnN0cmluZ2lmeShwYXgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVTZXJ2aWNlRXJyb3IoZXJyb3I6IGFueSkge1xyXG4gICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci50b1N0cmluZygpO1xyXG4gICAgICAgIGlmIChlcnJvck1lc3NhZ2UuaW5kZXhPZihcIlNlc3Npb25UaW1lb3V0XCIpID4gLTEpIHtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJTZXNzaW9uIFRpbWUgT3V0XCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIllvdXIgc2Vzc2lvbiBoYXMgYmVlbiB0aW1lIG91dFwiLFxyXG4gICAgICAgICAgICAgICAgb2tCdXR0b25UZXh0OiBcIk9LXCJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZGlhbG9ncy5hbGVydChvcHRpb25zKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJcIl0sIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZXJyb3JNZXNzYWdlKS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVUb0NvbXBlbnNhdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0NvbXBlbnNhdGlvbkVuYWJsZWQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY29tcGVuc2F0aW9uXCJdLCB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkNvbXBlbnNhdGlvbiBOb3QgYXBwbGljYWJsZVwiKS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuIl19