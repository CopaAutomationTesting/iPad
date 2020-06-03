"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var router_2 = require("nativescript-angular/router");
var page_1 = require("ui/page");
var dialogs = require("ui/dialogs");
var segmented_bar_1 = require("ui/segmented-bar");
//external modules and plugins
var ApplicationSettings = require("application-settings");
var moment = require("moment");
var Toast = require("nativescript-toast");
//app references
var index_1 = require("../../shared/interface/index");
var index_2 = require("../../shared/model/index");
var index_3 = require("../../shared/services/index");
var index_4 = require("../../shared/utils/index");
var app_executiontime_1 = require("../../app.executiontime");
var app_constants_1 = require("../../app.constants");
var DeparturePaxListComponent = /** @class */ (function () {
    function DeparturePaxListComponent(_checkin, page, _timeoutService, routerExtensions, _dataService, router, location, activatedRouter, _shared, _service, departureService) {
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
        this.departureService = departureService;
        this.PassengerList = [];
        this.NewPassengerList = [];
        this.NotCheckedInPassengerList = [];
        this.CheckedInPassengerList = [];
        this.checkedPaxCount = 0;
        this.notCheckedPaxCount = 0;
        this.DepartureArray = [];
        this.checkinind = 1;
        this.ind1 = true;
        this.ind2 = false;
        this.DestinationCode = "";
        this.DestinationCode1 = null;
        this.OriginCode = "";
        this.checkedCount = 0;
        this.outboun1 = new index_1.OutBound.Outbou();
        this.inboun1 = new index_1.InBound.Inbou();
        this.invent1 = new index_2.Inventory.RootObject();
        this.SecondLegDestination = "";
        this.isMulitLegFlight = false;
        this.isCompensationEnabled = false;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.item = new segmented_bar_1.SegmentedBarItem();
        this.secondItem = new segmented_bar_1.SegmentedBarItem();
        this.isError = false;
        this.errorMessage = "";
        this.paxList = [];
        this.apisdetails = [];
        this.loaderProgress = new index_1.LoaderProgress();
        this.item.title = "Checkedin";
        this.apisdetails.push(this.item);
        this.secondItem.title = "Not Checkedin";
        this.apisdetails.push(this.secondItem);
    }
    DeparturePaxListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.loaderProgress.initLoader(this.pageCont);
        this.date = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
        this.date1 = moment(new Date()).format("DD MMM YYYY");
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        var userlocation = this.userdetails;
        this.locationcode = userlocation.substring(0, 3);
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled");
        this.activatedRouter.queryParams.subscribe(function (params) {
            _this.flightcode = params["data"];
            _this.DepartureArray = JSON.parse(params["pax"]);
        });
        this.GetCountry();
        this.getDocumentType();
        this.GetFQTV();
        this.getPassangerList(this.DepartureArray);
        var label = this.pageCont.nativeElement;
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();
        });
        this._shared.SetBagTag(null);
    };
    DeparturePaxListComponent.prototype.getDocumentType = function () {
        var _this = this;
        this._dataService.documentType().subscribe(function (data) {
            _this.AdditionalDocuments = data.ReferenceInfo[0].AdcDocumentsToAppend;
            _this._shared.SetAdditionalDocuments(_this.AdditionalDocuments);
            // this.loaderProgress.hideLoader();            
        }, function (error) {
            _this.handleServiceError(error);
            console.log(error);
            _this.loaderProgress.hideLoader();
        });
    };
    DeparturePaxListComponent.prototype.getPassangerList = function (departure) {
        var _this = this;
        this.loaderProgress.showLoader();
        console.log(departure);
        this.flightDate = departure.Date;
        console.log("dates" + JSON.stringify(this.flightDate));
        this._dataService.GetFlightInfo(this.flightcode, this.flightDate).subscribe(function (data) {
            _this.FlightInfo = data;
            if (data.Success != false) {
                if (data.Flights[0].Legs.length > 1) {
                    _this.isMulitLegFlight = true;
                    // this.loaderProgress.showLoader();
                    _this.OriginCode = data.Flights[0].Legs[0].DepartureAirport.LocationCode;
                    _this.DestinationCode = data.Flights[0].Legs[0].ArrivalAirport.LocationCode;
                    _this.SecondLegDestination = data.Flights[0].Legs[1].ArrivalAirport.LocationCode;
                    // this.DepartureArray[0].FlightStatus = data.Flights[0].Legs[0].Status;                    
                    _this.FlightDeatils();
                    console.log("NextDests" + JSON.stringify(_this.DestinationCode));
                }
                else {
                    _this.OriginCode = data.Flights[0].Legs[0].DepartureAirport.LocationCode;
                    _this.DestinationCode = data.Flights[0].Legs[0].ArrivalAirport.LocationCode;
                    _this.FlightDeatils();
                }
            }
            else {
                Toast.makeText(data.ErrorMessage).show();
            }
        }, function (error) {
            console.log("Couldnt find information for this search " + error);
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
            // Toast.makeText("Couldnt find information for this search " + error).show();
        });
    };
    DeparturePaxListComponent.prototype.filter = function (args) {
        var segBarElm = this.segbar.nativeElement;
        var index = segBarElm.selectedIndex;
        console.log(index);
        if (args != "") {
            if (index == 0) {
                var name_1 = args.toString().toUpperCase();
                this.NewPassengerList = this.CheckedInPassengerList.filter(function (r) { return r.Surname.indexOf(name_1.trim()) >= 0 || r.GivenName.indexOf(name_1.trim()) >= 0; });
            }
            else {
                var name_2 = args.toString().toUpperCase();
                this.NewPassengerList = this.NotCheckedInPassengerList.filter(function (r) { return r.Surname.indexOf(name_2.trim()) >= 0 || r.GivenName.indexOf(name_2.trim()) >= 0; });
            }
        }
        else {
            if (index == 0) {
                this.NewPassengerList = this.CheckedInPassengerList;
            }
            else {
                this.NewPassengerList = this.NotCheckedInPassengerList;
            }
        }
    };
    DeparturePaxListComponent.prototype.FlightDeatils = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log("V" + JSON.stringify(this.date2));
            console.log("V" + JSON.stringify(this.flightcode));
            console.log("V" + JSON.stringify(this.locationcode));
            console.log("V" + JSON.stringify(this.date2));
            console.log('SearchAllPaxByFlight Service --------------- Start Date Time : ' + sDate);
            this._checkin.BookingCountDisplay(this.flightDate, this.flightcode, this.locationcode)
                .subscribe(function (data) {
                var inventory = data;
                _this.invent1.inven = index_4.Converters.ConvertToInventory(inventory);
                console.dir(_this.invent1);
            }, function (error) {
                _this.handleServiceError(error);
                console.log(error);
                // this.loaderProgress.hideLoader();
            });
            //Inbound
            this._checkin.InBound(this.flightDate, this.flightcode, this.locationcode)
                .subscribe(function (data) {
                var inBound = data;
                _this.inbound = index_4.Converters.ConvertToInBound(inBound);
                console.dir(_this.inbound);
            }, function (error) {
                _this.handleServiceError(error);
                console.log(error);
                // this.loaderProgress.hideLoader();
            });
            //Outbound
            this._checkin.OutBound(this.flightDate, this.flightcode, this.DestinationCode)
                .subscribe(function (data) {
                var OutBound = data;
                _this.outbound = index_4.Converters.ConvertToOutBound(OutBound);
                console.dir(_this.outbound);
            }, function (error) {
                _this.handleServiceError(error);
                console.log(error);
                // this.loaderProgress.hideLoader();
            });
            //status
            this._dataService.Status(this.flightDate, this.flightcode, this.locationcode)
                .subscribe(function (data) {
                var status = data;
                _this.status = status.Flights[0].Legs[0].Status;
                console.log(status);
                _this.DepartureArray[0].FlightStatus = status.Flights[0].Legs[0].Status;
                console.log(_this.DepartureArray[0].FlightStatus);
            }, function (error) {
                _this.handleServiceError(error);
                console.log(error);
                // this.loaderProgress.hideLoader();
            });
            this.getPaxbyFlight("ALL", this.flightDate, this.flightcode, this.locationcode, this.checkinind);
            // setTimeout(() => {
            //     this.loaderProgress.hideLoader();
            // }, 10000);
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        // this.loaderProgress.hideLoader();
    };
    DeparturePaxListComponent.prototype.getPaxbyFlight = function (name, date, flightcode, locationcode, checkind) {
        var _this = this;
        try {
            var sDate = new Date();
            console.log('SearchAllPaxByFlight Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            this.departureService.SearchAllPaxByFlight(name, date, flightcode, this.locationcode)
                .subscribe(function (data) {
                console.dir(data);
                _this._shared.SetAPISDocument(null);
                _this._shared.SetScanAPISDocument(null);
                if (data.Success != false) {
                    var tier = data;
                    _this._shared.SetTier(tier);
                    _this.PassengerDetails = data;
                    _this.PassengerList = index_4.Converters.ConvertToPaxByFlightforDepartureTemplate(_this.PassengerDetails, checkind, _this.locationcode);
                    _this.CheckedInPassengerList = _this.PassengerList.filter(function (r) { return r.CheckinStatus; });
                    _this.checkedPaxCount = _this.CheckedInPassengerList.length;
                    // this.item.title =+ " ("+ this.checkedPaxCount + ")"
                    _this.NotCheckedInPassengerList = _this.PassengerList.filter(function (r) { return r.CheckinStatus == false; });
                    _this.notCheckedPaxCount = _this.NotCheckedInPassengerList.length;
                    console.log("checked in:" + JSON.stringify(_this.checkedPaxCount));
                    console.log("Not checked in:" + JSON.stringify(_this.notCheckedPaxCount));
                    //const item = new SegmentedBarItem();
                    _this.item.title = "Checkedin " + "(" + _this.checkedPaxCount + ")";
                    _this.apisdetails.push(_this.item);
                    // const secondItem = new SegmentedBarItem();
                    _this.secondItem.title = "Not Checkedin " + "(" + _this.notCheckedPaxCount + ")";
                    _this.apisdetails.push(_this.secondItem);
                    _this.NewPassengerList = _this.CheckedInPassengerList;
                    _this.loaderProgress.hideLoader();
                    // if (this.CheckedInPassengerList.length == 0) {
                    //     Toast.makeText("No CheckedIn Passenger in this FLight").show();
                    // }
                    if (data.Warnings != null) {
                        Toast.makeText(data.Warnings[0].Message).show();
                    }
                }
                else {
                    if (data.Warnings != null) {
                        Toast.makeText(data.Warnings[0].Message).show();
                    }
                    _this.loaderProgress.hideLoader();
                    // this.naviteToDepartureall();
                }
            }, function (error) {
                console.log("Couldnt find information for this search " + error);
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
                // Toast.makeText("Couldnt find information for this search " + error).show();
            }, function () {
                console.log('Data Retrieved successfully' + _this.PassengerDetails);
                // this.loaderProgress.hideLoader();
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('SearchAllPaxByFlight Service --------------- End Date Time : ' + eDate);
            console.log('SearchAllPaxByFlight Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            // this.loaderProgress.hideLoader();
        }
    };
    DeparturePaxListComponent.prototype.GetCountry = function () {
        var _this = this;
        this.loaderProgress.showLoader();
        try {
            var sDate = new Date();
            console.log('Get Countries Service --------------- Start Date Time : ' + sDate);
            this._service.GetCountries()
                .subscribe(function (data) {
                _this.CountryDetails = data;
                _this._shared.SetCountry(_this.CountryDetails);
            }, function (err) {
                console.log(err);
                _this.handleServiceError(err);
                _this.loaderProgress.hideLoader();
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
            });
            // this.loaderProgress.hideLoader();
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            this.loaderProgress.hideLoader();
            var eDate = new Date();
            console.log('Get Countries Service --------------- End Date Time : ' + eDate);
            console.log('Get Countries Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    DeparturePaxListComponent.prototype.GetFQTV = function () {
        var _this = this;
        this._dataService.FQTV()
            .subscribe(function (data) {
            console.dir(data);
            _this._shared.SetFQTV(data);
        }, function (error) {
            _this.handleServiceError(error);
            console.log(error);
            _this.loaderProgress.hideLoader();
        });
    };
    DeparturePaxListComponent.prototype.GetOrderDetails = function (id) {
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
                        var PassengerArray_1 = index_4.Converters.ConvertToFlightWithPaxTemplate(_this._shared.GetPassenger(), null, scTable, "");
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
                                            _this.navigateToCheckIn();
                                        }
                                    }
                                    else {
                                        Toast.makeText(data.Warnings[0].Message).show();
                                        var passengerLength = PassengerArray_1.Segment.length - 1;
                                        if (passengerLength == SegInndex) {
                                            _this._shared.SetBagTag(null);
                                            _this._shared.SetSegmentDetail(PassengerArray_1);
                                            _this.loaderProgress.hideLoader();
                                            _this.navigateToCheckIn();
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
    DeparturePaxListComponent.prototype.toggleChecked = function (args) {
        var _this = this;
        console.log(args);
        this.PassengerList.forEach(function (element, index) {
            element.IsChecked = false;
            _this.checkedCount--;
        });
        var pax = args.view.bindingContext;
        pax.IsChecked = true;
        this.checkedCount = 1;
        this.orderID = pax.OrderId;
        args.view.bindingContext = pax;
    };
    DeparturePaxListComponent.prototype.gotoCheckIn = function () {
        this.GetOrderDetails(this.orderID);
    };
    DeparturePaxListComponent.prototype.navigateToCheckIn = function () {
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
    DeparturePaxListComponent.prototype.navigateToSearch = function () {
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
    DeparturePaxListComponent.prototype.navigateToDepartures = function () {
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
    DeparturePaxListComponent.prototype.navigateToDepartureall = function () {
        this.routerExtensions.navigate(["departall"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    DeparturePaxListComponent.prototype.selectSegment = function (e) {
        console.log("inside");
        var selInd = e.newIndex;
        // var tabtc = this.tabcheckin.nativeElement;
        // var taba = <StackLayout>this.tabnotcheckin.nativeElement;
        if (selInd == 0) {
            this.NewPassengerList = this.CheckedInPassengerList;
        }
        else {
            this.NewPassengerList = this.NotCheckedInPassengerList;
        }
    };
    // loader(args:ItemEventData){
    //     console.log("loded");
    //     this.loaderProgress.hideLoader();
    // }
    DeparturePaxListComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    DeparturePaxListComponent.prototype.navigateTologin = function () {
        this.routerExtensions.navigate([""], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    DeparturePaxListComponent.prototype.handleServiceError = function (error) {
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
    DeparturePaxListComponent.prototype.navigateToCompensation = function () {
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
    ], DeparturePaxListComponent.prototype, "pageCont", void 0);
    __decorate([
        core_1.ViewChild('segbar'),
        __metadata("design:type", core_1.ElementRef)
    ], DeparturePaxListComponent.prototype, "segbar", void 0);
    DeparturePaxListComponent = __decorate([
        core_1.Component({
            selector: "list-page",
            providers: [index_3.DataService, index_3.PassengerService, app_constants_1.Configuration, index_3.DepartureService, index_3.CheckinService],
            templateUrl: "./components/departurepaxlist/departurepaxlist.component.html",
            styleUrls: ["./components/departurepaxlist/departurepaxlist.component.css"]
        }),
        __metadata("design:paramtypes", [index_3.CheckinService, page_1.Page, index_3.TimeOutService, router_2.RouterExtensions, index_3.DataService, router_1.Router, common_1.Location, router_1.ActivatedRoute, index_3.CheckinOrderService, index_3.PassengerService, index_3.DepartureService])
    ], DeparturePaxListComponent);
    return DeparturePaxListComponent;
}());
exports.DeparturePaxListComponent = DeparturePaxListComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwYXJ0dXJlcGF4bGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZXBhcnR1cmVwYXhsaXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyxzQ0FBeUU7QUFDekUsMENBQTJFO0FBQzNFLDBDQUEyQztBQUUzQyxzREFBK0Q7QUFDL0QsZ0NBQStCO0FBSy9CLG9DQUFzQztBQUV0QyxrREFBa0U7QUFDbEUsOEJBQThCO0FBQzlCLDBEQUE0RDtBQUM1RCwrQkFBaUM7QUFDakMsMENBQTRDO0FBRTVDLGdCQUFnQjtBQUNoQixzREFBK0o7QUFDL0osa0RBQTBGO0FBQzFGLHFEQUFtSjtBQUNuSixrREFBc0Q7QUFDdEQsNkRBQTJEO0FBQzNELHFEQUFvRDtBQVNwRDtJQXVESSxtQ0FBbUIsUUFBd0IsRUFBVSxJQUFVLEVBQVMsZUFBK0IsRUFBVSxnQkFBa0MsRUFBUyxZQUF5QixFQUFVLE1BQWMsRUFBVSxRQUFrQixFQUFVLGVBQStCLEVBQVMsT0FBNEIsRUFBUyxRQUEwQixFQUFTLGdCQUFrQztRQUFsWCxhQUFRLEdBQVIsUUFBUSxDQUFnQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQU07UUFBUyxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQVMsaUJBQVksR0FBWixZQUFZLENBQWE7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQXFCO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFBUyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBN0M5WCxrQkFBYSxHQUE0QixFQUFFLENBQUM7UUFDNUMscUJBQWdCLEdBQTRCLEVBQUUsQ0FBQztRQUMvQyw4QkFBeUIsR0FBNEIsRUFBRSxDQUFD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NkJBQTZCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN4RDtJQUNMLENBQUM7SUF6c0IyQjtRQUEzQixnQkFBUyxDQUFDLGVBQWUsQ0FBQztrQ0FBVyxpQkFBVTsrREFBQztJQUM1QjtRQUFwQixnQkFBUyxDQUFDLFFBQVEsQ0FBQztrQ0FBUyxpQkFBVTs2REFBQztJQWhEL0IseUJBQXlCO1FBUHJDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsV0FBVztZQUNyQixTQUFTLEVBQUUsQ0FBQyxtQkFBVyxFQUFFLHdCQUFnQixFQUFFLDZCQUFhLEVBQUUsd0JBQWdCLEVBQUUsc0JBQWMsQ0FBQztZQUMzRixXQUFXLEVBQUUsK0RBQStEO1lBQzVFLFNBQVMsRUFBRSxDQUFDLDhEQUE4RCxDQUFDO1NBQzlFLENBQUM7eUNBeUQrQixzQkFBYyxFQUFnQixXQUFJLEVBQTBCLHNCQUFjLEVBQTRCLHlCQUFnQixFQUF1QixtQkFBVyxFQUFrQixlQUFNLEVBQW9CLGlCQUFRLEVBQTJCLHVCQUFjLEVBQWtCLDJCQUFtQixFQUFtQix3QkFBZ0IsRUFBMkIsd0JBQWdCO09BdkQ1WCx5QkFBeUIsQ0F5dkJyQztJQUFELGdDQUFDO0NBQUEsQUF6dkJELElBeXZCQztBQXp2QlksOERBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiLy9hbmd1bGFyICYgbmF0aXZlc2NyaXB0IHJlZmVyZW5jZXNcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvbkV4dHJhcywgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZUFycmF5IH0gZnJvbSBcImRhdGEvb2JzZXJ2YWJsZS1hcnJheVwiO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcclxuaW1wb3J0IHsgR2VzdHVyZUV2ZW50RGF0YSB9IGZyb20gXCJ1aS9nZXN0dXJlc1wiO1xyXG5pbXBvcnQgeyBMaXN0VmlldywgSXRlbUV2ZW50RGF0YSB9IGZyb20gXCJ1aS9saXN0LXZpZXdcIjtcclxuaW1wb3J0IHsgU3RhY2tMYXlvdXQgfSBmcm9tIFwidWkvbGF5b3V0cy9zdGFjay1sYXlvdXRcIjtcclxuaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcclxuaW1wb3J0ICogYXMgZGlhbG9ncyBmcm9tIFwidWkvZGlhbG9nc1wiO1xyXG5pbXBvcnQgKiBhcyBnZXN0dXJlcyBmcm9tIFwidWkvZ2VzdHVyZXNcIjtcclxuaW1wb3J0IHsgU2VnbWVudGVkQmFyLCBTZWdtZW50ZWRCYXJJdGVtIH0gZnJvbSBcInVpL3NlZ21lbnRlZC1iYXJcIjtcclxuLy9leHRlcm5hbCBtb2R1bGVzIGFuZCBwbHVnaW5zXHJcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tIFwibW9tZW50XCI7XHJcbmltcG9ydCAqIGFzIFRvYXN0IGZyb20gJ25hdGl2ZXNjcmlwdC10b2FzdCc7XHJcblxyXG4vL2FwcCByZWZlcmVuY2VzXHJcbmltcG9ydCB7IExvYWRlclByb2dyZXNzLCBvcmRlciwgUGFzc2VuZ2VyTGlzdFRlbXBsYXRlLCBEZXBhcnR1cmVQYXhMaXN0LCBQYXNzZW5nZXJMaXN0LCBEZXBhcnR1cmVJbmZvMSwgSW5Cb3VuZCwgT3V0Qm91bmQgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2ludGVyZmFjZS9pbmRleFwiXHJcbmltcG9ydCB7IFBhc3NlbmdlciwgT3JkZXIsIEludmVudG9yeSwgQ291bnRyeUNvbGxlY3Rpb24gfSBmcm9tICcuLi8uLi9zaGFyZWQvbW9kZWwvaW5kZXgnO1xyXG5pbXBvcnQgeyBEYXRhU2VydmljZSwgQ2hlY2tpbk9yZGVyU2VydmljZSwgUGFzc2VuZ2VyU2VydmljZSwgVGltZU91dFNlcnZpY2UsIERlcGFydHVyZVNlcnZpY2UsIENoZWNraW5TZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9pbmRleFwiO1xyXG5pbXBvcnQgeyBDb252ZXJ0ZXJzIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgeyBBcHBFeGVjdXRpb250aW1lIH0gZnJvbSBcIi4uLy4uL2FwcC5leGVjdXRpb250aW1lXCI7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi8uLi9hcHAuY29uc3RhbnRzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6IFwibGlzdC1wYWdlXCIsXHJcbiAgICBwcm92aWRlcnM6IFtEYXRhU2VydmljZSwgUGFzc2VuZ2VyU2VydmljZSwgQ29uZmlndXJhdGlvbiwgRGVwYXJ0dXJlU2VydmljZSwgQ2hlY2tpblNlcnZpY2VdLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9jb21wb25lbnRzL2RlcGFydHVyZXBheGxpc3QvZGVwYXJ0dXJlcGF4bGlzdC5jb21wb25lbnQuaHRtbFwiLFxyXG4gICAgc3R5bGVVcmxzOiBbXCIuL2NvbXBvbmVudHMvZGVwYXJ0dXJlcGF4bGlzdC9kZXBhcnR1cmVwYXhsaXN0LmNvbXBvbmVudC5jc3NcIl1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBEZXBhcnR1cmVQYXhMaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICAgIGlzRXJyb3I6IGJvb2xlYW47XHJcbiAgICBlcnJvck1lc3NhZ2U6IHN0cmluZztcclxuICAgIGxvYWRlclByb2dyZXNzOiBMb2FkZXJQcm9ncmVzcztcclxuICAgIG9yZGVySUQ6IHN0cmluZztcclxuXHJcbiAgICBwdWJsaWMgUGFzc2VuZ2VyRGV0YWlsczogYW55O1xyXG4gICAgcHVibGljIENvdW50cnlEZXRhaWxzOiBDb3VudHJ5Q29sbGVjdGlvbi5Db2xsZWN0aW9uO1xyXG4gICAgcHVibGljIFNlYXJjaEJ5TmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIFBhc3Nlbmdlckxpc3RPbGQ6IEFycmF5PFBhc3Nlbmdlckxpc3RUZW1wbGF0ZT47XHJcbiAgICBwdWJsaWMgUGFzc2VuZ2VyTGlzdDogQXJyYXk8RGVwYXJ0dXJlUGF4TGlzdD4gPSBbXTtcclxuICAgIHB1YmxpYyBOZXdQYXNzZW5nZXJMaXN0OiBBcnJheTxEZXBhcnR1cmVQYXhMaXN0PiA9IFtdO1xyXG4gICAgcHVibGljIE5vdENoZWNrZWRJblBhc3Nlbmdlckxpc3Q6IEFycmF5PERlcGFydHVyZVBheExpc3Q+ID0gW107XHJcbiAgICBwdWJsaWMgQ2hlY2tlZEluUGFzc2VuZ2VyTGlzdDogQXJyYXk8RGVwYXJ0dXJlUGF4TGlzdD4gPSBbXTtcclxuICAgIHB1YmxpYyBubDogYW55O1xyXG4gICAgcHJpdmF0ZSBsb2NhdGlvbmNvZGU6IHN0cmluZztcclxuICAgIHByaXZhdGUgZmxpZ2h0Y29kZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBkYXRlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGRhdGUxOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGRhdGUyOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgY2hlY2tlZFBheENvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIG5vdENoZWNrZWRQYXhDb3VudDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgZmxpZ2h0RGF0ZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHVzZXJkZXRhaWxzOiBhbnk7XHJcbiAgICBwdWJsaWMgRGVwYXJ0dXJlQXJyYXk6IEFycmF5PERlcGFydHVyZUluZm8xLkRlcGFydHVyZT4gPSBbXTtcclxuICAgIHByaXZhdGUgZGQ6IHN0cmluZzsgcHJpdmF0ZSBtbTogc3RyaW5nOyBwcml2YXRlIHl5eXk6IHN0cmluZztcclxuICAgIHB1YmxpYyBjaGVja2luaW5kOiBudW1iZXIgPSAxO1xyXG4gICAgcHVibGljIGluZDE6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIGluZDI6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBEZXN0aW5hdGlvbkNvZGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgRGVzdGluYXRpb25Db2RlMTogc3RyaW5nID0gbnVsbDtcclxuICAgIHB1YmxpYyBPcmlnaW5Db2RlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIEZsaWdodEluZm86IGFueTtcclxuICAgIGNoZWNrZWRDb3VudDogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBpbnZlbnQ6IGFueTtcclxuICAgIHB1YmxpYyBpbmJvdW5kOiBhbnk7XHJcbiAgICBwdWJsaWMgb3V0Ym91bmQ6IGFueTtcclxuICAgIHB1YmxpYyBzdGF0dXM6IGFueTtcclxuICAgIHB1YmxpYyBvdXRib3VuMTogT3V0Qm91bmQuT3V0Ym91ID0gbmV3IE91dEJvdW5kLk91dGJvdSgpO1xyXG4gICAgcHVibGljIGluYm91bjE6IEluQm91bmQuSW5ib3UgPSBuZXcgSW5Cb3VuZC5JbmJvdSgpO1xyXG4gICAgcHVibGljIGludmVudDE6IEludmVudG9yeS5Sb290T2JqZWN0ID0gbmV3IEludmVudG9yeS5Sb290T2JqZWN0KCk7XHJcbiAgICBwdWJsaWMgU2Vjb25kTGVnRGVzdGluYXRpb246IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgaXNNdWxpdExlZ0ZsaWdodDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIEFkZGl0aW9uYWxEb2N1bWVudHM6IGFueTtcclxuICAgIHB1YmxpYyBpc0NvbXBlbnNhdGlvbkVuYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBpc0NoZWNraW5EaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzR2F0ZURpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBAVmlld0NoaWxkKCdwYWdlY29udGFpbmVyJykgcGFnZUNvbnQ6IEVsZW1lbnRSZWY7XHJcbiAgICBAVmlld0NoaWxkKCdzZWdiYXInKSBzZWdiYXI6IEVsZW1lbnRSZWY7XHJcblxyXG4gICAgLy8gQFZpZXdDaGlsZCgndGFibm90Y2hlY2tpbicpIHRhYm5vdGNoZWNraW46IEVsZW1lbnRSZWY7XHJcbiAgICBwdWJsaWMgcGF4TGlzdDogQXJyYXk8UGFzc2VuZ2VyPjtcclxuICAgIHB1YmxpYyBhcGlzZGV0YWlsczogQXJyYXk8U2VnbWVudGVkQmFySXRlbT47XHJcbiAgICBwdWJsaWMgaXRlbSA9IG5ldyBTZWdtZW50ZWRCYXJJdGVtKCk7XHJcbiAgICBwdWJsaWMgc2Vjb25kSXRlbSA9IG5ldyBTZWdtZW50ZWRCYXJJdGVtKCk7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgX2NoZWNraW46IENoZWNraW5TZXJ2aWNlLCBwcml2YXRlIHBhZ2U6IFBhZ2UsIHB1YmxpYyBfdGltZW91dFNlcnZpY2U6IFRpbWVPdXRTZXJ2aWNlLCBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMsIHB1YmxpYyBfZGF0YVNlcnZpY2U6IERhdGFTZXJ2aWNlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIGxvY2F0aW9uOiBMb2NhdGlvbiwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZXI6IEFjdGl2YXRlZFJvdXRlLCBwdWJsaWMgX3NoYXJlZDogQ2hlY2tpbk9yZGVyU2VydmljZSwgcHVibGljIF9zZXJ2aWNlOiBQYXNzZW5nZXJTZXJ2aWNlLCBwdWJsaWMgZGVwYXJ0dXJlU2VydmljZTogRGVwYXJ0dXJlU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gXCJcIjtcclxuICAgICAgICB0aGlzLnBheExpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLmFwaXNkZXRhaWxzID0gW107XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcyA9IG5ldyBMb2FkZXJQcm9ncmVzcygpO1xyXG5cclxuICAgICAgICB0aGlzLml0ZW0udGl0bGUgPSBcIkNoZWNrZWRpblwiO1xyXG4gICAgICAgIHRoaXMuYXBpc2RldGFpbHMucHVzaCh0aGlzLml0ZW0pO1xyXG5cclxuICAgICAgICB0aGlzLnNlY29uZEl0ZW0udGl0bGUgPSBcIk5vdCBDaGVja2VkaW5cIjtcclxuICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5zZWNvbmRJdGVtKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCd+L2ltYWdlcy9sb2dpbl9iYWNrLmpwZWcnKVwiO1xyXG4gICAgICAgIHRoaXMucGFnZS5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9IFwiY292ZXIgXCI7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5pbml0TG9hZGVyKHRoaXMucGFnZUNvbnQpO1xyXG4gICAgICAgIHRoaXMuZGF0ZSA9IG5ldyBEYXRlKCkudG9KU09OKCkuc2xpY2UoMCwgMTApLnJlcGxhY2UoLy0vZywgJy0nKTtcclxuICAgICAgICB0aGlzLmRhdGUxID0gbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdChcIkREIE1NTSBZWVlZXCIpO1xyXG4gICAgICAgIHRoaXMudXNlcmRldGFpbHMgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcInVzZXJkZXRhaWxzXCIsIFwiXCIpO1xyXG4gICAgICAgIHRoaXMuaXNDaGVja2luRGlzYWJsZWQgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJjaGVja2luRGlzYWJsZWRcIik7XHJcbiAgICAgICAgdGhpcy5pc0dhdGVEaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImdhdGVEaXNhYmxlZFwiKTtcclxuICAgICAgICBsZXQgdXNlcmxvY2F0aW9uOiBTdHJpbmcgPSB0aGlzLnVzZXJkZXRhaWxzO1xyXG4gICAgICAgIHRoaXMubG9jYXRpb25jb2RlID0gdXNlcmxvY2F0aW9uLnN1YnN0cmluZygwLCAzKTtcclxuICAgICAgICB0aGlzLmlzQ29tcGVuc2F0aW9uRW5hYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNvbXBlbnNhdGlvbkVuYWJsZWRcIik7XHJcbiAgICAgICAgdGhpcy5hY3RpdmF0ZWRSb3V0ZXIucXVlcnlQYXJhbXMuc3Vic2NyaWJlKChwYXJhbXMpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5mbGlnaHRjb2RlID0gcGFyYW1zW1wiZGF0YVwiXTtcclxuICAgICAgICAgICAgdGhpcy5EZXBhcnR1cmVBcnJheSA9IEpTT04ucGFyc2UocGFyYW1zW1wicGF4XCJdKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5HZXRDb3VudHJ5KCk7XHJcbiAgICAgICAgdGhpcy5nZXREb2N1bWVudFR5cGUoKTtcclxuICAgICAgICB0aGlzLkdldEZRVFYoKTtcclxuICAgICAgICB0aGlzLmdldFBhc3Nhbmdlckxpc3QodGhpcy5EZXBhcnR1cmVBcnJheSk7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gdGhpcy5wYWdlQ29udC5uYXRpdmVFbGVtZW50XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBvYnNlcnZlciA9IGxhYmVsLm9uKFwibG9hZGVkLCB0YXAsIGxvbmdQcmVzcywgc3dpcGUsIG5nTW9kZWxDaGFuZ2VcIiwgZnVuY3Rpb24gKGFyZ3M6IGdlc3R1cmVzLkdlc3R1cmVFdmVudERhdGEpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFdmVudDogXCIgKyBhcmdzLmV2ZW50TmFtZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuX3RpbWVvdXRTZXJ2aWNlLnRpbWVyKTtcclxuICAgICAgICAgICAgc2VsZi5fdGltZW91dFNlcnZpY2UucmVzZXRXYXRjaCgpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9zaGFyZWQuU2V0QmFnVGFnKG51bGwpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXREb2N1bWVudFR5cGUoKSB7XHJcbiAgICAgICAgdGhpcy5fZGF0YVNlcnZpY2UuZG9jdW1lbnRUeXBlKCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLkFkZGl0aW9uYWxEb2N1bWVudHMgPSBkYXRhLlJlZmVyZW5jZUluZm9bMF0uQWRjRG9jdW1lbnRzVG9BcHBlbmQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRBZGRpdGlvbmFsRG9jdW1lbnRzKHRoaXMuQWRkaXRpb25hbERvY3VtZW50cyk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH0sIGVycm9yID0+IHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG5cclxuICAgICAgICB9KVxyXG5cclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRQYXNzYW5nZXJMaXN0KGRlcGFydHVyZTogYW55KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGVwYXJ0dXJlKTtcclxuICAgICAgICB0aGlzLmZsaWdodERhdGUgPSBkZXBhcnR1cmUuRGF0ZTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImRhdGVzXCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLmZsaWdodERhdGUpKTtcclxuICAgICAgICB0aGlzLl9kYXRhU2VydmljZS5HZXRGbGlnaHRJbmZvKHRoaXMuZmxpZ2h0Y29kZSwgdGhpcy5mbGlnaHREYXRlKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5GbGlnaHRJbmZvID0gZGF0YTtcclxuICAgICAgICAgICAgaWYgKGRhdGEuU3VjY2VzcyAhPSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuRmxpZ2h0c1swXS5MZWdzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTXVsaXRMZWdGbGlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuT3JpZ2luQ29kZSA9IGRhdGEuRmxpZ2h0c1swXS5MZWdzWzBdLkRlcGFydHVyZUFpcnBvcnQuTG9jYXRpb25Db2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRGVzdGluYXRpb25Db2RlID0gZGF0YS5GbGlnaHRzWzBdLkxlZ3NbMF0uQXJyaXZhbEFpcnBvcnQuTG9jYXRpb25Db2RlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlNlY29uZExlZ0Rlc3RpbmF0aW9uID0gZGF0YS5GbGlnaHRzWzBdLkxlZ3NbMV0uQXJyaXZhbEFpcnBvcnQuTG9jYXRpb25Db2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuRGVwYXJ0dXJlQXJyYXlbMF0uRmxpZ2h0U3RhdHVzID0gZGF0YS5GbGlnaHRzWzBdLkxlZ3NbMF0uU3RhdHVzOyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5GbGlnaHREZWF0aWxzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOZXh0RGVzdHNcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuRGVzdGluYXRpb25Db2RlKSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuT3JpZ2luQ29kZSA9IGRhdGEuRmxpZ2h0c1swXS5MZWdzWzBdLkRlcGFydHVyZUFpcnBvcnQuTG9jYXRpb25Db2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRGVzdGluYXRpb25Db2RlID0gZGF0YS5GbGlnaHRzWzBdLkxlZ3NbMF0uQXJyaXZhbEFpcnBvcnQuTG9jYXRpb25Db2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRmxpZ2h0RGVhdGlscygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvck1lc3NhZ2UpLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvbiBmb3IgdGhpcyBzZWFyY2ggXCIgKyBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgZXJyb3JNZXNzYWdlID0gZXJyb3IudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIC8vIGlmIChlcnJvck1lc3NhZ2UuaW5kZXhPZihcIlVucmVjb2duaXplZCB0b2tlbiAnPCdcIikgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGl0bGU6IFwiU2Vzc2lvbiBUaW1lIE91dFwiLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBtZXNzYWdlOiBcIllvdXIgc2Vzc2lvbiBoYXMgYmVlbiB0aW1lIG91dFwiLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxyXG4gICAgICAgICAgICAgICAgLy8gICAgIH07XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgZGlhbG9ncy5hbGVydChvcHRpb25zKS50aGVuKCgpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMubmF2aWdhdGVUb2xvZ2luKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBUb2FzdC5tYWtlVGV4dChcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvbiBmb3IgdGhpcyBzZWFyY2ggXCIgKyBlcnJvcikuc2hvdygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgfVxyXG4gICAgZmlsdGVyKGFyZ3M6IGFueSkge1xyXG4gICAgICAgIGxldCBzZWdCYXJFbG0gPSA8U2VnbWVudGVkQmFyPnRoaXMuc2VnYmFyLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gc2VnQmFyRWxtLnNlbGVjdGVkSW5kZXg7XHJcbiAgICAgICAgY29uc29sZS5sb2coaW5kZXgpO1xyXG4gICAgICAgIGlmIChhcmdzICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID09IDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXJncy50b1N0cmluZygpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk5ld1Bhc3Nlbmdlckxpc3QgPSB0aGlzLkNoZWNrZWRJblBhc3Nlbmdlckxpc3QuZmlsdGVyKHIgPT4gci5TdXJuYW1lLmluZGV4T2YobmFtZS50cmltKCkpID49IDAgfHwgci5HaXZlbk5hbWUuaW5kZXhPZihuYW1lLnRyaW0oKSkgPj0gMCk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmdzLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuTmV3UGFzc2VuZ2VyTGlzdCA9IHRoaXMuTm90Q2hlY2tlZEluUGFzc2VuZ2VyTGlzdC5maWx0ZXIociA9PiByLlN1cm5hbWUuaW5kZXhPZihuYW1lLnRyaW0oKSkgPj0gMCB8fCByLkdpdmVuTmFtZS5pbmRleE9mKG5hbWUudHJpbSgpKSA+PSAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk5ld1Bhc3Nlbmdlckxpc3QgPSB0aGlzLkNoZWNrZWRJblBhc3Nlbmdlckxpc3Q7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk5ld1Bhc3Nlbmdlckxpc3QgPSB0aGlzLk5vdENoZWNrZWRJblBhc3Nlbmdlckxpc3RcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG4gICAgcHVibGljIEZsaWdodERlYXRpbHMoKTogdm9pZCB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XHJcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRlMikpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuZmxpZ2h0Y29kZSkpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMubG9jYXRpb25jb2RlKSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRlMikpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2VhcmNoQWxsUGF4QnlGbGlnaHQgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcclxuICAgICAgICAgICAgdGhpcy5fY2hlY2tpbi5Cb29raW5nQ291bnREaXNwbGF5KHRoaXMuZmxpZ2h0RGF0ZSwgdGhpcy5mbGlnaHRjb2RlLCB0aGlzLmxvY2F0aW9uY29kZSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW52ZW50b3J5OiBhbnkgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW52ZW50MS5pbnZlbiA9IENvbnZlcnRlcnMuQ29udmVydFRvSW52ZW50b3J5KGludmVudG9yeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIodGhpcy5pbnZlbnQxKTtcclxuICAgICAgICAgICAgICAgIH0sIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy9JbmJvdW5kXHJcbiAgICAgICAgICAgIHRoaXMuX2NoZWNraW4uSW5Cb3VuZCh0aGlzLmZsaWdodERhdGUsIHRoaXMuZmxpZ2h0Y29kZSwgdGhpcy5sb2NhdGlvbmNvZGUpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluQm91bmQ6IGFueSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmJvdW5kID0gQ29udmVydGVycy5Db252ZXJ0VG9JbkJvdW5kKGluQm91bmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKHRoaXMuaW5ib3VuZCk7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLy9PdXRib3VuZFxyXG4gICAgICAgICAgICB0aGlzLl9jaGVja2luLk91dEJvdW5kKHRoaXMuZmxpZ2h0RGF0ZSwgdGhpcy5mbGlnaHRjb2RlLCB0aGlzLkRlc3RpbmF0aW9uQ29kZSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgT3V0Qm91bmQ6IGFueSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRib3VuZCA9IENvbnZlcnRlcnMuQ29udmVydFRvT3V0Qm91bmQoT3V0Qm91bmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKHRoaXMub3V0Ym91bmQpO1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8vc3RhdHVzXHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGFTZXJ2aWNlLlN0YXR1cyh0aGlzLmZsaWdodERhdGUsIHRoaXMuZmxpZ2h0Y29kZSwgdGhpcy5sb2NhdGlvbmNvZGUpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXR1czogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cy5GbGlnaHRzWzBdLkxlZ3NbMF0uU3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5EZXBhcnR1cmVBcnJheVswXS5GbGlnaHRTdGF0dXMgPSBzdGF0dXMuRmxpZ2h0c1swXS5MZWdzWzBdLlN0YXR1cztcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLkRlcGFydHVyZUFycmF5WzBdLkZsaWdodFN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB0aGlzLmdldFBheGJ5RmxpZ2h0KFwiQUxMXCIsIHRoaXMuZmxpZ2h0RGF0ZSwgdGhpcy5mbGlnaHRjb2RlLCB0aGlzLmxvY2F0aW9uY29kZSwgdGhpcy5jaGVja2luaW5kKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgIC8vIH0sIDEwMDAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFBheGJ5RmxpZ2h0KG5hbWU6IHN0cmluZywgZGF0ZTogc3RyaW5nLCBmbGlnaHRjb2RlOiBzdHJpbmcsIGxvY2F0aW9uY29kZTogc3RyaW5nLCBjaGVja2luZDogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWFyY2hBbGxQYXhCeUZsaWdodCBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBTdGFydCBEYXRlIFRpbWUgOiAnICsgc0RhdGUpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5kZXBhcnR1cmVTZXJ2aWNlLlNlYXJjaEFsbFBheEJ5RmxpZ2h0KG5hbWUsIGRhdGUsIGZsaWdodGNvZGUsIHRoaXMubG9jYXRpb25jb2RlKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRBUElTRG9jdW1lbnQobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFNjYW5BUElTRG9jdW1lbnQobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuU3VjY2VzcyAhPSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGllcjogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFRpZXIodGllcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGFzc2VuZ2VyRGV0YWlscyA9IDxPcmRlci5QYXNzZW5nZXJEZXRhaWxMaXN0PmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGFzc2VuZ2VyTGlzdCA9IENvbnZlcnRlcnMuQ29udmVydFRvUGF4QnlGbGlnaHRmb3JEZXBhcnR1cmVUZW1wbGF0ZSh0aGlzLlBhc3NlbmdlckRldGFpbHMsIGNoZWNraW5kLCB0aGlzLmxvY2F0aW9uY29kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ2hlY2tlZEluUGFzc2VuZ2VyTGlzdCA9IHRoaXMuUGFzc2VuZ2VyTGlzdC5maWx0ZXIociA9PiByLkNoZWNraW5TdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrZWRQYXhDb3VudCA9IHRoaXMuQ2hlY2tlZEluUGFzc2VuZ2VyTGlzdC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuaXRlbS50aXRsZSA9KyBcIiAoXCIrIHRoaXMuY2hlY2tlZFBheENvdW50ICsgXCIpXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Ob3RDaGVja2VkSW5QYXNzZW5nZXJMaXN0ID0gdGhpcy5QYXNzZW5nZXJMaXN0LmZpbHRlcihyID0+IHIuQ2hlY2tpblN0YXR1cyA9PSBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm90Q2hlY2tlZFBheENvdW50ID0gdGhpcy5Ob3RDaGVja2VkSW5QYXNzZW5nZXJMaXN0Lmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjaGVja2VkIGluOlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5jaGVja2VkUGF4Q291bnQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgY2hlY2tlZCBpbjpcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMubm90Q2hlY2tlZFBheENvdW50KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc3QgaXRlbSA9IG5ldyBTZWdtZW50ZWRCYXJJdGVtKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbS50aXRsZSA9IFwiQ2hlY2tlZGluIFwiICsgXCIoXCIgKyB0aGlzLmNoZWNrZWRQYXhDb3VudCArIFwiKVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5pdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc3Qgc2Vjb25kSXRlbSA9IG5ldyBTZWdtZW50ZWRCYXJJdGVtKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2Vjb25kSXRlbS50aXRsZSA9IFwiTm90IENoZWNrZWRpbiBcIiArIFwiKFwiICsgdGhpcy5ub3RDaGVja2VkUGF4Q291bnQgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGlzZGV0YWlscy5wdXNoKHRoaXMuc2Vjb25kSXRlbSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLk5ld1Bhc3Nlbmdlckxpc3QgPSB0aGlzLkNoZWNrZWRJblBhc3Nlbmdlckxpc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAodGhpcy5DaGVja2VkSW5QYXNzZW5nZXJMaXN0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBUb2FzdC5tYWtlVGV4dChcIk5vIENoZWNrZWRJbiBQYXNzZW5nZXIgaW4gdGhpcyBGTGlnaHRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLldhcm5pbmdzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGRhdGEuV2FybmluZ3NbMF0uTWVzc2FnZSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5XYXJuaW5ncyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChkYXRhLldhcm5pbmdzWzBdLk1lc3NhZ2UpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5uYXZpdGVUb0RlcGFydHVyZWFsbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZG50IGZpbmQgaW5mb3JtYXRpb24gZm9yIHRoaXMgc2VhcmNoIFwiICsgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJVbnJlY29nbml6ZWQgdG9rZW4gJzwnXCIpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aXRsZTogXCJTZXNzaW9uIFRpbWUgT3V0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGJlZW4gdGltZSBvdXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMubmF2aWdhdGVUb2xvZ2luKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRvYXN0Lm1ha2VUZXh0KFwiQ291bGRudCBmaW5kIGluZm9ybWF0aW9uIGZvciB0aGlzIHNlYXJjaCBcIiArIGVycm9yKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEYXRhIFJldHJpZXZlZCBzdWNjZXNzZnVsbHknICsgdGhpcy5QYXNzZW5nZXJEZXRhaWxzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2VhcmNoQWxsUGF4QnlGbGlnaHQgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlRGF0ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWFyY2hBbGxQYXhCeUZsaWdodCBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xyXG4gICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBHZXRDb3VudHJ5KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgQ291bnRyaWVzIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UuR2V0Q291bnRyaWVzKClcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db3VudHJ5RGV0YWlscyA9IDxDb3VudHJ5Q29sbGVjdGlvbi5Db2xsZWN0aW9uPmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldENvdW50cnkodGhpcy5Db3VudHJ5RGV0YWlscyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciBlcnJvck1lc3NhZ2UgPSBlcnIudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGVycm9yTWVzc2FnZS5pbmRleE9mKFwiVW5yZWNvZ25pemVkIHRva2VuICc8J1wiKSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGl0bGU6IFwiU2Vzc2lvbiBUaW1lIE91dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIG1lc3NhZ2U6IFwiWW91ciBzZXNzaW9uIGhhcyBiZWVuIHRpbWUgb3V0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgb2tCdXR0b25UZXh0OiBcIk9LXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBkaWFsb2dzLmFsZXJ0KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLm5hdmlnYXRlVG9sb2dpbigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBDb3VudHJpZXMgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlRGF0ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgQ291bnRyaWVzIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEdldEZRVFYoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZGF0YVNlcnZpY2UuRlFUVigpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldEZRVFYoZGF0YSk7XHJcbiAgICAgICAgICAgIH0sIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBHZXRPcmRlckRldGFpbHMoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgUGFzc2VuZ2VyIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UuR2V0UGFzc2VuZ2VyKGlkKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUuZGlyKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRBUElTRG9jdW1lbnQobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFNjYW5BUElTRG9jdW1lbnQobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuSUQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5UaWNrZXRpbmdTdGF0dXMgIT0gXCJOb3QgVGlja2V0ZWRcIiAmJiBkYXRhLlRpY2tldGluZ1N0YXR1cyAhPSBcIlBhcnRpYWxseSBUaWNrZXRlZFwiICYmIGRhdGEuSXNPdXRPZlN5bmNUaWNrZXQgIT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuU2VnbWVudHMgIT0gbnVsbCAmJiBkYXRhLlNlZ21lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgUE9TTG9jYXRpb24gPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcInVzZXJkZXRhaWxzXCIsIFwiXCIpLnN1YnN0cigwLCAzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5TZWdtZW50cy5maWx0ZXIobSA9PiBtLk9yaWdpbi5BaXJwb3J0Q29kZSA9PSBQT1NMb2NhdGlvbikubGVuZ3RoID4gMCAmJiBkYXRhLlNlZ21lbnRzLmZpbHRlcihtID0+IG0uT3JpZ2luLkFpcnBvcnRDb2RlID09IFBPU0xvY2F0aW9uKVswXS5TdGF0dXMuaXNXYWl0bGlzdGVkUGFzc2VuZ2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRJc1dhaXRsaXN0ZWQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiV2FpdGxpc3RlZCBQYXNzZW5nZXJcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldElzV2FpdGxpc3RlZChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaXNXYWl0bGlzdGVkUGFzc2VuZ2VyIDogZmFsc2VcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0UGFzc2VuZ2VyKDxPcmRlci5Sb290T2JqZWN0PmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIodGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpLlBhc3NlbmdlcnNbMF0uRG9jdW1lbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzY1RhYmxlOiBhbnlbXSA9IHRoaXMuX3NoYXJlZC5HZXRTdGFydHVwVGFibGUoKS5UYWJsZXMuU2VjdXJpdHlDb2RlVGFibGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgUGFzc2VuZ2VyQXJyYXk6IGFueSA9IENvbnZlcnRlcnMuQ29udmVydFRvRmxpZ2h0V2l0aFBheFRlbXBsYXRlKHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKSwgbnVsbCwgc2NUYWJsZSwgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoUGFzc2VuZ2VyQXJyYXkuU2VnbWVudC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNldGRlcGFydHVyZURhdGU6IHN0cmluZyA9IG1vbWVudChQYXNzZW5nZXJBcnJheS5TZWdtZW50WzBdLkRlcGFydHVyZURhdGVUaW1lLnRvU3RyaW5nKCkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNldGZsaWdodG51bWJlcjogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChQYXNzZW5nZXJBcnJheS5TZWdtZW50WzBdLk1hcmtldGluZ0ZsaWdodC5zdWJzdHIoMCwgMikgPT0gXCJDTVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldGZsaWdodG51bWJlciA9IFBhc3NlbmdlckFycmF5LlNlZ21lbnRbMF0uTWFya2V0aW5nRmxpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChQYXNzZW5nZXJBcnJheS5TZWdtZW50WzBdLk9wZXJhdGluZ0ZsaWdodCAhPSBudWxsICYmIFBhc3NlbmdlckFycmF5LlNlZ21lbnRbMF0uT3BlcmF0aW5nRmxpZ2h0LnN1YnN0cigwLCAyKSA9PSBcIkNNXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0ZmxpZ2h0bnVtYmVyID0gUGFzc2VuZ2VyQXJyYXkuU2VnbWVudFswXS5PcGVyYXRpbmdGbGlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRmbGlnaHRudW1iZXIgPSBQYXNzZW5nZXJBcnJheS5TZWdtZW50WzBdLk1hcmtldGluZ0ZsaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2V0Y2l0eTogc3RyaW5nID0gUGFzc2VuZ2VyQXJyYXkuU2VnbWVudFswXS5EZXBhcnR1cmVDaXR5O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzZW5nZXJBcnJheS5TZWdtZW50LmZvckVhY2goKFNlZ0VsZSwgU2VnSW5uZGV4KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGVwYXJ0dXJlRGF0ZTogc3RyaW5nID0gbW9tZW50KFNlZ0VsZS5EZXBhcnR1cmVEYXRlVGltZS50b1N0cmluZygpKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmxpZ2h0bnVtYmVyOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTZWdFbGUuTWFya2V0aW5nRmxpZ2h0LnN1YnN0cigwLCAyKSA9PSBcIkNNXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodG51bWJlciA9IFNlZ0VsZS5NYXJrZXRpbmdGbGlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoU2VnRWxlLk9wZXJhdGluZ0ZsaWdodCAhPSBudWxsICYmIFNlZ0VsZS5PcGVyYXRpbmdGbGlnaHQuc3Vic3RyKDAsIDIpID09IFwiQ01cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0bnVtYmVyID0gU2VnRWxlLk9wZXJhdGluZ0ZsaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodG51bWJlciA9IFNlZ0VsZS5NYXJrZXRpbmdGbGlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNpdHk6IHN0cmluZyA9IFNlZ0VsZS5EZXBhcnR1cmVDaXR5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWdFbGUuZGF0ZSA9IG1vbWVudChTZWdFbGUuRGVwYXJ0dXJlRGF0ZVRpbWUudG9TdHJpbmcoKSkuZm9ybWF0KFwiREQtTU1NLVlZWVlcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZXN0aW5hdGlvbiA9IFNlZ0VsZS5EZXN0aW5hdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy9JbnZlbnRvcnlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tpbi5Cb29raW5nQ291bnREaXNwbGF5KGRlcGFydHVyZURhdGUsIGZsaWdodG51bWJlciwgY2l0eSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW52ZW50b3J5OiBhbnkgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5pbnZlbiA9IENvbnZlcnRlcnMuQ29udmVydFRvSW52ZW50b3J5KGludmVudG9yeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSW5ib3VuZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGVja2luLkluQm91bmQoZGVwYXJ0dXJlRGF0ZSwgZmxpZ2h0bnVtYmVyLCBjaXR5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbkJvdW5kOiBhbnkgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5pbmJvdW5kID0gQ29udmVydGVycy5Db252ZXJ0VG9JbkJvdW5kKGluQm91bmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vT3V0Ym91bmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tpbi5PdXRCb3VuZChkZXBhcnR1cmVEYXRlLCBmbGlnaHRudW1iZXIsIGRlc3RpbmF0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBPdXRCb3VuZDogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWdFbGUub3V0Ym91bmQgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb091dEJvdW5kKE91dEJvdW5kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3N0YXR1c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNDb21wbGV0ZWQgOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFTZXJ2aWNlLlN0YXR1cyhkZXBhcnR1cmVEYXRlLCBmbGlnaHRudW1iZXIsIGNpdHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLkZsaWdodHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXR1czogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VnRWxlLnN0YXR1cyA9IHN0YXR1cy5GbGlnaHRzWzBdLkxlZ3NbMF0uU3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgT3JpZ2lubG9jRGV0YWlscyA9IHN0YXR1cy5GbGlnaHRzWzBdLkxlZ3MuZmlsdGVyKG0gPT4gbS5EZXBhcnR1cmVBaXJwb3J0LkxvY2F0aW9uQ29kZSA9PSBTZWdFbGUuT3JpZ2luKVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGbGlnaHQgb3JpZ2luOlwiICsgU2VnRWxlLk9yaWdpbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmxpZ2h0IG9yaWdpbjpcIiArIEpTT04uc3RyaW5naWZ5KE9yaWdpbmxvY0RldGFpbHMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYoU2VnRWxlLk9yaWdpbiA9PSBzdGF0dXMuRmxpZ2h0c1swXS5MZWdzLmZpbHRlcihtPT4gbS5EZXBhcnR1cmVBaXJwb3J0KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VnRWxlLkxlZ3MgPSBzdGF0dXMuRmxpZ2h0c1swXS5MZWdzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWdFbGUuRVREID0gT3JpZ2lubG9jRGV0YWlscy5EZXBhcnR1cmVEYXRlVGltZS5Fc3RpbWF0ZWQudG9TdHJpbmcoKS5zdWJzdHIoMTEsIDUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWdFbGUuU1REID0gT3JpZ2lubG9jRGV0YWlscy5EZXBhcnR1cmVEYXRlVGltZS5TY2hlZHVsZWQudG9TdHJpbmcoKS5zdWJzdHIoMTEsIDUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWdFbGUuRVRBID0gT3JpZ2lubG9jRGV0YWlscy5BcnJpdmFsRGF0ZVRpbWUuU2NoZWR1bGVkLnRvU3RyaW5nKCkuc3Vic3RyKDExLCA1KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cy5GbGlnaHRzWzBdLkxlZ3NbMF0uRGVwYXJ0dXJlRGF0ZVRpbWUuRXN0aW1hdGVkLnRvU3RyaW5nKCkuc3Vic3RyKDExLCA1KSArIFwibGxsbFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhc3Nlbmdlckxlbmd0aCA9IFBhc3NlbmdlckFycmF5LlNlZ21lbnQubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3Nlbmdlckxlbmd0aCA9PSBTZWdJbm5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRCYWdUYWcobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0U2VnbWVudERldGFpbChQYXNzZW5nZXJBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbXVsdGlwbGVQYXNzZW5nZXI6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9DaGVja0luKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5XYXJuaW5nc1swXS5NZXNzYWdlKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXNzZW5nZXJMZW5ndGggPSBQYXNzZW5nZXJBcnJheS5TZWdtZW50Lmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXNzZW5nZXJMZW5ndGggPT0gU2VnSW5uZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0QmFnVGFnKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFNlZ21lbnREZXRhaWwoUGFzc2VuZ2VyQXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9DaGVja0luKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlzRXJyb3JPY2N1cmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLl9kYXRhU2VydmljZS5HZXRCYWdnYWdlKGlkKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5fc2hhcmVkLlNldEJhZ2dhZ2VjYXRhbG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5fc2hhcmVkLlNldFNlZ21lbnREZXRhaWwoUGFzc2VuZ2VyQXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLl9zaGFyZWQuU2V0QmFnVGFnKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLm5hdmlnYXRlVG9DaGVja0luKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSwgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgbGV0IGVycm9yOiBhbnkgPSB7IFwiRXJyb3JzXCI6IFt7IFwiTWVzc2FnZVwiOiBlcnIgfV0sIFwiU3VjY2Vzc1wiOiBmYWxzZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuX3NoYXJlZC5TZXRCYWdnYWdlY2F0YWxvZyhlcnJvcik7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5fc2hhcmVkLlNldFNlZ21lbnREZXRhaWwoUGFzc2VuZ2VyQXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLl9zaGFyZWQuU2V0QmFnVGFnKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLm5hdmlnYXRlVG9DaGVja0luKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVGllclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuX2RhdGFTZXJ2aWNlLlRpZXIoc2V0ZGVwYXJ0dXJlRGF0ZSwgc2V0ZmxpZ2h0bnVtYmVyLCBzZXRjaXR5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBsZXQgdGllcjogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRUaWVyKHRpZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLl9zaGFyZWQuU2V0U2VnbWVudERldGFpbChQYXNzZW5nZXJBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLm5hdmlnYXRlVG9DaGVja0luKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlNlZ21lbnRzICE9IG51bGwgJiYgZGF0YS5TZWdtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiTm90IGFibGUgdG8gcHJvY2VzcyAtIGdvIHRvIGNvdW50ZXJcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiTm8gcmVzZXJ2YXRpb25zIGFyZSBmb3VuZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJOb3QgYWJsZSB0byBwcm9jZXNzIC0gZ28gdG8gY291bnRlclwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlNlZ21lbnRzICE9IG51bGwgJiYgZGF0YS5TZWdtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk5vdCBhYmxlIHRvIHByb2Nlc3MgLSBnbyB0byBjb3VudGVyXCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiTm8gcmVzZXJ2YXRpb25zIGFyZSBmb3VuZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciBlcnJvck1lc3NhZ2UgPSBlcnIudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGVycm9yTWVzc2FnZS5pbmRleE9mKFwiVW5yZWNvZ25pemVkIHRva2VuICc8J1wiKSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGl0bGU6IFwiU2Vzc2lvbiBUaW1lIE91dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIG1lc3NhZ2U6IFwiWW91ciBzZXNzaW9uIGhhcyBiZWVuIHRpbWUgb3V0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgb2tCdXR0b25UZXh0OiBcIk9LXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBkaWFsb2dzLmFsZXJ0KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLm5hdmlnYXRlVG9sb2dpbigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgIHZhciBlRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgUGFzc2VuZ2VyIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnR2V0IFBhc3NlbmdlciBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlQ2hlY2tlZChhcmdzOiBhbnkpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhhcmdzKTtcclxuICAgICAgICB0aGlzLlBhc3Nlbmdlckxpc3QuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgZWxlbWVudC5Jc0NoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5jaGVja2VkQ291bnQtLTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgcGF4ID0gPERlcGFydHVyZVBheExpc3Q+YXJncy52aWV3LmJpbmRpbmdDb250ZXh0O1xyXG4gICAgICAgIHBheC5Jc0NoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY2hlY2tlZENvdW50ID0gMTtcclxuICAgICAgICB0aGlzLm9yZGVySUQgPSBwYXguT3JkZXJJZDtcclxuICAgICAgICBhcmdzLnZpZXcuYmluZGluZ0NvbnRleHQgPSBwYXg7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdvdG9DaGVja0luKCkge1xyXG4gICAgICAgIHRoaXMuR2V0T3JkZXJEZXRhaWxzKHRoaXMub3JkZXJJRCk7XHJcbiAgICB9XHJcbiAgICBuYXZpZ2F0ZVRvQ2hlY2tJbigpIHtcclxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY2hlY2tpblwiXSwge1xyXG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBcImRhdGFcIjogdGhpcy5vcmRlcklEXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIG5hdmlnYXRlVG9TZWFyY2goKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNDaGVja2luRGlzYWJsZWQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wic2VhcmNoXCJdLCB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBuYXZpZ2F0ZVRvRGVwYXJ0dXJlcygpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0dhdGVEaXNhYmxlZCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJkZXBhcnRob21lXCJdLCB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBuYXZpZ2F0ZVRvRGVwYXJ0dXJlYWxsKCkge1xyXG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJkZXBhcnRhbGxcIl0sIHtcclxuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2VsZWN0U2VnbWVudChlOiBhbnkpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImluc2lkZVwiKTtcclxuXHJcbiAgICAgICAgdmFyIHNlbEluZCA9IGUubmV3SW5kZXg7XHJcbiAgICAgICAgLy8gdmFyIHRhYnRjID0gdGhpcy50YWJjaGVja2luLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICAgICAgLy8gdmFyIHRhYmEgPSA8U3RhY2tMYXlvdXQ+dGhpcy50YWJub3RjaGVja2luLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICAgICAgaWYgKHNlbEluZCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuTmV3UGFzc2VuZ2VyTGlzdCA9IHRoaXMuQ2hlY2tlZEluUGFzc2VuZ2VyTGlzdDtcclxuXHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLk5ld1Bhc3Nlbmdlckxpc3QgPSB0aGlzLk5vdENoZWNrZWRJblBhc3Nlbmdlckxpc3Q7XHJcblxyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gbG9hZGVyKGFyZ3M6SXRlbUV2ZW50RGF0YSl7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJsb2RlZFwiKTtcclxuICAgIC8vICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgIC8vIH1cclxuICAgIG5hdmlnYXRlVG9TZXR0aW5nKCkge1xyXG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZXR0aW5nXCJdLCB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVUb2xvZ2luKCkge1xyXG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJcIl0sIHtcclxuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlU2VydmljZUVycm9yKGVycm9yOiBhbnkpIHtcclxuICAgICAgICB2YXIgZXJyb3JNZXNzYWdlID0gZXJyb3IudG9TdHJpbmcoKTtcclxuICAgICAgICBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJTZXNzaW9uVGltZW91dFwiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiU2Vzc2lvbiBUaW1lIE91dFwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGJlZW4gdGltZSBvdXRcIixcclxuICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPS1wiXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiXCJdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGVycm9yTWVzc2FnZSkuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG5hdmlnYXRlVG9Db21wZW5zYXRpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNDb21wZW5zYXRpb25FbmFibGVkID09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImNvbXBlbnNhdGlvblwiXSwge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJDb21wZW5zYXRpb24gTm90IGFwcGxpY2FibGVcIikuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=