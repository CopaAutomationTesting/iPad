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
var moment = require("moment");
var Toast = require("nativescript-toast");
var index_1 = require("../../shared/services/index");
var index_2 = require("../../shared/interface/index");
var index_3 = require("../../shared/utils/index");
var fqtv_modal_1 = require("../../components/fqtv-modal/fqtv-modal");
var app_constants_1 = require("../../app.constants");
var FqtvComponent = /** @class */ (function () {
    function FqtvComponent(_checkin, page, _timeoutService, _service, routerExtensions, _modalService, _dataService, router, location, activatedRouter, vcRef, _shared) {
        this._checkin = _checkin;
        this.page = page;
        this._timeoutService = _timeoutService;
        this._service = _service;
        this.routerExtensions = routerExtensions;
        this._modalService = _modalService;
        this._dataService = _dataService;
        this.router = router;
        this.location = location;
        this.activatedRouter = activatedRouter;
        this.vcRef = vcRef;
        this._shared = _shared;
        //    public PassengerList: Array<PaxTemplate> = [];
        this.PassedPassengerDetail = new index_2.MultiSegmentTemplate.Passenger();
        this.fqtv2 = new index_2.FQTVPro.RootObject();
        this.fqtv = [];
        this.star = "";
        this.fqtvProgramID = "CM";
        this.FQTVList = [];
        this.isCompensationEnabled = false;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.FlightInfo = new index_2.MultiSegmentTemplate.FlightWithPax;
        this.MultiSegmentPaxArray = new index_2.MultiSegmentTemplate.RootObject;
        this.isError = false;
        this.loaderProgress = new index_2.LoaderProgress();
        this.errorMessage = "";
        this.isButtonEnabled = false;
        this.SelectedPassengerList = [];
    }
    FqtvComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.date = moment(new Date()).format("DD MMM YYYY");
        this.loaderProgress.initLoader(this.pageCont);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled");
        this.activatedRouter.queryParams.subscribe(function (params) {
            try {
                var RPHValue = JSON.parse(params["RPHValue"]);
                _this.index = JSON.parse(params["index"]);
                _this.MultiSegmentPaxArray = _this._shared.GetSegmentDetail();
                _this.MultiSegmentPaxArray.Segment.forEach(function (data, index) {
                    if (data.MarketingFlight == _this.MultiSegmentPaxArray.Segment[_this.index].MarketingFlight) {
                        _this.FlightInfo = data;
                    }
                });
                _this.FlightDate = moment(_this.MultiSegmentPaxArray.Segment[_this.index].FlightDate).format("DD-MMM-YYYY");
                _this.PassedPassengerDetail = _this.MultiSegmentPaxArray.Segment[_this.index].Passenger.filter(function (m) { return m.RPH == RPHValue; })[0];
                console.dir(_this.PassedPassengerDetail);
                //this.Tier();
                _this.FQTV();
                _this.fullname = _this.PassedPassengerDetail.FullName;
                _this.fqtvnum = _this.PassedPassengerDetail.FQTVNumber;
                _this.PassengerArray = _this.MultiSegmentPaxArray.Segment;
                _this.SegmentList = _this.MultiSegmentPaxArray.Segment[_this.index];
                var obj = new index_2.PassengerCheckin.SelectedPassenger();
                obj.FirstName = _this.PassedPassengerDetail.FirstName;
                obj.LastName = _this.PassedPassengerDetail.LastName;
                _this.SelectedPassengerList.push(obj);
                var fqtvProgramName_1 = "";
                if (_this.PassedPassengerDetail.ProgramIDxx != "") {
                    if (_this.MultiSegmentPaxArray.Segment[_this.index].Passenger[0].FqtvPrograms.filter(function (m) { return m.ProgramID == _this.PassedPassengerDetail.ProgramIDxx; })[0] != null) {
                        fqtvProgramName_1 = _this.MultiSegmentPaxArray.Segment[0].Passenger[0].FqtvPrograms.filter(function (m) { return m.ProgramID == _this.PassedPassengerDetail.ProgramIDxx; })[0].ProgramName;
                    }
                }
                else {
                    fqtvProgramName_1 = "CM/Copa Airlines";
                }
                if (_this.MultiSegmentPaxArray.Segment[0] != null) {
                    console.log(fqtvProgramName_1);
                    if (fqtvProgramName_1 != "") {
                        _this.MultiSegmentPaxArray.Segment[_this.index].Passenger.forEach(function (PaxData, PaxIndex) {
                            console.log("FQTV Programe Name" + PaxData.FqtvPrograms.length);
                            _this.fqtvProgramID = PaxData.FqtvPrograms.filter(function (m) { return m.ProgramName == fqtvProgramName_1; })[0].ProgramID;
                        });
                        _this._shared.GetPassenger().Passengers.forEach(function (element, index) {
                            if (element.Firstname == _this.PassedPassengerDetail.FirstName && element.Lastname == _this.PassedPassengerDetail.LastName) {
                                //element.FqtTravelers[0].ProgramID = this.fqtvProgramID;
                                _this.tier = '-';
                                if (element.FqtTravelers != null && element.FqtTravelers.length > 0) {
                                    if (element.FqtTravelers[0].AllianceTierLevel.Name != null && element.FqtTravelers[0].AllianceTierLevel != null) {
                                        _this.tier = element.FqtTravelers[0].TierLevel.Name;
                                        _this.star = element.FqtTravelers[0].AllianceTierLevel.Name;
                                        console.log(_this.star);
                                    }
                                    else {
                                        _this.tier = element.FqtTravelers[0].TierLevel.Name;
                                    }
                                }
                            }
                        });
                    }
                }
                _this.OrderId = _this.MultiSegmentPaxArray.Segment[_this.index].Passenger[0].OrderID;
                _this.airlineprogramcode = fqtvProgramName_1;
                console.log("Airlineprogramcode:" + _this.airlineprogramcode);
                console.log(_this.fqtvnum);
            }
            catch (Exception) {
                console.log(Exception.message);
            }
        });
        var label = this.pageCont.nativeElement;
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();
        });
    };
    FqtvComponent.prototype.refreshFlifo = function () {
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
                SegEle.inven = index_3.Converters.ConvertToInventory(inventory);
            }, function (error) {
                _this.handleServiceError(error);
                console.log(error);
                // this.loaderProgress.hideLoader();
            });
            //Inbound
            _this._checkin.InBound(departureDate, flightnumber, city)
                .subscribe(function (data) {
                var inBound = data;
                SegEle.inbound = index_3.Converters.ConvertToInBound(inBound);
            }, function (error) {
                _this.handleServiceError(error);
                console.log(error);
                // this.loaderProgress.hideLoader();
            });
            //Outbound
            _this._checkin.OutBound(departureDate, flightnumber, destination)
                .subscribe(function (data) {
                var OutBound = data;
                SegEle.outbound = index_3.Converters.ConvertToOutBound(OutBound);
            }, function (error) {
                _this.handleServiceError(error);
                console.log(error);
                // this.loaderProgress.hideLoader();
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
            }, function (error) {
                _this.handleServiceError(error);
                console.log(error);
                // this.loaderProgress.hideLoader();
            });
        });
    };
    FqtvComponent.prototype.FQTV = function () {
        var _this = this;
        this.fqtv1 = this._shared.GetFQTV();
        this.fqtv.length = 0;
        this.MultiSegmentPaxArray.Segment.forEach(function (SegEle, SegIndex) {
            SegEle.Passenger.forEach(function (PaxEle, PaxIndex) {
                PaxEle.FqtvPrograms = index_3.Converters.ConvertToFQTV(_this.fqtv1);
                console.dir(PaxEle.FqtvPrograms);
            });
        });
        this.MultiSegmentPaxArray.Segment[this.index].Passenger[0].FqtvPrograms.forEach(function (data, index) {
            _this.FQTVList.push(data.ProgramName);
        });
    };
    FqtvComponent.prototype.Tier = function () {
        var _this = this;
        var date = this.MultiSegmentPaxArray.Segment[this.index].DepartureDateTime.toString();
        var tierDate = date.substr(0, 10);
        var flightnumber = this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight;
        var city = this.MultiSegmentPaxArray.Segment[this.index].DepartureCity;
        this._dataService.Tier(tierDate, flightnumber, city)
            .subscribe(function (data) {
            _this.AllPassengerDeatils = data;
            _this.AllPassengerDeatils.PassengerList.forEach(function (Paxdata, index) {
                if (_this.PassedPassengerDetail.OrderID == Paxdata.OrderId) {
                    if (Paxdata.FqtTravelers == null) {
                        _this.tier = "-";
                    }
                    _this.tier = Paxdata.FqtTravelers[0].Allia;
                }
            });
        }, function (error) {
            _this.handleServiceError(error);
            console.log(error);
            _this.loaderProgress.hideLoader();
        });
    };
    FqtvComponent.prototype.confirmUpdate = function (id) {
        var _this = this;
        if (this._shared.GetBagTag() != null) {
            dialogs.confirm("Updating FQTV information would cause any pending transaction to be invalid. Baggage would need to be re-entered and re-priced").then(function (result) {
                console.log(result);
                if (result) {
                    _this._shared.SetBagTag(null);
                    _this.FQTVUpdate(id);
                }
            });
        }
        else {
            this.FQTVUpdate(id);
        }
    };
    FqtvComponent.prototype.FQTVUpdate = function (id) {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var PassengerArray = this.MultiSegmentPaxArray.Segment;
            var SegmentList = this.MultiSegmentPaxArray.Segment[this.index];
            SegmentList.Passenger.filter(function (m) { return m.RPH === _this.PassedPassengerDetail.RPH; })[0].FQTVNumber = this.PassedPassengerDetail.FQTVNumber;
            SegmentList.Passenger.filter(function (m) { return m.RPH === _this.PassedPassengerDetail.RPH; })[0].ProgramIDxx = this.airlineprogramcode.substr(0, 2);
            console.log(this.SelectedPassengerList);
            var rcheckreq = index_3.Converters.ConvertToCheckInPostTemplate(PassengerArray, "CheckIn", this.SelectedPassengerList, SegmentList, "UpdatePassengerInfo", "", this._shared.GetBagTag());
            console.log(rcheckreq);
            this._checkin.CheckInPaxWithFqtv(rcheckreq).subscribe(function (data) {
                if (data.Warnings) {
                    data.Warnings.forEach(function (message, index) {
                        Toast.makeText(message.Message).show();
                    });
                }
                if (data.Errors) {
                    data.Errors.forEach(function (message, index) {
                        Toast.makeText(message.Message).show();
                    });
                }
                _this.GetOrderDetails(_this.PassedPassengerDetail.OrderID);
            }), function (err) {
                console.log(err);
                _this.handleServiceError(err);
                _this.loaderProgress.hideLoader();
            },
                function () {
                };
        }
        catch (Exception) {
            console.log(Exception.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            // this.loaderProgress.hideLoader();
            var eDate = new Date();
            console.log('Get Passenger Service --------------- End Date Time : ' + eDate);
            // console.log('Get Passenger Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    FqtvComponent.prototype.GetOrderDetails = function (id) {
        var _this = this;
        this.loaderProgress.showLoader();
        try {
            var sDate = new Date();
            console.log('Get Passenger Service --------------- Start Date Time : ' + sDate);
            this._service.GetPassenger(id)
                .subscribe(function (data) {
                _this._shared.SetPassenger(data);
                _this.loaderProgress.hideLoader();
                _this.navigateToCheckin();
            }, function (err) {
                console.log(err);
                _this.loaderProgress.hideLoader();
                _this.navigateToCheckin();
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('Get Passenger Service --------------- End Date Time : ' + eDate);
            // console.log('Get Passenger Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    FqtvComponent.prototype.displayFQTVActionDialog = function () {
        var _this = this;
        var options = {
            viewContainerRef: this.vcRef,
            context: this.FQTVList,
            fullscreen: false
        };
        this._modalService.showModal(fqtv_modal_1.CreatingListPickComponent, options).then(function (result) {
            if (result) {
                _this.airlineprogramcode = result;
            }
        });
    };
    FqtvComponent.prototype.Submit = function () {
        var _this = this;
        var Segment = this._shared.GetPassenger();
        console.log("V1");
        Segment.Passengers.forEach(function (paxEle, paxindex) {
            _this.MultiSegmentPaxArray.Segment[_this.index].Passenger.forEach(function (data, index) {
                if (data.RPH == paxEle.RPH) {
                    if (paxEle.FqtTravelers != []) {
                        paxEle.FqtTravelers.forEach(function (Fqtvele, fqtvIndex) {
                            console.log("New" + JSON.stringify(_this.fqtvnum));
                            Fqtvele.MembershipID = _this.fqtvnum;
                            Fqtvele.ProgramID = _this.airlineprogramcode.toString().substr(0, 2);
                        });
                    }
                }
            });
        });
        this._shared.SetPassenger(Segment);
        // this.GetOrderDetails(this.OrderId);
        // this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((data, index) => {
        //      if (data.RPH == this.PassedPassengerDetail.RPH){
        //          data.FQTVNumber = this.fqtvnum;
        //          data.ProgramIDxx = this.airlineprogramcode;
        //      }
        //     });
        // console.dir(this.MultiSegmentPaxArray.Segment[this.index]);            
        this.navigateToCheckin();
    };
    FqtvComponent.prototype.navigateToCheckin = function () {
        this.routerExtensions.navigate(["checkin"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "data": this.OrderId,
                "index": this.index
            }
        });
    };
    FqtvComponent.prototype.onChange = function (args, index) {
        this._timeoutService.resetWatch();
        switch (index) {
            case 0:
                this.isFqtvEmpty = false;
                var reg = new RegExp('^[a-zA-Z0-9]*$');
                var test = reg.test(this.PassedPassengerDetail.FQTVNumber);
                if (test == false) {
                    this.isFqtvEmpty = true;
                    Toast.makeText("Please enter valid fqtv number").show();
                }
                else
                    this.isFqtvEmpty = false;
                break;
            default:
        }
        if (test == true && this.PassedPassengerDetail.FQTVNumber.length > 4 && this.PassedPassengerDetail.FQTVNumber != null) {
            this.isButtonEnabled = true;
        }
        else {
            this.isButtonEnabled = false;
        }
    };
    FqtvComponent.prototype.navigateToSearch = function () {
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
    FqtvComponent.prototype.navigateToDepartures = function () {
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
    FqtvComponent.prototype.navigateTologin = function () {
        this.routerExtensions.navigate([""], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    FqtvComponent.prototype.isItemVisible = function (args) {
        if (args.toString().substr(0, 2) == 'CM' && args.toString().length <= 5) {
            return "visible";
        }
        else
            return "collapsed";
    };
    FqtvComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    FqtvComponent.prototype.handleServiceError = function (error) {
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
    FqtvComponent.prototype.navigateToCompensation = function () {
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
    ], FqtvComponent.prototype, "pageCont", void 0);
    FqtvComponent = __decorate([
        core_1.Component({
            selector: "fqtv-page",
            providers: [index_1.DataService, app_constants_1.Configuration, index_1.PassengerService, index_1.CheckinService],
            templateUrl: "./components/fqtv/fqtv.component.html",
            styleUrls: ["./components/fqtv/fqtv.component.css"]
        }),
        __metadata("design:paramtypes", [index_1.CheckinService, page_1.Page, index_1.TimeOutService, index_1.PassengerService, router_2.RouterExtensions, modal_dialog_1.ModalDialogService, index_1.DataService, router_1.Router, common_1.Location, router_1.ActivatedRoute, core_1.ViewContainerRef,
            index_1.CheckinOrderService])
    ], FqtvComponent);
    return FqtvComponent;
}());
exports.FqtvComponent = FqtvComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnF0di5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmcXR2LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyxzQ0FBMkY7QUFDM0YsMENBQTJFO0FBQzNFLDBDQUEyQztBQUMzQyxzREFBK0Q7QUFDL0Qsa0VBQTJGO0FBQzNGLGdDQUErQjtBQUMvQixvQ0FBcUM7QUFJckMsOEJBQThCO0FBQzlCLDBEQUE0RDtBQUM1RCwrQkFBaUM7QUFDakMsMENBQTRDO0FBSTVDLHFEQUFpSTtBQUNqSSxzREFBd047QUFDeE4sa0RBQXNEO0FBQ3RELHFFQUFtRjtBQUNuRixxREFBb0Q7QUFZcEQ7SUFtQ0ksdUJBQW1CLFFBQXdCLEVBQVUsSUFBVSxFQUFTLGVBQStCLEVBQVMsUUFBMEIsRUFBVSxnQkFBa0MsRUFBVSxhQUFpQyxFQUFTLFlBQXlCLEVBQVUsTUFBYyxFQUFVLFFBQWtCLEVBQVUsZUFBK0IsRUFBVSxLQUF1QixFQUN0WCxPQUE0QjtRQURwQixhQUFRLEdBQVIsUUFBUSxDQUFnQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQU07UUFBUyxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFrQjtRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBb0I7UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBYTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQVUsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBa0I7UUFDdFgsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7UUE5QnZDLG9EQUFvRDtRQUNwRCwwQkFBcUIsR0FBbUMsSUFBSSw0QkFBb0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQU10RixVQUFLLEdBQXVCLElBQUksZUFBTyxDQUFDLFVBQVUs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Q1IsSUFBSSxFQUFFLE9BQU87b0JBQ2IsUUFBUSxFQUFFLEdBQUc7b0JBQ2IsS0FBSyxFQUFFLFFBQVE7aUJBQ2xCO2FBQ0osQ0FBQyxDQUFDO1NBQ047YUFBTTtZQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN4RDtJQUNMLENBQUM7SUFsZ0IyQjtRQUEzQixnQkFBUyxDQUFDLGVBQWUsQ0FBQztrQ0FBVyxpQkFBVTttREFBQztJQUR4QyxhQUFhO1FBUnpCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsV0FBVztZQUNyQixTQUFTLEVBQUUsQ0FBQyxtQkFBVyxFQUFFLDZCQUFhLEVBQUUsd0JBQWdCLEVBQUUsc0JBQWMsQ0FBQztZQUN6RSxXQUFXLEVBQUUsdUNBQXVDO1lBQ3BELFNBQVMsRUFBRSxDQUFDLHNDQUFzQyxDQUFDO1NBQ3RELENBQUM7eUNBc0MrQixzQkFBYyxFQUFnQixXQUFJLEVBQTBCLHNCQUFjLEVBQW1CLHdCQUFnQixFQUE0Qix5QkFBZ0IsRUFBeUIsaUNBQWtCLEVBQXVCLG1CQUFXLEVBQWtCLGVBQU0sRUFBb0IsaUJBQVEsRUFBMkIsdUJBQWMsRUFBaUIsdUJBQWdCO1lBQzdXLDJCQUFtQjtPQXBDOUIsYUFBYSxDQXFnQnpCO0lBQUQsb0JBQUM7Q0FBQSxBQXJnQkQsSUFxZ0JDO0FBcmdCWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbIi8vYW5ndWxhciAmIG5hdGl2ZXNjcmlwdCByZWZlcmVuY2VzXHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBSb3V0ZXIsIE5hdmlnYXRpb25FeHRyYXMsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XHJcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7IE1vZGFsRGlhbG9nU2VydmljZSwgTW9kYWxEaWFsb2dPcHRpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL21vZGFsLWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInVpL3BhZ2VcIjtcclxuaW1wb3J0ICogYXMgZGlhbG9ncyBmcm9tIFwidWkvZGlhbG9nc1wiXHJcbmltcG9ydCB7IExpc3RWaWV3LCBJdGVtRXZlbnREYXRhIH0gZnJvbSBcInVpL2xpc3Qtdmlld1wiO1xyXG5pbXBvcnQgKiBhcyBnZXN0dXJlcyBmcm9tIFwidWkvZ2VzdHVyZXNcIjtcclxuXHJcbi8vZXh0ZXJuYWwgbW9kdWxlcyBhbmQgcGx1Z2luc1xyXG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xyXG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tIFwibmF0aXZlc2NyaXB0LXRvYXN0XCI7XHJcblxyXG4vL2FwcCByZWZlcmVuY2VzXHJcbmltcG9ydCB7IFBhc3NlbmdlciwgT3JkZXIsIEludmVudG9yeSwgRlFUViwgRGVwYXJ0dXJlcyB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbW9kZWwvaW5kZXhcIlxyXG5pbXBvcnQgeyBEYXRhU2VydmljZSwgQ2hlY2tpbk9yZGVyU2VydmljZSwgUGFzc2VuZ2VyU2VydmljZSwgVGltZU91dFNlcnZpY2UsIENoZWNraW5TZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9pbmRleFwiO1xyXG5pbXBvcnQgeyBQYXhUZW1wbGF0ZSwgTXVsdGlTZWdtZW50VGVtcGxhdGUsIFBhc3NlbmdlckNoZWNraW4sIEluQm91bmQsIE91dEJvdW5kLCBGbGlnaHRJbmZvLCBGUVRWSW5mbywgRlFUVlBybywgQ2hlY2tJblBvc3RUZW1wbGF0ZSwgRGVwYXJ0dXJlSW5mbywgTG9hZGVyUHJvZ3Jlc3MsIFBhc3Nlbmdlckxpc3QgfSBmcm9tICcuLi8uLi9zaGFyZWQvaW50ZXJmYWNlL2luZGV4JztcclxuaW1wb3J0IHsgQ29udmVydGVycyB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXRpbHMvaW5kZXhcIjtcclxuaW1wb3J0IHsgQ3JlYXRpbmdMaXN0UGlja0NvbXBvbmVudCB9IGZyb20gXCIuLi8uLi9jb21wb25lbnRzL2ZxdHYtbW9kYWwvZnF0di1tb2RhbFwiO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vLi4vYXBwLmNvbnN0YW50cyc7XHJcblxyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6IFwiZnF0di1wYWdlXCIsXHJcbiAgICBwcm92aWRlcnM6IFtEYXRhU2VydmljZSwgQ29uZmlndXJhdGlvbiwgUGFzc2VuZ2VyU2VydmljZSwgQ2hlY2tpblNlcnZpY2VdLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9jb21wb25lbnRzL2ZxdHYvZnF0di5jb21wb25lbnQuaHRtbFwiLFxyXG4gICAgc3R5bGVVcmxzOiBbXCIuL2NvbXBvbmVudHMvZnF0di9mcXR2LmNvbXBvbmVudC5jc3NcIl1cclxufSlcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRnF0dkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgICBAVmlld0NoaWxkKCdwYWdlY29udGFpbmVyJykgcGFnZUNvbnQ6IEVsZW1lbnRSZWY7XHJcbiAgICBpc0Vycm9yOiBib29sZWFuO1xyXG4gICAgZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgaW5kZXg6IGFueTtcclxuICAgIGxvYWRlclByb2dyZXNzOiBMb2FkZXJQcm9ncmVzcztcclxuICAgIC8vICAgIHB1YmxpYyBQYXNzZW5nZXJMaXN0OiBBcnJheTxQYXhUZW1wbGF0ZT4gPSBbXTtcclxuICAgIFBhc3NlZFBhc3NlbmdlckRldGFpbDogTXVsdGlTZWdtZW50VGVtcGxhdGUuUGFzc2VuZ2VyID0gbmV3IE11bHRpU2VnbWVudFRlbXBsYXRlLlBhc3NlbmdlcigpO1xyXG4gICAgcHVibGljIEFsbFBhc3NlbmdlckRlYXRpbHM6IGFueTtcclxuICAgIHB1YmxpYyBhaXJsaW5lcHJvZ3JhbWNvZGU6IGFueTtcclxuICAgIHB1YmxpYyBmcXR2bnVtOiBhbnk7XHJcbiAgICBwdWJsaWMgZnF0djE6IGFueTtcclxuICAgIHB1YmxpYyB1c2VyZGV0YWlsczogYW55O1xyXG4gICAgcHVibGljIGZxdHYyOiBGUVRWUHJvLlJvb3RPYmplY3QgPSBuZXcgRlFUVlByby5Sb290T2JqZWN0KCk7XHJcbiAgICBwdWJsaWMgZnF0djogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgcHVibGljIGZ1bGxuYW1lOiBhbnk7XHJcbiAgICBwdWJsaWMgdGllcjogYW55O1xyXG4gICAgcHVibGljIHN0YXI6IGFueSA9IFwiXCI7XHJcbiAgICBwdWJsaWMgZnF0dlByb2dyYW1JRDogYW55ID0gXCJDTVwiO1xyXG4gICAgcHJpdmF0ZSBkYXRlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgU2VsZWN0ZWRQYXNzZW5nZXJMaXN0OiBBcnJheTxQYXNzZW5nZXJDaGVja2luLlNlbGVjdGVkUGFzc2VuZ2VyPjtcclxuICAgIHB1YmxpYyBPcmRlcklkOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgaXNCdXR0b25FbmFibGVkOiBib29sZWFuO1xyXG4gICAgcHVibGljIEZRVFZMaXN0OiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICBwdWJsaWMgaXNGcXR2RW1wdHk6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgaXNDb21wZW5zYXRpb25FbmFibGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNDaGVja2luRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBpc0dhdGVEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIEZsaWdodEluZm86IE11bHRpU2VnbWVudFRlbXBsYXRlLkZsaWdodFdpdGhQYXggPSBuZXcgTXVsdGlTZWdtZW50VGVtcGxhdGUuRmxpZ2h0V2l0aFBheDtcclxuICAgIHB1YmxpYyBNdWx0aVNlZ21lbnRQYXhBcnJheTogTXVsdGlTZWdtZW50VGVtcGxhdGUuUm9vdE9iamVjdCA9IG5ldyBNdWx0aVNlZ21lbnRUZW1wbGF0ZS5Sb290T2JqZWN0O1xyXG4gICAgcHVibGljIEZsaWdodERhdGU6IGFueTtcclxuICAgIC8vIHB1YmxpYyBTZWxlY3RlZFBhc3Nlbmdlckxpc3Q6IEFycmF5PFBhc3NlbmdlckNoZWNraW4uU2VsZWN0ZWRQYXNzZW5nZXI+O1xyXG4gICAgcHVibGljIFBhc3NlbmdlckFycmF5OiBhbnk7XHJcbiAgICBwdWJsaWMgU2VnbWVudExpc3Q6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgX2NoZWNraW46IENoZWNraW5TZXJ2aWNlLCBwcml2YXRlIHBhZ2U6IFBhZ2UsIHB1YmxpYyBfdGltZW91dFNlcnZpY2U6IFRpbWVPdXRTZXJ2aWNlLCBwdWJsaWMgX3NlcnZpY2U6IFBhc3NlbmdlclNlcnZpY2UsIHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9ucywgcHJpdmF0ZSBfbW9kYWxTZXJ2aWNlOiBNb2RhbERpYWxvZ1NlcnZpY2UsIHB1YmxpYyBfZGF0YVNlcnZpY2U6IERhdGFTZXJ2aWNlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIGxvY2F0aW9uOiBMb2NhdGlvbiwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZXI6IEFjdGl2YXRlZFJvdXRlLCBwcml2YXRlIHZjUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxyXG4gICAgICAgIHB1YmxpYyBfc2hhcmVkOiBDaGVja2luT3JkZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcyA9IG5ldyBMb2FkZXJQcm9ncmVzcygpO1xyXG4gICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gXCJcIjtcclxuICAgICAgICB0aGlzLmlzQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXJMaXN0ID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcblxyXG4gICAgICAgIHRoaXMucGFnZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnfi9pbWFnZXMvbG9naW5fYmFjay5qcGVnJylcIjtcclxuICAgICAgICB0aGlzLnBhZ2Uuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBcImNvdmVyIFwiO1xyXG4gICAgICAgIHRoaXMuZGF0ZSA9IG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoXCJERCBNTU0gWVlZWVwiKTtcclxuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmluaXRMb2FkZXIodGhpcy5wYWdlQ29udCk7XHJcbiAgICAgICAgdGhpcy51c2VyZGV0YWlscyA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcmRldGFpbHNcIiwgXCJcIik7XHJcbiAgICAgICAgdGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNoZWNraW5EaXNhYmxlZFwiKTtcclxuICAgICAgICB0aGlzLmlzR2F0ZURpc2FibGVkID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiZ2F0ZURpc2FibGVkXCIpO1xyXG4gICAgICAgIHRoaXMuaXNDb21wZW5zYXRpb25FbmFibGVkID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiY29tcGVuc2F0aW9uRW5hYmxlZFwiKTtcclxuICAgICAgICB0aGlzLmFjdGl2YXRlZFJvdXRlci5xdWVyeVBhcmFtcy5zdWJzY3JpYmUoKHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdmFyIFJQSFZhbHVlID0gSlNPTi5wYXJzZShwYXJhbXNbXCJSUEhWYWx1ZVwiXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gSlNPTi5wYXJzZShwYXJhbXNbXCJpbmRleFwiXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5ID0gdGhpcy5fc2hhcmVkLkdldFNlZ21lbnREZXRhaWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudC5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLk1hcmtldGluZ0ZsaWdodCA9PSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uTWFya2V0aW5nRmxpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRmxpZ2h0SW5mbyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkZsaWdodERhdGUgPSBtb21lbnQodGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLkZsaWdodERhdGUpLmZvcm1hdChcIkRELU1NTS1ZWVlZXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwgPSB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUGFzc2VuZ2VyLmZpbHRlcihtID0+IG0uUlBIID09IFJQSFZhbHVlKVswXTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsKTtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5UaWVyKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkZRVFYoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZnVsbG5hbWUgPSB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5GdWxsTmFtZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZnF0dm51bSA9IHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLkZRVFZOdW1iZXI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlBhc3NlbmdlckFycmF5ID0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5TZWdtZW50TGlzdCA9IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XTtcclxuICAgICAgICAgICAgICAgIGxldCBvYmogPSBuZXcgUGFzc2VuZ2VyQ2hlY2tpbi5TZWxlY3RlZFBhc3NlbmdlcigpO1xyXG4gICAgICAgICAgICAgICAgb2JqLkZpcnN0TmFtZSA9IHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLkZpcnN0TmFtZTtcclxuICAgICAgICAgICAgICAgIG9iai5MYXN0TmFtZSA9IHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLkxhc3ROYW1lO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlckxpc3QucHVzaChvYmopO1xyXG4gICAgICAgICAgICAgICAgbGV0IGZxdHZQcm9ncmFtTmFtZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5Qcm9ncmFtSUR4eCAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5QYXNzZW5nZXJbMF0uRnF0dlByb2dyYW1zLmZpbHRlcihtID0+IG0uUHJvZ3JhbUlEID09IHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLlByb2dyYW1JRHh4KVswXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZxdHZQcm9ncmFtTmFtZSA9IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFswXS5QYXNzZW5nZXJbMF0uRnF0dlByb2dyYW1zLmZpbHRlcihtID0+IG0uUHJvZ3JhbUlEID09IHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLlByb2dyYW1JRHh4KVswXS5Qcm9ncmFtTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmcXR2UHJvZ3JhbU5hbWUgPSBcIkNNL0NvcGEgQWlybGluZXNcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50WzBdICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmcXR2UHJvZ3JhbU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmcXR2UHJvZ3JhbU5hbWUgIT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUGFzc2VuZ2VyLmZvckVhY2goKFBheERhdGEsIFBheEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZRVFYgUHJvZ3JhbWUgTmFtZVwiICsgUGF4RGF0YS5GcXR2UHJvZ3JhbXMubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZnF0dlByb2dyYW1JRCA9IFBheERhdGEuRnF0dlByb2dyYW1zLmZpbHRlcihtID0+IG0uUHJvZ3JhbU5hbWUgPT0gZnF0dlByb2dyYW1OYW1lKVswXS5Qcm9ncmFtSUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5HZXRQYXNzZW5nZXIoKS5QYXNzZW5nZXJzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5GaXJzdG5hbWUgPT0gdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuRmlyc3ROYW1lICYmIGVsZW1lbnQuTGFzdG5hbWUgPT0gdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuTGFzdE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2VsZW1lbnQuRnF0VHJhdmVsZXJzWzBdLlByb2dyYW1JRCA9IHRoaXMuZnF0dlByb2dyYW1JRDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpZXIgPSAnLSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuRnF0VHJhdmVsZXJzICE9IG51bGwgJiYgZWxlbWVudC5GcXRUcmF2ZWxlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5GcXRUcmF2ZWxlcnNbMF0uQWxsaWFuY2VUaWVyTGV2ZWwuTmFtZSAhPSBudWxsICYmIGVsZW1lbnQuRnF0VHJhdmVsZXJzWzBdLkFsbGlhbmNlVGllckxldmVsICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGllciA9IGVsZW1lbnQuRnF0VHJhdmVsZXJzWzBdLlRpZXJMZXZlbC5OYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFyID0gZWxlbWVudC5GcXRUcmF2ZWxlcnNbMF0uQWxsaWFuY2VUaWVyTGV2ZWwuTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3Rhcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aWVyID0gZWxlbWVudC5GcXRUcmF2ZWxlcnNbMF0uVGllckxldmVsLk5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuT3JkZXJJZCA9IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5QYXNzZW5nZXJbMF0uT3JkZXJJRDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWlybGluZXByb2dyYW1jb2RlID0gZnF0dlByb2dyYW1OYW1lO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWlybGluZXByb2dyYW1jb2RlOlwiICsgdGhpcy5haXJsaW5lcHJvZ3JhbWNvZGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5mcXR2bnVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoRXhjZXB0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhFeGNlcHRpb24ubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLnBhZ2VDb250Lm5hdGl2ZUVsZW1lbnRcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG9ic2VydmVyID0gbGFiZWwub24oXCJsb2FkZWQsIHRhcCwgbG9uZ1ByZXNzLCBzd2lwZSwgbmdNb2RlbENoYW5nZVwiLCBmdW5jdGlvbiAoYXJnczogZ2VzdHVyZXMuR2VzdHVyZUV2ZW50RGF0YSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkV2ZW50OiBcIiArIGFyZ3MuZXZlbnROYW1lKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5fdGltZW91dFNlcnZpY2UudGltZXIpO1xyXG4gICAgICAgICAgICBzZWxmLl90aW1lb3V0U2VydmljZS5yZXNldFdhdGNoKCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmVmcmVzaEZsaWZvKCkge1xyXG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xyXG4gICAgICAgIHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudC5mb3JFYWNoKChTZWdFbGUsIFNlZ0lubmRleCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IGRlcGFydHVyZURhdGU6IHN0cmluZyA9IG1vbWVudChTZWdFbGUuRGVwYXJ0dXJlRGF0ZVRpbWUudG9TdHJpbmcoKSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcclxuICAgICAgICAgICAgbGV0IGZsaWdodG51bWJlcjogc3RyaW5nO1xyXG4gICAgICAgICAgICBpZiAoU2VnRWxlLk1hcmtldGluZ0ZsaWdodC5zdWJzdHIoMCwgMikgPT0gXCJDTVwiKSB7XHJcbiAgICAgICAgICAgICAgICBmbGlnaHRudW1iZXIgPSBTZWdFbGUuTWFya2V0aW5nRmxpZ2h0O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKFNlZ0VsZS5PcGVyYXRpbmdGbGlnaHQgIT0gbnVsbCAmJiBTZWdFbGUuT3BlcmF0aW5nRmxpZ2h0LnN1YnN0cigwLCAyKSA9PSBcIkNNXCIpIHtcclxuICAgICAgICAgICAgICAgIGZsaWdodG51bWJlciA9IFNlZ0VsZS5PcGVyYXRpbmdGbGlnaHQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmbGlnaHRudW1iZXIgPSBTZWdFbGUuTWFya2V0aW5nRmxpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBjaXR5OiBzdHJpbmcgPSBTZWdFbGUuRGVwYXJ0dXJlQ2l0eTtcclxuICAgICAgICAgICAgU2VnRWxlLmRhdGUgPSBtb21lbnQoU2VnRWxlLkRlcGFydHVyZURhdGVUaW1lLnRvU3RyaW5nKCkpLmZvcm1hdChcIkRELU1NTS1ZWVlZXCIpO1xyXG4gICAgICAgICAgICB2YXIgZGVzdGluYXRpb24gPSBTZWdFbGUuRGVzdGluYXRpb247XHJcbiAgICAgICAgICAgIC8vIC8vSW52ZW50b3J5XHJcbiAgICAgICAgICAgIHRoaXMuX2NoZWNraW4uQm9va2luZ0NvdW50RGlzcGxheShkZXBhcnR1cmVEYXRlLCBmbGlnaHRudW1iZXIsIGNpdHkpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGludmVudG9yeTogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBTZWdFbGUuaW52ZW4gPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb0ludmVudG9yeShpbnZlbnRvcnkpO1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvL0luYm91bmRcclxuICAgICAgICAgICAgdGhpcy5fY2hlY2tpbi5JbkJvdW5kKGRlcGFydHVyZURhdGUsIGZsaWdodG51bWJlciwgY2l0eSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5Cb3VuZDogYW55ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBTZWdFbGUuaW5ib3VuZCA9IENvbnZlcnRlcnMuQ29udmVydFRvSW5Cb3VuZChpbkJvdW5kKTtcclxuICAgICAgICAgICAgICAgIH0sIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvL091dGJvdW5kXHJcbiAgICAgICAgICAgIHRoaXMuX2NoZWNraW4uT3V0Qm91bmQoZGVwYXJ0dXJlRGF0ZSwgZmxpZ2h0bnVtYmVyLCBkZXN0aW5hdGlvbilcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgT3V0Qm91bmQ6IGFueSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgU2VnRWxlLm91dGJvdW5kID0gQ29udmVydGVycy5Db252ZXJ0VG9PdXRCb3VuZChPdXRCb3VuZCk7XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLy9zdGF0dXNcclxuICAgICAgICAgICAgdGhpcy5fZGF0YVNlcnZpY2UuU3RhdHVzKGRlcGFydHVyZURhdGUsIGZsaWdodG51bWJlciwgY2l0eSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3RhdHVzOiBhbnkgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5zdGF0dXMgPSBzdGF0dXMuRmxpZ2h0c1swXS5MZWdzWzBdLlN0YXR1cztcclxuICAgICAgICAgICAgICAgICAgICBTZWdFbGUuTGVncyA9IHN0YXR1cy5GbGlnaHRzWzBdLkxlZ3M7XHJcbiAgICAgICAgICAgICAgICAgICAgU2VnRWxlLkVURCA9IHN0YXR1cy5GbGlnaHRzWzBdLkxlZ3NbMF0uRGVwYXJ0dXJlRGF0ZVRpbWUuRXN0aW1hdGVkLnRvU3RyaW5nKCkuc3Vic3RyKDExLCA1KTtcclxuICAgICAgICAgICAgICAgICAgICBTZWdFbGUuU1REID0gc3RhdHVzLkZsaWdodHNbMF0uTGVnc1swXS5EZXBhcnR1cmVEYXRlVGltZS5TY2hlZHVsZWQudG9TdHJpbmcoKS5zdWJzdHIoMTEsIDUpO1xyXG4gICAgICAgICAgICAgICAgICAgIFNlZ0VsZS5FVEEgPSBzdGF0dXMuRmxpZ2h0c1swXS5MZWdzWzBdLkFycml2YWxEYXRlVGltZS5TY2hlZHVsZWQudG9TdHJpbmcoKS5zdWJzdHIoMTEsIDUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cy5GbGlnaHRzWzBdLkxlZ3NbMF0uRGVwYXJ0dXJlRGF0ZVRpbWUuRXN0aW1hdGVkLnRvU3RyaW5nKCkuc3Vic3RyKDExLCA1KSArIFwibGxsbFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhc3Nlbmdlckxlbmd0aCA9IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudC5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXNzZW5nZXJMZW5ndGggPT0gU2VnSW5uZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRCYWdUYWcobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRTZWdtZW50RGV0YWlsKHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIEZRVFYoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5mcXR2MSA9IHRoaXMuX3NoYXJlZC5HZXRGUVRWKCk7XHJcbiAgICAgICAgdGhpcy5mcXR2Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50LmZvckVhY2goKFNlZ0VsZSwgU2VnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgU2VnRWxlLlBhc3Nlbmdlci5mb3JFYWNoKChQYXhFbGUsIFBheEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBQYXhFbGUuRnF0dlByb2dyYW1zID0gQ29udmVydGVycy5Db252ZXJ0VG9GUVRWKHRoaXMuZnF0djEpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kaXIoUGF4RWxlLkZxdHZQcm9ncmFtcyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLk11bHRpU2VnbWVudFBheEFycmF5LlNlZ21lbnRbdGhpcy5pbmRleF0uUGFzc2VuZ2VyWzBdLkZxdHZQcm9ncmFtcy5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLkZRVFZMaXN0LnB1c2goZGF0YS5Qcm9ncmFtTmFtZSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBUaWVyKCk6IHZvaWQge1xyXG5cclxuICAgICAgICB2YXIgZGF0ZSA9IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5EZXBhcnR1cmVEYXRlVGltZS50b1N0cmluZygpO1xyXG4gICAgICAgIHZhciB0aWVyRGF0ZSA9IGRhdGUuc3Vic3RyKDAsIDEwKTtcclxuICAgICAgICB2YXIgZmxpZ2h0bnVtYmVyID0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLk1hcmtldGluZ0ZsaWdodDtcclxuICAgICAgICB2YXIgY2l0eSA9IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudFt0aGlzLmluZGV4XS5EZXBhcnR1cmVDaXR5O1xyXG4gICAgICAgIHRoaXMuX2RhdGFTZXJ2aWNlLlRpZXIodGllckRhdGUsIGZsaWdodG51bWJlciwgY2l0eSlcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5BbGxQYXNzZW5nZXJEZWF0aWxzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIHRoaXMuQWxsUGFzc2VuZ2VyRGVhdGlscy5QYXNzZW5nZXJMaXN0LmZvckVhY2goKFBheGRhdGEsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLk9yZGVySUQgPT0gUGF4ZGF0YS5PcmRlcklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChQYXhkYXRhLkZxdFRyYXZlbGVycyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpZXIgPSBcIi1cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpZXIgPSBQYXhkYXRhLkZxdFRyYXZlbGVyc1swXS5BbGxpYTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgfSwgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcblxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgIH1cclxuICAgIGNvbmZpcm1VcGRhdGUoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLl9zaGFyZWQuR2V0QmFnVGFnKCkgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBkaWFsb2dzLmNvbmZpcm0oXCJVcGRhdGluZyBGUVRWIGluZm9ybWF0aW9uIHdvdWxkIGNhdXNlIGFueSBwZW5kaW5nIHRyYW5zYWN0aW9uIHRvIGJlIGludmFsaWQuIEJhZ2dhZ2Ugd291bGQgbmVlZCB0byBiZSByZS1lbnRlcmVkIGFuZCByZS1wcmljZWRcIikudGhlbihyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0QmFnVGFnKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRlFUVlVwZGF0ZShpZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5GUVRWVXBkYXRlKGlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgRlFUVlVwZGF0ZShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XHJcbiAgICAgICAgICAgIHZhciBQYXNzZW5nZXJBcnJheSA9IHRoaXMuTXVsdGlTZWdtZW50UGF4QXJyYXkuU2VnbWVudDtcclxuICAgICAgICAgICAgdmFyIFNlZ21lbnRMaXN0ID0gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdO1xyXG4gICAgICAgICAgICBTZWdtZW50TGlzdC5QYXNzZW5nZXIuZmlsdGVyKG0gPT4gbS5SUEggPT09IHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLlJQSClbMF0uRlFUVk51bWJlciA9IHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLkZRVFZOdW1iZXI7XHJcbiAgICAgICAgICAgIFNlZ21lbnRMaXN0LlBhc3Nlbmdlci5maWx0ZXIobSA9PiBtLlJQSCA9PT0gdGhpcy5QYXNzZWRQYXNzZW5nZXJEZXRhaWwuUlBIKVswXS5Qcm9ncmFtSUR4eCA9IHRoaXMuYWlybGluZXByb2dyYW1jb2RlLnN1YnN0cigwLCAyKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5TZWxlY3RlZFBhc3Nlbmdlckxpc3QpO1xyXG4gICAgICAgICAgICB2YXIgcmNoZWNrcmVxOiBDaGVja0luUG9zdFRlbXBsYXRlLlJvb3RPYmplY3QgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb0NoZWNrSW5Qb3N0VGVtcGxhdGUoUGFzc2VuZ2VyQXJyYXksIFwiQ2hlY2tJblwiLCB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyTGlzdCwgU2VnbWVudExpc3QsIFwiVXBkYXRlUGFzc2VuZ2VySW5mb1wiLCBcIlwiLCB0aGlzLl9zaGFyZWQuR2V0QmFnVGFnKCkpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyY2hlY2tyZXEpO1xyXG4gICAgICAgICAgICB0aGlzLl9jaGVja2luLkNoZWNrSW5QYXhXaXRoRnF0dihyY2hlY2tyZXEpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoZGF0YS5XYXJuaW5ncyl7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5XYXJuaW5ncy5mb3JFYWNoKChtZXNzYWdlLGluZGV4KT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChtZXNzYWdlLk1lc3NhZ2UpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYoZGF0YS5FcnJvcnMpe1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuRXJyb3JzLmZvckVhY2goKG1lc3NhZ2UsaW5kZXgpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KG1lc3NhZ2UuTWVzc2FnZSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLkdldE9yZGVyRGV0YWlscyh0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5PcmRlcklEKTtcclxuICAgICAgICAgICAgfSksIGVyciA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKEV4Y2VwdGlvbikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhFeGNlcHRpb24ubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgIHZhciBlRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgUGFzc2VuZ2VyIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnR2V0IFBhc3NlbmdlciBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVEYXRlKSkpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIEdldE9yZGVyRGV0YWlscyhpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBQYXNzZW5nZXIgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VydmljZS5HZXRQYXNzZW5nZXIoaWQpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRQYXNzZW5nZXIoPE9yZGVyLlJvb3RPYmplY3Q+ZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvQ2hlY2tpbigpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9DaGVja2luKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IFBhc3NlbmdlciBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBFbmQgRGF0ZSBUaW1lIDogJyArIGVEYXRlKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ0dldCBQYXNzZW5nZXIgU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlRGF0ZSkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRpc3BsYXlGUVRWQWN0aW9uRGlhbG9nKCkge1xyXG5cclxuICAgICAgICBsZXQgb3B0aW9uczogTW9kYWxEaWFsb2dPcHRpb25zID0ge1xyXG4gICAgICAgICAgICB2aWV3Q29udGFpbmVyUmVmOiB0aGlzLnZjUmVmLFxyXG4gICAgICAgICAgICBjb250ZXh0OiB0aGlzLkZRVFZMaXN0LFxyXG4gICAgICAgICAgICBmdWxsc2NyZWVuOiBmYWxzZVxyXG5cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX21vZGFsU2VydmljZS5zaG93TW9kYWwoQ3JlYXRpbmdMaXN0UGlja0NvbXBvbmVudCwgb3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWlybGluZXByb2dyYW1jb2RlID0gcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgU3VibWl0KCkge1xyXG4gICAgICAgIHZhciBTZWdtZW50ID0gdGhpcy5fc2hhcmVkLkdldFBhc3NlbmdlcigpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVjFcIik7XHJcbiAgICAgICAgU2VnbWVudC5QYXNzZW5nZXJzLmZvckVhY2goKHBheEVsZSwgcGF4aW5kZXgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlBhc3Nlbmdlci5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuUlBIID09IHBheEVsZS5SUEgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGF4RWxlLkZxdFRyYXZlbGVycyAhPSBbXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXhFbGUuRnF0VHJhdmVsZXJzLmZvckVhY2goKEZxdHZlbGUsIGZxdHZJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOZXdcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuZnF0dm51bSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRnF0dmVsZS5NZW1iZXJzaGlwSUQgPSB0aGlzLmZxdHZudW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBGcXR2ZWxlLlByb2dyYW1JRCA9IHRoaXMuYWlybGluZXByb2dyYW1jb2RlLnRvU3RyaW5nKCkuc3Vic3RyKDAsIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9zaGFyZWQuU2V0UGFzc2VuZ2VyKFNlZ21lbnQpO1xyXG4gICAgICAgIC8vIHRoaXMuR2V0T3JkZXJEZXRhaWxzKHRoaXMuT3JkZXJJZCk7XHJcbiAgICAgICAgLy8gdGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdLlBhc3Nlbmdlci5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIC8vICAgICAgaWYgKGRhdGEuUlBIID09IHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLlJQSCl7XHJcbiAgICAgICAgLy8gICAgICAgICAgZGF0YS5GUVRWTnVtYmVyID0gdGhpcy5mcXR2bnVtO1xyXG4gICAgICAgIC8vICAgICAgICAgIGRhdGEuUHJvZ3JhbUlEeHggPSB0aGlzLmFpcmxpbmVwcm9ncmFtY29kZTtcclxuICAgICAgICAvLyAgICAgIH1cclxuICAgICAgICAvLyAgICAgfSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5kaXIodGhpcy5NdWx0aVNlZ21lbnRQYXhBcnJheS5TZWdtZW50W3RoaXMuaW5kZXhdKTsgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLm5hdmlnYXRlVG9DaGVja2luKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG5hdmlnYXRlVG9DaGVja2luKCkge1xyXG5cclxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY2hlY2tpblwiXSwge1xyXG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcclxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBcImRhdGFcIjogdGhpcy5PcmRlcklkLFxyXG4gICAgICAgICAgICAgICAgXCJpbmRleFwiOiB0aGlzLmluZGV4XHJcblxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgb25DaGFuZ2UoYXJnczogYW55LCBpbmRleDogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fdGltZW91dFNlcnZpY2UucmVzZXRXYXRjaCgpO1xyXG4gICAgICAgIHN3aXRjaCAoaW5kZXgpIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0ZxdHZFbXB0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoJ15bYS16QS1aMC05XSokJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IHJlZy50ZXN0KHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLkZRVFZOdW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRlc3QgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRnF0dkVtcHR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIlBsZWFzZSBlbnRlciB2YWxpZCBmcXR2IG51bWJlclwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMuaXNGcXR2RW1wdHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGVzdCA9PSB0cnVlICYmIHRoaXMuUGFzc2VkUGFzc2VuZ2VyRGV0YWlsLkZRVFZOdW1iZXIubGVuZ3RoID4gNCAmJiB0aGlzLlBhc3NlZFBhc3NlbmdlckRldGFpbC5GUVRWTnVtYmVyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0J1dHRvbkVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNCdXR0b25FbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgbmF2aWdhdGVUb1NlYXJjaCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZWFyY2hcIl0sIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG5hdmlnYXRlVG9EZXBhcnR1cmVzKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzR2F0ZURpc2FibGVkID09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImRlcGFydGhvbWVcIl0sIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG5hdmlnYXRlVG9sb2dpbigpIHtcclxuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiXCJdLCB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlzSXRlbVZpc2libGUoYXJncyk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIGlmIChhcmdzLnRvU3RyaW5nKCkuc3Vic3RyKDAsIDIpID09ICdDTScgJiYgYXJncy50b1N0cmluZygpLmxlbmd0aCA8PSA1KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInZpc2libGVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSByZXR1cm4gXCJjb2xsYXBzZWRcIjtcclxuICAgIH1cclxuICAgIG5hdmlnYXRlVG9TZXR0aW5nKCkge1xyXG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZXR0aW5nXCJdLCB7XHJcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcjogYW55KSB7XHJcbiAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IGVycm9yLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgaWYgKGVycm9yTWVzc2FnZS5pbmRleE9mKFwiU2Vzc2lvblRpbWVvdXRcIikgPiAtMSkge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIlNlc3Npb24gVGltZSBPdXRcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiWW91ciBzZXNzaW9uIGhhcyBiZWVuIHRpbWUgb3V0XCIsXHJcbiAgICAgICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBkaWFsb2dzLmFsZXJ0KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIlwiXSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChlcnJvck1lc3NhZ2UpLnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBuYXZpZ2F0ZVRvQ29tcGVuc2F0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzQ29tcGVuc2F0aW9uRW5hYmxlZCA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJjb21wZW5zYXRpb25cIl0sIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiQ29tcGVuc2F0aW9uIE5vdCBhcHBsaWNhYmxlXCIpLnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==