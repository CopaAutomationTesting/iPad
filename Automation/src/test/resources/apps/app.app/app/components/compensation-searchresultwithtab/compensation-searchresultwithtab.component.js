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
var country_modal_1 = require("../../components/country/country-modal");
var index_1 = require("../../shared/interface/index");
var index_2 = require("../../shared/services/index");
var index_3 = require("../../shared/model/index");
var index_4 = require("../../shared/utils/index");
var app_constants_1 = require("../../app.constants");
var app_executiontime_1 = require("../../app.executiontime");
var timeOut_service_1 = require("../../shared/services/timeOut.service");
var CompensationSearchResultWithTabComponent = /** @class */ (function () {
    function CompensationSearchResultWithTabComponent(_configuration, _services, activatedRouter, _shared, page, routerExtensions, _timeoutService, router, _dataService, _service, route, vcRef, _modalService) {
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
        this.checkedCount = 0;
        this.TotalPassengerCount = 0;
        this.selectedPassengerCount = 0;
        this.SelectedPassenger = [];
        this.SelectedIssuePassenger = [];
        this.CompensationPassengerList = [];
        this.CompensationFullPaxList = [];
        this.CompensationModel = new index_1.CompensationSearchModule.CompensationRootObject;
        this.CompensationReasonList = [];
        this.AgentPrivilage = new index_3.AgentPrivilage.RootObject();
        this.PaxList = new index_1.CompensationSearchModule.CompensationRootObject();
        this.SelectAllPaxVar = false;
        this.IsPaxReasonSelected = false;
        this.nameSortIndicator = -1;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.CompensationIssuedList = true;
        this.CompensationNotIssuedList = false;
        this.CompensatedPaxCount = 0;
        this.SearchCriteria = "Name";
        this.PassengerFliterCriteria = "All Passengers";
        this.CompensationNotIssuedPaxCount = 0;
        this.FlightHeaderInfo = new index_1.CompensationSearchModule.FlightModel();
        this.CompPaxList = [];
        this.ConstCompPaxList = [];
        this.CompPaxListIssued = [];
        this.CompPaxListNotIssued = [];
        this.CompPaxListIssuedFulList = [];
        this.CompPaxListNotIssuedFulList = [];
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.isError = false;
        this.errorMessage = "";
        this.SearchFields.FlightDate = moment().format("DD MMMM YYYY");
        this.CurDate = moment().toDate();
        this.startDate = new Date();
        this.apisdetails = [];
        this.firsttab.title = CompensationSearchResultWithTabComponent_1.COMPENSATEDPAXTABTITLE;
        this.apisdetails.push(this.firsttab);
        this.secondtab.title = CompensationSearchResultWithTabComponent_1.NOTCOMPENSATEDPAXTABTITLE;
        this.apisdetails.push(this.secondtab);
        this.loaderProgress = new index_1.LoaderProgress();
    }
    CompensationSearchResultWithTabComponent_1 = CompensationSearchResultWithTabComponent;
    CompensationSearchResultWithTabComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.ComensationReason = CompensationSearchResultWithTabComponent_1.COMPENSATIONREASON;
        this.loaderProgress.initLoader(this.pageCont);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.getCompensationReason();
        this.PaxList = this._shared.getCompensationList();
        console.log("PAX new" + JSON.stringify(this.PaxList.FlightModel));
        this.CompPaxList = this.PaxList.PassengerList;
        this.ConstCompPaxList = this.CompPaxList;
        this._shared.setCompensationPaxList(this.CompPaxList);
        this._shared.setFlightHeaderInfo(this.PaxList.FlightModel);
        this.FlightHeaderInfo = this.PaxList.FlightModel;
        this.CompPaxList.forEach(function (data, Index) {
            if (data.IsCompensationIssued == true) {
                _this.CompPaxListIssued.push(data);
            }
            else {
                _this.CompPaxListNotIssued.push(data);
            }
        });
        this.apisdetails = [];
        this.CompPaxListIssuedFulList = this.CompPaxListIssued;
        this.CompPaxList = this.CompPaxListIssuedFulList;
        this.CompensatedPaxCount = this.CompPaxListIssuedFulList.length;
        this.firsttab.title = CompensationSearchResultWithTabComponent_1.COMPENSATEDPAXTABTITLE + "(" + this.CompensatedPaxCount + ")";
        this.apisdetails.push(this.firsttab);
        this.CompPaxListNotIssuedFulList = this.CompPaxListNotIssued;
        this.CompensationNotIssuedPaxCount = this.CompPaxListNotIssuedFulList.length;
        this.secondtab.title = CompensationSearchResultWithTabComponent_1.NOTCOMPENSATEDPAXTABTITLE + "(" + this.CompensationNotIssuedPaxCount + ")";
        this.apisdetails.push(this.secondtab);
        // console.log("Comp Issued" + JSON.stringify(this.CompPaxListIssued));
        // console.log("Comp Not Issued" + JSON.stringify(this.CompensationNotIssuedPaxCount));
        // console.log("Res:" + JSON.stringify(this.FlightDetails));
    };
    CompensationSearchResultWithTabComponent.prototype.toggleChecked = function (pax) {
        var _this = this;
        if (this.CompensationNotIssuedList == true) {
            if (pax.IsSelected == false) {
                pax.IsSelected = true;
                this.SelectedPassenger.push(pax);
                // if (this.CompPaxList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
                if (this.ComensationReason != CompensationSearchResultWithTabComponent_1.COMPENSATIONREASON) {
                    pax.CompensationReason = this.ComensationReason;
                    pax.CompensationReasonId = this.CompensationReasonList.filter(function (m) { return m.CompReasonText == _this.ComensationReason; })[0].CompReasonId;
                }
            }
            else {
                this.SelectedPassenger.splice(this.SelectedPassenger.indexOf(pax), 1);
                this.IsPaxReasonSelected = false;
                pax.IsSelected = false;
                this.SelectAllPax = false;
            }
            if (this.CompPaxListNotIssuedFulList.length === this.SelectedPassenger.length)
                this.SelectAllPax = true;
        }
        this.selectedPassengerCount = this.SelectedPassenger.length;
        // else {
        //     if (pax.IsSelected == false) {
        //         pax.IsSelected = true;
        //         this.SelectedIssuePassenger.push(pax);
        //     } else {
        //         this.SelectedIssuePassenger.splice(this.SelectedIssuePassenger.indexOf(pax), 1);
        //         pax.IsSelected = false;
        //     }
        // }
        // console.log(JSON.stringify(this.SelectedPassenger));
    };
    CompensationSearchResultWithTabComponent.prototype.selectSegment = function (e) {
        var selInd = e.newIndex;
        this.SelectedPassenger = [];
        if (selInd == 0) {
            this.CompensationIssuedList = true;
            this.CompensationNotIssuedList = false;
            this.SelectAllPax = false;
            this.SearchCriteria = "Name";
            this.searchField = undefined;
            // this.CompPaxListIssued = this.CompPaxList.filter(m=>m.IsCompensationIssued == true);
            this.CompPaxListNotIssued.forEach(function (data, Index) {
                data.IsSelected = false;
            });
            this.CompPaxList = this.CompPaxListIssuedFulList;
            this.selectedPassengerCount = 0;
            this.TotalPassengerCount = this.CompPaxListIssuedFulList.length;
            console.log("Issued" + this.CompPaxListIssued.length);
        }
        else {
            this.CompensationIssuedList = false;
            this.CompensationNotIssuedList = true;
            this.SearchCriteria = "Name";
            this.searchField = undefined;
            // this.CompPaxListNotIssued = this.CompPaxList.filter(m=>m.IsCompensationIssued == false);
            this.CompPaxList = this.CompPaxListNotIssuedFulList;
            this.selectedPassengerCount = 0;
            this.TotalPassengerCount = this.CompPaxListNotIssuedFulList.length;
            console.log("Not Issued" + this.CompPaxListNotIssued.length);
        }
    };
    CompensationSearchResultWithTabComponent.prototype.printEnabled = function () {
        var _this = this;
        if (this.SelectedPassenger.length != 0) {
            this.SelectedPassenger.forEach(function (data, index) {
                if (data.IsCompensationIssued == true) {
                    _this.IsPaxReasonSelected = true;
                }
            });
        }
        if (this.IsPaxReasonSelected == true) {
            return true;
        }
        else
            return false;
    };
    CompensationSearchResultWithTabComponent.prototype.emailEnabled = function () {
        var _this = this;
        if (this.SelectedPassenger.length != 0) {
            this.SelectedPassenger.forEach(function (data, index) {
                if (data.IsCompensationIssued == true) {
                    _this.IsPaxReasonSelected = true;
                }
            });
        }
        if (this.IsPaxReasonSelected == true) {
            return true;
        }
        else
            return false;
    };
    CompensationSearchResultWithTabComponent.prototype.saveEnabled = function () {
        var _this = this;
        if (this.SelectedPassenger != []) {
            this.SelectedPassenger.forEach(function (data, index) {
                if (data.CompensationReason != "") {
                    _this.IsPaxReasonSelected = true;
                }
            });
        }
        if (this.IsPaxReasonSelected == true) {
            return true;
        }
        else
            return false;
    };
    CompensationSearchResultWithTabComponent.prototype.continueEnabled = function () {
        var _this = this;
        if (this.SelectedPassenger != []) {
            this.SelectedPassenger.forEach(function (data, index) {
                if (data.CompensationReason != "") {
                    _this.IsPaxReasonSelected = true;
                }
                else {
                    _this.IsPaxReasonSelected = false;
                }
            });
        }
        else {
            this.IsPaxReasonSelected = false;
        }
        if (this.IsPaxReasonSelected == true) {
            return true;
        }
        else
            return false;
    };
    CompensationSearchResultWithTabComponent.prototype.deleteEnabled = function () {
        if (this.SelectedPassenger.length > 0) {
            this.IsPaxReasonSelected = true;
        }
        else {
            this.IsPaxReasonSelected = false;
        }
        if (this.IsPaxReasonSelected == true) {
            return true;
        }
        else
            return false;
    };
    CompensationSearchResultWithTabComponent.prototype.filter = function (args) {
        // console.log("Name:" + JSON.stringify(args));
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
            if (this.CompPaxListNotIssuedFulList.length === this.SelectedPassenger.length)
                this.SelectAllPax = true;
        }
    };
    CompensationSearchResultWithTabComponent.prototype.displayProductActionDialogForSmartFilter = function () {
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
    CompensationSearchResultWithTabComponent.prototype.displayDialogForFliterPassengerType = function () {
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
    CompensationSearchResultWithTabComponent.prototype.displayProductActionDialog = function () {
        var _this = this;
        var options = {
            viewContainerRef: this.vcRef,
            context: [{ country: this.CompensationReason }],
            fullscreen: false
        };
        this._modalService
            .showModal(country_modal_1.CreatingListPickerComponent, options)
            .then(function (result) {
            console.log("date result " + result);
            if (result) {
                _this.ComensationReason = result;
                _this.SelectedPassenger.forEach(function (data, Index) {
                    data.CompensationReason = result;
                    data.CompensationReasonId = _this.CompensationReasonList.filter(function (m) { return m.CompReasonText == _this.ComensationReason; })[0].CompReasonId;
                });
                // this.SearchFields.Location = result.substr(0, 3);
                console.log("out" + result);
            }
        });
    };
    CompensationSearchResultWithTabComponent.prototype.getCompensationReason = function () {
        var _this = this;
        try {
            console.log("Reason 1");
            var ReasonRequest = this._shared.getAgentPrivilage();
            this.AgentPrivilage.Privileges = ReasonRequest;
            // console.log("Pri:" + JSON.stringify(this.AgentPrivilage));
            this.loaderProgress.showLoader();
            var sDate = new Date();
            var CompensationRequestObj;
            CompensationRequestObj = { "Privileges": this.AgentPrivilage.Privileges, "AirlineCode": ApplicationSettings.getString("carrierCode", "") };
            console.log('Get GetCompensationReason Service --------------- Start Date Time : ' + sDate);
            this._service.getCompensationReasons(CompensationRequestObj)
                .subscribe(function (data) {
                if (data.CompensationReason != null) {
                    var CompansationDetails = data;
                    CompansationDetails.CompensationReason.forEach(function (KeyValue, Index) {
                        var compreason = new index_1.CompensationReasonModule.CompensationReason();
                        compreason.CompReasonText = KeyValue.CompReasonText;
                        compreason.CompReasonId = KeyValue.CompReasonId;
                        _this.CompensationReasonList.push(compreason);
                        _this.CompensationReason.push(KeyValue.CompReasonText);
                        _this.CompensationReason.sort(function (a, b) {
                            if (a < b)
                                return -1;
                            if (a > b)
                                return 1;
                            return 0;
                        });
                    });
                    _this.loaderProgress.hideLoader();
                }
                else {
                    Toast.makeText(CompensationSearchResultWithTabComponent_1.COMPENSATIONREASONTOAST + data.Errors[0].Message).show();
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
        finally {
            var endDate = new Date();
            console.log('CheckInPax Service --------------- End Date Time : ' + endDate);
            console.log('CheckInPax Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(endDate)));
        }
    };
    CompensationSearchResultWithTabComponent.prototype.displayProductActionDialogForPrinter = function () {
        var _this = this;
        var options = {
            title: "Smart filter option",
            cancelButtonText: "Cancel",
            actions: ["Bluetooth Printer", "Host Printer"],
        };
        dialogs.action(options).then(function (result) {
            if (result != "Cancel") {
                if (result == "Bluetooth Printer") {
                    _this.bluetoothEMD();
                }
                else {
                    _this.printEMD();
                }
            }
        });
    };
    CompensationSearchResultWithTabComponent.prototype.bluetoothEMD = function () {
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
                    if (data.Success) {
                        _this.loaderProgress.hideLoader();
                        if (data.RawData) {
                            var image = imageModule.fromBase64(data.RawData);
                            var folder_1 = fs.knownFolders.ios.library();
                            var path = fs.path.join(folder_1.path, "tempBPImage.jpg");
                            try {
                                image.saveToFile(path, "jpeg");
                                var printerID = _this.getPrinter();
                                if (printerID.trim() != "") {
                                    new zebra.Printer({ address: printerID, language: "CPCL", debugging: false })
                                        .then(function (curPrinter, result) {
                                        var document = curPrinter.createDocument();
                                        document.image(fs.path.join(folder_1.path, "tempBPImage.jpg"), 0);
                                        Toast.makeText("Bluetooth printed sucessfully").show();
                                        curPrinter.print(document).then(function () {
                                            console.log("Printing Done");
                                            curPrinter.close().then(function () {
                                                Toast.makeText("Printer is ready to print").show();
                                            })
                                                .catch(function (err) {
                                                Toast.makeText("Error Occured while Printing:").show();
                                                curPrinter.close();
                                            });
                                        })
                                            .catch(function (status) {
                                            console.log(status);
                                            Toast.makeText("CheckInComponent.UNABLETOPRINT").show();
                                        });
                                    }).catch(function (err) {
                                        Toast.makeText("CheckInComponent.PRINTERSESSION").show();
                                        console.log(err);
                                    });
                                }
                                else {
                                    Toast.makeText("CheckInComponent.NOBLUETOOTHDEVICE").show();
                                }
                            }
                            catch (e) {
                                Toast.makeText("CheckInComponent.UNABLETOPRINT").show();
                            }
                        }
                        else {
                            Toast.makeText("CheckInComponent.UNABLETOPRINT").show();
                        }
                        // this.getCompensationList(this.FlightHeaderInfo.DepartureDate,this.FlightHeaderInfo.FlightNumber,this.FlightHeaderInfo.DepartureAirport,"ReasonWiseGet");
                        // Toast.makeText(data.Errors[0].Message).show();
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
    CompensationSearchResultWithTabComponent.prototype.getPrinter = function () {
        if (ApplicationSettings.hasKey("printer")) {
            return ApplicationSettings.getString("printer");
        }
        else {
            return "";
        }
    };
    CompensationSearchResultWithTabComponent.prototype.printEMD = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var startDate = new Date();
            var CurDate = moment(startDate).format("YYYY-MM-DD");
            console.log(CurDate);
            this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
            var EmailCompensationStructure = index_4.Converters.convertToPrintEMDCompensation(this.SelectedPassenger, this.FlightHeaderInfo);
            console.log("Email Req:" + JSON.stringify(EmailCompensationStructure));
            if (EmailCompensationStructure.Passengers != []) {
                this._service.printEMDCompensationService(EmailCompensationStructure).subscribe(function (data) {
                    console.log("Email Res:" + JSON.stringify(data));
                    if (data.Success) {
                        _this.loaderProgress.hideLoader();
                        _this.getCompensationList(_this.FlightHeaderInfo.DepartureDate, _this.FlightHeaderInfo.FlightNumber, _this.FlightHeaderInfo.DepartureAirport, "ReasonWiseGet");
                        // Toast.makeText(data.Errors[0].Message).show();
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
    CompensationSearchResultWithTabComponent.prototype.selectingAllPax = function () {
        var _this = this;
        if (this.SelectAllPax == false && this.SelectAllPaxVar == false) {
            this.SelectAllPaxVar = true;
            this.CompPaxList.forEach(function (data, index) {
                if (!data.IsSelected) {
                    data.IsSelected = true;
                    _this.SelectedPassenger.push(data);
                    if (_this.ComensationReason != CompensationSearchResultWithTabComponent_1.COMPENSATIONREASON) {
                        data.CompensationReason = _this.ComensationReason;
                    }
                }
            });
            if (this.CompPaxListNotIssuedFulList.length === this.SelectedPassenger.length)
                this.SelectAllPax = true;
        }
        else {
            this.SelectAllPaxVar = false;
            this.SelectAllPax = false;
            this.SelectedPassenger = [];
            this.CompPaxList.forEach(function (data, index) {
                data.IsSelected = false;
                // data.CompensationReason = "";
            });
        }
        this.selectedPassengerCount = this.SelectedPassenger.length;
    };
    CompensationSearchResultWithTabComponent.prototype.delete = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('SaveCompensation Service --------------- Start Date Time : ' + sDate);
            var SaveComptemplate = index_4.Converters.convertToDeleteCompensationTemplate(this.SelectedPassenger, this.FlightHeaderInfo);
            console.log("Data1:" + JSON.stringify(SaveComptemplate));
            this._service.deleteCompensationReasons(SaveComptemplate)
                .subscribe(function (data) {
                if (data.Results != null) {
                    var CompansationDetails = data;
                    console.log("Data:" + JSON.stringify(data));
                    _this.SelectedPassenger.forEach(function (data, index) {
                        data.IsSelected = false;
                    });
                    Toast.makeText("Deleted successfully").show();
                    _this.SelectedPassenger = [];
                    _this.loaderProgress.hideLoader();
                }
                else {
                    var CompansationDetails = data;
                    console.log("Data:" + JSON.stringify(data));
                    _this.SelectedPassenger.forEach(function (data, index) {
                        data.IsSelected = false;
                    });
                    _this.SelectedPassenger = [];
                    Toast.makeText(data.Errors[0].Message).show();
                    _this.loaderProgress.hideLoader();
                }
                _this.SelectedPassenger = [];
                var flightDate = _this.PaxList.FlightModel.DepartureDate;
                var flightNumber = _this.PaxList.FlightModel.FlightNumber;
                var location = _this.PaxList.FlightModel.DepartureAirport;
                _this.getCompensationList(flightDate, flightNumber, location, CompensationSearchResultWithTabComponent_1.PAXTYPE);
            }, function (err) {
                _this.handleServiceError(err);
                _this.loaderProgress.hideLoader();
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var endDate = new Date();
            console.log('SaveCompensation Service --------------- End Date Time : ' + endDate);
            console.log('SaveCompensation Service Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(endDate)));
        }
    };
    CompensationSearchResultWithTabComponent.prototype.save = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('SaveCompensation Service --------------- Start Date Time : ' + sDate);
            var SaveComptemplate = index_4.Converters.convertToSaveCompensationTemplate(this.SelectedPassenger, this.FlightHeaderInfo);
            console.log("Data1:" + JSON.stringify(SaveComptemplate));
            this._service.saveCompensationReasons(SaveComptemplate)
                .subscribe(function (data) {
                var CompansationDetails = data;
                console.log("Data:" + JSON.stringify(data));
                _this.SelectedPassenger.forEach(function (data, index) {
                    data.IsSelected = false;
                });
                _this.SelectedPassenger = [];
                var flightDate = _this.PaxList.FlightModel.DepartureDate;
                var flightNumber = _this.PaxList.FlightModel.FlightNumber;
                var location = _this.PaxList.FlightModel.DepartureAirport;
                _this.getCompensationList(flightDate, flightNumber, location, CompensationSearchResultWithTabComponent_1.PAXTYPE);
            }, function (err) {
                _this.handleServiceError(err);
                _this.loaderProgress.hideLoader();
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var endDate = new Date();
            console.log('SaveCompensation Service --------------- End Date Time : ' + endDate);
            console.log('SaveCompensation Service Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(endDate)));
        }
    };
    CompensationSearchResultWithTabComponent.prototype.getCompensationList = function (date, flight, location, paxtype) {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetPassengerType Service --------------- Start Date Time : ' + sDate);
            this._service.getCompensationPaxList(date, flight, location, paxtype).subscribe(function (data) {
                if (data.Results) {
                    if (data.Results[0].FlightSegments[0].Passengers != undefined) {
                        console.log("Comp list new logic ");
                        var CompansationDetails = data;
                        _this.flightStatusForCompensationList(date, flight, CompansationDetails);
                    }
                    else {
                        console.log("Comp list new logic else");
                        Toast.makeText(CompensationSearchResultWithTabComponent_1.DATANOTFOUNDTOAST).show();
                        _this.navigateToCompensation();
                    }
                }
                else {
                    Toast.makeText(data.Errors[0].message).show();
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
    CompensationSearchResultWithTabComponent.prototype.flightStatusForCompensationList = function (date, flight, CompPax) {
        var _this = this;
        try {
            var sDate = new Date();
            console.log('Get CompensationDetails Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            var date = date;
            var flightnumber = flight;
            var location = ApplicationSettings.getString("SearchLocation", "");
            this._service.status(date, flightnumber, location).subscribe(function (data) {
                if (data.BadRequest != 400) {
                    if (data.Flights != null) {
                        var status_1 = data;
                        // console.log("IN1" + JSON.stringify(status));
                        _this._shared.setCompensationFlightDetails(data);
                        var flightStatus = index_4.Converters.convertToFlightHeaderInfo(data, ApplicationSettings.getString("SearchLocation", ""));
                        _this._shared.setFlightHeaderInfo(flightStatus);
                        _this.CompPaxList.length = 0;
                        _this.PaxList = index_4.Converters.convertoCompensationPassengerList(CompPax, data, ApplicationSettings.getString("SearchLocation", ""));
                        _this.CompPaxList = _this.PaxList.PassengerList;
                        _this.CompPaxListIssued.length = 0;
                        _this.CompPaxListNotIssued.length = 0;
                        _this.CompPaxList.forEach(function (data, Index) {
                            if (data.IsCompensationIssued == true) {
                                _this.CompPaxListIssued.push(data);
                            }
                            else {
                                _this.CompPaxListNotIssued.push(data);
                            }
                        });
                        _this.apisdetails = [];
                        _this.CompensatedPaxCount = _this.CompPaxListIssued.length;
                        _this.firsttab.title = CompensationSearchResultWithTabComponent_1.COMPENSATEDPAXTABTITLE + "(" + _this.CompensatedPaxCount + ")";
                        _this.apisdetails.push(_this.firsttab);
                        _this.CompensationNotIssuedPaxCount = _this.CompPaxListNotIssued.length;
                        _this.secondtab.title = CompensationSearchResultWithTabComponent_1.NOTCOMPENSATEDPAXTABTITLE + "(" + _this.CompensationNotIssuedPaxCount + ")";
                        _this.apisdetails.push(_this.secondtab);
                        _this.TotalPassengerCount = _this.CompPaxListNotIssuedFulList.length;
                        // console.log("Comp Issued" + JSON.stringify(this.CompPaxListIssued));
                        _this.loaderProgress.hideLoader();
                        var e = void 0;
                        e.newIndex = 1;
                        _this.selectSegment(e);
                    }
                    else {
                        var status_2 = data;
                        // console.log("IN1" + JSON.stringify(status));
                        _this._shared.setCompensationFlightDetails(data);
                        _this.CompPaxList.length = 0;
                        _this.PaxList = index_4.Converters.convertoCompensationPassengerList(CompPax, data, ApplicationSettings.getString("SearchLocation", ""));
                        _this.CompPaxList = _this.PaxList.PassengerList;
                        _this.CompPaxListIssued.length = 0;
                        _this.CompPaxListNotIssued.length = 0;
                        _this.CompPaxList.forEach(function (data, Index) {
                            if (data.IsCompensationIssued == true) {
                                _this.CompPaxListIssued.push(data);
                            }
                            else {
                                _this.CompPaxListNotIssued.push(data);
                            }
                        });
                        _this.apisdetails = [];
                        _this.CompensatedPaxCount = _this.CompPaxListIssued.length;
                        _this.firsttab.title = CompensationSearchResultWithTabComponent_1.COMPENSATEDPAXTABTITLE + "(" + _this.CompensatedPaxCount + ")";
                        _this.apisdetails.push(_this.firsttab);
                        _this.CompensationNotIssuedPaxCount = _this.CompPaxListNotIssued.length;
                        _this.secondtab.title = CompensationSearchResultWithTabComponent_1.NOTCOMPENSATEDPAXTABTITLE + "(" + _this.CompensationNotIssuedPaxCount + ")";
                        _this.apisdetails.push(_this.secondtab);
                        _this.TotalPassengerCount = _this.CompPaxListNotIssuedFulList.length;
                        // console.log("Comp Issued" + JSON.stringify(this.CompPaxListIssued));
                        _this.loaderProgress.hideLoader();
                        var e = void 0;
                        e.newIndex = 1;
                        _this.selectSegment(e);
                    }
                }
                else {
                    Toast.makeText(data.errMessage).show();
                    _this.loaderProgress.hideLoader();
                }
            }, function (err) {
                _this.handleServiceError(err);
                console.log("Couldnt find information" + err);
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
    CompensationSearchResultWithTabComponent.prototype.continue = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('IssueCompensation Service --------------- Start Date Time : ' + sDate);
            // this.SelectedPassenger = this.CompPaxList.filter(obj => obj.IsSelected == true);
            if (this.SelectedPassenger.filter(function (m) { return m.CompensationReason != CompensationSearchResultWithTabComponent_1.COMPENSATIONREASON; })) {
                var privilage = this._shared.getAgentPrivilage();
                var IssueComptemplate = index_4.Converters.convertToBRERequest(this.SelectedPassenger, privilage, this.FlightHeaderInfo);
                console.log("IssueComptemplate:" + JSON.stringify(IssueComptemplate));
                this._service.postBreRequest(IssueComptemplate)
                    .subscribe(function (data) {
                    console.log("Data:" + JSON.stringify(data));
                    if (data.Results != [] && data.Success == true) {
                        if (data.Results[0].FlightSegments[0].Passengers[0].BRE_Compensations != null) {
                            var IssueCompResponse = index_4.Converters.convertToBREResponse(data, _this.SelectedPassenger);
                            _this._shared.setCompensationPaxList(IssueCompResponse);
                            console.log("BRECompResponse:" + JSON.stringify(data));
                            console.log("BRECompResponse:" + JSON.stringify(IssueCompResponse));
                            _this.navigatetoissuecompensation();
                            _this.loaderProgress.hideLoader();
                        }
                        else {
                            _this.loaderProgress.hideLoader();
                            Toast.makeText("Unable to process - Please try again later").show();
                        }
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
                Toast.makeText("Please choose the reason").show();
            }
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var endDate = new Date();
            console.log('IssueCompensation Service --------------- End Date Time : ' + endDate);
            console.log('IssueCompensation Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(endDate)));
        }
    };
    CompensationSearchResultWithTabComponent.prototype.navigatetoissuecompensation = function () {
        this._shared.setFlightHeaderInfo(this.FlightHeaderInfo);
        this.routerExtensions.navigate(["issuecompensation"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSearchResultWithTabComponent.prototype.sortBasedOnPaxName = function () {
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
    CompensationSearchResultWithTabComponent.prototype.sortBasedOnSSR = function () {
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
    CompensationSearchResultWithTabComponent.prototype.sortBasedOnTier = function () {
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
    CompensationSearchResultWithTabComponent.prototype.sortBasedOnClass = function () {
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
    CompensationSearchResultWithTabComponent.prototype.sortBasedOnOrderId = function () {
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
    CompensationSearchResultWithTabComponent.prototype.displaySSRs = function (item) {
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
    CompensationSearchResultWithTabComponent.prototype.navigatetoadditionaldetails = function (Paxitem) {
        console.log("V" + Paxitem);
        var prePage = "CompensationList";
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
    };
    CompensationSearchResultWithTabComponent.prototype.navigateToCompensation = function () {
        this.routerExtensions.navigate(["compensation"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSearchResultWithTabComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSearchResultWithTabComponent.prototype.navigateToSearch = function () {
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
    CompensationSearchResultWithTabComponent.prototype.navigateToDepartures = function () {
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
    CompensationSearchResultWithTabComponent.prototype.naviagatetoCompensationPrintListwithtab = function () {
        this.routerExtensions.navigate(["compensationprintscreen"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSearchResultWithTabComponent.prototype.handleServiceError = function (error) {
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
    var CompensationSearchResultWithTabComponent_1;
    CompensationSearchResultWithTabComponent.COMPENSATIONREASON = "Select Reason";
    CompensationSearchResultWithTabComponent.COMPENSATIONREASONTOAST = "Compensation Reason:";
    CompensationSearchResultWithTabComponent.PAXTYPE = "ReasonWiseGet";
    CompensationSearchResultWithTabComponent.COMPENSATEDPAXTABTITLE = "Compensation Issued";
    CompensationSearchResultWithTabComponent.NOTCOMPENSATEDPAXTABTITLE = "Compensation Not Issued";
    CompensationSearchResultWithTabComponent.DATANOTFOUNDTOAST = "Data not found";
    __decorate([
        core_1.ViewChild('pagecontainer'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationSearchResultWithTabComponent.prototype, "pageCont", void 0);
    __decorate([
        core_1.ViewChild('segbar'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationSearchResultWithTabComponent.prototype, "segbar", void 0);
    CompensationSearchResultWithTabComponent = CompensationSearchResultWithTabComponent_1 = __decorate([
        core_1.Component({
            selector: "compensationsearch-page",
            providers: [index_2.DataService, index_2.PassengerService, app_constants_1.Configuration, index_2.CompensationService],
            templateUrl: "./components/compensation-searchresultwithtab/compensation-searchresultwithtab.component.html",
            styleUrls: ["./components/compensation-searchresultwithtab/compensation-searchresultwithtab.component.css"]
        }),
        __metadata("design:paramtypes", [app_constants_1.Configuration, index_2.PassengerService, router_1.ActivatedRoute, index_2.CheckinOrderService, page_1.Page, router_2.RouterExtensions, timeOut_service_1.TimeOutService, router_1.Router, index_2.DataService, index_2.CompensationService, router_1.ActivatedRoute, core_1.ViewContainerRef, modal_dialog_1.ModalDialogService])
    ], CompensationSearchResultWithTabComponent);
    return CompensationSearchResultWithTabComponent;
}());
exports.CompensationSearchResultWithTabComponent = CompensationSearchResultWithTabComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGVuc2F0aW9uLXNlYXJjaHJlc3VsdHdpdGh0YWIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tcGVuc2F0aW9uLXNlYXJjaHJlc3VsdHdpdGh0YWIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLHNDQUEyRjtBQUMzRiwwQ0FBMkU7QUFFM0Usc0RBQStEO0FBQy9ELGtFQUEyRjtBQUMzRixnQ0FBK0I7QUFDL0Isb0NBQXVDO0FBTXZDLGtEQUFrRTtBQUNsRSwwQ0FBNEM7QUFDNUMsZ0NBQWtDO0FBRWxDLDhCQUE4QjtBQUM5QiwwREFBNEQ7QUFDNUQsK0JBQWlDO0FBQ2pDLDBDQUE0QztBQUM1QyxnREFBa0Q7QUFFbEQsZ0JBQWdCO0FBQ2hCLHdFQUFxRjtBQUNyRixzREFBMks7QUFDM0sscURBQXNIO0FBQ3RILGtEQUFxTTtBQUNyTSxrREFBc0Q7QUFFdEQscURBQW9EO0FBQ3BELDZEQUEyRDtBQUczRCx5RUFBdUU7QUFXdkU7SUE2REksa0RBQW9CLGNBQTZCLEVBQVUsU0FBMkIsRUFBVSxlQUErQixFQUFVLE9BQTRCLEVBQVUsSUFBVSxFQUFVLGdCQUFrQyxFQUFTLGVBQStCLEVBQVUsTUFBYyxFQUFTLFlBQXlCLEVBQVMsUUFBNkIsRUFBVSxLQUFxQixFQUFVLEtBQXVCLEVBQVUsYUFBaUM7UUFBcGMsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQXFCO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFBUyxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVMsaUJBQVksR0FBWixZQUFZLENBQWE7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFx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QUFVOzhFQUFDO0lBQzVCO1FBQXBCLGdCQUFTLENBQUMsUUFBUSxDQUFDO2tDQUFTLGlCQUFVOzRFQUFDO0lBRi9CLHdDQUF3QztRQVJwRCxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLHlCQUF5QjtZQUNuQyxTQUFTLEVBQUUsQ0FBQyxtQkFBVyxFQUFFLHdCQUFnQixFQUFFLDZCQUFhLEVBQUUsMkJBQW1CLENBQUM7WUFDOUUsV0FBVyxFQUFFLCtGQUErRjtZQUM1RyxTQUFTLEVBQUUsQ0FBQyw4RkFBOEYsQ0FBQztTQUU5RyxDQUFDO3lDQStEc0MsNkJBQWEsRUFBcUIsd0JBQWdCLEVBQTJCLHVCQUFjLEVBQW1CLDJCQUFtQixFQUFnQixXQUFJLEVBQTRCLHlCQUFnQixFQUEwQixnQ0FBYyxFQUFrQixlQUFNLEVBQXVCLG1CQUFXLEVBQW1CLDJCQUFtQixFQUFpQix1QkFBYyxFQUFpQix1QkFBZ0IsRUFBeUIsaUNBQWtCO09BN0QvYyx3Q0FBd0MsQ0FxakNwRDtJQUFELCtDQUFDO0NBQUEsQUFyakNELElBcWpDQztBQXJqQ1ksNEZBQXdDIiwic291cmNlc0NvbnRlbnQiOlsiLy9hbmd1bGFyICYgbmF0aXZlc2NyaXB0IHJlZmVyZW5jZXNcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uRXh0cmFzLCBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBNb2RhbERpYWxvZ1NlcnZpY2UsIE1vZGFsRGlhbG9nT3B0aW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9tb2RhbC1kaWFsb2dcIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IGRpYWxvZ3MgPSByZXF1aXJlKFwidWkvZGlhbG9nc1wiKTtcbmltcG9ydCB7IFNjcm9sbFZpZXcgfSBmcm9tIFwidWkvc2Nyb2xsLXZpZXdcIjtcbmltcG9ydCB7IExpc3RWaWV3IH0gZnJvbSBcInVpL2xpc3Qtdmlld1wiO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gXCJ1aS9jb3JlL3ZpZXdcIjtcbmltcG9ydCB0ZXh0RmllbGQgPSByZXF1aXJlKFwidWkvdGV4dC1maWVsZFwiKTtcbmltcG9ydCAqIGFzIGdlc3R1cmVzIGZyb20gXCJ1aS9nZXN0dXJlc1wiO1xuaW1wb3J0IHsgU2VnbWVudGVkQmFyLCBTZWdtZW50ZWRCYXJJdGVtIH0gZnJvbSBcInVpL3NlZ21lbnRlZC1iYXJcIjtcbmltcG9ydCAqIGFzIGltYWdlTW9kdWxlIGZyb20gXCJpbWFnZS1zb3VyY2VcIjtcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmaWxlLXN5c3RlbVwiO1xuXG4vL2V4dGVybmFsIG1vZHVsZXMgYW5kIHBsdWdpbnNcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcbmltcG9ydCAqIGFzIHplYnJhIGZyb20gXCJuYXRpdmVzY3JpcHQtcHJpbnQtemVicmFcIjtcblxuLy9hcHAgcmVmZXJlbmNlc1xuaW1wb3J0IHsgQ3JlYXRpbmdMaXN0UGlja2VyQ29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvY291bnRyeS9jb3VudHJ5LW1vZGFsXCI7XG5pbXBvcnQgeyBMb2FkZXJQcm9ncmVzcywgUGFzc2VuZ2VyTGlzdFRlbXBsYXRlLCBQYXNzZW5nZXJMaXN0LCBBY2NvbnRQcm9maWxlTW9kZWwsIENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZSwgQ29tcGVuc2F0aW9uUmVhc29uTW9kdWxlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9pbnRlcmZhY2UvaW5kZXhcIlxuaW1wb3J0IHsgRGF0YVNlcnZpY2UsIENoZWNraW5PcmRlclNlcnZpY2UsIFBhc3NlbmdlclNlcnZpY2UsIENvbXBlbnNhdGlvblNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL2luZGV4XCI7XG5pbXBvcnQgeyBPcmRlciwgQ291bnRyeUNvbGxlY3Rpb24sIEZsaWdodFNlcnZpY2VJbmZvLCBGbGlnaHQsIFNlYXJjaCwgQWNjb3VudFByb2ZpbGUsIEFQSVNEb2N1bWVudCwgQ29tcGFuc2F0aW9uLCBDb21wZW5zYXRpb25QYXhMaXN0LCBBZ2VudFByaXZpbGFnZSwgUHJpbnRNb2R1bGUgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL21vZGVsL2luZGV4XCI7XG5pbXBvcnQgeyBDb252ZXJ0ZXJzIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC91dGlscy9pbmRleFwiO1xuaW1wb3J0IHsgRGF0ZVBpY2tlck1vZGFsLCBEYXRlUGlja2V0Q29udGV4dCB9IGZyb20gXCIuLi8uLi9jb21wb25lbnRzL2RhdGUtcGlja2VyL2RhdGUtcGlja2VyLW1vZGFsXCI7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vLi4vYXBwLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBBcHBFeGVjdXRpb250aW1lIH0gZnJvbSBcIi4uLy4uL2FwcC5leGVjdXRpb250aW1lXCI7XG5pbXBvcnQgeyBpc0FuZHJvaWQsIGlzSU9TLCBkZXZpY2UsIHNjcmVlbiB9IGZyb20gXCJwbGF0Zm9ybVwiO1xuaW1wb3J0IHsgRlFUViB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbW9kZWwvaW5kZXhcIlxuaW1wb3J0IHsgVGltZU91dFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3RpbWVPdXQuc2VydmljZVwiO1xuXG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcImNvbXBlbnNhdGlvbnNlYXJjaC1wYWdlXCIsXG4gICAgcHJvdmlkZXJzOiBbRGF0YVNlcnZpY2UsIFBhc3NlbmdlclNlcnZpY2UsIENvbmZpZ3VyYXRpb24sIENvbXBlbnNhdGlvblNlcnZpY2VdLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vY29tcG9uZW50cy9jb21wZW5zYXRpb24tc2VhcmNocmVzdWx0d2l0aHRhYi9jb21wZW5zYXRpb24tc2VhcmNocmVzdWx0d2l0aHRhYi5jb21wb25lbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogW1wiLi9jb21wb25lbnRzL2NvbXBlbnNhdGlvbi1zZWFyY2hyZXN1bHR3aXRodGFiL2NvbXBlbnNhdGlvbi1zZWFyY2hyZXN1bHR3aXRodGFiLmNvbXBvbmVudC5jc3NcIl1cblxufSlcblxuZXhwb3J0IGNsYXNzIENvbXBlbnNhdGlvblNlYXJjaFJlc3VsdFdpdGhUYWJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIEBWaWV3Q2hpbGQoJ3BhZ2Vjb250YWluZXInKSBwYWdlQ29udDogRWxlbWVudFJlZjtcbiAgICBAVmlld0NoaWxkKCdzZWdiYXInKSBzZWdiYXI6IEVsZW1lbnRSZWY7XG4gICAgcHVibGljIGFwaXNkZXRhaWxzOiBBcnJheTxTZWdtZW50ZWRCYXJJdGVtPjtcbiAgICBwdWJsaWMgZmlyc3R0YWIgPSBuZXcgU2VnbWVudGVkQmFySXRlbSgpO1xuICAgIHB1YmxpYyBzZWNvbmR0YWIgPSBuZXcgU2VnbWVudGVkQmFySXRlbSgpO1xuICAgIHB1YmxpYyBpc0Vycm9yOiBib29sZWFuO1xuICAgIHB1YmxpYyBlcnJvck1lc3NhZ2U6IHN0cmluZztcbiAgICBwdWJsaWMgbG9hZGVyUHJvZ3Jlc3M6IExvYWRlclByb2dyZXNzO1xuICAgIHB1YmxpYyBzdGFydERhdGU6IERhdGU7XG4gICAgcHVibGljIFNlYXJjaEZpZWxkczogU2VhcmNoID0gbmV3IFNlYXJjaCgpO1xuICAgIHB1YmxpYyBDdXJEYXRlOiBEYXRlO1xuICAgIHB1YmxpYyB1c2VyZGV0YWlsczogYW55O1xuICAgIHB1YmxpYyBDb21lbnNhdGlvblJlYXNvbjogYW55O1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25SZWFzb246IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICBwdWJsaWMgU2VsZWN0QWxsUGF4OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGNoZWNrZWRDb3VudDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgRmxpZ2h0RGV0YWlsczogYW55O1xuICAgIHB1YmxpYyBQYXNzZW5nZXJUeXBlOiBhbnk7XG4gICAgcHVibGljIFRvdGFsUGFzc2VuZ2VyQ291bnQ6IG51bWJlciA9IDA7XG4gICAgcHVibGljIHNlbGVjdGVkUGFzc2VuZ2VyQ291bnQ6IG51bWJlciA9IDA7XG4gICAgcHVibGljIENvbXBlbnNhdGlvbkxpc3Q6IENvbXBlbnNhdGlvblBheExpc3QuUm9vdE9iamVjdDtcbiAgICBwdWJsaWMgU2VsZWN0ZWRQYXNzZW5nZXI6IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBTZWxlY3RlZElzc3VlUGFzc2VuZ2VyOiBBcnJheTxDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdD4gPSBbXTtcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdDogQXJyYXk8Q29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q+ID0gW107XG4gICAgcHVibGljIENvbXBlbnNhdGlvbkZ1bGxQYXhMaXN0OiBBcnJheTxDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdD4gPSBbXTtcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uTW9kZWw6IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25Sb290T2JqZWN0ID0gbmV3IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25Sb290T2JqZWN0O1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25SZWFzb25MaXN0OiBBcnJheTxDb21wZW5zYXRpb25SZWFzb25Nb2R1bGUuQ29tcGVuc2F0aW9uUmVhc29uPiA9IFtdO1xuICAgIHB1YmxpYyBBZ2VudFByaXZpbGFnZTogQWdlbnRQcml2aWxhZ2UuUm9vdE9iamVjdCA9IG5ldyBBZ2VudFByaXZpbGFnZS5Sb290T2JqZWN0KCk7XG4gICAgcHVibGljIFBheExpc3Q6IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25Sb290T2JqZWN0ID0gbmV3IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25Sb290T2JqZWN0KCk7XG4gICAgcHVibGljIGZsaWdodGRhdGU6IGFueTtcbiAgICBwdWJsaWMgU2VsZWN0QWxsUGF4VmFyOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIElzUGF4UmVhc29uU2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgZmxpZ2h0bnVtYmVyOiBhbnk7XG4gICAgcHVibGljIG5hbWVTb3J0SW5kaWNhdG9yOiBudW1iZXIgPSAtMTtcbiAgICBwdWJsaWMgc3NyU29ydEluZGljYXRvcjogbnVtYmVyID0gLTE7XG4gICAgcHVibGljIHRpZXJTb3J0SW5kaWNhdG9yOiBudW1iZXIgPSAtMTtcbiAgICBwdWJsaWMgY2xhc3NTb3J0SW5kaWNhdG9yOiBudW1iZXIgPSAtMTtcbiAgICBwdWJsaWMgb3JkZXJJZFNvcnRJbmRpY2F0b3I6IG51bWJlciA9IC0xO1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25Jc3N1ZWRMaXN0OiBib29sZWFuID0gdHJ1ZTtcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uTm90SXNzdWVkTGlzdDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBDb21wZW5zYXRlZFBheENvdW50OiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyBTZWFyY2hDcml0ZXJpYTogYW55ID0gXCJOYW1lXCI7XG4gICAgcHVibGljIHNlYXJjaEZpZWxkOiBhbnk7XG4gICAgcHVibGljIFBhc3NlbmdlckZsaXRlckNyaXRlcmlhOiBhbnkgPSBcIkFsbCBQYXNzZW5nZXJzXCI7XG4gICAgcHVibGljIENvbXBlbnNhdGlvbk5vdElzc3VlZFBheENvdW50OiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyBGbGlnaHRIZWFkZXJJbmZvOiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuRmxpZ2h0TW9kZWwgPSBuZXcgQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkZsaWdodE1vZGVsKCk7XG4gICAgcHVibGljIENvbXBQYXhMaXN0OiBBcnJheTxDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdD4gPSBbXTtcbiAgICBwdWJsaWMgQ29uc3RDb21wUGF4TGlzdDogQXJyYXk8Q29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q+ID0gW107XG4gICAgcHVibGljIENvbXBQYXhMaXN0SXNzdWVkOiBBcnJheTxDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdD4gPSBbXTtcbiAgICBwdWJsaWMgQ29tcFBheExpc3ROb3RJc3N1ZWQ6IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBDb21wUGF4TGlzdElzc3VlZEZ1bExpc3Q6IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBDb21wUGF4TGlzdE5vdElzc3VlZEZ1bExpc3Q6IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBzdGF0aWMgQ09NUEVOU0FUSU9OUkVBU09OOiBzdHJpbmcgPSBcIlNlbGVjdCBSZWFzb25cIjtcbiAgICBwdWJsaWMgc3RhdGljIENPTVBFTlNBVElPTlJFQVNPTlRPQVNUOiBzdHJpbmcgPSBcIkNvbXBlbnNhdGlvbiBSZWFzb246XCI7XG4gICAgcHVibGljIHN0YXRpYyBQQVhUWVBFOiBzdHJpbmcgPSBcIlJlYXNvbldpc2VHZXRcIjtcbiAgICBwdWJsaWMgc3RhdGljIENPTVBFTlNBVEVEUEFYVEFCVElUTEU6IHN0cmluZyA9IFwiQ29tcGVuc2F0aW9uIElzc3VlZFwiO1xuICAgIHB1YmxpYyBzdGF0aWMgTk9UQ09NUEVOU0FURURQQVhUQUJUSVRMRTogc3RyaW5nID0gXCJDb21wZW5zYXRpb24gTm90IElzc3VlZFwiO1xuICAgIHB1YmxpYyBzdGF0aWMgREFUQU5PVEZPVU5EVE9BU1Q6IHN0cmluZyA9IFwiRGF0YSBub3QgZm91bmRcIjtcbiAgICBwdWJsaWMgaXNDaGVja2luRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgaXNHYXRlRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uLCBwcml2YXRlIF9zZXJ2aWNlczogUGFzc2VuZ2VyU2VydmljZSwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZXI6IEFjdGl2YXRlZFJvdXRlLCBwcml2YXRlIF9zaGFyZWQ6IENoZWNraW5PcmRlclNlcnZpY2UsIHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSByb3V0ZXJFeHRlbnNpb25zOiBSb3V0ZXJFeHRlbnNpb25zLCBwdWJsaWMgX3RpbWVvdXRTZXJ2aWNlOiBUaW1lT3V0U2VydmljZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHVibGljIF9kYXRhU2VydmljZTogRGF0YVNlcnZpY2UsIHB1YmxpYyBfc2VydmljZTogQ29tcGVuc2F0aW9uU2VydmljZSwgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgdmNSZWY6IFZpZXdDb250YWluZXJSZWYsIHByaXZhdGUgX21vZGFsU2VydmljZTogTW9kYWxEaWFsb2dTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuU2VhcmNoRmllbGRzLkZsaWdodERhdGUgPSBtb21lbnQoKS5mb3JtYXQoXCJERCBNTU1NIFlZWVlcIik7XG4gICAgICAgIHRoaXMuQ3VyRGF0ZSA9IG1vbWVudCgpLnRvRGF0ZSgpO1xuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHRoaXMuYXBpc2RldGFpbHMgPSBbXTtcblxuICAgICAgICB0aGlzLmZpcnN0dGFiLnRpdGxlID0gQ29tcGVuc2F0aW9uU2VhcmNoUmVzdWx0V2l0aFRhYkNvbXBvbmVudC5DT01QRU5TQVRFRFBBWFRBQlRJVExFO1xuICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5maXJzdHRhYik7XG5cbiAgICAgICAgdGhpcy5zZWNvbmR0YWIudGl0bGUgPSBDb21wZW5zYXRpb25TZWFyY2hSZXN1bHRXaXRoVGFiQ29tcG9uZW50Lk5PVENPTVBFTlNBVEVEUEFYVEFCVElUTEU7XG4gICAgICAgIHRoaXMuYXBpc2RldGFpbHMucHVzaCh0aGlzLnNlY29uZHRhYik7XG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MgPSBuZXcgTG9hZGVyUHJvZ3Jlc3MoKTtcbiAgICB9XG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMucGFnZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnfi9pbWFnZXMvbG9naW5fYmFjay5qcGVnJylcIjtcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRTaXplID0gXCJjb3ZlciBcIjtcbiAgICAgICAgdGhpcy5Db21lbnNhdGlvblJlYXNvbiA9IENvbXBlbnNhdGlvblNlYXJjaFJlc3VsdFdpdGhUYWJDb21wb25lbnQuQ09NUEVOU0FUSU9OUkVBU09OO1xuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmluaXRMb2FkZXIodGhpcy5wYWdlQ29udCk7XG4gICAgICAgIHRoaXMudXNlcmRldGFpbHMgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcInVzZXJkZXRhaWxzXCIsIFwiXCIpO1xuICAgICAgICB0aGlzLmlzQ2hlY2tpbkRpc2FibGVkID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiY2hlY2tpbkRpc2FibGVkXCIpO1xuICAgICAgICB0aGlzLmlzR2F0ZURpc2FibGVkID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiZ2F0ZURpc2FibGVkXCIpO1xuICAgICAgICB0aGlzLmdldENvbXBlbnNhdGlvblJlYXNvbigpO1xuICAgICAgICB0aGlzLlBheExpc3QgPSB0aGlzLl9zaGFyZWQuZ2V0Q29tcGVuc2F0aW9uTGlzdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBBWCBuZXdcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuUGF4TGlzdC5GbGlnaHRNb2RlbCkpO1xuICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5QYXhMaXN0LlBhc3Nlbmdlckxpc3Q7XG4gICAgICAgIHRoaXMuQ29uc3RDb21wUGF4TGlzdCA9IHRoaXMuQ29tcFBheExpc3Q7XG4gICAgICAgIHRoaXMuX3NoYXJlZC5zZXRDb21wZW5zYXRpb25QYXhMaXN0KHRoaXMuQ29tcFBheExpc3QpO1xuICAgICAgICB0aGlzLl9zaGFyZWQuc2V0RmxpZ2h0SGVhZGVySW5mbyh0aGlzLlBheExpc3QuRmxpZ2h0TW9kZWwpO1xuICAgICAgICB0aGlzLkZsaWdodEhlYWRlckluZm8gPSB0aGlzLlBheExpc3QuRmxpZ2h0TW9kZWw7XG4gICAgICAgIHRoaXMuQ29tcFBheExpc3QuZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhLklzQ29tcGVuc2F0aW9uSXNzdWVkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkLnB1c2goZGF0YSk7XG5cblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLnB1c2goZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuYXBpc2RldGFpbHMgPSBbXTtcblxuICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkRnVsTGlzdCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWQ7XG4gICAgICAgIHRoaXMuQ29tcFBheExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkRnVsTGlzdDtcbiAgICAgICAgdGhpcy5Db21wZW5zYXRlZFBheENvdW50ID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZEZ1bExpc3QubGVuZ3RoO1xuICAgICAgICB0aGlzLmZpcnN0dGFiLnRpdGxlID0gQ29tcGVuc2F0aW9uU2VhcmNoUmVzdWx0V2l0aFRhYkNvbXBvbmVudC5DT01QRU5TQVRFRFBBWFRBQlRJVExFICsgXCIoXCIgKyB0aGlzLkNvbXBlbnNhdGVkUGF4Q291bnQgKyBcIilcIjtcbiAgICAgICAgdGhpcy5hcGlzZGV0YWlscy5wdXNoKHRoaXMuZmlyc3R0YWIpO1xuICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkRnVsTGlzdCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQ7XG4gICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uTm90SXNzdWVkUGF4Q291bnQgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkRnVsTGlzdC5sZW5ndGg7XG4gICAgICAgIHRoaXMuc2Vjb25kdGFiLnRpdGxlID0gQ29tcGVuc2F0aW9uU2VhcmNoUmVzdWx0V2l0aFRhYkNvbXBvbmVudC5OT1RDT01QRU5TQVRFRFBBWFRBQlRJVExFICsgXCIoXCIgKyB0aGlzLkNvbXBlbnNhdGlvbk5vdElzc3VlZFBheENvdW50ICsgXCIpXCI7XG4gICAgICAgIHRoaXMuYXBpc2RldGFpbHMucHVzaCh0aGlzLnNlY29uZHRhYik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ29tcCBJc3N1ZWRcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuQ29tcFBheExpc3RJc3N1ZWQpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJDb21wIE5vdCBJc3N1ZWRcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuQ29tcGVuc2F0aW9uTm90SXNzdWVkUGF4Q291bnQpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJSZXM6XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLkZsaWdodERldGFpbHMpKTtcbiAgICB9XG5cbiAgICB0b2dnbGVDaGVja2VkKHBheDogQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QpIHtcbiAgICAgICAgaWYgKHRoaXMuQ29tcGVuc2F0aW9uTm90SXNzdWVkTGlzdCA9PSB0cnVlKSB7XG4gICAgICAgICAgICBpZiAocGF4LklzU2VsZWN0ZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBwYXguSXNTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5wdXNoKHBheCk7XG4gICAgICAgICAgICAgICAgLy8gaWYgKHRoaXMuQ29tcFBheExpc3QubGVuZ3RoID09PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCkgdGhpcy5TZWxlY3RBbGxQYXggPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLkNvbWVuc2F0aW9uUmVhc29uICE9IENvbXBlbnNhdGlvblNlYXJjaFJlc3VsdFdpdGhUYWJDb21wb25lbnQuQ09NUEVOU0FUSU9OUkVBU09OKSB7XG4gICAgICAgICAgICAgICAgICAgIHBheC5Db21wZW5zYXRpb25SZWFzb24gPSB0aGlzLkNvbWVuc2F0aW9uUmVhc29uO1xuICAgICAgICAgICAgICAgICAgICBwYXguQ29tcGVuc2F0aW9uUmVhc29uSWQgPSB0aGlzLkNvbXBlbnNhdGlvblJlYXNvbkxpc3QuZmlsdGVyKG0gPT4gbS5Db21wUmVhc29uVGV4dCA9PSB0aGlzLkNvbWVuc2F0aW9uUmVhc29uKVswXS5Db21wUmVhc29uSWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLnNwbGljZSh0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmluZGV4T2YocGF4KSwgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcGF4LklzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdEFsbFBheCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWRGdWxMaXN0Lmxlbmd0aCA9PT0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5sZW5ndGgpIHRoaXMuU2VsZWN0QWxsUGF4ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRQYXNzZW5nZXJDb3VudCA9IHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIubGVuZ3RoO1xuICAgICAgICAvLyBlbHNlIHtcbiAgICAgICAgLy8gICAgIGlmIChwYXguSXNTZWxlY3RlZCA9PSBmYWxzZSkge1xuICAgICAgICAvLyAgICAgICAgIHBheC5Jc1NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgLy8gICAgICAgICB0aGlzLlNlbGVjdGVkSXNzdWVQYXNzZW5nZXIucHVzaChwYXgpO1xuICAgICAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICB0aGlzLlNlbGVjdGVkSXNzdWVQYXNzZW5nZXIuc3BsaWNlKHRoaXMuU2VsZWN0ZWRJc3N1ZVBhc3Nlbmdlci5pbmRleE9mKHBheCksIDEpO1xuICAgICAgICAvLyAgICAgICAgIHBheC5Jc1NlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIC8vICAgICB9XG5cbiAgICAgICAgLy8gfVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIpKTtcbiAgICB9XG4gICAgcHVibGljIHNlbGVjdFNlZ21lbnQoZTogYW55KSB7XG4gICAgICAgIHZhciBzZWxJbmQgPSBlLm5ld0luZGV4O1xuICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyID0gW107XG4gICAgICAgIGlmIChzZWxJbmQgPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25Jc3N1ZWRMaXN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uTm90SXNzdWVkTGlzdCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RBbGxQYXggPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuU2VhcmNoQ3JpdGVyaWEgPSBcIk5hbWVcIjtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoRmllbGQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAvLyB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkID0gdGhpcy5Db21wUGF4TGlzdC5maWx0ZXIobT0+bS5Jc0NvbXBlbnNhdGlvbklzc3VlZCA9PSB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQuZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBkYXRhLklzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZEZ1bExpc3Q7XG5cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRQYXNzZW5nZXJDb3VudCA9IDA7XG4gICAgICAgICAgICB0aGlzLlRvdGFsUGFzc2VuZ2VyQ291bnQgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkRnVsTGlzdC5sZW5ndGg7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIklzc3VlZFwiICsgdGhpcy5Db21wUGF4TGlzdElzc3VlZC5sZW5ndGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25Jc3N1ZWRMaXN0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbk5vdElzc3VlZExpc3QgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5TZWFyY2hDcml0ZXJpYSA9IFwiTmFtZVwiO1xuICAgICAgICAgICAgdGhpcy5zZWFyY2hGaWVsZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIC8vIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQgPSB0aGlzLkNvbXBQYXhMaXN0LmZpbHRlcihtPT5tLklzQ29tcGVuc2F0aW9uSXNzdWVkID09IGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkRnVsTGlzdDtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRQYXNzZW5nZXJDb3VudCA9IDA7XG5cbiAgICAgICAgICAgIHRoaXMuVG90YWxQYXNzZW5nZXJDb3VudCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWRGdWxMaXN0Lmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90IElzc3VlZFwiICsgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZC5sZW5ndGgpO1xuXG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpbnRFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLklzQ29tcGVuc2F0aW9uSXNzdWVkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGlmICh0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGVtYWlsRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5Jc0NvbXBlbnNhdGlvbklzc3VlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSXNQYXhSZWFzb25TZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBpZiAodGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzYXZlRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgIT0gW10pIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5Db21wZW5zYXRpb25SZWFzb24gIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gaWYgKHRoaXMuSXNQYXhSZWFzb25TZWxlY3RlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29udGludWVFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5TZWxlY3RlZFBhc3NlbmdlciAhPSBbXSkge1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLkNvbXBlbnNhdGlvblJlYXNvbiAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSXNQYXhSZWFzb25TZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuSXNQYXhSZWFzb25TZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB9IGlmICh0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGRlbGV0ZUVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuSXNQYXhSZWFzb25TZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSBpZiAodGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmaWx0ZXIoYXJnczogYW55KSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTmFtZTpcIiArIEpTT04uc3RyaW5naWZ5KGFyZ3MpKTtcbiAgICAgICAgbGV0IHNlZ0JhckVsbSA9IDxTZWdtZW50ZWRCYXI+dGhpcy5zZWdiYXIubmF0aXZlRWxlbWVudDtcbiAgICAgICAgbGV0IGluZGV4ID0gc2VnQmFyRWxtLnNlbGVjdGVkSW5kZXg7XG4gICAgICAgIGlmIChpbmRleCA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZEZ1bExpc3Q7XG4gICAgICAgICAgICBpZiAodGhpcy5TZWFyY2hDcml0ZXJpYSA9PSBcIk5hbWVcIikge1xuICAgICAgICAgICAgICAgIGlmIChhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXJncy50b1N0cmluZygpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3RJc3N1ZWQgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkLmZpbHRlcihyID0+IHIuR2l2ZW5OYW1lLmluZGV4T2YobmFtZS50cmltKCkpID49IDAgfHwgci5MYXN0TmFtZS5pbmRleE9mKG5hbWUudHJpbSgpKSA+PSAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWRGdWxMaXN0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuU2VhcmNoQ3JpdGVyaWEgPT0gXCJPcmRlciBJRFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmdzLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWQuZmlsdGVyKHIgPT4gci5PcmRlcklkLmluZGV4T2YobmFtZS50cmltKCkpID49IDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZEZ1bExpc3Q7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmdzLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWQuZmlsdGVyKHIgPT4gci5DYWJpbi5pbmRleE9mKG5hbWUudHJpbSgpKSA+PSAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZCA9IHRoaXMuQ29tcFBheExpc3RJc3N1ZWRGdWxMaXN0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLlRvdGFsUGFzc2VuZ2VyQ291bnQgPSB0aGlzLkNvbXBQYXhMaXN0Lmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkRnVsTGlzdDtcbiAgICAgICAgICAgIGlmICh0aGlzLlNlYXJjaENyaXRlcmlhID09IFwiTmFtZVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmdzLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQuZmlsdGVyKHIgPT4gci5HaXZlbk5hbWUuaW5kZXhPZihuYW1lLnRyaW0oKSkgPj0gMCB8fCByLkxhc3ROYW1lLmluZGV4T2YobmFtZS50cmltKCkpID49IDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZEZ1bExpc3Q7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLlNlYXJjaENyaXRlcmlhID09IFwiT3JkZXIgSURcIikge1xuICAgICAgICAgICAgICAgIGlmIChhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXJncy50b1N0cmluZygpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLmZpbHRlcihyID0+IHIuT3JkZXJJZC5pbmRleE9mKG5hbWUudHJpbSgpKSA+PSAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWRGdWxMaXN0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYXJncy50b1N0cmluZygpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLmZpbHRlcihyID0+IHIuQ2FiaW4uaW5kZXhPZihuYW1lLnRyaW0oKSkgPj0gMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkRnVsTGlzdDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5Ub3RhbFBhc3NlbmdlckNvdW50ID0gdGhpcy5Db21wUGF4TGlzdC5sZW5ndGg7XG4gICAgICAgICAgICBpZiAodGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZEZ1bExpc3QubGVuZ3RoID09PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCkgdGhpcy5TZWxlY3RBbGxQYXggPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgZGlzcGxheVByb2R1Y3RBY3Rpb25EaWFsb2dGb3JTbWFydEZpbHRlcigpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0aXRsZTogXCJTbWFydCBmaWx0ZXIgb3B0aW9uXCIsXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgYWN0aW9uczogW1wiTmFtZVwiLCBcIk9yZGVyIElEXCIsIFwiQ2xhc3NcIl0sXG4gICAgICAgIH07XG4gICAgICAgIGRpYWxvZ3MuYWN0aW9uKG9wdGlvbnMpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSBcIkNhbmNlbFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5TZWFyY2hDcml0ZXJpYSA9IHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRpc3BsYXlEaWFsb2dGb3JGbGl0ZXJQYXNzZW5nZXJUeXBlKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHRpdGxlOiBcIlBhc3NlbmdlciB0eXBlIGZpbHRlclwiLFxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcIkFsbCBQYXNzZW5nZXJzXCIsIFwiRVRLVCBQYXNzZW5nZXJzXCIsIFwiQ2hlY2tlZC1JbiBQYXNzZW5nZXJzXCIsIFwiTm90IENoZWNrZWQtSW4gUGFzc2VuZ2Vyc1wiXSxcbiAgICAgICAgfTtcbiAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzdWx0ICE9IFwiQ2FuY2VsXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLlBhc3NlbmdlckZsaXRlckNyaXRlcmlhID0gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZGlzcGxheVByb2R1Y3RBY3Rpb25EaWFsb2coKSB7XG5cbiAgICAgICAgbGV0IG9wdGlvbnM6IE1vZGFsRGlhbG9nT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMudmNSZWYsXG4gICAgICAgICAgICBjb250ZXh0OiBbeyBjb3VudHJ5OiB0aGlzLkNvbXBlbnNhdGlvblJlYXNvbiB9XSxcbiAgICAgICAgICAgIGZ1bGxzY3JlZW46IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX21vZGFsU2VydmljZVxuICAgICAgICAgICAgLnNob3dNb2RhbChDcmVhdGluZ0xpc3RQaWNrZXJDb21wb25lbnQsIG9wdGlvbnMpXG4gICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGF0ZSByZXN1bHQgXCIgKyByZXN1bHQpO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21lbnNhdGlvblJlYXNvbiA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5Db21wZW5zYXRpb25SZWFzb24gPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLkNvbXBlbnNhdGlvblJlYXNvbklkID0gdGhpcy5Db21wZW5zYXRpb25SZWFzb25MaXN0LmZpbHRlcihtID0+IG0uQ29tcFJlYXNvblRleHQgPT0gdGhpcy5Db21lbnNhdGlvblJlYXNvbilbMF0uQ29tcFJlYXNvbklkO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLlNlYXJjaEZpZWxkcy5Mb2NhdGlvbiA9IHJlc3VsdC5zdWJzdHIoMCwgMyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3V0XCIgKyByZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldENvbXBlbnNhdGlvblJlYXNvbigpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVhc29uIDFcIik7XG4gICAgICAgICAgICBsZXQgUmVhc29uUmVxdWVzdCA9IHRoaXMuX3NoYXJlZC5nZXRBZ2VudFByaXZpbGFnZSgpO1xuICAgICAgICAgICAgdGhpcy5BZ2VudFByaXZpbGFnZS5Qcml2aWxlZ2VzID0gUmVhc29uUmVxdWVzdDtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUHJpOlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5BZ2VudFByaXZpbGFnZSkpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIENvbXBlbnNhdGlvblJlcXVlc3RPYmo6IGFueTtcbiAgICAgICAgICAgIENvbXBlbnNhdGlvblJlcXVlc3RPYmogPSB7IFwiUHJpdmlsZWdlc1wiOiB0aGlzLkFnZW50UHJpdmlsYWdlLlByaXZpbGVnZXMsIFwiQWlybGluZUNvZGVcIjogQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJjYXJyaWVyQ29kZVwiLCBcIlwiKSB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IEdldENvbXBlbnNhdGlvblJlYXNvbiBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBTdGFydCBEYXRlIFRpbWUgOiAnICsgc0RhdGUpO1xuICAgICAgICAgICAgdGhpcy5fc2VydmljZS5nZXRDb21wZW5zYXRpb25SZWFzb25zKENvbXBlbnNhdGlvblJlcXVlc3RPYmopXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuQ29tcGVuc2F0aW9uUmVhc29uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBDb21wYW5zYXRpb25EZXRhaWxzOiBhbnkgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgQ29tcGFuc2F0aW9uRGV0YWlscy5Db21wZW5zYXRpb25SZWFzb24uZm9yRWFjaCgoS2V5VmFsdWUsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbXByZWFzb24gPSBuZXcgQ29tcGVuc2F0aW9uUmVhc29uTW9kdWxlLkNvbXBlbnNhdGlvblJlYXNvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXByZWFzb24uQ29tcFJlYXNvblRleHQgPSBLZXlWYWx1ZS5Db21wUmVhc29uVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wcmVhc29uLkNvbXBSZWFzb25JZCA9IEtleVZhbHVlLkNvbXBSZWFzb25JZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvblJlYXNvbkxpc3QucHVzaChjb21wcmVhc29uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvblJlYXNvbi5wdXNoKEtleVZhbHVlLkNvbXBSZWFzb25UZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvblJlYXNvbi5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhIDwgYikgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSA+IGIpIHJldHVybiAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoQ29tcGVuc2F0aW9uU2VhcmNoUmVzdWx0V2l0aFRhYkNvbXBvbmVudC5DT01QRU5TQVRJT05SRUFTT05UT0FTVCArIGRhdGEuRXJyb3JzWzBdLk1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgdmFyIGVuZERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0NoZWNrSW5QYXggU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlbmREYXRlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDaGVja0luUGF4IFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZW5kRGF0ZSkpKTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIGRpc3BsYXlQcm9kdWN0QWN0aW9uRGlhbG9nRm9yUHJpbnRlcigpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0aXRsZTogXCJTbWFydCBmaWx0ZXIgb3B0aW9uXCIsXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgYWN0aW9uczogW1wiQmx1ZXRvb3RoIFByaW50ZXJcIiwgXCJIb3N0IFByaW50ZXJcIl0sXG4gICAgICAgIH07XG4gICAgICAgIGRpYWxvZ3MuYWN0aW9uKG9wdGlvbnMpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSBcIkNhbmNlbFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PSBcIkJsdWV0b290aCBQcmludGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibHVldG9vdGhFTUQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByaW50RU1EKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBibHVldG9vdGhFTUQoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHZhciBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIEN1ckRhdGUgPSBtb21lbnQoc3RhcnREYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coQ3VyRGF0ZSlcbiAgICAgICAgICAgIHRoaXMuRmxpZ2h0SGVhZGVySW5mbyA9IHRoaXMuX3NoYXJlZC5nZXRGbGlnaHRIZWFkZXJJbmZvKCk7XG4gICAgICAgICAgICBsZXQgRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmU6IFByaW50TW9kdWxlLlJvb3RPYmplY3QgPSBDb252ZXJ0ZXJzLmNvbnZlcnRUb0JsdWV0b290aFByaW50RU1EQ29tcGVuc2F0aW9uKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIsIHRoaXMuRmxpZ2h0SGVhZGVySW5mbyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIFJlcTpcIiArIEpTT04uc3RyaW5naWZ5KEVtYWlsQ29tcGVuc2F0aW9uU3RydWN0dXJlKSk7XG4gICAgICAgICAgICBpZiAoRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmUuUGFzc2VuZ2VycyAhPSBbXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UucHJpbnRFTURCbHVldG9vdGhDb21wZW5zYXRpb25TZXJ2aWNlKEVtYWlsQ29tcGVuc2F0aW9uU3RydWN0dXJlKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbCBSZXM6XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuUmF3RGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbWFnZSA9IGltYWdlTW9kdWxlLmZyb21CYXNlNjQoZGF0YS5SYXdEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZm9sZGVyID0gZnMua25vd25Gb2xkZXJzLmlvcy5saWJyYXJ5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGggPSBmcy5wYXRoLmpvaW4oZm9sZGVyLnBhdGgsIFwidGVtcEJQSW1hZ2UuanBnXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlLnNhdmVUb0ZpbGUocGF0aCwgXCJqcGVnXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcHJpbnRlcklEID0gdGhpcy5nZXRQcmludGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmludGVySUQudHJpbSgpICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyB6ZWJyYS5QcmludGVyKHsgYWRkcmVzczogcHJpbnRlcklELCBsYW5ndWFnZTogXCJDUENMXCIsIGRlYnVnZ2luZzogZmFsc2UgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoY3VyUHJpbnRlciwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkb2N1bWVudCA9IGN1clByaW50ZXIuY3JlYXRlRG9jdW1lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuaW1hZ2UoZnMucGF0aC5qb2luKGZvbGRlci5wYXRoLCBcInRlbXBCUEltYWdlLmpwZ1wiKSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiQmx1ZXRvb3RoIHByaW50ZWQgc3VjZXNzZnVsbHlcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJQcmludGVyLnByaW50KGRvY3VtZW50KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJpbnRpbmcgRG9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1clByaW50ZXIuY2xvc2UoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIlByaW50ZXIgaXMgcmVhZHkgdG8gcHJpbnRcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkVycm9yIE9jY3VyZWQgd2hpbGUgUHJpbnRpbmc6XCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyUHJpbnRlci5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiQ2hlY2tJbkNvbXBvbmVudC5VTkFCTEVUT1BSSU5UXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJDaGVja0luQ29tcG9uZW50LlBSSU5URVJTRVNTSU9OXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiQ2hlY2tJbkNvbXBvbmVudC5OT0JMVUVUT09USERFVklDRVwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiQ2hlY2tJbkNvbXBvbmVudC5VTkFCTEVUT1BSSU5UXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiQ2hlY2tJbkNvbXBvbmVudC5VTkFCTEVUT1BSSU5UXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuZ2V0Q29tcGVuc2F0aW9uTGlzdCh0aGlzLkZsaWdodEhlYWRlckluZm8uRGVwYXJ0dXJlRGF0ZSx0aGlzLkZsaWdodEhlYWRlckluZm8uRmxpZ2h0TnVtYmVyLHRoaXMuRmxpZ2h0SGVhZGVySW5mby5EZXBhcnR1cmVBaXJwb3J0LFwiUmVhc29uV2lzZUdldFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRvYXN0Lm1ha2VUZXh0KGRhdGEuRXJyb3JzWzBdLk1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGRhdGEuRXJyb3JzWzBdLk1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJObyBFTUQgYXZpbGFibGUgZm9yIHByaW50XCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0UHJpbnRlcigpOiBzdHJpbmcge1xuICAgICAgICBpZiAoQXBwbGljYXRpb25TZXR0aW5ncy5oYXNLZXkoXCJwcmludGVyXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJwcmludGVyXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpbnRFTUQoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHZhciBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIEN1ckRhdGUgPSBtb21lbnQoc3RhcnREYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coQ3VyRGF0ZSlcbiAgICAgICAgICAgIHRoaXMuRmxpZ2h0SGVhZGVySW5mbyA9IHRoaXMuX3NoYXJlZC5nZXRGbGlnaHRIZWFkZXJJbmZvKCk7XG4gICAgICAgICAgICBsZXQgRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmU6IFByaW50TW9kdWxlLlJvb3RPYmplY3QgPSBDb252ZXJ0ZXJzLmNvbnZlcnRUb1ByaW50RU1EQ29tcGVuc2F0aW9uKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIsIHRoaXMuRmxpZ2h0SGVhZGVySW5mbyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVtYWlsIFJlcTpcIiArIEpTT04uc3RyaW5naWZ5KEVtYWlsQ29tcGVuc2F0aW9uU3RydWN0dXJlKSk7XG4gICAgICAgICAgICBpZiAoRW1haWxDb21wZW5zYXRpb25TdHJ1Y3R1cmUuUGFzc2VuZ2VycyAhPSBbXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UucHJpbnRFTURDb21wZW5zYXRpb25TZXJ2aWNlKEVtYWlsQ29tcGVuc2F0aW9uU3RydWN0dXJlKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbWFpbCBSZXM6XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wZW5zYXRpb25MaXN0KHRoaXMuRmxpZ2h0SGVhZGVySW5mby5EZXBhcnR1cmVEYXRlLCB0aGlzLkZsaWdodEhlYWRlckluZm8uRmxpZ2h0TnVtYmVyLCB0aGlzLkZsaWdodEhlYWRlckluZm8uRGVwYXJ0dXJlQWlycG9ydCwgXCJSZWFzb25XaXNlR2V0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk5vIEVNRCBhdmlsYWJsZSBmb3IgcHJpbnRcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZWxlY3RpbmdBbGxQYXgoKSB7XG4gICAgICAgIGlmICh0aGlzLlNlbGVjdEFsbFBheCA9PSBmYWxzZSAmJiB0aGlzLlNlbGVjdEFsbFBheFZhciA9PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RBbGxQYXhWYXIgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdC5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZGF0YS5Jc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuSXNTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIucHVzaChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuQ29tZW5zYXRpb25SZWFzb24gIT0gQ29tcGVuc2F0aW9uU2VhcmNoUmVzdWx0V2l0aFRhYkNvbXBvbmVudC5DT01QRU5TQVRJT05SRUFTT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuQ29tcGVuc2F0aW9uUmVhc29uID0gdGhpcy5Db21lbnNhdGlvblJlYXNvbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAodGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZEZ1bExpc3QubGVuZ3RoID09PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCkgdGhpcy5TZWxlY3RBbGxQYXggPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RBbGxQYXhWYXIgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0QWxsUGF4ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyID0gW107XG4gICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0LmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgZGF0YS5Jc1NlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gZGF0YS5Db21wZW5zYXRpb25SZWFzb24gPSBcIlwiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbGVjdGVkUGFzc2VuZ2VyQ291bnQgPSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aDtcbiAgICB9XG4gICAgZGVsZXRlKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NhdmVDb21wZW5zYXRpb24gU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcbiAgICAgICAgICAgIGxldCBTYXZlQ29tcHRlbXBsYXRlOiBhbnkgPSBDb252ZXJ0ZXJzLmNvbnZlcnRUb0RlbGV0ZUNvbXBlbnNhdGlvblRlbXBsYXRlKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIsIHRoaXMuRmxpZ2h0SGVhZGVySW5mbyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRhdGExOlwiICsgSlNPTi5zdHJpbmdpZnkoU2F2ZUNvbXB0ZW1wbGF0ZSkpO1xuICAgICAgICAgICAgdGhpcy5fc2VydmljZS5kZWxldGVDb21wZW5zYXRpb25SZWFzb25zKFNhdmVDb21wdGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuUmVzdWx0cyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgQ29tcGFuc2F0aW9uRGV0YWlsczogYW55ID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGF0YTpcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLklzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkRlbGV0ZWQgc3VjY2Vzc2Z1bGx5XCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IENvbXBhbnNhdGlvbkRldGFpbHM6IGFueSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRhdGE6XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5Jc1NlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3NlbmdlciA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3NlbmdlciA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmxpZ2h0RGF0ZSA9IHRoaXMuUGF4TGlzdC5GbGlnaHRNb2RlbC5EZXBhcnR1cmVEYXRlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmxpZ2h0TnVtYmVyID0gdGhpcy5QYXhMaXN0LkZsaWdodE1vZGVsLkZsaWdodE51bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gdGhpcy5QYXhMaXN0LkZsaWdodE1vZGVsLkRlcGFydHVyZUFpcnBvcnQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcGVuc2F0aW9uTGlzdChmbGlnaHREYXRlLCBmbGlnaHROdW1iZXIsIGxvY2F0aW9uLCBDb21wZW5zYXRpb25TZWFyY2hSZXN1bHRXaXRoVGFiQ29tcG9uZW50LlBBWFRZUEUpO1xuICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuXG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB2YXIgZW5kRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2F2ZUNvbXBlbnNhdGlvbiBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVuZERhdGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NhdmVDb21wZW5zYXRpb24gU2VydmljZSBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVuZERhdGUpKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2F2ZSgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTYXZlQ29tcGVuc2F0aW9uIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XG4gICAgICAgICAgICBsZXQgU2F2ZUNvbXB0ZW1wbGF0ZTogYW55ID0gQ29udmVydGVycy5jb252ZXJ0VG9TYXZlQ29tcGVuc2F0aW9uVGVtcGxhdGUodGhpcy5TZWxlY3RlZFBhc3NlbmdlciwgdGhpcy5GbGlnaHRIZWFkZXJJbmZvKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGF0YTE6XCIgKyBKU09OLnN0cmluZ2lmeShTYXZlQ29tcHRlbXBsYXRlKSk7XG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLnNhdmVDb21wZW5zYXRpb25SZWFzb25zKFNhdmVDb21wdGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IENvbXBhbnNhdGlvbkRldGFpbHM6IGFueSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGF0YTpcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5Jc1NlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsaWdodERhdGUgPSB0aGlzLlBheExpc3QuRmxpZ2h0TW9kZWwuRGVwYXJ0dXJlRGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZsaWdodE51bWJlciA9IHRoaXMuUGF4TGlzdC5GbGlnaHRNb2RlbC5GbGlnaHROdW1iZXI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IHRoaXMuUGF4TGlzdC5GbGlnaHRNb2RlbC5EZXBhcnR1cmVBaXJwb3J0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBlbnNhdGlvbkxpc3QoZmxpZ2h0RGF0ZSwgZmxpZ2h0TnVtYmVyLCBsb2NhdGlvbiwgQ29tcGVuc2F0aW9uU2VhcmNoUmVzdWx0V2l0aFRhYkNvbXBvbmVudC5QQVhUWVBFKTtcbiAgICAgICAgICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcblxuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdmFyIGVuZERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NhdmVDb21wZW5zYXRpb24gU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlbmREYXRlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTYXZlQ29tcGVuc2F0aW9uIFNlcnZpY2UgU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlbmREYXRlKSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldENvbXBlbnNhdGlvbkxpc3QoZGF0ZSwgZmxpZ2h0LCBsb2NhdGlvbiwgcGF4dHlwZSk6IHZvaWQge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJUeXBlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLmdldENvbXBlbnNhdGlvblBheExpc3QoZGF0ZSwgZmxpZ2h0LCBsb2NhdGlvbiwgcGF4dHlwZSkuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuUmVzdWx0cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5SZXN1bHRzWzBdLkZsaWdodFNlZ21lbnRzWzBdLlBhc3NlbmdlcnMgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbXAgbGlzdCBuZXcgbG9naWMgXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IENvbXBhbnNhdGlvbkRldGFpbHM6IGFueSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZsaWdodFN0YXR1c0ZvckNvbXBlbnNhdGlvbkxpc3QoZGF0ZSwgZmxpZ2h0LCBDb21wYW5zYXRpb25EZXRhaWxzKTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb21wIGxpc3QgbmV3IGxvZ2ljIGVsc2VcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChDb21wZW5zYXRpb25TZWFyY2hSZXN1bHRXaXRoVGFiQ29tcG9uZW50LkRBVEFOT1RGT1VORFRPQVNUKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9Db21wZW5zYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGRhdGEuRXJyb3JzWzBdLm1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvblwiICsgZXJyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJUeXBlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJUeXBlIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmxpZ2h0U3RhdHVzRm9yQ29tcGVuc2F0aW9uTGlzdChkYXRlLCBmbGlnaHQsIENvbXBQYXgpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IENvbXBlbnNhdGlvbkRldGFpbHMgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgdmFyIGRhdGUgPSBkYXRlO1xuICAgICAgICAgICAgdmFyIGZsaWdodG51bWJlciA9IGZsaWdodDtcbiAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiU2VhcmNoTG9jYXRpb25cIiwgXCJcIik7XG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLnN0YXR1cyhkYXRlLCBmbGlnaHRudW1iZXIsIGxvY2F0aW9uKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5CYWRSZXF1ZXN0ICE9IDQwMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5GbGlnaHRzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGF0dXM6IGFueSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIklOMVwiICsgSlNPTi5zdHJpbmdpZnkoc3RhdHVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0Q29tcGVuc2F0aW9uRmxpZ2h0RGV0YWlscyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmbGlnaHRTdGF0dXMgPSBDb252ZXJ0ZXJzLmNvbnZlcnRUb0ZsaWdodEhlYWRlckluZm8oZGF0YSwgQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJTZWFyY2hMb2NhdGlvblwiLCBcIlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0RmxpZ2h0SGVhZGVySW5mbyhmbGlnaHRTdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdC5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXhMaXN0ID0gQ29udmVydGVycy5jb252ZXJ0b0NvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QoQ29tcFBheCwgZGF0YSwgQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJTZWFyY2hMb2NhdGlvblwiLCBcIlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0ID0gdGhpcy5QYXhMaXN0LlBhc3Nlbmdlckxpc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0LmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuSXNDb21wZW5zYXRpb25Jc3N1ZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZC5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGVkUGF4Q291bnQgPSB0aGlzLkNvbXBQYXhMaXN0SXNzdWVkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3R0YWIudGl0bGUgPSBDb21wZW5zYXRpb25TZWFyY2hSZXN1bHRXaXRoVGFiQ29tcG9uZW50LkNPTVBFTlNBVEVEUEFYVEFCVElUTEUgKyBcIihcIiArIHRoaXMuQ29tcGVuc2F0ZWRQYXhDb3VudCArIFwiKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGlzZGV0YWlscy5wdXNoKHRoaXMuZmlyc3R0YWIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25Ob3RJc3N1ZWRQYXhDb3VudCA9IHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWNvbmR0YWIudGl0bGUgPSBDb21wZW5zYXRpb25TZWFyY2hSZXN1bHRXaXRoVGFiQ29tcG9uZW50Lk5PVENPTVBFTlNBVEVEUEFYVEFCVElUTEUgKyBcIihcIiArIHRoaXMuQ29tcGVuc2F0aW9uTm90SXNzdWVkUGF4Q291bnQgKyBcIilcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpc2RldGFpbHMucHVzaCh0aGlzLnNlY29uZHRhYik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlRvdGFsUGFzc2VuZ2VyQ291bnQgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkRnVsTGlzdC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkNvbXAgSXNzdWVkXCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLkNvbXBQYXhMaXN0SXNzdWVkKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlOiBhbnk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLm5ld0luZGV4ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0U2VnbWVudChlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGF0dXM6IGFueSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIklOMVwiICsgSlNPTi5zdHJpbmdpZnkoc3RhdHVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0Q29tcGVuc2F0aW9uRmxpZ2h0RGV0YWlscyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3QubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGF4TGlzdCA9IENvbnZlcnRlcnMuY29udmVydG9Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KENvbXBQYXgsIGRhdGEsIEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiU2VhcmNoTG9jYXRpb25cIiwgXCJcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdCA9IHRoaXMuUGF4TGlzdC5QYXNzZW5nZXJMaXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZC5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZC5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdC5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLklzQ29tcGVuc2F0aW9uSXNzdWVkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wUGF4TGlzdElzc3VlZC5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcFBheExpc3ROb3RJc3N1ZWQucHVzaChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGlzZGV0YWlscyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRlZFBheENvdW50ID0gdGhpcy5Db21wUGF4TGlzdElzc3VlZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcnN0dGFiLnRpdGxlID0gQ29tcGVuc2F0aW9uU2VhcmNoUmVzdWx0V2l0aFRhYkNvbXBvbmVudC5DT01QRU5TQVRFRFBBWFRBQlRJVExFICsgXCIoXCIgKyB0aGlzLkNvbXBlbnNhdGVkUGF4Q291bnQgKyBcIilcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpc2RldGFpbHMucHVzaCh0aGlzLmZpcnN0dGFiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uTm90SXNzdWVkUGF4Q291bnQgPSB0aGlzLkNvbXBQYXhMaXN0Tm90SXNzdWVkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2Vjb25kdGFiLnRpdGxlID0gQ29tcGVuc2F0aW9uU2VhcmNoUmVzdWx0V2l0aFRhYkNvbXBvbmVudC5OT1RDT01QRU5TQVRFRFBBWFRBQlRJVExFICsgXCIoXCIgKyB0aGlzLkNvbXBlbnNhdGlvbk5vdElzc3VlZFBheENvdW50ICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwaXNkZXRhaWxzLnB1c2godGhpcy5zZWNvbmR0YWIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Ub3RhbFBhc3NlbmdlckNvdW50ID0gdGhpcy5Db21wUGF4TGlzdE5vdElzc3VlZEZ1bExpc3QubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJDb21wIElzc3VlZFwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5Db21wUGF4TGlzdElzc3VlZCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZTogYW55O1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5uZXdJbmRleCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdFNlZ21lbnQoZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChkYXRhLmVyck1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvblwiICsgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgQ29tcGVuc2F0aW9uRGV0YWlscyBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgQ29tcGVuc2F0aW9uRGV0YWlscyBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgY29udGludWUoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSXNzdWVDb21wZW5zYXRpb24gU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcbiAgICAgICAgICAgIC8vIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgPSB0aGlzLkNvbXBQYXhMaXN0LmZpbHRlcihvYmogPT4gb2JqLklzU2VsZWN0ZWQgPT0gdHJ1ZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5maWx0ZXIobSA9PiBtLkNvbXBlbnNhdGlvblJlYXNvbiAhPSBDb21wZW5zYXRpb25TZWFyY2hSZXN1bHRXaXRoVGFiQ29tcG9uZW50LkNPTVBFTlNBVElPTlJFQVNPTikpIHtcbiAgICAgICAgICAgICAgICBsZXQgcHJpdmlsYWdlID0gdGhpcy5fc2hhcmVkLmdldEFnZW50UHJpdmlsYWdlKCk7XG4gICAgICAgICAgICAgICAgbGV0IElzc3VlQ29tcHRlbXBsYXRlOiBhbnkgPSBDb252ZXJ0ZXJzLmNvbnZlcnRUb0JSRVJlcXVlc3QodGhpcy5TZWxlY3RlZFBhc3NlbmdlciwgcHJpdmlsYWdlLCB0aGlzLkZsaWdodEhlYWRlckluZm8pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSXNzdWVDb21wdGVtcGxhdGU6XCIgKyBKU09OLnN0cmluZ2lmeShJc3N1ZUNvbXB0ZW1wbGF0ZSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UucG9zdEJyZVJlcXVlc3QoSXNzdWVDb21wdGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRhdGE6XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5SZXN1bHRzICE9IFtdICYmIGRhdGEuU3VjY2VzcyA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuUmVzdWx0c1swXS5GbGlnaHRTZWdtZW50c1swXS5QYXNzZW5nZXJzWzBdLkJSRV9Db21wZW5zYXRpb25zICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IElzc3VlQ29tcFJlc3BvbnNlID0gQ29udmVydGVycy5jb252ZXJ0VG9CUkVSZXNwb25zZShkYXRhLCB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLnNldENvbXBlbnNhdGlvblBheExpc3QoSXNzdWVDb21wUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJSRUNvbXBSZXNwb25zZTpcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCUkVDb21wUmVzcG9uc2U6XCIgKyBKU09OLnN0cmluZ2lmeShJc3N1ZUNvbXBSZXNwb25zZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRldG9pc3N1ZWNvbXBlbnNhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJVbmFibGUgdG8gcHJvY2VzcyAtIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXJcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJQbGVhc2UgY2hvb3NlIHRoZSByZWFzb25cIikuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHZhciBlbmREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJc3N1ZUNvbXBlbnNhdGlvbiBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVuZERhdGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0lzc3VlQ29tcGVuc2F0aW9uIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZW5kRGF0ZSkpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBuYXZpZ2F0ZXRvaXNzdWVjb21wZW5zYXRpb24oKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3NoYXJlZC5zZXRGbGlnaHRIZWFkZXJJbmZvKHRoaXMuRmxpZ2h0SGVhZGVySW5mbyk7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJpc3N1ZWNvbXBlbnNhdGlvblwiXSwge1xuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgIH1cbiAgICBzb3J0QmFzZWRPblBheE5hbWUoKSB7XG4gICAgICAgIHZhciBpc0FzYzogbnVtYmVyID0gdGhpcy5uYW1lU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMubmFtZVNvcnRJbmRpY2F0b3IgPSB0aGlzLm5hbWVTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcbiAgICAgICAgdGhpcy5zc3JTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMudGllclNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5jbGFzc1NvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5vcmRlcklkU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLkNvbXBQYXhMaXN0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciB2YWwxID0gYS5GdWxsTmFtZTtcbiAgICAgICAgICAgIHZhciB2YWwyID0gYi5GdWxsTmFtZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbDEgKyBcIiBcIiArIHZhbDIpO1xuICAgICAgICAgICAgaWYgKGlzQXNjID09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsMSA8IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPiB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNvcnRCYXNlZE9uU1NSKCkge1xuICAgICAgICB2YXIgaXNBc2M6IG51bWJlciA9IHRoaXMuc3NyU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMuc3NyU29ydEluZGljYXRvciA9IHRoaXMuc3NyU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMubmFtZVNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy50aWVyU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLmNsYXNzU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLm9yZGVySWRTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMuQ29tcFBheExpc3Quc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgdmFyIHZhbDEgPSBhLlNTUjtcbiAgICAgICAgICAgIHZhciB2YWwyID0gYi5TU1I7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2YWwxICsgXCIgXCIgKyB2YWwyKTtcbiAgICAgICAgICAgIGlmIChpc0FzYyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPCB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh2YWwxID4gdmFsMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzb3J0QmFzZWRPblRpZXIoKSB7XG4gICAgICAgIHZhciBpc0FzYzogbnVtYmVyID0gdGhpcy50aWVyU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMudGllclNvcnRJbmRpY2F0b3IgPSB0aGlzLnRpZXJTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcbiAgICAgICAgdGhpcy5zc3JTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMubmFtZVNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5jbGFzc1NvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5vcmRlcklkU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLkNvbXBQYXhMaXN0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciB2YWwxID0gYS5UaWVyO1xuICAgICAgICAgICAgdmFyIHZhbDIgPSBiLlRpZXI7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2YWwxICsgXCIgXCIgKyB2YWwyKTtcbiAgICAgICAgICAgIGlmIChpc0FzYyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPCB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh2YWwxID4gdmFsMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzb3J0QmFzZWRPbkNsYXNzKCkge1xuICAgICAgICB2YXIgaXNBc2M6IG51bWJlciA9IHRoaXMuY2xhc3NTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcbiAgICAgICAgdGhpcy5jbGFzc1NvcnRJbmRpY2F0b3IgPSB0aGlzLmNsYXNzU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMuc3NyU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLnRpZXJTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMubmFtZVNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5vcmRlcklkU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLkNvbXBQYXhMaXN0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciB2YWwxID0gYS5DYWJpbjtcbiAgICAgICAgICAgIHZhciB2YWwyID0gYi5DYWJpbjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbDEgKyBcIiBcIiArIHZhbDIpO1xuICAgICAgICAgICAgaWYgKGlzQXNjID09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsMSA8IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPiB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNvcnRCYXNlZE9uT3JkZXJJZCgpIHtcbiAgICAgICAgdmFyIGlzQXNjOiBudW1iZXIgPSB0aGlzLm9yZGVySWRTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcbiAgICAgICAgdGhpcy5vcmRlcklkU29ydEluZGljYXRvciA9IHRoaXMub3JkZXJJZFNvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xuICAgICAgICB0aGlzLnNzclNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy50aWVyU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLmNsYXNzU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLm5hbWVTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMuQ29tcFBheExpc3Quc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgdmFyIHZhbDEgPSBhLk9yZGVySWQ7XG4gICAgICAgICAgICB2YXIgdmFsMiA9IGIuT3JkZXJJZDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbDEgKyBcIiBcIiArIHZhbDIpO1xuICAgICAgICAgICAgaWYgKGlzQXNjID09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsMSA8IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPiB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRpc3BsYXlTU1JzKGl0ZW06IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KSB7XG4gICAgICAgIGlmIChpdGVtLlNTUnNDb3VudCA+IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUlwiICsgSlNPTi5zdHJpbmdpZnkoaXRlbS5TU1JzKSk7XG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJTU1JzXCIsXG4gICAgICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgICAgICBhY3Rpb25zOiBpdGVtLlNTUnMsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIG5hdmlnYXRldG9hZGRpdGlvbmFsZGV0YWlscyhQYXhpdGVtOiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlZcIiArIFBheGl0ZW0pXG4gICAgICAgIHZhciBwcmVQYWdlOiBzdHJpbmcgPSBcIkNvbXBlbnNhdGlvbkxpc3RcIjtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImNvbXBlbnNhdGlvbmFkZGl0aW9uYWxkZXRhaWxzXCJdLCB7XG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgfSwgcXVlcnlQYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBcImRhdGFcIjogSlNPTi5zdHJpbmdpZnkoUGF4aXRlbSksXG4gICAgICAgICAgICAgICAgXCJzZWxlY3RlZFBBeFwiOiBKU09OLnN0cmluZ2lmeSh0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyKSxcbiAgICAgICAgICAgICAgICBcInByZXBhZ2VcIjogcHJlUGFnZSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgIH1cbiAgICBuYXZpZ2F0ZVRvQ29tcGVuc2F0aW9uKCkge1xuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY29tcGVuc2F0aW9uXCJdLCB7XG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICBuYXZpZ2F0ZVRvU2V0dGluZygpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcInNldHRpbmdcIl0sIHtcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBuYXZpZ2F0ZVRvU2VhcmNoKCkge1xuICAgICAgICBpZiAodGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wic2VhcmNoXCJdLCB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbmF2aWdhdGVUb0RlcGFydHVyZXMoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzR2F0ZURpc2FibGVkID09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJkZXBhcnRob21lXCJdLCB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbmF2aWFnYXRldG9Db21wZW5zYXRpb25QcmludExpc3R3aXRodGFiKCkge1xuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY29tcGVuc2F0aW9ucHJpbnRzY3JlZW5cIl0sIHtcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBoYW5kbGVTZXJ2aWNlRXJyb3IoZXJyb3I6IGFueSkge1xuICAgICAgICB2YXIgZXJyb3JNZXNzYWdlID0gZXJyb3IudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKGVycm9yTWVzc2FnZS5pbmRleE9mKFwiU2Vzc2lvblRpbWVvdXRcIikgPiAtMSkge1xuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiU2Vzc2lvbiBUaW1lIE91dFwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiWW91ciBzZXNzaW9uIGhhcyBiZWVuIHRpbWUgb3V0XCIsXG4gICAgICAgICAgICAgICAgb2tCdXR0b25UZXh0OiBcIk9LXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkaWFsb2dzLmFsZXJ0KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJcIl0sIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZXJyb3JNZXNzYWdlKS5zaG93KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdfQ==