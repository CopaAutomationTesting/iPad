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
var converter_util_1 = require("../../shared/utils/converter.util");
var app_constants_1 = require("../../app.constants");
var app_executiontime_1 = require("../../app.executiontime");
var DepartureAllComponent = /** @class */ (function () {
    function DepartureAllComponent(page, _timeoutService, _service, routerExtensions, _dataService, router, location, activatedRouter, _departureService) {
        this.page = page;
        this._timeoutService = _timeoutService;
        this._service = _service;
        this.routerExtensions = routerExtensions;
        this._dataService = _dataService;
        this.router = router;
        this.location = location;
        this.activatedRouter = activatedRouter;
        this._departureService = _departureService;
        this.Config = [];
        this.DepartureArray = [];
        this.flightSortIndicator = -1;
        this.StdSortIndicator = -1;
        this.EtdSortIndicator = -1;
        this.StatusSortIndicator = -1;
        this.gateSortIndicator = -1;
        this.toSortIndicator = -1;
        this.isCompensationEnabled = false;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.isError = false;
        this.errorMessage = "";
        this.loaderProgress = new index_2.LoaderProgress();
    }
    DepartureAllComponent.prototype.ngOnInit = function () {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.loaderProgress.initLoader(this.pageCont);
        var departureDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
        this.date = departureDate.toString();
        this.Flightdate = moment(departureDate, "YYYY-MM-DD").format("MM/DD/YY");
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled");
        var userlocation = this.userdetails;
        this.locationcode = userlocation.substring(0, 3);
        this.searchFlightByDestination(this.locationcode, this.date);
        var label = this.pageCont.nativeElement;
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();
        });
    };
    DepartureAllComponent.prototype.refresh = function () {
        this.searchFlightByDestination(this.locationcode, this.date, true);
    };
    DepartureAllComponent.prototype.searchFlightByDestination = function (location, date, refresh) {
        var _this = this;
        if (refresh === void 0) { refresh = false; }
        try {
            var sDate = new Date();
            console.log('SearchDeparturesByLocationcode Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader('Loading Data...');
            var startTime = moment(sDate).format('HH:MM:SS');
            this.loaderProgress.showLoader();
            this._departureService.SearchDeparturesByLocationcode(this.locationcode, this.date, startTime, refresh)
                .subscribe(function (data) {
                _this.DepartureDetails = data;
                _this.DepartureArray = converter_util_1.Converters.ConvertToDepartureTemplate(_this.DepartureDetails, "", "", "des");
                if (_this.DepartureArray.length == 0) {
                    var self = _this;
                    Toast.makeText("No flights found").show();
                    _this.navigateToDepartures();
                }
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
                //         this.navigateToLogin();
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
    DepartureAllComponent.prototype.sortFlight = function () {
        // var isAsc: number = this.flightSortIndicator == -1 ? 0 : this.flightSortIndicator;
        var isAsc = this.flightSortIndicator == 0 ? 1 : 0;
        this.flightSortIndicator = this.flightSortIndicator == 0 ? 1 : 0;
        this.toSortIndicator = -1;
        this.EtdSortIndicator = -1;
        this.StatusSortIndicator = -1;
        this.StdSortIndicator = -1;
        this.gateSortIndicator = -1;
        // console.dir(this.DepartureArray);
        this.DepartureArray.sort(function (a, b) {
            var val1 = Number(a.FlightNumber.substr(2));
            var val2 = Number(b.FlightNumber.substr(2)) == Number.NaN ? 0 : Number(b.FlightNumber.substr(2));
            console.log(val1 + " " + val2);
            if (isAsc == 0) {
                if (val1 < val2) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
            else {
                if (val1 > val2) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
        });
        console.log("Sort Done");
        this.loaderProgress.hideLoader();
    };
    DepartureAllComponent.prototype.icon = function () {
        if (this.flightSortIndicator == -1) {
            return '&#xe902;';
        }
        else if (this.flightSortIndicator == 0)
            return '&#xe900;';
        else
            return '&#xE5C5;';
    };
    DepartureAllComponent.prototype.sortTo = function () {
        // var isAsc: number = this.toSortIndicator == -1 ? 0 : this.toSortIndicator;
        var isAsc = this.toSortIndicator == 0 ? 1 : 0;
        this.toSortIndicator = this.toSortIndicator == 0 ? 1 : 0;
        this.flightSortIndicator = -1;
        this.EtdSortIndicator = -1;
        this.StatusSortIndicator = -1;
        this.StdSortIndicator = -1;
        this.gateSortIndicator = -1;
        this.DepartureArray.sort(function (a, b) {
            var val1 = a.Destination;
            var val2 = b.Destination;
            console.log(val1 + " " + val2);
            if (isAsc == 0) {
                if (val1 < val2) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
            else {
                if (val1 > val2) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
        });
    };
    DepartureAllComponent.prototype.sortGate = function () {
        // var isAsc: number = this.gateSortIndicator == -1 ? 0 : this.gateSortIndicator;
        var isAsc = this.gateSortIndicator == 0 ? 1 : 0;
        this.gateSortIndicator = this.gateSortIndicator == 0 ? 1 : 0;
        this.flightSortIndicator = -1;
        this.EtdSortIndicator = -1;
        this.StatusSortIndicator = -1;
        this.StdSortIndicator = -1;
        this.toSortIndicator = -1;
        this.DepartureArray.sort(function (a, b) {
            // var val1 = a.Destination;
            // var val2 = b.Destination;
            var val1 = Number(a.Gate.split(/[a-zA-Z]/)[0]);
            var val2 = Number(b.Gate.split(/[a-zA-Z]/)[0]) == Number.NaN ? 0 : Number(b.Gate.split(/[a-zA-Z]/)[0]);
            console.log(val1 + " " + val2);
            if (isAsc == 0) {
                if (val1 < val2) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
            else {
                if (val1 > val2) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
        });
    };
    DepartureAllComponent.prototype.sortStatus = function () {
        // var isAsc: number = this.StatusSortIndicator == -1 ? 0 : this.StatusSortIndicator;
        var isAsc = this.StatusSortIndicator == 0 ? 1 : 0;
        this.StatusSortIndicator = this.StatusSortIndicator == 0 ? 1 : 0;
        this.flightSortIndicator = -1;
        this.EtdSortIndicator = -1;
        this.toSortIndicator = -1;
        this.StdSortIndicator = -1;
        this.gateSortIndicator = -1;
        this.DepartureArray.sort(function (a, b) {
            var val1 = a.FlightStatus;
            var val2 = b.FlightStatus;
            console.log(val1 + " " + val2);
            if (isAsc == 0) {
                if (val1 < val2) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
            else {
                if (val1 > val2) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
        });
    };
    DepartureAllComponent.prototype.sortSTD = function () {
        // var isAsc: number = this.StdSortIndicator == -1 ? 0 : this.StdSortIndicator;
        var isAsc = this.StdSortIndicator == 0 ? 1 : 0;
        this.StdSortIndicator = this.StdSortIndicator == 0 ? 1 : 0;
        this.toSortIndicator = -1;
        this.EtdSortIndicator = -1;
        this.flightSortIndicator = -1;
        this.StatusSortIndicator = -1;
        this.gateSortIndicator = -1;
        this.DepartureArray.sort(function (a, b) {
            var val1 = Number(a.STD.replace(':', ''));
            var val2 = Number(b.STD.replace(':', '')) == Number.NaN ? 0 : Number(b.STD.replace(':', ''));
            console.log(val1 + " " + val2);
            //   this.sort();
            if (isAsc == 0) {
                if (val1 < val2) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
            else {
                if (val1 > val2) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
        });
    };
    DepartureAllComponent.prototype.sortETD = function () {
        this.loaderProgress.showLoader();
        // var isAsc: number = this.EtdSortIndicator == -1 ? 0 : this.EtdSortIndicator;
        var isAsc = this.EtdSortIndicator == 0 ? 1 : 0;
        console.log(isAsc);
        this.EtdSortIndicator = this.EtdSortIndicator == 0 ? 1 : 0;
        this.toSortIndicator = -1;
        this.StdSortIndicator = -1;
        this.flightSortIndicator = -1;
        this.StatusSortIndicator = -1;
        this.gateSortIndicator = -1;
        this.DepartureArray.sort(function (a, b) {
            // console.log(Number(a.ETD.toString().slice(/)));
            var val1 = Number(a.ETD.replace(':', ''));
            // let val3 = a.ETD.toString().slice(:);
            var val2 = Number(b.ETD.replace(':', '')) == Number.NaN ? 0 : Number(b.ETD.replace(':', ''));
            console.log(val1 + " " + val2);
            //   this.sort();
            if (isAsc == 0) {
                if (val1 < val2) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
            else {
                if (val1 > val2) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
        });
        console.log(this.DepartureArray);
        this.loaderProgress.hideLoader();
    };
    DepartureAllComponent.prototype.displaypaxlist = function (args) {
        var pax = args.view.bindingContext;
        this.navigateToPaxList(pax.FlightNumber, pax);
    };
    DepartureAllComponent.prototype.toggleChecked = function (args) {
        this.DepartureArray.forEach(function (element, index) {
            element.IsChecked = false;
        });
        var pax = args.view.bindingContext;
        pax.IsChecked = true;
        this.navigateToPaxList(pax.FlightNumber, pax);
    };
    DepartureAllComponent.prototype.simpleTap = function () {
    };
    DepartureAllComponent.prototype.navigateToPaxList = function (param, pax) {
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
    DepartureAllComponent.prototype.navigateToSearch = function () {
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
    DepartureAllComponent.prototype.navigateToDepartures = function () {
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
    DepartureAllComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    DepartureAllComponent.prototype.navigateToLogin = function () {
        this.routerExtensions.navigate([""], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    DepartureAllComponent.prototype.handleServiceError = function (error) {
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
    DepartureAllComponent.prototype.navigateToCompensation = function () {
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
    ], DepartureAllComponent.prototype, "pageCont", void 0);
    DepartureAllComponent = __decorate([
        core_1.Component({
            selector: "departureall-app",
            providers: [index_1.DataService, app_constants_1.Configuration, index_1.PassengerService, index_1.DepartureService],
            templateUrl: "./components/departureall/departureall.component.html"
        }),
        __metadata("design:paramtypes", [page_1.Page, index_1.TimeOutService, index_1.PassengerService, router_2.RouterExtensions, index_1.DataService, router_1.Router, common_1.Location, router_1.ActivatedRoute, index_1.DepartureService])
    ], DepartureAllComponent);
    return DepartureAllComponent;
}());
exports.DepartureAllComponent = DepartureAllComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwYXJ0dXJlYWxsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcGFydHVyZWFsbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsc0NBQXlFO0FBQ3pFLDBDQUEyRTtBQUMzRSwwQ0FBMkM7QUFDM0Msc0RBQStEO0FBQy9ELGdDQUErQjtBQUMvQixvQ0FBc0M7QUFHdEMsOEJBQThCO0FBQzlCLDBEQUE0RDtBQUM1RCwrQkFBaUM7QUFDakMsMENBQTRDO0FBRTVDLGdCQUFnQjtBQUNoQixxREFBOEc7QUFDOUcsc0RBQTZGO0FBRTdGLG9FQUErRDtBQUMvRCxxREFBb0Q7QUFDcEQsNkRBQTJEO0FBUzNEO0lBdUJJLCtCQUFvQixJQUFVLEVBQVMsZUFBK0IsRUFBUyxRQUEwQixFQUFVLGdCQUFrQyxFQUFTLFlBQXlCLEVBQVUsTUFBYyxFQUFVLFFBQWtCLEVBQVUsZUFBK0IsRUFBUSxpQkFBa0M7UUFBMVMsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFTLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUFTLGFBQVEsR0FBUixRQUFRLENBQWtCO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVU7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBUSxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWlCO1FBbkJ2VCxXQUFNLEdBQXdDLEVBQUUsQ0FBQztRQUVoRCxtQkFBYyxHQUFvQyxFQUFFLENBQUM7UUFLdEQsd0JBQW1CLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDakMscUJBQWdCLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDOUIscUJBQWdCLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDOUIsd0JBQW1CLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDakMs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LEVBQUUsR0FBRztvQkFDYixLQUFLLEVBQUUsUUFBUTtpQkFDbEI7YUFDSixDQUFDLENBQUM7U0FDTjthQUFJO1lBQ0QsS0FBSyxDQUFDLFFBQVEsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3hEO0lBQ0wsQ0FBQztJQTVaMkI7UUFBM0IsZ0JBQVMsQ0FBQyxlQUFlLENBQUM7a0NBQVcsaUJBQVU7MkRBQUM7SUFyQnhDLHFCQUFxQjtRQU5qQyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLGtCQUFrQjtZQUM1QixTQUFTLEVBQUUsQ0FBQyxtQkFBVyxFQUFFLDZCQUFhLEVBQUUsd0JBQWdCLEVBQUMsd0JBQWdCLENBQUM7WUFDMUUsV0FBVyxFQUFFLHVEQUF1RDtTQUN2RSxDQUFDO3lDQXlCNEIsV0FBSSxFQUEwQixzQkFBYyxFQUFtQix3QkFBZ0IsRUFBNEIseUJBQWdCLEVBQXVCLG1CQUFXLEVBQWtCLGVBQU0sRUFBb0IsaUJBQVEsRUFBMkIsdUJBQWMsRUFBMEIsd0JBQWdCO09BdkJyVCxxQkFBcUIsQ0FtYmpDO0lBQUQsNEJBQUM7Q0FBQSxBQW5iRCxJQW1iQztBQW5iWSxzREFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvL2FuZ3VsYXIgJiBuYXRpdmVzY3JpcHQgcmVmZXJlbmNlc1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvbkV4dHJhcywgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcclxuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XHJcbmltcG9ydCAqIGFzIGRpYWxvZ3MgZnJvbSBcInVpL2RpYWxvZ3NcIjtcclxuaW1wb3J0ICogYXMgZ2VzdHVyZXMgZnJvbSBcInVpL2dlc3R1cmVzXCI7XHJcblxyXG4vL2V4dGVybmFsIG1vZHVsZXMgYW5kIHBsdWdpbnNcclxuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcclxuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcclxuXHJcbi8vYXBwIHJlZmVyZW5jZXNcclxuaW1wb3J0IHsgRGF0YVNlcnZpY2UsIFRpbWVPdXRTZXJ2aWNlLCBQYXNzZW5nZXJTZXJ2aWNlLCBEZXBhcnR1cmVTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9pbmRleFwiO1xyXG5pbXBvcnQgeyBEZXBhcnR1cmVJbmZvLCBEZXBhcnR1cmVJbmZvMSwgTG9hZGVyUHJvZ3Jlc3MgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2ludGVyZmFjZS9pbmRleFwiO1xyXG5pbXBvcnQgeyBEZXBhcnR1cmVzIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9tb2RlbC9pbmRleFwiO1xyXG5pbXBvcnQgeyBDb252ZXJ0ZXJzIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC91dGlscy9jb252ZXJ0ZXIudXRpbFwiO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vLi4vYXBwLmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IEFwcEV4ZWN1dGlvbnRpbWUgfSBmcm9tIFwiLi4vLi4vYXBwLmV4ZWN1dGlvbnRpbWVcIjtcclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiBcImRlcGFydHVyZWFsbC1hcHBcIixcclxuICAgIHByb3ZpZGVyczogW0RhdGFTZXJ2aWNlLCBDb25maWd1cmF0aW9uLCBQYXNzZW5nZXJTZXJ2aWNlLERlcGFydHVyZVNlcnZpY2VdLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9jb21wb25lbnRzL2RlcGFydHVyZWFsbC9kZXBhcnR1cmVhbGwuY29tcG9uZW50Lmh0bWxcIlxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIERlcGFydHVyZUFsbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gICAgcHVibGljIGlzRXJyb3I6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgQ29uZmlnOiBBcnJheTxEZXBhcnR1cmVJbmZvMS5Db25maWd1cmF0aW9uPiA9IFtdO1xyXG4gICAgcHJpdmF0ZSBEZXBhcnR1cmVEZXRhaWxzOiBhbnk7XHJcbiAgICBwcml2YXRlIERlcGFydHVyZUFycmF5OiBBcnJheTxEZXBhcnR1cmVJbmZvMS5EZXBhcnR1cmU+ID0gW107XHJcbiAgICBwcml2YXRlIGxvY2F0aW9uY29kZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBkYXRlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIEZsaWdodGRhdGU6IHN0cmluZztcclxuICAgIHB1YmxpYyB1c2VyZGV0YWlsczogYW55O1xyXG4gICAgcHVibGljIGZsaWdodFNvcnRJbmRpY2F0b3I6IG51bWJlciA9IC0xO1xyXG4gICAgcHVibGljIFN0ZFNvcnRJbmRpY2F0b3I6IG51bWJlciA9IC0xO1xyXG4gICAgcHVibGljIEV0ZFNvcnRJbmRpY2F0b3I6IG51bWJlciA9IC0xO1xyXG4gICAgcHVibGljIFN0YXR1c1NvcnRJbmRpY2F0b3I6IG51bWJlciA9IC0xO1xyXG4gICAgcHVibGljIGdhdGVTb3J0SW5kaWNhdG9yOiBudW1iZXIgPSAtMTtcclxuICAgIHB1YmxpYyB0b1NvcnRJbmRpY2F0b3I6IG51bWJlciA9IC0xO1xyXG4gICAgcHVibGljIGlzQ29tcGVuc2F0aW9uRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlOyAgXHJcbiAgICBwdWJsaWMgbG9hZGVyUHJvZ3Jlc3M6IExvYWRlclByb2dyZXNzO1xyXG4gICAgcHVibGljIGlzQ2hlY2tpbkRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNHYXRlRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIEBWaWV3Q2hpbGQoJ3BhZ2Vjb250YWluZXInKSBwYWdlQ29udDogRWxlbWVudFJlZjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhZ2U6IFBhZ2UsIHB1YmxpYyBfdGltZW91dFNlcnZpY2U6IFRpbWVPdXRTZXJ2aWNlLCBwdWJsaWMgX3NlcnZpY2U6IFBhc3NlbmdlclNlcnZpY2UsIHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9ucywgcHVibGljIF9kYXRhU2VydmljZTogRGF0YVNlcnZpY2UsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uLCBwcml2YXRlIGFjdGl2YXRlZFJvdXRlcjogQWN0aXZhdGVkUm91dGUscHVibGljIF9kZXBhcnR1cmVTZXJ2aWNlOkRlcGFydHVyZVNlcnZpY2UgKSB7XHJcbiAgICAgICAgdGhpcy5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MgPSBuZXcgTG9hZGVyUHJvZ3Jlc3MoKTtcclxuICAgIH1cclxuICAgIG5nT25Jbml0KCkge1xyXG5cclxuICAgICAgICB0aGlzLnBhZ2Uuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJ34vaW1hZ2VzL2xvZ2luX2JhY2suanBlZycpXCI7XHJcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRTaXplID0gXCJjb3ZlciBcIjtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmluaXRMb2FkZXIodGhpcy5wYWdlQ29udCk7XHJcbiAgICAgICAgbGV0IGRlcGFydHVyZURhdGUgPSBuZXcgRGF0ZSgpLnRvSlNPTigpLnNsaWNlKDAsIDEwKS5yZXBsYWNlKC8tL2csICctJyk7XHJcbiAgICAgICAgdGhpcy5kYXRlID0gZGVwYXJ0dXJlRGF0ZS50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuRmxpZ2h0ZGF0ZSA9IG1vbWVudChkZXBhcnR1cmVEYXRlLCBcIllZWVktTU0tRERcIikuZm9ybWF0KFwiTU0vREQvWVlcIik7XHJcbiAgICAgICAgdGhpcy51c2VyZGV0YWlscyA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcmRldGFpbHNcIiwgXCJcIik7XHJcbiAgICAgICAgdGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNoZWNraW5EaXNhYmxlZFwiLCApO1xyXG4gICAgICAgIHRoaXMuaXNHYXRlRGlzYWJsZWQgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJnYXRlRGlzYWJsZWRcIiwgKTtcclxuICAgICAgICB0aGlzLmlzQ29tcGVuc2F0aW9uRW5hYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNvbXBlbnNhdGlvbkVuYWJsZWRcIiwgKTtcclxuICAgICAgICBsZXQgdXNlcmxvY2F0aW9uOiBTdHJpbmcgPSB0aGlzLnVzZXJkZXRhaWxzO1xyXG4gICAgICAgIHRoaXMubG9jYXRpb25jb2RlID0gdXNlcmxvY2F0aW9uLnN1YnN0cmluZygwLCAzKTtcclxuICAgICAgICB0aGlzLnNlYXJjaEZsaWdodEJ5RGVzdGluYXRpb24odGhpcy5sb2NhdGlvbmNvZGUsIHRoaXMuZGF0ZSk7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gdGhpcy5wYWdlQ29udC5uYXRpdmVFbGVtZW50XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBvYnNlcnZlciA9IGxhYmVsLm9uKFwibG9hZGVkLCB0YXAsIGxvbmdQcmVzcywgc3dpcGUsIG5nTW9kZWxDaGFuZ2VcIiwgZnVuY3Rpb24gKGFyZ3M6IGdlc3R1cmVzLkdlc3R1cmVFdmVudERhdGEpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFdmVudDogXCIgKyBhcmdzLmV2ZW50TmFtZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuX3RpbWVvdXRTZXJ2aWNlLnRpbWVyKTtcclxuICAgICAgICAgICAgc2VsZi5fdGltZW91dFNlcnZpY2UucmVzZXRXYXRjaCgpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcbiAgICByZWZyZXNoKCl7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hGbGlnaHRCeURlc3RpbmF0aW9uKHRoaXMubG9jYXRpb25jb2RlLCB0aGlzLmRhdGUsdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VhcmNoRmxpZ2h0QnlEZXN0aW5hdGlvbihsb2NhdGlvbjogc3RyaW5nLCBkYXRlOiBzdHJpbmcscmVmcmVzaDpib29sZWFuPWZhbHNlKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWFyY2hEZXBhcnR1cmVzQnlMb2NhdGlvbmNvZGUgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCdMb2FkaW5nIERhdGEuLi4nKTtcclxuICAgICAgICAgICAgdmFyIHN0YXJ0VGltZSA9IG1vbWVudChzRGF0ZSkuZm9ybWF0KCdISDpNTTpTUycpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5fZGVwYXJ0dXJlU2VydmljZS5TZWFyY2hEZXBhcnR1cmVzQnlMb2NhdGlvbmNvZGUodGhpcy5sb2NhdGlvbmNvZGUsIHRoaXMuZGF0ZSwgc3RhcnRUaW1lLHJlZnJlc2gpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5EZXBhcnR1cmVEZXRhaWxzID0gPERlcGFydHVyZXMuUm9vdE9iamVjdD5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRGVwYXJ0dXJlQXJyYXkgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb0RlcGFydHVyZVRlbXBsYXRlKHRoaXMuRGVwYXJ0dXJlRGV0YWlscywgXCJcIiwgXCJcIixcImRlc1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuRGVwYXJ0dXJlQXJyYXkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk5vIGZsaWdodHMgZm91bmRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9EZXBhcnR1cmVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvbiBmb3IgdGhpcyBPcmRlcklEIFwiICsgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB2YXIgZXJyb3JNZXNzYWdlID0gZXJyb3IudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJVbnJlY29nbml6ZWQgdG9rZW4gJzwnXCIpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGl0bGU6IFwiU2Vzc2lvbiBUaW1lIE91dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGJlZW4gdGltZSBvdXRcIixcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPS1wiXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvTG9naW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5EZXBhcnR1cmVBcnJheS5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlYXJjaERlcGFydHVyZXNCeUxvY2F0aW9uY29kZSBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlYXJjaERlcGFydHVyZXNCeUxvY2F0aW9uY29kZSBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNvcnRGbGlnaHQoKSB7XHJcbiAgICAgICAgLy8gdmFyIGlzQXNjOiBudW1iZXIgPSB0aGlzLmZsaWdodFNvcnRJbmRpY2F0b3IgPT0gLTEgPyAwIDogdGhpcy5mbGlnaHRTb3J0SW5kaWNhdG9yO1xyXG4gICAgICAgIHZhciBpc0FzYzogbnVtYmVyID0gdGhpcy5mbGlnaHRTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcclxuICAgICAgICB0aGlzLmZsaWdodFNvcnRJbmRpY2F0b3IgPSB0aGlzLmZsaWdodFNvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xyXG4gICAgICAgIHRoaXMudG9Tb3J0SW5kaWNhdG9yID0gLTE7XHJcbiAgICAgICAgdGhpcy5FdGRTb3J0SW5kaWNhdG9yID0gLTE7XHJcbiAgICAgICAgdGhpcy5TdGF0dXNTb3J0SW5kaWNhdG9yID0gLTE7XHJcbiAgICAgICAgdGhpcy5TdGRTb3J0SW5kaWNhdG9yID0gLTE7XHJcbiAgICAgICAgdGhpcy5nYXRlU29ydEluZGljYXRvciA9IC0xO1xyXG4gICAgICAgIC8vIGNvbnNvbGUuZGlyKHRoaXMuRGVwYXJ0dXJlQXJyYXkpO1xyXG4gICAgICAgIHRoaXMuRGVwYXJ0dXJlQXJyYXkuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICB2YXIgdmFsMSA9IE51bWJlcihhLkZsaWdodE51bWJlci5zdWJzdHIoMikpO1xyXG4gICAgICAgICAgICB2YXIgdmFsMiA9IE51bWJlcihiLkZsaWdodE51bWJlci5zdWJzdHIoMikpID09IE51bWJlci5OYU4gPyAwIDogTnVtYmVyKGIuRmxpZ2h0TnVtYmVyLnN1YnN0cigyKSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbDEgKyBcIiBcIiArIHZhbDIpO1xyXG4gICAgICAgICAgICBpZiAoaXNBc2MgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPCB2YWwyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWwxID4gdmFsMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlNvcnQgRG9uZVwiKTtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBpY29uKCk6IGFueSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmxpZ2h0U29ydEluZGljYXRvciA9PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJyYjeGU5MDI7J1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5mbGlnaHRTb3J0SW5kaWNhdG9yID09IDApXHJcbiAgICAgICAgICAgIHJldHVybiAnJiN4ZTkwMDsnXHJcbiAgICAgICAgZWxzZSByZXR1cm4gJyYjeEU1QzU7J1xyXG4gICAgfVxyXG5cclxuICAgIHNvcnRUbygpIHtcclxuICAgICAgICAvLyB2YXIgaXNBc2M6IG51bWJlciA9IHRoaXMudG9Tb3J0SW5kaWNhdG9yID09IC0xID8gMCA6IHRoaXMudG9Tb3J0SW5kaWNhdG9yO1xyXG4gICAgICAgIHZhciBpc0FzYzogbnVtYmVyID0gdGhpcy50b1NvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xyXG4gICAgICAgIHRoaXMudG9Tb3J0SW5kaWNhdG9yID0gdGhpcy50b1NvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xyXG4gICAgICAgIHRoaXMuZmxpZ2h0U29ydEluZGljYXRvciA9IC0xO1xyXG4gICAgICAgIHRoaXMuRXRkU29ydEluZGljYXRvciA9IC0xO1xyXG4gICAgICAgIHRoaXMuU3RhdHVzU29ydEluZGljYXRvciA9IC0xO1xyXG4gICAgICAgIHRoaXMuU3RkU29ydEluZGljYXRvciA9IC0xO1xyXG4gICAgICAgIHRoaXMuZ2F0ZVNvcnRJbmRpY2F0b3IgPSAtMTtcclxuICAgICAgICB0aGlzLkRlcGFydHVyZUFycmF5LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgdmFyIHZhbDEgPSBhLkRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgICB2YXIgdmFsMiA9IGIuRGVzdGluYXRpb247XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbDEgKyBcIiBcIiArIHZhbDIpO1xyXG4gICAgICAgICAgICBpZiAoaXNBc2MgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPCB2YWwyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWwxID4gdmFsMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzb3J0R2F0ZSgpIHtcclxuICAgICAgICAvLyB2YXIgaXNBc2M6IG51bWJlciA9IHRoaXMuZ2F0ZVNvcnRJbmRpY2F0b3IgPT0gLTEgPyAwIDogdGhpcy5nYXRlU29ydEluZGljYXRvcjtcclxuICAgICAgICB2YXIgaXNBc2M6IG51bWJlciA9IHRoaXMuZ2F0ZVNvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xyXG4gICAgICAgIHRoaXMuZ2F0ZVNvcnRJbmRpY2F0b3IgPSB0aGlzLmdhdGVTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcclxuICAgICAgICB0aGlzLmZsaWdodFNvcnRJbmRpY2F0b3IgPSAtMTtcclxuICAgICAgICB0aGlzLkV0ZFNvcnRJbmRpY2F0b3IgPSAtMTtcclxuICAgICAgICB0aGlzLlN0YXR1c1NvcnRJbmRpY2F0b3IgPSAtMTtcclxuICAgICAgICB0aGlzLlN0ZFNvcnRJbmRpY2F0b3IgPSAtMTtcclxuICAgICAgICB0aGlzLnRvU29ydEluZGljYXRvciA9IC0xO1xyXG4gICAgICAgIHRoaXMuRGVwYXJ0dXJlQXJyYXkuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICAvLyB2YXIgdmFsMSA9IGEuRGVzdGluYXRpb247XHJcbiAgICAgICAgICAgIC8vIHZhciB2YWwyID0gYi5EZXN0aW5hdGlvbjtcclxuICAgICAgICAgICAgdmFyIHZhbDEgPSBOdW1iZXIoYS5HYXRlLnNwbGl0KC9bYS16QS1aXS8pWzBdKTtcclxuICAgICAgICAgICAgdmFyIHZhbDIgPSBOdW1iZXIoYi5HYXRlLnNwbGl0KC9bYS16QS1aXS8pWzBdKSA9PSBOdW1iZXIuTmFOID8gMCA6IE51bWJlcihiLkdhdGUuc3BsaXQoL1thLXpBLVpdLylbMF0pXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbDEgKyBcIiBcIiArIHZhbDIpO1xyXG4gICAgICAgICAgICBpZiAoaXNBc2MgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPCB2YWwyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWwxID4gdmFsMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc29ydFN0YXR1cygpIHtcclxuICAgICAgICAvLyB2YXIgaXNBc2M6IG51bWJlciA9IHRoaXMuU3RhdHVzU29ydEluZGljYXRvciA9PSAtMSA/IDAgOiB0aGlzLlN0YXR1c1NvcnRJbmRpY2F0b3I7XHJcbiAgICAgICAgdmFyIGlzQXNjOiBudW1iZXIgPSB0aGlzLlN0YXR1c1NvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xyXG4gICAgICAgIHRoaXMuU3RhdHVzU29ydEluZGljYXRvciA9IHRoaXMuU3RhdHVzU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XHJcbiAgICAgICAgdGhpcy5mbGlnaHRTb3J0SW5kaWNhdG9yID0gLTE7XHJcbiAgICAgICAgdGhpcy5FdGRTb3J0SW5kaWNhdG9yID0gLTE7XHJcbiAgICAgICAgdGhpcy50b1NvcnRJbmRpY2F0b3IgPSAtMTtcclxuICAgICAgICB0aGlzLlN0ZFNvcnRJbmRpY2F0b3IgPSAtMTtcclxuICAgICAgICB0aGlzLmdhdGVTb3J0SW5kaWNhdG9yID0gLTE7XHJcbiAgICAgICAgdGhpcy5EZXBhcnR1cmVBcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWwxID0gYS5GbGlnaHRTdGF0dXM7XHJcbiAgICAgICAgICAgIHZhciB2YWwyID0gYi5GbGlnaHRTdGF0dXM7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbDEgKyBcIiBcIiArIHZhbDIpO1xyXG4gICAgICAgICAgICBpZiAoaXNBc2MgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPCB2YWwyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWwxID4gdmFsMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc29ydFNURCgpIHtcclxuICAgICAgICAvLyB2YXIgaXNBc2M6IG51bWJlciA9IHRoaXMuU3RkU29ydEluZGljYXRvciA9PSAtMSA/IDAgOiB0aGlzLlN0ZFNvcnRJbmRpY2F0b3I7XHJcbiAgICAgICAgdmFyIGlzQXNjOiBudW1iZXIgPSB0aGlzLlN0ZFNvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xyXG4gICAgICAgIHRoaXMuU3RkU29ydEluZGljYXRvciA9IHRoaXMuU3RkU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XHJcbiAgICAgICAgdGhpcy50b1NvcnRJbmRpY2F0b3IgPSAtMTtcclxuICAgICAgICB0aGlzLkV0ZFNvcnRJbmRpY2F0b3IgPSAtMTtcclxuICAgICAgICB0aGlzLmZsaWdodFNvcnRJbmRpY2F0b3IgPSAtMTtcclxuICAgICAgICB0aGlzLlN0YXR1c1NvcnRJbmRpY2F0b3IgPSAtMTtcclxuICAgICAgICB0aGlzLmdhdGVTb3J0SW5kaWNhdG9yID0gLTE7XHJcbiAgICAgICAgdGhpcy5EZXBhcnR1cmVBcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdmFsMSA9IE51bWJlcihhLlNURC5yZXBsYWNlKCc6JywgJycpKTtcclxuICAgICAgICAgICAgdmFyIHZhbDIgPSBOdW1iZXIoYi5TVEQucmVwbGFjZSgnOicsICcnKSkgPT0gTnVtYmVyLk5hTiA/IDAgOiBOdW1iZXIoYi5TVEQucmVwbGFjZSgnOicsICcnKSlcclxuICAgICAgICAgICAgY29uc29sZS5sb2codmFsMSArIFwiIFwiICsgdmFsMik7XHJcbiAgICAgICAgICAgIC8vICAgdGhpcy5zb3J0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNBc2MgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPCB2YWwyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWwxID4gdmFsMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzb3J0RVREKCkge1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgIC8vIHZhciBpc0FzYzogbnVtYmVyID0gdGhpcy5FdGRTb3J0SW5kaWNhdG9yID09IC0xID8gMCA6IHRoaXMuRXRkU29ydEluZGljYXRvcjtcclxuICAgICAgICB2YXIgaXNBc2M6IG51bWJlciA9IHRoaXMuRXRkU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XHJcbiAgICAgICAgY29uc29sZS5sb2coaXNBc2MpO1xyXG4gICAgICAgIHRoaXMuRXRkU29ydEluZGljYXRvciA9IHRoaXMuRXRkU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XHJcbiAgICAgICAgdGhpcy50b1NvcnRJbmRpY2F0b3IgPSAtMTtcclxuICAgICAgICB0aGlzLlN0ZFNvcnRJbmRpY2F0b3IgPSAtMTtcclxuICAgICAgICB0aGlzLmZsaWdodFNvcnRJbmRpY2F0b3IgPSAtMTtcclxuICAgICAgICB0aGlzLlN0YXR1c1NvcnRJbmRpY2F0b3IgPSAtMTtcclxuICAgICAgICB0aGlzLmdhdGVTb3J0SW5kaWNhdG9yID0gLTE7XHJcbiAgICAgICAgdGhpcy5EZXBhcnR1cmVBcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKE51bWJlcihhLkVURC50b1N0cmluZygpLnNsaWNlKC8pKSk7XHJcbiAgICAgICAgICAgIHZhciB2YWwxID0gTnVtYmVyKGEuRVRELnJlcGxhY2UoJzonLCAnJykpO1xyXG4gICAgICAgICAgICAvLyBsZXQgdmFsMyA9IGEuRVRELnRvU3RyaW5nKCkuc2xpY2UoOik7XHJcblxyXG4gICAgICAgICAgICB2YXIgdmFsMiA9IE51bWJlcihiLkVURC5yZXBsYWNlKCc6JywgJycpKSA9PSBOdW1iZXIuTmFOID8gMCA6IE51bWJlcihiLkVURC5yZXBsYWNlKCc6JywgJycpKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codmFsMSArIFwiIFwiICsgdmFsMik7XHJcbiAgICAgICAgICAgIC8vICAgdGhpcy5zb3J0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNBc2MgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPCB2YWwyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWwxID4gdmFsMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5EZXBhcnR1cmVBcnJheSk7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGxheXBheGxpc3QoYXJnczogYW55KSB7XHJcbiAgICAgICAgdmFyIHBheCA9IDxEZXBhcnR1cmVJbmZvMS5EZXBhcnR1cmU+YXJncy52aWV3LmJpbmRpbmdDb250ZXh0O1xyXG4gICAgICAgIHRoaXMubmF2aWdhdGVUb1BheExpc3QocGF4LkZsaWdodE51bWJlciwgcGF4KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlQ2hlY2tlZChhcmdzOiBhbnkpIHtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuRGVwYXJ0dXJlQXJyYXkuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgZWxlbWVudC5Jc0NoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgcGF4ID0gPERlcGFydHVyZUluZm8xLkRlcGFydHVyZT5hcmdzLnZpZXcuYmluZGluZ0NvbnRleHQ7XHJcbiAgICAgICAgcGF4LklzQ2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvUGF4TGlzdChwYXguRmxpZ2h0TnVtYmVyLCBwYXgpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2ltcGxlVGFwKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBuYXZpZ2F0ZVRvUGF4TGlzdChwYXJhbTogc3RyaW5nLCBwYXg6IERlcGFydHVyZUluZm8xLkRlcGFydHVyZSkge1xyXG5cclxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiZGVwcGF4bGlzdFwiXSwge1xyXG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBcImRhdGFcIjogcGFyYW0sXHJcbiAgICAgICAgICAgICAgICBcInBheFwiOiBKU09OLnN0cmluZ2lmeShwYXgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG5hdmlnYXRlVG9TZWFyY2goKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNDaGVja2luRGlzYWJsZWQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wic2VhcmNoXCJdLCB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbm5hdmlnYXRlVG9EZXBhcnR1cmVzKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzR2F0ZURpc2FibGVkID09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImRlcGFydGhvbWVcIl0sIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG5hdmlnYXRlVG9TZXR0aW5nKCkge1xyXG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZXR0aW5nXCJdLCB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVUb0xvZ2luKCkge1xyXG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJcIl0sIHtcclxuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlU2VydmljZUVycm9yKGVycm9yOiBhbnkpIHtcclxuICAgICAgICB2YXIgZXJyb3JNZXNzYWdlID0gZXJyb3IudG9TdHJpbmcoKTtcclxuICAgICAgICBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJTZXNzaW9uVGltZW91dFwiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiU2Vzc2lvbiBUaW1lIE91dFwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGJlZW4gdGltZSBvdXRcIixcclxuICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPS1wiXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiXCJdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZXJyb3JNZXNzYWdlKS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVUb0NvbXBlbnNhdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0NvbXBlbnNhdGlvbkVuYWJsZWQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY29tcGVuc2F0aW9uXCJdLCB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJDb21wZW5zYXRpb24gTm90IGFwcGxpY2FibGVcIikuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG4iXX0=