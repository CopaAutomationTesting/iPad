"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var router_2 = require("nativescript-angular/router");
var dialogs = require("ui/dialogs");
var page_1 = require("ui/page");
//external modules and plugins
var ApplicationSettings = require("application-settings");
var Toast = require("nativescript-toast");
var moment = require("moment");
//app references
var index_1 = require("../../shared/model/index");
var index_2 = require("../../shared/interface/index");
var index_3 = require("../../shared/services/index");
var index_4 = require("../../shared/utils/index");
var app_constants_1 = require("../../app.constants");
var app_executiontime_1 = require("../../app.executiontime");
var SeatMapComponent = /** @class */ (function () {
    function SeatMapComponent(_checkin, page, _seatmap, _timeoutService, routerExtensions, router, location, _dataService, activatedRouter, _shared, _service) {
        this._checkin = _checkin;
        this.page = page;
        this._seatmap = _seatmap;
        this._timeoutService = _timeoutService;
        this.routerExtensions = routerExtensions;
        this.router = router;
        this.location = location;
        this._dataService = _dataService;
        this.activatedRouter = activatedRouter;
        this._shared = _shared;
        this._service = _service;
        this.SeatMapList = new index_2.SeatMap.RootObject();
        this.ShowSeatMapList = new index_2.SeatMap.Item();
        this.items = [];
        this.seat = [new index_2.SeatMap.AirSeatList()];
        this.rowNumber = "";
        this.previousSeat = new index_2.SeatMap.AirSeatList();
        this.SelectedSeat = "";
        this.MultiSegmentPaxArray = new index_2.MultiSegmentTemplate.RootObject;
        this.PassedPassengerDetail = new index_2.PaxTemplate();
        this.PassengerArray = [];
        this.ButtonContinue = true;
        this.outboun1 = new index_2.OutBound.Outbou();
        this.inboun1 = new index_2.InBound.Inbou();
        this.invent1 = new index_1.Inventory.RootObject();
        this.showSeatMapKey = true;
        this.showAdvanceDisplay = true;
        this.AllSegSelected = true;
        this.AllSegNotSelected = false;
        this.PassengerList = [];
        this.NewPassengerList = [];
        this.FlightInfo = new index_2.MultiSegmentTemplate.FlightWithPax;
        this.previousFlightInfo = new index_2.MultiSegmentTemplate.FlightWithPax;
        this.SeatProductInfo = [];
        this.IsChecked1 = false;
        this.IsChecked2 = false;
        this.IsChecked3 = false;
        this.IsChecked4 = false;
        this.IsExitRowSelected = false;
        this.IsSeatSelected = false;
        this.IsInfantNotAllowedSelected = false;
        this.num = 0;
        this.isMultiLegFLight = false;
        this.isSegSelected = [];
        this.isSecondSegSelected = true;
        this.legsInfo = [];
        this.infantExitrowSeat = false;
        this.isMultiInitialPassengerCheck = false;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.SelectedPassenger = new index_2.MultiSegmentTemplate.Passenger();
        this.SelectedPassengerList = [];
        this.isCompensationEnabled = false;
        this.MultiIntialPax = false;
        this.MultiInitalNoSeatAssign = false;
        this.PassengerListForOASeatMap = new index_1.SeatMapOAPax.RootObject();
        this.FlightDate = "";
        this.isError = false;
        this.errorMessage = "";
        this.loaderProgress = new index_2.LoaderProgress();
        // this.SeatMapList = new SeatMap.SeatList();
    }
    SeatMapComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.loaderProgress.initLoader(this.pageCont);
        this.date = moment(new Date()).format("DD MMM YYYY");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled");
        this.MultiSegmentPaxArray = this._shared.GetSegmentDetail();
        this.activatedRouter.queryParams.subscribe(function (params) {
            try {
                _this.SelectedRPH = JSON.parse(params["RPHValue"]);
                _this.index = JSON.parse(params["index"]);
                _this.MultiSegmentPaxArray = _this._shared.GetSegmentDetail();
                _this.PassengerList = _this.MultiSegmentPaxArray.Segment[_this.index].Passenger;
                _this.FlightDate = moment(_this.MultiSegmentPaxArray.Segment[_this.index].FlightDate).format("DD-MMM-YYYY");
                _this.MultiSegmentPaxArray.Segment.forEach(function (data, index) {
                    if (data.MarketingFlight == _this.MultiSegmentPaxArray.Segment[_this.index].MarketingFlight) {
                        _this.FlightInfo = data;
                    }
                });
                _this.legsInfo = _this.MultiSegmentPaxArray.Segment[_this.index].Legs;
                _this.legsInfo.forEach(function (data, index) {
                    _this.isSegSelected[index] = true;
                    data.isLegSelected = true;
                });
                _this.PassengerList.forEach(function (data, Index) {
                    data.PrevSeat = data.SeatNumber;
                    data.SeatNumber = data.Seats[0].SeatNumber;
                    var nexIndex = Index + 1;
                    console.log("nexIndex:" + nexIndex);
                    if (_this.PassengerList[nexIndex].PassengerRefNumber) {
                        if (data.PassengerRefNumber == _this.PassengerList[nexIndex].PassengerRefNumber) {
                            _this.isMultiInitialPassengerCheck = true;
                            console.log("Inside MultiInitial");
                        }
                    }
                });
                _this.FlightNumber = _this.MultiSegmentPaxArray.Segment[_this.index].MarketingFlight;
                console.log("RPH:" + _this.SelectedRPH);
            }
            catch (Exception) {
            }
        });
        // let selPax = this.PassengerList.filter(pax => pax.RPH == this.SelectedRPH);
        // if (selPax && selPax.length > 0) {
        //     this.select(selPax[0]);
        // }
        // this.getSeatMap(true);
        var selPax = this.PassengerList.filter(function (pax) { return pax.RPH == _this.SelectedRPH; });
        if (selPax && selPax.length > 0) {
            this.select(selPax[0]);
        }
        var origin = this.MultiSegmentPaxArray.Segment[this.index].Origin;
        var destination = this.MultiSegmentPaxArray.Segment[this.index].Destination;
        this.SeatMapList = this._shared.GetSeatMap();
        this.ShowSeatMapList = this.SeatMapList.Items[0];
        this.SeatProductInfo = this.SeatMapList.Items[0].SeatProductInformation;
        if (this.SeatMapList.Items.length > 1) {
            this.isMultiLegFLight = true;
            this.legsInfo = this.MultiSegmentPaxArray.Segment[this.index].Legs;
            this.legsInfo.forEach(function (data, index) {
                _this.isSegSelected[index] = true;
                data.isLegSelected = true;
            });
            console.log("this.SeatMapList" + JSON.stringify(this.SeatMapList));
            this.ShowSeatMapList = this.SeatMapList.Items.filter(function (m) { return m.FlightSegment.Origin.LocationCode == origin && m.FlightSegment.Destination.LocationCode == destination; })[0];
            console.log("this.ShowSeatMapList" + JSON.stringify(this.ShowSeatMapList));
            this.FirstSegOrigin = this.SeatMapList.Items[0].FlightSegment.Origin.LocationCode;
            this.FirstSegDest = this.SeatMapList.Items[0].FlightSegment.Destination.LocationCode;
            this.SecondSegOrigin = this.SeatMapList.Items[2].FlightSegment.Origin.LocationCode;
            this.SecondSegDest = this.SeatMapList.Items[2].FlightSegment.Destination.LocationCode;
        }
        var label = this.pageCont.nativeElement;
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();
        });
        this.isMultiInitialPassenger();
    };
    SeatMapComponent.prototype.getSeatMap = function (isInit) {
        var _this = this;
        if (isInit === void 0) { isInit = false; }
        this.loaderProgress.showLoader();
        console.log("getSeatMap called here ");
        var FlightNumber = this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight;
        var OperatingFlight = this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight;
        var date = this.MultiSegmentPaxArray.Segment[this.index].DepartureDateTime.toString();
        var Date1 = date.slice(0, 10);
        var origin = this.MultiSegmentPaxArray.Segment[this.index].Origin;
        var destination = this.MultiSegmentPaxArray.Segment[this.index].Destination;
        console.log("Legs" + JSON.stringify(this.MultiSegmentPaxArray.Segment[this.index].Legs));
        console.log("dest" + JSON.stringify(FlightNumber.substr(0, 2)));
        if ((FlightNumber.substr(0, 2) == "CM" && this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight == null) || (this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight != null && this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight.substr(0, 2) == "CM")) {
            if (this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight != null && this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight.substr(0, 2) == "CM") {
                FlightNumber = this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight;
            }
            var selPax = this.PassengerList.filter(function (pax) { return pax.RPH == _this.SelectedRPH; });
            this._seatmap.GetSeatMap(FlightNumber, Date1, origin, selPax[0].FirstName, selPax[0].LastName, Number(selPax[0].PassengerSeqNumber), selPax[0].OrderID)
                .subscribe(function (result) {
                _this.seatmapDetails = result;
                _this._service.GetPassenger(_this.MultiSegmentPaxArray.Segment[_this.index].Passenger[0].OrderID)
                    .subscribe(function (data) {
                    _this._shared.SetPassenger(data);
                    _this.legsInfo = _this.MultiSegmentPaxArray.Segment[_this.index].Legs;
                    _this.legsInfo.forEach(function (data, index) {
                        _this.isSegSelected[index] = true;
                        data.isLegSelected = true;
                    });
                    var scTable = _this._shared.GetStartupTable().Tables.SecurityCodeTable;
                    _this.MultiSegmentPaxArray = index_4.Converters.ConvertToFlightWithPaxTemplate(_this._shared.GetPassenger(), null, scTable, "");
                    _this.MultiSegmentPaxArray.Segment[_this.index].Legs = _this.legsInfo;
                    _this.PassengerList = _this.MultiSegmentPaxArray.Segment[_this.index].Passenger;
                    _this.PassengerList.forEach(function (data, Index) {
                        // data.PrevSeat = data.SeatNumber;
                        data.SeatNumber = data.Seats[0].SeatNumber;
                    });
                    var selPax = _this.PassengerList.filter(function (pax) { return pax.RPH == _this.SelectedRPH; });
                    if (selPax && selPax.length > 0) {
                        _this.select(selPax[0]);
                    }
                    // console.log("SeatMap:" + JSON.stringify(this.seatmapDetails ));
                    _this.SeatMapList = index_4.Converters.ConvertToSeatMap(_this.seatmapDetails, _this.PassengerList, FlightNumber, _this.MultiSegmentPaxArray.Segment[_this.index].Legs, origin, destination);
                    console.log("SeatMap:" + JSON.stringify(_this.SeatMapList));
                    _this.ShowSeatMapList = _this.SeatMapList.Items[0];
                    _this.SeatProductInfo = _this.SeatMapList.Items[0].SeatProductInformation;
                    if (_this.SeatMapList.Items.length > 1) {
                        _this.isMultiLegFLight = true;
                        _this.legsInfo = _this.MultiSegmentPaxArray.Segment[_this.index].Legs;
                        _this.legsInfo.forEach(function (data, index) {
                            _this.isSegSelected[index] = true;
                            data.isLegSelected = true;
                        });
                        _this.ShowSeatMapList = _this.SeatMapList.Items.filter(function (m) { return m.FlightSegment.Origin.LocationCode == origin && m.FlightSegment.Destination.LocationCode == destination; })[0];
                        _this.FirstSegOrigin = _this.SeatMapList.Items[0].FlightSegment.Origin.LocationCode;
                        _this.FirstSegDest = _this.SeatMapList.Items[0].FlightSegment.Destination.LocationCode;
                        _this.SecondSegOrigin = _this.SeatMapList.Items[2].FlightSegment.Origin.LocationCode;
                        _this.SecondSegDest = _this.SeatMapList.Items[2].FlightSegment.Destination.LocationCode;
                    }
                    _this.loaderProgress.hideLoader();
                    if (result.Warnings.length > 0 || result.Warnings != null) {
                        console.log("toast");
                        result.Warnings.forEach(function (warning, index) {
                            Toast.makeText(warning.Message).show();
                        });
                    }
                }, function (error) {
                    _this.handleServiceError(error);
                    console.log(error);
                    _this.loaderProgress.hideLoader();
                });
            }, function (error) {
                console.log("Couldnt find seat information " + error);
                _this.handleServiceError(error);
                _this.loaderProgress.hideLoader();
            }, function () {
                console.log('Seat Map Retrieved successfully');
                // console.log('lenght' + this.SeatMapList.CabinList[0].AirRowList[0].AirSeatList.length.toString());
            });
        }
        else {
            if (FlightNumber.substr(0, 2) == "CM") {
                var FlightNum = OperatingFlight;
            }
            else {
                FlightNum = FlightNumber;
            }
            var PaxArray_1 = [new index_1.SeatMapOAPax.Passenger()];
            PaxArray_1.length = 0;
            this.PassengerList.forEach(function (paxData, Index) {
                var pax = new index_1.SeatMapOAPax.Passenger();
                pax.Firstname = paxData.FirstName;
                pax.Lastname = paxData.LastName;
                pax.GroupPNR = false;
                pax.OrderId = paxData.OrderID;
                pax.PassengerTypeCode = paxData.PassengerTypeCode;
                pax.RPH = paxData.RPH;
                PaxArray_1.push(pax);
            });
            this.PassengerListForOASeatMap.Passengers = PaxArray_1;
            var optionalRef = new index_1.SeatMapOAPax.OptionalFeeOptions();
            optionalRef.AccountCode = null;
            optionalRef.TicketDateOfIssue = null;
            optionalRef.TicketDesignator = null;
            optionalRef.TourCode = null;
            this.PassengerListForOASeatMap.OptionalFeeOptions = optionalRef;
            console.log("new Pax st:" + JSON.stringify(this.PassengerListForOASeatMap));
            var previousIndex = this.index - 1;
            var FlightNumber = this.MultiSegmentPaxArray.Segment[previousIndex].MarketingFlight;
            var OperatingFlight = this.MultiSegmentPaxArray.Segment[previousIndex].OperatingFlight;
            var date = this.MultiSegmentPaxArray.Segment[previousIndex].DepartureDateTime.toString();
            var Date1 = date.slice(0, 10);
            var origin = this.MultiSegmentPaxArray.Segment[previousIndex].Origin;
            var destination = this.MultiSegmentPaxArray.Segment[previousIndex].Destination;
            var selPax = this.PassengerList.filter(function (pax) { return pax.RPH == _this.SelectedRPH; });
            this._seatmap.GetSeatMap(FlightNumber, Date1, origin, selPax[0].FirstName, selPax[0].LastName, Number(selPax[0].PassengerSeqNumber), selPax[0].OrderID)
                .subscribe(function (result) {
                if (result.Items != null) {
                    _this.seatmapDetails = result;
                    var curorigin = _this.MultiSegmentPaxArray.Segment[_this.index].Origin;
                    var curdestination = _this.MultiSegmentPaxArray.Segment[_this.index].Destination;
                    _this.PassengerList = _this.MultiSegmentPaxArray.Segment[_this.index].Passenger;
                    _this.SeatMapList = index_4.Converters.OAseatmap(_this.seatmapDetails, _this.PassengerList, FlightNum, _this.MultiSegmentPaxArray.Segment[_this.index].Legs, curorigin, curdestination);
                    if (_this.SeatMapList.Items.length > 0) {
                        _this.ShowSeatMapList = _this.SeatMapList.Items[0];
                        _this.SeatProductInfo = _this.SeatMapList.Items[0].SeatProductInformation;
                    }
                    console.log("Outside seatmap");
                    _this.loaderProgress.hideLoader();
                    if (result.Warnings.length > 0 || result.Warnings != null) {
                        result.Warnings.forEach(function (warning, index) {
                            Toast.makeText(warning.Message).show();
                        });
                    }
                }
                else {
                    Toast.makeText(result.Warnings[0].Message).show();
                    _this.loaderProgress.hideLoader();
                }
            }, function (error) {
                console.log("Couldnt find seat information " + error);
                _this.handleServiceError(error);
                _this.loaderProgress.hideLoader();
            }, function () {
                console.log('Seat Map Retrieved successfully');
            });
        }
        console.log("successfull");
    };
    SeatMapComponent.prototype.catch = function (error) {
        console.log(error.message);
        this.loaderProgress.hideLoader();
    };
    SeatMapComponent.prototype.isMultiInitialPassenger = function () {
        console.log(this._shared.GetPassenger().Passengers.filter(function (m) { return m.GroupedGivenName.split('/').length >= 2; }).length);
        if (this._shared.GetPassenger().Passengers.filter(function (m) { return m.GroupedGivenName.split('/').length >= 2; }).length > 0) {
            if (this._shared.GetPassenger().Passengers.filter(function (m) { return m.GroupedGivenName.split('/').length == 2; }).length > 0 && this._shared.GetPassenger().Passengers.filter(function (m) { return m.AssociatedAdultRPH == null && m.AssociatedInfantRPH == null; }).length > 0) {
                this.MultiIntialPax = true;
            }
            else if (this._shared.GetPassenger().Passengers.filter(function (m) { return m.GroupedGivenName.split('/').length > 2; }).length > 0) {
                this.MultiIntialPax = true;
            }
            else
                this.MultiIntialPax = false;
        }
        else
            this.MultiIntialPax = false;
        console.log(this.MultiIntialPax);
    };
    SeatMapComponent.prototype.noSeat = function (passengerls) {
        passengerls.NoSeat = !passengerls.NoSeat;
        this.select(passengerls, true);
    };
    SeatMapComponent.prototype.refreshFlifo = function () {
        var _this = this;
        this.loaderProgress.showLoader();
        this.MultiSegmentPaxArray.Segment.forEach(function (SegEle, SegInndex) {
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
            _this._dataService.Status(departureDate, flightnumber, city)
                .subscribe(function (data) {
                var status = data;
                SegEle.status = status.Flights[0].Legs[0].Status;
                SegEle.Legs = status.Flights[0].Legs;
                SegEle.ETD = status.Flights[0].Legs[0].DepartureDateTime.Estimated.toString().substr(11, 5);
                SegEle.STD = status.Flights[0].Legs[0].DepartureDateTime.Scheduled.toString().substr(11, 5);
                SegEle.ETA = status.Flights[0].Legs[0].ArrivalDateTime.Scheduled.toString().substr(11, 5);
                console.log(status.Flights[0].Legs[0].DepartureDateTime.Estimated.toString().substr(11, 5) + "llll");
                var passengerLength = _this.MultiSegmentPaxArray.Segment.length - 1;
                if (passengerLength == SegInndex) {
                    _this._shared.SetBagTag(null);
                    _this._shared.SetSegmentDetail(_this.MultiSegmentPaxArray);
                    _this.loaderProgress.hideLoader();
                }
            });
        });
    };
    SeatMapComponent.prototype.assignSeat = function (passengerList, SeatCharacteristic) {
        var _this = this;
        try {
            this.MultiInitalNoSeatAssign = false;
            if (this.isMultiInitialPassengerCheck) {
                this.PassengerList.forEach(function (paxData, Index) {
                    if (paxData.SeatNumber == null && paxData.NoSeat == false) {
                        _this.MultiInitalNoSeatAssign = true;
                        Toast.makeText("Invalid Request - Multi-type seat request multi initial surname are not allowed.").show();
                    }
                    else if (paxData.SeatNumber == paxData.PrevSeat && paxData.NoSeat == false) {
                        _this.MultiInitalNoSeatAssign = true;
                        Toast.makeText("Invalid Request - Multi-type seat request multi initial surname are not allowed.").show();
                    }
                });
            }
            if (!this.MultiInitalNoSeatAssign) {
                var FlightNumber = this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight;
                if ((FlightNumber.substr(0, 2) == "CM" && this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight == null) || (this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight != null && this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight.substr(0, 2) == "CM")) {
                    this.loaderProgress.showLoader();
                    var Orders = this._shared.GetPassenger();
                    this.seatRequest = index_4.Converters.ConvertToAssignSeat(passengerList, this.FlightInfo, Orders, this.MultiSegmentPaxArray);
                    this.SelectedPassengerList = [];
                    console.log("Request : " + JSON.stringify(this.seatRequest));
                    this._seatmap.AssignSeat(this.seatRequest).subscribe(function (data) {
                        _this.seatResponse = data;
                        console.dir(data);
                        if (_this.seatResponse.Success != false) {
                            if (_this.seatResponse.CheckInResponse == null) {
                                console.log("3");
                                _this.seatResponse.ServiceResponse[0].Order.SegmentTravelerInfos.forEach(function (data, index) {
                                    if (data.SegmentRPH == _this.MultiSegmentPaxArray.Segment[_this.index].RPH) {
                                        _this.MultiSegmentPaxArray.Segment[_this.index].Passenger.forEach(function (PAxData, PaxIndex) {
                                            if (data.PassengerRPH == PAxData.RPH) {
                                                if (data.Seats[0].SeatNumber != null) {
                                                    PAxData.SeatNumber = data.Seats[0].SeatNumber;
                                                    PAxData.Seats = data.Seats;
                                                    var Passengers = _this._shared.GetPassenger();
                                                    Passengers.SegmentTravelerInfos.forEach(function (segEle, segindex) {
                                                        if (segEle.SegmentRPH == _this.MultiSegmentPaxArray.Segment[_this.index].RPH && segEle.PassengerRPH == data.PassengerRPH) {
                                                            segEle.Seats = PAxData.Seats;
                                                            _this._shared.GetPassenger().SegmentTravelerInfos[segindex].Seats = PAxData.Seats;
                                                        }
                                                    });
                                                }
                                                else {
                                                    // passengerList.IsSelected = false;
                                                    _this.getSeatMap();
                                                }
                                            }
                                        });
                                    }
                                });
                                // Toast.makeText(JSON.stringify(this.seatResponse.ServiceResponse[0].Warnings[0].Message)).show();
                                _this.seatResponse.CheckInResponse.Warnings.forEach(function (warning, index) {
                                    Toast.makeText(JSON.stringify(warning.Message)).show();
                                });
                                // passengerList.IsSelected = false;
                                _this.getSeatMap();
                            }
                            else if (_this.seatResponse.CheckInResponse.SegmentTravelerList == null) {
                                console.log("2");
                                if (_this.seatResponse.CheckInResponse.Errors != null) {
                                    _this.seatResponse.CheckInResponse.Errors.forEach(function (error, index) {
                                        Toast.makeText(JSON.stringify(error.Message)).show();
                                    });
                                    _this.getSeatMap();
                                }
                                else {
                                    if (_this.seatResponse.CheckInResponse.Warnings == null) {
                                        _this.getSeatMap();
                                    }
                                    else {
                                        // Toast.makeText(JSON.stringify(this.seatResponse.CheckInResponse.Warnings[0].Message)).show();
                                        _this.seatResponse.CheckInResponse.Warnings.forEach(function (warning, index) {
                                            Toast.makeText(JSON.stringify(warning.Message)).show();
                                        });
                                        // passengerList.IsSelected = false;
                                        _this.getSeatMap();
                                    }
                                }
                            }
                            else {
                                console.log("3");
                                if (_this.seatResponse.CheckInResponse.Warnings == null) {
                                    _this.seatResponse.CheckInResponse.SegmentTravelerList.forEach(function (segmentTravelinfo, index) {
                                        if (segmentTravelinfo.Seats[0].DepartureCode == _this.MultiSegmentPaxArray.Segment[_this.index].Origin && segmentTravelinfo.Seats[0].ArrivalCode == _this.MultiSegmentPaxArray.Segment[_this.index].Destination) {
                                            _this.MultiSegmentPaxArray.Segment[_this.index].Passenger.forEach(function (data, SegIndex) {
                                                if (data.FirstName == segmentTravelinfo.GivenName && data.LastName == segmentTravelinfo.LastName) {
                                                    data.SeatNumber = segmentTravelinfo.Seats[0].SeatNumber;
                                                    data.Seats = segmentTravelinfo.Seats;
                                                    var Passengers = _this._shared.GetPassenger();
                                                    Passengers.SegmentTravelerInfos.forEach(function (segEle, segindex) {
                                                        if (segEle.SegmentRPH == _this.MultiSegmentPaxArray.Segment[_this.index].RPH && segEle.PassengerRPH == segmentTravelinfo.PassengerRPH) {
                                                            segEle.Seats = data.Seats;
                                                            _this._shared.GetPassenger().SegmentTravelerInfos[segindex].Seats = data.Seats;
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    _this.seatResponse.CheckInResponse.Warnings.forEach(function (warning, index) {
                                        Toast.makeText(JSON.stringify(warning.Message)).show();
                                    });
                                    _this.seatResponse.CheckInResponse.SegmentTravelerList.forEach(function (segmentTravelinfo, index) {
                                        if (segmentTravelinfo.Seats) {
                                            if (segmentTravelinfo.Seats[0].DepartureCode == _this.MultiSegmentPaxArray.Segment[_this.index].Origin && segmentTravelinfo.Seats[0].ArrivalCode == _this.MultiSegmentPaxArray.Segment[_this.index].Destination) {
                                                _this.MultiSegmentPaxArray.Segment[_this.index].Passenger.forEach(function (data, SegIndex) {
                                                    if (data.FirstName == segmentTravelinfo.GivenName && data.LastName == segmentTravelinfo.LastName) {
                                                        console.log("init");
                                                        if (segmentTravelinfo.Seats[0].SeatNumber != null) {
                                                            data.SeatNumber = segmentTravelinfo.Seats[0].SeatNumber;
                                                            data.Seats = segmentTravelinfo.Seats;
                                                            var Passengers = _this._shared.GetPassenger();
                                                            Passengers.SegmentTravelerInfos.forEach(function (segEle, segindex) {
                                                                if (segEle.SegmentRPH == _this.MultiSegmentPaxArray.Segment[_this.index].RPH && segEle.PassengerRPH == segmentTravelinfo.PassengerRPH) {
                                                                    segEle.Seats = data.Seats;
                                                                    _this._shared.GetPassenger().SegmentTravelerInfos[segindex].Seats = data.Seats;
                                                                }
                                                            });
                                                            //this._shared.SetPassenger(Passengers);
                                                        }
                                                        // Toast.makeText(JSON.stringify(this.seatResponse.CheckInResponse.Warnings[0].Message)).show();
                                                        // passengerList.IsSelected = false;
                                                        _this.getSeatMap();
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                                _this.loaderProgress.hideLoader();
                                console.log("Response : " + JSON.stringify(_this.seatResponse));
                                if (_this.seatResponse.CheckInResponse.Errors != null) {
                                    _this.seatResponse.CheckInResponse.Errors.forEach(function (error, index) {
                                        Toast.makeText(JSON.stringify(error.Message)).show();
                                    });
                                    _this.getSeatMap();
                                }
                                else {
                                    if (_this.seatResponse.CheckInResponse.Warnings == null) {
                                        _this.getSeatMap();
                                    }
                                    else {
                                        // Toast.makeText(JSON.stringify(this.seatResponse.CheckInResponse.Warnings[0].Message)).show();
                                        _this.seatResponse.CheckInResponse.Warnings.forEach(function (warning, index) {
                                            Toast.makeText(JSON.stringify(warning.Message)).show();
                                        });
                                        // passengerList.IsSelected = false;
                                        _this.getSeatMap();
                                    }
                                }
                            }
                        }
                        else {
                            _this.loaderProgress.hideLoader();
                            if (_this.seatResponse.Errors != null && _this.seatResponse.Errors.length > 0) {
                                _this.seatResponse.Errors.forEach(function (error, index) {
                                    Toast.makeText(error.Message).show();
                                });
                            }
                        }
                        // this.GetOrderDetails(this.MultiSegmentPaxArray.Segment[this.index].Passenger[0].OrderID);                    
                    }, function (error) {
                        console.log("Seat assignment/update error " + error);
                        _this.handleServiceError(error);
                        _this.loaderProgress.hideLoader();
                    }, function () {
                        console.log(_this.seatRequest.length);
                        _this.ButtonContinue = true;
                    });
                    console.log("successfull");
                }
                else {
                    var isAllPaxCheckedIn = false;
                    this.SelectedPassengerList.forEach(function (paxData, Index) {
                        if (paxData.CheckinStatus == true) {
                            isAllPaxCheckedIn = true;
                        }
                        else {
                            isAllPaxCheckedIn = false;
                        }
                    });
                    if (isAllPaxCheckedIn) {
                        this.loaderProgress.showLoader();
                        var Orders = this._shared.GetPassenger();
                        console.dir(Orders);
                        // this.seatRequest = null;
                        this.seatRequest = index_4.Converters.ConvertToAssignSeat(passengerList, this.FlightInfo, Orders, this.MultiSegmentPaxArray);
                        this.SelectedPassengerList = [];
                        console.log("Request : " + JSON.stringify(this.seatRequest));
                        this._seatmap.AssignSeat(this.seatRequest).subscribe(function (data) {
                            _this.seatResponse = data;
                            console.dir(data);
                            if (_this.seatResponse.Success != false) {
                                if (_this.seatResponse.BadRequest == 400) {
                                    Toast.makeText(JSON.stringify(_this.seatResponse.ErrorMessage)).show();
                                    ;
                                    _this.getSeatMap();
                                }
                                if (_this.seatResponse.CheckInResponse == null) {
                                    console.log("3");
                                    _this.seatResponse.ServiceResponse[0].Order.SegmentTravelerInfos.forEach(function (data, index) {
                                        if (data.SegmentRPH == _this.MultiSegmentPaxArray.Segment[_this.index].RPH) {
                                            _this.MultiSegmentPaxArray.Segment[_this.index].Passenger.forEach(function (PAxData, PaxIndex) {
                                                if (data.PassengerRPH == PAxData.RPH) {
                                                    if (data.Seats[0].SeatNumber != null) {
                                                        PAxData.SeatNumber = data.Seats[0].SeatNumber;
                                                        PAxData.Seats = data.Seats;
                                                        var Passengers = _this._shared.GetPassenger();
                                                        Passengers.SegmentTravelerInfos.forEach(function (segEle, segindex) {
                                                            if (segEle.SegmentRPH == _this.MultiSegmentPaxArray.Segment[_this.index].RPH && segEle.PassengerRPH == data.PassengerRPH) {
                                                                segEle.Seats = PAxData.Seats;
                                                                _this._shared.GetPassenger().SegmentTravelerInfos[segindex].Seats = PAxData.Seats;
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        // passengerList.IsSelected = false;
                                                        _this.getSeatMap();
                                                    }
                                                }
                                            });
                                        }
                                    });
                                    // Toast.makeText(JSON.stringify(this.seatResponse.ServiceResponse[0].Warnings[0].Message)).show();
                                    _this.seatResponse.CheckInResponse.Warnings.forEach(function (warning, index) {
                                        Toast.makeText(JSON.stringify(warning.Message)).show();
                                    });
                                    // passengerList.IsSelected = false;
                                    _this.getSeatMap();
                                }
                                else if (_this.seatResponse.CheckInResponse.SegmentTravelerList == null) {
                                    console.log("2");
                                    if (_this.seatResponse.CheckInResponse.Errors != null) {
                                        _this.seatResponse.CheckInResponse.Errors.forEach(function (error, index) {
                                            Toast.makeText(JSON.stringify(error.Message)).show();
                                        });
                                        _this.getSeatMap();
                                    }
                                    else {
                                        if (_this.seatResponse.CheckInResponse.Warnings == null) {
                                            _this.getSeatMap();
                                        }
                                        else {
                                            // Toast.makeText(JSON.stringify(this.seatResponse.CheckInResponse.Warnings[0].Message)).show();
                                            _this.seatResponse.CheckInResponse.Warnings.forEach(function (warning, index) {
                                                Toast.makeText(JSON.stringify(warning.Message)).show();
                                            });
                                            // passengerList.IsSelected = false;
                                            _this.getSeatMap();
                                        }
                                    }
                                }
                                else {
                                    if (_this.seatResponse.CheckInResponse.Warnings == null) {
                                        _this.seatResponse.CheckInResponse.SegmentTravelerList.forEach(function (segmentTravelinfo, index) {
                                            if (segmentTravelinfo.SegmentRPH == _this.MultiSegmentPaxArray.Segment[_this.index].RPH) {
                                                _this.MultiSegmentPaxArray.Segment[_this.index].Passenger.forEach(function (data, SegIndex) {
                                                    if (data.FirstName == segmentTravelinfo.GivenName && data.LastName == segmentTravelinfo.LastName) {
                                                        data.SeatNumber = segmentTravelinfo.Seats[0].SeatNumber;
                                                        data.Seats = segmentTravelinfo.Seats;
                                                        var Passengers = _this._shared.GetPassenger();
                                                        Passengers.SegmentTravelerInfos.forEach(function (segEle, segindex) {
                                                            if (segEle.SegmentRPH == _this.MultiSegmentPaxArray.Segment[_this.index].RPH && segEle.PassengerRPH == segmentTravelinfo.PassengerRPH) {
                                                                segEle.Seats = data.Seats;
                                                                _this._shared.GetPassenger().SegmentTravelerInfos[segindex].Seats = data.Seats;
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        _this.seatResponse.CheckInResponse.SegmentTravelerList.forEach(function (segmentTravelinfo, index) {
                                            if (segmentTravelinfo.SegmentRPH == _this.MultiSegmentPaxArray.Segment[_this.index].RPH) {
                                                _this.MultiSegmentPaxArray.Segment[_this.index].Passenger.forEach(function (data, SegIndex) {
                                                    if (data.FirstName == segmentTravelinfo.GivenName && data.LastName == segmentTravelinfo.LastName) {
                                                        if (segmentTravelinfo.Seats != null) {
                                                            if (segmentTravelinfo.Seats[0].SeatNumber != null) {
                                                                data.SeatNumber = segmentTravelinfo.Seats[0].SeatNumber;
                                                                data.Seats = segmentTravelinfo.Seats;
                                                                var Passengers = _this._shared.GetPassenger();
                                                                Passengers.SegmentTravelerInfos.forEach(function (segEle, segindex) {
                                                                    if (segEle.SegmentRPH == _this.MultiSegmentPaxArray.Segment[_this.index].RPH && segEle.PassengerRPH == segmentTravelinfo.PassengerRPH) {
                                                                        segEle.Seats = data.Seats;
                                                                        _this._shared.GetPassenger().SegmentTravelerInfos[segindex].Seats = data.Seats;
                                                                    }
                                                                });
                                                                //this._shared.SetPassenger(Passengers);
                                                            }
                                                        }
                                                        // Toast.makeText(JSON.stringify(this.seatResponse.CheckInResponse.Warnings[0].Message)).show();
                                                        _this.seatResponse.CheckInResponse.Warnings.forEach(function (warning, index) {
                                                            Toast.makeText(JSON.stringify(warning.Message)).show();
                                                        });
                                                        // passengerList.IsSelected = false;
                                                        _this.getSeatMap();
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    _this.loaderProgress.hideLoader();
                                    console.log("Response : " + JSON.stringify(_this.seatResponse));
                                    if (_this.seatResponse.CheckInResponse.Errors != null) {
                                        _this.seatResponse.CheckInResponse.Errors.forEach(function (error, index) {
                                            Toast.makeText(JSON.stringify(error.Message)).show();
                                        });
                                        _this.getSeatMap();
                                    }
                                    else {
                                        if (_this.seatResponse.CheckInResponse.Warnings == null) {
                                            _this.getSeatMap();
                                        }
                                        else {
                                            // Toast.makeText(JSON.stringify(this.seatResponse.CheckInResponse.Warnings[0].Message)).show();
                                            _this.seatResponse.CheckInResponse.Warnings.forEach(function (warning, index) {
                                                Toast.makeText(JSON.stringify(warning.Message)).show();
                                            });
                                            // passengerList.IsSelected = false;
                                            _this.getSeatMap();
                                        }
                                    }
                                }
                            }
                            else {
                                _this.loaderProgress.hideLoader();
                                if (_this.seatResponse.Errors != null && _this.seatResponse.Errors.length > 0) {
                                    _this.seatResponse.Errors.forEach(function (error, index) {
                                        Toast.makeText(error.Message).show();
                                    });
                                }
                            }
                            // this.GetOrderDetails(this.MultiSegmentPaxArray.Segment[this.index].Passenger[0].OrderID);                    
                        }, function (error) {
                            console.log("Seat assignment/update error " + error);
                            _this.handleServiceError(error);
                            _this.loaderProgress.hideLoader();
                        }, function () {
                            console.log(_this.seatRequest.length);
                            _this.ButtonContinue = true;
                        });
                    }
                    else {
                        this.ButtonContinue = true;
                        // this.SelectedPassengerList.forEach((selectedPassenger, index) => {
                        //     this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((PaxData, PaxIndex) => {
                        //         if (PaxData.RPH == selectedPassenger.RPH) {
                        //             PaxData.SeatNumber = selectedPassenger.NewSeatNumber;
                        //             PaxData.Seats[0].SeatNumber = selectedPassenger.NewSeatNumber
                        //         }
                        //     });
                        var Passengers = this._shared.GetPassenger();
                        Passengers.SegmentTravelerInfos.forEach(function (segEle, segindex) {
                            _this.SelectedPassengerList.forEach(function (selectedPassenger, index) {
                                if (segEle.SegmentRPH == _this.MultiSegmentPaxArray.Segment[_this.index].RPH && segEle.PassengerRPH == selectedPassenger.RPH) {
                                    segEle.Seats[0].SeatNumber = selectedPassenger.NewSeatNumber;
                                    _this._shared.GetPassenger().SegmentTravelerInfos[segindex].Seats[0].SeatNumber = selectedPassenger.NewSeatNumber;
                                }
                            });
                        });
                        // })
                    }
                }
            }
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    };
    SeatMapComponent.prototype.GetOrderDetails = function (id) {
        var _this = this;
        this.loaderProgress.showLoader();
        try {
            var sDate = new Date();
            console.log('Get Passenger Service --------------- Start Date Time : ' + sDate);
            this._service.GetPassenger(id)
                .subscribe(function (data) {
                _this._shared.SetPassenger(data);
                var scTable = _this._shared.GetStartupTable().Tables.SecurityCodeTable;
                _this.MultiSegmentPaxArray = index_4.Converters.ConvertToFlightWithPaxTemplate(_this._shared.GetPassenger(), null, scTable, "");
                // if (PassengerArray.Segment.length > 0) {
                //     let setdepartureDate: string = moment(PassengerArray.Segment[0].DepartureDateTime.toString()).format("YYYY-MM-DD");
                //     let setflightnumber: string = PassengerArray.Segment[0].MarketingFlight;
                //     let setcity: string = PassengerArray.Segment[0].DepartureCity;
                //     // PassengerArray.Segment.forEach((SegEle, SegInndex) => {
                //     //     let departureDate: string = moment(SegEle.DepartureDateTime.toString()).format("YYYY-MM-DD");
                //     //     let flightnumber: string;
                //     //     if (SegEle.MarketingFlight.substr(0, 2) == "CM") {
                //     //         flightnumber = SegEle.MarketingFlight;
                //     //     } else if (SegEle.OperatingFlight != null && SegEle.OperatingFlight.substr(0, 2) == "CM") {
                //     //         flightnumber = SegEle.OperatingFlight;
                //     //     } else {
                //     //         flightnumber = SegEle.MarketingFlight;
                //     //     }
                //     //     let city: string = SegEle.DepartureCity;
                //     //     SegEle.date = moment(SegEle.DepartureDateTime.toString()).format("DD-MMM-YYYY");
                //     //     var destination = SegEle.Destination;
                //     //     // //Inventory
                //     //     // this._checkin.BookingCountDisplay(departureDate, flightnumber, city)
                //     //     //     .subscribe((data) => {
                //     //     //         let inventory: any = data;
                //     //     //         SegEle.inven = Converters.ConvertToInventory(inventory);
                //     //     //     });
                //     //     // //Inbound
                //     //     // this._checkin.InBound(departureDate, flightnumber, city)
                //     //     //     .subscribe((data) => {
                //     //     //         let inBound: any = data;
                //     //     //         SegEle.inbound = Converters.ConvertToInBound(inBound);
                //     //     //     })
                //     //     // //Outbound
                //     //     // this._checkin.OutBound(departureDate, flightnumber, destination)
                //     //     //     .subscribe((data) => {
                //     //     //         let OutBound: any = data;
                //     //     //         SegEle.outbound = Converters.ConvertToOutBound(OutBound);
                //     //     //     })
                //     //     // //status
                //     //     // this._dataService.Status(departureDate, flightnumber, city)
                //     //         .subscribe((data) => {
                //     //             let status: any = data;
                //     //             SegEle.status = status.Flights[0].Legs[0].Status;
                //     //             SegEle.Legs = status.Flights[0].Legs;
                //     //         })
                //     // });
                //     // this._dataService.GetBaggage(id).subscribe((data) => {
                //     //     this._shared.SetBaggagecatalog(data);
                //     // });
                //     //Tier
                //     // this._dataService.Tier(setdepartureDate, setflightnumber, setcity)
                //     //     .subscribe((data) => {
                //     //         let tier: any = data;
                //     //         this._shared.SetTier(tier);
                //     //         this.loaderProgress.hideLoader();
                //     //         this._shared.SetSegmentDetail(PassengerArray);
                //     //         var self = this;
                //     //         this.loaderProgress.hideLoader();
                //     //         // this.routerExtensions.navigate(["checkin"], {
                //     //         //     animated: true,
                //     //         //     transition: {
                //     //         //         name: "slide",
                //     //         //         duration: 600,
                //     //         //         curve: "linear"
                //     //         //     },
                //     //         //     queryParams: {
                //     //         //         "data": id,
                //     //         //         "index": this.index
                //     //         //     }
                //     //         // });
                //     //     });
                // }
                // else {
                //     this.loaderProgress.hideLoader();
                //     Toast.makeText("Record Not Found").show();
                // }
            }, function (err) {
                console.log(err);
                _this.handleServiceError(err);
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
            console.log('Get Passenger Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    SeatMapComponent.prototype.simpleTap = function (seat, rownumber) {
        var _this = this;
        console.log(index_2.SeatMap.CabinList);
        if (this.SelectedPassenger.IsSelected == false) {
            Toast.makeText("Please select a passenger to assign seat").show();
        }
        else if (this.SelectedPassenger.NoSeat) {
            // no code
        }
        else {
            this.ButtonContinue = false;
            if ((this.SelectedPassenger.PassengerType == "Adult" && this.SelectedPassenger.AssociatedInfantRPH != null) || this.SelectedPassenger.PassengerType != "Adult" || (this.SelectedPassenger.SSR.filter(function (m) { return m == "WCHR"; }).length > 0) || (this.SelectedPassenger.SSR.filter(function (m) { return m == "WCHS"; }).length > 0) || (this.SelectedPassenger.SSR.filter(function (m) { return m == "WCHC"; }).length > 0) || this.SelectedPassenger.SSR.filter(function (m) { return m == "UMNR"; }).length > 0) {
                seat.SeatCharacteristics.forEach(function (characteristics, index) {
                    if (characteristics == "17") {
                        console.log("clear");
                        _this.infantExitrowSeat = true;
                    }
                });
            }
            if (this.infantExitrowSeat != true) {
                if (this.seat[this.seat.length - 1].SeatNumber == seat.SeatNumber && rownumber == this.rowNumber) {
                    seat.IsSeatSelected = true;
                    this.seat[this.seat.length - 1] = new index_2.SeatMap.AirSeatList();
                    seat.IsPaxSelected = true;
                    // seat.PaxRPH = "";
                    // this.rowNumber = '';
                }
                else if (seat.SeatAvailability == '1' || seat.SeatAvailability == '15') {
                    if (seat.SeatCharacteristics.filter(function (m) { return m == '17'; }).length > 0) {
                        dialogs.confirm("Do you want to proceed with Exit Seat").then(function (result) {
                            console.log("Dialog result: " + result);
                            if (result) {
                                _this.selectSeat(seat, rownumber);
                            }
                        });
                    }
                    else {
                        this.selectSeat(seat, rownumber);
                    }
                }
            }
            else {
                Toast.makeText("UNABLE TO ASSIGN EXIT ROW SEAT FOR THIS PASSENGER").show();
                this.ButtonContinue = true;
                this.infantExitrowSeat = false;
            }
        }
    };
    SeatMapComponent.prototype.selectSeat = function (seat, rownumber) {
        var _this = this;
        console.log(this.seat);
        if (this.seat.filter(function (m) { return m.PaxRPH == _this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == _this.SelectedPassenger.FlightLegDepartureAirportCode; }).length > 0) {
            this.seat.filter(function (m) { return m.PaxRPH == _this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == _this.SelectedPassenger.FlightLegDepartureAirportCode; })[0].IsSeatSelected = false;
            this.seat.filter(function (m) { return m.PaxRPH == _this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == _this.SelectedPassenger.FlightLegDepartureAirportCode; })[0].IsPaxSelected = false;
            this.seat.filter(function (m) { return m.PaxRPH == _this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == _this.SelectedPassenger.FlightLegDepartureAirportCode; })[0].PaxRPH = "";
        }
        seat.IsPaxSelected = true;
        seat.IsSeatSelected = true;
        seat.PaxRPH = this.SelectedPassenger.RPH;
        var productList = this.ShowSeatMapList.SeatProductInformation;
        this.SelectedPassenger.seatPreference = [];
        productList.forEach(function (product, productIndex) {
            var seatCharacter = seat.SeatCharacteristics.filter(function (sc) { return sc === product.OTACode; });
            if (seatCharacter.length > 0) {
                _this.SelectedPassenger.seatPreference.push(seatCharacter[0]);
            }
        });
        seat.FlightLegDepartureAirportCode = this.SelectedPassenger.FlightLegDepartureAirportCode;
        this.seat.push(seat);
        this.rowNumber = rownumber;
        this.SeatCharacteristic = seat.SeatCharacteristics;
        this.SelectedSeat = this.rowNumber + seat.SeatNumber;
        this.SelectedPassenger.NewSeatNumber = this.SelectedSeat;
        this.SelectedPassenger.SeatNumber = this.SelectedSeat;
        // this.PassengerList.filter(m=> m.RPH == this.SelectedPassenger.RPH)[0].SeatNumber = this.SelectedSeat;
        this.SelectedPassenger.seatCode = seat.SeatCode;
        console.log(this.SelectedPassengerList);
        console.log(this.SelectedPassenger);
        if (this.SelectedPassengerList.length > 0 && this.SelectedPassengerList.filter(function (m) { return m.RPH == _this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == _this.SelectedPassenger.FlightLegDepartureAirportCode; }).length > 0) {
            // this.SelectedPassengerList.filter(m => m.RPH == this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == this.SelectedPassenger.FlightLegDepartureAirportCode)[0] = Object.assign({}, this.SelectedPassenger);
            this.SelectedPassengerList.splice(this.SelectedPassengerList.indexOf(this.SelectedPassengerList.filter(function (m) { return m.RPH == _this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == _this.SelectedPassenger.FlightLegDepartureAirportCode; })[0]), 1);
            this.SelectedPassengerList.push(this.SelectedPassenger);
        }
        else {
            this.SelectedPassengerList.push(Object.assign({}, this.SelectedPassenger));
        }
        console.log(this.SelectedPassengerList);
    };
    SeatMapComponent.prototype.select = function (passengerList, isNoSeat) {
        var _this = this;
        if (isNoSeat === void 0) { isNoSeat = false; }
        if (passengerList.INFwithoutSeat == true) {
            Toast.makeText("Seat cannot be assigned to this particular passenger type").show();
        }
        else {
            if (!isNoSeat) {
                passengerList.IsSelected = true;
                if (passengerList.AssociatedInfantRPH != null) {
                    var infPax = this.MultiSegmentPaxArray.Segment[this.index].Passenger.filter(function (m) { return m.AssociatedAdultRPH === passengerList.RPH; });
                    if (infPax.length > 0)
                        infPax[0].IsSelected = true;
                    // this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((Paxdata, PaxIndex) => {
                    //     if (Paxdata.AssociatedAdultRPH == passengerList.RPH && passengerList.IsSelected == true) {
                    //         Paxdata.IsSelected = true;
                    //     } else {
                    //         Paxdata.IsSelected = false;
                    //     }
                    // })
                }
                if (passengerList.RPH == this.SelectedPassenger.RPH) {
                    this.num++;
                    console.log("1");
                    if (this.num % 2 == 1) {
                        passengerList.IsSelected = false;
                        if (passengerList.AssociatedInfantRPH != null) {
                            var infPax = this.MultiSegmentPaxArray.Segment[this.index].Passenger.filter(function (m) { return m.AssociatedAdultRPH === passengerList.RPH; });
                            if (infPax.length > 0)
                                infPax[0].IsSelected = false;
                            // this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((Paxdata, PaxIndex) => {
                            //     if (Paxdata.AssociatedAdultRPH == passengerList.RPH && Paxdata.IsSelected == true) {
                            //         Paxdata.IsSelected = false;
                            //     }
                            // })
                        }
                    }
                    else {
                        passengerList.IsSelected = true;
                    }
                }
                if (passengerList.RPH != this.SelectedPassenger.RPH && this.SelectedPassenger.IsSelected) {
                    this.SelectedPassenger.IsSelected = !this.SelectedPassenger.IsSelected;
                    if (this.SelectedPassenger.AssociatedInfantRPH != null) {
                        var infPax = this.MultiSegmentPaxArray.Segment[this.index].Passenger.filter(function (m) { return m.AssociatedAdultRPH === _this.SelectedPassenger.RPH; });
                        if (infPax.length > 0)
                            infPax[0].IsSelected = false;
                        // this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((Paxdata, PaxIndex) => {
                        //     if (Paxdata.AssociatedAdultRPH == this.SelectedPassenger.RPH && Paxdata.IsSelected == true) {
                        //         Paxdata.IsSelected = false;
                        //     }
                        // })
                    }
                }
                // if (passengerList.IsSelected == false && this.SelectedPassenger.IsSelected == false) {
                //     this.num = 0;
                //     this.num++;
                // }
                this.SelectedPassenger = passengerList;
                if (((this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight != null && this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight.substr(0, 2) == "CM") || (this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight != null && this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight.substr(0, 2) == "CM")) && this.legsInfo != null && this.legsInfo.length > 1) {
                    if (this.legsInfo.filter(function (m) { return m.isLegSelected == true; }).length == 1) {
                        this.SelectedPassenger.FlightLegDepartureAirportCode = this.legsInfo.filter(function (m) { return m.isLegSelected == true; })[0].DepartureAirport.LocationCode;
                    }
                    else {
                        this.SelectedPassenger.FlightLegDepartureAirportCode = this.legsInfo[0].DepartureAirport.LocationCode;
                    }
                }
                else {
                    this.SelectedPassenger.FlightLegDepartureAirportCode = this.MultiSegmentPaxArray.Segment[this.index].Origin;
                }
                if (this.SelectedPassenger.NoSeat) {
                    this.SelectedPassenger.NewSeatNumber = "";
                    this.SelectedPassengerList.push(Object.assign({}, this.SelectedPassenger));
                }
                else {
                    if (this.SelectedPassengerList.filter(function (m) { return m.RPH == _this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == _this.SelectedPassenger.FlightLegDepartureAirportCode; }).length > 0 && this.SelectedPassengerList.filter(function (m) { return m.RPH == _this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == _this.SelectedPassenger.FlightLegDepartureAirportCode; })[0].NewSeatNumber == "") {
                        var item = this.SelectedPassengerList.filter(function (m) { return m.RPH == _this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == _this.SelectedPassenger.FlightLegDepartureAirportCode && m.NewSeatNumber == ""; })[0];
                        var index = this.SelectedPassengerList.indexOf(item);
                        this.SelectedPassengerList.splice(index, 1);
                    }
                }
            }
            else {
                this.ShowSeatMapList.CabinList.forEach(function (cabin, cabinIndex) {
                    cabin.AirRowList.forEach(function (row, rowIndex) {
                        if (row.AirSeatList.filter(function (m) { return m.PaxRPH == passengerList.RPH && m.FlightLegDepartureAirportCode == passengerList.FlightLegDepartureAirportCode; }).length > 0) {
                            row.AirSeatList.filter(function (m) { return m.PaxRPH == passengerList.RPH && m.FlightLegDepartureAirportCode == passengerList.FlightLegDepartureAirportCode; })[0].IsSeatSelected = false;
                            row.AirSeatList.filter(function (m) { return m.PaxRPH == passengerList.RPH && m.FlightLegDepartureAirportCode == passengerList.FlightLegDepartureAirportCode; })[0].IsPaxSelected = false;
                            row.AirSeatList.filter(function (m) { return m.PaxRPH == passengerList.RPH && m.FlightLegDepartureAirportCode == passengerList.FlightLegDepartureAirportCode; })[0].PaxRPH = "";
                        }
                    });
                });
                if (((this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight != null && this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight.substr(0, 2) == "CM") || (this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight != null && this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight.substr(0, 2) == "CM")) && this.legsInfo != null && this.legsInfo.length > 1) {
                    if (this.legsInfo.filter(function (m) { return m.isLegSelected == true; }).length == 1) {
                        passengerList.FlightLegDepartureAirportCode = this.legsInfo.filter(function (m) { return m.isLegSelected == true; })[0].DepartureAirport.LocationCode;
                    }
                    else {
                        passengerList.FlightLegDepartureAirportCode = this.legsInfo[0].DepartureAirport.LocationCode;
                    }
                }
                if (passengerList.NoSeat) {
                    passengerList.NewSeatNumber = "";
                    this.SelectedPassengerList.push(Object.assign({}, passengerList));
                }
                else {
                    if (this.SelectedPassengerList.filter(function (m) { return m.RPH == _this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == passengerList.FlightLegDepartureAirportCode; }).length > 0 && this.SelectedPassengerList.filter(function (m) { return m.RPH == passengerList.RPH && m.FlightLegDepartureAirportCode == passengerList.FlightLegDepartureAirportCode; })[0].NewSeatNumber == "") {
                        var item = this.SelectedPassengerList.filter(function (m) { return m.RPH == passengerList.RPH && m.FlightLegDepartureAirportCode == passengerList.FlightLegDepartureAirportCode && m.NewSeatNumber == ""; })[0];
                        var index = this.SelectedPassengerList.indexOf(item);
                        this.SelectedPassengerList.splice(index, 1);
                    }
                }
            }
            console.log(this.SelectedPassengerList);
        }
    };
    SeatMapComponent.prototype.check1 = function () {
        if (this.IsChecked1) {
            this.IsChecked1 = false;
        }
        else {
            this.IsChecked1 = true;
        }
    };
    SeatMapComponent.prototype.check2 = function () {
        if (this.IsChecked2) {
            this.IsChecked2 = false;
            this.disablebulkhead();
        }
        else {
            this.IsChecked2 = true;
            this.enablebulkhead();
        }
    };
    SeatMapComponent.prototype.check3 = function () {
        if (this.IsChecked3) {
            this.IsChecked3 = false;
            this.disableINfNotAllowed();
        }
        else {
            this.IsChecked3 = true;
            this.enableINfNotAllowed();
        }
    };
    SeatMapComponent.prototype.check4 = function () {
        if (this.IsChecked4) {
            this.IsChecked4 = false;
            console.log("false Part");
            this.disableExitRow();
        }
        else {
            this.IsChecked4 = true;
            this.enableExitRow();
        }
    };
    SeatMapComponent.prototype.selectSeg = function (selectindex, index) {
        console.log("Index:" + index);
        this.PassengerList.forEach(function (passengerlist, index) {
            passengerlist.IsSelected = false;
        });
        if (selectindex[index] == true) {
            this.isSegSelected[index] = false;
            this.legsInfo[index].isLegSelected = false;
        }
        else {
            this.isSegSelected[index] = true;
            this.legsInfo[index].isLegSelected = true;
        }
        this.isall = this.allTheSame(this.isSegSelected);
        this.SelectedPassenger = new index_2.MultiSegmentTemplate.Passenger();
        this.showSeatMap(this.isall);
        console.log("Obj:" + JSON.stringify(this.isall));
    };
    SeatMapComponent.prototype.showSeatMap = function (isall) {
        var _this = this;
        if (isall == true) {
            if (this.legsInfo[0].isLegSelected == true) {
                this.ShowSeatMapList = this.SeatMapList.Items.filter(function (m) { return m.FlightSegment.Origin.LocationCode == _this.MultiSegmentPaxArray.Segment[_this.index].Origin && m.FlightSegment.Destination.LocationCode == _this.MultiSegmentPaxArray.Segment[_this.index].Destination; })[0];
                this.PassengerList.forEach(function (paxdata, Index) {
                    paxdata.SeatNumber = paxdata.Seats[0].SeatNumber;
                });
            }
            else {
                this.ShowSeatMapList = new index_2.SeatMap.Item();
                Toast.makeText("No Seatmap selected").show();
            }
        }
        else {
            var Origin = this.legsInfo.filter(function (m) { return m.isLegSelected == true; })[0].DepartureAirport.LocationCode;
            var Dest = this.legsInfo.filter(function (m) { return m.isLegSelected == true; })[0].ArrivalAirport.LocationCode;
            this.ShowSeatMapList = this.SeatMapList.Items.filter(function (m) { return m.FlightSegment.Origin.LocationCode == Origin && m.FlightSegment.Destination.LocationCode == Dest; })[0];
            this.PassengerList.forEach(function (paxdata, Index) {
                paxdata.Seats.forEach(function (seats, seatIndex) {
                    if (seats.ArrivalCode == Dest && seats.DepartureCode == Origin) {
                        paxdata.SeatNumber = seats.SeatNumber;
                    }
                });
            });
        }
    };
    SeatMapComponent.prototype.allTheSame = function (array) {
        var first = array[0];
        return array.every(function (element) {
            return element === first;
        });
    };
    SeatMapComponent.prototype.enableExitRow = function () {
        var _this = this;
        console.log("inside");
        this.ShowSeatMapList.CabinList.forEach(function (cabEle, cabindex) {
            cabEle.AirRowList.forEach(function (RowEle, RowIndex) {
                RowEle.AirSeatList.forEach(function (seatEle, seatIndex) {
                    seatEle.SeatCharacteristics.forEach(function (charEle, charIndex) {
                        if (charEle == '17') {
                            if (seatEle.StyleClass != 'noSeat') {
                                seatEle.IsSelectedAdvanceDisplay = true;
                                _this.IsExitRowSelected = true;
                                seatEle.AdvanceDisplayStyleClass = 'exitrow';
                            }
                        }
                    });
                });
            });
        });
    };
    SeatMapComponent.prototype.disableExitRow = function () {
        var _this = this;
        console.log("OutSide");
        this.ShowSeatMapList.CabinList.forEach(function (cabEle, cabindex) {
            cabEle.AirRowList.forEach(function (RowEle, RowIndex) {
                RowEle.AirSeatList.forEach(function (seatEle, seatIndex) {
                    seatEle.SeatCharacteristics.forEach(function (charEle, charIndex) {
                        if (charEle == '17') {
                            console.log("exit row");
                            if (seatEle.StyleClass != 'noSeat') {
                                _this.IsExitRowSelected = false;
                                seatEle.IsSelectedAdvanceDisplay = false;
                                if (_this.IsInfantNotAllowedSelected == true) {
                                    seatEle.IsSelectedAdvanceDisplay = true;
                                    seatEle.AdvanceDisplayStyleClass = 'infantnotallowed';
                                }
                            }
                        }
                    });
                });
            });
        });
    };
    SeatMapComponent.prototype.enableINfNotAllowed = function () {
        var _this = this;
        console.log("inside");
        this.ShowSeatMapList.CabinList.forEach(function (cabEle, cabindex) {
            cabEle.AirRowList.forEach(function (RowEle, RowIndex) {
                RowEle.AirSeatList.forEach(function (seatEle, seatIndex) {
                    seatEle.SeatCharacteristics.forEach(function (charEle, charIndex) {
                        if (charEle == '51') {
                            console.log("infant not allowed");
                            if (seatEle.StyleClass != 'noSeat') {
                                seatEle.IsSelectedAdvanceDisplay = true;
                                _this.IsInfantNotAllowedSelected = true;
                                seatEle.AdvanceDisplayStyleClass = 'infantnotallowed';
                                if (_this.IsExitRowSelected == true) {
                                    seatEle.AdvanceDisplayStyleClass = 'exitrow';
                                }
                            }
                        }
                    });
                });
            });
        });
    };
    SeatMapComponent.prototype.disableINfNotAllowed = function () {
        var _this = this;
        console.log("OutSide");
        this.ShowSeatMapList.CabinList.forEach(function (cabEle, cabindex) {
            cabEle.AirRowList.forEach(function (RowEle, RowIndex) {
                RowEle.AirSeatList.forEach(function (seatEle, seatIndex) {
                    seatEle.SeatCharacteristics.forEach(function (charEle, charIndex) {
                        if (charEle == '51') {
                            // console.log("exit row");
                            if (seatEle.StyleClass != 'noSeat') {
                                _this.IsInfantNotAllowedSelected = false;
                                seatEle.IsSelectedAdvanceDisplay = false;
                                if (_this.IsExitRowSelected == true) {
                                    seatEle.IsSelectedAdvanceDisplay = true;
                                    seatEle.AdvanceDisplayStyleClass = 'exitrow';
                                }
                            }
                        }
                    });
                });
            });
        });
    };
    SeatMapComponent.prototype.enablebulkhead = function () {
        console.log("inside");
        this.ShowSeatMapList.CabinList.forEach(function (cabEle, cabindex) {
            cabEle.AirRowList.forEach(function (RowEle, RowIndex) {
                RowEle.AirSeatList.forEach(function (seatEle, seatIndex) {
                    seatEle.SeatCharacteristics.forEach(function (charEle, charIndex) {
                        if (charEle == '10') {
                            console.log("bulkhead");
                            if (seatEle.StyleClass != 'noSeat') {
                                seatEle.IsSelectedAdvanceDisplay = true;
                                seatEle.AdvanceDisplayStyleClass = 'bulkhead';
                            }
                        }
                    });
                });
            });
        });
    };
    SeatMapComponent.prototype.disablebulkhead = function () {
        console.log("OutSide");
        this.ShowSeatMapList.CabinList.forEach(function (cabEle, cabindex) {
            cabEle.AirRowList.forEach(function (RowEle, RowIndex) {
                RowEle.AirSeatList.forEach(function (seatEle, seatIndex) {
                    seatEle.SeatCharacteristics.forEach(function (charEle, charIndex) {
                        if (charEle == '10') {
                            console.log("exit row");
                            if (seatEle.StyleClass != 'noSeat') {
                                seatEle.IsSelectedAdvanceDisplay = false;
                            }
                        }
                    });
                });
            });
        });
    };
    SeatMapComponent.prototype.gotonotify = function () {
        this.routerExtensions.navigate(["notify"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    SeatMapComponent.prototype.hideShowLedgerd = function () {
        if (this.showSeatMapKey) {
            this.showSeatMapKey = false;
        }
        else {
            this.showSeatMapKey = true;
        }
    };
    SeatMapComponent.prototype.hideShowAdavanceDisplay = function () {
        if (this.showAdvanceDisplay) {
            this.showAdvanceDisplay = false;
        }
        else {
            this.showAdvanceDisplay = true;
        }
    };
    SeatMapComponent.prototype.navigateToCheckIn = function () {
        var orderId = this.MultiSegmentPaxArray.Segment[this.index].Passenger[0].OrderID;
        if (this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight.substr(0, 2) == "CM" && this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight.length <= 5) {
            this.navigateToCheckInPage(orderId);
        }
        else {
            this.navigateToCheckInPage(orderId);
        }
    };
    SeatMapComponent.prototype.GetOrderDetailsforReferesh = function (id) {
        var _this = this;
        this.loaderProgress.showLoader();
        try {
            var sDate = new Date();
            console.log("Get Passenger Service --------------- Start Date Time : " + sDate);
            this._service.GetPassenger(id).subscribe(function (data) {
                if (data.Success != false) {
                    _this._shared.SetPassenger(data);
                    _this.loaderProgress.hideLoader();
                    _this.navigateToCheckInPage(id);
                }
            }, function (err) {
                console.log(err);
                _this.handleServiceError(err);
                _this.loaderProgress.hideLoader();
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log("Get Passenger Service --------------- End Date Time : " + eDate);
            console.log("Get Passenger Service Execution Time : " +
                app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    SeatMapComponent.prototype.navigateToCheckInPage = function (orderId) {
        this.loaderProgress.hideLoader();
        this.routerExtensions.navigate(["checkin"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "data": orderId,
                "index": this.index
            }
        });
    };
    SeatMapComponent.prototype.navigatetoChechkinforOtherFlight = function () {
        this.routerExtensions.navigate(["checkin"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "PassengerArray": this.MultiSegmentPaxArray.Segment[0].Passenger[0].OrderID,
                "index": this.index
            }
        });
    };
    SeatMapComponent.prototype.navigateToSearch = function () {
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
    SeatMapComponent.prototype.navigateToDepartures = function () {
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
    SeatMapComponent.prototype.isItemVisible = function (args) {
        if (args.toString().substr(0, 2) == 'CM' && args.toString().length <= 5) {
            return "visible";
        }
        else
            return "collapsed";
    };
    SeatMapComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    SeatMapComponent.prototype.navigateTologin = function () {
        this.routerExtensions.navigate([""], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    SeatMapComponent.prototype.handleServiceError = function (error) {
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
        }
        else {
            Toast.makeText(errorMessage).show();
        }
    };
    SeatMapComponent.prototype.navigateToCompensation = function () {
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
    ], SeatMapComponent.prototype, "pageCont", void 0);
    SeatMapComponent = __decorate([
        core_1.Component({
            selector: "list-page",
            providers: [index_3.DataService, app_constants_1.Configuration, index_3.PassengerService, index_3.SeatMapService, index_3.CheckinService],
            templateUrl: "./components/seatmap/seatmap.component.html",
            styleUrls: ["./components/seatmap/seatmap.component.css"]
        }),
        __metadata("design:paramtypes", [index_3.CheckinService, page_1.Page, index_3.SeatMapService, index_3.TimeOutService, router_2.RouterExtensions, router_1.Router, common_1.Location, index_3.DataService, router_1.ActivatedRoute,
            index_3.CheckinOrderService, index_3.PassengerService])
    ], SeatMapComponent);
    return SeatMapComponent;
}());
exports.SeatMapComponent = SeatMapComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhdG1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZWF0bWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyxzQ0FBeUU7QUFDekUsMENBQTJFO0FBQzNFLDBDQUEyQztBQUMzQyxzREFBK0Q7QUFFL0Qsb0NBQXFDO0FBQ3JDLGdDQUErQjtBQUsvQiw4QkFBOEI7QUFDOUIsMERBQTREO0FBQzVELDBDQUE0QztBQUM1QywrQkFBaUM7QUFFakMsZ0JBQWdCO0FBQ2hCLGtEQUE0RztBQUM1RyxzREFBNkg7QUFDN0gscURBQWlKO0FBQ2pKLGtEQUFzRDtBQUN0RCxxREFBb0Q7QUFDcEQsNkRBQTJEO0FBVTNEO0lBMkVJLDBCQUFtQixRQUF3QixFQUFVLElBQVUsRUFBUyxRQUF3QixFQUFTLGVBQStCLEVBQVUsZ0JBQWtDLEVBQVUsTUFBYyxFQUFVLFFBQWtCLEVBQVMsWUFBeUIsRUFBVSxlQUErQixFQUN4UyxPQUE0QixFQUFTLFFBQTBCO1FBRHZELGFBQVEsR0FBUixRQUFRLENBQWdCO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQWdCO1FBQVMsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQVMsaUJBQVksR0FBWixZQUFZLENBQWE7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFDeFMsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFrQjtRQXZFbkUsZ0JBQVcsR0FBdUIsSUFBSSxlQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDM0Qsb0JBQWUsR0FBaUIsSUFBSSxlQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEQsVUFBSyxHQUFlLEVBQUUsQ0FB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b0JBQ2IsS0FBSyxFQUFFLFFBQVE7aUJBQ2xCO2FBQ0osQ0FBQyxDQUFDO1NBQ047YUFBTTtZQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN4RDtJQUNMLENBQUM7SUF0NUMyQjtRQUEzQixnQkFBUyxDQUFDLGVBQWUsQ0FBQztrQ0FBVyxpQkFBVTtzREFBQztJQTFFeEMsZ0JBQWdCO1FBUjVCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsV0FBVztZQUNyQixTQUFTLEVBQUUsQ0FBQyxtQkFBVyxFQUFFLDZCQUFhLEVBQUUsd0JBQWdCLEVBQUUsc0JBQWMsRUFBRSxzQkFBYyxDQUFDO1lBQ3pGLFdBQVcsRUFBRSw2Q0FBNkM7WUFDMUQsU0FBUyxFQUFFLENBQUMsNENBQTRDLENBQUM7U0FDNUQsQ0FBQzt5Q0E4RStCLHNCQUFjLEVBQWdCLFdBQUksRUFBbUIsc0JBQWMsRUFBMEIsc0JBQWMsRUFBNEIseUJBQWdCLEVBQWtCLGVBQU0sRUFBb0IsaUJBQVEsRUFBdUIsbUJBQVcsRUFBMkIsdUJBQWM7WUFDL1IsMkJBQW1CLEVBQW1CLHdCQUFnQjtPQTVFakUsZ0JBQWdCLENBaStDNUI7SUFBRCx1QkFBQztDQUFBLEFBaitDRCxJQWkrQ0M7QUFqK0NZLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8vYW5ndWxhciAmIG5hdGl2ZXNjcmlwdCByZWZlcmVuY2VzXHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBSb3V0ZXIsIE5hdmlnYXRpb25FeHRyYXMsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XHJcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7IE9ic2VydmFibGVBcnJheSB9IGZyb20gXCJkYXRhL29ic2VydmFibGUtYXJyYXlcIjtcclxuaW1wb3J0ICogYXMgZGlhbG9ncyBmcm9tIFwidWkvZGlhbG9nc1wiXHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgeyBHZXN0dXJlRXZlbnREYXRhIH0gZnJvbSBcInVpL2dlc3R1cmVzXCI7XHJcbmltcG9ydCB7IExpc3RWaWV3LCBJdGVtRXZlbnREYXRhIH0gZnJvbSBcInVpL2xpc3Qtdmlld1wiO1xyXG5pbXBvcnQgKiBhcyBnZXN0dXJlcyBmcm9tIFwidWkvZ2VzdHVyZXNcIjtcclxuXHJcbi8vZXh0ZXJuYWwgbW9kdWxlcyBhbmQgcGx1Z2luc1xyXG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICduYXRpdmVzY3JpcHQtdG9hc3QnO1xyXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xyXG5cclxuLy9hcHAgcmVmZXJlbmNlc1xyXG5pbXBvcnQgeyBzZWF0TW9kZWwsIEludmVudG9yeSwgT3JkZXIsIFNlYXRNYXBUZW1wbGF0ZSwgTGVncywgU2VhdE1hcE9BUGF4IH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9tb2RlbC9pbmRleFwiO1xyXG5pbXBvcnQgeyBTZWF0TWFwLCBMb2FkZXJQcm9ncmVzcywgTXVsdGlTZWdtZW50VGVtcGxhdGUsIFBheFRlbXBsYXRlLCBPdXRCb3VuZCwgSW5Cb3VuZCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvaW50ZXJmYWNlL2luZGV4XCI7XHJcbmltcG9ydCB7IERhdGFTZXJ2aWNlLCBDaGVja2luT3JkZXJTZXJ2aWNlLCBQYXNzZW5nZXJTZXJ2aWNlLCBUaW1lT3V0U2VydmljZSwgU2VhdE1hcFNlcnZpY2UsIENoZWNraW5TZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9pbmRleFwiO1xyXG5pbXBvcnQgeyBDb252ZXJ0ZXJzIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vLi4vYXBwLmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IEFwcEV4ZWN1dGlvbnRpbWUgfSBmcm9tIFwiLi4vLi4vYXBwLmV4ZWN1dGlvbnRpbWVcIjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6IFwibGlzdC1wYWdlXCIsXHJcbiAgICBwcm92aWRlcnM6IFtEYXRhU2VydmljZSwgQ29uZmlndXJhdGlvbiwgUGFzc2VuZ2VyU2VydmljZSwgU2VhdE1hcFNlcnZpY2UsIENoZWNraW5TZXJ2aWNlXSxcclxuICAgIHRlbXBsYXRlVXJsOiBcIi4vY29tcG9uZW50cy9zZWF0bWFwL3NlYXRtYXAuY29tcG9uZW50Lmh0bWxcIixcclxuICAgIHN0eWxlVXJsczogW1wiLi9jb21wb25lbnRzL3NlYXRtYXAvc2VhdG1hcC5jb21wb25lbnQuY3NzXCJdXHJcbn0pXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFNlYXRNYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gICAgaXNFcnJvcjogYm9vbGVhbjtcclxuICAgIGVycm9yTWVzc2FnZTogc3RyaW5nO1xyXG4gICAgbG9hZGVyUHJvZ3Jlc3M6IExvYWRlclByb2dyZXNzO1xyXG4gICAgcHJpdmF0ZSBzZWF0bWFwRGV0YWlsczogYW55O1xyXG4gICAgcHVibGljIFNlYXRNYXBMaXN0OiBTZWF0TWFwLlJvb3RPYmplY3QgPSBuZXcgU2VhdE1hcC5Sb290T2JqZWN0KCk7XHJcbiAgICBwdWJsaWMgU2hvd1NlYXRNYXBMaXN0OiBTZWF0TWFwLkl0ZW0gPSBuZXcgU2VhdE1hcC5JdGVtKCk7XHJcbiAgICBwcml2YXRlIGl0ZW1zOiBBcnJheTxhbnk+ID0gW107XHJcbiAgICBwcml2YXRlIGNyb3c6IHN0cmluZztcclxuICAgIHByaXZhdGUgc2VhdDogQXJyYXk8U2VhdE1hcC5BaXJTZWF0TGlzdD4gPSBbbmV3IFNlYXRNYXAuQWlyU2VhdExpc3QoKV1cclxuICAgIHByaXZhdGUgcm93TnVtYmVyOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIFNlYXRDaGFyYWN0ZXJpc3RpYzogYW55O1xyXG4gICAgcHJpdmF0ZSBwcmV2aW91c1NlYXQ6IFNlYXRNYXAuQWlyU2VhdExpc3QgPSBuZXcgU2VhdE1hcC5BaXJTZWF0TGlzdCgpO1xyXG4gICAgcHJpdmF0ZSBTZWxlY3RlZFNlYXQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwcml2YXRlIHNlYXRSZXF1ZXN0OiBhbnk7XHJcbiAgICBwdWJsaWMgTXVsdGlTZWdtZW50UGF4QXJyYXk6IE11bHRpU2VnbWVudFRlbXBsYXRlLlJvb3RPYmplY3QgPSBuZXcgTXVsdGlTZWdtZW50VGVtcGxhdGUuUm9vdE9iamVjdDtcclxuICAgIFBhc3NlZFBhc3NlbmdlckRldGFpbDogUGF4VGVtcGxhdGUgPSBuZXcgUGF4VGVtcGxhdGUoKTtcclxuICAgIHB1YmxpYyBQYXNzZW5nZXJBcnJheTogQXJyYXk8UGF4VGVtcGxhdGU+ID0gW107XHJcbiAgICBwdWJsaWMgQnV0dG9uQ29udGludWU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIGludmVudDogYW55O1xyXG4gICAgcHVibGljIGluYm91bjogYW55O1xyXG4gICAgcHVibGljIG91dGJvdW46IGFueTtcclxuICAgIHB1YmxpYyBvdXRib3VuMTogT3V0Qm91bmQuT3V0Ym91ID0gbmV3IE91dEJvdW5kLk91dGJvdSgpO1xyXG4gICAgcHVibGljIGluYm91bjE6IEluQm91bmQuSW5ib3UgPSBuZXcgSW5Cb3VuZC5JbmJvdSgpO1xyXG4gICAgcHVibGljIGludmVudDE6IEludmVudG9yeS5Sb290T2JqZWN0ID0gbmV3IEludmVudG9yeS5Sb290T2JqZWN0KCk7XHJcbiAgICBwdWJsaWMgc2hvd1NlYXRNYXBLZXk6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIHNob3dBZHZhbmNlRGlzcGxheTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgc2VhdGxpc3Q6IEFycmF5PGFueT47XHJcbiAgICBwdWJsaWMgZGF0ZTogYW55O1xyXG4gICAgcHVibGljIGZxdHZudW06IGFueTtcclxuICAgIHB1YmxpYyBmdWxsbmFtZTogYW55O1xyXG4gICAgcHVibGljIE5vU2VhdDogYm9vbGVhbjtcclxuICAgIC8vIHB1YmxpYyBpc0NvbnRpbnVlIFxyXG4gICAgcHJpdmF0ZSBzZWF0UmVzcG9uc2U6IGFueTtcclxuICAgIHB1YmxpYyBpbmRleDogYW55O1xyXG4gICAgcHVibGljIHVzZXJkZXRhaWxzOiBhbnk7XHJcbiAgICBwdWJsaWMgRmxpZ2h0TnVtYmVyOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgQWxsU2VnU2VsZWN0ZWQ6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIEFsbFNlZ05vdFNlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgUGFzc2VuZ2VyTGlzdDogQXJyYXk8TXVsdGlTZWdtZW50VGVtcGxhdGUuUGFzc2VuZ2VyPiA9IFtdO1xyXG4gICAgcHVibGljIE5ld1Bhc3Nlbmdlckxpc3Q6IEFycmF5PE11bHRpU2VnbWVudFRlbXBsYXRlLlBhc3Nlbmdlcj4gPSBbXTtcclxuICAgIHB1YmxpYyBGbGlnaHRJbmZvOiBNdWx0aVNlZ21lbnRUZW1wbGF0ZS5GbGlnaHRXaXRoUGF4ID0gbmV3IE11bHRpU2VnbWVudFRlbXBsYXRlLkZsaWdodFdpdGhQYXg7XHJcbiAgICBwdWJsaWMgcHJldmlvdXNGbGlnaHRJbmZvOiBNdWx0aVNlZ21lbnRUZW1wbGF0ZS5GbGlnaHRXaXRoUGF4ID0gbmV3IE11bHRpU2VnbWVudFRlbXBsYXRlLkZsaWdodFdpdGhQYXg7XHJcbiAgICBwdWJsaWMgU2VhdFByb2R1Y3RJbmZvOiBBcnJheTxTZWF0TWFwLlNlYXRQcm9kdWN0SW5mb3JtYXRpb24+ID0gW107XHJcbiAgICBwdWJsaWMgSXNDaGVja2VkMTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIElzQ2hlY2tlZDI6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBJc0NoZWNrZWQzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgSXNDaGVja2VkNDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIElzRXhpdFJvd1NlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgSXNTZWF0U2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBJc0luZmFudE5vdEFsbG93ZWRTZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIG51bTogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBpc011bHRpTGVnRkxpZ2h0OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNTZWdTZWxlY3RlZDogQXJyYXk8Ym9vbGVhbj4gPSBbXTtcclxuICAgIHB1YmxpYyBpc1NlY29uZFNlZ1NlbGVjdGVkOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBGaXJzdFNlZ09yaWdpbjogc3RyaW5nO1xyXG4gICAgcHVibGljIEZpcnN0U2VnRGVzdDogc3RyaW5nO1xyXG4gICAgcHVibGljIFNlY29uZFNlZ09yaWdpbjogc3RyaW5nO1xyXG4gICAgcHVibGljIFNlY29uZFNlZ0Rlc3Q6IHN0cmluZztcclxuICAgIHB1YmxpYyBQYXNzZW5nZXJSUEg6IGFueTtcclxuICAgIHB1YmxpYyBTZWxlY3RlZFJQSDogYW55O1xyXG4gICAgcHVibGljIGxlZ3NJbmZvOiBBcnJheTxMZWdzPiA9IFtdO1xyXG4gICAgcHVibGljIGluZmFudEV4aXRyb3dTZWF0OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNNdWx0aUluaXRpYWxQYXNzZW5nZXJDaGVjazogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzQ2hlY2tpbkRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNHYXRlRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgU2VsZWN0ZWRQYXNzZW5nZXI6IE11bHRpU2VnbWVudFRlbXBsYXRlLlBhc3NlbmdlciA9IG5ldyBNdWx0aVNlZ21lbnRUZW1wbGF0ZS5QYXNzZW5nZXIoKTtcclxuICAgIHByaXZhdGUgU2VsZWN0ZWRQYXNzZW5nZXJMaXN0OiBBcnJheTxhbnk+ID0gW107XHJcbiAgICBwdWJsaWMgaXNhbGw6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgaXNDb21wZW5zYXRpb25FbmFibGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgTXVsdGlJbnRpYWxQYXg6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBNdWx0aUluaXRhbE5vU2VhdEFzc2lnbjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIFBhc3Nlbmdlckxpc3RGb3JPQVNlYXRNYXA6IFNlYXRNYXBPQVBheC5Sb290T2JqZWN0ID0gbmV3IFNlYXRNYXBPQVBheC5Sb290T2JqZWN0KCk7XHJcbiAgICBwdWJsaWMgRmxpZ2h0RGF0ZTogYW55ID0gXCJcIjtcclxuICAgIEBWaWV3Q2hpbGQoJ3BhZ2Vjb250YWluZXInKSBwYWdlQ29udDogRWxlbWVudFJlZjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfY2hlY2tpbjogQ2hlY2tpblNlcnZpY2UsIHByaXZhdGUgcGFnZTogUGFnZSwgcHVibGljIF9zZWF0bWFwOiBTZWF0TWFwU2VydmljZSwgcHVibGljIF90aW1lb3V0U2VydmljZTogVGltZU91dFNlcnZpY2UsIHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9ucywgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24sIHB1YmxpYyBfZGF0YVNlcnZpY2U6IERhdGFTZXJ2aWNlLCBwcml2YXRlIGFjdGl2YXRlZFJvdXRlcjogQWN0aXZhdGVkUm91dGUsXHJcbiAgICAgICAgcHVibGljIF9zaGFyZWQ6IENoZWNraW5PcmRlclNlcnZpY2UsIHB1YmxpYyBfc2VydmljZTogUGFzc2VuZ2VyU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gXCJcIjtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzID0gbmV3IExvYWRlclByb2dyZXNzKCk7XHJcbiAgICAgICAgLy8gdGhpcy5TZWF0TWFwTGlzdCA9IG5ldyBTZWF0TWFwLlNlYXRMaXN0KCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHRoaXMucGFnZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnfi9pbWFnZXMvbG9naW5fYmFjay5qcGVnJylcIjtcclxuICAgICAgICB0aGlzLnBhZ2Uuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBcImNvdmVyIFwiO1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaW5pdExvYWRlcih0aGlzLnBhZ2VDb250KTtcclxuICAgICAgICB0aGlzLmRhdGUgPSBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KFwiREQgTU1NIFlZWVlcIik7XHJcbiAgICAgICAgdGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNoZWNraW5EaXNhYmxlZFwiLCApO1xyXG4gICAgICAgIHRoaXMuaXNHYXRlRGlzYWJsZWQgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJnYXRlRGlzYWJsZWRcIiwgKTtcclxuICAgICAgICB0aGlzLnVzZXJkZXRhaWxzID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VyZGV0YWlsc1wiLCBcIlwiKTtcclxuICAgICAgICB0aGlzLmlzQ29tcGVuc2F0aW9uRW5hYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNvbXBlbnNhdGlvbkVuYWJsZWRcIiwgKTtcclxuICAgICAgICB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5ID0gdGhpcy5fc2hhcmVkLkdldFNlZ21lbnREZXRhaWwoKTtcclxuICAgICAgICB0aGlzLmFjdGl2YXRlZFJvdXRlci5xdWVyeVBhcmFtcy5zdWJzY3JpYmUoKHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFJQSCA9IEpTT04ucGFyc2UocGFyYW1zW1wiUlBIVmFsdWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IEpTT04ucGFyc2UocGFyYW1zW1wiaW5kZXhcIl0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkgPSB0aGlzLl9zaGFyZWQuR2V0U2VnbWVudERldGFpbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5QYXNzZW5nZXJMaXN0ID0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlBhc3NlbmdlcjtcclxuICAgICAgICAgICAgICAgIHRoaXMuRmxpZ2h0RGF0ZSA9IG1vbWVudCh0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uRmxpZ2h0RGF0ZSkuZm9ybWF0KFwiREQtTU1NLVlZWVlcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnQuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5NYXJrZXRpbmdGbGlnaHQgPT0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLk1hcmtldGluZ0ZsaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkZsaWdodEluZm8gPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZWdzSW5mbyA9IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5MZWdzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZWdzSW5mby5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTZWdTZWxlY3RlZFtpbmRleF0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuaXNMZWdTZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5QYXNzZW5nZXJMaXN0LmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5QcmV2U2VhdCA9IGRhdGEuU2VhdE51bWJlcjtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLlNlYXROdW1iZXIgPSBkYXRhLlNlYXRzWzBdLlNlYXROdW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5leEluZGV4ID0gSW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV4SW5kZXg6XCIgKyBuZXhJbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUGFzc2VuZ2VyTGlzdFtuZXhJbmRleF0uUGFzc2VuZ2VyUmVmTnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlBhc3NlbmdlclJlZk51bWJlciA9PSB0aGlzLlBhc3Nlbmdlckxpc3RbbmV4SW5kZXhdLlBhc3NlbmdlclJlZk51bWJlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc011bHRpSW5pdGlhbFBhc3NlbmdlckNoZWNrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW5zaWRlIE11bHRpSW5pdGlhbFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5GbGlnaHROdW1iZXIgPSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uTWFya2V0aW5nRmxpZ2h0O1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSUEg6XCIgKyB0aGlzLlNlbGVjdGVkUlBIKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKEV4Y2VwdGlvbikge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIGxldCBzZWxQYXggPSB0aGlzLlBhc3Nlbmdlckxpc3QuZmlsdGVyKHBheCA9PiBwYXguUlBIID09IHRoaXMuU2VsZWN0ZWRSUEgpO1xyXG4gICAgICAgIC8vIGlmIChzZWxQYXggJiYgc2VsUGF4Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5zZWxlY3Qoc2VsUGF4WzBdKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gdGhpcy5nZXRTZWF0TWFwKHRydWUpO1xyXG4gICAgICAgIGxldCBzZWxQYXggPSB0aGlzLlBhc3Nlbmdlckxpc3QuZmlsdGVyKHBheCA9PiBwYXguUlBIID09IHRoaXMuU2VsZWN0ZWRSUEgpO1xyXG4gICAgICAgIGlmIChzZWxQYXggJiYgc2VsUGF4Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3Qoc2VsUGF4WzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG9yaWdpbiA9IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5PcmlnaW47XHJcbiAgICAgICAgdmFyIGRlc3RpbmF0aW9uID0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLkRlc3RpbmF0aW9uO1xyXG4gICAgICAgIHRoaXMuU2VhdE1hcExpc3QgPSB0aGlzLl9zaGFyZWQuR2V0U2VhdE1hcCgpXHJcbiAgICAgICAgdGhpcy5TaG93U2VhdE1hcExpc3QgPSB0aGlzLlNlYXRNYXBMaXN0Lkl0ZW1zWzBdO1xyXG4gICAgICAgIHRoaXMuU2VhdFByb2R1Y3RJbmZvID0gdGhpcy5TZWF0TWFwTGlzdC5JdGVtc1swXS5TZWF0UHJvZHVjdEluZm9ybWF0aW9uO1xyXG4gICAgICAgIGlmICh0aGlzLlNlYXRNYXBMaXN0Lkl0ZW1zLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5pc011bHRpTGVnRkxpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5sZWdzSW5mbyA9IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5MZWdzO1xyXG4gICAgICAgICAgICB0aGlzLmxlZ3NJbmZvLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzU2VnU2VsZWN0ZWRbaW5kZXhdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGRhdGEuaXNMZWdTZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGhpcy5TZWF0TWFwTGlzdFwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5TZWF0TWFwTGlzdCkpO1xyXG4gICAgICAgICAgICB0aGlzLlNob3dTZWF0TWFwTGlzdCA9IHRoaXMuU2VhdE1hcExpc3QuSXRlbXMuZmlsdGVyKG0gPT4gbS5GbGlnaHRTZWdtZW50Lk9yaWdpbi5Mb2NhdGlvbkNvZGUgPT0gb3JpZ2luICYmIG0uRmxpZ2h0U2VnbWVudC5EZXN0aW5hdGlvbi5Mb2NhdGlvbkNvZGUgPT0gZGVzdGluYXRpb24pWzBdO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRoaXMuU2hvd1NlYXRNYXBMaXN0XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLlNob3dTZWF0TWFwTGlzdCkpO1xyXG4gICAgICAgICAgICB0aGlzLkZpcnN0U2VnT3JpZ2luID0gdGhpcy5TZWF0TWFwTGlzdC5JdGVtc1swXS5GbGlnaHRTZWdtZW50Lk9yaWdpbi5Mb2NhdGlvbkNvZGU7XHJcbiAgICAgICAgICAgIHRoaXMuRmlyc3RTZWdEZXN0ID0gdGhpcy5TZWF0TWFwTGlzdC5JdGVtc1swXS5GbGlnaHRTZWdtZW50LkRlc3RpbmF0aW9uLkxvY2F0aW9uQ29kZTtcclxuICAgICAgICAgICAgdGhpcy5TZWNvbmRTZWdPcmlnaW4gPSB0aGlzLlNlYXRNYXBMaXN0Lkl0ZW1zWzJdLkZsaWdodFNlZ21lbnQuT3JpZ2luLkxvY2F0aW9uQ29kZTtcclxuICAgICAgICAgICAgdGhpcy5TZWNvbmRTZWdEZXN0ID0gdGhpcy5TZWF0TWFwTGlzdC5JdGVtc1syXS5GbGlnaHRTZWdtZW50LkRlc3RpbmF0aW9uLkxvY2F0aW9uQ29kZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxhYmVsID0gdGhpcy5wYWdlQ29udC5uYXRpdmVFbGVtZW50XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBvYnNlcnZlciA9IGxhYmVsLm9uKFwibG9hZGVkLCB0YXAsIGxvbmdQcmVzcywgc3dpcGUsIG5nTW9kZWxDaGFuZ2VcIiwgZnVuY3Rpb24gKGFyZ3M6IGdlc3R1cmVzLkdlc3R1cmVFdmVudERhdGEpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFdmVudDogXCIgKyBhcmdzLmV2ZW50TmFtZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuX3RpbWVvdXRTZXJ2aWNlLnRpbWVyKTtcclxuICAgICAgICAgICAgc2VsZi5fdGltZW91dFNlcnZpY2UucmVzZXRXYXRjaCgpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmlzTXVsdGlJbml0aWFsUGFzc2VuZ2VyKClcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldFNlYXRNYXAoaXNJbml0OiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImdldFNlYXRNYXAgY2FsbGVkIGhlcmUgXCIpO1xyXG4gICAgICAgIHZhciBGbGlnaHROdW1iZXIgPSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uTWFya2V0aW5nRmxpZ2h0O1xyXG4gICAgICAgIHZhciBPcGVyYXRpbmdGbGlnaHQgPSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uT3BlcmF0aW5nRmxpZ2h0O1xyXG4gICAgICAgIHZhciBkYXRlID0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLkRlcGFydHVyZURhdGVUaW1lLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdmFyIERhdGUxID0gZGF0ZS5zbGljZSgwLCAxMCk7XHJcbiAgICAgICAgdmFyIG9yaWdpbiA9IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5PcmlnaW47XHJcbiAgICAgICAgdmFyIGRlc3RpbmF0aW9uID0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLkRlc3RpbmF0aW9uO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTGVnc1wiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLkxlZ3MpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImRlc3RcIiArIEpTT04uc3RyaW5naWZ5KEZsaWdodE51bWJlci5zdWJzdHIoMCwgMikpKTtcclxuICAgICAgICBpZiAoKEZsaWdodE51bWJlci5zdWJzdHIoMCwgMikgPT0gXCJDTVwiICYmIHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5PcGVyYXRpbmdGbGlnaHQgPT0gbnVsbCkgfHwgKHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5PcGVyYXRpbmdGbGlnaHQgIT0gbnVsbCAmJiB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uT3BlcmF0aW5nRmxpZ2h0LnN1YnN0cigwLCAyKSA9PSBcIkNNXCIpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uT3BlcmF0aW5nRmxpZ2h0ICE9IG51bGwgJiYgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLk9wZXJhdGluZ0ZsaWdodC5zdWJzdHIoMCwgMikgPT0gXCJDTVwiKSB7XHJcbiAgICAgICAgICAgICAgICBGbGlnaHROdW1iZXIgPSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uT3BlcmF0aW5nRmxpZ2h0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHNlbFBheCA9IHRoaXMuUGFzc2VuZ2VyTGlzdC5maWx0ZXIocGF4ID0+IHBheC5SUEggPT0gdGhpcy5TZWxlY3RlZFJQSCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlYXRtYXAuR2V0U2VhdE1hcChGbGlnaHROdW1iZXIsIERhdGUxLCBvcmlnaW4sIHNlbFBheFswXS5GaXJzdE5hbWUsIHNlbFBheFswXS5MYXN0TmFtZSwgTnVtYmVyKHNlbFBheFswXS5QYXNzZW5nZXJTZXFOdW1iZXIpLCBzZWxQYXhbMF0uT3JkZXJJRClcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhdG1hcERldGFpbHMgPSA8U2VhdE1hcFRlbXBsYXRlPnJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLkdldFBhc3Nlbmdlcih0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUGFzc2VuZ2VyWzBdLk9yZGVySUQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0UGFzc2VuZ2VyKDxPcmRlci5Sb290T2JqZWN0PmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdzSW5mbyA9IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5MZWdzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdzSW5mby5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTZWdTZWxlY3RlZFtpbmRleF0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuaXNMZWdTZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNjVGFibGU6IGFueVtdID0gdGhpcy5fc2hhcmVkLkdldFN0YXJ0dXBUYWJsZSgpLlRhYmxlcy5TZWN1cml0eUNvZGVUYWJsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb0ZsaWdodFdpdGhQYXhUZW1wbGF0ZSh0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCksIG51bGwsIHNjVGFibGUsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLkxlZ3MgPSB0aGlzLmxlZ3NJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXNzZW5nZXJMaXN0ID0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlBhc3NlbmdlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGFzc2VuZ2VyTGlzdC5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRhdGEuUHJldlNlYXQgPSBkYXRhLlNlYXROdW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5TZWF0TnVtYmVyID0gZGF0YS5TZWF0c1swXS5TZWF0TnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZWxQYXggPSB0aGlzLlBhc3Nlbmdlckxpc3QuZmlsdGVyKHBheCA9PiBwYXguUlBIID09IHRoaXMuU2VsZWN0ZWRSUEgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbFBheCAmJiBzZWxQYXgubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0KHNlbFBheFswXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNlYXRNYXA6XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnNlYXRtYXBEZXRhaWxzICkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWF0TWFwTGlzdCA9IENvbnZlcnRlcnMuQ29udmVydFRvU2VhdE1hcCh0aGlzLnNlYXRtYXBEZXRhaWxzLCB0aGlzLlBhc3Nlbmdlckxpc3QsIEZsaWdodE51bWJlciwgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLkxlZ3MsIG9yaWdpbiwgZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTZWF0TWFwOlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5TZWF0TWFwTGlzdCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TaG93U2VhdE1hcExpc3QgPSB0aGlzLlNlYXRNYXBMaXN0Lkl0ZW1zWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWF0UHJvZHVjdEluZm8gPSB0aGlzLlNlYXRNYXBMaXN0Lkl0ZW1zWzBdLlNlYXRQcm9kdWN0SW5mb3JtYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5TZWF0TWFwTGlzdC5JdGVtcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc011bHRpTGVnRkxpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZ3NJbmZvID0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLkxlZ3M7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWdzSW5mby5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU2VnU2VsZWN0ZWRbaW5kZXhdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5pc0xlZ1NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2hvd1NlYXRNYXBMaXN0ID0gdGhpcy5TZWF0TWFwTGlzdC5JdGVtcy5maWx0ZXIobSA9PiBtLkZsaWdodFNlZ21lbnQuT3JpZ2luLkxvY2F0aW9uQ29kZSA9PSBvcmlnaW4gJiYgbS5GbGlnaHRTZWdtZW50LkRlc3RpbmF0aW9uLkxvY2F0aW9uQ29kZSA9PSBkZXN0aW5hdGlvbilbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5GaXJzdFNlZ09yaWdpbiA9IHRoaXMuU2VhdE1hcExpc3QuSXRlbXNbMF0uRmxpZ2h0U2VnbWVudC5PcmlnaW4uTG9jYXRpb25Db2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRmlyc3RTZWdEZXN0ID0gdGhpcy5TZWF0TWFwTGlzdC5JdGVtc1swXS5GbGlnaHRTZWdtZW50LkRlc3RpbmF0aW9uLkxvY2F0aW9uQ29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNlY29uZFNlZ09yaWdpbiA9IHRoaXMuU2VhdE1hcExpc3QuSXRlbXNbMl0uRmxpZ2h0U2VnbWVudC5PcmlnaW4uTG9jYXRpb25Db2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2Vjb25kU2VnRGVzdCA9IHRoaXMuU2VhdE1hcExpc3QuSXRlbXNbMl0uRmxpZ2h0U2VnbWVudC5EZXN0aW5hdGlvbi5Mb2NhdGlvbkNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuV2FybmluZ3MubGVuZ3RoID4gMCB8fCByZXN1bHQuV2FybmluZ3MgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidG9hc3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lldhcm5pbmdzLmZvckVhY2goKHdhcm5pbmcsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KHdhcm5pbmcuTWVzc2FnZSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBzZWF0IGluZm9ybWF0aW9uIFwiICsgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2VhdCBNYXAgUmV0cmlldmVkIHN1Y2Nlc3NmdWxseScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdsZW5naHQnICsgdGhpcy5TZWF0TWFwTGlzdC5DYWJpbkxpc3RbMF0uQWlyUm93TGlzdFswXS5BaXJTZWF0TGlzdC5sZW5ndGgudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKEZsaWdodE51bWJlci5zdWJzdHIoMCwgMikgPT0gXCJDTVwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgRmxpZ2h0TnVtID0gT3BlcmF0aW5nRmxpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgRmxpZ2h0TnVtID0gRmxpZ2h0TnVtYmVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBQYXhBcnJheSA9IFtuZXcgU2VhdE1hcE9BUGF4LlBhc3NlbmdlcigpXTtcclxuICAgICAgICAgICAgUGF4QXJyYXkubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgdGhpcy5QYXNzZW5nZXJMaXN0LmZvckVhY2goKHBheERhdGEsIEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGF4OiBTZWF0TWFwT0FQYXguUGFzc2VuZ2VyID0gbmV3IFNlYXRNYXBPQVBheC5QYXNzZW5nZXIoKTtcclxuICAgICAgICAgICAgICAgIHBheC5GaXJzdG5hbWUgPSBwYXhEYXRhLkZpcnN0TmFtZTtcclxuICAgICAgICAgICAgICAgIHBheC5MYXN0bmFtZSA9IHBheERhdGEuTGFzdE5hbWU7XHJcbiAgICAgICAgICAgICAgICBwYXguR3JvdXBQTlIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHBheC5PcmRlcklkID0gcGF4RGF0YS5PcmRlcklEO1xyXG4gICAgICAgICAgICAgICAgcGF4LlBhc3NlbmdlclR5cGVDb2RlID0gcGF4RGF0YS5QYXNzZW5nZXJUeXBlQ29kZTtcclxuICAgICAgICAgICAgICAgIHBheC5SUEggPSBwYXhEYXRhLlJQSDtcclxuICAgICAgICAgICAgICAgIFBheEFycmF5LnB1c2gocGF4KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgdGhpcy5QYXNzZW5nZXJMaXN0Rm9yT0FTZWF0TWFwLlBhc3NlbmdlcnMgPSBQYXhBcnJheTtcclxuICAgICAgICAgICAgbGV0IG9wdGlvbmFsUmVmOiBTZWF0TWFwT0FQYXguT3B0aW9uYWxGZWVPcHRpb25zID0gbmV3IFNlYXRNYXBPQVBheC5PcHRpb25hbEZlZU9wdGlvbnMoKTtcclxuICAgICAgICAgICAgb3B0aW9uYWxSZWYuQWNjb3VudENvZGUgPSBudWxsO1xyXG4gICAgICAgICAgICBvcHRpb25hbFJlZi5UaWNrZXREYXRlT2ZJc3N1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIG9wdGlvbmFsUmVmLlRpY2tldERlc2lnbmF0b3IgPSBudWxsO1xyXG4gICAgICAgICAgICBvcHRpb25hbFJlZi5Ub3VyQ29kZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuUGFzc2VuZ2VyTGlzdEZvck9BU2VhdE1hcC5PcHRpb25hbEZlZU9wdGlvbnMgPSBvcHRpb25hbFJlZjtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXcgUGF4IHN0OlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5QYXNzZW5nZXJMaXN0Rm9yT0FTZWF0TWFwKSk7XHJcbiAgICAgICAgICAgIHZhciBwcmV2aW91c0luZGV4ID0gdGhpcy5pbmRleCAtIDE7XHJcbiAgICAgICAgICAgIHZhciBGbGlnaHROdW1iZXIgPSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbcHJldmlvdXNJbmRleF0uTWFya2V0aW5nRmxpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgT3BlcmF0aW5nRmxpZ2h0ID0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3ByZXZpb3VzSW5kZXhdLk9wZXJhdGluZ0ZsaWdodDtcclxuICAgICAgICAgICAgdmFyIGRhdGUgPSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbcHJldmlvdXNJbmRleF0uRGVwYXJ0dXJlRGF0ZVRpbWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgdmFyIERhdGUxID0gZGF0ZS5zbGljZSgwLCAxMCk7XHJcbiAgICAgICAgICAgIHZhciBvcmlnaW4gPSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbcHJldmlvdXNJbmRleF0uT3JpZ2luO1xyXG4gICAgICAgICAgICB2YXIgZGVzdGluYXRpb24gPSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbcHJldmlvdXNJbmRleF0uRGVzdGluYXRpb247XHJcbiAgICAgICAgICAgIGxldCBzZWxQYXggPSB0aGlzLlBhc3Nlbmdlckxpc3QuZmlsdGVyKHBheCA9PiBwYXguUlBIID09IHRoaXMuU2VsZWN0ZWRSUEgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWF0bWFwLkdldFNlYXRNYXAoRmxpZ2h0TnVtYmVyLCBEYXRlMSwgb3JpZ2luLCBzZWxQYXhbMF0uRmlyc3ROYW1lLCBzZWxQYXhbMF0uTGFzdE5hbWUsIE51bWJlcihzZWxQYXhbMF0uUGFzc2VuZ2VyU2VxTnVtYmVyKSwgc2VsUGF4WzBdLk9yZGVySUQpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lkl0ZW1zICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWF0bWFwRGV0YWlscyA9IDxTZWF0TWFwVGVtcGxhdGU+cmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3Vyb3JpZ2luID0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLk9yaWdpbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cmRlc3RpbmF0aW9uID0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLkRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlBhc3Nlbmdlckxpc3QgPSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUGFzc2VuZ2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2VhdE1hcExpc3QgPSBDb252ZXJ0ZXJzLk9Bc2VhdG1hcCh0aGlzLnNlYXRtYXBEZXRhaWxzLCB0aGlzLlBhc3Nlbmdlckxpc3QsIEZsaWdodE51bSwgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLkxlZ3MsIGN1cm9yaWdpbiwgY3VyZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5TZWF0TWFwTGlzdC5JdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNob3dTZWF0TWFwTGlzdCA9IHRoaXMuU2VhdE1hcExpc3QuSXRlbXNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNlYXRQcm9kdWN0SW5mbyA9IHRoaXMuU2VhdE1hcExpc3QuSXRlbXNbMF0uU2VhdFByb2R1Y3RJbmZvcm1hdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJPdXRzaWRlIHNlYXRtYXBcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuV2FybmluZ3MubGVuZ3RoID4gMCB8fCByZXN1bHQuV2FybmluZ3MgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lldhcm5pbmdzLmZvckVhY2goKHdhcm5pbmcsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQod2FybmluZy5NZXNzYWdlKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQocmVzdWx0Lldhcm5pbmdzWzBdLk1lc3NhZ2UpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ291bGRudCBmaW5kIHNlYXQgaW5mb3JtYXRpb24gXCIgKyBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWF0IE1hcCBSZXRyaWV2ZWQgc3VjY2Vzc2Z1bGx5JylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2Vzc2Z1bGxcIik7XHJcbiAgICB9XHJcbiAgICBjYXRjaChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzTXVsdGlJbml0aWFsUGFzc2VuZ2VyKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKS5QYXNzZW5nZXJzLmZpbHRlcihtID0+IG0uR3JvdXBlZEdpdmVuTmFtZS5zcGxpdCgnLycpLmxlbmd0aCA+PSAyKS5sZW5ndGgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCkuUGFzc2VuZ2Vycy5maWx0ZXIobSA9PiBtLkdyb3VwZWRHaXZlbk5hbWUuc3BsaXQoJy8nKS5sZW5ndGggPj0gMikubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpLlBhc3NlbmdlcnMuZmlsdGVyKG0gPT4gbS5Hcm91cGVkR2l2ZW5OYW1lLnNwbGl0KCcvJykubGVuZ3RoID09IDIpLmxlbmd0aCA+IDAgJiYgdGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpLlBhc3NlbmdlcnMuZmlsdGVyKG0gPT4gbS5Bc3NvY2lhdGVkQWR1bHRSUEggPT0gbnVsbCAmJiBtLkFzc29jaWF0ZWRJbmZhbnRSUEggPT0gbnVsbCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5NdWx0aUludGlhbFBheCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpLlBhc3NlbmdlcnMuZmlsdGVyKG0gPT4gbS5Hcm91cGVkR2l2ZW5OYW1lLnNwbGl0KCcvJykubGVuZ3RoID4gMikubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5NdWx0aUludGlhbFBheCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB0aGlzLk11bHRpSW50aWFsUGF4ID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHRoaXMuTXVsdGlJbnRpYWxQYXggPSBmYWxzZTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLk11bHRpSW50aWFsUGF4KTtcclxuICAgIH1cclxuXHJcbiAgICBub1NlYXQocGFzc2VuZ2VybHM6IE11bHRpU2VnbWVudFRlbXBsYXRlLlBhc3Nlbmdlcikge1xyXG4gICAgICAgIHBhc3NlbmdlcmxzLk5vU2VhdCA9ICFwYXNzZW5nZXJscy5Ob1NlYXQ7XHJcbiAgICAgICAgdGhpcy5zZWxlY3QocGFzc2VuZ2VybHMsIHRydWUpXHJcbiAgICB9XHJcbiAgICByZWZyZXNoRmxpZm8oKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XHJcbiAgICAgICAgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50LmZvckVhY2goKFNlZ0VsZSwgU2VnSW5uZGV4KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGVwYXJ0dXJlRGF0ZTogc3RyaW5nID0gbW9tZW50KFNlZ0VsZS5EZXBhcnR1cmVEYXRlVGltZS50b1N0cmluZygpKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xyXG4gICAgICAgICAgICBsZXQgZmxpZ2h0bnVtYmVyOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGlmIChTZWdFbGUuTWFya2V0aW5nRmxpZ2h0LnN1YnN0cigwLCAyKSA9PSBcIkNNXCIpIHtcclxuICAgICAgICAgICAgICAgIGZsaWdodG51bWJlciA9IFNlZ0VsZS5NYXJrZXRpbmdGbGlnaHQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoU2VnRWxlLk9wZXJhdGluZ0ZsaWdodCAhPSBudWxsICYmIFNlZ0VsZS5PcGVyYXRpbmdGbGlnaHQuc3Vic3RyKDAsIDIpID09IFwiQ01cIikge1xyXG4gICAgICAgICAgICAgICAgZmxpZ2h0bnVtYmVyID0gU2VnRWxlLk9wZXJhdGluZ0ZsaWdodDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZsaWdodG51bWJlciA9IFNlZ0VsZS5NYXJrZXRpbmdGbGlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGNpdHk6IHN0cmluZyA9IFNlZ0VsZS5EZXBhcnR1cmVDaXR5O1xyXG4gICAgICAgICAgICBTZWdFbGUuZGF0ZSA9IG1vbWVudChTZWdFbGUuRGVwYXJ0dXJlRGF0ZVRpbWUudG9TdHJpbmcoKSkuZm9ybWF0KFwiREQtTU1NLVlZWVlcIik7XHJcbiAgICAgICAgICAgIHZhciBkZXN0aW5hdGlvbiA9IFNlZ0VsZS5EZXN0aW5hdGlvbjtcclxuICAgICAgICAgICAgLy8gLy9JbnZlbnRvcnlcclxuICAgICAgICAgICAgdGhpcy5fY2hlY2tpbi5Cb29raW5nQ291bnREaXNwbGF5KGRlcGFydHVyZURhdGUsIGZsaWdodG51bWJlciwgY2l0eSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW52ZW50b3J5OiBhbnkgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5pbnZlbiA9IENvbnZlcnRlcnMuQ29udmVydFRvSW52ZW50b3J5KGludmVudG9yeSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vSW5ib3VuZFxyXG4gICAgICAgICAgICB0aGlzLl9jaGVja2luLkluQm91bmQoZGVwYXJ0dXJlRGF0ZSwgZmxpZ2h0bnVtYmVyLCBjaXR5KVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbkJvdW5kOiBhbnkgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5pbmJvdW5kID0gQ29udmVydGVycy5Db252ZXJ0VG9JbkJvdW5kKGluQm91bmQpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8vT3V0Ym91bmRcclxuICAgICAgICAgICAgdGhpcy5fY2hlY2tpbi5PdXRCb3VuZChkZXBhcnR1cmVEYXRlLCBmbGlnaHRudW1iZXIsIGRlc3RpbmF0aW9uKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBPdXRCb3VuZDogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBTZWdFbGUub3V0Ym91bmQgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb091dEJvdW5kKE91dEJvdW5kKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvL3N0YXR1c1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhU2VydmljZS5TdGF0dXMoZGVwYXJ0dXJlRGF0ZSwgZmxpZ2h0bnVtYmVyLCBjaXR5KVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdGF0dXM6IGFueSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgU2VnRWxlLnN0YXR1cyA9IHN0YXR1cy5GbGlnaHRzWzBdLkxlZ3NbMF0uU3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5MZWdzID0gc3RhdHVzLkZsaWdodHNbMF0uTGVncztcclxuICAgICAgICAgICAgICAgICAgICBTZWdFbGUuRVREID0gc3RhdHVzLkZsaWdodHNbMF0uTGVnc1swXS5EZXBhcnR1cmVEYXRlVGltZS5Fc3RpbWF0ZWQudG9TdHJpbmcoKS5zdWJzdHIoMTEsIDUpO1xyXG4gICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5TVEQgPSBzdGF0dXMuRmxpZ2h0c1swXS5MZWdzWzBdLkRlcGFydHVyZURhdGVUaW1lLlNjaGVkdWxlZC50b1N0cmluZygpLnN1YnN0cigxMSwgNSk7XHJcbiAgICAgICAgICAgICAgICAgICAgU2VnRWxlLkVUQSA9IHN0YXR1cy5GbGlnaHRzWzBdLkxlZ3NbMF0uQXJyaXZhbERhdGVUaW1lLlNjaGVkdWxlZC50b1N0cmluZygpLnN1YnN0cigxMSwgNSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdHVzLkZsaWdodHNbMF0uTGVnc1swXS5EZXBhcnR1cmVEYXRlVGltZS5Fc3RpbWF0ZWQudG9TdHJpbmcoKS5zdWJzdHIoMTEsIDUpICsgXCJsbGxsXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFzc2VuZ2VyTGVuZ3RoID0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50Lmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3Nlbmdlckxlbmd0aCA9PSBTZWdJbm5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldEJhZ1RhZyhudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFNlZ21lbnREZXRhaWwodGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXNzaWduU2VhdChwYXNzZW5nZXJMaXN0OiBNdWx0aVNlZ21lbnRUZW1wbGF0ZS5QYXNzZW5nZXJbXSwgU2VhdENoYXJhY3RlcmlzdGljOiBhbnkpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLk11bHRpSW5pdGFsTm9TZWF0QXNzaWduID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTXVsdGlJbml0aWFsUGFzc2VuZ2VyQ2hlY2spIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuUGFzc2VuZ2VyTGlzdC5mb3JFYWNoKChwYXhEYXRhLCBJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXhEYXRhLlNlYXROdW1iZXIgPT0gbnVsbCAmJiBwYXhEYXRhLk5vU2VhdCA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLk11bHRpSW5pdGFsTm9TZWF0QXNzaWduID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnZhbGlkIFJlcXVlc3QgLSBNdWx0aS10eXBlIHNlYXQgcmVxdWVzdCBtdWx0aSBpbml0aWFsIHN1cm5hbWUgYXJlIG5vdCBhbGxvd2VkLlwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYocGF4RGF0YS5TZWF0TnVtYmVyID09IHBheERhdGEuUHJldlNlYXQgJiYgcGF4RGF0YS5Ob1NlYXQgPT0gZmFsc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLk11bHRpSW5pdGFsTm9TZWF0QXNzaWduID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnZhbGlkIFJlcXVlc3QgLSBNdWx0aS10eXBlIHNlYXQgcmVxdWVzdCBtdWx0aSBpbml0aWFsIHN1cm5hbWUgYXJlIG5vdCBhbGxvd2VkLlwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuTXVsdGlJbml0YWxOb1NlYXRBc3NpZ24pIHtcclxuICAgICAgICAgICAgICAgIHZhciBGbGlnaHROdW1iZXIgPSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uTWFya2V0aW5nRmxpZ2h0O1xyXG4gICAgICAgICAgICAgICAgaWYgKChGbGlnaHROdW1iZXIuc3Vic3RyKDAsIDIpID09IFwiQ01cIiAmJiB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uT3BlcmF0aW5nRmxpZ2h0ID09IG51bGwpIHx8ICh0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uT3BlcmF0aW5nRmxpZ2h0ICE9IG51bGwgJiYgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLk9wZXJhdGluZ0ZsaWdodC5zdWJzdHIoMCwgMikgPT0gXCJDTVwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBPcmRlcnMgPSB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWF0UmVxdWVzdCA9IENvbnZlcnRlcnMuQ29udmVydFRvQXNzaWduU2VhdChwYXNzZW5nZXJMaXN0LCB0aGlzLkZsaWdodEluZm8sIE9yZGVycywgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlckxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcXVlc3QgOiBcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuc2VhdFJlcXVlc3QpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWF0bWFwLkFzc2lnblNlYXQodGhpcy5zZWF0UmVxdWVzdCkuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhdFJlc3BvbnNlID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlYXRSZXNwb25zZS5TdWNjZXNzICE9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWF0UmVzcG9uc2UuQ2hlY2tJblJlc3BvbnNlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIjNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWF0UmVzcG9uc2UuU2VydmljZVJlc3BvbnNlWzBdLk9yZGVyLlNlZ21lbnRUcmF2ZWxlckluZm9zLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlNlZ21lbnRSUEggPT0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlJQSCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlBhc3Nlbmdlci5mb3JFYWNoKChQQXhEYXRhLCBQYXhJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlBhc3NlbmdlclJQSCA9PSBQQXhEYXRhLlJQSCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5TZWF0c1swXS5TZWF0TnVtYmVyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBBeERhdGEuU2VhdE51bWJlciA9IGRhdGEuU2VhdHNbMF0uU2VhdE51bWJlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBBeERhdGEuU2VhdHMgPSBkYXRhLlNlYXRzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFBhc3NlbmdlcnMgPSB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzZW5nZXJzLlNlZ21lbnRUcmF2ZWxlckluZm9zLmZvckVhY2goKHNlZ0VsZSwgc2VnaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VnRWxlLlNlZ21lbnRSUEggPT0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlJQSCAmJiBzZWdFbGUuUGFzc2VuZ2VyUlBIID09IGRhdGEuUGFzc2VuZ2VyUlBIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZ0VsZS5TZWF0cyA9IFBBeERhdGEuU2VhdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKS5TZWdtZW50VHJhdmVsZXJJbmZvc1tzZWdpbmRleF0uU2VhdHMgPSBQQXhEYXRhLlNlYXRzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBhc3Nlbmdlckxpc3QuSXNTZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRTZWF0TWFwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRvYXN0Lm1ha2VUZXh0KEpTT04uc3RyaW5naWZ5KHRoaXMuc2VhdFJlc3BvbnNlLlNlcnZpY2VSZXNwb25zZVswXS5XYXJuaW5nc1swXS5NZXNzYWdlKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhdFJlc3BvbnNlLkNoZWNrSW5SZXNwb25zZS5XYXJuaW5ncy5mb3JFYWNoKCh3YXJuaW5nLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChKU09OLnN0cmluZ2lmeSh3YXJuaW5nLk1lc3NhZ2UpKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwYXNzZW5nZXJMaXN0LklzU2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFNlYXRNYXAoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuc2VhdFJlc3BvbnNlLkNoZWNrSW5SZXNwb25zZS5TZWdtZW50VHJhdmVsZXJMaXN0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIjJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VhdFJlc3BvbnNlLkNoZWNrSW5SZXNwb25zZS5FcnJvcnMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXRSZXNwb25zZS5DaGVja0luUmVzcG9uc2UuRXJyb3JzLmZvckVhY2goKGVycm9yLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSlNPTi5zdHJpbmdpZnkoZXJyb3IuTWVzc2FnZSkpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRTZWF0TWFwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VhdFJlc3BvbnNlLkNoZWNrSW5SZXNwb25zZS5XYXJuaW5ncyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFNlYXRNYXAoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRvYXN0Lm1ha2VUZXh0KEpTT04uc3RyaW5naWZ5KHRoaXMuc2VhdFJlc3BvbnNlLkNoZWNrSW5SZXNwb25zZS5XYXJuaW5nc1swXS5NZXNzYWdlKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWF0UmVzcG9uc2UuQ2hlY2tJblJlc3BvbnNlLldhcm5pbmdzLmZvckVhY2goKHdhcm5pbmcsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSlNPTi5zdHJpbmdpZnkod2FybmluZy5NZXNzYWdlKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBhc3Nlbmdlckxpc3QuSXNTZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRTZWF0TWFwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlYXRSZXNwb25zZS5DaGVja0luUmVzcG9uc2UuV2FybmluZ3MgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXRSZXNwb25zZS5DaGVja0luUmVzcG9uc2UuU2VnbWVudFRyYXZlbGVyTGlzdC5mb3JFYWNoKChzZWdtZW50VHJhdmVsaW5mbywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWdtZW50VHJhdmVsaW5mby5TZWF0c1swXS5EZXBhcnR1cmVDb2RlID09IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5PcmlnaW4gJiYgc2VnbWVudFRyYXZlbGluZm8uU2VhdHNbMF0uQXJyaXZhbENvZGUgPT0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLkRlc3RpbmF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlBhc3Nlbmdlci5mb3JFYWNoKChkYXRhLCBTZWdJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5GaXJzdE5hbWUgPT0gc2VnbWVudFRyYXZlbGluZm8uR2l2ZW5OYW1lICYmIGRhdGEuTGFzdE5hbWUgPT0gc2VnbWVudFRyYXZlbGluZm8uTGFzdE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuU2VhdE51bWJlciA9IHNlZ21lbnRUcmF2ZWxpbmZvLlNlYXRzWzBdLlNlYXROdW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLlNlYXRzID0gc2VnbWVudFRyYXZlbGluZm8uU2VhdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgUGFzc2VuZ2VycyA9IHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhc3NlbmdlcnMuU2VnbWVudFRyYXZlbGVySW5mb3MuZm9yRWFjaCgoc2VnRWxlLCBzZWdpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWdFbGUuU2VnbWVudFJQSCA9PSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUlBIICYmIHNlZ0VsZS5QYXNzZW5nZXJSUEggPT0gc2VnbWVudFRyYXZlbGluZm8uUGFzc2VuZ2VyUlBIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZ0VsZS5TZWF0cyA9IGRhdGEuU2VhdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKS5TZWdtZW50VHJhdmVsZXJJbmZvc1tzZWdpbmRleF0uU2VhdHMgPSBkYXRhLlNlYXRzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhdFJlc3BvbnNlLkNoZWNrSW5SZXNwb25zZS5XYXJuaW5ncy5mb3JFYWNoKCh3YXJuaW5nLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSlNPTi5zdHJpbmdpZnkod2FybmluZy5NZXNzYWdlKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXRSZXNwb25zZS5DaGVja0luUmVzcG9uc2UuU2VnbWVudFRyYXZlbGVyTGlzdC5mb3JFYWNoKChzZWdtZW50VHJhdmVsaW5mbywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWdtZW50VHJhdmVsaW5mby5TZWF0cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlZ21lbnRUcmF2ZWxpbmZvLlNlYXRzWzBdLkRlcGFydHVyZUNvZGUgPT0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLk9yaWdpbiAmJiBzZWdtZW50VHJhdmVsaW5mby5TZWF0c1swXS5BcnJpdmFsQ29kZSA9PSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uRGVzdGluYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIFNlZ0luZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLkZpcnN0TmFtZSA9PSBzZWdtZW50VHJhdmVsaW5mby5HaXZlbk5hbWUgJiYgZGF0YS5MYXN0TmFtZSA9PSBzZWdtZW50VHJhdmVsaW5mby5MYXN0TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbml0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWdtZW50VHJhdmVsaW5mby5TZWF0c1swXS5TZWF0TnVtYmVyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5TZWF0TnVtYmVyID0gc2VnbWVudFRyYXZlbGluZm8uU2VhdHNbMF0uU2VhdE51bWJlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5TZWF0cyA9IHNlZ21lbnRUcmF2ZWxpbmZvLlNlYXRzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgUGFzc2VuZ2VycyA9IHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGFzc2VuZ2Vycy5TZWdtZW50VHJhdmVsZXJJbmZvcy5mb3JFYWNoKChzZWdFbGUsIHNlZ2luZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VnRWxlLlNlZ21lbnRSUEggPT0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlJQSCAmJiBzZWdFbGUuUGFzc2VuZ2VyUlBIID09IHNlZ21lbnRUcmF2ZWxpbmZvLlBhc3NlbmdlclJQSCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZ0VsZS5TZWF0cyA9IGRhdGEuU2VhdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpLlNlZ21lbnRUcmF2ZWxlckluZm9zW3NlZ2luZGV4XS5TZWF0cyA9IGRhdGEuU2VhdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5fc2hhcmVkLlNldFBhc3NlbmdlcihQYXNzZW5nZXJzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRvYXN0Lm1ha2VUZXh0KEpTT04uc3RyaW5naWZ5KHRoaXMuc2VhdFJlc3BvbnNlLkNoZWNrSW5SZXNwb25zZS5XYXJuaW5nc1swXS5NZXNzYWdlKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwYXNzZW5nZXJMaXN0LklzU2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2VhdE1hcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIDogXCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnNlYXRSZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlYXRSZXNwb25zZS5DaGVja0luUmVzcG9uc2UuRXJyb3JzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWF0UmVzcG9uc2UuQ2hlY2tJblJlc3BvbnNlLkVycm9ycy5mb3JFYWNoKChlcnJvciwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KEpTT04uc3RyaW5naWZ5KGVycm9yLk1lc3NhZ2UpKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2VhdE1hcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlYXRSZXNwb25zZS5DaGVja0luUmVzcG9uc2UuV2FybmluZ3MgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRTZWF0TWFwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUb2FzdC5tYWtlVGV4dChKU09OLnN0cmluZ2lmeSh0aGlzLnNlYXRSZXNwb25zZS5DaGVja0luUmVzcG9uc2UuV2FybmluZ3NbMF0uTWVzc2FnZSkpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhdFJlc3BvbnNlLkNoZWNrSW5SZXNwb25zZS5XYXJuaW5ncy5mb3JFYWNoKCh3YXJuaW5nLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KEpTT04uc3RyaW5naWZ5KHdhcm5pbmcuTWVzc2FnZSkpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwYXNzZW5nZXJMaXN0LklzU2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2VhdE1hcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWF0UmVzcG9uc2UuRXJyb3JzICE9IG51bGwgJiYgdGhpcy5zZWF0UmVzcG9uc2UuRXJyb3JzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXRSZXNwb25zZS5FcnJvcnMuZm9yRWFjaCgoZXJyb3IsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGVycm9yLk1lc3NhZ2UpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuR2V0T3JkZXJEZXRhaWxzKHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5QYXNzZW5nZXJbMF0uT3JkZXJJRCk7ICAgICAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTZWF0IGFzc2lnbm1lbnQvdXBkYXRlIGVycm9yIFwiICsgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5zZWF0UmVxdWVzdC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5CdXR0b25Db250aW51ZSA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3NmdWxsXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQWxsUGF4Q2hlY2tlZEluID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlckxpc3QuZm9yRWFjaCgocGF4RGF0YSwgSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBheERhdGEuQ2hlY2tpblN0YXR1cyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0FsbFBheENoZWNrZWRJbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0FsbFBheENoZWNrZWRJbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNBbGxQYXhDaGVja2VkSW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBPcmRlcnMgPSB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKE9yZGVycyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuc2VhdFJlcXVlc3QgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXRSZXF1ZXN0ID0gQ29udmVydGVycy5Db252ZXJ0VG9Bc3NpZ25TZWF0KHBhc3Nlbmdlckxpc3QsIHRoaXMuRmxpZ2h0SW5mbywgT3JkZXJzLCB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlckxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0IDogXCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnNlYXRSZXF1ZXN0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlYXRtYXAuQXNzaWduU2VhdCh0aGlzLnNlYXRSZXF1ZXN0KS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhdFJlc3BvbnNlID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VhdFJlc3BvbnNlLlN1Y2Nlc3MgIT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWF0UmVzcG9uc2UuQmFkUmVxdWVzdCA9PSA0MDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSlNPTi5zdHJpbmdpZnkodGhpcy5zZWF0UmVzcG9uc2UuRXJyb3JNZXNzYWdlKSkuc2hvdygpOztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRTZWF0TWFwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlYXRSZXNwb25zZS5DaGVja0luUmVzcG9uc2UgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIjNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhdFJlc3BvbnNlLlNlcnZpY2VSZXNwb25zZVswXS5PcmRlci5TZWdtZW50VHJhdmVsZXJJbmZvcy5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuU2VnbWVudFJQSCA9PSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUlBIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlBhc3Nlbmdlci5mb3JFYWNoKChQQXhEYXRhLCBQYXhJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5QYXNzZW5nZXJSUEggPT0gUEF4RGF0YS5SUEgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlNlYXRzWzBdLlNlYXROdW1iZXIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBBeERhdGEuU2VhdE51bWJlciA9IGRhdGEuU2VhdHNbMF0uU2VhdE51bWJlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQQXhEYXRhLlNlYXRzID0gZGF0YS5TZWF0cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgUGFzc2VuZ2VycyA9IHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzZW5nZXJzLlNlZ21lbnRUcmF2ZWxlckluZm9zLmZvckVhY2goKHNlZ0VsZSwgc2VnaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlZ0VsZS5TZWdtZW50UlBIID09IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5SUEggJiYgc2VnRWxlLlBhc3NlbmdlclJQSCA9PSBkYXRhLlBhc3NlbmdlclJQSCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VnRWxlLlNlYXRzID0gUEF4RGF0YS5TZWF0cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKS5TZWdtZW50VHJhdmVsZXJJbmZvc1tzZWdpbmRleF0uU2VhdHMgPSBQQXhEYXRhLlNlYXRzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGFzc2VuZ2VyTGlzdC5Jc1NlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRTZWF0TWFwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRvYXN0Lm1ha2VUZXh0KEpTT04uc3RyaW5naWZ5KHRoaXMuc2VhdFJlc3BvbnNlLlNlcnZpY2VSZXNwb25zZVswXS5XYXJuaW5nc1swXS5NZXNzYWdlKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXRSZXNwb25zZS5DaGVja0luUmVzcG9uc2UuV2FybmluZ3MuZm9yRWFjaCgod2FybmluZywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KEpTT04uc3RyaW5naWZ5KHdhcm5pbmcuTWVzc2FnZSkpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGFzc2VuZ2VyTGlzdC5Jc1NlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2VhdE1hcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnNlYXRSZXNwb25zZS5DaGVja0luUmVzcG9uc2UuU2VnbWVudFRyYXZlbGVyTGlzdCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiMlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VhdFJlc3BvbnNlLkNoZWNrSW5SZXNwb25zZS5FcnJvcnMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWF0UmVzcG9uc2UuQ2hlY2tJblJlc3BvbnNlLkVycm9ycy5mb3JFYWNoKChlcnJvciwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChKU09OLnN0cmluZ2lmeShlcnJvci5NZXNzYWdlKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2VhdE1hcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VhdFJlc3BvbnNlLkNoZWNrSW5SZXNwb25zZS5XYXJuaW5ncyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRTZWF0TWFwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUb2FzdC5tYWtlVGV4dChKU09OLnN0cmluZ2lmeSh0aGlzLnNlYXRSZXNwb25zZS5DaGVja0luUmVzcG9uc2UuV2FybmluZ3NbMF0uTWVzc2FnZSkpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXRSZXNwb25zZS5DaGVja0luUmVzcG9uc2UuV2FybmluZ3MuZm9yRWFjaCgod2FybmluZywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSlNPTi5zdHJpbmdpZnkod2FybmluZy5NZXNzYWdlKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGFzc2VuZ2VyTGlzdC5Jc1NlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRTZWF0TWFwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWF0UmVzcG9uc2UuQ2hlY2tJblJlc3BvbnNlLldhcm5pbmdzID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhdFJlc3BvbnNlLkNoZWNrSW5SZXNwb25zZS5TZWdtZW50VHJhdmVsZXJMaXN0LmZvckVhY2goKHNlZ21lbnRUcmF2ZWxpbmZvLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWdtZW50VHJhdmVsaW5mby5TZWdtZW50UlBIID09IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5SUEgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlBhc3Nlbmdlci5mb3JFYWNoKChkYXRhLCBTZWdJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuRmlyc3ROYW1lID09IHNlZ21lbnRUcmF2ZWxpbmZvLkdpdmVuTmFtZSAmJiBkYXRhLkxhc3ROYW1lID09IHNlZ21lbnRUcmF2ZWxpbmZvLkxhc3ROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5TZWF0TnVtYmVyID0gc2VnbWVudFRyYXZlbGluZm8uU2VhdHNbMF0uU2VhdE51bWJlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLlNlYXRzID0gc2VnbWVudFRyYXZlbGluZm8uU2VhdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFBhc3NlbmdlcnMgPSB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGFzc2VuZ2Vycy5TZWdtZW50VHJhdmVsZXJJbmZvcy5mb3JFYWNoKChzZWdFbGUsIHNlZ2luZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWdFbGUuU2VnbWVudFJQSCA9PSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUlBIICYmIHNlZ0VsZS5QYXNzZW5nZXJSUEggPT0gc2VnbWVudFRyYXZlbGluZm8uUGFzc2VuZ2VyUlBIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdFbGUuU2VhdHMgPSBkYXRhLlNlYXRzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpLlNlZ21lbnRUcmF2ZWxlckluZm9zW3NlZ2luZGV4XS5TZWF0cyA9IGRhdGEuU2VhdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWF0UmVzcG9uc2UuQ2hlY2tJblJlc3BvbnNlLlNlZ21lbnRUcmF2ZWxlckxpc3QuZm9yRWFjaCgoc2VnbWVudFRyYXZlbGluZm8sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlZ21lbnRUcmF2ZWxpbmZvLlNlZ21lbnRSUEggPT0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlJQSCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIFNlZ0luZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5GaXJzdE5hbWUgPT0gc2VnbWVudFRyYXZlbGluZm8uR2l2ZW5OYW1lICYmIGRhdGEuTGFzdE5hbWUgPT0gc2VnbWVudFRyYXZlbGluZm8uTGFzdE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VnbWVudFRyYXZlbGluZm8uU2VhdHMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VnbWVudFRyYXZlbGluZm8uU2VhdHNbMF0uU2VhdE51bWJlciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLlNlYXROdW1iZXIgPSBzZWdtZW50VHJhdmVsaW5mby5TZWF0c1swXS5TZWF0TnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5TZWF0cyA9IHNlZ21lbnRUcmF2ZWxpbmZvLlNlYXRzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFBhc3NlbmdlcnMgPSB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzZW5nZXJzLlNlZ21lbnRUcmF2ZWxlckluZm9zLmZvckVhY2goKHNlZ0VsZSwgc2VnaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VnRWxlLlNlZ21lbnRSUEggPT0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlJQSCAmJiBzZWdFbGUuUGFzc2VuZ2VyUlBIID09IHNlZ21lbnRUcmF2ZWxpbmZvLlBhc3NlbmdlclJQSCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdFbGUuU2VhdHMgPSBkYXRhLlNlYXRzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCkuU2VnbWVudFRyYXZlbGVySW5mb3Nbc2VnaW5kZXhdLlNlYXRzID0gZGF0YS5TZWF0cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLl9zaGFyZWQuU2V0UGFzc2VuZ2VyKFBhc3NlbmdlcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRvYXN0Lm1ha2VUZXh0KEpTT04uc3RyaW5naWZ5KHRoaXMuc2VhdFJlc3BvbnNlLkNoZWNrSW5SZXNwb25zZS5XYXJuaW5nc1swXS5NZXNzYWdlKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhdFJlc3BvbnNlLkNoZWNrSW5SZXNwb25zZS5XYXJuaW5ncy5mb3JFYWNoKCh3YXJuaW5nLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChKU09OLnN0cmluZ2lmeSh3YXJuaW5nLk1lc3NhZ2UpKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwYXNzZW5nZXJMaXN0LklzU2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFNlYXRNYXAoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIDogXCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnNlYXRSZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWF0UmVzcG9uc2UuQ2hlY2tJblJlc3BvbnNlLkVycm9ycyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXRSZXNwb25zZS5DaGVja0luUmVzcG9uc2UuRXJyb3JzLmZvckVhY2goKGVycm9yLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KEpTT04uc3RyaW5naWZ5KGVycm9yLk1lc3NhZ2UpKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRTZWF0TWFwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWF0UmVzcG9uc2UuQ2hlY2tJblJlc3BvbnNlLldhcm5pbmdzID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFNlYXRNYXAoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRvYXN0Lm1ha2VUZXh0KEpTT04uc3RyaW5naWZ5KHRoaXMuc2VhdFJlc3BvbnNlLkNoZWNrSW5SZXNwb25zZS5XYXJuaW5nc1swXS5NZXNzYWdlKSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhdFJlc3BvbnNlLkNoZWNrSW5SZXNwb25zZS5XYXJuaW5ncy5mb3JFYWNoKCh3YXJuaW5nLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChKU09OLnN0cmluZ2lmeSh3YXJuaW5nLk1lc3NhZ2UpKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwYXNzZW5nZXJMaXN0LklzU2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFNlYXRNYXAoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VhdFJlc3BvbnNlLkVycm9ycyAhPSBudWxsICYmIHRoaXMuc2VhdFJlc3BvbnNlLkVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhdFJlc3BvbnNlLkVycm9ycy5mb3JFYWNoKChlcnJvciwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGVycm9yLk1lc3NhZ2UpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLkdldE9yZGVyRGV0YWlscyh0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUGFzc2VuZ2VyWzBdLk9yZGVySUQpOyAgICAgICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VhdCBhc3NpZ25tZW50L3VwZGF0ZSBlcnJvciBcIiArIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5zZWF0UmVxdWVzdC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQnV0dG9uQ29udGludWUgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQnV0dG9uQ29udGludWUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyTGlzdC5mb3JFYWNoKChzZWxlY3RlZFBhc3NlbmdlciwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5QYXNzZW5nZXIuZm9yRWFjaCgoUGF4RGF0YSwgUGF4SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBpZiAoUGF4RGF0YS5SUEggPT0gc2VsZWN0ZWRQYXNzZW5nZXIuUlBIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIFBheERhdGEuU2VhdE51bWJlciA9IHNlbGVjdGVkUGFzc2VuZ2VyLk5ld1NlYXROdW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIFBheERhdGEuU2VhdHNbMF0uU2VhdE51bWJlciA9IHNlbGVjdGVkUGFzc2VuZ2VyLk5ld1NlYXROdW1iZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFBhc3NlbmdlcnMgPSB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFBhc3NlbmdlcnMuU2VnbWVudFRyYXZlbGVySW5mb3MuZm9yRWFjaCgoc2VnRWxlLCBzZWdpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlckxpc3QuZm9yRWFjaCgoc2VsZWN0ZWRQYXNzZW5nZXIsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlZ0VsZS5TZWdtZW50UlBIID09IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5SUEggJiYgc2VnRWxlLlBhc3NlbmdlclJQSCA9PSBzZWxlY3RlZFBhc3Nlbmdlci5SUEgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VnRWxlLlNlYXRzWzBdLlNlYXROdW1iZXIgPSBzZWxlY3RlZFBhc3Nlbmdlci5OZXdTZWF0TnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCkuU2VnbWVudFRyYXZlbGVySW5mb3Nbc2VnaW5kZXhdLlNlYXRzWzBdLlNlYXROdW1iZXIgPSBzZWxlY3RlZFBhc3Nlbmdlci5OZXdTZWF0TnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBHZXRPcmRlckRldGFpbHMoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgUGFzc2VuZ2VyIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UuR2V0UGFzc2VuZ2VyKGlkKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0UGFzc2VuZ2VyKDxPcmRlci5Sb290T2JqZWN0PmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzY1RhYmxlOiBhbnlbXSA9IHRoaXMuX3NoYXJlZC5HZXRTdGFydHVwVGFibGUoKS5UYWJsZXMuU2VjdXJpdHlDb2RlVGFibGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheSA9IENvbnZlcnRlcnMuQ29udmVydFRvRmxpZ2h0V2l0aFBheFRlbXBsYXRlKHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKSwgbnVsbCwgc2NUYWJsZSwgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKFBhc3NlbmdlckFycmF5LlNlZ21lbnQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBsZXQgc2V0ZGVwYXJ0dXJlRGF0ZTogc3RyaW5nID0gbW9tZW50KFBhc3NlbmdlckFycmF5LlNlZ21lbnRbMF0uRGVwYXJ0dXJlRGF0ZVRpbWUudG9TdHJpbmcoKSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgbGV0IHNldGZsaWdodG51bWJlcjogc3RyaW5nID0gUGFzc2VuZ2VyQXJyYXkuU2VnbWVudFswXS5NYXJrZXRpbmdGbGlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGxldCBzZXRjaXR5OiBzdHJpbmcgPSBQYXNzZW5nZXJBcnJheS5TZWdtZW50WzBdLkRlcGFydHVyZUNpdHk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyBQYXNzZW5nZXJBcnJheS5TZWdtZW50LmZvckVhY2goKFNlZ0VsZSwgU2VnSW5uZGV4KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgbGV0IGRlcGFydHVyZURhdGU6IHN0cmluZyA9IG1vbWVudChTZWdFbGUuRGVwYXJ0dXJlRGF0ZVRpbWUudG9TdHJpbmcoKSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgIGxldCBmbGlnaHRudW1iZXI6IHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgIGlmIChTZWdFbGUuTWFya2V0aW5nRmxpZ2h0LnN1YnN0cigwLCAyKSA9PSBcIkNNXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgICAgICBmbGlnaHRudW1iZXIgPSBTZWdFbGUuTWFya2V0aW5nRmxpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgfSBlbHNlIGlmIChTZWdFbGUuT3BlcmF0aW5nRmxpZ2h0ICE9IG51bGwgJiYgU2VnRWxlLk9wZXJhdGluZ0ZsaWdodC5zdWJzdHIoMCwgMikgPT0gXCJDTVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAgICAgZmxpZ2h0bnVtYmVyID0gU2VnRWxlLk9wZXJhdGluZ0ZsaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAgICAgZmxpZ2h0bnVtYmVyID0gU2VnRWxlLk1hcmtldGluZ0ZsaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgIGxldCBjaXR5OiBzdHJpbmcgPSBTZWdFbGUuRGVwYXJ0dXJlQ2l0eTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgIFNlZ0VsZS5kYXRlID0gbW9tZW50KFNlZ0VsZS5EZXBhcnR1cmVEYXRlVGltZS50b1N0cmluZygpKS5mb3JtYXQoXCJERC1NTU0tWVlZWVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgIHZhciBkZXN0aW5hdGlvbiA9IFNlZ0VsZS5EZXN0aW5hdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgIC8vIC8vSW52ZW50b3J5XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAvLyB0aGlzLl9jaGVja2luLkJvb2tpbmdDb3VudERpc3BsYXkoZGVwYXJ0dXJlRGF0ZSwgZmxpZ2h0bnVtYmVyLCBjaXR5KVxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgLy8gICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgIC8vICAgICAgICAgbGV0IGludmVudG9yeTogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgIC8vICAgICAgICAgU2VnRWxlLmludmVuID0gQ29udmVydGVycy5Db252ZXJ0VG9JbnZlbnRvcnkoaW52ZW50b3J5KTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgIC8vICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAvLyAvL0luYm91bmRcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgIC8vIHRoaXMuX2NoZWNraW4uSW5Cb3VuZChkZXBhcnR1cmVEYXRlLCBmbGlnaHRudW1iZXIsIGNpdHkpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAvLyAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgLy8gICAgICAgICBsZXQgaW5Cb3VuZDogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgIC8vICAgICAgICAgU2VnRWxlLmluYm91bmQgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb0luQm91bmQoaW5Cb3VuZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAvLyAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAvLyAvL091dGJvdW5kXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAvLyB0aGlzLl9jaGVja2luLk91dEJvdW5kKGRlcGFydHVyZURhdGUsIGZsaWdodG51bWJlciwgZGVzdGluYXRpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAvLyAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgLy8gICAgICAgICBsZXQgT3V0Qm91bmQ6IGFueSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAvLyAgICAgICAgIFNlZ0VsZS5vdXRib3VuZCA9IENvbnZlcnRlcnMuQ29udmVydFRvT3V0Qm91bmQoT3V0Qm91bmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgLy8gICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgLy8gLy9zdGF0dXNcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgIC8vIHRoaXMuX2RhdGFTZXJ2aWNlLlN0YXR1cyhkZXBhcnR1cmVEYXRlLCBmbGlnaHRudW1iZXIsIGNpdHkpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgICAgICAgICBsZXQgc3RhdHVzOiBhbnkgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgICAgICAgICBTZWdFbGUuc3RhdHVzID0gc3RhdHVzLkZsaWdodHNbMF0uTGVnc1swXS5TdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAgICAgICAgIFNlZ0VsZS5MZWdzID0gc3RhdHVzLkZsaWdodHNbMF0uTGVncztcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyB0aGlzLl9kYXRhU2VydmljZS5HZXRCYWdnYWdlKGlkKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgIHRoaXMuX3NoYXJlZC5TZXRCYWdnYWdlY2F0YWxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvL1RpZXJcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gdGhpcy5fZGF0YVNlcnZpY2UuVGllcihzZXRkZXBhcnR1cmVEYXRlLCBzZXRmbGlnaHRudW1iZXIsIHNldGNpdHkpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAgICAgbGV0IHRpZXI6IGFueSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFRpZXIodGllcik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFNlZ21lbnREZXRhaWwoUGFzc2VuZ2VyQXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgICAgICAvLyB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY2hlY2tpblwiXSwge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgICAgIC8vICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgICAgICAvLyAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgICAgIC8vICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgICAgIC8vICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgICAgICAvLyAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAgICAgLy8gICAgIHF1ZXJ5UGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAgICAgLy8gICAgICAgICBcImRhdGFcIjogaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAgICAgLy8gICAgICAgICBcImluZGV4XCI6IHRoaXMuaW5kZXhcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIFRvYXN0Lm1ha2VUZXh0KFwiUmVjb3JkIE5vdCBGb3VuZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgIHZhciBlRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgUGFzc2VuZ2VyIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IFBhc3NlbmdlciBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzaW1wbGVUYXAoc2VhdDogU2VhdE1hcC5BaXJTZWF0TGlzdCwgcm93bnVtYmVyOiBzdHJpbmcpIHtcclxuIGNvbnNvbGUubG9nKFNlYXRNYXAuQ2FiaW5MaXN0KTtcclxuICAgICAgICBpZiAodGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5Jc1NlbGVjdGVkID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiUGxlYXNlIHNlbGVjdCBhIHBhc3NlbmdlciB0byBhc3NpZ24gc2VhdFwiKS5zaG93KCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLk5vU2VhdCkge1xyXG4gICAgICAgICAgICAvLyBubyBjb2RlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLkJ1dHRvbkNvbnRpbnVlID0gZmFsc2VcclxuICAgICAgICAgICAgaWYgKCh0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLlBhc3NlbmdlclR5cGUgPT0gXCJBZHVsdFwiICYmIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuQXNzb2NpYXRlZEluZmFudFJQSCAhPSBudWxsKSB8fCB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLlBhc3NlbmdlclR5cGUgIT0gXCJBZHVsdFwiIHx8ICh0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLlNTUi5maWx0ZXIobSA9PiBtID09IFwiV0NIUlwiKS5sZW5ndGggPiAwKSB8fCAodGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5TU1IuZmlsdGVyKG0gPT4gbSA9PSBcIldDSFNcIikubGVuZ3RoID4gMCkgfHwgKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuU1NSLmZpbHRlcihtID0+IG0gPT0gXCJXQ0hDXCIpLmxlbmd0aCA+IDApIHx8IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuU1NSLmZpbHRlcihtID0+IG0gPT0gXCJVTU5SXCIpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHNlYXQuU2VhdENoYXJhY3RlcmlzdGljcy5mb3JFYWNoKChjaGFyYWN0ZXJpc3RpY3MsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJhY3RlcmlzdGljcyA9PSBcIjE3XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjbGVhclwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmZhbnRFeGl0cm93U2VhdCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmluZmFudEV4aXRyb3dTZWF0ICE9IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlYXRbdGhpcy5zZWF0Lmxlbmd0aCAtIDFdLlNlYXROdW1iZXIgPT0gc2VhdC5TZWF0TnVtYmVyICYmIHJvd251bWJlciA9PSB0aGlzLnJvd051bWJlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlYXQuSXNTZWF0U2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhdFt0aGlzLnNlYXQubGVuZ3RoIC0gMV0gPSBuZXcgU2VhdE1hcC5BaXJTZWF0TGlzdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlYXQuSXNQYXhTZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2VhdC5QYXhSUEggPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMucm93TnVtYmVyID0gJyc7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNlYXQuU2VhdEF2YWlsYWJpbGl0eSA9PSAnMScgfHwgc2VhdC5TZWF0QXZhaWxhYmlsaXR5ID09ICcxNScpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VhdC5TZWF0Q2hhcmFjdGVyaXN0aWNzLmZpbHRlcihtID0+IG0gPT0gJzE3JykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWFsb2dzLmNvbmZpcm0oXCJEbyB5b3Ugd2FudCB0byBwcm9jZWVkIHdpdGggRXhpdCBTZWF0XCIpLnRoZW4ocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGlhbG9nIHJlc3VsdDogXCIgKyByZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0U2VhdChzZWF0LCByb3dudW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdFNlYXQoc2VhdCwgcm93bnVtYmVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIlVOQUJMRSBUTyBBU1NJR04gRVhJVCBST1cgU0VBVCBGT1IgVEhJUyBQQVNTRU5HRVJcIikuc2hvdygpXHJcbiAgICAgICAgICAgICAgICB0aGlzLkJ1dHRvbkNvbnRpbnVlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5mYW50RXhpdHJvd1NlYXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RTZWF0KHNlYXQ6IFNlYXRNYXAuQWlyU2VhdExpc3QsIHJvd251bWJlcjogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zZWF0KTtcclxuICAgICAgICBpZiAodGhpcy5zZWF0LmZpbHRlcihtID0+IG0uUGF4UlBIID09IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuUlBIICYmIG0uRmxpZ2h0TGVnRGVwYXJ0dXJlQWlycG9ydENvZGUgPT0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5GbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZSkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnNlYXQuZmlsdGVyKG0gPT4gbS5QYXhSUEggPT0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5SUEggJiYgbS5GbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZSA9PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLkZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlKVswXS5Jc1NlYXRTZWxlY3RlZCA9IGZhbHNlXHJcbiAgICAgICAgICAgIHRoaXMuc2VhdC5maWx0ZXIobSA9PiBtLlBheFJQSCA9PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLlJQSCAmJiBtLkZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlID09IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuRmxpZ2h0TGVnRGVwYXJ0dXJlQWlycG9ydENvZGUpWzBdLklzUGF4U2VsZWN0ZWQgPSBmYWxzZVxyXG4gICAgICAgICAgICB0aGlzLnNlYXQuZmlsdGVyKG0gPT4gbS5QYXhSUEggPT0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5SUEggJiYgbS5GbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZSA9PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLkZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlKVswXS5QYXhSUEggPSBcIlwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNlYXQuSXNQYXhTZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgc2VhdC5Jc1NlYXRTZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgc2VhdC5QYXhSUEggPSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLlJQSDtcclxuICAgICAgICBsZXQgcHJvZHVjdExpc3QgPSB0aGlzLlNob3dTZWF0TWFwTGlzdC5TZWF0UHJvZHVjdEluZm9ybWF0aW9uO1xyXG4gICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuc2VhdFByZWZlcmVuY2UgPSBbXTtcclxuICAgICAgICBwcm9kdWN0TGlzdC5mb3JFYWNoKChwcm9kdWN0LCBwcm9kdWN0SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc2VhdENoYXJhY3RlciA9IHNlYXQuU2VhdENoYXJhY3RlcmlzdGljcy5maWx0ZXIoc2MgPT4gc2MgPT09IHByb2R1Y3QuT1RBQ29kZSlcclxuICAgICAgICAgICAgaWYgKHNlYXRDaGFyYWN0ZXIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5zZWF0UHJlZmVyZW5jZS5wdXNoKHNlYXRDaGFyYWN0ZXJbMF0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBzZWF0LkZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlID0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5GbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZVxyXG4gICAgICAgIHRoaXMuc2VhdC5wdXNoKHNlYXQpO1xyXG4gICAgICAgIHRoaXMucm93TnVtYmVyID0gcm93bnVtYmVyO1xyXG4gICAgICAgIHRoaXMuU2VhdENoYXJhY3RlcmlzdGljID0gc2VhdC5TZWF0Q2hhcmFjdGVyaXN0aWNzO1xyXG4gICAgICAgIHRoaXMuU2VsZWN0ZWRTZWF0ID0gdGhpcy5yb3dOdW1iZXIgKyBzZWF0LlNlYXROdW1iZXI7XHJcbiAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5OZXdTZWF0TnVtYmVyID0gdGhpcy5TZWxlY3RlZFNlYXQ7XHJcbiAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5TZWF0TnVtYmVyID0gdGhpcy5TZWxlY3RlZFNlYXQ7XHJcbiAgICAgICAgLy8gdGhpcy5QYXNzZW5nZXJMaXN0LmZpbHRlcihtPT4gbS5SUEggPT0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5SUEgpWzBdLlNlYXROdW1iZXIgPSB0aGlzLlNlbGVjdGVkU2VhdDtcclxuICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLnNlYXRDb2RlID0gc2VhdC5TZWF0Q29kZTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyTGlzdCk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5TZWxlY3RlZFBhc3NlbmdlcilcclxuICAgICAgICBpZiAodGhpcy5TZWxlY3RlZFBhc3Nlbmdlckxpc3QubGVuZ3RoID4gMCAmJiB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyTGlzdC5maWx0ZXIobSA9PiBtLlJQSCA9PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLlJQSCAmJiBtLkZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlID09IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuRmxpZ2h0TGVnRGVwYXJ0dXJlQWlycG9ydENvZGUpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgLy8gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlckxpc3QuZmlsdGVyKG0gPT4gbS5SUEggPT0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5SUEggJiYgbS5GbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZSA9PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLkZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlKVswXSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIpO1xyXG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyTGlzdC5zcGxpY2UodGhpcy5TZWxlY3RlZFBhc3Nlbmdlckxpc3QuaW5kZXhPZih0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyTGlzdC5maWx0ZXIobSA9PiBtLlJQSCA9PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLlJQSCAmJiBtLkZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlID09IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuRmxpZ2h0TGVnRGVwYXJ0dXJlQWlycG9ydENvZGUpWzBdKSwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXJMaXN0LnB1c2godGhpcy5TZWxlY3RlZFBhc3Nlbmdlcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlckxpc3QucHVzaChPYmplY3QuYXNzaWduKHt9LCB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyTGlzdCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0KHBhc3Nlbmdlckxpc3Q6IE11bHRpU2VnbWVudFRlbXBsYXRlLlBhc3NlbmdlciwgaXNOb1NlYXQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIGlmIChwYXNzZW5nZXJMaXN0LklORndpdGhvdXRTZWF0ID09IHRydWUpIHtcclxuICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJTZWF0IGNhbm5vdCBiZSBhc3NpZ25lZCB0byB0aGlzIHBhcnRpY3VsYXIgcGFzc2VuZ2VyIHR5cGVcIikuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFpc05vU2VhdCkge1xyXG4gICAgICAgICAgICAgICAgcGFzc2VuZ2VyTGlzdC5Jc1NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXNzZW5nZXJMaXN0LkFzc29jaWF0ZWRJbmZhbnRSUEggIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmZQYXggPSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUGFzc2VuZ2VyLmZpbHRlcihtID0+IG0uQXNzb2NpYXRlZEFkdWx0UlBIID09PSBwYXNzZW5nZXJMaXN0LlJQSCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZlBheC5sZW5ndGggPiAwKSBpbmZQYXhbMF0uSXNTZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlBhc3Nlbmdlci5mb3JFYWNoKChQYXhkYXRhLCBQYXhJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBpZiAoUGF4ZGF0YS5Bc3NvY2lhdGVkQWR1bHRSUEggPT0gcGFzc2VuZ2VyTGlzdC5SUEggJiYgcGFzc2VuZ2VyTGlzdC5Jc1NlbGVjdGVkID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIFBheGRhdGEuSXNTZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBQYXhkYXRhLklzU2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocGFzc2VuZ2VyTGlzdC5SUEggPT0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5SUEgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm51bSsrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiMVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5udW0gJSAyID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VuZ2VyTGlzdC5Jc1NlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXNzZW5nZXJMaXN0LkFzc29jaWF0ZWRJbmZhbnRSUEggIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZlBheCA9IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5QYXNzZW5nZXIuZmlsdGVyKG0gPT4gbS5Bc3NvY2lhdGVkQWR1bHRSUEggPT09IHBhc3Nlbmdlckxpc3QuUlBIKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmZQYXgubGVuZ3RoID4gMCkgaW5mUGF4WzBdLklzU2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5QYXNzZW5nZXIuZm9yRWFjaCgoUGF4ZGF0YSwgUGF4SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBpZiAoUGF4ZGF0YS5Bc3NvY2lhdGVkQWR1bHRSUEggPT0gcGFzc2VuZ2VyTGlzdC5SUEggJiYgUGF4ZGF0YS5Jc1NlbGVjdGVkID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgUGF4ZGF0YS5Jc1NlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VuZ2VyTGlzdC5Jc1NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocGFzc2VuZ2VyTGlzdC5SUEggIT0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5SUEggJiYgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5Jc1NlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5Jc1NlbGVjdGVkID0gIXRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuSXNTZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5Bc3NvY2lhdGVkSW5mYW50UlBIICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZlBheCA9IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5QYXNzZW5nZXIuZmlsdGVyKG0gPT4gbS5Bc3NvY2lhdGVkQWR1bHRSUEggPT09IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuUlBIKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZlBheC5sZW5ndGggPiAwKSBpbmZQYXhbMF0uSXNTZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUGFzc2VuZ2VyLmZvckVhY2goKFBheGRhdGEsIFBheEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBpZiAoUGF4ZGF0YS5Bc3NvY2lhdGVkQWR1bHRSUEggPT0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5SUEggJiYgUGF4ZGF0YS5Jc1NlbGVjdGVkID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBQYXhkYXRhLklzU2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBpZiAocGFzc2VuZ2VyTGlzdC5Jc1NlbGVjdGVkID09IGZhbHNlICYmIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuSXNTZWxlY3RlZCA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHRoaXMubnVtID0gMDtcclxuICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLm51bSsrO1xyXG4gICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3NlbmdlciA9IHBhc3Nlbmdlckxpc3Q7XHJcbiAgICAgICAgICAgICAgICBpZiAoKCh0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uTWFya2V0aW5nRmxpZ2h0ICE9IG51bGwgJiYgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLk1hcmtldGluZ0ZsaWdodC5zdWJzdHIoMCwgMikgPT0gXCJDTVwiKXx8KHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5PcGVyYXRpbmdGbGlnaHQgIT0gbnVsbCAmJiB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uT3BlcmF0aW5nRmxpZ2h0LnN1YnN0cigwLCAyKSA9PSBcIkNNXCIpKSAmJiB0aGlzLmxlZ3NJbmZvIT1udWxsJiZ0aGlzLmxlZ3NJbmZvLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sZWdzSW5mby5maWx0ZXIobSA9PiBtLmlzTGVnU2VsZWN0ZWQgPT0gdHJ1ZSkubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5GbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZSA9IHRoaXMubGVnc0luZm8uZmlsdGVyKG0gPT4gbS5pc0xlZ1NlbGVjdGVkID09IHRydWUpWzBdLkRlcGFydHVyZUFpcnBvcnQuTG9jYXRpb25Db2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuRmxpZ2h0TGVnRGVwYXJ0dXJlQWlycG9ydENvZGUgPSB0aGlzLmxlZ3NJbmZvWzBdLkRlcGFydHVyZUFpcnBvcnQuTG9jYXRpb25Db2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5GbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZSA9IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5PcmlnaW47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5Ob1NlYXQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLk5ld1NlYXROdW1iZXIgPSBcIlwiXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlckxpc3QucHVzaChPYmplY3QuYXNzaWduKHt9LCB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyKSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXJMaXN0LmZpbHRlcihtID0+IG0uUlBIID09IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuUlBIICYmIG0uRmxpZ2h0TGVnRGVwYXJ0dXJlQWlycG9ydENvZGUgPT0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5GbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZSkubGVuZ3RoID4gMCAmJiB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyTGlzdC5maWx0ZXIobSA9PiBtLlJQSCA9PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLlJQSCAmJiBtLkZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlID09IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuRmxpZ2h0TGVnRGVwYXJ0dXJlQWlycG9ydENvZGUpWzBdLk5ld1NlYXROdW1iZXIgPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXJMaXN0LmZpbHRlcihtID0+IG0uUlBIID09IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuUlBIICYmIG0uRmxpZ2h0TGVnRGVwYXJ0dXJlQWlycG9ydENvZGUgPT0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5GbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZSAmJiBtLk5ld1NlYXROdW1iZXIgPT0gXCJcIilbMF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlckxpc3QuaW5kZXhPZihpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlckxpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5TaG93U2VhdE1hcExpc3QuQ2FiaW5MaXN0LmZvckVhY2goKGNhYmluLCBjYWJpbkluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FiaW4uQWlyUm93TGlzdC5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3cuQWlyU2VhdExpc3QuZmlsdGVyKG0gPT4gbS5QYXhSUEggPT0gcGFzc2VuZ2VyTGlzdC5SUEggJiYgbS5GbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZSA9PSBwYXNzZW5nZXJMaXN0LkZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cuQWlyU2VhdExpc3QuZmlsdGVyKG0gPT4gbS5QYXhSUEggPT0gcGFzc2VuZ2VyTGlzdC5SUEggJiYgbS5GbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZSA9PSBwYXNzZW5nZXJMaXN0LkZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlKVswXS5Jc1NlYXRTZWxlY3RlZCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cuQWlyU2VhdExpc3QuZmlsdGVyKG0gPT4gbS5QYXhSUEggPT0gcGFzc2VuZ2VyTGlzdC5SUEggJiYgbS5GbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZSA9PSBwYXNzZW5nZXJMaXN0LkZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlKVswXS5Jc1BheFNlbGVjdGVkID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5BaXJTZWF0TGlzdC5maWx0ZXIobSA9PiBtLlBheFJQSCA9PSBwYXNzZW5nZXJMaXN0LlJQSCAmJiBtLkZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlID09IHBhc3Nlbmdlckxpc3QuRmxpZ2h0TGVnRGVwYXJ0dXJlQWlycG9ydENvZGUpWzBdLlBheFJQSCA9IFwiXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmICgoKHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5NYXJrZXRpbmdGbGlnaHQgIT0gbnVsbCAmJiB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uTWFya2V0aW5nRmxpZ2h0LnN1YnN0cigwLCAyKSA9PSBcIkNNXCIpfHwodGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLk9wZXJhdGluZ0ZsaWdodCAhPSBudWxsICYmIHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5PcGVyYXRpbmdGbGlnaHQuc3Vic3RyKDAsIDIpID09IFwiQ01cIikpICYmIHRoaXMubGVnc0luZm8hPW51bGwmJiB0aGlzLmxlZ3NJbmZvLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sZWdzSW5mby5maWx0ZXIobSA9PiBtLmlzTGVnU2VsZWN0ZWQgPT0gdHJ1ZSkubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VuZ2VyTGlzdC5GbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZSA9IHRoaXMubGVnc0luZm8uZmlsdGVyKG0gPT4gbS5pc0xlZ1NlbGVjdGVkID09IHRydWUpWzBdLkRlcGFydHVyZUFpcnBvcnQuTG9jYXRpb25Db2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhc3Nlbmdlckxpc3QuRmxpZ2h0TGVnRGVwYXJ0dXJlQWlycG9ydENvZGUgPSB0aGlzLmxlZ3NJbmZvWzBdLkRlcGFydHVyZUFpcnBvcnQuTG9jYXRpb25Db2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChwYXNzZW5nZXJMaXN0Lk5vU2VhdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhc3Nlbmdlckxpc3QuTmV3U2VhdE51bWJlciA9IFwiXCJcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyTGlzdC5wdXNoKE9iamVjdC5hc3NpZ24oe30sIHBhc3Nlbmdlckxpc3QpKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5TZWxlY3RlZFBhc3Nlbmdlckxpc3QuZmlsdGVyKG0gPT4gbS5SUEggPT0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5SUEggJiYgbS5GbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZSA9PSBwYXNzZW5nZXJMaXN0LkZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlKS5sZW5ndGggPiAwICYmIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXJMaXN0LmZpbHRlcihtID0+IG0uUlBIID09IHBhc3Nlbmdlckxpc3QuUlBIICYmIG0uRmxpZ2h0TGVnRGVwYXJ0dXJlQWlycG9ydENvZGUgPT0gcGFzc2VuZ2VyTGlzdC5GbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZSlbMF0uTmV3U2VhdE51bWJlciA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlckxpc3QuZmlsdGVyKG0gPT4gbS5SUEggPT0gcGFzc2VuZ2VyTGlzdC5SUEggJiYgbS5GbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZSA9PSBwYXNzZW5nZXJMaXN0LkZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlICYmIG0uTmV3U2VhdE51bWJlciA9PSBcIlwiKVswXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyTGlzdC5pbmRleE9mKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXJMaXN0KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGVjazEoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuSXNDaGVja2VkMSkge1xyXG4gICAgICAgICAgICB0aGlzLklzQ2hlY2tlZDEgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuSXNDaGVja2VkMSA9IHRydWU7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNoZWNrMigpIHtcclxuICAgICAgICBpZiAodGhpcy5Jc0NoZWNrZWQyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuSXNDaGVja2VkMiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGVidWxraGVhZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5Jc0NoZWNrZWQyID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVidWxraGVhZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNoZWNrMygpIHtcclxuICAgICAgICBpZiAodGhpcy5Jc0NoZWNrZWQzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuSXNDaGVja2VkMyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGVJTmZOb3RBbGxvd2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLklzQ2hlY2tlZDMgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZUlOZk5vdEFsbG93ZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjaGVjazQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuSXNDaGVja2VkNCkge1xyXG4gICAgICAgICAgICB0aGlzLklzQ2hlY2tlZDQgPSBmYWxzZTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJmYWxzZSBQYXJ0XCIpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGVFeGl0Um93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLklzQ2hlY2tlZDQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZUV4aXRSb3coKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0U2VnKHNlbGVjdGluZGV4OiBhbnksIGluZGV4OiBhbnkpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkluZGV4OlwiICsgaW5kZXgpO1xyXG4gICAgICAgIHRoaXMuUGFzc2VuZ2VyTGlzdC5mb3JFYWNoKChwYXNzZW5nZXJsaXN0LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBwYXNzZW5nZXJsaXN0LklzU2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIGlmIChzZWxlY3RpbmRleFtpbmRleF0gPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzU2VnU2VsZWN0ZWRbaW5kZXhdID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubGVnc0luZm9baW5kZXhdLmlzTGVnU2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmlzU2VnU2VsZWN0ZWRbaW5kZXhdID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5sZWdzSW5mb1tpbmRleF0uaXNMZWdTZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXNhbGwgPSB0aGlzLmFsbFRoZVNhbWUodGhpcy5pc1NlZ1NlbGVjdGVkKTtcclxuICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyID0gbmV3IE11bHRpU2VnbWVudFRlbXBsYXRlLlBhc3NlbmdlcigpO1xyXG4gICAgICAgIHRoaXMuc2hvd1NlYXRNYXAodGhpcy5pc2FsbCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJPYmo6XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLmlzYWxsKSk7XHJcbiAgICB9XHJcbiAgICBzaG93U2VhdE1hcChpc2FsbCkge1xyXG4gICAgICAgIGlmIChpc2FsbCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxlZ3NJbmZvWzBdLmlzTGVnU2VsZWN0ZWQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5TaG93U2VhdE1hcExpc3QgPSB0aGlzLlNlYXRNYXBMaXN0Lkl0ZW1zLmZpbHRlcihtID0+IG0uRmxpZ2h0U2VnbWVudC5PcmlnaW4uTG9jYXRpb25Db2RlID09IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5PcmlnaW4gJiYgbS5GbGlnaHRTZWdtZW50LkRlc3RpbmF0aW9uLkxvY2F0aW9uQ29kZSA9PSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uRGVzdGluYXRpb24pWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5QYXNzZW5nZXJMaXN0LmZvckVhY2goKHBheGRhdGEsIEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF4ZGF0YS5TZWF0TnVtYmVyID0gcGF4ZGF0YS5TZWF0c1swXS5TZWF0TnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuU2hvd1NlYXRNYXBMaXN0ID0gbmV3IFNlYXRNYXAuSXRlbSgpO1xyXG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJObyBTZWF0bWFwIHNlbGVjdGVkXCIpLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIE9yaWdpbiA9IHRoaXMubGVnc0luZm8uZmlsdGVyKG0gPT4gbS5pc0xlZ1NlbGVjdGVkID09IHRydWUpWzBdLkRlcGFydHVyZUFpcnBvcnQuTG9jYXRpb25Db2RlO1xyXG4gICAgICAgICAgICB2YXIgRGVzdCA9IHRoaXMubGVnc0luZm8uZmlsdGVyKG0gPT4gbS5pc0xlZ1NlbGVjdGVkID09IHRydWUpWzBdLkFycml2YWxBaXJwb3J0LkxvY2F0aW9uQ29kZTtcclxuICAgICAgICAgICAgdGhpcy5TaG93U2VhdE1hcExpc3QgPSB0aGlzLlNlYXRNYXBMaXN0Lkl0ZW1zLmZpbHRlcihtID0+IG0uRmxpZ2h0U2VnbWVudC5PcmlnaW4uTG9jYXRpb25Db2RlID09IE9yaWdpbiAmJiBtLkZsaWdodFNlZ21lbnQuRGVzdGluYXRpb24uTG9jYXRpb25Db2RlID09IERlc3QpWzBdO1xyXG4gICAgICAgICAgICB0aGlzLlBhc3Nlbmdlckxpc3QuZm9yRWFjaCgocGF4ZGF0YSwgSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIHBheGRhdGEuU2VhdHMuZm9yRWFjaCgoc2VhdHMsIHNlYXRJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWF0cy5BcnJpdmFsQ29kZSA9PSBEZXN0ICYmIHNlYXRzLkRlcGFydHVyZUNvZGUgPT0gT3JpZ2luKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheGRhdGEuU2VhdE51bWJlciA9IHNlYXRzLlNlYXROdW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWxsVGhlU2FtZShhcnJheSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciBmaXJzdCA9IGFycmF5WzBdO1xyXG4gICAgICAgIHJldHVybiBhcnJheS5ldmVyeShmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudCA9PT0gZmlyc3Q7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbmFibGVFeGl0Um93KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlXCIpO1xyXG4gICAgICAgIHRoaXMuU2hvd1NlYXRNYXBMaXN0LkNhYmluTGlzdC5mb3JFYWNoKChjYWJFbGUsIGNhYmluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNhYkVsZS5BaXJSb3dMaXN0LmZvckVhY2goKFJvd0VsZSwgUm93SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIFJvd0VsZS5BaXJTZWF0TGlzdC5mb3JFYWNoKChzZWF0RWxlLCBzZWF0SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZWF0RWxlLlNlYXRDaGFyYWN0ZXJpc3RpY3MuZm9yRWFjaCgoY2hhckVsZSwgY2hhckluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGFyRWxlID09ICcxNycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWF0RWxlLlN0eWxlQ2xhc3MgIT0gJ25vU2VhdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWF0RWxlLklzU2VsZWN0ZWRBZHZhbmNlRGlzcGxheSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc0V4aXRSb3dTZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VhdEVsZS5BZHZhbmNlRGlzcGxheVN0eWxlQ2xhc3MgPSAnZXhpdHJvdyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGRpc2FibGVFeGl0Um93KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiT3V0U2lkZVwiKVxyXG4gICAgICAgIHRoaXMuU2hvd1NlYXRNYXBMaXN0LkNhYmluTGlzdC5mb3JFYWNoKChjYWJFbGUsIGNhYmluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNhYkVsZS5BaXJSb3dMaXN0LmZvckVhY2goKFJvd0VsZSwgUm93SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIFJvd0VsZS5BaXJTZWF0TGlzdC5mb3JFYWNoKChzZWF0RWxlLCBzZWF0SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZWF0RWxlLlNlYXRDaGFyYWN0ZXJpc3RpY3MuZm9yRWFjaCgoY2hhckVsZSwgY2hhckluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGFyRWxlID09ICcxNycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXhpdCByb3dcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VhdEVsZS5TdHlsZUNsYXNzICE9ICdub1NlYXQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc0V4aXRSb3dTZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXRFbGUuSXNTZWxlY3RlZEFkdmFuY2VEaXNwbGF5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuSXNJbmZhbnROb3RBbGxvd2VkU2VsZWN0ZWQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWF0RWxlLklzU2VsZWN0ZWRBZHZhbmNlRGlzcGxheSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXRFbGUuQWR2YW5jZURpc3BsYXlTdHlsZUNsYXNzID0gJ2luZmFudG5vdGFsbG93ZWQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICAgIGVuYWJsZUlOZk5vdEFsbG93ZWQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJpbnNpZGVcIik7XHJcbiAgICAgICAgdGhpcy5TaG93U2VhdE1hcExpc3QuQ2FiaW5MaXN0LmZvckVhY2goKGNhYkVsZSwgY2FiaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY2FiRWxlLkFpclJvd0xpc3QuZm9yRWFjaCgoUm93RWxlLCBSb3dJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgUm93RWxlLkFpclNlYXRMaXN0LmZvckVhY2goKHNlYXRFbGUsIHNlYXRJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlYXRFbGUuU2VhdENoYXJhY3RlcmlzdGljcy5mb3JFYWNoKChjaGFyRWxlLCBjaGFySW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJFbGUgPT0gJzUxJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbmZhbnQgbm90IGFsbG93ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VhdEVsZS5TdHlsZUNsYXNzICE9ICdub1NlYXQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VhdEVsZS5Jc1NlbGVjdGVkQWR2YW5jZURpc3BsYXkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSXNJbmZhbnROb3RBbGxvd2VkU2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXRFbGUuQWR2YW5jZURpc3BsYXlTdHlsZUNsYXNzID0gJ2luZmFudG5vdGFsbG93ZWQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLklzRXhpdFJvd1NlbGVjdGVkID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VhdEVsZS5BZHZhbmNlRGlzcGxheVN0eWxlQ2xhc3MgPSAnZXhpdHJvdyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGRpc2FibGVJTmZOb3RBbGxvd2VkKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiT3V0U2lkZVwiKVxyXG4gICAgICAgIHRoaXMuU2hvd1NlYXRNYXBMaXN0LkNhYmluTGlzdC5mb3JFYWNoKChjYWJFbGUsIGNhYmluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNhYkVsZS5BaXJSb3dMaXN0LmZvckVhY2goKFJvd0VsZSwgUm93SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIFJvd0VsZS5BaXJTZWF0TGlzdC5mb3JFYWNoKChzZWF0RWxlLCBzZWF0SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZWF0RWxlLlNlYXRDaGFyYWN0ZXJpc3RpY3MuZm9yRWFjaCgoY2hhckVsZSwgY2hhckluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGFyRWxlID09ICc1MScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZXhpdCByb3dcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VhdEVsZS5TdHlsZUNsYXNzICE9ICdub1NlYXQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc0luZmFudE5vdEFsbG93ZWRTZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXRFbGUuSXNTZWxlY3RlZEFkdmFuY2VEaXNwbGF5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuSXNFeGl0Um93U2VsZWN0ZWQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWF0RWxlLklzU2VsZWN0ZWRBZHZhbmNlRGlzcGxheSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXRFbGUuQWR2YW5jZURpc3BsYXlTdHlsZUNsYXNzID0gJ2V4aXRyb3cnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICAgIGVuYWJsZWJ1bGtoZWFkKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlXCIpO1xyXG4gICAgICAgIHRoaXMuU2hvd1NlYXRNYXBMaXN0LkNhYmluTGlzdC5mb3JFYWNoKChjYWJFbGUsIGNhYmluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNhYkVsZS5BaXJSb3dMaXN0LmZvckVhY2goKFJvd0VsZSwgUm93SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIFJvd0VsZS5BaXJTZWF0TGlzdC5mb3JFYWNoKChzZWF0RWxlLCBzZWF0SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZWF0RWxlLlNlYXRDaGFyYWN0ZXJpc3RpY3MuZm9yRWFjaCgoY2hhckVsZSwgY2hhckluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGFyRWxlID09ICcxMCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnVsa2hlYWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VhdEVsZS5TdHlsZUNsYXNzICE9ICdub1NlYXQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VhdEVsZS5Jc1NlbGVjdGVkQWR2YW5jZURpc3BsYXkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXRFbGUuQWR2YW5jZURpc3BsYXlTdHlsZUNsYXNzID0gJ2J1bGtoZWFkJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBkaXNhYmxlYnVsa2hlYWQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJPdXRTaWRlXCIpXHJcbiAgICAgICAgdGhpcy5TaG93U2VhdE1hcExpc3QuQ2FiaW5MaXN0LmZvckVhY2goKGNhYkVsZSwgY2FiaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY2FiRWxlLkFpclJvd0xpc3QuZm9yRWFjaCgoUm93RWxlLCBSb3dJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgUm93RWxlLkFpclNlYXRMaXN0LmZvckVhY2goKHNlYXRFbGUsIHNlYXRJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlYXRFbGUuU2VhdENoYXJhY3RlcmlzdGljcy5mb3JFYWNoKChjaGFyRWxlLCBjaGFySW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJFbGUgPT0gJzEwJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJleGl0IHJvd1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWF0RWxlLlN0eWxlQ2xhc3MgIT0gJ25vU2VhdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWF0RWxlLklzU2VsZWN0ZWRBZHZhbmNlRGlzcGxheSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gICAgZ290b25vdGlmeSgpIHtcclxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wibm90aWZ5XCJdLCB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaGlkZVNob3dMZWRnZXJkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNob3dTZWF0TWFwS2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1NlYXRNYXBLZXkgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dTZWF0TWFwS2V5ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBoaWRlU2hvd0FkYXZhbmNlRGlzcGxheSgpIHtcclxuICAgICAgICBpZiAodGhpcy5zaG93QWR2YW5jZURpc3BsYXkpIHtcclxuICAgICAgICAgICAgdGhpcy5zaG93QWR2YW5jZURpc3BsYXkgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dBZHZhbmNlRGlzcGxheSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVUb0NoZWNrSW4oKSB7XHJcbiAgICAgICAgbGV0IG9yZGVySWQ6IHN0cmluZyA9IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5QYXNzZW5nZXJbMF0uT3JkZXJJRDtcclxuICAgICAgICBpZiAodGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLk1hcmtldGluZ0ZsaWdodC5zdWJzdHIoMCwgMikgPT0gXCJDTVwiICYmIHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5NYXJrZXRpbmdGbGlnaHQubGVuZ3RoIDw9IDUpIHtcclxuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvQ2hlY2tJblBhZ2Uob3JkZXJJZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvQ2hlY2tJblBhZ2Uob3JkZXJJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgR2V0T3JkZXJEZXRhaWxzZm9yUmVmZXJlc2goaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICAgICAgXCJHZXQgUGFzc2VuZ2VyIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6IFwiICsgc0RhdGVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VydmljZS5HZXRQYXNzZW5nZXIoaWQpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlN1Y2Nlc3MgIT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFBhc3Nlbmdlcig8T3JkZXIuUm9vdE9iamVjdD5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGVUb0NoZWNrSW5QYWdlKGlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIHZhciBlRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICAgICAgXCJHZXQgUGFzc2VuZ2VyIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiBcIiArIGVEYXRlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICAgICAgXCJHZXQgUGFzc2VuZ2VyIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiBcIiArXHJcbiAgICAgICAgICAgICAgICBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlRGF0ZSkpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVUb0NoZWNrSW5QYWdlKG9yZGVySWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJjaGVja2luXCJdLCB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIFwiZGF0YVwiOiBvcmRlcklkLFxyXG4gICAgICAgICAgICAgICAgXCJpbmRleFwiOiB0aGlzLmluZGV4XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBuYXZpZ2F0ZXRvQ2hlY2hraW5mb3JPdGhlckZsaWdodCgpIHtcclxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY2hlY2tpblwiXSwge1xyXG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBcIlBhc3NlbmdlckFycmF5XCI6IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFswXS5QYXNzZW5nZXJbMF0uT3JkZXJJRCxcclxuICAgICAgICAgICAgICAgIFwiaW5kZXhcIjogdGhpcy5pbmRleFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBuYXZpZ2F0ZVRvU2VhcmNoKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzQ2hlY2tpbkRpc2FibGVkID09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcInNlYXJjaFwiXSwge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVUb0RlcGFydHVyZXMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNHYXRlRGlzYWJsZWQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiZGVwYXJ0aG9tZVwiXSwge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgaXNJdGVtVmlzaWJsZShhcmdzKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgaWYgKGFyZ3MudG9TdHJpbmcoKS5zdWJzdHIoMCwgMikgPT0gJ0NNJyAmJiBhcmdzLnRvU3RyaW5nKCkubGVuZ3RoIDw9IDUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwidmlzaWJsZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHJldHVybiBcImNvbGxhcHNlZFwiO1xyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVUb1NldHRpbmcoKSB7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcInNldHRpbmdcIl0sIHtcclxuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbmF2aWdhdGVUb2xvZ2luKCkge1xyXG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJcIl0sIHtcclxuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlU2VydmljZUVycm9yKGVycm9yOiBhbnkpIHtcclxuICAgICAgICB2YXIgZXJyb3JNZXNzYWdlID0gZXJyb3IudG9TdHJpbmcoKTtcclxuICAgICAgICBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJTZXNzaW9uVGltZW91dFwiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiU2Vzc2lvbiBUaW1lIE91dFwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGJlZW4gdGltZSBvdXRcIixcclxuICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPS1wiXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiXCJdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZXJyb3JNZXNzYWdlKS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbmF2aWdhdGVUb0NvbXBlbnNhdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0NvbXBlbnNhdGlvbkVuYWJsZWQgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY29tcGVuc2F0aW9uXCJdLCB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkNvbXBlbnNhdGlvbiBOb3QgYXBwbGljYWJsZVwiKS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==