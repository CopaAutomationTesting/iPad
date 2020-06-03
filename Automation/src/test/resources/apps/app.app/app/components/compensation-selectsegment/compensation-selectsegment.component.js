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
var CompensationSelectSegment = /** @class */ (function () {
    function CompensationSelectSegment(_configuration, _services, activatedRouter, _shared, page, routerExtensions, _timeoutService, router, _dataService, _service, route, vcRef, _modalService) {
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
        this.checkedCount = 0;
        this.AgentPrivilage = new index_3.AgentPrivilage.RootObject();
        this.continueWithoutSegment = false;
        this.SelectedPassenger = [];
        this.CompensationPassengerList = [];
        this.CompensationFullPaxList = [];
        this.CompensationModel = new index_1.CompensationSearchModule.CompensationRootObject;
        this.CompensationReasonList = [];
        this.SelectedSegment = [];
        this.isContinueEnabled = false;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.SegementInfo = [];
        this.CompensationOrderDetails = new index_1.CompensationOrderID.RootObject();
        this.isError = false;
        this.errorMessage = "";
        this.SearchFields.FlightDate = moment().format("DD MMMM YYYY");
        this.CurDate = moment().toDate();
        this.startDate = new Date();
        this.loaderProgress = new index_1.LoaderProgress();
    }
    CompensationSelectSegment_1 = CompensationSelectSegment;
    CompensationSelectSegment.prototype.ngOnInit = function () {
        var _this = this;
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.ComensationReason = "Select Reason";
        this.loaderProgress.initLoader(this.pageCont);
        this.activatedRouter.queryParams.subscribe(function (params) {
            if (params["data"] != null && params["data"] != "" && params["data"] != "undefined") {
                var OrderIdOrETK = params["data"];
                _this.OrderIdOrETKt = OrderIdOrETK.toUpperCase();
            }
        });
        var ReasonRequest = this._shared.getAgentPrivilage();
        this.AgentPrivilage.Privileges = ReasonRequest;
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.CompensationOrderDetails = this._shared.getCompensationOrderDeatils();
        this.CompensationOrderDetails.FlightSegments.forEach(function (data, Index) {
            data.IsSegSelected = false;
        });
        this.SegementInfo = this.CompensationOrderDetails.FlightSegments;
        this.OrderId = this.CompensationOrderDetails.FlightSegments[0].Passengers[0].OrderId;
        this.AgentPrivilage.Privileges.forEach(function (data, Index) {
            if (data.Name == "IssueCompensationNotBasedOnFlight") {
                Toast.makeText(CompensationSelectSegment_1.COMPENSATIONSEGMENTTOAST).show();
            }
        });
    };
    CompensationSelectSegment.prototype.continue = function () {
        if (this.SelectedSegment.length == 0) {
            this.CompensationOrderDetails.FlightSegments.forEach(function (SegData, SegIndex) {
                SegData.Passengers.forEach(function (data, Index) {
                    data.Isselected = false;
                    data.GivenName = data.PaxFirstNm;
                    data.LastName = data.PaxLastNm;
                    data.FullName = data.PaxFirstNm + "/" + data.PaxLastNm;
                    data.UpdateLockNbr = data.UpdateLockNbr;
                    data.IsExistingCompensation = data.IsExistingCompensation;
                    data.IsCompensationIssued = data.IsCompensationIssued;
                    data.Compensations = data.Compensations;
                    data.ExistingCompensations = data.ExistingCompensations;
                    data.CompensationReason = "";
                });
            });
            this._shared.SetPassengerTypeService(this.CompensationOrderDetails.FlightSegments[0].Passengers);
            this._shared.setCompensationPaxList(this.CompensationOrderDetails.FlightSegments[0].Passengers);
            this.navigatetoCompensationSelectPax();
        }
        else {
            var flightDate = this.SelectedSegment[0].DepartureDt;
            var flightNumber = this.SelectedSegment[0].FlightNo;
            var departure = this.SelectedSegment[0].Departure;
            ApplicationSettings.setString("SearchLocation", departure);
            this.flightStatus(flightDate, flightNumber, departure);
        }
    };
    CompensationSelectSegment.prototype.continueEnabled = function () {
        var _this = this;
        this.AgentPrivilage.Privileges.forEach(function (data, Index) {
            if (data.Name == "IssueCompensationNotBasedOnFlight") {
                _this.continueWithoutSegment = true;
            }
        });
        if (this.continueWithoutSegment) {
            return true;
        }
        else {
            if (this.isContinueEnabled) {
                return true;
            }
            else {
                return false;
            }
        }
    };
    CompensationSelectSegment.prototype.flightStatus = function (date, flightnumber, departure) {
        var _this = this;
        try {
            var sDate = new Date();
            console.log('Get CompensationDetails Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            var flightddate = moment(date).format("YYYY-MM-DD");
            console.log("Date" + flightddate);
            var location = ApplicationSettings.getString("SearchLocation", "");
            this._service.status(flightddate, flightnumber, departure).subscribe(function (data) {
                if (data.Flights != null) {
                    var status_1 = data;
                    var CompensationFlightInfo = index_4.Converters.convertToFlightHeaderInfo(status_1, departure);
                    _this._shared.setCompensationFlightDetails(status_1);
                    var SelectedSegment = _this.CompensationOrderDetails.FlightSegments.filter(function (m) { return m.FlightNo == _this.SelectedSegment[0].FlightNo; })[0];
                    _this.CompensationOrderDetails.FlightSegments = [];
                    _this.CompensationOrderDetails.FlightSegments.push(SelectedSegment);
                    console.log("v" + JSON.stringify(_this.CompensationOrderDetails));
                    _this._shared.setCompensationList(_this.CompensationOrderDetails);
                    _this._shared.SetPassengerTypeService(SelectedSegment.Passengers);
                    _this.navigatetoCompensationSearchResult();
                    _this.loaderProgress.hideLoader();
                }
                else {
                    Toast.makeText(data.Warnings[0].Message).show();
                    _this._shared.setCompensationFlightDetails(data);
                    var SelectedSegment = _this.CompensationOrderDetails.FlightSegments.filter(function (m) { return m.FlightNo == _this.SelectedSegment[0].FlightNo; })[0];
                    _this.CompensationOrderDetails.FlightSegments = [];
                    _this.CompensationOrderDetails.FlightSegments.push(SelectedSegment);
                    console.log("v" + JSON.stringify(_this.CompensationOrderDetails));
                    _this._shared.setCompensationList(_this.CompensationOrderDetails);
                    _this._shared.SetPassengerTypeService(SelectedSegment.Passengers);
                    _this.navigatetoCompensationSearchResult();
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
    CompensationSelectSegment.prototype.toggleChecked = function (items) {
        var _this = this;
        // console.log(args);
        // var segment : CompensationOrderID.FlightSegment;
        if (items.IsSegSelected == false) {
            this.SegementInfo.forEach(function (data, Index) {
                _this.SelectedSegment = [];
                data.IsSegSelected = false;
            });
            if (items.FlightNo.substr(0, 2) == "CM") {
                items.IsSegSelected = true;
                this.isContinueEnabled = true;
                this.SelectedSegment.push(items);
            }
            else {
                items.IsSegSelected = true;
                this.isContinueEnabled = false;
                this.SelectedSegment = [];
                Toast.makeText("Not eligible for compensation").show();
            }
        }
        else {
            items.IsSegSelected = false;
            this.isContinueEnabled = false;
            this.SelectedSegment = [];
        }
    };
    CompensationSelectSegment.prototype.navigatetoCompensationSelectPax = function () {
        this.routerExtensions.navigate(["compensationselectpax"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSelectSegment.prototype.navigatetoCompensationPaxWithSeg = function () {
        this.routerExtensions.navigate(["compensationpaxwithseg"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSelectSegment.prototype.navigateToCompensation = function () {
        this.routerExtensions.navigate(["compensation"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSelectSegment.prototype.navigatetoCompensationSearchResult = function () {
        this.routerExtensions.navigate(["compensationresult"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSelectSegment.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationSelectSegment.prototype.navigateToSearch = function () {
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
    CompensationSelectSegment.prototype.navigateToDepartures = function () {
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
    CompensationSelectSegment.prototype.handleServiceError = function (error) {
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
    var CompensationSelectSegment_1;
    CompensationSelectSegment.COMPENSATIONSEGMENTTOAST = "Continue to compensate without flight";
    __decorate([
        core_1.ViewChild('pagecontainer'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationSelectSegment.prototype, "pageCont", void 0);
    CompensationSelectSegment = CompensationSelectSegment_1 = __decorate([
        core_1.Component({
            selector: "compensation-selectsegment-page",
            providers: [index_2.DataService, index_2.PassengerService, app_constants_1.Configuration, index_2.CompensationService],
            templateUrl: "./components/compensation-selectsegment/compensation-selectsegment.component.html",
            styleUrls: ["./components/compensation-selectsegment/compensation-selectsegment.component.css"]
        }),
        __metadata("design:paramtypes", [app_constants_1.Configuration, index_2.PassengerService, router_1.ActivatedRoute, index_2.CheckinOrderService, page_1.Page, router_2.RouterExtensions, timeOut_service_1.TimeOutService, router_1.Router, index_2.DataService, index_2.CompensationService, router_1.ActivatedRoute, core_1.ViewContainerRef, modal_dialog_1.ModalDialogService])
    ], CompensationSelectSegment);
    return CompensationSelectSegment;
}());
exports.CompensationSelectSegment = CompensationSelectSegment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGVuc2F0aW9uLXNlbGVjdHNlZ21lbnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tcGVuc2F0aW9uLXNlbGVjdHNlZ21lbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLHNDQUEyRjtBQUMzRiwwQ0FBMkU7QUFFM0Usc0RBQStEO0FBQy9ELGtFQUEyRjtBQUMzRixnQ0FBK0I7QUFDL0Isb0NBQXVDO0FBT3ZDLDhCQUE4QjtBQUM5QiwwREFBNEQ7QUFDNUQsK0JBQWlDO0FBQ2pDLDBDQUE0QztBQUU1QyxnQkFBZ0I7QUFDaEIsc0RBQXNLO0FBQ3RLLHFEQUFzSDtBQUN0SCxrREFBbUs7QUFDbkssa0RBQXNEO0FBRXRELHFEQUFvRDtBQUNwRCw2REFBMkQ7QUFHM0QseUVBQXVFO0FBVXZFO0lBOEJJLG1DQUFvQixjQUE2QixFQUFVLFNBQTJCLEVBQVUsZUFBK0IsRUFBVSxPQUE0QixFQUFVLElBQVUsRUFBVSxnQkFBa0MsRUFBUyxlQUErQixFQUFVLE1BQWMsRUFBUyxZQUF5QixFQUFTLFFBQTZCLEVBQVUsS0FBcUIsRUFBVSxLQUF1QixFQUFVLGFBQWlDO1FBQXBjLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFxQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQVMsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBcUI7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUFVLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQVUsa0JBQWEsR0FBYixhQUFhLENB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ZXJlbmNlc1xuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBSb3V0ZXIsIE5hdmlnYXRpb25FeHRyYXMsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IE1vZGFsRGlhbG9nU2VydmljZSwgTW9kYWxEaWFsb2dPcHRpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL21vZGFsLWRpYWxvZ1wiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgZGlhbG9ncyA9IHJlcXVpcmUoXCJ1aS9kaWFsb2dzXCIpO1xuaW1wb3J0IHsgU2Nyb2xsVmlldyB9IGZyb20gXCJ1aS9zY3JvbGwtdmlld1wiO1xuaW1wb3J0IHsgTGlzdFZpZXcgfSBmcm9tIFwidWkvbGlzdC12aWV3XCI7XG5pbXBvcnQgeyBWaWV3IH0gZnJvbSBcInVpL2NvcmUvdmlld1wiO1xuaW1wb3J0IHRleHRGaWVsZCA9IHJlcXVpcmUoXCJ1aS90ZXh0LWZpZWxkXCIpO1xuaW1wb3J0ICogYXMgZ2VzdHVyZXMgZnJvbSBcInVpL2dlc3R1cmVzXCI7XG5cbi8vZXh0ZXJuYWwgbW9kdWxlcyBhbmQgcGx1Z2luc1xuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tIFwibW9tZW50XCI7XG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICduYXRpdmVzY3JpcHQtdG9hc3QnO1xuXG4vL2FwcCByZWZlcmVuY2VzXG5pbXBvcnQgeyBMb2FkZXJQcm9ncmVzcywgUGFzc2VuZ2VyTGlzdFRlbXBsYXRlLCBQYXNzZW5nZXJMaXN0LCBBY2NvbnRQcm9maWxlTW9kZWwsIENvbXBlbnNhdGlvbk9yZGVySUQsIENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZSB9IGZyb20gXCIuLi8uLi9zaGFyZWQvaW50ZXJmYWNlL2luZGV4XCJcbmltcG9ydCB7IERhdGFTZXJ2aWNlLCBDaGVja2luT3JkZXJTZXJ2aWNlLCBQYXNzZW5nZXJTZXJ2aWNlLCBDb21wZW5zYXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9pbmRleFwiO1xuaW1wb3J0IHsgT3JkZXIsIENvdW50cnlDb2xsZWN0aW9uLCBGbGlnaHRTZXJ2aWNlSW5mbywgRmxpZ2h0LCBTZWFyY2gsIEFjY291bnRQcm9maWxlLCBBUElTRG9jdW1lbnQsIENvbXBhbnNhdGlvbiwgQWdlbnRQcml2aWxhZ2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL21vZGVsL2luZGV4XCI7XG5pbXBvcnQgeyBDb252ZXJ0ZXJzIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC91dGlscy9pbmRleFwiO1xuaW1wb3J0IHsgRGF0ZVBpY2tlck1vZGFsLCBEYXRlUGlja2V0Q29udGV4dCB9IGZyb20gXCIuLi8uLi9jb21wb25lbnRzL2RhdGUtcGlja2VyL2RhdGUtcGlja2VyLW1vZGFsXCI7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vLi4vYXBwLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBBcHBFeGVjdXRpb250aW1lIH0gZnJvbSBcIi4uLy4uL2FwcC5leGVjdXRpb250aW1lXCI7XG5pbXBvcnQgeyBpc0FuZHJvaWQsIGlzSU9TLCBkZXZpY2UsIHNjcmVlbiB9IGZyb20gXCJwbGF0Zm9ybVwiO1xuaW1wb3J0IHsgRlFUViB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbW9kZWwvaW5kZXhcIlxuaW1wb3J0IHsgVGltZU91dFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3RpbWVPdXQuc2VydmljZVwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJjb21wZW5zYXRpb24tc2VsZWN0c2VnbWVudC1wYWdlXCIsXG4gICAgcHJvdmlkZXJzOiBbRGF0YVNlcnZpY2UsIFBhc3NlbmdlclNlcnZpY2UsIENvbmZpZ3VyYXRpb24sIENvbXBlbnNhdGlvblNlcnZpY2VdLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vY29tcG9uZW50cy9jb21wZW5zYXRpb24tc2VsZWN0c2VnbWVudC9jb21wZW5zYXRpb24tc2VsZWN0c2VnbWVudC5jb21wb25lbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogW1wiLi9jb21wb25lbnRzL2NvbXBlbnNhdGlvbi1zZWxlY3RzZWdtZW50L2NvbXBlbnNhdGlvbi1zZWxlY3RzZWdtZW50LmNvbXBvbmVudC5jc3NcIl1cblxufSlcblxuZXhwb3J0IGNsYXNzIENvbXBlbnNhdGlvblNlbGVjdFNlZ21lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIEBWaWV3Q2hpbGQoJ3BhZ2Vjb250YWluZXInKSBwYWdlQ29udDogRWxlbWVudFJlZjtcbiAgICBwdWJsaWMgaXNFcnJvcjogYm9vbGVhbjtcbiAgICBwdWJsaWMgZXJyb3JNZXNzYWdlOiBzdHJpbmc7XG4gICAgcHVibGljIGxvYWRlclByb2dyZXNzOiBMb2FkZXJQcm9ncmVzcztcbiAgICBwdWJsaWMgc3RhcnREYXRlOiBEYXRlO1xuICAgIHB1YmxpYyBTZWFyY2hGaWVsZHM6IFNlYXJjaCA9IG5ldyBTZWFyY2goKTtcbiAgICBwdWJsaWMgQ3VyRGF0ZTogRGF0ZTtcbiAgICBwdWJsaWMgdXNlcmRldGFpbHM6IGFueTtcbiAgICBwdWJsaWMgQ29tZW5zYXRpb25SZWFzb246IGFueTtcbiAgICBwdWJsaWMgT3JkZXJJZDogYW55O1xuICAgIHB1YmxpYyBjaGVja2VkQ291bnQ6IG51bWJlciA9IDA7XG4gICAgcHVibGljIEZsaWdodERldGFpbHM6IGFueTtcbiAgICBwdWJsaWMgT3JkZXJJZE9yRVRLdDogc3RyaW5nO1xuICAgIHB1YmxpYyBBZ2VudFByaXZpbGFnZTogQWdlbnRQcml2aWxhZ2UuUm9vdE9iamVjdCA9IG5ldyBBZ2VudFByaXZpbGFnZS5Sb290T2JqZWN0KCk7XG4gICAgcHVibGljIENvbXBlbnNhdGlvbkxpc3Q6IENvbXBhbnNhdGlvbjtcbiAgICBwdWJsaWMgY29udGludWVXaXRob3V0U2VnbWVudDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBTZWxlY3RlZFBhc3NlbmdlcjogQXJyYXk8Q29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q+ID0gW107XG4gICAgcHVibGljIENvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q6IEFycmF5PGFueT4gPSBbXTtcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uRnVsbFBheExpc3Q6IEFycmF5PENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZS5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25Nb2RlbDogQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblJvb3RPYmplY3QgPSBuZXcgQ29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblJvb3RPYmplY3Q7XG4gICAgcHVibGljIENvbXBlbnNhdGlvblJlYXNvbkxpc3Q6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICBwdWJsaWMgU2VsZWN0ZWRTZWdtZW50OiBBcnJheTxhbnk+ID0gW107XG4gICAgcHVibGljIGlzQ29udGludWVFbmFibGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzQ2hlY2tpbkRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzR2F0ZURpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIFNlZ2VtZW50SW5mbzogQXJyYXk8Q29tcGVuc2F0aW9uT3JkZXJJRC5GbGlnaHRTZWdtZW50PiA9IFtdO1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25PcmRlckRldGFpbHM6IENvbXBlbnNhdGlvbk9yZGVySUQuUm9vdE9iamVjdCA9IG5ldyBDb21wZW5zYXRpb25PcmRlcklELlJvb3RPYmplY3QoKTtcbiAgICBwdWJsaWMgc3RhdGljIENPTVBFTlNBVElPTlNFR01FTlRUT0FTVDogc3RyaW5nID0gXCJDb250aW51ZSB0byBjb21wZW5zYXRlIHdpdGhvdXQgZmxpZ2h0XCI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uLCBwcml2YXRlIF9zZXJ2aWNlczogUGFzc2VuZ2VyU2VydmljZSwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZXI6IEFjdGl2YXRlZFJvdXRlLCBwcml2YXRlIF9zaGFyZWQ6IENoZWNraW5PcmRlclNlcnZpY2UsIHByaXZhdGUgcGFnZTogUGFnZSwgcHJpdmF0ZSByb3V0ZXJFeHRlbnNpb25zOiBSb3V0ZXJFeHRlbnNpb25zLCBwdWJsaWMgX3RpbWVvdXRTZXJ2aWNlOiBUaW1lT3V0U2VydmljZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHVibGljIF9kYXRhU2VydmljZTogRGF0YVNlcnZpY2UsIHB1YmxpYyBfc2VydmljZTogQ29tcGVuc2F0aW9uU2VydmljZSwgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgdmNSZWY6IFZpZXdDb250YWluZXJSZWYsIHByaXZhdGUgX21vZGFsU2VydmljZTogTW9kYWxEaWFsb2dTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuU2VhcmNoRmllbGRzLkZsaWdodERhdGUgPSBtb21lbnQoKS5mb3JtYXQoXCJERCBNTU1NIFlZWVlcIik7XG4gICAgICAgIHRoaXMuQ3VyRGF0ZSA9IG1vbWVudCgpLnRvRGF0ZSgpO1xuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MgPSBuZXcgTG9hZGVyUHJvZ3Jlc3MoKTtcbiAgICB9XG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMucGFnZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnfi9pbWFnZXMvbG9naW5fYmFjay5qcGVnJylcIjtcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRTaXplID0gXCJjb3ZlciBcIjtcbiAgICAgICAgdGhpcy5Db21lbnNhdGlvblJlYXNvbiA9IFwiU2VsZWN0IFJlYXNvblwiO1xuICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmluaXRMb2FkZXIodGhpcy5wYWdlQ29udCk7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVkUm91dGVyLnF1ZXJ5UGFyYW1zLnN1YnNjcmliZSgocGFyYW1zKSA9PiB7XG4gICAgICAgICAgICBpZiAocGFyYW1zW1wiZGF0YVwiXSAhPSBudWxsICYmIHBhcmFtc1tcImRhdGFcIl0gIT0gXCJcIiAmJiBwYXJhbXNbXCJkYXRhXCJdICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgT3JkZXJJZE9yRVRLOiBzdHJpbmcgPSBwYXJhbXNbXCJkYXRhXCJdO1xuICAgICAgICAgICAgICAgIHRoaXMuT3JkZXJJZE9yRVRLdCA9IE9yZGVySWRPckVUSy50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IFJlYXNvblJlcXVlc3QgPSB0aGlzLl9zaGFyZWQuZ2V0QWdlbnRQcml2aWxhZ2UoKTtcbiAgICAgICAgdGhpcy5BZ2VudFByaXZpbGFnZS5Qcml2aWxlZ2VzID0gUmVhc29uUmVxdWVzdDtcbiAgICAgICAgdGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImNoZWNraW5EaXNhYmxlZFwiKTtcbiAgICAgICAgdGhpcy5pc0dhdGVEaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImdhdGVEaXNhYmxlZFwiKTtcbiAgICAgICAgdGhpcy51c2VyZGV0YWlscyA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcmRldGFpbHNcIiwgXCJcIik7XG4gICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uT3JkZXJEZXRhaWxzID0gdGhpcy5fc2hhcmVkLmdldENvbXBlbnNhdGlvbk9yZGVyRGVhdGlscygpO1xuICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbk9yZGVyRGV0YWlscy5GbGlnaHRTZWdtZW50cy5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgZGF0YS5Jc1NlZ1NlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuU2VnZW1lbnRJbmZvID0gdGhpcy5Db21wZW5zYXRpb25PcmRlckRldGFpbHMuRmxpZ2h0U2VnbWVudHM7XG4gICAgICAgIHRoaXMuT3JkZXJJZCA9IHRoaXMuQ29tcGVuc2F0aW9uT3JkZXJEZXRhaWxzLkZsaWdodFNlZ21lbnRzWzBdLlBhc3NlbmdlcnNbMF0uT3JkZXJJZDtcbiAgICAgICAgdGhpcy5BZ2VudFByaXZpbGFnZS5Qcml2aWxlZ2VzLmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAoZGF0YS5OYW1lID09IFwiSXNzdWVDb21wZW5zYXRpb25Ob3RCYXNlZE9uRmxpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChDb21wZW5zYXRpb25TZWxlY3RTZWdtZW50LkNPTVBFTlNBVElPTlNFR01FTlRUT0FTVCkuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfVxuICAgIGNvbnRpbnVlKCkge1xuICAgICAgICBpZiAodGhpcy5TZWxlY3RlZFNlZ21lbnQubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uT3JkZXJEZXRhaWxzLkZsaWdodFNlZ21lbnRzLmZvckVhY2goKFNlZ0RhdGEsIFNlZ0luZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgU2VnRGF0YS5QYXNzZW5nZXJzLmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuSXNzZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBkYXRhLkdpdmVuTmFtZSA9IGRhdGEuUGF4Rmlyc3RObTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5MYXN0TmFtZSA9IGRhdGEuUGF4TGFzdE5tO1xuICAgICAgICAgICAgICAgICAgICBkYXRhLkZ1bGxOYW1lID0gZGF0YS5QYXhGaXJzdE5tICsgXCIvXCIgKyBkYXRhLlBheExhc3RObTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5VcGRhdGVMb2NrTmJyID0gZGF0YS5VcGRhdGVMb2NrTmJyO1xuICAgICAgICAgICAgICAgICAgICBkYXRhLklzRXhpc3RpbmdDb21wZW5zYXRpb24gPSBkYXRhLklzRXhpc3RpbmdDb21wZW5zYXRpb247XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuSXNDb21wZW5zYXRpb25Jc3N1ZWQgPSBkYXRhLklzQ29tcGVuc2F0aW9uSXNzdWVkO1xuICAgICAgICAgICAgICAgICAgICBkYXRhLkNvbXBlbnNhdGlvbnMgPSBkYXRhLkNvbXBlbnNhdGlvbnM7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuRXhpc3RpbmdDb21wZW5zYXRpb25zID0gZGF0YS5FeGlzdGluZ0NvbXBlbnNhdGlvbnM7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuQ29tcGVuc2F0aW9uUmVhc29uID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRQYXNzZW5nZXJUeXBlU2VydmljZSh0aGlzLkNvbXBlbnNhdGlvbk9yZGVyRGV0YWlscy5GbGlnaHRTZWdtZW50c1swXS5QYXNzZW5nZXJzKVxuICAgICAgICAgICAgdGhpcy5fc2hhcmVkLnNldENvbXBlbnNhdGlvblBheExpc3QodGhpcy5Db21wZW5zYXRpb25PcmRlckRldGFpbHMuRmxpZ2h0U2VnbWVudHNbMF0uUGFzc2VuZ2Vycyk7XG4gICAgICAgICAgICB0aGlzLm5hdmlnYXRldG9Db21wZW5zYXRpb25TZWxlY3RQYXgoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBmbGlnaHREYXRlID0gdGhpcy5TZWxlY3RlZFNlZ21lbnRbMF0uRGVwYXJ0dXJlRHQ7XG4gICAgICAgICAgICB2YXIgZmxpZ2h0TnVtYmVyID0gdGhpcy5TZWxlY3RlZFNlZ21lbnRbMF0uRmxpZ2h0Tm87XG4gICAgICAgICAgICB2YXIgZGVwYXJ0dXJlID0gdGhpcy5TZWxlY3RlZFNlZ21lbnRbMF0uRGVwYXJ0dXJlO1xuICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJTZWFyY2hMb2NhdGlvblwiLCBkZXBhcnR1cmUpO1xuICAgICAgICAgICAgdGhpcy5mbGlnaHRTdGF0dXMoZmxpZ2h0RGF0ZSwgZmxpZ2h0TnVtYmVyLCBkZXBhcnR1cmUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnRpbnVlRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgdGhpcy5BZ2VudFByaXZpbGFnZS5Qcml2aWxlZ2VzLmZvckVhY2goKGRhdGEsIEluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAoZGF0YS5OYW1lID09IFwiSXNzdWVDb21wZW5zYXRpb25Ob3RCYXNlZE9uRmxpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRpbnVlV2l0aG91dFNlZ21lbnQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBpZiAodGhpcy5jb250aW51ZVdpdGhvdXRTZWdtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ29udGludWVFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmbGlnaHRTdGF0dXMoZGF0ZSwgZmxpZ2h0bnVtYmVyLCBkZXBhcnR1cmUpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IENvbXBlbnNhdGlvbkRldGFpbHMgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgdmFyIGZsaWdodGRkYXRlID0gbW9tZW50KGRhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRhdGVcIiArIGZsaWdodGRkYXRlKTtcbiAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiU2VhcmNoTG9jYXRpb25cIiwgXCJcIik7XG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLnN0YXR1cyhmbGlnaHRkZGF0ZSwgZmxpZ2h0bnVtYmVyLCBkZXBhcnR1cmUpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLkZsaWdodHMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3RhdHVzOiBhbnkgPSBkYXRhXG4gICAgICAgICAgICAgICAgICAgIGxldCBDb21wZW5zYXRpb25GbGlnaHRJbmZvOiBhbnkgPSBDb252ZXJ0ZXJzLmNvbnZlcnRUb0ZsaWdodEhlYWRlckluZm8oc3RhdHVzLCBkZXBhcnR1cmUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0Q29tcGVuc2F0aW9uRmxpZ2h0RGV0YWlscyhzdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgU2VsZWN0ZWRTZWdtZW50ID0gdGhpcy5Db21wZW5zYXRpb25PcmRlckRldGFpbHMuRmxpZ2h0U2VnbWVudHMuZmlsdGVyKG0gPT4gbS5GbGlnaHRObyA9PSB0aGlzLlNlbGVjdGVkU2VnbWVudFswXS5GbGlnaHRObylbMF07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uT3JkZXJEZXRhaWxzLkZsaWdodFNlZ21lbnRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uT3JkZXJEZXRhaWxzLkZsaWdodFNlZ21lbnRzLnB1c2goU2VsZWN0ZWRTZWdtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ2XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLkNvbXBlbnNhdGlvbk9yZGVyRGV0YWlscykpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0Q29tcGVuc2F0aW9uTGlzdCh0aGlzLkNvbXBlbnNhdGlvbk9yZGVyRGV0YWlscyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZC5TZXRQYXNzZW5nZXJUeXBlU2VydmljZShTZWxlY3RlZFNlZ21lbnQuUGFzc2VuZ2VycylcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZXRvQ29tcGVuc2F0aW9uU2VhcmNoUmVzdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGRhdGEuV2FybmluZ3NbMF0uTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0Q29tcGVuc2F0aW9uRmxpZ2h0RGV0YWlscyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIFNlbGVjdGVkU2VnbWVudCA9IHRoaXMuQ29tcGVuc2F0aW9uT3JkZXJEZXRhaWxzLkZsaWdodFNlZ21lbnRzLmZpbHRlcihtID0+IG0uRmxpZ2h0Tm8gPT0gdGhpcy5TZWxlY3RlZFNlZ21lbnRbMF0uRmxpZ2h0Tm8pWzBdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbk9yZGVyRGV0YWlscy5GbGlnaHRTZWdtZW50cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbk9yZGVyRGV0YWlscy5GbGlnaHRTZWdtZW50cy5wdXNoKFNlbGVjdGVkU2VnbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidlwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5Db21wZW5zYXRpb25PcmRlckRldGFpbHMpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLnNldENvbXBlbnNhdGlvbkxpc3QodGhpcy5Db21wZW5zYXRpb25PcmRlckRldGFpbHMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuU2V0UGFzc2VuZ2VyVHlwZVNlcnZpY2UoU2VsZWN0ZWRTZWdtZW50LlBhc3NlbmdlcnMpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGV0b0NvbXBlbnNhdGlvblNlYXJjaFJlc3VsdCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHZhciBlRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IENvbXBlbnNhdGlvbkRldGFpbHMgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlRGF0ZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0IENvbXBlbnNhdGlvbkRldGFpbHMgU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlRGF0ZSkpKTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIHRvZ2dsZUNoZWNrZWQoaXRlbXM6IENvbXBlbnNhdGlvbk9yZGVySUQuRmxpZ2h0U2VnbWVudCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhhcmdzKTtcbiAgICAgICAgLy8gdmFyIHNlZ21lbnQgOiBDb21wZW5zYXRpb25PcmRlcklELkZsaWdodFNlZ21lbnQ7XG4gICAgICAgIGlmIChpdGVtcy5Jc1NlZ1NlbGVjdGVkID09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLlNlZ2VtZW50SW5mby5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRTZWdtZW50ID0gW107XG4gICAgICAgICAgICAgICAgZGF0YS5Jc1NlZ1NlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaWYgKGl0ZW1zLkZsaWdodE5vLnN1YnN0cigwLCAyKSA9PSBcIkNNXCIpIHtcbiAgICAgICAgICAgICAgICBpdGVtcy5Jc1NlZ1NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzQ29udGludWVFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLlNlbGVjdGVkU2VnbWVudC5wdXNoKGl0ZW1zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXRlbXMuSXNTZWdTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0NvbnRpbnVlRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRTZWdtZW50ID0gW107XG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJOb3QgZWxpZ2libGUgZm9yIGNvbXBlbnNhdGlvblwiKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtcy5Jc1NlZ1NlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmlzQ29udGludWVFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdGVkU2VnbWVudCA9IFtdO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBuYXZpZ2F0ZXRvQ29tcGVuc2F0aW9uU2VsZWN0UGF4KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiY29tcGVuc2F0aW9uc2VsZWN0cGF4XCJdLCB7XG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbmF2aWdhdGV0b0NvbXBlbnNhdGlvblBheFdpdGhTZWcoKSB7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJjb21wZW5zYXRpb25wYXh3aXRoc2VnXCJdLCB7XG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbmF2aWdhdGVUb0NvbXBlbnNhdGlvbigpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImNvbXBlbnNhdGlvblwiXSwge1xuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgbmF2aWdhdGV0b0NvbXBlbnNhdGlvblNlYXJjaFJlc3VsdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImNvbXBlbnNhdGlvbnJlc3VsdFwiXSwge1xuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9XG4gICAgbmF2aWdhdGVUb1NldHRpbmcoKSB7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZXR0aW5nXCJdLCB7XG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbmF2aWdhdGVUb1NlYXJjaCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNDaGVja2luRGlzYWJsZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcInNlYXJjaFwiXSwge1xuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIG5hdmlnYXRlVG9EZXBhcnR1cmVzKCkge1xuICAgICAgICBpZiAodGhpcy5pc0dhdGVEaXNhYmxlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiZGVwYXJ0aG9tZVwiXSwge1xuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlU2VydmljZUVycm9yKGVycm9yOiBhbnkpIHtcbiAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IGVycm9yLnRvU3RyaW5nKCk7XG4gICAgICAgIGlmIChlcnJvck1lc3NhZ2UuaW5kZXhPZihcIlNlc3Npb25UaW1lb3V0XCIpID4gLTEpIHtcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBcIlNlc3Npb24gVGltZSBPdXRcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIllvdXIgc2Vzc2lvbiBoYXMgYmVlbiB0aW1lIG91dFwiLFxuICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPS1wiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGlhbG9ncy5hbGVydChvcHRpb25zKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiXCJdLCB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGVycm9yTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==