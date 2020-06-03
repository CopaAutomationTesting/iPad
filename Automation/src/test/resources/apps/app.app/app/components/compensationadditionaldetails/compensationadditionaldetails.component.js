"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var page_1 = require("ui/page");
var dialogs = require("ui/dialogs");
var segmented_bar_1 = require("ui/segmented-bar");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var date_picker_modal_1 = require("../../components/date-picker/date-picker-modal");
//external modules and plugins
var ApplicationSettings = require("application-settings");
var moment = require("moment");
var Toast = require("nativescript-toast");
//app references
var index_1 = require("../../shared/interface/index");
var index_2 = require("../../shared/model/index");
var index_3 = require("../../shared/services/index");
var app_constants_1 = require("../../app.constants");
var CompensationAdditionalDetailsComponent = /** @class */ (function () {
    function CompensationAdditionalDetailsComponent(_configuration, _services, activatedRouter, _modalService, _shared, vcRef, page, routerExtensions, _timeoutService, router, _dataService, _service, route) {
        this._configuration = _configuration;
        this._services = _services;
        this.activatedRouter = activatedRouter;
        this._modalService = _modalService;
        this._shared = _shared;
        this.vcRef = vcRef;
        this.page = page;
        this.routerExtensions = routerExtensions;
        this._timeoutService = _timeoutService;
        this.router = router;
        this._dataService = _dataService;
        this._service = _service;
        this.route = route;
        this.FirstBlock = true;
        this.SecondBlock = false;
        this.ThirdBlock = false;
        this.FourthBlock = false;
        this.IsFromFlight = false;
        this.IsToFlight = false;
        this.IsMonetoryEmd = false;
        this.IsHotelEmd = false;
        this.IsMealEmd = false;
        this.copyToSelectPax = false;
        this.copyToSelectPaxReacc = false;
        this.IsTransportEmd = false;
        this.FlightHeaderInfo = new index_1.CompensationSearchModule.FlightModel();
        this.CompensationHistory = true;
        this.ReaccomodationDetails = false;
        this.CompensationDetails = false;
        this.OtherDetails = false;
        this.IssueCompensationResponse = new index_2.BRECompensation.BREResponse();
        this.IssueCompensationPaxList = [];
        this.selectedPassenger = [];
        this.firsttab = new segmented_bar_1.SegmentedBarItem();
        this.secondtab = new segmented_bar_1.SegmentedBarItem();
        this.thridtab = new segmented_bar_1.SegmentedBarItem();
        this.fourthtab = new segmented_bar_1.SegmentedBarItem();
        this.FromOneChanged = false;
        this.FromTwoChanged = false;
        this.ToOneChanged = false;
        this.ToTwoChanged = false;
        this.MonetaryText = [];
        this.HotelText = [];
        this.MealText = [];
        this.TransportText = [];
        this.IsVisibleAllTab = false;
        this.TabNotVisible = false;
        this.FromFlightOneError = false;
        this.FromDestOneError = false;
        this.FromOriginOneError = false;
        this.FromFlightTwoError = false;
        this.FromDestTwoError = false;
        this.FromOriginTwoError = false;
        this.ToFlightOneError = false;
        this.ToDestOneError = false;
        this.ToOriginOneError = false;
        this.ToFlightTwoError = false;
        this.ToDestTwoError = false;
        this.ToOriginTwoError = false;
        this.FromFlightOneNumber = "";
        this.FromFlightTwoNumber = "";
        this.ToFlightOneNumber = "";
        this.ToFlightTwoNumber = "";
        this.IsHistoryVisible = false;
        this.IsMonetaryHistoryVisible = false;
        this.IsHotelHistoryVisible = false;
        this.IsMealHistoryVisible = false;
        this.IsTransportHistoryVisible = false;
        this.isMealDetailValid = false;
        this.isTransportEMDValid = false;
        this.IsHeaderInfo = false;
        this.IsSubmitEnabled = true;
        this.EndorsmentTextMonetary = [];
        this.EndorsmentTextHotel = [];
        this.EndorsmentTextMeal = [];
        this.EndorsmentTextTransport = [];
        this.IsFlightInfo = false;
        this.IsWorldTraceValid = false;
        this.IsCustomerCareValid = false;
        this.IsMonetaryTextValid = false;
        this.IsHotelTextValid = false;
        this.IsHotelNameValid = false;
        this.IsMealTextValid = false;
        this.IsTransportTextValid = false;
        this.selectPaxVisible = false;
        this.FromFlightOne = new index_1.CompensationSearchModule.ReaccomDetail();
        this.FromFlightTwo = new index_1.CompensationSearchModule.ReaccomDetail();
        this.ToFlightOne = new index_1.CompensationSearchModule.ReaccomDetail();
        this.ToFlightTwo = new index_1.CompensationSearchModule.ReaccomDetail();
        this.MonetaryCompenstion = [];
        this.MealCompenstion = [];
        this.HotelCompenstion = [];
        this.TransportCompenstion = [];
        this.CompensationPassengerList = [];
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.isLabelField = false;
        this.isError = false;
        this.errorMessage = "";
        // this.CurDate = moment().format("YYYY-MM-DD");
        this.startDate = new Date();
        this.CurDate = moment(this.startDate).format("YYYY-MM-DD");
        // this.FromFlightOneDate = moment(this.startDate).format("YYYY-MM-DD");
        // this.FromFlightTwoDate = moment(this.startDate).format("YYYY-MM-DD");
        // this.ToFlightOneDate = moment(this.startDate).format("YYYY-MM-DD");
        // this.ToFlightTwoDate = moment(this.startDate).format("YYYY-MM-DD");
        this.loaderProgress = new index_1.LoaderProgress();
        // this.apisdetails = [];
        // this.firsttab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFIRSTTAB;
        // this.apisdetails.push(this.firsttab);
        // this.secondtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSSECONDTAB;
        // this.apisdetails.push(this.secondtab);
        // this.thridtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSTHIRDTAB;
        // this.apisdetails.push(this.thridtab);
        // this.fourthtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFOURTHTAB;
        // this.apisdetails.push(this.fourthtab);
    }
    CompensationAdditionalDetailsComponent_1 = CompensationAdditionalDetailsComponent;
    CompensationAdditionalDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.CompensationPassengerList = this._shared.getCompensationPaxList();
        if (this.FlightHeaderInfo == null) {
            this.IsHeaderInfo = true;
            this.IsFlightInfo = false;
        }
        else {
            this.IsHeaderInfo = false;
            this.IsFlightInfo = true;
            this.CurrentFlightStatus = this.FlightHeaderInfo.FlightNumber + " " + this.FlightHeaderInfo.DepartureAirport + " > " + this.FlightHeaderInfo.DestinationAirport;
        }
        this.activatedRouter.queryParams.subscribe(function (params) {
            _this.PaxItem = JSON.parse(params["data"]);
            _this.PreviousPage = params["prepage"];
            _this.PassengerName = _this.PaxItem.FullName;
            console.log("v" + JSON.stringify(_this.PreviousPage));
        });
        this.activatedRouter.queryParams.subscribe(function (params) {
            if (params["selectedPAx"] != null &&
                params["selectedPAx"] != "" &&
                params["selectedPAx"] != "undefined") {
                _this.selectedPassenger = JSON.parse(params["selectedPAx"]);
                // console.dir(this.selectedPassenger[0].ReaccomDetails);
                console.log("Vcount:" + _this.selectedPassenger.length);
            }
        });
        console.log("Var:" + JSON.stringify(this.PaxItem));
        if (this.PreviousPage == "SearchResult") {
            // console.log("Cond 1" + JSON.stringify(this.PreviousPage));
            this.IsVisibleAllTab = true;
            this.copyToSelectPaxReacc = true;
            this.apisdetails = [];
            this.firsttab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSFIRSTTAB;
            this.apisdetails.push(this.firsttab);
            this.secondtab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSSECONDTAB;
            this.apisdetails.push(this.secondtab);
        }
        else if (this.PreviousPage == "CompensationList") {
            this.apisdetails = [];
            this.firsttab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSFIRSTTAB;
            this.apisdetails.push(this.firsttab);
            this.secondtab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSSECONDTAB;
            this.apisdetails.push(this.secondtab);
            this.thridtab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSTHIRDTAB;
            this.apisdetails.push(this.thridtab);
            this.fourthtab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSFOURTHTAB;
            this.apisdetails.push(this.fourthtab);
            if (this.PaxItem.IsCompensationIssued == true) {
                console.log("in here 1");
                this.isLabelField = true;
                this.IsVisibleAllTab = false;
                this.copyToSelectPax = false;
                this.copyToSelectPaxReacc = false;
            }
            else {
                console.log("in here 12");
                this.isLabelField = false;
                this.IsVisibleAllTab = true;
                this.copyToSelectPaxReacc = true;
                this.apisdetails = [];
                this.firsttab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSFIRSTTAB;
                this.apisdetails.push(this.firsttab);
                this.secondtab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSSECONDTAB;
                this.apisdetails.push(this.secondtab);
            }
        }
        else if (this.PreviousPage == "BREPage") {
            this.apisdetails = [];
            this.firsttab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSFIRSTTAB;
            this.apisdetails.push(this.firsttab);
            this.secondtab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSSECONDTAB;
            this.apisdetails.push(this.secondtab);
            this.thridtab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSTHIRDTAB;
            this.apisdetails.push(this.thridtab);
            this.fourthtab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSFOURTHTAB;
            this.apisdetails.push(this.fourthtab);
            this.isLabelField = false;
            this.IsVisibleAllTab = false;
            this.copyToSelectPax = true;
            this.copyToSelectPaxReacc = true;
        }
        else if (this.PreviousPage == "IssueCompensationTab") {
            this.apisdetails = [];
            this.firsttab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSFIRSTTAB;
            this.apisdetails.push(this.firsttab);
            this.secondtab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSSECONDTAB;
            this.apisdetails.push(this.secondtab);
            this.thridtab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSTHIRDTAB;
            this.apisdetails.push(this.thridtab);
            this.fourthtab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSFOURTHTAB;
            this.apisdetails.push(this.fourthtab);
            if (this.PaxItem.IsCompensationIssued == true) {
                this.isLabelField = true;
                this.IsVisibleAllTab = false;
                this.copyToSelectPax = false;
                this.copyToSelectPaxReacc = false;
            }
            else {
                this.isLabelField = false;
                this.IsVisibleAllTab = false;
                this.copyToSelectPax = true;
                this.copyToSelectPaxReacc = true;
            }
        }
        else if (this.PreviousPage == "PrintList") {
            this.apisdetails = [];
            this.firsttab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSFIRSTTAB;
            this.apisdetails.push(this.firsttab);
            this.secondtab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSSECONDTAB;
            this.apisdetails.push(this.secondtab);
            this.thridtab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSTHIRDTAB;
            this.apisdetails.push(this.thridtab);
            this.fourthtab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSFOURTHTAB;
            this.apisdetails.push(this.fourthtab);
            this.isLabelField = true;
            this.IsVisibleAllTab = false;
            this.copyToSelectPax = false;
            this.copyToSelectPaxReacc = false;
        }
        else {
            console.log("in here 2");
            this.apisdetails = [];
            this.firsttab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSFIRSTTAB;
            this.apisdetails.push(this.firsttab);
            this.secondtab.title = CompensationAdditionalDetailsComponent_1.ADDITIONALDETAILSSECONDTAB;
            this.apisdetails.push(this.secondtab);
            this.IsVisibleAllTab = true;
            this.copyToSelectPax = false;
            this.copyToSelectPaxReacc = false;
        }
        if (this.IsVisibleAllTab == false) {
            this.IssueCompensationPaxList = this._shared.getIssueCompensation();
            this.MonetaryText = this.PaxItem.monetaryendorsementTextItems;
            this.HotelText = this.PaxItem.hotelendorsementTextItems;
            this.MealText = this.PaxItem.mealendorsementTextItems;
            this.TransportText = this.PaxItem.transportationendorsementTextItems;
            this.CompensationReason = this.PaxItem.Compensations[0].CompReasonText;
        }
        if (this.PaxItem.ExistingCompensations == null) {
            this.IsHistoryVisible = false;
        }
        else {
            this.IsHistoryVisible = true;
            if (this.PaxItem.ExistingCompensations.length > 0) {
                console.log("Inside history");
                this.MonetaryCompenstion = this.PaxItem.ExistingCompensations.filter(function (m) { return m.CompTypeText == CompensationAdditionalDetailsComponent_1.COMPTYPEMONETARY; });
                console.log("inside" + JSON.stringify(this.MonetaryCompenstion));
                if (this.MonetaryCompenstion != null) {
                    this.MonetaryCompenstion.forEach(function (data, Index) {
                        data.Emds[0].Endorsements1Txt.replace('?.', '.');
                        if (data.Emds[0].Endorsements1Txt.indexOf('?') > 0) {
                            _this.PaxItem.monetaryfreeText = data.Emds[0].Endorsements1Txt.substr(data.Emds[0].Endorsements1Txt.indexOf('?') + 2);
                        }
                        else {
                            _this.PaxItem.monetaryfreeText = data.Emds[0].Endorsements1Txt.substr(data.Emds[0].Endorsements1Txt.indexOf('|') + 1);
                        }
                        _this.EndorsmentTextMonetary = data.Emds[0].Endorsements1Txt.split('.');
                        _this.IsMonetaryHistoryVisible = true;
                    });
                }
                this.HotelCompenstion = this.PaxItem.ExistingCompensations.filter(function (m) { return m.CompTypeText == CompensationAdditionalDetailsComponent_1.COMPTYPEHOTEL; });
                if (this.HotelCompenstion != null) {
                    this.HotelCompenstion.forEach(function (data, Index) {
                        data.Emds[0].Endorsements1Txt.replace('?', '.');
                        _this.EndorsmentTextHotel = data.Emds[0].Endorsements1Txt.split('.');
                        if (data.Emds[0].Endorsements1Txt.indexOf('?') > 0) {
                            _this.PaxItem.hotelFreeText = data.Emds[0].Endorsements1Txt.substr(data.Emds[0].Endorsements1Txt.indexOf('?') + 2);
                        }
                        else {
                            _this.PaxItem.hotelFreeText = data.Emds[0].Endorsements1Txt.substr(data.Emds[0].Endorsements1Txt.indexOf('|') + 1);
                        }
                        _this.IsHotelHistoryVisible = true;
                    });
                }
                this.MealCompenstion = this.PaxItem.ExistingCompensations.filter(function (m) { return m.CompTypeText == CompensationAdditionalDetailsComponent_1.COMPTYPEMEAL; });
                if (this.MealCompenstion != null) {
                    this.MealCompenstion.forEach(function (data, Index) {
                        data.Emds[0].Endorsements1Txt.replace('?', '.');
                        _this.EndorsmentTextMeal = data.Emds[0].Endorsements1Txt.split('.');
                        if (data.Emds[0].Endorsements1Txt.indexOf('?') > 0) {
                            _this.PaxItem.mealFreeText = data.Emds[0].Endorsements1Txt.substr(data.Emds[0].Endorsements1Txt.indexOf('?') + 2);
                        }
                        else {
                            _this.PaxItem.mealFreeText = data.Emds[0].Endorsements1Txt.substr(data.Emds[0].Endorsements1Txt.indexOf('|') + 1);
                        }
                        _this.IsMealHistoryVisible = true;
                    });
                }
                this.TransportCompenstion = this.PaxItem.ExistingCompensations.filter(function (m) { return m.CompTypeText == CompensationAdditionalDetailsComponent_1.COMPTYPETRANSPORT; });
                if (this.TransportCompenstion != null) {
                    this.TransportCompenstion.forEach(function (data, Index) {
                        data.Emds[0].Endorsements1Txt.replace('?', '.');
                        _this.EndorsmentTextTransport = data.Emds[0].Endorsements1Txt.split('.');
                        if (data.Emds[0].Endorsements1Txt.indexOf('?') > 0) {
                            _this.PaxItem.transportFreeText = data.Emds[0].Endorsements1Txt.substr(data.Emds[0].Endorsements1Txt.indexOf('?') + 2);
                        }
                        else {
                            _this.PaxItem.transportFreeText = data.Emds[0].Endorsements1Txt.substr(data.Emds[0].Endorsements1Txt.indexOf('|') + 1);
                        }
                        _this.IsTransportHistoryVisible = true;
                    });
                }
            }
        }
        if (this.PaxItem.ReaccomDetails) {
            this.FromFlightOne = this.PaxItem.ReaccomDetails.filter(function (m) { return m.FromToFlag == "FROM" && m.GUIDisplayFlag == "1"; })[0];
            if (this.FromFlightOne != null || this.FromFlightOne != undefined) {
                if (this.FromFlightOne.ReaccomAirlineCode == null && this.FromFlightOne.ReaccomFlightNo == '0') {
                    this.FromFlightOneNumber = "";
                }
                else {
                    if (this.FromFlightOne.ReaccomAirlineCode == null) {
                        this.FromFlightOneNumber = this.FromFlightOne.ReaccomFlightNo;
                    }
                    else {
                        this.FromFlightOneNumber = this.FromFlightOne.ReaccomAirlineCode + this.FromFlightOne.ReaccomFlightNo;
                    }
                }
                this.FromFlightOneDate = this.FromFlightOne.ReaccomFlightDt;
            }
            else {
                this.FromFlightOneNumber = "";
                this.FromFlightOne = new index_1.CompensationSearchModule.ReaccomDetail();
                this.FromFlightOne.ReaccomBoardCityCd = "";
                this.FromFlightOne.ReaccomOffCityCd = "";
                this.FromFlightOne.ReaccomFlightDt = "";
            }
            console.log("FLIGHT:" + JSON.stringify(this.FromFlightOne));
            this.FromFlightTwo = this.PaxItem.ReaccomDetails.filter(function (m) { return m.FromToFlag == "FROM" && m.GUIDisplayFlag == "2"; })[0];
            if (this.FromFlightTwo != null || this.FromFlightTwo != undefined) {
                if (this.FromFlightTwo.ReaccomAirlineCode == null && this.FromFlightTwo.ReaccomFlightNo == '0') {
                    this.FromFlightTwoNumber = "";
                }
                else {
                    if (this.FromFlightTwo.ReaccomAirlineCode == null) {
                        this.FromFlightTwoNumber = this.FromFlightTwo.ReaccomFlightNo;
                    }
                    else {
                        this.FromFlightTwoNumber = this.FromFlightTwo.ReaccomAirlineCode + this.FromFlightTwo.ReaccomFlightNo;
                    }
                }
                this.FromFlightTwoDate = this.FromFlightTwo.ReaccomFlightDt;
            }
            else {
                this.FromFlightTwoNumber = "";
                this.FromFlightTwo = new index_1.CompensationSearchModule.ReaccomDetail();
                this.FromFlightTwo.ReaccomBoardCityCd = "";
                this.FromFlightTwo.ReaccomOffCityCd = "";
                this.FromFlightTwo.ReaccomFlightDt = "";
            }
            this.ToFlightOne = this.PaxItem.ReaccomDetails.filter(function (m) { return m.FromToFlag == "TO" && m.GUIDisplayFlag == "3"; })[0];
            if (this.ToFlightOne != null || this.ToFlightOne != undefined) {
                if (this.ToFlightOne.ReaccomAirlineCode == null && this.ToFlightOne.ReaccomFlightNo == '0') {
                    this.ToFlightOneNumber = "";
                }
                else {
                    if (this.ToFlightOne.ReaccomAirlineCode == null) {
                        this.ToFlightOneNumber = this.ToFlightOne.ReaccomFlightNo;
                    }
                    else {
                        this.ToFlightOneNumber = this.ToFlightOne.ReaccomAirlineCode + this.ToFlightOne.ReaccomFlightNo;
                    }
                }
                this.ToFlightOneDate = this.ToFlightOne.ReaccomFlightDt;
            }
            else {
                this.ToFlightOneNumber = "";
                this.ToFlightOne = new index_1.CompensationSearchModule.ReaccomDetail();
                this.ToFlightOne.ReaccomBoardCityCd = "";
                this.ToFlightOne.ReaccomOffCityCd = "";
                this.ToFlightOne.ReaccomFlightDt = moment(this.startDate).format("YYYY-MM-DD");
            }
            this.ToFlightTwo = this.PaxItem.ReaccomDetails.filter(function (m) { return m.FromToFlag == "TO" && m.GUIDisplayFlag == "4"; })[0];
            if (this.ToFlightTwo != null || this.ToFlightTwo != undefined) {
                if (this.ToFlightTwo.ReaccomAirlineCode == null && this.ToFlightTwo.ReaccomFlightNo == '0') {
                    this.ToFlightTwoNumber = "";
                }
                else {
                    if (this.ToFlightTwo.ReaccomAirlineCode == null) {
                        this.ToFlightTwoNumber = this.ToFlightTwo.ReaccomFlightNo;
                    }
                    else {
                        this.ToFlightTwoNumber = this.ToFlightTwo.ReaccomAirlineCode + this.ToFlightTwo.ReaccomFlightNo;
                    }
                }
                this.ToFlightTwoDate = this.ToFlightTwo.ReaccomFlightDt;
            }
            else {
                this.ToFlightTwoNumber = "";
                this.ToFlightTwo = new index_1.CompensationSearchModule.ReaccomDetail();
                this.ToFlightTwo.ReaccomBoardCityCd = "";
                this.ToFlightTwo.ReaccomOffCityCd = "";
                this.ToFlightTwo.ReaccomFlightDt = moment(this.startDate).format("YYYY-MM-DD");
            }
        }
    };
    CompensationAdditionalDetailsComponent.prototype.submitEnabled = function () {
        if (this.IsSubmitEnabled == true) {
            return true;
        }
        else
            return false;
    };
    CompensationAdditionalDetailsComponent.prototype.copyToSelectedPax = function () {
        var _this = this;
        if (this.PaxItem.copyToSelectedPax == true) {
            this.PaxItem.copyToSelectedPax = false;
            this.selectedPassenger.forEach(function (data, Index) {
                data.copyToSelectedPax = true;
            });
        }
        else {
            this.PaxItem.copyToSelectedPax = true;
            this.selectedPassenger.forEach(function (data, Index) {
                data.copyToSelectedPax = true;
                data.hotelFreeText = _this.PaxItem.hotelFreeText;
                data.monetaryfreeText = _this.PaxItem.monetaryfreeText;
                data.mealFreeText = _this.PaxItem.mealFreeText;
                data.transportFreeText = _this.PaxItem.transportFreeText;
                data.mealDetails = _this.PaxItem.mealDetails;
                data.hotelDetails = _this.PaxItem.hotelDetails;
                data.transportEMD = _this.PaxItem.transportEMD;
            });
        }
    };
    CompensationAdditionalDetailsComponent.prototype.copyReaccomodationToSelectedPax = function () {
        if (this.PaxItem.copyToSelectedPaxReaccom == true) {
            this.PaxItem.copyToSelectedPaxReaccom = false;
            this.selectedPassenger.forEach(function (data, Index) {
                data.copyToSelectedPaxReaccom = true;
            });
        }
        else {
            this.PaxItem.copyToSelectedPaxReaccom = true;
            // this.selectedPassenger.forEach((data, Index) => {
            //     data.copyToSelectedPaxReaccom = true;
            //     data.ReaccomDetails =this.PaxItem.ReaccomDetails;
            // })
        }
    };
    CompensationAdditionalDetailsComponent.prototype.onChange = function (args, index) {
        console.log(index);
        switch (index) {
            case 1:
                // if (this.FromFlightOneNumber.length > 6) {
                //     this.FromFlightOneError = true;
                // } else {
                if (this.FromFlightOneNumber != "") {
                    // var reg = new RegExp'/([A-Z]{2,3})\d{3,4}/');
                    var REG_EXP = /(^([A-Za-z]{0,2})\d{1,4})$/;
                    var test = REG_EXP.test(this.FromFlightOneNumber);
                    if (test == false) {
                        this.FromFlightOneError = true;
                        // Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDAIRLINECODE).show();
                    }
                    else {
                        this.FromFlightOneError = false;
                    }
                }
                else {
                    this.FromFlightOneError = false;
                }
                // }
                break;
            case 2:
                if (this.FromFlightOne.ReaccomBoardCityCd != undefined) {
                    if (this.FromFlightOne.ReaccomBoardCityCd.length > 3) {
                        this.FromOriginOneError = true;
                    }
                    else {
                        if (this.FromFlightOne.ReaccomBoardCityCd != null) {
                            var reg = new RegExp('^[a-zA-Z]*$');
                            var test = reg.test(this.FromFlightOne.ReaccomBoardCityCd);
                            if (test == false) {
                                this.FromOriginOneError = true;
                                Toast.makeText(CompensationAdditionalDetailsComponent_1.INVALIDDEPACODE).show();
                            }
                            else {
                                this.FromOriginOneError = false;
                            }
                        }
                        else {
                            this.FromOriginOneError = false;
                        }
                    }
                }
                break;
            case 3:
                if (this.FromFlightOne.ReaccomOffCityCd != undefined) {
                    if (this.FromFlightOne.ReaccomOffCityCd.length > 3) {
                        this.FromDestOneError = true;
                    }
                    else {
                        if (this.FromFlightOne.ReaccomOffCityCd != null) {
                            var reg = new RegExp('^[a-zA-Z]*$');
                            var test = reg.test(this.FromFlightOne.ReaccomOffCityCd);
                            if (test == false) {
                                this.FromDestOneError = true;
                                Toast.makeText(CompensationAdditionalDetailsComponent_1.INVALIDARRICODE).show();
                            }
                            else {
                                this.FromDestOneError = false;
                            }
                        }
                        else {
                            this.FromDestOneError = false;
                        }
                    }
                }
                break;
            case 4:
                // if (this.FromFlightTwoNumber.length > 6) {
                //     this.FromFlightTwoError = true;
                // } else {
                if (this.FromFlightTwoNumber != "") {
                    var REG_EXP = /(^([A-Za-z]{0,2})\d{1,4})$/;
                    var test = REG_EXP.test(this.FromFlightTwoNumber);
                    if (test == false) {
                        this.FromFlightTwoError = true;
                        // Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDAIRLINECODE).show();
                    }
                    else {
                        this.FromFlightTwoError = false;
                    }
                }
                else {
                    this.FromFlightTwoError = false;
                }
                // }
                break;
            case 5:
                if (this.FromFlightTwo.ReaccomBoardCityCd != undefined) {
                    if (this.FromFlightTwo.ReaccomBoardCityCd.length > 3) {
                        this.FromOriginTwoError = true;
                    }
                    else {
                        if (this.FromFlightTwo.ReaccomBoardCityCd != null) {
                            var reg = new RegExp('^[a-zA-Z]*$');
                            var test = reg.test(this.FromFlightTwo.ReaccomBoardCityCd);
                            if (test == false) {
                                this.FromOriginTwoError = true;
                                Toast.makeText(CompensationAdditionalDetailsComponent_1.INVALIDDEPACODE).show();
                            }
                            else {
                                this.FromOriginTwoError = false;
                            }
                        }
                        else {
                            this.FromOriginTwoError = false;
                        }
                    }
                }
                break;
            case 6:
                if (this.FromFlightTwo.ReaccomOffCityCd != undefined) {
                    if (this.FromFlightTwo.ReaccomOffCityCd.length > 3) {
                        this.FromDestTwoError = true;
                    }
                    else {
                        if (this.FromFlightTwo.ReaccomOffCityCd != null) {
                            var reg = new RegExp('^[a-zA-Z]*$');
                            var test = reg.test(this.FromFlightTwo.ReaccomOffCityCd);
                            if (test == false) {
                                this.FromDestTwoError = true;
                                Toast.makeText(CompensationAdditionalDetailsComponent_1.INVALIDARRICODE).show();
                            }
                            else {
                                this.FromDestTwoError = false;
                            }
                        }
                        else {
                            this.FromDestTwoError = false;
                        }
                    }
                }
                break;
            case 7:
                // if (this.ToFlightOneNumber.length > 6) {
                //     this.ToFlightOneError = true;
                // } else {
                if (this.ToFlightOneNumber != "") {
                    var REG_EXP = /(^([A-Za-z]{0,2})\d{1,4})$/;
                    var test = REG_EXP.test(this.ToFlightOneNumber);
                    if (test == false) {
                        this.ToFlightOneError = true;
                        // Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDAIRLINECODE).show();
                    }
                    else {
                        this.ToFlightOneError = false;
                    }
                }
                else {
                    this.ToFlightOneError = false;
                }
                // }
                break;
            case 8:
                if (this.ToFlightOne.ReaccomBoardCityCd != undefined) {
                    if (this.ToFlightOne.ReaccomBoardCityCd.length > 3) {
                        this.ToOriginOneError = true;
                    }
                    else {
                        if (this.ToFlightOne.ReaccomBoardCityCd != null) {
                            var reg = new RegExp('^[a-zA-Z]*$');
                            var test = reg.test(this.ToFlightOne.ReaccomBoardCityCd);
                            if (test == false) {
                                this.ToOriginOneError = true;
                                Toast.makeText(CompensationAdditionalDetailsComponent_1.INVALIDDEPACODE).show();
                            }
                            else {
                                this.ToOriginOneError = false;
                            }
                        }
                        else {
                            this.ToOriginOneError = false;
                        }
                    }
                }
                break;
            case 9:
                if (this.ToFlightOne.ReaccomOffCityCd != undefined) {
                    if (this.ToFlightOne.ReaccomOffCityCd.length > 3) {
                        this.ToDestOneError = true;
                    }
                    else {
                        if (this.ToFlightOne.ReaccomOffCityCd != null) {
                            var reg = new RegExp('^[a-zA-Z]*$');
                            var test = reg.test(this.ToFlightOne.ReaccomOffCityCd);
                            if (test == false) {
                                this.ToDestOneError = true;
                                Toast.makeText(CompensationAdditionalDetailsComponent_1.INVALIDARRICODE).show();
                            }
                            else {
                                this.ToDestOneError = false;
                            }
                        }
                        else {
                            this.ToDestOneError = false;
                        }
                    }
                }
                break;
            case 10:
                // if (this.ToFlightTwoNumber.length > 6) {
                //     this.ToFlightTwoError = true;
                // } else {
                if (this.ToFlightTwoNumber != "") {
                    var REG_EXP = /(^([A-Za-z]{0,2})\d{1,4})$/;
                    var test = REG_EXP.test(this.ToFlightTwoNumber);
                    if (test == false) {
                        this.ToFlightTwoError = true;
                        // Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDAIRLINECODE).show();
                    }
                    else {
                        this.ToFlightTwoError = false;
                    }
                }
                else {
                    this.ToFlightTwoError = false;
                }
                // }
                break;
            case 11:
                if (this.ToFlightTwo.ReaccomBoardCityCd != undefined) {
                    if (this.ToFlightTwo.ReaccomBoardCityCd.length > 3) {
                        this.ToOriginTwoError = true;
                    }
                    else {
                        if (this.ToFlightTwo.ReaccomBoardCityCd != null) {
                            var reg = new RegExp('^[a-zA-Z]*$');
                            var test = reg.test(this.ToFlightTwo.ReaccomBoardCityCd);
                            if (test == false) {
                                this.ToOriginTwoError = true;
                                Toast.makeText(CompensationAdditionalDetailsComponent_1.INVALIDDEPACODE).show();
                            }
                            else {
                                this.ToOriginTwoError = false;
                            }
                        }
                        else {
                            this.ToOriginTwoError = false;
                        }
                    }
                }
                break;
            case 12:
                if (this.ToFlightTwo.ReaccomOffCityCd != undefined) {
                    if (this.ToFlightTwo.ReaccomOffCityCd.length > 3) {
                        this.ToDestTwoError = true;
                    }
                    else {
                        if (this.ToFlightTwo.ReaccomOffCityCd != null) {
                            var reg = new RegExp('^[a-zA-Z]*$');
                            var test = reg.test(this.ToFlightTwo.ReaccomOffCityCd);
                            if (test == false) {
                                this.ToDestTwoError = true;
                                Toast.makeText(CompensationAdditionalDetailsComponent_1.INVALIDARRICODE).show();
                            }
                            else {
                                this.ToDestTwoError = false;
                            }
                        }
                        else {
                            this.ToDestTwoError = false;
                        }
                    }
                }
                break;
            case 13:
                if (this.PaxItem.WorldTracerNum.length > 10) {
                    this.IsWorldTraceValid = true;
                }
                else {
                    if (this.PaxItem.WorldTracerNum != "") {
                        var reg = new RegExp('^[a-zA-Z0-9]*$');
                        var test = reg.test(this.PaxItem.WorldTracerNum);
                        if (test == false) {
                            this.IsWorldTraceValid = true;
                            Toast.makeText(CompensationAdditionalDetailsComponent_1.INVALIDWORLDTRACENUMBER).show();
                        }
                        else {
                            this.IsWorldTraceValid = false;
                        }
                    }
                    else {
                        this.IsWorldTraceValid = false;
                    }
                }
                break;
            case 14:
                if (this.PaxItem.CustomerCareCaseNum.length > 15) {
                    this.IsCustomerCareValid = true;
                }
                else {
                    if (this.PaxItem.CustomerCareCaseNum != "") {
                        var reg = new RegExp('^[0-9]*$');
                        var test = reg.test(this.PaxItem.CustomerCareCaseNum);
                        if (test == false) {
                            this.IsCustomerCareValid = true;
                            Toast.makeText(CompensationAdditionalDetailsComponent_1.INVALIDCUSTOMERCARECODE).show();
                        }
                        else {
                            this.IsCustomerCareValid = false;
                        }
                    }
                    else {
                        this.IsCustomerCareValid = false;
                    }
                }
                break;
            case 15:
                if (this.PaxItem.monetaryfreeText.length > 50) {
                    this.IsMonetaryTextValid = true;
                    Toast.makeText("Maximum 50 characters").show();
                }
                else {
                    if (this.PaxItem.monetaryfreeText != "") {
                        var reg = new RegExp('^[a-zA-Z0-9 ,.]*$');
                        var test = reg.test(this.PaxItem.monetaryfreeText);
                        if (test == false) {
                            this.IsMonetaryTextValid = true;
                        }
                        else {
                            this.IsMonetaryTextValid = false;
                        }
                    }
                    else {
                        this.IsMonetaryTextValid = false;
                    }
                }
                break;
            case 16:
                if (this.PaxItem.hotelFreeText.length > 50) {
                    this.IsHotelTextValid = true;
                    Toast.makeText("Maximum 50 characters").show();
                }
                else {
                    if (this.PaxItem.hotelFreeText != "") {
                        var reg = new RegExp('^[a-zA-Z0-9 ,.]*$');
                        var test = reg.test(this.PaxItem.hotelFreeText);
                        if (test == false) {
                            this.IsHotelTextValid = true;
                        }
                        else {
                            this.IsHotelTextValid = false;
                        }
                    }
                    else {
                        this.IsHotelTextValid = false;
                    }
                }
                break;
            case 17:
                if (this.PaxItem.hotelDetails.length > 26) {
                    this.IsHotelNameValid = true;
                    Toast.makeText("Maximum 26 characters").show();
                }
                else {
                    if (this.PaxItem.hotelDetails != "") {
                        var reg = new RegExp('^[a-zA-Z0-9 ,.]*$');
                        var test = reg.test(this.PaxItem.hotelDetails);
                        if (test == false) {
                            this.IsHotelNameValid = true;
                        }
                        else {
                            this.IsHotelNameValid = false;
                        }
                    }
                    else {
                        this.IsHotelNameValid = false;
                    }
                }
                break;
            case 18:
                if (this.PaxItem.mealFreeText.length > 50) {
                    this.IsMealTextValid = true;
                    Toast.makeText("Maximum 50 characters").show();
                }
                else {
                    if (this.PaxItem.mealFreeText != "") {
                        var reg = new RegExp('^[a-zA-Z0-9 ,.]*$');
                        var test = reg.test(this.PaxItem.mealFreeText);
                        if (test == false) {
                            this.IsMealTextValid = true;
                        }
                        else {
                            this.IsMealTextValid = false;
                        }
                    }
                    else {
                        this.IsMealTextValid = false;
                    }
                }
                break;
            case 19:
                if (this.PaxItem.transportFreeText.length > 50) {
                    this.IsTransportTextValid = true;
                    Toast.makeText("Maximum 50 characters").show();
                }
                else {
                    if (this.PaxItem.transportFreeText != "") {
                        var reg = new RegExp('^[a-zA-Z0-9 ,.]*$');
                        var test = reg.test(this.PaxItem.transportFreeText);
                        if (test == false) {
                            this.IsTransportTextValid = true;
                        }
                        else {
                            this.IsTransportTextValid = false;
                        }
                    }
                    else {
                        this.IsTransportTextValid = false;
                    }
                }
                break;
            case 20:
                if (this.PaxItem.mealDetails.length > 50) {
                    this.isMealDetailValid = true;
                    Toast.makeText("Maximum 26 characters").show();
                }
                else {
                    if (this.PaxItem.mealDetails != "") {
                        var reg = new RegExp('^[a-zA-Z0-9 ,.]*$');
                        var test = reg.test(this.PaxItem.mealDetails);
                        if (test == false) {
                            this.isMealDetailValid = true;
                        }
                        else {
                            this.isMealDetailValid = false;
                        }
                    }
                    else {
                        this.isMealDetailValid = false;
                    }
                }
                break;
            case 21:
                if (this.PaxItem.transportEMD.length > 50) {
                    this.isTransportEMDValid = true;
                    Toast.makeText("Maximum 26 characters").show();
                }
                else {
                    if (this.PaxItem.transportEMD != "") {
                        var reg = new RegExp('^[a-zA-Z0-9 ,.]*$');
                        var test = reg.test(this.PaxItem.transportEMD);
                        if (test == false) {
                            this.isTransportEMDValid = true;
                        }
                        else {
                            this.isTransportEMDValid = false;
                        }
                    }
                    else {
                        this.isTransportEMDValid = false;
                    }
                }
                break;
            default:
                break;
        }
        // if (this.FromFlightOneError == false && this.FromOriginOneError == false && this.FromDestOneError == false && this.FromFlightTwoError == false && this.FromOriginTwoError == false && this.FromDestTwoError == false && this.ToFlightOneError == false && this.ToOriginOneError == false && this.ToDestOneError == false && this.ToFlightTwoError == false && this.ToOriginTwoError == false && this.ToDestTwoError == false && this.IsCustomerCareValid == false && this.IsWorldTraceValid == false && this.IsTransportTextValid == false && this.IsMealTextValid == false && this.IsHotelNameValid == false && this.IsHotelTextValid == false && this.IsMonetaryTextValid == false && this.isTransportEMDValid == false && this.isMealDetailValid == false) {
        //     this.IsSubmitEnabled = true;
        // } else {
        //     this.IsSubmitEnabled = false;
        // }
        // console.log("flight date:" + this.FromFlightOneDate);
        this.IsSubmitEnabled = true;
        if (this.FromFlightOneNumber != "") {
            if (this.FromFlightOne.ReaccomBoardCityCd != null && this.FromFlightOne.ReaccomOffCityCd != null && this.FromFlightOneDate != undefined && this.FromFlightOne.ReaccomBoardCityCd != "" && this.FromFlightOne.ReaccomOffCityCd != "" && this.FromFlightOneDate != "") {
                if (this.FromFlightOneError == false && this.FromOriginOneError == false && this.FromDestOneError == false) {
                    // this.IsSubmitEnabled = true;
                }
                else {
                    this.IsSubmitEnabled = false;
                }
            }
            else {
                this.IsSubmitEnabled = false;
            }
        }
        if (this.FromFlightTwoNumber != "") {
            // this.IsSubmitEnabled = false;
            if (this.FromFlightTwo.ReaccomBoardCityCd != null && this.FromFlightTwo.ReaccomOffCityCd != null && this.FromFlightTwoDate != undefined && this.FromFlightTwo.ReaccomBoardCityCd != "" && this.FromFlightTwo.ReaccomOffCityCd != "" && this.FromFlightTwoDate != "") {
                if (this.FromFlightTwoError == false && this.FromOriginTwoError == false && this.FromDestTwoError == false) {
                    // this.IsSubmitEnabled = true;
                }
                else {
                    this.IsSubmitEnabled = false;
                }
            }
            else {
                this.IsSubmitEnabled = false;
            }
        }
        if (this.ToFlightOneNumber != "") {
            // this.IsSubmitEnabled = false;
            if (this.ToFlightOne.ReaccomBoardCityCd != null && this.ToFlightOne.ReaccomOffCityCd != null && this.ToFlightOneDate != undefined && this.ToFlightOne.ReaccomBoardCityCd != "" && this.ToFlightOne.ReaccomOffCityCd != "" && this.ToFlightOneDate != "") {
                if (this.ToFlightOneError == false && this.ToOriginOneError == false && this.ToDestOneError == false) {
                    // this.IsSubmitEnabled = true;
                }
                else {
                    this.IsSubmitEnabled = false;
                }
            }
            else {
                this.IsSubmitEnabled = false;
            }
        }
        if (this.ToFlightTwoNumber != "") {
            // this.IsSubmitEnabled = false;
            if (this.ToFlightTwo.ReaccomBoardCityCd != null && this.ToFlightTwo.ReaccomOffCityCd != null && this.ToFlightTwoDate != undefined && this.ToFlightTwo.ReaccomBoardCityCd != "" && this.ToFlightTwo.ReaccomOffCityCd != "" && this.ToFlightTwoDate != "") {
                if (this.ToFlightTwoError == false && this.ToOriginTwoError == false && this.ToDestTwoError == false) {
                    // this.IsSubmitEnabled = true;
                }
                else {
                    this.IsSubmitEnabled = false;
                }
            }
            else {
                this.IsSubmitEnabled = false;
            }
        }
    };
    CompensationAdditionalDetailsComponent.prototype.monetaryLayout = function () {
        this.FirstBlock = true;
        this.SecondBlock = false;
        this.ThirdBlock = false;
        this.FourthBlock = false;
    };
    CompensationAdditionalDetailsComponent.prototype.hotelLayout = function () {
        this.FirstBlock = false;
        this.SecondBlock = true;
        this.ThirdBlock = false;
        this.FourthBlock = false;
    };
    CompensationAdditionalDetailsComponent.prototype.mealLayout = function () {
        this.FirstBlock = false;
        this.SecondBlock = false;
        this.ThirdBlock = true;
        this.FourthBlock = false;
    };
    CompensationAdditionalDetailsComponent.prototype.transportLayout = function () {
        this.FirstBlock = false;
        this.SecondBlock = false;
        this.ThirdBlock = false;
        this.FourthBlock = true;
    };
    CompensationAdditionalDetailsComponent.prototype.selectSegment = function (e) {
        console.dir(e);
        var selInd = e.newIndex;
        if (this.IsVisibleAllTab == true) {
            console.log("Cond 2" + JSON.stringify(this.IsVisibleAllTab));
            if (selInd == 0) {
                this.CompensationHistory = true;
                this.CompensationDetails = false;
                this.ReaccomodationDetails = false;
                this.OtherDetails = false;
                this.FirstBlock = true;
                this.SecondBlock = false;
                this.ThirdBlock = false;
                this.FourthBlock = false;
            }
            else if (selInd == 1) {
                this.CompensationHistory = false;
                this.CompensationDetails = false;
                this.ReaccomodationDetails = true;
                this.OtherDetails = false;
                this.IsFromFlight = true;
                this.IsToFlight = false;
            }
            else {
            }
        }
        else {
            console.log("Cond 3" + JSON.stringify(this.IsVisibleAllTab));
            if (selInd == 0) {
                this.CompensationHistory = true;
                this.CompensationDetails = false;
                this.ReaccomodationDetails = false;
                this.OtherDetails = false;
                this.FirstBlock = true;
                this.SecondBlock = false;
                this.ThirdBlock = false;
                this.FourthBlock = false;
            }
            else if (selInd == 1) {
                this.CompensationHistory = false;
                this.CompensationDetails = false;
                this.ReaccomodationDetails = true;
                this.OtherDetails = false;
                this.IsFromFlight = true;
                this.IsToFlight = false;
            }
            else if (selInd == 2) {
                this.CompensationHistory = false;
                this.CompensationDetails = true;
                this.ReaccomodationDetails = false;
                this.OtherDetails = false;
                this.IsMonetoryEmd = true;
                this.IsHotelEmd = false;
                this.IsTransportEmd = false;
                this.IsMealEmd = false;
            }
            else {
                this.CompensationHistory = false;
                this.CompensationDetails = false;
                this.ReaccomodationDetails = false;
                this.OtherDetails = true;
            }
        }
    };
    CompensationAdditionalDetailsComponent.prototype.selectedBackgroundColor = function (e) {
        var selColor = e.Color;
    };
    CompensationAdditionalDetailsComponent.prototype.createModelViewForFrom1Date = function (args) {
        var _this = this;
        var that = this;
        var currentDate = this.CurDate;
        console.log(this.startDate);
        var options = {
            viewContainerRef: this.vcRef,
            context: {
                currentDate: currentDate,
                displayHeader: true,
                minDate: moment(new Date()).subtract(1, 'years').toDate().toDateString(),
                maxDate: moment(new Date()).add(2, 'years').toDate().toDateString()
            },
            fullscreen: false
        };
        this._modalService.showModal(date_picker_modal_1.DatePickerModal, options)
            .then(function (dateresult) {
            if (dateresult) {
                console.log("date result " + dateresult);
                if (dateresult.toDateString() != 'undefined') {
                    _this.FromFlightOneDate = moment(dateresult).format("YYYY-MM-DD");
                }
            }
        });
    };
    CompensationAdditionalDetailsComponent.prototype.createModelViewFrom2Date = function (args) {
        var _this = this;
        var that = this;
        var currentDate = this.CurDate;
        console.log(this.startDate);
        var options = {
            viewContainerRef: this.vcRef,
            context: {
                currentDate: currentDate,
                displayHeader: true,
                minDate: moment(new Date()).subtract(1, 'years').toDate().toDateString(),
                maxDate: moment(new Date()).add(2, 'years').toDate().toDateString()
            },
            fullscreen: false
        };
        this._modalService.showModal(date_picker_modal_1.DatePickerModal, options)
            .then(function (dateresult) {
            if (dateresult) {
                console.log("date result " + dateresult);
                if (dateresult.toDateString() != 'undefined') {
                    _this.FromFlightTwoDate = moment(dateresult).format("YYYY-MM-DD");
                }
            }
        });
    };
    CompensationAdditionalDetailsComponent.prototype.createModelViewTo1Date = function (args) {
        var _this = this;
        var that = this;
        var currentDate = this.CurDate;
        console.log(this.startDate);
        var options = {
            viewContainerRef: this.vcRef,
            context: {
                currentDate: currentDate,
                displayHeader: true,
                minDate: moment(new Date()).subtract(1, 'years').toDate().toDateString(),
                maxDate: moment(new Date()).add(2, 'years').toDate().toDateString()
            },
            fullscreen: false
        };
        this._modalService.showModal(date_picker_modal_1.DatePickerModal, options)
            .then(function (dateresult) {
            if (dateresult) {
                console.log("date result " + dateresult);
                if (dateresult.toDateString() != 'undefined') {
                    _this.ToFlightOneDate = moment(dateresult).format("YYYY-MM-DD");
                }
            }
        });
    };
    CompensationAdditionalDetailsComponent.prototype.createModelViewTo2Date = function (args) {
        var _this = this;
        var that = this;
        var currentDate = this.CurDate;
        console.log(this.startDate);
        var options = {
            viewContainerRef: this.vcRef,
            context: {
                currentDate: currentDate,
                displayHeader: true,
                minDate: moment(new Date()).subtract(1, 'years').toDate().toDateString(),
                maxDate: moment(new Date()).add(2, 'years').toDate().toDateString()
            },
            fullscreen: false
        };
        this._modalService.showModal(date_picker_modal_1.DatePickerModal, options)
            .then(function (dateresult) {
            if (dateresult) {
                console.log("date result " + dateresult);
                if (dateresult.toDateString() != 'undefined') {
                    _this.ToFlightTwoDate = moment(dateresult).format("YYYY-MM-DD");
                }
            }
        });
    };
    CompensationAdditionalDetailsComponent.prototype.selectFromFlight = function () {
        this.IsFromFlight = true;
        this.IsToFlight = false;
    };
    CompensationAdditionalDetailsComponent.prototype.selectToFlight = function () {
        this.IsFromFlight = false;
        this.IsToFlight = true;
    };
    CompensationAdditionalDetailsComponent.prototype.selectMonetoryEmd = function () {
        this.IsMonetoryEmd = true;
        this.IsHotelEmd = false;
        this.IsTransportEmd = false;
        this.IsMealEmd = false;
    };
    CompensationAdditionalDetailsComponent.prototype.selectHotelEmd = function () {
        this.IsMonetoryEmd = false;
        this.IsHotelEmd = true;
        this.IsTransportEmd = false;
        this.IsMealEmd = false;
    };
    CompensationAdditionalDetailsComponent.prototype.selectMealEmd = function () {
        this.IsMonetoryEmd = false;
        this.IsHotelEmd = false;
        this.IsTransportEmd = false;
        this.IsMealEmd = true;
    };
    CompensationAdditionalDetailsComponent.prototype.selectTransportEmd = function () {
        this.IsMonetoryEmd = false;
        this.IsHotelEmd = false;
        this.IsTransportEmd = true;
        this.IsMealEmd = false;
    };
    CompensationAdditionalDetailsComponent.prototype.navigateToCompensation = function () {
        this.routerExtensions.navigate(["compensation"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationAdditionalDetailsComponent.prototype.save = function () {
        var _this = this;
        this.CompensationPassengerList.forEach(function (data, Index) {
            if (data.GivenName == _this.PaxItem.GivenName && data.LastName == _this.PaxItem.LastName && data.OrderId == _this.PaxItem.OrderId) {
                // data.ReaccomDetails = [];
                data.ReaccomDetails = [new index_1.CompensationSearchModule.ReaccomDetail()];
                data.ReaccomDetails.length = 0;
                if (_this.FromFlightOneNumber != "") {
                    //  this.PaxItem.ReaccomDetails = [new CompensationSearchModule.ReaccomDetail()];
                    _this.FromFlightOne.FromToFlag = "FROM";
                    _this.FromFlightOne.GUIDisplayFlag = "1";
                    var reg = new RegExp('^[0-9]*$');
                    var test = reg.test(_this.FromFlightOneNumber);
                    if (test == true) {
                        _this.FromFlightOne.ReaccomAirlineCode = ApplicationSettings.getString("carrierCode", "");
                        _this.FromFlightOne.ReaccomFlightNo = _this.FromFlightOneNumber;
                    }
                    else {
                        var stringArr = [];
                        stringArr = _this.FromFlightOneNumber.match(/[a-zA-Z]+|[0-9]+/g);
                        console.log("arr" + JSON.stringify(stringArr));
                        _this.FromFlightOne.ReaccomAirlineCode = stringArr[0];
                        _this.FromFlightOne.ReaccomFlightNo = stringArr[1];
                    }
                    _this.FromFlightOne.ReaccomFlightDt = _this.FromFlightOneDate;
                    console.log("Flight One:" + JSON.stringify(_this.FromFlightOne));
                    data.ReaccomDetails.push(_this.FromFlightOne);
                }
                if (_this.FromFlightTwoNumber != "") {
                    _this.FromFlightTwo.FromToFlag = "FROM";
                    _this.FromFlightTwo.GUIDisplayFlag = "2";
                    var reg = new RegExp('^[0-9]*$');
                    var test = reg.test(_this.FromFlightTwoNumber);
                    if (test == true) {
                        _this.FromFlightTwo.ReaccomAirlineCode = ApplicationSettings.getString("carrierCode", "");
                        _this.FromFlightTwo.ReaccomFlightNo = _this.FromFlightTwoNumber;
                    }
                    else {
                        var stringArr = [];
                        stringArr = _this.FromFlightTwoNumber.match(/[a-zA-Z]+|[0-9]+/g);
                        console.log("arr" + JSON.stringify(stringArr));
                        _this.FromFlightTwo.ReaccomAirlineCode = stringArr[0];
                        _this.FromFlightTwo.ReaccomFlightNo = stringArr[1];
                    }
                    _this.FromFlightTwo.ReaccomFlightDt = _this.FromFlightTwoDate;
                    data.ReaccomDetails.push(_this.FromFlightTwo);
                }
                if (_this.ToFlightOneNumber != "") {
                    _this.ToFlightOne.FromToFlag = "TO";
                    _this.ToFlightOne.GUIDisplayFlag = "3";
                    var reg = new RegExp('^[0-9]*$');
                    var test = reg.test(_this.ToFlightOneNumber);
                    if (test == true) {
                        _this.ToFlightOne.ReaccomAirlineCode = ApplicationSettings.getString("carrierCode", "");
                        _this.ToFlightOne.ReaccomFlightNo = _this.ToFlightOneNumber;
                    }
                    else {
                        var stringArr = [];
                        stringArr = _this.ToFlightOneNumber.match(/[a-zA-Z]+|[0-9]+/g);
                        console.log("arr" + JSON.stringify(stringArr));
                        _this.ToFlightOne.ReaccomAirlineCode = stringArr[0];
                        _this.ToFlightOne.ReaccomFlightNo = stringArr[1];
                    }
                    _this.ToFlightOne.ReaccomFlightDt = _this.ToFlightOneDate;
                    data.ReaccomDetails.push(_this.ToFlightOne);
                    // this.PaxItem.ReaccomDetails = data.ReaccomDetails;
                }
                if (_this.ToFlightTwoNumber != "") {
                    _this.ToFlightTwo.FromToFlag = "TO";
                    _this.ToFlightTwo.GUIDisplayFlag = "4";
                    var reg = new RegExp('^[0-9]*$');
                    var test = reg.test(_this.ToFlightTwoNumber);
                    if (test == true) {
                        _this.ToFlightTwo.ReaccomAirlineCode = ApplicationSettings.getString("carrierCode", "");
                        _this.ToFlightTwo.ReaccomFlightNo = _this.ToFlightTwoNumber;
                    }
                    else {
                        var stringArr = [];
                        stringArr = _this.ToFlightTwoNumber.match(/[a-zA-Z]+|[0-9]+/g);
                        console.log("arr" + JSON.stringify(stringArr));
                        _this.ToFlightTwo.ReaccomAirlineCode = stringArr[0];
                        _this.ToFlightTwo.ReaccomFlightNo = stringArr[1];
                    }
                    _this.ToFlightTwo.ReaccomFlightDt = _this.ToFlightTwoDate;
                    data.ReaccomDetails.push(_this.ToFlightTwo);
                }
                _this.PaxItem.ReaccomDetails = data.ReaccomDetails;
                if (_this.PaxItem.CustomerCareCaseNum != "") {
                    data.CustomerCareCaseNum = _this.PaxItem.CustomerCareCaseNum;
                }
                if (_this.PaxItem.WorldTracerNum != "") {
                    data.WorldTracerNum = _this.PaxItem.WorldTracerNum;
                }
                if (_this.PaxItem.monetaryfreeText != "") {
                    data.monetaryfreeText = _this.PaxItem.monetaryfreeText;
                }
                if (_this.PaxItem.hotelFreeText != "") {
                    data.hotelFreeText = _this.PaxItem.hotelFreeText;
                }
                if (_this.PaxItem.hotelDetails != "") {
                    data.hotelDetails = _this.PaxItem.hotelDetails;
                }
                if (_this.PaxItem.mealFreeText != "") {
                    data.mealFreeText = _this.PaxItem.mealFreeText;
                }
                if (_this.PaxItem.mealDetails != "") {
                    data.mealDetails = _this.PaxItem.mealDetails;
                }
                if (_this.PaxItem.transportFreeText != "") {
                    data.transportFreeText = _this.PaxItem.transportFreeText;
                }
                if (_this.PaxItem.transportEMD != "") {
                    data.transportEMD = _this.PaxItem.transportEMD;
                }
            }
            if (_this.PaxItem.copyToSelectedPax == true) {
                _this.CompensationPassengerList.forEach(function (paxData, paxIndex) {
                    _this.selectedPassenger.forEach(function (seldata, Index) {
                        if (paxData.GivenName == seldata.GivenName && paxData.LastName == seldata.LastName && paxData.OrderId == seldata.OrderId) {
                            paxData.copyToSelectedPax = true;
                            paxData.hotelFreeText = _this.PaxItem.hotelFreeText;
                            paxData.monetaryfreeText = _this.PaxItem.monetaryfreeText;
                            paxData.mealFreeText = _this.PaxItem.mealFreeText;
                            paxData.transportFreeText = _this.PaxItem.transportFreeText;
                            paxData.mealDetails = _this.PaxItem.mealDetails;
                            paxData.hotelDetails = _this.PaxItem.hotelDetails;
                            paxData.transportEMD = _this.PaxItem.transportEMD;
                        }
                    });
                });
            }
            // console.log("R@:" + JSON.stringify(data.ReaccomDetails));
            if (_this.PaxItem.copyToSelectedPaxReaccom == true) {
                _this.CompensationPassengerList.forEach(function (paxData, paxIndex) {
                    _this.selectedPassenger.forEach(function (seldata, Index) {
                        if (paxData.GivenName == seldata.GivenName && paxData.LastName == seldata.LastName && paxData.OrderId == seldata.OrderId) {
                            paxData.copyToSelectedPaxReaccom = true;
                            console.log("V:" + JSON.stringify(data.ReaccomDetails));
                            paxData.ReaccomDetails = _this.PaxItem.ReaccomDetails;
                        }
                    });
                });
            }
        });
        this._shared.setCompensationPaxList(this.CompensationPassengerList);
        this.navigateBack();
    };
    CompensationAdditionalDetailsComponent.prototype.clearFrom1FlightInfo = function () {
        this.FromFlightOneNumber = "";
        this.FromFlightOne.ReaccomBoardCityCd = "";
        this.FromFlightOne.ReaccomOffCityCd = "";
        this.FromFlightOneDate = "";
    };
    CompensationAdditionalDetailsComponent.prototype.clearFrom2FlightInfo = function () {
        this.FromFlightTwoNumber = "";
        this.FromFlightTwo.ReaccomBoardCityCd = "";
        this.FromFlightTwo.ReaccomOffCityCd = "";
        this.FromFlightTwoDate = "";
    };
    CompensationAdditionalDetailsComponent.prototype.clearTo1FlightInfo = function () {
        this.ToFlightOneNumber = "";
        this.ToFlightOne.ReaccomBoardCityCd = "";
        this.ToFlightOne.ReaccomOffCityCd = "";
        this.ToFlightOneDate = "";
        this.onChange(this.ToFlightOneNumber, 1);
    };
    CompensationAdditionalDetailsComponent.prototype.clearTo2FlightInfo = function () {
        this.ToFlightTwoNumber = "";
        this.ToFlightTwo.ReaccomBoardCityCd = "";
        this.ToFlightTwo.ReaccomOffCityCd = "";
        this.ToFlightTwoDate = "";
    };
    CompensationAdditionalDetailsComponent.prototype.navigateBack = function () {
        this.routerExtensions.back();
    };
    CompensationAdditionalDetailsComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationAdditionalDetailsComponent.prototype.navigateToSearch = function () {
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
    CompensationAdditionalDetailsComponent.prototype.navigateToDepartures = function () {
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
    CompensationAdditionalDetailsComponent.prototype.handleServiceError = function (error) {
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
    var CompensationAdditionalDetailsComponent_1;
    CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFIRSTTAB = "Compensation History";
    CompensationAdditionalDetailsComponent.ADDITIONALDETAILSSECONDTAB = "Re-accomodation";
    CompensationAdditionalDetailsComponent.ADDITIONALDETAILSTHIRDTAB = "Compensation Details";
    CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFOURTHTAB = "Other Details";
    CompensationAdditionalDetailsComponent.PREVIOUSSCREENCHECK = "SearchResult";
    CompensationAdditionalDetailsComponent.COMPTYPEMONETARY = "Monetary";
    CompensationAdditionalDetailsComponent.COMPTYPEHOTEL = "Hotel";
    CompensationAdditionalDetailsComponent.COMPTYPEMEAL = "Meal";
    CompensationAdditionalDetailsComponent.COMPTYPETRANSPORT = "Transportation";
    CompensationAdditionalDetailsComponent.INVALIDAIRLINECODE = "Invalid input. Enter airline code and flight number";
    CompensationAdditionalDetailsComponent.INVALIDDEPACODE = "Invalid input. Enter departure station code. ";
    CompensationAdditionalDetailsComponent.INVALIDARRICODE = "Invalid input. Enter arrival station code. ";
    CompensationAdditionalDetailsComponent.INVALIDCUSTOMERCARECODE = "Invalid input. Enter customer care number.";
    CompensationAdditionalDetailsComponent.INVALIDWORLDTRACENUMBER = "Invalid input. Enter world trace number.";
    __decorate([
        core_1.ViewChild('pagecontainer'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "pageCont", void 0);
    __decorate([
        core_1.ViewChild('segbar1'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "segbar1", void 0);
    __decorate([
        core_1.ViewChild('segbar2'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "segbar2", void 0);
    __decorate([
        core_1.ViewChild('firstLayer'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "firstLayer", void 0);
    __decorate([
        core_1.ViewChild('secondLayer'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "secondLayer", void 0);
    __decorate([
        core_1.ViewChild('thirdLayer'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "thirdLayer", void 0);
    __decorate([
        core_1.ViewChild('fourthLayer'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "fourthLayer", void 0);
    __decorate([
        core_1.ViewChild('compensationhistory'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "compensationhistory", void 0);
    __decorate([
        core_1.ViewChild('reaccomodationdetails'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "reaccomodationdetails", void 0);
    __decorate([
        core_1.ViewChild('compensationdetails'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "compensationdetails", void 0);
    __decorate([
        core_1.ViewChild('otherdetails'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "otherdetails", void 0);
    __decorate([
        core_1.ViewChild('fromflight'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "fromflight", void 0);
    __decorate([
        core_1.ViewChild('toflight'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "toflight", void 0);
    __decorate([
        core_1.ViewChild('monetoryemd'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "monetoryemd", void 0);
    __decorate([
        core_1.ViewChild('hotelemd'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "hotelemd", void 0);
    __decorate([
        core_1.ViewChild('mealemd'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "mealemd", void 0);
    __decorate([
        core_1.ViewChild('transportemd'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationAdditionalDetailsComponent.prototype, "transportemd", void 0);
    CompensationAdditionalDetailsComponent = CompensationAdditionalDetailsComponent_1 = __decorate([
        core_1.Component({
            selector: "compensationadditionaldetails-page",
            providers: [index_3.DataService, index_3.PassengerService, app_constants_1.Configuration],
            templateUrl: "./components/compensationadditionaldetails/compensationadditionaldetails.component.html",
            styleUrls: ["./components/compensationadditionaldetails/compensationadditionaldetails.component.css"]
        }),
        __metadata("design:paramtypes", [app_constants_1.Configuration, index_3.PassengerService, router_1.ActivatedRoute, modal_dialog_1.ModalDialogService, index_3.CheckinOrderService, core_1.ViewContainerRef, page_1.Page, router_2.RouterExtensions, index_3.TimeOutService, router_1.Router, index_3.DataService, index_3.PassengerService, router_1.ActivatedRoute])
    ], CompensationAdditionalDetailsComponent);
    return CompensationAdditionalDetailsComponent;
}());
exports.CompensationAdditionalDetailsComponent = CompensationAdditionalDetailsComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGVuc2F0aW9uYWRkaXRpb25hbGRldGFpbHMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tcGVuc2F0aW9uYWRkaXRpb25hbGRldGFpbHMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLHNDQUEyRjtBQUMzRiwwQ0FBMkU7QUFHM0Usc0RBQStEO0FBQy9ELGdDQUErQjtBQUsvQixvQ0FBc0M7QUFFdEMsa0RBQWtFO0FBQ2xFLGtFQUEyRjtBQUMzRixvRkFBb0c7QUFHcEcsOEJBQThCO0FBQzlCLDBEQUE0RDtBQUM1RCwrQkFBaUM7QUFDakMsMENBQTRDO0FBRTVDLGdCQUFnQjtBQUNoQixzREFBeUw7QUFDekwsa0RBQTJHO0FBQzNHLHFEQUFpSDtBQUdqSCxxREFBb0Q7QUFVcEQ7SUEwSUksZ0RBQW9CLGNBQTZCLEVBQVUsU0FBMkIsRUFBVSxlQUErQixFQUFVLGFBQWlDLEVBQVUsT0FBNEIsRUFBVSxLQUF1QixFQUFVLElBQVUsRUFBVSxnQkFBa0MsRUFBUyxlQUErQixFQUFVLE1BQWMsRUFBUyxZQUF5QixFQUFTLFFBQTBCLEVBQVUsS0FBcUI7UUFBamMsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFvQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQXFCO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBa0I7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUFTLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBYTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQWtCO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUE5RzljLGVBQVUsR0FBWSxJQUFJLENBQUM7UUFDM0IsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFDN0IsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUM1QixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUM3QixpQkFBWSxHQUFZLEtBQUssQ0FBQztRQUM5QixlQUFVLEdBQVksS0FBSyxDQUFDO1FBQzVCLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBQy9CLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFDNUIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUMzQixvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUNqQyx5QkFBb0IsR0FBWSxLQUFLLENBQUM7UUFDdEMsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFDaEMscUJBQWdCLEdBQXlDLElBQUksZ0NBQXdCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDcEcsd0JBQW1CLEdBQVksSUFBSSxDQUFDO1FBQ3BDLDBCQUFxQixHQUFZLEtBQUssQ0FBQztRQUN2Qyx3QkFBbUIsR0FBWSxLQUFLLENBQUM7UUFDckMsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFDOUIsOEJBQXlCLEdBQWdDLElBQUksdUJBQWUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMzRiw2QkFBd0IsR0FBOEQsRUFBRSxDQUFDO1FBQ3pGLHNCQUFpQixHQUE4RCxFQUFFLENBQUM7UUFFbEYsYUFBUSxHQUFHLElBQUksZ0NBQWdCLEVBQUUsQ0FBQztRQUNsQyxjQUFTLEdBQUcsSUFBSSxnQ0FBZ0IsRUFBRSxDQUFDO1FBQ25DLGFBQVEsR0FBRyxJQUFJLGdDQUFnQixFQUFFLENBQUM7UUFDbEMsY0FBUyxHQUFHLElBQUksZ0NBQWdCLEVBQUUsQ0FBQztRQUduQyxtQkFBYyxHQUFZLEtBQUssQ0FBQztRQUNoQyxtQkFBYyxHQUFZLEtBQUssQ0FBQztRQUNoQyxpQkFBWSxHQUFZLEtBQUssQ0FBQztRQUM5QixpQkFBWSxHQUFZLEtBQUssQ0FBQztRQUk5QixpQkFBWSxHQUFrQixFQUFFLENBQUM7UUFDakMsY0FBUyxHQUFrQixFQUFFLENBQUM7UUFDOUIsYUFBUSxHQUFrQixFQUFFLENBQUM7UUFDN0Isa0JBQWEsR0FBa0IsRUFBRSxDQUFDO1FBQ2xDLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBQ2pDLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBQy9CLHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQUNwQyxxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFDbEMsdUJBQWtCLEdBQVksS0FBSyxDQUFDO1FBQ3BDLHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQUNwQyxxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFDbEMsdUJBQWtCLEdBQVksS0FBSyxDQUFDO1FBQ3BDLHFCQUFnQixHQUFZLEtBQUssQ0FBQztRQUNsQyxtQkFBYyxHQUFZLEtBQUssQ0FBQztRQUNoQyxxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFDbEMscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBQ2xDLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBQ2hDLHFCQUFnQixHQUFZLEtBQUssQ0FBQztRQUVsQyx3QkFBbUIsR0FBVyxFQUFFLENBQUM7UUFFakMsd0JBQW1CLEdBQVcsRUFBRSxDQUFDO1FBRWpDLHNCQUFpQixHQUFXLEVBQUUsQ0FBQztRQUUvQixzQkFBaUIsR0FBVyxFQUFFLENBQUM7UUFHL0IscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBQ2xDLDZCQUF3QixHQUFZLEtBQUssQ0FBQztRQUMxQywwQkFBcUIsR0FBWSxLQUFLLENBQUM7UUFDdkMseUJBQW9CLEdBQVksS0FBSyxDQUFDO1FBQ3RDLDhCQUF5QixHQUFZLEtBQUssQ0FBQztRQUMzQyxzQkFBaUIsR0FBWSxLQUFLLENBQUM7UUFDbkMsd0JBQW1CLEdBQVksS0FBSyxDQUFDO1FBQ3JDLGlCQUFZLEdBQVksS0FBSyxDQUFDO1FBQzlCLG9CQUFlLEdBQVksSUFBSSxDQUFDO1FBQ2hDLDJCQUFzQixHQUFrQixFQUFFLENBQUM7UUFDM0Msd0JBQW1CLEdBQWtCLEVBQUUsQ0FBQztRQUN4Qyx1QkFBa0IsR0FBa0IsRUFBRSxDQUFDO1FBQ3ZDLDRCQUF1QixHQUFrQixFQUFFLENBQUM7UUFDNUMsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFDOUIsc0JBQWlCLEdBQVksS0FBSyxDQUFDO1FBQ25DLHdCQUFtQixHQUFZLEtBQUssQ0FBQztRQUNyQyx3QkFBbUIsR0FBWSxLQUFLLENBQUM7UUFDckMscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBQ2xDLHFCQUFnQixHQUFZLEtBQUssQ0FBQztRQUNsQyxvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUNqQyx5QkFBb0IsR0FBWSxLQUFLLENBQUM7UUFDdEMscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBQ2xDLGtCQUFhLEdBQTJDLElBQUksZ0NBQXdCLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckcsa0JBQWEsR0FBMkMsSUFBSSxnQ0FBd0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNyRyxnQkFBVyxHQUEyQyxJQUFJLGdDQUF3QixDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ25HLGdCQUFXLEdBQTJDLElBQUksZ0NBQXdCLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDbkcsd0JBQW1CLEdBQXlELEVBQUUsQ0FBQztRQUMvRSxvQkFBZSxHQUF5RCxFQUFFLENBQUM7UUFDM0UscUJBQWdCLEdBQXlELEVBQUUsQ0FBQztRQUM1RSx5QkFBb0IsR0FBeUQsRUFBRSxDQUFDO1FBQ2hGLDhCQUF5QixHQUE4RCxFQUFFLENBQUM7UUFDMUYsc0JBQWlCLEdBQVksS0FBSyxDQUFDO1FBQ25DLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBZWhDLGlCQUFZLEdBQVksS0FBSyxDQUFDO1FBRWpDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLGdEQUFnRDtRQUNoRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMzRCx3RUFBd0U7UUFDeEUsd0VBQXdFO1FBQ3hFLHNFQUFzRTtRQUN0RSxzRUFBc0U7UUFDdEUsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLHNCQUFjLEVBQUUsQ0FBQztRQUMzQyx5QkFBeUI7UUFFekIsMEZBQTBGO1FBQzFGLHdDQUF3QztRQUV4Qyw0RkFBNEY7UUFDNUYseUNBQXlDO1FBRXpDLDBGQUEwRjtRQUMxRix3Q0FBd0M7UUFFeEMsNEZBQTRGO1FBQzVGLHlDQUF5QztJQUM3QyxDQUFDOytDQWxLUSxzQ0FBc0M7SUFtSy9DLHlEQUFRLEdBQVI7UUFBQSxpQkEwUkM7UUF6UkcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLGlDQUFpQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUM7UUFDMUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDM0QsSUFBSSxDQUFDLGlCQUFpQixHQUFHLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxjQUFjLEdBQUcsbUJBQW1CLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDdkUsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxFQUFFO1lBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1NBQzdCO2FBQU07WUFDSCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztZQUMxQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUN6QixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUM7U0FFbks7UUFDRCxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBQyxNQUFNO1lBQzlDLEtBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMxQyxLQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN0QyxLQUFJLENBQUMsYUFBYSxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQyxDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBQyxNQUFNO1lBQzlDLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLElBQUk7Z0JBQzdCLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFO2dCQUMzQixNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksV0FBVyxFQUFFO2dCQUV0QyxLQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDM0QseURBQXlEO2dCQUN6RCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDMUQ7UUFDTCxDQUFDLENBQUMsQ0FBQTtRQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDbkQsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLGNBQWMsRUFBRTtZQUNyQyw2REFBNkQ7WUFDN0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7WUFDNUIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztZQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyx3Q0FBc0MsQ0FBQyx5QkFBeUIsQ0FBQztZQUN2RixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsd0NBQXNDLENBQUMsMEJBQTBCLENBQUM7WUFDekYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3pDO2FBQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLGtCQUFrQixFQUFFO1lBQ2hELElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLHdDQUFzQyxDQUFDLHlCQUF5QixDQUFDO1lBQ3ZGLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyx3Q0FBc0MsQ0FBQywwQkFBMEIsQ0FBQztZQUN6RixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsd0NBQXNDLENBQUMseUJBQXlCLENBQUM7WUFDdkYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLHdDQUFzQyxDQUFDLDBCQUEwQixDQUFDO1lBQ3pGLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUV0QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLElBQUksSUFBSSxFQUFFO2dCQUMzQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFDekIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO2dCQUM3QixJQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO2FBQ3JDO2lCQUFNO2dCQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUMxQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztnQkFDNUIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztnQkFDakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLHdDQUFzQyxDQUFDLHlCQUF5QixDQUFDO2dCQUN2RixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLHdDQUFzQyxDQUFDLDBCQUEwQixDQUFDO2dCQUN6RixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDekM7U0FDSjthQUFNLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxTQUFTLEVBQUU7WUFDdkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsd0NBQXNDLENBQUMseUJBQXlCLENBQUM7WUFDdkYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLHdDQUFzQyxDQUFDLDBCQUEwQixDQUFDO1lBQ3pGLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyx3Q0FBc0MsQ0FBQyx5QkFBeUIsQ0FBQztZQUN2RixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsd0NBQXNDLENBQUMsMEJBQTBCLENBQUM7WUFDekYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQzFCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1lBQzdCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1lBQzVCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7U0FDcEM7YUFBTSxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksc0JBQXNCLEVBQUU7WUFDcEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsd0NBQXNDLENBQUMseUJBQXlCLENBQUM7WUFDdkYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLHdDQUFzQyxDQUFDLDBCQUEwQixDQUFDO1lBQ3pGLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyx3Q0FBc0MsQ0FBQyx5QkFBeUIsQ0FBQztZQUN2RixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsd0NBQXNDLENBQUMsMEJBQTBCLENBQUM7WUFDekYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsSUFBSSxJQUFJLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2dCQUN6QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztnQkFDN0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7YUFDckM7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO2dCQUM3QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztnQkFDNUIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQzthQUNwQztTQUNKO2FBQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLFdBQVcsRUFBRTtZQUN6QyxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyx3Q0FBc0MsQ0FBQyx5QkFBeUIsQ0FBQztZQUN2RixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsd0NBQXNDLENBQUMsMEJBQTBCLENBQUM7WUFDekYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLHdDQUFzQyxDQUFDLHlCQUF5QixDQUFDO1lBQ3ZGLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyx3Q0FBc0MsQ0FBQywwQkFBMEIsQ0FBQztZQUN6RixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDekIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7WUFDN0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7WUFDN0IsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztTQUNyQzthQUFNO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyx3Q0FBc0MsQ0FBQyx5QkFBeUIsQ0FBQztZQUN2RixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsd0NBQXNDLENBQUMsMEJBQTBCLENBQUM7WUFDekYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1lBQzVCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1lBQzdCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7U0FDckM7UUFDRCxJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksS0FBSyxFQUFFO1lBQy9CLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDcEUsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLDRCQUE0QixDQUFDO1lBQzlELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQztZQUN4RCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUM7WUFDdEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGtDQUFrQyxDQUFDO1lBQ3JFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUM7U0FDMUU7UUFDRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLElBQUksSUFBSSxFQUFFO1lBQzVDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7U0FDakM7YUFBTTtZQUNILElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7WUFDN0IsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFlBQVksSUFBSSx3Q0FBc0MsQ0FBQyxnQkFBZ0IsRUFBekUsQ0FBeUUsQ0FBQyxDQUFDO2dCQUNySixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pFLElBQUksSUFBSSxDQUFDLG1CQUFtQixJQUFJLElBQUksRUFBRTtvQkFDbEMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLO3dCQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ2pELElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxFQUFDOzRCQUM1QyxLQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3lCQUN4SDs2QkFBSTs0QkFDRCxLQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3lCQUN4SDt3QkFDRCxLQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUU7d0JBQ3hFLEtBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUM7b0JBQ3pDLENBQUMsQ0FBQyxDQUFBO2lCQUNMO2dCQUNELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxZQUFZLElBQUksd0NBQXNDLENBQUMsYUFBYSxFQUF0RSxDQUFzRSxDQUFDLENBQUM7Z0JBQy9JLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksRUFBRTtvQkFDL0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLO3dCQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ2hELEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDcEUsSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDLEVBQUM7NEJBQzVDLEtBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3lCQUNySDs2QkFBSTs0QkFDRCxLQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt5QkFDckg7d0JBQ0QsS0FBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztvQkFDdEMsQ0FBQyxDQUFDLENBQUE7aUJBQ0w7Z0JBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxZQUFZLElBQUksd0NBQXNDLENBQUMsWUFBWSxFQUFyRSxDQUFxRSxDQUFDLENBQUM7Z0JBQzdJLElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLEVBQUU7b0JBQzlCLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFFLEtBQUs7d0JBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDaEQsS0FBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNuRSxJQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUMsRUFBQzs0QkFDNUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7eUJBQ3BIOzZCQUFJOzRCQUNELEtBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3lCQUNwSDt3QkFDRCxLQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDO29CQUNyQyxDQUFDLENBQUMsQ0FBQTtpQkFDTDtnQkFDRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsWUFBWSxJQUFJLHdDQUFzQyxDQUFDLGlCQUFpQixFQUExRSxDQUEwRSxDQUFDLENBQUM7Z0JBQ3ZKLElBQUksSUFBSSxDQUFDLG9CQUFvQixJQUFJLElBQUksRUFBRTtvQkFDbkMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLO3dCQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ2hELEtBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDeEUsSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDLEVBQUM7NEJBQzVDLEtBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7eUJBQ3pIOzZCQUFJOzRCQUNELEtBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7eUJBQ3pIO3dCQUNELEtBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUM7b0JBQzFDLENBQUMsQ0FBQyxDQUFBO2lCQUNMO2FBRUo7U0FDSjtRQUNELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUU7WUFDN0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsVUFBVSxJQUFJLE1BQU0sSUFBSSxDQUFDLENBQUMsY0FBYyxJQUFJLEdBQUcsRUFBakQsQ0FBaUQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ILElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxTQUFTLEVBQUU7Z0JBQy9ELElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLElBQUksR0FBRyxFQUFFO29CQUM1RixJQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDO2lCQUNqQztxQkFBTTtvQkFDSCxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLElBQUksSUFBSSxFQUFFO3dCQUMvQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUM7cUJBQ2pFO3lCQUFNO3dCQUNILElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDO3FCQUN6RztpQkFDSjtnQkFDRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUM7YUFDL0Q7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGdDQUF3QixDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNsRSxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztnQkFDM0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQzthQUMzQztZQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsVUFBVSxJQUFJLE1BQU0sSUFBSSxDQUFDLENBQUMsY0FBYyxJQUFJLEdBQUcsRUFBakQsQ0FBaUQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ILElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxTQUFTLEVBQUU7Z0JBQy9ELElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLElBQUksR0FBRyxFQUFFO29CQUM1RixJQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDO2lCQUNqQztxQkFBTTtvQkFDSCxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLElBQUksSUFBSSxFQUFFO3dCQUMvQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUM7cUJBQ2pFO3lCQUFNO3dCQUNILElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDO3FCQUN6RztpQkFDSjtnQkFDRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUM7YUFDL0Q7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGdDQUF3QixDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNsRSxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztnQkFDM0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxHQUFFLEVBQUUsQ0FBQzthQUMxQztZQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFVBQVUsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLGNBQWMsSUFBSSxHQUFHLEVBQS9DLENBQStDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvRyxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksU0FBUyxFQUFFO2dCQUMzRCxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxJQUFJLEdBQUcsRUFBRTtvQkFDeEYsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztpQkFDL0I7cUJBQU07b0JBQ0gsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixJQUFJLElBQUksRUFBRTt3QkFDN0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDO3FCQUM3RDt5QkFBTTt3QkFDSCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztxQkFDbkc7aUJBQ0o7Z0JBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQzthQUMzRDtpQkFBTTtnQkFDSCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO2dCQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksZ0NBQXdCLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ2hFLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFDO2dCQUN6QyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDbEY7WUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxVQUFVLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxjQUFjLElBQUksR0FBRyxFQUEvQyxDQUErQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0csSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLFNBQVMsRUFBRTtnQkFDM0QsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsSUFBSSxHQUFHLEVBQUU7b0JBQ3hGLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7aUJBQy9CO3FCQUFNO29CQUNILElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLEVBQUU7d0JBQzdDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztxQkFDN0Q7eUJBQU07d0JBQ0gsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUM7cUJBQ25HO2lCQUNKO2dCQUNELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUM7YUFDM0Q7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLGdDQUF3QixDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNoRSxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztnQkFDekMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ2xGO1NBQ0o7SUFHTCxDQUFDO0lBQ0QsOERBQWEsR0FBYjtRQUVJLElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLEVBQUU7WUFDOUIsT0FBTyxJQUFJLENBQUM7U0FDZjs7WUFBTSxPQUFPLEtBQUssQ0FBQztJQUN4QixDQUFDO0lBQ0Qsa0VBQWlCLEdBQWpCO1FBQUEsaUJBbUJDO1FBbEJHLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLEVBQUU7WUFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7WUFDdkMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLO2dCQUN2QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFBO1NBQ0w7YUFBTTtZQUNILElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSztnQkFDdkMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztnQkFDOUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztnQkFDaEQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ3RELElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDO2dCQUN4RCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO2dCQUM5QyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1lBQ2xELENBQUMsQ0FBQyxDQUFBO1NBQ0w7SUFDTCxDQUFDO0lBQ0QsZ0ZBQStCLEdBQS9CO1FBQ0ksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLHdCQUF3QixJQUFJLElBQUksRUFBRTtZQUMvQyxJQUFJLENBQUMsT0FBTyxDQUFDLHdCQUF3QixHQUFHLEtBQUssQ0FBQztZQUM5QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFFLEtBQUs7Z0JBQ3ZDLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUM7WUFDekMsQ0FBQyxDQUFDLENBQUE7U0FDTDthQUFNO1lBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUM7WUFDN0Msb0RBQW9EO1lBQ3BELDRDQUE0QztZQUM1Qyx3REFBd0Q7WUFDeEQsS0FBSztTQUVSO0lBQ0wsQ0FBQztJQUNELHlEQUFRLEdBQVIsVUFBUyxJQUFTLEVBQUUsS0FBVTtRQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25CLFFBQVEsS0FBSyxFQUFFO1lBQ1gsS0FBSyxDQUFDO2dCQUNGLDZDQUE2QztnQkFDN0Msc0NBQXNDO2dCQUN0QyxXQUFXO2dCQUNYLElBQUksSUFBSSxDQUFDLG1CQUFtQixJQUFJLEVBQUUsRUFBRTtvQkFDaEMsZ0RBQWdEO29CQUNoRCxJQUFJLE9BQU8sR0FBRyw0QkFBNEIsQ0FBQztvQkFDM0MsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztvQkFDbEQsSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFO3dCQUNmLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7d0JBQy9CLG9GQUFvRjtxQkFDdkY7eUJBQU07d0JBQ0gsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztxQkFDbkM7aUJBQ0o7cUJBQ0k7b0JBQ0QsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztpQkFDbkM7Z0JBQ0QsSUFBSTtnQkFDSixNQUFNO1lBQ1YsS0FBSyxDQUFDO2dCQUNGLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsSUFBSSxTQUFTLEVBQUU7b0JBQ3BELElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUNsRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO3FCQUNsQzt5QkFBTTt3QkFDSCxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLElBQUksSUFBSSxFQUFFOzRCQUMvQyxJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQzs0QkFDcEMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7NEJBQzNELElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtnQ0FDZixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO2dDQUMvQixLQUFLLENBQUMsUUFBUSxDQUFDLHdDQUFzQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOzZCQUNqRjtpQ0FBTTtnQ0FDSCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDOzZCQUNuQzt5QkFDSjs2QkFBTTs0QkFDSCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO3lCQUNuQztxQkFDSjtpQkFDSjtnQkFDRCxNQUFNO1lBQ1YsS0FBSyxDQUFDO2dCQUNGLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsSUFBSSxTQUFTLEVBQUU7b0JBQ2xELElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUNoRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO3FCQUNoQzt5QkFBTTt3QkFDSCxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLElBQUksSUFBSSxFQUFFOzRCQUM3QyxJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQzs0QkFDcEMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7NEJBQ3pELElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtnQ0FDZixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO2dDQUM3QixLQUFLLENBQUMsUUFBUSxDQUFDLHdDQUFzQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOzZCQUNqRjtpQ0FBTTtnQ0FDSCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDOzZCQUNqQzt5QkFDSjs2QkFBTTs0QkFDSCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO3lCQUNqQztxQkFDSjtpQkFDSjtnQkFDRCxNQUFNO1lBQ1YsS0FBSyxDQUFDO2dCQUNGLDZDQUE2QztnQkFDN0Msc0NBQXNDO2dCQUN0QyxXQUFXO2dCQUNYLElBQUksSUFBSSxDQUFDLG1CQUFtQixJQUFJLEVBQUUsRUFBRTtvQkFDaEMsSUFBSSxPQUFPLEdBQUcsNEJBQTRCLENBQUM7b0JBQzNDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7b0JBQ2xELElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTt3QkFDZixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO3dCQUMvQixvRkFBb0Y7cUJBQ3ZGO3lCQUFNO3dCQUNILElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7cUJBQ25DO2lCQUNKO3FCQUNJO29CQUNELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7aUJBQ25DO2dCQUNELElBQUk7Z0JBQ0osTUFBTTtZQUNWLEtBQUssQ0FBQztnQkFDRixJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLElBQUksU0FBUyxFQUFFO29CQUNwRCxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDbEQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztxQkFDbEM7eUJBQU07d0JBQ0gsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixJQUFJLElBQUksRUFBRTs0QkFDL0MsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7NEJBQ3BDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOzRCQUMzRCxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7Z0NBQ2YsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztnQ0FDL0IsS0FBSyxDQUFDLFFBQVEsQ0FBQyx3Q0FBc0MsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs2QkFDakY7aUNBQU07Z0NBQ0gsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQzs2QkFDbkM7eUJBQ0o7NkJBQU07NEJBQ0gsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQzt5QkFDbkM7cUJBQ0o7aUJBQ0o7Z0JBQ0QsTUFBTTtZQUNWLEtBQUssQ0FBQztnQkFDRixJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLElBQUksU0FBUyxFQUFFO29CQUNsRCxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDaEQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztxQkFDaEM7eUJBQU07d0JBQ0gsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixJQUFJLElBQUksRUFBRTs0QkFDN0MsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7NEJBQ3BDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzRCQUN6RCxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7Z0NBQ2YsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztnQ0FDN0IsS0FBSyxDQUFDLFFBQVEsQ0FBQyx3Q0FBc0MsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs2QkFDakY7aUNBQU07Z0NBQ0gsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQzs2QkFDakM7eUJBQ0o7NkJBQU07NEJBQ0gsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQzt5QkFDakM7cUJBQ0o7aUJBQ0o7Z0JBQ0QsTUFBTTtZQUNWLEtBQUssQ0FBQztnQkFDRiwyQ0FBMkM7Z0JBQzNDLG9DQUFvQztnQkFDcEMsV0FBVztnQkFDWCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLEVBQUU7b0JBQzlCLElBQUksT0FBTyxHQUFHLDRCQUE0QixDQUFDO29CQUMzQyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO29CQUNoRCxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7d0JBQ2YsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQzt3QkFDN0Isb0ZBQW9GO3FCQUN2Rjt5QkFBTTt3QkFDSCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO3FCQUNqQztpQkFDSjtxQkFDSTtvQkFDRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO2lCQUNqQztnQkFDRCxJQUFJO2dCQUNKLE1BQU07WUFDVixLQUFLLENBQUM7Z0JBQ0YsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixJQUFJLFNBQVMsRUFBRTtvQkFDbEQsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7d0JBQ2hELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7cUJBQ2hDO3lCQUFNO3dCQUNILElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLEVBQUU7NEJBQzdDLElBQUksR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDOzRCQUNwQyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs0QkFDekQsSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFO2dDQUNmLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7Z0NBQzdCLEtBQUssQ0FBQyxRQUFRLENBQUMsd0NBQXNDLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7NkJBQ2pGO2lDQUFNO2dDQUNILElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7NkJBQ2pDO3lCQUNKOzZCQUFNOzRCQUNILElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7eUJBQ2pDO3FCQUNKO2lCQUNKO2dCQUNELE1BQU07WUFDVixLQUFLLENBQUM7Z0JBQ04sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixJQUFJLFNBQVMsRUFBRTtvQkFDaEQsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7d0JBQzlDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO3FCQUM5Qjt5QkFBTTt3QkFDSCxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLElBQUksSUFBSSxFQUFFOzRCQUMzQyxJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQzs0QkFDcEMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7NEJBQ3ZELElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtnQ0FDZixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztnQ0FDM0IsS0FBSyxDQUFDLFFBQVEsQ0FBQyx3Q0FBc0MsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs2QkFDakY7aUNBQU07Z0NBQ0gsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7NkJBQy9CO3lCQUNKOzZCQUFNOzRCQUNILElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO3lCQUMvQjtxQkFDSjtpQkFDSjtnQkFDRyxNQUFNO1lBQ1YsS0FBSyxFQUFFO2dCQUNILDJDQUEyQztnQkFDM0Msb0NBQW9DO2dCQUNwQyxXQUFXO2dCQUNYLElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLEVBQUUsRUFBRTtvQkFDOUIsSUFBSSxPQUFPLEdBQUcsNEJBQTRCLENBQUM7b0JBQzNDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7b0JBQ2hELElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTt3QkFDZixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO3dCQUM3QixvRkFBb0Y7cUJBQ3ZGO3lCQUFNO3dCQUNILElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7cUJBQ2pDO2lCQUNKO3FCQUNJO29CQUNELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7aUJBQ2pDO2dCQUNELElBQUk7Z0JBQ0osTUFBTTtZQUNWLEtBQUssRUFBRTtnQkFDUCxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLElBQUksU0FBUyxFQUFDO29CQUNqRCxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDaEQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztxQkFDaEM7eUJBQU07d0JBQ0gsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixJQUFJLElBQUksRUFBRTs0QkFDN0MsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7NEJBQ3BDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOzRCQUN6RCxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7Z0NBQ2YsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztnQ0FDN0IsS0FBSyxDQUFDLFFBQVEsQ0FBQyx3Q0FBc0MsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs2QkFDakY7aUNBQU07Z0NBQ0gsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQzs2QkFDakM7eUJBQ0o7NkJBQU07NEJBQ0gsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQzt5QkFDakM7cUJBQ0o7aUJBQ0o7Z0JBQ0csTUFBTTtZQUNWLEtBQUssRUFBRTtnQkFDUCxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLElBQUksU0FBUyxFQUFDO29CQUMvQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDOUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7cUJBQzlCO3lCQUFNO3dCQUNILElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLEVBQUU7NEJBQzNDLElBQUksR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDOzRCQUNwQyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs0QkFDdkQsSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFO2dDQUNmLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO2dDQUMzQixLQUFLLENBQUMsUUFBUSxDQUFDLHdDQUFzQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOzZCQUNqRjtpQ0FBTTtnQ0FDSCxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQzs2QkFDL0I7eUJBQ0o7NkJBQU07NEJBQ0gsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7eUJBQy9CO3FCQUNKO2lCQUNKO2dCQUNHLE1BQU07WUFDVixLQUFLLEVBQUU7Z0JBQ0gsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFO29CQUN6QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO2lCQUNqQztxQkFBTTtvQkFDSCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxJQUFJLEVBQUUsRUFBRTt3QkFDbkMsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzt3QkFDdkMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO3dCQUNqRCxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7NEJBQ2YsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQzs0QkFDOUIsS0FBSyxDQUFDLFFBQVEsQ0FBQyx3Q0FBc0MsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO3lCQUN6Rjs2QkFBTTs0QkFDSCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO3lCQUNsQztxQkFDSjt5QkFDSTt3QkFDRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO3FCQUNsQztpQkFDSjtnQkFDRCxNQUFNO1lBQ1YsS0FBSyxFQUFFO2dCQUNILElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFO29CQUM5QyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO2lCQUNuQztxQkFBTTtvQkFDSCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLElBQUksRUFBRSxFQUFFO3dCQUN4QyxJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQzt3QkFDakMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7d0JBQ3RELElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTs0QkFDZixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDOzRCQUNoQyxLQUFLLENBQUMsUUFBUSxDQUFDLHdDQUFzQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7eUJBQ3pGOzZCQUFNOzRCQUNILElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7eUJBQ3BDO3FCQUNKO3lCQUNJO3dCQUNELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7cUJBQ3BDO2lCQUNKO2dCQUNELE1BQU07WUFDVixLQUFLLEVBQUU7Z0JBQ0gsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7b0JBQzNDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7b0JBQ2hDLEtBQUssQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDbEQ7cUJBQU07b0JBQ0gsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixJQUFJLEVBQUUsRUFBRTt3QkFDckMsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQzt3QkFDMUMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7d0JBQ25ELElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTs0QkFDZixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO3lCQUNuQzs2QkFBTTs0QkFDSCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO3lCQUNwQztxQkFDSjt5QkFDSTt3QkFDRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO3FCQUNwQztpQkFDSjtnQkFDRCxNQUFNO1lBQ1YsS0FBSyxFQUFFO2dCQUNILElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtvQkFDeEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztvQkFDN0IsS0FBSyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNsRDtxQkFBTTtvQkFDSCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxJQUFJLEVBQUUsRUFBRTt3QkFDbEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQzt3QkFDMUMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUNoRCxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7NEJBQ2YsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQzt5QkFDaEM7NkJBQU07NEJBQ0gsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQzt5QkFDakM7cUJBQ0o7eUJBQ0k7d0JBQ0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztxQkFDakM7aUJBQ0o7Z0JBQ0QsTUFBTTtZQUNWLEtBQUssRUFBRTtnQkFDSCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7b0JBQ3ZDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7b0JBQzdCLEtBQUssQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDbEQ7cUJBQU07b0JBQ0gsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksSUFBSSxFQUFFLEVBQUU7d0JBQ2pDLElBQUksR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7d0JBQzFDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQzt3QkFDL0MsSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFOzRCQUNmLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7eUJBQ2hDOzZCQUFNOzRCQUNILElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7eUJBQ2pDO3FCQUNKO3lCQUNJO3dCQUNELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7cUJBQ2pDO2lCQUNKO2dCQUNELE1BQU07WUFDVixLQUFLLEVBQUU7Z0JBQ0gsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFO29CQUN2QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztvQkFDNUIsS0FBSyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNsRDtxQkFBTTtvQkFDSCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxJQUFJLEVBQUUsRUFBRTt3QkFDakMsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQzt3QkFDMUMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO3dCQUMvQyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7NEJBQ2YsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7eUJBQy9COzZCQUFNOzRCQUNILElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO3lCQUNoQztxQkFDSjt5QkFDSTt3QkFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztxQkFDaEM7aUJBQ0o7Z0JBQ0QsTUFBTTtZQUNWLEtBQUssRUFBRTtnQkFDSCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtvQkFDNUMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztvQkFDakMsS0FBSyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNsRDtxQkFBTTtvQkFDSCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLElBQUksRUFBRSxFQUFFO3dCQUN0QyxJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO3dCQUMxQyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQzt3QkFDcEQsSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFOzRCQUNmLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7eUJBQ3BDOzZCQUFNOzRCQUNILElBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7eUJBQ3JDO3FCQUNKO3lCQUNJO3dCQUNELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7cUJBQ3JDO2lCQUNKO2dCQUNELE1BQU07WUFDVixLQUFLLEVBQUU7Z0JBQ0gsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFO29CQUN0QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO29CQUM5QixLQUFLLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ2xEO3FCQUFNO29CQUNILElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLElBQUksRUFBRSxFQUFFO3dCQUNoQyxJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO3dCQUMxQyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBQzlDLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTs0QkFDZixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO3lCQUNqQzs2QkFBTTs0QkFDSCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO3lCQUNsQztxQkFDSjt5QkFDSTt3QkFDRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO3FCQUNsQztpQkFDSjtnQkFDRCxNQUFNO1lBQ1YsS0FBSyxFQUFFO2dCQUNILElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtvQkFDdkMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztvQkFDaEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNsRDtxQkFBTTtvQkFDSCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxJQUFJLEVBQUUsRUFBRTt3QkFDakMsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQzt3QkFDMUMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO3dCQUMvQyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7NEJBQ2YsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQzt5QkFDbkM7NkJBQU07NEJBQ0gsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQzt5QkFDcEM7cUJBQ0o7eUJBQ0k7d0JBQ0QsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQztxQkFDcEM7aUJBQ0o7Z0JBQ0QsTUFBTTtZQUNWO2dCQUNJLE1BQU07U0FDYjtRQUNELGt1QkFBa3VCO1FBQ2x1QixtQ0FBbUM7UUFDbkMsV0FBVztRQUNYLG9DQUFvQztRQUNwQyxJQUFJO1FBQ0osd0RBQXdEO1FBQ3hELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQzVCLElBQUksSUFBSSxDQUFDLG1CQUFtQixJQUFJLEVBQUUsRUFBRTtZQUNoQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxTQUFTLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLEVBQUUsRUFBRTtnQkFDalEsSUFBSSxJQUFJLENBQUMsa0JBQWtCLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLEtBQUssRUFBRTtvQkFDeEcsK0JBQStCO2lCQUNsQztxQkFBTTtvQkFDSCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztpQkFDaEM7YUFDSjtpQkFBSTtnQkFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQzthQUNoQztTQUNKO1FBQ0QsSUFBSSxJQUFJLENBQUMsbUJBQW1CLElBQUksRUFBRSxFQUFFO1lBQ2hDLGdDQUFnQztZQUNoQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxTQUFTLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLEVBQUUsRUFBRTtnQkFDalEsSUFBSSxJQUFJLENBQUMsa0JBQWtCLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLEtBQUssRUFBRTtvQkFDcEcsK0JBQStCO2lCQUNsQztxQkFBTTtvQkFDSCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztpQkFDaEM7YUFDUjtpQkFBSTtnQkFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQzthQUNoQztTQUNKO1FBQ0QsSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksRUFBRSxFQUFFO1lBQzlCLGdDQUFnQztZQUNoQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksRUFBRSxFQUFFO2dCQUNyUCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLEtBQUssRUFBRTtvQkFDOUYsK0JBQStCO2lCQUNsQztxQkFBTTtvQkFDSCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztpQkFDaEM7YUFDUjtpQkFBSTtnQkFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQzthQUNoQztTQUNKO1FBQ0QsSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksRUFBRSxFQUFFO1lBQzlCLGdDQUFnQztZQUNoQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksRUFBRSxFQUFFO2dCQUNyUCxJQUFNLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLEtBQUssRUFBRztvQkFDakcsK0JBQStCO2lCQUNsQztxQkFBTTtvQkFDSCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztpQkFDaEM7YUFDUjtpQkFBSTtnQkFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQzthQUNoQztTQUNKO0lBR0wsQ0FBQztJQUNELCtEQUFjLEdBQWQ7UUFDSSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUM3QixDQUFDO0lBQ0QsNERBQVcsR0FBWDtRQUNJLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzdCLENBQUM7SUFDRCwyREFBVSxHQUFWO1FBQ0ksSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDN0IsQ0FBQztJQUNELGdFQUFlLEdBQWY7UUFDSSxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUM1QixDQUFDO0lBQ00sOERBQWEsR0FBcEIsVUFBcUIsQ0FBTTtRQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUN4QixJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxFQUFFO1lBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDN0QsSUFBSSxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUNiLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2dCQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQzthQUM1QjtpQkFBTSxJQUFJLE1BQU0sSUFBSSxDQUFDLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUMxQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7YUFDM0I7aUJBQ0k7YUFFSjtTQUNKO2FBQU07WUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzdELElBQUksTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDYixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO2dCQUNoQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO2dCQUNqQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztnQkFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO2dCQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztnQkFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7YUFDNUI7aUJBQU0sSUFBSSxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUNwQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO2dCQUNqQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO2dCQUNqQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO2dCQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztnQkFDMUIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2FBQzNCO2lCQUNJLElBQUksTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQztnQkFDakMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztnQkFDaEMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztnQkFDbkMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztnQkFDeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2FBRTFCO2lCQUFNO2dCQUNILElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2FBQzVCO1NBQ0o7SUFDTCxDQUFDO0lBRU0sd0VBQXVCLEdBQTlCLFVBQStCLENBQU07UUFDakMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQTtJQUMxQixDQUFDO0lBRUQsNEVBQTJCLEdBQTNCLFVBQTRCLElBQUk7UUFBaEMsaUJBd0JDO1FBdkJHLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVCLElBQUksT0FBTyxHQUF1QjtZQUM5QixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSztZQUM1QixPQUFPLEVBQUU7Z0JBQ0wsV0FBVyxFQUFFLFdBQVc7Z0JBQ3hCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixPQUFPLEVBQUUsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFlBQVksRUFBRTtnQkFDeEUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLEVBQUU7YUFDdEU7WUFDRCxVQUFVLEVBQUUsS0FBSztTQUNwQixDQUFDO1FBRUYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsbUNBQWUsRUFBRSxPQUFPLENBQUM7YUFDakQsSUFBSSxDQUFDLFVBQUMsVUFBZ0I7WUFDbkIsSUFBSSxVQUFVLEVBQUU7Z0JBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDLENBQUM7Z0JBQ3pDLElBQUksVUFBVSxDQUFDLFlBQVksRUFBRSxJQUFJLFdBQVcsRUFBRTtvQkFDMUMsS0FBSSxDQUFDLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQ3BFO2FBQ0o7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDRCx5RUFBd0IsR0FBeEIsVUFBeUIsSUFBSTtRQUE3QixpQkF3QkM7UUF2QkcsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUIsSUFBSSxPQUFPLEdBQXVCO1lBQzlCLGdCQUFnQixFQUFFLElBQUksQ0FBQyxLQUFLO1lBQzVCLE9BQU8sRUFBRTtnQkFDTCxXQUFXLEVBQUUsV0FBVztnQkFDeEIsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLE9BQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsWUFBWSxFQUFFO2dCQUN4RSxPQUFPLEVBQUUsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFlBQVksRUFBRTthQUN0RTtZQUNELFVBQVUsRUFBRSxLQUFLO1NBQ3BCLENBQUM7UUFFRixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxtQ0FBZSxFQUFFLE9BQU8sQ0FBQzthQUNqRCxJQUFJLENBQUMsVUFBQyxVQUFnQjtZQUNuQixJQUFJLFVBQVUsRUFBRTtnQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFDekMsSUFBSSxVQUFVLENBQUMsWUFBWSxFQUFFLElBQUksV0FBVyxFQUFFO29CQUMxQyxLQUFJLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDcEU7YUFDSjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNELHVFQUFzQixHQUF0QixVQUF1QixJQUFJO1FBQTNCLGlCQXdCQztRQXZCRyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1QixJQUFJLE9BQU8sR0FBdUI7WUFDOUIsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDNUIsT0FBTyxFQUFFO2dCQUNMLFdBQVcsRUFBRSxXQUFXO2dCQUN4QixhQUFhLEVBQUUsSUFBSTtnQkFDbkIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLEVBQUU7Z0JBQ3hFLE9BQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsWUFBWSxFQUFFO2FBQ3RFO1lBQ0QsVUFBVSxFQUFFLEtBQUs7U0FDcEIsQ0FBQztRQUVGLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLG1DQUFlLEVBQUUsT0FBTyxDQUFDO2FBQ2pELElBQUksQ0FBQyxVQUFDLFVBQWdCO1lBQ25CLElBQUksVUFBVSxFQUFFO2dCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLFVBQVUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxXQUFXLEVBQUU7b0JBQzFDLEtBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDbEU7YUFDSjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNELHVFQUFzQixHQUF0QixVQUF1QixJQUFJO1FBQTNCLGlCQXdCQztRQXZCRyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1QixJQUFJLE9BQU8sR0FBdUI7WUFDOUIsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDNUIsT0FBTyxFQUFFO2dCQUNMLFdBQVcsRUFBRSxXQUFXO2dCQUN4QixhQUFhLEVBQUUsSUFBSTtnQkFDbkIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLEVBQUU7Z0JBQ3hFLE9BQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsWUFBWSxFQUFFO2FBQ3RFO1lBQ0QsVUFBVSxFQUFFLEtBQUs7U0FDcEIsQ0FBQztRQUVGLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLG1DQUFlLEVBQUUsT0FBTyxDQUFDO2FBQ2pELElBQUksQ0FBQyxVQUFDLFVBQWdCO1lBQ25CLElBQUksVUFBVSxFQUFFO2dCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLFVBQVUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxXQUFXLEVBQUU7b0JBQzFDLEtBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDbEU7YUFDSjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELGlFQUFnQixHQUFoQjtRQUNJLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQzVCLENBQUM7SUFDRCwrREFBYyxHQUFkO1FBQ0ksSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDM0IsQ0FBQztJQUNELGtFQUFpQixHQUFqQjtRQUNJLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCwrREFBYyxHQUFkO1FBQ0ksSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7UUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNELDhEQUFhLEdBQWI7UUFDSSxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUMxQixDQUFDO0lBQ0QsbUVBQWtCLEdBQWxCO1FBQ0ksSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNELHVFQUFzQixHQUF0QjtRQUNJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUM3QyxRQUFRLEVBQUUsSUFBSTtZQUNkLFVBQVUsRUFBRTtnQkFDUixJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUUsR0FBRztnQkFDYixLQUFLLEVBQUUsUUFBUTthQUNsQjtTQUNKLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFDRCxxREFBSSxHQUFKO1FBQUEsaUJBNElDO1FBM0lHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSztZQUMvQyxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksS0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLEtBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO2dCQUM1SCw0QkFBNEI7Z0JBQzVCLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxJQUFJLGdDQUF3QixDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7Z0JBQ3JFLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxLQUFJLENBQUMsbUJBQW1CLElBQUksRUFBRSxFQUFFO29CQUNoQyxpRkFBaUY7b0JBQ2pGLEtBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztvQkFDdkMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO29CQUN4QyxJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDakMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztvQkFDOUMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO3dCQUNkLEtBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDekYsS0FBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEdBQUcsS0FBSSxDQUFDLG1CQUFtQixDQUFDO3FCQUNqRTt5QkFBTTt3QkFDSCxJQUFJLFNBQVMsR0FBa0IsRUFBRSxDQUFBO3dCQUNqQyxTQUFTLEdBQUcsS0FBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO3dCQUNoRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQy9DLEtBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNyRCxLQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3JEO29CQUNELEtBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxHQUFHLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQztvQkFDNUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDaEUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2lCQUNoRDtnQkFBQyxJQUFJLEtBQUksQ0FBQyxtQkFBbUIsSUFBSSxFQUFFLEVBQUU7b0JBQ2xDLEtBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztvQkFDdkMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO29CQUN4QyxJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDakMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztvQkFDOUMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO3dCQUNkLEtBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDekYsS0FBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEdBQUcsS0FBSSxDQUFDLG1CQUFtQixDQUFDO3FCQUNqRTt5QkFBTTt3QkFDSCxJQUFJLFNBQVMsR0FBa0IsRUFBRSxDQUFBO3dCQUNqQyxTQUFTLEdBQUcsS0FBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO3dCQUNoRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQy9DLEtBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNyRCxLQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3JEO29CQUNELEtBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxHQUFHLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQztvQkFDNUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2lCQUNoRDtnQkFBQyxJQUFJLEtBQUksQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLEVBQUU7b0JBQ2hDLEtBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztvQkFDbkMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO29CQUN0QyxJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDakMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztvQkFDNUMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO3dCQUNkLEtBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDdkYsS0FBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDO3FCQUM3RDt5QkFBTTt3QkFDSCxJQUFJLFNBQVMsR0FBa0IsRUFBRSxDQUFBO3dCQUNqQyxTQUFTLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO3dCQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQy9DLEtBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNuRCxLQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ25EO29CQUNELEtBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUM7b0JBQ3hELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDM0MscURBQXFEO2lCQUN4RDtnQkFBQyxJQUFJLEtBQUksQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLEVBQUU7b0JBQ2hDLEtBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztvQkFDbkMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO29CQUN0QyxJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDakMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztvQkFDNUMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO3dCQUNkLEtBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDdkYsS0FBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDO3FCQUM3RDt5QkFBTTt3QkFDSCxJQUFJLFNBQVMsR0FBa0IsRUFBRSxDQUFBO3dCQUNqQyxTQUFTLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO3dCQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQy9DLEtBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNuRCxLQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ25EO29CQUNELEtBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUM7b0JBQ3hELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDOUM7Z0JBQ0QsS0FBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztnQkFDbEQsSUFBSSxLQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixJQUFJLEVBQUUsRUFBRTtvQkFDeEMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUM7aUJBQy9EO2dCQUNELElBQUksS0FBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLElBQUksRUFBRSxFQUFFO29CQUNuQyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO2lCQUNyRDtnQkFDRCxJQUFJLEtBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLElBQUksRUFBRSxFQUFFO29CQUNyQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDekQ7Z0JBQ0QsSUFBSSxLQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxFQUFFLEVBQUU7b0JBQ2xDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7aUJBQ25EO2dCQUNELElBQUksS0FBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLElBQUksRUFBRSxFQUFFO29CQUNqQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO2lCQUNqRDtnQkFDRCxJQUFJLEtBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxJQUFJLEVBQUUsRUFBRTtvQkFDakMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztpQkFDakQ7Z0JBQ0QsSUFBSSxLQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxFQUFFLEVBQUU7b0JBQ2hDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7aUJBQy9DO2dCQUNELElBQUksS0FBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLEVBQUU7b0JBQ3RDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDO2lCQUMzRDtnQkFDRCxJQUFJLEtBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxJQUFJLEVBQUUsRUFBRTtvQkFDakMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztpQkFDakQ7YUFDSjtZQUNELElBQUksS0FBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLEVBQUU7Z0JBQ3hDLEtBQUksQ0FBQyx5QkFBeUIsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsUUFBUTtvQkFFckQsS0FBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxLQUFLO3dCQUMxQyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFOzRCQUN0SCxPQUFPLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDOzRCQUNqQyxPQUFPLENBQUMsYUFBYSxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDOzRCQUNuRCxPQUFPLENBQUMsZ0JBQWdCLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQzs0QkFDekQsT0FBTyxDQUFDLFlBQVksR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQzs0QkFDakQsT0FBTyxDQUFDLGlCQUFpQixHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUM7NEJBQzNELE9BQU8sQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7NEJBQy9DLE9BQU8sQ0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7NEJBQ2pELE9BQU8sQ0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7eUJBQ3BEO29CQUNMLENBQUMsQ0FBQyxDQUFBO2dCQUNOLENBQUMsQ0FBQyxDQUFBO2FBQ0w7WUFDRCw0REFBNEQ7WUFDNUQsSUFBSSxLQUFJLENBQUMsT0FBTyxDQUFDLHdCQUF3QixJQUFJLElBQUksRUFBRTtnQkFDL0MsS0FBSSxDQUFDLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxRQUFRO29CQUNyRCxLQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLEtBQUs7d0JBQzFDLElBQUksT0FBTyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7NEJBQ3RILE9BQU8sQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUM7NEJBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7NEJBQ3hELE9BQU8sQ0FBQyxjQUFjLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7eUJBQ3hEO29CQUNMLENBQUMsQ0FBQyxDQUFBO2dCQUNOLENBQUMsQ0FBQyxDQUFBO2FBQ0w7UUFFTCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFDRCxxRUFBb0IsR0FBcEI7UUFDSSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUNELHFFQUFvQixHQUFwQjtRQUNJLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsbUVBQWtCLEdBQWxCO1FBQ0ksSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBQyxDQUFDLENBQUMsQ0FBQTtJQUMzQyxDQUFDO0lBQ0QsbUVBQWtCLEdBQWxCO1FBQ0ksSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBQ0QsNkRBQVksR0FBWjtRQUNJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBQ0Qsa0VBQWlCLEdBQWpCO1FBQ0ksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3hDLFFBQVEsRUFBRSxJQUFJO1lBQ2QsVUFBVSxFQUFFO2dCQUNSLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLEtBQUssRUFBRSxRQUFRO2FBQ2xCO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNELGlFQUFnQixHQUFoQjtRQUNJLElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksRUFBRTtZQUNoQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ3ZDLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFVBQVUsRUFBRTtvQkFDUixJQUFJLEVBQUUsT0FBTztvQkFDYixRQUFRLEVBQUUsR0FBRztvQkFDYixLQUFLLEVBQUUsUUFBUTtpQkFDbEI7YUFDSixDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7SUFDRCxxRUFBb0IsR0FBcEI7UUFDSSxJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxFQUFFO1lBQzdCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDM0MsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsVUFBVSxFQUFFO29CQUNSLElBQUksRUFBRSxPQUFPO29CQUNiLFFBQVEsRUFBRSxHQUFHO29CQUNiLEtBQUssRUFBRSxRQUFRO2lCQUNsQjthQUNKLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQUVELG1FQUFrQixHQUFsQixVQUFtQixLQUFVO1FBQTdCLGlCQXVCQztRQXRCRyxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEMsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDN0MsSUFBSSxPQUFPLEdBQUc7Z0JBQ1YsS0FBSyxFQUFFLGtCQUFrQjtnQkFDekIsT0FBTyxFQUFFLGdDQUFnQztnQkFDekMsWUFBWSxFQUFFLElBQUk7YUFDckIsQ0FBQztZQUNGLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUN4QixLQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7b0JBQ2pDLFFBQVEsRUFBRSxJQUFJO29CQUNkLFVBQVUsRUFBRTt3QkFDUixJQUFJLEVBQUUsT0FBTzt3QkFDYixRQUFRLEVBQUUsR0FBRzt3QkFDYixLQUFLLEVBQUUsUUFBUTtxQkFDbEI7aUJBQ0osQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7WUFDSCxvQ0FBb0M7U0FDdkM7YUFDSTtZQUNELEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDdkM7SUFDTCxDQUFDOztJQWh4Q2EsZ0VBQXlCLEdBQVcsc0JBQXNCLENBQUM7SUFDM0QsaUVBQTBCLEdBQVcsaUJBQWlCLENBQUM7SUFDdkQsZ0VBQXlCLEdBQVcsc0JBQXNCLENBQUM7SUFDM0QsaUVBQTBCLEdBQVcsZUFBZSxDQUFDO0lBQ3JELDBEQUFtQixHQUFXLGNBQWMsQ0FBQztJQUM3Qyx1REFBZ0IsR0FBVyxVQUFVLENBQUM7SUFDdEMsb0RBQWEsR0FBVyxPQUFPLENBQUM7SUFDaEMsbURBQVksR0FBVyxNQUFNLENBQUM7SUFDOUIsd0RBQWlCLEdBQVcsZ0JBQWdCLENBQUM7SUFDN0MseURBQWtCLEdBQVcscURBQXFELENBQUM7SUFDbkYsc0RBQWUsR0FBVywrQ0FBK0MsQ0FBQztJQUMxRSxzREFBZSxHQUFXLDZDQUE2QyxDQUFDO0lBQ3hFLDhEQUF1QixHQUFXLDRDQUE0QyxDQUFDO0lBQy9FLDhEQUF1QixHQUFXLDBDQUEwQyxDQUFDO0lBdkkvRDtRQUEzQixnQkFBUyxDQUFDLGVBQWUsQ0FBQztrQ0FBVyxpQkFBVTs0RUFBQztJQUMzQjtRQUFyQixnQkFBUyxDQUFDLFNBQVMsQ0FBQztrQ0FBVSxpQkFBVTsyRUFBQztJQUNwQjtRQUFyQixnQkFBUyxDQUFDLFNBQVMsQ0FBQztrQ0FBVSxpQkFBVTsyRUFBQztJQUNqQjtRQUF4QixnQkFBUyxDQUFDLFlBQVksQ0FBQztrQ0FBYSxpQkFBVTs4RUFBQztJQUN0QjtRQUF6QixnQkFBUyxDQUFDLGFBQWEsQ0FBQztrQ0FBYyxpQkFBVTsrRUFBQztJQUN6QjtRQUF4QixnQkFBUyxDQUFDLFlBQVksQ0FBQztrQ0FBYSxpQkFBVTs4RUFBQztJQUN0QjtRQUF6QixnQkFBUyxDQUFDLGFBQWEsQ0FBQztrQ0FBYyxpQkFBVTsrRUFBQztJQUNoQjtRQUFqQyxnQkFBUyxDQUFDLHFCQUFxQixDQUFDO2tDQUFzQixpQkFBVTt1RkFBQztJQUM5QjtRQUFuQyxnQkFBUyxDQUFDLHVCQUF1QixDQUFDO2tDQUF3QixpQkFBVTt5RkFBQztJQUNwQztRQUFqQyxnQkFBUyxDQUFDLHFCQUFxQixDQUFDO2tDQUFzQixpQkFBVTt1RkFBQztJQUN2QztRQUExQixnQkFBUyxDQUFDLGNBQWMsQ0FBQztrQ0FBZSxpQkFBVTtnRkFBQztJQUMzQjtRQUF4QixnQkFBUyxDQUFDLFlBQVksQ0FBQztrQ0FBYSxpQkFBVTs4RUFBQztJQUN6QjtRQUF0QixnQkFBUyxDQUFDLFVBQVUsQ0FBQztrQ0FBVyxpQkFBVTs0RUFBQztJQUNsQjtRQUF6QixnQkFBUyxDQUFDLGFBQWEsQ0FBQztrQ0FBYyxpQkFBVTsrRUFBQztJQUMzQjtRQUF0QixnQkFBUyxDQUFDLFVBQVUsQ0FBQztrQ0FBVyxpQkFBVTs0RUFBQztJQUN0QjtRQUFyQixnQkFBUyxDQUFDLFNBQVMsQ0FBQztrQ0FBVSxpQkFBVTsyRUFBQztJQUNmO1FBQTFCLGdCQUFTLENBQUMsY0FBYyxDQUFDO2tDQUFlLGlCQUFVO2dGQUFDO0lBakIzQyxzQ0FBc0M7UUFSbEQsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxvQ0FBb0M7WUFDOUMsU0FBUyxFQUFFLENBQUMsbUJBQVcsRUFBRSx3QkFBZ0IsRUFBRSw2QkFBYSxDQUFDO1lBQ3pELFdBQVcsRUFBRSx5RkFBeUY7WUFDdEcsU0FBUyxFQUFFLENBQUMsd0ZBQXdGLENBQUM7U0FFeEcsQ0FBQzt5Q0E0SXNDLDZCQUFhLEVBQXFCLHdCQUFnQixFQUEyQix1QkFBYyxFQUF5QixpQ0FBa0IsRUFBbUIsMkJBQW1CLEVBQWlCLHVCQUFnQixFQUFnQixXQUFJLEVBQTRCLHlCQUFnQixFQUEwQixzQkFBYyxFQUFrQixlQUFNLEVBQXVCLG1CQUFXLEVBQW1CLHdCQUFnQixFQUFpQix1QkFBYztPQTFJNWMsc0NBQXNDLENBNDRDbEQ7SUFBRCw2Q0FBQztDQUFBLEFBNTRDRCxJQTQ0Q0M7QUE1NENZLHdGQUFzQyIsInNvdXJjZXNDb250ZW50IjpbIi8vYW5ndWxhciAmIG5hdGl2ZXNjcmlwdCByZWZlcmVuY2VzXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvbkV4dHJhcywgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlQXJyYXkgfSBmcm9tIFwiZGF0YS9vYnNlcnZhYmxlLWFycmF5XCI7XG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgeyBHZXN0dXJlRXZlbnREYXRhIH0gZnJvbSBcInVpL2dlc3R1cmVzXCI7XG5pbXBvcnQgeyBMaXN0VmlldywgSXRlbUV2ZW50RGF0YSB9IGZyb20gXCJ1aS9saXN0LXZpZXdcIjtcbmltcG9ydCB7IFN0YWNrTGF5b3V0IH0gZnJvbSBcInVpL2xheW91dHMvc3RhY2stbGF5b3V0XCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbmF0aXZlc2NyaXB0Lm1vZHVsZVwiO1xuaW1wb3J0ICogYXMgZGlhbG9ncyBmcm9tIFwidWkvZGlhbG9nc1wiO1xuaW1wb3J0ICogYXMgZ2VzdHVyZXMgZnJvbSBcInVpL2dlc3R1cmVzXCI7XG5pbXBvcnQgeyBTZWdtZW50ZWRCYXIsIFNlZ21lbnRlZEJhckl0ZW0gfSBmcm9tIFwidWkvc2VnbWVudGVkLWJhclwiO1xuaW1wb3J0IHsgTW9kYWxEaWFsb2dTZXJ2aWNlLCBNb2RhbERpYWxvZ09wdGlvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nXCI7XG5pbXBvcnQgeyBEYXRlUGlja2VyTW9kYWwsIERhdGVQaWNrZXRDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXItbW9kYWxcIjtcblxuXG4vL2V4dGVybmFsIG1vZHVsZXMgYW5kIHBsdWdpbnNcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcblxuLy9hcHAgcmVmZXJlbmNlc1xuaW1wb3J0IHsgTG9hZGVyUHJvZ3Jlc3MsIG9yZGVyLCBQYXNzZW5nZXJMaXN0VGVtcGxhdGUsIERlcGFydHVyZVBheExpc3QsIFBhc3Nlbmdlckxpc3QsIERlcGFydHVyZUluZm8xLCBJbkJvdW5kLCBPdXRCb3VuZCwgQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9pbnRlcmZhY2UvaW5kZXhcIlxuaW1wb3J0IHsgUGFzc2VuZ2VyLCBPcmRlciwgSW52ZW50b3J5LCBDb3VudHJ5Q29sbGVjdGlvbiwgQlJFQ29tcGVuc2F0aW9uIH0gZnJvbSAnLi4vLi4vc2hhcmVkL21vZGVsL2luZGV4JztcbmltcG9ydCB7IERhdGFTZXJ2aWNlLCBDaGVja2luT3JkZXJTZXJ2aWNlLCBQYXNzZW5nZXJTZXJ2aWNlLCBUaW1lT3V0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvaW5kZXhcIjtcbmltcG9ydCB7IENvbnZlcnRlcnMgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3V0aWxzL2luZGV4XCI7XG5pbXBvcnQgeyBBcHBFeGVjdXRpb250aW1lIH0gZnJvbSBcIi4uLy4uL2FwcC5leGVjdXRpb250aW1lXCI7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vLi4vYXBwLmNvbnN0YW50cyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcImNvbXBlbnNhdGlvbmFkZGl0aW9uYWxkZXRhaWxzLXBhZ2VcIixcbiAgICBwcm92aWRlcnM6IFtEYXRhU2VydmljZSwgUGFzc2VuZ2VyU2VydmljZSwgQ29uZmlndXJhdGlvbl0sXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9jb21wb25lbnRzL2NvbXBlbnNhdGlvbmFkZGl0aW9uYWxkZXRhaWxzL2NvbXBlbnNhdGlvbmFkZGl0aW9uYWxkZXRhaWxzLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL2NvbXBvbmVudHMvY29tcGVuc2F0aW9uYWRkaXRpb25hbGRldGFpbHMvY29tcGVuc2F0aW9uYWRkaXRpb25hbGRldGFpbHMuY29tcG9uZW50LmNzc1wiXVxuXG59KVxuXG5leHBvcnQgY2xhc3MgQ29tcGVuc2F0aW9uQWRkaXRpb25hbERldGFpbHNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIEBWaWV3Q2hpbGQoJ3BhZ2Vjb250YWluZXInKSBwYWdlQ29udDogRWxlbWVudFJlZjtcbiAgICBAVmlld0NoaWxkKCdzZWdiYXIxJykgc2VnYmFyMTogRWxlbWVudFJlZjtcbiAgICBAVmlld0NoaWxkKCdzZWdiYXIyJykgc2VnYmFyMjogRWxlbWVudFJlZjtcbiAgICBAVmlld0NoaWxkKCdmaXJzdExheWVyJykgZmlyc3RMYXllcjogRWxlbWVudFJlZjtcbiAgICBAVmlld0NoaWxkKCdzZWNvbmRMYXllcicpIHNlY29uZExheWVyOiBFbGVtZW50UmVmO1xuICAgIEBWaWV3Q2hpbGQoJ3RoaXJkTGF5ZXInKSB0aGlyZExheWVyOiBFbGVtZW50UmVmO1xuICAgIEBWaWV3Q2hpbGQoJ2ZvdXJ0aExheWVyJykgZm91cnRoTGF5ZXI6IEVsZW1lbnRSZWY7XG4gICAgQFZpZXdDaGlsZCgnY29tcGVuc2F0aW9uaGlzdG9yeScpIGNvbXBlbnNhdGlvbmhpc3Rvcnk6IEVsZW1lbnRSZWY7XG4gICAgQFZpZXdDaGlsZCgncmVhY2NvbW9kYXRpb25kZXRhaWxzJykgcmVhY2NvbW9kYXRpb25kZXRhaWxzOiBFbGVtZW50UmVmO1xuICAgIEBWaWV3Q2hpbGQoJ2NvbXBlbnNhdGlvbmRldGFpbHMnKSBjb21wZW5zYXRpb25kZXRhaWxzOiBFbGVtZW50UmVmO1xuICAgIEBWaWV3Q2hpbGQoJ290aGVyZGV0YWlscycpIG90aGVyZGV0YWlsczogRWxlbWVudFJlZjtcbiAgICBAVmlld0NoaWxkKCdmcm9tZmxpZ2h0JykgZnJvbWZsaWdodDogRWxlbWVudFJlZjtcbiAgICBAVmlld0NoaWxkKCd0b2ZsaWdodCcpIHRvZmxpZ2h0OiBFbGVtZW50UmVmO1xuICAgIEBWaWV3Q2hpbGQoJ21vbmV0b3J5ZW1kJykgbW9uZXRvcnllbWQ6IEVsZW1lbnRSZWY7XG4gICAgQFZpZXdDaGlsZCgnaG90ZWxlbWQnKSBob3RlbGVtZDogRWxlbWVudFJlZjtcbiAgICBAVmlld0NoaWxkKCdtZWFsZW1kJykgbWVhbGVtZDogRWxlbWVudFJlZjtcbiAgICBAVmlld0NoaWxkKCd0cmFuc3BvcnRlbWQnKSB0cmFuc3BvcnRlbWQ6IEVsZW1lbnRSZWY7XG4gICAgcHVibGljIGlzRXJyb3I6IGJvb2xlYW47XG4gICAgcHVibGljIGVycm9yTWVzc2FnZTogc3RyaW5nO1xuICAgIHB1YmxpYyBsb2FkZXJQcm9ncmVzczogTG9hZGVyUHJvZ3Jlc3M7XG4gICAgcHVibGljIHN0YXJ0RGF0ZTogRGF0ZTtcbiAgICBwdWJsaWMgQ3VyRGF0ZTogc3RyaW5nO1xuICAgIHB1YmxpYyB1c2VyZGV0YWlsczogYW55O1xuICAgIHB1YmxpYyBQYXNzZW5nZXJUeXBlOiBhbnk7XG4gICAgcHVibGljIEZpcnN0TGF5ZXI6IHN0cmluZztcbiAgICBwdWJsaWMgU2Vjb25kTGF5ZXI6IHN0cmluZztcbiAgICBwdWJsaWMgVGhpcmRMYXllcjogc3RyaW5nO1xuICAgIHB1YmxpYyBGaXJzdEJsb2NrOiBib29sZWFuID0gdHJ1ZTtcbiAgICBwdWJsaWMgU2Vjb25kQmxvY2s6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgVGhpcmRCbG9jazogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBGb3VydGhCbG9jazogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBJc0Zyb21GbGlnaHQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgSXNUb0ZsaWdodDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBJc01vbmV0b3J5RW1kOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIElzSG90ZWxFbWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgSXNNZWFsRW1kOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGNvcHlUb1NlbGVjdFBheDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBjb3B5VG9TZWxlY3RQYXhSZWFjYzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBJc1RyYW5zcG9ydEVtZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBGbGlnaHRIZWFkZXJJbmZvOiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuRmxpZ2h0TW9kZWwgPSBuZXcgQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkZsaWdodE1vZGVsKCk7XG4gICAgcHVibGljIENvbXBlbnNhdGlvbkhpc3Rvcnk6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHB1YmxpYyBSZWFjY29tb2RhdGlvbkRldGFpbHM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uRGV0YWlsczogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBPdGhlckRldGFpbHM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgSXNzdWVDb21wZW5zYXRpb25SZXNwb25zZTogQlJFQ29tcGVuc2F0aW9uLkJSRVJlc3BvbnNlID0gbmV3IEJSRUNvbXBlbnNhdGlvbi5CUkVSZXNwb25zZSgpO1xuICAgIHB1YmxpYyBJc3N1ZUNvbXBlbnNhdGlvblBheExpc3Q6IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBzZWxlY3RlZFBhc3NlbmdlcjogQXJyYXk8Q29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q+ID0gW107XG4gICAgcHVibGljIGFwaXNkZXRhaWxzOiBBcnJheTxTZWdtZW50ZWRCYXJJdGVtPjtcbiAgICBwdWJsaWMgZmlyc3R0YWIgPSBuZXcgU2VnbWVudGVkQmFySXRlbSgpO1xuICAgIHB1YmxpYyBzZWNvbmR0YWIgPSBuZXcgU2VnbWVudGVkQmFySXRlbSgpO1xuICAgIHB1YmxpYyB0aHJpZHRhYiA9IG5ldyBTZWdtZW50ZWRCYXJJdGVtKCk7XG4gICAgcHVibGljIGZvdXJ0aHRhYiA9IG5ldyBTZWdtZW50ZWRCYXJJdGVtKCk7XG4gICAgcHVibGljIEVuZG9yc2VtZW50c3RyaW5nOiBhbnk7XG4gICAgcHVibGljIENvbXBlbnNhdGlvblJlYXNvbjogYW55O1xuICAgIHB1YmxpYyBGcm9tT25lQ2hhbmdlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBGcm9tVHdvQ2hhbmdlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBUb09uZUNoYW5nZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgVG9Ud29DaGFuZ2VkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIFBhc3Nlbmdlck5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgUGF4SXRlbTogQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q7XG4gICAgcHVibGljIFByZXZpb3VzUGFnZTogc3RyaW5nO1xuICAgIHB1YmxpYyBNb25ldGFyeVRleHQ6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICBwdWJsaWMgSG90ZWxUZXh0OiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgcHVibGljIE1lYWxUZXh0OiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgcHVibGljIFRyYW5zcG9ydFRleHQ6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICBwdWJsaWMgSXNWaXNpYmxlQWxsVGFiOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIFRhYk5vdFZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgRnJvbUZsaWdodE9uZUVycm9yOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIEZyb21EZXN0T25lRXJyb3I6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgRnJvbU9yaWdpbk9uZUVycm9yOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIEZyb21GbGlnaHRUd29FcnJvcjogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBGcm9tRGVzdFR3b0Vycm9yOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIEZyb21PcmlnaW5Ud29FcnJvcjogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBUb0ZsaWdodE9uZUVycm9yOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIFRvRGVzdE9uZUVycm9yOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIFRvT3JpZ2luT25lRXJyb3I6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgVG9GbGlnaHRUd29FcnJvcjogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBUb0Rlc3RUd29FcnJvcjogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBUb09yaWdpblR3b0Vycm9yOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIEN1cnJlbnRGbGlnaHRTdGF0dXM6IHN0cmluZztcbiAgICBwdWJsaWMgRnJvbUZsaWdodE9uZU51bWJlcjogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgRnJvbUZsaWdodE9uZURhdGU6IHN0cmluZztcbiAgICBwdWJsaWMgRnJvbUZsaWdodFR3b051bWJlcjogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgRnJvbUZsaWdodFR3b0RhdGU6IHN0cmluZztcbiAgICBwdWJsaWMgVG9GbGlnaHRPbmVOdW1iZXI6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFRvRmxpZ2h0T25lRGF0ZTogc3RyaW5nO1xuICAgIHB1YmxpYyBUb0ZsaWdodFR3b051bWJlcjogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgVG9GbGlnaHRUd29EYXRlOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgSXNIaXN0b3J5VmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBJc01vbmV0YXJ5SGlzdG9yeVZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgSXNIb3RlbEhpc3RvcnlWaXNpYmxlOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIElzTWVhbEhpc3RvcnlWaXNpYmxlOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIElzVHJhbnNwb3J0SGlzdG9yeVZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgaXNNZWFsRGV0YWlsVmFsaWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgaXNUcmFuc3BvcnRFTURWYWxpZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBJc0hlYWRlckluZm86IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgSXNTdWJtaXRFbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgICBwdWJsaWMgRW5kb3JzbWVudFRleHRNb25ldGFyeTogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgIHB1YmxpYyBFbmRvcnNtZW50VGV4dEhvdGVsOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgcHVibGljIEVuZG9yc21lbnRUZXh0TWVhbDogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgIHB1YmxpYyBFbmRvcnNtZW50VGV4dFRyYW5zcG9ydDogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgIHB1YmxpYyBJc0ZsaWdodEluZm86IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgSXNXb3JsZFRyYWNlVmFsaWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgSXNDdXN0b21lckNhcmVWYWxpZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBJc01vbmV0YXJ5VGV4dFZhbGlkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIElzSG90ZWxUZXh0VmFsaWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgSXNIb3RlbE5hbWVWYWxpZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBJc01lYWxUZXh0VmFsaWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgSXNUcmFuc3BvcnRUZXh0VmFsaWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgc2VsZWN0UGF4VmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBGcm9tRmxpZ2h0T25lOiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuUmVhY2NvbURldGFpbCA9IG5ldyBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuUmVhY2NvbURldGFpbCgpO1xuICAgIHB1YmxpYyBGcm9tRmxpZ2h0VHdvOiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuUmVhY2NvbURldGFpbCA9IG5ldyBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuUmVhY2NvbURldGFpbCgpO1xuICAgIHB1YmxpYyBUb0ZsaWdodE9uZTogQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLlJlYWNjb21EZXRhaWwgPSBuZXcgQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLlJlYWNjb21EZXRhaWwoKTtcbiAgICBwdWJsaWMgVG9GbGlnaHRUd286IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5SZWFjY29tRGV0YWlsID0gbmV3IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5SZWFjY29tRGV0YWlsKCk7XG4gICAgcHVibGljIE1vbmV0YXJ5Q29tcGVuc3Rpb246IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5FeGlzdGluZ0NvbXBlbnNhdGlvbj4gPSBbXTtcbiAgICBwdWJsaWMgTWVhbENvbXBlbnN0aW9uOiBBcnJheTxDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuRXhpc3RpbmdDb21wZW5zYXRpb24+ID0gW107XG4gICAgcHVibGljIEhvdGVsQ29tcGVuc3Rpb246IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5FeGlzdGluZ0NvbXBlbnNhdGlvbj4gPSBbXTtcbiAgICBwdWJsaWMgVHJhbnNwb3J0Q29tcGVuc3Rpb246IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5FeGlzdGluZ0NvbXBlbnNhdGlvbj4gPSBbXTtcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdDogQXJyYXk8Q29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q+ID0gW107XG4gICAgcHVibGljIGlzQ2hlY2tpbkRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzR2F0ZURpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIHN0YXRpYyBBRERJVElPTkFMREVUQUlMU0ZJUlNUVEFCOiBzdHJpbmcgPSBcIkNvbXBlbnNhdGlvbiBIaXN0b3J5XCI7XG4gICAgcHVibGljIHN0YXRpYyBBRERJVElPTkFMREVUQUlMU1NFQ09ORFRBQjogc3RyaW5nID0gXCJSZS1hY2NvbW9kYXRpb25cIjtcbiAgICBwdWJsaWMgc3RhdGljIEFERElUSU9OQUxERVRBSUxTVEhJUkRUQUI6IHN0cmluZyA9IFwiQ29tcGVuc2F0aW9uIERldGFpbHNcIjtcbiAgICBwdWJsaWMgc3RhdGljIEFERElUSU9OQUxERVRBSUxTRk9VUlRIVEFCOiBzdHJpbmcgPSBcIk90aGVyIERldGFpbHNcIjtcbiAgICBwdWJsaWMgc3RhdGljIFBSRVZJT1VTU0NSRUVOQ0hFQ0s6IHN0cmluZyA9IFwiU2VhcmNoUmVzdWx0XCI7XG4gICAgcHVibGljIHN0YXRpYyBDT01QVFlQRU1PTkVUQVJZOiBzdHJpbmcgPSBcIk1vbmV0YXJ5XCI7XG4gICAgcHVibGljIHN0YXRpYyBDT01QVFlQRUhPVEVMOiBzdHJpbmcgPSBcIkhvdGVsXCI7XG4gICAgcHVibGljIHN0YXRpYyBDT01QVFlQRU1FQUw6IHN0cmluZyA9IFwiTWVhbFwiO1xuICAgIHB1YmxpYyBzdGF0aWMgQ09NUFRZUEVUUkFOU1BPUlQ6IHN0cmluZyA9IFwiVHJhbnNwb3J0YXRpb25cIjtcbiAgICBwdWJsaWMgc3RhdGljIElOVkFMSURBSVJMSU5FQ09ERTogc3RyaW5nID0gXCJJbnZhbGlkIGlucHV0LiBFbnRlciBhaXJsaW5lIGNvZGUgYW5kIGZsaWdodCBudW1iZXJcIjtcbiAgICBwdWJsaWMgc3RhdGljIElOVkFMSURERVBBQ09ERTogc3RyaW5nID0gXCJJbnZhbGlkIGlucHV0LiBFbnRlciBkZXBhcnR1cmUgc3RhdGlvbiBjb2RlLiBcIjtcbiAgICBwdWJsaWMgc3RhdGljIElOVkFMSURBUlJJQ09ERTogc3RyaW5nID0gXCJJbnZhbGlkIGlucHV0LiBFbnRlciBhcnJpdmFsIHN0YXRpb24gY29kZS4gXCI7XG4gICAgcHVibGljIHN0YXRpYyBJTlZBTElEQ1VTVE9NRVJDQVJFQ09ERTogc3RyaW5nID0gXCJJbnZhbGlkIGlucHV0LiBFbnRlciBjdXN0b21lciBjYXJlIG51bWJlci5cIjtcbiAgICBwdWJsaWMgc3RhdGljIElOVkFMSURXT1JMRFRSQUNFTlVNQkVSOiBzdHJpbmcgPSBcIkludmFsaWQgaW5wdXQuIEVudGVyIHdvcmxkIHRyYWNlIG51bWJlci5cIjtcbiAgICBwdWJsaWMgaXNMYWJlbEZpZWxkOiBib29sZWFuID0gZmFsc2U7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbiwgcHJpdmF0ZSBfc2VydmljZXM6IFBhc3NlbmdlclNlcnZpY2UsIHByaXZhdGUgYWN0aXZhdGVkUm91dGVyOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSBfbW9kYWxTZXJ2aWNlOiBNb2RhbERpYWxvZ1NlcnZpY2UsIHByaXZhdGUgX3NoYXJlZDogQ2hlY2tpbk9yZGVyU2VydmljZSwgcHJpdmF0ZSB2Y1JlZjogVmlld0NvbnRhaW5lclJlZiwgcHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMsIHB1YmxpYyBfdGltZW91dFNlcnZpY2U6IFRpbWVPdXRTZXJ2aWNlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwdWJsaWMgX2RhdGFTZXJ2aWNlOiBEYXRhU2VydmljZSwgcHVibGljIF9zZXJ2aWNlOiBQYXNzZW5nZXJTZXJ2aWNlLCBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSkge1xuICAgICAgICB0aGlzLmlzRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAvLyB0aGlzLkN1ckRhdGUgPSBtb21lbnQoKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHRoaXMuQ3VyRGF0ZSA9IG1vbWVudCh0aGlzLnN0YXJ0RGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgICAgLy8gdGhpcy5Gcm9tRmxpZ2h0T25lRGF0ZSA9IG1vbWVudCh0aGlzLnN0YXJ0RGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgICAgLy8gdGhpcy5Gcm9tRmxpZ2h0VHdvRGF0ZSA9IG1vbWVudCh0aGlzLnN0YXJ0RGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgICAgLy8gdGhpcy5Ub0ZsaWdodE9uZURhdGUgPSBtb21lbnQodGhpcy5zdGFydERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICAgIC8vIHRoaXMuVG9GbGlnaHRUd29EYXRlID0gbW9tZW50KHRoaXMuc3RhcnREYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzID0gbmV3IExvYWRlclByb2dyZXNzKCk7XG4gICAgICAgIC8vIHRoaXMuYXBpc2RldGFpbHMgPSBbXTtcblxuICAgICAgICAvLyB0aGlzLmZpcnN0dGFiLnRpdGxlID0gQ29tcGVuc2F0aW9uQWRkaXRpb25hbERldGFpbHNDb21wb25lbnQuQURESVRJT05BTERFVEFJTFNGSVJTVFRBQjtcbiAgICAgICAgLy8gdGhpcy5hcGlzZGV0YWlscy5wdXNoKHRoaXMuZmlyc3R0YWIpO1xuXG4gICAgICAgIC8vIHRoaXMuc2Vjb25kdGFiLnRpdGxlID0gQ29tcGVuc2F0aW9uQWRkaXRpb25hbERldGFpbHNDb21wb25lbnQuQURESVRJT05BTERFVEFJTFNTRUNPTkRUQUI7XG4gICAgICAgIC8vIHRoaXMuYXBpc2RldGFpbHMucHVzaCh0aGlzLnNlY29uZHRhYik7XG5cbiAgICAgICAgLy8gdGhpcy50aHJpZHRhYi50aXRsZSA9IENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LkFERElUSU9OQUxERVRBSUxTVEhJUkRUQUI7XG4gICAgICAgIC8vIHRoaXMuYXBpc2RldGFpbHMucHVzaCh0aGlzLnRocmlkdGFiKTtcblxuICAgICAgICAvLyB0aGlzLmZvdXJ0aHRhYi50aXRsZSA9IENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LkFERElUSU9OQUxERVRBSUxTRk9VUlRIVEFCO1xuICAgICAgICAvLyB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5mb3VydGh0YWIpO1xuICAgIH1cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCd+L2ltYWdlcy9sb2dpbl9iYWNrLmpwZWcnKVwiO1xuICAgICAgICB0aGlzLnBhZ2Uuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBcImNvdmVyIFwiO1xuICAgICAgICB0aGlzLnVzZXJkZXRhaWxzID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VyZGV0YWlsc1wiLCBcIlwiKTtcbiAgICAgICAgdGhpcy5GbGlnaHRIZWFkZXJJbmZvID0gdGhpcy5fc2hhcmVkLmdldEZsaWdodEhlYWRlckluZm8oKTtcbiAgICAgICAgdGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNoZWNraW5EaXNhYmxlZFwiKTtcbiAgICAgICAgdGhpcy5pc0dhdGVEaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImdhdGVEaXNhYmxlZFwiKTtcbiAgICAgICAgdGhpcy5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0ID0gdGhpcy5fc2hhcmVkLmdldENvbXBlbnNhdGlvblBheExpc3QoKTtcbiAgICAgICAgaWYgKHRoaXMuRmxpZ2h0SGVhZGVySW5mbyA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLklzSGVhZGVySW5mbyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLklzRmxpZ2h0SW5mbyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5Jc0hlYWRlckluZm8gPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuSXNGbGlnaHRJbmZvID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuQ3VycmVudEZsaWdodFN0YXR1cyA9IHRoaXMuRmxpZ2h0SGVhZGVySW5mby5GbGlnaHROdW1iZXIgKyBcIiBcIiArIHRoaXMuRmxpZ2h0SGVhZGVySW5mby5EZXBhcnR1cmVBaXJwb3J0ICsgXCIgPiBcIiArIHRoaXMuRmxpZ2h0SGVhZGVySW5mby5EZXN0aW5hdGlvbkFpcnBvcnQ7XG5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFjdGl2YXRlZFJvdXRlci5xdWVyeVBhcmFtcy5zdWJzY3JpYmUoKHBhcmFtcykgPT4ge1xuICAgICAgICAgICAgdGhpcy5QYXhJdGVtID0gSlNPTi5wYXJzZShwYXJhbXNbXCJkYXRhXCJdKTtcbiAgICAgICAgICAgIHRoaXMuUHJldmlvdXNQYWdlID0gcGFyYW1zW1wicHJlcGFnZVwiXTtcbiAgICAgICAgICAgIHRoaXMuUGFzc2VuZ2VyTmFtZSA9IHRoaXMuUGF4SXRlbS5GdWxsTmFtZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5QcmV2aW91c1BhZ2UpKTtcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5hY3RpdmF0ZWRSb3V0ZXIucXVlcnlQYXJhbXMuc3Vic2NyaWJlKChwYXJhbXMpID0+IHtcbiAgICAgICAgICAgIGlmIChwYXJhbXNbXCJzZWxlY3RlZFBBeFwiXSAhPSBudWxsICYmXG4gICAgICAgICAgICAgICAgcGFyYW1zW1wic2VsZWN0ZWRQQXhcIl0gIT0gXCJcIiAmJlxuICAgICAgICAgICAgICAgIHBhcmFtc1tcInNlbGVjdGVkUEF4XCJdICE9IFwidW5kZWZpbmVkXCIpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRQYXNzZW5nZXIgPSBKU09OLnBhcnNlKHBhcmFtc1tcInNlbGVjdGVkUEF4XCJdKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRpcih0aGlzLnNlbGVjdGVkUGFzc2VuZ2VyWzBdLlJlYWNjb21EZXRhaWxzKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZjb3VudDpcIiArIHRoaXMuc2VsZWN0ZWRQYXNzZW5nZXIubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgY29uc29sZS5sb2coXCJWYXI6XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLlBheEl0ZW0pKTtcbiAgICAgICAgaWYgKHRoaXMuUHJldmlvdXNQYWdlID09IFwiU2VhcmNoUmVzdWx0XCIpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ29uZCAxXCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLlByZXZpb3VzUGFnZSkpO1xuICAgICAgICAgICAgdGhpcy5Jc1Zpc2libGVBbGxUYWIgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5jb3B5VG9TZWxlY3RQYXhSZWFjYyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzID0gW107XG4gICAgICAgICAgICB0aGlzLmZpcnN0dGFiLnRpdGxlID0gQ29tcGVuc2F0aW9uQWRkaXRpb25hbERldGFpbHNDb21wb25lbnQuQURESVRJT05BTERFVEFJTFNGSVJTVFRBQjtcbiAgICAgICAgICAgIHRoaXMuYXBpc2RldGFpbHMucHVzaCh0aGlzLmZpcnN0dGFiKTtcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kdGFiLnRpdGxlID0gQ29tcGVuc2F0aW9uQWRkaXRpb25hbERldGFpbHNDb21wb25lbnQuQURESVRJT05BTERFVEFJTFNTRUNPTkRUQUI7XG4gICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5zZWNvbmR0YWIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuUHJldmlvdXNQYWdlID09IFwiQ29tcGVuc2F0aW9uTGlzdFwiKSB7XG4gICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzID0gW107XG4gICAgICAgICAgICB0aGlzLmZpcnN0dGFiLnRpdGxlID0gQ29tcGVuc2F0aW9uQWRkaXRpb25hbERldGFpbHNDb21wb25lbnQuQURESVRJT05BTERFVEFJTFNGSVJTVFRBQjtcbiAgICAgICAgICAgIHRoaXMuYXBpc2RldGFpbHMucHVzaCh0aGlzLmZpcnN0dGFiKTtcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kdGFiLnRpdGxlID0gQ29tcGVuc2F0aW9uQWRkaXRpb25hbERldGFpbHNDb21wb25lbnQuQURESVRJT05BTERFVEFJTFNTRUNPTkRUQUI7XG4gICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5zZWNvbmR0YWIpO1xuICAgICAgICAgICAgdGhpcy50aHJpZHRhYi50aXRsZSA9IENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LkFERElUSU9OQUxERVRBSUxTVEhJUkRUQUI7XG4gICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy50aHJpZHRhYik7XG4gICAgICAgICAgICB0aGlzLmZvdXJ0aHRhYi50aXRsZSA9IENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LkFERElUSU9OQUxERVRBSUxTRk9VUlRIVEFCO1xuICAgICAgICAgICAgdGhpcy5hcGlzZGV0YWlscy5wdXNoKHRoaXMuZm91cnRodGFiKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuUGF4SXRlbS5Jc0NvbXBlbnNhdGlvbklzc3VlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbiBoZXJlIDFcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0xhYmVsRmllbGQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuSXNWaXNpYmxlQWxsVGFiID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3B5VG9TZWxlY3RQYXggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcHlUb1NlbGVjdFBheFJlYWNjID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW4gaGVyZSAxMlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzTGFiZWxGaWVsZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuSXNWaXNpYmxlQWxsVGFiID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcHlUb1NlbGVjdFBheFJlYWNjID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5maXJzdHRhYi50aXRsZSA9IENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LkFERElUSU9OQUxERVRBSUxTRklSU1RUQUI7XG4gICAgICAgICAgICAgICAgdGhpcy5hcGlzZGV0YWlscy5wdXNoKHRoaXMuZmlyc3R0YWIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2Vjb25kdGFiLnRpdGxlID0gQ29tcGVuc2F0aW9uQWRkaXRpb25hbERldGFpbHNDb21wb25lbnQuQURESVRJT05BTERFVEFJTFNTRUNPTkRUQUI7XG4gICAgICAgICAgICAgICAgdGhpcy5hcGlzZGV0YWlscy5wdXNoKHRoaXMuc2Vjb25kdGFiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLlByZXZpb3VzUGFnZSA9PSBcIkJSRVBhZ2VcIikge1xuICAgICAgICAgICAgdGhpcy5hcGlzZGV0YWlscyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5maXJzdHRhYi50aXRsZSA9IENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LkFERElUSU9OQUxERVRBSUxTRklSU1RUQUI7XG4gICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5maXJzdHRhYik7XG4gICAgICAgICAgICB0aGlzLnNlY29uZHRhYi50aXRsZSA9IENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LkFERElUSU9OQUxERVRBSUxTU0VDT05EVEFCO1xuICAgICAgICAgICAgdGhpcy5hcGlzZGV0YWlscy5wdXNoKHRoaXMuc2Vjb25kdGFiKTtcbiAgICAgICAgICAgIHRoaXMudGhyaWR0YWIudGl0bGUgPSBDb21wZW5zYXRpb25BZGRpdGlvbmFsRGV0YWlsc0NvbXBvbmVudC5BRERJVElPTkFMREVUQUlMU1RISVJEVEFCO1xuICAgICAgICAgICAgdGhpcy5hcGlzZGV0YWlscy5wdXNoKHRoaXMudGhyaWR0YWIpO1xuICAgICAgICAgICAgdGhpcy5mb3VydGh0YWIudGl0bGUgPSBDb21wZW5zYXRpb25BZGRpdGlvbmFsRGV0YWlsc0NvbXBvbmVudC5BRERJVElPTkFMREVUQUlMU0ZPVVJUSFRBQjtcbiAgICAgICAgICAgIHRoaXMuYXBpc2RldGFpbHMucHVzaCh0aGlzLmZvdXJ0aHRhYik7XG4gICAgICAgICAgICB0aGlzLmlzTGFiZWxGaWVsZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5Jc1Zpc2libGVBbGxUYWIgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuY29weVRvU2VsZWN0UGF4ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuY29weVRvU2VsZWN0UGF4UmVhY2MgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuUHJldmlvdXNQYWdlID09IFwiSXNzdWVDb21wZW5zYXRpb25UYWJcIikge1xuICAgICAgICAgICAgdGhpcy5hcGlzZGV0YWlscyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5maXJzdHRhYi50aXRsZSA9IENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LkFERElUSU9OQUxERVRBSUxTRklSU1RUQUI7XG4gICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5maXJzdHRhYik7XG4gICAgICAgICAgICB0aGlzLnNlY29uZHRhYi50aXRsZSA9IENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LkFERElUSU9OQUxERVRBSUxTU0VDT05EVEFCO1xuICAgICAgICAgICAgdGhpcy5hcGlzZGV0YWlscy5wdXNoKHRoaXMuc2Vjb25kdGFiKTtcbiAgICAgICAgICAgIHRoaXMudGhyaWR0YWIudGl0bGUgPSBDb21wZW5zYXRpb25BZGRpdGlvbmFsRGV0YWlsc0NvbXBvbmVudC5BRERJVElPTkFMREVUQUlMU1RISVJEVEFCO1xuICAgICAgICAgICAgdGhpcy5hcGlzZGV0YWlscy5wdXNoKHRoaXMudGhyaWR0YWIpO1xuICAgICAgICAgICAgdGhpcy5mb3VydGh0YWIudGl0bGUgPSBDb21wZW5zYXRpb25BZGRpdGlvbmFsRGV0YWlsc0NvbXBvbmVudC5BRERJVElPTkFMREVUQUlMU0ZPVVJUSFRBQjtcbiAgICAgICAgICAgIHRoaXMuYXBpc2RldGFpbHMucHVzaCh0aGlzLmZvdXJ0aHRhYik7XG4gICAgICAgICAgICBpZiAodGhpcy5QYXhJdGVtLklzQ29tcGVuc2F0aW9uSXNzdWVkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzTGFiZWxGaWVsZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5Jc1Zpc2libGVBbGxUYWIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcHlUb1NlbGVjdFBheCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuY29weVRvU2VsZWN0UGF4UmVhY2MgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0xhYmVsRmllbGQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLklzVmlzaWJsZUFsbFRhYiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuY29weVRvU2VsZWN0UGF4ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcHlUb1NlbGVjdFBheFJlYWNjID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLlByZXZpb3VzUGFnZSA9PSBcIlByaW50TGlzdFwiKSB7XG4gICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzID0gW107XG4gICAgICAgICAgICB0aGlzLmZpcnN0dGFiLnRpdGxlID0gQ29tcGVuc2F0aW9uQWRkaXRpb25hbERldGFpbHNDb21wb25lbnQuQURESVRJT05BTERFVEFJTFNGSVJTVFRBQjtcbiAgICAgICAgICAgIHRoaXMuYXBpc2RldGFpbHMucHVzaCh0aGlzLmZpcnN0dGFiKTtcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kdGFiLnRpdGxlID0gQ29tcGVuc2F0aW9uQWRkaXRpb25hbERldGFpbHNDb21wb25lbnQuQURESVRJT05BTERFVEFJTFNTRUNPTkRUQUI7XG4gICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5zZWNvbmR0YWIpO1xuICAgICAgICAgICAgdGhpcy50aHJpZHRhYi50aXRsZSA9IENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LkFERElUSU9OQUxERVRBSUxTVEhJUkRUQUI7XG4gICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy50aHJpZHRhYik7XG4gICAgICAgICAgICB0aGlzLmZvdXJ0aHRhYi50aXRsZSA9IENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LkFERElUSU9OQUxERVRBSUxTRk9VUlRIVEFCO1xuICAgICAgICAgICAgdGhpcy5hcGlzZGV0YWlscy5wdXNoKHRoaXMuZm91cnRodGFiKTtcbiAgICAgICAgICAgIHRoaXMuaXNMYWJlbEZpZWxkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuSXNWaXNpYmxlQWxsVGFiID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNvcHlUb1NlbGVjdFBheCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5jb3B5VG9TZWxlY3RQYXhSZWFjYyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbiBoZXJlIDJcIik7XG4gICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzID0gW107XG4gICAgICAgICAgICB0aGlzLmZpcnN0dGFiLnRpdGxlID0gQ29tcGVuc2F0aW9uQWRkaXRpb25hbERldGFpbHNDb21wb25lbnQuQURESVRJT05BTERFVEFJTFNGSVJTVFRBQjtcbiAgICAgICAgICAgIHRoaXMuYXBpc2RldGFpbHMucHVzaCh0aGlzLmZpcnN0dGFiKTtcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kdGFiLnRpdGxlID0gQ29tcGVuc2F0aW9uQWRkaXRpb25hbERldGFpbHNDb21wb25lbnQuQURESVRJT05BTERFVEFJTFNTRUNPTkRUQUI7XG4gICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5zZWNvbmR0YWIpO1xuICAgICAgICAgICAgdGhpcy5Jc1Zpc2libGVBbGxUYWIgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5jb3B5VG9TZWxlY3RQYXggPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuY29weVRvU2VsZWN0UGF4UmVhY2MgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5Jc1Zpc2libGVBbGxUYWIgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuSXNzdWVDb21wZW5zYXRpb25QYXhMaXN0ID0gdGhpcy5fc2hhcmVkLmdldElzc3VlQ29tcGVuc2F0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLk1vbmV0YXJ5VGV4dCA9IHRoaXMuUGF4SXRlbS5tb25ldGFyeWVuZG9yc2VtZW50VGV4dEl0ZW1zO1xuICAgICAgICAgICAgdGhpcy5Ib3RlbFRleHQgPSB0aGlzLlBheEl0ZW0uaG90ZWxlbmRvcnNlbWVudFRleHRJdGVtcztcbiAgICAgICAgICAgIHRoaXMuTWVhbFRleHQgPSB0aGlzLlBheEl0ZW0ubWVhbGVuZG9yc2VtZW50VGV4dEl0ZW1zO1xuICAgICAgICAgICAgdGhpcy5UcmFuc3BvcnRUZXh0ID0gdGhpcy5QYXhJdGVtLnRyYW5zcG9ydGF0aW9uZW5kb3JzZW1lbnRUZXh0SXRlbXM7XG4gICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvblJlYXNvbiA9IHRoaXMuUGF4SXRlbS5Db21wZW5zYXRpb25zWzBdLkNvbXBSZWFzb25UZXh0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLlBheEl0ZW0uRXhpc3RpbmdDb21wZW5zYXRpb25zID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuSXNIaXN0b3J5VmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5Jc0hpc3RvcnlWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLlBheEl0ZW0uRXhpc3RpbmdDb21wZW5zYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluc2lkZSBoaXN0b3J5XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuTW9uZXRhcnlDb21wZW5zdGlvbiA9IHRoaXMuUGF4SXRlbS5FeGlzdGluZ0NvbXBlbnNhdGlvbnMuZmlsdGVyKG0gPT4gbS5Db21wVHlwZVRleHQgPT0gQ29tcGVuc2F0aW9uQWRkaXRpb25hbERldGFpbHNDb21wb25lbnQuQ09NUFRZUEVNT05FVEFSWSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnNpZGVcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuTW9uZXRhcnlDb21wZW5zdGlvbikpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLk1vbmV0YXJ5Q29tcGVuc3Rpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLk1vbmV0YXJ5Q29tcGVuc3Rpb24uZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuRW1kc1swXS5FbmRvcnNlbWVudHMxVHh0LnJlcGxhY2UoJz8uJywgJy4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuRW1kc1swXS5FbmRvcnNlbWVudHMxVHh0LmluZGV4T2YoJz8nKT4wKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlBheEl0ZW0ubW9uZXRhcnlmcmVlVGV4dCA9IGRhdGEuRW1kc1swXS5FbmRvcnNlbWVudHMxVHh0LnN1YnN0cihkYXRhLkVtZHNbMF0uRW5kb3JzZW1lbnRzMVR4dC5pbmRleE9mKCc/JykgKyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGF4SXRlbS5tb25ldGFyeWZyZWVUZXh0ID0gZGF0YS5FbWRzWzBdLkVuZG9yc2VtZW50czFUeHQuc3Vic3RyKGRhdGEuRW1kc1swXS5FbmRvcnNlbWVudHMxVHh0LmluZGV4T2YoJ3wnKSArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5FbmRvcnNtZW50VGV4dE1vbmV0YXJ5ID0gZGF0YS5FbWRzWzBdLkVuZG9yc2VtZW50czFUeHQuc3BsaXQoJy4nKSA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklzTW9uZXRhcnlIaXN0b3J5VmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuSG90ZWxDb21wZW5zdGlvbiA9IHRoaXMuUGF4SXRlbS5FeGlzdGluZ0NvbXBlbnNhdGlvbnMuZmlsdGVyKG0gPT4gbS5Db21wVHlwZVRleHQgPT0gQ29tcGVuc2F0aW9uQWRkaXRpb25hbERldGFpbHNDb21wb25lbnQuQ09NUFRZUEVIT1RFTCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuSG90ZWxDb21wZW5zdGlvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSG90ZWxDb21wZW5zdGlvbi5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5FbWRzWzBdLkVuZG9yc2VtZW50czFUeHQucmVwbGFjZSgnPycsICcuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkVuZG9yc21lbnRUZXh0SG90ZWwgPSBkYXRhLkVtZHNbMF0uRW5kb3JzZW1lbnRzMVR4dC5zcGxpdCgnLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5FbWRzWzBdLkVuZG9yc2VtZW50czFUeHQuaW5kZXhPZignPycpPjApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGF4SXRlbS5ob3RlbEZyZWVUZXh0ID0gZGF0YS5FbWRzWzBdLkVuZG9yc2VtZW50czFUeHQuc3Vic3RyKGRhdGEuRW1kc1swXS5FbmRvcnNlbWVudHMxVHh0LmluZGV4T2YoJz8nKSArIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXhJdGVtLmhvdGVsRnJlZVRleHQgPSBkYXRhLkVtZHNbMF0uRW5kb3JzZW1lbnRzMVR4dC5zdWJzdHIoZGF0YS5FbWRzWzBdLkVuZG9yc2VtZW50czFUeHQuaW5kZXhPZignfCcpICsgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSXNIb3RlbEhpc3RvcnlWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5NZWFsQ29tcGVuc3Rpb24gPSB0aGlzLlBheEl0ZW0uRXhpc3RpbmdDb21wZW5zYXRpb25zLmZpbHRlcihtID0+IG0uQ29tcFR5cGVUZXh0ID09IENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LkNPTVBUWVBFTUVBTCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuTWVhbENvbXBlbnN0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5NZWFsQ29tcGVuc3Rpb24uZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuRW1kc1swXS5FbmRvcnNlbWVudHMxVHh0LnJlcGxhY2UoJz8nLCAnLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5FbmRvcnNtZW50VGV4dE1lYWwgPSBkYXRhLkVtZHNbMF0uRW5kb3JzZW1lbnRzMVR4dC5zcGxpdCgnLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5FbWRzWzBdLkVuZG9yc2VtZW50czFUeHQuaW5kZXhPZignPycpPjApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGF4SXRlbS5tZWFsRnJlZVRleHQgPSBkYXRhLkVtZHNbMF0uRW5kb3JzZW1lbnRzMVR4dC5zdWJzdHIoZGF0YS5FbWRzWzBdLkVuZG9yc2VtZW50czFUeHQuaW5kZXhPZignPycpICsgMik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlBheEl0ZW0ubWVhbEZyZWVUZXh0ID0gZGF0YS5FbWRzWzBdLkVuZG9yc2VtZW50czFUeHQuc3Vic3RyKGRhdGEuRW1kc1swXS5FbmRvcnNlbWVudHMxVHh0LmluZGV4T2YoJ3wnKSArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc01lYWxIaXN0b3J5VmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuVHJhbnNwb3J0Q29tcGVuc3Rpb24gPSB0aGlzLlBheEl0ZW0uRXhpc3RpbmdDb21wZW5zYXRpb25zLmZpbHRlcihtID0+IG0uQ29tcFR5cGVUZXh0ID09IENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LkNPTVBUWVBFVFJBTlNQT1JUKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5UcmFuc3BvcnRDb21wZW5zdGlvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVHJhbnNwb3J0Q29tcGVuc3Rpb24uZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuRW1kc1swXS5FbmRvcnNlbWVudHMxVHh0LnJlcGxhY2UoJz8nLCAnLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5FbmRvcnNtZW50VGV4dFRyYW5zcG9ydCA9IGRhdGEuRW1kc1swXS5FbmRvcnNlbWVudHMxVHh0LnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhLkVtZHNbMF0uRW5kb3JzZW1lbnRzMVR4dC5pbmRleE9mKCc/Jyk+MCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXhJdGVtLnRyYW5zcG9ydEZyZWVUZXh0ID0gZGF0YS5FbWRzWzBdLkVuZG9yc2VtZW50czFUeHQuc3Vic3RyKGRhdGEuRW1kc1swXS5FbmRvcnNlbWVudHMxVHh0LmluZGV4T2YoJz8nKSArIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXhJdGVtLnRyYW5zcG9ydEZyZWVUZXh0ID0gZGF0YS5FbWRzWzBdLkVuZG9yc2VtZW50czFUeHQuc3Vic3RyKGRhdGEuRW1kc1swXS5FbmRvcnNlbWVudHMxVHh0LmluZGV4T2YoJ3wnKSArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1RyYW5zcG9ydEhpc3RvcnlWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5QYXhJdGVtLlJlYWNjb21EZXRhaWxzKSB7XG4gICAgICAgICAgICB0aGlzLkZyb21GbGlnaHRPbmUgPSB0aGlzLlBheEl0ZW0uUmVhY2NvbURldGFpbHMuZmlsdGVyKG0gPT4gbS5Gcm9tVG9GbGFnID09IFwiRlJPTVwiICYmIG0uR1VJRGlzcGxheUZsYWcgPT0gXCIxXCIpWzBdO1xuICAgICAgICAgICAgaWYgKHRoaXMuRnJvbUZsaWdodE9uZSAhPSBudWxsIHx8IHRoaXMuRnJvbUZsaWdodE9uZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5Gcm9tRmxpZ2h0T25lLlJlYWNjb21BaXJsaW5lQ29kZSA9PSBudWxsICYmIHRoaXMuRnJvbUZsaWdodE9uZS5SZWFjY29tRmxpZ2h0Tm8gPT0gJzAnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZU51bWJlciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuRnJvbUZsaWdodE9uZS5SZWFjY29tQWlybGluZUNvZGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Gcm9tRmxpZ2h0T25lTnVtYmVyID0gdGhpcy5Gcm9tRmxpZ2h0T25lLlJlYWNjb21GbGlnaHRObztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZU51bWJlciA9IHRoaXMuRnJvbUZsaWdodE9uZS5SZWFjY29tQWlybGluZUNvZGUgKyB0aGlzLkZyb21GbGlnaHRPbmUuUmVhY2NvbUZsaWdodE5vO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZURhdGUgPSB0aGlzLkZyb21GbGlnaHRPbmUuUmVhY2NvbUZsaWdodER0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkZyb21GbGlnaHRPbmVOdW1iZXIgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZSA9IG5ldyBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuUmVhY2NvbURldGFpbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZS5SZWFjY29tQm9hcmRDaXR5Q2QgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZS5SZWFjY29tT2ZmQ2l0eUNkID0gXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLkZyb21GbGlnaHRPbmUuUmVhY2NvbUZsaWdodER0ID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRkxJR0hUOlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5Gcm9tRmxpZ2h0T25lKSk7XG4gICAgICAgICAgICB0aGlzLkZyb21GbGlnaHRUd28gPSB0aGlzLlBheEl0ZW0uUmVhY2NvbURldGFpbHMuZmlsdGVyKG0gPT4gbS5Gcm9tVG9GbGFnID09IFwiRlJPTVwiICYmIG0uR1VJRGlzcGxheUZsYWcgPT0gXCIyXCIpWzBdO1xuICAgICAgICAgICAgaWYgKHRoaXMuRnJvbUZsaWdodFR3byAhPSBudWxsIHx8IHRoaXMuRnJvbUZsaWdodFR3byAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5Gcm9tRmxpZ2h0VHdvLlJlYWNjb21BaXJsaW5lQ29kZSA9PSBudWxsICYmIHRoaXMuRnJvbUZsaWdodFR3by5SZWFjY29tRmxpZ2h0Tm8gPT0gJzAnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodFR3b051bWJlciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuRnJvbUZsaWdodFR3by5SZWFjY29tQWlybGluZUNvZGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Gcm9tRmxpZ2h0VHdvTnVtYmVyID0gdGhpcy5Gcm9tRmxpZ2h0VHdvLlJlYWNjb21GbGlnaHRObztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodFR3b051bWJlciA9IHRoaXMuRnJvbUZsaWdodFR3by5SZWFjY29tQWlybGluZUNvZGUgKyB0aGlzLkZyb21GbGlnaHRUd28uUmVhY2NvbUZsaWdodE5vO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodFR3b0RhdGUgPSB0aGlzLkZyb21GbGlnaHRUd28uUmVhY2NvbUZsaWdodER0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkZyb21GbGlnaHRUd29OdW1iZXIgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodFR3byA9IG5ldyBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuUmVhY2NvbURldGFpbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodFR3by5SZWFjY29tQm9hcmRDaXR5Q2QgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodFR3by5SZWFjY29tT2ZmQ2l0eUNkID0gXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLkZyb21GbGlnaHRUd28uUmVhY2NvbUZsaWdodER0ID1cIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodE9uZSA9IHRoaXMuUGF4SXRlbS5SZWFjY29tRGV0YWlscy5maWx0ZXIobSA9PiBtLkZyb21Ub0ZsYWcgPT0gXCJUT1wiICYmIG0uR1VJRGlzcGxheUZsYWcgPT0gXCIzXCIpWzBdO1xuICAgICAgICAgICAgaWYgKHRoaXMuVG9GbGlnaHRPbmUgIT0gbnVsbCB8fCB0aGlzLlRvRmxpZ2h0T25lICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLlRvRmxpZ2h0T25lLlJlYWNjb21BaXJsaW5lQ29kZSA9PSBudWxsICYmIHRoaXMuVG9GbGlnaHRPbmUuUmVhY2NvbUZsaWdodE5vID09ICcwJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlRvRmxpZ2h0T25lTnVtYmVyID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5Ub0ZsaWdodE9uZS5SZWFjY29tQWlybGluZUNvZGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodE9uZU51bWJlciA9IHRoaXMuVG9GbGlnaHRPbmUuUmVhY2NvbUZsaWdodE5vO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodE9uZU51bWJlciA9IHRoaXMuVG9GbGlnaHRPbmUuUmVhY2NvbUFpcmxpbmVDb2RlICsgdGhpcy5Ub0ZsaWdodE9uZS5SZWFjY29tRmxpZ2h0Tm87XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodE9uZURhdGUgPSB0aGlzLlRvRmxpZ2h0T25lLlJlYWNjb21GbGlnaHREdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodE9uZU51bWJlciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodE9uZSA9IG5ldyBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuUmVhY2NvbURldGFpbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuVG9GbGlnaHRPbmUuUmVhY2NvbUJvYXJkQ2l0eUNkID0gXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLlRvRmxpZ2h0T25lLlJlYWNjb21PZmZDaXR5Q2QgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuVG9GbGlnaHRPbmUuUmVhY2NvbUZsaWdodER0ID0gbW9tZW50KHRoaXMuc3RhcnREYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodFR3byA9IHRoaXMuUGF4SXRlbS5SZWFjY29tRGV0YWlscy5maWx0ZXIobSA9PiBtLkZyb21Ub0ZsYWcgPT0gXCJUT1wiICYmIG0uR1VJRGlzcGxheUZsYWcgPT0gXCI0XCIpWzBdO1xuICAgICAgICAgICAgaWYgKHRoaXMuVG9GbGlnaHRUd28gIT0gbnVsbCB8fCB0aGlzLlRvRmxpZ2h0VHdvICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLlRvRmxpZ2h0VHdvLlJlYWNjb21BaXJsaW5lQ29kZSA9PSBudWxsICYmIHRoaXMuVG9GbGlnaHRUd28uUmVhY2NvbUZsaWdodE5vID09ICcwJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlRvRmxpZ2h0VHdvTnVtYmVyID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5Ub0ZsaWdodFR3by5SZWFjY29tQWlybGluZUNvZGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodFR3b051bWJlciA9IHRoaXMuVG9GbGlnaHRUd28uUmVhY2NvbUZsaWdodE5vO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodFR3b051bWJlciA9IHRoaXMuVG9GbGlnaHRUd28uUmVhY2NvbUFpcmxpbmVDb2RlICsgdGhpcy5Ub0ZsaWdodFR3by5SZWFjY29tRmxpZ2h0Tm87XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodFR3b0RhdGUgPSB0aGlzLlRvRmxpZ2h0VHdvLlJlYWNjb21GbGlnaHREdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodFR3b051bWJlciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodFR3byA9IG5ldyBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuUmVhY2NvbURldGFpbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuVG9GbGlnaHRUd28uUmVhY2NvbUJvYXJkQ2l0eUNkID0gXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLlRvRmxpZ2h0VHdvLlJlYWNjb21PZmZDaXR5Q2QgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuVG9GbGlnaHRUd28uUmVhY2NvbUZsaWdodER0ID0gbW9tZW50KHRoaXMuc3RhcnREYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgIH1cbiAgICBzdWJtaXRFbmFibGVkKCk6IGJvb2xlYW4ge1xuXG4gICAgICAgIGlmICh0aGlzLklzU3VibWl0RW5hYmxlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29weVRvU2VsZWN0ZWRQYXgoKSB7XG4gICAgICAgIGlmICh0aGlzLlBheEl0ZW0uY29weVRvU2VsZWN0ZWRQYXggPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5QYXhJdGVtLmNvcHlUb1NlbGVjdGVkUGF4ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgZGF0YS5jb3B5VG9TZWxlY3RlZFBheCA9IHRydWU7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5QYXhJdGVtLmNvcHlUb1NlbGVjdGVkUGF4ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRQYXNzZW5nZXIuZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBkYXRhLmNvcHlUb1NlbGVjdGVkUGF4ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkYXRhLmhvdGVsRnJlZVRleHQgPSB0aGlzLlBheEl0ZW0uaG90ZWxGcmVlVGV4dDtcbiAgICAgICAgICAgICAgICBkYXRhLm1vbmV0YXJ5ZnJlZVRleHQgPSB0aGlzLlBheEl0ZW0ubW9uZXRhcnlmcmVlVGV4dDtcbiAgICAgICAgICAgICAgICBkYXRhLm1lYWxGcmVlVGV4dCA9IHRoaXMuUGF4SXRlbS5tZWFsRnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgZGF0YS50cmFuc3BvcnRGcmVlVGV4dCA9IHRoaXMuUGF4SXRlbS50cmFuc3BvcnRGcmVlVGV4dDtcbiAgICAgICAgICAgICAgICBkYXRhLm1lYWxEZXRhaWxzID0gdGhpcy5QYXhJdGVtLm1lYWxEZXRhaWxzO1xuICAgICAgICAgICAgICAgIGRhdGEuaG90ZWxEZXRhaWxzID0gdGhpcy5QYXhJdGVtLmhvdGVsRGV0YWlscztcbiAgICAgICAgICAgICAgICBkYXRhLnRyYW5zcG9ydEVNRCA9IHRoaXMuUGF4SXRlbS50cmFuc3BvcnRFTUQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIGNvcHlSZWFjY29tb2RhdGlvblRvU2VsZWN0ZWRQYXgoKSB7XG4gICAgICAgIGlmICh0aGlzLlBheEl0ZW0uY29weVRvU2VsZWN0ZWRQYXhSZWFjY29tID09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuUGF4SXRlbS5jb3B5VG9TZWxlY3RlZFBheFJlYWNjb20gPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRQYXNzZW5nZXIuZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBkYXRhLmNvcHlUb1NlbGVjdGVkUGF4UmVhY2NvbSA9IHRydWU7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5QYXhJdGVtLmNvcHlUb1NlbGVjdGVkUGF4UmVhY2NvbSA9IHRydWU7XG4gICAgICAgICAgICAvLyB0aGlzLnNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAvLyAgICAgZGF0YS5jb3B5VG9TZWxlY3RlZFBheFJlYWNjb20gPSB0cnVlO1xuICAgICAgICAgICAgLy8gICAgIGRhdGEuUmVhY2NvbURldGFpbHMgPXRoaXMuUGF4SXRlbS5SZWFjY29tRGV0YWlscztcbiAgICAgICAgICAgIC8vIH0pXG5cbiAgICAgICAgfVxuICAgIH1cbiAgICBvbkNoYW5nZShhcmdzOiBhbnksIGluZGV4OiBhbnkpIHtcbiAgICAgICAgY29uc29sZS5sb2coaW5kZXgpO1xuICAgICAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgLy8gaWYgKHRoaXMuRnJvbUZsaWdodE9uZU51bWJlci5sZW5ndGggPiA2KSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuRnJvbUZsaWdodE9uZUVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLkZyb21GbGlnaHRPbmVOdW1iZXIgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyB2YXIgcmVnID0gbmV3IFJlZ0V4cCcvKFtBLVpdezIsM30pXFxkezMsNH0vJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBSRUdfRVhQID0gLyheKFtBLVphLXpdezAsMn0pXFxkezEsNH0pJC87XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gUkVHX0VYUC50ZXN0KHRoaXMuRnJvbUZsaWdodE9uZU51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkZyb21GbGlnaHRPbmVFcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUb2FzdC5tYWtlVGV4dChDb21wZW5zYXRpb25BZGRpdGlvbmFsRGV0YWlsc0NvbXBvbmVudC5JTlZBTElEQUlSTElORUNPREUpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZUVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZUVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5Gcm9tRmxpZ2h0T25lLlJlYWNjb21Cb2FyZENpdHlDZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuRnJvbUZsaWdodE9uZS5SZWFjY29tQm9hcmRDaXR5Q2QubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Gcm9tT3JpZ2luT25lRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuRnJvbUZsaWdodE9uZS5SZWFjY29tQm9hcmRDaXR5Q2QgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl0qJCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gcmVnLnRlc3QodGhpcy5Gcm9tRmxpZ2h0T25lLlJlYWNjb21Cb2FyZENpdHlDZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3QgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Gcm9tT3JpZ2luT25lRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChDb21wZW5zYXRpb25BZGRpdGlvbmFsRGV0YWlsc0NvbXBvbmVudC5JTlZBTElEREVQQUNPREUpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkZyb21PcmlnaW5PbmVFcnJvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Gcm9tT3JpZ2luT25lRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5Gcm9tRmxpZ2h0T25lLlJlYWNjb21PZmZDaXR5Q2QgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLkZyb21GbGlnaHRPbmUuUmVhY2NvbU9mZkNpdHlDZC5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkZyb21EZXN0T25lRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuRnJvbUZsaWdodE9uZS5SZWFjY29tT2ZmQ2l0eUNkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnXlthLXpBLVpdKiQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IHJlZy50ZXN0KHRoaXMuRnJvbUZsaWdodE9uZS5SZWFjY29tT2ZmQ2l0eUNkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGVzdCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkZyb21EZXN0T25lRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChDb21wZW5zYXRpb25BZGRpdGlvbmFsRGV0YWlsc0NvbXBvbmVudC5JTlZBTElEQVJSSUNPREUpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkZyb21EZXN0T25lRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbURlc3RPbmVFcnJvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIC8vIGlmICh0aGlzLkZyb21GbGlnaHRUd29OdW1iZXIubGVuZ3RoID4gNikge1xuICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLkZyb21GbGlnaHRUd29FcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5Gcm9tRmxpZ2h0VHdvTnVtYmVyICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIFJFR19FWFAgPSAvKF4oW0EtWmEtel17MCwyfSlcXGR7MSw0fSkkLztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3QgPSBSRUdfRVhQLnRlc3QodGhpcy5Gcm9tRmxpZ2h0VHdvTnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3QgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodFR3b0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRvYXN0Lm1ha2VUZXh0KENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LklOVkFMSURBSVJMSU5FQ09ERSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Gcm9tRmxpZ2h0VHdvRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Gcm9tRmxpZ2h0VHdvRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLkZyb21GbGlnaHRUd28uUmVhY2NvbUJvYXJkQ2l0eUNkICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5Gcm9tRmxpZ2h0VHdvLlJlYWNjb21Cb2FyZENpdHlDZC5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkZyb21PcmlnaW5Ud29FcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5Gcm9tRmxpZ2h0VHdvLlJlYWNjb21Cb2FyZENpdHlDZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoJ15bYS16QS1aXSokJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3QgPSByZWcudGVzdCh0aGlzLkZyb21GbGlnaHRUd28uUmVhY2NvbUJvYXJkQ2l0eUNkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGVzdCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkZyb21PcmlnaW5Ud29FcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LklOVkFMSURERVBBQ09ERSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbU9yaWdpblR3b0Vycm9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkZyb21PcmlnaW5Ud29FcnJvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLkZyb21GbGlnaHRUd28uUmVhY2NvbU9mZkNpdHlDZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuRnJvbUZsaWdodFR3by5SZWFjY29tT2ZmQ2l0eUNkLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbURlc3RUd29FcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5Gcm9tRmxpZ2h0VHdvLlJlYWNjb21PZmZDaXR5Q2QgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl0qJCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gcmVnLnRlc3QodGhpcy5Gcm9tRmxpZ2h0VHdvLlJlYWNjb21PZmZDaXR5Q2QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbURlc3RUd29FcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LklOVkFMSURBUlJJQ09ERSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbURlc3RUd29FcnJvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Gcm9tRGVzdFR3b0Vycm9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgLy8gaWYgKHRoaXMuVG9GbGlnaHRPbmVOdW1iZXIubGVuZ3RoID4gNikge1xuICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLlRvRmxpZ2h0T25lRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuVG9GbGlnaHRPbmVOdW1iZXIgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgUkVHX0VYUCA9IC8oXihbQS1aYS16XXswLDJ9KVxcZHsxLDR9KSQvO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IFJFR19FWFAudGVzdCh0aGlzLlRvRmxpZ2h0T25lTnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3QgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVG9GbGlnaHRPbmVFcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUb2FzdC5tYWtlVGV4dChDb21wZW5zYXRpb25BZGRpdGlvbmFsRGV0YWlsc0NvbXBvbmVudC5JTlZBTElEQUlSTElORUNPREUpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVG9GbGlnaHRPbmVFcnJvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlRvRmxpZ2h0T25lRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLlRvRmxpZ2h0T25lLlJlYWNjb21Cb2FyZENpdHlDZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuVG9GbGlnaHRPbmUuUmVhY2NvbUJvYXJkQ2l0eUNkLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVG9PcmlnaW5PbmVFcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5Ub0ZsaWdodE9uZS5SZWFjY29tQm9hcmRDaXR5Q2QgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl0qJCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gcmVnLnRlc3QodGhpcy5Ub0ZsaWdodE9uZS5SZWFjY29tQm9hcmRDaXR5Q2QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVG9PcmlnaW5PbmVFcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LklOVkFMSURERVBBQ09ERSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVG9PcmlnaW5PbmVFcnJvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub09yaWdpbk9uZUVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICBpZiAodGhpcy5Ub0ZsaWdodE9uZS5SZWFjY29tT2ZmQ2l0eUNkICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLlRvRmxpZ2h0T25lLlJlYWNjb21PZmZDaXR5Q2QubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlRvRGVzdE9uZUVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5Ub0ZsaWdodE9uZS5SZWFjY29tT2ZmQ2l0eUNkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl0qJCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3QgPSByZWcudGVzdCh0aGlzLlRvRmxpZ2h0T25lLlJlYWNjb21PZmZDaXR5Q2QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3QgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlRvRGVzdE9uZUVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChDb21wZW5zYXRpb25BZGRpdGlvbmFsRGV0YWlsc0NvbXBvbmVudC5JTlZBTElEQVJSSUNPREUpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub0Rlc3RPbmVFcnJvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub0Rlc3RPbmVFcnJvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgICAgICAvLyBpZiAodGhpcy5Ub0ZsaWdodFR3b051bWJlci5sZW5ndGggPiA2KSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuVG9GbGlnaHRUd29FcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5Ub0ZsaWdodFR3b051bWJlciAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBSRUdfRVhQID0gLyheKFtBLVphLXpdezAsMn0pXFxkezEsNH0pJC87XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gUkVHX0VYUC50ZXN0KHRoaXMuVG9GbGlnaHRUd29OdW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGVzdCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodFR3b0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRvYXN0Lm1ha2VUZXh0KENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LklOVkFMSURBSVJMSU5FQ09ERSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodFR3b0Vycm9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVG9GbGlnaHRUd29FcnJvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDExOlxuICAgICAgICAgICAgaWYgKHRoaXMuVG9GbGlnaHRUd28uUmVhY2NvbUJvYXJkQ2l0eUNkICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuVG9GbGlnaHRUd28uUmVhY2NvbUJvYXJkQ2l0eUNkLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub09yaWdpblR3b0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5Ub0ZsaWdodFR3by5SZWFjY29tQm9hcmRDaXR5Q2QgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoJ15bYS16QS1aXSokJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IHJlZy50ZXN0KHRoaXMuVG9GbGlnaHRUd28uUmVhY2NvbUJvYXJkQ2l0eUNkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub09yaWdpblR3b0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChDb21wZW5zYXRpb25BZGRpdGlvbmFsRGV0YWlsc0NvbXBvbmVudC5JTlZBTElEREVQQUNPREUpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub09yaWdpblR3b0Vycm9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlRvT3JpZ2luVHdvRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICBpZiAodGhpcy5Ub0ZsaWdodFR3by5SZWFjY29tT2ZmQ2l0eUNkICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuVG9GbGlnaHRUd28uUmVhY2NvbU9mZkNpdHlDZC5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVG9EZXN0VHdvRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLlRvRmxpZ2h0VHdvLlJlYWNjb21PZmZDaXR5Q2QgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoJ15bYS16QS1aXSokJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IHJlZy50ZXN0KHRoaXMuVG9GbGlnaHRUd28uUmVhY2NvbU9mZkNpdHlDZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGVzdCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVG9EZXN0VHdvRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50LklOVkFMSURBUlJJQ09ERSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlRvRGVzdFR3b0Vycm9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlRvRGVzdFR3b0Vycm9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLlBheEl0ZW0uV29ybGRUcmFjZXJOdW0ubGVuZ3RoID4gMTApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1dvcmxkVHJhY2VWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUGF4SXRlbS5Xb3JsZFRyYWNlck51bSAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnXlthLXpBLVowLTldKiQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gcmVnLnRlc3QodGhpcy5QYXhJdGVtLldvcmxkVHJhY2VyTnVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1dvcmxkVHJhY2VWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoQ29tcGVuc2F0aW9uQWRkaXRpb25hbERldGFpbHNDb21wb25lbnQuSU5WQUxJRFdPUkxEVFJBQ0VOVU1CRVIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1dvcmxkVHJhY2VWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1dvcmxkVHJhY2VWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxNDpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5QYXhJdGVtLkN1c3RvbWVyQ2FyZUNhc2VOdW0ubGVuZ3RoID4gMTUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc0N1c3RvbWVyQ2FyZVZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5QYXhJdGVtLkN1c3RvbWVyQ2FyZUNhc2VOdW0gIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoJ15bMC05XSokJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IHJlZy50ZXN0KHRoaXMuUGF4SXRlbS5DdXN0b21lckNhcmVDYXNlTnVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc0N1c3RvbWVyQ2FyZVZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChDb21wZW5zYXRpb25BZGRpdGlvbmFsRGV0YWlsc0NvbXBvbmVudC5JTlZBTElEQ1VTVE9NRVJDQVJFQ09ERSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklzQ3VzdG9tZXJDYXJlVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSXNDdXN0b21lckNhcmVWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxNTpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5QYXhJdGVtLm1vbmV0YXJ5ZnJlZVRleHQubGVuZ3RoID4gNTApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc01vbmV0YXJ5VGV4dFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJNYXhpbXVtIDUwIGNoYXJhY3RlcnNcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLlBheEl0ZW0ubW9uZXRhcnlmcmVlVGV4dCAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnXlthLXpBLVowLTkgLC5dKiQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gcmVnLnRlc3QodGhpcy5QYXhJdGVtLm1vbmV0YXJ5ZnJlZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3QgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklzTW9uZXRhcnlUZXh0VmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklzTW9uZXRhcnlUZXh0VmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSXNNb25ldGFyeVRleHRWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxNjpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5QYXhJdGVtLmhvdGVsRnJlZVRleHQubGVuZ3RoID4gNTApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc0hvdGVsVGV4dFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJNYXhpbXVtIDUwIGNoYXJhY3RlcnNcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLlBheEl0ZW0uaG90ZWxGcmVlVGV4dCAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnXlthLXpBLVowLTkgLC5dKiQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gcmVnLnRlc3QodGhpcy5QYXhJdGVtLmhvdGVsRnJlZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3QgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklzSG90ZWxUZXh0VmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklzSG90ZWxUZXh0VmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSXNIb3RlbFRleHRWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxNzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5QYXhJdGVtLmhvdGVsRGV0YWlscy5sZW5ndGggPiAyNikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLklzSG90ZWxOYW1lVmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk1heGltdW0gMjYgY2hhcmFjdGVyc1wiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUGF4SXRlbS5ob3RlbERldGFpbHMgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoJ15bYS16QS1aMC05ICwuXSokJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IHJlZy50ZXN0KHRoaXMuUGF4SXRlbS5ob3RlbERldGFpbHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3QgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklzSG90ZWxOYW1lVmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklzSG90ZWxOYW1lVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSXNIb3RlbE5hbWVWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxODpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5QYXhJdGVtLm1lYWxGcmVlVGV4dC5sZW5ndGggPiA1MCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLklzTWVhbFRleHRWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiTWF4aW11bSA1MCBjaGFyYWN0ZXJzXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5QYXhJdGVtLm1lYWxGcmVlVGV4dCAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnXlthLXpBLVowLTkgLC5dKiQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gcmVnLnRlc3QodGhpcy5QYXhJdGVtLm1lYWxGcmVlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGVzdCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSXNNZWFsVGV4dFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc01lYWxUZXh0VmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSXNNZWFsVGV4dFZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE5OlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLlBheEl0ZW0udHJhbnNwb3J0RnJlZVRleHQubGVuZ3RoID4gNTApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1RyYW5zcG9ydFRleHRWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiTWF4aW11bSA1MCBjaGFyYWN0ZXJzXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5QYXhJdGVtLnRyYW5zcG9ydEZyZWVUZXh0ICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKCdeW2EtekEtWjAtOSAsLl0qJCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3QgPSByZWcudGVzdCh0aGlzLlBheEl0ZW0udHJhbnNwb3J0RnJlZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3QgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklzVHJhbnNwb3J0VGV4dFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1RyYW5zcG9ydFRleHRWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1RyYW5zcG9ydFRleHRWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyMDpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5QYXhJdGVtLm1lYWxEZXRhaWxzLmxlbmd0aCA+IDUwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNNZWFsRGV0YWlsVmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk1heGltdW0gMjYgY2hhcmFjdGVyc1wiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUGF4SXRlbS5tZWFsRGV0YWlscyAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnXlthLXpBLVowLTkgLC5dKiQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gcmVnLnRlc3QodGhpcy5QYXhJdGVtLm1lYWxEZXRhaWxzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc01lYWxEZXRhaWxWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNNZWFsRGV0YWlsVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNNZWFsRGV0YWlsVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjE6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuUGF4SXRlbS50cmFuc3BvcnRFTUQubGVuZ3RoID4gNTApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1RyYW5zcG9ydEVNRFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJNYXhpbXVtIDI2IGNoYXJhY3RlcnNcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLlBheEl0ZW0udHJhbnNwb3J0RU1EICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKCdeW2EtekEtWjAtOSAsLl0qJCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3QgPSByZWcudGVzdCh0aGlzLlBheEl0ZW0udHJhbnNwb3J0RU1EKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1RyYW5zcG9ydEVNRFZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1RyYW5zcG9ydEVNRFZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVHJhbnNwb3J0RU1EVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgKHRoaXMuRnJvbUZsaWdodE9uZUVycm9yID09IGZhbHNlICYmIHRoaXMuRnJvbU9yaWdpbk9uZUVycm9yID09IGZhbHNlICYmIHRoaXMuRnJvbURlc3RPbmVFcnJvciA9PSBmYWxzZSAmJiB0aGlzLkZyb21GbGlnaHRUd29FcnJvciA9PSBmYWxzZSAmJiB0aGlzLkZyb21PcmlnaW5Ud29FcnJvciA9PSBmYWxzZSAmJiB0aGlzLkZyb21EZXN0VHdvRXJyb3IgPT0gZmFsc2UgJiYgdGhpcy5Ub0ZsaWdodE9uZUVycm9yID09IGZhbHNlICYmIHRoaXMuVG9PcmlnaW5PbmVFcnJvciA9PSBmYWxzZSAmJiB0aGlzLlRvRGVzdE9uZUVycm9yID09IGZhbHNlICYmIHRoaXMuVG9GbGlnaHRUd29FcnJvciA9PSBmYWxzZSAmJiB0aGlzLlRvT3JpZ2luVHdvRXJyb3IgPT0gZmFsc2UgJiYgdGhpcy5Ub0Rlc3RUd29FcnJvciA9PSBmYWxzZSAmJiB0aGlzLklzQ3VzdG9tZXJDYXJlVmFsaWQgPT0gZmFsc2UgJiYgdGhpcy5Jc1dvcmxkVHJhY2VWYWxpZCA9PSBmYWxzZSAmJiB0aGlzLklzVHJhbnNwb3J0VGV4dFZhbGlkID09IGZhbHNlICYmIHRoaXMuSXNNZWFsVGV4dFZhbGlkID09IGZhbHNlICYmIHRoaXMuSXNIb3RlbE5hbWVWYWxpZCA9PSBmYWxzZSAmJiB0aGlzLklzSG90ZWxUZXh0VmFsaWQgPT0gZmFsc2UgJiYgdGhpcy5Jc01vbmV0YXJ5VGV4dFZhbGlkID09IGZhbHNlICYmIHRoaXMuaXNUcmFuc3BvcnRFTURWYWxpZCA9PSBmYWxzZSAmJiB0aGlzLmlzTWVhbERldGFpbFZhbGlkID09IGZhbHNlKSB7XG4gICAgICAgIC8vICAgICB0aGlzLklzU3VibWl0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICB0aGlzLklzU3VibWl0RW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZmxpZ2h0IGRhdGU6XCIgKyB0aGlzLkZyb21GbGlnaHRPbmVEYXRlKTtcbiAgICAgICAgdGhpcy5Jc1N1Ym1pdEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5Gcm9tRmxpZ2h0T25lTnVtYmVyICE9IFwiXCIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLkZyb21GbGlnaHRPbmUuUmVhY2NvbUJvYXJkQ2l0eUNkICE9IG51bGwgJiYgdGhpcy5Gcm9tRmxpZ2h0T25lLlJlYWNjb21PZmZDaXR5Q2QgIT0gbnVsbCAmJiB0aGlzLkZyb21GbGlnaHRPbmVEYXRlICE9IHVuZGVmaW5lZCAmJiB0aGlzLkZyb21GbGlnaHRPbmUuUmVhY2NvbUJvYXJkQ2l0eUNkICE9IFwiXCIgJiYgdGhpcy5Gcm9tRmxpZ2h0T25lLlJlYWNjb21PZmZDaXR5Q2QgIT0gXCJcIiAmJiB0aGlzLkZyb21GbGlnaHRPbmVEYXRlICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5Gcm9tRmxpZ2h0T25lRXJyb3IgPT0gZmFsc2UgJiYgdGhpcy5Gcm9tT3JpZ2luT25lRXJyb3IgPT0gZmFsc2UgJiYgdGhpcy5Gcm9tRGVzdE9uZUVycm9yID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuSXNTdWJtaXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLklzU3VibWl0RW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuSXNTdWJtaXRFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuRnJvbUZsaWdodFR3b051bWJlciAhPSBcIlwiKSB7XG4gICAgICAgICAgICAvLyB0aGlzLklzU3VibWl0RW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHRoaXMuRnJvbUZsaWdodFR3by5SZWFjY29tQm9hcmRDaXR5Q2QgIT0gbnVsbCAmJiB0aGlzLkZyb21GbGlnaHRUd28uUmVhY2NvbU9mZkNpdHlDZCAhPSBudWxsICYmIHRoaXMuRnJvbUZsaWdodFR3b0RhdGUgIT0gdW5kZWZpbmVkICYmIHRoaXMuRnJvbUZsaWdodFR3by5SZWFjY29tQm9hcmRDaXR5Q2QgIT0gXCJcIiAmJiB0aGlzLkZyb21GbGlnaHRUd28uUmVhY2NvbU9mZkNpdHlDZCAhPSBcIlwiICYmIHRoaXMuRnJvbUZsaWdodFR3b0RhdGUgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLkZyb21GbGlnaHRUd29FcnJvciA9PSBmYWxzZSAmJiB0aGlzLkZyb21PcmlnaW5Ud29FcnJvciA9PSBmYWxzZSAmJiB0aGlzLkZyb21EZXN0VHdvRXJyb3IgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuSXNTdWJtaXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSXNTdWJtaXRFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuSXNTdWJtaXRFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuVG9GbGlnaHRPbmVOdW1iZXIgIT0gXCJcIikge1xuICAgICAgICAgICAgLy8gdGhpcy5Jc1N1Ym1pdEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICh0aGlzLlRvRmxpZ2h0T25lLlJlYWNjb21Cb2FyZENpdHlDZCAhPSBudWxsICYmIHRoaXMuVG9GbGlnaHRPbmUuUmVhY2NvbU9mZkNpdHlDZCAhPSBudWxsICYmIHRoaXMuVG9GbGlnaHRPbmVEYXRlICE9IHVuZGVmaW5lZCAmJiB0aGlzLlRvRmxpZ2h0T25lLlJlYWNjb21Cb2FyZENpdHlDZCAhPSBcIlwiICYmIHRoaXMuVG9GbGlnaHRPbmUuUmVhY2NvbU9mZkNpdHlDZCAhPSBcIlwiICYmIHRoaXMuVG9GbGlnaHRPbmVEYXRlICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5Ub0ZsaWdodE9uZUVycm9yID09IGZhbHNlICYmIHRoaXMuVG9PcmlnaW5PbmVFcnJvciA9PSBmYWxzZSAmJiB0aGlzLlRvRGVzdE9uZUVycm9yID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLklzU3VibWl0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklzU3VibWl0RW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLklzU3VibWl0RW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLlRvRmxpZ2h0VHdvTnVtYmVyICE9IFwiXCIpIHtcbiAgICAgICAgICAgIC8vIHRoaXMuSXNTdWJtaXRFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcy5Ub0ZsaWdodFR3by5SZWFjY29tQm9hcmRDaXR5Q2QgIT0gbnVsbCAmJiB0aGlzLlRvRmxpZ2h0VHdvLlJlYWNjb21PZmZDaXR5Q2QgIT0gbnVsbCAmJiB0aGlzLlRvRmxpZ2h0VHdvRGF0ZSAhPSB1bmRlZmluZWQgJiYgdGhpcy5Ub0ZsaWdodFR3by5SZWFjY29tQm9hcmRDaXR5Q2QgIT0gXCJcIiAmJiB0aGlzLlRvRmxpZ2h0VHdvLlJlYWNjb21PZmZDaXR5Q2QgIT0gXCJcIiAmJiB0aGlzLlRvRmxpZ2h0VHdvRGF0ZSAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCAgdGhpcy5Ub0ZsaWdodFR3b0Vycm9yID09IGZhbHNlICYmIHRoaXMuVG9PcmlnaW5Ud29FcnJvciA9PSBmYWxzZSAmJiB0aGlzLlRvRGVzdFR3b0Vycm9yID09IGZhbHNlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5Jc1N1Ym1pdEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1N1Ym1pdEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5Jc1N1Ym1pdEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICB9XG4gICAgbW9uZXRhcnlMYXlvdXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuRmlyc3RCbG9jayA9IHRydWU7XG4gICAgICAgIHRoaXMuU2Vjb25kQmxvY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5UaGlyZEJsb2NrID0gZmFsc2U7XG4gICAgICAgIHRoaXMuRm91cnRoQmxvY2sgPSBmYWxzZTtcbiAgICB9XG4gICAgaG90ZWxMYXlvdXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuRmlyc3RCbG9jayA9IGZhbHNlO1xuICAgICAgICB0aGlzLlNlY29uZEJsb2NrID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5UaGlyZEJsb2NrID0gZmFsc2U7XG4gICAgICAgIHRoaXMuRm91cnRoQmxvY2sgPSBmYWxzZTtcbiAgICB9XG4gICAgbWVhbExheW91dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5GaXJzdEJsb2NrID0gZmFsc2U7XG4gICAgICAgIHRoaXMuU2Vjb25kQmxvY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5UaGlyZEJsb2NrID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5Gb3VydGhCbG9jayA9IGZhbHNlO1xuICAgIH1cbiAgICB0cmFuc3BvcnRMYXlvdXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuRmlyc3RCbG9jayA9IGZhbHNlO1xuICAgICAgICB0aGlzLlNlY29uZEJsb2NrID0gZmFsc2U7XG4gICAgICAgIHRoaXMuVGhpcmRCbG9jayA9IGZhbHNlO1xuICAgICAgICB0aGlzLkZvdXJ0aEJsb2NrID0gdHJ1ZTtcbiAgICB9XG4gICAgcHVibGljIHNlbGVjdFNlZ21lbnQoZTogYW55KSB7XG4gICAgICAgIGNvbnNvbGUuZGlyKGUpO1xuICAgICAgICB2YXIgc2VsSW5kID0gZS5uZXdJbmRleDtcbiAgICAgICAgaWYgKHRoaXMuSXNWaXNpYmxlQWxsVGFiID09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29uZCAyXCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLklzVmlzaWJsZUFsbFRhYikpO1xuICAgICAgICAgICAgaWYgKHNlbEluZCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25IaXN0b3J5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbkRldGFpbHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLlJlYWNjb21vZGF0aW9uRGV0YWlscyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuT3RoZXJEZXRhaWxzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5GaXJzdEJsb2NrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLlNlY29uZEJsb2NrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5UaGlyZEJsb2NrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5Gb3VydGhCbG9jayA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxJbmQgPT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uSGlzdG9yeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uRGV0YWlscyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuUmVhY2NvbW9kYXRpb25EZXRhaWxzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLk90aGVyRGV0YWlscyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuSXNGcm9tRmxpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLklzVG9GbGlnaHQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbmQgM1wiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5Jc1Zpc2libGVBbGxUYWIpKTtcbiAgICAgICAgICAgIGlmIChzZWxJbmQgPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uSGlzdG9yeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25EZXRhaWxzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5SZWFjY29tb2RhdGlvbkRldGFpbHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLk90aGVyRGV0YWlscyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuRmlyc3RCbG9jayA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5TZWNvbmRCbG9jayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuVGhpcmRCbG9jayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuRm91cnRoQmxvY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsSW5kID09IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbkhpc3RvcnkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbkRldGFpbHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLlJlYWNjb21vZGF0aW9uRGV0YWlscyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5PdGhlckRldGFpbHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLklzRnJvbUZsaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5Jc1RvRmxpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChzZWxJbmQgPT0gMikge1xuICAgICAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uSGlzdG9yeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uRGV0YWlscyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5SZWFjY29tb2RhdGlvbkRldGFpbHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLk90aGVyRGV0YWlscyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuSXNNb25ldG9yeUVtZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5Jc0hvdGVsRW1kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5Jc1RyYW5zcG9ydEVtZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuSXNNZWFsRW1kID0gZmFsc2U7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25IaXN0b3J5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25EZXRhaWxzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5SZWFjY29tb2RhdGlvbkRldGFpbHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLk90aGVyRGV0YWlscyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2VsZWN0ZWRCYWNrZ3JvdW5kQ29sb3IoZTogYW55KSB7XG4gICAgICAgIHZhciBzZWxDb2xvciA9IGUuQ29sb3JcbiAgICB9XG5cbiAgICBjcmVhdGVNb2RlbFZpZXdGb3JGcm9tMURhdGUoYXJncykge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIGxldCBjdXJyZW50RGF0ZSA9IHRoaXMuQ3VyRGF0ZTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGFydERhdGUpO1xuICAgICAgICBsZXQgb3B0aW9uczogTW9kYWxEaWFsb2dPcHRpb25zID0ge1xuICAgICAgICAgICAgdmlld0NvbnRhaW5lclJlZjogdGhpcy52Y1JlZixcbiAgICAgICAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgICAgICAgICBjdXJyZW50RGF0ZTogY3VycmVudERhdGUsXG4gICAgICAgICAgICAgICAgZGlzcGxheUhlYWRlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtaW5EYXRlOiBtb21lbnQobmV3IERhdGUoKSkuc3VidHJhY3QoMSwgJ3llYXJzJykudG9EYXRlKCkudG9EYXRlU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgbWF4RGF0ZTogbW9tZW50KG5ldyBEYXRlKCkpLmFkZCgyLCAneWVhcnMnKS50b0RhdGUoKS50b0RhdGVTdHJpbmcoKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bGxzY3JlZW46IGZhbHNlXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fbW9kYWxTZXJ2aWNlLnNob3dNb2RhbChEYXRlUGlja2VyTW9kYWwsIG9wdGlvbnMpXG4gICAgICAgICAgICAudGhlbigoZGF0ZXJlc3VsdDogRGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRlcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGF0ZSByZXN1bHQgXCIgKyBkYXRlcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGVyZXN1bHQudG9EYXRlU3RyaW5nKCkgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZURhdGUgPSBtb21lbnQoZGF0ZXJlc3VsdCkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cbiAgICBjcmVhdGVNb2RlbFZpZXdGcm9tMkRhdGUoYXJncykge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIGxldCBjdXJyZW50RGF0ZSA9IHRoaXMuQ3VyRGF0ZTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGFydERhdGUpO1xuICAgICAgICBsZXQgb3B0aW9uczogTW9kYWxEaWFsb2dPcHRpb25zID0ge1xuICAgICAgICAgICAgdmlld0NvbnRhaW5lclJlZjogdGhpcy52Y1JlZixcbiAgICAgICAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgICAgICAgICBjdXJyZW50RGF0ZTogY3VycmVudERhdGUsXG4gICAgICAgICAgICAgICAgZGlzcGxheUhlYWRlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtaW5EYXRlOiBtb21lbnQobmV3IERhdGUoKSkuc3VidHJhY3QoMSwgJ3llYXJzJykudG9EYXRlKCkudG9EYXRlU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgbWF4RGF0ZTogbW9tZW50KG5ldyBEYXRlKCkpLmFkZCgyLCAneWVhcnMnKS50b0RhdGUoKS50b0RhdGVTdHJpbmcoKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bGxzY3JlZW46IGZhbHNlXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fbW9kYWxTZXJ2aWNlLnNob3dNb2RhbChEYXRlUGlja2VyTW9kYWwsIG9wdGlvbnMpXG4gICAgICAgICAgICAudGhlbigoZGF0ZXJlc3VsdDogRGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRlcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGF0ZSByZXN1bHQgXCIgKyBkYXRlcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGVyZXN1bHQudG9EYXRlU3RyaW5nKCkgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodFR3b0RhdGUgPSBtb21lbnQoZGF0ZXJlc3VsdCkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cbiAgICBjcmVhdGVNb2RlbFZpZXdUbzFEYXRlKGFyZ3MpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICBsZXQgY3VycmVudERhdGUgPSB0aGlzLkN1ckRhdGU7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhcnREYXRlKTtcbiAgICAgICAgbGV0IG9wdGlvbnM6IE1vZGFsRGlhbG9nT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMudmNSZWYsXG4gICAgICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICAgICAgY3VycmVudERhdGU6IGN1cnJlbnREYXRlLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlIZWFkZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgbWluRGF0ZTogbW9tZW50KG5ldyBEYXRlKCkpLnN1YnRyYWN0KDEsICd5ZWFycycpLnRvRGF0ZSgpLnRvRGF0ZVN0cmluZygpLFxuICAgICAgICAgICAgICAgIG1heERhdGU6IG1vbWVudChuZXcgRGF0ZSgpKS5hZGQoMiwgJ3llYXJzJykudG9EYXRlKCkudG9EYXRlU3RyaW5nKClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdWxsc2NyZWVuOiBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX21vZGFsU2VydmljZS5zaG93TW9kYWwoRGF0ZVBpY2tlck1vZGFsLCBvcHRpb25zKVxuICAgICAgICAgICAgLnRoZW4oKGRhdGVyZXN1bHQ6IERhdGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0ZXJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGUgcmVzdWx0IFwiICsgZGF0ZXJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRlcmVzdWx0LnRvRGF0ZVN0cmluZygpICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlRvRmxpZ2h0T25lRGF0ZSA9IG1vbWVudChkYXRlcmVzdWx0KS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuICAgIGNyZWF0ZU1vZGVsVmlld1RvMkRhdGUoYXJncykge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIGxldCBjdXJyZW50RGF0ZSA9IHRoaXMuQ3VyRGF0ZTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGFydERhdGUpO1xuICAgICAgICBsZXQgb3B0aW9uczogTW9kYWxEaWFsb2dPcHRpb25zID0ge1xuICAgICAgICAgICAgdmlld0NvbnRhaW5lclJlZjogdGhpcy52Y1JlZixcbiAgICAgICAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgICAgICAgICBjdXJyZW50RGF0ZTogY3VycmVudERhdGUsXG4gICAgICAgICAgICAgICAgZGlzcGxheUhlYWRlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtaW5EYXRlOiBtb21lbnQobmV3IERhdGUoKSkuc3VidHJhY3QoMSwgJ3llYXJzJykudG9EYXRlKCkudG9EYXRlU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgbWF4RGF0ZTogbW9tZW50KG5ldyBEYXRlKCkpLmFkZCgyLCAneWVhcnMnKS50b0RhdGUoKS50b0RhdGVTdHJpbmcoKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bGxzY3JlZW46IGZhbHNlXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fbW9kYWxTZXJ2aWNlLnNob3dNb2RhbChEYXRlUGlja2VyTW9kYWwsIG9wdGlvbnMpXG4gICAgICAgICAgICAudGhlbigoZGF0ZXJlc3VsdDogRGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRlcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGF0ZSByZXN1bHQgXCIgKyBkYXRlcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGVyZXN1bHQudG9EYXRlU3RyaW5nKCkgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVG9GbGlnaHRUd29EYXRlID0gbW9tZW50KGRhdGVyZXN1bHQpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzZWxlY3RGcm9tRmxpZ2h0KCkge1xuICAgICAgICB0aGlzLklzRnJvbUZsaWdodCA9IHRydWU7XG4gICAgICAgIHRoaXMuSXNUb0ZsaWdodCA9IGZhbHNlO1xuICAgIH1cbiAgICBzZWxlY3RUb0ZsaWdodCgpIHtcbiAgICAgICAgdGhpcy5Jc0Zyb21GbGlnaHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5Jc1RvRmxpZ2h0ID0gdHJ1ZTtcbiAgICB9XG4gICAgc2VsZWN0TW9uZXRvcnlFbWQoKSB7XG4gICAgICAgIHRoaXMuSXNNb25ldG9yeUVtZCA9IHRydWU7XG4gICAgICAgIHRoaXMuSXNIb3RlbEVtZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLklzVHJhbnNwb3J0RW1kID0gZmFsc2U7XG4gICAgICAgIHRoaXMuSXNNZWFsRW1kID0gZmFsc2U7XG4gICAgfVxuICAgIHNlbGVjdEhvdGVsRW1kKCkge1xuICAgICAgICB0aGlzLklzTW9uZXRvcnlFbWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5Jc0hvdGVsRW1kID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5Jc1RyYW5zcG9ydEVtZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLklzTWVhbEVtZCA9IGZhbHNlO1xuICAgIH1cbiAgICBzZWxlY3RNZWFsRW1kKCkge1xuICAgICAgICB0aGlzLklzTW9uZXRvcnlFbWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5Jc0hvdGVsRW1kID0gZmFsc2U7XG4gICAgICAgIHRoaXMuSXNUcmFuc3BvcnRFbWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5Jc01lYWxFbWQgPSB0cnVlO1xuICAgIH1cbiAgICBzZWxlY3RUcmFuc3BvcnRFbWQoKSB7XG4gICAgICAgIHRoaXMuSXNNb25ldG9yeUVtZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLklzSG90ZWxFbWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5Jc1RyYW5zcG9ydEVtZCA9IHRydWU7XG4gICAgICAgIHRoaXMuSXNNZWFsRW1kID0gZmFsc2U7XG4gICAgfVxuICAgIG5hdmlnYXRlVG9Db21wZW5zYXRpb24oKSB7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJjb21wZW5zYXRpb25cIl0sIHtcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIHNhdmUoKSB7XG4gICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdC5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEuR2l2ZW5OYW1lID09IHRoaXMuUGF4SXRlbS5HaXZlbk5hbWUgJiYgZGF0YS5MYXN0TmFtZSA9PSB0aGlzLlBheEl0ZW0uTGFzdE5hbWUgJiYgZGF0YS5PcmRlcklkID09IHRoaXMuUGF4SXRlbS5PcmRlcklkKSB7XG4gICAgICAgICAgICAgICAgLy8gZGF0YS5SZWFjY29tRGV0YWlscyA9IFtdO1xuICAgICAgICAgICAgICAgIGRhdGEuUmVhY2NvbURldGFpbHMgPSBbbmV3IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5SZWFjY29tRGV0YWlsKCldO1xuICAgICAgICAgICAgICAgIGRhdGEuUmVhY2NvbURldGFpbHMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5Gcm9tRmxpZ2h0T25lTnVtYmVyICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gIHRoaXMuUGF4SXRlbS5SZWFjY29tRGV0YWlscyA9IFtuZXcgQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLlJlYWNjb21EZXRhaWwoKV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZS5Gcm9tVG9GbGFnID0gXCJGUk9NXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZS5HVUlEaXNwbGF5RmxhZyA9IFwiMVwiO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVnID0gbmV3IFJlZ0V4cCgnXlswLTldKiQnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlc3QgPSByZWcudGVzdCh0aGlzLkZyb21GbGlnaHRPbmVOdW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGVzdCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkZyb21GbGlnaHRPbmUuUmVhY2NvbUFpcmxpbmVDb2RlID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJjYXJyaWVyQ29kZVwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZS5SZWFjY29tRmxpZ2h0Tm8gPSB0aGlzLkZyb21GbGlnaHRPbmVOdW1iZXI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3RyaW5nQXJyOiBBcnJheTxzdHJpbmc+ID0gW11cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZ0FyciA9IHRoaXMuRnJvbUZsaWdodE9uZU51bWJlci5tYXRjaCgvW2EtekEtWl0rfFswLTldKy9nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXJyXCIgKyBKU09OLnN0cmluZ2lmeShzdHJpbmdBcnIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZS5SZWFjY29tQWlybGluZUNvZGUgPSBzdHJpbmdBcnJbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkZyb21GbGlnaHRPbmUuUmVhY2NvbUZsaWdodE5vID0gc3RyaW5nQXJyWzFdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZS5SZWFjY29tRmxpZ2h0RHQgPSB0aGlzLkZyb21GbGlnaHRPbmVEYXRlO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZsaWdodCBPbmU6XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLkZyb21GbGlnaHRPbmUpKTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5SZWFjY29tRGV0YWlscy5wdXNoKHRoaXMuRnJvbUZsaWdodE9uZSk7XG4gICAgICAgICAgICAgICAgfSBpZiAodGhpcy5Gcm9tRmxpZ2h0VHdvTnVtYmVyICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Gcm9tRmxpZ2h0VHdvLkZyb21Ub0ZsYWcgPSBcIkZST01cIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Gcm9tRmxpZ2h0VHdvLkdVSURpc3BsYXlGbGFnID0gXCIyXCI7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZWcgPSBuZXcgUmVnRXhwKCdeWzAtOV0qJCcpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGVzdCA9IHJlZy50ZXN0KHRoaXMuRnJvbUZsaWdodFR3b051bWJlcik7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodFR3by5SZWFjY29tQWlybGluZUNvZGUgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcImNhcnJpZXJDb2RlXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Gcm9tRmxpZ2h0VHdvLlJlYWNjb21GbGlnaHRObyA9IHRoaXMuRnJvbUZsaWdodFR3b051bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHJpbmdBcnI6IEFycmF5PHN0cmluZz4gPSBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nQXJyID0gdGhpcy5Gcm9tRmxpZ2h0VHdvTnVtYmVyLm1hdGNoKC9bYS16QS1aXSt8WzAtOV0rL2cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhcnJcIiArIEpTT04uc3RyaW5naWZ5KHN0cmluZ0FycikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Gcm9tRmxpZ2h0VHdvLlJlYWNjb21BaXJsaW5lQ29kZSA9IHN0cmluZ0FyclswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRnJvbUZsaWdodFR3by5SZWFjY29tRmxpZ2h0Tm8gPSBzdHJpbmdBcnJbMV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Gcm9tRmxpZ2h0VHdvLlJlYWNjb21GbGlnaHREdCA9IHRoaXMuRnJvbUZsaWdodFR3b0RhdGU7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuUmVhY2NvbURldGFpbHMucHVzaCh0aGlzLkZyb21GbGlnaHRUd28pO1xuICAgICAgICAgICAgICAgIH0gaWYgKHRoaXMuVG9GbGlnaHRPbmVOdW1iZXIgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlRvRmxpZ2h0T25lLkZyb21Ub0ZsYWcgPSBcIlRPXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVG9GbGlnaHRPbmUuR1VJRGlzcGxheUZsYWcgPSBcIjNcIjtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlZyA9IG5ldyBSZWdFeHAoJ15bMC05XSokJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZXN0ID0gcmVnLnRlc3QodGhpcy5Ub0ZsaWdodE9uZU51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVG9GbGlnaHRPbmUuUmVhY2NvbUFpcmxpbmVDb2RlID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJjYXJyaWVyQ29kZVwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVG9GbGlnaHRPbmUuUmVhY2NvbUZsaWdodE5vID0gdGhpcy5Ub0ZsaWdodE9uZU51bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHJpbmdBcnI6IEFycmF5PHN0cmluZz4gPSBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nQXJyID0gdGhpcy5Ub0ZsaWdodE9uZU51bWJlci5tYXRjaCgvW2EtekEtWl0rfFswLTldKy9nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXJyXCIgKyBKU09OLnN0cmluZ2lmeShzdHJpbmdBcnIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVG9GbGlnaHRPbmUuUmVhY2NvbUFpcmxpbmVDb2RlID0gc3RyaW5nQXJyWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodE9uZS5SZWFjY29tRmxpZ2h0Tm8gPSBzdHJpbmdBcnJbMV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodE9uZS5SZWFjY29tRmxpZ2h0RHQgPSB0aGlzLlRvRmxpZ2h0T25lRGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5SZWFjY29tRGV0YWlscy5wdXNoKHRoaXMuVG9GbGlnaHRPbmUpO1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLlBheEl0ZW0uUmVhY2NvbURldGFpbHMgPSBkYXRhLlJlYWNjb21EZXRhaWxzO1xuICAgICAgICAgICAgICAgIH0gaWYgKHRoaXMuVG9GbGlnaHRUd29OdW1iZXIgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlRvRmxpZ2h0VHdvLkZyb21Ub0ZsYWcgPSBcIlRPXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVG9GbGlnaHRUd28uR1VJRGlzcGxheUZsYWcgPSBcIjRcIjtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlZyA9IG5ldyBSZWdFeHAoJ15bMC05XSokJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZXN0ID0gcmVnLnRlc3QodGhpcy5Ub0ZsaWdodFR3b051bWJlcik7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVG9GbGlnaHRUd28uUmVhY2NvbUFpcmxpbmVDb2RlID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJjYXJyaWVyQ29kZVwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVG9GbGlnaHRUd28uUmVhY2NvbUZsaWdodE5vID0gdGhpcy5Ub0ZsaWdodFR3b051bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHJpbmdBcnI6IEFycmF5PHN0cmluZz4gPSBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nQXJyID0gdGhpcy5Ub0ZsaWdodFR3b051bWJlci5tYXRjaCgvW2EtekEtWl0rfFswLTldKy9nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXJyXCIgKyBKU09OLnN0cmluZ2lmeShzdHJpbmdBcnIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuVG9GbGlnaHRUd28uUmVhY2NvbUFpcmxpbmVDb2RlID0gc3RyaW5nQXJyWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodFR3by5SZWFjY29tRmxpZ2h0Tm8gPSBzdHJpbmdBcnJbMV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub0ZsaWdodFR3by5SZWFjY29tRmxpZ2h0RHQgPSB0aGlzLlRvRmxpZ2h0VHdvRGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5SZWFjY29tRGV0YWlscy5wdXNoKHRoaXMuVG9GbGlnaHRUd28pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLlBheEl0ZW0uUmVhY2NvbURldGFpbHMgPSBkYXRhLlJlYWNjb21EZXRhaWxzO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLlBheEl0ZW0uQ3VzdG9tZXJDYXJlQ2FzZU51bSAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuQ3VzdG9tZXJDYXJlQ2FzZU51bSA9IHRoaXMuUGF4SXRlbS5DdXN0b21lckNhcmVDYXNlTnVtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5QYXhJdGVtLldvcmxkVHJhY2VyTnVtICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5Xb3JsZFRyYWNlck51bSA9IHRoaXMuUGF4SXRlbS5Xb3JsZFRyYWNlck51bTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuUGF4SXRlbS5tb25ldGFyeWZyZWVUZXh0ICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5tb25ldGFyeWZyZWVUZXh0ID0gdGhpcy5QYXhJdGVtLm1vbmV0YXJ5ZnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLlBheEl0ZW0uaG90ZWxGcmVlVGV4dCAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuaG90ZWxGcmVlVGV4dCA9IHRoaXMuUGF4SXRlbS5ob3RlbEZyZWVUZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5QYXhJdGVtLmhvdGVsRGV0YWlscyAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuaG90ZWxEZXRhaWxzID0gdGhpcy5QYXhJdGVtLmhvdGVsRGV0YWlscztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuUGF4SXRlbS5tZWFsRnJlZVRleHQgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLm1lYWxGcmVlVGV4dCA9IHRoaXMuUGF4SXRlbS5tZWFsRnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLlBheEl0ZW0ubWVhbERldGFpbHMgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLm1lYWxEZXRhaWxzID0gdGhpcy5QYXhJdGVtLm1lYWxEZXRhaWxzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5QYXhJdGVtLnRyYW5zcG9ydEZyZWVUZXh0ICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS50cmFuc3BvcnRGcmVlVGV4dCA9IHRoaXMuUGF4SXRlbS50cmFuc3BvcnRGcmVlVGV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuUGF4SXRlbS50cmFuc3BvcnRFTUQgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLnRyYW5zcG9ydEVNRCA9IHRoaXMuUGF4SXRlbS50cmFuc3BvcnRFTUQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuUGF4SXRlbS5jb3B5VG9TZWxlY3RlZFBheCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0LmZvckVhY2goKHBheERhdGEsIHBheEluZGV4KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFBhc3Nlbmdlci5mb3JFYWNoKChzZWxkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBheERhdGEuR2l2ZW5OYW1lID09IHNlbGRhdGEuR2l2ZW5OYW1lICYmIHBheERhdGEuTGFzdE5hbWUgPT0gc2VsZGF0YS5MYXN0TmFtZSAmJiBwYXhEYXRhLk9yZGVySWQgPT0gc2VsZGF0YS5PcmRlcklkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5jb3B5VG9TZWxlY3RlZFBheCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5ob3RlbEZyZWVUZXh0ID0gdGhpcy5QYXhJdGVtLmhvdGVsRnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeWZyZWVUZXh0ID0gdGhpcy5QYXhJdGVtLm1vbmV0YXJ5ZnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsRnJlZVRleHQgPSB0aGlzLlBheEl0ZW0ubWVhbEZyZWVUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEudHJhbnNwb3J0RnJlZVRleHQgPSB0aGlzLlBheEl0ZW0udHJhbnNwb3J0RnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsRGV0YWlscyA9IHRoaXMuUGF4SXRlbS5tZWFsRGV0YWlscztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmhvdGVsRGV0YWlscyA9IHRoaXMuUGF4SXRlbS5ob3RlbERldGFpbHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS50cmFuc3BvcnRFTUQgPSB0aGlzLlBheEl0ZW0udHJhbnNwb3J0RU1EO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJAOlwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YS5SZWFjY29tRGV0YWlscykpO1xuICAgICAgICAgICAgaWYgKHRoaXMuUGF4SXRlbS5jb3B5VG9TZWxlY3RlZFBheFJlYWNjb20gPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdC5mb3JFYWNoKChwYXhEYXRhLCBwYXhJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKHNlbGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF4RGF0YS5HaXZlbk5hbWUgPT0gc2VsZGF0YS5HaXZlbk5hbWUgJiYgcGF4RGF0YS5MYXN0TmFtZSA9PSBzZWxkYXRhLkxhc3ROYW1lICYmIHBheERhdGEuT3JkZXJJZCA9PSBzZWxkYXRhLk9yZGVySWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmNvcHlUb1NlbGVjdGVkUGF4UmVhY2NvbSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJWOlwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YS5SZWFjY29tRGV0YWlscykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuUmVhY2NvbURldGFpbHMgPSB0aGlzLlBheEl0ZW0uUmVhY2NvbURldGFpbHM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc2hhcmVkLnNldENvbXBlbnNhdGlvblBheExpc3QodGhpcy5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KTtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZUJhY2soKTtcbiAgICB9XG4gICAgY2xlYXJGcm9tMUZsaWdodEluZm8oKSB7XG4gICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZU51bWJlciA9IFwiXCI7XG4gICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZS5SZWFjY29tQm9hcmRDaXR5Q2QgPSBcIlwiO1xuICAgICAgICB0aGlzLkZyb21GbGlnaHRPbmUuUmVhY2NvbU9mZkNpdHlDZCA9IFwiXCI7XG4gICAgICAgIHRoaXMuRnJvbUZsaWdodE9uZURhdGUgPSBcIlwiO1xuICAgIH1cbiAgICBjbGVhckZyb20yRmxpZ2h0SW5mbygpIHtcbiAgICAgICAgdGhpcy5Gcm9tRmxpZ2h0VHdvTnVtYmVyID0gXCJcIjtcbiAgICAgICAgdGhpcy5Gcm9tRmxpZ2h0VHdvLlJlYWNjb21Cb2FyZENpdHlDZCA9IFwiXCI7XG4gICAgICAgIHRoaXMuRnJvbUZsaWdodFR3by5SZWFjY29tT2ZmQ2l0eUNkID0gXCJcIjtcbiAgICAgICAgdGhpcy5Gcm9tRmxpZ2h0VHdvRGF0ZSA9IFwiXCI7XG4gICAgfVxuICAgIGNsZWFyVG8xRmxpZ2h0SW5mbygpIHtcbiAgICAgICAgdGhpcy5Ub0ZsaWdodE9uZU51bWJlciA9IFwiXCI7XG4gICAgICAgIHRoaXMuVG9GbGlnaHRPbmUuUmVhY2NvbUJvYXJkQ2l0eUNkID0gXCJcIjtcbiAgICAgICAgdGhpcy5Ub0ZsaWdodE9uZS5SZWFjY29tT2ZmQ2l0eUNkID0gXCJcIjtcbiAgICAgICAgdGhpcy5Ub0ZsaWdodE9uZURhdGUgPSBcIlwiO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlKHRoaXMuVG9GbGlnaHRPbmVOdW1iZXIsMSlcbiAgICB9XG4gICAgY2xlYXJUbzJGbGlnaHRJbmZvKCkge1xuICAgICAgICB0aGlzLlRvRmxpZ2h0VHdvTnVtYmVyID0gXCJcIjtcbiAgICAgICAgdGhpcy5Ub0ZsaWdodFR3by5SZWFjY29tQm9hcmRDaXR5Q2QgPSBcIlwiO1xuICAgICAgICB0aGlzLlRvRmxpZ2h0VHdvLlJlYWNjb21PZmZDaXR5Q2QgPSBcIlwiO1xuICAgICAgICB0aGlzLlRvRmxpZ2h0VHdvRGF0ZSA9IFwiXCI7XG4gICAgfVxuICAgIG5hdmlnYXRlQmFjaygpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLmJhY2soKTtcbiAgICB9XG4gICAgbmF2aWdhdGVUb1NldHRpbmcoKSB7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZXR0aW5nXCJdLCB7XG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbmF2aWdhdGVUb1NlYXJjaCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNDaGVja2luRGlzYWJsZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcInNlYXJjaFwiXSwge1xuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIG5hdmlnYXRlVG9EZXBhcnR1cmVzKCkge1xuICAgICAgICBpZiAodGhpcy5pc0dhdGVEaXNhYmxlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiZGVwYXJ0aG9tZVwiXSwge1xuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlU2VydmljZUVycm9yKGVycm9yOiBhbnkpIHtcbiAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IGVycm9yLnRvU3RyaW5nKCk7XG4gICAgICAgIGlmIChlcnJvck1lc3NhZ2UuaW5kZXhPZihcIlNlc3Npb25UaW1lb3V0XCIpID4gLTEpIHtcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBcIlNlc3Npb24gVGltZSBPdXRcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIllvdXIgc2Vzc2lvbiBoYXMgYmVlbiB0aW1lIG91dFwiLFxuICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPS1wiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGlhbG9ncy5hbGVydChvcHRpb25zKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiXCJdLCB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGVycm9yTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19