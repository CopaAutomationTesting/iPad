"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var router_2 = require("nativescript-angular/router");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var page_1 = require("ui/page");
var dialogs = require("ui/dialogs");
//external modules and plugins
var ApplicationSettings = require("application-settings");
var Toast = require("nativescript-toast");
var nativescript_blinkid_1 = require("nativescript-blinkid");
var moment = require("moment");
//app references
var country_modal_1 = require("../../components/country/country-modal");
var index_1 = require("../../shared/interface/index");
var index_2 = require("../../shared/services/index");
var index_3 = require("../../shared/model/index");
var index_4 = require("../../shared/utils/index");
var date_picker_modal_1 = require("../../components/date-picker/date-picker-modal");
var app_constants_1 = require("../../app.constants");
var app_executiontime_1 = require("../../app.executiontime");
var platform_1 = require("platform");
var timeOut_service_1 = require("../../shared/services/timeOut.service");
var licenseKeys = ApplicationSettings.getString("licenseKey", '');
console.log(licenseKeys);
var SearchComponent = /** @class */ (function () {
    function SearchComponent(_checkin, _search, _homepage, page, routerExtensions, _timeoutService, activatedRouter, router, location, _dataService, _modalService, vcRef, apisDocument, _shared, _service, departureService) {
        var _this = this;
        this._checkin = _checkin;
        this._search = _search;
        this._homepage = _homepage;
        this.page = page;
        this.routerExtensions = routerExtensions;
        this._timeoutService = _timeoutService;
        this.activatedRouter = activatedRouter;
        this.router = router;
        this.location = location;
        this._dataService = _dataService;
        this._modalService = _modalService;
        this.vcRef = vcRef;
        this.apisDocument = apisDocument;
        this._shared = _shared;
        this._service = _service;
        this.departureService = departureService;
        this.cityList = [];
        this.filterCityList = [];
        this.PassengerList = [];
        this.PassengerListNew = [];
        this.FlightDetails = new index_3.Flight();
        this.SearchFields = new index_3.Search();
        this.ProfileArray = new index_1.AccontProfileModel.AccountProfileTemplate();
        this.clearclicked = false;
        this.PassengerDetailsFlight = [];
        this.PassengerstringArray = [];
        this.filterCityCode = [];
        this.selectedIndex = 1;
        this.isAnySearchEmpty = false;
        this.isFlightEmpty = false;
        this.isLastNameEmpty = false;
        this.isButtonEnabled = false;
        this.isValid = false;
        this.isScanned = false;
        this.isCompensationEnabled = false;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.ETKTNumber = "";
        this.mCallback = (function (result) {
            if (result) {
                var c = moment(result, "DD MM YYYY HH:mm ZZ").format("DD MMMM YYYY");
                _this.SearchFields.FlightDate = c;
            }
        });
        this.isError = false;
        this.errorMessage = "";
        this.SearchFields.FlightDate = moment().format("DD MMMM YYYY");
        this.curDate = moment().toDate();
        this.loaderProgress = new index_1.LoaderProgress();
        var self = this;
        this.items = [];
        this.selectedIndex = 0;
        this.startDate = new Date();
        this.CountryList = [];
        this.CountryItems = [];
        this.activatedRouter.queryParams.subscribe(function (params) {
            if (params["data"] != null && params["data"] != "" && params["data"] != "undefined") {
                _this.ProfileArray = JSON.parse(params["data"]);
                _this.SearchFields.Location = _this.ProfileArray.PointOfSales[0].AirportCode;
                _this.userdetails = ApplicationSettings.getString("userdetails", "");
            }
        });
    }
    SearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        for (var i = 0; i < 5; i++) {
            this.items.push("data item " + i);
        }
        this.location.subscribe(function () {
            _this.selectedIndex = 1;
        });
        this.cityList = this._shared.getCityList();
        this.cityList.forEach(function (data, index) {
            _this.filterCityCode.push(data.Code + "-" + data.Name);
        });
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        var Location = ApplicationSettings.getString("userdetails", "");
        this.SearchFields.Location = Location.substr(0, 3);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled");
        this.selectedIndex = 1;
        this.loaderProgress.initLoader(this.pageCont);
        this.GetCountry();
        this.GetFQTV();
        this._shared.GetStartupTable();
        this._shared.SetBagTag(null);
        console.dir(this._shared.GetStartupTable());
        console.log(this._timeoutService.getTimer());
        var label = this.pageCont.nativeElement;
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();
        });
        this.getDocumentType();
    };
    SearchComponent.prototype.getDocumentType = function () {
        var _this = this;
        console.log("doctype");
        this._dataService.documentType().subscribe(function (data) {
            _this.AdditionalDocuments = data.ReferenceInfo[0].AdcDocumentsToAppend;
            console.log("doctype" + _this.AdditionalDocuments);
            _this._shared.SetAdditionalDocuments(_this.AdditionalDocuments);
        }, function (err) {
            _this.handleServiceError(err);
            console.log(err);
        });
    };
    SearchComponent.prototype.displayCityListActionDialog = function () {
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
                console.log("out" + result);
            }
        });
    };
    SearchComponent.prototype.GetCountry = function () {
        var _this = this;
        try {
            var sDate = new Date();
            console.log('Get Countries Service --------------- Start Date Time : ' + sDate);
            this._service.GetCountries()
                .subscribe(function (data) {
                _this.CountryDetails = data;
                _this._shared.SetCountry(_this.CountryDetails);
            }, function (err) {
                _this.handleServiceError(err);
                console.log(err);
            });
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            var eDate = new Date();
            console.log('Get Countries Service --------------- End Date Time : ' + eDate);
            console.log('Get Countries Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    SearchComponent.prototype.GetFQTV = function () {
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
    SearchComponent.prototype.GetOrderDetails = function (id, etktNumber) {
        var _this = this;
        if (etktNumber === void 0) { etktNumber = ""; }
        this.loaderProgress.showLoader();
        try {
            var sDate = new Date();
            console.log('Get Passenger Service --------------- Start Date Time : ' + sDate);
            this._service.GetPassenger(id)
                .subscribe(function (data) {
                console.log(data);
                if (data.ID != null) {
                    if (data.TicketingStatus != "Not Ticketed" && data.TicketingStatus != "Partially Ticketed" && data.IsOutOfSyncTicket != true) {
                        _this._shared.SetPassenger(data);
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
                        console.dir(_this._shared.GetPassenger().Passengers[0].Documents);
                        // this._shared.GetPassenger().Passengers.forEach((passInfo, passIndex) => {
                        //     if (passInfo.PassengerTypeCode == "INF") {
                        //         let passengers: any = this._shared.GetPassenger().Passengers.filter(m => m.GroupedGivenName == passInfo.GroupedGivenName);
                        //         passengers.forEach((pass, index) => {
                        //             if (pass.PassengerTypeCode != "INF") {
                        //                 let infRPH = this._shared.GetPassenger().Passengers.filter(m => m.PassengerTypeCode == "INF")[0].RPH
                        //                 this._shared.GetPassenger().Passengers.filter(m => m.Firstname == pass.Firstname && m.Lastname == pass.Lastname)[0].AssociatedInfantRPH = infRPH
                        //             }
                        //             else {
                        //                 let adultRPH = this._shared.GetPassenger().Passengers.filter(m => m.PassengerTypeCode != "INF")[0].RPH
                        //                 this._shared.GetPassenger().Passengers.filter(m => m.Firstname == pass.Firstname && m.Lastname == pass.Lastname)[0].AssociatedAdultRPH = adultRPH
                        //             }
                        //         });
                        //     }
                        // })
                        // let scTable:any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
                        var isErrorOccured = false;
                        console.log(_this._shared.GetStartupTable().Tables.SecurityCodeTable);
                        var PassengerArray_1 = index_4.Converters.ConvertToFlightWithPaxTemplate(_this._shared.GetPassenger(), null, _this._shared.GetStartupTable().Tables.SecurityCodeTable, etktNumber);
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
                            //let departureCity:string=
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
                                if (!isErrorOccured) {
                                    _this._checkin.BookingCountDisplay(departureDate, flightnumber, city)
                                        .subscribe(function (data) {
                                        var inventory = data;
                                        SegEle.inven = index_4.Converters.ConvertToInventory(inventory);
                                    }, function (err) {
                                        console.log(err);
                                        isErrorOccured = true;
                                        _this.loaderProgress.hideLoader();
                                        _this.handleServiceError(err);
                                    });
                                    //Inbound
                                    _this._checkin.InBound(departureDate, flightnumber, city)
                                        .subscribe(function (data) {
                                        var inBound = data;
                                        SegEle.inbound = index_4.Converters.ConvertToInBound(inBound);
                                    }, function (err) {
                                        console.log(err);
                                        isErrorOccured = true;
                                        _this.loaderProgress.hideLoader();
                                        _this.handleServiceError(err);
                                    });
                                    //Outbound
                                    _this._checkin.OutBound(departureDate, flightnumber, destination)
                                        .subscribe(function (data) {
                                        var OutBound = data;
                                        SegEle.outbound = index_4.Converters.ConvertToOutBound(OutBound);
                                    }, function (err) {
                                        console.log(err);
                                        isErrorOccured = true;
                                        _this.loaderProgress.hideLoader();
                                        _this.handleServiceError(err);
                                    });
                                    //status
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
                                                var multiplePassenger_1 = 0;
                                                _this._shared.GetPassenger().Passengers.forEach(function (pass, index) {
                                                    if (_this._shared.GetAPISDocument() != null) {
                                                        if (_this._shared.GetAPISDocument().Firstname.replace(" ", "") == _this.SuffixCheck(pass.Firstname) && _this._shared.GetAPISDocument().Surname.replace(" ", "") == pass.Lastname) {
                                                            multiplePassenger_1++;
                                                        }
                                                    }
                                                });
                                                if (multiplePassenger_1 > 1) {
                                                    Toast.makeText("Multiple match found. Scanned data is ignored").show();
                                                    _this._shared.SetAPISDocument(null);
                                                }
                                                else {
                                                    _this.loaderProgress.hideLoader();
                                                    _this.navigateToCheckin(id);
                                                }
                                            }
                                        }
                                        else {
                                            Toast.makeText(data.Warnings[0].Message).show();
                                            var passengerLength = PassengerArray_1.Segment.length - 1;
                                            if (passengerLength == SegInndex) {
                                                _this._shared.SetBagTag(null);
                                                _this._shared.SetSegmentDetail(PassengerArray_1);
                                                var multiplePassenger_2 = 0;
                                                _this._shared.GetPassenger().Passengers.forEach(function (pass, index) {
                                                    if (_this._shared.GetAPISDocument() != null) {
                                                        if (_this._shared.GetAPISDocument().Firstname.replace(" ", "") == _this.SuffixCheck(pass.Firstname) && _this._shared.GetAPISDocument().Surname.replace(" ", "") == pass.Lastname) {
                                                            multiplePassenger_2++;
                                                        }
                                                    }
                                                });
                                                if (multiplePassenger_2 > 1) {
                                                    Toast.makeText("Multiple match found. Scanned data is ignored").show();
                                                    _this._shared.SetAPISDocument(null);
                                                }
                                                else {
                                                    _this.loaderProgress.hideLoader();
                                                    _this.navigateToCheckin(id);
                                                }
                                            }
                                        }
                                    }, function (err) {
                                        console.log(err);
                                        isErrorOccured = true;
                                        _this.loaderProgress.hideLoader();
                                        _this.handleServiceError(err);
                                    });
                                }
                                else {
                                    _this.loaderProgress.hideLoader();
                                }
                            });
                            // this._dataService.GetBaggage(id).subscribe((data) => {
                            //     this._shared.SetBaggagecatalog(data);
                            //     console.log("err")
                            // },
                            //     err => {
                            //         console.log(err)
                            //         let error: any = { "Errors": [{ "Message": err }], "Success": false }
                            //         this._shared.SetBaggagecatalog(error);
                            //     });
                            //Tier
                            // this._dataService.Tier(setdepartureDate, setflightnumber, setcity)
                            //     .subscribe((data) => {
                            //         this._shared.SetBagTag(null);
                            //         let tier: any = data;
                            //         this._shared.SetTier(tier);
                            //         this.loaderProgress.hideLoader();
                            //         this._shared.SetSegmentDetail(PassengerArray);
                            //         let multiplePassenger:number = 0;
                            //         this._shared.GetPassenger().Passengers.forEach((pass,index)=>{
                            //             if(this._shared.GetAPISDocument()!=null)
                            //             {
                            //                 if (this._shared.GetAPISDocument().Firstname.replace(" ", "") == this.SuffixCheck(pass.Firstname) && this._shared.GetAPISDocument().Surname.replace(" ", "") == pass.Lastname) {
                            //                     multiplePassenger++;
                            //                 }
                            //             }
                            //         });
                            //         if (multiplePassenger > 1) {
                            //             Toast.makeText("Multiple match found. Scanned data is ignored").show();
                            //             this._shared.SetAPISDocument(null);
                            //         }
                            //         else
                            //         {
                            //             this.navigateToCheckin(id);
                            //         }
                            //     },
                            //     err => {
                            //         console.log(err)
                            //         this.navigateToCheckin(id);
                            //         this._shared.SetSegmentDetail(PassengerArray);
                            //         this.handleServiceError(err);
                            //         this.loaderProgress.hideLoader();
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
                    if (data.Errors != null) {
                        data.Errors.forEach(function (error, index) {
                            Toast.makeText(error.Message).show();
                        });
                    }
                    else if (data.Segments != null && data.Segments.length > 0) {
                        Toast.makeText("Not able to process - go to counter").show();
                    }
                    else {
                        Toast.makeText("No reservations are found").show();
                    }
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
    SearchComponent.prototype.SuffixCheck = function (firstName) {
        var suffixList = firstName.split(this._shared.GetAPISDocument().Firstname.replace(" ", ""));
        var givenName = '';
        if (suffixList.length > 1) {
            givenName = this._shared.GetAPISDocument().Firstname.replace(" ", "");
        }
        else {
            givenName = firstName;
        }
        return givenName;
    };
    SearchComponent.prototype.GetPaxbyEticket = function (id) {
        var _this = this;
        this.loaderProgress.showLoader();
        this.ETKTNumber = id.toString();
        try {
            var sDate = new Date();
            console.log('Get SearchPaxByEticket Service --------------- Start Date Time : ' + sDate);
            this._search.SearchPaxByEticket(id)
                .subscribe(function (data) {
                _this._shared.SetPassengerETicket(data);
                console.dir(data);
                if (data.ID != null && data.Segments.length > 0) {
                    _this.GetOrderDetails(data.ID, _this.ETKTNumber);
                }
                else {
                    // if (data.Segments.length>0){
                    Toast.makeText("unable to process - Go to counter").show();
                    // }else{
                    // Toast.makeText("No reservations are found").show();                            
                    // }
                    _this.loaderProgress.hideLoader();
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
            console.log('Get SearchPaxByEticket Service --------------- End Date Time : ' + eDate);
            console.log('Get SearchPaxByEticket Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    SearchComponent.prototype.search = function () {
        ApplicationSettings.setString("searchdata", JSON.stringify(this.SearchFields));
        this.ETKTNumber = "";
        if (this.SearchFields.FlightNo.trim() != "" && this.SearchFields.LastName.trim() != "") {
            if (this.SearchFields.FlightNo.substring(0, 2).toUpperCase() != 'CM')
                this.SearchFields.FlightNo = "CM" + this.SearchFields.FlightNo;
            this.getPaxbyFlight(this.SearchFields.LastName, moment(this.startDate, "MM/dd/yy").format("YYYY-MM-DD"), this.SearchFields.FlightNo, "PTY");
        }
        else {
            Toast.makeText("Please enter Search strings").show();
        }
    };
    SearchComponent.prototype.SearchAny = function () {
        if (this.SearchFields.SearchAny.trim() != "" || this.isAnySearchEmpty == false) {
            if (this.SearchFields.SearchAny.length == 6 || this.SearchFields.SearchAny.length > 0 || this.SearchFields.SearchAny.length == 13 || this.SearchFields.SearchAny.length == 11) {
                if (this.SearchFields.SearchAny.length == 6) {
                    this._shared.SetAPISDocument(null);
                    this._shared.SetScanAPISDocument(null);
                    this.ETKTNumber = "";
                    this.GetOrderDetails(this.SearchFields.SearchAny);
                }
                else if (this.SearchFields.SearchAny.length == 13) {
                    var reg = new RegExp('^[a-zA-Z]+$');
                    if (reg.test(this.SearchFields.SearchAny.toString().substr(0, 1))) {
                        var fqtvnum1 = this.SearchFields.SearchAny.toString().substr(0, 2);
                        var fqtvnum2 = this.SearchFields.SearchAny.toString().substr(2);
                        var fqtvnum3 = void 0;
                        if (fqtvnum2.split('/').length > 1) {
                            fqtvnum3 = fqtvnum1 + "%2F" + fqtvnum2.split('/')[1];
                        }
                        else {
                            fqtvnum3 = fqtvnum1 + "%2F" + fqtvnum2.split('/')[0];
                        }
                        console.log("fqtv" + fqtvnum3);
                        // this.SearchFields.SearchAny = fqtvnum3;
                        this.getPaxbyFQTVID(fqtvnum3);
                    }
                    else {
                        this._shared.SetPassengerETicket(null);
                        this.GetPaxbyEticket(this.SearchFields.SearchAny);
                    }
                }
                // else if (this.SearchFields.SearchAny.length == 12) {
                //     this.loaderProgress.showLoader();
                //     this.ETKTNumber="";
                //     let fqtvnum1 = this.SearchFields.SearchAny.toString().substr(0, 2);
                //     let fqtvnum2 = this.SearchFields.SearchAny.toString().substr(2);
                //     let fqtvnum3 = fqtvnum1 + "%2F" + fqtvnum2.split('/')[1];
                //     console.log("fqtv" + fqtvnum3);
                //     this.SearchFields.SearchAny = fqtvnum3;
                //     this.getPaxbyFQTVID(this.SearchFields.SearchAny);
                //     // this.navigateToFQTV(this.SearchFields.SearchAny);
                // }
                else {
                    this.loaderProgress.showLoader();
                    var reg = new RegExp('^[a-zA-Z]+$');
                    if (reg.test(this.SearchFields.SearchAny.toString().substr(0, 1))) {
                        var fqtvnum1 = this.SearchFields.SearchAny.toString().substr(0, 2);
                        var fqtvnum2 = this.SearchFields.SearchAny.toString().substr(2);
                        var fqtvnum3 = void 0;
                        if (fqtvnum2.split('/').length > 1) {
                            fqtvnum3 = fqtvnum1 + "%2F" + fqtvnum2.split('/')[1];
                        }
                        else {
                            fqtvnum3 = fqtvnum1 + "%2F" + fqtvnum2.split('/')[0];
                        }
                        console.log("fqtv" + fqtvnum3);
                        // this.SearchFields.SearchAny = fqtvnum3;
                        this.getPaxbyFQTVID(fqtvnum3);
                    }
                    else {
                        this.isAnySearchEmpty = true;
                        this.loaderProgress.hideLoader();
                        Toast.makeText("Please enter valid input").show();
                    }
                }
            }
            else {
                this.isAnySearchEmpty = true;
                Toast.makeText("Please enter valid input").show();
            }
        }
    };
    SearchComponent.prototype.Scan = function (type) {
        var _this = this;
        if (platform_1.isIOS) {
            console.log("inside SCAN");
            var lastname_1 = "";
            this._shared.SetAPISDocument(null);
            this._shared.SetScanAPISDocument(null);
            // let licenseKey = ApplicationSettings.getString("licenseKey",'');
            var licenseKey = "sRwAAAEjY29tLmNvcGFhaXIuY3NzbW9iaWxlYWlycG9ydHRhYmxldHM4x9IvBwHUD7JcC/TkHlqBmTm5fPOxEbRRIjDctpKRVPpo+4n3YWfd2eH32UCQ1GQsDGDiDQ2nNoFaUYunmhI88WJeuFd/gd8JOxoxrUXvNbPSqdZti7O6p3VBRal0NxV5TZpMHEXG6r/1q6gHy4Ub3+MxcMb332cMYs2d52hJPdWu2YuHQryFVVmSWR3x33Nir9euOI1yjgf9ezlRACgxt4BkZamn3Dr/WqCjJ3mhOJlQev8Z5fAY4UO6Y5mzqhHyfqztMZcjuQ==";
            console.log(licenseKey);
            if (type == "Passport") {
                nativescript_blinkid_1.didTapScan(type, licenseKey).then(function (mrtddata) {
                    console.dir(mrtddata);
                    console.dir(mrtddata.mrzText());
                    //mrtddata.documentCode()+mrtddata.nationality()+mrtddata
                    console.log(mrtddata.documentCode().split('<')[0]);
                    console.log(mrtddata.documentCode().split(';')[0]);
                    _this.isScanned = true;
                    var docType;
                    _this.SearchFields.LastName = '';
                    if (mrtddata.documentCode().split('<')[0].length > 0) {
                        docType = mrtddata.documentCode().split('<')[0];
                    }
                    else if (mrtddata.documentCode().split(';').length > 0) {
                        docType = mrtddata.documentCode().split(';')[0];
                    }
                    if (docType.substr(0, 1) == "P") {
                        lastname_1 = mrtddata.primaryId();
                        _this.apisDocument.Surname = mrtddata.primaryId();
                        _this.apisDocument.Firstname = mrtddata.secondaryId();
                        _this.apisDocument.DocHolderNationality = mrtddata.nationality();
                        _this.apisDocument.BirthDate = moment(mrtddata.dateOfBirth().split('/')[1] + "/" + mrtddata.dateOfBirth().split('/')[0] + "/" + mrtddata.dateOfBirth().split('/')[2]).format("MM/DD/YYYY");
                        _this.apisDocument.ExpireDate = moment(mrtddata.dateOfExpiry().split('/')[1] + "/" + mrtddata.dateOfExpiry().split('/')[0] + "/" + mrtddata.dateOfExpiry().split('/')[2]).format("MM/DD/YYYY");
                        // if(this.CountryDetails.Collection.filter(m =>m.CountryCode==mrtddata.issuer().substr(0, 2)))
                        _this.apisDocument.DocIssueCountry = mrtddata.issuer(); //.substr(0, 2);
                        _this.apisDocument.CountryOfResidence = null; //.substr(0, 2);
                        _this.apisDocument.OCRString = mrtddata.mrzText().replace("\n", "");
                        if (mrtddata.sex() == "M") {
                            _this.apisDocument.DocHolderGender = "0";
                        }
                        else {
                            _this.apisDocument.DocHolderGender = "1";
                        }
                        _this.apisDocument.DocID = mrtddata.documentNumber().split('<')[0];
                        _this.SearchFields.LastName = lastname_1.toString();
                        console.log(JSON.stringify(_this.apisDocument));
                        _this._shared.SetAPISDocument(_this.apisDocument);
                        _this._shared.SetScanAPISDocument(_this.apisDocument);
                    }
                    else {
                        Toast.makeText("Scan Document is not valid").show();
                    }
                });
            }
            else {
                nativescript_blinkid_1.didTapScan(type, licenseKey).then(function (pdf417data) {
                    _this.isScanned = true;
                    var message;
                    message = pdf417data.stringUsingGuessedEncoding();
                    Toast.makeText(JSON.stringify(message)).show();
                    _this.SearchFields.SearchAny = message.toString().substr(23, 6);
                    console.log(_this.SearchFields.SearchAny);
                    _this.GetOrderDetails(_this.SearchFields.SearchAny);
                });
            }
        }
        else {
            Toast.makeText("Supported only in IOS").show();
        }
    };
    SearchComponent.prototype.clear = function () {
        this.isLastdirty = false;
        this.isFlightdirty = false;
        this.isSearchanydirty = false;
        this.SearchFields.SearchAny = "";
        this.SearchFields.FlightNo = "";
        this.SearchFields.LastName = "";
    };
    SearchComponent.prototype.getPaxbyFlight = function (name, date, flightcode, locationcode) {
        var _this = this;
        try {
            var sDate = new Date();
            console.log('SearchAllPaxByFlight Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            this.departureService.SearchAllPaxByFlight(name.replace(" ", ""), date, flightcode, this.SearchFields.Location)
                .subscribe(function (data) {
                if (data.Success != false) {
                    // console.dir(<Order.PassengerDetailList>data);
                    _this.PassengerDetails = data;
                    _this.PassengerListNew = index_4.Converters.ConvertToPaxByFlightTemplateNew(_this.PassengerDetails);
                    if (_this.PassengerListNew.length == 1) {
                        // this.SearchFields.SearchAny = this.PassengerListNew[0].OrderID;
                        // this.SearchAny();
                        if (_this.isScanned) {
                            // this._shared.SetAPISDocument(null);
                            _this.GetOrderDetails(_this.PassengerListNew[0].OrderID);
                        }
                        else {
                            _this._shared.SetAPISDocument(null);
                            _this._shared.SetScanAPISDocument(null);
                            _this.GetOrderDetails(_this.PassengerListNew[0].OrderID);
                        }
                    }
                    else if (_this.PassengerListNew.length > 1) {
                        var PaxCount = 0;
                        _this.PassengerListNew.forEach(function (PaxData, PaxIndex) {
                            if (PaxData.OrderID == _this.PassengerListNew[0].OrderID) {
                                PaxCount = PaxCount + 1;
                            }
                        });
                        console.log(PaxCount);
                        if (PaxCount == _this.PassengerListNew.length) {
                            if (_this.isScanned) {
                                console.log("HERE");
                                _this.GetOrderDetails(_this.PassengerListNew[0].OrderID);
                            }
                            else {
                                _this._shared.SetAPISDocument(null);
                                _this._shared.SetScanAPISDocument(null);
                                _this.GetOrderDetails(_this.PassengerListNew[0].OrderID);
                            }
                        }
                        else {
                            ApplicationSettings.setString("passengerlist", JSON.stringify(_this.PassengerListNew));
                            var multiplePassenger_3 = 0;
                            _this.PassengerListNew.forEach(function (pass, index) {
                                if (_this._shared.GetAPISDocument() != null) {
                                    if (_this._shared.GetAPISDocument().Firstname.replace(" ", "") == _this.SuffixCheck(pass.FirstName) && _this._shared.GetAPISDocument().Surname.replace(" ", "") == pass.LastName) {
                                        multiplePassenger_3++;
                                    }
                                }
                            });
                            if (multiplePassenger_3 > 1) {
                                Toast.makeText("Multiple match found. Scanned data is ignored").show();
                                _this._shared.SetAPISDocument(null);
                            }
                            else {
                                _this.navigateToSearchResults(JSON.stringify(_this.PassengerListNew));
                            }
                            _this.loaderProgress.hideLoader();
                        }
                    }
                    else {
                        Toast.makeText("Passenger details are not found").show();
                        _this.loaderProgress.hideLoader();
                    }
                }
                else {
                    // Toast.makeText(data.ErrorMessage).show();
                    Toast.makeText("Passenger details are not found").show();
                    _this.loaderProgress.hideLoader();
                }
            }, function (error) {
                console.log("Couldnt fin information for this search " + error);
                _this.handleServiceError(error);
                _this.loaderProgress.hideLoader();
                Toast.makeText("Couldnt find information for this search " + error).show();
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
        }
    };
    SearchComponent.prototype.LastNameEmpty = function () {
        if (this.isLastNameEmpty && this.isLastdirty && this.isnumber == false) {
            return true;
        }
        else if (this.isnumber == true) {
            return true;
        }
        else
            return false;
    };
    SearchComponent.prototype.FlightEmpty = function () {
        if (this.isFlightEmpty && this.isFlightdirty) {
            return true;
        }
        else
            return false;
    };
    SearchComponent.prototype.Searchempty = function () {
        if (this.isAnySearchEmpty && this.isSearchanydirty) {
            return true;
        }
        else
            return false;
    };
    SearchComponent.prototype.getProfile = function () {
        var _this = this;
        try {
            var sDate = new Date();
            console.log('GetAccountProfile Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            this._homepage.GetAccountProfile()
                .subscribe(function (data) {
                console.log("Test1");
                _this.ProfileDetails = data;
                _this.ProfileArray = index_4.Converters.ConvertToAccountProfileTemplate(_this.ProfileDetails);
                _this.SearchFields.Location = _this.ProfileArray[0].AirportCode;
                _this.userdetails = _this.SearchFields.Location + " | " + moment().format("DD MMM YYYY") + " | " + _this.ProfileArray[0].Username;
                ApplicationSettings.setString("userdetails", _this.userdetails);
                _this.loaderProgress.hideLoader();
            }, function (error) {
                console.log("Couldnt find information for this Profile " + error);
                _this.handleServiceError(error);
                _this.loaderProgress.hideLoader();
            }, function () {
                console.log('Data Retrieved successfully' + _this.SearchFields.Location);
                _this.loaderProgress.hideLoader();
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('GetAccountProfile Service --------------- End Date Time : ' + eDate);
            console.log('GetAccountProfile Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    SearchComponent.prototype.getPaxbyFQTVID = function (id) {
        var _this = this;
        this.loaderProgress.showLoader();
        this.ETKTNumber = "";
        try {
            var sDate = new Date();
            console.log('SearchPaxByFQTVID Service --------------- Start Date Time : ' + sDate);
            console.log("getPaxbyFQTVID called " + id);
            this._search.SearchPaxByFQTVID(id)
                .subscribe(function (data) {
                _this.FQTVArray = index_4.Converters.ConvertToFQTVTemplate(data);
                if (_this.FQTVArray == null || _this.FQTVArray.length == 0) {
                    var self = _this;
                    Toast.makeText("No reservations are found").show();
                    _this.loaderProgress.hideLoader();
                    // this.navigateToSearch();
                }
                else {
                    _this.navigateToFQTV(JSON.stringify(_this.FQTVArray), _this.SearchFields.SearchAny);
                }
                //this.router.navigate(["/checkin"])
                _this.loaderProgress.hideLoader();
            }, function (error) {
                var self = _this;
                _this.handleServiceError(error);
                Toast.makeText("No reservations are found").show();
                // this.navigateToSearch();
                console.log("Couldnt find information for this OrderID " + error);
                _this.loaderProgress.hideLoader();
            }, function () {
                //console.log('Data Retrievesuccessfully' + this.PassengerDetails);     
                //console.log(this.PassengerArray.length);             
                _this.loaderProgress.hideLoader();
            });
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            var eDate = new Date();
            console.log('SearchPaxByFQTVID Service --------------- End Date Time : ' + eDate);
            console.log('SearchPaxByFQTVID Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    SearchComponent.prototype.navigateToCheckin = function (param) {
        this.routerExtensions.navigate(["checkin"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "data": param,
            }
        });
    };
    SearchComponent.prototype.navigateToFQTV = function (param, fqtvnum) {
        this.loaderProgress.hideLoader();
        this.routerExtensions.navigate(["fqtvlist"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "data": param,
                "fqtvnum": fqtvnum
            }
        });
    };
    SearchComponent.prototype.navigateToSearchResults = function (param) {
        this.routerExtensions.navigate(["searchresult"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "data": param
            }
        });
    };
    SearchComponent.prototype.navigateToDepartures = function () {
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
    SearchComponent.prototype.navigateToLogin = function () {
        this.routerExtensions.navigate([""], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    SearchComponent.prototype.navigateToHome = function () {
        this.routerExtensions.navigate(["home"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    SearchComponent.prototype.createModelView = function (args) {
        var _this = this;
        var that = this;
        var currentDate = this.startDate;
        console.log(this.startDate);
        var options = {
            viewContainerRef: this.vcRef,
            context: {
                currentDate: currentDate.toDateString(),
                displayHeader: true,
                minDate: moment(new Date()).subtract(1, 'days').toDate().toDateString(),
                maxDate: moment(new Date()).add(2, 'days').toDate().toDateString()
            },
            fullscreen: false
        };
        this._modalService.showModal(date_picker_modal_1.DatePickerModal, options)
            .then(function (dateresult) {
            if (dateresult) {
                console.log("date result " + dateresult);
                if (dateresult.toDateString() != 'undefined') {
                    _this.startDate = dateresult;
                }
            }
        });
    };
    SearchComponent.prototype.onopen = function () {
        console.log("Drop Down opened.");
    };
    SearchComponent.prototype.onChange = function (args, index) {
        this._timeoutService.resetWatch();
        switch (index) {
            case 0:
                this.isFlightEmpty = false;
                this.isLastNameEmpty = false;
                if (this.SearchFields.SearchAny != "") {
                    this.isAnySearchEmpty = false;
                    this.isSearchanydirty = true;
                }
                if (this.SearchFields.SearchAny.length >= 6) {
                    this.isValid = true;
                }
                else
                    this.isValid = false;
                var reg = new RegExp('^[a-zA-Z0-9-/]*$');
                var test = reg.test(this.SearchFields.SearchAny);
                if (test == false)
                    this.isAnySearchEmpty = true;
                else
                    this.isAnySearchEmpty = false;
                break;
            case 1:
                this.isAnySearchEmpty = false;
                if (this.SearchFields.FlightNo == "") {
                    this.isFlightEmpty = true;
                }
                else {
                    this.isFlightEmpty = false;
                    this.isFlightdirty = true;
                }
                var reg = new RegExp('^[a-zA-Z0-9]*$');
                var test = reg.test(this.SearchFields.FlightNo);
                console.log("flightnum" + test);
                if (test == false || this.SearchFields.FlightNo == "") {
                    if (test == false) {
                        Toast.makeText("Proper flight number").show();
                    }
                    this.isFlightEmpty = true;
                }
                else {
                    this.isFlightEmpty = false;
                }
                break;
            case 2:
                this.isAnySearchEmpty = false;
                if (this.SearchFields.LastName == "") {
                    this.isLastNameEmpty = true;
                }
                else {
                    this.isLastNameEmpty = false;
                    this.isLastdirty = true;
                }
                var reg = new RegExp('^[a-zA-Z ]+$');
                var test = reg.test(this.SearchFields.LastName);
                if (test == false && this.SearchFields.LastName != "") {
                    this.isnumber = true;
                    Toast.makeText("Only alphabets").show();
                }
                else {
                    this.isnumber = false;
                }
                // console.log(test);
                // console.log(this.SearchFields.LastName.length);
                break;
            default:
        }
        if (this.isnumber == true || this.SearchFields.FlightNo == "" || this.SearchFields.LastName == "" || this.isLastNameEmpty == true || this.isFlightEmpty == true) {
            this.isButtonEnabled = false;
        }
        else {
            this.isButtonEnabled = true;
        }
    };
    SearchComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    SearchComponent.prototype.handleServiceError = function (error) {
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
    SearchComponent.prototype.navigateToCompensation = function () {
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
    ], SearchComponent.prototype, "pageCont", void 0);
    SearchComponent = __decorate([
        core_1.Component({
            selector: "search-page",
            providers: [index_2.DataService, app_constants_1.Configuration, modal_dialog_1.ModalDialogService, index_3.APISDocument, index_2.PassengerService, index_2.DepartureService, index_2.HomePageService, index_2.SearchService, index_2.CheckinService],
            templateUrl: "./components/search/search.component.html",
            styleUrls: ["./components/search/search.component.css"]
        }),
        __metadata("design:paramtypes", [index_2.CheckinService, index_2.SearchService, index_2.HomePageService, page_1.Page, router_2.RouterExtensions, timeOut_service_1.TimeOutService, router_1.ActivatedRoute, router_1.Router, common_1.Location, index_2.DataService, modal_dialog_1.ModalDialogService, core_1.ViewContainerRef, index_3.APISDocument, index_2.CheckinOrderService, index_2.PassengerService, index_2.DepartureService])
    ], SearchComponent);
    return SearchComponent;
}());
exports.SearchComponent = SearchComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlYXJjaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsc0NBQTJGO0FBQzNGLDBDQUEyRTtBQUMzRSwwQ0FBMkM7QUFDM0Msc0RBQStEO0FBQy9ELGtFQUEyRjtBQUMzRixnQ0FBK0I7QUFHL0Isb0NBQXFDO0FBRXJDLDhCQUE4QjtBQUM5QiwwREFBNEQ7QUFDNUQsMENBQTRDO0FBQzVDLDZEQUFpRDtBQUNqRCwrQkFBaUM7QUFHakMsZ0JBQWdCO0FBQ2hCLHdFQUFxRjtBQUNyRixzREFBdUg7QUFFdkgscURBQW1LO0FBQ25LLGtEQUF5SjtBQUN6SixrREFBc0Q7QUFDdEQsb0ZBQW9HO0FBQ3BHLHFEQUFvRDtBQUNwRCw2REFBMkQ7QUFDM0QscUNBQTREO0FBRTVELHlFQUF1RTtBQUN2RSxJQUFJLFdBQVcsR0FBRyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7QUFRekI7SUE2Q0kseUJBQW1CLFFBQXdCLEVBQVUsT0FBc0IsRUFBVSxTQUEwQixFQUFVLElBQVUsRUFBVSxnQkFBa0MsRUFBUyxlQUErQixFQUFVLGVBQStCLEVBQVUsTUFBYyxFQUFVLFFBQWtCLEVBQVMsWUFBeUIsRUFBVSxhQUFpQyxFQUFVLEtBQXVCLEVBQVMsWUFBMEIsRUFBUyxPQUE0QixFQUFTLFFBQTBCLEVBQVMsZ0JBQWtDO1FBQXhqQixpQkFxQkM7UUFyQmtCLGFBQVEsR0FBUixRQUFRLENBQWdCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBZTtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQWlCO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFBUyxvQkFBZSxHQUFmLGVBQWUsQ0FB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QVcsRUFBRSwyQ0FBMkM7WUFDeEQsU0FBUyxFQUFFLENBQUMsMENBQTBDLENBQUM7U0FDMUQsQ0FBQzt5Q0ErQytCLHNCQUFjLEVBQW1CLHFCQUFhLEVBQXFCLHVCQUFlLEVBQWdCLFdBQUksRUFBNEIseUJBQWdCLEVBQTBCLGdDQUFjLEVBQTJCLHVCQUFjLEVBQWtCLGVBQU0sRUFBb0IsaUJBQVEsRUFBdUIsbUJBQVcsRUFBeUIsaUNBQWtCLEVBQWlCLHVCQUFnQixFQUF1QixvQkFBWSxFQUFrQiwyQkFBbUIsRUFBbUIsd0JBQWdCLEVBQTJCLHdCQUFnQjtPQTdDL2lCLGVBQWUsQ0FrbUMzQjtJQUFELHNCQUFDO0NBQUEsQUFsbUNELElBa21DQztBQWxtQ1ksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyIvL2FuZ3VsYXIgJiBuYXRpdmVzY3JpcHQgcmVmZXJlbmNlc1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uRXh0cmFzLCBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xyXG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBNb2RhbERpYWxvZ1NlcnZpY2UsIE1vZGFsRGlhbG9nT3B0aW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9tb2RhbC1kaWFsb2dcIjtcclxuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XHJcbmltcG9ydCAqIGFzIGZyYW1lIGZyb20gXCJ1aS9mcmFtZVwiO1xyXG5pbXBvcnQgeyBHcmlkTGF5b3V0IH0gZnJvbSBcInVpL2xheW91dHMvZ3JpZC1sYXlvdXRcIjtcclxuaW1wb3J0ICogYXMgZGlhbG9ncyBmcm9tIFwidWkvZGlhbG9nc1wiXHJcblxyXG4vL2V4dGVybmFsIG1vZHVsZXMgYW5kIHBsdWdpbnNcclxuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcclxuaW1wb3J0IHsgZGlkVGFwU2NhbiB9IGZyb20gJ25hdGl2ZXNjcmlwdC1ibGlua2lkJ1xyXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xyXG5pbXBvcnQgKiBhcyBnZXN0dXJlcyBmcm9tIFwidWkvZ2VzdHVyZXNcIjtcclxuXHJcbi8vYXBwIHJlZmVyZW5jZXNcclxuaW1wb3J0IHsgQ3JlYXRpbmdMaXN0UGlja2VyQ29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvY291bnRyeS9jb3VudHJ5LW1vZGFsXCI7XHJcbmltcG9ydCB7IExvYWRlclByb2dyZXNzLCBQYXNzZW5nZXJMaXN0VGVtcGxhdGUsIFBhc3Nlbmdlckxpc3QsIEFjY29udFByb2ZpbGVNb2RlbCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvaW50ZXJmYWNlL2luZGV4XCJcclxuaW1wb3J0IHsgRlFUVkluZm8gfSBmcm9tICcuLi8uLi9zaGFyZWQvaW50ZXJmYWNlL2luZGV4JztcclxuaW1wb3J0IHsgRGF0YVNlcnZpY2UsIENoZWNraW5PcmRlclNlcnZpY2UsIFBhc3NlbmdlclNlcnZpY2UsIERlcGFydHVyZVNlcnZpY2UsIEhvbWVQYWdlU2VydmljZSwgU2VhcmNoU2VydmljZSwgQ2hlY2tpblNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL2luZGV4XCI7XHJcbmltcG9ydCB7IE9yZGVyLCBDb3VudHJ5Q29sbGVjdGlvbiwgRmxpZ2h0U2VydmljZUluZm8sIEZsaWdodCwgU2VhcmNoLCBBY2NvdW50UHJvZmlsZSwgQVBJU0RvY3VtZW50LCBDaXR5Q29kZUNvbGxlY3Rpb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkL21vZGVsL2luZGV4XCI7XHJcbmltcG9ydCB7IENvbnZlcnRlcnMgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCB7IERhdGVQaWNrZXJNb2RhbCwgRGF0ZVBpY2tldENvbnRleHQgfSBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9kYXRlLXBpY2tlci9kYXRlLXBpY2tlci1tb2RhbFwiO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vLi4vYXBwLmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IEFwcEV4ZWN1dGlvbnRpbWUgfSBmcm9tIFwiLi4vLi4vYXBwLmV4ZWN1dGlvbnRpbWVcIjtcclxuaW1wb3J0IHsgaXNBbmRyb2lkLCBpc0lPUywgZGV2aWNlLCBzY3JlZW4gfSBmcm9tIFwicGxhdGZvcm1cIjtcclxuaW1wb3J0IHsgRlFUViB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbW9kZWwvaW5kZXhcIlxyXG5pbXBvcnQgeyBUaW1lT3V0U2VydmljZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvdGltZU91dC5zZXJ2aWNlXCI7XHJcbnZhciBsaWNlbnNlS2V5cyA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwibGljZW5zZUtleVwiLCAnJyk7XHJcbmNvbnNvbGUubG9nKGxpY2Vuc2VLZXlzKTtcclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogXCJzZWFyY2gtcGFnZVwiLFxyXG4gICAgcHJvdmlkZXJzOiBbRGF0YVNlcnZpY2UsIENvbmZpZ3VyYXRpb24sIE1vZGFsRGlhbG9nU2VydmljZSwgQVBJU0RvY3VtZW50LCBQYXNzZW5nZXJTZXJ2aWNlLCBEZXBhcnR1cmVTZXJ2aWNlLCBIb21lUGFnZVNlcnZpY2UsIFNlYXJjaFNlcnZpY2UsIENoZWNraW5TZXJ2aWNlXSxcclxuICAgIHRlbXBsYXRlVXJsOiBcIi4vY29tcG9uZW50cy9zZWFyY2gvc2VhcmNoLmNvbXBvbmVudC5odG1sXCIsXHJcbiAgICBzdHlsZVVybHM6IFtcIi4vY29tcG9uZW50cy9zZWFyY2gvc2VhcmNoLmNvbXBvbmVudC5jc3NcIl1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBTZWFyY2hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gICAgQFZpZXdDaGlsZCgncGFnZWNvbnRhaW5lcicpIHBhZ2VDb250OiBFbGVtZW50UmVmO1xyXG4gICAgcHVibGljIGlzRXJyb3I6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgbG9hZGVyUHJvZ3Jlc3M6IExvYWRlclByb2dyZXNzO1xyXG4gICAgcHVibGljIHN0YXJ0RGF0ZTogRGF0ZTtcclxuICAgIHB1YmxpYyBpc0xhc3RkaXJ0eTogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBpc0ZsaWdodGRpcnR5OiBib29sZWFuO1xyXG4gICAgcHVibGljIGlzU2VhcmNoYW55ZGlydHk6IGJvb2xlYW5cclxuICAgIHB1YmxpYyBpc2Vycm9yOiBib29sZWFuO1xyXG4gICAgcHVibGljIFBhc3NlbmdlckRldGFpbHM6IGFueTtcclxuICAgIHB1YmxpYyBGUVRWQXJyYXk6IEFycmF5PEZRVFZJbmZvPjtcclxuICAgIHB1YmxpYyBjaXR5TGlzdDogQXJyYXk8Q2l0eUNvZGVDb2xsZWN0aW9uLkNvbGxlY3Rpb25FbnRpdHk+ID0gW107XHJcbiAgICBwdWJsaWMgZmlsdGVyQ2l0eUxpc3Q6IEFycmF5PENpdHlDb2RlQ29sbGVjdGlvbi5Db2xsZWN0aW9uRW50aXR5PiA9IFtdO1xyXG4gICAgcHVibGljIFBhc3Nlbmdlckxpc3Q6IEFycmF5PFBhc3Nlbmdlckxpc3RUZW1wbGF0ZT4gPSBbXTtcclxuICAgIHB1YmxpYyBQYXNzZW5nZXJMaXN0TmV3OiBBcnJheTxQYXNzZW5nZXJMaXN0PiA9IFtdO1xyXG4gICAgcHVibGljIEZsaWdodERldGFpbHM6IEZsaWdodCA9IG5ldyBGbGlnaHQoKTtcclxuICAgIHB1YmxpYyBTZWFyY2hGaWVsZHM6IFNlYXJjaCA9IG5ldyBTZWFyY2goKTtcclxuICAgIHB1YmxpYyBQcm9maWxlQXJyYXk6IEFjY29udFByb2ZpbGVNb2RlbC5BY2NvdW50UHJvZmlsZVRlbXBsYXRlID0gbmV3IEFjY29udFByb2ZpbGVNb2RlbC5BY2NvdW50UHJvZmlsZVRlbXBsYXRlKCk7XHJcbiAgICBwdWJsaWMgUHJvZmlsZURldGFpbHM6IGFueTtcclxuICAgIHB1YmxpYyB1c2VyZGV0YWlsczogYW55O1xyXG4gICAgcHVibGljIGNsZWFyY2xpY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIFBhc3NlbmdlckRldGFpbHNGbGlnaHQgPSBbXTtcclxuICAgIHB1YmxpYyBDb3VudHJ5RGV0YWlsczogQ291bnRyeUNvbGxlY3Rpb24uQ29sbGVjdGlvbjtcclxuICAgIHB1YmxpYyBQYXNzZW5nZXJzdHJpbmdBcnJheSA9IFtdO1xyXG4gICAgcHVibGljIG5hbWU6IGFueTtcclxuICAgIHB1YmxpYyBmaWx0ZXJDaXR5Q29kZTogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgcHVibGljIHNlYXJjaE9yZGVySUQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBjdXJEYXRlOiBEYXRlO1xyXG4gICAgcHVibGljIHNlbGVjdGVkSW5kZXggPSAxO1xyXG4gICAgcHVibGljIGl0ZW1zOiBBcnJheTxzdHJpbmc+O1xyXG4gICAgcHVibGljIGlzQW55U2VhcmNoRW1wdHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBpc0ZsaWdodEVtcHR5OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNMYXN0TmFtZUVtcHR5OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNCdXR0b25FbmFibGVkID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNudW1iZXI6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgaXNWYWxpZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIENvdW50cnlMaXN0OiBBcnJheTxzdHJpbmc+O1xyXG4gICAgcHVibGljIENvdW50cnlJdGVtczogYW55W107XHJcbiAgICBwdWJsaWMgaXNTY2FubmVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgQWRkaXRpb25hbERvY3VtZW50czogYW55O1xyXG4gICAgcHVibGljIGlzQ29tcGVuc2F0aW9uRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzQ2hlY2tpbkRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNHYXRlRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBFVEtUTnVtYmVyOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIF9jaGVja2luOiBDaGVja2luU2VydmljZSwgcHJpdmF0ZSBfc2VhcmNoOiBTZWFyY2hTZXJ2aWNlLCBwcml2YXRlIF9ob21lcGFnZTogSG9tZVBhZ2VTZXJ2aWNlLCBwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9ucywgcHVibGljIF90aW1lb3V0U2VydmljZTogVGltZU91dFNlcnZpY2UsIHByaXZhdGUgYWN0aXZhdGVkUm91dGVyOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24sIHB1YmxpYyBfZGF0YVNlcnZpY2U6IERhdGFTZXJ2aWNlLCBwcml2YXRlIF9tb2RhbFNlcnZpY2U6IE1vZGFsRGlhbG9nU2VydmljZSwgcHJpdmF0ZSB2Y1JlZjogVmlld0NvbnRhaW5lclJlZiwgcHVibGljIGFwaXNEb2N1bWVudDogQVBJU0RvY3VtZW50LCBwdWJsaWMgX3NoYXJlZDogQ2hlY2tpbk9yZGVyU2VydmljZSwgcHVibGljIF9zZXJ2aWNlOiBQYXNzZW5nZXJTZXJ2aWNlLCBwdWJsaWMgZGVwYXJ0dXJlU2VydmljZTogRGVwYXJ0dXJlU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gXCJcIjtcclxuICAgICAgICB0aGlzLlNlYXJjaEZpZWxkcy5GbGlnaHREYXRlID0gbW9tZW50KCkuZm9ybWF0KFwiREQgTU1NTSBZWVlZXCIpO1xyXG4gICAgICAgIHRoaXMuY3VyRGF0ZSA9IG1vbWVudCgpLnRvRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MgPSBuZXcgTG9hZGVyUHJvZ3Jlc3MoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy5zdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuQ291bnRyeUxpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLkNvdW50cnlJdGVtcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmFjdGl2YXRlZFJvdXRlci5xdWVyeVBhcmFtcy5zdWJzY3JpYmUoKHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICBpZiAocGFyYW1zW1wiZGF0YVwiXSAhPSBudWxsICYmIHBhcmFtc1tcImRhdGFcIl0gIT0gXCJcIiAmJiBwYXJhbXNbXCJkYXRhXCJdICE9IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuUHJvZmlsZUFycmF5ID0gSlNPTi5wYXJzZShwYXJhbXNbXCJkYXRhXCJdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuU2VhcmNoRmllbGRzLkxvY2F0aW9uID0gdGhpcy5Qcm9maWxlQXJyYXkuUG9pbnRPZlNhbGVzWzBdLkFpcnBvcnRDb2RlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VyZGV0YWlscyA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcmRldGFpbHNcIiwgXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCd+L2ltYWdlcy9sb2dpbl9iYWNrLmpwZWcnKVwiO1xyXG4gICAgICAgIHRoaXMucGFnZS5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9IFwiY292ZXIgXCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA1OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5pdGVtcy5wdXNoKFwiZGF0YSBpdGVtIFwiICsgaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubG9jYXRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gMTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMuY2l0eUxpc3QgPSB0aGlzLl9zaGFyZWQuZ2V0Q2l0eUxpc3QoKTtcclxuICAgICAgICB0aGlzLmNpdHlMaXN0LmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyQ2l0eUNvZGUucHVzaChkYXRhLkNvZGUgKyBcIi1cIiArIGRhdGEuTmFtZSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLmlzQ2hlY2tpbkRpc2FibGVkID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiY2hlY2tpbkRpc2FibGVkXCIpO1xyXG4gICAgICAgIHRoaXMuaXNHYXRlRGlzYWJsZWQgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJnYXRlRGlzYWJsZWRcIik7XHJcbiAgICAgICAgdmFyIExvY2F0aW9uID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VyZGV0YWlsc1wiLCBcIlwiKTtcclxuICAgICAgICB0aGlzLlNlYXJjaEZpZWxkcy5Mb2NhdGlvbiA9IExvY2F0aW9uLnN1YnN0cigwLCAzKTtcclxuICAgICAgICB0aGlzLnVzZXJkZXRhaWxzID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VyZGV0YWlsc1wiLCBcIlwiKTtcclxuICAgICAgICB0aGlzLmlzQ29tcGVuc2F0aW9uRW5hYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNvbXBlbnNhdGlvbkVuYWJsZWRcIik7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gMTtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmluaXRMb2FkZXIodGhpcy5wYWdlQ29udCk7XHJcbiAgICAgICAgdGhpcy5HZXRDb3VudHJ5KCk7XHJcbiAgICAgICAgdGhpcy5HZXRGUVRWKCk7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkLkdldFN0YXJ0dXBUYWJsZSgpO1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZC5TZXRCYWdUYWcobnVsbCk7XHJcbiAgICAgICAgY29uc29sZS5kaXIodGhpcy5fc2hhcmVkLkdldFN0YXJ0dXBUYWJsZSgpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl90aW1lb3V0U2VydmljZS5nZXRUaW1lcigpKTtcclxuICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLnBhZ2VDb250Lm5hdGl2ZUVsZW1lbnRcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG9ic2VydmVyID0gbGFiZWwub24oXCJsb2FkZWQsIHRhcCwgbG9uZ1ByZXNzLCBzd2lwZSwgbmdNb2RlbENoYW5nZVwiLCBmdW5jdGlvbiAoYXJnczogZ2VzdHVyZXMuR2VzdHVyZUV2ZW50RGF0YSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkV2ZW50OiBcIiArIGFyZ3MuZXZlbnROYW1lKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5fdGltZW91dFNlcnZpY2UudGltZXIpO1xyXG4gICAgICAgICAgICBzZWxmLl90aW1lb3V0U2VydmljZS5yZXNldFdhdGNoKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2V0RG9jdW1lbnRUeXBlKCk7XHJcblxyXG4gICAgfVxyXG4gICAgZ2V0RG9jdW1lbnRUeXBlKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiZG9jdHlwZVwiKTtcclxuICAgICAgICB0aGlzLl9kYXRhU2VydmljZS5kb2N1bWVudFR5cGUoKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuQWRkaXRpb25hbERvY3VtZW50cyA9IGRhdGEuUmVmZXJlbmNlSW5mb1swXS5BZGNEb2N1bWVudHNUb0FwcGVuZDtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZG9jdHlwZVwiICsgdGhpcy5BZGRpdGlvbmFsRG9jdW1lbnRzKVxyXG4gICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0QWRkaXRpb25hbERvY3VtZW50cyh0aGlzLkFkZGl0aW9uYWxEb2N1bWVudHMpO1xyXG4gICAgICAgIH0sIGVyciA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgZGlzcGxheUNpdHlMaXN0QWN0aW9uRGlhbG9nKCkge1xyXG4gICAgICAgIGxldCBvcHRpb25zOiBNb2RhbERpYWxvZ09wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMudmNSZWYsXHJcbiAgICAgICAgICAgIGNvbnRleHQ6IFt7IGNvdW50cnk6IHRoaXMuZmlsdGVyQ2l0eUNvZGUgfV0sXHJcbiAgICAgICAgICAgIGZ1bGxzY3JlZW46IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fbW9kYWxTZXJ2aWNlXHJcbiAgICAgICAgICAgIC5zaG93TW9kYWwoQ3JlYXRpbmdMaXN0UGlja2VyQ29tcG9uZW50LCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkYXRlIHJlc3VsdCBcIiArIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWFyY2hGaWVsZHMuTG9jYXRpb24gPSByZXN1bHQuc3Vic3RyKDAsIDMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3V0XCIgKyByZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIEdldENvdW50cnkoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgQ291bnRyaWVzIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UuR2V0Q291bnRyaWVzKClcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Db3VudHJ5RGV0YWlscyA9IDxDb3VudHJ5Q29sbGVjdGlvbi5Db2xsZWN0aW9uPmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldENvdW50cnkodGhpcy5Db3VudHJ5RGV0YWlscyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBDb3VudHJpZXMgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlRGF0ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgQ291bnRyaWVzIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEdldEZRVFYoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZGF0YVNlcnZpY2UuRlFUVigpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldEZRVFYoZGF0YSk7XHJcbiAgICAgICAgICAgIH0sIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgR2V0T3JkZXJEZXRhaWxzKGlkOiBzdHJpbmcsIGV0a3ROdW1iZXI6IHN0cmluZyA9IFwiXCIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBQYXNzZW5nZXIgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VydmljZS5HZXRQYXNzZW5nZXIoaWQpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLklEICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuVGlja2V0aW5nU3RhdHVzICE9IFwiTm90IFRpY2tldGVkXCIgJiYgZGF0YS5UaWNrZXRpbmdTdGF0dXMgIT0gXCJQYXJ0aWFsbHkgVGlja2V0ZWRcIiAmJiBkYXRhLklzT3V0T2ZTeW5jVGlja2V0ICE9IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRQYXNzZW5nZXIoPE9yZGVyLlJvb3RPYmplY3Q+ZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5TZWdtZW50cyAhPSBudWxsICYmIGRhdGEuU2VnbWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBQT1NMb2NhdGlvbiA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcmRldGFpbHNcIiwgXCJcIikuc3Vic3RyKDAsIDMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlNlZ21lbnRzLmZpbHRlcihtID0+IG0uT3JpZ2luLkFpcnBvcnRDb2RlID09IFBPU0xvY2F0aW9uKS5sZW5ndGggPiAwICYmIGRhdGEuU2VnbWVudHMuZmlsdGVyKG0gPT4gbS5PcmlnaW4uQWlycG9ydENvZGUgPT0gUE9TTG9jYXRpb24pWzBdLlN0YXR1cy5pc1dhaXRsaXN0ZWRQYXNzZW5nZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldElzV2FpdGxpc3RlZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJXYWl0bGlzdGVkIFBhc3NlbmdlclwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0SXNXYWl0bGlzdGVkKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc1dhaXRsaXN0ZWRQYXNzZW5nZXIgOiBmYWxzZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKS5QYXNzZW5nZXJzWzBdLkRvY3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCkuUGFzc2VuZ2Vycy5mb3JFYWNoKChwYXNzSW5mbywgcGFzc0luZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWYgKHBhc3NJbmZvLlBhc3NlbmdlclR5cGVDb2RlID09IFwiSU5GXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgbGV0IHBhc3NlbmdlcnM6IGFueSA9IHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKS5QYXNzZW5nZXJzLmZpbHRlcihtID0+IG0uR3JvdXBlZEdpdmVuTmFtZSA9PSBwYXNzSW5mby5Hcm91cGVkR2l2ZW5OYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgcGFzc2VuZ2Vycy5mb3JFYWNoKChwYXNzLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWYgKHBhc3MuUGFzc2VuZ2VyVHlwZUNvZGUgIT0gXCJJTkZcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGxldCBpbmZSUEggPSB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCkuUGFzc2VuZ2Vycy5maWx0ZXIobSA9PiBtLlBhc3NlbmdlclR5cGVDb2RlID09IFwiSU5GXCIpWzBdLlJQSFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKS5QYXNzZW5nZXJzLmZpbHRlcihtID0+IG0uRmlyc3RuYW1lID09IHBhc3MuRmlyc3RuYW1lICYmIG0uTGFzdG5hbWUgPT0gcGFzcy5MYXN0bmFtZSlbMF0uQXNzb2NpYXRlZEluZmFudFJQSCA9IGluZlJQSFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgbGV0IGFkdWx0UlBIID0gdGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpLlBhc3NlbmdlcnMuZmlsdGVyKG0gPT4gbS5QYXNzZW5nZXJUeXBlQ29kZSAhPSBcIklORlwiKVswXS5SUEhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCkuUGFzc2VuZ2Vycy5maWx0ZXIobSA9PiBtLkZpcnN0bmFtZSA9PSBwYXNzLkZpcnN0bmFtZSAmJiBtLkxhc3RuYW1lID09IHBhc3MuTGFzdG5hbWUpWzBdLkFzc29jaWF0ZWRBZHVsdFJQSCA9IGFkdWx0UlBIXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGV0IHNjVGFibGU6YW55W10gPSB0aGlzLl9zaGFyZWQuR2V0U3RhcnR1cFRhYmxlKCkuVGFibGVzLlNlY3VyaXR5Q29kZVRhYmxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzRXJyb3JPY2N1cmVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl9zaGFyZWQuR2V0U3RhcnR1cFRhYmxlKCkuVGFibGVzLlNlY3VyaXR5Q29kZVRhYmxlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IFBhc3NlbmdlckFycmF5OiBhbnkgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb0ZsaWdodFdpdGhQYXhUZW1wbGF0ZSh0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCksIG51bGwsIHRoaXMuX3NoYXJlZC5HZXRTdGFydHVwVGFibGUoKS5UYWJsZXMuU2VjdXJpdHlDb2RlVGFibGUsIGV0a3ROdW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFBhc3NlbmdlckFycmF5LlNlZ21lbnQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZXRkZXBhcnR1cmVEYXRlOiBzdHJpbmcgPSBtb21lbnQoUGFzc2VuZ2VyQXJyYXkuU2VnbWVudFswXS5EZXBhcnR1cmVEYXRlVGltZS50b1N0cmluZygpKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZXRmbGlnaHRudW1iZXI6IHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoUGFzc2VuZ2VyQXJyYXkuU2VnbWVudFswXS5NYXJrZXRpbmdGbGlnaHQuc3Vic3RyKDAsIDIpID09IFwiQ01cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRmbGlnaHRudW1iZXIgPSBQYXNzZW5nZXJBcnJheS5TZWdtZW50WzBdLk1hcmtldGluZ0ZsaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoUGFzc2VuZ2VyQXJyYXkuU2VnbWVudFswXS5PcGVyYXRpbmdGbGlnaHQgIT0gbnVsbCAmJiBQYXNzZW5nZXJBcnJheS5TZWdtZW50WzBdLk9wZXJhdGluZ0ZsaWdodC5zdWJzdHIoMCwgMikgPT0gXCJDTVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldGZsaWdodG51bWJlciA9IFBhc3NlbmdlckFycmF5LlNlZ21lbnRbMF0uT3BlcmF0aW5nRmxpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0ZmxpZ2h0bnVtYmVyID0gUGFzc2VuZ2VyQXJyYXkuU2VnbWVudFswXS5NYXJrZXRpbmdGbGlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNldGNpdHk6IHN0cmluZyA9IFBhc3NlbmdlckFycmF5LlNlZ21lbnRbMF0uRGVwYXJ0dXJlQ2l0eTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2xldCBkZXBhcnR1cmVDaXR5OnN0cmluZz1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXNzZW5nZXJBcnJheS5TZWdtZW50LmZvckVhY2goKFNlZ0VsZSwgU2VnSW5uZGV4KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGVwYXJ0dXJlRGF0ZTogc3RyaW5nID0gbW9tZW50KFNlZ0VsZS5EZXBhcnR1cmVEYXRlVGltZS50b1N0cmluZygpKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmxpZ2h0bnVtYmVyOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTZWdFbGUuTWFya2V0aW5nRmxpZ2h0LnN1YnN0cigwLCAyKSA9PSBcIkNNXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodG51bWJlciA9IFNlZ0VsZS5NYXJrZXRpbmdGbGlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoU2VnRWxlLk9wZXJhdGluZ0ZsaWdodCAhPSBudWxsICYmIFNlZ0VsZS5PcGVyYXRpbmdGbGlnaHQuc3Vic3RyKDAsIDIpID09IFwiQ01cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxpZ2h0bnVtYmVyID0gU2VnRWxlLk9wZXJhdGluZ0ZsaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaWdodG51bWJlciA9IFNlZ0VsZS5NYXJrZXRpbmdGbGlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNpdHk6IHN0cmluZyA9IFNlZ0VsZS5EZXBhcnR1cmVDaXR5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWdFbGUuZGF0ZSA9IG1vbWVudChTZWdFbGUuRGVwYXJ0dXJlRGF0ZVRpbWUudG9TdHJpbmcoKSkuZm9ybWF0KFwiREQtTU1NLVlZWVlcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZXN0aW5hdGlvbiA9IFNlZ0VsZS5EZXN0aW5hdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy9JbnZlbnRvcnlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0Vycm9yT2NjdXJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tpbi5Cb29raW5nQ291bnREaXNwbGF5KGRlcGFydHVyZURhdGUsIGZsaWdodG51bWJlciwgY2l0eSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbnZlbnRvcnk6IGFueSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5pbnZlbiA9IENvbnZlcnRlcnMuQ29udmVydFRvSW52ZW50b3J5KGludmVudG9yeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNFcnJvck9jY3VyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JbmJvdW5kXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGVja2luLkluQm91bmQoZGVwYXJ0dXJlRGF0ZSwgZmxpZ2h0bnVtYmVyLCBjaXR5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluQm91bmQ6IGFueSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5pbmJvdW5kID0gQ29udmVydGVycy5Db252ZXJ0VG9JbkJvdW5kKGluQm91bmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRXJyb3JPY2N1cmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vT3V0Ym91bmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoZWNraW4uT3V0Qm91bmQoZGVwYXJ0dXJlRGF0ZSwgZmxpZ2h0bnVtYmVyLCBkZXN0aW5hdGlvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBPdXRCb3VuZDogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VnRWxlLm91dGJvdW5kID0gQ29udmVydGVycy5Db252ZXJ0VG9PdXRCb3VuZChPdXRCb3VuZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNFcnJvck9jY3VyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zdGF0dXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFTZXJ2aWNlLlN0YXR1cyhkZXBhcnR1cmVEYXRlLCBmbGlnaHRudW1iZXIsIGNpdHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuRmxpZ2h0cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXR1czogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5zdGF0dXMgPSBzdGF0dXMuRmxpZ2h0c1swXS5MZWdzWzBdLlN0YXR1cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBPcmlnaW5sb2NEZXRhaWxzID0gc3RhdHVzLkZsaWdodHNbMF0uTGVncy5maWx0ZXIobSA9PiBtLkRlcGFydHVyZUFpcnBvcnQuTG9jYXRpb25Db2RlID09IFNlZ0VsZS5PcmlnaW4pWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGbGlnaHQgb3JpZ2luOlwiICsgU2VnRWxlLk9yaWdpbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZsaWdodCBvcmlnaW46XCIgKyBKU09OLnN0cmluZ2lmeShPcmlnaW5sb2NEZXRhaWxzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZihTZWdFbGUuT3JpZ2luID09IHN0YXR1cy5GbGlnaHRzWzBdLkxlZ3MuZmlsdGVyKG09PiBtLkRlcGFydHVyZUFpcnBvcnQpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VnRWxlLkxlZ3MgPSBzdGF0dXMuRmxpZ2h0c1swXS5MZWdzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VnRWxlLkVURCA9IE9yaWdpbmxvY0RldGFpbHMuRGVwYXJ0dXJlRGF0ZVRpbWUuRXN0aW1hdGVkLnRvU3RyaW5nKCkuc3Vic3RyKDExLCA1KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5TVEQgPSBPcmlnaW5sb2NEZXRhaWxzLkRlcGFydHVyZURhdGVUaW1lLlNjaGVkdWxlZC50b1N0cmluZygpLnN1YnN0cigxMSwgNSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWdFbGUuRVRBID0gT3JpZ2lubG9jRGV0YWlscy5BcnJpdmFsRGF0ZVRpbWUuU2NoZWR1bGVkLnRvU3RyaW5nKCkuc3Vic3RyKDExLCA1KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cy5GbGlnaHRzWzBdLkxlZ3NbMF0uRGVwYXJ0dXJlRGF0ZVRpbWUuRXN0aW1hdGVkLnRvU3RyaW5nKCkuc3Vic3RyKDExLCA1KSArIFwibGxsbFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXNzZW5nZXJMZW5ndGggPSBQYXNzZW5nZXJBcnJheS5TZWdtZW50Lmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFzc2VuZ2VyTGVuZ3RoID09IFNlZ0lubmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRCYWdUYWcobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFNlZ21lbnREZXRhaWwoUGFzc2VuZ2VyQXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtdWx0aXBsZVBhc3NlbmdlcjogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuR2V0UGFzc2VuZ2VyKCkuUGFzc2VuZ2Vycy5mb3JFYWNoKChwYXNzLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2hhcmVkLkdldEFQSVNEb2N1bWVudCgpICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zaGFyZWQuR2V0QVBJU0RvY3VtZW50KCkuRmlyc3RuYW1lLnJlcGxhY2UoXCIgXCIsIFwiXCIpID09IHRoaXMuU3VmZml4Q2hlY2socGFzcy5GaXJzdG5hbWUpICYmIHRoaXMuX3NoYXJlZC5HZXRBUElTRG9jdW1lbnQoKS5TdXJuYW1lLnJlcGxhY2UoXCIgXCIsIFwiXCIpID09IHBhc3MuTGFzdG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZVBhc3NlbmdlcisrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG11bHRpcGxlUGFzc2VuZ2VyID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk11bHRpcGxlIG1hdGNoIGZvdW5kLiBTY2FubmVkIGRhdGEgaXMgaWdub3JlZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRBUElTRG9jdW1lbnQobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvQ2hlY2tpbihpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoZGF0YS5XYXJuaW5nc1swXS5NZXNzYWdlKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFzc2VuZ2VyTGVuZ3RoID0gUGFzc2VuZ2VyQXJyYXkuU2VnbWVudC5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3Nlbmdlckxlbmd0aCA9PSBTZWdJbm5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0QmFnVGFnKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRTZWdtZW50RGV0YWlsKFBhc3NlbmdlckFycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbXVsdGlwbGVQYXNzZW5nZXI6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpLlBhc3NlbmdlcnMuZm9yRWFjaCgocGFzcywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NoYXJlZC5HZXRBUElTRG9jdW1lbnQoKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2hhcmVkLkdldEFQSVNEb2N1bWVudCgpLkZpcnN0bmFtZS5yZXBsYWNlKFwiIFwiLCBcIlwiKSA9PSB0aGlzLlN1ZmZpeENoZWNrKHBhc3MuRmlyc3RuYW1lKSAmJiB0aGlzLl9zaGFyZWQuR2V0QVBJU0RvY3VtZW50KCkuU3VybmFtZS5yZXBsYWNlKFwiIFwiLCBcIlwiKSA9PSBwYXNzLkxhc3RuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlwbGVQYXNzZW5nZXIrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtdWx0aXBsZVBhc3NlbmdlciA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJNdWx0aXBsZSBtYXRjaCBmb3VuZC4gU2Nhbm5lZCBkYXRhIGlzIGlnbm9yZWRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0QVBJU0RvY3VtZW50KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGVUb0NoZWNraW4oaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNFcnJvck9jY3VyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLl9kYXRhU2VydmljZS5HZXRCYWdnYWdlKGlkKS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5fc2hhcmVkLlNldEJhZ2dhZ2VjYXRhbG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcImVyclwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBsZXQgZXJyb3I6IGFueSA9IHsgXCJFcnJvcnNcIjogW3sgXCJNZXNzYWdlXCI6IGVyciB9XSwgXCJTdWNjZXNzXCI6IGZhbHNlIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRCYWdnYWdlY2F0YWxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RpZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLl9kYXRhU2VydmljZS5UaWVyKHNldGRlcGFydHVyZURhdGUsIHNldGZsaWdodG51bWJlciwgc2V0Y2l0eSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5fc2hhcmVkLlNldEJhZ1RhZyhudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGxldCB0aWVyOiBhbnkgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFRpZXIodGllcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRTZWdtZW50RGV0YWlsKFBhc3NlbmdlckFycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGxldCBtdWx0aXBsZVBhc3NlbmdlcjpudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpLlBhc3NlbmdlcnMuZm9yRWFjaCgocGFzcyxpbmRleCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBpZih0aGlzLl9zaGFyZWQuR2V0QVBJU0RvY3VtZW50KCkhPW51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2hhcmVkLkdldEFQSVNEb2N1bWVudCgpLkZpcnN0bmFtZS5yZXBsYWNlKFwiIFwiLCBcIlwiKSA9PSB0aGlzLlN1ZmZpeENoZWNrKHBhc3MuRmlyc3RuYW1lKSAmJiB0aGlzLl9zaGFyZWQuR2V0QVBJU0RvY3VtZW50KCkuU3VybmFtZS5yZXBsYWNlKFwiIFwiLCBcIlwiKSA9PSBwYXNzLkxhc3RuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZVBhc3NlbmdlcisrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBpZiAobXVsdGlwbGVQYXNzZW5nZXIgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJNdWx0aXBsZSBtYXRjaCBmb3VuZC4gU2Nhbm5lZCBkYXRhIGlzIGlnbm9yZWRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRBUElTRG9jdW1lbnQobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvQ2hlY2tpbihpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLm5hdmlnYXRlVG9DaGVja2luKGlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRTZWdtZW50RGV0YWlsKFBhc3NlbmdlckFycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuU2VnbWVudHMgIT0gbnVsbCAmJiBkYXRhLlNlZ21lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJOb3QgYWJsZSB0byBwcm9jZXNzIC0gZ28gdG8gY291bnRlclwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJObyByZXNlcnZhdGlvbnMgYXJlIGZvdW5kXCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk5vdCBhYmxlIHRvIHByb2Nlc3MgLSBnbyB0byBjb3VudGVyXCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuRXJyb3JzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuRXJyb3JzLmZvckVhY2goKGVycm9yLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGVycm9yLk1lc3NhZ2UpLnNob3coKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLlNlZ21lbnRzICE9IG51bGwgJiYgZGF0YS5TZWdtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk5vdCBhYmxlIHRvIHByb2Nlc3MgLSBnbyB0byBjb3VudGVyXCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiTm8gcmVzZXJ2YXRpb25zIGFyZSBmb3VuZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLFxyXG4gICAgICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IFBhc3NlbmdlciBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBQYXNzZW5nZXIgU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlRGF0ZSkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgU3VmZml4Q2hlY2soZmlyc3ROYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBzdWZmaXhMaXN0ID0gZmlyc3ROYW1lLnNwbGl0KHRoaXMuX3NoYXJlZC5HZXRBUElTRG9jdW1lbnQoKS5GaXJzdG5hbWUucmVwbGFjZShcIiBcIiwgXCJcIikpO1xyXG4gICAgICAgIGxldCBnaXZlbk5hbWU6IHN0cmluZyA9ICcnXHJcbiAgICAgICAgaWYgKHN1ZmZpeExpc3QubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICBnaXZlbk5hbWUgPSB0aGlzLl9zaGFyZWQuR2V0QVBJU0RvY3VtZW50KCkuRmlyc3RuYW1lLnJlcGxhY2UoXCIgXCIsIFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZ2l2ZW5OYW1lID0gZmlyc3ROYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZ2l2ZW5OYW1lO1xyXG4gICAgfVxyXG4gICAgR2V0UGF4YnlFdGlja2V0KGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcclxuICAgICAgICB0aGlzLkVUS1ROdW1iZXIgPSBpZC50b1N0cmluZygpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgU2VhcmNoUGF4QnlFdGlja2V0IFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlYXJjaC5TZWFyY2hQYXhCeUV0aWNrZXQoaWQpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRQYXNzZW5nZXJFVGlja2V0KDxPcmRlci5Sb290T2JqZWN0PmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLklEICE9IG51bGwgJiYgZGF0YS5TZWdtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuR2V0T3JkZXJEZXRhaWxzKGRhdGEuSUQsIHRoaXMuRVRLVE51bWJlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZGF0YS5TZWdtZW50cy5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwidW5hYmxlIHRvIHByb2Nlc3MgLSBHbyB0byBjb3VudGVyXCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRvYXN0Lm1ha2VUZXh0KFwiTm8gcmVzZXJ2YXRpb25zIGFyZSBmb3VuZFwiKS5zaG93KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBTZWFyY2hQYXhCeUV0aWNrZXQgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlRGF0ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgU2VhcmNoUGF4QnlFdGlja2V0IFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZWFyY2goKSB7XHJcblxyXG4gICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwic2VhcmNoZGF0YVwiLCBKU09OLnN0cmluZ2lmeSh0aGlzLlNlYXJjaEZpZWxkcykpO1xyXG4gICAgICAgIHRoaXMuRVRLVE51bWJlciA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHRoaXMuU2VhcmNoRmllbGRzLkZsaWdodE5vLnRyaW0oKSAhPSBcIlwiICYmIHRoaXMuU2VhcmNoRmllbGRzLkxhc3ROYW1lLnRyaW0oKSAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLlNlYXJjaEZpZWxkcy5GbGlnaHROby5zdWJzdHJpbmcoMCwgMikudG9VcHBlckNhc2UoKSAhPSAnQ00nKSB0aGlzLlNlYXJjaEZpZWxkcy5GbGlnaHRObyA9IFwiQ01cIiArIHRoaXMuU2VhcmNoRmllbGRzLkZsaWdodE5vO1xyXG4gICAgICAgICAgICB0aGlzLmdldFBheGJ5RmxpZ2h0KHRoaXMuU2VhcmNoRmllbGRzLkxhc3ROYW1lLCBtb21lbnQodGhpcy5zdGFydERhdGUsIFwiTU0vZGQveXlcIikuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSwgdGhpcy5TZWFyY2hGaWVsZHMuRmxpZ2h0Tm8sIFwiUFRZXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJQbGVhc2UgZW50ZXIgU2VhcmNoIHN0cmluZ3NcIikuc2hvdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgU2VhcmNoQW55KCkge1xyXG4gICAgICAgIGlmICh0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkudHJpbSgpICE9IFwiXCIgfHwgdGhpcy5pc0FueVNlYXJjaEVtcHR5ID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkubGVuZ3RoID09IDYgfHwgdGhpcy5TZWFyY2hGaWVsZHMuU2VhcmNoQW55Lmxlbmd0aCA+IDAgfHwgdGhpcy5TZWFyY2hGaWVsZHMuU2VhcmNoQW55Lmxlbmd0aCA9PSAxMyB8fCB0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkubGVuZ3RoID09IDExKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5TZWFyY2hGaWVsZHMuU2VhcmNoQW55Lmxlbmd0aCA9PSA2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldEFQSVNEb2N1bWVudChudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0U2NhbkFQSVNEb2N1bWVudChudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkVUS1ROdW1iZXIgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuR2V0T3JkZXJEZXRhaWxzKHRoaXMuU2VhcmNoRmllbGRzLlNlYXJjaEFueSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkubGVuZ3RoID09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlZyA9IG5ldyBSZWdFeHAoJ15bYS16QS1aXSskJylcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVnLnRlc3QodGhpcy5TZWFyY2hGaWVsZHMuU2VhcmNoQW55LnRvU3RyaW5nKCkuc3Vic3RyKDAsIDEpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZnF0dm51bTEgPSB0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkudG9TdHJpbmcoKS5zdWJzdHIoMCwgMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmcXR2bnVtMiA9IHRoaXMuU2VhcmNoRmllbGRzLlNlYXJjaEFueS50b1N0cmluZygpLnN1YnN0cigyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZxdHZudW0zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmcXR2bnVtMi5zcGxpdCgnLycpLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZxdHZudW0zID0gZnF0dm51bTEgKyBcIiUyRlwiICsgZnF0dm51bTIuc3BsaXQoJy8nKVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZxdHZudW0zID0gZnF0dm51bTEgKyBcIiUyRlwiICsgZnF0dm51bTIuc3BsaXQoJy8nKVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZxdHZcIiArIGZxdHZudW0zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5TZWFyY2hGaWVsZHMuU2VhcmNoQW55ID0gZnF0dm51bTM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0UGF4YnlGUVRWSUQoZnF0dm51bTMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRQYXNzZW5nZXJFVGlja2V0KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkdldFBheGJ5RXRpY2tldCh0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBlbHNlIGlmICh0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkubGVuZ3RoID09IDEyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5FVEtUTnVtYmVyPVwiXCI7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgbGV0IGZxdHZudW0xID0gdGhpcy5TZWFyY2hGaWVsZHMuU2VhcmNoQW55LnRvU3RyaW5nKCkuc3Vic3RyKDAsIDIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vICAgICBsZXQgZnF0dm51bTIgPSB0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkudG9TdHJpbmcoKS5zdWJzdHIoMik7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgbGV0IGZxdHZudW0zID0gZnF0dm51bTEgKyBcIiUyRlwiICsgZnF0dm51bTIuc3BsaXQoJy8nKVsxXTtcclxuICAgICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcImZxdHZcIiArIGZxdHZudW0zKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkgPSBmcXR2bnVtMztcclxuICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLmdldFBheGJ5RlFUVklEKHRoaXMuU2VhcmNoRmllbGRzLlNlYXJjaEFueSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gdGhpcy5uYXZpZ2F0ZVRvRlFUVih0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByZWcgPSBuZXcgUmVnRXhwKCdeW2EtekEtWl0rJCcpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZy50ZXN0KHRoaXMuU2VhcmNoRmllbGRzLlNlYXJjaEFueS50b1N0cmluZygpLnN1YnN0cigwLCAxKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZxdHZudW0xID0gdGhpcy5TZWFyY2hGaWVsZHMuU2VhcmNoQW55LnRvU3RyaW5nKCkuc3Vic3RyKDAsIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZnF0dm51bTIgPSB0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkudG9TdHJpbmcoKS5zdWJzdHIoMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmcXR2bnVtM1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZnF0dm51bTIuc3BsaXQoJy8nKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcXR2bnVtMyA9IGZxdHZudW0xICsgXCIlMkZcIiArIGZxdHZudW0yLnNwbGl0KCcvJylbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcXR2bnVtMyA9IGZxdHZudW0xICsgXCIlMkZcIiArIGZxdHZudW0yLnNwbGl0KCcvJylbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmcXR2XCIgKyBmcXR2bnVtMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuU2VhcmNoRmllbGRzLlNlYXJjaEFueSA9IGZxdHZudW0zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFBheGJ5RlFUVklEKGZxdHZudW0zKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQW55U2VhcmNoRW1wdHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJQbGVhc2UgZW50ZXIgdmFsaWQgaW5wdXRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNBbnlTZWFyY2hFbXB0eSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIlBsZWFzZSBlbnRlciB2YWxpZCBpbnB1dFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgU2Nhbih0eXBlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoaXNJT1MpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnNpZGUgU0NBTlwiKTtcclxuICAgICAgICAgICAgbGV0IGxhc3RuYW1lOiBTdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0QVBJU0RvY3VtZW50KG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0U2NhbkFQSVNEb2N1bWVudChudWxsKTtcclxuICAgICAgICAgICAgLy8gbGV0IGxpY2Vuc2VLZXkgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcImxpY2Vuc2VLZXlcIiwnJyk7XHJcbiAgICAgICAgICAgIGxldCBsaWNlbnNlS2V5ID0gXCJzUndBQUFFalkyOXRMbU52Y0dGaGFYSXVZM056Ylc5aWFXeGxZV2x5Y0c5eWRIUmhZbXhsZEhNNHg5SXZCd0hVRDdKY0MvVGtIbHFCbVRtNWZQT3hFYlJSSWpEY3RwS1JWUHBvKzRuM1lXZmQyZUgzMlVDUTFHUXNER0RpRFEybk5vRmFVWXVubWhJODhXSmV1RmQvZ2Q4Sk94b3hyVVh2TmJQU3FkWnRpN082cDNWQlJhbDBOeFY1VFpwTUhFWEc2ci8xcTZnSHk0VWIzK014Y01iMzMyY01ZczJkNTJoSlBkV3UyWXVIUXJ5RlZWbVNXUjN4MzNOaXI5ZXVPSTF5amdmOWV6bFJBQ2d4dDRCa1phbW4zRHIvV3FDakozbWhPSmxRZXY4WjVmQVk0VU82WTVtenFoSHlmcXp0TVpjanVRPT1cIjtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobGljZW5zZUtleSk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiUGFzc3BvcnRcIikge1xyXG4gICAgICAgICAgICAgICAgZGlkVGFwU2Nhbih0eXBlLCBsaWNlbnNlS2V5KS50aGVuKChtcnRkZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKG1ydGRkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihtcnRkZGF0YS5tcnpUZXh0KCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLy9tcnRkZGF0YS5kb2N1bWVudENvZGUoKSttcnRkZGF0YS5uYXRpb25hbGl0eSgpK21ydGRkYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobXJ0ZGRhdGEuZG9jdW1lbnRDb2RlKCkuc3BsaXQoJzwnKVswXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobXJ0ZGRhdGEuZG9jdW1lbnRDb2RlKCkuc3BsaXQoJzsnKVswXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1NjYW5uZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkb2NUeXBlOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWFyY2hGaWVsZHMuTGFzdE5hbWUgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICBpZiAobXJ0ZGRhdGEuZG9jdW1lbnRDb2RlKCkuc3BsaXQoJzwnKVswXS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY1R5cGUgPSBtcnRkZGF0YS5kb2N1bWVudENvZGUoKS5zcGxpdCgnPCcpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChtcnRkZGF0YS5kb2N1bWVudENvZGUoKS5zcGxpdCgnOycpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jVHlwZSA9IG1ydGRkYXRhLmRvY3VtZW50Q29kZSgpLnNwbGl0KCc7JylbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb2NUeXBlLnN1YnN0cigwLCAxKSA9PSBcIlBcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0bmFtZSA9IG1ydGRkYXRhLnByaW1hcnlJZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwaXNEb2N1bWVudC5TdXJuYW1lID0gbXJ0ZGRhdGEucHJpbWFyeUlkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpc0RvY3VtZW50LkZpcnN0bmFtZSA9IG1ydGRkYXRhLnNlY29uZGFyeUlkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpc0RvY3VtZW50LkRvY0hvbGRlck5hdGlvbmFsaXR5ID0gbXJ0ZGRhdGEubmF0aW9uYWxpdHkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGlzRG9jdW1lbnQuQmlydGhEYXRlID0gbW9tZW50KG1ydGRkYXRhLmRhdGVPZkJpcnRoKCkuc3BsaXQoJy8nKVsxXSArIFwiL1wiICsgbXJ0ZGRhdGEuZGF0ZU9mQmlydGgoKS5zcGxpdCgnLycpWzBdICsgXCIvXCIgKyBtcnRkZGF0YS5kYXRlT2ZCaXJ0aCgpLnNwbGl0KCcvJylbMl0pLmZvcm1hdChcIk1NL0REL1lZWVlcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpc0RvY3VtZW50LkV4cGlyZURhdGUgPSBtb21lbnQobXJ0ZGRhdGEuZGF0ZU9mRXhwaXJ5KCkuc3BsaXQoJy8nKVsxXSArIFwiL1wiICsgbXJ0ZGRhdGEuZGF0ZU9mRXhwaXJ5KCkuc3BsaXQoJy8nKVswXSArIFwiL1wiICsgbXJ0ZGRhdGEuZGF0ZU9mRXhwaXJ5KCkuc3BsaXQoJy8nKVsyXSkuZm9ybWF0KFwiTU0vREQvWVlZWVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYodGhpcy5Db3VudHJ5RGV0YWlscy5Db2xsZWN0aW9uLmZpbHRlcihtID0+bS5Db3VudHJ5Q29kZT09bXJ0ZGRhdGEuaXNzdWVyKCkuc3Vic3RyKDAsIDIpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGlzRG9jdW1lbnQuRG9jSXNzdWVDb3VudHJ5ID0gbXJ0ZGRhdGEuaXNzdWVyKCk7Ly8uc3Vic3RyKDAsIDIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcGlzRG9jdW1lbnQuQ291bnRyeU9mUmVzaWRlbmNlID0gbnVsbC8vLnN1YnN0cigwLCAyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpc0RvY3VtZW50Lk9DUlN0cmluZyA9IG1ydGRkYXRhLm1yelRleHQoKS5yZXBsYWNlKFwiXFxuXCIsIFwiXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1ydGRkYXRhLnNleCgpID09IFwiTVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwaXNEb2N1bWVudC5Eb2NIb2xkZXJHZW5kZXIgPSBcIjBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBpc0RvY3VtZW50LkRvY0hvbGRlckdlbmRlciA9IFwiMVwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwaXNEb2N1bWVudC5Eb2NJRCA9IG1ydGRkYXRhLmRvY3VtZW50TnVtYmVyKCkuc3BsaXQoJzwnKVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZWFyY2hGaWVsZHMuTGFzdE5hbWUgPSBsYXN0bmFtZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh0aGlzLmFwaXNEb2N1bWVudCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldEFQSVNEb2N1bWVudCh0aGlzLmFwaXNEb2N1bWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRTY2FuQVBJU0RvY3VtZW50KHRoaXMuYXBpc0RvY3VtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiU2NhbiBEb2N1bWVudCBpcyBub3QgdmFsaWRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGRpZFRhcFNjYW4odHlwZSwgbGljZW5zZUtleSkudGhlbigocGRmNDE3ZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTY2FubmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZTogU3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBwZGY0MTdkYXRhLnN0cmluZ1VzaW5nR3Vlc3NlZEVuY29kaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkgPSBtZXNzYWdlLnRvU3RyaW5nKCkuc3Vic3RyKDIzLCA2KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuR2V0T3JkZXJEZXRhaWxzKHRoaXMuU2VhcmNoRmllbGRzLlNlYXJjaEFueSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiU3VwcG9ydGVkIG9ubHkgaW4gSU9TXCIpLnNob3coKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuaXNMYXN0ZGlydHkgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmlzRmxpZ2h0ZGlydHkgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmlzU2VhcmNoYW55ZGlydHkgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuU2VhcmNoRmllbGRzLkZsaWdodE5vID0gXCJcIjtcclxuICAgICAgICB0aGlzLlNlYXJjaEZpZWxkcy5MYXN0TmFtZSA9IFwiXCI7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0UGF4YnlGbGlnaHQobmFtZTogc3RyaW5nLCBkYXRlOiBzdHJpbmcsIGZsaWdodGNvZGU6IHN0cmluZywgbG9jYXRpb25jb2RlOiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlYXJjaEFsbFBheEJ5RmxpZ2h0IFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmRlcGFydHVyZVNlcnZpY2UuU2VhcmNoQWxsUGF4QnlGbGlnaHQobmFtZS5yZXBsYWNlKFwiIFwiLCBcIlwiKSwgZGF0ZSwgZmxpZ2h0Y29kZSwgdGhpcy5TZWFyY2hGaWVsZHMuTG9jYXRpb24pXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuU3VjY2VzcyAhPSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRpcig8T3JkZXIuUGFzc2VuZ2VyRGV0YWlsTGlzdD5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QYXNzZW5nZXJEZXRhaWxzID0gPE9yZGVyLlBhc3NlbmdlckRldGFpbExpc3Q+ZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlBhc3Nlbmdlckxpc3ROZXcgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb1BheEJ5RmxpZ2h0VGVtcGxhdGVOZXcodGhpcy5QYXNzZW5nZXJEZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUGFzc2VuZ2VyTGlzdE5ldy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5TZWFyY2hGaWVsZHMuU2VhcmNoQW55ID0gdGhpcy5QYXNzZW5nZXJMaXN0TmV3WzBdLk9yZGVySUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLlNlYXJjaEFueSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTY2FubmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5fc2hhcmVkLlNldEFQSVNEb2N1bWVudChudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkdldE9yZGVyRGV0YWlscyh0aGlzLlBhc3Nlbmdlckxpc3ROZXdbMF0uT3JkZXJJRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0QVBJU0RvY3VtZW50KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRTY2FuQVBJU0RvY3VtZW50KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuR2V0T3JkZXJEZXRhaWxzKHRoaXMuUGFzc2VuZ2VyTGlzdE5ld1swXS5PcmRlcklEKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLlBhc3Nlbmdlckxpc3ROZXcubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFBheENvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGFzc2VuZ2VyTGlzdE5ldy5mb3JFYWNoKChQYXhEYXRhLCBQYXhJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChQYXhEYXRhLk9yZGVySUQgPT0gdGhpcy5QYXNzZW5nZXJMaXN0TmV3WzBdLk9yZGVySUQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGF4Q291bnQgPSBQYXhDb3VudCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFBheENvdW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChQYXhDb3VudCA9PSB0aGlzLlBhc3Nlbmdlckxpc3ROZXcubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTY2FubmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSEVSRVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkdldE9yZGVyRGV0YWlscyh0aGlzLlBhc3Nlbmdlckxpc3ROZXdbMF0uT3JkZXJJRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldEFQSVNEb2N1bWVudChudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldFNjYW5BUElTRG9jdW1lbnQobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuR2V0T3JkZXJEZXRhaWxzKHRoaXMuUGFzc2VuZ2VyTGlzdE5ld1swXS5PcmRlcklEKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcInBhc3Nlbmdlcmxpc3RcIiwgSlNPTi5zdHJpbmdpZnkodGhpcy5QYXNzZW5nZXJMaXN0TmV3KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG11bHRpcGxlUGFzc2VuZ2VyOiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUGFzc2VuZ2VyTGlzdE5ldy5mb3JFYWNoKChwYXNzLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2hhcmVkLkdldEFQSVNEb2N1bWVudCgpICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zaGFyZWQuR2V0QVBJU0RvY3VtZW50KCkuRmlyc3RuYW1lLnJlcGxhY2UoXCIgXCIsIFwiXCIpID09IHRoaXMuU3VmZml4Q2hlY2socGFzcy5GaXJzdE5hbWUpICYmIHRoaXMuX3NoYXJlZC5HZXRBUElTRG9jdW1lbnQoKS5TdXJuYW1lLnJlcGxhY2UoXCIgXCIsIFwiXCIpID09IHBhc3MuTGFzdE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZVBhc3NlbmdlcisrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG11bHRpcGxlUGFzc2VuZ2VyID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk11bHRpcGxlIG1hdGNoIGZvdW5kLiBTY2FubmVkIGRhdGEgaXMgaWdub3JlZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRBUElTRG9jdW1lbnQobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9TZWFyY2hSZXN1bHRzKEpTT04uc3RyaW5naWZ5KHRoaXMuUGFzc2VuZ2VyTGlzdE5ldykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiUGFzc2VuZ2VyIGRldGFpbHMgYXJlIG5vdCBmb3VuZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRvYXN0Lm1ha2VUZXh0KGRhdGEuRXJyb3JNZXNzYWdlKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiUGFzc2VuZ2VyIGRldGFpbHMgYXJlIG5vdCBmb3VuZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluIGluZm9ybWF0aW9uIGZvciB0aGlzIHNlYXJjaCBcIiArIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJDb3VsZG50IGZpbmQgaW5mb3JtYXRpb24gZm9yIHRoaXMgc2VhcmNoIFwiICsgZXJyb3IpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0RhdGEgUmV0cmlldmVkIHN1Y2Nlc3NmdWxseScgKyB0aGlzLlBhc3NlbmdlckRldGFpbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2VhcmNoQWxsUGF4QnlGbGlnaHQgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlRGF0ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWFyY2hBbGxQYXhCeUZsaWdodCBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIExhc3ROYW1lRW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMYXN0TmFtZUVtcHR5ICYmIHRoaXMuaXNMYXN0ZGlydHkgJiYgdGhpcy5pc251bWJlciA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5pc251bWJlciA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIEZsaWdodEVtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmlzRmxpZ2h0RW1wdHkgJiYgdGhpcy5pc0ZsaWdodGRpcnR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIFNlYXJjaGVtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmlzQW55U2VhcmNoRW1wdHkgJiYgdGhpcy5pc1NlYXJjaGFueWRpcnR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UHJvZmlsZSgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldEFjY291bnRQcm9maWxlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9ob21lcGFnZS5HZXRBY2NvdW50UHJvZmlsZSgpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUZXN0MVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlByb2ZpbGVEZXRhaWxzID0gPE9yZGVyLlJvb3RPYmplY3Q+ZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlByb2ZpbGVBcnJheSA9IENvbnZlcnRlcnMuQ29udmVydFRvQWNjb3VudFByb2ZpbGVUZW1wbGF0ZSh0aGlzLlByb2ZpbGVEZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlNlYXJjaEZpZWxkcy5Mb2NhdGlvbiA9IHRoaXMuUHJvZmlsZUFycmF5WzBdLkFpcnBvcnRDb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlcmRldGFpbHMgPSB0aGlzLlNlYXJjaEZpZWxkcy5Mb2NhdGlvbiArIFwiIHwgXCIgKyBtb21lbnQoKS5mb3JtYXQoXCJERCBNTU0gWVlZWVwiKSArIFwiIHwgXCIgKyB0aGlzLlByb2ZpbGVBcnJheVswXS5Vc2VybmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcInVzZXJkZXRhaWxzXCIsIHRoaXMudXNlcmRldGFpbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ291bGRudCBmaW5kIGluZm9ybWF0aW9uIGZvciB0aGlzIFByb2ZpbGUgXCIgKyBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0RhdGEgUmV0cmlldmVkIHN1Y2Nlc3NmdWxseScgKyB0aGlzLlNlYXJjaEZpZWxkcy5Mb2NhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgIHZhciBlRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXRBY2NvdW50UHJvZmlsZSBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldEFjY291bnRQcm9maWxlIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFBheGJ5RlFUVklEKGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcclxuICAgICAgICB0aGlzLkVUS1ROdW1iZXIgPSBcIlwiO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWFyY2hQYXhCeUZRVFZJRCBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBTdGFydCBEYXRlIFRpbWUgOiAnICsgc0RhdGUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImdldFBheGJ5RlFUVklEIGNhbGxlZCBcIiArIGlkKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VhcmNoLlNlYXJjaFBheEJ5RlFUVklEKGlkKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRlFUVkFycmF5ID0gQ29udmVydGVycy5Db252ZXJ0VG9GUVRWVGVtcGxhdGUoPEZRVFYuUm9vdE9iamVjdD5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5GUVRWQXJyYXkgPT0gbnVsbCB8fCB0aGlzLkZRVFZBcnJheS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiTm8gcmVzZXJ2YXRpb25zIGFyZSBmb3VuZFwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLm5hdmlnYXRlVG9TZWFyY2goKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGVUb0ZRVFYoSlNPTi5zdHJpbmdpZnkodGhpcy5GUVRWQXJyYXkpLCB0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9jaGVja2luXCJdKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk5vIHJlc2VydmF0aW9ucyBhcmUgZm91bmRcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLm5hdmlnYXRlVG9TZWFyY2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZG50IGZpbmQgaW5mb3JtYXRpb24gZm9yIHRoaXMgT3JkZXJJRCBcIiArIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ0RhdGEgUmV0cmlldmVzdWNjZXNzZnVsbHknICsgdGhpcy5QYXNzZW5nZXJEZXRhaWxzKTsgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuUGFzc2VuZ2VyQXJyYXkubGVuZ3RoKTsgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2VhcmNoUGF4QnlGUVRWSUQgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlRGF0ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWFyY2hQYXhCeUZRVFZJRCBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuYXZpZ2F0ZVRvQ2hlY2tpbihwYXJhbTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImNoZWNraW5cIl0sIHtcclxuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBxdWVyeVBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgXCJkYXRhXCI6IHBhcmFtLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBuYXZpZ2F0ZVRvRlFUVihwYXJhbTogc3RyaW5nLCBmcXR2bnVtKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImZxdHZsaXN0XCJdLCB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIFwiZGF0YVwiOiBwYXJhbSxcclxuICAgICAgICAgICAgICAgIFwiZnF0dm51bVwiOiBmcXR2bnVtXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgbmF2aWdhdGVUb1NlYXJjaFJlc3VsdHMocGFyYW06IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZWFyY2hyZXN1bHRcIl0sIHtcclxuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBxdWVyeVBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgXCJkYXRhXCI6IHBhcmFtXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBuYXZpZ2F0ZVRvRGVwYXJ0dXJlcygpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0dhdGVEaXNhYmxlZCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJkZXBhcnRob21lXCJdLCB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBuYXZpZ2F0ZVRvTG9naW4oKSB7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIlwiXSwge1xyXG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBuYXZpZ2F0ZVRvSG9tZSgpIHtcclxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiaG9tZVwiXSwge1xyXG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgbUNhbGxiYWNrID0gKChyZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHZhciBjID0gbW9tZW50KHJlc3VsdCwgXCJERCBNTSBZWVlZIEhIOm1tIFpaXCIpLmZvcm1hdChcIkREIE1NTU0gWVlZWVwiKTtcclxuICAgICAgICAgICAgdGhpcy5TZWFyY2hGaWVsZHMuRmxpZ2h0RGF0ZSA9IGM7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY3JlYXRlTW9kZWxWaWV3KGFyZ3MpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGN1cnJlbnREYXRlID0gdGhpcy5zdGFydERhdGU7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGFydERhdGUpO1xyXG4gICAgICAgIGxldCBvcHRpb25zOiBNb2RhbERpYWxvZ09wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMudmNSZWYsXHJcbiAgICAgICAgICAgIGNvbnRleHQ6IHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnREYXRlOiBjdXJyZW50RGF0ZS50b0RhdGVTdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlIZWFkZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtaW5EYXRlOiBtb21lbnQobmV3IERhdGUoKSkuc3VidHJhY3QoMSwgJ2RheXMnKS50b0RhdGUoKS50b0RhdGVTdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgIG1heERhdGU6IG1vbWVudChuZXcgRGF0ZSgpKS5hZGQoMiwgJ2RheXMnKS50b0RhdGUoKS50b0RhdGVTdHJpbmcoKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmdWxsc2NyZWVuOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX21vZGFsU2VydmljZS5zaG93TW9kYWwoRGF0ZVBpY2tlck1vZGFsLCBvcHRpb25zKVxyXG4gICAgICAgICAgICAudGhlbigoZGF0ZXJlc3VsdDogRGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGVyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGUgcmVzdWx0IFwiICsgZGF0ZXJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGVyZXN1bHQudG9EYXRlU3RyaW5nKCkgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydERhdGUgPSBkYXRlcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBvbm9wZW4oKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEcm9wIERvd24gb3BlbmVkLlwiKTtcclxuICAgIH1cclxuICAgIG9uQ2hhbmdlKGFyZ3M6IGFueSwgaW5kZXg6IGFueSkge1xyXG4gICAgICAgIHRoaXMuX3RpbWVvdXRTZXJ2aWNlLnJlc2V0V2F0Y2goKTtcclxuICAgICAgICBzd2l0Y2ggKGluZGV4KSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzRmxpZ2h0RW1wdHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNMYXN0TmFtZUVtcHR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5TZWFyY2hGaWVsZHMuU2VhcmNoQW55ICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQW55U2VhcmNoRW1wdHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU2VhcmNoYW55ZGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuU2VhcmNoRmllbGRzLlNlYXJjaEFueS5sZW5ndGggPj0gNikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNWYWxpZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1ZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnXlthLXpBLVowLTktL10qJCcpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlc3QgPSByZWcudGVzdCh0aGlzLlNlYXJjaEZpZWxkcy5TZWFyY2hBbnkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRlc3QgPT0gZmFsc2UpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0FueVNlYXJjaEVtcHR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQW55U2VhcmNoRW1wdHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzQW55U2VhcmNoRW1wdHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLlNlYXJjaEZpZWxkcy5GbGlnaHRObyA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0ZsaWdodEVtcHR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNGbGlnaHRFbXB0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNGbGlnaHRkaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnXlthLXpBLVowLTldKiQnKTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gcmVnLnRlc3QodGhpcy5TZWFyY2hGaWVsZHMuRmxpZ2h0Tm8pO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmbGlnaHRudW1cIiArIHRlc3QpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRlc3QgPT0gZmFsc2UgfHwgdGhpcy5TZWFyY2hGaWVsZHMuRmxpZ2h0Tm8gPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiUHJvcGVyIGZsaWdodCBudW1iZXJcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRmxpZ2h0RW1wdHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0ZsaWdodEVtcHR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNBbnlTZWFyY2hFbXB0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuU2VhcmNoRmllbGRzLkxhc3ROYW1lID09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTGFzdE5hbWVFbXB0eSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7IHRoaXMuaXNMYXN0TmFtZUVtcHR5ID0gZmFsc2U7IHRoaXMuaXNMYXN0ZGlydHkgPSB0cnVlOyB9XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnXlthLXpBLVogXSskJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRlc3QgPSByZWcudGVzdCh0aGlzLlNlYXJjaEZpZWxkcy5MYXN0TmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGVzdCA9PSBmYWxzZSAmJiB0aGlzLlNlYXJjaEZpZWxkcy5MYXN0TmFtZSAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc251bWJlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJPbmx5IGFscGhhYmV0c1wiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHsgdGhpcy5pc251bWJlciA9IGZhbHNlOyB9XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0ZXN0KTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuU2VhcmNoRmllbGRzLkxhc3ROYW1lLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNudW1iZXIgPT0gdHJ1ZSB8fCB0aGlzLlNlYXJjaEZpZWxkcy5GbGlnaHRObyA9PSBcIlwiIHx8IHRoaXMuU2VhcmNoRmllbGRzLkxhc3ROYW1lID09IFwiXCIgfHwgdGhpcy5pc0xhc3ROYW1lRW1wdHkgPT0gdHJ1ZSB8fCB0aGlzLmlzRmxpZ2h0RW1wdHkgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG5hdmlnYXRlVG9TZXR0aW5nKCkge1xyXG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZXR0aW5nXCJdLCB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlU2VydmljZUVycm9yKGVycm9yOiBhbnkpIHtcclxuICAgICAgICB2YXIgZXJyb3JNZXNzYWdlID0gZXJyb3IudG9TdHJpbmcoKTtcclxuICAgICAgICBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJTZXNzaW9uVGltZW91dFwiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiU2Vzc2lvbiBUaW1lIE91dFwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGJlZW4gdGltZSBvdXRcIixcclxuICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPS1wiXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiXCJdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGVycm9yTWVzc2FnZSkuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuYXZpZ2F0ZVRvQ29tcGVuc2F0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzQ29tcGVuc2F0aW9uRW5hYmxlZCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJjb21wZW5zYXRpb25cIl0sIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiQ29tcGVuc2F0aW9uIE5vdCBhcHBsaWNhYmxlXCIpLnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0=