"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ApplicationSettings = require("application-settings");
var observable_1 = require("data/observable");
var printId, binding = new observable_1.Observable();
var Configuration = /** @class */ (function () {
    function Configuration() {
        // http://ustlssoat258.airservices.svcs.entsvcs.net:12499 (dev)
        // http://ustlssoat114.airservices.svcs.entsvcs.com:8980/api409(dev)
        // http://ustlssoat258.airservices.svcs.entsvcs.net:12449/
        // http://ustlssoat114.airservices.svcs.entsvcs.com:8980/api439/account/profile
        // public CLTURL = "http://pssguicmmb.airservices.svcs.entsvcs.com:8970/"; 
        //==============================================URL=========================================================//
        // https://pssgui.copauat.travel.airservices.svcs.entsvcs.com/api/ **(UAT)**                                //
        // http://ustlssoat114.airservices.svcs.entsvcs.com:8980/api409/ **(dev)**                                  // 
        // https://pssguicmt.airservices.svcs.entsvcs.com/api/ **(jsit)**                                           // 
        // https://pssguicmmb.airservices.svcs.entsvcs.com/api/ **(sit)**                                           //
        // https://pssguicmt.airservices.svcs.entsvcs.com/api449/ **(tab sit)**                                     //
        //==========================================================================================================//
        this.Server = "https://pssgui.copauat.travel.airservices.svcs.entsvcs.com/";
        this.ApiUrl = "api/";
        this.ServerWithApiUrlForSiteminderLogin = this.Server;
        this.ServerWithApiUrlCheckin = this.Server + this.ApiUrl + checkin;
        this.ServerWithApiUrlEmd = this.Server + this.ApiUrl + emds;
        this.ServerWithApiUrlFlights = this.Server + this.ApiUrl + flights;
        this.ServerWithApiUrlOrders = this.Server + this.ApiUrl + orders;
        this.ServerWithApiUrlBaggage = this.Server + this.ApiUrl + baggage;
        this.ServerWithApiUrlPrice = this.Server + this.ApiUrl + price;
        this.ServerWithApiUrlGetPassenger = this.Server + this.ApiUrl + getPassenger;
        this.ServerWithApiUrlGetReqDocuments = this.Server + this.ApiUrl + getReq;
        this.ServerWithApiUrlValidatePassenger = this.Server + this.ApiUrl + validate;
        this.ServerWithApiUrlAddPassenger = this.Server + this.ApiUrl + orders;
        this.ServerWithApiUrlProfile = this.Server + this.ApiUrl + profile;
        this.ServerWithApiUrlCountries = this.Server + this.ApiUrl + contries;
        this.ServerWithApiUrlCities = this.Server + this.ApiUrl + cities;
        this.ServerWithApiUrlSeatMap = this.Server + this.ApiUrl + seatmap;
        this.ServerWithApiUrlAssignSeat = this.Server + this.ApiUrl + assignseat;
        this.ServerWithApiUrlbookingcount = this.Server + this.ApiUrl + flights;
        this.ServerWithApiUrlOffload = this.Server + this.ApiUrl + offload;
        this.ServerWithApiUrlBagTag = this.Server + this.ApiUrl + bagtag;
        this.ServerWithApiUrlFQTV = this.Server + this.ApiUrl + fqtv;
        this.ServerWithApiUrlPrinterDevice = this.Server + this.ApiUrl + printer;
        this.ServerWithApiUrlWorkStation = this.Server;
        this.HeaderApiuser = ApplicationSettings.getString("apiUserKey", "");
        this.FieldValidationText = emptyFieldWarning;
        this.ApisDataRequired = "APIS Data Required";
        this.HostPrinter = this.Server + this.ApiUrl;
        this.Remarks = this.Server + this.ApiUrl + remarks;
        this.RemarksCheckin = this.Server + this.ApiUrl + remarksCheckin;
        this.checkin = this.Server + this.ApiUrl + passengerCheckin;
        this.CompensationType = this.Server + this.ApiUrl;
        this.CompensationPassengers = this.Server + this.ApiUrl + flights;
        this.CompensationOrders = this.Server + this.ApiUrl + orders;
        this.CompensationCLT = "";
        this.CompensationPrint = this.Server + this.ApiUrl + printreceipt;
        this.CompensationEmail = this.Server + this.ApiUrl + emailreceipt;
    }
    Configuration = __decorate([
        core_1.Injectable()
    ], Configuration);
    return Configuration;
}());
exports.Configuration = Configuration;
var checkin = "checkin/";
var passengerCheckin = "checkin";
var emds = "emds/";
var flights = "flights/";
var orders = "orders/";
var baggage = "baggage/catalog/";
var price = "baggage/price";
var getPassenger = "orders/";
var getReq = "orders/";
var validate = "orders/";
var apis = "apis";
var profile = "account/profile";
var contries = "countries";
var cities = "cities/";
var seatmap = "flights/";
var assignseat = "seats/assign";
var offload = "checkin/offload";
var bagtag = "checkin/tags/manualbagtag";
var fqtv = "reference?get=fqtv";
var printer = "delivery/printers/";
var printreceipt = "delivery/printreceipt/emd";
var emailreceipt = "delivery/emailreceipt/emd";
var emptyFieldWarning = "mandatory fields should not be empty";
var passengerReference = "reference/";
var remarks = "checkin/tags/bagtagprintaction";
var remarksCheckin = "checkin/tags/checkinbagtagprint";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbnN0YW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb25zdGFudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkM7QUFDM0MsMERBQTREO0FBQzVELDhDQUE2QztBQUM3QyxJQUFJLE9BQU8sRUFBRyxPQUFPLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7QUFJekM7SUFGQTtRQUdJLCtEQUErRDtRQUMvRCxvRUFBb0U7UUFDcEUsMERBQTBEO1FBQzFELCtFQUErRTtRQUMvRSwyRUFBMkU7UUFDM0UsOEdBQThHO1FBQzlHLDhHQUE4RztRQUM5RywrR0FBK0c7UUFDL0csK0dBQStHO1FBQy9HLDhHQUE4RztRQUM5Ryw4R0FBOEc7UUFDOUcsOEdBQThHO1FBQ3ZHLFdBQU0sR0FBVyw2REFBNkQsQ0FBQztRQUMvRSxXQUFNLEdBQVcsTUFBTSxDQUFDO1FBQ3hCLHVDQUFrQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDakQsNEJBQXVCLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztRQUM5RCx3QkFBbUIsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3ZELDRCQUF1QixHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7UUFDOUQsMkJBQXNCLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUM1RCw0QkFBdUIsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBQzlELDBCQUFxQixHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDMUQsaUNBQTRCLEdBQUcsSUFBSSxDQUFDLE1BQU0s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QUFNLE9BQU8sR0FBUSxVQUFVLENBQUM7QUFDaEMsSUFBTSxnQkFBZ0IsR0FBUSxTQUFTLENBQUM7QUFDeEMsSUFBTSxJQUFJLEdBQVEsT0FBTyxDQUFDO0FBQzFCLElBQU0sT0FBTyxHQUFRLFVBQVUsQ0FBQztBQUNoQyxJQUFNLE1BQU0sR0FBUSxTQUFTLENBQUM7QUFDOUIsSUFBTSxPQUFPLEdBQVEsa0JBQWtCLENBQUM7QUFDeEMsSUFBTSxLQUFLLEdBQVEsZUFBZSxDQUFDO0FBQ25DLElBQU0sWUFBWSxHQUFRLFNBQVMsQ0FBQztBQUNwQyxJQUFNLE1BQU0sR0FBUSxTQUFTLENBQUM7QUFDOUIsSUFBTSxRQUFRLEdBQVEsU0FBUyxDQUFDO0FBQ2hDLElBQU0sSUFBSSxHQUFRLE1BQU0sQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBUSxpQkFBaUIsQ0FBQztBQUN2QyxJQUFNLFFBQVEsR0FBUSxXQUFXLENBQUM7QUFDbEMsSUFBTSxNQUFNLEdBQVEsU0FBUyxDQUFDO0FBQzlCLElBQU0sT0FBTyxHQUFRLFVBQVUsQ0FBQztBQUNoQyxJQUFNLFVBQVUsR0FBUSxjQUFjLENBQUM7QUFDdkMsSUFBTSxPQUFPLEdBQVMsaUJBQWlCLENBQUM7QUFDeEMsSUFBTSxNQUFNLEdBQVMsMkJBQTJCLENBQUM7QUFDakQsSUFBTSxJQUFJLEdBQVEsb0JBQW9CLENBQUM7QUFDdkMsSUFBTSxPQUFPLEdBQVUsb0JBQW9CLENBQUM7QUFDNUMsSUFBTSxZQUFZLEdBQVUsMkJBQTJCLENBQUM7QUFDeEQsSUFBTSxZQUFZLEdBQVUsMkJBQTJCLENBQUM7QUFDeEQsSUFBTSxpQkFBaUIsR0FBUyxzQ0FBc0MsQ0FBQztBQUN2RSxJQUFNLGtCQUFrQixHQUFVLFlBQVksQ0FBQTtBQUM5QyxJQUFNLE9BQU8sR0FBUSxnQ0FBZ0MsQ0FBQztBQUN0RCxJQUFNLGNBQWMsR0FBVSxpQ0FBaUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0ICogYXMgQXBwbGljYXRpb25TZXR0aW5ncyBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjsgXHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdkYXRhL29ic2VydmFibGUnO1xyXG52YXIgcHJpbnRJZCAsIGJpbmRpbmcgPSBuZXcgT2JzZXJ2YWJsZSgpO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbmZpZ3VyYXRpb24ge1xyXG4gICAgLy8gaHR0cDovL3VzdGxzc29hdDI1OC5haXJzZXJ2aWNlcy5zdmNzLmVudHN2Y3MubmV0OjEyNDk5IChkZXYpXHJcbiAgICAvLyBodHRwOi8vdXN0bHNzb2F0MTE0LmFpcnNlcnZpY2VzLnN2Y3MuZW50c3Zjcy5jb206ODk4MC9hcGk0MDkoZGV2KVxyXG4gICAgLy8gaHR0cDovL3VzdGxzc29hdDI1OC5haXJzZXJ2aWNlcy5zdmNzLmVudHN2Y3MubmV0OjEyNDQ5L1xyXG4gICAgLy8gaHR0cDovL3VzdGxzc29hdDExNC5haXJzZXJ2aWNlcy5zdmNzLmVudHN2Y3MuY29tOjg5ODAvYXBpNDM5L2FjY291bnQvcHJvZmlsZVxyXG4gICAgLy8gcHVibGljIENMVFVSTCA9IFwiaHR0cDovL3Bzc2d1aWNtbWIuYWlyc2VydmljZXMuc3Zjcy5lbnRzdmNzLmNvbTo4OTcwL1wiOyBcclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVVSTD09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PS8vXHJcbiAgICAvLyBodHRwczovL3Bzc2d1aS5jb3BhdWF0LnRyYXZlbC5haXJzZXJ2aWNlcy5zdmNzLmVudHN2Y3MuY29tL2FwaS8gKiooVUFUKSoqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4gICAgLy8gaHR0cDovL3VzdGxzc29hdDExNC5haXJzZXJ2aWNlcy5zdmNzLmVudHN2Y3MuY29tOjg5ODAvYXBpNDA5LyAqKihkZXYpKiogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXHJcbiAgICAvLyBodHRwczovL3Bzc2d1aWNtdC5haXJzZXJ2aWNlcy5zdmNzLmVudHN2Y3MuY29tL2FwaS8gKiooanNpdCkqKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcclxuICAgIC8vIGh0dHBzOi8vcHNzZ3VpY21tYi5haXJzZXJ2aWNlcy5zdmNzLmVudHN2Y3MuY29tL2FwaS8gKiooc2l0KSoqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHJcbiAgICAvLyBodHRwczovL3Bzc2d1aWNtdC5haXJzZXJ2aWNlcy5zdmNzLmVudHN2Y3MuY29tL2FwaTQ0OS8gKioodGFiIHNpdCkqKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1xyXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ly9cclxuICAgIHB1YmxpYyBTZXJ2ZXI6IHN0cmluZyA9IFwiaHR0cHM6Ly9wc3NndWkuY29wYXVhdC50cmF2ZWwuYWlyc2VydmljZXMuc3Zjcy5lbnRzdmNzLmNvbS9cIjsgXHJcbiAgICBwdWJsaWMgQXBpVXJsOiBzdHJpbmcgPSBcImFwaS9cIjtcclxuICAgIHB1YmxpYyBTZXJ2ZXJXaXRoQXBpVXJsRm9yU2l0ZW1pbmRlckxvZ2luID0gdGhpcy5TZXJ2ZXI7XHJcbiAgICBwdWJsaWMgU2VydmVyV2l0aEFwaVVybENoZWNraW4gPSB0aGlzLlNlcnZlciArIHRoaXMuQXBpVXJsICsgY2hlY2tpbjtcclxuICAgIHB1YmxpYyBTZXJ2ZXJXaXRoQXBpVXJsRW1kID0gdGhpcy5TZXJ2ZXIgKyB0aGlzLkFwaVVybCArIGVtZHM7XHJcbiAgICBwdWJsaWMgU2VydmVyV2l0aEFwaVVybEZsaWdodHMgPSB0aGlzLlNlcnZlciArIHRoaXMuQXBpVXJsICsgZmxpZ2h0cztcclxuICAgIHB1YmxpYyBTZXJ2ZXJXaXRoQXBpVXJsT3JkZXJzID0gdGhpcy5TZXJ2ZXIgKyB0aGlzLkFwaVVybCArIG9yZGVyczsgXHJcbiAgICBwdWJsaWMgU2VydmVyV2l0aEFwaVVybEJhZ2dhZ2UgPSB0aGlzLlNlcnZlciArIHRoaXMuQXBpVXJsICsgYmFnZ2FnZTtcclxuICAgIHB1YmxpYyBTZXJ2ZXJXaXRoQXBpVXJsUHJpY2UgPSB0aGlzLlNlcnZlciArIHRoaXMuQXBpVXJsICsgcHJpY2U7XHJcbiAgICBwdWJsaWMgU2VydmVyV2l0aEFwaVVybEdldFBhc3NlbmdlciA9IHRoaXMuU2VydmVyICsgdGhpcy5BcGlVcmwgKyBnZXRQYXNzZW5nZXI7XHJcbiAgICBwdWJsaWMgU2VydmVyV2l0aEFwaVVybEdldFJlcURvY3VtZW50cyA9IHRoaXMuU2VydmVyICsgdGhpcy5BcGlVcmwgKyBnZXRSZXE7XHJcbiAgICBwdWJsaWMgU2VydmVyV2l0aEFwaVVybFZhbGlkYXRlUGFzc2VuZ2VyID0gdGhpcy5TZXJ2ZXIgKyB0aGlzLkFwaVVybCArIHZhbGlkYXRlO1xyXG4gICAgcHVibGljIFNlcnZlcldpdGhBcGlVcmxBZGRQYXNzZW5nZXIgPSB0aGlzLlNlcnZlciArIHRoaXMuQXBpVXJsICsgb3JkZXJzO1xyXG4gICAgcHVibGljIFNlcnZlcldpdGhBcGlVcmxQcm9maWxlID0gdGhpcy5TZXJ2ZXIgKyB0aGlzLkFwaVVybCArIHByb2ZpbGU7XHJcbiAgICBwdWJsaWMgU2VydmVyV2l0aEFwaVVybENvdW50cmllcyA9IHRoaXMuU2VydmVyICsgdGhpcy5BcGlVcmwgKyBjb250cmllcztcclxuICAgIHB1YmxpYyBTZXJ2ZXJXaXRoQXBpVXJsQ2l0aWVzID0gdGhpcy5TZXJ2ZXIgKyB0aGlzLkFwaVVybCArIGNpdGllcztcclxuICAgIHB1YmxpYyBTZXJ2ZXJXaXRoQXBpVXJsU2VhdE1hcCA9IHRoaXMuU2VydmVyICsgdGhpcy5BcGlVcmwgKyBzZWF0bWFwO1xyXG4gICAgcHVibGljIFNlcnZlcldpdGhBcGlVcmxBc3NpZ25TZWF0ID0gdGhpcy5TZXJ2ZXIgKyB0aGlzLkFwaVVybCArIGFzc2lnbnNlYXQ7XHJcbiAgICBwdWJsaWMgU2VydmVyV2l0aEFwaVVybGJvb2tpbmdjb3VudCA9IHRoaXMuU2VydmVyICsgdGhpcy5BcGlVcmwgKyBmbGlnaHRzO1xyXG4gICAgcHVibGljIFNlcnZlcldpdGhBcGlVcmxPZmZsb2FkID0gdGhpcy5TZXJ2ZXIgKyB0aGlzLkFwaVVybCArIG9mZmxvYWQ7XHJcbiAgICBwdWJsaWMgU2VydmVyV2l0aEFwaVVybEJhZ1RhZyA9IHRoaXMuU2VydmVyICsgdGhpcy5BcGlVcmwgKyBiYWd0YWc7XHJcbiAgICBwdWJsaWMgU2VydmVyV2l0aEFwaVVybEZRVFYgPSB0aGlzLlNlcnZlciArIHRoaXMuQXBpVXJsICsgZnF0djtcclxuICAgIHB1YmxpYyBTZXJ2ZXJXaXRoQXBpVXJsUHJpbnRlckRldmljZSA9IHRoaXMuU2VydmVyICsgdGhpcy5BcGlVcmwgKyBwcmludGVyO1xyXG4gICAgcHVibGljIFNlcnZlcldpdGhBcGlVcmxXb3JrU3RhdGlvbiA9IHRoaXMuU2VydmVyO1xyXG4gICAgcHVibGljIEhlYWRlckFwaXVzZXIgPUFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiYXBpVXNlcktleVwiLFwiXCIpO1xyXG4gICAgcHVibGljIEZpZWxkVmFsaWRhdGlvblRleHQgPSBlbXB0eUZpZWxkV2FybmluZztcclxuICAgIHB1YmxpYyBBcGlzRGF0YVJlcXVpcmVkID1cIkFQSVMgRGF0YSBSZXF1aXJlZFwiO1xyXG4gICAgcHVibGljIEhvc3RQcmludGVyID0gdGhpcy5TZXJ2ZXIrdGhpcy5BcGlVcmw7XHJcbiAgICBwdWJsaWMgUmVtYXJrcyA9IHRoaXMuU2VydmVyK3RoaXMuQXBpVXJsICtyZW1hcmtzO1xyXG4gICAgcHVibGljIFJlbWFya3NDaGVja2luID0gdGhpcy5TZXJ2ZXIrdGhpcy5BcGlVcmwgKyByZW1hcmtzQ2hlY2tpbjtcclxuICAgIHB1YmxpYyBjaGVja2luID0gdGhpcy5TZXJ2ZXIrdGhpcy5BcGlVcmwrcGFzc2VuZ2VyQ2hlY2tpbjtcclxuICAgIHB1YmxpYyBDb21wZW5zYXRpb25UeXBlID0gdGhpcy5TZXJ2ZXIgKyB0aGlzLkFwaVVybDtcclxuICAgIHB1YmxpYyBDb21wZW5zYXRpb25QYXNzZW5nZXJzID0gdGhpcy5TZXJ2ZXIgKyAgdGhpcy5BcGlVcmwgKyBmbGlnaHRzO1xyXG4gICAgcHVibGljIENvbXBlbnNhdGlvbk9yZGVycyA9IHRoaXMuU2VydmVyICsgdGhpcy5BcGlVcmwgKyBvcmRlcnM7XHJcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uQ0xUID0gXCJcIjtcclxuICAgIHB1YmxpYyBDb21wZW5zYXRpb25QcmludCA9IHRoaXMuU2VydmVyICsgdGhpcy5BcGlVcmwgKyBwcmludHJlY2VpcHQ7XHJcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uRW1haWwgPSB0aGlzLlNlcnZlciArIHRoaXMuQXBpVXJsICsgZW1haWxyZWNlaXB0O1xyXG59XHJcblxyXG5jb25zdCBjaGVja2luOnN0cmluZz1cImNoZWNraW4vXCI7XHJcbmNvbnN0IHBhc3NlbmdlckNoZWNraW46c3RyaW5nPVwiY2hlY2tpblwiO1xyXG5jb25zdCBlbWRzOnN0cmluZz1cImVtZHMvXCI7XHJcbmNvbnN0IGZsaWdodHM6c3RyaW5nPVwiZmxpZ2h0cy9cIjtcclxuY29uc3Qgb3JkZXJzOnN0cmluZz1cIm9yZGVycy9cIjtcclxuY29uc3QgYmFnZ2FnZTpzdHJpbmc9XCJiYWdnYWdlL2NhdGFsb2cvXCI7XHJcbmNvbnN0IHByaWNlOnN0cmluZz1cImJhZ2dhZ2UvcHJpY2VcIjtcclxuY29uc3QgZ2V0UGFzc2VuZ2VyOnN0cmluZz1cIm9yZGVycy9cIjtcclxuY29uc3QgZ2V0UmVxOnN0cmluZz1cIm9yZGVycy9cIjtcclxuY29uc3QgdmFsaWRhdGU6c3RyaW5nPVwib3JkZXJzL1wiO1xyXG5jb25zdCBhcGlzOnN0cmluZz1cImFwaXNcIjtcclxuY29uc3QgcHJvZmlsZTpzdHJpbmc9XCJhY2NvdW50L3Byb2ZpbGVcIjtcclxuY29uc3QgY29udHJpZXM6c3RyaW5nPVwiY291bnRyaWVzXCI7XHJcbmNvbnN0IGNpdGllczpzdHJpbmc9XCJjaXRpZXMvXCI7XHJcbmNvbnN0IHNlYXRtYXA6c3RyaW5nPVwiZmxpZ2h0cy9cIjtcclxuY29uc3QgYXNzaWduc2VhdDpzdHJpbmc9XCJzZWF0cy9hc3NpZ25cIjtcclxuY29uc3Qgb2ZmbG9hZDpzdHJpbmcgPVwiY2hlY2tpbi9vZmZsb2FkXCI7XHJcbmNvbnN0IGJhZ3RhZzpzdHJpbmcgPVwiY2hlY2tpbi90YWdzL21hbnVhbGJhZ3RhZ1wiO1xyXG5jb25zdCBmcXR2OnN0cmluZz1cInJlZmVyZW5jZT9nZXQ9ZnF0dlwiO1xyXG5jb25zdCBwcmludGVyOiBzdHJpbmcgPVwiZGVsaXZlcnkvcHJpbnRlcnMvXCI7XHJcbmNvbnN0IHByaW50cmVjZWlwdDpzdHJpbmcgPSBcImRlbGl2ZXJ5L3ByaW50cmVjZWlwdC9lbWRcIjtcclxuY29uc3QgZW1haWxyZWNlaXB0OnN0cmluZyA9IFwiZGVsaXZlcnkvZW1haWxyZWNlaXB0L2VtZFwiO1xyXG5jb25zdCBlbXB0eUZpZWxkV2FybmluZzpzdHJpbmcgPVwibWFuZGF0b3J5IGZpZWxkcyBzaG91bGQgbm90IGJlIGVtcHR5XCI7XHJcbmNvbnN0IHBhc3NlbmdlclJlZmVyZW5jZTpzdHJpbmcgPSBcInJlZmVyZW5jZS9cIlxyXG5jb25zdCByZW1hcmtzOnN0cmluZz1cImNoZWNraW4vdGFncy9iYWd0YWdwcmludGFjdGlvblwiO1xyXG5jb25zdCByZW1hcmtzQ2hlY2tpbjpzdHJpbmcgPSBcImNoZWNraW4vdGFncy9jaGVja2luYmFndGFncHJpbnRcIjtcclxuXHJcblxyXG5cclxuIl19