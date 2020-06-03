"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var page_1 = require("ui/page");
var dialogs = require("ui/dialogs");
//external modules and plugins
var ApplicationSettings = require("application-settings");
var moment = require("moment");
var Toast = require("nativescript-toast");
//app references
var country_modal_1 = require("../../components/country/country-modal");
var index_1 = require("../../shared/interface/index");
var index_2 = require("../../shared/services/index");
var index_3 = require("../../shared/model/index");
var index_4 = require("../../shared/utils/index");
var app_constants_1 = require("../../app.constants");
var app_executiontime_1 = require("../../app.executiontime");
var timeOut_service_1 = require("../../shared/services/timeOut.service");
var CompensationSearchResultComponent = /** @class */ (function () {
    function CompensationSearchResultComponent(_configuration, _services, activatedRouter, _shared, page, routerExtensions, _timeoutService, router, _dataService, _service, route, vcRef, _modalService) {
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
        this.SearchFields = new index_3.Search();
        this.PassengerTypeList = new index_3.PassengerTypeModel.RootObject();
        this.SelectAllPax = false;
        this.SelectAllPaxVar = false;
        this.checkedCount = 0;
        this.TotalPassengerCount = 0;
        this.selectedPassengerCount = 0;
        this.SearchCriteria = "Name";
        this.PassengerFliterCriteria = "All Passengers";
        this.AgentPrivilage = new index_3.AgentPrivilage.RootObject();
        this.IsPaxReasonSelected = false;
        this.CompensationReasonList = [];
        this.SelectedPassenger = [];
        this.CompensationPassengerList = [];
        this.CompensationFullPaxList = [];
        this.CompensationModel = new index_1.CompensationSearchModule.CompensationRootObject;
        this.CompensationReason = [];
        this.nameSortIndicator = -1;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.showSmartSearchField = true;
        this.isError = false;
        this.errorMessage = "";
        this.SearchFields.FlightDate = moment().format("DD MMMM YYYY");
        this.CurDate = moment().toDate();
        this.startDate = new Date();
        this.loaderProgress = new index_1.LoaderProgress();
    }
    CompensationSearchResultComponent_1 = CompensationSearchResultComponent;
    CompensationSearchResultComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.ComensationReason = CompensationSearchResultComponent_1.COMPENSATIONREASON;
        this.loaderProgress.initLoader(this.pageCont);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.FlightDetails = this._shared.getCompensationFlightDetails();
        this.CompensationList = this._shared.getCompensationList();
        console.log("before flight convertor");
        console.log(ApplicationSettings.getString("SearchLocation", ""));
        this.CompensationModel = index_4.Converters.convertoCompensationPassengerList(this.CompensationList, this.FlightDetails, ApplicationSettings.getString("SearchLocation", ""));
        this._shared.setFlightHeaderInfo(this.CompensationModel.FlightModel);
        this._shared.setCompensationPaxList(this.CompensationModel.PassengerList);
        console.log("Came here");
        this.CompensationPassengerList = this._shared.getCompensationPaxList();
        console.dir(this.CompensationPassengerList);
        this.TotalPassengerCount = this.CompensationPassengerList.length;
        this.CompensationFullPaxList = this.CompensationPassengerList;
        this.activatedRouter.queryParams.subscribe(function (params) {
            if (params["data"] != null && params["data"] != "" && params["data"] != "undefined") {
                _this.PassengerType = params["data"];
            }
        });
        this.getCompensationReason();
    };
    CompensationSearchResultComponent.prototype.toggleChecked = function (pax) {
        var _this = this;
        if (pax.IsSelected == false) {
            pax.IsSelected = true;
            this.SelectedPassenger.push(pax);
            if (this.ComensationReason != CompensationSearchResultComponent_1.COMPENSATIONREASON) {
                pax.CompensationReason = this.ComensationReason;
                pax.CompensationReasonId = this.CompensationReasonList.filter(function (m) { return m.CompReasonText == _this.ComensationReason; })[0].CompReasonId;
            }
            if (this.CompensationFullPaxList.length === this.SelectedPassenger.length)
                this.SelectAllPax = true;
        }
        else {
            this.SelectedPassenger.splice(this.SelectedPassenger.indexOf(pax), 1);
            if (pax.Compensations == null) {
                pax.CompensationReason = "";
                pax.CompensationReasonId = null;
            }
            else {
                this.CompensationPassengerList.forEach(function (data, Index) {
                    if (data.GivenName == pax.GivenName && data.LastName == pax.LastName && data.OrderId == pax.OrderId) {
                        pax.CompensationReason = data.Compensations[0].CompReasonText;
                        pax.CompensationReasonId = data.Compensations[0].CompReasonId;
                    }
                });
            }
            this.IsPaxReasonSelected = false;
            pax.IsSelected = false;
            this.SelectAllPax = false;
        }
        this.selectedPassengerCount = this.SelectedPassenger.length;
        console.log(JSON.stringify(this.SelectedPassenger.length));
    };
    CompensationSearchResultComponent.prototype.filter = function (args) {
        console.log("Name:" + JSON.stringify(args));
        this.CompensationPassengerList = this.CompensationFullPaxList;
        if (this.SearchCriteria == "Name") {
            if (args) {
                var name_1 = args.toString().toUpperCase();
                this.CompensationPassengerList = this.CompensationPassengerList.filter(function (r) { return r.GivenName.indexOf(name_1.trim()) >= 0 || r.LastName.indexOf(name_1.trim()) >= 0; });
            }
            else {
                this.CompensationPassengerList = this.CompensationFullPaxList;
            }
        }
        else if (this.SearchCriteria == "Order ID") {
            if (args) {
                var name_2 = args.toString().toUpperCase();
                this.CompensationPassengerList = this.CompensationPassengerList.filter(function (r) { return r.OrderId.indexOf(name_2.trim()) >= 0; });
            }
            else {
                this.CompensationPassengerList = this.CompensationFullPaxList;
            }
        }
        else {
            console.log("Class search");
            if (args) {
                var name_3 = args.toString().toUpperCase();
                if (this.CompensationPassengerList.filter(function (r) { return r.Cabin != null; })) {
                    this.CompensationPassengerList = this.CompensationPassengerList.filter(function (r) { return r.Cabin.indexOf(name_3.trim()) >= 0; });
                }
            }
            else {
                this.CompensationPassengerList = this.CompensationFullPaxList;
            }
        }
        this.TotalPassengerCount = this.CompensationPassengerList.length;
        if (this.SelectedPassenger.length === this.CompensationFullPaxList.length) {
            this.SelectAllPax = true;
        }
        else {
            this.SelectAllPax = false;
        }
    };
    CompensationSearchResultComponent.prototype.saveEnabled = function () {
        var _this = this;
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
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
    CompensationSearchResultComponent.prototype.continueEnabled = function () {
        var _this = this;
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
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
    CompensationSearchResultComponent.prototype.displayProductActionDialogForSmartFilter = function () {
        var _this = this;
        var options = {
            title: "Smart filter option",
            cancelButtonText: "Cancel",
            actions: ["Name", "Order ID", "Class", "All Passengers", "ETKT Passengers", "Checked-In Passengers", "Not Checked-In Passengers", "Outbound Passenger"],
        };
        dialogs.action(options).then(function (result) {
            if (result != "Cancel") {
                _this.SearchCriteria = result;
                if (_this.SearchCriteria == "Name" || _this.SearchCriteria == "Order ID" || _this.SearchCriteria == "Class") {
                    _this.showSmartSearchField = true;
                    _this.CompensationPassengerList = _this.CompensationFullPaxList;
                }
                else {
                    _this.showSmartSearchField = false;
                    if (_this.SearchCriteria == "All Passengers") {
                        _this.CompensationPassengerList = _this.CompensationFullPaxList;
                    }
                    else if (_this.SearchCriteria == "ETKT Passengers") {
                        _this.CompensationPassengerList = _this.CompensationFullPaxList.filter(function (m) { return m.EticketStatus == "True"; });
                    }
                    else if (_this.SearchCriteria == "Checked-In Passengers") {
                        _this.CompensationPassengerList = _this.CompensationFullPaxList.filter(function (m) { return m.CheckedInIndicator.indexOf('Checkedin') > -1 && m.CheckedInIndicator !== 'CheckedinSeatDeleted'; });
                    }
                    else if (_this.SearchCriteria == "Not Checked-In Passengers") {
                        _this.CompensationPassengerList = _this.CompensationFullPaxList.filter(function (m) { return m.CheckedInIndicator != "Checkedin"; });
                    }
                    else {
                        _this.CompensationPassengerList = _this.CompensationFullPaxList.filter(function (m) { return m.OutboundIndicator == "true"; });
                    }
                }
            }
        });
        this.TotalPassengerCount = this.CompensationPassengerList.length;
        if (this.SelectedPassenger.length >= this.CompensationPassengerList.length) {
            this.SelectAllPax = true;
        }
        else {
            this.SelectAllPax = false;
        }
    };
    CompensationSearchResultComponent.prototype.displayDialogForFliterPassengerType = function () {
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
    CompensationSearchResultComponent.prototype.displayProductActionDialog = function () {
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
    CompensationSearchResultComponent.prototype.getCompensationReason = function () {
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
                        // console.log("Reason :" + JSON.stringify(this.CompensationReasonList));
                    });
                    _this.loaderProgress.hideLoader();
                }
                else {
                    Toast.makeText(CompensationSearchResultComponent_1.COMPENSATIONREASONTOAST + data.Errors[0].Message).show();
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
    CompensationSearchResultComponent.prototype.selectingAllPax = function () {
        var _this = this;
        if (this.SelectAllPax == false && this.SelectAllPaxVar == false) {
            this.SelectAllPaxVar = true;
            this.CompensationPassengerList.forEach(function (data, index) {
                if (!data.IsSelected) {
                    if (_this.ComensationReason != CompensationSearchResultComponent_1.COMPENSATIONREASON) {
                        data.CompensationReason = _this.ComensationReason;
                        data.CompensationReasonId = _this.CompensationReasonList.filter(function (m) { return m.CompReasonText == _this.ComensationReason; })[0].CompReasonId;
                    }
                    data.IsSelected = true;
                    _this.SelectedPassenger.push(data);
                }
            });
        }
        else {
            this.SelectAllPaxVar = false;
            this.SelectedPassenger = [];
            this.CompensationFullPaxList.forEach(function (data, index) {
                data.IsSelected = false;
            });
            this.SelectAllPax = false;
            this.CompensationPassengerList.forEach(function (data, index) {
                data.IsSelected = false;
                if (data.Compensations == null) {
                    data.CompensationReason = "";
                    data.CompensationReasonId = null;
                }
            });
        }
        this.selectedPassengerCount = this.SelectedPassenger.length;
        if (this.CompensationFullPaxList.length === this.SelectedPassenger.length)
            this.SelectAllPax = true;
    };
    CompensationSearchResultComponent.prototype.save = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('SaveCompensation Service --------------- Start Date Time : ' + sDate);
            var SaveComptemplate = index_4.Converters.convertToSaveCompensationTemplate(this.SelectedPassenger, this.CompensationModel.FlightModel);
            console.log("Data1:" + JSON.stringify(SaveComptemplate));
            this._service.saveCompensationReasons(SaveComptemplate)
                .subscribe(function (data) {
                if (data.Results != null) {
                    var CompansationDetails = data;
                    Toast.makeText("Saved Successfully").show();
                    console.log("Data:" + JSON.stringify(data));
                    _this.SelectedPassenger.forEach(function (data, index) {
                        data.IsSelected = false;
                    });
                    _this.SelectedPassenger = [];
                    var flightDate = _this.CompensationModel.FlightModel.DepartureDate;
                    var flightNumber = _this.CompensationModel.FlightModel.FlightNumber;
                    var location = _this.CompensationModel.FlightModel.DepartureAirport;
                    _this.PassengerTypeList = _this._shared.GetPassengerTypeService();
                    if (_this.PassengerType) {
                        var PaxType;
                        PaxType = _this.PassengerTypeList.PassengerTypeListTable.filter(function (m) { return m.Value.Description == _this.PassengerType; })[0].Key;
                        _this.getPassengerList(flightDate, flightNumber, location, PaxType);
                    }
                    else {
                        _this.CompensationModel = index_4.Converters.convertoCompensationPassengerList(data, _this.FlightDetails, location);
                        _this.CompensationPassengerList = _this.CompensationModel.PassengerList;
                        console.log(_this.CompensationModel);
                        _this.loaderProgress.hideLoader();
                    }
                }
                else {
                    Toast.makeText(data.Errors[0].Message).show();
                    _this.loaderProgress.hideLoader();
                }
            }, function (err) {
                Toast.makeText(err).show();
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
    CompensationSearchResultComponent.prototype.getPassengerList = function (flightDate, flightNumber, location, PaxType) {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get CompensationDetails Service --------------- Start Date Time : ' + sDate);
            this._service.getPassengerTypeList(flightDate, flightNumber, location, PaxType).subscribe(function (data) {
                if (data.BadRequest != 400) {
                    if (data.FlightSegments) {
                        var CompansationDetails = data;
                        _this.CompensationModel = index_4.Converters.convertoCompensationPassengerList(CompansationDetails, _this.FlightDetails, ApplicationSettings.getString("SearchLocation", ""));
                        _this.CompensationPassengerList = _this.CompensationModel.PassengerList;
                        _this.loaderProgress.hideLoader();
                        var eDate = new Date();
                        console.log('Get CompensationDetails Service --------------- End Date Time : ' + eDate);
                        console.log('Get CompensationDetails Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
                    }
                    else {
                        Toast.makeText(data.Errors.message).show();
                        _this.loaderProgress.hideLoader();
                    }
                }
                else {
                    Toast.makeText(data.errMessage).show();
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
            var eDate = new Date();
            console.log('Get CompensationDetails Service --------------- End Date Time : ' + eDate);
            console.log('Get CompensationDetails Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    CompensationSearchResultComponent.prototype.sortBasedOnPaxName = function () {
        var isAsc = this.nameSortIndicator == 0 ? 1 : 0;
        this.nameSortIndicator = this.nameSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.CompensationPassengerList.sort(function (a, b) {
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
    CompensationSearchResultComponent.prototype.sortBasedOnSSR = function () {
        var isAsc = this.ssrSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = this.ssrSortIndicator == 0 ? 1 : 0;
        this.nameSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.CompensationPassengerList.sort(function (a, b) {
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
    CompensationSearchResultComponent.prototype.sortBasedOnTier = function () {
        var isAsc = this.tierSortIndicator == 0 ? 1 : 0;
        this.tierSortIndicator = this.tierSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.nameSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.CompensationPassengerList.sort(function (a, b) {
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
    CompensationSearchResultComponent.prototype.sortBasedOnClass = function () {
        var isAsc = this.classSortIndicator == 0 ? 1 : 0;
        this.classSortIndicator = this.classSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.nameSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.CompensationPassengerList.sort(function (a, b) {
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
    CompensationSearchResultComponent.prototype.sortBasedOnOrderId = function () {
        var isAsc = this.orderIdSortIndicator == 0 ? 1 : 0;
        this.orderIdSortIndicator = this.orderIdSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.nameSortIndicator = -1;
        this.CompensationPassengerList.sort(function (a, b) {
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
    CompensationSearchResultComponent.prototype.continue = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('IssueCompensation Service --------------- Start Date Time : ' + sDate);
            // this.SelectedPassenger = this.CompensationPassengerList.filter(obj => obj.IsSelected == true);
            // if (this.SelectedPassenger.filter(m => m.CompensationReason != CompensationSearchResultComponent.COMPENSATIONREASON)) {
            var privilage = this._shared.getAgentPrivilage();
            var IssueComptemplate = index_4.Converters.convertToBRERequest(this.SelectedPassenger, privilage, this.CompensationModel.FlightModel);
            console.log("IssueComptemplate:" + JSON.stringify(IssueComptemplate));
            this._service.postBreRequest(IssueComptemplate)
                .subscribe(function (data) {
                console.log("Data:" + JSON.stringify(data));
                if (data.BadRequest != 400) {
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
                        Toast.makeText(data.Warnings[0].Message).show();
                        if (data.Errors) {
                            Toast.makeText(data.Errors[0].Message).show();
                        }
                    }
                }
                else {
                    Toast.makeText(data.errMessage).show();
                    _this.loaderProgress.hideLoader();
                }
            }, function (err) {
                _this.handleServiceError(err);
                _this.loaderProgress.hideLoader();
            });
            // } 
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
    CompensationSearchResultComponent.prototype.navigatetoissuecompensation = function () {
        var prePage = "normal";
        this.routerExtensions.navigate(["issuecompensation"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }, queryParams: {
                "prepage": JSON.stringify(prePage),
            }
        });
    };
    CompensationSearchResultComponent.prototype.navigatetoadditionaldetails = function (Paxitem) {
        if (Paxitem.IsSelected) {
            console.dir(this.SelectedPassenger);
            var prePage = "SearchResult";
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
        // }
    };
    CompensationSearchResultComponent.prototype.navigateToCompensation = function () {
        this.routerExtensions.navigate(["compensation"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSearchResultComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSearchResultComponent.prototype.navigateToSearch = function () {
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
    CompensationSearchResultComponent.prototype.navigateToDepartures = function () {
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
    CompensationSearchResultComponent.prototype.displaySSRs = function (item) {
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
    CompensationSearchResultComponent.prototype.handleServiceError = function (error) {
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
    var CompensationSearchResultComponent_1;
    CompensationSearchResultComponent.COMPENSATIONREASON = "Select Reason";
    CompensationSearchResultComponent.COMPENSATIONREASONTOAST = "Compensation Reason:";
    __decorate([
        core_1.ViewChild('pagecontainer'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationSearchResultComponent.prototype, "pageCont", void 0);
    __decorate([
        core_1.ViewChild('Scroller'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationSearchResultComponent.prototype, "Scroller", void 0);
    CompensationSearchResultComponent = CompensationSearchResultComponent_1 = __decorate([
        core_1.Component({
            selector: "compensationsearch-page",
            providers: [index_2.DataService, index_2.PassengerService, app_constants_1.Configuration, index_2.CompensationService],
            templateUrl: "./components/compensationsearchresult/compensationsearchresult.component.html",
            styleUrls: ["./components/compensationsearchresult/compensationsearchresult.component.css"]
        }),
        __metadata("design:paramtypes", [app_constants_1.Configuration, index_2.PassengerService, router_1.ActivatedRoute, index_2.CheckinOrderService, page_1.Page, router_2.RouterExtensions, timeOut_service_1.TimeOutService, router_1.Router, index_2.DataService, index_2.CompensationService, router_1.ActivatedRoute, core_1.ViewContainerRef, modal_dialog_1.ModalDialogService])
    ], CompensationSearchResultComponent);
    return CompensationSearchResultComponent;
}());
exports.CompensationSearchResultComponent = CompensationSearchResultComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGVuc2F0aW9uc2VhcmNocmVzdWx0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbXBlbnNhdGlvbnNlYXJjaHJlc3VsdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsc0NBQTJGO0FBQzNGLDBDQUEyRTtBQUUzRSxzREFBK0Q7QUFDL0Qsa0VBQTJGO0FBQzNGLGdDQUErQjtBQUMvQixvQ0FBc0M7QUFPdEMsOEJBQThCO0FBQzlCLDBEQUE0RDtBQUM1RCwrQkFBaUM7QUFDakMsMENBQTRDO0FBRTVDLGdCQUFnQjtBQUNoQix3RUFBcUY7QUFDckYsc0RBQTJLO0FBQzNLLHFEQUFzSDtBQUN0SCxrREFBNE07QUFDNU0sa0RBQXNEO0FBRXRELHFEQUFvRDtBQUNwRCw2REFBMkQ7QUFHM0QseUVBQXVFO0FBVXZFO0lBeUNJLDJDQUFvQixjQUE2QixFQUFVLFNBQTJCLEVBQVUsZUFBK0IsRUFBVSxPQUE0QixFQUFVLElBQVUsRUFBVSxnQkFBa0MsRUFBUyxlQUErQixFQUFVLE1BQWMsRUFBUyxZQUF5QixFQUFTLFFBQTZCLEVBQVUsS0FBcUIsRUFBVSxLQUF1QixFQUFVLGFBQWlDO1FBQXBjLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFxQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQVMsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBcUI7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUFVLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQVUsa0JBQWEsR0FB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QztJQUZuQyxpQ0FBaUM7UUFSN0MsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSx5QkFBeUI7WUFDbkMsU0FBUyxFQUFFLENBQUMsbUJBQVcsRUFBRSx3QkFBZ0IsRUFBRSw2QkFBYSxFQUFFLDJCQUFtQixDQUFDO1lBQzlFLFdBQVcsRUFBRSwrRUFBK0U7WUFDNUYsU0FBUyxFQUFFLENBQUMsOEVBQThFLENBQUM7U0FFOUYsQ0FBQzt5Q0EyQ3NDLDZCQUFhLEVBQXFCLHdCQUFnQixFQUEyQix1QkFBYyxFQUFtQiwyQkFBbUIsRUFBZ0IsV0FBSSxFQUE0Qix5QkFBZ0IsRUFBMEIsZ0NBQWMsRUFBa0IsZUFBTSxFQUF1QixtQkFBVyxFQUFtQiwyQkFBbUIsRUFBaUIsdUJBQWMsRUFBaUIsdUJBQWdCLEVBQXlCLGlDQUFrQjtPQXpDL2MsaUNBQWlDLENBNHNCN0M7SUFBRCx3Q0FBQztDQUFBLEFBNXNCRCxJQTRzQkM7QUE1c0JZLDhFQUFpQyIsInNvdXJjZXNDb250ZW50IjpbIi8vYW5ndWxhciAmIG5hdGl2ZXNjcmlwdCByZWZlcmVuY2VzXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvbkV4dHJhcywgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgTW9kYWxEaWFsb2dTZXJ2aWNlLCBNb2RhbERpYWxvZ09wdGlvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcbmltcG9ydCBkaWFsb2dzID0gcmVxdWlyZShcInVpL2RpYWxvZ3NcIilcbmltcG9ydCB7IFNjcm9sbFZpZXcgfSBmcm9tIFwidWkvc2Nyb2xsLXZpZXdcIjtcbmltcG9ydCB7IExpc3RWaWV3IH0gZnJvbSBcInVpL2xpc3Qtdmlld1wiO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gXCJ1aS9jb3JlL3ZpZXdcIjtcbmltcG9ydCB0ZXh0RmllbGQgPSByZXF1aXJlKFwidWkvdGV4dC1maWVsZFwiKTtcbmltcG9ydCAqIGFzIGdlc3R1cmVzIGZyb20gXCJ1aS9nZXN0dXJlc1wiO1xuXG4vL2V4dGVybmFsIG1vZHVsZXMgYW5kIHBsdWdpbnNcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcblxuLy9hcHAgcmVmZXJlbmNlc1xuaW1wb3J0IHsgQ3JlYXRpbmdMaXN0UGlja2VyQ29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvY291bnRyeS9jb3VudHJ5LW1vZGFsXCI7XG5pbXBvcnQgeyBMb2FkZXJQcm9ncmVzcywgUGFzc2VuZ2VyTGlzdFRlbXBsYXRlLCBQYXNzZW5nZXJMaXN0LCBBY2NvbnRQcm9maWxlTW9kZWwsIENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZSwgQ29tcGVuc2F0aW9uUmVhc29uTW9kdWxlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9pbnRlcmZhY2UvaW5kZXhcIlxuaW1wb3J0IHsgRGF0YVNlcnZpY2UsIENoZWNraW5PcmRlclNlcnZpY2UsIFBhc3NlbmdlclNlcnZpY2UsIENvbXBlbnNhdGlvblNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL2luZGV4XCI7XG5pbXBvcnQgeyBPcmRlciwgQ291bnRyeUNvbGxlY3Rpb24sIEZsaWdodFNlcnZpY2VJbmZvLCBGbGlnaHQsIFNlYXJjaCwgQWNjb3VudFByb2ZpbGUsIEFQSVNEb2N1bWVudCwgQ29tcGFuc2F0aW9uLCBDb21wZW5zYXRpb25QYXhMaXN0LCBBZ2VudFByaXZpbGFnZSwgUGFzc2VuZ2VyVHlwZU1vZGVsIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9tb2RlbC9pbmRleFwiO1xuaW1wb3J0IHsgQ29udmVydGVycyB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXRpbHMvaW5kZXhcIjtcbmltcG9ydCB7IERhdGVQaWNrZXJNb2RhbCwgRGF0ZVBpY2tldENvbnRleHQgfSBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9kYXRlLXBpY2tlci9kYXRlLXBpY2tlci1tb2RhbFwiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uLy4uL2FwcC5jb25zdGFudHMnO1xuaW1wb3J0IHsgQXBwRXhlY3V0aW9udGltZSB9IGZyb20gXCIuLi8uLi9hcHAuZXhlY3V0aW9udGltZVwiO1xuaW1wb3J0IHsgaXNBbmRyb2lkLCBpc0lPUywgZGV2aWNlLCBzY3JlZW4gfSBmcm9tIFwicGxhdGZvcm1cIjtcbmltcG9ydCB7IEZRVFYgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL21vZGVsL2luZGV4XCJcbmltcG9ydCB7IFRpbWVPdXRTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy90aW1lT3V0LnNlcnZpY2VcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwiY29tcGVuc2F0aW9uc2VhcmNoLXBhZ2VcIixcbiAgICBwcm92aWRlcnM6IFtEYXRhU2VydmljZSwgUGFzc2VuZ2VyU2VydmljZSwgQ29uZmlndXJhdGlvbiwgQ29tcGVuc2F0aW9uU2VydmljZV0sXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9jb21wb25lbnRzL2NvbXBlbnNhdGlvbnNlYXJjaHJlc3VsdC9jb21wZW5zYXRpb25zZWFyY2hyZXN1bHQuY29tcG9uZW50Lmh0bWxcIixcbiAgICBzdHlsZVVybHM6IFtcIi4vY29tcG9uZW50cy9jb21wZW5zYXRpb25zZWFyY2hyZXN1bHQvY29tcGVuc2F0aW9uc2VhcmNocmVzdWx0LmNvbXBvbmVudC5jc3NcIl1cblxufSlcblxuZXhwb3J0IGNsYXNzIENvbXBlbnNhdGlvblNlYXJjaFJlc3VsdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgQFZpZXdDaGlsZCgncGFnZWNvbnRhaW5lcicpIHBhZ2VDb250OiBFbGVtZW50UmVmO1xuICAgIEBWaWV3Q2hpbGQoJ1Njcm9sbGVyJykgU2Nyb2xsZXI6IEVsZW1lbnRSZWY7XG4gICAgcHVibGljIGlzRXJyb3I6IGJvb2xlYW47XG4gICAgcHVibGljIGVycm9yTWVzc2FnZTogc3RyaW5nO1xuICAgIHB1YmxpYyBsb2FkZXJQcm9ncmVzczogTG9hZGVyUHJvZ3Jlc3M7XG4gICAgcHVibGljIHN0YXJ0RGF0ZTogRGF0ZTtcbiAgICBwdWJsaWMgU2VhcmNoRmllbGRzOiBTZWFyY2ggPSBuZXcgU2VhcmNoKCk7XG4gICAgcHVibGljIEN1ckRhdGU6IERhdGU7XG4gICAgcHVibGljIHVzZXJkZXRhaWxzOiBhbnk7XG4gICAgcHVibGljIENvbWVuc2F0aW9uUmVhc29uOiBhbnk7XG4gICAgcHVibGljIFBhc3NlbmdlclR5cGVMaXN0OiBQYXNzZW5nZXJUeXBlTW9kZWwuUm9vdE9iamVjdCA9IG5ldyBQYXNzZW5nZXJUeXBlTW9kZWwuUm9vdE9iamVjdCgpO1xuICAgIHB1YmxpYyBTZWxlY3RBbGxQYXg6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgU2VsZWN0QWxsUGF4VmFyOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGNoZWNrZWRDb3VudDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgRmxpZ2h0RGV0YWlsczogYW55O1xuICAgIHB1YmxpYyBQYXNzZW5nZXJUeXBlOiBhbnk7XG4gICAgcHVibGljIFRvdGFsUGFzc2VuZ2VyQ291bnQ6IG51bWJlciA9IDA7XG4gICAgcHVibGljIHNlbGVjdGVkUGFzc2VuZ2VyQ291bnQ6IG51bWJlciA9IDA7XG4gICAgcHVibGljIFNlYXJjaENyaXRlcmlhOiBhbnkgPSBcIk5hbWVcIjtcbiAgICBwdWJsaWMgUGFzc2VuZ2VyRmxpdGVyQ3JpdGVyaWE6IGFueSA9IFwiQWxsIFBhc3NlbmdlcnNcIjtcbiAgICBwdWJsaWMgQWdlbnRQcml2aWxhZ2U6IEFnZW50UHJpdmlsYWdlLlJvb3RPYmplY3QgPSBuZXcgQWdlbnRQcml2aWxhZ2UuUm9vdE9iamVjdCgpO1xuICAgIHB1YmxpYyBJc1BheFJlYXNvblNlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIENvbXBlbnNhdGlvblJlYXNvbkxpc3Q6IEFycmF5PENvbXBlbnNhdGlvblJlYXNvbk1vZHVsZS5Db21wZW5zYXRpb25SZWFzb24+ID0gW107XG4gICAgcHVibGljIENvbXBlbnNhdGlvbkxpc3Q6IENvbXBlbnNhdGlvblBheExpc3QuUm9vdE9iamVjdDtcbiAgICBwdWJsaWMgU2VsZWN0ZWRQYXNzZW5nZXI6IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25QYXNzZW5nZXJMaXN0OiBBcnJheTxDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdD4gPSBbXTtcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uRnVsbFBheExpc3Q6IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25Nb2RlbDogQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblJvb3RPYmplY3QgPSBuZXcgQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblJvb3RPYmplY3Q7XG4gICAgcHVibGljIENvbXBlbnNhdGlvblJlYXNvbjogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgIHB1YmxpYyBuYW1lU29ydEluZGljYXRvcjogbnVtYmVyID0gLTE7XG4gICAgcHVibGljIHNzclNvcnRJbmRpY2F0b3I6IG51bWJlciA9IC0xO1xuICAgIHB1YmxpYyB0aWVyU29ydEluZGljYXRvcjogbnVtYmVyID0gLTE7XG4gICAgcHVibGljIGNsYXNzU29ydEluZGljYXRvcjogbnVtYmVyID0gLTE7XG4gICAgcHVibGljIG9yZGVySWRTb3J0SW5kaWNhdG9yOiBudW1iZXIgPSAtMTtcbiAgICBwdWJsaWMgaXNDaGVja2luRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgaXNHYXRlRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgc2hvd1NtYXJ0U2VhcmNoRmllbGQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHB1YmxpYyBzdGF0aWMgQ09NUEVOU0FUSU9OUkVBU09OOiBzdHJpbmcgPSBcIlNlbGVjdCBSZWFzb25cIjtcbiAgICBwdWJsaWMgc3RhdGljIENPTVBFTlNBVElPTlJFQVNPTlRPQVNUOiBzdHJpbmcgPSBcIkNvbXBlbnNhdGlvbiBSZWFzb246XCI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uLCBwcml2YXRlIF9zZXJ2aWNlczogUGFzc2VuZ2VyU2VydmljZSwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZXI6IEFjdGl2YXRlZFJvdXRlLCBwcml2YXRlIF9zaGFyZWQ6IENoZWNraW5PcmRlclNlcnZpY2UsIHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSByb3V0ZXJFeHRlbnNpb25zOiBSb3V0ZXJFeHRlbnNpb25zLCBwdWJsaWMgX3RpbWVvdXRTZXJ2aWNlOiBUaW1lT3V0U2VydmljZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHVibGljIF9kYXRhU2VydmljZTogRGF0YVNlcnZpY2UsIHB1YmxpYyBfc2VydmljZTogQ29tcGVuc2F0aW9uU2VydmljZSwgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgdmNSZWY6IFZpZXdDb250YWluZXJSZWYsIHByaXZhdGUgX21vZGFsU2VydmljZTogTW9kYWxEaWFsb2dTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuU2VhcmNoRmllbGRzLkZsaWdodERhdGUgPSBtb21lbnQoKS5mb3JtYXQoXCJERCBNTU1NIFlZWVlcIik7XG4gICAgICAgIHRoaXMuQ3VyRGF0ZSA9IG1vbWVudCgpLnRvRGF0ZSgpO1xuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MgPSBuZXcgTG9hZGVyUHJvZ3Jlc3MoKTtcbiAgICB9XG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMucGFnZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnfi9pbWFnZXMvbG9naW5fYmFjay5qcGVnJylcIjtcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRTaXplID0gXCJjb3ZlciBcIjtcbiAgICAgICAgdGhpcy5Db21lbnNhdGlvblJlYXNvbiA9IENvbXBlbnNhdGlvblNlYXJjaFJlc3VsdENvbXBvbmVudC5DT01QRU5TQVRJT05SRUFTT047XG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaW5pdExvYWRlcih0aGlzLnBhZ2VDb250KTtcbiAgICAgICAgdGhpcy51c2VyZGV0YWlscyA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcmRldGFpbHNcIiwgXCJcIik7XG4gICAgICAgIHRoaXMuaXNDaGVja2luRGlzYWJsZWQgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJjaGVja2luRGlzYWJsZWRcIik7XG4gICAgICAgIHRoaXMuaXNHYXRlRGlzYWJsZWQgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJnYXRlRGlzYWJsZWRcIik7XG4gICAgICAgIHRoaXMuRmxpZ2h0RGV0YWlscyA9IHRoaXMuX3NoYXJlZC5nZXRDb21wZW5zYXRpb25GbGlnaHREZXRhaWxzKCk7XG4gICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uTGlzdCA9IHRoaXMuX3NoYXJlZC5nZXRDb21wZW5zYXRpb25MaXN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiYmVmb3JlIGZsaWdodCBjb252ZXJ0b3JcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiU2VhcmNoTG9jYXRpb25cIiwgXCJcIikpO1xuICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbk1vZGVsID0gQ29udmVydGVycy5jb252ZXJ0b0NvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QodGhpcy5Db21wZW5zYXRpb25MaXN0LCB0aGlzLkZsaWdodERldGFpbHMsIEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiU2VhcmNoTG9jYXRpb25cIiwgXCJcIikpO1xuICAgICAgICB0aGlzLl9zaGFyZWQuc2V0RmxpZ2h0SGVhZGVySW5mbyh0aGlzLkNvbXBlbnNhdGlvbk1vZGVsLkZsaWdodE1vZGVsKTtcbiAgICAgICAgdGhpcy5fc2hhcmVkLnNldENvbXBlbnNhdGlvblBheExpc3QodGhpcy5Db21wZW5zYXRpb25Nb2RlbC5QYXNzZW5nZXJMaXN0KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJDYW1lIGhlcmVcIik7XG4gICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCA9IHRoaXMuX3NoYXJlZC5nZXRDb21wZW5zYXRpb25QYXhMaXN0KCk7XG4gICAgICAgIGNvbnNvbGUuZGlyKHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCk7XG4gICAgICAgIHRoaXMuVG90YWxQYXNzZW5nZXJDb3VudCA9IHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdC5sZW5ndGg7XG4gICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uRnVsbFBheExpc3QgPSB0aGlzLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVkUm91dGVyLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZSgocGFyYW1zKSA9PiB7XG4gICAgICAgICAgICBpZiAocGFyYW1zW1wiZGF0YVwiXSAhPSBudWxsICYmIHBhcmFtc1tcImRhdGFcIl0gIT0gXCJcIiAmJiBwYXJhbXNbXCJkYXRhXCJdICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLlBhc3NlbmdlclR5cGUgPSBwYXJhbXNbXCJkYXRhXCJdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5nZXRDb21wZW5zYXRpb25SZWFzb24oKTtcbiAgICB9XG4gICAgdG9nZ2xlQ2hlY2tlZChwYXg6IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KSB7XG4gICAgICAgIGlmIChwYXguSXNTZWxlY3RlZCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgcGF4LklzU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5wdXNoKHBheCk7XG4gICAgICAgICAgICBpZiAodGhpcy5Db21lbnNhdGlvblJlYXNvbiAhPSBDb21wZW5zYXRpb25TZWFyY2hSZXN1bHRDb21wb25lbnQuQ09NUEVOU0FUSU9OUkVBU09OKSB7XG4gICAgICAgICAgICAgICAgcGF4LkNvbXBlbnNhdGlvblJlYXNvbiA9IHRoaXMuQ29tZW5zYXRpb25SZWFzb247XG4gICAgICAgICAgICAgICAgcGF4LkNvbXBlbnNhdGlvblJlYXNvbklkID0gdGhpcy5Db21wZW5zYXRpb25SZWFzb25MaXN0LmZpbHRlcihtID0+IG0uQ29tcFJlYXNvblRleHQgPT0gdGhpcy5Db21lbnNhdGlvblJlYXNvbilbMF0uQ29tcFJlYXNvbklkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuQ29tcGVuc2F0aW9uRnVsbFBheExpc3QubGVuZ3RoID09PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCkgdGhpcy5TZWxlY3RBbGxQYXggPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5zcGxpY2UodGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5pbmRleE9mKHBheCksIDEpO1xuICAgICAgICAgICAgaWYgKHBheC5Db21wZW5zYXRpb25zID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwYXguQ29tcGVuc2F0aW9uUmVhc29uID0gXCJcIjtcbiAgICAgICAgICAgICAgICBwYXguQ29tcGVuc2F0aW9uUmVhc29uSWQgPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QuZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuR2l2ZW5OYW1lID09IHBheC5HaXZlbk5hbWUgJiYgZGF0YS5MYXN0TmFtZSA9PSBwYXguTGFzdE5hbWUgJiYgZGF0YS5PcmRlcklkID09IHBheC5PcmRlcklkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXguQ29tcGVuc2F0aW9uUmVhc29uID0gZGF0YS5Db21wZW5zYXRpb25zWzBdLkNvbXBSZWFzb25UZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF4LkNvbXBlbnNhdGlvblJlYXNvbklkID0gZGF0YS5Db21wZW5zYXRpb25zWzBdLkNvbXBSZWFzb25JZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHBheC5Jc1NlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdEFsbFBheCA9IGZhbHNlO1xuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZWxlY3RlZFBhc3NlbmdlckNvdW50ID0gdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5sZW5ndGg7XG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIubGVuZ3RoKSk7XG4gICAgfVxuICAgIGZpbHRlcihhcmdzOiBhbnkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJOYW1lOlwiICsgSlNPTi5zdHJpbmdpZnkoYXJncykpO1xuICAgICAgICB0aGlzLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QgPSB0aGlzLkNvbXBlbnNhdGlvbkZ1bGxQYXhMaXN0O1xuICAgICAgICBpZiAodGhpcy5TZWFyY2hDcml0ZXJpYSA9PSBcIk5hbWVcIikge1xuICAgICAgICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGFyZ3MudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCA9IHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdC5maWx0ZXIociA9PiByLkdpdmVuTmFtZS5pbmRleE9mKG5hbWUudHJpbSgpKSA+PSAwIHx8IHIuTGFzdE5hbWUuaW5kZXhPZihuYW1lLnRyaW0oKSkgPj0gMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCA9IHRoaXMuQ29tcGVuc2F0aW9uRnVsbFBheExpc3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5TZWFyY2hDcml0ZXJpYSA9PSBcIk9yZGVyIElEXCIpIHtcbiAgICAgICAgICAgIGlmIChhcmdzKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmdzLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QgPSB0aGlzLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QuZmlsdGVyKHIgPT4gci5PcmRlcklkLmluZGV4T2YobmFtZS50cmltKCkpID49IDApO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCA9IHRoaXMuQ29tcGVuc2F0aW9uRnVsbFBheExpc3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNsYXNzIHNlYXJjaFwiKTtcbiAgICAgICAgICAgIGlmIChhcmdzKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmdzLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0LmZpbHRlcihyID0+IHIuQ2FiaW4gIT0gbnVsbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0ID0gdGhpcy5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0LmZpbHRlcihyID0+IHIuQ2FiaW4uaW5kZXhPZihuYW1lLnRyaW0oKSkgPj0gMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QgPSB0aGlzLkNvbXBlbnNhdGlvbkZ1bGxQYXhMaXN0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuVG90YWxQYXNzZW5nZXJDb3VudCA9IHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdC5sZW5ndGg7XG4gICAgICAgIGlmICh0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCA9PT0gdGhpcy5Db21wZW5zYXRpb25GdWxsUGF4TGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0QWxsUGF4ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0QWxsUGF4ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzYXZlRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgJiYgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuQ29tcGVuc2F0aW9uUmVhc29uICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH0gaWYgKHRoaXMuSXNQYXhSZWFzb25TZWxlY3RlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29udGludWVFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5TZWxlY3RlZFBhc3NlbmdlciAmJiB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5Db21wZW5zYXRpb25SZWFzb24gIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuSXNQYXhSZWFzb25TZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSBpZiAodGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBkaXNwbGF5UHJvZHVjdEFjdGlvbkRpYWxvZ0ZvclNtYXJ0RmlsdGVyKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHRpdGxlOiBcIlNtYXJ0IGZpbHRlciBvcHRpb25cIixcbiAgICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXCJOYW1lXCIsIFwiT3JkZXIgSURcIiwgXCJDbGFzc1wiLCBcIkFsbCBQYXNzZW5nZXJzXCIsIFwiRVRLVCBQYXNzZW5nZXJzXCIsIFwiQ2hlY2tlZC1JbiBQYXNzZW5nZXJzXCIsIFwiTm90IENoZWNrZWQtSW4gUGFzc2VuZ2Vyc1wiLCBcIk91dGJvdW5kIFBhc3NlbmdlclwiXSxcbiAgICAgICAgfTtcbiAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzdWx0ICE9IFwiQ2FuY2VsXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLlNlYXJjaENyaXRlcmlhID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLlNlYXJjaENyaXRlcmlhID09IFwiTmFtZVwiIHx8IHRoaXMuU2VhcmNoQ3JpdGVyaWEgPT0gXCJPcmRlciBJRFwiIHx8IHRoaXMuU2VhcmNoQ3JpdGVyaWEgPT0gXCJDbGFzc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NtYXJ0U2VhcmNoRmllbGQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QgPSB0aGlzLkNvbXBlbnNhdGlvbkZ1bGxQYXhMaXN0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NtYXJ0U2VhcmNoRmllbGQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuU2VhcmNoQ3JpdGVyaWEgPT0gXCJBbGwgUGFzc2VuZ2Vyc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QgPSB0aGlzLkNvbXBlbnNhdGlvbkZ1bGxQYXhMaXN0O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuU2VhcmNoQ3JpdGVyaWEgPT0gXCJFVEtUIFBhc3NlbmdlcnNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0ID0gdGhpcy5Db21wZW5zYXRpb25GdWxsUGF4TGlzdC5maWx0ZXIobSA9PiBtLkV0aWNrZXRTdGF0dXMgPT0gXCJUcnVlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuU2VhcmNoQ3JpdGVyaWEgPT0gXCJDaGVja2VkLUluIFBhc3NlbmdlcnNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0ID0gdGhpcy5Db21wZW5zYXRpb25GdWxsUGF4TGlzdC5maWx0ZXIobSA9PiBtLkNoZWNrZWRJbkluZGljYXRvci5pbmRleE9mKCdDaGVja2VkaW4nKSA+IC0xICYmIG0uQ2hlY2tlZEluSW5kaWNhdG9yICE9PSAnQ2hlY2tlZGluU2VhdERlbGV0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLlNlYXJjaENyaXRlcmlhID09IFwiTm90IENoZWNrZWQtSW4gUGFzc2VuZ2Vyc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QgPSB0aGlzLkNvbXBlbnNhdGlvbkZ1bGxQYXhMaXN0LmZpbHRlcihtID0+IG0uQ2hlY2tlZEluSW5kaWNhdG9yICE9IFwiQ2hlY2tlZGluXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0ID0gdGhpcy5Db21wZW5zYXRpb25GdWxsUGF4TGlzdC5maWx0ZXIobSA9PiBtLk91dGJvdW5kSW5kaWNhdG9yID09IFwidHJ1ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuVG90YWxQYXNzZW5nZXJDb3VudCA9IHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdC5sZW5ndGg7XG4gICAgICAgIGlmICh0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCA+PSB0aGlzLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdEFsbFBheCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdEFsbFBheCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRpc3BsYXlEaWFsb2dGb3JGbGl0ZXJQYXNzZW5nZXJUeXBlKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHRpdGxlOiBcIlBhc3NlbmdlciB0eXBlIGZpbHRlclwiLFxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcIkFsbCBQYXNzZW5nZXJzXCIsIFwiRVRLVCBQYXNzZW5nZXJzXCIsIFwiQ2hlY2tlZC1JbiBQYXNzZW5nZXJzXCIsIFwiTm90IENoZWNrZWQtSW4gUGFzc2VuZ2Vyc1wiXSxcbiAgICAgICAgfTtcbiAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzdWx0ICE9IFwiQ2FuY2VsXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLlBhc3NlbmdlckZsaXRlckNyaXRlcmlhID0gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZGlzcGxheVByb2R1Y3RBY3Rpb25EaWFsb2coKSB7XG5cbiAgICAgICAgbGV0IG9wdGlvbnM6IE1vZGFsRGlhbG9nT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMudmNSZWYsXG4gICAgICAgICAgICBjb250ZXh0OiBbeyBjb3VudHJ5OiB0aGlzLkNvbXBlbnNhdGlvblJlYXNvbiB9XSxcbiAgICAgICAgICAgIGZ1bGxzY3JlZW46IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX21vZGFsU2VydmljZVxuICAgICAgICAgICAgLnNob3dNb2RhbChDcmVhdGluZ0xpc3RQaWNrZXJDb21wb25lbnQsIG9wdGlvbnMpXG4gICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGF0ZSByZXN1bHQgXCIgKyByZXN1bHQpO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21lbnNhdGlvblJlYXNvbiA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5Db21wZW5zYXRpb25SZWFzb24gPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLkNvbXBlbnNhdGlvblJlYXNvbklkID0gdGhpcy5Db21wZW5zYXRpb25SZWFzb25MaXN0LmZpbHRlcihtID0+IG0uQ29tcFJlYXNvblRleHQgPT0gdGhpcy5Db21lbnNhdGlvblJlYXNvbilbMF0uQ29tcFJlYXNvbklkO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLlNlYXJjaEZpZWxkcy5Mb2NhdGlvbiA9IHJlc3VsdC5zdWJzdHIoMCwgMyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3V0XCIgKyByZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXRDb21wZW5zYXRpb25SZWFzb24oKTogdm9pZCB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlYXNvbiAxXCIpO1xuICAgICAgICAgICAgbGV0IFJlYXNvblJlcXVlc3QgPSB0aGlzLl9zaGFyZWQuZ2V0QWdlbnRQcml2aWxhZ2UoKTtcbiAgICAgICAgICAgIHRoaXMuQWdlbnRQcml2aWxhZ2UuUHJpdmlsZWdlcyA9IFJlYXNvblJlcXVlc3Q7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlByaTpcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuQWdlbnRQcml2aWxhZ2UpKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBDb21wZW5zYXRpb25SZXF1ZXN0T2JqOiBhbnk7XG4gICAgICAgICAgICBDb21wZW5zYXRpb25SZXF1ZXN0T2JqID0geyBcIlByaXZpbGVnZXNcIjogdGhpcy5BZ2VudFByaXZpbGFnZS5Qcml2aWxlZ2VzLCBcIkFpcmxpbmVDb2RlXCI6IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiY2FycmllckNvZGVcIiwgXCJcIikgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRDb21wZW5zYXRpb25SZWFzb24gU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcbiAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UuZ2V0Q29tcGVuc2F0aW9uUmVhc29ucyhDb21wZW5zYXRpb25SZXF1ZXN0T2JqKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLkNvbXBlbnNhdGlvblJlYXNvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgQ29tcGFuc2F0aW9uRGV0YWlsczogYW55ID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbXBhbnNhdGlvbkRldGFpbHMuQ29tcGVuc2F0aW9uUmVhc29uLmZvckVhY2goKEtleVZhbHVlLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb21wcmVhc29uID0gbmV3IENvbXBlbnNhdGlvblJlYXNvbk1vZHVsZS5Db21wZW5zYXRpb25SZWFzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wcmVhc29uLkNvbXBSZWFzb25UZXh0ID0gS2V5VmFsdWUuQ29tcFJlYXNvblRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcHJlYXNvbi5Db21wUmVhc29uSWQgPSBLZXlWYWx1ZS5Db21wUmVhc29uSWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25SZWFzb25MaXN0LnB1c2goY29tcHJlYXNvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25SZWFzb24ucHVzaChLZXlWYWx1ZS5Db21wUmVhc29uVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25SZWFzb24uc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSA8IGIpIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEgPiBiKSByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJlYXNvbiA6XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLkNvbXBlbnNhdGlvblJlYXNvbkxpc3QpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoQ29tcGVuc2F0aW9uU2VhcmNoUmVzdWx0Q29tcG9uZW50LkNPTVBFTlNBVElPTlJFQVNPTlRPQVNUICsgZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB2YXIgZW5kRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ2hlY2tJblBheCBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVuZERhdGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0NoZWNrSW5QYXggU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlbmREYXRlKSkpO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgc2VsZWN0aW5nQWxsUGF4KCkge1xuICAgICAgICBpZiAodGhpcy5TZWxlY3RBbGxQYXggPT0gZmFsc2UgJiYgdGhpcy5TZWxlY3RBbGxQYXhWYXIgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0QWxsUGF4VmFyID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdC5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZGF0YS5Jc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLkNvbWVuc2F0aW9uUmVhc29uICE9IENvbXBlbnNhdGlvblNlYXJjaFJlc3VsdENvbXBvbmVudC5DT01QRU5TQVRJT05SRUFTT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuQ29tcGVuc2F0aW9uUmVhc29uID0gdGhpcy5Db21lbnNhdGlvblJlYXNvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuQ29tcGVuc2F0aW9uUmVhc29uSWQgPSB0aGlzLkNvbXBlbnNhdGlvblJlYXNvbkxpc3QuZmlsdGVyKG0gPT4gbS5Db21wUmVhc29uVGV4dCA9PSB0aGlzLkNvbWVuc2F0aW9uUmVhc29uKVswXS5Db21wUmVhc29uSWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZGF0YS5Jc1NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdEFsbFBheFZhciA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3NlbmdlciA9IFtdO1xuICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25GdWxsUGF4TGlzdC5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGEuSXNTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdEFsbFBheCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0LmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgZGF0YS5Jc1NlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuQ29tcGVuc2F0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuQ29tcGVuc2F0aW9uUmVhc29uID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5Db21wZW5zYXRpb25SZWFzb25JZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbGVjdGVkUGFzc2VuZ2VyQ291bnQgPSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aDtcbiAgICAgICAgaWYgKHRoaXMuQ29tcGVuc2F0aW9uRnVsbFBheExpc3QubGVuZ3RoID09PSB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmxlbmd0aCkgdGhpcy5TZWxlY3RBbGxQYXggPSB0cnVlO1xuICAgIH1cbiAgICBzYXZlKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NhdmVDb21wZW5zYXRpb24gU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcbiAgICAgICAgICAgIGxldCBTYXZlQ29tcHRlbXBsYXRlOiBhbnkgPSBDb252ZXJ0ZXJzLmNvbnZlcnRUb1NhdmVDb21wZW5zYXRpb25UZW1wbGF0ZSh0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLCB0aGlzLkNvbXBlbnNhdGlvbk1vZGVsLkZsaWdodE1vZGVsKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGF0YTE6XCIgKyBKU09OLnN0cmluZ2lmeShTYXZlQ29tcHRlbXBsYXRlKSk7XG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLnNhdmVDb21wZW5zYXRpb25SZWFzb25zKFNhdmVDb21wdGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuUmVzdWx0cyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgQ29tcGFuc2F0aW9uRGV0YWlsczogYW55ID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiU2F2ZWQgU3VjY2Vzc2Z1bGx5XCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGF0YTpcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLklzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmxpZ2h0RGF0ZSA9IHRoaXMuQ29tcGVuc2F0aW9uTW9kZWwuRmxpZ2h0TW9kZWwuRGVwYXJ0dXJlRGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmbGlnaHROdW1iZXIgPSB0aGlzLkNvbXBlbnNhdGlvbk1vZGVsLkZsaWdodE1vZGVsLkZsaWdodE51bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IHRoaXMuQ29tcGVuc2F0aW9uTW9kZWwuRmxpZ2h0TW9kZWwuRGVwYXJ0dXJlQWlycG9ydDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGFzc2VuZ2VyVHlwZUxpc3QgPSB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyVHlwZVNlcnZpY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLlBhc3NlbmdlclR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgUGF4VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXhUeXBlID0gdGhpcy5QYXNzZW5nZXJUeXBlTGlzdC5QYXNzZW5nZXJUeXBlTGlzdFRhYmxlLmZpbHRlcihtID0+IG0uVmFsdWUuRGVzY3JpcHRpb24gPT0gdGhpcy5QYXNzZW5nZXJUeXBlKVswXS5LZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRQYXNzZW5nZXJMaXN0KGZsaWdodERhdGUsIGZsaWdodE51bWJlciwgbG9jYXRpb24sIFBheFR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbk1vZGVsID0gQ29udmVydGVycy5jb252ZXJ0b0NvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QoZGF0YSwgdGhpcy5GbGlnaHREZXRhaWxzLCBsb2NhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0ID0gdGhpcy5Db21wZW5zYXRpb25Nb2RlbC5QYXNzZW5nZXJMaXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuQ29tcGVuc2F0aW9uTW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChlcnIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG5cbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHZhciBlbmREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTYXZlQ29tcGVuc2F0aW9uIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZW5kRGF0ZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2F2ZUNvbXBlbnNhdGlvbiBTZXJ2aWNlIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZW5kRGF0ZSkpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRQYXNzZW5nZXJMaXN0KGZsaWdodERhdGUsIGZsaWdodE51bWJlciwgbG9jYXRpb24sIFBheFR5cGUpIHtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBDb21wZW5zYXRpb25EZXRhaWxzIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLmdldFBhc3NlbmdlclR5cGVMaXN0KGZsaWdodERhdGUsIGZsaWdodE51bWJlciwgbG9jYXRpb24sIFBheFR5cGUpLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5CYWRSZXF1ZXN0ICE9IDQwMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5GbGlnaHRTZWdtZW50cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IENvbXBhbnNhdGlvbkRldGFpbHM6IGFueSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbk1vZGVsID0gQ29udmVydGVycy5jb252ZXJ0b0NvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QoQ29tcGFuc2F0aW9uRGV0YWlscywgdGhpcy5GbGlnaHREZXRhaWxzLCBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcIlNlYXJjaExvY2F0aW9uXCIsIFwiXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCA9IHRoaXMuQ29tcGVuc2F0aW9uTW9kZWwuUGFzc2VuZ2VyTGlzdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgQ29tcGVuc2F0aW9uRGV0YWlscyBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgQ29tcGVuc2F0aW9uRGV0YWlscyBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnMubWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChkYXRhLmVyck1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBDb21wZW5zYXRpb25EZXRhaWxzIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBDb21wZW5zYXRpb25EZXRhaWxzIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc29ydEJhc2VkT25QYXhOYW1lKCkge1xuICAgICAgICB2YXIgaXNBc2M6IG51bWJlciA9IHRoaXMubmFtZVNvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xuICAgICAgICB0aGlzLm5hbWVTb3J0SW5kaWNhdG9yID0gdGhpcy5uYW1lU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMuc3NyU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLnRpZXJTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMuY2xhc3NTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMub3JkZXJJZFNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciB2YWwxID0gYS5GdWxsTmFtZTtcbiAgICAgICAgICAgIHZhciB2YWwyID0gYi5GdWxsTmFtZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbDEgKyBcIiBcIiArIHZhbDIpO1xuICAgICAgICAgICAgaWYgKGlzQXNjID09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsMSA8IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPiB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNvcnRCYXNlZE9uU1NSKCkge1xuICAgICAgICB2YXIgaXNBc2M6IG51bWJlciA9IHRoaXMuc3NyU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMuc3NyU29ydEluZGljYXRvciA9IHRoaXMuc3NyU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMubmFtZVNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy50aWVyU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLmNsYXNzU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLm9yZGVySWRTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICB2YXIgdmFsMSA9IGEuU1NSO1xuICAgICAgICAgICAgdmFyIHZhbDIgPSBiLlNTUjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbDEgKyBcIiBcIiArIHZhbDIpO1xuICAgICAgICAgICAgaWYgKGlzQXNjID09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsMSA8IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPiB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNvcnRCYXNlZE9uVGllcigpIHtcbiAgICAgICAgdmFyIGlzQXNjOiBudW1iZXIgPSB0aGlzLnRpZXJTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcbiAgICAgICAgdGhpcy50aWVyU29ydEluZGljYXRvciA9IHRoaXMudGllclNvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xuICAgICAgICB0aGlzLnNzclNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5uYW1lU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLmNsYXNzU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLm9yZGVySWRTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICB2YXIgdmFsMSA9IGEuVGllcjtcbiAgICAgICAgICAgIHZhciB2YWwyID0gYi5UaWVyO1xuICAgICAgICAgICAgY29uc29sZS5sb2codmFsMSArIFwiIFwiICsgdmFsMik7XG4gICAgICAgICAgICBpZiAoaXNBc2MgPT0gMCkge1xuICAgICAgICAgICAgICAgIGlmICh2YWwxIDwgdmFsMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsMSA+IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc29ydEJhc2VkT25DbGFzcygpIHtcbiAgICAgICAgdmFyIGlzQXNjOiBudW1iZXIgPSB0aGlzLmNsYXNzU29ydEluZGljYXRvciA9PSAwID8gMSA6IDA7XG4gICAgICAgIHRoaXMuY2xhc3NTb3J0SW5kaWNhdG9yID0gdGhpcy5jbGFzc1NvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xuICAgICAgICB0aGlzLnNzclNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy50aWVyU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLm5hbWVTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMub3JkZXJJZFNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciB2YWwxID0gYS5DYWJpbjtcbiAgICAgICAgICAgIHZhciB2YWwyID0gYi5DYWJpbjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbDEgKyBcIiBcIiArIHZhbDIpO1xuICAgICAgICAgICAgaWYgKGlzQXNjID09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsMSA8IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbDEgPiB2YWwyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNvcnRCYXNlZE9uT3JkZXJJZCgpIHtcbiAgICAgICAgdmFyIGlzQXNjOiBudW1iZXIgPSB0aGlzLm9yZGVySWRTb3J0SW5kaWNhdG9yID09IDAgPyAxIDogMDtcbiAgICAgICAgdGhpcy5vcmRlcklkU29ydEluZGljYXRvciA9IHRoaXMub3JkZXJJZFNvcnRJbmRpY2F0b3IgPT0gMCA/IDEgOiAwO1xuICAgICAgICB0aGlzLnNzclNvcnRJbmRpY2F0b3IgPSAtMTtcbiAgICAgICAgdGhpcy50aWVyU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLmNsYXNzU29ydEluZGljYXRvciA9IC0xO1xuICAgICAgICB0aGlzLm5hbWVTb3J0SW5kaWNhdG9yID0gLTE7XG4gICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICB2YXIgdmFsMSA9IGEuT3JkZXJJZDtcbiAgICAgICAgICAgIHZhciB2YWwyID0gYi5PcmRlcklkO1xuICAgICAgICAgICAgY29uc29sZS5sb2codmFsMSArIFwiIFwiICsgdmFsMik7XG4gICAgICAgICAgICBpZiAoaXNBc2MgPT0gMCkge1xuICAgICAgICAgICAgICAgIGlmICh2YWwxIDwgdmFsMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsMSA+IHZhbDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY29udGludWUoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSXNzdWVDb21wZW5zYXRpb24gU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcbiAgICAgICAgICAgIC8vIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgPSB0aGlzLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QuZmlsdGVyKG9iaiA9PiBvYmouSXNTZWxlY3RlZCA9PSB0cnVlKTtcbiAgICAgICAgICAgIC8vIGlmICh0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZpbHRlcihtID0+IG0uQ29tcGVuc2F0aW9uUmVhc29uICE9IENvbXBlbnNhdGlvblNlYXJjaFJlc3VsdENvbXBvbmVudC5DT01QRU5TQVRJT05SRUFTT04pKSB7XG4gICAgICAgICAgICBsZXQgcHJpdmlsYWdlID0gdGhpcy5fc2hhcmVkLmdldEFnZW50UHJpdmlsYWdlKCk7XG4gICAgICAgICAgICBsZXQgSXNzdWVDb21wdGVtcGxhdGU6IGFueSA9IENvbnZlcnRlcnMuY29udmVydFRvQlJFUmVxdWVzdCh0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLCBwcml2aWxhZ2UsIHRoaXMuQ29tcGVuc2F0aW9uTW9kZWwuRmxpZ2h0TW9kZWwpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJc3N1ZUNvbXB0ZW1wbGF0ZTpcIiArIEpTT04uc3RyaW5naWZ5KElzc3VlQ29tcHRlbXBsYXRlKSk7XG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLnBvc3RCcmVSZXF1ZXN0KElzc3VlQ29tcHRlbXBsYXRlKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGF0YTpcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuQmFkUmVxdWVzdCAhPSA0MDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlJlc3VsdHMgIT0gW10gJiYgZGF0YS5TdWNjZXNzID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5SZXN1bHRzWzBdLkZsaWdodFNlZ21lbnRzWzBdLlBhc3NlbmdlcnNbMF0uQlJFX0NvbXBlbnNhdGlvbnMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgSXNzdWVDb21wUmVzcG9uc2UgPSBDb252ZXJ0ZXJzLmNvbnZlcnRUb0JSRVJlc3BvbnNlKGRhdGEsIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0Q29tcGVuc2F0aW9uUGF4TGlzdChJc3N1ZUNvbXBSZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQlJFQ29tcFJlc3BvbnNlOlwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJSRUNvbXBSZXNwb25zZTpcIiArIEpTT04uc3RyaW5naWZ5KElzc3VlQ29tcFJlc3BvbnNlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGV0b2lzc3VlY29tcGVuc2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIlVuYWJsZSB0byBwcm9jZXNzIC0gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlclwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChkYXRhLldhcm5pbmdzWzBdLk1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5FcnJvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGRhdGEuZXJyTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gfSBcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB2YXIgZW5kRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSXNzdWVDb21wZW5zYXRpb24gU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlbmREYXRlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJc3N1ZUNvbXBlbnNhdGlvbiBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVuZERhdGUpKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbmF2aWdhdGV0b2lzc3VlY29tcGVuc2F0aW9uKCk6IHZvaWQge1xuICAgICAgICB2YXIgcHJlUGFnZTogc3RyaW5nID0gXCJub3JtYWxcIjtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImlzc3VlY29tcGVuc2F0aW9uXCJdLCB7XG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgfSwgcXVlcnlQYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBcInByZXBhZ2VcIjogSlNPTi5zdHJpbmdpZnkocHJlUGFnZSksXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIG5hdmlnYXRldG9hZGRpdGlvbmFsZGV0YWlscyhQYXhpdGVtOiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCk6IHZvaWQge1xuICAgICAgICBpZiAoUGF4aXRlbS5Jc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmRpcih0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyKTtcbiAgICAgICAgICAgIHZhciBwcmVQYWdlOiBzdHJpbmcgPSBcIlNlYXJjaFJlc3VsdFwiO1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImNvbXBlbnNhdGlvbmFkZGl0aW9uYWxkZXRhaWxzXCJdLCB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICAgICAgfSwgcXVlcnlQYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJkYXRhXCI6IEpTT04uc3RyaW5naWZ5KFBheGl0ZW0pLFxuICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGVkUEF4XCI6IEpTT04uc3RyaW5naWZ5KHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIpLFxuICAgICAgICAgICAgICAgICAgICBcInByZXBhZ2VcIjogcHJlUGFnZSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIC8vIH1cbiAgICB9XG4gICAgbmF2aWdhdGVUb0NvbXBlbnNhdGlvbigpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImNvbXBlbnNhdGlvblwiXSwge1xuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgbmF2aWdhdGVUb1NldHRpbmcoKSB7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZXR0aW5nXCJdLCB7XG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbmF2aWdhdGVUb1NlYXJjaCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNDaGVja2luRGlzYWJsZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcInNlYXJjaFwiXSwge1xuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIG5hdmlnYXRlVG9EZXBhcnR1cmVzKCkge1xuICAgICAgICBpZiAodGhpcy5pc0dhdGVEaXNhYmxlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiZGVwYXJ0aG9tZVwiXSwge1xuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRpc3BsYXlTU1JzKGl0ZW06IENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0KSB7XG4gICAgICAgIGlmIChpdGVtLlNTUnNDb3VudCA+IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUlwiICsgSlNPTi5zdHJpbmdpZnkoaXRlbS5TU1JzKSk7XG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJTU1JzXCIsXG4gICAgICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcbiAgICAgICAgICAgICAgICBhY3Rpb25zOiBpdGVtLlNTUnMsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcjogYW55KSB7XG4gICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci50b1N0cmluZygpO1xuICAgICAgICBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJTZXNzaW9uVGltZW91dFwiKSA+IC0xKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJTZXNzaW9uIFRpbWUgT3V0XCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGJlZW4gdGltZSBvdXRcIixcbiAgICAgICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIlwiXSwge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChlcnJvck1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==