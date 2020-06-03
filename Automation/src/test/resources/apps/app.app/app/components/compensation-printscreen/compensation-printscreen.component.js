"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var page_1 = require("ui/page");
var dialogs = require("ui/dialogs");
var segmented_bar_1 = require("ui/segmented-bar");
var imageModule = require("image-source");
var fs = require("file-system");
//external modules and plugins
var ApplicationSettings = require("application-settings");
var moment = require("moment");
var Toast = require("nativescript-toast");
var zebra = require("nativescript-print-zebra");
//app references
var index_1 = require("../../shared/interface/index");
var index_2 = require("../../shared/services/index");
var index_3 = require("../../shared/model/index");
var index_4 = require("../../shared/utils/index");
var app_constants_1 = require("../../app.constants");
var app_executiontime_1 = require("../../app.executiontime");
var timeOut_service_1 = require("../../shared/services/timeOut.service");
var CompensationPrintScreenComponent = /** @class */ (function () {
    function CompensationPrintScreenComponent(_configuration, _services, activatedRouter, _shared, page, routerExtensions, _timeoutService, router, _dataService, _service, route, vcRef, _modalService) {
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
        this.vcRef = vcRef;
        this._modalService = _modalService;
        this.firsttab = new segmented_bar_1.SegmentedBarItem();
        this.secondtab = new segmented_bar_1.SegmentedBarItem();
        this.SearchFields = new index_3.Search();
        this.CompensationReason = [];
        this.SelectAllPax = false;
        this.SelectAllPaxVar = false;
        this.checkedCount = 0;
        this.EmailId = "";
        this.EmailIdSelectedPax = "";
        this.isEmailCopytoSelectPaxTrue = false;
        this.PreviousPage = "";
        this.totalIssuedMonetary = 0;
        this.totalIssuedHotel = 0;
        this.totalIssuedMeal = 0;
        this.totalIssuedTransport = 0;
        this.totalNotIssuedMonetary = 0;
        this.totalNotIssuedHotel = 0;
        this.totalNotIssuedMeal = 0;
        this.totalNotIssuedTransport = 0;
        this.nameSortIndicator = -1;
        this.ssrSortIndicator = -1;
        this.TotalPassengerCount = 0;
        this.selectedPassengerCount = 0;
        this.isEmailEnabled = false;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.SearchCriteria = "Name";
        this.tierSortIndicator = -1;
        this.CompensationIssuedList = true;
        this.CompensationNotIssuedList = false;
        this.isEmailNotAvailable = false;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.selectedPassenger = [];
        this.SelectedPassenger = [];
        this.ComPaxPrintFullList = [];
        this.ComPaxNotPrintFullList = [];
        this.FlightHeaderInfo = new index_1.CompensationSearchModule.FlightModel();
        this.PaxList = new index_1.CompensationSearchModule.CompensationRootObject();
        this.CompPaxList = [];
        this.CompPaxListIssued = [];
        this.CompPaxListNotIssued = [];
        this.isError = false;
        this.errorMessage = "";
        this.SearchFields.FlightDate = moment().format("DD MMMM YYYY");
        this.CurDate = moment().toDate();
        this.startDate = new Date();
        this.apisdetails = [];
        this.firsttab.title = "EMD Printed";
        this.apisdetails.push(this.firsttab);
        this.secondtab.title = "EMD Available for Print";
        this.apisdetails.push(this.secondtab);
        this.loaderProgress = new index_1.LoaderProgress();
    }
    CompensationPrintScreenComponent_1 = CompensationPrintScreenComponent;
    CompensationPrintScreenComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.ComensationReason = "Select Reason";
        this.loaderProgress.initLoader(this.pageCont);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.PaxList = this._shared.getCompensationList();
        this.CompPaxList = this.PaxList.PassengerList.filter(function (m) { return m.IsCompensationIssued == true; });
        // this.CompPaxList = this.PaxList.PassengerList;
        this._shared.setCompensationPaxList(this.CompPaxList);
        this._shared.setFlightHeaderInfo(this.PaxList.FlightModel);
        console.log("Pax List:" + JSON.stringify(this.CompPaxList));
        this.FlightHeaderInfo = this.PaxList.FlightModel;
        this.activatedRouter.queryParams.subscribe(function (params) {
            if (params["selectedPAx"] != null &&
                params["selectedPAx"] != "" &&
                params["selectedPAx"] != "undefined") {
                _this.selectedPassenger = JSON.parse(params["selectedPAx"]);
            }
        });
        this.activatedRouter.queryParams.subscribe(function (params) {
            if (params["prepage"] != null &&
                params["prepage"] != "" &&
                params["prepage"] != "undefined") {
                _this.PreviousPage = params["prepage"];
            }
        });
        console.dir(this.selectedPassenger);
        console.log("V:" + JSON.stringify(this.PreviousPage));
        this.CompPaxList.forEach(function (compData, Index) {
            compData.Compensations.forEach(function (exiEMD, exiIndex) {
                if (compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds) {
                    compData.monetarycount = compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds.length;
                }
                else {
                    compData.monetarycount = 0;
                }
                if (exiEMD.Emds) {
                    exiEMD.Emds.forEach(function (emdData, emdIndex) {
                        // if (exiEMD.CompTypeText != "Monetary") {
                        if (emdData.PrintStatus == "n") {
                            compData.isNotPrinted = true;
                        }
                        if (emdData.EmailStatus == "y") {
                            compData.isEmailSent = true;
                        }
                        // }
                    });
                }
            });
            if (compData.isNotPrinted == true) {
                compData.Compensations.forEach(function (exiEMD, exiIndex) {
                    if (exiEMD.Emds) {
                        exiEMD.Emds.forEach(function (emdData, emdIndex) {
                            if (emdData.PrintStatus == "y") {
                                compData.isParitallyPrinted = true;
                            }
                        });
                    }
                    if (exiEMD.CompTypeText == "Monetary") {
                        if (exiEMD.Emds) {
                            exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                if (emdData.PrintStatus == "y" && exiEMD.Emds.filter(function (m) { return m.PrintStatus == "y"; }).length < exiEMD.Emds.length) {
                                    console.log(exiEMD.Emds.length);
                                    console.log(exiEMD.Emds.filter(function (m) { return m.PrintStatus == "y"; }).length);
                                    compData.isParitallyPrinted = true;
                                    compData.monetaryPrintStatus = true;
                                    compData.isMonetaryParitallyPrinted = true;
                                    compData.monetarycount = compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds.length;
                                }
                            });
                        }
                    }
                });
                if (compData.isParitallyPrinted == true) {
                    console.log("isParitallyPrinted Printed" + compData.FullName);
                    var paxData_1 = new index_1.CompensationSearchModule.CompensationPassengerList();
                    paxData_1.FlightSegmentId = compData.FlightSegmentId;
                    paxData_1.PassengerSeq = compData.PassengerSeq;
                    paxData_1.OrderId = compData.OrderId;
                    paxData_1.GivenName = compData.GivenName;
                    paxData_1.LastName = compData.LastName;
                    paxData_1.FullName = compData.LastName + "/" + compData.GivenName;
                    paxData_1.PaxType = compData.PaxType;
                    paxData_1.FqtvCc = compData.FqtvCc;
                    paxData_1.FqtvNumber = compData.FqtvNumber;
                    paxData_1.PaxStatus = compData.PaxStatus;
                    paxData_1.PaxEmailAddress = compData.PaxEmailAddress;
                    paxData_1.CompensationReasonId = compData.CompensationReasonId;
                    paxData_1.IsExistingCompensation = compData.IsExistingCompensation;
                    paxData_1.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                    paxData_1.WorldTracerNum = compData.WorldTracerNum;
                    paxData_1.UpdateLockNbr = compData.UpdateLockNbr;
                    paxData_1.FqtvTier = compData.FqtvTier;
                    paxData_1.Cabin = compData.Cabin;
                    paxData_1.PaxRPH = compData.PaxRPH;
                    paxData_1.Origin = compData.Origin;
                    paxData_1.Dest = compData.Dest;
                    paxData_1.IsCompensationIssued = compData.IsCompensationIssued;
                    paxData_1.SSR = compData.SSR;
                    paxData_1.Etkt = compData.Etkt;
                    paxData_1.ReaccomDetails = compData.ReaccomDetails;
                    paxData_1.AdditionalDetails = compData.AdditionalDetails;
                    paxData_1.monetary = compData.monetary;
                    paxData_1.monetaryPrintStatus = compData.monetaryPrintStatus;
                    paxData_1.Compensations = compData.Compensations;
                    paxData_1.ExistingCompensations = compData.ExistingCompensations;
                    paxData_1.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                    paxData_1.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                    paxData_1.mealendorsementTextItems = compData.mealendorsementTextItems;
                    paxData_1.mealFreeText = compData.mealFreeText;
                    paxData_1.mealDetails = compData.mealDetails;
                    paxData_1.MealOverrideReason = compData.MealOverrideReason;
                    paxData_1.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                    paxData_1.hotelFreeText = compData.hotelFreeText;
                    paxData_1.HotelOverrideReason = compData.HotelOverrideReason;
                    paxData_1.hotelDetails = compData.hotelDetails;
                    paxData_1.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                    paxData_1.transportFreeText = compData.transportFreeText;
                    paxData_1.transportEMD = compData.transportEMD;
                    paxData_1.TransportOverrideReason = compData.TransportOverrideReason;
                    paxData_1.monetaryEmailStatus = compData.monetaryEmailStatus;
                    paxData_1.Email = compData.Email;
                    paxData_1.isEmailSent = compData.isEmailSent;
                    paxData_1.isEmailParitallySent = compData.isEmailParitallySent;
                    console.log("New Inside:" + compData.isParitallyPrinted);
                    paxData_1.monetaryPrintStatus = compData.monetaryPrintStatus;
                    paxData_1.isParitallyPrinted = compData.isParitallyPrinted;
                    paxData_1.isMonetaryParitallyPrinted = compData.isMonetaryParitallyPrinted;
                    paxData_1.isMealParitallyPrinted = compData.isMealParitallyPrinted;
                    paxData_1.isHotelsParitallyPrinted = compData.isHotelsParitallyPrinted;
                    paxData_1.isTransportParitallyPrinted = compData.isTransportParitallyPrinted;
                    paxData_1.monetarycount = compData.monetarycount;
                    // if(compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds){
                    //     paxData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                    // }
                    compData.Compensations.forEach(function (newcompData, Index) {
                        if (newcompData.Emds) {
                            if (newcompData.CompTypeText == "Hotel") {
                                paxData_1.hotel = newcompData.Emds.filter(function (m) { return m.PrintStatus == "y"; }).length;
                                if (paxData_1.hotel > 0) {
                                    paxData_1.hotelPrintStatus = true;
                                }
                            }
                            if (newcompData.CompTypeText == "Meal") {
                                paxData_1.meal = newcompData.Emds.filter(function (m) { return m.PrintStatus == "y"; }).length;
                                if (paxData_1.meal > 0) {
                                    paxData_1.mealPrintStatus = true;
                                }
                            }
                            // paxData.mealPrintStatus = false;
                            if (newcompData.CompTypeText == "Transportation") {
                                paxData_1.transportation = newcompData.Emds.filter(function (m) { return m.PrintStatus == "y"; }).length;
                                if (paxData_1.transportation > 0) {
                                    paxData_1.transportPrintStatus = true;
                                }
                            }
                        }
                    });
                    if (compData.isEmailSent == true) {
                        compData.Compensations.forEach(function (exiEMD, exiIndex) {
                            if (exiEMD.Emds) {
                                exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                    if (emdData.EmailStatus == "n") {
                                        paxData_1.isEmailSent = true;
                                        paxData_1.monetaryEmailStatus = true;
                                        paxData_1.isEmailParitallySent = true;
                                    }
                                });
                            }
                        });
                    }
                    _this.CompPaxList.push(paxData_1);
                    _this.CompPaxListIssued.push(paxData_1);
                    paxData_1.monetaryPrintStatus = compData.monetaryPrintStatus;
                    compData.Compensations.forEach(function (newcompData, Index) {
                        if (newcompData.Emds) {
                            if (newcompData.CompTypeText == "Hotel") {
                                compData.hotel = newcompData.Emds.filter(function (m) { return m.PrintStatus == "n"; }).length;
                                compData.hotelPrintStatus = false;
                            }
                            if (newcompData.CompTypeText == "Meal") {
                                compData.meal = newcompData.Emds.filter(function (m) { return m.PrintStatus == "n"; }).length;
                                compData.mealPrintStatus = false;
                            }
                            if (newcompData.CompTypeText == "Transportation") {
                                compData.transportation = newcompData.Emds.filter(function (m) { return m.PrintStatus == "n"; }).length;
                                compData.transportPrintStatus = false;
                            }
                        }
                    });
                    if (compData.isEmailSent == true) {
                        compData.Compensations.forEach(function (exiEMD, exiIndex) {
                            if (exiEMD.Emds) {
                                exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                    if (emdData.EmailStatus == "n") {
                                        compData.isEmailSent = true;
                                        compData.monetaryEmailStatus = true;
                                        compData.isEmailParitallySent = true;
                                    }
                                });
                            }
                        });
                    }
                    _this.CompPaxListNotIssued.push(compData);
                }
                else {
                    console.log("Not Printed" + compData.FullName);
                    if (compData.isEmailSent == true) {
                        compData.Compensations.forEach(function (exiEMD, exiIndex) {
                            if (exiEMD.Emds) {
                                exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                    if (emdData.EmailStatus == "n" && exiEMD.Emds.filter(function (m) { return m.EmailStatus == "y"; }).length < exiEMD.Emds.length) {
                                        console.log("in here");
                                        compData.isEmailSent = true;
                                        compData.monetaryEmailStatus = true;
                                        compData.isEmailParitallySent = true;
                                    }
                                });
                            }
                        });
                    }
                    _this.CompPaxListNotIssued.push(compData);
                }
            }
            else {
                console.log("Printed" + compData.FullName);
                if (compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds) {
                    compData.monetarycount = compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds.length;
                }
                else {
                    compData.monetarycount = 0;
                }
                if (compData.isEmailSent == true) {
                    compData.Compensations.forEach(function (exiEMD, exiIndex) {
                        if (exiEMD.Emds) {
                            exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                if (emdData.EmailStatus == "n") {
                                    compData.isEmailSent = true;
                                    compData.monetaryEmailStatus = true;
                                    compData.isEmailParitallySent = true;
                                }
                            });
                        }
                    });
                }
                _this.CompPaxListIssued.push(compData);
                if (compData.monetary > 0) {
                    console.log("Printed monetary > 0" + compData.FullName);
                    var paxData_2 = new index_1.CompensationSearchModule.CompensationPassengerList();
                    paxData_2.FlightSegmentId = compData.FlightSegmentId;
                    paxData_2.PassengerSeq = compData.PassengerSeq;
                    paxData_2.OrderId = compData.OrderId;
                    paxData_2.GivenName = compData.GivenName;
                    paxData_2.LastName = compData.LastName;
                    paxData_2.FullName = compData.LastName + "/" + compData.GivenName;
                    paxData_2.PaxType = compData.PaxType;
                    paxData_2.FqtvCc = compData.FqtvCc;
                    paxData_2.FqtvNumber = compData.FqtvNumber;
                    paxData_2.PaxStatus = compData.PaxStatus;
                    paxData_2.PaxEmailAddress = compData.PaxEmailAddress;
                    paxData_2.CompensationReasonId = compData.CompensationReasonId;
                    paxData_2.IsExistingCompensation = compData.IsExistingCompensation;
                    paxData_2.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                    paxData_2.WorldTracerNum = compData.WorldTracerNum;
                    paxData_2.UpdateLockNbr = compData.UpdateLockNbr;
                    paxData_2.FqtvTier = compData.FqtvTier;
                    paxData_2.Cabin = compData.Cabin;
                    paxData_2.PaxRPH = compData.PaxRPH;
                    paxData_2.Origin = compData.Origin;
                    paxData_2.Dest = compData.Dest;
                    paxData_2.IsCompensationIssued = compData.IsCompensationIssued;
                    paxData_2.SSR = compData.SSR;
                    paxData_2.Etkt = compData.Etkt;
                    paxData_2.ReaccomDetails = compData.ReaccomDetails;
                    paxData_2.AdditionalDetails = compData.AdditionalDetails;
                    paxData_2.monetary = compData.monetary;
                    paxData_2.monetaryPrintStatus = compData.monetaryPrintStatus;
                    paxData_2.Compensations = compData.Compensations;
                    paxData_2.ExistingCompensations = compData.ExistingCompensations;
                    paxData_2.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                    paxData_2.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                    paxData_2.mealendorsementTextItems = compData.mealendorsementTextItems;
                    paxData_2.mealFreeText = compData.mealFreeText;
                    paxData_2.mealDetails = compData.mealDetails;
                    paxData_2.MealOverrideReason = compData.MealOverrideReason;
                    paxData_2.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                    paxData_2.hotelFreeText = compData.hotelFreeText;
                    paxData_2.HotelOverrideReason = compData.HotelOverrideReason;
                    paxData_2.hotelDetails = compData.hotelDetails;
                    paxData_2.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                    paxData_2.transportFreeText = compData.transportFreeText;
                    paxData_2.transportEMD = compData.transportEMD;
                    paxData_2.TransportOverrideReason = compData.TransportOverrideReason;
                    paxData_2.monetaryEmailStatus = compData.monetaryEmailStatus;
                    paxData_2.hotel = 0;
                    paxData_2.hotelPrintStatus = false;
                    paxData_2.meal = 0;
                    paxData_2.mealPrintStatus = false;
                    paxData_2.transportation = 0;
                    paxData_2.transportPrintStatus = false;
                    paxData_2.Email = compData.Email;
                    paxData_2.isEmailSent = compData.isEmailSent;
                    paxData_2.isParitallyPrinted = compData.isParitallyPrinted;
                    if (paxData_2.isParitallyPrinted) {
                        paxData_2.monetaryPrintStatus = true;
                    }
                    if (compData.isEmailSent == true) {
                        compData.Compensations.forEach(function (exiEMD, exiIndex) {
                            if (exiEMD.Emds) {
                                exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                    if (emdData.EmailStatus == "n") {
                                        paxData_2.isEmailSent = true;
                                        paxData_2.monetaryEmailStatus = true;
                                        paxData_2.isEmailParitallySent = true;
                                    }
                                });
                            }
                        });
                    }
                    paxData_2.monetarycount = compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds.length;
                    _this.CompPaxList.push(paxData_2);
                    _this.CompPaxListNotIssued.push(paxData_2);
                }
            }
            if (compData.isEmailSent == true && compData.isNotPrinted == true && compData.isParitallyPrinted == false) {
                console.log("isEmailSent && isNotPrinted" + compData.FullName);
                var paxData_3 = new index_1.CompensationSearchModule.CompensationPassengerList();
                paxData_3.isEmailSent = compData.isEmailSent;
                paxData_3.monetaryEmailStatus = compData.monetaryEmailStatus;
                compData.Compensations.forEach(function (exiEMD, exiIndex) {
                    if (exiEMD.Emds) {
                        exiEMD.Emds.forEach(function (emdData, emdIndex) {
                            console.log("in here isEmailSent && isNotPrinted 1:" + compData.FullName + JSON.stringify(exiEMD.Emds.filter(function (m) { return m.EmailStatus == "n"; }).length));
                            console.log("in here isEmailSent && isNotPrinted 2:" + compData.FullName + JSON.stringify(exiEMD.Emds.length));
                            if (emdData.EmailStatus == "n" && exiEMD.Emds.filter(function (m) { return m.EmailStatus == "n"; }).length < exiEMD.Emds.length) {
                                paxData_3.isEmailSent = true;
                                paxData_3.monetaryEmailStatus = true;
                                paxData_3.isEmailParitallySent = true;
                            }
                        });
                    }
                });
                paxData_3.FlightSegmentId = compData.FlightSegmentId;
                paxData_3.PassengerSeq = compData.PassengerSeq;
                paxData_3.OrderId = compData.OrderId;
                paxData_3.GivenName = compData.GivenName;
                paxData_3.LastName = compData.LastName;
                paxData_3.FullName = compData.LastName + "/" + compData.GivenName;
                paxData_3.PaxType = compData.PaxType;
                paxData_3.FqtvCc = compData.FqtvCc;
                paxData_3.FqtvNumber = compData.FqtvNumber;
                paxData_3.PaxStatus = compData.PaxStatus;
                paxData_3.PaxEmailAddress = compData.PaxEmailAddress;
                paxData_3.CompensationReasonId = compData.CompensationReasonId;
                paxData_3.IsExistingCompensation = compData.IsExistingCompensation;
                paxData_3.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                paxData_3.WorldTracerNum = compData.WorldTracerNum;
                paxData_3.UpdateLockNbr = compData.UpdateLockNbr;
                paxData_3.FqtvTier = compData.FqtvTier;
                paxData_3.Cabin = compData.Cabin;
                paxData_3.PaxRPH = compData.PaxRPH;
                paxData_3.Origin = compData.Origin;
                paxData_3.Dest = compData.Dest;
                paxData_3.IsCompensationIssued = compData.IsCompensationIssued;
                paxData_3.SSR = compData.SSR;
                paxData_3.Etkt = compData.Etkt;
                paxData_3.ReaccomDetails = compData.ReaccomDetails;
                paxData_3.AdditionalDetails = compData.AdditionalDetails;
                paxData_3.monetary = compData.monetary;
                paxData_3.monetaryPrintStatus = compData.monetaryPrintStatus;
                paxData_3.Compensations = compData.Compensations;
                paxData_3.ExistingCompensations = compData.ExistingCompensations;
                paxData_3.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                paxData_3.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                paxData_3.mealendorsementTextItems = compData.mealendorsementTextItems;
                paxData_3.mealFreeText = compData.mealFreeText;
                paxData_3.mealDetails = compData.mealDetails;
                paxData_3.MealOverrideReason = compData.MealOverrideReason;
                paxData_3.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                paxData_3.hotelFreeText = compData.hotelFreeText;
                paxData_3.HotelOverrideReason = compData.HotelOverrideReason;
                paxData_3.hotelDetails = compData.hotelDetails;
                paxData_3.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                paxData_3.transportFreeText = compData.transportFreeText;
                paxData_3.transportEMD = compData.transportEMD;
                paxData_3.TransportOverrideReason = compData.TransportOverrideReason;
                // paxData.monetaryEmailStatus = compData.monetaryEmailStatus;
                paxData_3.hotel = 0;
                paxData_3.hotelPrintStatus = false;
                paxData_3.meal = 0;
                paxData_3.mealPrintStatus = false;
                paxData_3.transportation = 0;
                paxData_3.transportPrintStatus = false;
                paxData_3.Email = compData.Email;
                paxData_3.isParitallyPrinted = compData.isParitallyPrinted;
                paxData_3.monetarycount = compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds.length;
                console.log("Email :" + JSON.stringify(paxData_3));
                _this.CompPaxList.push(paxData_3);
                _this.CompPaxListIssued.push(paxData_3);
            }
        });
        // console.log("Email 1:" + JSON.stringify(this.CompPaxList));
        // console.log("Email 2:" + JSON.stringify(this.CompPaxListIssued));
        // console.log("Email 3:" + JSON.stringify(this.CompPaxListNotIssued));
        this.apisdetails = [];
        this.ComPaxPrintFullList = this.CompPaxListIssued;
        this.firsttab.title = "EMD Printed" + "(" + this.CompPaxListIssued.length + ")";
        this.apisdetails.push(this.firsttab);
        this.ComPaxNotPrintFullList = this.CompPaxListNotIssued;
        this.secondtab.title = "EMD Available for Print" + "(" + this.CompPaxListNotIssued.length + ")";
        this.apisdetails.push(this.secondtab);
    };
    CompensationPrintScreenComponent.prototype.selectSegment = function (e) {
        var _this = this;
        console.dir(e);
        var selInd = e.newIndex;
        this.SelectedPassenger = [];
        if (selInd == 0) {
            this.totalIssuedMonetary = 0;
            this.totalIssuedHotel = 0;
            this.totalIssuedMeal = 0;
            this.totalIssuedTransport = 0;
            this.CompensationIssuedList = true;
            this.CompensationNotIssuedList = false;
            this.SelectAllPax = false;
            this.SearchCriteria = "Name";
            this.searchField = undefined;
            this.CompPaxListNotIssued.forEach(function (data, Index) {
                data.IsSelected = false;
            });
            this.CompPaxListIssued.forEach(function (compData, Index) {
                _this.totalIssuedMonetary = _this.totalIssuedMonetary + Number(compData.monetary);
                _this.totalIssuedHotel += Number(compData.hotel);
                _this.totalIssuedMeal += Number(compData.meal);
                _this.totalIssuedTransport += Number(compData.transportation);
            });
            this.CompPaxList = this.ComPaxPrintFullList;
            this.selectedPassengerCount = 0;
            this.TotalPassengerCount = this.ComPaxPrintFullList.length;
            console.log("Issued" + this.CompPaxListIssued.length);
        }
        else {
            this.CompensationIssuedList = false;
            this.CompensationNotIssuedList = true;
            this.SearchCriteria = "Name";
            this.searchField = undefined;
            this.totalNotIssuedMonetary = 0;
            this.totalNotIssuedHotel = 0;
            this.totalNotIssuedMeal = 0;
            this.totalNotIssuedTransport = 0;
            this.CompPaxListNotIssued.forEach(function (compData, Index) {
                _this.totalNotIssuedMonetary = _this.totalNotIssuedMonetary + Number(compData.monetary);
                _this.totalNotIssuedHotel += Number(compData.hotel);
                _this.totalNotIssuedMeal += Number(compData.meal);
                _this.totalNotIssuedTransport += Number(compData.transportation);
            });
            this.CompPaxList = this.ComPaxNotPrintFullList;
            this.selectedPassengerCount = 0;
            this.TotalPassengerCount = this.ComPaxNotPrintFullList.length;
            console.log("Not Issued" + this.CompPaxListNotIssued.length);
        }
    };
    CompensationPrintScreenComponent.prototype.toggleChecked = function (pax) {
        // if ((this.IsLabelField == true && this.CompensationNotIssuedList == true)  || this.CompensationIssuedList ==true) {
        if (this.CompensationNotIssuedList == true) {
            if (pax.IsSelected == false) {
                pax.IsSelected = true;
                if (this.isEmailCopytoSelectPaxTrue) {
                    pax.Email = this.EmailIdSelectedPax;
                }
                this.SelectedPassenger.push(pax);
                // if (this.CompPaxList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
                console.log("Len" + this.SelectedPassenger.length);
            }
            else {
                this.SelectedPassenger.splice(this.SelectedPassenger.indexOf(pax), 1);
                pax.IsSelected = false;
                this.SelectAllPax = false;
            }
            this.selectedPassengerCount = this.SelectedPassenger.length;
            console.log(this.SelectedPassenger);
        }
        if (this.ComPaxNotPrintFullList.length === this.SelectedPassenger.length)
            this.SelectAllPax = true;
    };
    CompensationPrintScreenComponent.prototype.printEnabled = function () {
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
            return true;
        }
        else
            return false;
    };
    CompensationPrintScreenComponent.prototype.selectingAllPax = function () {
        var _this = this;
        if (this.SelectAllPax == false && this.SelectAllPaxVar == false) {
            this.SelectAllPaxVar = true;
            this.CompPaxList.forEach(function (data, index) {
                if (!data.IsSelected) {
                    data.IsSelected = true;
                    if (_this.isEmailCopytoSelectPaxTrue) {
                        data.Email = _this.EmailIdSelectedPax;
                    }
                    _this.SelectedPassenger.push(data);
                    // if (this.ComensationReason != "Select Reason") {
                    //     data.CompensationReason = this.ComensationReason;
                }
                // }
            });
            if (this.ComPaxNotPrintFullList.length === this.SelectedPassenger.length)
                this.SelectAllPax = true;
        }
        else {
            this.SelectAllPaxVar = false;
            this.SelectAllPax = false;
            this.SelectedPassenger = [];
            this.CompPaxList.forEach(function (data, index) {
                data.IsSelected = false;
                data.CompensationReason = "";
            });
        }
        this.selectedPassengerCount = this.SelectedPassenger.length;
    };
    CompensationPrintScreenComponent.prototype.emailEnabled = function () {
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
    CompensationPrintScreenComponent.prototype.filter = function (args) {
        console.log("Name:" + JSON.stringify(args));
        // this.CompPaxList = this.CompensationFullPaxList;
        var segBarElm = this.segbar.nativeElement;
        var index = segBarElm.selectedIndex;
        if (index == 0) {
            this.CompPaxListIssued = this.ComPaxPrintFullList;
            if (this.SearchCriteria == "Name") {
                if (args) {
                    var name_1 = args.toString().toUpperCase();
                    this.CompPaxListIssued = this.CompPaxListIssued.filter(function (r) { return r.GivenName.indexOf(name_1.trim()) >= 0 || r.LastName.indexOf(name_1.trim()) >= 0; });
                    this.CompPaxList = this.CompPaxListIssued;
                }
                else {
                    this.CompPaxListIssued = this.ComPaxPrintFullList;
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
                    this.CompPaxListIssued = this.ComPaxPrintFullList;
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
                    this.CompPaxListIssued = this.ComPaxPrintFullList;
                    this.CompPaxList = this.CompPaxListIssued;
                }
            }
            this.TotalPassengerCount = this.CompPaxListIssued.length;
        }
        else {
            this.CompPaxListNotIssued = this.ComPaxNotPrintFullList;
            if (this.SearchCriteria == "Name") {
                if (args) {
                    var name_4 = args.toString().toUpperCase();
                    this.CompPaxListNotIssued = this.CompPaxListNotIssued.filter(function (r) { return r.GivenName.indexOf(name_4.trim()) >= 0 || r.LastName.indexOf(name_4.trim()) >= 0; });
                    this.CompPaxList = this.CompPaxListNotIssued;
                }
                else {
                    this.CompPaxListNotIssued = this.ComPaxNotPrintFullList;
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
                    this.CompPaxListNotIssued = this.ComPaxNotPrintFullList;
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
                    this.CompPaxListNotIssued = this.ComPaxNotPrintFullList;
                    this.CompPaxList = this.CompPaxListNotIssued;
                }
            }
            if (this.ComPaxNotPrintFullList.length === this.SelectedPassenger.length)
                this.SelectAllPax = true;
            this.TotalPassengerCount = this.CompPaxListNotIssued.length;
        }
    };
    CompensationPrintScreenComponent.prototype.sortBasedOnPaxName = function () {
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
    CompensationPrintScreenComponent.prototype.sortBasedOnSSR = function () {
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
    CompensationPrintScreenComponent.prototype.sortBasedOnTier = function () {
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
    CompensationPrintScreenComponent.prototype.sortBasedOnClass = function () {
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
    CompensationPrintScreenComponent.prototype.sortBasedOnOrderId = function () {
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
    CompensationPrintScreenComponent.prototype.email = function (item) {
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
                                                    _this.isEmailCopytoSelectPaxTrue = true;
                                                    _this.EmailIdSelectedPax = result.text;
                                                    item.Email = result.text;
                                                    _this.SelectedPassenger.forEach(function (data, Index) {
                                                        data.Email = _this.EmailIdSelectedPax;
                                                    });
                                                    console.log("Email:" + JSON.stringify(item.Email));
                                                }
                                                else {
                                                    _this.isEmailCopytoSelectPaxTrue = true;
                                                    item.Email = result.text;
                                                    _this.EmailIdSelectedPax = result.text;
                                                    _this.SelectedPassenger.forEach(function (data, Index) {
                                                        data.Email = _this.EmailIdSelectedPax;
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
    CompensationPrintScreenComponent.prototype.updateEmail = function (orderResposne, item) {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var startDate = new Date();
            var CurDate = moment(startDate).format("YYYY-MM-DD");
            console.log(CurDate);
            this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
            var EmailCompensationStructure = index_4.Converters.convertToUpdateEmailId(item, orderResposne);
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
    CompensationPrintScreenComponent.prototype.sendEmail = function () {
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
                var EmailCompensationStructure = index_4.Converters.convertToEmailCompensation(this.SelectedPassenger, this.FlightHeaderInfo);
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
    CompensationPrintScreenComponent.prototype.getCompensationList = function (date, flight, location, paxtype) {
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
    CompensationPrintScreenComponent.prototype.flightStatusForCompensationList = function (CompPax) {
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
                        var flightStatus = index_4.Converters.convertToFlightHeaderInfo(status_1, ApplicationSettings.getString("SearchLocation", ""));
                        _this._shared.setFlightHeaderInfo(flightStatus);
                        var CompaxList_1 = index_4.Converters.convertoCompensationPassengerList(CompPax, status_1, ApplicationSettings.getString("SearchLocation", ""));
                        if (_this.PreviousPage == "issueCompensation") {
                            var CompaxFilteredList_1 = new index_1.CompensationSearchModule.CompensationRootObject();
                            _this.selectedPassenger.forEach(function (SelPax, Index) {
                                CompaxList_1.PassengerList.forEach(function (AllPax, Index) {
                                    if (SelPax.OrderId == AllPax.OrderId && SelPax.GivenName == AllPax.GivenName && SelPax.LastName == AllPax.LastName && SelPax.Compensations[0].CompReasonText == AllPax.Compensations[0].CompReasonText) {
                                        CompaxFilteredList_1.FlightModel = CompaxList_1.FlightModel;
                                        CompaxFilteredList_1.PassengerList.push(AllPax);
                                    }
                                });
                            });
                            CompaxList_1 = null;
                            CompaxList_1 = CompaxFilteredList_1;
                            _this._shared.setCompensationList(CompaxFilteredList_1);
                        }
                        else {
                            _this._shared.setCompensationList(CompaxList_1);
                        }
                        _this.PaxList = new index_1.CompensationSearchModule.CompensationRootObject();
                        _this.CompPaxListNotIssued = [];
                        _this.CompPaxListIssued = [];
                        // this.naviagatetoCompensationPrintListwithtab();
                        _this.PaxList = CompaxList_1;
                        _this.CompPaxList = _this.PaxList.PassengerList.filter(function (m) { return m.IsCompensationIssued == true; });
                        // console.log("Pax List:" + JSON.stringify(this.CompPaxList));
                        _this.FlightHeaderInfo = _this.PaxList.FlightModel;
                        _this.totalIssuedMonetary = 0;
                        _this.totalIssuedHotel = 0;
                        _this.totalIssuedMeal = 0;
                        _this.totalIssuedTransport = 0;
                        _this.totalNotIssuedMonetary = 0;
                        _this.totalNotIssuedHotel = 0;
                        _this.totalNotIssuedMeal = 0;
                        _this.totalNotIssuedTransport = 0;
                        _this.CompPaxList.forEach(function (compData, Index) {
                            compData.Compensations.forEach(function (exiEMD, exiIndex) {
                                if (compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds) {
                                    compData.monetarycount = compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds.length;
                                }
                                else {
                                    compData.monetarycount = 0;
                                }
                                if (exiEMD.Emds) {
                                    exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                        // if (exiEMD.CompTypeText != "Monetary") {
                                        if (emdData.PrintStatus == "n") {
                                            compData.isNotPrinted = true;
                                        }
                                        if (emdData.EmailStatus == "y") {
                                            compData.isEmailSent = true;
                                        }
                                        // }
                                    });
                                }
                            });
                            if (compData.isNotPrinted == true) {
                                compData.Compensations.forEach(function (exiEMD, exiIndex) {
                                    if (exiEMD.Emds) {
                                        exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                            if (emdData.PrintStatus == "y") {
                                                compData.isParitallyPrinted = true;
                                            }
                                        });
                                    }
                                    if (exiEMD.CompTypeText == "Monetary") {
                                        if (exiEMD.Emds) {
                                            exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                                if (emdData.PrintStatus == "y" && exiEMD.Emds.filter(function (m) { return m.PrintStatus == "y"; }).length < exiEMD.Emds.length) {
                                                    console.log(exiEMD.Emds.length);
                                                    console.log(exiEMD.Emds.filter(function (m) { return m.PrintStatus == "y"; }).length);
                                                    compData.isParitallyPrinted = true;
                                                    compData.monetaryPrintStatus = true;
                                                    compData.isMonetaryParitallyPrinted = true;
                                                }
                                            });
                                        }
                                    }
                                });
                                if (compData.isParitallyPrinted == true) {
                                    console.log("isParitallyPrinted Printed" + compData.FullName);
                                    var paxData_4 = new index_1.CompensationSearchModule.CompensationPassengerList();
                                    paxData_4.FlightSegmentId = compData.FlightSegmentId;
                                    paxData_4.PassengerSeq = compData.PassengerSeq;
                                    paxData_4.OrderId = compData.OrderId;
                                    paxData_4.GivenName = compData.GivenName;
                                    paxData_4.LastName = compData.LastName;
                                    paxData_4.FullName = compData.LastName + "/" + compData.GivenName;
                                    paxData_4.PaxType = compData.PaxType;
                                    paxData_4.FqtvCc = compData.FqtvCc;
                                    paxData_4.FqtvNumber = compData.FqtvNumber;
                                    paxData_4.PaxStatus = compData.PaxStatus;
                                    paxData_4.PaxEmailAddress = compData.PaxEmailAddress;
                                    paxData_4.CompensationReasonId = compData.CompensationReasonId;
                                    paxData_4.IsExistingCompensation = compData.IsExistingCompensation;
                                    paxData_4.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                                    paxData_4.WorldTracerNum = compData.WorldTracerNum;
                                    paxData_4.UpdateLockNbr = compData.UpdateLockNbr;
                                    paxData_4.FqtvTier = compData.FqtvTier;
                                    paxData_4.Cabin = compData.Cabin;
                                    paxData_4.PaxRPH = compData.PaxRPH;
                                    paxData_4.Origin = compData.Origin;
                                    paxData_4.Dest = compData.Dest;
                                    paxData_4.IsCompensationIssued = compData.IsCompensationIssued;
                                    paxData_4.SSR = compData.SSR;
                                    paxData_4.Etkt = compData.Etkt;
                                    paxData_4.ReaccomDetails = compData.ReaccomDetails;
                                    paxData_4.AdditionalDetails = compData.AdditionalDetails;
                                    paxData_4.monetary = compData.monetary;
                                    paxData_4.monetaryPrintStatus = compData.monetaryPrintStatus;
                                    paxData_4.Compensations = compData.Compensations;
                                    paxData_4.ExistingCompensations = compData.ExistingCompensations;
                                    paxData_4.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                                    paxData_4.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                                    paxData_4.mealendorsementTextItems = compData.mealendorsementTextItems;
                                    paxData_4.mealFreeText = compData.mealFreeText;
                                    paxData_4.mealDetails = compData.mealDetails;
                                    paxData_4.MealOverrideReason = compData.MealOverrideReason;
                                    paxData_4.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                                    paxData_4.hotelFreeText = compData.hotelFreeText;
                                    paxData_4.HotelOverrideReason = compData.HotelOverrideReason;
                                    paxData_4.hotelDetails = compData.hotelDetails;
                                    paxData_4.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                                    paxData_4.transportFreeText = compData.transportFreeText;
                                    paxData_4.transportEMD = compData.transportEMD;
                                    paxData_4.TransportOverrideReason = compData.TransportOverrideReason;
                                    paxData_4.monetaryEmailStatus = compData.monetaryEmailStatus;
                                    paxData_4.Email = compData.Email;
                                    paxData_4.isEmailSent = compData.isEmailSent;
                                    paxData_4.isEmailParitallySent = compData.isEmailParitallySent;
                                    console.log("New Inside:" + compData.isParitallyPrinted);
                                    paxData_4.monetaryPrintStatus = compData.monetaryPrintStatus;
                                    paxData_4.isParitallyPrinted = compData.isParitallyPrinted;
                                    paxData_4.isMonetaryParitallyPrinted = compData.isMonetaryParitallyPrinted;
                                    paxData_4.isMealParitallyPrinted = compData.isMealParitallyPrinted;
                                    paxData_4.isHotelsParitallyPrinted = compData.isHotelsParitallyPrinted;
                                    paxData_4.isTransportParitallyPrinted = compData.isTransportParitallyPrinted;
                                    if (compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds) {
                                        paxData_4.monetarycount = compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds.length;
                                    }
                                    compData.Compensations.forEach(function (newcompData, Index) {
                                        if (newcompData.Emds) {
                                            if (newcompData.CompTypeText == "Hotel") {
                                                paxData_4.hotel = newcompData.Emds.filter(function (m) { return m.PrintStatus == "y"; }).length;
                                                if (paxData_4.hotel > 0) {
                                                    paxData_4.hotelPrintStatus = true;
                                                }
                                            }
                                            if (newcompData.CompTypeText == "Meal") {
                                                paxData_4.meal = newcompData.Emds.filter(function (m) { return m.PrintStatus == "y"; }).length;
                                                if (paxData_4.meal > 0) {
                                                    paxData_4.mealPrintStatus = true;
                                                }
                                            }
                                            // paxData.mealPrintStatus = false;
                                            if (newcompData.CompTypeText == "Transportation") {
                                                paxData_4.transportation = newcompData.Emds.filter(function (m) { return m.PrintStatus == "y"; }).length;
                                                if (paxData_4.transportation > 0) {
                                                    paxData_4.transportPrintStatus = true;
                                                }
                                            }
                                        }
                                    });
                                    if (compData.isEmailSent == true) {
                                        compData.Compensations.forEach(function (exiEMD, exiIndex) {
                                            if (exiEMD.Emds) {
                                                exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                                    if (emdData.EmailStatus == "n") {
                                                        paxData_4.isEmailSent = true;
                                                        paxData_4.monetaryEmailStatus = true;
                                                        paxData_4.isEmailParitallySent = true;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    _this.CompPaxList.push(paxData_4);
                                    _this.CompPaxListIssued.push(paxData_4);
                                    paxData_4.monetaryPrintStatus = compData.monetaryPrintStatus;
                                    compData.Compensations.forEach(function (newcompData, Index) {
                                        if (newcompData.Emds) {
                                            if (newcompData.CompTypeText == "Hotel") {
                                                compData.hotel = newcompData.Emds.filter(function (m) { return m.PrintStatus == "n"; }).length;
                                                compData.hotelPrintStatus = false;
                                            }
                                            if (newcompData.CompTypeText == "Meal") {
                                                compData.meal = newcompData.Emds.filter(function (m) { return m.PrintStatus == "n"; }).length;
                                                compData.mealPrintStatus = false;
                                            }
                                            if (newcompData.CompTypeText == "Transportation") {
                                                compData.transportation = newcompData.Emds.filter(function (m) { return m.PrintStatus == "n"; }).length;
                                                compData.transportPrintStatus = false;
                                            }
                                        }
                                    });
                                    if (compData.isEmailSent == true) {
                                        compData.Compensations.forEach(function (exiEMD, exiIndex) {
                                            if (exiEMD.Emds) {
                                                exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                                    if (emdData.EmailStatus == "n") {
                                                        compData.isEmailSent = true;
                                                        compData.monetaryEmailStatus = true;
                                                        compData.isEmailParitallySent = true;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    _this.CompPaxListNotIssued.push(compData);
                                }
                                else {
                                    console.log("Not Printed" + compData.FullName);
                                    if (compData.isEmailSent == true) {
                                        compData.Compensations.forEach(function (exiEMD, exiIndex) {
                                            if (exiEMD.Emds) {
                                                exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                                    if (emdData.EmailStatus == "n") {
                                                        compData.isEmailSent = true;
                                                        compData.monetaryEmailStatus = true;
                                                        compData.isEmailParitallySent = true;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    _this.CompPaxListNotIssued.push(compData);
                                }
                            }
                            else {
                                console.log("Printed" + compData.FullName);
                                if (compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds) {
                                    compData.monetarycount = compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds.length;
                                }
                                else {
                                    compData.monetarycount = 0;
                                }
                                if (compData.isEmailSent == true) {
                                    compData.Compensations.forEach(function (exiEMD, exiIndex) {
                                        if (exiEMD.Emds) {
                                            exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                                if (emdData.EmailStatus == "n") {
                                                    compData.isEmailSent = true;
                                                    compData.monetaryEmailStatus = true;
                                                    compData.isEmailParitallySent = true;
                                                }
                                            });
                                        }
                                    });
                                }
                                _this.CompPaxListIssued.push(compData);
                                if (compData.monetary > 0) {
                                    console.log("Printed monetary > 0" + compData.FullName);
                                    var paxData_5 = new index_1.CompensationSearchModule.CompensationPassengerList();
                                    paxData_5.FlightSegmentId = compData.FlightSegmentId;
                                    paxData_5.PassengerSeq = compData.PassengerSeq;
                                    paxData_5.OrderId = compData.OrderId;
                                    paxData_5.GivenName = compData.GivenName;
                                    paxData_5.LastName = compData.LastName;
                                    paxData_5.FullName = compData.LastName + "/" + compData.GivenName;
                                    paxData_5.PaxType = compData.PaxType;
                                    paxData_5.FqtvCc = compData.FqtvCc;
                                    paxData_5.FqtvNumber = compData.FqtvNumber;
                                    paxData_5.PaxStatus = compData.PaxStatus;
                                    paxData_5.PaxEmailAddress = compData.PaxEmailAddress;
                                    paxData_5.CompensationReasonId = compData.CompensationReasonId;
                                    paxData_5.IsExistingCompensation = compData.IsExistingCompensation;
                                    paxData_5.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                                    paxData_5.WorldTracerNum = compData.WorldTracerNum;
                                    paxData_5.UpdateLockNbr = compData.UpdateLockNbr;
                                    paxData_5.FqtvTier = compData.FqtvTier;
                                    paxData_5.Cabin = compData.Cabin;
                                    paxData_5.PaxRPH = compData.PaxRPH;
                                    paxData_5.Origin = compData.Origin;
                                    paxData_5.Dest = compData.Dest;
                                    paxData_5.IsCompensationIssued = compData.IsCompensationIssued;
                                    paxData_5.SSR = compData.SSR;
                                    paxData_5.Etkt = compData.Etkt;
                                    paxData_5.ReaccomDetails = compData.ReaccomDetails;
                                    paxData_5.AdditionalDetails = compData.AdditionalDetails;
                                    paxData_5.monetary = compData.monetary;
                                    paxData_5.monetaryPrintStatus = compData.monetaryPrintStatus;
                                    paxData_5.Compensations = compData.Compensations;
                                    paxData_5.ExistingCompensations = compData.ExistingCompensations;
                                    paxData_5.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                                    paxData_5.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                                    paxData_5.mealendorsementTextItems = compData.mealendorsementTextItems;
                                    paxData_5.mealFreeText = compData.mealFreeText;
                                    paxData_5.mealDetails = compData.mealDetails;
                                    paxData_5.MealOverrideReason = compData.MealOverrideReason;
                                    paxData_5.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                                    paxData_5.hotelFreeText = compData.hotelFreeText;
                                    paxData_5.HotelOverrideReason = compData.HotelOverrideReason;
                                    paxData_5.hotelDetails = compData.hotelDetails;
                                    paxData_5.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                                    paxData_5.transportFreeText = compData.transportFreeText;
                                    paxData_5.transportEMD = compData.transportEMD;
                                    paxData_5.TransportOverrideReason = compData.TransportOverrideReason;
                                    paxData_5.monetaryEmailStatus = compData.monetaryEmailStatus;
                                    paxData_5.hotel = 0;
                                    paxData_5.hotelPrintStatus = false;
                                    paxData_5.meal = 0;
                                    paxData_5.mealPrintStatus = false;
                                    paxData_5.transportation = 0;
                                    paxData_5.transportPrintStatus = false;
                                    paxData_5.Email = compData.Email;
                                    paxData_5.isEmailSent = compData.isEmailSent;
                                    paxData_5.isParitallyPrinted = compData.isParitallyPrinted;
                                    if (paxData_5.isParitallyPrinted) {
                                        paxData_5.monetaryPrintStatus = true;
                                    }
                                    if (compData.isEmailSent == true) {
                                        compData.Compensations.forEach(function (exiEMD, exiIndex) {
                                            if (exiEMD.Emds) {
                                                exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                                    if (emdData.EmailStatus == "n") {
                                                        paxData_5.isEmailSent = true;
                                                        paxData_5.monetaryEmailStatus = true;
                                                        paxData_5.isEmailParitallySent = true;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    paxData_5.monetarycount = compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds.length;
                                    _this.CompPaxList.push(paxData_5);
                                    _this.CompPaxListNotIssued.push(paxData_5);
                                }
                            }
                            if (compData.isEmailSent == true && compData.isNotPrinted == true && compData.isParitallyPrinted == false) {
                                console.log("isEmailSent && isNotPrinted" + compData.FullName);
                                var paxData_6 = new index_1.CompensationSearchModule.CompensationPassengerList();
                                paxData_6.isEmailSent = compData.isEmailSent;
                                paxData_6.monetaryEmailStatus = compData.monetaryEmailStatus;
                                compData.Compensations.forEach(function (exiEMD, exiIndex) {
                                    if (exiEMD.Emds) {
                                        exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                            if (emdData.EmailStatus == "n") {
                                                paxData_6.isEmailSent = true;
                                                paxData_6.monetaryEmailStatus = true;
                                                paxData_6.isEmailParitallySent = true;
                                            }
                                        });
                                    }
                                });
                                paxData_6.FlightSegmentId = compData.FlightSegmentId;
                                paxData_6.PassengerSeq = compData.PassengerSeq;
                                paxData_6.OrderId = compData.OrderId;
                                paxData_6.GivenName = compData.GivenName;
                                paxData_6.LastName = compData.LastName;
                                paxData_6.FullName = compData.LastName + "/" + compData.GivenName;
                                paxData_6.PaxType = compData.PaxType;
                                paxData_6.FqtvCc = compData.FqtvCc;
                                paxData_6.FqtvNumber = compData.FqtvNumber;
                                paxData_6.PaxStatus = compData.PaxStatus;
                                paxData_6.PaxEmailAddress = compData.PaxEmailAddress;
                                paxData_6.CompensationReasonId = compData.CompensationReasonId;
                                paxData_6.IsExistingCompensation = compData.IsExistingCompensation;
                                paxData_6.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                                paxData_6.WorldTracerNum = compData.WorldTracerNum;
                                paxData_6.UpdateLockNbr = compData.UpdateLockNbr;
                                paxData_6.FqtvTier = compData.FqtvTier;
                                paxData_6.Cabin = compData.Cabin;
                                paxData_6.PaxRPH = compData.PaxRPH;
                                paxData_6.Origin = compData.Origin;
                                paxData_6.Dest = compData.Dest;
                                paxData_6.IsCompensationIssued = compData.IsCompensationIssued;
                                paxData_6.SSR = compData.SSR;
                                paxData_6.Etkt = compData.Etkt;
                                paxData_6.ReaccomDetails = compData.ReaccomDetails;
                                paxData_6.AdditionalDetails = compData.AdditionalDetails;
                                paxData_6.monetary = compData.monetary;
                                paxData_6.monetaryPrintStatus = compData.monetaryPrintStatus;
                                paxData_6.Compensations = compData.Compensations;
                                paxData_6.ExistingCompensations = compData.ExistingCompensations;
                                paxData_6.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                                paxData_6.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                                paxData_6.mealendorsementTextItems = compData.mealendorsementTextItems;
                                paxData_6.mealFreeText = compData.mealFreeText;
                                paxData_6.mealDetails = compData.mealDetails;
                                paxData_6.MealOverrideReason = compData.MealOverrideReason;
                                paxData_6.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                                paxData_6.hotelFreeText = compData.hotelFreeText;
                                paxData_6.HotelOverrideReason = compData.HotelOverrideReason;
                                paxData_6.hotelDetails = compData.hotelDetails;
                                paxData_6.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                                paxData_6.transportFreeText = compData.transportFreeText;
                                paxData_6.transportEMD = compData.transportEMD;
                                paxData_6.TransportOverrideReason = compData.TransportOverrideReason;
                                // paxData.monetaryEmailStatus = compData.monetaryEmailStatus;
                                paxData_6.hotel = 0;
                                paxData_6.hotelPrintStatus = false;
                                paxData_6.meal = 0;
                                paxData_6.mealPrintStatus = false;
                                paxData_6.transportation = 0;
                                paxData_6.transportPrintStatus = false;
                                paxData_6.Email = compData.Email;
                                paxData_6.isParitallyPrinted = compData.isParitallyPrinted;
                                paxData_6.monetarycount = compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds.length;
                                console.log("Email :" + JSON.stringify(paxData_6));
                                _this.CompPaxList.push(paxData_6);
                                _this.CompPaxListIssued.push(paxData_6);
                            }
                        });
                        _this.apisdetails = [];
                        _this.firsttab.title = "EMD Printed" + "(" + _this.CompPaxListIssued.length + ")";
                        _this.apisdetails.push(_this.firsttab);
                        _this.ComPaxPrintFullList = _this.CompPaxListIssued;
                        _this.ComPaxNotPrintFullList = _this.CompPaxListNotIssued;
                        _this.secondtab.title = "EMD Available for Print" + "(" + _this.CompPaxListNotIssued.length + ")";
                        _this.apisdetails.push(_this.secondtab);
                        _this.loaderProgress.hideLoader();
                        var e = { eventName: "selectedIndexChanged", newIndex: 0, oldIndex: -1 };
                        _this.selectSegment(e);
                    }
                    else {
                        var status_2 = data;
                        console.log("IN1" + JSON.stringify(status_2));
                        _this._shared.setCompensationFlightDetails(status_2);
                        var CompaxList_2 = index_4.Converters.convertoCompensationPassengerList(CompPax, status_2, ApplicationSettings.getString("SearchLocation", ""));
                        if (_this.PreviousPage == "issueCompensation") {
                            var CompaxFilteredList_2 = new index_1.CompensationSearchModule.CompensationRootObject();
                            _this.selectedPassenger.forEach(function (SelPax, Index) {
                                CompaxList_2.PassengerList.forEach(function (AllPax, Index) {
                                    if (SelPax.OrderId == AllPax.OrderId && SelPax.GivenName == AllPax.GivenName && SelPax.LastName == AllPax.LastName && SelPax.Compensations[0].CompReasonText == AllPax.Compensations[0].CompReasonText) {
                                        CompaxFilteredList_2.FlightModel = CompaxList_2.FlightModel;
                                        CompaxFilteredList_2.PassengerList.push(AllPax);
                                    }
                                });
                            });
                            CompaxList_2 = null;
                            CompaxList_2 = CompaxFilteredList_2;
                            _this._shared.setCompensationList(CompaxFilteredList_2);
                        }
                        else {
                            _this._shared.setCompensationList(CompaxList_2);
                        }
                        _this.PaxList = new index_1.CompensationSearchModule.CompensationRootObject();
                        _this.CompPaxListNotIssued = [];
                        _this.CompPaxListIssued = [];
                        // this.naviagatetoCompensationPrintListwithtab();
                        _this.PaxList = CompaxList_2;
                        _this.CompPaxList = _this.PaxList.PassengerList.filter(function (m) { return m.IsCompensationIssued == true; });
                        // console.log("Pax List:" + JSON.stringify(this.CompPaxList));
                        _this.FlightHeaderInfo = _this.PaxList.FlightModel;
                        _this.totalIssuedMonetary = 0;
                        _this.totalIssuedHotel = 0;
                        _this.totalIssuedMeal = 0;
                        _this.totalIssuedTransport = 0;
                        _this.totalNotIssuedMonetary = 0;
                        _this.totalNotIssuedHotel = 0;
                        _this.totalNotIssuedMeal = 0;
                        _this.totalNotIssuedTransport = 0;
                        _this.CompPaxList.forEach(function (compData, Index) {
                            compData.Compensations.forEach(function (exiEMD, exiIndex) {
                                if (compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds) {
                                    compData.monetarycount = compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds.length;
                                }
                                else {
                                    compData.monetarycount = 0;
                                }
                                if (exiEMD.Emds) {
                                    exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                        // if (exiEMD.CompTypeText != "Monetary") {
                                        if (emdData.PrintStatus == "n") {
                                            compData.isNotPrinted = true;
                                        }
                                        if (emdData.EmailStatus == "y") {
                                            compData.isEmailSent = true;
                                        }
                                        // }
                                    });
                                }
                            });
                            if (compData.isNotPrinted == true) {
                                compData.Compensations.forEach(function (exiEMD, exiIndex) {
                                    if (exiEMD.Emds) {
                                        exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                            if (emdData.PrintStatus == "y") {
                                                compData.isParitallyPrinted = true;
                                            }
                                        });
                                    }
                                    if (exiEMD.CompTypeText == "Monetary") {
                                        if (exiEMD.Emds) {
                                            exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                                if (emdData.PrintStatus == "y" && exiEMD.Emds.filter(function (m) { return m.PrintStatus == "y"; }).length < exiEMD.Emds.length) {
                                                    console.log(exiEMD.Emds.length);
                                                    console.log(exiEMD.Emds.filter(function (m) { return m.PrintStatus == "y"; }).length);
                                                    compData.isParitallyPrinted = true;
                                                    compData.monetaryPrintStatus = true;
                                                    compData.isMonetaryParitallyPrinted = true;
                                                }
                                            });
                                        }
                                    }
                                });
                                if (compData.isParitallyPrinted == true) {
                                    console.log("isParitallyPrinted Printed" + compData.FullName);
                                    var paxData_7 = new index_1.CompensationSearchModule.CompensationPassengerList();
                                    paxData_7.FlightSegmentId = compData.FlightSegmentId;
                                    paxData_7.PassengerSeq = compData.PassengerSeq;
                                    paxData_7.OrderId = compData.OrderId;
                                    paxData_7.GivenName = compData.GivenName;
                                    paxData_7.LastName = compData.LastName;
                                    paxData_7.FullName = compData.LastName + "/" + compData.GivenName;
                                    paxData_7.PaxType = compData.PaxType;
                                    paxData_7.FqtvCc = compData.FqtvCc;
                                    paxData_7.FqtvNumber = compData.FqtvNumber;
                                    paxData_7.PaxStatus = compData.PaxStatus;
                                    paxData_7.PaxEmailAddress = compData.PaxEmailAddress;
                                    paxData_7.CompensationReasonId = compData.CompensationReasonId;
                                    paxData_7.IsExistingCompensation = compData.IsExistingCompensation;
                                    paxData_7.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                                    paxData_7.WorldTracerNum = compData.WorldTracerNum;
                                    paxData_7.UpdateLockNbr = compData.UpdateLockNbr;
                                    paxData_7.FqtvTier = compData.FqtvTier;
                                    paxData_7.Cabin = compData.Cabin;
                                    paxData_7.PaxRPH = compData.PaxRPH;
                                    paxData_7.Origin = compData.Origin;
                                    paxData_7.Dest = compData.Dest;
                                    paxData_7.IsCompensationIssued = compData.IsCompensationIssued;
                                    paxData_7.SSR = compData.SSR;
                                    paxData_7.Etkt = compData.Etkt;
                                    paxData_7.ReaccomDetails = compData.ReaccomDetails;
                                    paxData_7.AdditionalDetails = compData.AdditionalDetails;
                                    paxData_7.monetary = compData.monetary;
                                    paxData_7.monetaryPrintStatus = compData.monetaryPrintStatus;
                                    paxData_7.Compensations = compData.Compensations;
                                    paxData_7.ExistingCompensations = compData.ExistingCompensations;
                                    paxData_7.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                                    paxData_7.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                                    paxData_7.mealendorsementTextItems = compData.mealendorsementTextItems;
                                    paxData_7.mealFreeText = compData.mealFreeText;
                                    paxData_7.mealDetails = compData.mealDetails;
                                    paxData_7.MealOverrideReason = compData.MealOverrideReason;
                                    paxData_7.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                                    paxData_7.hotelFreeText = compData.hotelFreeText;
                                    paxData_7.HotelOverrideReason = compData.HotelOverrideReason;
                                    paxData_7.hotelDetails = compData.hotelDetails;
                                    paxData_7.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                                    paxData_7.transportFreeText = compData.transportFreeText;
                                    paxData_7.transportEMD = compData.transportEMD;
                                    paxData_7.TransportOverrideReason = compData.TransportOverrideReason;
                                    paxData_7.monetaryEmailStatus = compData.monetaryEmailStatus;
                                    paxData_7.Email = compData.Email;
                                    paxData_7.isEmailSent = compData.isEmailSent;
                                    paxData_7.isEmailParitallySent = compData.isEmailParitallySent;
                                    console.log("New Inside:" + compData.isParitallyPrinted);
                                    paxData_7.monetaryPrintStatus = compData.monetaryPrintStatus;
                                    paxData_7.isParitallyPrinted = compData.isParitallyPrinted;
                                    paxData_7.isMonetaryParitallyPrinted = compData.isMonetaryParitallyPrinted;
                                    paxData_7.isMealParitallyPrinted = compData.isMealParitallyPrinted;
                                    paxData_7.isHotelsParitallyPrinted = compData.isHotelsParitallyPrinted;
                                    paxData_7.isTransportParitallyPrinted = compData.isTransportParitallyPrinted;
                                    if (compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds) {
                                        paxData_7.monetarycount = compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds.length;
                                    }
                                    compData.Compensations.forEach(function (newcompData, Index) {
                                        if (newcompData.Emds) {
                                            if (newcompData.CompTypeText == "Hotel") {
                                                paxData_7.hotel = newcompData.Emds.filter(function (m) { return m.PrintStatus == "y"; }).length;
                                                if (paxData_7.hotel > 0) {
                                                    paxData_7.hotelPrintStatus = true;
                                                }
                                            }
                                            if (newcompData.CompTypeText == "Meal") {
                                                paxData_7.meal = newcompData.Emds.filter(function (m) { return m.PrintStatus == "y"; }).length;
                                                if (paxData_7.meal > 0) {
                                                    paxData_7.mealPrintStatus = true;
                                                }
                                            }
                                            // paxData.mealPrintStatus = false;
                                            if (newcompData.CompTypeText == "Transportation") {
                                                paxData_7.transportation = newcompData.Emds.filter(function (m) { return m.PrintStatus == "y"; }).length;
                                                if (paxData_7.transportation > 0) {
                                                    paxData_7.transportPrintStatus = true;
                                                }
                                            }
                                        }
                                    });
                                    if (compData.isEmailSent == true) {
                                        compData.Compensations.forEach(function (exiEMD, exiIndex) {
                                            if (exiEMD.Emds) {
                                                exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                                    if (emdData.EmailStatus == "n") {
                                                        paxData_7.isEmailSent = true;
                                                        paxData_7.monetaryEmailStatus = true;
                                                        paxData_7.isEmailParitallySent = true;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    _this.CompPaxList.push(paxData_7);
                                    _this.CompPaxListIssued.push(paxData_7);
                                    paxData_7.monetaryPrintStatus = compData.monetaryPrintStatus;
                                    compData.Compensations.forEach(function (newcompData, Index) {
                                        if (newcompData.Emds) {
                                            if (newcompData.CompTypeText == "Hotel") {
                                                compData.hotel = newcompData.Emds.filter(function (m) { return m.PrintStatus == "n"; }).length;
                                                compData.hotelPrintStatus = false;
                                            }
                                            if (newcompData.CompTypeText == "Meal") {
                                                compData.meal = newcompData.Emds.filter(function (m) { return m.PrintStatus == "n"; }).length;
                                                compData.mealPrintStatus = false;
                                            }
                                            if (newcompData.CompTypeText == "Transportation") {
                                                compData.transportation = newcompData.Emds.filter(function (m) { return m.PrintStatus == "n"; }).length;
                                                compData.transportPrintStatus = false;
                                            }
                                        }
                                    });
                                    if (compData.isEmailSent == true) {
                                        compData.Compensations.forEach(function (exiEMD, exiIndex) {
                                            if (exiEMD.Emds) {
                                                exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                                    if (emdData.EmailStatus == "n") {
                                                        compData.isEmailSent = true;
                                                        compData.monetaryEmailStatus = true;
                                                        compData.isEmailParitallySent = true;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    _this.CompPaxListNotIssued.push(compData);
                                }
                                else {
                                    console.log("Not Printed" + compData.FullName);
                                    if (compData.isEmailSent == true) {
                                        compData.Compensations.forEach(function (exiEMD, exiIndex) {
                                            if (exiEMD.Emds) {
                                                exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                                    if (emdData.EmailStatus == "n") {
                                                        compData.isEmailSent = true;
                                                        compData.monetaryEmailStatus = true;
                                                        compData.isEmailParitallySent = true;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    _this.CompPaxListNotIssued.push(compData);
                                }
                            }
                            else {
                                console.log("Printed" + compData.FullName);
                                if (compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds) {
                                    compData.monetarycount = compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds.length;
                                }
                                else {
                                    compData.monetarycount = 0;
                                }
                                if (compData.isEmailSent == true) {
                                    compData.Compensations.forEach(function (exiEMD, exiIndex) {
                                        if (exiEMD.Emds) {
                                            exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                                if (emdData.EmailStatus == "n") {
                                                    compData.isEmailSent = true;
                                                    compData.monetaryEmailStatus = true;
                                                    compData.isEmailParitallySent = true;
                                                }
                                            });
                                        }
                                    });
                                }
                                _this.CompPaxListIssued.push(compData);
                                if (compData.monetary > 0) {
                                    console.log("Printed monetary > 0" + compData.FullName);
                                    var paxData_8 = new index_1.CompensationSearchModule.CompensationPassengerList();
                                    paxData_8.FlightSegmentId = compData.FlightSegmentId;
                                    paxData_8.PassengerSeq = compData.PassengerSeq;
                                    paxData_8.OrderId = compData.OrderId;
                                    paxData_8.GivenName = compData.GivenName;
                                    paxData_8.LastName = compData.LastName;
                                    paxData_8.FullName = compData.LastName + "/" + compData.GivenName;
                                    paxData_8.PaxType = compData.PaxType;
                                    paxData_8.FqtvCc = compData.FqtvCc;
                                    paxData_8.FqtvNumber = compData.FqtvNumber;
                                    paxData_8.PaxStatus = compData.PaxStatus;
                                    paxData_8.PaxEmailAddress = compData.PaxEmailAddress;
                                    paxData_8.CompensationReasonId = compData.CompensationReasonId;
                                    paxData_8.IsExistingCompensation = compData.IsExistingCompensation;
                                    paxData_8.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                                    paxData_8.WorldTracerNum = compData.WorldTracerNum;
                                    paxData_8.UpdateLockNbr = compData.UpdateLockNbr;
                                    paxData_8.FqtvTier = compData.FqtvTier;
                                    paxData_8.Cabin = compData.Cabin;
                                    paxData_8.PaxRPH = compData.PaxRPH;
                                    paxData_8.Origin = compData.Origin;
                                    paxData_8.Dest = compData.Dest;
                                    paxData_8.IsCompensationIssued = compData.IsCompensationIssued;
                                    paxData_8.SSR = compData.SSR;
                                    paxData_8.Etkt = compData.Etkt;
                                    paxData_8.ReaccomDetails = compData.ReaccomDetails;
                                    paxData_8.AdditionalDetails = compData.AdditionalDetails;
                                    paxData_8.monetary = compData.monetary;
                                    paxData_8.monetaryPrintStatus = compData.monetaryPrintStatus;
                                    paxData_8.Compensations = compData.Compensations;
                                    paxData_8.ExistingCompensations = compData.ExistingCompensations;
                                    paxData_8.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                                    paxData_8.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                                    paxData_8.mealendorsementTextItems = compData.mealendorsementTextItems;
                                    paxData_8.mealFreeText = compData.mealFreeText;
                                    paxData_8.mealDetails = compData.mealDetails;
                                    paxData_8.MealOverrideReason = compData.MealOverrideReason;
                                    paxData_8.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                                    paxData_8.hotelFreeText = compData.hotelFreeText;
                                    paxData_8.HotelOverrideReason = compData.HotelOverrideReason;
                                    paxData_8.hotelDetails = compData.hotelDetails;
                                    paxData_8.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                                    paxData_8.transportFreeText = compData.transportFreeText;
                                    paxData_8.transportEMD = compData.transportEMD;
                                    paxData_8.TransportOverrideReason = compData.TransportOverrideReason;
                                    paxData_8.monetaryEmailStatus = compData.monetaryEmailStatus;
                                    paxData_8.hotel = 0;
                                    paxData_8.hotelPrintStatus = false;
                                    paxData_8.meal = 0;
                                    paxData_8.mealPrintStatus = false;
                                    paxData_8.transportation = 0;
                                    paxData_8.transportPrintStatus = false;
                                    paxData_8.Email = compData.Email;
                                    paxData_8.isEmailSent = compData.isEmailSent;
                                    paxData_8.isParitallyPrinted = compData.isParitallyPrinted;
                                    if (paxData_8.isParitallyPrinted) {
                                        paxData_8.monetaryPrintStatus = true;
                                    }
                                    if (compData.isEmailSent == true) {
                                        compData.Compensations.forEach(function (exiEMD, exiIndex) {
                                            if (exiEMD.Emds) {
                                                exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                                    if (emdData.EmailStatus == "n") {
                                                        paxData_8.isEmailSent = true;
                                                        paxData_8.monetaryEmailStatus = true;
                                                        paxData_8.isEmailParitallySent = true;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    paxData_8.monetarycount = compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds.length;
                                    _this.CompPaxList.push(paxData_8);
                                    _this.CompPaxListNotIssued.push(paxData_8);
                                }
                            }
                            if (compData.isEmailSent == true && compData.isNotPrinted == true && compData.isParitallyPrinted == false) {
                                console.log("isEmailSent && isNotPrinted" + compData.FullName);
                                var paxData_9 = new index_1.CompensationSearchModule.CompensationPassengerList();
                                paxData_9.isEmailSent = compData.isEmailSent;
                                paxData_9.monetaryEmailStatus = compData.monetaryEmailStatus;
                                compData.Compensations.forEach(function (exiEMD, exiIndex) {
                                    if (exiEMD.Emds) {
                                        exiEMD.Emds.forEach(function (emdData, emdIndex) {
                                            if (emdData.EmailStatus == "n") {
                                                paxData_9.isEmailSent = true;
                                                paxData_9.monetaryEmailStatus = true;
                                                paxData_9.isEmailParitallySent = true;
                                            }
                                        });
                                    }
                                });
                                paxData_9.FlightSegmentId = compData.FlightSegmentId;
                                paxData_9.PassengerSeq = compData.PassengerSeq;
                                paxData_9.OrderId = compData.OrderId;
                                paxData_9.GivenName = compData.GivenName;
                                paxData_9.LastName = compData.LastName;
                                paxData_9.FullName = compData.LastName + "/" + compData.GivenName;
                                paxData_9.PaxType = compData.PaxType;
                                paxData_9.FqtvCc = compData.FqtvCc;
                                paxData_9.FqtvNumber = compData.FqtvNumber;
                                paxData_9.PaxStatus = compData.PaxStatus;
                                paxData_9.PaxEmailAddress = compData.PaxEmailAddress;
                                paxData_9.CompensationReasonId = compData.CompensationReasonId;
                                paxData_9.IsExistingCompensation = compData.IsExistingCompensation;
                                paxData_9.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                                paxData_9.WorldTracerNum = compData.WorldTracerNum;
                                paxData_9.UpdateLockNbr = compData.UpdateLockNbr;
                                paxData_9.FqtvTier = compData.FqtvTier;
                                paxData_9.Cabin = compData.Cabin;
                                paxData_9.PaxRPH = compData.PaxRPH;
                                paxData_9.Origin = compData.Origin;
                                paxData_9.Dest = compData.Dest;
                                paxData_9.IsCompensationIssued = compData.IsCompensationIssued;
                                paxData_9.SSR = compData.SSR;
                                paxData_9.Etkt = compData.Etkt;
                                paxData_9.ReaccomDetails = compData.ReaccomDetails;
                                paxData_9.AdditionalDetails = compData.AdditionalDetails;
                                paxData_9.monetary = compData.monetary;
                                paxData_9.monetaryPrintStatus = compData.monetaryPrintStatus;
                                paxData_9.Compensations = compData.Compensations;
                                paxData_9.ExistingCompensations = compData.ExistingCompensations;
                                paxData_9.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                                paxData_9.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                                paxData_9.mealendorsementTextItems = compData.mealendorsementTextItems;
                                paxData_9.mealFreeText = compData.mealFreeText;
                                paxData_9.mealDetails = compData.mealDetails;
                                paxData_9.MealOverrideReason = compData.MealOverrideReason;
                                paxData_9.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                                paxData_9.hotelFreeText = compData.hotelFreeText;
                                paxData_9.HotelOverrideReason = compData.HotelOverrideReason;
                                paxData_9.hotelDetails = compData.hotelDetails;
                                paxData_9.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                                paxData_9.transportFreeText = compData.transportFreeText;
                                paxData_9.transportEMD = compData.transportEMD;
                                paxData_9.TransportOverrideReason = compData.TransportOverrideReason;
                                // paxData.monetaryEmailStatus = compData.monetaryEmailStatus;
                                paxData_9.hotel = 0;
                                paxData_9.hotelPrintStatus = false;
                                paxData_9.meal = 0;
                                paxData_9.mealPrintStatus = false;
                                paxData_9.transportation = 0;
                                paxData_9.transportPrintStatus = false;
                                paxData_9.Email = compData.Email;
                                paxData_9.isParitallyPrinted = compData.isParitallyPrinted;
                                paxData_9.monetarycount = compData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].Emds.length;
                                console.log("Email :" + JSON.stringify(paxData_9));
                                _this.CompPaxList.push(paxData_9);
                                _this.CompPaxListIssued.push(paxData_9);
                            }
                        });
                        _this.apisdetails = [];
                        _this.firsttab.title = "EMD Printed" + "(" + _this.CompPaxListIssued.length + ")";
                        _this.apisdetails.push(_this.firsttab);
                        _this.ComPaxPrintFullList = _this.CompPaxListIssued;
                        _this.ComPaxNotPrintFullList = _this.CompPaxListNotIssued;
                        _this.secondtab.title = "EMD Available for Print" + "(" + _this.CompPaxListNotIssued.length + ")";
                        _this.apisdetails.push(_this.secondtab);
                        _this.loaderProgress.hideLoader();
                        var e = { eventName: "selectedIndexChanged", newIndex: 0, oldIndex: -1 };
                        _this.selectSegment(e);
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
    CompensationPrintScreenComponent.prototype.displayProductActionDialogForPrinter = function () {
        var hostedcheck = ApplicationSettings.getBoolean("isHostBoarding");
        if (hostedcheck) {
            this.printEMD();
        }
        else {
            this.bluetoothEMD();
        }
    };
    CompensationPrintScreenComponent.prototype.bluetoothEMD = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var startDate = new Date();
            var CurDate = moment(startDate).format("YYYY-MM-DD");
            console.log(CurDate);
            this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
            var EmailCompensationStructure = index_4.Converters.convertToBluetoothPrintEMDCompensation(this.SelectedPassenger, this.FlightHeaderInfo);
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
                                                    var SaveComptemplate = index_4.Converters.convertToSaveCompensationTemplateForPrint(self_1.SelectedPassenger, self_1.FlightHeaderInfo);
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
                                                    Toast.makeText(CompensationPrintScreenComponent_1.UNABLETOPRINT).show();
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
                                        Toast.makeText(CompensationPrintScreenComponent_1.PRINTERSESSION).show();
                                        self_1.loaderProgress.hideLoader();
                                        console.log(err);
                                    });
                                }
                                else {
                                    Toast.makeText(CompensationPrintScreenComponent_1.NOBLUETOOTHDEVICE).show();
                                    _this.loaderProgress.hideLoader();
                                }
                            }
                            catch (e) {
                                Toast.makeText(CompensationPrintScreenComponent_1.UNABLETOPRINT).show();
                                _this.loaderProgress.hideLoader();
                            }
                        }
                        else {
                            Toast.makeText(CompensationPrintScreenComponent_1.UNABLETOPRINT).show();
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
    CompensationPrintScreenComponent.prototype.getPrinter = function () {
        if (ApplicationSettings.hasKey("printer")) {
            return ApplicationSettings.getString("printer");
        }
        else {
            return "";
        }
    };
    CompensationPrintScreenComponent.prototype.displayProductActionDialogForSmartFilter = function () {
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
    CompensationPrintScreenComponent.prototype.printEMD = function () {
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
                var EmailCompensationStructure = index_4.Converters.convertToPrintEMDCompensation(this.SelectedPassenger, this.FlightHeaderInfo);
                console.log("Email Req:" + JSON.stringify(EmailCompensationStructure));
                if (EmailCompensationStructure.Passengers != []) {
                    this._service.printEMDCompensationService(EmailCompensationStructure).subscribe(function (data) {
                        console.log("Email Res:" + JSON.stringify(data));
                        if (data.Success) {
                            _this.loaderProgress.hideLoader();
                            Toast.makeText("Printed successfully").show();
                            _this.getCompensationList(_this.FlightHeaderInfo.DepartureDate, _this.FlightHeaderInfo.FlightNumber, _this.SelectedPassenger[0].Origin, "ReasonWiseGet");
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
    CompensationPrintScreenComponent.prototype.navigatetoadditionaldetails = function (Paxitem) {
        console.log("V" + Paxitem);
        if (Paxitem.IsSelected) {
            var prePage = "PrintList";
            this.routerExtensions.navigate(["compensationadditionaldetails"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                }, queryParams: {
                    "data": JSON.stringify(Paxitem),
                    "prepage": prePage,
                }
            });
        }
    };
    CompensationPrintScreenComponent.prototype.displaySSRs = function (item) {
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
    CompensationPrintScreenComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationPrintScreenComponent.prototype.navigateToSearch = function () {
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
    CompensationPrintScreenComponent.prototype.navigateToDepartures = function () {
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
    CompensationPrintScreenComponent.prototype.navigateToCompensation = function () {
        this.routerExtensions.navigate(["compensation"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationPrintScreenComponent.prototype.handleServiceError = function (error) {
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
    var CompensationPrintScreenComponent_1;
    CompensationPrintScreenComponent.NOBLUETOOTHDEVICE = "No Bluetooth Printer Found. Please set the Printer in Settings Page";
    CompensationPrintScreenComponent.UNABLETOPRINT = "Unable to Print";
    CompensationPrintScreenComponent.PRINTERSESSION = "Unable to connect to printer session, try again later";
    __decorate([
        core_1.ViewChild('pagecontainer'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationPrintScreenComponent.prototype, "pageCont", void 0);
    __decorate([
        core_1.ViewChild('segbar'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationPrintScreenComponent.prototype, "segbar", void 0);
    CompensationPrintScreenComponent = CompensationPrintScreenComponent_1 = __decorate([
        core_1.Component({
            selector: "compensation-printscreen",
            providers: [index_2.DataService, index_2.PassengerService, app_constants_1.Configuration, index_2.CompensationService],
            templateUrl: "./components/compensation-printscreen/compensation-printscreen.component.html",
            styleUrls: ["./components/compensation-printscreen/compensation-printscreen.component.css"]
        }),
        __metadata("design:paramtypes", [app_constants_1.Configuration, index_2.PassengerService, router_1.ActivatedRoute, index_2.CheckinOrderService, page_1.Page, router_2.RouterExtensions, timeOut_service_1.TimeOutService, router_1.Router, index_2.DataService, index_2.CompensationService, router_1.ActivatedRoute, core_1.ViewContainerRef, modal_dialog_1.ModalDialogService])
    ], CompensationPrintScreenComponent);
    return CompensationPrintScreenComponent;
}());
exports.CompensationPrintScreenComponent = CompensationPrintScreenComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGVuc2F0aW9uLXByaW50c2NyZWVuLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbXBlbnNhdGlvbi1wcmludHNjcmVlbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsc0NBQTJGO0FBQzNGLDBDQUEyRTtBQUUzRSxzREFBK0Q7QUFDL0Qsa0VBQTJGO0FBQzNGLGdDQUErQjtBQUMvQixvQ0FBdUM7QUFNdkMsa0RBQWtFO0FBQ2xFLDBDQUE0QztBQUM1QyxnQ0FBa0M7QUFFbEMsOEJBQThCO0FBQzlCLDBEQUE0RDtBQUM1RCwrQkFBaUM7QUFDakMsMENBQTRDO0FBQzVDLGdEQUFrRDtBQUVsRCxnQkFBZ0I7QUFDaEIsc0RBQTJLO0FBQzNLLHFEQUFzSDtBQUN0SCxrREFBcU07QUFDck0sa0RBQXNEO0FBRXRELHFEQUFvRDtBQUNwRCw2REFBMkQ7QUFHM0QseUVBQXVFO0FBV3ZFO0lBeURJLDBDQUFvQixjQUE2QixFQUFVLFNBQTJCLEVBQVUsZUFBK0IsRUFBVSxPQUE0QixFQUFVLElBQVUsRUFBVSxnQkFBa0MsRUFBUyxlQUErQixFQUFVLE1BQWMsRUFBUyxZQUF5QixFQUFTLFFBQTZCLEVBQVUsS0FBcUIsRUFBVSxLQUF1QixFQUFVLGFBQWlDO1FBQXBjLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFxQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQVMsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBcUI7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFnQjtR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QUM1QjtRQUFwQixnQkFBUyxDQUFDLFFBQVEsQ0FBQztrQ0FBUyxpQkFBVTtvRUFBQztJQUYvQixnQ0FBZ0M7UUFSNUMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSwwQkFBMEI7WUFDcEMsU0FBUyxFQUFFLENBQUMsbUJBQVcsRUFBRSx3QkFBZ0IsRUFBRSw2QkFBYSxFQUFFLDJCQUFtQixDQUFDO1lBQzlFLFdBQVcsRUFBRSwrRUFBK0U7WUFDNUYsU0FBUyxFQUFFLENBQUMsOEVBQThFLENBQUM7U0FFOUYsQ0FBQzt5Q0EyRHNDLDZCQUFhLEVBQXFCLHdCQUFnQixFQUEyQix1QkFBYyxFQUFtQiwyQkFBbUIsRUFBZ0IsV0FBSSxFQUE0Qix5QkFBZ0IsRUFBMEIsZ0NBQWMsRUFBa0IsZUFBTSxFQUF1QixtQkFBVyxFQUFtQiwyQkFBbUIsRUFBaUIsdUJBQWMsRUFBaUIsdUJBQWdCLEVBQXlCLGlDQUFrQjtPQXpEL2MsZ0NBQWdDLENBb3NFNUM7SUFBRCx1Q0FBQztDQUFBLEFBcHNFRCxJQW9zRUM7QUFwc0VZLDRFQUFnQyIsInNvdXJjZXNDb250ZW50IjpbIi8vYW5ndWxhciAmIG5hdGl2ZXNjcmlwdCByZWZlcmVuY2VzXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvbkV4dHJhcywgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgTW9kYWxEaWFsb2dTZXJ2aWNlLCBNb2RhbERpYWxvZ09wdGlvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcbmltcG9ydCBkaWFsb2dzID0gcmVxdWlyZShcInVpL2RpYWxvZ3NcIik7XG5pbXBvcnQgeyBTY3JvbGxWaWV3IH0gZnJvbSBcInVpL3Njcm9sbC12aWV3XCI7XG5pbXBvcnQgeyBMaXN0VmlldyB9IGZyb20gXCJ1aS9saXN0LXZpZXdcIjtcbmltcG9ydCB7IFZpZXcgfSBmcm9tIFwidWkvY29yZS92aWV3XCI7XG5pbXBvcnQgdGV4dEZpZWxkID0gcmVxdWlyZShcInVpL3RleHQtZmllbGRcIik7XG5pbXBvcnQgKiBhcyBnZXN0dXJlcyBmcm9tIFwidWkvZ2VzdHVyZXNcIjtcbmltcG9ydCB7IFNlZ21lbnRlZEJhciwgU2VnbWVudGVkQmFySXRlbSB9IGZyb20gXCJ1aS9zZWdtZW50ZWQtYmFyXCI7XG5pbXBvcnQgKiBhcyBpbWFnZU1vZHVsZSBmcm9tIFwiaW1hZ2Utc291cmNlXCI7XG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZmlsZS1zeXN0ZW1cIjtcblxuLy9leHRlcm5hbCBtb2R1bGVzIGFuZCBwbHVnaW5zXG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcbmltcG9ydCAqIGFzIFRvYXN0IGZyb20gJ25hdGl2ZXNjcmlwdC10b2FzdCc7XG5pbXBvcnQgKiBhcyB6ZWJyYSBmcm9tIFwibmF0aXZlc2NyaXB0LXByaW50LXplYnJhXCI7XG5cbi8vYXBwIHJlZmVyZW5jZXNcbmltcG9ydCB7IExvYWRlclByb2dyZXNzLCBQYXNzZW5nZXJMaXN0VGVtcGxhdGUsIFBhc3Nlbmdlckxpc3QsIEFjY29udFByb2ZpbGVNb2RlbCwgQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLCBDb21wZW5zYXRpb25SZWFzb25Nb2R1bGUgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2ludGVyZmFjZS9pbmRleFwiXG5pbXBvcnQgeyBEYXRhU2VydmljZSwgQ2hlY2tpbk9yZGVyU2VydmljZSwgUGFzc2VuZ2VyU2VydmljZSwgQ29tcGVuc2F0aW9uU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvaW5kZXhcIjtcbmltcG9ydCB7IE9yZGVyLCBDb3VudHJ5Q29sbGVjdGlvbiwgRmxpZ2h0U2VydmljZUluZm8sIEZsaWdodCwgU2VhcmNoLCBBY2NvdW50UHJvZmlsZSwgQVBJU0RvY3VtZW50LCBDb21wYW5zYXRpb24sIENvbXBlbnNhdGlvblBheExpc3QsIEFnZW50UHJpdmlsYWdlLCBQcmludE1vZHVsZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbW9kZWwvaW5kZXhcIjtcbmltcG9ydCB7IENvbnZlcnRlcnMgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3V0aWxzL2luZGV4XCI7XG5pbXBvcnQgeyBEYXRlUGlja2VyTW9kYWwsIERhdGVQaWNrZXRDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXItbW9kYWxcIjtcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi8uLi9hcHAuY29uc3RhbnRzJztcbmltcG9ydCB7IEFwcEV4ZWN1dGlvbnRpbWUgfSBmcm9tIFwiLi4vLi4vYXBwLmV4ZWN1dGlvbnRpbWVcIjtcbmltcG9ydCB7IGlzQW5kcm9pZCwgaXNJT1MsIGRldmljZSwgc2NyZWVuIH0gZnJvbSBcInBsYXRmb3JtXCI7XG5pbXBvcnQgeyBGUVRWIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9tb2RlbC9pbmRleFwiXG5pbXBvcnQgeyBUaW1lT3V0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvdGltZU91dC5zZXJ2aWNlXCI7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwiY29tcGVuc2F0aW9uLXByaW50c2NyZWVuXCIsXG4gICAgcHJvdmlkZXJzOiBbRGF0YVNlcnZpY2UsIFBhc3NlbmdlclNlcnZpY2UsIENvbmZpZ3VyYXRpb24sIENvbXBlbnNhdGlvblNlcnZpY2VdLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vY29tcG9uZW50cy9jb21wZW5zYXRpb24tcHJpbnRzY3JlZW4vY29tcGVuc2F0aW9uLXByaW50c2NyZWVuLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL2NvbXBvbmVudHMvY29tcGVuc2F0aW9uLXByaW50c2NyZWVuL2NvbXBlbnNhdGlvbi1wcmludHNjcmVlbi5jb21wb25lbnQuY3NzXCJdXG5cbn0pXG5cbmV4cG9ydCBjbGFzcyBDb21wZW5zYXRpb25QcmludFNjcmVlbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgQFZpZXdDaGlsZCgncGFnZWNvbnRhaW5lcicpIHBhZ2VDb250OiBFbGVtZW50UmVmO1xuICAgIEBWaWV3Q2hpbGQoJ3NlZ2JhcicpIHNlZ2JhcjogRWxlbWVudFJlZjtcbiAgICBwdWJsaWMgYXBpc2RldGFpbHM6IEFycmF5PFNlZ21lbnRlZEJhckl0ZW0+O1xuICAgIHB1YmxpYyBmaXJzdHRhYiA9IG5ldyBTZWdtZW50ZWRCYXJJdGVtKCk7XG4gICAgcHVibGljIHNlY29uZHRhYiA9IG5ldyBTZWdtZW50ZWRCYXJJdGVtKCk7XG4gICAgcHVibGljIGlzRXJyb3I6IGJvb2xlYW47XG4gICAgcHVibGljIGVycm9yTWVzc2FnZTogc3RyaW5nO1xuICAgIHB1YmxpYyBsb2FkZXJQcm9ncmVzczogTG9hZGVyUHJvZ3Jlc3M7XG4gICAgcHVibGljIHN0YXJ0RGF0ZTogRGF0ZTtcbiAgICBwdWJsaWMgU2VhcmNoRmllbGRzOiBTZWFyY2ggPSBuZXcgU2VhcmNoKCk7XG4gICAgcHVibGljIEN1ckRhdGU6IERhdGU7XG4gICAgcHVibGljIHVzZXJkZXRhaWxzOiBhbnk7XG4gICAgcHVibGljIENvbWVuc2F0aW9uUmVhc29uOiBhbnk7XG4gICAgcHVibGljIENvbXBlbnNhdGlvblJlYXNvbjogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgIHB1YmxpYyBTZWxlY3RBbGxQYXg6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgU2VsZWN0QWxsUGF4VmFyOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGNoZWNrZWRDb3VudDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgRW1haWxJZDogYW55ID0gXCJcIjtcbiAgICBwdWJsaWMgRW1haWxJZFNlbGVjdGVkUGF4OiBhbnkgPSBcIlwiO1xuICAgIHB1YmxpYyBpc0VtYWlsQ29weXRvU2VsZWN0UGF4VHJ1ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBQcmV2aW91c1BhZ2U6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIHRvdGFsSXNzdWVkTW9uZXRhcnk6IG51bWJlciA9IDA7XG4gICAgcHVibGljIHRvdGFsSXNzdWVkSG90ZWw6IG51bWJlciA9IDA7XG4gICAgcHVibGljIHRvdGFsSXNzdWVkTWVhbDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgdG90YWxJc3N1ZWRUcmFuc3BvcnQ6IG51bWJlciA9IDA7XG4gICAgcHVibGljIHRvdGFsTm90SXNzdWVkTW9uZXRhcnk6IG51bWJlciA9IDA7XG4gICAgcHVibGljIHRvdGFsTm90SXNzdWVkSG90ZWw6IG51bWJlciA9IDA7XG4gICAgcHVibGljIHRvdGFsTm90SXNzdWVkTWVhbDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgdG90YWxOb3RJc3N1ZWRUcmFuc3BvcnQ6IG51bWJlciA9IDA7XG4gICAgcHVibGljIG5hbWVTb3J0SW5kaWNhdG9yOiBudW1iZXIgPSAtMTtcbiAgICBwdWJsaWMgc3NyU29ydEluZGljYXRvcjogbnVtYmVyID0gLTE7XG4gICAgcHVibGljIFRvdGFsUGFzc2VuZ2VyQ291bnQ6IG51bWJlciA9IDA7XG4gICAgcHVibGljIHNlbGVjdGVkUGFzc2VuZ2VyQ291bnQ6IG51bWJlciA9IDA7XG4gICAgcHVibGljIGlzRW1haWxFbmFibGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGNsYXNzU29ydEluZGljYXRvcjogbnVtYmVyID0gLTE7XG4gICAgcHVibGljIG9yZGVySWRTb3J0SW5kaWNhdG9yOiBudW1iZXIgPSAtMTtcbiAgICBwdWJsaWMgU2VhcmNoQ3JpdGVyaWE6IGFueSA9IFwiTmFtZVwiO1xuICAgIHB1YmxpYyB0aWVyU29ydEluZGljYXRvcjogbnVtYmVyID0gLTE7XG4gICAgcHVibGljIENvbXBlbnNhdGlvbklzc3VlZExpc3Q6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25Ob3RJc3N1ZWRMaXN0OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzRW1haWxOb3RBdmFpbGFibGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgaXNDaGVja2luRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgaXNHYXRlRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgc2VhcmNoRmllbGQ6IGFueTtcbiAgICBwdWJsaWMgc2VsZWN0ZWRQYXNzZW5nZXI6IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBTZWxlY3RlZFBhc3NlbmdlcjogQXJyYXk8Q29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q+ID0gW107XG4gICAgcHVibGljIENvbVBheFByaW50RnVsbExpc3Q6IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBDb21QYXhOb3RQcmludEZ1bGxMaXN0OiBBcnJheTxDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdD4gPSBbXTtcbiAgICBwdWJsaWMgRmxpZ2h0SGVhZGVySW5mbzogQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkZsaWdodE1vZGVsID0gbmV3IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5GbGlnaHRNb2RlbCgpO1xuICAgIHB1YmxpYyBQYXhMaXN0OiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUm9vdE9iamVjdCA9IG5ldyBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUm9vdE9iamVjdCgpO1xuICAgIHB1YmxpYyBDb21wUGF4TGlzdDogQXJyYXk8Q29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q+ID0gW107XG4gICAgcHVibGljIENvbXBQYXhMaXN0SXNzdWVkOiBBcnJheTxDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdD4gPSBbXTtcbiAgICBwdWJsaWMgQ29tcFBheExpc3ROb3RJc3N1ZWQ6IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBzdGF0aWMgTk9CTFVFVE9PVEhERVZJQ0U6IHN0cmluZyA9IFwiTm8gQmx1ZXRvb3RoIFByaW50ZXIgRm91bmQuIFBsZWFzZSBzZXQgdGhlIFByaW50ZXIgaW4gU2V0dGluZ3MgUGFnZVwiO1xuICAgIHB1YmxpYyBzdGF0aWMgVU5BQkxFVE9QUklOVDogc3RyaW5nID0gXCJVbmFibGUgdG8gUHJpbnRcIjtcbiAgICBwdWJsaWMgc3RhdGljIFBSSU5URVJTRVNTSU9OOiBzdHJpbmcgPSBcIlVuYWJsZSB0byBjb25uZWN0IHRvIHByaW50ZXIgc2Vzc2lvbiwgdHJ5IGFnYWluIGxhdGVyXCI7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbiwgcHJpdmF0ZSBfc2VydmljZXM6IFBhc3NlbmdlclNlcnZpY2UsIHByaXZhdGUgYWN0aXZhdGVkUm91dGVyOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSBfc2hhcmVkOiBDaGVja2luT3JkZXJTZXJ2aWNlLCBwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9ucywgcHVibGljIF90aW1lb3V0U2VydmljZTogVGltZU91dFNlcnZpY2UsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHB1YmxpYyBfZGF0YVNlcnZpY2U6IERhdGFTZXJ2aWNlLCBwdWJsaWMgX3NlcnZpY2U6IENvbXBlbnNhdGlvblNlcnZpY2UsIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLCBwcml2YXRlIHZjUmVmOiBWaWV3Q29udGFpbmVyUmVmLCBwcml2YXRlIF9tb2RhbFNlcnZpY2U6IE1vZGFsRGlhbG9nU2VydmljZSkge1xuICAgICAgICB0aGlzLmlzRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICB0aGlzLlNlYXJjaEZpZWxkcy5GbGlnaHREYXRlID0gbW9tZW50KCkuZm9ybWF0KFwiREQgTU1NTSBZWVlZXCIpO1xuICAgICAgICB0aGlzLkN1ckRhdGUgPSBtb21lbnQoKS50b0RhdGUoKTtcbiAgICAgICAgdGhpcy5zdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB0aGlzLmFwaXNkZXRhaWxzID0gW107XG5cbiAgICAgICAgdGhpcy5maXJzdHRhYi50aXRsZSA9IFwiRU1EIFByaW50ZWRcIjtcbiAgICAgICAgdGhpcy5hcGlzZGV0YWlscy5wdXNoKHRoaXMuZmlyc3R0YWIpO1xuXG4gICAgICAgIHRoaXMuc2Vjb25kdGFiLnRpdGxlID0gXCJFTUQgQXZhaWxhYmxlIGZvciBQcmludFwiO1xuICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5zZWNvbmR0YWIpO1xuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzID0gbmV3IExvYWRlclByb2dyZXNzKCk7XG4gICAgfVxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLnBhZ2Uuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJ34vaW1hZ2VzL2xvZ2luX2JhY2suanBlZycpXCI7XG4gICAgICAgIHRoaXMucGFnZS5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9IFwiY292ZXIgXCI7XG4gICAgICAgIHRoaXMuQ29tZW5zYXRpb25SZWFzb24gPSBcIlNlbGVjdCBSZWFzb25cIjtcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5pbml0TG9hZGVyKHRoaXMucGFnZUNvbnQpO1xuICAgICAgICB0aGlzLnVzZXJkZXRhaWxzID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VyZGV0YWlsc1wiLCBcIlwiKTtcbiAgICAgICAgdGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNoZWNraW5EaXNhYmxlZFwiKTtcbiAgICAgICAgdGhpcy5pc0dhdGVEaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImdhdGVEaXNhYmxlZFwiKTtcbiAgICAgICAgdGhpcy5QYXhMaXN0ID0gdGhpcy5fc2hhcmVkLmdldENvbXBlbnNhdGlvbkxpc3QoKTtcbiAgICAgICAgdGhpcy5Db21wUGF4TGlzdCA9IHRoaXMuUGF4TGlzdC5QYXNzZW5nZXJMaXN0LmZpbHRlcihtID0+IG0uSXNDb21wZW5zYXRpb25Jc3N1ZWQgPT0gdHJ1ZSk7XG4gICAgICAgIC8vIHRoaXMuQ29tcFBheExpc3QgPSB0aGlzLlBheExpc3QuUGFzc2VuZ2VyTGlzdDtcbiAgICAgICAgdGhpcy5fc2hhcmVkLnNldENvbXBlbnNhdGlvblBheExpc3QodGhpcy5Db21wUGF4TGlzdCk7XG4gICAgICAgIHRoaXMuX3NoYXJlZC5zZXRGbGlnaHRIZWFkZXJJbmZvKHRoaXMuUGF4TGlzdC5GbGlnaHRNb2RlbCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGF4IExpc3Q6XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLkNvbXBQYXhMaXN0KSk7XG4gICAgICAgIHRoaXMuRmxpZ2h0SGVhZGVySW5mbyA9IHRoaXMuUGF4TGlzdC5GbGlnaHRNb2RlbDtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZWRSb3V0ZXIucXVlcnlQYXJhbXMuc3Vic2NyaWJlKChwYXJhbXMpID0+IHtcbiAgICAgICAgICAgIGlmIChwYXJhbXNbXCJzZWxlY3RlZFBBeFwiXSAhPSBudWxsICYmXG4gICAgICAgICAgICAgICAgcGFyYW1zW1wic2VsZWN0ZWRQQXhcIl0gIT0gXCJcIiAmJlxuICAgICAgICAgICAgICAgIHBhcmFtc1tcInNlbGVjdGVkUEF4XCJdICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkUGFzc2VuZ2VyID0gSlNPTi5wYXJzZShwYXJhbXNbXCJzZWxlY3RlZFBBeFwiXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuYWN0aXZhdGVkUm91dGVyLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZSgocGFyYW1zKSA9PiB7XG4gICAgICAgICAgICBpZiAocGFyYW1zW1wicHJlcGFnZVwiXSAhPSBudWxsICYmXG4gICAgICAgICAgICAgICAgcGFyYW1zW1wicHJlcGFnZVwiXSAhPSBcIlwiICYmXG4gICAgICAgICAgICAgICAgcGFyYW1zW1wicHJlcGFnZVwiXSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5QcmV2aW91c1BhZ2UgPSBwYXJhbXNbXCJwcmVwYWdlXCJdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBjb25zb2xlLmRpcih0aGlzLnNlbGVjdGVkUGFzc2VuZ2VyKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJWOlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5QcmV2aW91c1BhZ2UpKTtcbiAgICAgICAgdGhpcy5Db21wUGF4TGlzdC5mb3JFYWNoKChjb21wRGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZm9yRWFjaCgoZXhpRU1ELCBleGlJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjb21wRGF0YS5Db21wZW5zYXRpb25zLmZpbHRlcihtID0+IG0uQ29tcFR5cGVUZXh0ID09IFwiTW9uZXRhcnlcIilbMF0uRW1kcykge1xuICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5tb25ldGFyeWNvdW50ID0gY29tcERhdGEuQ29tcGVuc2F0aW9ucy5maWx0ZXIobSA9PiBtLkNvbXBUeXBlVGV4dCA9PSBcIk1vbmV0YXJ5XCIpWzBdLkVtZHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcERhdGEubW9uZXRhcnljb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChleGlFTUQuRW1kcykge1xuICAgICAgICAgICAgICAgICAgICBleGlFTUQuRW1kcy5mb3JFYWNoKChlbWREYXRhLCBlbWRJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGV4aUVNRC5Db21wVHlwZVRleHQgIT0gXCJNb25ldGFyeVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1kRGF0YS5QcmludFN0YXR1cyA9PSBcIm5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmlzTm90UHJpbnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1kRGF0YS5FbWFpbFN0YXR1cyA9PSBcInlcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmlzRW1haWxTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaWYgKGNvbXBEYXRhLmlzTm90UHJpbnRlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29tcERhdGEuQ29tcGVuc2F0aW9ucy5mb3JFYWNoKChleGlFTUQsIGV4aUluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlFTUQuRW1kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhpRU1ELkVtZHMuZm9yRWFjaCgoZW1kRGF0YSwgZW1kSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1kRGF0YS5QcmludFN0YXR1cyA9PSBcInlcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5pc1Bhcml0YWxseVByaW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aUVNRC5Db21wVHlwZVRleHQgPT0gXCJNb25ldGFyeVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpRU1ELkVtZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGlFTUQuRW1kcy5mb3JFYWNoKChlbWREYXRhLCBlbWRJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1kRGF0YS5QcmludFN0YXR1cyA9PSBcInlcIiAmJiBleGlFTUQuRW1kcy5maWx0ZXIobSA9PiBtLlByaW50U3RhdHVzID09IFwieVwiKS5sZW5ndGggPCBleGlFTUQuRW1kcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV4aUVNRC5FbWRzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhleGlFTUQuRW1kcy5maWx0ZXIobSA9PiBtLlByaW50U3RhdHVzID09IFwieVwiKS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuaXNQYXJpdGFsbHlQcmludGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLm1vbmV0YXJ5UHJpbnRTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuaXNNb25ldGFyeVBhcml0YWxseVByaW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEubW9uZXRhcnljb3VudCA9IGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZmlsdGVyKG0gPT4gbS5Db21wVHlwZVRleHQgPT0gXCJNb25ldGFyeVwiKVswXS5FbWRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBEYXRhLmlzUGFyaXRhbGx5UHJpbnRlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaXNQYXJpdGFsbHlQcmludGVkIFByaW50ZWRcIiArIGNvbXBEYXRhLkZ1bGxOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBheERhdGEgPSBuZXcgQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5GbGlnaHRTZWdtZW50SWQgPSBjb21wRGF0YS5GbGlnaHRTZWdtZW50SWQ7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuUGFzc2VuZ2VyU2VxID0gY29tcERhdGEuUGFzc2VuZ2VyU2VxO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLk9yZGVySWQgPSBjb21wRGF0YS5PcmRlcklkO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkdpdmVuTmFtZSA9IGNvbXBEYXRhLkdpdmVuTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5MYXN0TmFtZSA9IGNvbXBEYXRhLkxhc3ROYW1lO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkZ1bGxOYW1lID0gY29tcERhdGEuTGFzdE5hbWUgKyBcIi9cIiArIGNvbXBEYXRhLkdpdmVuTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5QYXhUeXBlID0gY29tcERhdGEuUGF4VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5GcXR2Q2MgPSBjb21wRGF0YS5GcXR2Q2M7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuRnF0dk51bWJlciA9IGNvbXBEYXRhLkZxdHZOdW1iZXI7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuUGF4U3RhdHVzID0gY29tcERhdGEuUGF4U3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlBheEVtYWlsQWRkcmVzcyA9IGNvbXBEYXRhLlBheEVtYWlsQWRkcmVzcztcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5Db21wZW5zYXRpb25SZWFzb25JZCA9IGNvbXBEYXRhLkNvbXBlbnNhdGlvblJlYXNvbklkO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLklzRXhpc3RpbmdDb21wZW5zYXRpb24gPSBjb21wRGF0YS5Jc0V4aXN0aW5nQ29tcGVuc2F0aW9uO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkN1c3RvbWVyQ2FyZUNhc2VOdW0gPSBjb21wRGF0YS5DdXN0b21lckNhcmVDYXNlTnVtO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLldvcmxkVHJhY2VyTnVtID0gY29tcERhdGEuV29ybGRUcmFjZXJOdW07XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuVXBkYXRlTG9ja05iciA9IGNvbXBEYXRhLlVwZGF0ZUxvY2tOYnI7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuRnF0dlRpZXIgPSBjb21wRGF0YS5GcXR2VGllcjtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5DYWJpbiA9IGNvbXBEYXRhLkNhYmluO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlBheFJQSCA9IGNvbXBEYXRhLlBheFJQSDtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5PcmlnaW4gPSBjb21wRGF0YS5PcmlnaW47XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuRGVzdCA9IGNvbXBEYXRhLkRlc3Q7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuSXNDb21wZW5zYXRpb25Jc3N1ZWQgPSBjb21wRGF0YS5Jc0NvbXBlbnNhdGlvbklzc3VlZDtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5TU1IgPSBjb21wRGF0YS5TU1I7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuRXRrdCA9IGNvbXBEYXRhLkV0a3Q7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuUmVhY2NvbURldGFpbHMgPSBjb21wRGF0YS5SZWFjY29tRGV0YWlscztcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5BZGRpdGlvbmFsRGV0YWlscyA9IGNvbXBEYXRhLkFkZGl0aW9uYWxEZXRhaWxzO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5ID0gY29tcERhdGEubW9uZXRhcnk7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnlQcmludFN0YXR1cyA9IGNvbXBEYXRhLm1vbmV0YXJ5UHJpbnRTdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuQ29tcGVuc2F0aW9ucyA9IGNvbXBEYXRhLkNvbXBlbnNhdGlvbnM7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuRXhpc3RpbmdDb21wZW5zYXRpb25zID0gY29tcERhdGEuRXhpc3RpbmdDb21wZW5zYXRpb25zO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5ZW5kb3JzZW1lbnRUZXh0SXRlbXMgPSBjb21wRGF0YS5tb25ldGFyeWVuZG9yc2VtZW50VGV4dEl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLk1vbmV0YXJ5T3ZlcnJpZGVSZWFzb24gPSBjb21wRGF0YS5Nb25ldGFyeU92ZXJyaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWxlbmRvcnNlbWVudFRleHRJdGVtcyA9IGNvbXBEYXRhLm1lYWxlbmRvcnNlbWVudFRleHRJdGVtcztcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsRnJlZVRleHQgPSBjb21wRGF0YS5tZWFsRnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEubWVhbERldGFpbHMgPSBjb21wRGF0YS5tZWFsRGV0YWlscztcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5NZWFsT3ZlcnJpZGVSZWFzb24gPSBjb21wRGF0YS5NZWFsT3ZlcnJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWxlbmRvcnNlbWVudFRleHRJdGVtcyA9IGNvbXBEYXRhLmhvdGVsZW5kb3JzZW1lbnRUZXh0SXRlbXM7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWxGcmVlVGV4dCA9IGNvbXBEYXRhLmhvdGVsRnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuSG90ZWxPdmVycmlkZVJlYXNvbiA9IGNvbXBEYXRhLkhvdGVsT3ZlcnJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWxEZXRhaWxzID0gY29tcERhdGEuaG90ZWxEZXRhaWxzO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydGF0aW9uZW5kb3JzZW1lbnRUZXh0SXRlbXMgPSBjb21wRGF0YS50cmFuc3BvcnRhdGlvbmVuZG9yc2VtZW50VGV4dEl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydEZyZWVUZXh0ID0gY29tcERhdGEudHJhbnNwb3J0RnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEudHJhbnNwb3J0RU1EID0gY29tcERhdGEudHJhbnNwb3J0RU1EO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlRyYW5zcG9ydE92ZXJyaWRlUmVhc29uID0gY29tcERhdGEuVHJhbnNwb3J0T3ZlcnJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnlFbWFpbFN0YXR1cyA9IGNvbXBEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuRW1haWwgPSBjb21wRGF0YS5FbWFpbDtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5pc0VtYWlsU2VudCA9IGNvbXBEYXRhLmlzRW1haWxTZW50O1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzRW1haWxQYXJpdGFsbHlTZW50ID0gY29tcERhdGEuaXNFbWFpbFBhcml0YWxseVNlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV3IEluc2lkZTpcIiArIGNvbXBEYXRhLmlzUGFyaXRhbGx5UHJpbnRlZCk7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnlQcmludFN0YXR1cyA9IGNvbXBEYXRhLm1vbmV0YXJ5UHJpbnRTdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuaXNQYXJpdGFsbHlQcmludGVkID0gY29tcERhdGEuaXNQYXJpdGFsbHlQcmludGVkO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzTW9uZXRhcnlQYXJpdGFsbHlQcmludGVkID0gY29tcERhdGEuaXNNb25ldGFyeVBhcml0YWxseVByaW50ZWQ7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuaXNNZWFsUGFyaXRhbGx5UHJpbnRlZCA9IGNvbXBEYXRhLmlzTWVhbFBhcml0YWxseVByaW50ZWQ7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuaXNIb3RlbHNQYXJpdGFsbHlQcmludGVkID0gY29tcERhdGEuaXNIb3RlbHNQYXJpdGFsbHlQcmludGVkO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzVHJhbnNwb3J0UGFyaXRhbGx5UHJpbnRlZCA9IGNvbXBEYXRhLmlzVHJhbnNwb3J0UGFyaXRhbGx5UHJpbnRlZDtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeWNvdW50ID0gY29tcERhdGEubW9uZXRhcnljb3VudDtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYoY29tcERhdGEuQ29tcGVuc2F0aW9ucy5maWx0ZXIobSA9PiBtLkNvbXBUeXBlVGV4dCA9PSBcIk1vbmV0YXJ5XCIpWzBdLkVtZHMpe1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgcGF4RGF0YS5tb25ldGFyeWNvdW50ID0gY29tcERhdGEuQ29tcGVuc2F0aW9ucy5maWx0ZXIobSA9PiBtLkNvbXBUeXBlVGV4dCA9PSBcIk1vbmV0YXJ5XCIpWzBdLkVtZHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZm9yRWFjaCgobmV3Y29tcERhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Y29tcERhdGEuRW1kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdjb21wRGF0YS5Db21wVHlwZVRleHQgPT0gXCJIb3RlbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWwgPSBuZXdjb21wRGF0YS5FbWRzLmZpbHRlcihtID0+IG0uUHJpbnRTdGF0dXMgPT0gXCJ5XCIpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBheERhdGEuaG90ZWwgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmhvdGVsUHJpbnRTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdjb21wRGF0YS5Db21wVHlwZVRleHQgPT0gXCJNZWFsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsID0gbmV3Y29tcERhdGEuRW1kcy5maWx0ZXIobSA9PiBtLlByaW50U3RhdHVzID09IFwieVwiKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXhEYXRhLm1lYWwgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWxQcmludFN0YXR1cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGF4RGF0YS5tZWFsUHJpbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Y29tcERhdGEuQ29tcFR5cGVUZXh0ID09IFwiVHJhbnNwb3J0YXRpb25cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydGF0aW9uID0gbmV3Y29tcERhdGEuRW1kcy5maWx0ZXIobSA9PiBtLlByaW50U3RhdHVzID09IFwieVwiKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXhEYXRhLnRyYW5zcG9ydGF0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS50cmFuc3BvcnRQcmludFN0YXR1cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wRGF0YS5pc0VtYWlsU2VudCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5Db21wZW5zYXRpb25zLmZvckVhY2goKGV4aUVNRCwgZXhpSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpRU1ELkVtZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpRU1ELkVtZHMuZm9yRWFjaCgoZW1kRGF0YSwgZW1kSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWREYXRhLkVtYWlsU3RhdHVzID09IFwiblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5pc0VtYWlsU2VudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeUVtYWlsU3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzRW1haWxQYXJpdGFsbHlTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QucHVzaChwYXhEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZC5wdXNoKHBheERhdGEpO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5UHJpbnRTdGF0dXMgPSBjb21wRGF0YS5tb25ldGFyeVByaW50U3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5Db21wZW5zYXRpb25zLmZvckVhY2goKG5ld2NvbXBEYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld2NvbXBEYXRhLkVtZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Y29tcERhdGEuQ29tcFR5cGVUZXh0ID09IFwiSG90ZWxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5ob3RlbCA9IG5ld2NvbXBEYXRhLkVtZHMuZmlsdGVyKG0gPT4gbS5QcmludFN0YXR1cyA9PSBcIm5cIikubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5ob3RlbFByaW50U3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdjb21wRGF0YS5Db21wVHlwZVRleHQgPT0gXCJNZWFsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEubWVhbCA9IG5ld2NvbXBEYXRhLkVtZHMuZmlsdGVyKG0gPT4gbS5QcmludFN0YXR1cyA9PSBcIm5cIikubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5tZWFsUHJpbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld2NvbXBEYXRhLkNvbXBUeXBlVGV4dCA9PSBcIlRyYW5zcG9ydGF0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEudHJhbnNwb3J0YXRpb24gPSBuZXdjb21wRGF0YS5FbWRzLmZpbHRlcihtID0+IG0uUHJpbnRTdGF0dXMgPT0gXCJuXCIpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEudHJhbnNwb3J0UHJpbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wRGF0YS5pc0VtYWlsU2VudCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5Db21wZW5zYXRpb25zLmZvckVhY2goKGV4aUVNRCwgZXhpSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpRU1ELkVtZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpRU1ELkVtZHMuZm9yRWFjaCgoZW1kRGF0YSwgZW1kSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWREYXRhLkVtYWlsU3RhdHVzID09IFwiblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuaXNFbWFpbFNlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmlzRW1haWxQYXJpdGFsbHlTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQucHVzaChjb21wRGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgUHJpbnRlZFwiICsgY29tcERhdGEuRnVsbE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcERhdGEuaXNFbWFpbFNlbnQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuQ29tcGVuc2F0aW9ucy5mb3JFYWNoKChleGlFTUQsIGV4aUluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aUVNRC5FbWRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4aUVNRC5FbWRzLmZvckVhY2goKGVtZERhdGEsIGVtZEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1kRGF0YS5FbWFpbFN0YXR1cyA9PSBcIm5cIiAmJiBleGlFTUQuRW1kcy5maWx0ZXIobSA9PiBtLkVtYWlsU3RhdHVzID09IFwieVwiKS5sZW5ndGggPCBleGlFTUQuRW1kcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImluIGhlcmVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuaXNFbWFpbFNlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmlzRW1haWxQYXJpdGFsbHlTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQucHVzaChjb21wRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJpbnRlZFwiICsgY29tcERhdGEuRnVsbE5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChjb21wRGF0YS5Db21wZW5zYXRpb25zLmZpbHRlcihtID0+IG0uQ29tcFR5cGVUZXh0ID09IFwiTW9uZXRhcnlcIilbMF0uRW1kcykge1xuICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5tb25ldGFyeWNvdW50ID0gY29tcERhdGEuQ29tcGVuc2F0aW9ucy5maWx0ZXIobSA9PiBtLkNvbXBUeXBlVGV4dCA9PSBcIk1vbmV0YXJ5XCIpWzBdLkVtZHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcERhdGEubW9uZXRhcnljb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjb21wRGF0YS5pc0VtYWlsU2VudCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZm9yRWFjaCgoZXhpRU1ELCBleGlJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aUVNRC5FbWRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpRU1ELkVtZHMuZm9yRWFjaCgoZW1kRGF0YSwgZW1kSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtZERhdGEuRW1haWxTdGF0dXMgPT0gXCJuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmlzRW1haWxTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuaXNFbWFpbFBhcml0YWxseVNlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZC5wdXNoKGNvbXBEYXRhKTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcERhdGEubW9uZXRhcnkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJpbnRlZCBtb25ldGFyeSA+IDBcIiArIGNvbXBEYXRhLkZ1bGxOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBheERhdGEgPSBuZXcgQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5GbGlnaHRTZWdtZW50SWQgPSBjb21wRGF0YS5GbGlnaHRTZWdtZW50SWQ7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuUGFzc2VuZ2VyU2VxID0gY29tcERhdGEuUGFzc2VuZ2VyU2VxO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLk9yZGVySWQgPSBjb21wRGF0YS5PcmRlcklkO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkdpdmVuTmFtZSA9IGNvbXBEYXRhLkdpdmVuTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5MYXN0TmFtZSA9IGNvbXBEYXRhLkxhc3ROYW1lO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkZ1bGxOYW1lID0gY29tcERhdGEuTGFzdE5hbWUgKyBcIi9cIiArIGNvbXBEYXRhLkdpdmVuTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5QYXhUeXBlID0gY29tcERhdGEuUGF4VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5GcXR2Q2MgPSBjb21wRGF0YS5GcXR2Q2M7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuRnF0dk51bWJlciA9IGNvbXBEYXRhLkZxdHZOdW1iZXI7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuUGF4U3RhdHVzID0gY29tcERhdGEuUGF4U3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlBheEVtYWlsQWRkcmVzcyA9IGNvbXBEYXRhLlBheEVtYWlsQWRkcmVzcztcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5Db21wZW5zYXRpb25SZWFzb25JZCA9IGNvbXBEYXRhLkNvbXBlbnNhdGlvblJlYXNvbklkO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLklzRXhpc3RpbmdDb21wZW5zYXRpb24gPSBjb21wRGF0YS5Jc0V4aXN0aW5nQ29tcGVuc2F0aW9uO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkN1c3RvbWVyQ2FyZUNhc2VOdW0gPSBjb21wRGF0YS5DdXN0b21lckNhcmVDYXNlTnVtO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLldvcmxkVHJhY2VyTnVtID0gY29tcERhdGEuV29ybGRUcmFjZXJOdW07XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuVXBkYXRlTG9ja05iciA9IGNvbXBEYXRhLlVwZGF0ZUxvY2tOYnI7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuRnF0dlRpZXIgPSBjb21wRGF0YS5GcXR2VGllcjtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5DYWJpbiA9IGNvbXBEYXRhLkNhYmluO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlBheFJQSCA9IGNvbXBEYXRhLlBheFJQSDtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5PcmlnaW4gPSBjb21wRGF0YS5PcmlnaW47XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuRGVzdCA9IGNvbXBEYXRhLkRlc3Q7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuSXNDb21wZW5zYXRpb25Jc3N1ZWQgPSBjb21wRGF0YS5Jc0NvbXBlbnNhdGlvbklzc3VlZDtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5TU1IgPSBjb21wRGF0YS5TU1I7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuRXRrdCA9IGNvbXBEYXRhLkV0a3Q7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuUmVhY2NvbURldGFpbHMgPSBjb21wRGF0YS5SZWFjY29tRGV0YWlscztcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5BZGRpdGlvbmFsRGV0YWlscyA9IGNvbXBEYXRhLkFkZGl0aW9uYWxEZXRhaWxzO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5ID0gY29tcERhdGEubW9uZXRhcnk7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnlQcmludFN0YXR1cyA9IGNvbXBEYXRhLm1vbmV0YXJ5UHJpbnRTdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuQ29tcGVuc2F0aW9ucyA9IGNvbXBEYXRhLkNvbXBlbnNhdGlvbnM7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuRXhpc3RpbmdDb21wZW5zYXRpb25zID0gY29tcERhdGEuRXhpc3RpbmdDb21wZW5zYXRpb25zO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5ZW5kb3JzZW1lbnRUZXh0SXRlbXMgPSBjb21wRGF0YS5tb25ldGFyeWVuZG9yc2VtZW50VGV4dEl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLk1vbmV0YXJ5T3ZlcnJpZGVSZWFzb24gPSBjb21wRGF0YS5Nb25ldGFyeU92ZXJyaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWxlbmRvcnNlbWVudFRleHRJdGVtcyA9IGNvbXBEYXRhLm1lYWxlbmRvcnNlbWVudFRleHRJdGVtcztcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsRnJlZVRleHQgPSBjb21wRGF0YS5tZWFsRnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEubWVhbERldGFpbHMgPSBjb21wRGF0YS5tZWFsRGV0YWlscztcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5NZWFsT3ZlcnJpZGVSZWFzb24gPSBjb21wRGF0YS5NZWFsT3ZlcnJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWxlbmRvcnNlbWVudFRleHRJdGVtcyA9IGNvbXBEYXRhLmhvdGVsZW5kb3JzZW1lbnRUZXh0SXRlbXM7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWxGcmVlVGV4dCA9IGNvbXBEYXRhLmhvdGVsRnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuSG90ZWxPdmVycmlkZVJlYXNvbiA9IGNvbXBEYXRhLkhvdGVsT3ZlcnJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWxEZXRhaWxzID0gY29tcERhdGEuaG90ZWxEZXRhaWxzO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydGF0aW9uZW5kb3JzZW1lbnRUZXh0SXRlbXMgPSBjb21wRGF0YS50cmFuc3BvcnRhdGlvbmVuZG9yc2VtZW50VGV4dEl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydEZyZWVUZXh0ID0gY29tcERhdGEudHJhbnNwb3J0RnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEudHJhbnNwb3J0RU1EID0gY29tcERhdGEudHJhbnNwb3J0RU1EO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlRyYW5zcG9ydE92ZXJyaWRlUmVhc29uID0gY29tcERhdGEuVHJhbnNwb3J0T3ZlcnJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnlFbWFpbFN0YXR1cyA9IGNvbXBEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmhvdGVsUHJpbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsUHJpbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS50cmFuc3BvcnRhdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEudHJhbnNwb3J0UHJpbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5FbWFpbCA9IGNvbXBEYXRhLkVtYWlsO1xuICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzRW1haWxTZW50ID0gY29tcERhdGEuaXNFbWFpbFNlbnQ7XG4gICAgICAgICAgICAgICAgICAgIHBheERhdGEuaXNQYXJpdGFsbHlQcmludGVkID0gY29tcERhdGEuaXNQYXJpdGFsbHlQcmludGVkO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGF4RGF0YS5pc1Bhcml0YWxseVByaW50ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnlQcmludFN0YXR1cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBEYXRhLmlzRW1haWxTZW50ID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZm9yRWFjaCgoZXhpRU1ELCBleGlJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlFTUQuRW1kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGlFTUQuRW1kcy5mb3JFYWNoKChlbWREYXRhLCBlbWRJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtZERhdGEuRW1haWxTdGF0dXMgPT0gXCJuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzRW1haWxTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaXNFbWFpbFBhcml0YWxseVNlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeWNvdW50ID0gY29tcERhdGEuQ29tcGVuc2F0aW9ucy5maWx0ZXIobSA9PiBtLkNvbXBUeXBlVGV4dCA9PSBcIk1vbmV0YXJ5XCIpWzBdLkVtZHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0LnB1c2gocGF4RGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQucHVzaChwYXhEYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29tcERhdGEuaXNFbWFpbFNlbnQgPT0gdHJ1ZSAmJiBjb21wRGF0YS5pc05vdFByaW50ZWQgPT0gdHJ1ZSAmJiBjb21wRGF0YS5pc1Bhcml0YWxseVByaW50ZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlzRW1haWxTZW50ICYmIGlzTm90UHJpbnRlZFwiICsgY29tcERhdGEuRnVsbE5hbWUpO1xuICAgICAgICAgICAgICAgIGxldCBwYXhEYXRhID0gbmV3IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KCk7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5pc0VtYWlsU2VudCA9IGNvbXBEYXRhLmlzRW1haWxTZW50O1xuICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnlFbWFpbFN0YXR1cyA9IGNvbXBEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXM7XG4gICAgICAgICAgICAgICAgY29tcERhdGEuQ29tcGVuc2F0aW9ucy5mb3JFYWNoKChleGlFTUQsIGV4aUluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlFTUQuRW1kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhpRU1ELkVtZHMuZm9yRWFjaCgoZW1kRGF0YSwgZW1kSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImluIGhlcmUgaXNFbWFpbFNlbnQgJiYgaXNOb3RQcmludGVkIDE6XCIgKyBjb21wRGF0YS5GdWxsTmFtZSArIEpTT04uc3RyaW5naWZ5KGV4aUVNRC5FbWRzLmZpbHRlcihtID0+IG0uRW1haWxTdGF0dXMgPT0gXCJuXCIpLmxlbmd0aCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW4gaGVyZSBpc0VtYWlsU2VudCAmJiBpc05vdFByaW50ZWQgMjpcIiArIGNvbXBEYXRhLkZ1bGxOYW1lICsgSlNPTi5zdHJpbmdpZnkoZXhpRU1ELkVtZHMubGVuZ3RoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtZERhdGEuRW1haWxTdGF0dXMgPT0gXCJuXCIgJiYgZXhpRU1ELkVtZHMuZmlsdGVyKG0gPT4gbS5FbWFpbFN0YXR1cyA9PSBcIm5cIikubGVuZ3RoIDwgZXhpRU1ELkVtZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaXNFbWFpbFNlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzRW1haWxQYXJpdGFsbHlTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBwYXhEYXRhLkZsaWdodFNlZ21lbnRJZCA9IGNvbXBEYXRhLkZsaWdodFNlZ21lbnRJZDtcbiAgICAgICAgICAgICAgICBwYXhEYXRhLlBhc3NlbmdlclNlcSA9IGNvbXBEYXRhLlBhc3NlbmdlclNlcTtcbiAgICAgICAgICAgICAgICBwYXhEYXRhLk9yZGVySWQgPSBjb21wRGF0YS5PcmRlcklkO1xuICAgICAgICAgICAgICAgIHBheERhdGEuR2l2ZW5OYW1lID0gY29tcERhdGEuR2l2ZW5OYW1lO1xuICAgICAgICAgICAgICAgIHBheERhdGEuTGFzdE5hbWUgPSBjb21wRGF0YS5MYXN0TmFtZTtcbiAgICAgICAgICAgICAgICBwYXhEYXRhLkZ1bGxOYW1lID0gY29tcERhdGEuTGFzdE5hbWUgKyBcIi9cIiArIGNvbXBEYXRhLkdpdmVuTmFtZTtcbiAgICAgICAgICAgICAgICBwYXhEYXRhLlBheFR5cGUgPSBjb21wRGF0YS5QYXhUeXBlO1xuICAgICAgICAgICAgICAgIHBheERhdGEuRnF0dkNjID0gY29tcERhdGEuRnF0dkNjO1xuICAgICAgICAgICAgICAgIHBheERhdGEuRnF0dk51bWJlciA9IGNvbXBEYXRhLkZxdHZOdW1iZXI7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5QYXhTdGF0dXMgPSBjb21wRGF0YS5QYXhTdGF0dXM7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5QYXhFbWFpbEFkZHJlc3MgPSBjb21wRGF0YS5QYXhFbWFpbEFkZHJlc3M7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5Db21wZW5zYXRpb25SZWFzb25JZCA9IGNvbXBEYXRhLkNvbXBlbnNhdGlvblJlYXNvbklkO1xuICAgICAgICAgICAgICAgIHBheERhdGEuSXNFeGlzdGluZ0NvbXBlbnNhdGlvbiA9IGNvbXBEYXRhLklzRXhpc3RpbmdDb21wZW5zYXRpb247XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5DdXN0b21lckNhcmVDYXNlTnVtID0gY29tcERhdGEuQ3VzdG9tZXJDYXJlQ2FzZU51bTtcbiAgICAgICAgICAgICAgICBwYXhEYXRhLldvcmxkVHJhY2VyTnVtID0gY29tcERhdGEuV29ybGRUcmFjZXJOdW07XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5VcGRhdGVMb2NrTmJyID0gY29tcERhdGEuVXBkYXRlTG9ja05icjtcbiAgICAgICAgICAgICAgICBwYXhEYXRhLkZxdHZUaWVyID0gY29tcERhdGEuRnF0dlRpZXI7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5DYWJpbiA9IGNvbXBEYXRhLkNhYmluO1xuICAgICAgICAgICAgICAgIHBheERhdGEuUGF4UlBIID0gY29tcERhdGEuUGF4UlBIO1xuICAgICAgICAgICAgICAgIHBheERhdGEuT3JpZ2luID0gY29tcERhdGEuT3JpZ2luO1xuICAgICAgICAgICAgICAgIHBheERhdGEuRGVzdCA9IGNvbXBEYXRhLkRlc3Q7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5Jc0NvbXBlbnNhdGlvbklzc3VlZCA9IGNvbXBEYXRhLklzQ29tcGVuc2F0aW9uSXNzdWVkO1xuICAgICAgICAgICAgICAgIHBheERhdGEuU1NSID0gY29tcERhdGEuU1NSO1xuICAgICAgICAgICAgICAgIHBheERhdGEuRXRrdCA9IGNvbXBEYXRhLkV0a3Q7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5SZWFjY29tRGV0YWlscyA9IGNvbXBEYXRhLlJlYWNjb21EZXRhaWxzO1xuICAgICAgICAgICAgICAgIHBheERhdGEuQWRkaXRpb25hbERldGFpbHMgPSBjb21wRGF0YS5BZGRpdGlvbmFsRGV0YWlscztcbiAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5ID0gY29tcERhdGEubW9uZXRhcnk7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeVByaW50U3RhdHVzID0gY29tcERhdGEubW9uZXRhcnlQcmludFN0YXR1cztcbiAgICAgICAgICAgICAgICBwYXhEYXRhLkNvbXBlbnNhdGlvbnMgPSBjb21wRGF0YS5Db21wZW5zYXRpb25zO1xuICAgICAgICAgICAgICAgIHBheERhdGEuRXhpc3RpbmdDb21wZW5zYXRpb25zID0gY29tcERhdGEuRXhpc3RpbmdDb21wZW5zYXRpb25zO1xuICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnllbmRvcnNlbWVudFRleHRJdGVtcyA9IGNvbXBEYXRhLm1vbmV0YXJ5ZW5kb3JzZW1lbnRUZXh0SXRlbXM7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5Nb25ldGFyeU92ZXJyaWRlUmVhc29uID0gY29tcERhdGEuTW9uZXRhcnlPdmVycmlkZVJlYXNvbjtcbiAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWxlbmRvcnNlbWVudFRleHRJdGVtcyA9IGNvbXBEYXRhLm1lYWxlbmRvcnNlbWVudFRleHRJdGVtcztcbiAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWxGcmVlVGV4dCA9IGNvbXBEYXRhLm1lYWxGcmVlVGV4dDtcbiAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWxEZXRhaWxzID0gY29tcERhdGEubWVhbERldGFpbHM7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5NZWFsT3ZlcnJpZGVSZWFzb24gPSBjb21wRGF0YS5NZWFsT3ZlcnJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5ob3RlbGVuZG9yc2VtZW50VGV4dEl0ZW1zID0gY29tcERhdGEuaG90ZWxlbmRvcnNlbWVudFRleHRJdGVtcztcbiAgICAgICAgICAgICAgICBwYXhEYXRhLmhvdGVsRnJlZVRleHQgPSBjb21wRGF0YS5ob3RlbEZyZWVUZXh0O1xuICAgICAgICAgICAgICAgIHBheERhdGEuSG90ZWxPdmVycmlkZVJlYXNvbiA9IGNvbXBEYXRhLkhvdGVsT3ZlcnJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5ob3RlbERldGFpbHMgPSBjb21wRGF0YS5ob3RlbERldGFpbHM7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS50cmFuc3BvcnRhdGlvbmVuZG9yc2VtZW50VGV4dEl0ZW1zID0gY29tcERhdGEudHJhbnNwb3J0YXRpb25lbmRvcnNlbWVudFRleHRJdGVtcztcbiAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydEZyZWVUZXh0ID0gY29tcERhdGEudHJhbnNwb3J0RnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS50cmFuc3BvcnRFTUQgPSBjb21wRGF0YS50cmFuc3BvcnRFTUQ7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5UcmFuc3BvcnRPdmVycmlkZVJlYXNvbiA9IGNvbXBEYXRhLlRyYW5zcG9ydE92ZXJyaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgIC8vIHBheERhdGEubW9uZXRhcnlFbWFpbFN0YXR1cyA9IGNvbXBEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXM7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5ob3RlbCA9IDA7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5ob3RlbFByaW50U3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsID0gMDtcbiAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWxQcmludFN0YXR1cyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHBheERhdGEudHJhbnNwb3J0YXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIHBheERhdGEudHJhbnNwb3J0UHJpbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBwYXhEYXRhLkVtYWlsID0gY29tcERhdGEuRW1haWw7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5pc1Bhcml0YWxseVByaW50ZWQgPSBjb21wRGF0YS5pc1Bhcml0YWxseVByaW50ZWQ7XG4gICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeWNvdW50ID0gY29tcERhdGEuQ29tcGVuc2F0aW9ucy5maWx0ZXIobSA9PiBtLkNvbXBUeXBlVGV4dCA9PSBcIk1vbmV0YXJ5XCIpWzBdLkVtZHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW1haWwgOlwiICsgSlNPTi5zdHJpbmdpZnkocGF4RGF0YSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QucHVzaChwYXhEYXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkLnB1c2gocGF4RGF0YSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJFbWFpbCAxOlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5Db21wUGF4TGlzdCkpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVtYWlsIDI6XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLkNvbXBQYXhMaXN0SXNzdWVkKSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRW1haWwgMzpcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQpKTtcbiAgICAgICAgdGhpcy5hcGlzZGV0YWlscyA9IFtdO1xuICAgICAgICB0aGlzLkNvbVBheFByaW50RnVsbExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkO1xuICAgICAgICB0aGlzLmZpcnN0dGFiLnRpdGxlID0gXCJFTUQgUHJpbnRlZFwiICsgXCIoXCIgKyB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkLmxlbmd0aCArIFwiKVwiO1xuICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5maXJzdHRhYik7XG4gICAgICAgIHRoaXMuQ29tUGF4Tm90UHJpbnRGdWxsTGlzdCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQ7XG4gICAgICAgIHRoaXMuc2Vjb25kdGFiLnRpdGxlID0gXCJFTUQgQXZhaWxhYmxlIGZvciBQcmludFwiICsgXCIoXCIgKyB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLmxlbmd0aCArIFwiKVwiO1xuICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5zZWNvbmR0YWIpO1xuICAgIH1cbiAgICBwdWJsaWMgc2VsZWN0U2VnbWVudChlOiBhbnkpIHtcbiAgICAgICAgY29uc29sZS5kaXIoZSk7XG4gICAgICAgIHZhciBzZWxJbmQgPSBlLm5ld0luZGV4O1xuICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyID0gW107XG4gICAgICAgIGlmIChzZWxJbmQgPT0gMCkge1xuICAgICAgICAgICAgdGhpcy50b3RhbElzc3VlZE1vbmV0YXJ5ID0gMDtcbiAgICAgICAgICAgIHRoaXMudG90YWxJc3N1ZWRIb3RlbCA9IDA7XG4gICAgICAgICAgICB0aGlzLnRvdGFsSXNzdWVkTWVhbCA9IDA7XG4gICAgICAgICAgICB0aGlzLnRvdGFsSXNzdWVkVHJhbnNwb3J0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uSXNzdWVkTGlzdCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbk5vdElzc3VlZExpc3QgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0QWxsUGF4ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLlNlYXJjaENyaXRlcmlhID0gXCJOYW1lXCI7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaEZpZWxkID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZC5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGEuSXNTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3RJc3N1ZWQuZm9yRWFjaCgoY29tcERhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbElzc3VlZE1vbmV0YXJ5ID0gdGhpcy50b3RhbElzc3VlZE1vbmV0YXJ5ICsgTnVtYmVyKGNvbXBEYXRhLm1vbmV0YXJ5KTtcbiAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSXNzdWVkSG90ZWwgKz0gTnVtYmVyKGNvbXBEYXRhLmhvdGVsKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSXNzdWVkTWVhbCArPSBOdW1iZXIoY29tcERhdGEubWVhbCk7XG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbElzc3VlZFRyYW5zcG9ydCArPSBOdW1iZXIoY29tcERhdGEudHJhbnNwb3J0YXRpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21QYXhQcmludEZ1bGxMaXN0O1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFBhc3NlbmdlckNvdW50ID0gMDtcbiAgICAgICAgICAgIHRoaXMuVG90YWxQYXNzZW5nZXJDb3VudCA9IHRoaXMuQ29tUGF4UHJpbnRGdWxsTGlzdC5sZW5ndGg7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIklzc3VlZFwiICsgdGhpcy5Db21wUGF4TGlzdElzc3VlZC5sZW5ndGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25Jc3N1ZWRMaXN0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbk5vdElzc3VlZExpc3QgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5TZWFyY2hDcml0ZXJpYSA9IFwiTmFtZVwiO1xuICAgICAgICAgICAgdGhpcy5zZWFyY2hGaWVsZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMudG90YWxOb3RJc3N1ZWRNb25ldGFyeSA9IDA7XG4gICAgICAgICAgICB0aGlzLnRvdGFsTm90SXNzdWVkSG90ZWwgPSAwO1xuICAgICAgICAgICAgdGhpcy50b3RhbE5vdElzc3VlZE1lYWwgPSAwO1xuICAgICAgICAgICAgdGhpcy50b3RhbE5vdElzc3VlZFRyYW5zcG9ydCA9IDA7XG4gICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLmZvckVhY2goKGNvbXBEYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudG90YWxOb3RJc3N1ZWRNb25ldGFyeSA9IHRoaXMudG90YWxOb3RJc3N1ZWRNb25ldGFyeSArIE51bWJlcihjb21wRGF0YS5tb25ldGFyeSk7XG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbE5vdElzc3VlZEhvdGVsICs9IE51bWJlcihjb21wRGF0YS5ob3RlbCk7XG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbE5vdElzc3VlZE1lYWwgKz0gTnVtYmVyKGNvbXBEYXRhLm1lYWwpO1xuICAgICAgICAgICAgICAgIHRoaXMudG90YWxOb3RJc3N1ZWRUcmFuc3BvcnQgKz0gTnVtYmVyKGNvbXBEYXRhLnRyYW5zcG9ydGF0aW9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdCA9IHRoaXMuQ29tUGF4Tm90UHJpbnRGdWxsTGlzdDtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRQYXNzZW5nZXJDb3VudCA9IDA7XG4gICAgICAgICAgICB0aGlzLlRvdGFsUGFzc2VuZ2VyQ291bnQgPSB0aGlzLkNvbVBheE5vdFByaW50RnVsbExpc3QubGVuZ3RoO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgSXNzdWVkXCIgKyB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLmxlbmd0aCk7XG5cbiAgICAgICAgfVxuICAgIH1cbiAgICB0b2dnbGVDaGVja2VkKHBheDogQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QpIHtcbiAgICAgICAgLy8gaWYgKCh0aGlzLklzTGFiZWxGaWVsZCA9PSB0cnVlICYmIHRoaXMuQ29tcGVuc2F0aW9uTm90SXNzdWVkTGlzdCA9PSB0cnVlKSAgfHwgdGhpcy5Db21wZW5zYXRpb25Jc3N1ZWRMaXN0ID09dHJ1ZSkge1xuICAgICAgICBpZiAodGhpcy5Db21wZW5zYXRpb25Ob3RJc3N1ZWRMaXN0ID09IHRydWUpIHtcbiAgICAgICAgICAgIGlmIChwYXguSXNTZWxlY3RlZCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHBheC5Jc1NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0VtYWlsQ29weXRvU2VsZWN0UGF4VHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBwYXguRW1haWwgPSB0aGlzLkVtYWlsSWRTZWxlY3RlZFBheDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5wdXNoKHBheCk7XG4gICAgICAgICAgICAgICAgLy8gaWYgKHRoaXMuQ29tcFBheExpc3QubGVuZ3RoID09PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCkgdGhpcy5TZWxlY3RBbGxQYXggPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTGVuXCIgKyB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuc3BsaWNlKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuaW5kZXhPZihwYXgpLCAxKTtcbiAgICAgICAgICAgICAgICBwYXguSXNTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0QWxsUGF4ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUGFzc2VuZ2VyQ291bnQgPSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLkNvbVBheE5vdFByaW50RnVsbExpc3QubGVuZ3RoID09PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCkgdGhpcy5TZWxlY3RBbGxQYXggPSB0cnVlO1xuICAgIH1cbiAgICBwcmludEVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyICYmIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHNlbGVjdGluZ0FsbFBheCgpIHtcbiAgICAgICAgaWYgKHRoaXMuU2VsZWN0QWxsUGF4ID09IGZhbHNlICYmIHRoaXMuU2VsZWN0QWxsUGF4VmFyID09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdEFsbFBheFZhciA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0LmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFkYXRhLklzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5Jc1NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNFbWFpbENvcHl0b1NlbGVjdFBheFRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuRW1haWwgPSB0aGlzLkVtYWlsSWRTZWxlY3RlZFBheDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmICh0aGlzLkNvbWVuc2F0aW9uUmVhc29uICE9IFwiU2VsZWN0IFJlYXNvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBkYXRhLkNvbXBlbnNhdGlvblJlYXNvbiA9IHRoaXMuQ29tZW5zYXRpb25SZWFzb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAodGhpcy5Db21QYXhOb3RQcmludEZ1bGxMaXN0Lmxlbmd0aCA9PT0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5sZW5ndGgpIHRoaXMuU2VsZWN0QWxsUGF4ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0QWxsUGF4VmFyID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdEFsbFBheCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3NlbmdlciA9IFtdO1xuICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdC5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGEuSXNTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGRhdGEuQ29tcGVuc2F0aW9uUmVhc29uID0gXCJcIjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbGVjdGVkUGFzc2VuZ2VyQ291bnQgPSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aDtcbiAgICB9XG4gICAgZW1haWxFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5TZWxlY3RlZFBhc3NlbmdlciAmJiB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5tb25ldGFyeSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFbWFpbEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRW1haWxFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pc0VtYWlsRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzRW1haWxFbmFibGVkID09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmaWx0ZXIoYXJnczogYW55KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTmFtZTpcIiArIEpTT04uc3RyaW5naWZ5KGFyZ3MpKTtcbiAgICAgICAgLy8gdGhpcy5Db21wUGF4TGlzdCA9IHRoaXMuQ29tcGVuc2F0aW9uRnVsbFBheExpc3Q7XG4gICAgICAgIGxldCBzZWdCYXJFbG0gPSA8U2VnbWVudGVkQmFyPnRoaXMuc2VnYmFyLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGxldCBpbmRleCA9IHNlZ0JhckVsbS5zZWxlY3RlZEluZGV4O1xuICAgICAgICBpZiAoaW5kZXggPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZCA9IHRoaXMuQ29tUGF4UHJpbnRGdWxsTGlzdDtcbiAgICAgICAgICAgIGlmICh0aGlzLlNlYXJjaENyaXRlcmlhID09IFwiTmFtZVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmdzLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWQuZmlsdGVyKHIgPT4gci5HaXZlbk5hbWUuaW5kZXhPZihuYW1lLnRyaW0oKSkgPj0gMCB8fCByLkxhc3ROYW1lLmluZGV4T2YobmFtZS50cmltKCkpID49IDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkID0gdGhpcy5Db21QYXhQcmludEZ1bGxMaXN0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZDtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5TZWFyY2hDcml0ZXJpYSA9PSBcIk9yZGVyIElEXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJncykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGFyZ3MudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZC5maWx0ZXIociA9PiByLk9yZGVySWQuaW5kZXhPZihuYW1lLnRyaW0oKSkgPj0gMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3RJc3N1ZWQgPSB0aGlzLkNvbVBheFByaW50RnVsbExpc3Q7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJncykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGFyZ3MudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZC5maWx0ZXIociA9PiByLkNhYmluLmluZGV4T2YobmFtZS50cmltKCkpID49IDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkID0gdGhpcy5Db21QYXhQcmludEZ1bGxMaXN0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZDtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuVG90YWxQYXNzZW5nZXJDb3VudCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWQubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZCA9IHRoaXMuQ29tUGF4Tm90UHJpbnRGdWxsTGlzdDtcbiAgICAgICAgICAgIGlmICh0aGlzLlNlYXJjaENyaXRlcmlhID09IFwiTmFtZVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmdzLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQuZmlsdGVyKHIgPT4gci5HaXZlbk5hbWUuaW5kZXhPZihuYW1lLnRyaW0oKSkgPj0gMCB8fCByLkxhc3ROYW1lLmluZGV4T2YobmFtZS50cmltKCkpID49IDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkID0gdGhpcy5Db21QYXhOb3RQcmludEZ1bGxMaXN0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZDtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5TZWFyY2hDcml0ZXJpYSA9PSBcIk9yZGVyIElEXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJncykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGFyZ3MudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZC5maWx0ZXIociA9PiByLk9yZGVySWQuaW5kZXhPZihuYW1lLnRyaW0oKSkgPj0gMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQgPSB0aGlzLkNvbVBheE5vdFByaW50RnVsbExpc3Q7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJncykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGFyZ3MudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZC5maWx0ZXIociA9PiByLkNhYmluLmluZGV4T2YobmFtZS50cmltKCkpID49IDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkID0gdGhpcy5Db21QYXhOb3RQcmludEZ1bGxMaXN0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZDtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLkNvbVBheE5vdFByaW50RnVsbExpc3QubGVuZ3RoID09PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCkgdGhpcy5TZWxlY3RBbGxQYXggPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5Ub3RhbFBhc3NlbmdlckNvdW50ID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZC5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICBzb3J0QmFzZWRPblBheE5hbWUoKSB7XG4gICAgICAgIHZhciBpc0FzYzogbnVtYmVyID0gdGhpcy5uYW1lU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMubmFtZVNvcnRJbmRpY2F0b3IgPSB0aGlzLm5hbWVTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcbiAgICAgICAgdGhpcy5zc3JTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMudGllclNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5jbGFzc1NvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5vcmRlcklkU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLkNvbXBQYXhMaXN0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciB2YWwxID0gYS5GdWxsTmFtZTtcbiAgICAgICAgICAgIHZhciB2YWwyID0gYi5GdWxsTmFtZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbDEgKyBcIiBcIiArIHZhbDIpO1xuICAgICAgICAgICAgaWYgKGlzQXNjID09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsMSA8IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPiB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNvcnRCYXNlZE9uU1NSKCkge1xuICAgICAgICB2YXIgaXNBc2M6IG51bWJlciA9IHRoaXMuc3NyU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMuc3NyU29ydEluZGljYXRvciA9IHRoaXMuc3NyU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMubmFtZVNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy50aWVyU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLmNsYXNzU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLm9yZGVySWRTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMuQ29tcFBheExpc3Quc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgdmFyIHZhbDEgPSBhLlNTUjtcbiAgICAgICAgICAgIHZhciB2YWwyID0gYi5TU1I7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2YWwxICsgXCIgXCIgKyB2YWwyKTtcbiAgICAgICAgICAgIGlmIChpc0FzYyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPCB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh2YWwxID4gdmFsMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzb3J0QmFzZWRPblRpZXIoKSB7XG4gICAgICAgIHZhciBpc0FzYzogbnVtYmVyID0gdGhpcy50aWVyU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMudGllclNvcnRJbmRpY2F0b3IgPSB0aGlzLnRpZXJTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcbiAgICAgICAgdGhpcy5zc3JTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMubmFtZVNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5jbGFzc1NvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5vcmRlcklkU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLkNvbXBQYXhMaXN0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciB2YWwxID0gYS5UaWVyO1xuICAgICAgICAgICAgdmFyIHZhbDIgPSBiLlRpZXI7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2YWwxICsgXCIgXCIgKyB2YWwyKTtcbiAgICAgICAgICAgIGlmIChpc0FzYyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPCB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh2YWwxID4gdmFsMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzb3J0QmFzZWRPbkNsYXNzKCkge1xuICAgICAgICB2YXIgaXNBc2M6IG51bWJlciA9IHRoaXMuY2xhc3NTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcbiAgICAgICAgdGhpcy5jbGFzc1NvcnRJbmRpY2F0b3IgPSB0aGlzLmNsYXNzU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMuc3NyU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLnRpZXJTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMubmFtZVNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5vcmRlcklkU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLkNvbXBQYXhMaXN0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciB2YWwxID0gYS5DYWJpbjtcbiAgICAgICAgICAgIHZhciB2YWwyID0gYi5DYWJpbjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbDEgKyBcIiBcIiArIHZhbDIpO1xuICAgICAgICAgICAgaWYgKGlzQXNjID09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsMSA8IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPiB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNvcnRCYXNlZE9uT3JkZXJJZCgpIHtcbiAgICAgICAgdmFyIGlzQXNjOiBudW1iZXIgPSB0aGlzLm9yZGVySWRTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcbiAgICAgICAgdGhpcy5vcmRlcklkU29ydEluZGljYXRvciA9IHRoaXMub3JkZXJJZFNvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xuICAgICAgICB0aGlzLnNzclNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy50aWVyU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLmNsYXNzU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLm5hbWVTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMuQ29tcFBheExpc3Quc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgdmFyIHZhbDEgPSBhLk9yZGVySWQ7XG4gICAgICAgICAgICB2YXIgdmFsMiA9IGIuT3JkZXJJZDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbDEgKyBcIiBcIiArIHZhbDIpO1xuICAgICAgICAgICAgaWYgKGlzQXNjID09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsMSA8IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPiB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVtYWlsKGl0ZW06IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBpdGVtLklzU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGl0ZW0uSXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJPcmRlckRldGFpbHMgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLmdldEVtYWlsQnlPcmRlcklkKGl0ZW0uT3JkZXJJZClcbiAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLklEICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgQ29tcGFuc2F0aW9uRGV0YWlsczogYW55ID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5QYXNzZW5nZXJzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbCBpbiAxXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLlBhc3NlbmdlcnMuZm9yRWFjaCgocGF4RGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXhEYXRhLkZpcnN0bmFtZSA9PSBpdGVtLkdpdmVuTmFtZSAmJiBwYXhEYXRhLkxhc3RuYW1lID09IGl0ZW0uTGFzdE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIGluIDJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBheERhdGEuUHJpbWFyeVRpY2tldHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJldGt0OlwiICsgSlNPTi5zdHJpbmdpZnkocGF4RGF0YS5QcmltYXJ5VGlja2V0c1swXS5QcmltYXJ5VGlja2V0TnVtYmVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uRXRrdE51bWJyID0gcGF4RGF0YS5QcmltYXJ5VGlja2V0c1swXS5QcmltYXJ5VGlja2V0TnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF4RGF0YS5FbWFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIGluIDNcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuID0gcGF4RGF0YS5FbWFpbHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkVtYWlsSWQgPSBwYXhEYXRhLkVtYWlsc1tuIC0gMV0uVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uRW1haWwgPSBwYXhEYXRhLkVtYWlsc1tuIC0gMV0uVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRW1haWxJZFNlbGVjdGVkUGF4ID0gcGF4RGF0YS5FbWFpbHNbbiAtIDFdLlZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uRW1haWwgPSBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkVtYWlsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIiogcmVxdWlyZWQgZmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJTYXZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIkNvcHkgdG8gc2VsZWN0ZWQgcGFzc2VuZ2VyICYgU2F2ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV1dHJhbEJ1dHRvblRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VGV4dDogaXRlbS5FbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0VHlwZTogZGlhbG9ncy5pbnB1dFR5cGUudGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWFsb2dzLnByb21wdChvcHRpb25zKS50aGVuKChyZXN1bHQ6IGRpYWxvZ3MuUHJvbXB0UmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhlbGxvLCBcIiArIHJlc3VsdC50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucmVzdWx0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucmVzdWx0ID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC50ZXh0LnRyaW0oKS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWFpbChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBFTUFJTF9SRUdFWFAgPSAvXlthLXowLTkhIyQlJicqK1xcLz0/Xl9ge3x9fi4tXStAW2EtejAtOV0oW2EtejAtOS1dKlthLXowLTldKT8oXFwuW2EtejAtOV0oW2EtejAtOS1dKlthLXowLTldKT8pKiQvaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gRU1BSUxfUkVHRVhQLnRlc3QocmVzdWx0LnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5FbWFpbElkID09IHJlc3VsdC50ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uRW1haWwgPSByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbDpcIiArIEpTT04uc3RyaW5naWZ5KGl0ZW0uRW1haWwpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLkVtYWlsID0gcmVzdWx0LnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlRW1haWwoQ29tcGFuc2F0aW9uRGV0YWlscywgaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW1haWw6XCIgKyBKU09OLnN0cmluZ2lmeShpdGVtLkVtYWlsKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzc1wiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWFpbChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC50ZXh0LnRyaW0oKS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWFpbChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBFTUFJTF9SRUdFWFAgPSAvXlthLXowLTkhIyQlJicqK1xcLz0/Xl9ge3x9fi4tXStAW2EtejAtOV0oW2EtejAtOS1dKlthLXowLTldKT8oXFwuW2EtejAtOV0oW2EtejAtOS1dKlthLXowLTldKT8pKiQvaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gRU1BSUxfUkVHRVhQLnRlc3QocmVzdWx0LnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5FbWFpbElkID09IHJlc3VsdC50ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uRW1haWwgPSByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0VtYWlsQ29weXRvU2VsZWN0UGF4VHJ1ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRW1haWxJZFNlbGVjdGVkUGF4ID0gcmVzdWx0LnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uRW1haWwgPSByZXN1bHQudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5FbWFpbCA9IHRoaXMuRW1haWxJZFNlbGVjdGVkUGF4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsOlwiICsgSlNPTi5zdHJpbmdpZnkoaXRlbS5FbWFpbCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFbWFpbENvcHl0b1NlbGVjdFBheFRydWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLkVtYWlsID0gcmVzdWx0LnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRW1haWxJZFNlbGVjdGVkUGF4ID0gcmVzdWx0LnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuRW1haWwgPSB0aGlzLkVtYWlsSWRTZWxlY3RlZFBheDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVFbWFpbChDb21wYW5zYXRpb25EZXRhaWxzLCBpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbDpcIiArIEpTT04uc3RyaW5naWZ5KGl0ZW0uRW1haWwpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiRW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtYWlsKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIoQ29tcGFuc2F0aW9uRGV0YWlscyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IEdldFBhc3Nlbmdlck9yZGVyRGV0YWlscyBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IEdldFBhc3Nlbmdlck9yZGVyRGV0YWlscyBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk5vIFJlc2VydmF0aW9uIGZvdW5kXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChlcnIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvblwiICsgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHVwZGF0ZUVtYWlsKG9yZGVyUmVzcG9zbmU6IGFueSwgaXRlbTogQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgdmFyIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB2YXIgQ3VyRGF0ZSA9IG1vbWVudChzdGFydERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhDdXJEYXRlKVxuICAgICAgICAgICAgdGhpcy5GbGlnaHRIZWFkZXJJbmZvID0gdGhpcy5fc2hhcmVkLmdldEZsaWdodEhlYWRlckluZm8oKTtcbiAgICAgICAgICAgIGxldCBFbWFpbENvbXBlbnNhdGlvblN0cnVjdHVyZSA9IENvbnZlcnRlcnMuY29udmVydFRvVXBkYXRlRW1haWxJZChpdGVtLCBvcmRlclJlc3Bvc25lKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW1haWwgUmVxOlwiICsgSlNPTi5zdHJpbmdpZnkoRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmUpKTtcbiAgICAgICAgICAgIGlmIChFbWFpbENvbXBlbnNhdGlvblN0cnVjdHVyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VydmljZS51cGRhdGVFbWFpbElkKGl0ZW0uT3JkZXJJZCwgRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmUpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIFJlczpcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuQmFkUmVxdWVzdCA9PSA0MDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGRhdGEuRXJyb3JNZXNzYWdlKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkVtYWlsIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5XCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJFbWFpbCBOb3QgdXBkYXRlZFwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChlcnIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJNb25ldGFyeSBub3QgYXZpbGFibGVcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZW5kRW1haWwoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHZhciBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIEN1ckRhdGUgPSBtb21lbnQoc3RhcnREYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coQ3VyRGF0ZSlcbiAgICAgICAgICAgIHRoaXMuaXNFbWFpbE5vdEF2YWlsYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5GbGlnaHRIZWFkZXJJbmZvID0gdGhpcy5fc2hhcmVkLmdldEZsaWdodEhlYWRlckluZm8oKTtcbiAgICAgICAgICAgIHZhciBwYXhOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuRW1haWwgPT0gbnVsbCB8fCBkYXRhLkVtYWlsID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0VtYWlsTm90QXZhaWxhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcGF4TmFtZSA9IGRhdGEuRnVsbE5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNFbWFpbE5vdEF2YWlsYWJsZSkge1xuICAgICAgICAgICAgICAgIGxldCBFbWFpbENvbXBlbnNhdGlvblN0cnVjdHVyZSA9IENvbnZlcnRlcnMuY29udmVydFRvRW1haWxDb21wZW5zYXRpb24odGhpcy5TZWxlY3RlZFBhc3NlbmdlciwgdGhpcy5GbGlnaHRIZWFkZXJJbmZvKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIFJlcTpcIiArIEpTT04uc3RyaW5naWZ5KEVtYWlsQ29tcGVuc2F0aW9uU3RydWN0dXJlKSk7XG4gICAgICAgICAgICAgICAgaWYgKEVtYWlsQ29tcGVuc2F0aW9uU3RydWN0dXJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VydmljZS5Qb3N0RW1haWxDb21wZW5zYXRpb24oRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmUpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbCBSZXM6XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5TdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJFbWFpbCBTZW50IFN1Y2Nlc3NmdWxseVwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wZW5zYXRpb25MaXN0KHRoaXMuRmxpZ2h0SGVhZGVySW5mby5EZXBhcnR1cmVEYXRlLCB0aGlzLkZsaWdodEhlYWRlckluZm8uRmxpZ2h0TnVtYmVyLCB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyWzBdLk9yaWdpbiwgXCJSZWFzb25XaXNlR2V0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk1vbmV0YXJ5IG5vdCBhdmlsYWJsZVwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQocGF4TmFtZSArIFwiIDpFbWFpbCBJRCBpcyBub3QgYXZhaWxhYmxlXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRDb21wZW5zYXRpb25MaXN0KGRhdGUsIGZsaWdodCwgbG9jYXRpb24sIHBheHR5cGUpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgR2V0UGFzc2VuZ2VyVHlwZSBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBTdGFydCBEYXRlIFRpbWUgOiAnICsgc0RhdGUpO1xuICAgICAgICAgICAgdGhpcy5fc2VydmljZS5nZXRDb21wZW5zYXRpb25QYXhMaXN0KGRhdGUsIGZsaWdodCwgbG9jYXRpb24sIHBheHR5cGUpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLlJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuUmVzdWx0c1swXS5GbGlnaHRTZWdtZW50c1swXS5QYXNzZW5nZXJzID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiRGF0YSBub3QgZm91bmRcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgQ29tcGFuc2F0aW9uRGV0YWlsczogYW55ID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmxpZ2h0U3RhdHVzRm9yQ29tcGVuc2F0aW9uTGlzdChDb21wYW5zYXRpb25EZXRhaWxzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLkVycm9yc1swXS5NZXNzYWdlID09IFwiRGF0YSBub3QgZm91bmRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJObyBwYXNzZW5nZXIgZm91bmRcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvblwiICsgZXJyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJUeXBlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJUeXBlIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmxpZ2h0U3RhdHVzRm9yQ29tcGVuc2F0aW9uTGlzdChDb21wUGF4KTogdm9pZCB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBDb21wZW5zYXRpb25EZXRhaWxzIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHZhciBkYXRlID0gdGhpcy5GbGlnaHRIZWFkZXJJbmZvLkRlcGFydHVyZURhdGU7XG4gICAgICAgICAgICB2YXIgZmxpZ2h0bnVtYmVyID0gdGhpcy5GbGlnaHRIZWFkZXJJbmZvLkZsaWdodE51bWJlcjtcbiAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiU2VhcmNoTG9jYXRpb25cIiwgXCJcIik7XG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLnN0YXR1cyhkYXRlLCBmbGlnaHRudW1iZXIsIGxvY2F0aW9uKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5CYWRSZXF1ZXN0ICE9IDQwMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5GbGlnaHRzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGF0dXM6IGFueSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOMVwiICsgSlNPTi5zdHJpbmdpZnkoc3RhdHVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0Q29tcGVuc2F0aW9uRmxpZ2h0RGV0YWlscyhzdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZsaWdodFN0YXR1cyA9IENvbnZlcnRlcnMuY29udmVydFRvRmxpZ2h0SGVhZGVySW5mbyhzdGF0dXMsIEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiU2VhcmNoTG9jYXRpb25cIiwgXCJcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLnNldEZsaWdodEhlYWRlckluZm8oZmxpZ2h0U3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBDb21wYXhMaXN0ID0gQ29udmVydGVycy5jb252ZXJ0b0NvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QoQ29tcFBheCwgc3RhdHVzLCBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIlNlYXJjaExvY2F0aW9uXCIsIFwiXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLlByZXZpb3VzUGFnZSA9PSBcImlzc3VlQ29tcGVuc2F0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgQ29tcGF4RmlsdGVyZWRMaXN0ID0gbmV3IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25Sb290T2JqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFBhc3Nlbmdlci5mb3JFYWNoKChTZWxQYXgsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbXBheExpc3QuUGFzc2VuZ2VyTGlzdC5mb3JFYWNoKChBbGxQYXgsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoU2VsUGF4Lk9yZGVySWQgPT0gQWxsUGF4Lk9yZGVySWQgJiYgU2VsUGF4LkdpdmVuTmFtZSA9PSBBbGxQYXguR2l2ZW5OYW1lICYmIFNlbFBheC5MYXN0TmFtZSA9PSBBbGxQYXguTGFzdE5hbWUgJiYgU2VsUGF4LkNvbXBlbnNhdGlvbnNbMF0uQ29tcFJlYXNvblRleHQgPT0gQWxsUGF4LkNvbXBlbnNhdGlvbnNbMF0uQ29tcFJlYXNvblRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb21wYXhGaWx0ZXJlZExpc3QuRmxpZ2h0TW9kZWwgPSBDb21wYXhMaXN0LkZsaWdodE1vZGVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbXBheEZpbHRlcmVkTGlzdC5QYXNzZW5nZXJMaXN0LnB1c2goQWxsUGF4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb21wYXhMaXN0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb21wYXhMaXN0ID0gQ29tcGF4RmlsdGVyZWRMaXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRDb21wZW5zYXRpb25MaXN0KENvbXBheEZpbHRlcmVkTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRDb21wZW5zYXRpb25MaXN0KENvbXBheExpc3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXhMaXN0ID0gbmV3IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25Sb290T2JqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLm5hdmlhZ2F0ZXRvQ29tcGVuc2F0aW9uUHJpbnRMaXN0d2l0aHRhYigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXhMaXN0ID0gQ29tcGF4TGlzdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QgPSB0aGlzLlBheExpc3QuUGFzc2VuZ2VyTGlzdC5maWx0ZXIobSA9PiBtLklzQ29tcGVuc2F0aW9uSXNzdWVkID09IHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJQYXggTGlzdDpcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuQ29tcFBheExpc3QpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRmxpZ2h0SGVhZGVySW5mbyA9IHRoaXMuUGF4TGlzdC5GbGlnaHRNb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxJc3N1ZWRNb25ldGFyeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSXNzdWVkSG90ZWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbElzc3VlZE1lYWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbElzc3VlZFRyYW5zcG9ydCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTm90SXNzdWVkTW9uZXRhcnkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE5vdElzc3VlZEhvdGVsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxOb3RJc3N1ZWRNZWFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxOb3RJc3N1ZWRUcmFuc3BvcnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdC5mb3JFYWNoKChjb21wRGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5Db21wZW5zYXRpb25zLmZvckVhY2goKGV4aUVNRCwgZXhpSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZmlsdGVyKG0gPT4gbS5Db21wVHlwZVRleHQgPT0gXCJNb25ldGFyeVwiKVswXS5FbWRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5tb25ldGFyeWNvdW50ID0gY29tcERhdGEuQ29tcGVuc2F0aW9ucy5maWx0ZXIobSA9PiBtLkNvbXBUeXBlVGV4dCA9PSBcIk1vbmV0YXJ5XCIpWzBdLkVtZHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEubW9uZXRhcnljb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aUVNRC5FbWRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGlFTUQuRW1kcy5mb3JFYWNoKChlbWREYXRhLCBlbWRJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIChleGlFTUQuQ29tcFR5cGVUZXh0ICE9IFwiTW9uZXRhcnlcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWREYXRhLlByaW50U3RhdHVzID09IFwiblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmlzTm90UHJpbnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWREYXRhLkVtYWlsU3RhdHVzID09IFwieVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmlzRW1haWxTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBEYXRhLmlzTm90UHJpbnRlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZm9yRWFjaCgoZXhpRU1ELCBleGlJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aUVNRC5FbWRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpRU1ELkVtZHMuZm9yRWFjaCgoZW1kRGF0YSwgZW1kSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtZERhdGEuUHJpbnRTdGF0dXMgPT0gXCJ5XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmlzUGFyaXRhbGx5UHJpbnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aUVNRC5Db21wVHlwZVRleHQgPT0gXCJNb25ldGFyeVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aUVNRC5FbWRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4aUVNRC5FbWRzLmZvckVhY2goKGVtZERhdGEsIGVtZEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1kRGF0YS5QcmludFN0YXR1cyA9PSBcInlcIiAmJiBleGlFTUQuRW1kcy5maWx0ZXIobSA9PiBtLlByaW50U3RhdHVzID09IFwieVwiKS5sZW5ndGggPCBleGlFTUQuRW1kcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhleGlFTUQuRW1kcy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGV4aUVNRC5FbWRzLmZpbHRlcihtID0+IG0uUHJpbnRTdGF0dXMgPT0gXCJ5XCIpLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuaXNQYXJpdGFsbHlQcmludGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5tb25ldGFyeVByaW50U3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5pc01vbmV0YXJ5UGFyaXRhbGx5UHJpbnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wRGF0YS5pc1Bhcml0YWxseVByaW50ZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc1Bhcml0YWxseVByaW50ZWQgUHJpbnRlZFwiICsgY29tcERhdGEuRnVsbE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBheERhdGEgPSBuZXcgQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRmxpZ2h0U2VnbWVudElkID0gY29tcERhdGEuRmxpZ2h0U2VnbWVudElkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5QYXNzZW5nZXJTZXEgPSBjb21wRGF0YS5QYXNzZW5nZXJTZXE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLk9yZGVySWQgPSBjb21wRGF0YS5PcmRlcklkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5HaXZlbk5hbWUgPSBjb21wRGF0YS5HaXZlbk5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkxhc3ROYW1lID0gY29tcERhdGEuTGFzdE5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkZ1bGxOYW1lID0gY29tcERhdGEuTGFzdE5hbWUgKyBcIi9cIiArIGNvbXBEYXRhLkdpdmVuTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuUGF4VHlwZSA9IGNvbXBEYXRhLlBheFR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkZxdHZDYyA9IGNvbXBEYXRhLkZxdHZDYztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRnF0dk51bWJlciA9IGNvbXBEYXRhLkZxdHZOdW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlBheFN0YXR1cyA9IGNvbXBEYXRhLlBheFN0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuUGF4RW1haWxBZGRyZXNzID0gY29tcERhdGEuUGF4RW1haWxBZGRyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5Db21wZW5zYXRpb25SZWFzb25JZCA9IGNvbXBEYXRhLkNvbXBlbnNhdGlvblJlYXNvbklkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5Jc0V4aXN0aW5nQ29tcGVuc2F0aW9uID0gY29tcERhdGEuSXNFeGlzdGluZ0NvbXBlbnNhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuQ3VzdG9tZXJDYXJlQ2FzZU51bSA9IGNvbXBEYXRhLkN1c3RvbWVyQ2FyZUNhc2VOdW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLldvcmxkVHJhY2VyTnVtID0gY29tcERhdGEuV29ybGRUcmFjZXJOdW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlVwZGF0ZUxvY2tOYnIgPSBjb21wRGF0YS5VcGRhdGVMb2NrTmJyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5GcXR2VGllciA9IGNvbXBEYXRhLkZxdHZUaWVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5DYWJpbiA9IGNvbXBEYXRhLkNhYmluO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5QYXhSUEggPSBjb21wRGF0YS5QYXhSUEg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLk9yaWdpbiA9IGNvbXBEYXRhLk9yaWdpbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRGVzdCA9IGNvbXBEYXRhLkRlc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLklzQ29tcGVuc2F0aW9uSXNzdWVkID0gY29tcERhdGEuSXNDb21wZW5zYXRpb25Jc3N1ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlNTUiA9IGNvbXBEYXRhLlNTUjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRXRrdCA9IGNvbXBEYXRhLkV0a3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlJlYWNjb21EZXRhaWxzID0gY29tcERhdGEuUmVhY2NvbURldGFpbHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkFkZGl0aW9uYWxEZXRhaWxzID0gY29tcERhdGEuQWRkaXRpb25hbERldGFpbHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5ID0gY29tcERhdGEubW9uZXRhcnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5UHJpbnRTdGF0dXMgPSBjb21wRGF0YS5tb25ldGFyeVByaW50U3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5Db21wZW5zYXRpb25zID0gY29tcERhdGEuQ29tcGVuc2F0aW9ucztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRXhpc3RpbmdDb21wZW5zYXRpb25zID0gY29tcERhdGEuRXhpc3RpbmdDb21wZW5zYXRpb25zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeWVuZG9yc2VtZW50VGV4dEl0ZW1zID0gY29tcERhdGEubW9uZXRhcnllbmRvcnNlbWVudFRleHRJdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuTW9uZXRhcnlPdmVycmlkZVJlYXNvbiA9IGNvbXBEYXRhLk1vbmV0YXJ5T3ZlcnJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWxlbmRvcnNlbWVudFRleHRJdGVtcyA9IGNvbXBEYXRhLm1lYWxlbmRvcnNlbWVudFRleHRJdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubWVhbEZyZWVUZXh0ID0gY29tcERhdGEubWVhbEZyZWVUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsRGV0YWlscyA9IGNvbXBEYXRhLm1lYWxEZXRhaWxzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5NZWFsT3ZlcnJpZGVSZWFzb24gPSBjb21wRGF0YS5NZWFsT3ZlcnJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmhvdGVsZW5kb3JzZW1lbnRUZXh0SXRlbXMgPSBjb21wRGF0YS5ob3RlbGVuZG9yc2VtZW50VGV4dEl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5ob3RlbEZyZWVUZXh0ID0gY29tcERhdGEuaG90ZWxGcmVlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuSG90ZWxPdmVycmlkZVJlYXNvbiA9IGNvbXBEYXRhLkhvdGVsT3ZlcnJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmhvdGVsRGV0YWlscyA9IGNvbXBEYXRhLmhvdGVsRGV0YWlscztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEudHJhbnNwb3J0YXRpb25lbmRvcnNlbWVudFRleHRJdGVtcyA9IGNvbXBEYXRhLnRyYW5zcG9ydGF0aW9uZW5kb3JzZW1lbnRUZXh0SXRlbXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydEZyZWVUZXh0ID0gY29tcERhdGEudHJhbnNwb3J0RnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydEVNRCA9IGNvbXBEYXRhLnRyYW5zcG9ydEVNRDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuVHJhbnNwb3J0T3ZlcnJpZGVSZWFzb24gPSBjb21wRGF0YS5UcmFuc3BvcnRPdmVycmlkZVJlYXNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnlFbWFpbFN0YXR1cyA9IGNvbXBEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkVtYWlsID0gY29tcERhdGEuRW1haWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzRW1haWxTZW50ID0gY29tcERhdGEuaXNFbWFpbFNlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzRW1haWxQYXJpdGFsbHlTZW50ID0gY29tcERhdGEuaXNFbWFpbFBhcml0YWxseVNlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5ldyBJbnNpZGU6XCIgKyBjb21wRGF0YS5pc1Bhcml0YWxseVByaW50ZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeVByaW50U3RhdHVzID0gY29tcERhdGEubW9uZXRhcnlQcmludFN0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaXNQYXJpdGFsbHlQcmludGVkID0gY29tcERhdGEuaXNQYXJpdGFsbHlQcmludGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5pc01vbmV0YXJ5UGFyaXRhbGx5UHJpbnRlZCA9IGNvbXBEYXRhLmlzTW9uZXRhcnlQYXJpdGFsbHlQcmludGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5pc01lYWxQYXJpdGFsbHlQcmludGVkID0gY29tcERhdGEuaXNNZWFsUGFyaXRhbGx5UHJpbnRlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaXNIb3RlbHNQYXJpdGFsbHlQcmludGVkID0gY29tcERhdGEuaXNIb3RlbHNQYXJpdGFsbHlQcmludGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5pc1RyYW5zcG9ydFBhcml0YWxseVByaW50ZWQgPSBjb21wRGF0YS5pc1RyYW5zcG9ydFBhcml0YWxseVByaW50ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcERhdGEuQ29tcGVuc2F0aW9ucy5maWx0ZXIobSA9PiBtLkNvbXBUeXBlVGV4dCA9PSBcIk1vbmV0YXJ5XCIpWzBdLkVtZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5Y291bnQgPSBjb21wRGF0YS5Db21wZW5zYXRpb25zLmZpbHRlcihtID0+IG0uQ29tcFR5cGVUZXh0ID09IFwiTW9uZXRhcnlcIilbMF0uRW1kcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5Db21wZW5zYXRpb25zLmZvckVhY2goKG5ld2NvbXBEYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdjb21wRGF0YS5FbWRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdjb21wRGF0YS5Db21wVHlwZVRleHQgPT0gXCJIb3RlbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmhvdGVsID0gbmV3Y29tcERhdGEuRW1kcy5maWx0ZXIobSA9PiBtLlByaW50U3RhdHVzID09IFwieVwiKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF4RGF0YS5ob3RlbCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmhvdGVsUHJpbnRTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdjb21wRGF0YS5Db21wVHlwZVRleHQgPT0gXCJNZWFsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubWVhbCA9IG5ld2NvbXBEYXRhLkVtZHMuZmlsdGVyKG0gPT4gbS5QcmludFN0YXR1cyA9PSBcInlcIikubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBheERhdGEubWVhbCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWxQcmludFN0YXR1cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGF4RGF0YS5tZWFsUHJpbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld2NvbXBEYXRhLkNvbXBUeXBlVGV4dCA9PSBcIlRyYW5zcG9ydGF0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEudHJhbnNwb3J0YXRpb24gPSBuZXdjb21wRGF0YS5FbWRzLmZpbHRlcihtID0+IG0uUHJpbnRTdGF0dXMgPT0gXCJ5XCIpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXhEYXRhLnRyYW5zcG9ydGF0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEudHJhbnNwb3J0UHJpbnRTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wRGF0YS5pc0VtYWlsU2VudCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuQ29tcGVuc2F0aW9ucy5mb3JFYWNoKChleGlFTUQsIGV4aUluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlFTUQuRW1kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpRU1ELkVtZHMuZm9yRWFjaCgoZW1kRGF0YSwgZW1kSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1kRGF0YS5FbWFpbFN0YXR1cyA9PSBcIm5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzRW1haWxTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeUVtYWlsU3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5pc0VtYWlsUGFyaXRhbGx5U2VudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0LnB1c2gocGF4RGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkLnB1c2gocGF4RGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5UHJpbnRTdGF0dXMgPSBjb21wRGF0YS5tb25ldGFyeVByaW50U3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuQ29tcGVuc2F0aW9ucy5mb3JFYWNoKChuZXdjb21wRGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Y29tcERhdGEuRW1kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Y29tcERhdGEuQ29tcFR5cGVUZXh0ID09IFwiSG90ZWxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuaG90ZWwgPSBuZXdjb21wRGF0YS5FbWRzLmZpbHRlcihtID0+IG0uUHJpbnRTdGF0dXMgPT0gXCJuXCIpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmhvdGVsUHJpbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Y29tcERhdGEuQ29tcFR5cGVUZXh0ID09IFwiTWVhbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5tZWFsID0gbmV3Y29tcERhdGEuRW1kcy5maWx0ZXIobSA9PiBtLlByaW50U3RhdHVzID09IFwiblwiKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5tZWFsUHJpbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Y29tcERhdGEuQ29tcFR5cGVUZXh0ID09IFwiVHJhbnNwb3J0YXRpb25cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEudHJhbnNwb3J0YXRpb24gPSBuZXdjb21wRGF0YS5FbWRzLmZpbHRlcihtID0+IG0uUHJpbnRTdGF0dXMgPT0gXCJuXCIpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLnRyYW5zcG9ydFByaW50U3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBEYXRhLmlzRW1haWxTZW50ID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5Db21wZW5zYXRpb25zLmZvckVhY2goKGV4aUVNRCwgZXhpSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aUVNRC5FbWRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGlFTUQuRW1kcy5mb3JFYWNoKChlbWREYXRhLCBlbWRJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWREYXRhLkVtYWlsU3RhdHVzID09IFwiblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmlzRW1haWxTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEubW9uZXRhcnlFbWFpbFN0YXR1cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmlzRW1haWxQYXJpdGFsbHlTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQucHVzaChjb21wRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdCBQcmludGVkXCIgKyBjb21wRGF0YS5GdWxsTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcERhdGEuaXNFbWFpbFNlbnQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZm9yRWFjaCgoZXhpRU1ELCBleGlJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpRU1ELkVtZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4aUVNRC5FbWRzLmZvckVhY2goKGVtZERhdGEsIGVtZEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtZERhdGEuRW1haWxTdGF0dXMgPT0gXCJuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuaXNFbWFpbFNlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5tb25ldGFyeUVtYWlsU3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuaXNFbWFpbFBhcml0YWxseVNlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZC5wdXNoKGNvbXBEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcmludGVkXCIgKyBjb21wRGF0YS5GdWxsTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wRGF0YS5Db21wZW5zYXRpb25zLmZpbHRlcihtID0+IG0uQ29tcFR5cGVUZXh0ID09IFwiTW9uZXRhcnlcIilbMF0uRW1kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEubW9uZXRhcnljb3VudCA9IGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZmlsdGVyKG0gPT4gbS5Db21wVHlwZVRleHQgPT0gXCJNb25ldGFyeVwiKVswXS5FbWRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLm1vbmV0YXJ5Y291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wRGF0YS5pc0VtYWlsU2VudCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5Db21wZW5zYXRpb25zLmZvckVhY2goKGV4aUVNRCwgZXhpSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpRU1ELkVtZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpRU1ELkVtZHMuZm9yRWFjaCgoZW1kRGF0YSwgZW1kSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWREYXRhLkVtYWlsU3RhdHVzID09IFwiblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuaXNFbWFpbFNlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmlzRW1haWxQYXJpdGFsbHlTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3RJc3N1ZWQucHVzaChjb21wRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wRGF0YS5tb25ldGFyeSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJpbnRlZCBtb25ldGFyeSA+IDBcIiArIGNvbXBEYXRhLkZ1bGxOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXhEYXRhID0gbmV3IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkZsaWdodFNlZ21lbnRJZCA9IGNvbXBEYXRhLkZsaWdodFNlZ21lbnRJZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuUGFzc2VuZ2VyU2VxID0gY29tcERhdGEuUGFzc2VuZ2VyU2VxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5PcmRlcklkID0gY29tcERhdGEuT3JkZXJJZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuR2l2ZW5OYW1lID0gY29tcERhdGEuR2l2ZW5OYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5MYXN0TmFtZSA9IGNvbXBEYXRhLkxhc3ROYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5GdWxsTmFtZSA9IGNvbXBEYXRhLkxhc3ROYW1lICsgXCIvXCIgKyBjb21wRGF0YS5HaXZlbk5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlBheFR5cGUgPSBjb21wRGF0YS5QYXhUeXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5GcXR2Q2MgPSBjb21wRGF0YS5GcXR2Q2M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkZxdHZOdW1iZXIgPSBjb21wRGF0YS5GcXR2TnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5QYXhTdGF0dXMgPSBjb21wRGF0YS5QYXhTdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlBheEVtYWlsQWRkcmVzcyA9IGNvbXBEYXRhLlBheEVtYWlsQWRkcmVzcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuQ29tcGVuc2F0aW9uUmVhc29uSWQgPSBjb21wRGF0YS5Db21wZW5zYXRpb25SZWFzb25JZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuSXNFeGlzdGluZ0NvbXBlbnNhdGlvbiA9IGNvbXBEYXRhLklzRXhpc3RpbmdDb21wZW5zYXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkN1c3RvbWVyQ2FyZUNhc2VOdW0gPSBjb21wRGF0YS5DdXN0b21lckNhcmVDYXNlTnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5Xb3JsZFRyYWNlck51bSA9IGNvbXBEYXRhLldvcmxkVHJhY2VyTnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5VcGRhdGVMb2NrTmJyID0gY29tcERhdGEuVXBkYXRlTG9ja05icjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRnF0dlRpZXIgPSBjb21wRGF0YS5GcXR2VGllcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuQ2FiaW4gPSBjb21wRGF0YS5DYWJpbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuUGF4UlBIID0gY29tcERhdGEuUGF4UlBIO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5PcmlnaW4gPSBjb21wRGF0YS5PcmlnaW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkRlc3QgPSBjb21wRGF0YS5EZXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5Jc0NvbXBlbnNhdGlvbklzc3VlZCA9IGNvbXBEYXRhLklzQ29tcGVuc2F0aW9uSXNzdWVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5TU1IgPSBjb21wRGF0YS5TU1I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkV0a3QgPSBjb21wRGF0YS5FdGt0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5SZWFjY29tRGV0YWlscyA9IGNvbXBEYXRhLlJlYWNjb21EZXRhaWxzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5BZGRpdGlvbmFsRGV0YWlscyA9IGNvbXBEYXRhLkFkZGl0aW9uYWxEZXRhaWxzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeSA9IGNvbXBEYXRhLm1vbmV0YXJ5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeVByaW50U3RhdHVzID0gY29tcERhdGEubW9uZXRhcnlQcmludFN0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuQ29tcGVuc2F0aW9ucyA9IGNvbXBEYXRhLkNvbXBlbnNhdGlvbnM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkV4aXN0aW5nQ29tcGVuc2F0aW9ucyA9IGNvbXBEYXRhLkV4aXN0aW5nQ29tcGVuc2F0aW9ucztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnllbmRvcnNlbWVudFRleHRJdGVtcyA9IGNvbXBEYXRhLm1vbmV0YXJ5ZW5kb3JzZW1lbnRUZXh0SXRlbXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLk1vbmV0YXJ5T3ZlcnJpZGVSZWFzb24gPSBjb21wRGF0YS5Nb25ldGFyeU92ZXJyaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsZW5kb3JzZW1lbnRUZXh0SXRlbXMgPSBjb21wRGF0YS5tZWFsZW5kb3JzZW1lbnRUZXh0SXRlbXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWxGcmVlVGV4dCA9IGNvbXBEYXRhLm1lYWxGcmVlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubWVhbERldGFpbHMgPSBjb21wRGF0YS5tZWFsRGV0YWlscztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuTWVhbE92ZXJyaWRlUmVhc29uID0gY29tcERhdGEuTWVhbE92ZXJyaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5ob3RlbGVuZG9yc2VtZW50VGV4dEl0ZW1zID0gY29tcERhdGEuaG90ZWxlbmRvcnNlbWVudFRleHRJdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWxGcmVlVGV4dCA9IGNvbXBEYXRhLmhvdGVsRnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkhvdGVsT3ZlcnJpZGVSZWFzb24gPSBjb21wRGF0YS5Ib3RlbE92ZXJyaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5ob3RlbERldGFpbHMgPSBjb21wRGF0YS5ob3RlbERldGFpbHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydGF0aW9uZW5kb3JzZW1lbnRUZXh0SXRlbXMgPSBjb21wRGF0YS50cmFuc3BvcnRhdGlvbmVuZG9yc2VtZW50VGV4dEl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS50cmFuc3BvcnRGcmVlVGV4dCA9IGNvbXBEYXRhLnRyYW5zcG9ydEZyZWVUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS50cmFuc3BvcnRFTUQgPSBjb21wRGF0YS50cmFuc3BvcnRFTUQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlRyYW5zcG9ydE92ZXJyaWRlUmVhc29uID0gY29tcERhdGEuVHJhbnNwb3J0T3ZlcnJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXMgPSBjb21wRGF0YS5tb25ldGFyeUVtYWlsU3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5ob3RlbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmhvdGVsUHJpbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubWVhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWxQcmludFN0YXR1cyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS50cmFuc3BvcnRhdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydFByaW50U3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkVtYWlsID0gY29tcERhdGEuRW1haWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzRW1haWxTZW50ID0gY29tcERhdGEuaXNFbWFpbFNlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzUGFyaXRhbGx5UHJpbnRlZCA9IGNvbXBEYXRhLmlzUGFyaXRhbGx5UHJpbnRlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXhEYXRhLmlzUGFyaXRhbGx5UHJpbnRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnlQcmludFN0YXR1cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcERhdGEuaXNFbWFpbFNlbnQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZm9yRWFjaCgoZXhpRU1ELCBleGlJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpRU1ELkVtZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4aUVNRC5FbWRzLmZvckVhY2goKGVtZERhdGEsIGVtZEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtZERhdGEuRW1haWxTdGF0dXMgPT0gXCJuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5pc0VtYWlsU2VudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnlFbWFpbFN0YXR1cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaXNFbWFpbFBhcml0YWxseVNlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeWNvdW50ID0gY29tcERhdGEuQ29tcGVuc2F0aW9ucy5maWx0ZXIobSA9PiBtLkNvbXBUeXBlVGV4dCA9PSBcIk1vbmV0YXJ5XCIpWzBdLkVtZHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdC5wdXNoKHBheERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZC5wdXNoKHBheERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wRGF0YS5pc0VtYWlsU2VudCA9PSB0cnVlICYmIGNvbXBEYXRhLmlzTm90UHJpbnRlZCA9PSB0cnVlICYmIGNvbXBEYXRhLmlzUGFyaXRhbGx5UHJpbnRlZCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlzRW1haWxTZW50ICYmIGlzTm90UHJpbnRlZFwiICsgY29tcERhdGEuRnVsbE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGF4RGF0YSA9IG5ldyBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzRW1haWxTZW50ID0gY29tcERhdGEuaXNFbWFpbFNlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnlFbWFpbFN0YXR1cyA9IGNvbXBEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZm9yRWFjaCgoZXhpRU1ELCBleGlJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aUVNRC5FbWRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpRU1ELkVtZHMuZm9yRWFjaCgoZW1kRGF0YSwgZW1kSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtZERhdGEuRW1haWxTdGF0dXMgPT0gXCJuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaXNFbWFpbFNlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeUVtYWlsU3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaXNFbWFpbFBhcml0YWxseVNlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5GbGlnaHRTZWdtZW50SWQgPSBjb21wRGF0YS5GbGlnaHRTZWdtZW50SWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuUGFzc2VuZ2VyU2VxID0gY29tcERhdGEuUGFzc2VuZ2VyU2VxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLk9yZGVySWQgPSBjb21wRGF0YS5PcmRlcklkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkdpdmVuTmFtZSA9IGNvbXBEYXRhLkdpdmVuTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5MYXN0TmFtZSA9IGNvbXBEYXRhLkxhc3ROYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkZ1bGxOYW1lID0gY29tcERhdGEuTGFzdE5hbWUgKyBcIi9cIiArIGNvbXBEYXRhLkdpdmVuTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5QYXhUeXBlID0gY29tcERhdGEuUGF4VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5GcXR2Q2MgPSBjb21wRGF0YS5GcXR2Q2M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRnF0dk51bWJlciA9IGNvbXBEYXRhLkZxdHZOdW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuUGF4U3RhdHVzID0gY29tcERhdGEuUGF4U3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlBheEVtYWlsQWRkcmVzcyA9IGNvbXBEYXRhLlBheEVtYWlsQWRkcmVzcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5Db21wZW5zYXRpb25SZWFzb25JZCA9IGNvbXBEYXRhLkNvbXBlbnNhdGlvblJlYXNvbklkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLklzRXhpc3RpbmdDb21wZW5zYXRpb24gPSBjb21wRGF0YS5Jc0V4aXN0aW5nQ29tcGVuc2F0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkN1c3RvbWVyQ2FyZUNhc2VOdW0gPSBjb21wRGF0YS5DdXN0b21lckNhcmVDYXNlTnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLldvcmxkVHJhY2VyTnVtID0gY29tcERhdGEuV29ybGRUcmFjZXJOdW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuVXBkYXRlTG9ja05iciA9IGNvbXBEYXRhLlVwZGF0ZUxvY2tOYnI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRnF0dlRpZXIgPSBjb21wRGF0YS5GcXR2VGllcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5DYWJpbiA9IGNvbXBEYXRhLkNhYmluO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlBheFJQSCA9IGNvbXBEYXRhLlBheFJQSDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5PcmlnaW4gPSBjb21wRGF0YS5PcmlnaW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRGVzdCA9IGNvbXBEYXRhLkRlc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuSXNDb21wZW5zYXRpb25Jc3N1ZWQgPSBjb21wRGF0YS5Jc0NvbXBlbnNhdGlvbklzc3VlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5TU1IgPSBjb21wRGF0YS5TU1I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRXRrdCA9IGNvbXBEYXRhLkV0a3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuUmVhY2NvbURldGFpbHMgPSBjb21wRGF0YS5SZWFjY29tRGV0YWlscztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5BZGRpdGlvbmFsRGV0YWlscyA9IGNvbXBEYXRhLkFkZGl0aW9uYWxEZXRhaWxzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5ID0gY29tcERhdGEubW9uZXRhcnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnlQcmludFN0YXR1cyA9IGNvbXBEYXRhLm1vbmV0YXJ5UHJpbnRTdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuQ29tcGVuc2F0aW9ucyA9IGNvbXBEYXRhLkNvbXBlbnNhdGlvbnM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRXhpc3RpbmdDb21wZW5zYXRpb25zID0gY29tcERhdGEuRXhpc3RpbmdDb21wZW5zYXRpb25zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5ZW5kb3JzZW1lbnRUZXh0SXRlbXMgPSBjb21wRGF0YS5tb25ldGFyeWVuZG9yc2VtZW50VGV4dEl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLk1vbmV0YXJ5T3ZlcnJpZGVSZWFzb24gPSBjb21wRGF0YS5Nb25ldGFyeU92ZXJyaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWxlbmRvcnNlbWVudFRleHRJdGVtcyA9IGNvbXBEYXRhLm1lYWxlbmRvcnNlbWVudFRleHRJdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsRnJlZVRleHQgPSBjb21wRGF0YS5tZWFsRnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubWVhbERldGFpbHMgPSBjb21wRGF0YS5tZWFsRGV0YWlscztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5NZWFsT3ZlcnJpZGVSZWFzb24gPSBjb21wRGF0YS5NZWFsT3ZlcnJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWxlbmRvcnNlbWVudFRleHRJdGVtcyA9IGNvbXBEYXRhLmhvdGVsZW5kb3JzZW1lbnRUZXh0SXRlbXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWxGcmVlVGV4dCA9IGNvbXBEYXRhLmhvdGVsRnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuSG90ZWxPdmVycmlkZVJlYXNvbiA9IGNvbXBEYXRhLkhvdGVsT3ZlcnJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWxEZXRhaWxzID0gY29tcERhdGEuaG90ZWxEZXRhaWxzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydGF0aW9uZW5kb3JzZW1lbnRUZXh0SXRlbXMgPSBjb21wRGF0YS50cmFuc3BvcnRhdGlvbmVuZG9yc2VtZW50VGV4dEl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydEZyZWVUZXh0ID0gY29tcERhdGEudHJhbnNwb3J0RnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEudHJhbnNwb3J0RU1EID0gY29tcERhdGEudHJhbnNwb3J0RU1EO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlRyYW5zcG9ydE92ZXJyaWRlUmVhc29uID0gY29tcERhdGEuVHJhbnNwb3J0T3ZlcnJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBheERhdGEubW9uZXRhcnlFbWFpbFN0YXR1cyA9IGNvbXBEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmhvdGVsUHJpbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsUHJpbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS50cmFuc3BvcnRhdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEudHJhbnNwb3J0UHJpbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5FbWFpbCA9IGNvbXBEYXRhLkVtYWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzUGFyaXRhbGx5UHJpbnRlZCA9IGNvbXBEYXRhLmlzUGFyaXRhbGx5UHJpbnRlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeWNvdW50ID0gY29tcERhdGEuQ29tcGVuc2F0aW9ucy5maWx0ZXIobSA9PiBtLkNvbXBUeXBlVGV4dCA9PSBcIk1vbmV0YXJ5XCIpWzBdLkVtZHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIDpcIiArIEpTT04uc3RyaW5naWZ5KHBheERhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdC5wdXNoKHBheERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkLnB1c2gocGF4RGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGlzZGV0YWlscyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdHRhYi50aXRsZSA9IFwiRU1EIFByaW50ZWRcIiArIFwiKFwiICsgdGhpcy5Db21wUGF4TGlzdElzc3VlZC5sZW5ndGggKyBcIilcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpc2RldGFpbHMucHVzaCh0aGlzLmZpcnN0dGFiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tUGF4UHJpbnRGdWxsTGlzdCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbVBheE5vdFByaW50RnVsbExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWNvbmR0YWIudGl0bGUgPSBcIkVNRCBBdmFpbGFibGUgZm9yIFByaW50XCIgKyBcIihcIiArIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQubGVuZ3RoICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5zZWNvbmR0YWIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZTogYW55ID0geyBldmVudE5hbWU6IFwic2VsZWN0ZWRJbmRleENoYW5nZWRcIiwgbmV3SW5kZXg6IDAsIG9sZEluZGV4OiAtMSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RTZWdtZW50KGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXR1czogYW55ID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSU4xXCIgKyBKU09OLnN0cmluZ2lmeShzdGF0dXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRDb21wZW5zYXRpb25GbGlnaHREZXRhaWxzKHN0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgQ29tcGF4TGlzdCA9IENvbnZlcnRlcnMuY29udmVydG9Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KENvbXBQYXgsIHN0YXR1cywgQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJTZWFyY2hMb2NhdGlvblwiLCBcIlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5QcmV2aW91c1BhZ2UgPT0gXCJpc3N1ZUNvbXBlbnNhdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IENvbXBheEZpbHRlcmVkTGlzdCA9IG5ldyBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUm9vdE9iamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRQYXNzZW5nZXIuZm9yRWFjaCgoU2VsUGF4LCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb21wYXhMaXN0LlBhc3Nlbmdlckxpc3QuZm9yRWFjaCgoQWxsUGF4LCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFNlbFBheC5PcmRlcklkID09IEFsbFBheC5PcmRlcklkICYmIFNlbFBheC5HaXZlbk5hbWUgPT0gQWxsUGF4LkdpdmVuTmFtZSAmJiBTZWxQYXguTGFzdE5hbWUgPT0gQWxsUGF4Lkxhc3ROYW1lICYmIFNlbFBheC5Db21wZW5zYXRpb25zWzBdLkNvbXBSZWFzb25UZXh0ID09IEFsbFBheC5Db21wZW5zYXRpb25zWzBdLkNvbXBSZWFzb25UZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29tcGF4RmlsdGVyZWRMaXN0LkZsaWdodE1vZGVsID0gQ29tcGF4TGlzdC5GbGlnaHRNb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb21wYXhGaWx0ZXJlZExpc3QuUGFzc2VuZ2VyTGlzdC5wdXNoKEFsbFBheCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29tcGF4TGlzdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29tcGF4TGlzdCA9IENvbXBheEZpbHRlcmVkTGlzdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0Q29tcGVuc2F0aW9uTGlzdChDb21wYXhGaWx0ZXJlZExpc3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0Q29tcGVuc2F0aW9uTGlzdChDb21wYXhMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGF4TGlzdCA9IG5ldyBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUm9vdE9iamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5uYXZpYWdhdGV0b0NvbXBlbnNhdGlvblByaW50TGlzdHdpdGh0YWIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGF4TGlzdCA9IENvbXBheExpc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5QYXhMaXN0LlBhc3Nlbmdlckxpc3QuZmlsdGVyKG0gPT4gbS5Jc0NvbXBlbnNhdGlvbklzc3VlZCA9PSB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUGF4IExpc3Q6XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLkNvbXBQYXhMaXN0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkZsaWdodEhlYWRlckluZm8gPSB0aGlzLlBheExpc3QuRmxpZ2h0TW9kZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsSXNzdWVkTW9uZXRhcnkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbElzc3VlZEhvdGVsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxJc3N1ZWRNZWFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxJc3N1ZWRUcmFuc3BvcnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbE5vdElzc3VlZE1vbmV0YXJ5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWxOb3RJc3N1ZWRIb3RlbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTm90SXNzdWVkTWVhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTm90SXNzdWVkVHJhbnNwb3J0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QuZm9yRWFjaCgoY29tcERhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuQ29tcGVuc2F0aW9ucy5mb3JFYWNoKChleGlFTUQsIGV4aUluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wRGF0YS5Db21wZW5zYXRpb25zLmZpbHRlcihtID0+IG0uQ29tcFR5cGVUZXh0ID09IFwiTW9uZXRhcnlcIilbMF0uRW1kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEubW9uZXRhcnljb3VudCA9IGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZmlsdGVyKG0gPT4gbS5Db21wVHlwZVRleHQgPT0gXCJNb25ldGFyeVwiKVswXS5FbWRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLm1vbmV0YXJ5Y291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlFTUQuRW1kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpRU1ELkVtZHMuZm9yRWFjaCgoZW1kRGF0YSwgZW1kSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZXhpRU1ELkNvbXBUeXBlVGV4dCAhPSBcIk1vbmV0YXJ5XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1kRGF0YS5QcmludFN0YXR1cyA9PSBcIm5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5pc05vdFByaW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1kRGF0YS5FbWFpbFN0YXR1cyA9PSBcInlcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5pc0VtYWlsU2VudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wRGF0YS5pc05vdFByaW50ZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5Db21wZW5zYXRpb25zLmZvckVhY2goKGV4aUVNRCwgZXhpSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlFTUQuRW1kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4aUVNRC5FbWRzLmZvckVhY2goKGVtZERhdGEsIGVtZEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWREYXRhLlByaW50U3RhdHVzID09IFwieVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5pc1Bhcml0YWxseVByaW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlFTUQuQ29tcFR5cGVUZXh0ID09IFwiTW9uZXRhcnlcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlFTUQuRW1kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGlFTUQuRW1kcy5mb3JFYWNoKChlbWREYXRhLCBlbWRJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtZERhdGEuUHJpbnRTdGF0dXMgPT0gXCJ5XCIgJiYgZXhpRU1ELkVtZHMuZmlsdGVyKG0gPT4gbS5QcmludFN0YXR1cyA9PSBcInlcIikubGVuZ3RoIDwgZXhpRU1ELkVtZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXhpRU1ELkVtZHMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhleGlFTUQuRW1kcy5maWx0ZXIobSA9PiBtLlByaW50U3RhdHVzID09IFwieVwiKS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmlzUGFyaXRhbGx5UHJpbnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEubW9uZXRhcnlQcmludFN0YXR1cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuaXNNb25ldGFyeVBhcml0YWxseVByaW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcERhdGEuaXNQYXJpdGFsbHlQcmludGVkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaXNQYXJpdGFsbHlQcmludGVkIFByaW50ZWRcIiArIGNvbXBEYXRhLkZ1bGxOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXhEYXRhID0gbmV3IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkZsaWdodFNlZ21lbnRJZCA9IGNvbXBEYXRhLkZsaWdodFNlZ21lbnRJZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuUGFzc2VuZ2VyU2VxID0gY29tcERhdGEuUGFzc2VuZ2VyU2VxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5PcmRlcklkID0gY29tcERhdGEuT3JkZXJJZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuR2l2ZW5OYW1lID0gY29tcERhdGEuR2l2ZW5OYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5MYXN0TmFtZSA9IGNvbXBEYXRhLkxhc3ROYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5GdWxsTmFtZSA9IGNvbXBEYXRhLkxhc3ROYW1lICsgXCIvXCIgKyBjb21wRGF0YS5HaXZlbk5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlBheFR5cGUgPSBjb21wRGF0YS5QYXhUeXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5GcXR2Q2MgPSBjb21wRGF0YS5GcXR2Q2M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkZxdHZOdW1iZXIgPSBjb21wRGF0YS5GcXR2TnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5QYXhTdGF0dXMgPSBjb21wRGF0YS5QYXhTdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlBheEVtYWlsQWRkcmVzcyA9IGNvbXBEYXRhLlBheEVtYWlsQWRkcmVzcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuQ29tcGVuc2F0aW9uUmVhc29uSWQgPSBjb21wRGF0YS5Db21wZW5zYXRpb25SZWFzb25JZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuSXNFeGlzdGluZ0NvbXBlbnNhdGlvbiA9IGNvbXBEYXRhLklzRXhpc3RpbmdDb21wZW5zYXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkN1c3RvbWVyQ2FyZUNhc2VOdW0gPSBjb21wRGF0YS5DdXN0b21lckNhcmVDYXNlTnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5Xb3JsZFRyYWNlck51bSA9IGNvbXBEYXRhLldvcmxkVHJhY2VyTnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5VcGRhdGVMb2NrTmJyID0gY29tcERhdGEuVXBkYXRlTG9ja05icjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRnF0dlRpZXIgPSBjb21wRGF0YS5GcXR2VGllcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuQ2FiaW4gPSBjb21wRGF0YS5DYWJpbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuUGF4UlBIID0gY29tcERhdGEuUGF4UlBIO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5PcmlnaW4gPSBjb21wRGF0YS5PcmlnaW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkRlc3QgPSBjb21wRGF0YS5EZXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5Jc0NvbXBlbnNhdGlvbklzc3VlZCA9IGNvbXBEYXRhLklzQ29tcGVuc2F0aW9uSXNzdWVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5TU1IgPSBjb21wRGF0YS5TU1I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkV0a3QgPSBjb21wRGF0YS5FdGt0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5SZWFjY29tRGV0YWlscyA9IGNvbXBEYXRhLlJlYWNjb21EZXRhaWxzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5BZGRpdGlvbmFsRGV0YWlscyA9IGNvbXBEYXRhLkFkZGl0aW9uYWxEZXRhaWxzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeSA9IGNvbXBEYXRhLm1vbmV0YXJ5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeVByaW50U3RhdHVzID0gY29tcERhdGEubW9uZXRhcnlQcmludFN0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuQ29tcGVuc2F0aW9ucyA9IGNvbXBEYXRhLkNvbXBlbnNhdGlvbnM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkV4aXN0aW5nQ29tcGVuc2F0aW9ucyA9IGNvbXBEYXRhLkV4aXN0aW5nQ29tcGVuc2F0aW9ucztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnllbmRvcnNlbWVudFRleHRJdGVtcyA9IGNvbXBEYXRhLm1vbmV0YXJ5ZW5kb3JzZW1lbnRUZXh0SXRlbXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLk1vbmV0YXJ5T3ZlcnJpZGVSZWFzb24gPSBjb21wRGF0YS5Nb25ldGFyeU92ZXJyaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsZW5kb3JzZW1lbnRUZXh0SXRlbXMgPSBjb21wRGF0YS5tZWFsZW5kb3JzZW1lbnRUZXh0SXRlbXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWxGcmVlVGV4dCA9IGNvbXBEYXRhLm1lYWxGcmVlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubWVhbERldGFpbHMgPSBjb21wRGF0YS5tZWFsRGV0YWlscztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuTWVhbE92ZXJyaWRlUmVhc29uID0gY29tcERhdGEuTWVhbE92ZXJyaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5ob3RlbGVuZG9yc2VtZW50VGV4dEl0ZW1zID0gY29tcERhdGEuaG90ZWxlbmRvcnNlbWVudFRleHRJdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWxGcmVlVGV4dCA9IGNvbXBEYXRhLmhvdGVsRnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkhvdGVsT3ZlcnJpZGVSZWFzb24gPSBjb21wRGF0YS5Ib3RlbE92ZXJyaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5ob3RlbERldGFpbHMgPSBjb21wRGF0YS5ob3RlbERldGFpbHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydGF0aW9uZW5kb3JzZW1lbnRUZXh0SXRlbXMgPSBjb21wRGF0YS50cmFuc3BvcnRhdGlvbmVuZG9yc2VtZW50VGV4dEl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS50cmFuc3BvcnRGcmVlVGV4dCA9IGNvbXBEYXRhLnRyYW5zcG9ydEZyZWVUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS50cmFuc3BvcnRFTUQgPSBjb21wRGF0YS50cmFuc3BvcnRFTUQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlRyYW5zcG9ydE92ZXJyaWRlUmVhc29uID0gY29tcERhdGEuVHJhbnNwb3J0T3ZlcnJpZGVSZWFzb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXMgPSBjb21wRGF0YS5tb25ldGFyeUVtYWlsU3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5FbWFpbCA9IGNvbXBEYXRhLkVtYWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5pc0VtYWlsU2VudCA9IGNvbXBEYXRhLmlzRW1haWxTZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5pc0VtYWlsUGFyaXRhbGx5U2VudCA9IGNvbXBEYXRhLmlzRW1haWxQYXJpdGFsbHlTZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOZXcgSW5zaWRlOlwiICsgY29tcERhdGEuaXNQYXJpdGFsbHlQcmludGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnlQcmludFN0YXR1cyA9IGNvbXBEYXRhLm1vbmV0YXJ5UHJpbnRTdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzUGFyaXRhbGx5UHJpbnRlZCA9IGNvbXBEYXRhLmlzUGFyaXRhbGx5UHJpbnRlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaXNNb25ldGFyeVBhcml0YWxseVByaW50ZWQgPSBjb21wRGF0YS5pc01vbmV0YXJ5UGFyaXRhbGx5UHJpbnRlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaXNNZWFsUGFyaXRhbGx5UHJpbnRlZCA9IGNvbXBEYXRhLmlzTWVhbFBhcml0YWxseVByaW50ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzSG90ZWxzUGFyaXRhbGx5UHJpbnRlZCA9IGNvbXBEYXRhLmlzSG90ZWxzUGFyaXRhbGx5UHJpbnRlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaXNUcmFuc3BvcnRQYXJpdGFsbHlQcmludGVkID0gY29tcERhdGEuaXNUcmFuc3BvcnRQYXJpdGFsbHlQcmludGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZmlsdGVyKG0gPT4gbS5Db21wVHlwZVRleHQgPT0gXCJNb25ldGFyeVwiKVswXS5FbWRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeWNvdW50ID0gY29tcERhdGEuQ29tcGVuc2F0aW9ucy5maWx0ZXIobSA9PiBtLkNvbXBUeXBlVGV4dCA9PSBcIk1vbmV0YXJ5XCIpWzBdLkVtZHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuQ29tcGVuc2F0aW9ucy5mb3JFYWNoKChuZXdjb21wRGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Y29tcERhdGEuRW1kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Y29tcERhdGEuQ29tcFR5cGVUZXh0ID09IFwiSG90ZWxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5ob3RlbCA9IG5ld2NvbXBEYXRhLkVtZHMuZmlsdGVyKG0gPT4gbS5QcmludFN0YXR1cyA9PSBcInlcIikubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBheERhdGEuaG90ZWwgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5ob3RlbFByaW50U3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3Y29tcERhdGEuQ29tcFR5cGVUZXh0ID09IFwiTWVhbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWwgPSBuZXdjb21wRGF0YS5FbWRzLmZpbHRlcihtID0+IG0uUHJpbnRTdGF0dXMgPT0gXCJ5XCIpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXhEYXRhLm1lYWwgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsUHJpbnRTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBheERhdGEubWVhbFByaW50U3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdjb21wRGF0YS5Db21wVHlwZVRleHQgPT0gXCJUcmFuc3BvcnRhdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydGF0aW9uID0gbmV3Y29tcERhdGEuRW1kcy5maWx0ZXIobSA9PiBtLlByaW50U3RhdHVzID09IFwieVwiKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF4RGF0YS50cmFuc3BvcnRhdGlvbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydFByaW50U3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcERhdGEuaXNFbWFpbFNlbnQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZm9yRWFjaCgoZXhpRU1ELCBleGlJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpRU1ELkVtZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4aUVNRC5FbWRzLmZvckVhY2goKGVtZERhdGEsIGVtZEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtZERhdGEuRW1haWxTdGF0dXMgPT0gXCJuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5pc0VtYWlsU2VudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnlFbWFpbFN0YXR1cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaXNFbWFpbFBhcml0YWxseVNlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdC5wdXNoKHBheERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZC5wdXNoKHBheERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeVByaW50U3RhdHVzID0gY29tcERhdGEubW9uZXRhcnlQcmludFN0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZm9yRWFjaCgobmV3Y29tcERhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld2NvbXBEYXRhLkVtZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld2NvbXBEYXRhLkNvbXBUeXBlVGV4dCA9PSBcIkhvdGVsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmhvdGVsID0gbmV3Y29tcERhdGEuRW1kcy5maWx0ZXIobSA9PiBtLlByaW50U3RhdHVzID09IFwiblwiKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5ob3RlbFByaW50U3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld2NvbXBEYXRhLkNvbXBUeXBlVGV4dCA9PSBcIk1lYWxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEubWVhbCA9IG5ld2NvbXBEYXRhLkVtZHMuZmlsdGVyKG0gPT4gbS5QcmludFN0YXR1cyA9PSBcIm5cIikubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEubWVhbFByaW50U3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld2NvbXBEYXRhLkNvbXBUeXBlVGV4dCA9PSBcIlRyYW5zcG9ydGF0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLnRyYW5zcG9ydGF0aW9uID0gbmV3Y29tcERhdGEuRW1kcy5maWx0ZXIobSA9PiBtLlByaW50U3RhdHVzID09IFwiblwiKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS50cmFuc3BvcnRQcmludFN0YXR1cyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wRGF0YS5pc0VtYWlsU2VudCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuQ29tcGVuc2F0aW9ucy5mb3JFYWNoKChleGlFTUQsIGV4aUluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlFTUQuRW1kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpRU1ELkVtZHMuZm9yRWFjaCgoZW1kRGF0YSwgZW1kSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1kRGF0YS5FbWFpbFN0YXR1cyA9PSBcIm5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5pc0VtYWlsU2VudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5pc0VtYWlsUGFyaXRhbGx5U2VudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLnB1c2goY29tcERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgUHJpbnRlZFwiICsgY29tcERhdGEuRnVsbE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBEYXRhLmlzRW1haWxTZW50ID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5Db21wZW5zYXRpb25zLmZvckVhY2goKGV4aUVNRCwgZXhpSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aUVNRC5FbWRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGlFTUQuRW1kcy5mb3JFYWNoKChlbWREYXRhLCBlbWRJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWREYXRhLkVtYWlsU3RhdHVzID09IFwiblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmlzRW1haWxTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEubW9uZXRhcnlFbWFpbFN0YXR1cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmlzRW1haWxQYXJpdGFsbHlTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQucHVzaChjb21wRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJpbnRlZFwiICsgY29tcERhdGEuRnVsbE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcERhdGEuQ29tcGVuc2F0aW9ucy5maWx0ZXIobSA9PiBtLkNvbXBUeXBlVGV4dCA9PSBcIk1vbmV0YXJ5XCIpWzBdLkVtZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLm1vbmV0YXJ5Y291bnQgPSBjb21wRGF0YS5Db21wZW5zYXRpb25zLmZpbHRlcihtID0+IG0uQ29tcFR5cGVUZXh0ID09IFwiTW9uZXRhcnlcIilbMF0uRW1kcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5tb25ldGFyeWNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcERhdGEuaXNFbWFpbFNlbnQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcERhdGEuQ29tcGVuc2F0aW9ucy5mb3JFYWNoKChleGlFTUQsIGV4aUluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aUVNRC5FbWRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4aUVNRC5FbWRzLmZvckVhY2goKGVtZERhdGEsIGVtZEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1kRGF0YS5FbWFpbFN0YXR1cyA9PSBcIm5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBEYXRhLmlzRW1haWxTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5tb25ldGFyeUVtYWlsU3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5pc0VtYWlsUGFyaXRhbGx5U2VudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkLnB1c2goY29tcERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcERhdGEubW9uZXRhcnkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByaW50ZWQgbW9uZXRhcnkgPiAwXCIgKyBjb21wRGF0YS5GdWxsTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGF4RGF0YSA9IG5ldyBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5GbGlnaHRTZWdtZW50SWQgPSBjb21wRGF0YS5GbGlnaHRTZWdtZW50SWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlBhc3NlbmdlclNlcSA9IGNvbXBEYXRhLlBhc3NlbmdlclNlcTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuT3JkZXJJZCA9IGNvbXBEYXRhLk9yZGVySWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkdpdmVuTmFtZSA9IGNvbXBEYXRhLkdpdmVuTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuTGFzdE5hbWUgPSBjb21wRGF0YS5MYXN0TmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRnVsbE5hbWUgPSBjb21wRGF0YS5MYXN0TmFtZSArIFwiL1wiICsgY29tcERhdGEuR2l2ZW5OYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5QYXhUeXBlID0gY29tcERhdGEuUGF4VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRnF0dkNjID0gY29tcERhdGEuRnF0dkNjO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5GcXR2TnVtYmVyID0gY29tcERhdGEuRnF0dk51bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuUGF4U3RhdHVzID0gY29tcERhdGEuUGF4U3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5QYXhFbWFpbEFkZHJlc3MgPSBjb21wRGF0YS5QYXhFbWFpbEFkZHJlc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkNvbXBlbnNhdGlvblJlYXNvbklkID0gY29tcERhdGEuQ29tcGVuc2F0aW9uUmVhc29uSWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLklzRXhpc3RpbmdDb21wZW5zYXRpb24gPSBjb21wRGF0YS5Jc0V4aXN0aW5nQ29tcGVuc2F0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5DdXN0b21lckNhcmVDYXNlTnVtID0gY29tcERhdGEuQ3VzdG9tZXJDYXJlQ2FzZU51bTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuV29ybGRUcmFjZXJOdW0gPSBjb21wRGF0YS5Xb3JsZFRyYWNlck51bTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuVXBkYXRlTG9ja05iciA9IGNvbXBEYXRhLlVwZGF0ZUxvY2tOYnI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkZxdHZUaWVyID0gY29tcERhdGEuRnF0dlRpZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkNhYmluID0gY29tcERhdGEuQ2FiaW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlBheFJQSCA9IGNvbXBEYXRhLlBheFJQSDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuT3JpZ2luID0gY29tcERhdGEuT3JpZ2luO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5EZXN0ID0gY29tcERhdGEuRGVzdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuSXNDb21wZW5zYXRpb25Jc3N1ZWQgPSBjb21wRGF0YS5Jc0NvbXBlbnNhdGlvbklzc3VlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuU1NSID0gY29tcERhdGEuU1NSO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5FdGt0ID0gY29tcERhdGEuRXRrdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuUmVhY2NvbURldGFpbHMgPSBjb21wRGF0YS5SZWFjY29tRGV0YWlscztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuQWRkaXRpb25hbERldGFpbHMgPSBjb21wRGF0YS5BZGRpdGlvbmFsRGV0YWlscztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnkgPSBjb21wRGF0YS5tb25ldGFyeTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnlQcmludFN0YXR1cyA9IGNvbXBEYXRhLm1vbmV0YXJ5UHJpbnRTdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkNvbXBlbnNhdGlvbnMgPSBjb21wRGF0YS5Db21wZW5zYXRpb25zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5FeGlzdGluZ0NvbXBlbnNhdGlvbnMgPSBjb21wRGF0YS5FeGlzdGluZ0NvbXBlbnNhdGlvbnM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5ZW5kb3JzZW1lbnRUZXh0SXRlbXMgPSBjb21wRGF0YS5tb25ldGFyeWVuZG9yc2VtZW50VGV4dEl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5Nb25ldGFyeU92ZXJyaWRlUmVhc29uID0gY29tcERhdGEuTW9uZXRhcnlPdmVycmlkZVJlYXNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubWVhbGVuZG9yc2VtZW50VGV4dEl0ZW1zID0gY29tcERhdGEubWVhbGVuZG9yc2VtZW50VGV4dEl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsRnJlZVRleHQgPSBjb21wRGF0YS5tZWFsRnJlZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWxEZXRhaWxzID0gY29tcERhdGEubWVhbERldGFpbHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLk1lYWxPdmVycmlkZVJlYXNvbiA9IGNvbXBEYXRhLk1lYWxPdmVycmlkZVJlYXNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWxlbmRvcnNlbWVudFRleHRJdGVtcyA9IGNvbXBEYXRhLmhvdGVsZW5kb3JzZW1lbnRUZXh0SXRlbXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmhvdGVsRnJlZVRleHQgPSBjb21wRGF0YS5ob3RlbEZyZWVUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5Ib3RlbE92ZXJyaWRlUmVhc29uID0gY29tcERhdGEuSG90ZWxPdmVycmlkZVJlYXNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWxEZXRhaWxzID0gY29tcERhdGEuaG90ZWxEZXRhaWxzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS50cmFuc3BvcnRhdGlvbmVuZG9yc2VtZW50VGV4dEl0ZW1zID0gY29tcERhdGEudHJhbnNwb3J0YXRpb25lbmRvcnNlbWVudFRleHRJdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEudHJhbnNwb3J0RnJlZVRleHQgPSBjb21wRGF0YS50cmFuc3BvcnRGcmVlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEudHJhbnNwb3J0RU1EID0gY29tcERhdGEudHJhbnNwb3J0RU1EO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5UcmFuc3BvcnRPdmVycmlkZVJlYXNvbiA9IGNvbXBEYXRhLlRyYW5zcG9ydE92ZXJyaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeUVtYWlsU3RhdHVzID0gY29tcERhdGEubW9uZXRhcnlFbWFpbFN0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaG90ZWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5ob3RlbFByaW50U3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsUHJpbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEudHJhbnNwb3J0YXRpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS50cmFuc3BvcnRQcmludFN0YXR1cyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5FbWFpbCA9IGNvbXBEYXRhLkVtYWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5pc0VtYWlsU2VudCA9IGNvbXBEYXRhLmlzRW1haWxTZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5pc1Bhcml0YWxseVByaW50ZWQgPSBjb21wRGF0YS5pc1Bhcml0YWxseVByaW50ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGF4RGF0YS5pc1Bhcml0YWxseVByaW50ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5UHJpbnRTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBEYXRhLmlzRW1haWxTZW50ID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5Db21wZW5zYXRpb25zLmZvckVhY2goKGV4aUVNRCwgZXhpSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aUVNRC5FbWRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGlFTUQuRW1kcy5mb3JFYWNoKChlbWREYXRhLCBlbWRJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWREYXRhLkVtYWlsU3RhdHVzID09IFwiblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuaXNFbWFpbFNlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzRW1haWxQYXJpdGFsbHlTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnljb3VudCA9IGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZmlsdGVyKG0gPT4gbS5Db21wVHlwZVRleHQgPT0gXCJNb25ldGFyeVwiKVswXS5FbWRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QucHVzaChwYXhEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQucHVzaChwYXhEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcERhdGEuaXNFbWFpbFNlbnQgPT0gdHJ1ZSAmJiBjb21wRGF0YS5pc05vdFByaW50ZWQgPT0gdHJ1ZSAmJiBjb21wRGF0YS5pc1Bhcml0YWxseVByaW50ZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc0VtYWlsU2VudCAmJiBpc05vdFByaW50ZWRcIiArIGNvbXBEYXRhLkZ1bGxOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBheERhdGEgPSBuZXcgQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5pc0VtYWlsU2VudCA9IGNvbXBEYXRhLmlzRW1haWxTZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXMgPSBjb21wRGF0YS5tb25ldGFyeUVtYWlsU3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wRGF0YS5Db21wZW5zYXRpb25zLmZvckVhY2goKGV4aUVNRCwgZXhpSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGlFTUQuRW1kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4aUVNRC5FbWRzLmZvckVhY2goKGVtZERhdGEsIGVtZEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWREYXRhLkVtYWlsU3RhdHVzID09IFwiblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzRW1haWxTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnlFbWFpbFN0YXR1cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmlzRW1haWxQYXJpdGFsbHlTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRmxpZ2h0U2VnbWVudElkID0gY29tcERhdGEuRmxpZ2h0U2VnbWVudElkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlBhc3NlbmdlclNlcSA9IGNvbXBEYXRhLlBhc3NlbmdlclNlcTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5PcmRlcklkID0gY29tcERhdGEuT3JkZXJJZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5HaXZlbk5hbWUgPSBjb21wRGF0YS5HaXZlbk5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuTGFzdE5hbWUgPSBjb21wRGF0YS5MYXN0TmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5GdWxsTmFtZSA9IGNvbXBEYXRhLkxhc3ROYW1lICsgXCIvXCIgKyBjb21wRGF0YS5HaXZlbk5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuUGF4VHlwZSA9IGNvbXBEYXRhLlBheFR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRnF0dkNjID0gY29tcERhdGEuRnF0dkNjO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkZxdHZOdW1iZXIgPSBjb21wRGF0YS5GcXR2TnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlBheFN0YXR1cyA9IGNvbXBEYXRhLlBheFN0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5QYXhFbWFpbEFkZHJlc3MgPSBjb21wRGF0YS5QYXhFbWFpbEFkZHJlc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuQ29tcGVuc2F0aW9uUmVhc29uSWQgPSBjb21wRGF0YS5Db21wZW5zYXRpb25SZWFzb25JZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5Jc0V4aXN0aW5nQ29tcGVuc2F0aW9uID0gY29tcERhdGEuSXNFeGlzdGluZ0NvbXBlbnNhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5DdXN0b21lckNhcmVDYXNlTnVtID0gY29tcERhdGEuQ3VzdG9tZXJDYXJlQ2FzZU51bTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5Xb3JsZFRyYWNlck51bSA9IGNvbXBEYXRhLldvcmxkVHJhY2VyTnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlVwZGF0ZUxvY2tOYnIgPSBjb21wRGF0YS5VcGRhdGVMb2NrTmJyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkZxdHZUaWVyID0gY29tcERhdGEuRnF0dlRpZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuQ2FiaW4gPSBjb21wRGF0YS5DYWJpbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5QYXhSUEggPSBjb21wRGF0YS5QYXhSUEg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuT3JpZ2luID0gY29tcERhdGEuT3JpZ2luO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkRlc3QgPSBjb21wRGF0YS5EZXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLklzQ29tcGVuc2F0aW9uSXNzdWVkID0gY29tcERhdGEuSXNDb21wZW5zYXRpb25Jc3N1ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuU1NSID0gY29tcERhdGEuU1NSO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkV0a3QgPSBjb21wRGF0YS5FdGt0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLlJlYWNjb21EZXRhaWxzID0gY29tcERhdGEuUmVhY2NvbURldGFpbHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuQWRkaXRpb25hbERldGFpbHMgPSBjb21wRGF0YS5BZGRpdGlvbmFsRGV0YWlscztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeSA9IGNvbXBEYXRhLm1vbmV0YXJ5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1vbmV0YXJ5UHJpbnRTdGF0dXMgPSBjb21wRGF0YS5tb25ldGFyeVByaW50U3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkNvbXBlbnNhdGlvbnMgPSBjb21wRGF0YS5Db21wZW5zYXRpb25zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkV4aXN0aW5nQ29tcGVuc2F0aW9ucyA9IGNvbXBEYXRhLkV4aXN0aW5nQ29tcGVuc2F0aW9ucztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tb25ldGFyeWVuZG9yc2VtZW50VGV4dEl0ZW1zID0gY29tcERhdGEubW9uZXRhcnllbmRvcnNlbWVudFRleHRJdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5Nb25ldGFyeU92ZXJyaWRlUmVhc29uID0gY29tcERhdGEuTW9uZXRhcnlPdmVycmlkZVJlYXNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5tZWFsZW5kb3JzZW1lbnRUZXh0SXRlbXMgPSBjb21wRGF0YS5tZWFsZW5kb3JzZW1lbnRUZXh0SXRlbXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubWVhbEZyZWVUZXh0ID0gY29tcERhdGEubWVhbEZyZWVUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLm1lYWxEZXRhaWxzID0gY29tcERhdGEubWVhbERldGFpbHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuTWVhbE92ZXJyaWRlUmVhc29uID0gY29tcERhdGEuTWVhbE92ZXJyaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmhvdGVsZW5kb3JzZW1lbnRUZXh0SXRlbXMgPSBjb21wRGF0YS5ob3RlbGVuZG9yc2VtZW50VGV4dEl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmhvdGVsRnJlZVRleHQgPSBjb21wRGF0YS5ob3RlbEZyZWVUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLkhvdGVsT3ZlcnJpZGVSZWFzb24gPSBjb21wRGF0YS5Ib3RlbE92ZXJyaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmhvdGVsRGV0YWlscyA9IGNvbXBEYXRhLmhvdGVsRGV0YWlscztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS50cmFuc3BvcnRhdGlvbmVuZG9yc2VtZW50VGV4dEl0ZW1zID0gY29tcERhdGEudHJhbnNwb3J0YXRpb25lbmRvcnNlbWVudFRleHRJdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS50cmFuc3BvcnRGcmVlVGV4dCA9IGNvbXBEYXRhLnRyYW5zcG9ydEZyZWVUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydEVNRCA9IGNvbXBEYXRhLnRyYW5zcG9ydEVNRDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5UcmFuc3BvcnRPdmVycmlkZVJlYXNvbiA9IGNvbXBEYXRhLlRyYW5zcG9ydE92ZXJyaWRlUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwYXhEYXRhLm1vbmV0YXJ5RW1haWxTdGF0dXMgPSBjb21wRGF0YS5tb25ldGFyeUVtYWlsU3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLmhvdGVsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5ob3RlbFByaW50U3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubWVhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubWVhbFByaW50U3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEudHJhbnNwb3J0YXRpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXhEYXRhLnRyYW5zcG9ydFByaW50U3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEuRW1haWwgPSBjb21wRGF0YS5FbWFpbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF4RGF0YS5pc1Bhcml0YWxseVByaW50ZWQgPSBjb21wRGF0YS5pc1Bhcml0YWxseVByaW50ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheERhdGEubW9uZXRhcnljb3VudCA9IGNvbXBEYXRhLkNvbXBlbnNhdGlvbnMuZmlsdGVyKG0gPT4gbS5Db21wVHlwZVRleHQgPT0gXCJNb25ldGFyeVwiKVswXS5FbWRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbCA6XCIgKyBKU09OLnN0cmluZ2lmeShwYXhEYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QucHVzaChwYXhEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZC5wdXNoKHBheERhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpc2RldGFpbHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3R0YWIudGl0bGUgPSBcIkVNRCBQcmludGVkXCIgKyBcIihcIiArIHRoaXMuQ29tcFBheExpc3RJc3N1ZWQubGVuZ3RoICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5maXJzdHRhYik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbVBheFByaW50RnVsbExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21QYXhOb3RQcmludEZ1bGxMaXN0ID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2Vjb25kdGFiLnRpdGxlID0gXCJFTUQgQXZhaWxhYmxlIGZvciBQcmludFwiICsgXCIoXCIgKyB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLmxlbmd0aCArIFwiKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGlzZGV0YWlscy5wdXNoKHRoaXMuc2Vjb25kdGFiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGU6IGFueSA9IHsgZXZlbnROYW1lOiBcInNlbGVjdGVkSW5kZXhDaGFuZ2VkXCIsIG5ld0luZGV4OiAwLCBvbGRJbmRleDogLTEgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0U2VnbWVudChlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGRhdGEuZXJyTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZG50IGZpbmQgaW5mb3JtYXRpb25cIiArIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHZhciBlRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IENvbXBlbnNhdGlvbkRldGFpbHMgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlRGF0ZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IENvbXBlbnNhdGlvbkRldGFpbHMgU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlRGF0ZSkpKTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIGRpc3BsYXlQcm9kdWN0QWN0aW9uRGlhbG9nRm9yUHJpbnRlcigpIHtcbiAgICAgICAgdmFyIGhvc3RlZGNoZWNrID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiaXNIb3N0Qm9hcmRpbmdcIik7XG4gICAgICAgIGlmIChob3N0ZWRjaGVjaykge1xuICAgICAgICAgICAgdGhpcy5wcmludEVNRCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ibHVldG9vdGhFTUQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBibHVldG9vdGhFTUQoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHZhciBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIEN1ckRhdGUgPSBtb21lbnQoc3RhcnREYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coQ3VyRGF0ZSlcbiAgICAgICAgICAgIHRoaXMuRmxpZ2h0SGVhZGVySW5mbyA9IHRoaXMuX3NoYXJlZC5nZXRGbGlnaHRIZWFkZXJJbmZvKCk7XG4gICAgICAgICAgICBsZXQgRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmU6IFByaW50TW9kdWxlLlJvb3RPYmplY3QgPSBDb252ZXJ0ZXJzLmNvbnZlcnRUb0JsdWV0b290aFByaW50RU1EQ29tcGVuc2F0aW9uKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIsIHRoaXMuRmxpZ2h0SGVhZGVySW5mbyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIFJlcTpcIiArIEpTT04uc3RyaW5naWZ5KEVtYWlsQ29tcGVuc2F0aW9uU3RydWN0dXJlKSk7XG4gICAgICAgICAgICBpZiAoRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmUuUGFzc2VuZ2VycyAhPSBbXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UucHJpbnRFTURCbHVldG9vdGhDb21wZW5zYXRpb25TZXJ2aWNlKEVtYWlsQ29tcGVuc2F0aW9uU3RydWN0dXJlKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbCBSZXM6XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlJhd0RhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuUmF3RGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbWFnZSA9IGltYWdlTW9kdWxlLmZyb21CYXNlNjQoZGF0YS5SYXdEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZm9sZGVyID0gZnMua25vd25Gb2xkZXJzLmRvY3VtZW50cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWxlbmFtZTogc3RyaW5nID0gbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdChcImhobW1zc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGF0aCA9IGZzLnBhdGguam9pbihmb2xkZXIucGF0aCwgXCJ0ZW1wQlBJbWFnZVwiICsgZmlsZW5hbWUgKyBcIi5qcGdcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2Uuc2F2ZVRvRmlsZShwYXRoLCBcImpwZWdcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcmludGVySUQgPSB0aGlzLmdldFByaW50ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByaW50ZXJJRC50cmltKCkgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHplYnJhLlByaW50ZXIoeyBhZGRyZXNzOiBwcmludGVySUQsIGxhbmd1YWdlOiBcIkNQQ0xcIiwgZGVidWdnaW5nOiBmYWxzZSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChjdXJQcmludGVyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRvY3VtZW50ID0gY3VyUHJpbnRlci5jcmVhdGVEb2N1bWVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5pbWFnZShmcy5wYXRoLmpvaW4oZm9sZGVyLnBhdGgsIFwidGVtcEJQSW1hZ2VcIiArIGZpbGVuYW1lICsgXCIuanBnXCIpLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyUHJpbnRlci5nZXRTdGF0dXMoKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnJlYWR5ICYmICFyZXN1bHQubGF0Y2hPcGVuICYmICFyZXN1bHQubG93QmF0dGVyeSAmJiAhcmVzdWx0LnBhcGVyT3V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wcmludGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1clByaW50ZXIucHJpbnQoZG9jdW1lbnQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByaW50aW5nIERvbmVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWxlID0gZm9sZGVyLmdldEZpbGUoXCJ0ZW1wQlBJbWFnZVwiICsgZmlsZW5hbWUgKyBcIi5qcGdcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUucmVtb3ZlKCkudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZpbGUgcmVtb3ZlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkJsdWV0b290aCBwcmludGVkIHN1Y2Vzc2Z1bGx5XCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IFNhdmVDb21wdGVtcGxhdGUgPSBDb252ZXJ0ZXJzLmNvbnZlcnRUb1NhdmVDb21wZW5zYXRpb25UZW1wbGF0ZUZvclByaW50KHNlbGYuU2VsZWN0ZWRQYXNzZW5nZXIsIHNlbGYuRmxpZ2h0SGVhZGVySW5mbyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2F2ZVwiICsgSlNPTi5zdHJpbmdpZnkoU2F2ZUNvbXB0ZW1wbGF0ZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9zZXJ2aWNlLnNhdmVCbHVldG9vdGhQcmludChTYXZlQ29tcHRlbXBsYXRlKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2V0Q29tcGVuc2F0aW9uTGlzdChzZWxmLkZsaWdodEhlYWRlckluZm8uRGVwYXJ0dXJlRGF0ZSwgc2VsZi5GbGlnaHRIZWFkZXJJbmZvLkZsaWdodE51bWJlciwgc2VsZi5TZWxlY3RlZFBhc3NlbmdlclswXS5PcmlnaW4sIFwiUmVhc29uV2lzZUdldFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW1haWwgUmVzOlwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyUHJpbnRlci5jbG9zZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJQcmludGVyIGlzIHJlYWR5IHRvIHByaW50XCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkVycm9yIE9jY3VyZWQgd2hpbGUgUHJpbnRpbmc6XCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJQcmludGVyLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKHN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzZWxmLl9zZXJ2aWNlLnNhdmVCbHVldG9vdGhQcmludChzZWxmLlNhdmVDb21wdGVtcGxhdGUpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgc2VsZi5nZXRDb21wZW5zYXRpb25MaXN0KHRoaXMuRmxpZ2h0SGVhZGVySW5mby5EZXBhcnR1cmVEYXRlLCB0aGlzLkZsaWdodEhlYWRlckluZm8uRmxpZ2h0TnVtYmVyLCB0aGlzLkZsaWdodEhlYWRlckluZm8uRGVwYXJ0dXJlQWlycG9ydCwgXCJSZWFzb25XaXNlR2V0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJFbWFpbCBSZXM6XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChDb21wZW5zYXRpb25QcmludFNjcmVlbkNvbXBvbmVudC5VTkFCTEVUT1BSSU5UKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmxhdGNoT3Blbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIiEhISFMYXRjaE9wZW5cIikuc2hvdygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQubG93QmF0dGVyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIiEhISFMb3dCYXR0ZXJ5XCIpLnNob3coKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnBhcGVyT3V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiISEhIVBhcGVyT3V0XCIpLnNob3coKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKHN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KENvbXBlbnNhdGlvblByaW50U2NyZWVuQ29tcG9uZW50LlBSSU5URVJTRVNTSU9OKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoQ29tcGVuc2F0aW9uUHJpbnRTY3JlZW5Db21wb25lbnQuTk9CTFVFVE9PVEhERVZJQ0UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChDb21wZW5zYXRpb25QcmludFNjcmVlbkNvbXBvbmVudC5VTkFCTEVUT1BSSU5UKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoQ29tcGVuc2F0aW9uUHJpbnRTY3JlZW5Db21wb25lbnQuVU5BQkxFVE9QUklOVCkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5nZXRDb21wZW5zYXRpb25MaXN0KHRoaXMuRmxpZ2h0SGVhZGVySW5mby5EZXBhcnR1cmVEYXRlLHRoaXMuRmxpZ2h0SGVhZGVySW5mby5GbGlnaHROdW1iZXIsdGhpcy5GbGlnaHRIZWFkZXJJbmZvLkRlcGFydHVyZUFpcnBvcnQsXCJSZWFzb25XaXNlR2V0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChkYXRhLkVycm9yc1swXS5NZXNzYWdlKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiTm8gRU1EIGF2aWxhYmxlIGZvciBwcmludFwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldFByaW50ZXIoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuaGFzS2V5KFwicHJpbnRlclwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwicHJpbnRlclwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRpc3BsYXlQcm9kdWN0QWN0aW9uRGlhbG9nRm9yU21hcnRGaWx0ZXIoKSB7XG4gICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgdGl0bGU6IFwiU21hcnQgZmlsdGVyIG9wdGlvblwiLFxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcIk5hbWVcIiwgXCJPcmRlciBJRFwiLCBcIkNsYXNzXCJdLFxuICAgICAgICB9O1xuICAgICAgICBkaWFsb2dzLmFjdGlvbihvcHRpb25zKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT0gXCJDYW5jZWxcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuU2VhcmNoQ3JpdGVyaWEgPSByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwcmludEVNRCgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgdmFyIHN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB2YXIgQ3VyRGF0ZSA9IG1vbWVudChzdGFydERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhDdXJEYXRlKVxuICAgICAgICAgICAgdmFyIERldmljZU5hbWUgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcImJvYXJkaW5nUGFzc0RldmljZU5hbWVcIiwgXCJcIik7XG4gICAgICAgICAgICBpZiAoRGV2aWNlTmFtZSA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJQbGVhc2Ugc2V0IHByaW50ZXIgaW4gc2V0dGluZ1wiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuRmxpZ2h0SGVhZGVySW5mbyA9IHRoaXMuX3NoYXJlZC5nZXRGbGlnaHRIZWFkZXJJbmZvKCk7XG4gICAgICAgICAgICAgICAgbGV0IEVtYWlsQ29tcGVuc2F0aW9uU3RydWN0dXJlOiBQcmludE1vZHVsZS5Sb290T2JqZWN0ID0gQ29udmVydGVycy5jb252ZXJ0VG9QcmludEVNRENvbXBlbnNhdGlvbih0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLCB0aGlzLkZsaWdodEhlYWRlckluZm8pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW1haWwgUmVxOlwiICsgSlNPTi5zdHJpbmdpZnkoRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmUpKTtcbiAgICAgICAgICAgICAgICBpZiAoRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmUuUGFzc2VuZ2VycyAhPSBbXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLnByaW50RU1EQ29tcGVuc2F0aW9uU2VydmljZShFbWFpbENvbXBlbnNhdGlvblN0cnVjdHVyZSkuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIFJlczpcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIlByaW50ZWQgc3VjY2Vzc2Z1bGx5XCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBlbnNhdGlvbkxpc3QodGhpcy5GbGlnaHRIZWFkZXJJbmZvLkRlcGFydHVyZURhdGUsIHRoaXMuRmxpZ2h0SGVhZGVySW5mby5GbGlnaHROdW1iZXIsIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXJbMF0uT3JpZ2luLCBcIlJlYXNvbldpc2VHZXRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiTm8gRU1EIGF2aWxhYmxlIGZvciBwcmludFwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbmF2aWdhdGV0b2FkZGl0aW9uYWxkZXRhaWxzKFBheGl0ZW06IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KTogdm9pZCB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVlwiICsgUGF4aXRlbSk7XG4gICAgICAgIGlmIChQYXhpdGVtLklzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHZhciBwcmVQYWdlOiBzdHJpbmcgPSBcIlByaW50TGlzdFwiO1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImNvbXBlbnNhdGlvbmFkZGl0aW9uYWxkZXRhaWxzXCJdLCB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICAgICAgfSwgcXVlcnlQYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJkYXRhXCI6IEpTT04uc3RyaW5naWZ5KFBheGl0ZW0pLFxuICAgICAgICAgICAgICAgICAgICBcInByZXBhZ2VcIjogcHJlUGFnZSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIGRpc3BsYXlTU1JzKGl0ZW06IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KSB7XG4gICAgICAgIGlmIChpdGVtLlNTUnNDb3VudCA+IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUlwiICsgSlNPTi5zdHJpbmdpZnkoaXRlbS5TU1JzKSk7XG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJTU1JzXCIsXG4gICAgICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgICAgICBhY3Rpb25zOiBpdGVtLlNTUnMsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIG5hdmlnYXRlVG9TZXR0aW5nKCkge1xuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wic2V0dGluZ1wiXSwge1xuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG5hdmlnYXRlVG9TZWFyY2goKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQ2hlY2tpbkRpc2FibGVkID09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZWFyY2hcIl0sIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBuYXZpZ2F0ZVRvRGVwYXJ0dXJlcygpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNHYXRlRGlzYWJsZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImRlcGFydGhvbWVcIl0sIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBuYXZpZ2F0ZVRvQ29tcGVuc2F0aW9uKCkge1xuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY29tcGVuc2F0aW9uXCJdLCB7XG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICBoYW5kbGVTZXJ2aWNlRXJyb3IoZXJyb3I6IGFueSkge1xuICAgICAgICB2YXIgZXJyb3JNZXNzYWdlID0gZXJyb3IudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKGVycm9yTWVzc2FnZS5pbmRleE9mKFwiU2Vzc2lvblRpbWVvdXRcIikgPiAtMSkge1xuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiU2Vzc2lvbiBUaW1lIE91dFwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiWW91ciBzZXNzaW9uIGhhcyBiZWVuIHRpbWUgb3V0XCIsXG4gICAgICAgICAgICAgICAgb2tCdXR0b25UZXh0OiBcIk9LXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkaWFsb2dzLmFsZXJ0KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJcIl0sIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZXJyb3JNZXNzYWdlKS5zaG93KCk7XG4gICAgICAgIH1cbiAgICB9XG59Il19