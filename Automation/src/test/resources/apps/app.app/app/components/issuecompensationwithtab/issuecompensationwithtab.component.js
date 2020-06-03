"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var imageModule = require("image-source");
var fs = require("file-system");
var router_2 = require("nativescript-angular/router");
var page_1 = require("ui/page");
var dialogs = require("ui/dialogs");
var segmented_bar_1 = require("ui/segmented-bar");
var timer = require("timer");
//external modules and plugins
var ApplicationSettings = require("application-settings");
var moment = require("moment");
var Toast = require("nativescript-toast");
var zebra = require("nativescript-print-zebra");
//app references
var index_1 = require("../../shared/interface/index");
var index_2 = require("../../shared/services/index");
var index_3 = require("../../shared/utils/index");
var app_executiontime_1 = require("../../app.executiontime");
var app_constants_1 = require("../../app.constants");
var IssueCompensationWithTabComponent = /** @class */ (function () {
    // public IssueCompensationResponse: any;
    function IssueCompensationWithTabComponent(_configuration, _services, activatedRouter, _shared, page, routerExtensions, _timeoutService, router, _dataService, _service, route) {
        this._configuration = _configuration;
        this._services = _services;
        this.activatedRouter = activatedRouter;
        this._shared = _shared;
        this.page = page;
        this.routerExtensions = routerExtensions;
        this._timeoutService = _timeoutService;
        this.router = router;
        this._dataService = _dataService;
        this._service = _service;
        this.route = route;
        this.firsttab = new segmented_bar_1.SegmentedBarItem();
        this.secondtab = new segmented_bar_1.SegmentedBarItem();
        this.CompensationIssuedList = true;
        this.CompensationNotIssuedList = false;
        this.FlightInfoNotSet = false;
        this.SelectedPaxcount = 0;
        this.PaxList = new index_1.CompensationSearchModule.CompensationRootObject();
        this.selectedEMDs = 0;
        this.TotalPassengerCount = 0;
        this.selectedPassengerCount = 0;
        this.SelectedPassenger = [];
        this.IsHeaderInfo = false;
        this.IsFlightInfo = false;
        this.IsPaxReasonSelected = false;
        this.SearchCriteria = "Name";
        this.PassengerFliterCriteria = "All Passengers";
        this.EmailId = "";
        this.isEmailCopytoSelectPaxTrue = false;
        this.EmailIdSelectedPax = "";
        this.SelectAllPax = false;
        this.mealdirty = false;
        this.isOverrideReasonBlank = false;
        this.ValidMonetary = [];
        this.ValidHotel = [];
        this.ValidMeal = [];
        this.Validtransport = [];
        this.totalIssuedMonetary = 0;
        this.totalIssuedHotel = 0;
        this.totalIssuedMeal = 0;
        this.totalIssuedTransport = 0;
        this.totalNotIssuedMonetary = 0;
        this.totalNotIssuedHotel = 0;
        this.totalNotIssuedMeal = 0;
        this.totalNotIssuedTransport = 0;
        this.isButtonEnabled = false;
        this.CompensatedPaxCount = 0;
        this.totalMonetary = 0;
        this.totalHotel = 0;
        this.totalMeal = 0;
        this.totalTransport = 0;
        this.CompensationNotIssuedPaxCount = 0;
        this.nameSortIndicator = -1;
        this.ssrSortIndicator = -1;
        this.MonetraryEmpty = false;
        this.Monetarydirty = false;
        this.hotelEmpty = false;
        this.hoteldirty = false;
        this.mealEmpty = false;
        this.SelectAllPaxVar = false;
        // public isButtonEnabled: boolean = false;
        this.isEmailNotAvailable = false;
        this.IsEditable = false;
        this.IsLabelField = true;
        this.tierSortIndicator = -1;
        this.isEmailEnabled = false;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.transportEmpty = false;
        this.transportdirty = false;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.FlightHeaderInfo = new index_1.CompensationSearchModule.FlightModel();
        this.CompPaxList = [];
        this.CompPaxListIssued = [];
        this.CompPaxListIssuedFulList = [];
        this.CompPaxListNotIssued = [];
        this.CompPaxListNotIssuedFulList = [];
        this.CompensationPassengerList = [];
        this.IssueCompPaxList = [];
        this.loaderProgress = new index_1.LoaderProgress();
        this.apisdetails = [];
        this.firsttab.title = IssueCompensationWithTabComponent_1.COMPENSATIONFIRSTTAB;
        this.apisdetails.push(this.firsttab);
        this.secondtab.title = IssueCompensationWithTabComponent_1.COMPENSATIONSECONDTAB;
        this.apisdetails.push(this.secondtab);
    }
    IssueCompensationWithTabComponent_1 = IssueCompensationWithTabComponent;
    IssueCompensationWithTabComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.loaderProgress.initLoader(this.pageCont);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
        console.log("Flight" + JSON.stringify(this.FlightHeaderInfo));
        this.IssueCompPaxList = this._shared.getCompensationPaxList();
        this.activatedRouter.queryParams.subscribe(function (params) {
            if (params["date"] != null && params["date"] != "" && params["date"] != "undefined") {
                _this.flightdate = params["date"];
                console.log("new" + _this.flightdate);
            }
            if (params["flightnumber"] != null && params["flightnumber"] != "" && params["flightnumber"] != "undefined") {
                _this.flightnumber = params["flightnumber"];
                console.log("new 1" + _this.flightnumber);
            }
        });
        this.activatedRouter.queryParams.subscribe(function (params) {
            // this.PaxItem = JSON.parse(params["data"]);
            _this.PreviousPage = params["prepage"];
            _this.OrderId = params["data"];
            // this.PassengerName = this.PaxItem.FullName;
            console.log("v" + JSON.stringify(_this.OrderId));
        });
        if (this.PreviousPage == "OrderId") {
            this.IsHeaderInfo = true;
            this.IsFlightInfo = false;
            // this.CompensationOrderDetails = this._shared.GetCompensationOrderDeatils();
        }
        else {
            this.IsHeaderInfo = false;
            this.IsFlightInfo = true;
        }
        this.IssueCompPaxList.forEach(function (data, Index) {
            if (data.IsCompensationIssued == true) {
                if (data.monetary == 0 && data.hotel == 0 && data.meal == 0 && data.transportation == 0) {
                    _this.CompPaxListNotIssued.push(data);
                }
                else {
                    _this.CompPaxListIssued.push(data);
                    _this.TotalPassengerCount = _this.CompPaxListIssued.length;
                    _this.totalIssuedMonetary = _this.totalIssuedMonetary + Number(data.monetary);
                    _this.totalIssuedHotel += Number(data.hotel);
                    _this.totalIssuedMeal += Number(data.meal);
                    _this.totalIssuedTransport += Number(data.transportation);
                }
            }
            else {
                _this.CompPaxListNotIssued.push(data);
                _this.TotalPassengerCount = _this.CompPaxListNotIssued.length;
                _this.totalNotIssuedMonetary = _this.totalNotIssuedMonetary + Number(data.monetary);
                _this.totalNotIssuedHotel += Number(data.hotel);
                _this.totalNotIssuedMeal += Number(data.meal);
                _this.totalNotIssuedTransport += Number(data.transportation);
            }
        });
        this.CompPaxListIssuedFulList = this.CompPaxListIssued;
        this.CompPaxListNotIssuedFulList = this.CompPaxListNotIssued;
        this.apisdetails = [];
        this.CompensatedPaxCount = this.CompPaxListIssued.length;
        this.firsttab.title = IssueCompensationWithTabComponent_1.COMPENSATIONFIRSTTAB + "(" + this.CompensatedPaxCount + ")";
        ;
        this.apisdetails.push(this.firsttab);
        this.CompensationNotIssuedPaxCount = this.CompPaxListNotIssued.length;
        this.secondtab.title = IssueCompensationWithTabComponent_1.COMPENSATIONSECONDTAB + "(" + this.CompensationNotIssuedPaxCount + ")";
        ;
        this.apisdetails.push(this.secondtab);
    };
    IssueCompensationWithTabComponent.prototype.printEnabled = function () {
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
            return true;
        }
        else
            return false;
    };
    IssueCompensationWithTabComponent.prototype.isEditEnabled = function () {
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
            return true;
        }
        else
            return false;
    };
    IssueCompensationWithTabComponent.prototype.emailEnabled = function () {
        var _this = this;
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
            this.SelectedPassenger.forEach(function (data, Index) {
                if (data.monetary == 0) {
                    _this.isEmailEnabled = false;
                }
                else {
                    _this.isEmailEnabled = true;
                }
            });
        }
        else {
            this.isEmailEnabled = false;
        }
        if (this.isEmailEnabled == true) {
            return true;
        }
        else
            return false;
    };
    IssueCompensationWithTabComponent.prototype.displayProductActionDialogForSmartFilter = function () {
        var _this = this;
        var options = {
            title: "Smart filter option",
            cancelButtonText: "Cancel",
            actions: ["Name", "Order ID", "Class"],
        };
        dialogs.action(options).then(function (result) {
            if (result != "Cancel") {
                _this.SearchCriteria = result;
                console.log("res:" + JSON.stringify(_this.SearchCriteria));
            }
        });
    };
    IssueCompensationWithTabComponent.prototype.displayProductActionDialogForPrinter = function () {
        var hostedcheck = ApplicationSettings.getBoolean("isHostBoarding");
        if (hostedcheck) {
            this.printEMD();
        }
        else {
            this.bluetoothEMD();
        }
    };
    IssueCompensationWithTabComponent.prototype.displayDialogForFliterPassengerType = function () {
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
    IssueCompensationWithTabComponent.prototype.filter = function (args) {
        console.log("Name:" + JSON.stringify(args));
        var segBarElm = this.segbar.nativeElement;
        var index = segBarElm.selectedIndex;
        if (index == 0) {
            this.CompPaxListIssued = this.CompPaxListIssuedFulList;
            if (this.SearchCriteria == "Name") {
                if (args) {
                    var name_1 = args.toString().toUpperCase();
                    this.CompPaxListIssued = this.CompPaxListIssued.filter(function (r) { return r.GivenName.indexOf(name_1.trim()) >= 0 || r.LastName.indexOf(name_1.trim()) >= 0; });
                    this.CompPaxList = this.CompPaxListIssued;
                }
                else {
                    this.CompPaxListIssued = this.CompPaxListIssuedFulList;
                    this.CompPaxList = this.CompPaxListIssued;
                }
            }
            else if (this.SearchCriteria == "Order ID") {
                if (args) {
                    var name_2 = args.toString().toUpperCase();
                    this.CompPaxListIssued = this.CompPaxListIssued.filter(function (r) { return r.OrderId.indexOf(name_2.trim()) >= 0; });
                    this.CompPaxList = this.CompPaxListIssued;
                }
                else {
                    this.CompPaxListIssued = this.CompPaxListIssuedFulList;
                    this.CompPaxList = this.CompPaxListIssued;
                }
            }
            else {
                if (args) {
                    var name_3 = args.toString().toUpperCase();
                    this.CompPaxListIssued = this.CompPaxListIssued.filter(function (r) { return r.Cabin.indexOf(name_3.trim()) >= 0; });
                    this.CompPaxList = this.CompPaxListIssued;
                }
                else {
                    this.CompPaxListIssued = this.CompPaxListIssuedFulList;
                    this.CompPaxList = this.CompPaxListIssued;
                }
            }
            this.TotalPassengerCount = this.CompPaxList.length;
        }
        else {
            this.CompPaxListNotIssued = this.CompPaxListNotIssuedFulList;
            if (this.SearchCriteria == "Name") {
                if (args) {
                    var name_4 = args.toString().toUpperCase();
                    this.CompPaxListNotIssued = this.CompPaxListNotIssued.filter(function (r) { return r.GivenName.indexOf(name_4.trim()) >= 0 || r.LastName.indexOf(name_4.trim()) >= 0; });
                    this.CompPaxList = this.CompPaxListNotIssued;
                }
                else {
                    this.CompPaxListNotIssued = this.CompPaxListNotIssuedFulList;
                    this.CompPaxList = this.CompPaxListNotIssued;
                }
            }
            else if (this.SearchCriteria == "Order ID") {
                if (args) {
                    var name_5 = args.toString().toUpperCase();
                    this.CompPaxListNotIssued = this.CompPaxListNotIssued.filter(function (r) { return r.OrderId.indexOf(name_5.trim()) >= 0; });
                    this.CompPaxList = this.CompPaxListNotIssued;
                }
                else {
                    this.CompPaxListNotIssued = this.CompPaxListNotIssuedFulList;
                    this.CompPaxList = this.CompPaxListNotIssued;
                }
            }
            else {
                if (args) {
                    var name_6 = args.toString().toUpperCase();
                    this.CompPaxListNotIssued = this.CompPaxListNotIssued.filter(function (r) { return r.Cabin.indexOf(name_6.trim()) >= 0; });
                    this.CompPaxList = this.CompPaxListNotIssued;
                }
                else {
                    this.CompPaxListNotIssued = this.CompPaxListNotIssuedFulList;
                    this.CompPaxList = this.CompPaxListNotIssued;
                }
            }
            this.TotalPassengerCount = this.CompPaxList.length;
        }
    };
    IssueCompensationWithTabComponent.prototype.issueEnabled = function () {
        var _this = this;
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
                        _this.IsPaxReasonSelected = false;
                        // this.SelectAllPax = false;
                    }
                    else {
                        _this.IsPaxReasonSelected = true;
                    }
                });
            }
        }
        if (this.IsPaxReasonSelected == true) {
            return true;
        }
        else
            return false;
    };
    IssueCompensationWithTabComponent.prototype.toggleChecked = function (pax) {
        var _this = this;
        if (this.IsLabelField == true && this.CompensationNotIssuedList == true) {
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
                            if ((this.selectedEMDs + Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation) + 1) <= IssueCompensationWithTabComponent_1.MaxEMDIssued) {
                                pax.IsSelected = true;
                                this.SelectedPassenger.push(pax);
                                this.selectedEMDs += Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation) + 1;
                            }
                        }
                        else {
                            if ((this.selectedEMDs + Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation)) <= IssueCompensationWithTabComponent_1.MaxEMDIssued) {
                                pax.IsSelected = true;
                                this.SelectedPassenger.push(pax);
                                this.selectedEMDs += Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation);
                            }
                        }
                    }
                    if (this.CompPaxListNotIssued.length === this.SelectedPassenger.length)
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
            // this.SelectedPaxcount = this.SelectedPassenger.length;
            this.selectedPassengerCount = this.SelectedPassenger.length;
            console.log("Count1:" + this.selectedEMDs);
            console.log(this.SelectedPassenger);
        }
        if (this.CompensationIssuedList == true) {
            if (pax.IsSelected == false) {
                pax.IsSelected = true;
                if (this.isEmailCopytoSelectPaxTrue) {
                    pax.Email = this.EmailIdSelectedPax;
                }
                this.SelectedPassenger.push(pax);
                if (this.CompPaxListIssuedFulList.length === this.SelectedPassenger.length)
                    this.SelectAllPax = true;
                console.log("Len" + this.SelectedPassenger.length);
            }
            else {
                this.SelectedPassenger.splice(this.SelectedPassenger.indexOf(pax), 1);
                pax.IsSelected = false;
                this.SelectAllPax = false;
            }
            this.selectedPassengerCount = this.SelectedPassenger.length;
        }
    };
    IssueCompensationWithTabComponent.prototype.editable = function () {
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
            this.IsEditable = true;
            this.IsLabelField = false;
            console.log("Edit: " + this.IsEditable);
            console.log("Done:" + this.IsLabelField);
        }
    };
    IssueCompensationWithTabComponent.prototype.done = function () {
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
                if (_this.selectedEMDs > IssueCompensationWithTabComponent_1.MaxEMDIssued) {
                    data.IsSelected = false;
                    // this.SelectedPassenger.splice(this.SelectedPassenger.indexOf(data), 1)
                }
            });
            this.SelectedPassenger = [];
            this.CompPaxListNotIssued.forEach(function (paxData, Index) {
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
            // this.SelectedPaxcount = this.SelectedPassenger.length;
            console.dir(this.SelectedPassenger);
            console.log("Edit: " + this.IsEditable);
            console.log("Done:" + this.IsLabelField);
        }
    };
    IssueCompensationWithTabComponent.prototype.sortBasedOnPaxName = function () {
        var isAsc = this.nameSortIndicator == 0 ? 1 : 0;
        this.nameSortIndicator = this.nameSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.CompPaxList.sort(function (a, b) {
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
    IssueCompensationWithTabComponent.prototype.sortBasedOnSSR = function () {
        var isAsc = this.ssrSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = this.ssrSortIndicator == 0 ? 1 : 0;
        this.nameSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.CompPaxList.sort(function (a, b) {
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
    IssueCompensationWithTabComponent.prototype.sortBasedOnTier = function () {
        var isAsc = this.tierSortIndicator == 0 ? 1 : 0;
        this.tierSortIndicator = this.tierSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.nameSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.CompPaxList.sort(function (a, b) {
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
    IssueCompensationWithTabComponent.prototype.sortBasedOnClass = function () {
        var isAsc = this.classSortIndicator == 0 ? 1 : 0;
        this.classSortIndicator = this.classSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.nameSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.CompPaxList.sort(function (a, b) {
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
    IssueCompensationWithTabComponent.prototype.sortBasedOnOrderId = function () {
        var isAsc = this.orderIdSortIndicator == 0 ? 1 : 0;
        this.orderIdSortIndicator = this.orderIdSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.nameSortIndicator = -1;
        this.CompPaxList.sort(function (a, b) {
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
    IssueCompensationWithTabComponent.prototype.selectingAllPax = function () {
        var _this = this;
        if (this.CompensationIssuedList == true) {
            // this.SelectedPassenger = [];
            if (this.SelectAllPax == false && this.SelectAllPaxVar == false) {
                this.SelectAllPaxVar = true;
                this.SelectAllPax = true;
                this.CompPaxListIssued.forEach(function (data, index) {
                    if (!data.IsSelected) {
                        data.IsSelected = true;
                        if (_this.isEmailCopytoSelectPaxTrue) {
                            data.Email = _this.EmailIdSelectedPax;
                        }
                        _this.SelectedPassenger.push(data);
                    }
                });
            }
            else {
                this.SelectAllPaxVar = false;
                this.SelectAllPax = false;
                this.CompPaxListIssued.forEach(function (data, index) {
                    data.IsSelected = false;
                });
                this.SelectedPassenger = [];
            }
            if (this.CompPaxListIssuedFulList.length === this.SelectedPassenger.length)
                this.SelectAllPax = true;
            this.selectedPassengerCount = this.SelectedPassenger.length;
        }
        if (this.IsLabelField == true && this.CompensationNotIssuedList == true) {
            if (this.IsLabelField == true) {
                var isIneligibleSelected = false;
                if (this.SelectAllPax == false && this.SelectAllPaxVar == false) {
                    this.SelectAllPaxVar = true;
                    var exceedLimit = false;
                    this.CompPaxListNotIssued.forEach(function (data, index) {
                        if (!data.IsSelected) {
                            var totalEmds = 0;
                            if (data.monetary) {
                                totalEmds = Number(_this.selectedEMDs) + Number(data.hotel) + Number(data.meal) + Number(data.transportation) + 1;
                            }
                            else {
                                totalEmds = Number(_this.selectedEMDs) + Number(data.hotel) + Number(data.meal) + Number(data.transportation);
                            }
                            if (totalEmds <= IssueCompensationWithTabComponent_1.MaxEMDIssued) {
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
                        Toast.makeText(IssueCompensationWithTabComponent_1.MaxEMDIssued + " EMD's selected").show();
                    }
                }
                else {
                    this.SelectAllPaxVar = false;
                    this.SelectAllPax = false;
                    this.CompPaxListNotIssued.forEach(function (data, index) {
                        data.IsSelected = false;
                        _this.SelectedPassenger = [];
                        _this.selectedEMDs = 0;
                    });
                }
                if (this.CompPaxListNotIssuedFulList.length === this.SelectedPassenger.length)
                    this.SelectAllPax = true;
            }
            if (isIneligibleSelected) {
                Toast.makeText("Ineligible Passenger(s) are not selected.").show();
            }
            this.SelectedPaxcount = this.SelectedPassenger.length;
            this.selectedPassengerCount = this.SelectedPassenger.length;
            console.log(this.SelectedPassenger);
        }
        this.selectedPassengerCount = this.SelectedPassenger.length;
    };
    IssueCompensationWithTabComponent.prototype.selectSegment = function (e) {
        var selInd = e.newIndex;
        this.SelectedPassenger = [];
        if (selInd == 0) {
            this.CompensationIssuedList = true;
            this.CompensationNotIssuedList = false;
            this.SelectAllPax = false;
            this.SearchCriteria = "Name";
            this.searchField = undefined;
            this.CompPaxList = this.CompPaxListIssuedFulList;
            this.CompPaxList.forEach(function (data, i) { data.IsSelected = false; });
            this.CompPaxListIssued = this.CompPaxListIssuedFulList;
            this.CompPaxListNotIssued = this.CompPaxListNotIssuedFulList;
            this.selectedPassengerCount = 0;
            this.TotalPassengerCount = this.CompPaxListIssuedFulList.length;
            console.log("Issued" + this.CompPaxListIssued.length);
        }
        else {
            this.CompensationIssuedList = false;
            this.CompensationNotIssuedList = true;
            this.SelectAllPax = false;
            this.SearchCriteria = "Name";
            this.searchField = undefined;
            this.selectedPassengerCount = 0;
            this.CompPaxList = this.CompPaxListNotIssuedFulList;
            this.CompPaxList.forEach(function (data, i) { data.IsSelected = false; });
            this.CompPaxListIssued = this.CompPaxListIssuedFulList;
            this.CompPaxListNotIssued = this.CompPaxListNotIssuedFulList;
            this.TotalPassengerCount = this.CompPaxListNotIssuedFulList.length;
            console.log("Not Issued" + this.CompPaxListNotIssued.length);
        }
    };
    IssueCompensationWithTabComponent.prototype.issueCompensationConfirmation = function () {
        var _this = this;
        dialogs.confirm(IssueCompensationWithTabComponent_1.ISSUECOMPENSATIONTOAST).then(function (result) {
            console.log("Dialog result: " + result);
            if (result) {
                _this.issueCompensation();
            }
        });
    };
    IssueCompensationWithTabComponent.prototype.issueCompensation = function () {
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
                if (data.Success) {
                    if (data.Results) {
                        var PaxResponse = index_3.Converters.convertToIssueCompensationResponse(data, _this.IssueCompPaxList);
                        console.log("before");
                        console.log(_this.IssueCompPaxList);
                        _this.IssueCompPaxList = [];
                        _this.IssueCompPaxList = PaxResponse;
                        // this.IssueCompPaxList = IssueCompensationResponse;
                        _this.CompPaxListIssued = [];
                        _this.CompPaxListNotIssued = [];
                        _this.totalIssuedMonetary = 0;
                        _this.totalIssuedHotel = 0;
                        _this.totalIssuedMeal = 0;
                        _this.totalIssuedTransport = 0;
                        _this.totalNotIssuedMonetary = 0;
                        _this.totalNotIssuedHotel = 0;
                        _this.totalNotIssuedMeal = 0;
                        _this.totalNotIssuedTransport = 0;
                        console.log("after");
                        console.log(_this.IssueCompPaxList);
                        _this.IssueCompPaxList.forEach(function (data, Index) {
                            if (data.IsCompensationIssued == true) {
                                _this.CompPaxListIssued.push(data);
                                _this.totalIssuedMonetary = _this.totalIssuedMonetary + Number(data.monetary);
                                _this.totalIssuedHotel += Number(data.hotel);
                                _this.totalIssuedMeal += Number(data.meal);
                                _this.totalIssuedTransport += Number(data.transportation);
                            }
                            else {
                                _this.CompPaxListNotIssued.push(data);
                                _this.totalNotIssuedMonetary = _this.totalNotIssuedMonetary + Number(data.monetary);
                                _this.totalNotIssuedHotel += Number(data.hotel);
                                _this.totalNotIssuedMeal += Number(data.meal);
                                _this.totalNotIssuedTransport += Number(data.transportation);
                            }
                        });
                        _this.apisdetails = [];
                        _this.CompPaxListIssuedFulList = [];
                        _this.CompPaxListNotIssuedFulList = [];
                        _this.CompPaxListIssuedFulList = _this.CompPaxListIssued;
                        _this.CompPaxListNotIssuedFulList = _this.CompPaxListNotIssued;
                        _this.CompensatedPaxCount = _this.CompPaxListIssued.length;
                        _this.CompPaxList = _this.CompPaxListIssuedFulList;
                        _this.firsttab.title = "Compensation Issued" + "(" + _this.CompensatedPaxCount + ")";
                        ;
                        _this.apisdetails.push(_this.firsttab);
                        _this.CompensationNotIssuedPaxCount = _this.CompPaxListNotIssued.length;
                        _this.secondtab.title = "Compensation Not Issued" + "(" + _this.CompensationNotIssuedPaxCount + ")";
                        ;
                        _this.apisdetails.push(_this.secondtab);
                        // this._shared.setCompensationPaxList(IssueCompensationResponse);
                        // this.navigatetoissuecompensation();
                        _this.loaderProgress.hideLoader();
                        Toast.makeText(data.Errors[0].Message).show();
                    }
                    else {
                        _this.loaderProgress.hideLoader();
                    }
                }
                else {
                    Toast.makeText(data.Errors[0].Message).show();
                    _this.loaderProgress.hideLoader();
                }
            }, function (err) {
                _this.handleServiceError(err);
                _this.loaderProgress.hideLoader();
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    };
    IssueCompensationWithTabComponent.prototype.onFocus = function (args) {
        // focus event will be triggered when the users enters the TextField
        console.log("onFocus");
        var textField = args.object;
    };
    IssueCompensationWithTabComponent.prototype.onChangeForAmount = function (args, index, field, item) {
        var _this = this;
        console.log("V:" + args);
        console.log("R:" + index);
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
            console.log("flightnum" + test);
            if (test == false) {
                if (field != "") {
                    this.ValidMonetary[index] = true;
                    Toast.makeText(IssueCompensationWithTabComponent_1.NUMBERVALIDATIONTOAST).show();
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
                    this.CompPaxListNotIssued.forEach(function (data, index) {
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
                        Toast.makeText(IssueCompensationWithTabComponent_1.COMPENSATIONNATOAST).show();
                    }
                    else {
                        Toast.makeText(IssueCompensationWithTabComponent_1.MUSTBETOAST + item.monetaryLowerLimit + " to " + item.monetaryHigherLimit).show();
                    }
                }
            }
            console.log("V:" + JSON.stringify(this.MonetraryEmpty));
            console.log("R:" + JSON.stringify(this.Monetarydirty));
        } // item.IsSelected = true;
    };
    IssueCompensationWithTabComponent.prototype.onChangeForHotel = function (args, index, field, item) {
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
            console.log("flightnum" + test);
            if (test == false) {
                if (field != "") {
                    Toast.makeText(IssueCompensationWithTabComponent_1.NUMBERVALIDATIONTOAST).show();
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
                    this.CompPaxListNotIssued.forEach(function (data, index) {
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
                        Toast.makeText(IssueCompensationWithTabComponent_1.COMPENSATIONNATOAST).show();
                    }
                    else {
                        Toast.makeText(IssueCompensationWithTabComponent_1.MUSTBETOAST + item.hotelLowerLimit + " to " + item.hotelHigherLimit).show();
                    }
                }
            }
        }
    };
    IssueCompensationWithTabComponent.prototype.onChangeForMeal = function (args, index, field, item) {
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
            console.log("flightnum" + test);
            if (test == false) {
                if (field != "") {
                    Toast.makeText(IssueCompensationWithTabComponent_1.NUMBERVALIDATIONTOAST).show();
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
                    this.CompPaxListNotIssued.forEach(function (data, index) {
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
                        Toast.makeText(IssueCompensationWithTabComponent_1.COMPENSATIONNATOAST).show();
                    }
                    else {
                        Toast.makeText(IssueCompensationWithTabComponent_1.MUSTBETOAST + item.mealLowerLimit + " to " + item.mealHigherLimit).show();
                    }
                }
            }
        }
    };
    IssueCompensationWithTabComponent.prototype.onChangeForTransport = function (args, index, field, item) {
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
            console.log("flightnum" + test);
            if (test == false) {
                if (field != "") {
                    Toast.makeText(IssueCompensationWithTabComponent_1.NUMBERVALIDATIONTOAST).show();
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
                    this.CompPaxListNotIssued.forEach(function (data, index) {
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
                        Toast.makeText(IssueCompensationWithTabComponent_1.COMPENSATIONNATOAST).show();
                    }
                    else {
                        Toast.makeText(IssueCompensationWithTabComponent_1.MUSTBETOAST + item.transportationLowerLimit + " to " + item.transportationHigherLimit).show();
                    }
                }
            }
        }
    };
    IssueCompensationWithTabComponent.prototype.navigateToCompensation = function () {
        this.routerExtensions.navigate(["compensation"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    IssueCompensationWithTabComponent.prototype.email = function (item) {
        var _this = this;
        try {
            // item.IsSelected = true;
            if (item.IsSelected) {
                this.loaderProgress.showLoader();
                var sDate = new Date();
                console.log('Get GetPassengerOrderDetails Service --------------- Start Date Time : ' + sDate);
                this._service.getEmailByOrderId(item.OrderId)
                    .subscribe(function (data) {
                    if (data.ID != null) {
                        var CompansationDetails_1 = data;
                        if (data.Passengers != null) {
                            console.log("Email in 1");
                            data.Passengers.forEach(function (paxData, Index) {
                                if (paxData.Firstname == item.GivenName && paxData.Lastname == item.LastName) {
                                    console.log("Email in 2");
                                    if (paxData.PrimaryTickets) {
                                        console.log("etkt:" + JSON.stringify(paxData.PrimaryTickets[0].PrimaryTicketNumber));
                                        item.EtktNumbr = paxData.PrimaryTickets[0].PrimaryTicketNumber;
                                    }
                                    if (paxData.Emails.length > 0) {
                                        console.log("Email in 3");
                                        var n = paxData.Emails.length;
                                        _this.EmailId = paxData.Emails[n - 1].Value;
                                        item.Email = paxData.Emails[n - 1].Value;
                                        _this.EmailIdSelectedPax = paxData.Emails[n - 1].Value;
                                    }
                                    else {
                                        item.Email = "";
                                    }
                                }
                            });
                            var options = {
                                title: "Email",
                                message: "* required field",
                                okButtonText: "Save",
                                cancelButtonText: "Copy to selected passenger & Save",
                                neutralButtonText: "Cancel",
                                defaultText: item.Email,
                                inputType: dialogs.inputType.text
                            };
                            dialogs.prompt(options).then(function (result) {
                                console.log("Hello, " + result.text);
                                if (result.result != undefined) {
                                    if (result.result == true) {
                                        if (result.text.trim().length <= 0) {
                                            _this.email(item);
                                        }
                                        else {
                                            var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
                                            var test = EMAIL_REGEXP.test(result.text);
                                            if (test) {
                                                if (_this.EmailId == result.text) {
                                                    item.Email = result.text;
                                                    console.log("Email:" + JSON.stringify(item.Email));
                                                }
                                                else {
                                                    item.Email = result.text;
                                                    _this.updateEmail(CompansationDetails_1, item);
                                                    console.log("Email:" + JSON.stringify(item.Email));
                                                }
                                            }
                                            else {
                                                Toast.makeText("Enter a valid email address").show();
                                                _this.email(item);
                                            }
                                        }
                                    }
                                    else {
                                        if (result.text.trim().length <= 0) {
                                            _this.email(item);
                                        }
                                        else {
                                            var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
                                            var test = EMAIL_REGEXP.test(result.text);
                                            if (test) {
                                                if (_this.EmailId == result.text) {
                                                    item.Email = result.text;
                                                    _this.EmailIdSelectedPax = result.text;
                                                    _this.isEmailCopytoSelectPaxTrue = true;
                                                    item.Email = result.text;
                                                    _this.CompPaxList.forEach(function (data, Index) {
                                                        data.Email = _this.EmailIdSelectedPax;
                                                    });
                                                    console.log("Email:" + JSON.stringify(item.Email));
                                                }
                                                else {
                                                    _this.isEmailCopytoSelectPaxTrue = true;
                                                    item.Email = result.text;
                                                    _this.EmailIdSelectedPax = result.text;
                                                    _this.CompPaxList.forEach(function (paxData, Index) {
                                                        if (paxData.IsSelected) {
                                                            paxData.Email = _this.EmailIdSelectedPax;
                                                        }
                                                    });
                                                    _this.updateEmail(CompansationDetails_1, item);
                                                    console.log("Email:" + JSON.stringify(item.Email));
                                                }
                                            }
                                            else {
                                                Toast.makeText("Enter a valid email address").show();
                                                _this.email(item);
                                            }
                                        }
                                    }
                                }
                            });
                        }
                        console.dir(CompansationDetails_1);
                        var eDate = new Date();
                        _this.loaderProgress.hideLoader();
                        console.log('Get GetPassengerOrderDetails Service --------------- End Date Time : ' + eDate);
                        console.log('Get GetPassengerOrderDetails Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
                    }
                    else {
                        Toast.makeText("No Reservation found").show();
                        _this.loaderProgress.hideLoader();
                    }
                }, function (err) {
                    Toast.makeText(err).show();
                    // this.loaderProgress.hideLoader();
                    console.log("Couldnt find information" + err);
                    _this.handleServiceError(err);
                    _this.loaderProgress.hideLoader();
                });
            }
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    };
    IssueCompensationWithTabComponent.prototype.updateEmail = function (orderResposne, item) {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var startDate = new Date();
            var CurDate = moment(startDate).format("YYYY-MM-DD");
            console.log(CurDate);
            this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
            var EmailCompensationStructure = index_3.Converters.convertToUpdateEmailId(item, orderResposne);
            console.log("Email Req:" + JSON.stringify(EmailCompensationStructure));
            if (EmailCompensationStructure != null) {
                this._service.updateEmailId(item.OrderId, EmailCompensationStructure).subscribe(function (data) {
                    console.log("Email Res:" + JSON.stringify(data));
                    if (data.BadRequest == 400) {
                        Toast.makeText(data.ErrorMessage).show();
                        _this.loaderProgress.hideLoader();
                    }
                    else {
                        if (data.Success) {
                            _this.loaderProgress.hideLoader();
                            Toast.makeText("Email updated successfully").show();
                        }
                        else {
                            Toast.makeText("Email Not updated").show();
                            _this.loaderProgress.hideLoader();
                        }
                    }
                }, function (err) {
                    Toast.makeText(err).show();
                    _this.handleServiceError(err);
                    _this.loaderProgress.hideLoader();
                });
            }
            else {
                Toast.makeText("Monetary not avilable").show();
                this.loaderProgress.hideLoader();
            }
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    };
    IssueCompensationWithTabComponent.prototype.sendEmail = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var startDate = new Date();
            var CurDate = moment(startDate).format("YYYY-MM-DD");
            console.log(CurDate);
            this.isEmailNotAvailable = false;
            this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
            var paxName;
            this.SelectedPassenger.forEach(function (data, Index) {
                if (data.Email == null || data.Email == "") {
                    _this.isEmailNotAvailable = true;
                    paxName = data.FullName;
                }
            });
            if (!this.isEmailNotAvailable) {
                var EmailCompensationStructure = index_3.Converters.convertToEmailCompensation(this.SelectedPassenger, this.FlightHeaderInfo);
                console.log("Email Req:" + JSON.stringify(EmailCompensationStructure));
                if (EmailCompensationStructure != null) {
                    this._service.PostEmailCompensation(EmailCompensationStructure).subscribe(function (data) {
                        console.log("Email Res:" + JSON.stringify(data));
                        if (data.Success) {
                            _this.loaderProgress.hideLoader();
                            Toast.makeText("Email Sent Successfully").show();
                            _this.getCompensationList(_this.FlightHeaderInfo.DepartureDate, _this.FlightHeaderInfo.FlightNumber, _this.SelectedPassenger[0].Origin, "ReasonWiseGet");
                        }
                        else {
                            _this.loaderProgress.hideLoader();
                        }
                    }, function (err) {
                        _this.handleServiceError(err);
                        _this.loaderProgress.hideLoader();
                    });
                }
                else {
                    Toast.makeText("Monetary not avilable").show();
                    this.loaderProgress.hideLoader();
                }
            }
            else {
                Toast.makeText(paxName + " :Email ID is not available").show();
                this.loaderProgress.hideLoader();
            }
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    };
    IssueCompensationWithTabComponent.prototype.getCompensationList = function (date, flight, location, paxtype) {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetPassengerType Service --------------- Start Date Time : ' + sDate);
            this._service.getCompensationPaxList(date, flight, location, paxtype).subscribe(function (data) {
                if (data.Results) {
                    if (data.Results[0].FlightSegments[0].Passengers == null) {
                        Toast.makeText("Data not found").show();
                        _this.loaderProgress.hideLoader();
                        // this.clear();
                    }
                    else {
                        var CompansationDetails = data;
                        _this.flightStatusForCompensationList(CompansationDetails);
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
                    // this.clear();
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
    IssueCompensationWithTabComponent.prototype.flightStatusForCompensationList = function (CompPax) {
        var _this = this;
        try {
            var sDate = new Date();
            console.log('Get CompensationDetails Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            var date = this.FlightHeaderInfo.DepartureDate;
            var flightnumber = this.FlightHeaderInfo.FlightNumber;
            var location = ApplicationSettings.getString("SearchLocation", "");
            this._service.status(date, flightnumber, location).subscribe(function (data) {
                if (data.BadRequest != 400) {
                    if (data.Flights != null) {
                        var status_1 = data;
                        console.log("IN1" + JSON.stringify(status_1));
                        _this._shared.setCompensationFlightDetails(status_1);
                        var flightStatus = index_3.Converters.convertToFlightHeaderInfo(status_1, ApplicationSettings.getString("SearchLocation", ""));
                        _this._shared.setFlightHeaderInfo(flightStatus);
                        var CompaxList_1 = index_3.Converters.convertoCompensationPassengerList(CompPax, status_1, ApplicationSettings.getString("SearchLocation", ""));
                        var CompaxFilteredList_1 = new index_1.CompensationSearchModule.CompensationRootObject();
                        _this.CompPaxListIssued.forEach(function (SelPax, Index) {
                            CompaxList_1.PassengerList.forEach(function (AllPax, Index) {
                                if (SelPax.OrderId == AllPax.OrderId && SelPax.GivenName == AllPax.GivenName && SelPax.LastName == AllPax.LastName && SelPax.Compensations[0].CompReasonText == AllPax.Compensations[0].CompReasonText) {
                                    CompaxFilteredList_1.FlightModel = CompaxList_1.FlightModel;
                                    CompaxFilteredList_1.PassengerList.push(AllPax);
                                }
                            });
                        });
                        _this._shared.setCompensationList(CompaxFilteredList_1);
                        _this.naviagatetoCompensationPrintListwithtab();
                        _this.loaderProgress.hideLoader();
                    }
                    else {
                        Toast.makeText(data.Warnings[0].Message).show();
                        _this._shared.setCompensationFlightDetails(data);
                        var CompaxList_2 = index_3.Converters.convertoCompensationPassengerList(CompPax, data, ApplicationSettings.getString("SearchLocation", ""));
                        var CompaxFilteredList_2 = new index_1.CompensationSearchModule.CompensationRootObject();
                        _this.CompPaxListIssued.forEach(function (SelPax, Index) {
                            CompaxList_2.PassengerList.forEach(function (AllPax, Index) {
                                if (SelPax.OrderId == AllPax.OrderId && SelPax.GivenName == AllPax.GivenName && SelPax.LastName == AllPax.LastName && SelPax.Compensations[0].CompReasonText == AllPax.Compensations[0].CompReasonText) {
                                    CompaxFilteredList_2.FlightModel = CompaxList_2.FlightModel;
                                    CompaxFilteredList_2.PassengerList.push(AllPax);
                                }
                            });
                        });
                        _this._shared.setCompensationList(CompaxFilteredList_2);
                        _this.naviagatetoCompensationPrintListwithtab();
                        _this.loaderProgress.hideLoader();
                    }
                }
                else {
                    Toast.makeText(data.errMessage).show();
                    // this.clear();
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
            console.log('Get CompensationDetails Service --------------- End Date Time : ' + eDate);
            console.log('Get CompensationDetails Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    IssueCompensationWithTabComponent.prototype.bluetoothEMD = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var startDate = new Date();
            var CurDate = moment(startDate).format("YYYY-MM-DD");
            console.log(CurDate);
            this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
            var EmailCompensationStructure = index_3.Converters.convertToBluetoothPrintEMDCompensation(this.SelectedPassenger, this.FlightHeaderInfo);
            console.log("Email Req:" + JSON.stringify(EmailCompensationStructure));
            if (EmailCompensationStructure.Passengers != []) {
                this._service.printEMDBluetoothCompensationService(EmailCompensationStructure).subscribe(function (data) {
                    console.log("Email Res:" + JSON.stringify(data));
                    // this.loaderProgress.hideLoader();
                    if (data.RawData) {
                        // this.loaderProgress.hideLoader();
                        if (data.RawData) {
                            var image = imageModule.fromBase64(data.RawData);
                            var folder_1 = fs.knownFolders.documents();
                            var filename_1 = moment(new Date()).format("hhmmss");
                            var path = fs.path.join(folder_1.path, "tempBPImage" + filename_1 + ".jpg");
                            try {
                                image.saveToFile(path, "jpeg");
                                var printerID = _this.getPrinter();
                                if (printerID.trim() != "") {
                                    var self_1 = _this;
                                    new zebra.Printer({ address: printerID, language: "CPCL", debugging: false })
                                        .then(function (curPrinter, result) {
                                        var document = curPrinter.createDocument();
                                        document.image(fs.path.join(folder_1.path, "tempBPImage" + filename_1 + ".jpg"), 0);
                                        curPrinter.getStatus().then(function (result) {
                                            console.log(result);
                                            if (result.ready && !result.latchOpen && !result.lowBattery && !result.paperOut) {
                                                //printing
                                                curPrinter.print(document).then(function () {
                                                    console.log("Printing Done");
                                                    var file = folder_1.getFile("tempBPImage" + filename_1 + ".jpg");
                                                    file.remove().then(function (res) {
                                                        console.log("file removed");
                                                    });
                                                    Toast.makeText("Bluetooth printed sucessfully").show();
                                                    var SaveComptemplate = index_3.Converters.convertToSaveCompensationTemplateForPrint(self_1.SelectedPassenger, self_1.FlightHeaderInfo);
                                                    console.log("save" + JSON.stringify(SaveComptemplate));
                                                    self_1._service.saveBluetoothPrint(SaveComptemplate).subscribe(function (data) {
                                                        self_1.getCompensationList(self_1.FlightHeaderInfo.DepartureDate, self_1.FlightHeaderInfo.FlightNumber, self_1.SelectedPassenger[0].Origin, "ReasonWiseGet");
                                                        console.log("Email Res:" + JSON.stringify(data));
                                                    }, function (error) {
                                                        self_1.handleServiceError(error);
                                                        self_1.loaderProgress.hideLoader();
                                                    });
                                                    curPrinter.close().then(function () {
                                                        Toast.makeText("Printer is ready to print").show();
                                                        // this.loaderProgress.hideLoader();
                                                    })
                                                        .catch(function (err) {
                                                        Toast.makeText("Error Occured while Printing:").show();
                                                        curPrinter.close();
                                                        self_1.loaderProgress.hideLoader();
                                                    });
                                                    // this.loaderProgress.hideLoader();
                                                }).catch(function (status) {
                                                    console.log(status);
                                                    // self._service.saveBluetoothPrint(self.SaveComptemplate).subscribe((data) => {
                                                    //     self.getCompensationList(this.FlightHeaderInfo.DepartureDate, this.FlightHeaderInfo.FlightNumber, this.FlightHeaderInfo.DepartureAirport, "ReasonWiseGet");
                                                    //     console.log("Email Res:" + JSON.stringify(data));
                                                    // });
                                                    Toast.makeText(IssueCompensationWithTabComponent_1.UNABLETOPRINT).show();
                                                    self_1.loaderProgress.hideLoader();
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
                                                self_1.loaderProgress.hideLoader();
                                            }
                                        }).catch(function (status) {
                                            console.log(status);
                                        });
                                    }).catch(function (err) {
                                        Toast.makeText(IssueCompensationWithTabComponent_1.PRINTERSESSION).show();
                                        self_1.loaderProgress.hideLoader();
                                        console.log(err);
                                    });
                                }
                                else {
                                    Toast.makeText(IssueCompensationWithTabComponent_1.NOBLUETOOTHDEVICE).show();
                                    _this.loaderProgress.hideLoader();
                                }
                            }
                            catch (e) {
                                Toast.makeText(IssueCompensationWithTabComponent_1.UNABLETOPRINT).show();
                                _this.loaderProgress.hideLoader();
                            }
                        }
                        else {
                            Toast.makeText(IssueCompensationWithTabComponent_1.UNABLETOPRINT).show();
                            _this.loaderProgress.hideLoader();
                        }
                        // this.getCompensationList(this.FlightHeaderInfo.DepartureDate,this.FlightHeaderInfo.FlightNumber,this.FlightHeaderInfo.DepartureAirport,"ReasonWiseGet");
                        // Toast.makeText(data.Errors[0].Message).show();
                        // this.loaderProgress.hideLoader();
                    }
                    else {
                        Toast.makeText(data.Errors[0].Message).show();
                        _this.loaderProgress.hideLoader();
                    }
                }, function (err) {
                    _this.handleServiceError(err);
                    _this.loaderProgress.hideLoader();
                });
            }
            else {
                Toast.makeText("No EMD avilable for print").show();
                this.loaderProgress.hideLoader();
            }
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    };
    IssueCompensationWithTabComponent.prototype.getPrinter = function () {
        if (ApplicationSettings.hasKey("printer")) {
            return ApplicationSettings.getString("printer");
        }
        else {
            return "";
        }
    };
    IssueCompensationWithTabComponent.prototype.printEMD = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var startDate = new Date();
            var CurDate = moment(startDate).format("YYYY-MM-DD");
            console.log(CurDate);
            var DeviceName = ApplicationSettings.getString("boardingPassDeviceName", "");
            if (DeviceName == "") {
                Toast.makeText("Please set printer in setting").show();
                this.loaderProgress.hideLoader();
            }
            else {
                this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
                var EmailCompensationStructure = index_3.Converters.convertToPrintEMDCompensation(this.SelectedPassenger, this.FlightHeaderInfo);
                console.log("Email Req:" + JSON.stringify(EmailCompensationStructure));
                if (EmailCompensationStructure.Passengers != []) {
                    this._service.printEMDCompensationService(EmailCompensationStructure).subscribe(function (data) {
                        console.log("Email Res:" + JSON.stringify(data));
                        if (data.Success) {
                            Toast.makeText("Printed successfully").show();
                            _this.loaderProgress.hideLoader();
                            _this.getCompensationList(_this.FlightHeaderInfo.DepartureDate, _this.FlightHeaderInfo.FlightNumber, _this.SelectedPassenger[0].Origin, "ReasonWiseGet");
                            // Toast.makeText(data.Errors[0].Message).show();
                        }
                        else {
                            _this.loaderProgress.hideLoader();
                            Toast.makeText(data.Errors[0].Message).show();
                        }
                    }, function (err) {
                        _this.handleServiceError(err);
                        _this.loaderProgress.hideLoader();
                    });
                }
                else {
                    Toast.makeText("No EMD avilable for print").show();
                    this.loaderProgress.hideLoader();
                }
            }
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    };
    IssueCompensationWithTabComponent.prototype.overidereasonformonetary = function (item, n) {
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
                    _this.CompPaxListNotIssued.forEach(function (data, index) {
                        _this.totalMonetary += Number(data.monetary);
                        _this.totalHotel += Number(data.hotel);
                        _this.totalMeal += Number(data.meal);
                        _this.totalTransport += Number(data.transportation);
                    });
                }
                else {
                    item.monetary = item.monetaryTempValue;
                }
            });
        }
    };
    IssueCompensationWithTabComponent.prototype.overidereasonforhotel = function (item, n) {
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
                    _this.CompPaxListNotIssued.forEach(function (data, index) {
                        _this.totalMonetary += Number(data.monetary);
                        _this.totalHotel += Number(data.hotel);
                        _this.totalMeal += Number(data.meal);
                        _this.totalTransport += Number(data.transportation);
                    });
                }
                else {
                    item.hotel = item.hotelTempValue;
                }
            });
        }
    };
    IssueCompensationWithTabComponent.prototype.overidereasonformeal = function (item, n) {
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
                    _this.CompPaxListNotIssued.forEach(function (data, index) {
                        _this.totalMonetary += Number(data.monetary);
                        _this.totalHotel += Number(data.hotel);
                        _this.totalMeal += Number(data.meal);
                        _this.totalTransport += Number(data.transportation);
                    });
                }
                else {
                    item.meal = item.mealTempValue;
                }
            });
        }
    };
    IssueCompensationWithTabComponent.prototype.overidereasonfortransport = function (item, n) {
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
                    _this.CompPaxListNotIssued.forEach(function (data, index) {
                        _this.totalMonetary += Number(data.monetary);
                        _this.totalHotel += Number(data.hotel);
                        _this.totalMeal += Number(data.meal);
                        _this.totalTransport += Number(data.transportation);
                    });
                }
                else {
                    item.transportation = item.transportationTempValue;
                }
            });
        }
    };
    IssueCompensationWithTabComponent.prototype.navigatetoadditionaldetails = function (Paxitem) {
        console.log("V" + Paxitem);
        if ((this.IsEditable && Paxitem.IsSelected) || (this.CompensationIssuedList && Paxitem.IsSelected)) {
            var prePage = "IssueCompensationTab";
            this.routerExtensions.navigate(["compensationadditionaldetails"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                }, queryParams: {
                    "data": JSON.stringify(Paxitem),
                    "prepage": prePage,
                    "selectedPAx": JSON.stringify(this.SelectedPassenger),
                }
            });
        }
    };
    IssueCompensationWithTabComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    IssueCompensationWithTabComponent.prototype.navigateToSearch = function () {
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
    IssueCompensationWithTabComponent.prototype.navigateToDepartures = function () {
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
    IssueCompensationWithTabComponent.prototype.naviagatetoCompensationPrintListwithtab = function () {
        this.routerExtensions.navigate(["compensationprintscreen"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }, queryParams: {
                "prepage": "issueCompensation",
                "selectedPAx": JSON.stringify(this.CompPaxListIssued),
            }
        });
    };
    IssueCompensationWithTabComponent.prototype.displaySSRs = function (item) {
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
    IssueCompensationWithTabComponent.prototype.handleServiceError = function (error) {
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
    var IssueCompensationWithTabComponent_1;
    IssueCompensationWithTabComponent.MaxEMDIssued = 50;
    IssueCompensationWithTabComponent.ISSUECOMPENSATIONTOAST = "Are you ready to issue compensation?";
    IssueCompensationWithTabComponent.NUMBERVALIDATIONTOAST = "Invalid. Enter value in numbers";
    IssueCompensationWithTabComponent.COMPENSATIONNATOAST = "Compensation not applicable";
    IssueCompensationWithTabComponent.MUSTBETOAST = "Must be:";
    IssueCompensationWithTabComponent.COMPENSATIONFIRSTTAB = "Compensation Issued";
    IssueCompensationWithTabComponent.COMPENSATIONSECONDTAB = "Compensation Not Issued";
    IssueCompensationWithTabComponent.NOBLUETOOTHDEVICE = "No Bluetooth Printer Found. Please set the Printer in Settings Page";
    IssueCompensationWithTabComponent.UNABLETOPRINT = "Unable to Print";
    IssueCompensationWithTabComponent.PRINTERSESSION = "Unable to connect to printer session, try again later";
    __decorate([
        core_1.ViewChild('pagecontainer'),
        __metadata("design:type", core_1.ElementRef)
    ], IssueCompensationWithTabComponent.prototype, "pageCont", void 0);
    __decorate([
        core_1.ViewChild('segbar'),
        __metadata("design:type", core_1.ElementRef)
    ], IssueCompensationWithTabComponent.prototype, "segbar", void 0);
    IssueCompensationWithTabComponent = IssueCompensationWithTabComponent_1 = __decorate([
        core_1.Component({
            selector: "compensationadditionaldetails-page",
            providers: [index_2.DataService, index_2.PassengerService, app_constants_1.Configuration, index_2.CompensationService],
            templateUrl: "./components/issuecompensationwithtab/issuecompensationwithtab.component.html",
            styleUrls: ["./components/issuecompensationwithtab/issuecompensationwithtab.component.css"]
        }),
        __metadata("design:paramtypes", [app_constants_1.Configuration, index_2.PassengerService, router_1.ActivatedRoute, index_2.CheckinOrderService, page_1.Page, router_2.RouterExtensions, index_2.TimeOutService, router_1.Router, index_2.DataService, index_2.CompensationService, router_1.ActivatedRoute])
    ], IssueCompensationWithTabComponent);
    return IssueCompensationWithTabComponent;
}());
exports.IssueCompensationWithTabComponent = IssueCompensationWithTabComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNzdWVjb21wZW5zYXRpb253aXRodGFiLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlzc3VlY29tcGVuc2F0aW9ud2l0aHRhYi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsc0NBQXlFO0FBQ3pFLDBDQUEyRTtBQUUzRSwwQ0FBNEM7QUFDNUMsZ0NBQWtDO0FBRWxDLHNEQUErRDtBQUMvRCxnQ0FBK0I7QUFNL0Isb0NBQXNDO0FBRXRDLGtEQUFrRTtBQUNsRSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFHN0IsOEJBQThCO0FBQzlCLDBEQUE0RDtBQUM1RCwrQkFBaUM7QUFDakMsMENBQTRDO0FBQzVDLGdEQUFrRDtBQUVsRCxnQkFBZ0I7QUFDaEIsc0RBQWdOO0FBRWhOLHFEQUFzSTtBQUN0SSxrREFBc0Q7QUFDdEQsNkRBQTJEO0FBQzNELHFEQUFvRDtBQVVwRDtJQWlHSSx5Q0FBeUM7SUFDekMsMkNBQW9CLGNBQTZCLEVBQVUsU0FBMkIsRUFBVSxlQUErQixFQUFVLE9BQTRCLEVBQVUsSUFBVSxFQUFVLGdCQUFrQyxFQUFTLGVBQStCLEVBQVUsTUFBYyxFQUFTLFlBQXlCLEVBQVMsUUFBNkIsRUFBVSxLQUFxQjtRQUF4WCxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQVUsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUFTLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBYTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQXFCO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUE5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VyxpQ0FBaUMsQ0FBQztJQUNsRSxxREFBbUIsR0FBVyw2QkFBNkIsQ0FBQztJQUM1RCw2Q0FBVyxHQUFXLFVBQVUsQ0FBQztJQUNqQyxzREFBb0IsR0FBVyxxQkFBcUIsQ0FBQztJQUNyRCx1REFBcUIsR0FBVyx5QkFBeUIsQ0FBQztJQUMxRCxtREFBaUIsR0FBVyxxRUFBcUUsQ0FBQztJQUNsRywrQ0FBYSxHQUFXLGlCQUFpQixDQUFDO0lBQzFDLGdEQUFjLEdBQVcsdURBQXVELENBQUM7SUEvRm5FO1FBQTNCLGdCQUFTLENBQUMsZUFBZSxDQUFDO2tDQUFXLGlCQUFVO3VFQUFDO0lBQzVCO1FBQXBCLGdCQUFTLENBQUMsUUFBUSxDQUFDO2tDQUFTLGlCQUFVO3FFQUFDO0lBRi9CLGlDQUFpQztRQVI3QyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLG9DQUFvQztZQUM5QyxTQUFTLEVBQUUsQ0FBQyxtQkFBVyxFQUFFLHdCQUFnQixFQUFFLDZCQUFhLEVBQUUsMkJBQW1CLENBQUM7WUFDOUUsV0FBVyxFQUFFLCtFQUErRTtZQUM1RixTQUFTLEVBQUUsQ0FBQyw4RUFBOEUsQ0FBQztTQUU5RixDQUFDO3lDQW9Hc0MsNkJBQWEsRUFBcUIsd0JBQWdCLEVBQTJCLHVCQUFjLEVBQW1CLDJCQUFtQixFQUFnQixXQUFJLEVBQTRCLHlCQUFnQixFQUEwQixzQkFBYyxFQUFrQixlQUFNLEVBQXVCLG1CQUFXLEVBQW1CLDJCQUFtQixFQUFpQix1QkFBYztPQWxHblksaUNBQWlDLENBNjFEN0M7SUFBRCx3Q0FBQztDQUFBLEFBNzFERCxJQTYxREM7QUE3MURZLDhFQUFpQyIsInNvdXJjZXNDb250ZW50IjpbIi8vYW5ndWxhciAmIG5hdGl2ZXNjcmlwdCByZWZlcmVuY2VzXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBFbGVtZW50UmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvbkV4dHJhcywgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgKiBhcyBpbWFnZU1vZHVsZSBmcm9tIFwiaW1hZ2Utc291cmNlXCI7XG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZmlsZS1zeXN0ZW1cIjtcbmltcG9ydCB7IE9ic2VydmFibGVBcnJheSB9IGZyb20gXCJkYXRhL29ic2VydmFibGUtYXJyYXlcIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcbmltcG9ydCB7IFRleHRGaWVsZCB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL3RleHQtZmllbGRcIjtcbmltcG9ydCB7IEdlc3R1cmVFdmVudERhdGEgfSBmcm9tIFwidWkvZ2VzdHVyZXNcIjtcbmltcG9ydCB7IExpc3RWaWV3LCBJdGVtRXZlbnREYXRhIH0gZnJvbSBcInVpL2xpc3Qtdmlld1wiO1xuaW1wb3J0IHsgU3RhY2tMYXlvdXQgfSBmcm9tIFwidWkvbGF5b3V0cy9zdGFjay1sYXlvdXRcIjtcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9uYXRpdmVzY3JpcHQubW9kdWxlXCI7XG5pbXBvcnQgKiBhcyBkaWFsb2dzIGZyb20gXCJ1aS9kaWFsb2dzXCI7XG5pbXBvcnQgKiBhcyBnZXN0dXJlcyBmcm9tIFwidWkvZ2VzdHVyZXNcIjtcbmltcG9ydCB7IFNlZ21lbnRlZEJhciwgU2VnbWVudGVkQmFySXRlbSB9IGZyb20gXCJ1aS9zZWdtZW50ZWQtYmFyXCI7XG52YXIgdGltZXIgPSByZXF1aXJlKFwidGltZXJcIik7XG5cblxuLy9leHRlcm5hbCBtb2R1bGVzIGFuZCBwbHVnaW5zXG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcbmltcG9ydCAqIGFzIFRvYXN0IGZyb20gJ25hdGl2ZXNjcmlwdC10b2FzdCc7XG5pbXBvcnQgKiBhcyB6ZWJyYSBmcm9tIFwibmF0aXZlc2NyaXB0LXByaW50LXplYnJhXCI7XG5cbi8vYXBwIHJlZmVyZW5jZXNcbmltcG9ydCB7IExvYWRlclByb2dyZXNzLCBvcmRlciwgUGFzc2VuZ2VyTGlzdFRlbXBsYXRlLCBEZXBhcnR1cmVQYXhMaXN0LCBQYXNzZW5nZXJMaXN0LCBEZXBhcnR1cmVJbmZvMSwgSXNzdWVDb21wZW5zYXRpb25MaXN0LCBJbkJvdW5kLCBPdXRCb3VuZCwgQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9pbnRlcmZhY2UvaW5kZXhcIlxuaW1wb3J0IHsgUGFzc2VuZ2VyLCBPcmRlciwgSW52ZW50b3J5LCBDb3VudHJ5Q29sbGVjdGlvbiwgUHJpbnRNb2R1bGUgfSBmcm9tICcuLi8uLi9zaGFyZWQvbW9kZWwvaW5kZXgnO1xuaW1wb3J0IHsgRGF0YVNlcnZpY2UsIENoZWNraW5PcmRlclNlcnZpY2UsIFBhc3NlbmdlclNlcnZpY2UsIFRpbWVPdXRTZXJ2aWNlLCBDb21wZW5zYXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9pbmRleFwiO1xuaW1wb3J0IHsgQ29udmVydGVycyB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXRpbHMvaW5kZXhcIjtcbmltcG9ydCB7IEFwcEV4ZWN1dGlvbnRpbWUgfSBmcm9tIFwiLi4vLi4vYXBwLmV4ZWN1dGlvbnRpbWVcIjtcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi8uLi9hcHAuY29uc3RhbnRzJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwiY29tcGVuc2F0aW9uYWRkaXRpb25hbGRldGFpbHMtcGFnZVwiLFxuICAgIHByb3ZpZGVyczogW0RhdGFTZXJ2aWNlLCBQYXNzZW5nZXJTZXJ2aWNlLCBDb25maWd1cmF0aW9uLCBDb21wZW5zYXRpb25TZXJ2aWNlXSxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2NvbXBvbmVudHMvaXNzdWVjb21wZW5zYXRpb253aXRodGFiL2lzc3VlY29tcGVuc2F0aW9ud2l0aHRhYi5jb21wb25lbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogW1wiLi9jb21wb25lbnRzL2lzc3VlY29tcGVuc2F0aW9ud2l0aHRhYi9pc3N1ZWNvbXBlbnNhdGlvbndpdGh0YWIuY29tcG9uZW50LmNzc1wiXVxuXG59KVxuXG5leHBvcnQgY2xhc3MgSXNzdWVDb21wZW5zYXRpb25XaXRoVGFiQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBAVmlld0NoaWxkKCdwYWdlY29udGFpbmVyJykgcGFnZUNvbnQ6IEVsZW1lbnRSZWY7XG4gICAgQFZpZXdDaGlsZCgnc2VnYmFyJykgc2VnYmFyOiBFbGVtZW50UmVmO1xuICAgIHB1YmxpYyBhcGlzZGV0YWlsczogQXJyYXk8U2VnbWVudGVkQmFySXRlbT47XG4gICAgcHVibGljIGZpcnN0dGFiID0gbmV3IFNlZ21lbnRlZEJhckl0ZW0oKTtcbiAgICBwdWJsaWMgc2Vjb25kdGFiID0gbmV3IFNlZ21lbnRlZEJhckl0ZW0oKTtcbiAgICBwdWJsaWMgZXJyb3JNZXNzYWdlOiBzdHJpbmc7XG4gICAgcHVibGljIGxvYWRlclByb2dyZXNzOiBMb2FkZXJQcm9ncmVzcztcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uSXNzdWVkTGlzdDogYm9vbGVhbiA9IHRydWU7XG4gICAgcHVibGljIENvbXBlbnNhdGlvbk5vdElzc3VlZExpc3Q6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgRmxpZ2h0SW5mb05vdFNldDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBzZWFyY2hGaWVsZDogYW55O1xuICAgIHB1YmxpYyBTZWxlY3RlZFBheGNvdW50OiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyBQYXhMaXN0OiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUm9vdE9iamVjdCA9IG5ldyBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUm9vdE9iamVjdCgpO1xuICAgIHB1YmxpYyBmbGlnaHRkYXRlOiBhbnk7XG4gICAgcHVibGljIHVzZXJkZXRhaWxzOiBhbnk7XG4gICAgcHVibGljIHNlbGVjdGVkRU1EczogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgVG90YWxQYXNzZW5nZXJDb3VudDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgc2VsZWN0ZWRQYXNzZW5nZXJDb3VudDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgU2VsZWN0ZWRQYXNzZW5nZXI6IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBmbGlnaHRudW1iZXI6IGFueTtcbiAgICBwdWJsaWMgSXNIZWFkZXJJbmZvOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIElzRmxpZ2h0SW5mbzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBQcmV2aW91c1BhZ2U6IGFueTtcbiAgICBwdWJsaWMgSXNQYXhSZWFzb25TZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBTZWFyY2hDcml0ZXJpYTogYW55ID0gXCJOYW1lXCI7XG4gICAgcHVibGljIFBhc3NlbmdlckZsaXRlckNyaXRlcmlhOiBhbnkgPSBcIkFsbCBQYXNzZW5nZXJzXCI7XG4gICAgcHVibGljIE9yZGVySWQ6IGFueTtcbiAgICBwdWJsaWMgRW1haWxJZDogYW55ID0gXCJcIjtcbiAgICBwdWJsaWMgaXNFbWFpbENvcHl0b1NlbGVjdFBheFRydWU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgRW1haWxJZFNlbGVjdGVkUGF4OiBhbnkgPSBcIlwiO1xuICAgIHB1YmxpYyBTZWxlY3RBbGxQYXg6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgbWVhbGRpcnR5OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzT3ZlcnJpZGVSZWFzb25CbGFuazogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBWYWxpZE1vbmV0YXJ5OiBBcnJheTxib29sZWFuPiA9IFtdO1xuICAgIHB1YmxpYyBWYWxpZEhvdGVsOiBBcnJheTxib29sZWFuPiA9IFtdO1xuICAgIHB1YmxpYyBWYWxpZE1lYWw6IEFycmF5PGJvb2xlYW4+ID0gW107XG4gICAgcHVibGljIFZhbGlkdHJhbnNwb3J0OiBBcnJheTxib29sZWFuPiA9IFtdO1xuICAgIHB1YmxpYyB0b3RhbElzc3VlZE1vbmV0YXJ5OiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyB0b3RhbElzc3VlZEhvdGVsOiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyB0b3RhbElzc3VlZE1lYWw6IG51bWJlciA9IDA7XG4gICAgcHVibGljIHRvdGFsSXNzdWVkVHJhbnNwb3J0OiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyB0b3RhbE5vdElzc3VlZE1vbmV0YXJ5OiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyB0b3RhbE5vdElzc3VlZEhvdGVsOiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyB0b3RhbE5vdElzc3VlZE1lYWw6IG51bWJlciA9IDA7XG4gICAgcHVibGljIHRvdGFsTm90SXNzdWVkVHJhbnNwb3J0OiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyBpc0J1dHRvbkVuYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgQ29tcGVuc2F0ZWRQYXhDb3VudDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgdG90YWxNb25ldGFyeTogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgdG90YWxIb3RlbDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgdG90YWxNZWFsOiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyBTYXZlQ29tcHRlbXBsYXRlOiBhbnk7XG4gICAgcHVibGljIHRvdGFsVHJhbnNwb3J0OiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25Ob3RJc3N1ZWRQYXhDb3VudDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgbmFtZVNvcnRJbmRpY2F0b3I6IG51bWJlciA9IC0xO1xuICAgIHB1YmxpYyBzc3JTb3J0SW5kaWNhdG9yOiBudW1iZXIgPSAtMTtcbiAgICBwdWJsaWMgTW9uZXRyYXJ5RW1wdHk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgTW9uZXRhcnlkaXJ0eTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBob3RlbEVtcHR5OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGhvdGVsZGlydHk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgbWVhbEVtcHR5OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIFNlbGVjdEFsbFBheFZhcjogYm9vbGVhbiA9IGZhbHNlO1xuICAgIC8vIHB1YmxpYyBpc0J1dHRvbkVuYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgaXNFbWFpbE5vdEF2YWlsYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIElzRWRpdGFibGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBJc0xhYmVsRmllbGQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHB1YmxpYyB0aWVyU29ydEluZGljYXRvcjogbnVtYmVyID0gLTE7XG4gICAgcHVibGljIGlzRW1haWxFbmFibGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGNsYXNzU29ydEluZGljYXRvcjogbnVtYmVyID0gLTE7XG4gICAgcHVibGljIG9yZGVySWRTb3J0SW5kaWNhdG9yOiBudW1iZXIgPSAtMTtcbiAgICBwdWJsaWMgU2VsZWN0ZWRNb25ldGFyeTogYW55O1xuICAgIHB1YmxpYyBTZWxjdGVkSG90ZWw6IGFueTtcbiAgICBwdWJsaWMgU2VsZWN0ZWRNZWFsOiBhbnk7XG4gICAgcHVibGljIE92ZXJSaWRlUmVhc29uOiBhbnk7XG4gICAgcHVibGljIFNlbGVjdGVkVHJhbnNwb3J0OiBhbnk7XG4gICAgcHVibGljIHRyYW5zcG9ydEVtcHR5OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIHRyYW5zcG9ydGRpcnR5OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzQ2hlY2tpbkRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzR2F0ZURpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIEZsaWdodEhlYWRlckluZm86IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5GbGlnaHRNb2RlbCA9IG5ldyBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuRmxpZ2h0TW9kZWwoKTtcbiAgICBwdWJsaWMgQ29tcFBheExpc3Q6IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBDb21wUGF4TGlzdElzc3VlZDogQXJyYXk8Q29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q+ID0gW107XG4gICAgcHVibGljIENvbXBQYXhMaXN0SXNzdWVkRnVsTGlzdDogQXJyYXk8Q29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q+ID0gW107XG4gICAgcHVibGljIENvbXBQYXhMaXN0Tm90SXNzdWVkOiBBcnJheTxDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdD4gPSBbXTtcbiAgICBwdWJsaWMgQ29tcFBheExpc3ROb3RJc3N1ZWRGdWxMaXN0OiBBcnJheTxDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdD4gPSBbXTtcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdDogQXJyYXk8SXNzdWVDb21wZW5zYXRpb25MaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBJc3N1ZUNvbXBQYXhMaXN0OiBBcnJheTxDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdD4gPSBbXTtcbiAgICBwdWJsaWMgc3RhdGljIE1heEVNRElzc3VlZDogbnVtYmVyID0gNTA7XG4gICAgcHVibGljIHN0YXRpYyBJU1NVRUNPTVBFTlNBVElPTlRPQVNUOiBzdHJpbmcgPSBcIkFyZSB5b3UgcmVhZHkgdG8gaXNzdWUgY29tcGVuc2F0aW9uP1wiO1xuICAgIHB1YmxpYyBzdGF0aWMgTlVNQkVSVkFMSURBVElPTlRPQVNUOiBzdHJpbmcgPSBcIkludmFsaWQuIEVudGVyIHZhbHVlIGluIG51bWJlcnNcIjtcbiAgICBwdWJsaWMgc3RhdGljIENPTVBFTlNBVElPTk5BVE9BU1Q6IHN0cmluZyA9IFwiQ29tcGVuc2F0aW9uIG5vdCBhcHBsaWNhYmxlXCI7XG4gICAgcHVibGljIHN0YXRpYyBNVVNUQkVUT0FTVDogc3RyaW5nID0gXCJNdXN0IGJlOlwiO1xuICAgIHB1YmxpYyBzdGF0aWMgQ09NUEVOU0FUSU9ORklSU1RUQUI6IHN0cmluZyA9IFwiQ29tcGVuc2F0aW9uIElzc3VlZFwiO1xuICAgIHB1YmxpYyBzdGF0aWMgQ09NUEVOU0FUSU9OU0VDT05EVEFCOiBzdHJpbmcgPSBcIkNvbXBlbnNhdGlvbiBOb3QgSXNzdWVkXCI7XG4gICAgcHVibGljIHN0YXRpYyBOT0JMVUVUT09USERFVklDRTogc3RyaW5nID0gXCJObyBCbHVldG9vdGggUHJpbnRlciBGb3VuZC4gUGxlYXNlIHNldCB0aGUgUHJpbnRlciBpbiBTZXR0aW5ncyBQYWdlXCI7XG4gICAgcHVibGljIHN0YXRpYyBVTkFCTEVUT1BSSU5UOiBzdHJpbmcgPSBcIlVuYWJsZSB0byBQcmludFwiO1xuICAgIHB1YmxpYyBzdGF0aWMgUFJJTlRFUlNFU1NJT046IHN0cmluZyA9IFwiVW5hYmxlIHRvIGNvbm5lY3QgdG8gcHJpbnRlciBzZXNzaW9uLCB0cnkgYWdhaW4gbGF0ZXJcIjtcbiAgICAvLyBwdWJsaWMgSXNzdWVDb21wZW5zYXRpb25SZXNwb25zZTogYW55O1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb24sIHByaXZhdGUgX3NlcnZpY2VzOiBQYXNzZW5nZXJTZXJ2aWNlLCBwcml2YXRlIGFjdGl2YXRlZFJvdXRlcjogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgX3NoYXJlZDogQ2hlY2tpbk9yZGVyU2VydmljZSwgcHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMsIHB1YmxpYyBfdGltZW91dFNlcnZpY2U6IFRpbWVPdXRTZXJ2aWNlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwdWJsaWMgX2RhdGFTZXJ2aWNlOiBEYXRhU2VydmljZSwgcHVibGljIF9zZXJ2aWNlOiBDb21wZW5zYXRpb25TZXJ2aWNlLCBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSkge1xuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzID0gbmV3IExvYWRlclByb2dyZXNzKCk7XG4gICAgICAgIHRoaXMuYXBpc2RldGFpbHMgPSBbXTtcblxuICAgICAgICB0aGlzLmZpcnN0dGFiLnRpdGxlID0gSXNzdWVDb21wZW5zYXRpb25XaXRoVGFiQ29tcG9uZW50LkNPTVBFTlNBVElPTkZJUlNUVEFCO1xuICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5maXJzdHRhYik7XG5cbiAgICAgICAgdGhpcy5zZWNvbmR0YWIudGl0bGUgPSBJc3N1ZUNvbXBlbnNhdGlvbldpdGhUYWJDb21wb25lbnQuQ09NUEVOU0FUSU9OU0VDT05EVEFCO1xuICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5zZWNvbmR0YWIpO1xuICAgIH1cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCd+L2ltYWdlcy9sb2dpbl9iYWNrLmpwZWcnKVwiO1xuICAgICAgICB0aGlzLnBhZ2Uuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBcImNvdmVyIFwiO1xuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmluaXRMb2FkZXIodGhpcy5wYWdlQ29udCk7XG4gICAgICAgIHRoaXMudXNlcmRldGFpbHMgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcInVzZXJkZXRhaWxzXCIsIFwiXCIpO1xuICAgICAgICB0aGlzLmlzQ2hlY2tpbkRpc2FibGVkID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiY2hlY2tpbkRpc2FibGVkXCIpO1xuICAgICAgICB0aGlzLmlzR2F0ZURpc2FibGVkID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiZ2F0ZURpc2FibGVkXCIpO1xuICAgICAgICB0aGlzLkZsaWdodEhlYWRlckluZm8gPSB0aGlzLl9zaGFyZWQuZ2V0RmxpZ2h0SGVhZGVySW5mbygpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkZsaWdodFwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5GbGlnaHRIZWFkZXJJbmZvKSk7XG4gICAgICAgIHRoaXMuSXNzdWVDb21wUGF4TGlzdCA9IHRoaXMuX3NoYXJlZC5nZXRDb21wZW5zYXRpb25QYXhMaXN0KCk7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVkUm91dGVyLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZSgocGFyYW1zKSA9PiB7XG4gICAgICAgICAgICBpZiAocGFyYW1zW1wiZGF0ZVwiXSAhPSBudWxsICYmIHBhcmFtc1tcImRhdGVcIl0gIT0gXCJcIiAmJiBwYXJhbXNbXCJkYXRlXCJdICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZsaWdodGRhdGUgPSBwYXJhbXNbXCJkYXRlXCJdO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3XCIgKyB0aGlzLmZsaWdodGRhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcmFtc1tcImZsaWdodG51bWJlclwiXSAhPSBudWxsICYmIHBhcmFtc1tcImZsaWdodG51bWJlclwiXSAhPSBcIlwiICYmIHBhcmFtc1tcImZsaWdodG51bWJlclwiXSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mbGlnaHRudW1iZXIgPSBwYXJhbXNbXCJmbGlnaHRudW1iZXJcIl07XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXcgMVwiICsgdGhpcy5mbGlnaHRudW1iZXIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuYWN0aXZhdGVkUm91dGVyLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZSgocGFyYW1zKSA9PiB7XG4gICAgICAgICAgICAvLyB0aGlzLlBheEl0ZW0gPSBKU09OLnBhcnNlKHBhcmFtc1tcImRhdGFcIl0pO1xuICAgICAgICAgICAgdGhpcy5QcmV2aW91c1BhZ2UgPSBwYXJhbXNbXCJwcmVwYWdlXCJdO1xuICAgICAgICAgICAgdGhpcy5PcmRlcklkID0gcGFyYW1zW1wiZGF0YVwiXVxuICAgICAgICAgICAgLy8gdGhpcy5QYXNzZW5nZXJOYW1lID0gdGhpcy5QYXhJdGVtLkZ1bGxOYW1lO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ2XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLk9yZGVySWQpKTtcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKHRoaXMuUHJldmlvdXNQYWdlID09IFwiT3JkZXJJZFwiKSB7XG4gICAgICAgICAgICB0aGlzLklzSGVhZGVySW5mbyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLklzRmxpZ2h0SW5mbyA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gdGhpcy5Db21wZW5zYXRpb25PcmRlckRldGFpbHMgPSB0aGlzLl9zaGFyZWQuR2V0Q29tcGVuc2F0aW9uT3JkZXJEZWF0aWxzKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLklzSGVhZGVySW5mbyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5Jc0ZsaWdodEluZm8gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuSXNzdWVDb21wUGF4TGlzdC5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEuSXNDb21wZW5zYXRpb25Jc3N1ZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLm1vbmV0YXJ5ID09IDAgJiYgZGF0YS5ob3RlbCA9PSAwICYmIGRhdGEubWVhbCA9PSAwICYmIGRhdGEudHJhbnNwb3J0YXRpb24gPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZC5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlRvdGFsUGFzc2VuZ2VyQ291bnQgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbElzc3VlZE1vbmV0YXJ5ID0gdGhpcy50b3RhbElzc3VlZE1vbmV0YXJ5ICsgTnVtYmVyKGRhdGEubW9uZXRhcnkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSXNzdWVkSG90ZWwgKz0gTnVtYmVyKGRhdGEuaG90ZWwpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSXNzdWVkTWVhbCArPSBOdW1iZXIoZGF0YS5tZWFsKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbElzc3VlZFRyYW5zcG9ydCArPSBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5Ub3RhbFBhc3NlbmdlckNvdW50ID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbE5vdElzc3VlZE1vbmV0YXJ5ID0gdGhpcy50b3RhbE5vdElzc3VlZE1vbmV0YXJ5ICsgTnVtYmVyKGRhdGEubW9uZXRhcnkpO1xuICAgICAgICAgICAgICAgIHRoaXMudG90YWxOb3RJc3N1ZWRIb3RlbCArPSBOdW1iZXIoZGF0YS5ob3RlbCk7XG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbE5vdElzc3VlZE1lYWwgKz0gTnVtYmVyKGRhdGEubWVhbCk7XG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbE5vdElzc3VlZFRyYW5zcG9ydCArPSBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkRnVsTGlzdCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWQ7XG4gICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWRGdWxMaXN0ID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZDtcbiAgICAgICAgdGhpcy5hcGlzZGV0YWlscyA9IFtdO1xuICAgICAgICB0aGlzLkNvbXBlbnNhdGVkUGF4Q291bnQgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkLmxlbmd0aDtcbiAgICAgICAgdGhpcy5maXJzdHRhYi50aXRsZSA9IElzc3VlQ29tcGVuc2F0aW9uV2l0aFRhYkNvbXBvbmVudC5DT01QRU5TQVRJT05GSVJTVFRBQiArIFwiKFwiICsgdGhpcy5Db21wZW5zYXRlZFBheENvdW50ICsgXCIpXCI7O1xuICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5maXJzdHRhYik7XG4gICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uTm90SXNzdWVkUGF4Q291bnQgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLmxlbmd0aDtcbiAgICAgICAgdGhpcy5zZWNvbmR0YWIudGl0bGUgPSBJc3N1ZUNvbXBlbnNhdGlvbldpdGhUYWJDb21wb25lbnQuQ09NUEVOU0FUSU9OU0VDT05EVEFCICsgXCIoXCIgKyB0aGlzLkNvbXBlbnNhdGlvbk5vdElzc3VlZFBheENvdW50ICsgXCIpXCI7O1xuICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5zZWNvbmR0YWIpO1xuXG4gICAgfVxuICAgIHByaW50RW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgJiYgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaXNFZGl0RW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgJiYgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZW1haWxFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5TZWxlY3RlZFBhc3NlbmdlciAmJiB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5tb25ldGFyeSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFbWFpbEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRW1haWxFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pc0VtYWlsRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzRW1haWxFbmFibGVkID09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBkaXNwbGF5UHJvZHVjdEFjdGlvbkRpYWxvZ0ZvclNtYXJ0RmlsdGVyKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHRpdGxlOiBcIlNtYXJ0IGZpbHRlciBvcHRpb25cIixcbiAgICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXCJOYW1lXCIsIFwiT3JkZXIgSURcIiwgXCJDbGFzc1wiXSxcbiAgICAgICAgfTtcbiAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzdWx0ICE9IFwiQ2FuY2VsXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLlNlYXJjaENyaXRlcmlhID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVzOlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5TZWFyY2hDcml0ZXJpYSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZGlzcGxheVByb2R1Y3RBY3Rpb25EaWFsb2dGb3JQcmludGVyKCkge1xuICAgICAgICB2YXIgaG9zdGVkY2hlY2sgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJpc0hvc3RCb2FyZGluZ1wiKTtcbiAgICAgICAgaWYgKGhvc3RlZGNoZWNrKSB7XG4gICAgICAgICAgICB0aGlzLnByaW50RU1EKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJsdWV0b290aEVNRCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRpc3BsYXlEaWFsb2dGb3JGbGl0ZXJQYXNzZW5nZXJUeXBlKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHRpdGxlOiBcIlBhc3NlbmdlciB0eXBlIGZpbHRlclwiLFxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcIkFsbCBQYXNzZW5nZXJzXCIsIFwiRVRLVCBQYXNzZW5nZXJzXCIsIFwiQ2hlY2tlZC1JbiBQYXNzZW5nZXJzXCIsIFwiTm90IENoZWNrZWQtSW4gUGFzc2VuZ2Vyc1wiXSxcbiAgICAgICAgfTtcbiAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzdWx0ICE9IFwiQ2FuY2VsXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLlBhc3NlbmdlckZsaXRlckNyaXRlcmlhID0gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZmlsdGVyKGFyZ3M6IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIk5hbWU6XCIgKyBKU09OLnN0cmluZ2lmeShhcmdzKSk7XG4gICAgICAgIGxldCBzZWdCYXJFbG0gPSA8U2VnbWVudGVkQmFyPnRoaXMuc2VnYmFyLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGxldCBpbmRleCA9IHNlZ0JhckVsbS5zZWxlY3RlZEluZGV4O1xuICAgICAgICBpZiAoaW5kZXggPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWRGdWxMaXN0O1xuICAgICAgICAgICAgaWYgKHRoaXMuU2VhcmNoQ3JpdGVyaWEgPT0gXCJOYW1lXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJncykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGFyZ3MudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZC5maWx0ZXIociA9PiByLkdpdmVuTmFtZS5pbmRleE9mKG5hbWUudHJpbSgpKSA+PSAwIHx8IHIuTGFzdE5hbWUuaW5kZXhPZihuYW1lLnRyaW0oKSkgPj0gMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3RJc3N1ZWQgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkRnVsTGlzdDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLlNlYXJjaENyaXRlcmlhID09IFwiT3JkZXIgSURcIikge1xuICAgICAgICAgICAgICAgIGlmIChhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXJncy50b1N0cmluZygpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3RJc3N1ZWQgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkLmZpbHRlcihyID0+IHIuT3JkZXJJZC5pbmRleE9mKG5hbWUudHJpbSgpKSA+PSAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWRGdWxMaXN0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXJncy50b1N0cmluZygpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3RJc3N1ZWQgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkLmZpbHRlcihyID0+IHIuQ2FiaW4uaW5kZXhPZihuYW1lLnRyaW0oKSkgPj0gMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3RJc3N1ZWQgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkRnVsTGlzdDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5Ub3RhbFBhc3NlbmdlckNvdW50ID0gdGhpcy5Db21wUGF4TGlzdC5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZEZ1bExpc3Q7XG4gICAgICAgICAgICBpZiAodGhpcy5TZWFyY2hDcml0ZXJpYSA9PSBcIk5hbWVcIikge1xuICAgICAgICAgICAgICAgIGlmIChhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXJncy50b1N0cmluZygpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLmZpbHRlcihyID0+IHIuR2l2ZW5OYW1lLmluZGV4T2YobmFtZS50cmltKCkpID49IDAgfHwgci5MYXN0TmFtZS5pbmRleE9mKG5hbWUudHJpbSgpKSA+PSAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWRGdWxMaXN0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuU2VhcmNoQ3JpdGVyaWEgPT0gXCJPcmRlciBJRFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmdzLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQuZmlsdGVyKHIgPT4gci5PcmRlcklkLmluZGV4T2YobmFtZS50cmltKCkpID49IDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZEZ1bExpc3Q7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmdzLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQuZmlsdGVyKHIgPT4gci5DYWJpbi5pbmRleE9mKG5hbWUudHJpbSgpKSA+PSAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWRGdWxMaXN0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLlRvdGFsUGFzc2VuZ2VyQ291bnQgPSB0aGlzLkNvbXBQYXhMaXN0Lmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIGlzc3VlRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgJiYgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyB0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuSXNFZGl0YWJsZSA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEubW9uZXRhcnkgPT0gMCAmJiBkYXRhLmhvdGVsID09IDAgJiYgZGF0YS5tZWFsID09IDAgJiYgZGF0YS50cmFuc3BvcnRhdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuU2VsZWN0QWxsUGF4ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGlmICh0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRvZ2dsZUNoZWNrZWQocGF4OiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCkge1xuICAgICAgICBpZiAodGhpcy5Jc0xhYmVsRmllbGQgPT0gdHJ1ZSAmJiB0aGlzLkNvbXBlbnNhdGlvbk5vdElzc3VlZExpc3QgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuSXNMYWJlbEZpZWxkID09IHRydWUpIHtcblxuICAgICAgICAgICAgICAgIGlmIChwYXguSXNTZWxlY3RlZCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRU1EcyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLm1vbmV0YXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVNRHMgKz0gTnVtYmVyKGRhdGEuaG90ZWwpICsgTnVtYmVyKGRhdGEubWVhbCkgKyBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbikgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRU1EcyArPSBOdW1iZXIoZGF0YS5ob3RlbCkgKyBOdW1iZXIoZGF0YS5tZWFsKSArIE51bWJlcihkYXRhLnRyYW5zcG9ydGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvdW50RU1EOlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5zZWxlY3RlZEVNRHMpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIodGhpcy5TZWxlY3RlZFBhc3Nlbmdlcik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXgubW9uZXRhcnkgPT0gMCAmJiBwYXguaG90ZWwgPT0gMCAmJiBwYXgubWVhbCA9PSAwICYmIHBheC50cmFuc3BvcnRhdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXguSXNTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLnB1c2gocGF4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiSW5lbGlnaWJsZSBQYXNzZW5nZXIocykgaXMgc2VsZWN0ZWQuXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXgubW9uZXRhcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHRoaXMuc2VsZWN0ZWRFTURzICsgTnVtYmVyKHBheC5ob3RlbCkgKyBOdW1iZXIocGF4Lm1lYWwpICsgTnVtYmVyKHBheC50cmFuc3BvcnRhdGlvbikgKyAxKSA8PSBJc3N1ZUNvbXBlbnNhdGlvbldpdGhUYWJDb21wb25lbnQuTWF4RU1ESXNzdWVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheC5Jc1NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5wdXNoKHBheCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFTURzICs9IE51bWJlcihwYXguaG90ZWwpICsgTnVtYmVyKHBheC5tZWFsKSArIE51bWJlcihwYXgudHJhbnNwb3J0YXRpb24pICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgodGhpcy5zZWxlY3RlZEVNRHMgKyBOdW1iZXIocGF4LmhvdGVsKSArIE51bWJlcihwYXgubWVhbCkgKyBOdW1iZXIocGF4LnRyYW5zcG9ydGF0aW9uKSkgPD0gSXNzdWVDb21wZW5zYXRpb25XaXRoVGFiQ29tcG9uZW50Lk1heEVNRElzc3VlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXguSXNTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIucHVzaChwYXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRU1EcyArPSBOdW1iZXIocGF4LmhvdGVsKSArIE51bWJlcihwYXgubWVhbCkgKyBOdW1iZXIocGF4LnRyYW5zcG9ydGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQubGVuZ3RoID09PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCkgdGhpcy5TZWxlY3RBbGxQYXggPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuc3BsaWNlKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuaW5kZXhPZihwYXgpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKHBheC5tb25ldGFyeSkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5zZWxlY3RlZEVNRHMgPSB0aGlzLnNlbGVjdGVkRU1EcyAtIChOdW1iZXIocGF4LmhvdGVsKSArIE51bWJlcihwYXgubWVhbCkgKyBOdW1iZXIocGF4LnRyYW5zcG9ydGF0aW9uKSArIDEpO1xuICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5zZWxlY3RlZEVNRHMgPSB0aGlzLnNlbGVjdGVkRU1EcyAtIChOdW1iZXIocGF4LmhvdGVsKSArIE51bWJlcihwYXgubWVhbCkgKyBOdW1iZXIocGF4LnRyYW5zcG9ydGF0aW9uKSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVNRHMgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF4Lm1vbmV0YXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVNRHMgKz0gTnVtYmVyKGRhdGEuaG90ZWwpICsgTnVtYmVyKGRhdGEubWVhbCkgKyBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbikgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRU1EcyArPSBOdW1iZXIoZGF0YS5ob3RlbCkgKyBOdW1iZXIoZGF0YS5tZWFsKSArIE51bWJlcihkYXRhLnRyYW5zcG9ydGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb3VudEVNRDpcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuc2VsZWN0ZWRFTURzKSk7XG4gICAgICAgICAgICAgICAgICAgIHBheC5Db21wZW5zYXRpb25SZWFzb24gPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBwYXguSXNTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdEFsbFBheCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRoaXMuU2VsZWN0ZWRQYXhjb3VudCA9IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFBhc3NlbmdlckNvdW50ID0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5sZW5ndGg7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdW50MTpcIiArIHRoaXMuc2VsZWN0ZWRFTURzKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLkNvbXBlbnNhdGlvbklzc3VlZExpc3QgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKHBheC5Jc1NlbGVjdGVkID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcGF4LklzU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRW1haWxDb3B5dG9TZWxlY3RQYXhUcnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBheC5FbWFpbCA9IHRoaXMuRW1haWxJZFNlbGVjdGVkUGF4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLnB1c2gocGF4KTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5Db21wUGF4TGlzdElzc3VlZEZ1bExpc3QubGVuZ3RoID09PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCkgdGhpcy5TZWxlY3RBbGxQYXggPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTGVuXCIgKyB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuc3BsaWNlKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuaW5kZXhPZihwYXgpLCAxKTtcbiAgICAgICAgICAgICAgICBwYXguSXNTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0QWxsUGF4ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUGFzc2VuZ2VyQ291bnQgPSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlZGl0YWJsZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgJiYgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLklzRWRpdGFibGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5Jc0xhYmVsRmllbGQgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWRpdDogXCIgKyB0aGlzLklzRWRpdGFibGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJEb25lOlwiICsgdGhpcy5Jc0xhYmVsRmllbGQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRvbmUoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzQnV0dG9uRW5hYmxlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRU1EcyA9IDA7XG4gICAgICAgICAgICB0aGlzLmlzT3ZlcnJpZGVSZWFzb25CbGFuayA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLmlzTW9uZXRhcnlPdmVycmlkZGVuID09IHRydWUgJiYgZGF0YS5Nb25ldGFyeU92ZXJyaWRlUmVhc29uID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc092ZXJyaWRlUmVhc29uQmxhbmsgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm92ZXJpZGVyZWFzb25mb3Jtb25ldGFyeShkYXRhLCAxKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEuaXNIb3RlbE92ZXJyaWRkZW4gPT0gdHJ1ZSAmJiBkYXRhLkhvdGVsT3ZlcnJpZGVSZWFzb24gPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzT3ZlcnJpZGVSZWFzb25CbGFuayA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3ZlcmlkZXJlYXNvbmZvcmhvdGVsKGRhdGEsIDEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5pc01lYWxPdmVycmlkZGVuID09IHRydWUgJiYgZGF0YS5NZWFsT3ZlcnJpZGVSZWFzb24gPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzT3ZlcnJpZGVSZWFzb25CbGFuayA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3ZlcmlkZXJlYXNvbmZvcm1lYWwoZGF0YSwgMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLmlzVHJhbnNwb3J0T3ZlcnJpZGRlbiA9PSB0cnVlICYmIGRhdGEuVHJhbnNwb3J0T3ZlcnJpZGVSZWFzb24gPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzT3ZlcnJpZGVSZWFzb25CbGFuayA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3ZlcmlkZXJlYXNvbmZvcnRyYW5zcG9ydChkYXRhLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzT3ZlcnJpZGVSZWFzb25CbGFuaykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLklzRWRpdGFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc0xhYmVsRmllbGQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvdW50OlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5zZWxlY3RlZEVNRHMpKTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5tb25ldGFyeSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRU1EcyA9IHRoaXMuc2VsZWN0ZWRFTURzICsgTnVtYmVyKGRhdGEuaG90ZWwpICsgTnVtYmVyKGRhdGEubWVhbCkgKyBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbikgKyAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFTURzID0gdGhpcy5zZWxlY3RlZEVNRHMgKyBOdW1iZXIoZGF0YS5ob3RlbCkgKyBOdW1iZXIoZGF0YS5tZWFsKSArIE51bWJlcihkYXRhLnRyYW5zcG9ydGF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFTURzID4gSXNzdWVDb21wZW5zYXRpb25XaXRoVGFiQ29tcG9uZW50Lk1heEVNRElzc3VlZCkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLklzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5zcGxpY2UodGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5pbmRleE9mKGRhdGEpLCAxKVxuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3NlbmdlciA9IFtdO1xuICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZC5mb3JFYWNoKChwYXhEYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwYXhEYXRhLklzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5wdXNoKHBheERhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVNRHMgPSAwO1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLm1vbmV0YXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFTURzID0gdGhpcy5zZWxlY3RlZEVNRHMgKyBOdW1iZXIoZGF0YS5ob3RlbCkgKyBOdW1iZXIoZGF0YS5tZWFsKSArIE51bWJlcihkYXRhLnRyYW5zcG9ydGF0aW9uKSArIDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVNRHMgPSB0aGlzLnNlbGVjdGVkRU1EcyArIE51bWJlcihkYXRhLmhvdGVsKSArIE51bWJlcihkYXRhLm1lYWwpICsgTnVtYmVyKGRhdGEudHJhbnNwb3J0YXRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvLyB0aGlzLlNlbGVjdGVkUGF4Y291bnQgPSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0OiBcIiArIHRoaXMuSXNFZGl0YWJsZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRvbmU6XCIgKyB0aGlzLklzTGFiZWxGaWVsZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc29ydEJhc2VkT25QYXhOYW1lKCkge1xuICAgICAgICB2YXIgaXNBc2M6IG51bWJlciA9IHRoaXMubmFtZVNvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xuICAgICAgICB0aGlzLm5hbWVTb3J0SW5kaWNhdG9yID0gdGhpcy5uYW1lU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMuc3NyU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLnRpZXJTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMuY2xhc3NTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMub3JkZXJJZFNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5Db21wUGF4TGlzdC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICB2YXIgdmFsMSA9IGEuRnVsbE5hbWU7XG4gICAgICAgICAgICB2YXIgdmFsMiA9IGIuRnVsbE5hbWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2YWwxICsgXCIgXCIgKyB2YWwyKTtcbiAgICAgICAgICAgIGlmIChpc0FzYyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPCB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh2YWwxID4gdmFsMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzb3J0QmFzZWRPblNTUigpIHtcbiAgICAgICAgdmFyIGlzQXNjOiBudW1iZXIgPSB0aGlzLnNzclNvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xuICAgICAgICB0aGlzLnNzclNvcnRJbmRpY2F0b3IgPSB0aGlzLnNzclNvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xuICAgICAgICB0aGlzLm5hbWVTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMudGllclNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5jbGFzc1NvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5vcmRlcklkU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLkNvbXBQYXhMaXN0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciB2YWwxID0gYS5TU1I7XG4gICAgICAgICAgICB2YXIgdmFsMiA9IGIuU1NSO1xuICAgICAgICAgICAgY29uc29sZS5sb2codmFsMSArIFwiIFwiICsgdmFsMik7XG4gICAgICAgICAgICBpZiAoaXNBc2MgPT0gMCkge1xuICAgICAgICAgICAgICAgIGlmICh2YWwxIDwgdmFsMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsMSA+IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc29ydEJhc2VkT25UaWVyKCkge1xuICAgICAgICB2YXIgaXNBc2M6IG51bWJlciA9IHRoaXMudGllclNvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xuICAgICAgICB0aGlzLnRpZXJTb3J0SW5kaWNhdG9yID0gdGhpcy50aWVyU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMuc3NyU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLm5hbWVTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMuY2xhc3NTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMub3JkZXJJZFNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5Db21wUGF4TGlzdC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICB2YXIgdmFsMSA9IGEuVGllcjtcbiAgICAgICAgICAgIHZhciB2YWwyID0gYi5UaWVyO1xuICAgICAgICAgICAgY29uc29sZS5sb2codmFsMSArIFwiIFwiICsgdmFsMik7XG4gICAgICAgICAgICBpZiAoaXNBc2MgPT0gMCkge1xuICAgICAgICAgICAgICAgIGlmICh2YWwxIDwgdmFsMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsMSA+IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc29ydEJhc2VkT25DbGFzcygpIHtcbiAgICAgICAgdmFyIGlzQXNjOiBudW1iZXIgPSB0aGlzLmNsYXNzU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMuY2xhc3NTb3J0SW5kaWNhdG9yID0gdGhpcy5jbGFzc1NvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xuICAgICAgICB0aGlzLnNzclNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy50aWVyU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLm5hbWVTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMub3JkZXJJZFNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5Db21wUGF4TGlzdC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICB2YXIgdmFsMSA9IGEuQ2FiaW47XG4gICAgICAgICAgICB2YXIgdmFsMiA9IGIuQ2FiaW47XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2YWwxICsgXCIgXCIgKyB2YWwyKTtcbiAgICAgICAgICAgIGlmIChpc0FzYyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPCB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh2YWwxID4gdmFsMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzb3J0QmFzZWRPbk9yZGVySWQoKSB7XG4gICAgICAgIHZhciBpc0FzYzogbnVtYmVyID0gdGhpcy5vcmRlcklkU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMub3JkZXJJZFNvcnRJbmRpY2F0b3IgPSB0aGlzLm9yZGVySWRTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcbiAgICAgICAgdGhpcy5zc3JTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMudGllclNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5jbGFzc1NvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5uYW1lU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLkNvbXBQYXhMaXN0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciB2YWwxID0gYS5PcmRlcklkO1xuICAgICAgICAgICAgdmFyIHZhbDIgPSBiLk9yZGVySWQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2YWwxICsgXCIgXCIgKyB2YWwyKTtcbiAgICAgICAgICAgIGlmIChpc0FzYyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPCB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh2YWwxID4gdmFsMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZWxlY3RpbmdBbGxQYXgoKSB7XG4gICAgICAgIGlmICh0aGlzLkNvbXBlbnNhdGlvbklzc3VlZExpc3QgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gdGhpcy5TZWxlY3RlZFBhc3NlbmdlciA9IFtdO1xuICAgICAgICAgICAgaWYgKHRoaXMuU2VsZWN0QWxsUGF4ID09IGZhbHNlICYmIHRoaXMuU2VsZWN0QWxsUGF4VmFyID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RBbGxQYXhWYXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0QWxsUGF4ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZGF0YS5Jc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLklzU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNFbWFpbENvcHl0b1NlbGVjdFBheFRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLkVtYWlsID0gdGhpcy5FbWFpbElkU2VsZWN0ZWRQYXg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdEFsbFBheFZhciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0QWxsUGF4ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZC5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLklzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLkNvbXBQYXhMaXN0SXNzdWVkRnVsTGlzdC5sZW5ndGggPT09IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIubGVuZ3RoKSB0aGlzLlNlbGVjdEFsbFBheCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUGFzc2VuZ2VyQ291bnQgPSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aDtcbiAgICAgICAgfSBpZiAodGhpcy5Jc0xhYmVsRmllbGQgPT0gdHJ1ZSAmJiB0aGlzLkNvbXBlbnNhdGlvbk5vdElzc3VlZExpc3QgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuSXNMYWJlbEZpZWxkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXNJbmVsaWdpYmxlU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5TZWxlY3RBbGxQYXggPT0gZmFsc2UgJiYgdGhpcy5TZWxlY3RBbGxQYXhWYXIgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RBbGxQYXhWYXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXhjZWVkTGltaXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZC5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRhLklzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG90YWxFbWRzOiBudW1iZXIgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLm1vbmV0YXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsRW1kcyA9IE51bWJlcih0aGlzLnNlbGVjdGVkRU1EcykgKyBOdW1iZXIoZGF0YS5ob3RlbCkgKyBOdW1iZXIoZGF0YS5tZWFsKSArIE51bWJlcihkYXRhLnRyYW5zcG9ydGF0aW9uKSArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxFbWRzID0gTnVtYmVyKHRoaXMuc2VsZWN0ZWRFTURzKSArIE51bWJlcihkYXRhLmhvdGVsKSArIE51bWJlcihkYXRhLm1lYWwpICsgTnVtYmVyKGRhdGEudHJhbnNwb3J0YXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodG90YWxFbWRzIDw9IElzc3VlQ29tcGVuc2F0aW9uV2l0aFRhYkNvbXBvbmVudC5NYXhFTURJc3N1ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEubW9uZXRhcnkgPT0gMCAmJiBkYXRhLmhvdGVsID09IDAgJiYgZGF0YS5tZWFsID09IDAgJiYgZGF0YS50cmFuc3BvcnRhdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0luZWxpZ2libGVTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLklzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0QWxsUGF4ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5tb25ldGFyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFTURzICs9IE51bWJlcihkYXRhLmhvdGVsKSArIE51bWJlcihkYXRhLm1lYWwpICsgTnVtYmVyKGRhdGEudHJhbnNwb3J0YXRpb24pICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVNRHMgKz0gTnVtYmVyKGRhdGEuaG90ZWwpICsgTnVtYmVyKGRhdGEubWVhbCkgKyBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLklzU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhjZWVkTGltaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUb2FzdC5tYWtlVGV4dChJc3N1ZUNvbXBlbnNhdGlvbkNvbXBvbmVudC5NYXhFTURJc3N1ZWQgKyBcIkVNRCdzIHNlbGVjdGVkXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIGlmIChleGNlZWRMaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSXNzdWVDb21wZW5zYXRpb25XaXRoVGFiQ29tcG9uZW50Lk1heEVNRElzc3VlZCArIFwiIEVNRCdzIHNlbGVjdGVkXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0QWxsUGF4VmFyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0QWxsUGF4ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuSXNTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3NlbmdlciA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVNRHMgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZEZ1bExpc3QubGVuZ3RoID09PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCkgdGhpcy5TZWxlY3RBbGxQYXggPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzSW5lbGlnaWJsZVNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbmVsaWdpYmxlIFBhc3NlbmdlcihzKSBhcmUgbm90IHNlbGVjdGVkLlwiKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGF4Y291bnQgPSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRQYXNzZW5nZXJDb3VudCA9IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIubGVuZ3RoO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5TZWxlY3RlZFBhc3Nlbmdlcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZWxlY3RlZFBhc3NlbmdlckNvdW50ID0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5sZW5ndGg7XG5cbiAgICB9XG4gICAgcHVibGljIHNlbGVjdFNlZ21lbnQoZTogYW55KSB7XG4gICAgICAgIHZhciBzZWxJbmQgPSBlLm5ld0luZGV4O1xuICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyID0gW107XG4gICAgICAgIGlmIChzZWxJbmQgPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25Jc3N1ZWRMaXN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uTm90SXNzdWVkTGlzdCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RBbGxQYXggPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuU2VhcmNoQ3JpdGVyaWEgPSBcIk5hbWVcIjtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoRmllbGQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZEZ1bExpc3Q7XG4gICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0LmZvckVhY2goKGRhdGEsIGkpID0+IHsgZGF0YS5Jc1NlbGVjdGVkID0gZmFsc2U7IH0pXG4gICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZEZ1bExpc3Q7XG4gICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZEZ1bExpc3Q7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUGFzc2VuZ2VyQ291bnQgPSAwO1xuICAgICAgICAgICAgdGhpcy5Ub3RhbFBhc3NlbmdlckNvdW50ID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZEZ1bExpc3QubGVuZ3RoO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIklzc3VlZFwiICsgdGhpcy5Db21wUGF4TGlzdElzc3VlZC5sZW5ndGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25Jc3N1ZWRMaXN0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbk5vdElzc3VlZExpc3QgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RBbGxQYXggPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuU2VhcmNoQ3JpdGVyaWEgPSBcIk5hbWVcIjtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoRmllbGQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUGFzc2VuZ2VyQ291bnQgPSAwO1xuICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWRGdWxMaXN0O1xuICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdC5mb3JFYWNoKChkYXRhLCBpKSA9PiB7IGRhdGEuSXNTZWxlY3RlZCA9IGZhbHNlOyB9KVxuICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWRGdWxMaXN0O1xuICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWRGdWxMaXN0O1xuICAgICAgICAgICAgdGhpcy5Ub3RhbFBhc3NlbmdlckNvdW50ID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZEZ1bExpc3QubGVuZ3RoO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgSXNzdWVkXCIgKyB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaXNzdWVDb21wZW5zYXRpb25Db25maXJtYXRpb24oKSB7XG4gICAgICAgIGRpYWxvZ3MuY29uZmlybShJc3N1ZUNvbXBlbnNhdGlvbldpdGhUYWJDb21wb25lbnQuSVNTVUVDT01QRU5TQVRJT05UT0FTVCkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJEaWFsb2cgcmVzdWx0OiBcIiArIHJlc3VsdCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc3N1ZUNvbXBlbnNhdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaXNzdWVDb21wZW5zYXRpb24oKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHRoaXMuRmxpZ2h0SGVhZGVySW5mbyA9IHRoaXMuX3NoYXJlZC5nZXRGbGlnaHRIZWFkZXJJbmZvKCk7XG4gICAgICAgICAgICB2YXIgc3RhcnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBDdXJEYXRlID0gbW9tZW50KHN0YXJ0RGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKEN1ckRhdGUpXG4gICAgICAgICAgICBsZXQgYWdlbnRQcm9maWxlID0gdGhpcy5fc2hhcmVkLkdldFVzZXJQcm9maWxlKCk7XG4gICAgICAgICAgICBsZXQgSXNzdWVDb21wZW5zYXRpb25TdHJ1Y3R1cmUgPSBDb252ZXJ0ZXJzLmNvbnZlcnRUb0lzc3VlQ29tcGVuc2F0aW9uKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIsIHRoaXMuRmxpZ2h0SGVhZGVySW5mbywgQ3VyRGF0ZSwgYWdlbnRQcm9maWxlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSXNzdWVDb21wZW5zYXRpb24gUmVxOlwiICsgSlNPTi5zdHJpbmdpZnkoSXNzdWVDb21wZW5zYXRpb25TdHJ1Y3R1cmUpKTtcblxuICAgICAgICAgICAgdGhpcy5fc2VydmljZS5Qb3N0SXNzdWVDb21wZW5zYXRpb25zKElzc3VlQ29tcGVuc2F0aW9uU3RydWN0dXJlKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklzc3VlQ29tcGVuc2F0aW9uIFJlczpcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5TdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBQYXhSZXNwb25zZSA9IENvbnZlcnRlcnMuY29udmVydFRvSXNzdWVDb21wZW5zYXRpb25SZXNwb25zZShkYXRhLCB0aGlzLklzc3VlQ29tcFBheExpc3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJiZWZvcmVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLklzc3VlQ29tcFBheExpc3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc3N1ZUNvbXBQYXhMaXN0ID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSXNzdWVDb21wUGF4TGlzdCA9IFBheFJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5Jc3N1ZUNvbXBQYXhMaXN0ID0gSXNzdWVDb21wZW5zYXRpb25SZXNwb25zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3RJc3N1ZWQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxJc3N1ZWRNb25ldGFyeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSXNzdWVkSG90ZWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbElzc3VlZE1lYWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbElzc3VlZFRyYW5zcG9ydCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTm90SXNzdWVkTW9uZXRhcnkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE5vdElzc3VlZEhvdGVsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxOb3RJc3N1ZWRNZWFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxOb3RJc3N1ZWRUcmFuc3BvcnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhZnRlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuSXNzdWVDb21wUGF4TGlzdCk7ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSXNzdWVDb21wUGF4TGlzdC5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLklzQ29tcGVuc2F0aW9uSXNzdWVkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZC5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSXNzdWVkTW9uZXRhcnkgPSB0aGlzLnRvdGFsSXNzdWVkTW9uZXRhcnkgKyBOdW1iZXIoZGF0YS5tb25ldGFyeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxJc3N1ZWRIb3RlbCArPSBOdW1iZXIoZGF0YS5ob3RlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxJc3N1ZWRNZWFsICs9IE51bWJlcihkYXRhLm1lYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSXNzdWVkVHJhbnNwb3J0ICs9IE51bWJlcihkYXRhLnRyYW5zcG9ydGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxOb3RJc3N1ZWRNb25ldGFyeSA9IHRoaXMudG90YWxOb3RJc3N1ZWRNb25ldGFyeSArIE51bWJlcihkYXRhLm1vbmV0YXJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE5vdElzc3VlZEhvdGVsICs9IE51bWJlcihkYXRhLmhvdGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE5vdElzc3VlZE1lYWwgKz0gTnVtYmVyKGRhdGEubWVhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxOb3RJc3N1ZWRUcmFuc3BvcnQgKz0gTnVtYmVyKGRhdGEudHJhbnNwb3J0YXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpc2RldGFpbHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3RJc3N1ZWRGdWxMaXN0ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkRnVsTGlzdCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZEZ1bExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZEZ1bExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRlZFBheENvdW50ID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZEZ1bExpc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcnN0dGFiLnRpdGxlID0gXCJDb21wZW5zYXRpb24gSXNzdWVkXCIgKyBcIihcIiArIHRoaXMuQ29tcGVuc2F0ZWRQYXhDb3VudCArIFwiKVwiOztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpc2RldGFpbHMucHVzaCh0aGlzLmZpcnN0dGFiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uTm90SXNzdWVkUGF4Q291bnQgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2Vjb25kdGFiLnRpdGxlID0gXCJDb21wZW5zYXRpb24gTm90IElzc3VlZFwiICsgXCIoXCIgKyB0aGlzLkNvbXBlbnNhdGlvbk5vdElzc3VlZFBheENvdW50ICsgXCIpXCI7O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGlzZGV0YWlscy5wdXNoKHRoaXMuc2Vjb25kdGFiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuX3NoYXJlZC5zZXRDb21wZW5zYXRpb25QYXhMaXN0KElzc3VlQ29tcGVuc2F0aW9uUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5uYXZpZ2F0ZXRvaXNzdWVjb21wZW5zYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBvbkZvY3VzKGFyZ3MpIHtcbiAgICAgICAgLy8gZm9jdXMgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgdXNlcnMgZW50ZXJzIHRoZSBUZXh0RmllbGRcbiAgICAgICAgY29uc29sZS5sb2coXCJvbkZvY3VzXCIpO1xuICAgICAgICBsZXQgdGV4dEZpZWxkID0gPFRleHRGaWVsZD5hcmdzLm9iamVjdDtcbiAgICB9XG4gICAgb25DaGFuZ2VGb3JBbW91bnQoYXJnczogYW55LCBpbmRleDogYW55LCBmaWVsZDogYW55LCBpdGVtOiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlY6XCIgKyBhcmdzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJSOlwiICsgaW5kZXgpO1xuICAgICAgICBpZiAodGhpcy5Jc0VkaXRhYmxlID09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuTW9uZXRyYXJ5RW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChmaWVsZCA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5Nb25ldHJhcnlFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5WYWxpZE1vbmV0YXJ5W2luZGV4XSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLk1vbmV0cmFyeUVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5Nb25ldGFyeWRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLlZhbGlkTW9uZXRhcnlbaW5kZXhdID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgvXlswLTldKyQvKTtcbiAgICAgICAgICAgIHZhciB0ZXN0ID0gcmVnLnRlc3QoZmllbGQpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJmbGlnaHRudW1cIiArIHRlc3QpO1xuICAgICAgICAgICAgaWYgKHRlc3QgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGQgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlZhbGlkTW9uZXRhcnlbaW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSXNzdWVDb21wZW5zYXRpb25XaXRoVGFiQ29tcG9uZW50Lk5VTUJFUlZBTElEQVRJT05UT0FTVCkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLk1vbmV0cmFyeUVtcHR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlZhbGlkTW9uZXRhcnlbaW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuTW9uZXRyYXJ5RW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5WYWxpZE1vbmV0YXJ5W2luZGV4XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRNb25ldGFyeSA9IGZpZWxkO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLm1vbmV0YXJ5SW5pdGlhbFZhbHVlICE9IGZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaXNNb25ldGFyeU92ZXJyaWRkZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaXNNb25ldGFyeU92ZXJyaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5Nb25ldGFyeU92ZXJyaWRlUmVhc29uID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5tb25ldGFyeVRlbXBWYWx1ZSA9IGZpZWxkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTW9uZXRhcnkgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSG90ZWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTWVhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxUcmFuc3BvcnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTW9uZXRhcnkgKz0gTnVtYmVyKGRhdGEubW9uZXRhcnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbEhvdGVsICs9IE51bWJlcihkYXRhLmhvdGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNZWFsICs9IE51bWJlcihkYXRhLm1lYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFRyYW5zcG9ydCArPSBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaWVsZCA+IGl0ZW0ubW9uZXRhcnlIaWdoZXJMaW1pdCB8fCBmaWVsZCA8IGl0ZW0ubW9uZXRhcnlMb3dlckxpbWl0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Nb25ldHJhcnlFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVmFsaWRNb25ldGFyeVtpbmRleF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5tb25ldGFyeUxvd2VyTGltaXQgPT0gMCAmJiBpdGVtLm1vbmV0YXJ5SGlnaGVyTGltaXQgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSB0aW1lci5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLm1vbmV0YXJ5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSXNzdWVDb21wZW5zYXRpb25XaXRoVGFiQ29tcG9uZW50LkNPTVBFTlNBVElPTk5BVE9BU1QpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KElzc3VlQ29tcGVuc2F0aW9uV2l0aFRhYkNvbXBvbmVudC5NVVNUQkVUT0FTVCArIGl0ZW0ubW9uZXRhcnlMb3dlckxpbWl0ICsgXCIgdG8gXCIgKyBpdGVtLm1vbmV0YXJ5SGlnaGVyTGltaXQpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVjpcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuTW9uZXRyYXJ5RW1wdHkpKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUjpcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuTW9uZXRhcnlkaXJ0eSkpO1xuICAgICAgICB9Ly8gaXRlbS5Jc1NlbGVjdGVkID0gdHJ1ZTtcblxuICAgIH1cbiAgICBvbkNoYW5nZUZvckhvdGVsKGFyZ3M6IGFueSwgaW5kZXg6IGFueSwgZmllbGQ6IGFueSwgaXRlbTogQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QpIHtcbiAgICAgICAgaWYgKHRoaXMuSXNFZGl0YWJsZSA9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmhvdGVsRW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChmaWVsZCA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ob3RlbEVtcHR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLlZhbGlkSG90ZWxbaW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaG90ZWxFbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuaG90ZWxkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5WYWxpZEhvdGVsW2luZGV4XSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoL15bMC05XSskLyk7XG4gICAgICAgICAgICB2YXIgdGVzdCA9IHJlZy50ZXN0KGZpZWxkKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmxpZ2h0bnVtXCIgKyB0ZXN0KTtcbiAgICAgICAgICAgIGlmICh0ZXN0ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSXNzdWVDb21wZW5zYXRpb25XaXRoVGFiQ29tcG9uZW50Lk5VTUJFUlZBTElEQVRJT05UT0FTVCkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlZhbGlkSG90ZWxbaW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3RlbEVtcHR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlZhbGlkSG90ZWxbaW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhvdGVsRW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5WYWxpZEhvdGVsW2luZGV4XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuU2VsY3RlZEhvdGVsID0gZmllbGQ7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaG90ZWxJbml0aWFsVmFsdWUgIT0gZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5pc0hvdGVsT3ZlcnJpZGRlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5pc0hvdGVsT3ZlcnJpZGRlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLkhvdGVsT3ZlcnJpZGVSZWFzb24gPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmhvdGVsVGVtcFZhbHVlID0gZmllbGQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNb25ldGFyeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxIb3RlbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNZWFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFRyYW5zcG9ydCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNb25ldGFyeSArPSBOdW1iZXIoZGF0YS5tb25ldGFyeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSG90ZWwgKz0gTnVtYmVyKGRhdGEuaG90ZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE1lYWwgKz0gTnVtYmVyKGRhdGEubWVhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsVHJhbnNwb3J0ICs9IE51bWJlcihkYXRhLnRyYW5zcG9ydGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZpZWxkID4gaXRlbS5ob3RlbEhpZ2hlckxpbWl0IHx8IGZpZWxkIDwgaXRlbS5ob3RlbExvd2VyTGltaXQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGQgIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhvdGVsRW1wdHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlZhbGlkSG90ZWxbaW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uaG90ZWxMb3dlckxpbWl0ID09IDAgJiYgaXRlbS5ob3RlbEhpZ2hlckxpbWl0ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gdGltZXIuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5ob3RlbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KElzc3VlQ29tcGVuc2F0aW9uV2l0aFRhYkNvbXBvbmVudC5DT01QRU5TQVRJT05OQVRPQVNUKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChJc3N1ZUNvbXBlbnNhdGlvbldpdGhUYWJDb21wb25lbnQuTVVTVEJFVE9BU1QgKyBpdGVtLmhvdGVsTG93ZXJMaW1pdCArIFwiIHRvIFwiICsgaXRlbS5ob3RlbEhpZ2hlckxpbWl0KS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgb25DaGFuZ2VGb3JNZWFsKGFyZ3M6IGFueSwgaW5kZXg6IGFueSwgZmllbGQ6IGFueSwgaXRlbTogQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QpIHtcbiAgICAgICAgaWYgKHRoaXMuSXNFZGl0YWJsZSA9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLm1lYWxFbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGZpZWxkID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1lYWxFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5WYWxpZE1lYWxbaW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubWVhbEVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5tZWFsZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuVmFsaWRNZWFsW2luZGV4XSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoL15bMC05XSskLyk7XG4gICAgICAgICAgICB2YXIgdGVzdCA9IHJlZy50ZXN0KGZpZWxkKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmxpZ2h0bnVtXCIgKyB0ZXN0KTtcbiAgICAgICAgICAgIGlmICh0ZXN0ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSXNzdWVDb21wZW5zYXRpb25XaXRoVGFiQ29tcG9uZW50Lk5VTUJFUlZBTElEQVRJT05UT0FTVCkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlZhbGlkTWVhbFtpbmRleF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lYWxFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5WYWxpZE1lYWxbaW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubWVhbEVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuVmFsaWRNZWFsW2luZGV4XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRNZWFsID0gZmllbGQ7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0ubWVhbEluaXRpYWxWYWx1ZSAhPSBmaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmlzTWVhbE92ZXJyaWRkZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaXNNZWFsT3ZlcnJpZGRlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLk1lYWxPdmVycmlkZVJlYXNvbiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ubWVhbFRlbXBWYWx1ZSA9IGZpZWxkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTW9uZXRhcnkgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSG90ZWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTWVhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxUcmFuc3BvcnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTW9uZXRhcnkgKz0gTnVtYmVyKGRhdGEubW9uZXRhcnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbEhvdGVsICs9IE51bWJlcihkYXRhLmhvdGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNZWFsICs9IE51bWJlcihkYXRhLm1lYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFRyYW5zcG9ydCArPSBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaWVsZCA+IGl0ZW0ubWVhbEhpZ2hlckxpbWl0IHx8IGZpZWxkIDwgaXRlbS5tZWFsTG93ZXJMaW1pdCkge1xuICAgICAgICAgICAgICAgIGlmIChmaWVsZCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWVhbEVtcHR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5WYWxpZE1lYWxbaW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLm1lYWxMb3dlckxpbWl0ID09IDAgJiYgaXRlbS5tZWFsSGlnaGVyTGltaXQgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSB0aW1lci5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLm1lYWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChJc3N1ZUNvbXBlbnNhdGlvbldpdGhUYWJDb21wb25lbnQuQ09NUEVOU0FUSU9OTkFUT0FTVCkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSXNzdWVDb21wZW5zYXRpb25XaXRoVGFiQ29tcG9uZW50Lk1VU1RCRVRPQVNUICsgaXRlbS5tZWFsTG93ZXJMaW1pdCArIFwiIHRvIFwiICsgaXRlbS5tZWFsSGlnaGVyTGltaXQpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBvbkNoYW5nZUZvclRyYW5zcG9ydChhcmdzOiBhbnksIGluZGV4OiBhbnksIGZpZWxkOiBhbnksIGl0ZW06IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KSB7XG4gICAgICAgIGlmICh0aGlzLklzRWRpdGFibGUgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy50cmFuc3BvcnRFbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGZpZWxkID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zcG9ydEVtcHR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLlZhbGlkdHJhbnNwb3J0W2luZGV4XSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zcG9ydEVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc3BvcnRkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5WYWxpZHRyYW5zcG9ydFtpbmRleF0gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKC9eWzAtOV0rJC8pO1xuICAgICAgICAgICAgdmFyIHRlc3QgPSByZWcudGVzdChmaWVsZCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImZsaWdodG51bVwiICsgdGVzdCk7XG4gICAgICAgICAgICBpZiAodGVzdCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGlmIChmaWVsZCAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KElzc3VlQ29tcGVuc2F0aW9uV2l0aFRhYkNvbXBvbmVudC5OVU1CRVJWQUxJREFUSU9OVE9BU1QpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5WYWxpZHRyYW5zcG9ydFtpbmRleF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zcG9ydEVtcHR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlZhbGlkdHJhbnNwb3J0W2luZGV4XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zcG9ydEVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuVmFsaWR0cmFuc3BvcnRbaW5kZXhdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFRyYW5zcG9ydCA9IGZpZWxkO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnRyYW5zcG9ydGF0aW9uSW5pdGlhbFZhbHVlICE9IGZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaXNUcmFuc3BvcnRPdmVycmlkZGVuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmlzVHJhbnNwb3J0T3ZlcnJpZGRlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLlRyYW5zcG9ydE92ZXJyaWRlUmVhc29uID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS50cmFuc3BvcnRhdGlvblRlbXBWYWx1ZSA9IGZpZWxkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTW9uZXRhcnkgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSG90ZWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTWVhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxUcmFuc3BvcnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTW9uZXRhcnkgKz0gTnVtYmVyKGRhdGEubW9uZXRhcnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbEhvdGVsICs9IE51bWJlcihkYXRhLmhvdGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNZWFsICs9IE51bWJlcihkYXRhLm1lYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFRyYW5zcG9ydCArPSBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaWVsZCA+IGl0ZW0udHJhbnNwb3J0YXRpb25IaWdoZXJMaW1pdCB8fCBmaWVsZCA8IGl0ZW0udHJhbnNwb3J0YXRpb25Mb3dlckxpbWl0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFuc3BvcnRFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSXNQYXhSZWFzb25TZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlZhbGlkdHJhbnNwb3J0W2luZGV4XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnRyYW5zcG9ydGF0aW9uTG93ZXJMaW1pdCA9PSAwICYmIGl0ZW0udHJhbnNwb3J0YXRpb25IaWdoZXJMaW1pdCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHRpbWVyLnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udHJhbnNwb3J0YXRpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChJc3N1ZUNvbXBlbnNhdGlvbldpdGhUYWJDb21wb25lbnQuQ09NUEVOU0FUSU9OTkFUT0FTVCkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSXNzdWVDb21wZW5zYXRpb25XaXRoVGFiQ29tcG9uZW50Lk1VU1RCRVRPQVNUICsgaXRlbS50cmFuc3BvcnRhdGlvbkxvd2VyTGltaXQgKyBcIiB0byBcIiArIGl0ZW0udHJhbnNwb3J0YXRpb25IaWdoZXJMaW1pdCkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIG5hdmlnYXRlVG9Db21wZW5zYXRpb24oKSB7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJjb21wZW5zYXRpb25cIl0sIHtcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGVtYWlsKGl0ZW06IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBpdGVtLklzU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGl0ZW0uSXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJPcmRlckRldGFpbHMgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLmdldEVtYWlsQnlPcmRlcklkKGl0ZW0uT3JkZXJJZClcbiAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLklEICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgQ29tcGFuc2F0aW9uRGV0YWlsczogYW55ID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5QYXNzZW5nZXJzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbCBpbiAxXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLlBhc3NlbmdlcnMuZm9yRWFjaCgocGF4RGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXhEYXRhLkZpcnN0bmFtZSA9PSBpdGVtLkdpdmVuTmFtZSAmJiBwYXhEYXRhLkxhc3RuYW1lID09IGl0ZW0uTGFzdE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIGluIDJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBheERhdGEuUHJpbWFyeVRpY2tldHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJldGt0OlwiICsgSlNPTi5zdHJpbmdpZnkocGF4RGF0YS5QcmltYXJ5VGlja2V0c1swXS5QcmltYXJ5VGlja2V0TnVtYmVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uRXRrdE51bWJyID0gcGF4RGF0YS5QcmltYXJ5VGlja2V0c1swXS5QcmltYXJ5VGlja2V0TnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF4RGF0YS5FbWFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIGluIDNcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuID0gcGF4RGF0YS5FbWFpbHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkVtYWlsSWQgPSBwYXhEYXRhLkVtYWlsc1tuIC0gMV0uVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uRW1haWwgPSBwYXhEYXRhLkVtYWlsc1tuIC0gMV0uVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRW1haWxJZFNlbGVjdGVkUGF4ID0gcGF4RGF0YS5FbWFpbHNbbiAtIDFdLlZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uRW1haWwgPSBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkVtYWlsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIiogcmVxdWlyZWQgZmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJTYXZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIkNvcHkgdG8gc2VsZWN0ZWQgcGFzc2VuZ2VyICYgU2F2ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV1dHJhbEJ1dHRvblRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VGV4dDogaXRlbS5FbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0VHlwZTogZGlhbG9ncy5pbnB1dFR5cGUudGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWFsb2dzLnByb21wdChvcHRpb25zKS50aGVuKChyZXN1bHQ6IGRpYWxvZ3MuUHJvbXB0UmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhlbGxvLCBcIiArIHJlc3VsdC50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucmVzdWx0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucmVzdWx0ID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC50ZXh0LnRyaW0oKS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWFpbChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBFTUFJTF9SRUdFWFAgPSAvXlthLXowLTkhIyQlJicqK1xcLz0/Xl9ge3x9fi4tXStAW2EtejAtOV0oW2EtejAtOS1dKlthLXowLTldKT8oXFwuW2EtejAtOV0oW2EtejAtOS1dKlthLXowLTldKT8pKiQvaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gRU1BSUxfUkVHRVhQLnRlc3QocmVzdWx0LnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5FbWFpbElkID09IHJlc3VsdC50ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uRW1haWwgPSByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbDpcIiArIEpTT04uc3RyaW5naWZ5KGl0ZW0uRW1haWwpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLkVtYWlsID0gcmVzdWx0LnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlRW1haWwoQ29tcGFuc2F0aW9uRGV0YWlscywgaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW1haWw6XCIgKyBKU09OLnN0cmluZ2lmeShpdGVtLkVtYWlsKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzc1wiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWFpbChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC50ZXh0LnRyaW0oKS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWFpbChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBFTUFJTF9SRUdFWFAgPSAvXlthLXowLTkhIyQlJicqK1xcLz0/Xl9ge3x9fi4tXStAW2EtejAtOV0oW2EtejAtOS1dKlthLXowLTldKT8oXFwuW2EtejAtOV0oW2EtejAtOS1dKlthLXowLTldKT8pKiQvaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gRU1BSUxfUkVHRVhQLnRlc3QocmVzdWx0LnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5FbWFpbElkID09IHJlc3VsdC50ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uRW1haWwgPSByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5FbWFpbElkU2VsZWN0ZWRQYXggPSByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0VtYWlsQ29weXRvU2VsZWN0UGF4VHJ1ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uRW1haWwgPSByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdC5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5FbWFpbCA9IHRoaXMuRW1haWxJZFNlbGVjdGVkUGF4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsOlwiICsgSlNPTi5zdHJpbmdpZnkoaXRlbS5FbWFpbCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFbWFpbENvcHl0b1NlbGVjdFBheFRydWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLkVtYWlsID0gcmVzdWx0LnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRW1haWxJZFNlbGVjdGVkUGF4ID0gcmVzdWx0LnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QuZm9yRWFjaCgocGF4RGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXhEYXRhLklzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkVtYWlsID0gdGhpcy5FbWFpbElkU2VsZWN0ZWRQYXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlRW1haWwoQ29tcGFuc2F0aW9uRGV0YWlscywgaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW1haWw6XCIgKyBKU09OLnN0cmluZ2lmeShpdGVtLkVtYWlsKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzc1wiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWFpbChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKENvbXBhbnNhdGlvbkRldGFpbHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJPcmRlckRldGFpbHMgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlRGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJPcmRlckRldGFpbHMgU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlRGF0ZSkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJObyBSZXNlcnZhdGlvbiBmb3VuZFwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZXJyKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvblwiICsgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHVwZGF0ZUVtYWlsKG9yZGVyUmVzcG9zbmU6IGFueSwgaXRlbTogQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgdmFyIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB2YXIgQ3VyRGF0ZSA9IG1vbWVudChzdGFydERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhDdXJEYXRlKVxuICAgICAgICAgICAgdGhpcy5GbGlnaHRIZWFkZXJJbmZvID0gdGhpcy5fc2hhcmVkLmdldEZsaWdodEhlYWRlckluZm8oKTtcbiAgICAgICAgICAgIGxldCBFbWFpbENvbXBlbnNhdGlvblN0cnVjdHVyZSA9IENvbnZlcnRlcnMuY29udmVydFRvVXBkYXRlRW1haWxJZChpdGVtLCBvcmRlclJlc3Bvc25lKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW1haWwgUmVxOlwiICsgSlNPTi5zdHJpbmdpZnkoRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmUpKTtcbiAgICAgICAgICAgIGlmIChFbWFpbENvbXBlbnNhdGlvblN0cnVjdHVyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VydmljZS51cGRhdGVFbWFpbElkKGl0ZW0uT3JkZXJJZCwgRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmUpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIFJlczpcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuQmFkUmVxdWVzdCA9PSA0MDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGRhdGEuRXJyb3JNZXNzYWdlKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkVtYWlsIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5XCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJFbWFpbCBOb3QgdXBkYXRlZFwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChlcnIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJNb25ldGFyeSBub3QgYXZpbGFibGVcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZW5kRW1haWwoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHZhciBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIEN1ckRhdGUgPSBtb21lbnQoc3RhcnREYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coQ3VyRGF0ZSlcbiAgICAgICAgICAgIHRoaXMuaXNFbWFpbE5vdEF2YWlsYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5GbGlnaHRIZWFkZXJJbmZvID0gdGhpcy5fc2hhcmVkLmdldEZsaWdodEhlYWRlckluZm8oKTtcbiAgICAgICAgICAgIHZhciBwYXhOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuRW1haWwgPT0gbnVsbCB8fCBkYXRhLkVtYWlsID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0VtYWlsTm90QXZhaWxhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcGF4TmFtZSA9IGRhdGEuRnVsbE5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNFbWFpbE5vdEF2YWlsYWJsZSkge1xuICAgICAgICAgICAgICAgIGxldCBFbWFpbENvbXBlbnNhdGlvblN0cnVjdHVyZSA9IENvbnZlcnRlcnMuY29udmVydFRvRW1haWxDb21wZW5zYXRpb24odGhpcy5TZWxlY3RlZFBhc3NlbmdlciwgdGhpcy5GbGlnaHRIZWFkZXJJbmZvKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIFJlcTpcIiArIEpTT04uc3RyaW5naWZ5KEVtYWlsQ29tcGVuc2F0aW9uU3RydWN0dXJlKSk7XG4gICAgICAgICAgICAgICAgaWYgKEVtYWlsQ29tcGVuc2F0aW9uU3RydWN0dXJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VydmljZS5Qb3N0RW1haWxDb21wZW5zYXRpb24oRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmUpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbCBSZXM6XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5TdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJFbWFpbCBTZW50IFN1Y2Nlc3NmdWxseVwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wZW5zYXRpb25MaXN0KHRoaXMuRmxpZ2h0SGVhZGVySW5mby5EZXBhcnR1cmVEYXRlLCB0aGlzLkZsaWdodEhlYWRlckluZm8uRmxpZ2h0TnVtYmVyLCB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyWzBdLk9yaWdpbiwgXCJSZWFzb25XaXNlR2V0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk1vbmV0YXJ5IG5vdCBhdmlsYWJsZVwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQocGF4TmFtZSArIFwiIDpFbWFpbCBJRCBpcyBub3QgYXZhaWxhYmxlXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRDb21wZW5zYXRpb25MaXN0KGRhdGUsIGZsaWdodCwgbG9jYXRpb24sIHBheHR5cGUpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgR2V0UGFzc2VuZ2VyVHlwZSBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBTdGFydCBEYXRlIFRpbWUgOiAnICsgc0RhdGUpO1xuICAgICAgICAgICAgdGhpcy5fc2VydmljZS5nZXRDb21wZW5zYXRpb25QYXhMaXN0KGRhdGUsIGZsaWdodCwgbG9jYXRpb24sIHBheHR5cGUpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLlJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuUmVzdWx0c1swXS5GbGlnaHRTZWdtZW50c1swXS5QYXNzZW5nZXJzID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiRGF0YSBub3QgZm91bmRcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgQ29tcGFuc2F0aW9uRGV0YWlsczogYW55ID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmxpZ2h0U3RhdHVzRm9yQ29tcGVuc2F0aW9uTGlzdChDb21wYW5zYXRpb25EZXRhaWxzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLkVycm9yc1swXS5NZXNzYWdlID09IFwiRGF0YSBub3QgZm91bmRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJObyBwYXNzZW5nZXIgZm91bmRcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvblwiICsgZXJyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJUeXBlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJUeXBlIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmxpZ2h0U3RhdHVzRm9yQ29tcGVuc2F0aW9uTGlzdChDb21wUGF4KTogdm9pZCB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBDb21wZW5zYXRpb25EZXRhaWxzIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHZhciBkYXRlID0gdGhpcy5GbGlnaHRIZWFkZXJJbmZvLkRlcGFydHVyZURhdGU7XG4gICAgICAgICAgICB2YXIgZmxpZ2h0bnVtYmVyID0gdGhpcy5GbGlnaHRIZWFkZXJJbmZvLkZsaWdodE51bWJlcjtcbiAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiU2VhcmNoTG9jYXRpb25cIiwgXCJcIik7XG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLnN0YXR1cyhkYXRlLCBmbGlnaHRudW1iZXIsIGxvY2F0aW9uKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5CYWRSZXF1ZXN0ICE9IDQwMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5GbGlnaHRzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGF0dXM6IGFueSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOMVwiICsgSlNPTi5zdHJpbmdpZnkoc3RhdHVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0Q29tcGVuc2F0aW9uRmxpZ2h0RGV0YWlscyhzdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZsaWdodFN0YXR1cyA9IENvbnZlcnRlcnMuY29udmVydFRvRmxpZ2h0SGVhZGVySW5mbyhzdGF0dXMsIEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiU2VhcmNoTG9jYXRpb25cIiwgXCJcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLnNldEZsaWdodEhlYWRlckluZm8oZmxpZ2h0U3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBDb21wYXhMaXN0ID0gQ29udmVydGVycy5jb252ZXJ0b0NvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QoQ29tcFBheCwgc3RhdHVzLCBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIlNlYXJjaExvY2F0aW9uXCIsIFwiXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBDb21wYXhGaWx0ZXJlZExpc3QgPSBuZXcgQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblJvb3RPYmplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3RJc3N1ZWQuZm9yRWFjaCgoU2VsUGF4LCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbXBheExpc3QuUGFzc2VuZ2VyTGlzdC5mb3JFYWNoKChBbGxQYXgsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTZWxQYXguT3JkZXJJZCA9PSBBbGxQYXguT3JkZXJJZCAmJiBTZWxQYXguR2l2ZW5OYW1lID09IEFsbFBheC5HaXZlbk5hbWUgJiYgU2VsUGF4Lkxhc3ROYW1lID09IEFsbFBheC5MYXN0TmFtZSAmJiBTZWxQYXguQ29tcGVuc2F0aW9uc1swXS5Db21wUmVhc29uVGV4dCA9PSBBbGxQYXguQ29tcGVuc2F0aW9uc1swXS5Db21wUmVhc29uVGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29tcGF4RmlsdGVyZWRMaXN0LkZsaWdodE1vZGVsID0gQ29tcGF4TGlzdC5GbGlnaHRNb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbXBheEZpbHRlcmVkTGlzdC5QYXNzZW5nZXJMaXN0LnB1c2goQWxsUGF4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRDb21wZW5zYXRpb25MaXN0KENvbXBheEZpbHRlcmVkTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlhZ2F0ZXRvQ29tcGVuc2F0aW9uUHJpbnRMaXN0d2l0aHRhYigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChkYXRhLldhcm5pbmdzWzBdLk1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRDb21wZW5zYXRpb25GbGlnaHREZXRhaWxzKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IENvbXBheExpc3QgPSBDb252ZXJ0ZXJzLmNvbnZlcnRvQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdChDb21wUGF4LCBkYXRhLCBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIlNlYXJjaExvY2F0aW9uXCIsIFwiXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBDb21wYXhGaWx0ZXJlZExpc3QgPSBuZXcgQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblJvb3RPYmplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3RJc3N1ZWQuZm9yRWFjaCgoU2VsUGF4LCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbXBheExpc3QuUGFzc2VuZ2VyTGlzdC5mb3JFYWNoKChBbGxQYXgsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTZWxQYXguT3JkZXJJZCA9PSBBbGxQYXguT3JkZXJJZCAmJiBTZWxQYXguR2l2ZW5OYW1lID09IEFsbFBheC5HaXZlbk5hbWUgJiYgU2VsUGF4Lkxhc3ROYW1lID09IEFsbFBheC5MYXN0TmFtZSAmJiBTZWxQYXguQ29tcGVuc2F0aW9uc1swXS5Db21wUmVhc29uVGV4dCA9PSBBbGxQYXguQ29tcGVuc2F0aW9uc1swXS5Db21wUmVhc29uVGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29tcGF4RmlsdGVyZWRMaXN0LkZsaWdodE1vZGVsID0gQ29tcGF4TGlzdC5GbGlnaHRNb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbXBheEZpbHRlcmVkTGlzdC5QYXNzZW5nZXJMaXN0LnB1c2goQWxsUGF4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRDb21wZW5zYXRpb25MaXN0KENvbXBheEZpbHRlcmVkTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlhZ2F0ZXRvQ29tcGVuc2F0aW9uUHJpbnRMaXN0d2l0aHRhYigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChkYXRhLmVyck1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5jbGVhcigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ291bGRudCBmaW5kIGluZm9ybWF0aW9uXCIgKyBlcnIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBDb21wZW5zYXRpb25EZXRhaWxzIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBDb21wZW5zYXRpb25EZXRhaWxzIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICBibHVldG9vdGhFTUQoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHZhciBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIEN1ckRhdGUgPSBtb21lbnQoc3RhcnREYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coQ3VyRGF0ZSlcbiAgICAgICAgICAgIHRoaXMuRmxpZ2h0SGVhZGVySW5mbyA9IHRoaXMuX3NoYXJlZC5nZXRGbGlnaHRIZWFkZXJJbmZvKCk7XG4gICAgICAgICAgICBsZXQgRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmU6IFByaW50TW9kdWxlLlJvb3RPYmplY3QgPSBDb252ZXJ0ZXJzLmNvbnZlcnRUb0JsdWV0b290aFByaW50RU1EQ29tcGVuc2F0aW9uKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIsIHRoaXMuRmxpZ2h0SGVhZGVySW5mbyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIFJlcTpcIiArIEpTT04uc3RyaW5naWZ5KEVtYWlsQ29tcGVuc2F0aW9uU3RydWN0dXJlKSk7XG4gICAgICAgICAgICBpZiAoRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmUuUGFzc2VuZ2VycyAhPSBbXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UucHJpbnRFTURCbHVldG9vdGhDb21wZW5zYXRpb25TZXJ2aWNlKEVtYWlsQ29tcGVuc2F0aW9uU3RydWN0dXJlKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbCBSZXM6XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlJhd0RhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuUmF3RGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbWFnZSA9IGltYWdlTW9kdWxlLmZyb21CYXNlNjQoZGF0YS5SYXdEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZm9sZGVyID0gZnMua25vd25Gb2xkZXJzLmRvY3VtZW50cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWxlbmFtZTogc3RyaW5nID0gbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdChcImhobW1zc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGF0aCA9IGZzLnBhdGguam9pbihmb2xkZXIucGF0aCwgXCJ0ZW1wQlBJbWFnZVwiICsgZmlsZW5hbWUgKyBcIi5qcGdcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2Uuc2F2ZVRvRmlsZShwYXRoLCBcImpwZWdcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcmludGVySUQgPSB0aGlzLmdldFByaW50ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByaW50ZXJJRC50cmltKCkgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHplYnJhLlByaW50ZXIoeyBhZGRyZXNzOiBwcmludGVySUQsIGxhbmd1YWdlOiBcIkNQQ0xcIiwgZGVidWdnaW5nOiBmYWxzZSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChjdXJQcmludGVyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRvY3VtZW50ID0gY3VyUHJpbnRlci5jcmVhdGVEb2N1bWVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5pbWFnZShmcy5wYXRoLmpvaW4oZm9sZGVyLnBhdGgsIFwidGVtcEJQSW1hZ2VcIiArIGZpbGVuYW1lICsgXCIuanBnXCIpLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyUHJpbnRlci5nZXRTdGF0dXMoKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnJlYWR5ICYmICFyZXN1bHQubGF0Y2hPcGVuICYmICFyZXN1bHQubG93QmF0dGVyeSAmJiAhcmVzdWx0LnBhcGVyT3V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wcmludGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1clByaW50ZXIucHJpbnQoZG9jdW1lbnQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByaW50aW5nIERvbmVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWxlID0gZm9sZGVyLmdldEZpbGUoXCJ0ZW1wQlBJbWFnZVwiICsgZmlsZW5hbWUgKyBcIi5qcGdcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUucmVtb3ZlKCkudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZpbGUgcmVtb3ZlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkJsdWV0b290aCBwcmludGVkIHN1Y2Vzc2Z1bGx5XCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IFNhdmVDb21wdGVtcGxhdGUgPSBDb252ZXJ0ZXJzLmNvbnZlcnRUb1NhdmVDb21wZW5zYXRpb25UZW1wbGF0ZUZvclByaW50KHNlbGYuU2VsZWN0ZWRQYXNzZW5nZXIsIHNlbGYuRmxpZ2h0SGVhZGVySW5mbyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZVwiICsgSlNPTi5zdHJpbmdpZnkoU2F2ZUNvbXB0ZW1wbGF0ZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9zZXJ2aWNlLnNhdmVCbHVldG9vdGhQcmludChTYXZlQ29tcHRlbXBsYXRlKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2V0Q29tcGVuc2F0aW9uTGlzdChzZWxmLkZsaWdodEhlYWRlckluZm8uRGVwYXJ0dXJlRGF0ZSwgc2VsZi5GbGlnaHRIZWFkZXJJbmZvLkZsaWdodE51bWJlciwgc2VsZi5TZWxlY3RlZFBhc3NlbmdlclswXS5PcmlnaW4sIFwiUmVhc29uV2lzZUdldFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW1haWwgUmVzOlwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyUHJpbnRlci5jbG9zZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJQcmludGVyIGlzIHJlYWR5IHRvIHByaW50XCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkVycm9yIE9jY3VyZWQgd2hpbGUgUHJpbnRpbmc6XCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJQcmludGVyLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKHN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzZWxmLl9zZXJ2aWNlLnNhdmVCbHVldG9vdGhQcmludChzZWxmLlNhdmVDb21wdGVtcGxhdGUpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgc2VsZi5nZXRDb21wZW5zYXRpb25MaXN0KHRoaXMuRmxpZ2h0SGVhZGVySW5mby5EZXBhcnR1cmVEYXRlLCB0aGlzLkZsaWdodEhlYWRlckluZm8uRmxpZ2h0TnVtYmVyLCB0aGlzLkZsaWdodEhlYWRlckluZm8uRGVwYXJ0dXJlQWlycG9ydCwgXCJSZWFzb25XaXNlR2V0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJFbWFpbCBSZXM6XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChJc3N1ZUNvbXBlbnNhdGlvbldpdGhUYWJDb21wb25lbnQuVU5BQkxFVE9QUklOVCkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5sYXRjaE9wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCIhISEhTGF0Y2hPcGVuXCIpLnNob3coKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmxvd0JhdHRlcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCIhISEhTG93QmF0dGVyeVwiKS5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5wYXBlck91dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIiEhISFQYXBlck91dFwiKS5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChJc3N1ZUNvbXBlbnNhdGlvbldpdGhUYWJDb21wb25lbnQuUFJJTlRFUlNFU1NJT04pLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChJc3N1ZUNvbXBlbnNhdGlvbldpdGhUYWJDb21wb25lbnQuTk9CTFVFVE9PVEhERVZJQ0UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChJc3N1ZUNvbXBlbnNhdGlvbldpdGhUYWJDb21wb25lbnQuVU5BQkxFVE9QUklOVCkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KElzc3VlQ29tcGVuc2F0aW9uV2l0aFRhYkNvbXBvbmVudC5VTkFCTEVUT1BSSU5UKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmdldENvbXBlbnNhdGlvbkxpc3QodGhpcy5GbGlnaHRIZWFkZXJJbmZvLkRlcGFydHVyZURhdGUsdGhpcy5GbGlnaHRIZWFkZXJJbmZvLkZsaWdodE51bWJlcix0aGlzLkZsaWdodEhlYWRlckluZm8uRGVwYXJ0dXJlQWlycG9ydCxcIlJlYXNvbldpc2VHZXRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUb2FzdC5tYWtlVGV4dChkYXRhLkVycm9yc1swXS5NZXNzYWdlKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGRhdGEuRXJyb3JzWzBdLk1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJObyBFTUQgYXZpbGFibGUgZm9yIHByaW50XCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0UHJpbnRlcigpOiBzdHJpbmcge1xuICAgICAgICBpZiAoQXBwbGljYXRpb25TZXR0aW5ncy5oYXNLZXkoXCJwcmludGVyXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJwcmludGVyXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpbnRFTUQoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHZhciBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIEN1ckRhdGUgPSBtb21lbnQoc3RhcnREYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coQ3VyRGF0ZSlcbiAgICAgICAgICAgIHZhciBEZXZpY2VOYW1lID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJib2FyZGluZ1Bhc3NEZXZpY2VOYW1lXCIsIFwiXCIpO1xuICAgICAgICAgICAgaWYgKERldmljZU5hbWUgPT0gXCJcIikge1xuICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiUGxlYXNlIHNldCBwcmludGVyIGluIHNldHRpbmdcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkZsaWdodEhlYWRlckluZm8gPSB0aGlzLl9zaGFyZWQuZ2V0RmxpZ2h0SGVhZGVySW5mbygpO1xuICAgICAgICAgICAgICAgIGxldCBFbWFpbENvbXBlbnNhdGlvblN0cnVjdHVyZTogUHJpbnRNb2R1bGUuUm9vdE9iamVjdCA9IENvbnZlcnRlcnMuY29udmVydFRvUHJpbnRFTURDb21wZW5zYXRpb24odGhpcy5TZWxlY3RlZFBhc3NlbmdlciwgdGhpcy5GbGlnaHRIZWFkZXJJbmZvKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIFJlcTpcIiArIEpTT04uc3RyaW5naWZ5KEVtYWlsQ29tcGVuc2F0aW9uU3RydWN0dXJlKSk7XG4gICAgICAgICAgICAgICAgaWYgKEVtYWlsQ29tcGVuc2F0aW9uU3RydWN0dXJlLlBhc3NlbmdlcnMgIT0gW10pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VydmljZS5wcmludEVNRENvbXBlbnNhdGlvblNlcnZpY2UoRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmUpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbCBSZXM6XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5TdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJQcmludGVkIHN1Y2Nlc3NmdWxseVwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wZW5zYXRpb25MaXN0KHRoaXMuRmxpZ2h0SGVhZGVySW5mby5EZXBhcnR1cmVEYXRlLCB0aGlzLkZsaWdodEhlYWRlckluZm8uRmxpZ2h0TnVtYmVyLCB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyWzBdLk9yaWdpbiwgXCJSZWFzb25XaXNlR2V0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRvYXN0Lm1ha2VUZXh0KGRhdGEuRXJyb3JzWzBdLk1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiTm8gRU1EIGF2aWxhYmxlIGZvciBwcmludFwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgb3ZlcmlkZXJlYXNvbmZvcm1vbmV0YXJ5KGl0ZW06IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0LCBuOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNCdXR0b25FbmFibGVkID09IHRydWUgJiYgaXRlbS5pc01vbmV0YXJ5T3ZlcnJpZGRlbiA9PSB0cnVlKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJPdGhlciBEZXRhaWxzXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCIqIHJlcXVpcmVkIGZpZWxkXCIsXG4gICAgICAgICAgICAgICAgZGVmYXVsdFRleHQ6IGl0ZW0uTW9uZXRhcnlPdmVycmlkZVJlYXNvbixcbiAgICAgICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiQ29weSB0byBzZWxlY3RlZCBwYXNzZW5nZXIgJiBTYXZlXCIsXG4gICAgICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJTYXZlXCIsXG4gICAgICAgICAgICAgICAgbmV1dHJhbEJ1dHRvblRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICAgICAgaW5wdXRUeXBlOiBkaWFsb2dzLmlucHV0VHlwZS50ZXh0XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGlhbG9ncy5wcm9tcHQob3B0aW9ucykudGhlbigocmVzdWx0OiBkaWFsb2dzLlByb21wdFJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucmVzdWx0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnRleHQudHJpbSgpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm92ZXJpZGVyZWFzb25mb3Jtb25ldGFyeShpdGVtLCBuKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSGVsbG8sIFwiICsgcmVzdWx0LnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhlbGxvLCBcIiArIHJlc3VsdC50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uT3ZlcnJpZGVSZWFzb24gPSByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuT3ZlclJpZGVSZWFzb24gPSByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucmVzdWx0ID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEubW9uZXRhcnkgPSB0aGlzLlNlbGVjdGVkTW9uZXRhcnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuTW9uZXRhcnlPdmVycmlkZVJlYXNvbiA9IHRoaXMuT3ZlclJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEubW9uZXRhcnlUZW1wVmFsdWUgPSB0aGlzLlNlbGVjdGVkTW9uZXRhcnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ubW9uZXRhcnlUZW1wVmFsdWUgPSB0aGlzLlNlbGVjdGVkTW9uZXRhcnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5Nb25ldGFyeU92ZXJyaWRlUmVhc29uID0gdGhpcy5PdmVyUmlkZVJlYXNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTW9uZXRhcnkgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSG90ZWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTWVhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxUcmFuc3BvcnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTW9uZXRhcnkgKz0gTnVtYmVyKGRhdGEubW9uZXRhcnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbEhvdGVsICs9IE51bWJlcihkYXRhLmhvdGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNZWFsICs9IE51bWJlcihkYXRhLm1lYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFRyYW5zcG9ydCArPSBOdW1iZXIoZGF0YS50cmFuc3BvcnRhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ubW9uZXRhcnkgPSBpdGVtLm1vbmV0YXJ5VGVtcFZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIG92ZXJpZGVyZWFzb25mb3Job3RlbChpdGVtOiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCwgbjogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQnV0dG9uRW5hYmxlZCA9PSB0cnVlICYmIGl0ZW0uaXNIb3RlbE92ZXJyaWRkZW4gPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiT3RoZXIgRGV0YWlsc1wiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiKiByZXF1aXJlZCBmaWVsZFwiLFxuICAgICAgICAgICAgICAgIGRlZmF1bHRUZXh0OiBpdGVtLkhvdGVsT3ZlcnJpZGVSZWFzb24sXG4gICAgICAgICAgICAgICAgb2tCdXR0b25UZXh0OiBcIkNvcHkgdG8gc2VsZWN0ZWQgcGFzc2VuZ2VyICYgU2F2ZVwiLFxuICAgICAgICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IFwiU2F2ZVwiLFxuICAgICAgICAgICAgICAgIG5ldXRyYWxCdXR0b25UZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgICAgIGlucHV0VHlwZTogZGlhbG9ncy5pbnB1dFR5cGUudGV4dFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRpYWxvZ3MucHJvbXB0KG9wdGlvbnMpLnRoZW4oKHJlc3VsdDogZGlhbG9ncy5Qcm9tcHRSZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnJlc3VsdCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC50ZXh0LnRyaW0oKS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdmVyaWRlcmVhc29uZm9yaG90ZWwoaXRlbSwgbik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhlbGxvLCBcIiArIHJlc3VsdC5yZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJIZWxsbywgXCIgKyByZXN1bHQudGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLk92ZXJyaWRlUmVhc29uID0gcmVzdWx0LnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLk92ZXJSaWRlUmVhc29uID0gcmVzdWx0LnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnJlc3VsdCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmhvdGVsID0gdGhpcy5TZWxjdGVkSG90ZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuSG90ZWxPdmVycmlkZVJlYXNvbiA9IHRoaXMuT3ZlclJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuaG90ZWxUZW1wVmFsdWUgPSB0aGlzLlNlbGN0ZWRIb3RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5Ib3RlbE92ZXJyaWRlUmVhc29uID0gdGhpcy5PdmVyUmlkZVJlYXNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmhvdGVsVGVtcFZhbHVlID0gdGhpcy5TZWxjdGVkSG90ZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE1vbmV0YXJ5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbEhvdGVsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE1lYWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsVHJhbnNwb3J0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZC5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE1vbmV0YXJ5ICs9IE51bWJlcihkYXRhLm1vbmV0YXJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxIb3RlbCArPSBOdW1iZXIoZGF0YS5ob3RlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTWVhbCArPSBOdW1iZXIoZGF0YS5tZWFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxUcmFuc3BvcnQgKz0gTnVtYmVyKGRhdGEudHJhbnNwb3J0YXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmhvdGVsID0gaXRlbS5ob3RlbFRlbXBWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBvdmVyaWRlcmVhc29uZm9ybWVhbChpdGVtOiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCwgbjogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQnV0dG9uRW5hYmxlZCA9PSB0cnVlICYmIGl0ZW0uaXNNZWFsT3ZlcnJpZGRlbiA9PSB0cnVlKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJPdGhlciBEZXRhaWxzXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCIqIHJlcXVpcmVkIGZpZWxkXCIsXG4gICAgICAgICAgICAgICAgZGVmYXVsdFRleHQ6IGl0ZW0uTWVhbE92ZXJyaWRlUmVhc29uLFxuICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJDb3B5IHRvIHNlbGVjdGVkIHBhc3NlbmdlciAmIFNhdmVcIixcbiAgICAgICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIlNhdmVcIixcbiAgICAgICAgICAgICAgICBuZXV0cmFsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgICAgICBpbnB1dFR5cGU6IGRpYWxvZ3MuaW5wdXRUeXBlLnRleHRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkaWFsb2dzLnByb21wdChvcHRpb25zKS50aGVuKChyZXN1bHQ6IGRpYWxvZ3MuUHJvbXB0UmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5yZXN1bHQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQudGV4dC50cmltKCkubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3ZlcmlkZXJlYXNvbmZvcm1lYWwoaXRlbSwgbik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhlbGxvLCBcIiArIHJlc3VsdC5yZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJIZWxsbywgXCIgKyByZXN1bHQudGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLk92ZXJyaWRlUmVhc29uID0gcmVzdWx0LnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLk92ZXJSaWRlUmVhc29uID0gcmVzdWx0LnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnJlc3VsdCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLm1lYWwgPSB0aGlzLlNlbGVjdGVkTWVhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5tZWFsVGVtcFZhbHVlID0gdGhpcy5TZWxlY3RlZE1lYWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuTWVhbE92ZXJyaWRlUmVhc29uID0gdGhpcy5PdmVyUmlkZVJlYXNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5tZWFsVGVtcFZhbHVlID0gdGhpcy5TZWxlY3RlZE1lYWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5NZWFsT3ZlcnJpZGVSZWFzb24gPSB0aGlzLk92ZXJSaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNb25ldGFyeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxIb3RlbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNZWFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFRyYW5zcG9ydCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxNb25ldGFyeSArPSBOdW1iZXIoZGF0YS5tb25ldGFyeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSG90ZWwgKz0gTnVtYmVyKGRhdGEuaG90ZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE1lYWwgKz0gTnVtYmVyKGRhdGEubWVhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsVHJhbnNwb3J0ICs9IE51bWJlcihkYXRhLnRyYW5zcG9ydGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5tZWFsID0gaXRlbS5tZWFsVGVtcFZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIG92ZXJpZGVyZWFzb25mb3J0cmFuc3BvcnQoaXRlbTogQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QsIG46IG51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5pc0J1dHRvbkVuYWJsZWQgPT0gdHJ1ZSAmJiBpdGVtLmlzVHJhbnNwb3J0T3ZlcnJpZGRlbiA9PSB0cnVlKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJPdGhlciBEZXRhaWxzXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCIqIHJlcXVpcmVkIGZpZWxkXCIsXG4gICAgICAgICAgICAgICAgZGVmYXVsdFRleHQ6IGl0ZW0uVHJhbnNwb3J0T3ZlcnJpZGVSZWFzb24sXG4gICAgICAgICAgICAgICAgb2tCdXR0b25UZXh0OiBcIkNvcHkgdG8gc2VsZWN0ZWQgcGFzc2VuZ2VyICYgU2F2ZVwiLFxuICAgICAgICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IFwiU2F2ZVwiLFxuICAgICAgICAgICAgICAgIG5ldXRyYWxCdXR0b25UZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgICAgIGlucHV0VHlwZTogZGlhbG9ncy5pbnB1dFR5cGUudGV4dFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRpYWxvZ3MucHJvbXB0KG9wdGlvbnMpLnRoZW4oKHJlc3VsdDogZGlhbG9ncy5Qcm9tcHRSZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnJlc3VsdCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC50ZXh0LnRyaW0oKS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdmVyaWRlcmVhc29uZm9ydHJhbnNwb3J0KGl0ZW0sIG4pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJIZWxsbywgXCIgKyByZXN1bHQucmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSGVsbG8sIFwiICsgcmVzdWx0LnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5PdmVycmlkZVJlYXNvbiA9IHJlc3VsdC50ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5PdmVyUmlkZVJlYXNvbiA9IHJlc3VsdC50ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5yZXN1bHQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS50cmFuc3BvcnRhdGlvbiA9IHRoaXMuU2VsZWN0ZWRUcmFuc3BvcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuVHJhbnNwb3J0T3ZlcnJpZGVSZWFzb24gPSB0aGlzLk92ZXJSaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnRyYW5zcG9ydGF0aW9uVGVtcFZhbHVlID0gdGhpcy5TZWxlY3RlZFRyYW5zcG9ydDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS50cmFuc3BvcnRhdGlvblRlbXBWYWx1ZSA9IHRoaXMuU2VsZWN0ZWRUcmFuc3BvcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5UcmFuc3BvcnRPdmVycmlkZVJlYXNvbiA9IHRoaXMuT3ZlclJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE1vbmV0YXJ5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbEhvdGVsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE1lYWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsVHJhbnNwb3J0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZC5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE1vbmV0YXJ5ICs9IE51bWJlcihkYXRhLm1vbmV0YXJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxIb3RlbCArPSBOdW1iZXIoZGF0YS5ob3RlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTWVhbCArPSBOdW1iZXIoZGF0YS5tZWFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxUcmFuc3BvcnQgKz0gTnVtYmVyKGRhdGEudHJhbnNwb3J0YXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnRyYW5zcG9ydGF0aW9uID0gaXRlbS50cmFuc3BvcnRhdGlvblRlbXBWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgfVxuICAgIG5hdmlnYXRldG9hZGRpdGlvbmFsZGV0YWlscyhQYXhpdGVtOiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZcIiArIFBheGl0ZW0pO1xuICAgICAgICBpZiAoKHRoaXMuSXNFZGl0YWJsZSAmJiBQYXhpdGVtLklzU2VsZWN0ZWQpIHx8ICh0aGlzLkNvbXBlbnNhdGlvbklzc3VlZExpc3QgJiYgUGF4aXRlbS5Jc1NlbGVjdGVkKSkge1xuICAgICAgICAgICAgdmFyIHByZVBhZ2U6IHN0cmluZyA9IFwiSXNzdWVDb21wZW5zYXRpb25UYWJcIjtcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJjb21wZW5zYXRpb25hZGRpdGlvbmFsZGV0YWlsc1wiXSwge1xuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgICAgIH0sIHF1ZXJ5UGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiBKU09OLnN0cmluZ2lmeShQYXhpdGVtKSxcbiAgICAgICAgICAgICAgICAgICAgXCJwcmVwYWdlXCI6IHByZVBhZ2UsXG4gICAgICAgICAgICAgICAgICAgIFwic2VsZWN0ZWRQQXhcIjogSlNPTi5zdHJpbmdpZnkodGhpcy5TZWxlY3RlZFBhc3NlbmdlciksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbiAgICBuYXZpZ2F0ZVRvU2V0dGluZygpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcInNldHRpbmdcIl0sIHtcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBuYXZpZ2F0ZVRvU2VhcmNoKCkge1xuICAgICAgICBpZiAodGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wic2VhcmNoXCJdLCB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbmF2aWdhdGVUb0RlcGFydHVyZXMoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzR2F0ZURpc2FibGVkID09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJkZXBhcnRob21lXCJdLCB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbmF2aWFnYXRldG9Db21wZW5zYXRpb25QcmludExpc3R3aXRodGFiKCkge1xuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY29tcGVuc2F0aW9ucHJpbnRzY3JlZW5cIl0sIHtcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICB9LCBxdWVyeVBhcmFtczoge1xuICAgICAgICAgICAgICAgIFwicHJlcGFnZVwiOiBcImlzc3VlQ29tcGVuc2F0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJzZWxlY3RlZFBBeFwiOiBKU09OLnN0cmluZ2lmeSh0aGlzLkNvbXBQYXhMaXN0SXNzdWVkKSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRpc3BsYXlTU1JzKGl0ZW06IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KSB7XG4gICAgICAgIGlmIChpdGVtLlNTUnNDb3VudCA+IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUlwiICsgSlNPTi5zdHJpbmdpZnkoaXRlbS5TU1JzKSk7XG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJTU1JzXCIsXG4gICAgICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgICAgICBhY3Rpb25zOiBpdGVtLlNTUnMsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcjogYW55KSB7XG4gICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci50b1N0cmluZygpO1xuICAgICAgICBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJTZXNzaW9uVGltZW91dFwiKSA+IC0xKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJTZXNzaW9uIFRpbWUgT3V0XCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGJlZW4gdGltZSBvdXRcIixcbiAgICAgICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIlwiXSwge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChlcnJvck1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==