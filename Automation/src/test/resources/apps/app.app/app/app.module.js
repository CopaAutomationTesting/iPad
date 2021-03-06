"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var forms_1 = require("nativescript-angular/forms");
var http_1 = require("nativescript-angular/http");
var router_1 = require("nativescript-angular/router");
var app_routing_1 = require("./components/app.routing");
var index_1 = require("./shared/services/index");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var date_picker_modal_1 = require("./components/date-picker/date-picker-modal");
var country_modal_1 = require("./components/country/country-modal");
var fqtv_modal_1 = require("./components/fqtv-modal/fqtv-modal");
var deviceList_modal_1 = require("./components/deviceList/deviceList-modal");
var payment_modal_1 = require("./components/payment/payment-modal");
var ADCResponse_modal_1 = require("./components/ADCResponse/ADCResponse-modal");
var DrsPage_modal_1 = require("./components/DrsPage/DrsPage-modal");
var app_component_1 = require("./app.component");
var timeOut_service_1 = require("./shared/services/timeOut.service");
var login_service_1 = require("./shared/services/login.service");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [app_component_1.AppComponent].concat(app_routing_1.AppComponents, [date_picker_modal_1.DatePickerModal, country_modal_1.CreatingListPickerComponent, fqtv_modal_1.CreatingListPickComponent, payment_modal_1.PaymentComponent, deviceList_modal_1.DeviceListPickComponent, ADCResponse_modal_1.ADCResponseComponent, DrsPage_modal_1.DRSComponent]),
            bootstrap: [app_component_1.AppComponent],
            imports: [nativescript_module_1.NativeScriptModule,
                forms_1.NativeScriptFormsModule,
                http_1.NativeScriptHttpModule,
                router_1.NativeScriptRouterModule,
                router_1.NativeScriptRouterModule.forRoot(app_routing_1.AppRoutes)],
            schemas: [core_1.NO_ERRORS_SCHEMA],
            providers: [modal_dialog_1.ModalDialogService, index_1.CheckinOrderService, timeOut_service_1.TimeOutService, login_service_1.LoginService],
            entryComponents: [date_picker_modal_1.DatePickerModal, country_modal_1.CreatingListPickerComponent, fqtv_modal_1.CreatingListPickComponent, payment_modal_1.PaymentComponent, deviceList_modal_1.DeviceListPickComponent, ADCResponse_modal_1.ADCResponseComponent, DrsPage_modal_1.DRSComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkQ7QUFDM0QsZ0ZBQThFO0FBQzlFLG9EQUFtRTtBQUNuRSxrREFBbUU7QUFDbkUsc0RBQXFFO0FBQ3JFLHdEQUFvRTtBQUNwRSxpREFBNEU7QUFDNUUsa0VBQXVFO0FBQ3ZFLGdGQUFnRztBQUNoRyxvRUFBaUY7QUFDakYsaUVBQStFO0FBQy9FLDZFQUFtRjtBQUNuRixvRUFBc0U7QUFDdEUsZ0ZBQWtGO0FBQ2xGLG9FQUFrRTtBQUNsRSxpREFBK0M7QUFFL0MscUVBQW1FO0FBQ25FLGlFQUE4RDtBQWM5RDtJQUFBO0lBQXlCLENBQUM7SUFBYixTQUFTO1FBWnJCLGVBQVEsQ0FBQztZQUNOLFlBQVksR0FBRyw0QkFBWSxTQUFLLDJCQUFhLEdBQUMsbUNBQWUsRUFBQywyQ0FBMkIsRUFBQyxzQ0FBeUIsRUFBQyxnQ0FBZ0IsRUFBQywwQ0FBdUIsRUFBQyx3Q0FBb0IsRUFBQyw0QkFBWSxFQUFDO1lBQy9MLFNBQVMsRUFBRSxDQUFDLDRCQUFZLENBQUM7WUFDekIsT0FBTyxFQUFFLENBQUMsd0NBQWtCO2dCQUN4QiwrQkFBdUI7Z0JBQ3ZCLDZCQUFzQjtnQkFDdEIsaUNBQXdCO2dCQUN4QixpQ0FBd0IsQ0FBQyxPQUFPLENBQUMsdUJBQVMsQ0FBQyxDQUFDO1lBQ2hELE9BQU8sRUFBRSxDQUFDLHVCQUFnQixDQUFDO1lBQzFCLFNBQVMsRUFBQyxDQUFDLGlDQUFrQixFQUFDLDJCQUFtQixFQUFDLGdDQUFjLEVBQUMsNEJBQVksQ0FBQztZQUMvRSxlQUFlLEVBQUMsQ0FBQyxtQ0FBZSxFQUFDLDJDQUEyQixFQUFDLHNDQUF5QixFQUFDLGdDQUFnQixFQUFDLDBDQUF1QixFQUFDLHdDQUFvQixFQUFDLDRCQUFZLENBQUM7U0FDckssQ0FBQztPQUNXLFNBQVMsQ0FBSTtJQUFELGdCQUFDO0NBQUEsQUFBMUIsSUFBMEI7QUFBYiw4QkFBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBOT19FUlJPUlNfU0NIRU1BIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgTmF0aXZlU2NyaXB0TW9kdWxlIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL25hdGl2ZXNjcmlwdC5tb2R1bGVcIjtcclxuaW1wb3J0IHtOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZX0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2Zvcm1zXCI7XHJcbmltcG9ydCB7IE5hdGl2ZVNjcmlwdEh0dHBNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvaHR0cFwiO1xyXG5pbXBvcnQge05hdGl2ZVNjcmlwdFJvdXRlck1vZHVsZX0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQgeyBBcHBSb3V0ZXMsIEFwcENvbXBvbmVudHMgfSBmcm9tIFwiLi9jb21wb25lbnRzL2FwcC5yb3V0aW5nXCI7XHJcbmltcG9ydCB7IERhdGFTZXJ2aWNlLCBDaGVja2luT3JkZXJTZXJ2aWNlLCB9IGZyb20gXCIuL3NoYXJlZC9zZXJ2aWNlcy9pbmRleFwiO1xyXG5pbXBvcnQgeyBNb2RhbERpYWxvZ1NlcnZpY2UgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nXCI7XHJcbmltcG9ydCB7IERhdGVQaWNrZXJNb2RhbCwgRGF0ZVBpY2tldENvbnRleHQgfSBmcm9tIFwiLi9jb21wb25lbnRzL2RhdGUtcGlja2VyL2RhdGUtcGlja2VyLW1vZGFsXCI7XHJcbmltcG9ydCB7IENyZWF0aW5nTGlzdFBpY2tlckNvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvY291bnRyeS9jb3VudHJ5LW1vZGFsXCI7XHJcbmltcG9ydCB7IENyZWF0aW5nTGlzdFBpY2tDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL2ZxdHYtbW9kYWwvZnF0di1tb2RhbFwiO1xyXG5pbXBvcnQgeyBEZXZpY2VMaXN0UGlja0NvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvZGV2aWNlTGlzdC9kZXZpY2VMaXN0LW1vZGFsXCI7XHJcbmltcG9ydCB7IFBheW1lbnRDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL3BheW1lbnQvcGF5bWVudC1tb2RhbFwiO1xyXG5pbXBvcnQgeyBBRENSZXNwb25zZUNvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvQURDUmVzcG9uc2UvQURDUmVzcG9uc2UtbW9kYWxcIjtcclxuaW1wb3J0IHsgRFJTQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9EcnNQYWdlL0Ryc1BhZ2UtbW9kYWxcIjtcclxuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSBcIi4vYXBwLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyByZWdpc3RlckVsZW1lbnQgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeVwiO1xyXG5pbXBvcnQgeyBUaW1lT3V0U2VydmljZSB9IGZyb20gXCIuL3NoYXJlZC9zZXJ2aWNlcy90aW1lT3V0LnNlcnZpY2VcIjtcclxuaW1wb3J0IHtMb2dpblNlcnZpY2UgfSBmcm9tIFwiLi9zaGFyZWQvc2VydmljZXMvbG9naW4uc2VydmljZVwiO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICAgIGRlY2xhcmF0aW9uczogW0FwcENvbXBvbmVudCwgLi4uQXBwQ29tcG9uZW50cyxEYXRlUGlja2VyTW9kYWwsQ3JlYXRpbmdMaXN0UGlja2VyQ29tcG9uZW50LENyZWF0aW5nTGlzdFBpY2tDb21wb25lbnQsUGF5bWVudENvbXBvbmVudCxEZXZpY2VMaXN0UGlja0NvbXBvbmVudCxBRENSZXNwb25zZUNvbXBvbmVudCxEUlNDb21wb25lbnRdLFxyXG4gICAgYm9vdHN0cmFwOiBbQXBwQ29tcG9uZW50XSxcclxuICAgIGltcG9ydHM6IFtOYXRpdmVTY3JpcHRNb2R1bGUsXHJcbiAgICAgICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXHJcbiAgICAgICAgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZSxcclxuICAgICAgICBOYXRpdmVTY3JpcHRSb3V0ZXJNb2R1bGUsXHJcbiAgICAgICAgTmF0aXZlU2NyaXB0Um91dGVyTW9kdWxlLmZvclJvb3QoQXBwUm91dGVzKV0sXHJcbiAgICBzY2hlbWFzOiBbTk9fRVJST1JTX1NDSEVNQV0sXHJcbiAgICAgcHJvdmlkZXJzOltNb2RhbERpYWxvZ1NlcnZpY2UsQ2hlY2tpbk9yZGVyU2VydmljZSxUaW1lT3V0U2VydmljZSxMb2dpblNlcnZpY2VdLFxyXG4gICAgZW50cnlDb21wb25lbnRzOltEYXRlUGlja2VyTW9kYWwsQ3JlYXRpbmdMaXN0UGlja2VyQ29tcG9uZW50LENyZWF0aW5nTGlzdFBpY2tDb21wb25lbnQsUGF5bWVudENvbXBvbmVudCxEZXZpY2VMaXN0UGlja0NvbXBvbmVudCxBRENSZXNwb25zZUNvbXBvbmVudCxEUlNDb21wb25lbnRdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBcHBNb2R1bGUgeyB9XHJcbiJdfQ==