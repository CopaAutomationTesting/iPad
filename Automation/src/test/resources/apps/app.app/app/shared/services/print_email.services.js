"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/catch");
var router_1 = require("nativescript-angular/router");
var app_constants_1 = require("../../app.constants");
var checkinorder_service_1 = require("./checkinorder.service");
var handleError_extractData_service_1 = require("./handleError_extractData.service");
var PrintEmailService = /** @class */ (function () {
    function PrintEmailService(routerExtensions, _http, _configuration, _shared) {
        this.routerExtensions = routerExtensions;
        this._http = _http;
        this._configuration = _configuration;
        this._shared = _shared;
        this.parent = this;
        this.actionUrlforLogin = _configuration.ServerWithApiUrlForSiteminderLogin;
        this.actionUrl = _configuration.ServerWithApiUrlEmd;
        this.headerApiuser = _configuration.HeaderApiuser;
        this.headerCurrency = this._shared.GetCurrency();
        this.salesOffice = this._shared.GetUserPointofSale();
        this.actionUrlforPaxOrderID = _configuration.ServerWithApiUrlOrders;
        this.actionUrlforPaxByFlight = _configuration.ServerWithApiUrlFlights;
        this.actionUrlforCheckIn = _configuration.ServerWithApiUrlCheckin;
        this.actionUrlforBaggage = _configuration.ServerWithApiUrlBaggage;
        this.actionUrlforPrice = _configuration.ServerWithApiUrlPrice;
        this.actionUrlforProfile = _configuration.ServerWithApiUrlProfile;
        this.actionUrlforSeatMap = _configuration.ServerWithApiUrlSeatMap;
        this.actionUrlforAssignSeat = _configuration.ServerWithApiUrlAssignSeat;
        this.actionUrlforbookingcount = _configuration.ServerWithApiUrlbookingcount;
        this.actionUrlforOffload = _configuration.ServerWithApiUrlOffload;
        this.actionUrlforBagTag = _configuration.ServerWithApiUrlBagTag;
        this.actionUrlforFQTV = _configuration.ServerWithApiUrlFQTV;
        this.actionUrlforDevicePrinter = _configuration.ServerWithApiUrlPrinterDevice;
        this.actionUrlforPrinting = _configuration.HostPrinter;
        this.actionUrlforRemarks = _configuration.Remarks;
        this.actionUrlforRemarksCheckin = _configuration.RemarksCheckin;
        this.headers = new http_1.Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }
    PrintEmailService.prototype.PrintBoardingPass = function (request) {
        var headers = new http_1.Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.post(this.actionUrlforPrinting + "checkin/boardingpasses", JSON.parse(JSON.stringify(request)), { headers: headers })
            .map(handleError_extractData_service_1.HandleErrorExtractData.extractData)
            .catch(handleError_extractData_service_1.HandleErrorExtractData.handleErrors);
    };
    PrintEmailService.prototype.PrintBagTag = function (request) {
        var headers = new http_1.Headers();
        headers.append("ApiUser", this.headerApiuser);
        headers.append("http_currency", this.headerCurrency);
        headers.append("http_salesoffice", this.salesOffice);
        return this._http.post(this.actionUrlforPrinting + "checkin/bagtags", JSON.parse(JSON.stringify(request)), { headers: headers })
            .map(handleError_extractData_service_1.HandleErrorExtractData.extractData)
            .catch(handleError_extractData_service_1.HandleErrorExtractData.handleErrors);
    };
    PrintEmailService.prototype.SendBaordingPassEmail = function (request) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        return this._http.post('http://204.26.136.143:8080/tr-common-printing-webservice/outputrequest', JSON.parse(JSON.stringify(request)), { headers: headers })
            .map(handleError_extractData_service_1.HandleErrorExtractData.extractData)
            .catch(handleError_extractData_service_1.HandleErrorExtractData.handleErrors);
    };
    PrintEmailService.prototype.Remarks = function (request) {
        console.log("in");
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        return this._http.post(this.actionUrlforRemarks, JSON.parse(JSON.stringify(request)), { headers: headers })
            .map(handleError_extractData_service_1.HandleErrorExtractData.extractData)
            .catch(handleError_extractData_service_1.HandleErrorExtractData.handleErrors);
    };
    PrintEmailService.prototype.RemarksCheckin = function (request) {
        console.log("in");
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        return this._http.post(this.actionUrlforRemarksCheckin, JSON.parse(JSON.stringify(request)), { headers: headers })
            .map(handleError_extractData_service_1.HandleErrorExtractData.extractData)
            .catch(handleError_extractData_service_1.HandleErrorExtractData.handleErrors);
    };
    PrintEmailService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.RouterExtensions, http_1.Http, app_constants_1.Configuration, checkinorder_service_1.CheckinOrderService])
    ], PrintEmailService);
    return PrintEmailService;
}());
exports.PrintEmailService = PrintEmailService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbnRfZW1haWwuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcmludF9lbWFpbC5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyxzQ0FBMkM7QUFDM0Msc0NBQXdFO0FBRXhFLGlDQUErQjtBQUMvQixtQ0FBaUM7QUFDakMsbUNBQWlDO0FBRWpDLHNEQUErRDtBQU8vRCxxREFBb0Q7QUFFcEQsK0RBQTZEO0FBQzdELHFGQUE0RTtBQU01RTtJQTJCSSwyQkFBb0IsZ0JBQWtDLEVBQVUsS0FBVyxFQUFVLGNBQTZCLEVBQVUsT0FBNEI7UUFBcEkscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUFVLFVBQUssR0FBTCxLQUFLLENBQU07UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQXFCO1FBQ3BKLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxjQUFjLENBQUMsa0NBQWtDLENBQUM7UUFDM0UsSUFBSSxDQUFDLFNBQVMsR0FBRyxjQUFjLENBQUMsbUJBQW1CLENBQUM7UUFDcEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxjQUFjLENBQUMsYUFBYSxDQUFDO1FBQ2xELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNqRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsY0FBYyxDQUFDLHNCQUFzQixDQUFDO1FBQ3BFLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxjQUFjLENBQUMsdUJBQXVCLENBQUM7UUFDdEUsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQztRQUNsRSxJQUFJLENBQUMsbUJBQW1CLEdB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MENBQWMsR0FBckIsVUFBc0IsT0FBVztRQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLElBQUksT0FBTyxHQUFHLElBQUksY0FBTyxFQUFFLENBQUM7UUFDNUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUNuRCxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDO2FBQ2pILEdBQUcsQ0FBQyx3REFBc0IsQ0FBQyxXQUFXLENBQUM7YUFDdkMsS0FBSyxDQUFDLHdEQUFzQixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFwR1EsaUJBQWlCO1FBRDdCLGlCQUFVLEVBQUU7eUNBNEI2Qix5QkFBZ0IsRUFBaUIsV0FBSSxFQUEwQiw2QkFBYSxFQUFtQiwwQ0FBbUI7T0EzQi9JLGlCQUFpQixDQXFHN0I7SUFBRCx3QkFBQztDQUFBLEFBckdELElBcUdDO0FBckdZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8vYW5ndWxhciAmIG5hdGl2ZXNjcmlwdCByZWZlcmVuY2VzXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwLCBSZXNwb25zZSwgSGVhZGVycywgUmVxdWVzdE9wdGlvbnMgfSBmcm9tICdAYW5ndWxhci9odHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL1J4JztcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvbWFwJztcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvY2F0Y2gnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9jYXRjaCc7XG5pbXBvcnQgKiBhcyBkaWFsb2dzIGZyb20gXCJ1aS9kaWFsb2dzXCI7XG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgUm91dGVyLCBOYXZpZ2F0aW9uRXh0cmFzLCBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuXG4vL2FwcCByZWZlcmVuY2VzXG5pbXBvcnQgeyBQYXNzZW5nZXIgfSBmcm9tICcuLi9tb2RlbC9pbmRleCc7XG5pbXBvcnQgeyBvcmRlciwgUGF4VGVtcGxhdGUgfSBmcm9tICcuLi9pbnRlcmZhY2UvaW5kZXgnO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uLy4uL2FwcC5jb25zdGFudHMnO1xuaW1wb3J0IHsgQXBwRXhlY3V0aW9udGltZSB9IGZyb20gXCIuLi8uLi9hcHAuZXhlY3V0aW9udGltZVwiO1xuaW1wb3J0IHsgQ2hlY2tpbk9yZGVyU2VydmljZSB9IGZyb20gXCIuL2NoZWNraW5vcmRlci5zZXJ2aWNlXCI7XG5pbXBvcnQgeyAgSGFuZGxlRXJyb3JFeHRyYWN0RGF0YSB9IGZyb20gXCIuL2hhbmRsZUVycm9yX2V4dHJhY3REYXRhLnNlcnZpY2VcIjtcblxuXG5kZWNsYXJlIHZhciBOU0hUVFBDb29raWVTdG9yYWdlLCBOU0hUVFBDb29raWU7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQcmludEVtYWlsU2VydmljZSB7XG4gICAgcHJpdmF0ZSBhY3Rpb25Vcmw6IHN0cmluZztcbiAgICBwcml2YXRlIGhlYWRlckFwaXVzZXI6IHN0cmluZztcbiAgICBwcml2YXRlIGhlYWRlckN1cnJlbmN5OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBhY3Rpb25Vcmxmb3JQYXhPcmRlcklEOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBhY3Rpb25Vcmxmb3JQYXhCeUZsaWdodDogc3RyaW5nO1xuICAgIHByaXZhdGUgYWN0aW9uVXJsZm9yQ2hlY2tJbjogc3RyaW5nO1xuICAgIHByaXZhdGUgYWN0aW9uVXJsZm9yUHJvZmlsZTogc3RyaW5nO1xuICAgIHByaXZhdGUgc2FsZXNPZmZpY2U6IHN0cmluZztcbiAgICBwcml2YXRlIGhlYWRlcnM6IEhlYWRlcnM7XG4gICAgcHVibGljIFBhc3NlbmdlckRldGFpbHM6IG9yZGVyO1xuICAgIHByaXZhdGUgYWN0aW9uVXJsZm9yQmFnZ2FnZTogc3RyaW5nO1xuICAgIHByaXZhdGUgYWN0aW9uVXJsZm9yUHJpY2U6IHN0cmluZztcbiAgICBwcml2YXRlIGFjdGlvblVybGZvclNlYXRNYXA6IHN0cmluZztcbiAgICBwcml2YXRlIGFjdGlvblVybGZvckFzc2lnblNlYXQ6IHN0cmluZztcbiAgICBwcml2YXRlIGFjdGlvblVybGZvcmJvb2tpbmdjb3VudDogc3RyaW5nO1xuICAgIHByaXZhdGUgYWN0aW9uVXJsZm9yT2ZmbG9hZDogc3RyaW5nO1xuICAgIHByaXZhdGUgYWN0aW9uVXJsZm9yQmFnVGFnOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBhY3Rpb25Vcmxmb3JGUVRWOiBzdHJpbmdcbiAgICBwcml2YXRlIGFjdGlvblVybGZvckxvZ2luOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBhY3Rpb25Vcmxmb3JEZXZpY2VQcmludGVyOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBhY3Rpb247XG4gICAgcHJpdmF0ZSBwYXJlbnQ6IGFueTtcbiAgICBwcml2YXRlIGFjdGlvblVybGZvclByaW50aW5nOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBhY3Rpb25Vcmxmb3JSZW1hcmtzOnN0cmluZztcbiAgICBwcml2YXRlIGFjdGlvblVybGZvclJlbWFya3NDaGVja2luOnN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9ucywgcHJpdmF0ZSBfaHR0cDogSHR0cCwgcHJpdmF0ZSBfY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbiwgcHJpdmF0ZSBfc2hhcmVkOiBDaGVja2luT3JkZXJTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gdGhpcztcbiAgICAgICAgdGhpcy5hY3Rpb25Vcmxmb3JMb2dpbiA9IF9jb25maWd1cmF0aW9uLlNlcnZlcldpdGhBcGlVcmxGb3JTaXRlbWluZGVyTG9naW47XG4gICAgICAgIHRoaXMuYWN0aW9uVXJsID0gX2NvbmZpZ3VyYXRpb24uU2VydmVyV2l0aEFwaVVybEVtZDtcbiAgICAgICAgdGhpcy5oZWFkZXJBcGl1c2VyID0gX2NvbmZpZ3VyYXRpb24uSGVhZGVyQXBpdXNlcjtcbiAgICAgICAgdGhpcy5oZWFkZXJDdXJyZW5jeSA9IHRoaXMuX3NoYXJlZC5HZXRDdXJyZW5jeSgpO1xuICAgICAgICB0aGlzLnNhbGVzT2ZmaWNlID0gdGhpcy5fc2hhcmVkLkdldFVzZXJQb2ludG9mU2FsZSgpO1xuICAgICAgICB0aGlzLmFjdGlvblVybGZvclBheE9yZGVySUQgPSBfY29uZmlndXJhdGlvbi5TZXJ2ZXJXaXRoQXBpVXJsT3JkZXJzO1xuICAgICAgICB0aGlzLmFjdGlvblVybGZvclBheEJ5RmxpZ2h0ID0gX2NvbmZpZ3VyYXRpb24uU2VydmVyV2l0aEFwaVVybEZsaWdodHM7XG4gICAgICAgIHRoaXMuYWN0aW9uVXJsZm9yQ2hlY2tJbiA9IF9jb25maWd1cmF0aW9uLlNlcnZlcldpdGhBcGlVcmxDaGVja2luO1xuICAgICAgICB0aGlzLmFjdGlvblVybGZvckJhZ2dhZ2UgPSBfY29uZmlndXJhdGlvbi5TZXJ2ZXJXaXRoQXBpVXJsQmFnZ2FnZTtcbiAgICAgICAgdGhpcy5hY3Rpb25Vcmxmb3JQcmljZSA9IF9jb25maWd1cmF0aW9uLlNlcnZlcldpdGhBcGlVcmxQcmljZTtcbiAgICAgICAgdGhpcy5hY3Rpb25Vcmxmb3JQcm9maWxlID0gX2NvbmZpZ3VyYXRpb24uU2VydmVyV2l0aEFwaVVybFByb2ZpbGU7XG4gICAgICAgIHRoaXMuYWN0aW9uVXJsZm9yU2VhdE1hcCA9IF9jb25maWd1cmF0aW9uLlNlcnZlcldpdGhBcGlVcmxTZWF0TWFwO1xuICAgICAgICB0aGlzLmFjdGlvblVybGZvckFzc2lnblNlYXQgPSBfY29uZmlndXJhdGlvbi5TZXJ2ZXJXaXRoQXBpVXJsQXNzaWduU2VhdDtcbiAgICAgICAgdGhpcy5hY3Rpb25Vcmxmb3Jib29raW5nY291bnQgPSBfY29uZmlndXJhdGlvbi5TZXJ2ZXJXaXRoQXBpVXJsYm9va2luZ2NvdW50O1xuICAgICAgICB0aGlzLmFjdGlvblVybGZvck9mZmxvYWQgPSBfY29uZmlndXJhdGlvbi5TZXJ2ZXJXaXRoQXBpVXJsT2ZmbG9hZDtcbiAgICAgICAgdGhpcy5hY3Rpb25Vcmxmb3JCYWdUYWcgPSBfY29uZmlndXJhdGlvbi5TZXJ2ZXJXaXRoQXBpVXJsQmFnVGFnO1xuICAgICAgICB0aGlzLmFjdGlvblVybGZvckZRVFYgPSBfY29uZmlndXJhdGlvbi5TZXJ2ZXJXaXRoQXBpVXJsRlFUVjtcbiAgICAgICAgdGhpcy5hY3Rpb25Vcmxmb3JEZXZpY2VQcmludGVyID0gX2NvbmZpZ3VyYXRpb24uU2VydmVyV2l0aEFwaVVybFByaW50ZXJEZXZpY2U7XG4gICAgICAgIHRoaXMuYWN0aW9uVXJsZm9yUHJpbnRpbmcgPSBfY29uZmlndXJhdGlvbi5Ib3N0UHJpbnRlcjtcbiAgICAgICAgdGhpcy5hY3Rpb25Vcmxmb3JSZW1hcmtzID0gX2NvbmZpZ3VyYXRpb24uUmVtYXJrcztcbiAgICAgICAgdGhpcy5hY3Rpb25Vcmxmb3JSZW1hcmtzQ2hlY2tpbiA9IF9jb25maWd1cmF0aW9uLlJlbWFya3NDaGVja2luO1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgICAgICB0aGlzLmhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB0aGlzLmhlYWRlcnMuYXBwZW5kKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIH1cblxuICAgIHB1YmxpYyBQcmludEJvYXJkaW5nUGFzcyhyZXF1ZXN0OiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiQXBpVXNlclwiLCB0aGlzLmhlYWRlckFwaXVzZXIpO1xuICAgICAgICBoZWFkZXJzLmFwcGVuZChcImh0dHBfY3VycmVuY3lcIiwgdGhpcy5oZWFkZXJDdXJyZW5jeSk7XG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiaHR0cF9zYWxlc29mZmljZVwiLCB0aGlzLnNhbGVzT2ZmaWNlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0dHAucG9zdCh0aGlzLmFjdGlvblVybGZvclByaW50aW5nICsgXCJjaGVja2luL2JvYXJkaW5ncGFzc2VzXCIsIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmVxdWVzdCkpLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSlcbiAgICAgICAgICAgIC5tYXAoSGFuZGxlRXJyb3JFeHRyYWN0RGF0YS5leHRyYWN0RGF0YSlcbiAgICAgICAgICAgIC5jYXRjaChIYW5kbGVFcnJvckV4dHJhY3REYXRhLmhhbmRsZUVycm9ycyk7XG4gICAgfVxuXG4gICAgcHVibGljIFByaW50QmFnVGFnKHJlcXVlc3Q6IGFueSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJBcGlVc2VyXCIsIHRoaXMuaGVhZGVyQXBpdXNlcik7XG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiaHR0cF9jdXJyZW5jeVwiLCB0aGlzLmhlYWRlckN1cnJlbmN5KTtcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJodHRwX3NhbGVzb2ZmaWNlXCIsIHRoaXMuc2FsZXNPZmZpY2UpO1xuICAgICAgICByZXR1cm4gdGhpcy5faHR0cC5wb3N0KHRoaXMuYWN0aW9uVXJsZm9yUHJpbnRpbmcgKyBcImNoZWNraW4vYmFndGFnc1wiLCBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlcXVlc3QpKSwgeyBoZWFkZXJzOiBoZWFkZXJzIH0pXG4gICAgICAgICAgICAubWFwKEhhbmRsZUVycm9yRXh0cmFjdERhdGEuZXh0cmFjdERhdGEpXG4gICAgICAgICAgICAuY2F0Y2goSGFuZGxlRXJyb3JFeHRyYWN0RGF0YS5oYW5kbGVFcnJvcnMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBTZW5kQmFvcmRpbmdQYXNzRW1haWwocmVxdWVzdDogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHJldHVybiB0aGlzLl9odHRwLnBvc3QoJ2h0dHA6Ly8yMDQuMjYuMTM2LjE0Mzo4MDgwL3RyLWNvbW1vbi1wcmludGluZy13ZWJzZXJ2aWNlL291dHB1dHJlcXVlc3QnLCBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlcXVlc3QpKSwgeyBoZWFkZXJzOiBoZWFkZXJzIH0pXG4gICAgICAgICAgICAubWFwKEhhbmRsZUVycm9yRXh0cmFjdERhdGEuZXh0cmFjdERhdGEpXG4gICAgICAgICAgICAuY2F0Y2goSGFuZGxlRXJyb3JFeHRyYWN0RGF0YS5oYW5kbGVFcnJvcnMpO1xuICAgIH1cbiAgICBwdWJsaWMgUmVtYXJrcyhyZXF1ZXN0OmFueSkgOk9ic2VydmFibGU8YW55PntcbiAgICAgICAgY29uc29sZS5sb2coXCJpblwiKTtcbiAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHJldHVybiB0aGlzLl9odHRwLnBvc3QodGhpcy5hY3Rpb25Vcmxmb3JSZW1hcmtzLCBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlcXVlc3QpKSwgeyBoZWFkZXJzOiBoZWFkZXJzIH0pXG4gICAgICAgIC5tYXAoSGFuZGxlRXJyb3JFeHRyYWN0RGF0YS5leHRyYWN0RGF0YSlcbiAgICAgICAgLmNhdGNoKEhhbmRsZUVycm9yRXh0cmFjdERhdGEuaGFuZGxlRXJyb3JzKTtcbiAgICB9XG4gICAgcHVibGljIFJlbWFya3NDaGVja2luKHJlcXVlc3Q6YW55KSA6T2JzZXJ2YWJsZTxhbnk+e1xuICAgICAgICBjb25zb2xlLmxvZyhcImluXCIpO1xuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICBoZWFkZXJzLmFwcGVuZCgnQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0dHAucG9zdCh0aGlzLmFjdGlvblVybGZvclJlbWFya3NDaGVja2luLCBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlcXVlc3QpKSwgeyBoZWFkZXJzOiBoZWFkZXJzIH0pXG4gICAgICAgIC5tYXAoSGFuZGxlRXJyb3JFeHRyYWN0RGF0YS5leHRyYWN0RGF0YSlcbiAgICAgICAgLmNhdGNoKEhhbmRsZUVycm9yRXh0cmFjdERhdGEuaGFuZGxlRXJyb3JzKTtcbiAgICB9XG59Il19