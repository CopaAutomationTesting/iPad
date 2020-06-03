"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var DeviceListPickComponent = /** @class */ (function () {
    function DeviceListPickComponent(params) {
        this.params = params;
        this.DeviceList = params.context;
        this.newDeviceList = this.DeviceList;
        console.dir(this.DeviceList);
        console.log(JSON.stringify(this.DeviceList.workstation));
    }
    DeviceListPickComponent.prototype.SelectPrinter = function (picker) {
        var deviceName = picker.DeviceName;
        console.log(deviceName);
        if (deviceName != "") {
            this.SelectedDevice = picker;
            console.log(this.SelectedDevice);
        }
        this.params.closeCallback(this.SelectedDevice);
    };
    DeviceListPickComponent.prototype.cancel = function () {
        this.params.closeCallback();
    };
    DeviceListPickComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: "./deviceList-modal.html"
        }),
        __metadata("design:paramtypes", [modal_dialog_1.ModalDialogParams])
    ], DeviceListPickComponent);
    return DeviceListPickComponent;
}());
exports.DeviceListPickComponent = DeviceListPickComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2aWNlTGlzdC1tb2RhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRldmljZUxpc3QtbW9kYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsc0NBQTBDO0FBQzFDLGtFQUFzRTtBQVV0RTtJQUtJLGlDQUFvQixNQUF5QjtRQUF6QixXQUFNLEdBQU4sTUFBTSxDQUFtQjtRQUN6QyxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDakMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVHLCtDQUFhLEdBQXBCLFVBQXFCLE1BQVc7UUFFekIsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hCLElBQUksVUFBVSxJQUFJLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQztZQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUNwQztRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQ0Qsd0NBQU0sR0FBTjtRQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQXhCUSx1QkFBdUI7UUFObkMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUseUJBQXlCO1NBQ3pDLENBQUM7eUNBUThCLGdDQUFpQjtPQUxwQyx1QkFBdUIsQ0F5Qm5DO0lBQUQsOEJBQUM7Q0FBQSxBQXpCRCxJQXlCQztBQXpCWSwwREFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyIvL2FuZ3VsYXIgJiBuYXRpdmVzY3JpcHQgcmVmZXJlbmNlc1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE1vZGFsRGlhbG9nUGFyYW1zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL21vZGFsLWRpYWxvZ1wiO1xuaW1wb3J0IHsgTGlzdFZpZXcsIEl0ZW1FdmVudERhdGEgfSBmcm9tIFwidWkvbGlzdC12aWV3XCI7XG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICduYXRpdmVzY3JpcHQtdG9hc3QnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vZGV2aWNlTGlzdC1tb2RhbC5odG1sXCJcbn0pXG5cblxuZXhwb3J0IGNsYXNzIERldmljZUxpc3RQaWNrQ29tcG9uZW50IHtcbiAgICBwdWJsaWMgRGV2aWNlTGlzdDphbnk7XG4gICAgcHVibGljIG5ld0RldmljZUxpc3Q6YW55O1xuICAgIHB1YmxpYyBTZWxlY3RlZERldmljZSA6IGFueTtcbiAgIFxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyYW1zOiBNb2RhbERpYWxvZ1BhcmFtcykge1xuICAgICAgICB0aGlzLkRldmljZUxpc3QgPSBwYXJhbXMuY29udGV4dDtcbiAgICAgICAgdGhpcy5uZXdEZXZpY2VMaXN0ID0gdGhpcy5EZXZpY2VMaXN0O1xuICAgICAgICBjb25zb2xlLmRpcih0aGlzLkRldmljZUxpc3QpO1xuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh0aGlzLkRldmljZUxpc3Qud29ya3N0YXRpb24pKTtcbiAgICB9XG4gICAgXG4gcHVibGljIFNlbGVjdFByaW50ZXIocGlja2VyOiBhbnkpIHtcbiAgICAgICBcbiAgICAgICAgbGV0IGRldmljZU5hbWUgPSBwaWNrZXIuRGV2aWNlTmFtZTtcbiAgICAgICAgY29uc29sZS5sb2coZGV2aWNlTmFtZSk7XG4gICAgICAgIGlmIChkZXZpY2VOYW1lICE9IFwiXCIpIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWREZXZpY2UgPSBwaWNrZXI7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLlNlbGVjdGVkRGV2aWNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhcmFtcy5jbG9zZUNhbGxiYWNrKHRoaXMuU2VsZWN0ZWREZXZpY2UpO1xuICAgIH1cbiAgICBjYW5jZWwoKXtcbiAgICAgICAgdGhpcy5wYXJhbXMuY2xvc2VDYWxsYmFjaygpOyBcbiAgICB9XG59XG4iXX0=