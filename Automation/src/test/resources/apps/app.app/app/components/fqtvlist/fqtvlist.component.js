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
var Toast = require("nativescript-toast");
var moment = require("moment");
var index_1 = require("../../shared/services/index");
var index_2 = require("../../shared/utils/index");
var app_constants_1 = require("../../app.constants");
var app_executiontime_1 = require("../../app.executiontime");
var index_3 = require("../../shared/interface/index");
var FqtvListComponent = /** @class */ (function () {
    function FqtvListComponent(_search, _checkin, page, routerExtensions, router, location, _dataService, activatedRouter, _service, _shared) {
        this._search = _search;
        this._checkin = _checkin;
        this.page = page;
        this.routerExtensions = routerExtensions;
        this.router = router;
        this.location = location;
        this._dataService = _dataService;
        this.activatedRouter = activatedRouter;
        this._service = _service;
        this._shared = _shared;
        this.isCompensationEnabled = false;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.isError = false;
        this.errorMessage = "";
        this.loaderProgress = new index_3.LoaderProgress();
    }
    FqtvListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        console.log("inside fqtv search");
        this.loaderProgress.initLoader(this.pageCont);
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.activatedRouter.queryParams.subscribe(function (params) {
            _this.FQTVArray = JSON.parse(params["data"]);
            _this.searchString = params["fqtvnum"];
            _this.FqtvSearchString = _this.searchString.toLocaleUpperCase();
        });
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled");
        // this.getPaxbyFQTVID(this.searchString);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this._shared.SetBagTag(null);
    };
    FqtvListComponent.prototype.getPaxbyFQTVID = function (id) {
        var _this = this;
        this.loaderProgress.showLoader();
        try {
            var sDate = new Date();
            console.log('SearchPaxByFQTVID Service --------------- Start Date Time : ' + sDate);
            console.log("getPaxbyFQTVID called " + id);
            this._search.SearchPaxByFQTVID(id)
                .subscribe(function (data) {
                _this.FQTVArray = index_2.Converters.ConvertToFQTVTemplate(data);
                if (_this.FQTVArray == null || _this.FQTVArray.length == 0) {
                    var self = _this;
                    Toast.makeText("Record Not Found").show();
                    _this.navigateToSearch();
                }
                _this.loaderProgress.hideLoader();
            }, function (error) {
                var self = _this;
                _this.handleServiceError(error);
                _this.navigateToSearch();
                console.log("Couldnt find information for this OrderID " + error);
            }, function () {
                //console.log('Data Retrievesuccessfully' + this.PassengerDetails);     
                //console.log(this.PassengerArray.length);             
                _this.loaderProgress.hideLoader();
            });
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            var eDate = new Date();
            console.log('SearchPaxByFQTVID Service --------------- End Date Time : ' + eDate);
            console.log('SearchPaxByFQTVID Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    FqtvListComponent.prototype.toggleChecked = function (args) {
        this.FQTVArray.forEach(function (element, index) {
            element.IsChecked = false;
        });
        var pax = args.view.bindingContext;
        pax.IsChecked = true;
        this.orderID = pax.OrderID;
    };
    FqtvListComponent.prototype.GetOrderDetails = function (id) {
        var _this = this;
        this.loaderProgress.showLoader();
        try {
            var sDate = new Date();
            console.log('Get Passenger Service --------------- Start Date Time : ' + sDate);
            this._service.GetPassenger(id)
                .subscribe(function (data) {
                //console.dir(data);
                _this._shared.SetAPISDocument(null);
                _this._shared.SetScanAPISDocument(null);
                if (data.ID != null) {
                    if (data.TicketingStatus != "Not Ticketed" && data.TicketingStatus != "Partially Ticketed" && data.IsOutOfSyncTicket != true) {
                        if (data.Segments != null && data.Segments.length > 0) {
                            var POSLocation = ApplicationSettings.getString("userdetails", "").substr(0, 3);
                            if (data.Segments.filter(function (m) { return m.Origin.AirportCode == POSLocation; }).length > 0 && data.Segments.filter(function (m) { return m.Origin.AirportCode == POSLocation; })[0].Status.isWaitlistedPassenger) {
                                _this._shared.SetIsWaitlisted(true);
                                Toast.makeText("Waitlisted Passenger").show();
                            }
                            else {
                                _this._shared.SetIsWaitlisted(false);
                                console.log("isWaitlistedPassenger : false");
                            }
                        }
                        _this._shared.SetPassenger(data);
                        console.dir(_this._shared.GetPassenger().Passengers[0].Documents);
                        var scTable = _this._shared.GetStartupTable().Tables.SecurityCodeTable;
                        var PassengerArray_1 = index_2.Converters.ConvertToFlightWithPaxTemplate(_this._shared.GetPassenger(), null, scTable, "");
                        if (PassengerArray_1.Segment.length > 0) {
                            var setdepartureDate = moment(PassengerArray_1.Segment[0].DepartureDateTime.toString()).format("YYYY-MM-DD");
                            var setflightnumber = void 0;
                            if (PassengerArray_1.Segment[0].MarketingFlight.substr(0, 2) == "CM") {
                                setflightnumber = PassengerArray_1.Segment[0].MarketingFlight;
                            }
                            else if (PassengerArray_1.Segment[0].OperatingFlight != null && PassengerArray_1.Segment[0].OperatingFlight.substr(0, 2) == "CM") {
                                setflightnumber = PassengerArray_1.Segment[0].OperatingFlight;
                            }
                            else {
                                setflightnumber = PassengerArray_1.Segment[0].MarketingFlight;
                            }
                            var setcity = PassengerArray_1.Segment[0].DepartureCity;
                            PassengerArray_1.Segment.forEach(function (SegEle, SegInndex) {
                                var departureDate = moment(SegEle.DepartureDateTime.toString()).format("YYYY-MM-DD");
                                var flightnumber;
                                if (SegEle.MarketingFlight.substr(0, 2) == "CM") {
                                    flightnumber = SegEle.MarketingFlight;
                                }
                                else if (SegEle.OperatingFlight != null && SegEle.OperatingFlight.substr(0, 2) == "CM") {
                                    flightnumber = SegEle.OperatingFlight;
                                }
                                else {
                                    flightnumber = SegEle.MarketingFlight;
                                }
                                var city = SegEle.DepartureCity;
                                SegEle.date = moment(SegEle.DepartureDateTime.toString()).format("DD-MMM-YYYY");
                                var destination = SegEle.Destination;
                                // //Inventory
                                _this._checkin.BookingCountDisplay(departureDate, flightnumber, city)
                                    .subscribe(function (data) {
                                    var inventory = data;
                                    SegEle.inven = index_2.Converters.ConvertToInventory(inventory);
                                });
                                //Inbound
                                _this._checkin.InBound(departureDate, flightnumber, city)
                                    .subscribe(function (data) {
                                    var inBound = data;
                                    SegEle.inbound = index_2.Converters.ConvertToInBound(inBound);
                                });
                                //Outbound
                                _this._checkin.OutBound(departureDate, flightnumber, destination)
                                    .subscribe(function (data) {
                                    var OutBound = data;
                                    SegEle.outbound = index_2.Converters.ConvertToOutBound(OutBound);
                                });
                                //status
                                var isCompleted = false;
                                _this._dataService.Status(departureDate, flightnumber, city)
                                    .subscribe(function (data) {
                                    if (data.Flights) {
                                        var status_1 = data;
                                        SegEle.status = status_1.Flights[0].Legs[0].Status;
                                        var OriginlocDetails = status_1.Flights[0].Legs.filter(function (m) { return m.DepartureAirport.LocationCode == SegEle.Origin; })[0];
                                        console.log("Flight origin:" + SegEle.Origin);
                                        console.log("Flight origin:" + JSON.stringify(OriginlocDetails));
                                        // if(SegEle.Origin == status.Flights[0].Legs.filter(m=> m.DepartureAirport))
                                        SegEle.Legs = status_1.Flights[0].Legs;
                                        SegEle.ETD = OriginlocDetails.DepartureDateTime.Estimated.toString().substr(11, 5);
                                        SegEle.STD = OriginlocDetails.DepartureDateTime.Scheduled.toString().substr(11, 5);
                                        SegEle.ETA = OriginlocDetails.ArrivalDateTime.Scheduled.toString().substr(11, 5);
                                        console.log(status_1.Flights[0].Legs[0].DepartureDateTime.Estimated.toString().substr(11, 5) + "llll");
                                        var passengerLength = PassengerArray_1.Segment.length - 1;
                                        if (passengerLength == SegInndex) {
                                            _this._shared.SetBagTag(null);
                                            _this._shared.SetSegmentDetail(PassengerArray_1);
                                            var multiplePassenger = 0;
                                            _this.loaderProgress.hideLoader();
                                            _this.navigateToCheckin();
                                        }
                                    }
                                    else {
                                        Toast.makeText(data.Warnings[0].Message).show();
                                        var passengerLength = PassengerArray_1.Segment.length - 1;
                                        if (passengerLength == SegInndex) {
                                            _this._shared.SetBagTag(null);
                                            _this._shared.SetSegmentDetail(PassengerArray_1);
                                            _this.loaderProgress.hideLoader();
                                            _this.navigateToCheckin();
                                        }
                                    }
                                }, function (err) {
                                    console.log(err);
                                    // isErrorOccured = true;
                                    _this.loaderProgress.hideLoader();
                                    _this.handleServiceError(err);
                                });
                            });
                            // this._dataService.GetBaggage(id).subscribe((data) => {
                            //     this._shared.SetBaggagecatalog(data);
                            //     this.loaderProgress.hideLoader();
                            //     this._shared.SetSegmentDetail(PassengerArray);
                            //     this._shared.SetBagTag(null);
                            //     this.navigateToCheckIn();
                            // }, err => {
                            //     this.loaderProgress.hideLoader();
                            //     console.log(err)
                            //     let error: any = { "Errors": [{ "Message": err }], "Success": false }
                            //     this._shared.SetBaggagecatalog(error);                                   
                            //     this._shared.SetSegmentDetail(PassengerArray);
                            //     this._shared.SetBagTag(null);
                            //     this.navigateToCheckIn();
                            // });
                            //Tier
                            // this._dataService.Tier(setdepartureDate, setflightnumber, setcity)
                            //     .subscribe((data) => {
                            //         let tier: any = data;
                            //         this._shared.SetTier(tier);
                            //         this.loaderProgress.hideLoader();
                            //         this._shared.SetSegmentDetail(PassengerArray);
                            //         this.navigateToCheckIn();
                            //     });
                        }
                        else {
                            _this.loaderProgress.hideLoader();
                            if (data.Segments != null && data.Segments.length > 0) {
                                Toast.makeText("Not able to process - go to counter").show();
                            }
                            else {
                                Toast.makeText("No reservations are found").show();
                            }
                        }
                    }
                    else {
                        Toast.makeText("Not able to process - go to counter").show();
                        _this.loaderProgress.hideLoader();
                    }
                }
                else {
                    _this.loaderProgress.hideLoader();
                    if (data.Segments != null && data.Segments.length > 0) {
                        Toast.makeText("Not able to process - go to counter").show();
                    }
                    else {
                        Toast.makeText("No reservations are found").show();
                    }
                }
            }, function (err) {
                console.log(err);
                _this.handleServiceError(err);
                // var errorMessage = err.toString();
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
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('Get Passenger Service --------------- End Date Time : ' + eDate);
            // console.log('Get Passenger Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    FqtvListComponent.prototype.gotoCheckIn = function () {
        this.GetOrderDetails(this.orderID);
    };
    FqtvListComponent.prototype.gotonotify = function () {
        this.routerExtensions.navigate(["notify"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    FqtvListComponent.prototype.navigateToCheckin = function () {
        this.routerExtensions.navigate(["checkin"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "data": this.orderID
            }
        });
    };
    FqtvListComponent.prototype.navigateToItinerary = function () {
        this.routerExtensions.navigate(["checkin"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    FqtvListComponent.prototype.navigateToSearch = function () {
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
    FqtvListComponent.prototype.navigateToDepartures = function () {
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
    FqtvListComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    FqtvListComponent.prototype.handleServiceError = function (error) {
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
    FqtvListComponent.prototype.navigateToCompensation = function () {
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
    ], FqtvListComponent.prototype, "pageCont", void 0);
    FqtvListComponent = __decorate([
        core_1.Component({
            selector: "list-page",
            providers: [index_1.DataService, index_1.PassengerService, app_constants_1.Configuration, index_1.CheckinService, index_1.SearchService],
            templateUrl: "./components/fqtvlist/fqtvlist.component.html",
            styleUrls: ["./components/fqtvlist/fqtvlist.component.css"]
        }),
        __metadata("design:paramtypes", [index_1.SearchService, index_1.CheckinService, page_1.Page, router_2.RouterExtensions, router_1.Router, common_1.Location, index_1.DataService, router_1.ActivatedRoute, index_1.PassengerService, index_1.CheckinOrderService])
    ], FqtvListComponent);
    return FqtvListComponent;
}());
exports.FqtvListComponent = FqtvListComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnF0dmxpc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZnF0dmxpc3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLHNDQUF5RTtBQUN6RSwwQ0FBMkU7QUFDM0UsMENBQTJDO0FBQzNDLHNEQUErRDtBQUUvRCxnQ0FBK0I7QUFHL0Isb0NBQXFDO0FBR3JDLDhCQUE4QjtBQUM5QiwwREFBNEQ7QUFDNUQsMENBQTRDO0FBQzVDLCtCQUFpQztBQUtqQyxxREFBZ0k7QUFDaEksa0RBQXNEO0FBQ3RELHFEQUFvRDtBQUNwRCw2REFBMkQ7QUFDM0Qsc0RBQThEO0FBUzlEO0lBY0ksMkJBQW1CLE9BQXNCLEVBQVMsUUFBd0IsRUFBVSxJQUFVLEVBQVUsZ0JBQWtDLEVBQVUsTUFBYyxFQUFVLFFBQWtCLEVBQVMsWUFBeUIsRUFBVSxlQUErQixFQUFTLFFBQTBCLEVBQVMsT0FBNEI7UUFBOVQsWUFBTyxHQUFQLE9BQU8sQ0FBZTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQWdCO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQVUsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFxQjtRQUwxVSwwQkFBcUIsR0FBWSxLQUFLLENBQUM7UUFDdkMsc0JBQWlCLEdBQVksS0FBSyxDQUFDO1FBQ25DLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBSW5DLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxz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QztBQXJaWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvL2FuZ3VsYXIgJiBuYXRpdmVzY3JpcHQgcmVmZXJlbmNlc1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBFbGVtZW50UmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uRXh0cmFzLCBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlQXJyYXkgfSBmcm9tIFwiZGF0YS9vYnNlcnZhYmxlLWFycmF5XCI7XHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBHZXN0dXJlRXZlbnREYXRhIH0gZnJvbSBcInVpL2dlc3R1cmVzXCI7XHJcbmltcG9ydCB7IExpc3RWaWV3LCBJdGVtRXZlbnREYXRhIH0gZnJvbSBcInVpL2xpc3Qtdmlld1wiO1xyXG5pbXBvcnQgKiBhcyBkaWFsb2dzIGZyb20gXCJ1aS9kaWFsb2dzXCJcclxuaW1wb3J0ICogYXMgZ2VzdHVyZXMgZnJvbSBcInVpL2dlc3R1cmVzXCI7XHJcblxyXG4vL2V4dGVybmFsIG1vZHVsZXMgYW5kIHBsdWdpbnNcclxuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcclxuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcclxuXHJcbi8vYXBwIHJlZmVyZW5jZXNcclxuaW1wb3J0IHsgRlFUViwgT3JkZXIgfSBmcm9tICcuLi8uLi9zaGFyZWQvbW9kZWwvaW5kZXgnO1xyXG5pbXBvcnQgeyBGUVRWSW5mbyB9IGZyb20gXCIuLi8uLi9zaGFyZWQvaW50ZXJmYWNlL2luZGV4XCI7XHJcbmltcG9ydCB7IERhdGFTZXJ2aWNlLCBDaGVja2luT3JkZXJTZXJ2aWNlLCBQYXNzZW5nZXJTZXJ2aWNlLCBDaGVja2luU2VydmljZSwgU2VhcmNoU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvaW5kZXhcIjtcclxuaW1wb3J0IHsgQ29udmVydGVycyB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uLy4uL2FwcC5jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBBcHBFeGVjdXRpb250aW1lIH0gZnJvbSBcIi4uLy4uL2FwcC5leGVjdXRpb250aW1lXCI7XHJcbmltcG9ydCB7IExvYWRlclByb2dyZXNzIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2ludGVyZmFjZS9pbmRleCc7XHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6IFwibGlzdC1wYWdlXCIsXHJcbiAgICBwcm92aWRlcnM6IFtEYXRhU2VydmljZSwgUGFzc2VuZ2VyU2VydmljZSwgQ29uZmlndXJhdGlvbiwgQ2hlY2tpblNlcnZpY2UsIFNlYXJjaFNlcnZpY2VdLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9jb21wb25lbnRzL2ZxdHZsaXN0L2ZxdHZsaXN0LmNvbXBvbmVudC5odG1sXCIsXHJcbiAgICBzdHlsZVVybHM6IFtcIi4vY29tcG9uZW50cy9mcXR2bGlzdC9mcXR2bGlzdC5jb21wb25lbnQuY3NzXCJdXHJcbn0pXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEZxdHZMaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICAgIGlzRXJyb3I6IGJvb2xlYW47XHJcbiAgICBlcnJvck1lc3NhZ2U6IHN0cmluZztcclxuICAgIHB1YmxpYyBGUVRWQXJyYXk6IEFycmF5PEZRVFZJbmZvPjtcclxuICAgIHB1YmxpYyBzZWFyY2hTdHJpbmc6IHN0cmluZztcclxuICAgIHB1YmxpYyB1c2VyZGV0YWlsczogYW55O1xyXG4gICAgcHVibGljIGxvYWRlclByb2dyZXNzOiBMb2FkZXJQcm9ncmVzcztcclxuICAgIHB1YmxpYyBvcmRlcklEOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgRnF0dlNlYXJjaFN0cmluZzogc3RyaW5nO1xyXG4gICAgcHVibGljIGlzQ29tcGVuc2F0aW9uRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzQ2hlY2tpbkRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNHYXRlRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIEBWaWV3Q2hpbGQoJ3BhZ2Vjb250YWluZXInKSBwYWdlQ29udDogRWxlbWVudFJlZjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgX3NlYXJjaDogU2VhcmNoU2VydmljZSwgcHVibGljIF9jaGVja2luOiBDaGVja2luU2VydmljZSwgcHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uLCBwdWJsaWMgX2RhdGFTZXJ2aWNlOiBEYXRhU2VydmljZSwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZXI6IEFjdGl2YXRlZFJvdXRlLCBwdWJsaWMgX3NlcnZpY2U6IFBhc3NlbmdlclNlcnZpY2UsIHB1YmxpYyBfc2hhcmVkOiBDaGVja2luT3JkZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MgPSBuZXcgTG9hZGVyUHJvZ3Jlc3MoKTtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICB0aGlzLnBhZ2Uuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJ34vaW1hZ2VzL2xvZ2luX2JhY2suanBlZycpXCI7XHJcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRTaXplID0gXCJjb3ZlciBcIjtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImluc2lkZSBmcXR2IHNlYXJjaFwiKTtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmluaXRMb2FkZXIodGhpcy5wYWdlQ29udCk7XHJcbiAgICAgICAgdGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNoZWNraW5EaXNhYmxlZFwiLCApO1xyXG4gICAgICAgIHRoaXMuaXNHYXRlRGlzYWJsZWQgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJnYXRlRGlzYWJsZWRcIiwgKTtcclxuICAgICAgICB0aGlzLmFjdGl2YXRlZFJvdXRlci5xdWVyeVBhcmFtcy5zdWJzY3JpYmUoKHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLkZRVFZBcnJheSA9IEpTT04ucGFyc2UocGFyYW1zW1wiZGF0YVwiXSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoU3RyaW5nID0gcGFyYW1zW1wiZnF0dm51bVwiXTtcclxuICAgICAgICAgICAgdGhpcy5GcXR2U2VhcmNoU3RyaW5nID0gdGhpcy5zZWFyY2hTdHJpbmcudG9Mb2NhbGVVcHBlckNhc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmlzQ29tcGVuc2F0aW9uRW5hYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNvbXBlbnNhdGlvbkVuYWJsZWRcIiwgKTtcclxuICAgICAgICAvLyB0aGlzLmdldFBheGJ5RlFUVklEKHRoaXMuc2VhcmNoU3RyaW5nKTtcclxuICAgICAgICB0aGlzLnVzZXJkZXRhaWxzID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VyZGV0YWlsc1wiLCBcIlwiKTtcclxuICAgICAgICB0aGlzLl9zaGFyZWQuU2V0QmFnVGFnKG51bGwpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGF4YnlGUVRWSUQoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWFyY2hQYXhCeUZRVFZJRCBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBTdGFydCBEYXRlIFRpbWUgOiAnICsgc0RhdGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImdldFBheGJ5RlFUVklEIGNhbGxlZCBcIiArIGlkKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VhcmNoLlNlYXJjaFBheEJ5RlFUVklEKGlkKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRlFUVkFycmF5ID0gQ29udmVydGVycy5Db252ZXJ0VG9GUVRWVGVtcGxhdGUoPEZRVFYuUm9vdE9iamVjdD5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5GUVRWQXJyYXkgPT0gbnVsbCB8fCB0aGlzLkZRVFZBcnJheS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiUmVjb3JkIE5vdCBGb3VuZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGVUb1NlYXJjaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvU2VhcmNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZG50IGZpbmQgaW5mb3JtYXRpb24gZm9yIHRoaXMgT3JkZXJJRCBcIiArIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnRGF0YSBSZXRyaWV2ZXN1Y2Nlc3NmdWxseScgKyB0aGlzLlBhc3NlbmdlckRldGFpbHMpOyAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLlBhc3NlbmdlckFycmF5Lmxlbmd0aCk7ICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgIHZhciBlRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWFyY2hQYXhCeUZRVFZJRCBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlYXJjaFBheEJ5RlFUVklEIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZUNoZWNrZWQoYXJnczogSXRlbUV2ZW50RGF0YSkge1xyXG4gICAgICAgIHRoaXMuRlFUVkFycmF5LmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuSXNDaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIHBheCA9IDxGUVRWSW5mbz5hcmdzLnZpZXcuYmluZGluZ0NvbnRleHQ7XHJcbiAgICAgICAgcGF4LklzQ2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5vcmRlcklEID0gcGF4Lk9yZGVySUQ7XHJcbiAgICB9XHJcblxyXG4gICAgR2V0T3JkZXJEZXRhaWxzKGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IFBhc3NlbmdlciBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBTdGFydCBEYXRlIFRpbWUgOiAnICsgc0RhdGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLkdldFBhc3NlbmdlcihpZClcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmRpcihkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0QVBJU0RvY3VtZW50KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRTY2FuQVBJU0RvY3VtZW50KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLklEICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuVGlja2V0aW5nU3RhdHVzICE9IFwiTm90IFRpY2tldGVkXCIgJiYgZGF0YS5UaWNrZXRpbmdTdGF0dXMgIT0gXCJQYXJ0aWFsbHkgVGlja2V0ZWRcIiAmJiBkYXRhLklzT3V0T2ZTeW5jVGlja2V0ICE9IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlNlZ21lbnRzICE9IG51bGwgJiYgZGF0YS5TZWdtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFBPU0xvY2F0aW9uID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VyZGV0YWlsc1wiLCBcIlwiKS5zdWJzdHIoMCwgMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuU2VnbWVudHMuZmlsdGVyKG0gPT4gbS5PcmlnaW4uQWlycG9ydENvZGUgPT0gUE9TTG9jYXRpb24pLmxlbmd0aCA+IDAgJiYgZGF0YS5TZWdtZW50cy5maWx0ZXIobSA9PiBtLk9yaWdpbi5BaXJwb3J0Q29kZSA9PSBQT1NMb2NhdGlvbilbMF0uU3RhdHVzLmlzV2FpdGxpc3RlZFBhc3Nlbmdlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0SXNXYWl0bGlzdGVkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIldhaXRsaXN0ZWQgUGFzc2VuZ2VyXCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRJc1dhaXRsaXN0ZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlzV2FpdGxpc3RlZFBhc3NlbmdlciA6IGZhbHNlXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFBhc3Nlbmdlcig8T3JkZXIuUm9vdE9iamVjdD5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKS5QYXNzZW5nZXJzWzBdLkRvY3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2NUYWJsZTogYW55W10gPSB0aGlzLl9zaGFyZWQuR2V0U3RhcnR1cFRhYmxlKCkuVGFibGVzLlNlY3VyaXR5Q29kZVRhYmxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IFBhc3NlbmdlckFycmF5OiBhbnkgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb0ZsaWdodFdpdGhQYXhUZW1wbGF0ZSh0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCksIG51bGwsIHNjVGFibGUsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFBhc3NlbmdlckFycmF5LlNlZ21lbnQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZXRkZXBhcnR1cmVEYXRlOiBzdHJpbmcgPSBtb21lbnQoUGFzc2VuZ2VyQXJyYXkuU2VnbWVudFswXS5EZXBhcnR1cmVEYXRlVGltZS50b1N0cmluZygpKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZXRmbGlnaHRudW1iZXI6IHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoUGFzc2VuZ2VyQXJyYXkuU2VnbWVudFswXS5NYXJrZXRpbmdGbGlnaHQuc3Vic3RyKDAsIDIpID09IFwiQ01cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRmbGlnaHRudW1iZXIgPSBQYXNzZW5nZXJBcnJheS5TZWdtZW50WzBdLk1hcmtldGluZ0ZsaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoUGFzc2VuZ2VyQXJyYXkuU2VnbWVudFswXS5PcGVyYXRpbmdGbGlnaHQgIT0gbnVsbCAmJiBQYXNzZW5nZXJBcnJheS5TZWdtZW50WzBdLk9wZXJhdGluZ0ZsaWdodC5zdWJzdHIoMCwgMikgPT0gXCJDTVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldGZsaWdodG51bWJlciA9IFBhc3NlbmdlckFycmF5LlNlZ21lbnRbMF0uT3BlcmF0aW5nRmxpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0ZmxpZ2h0bnVtYmVyID0gUGFzc2VuZ2VyQXJyYXkuU2VnbWVudFswXS5NYXJrZXRpbmdGbGlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNldGNpdHk6IHN0cmluZyA9IFBhc3NlbmdlckFycmF5LlNlZ21lbnRbMF0uRGVwYXJ0dXJlQ2l0eTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGFzc2VuZ2VyQXJyYXkuU2VnbWVudC5mb3JFYWNoKChTZWdFbGUsIFNlZ0lubmRleCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRlcGFydHVyZURhdGU6IHN0cmluZyA9IG1vbWVudChTZWdFbGUuRGVwYXJ0dXJlRGF0ZVRpbWUudG9TdHJpbmcoKSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZsaWdodG51bWJlcjogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoU2VnRWxlLk1hcmtldGluZ0ZsaWdodC5zdWJzdHIoMCwgMikgPT0gXCJDTVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHRudW1iZXIgPSBTZWdFbGUuTWFya2V0aW5nRmxpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFNlZ0VsZS5PcGVyYXRpbmdGbGlnaHQgIT0gbnVsbCAmJiBTZWdFbGUuT3BlcmF0aW5nRmxpZ2h0LnN1YnN0cigwLCAyKSA9PSBcIkNNXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodG51bWJlciA9IFNlZ0VsZS5PcGVyYXRpbmdGbGlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlnaHRudW1iZXIgPSBTZWdFbGUuTWFya2V0aW5nRmxpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaXR5OiBzdHJpbmcgPSBTZWdFbGUuRGVwYXJ0dXJlQ2l0eTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VnRWxlLmRhdGUgPSBtb21lbnQoU2VnRWxlLkRlcGFydHVyZURhdGVUaW1lLnRvU3RyaW5nKCkpLmZvcm1hdChcIkRELU1NTS1ZWVlZXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVzdGluYXRpb24gPSBTZWdFbGUuRGVzdGluYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vSW52ZW50b3J5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNraW4uQm9va2luZ0NvdW50RGlzcGxheShkZXBhcnR1cmVEYXRlLCBmbGlnaHRudW1iZXIsIGNpdHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGludmVudG9yeTogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWdFbGUuaW52ZW4gPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb0ludmVudG9yeShpbnZlbnRvcnkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0luYm91bmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tpbi5JbkJvdW5kKGRlcGFydHVyZURhdGUsIGZsaWdodG51bWJlciwgY2l0eSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5Cb3VuZDogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWdFbGUuaW5ib3VuZCA9IENvbnZlcnRlcnMuQ29udmVydFRvSW5Cb3VuZChpbkJvdW5kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL091dGJvdW5kXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNraW4uT3V0Qm91bmQoZGVwYXJ0dXJlRGF0ZSwgZmxpZ2h0bnVtYmVyLCBkZXN0aW5hdGlvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgT3V0Qm91bmQ6IGFueSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VnRWxlLm91dGJvdW5kID0gQ29udmVydGVycy5Db252ZXJ0VG9PdXRCb3VuZChPdXRCb3VuZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zdGF0dXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzQ29tcGxldGVkIDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kYXRhU2VydmljZS5TdGF0dXMoZGVwYXJ0dXJlRGF0ZSwgZmxpZ2h0bnVtYmVyLCBjaXR5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5GbGlnaHRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGF0dXM6IGFueSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5zdGF0dXMgPSBzdGF0dXMuRmxpZ2h0c1swXS5MZWdzWzBdLlN0YXR1cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IE9yaWdpbmxvY0RldGFpbHMgPSBzdGF0dXMuRmxpZ2h0c1swXS5MZWdzLmZpbHRlcihtID0+IG0uRGVwYXJ0dXJlQWlycG9ydC5Mb2NhdGlvbkNvZGUgPT0gU2VnRWxlLk9yaWdpbilbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmxpZ2h0IG9yaWdpbjpcIiArIFNlZ0VsZS5PcmlnaW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZsaWdodCBvcmlnaW46XCIgKyBKU09OLnN0cmluZ2lmeShPcmlnaW5sb2NEZXRhaWxzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmKFNlZ0VsZS5PcmlnaW4gPT0gc3RhdHVzLkZsaWdodHNbMF0uTGVncy5maWx0ZXIobT0+IG0uRGVwYXJ0dXJlQWlycG9ydCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5MZWdzID0gc3RhdHVzLkZsaWdodHNbMF0uTGVncztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VnRWxlLkVURCA9IE9yaWdpbmxvY0RldGFpbHMuRGVwYXJ0dXJlRGF0ZVRpbWUuRXN0aW1hdGVkLnRvU3RyaW5nKCkuc3Vic3RyKDExLCA1KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VnRWxlLlNURCA9IE9yaWdpbmxvY0RldGFpbHMuRGVwYXJ0dXJlRGF0ZVRpbWUuU2NoZWR1bGVkLnRvU3RyaW5nKCkuc3Vic3RyKDExLCA1KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VnRWxlLkVUQSA9IE9yaWdpbmxvY0RldGFpbHMuQXJyaXZhbERhdGVUaW1lLlNjaGVkdWxlZC50b1N0cmluZygpLnN1YnN0cigxMSwgNSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdGF0dXMuRmxpZ2h0c1swXS5MZWdzWzBdLkRlcGFydHVyZURhdGVUaW1lLkVzdGltYXRlZC50b1N0cmluZygpLnN1YnN0cigxMSwgNSkgKyBcImxsbGxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXNzZW5nZXJMZW5ndGggPSBQYXNzZW5nZXJBcnJheS5TZWdtZW50Lmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXNzZW5nZXJMZW5ndGggPT0gU2VnSW5uZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0QmFnVGFnKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFNlZ21lbnREZXRhaWwoUGFzc2VuZ2VyQXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG11bHRpcGxlUGFzc2VuZ2VyOiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvQ2hlY2tpbigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGRhdGEuV2FybmluZ3NbMF0uTWVzc2FnZSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFzc2VuZ2VyTGVuZ3RoID0gUGFzc2VuZ2VyQXJyYXkuU2VnbWVudC5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFzc2VuZ2VyTGVuZ3RoID09IFNlZ0lubmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldEJhZ1RhZyhudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRTZWdtZW50RGV0YWlsKFBhc3NlbmdlckFycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvQ2hlY2tpbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpc0Vycm9yT2NjdXJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5fZGF0YVNlcnZpY2UuR2V0QmFnZ2FnZShpZCkuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuX3NoYXJlZC5TZXRCYWdnYWdlY2F0YWxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuX3NoYXJlZC5TZXRTZWdtZW50RGV0YWlsKFBhc3NlbmdlckFycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5fc2hhcmVkLlNldEJhZ1RhZyhudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5uYXZpZ2F0ZVRvQ2hlY2tJbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0sIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGxldCBlcnJvcjogYW55ID0geyBcIkVycm9yc1wiOiBbeyBcIk1lc3NhZ2VcIjogZXJyIH1dLCBcIlN1Y2Nlc3NcIjogZmFsc2UgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLl9zaGFyZWQuU2V0QmFnZ2FnZWNhdGFsb2coZXJyb3IpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuX3NoYXJlZC5TZXRTZWdtZW50RGV0YWlsKFBhc3NlbmdlckFycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5fc2hhcmVkLlNldEJhZ1RhZyhudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5uYXZpZ2F0ZVRvQ2hlY2tJbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RpZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLl9kYXRhU2VydmljZS5UaWVyKHNldGRlcGFydHVyZURhdGUsIHNldGZsaWdodG51bWJlciwgc2V0Y2l0eSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgbGV0IHRpZXI6IGFueSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLl9zaGFyZWQuU2V0VGllcih0aWVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFNlZ21lbnREZXRhaWwoUGFzc2VuZ2VyQXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvQ2hlY2tJbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5TZWdtZW50cyAhPSBudWxsICYmIGRhdGEuU2VnbWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk5vdCBhYmxlIHRvIHByb2Nlc3MgLSBnbyB0byBjb3VudGVyXCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk5vIHJlc2VydmF0aW9ucyBhcmUgZm91bmRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiTm90IGFibGUgdG8gcHJvY2VzcyAtIGdvIHRvIGNvdW50ZXJcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5TZWdtZW50cyAhPSBudWxsICYmIGRhdGEuU2VnbWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJOb3QgYWJsZSB0byBwcm9jZXNzIC0gZ28gdG8gY291bnRlclwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk5vIHJlc2VydmF0aW9ucyBhcmUgZm91bmRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB2YXIgZXJyb3JNZXNzYWdlID0gZXJyLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIChlcnJvck1lc3NhZ2UuaW5kZXhPZihcIlVucmVjb2duaXplZCB0b2tlbiAnPCdcIikgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRpdGxlOiBcIlNlc3Npb24gVGltZSBPdXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBtZXNzYWdlOiBcIllvdXIgc2Vzc2lvbiBoYXMgYmVlbiB0aW1lIG91dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPS1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgZGlhbG9ncy5hbGVydChvcHRpb25zKS50aGVuKCgpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvbG9naW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IFBhc3NlbmdlciBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ0dldCBQYXNzZW5nZXIgU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlRGF0ZSkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdvdG9DaGVja0luKCkge1xyXG5cclxuICAgICAgICB0aGlzLkdldE9yZGVyRGV0YWlscyh0aGlzLm9yZGVySUQpO1xyXG4gICAgfVxyXG5cclxuICAgIGdvdG9ub3RpZnkoKSB7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIm5vdGlmeVwiXSwge1xyXG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBuYXZpZ2F0ZVRvQ2hlY2tpbigpIHtcclxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY2hlY2tpblwiXSwge1xyXG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBcImRhdGFcIjogdGhpcy5vcmRlcklEXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBuYXZpZ2F0ZVRvSXRpbmVyYXJ5KCkge1xyXG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJjaGVja2luXCJdLCB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG5hdmlnYXRlVG9TZWFyY2goKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNDaGVja2luRGlzYWJsZWQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wic2VhcmNoXCJdLCB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBuYXZpZ2F0ZVRvRGVwYXJ0dXJlcygpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0dhdGVEaXNhYmxlZCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJkZXBhcnRob21lXCJdLCB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBuYXZpZ2F0ZVRvU2V0dGluZygpIHtcclxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wic2V0dGluZ1wiXSwge1xyXG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcjogYW55KSB7XHJcbiAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IGVycm9yLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgaWYgKGVycm9yTWVzc2FnZS5pbmRleE9mKFwiU2Vzc2lvblRpbWVvdXRcIikgPiAtMSkge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIlNlc3Npb24gVGltZSBPdXRcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiWW91ciBzZXNzaW9uIGhhcyBiZWVuIHRpbWUgb3V0XCIsXHJcbiAgICAgICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBkaWFsb2dzLmFsZXJ0KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIlwiXSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChlcnJvck1lc3NhZ2UpLnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBuYXZpZ2F0ZVRvQ29tcGVuc2F0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzQ29tcGVuc2F0aW9uRW5hYmxlZCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJjb21wZW5zYXRpb25cIl0sIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiQ29tcGVuc2F0aW9uIE5vdCBhcHBsaWNhYmxlXCIpLnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19