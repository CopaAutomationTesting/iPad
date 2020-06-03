"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var imageModule = require("image-source");
var common_1 = require("@angular/common");
var router_2 = require("nativescript-angular/router");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var page_1 = require("ui/page");
var dialogs = require("ui/dialogs");
var style_properties_1 = require("ui/styling/style-properties");
var fs = require("file-system");
var zebra = require("nativescript-print-zebra");
//external modules and plugins
var ApplicationSettings = require("application-settings");
var Toast = require("nativescript-toast");
var moment = require("moment");
// import { scanCardClicked } from "nativescript-cardio";
//app references
var index_1 = require("../../shared/model/index");
var index_2 = require("../../shared/services/index");
var index_3 = require("../../shared/interface/index");
var index_4 = require("../../shared/utils/index");
var checkin_component_1 = require("../../components/checkin/checkin.component");
var app_constants_1 = require("../../app.constants");
var app_executiontime_1 = require("../../app.executiontime");
var passwordTextField;
var BaggageinfoComponent = /** @class */ (function () {
    function BaggageinfoComponent(_printemail, _checkin, _configuration, page, _timeoutService, routerExtensions, _dataService, router, location, activatedRouter, _modalService, vcRef, _shared, _service, _paymentService) {
        this._printemail = _printemail;
        this._checkin = _checkin;
        this._configuration = _configuration;
        this.page = page;
        this._timeoutService = _timeoutService;
        this.routerExtensions = routerExtensions;
        this._dataService = _dataService;
        this.router = router;
        this.location = location;
        this.activatedRouter = activatedRouter;
        this._modalService = _modalService;
        this.vcRef = vcRef;
        this._shared = _shared;
        this._service = _service;
        this._paymentService = _paymentService;
        this.count = 0;
        this.cash = false;
        this.dCard = false;
        this.cCard = false;
        this.PassengerArray = [];
        this.standardproducts = [];
        this.catalogproducts = [];
        this.standardproductsList = [];
        this.catalogproductsList = [];
        this.refresh = false;
        this.isContinuebtnEnabled = false;
        this.Bagtagmessage = " ";
        this.AddBaggegeDetailsarray = [];
        this.BaggageDetailarray = [];
        this.bagsToPrices = null;
        this.totalAmount = 0;
        this.AmountArray = [];
        this.Paid = false;
        this.weight = [false];
        this.Tag = [false];
        this.totalweight = 0;
        this.isbagExist = false;
        this.isRemoveBtnEnabled = true;
        this.Oversize = false;
        this.OversizeCount = 0;
        this.maxBagCount = 999;
        this.bagCount = 0;
        this.enableRemoveBag = true;
        this.isCartButtonEnabled = false;
        this.ShortCheckAirportCode = "";
        this.isRemoveBag = false;
        this.enableAddBag = true;
        this.isCompensationEnabled = false;
        this.filterargs = {
            "Origin.AirportCode": 'PTY'
        };
        this.FlightInfo = new index_3.MultiSegmentTemplate.FlightWithPax;
        this.MultiSegmentPaxArray = new index_3.MultiSegmentTemplate.RootObject;
        this.isEnabled = false;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.navigateButtonEnabled = true;
        this.onContinue = function () {
            var self = this;
            var orderId = self.PassedPassengerDetail.OrderID;
            var self = this;
            if (this.PassedPassengerDetail)
                console.dir(this._shared.GetPassenger().SegmentTravelerInfos);
            if (!this.PassedPassengerDetail.CheckinStatus) {
                this.loaderProgress.hideLoader();
                self.routerExtensions.navigate(["checkin"], {
                    animated: true,
                    transition: {
                        name: "slide",
                        duration: 600,
                        curve: "linear"
                    },
                    queryParams: {
                        "data": orderId,
                        "index": this.index,
                        "shortcheckin": this.PassedPassengerDetail.ShortCheckAirportCode
                    }
                });
            }
            else {
                this.GetOrderDetails(orderId);
            }
        };
        this.onSubmit = function () {
            var _this = this;
            try {
                this.navigateButtonEnabled = false;
                var startDate = new Date();
                console.log('Getbag Service --------------- Start Date Time : ' + startDate);
                var valid = true;
                valid = this.Validate();
                this.refresh = false;
                var deleteConfirmed = false;
                var reg = new RegExp(/^[0-9]+$/);
                console.log(this.AddBaggegeDetailsarray);
                if (this.AddBaggegeDetailsarray.length > 0 && valid) {
                    this.BaggageDetailarray = [];
                    console.log();
                    this.AddBaggegeDetailsarray.forEach(function (Detail, index) {
                        if (reg.test(Detail.weight)) {
                            // if (deleteConfirmed == true) {
                            _this.weight[index] = false;
                            if (_this.AddBaggegeDetailsarray.filter(function (m) { return m.status == "Pending Delete"; }).length > 0) {
                                console.log("delete bag 1");
                                _this.refresh = true;
                                if (_this.AddBaggegeDetailsarray.filter(function (m) { return m.status == ""; }).length > 0) {
                                    _this.refresh = false;
                                }
                                dialogs.confirm("Refund Baggage Fees, if any").then(function (result) {
                                    console.log("Dialog result: " + result);
                                    if (result) {
                                        deleteConfirmed = true;
                                        if (_this.AddBaggegeDetailsarray.filter(function (m) { return m.status == "Pending Delete"; }).length > 0) {
                                            console.log("delete bag 0");
                                            _this.BagtagElement = index_4.Converters.DeleteBagTag(_this.PassedPassengerDetail, _this.FlightInfo, _this.AddBaggegeDetailsarray);
                                            _this.BagTag();
                                        }
                                    }
                                });
                                // if (deleteConfirmed == true) {
                                // this.BagtagElement = Converters.DeleteBagTag(this.PassedPassengerDetail, this.FlightInfo, this.AddBaggegeDetailsarray);
                                // this.BagTag();
                                // }
                            }
                            if (_this.AddBaggegeDetailsarray.filter(function (m) { return m.status == ""; }).length > 0) {
                                _this.refresh = true;
                                // this.AddBaggegeDetailsarray.forEach((Detail, Index) => {
                                if (!Detail.AlreadyExisting) {
                                    var baggageDetail = null;
                                    baggageDetail = new index_3.baggageTemplate.BaggageDetail();
                                    baggageDetail.BaggageRPH = (index + 1).toString();
                                    var FlifoStatus = _this._shared.GetPassenger().Segments.filter(function (m) { return m.RPH == _this.FlightInfo.SegmentRPH; })[0].Status.StatusCode;
                                    if (FlifoStatus == "SC") {
                                        baggageDetail.FlightSegmentRPH = _this._shared.GetPassenger().Segments.filter(function (m) { return m.Status.StatusCode == "WK"; })[0].RPH;
                                        baggageDetail.LastFlightSegmentRPH = _this._shared.GetPassenger().Segments.filter(function (m) { return m.Status.StatusCode == "WK"; })[0].RPH;
                                    }
                                    else {
                                        baggageDetail.FlightSegmentRPH = _this.FlightInfo.SegmentRPH;
                                        baggageDetail.LastFlightSegmentRPH = _this.FlightInfo.SegmentRPH;
                                    }
                                    baggageDetail.PassengerRPH = _this.PassedPassengerDetail.RPH;
                                    baggageDetail.CheckedInIndicator = "N";
                                    baggageDetail.Weight = Detail.weight;
                                    if (Detail.Code != "") {
                                        baggageDetail.RFISC_SubCode = Detail.Code;
                                    }
                                    else {
                                        // Detail.Code = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].Code;
                                        // this.standardproducts.filter(m => m.weight==Detail.weight||m.weight>Detail.weight)[0].Code;
                                        // baggageDetail.RFISC_SubCode = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].Code;
                                        Detail.Code = _this.standardproducts.filter(function (m) { return m.weight == Detail.weight || m.weight > Detail.weight; })[0].RFIC;
                                        baggageDetail.RFISC_Code = _this.standardproducts.filter(function (m) { return m.weight == Detail.weight || m.weight > Detail.weight; })[0].RFIC;
                                        baggageDetail.RFISC_SubCode = _this.standardproducts.filter(function (m) { return m.weight == Detail.weight || m.weight > Detail.weight; })[0].Code;
                                        console.log(baggageDetail.RFISC_SubCode);
                                    }
                                    if (Detail.selectedproduct == "Standard") {
                                        baggageDetail.CommercialName = _this.standardproducts.filter(function (m) { return m.weight == Detail.weight || m.weight > Detail.weight; })[0].CommercialName;
                                        baggageDetail.LongDescription = _this.standardproducts.filter(function (m) { return m.weight == Detail.weight || m.weight > Detail.weight; })[0].LongDescription;
                                        baggageDetail.WeightUnit = _this.standardproducts.filter(function (m) { return m.weight == Detail.weight || m.weight > Detail.weight; })[0].WeightUnit;
                                        baggageDetail.ShortDescription = _this.standardproducts.filter(function (m) { return m.weight == Detail.weight || m.weight > Detail.weight; })[0].ShortDescription;
                                        baggageDetail.ServiceCode = _this.standardproducts.filter(function (m) { return m.weight == Detail.weight || m.weight > Detail.weight; })[0].ServiceCode;
                                        baggageDetail.SSRCode = _this.standardproducts.filter(function (m) { return m.weight == Detail.weight || m.weight > Detail.weight; })[0].SSRCode;
                                        baggageDetail.EMD_TypeCode = _this.standardproducts.filter(function (m) { return m.weight == Detail.weight || m.weight > Detail.weight; })[0].EMD_TypeCode;
                                        baggageDetail.DefaultInd = _this.standardproducts.filter(function (m) { return m.weight == Detail.weight || m.weight > Detail.weight; })[0].DefaultInd;
                                        baggageDetail.ProductGroupCode = _this.standardproducts.filter(function (m) { return m.weight == Detail.weight || m.weight > Detail.weight; })[0].ProductGroupCode;
                                        baggageDetail.RFISC_SubCode = _this.standardproducts.filter(function (m) { return m.weight == Detail.weight || m.weight > Detail.weight; })[0].Code;
                                        baggageDetail.RFISC_Code = _this.standardproducts.filter(function (m) { return m.weight == Detail.weight || m.weight > Detail.weight; })[0].RFIC;
                                    }
                                    else {
                                        baggageDetail.CommercialName = _this.catalogproducts.filter(function (m) { return m.CommercialName == Detail.CtlgProduct; })[0].CommercialName;
                                        baggageDetail.LongDescription = _this.catalogproducts.filter(function (m) { return m.CommercialName == Detail.CtlgProduct; })[0].LongDescription;
                                        baggageDetail.WeightUnit = _this.catalogproducts.filter(function (m) { return m.CommercialName == Detail.CtlgProduct; })[0].WeightUnit;
                                        baggageDetail.ShortDescription = _this.catalogproducts.filter(function (m) { return m.CommercialName == Detail.CtlgProduct; })[0].ShortDescription;
                                        baggageDetail.ServiceCode = _this.catalogproducts.filter(function (m) { return m.CommercialName == Detail.CtlgProduct; })[0].ServiceCode;
                                        baggageDetail.SSRCode = _this.catalogproducts.filter(function (m) { return m.CommercialName == Detail.CtlgProduct; })[0].SSRCode;
                                        baggageDetail.EMD_TypeCode = _this.catalogproducts.filter(function (m) { return m.CommercialName == Detail.CtlgProduct; })[0].EMD_TypeCode;
                                        baggageDetail.DefaultInd = _this.catalogproducts.filter(function (m) { return m.CommercialName == Detail.CtlgProduct; })[0].DefaultInd;
                                        baggageDetail.ProductGroupCode = _this.catalogproducts.filter(function (m) { return m.CommercialName == Detail.CtlgProduct; })[0].ProductGroupCode;
                                        baggageDetail.RFISC_SubCode = _this.catalogproducts.filter(function (m) { return m.CommercialName == Detail.CtlgProduct; })[0].Code;
                                        baggageDetail.RFISC_Code = _this.catalogproducts.filter(function (m) { return m.CommercialName == Detail.CtlgProduct; })[0].RFIC;
                                    }
                                    if (Detail.Oversize == true) {
                                        baggageDetail.IsOversized = true;
                                    }
                                    else {
                                        baggageDetail.IsOversized = false;
                                    }
                                    baggageDetail.Pieces = 1;
                                    _this.BaggageDetailarray.push(baggageDetail);
                                }
                                if (Detail.AlreadyExisting) {
                                    var baggageDetail = null;
                                    baggageDetail = new index_3.baggageTemplate.BaggageDetail();
                                    baggageDetail.BaggageRPH = (index + 1).toString();
                                    baggageDetail.FlightSegmentRPH = _this.FlightInfo.SegmentRPH;
                                    baggageDetail.LastFlightSegmentRPH = _this.FlightInfo.SegmentRPH;
                                    baggageDetail.PassengerRPH = _this.PassedPassengerDetail.RPH;
                                    if (Detail && Detail.CheckedInIndicator)
                                        baggageDetail.CheckedInIndicator = Detail.CheckedInIndicator;
                                    if (Detail && Detail.RFISC_SubCode)
                                        baggageDetail.RFISC_SubCode = Detail.RFISC_SubCode;
                                    if (Detail.PieceOccurrenceType && Detail.PieceOccurrence) {
                                        baggageDetail.PieceOccurrenceType = Detail.PieceOccurrenceType;
                                        baggageDetail.PieceOccurrence = Detail.PieceOccurrence;
                                    }
                                    baggageDetail.IsOversized = false;
                                    baggageDetail.Pieces = 1;
                                    baggageDetail.Weight = 0;
                                    _this.BaggageDetailarray.push(baggageDetail);
                                }
                                // });
                                var bagsToPrice = null;
                                bagsToPrice = new index_3.baggageTemplate.BagsToPrice();
                                bagsToPrice.FlightSegment = _this.FlightSegment;
                                bagsToPrice.Passenger = _this.Passenger;
                                bagsToPrice.Passenger[0].freeBaggageAllowance = { "Pieces": _this.FBA };
                                bagsToPrice.PricingInfo = _this.PricingInfo;
                                bagsToPrice.PNR = _this.PNR;
                                bagsToPrice.BaggageDetail = _this.BaggageDetailarray;
                                _this.bagsToPrices = new index_3.baggageTemplate.BagsToPrices();
                                _this.bagsToPrices.BagsToPrice = [];
                                _this.bagsToPrices.BagsToPrice.push(bagsToPrice);
                            }
                            else {
                                if (!_this.refresh) {
                                    Toast.makeText(BaggageinfoComponent_1.BAGGAGECHECK).show();
                                }
                            }
                            // }
                        }
                        else {
                            Toast.makeText("Only numbers").show();
                            _this.weight[index] = true;
                        }
                    });
                    // if (this.AddBaggegeDetailsarray.filter(m => m.status == "Pending Delete").length > 0) {
                    //     console.log("delete bag 2");
                    //     this.BagTag();
                    // }
                    if (this.AddBaggegeDetailsarray.filter(function (m) { return m.status == ""; }).length > 0) {
                        this.GetPrice(this.bagsToPrices);
                    }
                }
            }
            catch (error) {
                console.log(error.message);
                this.loaderProgress.hideLoader();
            }
            finally {
                var endDate = new Date();
                console.log('Gebag Service --------------- End Date Time : ' + endDate);
                console.log('Gebag Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(startDate), new Date(endDate)));
            }
        };
        this.isError = false;
        this.errorMessage = "";
        this.btnList = ["1"];
        this.loaderProgress = new index_3.LoaderProgress();
        this.productitems = [];
        this.productitems.push("Standard");
        this.productitems.push("Catalog");
        this.selectedproduct = "Select Product";
        this.tagitems = [];
        this.tagitems.push("Auto");
        this.tagitems.push("Manual");
        this.isButtonEnabled = false;
    }
    BaggageinfoComponent_1 = BaggageinfoComponent;
    BaggageinfoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loaderProgress.initLoader(this.pageCont);
        this.activatedRouter.queryParams.subscribe(function (params) {
            _this.PassedPassengerDetail = JSON.parse(params["data"]);
            console.log(_this.PassedPassengerDetail);
            _this.baggagecatalog = JSON.parse(params["baggagecatalog"]);
            if (_this.PassedPassengerDetail.CheckinStatus) {
                _this.isRemoveBtnEnabled = false;
                _this.isButtonEnabled = false;
                console.log(_this.isButtonEnabled);
            }
            else {
                _this.isButtonEnabled = true;
            }
            console.log(_this.isButtonEnabled);
            console.dir(_this.baggagecatalog);
            _this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
            _this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
            // this.MultiSegmentPaxArray = JSON.parse(params["multiSegmentPaxArray"]);
            _this.MultiSegmentPaxArray = _this._shared.GetSegmentDetail();
            _this.index = JSON.parse(params["currentPage"]);
            _this.ticketNumber = JSON.parse(params["ticketNumber"]);
            _this.ShortCheckAirportCode = JSON.parse(params["shortcheckin"]);
            _this.isShortCheck = params["isShortCheck"];
            _this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled");
            _this.BaggageInfo = _this._shared.GetPassenger().SegmentTravelerInfos.filter(function (m) { return m.SegmentRPH == _this.MultiSegmentPaxArray.Segment[_this.index].RPH && m.PassengerRPH == _this.PassedPassengerDetail.RPH; })[0].BaggageInfo;
            _this.MultiSegmentPaxArray.Segment.forEach(function (data, index) {
                if (data.MarketingFlight == _this.MultiSegmentPaxArray.Segment[_this.index].MarketingFlight) {
                    _this.FlightInfo = data;
                }
            });
            _this.FlightDate = moment(_this.MultiSegmentPaxArray.Segment[_this.index].FlightDate).format("DD-MMM-YYYY");
            _this.FlightInfo.Passenger.forEach(function (paxData, paxIndex) {
                if (paxData.RPH == _this.PassedPassengerDetail.RPH) {
                    _this.totalweight = paxData.UnitOfMeasureQuantity;
                    _this.totalweightcode = paxData.UnitOfMeasureCode;
                }
            });
            _this.userdetails = ApplicationSettings.getString("userdetails", "");
            _this.date = moment(new Date()).format("DD MMM YYYY");
        });
        this.standardproductsList.push("Standard");
        this.getBaggage();
        if (this.PassedPassengerDetail != null && this.PassedPassengerDetail.BagCount == 0) {
            if (this._shared.GetBagTag() != null) {
                this.AddBag();
            }
            else {
                this.AddBaggage();
            }
        }
        else {
            if (this._shared.GetBagTag() != null) {
                this.AddExistingBaggage(this.PassedPassengerDetail.BaggageInfo);
                this.AddBag();
            }
            else {
                this.AddExistingBaggage(this.PassedPassengerDetail.BaggageInfo);
            }
        }
        var label = this.pageCont.nativeElement;
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();
        });
        this.SharedBag = this._shared.GetPassenger();
        this.loaderProgress.hideLoader();
    };
    BaggageinfoComponent.prototype.AddBag = function () {
        var _this = this;
        this.enableAddBag = true;
        if (this._shared.GetBagTag().filter(function (m) { return m.RPH == _this.PassedPassengerDetail.RPH; }).length > 0) {
            this._shared.GetBagTag().filter(function (m) { return m.RPH == _this.PassedPassengerDetail.RPH; })[0].CheckedBags.forEach(function (element, index) {
                element.BaggageInfo.BagTagDetails.forEach(function (bagElement, Bagindex) {
                    var addBaggegeDetails = null;
                    addBaggegeDetails = new index_3.baggageTemplate.AddBaggegeDetails();
                    addBaggegeDetails.bagTag = null;
                    addBaggegeDetails.weight = bagElement.Weight;
                    addBaggegeDetails.weightUnit = null;
                    addBaggegeDetails.tagNumber = null;
                    addBaggegeDetails.fees = bagElement.fess;
                    addBaggegeDetails.destination = null;
                    addBaggegeDetails.standard = bagElement.isStandard;
                    addBaggegeDetails.catalog = !bagElement.isStandard;
                    addBaggegeDetails.auto = true;
                    addBaggegeDetails.manual = false;
                    addBaggegeDetails.status = "";
                    addBaggegeDetails.StdProduct = addBaggegeDetails.standard ? bagElement.productDescription : "";
                    addBaggegeDetails.Code = "";
                    addBaggegeDetails.CtlgProduct = addBaggegeDetails.standard ? "" : bagElement.productDescription;
                    addBaggegeDetails.AlreadyExisting = false;
                    addBaggegeDetails.selectedproduct = "Select product";
                    _this.isContinuebtnEnabled = false;
                    _this.AddBaggegeDetailsarray.push(addBaggegeDetails);
                    for (; _this.count < 1; _this.count++) {
                        _this.btnList.push({
                            btn: "2"
                        });
                    }
                    _this.isbagExist = false;
                    _this.isButtonEnabled = true;
                    var scrView = _this.baggageScroller.nativeElement;
                    var contView = _this.baggageContainer.nativeElement;
                    scrView.scrollToVerticalOffset(style_properties_1.PercentLength.toDevicePixels(contView.height), true);
                });
            });
        }
        else {
            this.AddBaggage();
        }
    };
    BaggageinfoComponent.prototype.cancel = function () {
        var self = this;
        var orderId = self.PassedPassengerDetail.OrderID;
        this._shared.SetBagTag(null);
        this.loaderProgress.hideLoader();
        self.routerExtensions.navigate(["checkin"], {
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
    BaggageinfoComponent.prototype.GetOrderDetails = function (id) {
        var _this = this;
        this.loaderProgress.showLoader();
        try {
            var sDate = new Date();
            console.log('Get Passenger Service --------------- Start Date Time : ' + sDate);
            this._service.GetPassenger(id)
                .subscribe(function (data) {
                if (data.Success != false) {
                    _this._shared.SetPassenger(data);
                    var scTable = _this._shared.GetStartupTable().Tables.SecurityCodeTable;
                    var PassengerArray = index_4.Converters.ConvertToFlightWithPaxTemplate(_this._shared.GetPassenger(), null, scTable, "");
                    if (PassengerArray.Segment.length > 0) {
                        var setdepartureDate = moment(PassengerArray.Segment[0].DepartureDateTime.toString()).format("YYYY-MM-DD");
                        var setflightnumber = PassengerArray.Segment[0].MarketingFlight;
                        var setcity = PassengerArray.Segment[0].DepartureCity;
                        _this.routerExtensions.navigate(["checkin"], {
                            animated: true,
                            transition: {
                                name: "slide",
                                duration: 600,
                                curve: "linear"
                            },
                            queryParams: {
                                "baggage": id,
                                "index": _this.index
                            }
                        });
                        // PassengerArray.Segment.forEach((SegEle, SegInndex) => {
                        //     let departureDate: string = moment(SegEle.DepartureDateTime.toString()).format("YYYY-MM-DD");
                        //     let flightnumber: string;
                        //     if (SegEle.MarketingFlight.substr(0, 2) == "CM") {
                        //         flightnumber = SegEle.MarketingFlight;
                        //     } else if (SegEle.OperatingFlight != null && SegEle.OperatingFlight.substr(0, 2) == "CM") {
                        //         flightnumber = SegEle.OperatingFlight;
                        //     } else {
                        //         flightnumber = SegEle.MarketingFlight;
                        //     }
                        //     let city: string = SegEle.DepartureCity;
                        //     SegEle.date = moment(SegEle.DepartureDateTime.toString()).format("DD-MMM-YYYY");
                        //     var destination = SegEle.Destination;
                        //     // //Inventory
                        //     // this._checkin.BookingCountDisplay(departureDate, flightnumber, city)
                        //     //     .subscribe((data) => {
                        //     //         if (data.Success != false) {
                        //     //             let inventory: any = data;
                        //     //             SegEle.inven = Converters.ConvertToInventory(inventory);
                        //     //         }
                        //     //     });
                        //     // //Inbound
                        //     // this._checkin.InBound(departureDate, flightnumber, city)
                        //     //     .subscribe((data) => {
                        //     //         if (data.Success != false) {
                        //     //             let inBound: any = data;
                        //     //             SegEle.inbound = Converters.ConvertToInBound(inBound);
                        //     //         }
                        //     //     })
                        //     // //Outbound
                        //     // this._checkin.OutBound(departureDate, flightnumber, destination)
                        //     //     .subscribe((data) => {
                        //     //         if (data.Success != false) {
                        //     //             let OutBound: any = data;
                        //     //             SegEle.outbound = Converters.ConvertToOutBound(OutBound);
                        //     //         }
                        //     //     })
                        //     // //status
                        //     // this._dataService.Status(departureDate, flightnumber, city)
                        //         .subscribe((data) => {
                        //             if (data.Success != false) {
                        //                 let status: any = data;
                        //                 SegEle.status = status.Flights[0].Legs[0].Status;
                        //                 SegEle.Legs = status.Flights[0].Legs;
                        //             }
                        //         })
                        // });
                        // this._dataService.GetBaggage(id).subscribe((data) => {
                        //     if (data.Success != false) {
                        //         this._shared.SetBaggagecatalog(data);
                        //     }
                        // });
                        //Tier
                        // this._dataService.Tier(setdepartureDate, setflightnumber, setcity)
                        //     .subscribe((data) => {
                        //         if (data.Success != false) {
                        //             let tier: any = data;
                        //             this._shared.SetTier(tier);
                        //             this._shared.SetSegmentDetail(PassengerArray);
                        //             var self = this;
                        //             this.loaderProgress.hideLoader();
                        //             // self.routerExtensions.navigate(["checkin"], {
                        //             //     animated: true,
                        //             //     transition: {
                        //             //         name: "slide",
                        //             //         duration: 600,
                        //             //         curve: "linear"
                        //             //     },
                        //             //     queryParams: {
                        //             //         "baggage": id,
                        //             //         "index": this.index
                        //             //     }
                        //             // });
                        //             self.routerExtensions.backToPreviousPage();
                        //         }
                        //     });
                    }
                    else {
                        _this.loaderProgress.hideLoader();
                        Toast.makeText("Record Not Found").show();
                    }
                }
                else {
                    Toast.makeText(data.ErrorMessage).show();
                }
                // this.loaderProgress.hideLoader();
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
                //         this.navigateToLogin();
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
            console.log('Get Passenger Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    BaggageinfoComponent.prototype.GetOrder = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get Passenger Service --------------- Start Date Time : ' + sDate);
            var id = this.PassedPassengerDetail.OrderID;
            this._service.GetPassenger(id)
                .subscribe(function (data) {
                if (data.Success != false) {
                    _this._shared.SetPassenger(data);
                    var scTable = _this._shared.GetStartupTable().Tables.SecurityCodeTable;
                    var PassengerArray = index_4.Converters.ConvertToFlightWithPaxTemplate(_this._shared.GetPassenger(), null, scTable, "");
                    if (PassengerArray.Segment.length > 0) {
                        PassengerArray.Segment[_this.index].Passenger.forEach(function (paxData, paxIndex) {
                            if (paxData.RPH == _this.PassedPassengerDetail.RPH) {
                                _this.totalweight = paxData.UnitOfMeasureQuantity;
                                console.log(paxData.UnitOfMeasureQuantity + " converter weight");
                                _this.totalweightcode = paxData.UnitOfMeasureCode;
                            }
                        });
                    }
                    else {
                        //  this.loaderProgress.hideLoader();
                        Toast.makeText("Record Not Found").show();
                    }
                    _this.loaderProgress.hideLoader();
                }
                else {
                    //  this.loaderProgress.hideLoader();                                                
                    Toast.makeText(data.ErrorMessage).show();
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
            console.log('Get Passenger Service --------------- End Date Time : ' + eDate);
            console.log('Get Passenger Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    BaggageinfoComponent.prototype.GetPrice = function (bagsToPrices) {
        var _this = this;
        try {
            this.navigateButtonEnabled = false;
            var startDate = new Date();
            this.loaderProgress.showLoader();
            console.log('GetPrice Service --------------- Start Date Time : ' + startDate);
            console.log(JSON.stringify(bagsToPrices));
            var isPrice_1 = false;
            var currency = this._shared.GetCurrency();
            this._dataService.GetPrice(bagsToPrices, currency).subscribe(function (data) {
                if (data.Success != false) {
                    _this.isEnabled = false;
                    _this.price = data;
                    console.dir(_this.price);
                    // this._shared.GetPassenger().SegmentTravelerInfos.forEach((element, index) => {
                    //     if (element.PassengerRPH == this.PassedPassengerDetail.RPH) {
                    //         this._shared.GetPassenger().SegmentTravelerInfos[index].BaggageInfo = Object.assign({}, this.price);
                    //         console.log(this._shared.GetPassenger());
                    //     }
                    // });
                    if (_this.price.Collection != null) {
                        _this.price.Collection.forEach(function (data, SegIndex) {
                            if (data.OriginDestination != null) {
                                data.OriginDestination[0].BaggageDetail.some(function (Baggagedata, OriginDestinationIndex) {
                                    _this.AddBaggegeDetailsarray.forEach(function (BaggegeDetail, Detailndex) {
                                        if (BaggegeDetail.status == "" && OriginDestinationIndex == Detailndex) {
                                            if (Baggagedata.CheckedInIndicator) {
                                                BaggegeDetail.CheckedInIndicator = Baggagedata.CheckedInIndicator;
                                            }
                                            if (Baggagedata.PriceData && Baggagedata.PriceData.PieceOccurrenceType && Baggagedata.PriceData.PieceOccurrence) {
                                                BaggegeDetail.PieceOccurrenceType = Baggagedata.PriceData.PieceOccurrenceType;
                                                BaggegeDetail.PieceOccurrence = Baggagedata.PriceData.PieceOccurrence;
                                            }
                                            if (Baggagedata.PriceData.PriceType && Baggagedata.PriceData.PriceType != null) {
                                                console.log(Baggagedata.PriceData.PriceType);
                                                BaggegeDetail.fees = Baggagedata.PriceData.PriceType;
                                            }
                                            else {
                                                BaggegeDetail.fees = Baggagedata.PriceData.ServiceFeeInfo.Amount == null ? "--" : Baggagedata.PriceData.ServiceFeeInfo.Amount + " " + Baggagedata.PriceData.ServiceFeeInfo.Currency;
                                                alert("baggage fees currently not supported - contact check-in desk");
                                                isPrice_1 = true;
                                                // this.AddBaggegeDetailsarray.forEach((Detail, index) => {
                                                //     if (!Detail.AlreadyExisting) {
                                                // var index = this.AddBaggegeDetailsarray.indexOf(BaggegeDetail);
                                                // this.AddBaggegeDetailsarray.splice(index, 1);
                                                //     }
                                                // })
                                                return true;
                                            }
                                            // if (Baggagedata.PriceData.ServiceFeeInfo.Amount != null) {
                                            //     this.AmountArray.push(Baggagedata.PriceData.ServiceFeeInfo.Amount);
                                            // }
                                            // this.totalAmount = this.totalAmount + Baggagedata.PriceData.ServiceFeeInfo.Amount;
                                        }
                                    });
                                });
                            }
                        });
                    }
                    if (isPrice_1) {
                        _this.AddBaggegeDetailsarray = _this.AddBaggegeDetailsarray.filter(function (m) { return m.AlreadyExisting === true; });
                        // this.AddBaggegeDetailsarray.forEach((Detail, index) => {
                        //     if (!Detail.AlreadyExisting) {
                        //         var index = this.AddBaggegeDetailsarray.indexOf(Detail);
                        //         this.AddBaggegeDetailsarray.splice(index, 1);
                        //     }
                        // })
                    }
                    if (_this.price.Errors != null) {
                        Toast.makeText(_this.price.Errors[0].Message).show();
                        _this.loaderProgress.hideLoader();
                    }
                }
                else {
                    _this.loaderProgress.hideLoader();
                    Toast.makeText(data.Errors[0].Message).show();
                }
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
                // if (this.AmountArray.length > 0) {
                //     this.isEnabled = true;
                //     this.isButtonEnabled = true;
                //     this.isCartButtonEnabled = true;
                //     this.loaderProgress.hideLoader();
                // }
                // else {
                if (_this.price.Errors == null) {
                    if (_this.AddBaggegeDetailsarray.filter(function (m) { return m.AlreadyExisting == false; }).length > 0) {
                        _this.BagtagElement = index_4.Converters.GetBagTag(_this.PassedPassengerDetail, _this.FlightInfo, _this.AddBaggegeDetailsarray, _this.FlightInfo, _this.ShortCheckAirportCode);
                        var PassengerList = [];
                        if (_this._shared.GetBagTag() != null) {
                            PassengerList = _this._shared.GetBagTag();
                        }
                        if (PassengerList.length > 0 && PassengerList.filter(function (m) { return m.RPH == _this.BagtagElement.PassengerList[0].RPH; }).length > 0) {
                            // PassengerList.filter(m => m.RPH == this.BagtagElement.PassengerList[0].RPH)[0] = this.BagtagElement.PassengerList[0]
                            PassengerList.splice(PassengerList.indexOf(PassengerList.filter(function (m) { return m.RPH == _this.BagtagElement.PassengerList[0].RPH; })[0]), 1);
                            PassengerList.push(_this.BagtagElement.PassengerList[0]);
                        }
                        else {
                            PassengerList.push(_this.BagtagElement.PassengerList[0]);
                        }
                        console.log(PassengerList);
                        if (_this.PassedPassengerDetail.CheckinStatus) {
                            _this.BagTag();
                        }
                        else {
                            _this._shared.SetBagTag(PassengerList);
                            _this.isContinuebtnEnabled = true;
                            _this.navigateButtonEnabled = true;
                            _this.loaderProgress.hideLoader();
                        }
                    }
                    else {
                        _this.AddBaggage();
                        console.log(_this.AddBaggegeDetailsarray);
                        _this.loaderProgress.hideLoader();
                    }
                }
                else {
                    _this.loaderProgress.hideLoader();
                    Toast.makeText(_this.price.Errors[0].Message).show();
                }
                // }
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var endDate = new Date();
            console.log('GetPrice Service --------------- End Date Time : ' + endDate);
            console.log('GetPrice Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(startDate), new Date(endDate)));
        }
    };
    BaggageinfoComponent.prototype.isShortCheckin = function (args, item) {
        var _this = this;
        // console.log(args.ShortCheckinArrivalCodesByFlights);
        // console.log(this.MultiSegmentPaxArray.Segment[this.index].FlightNumber);
        if (args.ShortCheckinArrivalCodesByFlights != null && args.ShortCheckinArrivalCodesByFlights.filter(function (m) { return m.FlightNumber == _this.MultiSegmentPaxArray.Segment[_this.index].MarketingFlight || m.FlightNumber == _this.MultiSegmentPaxArray.Segment[_this.index].OperatingFlight; }).length > 0 && args.ShortCheckinArrivalCodesByFlights.filter(function (m) { return m.FlightNumber == _this.MultiSegmentPaxArray.Segment[_this.index].MarketingFlight || m.FlightNumber == _this.MultiSegmentPaxArray.Segment[_this.index].OperatingFlight; })[0].ShortCheckinArrivalCodes.IsEligibleForShortCheckin && item.AlreadyExisting == false) {
            this.ShortCheckRequired = true;
            return true;
        }
        else {
            this.ShortCheckRequired = false;
            return false;
        }
    };
    BaggageinfoComponent.prototype.selectShortCheckCode = function (args, item) {
        var _this = this;
        var ShortcheckCodes = args.ShortCheckinArrivalCodesByFlights.filter(function (m) { return m.FlightNumber == _this.MultiSegmentPaxArray.Segment[_this.index].MarketingFlight; })[0].ShortCheckinArrivalCodes.ShortCheckInArrivalCodes;
        if (ShortcheckCodes != null && ShortcheckCodes != []) {
            var options = {
                title: "ShortCheck",
                message: "Choose Destination",
                actions: ShortcheckCodes
            };
            dialogs.action(options).then(function (result) {
                console.log(result);
                if (result) {
                    args.ShortCheckAirportCode = result;
                    item.ShortCheckAirportCode = result;
                }
                else {
                    args.ShortCheckAirportCode = ShortcheckCodes[0];
                    item.ShortCheckAirportCode = ShortcheckCodes[0];
                }
            });
        }
    };
    BaggageinfoComponent.prototype.getBaggage = function () {
        var _this = this;
        try {
            var startDate = new Date();
            console.log('GetBaggage Service --------------- Start Date Time : ' + startDate);
            this.loaderProgress.showLoader();
            if (this.baggagecatalog != null && this.baggagecatalog.Collection != null) {
                this.baggagecatalog.Collection.forEach(function (data, SegIndex) {
                    if (data.Passenger[0].PassengerRPH == _this.PassedPassengerDetail.RPH) {
                        if (data.Passenger[0].MaxBagCount) {
                            _this.maxBagCount = data.Passenger[0].MaxBagCount;
                        }
                        _this.FlightSegment = data.FlightSegment;
                        // this.Passenger = data.Passenger;
                        _this.PricingInfo = data.PricingInfo;
                        data.PNR.CheckedInIndicator = true;
                        _this.PNR = data.PNR;
                        console.dir(_this.index);
                        console.dir(data.OriginDestination.filter(function (m) { return m.OriginDestinationRPH == _this.MultiSegmentPaxArray.Segment[_this.index].RPH; })[0]);
                        if (data.OriginDestination.filter(function (m) { return m.OriginDestinationRPH == _this.MultiSegmentPaxArray.Segment[_this.index].RPH; }).length > 0) {
                            _this.FBA = data.OriginDestination.filter(function (m) { return m.OriginDestinationRPH == _this.MultiSegmentPaxArray.Segment[_this.index].RPH; })[0].BaggageCatalog.FreeBaggageAllowance.Pieces;
                        }
                        else {
                            _this.FBA = data.OriginDestination[0].BaggageCatalog.FreeBaggageAllowance.Pieces;
                        }
                        if ((_this.MultiSegmentPaxArray.Segment[_this.index].Passenger.filter(function (m) { return m.RPH == _this.PassedPassengerDetail.RPH; })[0].AssociatedInfantRPH)) {
                            _this.Passenger = data.Passenger;
                            _this.Passenger.push({ PassengerRPH: _this.MultiSegmentPaxArray.Segment[_this.index].Passenger.filter(function (m) { return m.RPH == _this.PassedPassengerDetail.RPH; })[0].AssociatedInfantRPH, Type: "INF", freeBaggageAllowance: { Pieces: _this.FBA } });
                        }
                        else {
                            _this.Passenger = data.Passenger;
                        }
                        data.OriginDestination[0].BaggageCatalog.SubGrpDetail.forEach(function (GrpDetail, SegIndex) {
                            GrpDetail.BaggageDetail.forEach(function (Product, SegIndex) {
                                if (GrpDetail.SubGrpCode == null && Product.IsStandardBag) {
                                    var standardproduct = new index_3.baggageTemplate.ProductDetail();
                                    standardproduct.CommercialName = Product.EmdProduct.CommercialName;
                                    standardproduct.Code = Product.EmdProduct.RFISC_SubCode;
                                    standardproduct.RFIC = Product.EmdProduct.RFIC;
                                    standardproduct.SubType = Product.EmdProduct.SubType; // EMDType
                                    standardproduct.ServiceCode = Product.ServiceCode; // TypeOfService
                                    standardproduct.SSRCode = Product.EmdProduct.SSRCode;
                                    standardproduct.ShortDescription = Product.EmdProduct.ShortDescription;
                                    standardproduct.LongDescription = Product.EmdProduct.LongDescription;
                                    standardproduct.EMD_TypeCode = Product.EmdProduct.EMD_TypeCode;
                                    standardproduct.weight = Product.Weight;
                                    standardproduct.WeightUnit = Product.WeightUnit;
                                    standardproduct.DefaultInd = Product.DefaultInd;
                                    standardproduct.ProductGroupCode = GrpDetail.ProductGroupCode;
                                    standardproduct.EMD_TypeCode = Product.EmdProduct.EMD_TypeCode;
                                    if (standardproduct.weight >= 100) {
                                        _this.standardproductsList.push(standardproduct.CommercialName);
                                    }
                                    _this.standardproducts.push(standardproduct);
                                    _this.standardproducts.sort(function (a, b) {
                                        var val1 = a.weight;
                                        var val2 = b.weight;
                                        console.log(val1 + " " + val2);
                                        if (val1 < val2) {
                                            return -1;
                                        }
                                        else {
                                            return 1;
                                        }
                                    });
                                    console.log(_this.standardproducts);
                                }
                                else {
                                    try {
                                        var catalogproduct = new index_3.baggageTemplate.ProductDetail();
                                        catalogproduct.CommercialName = Product.EmdProduct.CommercialName;
                                        catalogproduct.Code = Product.EmdProduct.RFISC_SubCode;
                                        catalogproduct.RFIC = Product.EmdProduct.RFIC;
                                        catalogproduct.SubType = Product.EmdProduct.SubType; // EMDType
                                        catalogproduct.ServiceCode = Product.EmdProduct.ServiceCode; // TypeOfService
                                        catalogproduct.SSRCode = Product.EmdProduct.SSRCode;
                                        catalogproduct.weight = Product.Weight;
                                        catalogproduct.DefaultInd = Product.DefaultInd;
                                        catalogproduct.ProductGroupCode = GrpDetail.ProductGroupCode;
                                        catalogproduct.LongDescription = Product.EmdProduct.LongDescription;
                                        catalogproduct.ShortDescription = Product.EmdProduct.ShortDescription;
                                        catalogproduct.EMD_TypeCode = Product.EmdProduct.EMD_TypeCode;
                                        _this.catalogproductsList.push(catalogproduct.CommercialName);
                                        _this.catalogproducts.push(catalogproduct);
                                    }
                                    catch (e) {
                                        console.log(e);
                                    }
                                }
                            });
                        });
                    }
                });
            }
            else {
                Toast.makeText("Catalog not found");
            }
            this.loaderProgress.hideLoader();
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var endDate = new Date();
            // this.loaderProgress.hideLoader();
            console.log('GetBaggage Service --------------- End Date Time : ' + endDate);
            console.log('GetBaggage Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(startDate), new Date(endDate)));
        }
    };
    BaggageinfoComponent.prototype.AddBaggage = function () {
        if (this.enableAddBag) {
            this.enableAddBag = true;
            this.enableRemoveBag = false;
            this.bagCount = this.AddBaggegeDetailsarray.length + 1;
            if (this.bagCount <= this.maxBagCount) {
                var addBaggegeDetails = null;
                addBaggegeDetails = new index_3.baggageTemplate.AddBaggegeDetails();
                addBaggegeDetails.bagTag = null;
                addBaggegeDetails.weight = null;
                addBaggegeDetails.weightUnit = null;
                addBaggegeDetails.tagNumber = null;
                addBaggegeDetails.fees = null;
                addBaggegeDetails.destination = null;
                addBaggegeDetails.standard = false;
                addBaggegeDetails.catalog = false;
                addBaggegeDetails.auto = true;
                addBaggegeDetails.manual = false;
                addBaggegeDetails.status = "";
                addBaggegeDetails.StdProduct = "";
                addBaggegeDetails.Code = "";
                addBaggegeDetails.CtlgProduct = "";
                addBaggegeDetails.AlreadyExisting = false;
                addBaggegeDetails.selectedproduct = "Select product";
                this.isContinuebtnEnabled = false;
                this.AddBaggegeDetailsarray.push(addBaggegeDetails);
                for (; this.count < 1; this.count++) {
                    this.btnList.push({
                        btn: "2"
                    });
                }
                this.isbagExist = false;
                this.isButtonEnabled = true;
                var scrView = this.baggageScroller.nativeElement;
                var contView = this.baggageContainer.nativeElement;
                scrView.scrollToVerticalOffset(style_properties_1.PercentLength.toDevicePixels(contView.height), true);
            }
            else {
                Toast.makeText("Maximum number of baggage reached").show();
            }
        }
    };
    BaggageinfoComponent.prototype.onChange = function (args, argsindex, index, item) {
        this._timeoutService.resetWatch();
        console.log(args);
        // if (this.isButtonEnabled) {
        switch (index) {
            case 0:
                console.log(args);
                if (args == "") {
                    Toast.makeText(this._configuration.FieldValidationText).show();
                }
                var reg = new RegExp(/^[0-9]+$/);
                var test = reg.test(args);
                console.log(test);
                if (test == false) {
                    this.weight[argsindex] = true;
                    this.validateFeild(item);
                    // this.isButtonEnabled = false;
                    Toast.makeText("Only number").show();
                }
                else {
                    this.weight[argsindex] = false;
                    this.validateFeild(item);
                    //this.isButtonEnabled = true;
                }
                // else this.weight = false;
                var testWeight = Number(args);
                if (item.standard && item.StdProduct == "Standard") {
                    var length_1 = this.standardproducts.filter(function (m) { return m.weight <= 45; }).length - 1;
                    if (length_1 > 0 && testWeight > this.standardproducts.filter(function (m) { return m.weight <= 45; })[length_1].weight) {
                        Toast.makeText("Baggage weight exceeds allowable (100KG) for standard baggage.Extra baggage needs to be transported as cargo.").show();
                        item.weight = "";
                        this.weight[argsindex] = true;
                        this.validateFeild(item);
                    }
                    else if (test == false) {
                        this.weight[argsindex] = true;
                        this.validateFeild(item);
                    }
                    else {
                        this.weight[argsindex] = false;
                        this.validateFeild(item);
                    }
                }
                else if (item.standard && item.StdProduct != "Standard" && item.catalog == false) {
                    if (this.standardproducts.filter(function (m) { return m.Name == item.StdProduct; }).length > 0 && testWeight > this.standardproducts.filter(function (m) { return m.Name == item.StdProduct; })[0].weight) {
                        Toast.makeText("Baggage weight exceeds allowable (100KG) for standard baggage.Extra baggage needs to be transported as cargo.").show();
                        item.weight = "";
                        this.weight[argsindex] = true;
                        this.validateFeild(item);
                    }
                    else if (test == false) {
                        this.weight[argsindex] = true;
                        this.validateFeild(item);
                    }
                    else {
                        this.weight[argsindex] = false;
                        this.validateFeild(item);
                    }
                }
                else {
                    if (this.catalogproducts.filter(function (m) { return m.Name == item.CtlgProduct; }).length > 0 && testWeight > this.catalogproducts.filter(function (m) { return m.Name == item.CtlgProduct; })[0].weight) {
                        Toast.makeText("Baggage weight exceeds allowable size.Extra baggage needs to be transported as cargo..").show();
                        item.weight = "";
                        this.weight[argsindex] = true;
                        this.validateFeild(item);
                    }
                    else if (test == false) {
                        this.weight[argsindex] = true;
                        this.validateFeild(item);
                    }
                    else {
                        this.weight[argsindex] = false;
                        this.validateFeild(item);
                    }
                }
                // console.log(this.weight);
                break;
            case 1:
                if (args == "" && item.manual) {
                    Toast.makeText(this._configuration.FieldValidationText).show();
                }
                var reg = new RegExp(/^[0-9]+$/);
                var regs = new RegExp(/^[a-zA-Z]{2}[0-9]{6}$/);
                var test = reg.test(args);
                var tests = regs.test(args);
                console.log(test);
                if ((test == false && tests == false) && item.manual) {
                    this.Tag[argsindex] = true;
                    this.validateFeild(item);
                    // this.isButtonEnabled = false;
                }
                else {
                    this.Tag[argsindex] = false;
                    this.validateFeild(item);
                    //this.isButtonEnabled = true;
                }
        }
        // }
    };
    BaggageinfoComponent.prototype.validateFeild = function (item) {
        if (this.weight.filter(function (m) { return m == true; }).length > 0 || ((item.manual) && (this.Tag.filter(function (m) { return m == true; }).length > 0))) {
            this.isButtonEnabled = false;
        }
        else {
            this.isButtonEnabled = true;
        }
    };
    BaggageinfoComponent.prototype.Validate = function () {
        var _this = this;
        try {
            var msg_1 = "";
            var checktag_1 = false;
            var productcheck_1 = false;
            var weightcheck_1 = false;
            var destinationCheck_1 = false;
            var bagtagnumber_1 = false;
            if (this.AddBaggegeDetailsarray.filter(function (m) { return m.status == ""; }).length > 0) {
                this.AddBaggegeDetailsarray.forEach(function (Detail, Index) {
                    if (!Detail.AlreadyExisting) {
                        if (Detail.auto == false && Detail.manual == false) {
                            msg_1 = msg_1 == "" ? "auto or manual" : (msg_1 + " ," + "auto or manual");
                            checktag_1 = true;
                        }
                        if (Detail.StdProduct == "" && Detail.CtlgProduct == "") {
                            msg_1 = msg_1 == "" ? "product" : (msg_1 + " ," + "product");
                            productcheck_1 = true;
                        }
                        if (Detail.weight == null) {
                            msg_1 = msg_1 == "" ? "weight" : (msg_1 + " ," + "weight");
                            weightcheck_1 = true;
                        }
                        if (_this.ShortCheckRequired && (Detail.ShortCheckAirportCode == "" || Detail.ShortCheckAirportCode == null)) {
                            msg_1 = msg_1 == "" ? "destination city" : (msg_1 + " ," + "destination city");
                            destinationCheck_1 = true;
                        }
                        if (Detail.manual == true) {
                            if (Detail.tagNumber != null && Detail.tagNumber != "") {
                                if (Detail.tagNumber.length == 6 || Detail.tagNumber.length == 8) {
                                }
                                else {
                                    msg_1 = msg_1 == "" ? " Invalid bagtag number " + Detail.tagNumber + ". Tag number should be 6 " : (msg_1 + " ," + " Invalid bagtag number" + Detail.tagNumber + ". Tag number should be 6 ");
                                    bagtagnumber_1 = true;
                                }
                            }
                            else {
                                msg_1 = msg_1 == "" ? "Tag number should be 6  " : (msg_1 + " ," + "Tag number should be 6 ");
                                bagtagnumber_1 = true;
                            }
                        }
                    }
                });
            }
            else {
                if (this.AddBaggegeDetailsarray.filter(function (m) { return m.status == "Pending Delete"; }).length > 0) {
                    return true;
                }
                else {
                    if (this.AddBaggegeDetailsarray.length > 0) {
                        Toast.makeText("Kindly add or Remove baggage").show();
                    }
                    else {
                        Toast.makeText("Kindly add baggage").show();
                    }
                    return false;
                }
            }
            if (msg_1 == "") {
                return true;
            }
            else {
                if (checktag_1 != false) {
                    Toast.makeText("Auto or Manual required").show();
                }
                if (productcheck_1 != false) {
                    Toast.makeText("Product required").show();
                }
                if (weightcheck_1 != false) {
                    Toast.makeText("Weight required").show();
                }
                if (destinationCheck_1) {
                    Toast.makeText("destination city required").show();
                }
                if (bagtagnumber_1) {
                    Toast.makeText("bagtagnumber is not valid").show();
                }
                // Toast.makeText(msg + " required").show();
                return false;
            }
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            var endDate = new Date();
            console.log('Validate--------------- End Date Time : ' + endDate);
            console.log('Validate Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(endDate), new Date(endDate)));
        }
    };
    BaggageinfoComponent.prototype.AddExistingBaggage = function (BaggageDetail) {
        // this.isRemoveBtnEnabled = false
        var _this = this;
        if (BaggageDetail != null && BaggageDetail.BagTagDetails != null) {
            var MeasureQuantit = 0;
            var weight_1 = 0;
            if (BaggageDetail.UnitOfMeasureQuantity != null && BaggageDetail.UnitOfMeasureQuantity > 0) {
                MeasureQuantit = BaggageDetail.UnitOfMeasureQuantity;
                weight_1 = ((MeasureQuantit) / (this.PassedPassengerDetail.BagCount));
            }
            else {
                weight_1 = BaggageDetail.UnitOfMeasureQuantity;
            }
            this.PassedPassengerDetail.TotalWeight = MeasureQuantit;
            this.AddBaggegeDetailsarray = [];
            BaggageDetail.BagTagDetails.forEach(function (Detail, DetailIndex) {
                var addBaggegeDetails = null;
                addBaggegeDetails = new index_3.baggageTemplate.AddBaggegeDetails();
                addBaggegeDetails.bagTag = null;
                addBaggegeDetails.weight = Math.round(weight_1);
                addBaggegeDetails.weightUnit = BaggageDetail.UnitOfMeasureCode;
                addBaggegeDetails.tagNumber = Detail.CarrierCode + Detail.SerialNumber;
                addBaggegeDetails.fees = null;
                addBaggegeDetails.destination = null;
                addBaggegeDetails.standard = true;
                addBaggegeDetails.catalog = false,
                    addBaggegeDetails.auto = true,
                    addBaggegeDetails.manual = false,
                    addBaggegeDetails.status = "CheckedIn";
                addBaggegeDetails.StdProduct = "";
                addBaggegeDetails.Code = "";
                addBaggegeDetails.CtlgProduct = "";
                addBaggegeDetails.AlreadyExisting = true;
                addBaggegeDetails.CheckedInIndicator = Detail.CheckedInIndicator;
                if (Detail.RFISC_SubCode)
                    addBaggegeDetails.RFISC_SubCode = Detail.RFISC_SubCode;
                if (Detail.PieceOccurrence && Detail.PieceOccurrenceType) {
                    addBaggegeDetails.PieceOccurrence = Detail.PieceOccurrence;
                    addBaggegeDetails.PieceOccurrenceType = Detail.PieceOccurrenceType;
                }
                addBaggegeDetails.BagTagDetails = Detail;
                console.log(addBaggegeDetails);
                _this.AddBaggegeDetailsarray.push(addBaggegeDetails);
            });
            this.isbagExist = true;
            for (; this.count < 1; this.count++) {
                this.btnList.push({
                    btn: "2"
                });
            }
        }
    };
    ;
    BaggageinfoComponent.prototype.AddManualBaggage = function (BaggageInfo) {
        var _this = this;
        if (BaggageInfo.BaggageDetails != null) {
            var MeasureQuantit = 0;
            var weight_2 = 0;
            if (BaggageInfo.CheckedBagWeightTotal != null && BaggageInfo.CheckedBagWeightTotal > 0) {
                MeasureQuantit = BaggageInfo.CheckedBagWeightTotal;
                weight_2 = ((MeasureQuantit) / (BaggageInfo.CheckedBagCountTotal));
            }
            else {
                weight_2 = BaggageInfo.CheckedBagWeightTotal;
            }
            this.PassedPassengerDetail.TotalWeight = MeasureQuantit;
            this.AddBaggegeDetailsarray = [];
            BaggageInfo.BaggageDetails.forEach(function (Detail, DetailIndex) {
                var addBaggegeDetails = null;
                addBaggegeDetails = new index_3.baggageTemplate.AddBaggegeDetails();
                addBaggegeDetails.bagTag = null;
                addBaggegeDetails.weight = Math.round(weight_2);
                addBaggegeDetails.weightUnit = BaggageInfo.UnitOfMeasureCode;
                addBaggegeDetails.tagNumber = Detail.CarrierCode + Detail.SerialNumber;
                addBaggegeDetails.fees = null;
                addBaggegeDetails.destination = null;
                addBaggegeDetails.standard = true;
                addBaggegeDetails.catalog = false,
                    addBaggegeDetails.auto = true,
                    addBaggegeDetails.manual = false,
                    addBaggegeDetails.status = "CheckedIn";
                addBaggegeDetails.StdProduct = "";
                addBaggegeDetails.Code = "";
                addBaggegeDetails.CtlgProduct = "";
                addBaggegeDetails.AlreadyExisting = true;
                addBaggegeDetails.BagTagDetails = Detail;
                _this.AddBaggegeDetailsarray.push(addBaggegeDetails);
            });
            this.isbagExist = true;
            for (; this.count < 1; this.count++) {
                this.btnList.push({
                    btn: "2"
                });
            }
        }
    };
    ;
    BaggageinfoComponent.prototype.refreshFlifo = function () {
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
    BaggageinfoComponent.prototype.displayCatalogproductsDialog = function (item) {
        var _this = this;
        var options = {
            title: "Catalog",
            // message: "Choose  catalog",
            cancelButtonText: "Cancel",
            actions: this.catalogproductsList
        };
        dialogs.action(options).then(function (result) {
            if (result != "Cancel") {
                item.catalog = true;
                item.StdProduct = "";
                item.CtlgProduct = "";
                item.Code = "";
                item.CtlgProduct = result;
                item.Code = _this.catalogproducts.filter(function (m) { return m.Name == result; })[0].Code;
                _this.CatalogServiceDetail = _this.catalogproducts.filter(function (m) { return m.Name == result; })[0];
            }
        });
    };
    BaggageinfoComponent.prototype.displayStandardproductsDialog = function (item) {
        var _this = this;
        var options = {
            title: "Standard",
            //message: "Choose  standard",
            cancelButtonText: "Cancel",
            actions: this.standardproductsList
        };
        dialogs.action(options).then(function (result) {
            if (result != "Cancel") {
                item.standard = true;
                item.StdProduct = "";
                item.CtlgProduct = "";
                item.Code = "";
                item.StdProduct = result;
                if (_this.standardproducts.filter(function (m) { return m.Name == result; }).length > 0) {
                    item.Code = _this.standardproducts.filter(function (m) { return m.Name == result; })[0].Code;
                    _this.CatalogServiceDetail = _this.standardproducts.filter(function (m) { return m.Name == result; })[0];
                }
            }
        });
    };
    BaggageinfoComponent.prototype.displayTagActionDialog = function (item) {
        var options = {
            title: "Bag Tag",
            // message: "Choose  Bag Tag",
            cancelButtonText: "Cancel",
            actions: this.tagitems
        };
        dialogs.action(options).then(function (result) {
            if (result != "Cancel") {
                if (result == "Auto") {
                    item.auto = true;
                    item.manual = false;
                }
                else {
                    item.manual = true;
                    item.auto = false;
                }
            }
        });
    };
    BaggageinfoComponent.prototype.displayProductActionDialog = function (item) {
        var _this = this;
        var options = {
            title: "Product",
            // message: "Choose  Product",
            cancelButtonText: "Cancel",
            actions: this.productitems
        };
        dialogs.action(options).then(function (result) {
            if (result != "Cancel") {
                item.selectedproduct = result;
                if (result == "Standard") {
                    item.standard = true;
                    item.StdProduct = "";
                    item.CtlgProduct = "";
                    item.Code = "";
                    item.StdProduct = result;
                    if (_this.standardproducts.filter(function (m) { return m.Name == result; }).length > 0) {
                        item.Code = _this.standardproducts.filter(function (m) { return m.Name == result; })[0].Code;
                        _this.CatalogServiceDetail = _this.standardproducts.filter(function (m) { return m.Name == result; })[0];
                    }
                }
                if (result == "Catalog") {
                    _this.displayCatalogproductsDialog(item);
                }
                if (result == "Select Product") {
                    item.standard = false;
                    item.catalog = false;
                    item.StdProduct = "";
                    item.CtlgProduct = "";
                    item.Code = "";
                }
            }
        });
    };
    // displayScanOptionDialog() {
    //     let options = {
    //         title: "Credit Card",
    //         // message: "Choose  Product",
    //         cancelButtonText: "Cancel",
    //         actions: ["Scan Credit Card", "Manual Entry"]
    //     };
    //     dialogs.action(options).then((result) => {
    //         if (result == "Scan Credit Card") {
    //             scanCardClicked().then((number) => {
    //                 console.log(number);
    //                 this.CardNumber = number.cardNumber;
    //                 this.cvv = number.cvv;
    //                 this.expiryMonth = number.expiryMonth;
    //                 this.expiryYear = number.expiryYear
    //                 console.log(this.CardNumber);
    //                 let options: ModalDialogOptions = {
    //                     viewContainerRef: this.vcRef,
    //                     context: [{ "cardNumber": this.CardNumber, "cvv": this.cvv }],
    //                     fullscreen: false
    //                 };
    //                 this._modalService.showModal(PaymentComponent, options)
    //                     .then((result) => {
    //                         this.paymentCardDetails = result;
    //                         this.isButtonEnabled = true;
    //                         this.confirm(null);
    //                     });
    //             });
    //         }
    //         if (result == "Manual Entry") {
    //             let options: ModalDialogOptions = {
    //                 viewContainerRef: this.vcRef,
    //                 context: [{ "cardNumber": this.CardNumber }],
    //                 fullscreen: false
    //             };
    //             this._modalService.showModal(PaymentComponent, options)
    //                 .then((result) => {
    //                     this.paymentCardDetails = result;
    //                     this.isButtonEnabled = true;
    //                     this.confirm(null);
    //                 });
    //         }
    //     });
    // }
    BaggageinfoComponent.prototype.navigateToSearch = function () {
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
    BaggageinfoComponent.prototype.navigateToDepartures = function () {
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
    BaggageinfoComponent.prototype.navigateToLogin = function () {
        this.routerExtensions.navigate([""], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    BaggageinfoComponent.prototype.BagTag = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            console.log(JSON.stringify(this.BagtagElement));
            var bagtagElement_1 = Object.assign({}, this.BagtagElement);
            this._shared.SetBagTag(null);
            this._dataService.GetBagTag(this.BagtagElement).subscribe(function (data) {
                console.log(JSON.stringify(data));
                console.dir(_this._shared.GetPassenger().SegmentTravelerInfos[_this.index].BaggageInfo);
                if (data.Success != false) {
                    _this.BagtagList = data;
                    var bagtagList_1 = Object.assign({}, data);
                    console.dir(_this.BagtagList);
                    if (data.Warnings != null && data.Warnings.length > 0) {
                        data.Warnings.forEach(function (warning, index) {
                            Toast.makeText(warning.Message).show();
                        });
                    }
                    if (_this.isRemoveBag == true) {
                        _this._shared.SetBagTag(null);
                        _this._service.GetPassenger(_this.MultiSegmentPaxArray.Segment[_this.index].Passenger[0].OrderID)
                            .subscribe(function (data) {
                            _this._shared.SetPassenger(data);
                            var scTable = _this._shared.GetStartupTable().Tables.SecurityCodeTable;
                            _this.MultiSegmentPaxArray = index_4.Converters.ConvertToFlightWithPaxTemplate(_this._shared.GetPassenger(), null, scTable, "");
                            _this.MultiSegmentPaxArray.Segment[_this.index].Passenger.forEach(function (paxData, paxIndex) {
                                if (paxData.RPH == _this.PassedPassengerDetail.RPH) {
                                    _this.PassedPassengerDetail = paxData;
                                    _this.totalweight = paxData.UnitOfMeasureQuantity;
                                    _this.totalweightcode = paxData.UnitOfMeasureCode;
                                }
                            });
                            _this.AddBaggegeDetailsarray = [];
                            _this.standardproductsList.push("Standard");
                            _this.getBaggage();
                            _this.enableAddBag = true;
                            if (_this.PassedPassengerDetail != null && _this.PassedPassengerDetail.BagCount == 0) {
                                if (_this._shared.GetBagTag() != null) {
                                    _this.AddBag();
                                }
                                else {
                                    _this.AddBaggage();
                                }
                            }
                            else {
                                if (_this._shared.GetBagTag() != null) {
                                    _this.AddExistingBaggage(_this.PassedPassengerDetail.BaggageInfo);
                                    _this.AddBag();
                                }
                                else {
                                    _this.AddExistingBaggage(_this.PassedPassengerDetail.BaggageInfo);
                                    _this.AddBaggage();
                                }
                            }
                            _this.loaderProgress.hideLoader();
                            _this.routerExtensions.navigate(["checkin"], {
                                animated: true,
                                transition: {
                                    name: "slide",
                                    duration: 600,
                                    curve: "linear"
                                },
                                queryParams: {
                                    "data": _this.PassedPassengerDetail.OrderID,
                                    "index": _this.index,
                                }
                            });
                            // this.AddExistingBaggage(this.PassedPassengerDetail.BaggageInfo);
                        }, function (err) {
                            console.log(err);
                            _this.handleServiceError(err);
                            _this.loaderProgress.hideLoader();
                        });
                    }
                    else {
                        if (!ApplicationSettings.getBoolean("isHostBagtag")) {
                            if (data.BagTagPrintResponse && data.BagTagPrintResponse.BagTagOutput[0].PicRawData) {
                                var image = imageModule.fromBase64(data.BagTagPrintResponse.BagTagOutput[0].PicRawData);
                                var folder_1 = fs.knownFolders.documents();
                                var filename_1 = moment(new Date()).format("hhmmss");
                                var path = fs.path.join(folder_1.path, "tempBPImage" + filename_1 + ".jpg");
                                try {
                                    image.saveToFile(path, "jpeg");
                                    var printerID = _this.getPrinter();
                                    if (printerID.trim() != "") {
                                        var self_1 = _this;
                                        new zebra.Printer({ address: printerID, language: "CPCL", debugging: false }).then(function (curPrinter, result) {
                                            var document = curPrinter.createDocument();
                                            document.image(fs.path.join(folder_1.path, "tempBPImage" + filename_1 + ".jpg"), 0);
                                            curPrinter.getStatus().then(function (result) {
                                                var _this = this;
                                                console.log(result);
                                                if (result.ready && !result.latchOpen && !result.lowBattery && !result.paperOut) {
                                                    //printing
                                                    curPrinter.print(document).catch(function (status) {
                                                        console.log(status);
                                                        Toast.makeText(checkin_component_1.CheckInComponent.UNABLETOPRINT).show();
                                                    });
                                                    console.log("Printing Done");
                                                    var file = folder_1.getFile("tempBPImage" + filename_1 + ".jpg");
                                                    file.remove().then(function (res) {
                                                        console.log("file removed");
                                                    });
                                                    Toast.makeText("Bagtag printed sucessfully").show();
                                                    var Remakrequest = index_4.Converters.BluetoothPrinterResponse(bagtagElement_1, bagtagList_1, true);
                                                    console.log(JSON.stringify(Remakrequest));
                                                    self_1._printemail.Remarks(Remakrequest).subscribe(function (data) {
                                                        console.log(data);
                                                        if (data.Information != null && data.Information.length > 0) {
                                                            Toast.makeText(data.Information[0].Message).show();
                                                        }
                                                        self_1.printerResponse();
                                                    }, function (error) {
                                                        _this.handleServiceError(error);
                                                        _this.AddBaggegeDetailsarray.forEach(function (Detail, index) {
                                                            if (!Detail.AlreadyExisting) {
                                                                var index = _this.AddBaggegeDetailsarray.indexOf(Detail);
                                                                _this.AddBaggegeDetailsarray.splice(index, 1);
                                                            }
                                                        });
                                                    });
                                                    curPrinter.close().then(function () {
                                                        Toast.makeText("Printer is ready to print").show();
                                                        this.loaderProgress.hideLoader();
                                                    }).catch(function (err) {
                                                        Toast.makeText("Error Occured while Printing:").show();
                                                        // console.log("Printing Error: ", err);
                                                        curPrinter.close();
                                                    });
                                                }
                                                else {
                                                    if (result.latchOpen) {
                                                        Toast.makeText("!!!!LatchOpen").show();
                                                    }
                                                    if (result.lowBattery) {
                                                        Toast.makeText("!!!!LowBattery").show();
                                                    }
                                                    if (result.paperOut) {
                                                        Toast.makeText("!!!!PaperOut").show();
                                                    }
                                                    self_1.PrintFail(bagtagElement_1, bagtagList_1);
                                                }
                                            }).catch(function (status) {
                                                console.log(status);
                                                Toast.makeText(checkin_component_1.CheckInComponent.PRINTERSESSION).show();
                                                console.log("HI");
                                                self_1.PrintFail(bagtagElement_1, bagtagList_1);
                                            });
                                        }).catch(function (err) {
                                            Toast.makeText(checkin_component_1.CheckInComponent.PRINTERSESSION).show();
                                            console.log("HI");
                                            self_1.PrintFail(bagtagElement_1, bagtagList_1);
                                        });
                                    }
                                    else {
                                        Toast.makeText(checkin_component_1.CheckInComponent.UNABLETOPRINT).show();
                                        _this.PrintFail(bagtagElement_1, bagtagList_1);
                                    }
                                }
                                catch (e) {
                                    console.log(e);
                                    Toast.makeText(checkin_component_1.CheckInComponent.UNABLETOPRINT).show();
                                    _this.PrintFail(bagtagElement_1, bagtagList_1);
                                }
                            }
                            else if (_this.AddBaggegeDetailsarray.filter(function (m) { return m.AlreadyExisting == false && m.manual == true; }).length > 0) {
                                _this.printerResponse();
                            }
                            else {
                                Toast.makeText(checkin_component_1.CheckInComponent.UNABLETOPRINT).show();
                                _this.PrintFail(bagtagElement_1, bagtagList_1);
                            }
                        }
                        else {
                            if (_this.BagtagList.Errors != null && _this.BagtagList.Errors.length > 0) {
                                if (_this.BagtagList.Errors.filter(function (m) { return m.Message.indexOf("BAG TAG PRINT FAILED") >= 0; })) {
                                    console.log("nij");
                                    _this.AddBaggegeDetailsarray = _this.AddBaggegeDetailsarray.filter(function (m) { return m.AlreadyExisting === true; });
                                    // this.AddBaggegeDetailsarray.forEach((Detail, index) => {
                                    //     if (!Detail.AlreadyExisting) {
                                    //         var index = this.AddBaggegeDetailsarray.indexOf(Detail);
                                    //         this.AddBaggegeDetailsarray.splice(index, 1);
                                    //     }
                                    // })
                                    _this.AddBaggage();
                                    _this.loaderProgress.hideLoader();
                                }
                            }
                            else {
                                _this.printerResponse();
                            }
                        }
                    }
                }
                else {
                    _this.loaderProgress.hideLoader();
                    Toast.makeText(data.Errors[0].Message).show();
                    if (data.Errors != null && data.Errors.length > 0) {
                        if (data.Errors.filter(function (m) { return m.Message.indexOf("BAG TAG PRINT FAILED") >= 0; })) {
                            console.log("nij");
                            _this.AddBaggegeDetailsarray = _this.AddBaggegeDetailsarray.filter(function (m) { return m.AlreadyExisting === true; });
                            // this.AddBaggegeDetailsarray.forEach((Detail, index) => {
                            //     if (!Detail.AlreadyExisting) {
                            //         var index = this.AddBaggegeDetailsarray.indexOf(Detail);
                            //         this.AddBaggegeDetailsarray.splice(index, 1);
                            //     }
                            // })
                            _this.AddBaggage();
                            _this.loaderProgress.hideLoader();
                        }
                    }
                    _this._shared.SetBagTag(null);
                    _this._service.GetPassenger(_this.MultiSegmentPaxArray.Segment[_this.index].Passenger[0].OrderID)
                        .subscribe(function (data) {
                        _this._shared.SetPassenger(data);
                        var scTable = _this._shared.GetStartupTable().Tables.SecurityCodeTable;
                        _this.MultiSegmentPaxArray = index_4.Converters.ConvertToFlightWithPaxTemplate(_this._shared.GetPassenger(), null, scTable, "");
                        _this.MultiSegmentPaxArray.Segment[_this.index].Passenger.forEach(function (paxData, paxIndex) {
                            if (paxData.RPH == _this.PassedPassengerDetail.RPH) {
                                _this.PassedPassengerDetail = paxData;
                                _this.totalweight = paxData.UnitOfMeasureQuantity;
                                _this.totalweightcode = paxData.UnitOfMeasureCode;
                            }
                        });
                        _this.AddBaggegeDetailsarray = [];
                        _this.standardproductsList.push("Standard");
                        _this.getBaggage();
                        _this.enableAddBag = true;
                        if (_this.PassedPassengerDetail != null && _this.PassedPassengerDetail.BagCount == 0) {
                            if (_this._shared.GetBagTag() != null) {
                                _this.AddBag();
                            }
                            else {
                                _this.AddBaggage();
                            }
                        }
                        else {
                            if (_this._shared.GetBagTag() != null) {
                                _this.AddExistingBaggage(_this.PassedPassengerDetail.BaggageInfo);
                                _this.AddBag();
                            }
                            else {
                                _this.AddExistingBaggage(_this.PassedPassengerDetail.BaggageInfo);
                                _this.AddBaggage();
                            }
                        }
                        // this.AddExistingBaggage(this.PassedPassengerDetail.BaggageInfo);
                    }, function (err) {
                        console.log(err);
                        _this.handleServiceError(err);
                        _this.loaderProgress.hideLoader();
                    });
                }
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
                _this._shared.SetBagTag(null);
                // this.AddBaggegeDetailsarray = [];
                _this._service.GetPassenger(_this.MultiSegmentPaxArray.Segment[_this.index].Passenger[0].OrderID)
                    .subscribe(function (data) {
                    _this._shared.SetPassenger(data);
                    var scTable = _this._shared.GetStartupTable().Tables.SecurityCodeTable;
                    _this.MultiSegmentPaxArray = index_4.Converters.ConvertToFlightWithPaxTemplate(_this._shared.GetPassenger(), null, scTable, "");
                    _this.MultiSegmentPaxArray.Segment[_this.index].Passenger.forEach(function (paxData, paxIndex) {
                        if (paxData.RPH == _this.PassedPassengerDetail.RPH) {
                            _this.PassedPassengerDetail = paxData;
                            _this.totalweight = paxData.UnitOfMeasureQuantity;
                            _this.totalweightcode = paxData.UnitOfMeasureCode;
                        }
                    });
                    _this.AddBaggegeDetailsarray = [];
                    _this.standardproductsList.push("Standard");
                    _this.getBaggage();
                    if (_this.PassedPassengerDetail != null && _this.PassedPassengerDetail.BagCount == 0) {
                        if (_this._shared.GetBagTag() != null) {
                            _this.AddBag();
                        }
                        else {
                            _this.AddBaggage();
                        }
                    }
                    else {
                        if (_this._shared.GetBagTag() != null) {
                            _this.AddExistingBaggage(_this.PassedPassengerDetail.BaggageInfo);
                            _this.AddBag();
                        }
                        else {
                            _this.AddExistingBaggage(_this.PassedPassengerDetail.BaggageInfo);
                        }
                    }
                    // this.AddExistingBaggage(this.PassedPassengerDetail.BaggageInfo);
                }, function (err) {
                    console.log(err);
                    _this.handleServiceError(err);
                    _this.loaderProgress.hideLoader();
                });
                _this.loaderProgress.hideLoader();
            }, function () {
                if (_this.refresh) {
                    _this.isContinuebtnEnabled = true;
                    if (_this.Bagtagmessage != " ") {
                        //  alert(message);
                        //   Toast.makeText(message).show();
                        //alert(this.Bagtagmessage);
                    }
                    // this.loaderProgress.hideLoader();
                }
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var endDate = new Date();
            console.log('SearchPaxByOrderID Service --------------- End Date Time : ' + endDate);
            console.log('SearchPaxByOrderID Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(endDate), new Date(endDate)));
        }
        this.navigateButtonEnabled = true;
    };
    BaggageinfoComponent.prototype.PrintEmailService = function (Remakrequest) {
        var _this = this;
        this._printemail.Remarks(Remakrequest).subscribe(function (data) {
            console.log(data);
            _this.printerResponse();
        });
    };
    BaggageinfoComponent.prototype.printerResponse = function () {
        var _this = this;
        if (this.BagtagList.SegmentTravelerInfos != null) {
            this._shared.GetPassenger().SegmentTravelerInfos.forEach(function (element, index) {
                if (element.PassengerRPH == _this.PassedPassengerDetail.RPH) {
                    _this._shared.GetPassenger().SegmentTravelerInfos[index].BaggageInfo = _this.BagtagList.SegmentTravelerInfos[0].BaggageInfo;
                    _this._shared.GetPassenger().SegmentTravelerInfos[index].BaggageInfo.CheckedBagWeightTotal = _this.BagtagList.ManualBagTag.BaggageInfo.CheckedBagWeightTotal;
                    _this._shared.GetPassenger().SegmentTravelerInfos[index].BaggageInfo.UnitOfMeasureQuantity = _this.BagtagList.ManualBagTag.BaggageInfo.CheckedBagWeightTotal;
                }
            });
            // this.SharedBag = this._shared.GetPassenger().SegmentTravelerInfos;
        }
        this.Bagtagmessage = " ";
        if (this.BagtagList.Warnings != null) {
            this.BagtagList.Warnings.forEach(function (msg, Index) {
                //this.Bagtagmessage = this.Bagtagmessage + "  " + msg.Message;
                Toast.makeText(msg.Message).show();
                // Toast.makeText(this.Bagtagmessage).show();
                _this.loaderProgress.hideLoader();
            });
        }
        if (this.refresh) {
            if (this.BagtagList.ManualBagTag != null && this.BagtagList.ManualBagTag.BaggageInfo != null) {
                if (this.BagtagList.ManualBagTag.BaggageInfo.CheckedBagCountTotal != null && this.BagtagList.ManualBagTag.BaggageInfo.CheckedBagCountTotal != 0) {
                    this.PassedPassengerDetail.BaggageInfo = this.BagtagList.ManualBagTag.BaggageInfo;
                    this.AddManualBaggage(this.BagtagList.ManualBagTag.BaggageInfo);
                }
                else {
                    this.AddBaggegeDetailsarray = [];
                    this.AddBaggage();
                }
            }
            else {
                // this.AddBaggegeDetailsarray = [];
                // this.AddBaggage();
                if (this.BagtagList.Errors != null) {
                    Toast.makeText(this.BagtagList.Errors[0].Message).show();
                }
                else {
                    this.AddBaggegeDetailsarray = [];
                }
                //  this.loaderProgress.hideLoader();
            }
        }
        this.cart = false;
        this.Paid = false;
        var scTable = this._shared.GetStartupTable().Tables.SecurityCodeTable;
        var PassengerArray = index_4.Converters.ConvertToFlightWithPaxTemplate(this._shared.GetPassenger(), null, scTable, "");
        console.dir(this._shared.GetPassenger());
        console.dir(PassengerArray);
        if (PassengerArray.Segment.length > 0) {
            PassengerArray.Segment[this.index].Passenger.forEach(function (paxData, paxIndex) {
                if (paxData.RPH == _this.PassedPassengerDetail.RPH) {
                    _this.totalweight = paxData.UnitOfMeasureQuantity;
                    _this.totalweightcode = paxData.UnitOfMeasureCode;
                }
            });
            this.loaderProgress.hideLoader();
        }
        else {
            Toast.makeText("Record Not Found").show();
            this.loaderProgress.hideLoader();
        }
    };
    BaggageinfoComponent.prototype.PrintFail = function (bagtagElement, bagtagList) {
        var _this = this;
        var Remakrequest = index_4.Converters.BluetoothPrinterResponse(bagtagElement, bagtagList, false);
        console.log(JSON.stringify(Remakrequest));
        this._printemail.Remarks(Remakrequest).subscribe(function (data) {
            console.log(data);
            _this.AddBaggegeDetailsarray.forEach(function (Detail, index) {
                if (!Detail.AlreadyExisting) {
                    var index = _this.AddBaggegeDetailsarray.indexOf(Detail);
                    console.log(index);
                    _this.AddBaggegeDetailsarray.splice(index, 1);
                    console.log(_this.AddBaggegeDetailsarray);
                }
            });
            _this.AddBaggage();
            // this._shared.GetPassenger().SegmentTravelerInfos = this.SharedBag;
            _this.loaderProgress.hideLoader();
            // this.printerResponse();
        }, function (error) {
            _this.handleServiceError(error);
            // this.AddBaggegeDetailsarray.forEach((Detail, index) => {
            //     if (!Detail.AlreadyExisting) {
            //         var index = this.AddBaggegeDetailsarray.indexOf(Detail);
            //         this.AddBaggegeDetailsarray.splice(index, 1);
            //     }
            // })
            console.log(error);
            _this.loaderProgress.hideLoader();
        });
    };
    BaggageinfoComponent.prototype.getPrinter = function () {
        if (ApplicationSettings.hasKey("printer")) {
            return ApplicationSettings.getString("printer");
        }
        else {
            return "";
        }
    };
    BaggageinfoComponent.prototype.remove = function (item) {
        var _this = this;
        console.log("inside remove:" + JSON.stringify(this.isRemoveBtnEnabled) + "R:" + JSON.stringify(item.AlreadyExisting));
        console.log("inside remove:" + JSON.stringify(item.status));
        if (this.isRemoveBtnEnabled || !item.AlreadyExisting) {
            if (item.status != "CheckedIn" && item.status != "Pending Delete") {
                var index = this.AddBaggegeDetailsarray.indexOf(item);
                this.AddBaggegeDetailsarray.splice(index, 1);
                if (this.AddBaggegeDetailsarray.filter(function (m) { return m.AlreadyExisting == false; }).length > 0) {
                    this.isButtonEnabled = true;
                }
                else if (this.PassedPassengerDetail.CheckinStatus) {
                    // this.isButtonEnabled = false;
                }
                else {
                    this.isButtonEnabled = true;
                }
                if (this.AddBaggegeDetailsarray.filter(function (m) { return m.status == ''; }).length > 0) {
                    this.enableRemoveBag = false;
                }
                else {
                    this.enableRemoveBag = true;
                }
                if (this.AddBaggegeDetailsarray.filter(function (m) { return m.AlreadyExisting == false; }).length > 0) {
                    this.BagtagElement = index_4.Converters.GetBagTag(this.PassedPassengerDetail, this.FlightInfo, this.AddBaggegeDetailsarray, this.FlightInfo, this.ShortCheckAirportCode);
                    var PassengerList = [];
                    if (this._shared.GetBagTag() != null) {
                        PassengerList = this._shared.GetBagTag();
                    }
                    if (PassengerList.length > 0 && PassengerList.filter(function (m) { return m.RPH == _this.BagtagElement.PassengerList[0].RPH; }).length > 0) {
                        // PassengerList.filter(m => m.RPH == this.BagtagElement.PassengerList[0].RPH)[0] = this.BagtagElement.PassengerList[0]
                        PassengerList.splice(PassengerList.indexOf(PassengerList.filter(function (m) { return m.RPH == _this.BagtagElement.PassengerList[0].RPH; })[0]), 1);
                        PassengerList.push(this.BagtagElement.PassengerList[0]);
                    }
                    else {
                        PassengerList.push(this.BagtagElement.PassengerList[0]);
                    }
                    if (!this.PassedPassengerDetail.CheckinStatus) {
                        this._shared.SetBagTag(PassengerList);
                    }
                }
                else {
                    this._shared.SetBagTag(null);
                }
            }
            else {
                if (this.enableRemoveBag) {
                    this.isRemoveBag = true;
                    this.enableAddBag = false;
                    item.status = "Pending Delete";
                    this.isContinuebtnEnabled = false;
                }
            }
        }
        else {
            if (this.enableRemoveBag) {
                this.isRemoveBag = true;
                item.status = "Pending Delete";
                this.isContinuebtnEnabled = false;
                this.enableAddBag = false;
            }
        }
    };
    BaggageinfoComponent.prototype.removeAll = function () {
        var _this = this;
        this.AddBaggegeDetailsarray.forEach(function (Detail, Index) {
            if (Detail.status != "CheckedIn" && Detail.status != "Pending Delete") {
                var index = _this.AddBaggegeDetailsarray.indexOf(Detail);
                _this.AddBaggegeDetailsarray.splice(index, 1);
                if (_this.AddBaggegeDetailsarray.filter(function (m) { return m.AlreadyExisting == false; }).length > 0) {
                    _this.isButtonEnabled = true;
                }
                else {
                    _this.isButtonEnabled = false;
                }
            }
            // else {
            //     Detail.status = "Pending Delete";
            //     this.isContinuebtnEnabled = false;
            // }
        });
    };
    BaggageinfoComponent.prototype.oversizeCheck = function (args) {
        // args.Oversize = !args.Oversize;
        // if (this.AddBaggegeDetailsarray.filter(m => m.Oversize == true).length > this.FBA) {
        //     Toast.makeText("Maximum number of oversized baggage reached.Extra baggage needs to be transported as cargo.").show();
        //     args.Oversize = false;
        // }
        alert("baggage fees currently not supported - contact check-in desk");
    };
    BaggageinfoComponent.prototype.onopen = function () {
        console.log("Drop Down opened.");
    };
    BaggageinfoComponent.prototype.isItemVisible = function (args) {
        if (args.toString().substr(0, 2) == 'CM' && args.toString().length <= 5) {
            return "visible";
        }
        else
            return "collapsed";
    };
    BaggageinfoComponent.prototype.btnclicked = function (cardType) {
        if (cardType == "Cash") {
            this.cash = true;
            this.dCard = false;
            this.cCard = false;
            this.paymentCardDetails = null;
        }
        else if (cardType == "CCard") {
            this.cash = false;
            this.dCard = false;
            this.cCard = true;
            // let options: ModalDialogOptions = {
            //     viewContainerRef: this.vcRef,
            //     context: [],
            //     fullscreen: false
            // };
            // this._modalService.showModal(PaymentComponent, options)
            //     .then((result) => {
            //         this.paymentCardDetails = result;
            //         this.isButtonEnabled = true;
            //         this.confirm(null);
            //     });
            // this.displayScanOptionDialog();
        }
        else if (cardType == "DCard") {
            this.cash = false;
            this.dCard = true;
            this.cCard = false;
        }
    };
    BaggageinfoComponent.prototype.cartclicked = function (btn) {
        console.log("clicked" + btn);
        if (btn == "2") {
            this.cart = true;
        }
        else
            this.cart = false;
        //    this.visibileVar();
    };
    BaggageinfoComponent.prototype.visibileVar = function () {
        if (this.cart == true) {
            return 'visible';
        }
        else
            return 'collapsed';
    };
    BaggageinfoComponent.prototype.close = function () {
        this.cart = false;
    };
    BaggageinfoComponent.prototype.confirm = function (paymentDatail) {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var RootObject = null;
            RootObject = new index_1.PaymentData.RootObject();
            //RootObject.Segments = [new PaymentData.Segments()];
            // RootObject.Passengers = [new PaymentData.Passengers()];
            // RootObject.Payments = [new PaymentData.Payment()];
            // RootObject.Services = [new PaymentData.Services()];
            RootObject.ReceiptDelivery = new index_1.PaymentData.ReceiptDelivery();
            // var  paymentAddress: PaymentData. PaymentAddress = null;
            // paymentAddress = new PaymentData. PaymentAddress();
            var payment;
            payment = new index_1.PaymentData.Payment();
            var amount = "0";
            var Currency;
            this.AddBaggegeDetailsarray.filter(function (m) { return m.fees != null; }).forEach(function (BaggegeDetail, Detailndex) {
                amount = amount + BaggegeDetail.fees.split(' ')[0];
                Currency = BaggegeDetail.fees.split(' ')[1];
            });
            RootObject.OrderId = this.PassedPassengerDetail.OrderID;
            if (this.paymentCardDetails != null) {
                var cardData = new index_1.PaymentData.Payment();
                cardData.Type = this.paymentCardDetails.paymentType;
                cardData.CardCode = this.paymentCardDetails.cardType;
                cardData.CurrencyCode = Currency;
                cardData.Amount = amount.toString();
                cardData.MaskedCardNumber = this.paymentCardDetails.cardNumber;
                cardData.ApprovalCode = this.paymentCardDetails.cvv;
                cardData.SecurityCode = "";
                cardData.CardIssuerBankID = "MX";
                var month = this.paymentCardDetails.expiryDate;
                var year = this.paymentCardDetails.expiryDate;
                cardData.ExpirationDateMMYY = month.substr(0, 2) + year.substr(2, 6);
                cardData.CardHolderName = this.paymentCardDetails.cardHolder;
                cardData.FirstName = this.PassedPassengerDetail.FirstName;
                cardData.LastName = this.PassedPassengerDetail.LastName;
                cardData.BillingAddress = new index_1.PaymentData.PaymentAddress();
                cardData.BillingAddress.AddressLine = this.paymentCardDetails.address;
                cardData.BillingAddress.City = this.paymentCardDetails.city;
                ;
                cardData.BillingAddress.StateCode = this.paymentCardDetails.state;
                cardData.BillingAddress.PostalCode = this.paymentCardDetails.zipcode;
                cardData.BillingAddress.CountryCode = this.paymentCardDetails.country;
                RootObject.Payments.push(cardData);
            }
            var passenger = new index_1.PaymentData.Passengers();
            passenger.Firstname = this.PassedPassengerDetail.FirstName;
            passenger.Lastname = this.PassedPassengerDetail.LastName;
            passenger.PassengerTypeCode = this.PassedPassengerDetail.PassengerType;
            passenger.RPH = this.PassedPassengerDetail.RPH;
            RootObject.Passengers.push(passenger);
            var segment = new index_1.PaymentData.Segments();
            segment.ArrivalDateTime = moment(this.FlightInfo.ArrivalDateTime).format("YYYY-MM-DD") + "T" + this.FlightInfo.ETA + ":00";
            segment.DepartureDateTime = moment(this.FlightInfo.DepartureDateTime).format("YYYY-MM-DD") + "T" + this.FlightInfo.ETD + ":00";
            var originCode = new index_1.PaymentData.Origin();
            originCode.LocationCode = this.FlightInfo.Origin;
            segment.Origin = originCode;
            var destinationCode = new index_1.PaymentData.Origin();
            destinationCode.LocationCode = this.FlightInfo.Destination;
            segment.Destination = destinationCode;
            segment.RPH = this.FlightInfo.RPH;
            segment.Flight = this.FlightInfo.MarketingFlight;
            segment.OperatingFlight = null;
            segment.HasStopover = true;
            RootObject.Segments.push(segment);
            var serviceDetails = new index_1.PaymentData.Services();
            serviceDetails.selectedService = new index_1.PaymentData.SelectedService();
            serviceDetails.ticketNumber = this.ticketNumber.toString();
            serviceDetails.passengerRPH = this.PassedPassengerDetail.RPH;
            serviceDetails.currencyCode = Currency;
            var rphItem = this.FlightInfo.SegmentRPH;
            serviceDetails.SegmentRPH.push(rphItem);
            serviceDetails.amount = this.totalAmount.toString();
            serviceDetails.EmdTaxes = [];
            serviceDetails.selectedService.EmdType = this.CatalogServiceDetail.SubType;
            serviceDetails.selectedService.IsRefundable = false;
            serviceDetails.selectedService.NoofItems = "1";
            serviceDetails.selectedService.RFISC_code = this.CatalogServiceDetail.RFIC;
            serviceDetails.selectedService.RFISC_subCode = this.CatalogServiceDetail.Code;
            serviceDetails.selectedService.SSRCode = this.CatalogServiceDetail.SSRCode;
            serviceDetails.selectedService.TypeOfService = this.CatalogServiceDetail.ServiceCode;
            serviceDetails.selectedService.commercialName = this.CatalogServiceDetail.Name;
            RootObject.Services.push(serviceDetails);
            RootObject.ReceiptDelivery.gateway = "EMAIL";
            RootObject.ReceiptDelivery.LanguageID = null;
            RootObject.ReceiptDelivery.Name = this.PassedPassengerDetail.Firstname;
            var emailId = new index_1.PaymentData.Email();
            emailId.emailAddress = "noreply@hpe.com";
            RootObject.ReceiptDelivery.email.push(emailId);
            RootObject.ReceiptDelivery.phonenumber = null;
            RootObject.ReceiptDelivery.printerAddress = "";
            console.dir(RootObject);
            this.loaderProgress.hideLoader();
            this._paymentService.PostPayment(RootObject, "")
                .subscribe(function (data) {
                if (data.Success != false) {
                    console.log(JSON.stringify(data));
                    var result = data;
                    if (result.PassengerDocuments[0].PassengerDocument[0].Status == "Issued") {
                        _this.Paid = true;
                        _this.loaderProgress.hideLoader();
                        _this.BagtagElement = index_4.Converters.GetBagTag(_this.PassedPassengerDetail, _this.FlightInfo, _this.AddBaggegeDetailsarray, _this.FlightInfo, _this.ShortCheckAirportCode);
                        _this.BagTag();
                        _this.totalAmount = 0;
                        _this.AmountArray = [];
                        _this.isEnabled = false;
                        _this.cash = false;
                        _this.cCard = false;
                        _this.cart = false;
                        _this.isCartButtonEnabled = false;
                        // this.totalAmount = 0;
                    }
                }
                else {
                    Toast.makeText(data.ErrorMessage).show();
                }
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
                //alert("sucess");
            });
            this.loaderProgress.hideLoader();
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    };
    BaggageinfoComponent.prototype.checkPayment = function () {
        if (this.Paid == true) {
            //this.BagTag();
            this.isButtonEnabled = false;
            return 'visible';
        }
        else
            return 'collapsed';
    };
    // public listviewLoaded() {
    //     console.log("listview loaded ");
    //     var that = this;
    //     setTimeout(function () {
    //         var listView: View = <StackLayout>that.page.getViewById("lv");
    //         // var listView = this.lv.nativeElement;
    //         var index = that.AddBaggegeDetailsarray.length - 1;
    //         console.log(index);
    //         listView[index].focus();
    //     }, 1);
    // }
    BaggageinfoComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    BaggageinfoComponent.prototype.handleServiceError = function (error) {
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
    BaggageinfoComponent.prototype.navigateToCompensation = function () {
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
    var BaggageinfoComponent_1;
    BaggageinfoComponent.BAGGAGECHECK = "Kindly Add or Delete Baggage Details";
    BaggageinfoComponent.BAGGAGEPAID = "PAID";
    __decorate([
        core_1.ViewChild('pagecontainer'),
        __metadata("design:type", core_1.ElementRef)
    ], BaggageinfoComponent.prototype, "pageCont", void 0);
    __decorate([
        core_1.ViewChild('lv'),
        __metadata("design:type", core_1.ElementRef)
    ], BaggageinfoComponent.prototype, "lv", void 0);
    __decorate([
        core_1.ViewChild('baggageScroller'),
        __metadata("design:type", core_1.ElementRef)
    ], BaggageinfoComponent.prototype, "baggageScroller", void 0);
    __decorate([
        core_1.ViewChild('baggageContainer'),
        __metadata("design:type", core_1.ElementRef)
    ], BaggageinfoComponent.prototype, "baggageContainer", void 0);
    BaggageinfoComponent = BaggageinfoComponent_1 = __decorate([
        core_1.Component({
            selector: "baggageinfo-app",
            providers: [index_2.DataService, index_2.PassengerService, app_constants_1.Configuration, index_2.PrintEmailService, index_2.PaymentService, index_2.CheckinService],
            templateUrl: "components/baggageinfo/baggageinfo.component.html",
            styleUrls: ["components/baggageinfo/baggageinfo.component.css"],
        }),
        __metadata("design:paramtypes", [index_2.PrintEmailService, index_2.CheckinService, app_constants_1.Configuration, page_1.Page, index_2.TimeOutService, router_2.RouterExtensions, index_2.DataService, router_1.Router, common_1.Location, router_1.ActivatedRoute, modal_dialog_1.ModalDialogService,
            core_1.ViewContainerRef, index_2.CheckinOrderService, index_2.PassengerService, index_2.PaymentService])
    ], BaggageinfoComponent);
    return BaggageinfoComponent;
}());
exports.BaggageinfoComponent = BaggageinfoComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFnZ2FnZWluZm8uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFnZ2FnZWluZm8uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLHNDQUEyRjtBQUMzRiwwQ0FBMkU7QUFDM0UsMENBQTRDO0FBQzVDLDBDQUEyQztBQUMzQyxzREFBK0Q7QUFDL0Qsa0VBQTJGO0FBQzNGLGdDQUErQjtBQUMvQixvQ0FBdUM7QUFNdkMsZ0VBQTJEO0FBQzNELGdDQUFrQztBQUNsQyxnREFBa0Q7QUFFbEQsOEJBQThCO0FBQzlCLDBEQUE0RDtBQUM1RCwwQ0FBNEM7QUFDNUMsK0JBQWlDO0FBQ2pDLHlEQUF5RDtBQUV6RCxnQkFBZ0I7QUFDaEIsa0RBQXdFO0FBQ3hFLHFEQUFvSztBQUNwSyxzREFBNEk7QUFFNUksa0RBQXNEO0FBQ3RELGdGQUE4RTtBQUM5RSxxREFBb0Q7QUFDcEQsNkRBQTJEO0FBRzNELElBQUksaUJBQXNDLENBQUE7QUFRMUM7SUEwRkksOEJBQW1CLFdBQThCLEVBQVMsUUFBd0IsRUFBVSxjQUE2QixFQUFVLElBQVUsRUFBUyxlQUErQixFQUFVLGdCQUFrQyxFQUFTLFlBQXlCLEVBQVUsTUFBYyxFQUFVLFFBQWtCLEVBQVUsZUFBK0IsRUFBVSxhQUFpQyxFQUMvWCxLQUF1QixFQUFTLE9BQTRCLEVBQVMsUUFBMEIsRUFBUyxlQUErQjtRQURoSSxnQkFBVyxHQUFYLFdBQVcsQ0FBbUI7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFnQjtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFTLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBYTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQVUsb0JB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QztJQUxuRCxvQkFBb0I7UUFOaEMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsU0FBUyxFQUFFLENBQUMsbUJBQVcsRUFBRSx3QkFBZ0IsRUFBRSw2QkFBYSxFQUFFLHlCQUFpQixFQUFFLHNCQUFjLEVBQUUsc0JBQWMsQ0FBQztZQUM1RyxXQUFXLEVBQUUsbURBQW1EO1lBQ2hFLFNBQVMsRUFBRSxDQUFDLGtEQUFrRCxDQUFDO1NBQ2xFLENBQUM7eUNBMkZrQyx5QkFBaUIsRUFBbUIsc0JBQWMsRUFBMEIsNkJBQWEsRUFBZ0IsV0FBSSxFQUEwQixzQkFBYyxFQUE0Qix5QkFBZ0IsRUFBdUIsbUJBQVcsRUFBa0IsZUFBTSxFQUFvQixpQkFBUSxFQUEyQix1QkFBYyxFQUF5QixpQ0FBa0I7WUFDeFgsdUJBQWdCLEVBQWtCLDJCQUFtQixFQUFtQix3QkFBZ0IsRUFBMEIsc0JBQWM7T0EzRjFJLG9CQUFvQixDQSsxRWhDO0lBQUQsMkJBQUM7Q0FBQSxBQS8xRUQsSUErMUVDO0FBLzFFWSxvREFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvL2FuZ3VsYXIgJiBuYXRpdmVzY3JpcHQgcmVmZXJlbmNlc1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uRXh0cmFzLCBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCAqIGFzIGltYWdlTW9kdWxlIGZyb20gXCJpbWFnZS1zb3VyY2VcIjtcclxuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XHJcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7IE1vZGFsRGlhbG9nU2VydmljZSwgTW9kYWxEaWFsb2dPcHRpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL21vZGFsLWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcclxuaW1wb3J0IGRpYWxvZ3MgPSByZXF1aXJlKFwidWkvZGlhbG9nc1wiKTtcclxuaW1wb3J0IHsgU2Nyb2xsVmlldyB9IGZyb20gXCJ1aS9zY3JvbGwtdmlld1wiO1xyXG5pbXBvcnQgeyBMaXN0VmlldyB9IGZyb20gXCJ1aS9saXN0LXZpZXdcIjtcclxuaW1wb3J0IHsgVmlldyB9IGZyb20gXCJ1aS9jb3JlL3ZpZXdcIjtcclxuaW1wb3J0IHRleHRGaWVsZCA9IHJlcXVpcmUoXCJ1aS90ZXh0LWZpZWxkXCIpO1xyXG5pbXBvcnQgKiBhcyBnZXN0dXJlcyBmcm9tIFwidWkvZ2VzdHVyZXNcIjtcclxuaW1wb3J0IHsgUGVyY2VudExlbmd0aCB9IGZyb20gXCJ1aS9zdHlsaW5nL3N0eWxlLXByb3BlcnRpZXNcIlxyXG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZmlsZS1zeXN0ZW1cIjtcclxuaW1wb3J0ICogYXMgemVicmEgZnJvbSBcIm5hdGl2ZXNjcmlwdC1wcmludC16ZWJyYVwiO1xyXG5cclxuLy9leHRlcm5hbCBtb2R1bGVzIGFuZCBwbHVnaW5zXHJcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCAqIGFzIFRvYXN0IGZyb20gJ25hdGl2ZXNjcmlwdC10b2FzdCc7XHJcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tIFwibW9tZW50XCI7XHJcbi8vIGltcG9ydCB7IHNjYW5DYXJkQ2xpY2tlZCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtY2FyZGlvXCI7XHJcblxyXG4vL2FwcCByZWZlcmVuY2VzXHJcbmltcG9ydCB7IE9yZGVyLCBJbnZlbnRvcnksIFBheW1lbnREYXRhIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9tb2RlbC9pbmRleFwiXHJcbmltcG9ydCB7IERhdGFTZXJ2aWNlLCBDaGVja2luT3JkZXJTZXJ2aWNlLCBQYXNzZW5nZXJTZXJ2aWNlLCBQcmludEVtYWlsU2VydmljZSwgUGF5bWVudFNlcnZpY2UsIFRpbWVPdXRTZXJ2aWNlLCBDaGVja2luU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvaW5kZXhcIjtcclxuaW1wb3J0IHsgYmFnZ2FnZVRlbXBsYXRlLCBQYXhUZW1wbGF0ZSwgTG9hZGVyUHJvZ3Jlc3MsIG9yZGVyLCBPdXRCb3VuZCwgSW5Cb3VuZCwgTXVsdGlTZWdtZW50VGVtcGxhdGUgfSBmcm9tICcuLi8uLi9zaGFyZWQvaW50ZXJmYWNlL2luZGV4JztcclxuaW1wb3J0IHsgUGF5bWVudENvbXBvbmVudCB9IGZyb20gXCIuLi8uLi9jb21wb25lbnRzL3BheW1lbnQvcGF5bWVudC1tb2RhbFwiXHJcbmltcG9ydCB7IENvbnZlcnRlcnMgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCB7IENoZWNrSW5Db21wb25lbnQgfSBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9jaGVja2luL2NoZWNraW4uY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi8uLi9hcHAuY29uc3RhbnRzJztcclxuaW1wb3J0IHsgQXBwRXhlY3V0aW9udGltZSB9IGZyb20gXCIuLi8uLi9hcHAuZXhlY3V0aW9udGltZVwiO1xyXG5pbXBvcnQgeyBTdGFja0xheW91dCB9IGZyb20gXCJ1aS9sYXlvdXRzL3N0YWNrLWxheW91dFwiO1xyXG5cclxudmFyIHBhc3N3b3JkVGV4dEZpZWxkOiB0ZXh0RmllbGQuVGV4dEZpZWxkXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiBcImJhZ2dhZ2VpbmZvLWFwcFwiLFxyXG4gICAgcHJvdmlkZXJzOiBbRGF0YVNlcnZpY2UsIFBhc3NlbmdlclNlcnZpY2UsIENvbmZpZ3VyYXRpb24sIFByaW50RW1haWxTZXJ2aWNlLCBQYXltZW50U2VydmljZSwgQ2hlY2tpblNlcnZpY2VdLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwiY29tcG9uZW50cy9iYWdnYWdlaW5mby9iYWdnYWdlaW5mby5jb21wb25lbnQuaHRtbFwiLFxyXG4gICAgc3R5bGVVcmxzOiBbXCJjb21wb25lbnRzL2JhZ2dhZ2VpbmZvL2JhZ2dhZ2VpbmZvLmNvbXBvbmVudC5jc3NcIl0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBCYWdnYWdlaW5mb0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gICAgQFZpZXdDaGlsZCgncGFnZWNvbnRhaW5lcicpIHBhZ2VDb250OiBFbGVtZW50UmVmO1xyXG4gICAgQFZpZXdDaGlsZCgnbHYnKSBsdjogRWxlbWVudFJlZjtcclxuICAgIEBWaWV3Q2hpbGQoJ2JhZ2dhZ2VTY3JvbGxlcicpIGJhZ2dhZ2VTY3JvbGxlcjogRWxlbWVudFJlZjtcclxuICAgIEBWaWV3Q2hpbGQoJ2JhZ2dhZ2VDb250YWluZXInKSBiYWdnYWdlQ29udGFpbmVyOiBFbGVtZW50UmVmO1xyXG5cclxuICAgIGlzRXJyb3I6IGJvb2xlYW47XHJcbiAgICBlcnJvck1lc3NhZ2U6IHN0cmluZztcclxuICAgIHB1YmxpYyBDYXJkTnVtYmVyOiBhbnk7XHJcbiAgICBwdWJsaWMgY3Z2OiBhbnk7XHJcbiAgICBwdWJsaWMgZXhwaXJ5TW9udGg6IGFueTtcclxuICAgIHB1YmxpYyBleHBpcnlZZWFyOiBhbnk7XHJcbiAgICBwdWJsaWMgYnRuTGlzdDogQXJyYXk8YW55PjtcclxuICAgIHB1YmxpYyBjb3VudCA9IDA7XHJcbiAgICBwdWJsaWMgY2FzaDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGRDYXJkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgY0NhcmQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBjYXJ0OiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBwcmljZTogYW55O1xyXG4gICAgcHVibGljIGJhZ2dhZ2VjYXRhbG9nOiBhbnk7XHJcbiAgICBwdWJsaWMgY29udmVyOiBDb252ZXJ0ZXJzO1xyXG4gICAgcHVibGljIFBhc3NlbmdlckFycmF5OiBBcnJheTxQYXhUZW1wbGF0ZT4gPSBbXTtcclxuICAgIHB1YmxpYyBQYXNzZW5nZXJEOiBvcmRlcjtcclxuICAgIHB1YmxpYyBzZWFyY2hTdHJpbmc6IGFueTtcclxuICAgIHB1YmxpYyBzdGFuZGFyZHByb2R1Y3RzOiBBcnJheTxhbnk+ID0gW107XHJcbiAgICBwdWJsaWMgY2F0YWxvZ3Byb2R1Y3RzOiBBcnJheTxhbnk+ID0gW107XHJcbiAgICBwdWJsaWMgc3RhbmRhcmRwcm9kdWN0c0xpc3Q6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuICAgIHB1YmxpYyBjYXRhbG9ncHJvZHVjdHNMaXN0OiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICBwdWJsaWMgbG9hZGVyUHJvZ3Jlc3M6IExvYWRlclByb2dyZXNzO1xyXG4gICAgcHVibGljIEJhZ3RhZ0VsZW1lbnQ6IGFueTtcclxuICAgIHB1YmxpYyBCYWd0YWdMaXN0OiBhbnk7XHJcbiAgICBwdWJsaWMgcmVmcmVzaDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzQ29udGludWVidG5FbmFibGVkID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgQmFndGFnbWVzc2FnZTogc3RyaW5nID0gXCIgXCI7XHJcbiAgICBwdWJsaWMgQWRkQmFnZ2VnZURldGFpbHNhcnJheTogQXJyYXk8YmFnZ2FnZVRlbXBsYXRlLkFkZEJhZ2dlZ2VEZXRhaWxzPiA9IFtdO1xyXG4gICAgcHVibGljIEJhZ2dhZ2VEZXRhaWxhcnJheTogQXJyYXk8YmFnZ2FnZVRlbXBsYXRlLkJhZ2dhZ2VEZXRhaWw+ID0gW107XHJcbiAgICBwdWJsaWMgYmFnc1RvUHJpY2VzOiBiYWdnYWdlVGVtcGxhdGUuQmFnc1RvUHJpY2VzID0gbnVsbDtcclxuICAgIHB1YmxpYyBGbGlnaHRTZWdtZW50OiBhbnlbXTtcclxuICAgIHB1YmxpYyBQYXNzZW5nZXI6IGFueVtdO1xyXG4gICAgcHVibGljIFByaWNpbmdJbmZvOiBhbnlbXTtcclxuICAgIHB1YmxpYyBQTlI6IGFueTtcclxuICAgIHB1YmxpYyB1c2VyZGV0YWlsczogYW55O1xyXG4gICAgcHVibGljIHRvdGFsQW1vdW50OiBhbnkgPSAwO1xyXG4gICAgcHVibGljIEFtb3VudEFycmF5OiBBcnJheTxudW1iZXI+ID0gW107XHJcbiAgICBwdWJsaWMgZGF0ZTogYW55O1xyXG4gICAgcHVibGljIFBhaWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBpdGVtczogQXJyYXk8c3RyaW5nPjtcclxuICAgIHB1YmxpYyBwcm9kdWN0aXRlbXM6IEFycmF5PHN0cmluZz47XHJcbiAgICBwdWJsaWMgdGFnaXRlbXM6IEFycmF5PHN0cmluZz47XHJcbiAgICBwdWJsaWMgc2VsZWN0ZWRwcm9kdWN0OiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgd2VpZ2h0OiBBcnJheTxib29sZWFuPiA9IFtmYWxzZV07XHJcbiAgICBwdWJsaWMgVGFnOiBBcnJheTxib29sZWFuPiA9IFtmYWxzZV07XHJcbiAgICBwdWJsaWMgdG90YWx3ZWlnaHQ6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgdG90YWx3ZWlnaHRjb2RlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgaXNiYWdFeGlzdDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzUmVtb3ZlQnRuRW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgRkJBOiBhbnk7XHJcbiAgICBwdWJsaWMgT3ZlcnNpemU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBPdmVyc2l6ZUNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIG1heEJhZ0NvdW50OiBudW1iZXIgPSA5OTk7XHJcbiAgICBwdWJsaWMgYmFnQ291bnQ6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgZW5hYmxlUmVtb3ZlQmFnOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGlzQnV0dG9uRW5hYmxlZDogYm9vbGVhbjtcclxuICAgIGlzQ2FydEJ1dHRvbkVuYWJsZWQgPSBmYWxzZTtcclxuICAgIHB1YmxpYyBwYXltZW50Q2FyZERldGFpbHM6IGFueTtcclxuICAgIHB1YmxpYyBTaG9ydENoZWNrQWlycG9ydENvZGU6IGFueSA9IFwiXCI7XHJcbiAgICBwdWJsaWMgU2hvcnRDaGVja1JlcXVpcmVkOiBib29sZWFuO1xyXG4gICAgUGFzc2VkUGFzc2VuZ2VyRGV0YWlsOiBhbnk7XHJcbiAgICBwdWJsaWMgaXNSZW1vdmVCYWc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBlbmFibGVBZGRCYWc6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIGlzQ29tcGVuc2F0aW9uRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGZpbHRlcmFyZ3MgPSB7XHJcbiAgICAgICAgXCJPcmlnaW4uQWlycG9ydENvZGVcIjogJ1BUWSdcclxuICAgIH07XHJcbiAgICBwdWJsaWMgRmxpZ2h0SW5mbzogTXVsdGlTZWdtZW50VGVtcGxhdGUuRmxpZ2h0V2l0aFBheCA9IG5ldyBNdWx0aVNlZ21lbnRUZW1wbGF0ZS5GbGlnaHRXaXRoUGF4O1xyXG4gICAgcHVibGljIE11bHRpU2VnbWVudFBheEFycmF5OiBNdWx0aVNlZ21lbnRUZW1wbGF0ZS5Sb290T2JqZWN0ID0gbmV3IE11bHRpU2VnbWVudFRlbXBsYXRlLlJvb3RPYmplY3Q7XHJcbiAgICBwdWJsaWMgaW5kZXg6IGFueTtcclxuICAgIGlzRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIENhdGFsb2dTZXJ2aWNlRGV0YWlsOiBhbnk7XHJcbiAgICBwdWJsaWMgdGlja2V0TnVtYmVyOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgaXNDaGVja2luRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBpc0dhdGVEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIG5hdmlnYXRlQnV0dG9uRW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgc3RhdGljIEJBR0dBR0VDSEVDSzogc3RyaW5nID0gXCJLaW5kbHkgQWRkIG9yIERlbGV0ZSBCYWdnYWdlIERldGFpbHNcIlxyXG4gICAgcHVibGljIHN0YXRpYyBCQUdHQUdFUEFJRDogc3RyaW5nID0gXCJQQUlEXCJcclxuICAgIHB1YmxpYyBTaGFyZWRCYWc6IGFueTtcclxuICAgIHB1YmxpYyBGbGlnaHREYXRlOiBhbnk7XHJcbiAgICBwdWJsaWMgQmFnZ2FnZUluZm86IGFueTtcclxuICAgIHB1YmxpYyBpc1Nob3J0Q2hlY2sgOmJvb2xlYW47XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgX3ByaW50ZW1haWw6IFByaW50RW1haWxTZXJ2aWNlLCBwdWJsaWMgX2NoZWNraW46IENoZWNraW5TZXJ2aWNlLCBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uLCBwcml2YXRlIHBhZ2U6IFBhZ2UsIHB1YmxpYyBfdGltZW91dFNlcnZpY2U6IFRpbWVPdXRTZXJ2aWNlLCBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMsIHB1YmxpYyBfZGF0YVNlcnZpY2U6IERhdGFTZXJ2aWNlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIGxvY2F0aW9uOiBMb2NhdGlvbiwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZXI6IEFjdGl2YXRlZFJvdXRlLCBwcml2YXRlIF9tb2RhbFNlcnZpY2U6IE1vZGFsRGlhbG9nU2VydmljZSxcclxuICAgICAgICBwcml2YXRlIHZjUmVmOiBWaWV3Q29udGFpbmVyUmVmLCBwdWJsaWMgX3NoYXJlZDogQ2hlY2tpbk9yZGVyU2VydmljZSwgcHVibGljIF9zZXJ2aWNlOiBQYXNzZW5nZXJTZXJ2aWNlLCBwdWJsaWMgX3BheW1lbnRTZXJ2aWNlOiBQYXltZW50U2VydmljZSkge1xyXG5cclxuICAgICAgICB0aGlzLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5idG5MaXN0ID0gW1wiMVwiXTtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzID0gbmV3IExvYWRlclByb2dyZXNzKCk7XHJcbiAgICAgICAgdGhpcy5wcm9kdWN0aXRlbXMgPSBbXTtcclxuICAgICAgICB0aGlzLnByb2R1Y3RpdGVtcy5wdXNoKFwiU3RhbmRhcmRcIik7XHJcbiAgICAgICAgdGhpcy5wcm9kdWN0aXRlbXMucHVzaChcIkNhdGFsb2dcIik7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZHByb2R1Y3QgPSBcIlNlbGVjdCBQcm9kdWN0XCI7XHJcbiAgICAgICAgdGhpcy50YWdpdGVtcyA9IFtdO1xyXG4gICAgICAgIHRoaXMudGFnaXRlbXMucHVzaChcIkF1dG9cIik7XHJcbiAgICAgICAgdGhpcy50YWdpdGVtcy5wdXNoKFwiTWFudWFsXCIpO1xyXG4gICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaW5pdExvYWRlcih0aGlzLnBhZ2VDb250KTtcclxuICAgICAgICB0aGlzLmFjdGl2YXRlZFJvdXRlci5xdWVyeVBhcmFtcy5zdWJzY3JpYmUoKHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbCA9IEpTT04ucGFyc2UocGFyYW1zW1wiZGF0YVwiXSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsKVxyXG4gICAgICAgICAgICB0aGlzLmJhZ2dhZ2VjYXRhbG9nID0gSlNPTi5wYXJzZShwYXJhbXNbXCJiYWdnYWdlY2F0YWxvZ1wiXSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5DaGVja2luU3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzUmVtb3ZlQnRuRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuaXNCdXR0b25FbmFibGVkKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuaXNCdXR0b25FbmFibGVkKVxyXG4gICAgICAgICAgICBjb25zb2xlLmRpcih0aGlzLmJhZ2dhZ2VjYXRhbG9nKTtcclxuICAgICAgICAgICAgdGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNoZWNraW5EaXNhYmxlZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5pc0dhdGVEaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImdhdGVEaXNhYmxlZFwiKTtcclxuICAgICAgICAgICAgLy8gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheSA9IEpTT04ucGFyc2UocGFyYW1zW1wibXVsdGlTZWdtZW50UGF4QXJyYXlcIl0pO1xyXG4gICAgICAgICAgICB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5ID0gdGhpcy5fc2hhcmVkLkdldFNlZ21lbnREZXRhaWwoKTtcclxuICAgICAgICAgICAgdGhpcy5pbmRleCA9IEpTT04ucGFyc2UocGFyYW1zW1wiY3VycmVudFBhZ2VcIl0pO1xyXG4gICAgICAgICAgICB0aGlzLnRpY2tldE51bWJlciA9IEpTT04ucGFyc2UocGFyYW1zW1widGlja2V0TnVtYmVyXCJdKTtcclxuICAgICAgICAgICAgdGhpcy5TaG9ydENoZWNrQWlycG9ydENvZGUgPSBKU09OLnBhcnNlKHBhcmFtc1tcInNob3J0Y2hlY2tpblwiXSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTaG9ydENoZWNrPSBwYXJhbXNbXCJpc1Nob3J0Q2hlY2tcIl07XHJcbiAgICAgICAgICAgIHRoaXMuaXNDb21wZW5zYXRpb25FbmFibGVkID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiY29tcGVuc2F0aW9uRW5hYmxlZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5CYWdnYWdlSW5mbyA9IHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKS5TZWdtZW50VHJhdmVsZXJJbmZvcy5maWx0ZXIobSA9PiBtLlNlZ21lbnRSUEggPT0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlJQSCAmJiBtLlBhc3NlbmdlclJQSCA9PSB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5SUEgpWzBdLkJhZ2dhZ2VJbmZvO1xyXG4gICAgICAgICAgICB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnQuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLk1hcmtldGluZ0ZsaWdodCA9PSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uTWFya2V0aW5nRmxpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5GbGlnaHRJbmZvID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuRmxpZ2h0RGF0ZSA9IG1vbWVudCh0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uRmxpZ2h0RGF0ZSkuZm9ybWF0KFwiREQtTU1NLVlZWVlcIik7XHJcbiAgICAgICAgICAgIHRoaXMuRmxpZ2h0SW5mby5QYXNzZW5nZXIuZm9yRWFjaCgocGF4RGF0YSwgcGF4SW5kZXgpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGF4RGF0YS5SUEggPT0gdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuUlBIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbHdlaWdodCA9IHBheERhdGEuVW5pdE9mTWVhc3VyZVF1YW50aXR5O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWx3ZWlnaHRjb2RlID0gcGF4RGF0YS5Vbml0T2ZNZWFzdXJlQ29kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMudXNlcmRldGFpbHMgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcInVzZXJkZXRhaWxzXCIsIFwiXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGUgPSBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KFwiREQgTU1NIFlZWVlcIik7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc3RhbmRhcmRwcm9kdWN0c0xpc3QucHVzaChcIlN0YW5kYXJkXCIpO1xyXG4gICAgICAgIHRoaXMuZ2V0QmFnZ2FnZSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwgIT0gbnVsbCAmJiB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5CYWdDb3VudCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zaGFyZWQuR2V0QmFnVGFnKCkgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5BZGRCYWcoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuQWRkQmFnZ2FnZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NoYXJlZC5HZXRCYWdUYWcoKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkFkZEV4aXN0aW5nQmFnZ2FnZSh0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5CYWdnYWdlSW5mbyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkFkZEJhZygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5BZGRFeGlzdGluZ0JhZ2dhZ2UodGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuQmFnZ2FnZUluZm8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsYWJlbCA9IHRoaXMucGFnZUNvbnQubmF0aXZlRWxlbWVudFxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBsYWJlbC5vbihcImxvYWRlZCwgdGFwLCBsb25nUHJlc3MsIHN3aXBlLCBuZ01vZGVsQ2hhbmdlXCIsIGZ1bmN0aW9uIChhcmdzOiBnZXN0dXJlcy5HZXN0dXJlRXZlbnREYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXZlbnQ6IFwiICsgYXJncy5ldmVudE5hbWUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLl90aW1lb3V0U2VydmljZS50aW1lcik7XHJcbiAgICAgICAgICAgIHNlbGYuX3RpbWVvdXRTZXJ2aWNlLnJlc2V0V2F0Y2goKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5TaGFyZWRCYWcgPSB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCk7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICB9XHJcbiAgICBBZGRCYWcoKSB7XHJcbiAgICAgICAgdGhpcy5lbmFibGVBZGRCYWcgPSB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLl9zaGFyZWQuR2V0QmFnVGFnKCkuZmlsdGVyKG0gPT4gbS5SUEggPT0gdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuUlBIKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5HZXRCYWdUYWcoKS5maWx0ZXIobSA9PiBtLlJQSCA9PSB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5SUEgpWzBdLkNoZWNrZWRCYWdzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LkJhZ2dhZ2VJbmZvLkJhZ1RhZ0RldGFpbHMuZm9yRWFjaCgoYmFnRWxlbWVudCwgQmFnaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWRkQmFnZ2VnZURldGFpbHM6IGJhZ2dhZ2VUZW1wbGF0ZS5BZGRCYWdnZWdlRGV0YWlscyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMgPSBuZXcgYmFnZ2FnZVRlbXBsYXRlLkFkZEJhZ2dlZ2VEZXRhaWxzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuYmFnVGFnID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBhZGRCYWdnZWdlRGV0YWlscy53ZWlnaHQgPSBiYWdFbGVtZW50LldlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBhZGRCYWdnZWdlRGV0YWlscy53ZWlnaHRVbml0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBhZGRCYWdnZWdlRGV0YWlscy50YWdOdW1iZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLmZlZXMgPSBiYWdFbGVtZW50LmZlc3M7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuZGVzdGluYXRpb24gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLnN0YW5kYXJkID0gYmFnRWxlbWVudC5pc1N0YW5kYXJkO1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLmNhdGFsb2cgPSAhYmFnRWxlbWVudC5pc1N0YW5kYXJkO1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLmF1dG8gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLm1hbnVhbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLnN0YXR1cyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuU3RkUHJvZHVjdCA9IGFkZEJhZ2dlZ2VEZXRhaWxzLnN0YW5kYXJkID8gYmFnRWxlbWVudC5wcm9kdWN0RGVzY3JpcHRpb24gOiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLkNvZGUgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLkN0bGdQcm9kdWN0ID0gYWRkQmFnZ2VnZURldGFpbHMuc3RhbmRhcmQgPyBcIlwiIDogYmFnRWxlbWVudC5wcm9kdWN0RGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuQWxyZWFkeUV4aXN0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuc2VsZWN0ZWRwcm9kdWN0ID0gXCJTZWxlY3QgcHJvZHVjdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDb250aW51ZWJ0bkVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkucHVzaChhZGRCYWdnZWdlRGV0YWlscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICg7IHRoaXMuY291bnQgPCAxOyB0aGlzLmNvdW50KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idG5MaXN0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnRuOiBcIjJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc2JhZ0V4aXN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzY3JWaWV3ID0gPFNjcm9sbFZpZXc+dGhpcy5iYWdnYWdlU2Nyb2xsZXIubmF0aXZlRWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY29udFZpZXcgPSA8U3RhY2tMYXlvdXQ+dGhpcy5iYWdnYWdlQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NyVmlldy5zY3JvbGxUb1ZlcnRpY2FsT2Zmc2V0KFBlcmNlbnRMZW5ndGgudG9EZXZpY2VQaXhlbHMoY29udFZpZXcuaGVpZ2h0KSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuQWRkQmFnZ2FnZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBvbkNvbnRpbnVlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBsZXQgb3JkZXJJZDogc3RyaW5nID0gc2VsZi5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuT3JkZXJJRDtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsKVxyXG4gICAgICAgICAgICBjb25zb2xlLmRpcih0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCkuU2VnbWVudFRyYXZlbGVySW5mb3MpO1xyXG4gICAgICAgIGlmICghdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuQ2hlY2tpblN0YXR1cykge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgc2VsZi5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImNoZWNraW5cIl0sIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcImRhdGFcIjogb3JkZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICBcImluZGV4XCI6IHRoaXMuaW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzaG9ydGNoZWNraW5cIjogdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuU2hvcnRDaGVja0FpcnBvcnRDb2RlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuR2V0T3JkZXJEZXRhaWxzKG9yZGVySWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBjYW5jZWwoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGxldCBvcmRlcklkOiBzdHJpbmcgPSBzZWxmLlBhc3NlZFBhc3NlbmdlckRldGFpbC5PcmRlcklEO1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZC5TZXRCYWdUYWcobnVsbCk7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgc2VsZi5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImNoZWNraW5cIl0sIHtcclxuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBxdWVyeVBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgXCJkYXRhXCI6IG9yZGVySWQsXHJcbiAgICAgICAgICAgICAgICBcImluZGV4XCI6IHRoaXMuaW5kZXhcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIEdldE9yZGVyRGV0YWlscyhpZDogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgUGFzc2VuZ2VyIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UuR2V0UGFzc2VuZ2VyKGlkKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5TdWNjZXNzICE9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRQYXNzZW5nZXIoPE9yZGVyLlJvb3RPYmplY3Q+ZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzY1RhYmxlOiBhbnlbXSA9IHRoaXMuX3NoYXJlZC5HZXRTdGFydHVwVGFibGUoKS5UYWJsZXMuU2VjdXJpdHlDb2RlVGFibGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBQYXNzZW5nZXJBcnJheTogYW55ID0gQ29udmVydGVycy5Db252ZXJ0VG9GbGlnaHRXaXRoUGF4VGVtcGxhdGUodGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpLCBudWxsLCBzY1RhYmxlLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFBhc3NlbmdlckFycmF5LlNlZ21lbnQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNldGRlcGFydHVyZURhdGU6IHN0cmluZyA9IG1vbWVudChQYXNzZW5nZXJBcnJheS5TZWdtZW50WzBdLkRlcGFydHVyZURhdGVUaW1lLnRvU3RyaW5nKCkpLmZvcm1hdChcIllZWVktTU0tRERcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2V0ZmxpZ2h0bnVtYmVyOiBzdHJpbmcgPSBQYXNzZW5nZXJBcnJheS5TZWdtZW50WzBdLk1hcmtldGluZ0ZsaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZXRjaXR5OiBzdHJpbmcgPSBQYXNzZW5nZXJBcnJheS5TZWdtZW50WzBdLkRlcGFydHVyZUNpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY2hlY2tpblwiXSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWdnYWdlXCI6IGlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImluZGV4XCI6IHRoaXMuaW5kZXhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBhc3NlbmdlckFycmF5LlNlZ21lbnQuZm9yRWFjaCgoU2VnRWxlLCBTZWdJbm5kZXgpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgbGV0IGRlcGFydHVyZURhdGU6IHN0cmluZyA9IG1vbWVudChTZWdFbGUuRGVwYXJ0dXJlRGF0ZVRpbWUudG9TdHJpbmcoKSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBsZXQgZmxpZ2h0bnVtYmVyOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWYgKFNlZ0VsZS5NYXJrZXRpbmdGbGlnaHQuc3Vic3RyKDAsIDIpID09IFwiQ01cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBmbGlnaHRudW1iZXIgPSBTZWdFbGUuTWFya2V0aW5nRmxpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0gZWxzZSBpZiAoU2VnRWxlLk9wZXJhdGluZ0ZsaWdodCAhPSBudWxsICYmIFNlZ0VsZS5PcGVyYXRpbmdGbGlnaHQuc3Vic3RyKDAsIDIpID09IFwiQ01cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBmbGlnaHRudW1iZXIgPSBTZWdFbGUuT3BlcmF0aW5nRmxpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGZsaWdodG51bWJlciA9IFNlZ0VsZS5NYXJrZXRpbmdGbGlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGxldCBjaXR5OiBzdHJpbmcgPSBTZWdFbGUuRGVwYXJ0dXJlQ2l0eTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBTZWdFbGUuZGF0ZSA9IG1vbWVudChTZWdFbGUuRGVwYXJ0dXJlRGF0ZVRpbWUudG9TdHJpbmcoKSkuZm9ybWF0KFwiREQtTU1NLVlZWVlcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIGRlc3RpbmF0aW9uID0gU2VnRWxlLkRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vIC8vSW52ZW50b3J5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gdGhpcy5fY2hlY2tpbi5Cb29raW5nQ291bnREaXNwbGF5KGRlcGFydHVyZURhdGUsIGZsaWdodG51bWJlciwgY2l0eSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAgICAgaWYgKGRhdGEuU3VjY2VzcyAhPSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAgICAgICAgIGxldCBpbnZlbnRvcnk6IGFueSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgICAgICAgICAgU2VnRWxlLmludmVuID0gQ29udmVydGVycy5Db252ZXJ0VG9JbnZlbnRvcnkoaW52ZW50b3J5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vIC8vSW5ib3VuZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vIHRoaXMuX2NoZWNraW4uSW5Cb3VuZChkZXBhcnR1cmVEYXRlLCBmbGlnaHRudW1iZXIsIGNpdHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgICAgIGlmIChkYXRhLlN1Y2Nlc3MgIT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgICAgICAgICBsZXQgaW5Cb3VuZDogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgICAgICAgICBTZWdFbGUuaW5ib3VuZCA9IENvbnZlcnRlcnMuQ29udmVydFRvSW5Cb3VuZChpbkJvdW5kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gLy9PdXRib3VuZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vIHRoaXMuX2NoZWNraW4uT3V0Qm91bmQoZGVwYXJ0dXJlRGF0ZSwgZmxpZ2h0bnVtYmVyLCBkZXN0aW5hdGlvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAgICAgaWYgKGRhdGEuU3VjY2VzcyAhPSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICAgICAgICAgICAgIGxldCBPdXRCb3VuZDogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgICAgICAgICBTZWdFbGUub3V0Ym91bmQgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb091dEJvdW5kKE91dEJvdW5kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gLy9zdGF0dXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyB0aGlzLl9kYXRhU2VydmljZS5TdGF0dXMoZGVwYXJ0dXJlRGF0ZSwgZmxpZ2h0bnVtYmVyLCBjaXR5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBpZiAoZGF0YS5TdWNjZXNzICE9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgbGV0IHN0YXR1czogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBTZWdFbGUuc3RhdHVzID0gc3RhdHVzLkZsaWdodHNbMF0uTGVnc1swXS5TdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgU2VnRWxlLkxlZ3MgPSBzdGF0dXMuRmxpZ2h0c1swXS5MZWdzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuX2RhdGFTZXJ2aWNlLkdldEJhZ2dhZ2UoaWQpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGlmIChkYXRhLlN1Y2Nlc3MgIT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5fc2hhcmVkLlNldEJhZ2dhZ2VjYXRhbG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVGllclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5fZGF0YVNlcnZpY2UuVGllcihzZXRkZXBhcnR1cmVEYXRlLCBzZXRmbGlnaHRudW1iZXIsIHNldGNpdHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBpZiAoZGF0YS5TdWNjZXNzICE9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBsZXQgdGllcjogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRUaWVyKHRpZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFNlZ21lbnREZXRhaWwoUGFzc2VuZ2VyQXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAvLyBzZWxmLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY2hlY2tpblwiXSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgLy8gICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgLy8gICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIC8vICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgLy8gICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgLy8gICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAvLyAgICAgcXVlcnlQYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIC8vICAgICAgICAgXCJiYWdnYWdlXCI6IGlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgLy8gICAgICAgICBcImluZGV4XCI6IHRoaXMuaW5kZXhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHNlbGYucm91dGVyRXh0ZW5zaW9ucy5iYWNrVG9QcmV2aW91c1BhZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJSZWNvcmQgTm90IEZvdW5kXCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvck1lc3NhZ2UpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGVycm9yTWVzc2FnZSA9IGVyci50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJVbnJlY29nbml6ZWQgdG9rZW4gJzwnXCIpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aXRsZTogXCJTZXNzaW9uIFRpbWUgT3V0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGJlZW4gdGltZSBvdXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMubmF2aWdhdGVUb0xvZ2luKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBQYXNzZW5nZXIgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlRGF0ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgUGFzc2VuZ2VyIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEdldE9yZGVyKCk6IHZvaWQge1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcclxuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBQYXNzZW5nZXIgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcclxuICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuT3JkZXJJRDtcclxuICAgICAgICAgICAgdGhpcy5fc2VydmljZS5HZXRQYXNzZW5nZXIoaWQpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlN1Y2Nlc3MgIT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFBhc3Nlbmdlcig8T3JkZXIuUm9vdE9iamVjdD5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNjVGFibGU6IGFueVtdID0gdGhpcy5fc2hhcmVkLkdldFN0YXJ0dXBUYWJsZSgpLlRhYmxlcy5TZWN1cml0eUNvZGVUYWJsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IFBhc3NlbmdlckFycmF5OiBhbnkgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb0ZsaWdodFdpdGhQYXhUZW1wbGF0ZSh0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCksIG51bGwsIHNjVGFibGUsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoUGFzc2VuZ2VyQXJyYXkuU2VnbWVudC5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUGFzc2VuZ2VyQXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5QYXNzZW5nZXIuZm9yRWFjaCgocGF4RGF0YSwgcGF4SW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF4RGF0YS5SUEggPT0gdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuUlBIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWx3ZWlnaHQgPSBwYXhEYXRhLlVuaXRPZk1lYXN1cmVRdWFudGl0eTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGF4RGF0YS5Vbml0T2ZNZWFzdXJlUXVhbnRpdHkgKyBcIiBjb252ZXJ0ZXIgd2VpZ2h0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsd2VpZ2h0Y29kZSA9IHBheERhdGEuVW5pdE9mTWVhc3VyZUNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiUmVjb3JkIE5vdCBGb3VuZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGRhdGEuRXJyb3JNZXNzYWdlKS5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IFBhc3NlbmdlciBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBQYXNzZW5nZXIgU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlRGF0ZSkpKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIG9uU3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGVCdXR0b25FbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0YmFnIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzdGFydERhdGUpO1xyXG4gICAgICAgICAgICBsZXQgdmFsaWQ6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgICAgICB2YWxpZCA9IHRoaXMuVmFsaWRhdGUoKVxyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIGRlbGV0ZUNvbmZpcm1lZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgvXlswLTldKyQvKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5KTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuQWRkQmFnZ2VnZURldGFpbHNhcnJheS5sZW5ndGggPiAwICYmIHZhbGlkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkJhZ2dhZ2VEZXRhaWxhcnJheSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmZvckVhY2goKERldGFpbCwgaW5kZXgpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZy50ZXN0KERldGFpbC53ZWlnaHQpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZGVsZXRlQ29uZmlybWVkID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWlnaHRbaW5kZXhdID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkuZmlsdGVyKG0gPT4gbS5zdGF0dXMgPT0gXCJQZW5kaW5nIERlbGV0ZVwiKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlbGV0ZSBiYWcgMVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmZpbHRlcihtID0+IG0uc3RhdHVzID09IFwiXCIpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpYWxvZ3MuY29uZmlybShcIlJlZnVuZCBCYWdnYWdlIEZlZXMsIGlmIGFueVwiKS50aGVuKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEaWFsb2cgcmVzdWx0OiBcIiArIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVDb25maXJtZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmZpbHRlcihtID0+IG0uc3RhdHVzID09IFwiUGVuZGluZyBEZWxldGVcIikubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWxldGUgYmFnIDBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkJhZ3RhZ0VsZW1lbnQgPSBDb252ZXJ0ZXJzLkRlbGV0ZUJhZ1RhZyh0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbCwgdGhpcy5GbGlnaHRJbmZvLCB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5CYWdUYWcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGRlbGV0ZUNvbmZpcm1lZCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLkJhZ3RhZ0VsZW1lbnQgPSBDb252ZXJ0ZXJzLkRlbGV0ZUJhZ1RhZyh0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbCwgdGhpcy5GbGlnaHRJbmZvLCB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5CYWdUYWcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmZpbHRlcihtID0+IG0uc3RhdHVzID09IFwiXCIpLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2ggPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuQWRkQmFnZ2VnZURldGFpbHNhcnJheS5mb3JFYWNoKChEZXRhaWwsIEluZGV4KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFEZXRhaWwuQWxyZWFkeUV4aXN0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJhZ2dhZ2VEZXRhaWw6IGJhZ2dhZ2VUZW1wbGF0ZS5CYWdnYWdlRGV0YWlsID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsID0gbmV3IGJhZ2dhZ2VUZW1wbGF0ZS5CYWdnYWdlRGV0YWlsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5CYWdnYWdlUlBIID0gKGluZGV4ICsgMSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgRmxpZm9TdGF0dXMgPSB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCkuU2VnbWVudHMuZmlsdGVyKG0gPT4gbS5SUEggPT0gdGhpcy5GbGlnaHRJbmZvLlNlZ21lbnRSUEgpWzBdLlN0YXR1cy5TdGF0dXNDb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChGbGlmb1N0YXR1cyA9PSBcIlNDXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5GbGlnaHRTZWdtZW50UlBIID0gdGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpLlNlZ21lbnRzLmZpbHRlcihtID0+IG0uU3RhdHVzLlN0YXR1c0NvZGUgPT0gXCJXS1wiKVswXS5SUEg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZ2dhZ2VEZXRhaWwuTGFzdEZsaWdodFNlZ21lbnRSUEggPSB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCkuU2VnbWVudHMuZmlsdGVyKG0gPT4gbS5TdGF0dXMuU3RhdHVzQ29kZSA9PSBcIldLXCIpWzBdLlJQSDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLkZsaWdodFNlZ21lbnRSUEggPSB0aGlzLkZsaWdodEluZm8uU2VnbWVudFJQSDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5MYXN0RmxpZ2h0U2VnbWVudFJQSCA9IHRoaXMuRmxpZ2h0SW5mby5TZWdtZW50UlBIO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5QYXNzZW5nZXJSUEggPSB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5SUEg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5DaGVja2VkSW5JbmRpY2F0b3IgPSBcIk5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLldlaWdodCA9IERldGFpbC53ZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKERldGFpbC5Db2RlICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5SRklTQ19TdWJDb2RlID0gRGV0YWlsLkNvZGVcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGV0YWlsLkNvZGUgPSB0aGlzLnN0YW5kYXJkcHJvZHVjdHMuZmlsdGVyKG0gPT4gbS53ZWlnaHQgPT0gRGV0YWlsLndlaWdodCB8fCBtLndlaWdodCA+IERldGFpbC53ZWlnaHQpWzBdLkNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuc3RhbmRhcmRwcm9kdWN0cy5maWx0ZXIobSA9PiBtLndlaWdodD09RGV0YWlsLndlaWdodHx8bS53ZWlnaHQ+RGV0YWlsLndlaWdodClbMF0uQ29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYmFnZ2FnZURldGFpbC5SRklTQ19TdWJDb2RlID0gdGhpcy5zdGFuZGFyZHByb2R1Y3RzLmZpbHRlcihtID0+IG0ud2VpZ2h0ID09IERldGFpbC53ZWlnaHQgfHwgbS53ZWlnaHQgPiBEZXRhaWwud2VpZ2h0KVswXS5Db2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERldGFpbC5Db2RlID0gdGhpcy5zdGFuZGFyZHByb2R1Y3RzLmZpbHRlcihtID0+IG0ud2VpZ2h0ID09IERldGFpbC53ZWlnaHQgfHwgbS53ZWlnaHQgPiBEZXRhaWwud2VpZ2h0KVswXS5SRklDOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLlJGSVNDX0NvZGUgPSB0aGlzLnN0YW5kYXJkcHJvZHVjdHMuZmlsdGVyKG0gPT4gbS53ZWlnaHQgPT0gRGV0YWlsLndlaWdodCB8fCBtLndlaWdodCA+IERldGFpbC53ZWlnaHQpWzBdLlJGSUM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZ2dhZ2VEZXRhaWwuUkZJU0NfU3ViQ29kZSA9IHRoaXMuc3RhbmRhcmRwcm9kdWN0cy5maWx0ZXIobSA9PiBtLndlaWdodCA9PSBEZXRhaWwud2VpZ2h0IHx8IG0ud2VpZ2h0ID4gRGV0YWlsLndlaWdodClbMF0uQ29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYmFnZ2FnZURldGFpbC5SRklTQ19TdWJDb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoRGV0YWlsLnNlbGVjdGVkcHJvZHVjdCA9PSBcIlN0YW5kYXJkXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLkNvbW1lcmNpYWxOYW1lID0gdGhpcy5zdGFuZGFyZHByb2R1Y3RzLmZpbHRlcihtID0+IG0ud2VpZ2h0ID09IERldGFpbC53ZWlnaHQgfHwgbS53ZWlnaHQgPiBEZXRhaWwud2VpZ2h0KVswXS5Db21tZXJjaWFsTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5Mb25nRGVzY3JpcHRpb24gPSB0aGlzLnN0YW5kYXJkcHJvZHVjdHMuZmlsdGVyKG0gPT4gbS53ZWlnaHQgPT0gRGV0YWlsLndlaWdodCB8fCBtLndlaWdodCA+IERldGFpbC53ZWlnaHQpWzBdLkxvbmdEZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLldlaWdodFVuaXQgPSB0aGlzLnN0YW5kYXJkcHJvZHVjdHMuZmlsdGVyKG0gPT4gbS53ZWlnaHQgPT0gRGV0YWlsLndlaWdodCB8fCBtLndlaWdodCA+IERldGFpbC53ZWlnaHQpWzBdLldlaWdodFVuaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5TaG9ydERlc2NyaXB0aW9uID0gdGhpcy5zdGFuZGFyZHByb2R1Y3RzLmZpbHRlcihtID0+IG0ud2VpZ2h0ID09IERldGFpbC53ZWlnaHQgfHwgbS53ZWlnaHQgPiBEZXRhaWwud2VpZ2h0KVswXS5TaG9ydERlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLlNlcnZpY2VDb2RlID0gdGhpcy5zdGFuZGFyZHByb2R1Y3RzLmZpbHRlcihtID0+IG0ud2VpZ2h0ID09IERldGFpbC53ZWlnaHQgfHwgbS53ZWlnaHQgPiBEZXRhaWwud2VpZ2h0KVswXS5TZXJ2aWNlQ29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5TU1JDb2RlID0gdGhpcy5zdGFuZGFyZHByb2R1Y3RzLmZpbHRlcihtID0+IG0ud2VpZ2h0ID09IERldGFpbC53ZWlnaHQgfHwgbS53ZWlnaHQgPiBEZXRhaWwud2VpZ2h0KVswXS5TU1JDb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLkVNRF9UeXBlQ29kZSA9IHRoaXMuc3RhbmRhcmRwcm9kdWN0cy5maWx0ZXIobSA9PiBtLndlaWdodCA9PSBEZXRhaWwud2VpZ2h0IHx8IG0ud2VpZ2h0ID4gRGV0YWlsLndlaWdodClbMF0uRU1EX1R5cGVDb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLkRlZmF1bHRJbmQgPSB0aGlzLnN0YW5kYXJkcHJvZHVjdHMuZmlsdGVyKG0gPT4gbS53ZWlnaHQgPT0gRGV0YWlsLndlaWdodCB8fCBtLndlaWdodCA+IERldGFpbC53ZWlnaHQpWzBdLkRlZmF1bHRJbmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZ2dhZ2VEZXRhaWwuUHJvZHVjdEdyb3VwQ29kZSA9IHRoaXMuc3RhbmRhcmRwcm9kdWN0cy5maWx0ZXIobSA9PiBtLndlaWdodCA9PSBEZXRhaWwud2VpZ2h0IHx8IG0ud2VpZ2h0ID4gRGV0YWlsLndlaWdodClbMF0uUHJvZHVjdEdyb3VwQ29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5SRklTQ19TdWJDb2RlID0gdGhpcy5zdGFuZGFyZHByb2R1Y3RzLmZpbHRlcihtID0+IG0ud2VpZ2h0ID09IERldGFpbC53ZWlnaHQgfHwgbS53ZWlnaHQgPiBEZXRhaWwud2VpZ2h0KVswXS5Db2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLlJGSVNDX0NvZGUgPSB0aGlzLnN0YW5kYXJkcHJvZHVjdHMuZmlsdGVyKG0gPT4gbS53ZWlnaHQgPT0gRGV0YWlsLndlaWdodCB8fCBtLndlaWdodCA+IERldGFpbC53ZWlnaHQpWzBdLlJGSUM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLkNvbW1lcmNpYWxOYW1lID0gdGhpcy5jYXRhbG9ncHJvZHVjdHMuZmlsdGVyKG0gPT4gbS5Db21tZXJjaWFsTmFtZSA9PSBEZXRhaWwuQ3RsZ1Byb2R1Y3QgKVswXS5Db21tZXJjaWFsTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5Mb25nRGVzY3JpcHRpb24gPSB0aGlzLmNhdGFsb2dwcm9kdWN0cy5maWx0ZXIobSA9PiBtLkNvbW1lcmNpYWxOYW1lID09IERldGFpbC5DdGxnUHJvZHVjdClbMF0uTG9uZ0Rlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZ2dhZ2VEZXRhaWwuV2VpZ2h0VW5pdCA9IHRoaXMuY2F0YWxvZ3Byb2R1Y3RzLmZpbHRlcihtID0+IG0uQ29tbWVyY2lhbE5hbWUgPT0gRGV0YWlsLkN0bGdQcm9kdWN0IClbMF0uV2VpZ2h0VW5pdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLlNob3J0RGVzY3JpcHRpb24gPSB0aGlzLmNhdGFsb2dwcm9kdWN0cy5maWx0ZXIobSA9PiBtLkNvbW1lcmNpYWxOYW1lID09IERldGFpbC5DdGxnUHJvZHVjdClbMF0uU2hvcnREZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5TZXJ2aWNlQ29kZSA9IHRoaXMuY2F0YWxvZ3Byb2R1Y3RzLmZpbHRlcihtID0+IG0uQ29tbWVyY2lhbE5hbWUgPT0gRGV0YWlsLkN0bGdQcm9kdWN0KVswXS5TZXJ2aWNlQ29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5TU1JDb2RlID0gdGhpcy5jYXRhbG9ncHJvZHVjdHMuZmlsdGVyKG0gPT4gbS5Db21tZXJjaWFsTmFtZSA9PSBEZXRhaWwuQ3RsZ1Byb2R1Y3QpWzBdLlNTUkNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZ2dhZ2VEZXRhaWwuRU1EX1R5cGVDb2RlID0gdGhpcy5jYXRhbG9ncHJvZHVjdHMuZmlsdGVyKG0gPT4gbS5Db21tZXJjaWFsTmFtZSA9PSBEZXRhaWwuQ3RsZ1Byb2R1Y3QpWzBdLkVNRF9UeXBlQ29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5EZWZhdWx0SW5kID0gdGhpcy5jYXRhbG9ncHJvZHVjdHMuZmlsdGVyKG0gPT4gbS5Db21tZXJjaWFsTmFtZSA9PSBEZXRhaWwuQ3RsZ1Byb2R1Y3QpWzBdLkRlZmF1bHRJbmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZ2dhZ2VEZXRhaWwuUHJvZHVjdEdyb3VwQ29kZSA9IHRoaXMuY2F0YWxvZ3Byb2R1Y3RzLmZpbHRlcihtID0+IG0uQ29tbWVyY2lhbE5hbWUgPT0gRGV0YWlsLkN0bGdQcm9kdWN0KVswXS5Qcm9kdWN0R3JvdXBDb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLlJGSVNDX1N1YkNvZGUgPSB0aGlzLmNhdGFsb2dwcm9kdWN0cy5maWx0ZXIobSA9PiBtLkNvbW1lcmNpYWxOYW1lID09IERldGFpbC5DdGxnUHJvZHVjdClbMF0uQ29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5SRklTQ19Db2RlID0gdGhpcy5jYXRhbG9ncHJvZHVjdHMuZmlsdGVyKG0gPT4gbS5Db21tZXJjaWFsTmFtZSA9PSBEZXRhaWwuQ3RsZ1Byb2R1Y3QpWzBdLlJGSUM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoRGV0YWlsLk92ZXJzaXplID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5Jc092ZXJzaXplZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5Jc092ZXJzaXplZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLlBpZWNlcyA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5CYWdnYWdlRGV0YWlsYXJyYXkucHVzaChiYWdnYWdlRGV0YWlsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEZXRhaWwuQWxyZWFkeUV4aXN0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJhZ2dhZ2VEZXRhaWw6IGJhZ2dhZ2VUZW1wbGF0ZS5CYWdnYWdlRGV0YWlsID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsID0gbmV3IGJhZ2dhZ2VUZW1wbGF0ZS5CYWdnYWdlRGV0YWlsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5CYWdnYWdlUlBIID0gKGluZGV4ICsgMSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLkZsaWdodFNlZ21lbnRSUEggPSB0aGlzLkZsaWdodEluZm8uU2VnbWVudFJQSDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLkxhc3RGbGlnaHRTZWdtZW50UlBIID0gdGhpcy5GbGlnaHRJbmZvLlNlZ21lbnRSUEg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5QYXNzZW5nZXJSUEggPSB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5SUEg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKERldGFpbCAmJiBEZXRhaWwuQ2hlY2tlZEluSW5kaWNhdG9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLkNoZWNrZWRJbkluZGljYXRvciA9IERldGFpbC5DaGVja2VkSW5JbmRpY2F0b3I7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEZXRhaWwgJiYgRGV0YWlsLlJGSVNDX1N1YkNvZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZ2dhZ2VEZXRhaWwuUkZJU0NfU3ViQ29kZSA9IERldGFpbC5SRklTQ19TdWJDb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKERldGFpbC5QaWVjZU9jY3VycmVuY2VUeXBlICYmIERldGFpbC5QaWVjZU9jY3VycmVuY2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLlBpZWNlT2NjdXJyZW5jZVR5cGUgPSBEZXRhaWwuUGllY2VPY2N1cnJlbmNlVHlwZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5QaWVjZU9jY3VycmVuY2UgPSAgRGV0YWlsLlBpZWNlT2NjdXJyZW5jZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnZ2FnZURldGFpbC5Jc092ZXJzaXplZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZ2dhZ2VEZXRhaWwuUGllY2VzID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdnYWdlRGV0YWlsLldlaWdodCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5CYWdnYWdlRGV0YWlsYXJyYXkucHVzaChiYWdnYWdlRGV0YWlsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBiYWdzVG9QcmljZTogYmFnZ2FnZVRlbXBsYXRlLkJhZ3NUb1ByaWNlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZ3NUb1ByaWNlID0gbmV3IGJhZ2dhZ2VUZW1wbGF0ZS5CYWdzVG9QcmljZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnc1RvUHJpY2UuRmxpZ2h0U2VnbWVudCA9IHRoaXMuRmxpZ2h0U2VnbWVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZ3NUb1ByaWNlLlBhc3NlbmdlciA9IHRoaXMuUGFzc2VuZ2VyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFnc1RvUHJpY2UuUGFzc2VuZ2VyWzBdLmZyZWVCYWdnYWdlQWxsb3dhbmNlID0geyBcIlBpZWNlc1wiOiB0aGlzLkZCQSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdzVG9QcmljZS5QcmljaW5nSW5mbyA9IHRoaXMuUHJpY2luZ0luZm87XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWdzVG9QcmljZS5QTlIgPSB0aGlzLlBOUjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZ3NUb1ByaWNlLkJhZ2dhZ2VEZXRhaWwgPSB0aGlzLkJhZ2dhZ2VEZXRhaWxhcnJheTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJhZ3NUb1ByaWNlcyA9IG5ldyBiYWdnYWdlVGVtcGxhdGUuQmFnc1RvUHJpY2VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJhZ3NUb1ByaWNlcy5CYWdzVG9QcmljZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWdzVG9QcmljZXMuQmFnc1RvUHJpY2UucHVzaChiYWdzVG9QcmljZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucmVmcmVzaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KEJhZ2dhZ2VpbmZvQ29tcG9uZW50LkJBR0dBR0VDSEVDSykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk9ubHkgbnVtYmVyc1wiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VpZ2h0W2luZGV4XSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC8vIGlmICh0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkuZmlsdGVyKG0gPT4gbS5zdGF0dXMgPT0gXCJQZW5kaW5nIERlbGV0ZVwiKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJkZWxldGUgYmFnIDJcIik7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5CYWdUYWcoKTtcclxuICAgICAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmZpbHRlcihtID0+IG0uc3RhdHVzID09IFwiXCIpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkdldFByaWNlKHRoaXMuYmFnc1RvUHJpY2VzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICB2YXIgZW5kRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZWJhZyBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVuZERhdGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2ViYWcgU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc3RhcnREYXRlKSwgbmV3IERhdGUoZW5kRGF0ZSkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIEdldFByaWNlKGJhZ3NUb1ByaWNlczogYmFnZ2FnZVRlbXBsYXRlLkJhZ3NUb1ByaWNlcyk6IHZvaWQge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGVCdXR0b25FbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldFByaWNlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzdGFydERhdGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShiYWdzVG9QcmljZXMpKTtcclxuICAgICAgICAgICAgbGV0IGlzUHJpY2U6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbmN5ID0gdGhpcy5fc2hhcmVkLkdldEN1cnJlbmN5KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGFTZXJ2aWNlLkdldFByaWNlKGJhZ3NUb1ByaWNlcywgY3VycmVuY3kpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuU3VjY2VzcyAhPSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmljZSA9IDxhbnk+ZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcih0aGlzLnByaWNlKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCkuU2VnbWVudFRyYXZlbGVySW5mb3MuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWYgKGVsZW1lbnQuUGFzc2VuZ2VyUlBIID09IHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLlJQSCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpLlNlZ21lbnRUcmF2ZWxlckluZm9zW2luZGV4XS5CYWdnYWdlSW5mbyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJpY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2codGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByaWNlLkNvbGxlY3Rpb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByaWNlLkNvbGxlY3Rpb24uZm9yRWFjaCgoZGF0YSwgU2VnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLk9yaWdpbkRlc3RpbmF0aW9uICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLk9yaWdpbkRlc3RpbmF0aW9uWzBdLkJhZ2dhZ2VEZXRhaWwuc29tZSgoQmFnZ2FnZWRhdGEsIE9yaWdpbkRlc3RpbmF0aW9uSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmZvckVhY2goKEJhZ2dlZ2VEZXRhaWwsIERldGFpbG5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChCYWdnZWdlRGV0YWlsLnN0YXR1cyA9PSBcIlwiICYmIE9yaWdpbkRlc3RpbmF0aW9uSW5kZXggPT0gRGV0YWlsbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKEJhZ2dhZ2VkYXRhLkNoZWNrZWRJbkluZGljYXRvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJhZ2dlZ2VEZXRhaWwuQ2hlY2tlZEluSW5kaWNhdG9yID0gQmFnZ2FnZWRhdGEuQ2hlY2tlZEluSW5kaWNhdG9yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihCYWdnYWdlZGF0YS5QcmljZURhdGEgJiYgQmFnZ2FnZWRhdGEuUHJpY2VEYXRhLlBpZWNlT2NjdXJyZW5jZVR5cGUgJiYgQmFnZ2FnZWRhdGEuUHJpY2VEYXRhLlBpZWNlT2NjdXJyZW5jZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJhZ2dlZ2VEZXRhaWwuUGllY2VPY2N1cnJlbmNlVHlwZSA9IEJhZ2dhZ2VkYXRhLlByaWNlRGF0YS5QaWVjZU9jY3VycmVuY2VUeXBlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBCYWdnZWdlRGV0YWlsLlBpZWNlT2NjdXJyZW5jZSA9IEJhZ2dhZ2VkYXRhLlByaWNlRGF0YS5QaWVjZU9jY3VycmVuY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChCYWdnYWdlZGF0YS5QcmljZURhdGEuUHJpY2VUeXBlICYmIEJhZ2dhZ2VkYXRhLlByaWNlRGF0YS5QcmljZVR5cGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhCYWdnYWdlZGF0YS5QcmljZURhdGEuUHJpY2VUeXBlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBCYWdnZWdlRGV0YWlsLmZlZXMgPSBCYWdnYWdlZGF0YS5QcmljZURhdGEuUHJpY2VUeXBlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJhZ2dlZ2VEZXRhaWwuZmVlcyA9IEJhZ2dhZ2VkYXRhLlByaWNlRGF0YS5TZXJ2aWNlRmVlSW5mby5BbW91bnQgPT0gbnVsbCA/IFwiLS1cIiA6IEJhZ2dhZ2VkYXRhLlByaWNlRGF0YS5TZXJ2aWNlRmVlSW5mby5BbW91bnQgKyBcIiBcIiArIEJhZ2dhZ2VkYXRhLlByaWNlRGF0YS5TZXJ2aWNlRmVlSW5mby5DdXJyZW5jeTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJiYWdnYWdlIGZlZXMgY3VycmVudGx5IG5vdCBzdXBwb3J0ZWQgLSBjb250YWN0IGNoZWNrLWluIGRlc2tcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUHJpY2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkuZm9yRWFjaCgoRGV0YWlsLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWYgKCFEZXRhaWwuQWxyZWFkeUV4aXN0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciBpbmRleCA9IHRoaXMuQWRkQmFnZ2VnZURldGFpbHNhcnJheS5pbmRleE9mKEJhZ2dlZ2VEZXRhaWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIChCYWdnYWdlZGF0YS5QcmljZURhdGEuU2VydmljZUZlZUluZm8uQW1vdW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5BbW91bnRBcnJheS5wdXNoKEJhZ2dhZ2VkYXRhLlByaWNlRGF0YS5TZXJ2aWNlRmVlSW5mby5BbW91bnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnRvdGFsQW1vdW50ID0gdGhpcy50b3RhbEFtb3VudCArIEJhZ2dhZ2VkYXRhLlByaWNlRGF0YS5TZXJ2aWNlRmVlSW5mby5BbW91bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNQcmljZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkgPSB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkuZmlsdGVyKG0gPT4gbS5BbHJlYWR5RXhpc3RpbmcgPT09IHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkuZm9yRWFjaCgoRGV0YWlsLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWYgKCFEZXRhaWwuQWxyZWFkeUV4aXN0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmluZGV4T2YoRGV0YWlsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucHJpY2UuRXJyb3JzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy5wcmljZS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ291bGRudCBmaW5kIGluZm9ybWF0aW9uIGZvciB0aGlzIE9yZGVySUQgXCIgKyBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChlcnJvck1lc3NhZ2UuaW5kZXhPZihcIlVucmVjb2duaXplZCB0b2tlbiAnPCdcIikgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aXRsZTogXCJTZXNzaW9uIFRpbWUgT3V0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBtZXNzYWdlOiBcIllvdXIgc2Vzc2lvbiBoYXMgYmVlbiB0aW1lIG91dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgb2tCdXR0b25UZXh0OiBcIk9LXCJcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgZGlhbG9ncy5hbGVydChvcHRpb25zKS50aGVuKCgpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLm5hdmlnYXRlVG9Mb2dpbigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmICh0aGlzLkFtb3VudEFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5pc0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuaXNDYXJ0QnV0dG9uRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wcmljZS5FcnJvcnMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmZpbHRlcihtID0+IG0uQWxyZWFkeUV4aXN0aW5nID09IGZhbHNlKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkJhZ3RhZ0VsZW1lbnQgPSBDb252ZXJ0ZXJzLkdldEJhZ1RhZyh0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbCwgdGhpcy5GbGlnaHRJbmZvLCB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXksIHRoaXMuRmxpZ2h0SW5mbywgdGhpcy5TaG9ydENoZWNrQWlycG9ydENvZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFBhc3Nlbmdlckxpc3Q6IGFueSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NoYXJlZC5HZXRCYWdUYWcoKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGFzc2VuZ2VyTGlzdCA9IHRoaXMuX3NoYXJlZC5HZXRCYWdUYWcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChQYXNzZW5nZXJMaXN0Lmxlbmd0aCA+IDAgJiYgUGFzc2VuZ2VyTGlzdC5maWx0ZXIobSA9PiBtLlJQSCA9PSB0aGlzLkJhZ3RhZ0VsZW1lbnQuUGFzc2VuZ2VyTGlzdFswXS5SUEgpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQYXNzZW5nZXJMaXN0LmZpbHRlcihtID0+IG0uUlBIID09IHRoaXMuQmFndGFnRWxlbWVudC5QYXNzZW5nZXJMaXN0WzBdLlJQSClbMF0gPSB0aGlzLkJhZ3RhZ0VsZW1lbnQuUGFzc2VuZ2VyTGlzdFswXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhc3Nlbmdlckxpc3Quc3BsaWNlKFBhc3Nlbmdlckxpc3QuaW5kZXhPZihQYXNzZW5nZXJMaXN0LmZpbHRlcihtID0+IG0uUlBIID09IHRoaXMuQmFndGFnRWxlbWVudC5QYXNzZW5nZXJMaXN0WzBdLlJQSClbMF0pLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzZW5nZXJMaXN0LnB1c2godGhpcy5CYWd0YWdFbGVtZW50LlBhc3Nlbmdlckxpc3RbMF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhc3Nlbmdlckxpc3QucHVzaCh0aGlzLkJhZ3RhZ0VsZW1lbnQuUGFzc2VuZ2VyTGlzdFswXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFBhc3Nlbmdlckxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLkNoZWNraW5TdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkJhZ1RhZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0QmFnVGFnKFBhc3Nlbmdlckxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDb250aW51ZWJ0bkVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGVCdXR0b25FbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQWRkQmFnZ2FnZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy5wcmljZS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgIHZhciBlbmREYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldFByaWNlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZW5kRGF0ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXRQcmljZSBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzdGFydERhdGUpLCBuZXcgRGF0ZShlbmREYXRlKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgaXNTaG9ydENoZWNraW4oYXJnczogTXVsdGlTZWdtZW50VGVtcGxhdGUuUGFzc2VuZ2VyLCBpdGVtOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhhcmdzLlNob3J0Q2hlY2tpbkFycml2YWxDb2Rlc0J5RmxpZ2h0cyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLkZsaWdodE51bWJlcik7XHJcbiAgICAgICAgaWYgKGFyZ3MuU2hvcnRDaGVja2luQXJyaXZhbENvZGVzQnlGbGlnaHRzICE9IG51bGwgJiYgYXJncy5TaG9ydENoZWNraW5BcnJpdmFsQ29kZXNCeUZsaWdodHMuZmlsdGVyKG0gPT4gbS5GbGlnaHROdW1iZXIgPT0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLk1hcmtldGluZ0ZsaWdodCB8fCBtLkZsaWdodE51bWJlciA9PSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uT3BlcmF0aW5nRmxpZ2h0KS5sZW5ndGggPiAwICYmIGFyZ3MuU2hvcnRDaGVja2luQXJyaXZhbENvZGVzQnlGbGlnaHRzLmZpbHRlcihtID0+IG0uRmxpZ2h0TnVtYmVyID09IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5NYXJrZXRpbmdGbGlnaHQgfHwgbS5GbGlnaHROdW1iZXIgPT0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLk9wZXJhdGluZ0ZsaWdodClbMF0uU2hvcnRDaGVja2luQXJyaXZhbENvZGVzLklzRWxpZ2libGVGb3JTaG9ydENoZWNraW4gJiYgaXRlbS5BbHJlYWR5RXhpc3RpbmcgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5TaG9ydENoZWNrUmVxdWlyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLlNob3J0Q2hlY2tSZXF1aXJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2VsZWN0U2hvcnRDaGVja0NvZGUoYXJnczogTXVsdGlTZWdtZW50VGVtcGxhdGUuUGFzc2VuZ2VyLGl0ZW0pIHtcclxuICAgICAgICBsZXQgU2hvcnRjaGVja0NvZGVzOiBBcnJheTxzdHJpbmc+ID0gYXJncy5TaG9ydENoZWNraW5BcnJpdmFsQ29kZXNCeUZsaWdodHMuZmlsdGVyKG0gPT4gbS5GbGlnaHROdW1iZXIgPT0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLk1hcmtldGluZ0ZsaWdodClbMF0uU2hvcnRDaGVja2luQXJyaXZhbENvZGVzLlNob3J0Q2hlY2tJbkFycml2YWxDb2RlcztcclxuICAgICAgICBpZihTaG9ydGNoZWNrQ29kZXMhPW51bGwmJiBTaG9ydGNoZWNrQ29kZXMhPVtdKXtcclxuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJTaG9ydENoZWNrXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkNob29zZSBEZXN0aW5hdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uczogU2hvcnRjaGVja0NvZGVzXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRpYWxvZ3MuYWN0aW9uKG9wdGlvbnMpLnRoZW4ocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7ICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MuU2hvcnRDaGVja0FpcnBvcnRDb2RlID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uU2hvcnRDaGVja0FpcnBvcnRDb2RlID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBhcmdzLlNob3J0Q2hlY2tBaXJwb3J0Q29kZSA9IFNob3J0Y2hlY2tDb2Rlc1swXTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLlNob3J0Q2hlY2tBaXJwb3J0Q29kZSA9IFNob3J0Y2hlY2tDb2Rlc1swXTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGdldEJhZ2dhZ2UoKTogdm9pZCB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXRCYWdnYWdlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzdGFydERhdGUpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYmFnZ2FnZWNhdGFsb2cgIT0gbnVsbCAmJiB0aGlzLmJhZ2dhZ2VjYXRhbG9nLkNvbGxlY3Rpb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5iYWdnYWdlY2F0YWxvZy5Db2xsZWN0aW9uLmZvckVhY2goKGRhdGEsIFNlZ0luZGV4KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlBhc3NlbmdlclswXS5QYXNzZW5nZXJSUEggPT0gdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuUlBIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlBhc3NlbmdlclswXS5NYXhCYWdDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXhCYWdDb3VudCA9IGRhdGEuUGFzc2VuZ2VyWzBdLk1heEJhZ0NvdW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5GbGlnaHRTZWdtZW50ID0gZGF0YS5GbGlnaHRTZWdtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLlBhc3NlbmdlciA9IGRhdGEuUGFzc2VuZ2VyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlByaWNpbmdJbmZvID0gZGF0YS5QcmljaW5nSW5mbztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5QTlIuQ2hlY2tlZEluSW5kaWNhdG9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QTlIgPSBkYXRhLlBOUjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIodGhpcy5pbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGRhdGEuT3JpZ2luRGVzdGluYXRpb24uZmlsdGVyKG0gPT4gbS5PcmlnaW5EZXN0aW5hdGlvblJQSCA9PSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUlBIKVswXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuT3JpZ2luRGVzdGluYXRpb24uZmlsdGVyKG0gPT4gbS5PcmlnaW5EZXN0aW5hdGlvblJQSCA9PSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUlBIKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkZCQSA9IGRhdGEuT3JpZ2luRGVzdGluYXRpb24uZmlsdGVyKG0gPT4gbS5PcmlnaW5EZXN0aW5hdGlvblJQSCA9PSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUlBIKVswXS5CYWdnYWdlQ2F0YWxvZy5GcmVlQmFnZ2FnZUFsbG93YW5jZS5QaWVjZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRkJBID0gZGF0YS5PcmlnaW5EZXN0aW5hdGlvblswXS5CYWdnYWdlQ2F0YWxvZy5GcmVlQmFnZ2FnZUFsbG93YW5jZS5QaWVjZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5QYXNzZW5nZXIuZmlsdGVyKG0gPT4gbS5SUEggPT0gdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuUlBIKVswXS5Bc3NvY2lhdGVkSW5mYW50UlBIKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXNzZW5nZXIgPSBkYXRhLlBhc3NlbmdlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGFzc2VuZ2VyLnB1c2goeyBQYXNzZW5nZXJSUEg6IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5QYXNzZW5nZXIuZmlsdGVyKG0gPT4gbS5SUEggPT0gdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuUlBIKVswXS5Bc3NvY2lhdGVkSW5mYW50UlBILCBUeXBlOiBcIklORlwiLCBmcmVlQmFnZ2FnZUFsbG93YW5jZTogeyBQaWVjZXM6IHRoaXMuRkJBIH0gfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGFzc2VuZ2VyID0gZGF0YS5QYXNzZW5nZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5PcmlnaW5EZXN0aW5hdGlvblswXS5CYWdnYWdlQ2F0YWxvZy5TdWJHcnBEZXRhaWwuZm9yRWFjaCgoR3JwRGV0YWlsLCBTZWdJbmRleCkgPT4ge1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBHcnBEZXRhaWwuQmFnZ2FnZURldGFpbC5mb3JFYWNoKChQcm9kdWN0LCBTZWdJbmRleCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoR3JwRGV0YWlsLlN1YkdycENvZGUgPT0gbnVsbCAmJiBQcm9kdWN0LklzU3RhbmRhcmRCYWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0YW5kYXJkcHJvZHVjdCA9IG5ldyBiYWdnYWdlVGVtcGxhdGUuUHJvZHVjdERldGFpbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFuZGFyZHByb2R1Y3QuQ29tbWVyY2lhbE5hbWUgPSBQcm9kdWN0LkVtZFByb2R1Y3QuQ29tbWVyY2lhbE5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkcHJvZHVjdC5Db2RlID0gUHJvZHVjdC5FbWRQcm9kdWN0LlJGSVNDX1N1YkNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkcHJvZHVjdC5SRklDID0gUHJvZHVjdC5FbWRQcm9kdWN0LlJGSUM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkcHJvZHVjdC5TdWJUeXBlID0gUHJvZHVjdC5FbWRQcm9kdWN0LlN1YlR5cGU7IC8vIEVNRFR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRhcmRwcm9kdWN0LlNlcnZpY2VDb2RlID0gUHJvZHVjdC5TZXJ2aWNlQ29kZTsvLyBUeXBlT2ZTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkcHJvZHVjdC5TU1JDb2RlID0gUHJvZHVjdC5FbWRQcm9kdWN0LlNTUkNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkcHJvZHVjdC5TaG9ydERlc2NyaXB0aW9uID0gUHJvZHVjdC5FbWRQcm9kdWN0LlNob3J0RGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkcHJvZHVjdC5Mb25nRGVzY3JpcHRpb24gPSBQcm9kdWN0LkVtZFByb2R1Y3QuTG9uZ0Rlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFuZGFyZHByb2R1Y3QuRU1EX1R5cGVDb2RlID0gUHJvZHVjdC5FbWRQcm9kdWN0LkVNRF9UeXBlQ29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRhcmRwcm9kdWN0LndlaWdodCA9IFByb2R1Y3QuV2VpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFuZGFyZHByb2R1Y3QuV2VpZ2h0VW5pdCA9IFByb2R1Y3QuV2VpZ2h0VW5pdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhbmRhcmRwcm9kdWN0LkRlZmF1bHRJbmQgPSBQcm9kdWN0LkRlZmF1bHRJbmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkcHJvZHVjdC5Qcm9kdWN0R3JvdXBDb2RlID0gR3JwRGV0YWlsLlByb2R1Y3RHcm91cENvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkcHJvZHVjdC5FTURfVHlwZUNvZGUgPSBQcm9kdWN0LkVtZFByb2R1Y3QuRU1EX1R5cGVDb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhbmRhcmRwcm9kdWN0LndlaWdodCA+PSAxMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhbmRhcmRwcm9kdWN0c0xpc3QucHVzaChzdGFuZGFyZHByb2R1Y3QuQ29tbWVyY2lhbE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhbmRhcmRwcm9kdWN0cy5wdXNoKHN0YW5kYXJkcHJvZHVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhbmRhcmRwcm9kdWN0cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsMSA9IGEud2VpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbDIgPSBiLndlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbDEgKyBcIiBcIiArIHZhbDIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWwxIDwgdmFsMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGFuZGFyZHByb2R1Y3RzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjYXRhbG9ncHJvZHVjdCA9IG5ldyBiYWdnYWdlVGVtcGxhdGUuUHJvZHVjdERldGFpbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRhbG9ncHJvZHVjdC5Db21tZXJjaWFsTmFtZSA9IFByb2R1Y3QuRW1kUHJvZHVjdC5Db21tZXJjaWFsTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0YWxvZ3Byb2R1Y3QuQ29kZSA9IFByb2R1Y3QuRW1kUHJvZHVjdC5SRklTQ19TdWJDb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRhbG9ncHJvZHVjdC5SRklDID0gUHJvZHVjdC5FbWRQcm9kdWN0LlJGSUM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGFsb2dwcm9kdWN0LlN1YlR5cGUgPSBQcm9kdWN0LkVtZFByb2R1Y3QuU3ViVHlwZTsgLy8gRU1EVHlwZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRhbG9ncHJvZHVjdC5TZXJ2aWNlQ29kZSA9IFByb2R1Y3QuRW1kUHJvZHVjdC5TZXJ2aWNlQ29kZTsvLyBUeXBlT2ZTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGFsb2dwcm9kdWN0LlNTUkNvZGUgPSBQcm9kdWN0LkVtZFByb2R1Y3QuU1NSQ29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0YWxvZ3Byb2R1Y3Qud2VpZ2h0ID0gUHJvZHVjdC5XZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGFsb2dwcm9kdWN0LkRlZmF1bHRJbmQgPSBQcm9kdWN0LkRlZmF1bHRJbmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGFsb2dwcm9kdWN0LlByb2R1Y3RHcm91cENvZGUgPSBHcnBEZXRhaWwuUHJvZHVjdEdyb3VwQ29kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRhbG9ncHJvZHVjdC5Mb25nRGVzY3JpcHRpb24gPSBQcm9kdWN0LkVtZFByb2R1Y3QuTG9uZ0Rlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRhbG9ncHJvZHVjdC5TaG9ydERlc2NyaXB0aW9uID0gUHJvZHVjdC5FbWRQcm9kdWN0LlNob3J0RGVzY3JpcHRpb247IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRhbG9ncHJvZHVjdC5FTURfVHlwZUNvZGUgPSBQcm9kdWN0LkVtZFByb2R1Y3QuRU1EX1R5cGVDb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhdGFsb2dwcm9kdWN0c0xpc3QucHVzaChjYXRhbG9ncHJvZHVjdC5Db21tZXJjaWFsTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2F0YWxvZ3Byb2R1Y3RzLnB1c2goY2F0YWxvZ3Byb2R1Y3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaChlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkNhdGFsb2cgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgIHZhciBlbmREYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXRCYWdnYWdlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZW5kRGF0ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXRCYWdnYWdlIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHN0YXJ0RGF0ZSksIG5ldyBEYXRlKGVuZERhdGUpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgQWRkQmFnZ2FnZSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5lbmFibGVBZGRCYWcpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVBZGRCYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZVJlbW92ZUJhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmJhZ0NvdW50ID0gdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5Lmxlbmd0aCArIDE7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJhZ0NvdW50IDw9IHRoaXMubWF4QmFnQ291bnQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhZGRCYWdnZWdlRGV0YWlsczogYmFnZ2FnZVRlbXBsYXRlLkFkZEJhZ2dlZ2VEZXRhaWxzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzID0gbmV3IGJhZ2dhZ2VUZW1wbGF0ZS5BZGRCYWdnZWdlRGV0YWlscygpO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuYmFnVGFnID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLndlaWdodCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBhZGRCYWdnZWdlRGV0YWlscy53ZWlnaHRVbml0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLnRhZ051bWJlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBhZGRCYWdnZWdlRGV0YWlscy5mZWVzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLmRlc3RpbmF0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLnN0YW5kYXJkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBhZGRCYWdnZWdlRGV0YWlscy5jYXRhbG9nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBhZGRCYWdnZWdlRGV0YWlscy5hdXRvID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLm1hbnVhbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuc3RhdHVzID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLlN0ZFByb2R1Y3QgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuQ29kZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBhZGRCYWdnZWdlRGV0YWlscy5DdGxnUHJvZHVjdCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBhZGRCYWdnZWdlRGV0YWlscy5BbHJlYWR5RXhpc3RpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLnNlbGVjdGVkcHJvZHVjdCA9IFwiU2VsZWN0IHByb2R1Y3RcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNDb250aW51ZWJ0bkVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuQWRkQmFnZ2VnZURldGFpbHNhcnJheS5wdXNoKGFkZEJhZ2dlZ2VEZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgIGZvciAoOyB0aGlzLmNvdW50IDwgMTsgdGhpcy5jb3VudCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idG5MaXN0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidG46IFwiMlwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzYmFnRXhpc3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGxldCBzY3JWaWV3ID0gPFNjcm9sbFZpZXc+dGhpcy5iYWdnYWdlU2Nyb2xsZXIubmF0aXZlRWxlbWVudDtcclxuICAgICAgICAgICAgICAgIGxldCBjb250VmlldyA9IDxTdGFja0xheW91dD50aGlzLmJhZ2dhZ2VDb250YWluZXIubmF0aXZlRWxlbWVudDtcclxuICAgICAgICAgICAgICAgIHNjclZpZXcuc2Nyb2xsVG9WZXJ0aWNhbE9mZnNldChQZXJjZW50TGVuZ3RoLnRvRGV2aWNlUGl4ZWxzKGNvbnRWaWV3LmhlaWdodCksIHRydWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJNYXhpbXVtIG51bWJlciBvZiBiYWdnYWdlIHJlYWNoZWRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBvbkNoYW5nZShhcmdzOiBhbnksIGFyZ3NpbmRleDogYW55LCBpbmRleCwgaXRlbTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fdGltZW91dFNlcnZpY2UucmVzZXRXYXRjaCgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGFyZ3MpO1xyXG4gICAgICAgIC8vIGlmICh0aGlzLmlzQnV0dG9uRW5hYmxlZCkge1xyXG4gICAgICAgIHN3aXRjaCAoaW5kZXgpIHtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFyZ3MpXHJcbiAgICAgICAgICAgICAgICBpZiAoYXJncyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy5fY29uZmlndXJhdGlvbi5GaWVsZFZhbGlkYXRpb25UZXh0KS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgvXlswLTldKyQvKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IHJlZy50ZXN0KGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGVzdCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGVzdCA9PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndlaWdodFthcmdzaW5kZXhdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlRmVpbGQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk9ubHkgbnVtYmVyXCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2VpZ2h0W2FyZ3NpbmRleF0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlRmVpbGQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmlzQnV0dG9uRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBlbHNlIHRoaXMud2VpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVzdFdlaWdodCA9IE51bWJlcihhcmdzKTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLnN0YW5kYXJkICYmIGl0ZW0uU3RkUHJvZHVjdCA9PSBcIlN0YW5kYXJkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGVuZ3RoID0gdGhpcy5zdGFuZGFyZHByb2R1Y3RzLmZpbHRlcihtID0+IG0ud2VpZ2h0IDw9IDQ1KS5sZW5ndGggLSAxXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlbmd0aCA+IDAgJiYgdGVzdFdlaWdodCA+IHRoaXMuc3RhbmRhcmRwcm9kdWN0cy5maWx0ZXIobSA9PiBtLndlaWdodCA8PSA0NSlbbGVuZ3RoXS53ZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJCYWdnYWdlIHdlaWdodCBleGNlZWRzIGFsbG93YWJsZSAoMTAwS0cpIGZvciBzdGFuZGFyZCBiYWdnYWdlLkV4dHJhIGJhZ2dhZ2UgbmVlZHMgdG8gYmUgdHJhbnNwb3J0ZWQgYXMgY2FyZ28uXCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS53ZWlnaHQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlaWdodFthcmdzaW5kZXhdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUZlaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGVzdCA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlaWdodFthcmdzaW5kZXhdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUZlaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VpZ2h0W2FyZ3NpbmRleF0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUZlaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uc3RhbmRhcmQgJiYgaXRlbS5TdGRQcm9kdWN0ICE9IFwiU3RhbmRhcmRcIiAmJiBpdGVtLmNhdGFsb2cgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGFuZGFyZHByb2R1Y3RzLmZpbHRlcihtID0+IG0uTmFtZSA9PSBpdGVtLlN0ZFByb2R1Y3QpLmxlbmd0aCA+IDAgJiYgdGVzdFdlaWdodCA+IHRoaXMuc3RhbmRhcmRwcm9kdWN0cy5maWx0ZXIobSA9PiBtLk5hbWUgPT0gaXRlbS5TdGRQcm9kdWN0KVswXS53ZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJCYWdnYWdlIHdlaWdodCBleGNlZWRzIGFsbG93YWJsZSAoMTAwS0cpIGZvciBzdGFuZGFyZCBiYWdnYWdlLkV4dHJhIGJhZ2dhZ2UgbmVlZHMgdG8gYmUgdHJhbnNwb3J0ZWQgYXMgY2FyZ28uXCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS53ZWlnaHQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlaWdodFthcmdzaW5kZXhdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUZlaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGVzdCA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlaWdodFthcmdzaW5kZXhdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUZlaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VpZ2h0W2FyZ3NpbmRleF0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUZlaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2F0YWxvZ3Byb2R1Y3RzLmZpbHRlcihtID0+IG0uTmFtZSA9PSBpdGVtLkN0bGdQcm9kdWN0KS5sZW5ndGggPiAwICYmIHRlc3RXZWlnaHQgPiB0aGlzLmNhdGFsb2dwcm9kdWN0cy5maWx0ZXIobSA9PiBtLk5hbWUgPT0gaXRlbS5DdGxnUHJvZHVjdClbMF0ud2VpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiQmFnZ2FnZSB3ZWlnaHQgZXhjZWVkcyBhbGxvd2FibGUgc2l6ZS5FeHRyYSBiYWdnYWdlIG5lZWRzIHRvIGJlIHRyYW5zcG9ydGVkIGFzIGNhcmdvLi5cIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLndlaWdodCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VpZ2h0W2FyZ3NpbmRleF0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlRmVpbGQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0ZXN0ID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VpZ2h0W2FyZ3NpbmRleF0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlRmVpbGQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWlnaHRbYXJnc2luZGV4XSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlRmVpbGQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMud2VpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJncyA9PSBcIlwiICYmIGl0ZW0ubWFudWFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQodGhpcy5fY29uZmlndXJhdGlvbi5GaWVsZFZhbGlkYXRpb25UZXh0KS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgvXlswLTldKyQvKTtcclxuICAgICAgICAgICAgICAgIHZhciByZWdzID0gbmV3IFJlZ0V4cCgvXlthLXpBLVpdezJ9WzAtOV17Nn0kLyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IHJlZy50ZXN0KGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlc3RzID0gcmVncy50ZXN0KGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGVzdCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHRlc3QgPT0gZmFsc2UgJiYgdGVzdHMgPT0gZmFsc2UpICYmIGl0ZW0ubWFudWFsKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVGFnW2FyZ3NpbmRleF0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsaWRhdGVGZWlsZChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5UYWdbYXJnc2luZGV4XSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsaWRhdGVGZWlsZChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuaXNCdXR0b25FbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdmFsaWRhdGVGZWlsZChpdGVtOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy53ZWlnaHQuZmlsdGVyKG0gPT4gbSA9PSB0cnVlKS5sZW5ndGggPiAwIHx8ICgoaXRlbS5tYW51YWwpICYmICh0aGlzLlRhZy5maWx0ZXIobSA9PiBtID09IHRydWUpLmxlbmd0aCA+IDApKSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgVmFsaWRhdGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IG1zZzogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IGNoZWNrdGFnOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBwcm9kdWN0Y2hlY2s6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgbGV0IHdlaWdodGNoZWNrOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBkZXN0aW5hdGlvbkNoZWNrOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBiYWd0YWdudW1iZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuQWRkQmFnZ2VnZURldGFpbHNhcnJheS5maWx0ZXIobSA9PiBtLnN0YXR1cyA9PSBcIlwiKS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmZvckVhY2goKERldGFpbCwgSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIURldGFpbC5BbHJlYWR5RXhpc3RpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKERldGFpbC5hdXRvID09IGZhbHNlICYmIERldGFpbC5tYW51YWwgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyA9IG1zZyA9PSBcIlwiID8gXCJhdXRvIG9yIG1hbnVhbFwiIDogKG1zZyArIFwiICxcIiArIFwiYXV0byBvciBtYW51YWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja3RhZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKERldGFpbC5TdGRQcm9kdWN0ID09IFwiXCIgJiYgRGV0YWlsLkN0bGdQcm9kdWN0ID09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyA9IG1zZyA9PSBcIlwiID8gXCJwcm9kdWN0XCIgOiAobXNnICsgXCIgLFwiICsgXCJwcm9kdWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdGNoZWNrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRGV0YWlsLndlaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2cgPSBtc2cgPT0gXCJcIiA/IFwid2VpZ2h0XCIgOiAobXNnICsgXCIgLFwiICsgXCJ3ZWlnaHRcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodGNoZWNrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5TaG9ydENoZWNrUmVxdWlyZWQgJiYgKERldGFpbC5TaG9ydENoZWNrQWlycG9ydENvZGUgPT0gXCJcInx8RGV0YWlsLlNob3J0Q2hlY2tBaXJwb3J0Q29kZSA9PSBudWxsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnID0gbXNnID09IFwiXCIgPyBcImRlc3RpbmF0aW9uIGNpdHlcIiA6IChtc2cgKyBcIiAsXCIgKyBcImRlc3RpbmF0aW9uIGNpdHlcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbkNoZWNrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRGV0YWlsLm1hbnVhbCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoRGV0YWlsLnRhZ051bWJlciAhPSBudWxsICYmIERldGFpbC50YWdOdW1iZXIgIT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEZXRhaWwudGFnTnVtYmVyLmxlbmd0aCA9PSA2IHx8IERldGFpbC50YWdOdW1iZXIubGVuZ3RoID09IDgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2cgPSBtc2cgPT0gXCJcIiA/IFwiIEludmFsaWQgYmFndGFnIG51bWJlciBcIiArIERldGFpbC50YWdOdW1iZXIgKyBcIi4gVGFnIG51bWJlciBzaG91bGQgYmUgNiBcIiA6IChtc2cgKyBcIiAsXCIgKyBcIiBJbnZhbGlkIGJhZ3RhZyBudW1iZXJcIiArIERldGFpbC50YWdOdW1iZXIgKyBcIi4gVGFnIG51bWJlciBzaG91bGQgYmUgNiBcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFndGFnbnVtYmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZyA9IG1zZyA9PSBcIlwiID8gXCJUYWcgbnVtYmVyIHNob3VsZCBiZSA2ICBcIiA6IChtc2cgKyBcIiAsXCIgKyBcIlRhZyBudW1iZXIgc2hvdWxkIGJlIDYgXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFndGFnbnVtYmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmZpbHRlcihtID0+IG0uc3RhdHVzID09IFwiUGVuZGluZyBEZWxldGVcIikubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuQWRkQmFnZ2VnZURldGFpbHNhcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiS2luZGx5IGFkZCBvciBSZW1vdmUgYmFnZ2FnZVwiKS5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiS2luZGx5IGFkZCBiYWdnYWdlXCIpLnNob3coKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobXNnID09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGVja3RhZyAhPSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiQXV0byBvciBNYW51YWwgcmVxdWlyZWRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb2R1Y3RjaGVjayAhPSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiUHJvZHVjdCByZXF1aXJlZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAod2VpZ2h0Y2hlY2sgIT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIldlaWdodCByZXF1aXJlZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoZGVzdGluYXRpb25DaGVjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiZGVzdGluYXRpb24gY2l0eSByZXF1aXJlZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYmFndGFnbnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJiYWd0YWdudW1iZXIgaXMgbm90IHZhbGlkXCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUb2FzdC5tYWtlVGV4dChtc2cgKyBcIiByZXF1aXJlZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICB2YXIgZW5kRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdWYWxpZGF0ZS0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVuZERhdGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnVmFsaWRhdGUgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKGVuZERhdGUpLCBuZXcgRGF0ZShlbmREYXRlKSkpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG4gICAgcHVibGljIEFkZEV4aXN0aW5nQmFnZ2FnZShCYWdnYWdlRGV0YWlsOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAvLyB0aGlzLmlzUmVtb3ZlQnRuRW5hYmxlZCA9IGZhbHNlXHJcblxyXG4gICAgICAgIGlmIChCYWdnYWdlRGV0YWlsICE9IG51bGwgJiYgQmFnZ2FnZURldGFpbC5CYWdUYWdEZXRhaWxzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgbGV0IE1lYXN1cmVRdWFudGl0OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBsZXQgd2VpZ2h0OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKEJhZ2dhZ2VEZXRhaWwuVW5pdE9mTWVhc3VyZVF1YW50aXR5ICE9IG51bGwgJiYgQmFnZ2FnZURldGFpbC5Vbml0T2ZNZWFzdXJlUXVhbnRpdHkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBNZWFzdXJlUXVhbnRpdCA9IEJhZ2dhZ2VEZXRhaWwuVW5pdE9mTWVhc3VyZVF1YW50aXR5O1xyXG4gICAgICAgICAgICAgICAgd2VpZ2h0ID0gKChNZWFzdXJlUXVhbnRpdCkgLyAodGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuQmFnQ291bnQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdlaWdodCA9IEJhZ2dhZ2VEZXRhaWwuVW5pdE9mTWVhc3VyZVF1YW50aXR5O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5Ub3RhbFdlaWdodCA9IE1lYXN1cmVRdWFudGl0O1xyXG4gICAgICAgICAgICB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgQmFnZ2FnZURldGFpbC5CYWdUYWdEZXRhaWxzLmZvckVhY2goKERldGFpbCwgRGV0YWlsSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBhZGRCYWdnZWdlRGV0YWlsczogYmFnZ2FnZVRlbXBsYXRlLkFkZEJhZ2dlZ2VEZXRhaWxzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzID0gbmV3IGJhZ2dhZ2VUZW1wbGF0ZS5BZGRCYWdnZWdlRGV0YWlscygpO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuYmFnVGFnID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLndlaWdodCA9IE1hdGgucm91bmQod2VpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLndlaWdodFVuaXQgPSBCYWdnYWdlRGV0YWlsLlVuaXRPZk1lYXN1cmVDb2RlO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMudGFnTnVtYmVyID0gRGV0YWlsLkNhcnJpZXJDb2RlICsgRGV0YWlsLlNlcmlhbE51bWJlcjtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLmZlZXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuZGVzdGluYXRpb24gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuc3RhbmRhcmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuY2F0YWxvZyA9IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLmF1dG8gPSB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLm1hbnVhbCA9IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLnN0YXR1cyA9IFwiQ2hlY2tlZEluXCI7XHJcbiAgICAgICAgICAgICAgICBhZGRCYWdnZWdlRGV0YWlscy5TdGRQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLkNvZGUgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuQ3RsZ1Byb2R1Y3QgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuQWxyZWFkeUV4aXN0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLkNoZWNrZWRJbkluZGljYXRvciA9ICBEZXRhaWwuQ2hlY2tlZEluSW5kaWNhdG9yO1xyXG4gICAgICAgICAgICAgICAgaWYoRGV0YWlsLlJGSVNDX1N1YkNvZGUpXHJcbiAgICAgICAgICAgICAgICBhZGRCYWdnZWdlRGV0YWlscy5SRklTQ19TdWJDb2RlID0gRGV0YWlsLlJGSVNDX1N1YkNvZGVcclxuICAgICAgICAgICAgICAgIGlmKERldGFpbC5QaWVjZU9jY3VycmVuY2UgJiYgRGV0YWlsLlBpZWNlT2NjdXJyZW5jZVR5cGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLlBpZWNlT2NjdXJyZW5jZSA9IERldGFpbC5QaWVjZU9jY3VycmVuY2VcclxuICAgICAgICAgICAgICAgICAgICBhZGRCYWdnZWdlRGV0YWlscy5QaWVjZU9jY3VycmVuY2VUeXBlID0gRGV0YWlsLlBpZWNlT2NjdXJyZW5jZVR5cGVcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBhZGRCYWdnZWdlRGV0YWlscy5CYWdUYWdEZXRhaWxzID0gRGV0YWlsO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYWRkQmFnZ2VnZURldGFpbHMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LnB1c2goYWRkQmFnZ2VnZURldGFpbHMpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNiYWdFeGlzdCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBmb3IgKDsgdGhpcy5jb3VudCA8IDE7IHRoaXMuY291bnQrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5idG5MaXN0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGJ0bjogXCIyXCJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHB1YmxpYyBBZGRNYW51YWxCYWdnYWdlKEJhZ2dhZ2VJbmZvOiBhbnkpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKEJhZ2dhZ2VJbmZvLkJhZ2dhZ2VEZXRhaWxzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgbGV0IE1lYXN1cmVRdWFudGl0OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBsZXQgd2VpZ2h0OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKEJhZ2dhZ2VJbmZvLkNoZWNrZWRCYWdXZWlnaHRUb3RhbCAhPSBudWxsICYmIEJhZ2dhZ2VJbmZvLkNoZWNrZWRCYWdXZWlnaHRUb3RhbCA+IDApIHtcclxuICAgICAgICAgICAgICAgIE1lYXN1cmVRdWFudGl0ID0gQmFnZ2FnZUluZm8uQ2hlY2tlZEJhZ1dlaWdodFRvdGFsO1xyXG4gICAgICAgICAgICAgICAgd2VpZ2h0ID0gKChNZWFzdXJlUXVhbnRpdCkgLyAoQmFnZ2FnZUluZm8uQ2hlY2tlZEJhZ0NvdW50VG90YWwpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdlaWdodCA9IEJhZ2dhZ2VJbmZvLkNoZWNrZWRCYWdXZWlnaHRUb3RhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5Ub3RhbFdlaWdodCA9IE1lYXN1cmVRdWFudGl0O1xyXG4gICAgICAgICAgICB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgQmFnZ2FnZUluZm8uQmFnZ2FnZURldGFpbHMuZm9yRWFjaCgoRGV0YWlsLCBEZXRhaWxJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFkZEJhZ2dlZ2VEZXRhaWxzOiBiYWdnYWdlVGVtcGxhdGUuQWRkQmFnZ2VnZURldGFpbHMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMgPSBuZXcgYmFnZ2FnZVRlbXBsYXRlLkFkZEJhZ2dlZ2VEZXRhaWxzKCk7XHJcbiAgICAgICAgICAgICAgICBhZGRCYWdnZWdlRGV0YWlscy5iYWdUYWcgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMud2VpZ2h0ID0gTWF0aC5yb3VuZCh3ZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMud2VpZ2h0VW5pdCA9IEJhZ2dhZ2VJbmZvLlVuaXRPZk1lYXN1cmVDb2RlO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMudGFnTnVtYmVyID0gRGV0YWlsLkNhcnJpZXJDb2RlICsgRGV0YWlsLlNlcmlhbE51bWJlcjtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLmZlZXMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuZGVzdGluYXRpb24gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuc3RhbmRhcmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuY2F0YWxvZyA9IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLmF1dG8gPSB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLm1hbnVhbCA9IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLnN0YXR1cyA9IFwiQ2hlY2tlZEluXCI7XHJcbiAgICAgICAgICAgICAgICBhZGRCYWdnZWdlRGV0YWlscy5TdGRQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLkNvZGUgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuQ3RsZ1Byb2R1Y3QgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgYWRkQmFnZ2VnZURldGFpbHMuQWxyZWFkeUV4aXN0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGFkZEJhZ2dlZ2VEZXRhaWxzLkJhZ1RhZ0RldGFpbHMgPSBEZXRhaWw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkucHVzaChhZGRCYWdnZWdlRGV0YWlscyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmlzYmFnRXhpc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICBmb3IgKDsgdGhpcy5jb3VudCA8IDE7IHRoaXMuY291bnQrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5idG5MaXN0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGJ0bjogXCIyXCJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByZWZyZXNoRmxpZm8oKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XHJcbiAgICAgICAgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50LmZvckVhY2goKFNlZ0VsZSwgU2VnSW5uZGV4KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGVwYXJ0dXJlRGF0ZTogc3RyaW5nID0gbW9tZW50KFNlZ0VsZS5EZXBhcnR1cmVEYXRlVGltZS50b1N0cmluZygpKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xyXG4gICAgICAgICAgICBsZXQgZmxpZ2h0bnVtYmVyOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGlmIChTZWdFbGUuTWFya2V0aW5nRmxpZ2h0LnN1YnN0cigwLCAyKSA9PSBcIkNNXCIpIHtcclxuICAgICAgICAgICAgICAgIGZsaWdodG51bWJlciA9IFNlZ0VsZS5NYXJrZXRpbmdGbGlnaHQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoU2VnRWxlLk9wZXJhdGluZ0ZsaWdodCAhPSBudWxsICYmIFNlZ0VsZS5PcGVyYXRpbmdGbGlnaHQuc3Vic3RyKDAsIDIpID09IFwiQ01cIikge1xyXG4gICAgICAgICAgICAgICAgZmxpZ2h0bnVtYmVyID0gU2VnRWxlLk9wZXJhdGluZ0ZsaWdodDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZsaWdodG51bWJlciA9IFNlZ0VsZS5NYXJrZXRpbmdGbGlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGNpdHk6IHN0cmluZyA9IFNlZ0VsZS5EZXBhcnR1cmVDaXR5O1xyXG4gICAgICAgICAgICBTZWdFbGUuZGF0ZSA9IG1vbWVudChTZWdFbGUuRGVwYXJ0dXJlRGF0ZVRpbWUudG9TdHJpbmcoKSkuZm9ybWF0KFwiREQtTU1NLVlZWVlcIik7XHJcbiAgICAgICAgICAgIHZhciBkZXN0aW5hdGlvbiA9IFNlZ0VsZS5EZXN0aW5hdGlvbjtcclxuICAgICAgICAgICAgLy8gLy9JbnZlbnRvcnlcclxuICAgICAgICAgICAgdGhpcy5fY2hlY2tpbi5Cb29raW5nQ291bnREaXNwbGF5KGRlcGFydHVyZURhdGUsIGZsaWdodG51bWJlciwgY2l0eSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW52ZW50b3J5OiBhbnkgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5pbnZlbiA9IENvbnZlcnRlcnMuQ29udmVydFRvSW52ZW50b3J5KGludmVudG9yeSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vSW5ib3VuZFxyXG4gICAgICAgICAgICB0aGlzLl9jaGVja2luLkluQm91bmQoZGVwYXJ0dXJlRGF0ZSwgZmxpZ2h0bnVtYmVyLCBjaXR5KVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbkJvdW5kOiBhbnkgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5pbmJvdW5kID0gQ29udmVydGVycy5Db252ZXJ0VG9JbkJvdW5kKGluQm91bmQpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8vT3V0Ym91bmRcclxuICAgICAgICAgICAgdGhpcy5fY2hlY2tpbi5PdXRCb3VuZChkZXBhcnR1cmVEYXRlLCBmbGlnaHRudW1iZXIsIGRlc3RpbmF0aW9uKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBPdXRCb3VuZDogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBTZWdFbGUub3V0Ym91bmQgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb091dEJvdW5kKE91dEJvdW5kKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvL3N0YXR1c1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhU2VydmljZS5TdGF0dXMoZGVwYXJ0dXJlRGF0ZSwgZmxpZ2h0bnVtYmVyLCBjaXR5KVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdGF0dXM6IGFueSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgU2VnRWxlLnN0YXR1cyA9IHN0YXR1cy5GbGlnaHRzWzBdLkxlZ3NbMF0uU3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5MZWdzID0gc3RhdHVzLkZsaWdodHNbMF0uTGVncztcclxuICAgICAgICAgICAgICAgICAgICBTZWdFbGUuRVREID0gc3RhdHVzLkZsaWdodHNbMF0uTGVnc1swXS5EZXBhcnR1cmVEYXRlVGltZS5Fc3RpbWF0ZWQudG9TdHJpbmcoKS5zdWJzdHIoMTEsIDUpO1xyXG4gICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5TVEQgPSBzdGF0dXMuRmxpZ2h0c1swXS5MZWdzWzBdLkRlcGFydHVyZURhdGVUaW1lLlNjaGVkdWxlZC50b1N0cmluZygpLnN1YnN0cigxMSwgNSk7XHJcbiAgICAgICAgICAgICAgICAgICAgU2VnRWxlLkVUQSA9IHN0YXR1cy5GbGlnaHRzWzBdLkxlZ3NbMF0uQXJyaXZhbERhdGVUaW1lLlNjaGVkdWxlZC50b1N0cmluZygpLnN1YnN0cigxMSwgNSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdHVzLkZsaWdodHNbMF0uTGVnc1swXS5EZXBhcnR1cmVEYXRlVGltZS5Fc3RpbWF0ZWQudG9TdHJpbmcoKS5zdWJzdHIoMTEsIDUpICsgXCJsbGxsXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFzc2VuZ2VyTGVuZ3RoID0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50Lmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3Nlbmdlckxlbmd0aCA9PSBTZWdJbm5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldEJhZ1RhZyhudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFNlZ21lbnREZXRhaWwodGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZGlzcGxheUNhdGFsb2dwcm9kdWN0c0RpYWxvZyhpdGVtOiBiYWdnYWdlVGVtcGxhdGUuQWRkQmFnZ2VnZURldGFpbHMpIHtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBcIkNhdGFsb2dcIixcclxuICAgICAgICAgICAgLy8gbWVzc2FnZTogXCJDaG9vc2UgIGNhdGFsb2dcIixcclxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgYWN0aW9uczogdGhpcy5jYXRhbG9ncHJvZHVjdHNMaXN0XHJcbiAgICAgICAgfTtcclxuICAgICAgICBkaWFsb2dzLmFjdGlvbihvcHRpb25zKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSBcIkNhbmNlbFwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaXRlbS5jYXRhbG9nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uU3RkUHJvZHVjdCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpdGVtLkN0bGdQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGl0ZW0uQ29kZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpdGVtLkN0bGdQcm9kdWN0ID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgaXRlbS5Db2RlID0gdGhpcy5jYXRhbG9ncHJvZHVjdHMuZmlsdGVyKG0gPT4gbS5OYW1lID09IHJlc3VsdClbMF0uQ29kZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ2F0YWxvZ1NlcnZpY2VEZXRhaWwgPSB0aGlzLmNhdGFsb2dwcm9kdWN0cy5maWx0ZXIobSA9PiBtLk5hbWUgPT0gcmVzdWx0KVswXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcbiAgICBkaXNwbGF5U3RhbmRhcmRwcm9kdWN0c0RpYWxvZyhpdGVtOiBiYWdnYWdlVGVtcGxhdGUuQWRkQmFnZ2VnZURldGFpbHMpIHtcclxuXHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBcIlN0YW5kYXJkXCIsXHJcbiAgICAgICAgICAgIC8vbWVzc2FnZTogXCJDaG9vc2UgIHN0YW5kYXJkXCIsXHJcbiAgICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgIGFjdGlvbnM6IHRoaXMuc3RhbmRhcmRwcm9kdWN0c0xpc3RcclxuICAgICAgICB9O1xyXG4gICAgICAgIGRpYWxvZ3MuYWN0aW9uKG9wdGlvbnMpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ICE9IFwiQ2FuY2VsXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpdGVtLnN0YW5kYXJkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uU3RkUHJvZHVjdCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpdGVtLkN0bGdQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGl0ZW0uQ29kZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpdGVtLlN0ZFByb2R1Y3QgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGFuZGFyZHByb2R1Y3RzLmZpbHRlcihtID0+IG0uTmFtZSA9PSByZXN1bHQpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLkNvZGUgPSB0aGlzLnN0YW5kYXJkcHJvZHVjdHMuZmlsdGVyKG0gPT4gbS5OYW1lID09IHJlc3VsdClbMF0uQ29kZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkNhdGFsb2dTZXJ2aWNlRGV0YWlsID0gdGhpcy5zdGFuZGFyZHByb2R1Y3RzLmZpbHRlcihtID0+IG0uTmFtZSA9PSByZXN1bHQpWzBdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgfVxyXG4gICAgZGlzcGxheVRhZ0FjdGlvbkRpYWxvZyhpdGVtOiBiYWdnYWdlVGVtcGxhdGUuQWRkQmFnZ2VnZURldGFpbHMpIHtcclxuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgdGl0bGU6IFwiQmFnIFRhZ1wiLFxyXG4gICAgICAgICAgICAvLyBtZXNzYWdlOiBcIkNob29zZSAgQmFnIFRhZ1wiLFxyXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICBhY3Rpb25zOiB0aGlzLnRhZ2l0ZW1zXHJcbiAgICAgICAgfTtcclxuICAgICAgICBkaWFsb2dzLmFjdGlvbihvcHRpb25zKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSBcIkNhbmNlbFwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PSBcIkF1dG9cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYXV0byA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5tYW51YWwgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5tYW51YWwgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uYXV0byA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBkaXNwbGF5UHJvZHVjdEFjdGlvbkRpYWxvZyhpdGVtOiBiYWdnYWdlVGVtcGxhdGUuQWRkQmFnZ2VnZURldGFpbHMpIHtcclxuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgdGl0bGU6IFwiUHJvZHVjdFwiLFxyXG4gICAgICAgICAgICAvLyBtZXNzYWdlOiBcIkNob29zZSAgUHJvZHVjdFwiLFxyXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICBhY3Rpb25zOiB0aGlzLnByb2R1Y3RpdGVtc1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT0gXCJDYW5jZWxcIikge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zZWxlY3RlZHByb2R1Y3QgPSByZXN1bHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PSBcIlN0YW5kYXJkXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdGFuZGFyZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5TdGRQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLkN0bGdQcm9kdWN0ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLkNvZGUgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uU3RkUHJvZHVjdCA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGFuZGFyZHByb2R1Y3RzLmZpbHRlcihtID0+IG0uTmFtZSA9PSByZXN1bHQpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5Db2RlID0gdGhpcy5zdGFuZGFyZHByb2R1Y3RzLmZpbHRlcihtID0+IG0uTmFtZSA9PSByZXN1bHQpWzBdLkNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ2F0YWxvZ1NlcnZpY2VEZXRhaWwgPSB0aGlzLnN0YW5kYXJkcHJvZHVjdHMuZmlsdGVyKG0gPT4gbS5OYW1lID09IHJlc3VsdClbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPT0gXCJDYXRhbG9nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlDYXRhbG9ncHJvZHVjdHNEaWFsb2coaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09IFwiU2VsZWN0IFByb2R1Y3RcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3RhbmRhcmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNhdGFsb2cgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLlN0ZFByb2R1Y3QgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uQ3RsZ1Byb2R1Y3QgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uQ29kZSA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgfVxyXG4gICAgLy8gZGlzcGxheVNjYW5PcHRpb25EaWFsb2coKSB7XHJcbiAgICAvLyAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAvLyAgICAgICAgIHRpdGxlOiBcIkNyZWRpdCBDYXJkXCIsXHJcbiAgICAvLyAgICAgICAgIC8vIG1lc3NhZ2U6IFwiQ2hvb3NlICBQcm9kdWN0XCIsXHJcbiAgICAvLyAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAvLyAgICAgICAgIGFjdGlvbnM6IFtcIlNjYW4gQ3JlZGl0IENhcmRcIiwgXCJNYW51YWwgRW50cnlcIl1cclxuICAgIC8vICAgICB9O1xyXG4gICAgLy8gICAgIGRpYWxvZ3MuYWN0aW9uKG9wdGlvbnMpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgLy8gICAgICAgICBpZiAocmVzdWx0ID09IFwiU2NhbiBDcmVkaXQgQ2FyZFwiKSB7XHJcbiAgICAvLyAgICAgICAgICAgICBzY2FuQ2FyZENsaWNrZWQoKS50aGVuKChudW1iZXIpID0+IHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhudW1iZXIpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuQ2FyZE51bWJlciA9IG51bWJlci5jYXJkTnVtYmVyO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuY3Z2ID0gbnVtYmVyLmN2djtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLmV4cGlyeU1vbnRoID0gbnVtYmVyLmV4cGlyeU1vbnRoO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuZXhwaXJ5WWVhciA9IG51bWJlci5leHBpcnlZZWFyXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5DYXJkTnVtYmVyKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICBsZXQgb3B0aW9uczogTW9kYWxEaWFsb2dPcHRpb25zID0ge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB2aWV3Q29udGFpbmVyUmVmOiB0aGlzLnZjUmVmLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBbeyBcImNhcmROdW1iZXJcIjogdGhpcy5DYXJkTnVtYmVyLCBcImN2dlwiOiB0aGlzLmN2diB9XSxcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgZnVsbHNjcmVlbjogZmFsc2VcclxuICAgIC8vICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLl9tb2RhbFNlcnZpY2Uuc2hvd01vZGFsKFBheW1lbnRDb21wb25lbnQsIG9wdGlvbnMpXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGF5bWVudENhcmREZXRhaWxzID0gcmVzdWx0O1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSB0cnVlO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maXJtKG51bGwpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgIC8vICAgICAgICAgICAgIH0pO1xyXG4gICAgLy8gICAgICAgICB9XHJcblxyXG4gICAgLy8gICAgICAgICBpZiAocmVzdWx0ID09IFwiTWFudWFsIEVudHJ5XCIpIHtcclxuICAgIC8vICAgICAgICAgICAgIGxldCBvcHRpb25zOiBNb2RhbERpYWxvZ09wdGlvbnMgPSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdmlld0NvbnRhaW5lclJlZjogdGhpcy52Y1JlZixcclxuICAgIC8vICAgICAgICAgICAgICAgICBjb250ZXh0OiBbeyBcImNhcmROdW1iZXJcIjogdGhpcy5DYXJkTnVtYmVyIH1dLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgIGZ1bGxzY3JlZW46IGZhbHNlXHJcbiAgICAvLyAgICAgICAgICAgICB9O1xyXG5cclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuX21vZGFsU2VydmljZS5zaG93TW9kYWwoUGF5bWVudENvbXBvbmVudCwgb3B0aW9ucylcclxuICAgIC8vICAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHRoaXMucGF5bWVudENhcmREZXRhaWxzID0gcmVzdWx0O1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IHRydWU7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlybShudWxsKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICB9KTtcclxuICAgIC8vICAgICAgICAgfVxyXG5cclxuICAgIC8vICAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gfVxyXG4gICAgbmF2aWdhdGVUb1NlYXJjaCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZWFyY2hcIl0sIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG5hdmlnYXRlVG9EZXBhcnR1cmVzKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzR2F0ZURpc2FibGVkID09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImRlcGFydGhvbWVcIl0sIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG5hdmlnYXRlVG9Mb2dpbigpIHtcclxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiXCJdLCB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBCYWdUYWcoKTogdm9pZCB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHRoaXMuQmFndGFnRWxlbWVudCkpO1xyXG4gICAgICAgICAgICBsZXQgYmFndGFnRWxlbWVudCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuQmFndGFnRWxlbWVudClcclxuICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldEJhZ1RhZyhudWxsKTtcclxuICAgICAgICAgICAgdGhpcy5fZGF0YVNlcnZpY2UuR2V0QmFnVGFnKHRoaXMuQmFndGFnRWxlbWVudCkuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRpcih0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCkuU2VnbWVudFRyYXZlbGVySW5mb3NbdGhpcy5pbmRleF0uQmFnZ2FnZUluZm8pXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5TdWNjZXNzICE9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5CYWd0YWdMaXN0ID0gPGFueT5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBiYWd0YWdMaXN0ID0gT2JqZWN0LmFzc2lnbih7fSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIodGhpcy5CYWd0YWdMaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5XYXJuaW5ncyAhPSBudWxsICYmIGRhdGEuV2FybmluZ3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLldhcm5pbmdzLmZvckVhY2goKHdhcm5pbmcsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dCh3YXJuaW5nLk1lc3NhZ2UpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUmVtb3ZlQmFnID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldEJhZ1RhZyhudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VydmljZS5HZXRQYXNzZW5nZXIodGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlBhc3NlbmdlclswXS5PcmRlcklEKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0UGFzc2VuZ2VyKDxPcmRlci5Sb290T2JqZWN0PmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzY1RhYmxlOiBhbnlbXSA9IHRoaXMuX3NoYXJlZC5HZXRTdGFydHVwVGFibGUoKS5UYWJsZXMuU2VjdXJpdHlDb2RlVGFibGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheSA9IENvbnZlcnRlcnMuQ29udmVydFRvRmxpZ2h0V2l0aFBheFRlbXBsYXRlKHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKSwgbnVsbCwgc2NUYWJsZSwgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlBhc3Nlbmdlci5mb3JFYWNoKChwYXhEYXRhLCBwYXhJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF4RGF0YS5SUEggPT0gdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuUlBIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbCA9IHBheERhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsd2VpZ2h0ID0gcGF4RGF0YS5Vbml0T2ZNZWFzdXJlUXVhbnRpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsd2VpZ2h0Y29kZSA9IHBheERhdGEuVW5pdE9mTWVhc3VyZUNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQWRkQmFnZ2VnZURldGFpbHNhcnJheSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhbmRhcmRwcm9kdWN0c0xpc3QucHVzaChcIlN0YW5kYXJkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0QmFnZ2FnZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlQWRkQmFnID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwgIT0gbnVsbCAmJiB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5CYWdDb3VudCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zaGFyZWQuR2V0QmFnVGFnKCkgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BZGRCYWcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQWRkQmFnZ2FnZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NoYXJlZC5HZXRCYWdUYWcoKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkFkZEV4aXN0aW5nQmFnZ2FnZSh0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5CYWdnYWdlSW5mbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkFkZEJhZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BZGRFeGlzdGluZ0JhZ2dhZ2UodGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuQmFnZ2FnZUluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BZGRCYWdnYWdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImNoZWNraW5cIl0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeVBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhXCI6IHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLk9yZGVySUQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImluZGV4XCI6IHRoaXMuaW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuQWRkRXhpc3RpbmdCYWdnYWdlKHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLkJhZ2dhZ2VJbmZvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiaXNIb3N0QmFndGFnXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5CYWdUYWdQcmludFJlc3BvbnNlICYmIGRhdGEuQmFnVGFnUHJpbnRSZXNwb25zZS5CYWdUYWdPdXRwdXRbMF0uUGljUmF3RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbWFnZSA9IGltYWdlTW9kdWxlLmZyb21CYXNlNjQoZGF0YS5CYWdUYWdQcmludFJlc3BvbnNlLkJhZ1RhZ091dHB1dFswXS5QaWNSYXdEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZm9sZGVyID0gZnMua25vd25Gb2xkZXJzLmRvY3VtZW50cygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWxlbmFtZTogc3RyaW5nID0gbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdChcImhobW1zc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGF0aCA9IGZzLnBhdGguam9pbihmb2xkZXIucGF0aCwgXCJ0ZW1wQlBJbWFnZVwiICsgZmlsZW5hbWUgKyBcIi5qcGdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2Uuc2F2ZVRvRmlsZShwYXRoLCBcImpwZWdcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcmludGVySUQgPSB0aGlzLmdldFByaW50ZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByaW50ZXJJRC50cmltKCkgIT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHplYnJhLlByaW50ZXIoeyBhZGRyZXNzOiBwcmludGVySUQsIGxhbmd1YWdlOiBcIkNQQ0xcIiwgZGVidWdnaW5nOiBmYWxzZSB9KS50aGVuKGZ1bmN0aW9uIChjdXJQcmludGVyLCByZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZG9jdW1lbnQgPSBjdXJQcmludGVyLmNyZWF0ZURvY3VtZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuaW1hZ2UoZnMucGF0aC5qb2luKGZvbGRlci5wYXRoLCBcInRlbXBCUEltYWdlXCIgKyBmaWxlbmFtZSArIFwiLmpwZ1wiKSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyUHJpbnRlci5nZXRTdGF0dXMoKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5yZWFkeSAmJiAhcmVzdWx0LmxhdGNoT3BlbiAmJiAhcmVzdWx0Lmxvd0JhdHRlcnkgJiYgIXJlc3VsdC5wYXBlck91dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wcmludGluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyUHJpbnRlci5wcmludChkb2N1bWVudCkuY2F0Y2goZnVuY3Rpb24gKHN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoQ2hlY2tJbkNvbXBvbmVudC5VTkFCTEVUT1BSSU5UKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByaW50aW5nIERvbmVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbGUgPSBmb2xkZXIuZ2V0RmlsZShcInRlbXBCUEltYWdlXCIgKyBmaWxlbmFtZSArIFwiLmpwZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlLnJlbW92ZSgpLnRoZW4oKHJlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZpbGUgcmVtb3ZlZFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJCYWd0YWcgcHJpbnRlZCBzdWNlc3NmdWxseVwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IFJlbWFrcmVxdWVzdDogYW55ID0gQ29udmVydGVycy5CbHVldG9vdGhQcmludGVyUmVzcG9uc2UoYmFndGFnRWxlbWVudCwgYmFndGFnTGlzdCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoUmVtYWtyZXF1ZXN0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5fcHJpbnRlbWFpbC5SZW1hcmtzKFJlbWFrcmVxdWVzdCkuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5JbmZvcm1hdGlvbiAhPSBudWxsICYmIGRhdGEuSW5mb3JtYXRpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5JbmZvcm1hdGlvblswXS5NZXNzYWdlKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wcmludGVyUmVzcG9uc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmZvckVhY2goKERldGFpbCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghRGV0YWlsLkFscmVhZHlFeGlzdGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuQWRkQmFnZ2VnZURldGFpbHNhcnJheS5pbmRleE9mKERldGFpbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJQcmludGVyLmNsb3NlKCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiUHJpbnRlciBpcyByZWFkeSB0byBwcmludFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiRXJyb3IgT2NjdXJlZCB3aGlsZSBQcmludGluZzpcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlByaW50aW5nIEVycm9yOiBcIiwgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyUHJpbnRlci5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmxhdGNoT3Blbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiISEhIUxhdGNoT3BlblwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmxvd0JhdHRlcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIiEhISFMb3dCYXR0ZXJ5XCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucGFwZXJPdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIiEhISFQYXBlck91dFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLlByaW50RmFpbChiYWd0YWdFbGVtZW50LCBiYWd0YWdMaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoQ2hlY2tJbkNvbXBvbmVudC5QUklOVEVSU0VTU0lPTikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhJXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLlByaW50RmFpbChiYWd0YWdFbGVtZW50LCBiYWd0YWdMaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KENoZWNrSW5Db21wb25lbnQuUFJJTlRFUlNFU1NJT04pLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhJXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuUHJpbnRGYWlsKGJhZ3RhZ0VsZW1lbnQsIGJhZ3RhZ0xpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChDaGVja0luQ29tcG9uZW50LlVOQUJMRVRPUFJJTlQpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUHJpbnRGYWlsKGJhZ3RhZ0VsZW1lbnQsIGJhZ3RhZ0xpc3QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KENoZWNrSW5Db21wb25lbnQuVU5BQkxFVE9QUklOVCkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlByaW50RmFpbChiYWd0YWdFbGVtZW50LCBiYWd0YWdMaXN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkuZmlsdGVyKG0gPT4gbS5BbHJlYWR5RXhpc3RpbmcgPT0gZmFsc2UgJiYgbS5tYW51YWwgPT0gdHJ1ZSkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJpbnRlclJlc3BvbnNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KENoZWNrSW5Db21wb25lbnQuVU5BQkxFVE9QUklOVCkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUHJpbnRGYWlsKGJhZ3RhZ0VsZW1lbnQsIGJhZ3RhZ0xpc3QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLkJhZ3RhZ0xpc3QuRXJyb3JzICE9IG51bGwgJiYgdGhpcy5CYWd0YWdMaXN0LkVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuQmFndGFnTGlzdC5FcnJvcnMuZmlsdGVyKG0gPT4gbS5NZXNzYWdlLmluZGV4T2YoXCJCQUcgVEFHIFBSSU5UIEZBSUxFRFwiKSA+PSAwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5palwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5ID0gdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmZpbHRlcihtID0+IG0uQWxyZWFkeUV4aXN0aW5nID09PSB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmZvckVhY2goKERldGFpbCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGlmICghRGV0YWlsLkFscmVhZHlFeGlzdGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuQWRkQmFnZ2VnZURldGFpbHNhcnJheS5pbmRleE9mKERldGFpbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQWRkQmFnZ2FnZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJpbnRlclJlc3BvbnNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChkYXRhLkVycm9yc1swXS5NZXNzYWdlKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuRXJyb3JzICE9IG51bGwgJiYgZGF0YS5FcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5FcnJvcnMuZmlsdGVyKG0gPT4gbS5NZXNzYWdlLmluZGV4T2YoXCJCQUcgVEFHIFBSSU5UIEZBSUxFRFwiKSA+PSAwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJuaWpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkgPSB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkuZmlsdGVyKG0gPT4gbS5BbHJlYWR5RXhpc3RpbmcgPT09IHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmZvckVhY2goKERldGFpbCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBpZiAoIURldGFpbC5BbHJlYWR5RXhpc3RpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmluZGV4T2YoRGV0YWlsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQWRkQmFnZ2FnZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldEJhZ1RhZyhudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLkdldFBhc3Nlbmdlcih0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUGFzc2VuZ2VyWzBdLk9yZGVySUQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0UGFzc2VuZ2VyKDxPcmRlci5Sb290T2JqZWN0PmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNjVGFibGU6IGFueVtdID0gdGhpcy5fc2hhcmVkLkdldFN0YXJ0dXBUYWJsZSgpLlRhYmxlcy5TZWN1cml0eUNvZGVUYWJsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb0ZsaWdodFdpdGhQYXhUZW1wbGF0ZSh0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCksIG51bGwsIHNjVGFibGUsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlBhc3Nlbmdlci5mb3JFYWNoKChwYXhEYXRhLCBwYXhJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXhEYXRhLlJQSCA9PSB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5SUEgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwgPSBwYXhEYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsd2VpZ2h0ID0gcGF4RGF0YS5Vbml0T2ZNZWFzdXJlUXVhbnRpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWx3ZWlnaHRjb2RlID0gcGF4RGF0YS5Vbml0T2ZNZWFzdXJlQ29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YW5kYXJkcHJvZHVjdHNMaXN0LnB1c2goXCJTdGFuZGFyZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0QmFnZ2FnZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmFibGVBZGRCYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsICE9IG51bGwgJiYgdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuQmFnQ291bnQgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zaGFyZWQuR2V0QmFnVGFnKCkgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkFkZEJhZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQWRkQmFnZ2FnZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NoYXJlZC5HZXRCYWdUYWcoKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQWRkRXhpc3RpbmdCYWdnYWdlKHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLkJhZ2dhZ2VJbmZvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BZGRCYWcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkFkZEV4aXN0aW5nQmFnZ2FnZSh0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5CYWdnYWdlSW5mbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQWRkQmFnZ2FnZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuQWRkRXhpc3RpbmdCYWdnYWdlKHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLkJhZ2dhZ2VJbmZvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZG50IGZpbmQgaW5mb3JtYXRpb24gZm9yIHRoaXMgT3JkZXJJRCBcIiArIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGVycm9yTWVzc2FnZSA9IGVycm9yLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGVycm9yTWVzc2FnZS5pbmRleE9mKFwiVW5yZWNvZ25pemVkIHRva2VuICc8J1wiKSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRpdGxlOiBcIlNlc3Npb24gVGltZSBPdXRcIixcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIG1lc3NhZ2U6IFwiWW91ciBzZXNzaW9uIGhhcyBiZWVuIHRpbWUgb3V0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBkaWFsb2dzLmFsZXJ0KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMubmF2aWdhdGVUb0xvZ2luKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldEJhZ1RhZyhudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLkdldFBhc3Nlbmdlcih0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUGFzc2VuZ2VyWzBdLk9yZGVySUQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0UGFzc2VuZ2VyKDxPcmRlci5Sb290T2JqZWN0PmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNjVGFibGU6IGFueVtdID0gdGhpcy5fc2hhcmVkLkdldFN0YXJ0dXBUYWJsZSgpLlRhYmxlcy5TZWN1cml0eUNvZGVUYWJsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb0ZsaWdodFdpdGhQYXhUZW1wbGF0ZSh0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCksIG51bGwsIHNjVGFibGUsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlBhc3Nlbmdlci5mb3JFYWNoKChwYXhEYXRhLCBwYXhJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXhEYXRhLlJQSCA9PSB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5SUEgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwgPSBwYXhEYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsd2VpZ2h0ID0gcGF4RGF0YS5Vbml0T2ZNZWFzdXJlUXVhbnRpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWx3ZWlnaHRjb2RlID0gcGF4RGF0YS5Vbml0T2ZNZWFzdXJlQ29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YW5kYXJkcHJvZHVjdHNMaXN0LnB1c2goXCJTdGFuZGFyZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0QmFnZ2FnZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbCAhPSBudWxsICYmIHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLkJhZ0NvdW50ID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2hhcmVkLkdldEJhZ1RhZygpICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BZGRCYWcoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkFkZEJhZ2dhZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zaGFyZWQuR2V0QmFnVGFnKCkgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkFkZEV4aXN0aW5nQmFnZ2FnZSh0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5CYWdnYWdlSW5mbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQWRkQmFnKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BZGRFeGlzdGluZ0JhZ2dhZ2UodGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuQmFnZ2FnZUluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuQWRkRXhpc3RpbmdCYWdnYWdlKHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLkJhZ2dhZ2VJbmZvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmVmcmVzaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ29udGludWVidG5FbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuQmFndGFnbWVzc2FnZSAhPSBcIiBcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gIGFsZXJ0KG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBUb2FzdC5tYWtlVGV4dChtZXNzYWdlKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KHRoaXMuQmFndGFnbWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgICAgICB2YXIgZW5kRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWFyY2hQYXhCeU9yZGVySUQgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlbmREYXRlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlYXJjaFBheEJ5T3JkZXJJRCBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShlbmREYXRlKSwgbmV3IERhdGUoZW5kRGF0ZSkpKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubmF2aWdhdGVCdXR0b25FbmFibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgUHJpbnRFbWFpbFNlcnZpY2UoUmVtYWtyZXF1ZXN0OiBhbnkpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9wcmludGVtYWlsLlJlbWFya3MoUmVtYWtyZXF1ZXN0KS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMucHJpbnRlclJlc3BvbnNlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwcmludGVyUmVzcG9uc2UoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLkJhZ3RhZ0xpc3QuU2VnbWVudFRyYXZlbGVySW5mb3MgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCkuU2VnbWVudFRyYXZlbGVySW5mb3MuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LlBhc3NlbmdlclJQSCA9PSB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5SUEgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCkuU2VnbWVudFRyYXZlbGVySW5mb3NbaW5kZXhdLkJhZ2dhZ2VJbmZvID0gdGhpcy5CYWd0YWdMaXN0LlNlZ21lbnRUcmF2ZWxlckluZm9zWzBdLkJhZ2dhZ2VJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKS5TZWdtZW50VHJhdmVsZXJJbmZvc1tpbmRleF0uQmFnZ2FnZUluZm8uQ2hlY2tlZEJhZ1dlaWdodFRvdGFsID0gdGhpcy5CYWd0YWdMaXN0Lk1hbnVhbEJhZ1RhZy5CYWdnYWdlSW5mby5DaGVja2VkQmFnV2VpZ2h0VG90YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpLlNlZ21lbnRUcmF2ZWxlckluZm9zW2luZGV4XS5CYWdnYWdlSW5mby5Vbml0T2ZNZWFzdXJlUXVhbnRpdHkgPSB0aGlzLkJhZ3RhZ0xpc3QuTWFudWFsQmFnVGFnLkJhZ2dhZ2VJbmZvLkNoZWNrZWRCYWdXZWlnaHRUb3RhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuU2hhcmVkQmFnID0gdGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpLlNlZ21lbnRUcmF2ZWxlckluZm9zO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLkJhZ3RhZ21lc3NhZ2UgPSBcIiBcIjtcclxuICAgICAgICBpZiAodGhpcy5CYWd0YWdMaXN0Lldhcm5pbmdzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5CYWd0YWdMaXN0Lldhcm5pbmdzLmZvckVhY2goKG1zZywgSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5CYWd0YWdtZXNzYWdlID0gdGhpcy5CYWd0YWdtZXNzYWdlICsgXCIgIFwiICsgbXNnLk1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChtc2cuTWVzc2FnZSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgLy8gVG9hc3QubWFrZVRleHQodGhpcy5CYWd0YWdtZXNzYWdlKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5yZWZyZXNoKSB7XHJcblxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuQmFndGFnTGlzdC5NYW51YWxCYWdUYWcgIT0gbnVsbCAmJiB0aGlzLkJhZ3RhZ0xpc3QuTWFudWFsQmFnVGFnLkJhZ2dhZ2VJbmZvICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLkJhZ3RhZ0xpc3QuTWFudWFsQmFnVGFnLkJhZ2dhZ2VJbmZvLkNoZWNrZWRCYWdDb3VudFRvdGFsICE9IG51bGwgJiYgdGhpcy5CYWd0YWdMaXN0Lk1hbnVhbEJhZ1RhZy5CYWdnYWdlSW5mby5DaGVja2VkQmFnQ291bnRUb3RhbCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuQmFnZ2FnZUluZm8gPSB0aGlzLkJhZ3RhZ0xpc3QuTWFudWFsQmFnVGFnLkJhZ2dhZ2VJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQWRkTWFudWFsQmFnZ2FnZSh0aGlzLkJhZ3RhZ0xpc3QuTWFudWFsQmFnVGFnLkJhZ2dhZ2VJbmZvKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQWRkQmFnZ2VnZURldGFpbHNhcnJheSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQWRkQmFnZ2FnZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5ID0gW107XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLkFkZEJhZ2dhZ2UoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLkJhZ3RhZ0xpc3QuRXJyb3JzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dCh0aGlzLkJhZ3RhZ0xpc3QuRXJyb3JzWzBdLk1lc3NhZ2UpLnNob3coKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5ID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jYXJ0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5QYWlkID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IHNjVGFibGU6IGFueVtdID0gdGhpcy5fc2hhcmVkLkdldFN0YXJ0dXBUYWJsZSgpLlRhYmxlcy5TZWN1cml0eUNvZGVUYWJsZTtcclxuICAgICAgICBsZXQgUGFzc2VuZ2VyQXJyYXk6IGFueSA9IENvbnZlcnRlcnMuQ29udmVydFRvRmxpZ2h0V2l0aFBheFRlbXBsYXRlKHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKSwgbnVsbCwgc2NUYWJsZSwgXCJcIik7XHJcbiAgICAgICAgY29uc29sZS5kaXIodGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpKTtcclxuICAgICAgICBjb25zb2xlLmRpcihQYXNzZW5nZXJBcnJheSk7XHJcbiAgICAgICAgaWYgKFBhc3NlbmdlckFycmF5LlNlZ21lbnQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBQYXNzZW5nZXJBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlBhc3Nlbmdlci5mb3JFYWNoKChwYXhEYXRhLCBwYXhJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBheERhdGEuUlBIID09IHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLlJQSCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWx3ZWlnaHQgPSBwYXhEYXRhLlVuaXRPZk1lYXN1cmVRdWFudGl0eTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsd2VpZ2h0Y29kZSA9IHBheERhdGEuVW5pdE9mTWVhc3VyZUNvZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJSZWNvcmQgTm90IEZvdW5kXCIpLnNob3coKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBQcmludEZhaWwoYmFndGFnRWxlbWVudCwgYmFndGFnTGlzdCkge1xyXG4gICAgICAgIGxldCBSZW1ha3JlcXVlc3Q6IGFueSA9IENvbnZlcnRlcnMuQmx1ZXRvb3RoUHJpbnRlclJlc3BvbnNlKGJhZ3RhZ0VsZW1lbnQsIGJhZ3RhZ0xpc3QsIGZhbHNlKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShSZW1ha3JlcXVlc3QpKTtcclxuICAgICAgICB0aGlzLl9wcmludGVtYWlsLlJlbWFya3MoUmVtYWtyZXF1ZXN0KS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuQWRkQmFnZ2VnZURldGFpbHNhcnJheS5mb3JFYWNoKChEZXRhaWwsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIURldGFpbC5BbHJlYWR5RXhpc3RpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkuaW5kZXhPZihEZXRhaWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQWRkQmFnZ2VnZURldGFpbHNhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuQWRkQmFnZ2VnZURldGFpbHNhcnJheSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgdGhpcy5BZGRCYWdnYWdlKCk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKS5TZWdtZW50VHJhdmVsZXJJbmZvcyA9IHRoaXMuU2hhcmVkQmFnO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgLy8gdGhpcy5wcmludGVyUmVzcG9uc2UoKTtcclxuICAgICAgICB9LCBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgLy8gdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmZvckVhY2goKERldGFpbCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgLy8gICAgIGlmICghRGV0YWlsLkFscmVhZHlFeGlzdGluZykge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuQWRkQmFnZ2VnZURldGFpbHNhcnJheS5pbmRleE9mKERldGFpbCk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgIC8vIH0pXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0UHJpbnRlcigpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChBcHBsaWNhdGlvblNldHRpbmdzLmhhc0tleShcInByaW50ZXJcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwicHJpbnRlclwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVtb3ZlKGl0ZW06IGJhZ2dhZ2VUZW1wbGF0ZS5BZGRCYWdnZWdlRGV0YWlscykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlIHJlbW92ZTpcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuaXNSZW1vdmVCdG5FbmFibGVkKSArIFwiUjpcIiArIEpTT04uc3RyaW5naWZ5KGl0ZW0uQWxyZWFkeUV4aXN0aW5nKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJpbnNpZGUgcmVtb3ZlOlwiICsgSlNPTi5zdHJpbmdpZnkoaXRlbS5zdGF0dXMpKTtcclxuICAgICAgICBpZiAodGhpcy5pc1JlbW92ZUJ0bkVuYWJsZWQgfHwgIWl0ZW0uQWxyZWFkeUV4aXN0aW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLnN0YXR1cyAhPSBcIkNoZWNrZWRJblwiICYmIGl0ZW0uc3RhdHVzICE9IFwiUGVuZGluZyBEZWxldGVcIikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmluZGV4T2YoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkuZmlsdGVyKG0gPT4gbS5BbHJlYWR5RXhpc3RpbmcgPT0gZmFsc2UpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLkNoZWNraW5TdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmZpbHRlcihtID0+IG0uc3RhdHVzID09ICcnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmFibGVSZW1vdmVCYWcgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZVJlbW92ZUJhZyA9IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkuZmlsdGVyKG0gPT4gbS5BbHJlYWR5RXhpc3RpbmcgPT0gZmFsc2UpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkJhZ3RhZ0VsZW1lbnQgPSBDb252ZXJ0ZXJzLkdldEJhZ1RhZyh0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbCwgdGhpcy5GbGlnaHRJbmZvLCB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXksIHRoaXMuRmxpZ2h0SW5mbywgdGhpcy5TaG9ydENoZWNrQWlycG9ydENvZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBQYXNzZW5nZXJMaXN0OiBhbnkgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2hhcmVkLkdldEJhZ1RhZygpICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUGFzc2VuZ2VyTGlzdCA9IHRoaXMuX3NoYXJlZC5HZXRCYWdUYWcoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFBhc3Nlbmdlckxpc3QubGVuZ3RoID4gMCAmJiBQYXNzZW5nZXJMaXN0LmZpbHRlcihtID0+IG0uUlBIID09IHRoaXMuQmFndGFnRWxlbWVudC5QYXNzZW5nZXJMaXN0WzBdLlJQSCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBQYXNzZW5nZXJMaXN0LmZpbHRlcihtID0+IG0uUlBIID09IHRoaXMuQmFndGFnRWxlbWVudC5QYXNzZW5nZXJMaXN0WzBdLlJQSClbMF0gPSB0aGlzLkJhZ3RhZ0VsZW1lbnQuUGFzc2VuZ2VyTGlzdFswXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBQYXNzZW5nZXJMaXN0LnNwbGljZShQYXNzZW5nZXJMaXN0LmluZGV4T2YoUGFzc2VuZ2VyTGlzdC5maWx0ZXIobSA9PiBtLlJQSCA9PSB0aGlzLkJhZ3RhZ0VsZW1lbnQuUGFzc2VuZ2VyTGlzdFswXS5SUEgpWzBdKSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFBhc3Nlbmdlckxpc3QucHVzaCh0aGlzLkJhZ3RhZ0VsZW1lbnQuUGFzc2VuZ2VyTGlzdFswXSlcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQYXNzZW5nZXJMaXN0LnB1c2godGhpcy5CYWd0YWdFbGVtZW50LlBhc3Nlbmdlckxpc3RbMF0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuQ2hlY2tpblN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0QmFnVGFnKFBhc3Nlbmdlckxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldEJhZ1RhZyhudWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbmFibGVSZW1vdmVCYWcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzUmVtb3ZlQmFnID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZUFkZEJhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3RhdHVzID0gXCJQZW5kaW5nIERlbGV0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDb250aW51ZWJ0bkVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVuYWJsZVJlbW92ZUJhZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc1JlbW92ZUJhZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnN0YXR1cyA9IFwiUGVuZGluZyBEZWxldGVcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNDb250aW51ZWJ0bkVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlQWRkQmFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlQWxsKCkge1xyXG4gICAgICAgIHRoaXMuQWRkQmFnZ2VnZURldGFpbHNhcnJheS5mb3JFYWNoKChEZXRhaWwsIEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChEZXRhaWwuc3RhdHVzICE9IFwiQ2hlY2tlZEluXCIgJiYgRGV0YWlsLnN0YXR1cyAhPSBcIlBlbmRpbmcgRGVsZXRlXCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuQWRkQmFnZ2VnZURldGFpbHNhcnJheS5pbmRleE9mKERldGFpbCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkuZmlsdGVyKG0gPT4gbS5BbHJlYWR5RXhpc3RpbmcgPT0gZmFsc2UpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vICAgICBEZXRhaWwuc3RhdHVzID0gXCJQZW5kaW5nIERlbGV0ZVwiO1xyXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5pc0NvbnRpbnVlYnRuRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICAgIHB1YmxpYyBvdmVyc2l6ZUNoZWNrKGFyZ3M6IGFueSkge1xyXG4gICAgICAgIC8vIGFyZ3MuT3ZlcnNpemUgPSAhYXJncy5PdmVyc2l6ZTtcclxuICAgICAgICAvLyBpZiAodGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LmZpbHRlcihtID0+IG0uT3ZlcnNpemUgPT0gdHJ1ZSkubGVuZ3RoID4gdGhpcy5GQkEpIHtcclxuICAgICAgICAvLyAgICAgVG9hc3QubWFrZVRleHQoXCJNYXhpbXVtIG51bWJlciBvZiBvdmVyc2l6ZWQgYmFnZ2FnZSByZWFjaGVkLkV4dHJhIGJhZ2dhZ2UgbmVlZHMgdG8gYmUgdHJhbnNwb3J0ZWQgYXMgY2FyZ28uXCIpLnNob3coKTtcclxuICAgICAgICAvLyAgICAgYXJncy5PdmVyc2l6ZSA9IGZhbHNlO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBhbGVydChcImJhZ2dhZ2UgZmVlcyBjdXJyZW50bHkgbm90IHN1cHBvcnRlZCAtIGNvbnRhY3QgY2hlY2staW4gZGVza1wiKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBvbm9wZW4oKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEcm9wIERvd24gb3BlbmVkLlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBpc0l0ZW1WaXNpYmxlKGFyZ3MpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICBpZiAoYXJncy50b1N0cmluZygpLnN1YnN0cigwLCAyKSA9PSAnQ00nICYmIGFyZ3MudG9TdHJpbmcoKS5sZW5ndGggPD0gNSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJ2aXNpYmxlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgcmV0dXJuIFwiY29sbGFwc2VkXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYnRuY2xpY2tlZChjYXJkVHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKGNhcmRUeXBlID09IFwiQ2FzaFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FzaCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZENhcmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5jQ2FyZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnBheW1lbnRDYXJkRGV0YWlscyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGNhcmRUeXBlID09IFwiQ0NhcmRcIikge1xyXG4gICAgICAgICAgICB0aGlzLmNhc2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5kQ2FyZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmNDYXJkID0gdHJ1ZTtcclxuICAgICAgICAgICAgLy8gbGV0IG9wdGlvbnM6IE1vZGFsRGlhbG9nT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgLy8gICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMudmNSZWYsXHJcbiAgICAgICAgICAgIC8vICAgICBjb250ZXh0OiBbXSxcclxuICAgICAgICAgICAgLy8gICAgIGZ1bGxzY3JlZW46IGZhbHNlXHJcbiAgICAgICAgICAgIC8vIH07XHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzLl9tb2RhbFNlcnZpY2Uuc2hvd01vZGFsKFBheW1lbnRDb21wb25lbnQsIG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC8vICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5wYXltZW50Q2FyZERldGFpbHMgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIHRoaXMuY29uZmlybShudWxsKTtcclxuICAgICAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgICAgICAvLyB0aGlzLmRpc3BsYXlTY2FuT3B0aW9uRGlhbG9nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGNhcmRUeXBlID09IFwiRENhcmRcIikge1xyXG4gICAgICAgICAgICB0aGlzLmNhc2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5kQ2FyZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuY0NhcmQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjYXJ0Y2xpY2tlZChidG46IGFueSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2xpY2tlZFwiICsgYnRuKTtcclxuICAgICAgICBpZiAoYnRuID09IFwiMlwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FydCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5jYXJ0ID0gZmFsc2U7XHJcbiAgICAgICAgLy8gICAgdGhpcy52aXNpYmlsZVZhcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHZpc2liaWxlVmFyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FydCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAndmlzaWJsZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgcmV0dXJuICdjb2xsYXBzZWQnO1xyXG4gICAgfVxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgdGhpcy5jYXJ0ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBjb25maXJtKHBheW1lbnREYXRhaWw6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgICAgICB2YXIgUm9vdE9iamVjdDogUGF5bWVudERhdGEuUm9vdE9iamVjdCA9IG51bGw7XHJcbiAgICAgICAgICAgIFJvb3RPYmplY3QgPSBuZXcgUGF5bWVudERhdGEuUm9vdE9iamVjdCgpO1xyXG4gICAgICAgICAgICAvL1Jvb3RPYmplY3QuU2VnbWVudHMgPSBbbmV3IFBheW1lbnREYXRhLlNlZ21lbnRzKCldO1xyXG4gICAgICAgICAgICAvLyBSb290T2JqZWN0LlBhc3NlbmdlcnMgPSBbbmV3IFBheW1lbnREYXRhLlBhc3NlbmdlcnMoKV07XHJcbiAgICAgICAgICAgIC8vIFJvb3RPYmplY3QuUGF5bWVudHMgPSBbbmV3IFBheW1lbnREYXRhLlBheW1lbnQoKV07XHJcbiAgICAgICAgICAgIC8vIFJvb3RPYmplY3QuU2VydmljZXMgPSBbbmV3IFBheW1lbnREYXRhLlNlcnZpY2VzKCldO1xyXG4gICAgICAgICAgICBSb290T2JqZWN0LlJlY2VpcHREZWxpdmVyeSA9IG5ldyBQYXltZW50RGF0YS5SZWNlaXB0RGVsaXZlcnkoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHZhciAgcGF5bWVudEFkZHJlc3M6IFBheW1lbnREYXRhLiBQYXltZW50QWRkcmVzcyA9IG51bGw7XHJcbiAgICAgICAgICAgIC8vIHBheW1lbnRBZGRyZXNzID0gbmV3IFBheW1lbnREYXRhLiBQYXltZW50QWRkcmVzcygpO1xyXG4gICAgICAgICAgICB2YXIgcGF5bWVudDogUGF5bWVudERhdGEuUGF5bWVudDtcclxuICAgICAgICAgICAgcGF5bWVudCA9IG5ldyBQYXltZW50RGF0YS5QYXltZW50KCk7XHJcbiAgICAgICAgICAgIHZhciBhbW91bnQgPSBcIjBcIjtcclxuICAgICAgICAgICAgdmFyIEN1cnJlbmN5O1xyXG4gICAgICAgICAgICB0aGlzLkFkZEJhZ2dlZ2VEZXRhaWxzYXJyYXkuZmlsdGVyKG0gPT4gbS5mZWVzICE9IG51bGwpLmZvckVhY2goKEJhZ2dlZ2VEZXRhaWwsIERldGFpbG5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIGFtb3VudCA9IGFtb3VudCArIEJhZ2dlZ2VEZXRhaWwuZmVlcy5zcGxpdCgnICcpWzBdO1xyXG4gICAgICAgICAgICAgICAgQ3VycmVuY3kgPSBCYWdnZWdlRGV0YWlsLmZlZXMuc3BsaXQoJyAnKVsxXTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgUm9vdE9iamVjdC5PcmRlcklkID0gdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuT3JkZXJJRDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBheW1lbnRDYXJkRGV0YWlscyAhPSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNhcmREYXRhID0gbmV3IFBheW1lbnREYXRhLlBheW1lbnQoKTtcclxuICAgICAgICAgICAgICAgIGNhcmREYXRhLlR5cGUgPSB0aGlzLnBheW1lbnRDYXJkRGV0YWlscy5wYXltZW50VHlwZTtcclxuICAgICAgICAgICAgICAgIGNhcmREYXRhLkNhcmRDb2RlID0gdGhpcy5wYXltZW50Q2FyZERldGFpbHMuY2FyZFR5cGU7XHJcbiAgICAgICAgICAgICAgICBjYXJkRGF0YS5DdXJyZW5jeUNvZGUgPSBDdXJyZW5jeTtcclxuICAgICAgICAgICAgICAgIGNhcmREYXRhLkFtb3VudCA9IGFtb3VudC50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgY2FyZERhdGEuTWFza2VkQ2FyZE51bWJlciA9IHRoaXMucGF5bWVudENhcmREZXRhaWxzLmNhcmROdW1iZXI7XHJcbiAgICAgICAgICAgICAgICBjYXJkRGF0YS5BcHByb3ZhbENvZGUgPSB0aGlzLnBheW1lbnRDYXJkRGV0YWlscy5jdnY7XHJcbiAgICAgICAgICAgICAgICBjYXJkRGF0YS5TZWN1cml0eUNvZGUgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgY2FyZERhdGEuQ2FyZElzc3VlckJhbmtJRCA9IFwiTVhcIjtcclxuICAgICAgICAgICAgICAgIHZhciBtb250aCA9IHRoaXMucGF5bWVudENhcmREZXRhaWxzLmV4cGlyeURhdGU7XHJcbiAgICAgICAgICAgICAgICB2YXIgeWVhciA9IHRoaXMucGF5bWVudENhcmREZXRhaWxzLmV4cGlyeURhdGU7XHJcbiAgICAgICAgICAgICAgICBjYXJkRGF0YS5FeHBpcmF0aW9uRGF0ZU1NWVkgPSBtb250aC5zdWJzdHIoMCwgMikgKyB5ZWFyLnN1YnN0cigyLCA2KTtcclxuICAgICAgICAgICAgICAgIGNhcmREYXRhLkNhcmRIb2xkZXJOYW1lID0gdGhpcy5wYXltZW50Q2FyZERldGFpbHMuY2FyZEhvbGRlcjtcclxuICAgICAgICAgICAgICAgIGNhcmREYXRhLkZpcnN0TmFtZSA9IHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLkZpcnN0TmFtZTtcclxuICAgICAgICAgICAgICAgIGNhcmREYXRhLkxhc3ROYW1lID0gdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuTGFzdE5hbWU7XHJcbiAgICAgICAgICAgICAgICBjYXJkRGF0YS5CaWxsaW5nQWRkcmVzcyA9IG5ldyBQYXltZW50RGF0YS5QYXltZW50QWRkcmVzcygpO1xyXG4gICAgICAgICAgICAgICAgY2FyZERhdGEuQmlsbGluZ0FkZHJlc3MuQWRkcmVzc0xpbmUgPSB0aGlzLnBheW1lbnRDYXJkRGV0YWlscy5hZGRyZXNzO1xyXG4gICAgICAgICAgICAgICAgY2FyZERhdGEuQmlsbGluZ0FkZHJlc3MuQ2l0eSA9IHRoaXMucGF5bWVudENhcmREZXRhaWxzLmNpdHk7O1xyXG4gICAgICAgICAgICAgICAgY2FyZERhdGEuQmlsbGluZ0FkZHJlc3MuU3RhdGVDb2RlID0gdGhpcy5wYXltZW50Q2FyZERldGFpbHMuc3RhdGU7XHJcbiAgICAgICAgICAgICAgICBjYXJkRGF0YS5CaWxsaW5nQWRkcmVzcy5Qb3N0YWxDb2RlID0gdGhpcy5wYXltZW50Q2FyZERldGFpbHMuemlwY29kZTtcclxuICAgICAgICAgICAgICAgIGNhcmREYXRhLkJpbGxpbmdBZGRyZXNzLkNvdW50cnlDb2RlID0gdGhpcy5wYXltZW50Q2FyZERldGFpbHMuY291bnRyeTtcclxuICAgICAgICAgICAgICAgIFJvb3RPYmplY3QuUGF5bWVudHMucHVzaChjYXJkRGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHBhc3NlbmdlciA9IG5ldyBQYXltZW50RGF0YS5QYXNzZW5nZXJzKCk7XHJcbiAgICAgICAgICAgIHBhc3Nlbmdlci5GaXJzdG5hbWUgPSB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5GaXJzdE5hbWU7XHJcbiAgICAgICAgICAgIHBhc3Nlbmdlci5MYXN0bmFtZSA9IHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLkxhc3ROYW1lO1xyXG4gICAgICAgICAgICBwYXNzZW5nZXIuUGFzc2VuZ2VyVHlwZUNvZGUgPSB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5QYXNzZW5nZXJUeXBlO1xyXG4gICAgICAgICAgICBwYXNzZW5nZXIuUlBIID0gdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuUlBIO1xyXG4gICAgICAgICAgICBSb290T2JqZWN0LlBhc3NlbmdlcnMucHVzaChwYXNzZW5nZXIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNlZ21lbnQgPSBuZXcgUGF5bWVudERhdGEuU2VnbWVudHMoKTtcclxuICAgICAgICAgICAgc2VnbWVudC5BcnJpdmFsRGF0ZVRpbWUgPSBtb21lbnQodGhpcy5GbGlnaHRJbmZvLkFycml2YWxEYXRlVGltZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSArIFwiVFwiICsgdGhpcy5GbGlnaHRJbmZvLkVUQSArIFwiOjAwXCI7XHJcbiAgICAgICAgICAgIHNlZ21lbnQuRGVwYXJ0dXJlRGF0ZVRpbWUgPSBtb21lbnQodGhpcy5GbGlnaHRJbmZvLkRlcGFydHVyZURhdGVUaW1lKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpICsgXCJUXCIgKyB0aGlzLkZsaWdodEluZm8uRVREICsgXCI6MDBcIjtcclxuICAgICAgICAgICAgbGV0IG9yaWdpbkNvZGUgPSBuZXcgUGF5bWVudERhdGEuT3JpZ2luKCk7XHJcbiAgICAgICAgICAgIG9yaWdpbkNvZGUuTG9jYXRpb25Db2RlID0gdGhpcy5GbGlnaHRJbmZvLk9yaWdpbjtcclxuICAgICAgICAgICAgc2VnbWVudC5PcmlnaW4gPSBvcmlnaW5Db2RlO1xyXG4gICAgICAgICAgICBsZXQgZGVzdGluYXRpb25Db2RlID0gbmV3IFBheW1lbnREYXRhLk9yaWdpbigpO1xyXG4gICAgICAgICAgICBkZXN0aW5hdGlvbkNvZGUuTG9jYXRpb25Db2RlID0gdGhpcy5GbGlnaHRJbmZvLkRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgICBzZWdtZW50LkRlc3RpbmF0aW9uID0gZGVzdGluYXRpb25Db2RlO1xyXG4gICAgICAgICAgICBzZWdtZW50LlJQSCA9IHRoaXMuRmxpZ2h0SW5mby5SUEg7XHJcbiAgICAgICAgICAgIHNlZ21lbnQuRmxpZ2h0ID0gdGhpcy5GbGlnaHRJbmZvLk1hcmtldGluZ0ZsaWdodDtcclxuICAgICAgICAgICAgc2VnbWVudC5PcGVyYXRpbmdGbGlnaHQgPSBudWxsO1xyXG4gICAgICAgICAgICBzZWdtZW50Lkhhc1N0b3BvdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgUm9vdE9iamVjdC5TZWdtZW50cy5wdXNoKHNlZ21lbnQpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNlcnZpY2VEZXRhaWxzID0gbmV3IFBheW1lbnREYXRhLlNlcnZpY2VzKCk7XHJcbiAgICAgICAgICAgIHNlcnZpY2VEZXRhaWxzLnNlbGVjdGVkU2VydmljZSA9IG5ldyBQYXltZW50RGF0YS5TZWxlY3RlZFNlcnZpY2UoKTtcclxuICAgICAgICAgICAgc2VydmljZURldGFpbHMudGlja2V0TnVtYmVyID0gdGhpcy50aWNrZXROdW1iZXIudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgc2VydmljZURldGFpbHMucGFzc2VuZ2VyUlBIID0gdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuUlBIO1xyXG4gICAgICAgICAgICBzZXJ2aWNlRGV0YWlscy5jdXJyZW5jeUNvZGUgPSBDdXJyZW5jeTtcclxuICAgICAgICAgICAgdmFyIHJwaEl0ZW06IGFueSA9IHRoaXMuRmxpZ2h0SW5mby5TZWdtZW50UlBIO1xyXG4gICAgICAgICAgICBzZXJ2aWNlRGV0YWlscy5TZWdtZW50UlBILnB1c2gocnBoSXRlbSk7XHJcbiAgICAgICAgICAgIHNlcnZpY2VEZXRhaWxzLmFtb3VudCA9IHRoaXMudG90YWxBbW91bnQudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgc2VydmljZURldGFpbHMuRW1kVGF4ZXMgPSBbXTtcclxuICAgICAgICAgICAgc2VydmljZURldGFpbHMuc2VsZWN0ZWRTZXJ2aWNlLkVtZFR5cGUgPSB0aGlzLkNhdGFsb2dTZXJ2aWNlRGV0YWlsLlN1YlR5cGU7XHJcbiAgICAgICAgICAgIHNlcnZpY2VEZXRhaWxzLnNlbGVjdGVkU2VydmljZS5Jc1JlZnVuZGFibGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgc2VydmljZURldGFpbHMuc2VsZWN0ZWRTZXJ2aWNlLk5vb2ZJdGVtcyA9IFwiMVwiO1xyXG4gICAgICAgICAgICBzZXJ2aWNlRGV0YWlscy5zZWxlY3RlZFNlcnZpY2UuUkZJU0NfY29kZSA9IHRoaXMuQ2F0YWxvZ1NlcnZpY2VEZXRhaWwuUkZJQztcclxuICAgICAgICAgICAgc2VydmljZURldGFpbHMuc2VsZWN0ZWRTZXJ2aWNlLlJGSVNDX3N1YkNvZGUgPSB0aGlzLkNhdGFsb2dTZXJ2aWNlRGV0YWlsLkNvZGU7XHJcbiAgICAgICAgICAgIHNlcnZpY2VEZXRhaWxzLnNlbGVjdGVkU2VydmljZS5TU1JDb2RlID0gdGhpcy5DYXRhbG9nU2VydmljZURldGFpbC5TU1JDb2RlO1xyXG4gICAgICAgICAgICBzZXJ2aWNlRGV0YWlscy5zZWxlY3RlZFNlcnZpY2UuVHlwZU9mU2VydmljZSA9IHRoaXMuQ2F0YWxvZ1NlcnZpY2VEZXRhaWwuU2VydmljZUNvZGU7XHJcbiAgICAgICAgICAgIHNlcnZpY2VEZXRhaWxzLnNlbGVjdGVkU2VydmljZS5jb21tZXJjaWFsTmFtZSA9IHRoaXMuQ2F0YWxvZ1NlcnZpY2VEZXRhaWwuTmFtZTtcclxuICAgICAgICAgICAgUm9vdE9iamVjdC5TZXJ2aWNlcy5wdXNoKHNlcnZpY2VEZXRhaWxzKTtcclxuXHJcbiAgICAgICAgICAgIFJvb3RPYmplY3QuUmVjZWlwdERlbGl2ZXJ5LmdhdGV3YXkgPSBcIkVNQUlMXCI7XHJcbiAgICAgICAgICAgIFJvb3RPYmplY3QuUmVjZWlwdERlbGl2ZXJ5Lkxhbmd1YWdlSUQgPSBudWxsO1xyXG4gICAgICAgICAgICBSb290T2JqZWN0LlJlY2VpcHREZWxpdmVyeS5OYW1lID0gdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuRmlyc3RuYW1lO1xyXG4gICAgICAgICAgICBsZXQgZW1haWxJZCA9IG5ldyBQYXltZW50RGF0YS5FbWFpbCgpO1xyXG4gICAgICAgICAgICBlbWFpbElkLmVtYWlsQWRkcmVzcyA9IFwibm9yZXBseUBocGUuY29tXCI7XHJcbiAgICAgICAgICAgIFJvb3RPYmplY3QuUmVjZWlwdERlbGl2ZXJ5LmVtYWlsLnB1c2goZW1haWxJZCk7XHJcbiAgICAgICAgICAgIFJvb3RPYmplY3QuUmVjZWlwdERlbGl2ZXJ5LnBob25lbnVtYmVyID0gbnVsbDtcclxuICAgICAgICAgICAgUm9vdE9iamVjdC5SZWNlaXB0RGVsaXZlcnkucHJpbnRlckFkZHJlc3MgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5kaXIoUm9vdE9iamVjdCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXltZW50U2VydmljZS5Qb3N0UGF5bWVudChSb290T2JqZWN0LCBcIlwiKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlN1Y2Nlc3MgIT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0OiBhbnkgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LlBhc3NlbmdlckRvY3VtZW50c1swXS5QYXNzZW5nZXJEb2N1bWVudFswXS5TdGF0dXMgPT0gXCJJc3N1ZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QYWlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5CYWd0YWdFbGVtZW50ID0gQ29udmVydGVycy5HZXRCYWdUYWcodGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwsIHRoaXMuRmxpZ2h0SW5mbywgdGhpcy5BZGRCYWdnZWdlRGV0YWlsc2FycmF5LCB0aGlzLkZsaWdodEluZm8sIHRoaXMuU2hvcnRDaGVja0FpcnBvcnRDb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQmFnVGFnKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsQW1vdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQW1vdW50QXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhc2ggPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY0NhcmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FydCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NhcnRCdXR0b25FbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnRvdGFsQW1vdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvck1lc3NhZ2UpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZG50IGZpbmQgaW5mb3JtYXRpb24gZm9yIHRoaXMgT3JkZXJJRCBcIiArIGVycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJVbnJlY29nbml6ZWQgdG9rZW4gJzwnXCIpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aXRsZTogXCJTZXNzaW9uIFRpbWUgT3V0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGJlZW4gdGltZSBvdXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMubmF2aWdhdGVUb0xvZ2luKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0KFwic3VjZXNzXCIpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBjaGVja1BheW1lbnQoKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodGhpcy5QYWlkID09IHRydWUpIHtcclxuICAgICAgICAgICAgLy90aGlzLkJhZ1RhZygpO1xyXG4gICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gJ3Zpc2libGUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHJldHVybiAnY29sbGFwc2VkJztcclxuICAgIH1cclxuICAgIC8vIHB1YmxpYyBsaXN0dmlld0xvYWRlZCgpIHtcclxuICAgIC8vICAgICBjb25zb2xlLmxvZyhcImxpc3R2aWV3IGxvYWRlZCBcIik7XHJcbiAgICAvLyAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgLy8gICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gICAgICAgICB2YXIgbGlzdFZpZXc6IFZpZXcgPSA8U3RhY2tMYXlvdXQ+dGhhdC5wYWdlLmdldFZpZXdCeUlkKFwibHZcIik7XHJcbiAgICAvLyAgICAgICAgIC8vIHZhciBsaXN0VmlldyA9IHRoaXMubHYubmF0aXZlRWxlbWVudDtcclxuICAgIC8vICAgICAgICAgdmFyIGluZGV4ID0gdGhhdC5BZGRCYWdnZWdlRGV0YWlsc2FycmF5Lmxlbmd0aCAtIDE7XHJcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4KTtcclxuICAgIC8vICAgICAgICAgbGlzdFZpZXdbaW5kZXhdLmZvY3VzKCk7XHJcbiAgICAvLyAgICAgfSwgMSk7XHJcblxyXG4gICAgLy8gfVxyXG4gICAgbmF2aWdhdGVUb1NldHRpbmcoKSB7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcInNldHRpbmdcIl0sIHtcclxuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlU2VydmljZUVycm9yKGVycm9yOiBhbnkpIHtcclxuICAgICAgICB2YXIgZXJyb3JNZXNzYWdlID0gZXJyb3IudG9TdHJpbmcoKTtcclxuICAgICAgICBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJTZXNzaW9uVGltZW91dFwiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiU2Vzc2lvbiBUaW1lIE91dFwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGJlZW4gdGltZSBvdXRcIixcclxuICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPS1wiXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiXCJdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGVycm9yTWVzc2FnZSkuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG5hdmlnYXRlVG9Db21wZW5zYXRpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNDb21wZW5zYXRpb25FbmFibGVkID09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImNvbXBlbnNhdGlvblwiXSwge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJDb21wZW5zYXRpb24gTm90IGFwcGxpY2FibGVcIikuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG4iXX0=