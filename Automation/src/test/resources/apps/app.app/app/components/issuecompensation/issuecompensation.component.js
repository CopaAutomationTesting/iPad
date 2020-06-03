"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var page_1 = require("ui/page");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var dialogs = require("ui/dialogs");
var timer = require("timer");
//external modules and plugins
var ApplicationSettings = require("application-settings");
var moment = require("moment");
var Toast = require("nativescript-toast");
//app references
var index_1 = require("../../shared/interface/index");
var index_2 = require("../../shared/services/index");
var index_3 = require("../../shared/utils/index");
var app_executiontime_1 = require("../../app.executiontime");
var app_constants_1 = require("../../app.constants");
var IssueCompensationComponent = /** @class */ (function () {
    function IssueCompensationComponent(_configuration, _services, activatedRouter, _shared, page, routerExtensions, router, _dataService, _service, route, vcRef, _modalService) {
        this._configuration = _configuration;
        this._services = _services;
        this.activatedRouter = activatedRouter;
        this._shared = _shared;
        this.page = page;
        this.routerExtensions = routerExtensions;
        this.router = router;
        this._dataService = _dataService;
        this._service = _service;
        this.route = route;
        this.vcRef = vcRef;
        this._modalService = _modalService;
        this.CompensationPassengerList = [];
        this.FlightInfoNotSet = false;
        this.FlightHeaderInfo = new index_1.CompensationSearchModule.FlightModel();
        this.IssueCompensationResponse = [];
        this.IssueCompensationPaxList = [];
        this.IssueCompensationFullPaxList = [];
        this.SelectedPassenger = [];
        this.SearchCriteria = "Name";
        this.PassengerFliterCriteria = "All Passengers";
        this.IsPaxReasonSelected = false;
        this.MonetraryEmpty = false;
        this.Monetarydirty = false;
        this.hotelEmpty = false;
        this.hoteldirty = false;
        this.mealEmpty = false;
        this.isPrevDaySalesReportNotClosed = false;
        // public IsEditEnabled : boolean = false;
        this.ValidMonetary = [];
        this.ValidHotel = [];
        this.ValidMeal = [];
        this.Validtransport = [];
        this.TotalPassengerCount = 0;
        this.selectedPassengerCount = 0;
        this.mealdirty = false;
        this.SelectAllPax = false;
        this.SelectAllPaxVar = false;
        this.CopySelected = false;
        this.transportEmpty = false;
        this.transportdirty = false;
        this.isOverrideReasonBlank = false;
        this.SelectedPaxcount = 0;
        this.IsEditable = false;
        this.copyToAllPax = false;
        this.IsHeaderInfo = false;
        this.IsFlightInfo = false;
        this.totalMonetary = 0;
        this.totalHotel = 0;
        this.totalMeal = 0;
        this.totalTransport = 0;
        this.isButtonEnabled = false;
        this.IsLabelField = true;
        this.nameSortIndicator = -1;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.selectedEMDs = 0;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.CompensationOrderDetails = [];
        this.loaderProgress = new index_1.LoaderProgress();
    }
    IssueCompensationComponent_1 = IssueCompensationComponent;
    IssueCompensationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
        console.log("Flight" + JSON.stringify(this.FlightHeaderInfo));
        this.IssueCompensationResponse = this._shared.getCompensationPaxList();
        this.loaderProgress.initLoader(this.pageCont);
        this.IssueCompensationPaxList = this.IssueCompensationResponse;
        this.IssueCompensationFullPaxList = this.IssueCompensationPaxList;
        this.IssueCompensationPaxList.forEach(function (data, index) {
            _this.totalMonetary = _this.totalMonetary + data.monetary;
            _this.totalHotel += data.hotel;
            _this.totalMeal += data.meal;
            _this.totalTransport += data.transportation;
            _this.ValidMonetary.push(false);
            _this.ValidHotel.push(false);
            _this.ValidMeal.push(false);
            _this.Validtransport.push(false);
            // this.BREInitialMonetaryValue = data.monetary;
            // this.BREInitialHotelValue = data.hotel;
            // this.BREInitialMealValue = data.meal;
            // this.BREInitialTransportValue = data.transportation;
        });
        this.TotalPassengerCount = this.IssueCompensationPaxList.length;
        this.isButtonEnabled = true;
        this.activatedRouter.queryParams.subscribe(function (params) {
            _this.PreviousPage = params["prepage"];
            _this.OrderId = params["data"];
            console.log("v" + JSON.stringify(_this.OrderId));
        });
        console.log("v" + JSON.stringify(this.OrderId));
        console.log("r" + JSON.stringify(this.PreviousPage));
        if (this.PreviousPage == "OrderId") {
            this.IsHeaderInfo = true;
            this.IsFlightInfo = false;
            this.CompensationOrderDetails = this._shared.getCompensationOrderDeatils();
            console.log("V" + JSON.stringify(this.CompensationOrderDetails));
        }
        else {
            this.IsHeaderInfo = false;
            this.IsFlightInfo = true;
        }
        this.IssueCompensationPaxList.forEach(function (data, index) { data.IsSelected = false; });
        if (this.FlightHeaderInfo == null || this.FlightHeaderInfo == undefined) {
            console.log("flag");
            this.FlightInfoNotSet = true;
        }
        this.getSalesReport();
    };
    IssueCompensationComponent.prototype.getSalesReport = function () {
        var _this = this;
        this.loaderProgress.showLoader();
        this._service.getSaleOfficeReport().subscribe(function (data) {
            console.log("Sales report:" + JSON.stringify(data));
            if (data.HasOpenPastDueSalesReports) {
                _this.isPrevDaySalesReportNotClosed = true;
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
    IssueCompensationComponent.prototype.editable = function () {
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
            this.IsEditable = true;
            this.IsLabelField = false;
            console.log("Edit: " + this.IsEditable);
            console.log("Done:" + this.IsLabelField);
        }
    };
    IssueCompensationComponent.prototype.filter = function (args) {
        console.log("Name:" + JSON.stringify(args));
        // this.CompensationPassengerList = this.CompensationFullPaxList;
        this.IssueCompensationPaxList = this.IssueCompensationFullPaxList;
        if (this.SearchCriteria == "Name") {
            if (args) {
                var name_1 = args.toString().toUpperCase();
                this.IssueCompensationPaxList = this.IssueCompensationPaxList.filter(function (r) { return r.GivenName.indexOf(name_1.trim()) >= 0 || r.LastName.indexOf(name_1.trim()) >= 0; });
            }
            else {
                this.IssueCompensationPaxList = this.IssueCompensationFullPaxList;
            }
        }
        else if (this.SearchCriteria == "Order ID") {
            if (args) {
                var name_2 = args.toString().toUpperCase();
                this.IssueCompensationPaxList = this.IssueCompensationPaxList.filter(function (r) { return r.OrderId.indexOf(name_2.trim()) >= 0; });
            }
            else {
                this.IssueCompensationPaxList = this.IssueCompensationFullPaxList;
            }
        }
        else {
            if (args) {
                var name_3 = args.toString().toUpperCase();
                this.IssueCompensationPaxList = this.IssueCompensationPaxList.filter(function (r) { return r.Cabin.indexOf(name_3.trim()) >= 0; });
            }
            else {
                this.IssueCompensationPaxList = this.IssueCompensationFullPaxList;
            }
        }
        this.TotalPassengerCount = this.IssueCompensationPaxList.length;
        if (this.SelectedPassenger.length == this.IssueCompensationFullPaxList.length) {
            this.SelectAllPax = true;
        }
        else {
            this.SelectAllPax = false;
        }
    };
    IssueCompensationComponent.prototype.displayProductActionDialogForSmartFilter = function () {
        var _this = this;
        var options = {
            title: "Smart filter option",
            cancelButtonText: "Cancel",
            actions: ["Name", "Order ID", "Class"],
        };
        dialogs.action(options).then(function (result) {
            if (result != "Cancel") {
                _this.SearchCriteria = result;
            }
        });
    };
    IssueCompensationComponent.prototype.displayDialogForFliterPassengerType = function () {
        var _this = this;
        var options = {
            title: "Passenger type filter",
            cancelButtonText: "Cancel",
            actions: ["All Passengers", "ETKT Passengers", "Checked-In Passengers", "Not Checked-In Passengers"],
        };
        dialogs.action(options).then(function (result) {
            if (result != "Cancel") {
                _this.PassengerFliterCriteria = result;
            }
        });
    };
    IssueCompensationComponent.prototype.done = function () {
        var _this = this;
        if (this.isButtonEnabled == true) {
            this.selectedEMDs = 0;
            this.isOverrideReasonBlank = false;
            this.SelectedPassenger.forEach(function (data, Index) {
                if (data.isMonetaryOverridden == true && data.MonetaryOverrideReason == "") {
                    _this.isOverrideReasonBlank = true;
                    _this.overidereasonformonetary(data, 1);
                }
                else if (data.isHotelOverridden == true && data.HotelOverrideReason == "") {
                    _this.isOverrideReasonBlank = true;
                    _this.overidereasonforhotel(data, 1);
                }
                else if (data.isMealOverridden == true && data.MealOverrideReason == "") {
                    _this.isOverrideReasonBlank = true;
                    _this.overidereasonformeal(data, 1);
                }
                else if (data.isTransportOverridden == true && data.TransportOverrideReason == "") {
                    _this.isOverrideReasonBlank = true;
                    _this.overidereasonfortransport(data, 1);
                }
                if (!_this.isOverrideReasonBlank) {
                    _this.IsEditable = false;
                    _this.IsLabelField = true;
                }
                console.log("count:" + JSON.stringify(_this.selectedEMDs));
                if (data.monetary) {
                    _this.selectedEMDs = _this.selectedEMDs + Number(data.hotel) + Number(data.meal) + Number(data.transportation) + 1;
                }
                else {
                    _this.selectedEMDs = _this.selectedEMDs + Number(data.hotel) + Number(data.meal) + Number(data.transportation);
                }
                if (_this.selectedEMDs > IssueCompensationComponent_1.MaxEMDIssued) {
                    data.IsSelected = false;
                    // this.SelectedPassenger.splice(this.SelectedPassenger.indexOf(data), 1)
                }
            });
            this.SelectedPassenger = [];
            this.IssueCompensationPaxList.forEach(function (paxData, Index) {
                if (paxData.IsSelected) {
                    _this.SelectedPassenger.push(paxData);
                }
            });
            this.selectedEMDs = 0;
            this.SelectedPassenger.forEach(function (data, Index) {
                if (data.monetary) {
                    _this.selectedEMDs = _this.selectedEMDs + Number(data.hotel) + Number(data.meal) + Number(data.transportation) + 1;
                }
                else {
                    _this.selectedEMDs = _this.selectedEMDs + Number(data.hotel) + Number(data.meal) + Number(data.transportation);
                }
            });
            this.SelectedPaxcount = this.SelectedPassenger.length;
            console.dir(this.SelectedPassenger);
            console.log("Edit: " + this.IsEditable);
            console.log("Done:" + this.IsLabelField);
        }
    };
    IssueCompensationComponent.prototype.continueEnabled = function () {
        var _this = this;
        // console.log("Button :" + JSON.stringify( this.IsPaxReasonSelected));
        var isInEligiblePaxSelected = false;
        if (this.SelectedPassenger && this.SelectedPassenger.length == 0) {
            this.IsPaxReasonSelected = false;
        }
        else {
            // this.IsPaxReasonSelected = true;
            if (this.IsEditable == true) {
                this.IsPaxReasonSelected = false;
            }
            else {
                this.SelectedPassenger.forEach(function (data, index) {
                    if (data.monetary == 0 && data.hotel == 0 && data.meal == 0 && data.transportation == 0) {
                        isInEligiblePaxSelected = true;
                        _this.IsPaxReasonSelected = false;
                    }
                    else {
                        _this.IsPaxReasonSelected = true;
                    }
                });
            }
        }
        if (this.IsPaxReasonSelected && !this.isPrevDaySalesReportNotClosed && !isInEligiblePaxSelected) {
            return true;
        }
        else
            return false;
    };
    IssueCompensationComponent.prototype.isEditEnabled = function () {
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
            return true;
        }
        else
            return false;
    };
    IssueCompensationComponent.prototype.toggleChecked = function (pax) {
        var _this = this;
        console.log("Count:" + this.selectedEMDs);
        if (this.IsLabelField == true) {
            if (pax.IsSelected == false) {
                this.selectedEMDs = 0;
                this.SelectedPassenger.forEach(function (data, Index) {
                    if (data.monetary) {
                        _this.selectedEMDs += Number(data.hotel) + Number(data.meal) + Number(data.transportation) + 1;
                    }
                    else {
                        _this.selectedEMDs += Number(data.hotel) + Number(data.meal) + Number(data.transportation);
                    }
                });
                console.log("countEMD:" + JSON.stringify(this.selectedEMDs));
                console.dir(this.SelectedPassenger);
                if (pax.monetary == 0 && pax.hotel == 0 && pax.meal == 0 && pax.transportation == 0) {
                    pax.IsSelected = true;
                    this.SelectedPassenger.push(pax);
                    Toast.makeText("Ineligible Passenger(s) is selected.").show();
                }
                else {
                    if (pax.monetary) {
                        if ((this.selectedEMDs + Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation) + 1) <= IssueCompensationComponent_1.MaxEMDIssued) {
                            pax.IsSelected = true;
                            this.SelectedPassenger.push(pax);
                            this.selectedEMDs += Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation) + 1;
                        }
                    }
                    else {
                        if ((this.selectedEMDs + Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation)) <= IssueCompensationComponent_1.MaxEMDIssued) {
                            pax.IsSelected = true;
                            this.SelectedPassenger.push(pax);
                            this.selectedEMDs += Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation);
                        }
                    }
                }
                if (this.IssueCompensationFullPaxList.length === this.SelectedPassenger.length)
                    this.SelectAllPax = true;
            }
            else {
                this.SelectedPassenger.splice(this.SelectedPassenger.indexOf(pax), 1);
                // if (pax.monetary) {
                //     this.selectedEMDs = this.selectedEMDs - (Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation) + 1);
                // } else {
                //     this.selectedEMDs = this.selectedEMDs - (Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation));
                // }
                this.selectedEMDs = 0;
                this.SelectedPassenger.forEach(function (data, Index) {
                    if (pax.monetary) {
                        _this.selectedEMDs += Number(data.hotel) + Number(data.meal) + Number(data.transportation) + 1;
                    }
                    else {
                        _this.selectedEMDs += Number(data.hotel) + Number(data.meal) + Number(data.transportation);
                    }
                });
                console.log("countEMD:" + JSON.stringify(this.selectedEMDs));
                pax.CompensationReason = "";
                pax.IsSelected = false;
                this.SelectAllPax = false;
            }
        }
        this.SelectedPaxcount = this.SelectedPassenger.length;
        this.selectedPassengerCount = this.SelectedPassenger.length;
        console.log("Count1:" + this.selectedEMDs);
        console.log(this.SelectedPassenger);
    };
    IssueCompensationComponent.prototype.issueCompensationConfirmation = function () {
        var _this = this;
        dialogs.confirm(IssueCompensationComponent_1.ISSUECOMPENSATIONTOAST).then(function (result) {
            console.log("Dialog result: " + result);
            if (result) {
                _this.issueCompensation();
            }
        });
    };
    IssueCompensationComponent.prototype.issueCompensationForOrderIdConfirmation = function () {
        var _this = this;
        dialogs.confirm(IssueCompensationComponent_1.ISSUECOMPENSATIONTOAST).then(function (result) {
            console.log("Dialog result: " + result);
            if (result) {
                _this.issueCompensationForOrderId();
            }
        });
    };
    IssueCompensationComponent.prototype.onChangeForAmount = function (args, index, field, item) {
        var _this = this;
        if (this.IsEditable == true) {
            this.MonetraryEmpty = false;
            if (field == "") {
                this.MonetraryEmpty = true;
                this.ValidMonetary[index] = true;
            }
            else {
                this.MonetraryEmpty = false;
                this.Monetarydirty = true;
                this.ValidMonetary[index] = false;
            }
            var reg = new RegExp(/^[0-9]+$/);
            var test = reg.test(field);
            // console.log("flightnum" + test);
            if (test == false) {
                if (field != "") {
                    this.ValidMonetary[index] = true;
                    Toast.makeText(IssueCompensationComponent_1.NUMBERVALIDATIONTOAST).show();
                    this.isButtonEnabled = false;
                    this.MonetraryEmpty = true;
                }
                else {
                    this.isButtonEnabled = false;
                    this.ValidMonetary[index] = true;
                }
            }
            else {
                this.MonetraryEmpty = false;
                this.isButtonEnabled = true;
                this.ValidMonetary[index] = false;
                this.SelectedMonetary = field;
                if (item.monetaryInitialValue != field) {
                    item.isMonetaryOverridden = true;
                }
                else {
                    item.isMonetaryOverridden = false;
                    item.MonetaryOverrideReason = "";
                    item.monetaryTempValue = field;
                    this.totalMonetary = 0;
                    this.totalHotel = 0;
                    this.totalMeal = 0;
                    this.totalTransport = 0;
                    this.IssueCompensationPaxList.forEach(function (data, index) {
                        _this.totalMonetary += Number(data.monetary);
                        _this.totalHotel += Number(data.hotel);
                        _this.totalMeal += Number(data.meal);
                        _this.totalTransport += Number(data.transportation);
                    });
                }
            }
            if (field > item.monetaryHigherLimit || field < item.monetaryLowerLimit) {
                if (field != 0) {
                    this.MonetraryEmpty = true;
                    this.isButtonEnabled = false;
                    this.ValidMonetary[index] = true;
                    this.IsPaxReasonSelected = false;
                    if (item.monetaryLowerLimit == 0 && item.monetaryHigherLimit == 0) {
                        var id = timer.setTimeout(function () {
                            item.monetary = 0;
                        }, 1000);
                        Toast.makeText(IssueCompensationComponent_1.COMPENSATIONNATOAST).show();
                    }
                    else {
                        Toast.makeText(IssueCompensationComponent_1.MUSTBETOAST + item.monetaryLowerLimit + " to " + item.monetaryHigherLimit).show();
                    }
                }
            }
            // console.log("V:" + JSON.stringify(this.MonetraryEmpty));
            // console.log("R:" + JSON.stringify(this.Monetarydirty));
            // }// item.IsSelected = true;
        }
    };
    IssueCompensationComponent.prototype.onChangeForHotel = function (args, index, field, item) {
        var _this = this;
        if (this.IsEditable == true) {
            this.hotelEmpty = false;
            if (field == "") {
                this.hotelEmpty = true;
                this.ValidHotel[index] = true;
            }
            else {
                this.hotelEmpty = false;
                this.hoteldirty = true;
                this.ValidHotel[index] = false;
            }
            var reg = new RegExp(/^[0-9]+$/);
            var test = reg.test(field);
            // console.log("flightnum" + test);
            if (test == false) {
                if (field != "") {
                    Toast.makeText(IssueCompensationComponent_1.NUMBERVALIDATIONTOAST).show();
                    this.isButtonEnabled = false;
                    this.ValidHotel[index] = true;
                    this.hotelEmpty = true;
                }
                else {
                    this.isButtonEnabled = false;
                    this.ValidHotel[index] = true;
                }
            }
            else {
                this.hotelEmpty = false;
                this.isButtonEnabled = true;
                this.ValidHotel[index] = false;
                this.SelctedHotel = field;
                if (item.hotelInitialValue != field) {
                    item.isHotelOverridden = true;
                }
                else {
                    item.isHotelOverridden = false;
                    item.HotelOverrideReason = "";
                    item.hotelTempValue = field;
                    this.totalMonetary = 0;
                    this.totalHotel = 0;
                    this.totalMeal = 0;
                    this.totalTransport = 0;
                    this.IssueCompensationPaxList.forEach(function (data, index) {
                        _this.totalMonetary += Number(data.monetary);
                        _this.totalHotel += Number(data.hotel);
                        _this.totalMeal += Number(data.meal);
                        _this.totalTransport += Number(data.transportation);
                    });
                }
            }
            if (field > item.hotelHigherLimit || field < item.hotelLowerLimit) {
                if (field != 0) {
                    this.hotelEmpty = true;
                    this.isButtonEnabled = false;
                    this.ValidHotel[index] = true;
                    this.IsPaxReasonSelected = false;
                    if (item.hotelLowerLimit == 0 && item.hotelHigherLimit == 0) {
                        var id = timer.setTimeout(function () {
                            item.hotel = 0;
                        }, 1000);
                        Toast.makeText(IssueCompensationComponent_1.COMPENSATIONNATOAST).show();
                    }
                    else {
                        Toast.makeText(IssueCompensationComponent_1.MUSTBETOAST + item.hotelLowerLimit + " to " + item.hotelHigherLimit).show();
                    }
                }
            }
        }
    };
    IssueCompensationComponent.prototype.onChangeForMeal = function (args, index, field, item) {
        var _this = this;
        if (this.IsEditable == true) {
            this.mealEmpty = false;
            if (field == "") {
                this.mealEmpty = true;
                this.ValidMeal[index] = true;
            }
            else {
                this.mealEmpty = false;
                this.mealdirty = true;
                this.ValidMeal[index] = false;
            }
            var reg = new RegExp(/^[0-9]+$/);
            var test = reg.test(field);
            // console.log("flightnum" + test);
            if (test == false) {
                if (field != "") {
                    Toast.makeText(IssueCompensationComponent_1.NUMBERVALIDATIONTOAST).show();
                    this.isButtonEnabled = false;
                    this.ValidMeal[index] = true;
                    this.mealEmpty = true;
                }
                else {
                    this.isButtonEnabled = false;
                    this.ValidMeal[index] = true;
                }
            }
            else {
                this.mealEmpty = false;
                this.isButtonEnabled = true;
                this.ValidMeal[index] = false;
                this.SelectedMeal = field;
                if (item.mealInitialValue != field) {
                    item.isMealOverridden = true;
                }
                else {
                    item.isMealOverridden = false;
                    item.MealOverrideReason = "";
                    item.mealTempValue = field;
                    this.totalMonetary = 0;
                    this.totalHotel = 0;
                    this.totalMeal = 0;
                    this.totalTransport = 0;
                    this.IssueCompensationPaxList.forEach(function (data, index) {
                        _this.totalMonetary += Number(data.monetary);
                        _this.totalHotel += Number(data.hotel);
                        _this.totalMeal += Number(data.meal);
                        _this.totalTransport += Number(data.transportation);
                    });
                }
            }
            if (field > item.mealHigherLimit || field < item.mealLowerLimit) {
                if (field != 0) {
                    this.mealEmpty = true;
                    this.isButtonEnabled = false;
                    this.ValidMeal[index] = true;
                    this.IsPaxReasonSelected = false;
                    if (item.mealLowerLimit == 0 && item.mealHigherLimit == 0) {
                        var id = timer.setTimeout(function () {
                            item.meal = 0;
                        }, 1000);
                        Toast.makeText(IssueCompensationComponent_1.COMPENSATIONNATOAST).show();
                    }
                    else {
                        Toast.makeText(IssueCompensationComponent_1.MUSTBETOAST + item.mealLowerLimit + " to " + item.mealHigherLimit).show();
                    }
                }
            }
        }
    };
    IssueCompensationComponent.prototype.onChangeForTransport = function (args, index, field, item) {
        var _this = this;
        if (this.IsEditable == true) {
            this.transportEmpty = false;
            if (field == "") {
                this.transportEmpty = true;
                this.Validtransport[index] = true;
            }
            else {
                this.transportEmpty = false;
                this.transportdirty = true;
                this.Validtransport[index] = false;
            }
            var reg = new RegExp(/^[0-9]+$/);
            var test = reg.test(field);
            // console.log("flightnum" + test);
            if (test == false) {
                if (field != "") {
                    Toast.makeText(IssueCompensationComponent_1.NUMBERVALIDATIONTOAST).show();
                    this.isButtonEnabled = false;
                    this.Validtransport[index] = true;
                    this.transportEmpty = true;
                }
                else {
                    this.isButtonEnabled = false;
                    this.Validtransport[index] = true;
                }
            }
            else {
                this.transportEmpty = false;
                this.isButtonEnabled = true;
                this.Validtransport[index] = false;
                this.SelectedTransport = field;
                if (item.transportationInitialValue != field) {
                    item.isTransportOverridden = true;
                }
                else {
                    item.isTransportOverridden = false;
                    item.TransportOverrideReason = "";
                    item.transportationTempValue = field;
                    this.totalMonetary = 0;
                    this.totalHotel = 0;
                    this.totalMeal = 0;
                    this.totalTransport = 0;
                    this.IssueCompensationPaxList.forEach(function (data, index) {
                        _this.totalMonetary += Number(data.monetary);
                        _this.totalHotel += Number(data.hotel);
                        _this.totalMeal += Number(data.meal);
                        _this.totalTransport += Number(data.transportation);
                    });
                }
            }
            if (field > item.transportationHigherLimit || field < item.transportationLowerLimit) {
                if (field != 0) {
                    this.transportEmpty = true;
                    this.isButtonEnabled = false;
                    this.IsPaxReasonSelected = false;
                    this.Validtransport[index] = true;
                    if (item.transportationLowerLimit == 0 && item.transportationHigherLimit == 0) {
                        var id = timer.setTimeout(function () {
                            item.transportation = 0;
                        }, 1000);
                        Toast.makeText(IssueCompensationComponent_1.COMPENSATIONNATOAST).show();
                    }
                    else {
                        Toast.makeText(IssueCompensationComponent_1.MUSTBETOAST + item.transportationLowerLimit + " to " + item.transportationHigherLimit).show();
                    }
                }
            }
        }
    };
    IssueCompensationComponent.prototype.issueCompensation = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
            var startDate = new Date();
            var CurDate = moment(startDate).format("YYYY-MM-DD");
            console.log(CurDate);
            var agentProfile = this._shared.GetUserProfile();
            var IssueCompensationStructure = index_3.Converters.convertToIssueCompensation(this.SelectedPassenger, this.FlightHeaderInfo, CurDate, agentProfile);
            console.log("IssueCompensation Req:" + JSON.stringify(IssueCompensationStructure));
            this._service.PostIssueCompensations(IssueCompensationStructure).subscribe(function (data) {
                console.log("IssueCompensation Res:" + JSON.stringify(data));
                if (data.BadRequest != 400) {
                    if (data.Results) {
                        var IssueCompensationResponse = index_3.Converters.convertToIssueCompensationResponse(data, _this.IssueCompensationFullPaxList);
                        _this._shared.setCompensationPaxList(IssueCompensationResponse);
                        _this.navigatetoissuecompensation();
                        _this.loaderProgress.hideLoader();
                        Toast.makeText(data.Errors[0].Message).show();
                        Toast.makeText(data.Warnings[0].Message).show();
                    }
                    else {
                        Toast.makeText(data.Errors[0].Message).show();
                        _this.loaderProgress.hideLoader();
                    }
                }
                else {
                    Toast.makeText(data.errMessage).show();
                    _this.loaderProgress.hideLoader();
                }
            }, function (err) {
                // var flightDate =  moment(this.FlightHeaderInfo.DepartureDate).format("YYYY-MM-DD");;
                // var flightNumber =this.FlightHeaderInfo.FlightNumber;
                // var AgentLocation = ApplicationSettings.getString("SearchLocation","");
                // var PaxType= "Compensation List";
                // console.log(flightDate);
                // console.log(flightNumber);
                // console.log(AgentLocation);
                // console.log(PaxType);
                // this.getCompensationList(flightDate, flightNumber, AgentLocation, PaxType);
                console.log("Couldnt find information" + err);
                _this.handleServiceError(err);
                _this.loaderProgress.hideLoader();
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    };
    IssueCompensationComponent.prototype.getCompensationList = function (date, flight, location, paxtype) {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetPassengerType Service --------------- Start Date Time : ' + sDate);
            this._service.getCompensationPaxList(date, flight, location, paxtype).subscribe(function (data) {
                if (data.Results) {
                    if (data.Results[0].FlightSegments[0].Passengers == null) {
                        Toast.makeText("Network Error").show();
                        _this.loaderProgress.hideLoader();
                        // this.clear();
                    }
                    else {
                        var IssueCompensationResponse = index_3.Converters.convertToIssueCompensationResponse(data, _this.IssueCompensationFullPaxList);
                        _this._shared.setCompensationPaxList(IssueCompensationResponse);
                        _this.navigatetoissuecompensation();
                        _this.loaderProgress.hideLoader();
                        // this.flightStatusForCompensationList(CompansationDetails);
                    }
                }
                else {
                    if (data.Errors[0].Message == "Data not found") {
                        Toast.makeText("No passenger found").show();
                    }
                    else {
                        Toast.makeText(data.Errors[0].Message).show();
                    }
                    _this.loaderProgress.hideLoader();
                }
            }, function (err) {
                console.log("Couldnt find information" + err);
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
            console.log('Get GetPassengerType Service --------------- End Date Time : ' + eDate);
            console.log('Get GetPassengerType Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    IssueCompensationComponent.prototype.sortBasedOnPaxName = function () {
        var isAsc = this.nameSortIndicator == 0 ? 1 : 0;
        this.nameSortIndicator = this.nameSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.IssueCompensationPaxList.sort(function (a, b) {
            var val1 = a.FullName;
            var val2 = b.FullName;
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
    IssueCompensationComponent.prototype.sortBasedOnSSR = function () {
        var isAsc = this.ssrSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = this.ssrSortIndicator == 0 ? 1 : 0;
        this.nameSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.IssueCompensationPaxList.sort(function (a, b) {
            var val1 = a.SSR;
            var val2 = b.SSR;
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
    IssueCompensationComponent.prototype.sortBasedOnTier = function () {
        var isAsc = this.tierSortIndicator == 0 ? 1 : 0;
        this.tierSortIndicator = this.tierSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.nameSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.IssueCompensationPaxList.sort(function (a, b) {
            var val1 = a.Tier;
            var val2 = b.Tier;
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
    IssueCompensationComponent.prototype.sortBasedOnClass = function () {
        var isAsc = this.classSortIndicator == 0 ? 1 : 0;
        this.classSortIndicator = this.classSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.nameSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.IssueCompensationPaxList.sort(function (a, b) {
            var val1 = a.Cabin;
            var val2 = b.Cabin;
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
    IssueCompensationComponent.prototype.sortBasedOnOrderId = function () {
        var isAsc = this.orderIdSortIndicator == 0 ? 1 : 0;
        this.orderIdSortIndicator = this.orderIdSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.nameSortIndicator = -1;
        this.IssueCompensationPaxList.sort(function (a, b) {
            var val1 = a.OrderId;
            var val2 = b.OrderId;
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
    IssueCompensationComponent.prototype.issueCompensationForOrderId = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
            var startDate = new Date();
            var CurDate = moment(startDate).format("YYYY-MM-DD");
            console.log(CurDate);
            var IssueCompensationStructure = index_3.Converters.convertToIssueCompensationForOrderId(this.CompensationOrderDetails, this.SelectedPassenger, this.FlightHeaderInfo, CurDate);
            console.log("IssueCompensation Req:" + JSON.stringify(IssueCompensationStructure));
            this._service.PostIssueCompensations(IssueCompensationStructure).subscribe(function (data) {
                console.log("IssueCompensation Res:" + JSON.stringify(data));
                if (data.BadRequest != 400) {
                    if (data.Results) {
                        var IssueCompensationResponse = index_3.Converters.convertToIssueCompensationResponse(data, _this.SelectedPassenger);
                        _this._shared.setCompensationPaxList(IssueCompensationResponse);
                        _this.navigatetoissuecompensationForOrderId();
                        _this.loaderProgress.hideLoader();
                        Toast.makeText(data.Errors[0].Message).show();
                    }
                    else {
                        Toast.makeText(data.Errors[0].Message).show();
                        _this.loaderProgress.hideLoader();
                    }
                }
                else {
                    Toast.makeText(data.errMessage).show();
                    _this.loaderProgress.hideLoader();
                }
            }, function (err) {
                console.log("Couldnt find information" + err);
                _this.handleServiceError(err);
                _this.loaderProgress.hideLoader();
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    };
    IssueCompensationComponent.prototype.selectingAllPax = function () {
        var _this = this;
        if (this.IsLabelField == true) {
            // this.selectedEMDs = 0;
            // this.SelectedPassenger = [];
            // this.IssueCompensationPaxList.forEach((data, Index) => {
            //     data.IsSelected = false;
            // })
            // this.IssueCompensationFullPaxList.forEach((data, Index) => {
            //     data.IsSelected = false;
            // })
            var isIneligibleSelected = false;
            if (this.SelectAllPax == false && this.SelectAllPaxVar == false) {
                this.SelectAllPaxVar = true;
                var exceedLimit = false;
                this.IssueCompensationPaxList.forEach(function (data, index) {
                    if (!data.IsSelected) {
                        var totalEmds = 0;
                        if (data.monetary) {
                            totalEmds = Number(_this.selectedEMDs) + Number(data.hotel) + Number(data.meal) + Number(data.transportation) + 1;
                        }
                        else {
                            totalEmds = Number(_this.selectedEMDs) + Number(data.hotel) + Number(data.meal) + Number(data.transportation);
                        }
                        if (totalEmds <= IssueCompensationComponent_1.MaxEMDIssued) {
                            if (data.monetary == 0 && data.hotel == 0 && data.meal == 0 && data.transportation == 0) {
                                isIneligibleSelected = true;
                                data.IsSelected = false;
                                _this.SelectAllPax = false;
                            }
                            else {
                                if (data.monetary) {
                                    _this.selectedEMDs += Number(data.hotel) + Number(data.meal) + Number(data.transportation) + 1;
                                }
                                else {
                                    _this.selectedEMDs += Number(data.hotel) + Number(data.meal) + Number(data.transportation);
                                }
                                data.IsSelected = true;
                                _this.SelectedPassenger.push(data);
                            }
                        }
                        else {
                            exceedLimit = true;
                            // Toast.makeText(IssueCompensationComponent.MaxEMDIssued + "EMD's selected").show();
                        }
                    }
                });
                if (exceedLimit) {
                    Toast.makeText(IssueCompensationComponent_1.MaxEMDIssued + " EMD's selected").show();
                }
            }
            else {
                this.SelectAllPaxVar = false;
                this.SelectAllPax = false;
                this.IssueCompensationFullPaxList.forEach(function (data, index) {
                    data.IsSelected = false;
                });
                this.IssueCompensationPaxList.forEach(function (data, index) {
                    data.IsSelected = false;
                    _this.SelectedPassenger = [];
                    _this.selectedEMDs = 0;
                });
            }
            if (this.IssueCompensationFullPaxList.length === this.SelectedPassenger.length)
                this.SelectAllPax = true;
        }
        if (isIneligibleSelected) {
            Toast.makeText("Ineligible Passenger(s) are not selected.").show();
        }
        this.SelectedPaxcount = this.SelectedPassenger.length;
        this.selectedPassengerCount = this.SelectedPassenger.length;
        console.log(this.SelectedPassenger);
    };
    // onBlur(args) {
    //     // blur event will be triggered when the user leaves the TextField
    //     // const textField = args.object;
    //     // textField.dismissSoftInput();
    //     this.overidereasonformeal(args,3);
    //     console.log("onBlur event");
    // }
    IssueCompensationComponent.prototype.navigatetoadditionaldetails = function (Paxitem) {
        if (this.IsEditable == true && Paxitem.IsSelected == true) {
            // Paxitem.IsSelected = true;
            var prePage = "BREPage";
            console.log("V" + Paxitem);
            this.routerExtensions.navigate(["compensationadditionaldetails"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                }, queryParams: {
                    "data": JSON.stringify(Paxitem),
                    "selectedPAx": JSON.stringify(this.SelectedPassenger),
                    "prepage": prePage,
                }
            });
        }
    };
    IssueCompensationComponent.prototype.navigatetoissuecompensation = function () {
        this.routerExtensions.navigate(["issuecompensationwithtab"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }, queryParams: {
                "data": this.OrderId,
            }
        });
    };
    IssueCompensationComponent.prototype.navigatetoissuecompensationForOrderId = function () {
        var prePage = "OrderId";
        this.routerExtensions.navigate(["issuecompensationwithtab"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }, queryParams: {
                "data": this.OrderId,
                "prepage": prePage,
            }
        });
    };
    IssueCompensationComponent.prototype.navigateToCompensation = function () {
        this.routerExtensions.navigate(["compensation"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    IssueCompensationComponent.prototype.overidereasonformonetary = function (item, n) {
        var _this = this;
        if (this.isButtonEnabled == true && item.isMonetaryOverridden == true) {
            var options = {
                title: "Other Details",
                message: "* required field",
                defaultText: item.MonetaryOverrideReason,
                okButtonText: "Copy to selected passenger & Save",
                cancelButtonText: "Save",
                neutralButtonText: "Cancel",
                inputType: dialogs.inputType.text
            };
            dialogs.prompt(options).then(function (result) {
                if (result.result != undefined) {
                    if (result.text.trim().length <= 0) {
                        _this.overidereasonformonetary(item, n);
                    }
                    else {
                        console.log("Hello, " + result.result);
                        console.log("Hello, " + result.text);
                        item.OverrideReason = result.text;
                        _this.OverRideReason = result.text;
                        if (result.result == true) {
                            _this.SelectedPassenger.forEach(function (data, Index) {
                                data.monetary = _this.SelectedMonetary;
                                data.MonetaryOverrideReason = _this.OverRideReason;
                                data.monetaryTempValue = _this.SelectedMonetary;
                            });
                        }
                        else {
                            item.monetaryTempValue = _this.SelectedMonetary;
                            item.MonetaryOverrideReason = _this.OverRideReason;
                        }
                    }
                    _this.totalMonetary = 0;
                    _this.totalHotel = 0;
                    _this.totalMeal = 0;
                    _this.totalTransport = 0;
                    _this.IssueCompensationPaxList.forEach(function (data, index) {
                        _this.totalMonetary += Number(data.monetary);
                        _this.totalHotel += Number(data.hotel);
                        _this.totalMeal += Number(data.meal);
                        _this.totalTransport += Number(data.transportation);
                    });
                }
                else {
                    item.monetary = item.monetaryTempValue;
                    item.isMonetaryOverridden = false;
                }
            });
        }
    };
    IssueCompensationComponent.prototype.overidereasonforhotel = function (item, n) {
        var _this = this;
        if (this.isButtonEnabled == true && item.isHotelOverridden == true) {
            var options = {
                title: "Other Details",
                message: "* required field",
                defaultText: item.HotelOverrideReason,
                okButtonText: "Copy to selected passenger & Save",
                cancelButtonText: "Save",
                neutralButtonText: "Cancel",
                inputType: dialogs.inputType.text
            };
            dialogs.prompt(options).then(function (result) {
                if (result.result != undefined) {
                    if (result.text.trim().length <= 0) {
                        _this.overidereasonforhotel(item, n);
                    }
                    else {
                        console.log("Hello, " + result.result);
                        console.log("Hello, " + result.text);
                        item.OverrideReason = result.text;
                        _this.OverRideReason = result.text;
                        if (result.result == true) {
                            _this.SelectedPassenger.forEach(function (data, Index) {
                                data.hotel = _this.SelctedHotel;
                                data.HotelOverrideReason = _this.OverRideReason;
                                data.hotelTempValue = _this.SelctedHotel;
                            });
                        }
                        else {
                            item.HotelOverrideReason = _this.OverRideReason;
                            item.hotelTempValue = _this.SelctedHotel;
                        }
                    }
                    _this.totalMonetary = 0;
                    _this.totalHotel = 0;
                    _this.totalMeal = 0;
                    _this.totalTransport = 0;
                    _this.IssueCompensationPaxList.forEach(function (data, index) {
                        _this.totalMonetary += Number(data.monetary);
                        _this.totalHotel += Number(data.hotel);
                        _this.totalMeal += Number(data.meal);
                        _this.totalTransport += Number(data.transportation);
                    });
                }
                else {
                    item.hotel = item.hotelTempValue;
                    item.isHotelOverridden = false;
                }
            });
            this.selectedEMDs = 0;
            this.IssueCompensationPaxList.forEach(function (data, index) {
                _this.SelectedPassenger.forEach(function (pax, Index) {
                    if (pax.monetary) {
                        _this.selectedEMDs = Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation) + 1;
                    }
                    else {
                        _this.selectedEMDs = Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation);
                    }
                    if (_this.selectedEMDs > IssueCompensationComponent_1.MaxEMDIssued) {
                        _this.SelectedPassenger = [];
                        data.IsSelected = false;
                    }
                });
            });
        }
    };
    IssueCompensationComponent.prototype.overidereasonformeal = function (item, n) {
        var _this = this;
        if (this.isButtonEnabled == true && item.isMealOverridden == true) {
            var options = {
                title: "Other Details",
                message: "* required field",
                defaultText: item.MealOverrideReason,
                okButtonText: "Copy to selected passenger & Save",
                cancelButtonText: "Save",
                neutralButtonText: "Cancel",
                inputType: dialogs.inputType.text
            };
            dialogs.prompt(options).then(function (result) {
                if (result.result != undefined) {
                    if (result.text.trim().length <= 0) {
                        _this.overidereasonformeal(item, n);
                    }
                    else {
                        console.log("Hello, " + result.result);
                        console.log("Hello, " + result.text);
                        item.OverrideReason = result.text;
                        _this.OverRideReason = result.text;
                        if (result.result == true) {
                            _this.SelectedPassenger.forEach(function (data, Index) {
                                data.meal = _this.SelectedMeal;
                                data.mealTempValue = _this.SelectedMeal;
                                data.MealOverrideReason = _this.OverRideReason;
                            });
                        }
                        else {
                            item.mealTempValue = _this.SelectedMeal;
                            item.MealOverrideReason = _this.OverRideReason;
                        }
                    }
                    _this.totalMonetary = 0;
                    _this.totalHotel = 0;
                    _this.totalMeal = 0;
                    _this.totalTransport = 0;
                    _this.IssueCompensationPaxList.forEach(function (data, index) {
                        _this.totalMonetary += Number(data.monetary);
                        _this.totalHotel += Number(data.hotel);
                        _this.totalMeal += Number(data.meal);
                        _this.totalTransport += Number(data.transportation);
                    });
                }
                else {
                    item.meal = item.mealTempValue;
                    item.isMealOverridden = false;
                }
            });
        }
    };
    IssueCompensationComponent.prototype.overidereasonfortransport = function (item, n) {
        var _this = this;
        if (this.isButtonEnabled == true && item.isTransportOverridden == true) {
            var options = {
                title: "Other Details",
                message: "* required field",
                defaultText: item.TransportOverrideReason,
                okButtonText: "Copy to selected passenger & Save",
                cancelButtonText: "Save",
                neutralButtonText: "Cancel",
                inputType: dialogs.inputType.text
            };
            dialogs.prompt(options).then(function (result) {
                if (result.result != undefined) {
                    if (result.text.trim().length <= 0) {
                        _this.overidereasonfortransport(item, n);
                    }
                    else {
                        console.log("Hello, " + result.result);
                        console.log("Hello, " + result.text);
                        item.OverrideReason = result.text;
                        _this.OverRideReason = result.text;
                        if (result.result == true) {
                            _this.SelectedPassenger.forEach(function (data, Index) {
                                data.transportation = _this.SelectedTransport;
                                data.TransportOverrideReason = _this.OverRideReason;
                                data.transportationTempValue = _this.SelectedTransport;
                            });
                        }
                        else {
                            item.transportationTempValue = _this.SelectedTransport;
                            item.TransportOverrideReason = _this.OverRideReason;
                        }
                    }
                    _this.totalMonetary = 0;
                    _this.totalHotel = 0;
                    _this.totalMeal = 0;
                    _this.totalTransport = 0;
                    _this.IssueCompensationPaxList.forEach(function (data, index) {
                        _this.totalMonetary += Number(data.monetary);
                        _this.totalHotel += Number(data.hotel);
                        _this.totalMeal += Number(data.meal);
                        _this.totalTransport += Number(data.transportation);
                    });
                }
                else {
                    item.transportation = item.transportationTempValue;
                    item.isTransportOverridden = false;
                }
            });
        }
    };
    IssueCompensationComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    IssueCompensationComponent.prototype.navigateToSearch = function () {
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
    IssueCompensationComponent.prototype.navigateToDepartures = function () {
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
    IssueCompensationComponent.prototype.displaySSRs = function (item) {
        if (item.SSRsCount > 0) {
            console.log("R" + JSON.stringify(item.SSRs));
            var options = {
                title: "SSRs",
                cancelButtonText: "Cancel",
                actions: item.SSRs,
            };
            dialogs.action(options).then(function (result) {
            });
        }
    };
    IssueCompensationComponent.prototype.handleServiceError = function (error) {
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
    var IssueCompensationComponent_1;
    IssueCompensationComponent.MaxEMDIssued = 50;
    IssueCompensationComponent.ISSUECOMPENSATIONTOAST = "Are you ready to issue compensation?";
    IssueCompensationComponent.NUMBERVALIDATIONTOAST = "Invalid. Enter value in numbers";
    IssueCompensationComponent.COMPENSATIONNATOAST = "Compensation not applicable";
    IssueCompensationComponent.MUSTBETOAST = "Must be:";
    __decorate([
        core_1.ViewChild('pagecontainer'),
        __metadata("design:type", core_1.ElementRef)
    ], IssueCompensationComponent.prototype, "pageCont", void 0);
    IssueCompensationComponent = IssueCompensationComponent_1 = __decorate([
        core_1.Component({
            selector: "compensationadditionaldetails-page",
            providers: [index_2.DataService, index_2.PassengerService, app_constants_1.Configuration, index_2.CompensationService],
            templateUrl: "./components/issuecompensation/issuecompensation.component.html",
            styleUrls: ["./components/issuecompensation/issuecompensation.component.css"]
        }),
        __metadata("design:paramtypes", [app_constants_1.Configuration, index_2.PassengerService, router_1.ActivatedRoute, index_2.CheckinOrderService, page_1.Page, router_2.RouterExtensions, router_1.Router, index_2.DataService, index_2.CompensationService, router_1.ActivatedRoute, core_1.ViewContainerRef, modal_dialog_1.ModalDialogService])
    ], IssueCompensationComponent);
    return IssueCompensationComponent;
}());
exports.IssueCompensationComponent = IssueCompensationComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNzdWVjb21wZW5zYXRpb24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXNzdWVjb21wZW5zYXRpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLHNDQUEyRjtBQUMzRiwwQ0FBMkU7QUFHM0Usc0RBQStEO0FBQy9ELGdDQUErQjtBQUkvQixrRUFBMkY7QUFFM0Ysb0NBQXNDO0FBR3RDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUU3Qiw4QkFBOEI7QUFDOUIsMERBQTREO0FBQzVELCtCQUFpQztBQUNqQywwQ0FBNEM7QUFFNUMsZ0JBQWdCO0FBQ2hCLHNEQUFxTztBQUVyTyxxREFBdUg7QUFDdkgsa0RBQXNEO0FBQ3RELDZEQUEyRDtBQUMzRCxxREFBb0Q7QUFXcEQ7SUF5RUksb0NBQW9CLGNBQTZCLEVBQVUsU0FBMkIsRUFBVSxlQUErQixFQUFVLE9BQTRCLEVBQVUsSUFBVSxFQUFVLGdCQUFrQyxFQUFVLE1BQWMsRUFBUyxZQUF5QixFQUFTLFFBQTZCLEVBQVUsS0FBcUIsRUFBVSxLQUF1QixFQUFVLGFBQWlDO1FBQTVaLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFxQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBcUI7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUFVLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQW9CO1FBdkV6YSw4QkFBeUIsR0FBaUMsRUFBRSxDQUFDO1FB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QUNQLENBQUMsQ0FBQyxDQUFDO1lBQ0gsb0NBQW9DO1NBQ3ZDO2FBQ0k7WUFDRCxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3ZDO0lBQ0wsQ0FBQzs7SUF4dUNhLHVDQUFZLEdBQVcsRUFBRSxDQUFDO0lBQzFCLGlEQUFzQixHQUFXLHNDQUFzQyxDQUFDO0lBQ3hFLGdEQUFxQixHQUFXLGlDQUFpQyxDQUFDO0lBQ2xFLDhDQUFtQixHQUFXLDZCQUE2QixDQUFDO0lBQzVELHNDQUFXLEdBQVcsVUFBVSxDQUFDO0lBdEVuQjtRQUEzQixnQkFBUyxDQUFDLGVBQWUsQ0FBQztrQ0FBVyxpQkFBVTtnRUFBQztJQUR4QywwQkFBMEI7UUFSdEMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxvQ0FBb0M7WUFDOUMsU0FBUyxFQUFFLENBQUMsbUJBQVcsRUFBRSx3QkFBZ0IsRUFBRSw2QkFBYSxFQUFFLDJCQUFtQixDQUFDO1lBQzlFLFdBQVcsRUFBRSxpRUFBaUU7WUFDOUUsU0FBUyxFQUFFLENBQUMsZ0VBQWdFLENBQUM7U0FFaEYsQ0FBQzt5Q0EyRXNDLDZCQUFhLEVBQXFCLHdCQUFnQixFQUEyQix1QkFBYyxFQUFtQiwyQkFBbUIsRUFBZ0IsV0FBSSxFQUE0Qix5QkFBZ0IsRUFBa0IsZUFBTSxFQUF1QixtQkFBVyxFQUFtQiwyQkFBbUIsRUFBaUIsdUJBQWMsRUFBaUIsdUJBQWdCLEVBQXlCLGlDQUFrQjtPQXpFdmEsMEJBQTBCLENBNHlDdEM7SUFBRCxpQ0FBQztDQUFBLEFBNXlDRCxJQTR5Q0M7QUE1eUNZLGdFQUEwQiIsInNvdXJjZXNDb250ZW50IjpbIi8vYW5ndWxhciAmIG5hdGl2ZXNjcmlwdCByZWZlcmVuY2VzXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvbkV4dHJhcywgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlQXJyYXkgfSBmcm9tIFwiZGF0YS9vYnNlcnZhYmxlLWFycmF5XCI7XG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgeyBHZXN0dXJlRXZlbnREYXRhIH0gZnJvbSBcInVpL2dlc3R1cmVzXCI7XG5pbXBvcnQgeyBMaXN0VmlldywgSXRlbUV2ZW50RGF0YSB9IGZyb20gXCJ1aS9saXN0LXZpZXdcIjtcbmltcG9ydCB7IFN0YWNrTGF5b3V0IH0gZnJvbSBcInVpL2xheW91dHMvc3RhY2stbGF5b3V0XCI7XG5pbXBvcnQgeyBNb2RhbERpYWxvZ1NlcnZpY2UsIE1vZGFsRGlhbG9nT3B0aW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9tb2RhbC1kaWFsb2dcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9uYXRpdmVzY3JpcHQubW9kdWxlXCI7XG5pbXBvcnQgKiBhcyBkaWFsb2dzIGZyb20gXCJ1aS9kaWFsb2dzXCI7XG5pbXBvcnQgKiBhcyBnZXN0dXJlcyBmcm9tIFwidWkvZ2VzdHVyZXNcIjtcbmltcG9ydCB7IFNlZ21lbnRlZEJhciwgU2VnbWVudGVkQmFySXRlbSB9IGZyb20gXCJ1aS9zZWdtZW50ZWQtYmFyXCI7XG52YXIgdGltZXIgPSByZXF1aXJlKFwidGltZXJcIik7XG5cbi8vZXh0ZXJuYWwgbW9kdWxlcyBhbmQgcGx1Z2luc1xuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tIFwibW9tZW50XCI7XG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICduYXRpdmVzY3JpcHQtdG9hc3QnO1xuXG4vL2FwcCByZWZlcmVuY2VzXG5pbXBvcnQgeyBMb2FkZXJQcm9ncmVzcywgb3JkZXIsIFBhc3Nlbmdlckxpc3RUZW1wbGF0ZSwgRGVwYXJ0dXJlUGF4TGlzdCwgUGFzc2VuZ2VyTGlzdCwgRGVwYXJ0dXJlSW5mbzEsIEluQm91bmQsIE91dEJvdW5kLCBJc3N1ZUNvbXBlbnNhdGlvbkxpc3QsIENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZSwgQ29tcGVuc2F0aW9uT3JkZXJJRCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvaW50ZXJmYWNlL2luZGV4XCJcbmltcG9ydCB7IFBhc3NlbmdlciwgT3JkZXIsIEludmVudG9yeSwgQ291bnRyeUNvbGxlY3Rpb24sIEJSRUNvbXBlbnNhdGlvbiwgfSBmcm9tICcuLi8uLi9zaGFyZWQvbW9kZWwvaW5kZXgnO1xuaW1wb3J0IHsgRGF0YVNlcnZpY2UsIENoZWNraW5PcmRlclNlcnZpY2UsIFBhc3NlbmdlclNlcnZpY2UsIENvbXBlbnNhdGlvblNlcnZpY2UsIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9pbmRleFwiO1xuaW1wb3J0IHsgQ29udmVydGVycyB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXRpbHMvaW5kZXhcIjtcbmltcG9ydCB7IEFwcEV4ZWN1dGlvbnRpbWUgfSBmcm9tIFwiLi4vLi4vYXBwLmV4ZWN1dGlvbnRpbWVcIjtcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi8uLi9hcHAuY29uc3RhbnRzJztcblxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJjb21wZW5zYXRpb25hZGRpdGlvbmFsZGV0YWlscy1wYWdlXCIsXG4gICAgcHJvdmlkZXJzOiBbRGF0YVNlcnZpY2UsIFBhc3NlbmdlclNlcnZpY2UsIENvbmZpZ3VyYXRpb24sIENvbXBlbnNhdGlvblNlcnZpY2VdLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vY29tcG9uZW50cy9pc3N1ZWNvbXBlbnNhdGlvbi9pc3N1ZWNvbXBlbnNhdGlvbi5jb21wb25lbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogW1wiLi9jb21wb25lbnRzL2lzc3VlY29tcGVuc2F0aW9uL2lzc3VlY29tcGVuc2F0aW9uLmNvbXBvbmVudC5jc3NcIl1cblxufSlcblxuZXhwb3J0IGNsYXNzIElzc3VlQ29tcGVuc2F0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBAVmlld0NoaWxkKCdwYWdlY29udGFpbmVyJykgcGFnZUNvbnQ6IEVsZW1lbnRSZWY7XG4gICAgcHVibGljIENvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q6IEFycmF5PElzc3VlQ29tcGVuc2F0aW9uTGlzdD4gPSBbXTtcbiAgICBwdWJsaWMgRmxpZ2h0SW5mb05vdFNldDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBsb2FkZXJQcm9ncmVzczogTG9hZGVyUHJvZ3Jlc3M7XG4gICAgcHVibGljIEZsaWdodEhlYWRlckluZm86IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5GbGlnaHRNb2RlbCA9IG5ldyBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuRmxpZ2h0TW9kZWwoKTtcbiAgICBwdWJsaWMgSXNzdWVDb21wZW5zYXRpb25SZXNwb25zZTogQXJyYXk8Q29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q+ID0gW107XG4gICAgcHVibGljIElzc3VlQ29tcGVuc2F0aW9uUGF4TGlzdDogQXJyYXk8Q29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q+ID0gW107XG4gICAgcHVibGljIElzc3VlQ29tcGVuc2F0aW9uRnVsbFBheExpc3Q6IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBTZWxlY3RlZFBhc3NlbmdlcjogQXJyYXk8Q29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q+ID0gW107XG4gICAgcHVibGljIENvbXBlbnNhdGlvblJlYXNvbjogYW55O1xuICAgIHB1YmxpYyBTZWFyY2hDcml0ZXJpYTogYW55ID0gXCJOYW1lXCI7XG4gICAgcHVibGljIFBhc3NlbmdlckZsaXRlckNyaXRlcmlhOiBhbnkgPSBcIkFsbCBQYXNzZW5nZXJzXCI7XG4gICAgcHVibGljIElzUGF4UmVhc29uU2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgTW9uZXRyYXJ5RW1wdHk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgTW9uZXRhcnlkaXJ0eTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBob3RlbEVtcHR5OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGhvdGVsZGlydHk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgbWVhbEVtcHR5OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIE92ZXJyaWRlUmVhc29uOiBzdHJpbmc7XG4gICAgcHVibGljIHVzZXJkZXRhaWxzOiBhbnk7XG4gICAgcHVibGljIE9yZGVySWQ6IGFueTtcbiAgICBwdWJsaWMgaXNQcmV2RGF5U2FsZXNSZXBvcnROb3RDbG9zZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAvLyBwdWJsaWMgSXNFZGl0RW5hYmxlZCA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgVmFsaWRNb25ldGFyeTogQXJyYXk8Ym9vbGVhbj4gPSBbXTtcbiAgICBwdWJsaWMgVmFsaWRIb3RlbDogQXJyYXk8Ym9vbGVhbj4gPSBbXTtcbiAgICBwdWJsaWMgVmFsaWRNZWFsOiBBcnJheTxib29sZWFuPiA9IFtdO1xuICAgIHB1YmxpYyBWYWxpZHRyYW5zcG9ydDogQXJyYXk8Ym9vbGVhbj4gPSBbXTtcbiAgICBwdWJsaWMgVG90YWxQYXNzZW5nZXJDb3VudDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgc2VsZWN0ZWRQYXNzZW5nZXJDb3VudDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgbWVhbGRpcnR5OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIFNlbGVjdEFsbFBheDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBTZWxlY3RBbGxQYXhWYXI6IGJvb2xlYW4gPWZhbHNlO1xuICAgIHB1YmxpYyBDb3B5U2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgdHJhbnNwb3J0RW1wdHk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgdHJhbnNwb3J0ZGlydHk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgaXNPdmVycmlkZVJlYXNvbkJsYW5rOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIFNlbGVjdGVkTW9uZXRhcnk6IGFueTtcbiAgICBwdWJsaWMgU2VsY3RlZEhvdGVsOiBhbnk7XG4gICAgcHVibGljIFNlbGVjdGVkTWVhbDogYW55O1xuICAgIHB1YmxpYyBPdmVyUmlkZVJlYXNvbjogYW55O1xuICAgIHB1YmxpYyBTZWxlY3RlZFBheGNvdW50OiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyBTZWxlY3RlZFRyYW5zcG9ydDogYW55O1xuICAgIElzRWRpdGFibGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgY29weVRvQWxsUGF4OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIElzSGVhZGVySW5mbzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBJc0ZsaWdodEluZm86IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgUHJldmlvdXNQYWdlOiBhbnk7XG4gICAgcHVibGljIHRvdGFsTW9uZXRhcnk6IG51bWJlciA9IDA7XG4gICAgcHVibGljIHRvdGFsSG90ZWw6IG51bWJlciA9IDA7XG4gICAgcHVibGljIHRvdGFsTWVhbDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgdG90YWxUcmFuc3BvcnQ6IG51bWJlciA9IDA7XG4gICAgcHVibGljIGlzQnV0dG9uRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIElzTGFiZWxGaWVsZDogYm9vbGVhbiA9IHRydWU7XG4gICAgcHVibGljIG5hbWVTb3J0SW5kaWNhdG9yOiBudW1iZXIgPSAtMTtcbiAgICBwdWJsaWMgc3NyU29ydEluZGljYXRvcjogbnVtYmVyID0gLTE7XG4gICAgcHVibGljIHRpZXJTb3J0SW5kaWNhdG9yOiBudW1iZXIgPSAtMTtcbiAgICBwdWJsaWMgY2xhc3NTb3J0SW5kaWNhdG9yOiBudW1iZXIgPSAtMTtcbiAgICBwdWJsaWMgb3JkZXJJZFNvcnRJbmRpY2F0b3I6IG51bWJlciA9IC0xO1xuICAgIHB1YmxpYyBCUkVJbml0aWFsTW9uZXRhcnlWYWx1ZTogbnVtYmVyO1xuICAgIHB1YmxpYyBCUkVJbml0aWFsSG90ZWxWYWx1ZTogbnVtYmVyO1xuICAgIHB1YmxpYyBCUkVJbml0aWFsTWVhbFZhbHVlOiBudW1iZXI7XG4gICAgcHVibGljIHNlbGVjdGVkRU1EczogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgQlJFSW5pdGlhbFRyYW5zcG9ydFZhbHVlOiBudW1iZXI7XG4gICAgcHVibGljIGlzQ2hlY2tpbkRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzR2F0ZURpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIENvbXBlbnNhdGlvbk9yZGVyRGV0YWlsczogQXJyYXk8Q29tcGVuc2F0aW9uT3JkZXJJRC5GbGlnaHRTZWdtZW50PiA9IFtdO1xuICAgIHB1YmxpYyBzdGF0aWMgTWF4RU1ESXNzdWVkOiBudW1iZXIgPSA1MDtcbiAgICBwdWJsaWMgc3RhdGljIElTU1VFQ09NUEVOU0FUSU9OVE9BU1Q6IHN0cmluZyA9IFwiQXJlIHlvdSByZWFkeSB0byBpc3N1ZSBjb21wZW5zYXRpb24/XCI7XG4gICAgcHVibGljIHN0YXRpYyBOVU1CRVJWQUxJREFUSU9OVE9BU1Q6IHN0cmluZyA9IFwiSW52YWxpZC4gRW50ZXIgdmFsdWUgaW4gbnVtYmVyc1wiO1xuICAgIHB1YmxpYyBzdGF0aWMgQ09NUEVOU0FUSU9OTkFUT0FTVDogc3RyaW5nID0gXCJDb21wZW5zYXRpb24gbm90IGFwcGxpY2FibGVcIjtcbiAgICBwdWJsaWMgc3RhdGljIE1VU1RCRVRPQVNUOiBzdHJpbmcgPSBcIk11c3QgYmU6XCI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uLCBwcml2YXRlIF9zZXJ2aWNlczogUGFzc2VuZ2VyU2VydmljZSwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZXI6IEFjdGl2YXRlZFJvdXRlLCBwcml2YXRlIF9zaGFyZWQ6IENoZWNraW5PcmRlclNlcnZpY2UsIHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSByb3V0ZXJFeHRlbnNpb25zOiBSb3V0ZXJFeHRlbnNpb25zLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwdWJsaWMgX2RhdGFTZXJ2aWNlOiBEYXRhU2VydmljZSwgcHVibGljIF9zZXJ2aWNlOiBDb21wZW5zYXRpb25TZXJ2aWNlLCBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSB2Y1JlZjogVmlld0NvbnRhaW5lclJlZiwgcHJpdmF0ZSBfbW9kYWxTZXJ2aWNlOiBNb2RhbERpYWxvZ1NlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcyA9IG5ldyBMb2FkZXJQcm9ncmVzcygpO1xuICAgIH1cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCd+L2ltYWdlcy9sb2dpbl9iYWNrLmpwZWcnKVwiO1xuICAgICAgICB0aGlzLnBhZ2Uuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBcImNvdmVyIFwiO1xuICAgICAgICB0aGlzLnVzZXJkZXRhaWxzID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VyZGV0YWlsc1wiLCBcIlwiKTtcbiAgICAgICAgdGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNoZWNraW5EaXNhYmxlZFwiKTtcbiAgICAgICAgdGhpcy5pc0dhdGVEaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImdhdGVEaXNhYmxlZFwiKTtcbiAgICAgICAgdGhpcy5GbGlnaHRIZWFkZXJJbmZvID0gdGhpcy5fc2hhcmVkLmdldEZsaWdodEhlYWRlckluZm8oKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJGbGlnaHRcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuRmxpZ2h0SGVhZGVySW5mbykpO1xuICAgICAgICB0aGlzLklzc3VlQ29tcGVuc2F0aW9uUmVzcG9uc2UgPSB0aGlzLl9zaGFyZWQuZ2V0Q29tcGVuc2F0aW9uUGF4TGlzdCgpO1xuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmluaXRMb2FkZXIodGhpcy5wYWdlQ29udCk7XG4gICAgICAgIHRoaXMuSXNzdWVDb21wZW5zYXRpb25QYXhMaXN0ID0gdGhpcy5Jc3N1ZUNvbXBlbnNhdGlvblJlc3BvbnNlO1xuICAgICAgICB0aGlzLklzc3VlQ29tcGVuc2F0aW9uRnVsbFBheExpc3QgPSB0aGlzLklzc3VlQ29tcGVuc2F0aW9uUGF4TGlzdDtcbiAgICAgICAgdGhpcy5Jc3N1ZUNvbXBlbnNhdGlvblBheExpc3QuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudG90YWxNb25ldGFyeSA9IHRoaXMudG90YWxNb25ldGFyeSArIGRhdGEubW9uZXRhcnk7XG4gICAgICAgICAgICB0aGlzLnRvdGFsSG90ZWwgKz0gZGF0YS5ob3RlbDtcbiAgICAgICAgICAgIHRoaXMudG90YWxNZWFsICs9IGRhdGEubWVhbDtcbiAgICAgICAgICAgIHRoaXMudG90YWxUcmFuc3BvcnQgKz0gZGF0YS50cmFuc3BvcnRhdGlvbjtcbiAgICAgICAgICAgIHRoaXMuVmFsaWRNb25ldGFyeS5wdXNoKGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuVmFsaWRIb3RlbC5wdXNoKGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuVmFsaWRNZWFsLnB1c2goZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5WYWxpZHRyYW5zcG9ydC5wdXNoKGZhbHNlKTtcbiAgICAgICAgICAgIC8vIHRoaXMuQlJFSW5pdGlhbE1vbmV0YXJ5VmFsdWUgPSBkYXRhLm1vbmV0YXJ5O1xuICAgICAgICAgICAgLy8gdGhpcy5CUkVJbml0aWFsSG90ZWxWYWx1ZSA9IGRhdGEuaG90ZWw7XG4gICAgICAgICAgICAvLyB0aGlzLkJSRUluaXRpYWxNZWFsVmFsdWUgPSBkYXRhLm1lYWw7XG4gICAgICAgICAgICAvLyB0aGlzLkJSRUluaXRpYWxUcmFuc3BvcnRWYWx1ZSA9IGRhdGEudHJhbnNwb3J0YXRpb247XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuVG90YWxQYXNzZW5nZXJDb3VudCA9IHRoaXMuSXNzdWVDb21wZW5zYXRpb25QYXhMaXN0Lmxlbmd0aDtcbiAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmFjdGl2YXRlZFJvdXRlci5xdWVyeVBhcmFtcy5zdWJzY3JpYmUoKHBhcmFtcykgPT4ge1xuICAgICAgICAgICAgdGhpcy5QcmV2aW91c1BhZ2UgPSBwYXJhbXNbXCJwcmVwYWdlXCJdO1xuICAgICAgICAgICAgdGhpcy5PcmRlcklkID0gcGFyYW1zW1wiZGF0YVwiXTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5PcmRlcklkKSk7XG4gICAgICAgIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKFwidlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5PcmRlcklkKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiclwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5QcmV2aW91c1BhZ2UpKTtcbiAgICAgICAgaWYgKHRoaXMuUHJldmlvdXNQYWdlID09IFwiT3JkZXJJZFwiKSB7XG4gICAgICAgICAgICB0aGlzLklzSGVhZGVySW5mbyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLklzRmxpZ2h0SW5mbyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25PcmRlckRldGFpbHMgPSB0aGlzLl9zaGFyZWQuZ2V0Q29tcGVuc2F0aW9uT3JkZXJEZWF0aWxzKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuQ29tcGVuc2F0aW9uT3JkZXJEZXRhaWxzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLklzSGVhZGVySW5mbyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5Jc0ZsaWdodEluZm8gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuSXNzdWVDb21wZW5zYXRpb25QYXhMaXN0LmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7IGRhdGEuSXNTZWxlY3RlZCA9IGZhbHNlOyB9KTtcbiAgICAgICAgaWYgKHRoaXMuRmxpZ2h0SGVhZGVySW5mbyA9PSBudWxsIHx8IHRoaXMuRmxpZ2h0SGVhZGVySW5mbyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmxhZ1wiKTtcbiAgICAgICAgICAgIHRoaXMuRmxpZ2h0SW5mb05vdFNldCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nZXRTYWxlc1JlcG9ydCgpO1xuICAgIH1cbiAgICBnZXRTYWxlc1JlcG9ydCgpIHtcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XG4gICAgICAgIHRoaXMuX3NlcnZpY2UuZ2V0U2FsZU9mZmljZVJlcG9ydCgpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTYWxlcyByZXBvcnQ6XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICBpZiAoZGF0YS5IYXNPcGVuUGFzdER1ZVNhbGVzUmVwb3J0cykge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNQcmV2RGF5U2FsZXNSZXBvcnROb3RDbG9zZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiQ2xvc2UgcHJldmlvdXMgZGF5IFNhbGVzIFJlcG9ydGluZyB0byBwcm9jZWVkLlwiKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcblxuICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZG50IGZpbmQgaW5mb3JtYXRpb25cIiArIGVycik7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGVkaXRhYmxlKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5TZWxlY3RlZFBhc3NlbmdlciAmJiB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuSXNFZGl0YWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLklzTGFiZWxGaWVsZCA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0OiBcIiArIHRoaXMuSXNFZGl0YWJsZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRvbmU6XCIgKyB0aGlzLklzTGFiZWxGaWVsZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmlsdGVyKGFyZ3M6IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIk5hbWU6XCIgKyBKU09OLnN0cmluZ2lmeShhcmdzKSk7XG4gICAgICAgIC8vIHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCA9IHRoaXMuQ29tcGVuc2F0aW9uRnVsbFBheExpc3Q7XG4gICAgICAgIHRoaXMuSXNzdWVDb21wZW5zYXRpb25QYXhMaXN0ID0gdGhpcy5Jc3N1ZUNvbXBlbnNhdGlvbkZ1bGxQYXhMaXN0O1xuICAgICAgICBpZiAodGhpcy5TZWFyY2hDcml0ZXJpYSA9PSBcIk5hbWVcIikge1xuICAgICAgICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGFyZ3MudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuSXNzdWVDb21wZW5zYXRpb25QYXhMaXN0ID0gdGhpcy5Jc3N1ZUNvbXBlbnNhdGlvblBheExpc3QuZmlsdGVyKHIgPT4gci5HaXZlbk5hbWUuaW5kZXhPZihuYW1lLnRyaW0oKSkgPj0gMCB8fCByLkxhc3ROYW1lLmluZGV4T2YobmFtZS50cmltKCkpID49IDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLklzc3VlQ29tcGVuc2F0aW9uUGF4TGlzdCA9IHRoaXMuSXNzdWVDb21wZW5zYXRpb25GdWxsUGF4TGlzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLlNlYXJjaENyaXRlcmlhID09IFwiT3JkZXIgSURcIikge1xuICAgICAgICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGFyZ3MudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuSXNzdWVDb21wZW5zYXRpb25QYXhMaXN0ID0gdGhpcy5Jc3N1ZUNvbXBlbnNhdGlvblBheExpc3QuZmlsdGVyKHIgPT4gci5PcmRlcklkLmluZGV4T2YobmFtZS50cmltKCkpID49IDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLklzc3VlQ29tcGVuc2F0aW9uUGF4TGlzdCA9IHRoaXMuSXNzdWVDb21wZW5zYXRpb25GdWxsUGF4TGlzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChhcmdzKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmdzLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLklzc3VlQ29tcGVuc2F0aW9uUGF4TGlzdCA9IHRoaXMuSXNzdWVDb21wZW5zYXRpb25QYXhMaXN0LmZpbHRlcihyID0+IHIuQ2FiaW4uaW5kZXhPZihuYW1lLnRyaW0oKSkgPj0gMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuSXNzdWVDb21wZW5zYXRpb25QYXhMaXN0ID0gdGhpcy5Jc3N1ZUNvbXBlbnNhdGlvbkZ1bGxQYXhMaXN0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuVG90YWxQYXNzZW5nZXJDb3VudCA9IHRoaXMuSXNzdWVDb21wZW5zYXRpb25QYXhMaXN0Lmxlbmd0aDtcbiAgICAgICAgaWYgKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIubGVuZ3RoID09IHRoaXMuSXNzdWVDb21wZW5zYXRpb25GdWxsUGF4TGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0QWxsUGF4ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0QWxsUGF4ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZGlzcGxheVByb2R1Y3RBY3Rpb25EaWFsb2dGb3JTbWFydEZpbHRlcigpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0aXRsZTogXCJTbWFydCBmaWx0ZXIgb3B0aW9uXCIsXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgYWN0aW9uczogW1wiTmFtZVwiLCBcIk9yZGVyIElEXCIsIFwiQ2xhc3NcIl0sXG4gICAgICAgIH07XG4gICAgICAgIGRpYWxvZ3MuYWN0aW9uKG9wdGlvbnMpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSBcIkNhbmNlbFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5TZWFyY2hDcml0ZXJpYSA9IHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRpc3BsYXlEaWFsb2dGb3JGbGl0ZXJQYXNzZW5nZXJUeXBlKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHRpdGxlOiBcIlBhc3NlbmdlciB0eXBlIGZpbHRlclwiLFxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcIkFsbCBQYXNzZW5nZXJzXCIsIFwiRVRLVCBQYXNzZW5nZXJzXCIsIFwiQ2hlY2tlZC1JbiBQYXNzZW5nZXJzXCIsIFwiTm90IENoZWNrZWQtSW4gUGFzc2VuZ2Vyc1wiXSxcbiAgICAgICAgfTtcbiAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzdWx0ICE9IFwiQ2FuY2VsXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLlBhc3NlbmdlckZsaXRlckNyaXRlcmlhID0gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZG9uZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNCdXR0b25FbmFibGVkID09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFTURzID0gMDtcbiAgICAgICAgICAgIHRoaXMuaXNPdmVycmlkZVJlYXNvbkJsYW5rID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaXNNb25ldGFyeU92ZXJyaWRkZW4gPT0gdHJ1ZSAmJiBkYXRhLk1vbmV0YXJ5T3ZlcnJpZGVSZWFzb24gPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzT3ZlcnJpZGVSZWFzb25CbGFuayA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3ZlcmlkZXJlYXNvbmZvcm1vbmV0YXJ5KGRhdGEsIDEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5pc0hvdGVsT3ZlcnJpZGRlbiA9PSB0cnVlICYmIGRhdGEuSG90ZWxPdmVycmlkZVJlYXNvbiA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNPdmVycmlkZVJlYXNvbkJsYW5rID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vdmVyaWRlcmVhc29uZm9yaG90ZWwoZGF0YSwgMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLmlzTWVhbE92ZXJyaWRkZW4gPT0gdHJ1ZSAmJiBkYXRhLk1lYWxPdmVycmlkZVJlYXNvbiA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNPdmVycmlkZVJlYXNvbkJsYW5rID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vdmVyaWRlcmVhc29uZm9ybWVhbChkYXRhLCAxKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEuaXNUcmFuc3BvcnRPdmVycmlkZGVuID09IHRydWUgJiYgZGF0YS5UcmFuc3BvcnRPdmVycmlkZVJlYXNvbiA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNPdmVycmlkZVJlYXNvbkJsYW5rID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vdmVyaWRlcmVhc29uZm9ydHJhbnNwb3J0KGRhdGEsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNPdmVycmlkZVJlYXNvbkJsYW5rKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSXNFZGl0YWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLklzTGFiZWxGaWVsZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY291bnQ6XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnNlbGVjdGVkRU1EcykpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLm1vbmV0YXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFTURzID0gdGhpcy5zZWxlY3RlZEVNRHMgKyBOdW1iZXIoZGF0YS5ob3RlbCkgKyBOdW1iZXIoZGF0YS5tZWFsKSArIE51bWJlcihkYXRhLnRyYW5zcG9ydGF0aW9uKSArIDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVNRHMgPSB0aGlzLnNlbGVjdGVkRU1EcyArIE51bWJlcihkYXRhLmhvdGVsKSArIE51bWJlcihkYXRhLm1lYWwpICsgTnVtYmVyKGRhdGEudHJhbnNwb3J0YXRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEVNRHMgPiBJc3N1ZUNvbXBlbnNhdGlvbkNvbXBvbmVudC5NYXhFTURJc3N1ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5Jc1NlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuc3BsaWNlKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuaW5kZXhPZihkYXRhKSwgMSlcbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuSXNzdWVDb21wZW5zYXRpb25QYXhMaXN0LmZvckVhY2goKHBheERhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHBheERhdGEuSXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLnB1c2gocGF4RGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRU1EcyA9IDA7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEubW9uZXRhcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVNRHMgPSB0aGlzLnNlbGVjdGVkRU1EcyArIE51bWJlcihkYXRhLmhvdGVsKSArIE51bWJlcihkYXRhLm1lYWwpICsgTnVtYmVyKGRhdGEudHJhbnNwb3J0YXRpb24pICsgMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRU1EcyA9IHRoaXMuc2VsZWN0ZWRFTURzICsgTnVtYmVyKGRhdGEuaG90ZWwpICsgTnVtYmVyKGRhdGEubWVhbCkgKyBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXhjb3VudCA9IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIubGVuZ3RoO1xuICAgICAgICAgICAgY29uc29sZS5kaXIodGhpcy5TZWxlY3RlZFBhc3Nlbmdlcik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXQ6IFwiICsgdGhpcy5Jc0VkaXRhYmxlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRG9uZTpcIiArIHRoaXMuSXNMYWJlbEZpZWxkKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb250aW51ZUVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQnV0dG9uIDpcIiArIEpTT04uc3RyaW5naWZ5KCB0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQpKTtcbiAgICAgICAgdmFyIGlzSW5FbGlnaWJsZVBheFNlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyICYmIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuSXNQYXhSZWFzb25TZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gdGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLklzRWRpdGFibGUgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuSXNQYXhSZWFzb25TZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLm1vbmV0YXJ5ID09IDAgJiYgZGF0YS5ob3RlbCA9PSAwICYmIGRhdGEubWVhbCA9PSAwICYmIGRhdGEudHJhbnNwb3J0YXRpb24gPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNJbkVsaWdpYmxlUGF4U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGlmICh0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgJiYgIXRoaXMuaXNQcmV2RGF5U2FsZXNSZXBvcnROb3RDbG9zZWQgJiYgIWlzSW5FbGlnaWJsZVBheFNlbGVjdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaXNFZGl0RW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgJiYgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdG9nZ2xlQ2hlY2tlZChwYXg6IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ291bnQ6XCIgKyB0aGlzLnNlbGVjdGVkRU1Ecyk7XG4gICAgICAgIGlmICh0aGlzLklzTGFiZWxGaWVsZCA9PSB0cnVlKSB7XG5cbiAgICAgICAgICAgIGlmIChwYXguSXNTZWxlY3RlZCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFTURzID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLm1vbmV0YXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRU1EcyArPSBOdW1iZXIoZGF0YS5ob3RlbCkgKyBOdW1iZXIoZGF0YS5tZWFsKSArIE51bWJlcihkYXRhLnRyYW5zcG9ydGF0aW9uKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRU1EcyArPSBOdW1iZXIoZGF0YS5ob3RlbCkgKyBOdW1iZXIoZGF0YS5tZWFsKSArIE51bWJlcihkYXRhLnRyYW5zcG9ydGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvdW50RU1EOlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5zZWxlY3RlZEVNRHMpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRpcih0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyKTtcbiAgICAgICAgICAgICAgICBpZiAocGF4Lm1vbmV0YXJ5ID09IDAgJiYgcGF4LmhvdGVsID09IDAgJiYgcGF4Lm1lYWwgPT0gMCAmJiBwYXgudHJhbnNwb3J0YXRpb24gPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBwYXguSXNTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIucHVzaChwYXgpO1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkluZWxpZ2libGUgUGFzc2VuZ2VyKHMpIGlzIHNlbGVjdGVkLlwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGF4Lm1vbmV0YXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHRoaXMuc2VsZWN0ZWRFTURzICsgTnVtYmVyKHBheC5ob3RlbCkgKyBOdW1iZXIocGF4Lm1lYWwpICsgTnVtYmVyKHBheC50cmFuc3BvcnRhdGlvbikgKyAxKSA8PSBJc3N1ZUNvbXBlbnNhdGlvbkNvbXBvbmVudC5NYXhFTURJc3N1ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXguSXNTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5wdXNoKHBheCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVNRHMgKz0gTnVtYmVyKHBheC5ob3RlbCkgKyBOdW1iZXIocGF4Lm1lYWwpICsgTnVtYmVyKHBheC50cmFuc3BvcnRhdGlvbikgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCh0aGlzLnNlbGVjdGVkRU1EcyArIE51bWJlcihwYXguaG90ZWwpICsgTnVtYmVyKHBheC5tZWFsKSArIE51bWJlcihwYXgudHJhbnNwb3J0YXRpb24pKSA8PSBJc3N1ZUNvbXBlbnNhdGlvbkNvbXBvbmVudC5NYXhFTURJc3N1ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXguSXNTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5wdXNoKHBheCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVNRHMgKz0gTnVtYmVyKHBheC5ob3RlbCkgKyBOdW1iZXIocGF4Lm1lYWwpICsgTnVtYmVyKHBheC50cmFuc3BvcnRhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5Jc3N1ZUNvbXBlbnNhdGlvbkZ1bGxQYXhMaXN0Lmxlbmd0aCA9PT0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5sZW5ndGgpIHRoaXMuU2VsZWN0QWxsUGF4ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5zcGxpY2UodGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5pbmRleE9mKHBheCksIDEpO1xuICAgICAgICAgICAgICAgIC8vIGlmIChwYXgubW9uZXRhcnkpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5zZWxlY3RlZEVNRHMgPSB0aGlzLnNlbGVjdGVkRU1EcyAtIChOdW1iZXIocGF4LmhvdGVsKSArIE51bWJlcihwYXgubWVhbCkgKyBOdW1iZXIocGF4LnRyYW5zcG9ydGF0aW9uKSArIDEpO1xuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuc2VsZWN0ZWRFTURzID0gdGhpcy5zZWxlY3RlZEVNRHMgLSAoTnVtYmVyKHBheC5ob3RlbCkgKyBOdW1iZXIocGF4Lm1lYWwpICsgTnVtYmVyKHBheC50cmFuc3BvcnRhdGlvbikpO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRU1EcyA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGF4Lm1vbmV0YXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRU1EcyArPSBOdW1iZXIoZGF0YS5ob3RlbCkgKyBOdW1iZXIoZGF0YS5tZWFsKSArIE51bWJlcihkYXRhLnRyYW5zcG9ydGF0aW9uKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRU1EcyArPSBOdW1iZXIoZGF0YS5ob3RlbCkgKyBOdW1iZXIoZGF0YS5tZWFsKSArIE51bWJlcihkYXRhLnRyYW5zcG9ydGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb3VudEVNRDpcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuc2VsZWN0ZWRFTURzKSk7XG4gICAgICAgICAgICAgICAgcGF4LkNvbXBlbnNhdGlvblJlYXNvbiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgcGF4LklzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdEFsbFBheCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuU2VsZWN0ZWRQYXhjb3VudCA9IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIubGVuZ3RoO1xuICAgICAgICB0aGlzLnNlbGVjdGVkUGFzc2VuZ2VyQ291bnQgPSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aDtcbiAgICAgICAgY29uc29sZS5sb2coXCJDb3VudDE6XCIgKyB0aGlzLnNlbGVjdGVkRU1Ecyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIpO1xuICAgIH1cblxuXG4gICAgaXNzdWVDb21wZW5zYXRpb25Db25maXJtYXRpb24oKSB7XG4gICAgICAgIGRpYWxvZ3MuY29uZmlybShJc3N1ZUNvbXBlbnNhdGlvbkNvbXBvbmVudC5JU1NVRUNPTVBFTlNBVElPTlRPQVNUKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRpYWxvZyByZXN1bHQ6IFwiICsgcmVzdWx0KTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzc3VlQ29tcGVuc2F0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpc3N1ZUNvbXBlbnNhdGlvbkZvck9yZGVySWRDb25maXJtYXRpb24oKSB7XG4gICAgICAgIGRpYWxvZ3MuY29uZmlybShJc3N1ZUNvbXBlbnNhdGlvbkNvbXBvbmVudC5JU1NVRUNPTVBFTlNBVElPTlRPQVNUKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRpYWxvZyByZXN1bHQ6IFwiICsgcmVzdWx0KTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzc3VlQ29tcGVuc2F0aW9uRm9yT3JkZXJJZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25DaGFuZ2VGb3JBbW91bnQoYXJnczogYW55LCBpbmRleDogYW55LCBmaWVsZDogYW55LCBpdGVtOiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCkge1xuICAgICAgICBpZiAodGhpcy5Jc0VkaXRhYmxlID09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuTW9uZXRyYXJ5RW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChmaWVsZCA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5Nb25ldHJhcnlFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5WYWxpZE1vbmV0YXJ5W2luZGV4XSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLk1vbmV0cmFyeUVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5Nb25ldGFyeWRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLlZhbGlkTW9uZXRhcnlbaW5kZXhdID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgvXlswLTldKyQvKTtcbiAgICAgICAgICAgIHZhciB0ZXN0ID0gcmVnLnRlc3QoZmllbGQpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJmbGlnaHRudW1cIiArIHRlc3QpO1xuICAgICAgICAgICAgaWYgKHRlc3QgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGQgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlZhbGlkTW9uZXRhcnlbaW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSXNzdWVDb21wZW5zYXRpb25Db21wb25lbnQuTlVNQkVSVkFMSURBVElPTlRPQVNUKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuTW9uZXRyYXJ5RW1wdHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVmFsaWRNb25ldGFyeVtpbmRleF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5Nb25ldHJhcnlFbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLlZhbGlkTW9uZXRhcnlbaW5kZXhdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZE1vbmV0YXJ5ID0gZmllbGQ7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0ubW9uZXRhcnlJbml0aWFsVmFsdWUgIT0gZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5pc01vbmV0YXJ5T3ZlcnJpZGRlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5pc01vbmV0YXJ5T3ZlcnJpZGRlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLk1vbmV0YXJ5T3ZlcnJpZGVSZWFzb24gPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLm1vbmV0YXJ5VGVtcFZhbHVlID0gZmllbGQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNb25ldGFyeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxIb3RlbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNZWFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFRyYW5zcG9ydCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSXNzdWVDb21wZW5zYXRpb25QYXhMaXN0LmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTW9uZXRhcnkgKz0gTnVtYmVyKGRhdGEubW9uZXRhcnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbEhvdGVsICs9IE51bWJlcihkYXRhLmhvdGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNZWFsICs9IE51bWJlcihkYXRhLm1lYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFRyYW5zcG9ydCArPSBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaWVsZCA+IGl0ZW0ubW9uZXRhcnlIaWdoZXJMaW1pdCB8fCBmaWVsZCA8IGl0ZW0ubW9uZXRhcnlMb3dlckxpbWl0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Nb25ldHJhcnlFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVmFsaWRNb25ldGFyeVtpbmRleF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5tb25ldGFyeUxvd2VyTGltaXQgPT0gMCAmJiBpdGVtLm1vbmV0YXJ5SGlnaGVyTGltaXQgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSB0aW1lci5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLm1vbmV0YXJ5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSXNzdWVDb21wZW5zYXRpb25Db21wb25lbnQuQ09NUEVOU0FUSU9OTkFUT0FTVCkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSXNzdWVDb21wZW5zYXRpb25Db21wb25lbnQuTVVTVEJFVE9BU1QgKyBpdGVtLm1vbmV0YXJ5TG93ZXJMaW1pdCArIFwiIHRvIFwiICsgaXRlbS5tb25ldGFyeUhpZ2hlckxpbWl0KS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlY6XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLk1vbmV0cmFyeUVtcHR5KSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlI6XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLk1vbmV0YXJ5ZGlydHkpKTtcbiAgICAgICAgICAgIC8vIH0vLyBpdGVtLklzU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIG9uQ2hhbmdlRm9ySG90ZWwoYXJnczogYW55LCBpbmRleDogYW55LCBmaWVsZDogYW55LCBpdGVtOiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCkge1xuICAgICAgICBpZiAodGhpcy5Jc0VkaXRhYmxlID09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuaG90ZWxFbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGZpZWxkID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhvdGVsRW1wdHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuVmFsaWRIb3RlbFtpbmRleF0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ob3RlbEVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5ob3RlbGRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLlZhbGlkSG90ZWxbaW5kZXhdID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgvXlswLTldKyQvKTtcbiAgICAgICAgICAgIHZhciB0ZXN0ID0gcmVnLnRlc3QoZmllbGQpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJmbGlnaHRudW1cIiArIHRlc3QpO1xuICAgICAgICAgICAgaWYgKHRlc3QgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGQgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChJc3N1ZUNvbXBlbnNhdGlvbkNvbXBvbmVudC5OVU1CRVJWQUxJREFUSU9OVE9BU1QpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5WYWxpZEhvdGVsW2luZGV4XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG90ZWxFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5WYWxpZEhvdGVsW2luZGV4XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ob3RlbEVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuVmFsaWRIb3RlbFtpbmRleF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLlNlbGN0ZWRIb3RlbCA9IGZpZWxkO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLmhvdGVsSW5pdGlhbFZhbHVlICE9IGZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaXNIb3RlbE92ZXJyaWRkZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaXNIb3RlbE92ZXJyaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5Ib3RlbE92ZXJyaWRlUmVhc29uID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5ob3RlbFRlbXBWYWx1ZSA9IGZpZWxkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTW9uZXRhcnkgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSG90ZWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTWVhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxUcmFuc3BvcnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLklzc3VlQ29tcGVuc2F0aW9uUGF4TGlzdC5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE1vbmV0YXJ5ICs9IE51bWJlcihkYXRhLm1vbmV0YXJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxIb3RlbCArPSBOdW1iZXIoZGF0YS5ob3RlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTWVhbCArPSBOdW1iZXIoZGF0YS5tZWFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxUcmFuc3BvcnQgKz0gTnVtYmVyKGRhdGEudHJhbnNwb3J0YXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmllbGQgPiBpdGVtLmhvdGVsSGlnaGVyTGltaXQgfHwgZmllbGQgPCBpdGVtLmhvdGVsTG93ZXJMaW1pdCkge1xuICAgICAgICAgICAgICAgIGlmIChmaWVsZCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG90ZWxFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVmFsaWRIb3RlbFtpbmRleF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5ob3RlbExvd2VyTGltaXQgPT0gMCAmJiBpdGVtLmhvdGVsSGlnaGVyTGltaXQgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSB0aW1lci5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmhvdGVsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSXNzdWVDb21wZW5zYXRpb25Db21wb25lbnQuQ09NUEVOU0FUSU9OTkFUT0FTVCkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSXNzdWVDb21wZW5zYXRpb25Db21wb25lbnQuTVVTVEJFVE9BU1QgKyBpdGVtLmhvdGVsTG93ZXJMaW1pdCArIFwiIHRvIFwiICsgaXRlbS5ob3RlbEhpZ2hlckxpbWl0KS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgb25DaGFuZ2VGb3JNZWFsKGFyZ3M6IGFueSwgaW5kZXg6IGFueSwgZmllbGQ6IGFueSwgaXRlbTogQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QpIHtcbiAgICAgICAgaWYgKHRoaXMuSXNFZGl0YWJsZSA9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLm1lYWxFbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGZpZWxkID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1lYWxFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5WYWxpZE1lYWxbaW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubWVhbEVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5tZWFsZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuVmFsaWRNZWFsW2luZGV4XSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoL15bMC05XSskLyk7XG4gICAgICAgICAgICB2YXIgdGVzdCA9IHJlZy50ZXN0KGZpZWxkKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZmxpZ2h0bnVtXCIgKyB0ZXN0KTtcbiAgICAgICAgICAgIGlmICh0ZXN0ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSXNzdWVDb21wZW5zYXRpb25Db21wb25lbnQuTlVNQkVSVkFMSURBVElPTlRPQVNUKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVmFsaWRNZWFsW2luZGV4XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWVhbEVtcHR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlZhbGlkTWVhbFtpbmRleF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZWFsRW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5WYWxpZE1lYWxbaW5kZXhdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZE1lYWwgPSBmaWVsZDtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5tZWFsSW5pdGlhbFZhbHVlICE9IGZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaXNNZWFsT3ZlcnJpZGRlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5pc01lYWxPdmVycmlkZGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uTWVhbE92ZXJyaWRlUmVhc29uID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5tZWFsVGVtcFZhbHVlID0gZmllbGQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNb25ldGFyeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxIb3RlbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNZWFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFRyYW5zcG9ydCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSXNzdWVDb21wZW5zYXRpb25QYXhMaXN0LmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTW9uZXRhcnkgKz0gTnVtYmVyKGRhdGEubW9uZXRhcnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbEhvdGVsICs9IE51bWJlcihkYXRhLmhvdGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNZWFsICs9IE51bWJlcihkYXRhLm1lYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFRyYW5zcG9ydCArPSBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaWVsZCA+IGl0ZW0ubWVhbEhpZ2hlckxpbWl0IHx8IGZpZWxkIDwgaXRlbS5tZWFsTG93ZXJMaW1pdCkge1xuICAgICAgICAgICAgICAgIGlmIChmaWVsZCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWVhbEVtcHR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5WYWxpZE1lYWxbaW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLm1lYWxMb3dlckxpbWl0ID09IDAgJiYgaXRlbS5tZWFsSGlnaGVyTGltaXQgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSB0aW1lci5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLm1lYWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChJc3N1ZUNvbXBlbnNhdGlvbkNvbXBvbmVudC5DT01QRU5TQVRJT05OQVRPQVNUKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChJc3N1ZUNvbXBlbnNhdGlvbkNvbXBvbmVudC5NVVNUQkVUT0FTVCArIGl0ZW0ubWVhbExvd2VyTGltaXQgKyBcIiB0byBcIiArIGl0ZW0ubWVhbEhpZ2hlckxpbWl0KS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgb25DaGFuZ2VGb3JUcmFuc3BvcnQoYXJnczogYW55LCBpbmRleDogYW55LCBmaWVsZDogYW55LCBpdGVtOiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCkge1xuICAgICAgICBpZiAodGhpcy5Jc0VkaXRhYmxlID09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNwb3J0RW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChmaWVsZCA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc3BvcnRFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5WYWxpZHRyYW5zcG9ydFtpbmRleF0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc3BvcnRFbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNwb3J0ZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuVmFsaWR0cmFuc3BvcnRbaW5kZXhdID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgvXlswLTldKyQvKTtcbiAgICAgICAgICAgIHZhciB0ZXN0ID0gcmVnLnRlc3QoZmllbGQpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJmbGlnaHRudW1cIiArIHRlc3QpO1xuICAgICAgICAgICAgaWYgKHRlc3QgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGQgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChJc3N1ZUNvbXBlbnNhdGlvbkNvbXBvbmVudC5OVU1CRVJWQUxJREFUSU9OVE9BU1QpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5WYWxpZHRyYW5zcG9ydFtpbmRleF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zcG9ydEVtcHR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlZhbGlkdHJhbnNwb3J0W2luZGV4XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zcG9ydEVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuVmFsaWR0cmFuc3BvcnRbaW5kZXhdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFRyYW5zcG9ydCA9IGZpZWxkO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnRyYW5zcG9ydGF0aW9uSW5pdGlhbFZhbHVlICE9IGZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaXNUcmFuc3BvcnRPdmVycmlkZGVuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmlzVHJhbnNwb3J0T3ZlcnJpZGRlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLlRyYW5zcG9ydE92ZXJyaWRlUmVhc29uID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS50cmFuc3BvcnRhdGlvblRlbXBWYWx1ZSA9IGZpZWxkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTW9uZXRhcnkgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSG90ZWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTWVhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxUcmFuc3BvcnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLklzc3VlQ29tcGVuc2F0aW9uUGF4TGlzdC5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE1vbmV0YXJ5ICs9IE51bWJlcihkYXRhLm1vbmV0YXJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxIb3RlbCArPSBOdW1iZXIoZGF0YS5ob3RlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTWVhbCArPSBOdW1iZXIoZGF0YS5tZWFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxUcmFuc3BvcnQgKz0gTnVtYmVyKGRhdGEudHJhbnNwb3J0YXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmllbGQgPiBpdGVtLnRyYW5zcG9ydGF0aW9uSGlnaGVyTGltaXQgfHwgZmllbGQgPCBpdGVtLnRyYW5zcG9ydGF0aW9uTG93ZXJMaW1pdCkge1xuICAgICAgICAgICAgICAgIGlmIChmaWVsZCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNwb3J0RW1wdHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5WYWxpZHRyYW5zcG9ydFtpbmRleF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS50cmFuc3BvcnRhdGlvbkxvd2VyTGltaXQgPT0gMCAmJiBpdGVtLnRyYW5zcG9ydGF0aW9uSGlnaGVyTGltaXQgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSB0aW1lci5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnRyYW5zcG9ydGF0aW9uID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSXNzdWVDb21wZW5zYXRpb25Db21wb25lbnQuQ09NUEVOU0FUSU9OTkFUT0FTVCkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSXNzdWVDb21wZW5zYXRpb25Db21wb25lbnQuTVVTVEJFVE9BU1QgKyBpdGVtLnRyYW5zcG9ydGF0aW9uTG93ZXJMaW1pdCArIFwiIHRvIFwiICsgaXRlbS50cmFuc3BvcnRhdGlvbkhpZ2hlckxpbWl0KS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaXNzdWVDb21wZW5zYXRpb24oKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHRoaXMuRmxpZ2h0SGVhZGVySW5mbyA9IHRoaXMuX3NoYXJlZC5nZXRGbGlnaHRIZWFkZXJJbmZvKCk7XG4gICAgICAgICAgICB2YXIgc3RhcnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBDdXJEYXRlID0gbW9tZW50KHN0YXJ0RGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKEN1ckRhdGUpXG4gICAgICAgICAgICBsZXQgYWdlbnRQcm9maWxlID0gdGhpcy5fc2hhcmVkLkdldFVzZXJQcm9maWxlKCk7XG4gICAgICAgICAgICBsZXQgSXNzdWVDb21wZW5zYXRpb25TdHJ1Y3R1cmUgPSBDb252ZXJ0ZXJzLmNvbnZlcnRUb0lzc3VlQ29tcGVuc2F0aW9uKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIsIHRoaXMuRmxpZ2h0SGVhZGVySW5mbywgQ3VyRGF0ZSwgYWdlbnRQcm9maWxlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSXNzdWVDb21wZW5zYXRpb24gUmVxOlwiICsgSlNPTi5zdHJpbmdpZnkoSXNzdWVDb21wZW5zYXRpb25TdHJ1Y3R1cmUpKTtcbiAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UuUG9zdElzc3VlQ29tcGVuc2F0aW9ucyhJc3N1ZUNvbXBlbnNhdGlvblN0cnVjdHVyZSkuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJc3N1ZUNvbXBlbnNhdGlvbiBSZXM6XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuQmFkUmVxdWVzdCAhPSA0MDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuUmVzdWx0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIElzc3VlQ29tcGVuc2F0aW9uUmVzcG9uc2UgPSBDb252ZXJ0ZXJzLmNvbnZlcnRUb0lzc3VlQ29tcGVuc2F0aW9uUmVzcG9uc2UoZGF0YSwgdGhpcy5Jc3N1ZUNvbXBlbnNhdGlvbkZ1bGxQYXhMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRDb21wZW5zYXRpb25QYXhMaXN0KElzc3VlQ29tcGVuc2F0aW9uUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZXRvaXNzdWVjb21wZW5zYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5XYXJuaW5nc1swXS5NZXNzYWdlKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChkYXRhLkVycm9yc1swXS5NZXNzYWdlKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGRhdGEuZXJyTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgIC8vIHZhciBmbGlnaHREYXRlID0gIG1vbWVudCh0aGlzLkZsaWdodEhlYWRlckluZm8uRGVwYXJ0dXJlRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTs7XG4gICAgICAgICAgICAgICAgLy8gdmFyIGZsaWdodE51bWJlciA9dGhpcy5GbGlnaHRIZWFkZXJJbmZvLkZsaWdodE51bWJlcjtcbiAgICAgICAgICAgICAgICAvLyB2YXIgQWdlbnRMb2NhdGlvbiA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiU2VhcmNoTG9jYXRpb25cIixcIlwiKTtcbiAgICAgICAgICAgICAgICAvLyB2YXIgUGF4VHlwZT0gXCJDb21wZW5zYXRpb24gTGlzdFwiO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGZsaWdodERhdGUpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGZsaWdodE51bWJlcik7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coQWdlbnRMb2NhdGlvbik7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coUGF4VHlwZSk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5nZXRDb21wZW5zYXRpb25MaXN0KGZsaWdodERhdGUsIGZsaWdodE51bWJlciwgQWdlbnRMb2NhdGlvbiwgUGF4VHlwZSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZG50IGZpbmQgaW5mb3JtYXRpb25cIiArIGVycik7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldENvbXBlbnNhdGlvbkxpc3QoZGF0ZSwgZmxpZ2h0LCBsb2NhdGlvbiwgcGF4dHlwZSk6IHZvaWQge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJUeXBlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLmdldENvbXBlbnNhdGlvblBheExpc3QoZGF0ZSwgZmxpZ2h0LCBsb2NhdGlvbiwgcGF4dHlwZSkuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuUmVzdWx0cykge1xuICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuUmVzdWx0c1swXS5GbGlnaHRTZWdtZW50c1swXS5QYXNzZW5nZXJzID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiTmV0d29yayBFcnJvclwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBJc3N1ZUNvbXBlbnNhdGlvblJlc3BvbnNlID0gQ29udmVydGVycy5jb252ZXJ0VG9Jc3N1ZUNvbXBlbnNhdGlvblJlc3BvbnNlKGRhdGEsIHRoaXMuSXNzdWVDb21wZW5zYXRpb25GdWxsUGF4TGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0Q29tcGVuc2F0aW9uUGF4TGlzdChJc3N1ZUNvbXBlbnNhdGlvblJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGV0b2lzc3VlY29tcGVuc2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuZmxpZ2h0U3RhdHVzRm9yQ29tcGVuc2F0aW9uTGlzdChDb21wYW5zYXRpb25EZXRhaWxzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLkVycm9yc1swXS5NZXNzYWdlID09IFwiRGF0YSBub3QgZm91bmRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJObyBwYXNzZW5nZXIgZm91bmRcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZG50IGZpbmQgaW5mb3JtYXRpb25cIiArIGVycik7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgR2V0UGFzc2VuZ2VyVHlwZSBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgR2V0UGFzc2VuZ2VyVHlwZSBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xuICAgICAgICB9XG4gICAgfVxuICBcbiAgICBzb3J0QmFzZWRPblBheE5hbWUoKSB7XG4gICAgICAgIHZhciBpc0FzYzogbnVtYmVyID0gdGhpcy5uYW1lU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMubmFtZVNvcnRJbmRpY2F0b3IgPSB0aGlzLm5hbWVTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcbiAgICAgICAgdGhpcy5zc3JTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMudGllclNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5jbGFzc1NvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5vcmRlcklkU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLklzc3VlQ29tcGVuc2F0aW9uUGF4TGlzdC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICB2YXIgdmFsMSA9IGEuRnVsbE5hbWU7XG4gICAgICAgICAgICB2YXIgdmFsMiA9IGIuRnVsbE5hbWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2YWwxICsgXCIgXCIgKyB2YWwyKTtcbiAgICAgICAgICAgIGlmIChpc0FzYyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPCB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh2YWwxID4gdmFsMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzb3J0QmFzZWRPblNTUigpIHtcbiAgICAgICAgdmFyIGlzQXNjOiBudW1iZXIgPSB0aGlzLnNzclNvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xuICAgICAgICB0aGlzLnNzclNvcnRJbmRpY2F0b3IgPSB0aGlzLnNzclNvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xuICAgICAgICB0aGlzLm5hbWVTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMudGllclNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5jbGFzc1NvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5vcmRlcklkU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLklzc3VlQ29tcGVuc2F0aW9uUGF4TGlzdC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICB2YXIgdmFsMSA9IGEuU1NSO1xuICAgICAgICAgICAgdmFyIHZhbDIgPSBiLlNTUjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbDEgKyBcIiBcIiArIHZhbDIpO1xuICAgICAgICAgICAgaWYgKGlzQXNjID09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsMSA8IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPiB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNvcnRCYXNlZE9uVGllcigpIHtcbiAgICAgICAgdmFyIGlzQXNjOiBudW1iZXIgPSB0aGlzLnRpZXJTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcbiAgICAgICAgdGhpcy50aWVyU29ydEluZGljYXRvciA9IHRoaXMudGllclNvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xuICAgICAgICB0aGlzLnNzclNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5uYW1lU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLmNsYXNzU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLm9yZGVySWRTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMuSXNzdWVDb21wZW5zYXRpb25QYXhMaXN0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciB2YWwxID0gYS5UaWVyO1xuICAgICAgICAgICAgdmFyIHZhbDIgPSBiLlRpZXI7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2YWwxICsgXCIgXCIgKyB2YWwyKTtcbiAgICAgICAgICAgIGlmIChpc0FzYyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPCB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh2YWwxID4gdmFsMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzb3J0QmFzZWRPbkNsYXNzKCkge1xuICAgICAgICB2YXIgaXNBc2M6IG51bWJlciA9IHRoaXMuY2xhc3NTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcbiAgICAgICAgdGhpcy5jbGFzc1NvcnRJbmRpY2F0b3IgPSB0aGlzLmNsYXNzU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMuc3NyU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLnRpZXJTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMubmFtZVNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5vcmRlcklkU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLklzc3VlQ29tcGVuc2F0aW9uUGF4TGlzdC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICB2YXIgdmFsMSA9IGEuQ2FiaW47XG4gICAgICAgICAgICB2YXIgdmFsMiA9IGIuQ2FiaW47XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2YWwxICsgXCIgXCIgKyB2YWwyKTtcbiAgICAgICAgICAgIGlmIChpc0FzYyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPCB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh2YWwxID4gdmFsMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzb3J0QmFzZWRPbk9yZGVySWQoKSB7XG4gICAgICAgIHZhciBpc0FzYzogbnVtYmVyID0gdGhpcy5vcmRlcklkU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMub3JkZXJJZFNvcnRJbmRpY2F0b3IgPSB0aGlzLm9yZGVySWRTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcbiAgICAgICAgdGhpcy5zc3JTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMudGllclNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5jbGFzc1NvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5uYW1lU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLklzc3VlQ29tcGVuc2F0aW9uUGF4TGlzdC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICB2YXIgdmFsMSA9IGEuT3JkZXJJZDtcbiAgICAgICAgICAgIHZhciB2YWwyID0gYi5PcmRlcklkO1xuICAgICAgICAgICAgY29uc29sZS5sb2codmFsMSArIFwiIFwiICsgdmFsMik7XG4gICAgICAgICAgICBpZiAoaXNBc2MgPT0gMCkge1xuICAgICAgICAgICAgICAgIGlmICh2YWwxIDwgdmFsMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsMSA+IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaXNzdWVDb21wZW5zYXRpb25Gb3JPcmRlcklkKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XG4gICAgICAgICAgICB0aGlzLkZsaWdodEhlYWRlckluZm8gPSB0aGlzLl9zaGFyZWQuZ2V0RmxpZ2h0SGVhZGVySW5mbygpO1xuICAgICAgICAgICAgdmFyIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB2YXIgQ3VyRGF0ZSA9IG1vbWVudChzdGFydERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhDdXJEYXRlKVxuICAgICAgICAgICAgbGV0IElzc3VlQ29tcGVuc2F0aW9uU3RydWN0dXJlID0gQ29udmVydGVycy5jb252ZXJ0VG9Jc3N1ZUNvbXBlbnNhdGlvbkZvck9yZGVySWQodGhpcy5Db21wZW5zYXRpb25PcmRlckRldGFpbHMsIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIsIHRoaXMuRmxpZ2h0SGVhZGVySW5mbywgQ3VyRGF0ZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIklzc3VlQ29tcGVuc2F0aW9uIFJlcTpcIiArIEpTT04uc3RyaW5naWZ5KElzc3VlQ29tcGVuc2F0aW9uU3RydWN0dXJlKSk7XG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLlBvc3RJc3N1ZUNvbXBlbnNhdGlvbnMoSXNzdWVDb21wZW5zYXRpb25TdHJ1Y3R1cmUpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSXNzdWVDb21wZW5zYXRpb24gUmVzOlwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLkJhZFJlcXVlc3QgIT0gNDAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBJc3N1ZUNvbXBlbnNhdGlvblJlc3BvbnNlID0gQ29udmVydGVycy5jb252ZXJ0VG9Jc3N1ZUNvbXBlbnNhdGlvblJlc3BvbnNlKGRhdGEsIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLnNldENvbXBlbnNhdGlvblBheExpc3QoSXNzdWVDb21wZW5zYXRpb25SZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRldG9pc3N1ZWNvbXBlbnNhdGlvbkZvck9yZGVySWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChkYXRhLmVyck1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvblwiICsgZXJyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2VsZWN0aW5nQWxsUGF4KCkge1xuICAgICAgICBpZiAodGhpcy5Jc0xhYmVsRmllbGQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gdGhpcy5zZWxlY3RlZEVNRHMgPSAwO1xuICAgICAgICAgICAgLy8gdGhpcy5TZWxlY3RlZFBhc3NlbmdlciA9IFtdO1xuICAgICAgICAgICAgLy8gdGhpcy5Jc3N1ZUNvbXBlbnNhdGlvblBheExpc3QuZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgIC8vICAgICBkYXRhLklzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIH0pXG4gICAgICAgICAgICAvLyB0aGlzLklzc3VlQ29tcGVuc2F0aW9uRnVsbFBheExpc3QuZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgIC8vICAgICBkYXRhLklzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIH0pXG4gICAgICAgICAgICB2YXIgaXNJbmVsaWdpYmxlU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICh0aGlzLlNlbGVjdEFsbFBheCA9PSBmYWxzZSAmJiB0aGlzLlNlbGVjdEFsbFBheFZhciA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0QWxsUGF4VmFyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB2YXIgZXhjZWVkTGltaXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLklzc3VlQ29tcGVuc2F0aW9uUGF4TGlzdC5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWRhdGEuSXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvdGFsRW1kczogbnVtYmVyID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLm1vbmV0YXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxFbWRzID0gTnVtYmVyKHRoaXMuc2VsZWN0ZWRFTURzKSArIE51bWJlcihkYXRhLmhvdGVsKSArIE51bWJlcihkYXRhLm1lYWwpICsgTnVtYmVyKGRhdGEudHJhbnNwb3J0YXRpb24pICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxFbWRzID0gTnVtYmVyKHRoaXMuc2VsZWN0ZWRFTURzKSArIE51bWJlcihkYXRhLmhvdGVsKSArIE51bWJlcihkYXRhLm1lYWwpICsgTnVtYmVyKGRhdGEudHJhbnNwb3J0YXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvdGFsRW1kcyA8PSBJc3N1ZUNvbXBlbnNhdGlvbkNvbXBvbmVudC5NYXhFTURJc3N1ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5tb25ldGFyeSA9PSAwICYmIGRhdGEuaG90ZWwgPT0gMCAmJiBkYXRhLm1lYWwgPT0gMCAmJiBkYXRhLnRyYW5zcG9ydGF0aW9uID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNJbmVsaWdpYmxlU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLklzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RBbGxQYXggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5tb25ldGFyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVNRHMgKz0gTnVtYmVyKGRhdGEuaG90ZWwpICsgTnVtYmVyKGRhdGEubWVhbCkgKyBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbikgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVNRHMgKz0gTnVtYmVyKGRhdGEuaG90ZWwpICsgTnVtYmVyKGRhdGEubWVhbCkgKyBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5Jc1NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhjZWVkTGltaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRvYXN0Lm1ha2VUZXh0KElzc3VlQ29tcGVuc2F0aW9uQ29tcG9uZW50Lk1heEVNRElzc3VlZCArIFwiRU1EJ3Mgc2VsZWN0ZWRcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBpZiAoZXhjZWVkTGltaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSXNzdWVDb21wZW5zYXRpb25Db21wb25lbnQuTWF4RU1ESXNzdWVkICsgXCIgRU1EJ3Mgc2VsZWN0ZWRcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RBbGxQYXhWYXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdEFsbFBheCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuSXNzdWVDb21wZW5zYXRpb25GdWxsUGF4TGlzdC5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLklzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLklzc3VlQ29tcGVuc2F0aW9uUGF4TGlzdC5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLklzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3NlbmdlciA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRU1EcyA9IDA7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLklzc3VlQ29tcGVuc2F0aW9uRnVsbFBheExpc3QubGVuZ3RoID09PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCkgdGhpcy5TZWxlY3RBbGxQYXggPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmKGlzSW5lbGlnaWJsZVNlbGVjdGVkKXtcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiSW5lbGlnaWJsZSBQYXNzZW5nZXIocykgYXJlIG5vdCBzZWxlY3RlZC5cIikuc2hvdygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuU2VsZWN0ZWRQYXhjb3VudCA9IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIubGVuZ3RoO1xuICAgICAgICB0aGlzLnNlbGVjdGVkUGFzc2VuZ2VyQ291bnQgPSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aDtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5TZWxlY3RlZFBhc3Nlbmdlcik7XG4gICAgfVxuICAgIC8vIG9uQmx1cihhcmdzKSB7XG4gICAgLy8gICAgIC8vIGJsdXIgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgdXNlciBsZWF2ZXMgdGhlIFRleHRGaWVsZFxuICAgIC8vICAgICAvLyBjb25zdCB0ZXh0RmllbGQgPSBhcmdzLm9iamVjdDtcbiAgICAvLyAgICAgLy8gdGV4dEZpZWxkLmRpc21pc3NTb2Z0SW5wdXQoKTtcbiAgICAvLyAgICAgdGhpcy5vdmVyaWRlcmVhc29uZm9ybWVhbChhcmdzLDMpO1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhcIm9uQmx1ciBldmVudFwiKTtcbiAgICAvLyB9XG4gICAgbmF2aWdhdGV0b2FkZGl0aW9uYWxkZXRhaWxzKFBheGl0ZW06IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLklzRWRpdGFibGUgPT0gdHJ1ZSAmJiBQYXhpdGVtLklzU2VsZWN0ZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gUGF4aXRlbS5Jc1NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBwcmVQYWdlOiBzdHJpbmcgPSBcIkJSRVBhZ2VcIjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVlwiICsgUGF4aXRlbSk7XG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY29tcGVuc2F0aW9uYWRkaXRpb25hbGRldGFpbHNcIl0sIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgICAgICB9LCBxdWVyeVBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBcImRhdGFcIjogSlNPTi5zdHJpbmdpZnkoUGF4aXRlbSksXG4gICAgICAgICAgICAgICAgICAgIFwic2VsZWN0ZWRQQXhcIjogSlNPTi5zdHJpbmdpZnkodGhpcy5TZWxlY3RlZFBhc3NlbmdlciksXG4gICAgICAgICAgICAgICAgICAgIFwicHJlcGFnZVwiOiBwcmVQYWdlLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG4gICAgbmF2aWdhdGV0b2lzc3VlY29tcGVuc2F0aW9uKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiaXNzdWVjb21wZW5zYXRpb253aXRodGFiXCJdLCB7XG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgfSwgcXVlcnlQYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBcImRhdGFcIjogdGhpcy5PcmRlcklkLFxuICAgICAgICAgICAgICAgIC8vIFwicHJlcGFnZVwiOiBwcmVQYWdlLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfVxuICAgIG5hdmlnYXRldG9pc3N1ZWNvbXBlbnNhdGlvbkZvck9yZGVySWQoKTogdm9pZCB7XG4gICAgICAgIHZhciBwcmVQYWdlOiBzdHJpbmcgPSBcIk9yZGVySWRcIjtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImlzc3VlY29tcGVuc2F0aW9ud2l0aHRhYlwiXSwge1xuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH0sIHF1ZXJ5UGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgXCJkYXRhXCI6IHRoaXMuT3JkZXJJZCxcbiAgICAgICAgICAgICAgICBcInByZXBhZ2VcIjogcHJlUGFnZSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgIH1cbiAgICBuYXZpZ2F0ZVRvQ29tcGVuc2F0aW9uKCkge1xuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY29tcGVuc2F0aW9uXCJdLCB7XG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICBvdmVyaWRlcmVhc29uZm9ybW9uZXRhcnkoaXRlbTogQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QsIG46IG51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5pc0J1dHRvbkVuYWJsZWQgPT0gdHJ1ZSAmJiBpdGVtLmlzTW9uZXRhcnlPdmVycmlkZGVuID09IHRydWUpIHtcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBcIk90aGVyIERldGFpbHNcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIiogcmVxdWlyZWQgZmllbGRcIixcbiAgICAgICAgICAgICAgICBkZWZhdWx0VGV4dDogaXRlbS5Nb25ldGFyeU92ZXJyaWRlUmVhc29uLFxuICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJDb3B5IHRvIHNlbGVjdGVkIHBhc3NlbmdlciAmIFNhdmVcIixcbiAgICAgICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIlNhdmVcIixcbiAgICAgICAgICAgICAgICBuZXV0cmFsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgICAgICBpbnB1dFR5cGU6IGRpYWxvZ3MuaW5wdXRUeXBlLnRleHRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkaWFsb2dzLnByb21wdChvcHRpb25zKS50aGVuKChyZXN1bHQ6IGRpYWxvZ3MuUHJvbXB0UmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5yZXN1bHQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQudGV4dC50cmltKCkubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3ZlcmlkZXJlYXNvbmZvcm1vbmV0YXJ5KGl0ZW0sIG4pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJIZWxsbywgXCIgKyByZXN1bHQucmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSGVsbG8sIFwiICsgcmVzdWx0LnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5PdmVycmlkZVJlYXNvbiA9IHJlc3VsdC50ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5PdmVyUmlkZVJlYXNvbiA9IHJlc3VsdC50ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5yZXN1bHQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5tb25ldGFyeSA9IHRoaXMuU2VsZWN0ZWRNb25ldGFyeTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5Nb25ldGFyeU92ZXJyaWRlUmVhc29uID0gdGhpcy5PdmVyUmlkZVJlYXNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5tb25ldGFyeVRlbXBWYWx1ZSA9IHRoaXMuU2VsZWN0ZWRNb25ldGFyeTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5tb25ldGFyeVRlbXBWYWx1ZSA9IHRoaXMuU2VsZWN0ZWRNb25ldGFyeTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLk1vbmV0YXJ5T3ZlcnJpZGVSZWFzb24gPSB0aGlzLk92ZXJSaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNb25ldGFyeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxIb3RlbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNZWFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFRyYW5zcG9ydCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSXNzdWVDb21wZW5zYXRpb25QYXhMaXN0LmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTW9uZXRhcnkgKz0gTnVtYmVyKGRhdGEubW9uZXRhcnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbEhvdGVsICs9IE51bWJlcihkYXRhLmhvdGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNZWFsICs9IE51bWJlcihkYXRhLm1lYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFRyYW5zcG9ydCArPSBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ubW9uZXRhcnkgPSBpdGVtLm1vbmV0YXJ5VGVtcFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmlzTW9uZXRhcnlPdmVycmlkZGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgb3ZlcmlkZXJlYXNvbmZvcmhvdGVsKGl0ZW06IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0LCBuOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNCdXR0b25FbmFibGVkID09IHRydWUgJiYgaXRlbS5pc0hvdGVsT3ZlcnJpZGRlbiA9PSB0cnVlKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJPdGhlciBEZXRhaWxzXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCIqIHJlcXVpcmVkIGZpZWxkXCIsXG4gICAgICAgICAgICAgICAgZGVmYXVsdFRleHQ6IGl0ZW0uSG90ZWxPdmVycmlkZVJlYXNvbixcbiAgICAgICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiQ29weSB0byBzZWxlY3RlZCBwYXNzZW5nZXIgJiBTYXZlXCIsXG4gICAgICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJTYXZlXCIsXG4gICAgICAgICAgICAgICAgbmV1dHJhbEJ1dHRvblRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICAgICAgaW5wdXRUeXBlOiBkaWFsb2dzLmlucHV0VHlwZS50ZXh0XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGlhbG9ncy5wcm9tcHQob3B0aW9ucykudGhlbigocmVzdWx0OiBkaWFsb2dzLlByb21wdFJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucmVzdWx0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnRleHQudHJpbSgpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm92ZXJpZGVyZWFzb25mb3Job3RlbChpdGVtLCBuKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSGVsbG8sIFwiICsgcmVzdWx0LnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhlbGxvLCBcIiArIHJlc3VsdC50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uT3ZlcnJpZGVSZWFzb24gPSByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuT3ZlclJpZGVSZWFzb24gPSByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucmVzdWx0ID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuaG90ZWwgPSB0aGlzLlNlbGN0ZWRIb3RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5Ib3RlbE92ZXJyaWRlUmVhc29uID0gdGhpcy5PdmVyUmlkZVJlYXNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5ob3RlbFRlbXBWYWx1ZSA9IHRoaXMuU2VsY3RlZEhvdGVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLkhvdGVsT3ZlcnJpZGVSZWFzb24gPSB0aGlzLk92ZXJSaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uaG90ZWxUZW1wVmFsdWUgPSB0aGlzLlNlbGN0ZWRIb3RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTW9uZXRhcnkgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSG90ZWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTWVhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxUcmFuc3BvcnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLklzc3VlQ29tcGVuc2F0aW9uUGF4TGlzdC5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE1vbmV0YXJ5ICs9IE51bWJlcihkYXRhLm1vbmV0YXJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxIb3RlbCArPSBOdW1iZXIoZGF0YS5ob3RlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTWVhbCArPSBOdW1iZXIoZGF0YS5tZWFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxUcmFuc3BvcnQgKz0gTnVtYmVyKGRhdGEudHJhbnNwb3J0YXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmhvdGVsID0gaXRlbS5ob3RlbFRlbXBWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5pc0hvdGVsT3ZlcnJpZGRlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVNRHMgPSAwO1xuICAgICAgICAgICAgdGhpcy5Jc3N1ZUNvbXBlbnNhdGlvblBheExpc3QuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKHBheCwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBheC5tb25ldGFyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVNRHMgPSBOdW1iZXIocGF4LmhvdGVsKSArIE51bWJlcihwYXgubWVhbCkgKyBOdW1iZXIocGF4LnRyYW5zcG9ydGF0aW9uKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRU1EcyA9IE51bWJlcihwYXguaG90ZWwpICsgTnVtYmVyKHBheC5tZWFsKSArIE51bWJlcihwYXgudHJhbnNwb3J0YXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRU1EcyA+IElzc3VlQ29tcGVuc2F0aW9uQ29tcG9uZW50Lk1heEVNRElzc3VlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3NlbmdlciA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5Jc1NlbGVjdGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIG92ZXJpZGVyZWFzb25mb3JtZWFsKGl0ZW06IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0LCBuOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNCdXR0b25FbmFibGVkID09IHRydWUgJiYgaXRlbS5pc01lYWxPdmVycmlkZGVuID09IHRydWUpIHtcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBcIk90aGVyIERldGFpbHNcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIiogcmVxdWlyZWQgZmllbGRcIixcbiAgICAgICAgICAgICAgICBkZWZhdWx0VGV4dDogaXRlbS5NZWFsT3ZlcnJpZGVSZWFzb24sXG4gICAgICAgICAgICAgICAgb2tCdXR0b25UZXh0OiBcIkNvcHkgdG8gc2VsZWN0ZWQgcGFzc2VuZ2VyICYgU2F2ZVwiLFxuICAgICAgICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IFwiU2F2ZVwiLFxuICAgICAgICAgICAgICAgIG5ldXRyYWxCdXR0b25UZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgICAgIGlucHV0VHlwZTogZGlhbG9ncy5pbnB1dFR5cGUudGV4dFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRpYWxvZ3MucHJvbXB0KG9wdGlvbnMpLnRoZW4oKHJlc3VsdDogZGlhbG9ncy5Qcm9tcHRSZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnJlc3VsdCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC50ZXh0LnRyaW0oKS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdmVyaWRlcmVhc29uZm9ybWVhbChpdGVtLCBuKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSGVsbG8sIFwiICsgcmVzdWx0LnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhlbGxvLCBcIiArIHJlc3VsdC50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uT3ZlcnJpZGVSZWFzb24gPSByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuT3ZlclJpZGVSZWFzb24gPSByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucmVzdWx0ID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEubWVhbCA9IHRoaXMuU2VsZWN0ZWRNZWFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLm1lYWxUZW1wVmFsdWUgPSB0aGlzLlNlbGVjdGVkTWVhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5NZWFsT3ZlcnJpZGVSZWFzb24gPSB0aGlzLk92ZXJSaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLm1lYWxUZW1wVmFsdWUgPSB0aGlzLlNlbGVjdGVkTWVhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLk1lYWxPdmVycmlkZVJlYXNvbiA9IHRoaXMuT3ZlclJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE1vbmV0YXJ5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbEhvdGVsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE1lYWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsVHJhbnNwb3J0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc3N1ZUNvbXBlbnNhdGlvblBheExpc3QuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNb25ldGFyeSArPSBOdW1iZXIoZGF0YS5tb25ldGFyeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSG90ZWwgKz0gTnVtYmVyKGRhdGEuaG90ZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE1lYWwgKz0gTnVtYmVyKGRhdGEubWVhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsVHJhbnNwb3J0ICs9IE51bWJlcihkYXRhLnRyYW5zcG9ydGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5tZWFsID0gaXRlbS5tZWFsVGVtcFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmlzTWVhbE92ZXJyaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBvdmVyaWRlcmVhc29uZm9ydHJhbnNwb3J0KGl0ZW06IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0LCBuOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNCdXR0b25FbmFibGVkID09IHRydWUgJiYgaXRlbS5pc1RyYW5zcG9ydE92ZXJyaWRkZW4gPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiT3RoZXIgRGV0YWlsc1wiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiKiByZXF1aXJlZCBmaWVsZFwiLFxuICAgICAgICAgICAgICAgIGRlZmF1bHRUZXh0OiBpdGVtLlRyYW5zcG9ydE92ZXJyaWRlUmVhc29uLFxuICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJDb3B5IHRvIHNlbGVjdGVkIHBhc3NlbmdlciAmIFNhdmVcIixcbiAgICAgICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIlNhdmVcIixcbiAgICAgICAgICAgICAgICBuZXV0cmFsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgICAgICBpbnB1dFR5cGU6IGRpYWxvZ3MuaW5wdXRUeXBlLnRleHRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkaWFsb2dzLnByb21wdChvcHRpb25zKS50aGVuKChyZXN1bHQ6IGRpYWxvZ3MuUHJvbXB0UmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5yZXN1bHQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQudGV4dC50cmltKCkubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3ZlcmlkZXJlYXNvbmZvcnRyYW5zcG9ydChpdGVtLCBuKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSGVsbG8sIFwiICsgcmVzdWx0LnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhlbGxvLCBcIiArIHJlc3VsdC50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uT3ZlcnJpZGVSZWFzb24gPSByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuT3ZlclJpZGVSZWFzb24gPSByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucmVzdWx0ID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEudHJhbnNwb3J0YXRpb24gPSB0aGlzLlNlbGVjdGVkVHJhbnNwb3J0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLlRyYW5zcG9ydE92ZXJyaWRlUmVhc29uID0gdGhpcy5PdmVyUmlkZVJlYXNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS50cmFuc3BvcnRhdGlvblRlbXBWYWx1ZSA9IHRoaXMuU2VsZWN0ZWRUcmFuc3BvcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udHJhbnNwb3J0YXRpb25UZW1wVmFsdWUgPSB0aGlzLlNlbGVjdGVkVHJhbnNwb3J0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uVHJhbnNwb3J0T3ZlcnJpZGVSZWFzb24gPSB0aGlzLk92ZXJSaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNb25ldGFyeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxIb3RlbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNZWFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFRyYW5zcG9ydCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSXNzdWVDb21wZW5zYXRpb25QYXhMaXN0LmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTW9uZXRhcnkgKz0gTnVtYmVyKGRhdGEubW9uZXRhcnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbEhvdGVsICs9IE51bWJlcihkYXRhLmhvdGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNZWFsICs9IE51bWJlcihkYXRhLm1lYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFRyYW5zcG9ydCArPSBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udHJhbnNwb3J0YXRpb24gPSBpdGVtLnRyYW5zcG9ydGF0aW9uVGVtcFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmlzVHJhbnNwb3J0T3ZlcnJpZGRlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICB9XG4gICAgbmF2aWdhdGVUb1NldHRpbmcoKSB7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZXR0aW5nXCJdLCB7XG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbmF2aWdhdGVUb1NlYXJjaCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNDaGVja2luRGlzYWJsZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcInNlYXJjaFwiXSwge1xuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIG5hdmlnYXRlVG9EZXBhcnR1cmVzKCkge1xuICAgICAgICBpZiAodGhpcy5pc0dhdGVEaXNhYmxlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiZGVwYXJ0aG9tZVwiXSwge1xuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRpc3BsYXlTU1JzKGl0ZW06IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KSB7XG4gICAgICAgIGlmIChpdGVtLlNTUnNDb3VudCA+IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUlwiICsgSlNPTi5zdHJpbmdpZnkoaXRlbS5TU1JzKSk7XG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJTU1JzXCIsXG4gICAgICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgICAgICBhY3Rpb25zOiBpdGVtLlNTUnMsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcjogYW55KSB7XG4gICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci50b1N0cmluZygpO1xuICAgICAgICBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJTZXNzaW9uVGltZW91dFwiKSA+IC0xKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJTZXNzaW9uIFRpbWUgT3V0XCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGJlZW4gdGltZSBvdXRcIixcbiAgICAgICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIlwiXSwge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChlcnJvck1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==