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
var app_constants_1 = require("../../app.constants");
var app_executiontime_1 = require("../../app.executiontime");
var timeOut_service_1 = require("../../shared/services/timeOut.service");
var CompensationFQTVList = /** @class */ (function () {
    function CompensationFQTVList(_configuration, _services, activatedRouter, _shared, page, routerExtensions, _timeoutService, router, _dataService, _service, route, vcRef, _modalService) {
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
        this.SelectedPassenger = [];
        this.CompensationPassengerList = [];
        this.CompensationFullPaxList = [];
        this.CompensationModel = new index_1.CompensationSearchModule.CompensationRootObject;
        this.CompensationReasonList = [];
        this.SegementInfo = [];
        this.CompensationOrderDetails = [];
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.CompensationOrderList = new index_1.CompensationOrderID.RootObject();
        this.isError = false;
        this.errorMessage = "";
        this.SearchFields.FlightDate = moment().format("DD MMMM YYYY");
        this.CurDate = moment().toDate();
        this.startDate = new Date();
        this.loaderProgress = new index_1.LoaderProgress();
    }
    CompensationFQTVList.prototype.ngOnInit = function () {
        var _this = this;
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        // this.ComensationReason = "Select Reason";
        this.loaderProgress.initLoader(this.pageCont);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.activatedRouter.queryParams.subscribe(function (params) {
            if (params["data"] != null && params["data"] != "" && params["data"] != "undefined") {
                _this.FQTVNum = params["data"];
            }
        });
        this.CompensationOrderDetails = this._shared.getCompensationFQTVStatusDetails();
        this.CompensationOrderDetails[0].Destination;
    };
    CompensationFQTVList.prototype.continue = function () {
        this.getPassengerOrderDetails(this.OrderId);
    };
    CompensationFQTVList.prototype.toggleChecked = function (item) {
        this.CompensationOrderDetails.forEach(function (data, Index) {
            data.IsSelected = false;
        });
        item.IsSelected = true;
        this.FlightNumber = item.FlightNumber;
        this.FLightDate = item.FlightDate;
        this.OrderId = item.OrderID;
    };
    //  getPassengerOrderDetails(orderID: string): void {
    //     try {
    //         this.loaderProgress.showLoader();
    //         var sDate = new Date();
    //         console.log('Get GetPassengerOrderDetails Service --------------- Start Date Time : ' + sDate);
    //         this._service.getPassengerByOrder(orderID)
    //             .subscribe(data => {
    //                 if (data.FlightSegments) {
    //                     this.CompensationOrderList = data;
    //                     // this.flightStatus();
    //                     var eDate = new Date();
    //                     console.log('Get GetPassengerOrderDetails Service --------------- End Date Time : ' + eDate);
    //                     console.log('Get GetPassengerOrderDetails Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
    //                 } else {
    //                     Toast.makeText("No Reservation found").show();
    //                     this.loaderProgress.hideLoader();
    //                 }
    //             },
    //             err => {
    //                 this.loaderProgress.hideLoader();
    //             });
    //     } catch (error) {
    //         console.log(error.message);
    //         this.loaderProgress.hideLoader();
    //     }
    // }
    CompensationFQTVList.prototype.getPassengerOrderDetails = function (orderID) {
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
                        Toast.makeText("DATA NOT FOUND").show();
                        // this.clear();
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
    CompensationFQTVList.prototype.navigatetoCompensationSelectSegment = function () {
        this.routerExtensions.navigate(["compensationselectsegment"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }, queryParams: {
                "data": this.OrderId
            }
        });
    };
    CompensationFQTVList.prototype.navigatetoCompensationSearchResult = function () {
        this.routerExtensions.navigate(["compensationresult"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationFQTVList.prototype.navigateToCompensation = function () {
        this.routerExtensions.navigate(["compensation"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationFQTVList.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    CompensationFQTVList.prototype.navigateToSearch = function () {
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
    CompensationFQTVList.prototype.navigateToDepartures = function () {
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
    CompensationFQTVList.prototype.handleServiceError = function (error) {
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
    __decorate([
        core_1.ViewChild('pagecontainer'),
        __metadata("design:type", core_1.ElementRef)
    ], CompensationFQTVList.prototype, "pageCont", void 0);
    CompensationFQTVList = __decorate([
        core_1.Component({
            selector: "compensation-fqtvlist-page",
            providers: [index_2.DataService, index_2.PassengerService, app_constants_1.Configuration, index_2.CompensationService],
            templateUrl: "./components/compensation-fqtvlist/compensation-fqtvlist.component.html",
            styleUrls: ["./components/compensation-fqtvlist/compensation-fqtvlist.component.css"]
        }),
        __metadata("design:paramtypes", [app_constants_1.Configuration, index_2.PassengerService, router_1.ActivatedRoute, index_2.CheckinOrderService, page_1.Page, router_2.RouterExtensions, timeOut_service_1.TimeOutService, router_1.Router, index_2.DataService, index_2.CompensationService, router_1.ActivatedRoute, core_1.ViewContainerRef, modal_dialog_1.ModalDialogService])
    ], CompensationFQTVList);
    return CompensationFQTVList;
}());
exports.CompensationFQTVList = CompensationFQTVList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGVuc2F0aW9uLWZxdHZsaXN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbXBlbnNhdGlvbi1mcXR2bGlzdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsc0NBQTJGO0FBQzNGLDBDQUEyRTtBQUUzRSxzREFBK0Q7QUFDL0Qsa0VBQTJGO0FBQzNGLGdDQUErQjtBQUMvQixvQ0FBdUM7QUFPdkMsOEJBQThCO0FBQzlCLDBEQUE0RDtBQUM1RCwrQkFBaUM7QUFDakMsMENBQTRDO0FBRTVDLGdCQUFnQjtBQUNoQixzREFBc0w7QUFDdEwscURBQXNIO0FBQ3RILGtEQUFtSjtBQUduSixxREFBb0Q7QUFDcEQsNkRBQTJEO0FBRzNELHlFQUF1RTtBQVV2RTtJQTJCSSw4QkFBb0IsY0FBNkIsRUFBVSxTQUEyQixFQUFTLGVBQStCLEVBQVMsT0FBNEIsRUFBVSxJQUFVLEVBQVUsZ0JBQWtDLEVBQVMsZUFBK0IsRUFBVSxNQUFjLEVBQVMsWUFBeUIsRUFBUyxRQUE2QixFQUFVLEtBQXFCLEVBQVUsS0FBdUIsRUFBVSxhQUFpQztRQUFsYyxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQVMsb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUFTLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBYTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQXFCO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFvQjtRQXJCL2MsaUJBQVksR0FBVyxJ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QUFRLEVBQUUsR0FBRzt3QkFDYixLQUFLLEVBQUUsUUFBUTtxQkFDbEI7aUJBQ0osQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7WUFDSCxvQ0FBb0M7U0FDdkM7YUFDSTtZQUNELEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDdkM7SUFDTCxDQUFDO0lBM04yQjtRQUEzQixnQkFBUyxDQUFDLGVBQWUsQ0FBQztrQ0FBVyxpQkFBVTswREFBQztJQUR4QyxvQkFBb0I7UUFSaEMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSw0QkFBNEI7WUFDdEMsU0FBUyxFQUFFLENBQUMsbUJBQVcsRUFBRSx3QkFBZ0IsRUFBRSw2QkFBYSxFQUFFLDJCQUFtQixDQUFDO1lBQzlFLFdBQVcsRUFBRSx5RUFBeUU7WUFDdEYsU0FBUyxFQUFFLENBQUMsd0VBQXdFLENBQUM7U0FFeEYsQ0FBQzt5Q0E2QnNDLDZCQUFhLEVBQXFCLHdCQUFnQixFQUEwQix1QkFBYyxFQUFrQiwyQkFBbUIsRUFBZ0IsV0FBSSxFQUE0Qix5QkFBZ0IsRUFBMEIsZ0NBQWMsRUFBa0IsZUFBTSxFQUF1QixtQkFBVyxFQUFtQiwyQkFBbUIsRUFBaUIsdUJBQWMsRUFBaUIsdUJBQWdCLEVBQXlCLGlDQUFrQjtPQTNCN2Msb0JBQW9CLENBNk5oQztJQUFELDJCQUFDO0NBQUEsQUE3TkQsSUE2TkM7QUE3Tlksb0RBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiLy9hbmd1bGFyICYgbmF0aXZlc2NyaXB0IHJlZmVyZW5jZXNcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uRXh0cmFzLCBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IFJvdXRlckV4dGVuc2lvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBNb2RhbERpYWxvZ1NlcnZpY2UsIE1vZGFsRGlhbG9nT3B0aW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9tb2RhbC1kaWFsb2dcIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IGRpYWxvZ3MgPSByZXF1aXJlKFwidWkvZGlhbG9nc1wiKTtcbmltcG9ydCB7IFNjcm9sbFZpZXcgfSBmcm9tIFwidWkvc2Nyb2xsLXZpZXdcIjtcbmltcG9ydCB7IExpc3RWaWV3IH0gZnJvbSBcInVpL2xpc3Qtdmlld1wiO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gXCJ1aS9jb3JlL3ZpZXdcIjtcbmltcG9ydCB0ZXh0RmllbGQgPSByZXF1aXJlKFwidWkvdGV4dC1maWVsZFwiKTtcbmltcG9ydCAqIGFzIGdlc3R1cmVzIGZyb20gXCJ1aS9nZXN0dXJlc1wiO1xuXG4vL2V4dGVybmFsIG1vZHVsZXMgYW5kIHBsdWdpbnNcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcblxuLy9hcHAgcmVmZXJlbmNlc1xuaW1wb3J0IHsgTG9hZGVyUHJvZ3Jlc3MsIFBhc3Nlbmdlckxpc3RUZW1wbGF0ZSwgUGFzc2VuZ2VyTGlzdCwgQWNjb250UHJvZmlsZU1vZGVsLCBDb21wZW5zYXRpb25PcmRlcklELCBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUgLE9yZGVyRlFUVlN0YXR1c30gZnJvbSBcIi4uLy4uL3NoYXJlZC9pbnRlcmZhY2UvaW5kZXhcIlxuaW1wb3J0IHsgRGF0YVNlcnZpY2UsIENoZWNraW5PcmRlclNlcnZpY2UsIFBhc3NlbmdlclNlcnZpY2UsIENvbXBlbnNhdGlvblNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL2luZGV4XCI7XG5pbXBvcnQgeyBPcmRlciwgQ291bnRyeUNvbGxlY3Rpb24sIEZsaWdodFNlcnZpY2VJbmZvLCBGbGlnaHQsIFNlYXJjaCwgQWNjb3VudFByb2ZpbGUsIEFQSVNEb2N1bWVudCwgQ29tcGFuc2F0aW9uIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9tb2RlbC9pbmRleFwiO1xuaW1wb3J0IHsgQ29udmVydGVycyB9IGZyb20gXCIuLi8uLi9zaGFyZWQvdXRpbHMvaW5kZXhcIjtcbmltcG9ydCB7IERhdGVQaWNrZXJNb2RhbCwgRGF0ZVBpY2tldENvbnRleHQgfSBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9kYXRlLXBpY2tlci9kYXRlLXBpY2tlci1tb2RhbFwiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uLy4uL2FwcC5jb25zdGFudHMnO1xuaW1wb3J0IHsgQXBwRXhlY3V0aW9udGltZSB9IGZyb20gXCIuLi8uLi9hcHAuZXhlY3V0aW9udGltZVwiO1xuaW1wb3J0IHsgaXNBbmRyb2lkLCBpc0lPUywgZGV2aWNlLCBzY3JlZW4gfSBmcm9tIFwicGxhdGZvcm1cIjtcbmltcG9ydCB7IEZRVFYgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL21vZGVsL2luZGV4XCJcbmltcG9ydCB7IFRpbWVPdXRTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy90aW1lT3V0LnNlcnZpY2VcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwiY29tcGVuc2F0aW9uLWZxdHZsaXN0LXBhZ2VcIixcbiAgICBwcm92aWRlcnM6IFtEYXRhU2VydmljZSwgUGFzc2VuZ2VyU2VydmljZSwgQ29uZmlndXJhdGlvbiwgQ29tcGVuc2F0aW9uU2VydmljZV0sXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9jb21wb25lbnRzL2NvbXBlbnNhdGlvbi1mcXR2bGlzdC9jb21wZW5zYXRpb24tZnF0dmxpc3QuY29tcG9uZW50Lmh0bWxcIixcbiAgICBzdHlsZVVybHM6IFtcIi4vY29tcG9uZW50cy9jb21wZW5zYXRpb24tZnF0dmxpc3QvY29tcGVuc2F0aW9uLWZxdHZsaXN0LmNvbXBvbmVudC5jc3NcIl1cblxufSlcblxuZXhwb3J0IGNsYXNzIENvbXBlbnNhdGlvbkZRVFZMaXN0IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBAVmlld0NoaWxkKCdwYWdlY29udGFpbmVyJykgcGFnZUNvbnQ6IEVsZW1lbnRSZWY7XG4gICAgcHVibGljIGlzRXJyb3I6IGJvb2xlYW47XG4gICAgcHVibGljIGVycm9yTWVzc2FnZTogc3RyaW5nO1xuICAgIHB1YmxpYyBsb2FkZXJQcm9ncmVzczogTG9hZGVyUHJvZ3Jlc3M7XG4gICAgcHVibGljIHN0YXJ0RGF0ZTogRGF0ZTtcbiAgICBwdWJsaWMgU2VhcmNoRmllbGRzOiBTZWFyY2ggPSBuZXcgU2VhcmNoKCk7XG4gICAgcHVibGljIEN1ckRhdGU6IERhdGU7XG4gICAgcHVibGljIHVzZXJkZXRhaWxzOiBhbnk7XG4gICAgcHVibGljIENvbWVuc2F0aW9uUmVhc29uOiBhbnk7XG4gICAgcHVibGljIE9yZGVySWQ6IGFueTtcbiAgICBwdWJsaWMgY2hlY2tlZENvdW50OiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyBGbGlnaHREZXRhaWxzOiBhbnk7XG4gICAgcHVibGljIEZRVFZOdW06IGFueTtcbiAgICBwdWJsaWMgRmxpZ2h0TnVtYmVyIDogYW55O1xuICAgIHB1YmxpYyBGTGlnaHREYXRlIDogYW55O1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25MaXN0OiBDb21wYW5zYXRpb247XG4gICAgcHVibGljIFNlbGVjdGVkUGFzc2VuZ2VyOiBBcnJheTxDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdD4gPSBbXTtcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdDogQXJyYXk8YW55PiA9IFtdO1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25GdWxsUGF4TGlzdDogQXJyYXk8Q29tcGVuc2F0aW9uU2VhcmNoTW9kdWxlLkNvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3Q+ID0gW107XG4gICAgcHVibGljIENvbXBlbnNhdGlvbk1vZGVsOiBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUm9vdE9iamVjdCA9IG5ldyBDb21wZW5zYXRpb25TZWFyY2hNb2R1bGUuQ29tcGVuc2F0aW9uUm9vdE9iamVjdDtcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uUmVhc29uTGlzdDogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgIHB1YmxpYyBTZWdlbWVudEluZm86IEFycmF5PENvbXBlbnNhdGlvbk9yZGVySUQuRmxpZ2h0U2VnbWVudD4gPSBbXTtcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uT3JkZXJEZXRhaWxzOiBBcnJheTxPcmRlckZRVFZTdGF0dXM+PVtdO1xuICAgIHB1YmxpYyBpc0NoZWNraW5EaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBpc0dhdGVEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25PcmRlckxpc3QgOiBDb21wZW5zYXRpb25PcmRlcklELlJvb3RPYmplY3QgPSBuZXcgQ29tcGVuc2F0aW9uT3JkZXJJRC5Sb290T2JqZWN0KCk7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbiwgcHJpdmF0ZSBfc2VydmljZXMgOlBhc3NlbmdlclNlcnZpY2UscHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZXI6IEFjdGl2YXRlZFJvdXRlLHByaXZhdGUgX3NoYXJlZDogQ2hlY2tpbk9yZGVyU2VydmljZSwgcHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMsIHB1YmxpYyBfdGltZW91dFNlcnZpY2U6IFRpbWVPdXRTZXJ2aWNlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwdWJsaWMgX2RhdGFTZXJ2aWNlOiBEYXRhU2VydmljZSwgcHVibGljIF9zZXJ2aWNlOiBDb21wZW5zYXRpb25TZXJ2aWNlLCBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSB2Y1JlZjogVmlld0NvbnRhaW5lclJlZiwgcHJpdmF0ZSBfbW9kYWxTZXJ2aWNlOiBNb2RhbERpYWxvZ1NlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5pc0Vycm9yID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gXCJcIjtcbiAgICAgICAgdGhpcy5TZWFyY2hGaWVsZHMuRmxpZ2h0RGF0ZSA9IG1vbWVudCgpLmZvcm1hdChcIkREIE1NTU0gWVlZWVwiKTtcbiAgICAgICAgdGhpcy5DdXJEYXRlID0gbW9tZW50KCkudG9EYXRlKCk7XG4gICAgICAgIHRoaXMuc3RhcnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcyA9IG5ldyBMb2FkZXJQcm9ncmVzcygpO1xuICAgIH1cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCd+L2ltYWdlcy9sb2dpbl9iYWNrLmpwZWcnKVwiO1xuICAgICAgICB0aGlzLnBhZ2Uuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBcImNvdmVyIFwiO1xuICAgICAgICAvLyB0aGlzLkNvbWVuc2F0aW9uUmVhc29uID0gXCJTZWxlY3QgUmVhc29uXCI7XG4gICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaW5pdExvYWRlcih0aGlzLnBhZ2VDb250KTtcbiAgICAgICAgdGhpcy51c2VyZGV0YWlscyA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwidXNlcmRldGFpbHNcIiwgXCJcIik7XG4gICAgICAgIHRoaXMuaXNDaGVja2luRGlzYWJsZWQgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJjaGVja2luRGlzYWJsZWRcIiwgKTtcbiAgICAgICAgdGhpcy5pc0dhdGVEaXNhYmxlZCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImdhdGVEaXNhYmxlZFwiLCApO1xuICAgICAgICB0aGlzLmFjdGl2YXRlZFJvdXRlci5xdWVyeVBhcmFtcy5zdWJzY3JpYmUoKHBhcmFtcykgPT4ge1xuICAgICAgICAgICAgaWYgKHBhcmFtc1tcImRhdGFcIl0gIT0gbnVsbCAmJiBwYXJhbXNbXCJkYXRhXCJdICE9IFwiXCIgJiYgcGFyYW1zW1wiZGF0YVwiXSAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5GUVRWTnVtID0gcGFyYW1zW1wiZGF0YVwiXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uT3JkZXJEZXRhaWxzID0gdGhpcy5fc2hhcmVkLmdldENvbXBlbnNhdGlvbkZRVFZTdGF0dXNEZXRhaWxzKCk7XG4gICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uT3JkZXJEZXRhaWxzWzBdLkRlc3RpbmF0aW9uO1xuICAgIH1cbiAgICBjb250aW51ZSgpe1xuICAgICAgICB0aGlzLmdldFBhc3Nlbmdlck9yZGVyRGV0YWlscyh0aGlzLk9yZGVySWQpO1xuICAgIH1cbiAgICB0b2dnbGVDaGVja2VkKGl0ZW06IE9yZGVyRlFUVlN0YXR1cykge1xuICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbk9yZGVyRGV0YWlscy5mb3JFYWNoKChkYXRhLCBJbmRleCkgPT4ge1xuICAgICAgICAgICAgZGF0YS5Jc1NlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH0pXG4gICAgICAgIGl0ZW0uSXNTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuRmxpZ2h0TnVtYmVyID0gaXRlbS5GbGlnaHROdW1iZXI7XG4gICAgICAgIHRoaXMuRkxpZ2h0RGF0ZSA9IGl0ZW0uRmxpZ2h0RGF0ZTtcbiAgICAgICAgdGhpcy5PcmRlcklkID0gaXRlbS5PcmRlcklEO1xuICAgIH1cbiAgICAvLyAgZ2V0UGFzc2VuZ2VyT3JkZXJEZXRhaWxzKG9yZGVySUQ6IHN0cmluZyk6IHZvaWQge1xuICAgIC8vICAgICB0cnkge1xuICAgIC8vICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XG4gICAgLy8gICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJPcmRlckRldGFpbHMgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gU3RhcnQgRGF0ZSBUaW1lIDogJyArIHNEYXRlKTtcbiAgICAvLyAgICAgICAgIHRoaXMuX3NlcnZpY2UuZ2V0UGFzc2VuZ2VyQnlPcmRlcihvcmRlcklEKVxuICAgIC8vICAgICAgICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgICAgIGlmIChkYXRhLkZsaWdodFNlZ21lbnRzKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbk9yZGVyTGlzdCA9IGRhdGE7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmZsaWdodFN0YXR1cygpO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdmFyIGVEYXRlID0gbmV3IERhdGUoKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgR2V0UGFzc2VuZ2VyT3JkZXJEZXRhaWxzIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldCBHZXRQYXNzZW5nZXJPcmRlckRldGFpbHMgU2VydmljZSBFeGVjdXRpb24gVGltZSA6ICcgKyBBcHBFeGVjdXRpb250aW1lLkV4ZWN1dGlvblRpbWUobmV3IERhdGUoc0RhdGUpLCBuZXcgRGF0ZShlRGF0ZSkpKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiTm8gUmVzZXJ2YXRpb24gZm91bmRcIikuc2hvdygpO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgLy8gICAgICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgICAgICB9LFxuICAgIC8vICAgICAgICAgICAgIGVyciA9PiB7XG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgIC8vICAgICAgICAgICAgIH0pO1xuICAgIC8vICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgLy8gICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAvLyAgICAgfVxuXG4gICAgLy8gfVxuICAgIGdldFBhc3Nlbmdlck9yZGVyRGV0YWlscyhvcmRlcklEOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgR2V0UGFzc2VuZ2VyT3JkZXJEZXRhaWxzIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIFN0YXJ0IERhdGUgVGltZSA6ICcgKyBzRGF0ZSk7XG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlLmdldFBhc3NlbmdlckJ5T3JkZXIob3JkZXJJRClcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5CYWRSZXF1ZXN0ID09IDQwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIxIGJhZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGRhdGEuRXJyb3JNZXNzYWdlKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5GbGlnaHRTZWdtZW50cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBDb21wYW5zYXRpb25EZXRhaWxzOiBhbnkgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGlyKENvbXBhbnNhdGlvbkRldGFpbHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxldCBDb21wZW5zYXRpb25QYXNzZW5nZXJzOiBhbnkgPSBDb252ZXJ0ZXJzLkNvbnZlcnRUb0NvbXBQYXhUZW1wbGF0ZUJ5T3JkZXJJZChDb21wYW5zYXRpb25EZXRhaWxzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRpcihDb21wZW5zYXRpb25QYXNzZW5nZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWQuc2V0Q29tcGVuc2F0aW9uT3JkZXJEZWF0aWxzKENvbXBhbnNhdGlvbkRldGFpbHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGV0b0NvbXBlbnNhdGlvblNlbGVjdFNlZ21lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgR2V0UGFzc2VuZ2VyT3JkZXJEZXRhaWxzIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXQgR2V0UGFzc2VuZ2VyT3JkZXJEZXRhaWxzIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiREFUQSBOT1QgRk9VTkRcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZG50IGZpbmQgaW5mb3JtYXRpb25cIiArIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VydmljZUVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgXG4gICAgbmF2aWdhdGV0b0NvbXBlbnNhdGlvblNlbGVjdFNlZ21lbnQoKSB7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJjb21wZW5zYXRpb25zZWxlY3RzZWdtZW50XCJdLCB7XG4gICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgfSxxdWVyeVBhcmFtczoge1xuICAgICAgICAgICAgICAgIFwiZGF0YVwiOiB0aGlzLk9yZGVySWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG5hdmlnYXRldG9Db21wZW5zYXRpb25TZWFyY2hSZXN1bHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJjb21wZW5zYXRpb25yZXN1bHRcIl0sIHtcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBuYXZpZ2F0ZVRvQ29tcGVuc2F0aW9uKCl7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJjb21wZW5zYXRpb25cIl0sIHtcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIG5hdmlnYXRlVG9TZXR0aW5nKCkge1xuICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wic2V0dGluZ1wiXSwge1xuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG5hdmlnYXRlVG9TZWFyY2goKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQ2hlY2tpbkRpc2FibGVkID09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJzZWFyY2hcIl0sIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbm5hdmlnYXRlVG9EZXBhcnR1cmVzKCkge1xuICAgICAgICBpZiAodGhpcy5pc0dhdGVEaXNhYmxlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiZGVwYXJ0aG9tZVwiXSwge1xuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhhbmRsZVNlcnZpY2VFcnJvcihlcnJvcjogYW55KSB7XG4gICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci50b1N0cmluZygpO1xuICAgICAgICBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJTZXNzaW9uVGltZW91dFwiKSA+IC0xKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJTZXNzaW9uIFRpbWUgT3V0XCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGJlZW4gdGltZSBvdXRcIixcbiAgICAgICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIlwiXSwge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChlcnJvck1lc3NhZ2UpLnNob3coKTtcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=