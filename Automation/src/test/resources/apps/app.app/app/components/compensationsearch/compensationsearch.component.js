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
var index_1 = require("../../shared/services/index");
var index_2 = require("../../shared/interface/index");
var index_3 = require("../../shared/services/index");
var index_4 = require("../../shared/model/index");
var index_5 = require("../../shared/utils/index");
var date_picker_modal_1 = require("../../components/date-picker/date-picker-modal");
var app_constants_1 = require("../../app.constants");
var app_executiontime_1 = require("../../app.executiontime");
var timeOut_service_1 = require("../../shared/services/timeOut.service");
var CompensationSearchComponent = /** @class */ (function () {
    function CompensationSearchComponent(_configuration, _services, _dataService, _shared, page, routerExtensions, _timeoutService, router, _service, route, vcRef, _modalService) {
        this._configuration = _configuration;
        this._services = _services;
        this._dataService = _dataService;
        this._shared = _shared;
        this.page = page;
        this.routerExtensions = routerExtensions;
        this._timeoutService = _timeoutService;
        this.router = router;
        this._service = _service;
        this.route = route;
        this.vcRef = vcRef;
        this._modalService = _modalService;
        this.SearchFields = new index_4.Search();
        this.FlightNumber = "";
        this.PassengerType = "";
        this.isTextField = true;
        this.isLabelField = false;
        this.PassengerTypeList = new index_4.PassengerTypeModel.RootObject();
        this.PaxTypeList = [];
        this.isAnySearchEmpty = false;
        this.isFlightEmpty = false;
        this.isLastNameEmpty = false;
        this.isButtonEnabled = false;
        this.cityList = [];
        this.filterCityList = [];
        this.filterCityCode = [];
        this.isCityEmpty = false;
        this.isCityDirty = false;
        this.isValid = false;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.isError = false;
        this.errorMessage = "";
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.SearchFields.Location = this.userdetails.substr(0, 3);
        ApplicationSettings.setString("SearchLocation", this.SearchFields.Location);
        this.SearchFields.FlightDate = moment().format("DD MMMM YYYY");
        this.curDate = moment().toDate();
        this.startDate = new Date();
        this.loaderProgress = new index_2.LoaderProgress();
    }
    CompensationSearchComponent_1 = CompensationSearchComponent;
    CompensationSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        console.log("IN");
        this.loaderProgress.initLoader(this.pageCont);
        this.getPassengerType();
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.cityList = this._shared.getCityList();
        this.cityList.forEach(function (data, index) {
            _this.filterCityCode.push(data.Code + "-" + data.Name);
        });
        console.log("in search screen");
        console.log(this.filterCityCode);
        this.isButtonEnabled = false;
    };
    CompensationSearchComponent.prototype.displayCityListActionDialog = function () {
        var _this = this;
        var options = {
            viewContainerRef: this.vcRef,
            context: [{ country: this.filterCityCode }],
            fullscreen: false
        };
        this._modalService
            .showModal(country_modal_1.CreatingListPickerComponent, options)
            .then(function (result) {
            console.log("date result " + result);
            if (result) {
                _this.SearchFields.Location = result.substr(0, 3);
                ApplicationSettings.setString("SearchLocation", _this.SearchFields.Location);
                console.log("out" + result);
            }
        });
    };
    CompensationSearchComponent.prototype.getPassengerType = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetPassengerType Service --------------- Start Date Time : ' + sDate);
            this.PassengerTypeList = null;
            this._service.getPassengerType()
                .subscribe(function (data) {
                var CompansationDetails = data;
                console.dir(CompansationDetails);
                _this.PassengerTypeList = CompansationDetails;
                _this._shared.SetPassengerTypeService(_this.PassengerTypeList);
                _this.PassengerTypeList.PassengerTypeListTable.forEach(function (element, index) {
                    _this.PaxTypeList.push(element.Value.Description);
                });
                _this.loaderProgress.hideLoader();
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
            console.log('Get GetPassengerType Service --------------- End Date Time : ' + eDate);
            console.log('Get GetPassengerType Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    CompensationSearchComponent.prototype.createModelView = function (args) {
        var _this = this;
        var that = this;
        var currentDate = this.curDate;
        console.log(this.startDate);
        var options = {
            viewContainerRef: this.vcRef,
            context: {
                currentDate: currentDate.toDateString(),
                displayHeader: true,
                minDate: moment(new Date()).subtract(1, 'years').toDate().toDateString(),
                maxDate: moment(new Date()).add(1, 'years').toDate().toDateString()
            },
            fullscreen: false
        };
        this._modalService.showModal(date_picker_modal_1.DatePickerModal, options)
            .then(function (dateresult) {
            if (dateresult) {
                console.log("date result " + dateresult);
                if (dateresult.toDateString() != 'undefined') {
                    _this.curDate = dateresult;
                }
            }
        });
    };
    CompensationSearchComponent.prototype.displayPassengerTypeDialog = function () {
        var _this = this;
        var options = {
            title: "Passenger Type",
            cancelButtonText: "Cancel",
            actions: this.PaxTypeList,
        };
        dialogs.action(options).then(function (result) {
            if (result != "Cancel") {
                _this.PassengerType = result;
                _this.isLabelField = true;
                _this.isTextField = false;
            }
        });
    };
    CompensationSearchComponent.prototype.clear = function () {
        this.SearchFields.SearchAny = "";
        this.FlightNumber = "";
        this.PassengerType = "";
        this.isButtonEnabled = false;
        this.isLabelField = false;
        this.isTextField = true;
        this.isLastdirty = false;
        this.isFlightdirty = false;
        this.isSearchanydirty = false;
    };
    CompensationSearchComponent.prototype.flightEmpty = function () {
        if (this.isFlightEmpty && this.isFlightdirty) {
            return true;
        }
        else
            return false;
    };
    CompensationSearchComponent.prototype.searchempty = function () {
        if (this.isAnySearchEmpty && this.isSearchanydirty) {
            return true;
        }
        else
            return false;
    };
    CompensationSearchComponent.prototype.onChange = function (args, index) {
        this._timeoutService.resetWatch();
        switch (index) {
            case 0:
                this.isFlightEmpty = false;
                this.isLastNameEmpty = false;
                if (this.SearchFields.SearchAny != "") {
                    this.isAnySearchEmpty = false;
                    this.isSearchanydirty = true;
                }
                if (this.SearchFields.SearchAny.length >= 6 && this.SearchFields.SearchAny.length <= 18) {
                    this.isValid = true;
                }
                else
                    this.isValid = false;
                var reg = new RegExp('^[a-zA-Z0-9-/]*$');
                var test = reg.test(this.SearchFields.SearchAny);
                if (test == false) {
                    this.isAnySearchEmpty = true;
                    this.isValid = false;
                }
                else
                    this.isAnySearchEmpty = false;
                break;
            case 1:
                this.isAnySearchEmpty = false;
                if (this.FlightNumber == "") {
                    this.isFlightEmpty = true;
                    this.isButtonEnabled = false;
                }
                else {
                    this.isFlightEmpty = false;
                    this.isFlightdirty = true;
                    if (this.FlightNumber.length <= 2) {
                        var reg = new RegExp('^[a-zA-Z0-9]*$');
                        var test = reg.test(this.FlightNumber);
                        if (test == false) {
                            Toast.makeText(CompensationSearchComponent_1.INVALIDFLIGHTENTERED).show();
                            this.isFlightEmpty = true;
                        }
                    }
                    else {
                        var reg = /(^([A-Za-z]{0,2})\d{2,4})$/;
                        var test = reg.test(this.FlightNumber);
                        console.log("flightnum" + test);
                        if (test == false) {
                            Toast.makeText(CompensationSearchComponent_1.INVALIDFLIGHTENTERED).show();
                            this.isFlightEmpty = true;
                        }
                    }
                }
                // else {
                //     if (this.FlightNumber.length >= 3) {
                //         var reg = new RegExp(/^[a-zA-Z]+$/);
                //         var test = reg.test(this.FlightNumber);
                //         if (test == true) {
                //             this.isFlightEmpty = true;
                //             Toast.makeText(CompensationSearchComponent.INVALIDFLIGHTENTERED).show();
                //         } else {
                //             this.isFlightEmpty = false;
                //         }
                //     } else {
                //         this.isFlightEmpty = false;
                //     }
                // }
                break;
            default:
        }
        if (this.isFlightEmpty == false && this.PassengerType != "") {
            this.isButtonEnabled = true;
        }
        else {
            this.isButtonEnabled = false;
        }
    };
    CompensationSearchComponent.prototype.searchButtonEnabled = function () {
        if (this.PassengerType != "" && this.isFlightEmpty == false && this.FlightNumber != "") {
            this.isButtonEnabled = true;
        }
        if (this.isButtonEnabled) {
            return true;
        }
        else
            return false;
    };
    CompensationSearchComponent.prototype.searchPaxByFlight = function () {
        var _this = this;
        this.FlightDate = moment(this.curDate).format("YYYY-MM-DD");
        var PaxType;
        var AgentLocation = this.SearchFields.Location;
        // if (this.FlightNumber.substring(0, 2).toUpperCase() != 'CM') this.FlightNumber = "CM" + this.FlightNumber;
        var reg = new RegExp('^[0-9]*$');
        var test = reg.test(this.FlightNumber);
        if (test == true) {
            console.log("R1");
            this.FlightNumber = ApplicationSettings.getString("carrierCode", "") + this.FlightNumber;
        }
        if (this.FlightNumber.substr(0, 2).toUpperCase() != "CM") {
            Toast.makeText("Invalid Carrier Code").show();
            this.isFlightEmpty = true;
            this.FlightNumber = "";
        }
        else {
            if (this.PassengerType == CompensationSearchComponent_1.COMPENSATIONPRINTLISTPAX) {
                PaxType = this.PassengerTypeList.PassengerTypeListTable.filter(function (m) { return m.Value.Description == _this.PassengerType; })[0].Key;
                this.getCompensationList(this.FlightDate, this.FlightNumber, AgentLocation, PaxType);
            }
            else if (this.PassengerType == CompensationSearchComponent_1.COMPENSATIONLISTPAX) {
                PaxType = this.PassengerTypeList.PassengerTypeListTable.filter(function (m) { return m.Value.Description == _this.PassengerType; })[0].Key;
                this.getCompensationList(this.FlightDate, this.FlightNumber, AgentLocation, "reasonwiseget");
            }
            else {
                PaxType = this.PassengerTypeList.PassengerTypeListTable.filter(function (m) { return m.Value.Description == _this.PassengerType; })[0].Key;
                this.getPassengerList(this.FlightDate, this.FlightNumber, AgentLocation, PaxType);
            }
        }
    };
    CompensationSearchComponent.prototype.searchPax = function () {
        var reg = new RegExp(/^[0-9]+$/);
        var test = reg.test(this.SearchFields.SearchAny);
        if (test == true) {
            this.isDigit = true;
        }
        if (this.SearchFields.SearchAny.length == 6) {
            // Toast.makeText("Order Id Search").show();
            this.getPassengerOrderDetails(this.SearchFields.SearchAny);
        }
        else if (this.SearchFields.SearchAny.length == 13 && this.isDigit) {
            // Toast.makeText("Eticket Search").show();
            this.getPassengerETKTDetails(this.SearchFields.SearchAny);
        }
        else if (this.SearchFields.SearchAny.length >= 7 && this.SearchFields.SearchAny.length <= 18) {
            // Toast.makeText("FQTV Search").show();
            var fqtvnum1 = this.SearchFields.SearchAny.toString().substr(0, 2);
            var fqtvnum2 = this.SearchFields.SearchAny.toString().substr(2);
            var fqtvnum3 = fqtvnum1 + "%2F" + fqtvnum2;
            console.log("FQTV" + fqtvnum3);
            this.getPassengerFQTVDetails(fqtvnum3);
        }
        else {
        }
    };
    CompensationSearchComponent.prototype.getPassengerList = function (flightDate, flightNumber, location, PaxType) {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get CompensationDetails Service --------------- Start Date Time : ' + sDate);
            this._service.getPassengerTypeList(flightDate, flightNumber, location, PaxType).subscribe(function (data) {
                if (data.BadRequest != 400) {
                    if (data.FlightSegments) {
                        var CompansationDetails = data;
                        _this._shared.setCompensationList(CompansationDetails);
                        _this.flightStatus();
                    }
                    else {
                        Toast.makeText(data.Errors.message).show();
                        _this.loaderProgress.hideLoader();
                        _this.clear();
                    }
                }
                else {
                    Toast.makeText(data.errMessage).show();
                    _this.clear();
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
    CompensationSearchComponent.prototype.getCompensationList = function (date, flight, location, paxtype) {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetPassengerType Service --------------- Start Date Time : ' + sDate);
            this._service.getCompensationPaxList(date, flight, location, paxtype).subscribe(function (data) {
                if (data.Results) {
                    if (data.Results[0].FlightSegments[0].Passengers == null) {
                        Toast.makeText(CompensationSearchComponent_1.DATANOTFOUNDTOAST).show();
                        _this.loaderProgress.hideLoader();
                        _this.clear();
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
                    _this.clear();
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
    CompensationSearchComponent.prototype.flightStatusForCompensationList = function (CompPax) {
        var _this = this;
        try {
            var sDate = new Date();
            console.log('Get CompensationDetails Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            var date = this.FlightDate;
            var flightnumber = this.FlightNumber;
            var location = this.SearchFields.Location;
            this._shared.setFlightHeaderInfo(null);
            this._shared.setCompensationList(null);
            this._service.status(date, flightnumber, location).subscribe(function (data) {
                if (data.BadRequest != 400) {
                    if (data.Flights != null) {
                        var status_1 = data;
                        console.log("IN1" + JSON.stringify(status_1));
                        _this._shared.setCompensationFlightDetails(status_1);
                        var flightStatus = index_5.Converters.convertToFlightHeaderInfo(status_1, ApplicationSettings.getString("SearchLocation", ""));
                        _this._shared.setFlightHeaderInfo(flightStatus);
                        console.log("before flight convertor");
                        console.log(ApplicationSettings.getString("SearchLocation", ""));
                        var CompaxList = index_5.Converters.convertoCompensationPassengerList(CompPax, status_1, ApplicationSettings.getString("SearchLocation", ""));
                        console.log("IN 1");
                        console.dir(CompaxList);
                        _this._shared.setCompensationList(CompaxList);
                        if (_this.PassengerType == CompensationSearchComponent_1.COMPENSATIONPRINTLISTPAX) {
                            _this.naviagatetoCompensationPrintListwithtab();
                        }
                        else {
                            _this.naviagatetoCompensationListwithtab();
                        }
                        _this.loaderProgress.hideLoader();
                    }
                    else {
                        // let status: any = data;
                        // console.log("IN1" + JSON.stringify(data));
                        _this._shared.setCompensationFlightDetails(data);
                        console.log("before flight convertor");
                        console.log(ApplicationSettings.getString("SearchLocation", ""));
                        var CompaxList = index_5.Converters.convertoCompensationPassengerList(CompPax, data, ApplicationSettings.getString("SearchLocation", ""));
                        _this._shared.setCompensationList(CompaxList);
                        console.log("IN 2");
                        console.dir(CompaxList);
                        if (_this.PassengerType == CompensationSearchComponent_1.COMPENSATIONPRINTLISTPAX) {
                            _this.naviagatetoCompensationPrintListwithtab();
                        }
                        else {
                            _this.naviagatetoCompensationListwithtab();
                        }
                        _this.loaderProgress.hideLoader();
                    }
                }
                else {
                    Toast.makeText(data.errMessage).show();
                    _this.clear();
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
    CompensationSearchComponent.prototype.flightStatus = function () {
        var _this = this;
        try {
            var sDate = new Date();
            console.log('Get CompensationDetails Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            var date = this.FlightDate;
            var flightnumber = this.FlightNumber;
            var location = this.SearchFields.Location;
            this._service.status(date, flightnumber, location).subscribe(function (data) {
                if (data.Flights != null) {
                    var status_2 = data;
                    _this._shared.setCompensationFlightDetails(status_2);
                    _this.navigatetoCompensationSearchResult();
                    _this.loaderProgress.hideLoader();
                }
                else {
                    _this._shared.setCompensationFlightDetails(data);
                    _this.navigatetoCompensationSearchResult();
                    _this.loaderProgress.hideLoader();
                    // this.clear();
                    Toast.makeText(CompensationSearchComponent_1.FLIGHTNOTFOUNDTOAST).show();
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
    CompensationSearchComponent.prototype.getPassengerOrderDetails = function (orderID) {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetPassengerOrderDetails Service --------------- Start Date Time : ' + sDate);
            this._service.getPassengerByOrder(orderID)
                .subscribe(function (data) {
                if (data.BadRequest == 400) {
                    console.log("1 bad");
                    Toast.makeText(data.ErrorMessage).show();
                }
                else {
                    if (data.FlightSegments) {
                        var CompansationDetails = data;
                        console.dir(CompansationDetails);
                        // let CompensationPassengers: any = Converters.ConvertToCompPaxTemplateByOrderId(CompansationDetails);
                        // console.dir(CompensationPassengers);
                        _this._shared.setCompensationOrderDeatils(CompansationDetails);
                        _this.loaderProgress.hideLoader();
                        _this.navigatetoCompensationSelectSegment();
                        var eDate = new Date();
                        console.log('Get GetPassengerOrderDetails Service --------------- End Date Time : ' + eDate);
                        console.log('Get GetPassengerOrderDetails Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
                    }
                    else {
                        Toast.makeText(CompensationSearchComponent_1.RESERVATIONNOTFOUNDTOAST).show();
                        _this.clear();
                        _this.loaderProgress.hideLoader();
                    }
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
    CompensationSearchComponent.prototype.getPassengerETKTDetails = function (eticketNumber) {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetPassengerETKTDetails Service --------------- Start Date Time : ' + sDate);
            this._service.getETKT(eticketNumber)
                .subscribe(function (data) {
                if (data.FlightSegments) {
                    var CompansationDetails = data;
                    console.dir(CompansationDetails);
                    _this._shared.setCompensationOrderDeatils(CompansationDetails);
                    _this.loaderProgress.hideLoader();
                    _this.navigatetoCompensationSelectSegment();
                    var eDate = new Date();
                    console.log('Get GetPassengerOrderDetails Service --------------- End Date Time : ' + eDate);
                    console.log('Get GetPassengerOrderDetails Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
                }
                else {
                    Toast.makeText(CompensationSearchComponent_1.RESERVATIONNOTFOUNDTOAST).show();
                    _this.loaderProgress.hideLoader();
                    _this.clear();
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
    CompensationSearchComponent.prototype.getPassengerFQTVDetails = function (fqtvNumber) {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetPassengerFQTVDetails Service --------------- Start Date Time : ' + sDate);
            this._service.getFQTV(fqtvNumber)
                .subscribe(function (data) {
                console.log("FQTV" + JSON.stringify(data));
                if (data.BadRequest == 400) {
                    Toast.makeText(data.errMessage).show();
                    _this.clear();
                    _this.loaderProgress.hideLoader();
                }
                else if (data.OrderFQTVStatus.length > 0) {
                    var CompansationFQTVDetails_1 = [];
                    data.OrderFQTVStatus.forEach(function (segData, Index) {
                        if (segData.FlightNumber != "") {
                            CompansationFQTVDetails_1.push(segData);
                        }
                    });
                    // if(data.OrderFQTVStatus)
                    if (CompansationFQTVDetails_1.length > 0) {
                        var CompensationFQTVStatus = index_5.Converters.ConvertToCompPaxTemplateByFQTV(CompansationFQTVDetails_1);
                        console.dir(CompensationFQTVStatus);
                        _this._shared.setCompensationFQTVStatusDetails(CompensationFQTVStatus);
                        _this.loaderProgress.hideLoader();
                        _this.navigatetoCompensationFQTVList();
                        _this.loaderProgress.hideLoader();
                    }
                    else {
                        Toast.makeText("Segments not available").show();
                        _this.loaderProgress.hideLoader();
                    }
                }
                else {
                    Toast.makeText(CompensationSearchComponent_1.FQTVNOTFOUNDTOAST).show();
                    _this.clear();
                    _this.loaderProgress.hideLoader();
                }
                var eDate = new Date();
                console.log('Get GetPassengerFQTVDetails Service --------------- End Date Time : ' + eDate);
                console.log('Get GetPassengerFQTVDetails Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            }, function (err) {
                Toast.makeText(err).show();
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
    CompensationSearchComponent.prototype.navigatetoCompensationSearchResult = function () {
        this.routerExtensions.navigate(["compensationresult"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }, queryParams: {
                "data": this.PassengerType
            }
        });
    };
    CompensationSearchComponent.prototype.navigatetoCompensationSelectSegment = function () {
        this.routerExtensions.navigate(["compensationselectsegment"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }, queryParams: {
                "data": this.SearchFields.SearchAny
            }
        });
    };
    CompensationSearchComponent.prototype.navigatetoCompensationFQTVList = function () {
        this.routerExtensions.navigate(["compensationfqtv"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }, queryParams: {
                "data": this.SearchFields.SearchAny
            }
        });
    };
    CompensationSearchComponent.prototype.naviagatetoCompensationListwithtab = function () {
        this.routerExtensions.navigate(["compensationsearchresultwithtab"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSearchComponent.prototype.naviagatetoCompensationPrintListwithtab = function () {
        this.routerExtensions.navigate(["compensationprintscreen"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSearchComponent.prototype.navigateToHome = function () {
        this.routerExtensions.navigate(["home"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSearchComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSearchComponent.prototype.navigateToSearch = function () {
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
    CompensationSearchComponent.prototype.navigateToDepartures = function () {
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
    CompensationSearchComponent.prototype.handleServiceError = function (error) {
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
    var CompensationSearchComponent_1;
    CompensationSearchComponent.COMPENSATIONPRINTLISTPAX = "Print List";
    CompensationSearchComponent.COMPENSATIONLISTPAX = "Compensation List";
    CompensationSearchComponent.DATANOTFOUNDTOAST = "Data not found";
    CompensationSearchComponent.FLIGHTNOTFOUNDTOAST = " Flight Details not found";
    CompensationSearchComponent.RESERVATIONNOTFOUNDTOAST = "No Reservation found";
    CompensationSearchComponent.RESERVATIONNOTFOUNDTOASTFORETKT = "ETKT not found";
    CompensationSearchComponent.FQTVNOTFOUNDTOAST = "No FQTV found";
    CompensationSearchComponent.INVALIDFLIGHTENTERED = "Invalid input. Enter airline code and flight number.";
    __decorate([
        core_1.ViewChild('pagecontainer'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationSearchComponent.prototype, "pageCont", void 0);
    CompensationSearchComponent = CompensationSearchComponent_1 = __decorate([
        core_1.Component({
            selector: "compensationsearch-page",
            providers: [app_constants_1.Configuration, index_3.CompensationService, index_1.DataService, index_1.PassengerService],
            templateUrl: "./components/compensationsearch/compensationsearch.component.html",
            styleUrls: ["./components/compensationsearch/compensationsearch.component.css"]
        }),
        __metadata("design:paramtypes", [app_constants_1.Configuration, index_1.PassengerService, index_1.DataService, index_1.CheckinOrderService, page_1.Page, router_2.RouterExtensions, timeOut_service_1.TimeOutService, router_1.Router, index_3.CompensationService, router_1.ActivatedRoute, core_1.ViewContainerRef, modal_dialog_1.ModalDialogService])
    ], CompensationSearchComponent);
    return CompensationSearchComponent;
}());
exports.CompensationSearchComponent = CompensationSearchComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGVuc2F0aW9uc2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbXBlbnNhdGlvbnNlYXJjaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsc0NBQTJGO0FBQzNGLDBDQUEyRTtBQUUzRSxzREFBK0Q7QUFDL0Qsa0VBQTJGO0FBQzNGLGdDQUErQjtBQUMvQixvQ0FBdUM7QUFRdkMsOEJBQThCO0FBQzlCLDBEQUE0RDtBQUM1RCwrQkFBaUM7QUFDakMsMENBQTRDO0FBRTVDLGdCQUFnQjtBQUNoQix3RUFBcUY7QUFDckYscURBQWlHO0FBQ2pHLHNEQUF1SDtBQUN2SCxxREFBa0U7QUFDbEUsa0RBQXFNO0FBQ3JNLGtEQUFzRDtBQUN0RCxvRkFBb0c7QUFDcEcscURBQW9EO0FBQ3BELDZEQUEyRDtBQUUzRCx5RUFBdUU7QUFXdkU7SUEyQ0kscUNBQW9CLGNBQTZCLEVBQVMsU0FBMkIsRUFBUyxZQUF5QixFQUFTLE9BQTRCLEVBQVUsSUFBVSxFQUFVLGdCQUFrQyxFQUFTLGVBQStCLEVBQVUsTUFBYyxFQUFTLFFBQTZCLEVBQVUsS0FBcUIsRUFBVSxLQUF1QixFQUFVLGFBQWlDO1FBQXpaLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBYTtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQXFCO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFBUyxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBcUI7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUFVLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQW9CO1FBckN0YSxpQkFBWSxHQUFXLElBQUksY0FBTSxFQUFFLENBQUM7UUFHcEMsaUJBQVksR0FBVyxFQUFFLENBQUM7UUFFMUIsa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFDM0IsZ0JBQVcsR0FBWSxJQUFJLENBQUM7UUFDNUIsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFDOUIsc0JBQWlCLEdBQWtDLElBQUksMEJBQWtCLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDdkYsZ0JBQVcsR0FBa0IsRUFBRSxDQUFDO1FBQ2hDLHFCQUFnQixHQUFZLEtBQUssQ0FBQztRQUNsQyxrQkFBYSxHQUFZLEtBQUssQ0FBQztRQUMvQixvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUNqQyxvQkFBZSxHQUFHLEtBQUssQ0FBQztRQU94QixhQUFRLEdBQStDLEVBQUUsQ0FBQztRQUMxRCxtQkFBYyxHQUErQyxFQUFFLENBQUM7UUFDaEUsbUJBQWMsR0FBa0IsRUFBRSxDQUFDO1FBQ25DLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBQzdCLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBQzdCLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFDekIsc0JBQWlCLEdBQVksS0FBSyxDQUFDO1FBQ25DLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBV25DLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0QsbUJBQW1CLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0UsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEdBQUcsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxzQkFBYyxFQUFFLENBQUM7SUFDL0MsQ0FBQztvQ0FyRFEsMkJBQTJCO0lBc0RwQyw4Q0FBUSxHQUFSO1FBQUEsaUJBZ0JDO1FBZkcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLGlDQUFpQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUM7UUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxjQUFjLEdBQUcsbUJBQW1CLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLO1lBQzlCLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQTtRQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVqQyxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztJQUNqQyxDQUFDO0lBQ0QsaUVBQTJCLEdBQTNCO1FBQUEsaUJBaUJDO1FBaEJHLElBQUksT0FBTyxHQUF1QjtZQUM5QixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSztZQUM1QixPQUFPLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDM0MsVUFBVSxFQUFFLEtBQUs7U0FDcEIsQ0FBQztRQUVGLElBQUksQ0FBQyxhQUFhO2FBQ2IsU0FBUyxDQUFDLDJDQUEyQixFQUFFLE9BQU8sQ0FBQzthQUMvQyxJQUFJLENBQUMsVUFBQSxNQUFNO1lBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDckMsSUFBSSxNQUFNLEVBQUU7Z0JBQ1IsS0FBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBQyxLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMzRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQzthQUMvQjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNELHNEQUFnQixHQUFoQjtRQUFBLGlCQWdDQztRQS9CRyxJQUFJO1lBQ0EsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNqQyxJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUVBQWlFLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDdkYsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFO2lCQUMzQixTQUFTLENBQUMsVUFBQSxJQUFJO2dCQUNYLElBQUksbUJBQW1CLEdBQVEsSUFBSSxDQUFDO2dCQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBQ2pDLEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxtQkFBbUIsQ0FBQztnQkFDN0MsS0FBSSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxLQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDN0QsS0FBSSxDQUFDLGlCQUFpQixDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxLQUFLO29CQUNqRSxLQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNyRCxDQUFDLENBQUMsQ0FBQztnQkFDSCxLQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3JDLENBQUMsRUFDRyxVQUFBLEdBQUc7Z0JBQ0MsS0FBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QixLQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLEtBQUssRUFBRTtZQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDcEM7Z0JBQ087WUFDSixJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0RBQStELEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDckYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnREFBZ0QsR0FBRyxvQ0FBZ0IsQ0FBQyxhQUFhLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3BJO0lBRUwsQ0FBQztJQUNELHFEQUFlLEdBQWYsVUFBZ0IsSUFBSTtRQUFwQixpQkF3QkM7UUF2QkcsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUIsSUFBSSxPQUFPLEdBQXVCO1lBQzlCLGdCQUFnQixFQUFFLElBQUksQ0FBQyxLQUFLO1lBQzVCLE9BQU8sRUFBRTtnQkFDTCxXQUFXLEVBQUUsV0FBVyxDQUFDLFlBQVksRUFBRTtnQkFDdkMsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLE9BQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsWUFBWSxFQUFFO2dCQUN4RSxPQUFPLEVBQUUsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFlBQVksRUFBRTthQUN0RTtZQUNELFVBQVUsRUFBRSxLQUFLO1NBQ3BCLENBQUM7UUFFRixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxtQ0FBZSxFQUFFLE9BQU8sQ0FBQzthQUNqRCxJQUFJLENBQUMsVUFBQyxVQUFnQjtZQUNuQixJQUFJLFVBQVUsRUFBRTtnQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFDekMsSUFBSSxVQUFVLENBQUMsWUFBWSxFQUFFLElBQUksV0FBVyxFQUFFO29CQUMxQyxLQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQztpQkFDN0I7YUFDSjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNELGdFQUEwQixHQUExQjtRQUFBLGlCQWFDO1FBWkcsSUFBSSxPQUFPLEdBQUc7WUFDVixLQUFLLEVBQUUsZ0JBQWdCO1lBQ3ZCLGdCQUFnQixFQUFFLFFBQVE7WUFDMUIsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXO1NBQzVCLENBQUM7UUFDRixPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLE1BQU07WUFDaEMsSUFBSSxNQUFNLElBQUksUUFBUSxFQUFFO2dCQUNwQixLQUFJLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztnQkFDNUIsS0FBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQ3pCLEtBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO2FBQzVCO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0QsMkNBQUssR0FBTDtRQUNJLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUM3QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUMxQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0lBQ2xDLENBQUM7SUFDRCxpREFBVyxHQUFYO1FBQ0ksSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDMUMsT0FBTyxJQUFJLENBQUM7U0FDZjs7WUFDSSxPQUFPLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBQ0QsaURBQVcsR0FBWDtRQUNJLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUNoRCxPQUFPLElBQUksQ0FBQztTQUNmOztZQUNJLE9BQU8sS0FBSyxDQUFDO0lBRXRCLENBQUM7SUFDRCw4Q0FBUSxHQUFSLFVBQVMsSUFBUyxFQUFFLEtBQVU7UUFDMUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQyxRQUFRLEtBQUssRUFBRTtZQUNYLEtBQUssQ0FBQztnQkFDRixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztnQkFDM0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7Z0JBQzdCLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLElBQUksRUFBRSxFQUFFO29CQUNuQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO29CQUM5QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO2lCQUNoQztnQkFDRCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRTtvQkFDckYsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7aUJBQ3ZCOztvQkFFRyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztnQkFDekIsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFDekMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNqRCxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7b0JBQ2YsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztvQkFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7aUJBQ3hCOztvQkFFRyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO2dCQUNsQyxNQUFNO1lBQ1YsS0FBSyxDQUFDO2dCQUNGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7Z0JBQzlCLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxFQUFFLEVBQUU7b0JBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO29CQUMxQixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztpQkFDaEM7cUJBQ0k7b0JBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7b0JBQzNCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO29CQUMxQixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTt3QkFDL0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzt3QkFDdkMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBQ3ZDLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTs0QkFDZixLQUFLLENBQUMsUUFBUSxDQUFDLDZCQUEyQixDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7NEJBQ3hFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO3lCQUM3QjtxQkFDSjt5QkFBTTt3QkFDSCxJQUFJLEdBQUcsR0FBRyw0QkFBNEIsQ0FBQzt3QkFDdkMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDO3dCQUNoQyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7NEJBQ2YsS0FBSyxDQUFDLFFBQVEsQ0FBQyw2QkFBMkIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOzRCQUN4RSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzt5QkFDN0I7cUJBQ0o7aUJBQ0o7Z0JBQ0QsU0FBUztnQkFDVCwyQ0FBMkM7Z0JBQzNDLCtDQUErQztnQkFDL0Msa0RBQWtEO2dCQUNsRCw4QkFBOEI7Z0JBQzlCLHlDQUF5QztnQkFDekMsdUZBQXVGO2dCQUN2RixtQkFBbUI7Z0JBQ25CLDBDQUEwQztnQkFDMUMsWUFBWTtnQkFDWixlQUFlO2dCQUNmLHNDQUFzQztnQkFDdEMsUUFBUTtnQkFDUixJQUFJO2dCQUVKLE1BQU07WUFDVixRQUFRO1NBQ1g7UUFDRCxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksRUFBRSxFQUFFO1lBQ3pELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1NBQy9CO2FBQU07WUFDSCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztTQUNoQztJQUVMLENBQUM7SUFDRCx5REFBbUIsR0FBbkI7UUFDSSxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksRUFBRSxFQUFFO1lBQ3BGLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3RCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7O1lBQ0ksT0FBTyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUNELHVEQUFpQixHQUFqQjtRQUFBLGlCQTZCQztRQTVCRyxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVELElBQUksT0FBTyxDQUFDO1FBQ1osSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7UUFFL0MsNkdBQTZHO1FBQzdHLElBQUksR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3ZDLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtZQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLFlBQVksR0FBRyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7U0FDNUY7UUFDRCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxJQUFJLEVBQUU7WUFDdEQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzlDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQzFCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1NBQzFCO2FBQ0k7WUFDRCxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksNkJBQTJCLENBQUMsd0JBQXdCLEVBQUU7Z0JBQzVFLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksS0FBSSxDQUFDLGFBQWEsRUFBekMsQ0FBeUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFDdEgsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDeEY7aUJBQU0sSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLDZCQUEyQixDQUFDLG1CQUFtQixFQUFFO2dCQUM5RSxPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLEtBQUksQ0FBQyxhQUFhLEVBQXpDLENBQXlDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQ3RILElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsYUFBYSxFQUFFLGVBQWUsQ0FBQyxDQUFDO2FBQ2hHO2lCQUFNO2dCQUNILE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksS0FBSSxDQUFDLGFBQWEsRUFBekMsQ0FBeUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFDdEgsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDckY7U0FDSjtJQUNMLENBQUM7SUFDRCwrQ0FBUyxHQUFUO1FBQ0ksSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDakMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pELElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtZQUNkLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3ZCO1FBQ0QsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ3pDLDRDQUE0QztZQUM1QyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUM5RDthQUNJLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQy9ELDJDQUEyQztZQUMzQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUM3RDthQUNJLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksRUFBRSxFQUFFO1lBQzFGLHdDQUF3QztZQUN4QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ25FLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRSxJQUFJLFFBQVEsR0FBRyxRQUFRLEdBQUcsS0FBSyxHQUFHLFFBQVEsQ0FBQztZQUMzQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDMUM7YUFDSTtTQUNKO0lBQ0wsQ0FBQztJQUNELHNEQUFnQixHQUFoQixVQUFpQixVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxPQUFPO1FBQTVELGlCQW9DQztRQW5DRyxJQUFJO1lBQ0EsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNqQyxJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0VBQW9FLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDMUYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxJQUFJO2dCQUMxRixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFO29CQUN4QixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7d0JBQ3JCLElBQUksbUJBQW1CLEdBQVEsSUFBSSxDQUFDO3dCQUNwQyxLQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLG1CQUFtQixDQUFDLENBQUM7d0JBQ3RELEtBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztxQkFDdkI7eUJBQU07d0JBQ0gsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUMzQyxLQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO3dCQUNqQyxLQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7cUJBQ2hCO2lCQUNKO3FCQUFNO29CQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUN2QyxLQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2IsS0FBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztpQkFFcEM7WUFDTCxDQUFDLEVBQUUsVUFBQSxHQUFHO2dCQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDN0IsS0FBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQTtTQUNMO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ3BDO2dCQUNPO1lBQ0osSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLGtFQUFrRSxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQ3hGLE9BQU8sQ0FBQyxHQUFHLENBQUMsbURBQW1ELEdBQUcsb0NBQWdCLENBQUMsYUFBYSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN2STtJQUNMLENBQUM7SUFDRCx5REFBbUIsR0FBbkIsVUFBb0IsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTztRQUFuRCxpQkF1Q0M7UUF0Q0csSUFBSTtZQUNBLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDakMsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLGlFQUFpRSxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQ3ZGLElBQUksQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUMsSUFBSTtnQkFDakYsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUVkLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLElBQUksRUFBRTt3QkFDdEQsS0FBSyxDQUFDLFFBQVEsQ0FBQyw2QkFBMkIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNyRSxLQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO3dCQUNqQyxLQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7cUJBQ2hCO3lCQUFNO3dCQUNILElBQUksbUJBQW1CLEdBQVEsSUFBSSxDQUFDO3dCQUNwQyxLQUFJLENBQUMsK0JBQStCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztxQkFDN0Q7aUJBQ0o7cUJBQU07b0JBQ0gsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxnQkFBZ0IsRUFBRTt3QkFDNUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO3FCQUMvQzt5QkFBTTt3QkFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7cUJBQ2pEO29CQUNELEtBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQ2pDLEtBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQkFDaEI7WUFDTCxDQUFDLEVBQUUsVUFBQSxHQUFHO2dCQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDN0IsS0FBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQTtTQUNMO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ3BDO2dCQUNPO1lBQ0osSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLCtEQUErRCxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQ3JGLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0RBQWdELEdBQUcsb0NBQWdCLENBQUMsYUFBYSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwSTtJQUNMLENBQUM7SUFDRCxxRUFBK0IsR0FBL0IsVUFBZ0MsT0FBTztRQUF2QyxpQkFxRUM7UUFwRUcsSUFBSTtZQUNBLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvRUFBb0UsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUMxRixJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2pDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDM0IsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNyQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztZQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQyxJQUFJO2dCQUM3RCxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFO29CQUN4QixJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFO3dCQUN0QixJQUFJLFFBQU0sR0FBUSxJQUFJLENBQUM7d0JBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDNUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxRQUFNLENBQUMsQ0FBQzt3QkFDbEQsSUFBSSxZQUFZLEdBQUcsa0JBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxRQUFNLEVBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ25ILEtBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQzt3QkFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDaEUsSUFBSSxVQUFVLEdBQUcsa0JBQVUsQ0FBQyxpQ0FBaUMsQ0FBQyxPQUFPLEVBQUUsUUFBTSxFQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNsSSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO3dCQUN4QixLQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDO3dCQUM3QyxJQUFJLEtBQUksQ0FBQyxhQUFhLElBQUksNkJBQTJCLENBQUMsd0JBQXdCLEVBQUU7NEJBQzVFLEtBQUksQ0FBQyx1Q0FBdUMsRUFBRSxDQUFDO3lCQUNsRDs2QkFBTTs0QkFDSCxLQUFJLENBQUMsa0NBQWtDLEVBQUUsQ0FBQzt5QkFDN0M7d0JBQ0QsS0FBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztxQkFDcEM7eUJBQU07d0JBQ0gsMEJBQTBCO3dCQUMxQiw2Q0FBNkM7d0JBQzdDLEtBQUksQ0FBQyxPQUFPLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQzt3QkFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDaEUsSUFBSSxVQUFVLEdBQUcsa0JBQVUsQ0FBQyxpQ0FBaUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNqSSxLQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDO3dCQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO3dCQUN4QixJQUFJLEtBQUksQ0FBQyxhQUFhLElBQUksNkJBQTJCLENBQUMsd0JBQXdCLEVBQUU7NEJBQzVFLEtBQUksQ0FBQyx1Q0FBdUMsRUFBRSxDQUFDO3lCQUNsRDs2QkFBTTs0QkFDSCxLQUFJLENBQUMsa0NBQWtDLEVBQUUsQ0FBQzt5QkFDN0M7d0JBQ0QsS0FBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztxQkFDcEM7aUJBRUo7cUJBQU07b0JBQ0gsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3ZDLEtBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDYixLQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO2lCQUNwQztZQUNMLENBQUMsRUFDRyxVQUFBLEdBQUc7Z0JBQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDOUMsS0FBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QixLQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxDQUFDO1NBQ1Y7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDcEM7Z0JBQ087WUFDSixJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0VBQWtFLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDeEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtREFBbUQsR0FBRyxvQ0FBZ0IsQ0FBQyxhQUFhLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZJO0lBRUwsQ0FBQztJQUNELGtEQUFZLEdBQVo7UUFBQSxpQkFxQ0M7UUFwQ0csSUFBSTtZQUNBLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvRUFBb0UsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUMxRixJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2pDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDM0IsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNyQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztZQUMxQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFDLElBQUk7Z0JBQzdELElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUU7b0JBQ3RCLElBQUksUUFBTSxHQUFRLElBQUksQ0FBQTtvQkFDdEIsS0FBSSxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxRQUFNLENBQUMsQ0FBQztvQkFDbEQsS0FBSSxDQUFDLGtDQUFrQyxFQUFFLENBQUM7b0JBQzFDLEtBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7aUJBQ3BDO3FCQUFNO29CQUNILEtBQUksQ0FBQyxPQUFPLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2hELEtBQUksQ0FBQyxrQ0FBa0MsRUFBRSxDQUFDO29CQUMxQyxLQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUNqQyxnQkFBZ0I7b0JBQ2hCLEtBQUssQ0FBQyxRQUFRLENBQUMsNkJBQTJCLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDMUU7WUFDTCxDQUFDLEVBQ0csVUFBQSxHQUFHO2dCQUNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDN0IsS0FBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQztTQUNWO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ3BDO2dCQUNPO1lBQ0osSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLGtFQUFrRSxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQ3hGLE9BQU8sQ0FBQyxHQUFHLENBQUMsbURBQW1ELEdBQUcsb0NBQWdCLENBQUMsYUFBYSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN2STtJQUVMLENBQUM7SUFDRCw4REFBd0IsR0FBeEIsVUFBeUIsT0FBZTtRQUF4QyxpQkF1Q0M7UUF0Q0csSUFBSTtZQUNBLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDakMsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLHlFQUF5RSxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQy9GLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDO2lCQUNyQyxTQUFTLENBQUMsVUFBQSxJQUFJO2dCQUNYLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxHQUFHLEVBQUU7b0JBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3JCLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUM1QztxQkFBTTtvQkFDSCxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7d0JBQ3JCLElBQUksbUJBQW1CLEdBQVEsSUFBSSxDQUFDO3dCQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7d0JBQ2pDLHVHQUF1Rzt3QkFDdkcsdUNBQXVDO3dCQUN2QyxLQUFJLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLG1CQUFtQixDQUFDLENBQUM7d0JBQzlELEtBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7d0JBQ2pDLEtBQUksQ0FBQyxtQ0FBbUMsRUFBRSxDQUFDO3dCQUMzQyxJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO3dCQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLHVFQUF1RSxHQUFHLEtBQUssQ0FBQyxDQUFDO3dCQUM3RixPQUFPLENBQUMsR0FBRyxDQUFDLHdEQUF3RCxHQUFHLG9DQUFnQixDQUFDLGFBQWEsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzVJO3lCQUFNO3dCQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsNkJBQTJCLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDNUUsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDO3dCQUNiLEtBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7cUJBQ3BDO2lCQUNKO1lBQ0wsQ0FBQyxFQUNHLFVBQUEsR0FBRztnQkFDQyxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QyxLQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzdCLEtBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUM7U0FDZDtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNwQztJQUVMLENBQUM7SUFFRCw2REFBdUIsR0FBdkIsVUFBd0IsYUFBcUI7UUFBN0MsaUJBZ0NDO1FBL0JHLElBQUk7WUFDQSxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2pDLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3RUFBd0UsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUM5RixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7aUJBQy9CLFNBQVMsQ0FBQyxVQUFBLElBQUk7Z0JBQ1gsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO29CQUNyQixJQUFJLG1CQUFtQixHQUFRLElBQUksQ0FBQztvQkFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUNqQyxLQUFJLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLG1CQUFtQixDQUFDLENBQUM7b0JBQzlELEtBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQ2pDLEtBQUksQ0FBQyxtQ0FBbUMsRUFBRSxDQUFDO29CQUMzQyxJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO29CQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLHVFQUF1RSxHQUFHLEtBQUssQ0FBQyxDQUFDO29CQUM3RixPQUFPLENBQUMsR0FBRyxDQUFDLHdEQUF3RCxHQUFHLG9DQUFnQixDQUFDLGFBQWEsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzVJO3FCQUFNO29CQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsNkJBQTJCLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDNUUsS0FBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDakMsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNoQjtZQUNMLENBQUMsRUFDRyxVQUFBLEdBQUc7Z0JBQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDOUMsS0FBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QixLQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxDQUFDO1NBQ2Q7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDcEM7SUFFTCxDQUFDO0lBRUQsNkRBQXVCLEdBQXZCLFVBQXdCLFVBQWtCO1FBQTFDLGlCQW9EQztRQW5ERyxJQUFJO1lBQ0EsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNqQyxJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0VBQXdFLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDOUYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO2lCQUM1QixTQUFTLENBQUMsVUFBQSxJQUFJO2dCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLEdBQUcsRUFBRTtvQkFDeEIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3ZDLEtBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDYixLQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO2lCQUNwQztxQkFDSSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDdEMsSUFBSSx5QkFBdUIsR0FBZSxFQUFFLENBQUM7b0JBQzdDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLEtBQUs7d0JBQ3hDLElBQUksT0FBTyxDQUFDLFlBQVksSUFBSSxFQUFFLEVBQUU7NEJBQzVCLHlCQUF1QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt5QkFDekM7b0JBQ0wsQ0FBQyxDQUFDLENBQUE7b0JBQ0YsMkJBQTJCO29CQUMzQixJQUFJLHlCQUF1QixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7d0JBQ3BDLElBQUksc0JBQXNCLEdBQVEsa0JBQVUsQ0FBQyw4QkFBOEIsQ0FBQyx5QkFBdUIsQ0FBQyxDQUFDO3dCQUNyRyxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7d0JBQ3BDLEtBQUksQ0FBQyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsc0JBQXNCLENBQUMsQ0FBQzt3QkFDdEUsS0FBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQzt3QkFDakMsS0FBSSxDQUFDLDhCQUE4QixFQUFFLENBQUM7d0JBQ3RDLEtBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7cUJBQ3BDO3lCQUFNO3dCQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDaEQsS0FBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztxQkFDcEM7aUJBQ0o7cUJBQU07b0JBQ0gsS0FBSyxDQUFDLFFBQVEsQ0FBQyw2QkFBMkIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNyRSxLQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2IsS0FBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztpQkFDcEM7Z0JBQ0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzRUFBc0UsR0FBRyxLQUFLLENBQUMsQ0FBQztnQkFDNUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1REFBdUQsR0FBRyxvQ0FBZ0IsQ0FBQyxhQUFhLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVJLENBQUMsRUFDRyxVQUFBLEdBQUc7Z0JBQ0MsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDOUMsS0FBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QixLQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxDQUFDO1NBQ2Q7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDcEM7SUFFTCxDQUFDO0lBQ0Qsd0VBQWtDLEdBQWxDO1FBQ0ksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEVBQUU7WUFDbkQsUUFBUSxFQUFFLElBQUk7WUFDZCxVQUFVLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsS0FBSyxFQUFFLFFBQVE7YUFDbEIsRUFBRSxXQUFXLEVBQUU7Z0JBQ1osTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhO2FBQzdCO1NBQ0osQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQUNELHlFQUFtQyxHQUFuQztRQUNJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFO1lBQzFELFFBQVEsRUFBRSxJQUFJO1lBQ2QsVUFBVSxFQUFFO2dCQUNSLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLEtBQUssRUFBRSxRQUFRO2FBQ2xCLEVBQUUsV0FBVyxFQUFFO2dCQUNaLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVM7YUFDdEM7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0Qsb0VBQThCLEdBQTlCO1FBQ0ksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7WUFDakQsUUFBUSxFQUFFLElBQUk7WUFDZCxVQUFVLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsS0FBSyxFQUFFLFFBQVE7YUFDbEIsRUFBRSxXQUFXLEVBQUU7Z0JBQ1osTUFBTSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUzthQUN0QztTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRCx3RUFBa0MsR0FBbEM7UUFDSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsaUNBQWlDLENBQUMsRUFBRTtZQUNoRSxRQUFRLEVBQUUsSUFBSTtZQUNkLFVBQVUsRUFBRTtnQkFDUixJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUUsR0FBRztnQkFDYixLQUFLLEVBQUUsUUFBUTthQUNsQjtTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRCw2RUFBdUMsR0FBdkM7UUFDSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMseUJBQXlCLENBQUMsRUFBRTtZQUN4RCxRQUFRLEVBQUUsSUFBSTtZQUNkLFVBQVUsRUFBRTtnQkFDUixJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUUsR0FBRztnQkFDYixLQUFLLEVBQUUsUUFBUTthQUNsQjtTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRCxvREFBYyxHQUFkO1FBQ0ksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3JDLFFBQVEsRUFBRSxJQUFJO1lBQ2QsVUFBVSxFQUFFO2dCQUNSLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRSxHQUFHO2dCQUNiLEtBQUssRUFBRSxRQUFRO2FBQ2xCO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNELHVEQUFpQixHQUFqQjtRQUNJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUN4QyxRQUFRLEVBQUUsSUFBSTtZQUNkLFVBQVUsRUFBRTtnQkFDUixJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUUsR0FBRztnQkFDYixLQUFLLEVBQUUsUUFBUTthQUNsQjtTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRCxzREFBZ0IsR0FBaEI7UUFDSSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLEVBQUU7WUFDaEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUN2QyxRQUFRLEVBQUUsSUFBSTtnQkFDZCxVQUFVLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE9BQU87b0JBQ2IsUUFBUSxFQUFFLEdBQUc7b0JBQ2IsS0FBSyxFQUFFLFFBQVE7aUJBQ2xCO2FBQ0osQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBQ0QsMERBQW9CLEdBQXBCO1FBQ0ksSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksRUFBRTtZQUM3QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQzNDLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFVBQVUsRUFBRTtvQkFDUixJQUFJLEVBQUUsT0FBTztvQkFDYixRQUFRLEVBQUUsR0FBRztvQkFDYixLQUFLLEVBQUUsUUFBUTtpQkFDbEI7YUFDSixDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7SUFFRCx3REFBa0IsR0FBbEIsVUFBbUIsS0FBVTtRQUE3QixpQkF1QkM7UUF0QkcsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BDLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQzdDLElBQUksT0FBTyxHQUFHO2dCQUNWLEtBQUssRUFBRSxrQkFBa0I7Z0JBQ3pCLE9BQU8sRUFBRSxnQ0FBZ0M7Z0JBQ3pDLFlBQVksRUFBRSxJQUFJO2FBQ3JCLENBQUM7WUFDRixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDeEIsS0FBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUNqQyxRQUFRLEVBQUUsSUFBSTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1IsSUFBSSxFQUFFLE9BQU87d0JBQ2IsUUFBUSxFQUFFLEdBQUc7d0JBQ2IsS0FBSyxFQUFFLFFBQVE7cUJBQ2xCO2lCQUNKLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1lBQ0gsb0NBQW9DO1NBQ3ZDO2FBQ0k7WUFDRCxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3ZDO0lBQ0wsQ0FBQzs7SUF4dEJhLG9EQUF3QixHQUFXLFlBQVksQ0FBQztJQUNoRCwrQ0FBbUIsR0FBVyxtQkFBbUIsQ0FBQztJQUNsRCw2Q0FBaUIsR0FBVyxnQkFBZ0IsQ0FBQztJQUM3QywrQ0FBbUIsR0FBVywyQkFBMkIsQ0FBQztJQUMxRCxvREFBd0IsR0FBVyxzQkFBc0IsQ0FBQztJQUMxRCwyREFBK0IsR0FBVyxnQkFBZ0IsQ0FBQztJQUMzRCw2Q0FBaUIsR0FBVyxlQUFlLENBQUM7SUFDNUMsZ0RBQW9CLEdBQVcsc0RBQXNELENBQUM7SUF4Q3hFO1FBQTNCLGdCQUFTLENBQUMsZUFBZSxDQUFDO2tDQUFXLGlCQUFVO2lFQUFDO0lBRHhDLDJCQUEyQjtRQVJ2QyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLHlCQUF5QjtZQUNuQyxTQUFTLEVBQUUsQ0FBQyw2QkFBYSxFQUFFLDJCQUFtQixFQUFFLG1CQUFXLEVBQUUsd0JBQWdCLENBQUM7WUFDOUUsV0FBVyxFQUFFLG1FQUFtRTtZQUNoRixTQUFTLEVBQUUsQ0FBQyxrRUFBa0UsQ0FBQztTQUVsRixDQUFDO3lDQTZDc0MsNkJBQWEsRUFBb0Isd0JBQWdCLEVBQXVCLG1CQUFXLEVBQWtCLDJCQUFtQixFQUFnQixXQUFJLEVBQTRCLHlCQUFnQixFQUEwQixnQ0FBYyxFQUFrQixlQUFNLEVBQW1CLDJCQUFtQixFQUFpQix1QkFBYyxFQUFpQix1QkFBZ0IsRUFBeUIsaUNBQWtCO09BM0NwYSwyQkFBMkIsQ0EydkJ2QztJQUFELGtDQUFDO0NBQUEsQUEzdkJELElBMnZCQztBQTN2Qlksa0VBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiLy9hbmd1bGFyICYgbmF0aXZlc2NyaXB0IHJlZmVyZW5jZXNcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uRXh0cmFzLCBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBNb2RhbERpYWxvZ1NlcnZpY2UsIE1vZGFsRGlhbG9nT3B0aW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9tb2RhbC1kaWFsb2dcIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IGRpYWxvZ3MgPSByZXF1aXJlKFwidWkvZGlhbG9nc1wiKTtcbmltcG9ydCB7IFNjcm9sbFZpZXcgfSBmcm9tIFwidWkvc2Nyb2xsLXZpZXdcIjtcbmltcG9ydCB7IExpc3RWaWV3IH0gZnJvbSBcInVpL2xpc3Qtdmlld1wiO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gXCJ1aS9jb3JlL3ZpZXdcIjtcbmltcG9ydCB0ZXh0RmllbGQgPSByZXF1aXJlKFwidWkvdGV4dC1maWVsZFwiKTtcbmltcG9ydCAqIGFzIGdlc3R1cmVzIGZyb20gXCJ1aS9nZXN0dXJlc1wiO1xuXG5cbi8vZXh0ZXJuYWwgbW9kdWxlcyBhbmQgcGx1Z2luc1xuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tIFwibW9tZW50XCI7XG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICduYXRpdmVzY3JpcHQtdG9hc3QnO1xuXG4vL2FwcCByZWZlcmVuY2VzXG5pbXBvcnQgeyBDcmVhdGluZ0xpc3RQaWNrZXJDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9jb3VudHJ5L2NvdW50cnktbW9kYWxcIjtcbmltcG9ydCB7IERhdGFTZXJ2aWNlLCBQYXNzZW5nZXJTZXJ2aWNlLCBDaGVja2luT3JkZXJTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9pbmRleFwiO1xuaW1wb3J0IHsgTG9hZGVyUHJvZ3Jlc3MsIFBhc3Nlbmdlckxpc3RUZW1wbGF0ZSwgUGFzc2VuZ2VyTGlzdCwgQWNjb250UHJvZmlsZU1vZGVsIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9pbnRlcmZhY2UvaW5kZXhcIlxuaW1wb3J0IHsgQ29tcGVuc2F0aW9uU2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvaW5kZXhcIjtcbmltcG9ydCB7IE9yZGVyLCBDb3VudHJ5Q29sbGVjdGlvbiwgRmxpZ2h0U2VydmljZUluZm8sIEZsaWdodCwgU2VhcmNoLCBBY2NvdW50UHJvZmlsZSwgUGFzc2VuZ2VyVHlwZUxpc3RUYWJsZSwgQ29tcGFuc2F0aW9uLCBDaXR5Q29kZUNvbGxlY3Rpb24sIFBhc3NlbmdlclR5cGVNb2RlbCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbW9kZWwvaW5kZXhcIjtcbmltcG9ydCB7IENvbnZlcnRlcnMgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3V0aWxzL2luZGV4XCI7XG5pbXBvcnQgeyBEYXRlUGlja2VyTW9kYWwsIERhdGVQaWNrZXRDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXItbW9kYWxcIjtcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi8uLi9hcHAuY29uc3RhbnRzJztcbmltcG9ydCB7IEFwcEV4ZWN1dGlvbnRpbWUgfSBmcm9tIFwiLi4vLi4vYXBwLmV4ZWN1dGlvbnRpbWVcIjtcbmltcG9ydCB7IGlzQW5kcm9pZCwgaXNJT1MsIGRldmljZSwgc2NyZWVuIH0gZnJvbSBcInBsYXRmb3JtXCI7XG5pbXBvcnQgeyBUaW1lT3V0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvdGltZU91dC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBlbGVtZW50RGVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmUvc3JjL3ZpZXcvZWxlbWVudFwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJjb21wZW5zYXRpb25zZWFyY2gtcGFnZVwiLFxuICAgIHByb3ZpZGVyczogW0NvbmZpZ3VyYXRpb24sIENvbXBlbnNhdGlvblNlcnZpY2UsIERhdGFTZXJ2aWNlLCBQYXNzZW5nZXJTZXJ2aWNlXSxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2NvbXBvbmVudHMvY29tcGVuc2F0aW9uc2VhcmNoL2NvbXBlbnNhdGlvbnNlYXJjaC5jb21wb25lbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogW1wiLi9jb21wb25lbnRzL2NvbXBlbnNhdGlvbnNlYXJjaC9jb21wZW5zYXRpb25zZWFyY2guY29tcG9uZW50LmNzc1wiXVxuXG59KVxuXG5leHBvcnQgY2xhc3MgQ29tcGVuc2F0aW9uU2VhcmNoQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBAVmlld0NoaWxkKCdwYWdlY29udGFpbmVyJykgcGFnZUNvbnQ6IEVsZW1lbnRSZWY7XG4gICAgcHVibGljIGlzRXJyb3I6IGJvb2xlYW47XG4gICAgcHVibGljIGVycm9yTWVzc2FnZTogc3RyaW5nO1xuICAgIHB1YmxpYyBsb2FkZXJQcm9ncmVzczogTG9hZGVyUHJvZ3Jlc3M7XG4gICAgcHVibGljIHN0YXJ0RGF0ZTogRGF0ZTtcbiAgICBwdWJsaWMgU2VhcmNoRmllbGRzOiBTZWFyY2ggPSBuZXcgU2VhcmNoKCk7XG4gICAgcHVibGljIGN1ckRhdGU6IERhdGU7XG4gICAgcHVibGljIEZsaWdodERhdGU6IHN0cmluZztcbiAgICBwdWJsaWMgRmxpZ2h0TnVtYmVyOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyB1c2VyZGV0YWlsczogc3RyaW5nO1xuICAgIHB1YmxpYyBQYXNzZW5nZXJUeXBlOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBpc1RleHRGaWVsZDogYm9vbGVhbiA9IHRydWU7XG4gICAgcHVibGljIGlzTGFiZWxGaWVsZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBQYXNzZW5nZXJUeXBlTGlzdDogUGFzc2VuZ2VyVHlwZU1vZGVsLlJvb3RPYmplY3QgPSBuZXcgUGFzc2VuZ2VyVHlwZU1vZGVsLlJvb3RPYmplY3QoKTtcbiAgICBwdWJsaWMgUGF4VHlwZUxpc3Q6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICBwdWJsaWMgaXNBbnlTZWFyY2hFbXB0eTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBpc0ZsaWdodEVtcHR5OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzTGFzdE5hbWVFbXB0eTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBpc0J1dHRvbkVuYWJsZWQgPSBmYWxzZTtcbiAgICBwdWJsaWMgaXNudW1iZXI6IGJvb2xlYW47XG4gICAgcHVibGljIGlzTGFzdGRpcnR5OiBib29sZWFuO1xuICAgIHB1YmxpYyBpc0ZsaWdodGRpcnR5OiBib29sZWFuO1xuICAgIHB1YmxpYyBpc1NlYXJjaGFueWRpcnR5OiBib29sZWFuXG4gICAgcHVibGljIGlzZXJyb3I6IGJvb2xlYW47XG4gICAgcHVibGljIGlzRGlnaXQ6IGJvb2xlYW47XG4gICAgcHVibGljIGNpdHlMaXN0OiBBcnJheTxDaXR5Q29kZUNvbGxlY3Rpb24uQ29sbGVjdGlvbkVudGl0eT4gPSBbXTtcbiAgICBwdWJsaWMgZmlsdGVyQ2l0eUxpc3Q6IEFycmF5PENpdHlDb2RlQ29sbGVjdGlvbi5Db2xsZWN0aW9uRW50aXR5PiA9IFtdO1xuICAgIHB1YmxpYyBmaWx0ZXJDaXR5Q29kZTogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgIHB1YmxpYyBpc0NpdHlFbXB0eTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBpc0NpdHlEaXJ0eTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBpc1ZhbGlkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzQ2hlY2tpbkRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzR2F0ZURpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIHN0YXRpYyBDT01QRU5TQVRJT05QUklOVExJU1RQQVg6IHN0cmluZyA9IFwiUHJpbnQgTGlzdFwiO1xuICAgIHB1YmxpYyBzdGF0aWMgQ09NUEVOU0FUSU9OTElTVFBBWDogc3RyaW5nID0gXCJDb21wZW5zYXRpb24gTGlzdFwiO1xuICAgIHB1YmxpYyBzdGF0aWMgREFUQU5PVEZPVU5EVE9BU1Q6IHN0cmluZyA9IFwiRGF0YSBub3QgZm91bmRcIjtcbiAgICBwdWJsaWMgc3RhdGljIEZMSUdIVE5PVEZPVU5EVE9BU1Q6IHN0cmluZyA9IFwiIEZsaWdodCBEZXRhaWxzIG5vdCBmb3VuZFwiO1xuICAgIHB1YmxpYyBzdGF0aWMgUkVTRVJWQVRJT05OT1RGT1VORFRPQVNUOiBzdHJpbmcgPSBcIk5vIFJlc2VydmF0aW9uIGZvdW5kXCI7XG4gICAgcHVibGljIHN0YXRpYyBSRVNFUlZBVElPTk5PVEZPVU5EVE9BU1RGT1JFVEtUOiBzdHJpbmcgPSBcIkVUS1Qgbm90IGZvdW5kXCI7XG4gICAgcHVibGljIHN0YXRpYyBGUVRWTk9URk9VTkRUT0FTVDogc3RyaW5nID0gXCJObyBGUVRWIGZvdW5kXCI7XG4gICAgcHVibGljIHN0YXRpYyBJTlZBTElERkxJR0hURU5URVJFRDogc3RyaW5nID0gXCJJbnZhbGlkIGlucHV0LiBFbnRlciBhaXJsaW5lIGNvZGUgYW5kIGZsaWdodCBudW1iZXIuXCI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uLCBwdWJsaWMgX3NlcnZpY2VzOiBQYXNzZW5nZXJTZXJ2aWNlLCBwdWJsaWMgX2RhdGFTZXJ2aWNlOiBEYXRhU2VydmljZSwgcHVibGljIF9zaGFyZWQ6IENoZWNraW5PcmRlclNlcnZpY2UsIHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSByb3V0ZXJFeHRlbnNpb25zOiBSb3V0ZXJFeHRlbnNpb25zLCBwdWJsaWMgX3RpbWVvdXRTZXJ2aWNlOiBUaW1lT3V0U2VydmljZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHVibGljIF9zZXJ2aWNlOiBDb21wZW5zYXRpb25TZXJ2aWNlLCBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSB2Y1JlZjogVmlld0NvbnRhaW5lclJlZiwgcHJpdmF0ZSBfbW9kYWxTZXJ2aWNlOiBNb2RhbERpYWxvZ1NlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5pc0Vycm9yID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gXCJcIjtcbiAgICAgICAgdGhpcy51c2VyZGV0YWlscyA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcmRldGFpbHNcIiwgXCJcIik7XG4gICAgICAgIHRoaXMuU2VhcmNoRmllbGRzLkxvY2F0aW9uID0gdGhpcy51c2VyZGV0YWlscy5zdWJzdHIoMCwgMyk7XG4gICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwiU2VhcmNoTG9jYXRpb25cIix0aGlzLlNlYXJjaEZpZWxkcy5Mb2NhdGlvbik7XG4gICAgICAgIHRoaXMuU2VhcmNoRmllbGRzLkZsaWdodERhdGUgPSBtb21lbnQoKS5mb3JtYXQoXCJERCBNTU1NIFlZWVlcIik7XG4gICAgICAgIHRoaXMuY3VyRGF0ZSA9IG1vbWVudCgpLnRvRGF0ZSgpO1xuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MgPSBuZXcgTG9hZGVyUHJvZ3Jlc3MoKTtcbiAgICB9XG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMucGFnZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnfi9pbWFnZXMvbG9naW5fYmFjay5qcGVnJylcIjtcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRTaXplID0gXCJjb3ZlciBcIjtcbiAgICAgICAgY29uc29sZS5sb2coXCJJTlwiKTtcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5pbml0TG9hZGVyKHRoaXMucGFnZUNvbnQpO1xuICAgICAgICB0aGlzLmdldFBhc3NlbmdlclR5cGUoKTtcbiAgICAgICAgdGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNoZWNraW5EaXNhYmxlZFwiKTtcbiAgICAgICAgdGhpcy5pc0dhdGVEaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImdhdGVEaXNhYmxlZFwiKTtcbiAgICAgICAgdGhpcy5jaXR5TGlzdCA9IHRoaXMuX3NoYXJlZC5nZXRDaXR5TGlzdCgpO1xuICAgICAgICB0aGlzLmNpdHlMaXN0LmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZpbHRlckNpdHlDb2RlLnB1c2goZGF0YS5Db2RlICsgXCItXCIgKyBkYXRhLk5hbWUpO1xuICAgICAgICB9KVxuICAgICAgICBjb25zb2xlLmxvZyhcImluIHNlYXJjaCBzY3JlZW5cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZmlsdGVyQ2l0eUNvZGUpO1xuXG4gICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gZmFsc2U7XG4gICAgfVxuICAgIGRpc3BsYXlDaXR5TGlzdEFjdGlvbkRpYWxvZygpIHtcbiAgICAgICAgbGV0IG9wdGlvbnM6IE1vZGFsRGlhbG9nT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMudmNSZWYsXG4gICAgICAgICAgICBjb250ZXh0OiBbeyBjb3VudHJ5OiB0aGlzLmZpbHRlckNpdHlDb2RlIH1dLFxuICAgICAgICAgICAgZnVsbHNjcmVlbjogZmFsc2VcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9tb2RhbFNlcnZpY2VcbiAgICAgICAgICAgIC5zaG93TW9kYWwoQ3JlYXRpbmdMaXN0UGlja2VyQ29tcG9uZW50LCBvcHRpb25zKVxuICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGUgcmVzdWx0IFwiICsgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuU2VhcmNoRmllbGRzLkxvY2F0aW9uID0gcmVzdWx0LnN1YnN0cigwLCAzKTtcbiAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJTZWFyY2hMb2NhdGlvblwiLHRoaXMuU2VhcmNoRmllbGRzLkxvY2F0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvdXRcIiArIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldFBhc3NlbmdlclR5cGUoKTogdm9pZCB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IEdldFBhc3NlbmdlclR5cGUgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcbiAgICAgICAgICAgIHRoaXMuUGFzc2VuZ2VyVHlwZUxpc3QgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fc2VydmljZS5nZXRQYXNzZW5nZXJUeXBlKClcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgQ29tcGFuc2F0aW9uRGV0YWlsczogYW55ID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIoQ29tcGFuc2F0aW9uRGV0YWlscyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuUGFzc2VuZ2VyVHlwZUxpc3QgPSBDb21wYW5zYXRpb25EZXRhaWxzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0UGFzc2VuZ2VyVHlwZVNlcnZpY2UodGhpcy5QYXNzZW5nZXJUeXBlTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuUGFzc2VuZ2VyVHlwZUxpc3QuUGFzc2VuZ2VyVHlwZUxpc3RUYWJsZS5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXhUeXBlTGlzdC5wdXNoKGVsZW1lbnQuVmFsdWUuRGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgR2V0UGFzc2VuZ2VyVHlwZSBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgR2V0UGFzc2VuZ2VyVHlwZSBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgY3JlYXRlTW9kZWxWaWV3KGFyZ3MpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgICBsZXQgY3VycmVudERhdGUgPSB0aGlzLmN1ckRhdGU7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhcnREYXRlKTtcbiAgICAgICAgbGV0IG9wdGlvbnM6IE1vZGFsRGlhbG9nT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMudmNSZWYsXG4gICAgICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICAgICAgY3VycmVudERhdGU6IGN1cnJlbnREYXRlLnRvRGF0ZVN0cmluZygpLFxuICAgICAgICAgICAgICAgIGRpc3BsYXlIZWFkZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgbWluRGF0ZTogbW9tZW50KG5ldyBEYXRlKCkpLnN1YnRyYWN0KDEsICd5ZWFycycpLnRvRGF0ZSgpLnRvRGF0ZVN0cmluZygpLFxuICAgICAgICAgICAgICAgIG1heERhdGU6IG1vbWVudChuZXcgRGF0ZSgpKS5hZGQoMSwgJ3llYXJzJykudG9EYXRlKCkudG9EYXRlU3RyaW5nKClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdWxsc2NyZWVuOiBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX21vZGFsU2VydmljZS5zaG93TW9kYWwoRGF0ZVBpY2tlck1vZGFsLCBvcHRpb25zKVxuICAgICAgICAgICAgLnRoZW4oKGRhdGVyZXN1bHQ6IERhdGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0ZXJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGUgcmVzdWx0IFwiICsgZGF0ZXJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRlcmVzdWx0LnRvRGF0ZVN0cmluZygpICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1ckRhdGUgPSBkYXRlcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuICAgIGRpc3BsYXlQYXNzZW5nZXJUeXBlRGlhbG9nKCkge1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHRpdGxlOiBcIlBhc3NlbmdlciBUeXBlXCIsXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgYWN0aW9uczogdGhpcy5QYXhUeXBlTGlzdCxcbiAgICAgICAgfTtcbiAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzdWx0ICE9IFwiQ2FuY2VsXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLlBhc3NlbmdlclR5cGUgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0xhYmVsRmllbGQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNUZXh0RmllbGQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNsZWFyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkgPSBcIlwiO1xuICAgICAgICB0aGlzLkZsaWdodE51bWJlciA9IFwiXCI7XG4gICAgICAgIHRoaXMuUGFzc2VuZ2VyVHlwZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNMYWJlbEZpZWxkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNUZXh0RmllbGQgPSB0cnVlO1xuICAgICAgICB0aGlzLmlzTGFzdGRpcnR5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNGbGlnaHRkaXJ0eSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzU2VhcmNoYW55ZGlydHkgPSBmYWxzZTtcbiAgICB9XG4gICAgZmxpZ2h0RW1wdHkoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmlzRmxpZ2h0RW1wdHkgJiYgdGhpcy5pc0ZsaWdodGRpcnR5KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgc2VhcmNoZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmlzQW55U2VhcmNoRW1wdHkgJiYgdGhpcy5pc1NlYXJjaGFueWRpcnR5KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcblxuICAgIH1cbiAgICBvbkNoYW5nZShhcmdzOiBhbnksIGluZGV4OiBhbnkpIHtcbiAgICAgICAgdGhpcy5fdGltZW91dFNlcnZpY2UucmVzZXRXYXRjaCgpO1xuICAgICAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgdGhpcy5pc0ZsaWdodEVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0xhc3ROYW1lRW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5TZWFyY2hGaWVsZHMuU2VhcmNoQW55ICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0FueVNlYXJjaEVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTZWFyY2hhbnlkaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkubGVuZ3RoID49IDYgJiYgdGhpcy5TZWFyY2hGaWVsZHMuU2VhcmNoQW55Lmxlbmd0aCA8PSAxOCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKCdeW2EtekEtWjAtOS0vXSokJyk7XG4gICAgICAgICAgICAgICAgdmFyIHRlc3QgPSByZWcudGVzdCh0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkpO1xuICAgICAgICAgICAgICAgIGlmICh0ZXN0ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNBbnlTZWFyY2hFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNBbnlTZWFyY2hFbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHRoaXMuaXNBbnlTZWFyY2hFbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLkZsaWdodE51bWJlciA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNGbGlnaHRFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRmxpZ2h0RW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0ZsaWdodGRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuRmxpZ2h0TnVtYmVyLmxlbmd0aCA8PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnXlthLXpBLVowLTldKiQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gcmVnLnRlc3QodGhpcy5GbGlnaHROdW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3QgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChDb21wZW5zYXRpb25TZWFyY2hDb21wb25lbnQuSU5WQUxJREZMSUdIVEVOVEVSRUQpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRmxpZ2h0RW1wdHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlZyA9IC8oXihbQS1aYS16XXswLDJ9KVxcZHsyLDR9KSQvO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3QgPSByZWcudGVzdCh0aGlzLkZsaWdodE51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZsaWdodG51bVwiICsgdGVzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGVzdCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KENvbXBlbnNhdGlvblNlYXJjaENvbXBvbmVudC5JTlZBTElERkxJR0hURU5URVJFRCkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNGbGlnaHRFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGlmICh0aGlzLkZsaWdodE51bWJlci5sZW5ndGggPj0gMykge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoL15bYS16QS1aXSskLyk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB2YXIgdGVzdCA9IHJlZy50ZXN0KHRoaXMuRmxpZ2h0TnVtYmVyKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlmICh0ZXN0ID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLmlzRmxpZ2h0RW1wdHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KENvbXBlbnNhdGlvblNlYXJjaENvbXBvbmVudC5JTlZBTElERkxJR0hURU5URVJFRCkuc2hvdygpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLmlzRmxpZ2h0RW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMuaXNGbGlnaHRFbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzRmxpZ2h0RW1wdHkgPT0gZmFsc2UgJiYgdGhpcy5QYXNzZW5nZXJUeXBlICE9IFwiXCIpIHtcbiAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICBzZWFyY2hCdXR0b25FbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5QYXNzZW5nZXJUeXBlICE9IFwiXCIgJiYgdGhpcy5pc0ZsaWdodEVtcHR5ID09IGZhbHNlICYmIHRoaXMuRmxpZ2h0TnVtYmVyICE9IFwiXCIpIHtcbiAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc0J1dHRvbkVuYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzZWFyY2hQYXhCeUZsaWdodCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5GbGlnaHREYXRlID0gbW9tZW50KHRoaXMuY3VyRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgICAgdmFyIFBheFR5cGU7XG4gICAgICAgIHZhciBBZ2VudExvY2F0aW9uID0gdGhpcy5TZWFyY2hGaWVsZHMuTG9jYXRpb247XG4gICAgICAgIFxuICAgICAgICAvLyBpZiAodGhpcy5GbGlnaHROdW1iZXIuc3Vic3RyaW5nKDAsIDIpLnRvVXBwZXJDYXNlKCkgIT0gJ0NNJykgdGhpcy5GbGlnaHROdW1iZXIgPSBcIkNNXCIgKyB0aGlzLkZsaWdodE51bWJlcjtcbiAgICAgICAgbGV0IHJlZyA9IG5ldyBSZWdFeHAoJ15bMC05XSokJyk7XG4gICAgICAgIGxldCB0ZXN0ID0gcmVnLnRlc3QodGhpcy5GbGlnaHROdW1iZXIpO1xuICAgICAgICBpZiAodGVzdCA9PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlIxXCIpO1xuICAgICAgICAgICAgdGhpcy5GbGlnaHROdW1iZXIgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcImNhcnJpZXJDb2RlXCIsIFwiXCIpICsgdGhpcy5GbGlnaHROdW1iZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuRmxpZ2h0TnVtYmVyLnN1YnN0cigwLCAyKS50b1VwcGVyQ2FzZSgpICE9IFwiQ01cIikge1xuICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJJbnZhbGlkIENhcnJpZXIgQ29kZVwiKS5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLmlzRmxpZ2h0RW1wdHkgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5GbGlnaHROdW1iZXIgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuUGFzc2VuZ2VyVHlwZSA9PSBDb21wZW5zYXRpb25TZWFyY2hDb21wb25lbnQuQ09NUEVOU0FUSU9OUFJJTlRMSVNUUEFYKSB7XG4gICAgICAgICAgICAgICAgUGF4VHlwZSA9IHRoaXMuUGFzc2VuZ2VyVHlwZUxpc3QuUGFzc2VuZ2VyVHlwZUxpc3RUYWJsZS5maWx0ZXIobSA9PiBtLlZhbHVlLkRlc2NyaXB0aW9uID09IHRoaXMuUGFzc2VuZ2VyVHlwZSlbMF0uS2V5O1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcGVuc2F0aW9uTGlzdCh0aGlzLkZsaWdodERhdGUsIHRoaXMuRmxpZ2h0TnVtYmVyLCBBZ2VudExvY2F0aW9uLCBQYXhUeXBlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5QYXNzZW5nZXJUeXBlID09IENvbXBlbnNhdGlvblNlYXJjaENvbXBvbmVudC5DT01QRU5TQVRJT05MSVNUUEFYKSB7XG4gICAgICAgICAgICAgICAgUGF4VHlwZSA9IHRoaXMuUGFzc2VuZ2VyVHlwZUxpc3QuUGFzc2VuZ2VyVHlwZUxpc3RUYWJsZS5maWx0ZXIobSA9PiBtLlZhbHVlLkRlc2NyaXB0aW9uID09IHRoaXMuUGFzc2VuZ2VyVHlwZSlbMF0uS2V5O1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcGVuc2F0aW9uTGlzdCh0aGlzLkZsaWdodERhdGUsIHRoaXMuRmxpZ2h0TnVtYmVyLCBBZ2VudExvY2F0aW9uLCBcInJlYXNvbndpc2VnZXRcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFBheFR5cGUgPSB0aGlzLlBhc3NlbmdlclR5cGVMaXN0LlBhc3NlbmdlclR5cGVMaXN0VGFibGUuZmlsdGVyKG0gPT4gbS5WYWx1ZS5EZXNjcmlwdGlvbiA9PSB0aGlzLlBhc3NlbmdlclR5cGUpWzBdLktleTtcbiAgICAgICAgICAgICAgICB0aGlzLmdldFBhc3Nlbmdlckxpc3QodGhpcy5GbGlnaHREYXRlLCB0aGlzLkZsaWdodE51bWJlciwgQWdlbnRMb2NhdGlvbiwgUGF4VHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2VhcmNoUGF4KCk6IHZvaWQge1xuICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgvXlswLTldKyQvKTtcbiAgICAgICAgdmFyIHRlc3QgPSByZWcudGVzdCh0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkpO1xuICAgICAgICBpZiAodGVzdCA9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmlzRGlnaXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkubGVuZ3RoID09IDYpIHtcbiAgICAgICAgICAgIC8vIFRvYXN0Lm1ha2VUZXh0KFwiT3JkZXIgSWQgU2VhcmNoXCIpLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0UGFzc2VuZ2VyT3JkZXJEZXRhaWxzKHRoaXMuU2VhcmNoRmllbGRzLlNlYXJjaEFueSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5TZWFyY2hGaWVsZHMuU2VhcmNoQW55Lmxlbmd0aCA9PSAxMyAmJiB0aGlzLmlzRGlnaXQpIHtcbiAgICAgICAgICAgIC8vIFRvYXN0Lm1ha2VUZXh0KFwiRXRpY2tldCBTZWFyY2hcIikuc2hvdygpO1xuICAgICAgICAgICAgdGhpcy5nZXRQYXNzZW5nZXJFVEtURGV0YWlscyh0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuU2VhcmNoRmllbGRzLlNlYXJjaEFueS5sZW5ndGggPj0gNyAmJiB0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkubGVuZ3RoIDw9IDE4KSB7XG4gICAgICAgICAgICAvLyBUb2FzdC5tYWtlVGV4dChcIkZRVFYgU2VhcmNoXCIpLnNob3coKTtcbiAgICAgICAgICAgIGxldCBmcXR2bnVtMSA9IHRoaXMuU2VhcmNoRmllbGRzLlNlYXJjaEFueS50b1N0cmluZygpLnN1YnN0cigwLCAyKTtcbiAgICAgICAgICAgIGxldCBmcXR2bnVtMiA9IHRoaXMuU2VhcmNoRmllbGRzLlNlYXJjaEFueS50b1N0cmluZygpLnN1YnN0cigyKTtcbiAgICAgICAgICAgIGxldCBmcXR2bnVtMyA9IGZxdHZudW0xICsgXCIlMkZcIiArIGZxdHZudW0yO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJGUVRWXCIgKyBmcXR2bnVtMyk7XG4gICAgICAgICAgICB0aGlzLmdldFBhc3NlbmdlckZRVFZEZXRhaWxzKGZxdHZudW0zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRQYXNzZW5nZXJMaXN0KGZsaWdodERhdGUsIGZsaWdodE51bWJlciwgbG9jYXRpb24sIFBheFR5cGUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgQ29tcGVuc2F0aW9uRGV0YWlscyBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBTdGFydCBEYXRlIFRpbWUgOiAnICsgc0RhdGUpO1xuICAgICAgICAgICAgdGhpcy5fc2VydmljZS5nZXRQYXNzZW5nZXJUeXBlTGlzdChmbGlnaHREYXRlLCBmbGlnaHROdW1iZXIsIGxvY2F0aW9uLCBQYXhUeXBlKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuQmFkUmVxdWVzdCAhPSA0MDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuRmxpZ2h0U2VnbWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBDb21wYW5zYXRpb25EZXRhaWxzOiBhbnkgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLnNldENvbXBlbnNhdGlvbkxpc3QoQ29tcGFuc2F0aW9uRGV0YWlscyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZsaWdodFN0YXR1cygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnMubWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChkYXRhLmVyck1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZG50IGZpbmQgaW5mb3JtYXRpb25cIiArIGVycik7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgQ29tcGVuc2F0aW9uRGV0YWlscyBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgQ29tcGVuc2F0aW9uRGV0YWlscyBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldENvbXBlbnNhdGlvbkxpc3QoZGF0ZSwgZmxpZ2h0LCBsb2NhdGlvbiwgcGF4dHlwZSk6IHZvaWQge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJUeXBlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLmdldENvbXBlbnNhdGlvblBheExpc3QoZGF0ZSwgZmxpZ2h0LCBsb2NhdGlvbiwgcGF4dHlwZSkuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuUmVzdWx0cykge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuUmVzdWx0c1swXS5GbGlnaHRTZWdtZW50c1swXS5QYXNzZW5nZXJzID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KENvbXBlbnNhdGlvblNlYXJjaENvbXBvbmVudC5EQVRBTk9URk9VTkRUT0FTVCkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgQ29tcGFuc2F0aW9uRGV0YWlsczogYW55ID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmxpZ2h0U3RhdHVzRm9yQ29tcGVuc2F0aW9uTGlzdChDb21wYW5zYXRpb25EZXRhaWxzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLkVycm9yc1swXS5NZXNzYWdlID09IFwiRGF0YSBub3QgZm91bmRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJObyBwYXNzZW5nZXIgZm91bmRcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvcnNbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvblwiICsgZXJyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJUeXBlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJUeXBlIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmxpZ2h0U3RhdHVzRm9yQ29tcGVuc2F0aW9uTGlzdChDb21wUGF4KTogdm9pZCB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBDb21wZW5zYXRpb25EZXRhaWxzIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHZhciBkYXRlID0gdGhpcy5GbGlnaHREYXRlO1xuICAgICAgICAgICAgdmFyIGZsaWdodG51bWJlciA9IHRoaXMuRmxpZ2h0TnVtYmVyO1xuICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gdGhpcy5TZWFyY2hGaWVsZHMuTG9jYXRpb247XG4gICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0RmxpZ2h0SGVhZGVySW5mbyhudWxsKTtcbiAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRDb21wZW5zYXRpb25MaXN0KG51bGwpO1xuICAgICAgICAgICAgdGhpcy5fc2VydmljZS5zdGF0dXMoZGF0ZSwgZmxpZ2h0bnVtYmVyLGxvY2F0aW9uKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5CYWRSZXF1ZXN0ICE9IDQwMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5GbGlnaHRzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGF0dXM6IGFueSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOMVwiICsgSlNPTi5zdHJpbmdpZnkoc3RhdHVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0Q29tcGVuc2F0aW9uRmxpZ2h0RGV0YWlscyhzdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZsaWdodFN0YXR1cyA9IENvbnZlcnRlcnMuY29udmVydFRvRmxpZ2h0SGVhZGVySW5mbyhzdGF0dXMsQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJTZWFyY2hMb2NhdGlvblwiLFwiXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRGbGlnaHRIZWFkZXJJbmZvKGZsaWdodFN0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImJlZm9yZSBmbGlnaHQgY29udmVydG9yXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJTZWFyY2hMb2NhdGlvblwiLFwiXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBDb21wYXhMaXN0ID0gQ29udmVydGVycy5jb252ZXJ0b0NvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QoQ29tcFBheCwgc3RhdHVzLEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiU2VhcmNoTG9jYXRpb25cIixcIlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOIDFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihDb21wYXhMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRDb21wZW5zYXRpb25MaXN0KENvbXBheExpc3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUGFzc2VuZ2VyVHlwZSA9PSBDb21wZW5zYXRpb25TZWFyY2hDb21wb25lbnQuQ09NUEVOU0FUSU9OUFJJTlRMSVNUUEFYKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXZpYWdhdGV0b0NvbXBlbnNhdGlvblByaW50TGlzdHdpdGh0YWIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXZpYWdhdGV0b0NvbXBlbnNhdGlvbkxpc3R3aXRodGFiKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxldCBzdGF0dXM6IGFueSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIklOMVwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLnNldENvbXBlbnNhdGlvbkZsaWdodERldGFpbHMoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImJlZm9yZSBmbGlnaHQgY29udmVydG9yXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJTZWFyY2hMb2NhdGlvblwiLFwiXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBDb21wYXhMaXN0ID0gQ29udmVydGVycy5jb252ZXJ0b0NvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QoQ29tcFBheCwgZGF0YSwgQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJTZWFyY2hMb2NhdGlvblwiLFwiXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRDb21wZW5zYXRpb25MaXN0KENvbXBheExpc3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJTiAyXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIoQ29tcGF4TGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5QYXNzZW5nZXJUeXBlID09IENvbXBlbnNhdGlvblNlYXJjaENvbXBvbmVudC5DT01QRU5TQVRJT05QUklOVExJU1RQQVgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlhZ2F0ZXRvQ29tcGVuc2F0aW9uUHJpbnRMaXN0d2l0aHRhYigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlhZ2F0ZXRvQ29tcGVuc2F0aW9uTGlzdHdpdGh0YWIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChkYXRhLmVyck1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ291bGRudCBmaW5kIGluZm9ybWF0aW9uXCIgKyBlcnIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBDb21wZW5zYXRpb25EZXRhaWxzIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBDb21wZW5zYXRpb25EZXRhaWxzIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICBmbGlnaHRTdGF0dXMoKTogdm9pZCB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBDb21wZW5zYXRpb25EZXRhaWxzIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHZhciBkYXRlID0gdGhpcy5GbGlnaHREYXRlO1xuICAgICAgICAgICAgdmFyIGZsaWdodG51bWJlciA9IHRoaXMuRmxpZ2h0TnVtYmVyO1xuICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gdGhpcy5TZWFyY2hGaWVsZHMuTG9jYXRpb247XG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLnN0YXR1cyhkYXRlLCBmbGlnaHRudW1iZXIsbG9jYXRpb24pLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLkZsaWdodHMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3RhdHVzOiBhbnkgPSBkYXRhXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRDb21wZW5zYXRpb25GbGlnaHREZXRhaWxzKHN0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGV0b0NvbXBlbnNhdGlvblNlYXJjaFJlc3VsdCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0Q29tcGVuc2F0aW9uRmxpZ2h0RGV0YWlscyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZXRvQ29tcGVuc2F0aW9uU2VhcmNoUmVzdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KENvbXBlbnNhdGlvblNlYXJjaENvbXBvbmVudC5GTElHSFROT1RGT1VORFRPQVNUKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvblwiICsgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgQ29tcGVuc2F0aW9uRGV0YWlscyBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgQ29tcGVuc2F0aW9uRGV0YWlscyBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgZ2V0UGFzc2VuZ2VyT3JkZXJEZXRhaWxzKG9yZGVySUQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJPcmRlckRldGFpbHMgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcbiAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UuZ2V0UGFzc2VuZ2VyQnlPcmRlcihvcmRlcklEKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLkJhZFJlcXVlc3QgPT0gNDAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIjEgYmFkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5FcnJvck1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLkZsaWdodFNlZ21lbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IENvbXBhbnNhdGlvbkRldGFpbHM6IGFueSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIoQ29tcGFuc2F0aW9uRGV0YWlscyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGV0IENvbXBlbnNhdGlvblBhc3NlbmdlcnM6IGFueSA9IENvbnZlcnRlcnMuQ29udmVydFRvQ29tcFBheFRlbXBsYXRlQnlPcmRlcklkKENvbXBhbnNhdGlvbkRldGFpbHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKENvbXBlbnNhdGlvblBhc3NlbmdlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRDb21wZW5zYXRpb25PcmRlckRlYXRpbHMoQ29tcGFuc2F0aW9uRGV0YWlscyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZXRvQ29tcGVuc2F0aW9uU2VsZWN0U2VnbWVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJPcmRlckRldGFpbHMgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlRGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJPcmRlckRldGFpbHMgU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlRGF0ZSkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoQ29tcGVuc2F0aW9uU2VhcmNoQ29tcG9uZW50LlJFU0VSVkFUSU9OTk9URk9VTkRUT0FTVCkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvblwiICsgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBnZXRQYXNzZW5nZXJFVEtURGV0YWlscyhldGlja2V0TnVtYmVyOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgR2V0UGFzc2VuZ2VyRVRLVERldGFpbHMgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcbiAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UuZ2V0RVRLVChldGlja2V0TnVtYmVyKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLkZsaWdodFNlZ21lbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgQ29tcGFuc2F0aW9uRGV0YWlsczogYW55ID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKENvbXBhbnNhdGlvbkRldGFpbHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLnNldENvbXBlbnNhdGlvbk9yZGVyRGVhdGlscyhDb21wYW5zYXRpb25EZXRhaWxzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZXRvQ29tcGVuc2F0aW9uU2VsZWN0U2VnbWVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgR2V0UGFzc2VuZ2VyT3JkZXJEZXRhaWxzIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJPcmRlckRldGFpbHMgU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlRGF0ZSkpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KENvbXBlbnNhdGlvblNlYXJjaENvbXBvbmVudC5SRVNFUlZBVElPTk5PVEZPVU5EVE9BU1QpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ291bGRudCBmaW5kIGluZm9ybWF0aW9uXCIgKyBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGdldFBhc3NlbmdlckZRVFZEZXRhaWxzKGZxdHZOdW1iZXI6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJGUVRWRGV0YWlscyBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBTdGFydCBEYXRlIFRpbWUgOiAnICsgc0RhdGUpO1xuICAgICAgICAgICAgdGhpcy5fc2VydmljZS5nZXRGUVRWKGZxdHZOdW1iZXIpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGUVRWXCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLkJhZFJlcXVlc3QgPT0gNDAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChkYXRhLmVyck1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGEuT3JkZXJGUVRWU3RhdHVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBDb21wYW5zYXRpb25GUVRWRGV0YWlsczogQXJyYXk8YW55PiA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5PcmRlckZRVFZTdGF0dXMuZm9yRWFjaCgoc2VnRGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VnRGF0YS5GbGlnaHROdW1iZXIgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb21wYW5zYXRpb25GUVRWRGV0YWlscy5wdXNoKHNlZ0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZihkYXRhLk9yZGVyRlFUVlN0YXR1cylcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDb21wYW5zYXRpb25GUVRWRGV0YWlscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IENvbXBlbnNhdGlvbkZRVFZTdGF0dXM6IGFueSA9IENvbnZlcnRlcnMuQ29udmVydFRvQ29tcFBheFRlbXBsYXRlQnlGUVRWKENvbXBhbnNhdGlvbkZRVFZEZXRhaWxzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihDb21wZW5zYXRpb25GUVRWU3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0Q29tcGVuc2F0aW9uRlFUVlN0YXR1c0RldGFpbHMoQ29tcGVuc2F0aW9uRlFUVlN0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZXRvQ29tcGVuc2F0aW9uRlFUVkxpc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJTZWdtZW50cyBub3QgYXZhaWxhYmxlXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KENvbXBlbnNhdGlvblNlYXJjaENvbXBvbmVudC5GUVRWTk9URk9VTkRUT0FTVCkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJGUVRWRGV0YWlscyBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJGUVRWRGV0YWlscyBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChlcnIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ291bGRudCBmaW5kIGluZm9ybWF0aW9uXCIgKyBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICBuYXZpZ2F0ZXRvQ29tcGVuc2F0aW9uU2VhcmNoUmVzdWx0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY29tcGVuc2F0aW9ucmVzdWx0XCJdLCB7XG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgfSwgcXVlcnlQYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBcImRhdGFcIjogdGhpcy5QYXNzZW5nZXJUeXBlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfVxuICAgIG5hdmlnYXRldG9Db21wZW5zYXRpb25TZWxlY3RTZWdtZW50KCkge1xuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY29tcGVuc2F0aW9uc2VsZWN0c2VnbWVudFwiXSwge1xuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH0sIHF1ZXJ5UGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgXCJkYXRhXCI6IHRoaXMuU2VhcmNoRmllbGRzLlNlYXJjaEFueVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbmF2aWdhdGV0b0NvbXBlbnNhdGlvbkZRVFZMaXN0KCkge1xuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY29tcGVuc2F0aW9uZnF0dlwiXSwge1xuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH0sIHF1ZXJ5UGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgXCJkYXRhXCI6IHRoaXMuU2VhcmNoRmllbGRzLlNlYXJjaEFueVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbmF2aWFnYXRldG9Db21wZW5zYXRpb25MaXN0d2l0aHRhYigpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImNvbXBlbnNhdGlvbnNlYXJjaHJlc3VsdHdpdGh0YWJcIl0sIHtcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBuYXZpYWdhdGV0b0NvbXBlbnNhdGlvblByaW50TGlzdHdpdGh0YWIoKSB7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJjb21wZW5zYXRpb25wcmludHNjcmVlblwiXSwge1xuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG5hdmlnYXRlVG9Ib21lKCkge1xuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiaG9tZVwiXSwge1xuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG5hdmlnYXRlVG9TZXR0aW5nKCkge1xuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wic2V0dGluZ1wiXSwge1xuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG5hdmlnYXRlVG9TZWFyY2goKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQ2hlY2tpbkRpc2FibGVkID09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZWFyY2hcIl0sIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBuYXZpZ2F0ZVRvRGVwYXJ0dXJlcygpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNHYXRlRGlzYWJsZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImRlcGFydGhvbWVcIl0sIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcjogYW55KSB7XG4gICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci50b1N0cmluZygpO1xuICAgICAgICBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJTZXNzaW9uVGltZW91dFwiKSA+IC0xKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJTZXNzaW9uIFRpbWUgT3V0XCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGJlZW4gdGltZSBvdXRcIixcbiAgICAgICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIlwiXSwge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChlcnJvck1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIl19