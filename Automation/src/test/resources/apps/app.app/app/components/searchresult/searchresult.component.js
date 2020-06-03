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
//app references
var index_1 = require("../../shared/interface/index");
var index_2 = require("../../shared/model/index");
var index_3 = require("../../shared/services/index");
var index_4 = require("../../shared/utils/index");
var app_constants_1 = require("../../app.constants");
var SearchResultComponent = /** @class */ (function () {
    function SearchResultComponent(_checkin, page, _timeoutService, routerExtensions, _dataService, router, location, activatedRouter, _shared, _service) {
        this._checkin = _checkin;
        this.page = page;
        this._timeoutService = _timeoutService;
        this.routerExtensions = routerExtensions;
        this._dataService = _dataService;
        this.router = router;
        this.location = location;
        this.activatedRouter = activatedRouter;
        this._shared = _shared;
        this._service = _service;
        this.checkedCount = 0;
        this.PassengerList = [];
        this.SearchFields = new index_2.Search();
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.isCompensationEnabled = false;
        this.isError = false;
        this.errorMessage = "";
        this.paxList = [];
        this.loaderProgress = new index_1.LoaderProgress();
    }
    SearchResultComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.loaderProgress.initLoader(this.pageCont);
        this.loaderProgress.showLoader('Loading Data...');
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.activatedRouter.queryParams.subscribe(function (params) {
            if (params["profile"] != null && params["profile"] != "" && params["profile"] != "undefined") {
                _this.Profile = params["profile"];
            }
        });
        // this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled", );
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled");
        this.getPassangerList();
        this._shared.SetBagTag(null);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.loaderProgress.hideLoader();
        var label = this.pageCont.nativeElement;
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();
        });
    };
    SearchResultComponent.prototype.getPassangerList = function () {
        var _this = this;
        this.location.subscribe(function () {
            _this.SearchFields = JSON.parse(ApplicationSettings.getString("searchdata", ""));
            _this.activatedRouter.queryParams.subscribe(function (params) {
                _this.PassengerList = JSON.parse(params["data"]);
            });
        });
        this.SearchFields = JSON.parse(ApplicationSettings.getString("searchdata", ""));
        this.activatedRouter.queryParams.subscribe(function (params) {
            _this.PassengerList = JSON.parse(params["data"]);
        });
        // let multiplePassenger:number = 0;
        // this.PassengerList.forEach((pass,index)=>{
        //     if(this._shared.GetAPISDocument()!=null)
        //     {
        //         if (this._shared.GetAPISDocument().Firstname.replace(" ", "") == this.SuffixCheck(pass.FirstName) && this._shared.GetAPISDocument().Surname.replace(" ", "") == pass.LastName) {
        //             multiplePassenger++;
        //         }
        //     }
        // });
        // if(multiplePassenger > 1)
        // {
        //     Toast.makeText("Multiple match found. Scanned data is ignored").show();
        //     this._shared.SetAPISDocument(null);
        // }
    };
    SearchResultComponent.prototype.SuffixCheck = function (firstName) {
        var suffixList = firstName.split(this._shared.GetAPISDocument().Firstname.replace(" ", ""));
        var givenName = '';
        if (suffixList.length > 1) {
            givenName = this._shared.GetAPISDocument().Firstname.replace(" ", "");
        }
        else {
            givenName = firstName;
        }
        return givenName;
    };
    SearchResultComponent.prototype.GetOrderDetails = function (id) {
        var _this = this;
        this.loaderProgress.showLoader();
        try {
            var sDate = new Date();
            console.log('Get Passenger Service --------------- Start Date Time : ' + sDate);
            this._service.GetPassenger(id)
                .subscribe(function (data) {
                //console.dir(data);
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
                        var PassengerArray_1 = index_4.Converters.ConvertToFlightWithPaxTemplate(_this._shared.GetPassenger(), null, scTable, "");
                        if (PassengerArray_1.Segment.length > 0) {
                            var setdepartureDate = moment(PassengerArray_1.Segment[0].DepartureDateTime.toString()).format("YYYY-MM-DD");
                            var setflightnumber = PassengerArray_1.Segment[0].MarketingFlight;
                            var setcity = PassengerArray_1.Segment[0].DepartureCity;
                            PassengerArray_1.Segment.forEach(function (SegEle, SegInndex) {
                                var departureDate = moment(SegEle.DepartureDateTime.toString()).format("YYYY-MM-DD");
                                var flightnumber = SegEle.MarketingFlight;
                                var city = SegEle.DepartureCity;
                                SegEle.date = moment(SegEle.DepartureDateTime.toString()).format("DD-MMM-YYYY");
                                var destination = SegEle.Destination;
                                // //Inventory
                                _this._checkin.BookingCountDisplay(departureDate, flightnumber, city)
                                    .subscribe(function (data) {
                                    var inventory = data;
                                    SegEle.inven = index_4.Converters.ConvertToInventory(inventory);
                                });
                                //Inbound
                                _this._checkin.InBound(departureDate, flightnumber, city)
                                    .subscribe(function (data) {
                                    var inBound = data;
                                    SegEle.inbound = index_4.Converters.ConvertToInBound(inBound);
                                });
                                //Outbound
                                _this._checkin.OutBound(departureDate, flightnumber, destination)
                                    .subscribe(function (data) {
                                    var OutBound = data;
                                    SegEle.outbound = index_4.Converters.ConvertToOutBound(OutBound);
                                });
                                //status
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
                                            var multiplePassenger_1 = 0;
                                            _this._shared.GetPassenger().Passengers.forEach(function (pass, index) {
                                                if (_this._shared.GetAPISDocument() != null) {
                                                    if (_this._shared.GetAPISDocument().Firstname.replace(" ", "") == _this.SuffixCheck(pass.Firstname) && _this._shared.GetAPISDocument().Surname.replace(" ", "") == pass.Lastname) {
                                                        multiplePassenger_1++;
                                                    }
                                                }
                                            });
                                            if (multiplePassenger_1 > 1) {
                                                Toast.makeText("Multiple match found. Scanned data is ignored").show();
                                                _this._shared.SetAPISDocument(null);
                                            }
                                            else {
                                                _this.loaderProgress.hideLoader();
                                                _this.navigateToCheckin();
                                            }
                                        }
                                    }
                                    else {
                                        Toast.makeText(data.Warnings[0].Message).show();
                                        var passengerLength = PassengerArray_1.Segment.length - 1;
                                        if (passengerLength == SegInndex) {
                                            _this._shared.SetBagTag(null);
                                            _this._shared.SetSegmentDetail(PassengerArray_1);
                                            var multiplePassenger_2 = 0;
                                            _this._shared.GetPassenger().Passengers.forEach(function (pass, index) {
                                                if (_this._shared.GetAPISDocument() != null) {
                                                    if (_this._shared.GetAPISDocument().Firstname.replace(" ", "") == _this.SuffixCheck(pass.Firstname) && _this._shared.GetAPISDocument().Surname.replace(" ", "") == pass.Lastname) {
                                                        multiplePassenger_2++;
                                                    }
                                                }
                                            });
                                            if (multiplePassenger_2 > 1) {
                                                Toast.makeText("Multiple match found. Scanned data is ignored").show();
                                                _this._shared.SetAPISDocument(null);
                                            }
                                            else {
                                                _this.loaderProgress.hideLoader();
                                                _this.navigateToCheckin();
                                            }
                                        }
                                    }
                                }, function (err) {
                                    console.log(err);
                                    _this.loaderProgress.hideLoader();
                                    _this.handleServiceError(err);
                                });
                            });
                            // this._dataService.GetBaggage(id).subscribe((data) => {
                            //     this._shared.SetBaggagecatalog(data);
                            // });
                            //Tier
                            // this._dataService.Tier(setdepartureDate, setflightnumber, setcity)
                            //     .subscribe((data) => {
                            //         let tier: any = data;
                            //         this._shared.SetTier(tier);
                            //         this.loaderProgress.hideLoader();
                            //         this._shared.SetSegmentDetail(PassengerArray);
                            //         this.navigateToCheckin();
                            //     });
                        }
                        else {
                            _this.loaderProgress.hideLoader();
                            Toast.makeText("No reservations are found").show();
                        }
                    }
                    else {
                        Toast.makeText("Not able to process - go to counter").show();
                        _this.loaderProgress.hideLoader();
                    }
                }
                else {
                    _this.loaderProgress.hideLoader();
                    Toast.makeText("No reservations are found").show();
                }
            }, function (err) {
                console.log(err);
                _this.handleServiceError(err);
                // if (err.indexOf("Unrecognized token '<'") != -1) {
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
    // GetOrderDetails(id: string): void {
    //     this.loaderProgress.showLoader();
    //     try {
    //         var sDate = new Date();
    //         console.log('Get Passenger Service --------------- Start Date Time : ' + sDate);
    //         this._service.GetPassenger(id)
    //             .subscribe(data => {
    //                 this._shared.SetPassenger(<Order.RootObject>data);
    //                 let PassengerArray: any = Converters.ConvertToPassengerTemplate(this._shared.GetPassenger(), null);
    //                 if (PassengerArray.length > 0) {
    //                     let departureDate: string = moment(PassengerArray[0].FlightDetails[0].DepartureDateTime.toString()).format("YYYY-MM-DD");
    //                     let flightnumber: string = PassengerArray[0].FlightDetails[0].MarketingFlight;
    //                     let city: string = PassengerArray[0].FlightDetails[0].DepartureCity;
    //                     //Inventory
    //                     this._dataService.Inventory(departureDate, flightnumber)
    //                         .subscribe((data) => {
    //                             let inventory: any = data;
    //                             this._shared.SetInventory(inventory);
    //                         })
    //                     //Inbound
    //                     this._dataService.InBound(departureDate, flightnumber, city)
    //                         .subscribe((data) => {
    //                             let inBound: any = data;
    //                             this._shared.SetInbound(inBound);
    //                         })
    //                     //Outbound
    //                     this._dataService.OutBound(departureDate, flightnumber, city)
    //                         .subscribe((data) => {
    //                             let OutBound: any = data;
    //                             this._shared.SetOutbound(OutBound);
    //                         })
    //                     //status
    //                     this._dataService.Status(departureDate, flightnumber)
    //                         .subscribe((data) => {
    //                             let status: any = data;
    //                             this._shared.SetStatus(status);
    //                         })
    //                     //Tier
    //                     this._dataService.Tier(departureDate, flightnumber, city)
    //                         .subscribe((data) => {
    //                             this._shared.SetTier(data);
    //                             this.loaderProgress.hideLoader();
    //                             this.navigateToCheckin();
    //                         });
    //                 }
    //                 else {
    //                     this.loaderProgress.hideLoader();
    //                     Toast.makeText("Record Not Found").show();
    //                 }
    //             },
    //             err => {
    //                 console.log(err)
    //                 this.loaderProgress.hideLoader();
    //             });
    //     }
    //     catch (error) {
    //         console.log(error.message);
    //         this.loaderProgress.hideLoader();
    //     }
    //     finally {
    //         var eDate = new Date();
    //         console.log('Get Passenger Service --------------- End Date Time : ' + eDate);
    //     }
    // }
    SearchResultComponent.prototype.toggleChecked = function (args) {
        var pax = args.view.bindingContext;
        if (pax.IsChecked) {
            pax.IsChecked = false;
            this.checkedCount--;
        }
        else {
            if (this.orderID) {
                this.checkedCount++;
                if (pax.OrderID === this.orderID) {
                    pax.IsChecked = true;
                }
                else {
                    this.orderID = pax.OrderID;
                    this.PassengerList.forEach(function (element, index) {
                        element.IsChecked = false;
                    });
                    pax.IsChecked = true;
                    this.checkedCount = 1;
                }
            }
            else {
                this.orderID = pax.OrderID;
                pax.IsChecked = true;
                this.checkedCount++;
            }
        }
        console.log("checkedCount: " + this.checkedCount);
    };
    SearchResultComponent.prototype.navigateToSearch = function () {
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
    SearchResultComponent.prototype.navigateToDepartures = function () {
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
    SearchResultComponent.prototype.navigateTologin = function () {
        this.routerExtensions.navigate([""], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    SearchResultComponent.prototype.gotoCheckin = function () {
        if (this.checkedCount > 0) {
            var PaxList = Array();
            PaxList = [];
            this.PassengerList.forEach(function (element, index) {
                if (element.IsChecked)
                    PaxList.push(element);
            });
            this.GetOrderDetails(this.orderID);
        }
        else {
            Toast.makeText("Please select atleast one Passengers").show();
        }
    };
    SearchResultComponent.prototype.navigateToCheckin = function () {
        var profile = this.Profile;
        this.routerExtensions.navigate(["checkin"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "data": this.orderID,
            }
        });
    };
    SearchResultComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    SearchResultComponent.prototype.handleServiceError = function (error) {
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
    SearchResultComponent.prototype.navigateToCompensation = function () {
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
    ], SearchResultComponent.prototype, "pageCont", void 0);
    SearchResultComponent = __decorate([
        core_1.Component({
            selector: "search-page",
            providers: [index_3.DataService, app_constants_1.Configuration, index_3.PassengerService, index_3.CheckinService],
            templateUrl: "./components/searchresult/searchresult.component.html",
            styleUrls: ["./components/searchresult/searchresult.component.css"]
        }),
        __metadata("design:paramtypes", [index_3.CheckinService, page_1.Page, index_3.TimeOutService, router_2.RouterExtensions, index_3.DataService, router_1.Router, common_1.Location, router_1.ActivatedRoute, index_3.CheckinOrderService, index_3.PassengerService])
    ], SearchResultComponent);
    return SearchResultComponent;
}());
exports.SearchResultComponent = SearchResultComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNocmVzdWx0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlYXJjaHJlc3VsdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsc0NBQXlFO0FBQ3pFLDBDQUEyRTtBQUMzRSwwQ0FBMkM7QUFFM0Msc0RBQStEO0FBQy9ELGdDQUErQjtBQUkvQixvQ0FBc0M7QUFFdEMsOEJBQThCO0FBQzlCLDBEQUE0RDtBQUM1RCwwQ0FBNEM7QUFDNUMsK0JBQWlDO0FBRWpDLGdCQUFnQjtBQUNoQixzREFBMEc7QUFDMUcsa0RBQW1FO0FBQ25FLHFEQUFnSTtBQUNoSSxrREFBc0Q7QUFDdEQscURBQW9EO0FBWXBEO0lBc0JJLCtCQUFtQixRQUF1QixFQUFTLElBQVUsRUFBUyxlQUErQixFQUFVLGdCQUFrQyxFQUFTLFlBQXlCLEVBQVUsTUFBYyxFQUFVLFFBQWtCLEVBQVUsZUFBK0IsRUFBUyxPQUE0QixFQUFTLFFBQTBCO1FBQXJVLGFBQVEsR0FBUixRQUFRLENBQWU7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVMsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVU7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFxQjtRQUFTLGFBQVEsR0FBUixRQUFRLENBQWtCO1FBakJqVixpQkFBWSxHQUFXLENBQUMsQ0FBQztRQUl6QixrQkFBYSxHQUF5QixFQUFFLENBQUM7UUFFekMsaUJBQVksR0FBVyxJQUFJLGNBQU0sRUFBRSxDQUFDO1FBR3BDLHNCQUFpQixHQUFZLEtBQUssQ0FBQztRQUNuQyxtQkFBYyxHQUFZLEtBQUssQ0FBQztRQUNoQywwQkFBcUIsR0FB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b250ZW50IjpbIi8vYW5ndWxhciAmIG5hdGl2ZXNjcmlwdCByZWZlcmVuY2VzXHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBSb3V0ZXIsIE5hdmlnYXRpb25FeHRyYXMsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XHJcbmltcG9ydCB7IE9ic2VydmFibGVBcnJheSB9IGZyb20gXCJkYXRhL29ic2VydmFibGUtYXJyYXlcIjtcclxuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XHJcbmltcG9ydCB7IEdlc3R1cmVFdmVudERhdGEgfSBmcm9tIFwidWkvZ2VzdHVyZXNcIjtcclxuaW1wb3J0IHsgTGlzdFZpZXcsIEl0ZW1FdmVudERhdGEgfSBmcm9tIFwidWkvbGlzdC12aWV3XCI7XHJcbmltcG9ydCAqIGFzIGdlc3R1cmVzIGZyb20gXCJ1aS9nZXN0dXJlc1wiO1xyXG5pbXBvcnQgKiBhcyBkaWFsb2dzIGZyb20gXCJ1aS9kaWFsb2dzXCI7XHJcblxyXG4vL2V4dGVybmFsIG1vZHVsZXMgYW5kIHBsdWdpbnNcclxuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcclxuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcclxuXHJcbi8vYXBwIHJlZmVyZW5jZXNcclxuaW1wb3J0IHsgTG9hZGVyUHJvZ3Jlc3MsIG9yZGVyLCBQYXNzZW5nZXJMaXN0VGVtcGxhdGUsIFBhc3Nlbmdlckxpc3QgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2ludGVyZmFjZS9pbmRleFwiXHJcbmltcG9ydCB7IFNlYXJjaCwgUGFzc2VuZ2VyLCBPcmRlciB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbW9kZWwvaW5kZXhcIlxyXG5pbXBvcnQgeyBEYXRhU2VydmljZSwgQ2hlY2tpbk9yZGVyU2VydmljZSwgUGFzc2VuZ2VyU2VydmljZSwgVGltZU91dFNlcnZpY2UsQ2hlY2tpblNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL2luZGV4XCI7XHJcbmltcG9ydCB7IENvbnZlcnRlcnMgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi8uLi9hcHAuY29uc3RhbnRzJztcclxuXHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogXCJzZWFyY2gtcGFnZVwiLFxyXG4gICAgcHJvdmlkZXJzOiBbRGF0YVNlcnZpY2UsIENvbmZpZ3VyYXRpb24sIFBhc3NlbmdlclNlcnZpY2UsQ2hlY2tpblNlcnZpY2VdLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9jb21wb25lbnRzL3NlYXJjaHJlc3VsdC9zZWFyY2hyZXN1bHQuY29tcG9uZW50Lmh0bWxcIixcclxuICAgIHN0eWxlVXJsczogW1wiLi9jb21wb25lbnRzL3NlYXJjaHJlc3VsdC9zZWFyY2hyZXN1bHQuY29tcG9uZW50LmNzc1wiXVxyXG59KVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTZWFyY2hSZXN1bHRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gICAgcHVibGljIGlzRXJyb3I6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgbG9hZGVyUHJvZ3Jlc3M6IExvYWRlclByb2dyZXNzO1xyXG4gICAgcHVibGljIG9yZGVySUQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBjaGVja2VkQ291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIFBhc3NlbmdlckRldGFpbHM6IGFueTtcclxuICAgIHB1YmxpYyBQYXNzZW5nZXJMaXN0T2xkOiBBcnJheTxQYXNzZW5nZXJMaXN0VGVtcGxhdGU+O1xyXG4gICAgcHVibGljIFBhc3Nlbmdlckxpc3Q6IEFycmF5PFBhc3Nlbmdlckxpc3Q+ID0gW107XHJcbiAgICBwdWJsaWMgbmw6IGFueTtcclxuICAgIHB1YmxpYyBTZWFyY2hGaWVsZHM6IFNlYXJjaCA9IG5ldyBTZWFyY2goKTtcclxuICAgIHB1YmxpYyB1c2VyZGV0YWlsczogYW55O1xyXG4gICAgcHVibGljIFByb2ZpbGU6IGFueTtcclxuICAgIHB1YmxpYyBpc0NoZWNraW5EaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzR2F0ZURpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNDb21wZW5zYXRpb25FbmFibGVkOiBib29sZWFuID0gZmFsc2U7ICBcclxuICAgIFxyXG4gICAgQFZpZXdDaGlsZCgncGFnZWNvbnRhaW5lcicpIHBhZ2VDb250OiBFbGVtZW50UmVmO1xyXG5cclxuICAgIHB1YmxpYyBwYXhMaXN0OiBBcnJheTxQYXNzZW5nZXI+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfY2hlY2tpbjpDaGVja2luU2VydmljZSxwcml2YXRlIHBhZ2U6IFBhZ2UsIHB1YmxpYyBfdGltZW91dFNlcnZpY2U6IFRpbWVPdXRTZXJ2aWNlLCBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMsIHB1YmxpYyBfZGF0YVNlcnZpY2U6IERhdGFTZXJ2aWNlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIGxvY2F0aW9uOiBMb2NhdGlvbiwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZXI6IEFjdGl2YXRlZFJvdXRlLCBwdWJsaWMgX3NoYXJlZDogQ2hlY2tpbk9yZGVyU2VydmljZSwgcHVibGljIF9zZXJ2aWNlOiBQYXNzZW5nZXJTZXJ2aWNlLCApIHtcclxuICAgICAgICB0aGlzLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5wYXhMaXN0ID0gW107XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcyA9IG5ldyBMb2FkZXJQcm9ncmVzcygpO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHRoaXMucGFnZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnfi9pbWFnZXMvbG9naW5fYmFjay5qcGVnJylcIjtcclxuICAgICAgICB0aGlzLnBhZ2Uuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBcImNvdmVyIFwiO1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaW5pdExvYWRlcih0aGlzLnBhZ2VDb250KTtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoJ0xvYWRpbmcgRGF0YS4uLicpO1xyXG4gICAgICAgIHRoaXMuaXNDaGVja2luRGlzYWJsZWQgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJjaGVja2luRGlzYWJsZWRcIiwgKTtcclxuICAgICAgICB0aGlzLmlzR2F0ZURpc2FibGVkID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiZ2F0ZURpc2FibGVkXCIsICk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmF0ZWRSb3V0ZXIucXVlcnlQYXJhbXMuc3Vic2NyaWJlKChwYXJhbXMpID0+IHtcclxuICAgICAgICAgICAgaWYgKHBhcmFtc1tcInByb2ZpbGVcIl0gIT0gbnVsbCAmJiBwYXJhbXNbXCJwcm9maWxlXCJdICE9IFwiXCIgJiYgcGFyYW1zW1wicHJvZmlsZVwiXSAhPSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlByb2ZpbGUgPSBwYXJhbXNbXCJwcm9maWxlXCJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gdGhpcy5pc0NvbXBlbnNhdGlvbkVuYWJsZWQgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJjb21wZW5zYXRpb25FbmFibGVkXCIsICk7XHJcbiAgICAgICAgdGhpcy5pc0NvbXBlbnNhdGlvbkVuYWJsZWQgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJjb21wZW5zYXRpb25FbmFibGVkXCIsICk7XHJcbiAgICAgICAgdGhpcy5nZXRQYXNzYW5nZXJMaXN0KCk7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkLlNldEJhZ1RhZyhudWxsKTsgICAgICAgIFxyXG4gICAgICAgIHRoaXMudXNlcmRldGFpbHMgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcInVzZXJkZXRhaWxzXCIsIFwiXCIpO1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIHZhciBsYWJlbCA9IHRoaXMucGFnZUNvbnQubmF0aXZlRWxlbWVudFxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBsYWJlbC5vbihcImxvYWRlZCwgdGFwLCBsb25nUHJlc3MsIHN3aXBlLCBuZ01vZGVsQ2hhbmdlXCIsIGZ1bmN0aW9uIChhcmdzOiBnZXN0dXJlcy5HZXN0dXJlRXZlbnREYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXZlbnQ6IFwiICsgYXJncy5ldmVudE5hbWUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLl90aW1lb3V0U2VydmljZS50aW1lcik7XHJcbiAgICAgICAgICAgIHNlbGYuX3RpbWVvdXRTZXJ2aWNlLnJlc2V0V2F0Y2goKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0UGFzc2FuZ2VyTGlzdCgpIHtcclxuICAgICAgICB0aGlzLmxvY2F0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuU2VhcmNoRmllbGRzID0gSlNPTi5wYXJzZShBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcInNlYXJjaGRhdGFcIiwgXCJcIikpO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2YXRlZFJvdXRlci5xdWVyeVBhcmFtcy5zdWJzY3JpYmUoKHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5QYXNzZW5nZXJMaXN0ID0gSlNPTi5wYXJzZShwYXJhbXNbXCJkYXRhXCJdKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLlNlYXJjaEZpZWxkcyA9IEpTT04ucGFyc2UoQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJzZWFyY2hkYXRhXCIsIFwiXCIpKTtcclxuICAgICAgICB0aGlzLmFjdGl2YXRlZFJvdXRlci5xdWVyeVBhcmFtcy5zdWJzY3JpYmUoKHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLlBhc3Nlbmdlckxpc3QgPSBKU09OLnBhcnNlKHBhcmFtc1tcImRhdGFcIl0pO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgLy8gbGV0IG11bHRpcGxlUGFzc2VuZ2VyOm51bWJlciA9IDA7XHJcbiAgICAgICAgLy8gdGhpcy5QYXNzZW5nZXJMaXN0LmZvckVhY2goKHBhc3MsaW5kZXgpPT57XHJcbiAgICAgICAgLy8gICAgIGlmKHRoaXMuX3NoYXJlZC5HZXRBUElTRG9jdW1lbnQoKSE9bnVsbClcclxuICAgICAgICAvLyAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgaWYgKHRoaXMuX3NoYXJlZC5HZXRBUElTRG9jdW1lbnQoKS5GaXJzdG5hbWUucmVwbGFjZShcIiBcIiwgXCJcIikgPT0gdGhpcy5TdWZmaXhDaGVjayhwYXNzLkZpcnN0TmFtZSkgJiYgdGhpcy5fc2hhcmVkLkdldEFQSVNEb2N1bWVudCgpLlN1cm5hbWUucmVwbGFjZShcIiBcIiwgXCJcIikgPT0gcGFzcy5MYXN0TmFtZSkge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIG11bHRpcGxlUGFzc2VuZ2VyKys7XHJcbiAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9KTtcclxuICAgICAgICAvLyBpZihtdWx0aXBsZVBhc3NlbmdlciA+IDEpXHJcbiAgICAgICAgLy8ge1xyXG4gICAgICAgIC8vICAgICBUb2FzdC5tYWtlVGV4dChcIk11bHRpcGxlIG1hdGNoIGZvdW5kLiBTY2FubmVkIGRhdGEgaXMgaWdub3JlZFwiKS5zaG93KCk7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuX3NoYXJlZC5TZXRBUElTRG9jdW1lbnQobnVsbCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIFN1ZmZpeENoZWNrKGZpcnN0TmFtZTpzdHJpbmcpOnN0cmluZ3tcclxuICAgICAgICBsZXQgc3VmZml4TGlzdCA9IGZpcnN0TmFtZS5zcGxpdCh0aGlzLl9zaGFyZWQuR2V0QVBJU0RvY3VtZW50KCkuRmlyc3RuYW1lLnJlcGxhY2UoXCIgXCIsIFwiXCIpKTtcclxuICAgICAgICBsZXQgZ2l2ZW5OYW1lOnN0cmluZyA9ICcnXHJcbiAgICAgICAgaWYoc3VmZml4TGlzdC5sZW5ndGggPiAxKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2l2ZW5OYW1lID0gdGhpcy5fc2hhcmVkLkdldEFQSVNEb2N1bWVudCgpLkZpcnN0bmFtZS5yZXBsYWNlKFwiIFwiLCBcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2l2ZW5OYW1lID0gZmlyc3ROYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZ2l2ZW5OYW1lO1xyXG4gICAgfVxyXG4gICAgR2V0T3JkZXJEZXRhaWxzKGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IFBhc3NlbmdlciBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBTdGFydCBEYXRlIFRpbWUgOiAnICsgc0RhdGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLkdldFBhc3NlbmdlcihpZClcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmRpcihkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5JRCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlRpY2tldGluZ1N0YXR1cyAhPSBcIk5vdCBUaWNrZXRlZFwiICYmIGRhdGEuVGlja2V0aW5nU3RhdHVzICE9XCJQYXJ0aWFsbHkgVGlja2V0ZWRcIiAmJiBkYXRhLklzT3V0T2ZTeW5jVGlja2V0ICE9IHRydWUpIHsgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5TZWdtZW50cyAhPSBudWxsICYmIGRhdGEuU2VnbWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBQT1NMb2NhdGlvbiA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcmRldGFpbHNcIiwgXCJcIikuc3Vic3RyKDAsIDMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlNlZ21lbnRzLmZpbHRlcihtID0+IG0uT3JpZ2luLkFpcnBvcnRDb2RlID09IFBPU0xvY2F0aW9uKS5sZW5ndGg+MCAmJmRhdGEuU2VnbWVudHMuZmlsdGVyKG0gPT4gbS5PcmlnaW4uQWlycG9ydENvZGUgPT0gUE9TTG9jYXRpb24pWzBdLlN0YXR1cy5pc1dhaXRsaXN0ZWRQYXNzZW5nZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldElzV2FpdGxpc3RlZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJXYWl0bGlzdGVkIFBhc3NlbmdlclwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRJc1dhaXRsaXN0ZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlzV2FpdGxpc3RlZFBhc3NlbmdlciA6IGZhbHNlXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0UGFzc2VuZ2VyKDxPcmRlci5Sb290T2JqZWN0PmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcih0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCkuUGFzc2VuZ2Vyc1swXS5Eb2N1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2NUYWJsZTphbnlbXSA9IHRoaXMuX3NoYXJlZC5HZXRTdGFydHVwVGFibGUoKS5UYWJsZXMuU2VjdXJpdHlDb2RlVGFibGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBQYXNzZW5nZXJBcnJheTogYW55ID0gQ29udmVydGVycy5Db252ZXJ0VG9GbGlnaHRXaXRoUGF4VGVtcGxhdGUodGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpLCBudWxsLHNjVGFibGUsXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChQYXNzZW5nZXJBcnJheS5TZWdtZW50Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZXRkZXBhcnR1cmVEYXRlOiBzdHJpbmcgPSBtb21lbnQoUGFzc2VuZ2VyQXJyYXkuU2VnbWVudFswXS5EZXBhcnR1cmVEYXRlVGltZS50b1N0cmluZygpKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNldGZsaWdodG51bWJlcjogc3RyaW5nID0gUGFzc2VuZ2VyQXJyYXkuU2VnbWVudFswXS5NYXJrZXRpbmdGbGlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2V0Y2l0eTogc3RyaW5nID0gUGFzc2VuZ2VyQXJyYXkuU2VnbWVudFswXS5EZXBhcnR1cmVDaXR5O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhc3NlbmdlckFycmF5LlNlZ21lbnQuZm9yRWFjaCgoU2VnRWxlLCBTZWdJbm5kZXgpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRlcGFydHVyZURhdGU6IHN0cmluZyA9IG1vbWVudChTZWdFbGUuRGVwYXJ0dXJlRGF0ZVRpbWUudG9TdHJpbmcoKSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmxpZ2h0bnVtYmVyOiBzdHJpbmcgPSBTZWdFbGUuTWFya2V0aW5nRmxpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaXR5OiBzdHJpbmcgPSBTZWdFbGUuRGVwYXJ0dXJlQ2l0eTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWdFbGUuZGF0ZSA9IG1vbWVudChTZWdFbGUuRGVwYXJ0dXJlRGF0ZVRpbWUudG9TdHJpbmcoKSkuZm9ybWF0KFwiREQtTU1NLVlZWVlcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlc3RpbmF0aW9uID0gU2VnRWxlLkRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vSW52ZW50b3J5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tpbi5Cb29raW5nQ291bnREaXNwbGF5KGRlcGFydHVyZURhdGUsIGZsaWdodG51bWJlciwgY2l0eSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGludmVudG9yeTogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5pbnZlbiA9IENvbnZlcnRlcnMuQ29udmVydFRvSW52ZW50b3J5KGludmVudG9yeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0luYm91bmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGVja2luLkluQm91bmQoZGVwYXJ0dXJlRGF0ZSwgZmxpZ2h0bnVtYmVyLCBjaXR5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5Cb3VuZDogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5pbmJvdW5kID0gQ29udmVydGVycy5Db252ZXJ0VG9JbkJvdW5kKGluQm91bmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL091dGJvdW5kXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tpbi5PdXRCb3VuZChkZXBhcnR1cmVEYXRlLCBmbGlnaHRudW1iZXIsIGRlc3RpbmF0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgT3V0Qm91bmQ6IGFueSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWdFbGUub3V0Ym91bmQgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb091dEJvdW5kKE91dEJvdW5kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zdGF0dXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kYXRhU2VydmljZS5TdGF0dXMoZGVwYXJ0dXJlRGF0ZSwgZmxpZ2h0bnVtYmVyLGNpdHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLkZsaWdodHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3RhdHVzOiBhbnkgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5zdGF0dXMgPSBzdGF0dXMuRmxpZ2h0c1swXS5MZWdzWzBdLlN0YXR1cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgT3JpZ2lubG9jRGV0YWlscyA9IHN0YXR1cy5GbGlnaHRzWzBdLkxlZ3MuZmlsdGVyKG0gPT4gbS5EZXBhcnR1cmVBaXJwb3J0LkxvY2F0aW9uQ29kZSA9PSBTZWdFbGUuT3JpZ2luKVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZsaWdodCBvcmlnaW46XCIgKyBTZWdFbGUuT3JpZ2luKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZsaWdodCBvcmlnaW46XCIgKyBKU09OLnN0cmluZ2lmeShPcmlnaW5sb2NEZXRhaWxzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYoU2VnRWxlLk9yaWdpbiA9PSBzdGF0dXMuRmxpZ2h0c1swXS5MZWdzLmZpbHRlcihtPT4gbS5EZXBhcnR1cmVBaXJwb3J0KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWdFbGUuTGVncyA9IHN0YXR1cy5GbGlnaHRzWzBdLkxlZ3M7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VnRWxlLkVURCA9IE9yaWdpbmxvY0RldGFpbHMuRGVwYXJ0dXJlRGF0ZVRpbWUuRXN0aW1hdGVkLnRvU3RyaW5nKCkuc3Vic3RyKDExLCA1KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWdFbGUuU1REID0gT3JpZ2lubG9jRGV0YWlscy5EZXBhcnR1cmVEYXRlVGltZS5TY2hlZHVsZWQudG9TdHJpbmcoKS5zdWJzdHIoMTEsIDUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5FVEEgPSBPcmlnaW5sb2NEZXRhaWxzLkFycml2YWxEYXRlVGltZS5TY2hlZHVsZWQudG9TdHJpbmcoKS5zdWJzdHIoMTEsIDUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cy5GbGlnaHRzWzBdLkxlZ3NbMF0uRGVwYXJ0dXJlRGF0ZVRpbWUuRXN0aW1hdGVkLnRvU3RyaW5nKCkuc3Vic3RyKDExLCA1KSArIFwibGxsbFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFzc2VuZ2VyTGVuZ3RoID0gUGFzc2VuZ2VyQXJyYXkuU2VnbWVudC5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXNzZW5nZXJMZW5ndGggPT0gU2VnSW5uZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRCYWdUYWcobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRTZWdtZW50RGV0YWlsKFBhc3NlbmdlckFycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG11bHRpcGxlUGFzc2VuZ2VyOiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCkuUGFzc2VuZ2Vycy5mb3JFYWNoKChwYXNzLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NoYXJlZC5HZXRBUElTRG9jdW1lbnQoKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NoYXJlZC5HZXRBUElTRG9jdW1lbnQoKS5GaXJzdG5hbWUucmVwbGFjZShcIiBcIiwgXCJcIikgPT0gdGhpcy5TdWZmaXhDaGVjayhwYXNzLkZpcnN0bmFtZSkgJiYgdGhpcy5fc2hhcmVkLkdldEFQSVNEb2N1bWVudCgpLlN1cm5hbWUucmVwbGFjZShcIiBcIiwgXCJcIikgPT0gcGFzcy5MYXN0bmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZVBhc3NlbmdlcisrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtdWx0aXBsZVBhc3NlbmdlciA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiTXVsdGlwbGUgbWF0Y2ggZm91bmQuIFNjYW5uZWQgZGF0YSBpcyBpZ25vcmVkXCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRBUElTRG9jdW1lbnQobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGVUb0NoZWNraW4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5XYXJuaW5nc1swXS5NZXNzYWdlKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhc3Nlbmdlckxlbmd0aCA9IFBhc3NlbmdlckFycmF5LlNlZ21lbnQubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFzc2VuZ2VyTGVuZ3RoID09IFNlZ0lubmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0QmFnVGFnKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0U2VnbWVudERldGFpbChQYXNzZW5nZXJBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtdWx0aXBsZVBhc3NlbmdlcjogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpLlBhc3NlbmdlcnMuZm9yRWFjaCgocGFzcywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zaGFyZWQuR2V0QVBJU0RvY3VtZW50KCkgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zaGFyZWQuR2V0QVBJU0RvY3VtZW50KCkuRmlyc3RuYW1lLnJlcGxhY2UoXCIgXCIsIFwiXCIpID09IHRoaXMuU3VmZml4Q2hlY2socGFzcy5GaXJzdG5hbWUpICYmIHRoaXMuX3NoYXJlZC5HZXRBUElTRG9jdW1lbnQoKS5TdXJuYW1lLnJlcGxhY2UoXCIgXCIsIFwiXCIpID09IHBhc3MuTGFzdG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlwbGVQYXNzZW5nZXIrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobXVsdGlwbGVQYXNzZW5nZXIgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk11bHRpcGxlIG1hdGNoIGZvdW5kLiBTY2FubmVkIGRhdGEgaXMgaWdub3JlZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0QVBJU0RvY3VtZW50KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9DaGVja2luKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuX2RhdGFTZXJ2aWNlLkdldEJhZ2dhZ2UoaWQpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuX3NoYXJlZC5TZXRCYWdnYWdlY2F0YWxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVGllclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5fZGF0YVNlcnZpY2UuVGllcihzZXRkZXBhcnR1cmVEYXRlLCBzZXRmbGlnaHRudW1iZXIsIHNldGNpdHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBsZXQgdGllcjogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFRpZXIodGllcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLl9zaGFyZWQuU2V0U2VnbWVudERldGFpbChQYXNzZW5nZXJBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMubmF2aWdhdGVUb0NoZWNraW4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiTm8gcmVzZXJ2YXRpb25zIGFyZSBmb3VuZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk5vdCBhYmxlIHRvIHByb2Nlc3MgLSBnbyB0byBjb3VudGVyXCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk5vIHJlc2VydmF0aW9ucyBhcmUgZm91bmRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICxcclxuICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChlcnIuaW5kZXhPZihcIlVucmVjb2duaXplZCB0b2tlbiAnPCdcIikgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aXRsZTogXCJTZXNzaW9uIFRpbWUgT3V0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBtZXNzYWdlOiBcIllvdXIgc2Vzc2lvbiBoYXMgYmVlbiB0aW1lIG91dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgb2tCdXR0b25UZXh0OiBcIk9LXCJcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgZGlhbG9ncy5hbGVydChvcHRpb25zKS50aGVuKCgpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLm5hdmlnYXRlVG9sb2dpbigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IFBhc3NlbmdlciBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ0dldCBQYXNzZW5nZXIgU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlRGF0ZSkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyBHZXRPcmRlckRldGFpbHMoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgLy8gICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgLy8gICAgIHRyeSB7XHJcbiAgICAvLyAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgUGFzc2VuZ2VyIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuX3NlcnZpY2UuR2V0UGFzc2VuZ2VyKGlkKVxyXG4gICAgLy8gICAgICAgICAgICAgLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0UGFzc2VuZ2VyKDxPcmRlci5Sb290T2JqZWN0PmRhdGEpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGxldCBQYXNzZW5nZXJBcnJheTogYW55ID0gQ29udmVydGVycy5Db252ZXJ0VG9QYXNzZW5nZXJUZW1wbGF0ZSh0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCksIG51bGwpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGlmIChQYXNzZW5nZXJBcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGxldCBkZXBhcnR1cmVEYXRlOiBzdHJpbmcgPSBtb21lbnQoUGFzc2VuZ2VyQXJyYXlbMF0uRmxpZ2h0RGV0YWlsc1swXS5EZXBhcnR1cmVEYXRlVGltZS50b1N0cmluZygpKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBsZXQgZmxpZ2h0bnVtYmVyOiBzdHJpbmcgPSBQYXNzZW5nZXJBcnJheVswXS5GbGlnaHREZXRhaWxzWzBdLk1hcmtldGluZ0ZsaWdodDtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgbGV0IGNpdHk6IHN0cmluZyA9IFBhc3NlbmdlckFycmF5WzBdLkZsaWdodERldGFpbHNbMF0uRGVwYXJ0dXJlQ2l0eTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy9JbnZlbnRvcnlcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGF0YVNlcnZpY2UuSW52ZW50b3J5KGRlcGFydHVyZURhdGUsIGZsaWdodG51bWJlcilcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW52ZW50b3J5OiBhbnkgPSBkYXRhO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRJbnZlbnRvcnkoaW52ZW50b3J5KTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vSW5ib3VuZFxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLl9kYXRhU2VydmljZS5JbkJvdW5kKGRlcGFydHVyZURhdGUsIGZsaWdodG51bWJlciwgY2l0eSlcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5Cb3VuZDogYW55ID0gZGF0YTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0SW5ib3VuZChpbkJvdW5kKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvL091dGJvdW5kXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFTZXJ2aWNlLk91dEJvdW5kKGRlcGFydHVyZURhdGUsIGZsaWdodG51bWJlciwgY2l0eSlcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgT3V0Qm91bmQ6IGFueSA9IGRhdGE7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldE91dGJvdW5kKE91dEJvdW5kKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvL3N0YXR1c1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLl9kYXRhU2VydmljZS5TdGF0dXMoZGVwYXJ0dXJlRGF0ZSwgZmxpZ2h0bnVtYmVyKVxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGF0dXM6IGFueSA9IGRhdGE7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFN0YXR1cyhzdGF0dXMpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vVGllclxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLl9kYXRhU2VydmljZS5UaWVyKGRlcGFydHVyZURhdGUsIGZsaWdodG51bWJlciwgY2l0eSlcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0VGllcihkYXRhKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9DaGVja2luKCk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgIC8vICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIlJlY29yZCBOb3QgRm91bmRcIikuc2hvdygpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAvLyAgICAgICAgICAgICB9LFxyXG4gICAgLy8gICAgICAgICAgICAgZXJyID0+IHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAvLyAgICAgICAgICAgICB9KTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgLy8gICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgZmluYWxseSB7XHJcbiAgICAvLyAgICAgICAgIHZhciBlRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgUGFzc2VuZ2VyIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyB9XHJcblxyXG4gICAgdG9nZ2xlQ2hlY2tlZChhcmdzOiBJdGVtRXZlbnREYXRhKSB7XHJcbiAgICAgICAgdmFyIHBheCA9IDxQYXNzZW5nZXJMaXN0VGVtcGxhdGU+YXJncy52aWV3LmJpbmRpbmdDb250ZXh0O1xyXG4gICAgICAgIGlmIChwYXguSXNDaGVja2VkKSB7XHJcbiAgICAgICAgICAgIHBheC5Jc0NoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5jaGVja2VkQ291bnQtLTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcmRlcklEKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrZWRDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBheC5PcmRlcklEID09PSB0aGlzLm9yZGVySUQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXguSXNDaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcmRlcklEID0gcGF4Lk9yZGVySUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXNzZW5nZXJMaXN0LmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuSXNDaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF4LklzQ2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja2VkQ291bnQgPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcmRlcklEID0gcGF4Lk9yZGVySUQ7XHJcbiAgICAgICAgICAgICAgICBwYXguSXNDaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tlZENvdW50Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjaGVja2VkQ291bnQ6IFwiICsgdGhpcy5jaGVja2VkQ291bnQpXHJcbiAgICB9XHJcblxyXG4gICAgbmF2aWdhdGVUb1NlYXJjaCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZWFyY2hcIl0sIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxubmF2aWdhdGVUb0RlcGFydHVyZXMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNHYXRlRGlzYWJsZWQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiZGVwYXJ0aG9tZVwiXSwge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5hdmlnYXRlVG9sb2dpbigpIHtcclxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiXCJdLCB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnb3RvQ2hlY2tpbigpIHtcclxuICAgICAgICBpZiAodGhpcy5jaGVja2VkQ291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBQYXhMaXN0ID0gQXJyYXk8UGFzc2VuZ2VyTGlzdD4oKTtcclxuICAgICAgICAgICAgUGF4TGlzdCA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLlBhc3Nlbmdlckxpc3QuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LklzQ2hlY2tlZCkgUGF4TGlzdC5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5HZXRPcmRlckRldGFpbHModGhpcy5vcmRlcklEKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIlBsZWFzZSBzZWxlY3QgYXRsZWFzdCBvbmUgUGFzc2VuZ2Vyc1wiKS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVUb0NoZWNraW4oKSB7XHJcbiAgICAgICAgdmFyIHByb2ZpbGU6IHN0cmluZyA9IHRoaXMuUHJvZmlsZVxyXG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJjaGVja2luXCJdLCB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIFwiZGF0YVwiOiB0aGlzLm9yZGVySUQsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcbiAgICBuYXZpZ2F0ZVRvU2V0dGluZygpIHtcclxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wic2V0dGluZ1wiXSwge1xyXG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVTZXJ2aWNlRXJyb3IoZXJyb3I6IGFueSkge1xyXG4gICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci50b1N0cmluZygpO1xyXG4gICAgICAgIGlmIChlcnJvck1lc3NhZ2UuaW5kZXhPZihcIlNlc3Npb25UaW1lb3V0XCIpID4gLTEpIHtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJTZXNzaW9uIFRpbWUgT3V0XCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIllvdXIgc2Vzc2lvbiBoYXMgYmVlbiB0aW1lIG91dFwiLFxyXG4gICAgICAgICAgICAgICAgb2tCdXR0b25UZXh0OiBcIk9LXCJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZGlhbG9ncy5hbGVydChvcHRpb25zKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJcIl0sIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZXJyb3JNZXNzYWdlKS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVUb0NvbXBlbnNhdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0NvbXBlbnNhdGlvbkVuYWJsZWQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY29tcGVuc2F0aW9uXCJdLCB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJDb21wZW5zYXRpb24gTm90IGFwcGxpY2FibGVcIikuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==