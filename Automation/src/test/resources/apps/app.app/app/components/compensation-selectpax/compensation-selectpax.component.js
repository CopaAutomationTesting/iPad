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
var index_1 = require("../../shared/interface/index");
var index_2 = require("../../shared/services/index");
var index_3 = require("../../shared/model/index");
var index_4 = require("../../shared/utils/index");
var app_constants_1 = require("../../app.constants");
var app_executiontime_1 = require("../../app.executiontime");
var timeOut_service_1 = require("../../shared/services/timeOut.service");
var CompensationSelectPax = /** @class */ (function () {
    function CompensationSelectPax(_configuration, _services, _shared, page, routerExtensions, _timeoutService, router, _dataService, _service, route, vcRef, _modalService) {
        this._configuration = _configuration;
        this._services = _services;
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
        this.IsPaxReasonSelected = false;
        this.AgentPrivilage = new index_3.AgentPrivilage.RootObject();
        this.checkedCount = 0;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.SelectedPassenger = [];
        this.CompensationPassengerList = [];
        this.CompensationFullPaxList = [];
        this.CompensationModel = new index_1.CompensationSearchModule.CompensationRootObject;
        this.CompensationReason = [];
        this.CompensationReasonList = [];
        this.PaxInfo = [];
        this.CompensationOrderDetails = new index_1.CompensationOrderID.RootObject();
        this.BreResponse = [];
        this.isError = false;
        this.errorMessage = "";
        this.SearchFields.FlightDate = moment().format("DD MMMM YYYY");
        this.CurDate = moment().toDate();
        this.startDate = new Date();
        this.loaderProgress = new index_1.LoaderProgress();
    }
    CompensationSelectPax_1 = CompensationSelectPax;
    CompensationSelectPax.prototype.ngOnInit = function () {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.ComensationReason = CompensationSelectPax_1.COMPENSATIONREASON;
        this.loaderProgress.initLoader(this.pageCont);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.getCompensationReason();
        this.CompensationOrderDetails = this._shared.getCompensationOrderDeatils();
        console.log(JSON.stringify(this.CompensationOrderDetails));
        this.PaxInfo = this._shared.getCompensationPaxList();
        this.OrderId = this.CompensationOrderDetails.FlightSegments[0].Passengers[0].OrderId;
    };
    CompensationSelectPax.prototype.toggleChecked = function (Pax) {
        var _this = this;
        console.log("Pax:" + JSON.stringify(Pax.Isselected));
        if (Pax.Isselected == false) {
            Pax.Isselected = true;
            this.checkedCount = this.checkedCount + 1;
            this.SelectedPassenger.push(Pax);
            if (this.ComensationReason != CompensationSelectPax_1.COMPENSATIONREASON) {
                Pax.CompensationReason = this.ComensationReason;
                Pax.CompensationReasonId = this.CompensationReasonList.filter(function (m) { return m.CompReasonText == _this.ComensationReason; })[0].CompReasonId;
            }
        }
        else {
            this.SelectedPassenger.splice(this.SelectedPassenger.indexOf(Pax), 1);
            Pax.CompensationReason = "";
            Pax.CompensationReasonId = null;
            Pax.Isselected = false;
        }
        console.log("Pax:" + JSON.stringify(this.SelectedPassenger));
    };
    CompensationSelectPax.prototype.displayProductActionDialog = function () {
        var _this = this;
        if (this.SelectedPassenger == []) {
            Toast.makeText("Please Select the Passenger");
        }
        else {
            var options = {
                title: "Compensation Reason",
                cancelButtonText: "Cancel",
                actions: this.CompensationReason,
            };
            dialogs.action(options).then(function (result) {
                if (result != "Cancel") {
                    _this.ComensationReason = result;
                    _this.PaxInfo.filter(function (m) { return m.Isselected == true; }).forEach(function (data, Index) {
                        if (data.Isselected) {
                            data.CompensationReason = _this.ComensationReason;
                            data.CompensationReasonId = _this.CompensationReasonList.filter(function (m) { return m.CompReasonText == _this.ComensationReason; })[0].CompReasonId;
                            console.log("Obj" + JSON.stringify(data));
                        }
                    });
                }
            });
        }
    };
    CompensationSelectPax.prototype.getCompensationReason = function () {
        var _this = this;
        try {
            console.log("Reason 1");
            var ReasonRequest = this._shared.getAgentPrivilage();
            this.AgentPrivilage.Privileges = ReasonRequest;
            console.log("Pri:" + JSON.stringify(this.AgentPrivilage));
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetCompensationReason Service --------------- Start Date Time : ' + sDate);
            this._service.getCompensationReasons(this.AgentPrivilage)
                .subscribe(function (data) {
                if (data.CompensationReason != null) {
                    var CompansationDetails = data;
                    CompansationDetails.CompensationReason.forEach(function (KeyValue, Index) {
                        var compreason = new index_1.CompensationReasonModule.CompensationReason();
                        compreason.CompReasonText = KeyValue.CompReasonText;
                        compreason.CompReasonId = KeyValue.CompReasonId;
                        _this.CompensationReasonList.push(compreason);
                        // console.log("Reason :" + JSON.stringify(this.CompensationReasonList));
                        _this.CompensationReason.push(KeyValue.CompReasonText);
                    });
                    _this.loaderProgress.hideLoader();
                }
                else {
                    Toast.makeText(CompensationSelectPax_1.COMPENSATIONREASONTOAST + data.Errors[0].Message).show();
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
    CompensationSelectPax.prototype.navigatetoadditionaldetails = function (Paxitem) {
        console.log("Pax:" + JSON.stringify(Paxitem));
        var prePage = "SearchResult";
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
    };
    CompensationSelectPax.prototype.saveEnabled = function () {
        var _this = this;
        if (this.SelectedPassenger && this.SelectedPassenger.length == 0) {
            this.IsPaxReasonSelected = false;
        }
        else {
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
    CompensationSelectPax.prototype.continueEnabled = function () {
        var _this = this;
        if (this.SelectedPassenger && this.SelectedPassenger.length == 0) {
            this.IsPaxReasonSelected = false;
        }
        else {
            this.SelectedPassenger.forEach(function (data, index) {
                if (data.CompensationReason != "") {
                    _this.IsPaxReasonSelected = true;
                }
                else {
                    _this.IsPaxReasonSelected = false;
                }
            });
        }
        if (this.IsPaxReasonSelected == true) {
            return true;
        }
        else
            return false;
    };
    CompensationSelectPax.prototype.continue = function () {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('IssueCompensation Service --------------- Start Date Time : ' + sDate);
            this.SelectedPassenger = this.PaxInfo.filter(function (obj) { return obj.Isselected == true; });
            if (this.SelectedPassenger.filter(function (m) { return m.CompensationReason != CompensationSelectPax_1.COMPENSATIONREASON; })) {
                var privilage = this._shared.getAgentPrivilage();
                var IssueComptemplate = index_4.Converters.convertToBRERequestForOrderID(this.CompensationOrderDetails, this.SelectedPassenger, privilage, this.CompensationModel.FlightModel);
                console.log("IssueComptemplate:" + JSON.stringify(IssueComptemplate));
                this._service.postBreRequest(IssueComptemplate)
                    .subscribe(function (data) {
                    console.log("Data:" + JSON.stringify(data));
                    if (data.Results != [] && data.Success == true) {
                        if (data.Results[0].FlightSegments[0].Passengers[0].BRE_Compensations.length > 0 || data.Results[0].FlightSegments[0].Passengers[0].BRE_Compensations != []) {
                            _this.BreResponse = index_4.Converters.convertToBREResponseForOrderId(data, _this.SelectedPassenger);
                            _this._shared.setCompensationPaxList(_this.BreResponse[0].Passengers);
                            _this._shared.setCompensationOrderDeatils(_this.BreResponse);
                            console.log("BRECompResponse1:" + JSON.stringify(_this.BreResponse[0].Passengers));
                            _this.navigatetoissuecompensation();
                            _this.loaderProgress.hideLoader();
                        }
                        else {
                            _this.loaderProgress.hideLoader();
                            Toast.makeText("Compensation not issued for this particular Reason").show();
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
    // save() {
    //     try {
    //         this.loaderProgress.showLoader();
    //         var sDate = new Date();
    //         console.log('SaveCompensation Service --------------- Start Date Time : ' + sDate);
    //         this.SelectedPassenger = this.PaxInfo.filter(obj => obj.Isselected == true);
    //         let SaveComptemplate: any = Converters.convertToSaveCompensationTemplate(this.SelectedPassenger, this.CompensationModel.FlightModel);
    //         console.log("Data1:" + JSON.stringify(SaveComptemplate));
    //         this._service.saveCompensationReasons(SaveComptemplate)
    //             .subscribe(data => {
    //                 let CompansationDetails: any = data;
    //                 console.log("Data:" + JSON.stringify(data));
    //                 this.SelectedPassenger.forEach((data, index) => {
    //                     data.IsSelected = false;
    //                 });
    //             }, err => {
    //                 this.loaderProgress.hideLoader();
    //             });
    //     } catch (error) {
    //         console.log(error.message);
    //         this.loaderProgress.hideLoader();
    //     }
    //     finally {
    //         var endDate = new Date();
    //         console.log('SaveCompensation Service --------------- End Date Time : ' + endDate);
    //         console.log('SaveCompensation Service Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(endDate)));
    //     }
    // }
    CompensationSelectPax.prototype.navigatetoissuecompensation = function () {
        var prePage = "OrderId";
        this.routerExtensions.navigate(["issuecompensation"], {
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
    CompensationSelectPax.prototype.navigateToCompensation = function () {
        this.routerExtensions.navigate(["compensation"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSelectPax.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSelectPax.prototype.navigateToSearch = function () {
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
    CompensationSelectPax.prototype.navigateToDepartures = function () {
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
    CompensationSelectPax.prototype.handleServiceError = function (error) {
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
    var CompensationSelectPax_1;
    CompensationSelectPax.COMPENSATIONREASON = "Select Reason";
    CompensationSelectPax.COMPENSATIONREASONTOAST = "Compensation Reason:";
    __decorate([
        core_1.ViewChild('pagecontainer'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationSelectPax.prototype, "pageCont", void 0);
    CompensationSelectPax = CompensationSelectPax_1 = __decorate([
        core_1.Component({
            selector: "compensation-selectsegment-page",
            providers: [index_2.DataService, index_2.PassengerService, app_constants_1.Configuration, index_2.CompensationService],
            templateUrl: "./components/compensation-selectpax/compensation-selectpax.component.html",
            styleUrls: ["./components/compensation-selectpax/compensation-selectpax.component.css"]
        }),
        __metadata("design:paramtypes", [app_constants_1.Configuration, index_2.PassengerService, index_2.CheckinOrderService, page_1.Page, router_2.RouterExtensions, timeOut_service_1.TimeOutService, router_1.Router, index_2.DataService, index_2.CompensationService, router_1.ActivatedRoute, core_1.ViewContainerRef, modal_dialog_1.ModalDialogService])
    ], CompensationSelectPax);
    return CompensationSelectPax;
}());
exports.CompensationSelectPax = CompensationSelectPax;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGVuc2F0aW9uLXNlbGVjdHBheC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21wZW5zYXRpb24tc2VsZWN0cGF4LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyxzQ0FBMkY7QUFDM0YsMENBQTJFO0FBRTNFLHNEQUErRDtBQUMvRCxrRUFBMkY7QUFDM0YsZ0NBQStCO0FBQy9CLG9DQUF1QztBQU92Qyw4QkFBOEI7QUFDOUIsMERBQTREO0FBQzVELCtCQUFpQztBQUNqQywwQ0FBNEM7QUFFNUMsZ0JBQWdCO0FBQ2hCLHNEQUFnTTtBQUNoTSxxREFBc0g7QUFDdEgsa0RBQW1LO0FBQ25LLGtEQUFzRDtBQUV0RCxxREFBb0Q7QUFDcEQsNkRBQTJEO0FBRzNELHlFQUF1RTtBQVV2RTtJQTZCSSwrQkFBb0IsY0FBNkIsRUFBUyxTQUEyQixFQUFVLE9BQTRCLEVBQVUsSUFBVSxFQUFVLGdCQUFrQyxFQUFTLGVBQStCLEVBQVUsTUFBYyxFQUFTLFlBQXlCLEVBQVMsUUFBNkIsRUFBVSxLQUFxQixFQUFVLEtBQXVCLEVBQVUsYUFBaUM7UUFBMVosbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQXFCO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFBUyxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVMsaUJBQVksR0FBWixZQUFZLENBQWE7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFxQjtRQUFVLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBa0I7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBb0I7UUF2QnZhLGlCQUFZLEdBQVcsSUFBSSxjQUFNLEVBQUUsQ0FBQztRQUtw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UUFBUSxFQUFFLEdBQUc7d0JBQ2IsS0FBSyxFQUFFLFFBQVE7cUJBQ2xCO2lCQUNKLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1lBQ0gsb0NBQW9DO1NBQ3ZDO2FBQ0k7WUFDRCxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3ZDO0lBQ0wsQ0FBQzs7SUF6VGEsd0NBQWtCLEdBQVMsZUFBZSxDQUFDO0lBQzNDLDZDQUF1QixHQUFZLHNCQUFzQixDQUFFO0lBM0I3QztRQUEzQixnQkFBUyxDQUFDLGVBQWUsQ0FBQztrQ0FBVyxpQkFBVTsyREFBQztJQUR4QyxxQkFBcUI7UUFSakMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxpQ0FBaUM7WUFDM0MsU0FBUyxFQUFFLENBQUMsbUJBQVcsRUFBRSx3QkFBZ0IsRUFBRSw2QkFBYSxFQUFFLDJCQUFtQixDQUFDO1lBQzlFLFdBQVcsRUFBRSwyRUFBMkU7WUFDeEYsU0FBUyxFQUFFLENBQUMsMEVBQTBFLENBQUM7U0FFMUYsQ0FBQzt5Q0ErQnNDLDZCQUFhLEVBQW9CLHdCQUFnQixFQUFtQiwyQkFBbUIsRUFBZ0IsV0FBSSxFQUE0Qix5QkFBZ0IsRUFBMEIsZ0NBQWMsRUFBa0IsZUFBTSxFQUF1QixtQkFBVyxFQUFtQiwyQkFBbUIsRUFBaUIsdUJBQWMsRUFBaUIsdUJBQWdCLEVBQXlCLGlDQUFrQjtPQTdCcmEscUJBQXFCLENBcVZqQztJQUFELDRCQUFDO0NBQUEsQUFyVkQsSUFxVkM7QUFyVlksc0RBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLy9hbmd1bGFyICYgbmF0aXZlc2NyaXB0IHJlZmVyZW5jZXNcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uRXh0cmFzLCBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBNb2RhbERpYWxvZ1NlcnZpY2UsIE1vZGFsRGlhbG9nT3B0aW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9tb2RhbC1kaWFsb2dcIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IGRpYWxvZ3MgPSByZXF1aXJlKFwidWkvZGlhbG9nc1wiKTtcbmltcG9ydCB7IFNjcm9sbFZpZXcgfSBmcm9tIFwidWkvc2Nyb2xsLXZpZXdcIjtcbmltcG9ydCB7IExpc3RWaWV3IH0gZnJvbSBcInVpL2xpc3Qtdmlld1wiO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gXCJ1aS9jb3JlL3ZpZXdcIjtcbmltcG9ydCB0ZXh0RmllbGQgPSByZXF1aXJlKFwidWkvdGV4dC1maWVsZFwiKTtcbmltcG9ydCAqIGFzIGdlc3R1cmVzIGZyb20gXCJ1aS9nZXN0dXJlc1wiO1xuXG4vL2V4dGVybmFsIG1vZHVsZXMgYW5kIHBsdWdpbnNcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcblxuLy9hcHAgcmVmZXJlbmNlc1xuaW1wb3J0IHsgTG9hZGVyUHJvZ3Jlc3MsIFBhc3Nlbmdlckxpc3RUZW1wbGF0ZSwgUGFzc2VuZ2VyTGlzdCwgQWNjb250UHJvZmlsZU1vZGVsLCBDb21wZW5zYXRpb25PcmRlcklELCBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUsIENvbXBlbnNhdGlvblJlYXNvbk1vZHVsZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvaW50ZXJmYWNlL2luZGV4XCJcbmltcG9ydCB7IERhdGFTZXJ2aWNlLCBDaGVja2luT3JkZXJTZXJ2aWNlLCBQYXNzZW5nZXJTZXJ2aWNlLCBDb21wZW5zYXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9pbmRleFwiO1xuaW1wb3J0IHsgT3JkZXIsIENvdW50cnlDb2xsZWN0aW9uLCBGbGlnaHRTZXJ2aWNlSW5mbywgRmxpZ2h0LCBTZWFyY2gsIEFjY291bnRQcm9maWxlLCBBUElTRG9jdW1lbnQsIENvbXBhbnNhdGlvbiwgQWdlbnRQcml2aWxhZ2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL21vZGVsL2luZGV4XCI7XG5pbXBvcnQgeyBDb252ZXJ0ZXJzIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC91dGlscy9pbmRleFwiO1xuaW1wb3J0IHsgRGF0ZVBpY2tlck1vZGFsLCBEYXRlUGlja2V0Q29udGV4dCB9IGZyb20gXCIuLi8uLi9jb21wb25lbnRzL2RhdGUtcGlja2VyL2RhdGUtcGlja2VyLW1vZGFsXCI7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vLi4vYXBwLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBBcHBFeGVjdXRpb250aW1lIH0gZnJvbSBcIi4uLy4uL2FwcC5leGVjdXRpb250aW1lXCI7XG5pbXBvcnQgeyBpc0FuZHJvaWQsIGlzSU9TLCBkZXZpY2UsIHNjcmVlbiB9IGZyb20gXCJwbGF0Zm9ybVwiO1xuaW1wb3J0IHsgRlFUViB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbW9kZWwvaW5kZXhcIlxuaW1wb3J0IHsgVGltZU91dFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3RpbWVPdXQuc2VydmljZVwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJjb21wZW5zYXRpb24tc2VsZWN0c2VnbWVudC1wYWdlXCIsXG4gICAgcHJvdmlkZXJzOiBbRGF0YVNlcnZpY2UsIFBhc3NlbmdlclNlcnZpY2UsIENvbmZpZ3VyYXRpb24sIENvbXBlbnNhdGlvblNlcnZpY2VdLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vY29tcG9uZW50cy9jb21wZW5zYXRpb24tc2VsZWN0cGF4L2NvbXBlbnNhdGlvbi1zZWxlY3RwYXguY29tcG9uZW50Lmh0bWxcIixcbiAgICBzdHlsZVVybHM6IFtcIi4vY29tcG9uZW50cy9jb21wZW5zYXRpb24tc2VsZWN0cGF4L2NvbXBlbnNhdGlvbi1zZWxlY3RwYXguY29tcG9uZW50LmNzc1wiXVxuXG59KVxuXG5leHBvcnQgY2xhc3MgQ29tcGVuc2F0aW9uU2VsZWN0UGF4IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBAVmlld0NoaWxkKCdwYWdlY29udGFpbmVyJykgcGFnZUNvbnQ6IEVsZW1lbnRSZWY7XG4gICAgcHVibGljIGlzRXJyb3I6IGJvb2xlYW47XG4gICAgcHVibGljIGVycm9yTWVzc2FnZTogc3RyaW5nO1xuICAgIHB1YmxpYyBsb2FkZXJQcm9ncmVzczogTG9hZGVyUHJvZ3Jlc3M7XG4gICAgcHVibGljIHN0YXJ0RGF0ZTogRGF0ZTtcbiAgICBwdWJsaWMgU2VhcmNoRmllbGRzOiBTZWFyY2ggPSBuZXcgU2VhcmNoKCk7XG4gICAgcHVibGljIEN1ckRhdGU6IERhdGU7XG4gICAgcHVibGljIHVzZXJkZXRhaWxzOiBhbnk7XG4gICAgcHVibGljIENvbWVuc2F0aW9uUmVhc29uOiBhbnk7XG4gICAgcHVibGljIE9yZGVySWQ6IGFueTtcbiAgICBwdWJsaWMgSXNQYXhSZWFzb25TZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBBZ2VudFByaXZpbGFnZTogQWdlbnRQcml2aWxhZ2UuUm9vdE9iamVjdCA9IG5ldyBBZ2VudFByaXZpbGFnZS5Sb290T2JqZWN0KCk7XG4gICAgcHVibGljIGNoZWNrZWRDb3VudDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgRmxpZ2h0RGV0YWlsczogYW55O1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25MaXN0OiBDb21wYW5zYXRpb247XG4gICAgcHVibGljIGlzQ2hlY2tpbkRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzR2F0ZURpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIFNlbGVjdGVkUGFzc2VuZ2VyOiBBcnJheTxDb21wZW5zYXRpb25PcmRlcklELlBhc3Nlbmdlcj4gPSBbXTtcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdDogQXJyYXk8YW55PiA9IFtdO1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25GdWxsUGF4TGlzdDogQXJyYXk8Q29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q+ID0gW107XG4gICAgcHVibGljIENvbXBlbnNhdGlvbk1vZGVsOiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUm9vdE9iamVjdCA9IG5ldyBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUm9vdE9iamVjdDtcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uUmVhc29uOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgcHVibGljIENvbXBlbnNhdGlvblJlYXNvbkxpc3Q6IEFycmF5PENvbXBlbnNhdGlvblJlYXNvbk1vZHVsZS5Db21wZW5zYXRpb25SZWFzb24+ID0gW107XG4gICAgcHVibGljIFBheEluZm86IEFycmF5PENvbXBlbnNhdGlvbk9yZGVySUQuUGFzc2VuZ2VyPiA9IFtdO1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25PcmRlckRldGFpbHM6IENvbXBlbnNhdGlvbk9yZGVySUQuUm9vdE9iamVjdCA9IG5ldyBDb21wZW5zYXRpb25PcmRlcklELlJvb3RPYmplY3QoKTtcbiAgICBwdWJsaWMgQnJlUmVzcG9uc2U6IEFycmF5PENvbXBlbnNhdGlvbk9yZGVySUQuRmxpZ2h0U2VnbWVudD4gPSBbXTtcbiAgICBwdWJsaWMgc3RhdGljIENPTVBFTlNBVElPTlJFQVNPTjpzdHJpbmc9IFwiU2VsZWN0IFJlYXNvblwiO1xuICAgIHB1YmxpYyBzdGF0aWMgQ09NUEVOU0FUSU9OUkVBU09OVE9BU1QgOiBzdHJpbmcgPSBcIkNvbXBlbnNhdGlvbiBSZWFzb246XCIgO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2NvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb24scHJpdmF0ZSBfc2VydmljZXMgOlBhc3NlbmdlclNlcnZpY2UsIHByaXZhdGUgX3NoYXJlZDogQ2hlY2tpbk9yZGVyU2VydmljZSwgcHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMsIHB1YmxpYyBfdGltZW91dFNlcnZpY2U6IFRpbWVPdXRTZXJ2aWNlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwdWJsaWMgX2RhdGFTZXJ2aWNlOiBEYXRhU2VydmljZSwgcHVibGljIF9zZXJ2aWNlOiBDb21wZW5zYXRpb25TZXJ2aWNlLCBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSB2Y1JlZjogVmlld0NvbnRhaW5lclJlZiwgcHJpdmF0ZSBfbW9kYWxTZXJ2aWNlOiBNb2RhbERpYWxvZ1NlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5pc0Vycm9yID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gXCJcIjtcbiAgICAgICAgdGhpcy5TZWFyY2hGaWVsZHMuRmxpZ2h0RGF0ZSA9IG1vbWVudCgpLmZvcm1hdChcIkREIE1NTU0gWVlZWVwiKTtcbiAgICAgICAgdGhpcy5DdXJEYXRlID0gbW9tZW50KCkudG9EYXRlKCk7XG4gICAgICAgIHRoaXMuc3RhcnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcyA9IG5ldyBMb2FkZXJQcm9ncmVzcygpO1xuICAgIH1cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCd+L2ltYWdlcy9sb2dpbl9iYWNrLmpwZWcnKVwiO1xuICAgICAgICB0aGlzLnBhZ2Uuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBcImNvdmVyIFwiO1xuICAgICAgICB0aGlzLkNvbWVuc2F0aW9uUmVhc29uID0gQ29tcGVuc2F0aW9uU2VsZWN0UGF4LkNPTVBFTlNBVElPTlJFQVNPTjtcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5pbml0TG9hZGVyKHRoaXMucGFnZUNvbnQpO1xuICAgICAgICB0aGlzLnVzZXJkZXRhaWxzID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VyZGV0YWlsc1wiLCBcIlwiKTtcbiAgICAgICAgdGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNoZWNraW5EaXNhYmxlZFwiLCApO1xuICAgICAgICB0aGlzLmlzR2F0ZURpc2FibGVkID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiZ2F0ZURpc2FibGVkXCIsICk7XG4gICAgICAgIHRoaXMuZ2V0Q29tcGVuc2F0aW9uUmVhc29uKCk7XG4gICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uT3JkZXJEZXRhaWxzID0gdGhpcy5fc2hhcmVkLmdldENvbXBlbnNhdGlvbk9yZGVyRGVhdGlscygpO1xuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh0aGlzLkNvbXBlbnNhdGlvbk9yZGVyRGV0YWlscykpO1xuICAgICAgICB0aGlzLlBheEluZm8gPSB0aGlzLl9zaGFyZWQuZ2V0Q29tcGVuc2F0aW9uUGF4TGlzdCgpO1xuICAgICAgICB0aGlzLk9yZGVySWQgPSB0aGlzLkNvbXBlbnNhdGlvbk9yZGVyRGV0YWlscy5GbGlnaHRTZWdtZW50c1swXS5QYXNzZW5nZXJzWzBdLk9yZGVySWQ7XG4gICAgfVxuICAgIHRvZ2dsZUNoZWNrZWQoUGF4OiBDb21wZW5zYXRpb25PcmRlcklELlBhc3Nlbmdlcikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBheDpcIiArIEpTT04uc3RyaW5naWZ5KFBheC5Jc3NlbGVjdGVkKSk7XG4gICAgICAgIGlmIChQYXguSXNzZWxlY3RlZCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgUGF4Lklzc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5jaGVja2VkQ291bnQgPSB0aGlzLmNoZWNrZWRDb3VudCArIDE7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLnB1c2goUGF4KTtcbiAgICAgICAgICAgIGlmICh0aGlzLkNvbWVuc2F0aW9uUmVhc29uICE9IENvbXBlbnNhdGlvblNlbGVjdFBheC5DT01QRU5TQVRJT05SRUFTT04pIHtcbiAgICAgICAgICAgICAgICBQYXguQ29tcGVuc2F0aW9uUmVhc29uID0gdGhpcy5Db21lbnNhdGlvblJlYXNvbjtcbiAgICAgICAgICAgICAgICBQYXguQ29tcGVuc2F0aW9uUmVhc29uSWQgPSB0aGlzLkNvbXBlbnNhdGlvblJlYXNvbkxpc3QuZmlsdGVyKG0gPT4gbS5Db21wUmVhc29uVGV4dCA9PSB0aGlzLkNvbWVuc2F0aW9uUmVhc29uKVswXS5Db21wUmVhc29uSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLnNwbGljZSh0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmluZGV4T2YoUGF4KSwgMSk7XG4gICAgICAgICAgICBQYXguQ29tcGVuc2F0aW9uUmVhc29uID0gXCJcIjtcbiAgICAgICAgICAgIFBheC5Db21wZW5zYXRpb25SZWFzb25JZCA9IG51bGw7XG4gICAgICAgICAgICBQYXguSXNzZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGF4OlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5TZWxlY3RlZFBhc3NlbmdlcikpO1xuICAgIH1cbiAgICBkaXNwbGF5UHJvZHVjdEFjdGlvbkRpYWxvZygpIHtcbiAgICAgICAgaWYgKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgPT0gW10pIHtcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiUGxlYXNlIFNlbGVjdCB0aGUgUGFzc2VuZ2VyXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiQ29tcGVuc2F0aW9uIFJlYXNvblwiLFxuICAgICAgICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICAgICAgYWN0aW9uczogdGhpcy5Db21wZW5zYXRpb25SZWFzb24sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSBcIkNhbmNlbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tZW5zYXRpb25SZWFzb24gPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuUGF4SW5mby5maWx0ZXIobSA9PiBtLklzc2VsZWN0ZWQgPT0gdHJ1ZSkuZm9yRWFjaCgoZGF0YSwgSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLklzc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLkNvbXBlbnNhdGlvblJlYXNvbiA9IHRoaXMuQ29tZW5zYXRpb25SZWFzb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5Db21wZW5zYXRpb25SZWFzb25JZCA9IHRoaXMuQ29tcGVuc2F0aW9uUmVhc29uTGlzdC5maWx0ZXIobSA9PiBtLkNvbXBSZWFzb25UZXh0ID09IHRoaXMuQ29tZW5zYXRpb25SZWFzb24pWzBdLkNvbXBSZWFzb25JZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk9ialwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q29tcGVuc2F0aW9uUmVhc29uKCk6IHZvaWQge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZWFzb24gMVwiKTtcbiAgICAgICAgICAgIGxldCBSZWFzb25SZXF1ZXN0ID0gdGhpcy5fc2hhcmVkLmdldEFnZW50UHJpdmlsYWdlKCk7XG4gICAgICAgICAgICB0aGlzLkFnZW50UHJpdmlsYWdlLlByaXZpbGVnZXMgPSBSZWFzb25SZXF1ZXN0O1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcmk6XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLkFnZW50UHJpdmlsYWdlKSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IEdldENvbXBlbnNhdGlvblJlYXNvbiBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBTdGFydCBEYXRlIFRpbWUgOiAnICsgc0RhdGUpO1xuICAgICAgICAgICAgdGhpcy5fc2VydmljZS5nZXRDb21wZW5zYXRpb25SZWFzb25zKHRoaXMuQWdlbnRQcml2aWxhZ2UpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuQ29tcGVuc2F0aW9uUmVhc29uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBDb21wYW5zYXRpb25EZXRhaWxzOiBhbnkgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgQ29tcGFuc2F0aW9uRGV0YWlscy5Db21wZW5zYXRpb25SZWFzb24uZm9yRWFjaCgoS2V5VmFsdWUsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbXByZWFzb24gPSBuZXcgQ29tcGVuc2F0aW9uUmVhc29uTW9kdWxlLkNvbXBlbnNhdGlvblJlYXNvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXByZWFzb24uQ29tcFJlYXNvblRleHQgPSBLZXlWYWx1ZS5Db21wUmVhc29uVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wcmVhc29uLkNvbXBSZWFzb25JZCA9IEtleVZhbHVlLkNvbXBSZWFzb25JZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvblJlYXNvbkxpc3QucHVzaChjb21wcmVhc29uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJlYXNvbiA6XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLkNvbXBlbnNhdGlvblJlYXNvbkxpc3QpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvblJlYXNvbi5wdXNoKEtleVZhbHVlLkNvbXBSZWFzb25UZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KENvbXBlbnNhdGlvblNlbGVjdFBheC5DT01QRU5TQVRJT05SRUFTT05UT0FTVCArIGRhdGEuRXJyb3JzWzBdLk1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHZhciBlbmREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDaGVja0luUGF4IFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZW5kRGF0ZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ2hlY2tJblBheCBTZXJ2aWNlIEV4ZWN1dGlvbiBUaW1lIDogJyArIEFwcEV4ZWN1dGlvbnRpbWUuRXhlY3V0aW9uVGltZShuZXcgRGF0ZShzRGF0ZSksIG5ldyBEYXRlKGVuZERhdGUpKSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIG5hdmlnYXRldG9hZGRpdGlvbmFsZGV0YWlscyhQYXhpdGVtOiBDb21wZW5zYXRpb25PcmRlcklELlBhc3Nlbmdlcikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBheDpcIiArIEpTT04uc3RyaW5naWZ5KFBheGl0ZW0pKTtcbiAgICAgICAgdmFyIHByZVBhZ2U6IHN0cmluZyA9IFwiU2VhcmNoUmVzdWx0XCI7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJjb21wZW5zYXRpb25hZGRpdGlvbmFsZGV0YWlsc1wiXSwge1xuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH0sIHF1ZXJ5UGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgXCJkYXRhXCI6IEpTT04uc3RyaW5naWZ5KFBheGl0ZW0pLFxuICAgICAgICAgICAgICAgIFwicHJlcGFnZVwiOiBwcmVQYWdlLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICBzYXZlRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgJiYgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuQ29tcGVuc2F0aW9uUmVhc29uICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGlmICh0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnRpbnVlRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgJiYgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuQ29tcGVuc2F0aW9uUmVhc29uICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Jc1BheFJlYXNvblNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGlmICh0aGlzLklzUGF4UmVhc29uU2VsZWN0ZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnRpbnVlKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0lzc3VlQ29tcGVuc2F0aW9uIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyID0gdGhpcy5QYXhJbmZvLmZpbHRlcihvYmogPT4gb2JqLklzc2VsZWN0ZWQgPT0gdHJ1ZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5TZWxlY3RlZFBhc3Nlbmdlci5maWx0ZXIobSA9PiBtLkNvbXBlbnNhdGlvblJlYXNvbiAhPSBDb21wZW5zYXRpb25TZWxlY3RQYXguQ09NUEVOU0FUSU9OUkVBU09OKSkge1xuICAgICAgICAgICAgICAgIGxldCBwcml2aWxhZ2UgPSB0aGlzLl9zaGFyZWQuZ2V0QWdlbnRQcml2aWxhZ2UoKTtcbiAgICAgICAgICAgICAgICBsZXQgSXNzdWVDb21wdGVtcGxhdGU6IGFueSA9IENvbnZlcnRlcnMuY29udmVydFRvQlJFUmVxdWVzdEZvck9yZGVySUQodGhpcy5Db21wZW5zYXRpb25PcmRlckRldGFpbHMsIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIsIHByaXZpbGFnZSwgdGhpcy5Db21wZW5zYXRpb25Nb2RlbC5GbGlnaHRNb2RlbCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJc3N1ZUNvbXB0ZW1wbGF0ZTpcIiArIEpTT04uc3RyaW5naWZ5KElzc3VlQ29tcHRlbXBsYXRlKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VydmljZS5wb3N0QnJlUmVxdWVzdChJc3N1ZUNvbXB0ZW1wbGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGF0YTpcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLlJlc3VsdHMgIT0gW10gJiYgZGF0YS5TdWNjZXNzID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5SZXN1bHRzWzBdLkZsaWdodFNlZ21lbnRzWzBdLlBhc3NlbmdlcnNbMF0uQlJFX0NvbXBlbnNhdGlvbnMubGVuZ3RoID4gMCB8fCBkYXRhLlJlc3VsdHNbMF0uRmxpZ2h0U2VnbWVudHNbMF0uUGFzc2VuZ2Vyc1swXS5CUkVfQ29tcGVuc2F0aW9ucyAhPSBbXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkJyZVJlc3BvbnNlID0gQ29udmVydGVycy5jb252ZXJ0VG9CUkVSZXNwb25zZUZvck9yZGVySWQoZGF0YSwgdGhpcy5TZWxlY3RlZFBhc3Nlbmdlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRDb21wZW5zYXRpb25QYXhMaXN0KHRoaXMuQnJlUmVzcG9uc2VbMF0uUGFzc2VuZ2Vycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5zZXRDb21wZW5zYXRpb25PcmRlckRlYXRpbHModGhpcy5CcmVSZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQlJFQ29tcFJlc3BvbnNlMTpcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuQnJlUmVzcG9uc2VbMF0uUGFzc2VuZ2VycykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRldG9pc3N1ZWNvbXBlbnNhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJDb21wZW5zYXRpb24gbm90IGlzc3VlZCBmb3IgdGhpcyBwYXJ0aWN1bGFyIFJlYXNvblwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChkYXRhLkVycm9yc1swXS5NZXNzYWdlKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlcnZpY2VFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIlBsZWFzZSBjaG9vc2UgdGhlIHJlYXNvblwiKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgdmFyIGVuZERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0lzc3VlQ29tcGVuc2F0aW9uIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZW5kRGF0ZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSXNzdWVDb21wZW5zYXRpb24gU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlbmREYXRlKSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIHNhdmUoKSB7XG4gICAgLy8gICAgIHRyeSB7XG4gICAgLy8gICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLnNob3dMb2FkZXIoKTtcbiAgICAvLyAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZygnU2F2ZUNvbXBlbnNhdGlvbiBTZXJ2aWNlIC0tLS0tLS0tLS0tLS0tLSBTdGFydCBEYXRlIFRpbWUgOiAnICsgc0RhdGUpO1xuICAgIC8vICAgICAgICAgdGhpcy5TZWxlY3RlZFBhc3NlbmdlciA9IHRoaXMuUGF4SW5mby5maWx0ZXIob2JqID0+IG9iai5Jc3NlbGVjdGVkID09IHRydWUpO1xuICAgIC8vICAgICAgICAgbGV0IFNhdmVDb21wdGVtcGxhdGU6IGFueSA9IENvbnZlcnRlcnMuY29udmVydFRvU2F2ZUNvbXBlbnNhdGlvblRlbXBsYXRlKHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIsIHRoaXMuQ29tcGVuc2F0aW9uTW9kZWwuRmxpZ2h0TW9kZWwpO1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJEYXRhMTpcIiArIEpTT04uc3RyaW5naWZ5KFNhdmVDb21wdGVtcGxhdGUpKTtcbiAgICAvLyAgICAgICAgIHRoaXMuX3NlcnZpY2Uuc2F2ZUNvbXBlbnNhdGlvblJlYXNvbnMoU2F2ZUNvbXB0ZW1wbGF0ZSlcbiAgICAvLyAgICAgICAgICAgICAuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgIC8vICAgICAgICAgICAgICAgICBsZXQgQ29tcGFuc2F0aW9uRGV0YWlsczogYW55ID0gZGF0YTtcbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEYXRhOlwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkUGFzc2VuZ2VyLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBkYXRhLklzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAvLyAgICAgICAgICAgICAgICAgfSk7XG4gICAgLy8gICAgICAgICAgICAgfSwgZXJyID0+IHtcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgLy8gICAgICAgICAgICAgfSk7XG5cbiAgICAvLyAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgIC8vICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG5cbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBmaW5hbGx5IHtcbiAgICAvLyAgICAgICAgIHZhciBlbmREYXRlID0gbmV3IERhdGUoKTtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCdTYXZlQ29tcGVuc2F0aW9uIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZW5kRGF0ZSk7XG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZygnU2F2ZUNvbXBlbnNhdGlvbiBTZXJ2aWNlIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZW5kRGF0ZSkpKTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cbiAgICBuYXZpZ2F0ZXRvaXNzdWVjb21wZW5zYXRpb24oKTogdm9pZCB7XG4gICAgICAgIHZhciBwcmVQYWdlOiBzdHJpbmcgPSBcIk9yZGVySWRcIjtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImlzc3VlY29tcGVuc2F0aW9uXCJdLCB7XG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgfSwgcXVlcnlQYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBcImRhdGFcIjogdGhpcy5PcmRlcklkLFxuICAgICAgICAgICAgICAgIFwicHJlcGFnZVwiOiBwcmVQYWdlLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfVxuICAgIG5hdmlnYXRlVG9Db21wZW5zYXRpb24oKSB7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJjb21wZW5zYXRpb25cIl0sIHtcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIG5hdmlnYXRlVG9TZXR0aW5nKCkge1xuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wic2V0dGluZ1wiXSwge1xuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG5hdmlnYXRlVG9TZWFyY2goKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQ2hlY2tpbkRpc2FibGVkID09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZWFyY2hcIl0sIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbm5hdmlnYXRlVG9EZXBhcnR1cmVzKCkge1xuICAgICAgICBpZiAodGhpcy5pc0dhdGVEaXNhYmxlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiZGVwYXJ0aG9tZVwiXSwge1xuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcjogYW55KSB7XG4gICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci50b1N0cmluZygpO1xuICAgICAgICBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJTZXNzaW9uVGltZW91dFwiKSA+IC0xKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJTZXNzaW9uIFRpbWUgT3V0XCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGJlZW4gdGltZSBvdXRcIixcbiAgICAgICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIlwiXSwge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChlcnJvck1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=