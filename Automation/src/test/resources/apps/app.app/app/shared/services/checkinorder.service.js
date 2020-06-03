"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CheckinOrderService = /** @class */ (function () {
    function CheckinOrderService() {
        this.DateFormat = "Select Date Format";
        this.LicenseKey = "GZR5RI67-FZ7NRGBU-OJBNPM4U-KGEKLXEV-RYNUCN2R-RCS5ZFMO-DNATP4ID-M246BEHY";
        this.GetBagTags = [];
    }
    CheckinOrderService.prototype.SetAPISDocument = function (apisDocument) {
        this.APISDocument = apisDocument;
    };
    CheckinOrderService.prototype.GetAPISDocument = function () {
        return this.APISDocument;
    };
    CheckinOrderService.prototype.SetScanAPISDocument = function (apisDocument) {
        this.APISDocument = apisDocument;
    };
    CheckinOrderService.prototype.GetScanAPISDocument = function () {
        return this.APISDocument;
    };
    CheckinOrderService.prototype.SetCountry = function (country) {
        this.CountryList = country;
    };
    CheckinOrderService.prototype.GetCountry = function () {
        return this.CountryList;
    };
    CheckinOrderService.prototype.SetPassenger = function (passengerDetails) {
        this.PassengerDetails = passengerDetails;
    };
    CheckinOrderService.prototype.GetPassenger = function () {
        return this.PassengerDetails;
    };
    CheckinOrderService.prototype.SetIsWaitlisted = function (isWaitlist) {
        this.IsWaitListed = isWaitlist;
    };
    CheckinOrderService.prototype.GetIsWaitlisted = function () {
        return this.IsWaitListed;
    };
    CheckinOrderService.prototype.SetSecurityDocument = function (apisDocument) {
        this.APISDocumentDetails = apisDocument;
    };
    CheckinOrderService.prototype.GetSecurityDocument = function () {
        return this.APISDocumentDetails;
    };
    CheckinOrderService.prototype.SetSelectedPassenger = function (selectedPassenger) {
        this.SelectedPassenger = selectedPassenger;
    };
    CheckinOrderService.prototype.GetSelectedPassenger = function () {
        return this.SelectedPassenger;
    };
    CheckinOrderService.prototype.SetAPISPassengerList = function (apisPassenger) {
        this.APISPassenger = apisPassenger;
    };
    CheckinOrderService.prototype.GetAPISPassengerList = function () {
        return this.APISPassenger;
    };
    CheckinOrderService.prototype.SetSecurityPassengerList = function (securityPassenger) {
        this.SecurityPassenger = securityPassenger;
    };
    CheckinOrderService.prototype.GetSecurityPassengerList = function () {
        return this.SecurityPassenger;
    };
    CheckinOrderService.prototype.SetDocumentType = function (documentType) {
        this.DocumentType = documentType;
    };
    CheckinOrderService.prototype.GetDocumentType = function () {
        return this.DocumentType;
    };
    CheckinOrderService.prototype.SetDocumentTypeList = function (documentTypeList) {
        this.DocumentTypeList = documentTypeList;
    };
    CheckinOrderService.prototype.GetDocumentTypeList = function () {
        return this.DocumentTypeList;
    };
    CheckinOrderService.prototype.SetADCByPassNameList = function (ByPass) {
        this.ADCByPass = ByPass;
    };
    CheckinOrderService.prototype.GetADCByPassNameList = function () {
        return this.ADCByPass;
    };
    CheckinOrderService.prototype.SetADCByPassList = function (ByPassList) {
        this.ADCByPassList = ByPassList;
    };
    CheckinOrderService.prototype.GetADCByPassList = function () {
        return this.ADCByPassList;
    };
    CheckinOrderService.prototype.SetFlightDetails = function (flightDetails) {
        this.FlightDetails = flightDetails;
    };
    CheckinOrderService.prototype.GetFlightDetails = function () {
        return this.FlightDetails;
    };
    CheckinOrderService.prototype.SetMultiSegmentPax = function (multiSegmentPax) {
        this.MultiSegmentPax = multiSegmentPax;
    };
    CheckinOrderService.prototype.GetMultiSegmentPax = function () {
        return this.MultiSegmentPax;
    };
    CheckinOrderService.prototype.SetTier = function (ticket) {
        this.Ticket = ticket;
    };
    CheckinOrderService.prototype.GetTier = function () {
        return this.Ticket;
    };
    CheckinOrderService.prototype.SetInventory = function (inventory) {
        this.Inventory = inventory;
    };
    CheckinOrderService.prototype.GetInventory = function () {
        return this.Inventory;
    };
    CheckinOrderService.prototype.SetInbound = function (inbound) {
        this.Inbound = inbound;
    };
    CheckinOrderService.prototype.GetInbound = function () {
        return this.Inbound;
    };
    CheckinOrderService.prototype.SetOutbound = function (outbound) {
        this.Outbound = outbound;
    };
    CheckinOrderService.prototype.GetOutbound = function () {
        return this.Outbound;
    };
    CheckinOrderService.prototype.SetFQTV = function (fqtv) {
        this.FQTV = fqtv;
    };
    CheckinOrderService.prototype.GetFQTV = function () {
        return this.FQTV;
    };
    CheckinOrderService.prototype.SetStatus = function (flightStatus) {
        this.FlightStatus = flightStatus;
    };
    CheckinOrderService.prototype.GetStatus = function () {
        return this.FlightStatus;
    };
    CheckinOrderService.prototype.SetUserProfile = function (profileData) {
        this.ProfileData = profileData;
    };
    CheckinOrderService.prototype.GetUserProfile = function () {
        return this.ProfileData;
    };
    CheckinOrderService.prototype.SetPassengerETicket = function (passengerDetails) {
        this.PassengerETicketDetails = passengerDetails;
    };
    CheckinOrderService.prototype.GetPassengerETicket = function () {
        return this.PassengerETicketDetails;
    };
    CheckinOrderService.prototype.SetBaggagecatalog = function (baggagecatalog) {
        this.Baggagecatalog = baggagecatalog;
    };
    CheckinOrderService.prototype.GetBaggagecatalog = function () {
        return this.Baggagecatalog;
    };
    CheckinOrderService.prototype.SetBagsToPrice = function (bagsToPrice) {
        this.BagsToPrice = bagsToPrice;
    };
    CheckinOrderService.prototype.GetBagsToPrice = function () {
        return this.BagsToPrice;
    };
    CheckinOrderService.prototype.SetStandardProducts = function (standardProducts) {
        this.StandardProducts = standardProducts;
    };
    CheckinOrderService.prototype.GetStandardProducts = function () {
        return this.StandardProducts;
    };
    CheckinOrderService.prototype.SetCatalogProducts = function (catalogProducts) {
        this.CatalogProducts = catalogProducts;
    };
    CheckinOrderService.prototype.GetCatalogProducts = function () {
        return this.CatalogProducts;
    };
    CheckinOrderService.prototype.GetSegmentDetail = function () {
        return this.SegmentDetail;
    };
    CheckinOrderService.prototype.SetSegmentDetail = function (segmentDetail) {
        this.SegmentDetail = segmentDetail;
    };
    CheckinOrderService.prototype.GetDevicePrinterDeatils = function () {
        return this.PrinterInformation;
    };
    CheckinOrderService.prototype.SetDevicePrinterDeatils = function (printerInfo) {
        this.PrinterInformation = printerInfo;
    };
    CheckinOrderService.prototype.SetDateFormat = function (dateFormat) {
        this.DateFormat = dateFormat;
    };
    CheckinOrderService.prototype.GetDateFormat = function () {
        return this.DateFormat;
    };
    CheckinOrderService.prototype.SetLicenseKey = function (licensekey) {
        this.LicenseKey = licensekey;
    };
    CheckinOrderService.prototype.GetLicenseKey = function () {
        return this.LicenseKey;
    };
    CheckinOrderService.prototype.setCompensationFQTVStatusDetails = function (FQTVStatus) {
        this.CompensationFQTVStatusList = FQTVStatus;
    };
    CheckinOrderService.prototype.getCompensationFQTVStatusDetails = function () {
        return this.CompensationFQTVStatusList;
    };
    CheckinOrderService.prototype.setFlightHeaderInfo = function (HeaderInfo) {
        this.FlightHeaderInfo = HeaderInfo;
    };
    CheckinOrderService.prototype.getFlightHeaderInfo = function () {
        return this.FlightHeaderInfo;
    };
    CheckinOrderService.prototype.setSelectSegementHeaderInfo = function (flightInfo) {
        this.FlightHeaderInfoOrderId = flightInfo;
    };
    CheckinOrderService.prototype.getSelectSegementHeaderInfo = function () {
        return this.FlightHeaderInfoOrderId;
    };
    CheckinOrderService.prototype.setIssueCompensation = function (comppaxlist) {
        this.CompensationPaxList = comppaxlist;
    };
    CheckinOrderService.prototype.getIssueCompensation = function () {
        return this.CompensationPaxList;
    };
    CheckinOrderService.prototype.setCompensationPaxList = function (paxList) {
        this.CompensationPassengerList = paxList;
    };
    CheckinOrderService.prototype.getCompensationPaxList = function () {
        return this.CompensationPassengerList;
    };
    CheckinOrderService.prototype.setBreCompPaxList = function (pax) {
        this.BreCompPax = pax;
    };
    CheckinOrderService.prototype.getBreCompPaxList = function () {
        return this.BreCompPax;
    };
    CheckinOrderService.prototype.SetCurrency = function (currency) {
        this.Currency = currency;
    };
    CheckinOrderService.prototype.GetCurrency = function () {
        return this.Currency;
    };
    CheckinOrderService.prototype.SetAgentProfileList = function (profile) {
        this.AgentProfileList = profile;
    };
    CheckinOrderService.prototype.GetAgentProfileList = function () {
        return this.AgentProfileList;
    };
    CheckinOrderService.prototype.SetUserPointofSale = function (pointOfSale) {
        this.PointOfSale = pointOfSale;
    };
    CheckinOrderService.prototype.GetUserPointofSale = function () {
        return this.PointOfSale;
    };
    CheckinOrderService.prototype.SetDeliverDetails = function (printerdetails) {
        this.DeliveryDetails = printerdetails;
    };
    CheckinOrderService.prototype.GetDeliveryDetails = function () {
        return this.DeliveryDetails;
    };
    CheckinOrderService.prototype.SetStartTime = function (startTime) {
        this.StartTime = startTime;
    };
    CheckinOrderService.prototype.GetStartTime = function () {
        return this.StartTime;
    };
    CheckinOrderService.prototype.SetStartupTable = function (table) {
        this.StartUpTable = table;
    };
    CheckinOrderService.prototype.GetStartupTable = function () {
        return this.StartUpTable;
    };
    CheckinOrderService.prototype.SetAdditionalDocuments = function (data) {
        this.AdditionalDocuments = data;
    };
    CheckinOrderService.prototype.GetAdditionalDocuments = function () {
        return this.AdditionalDocuments;
    };
    CheckinOrderService.prototype.setCompensationList = function (compensationlist) {
        this.CompensationList = compensationlist;
    };
    CheckinOrderService.prototype.getCompensationList = function () {
        return this.CompensationList;
    };
    CheckinOrderService.prototype.setCompensationFlightDetails = function (flightinfo) {
        this.CompensationFlightInfo = flightinfo;
    };
    CheckinOrderService.prototype.getCompensationFlightDetails = function () {
        return this.CompensationFlightInfo;
    };
    CheckinOrderService.prototype.setCompensationOrderDeatils = function (OrderDetails) {
        this.CompensationOrderList = OrderDetails;
    };
    CheckinOrderService.prototype.getCompensationOrderDeatils = function () {
        return this.CompensationOrderList;
    };
    CheckinOrderService.prototype.getAgentPrivilage = function () {
        return this.AgentPrivilage;
    };
    CheckinOrderService.prototype.setAgentPrivilage = function (privilage) {
        this.AgentPrivilage = privilage;
    };
    CheckinOrderService.prototype.GetAdultSecurityData = function () {
        return this.AdtSecurityData;
    };
    CheckinOrderService.prototype.SetAdultSecurityData = function (data) {
        this.AdtSecurityData = data;
    };
    CheckinOrderService.prototype.setCityList = function (data) {
        this.CityList = data;
    };
    CheckinOrderService.prototype.getCityList = function () {
        return this.CityList;
    };
    CheckinOrderService.prototype.SetPassengerTypeService = function (paxList) {
        this.PassengerTypeList = paxList;
    };
    CheckinOrderService.prototype.GetPassengerTypeService = function () {
        return this.PassengerTypeList;
    };
    CheckinOrderService.prototype.SetResidentCard = function (segment) {
        this.SegmentPax = segment;
    };
    CheckinOrderService.prototype.GetResidentCard = function () {
        return this.SegmentPax;
    };
    CheckinOrderService.prototype.SetWorkStation = function (workStationDetails) {
        this.WorkStationDetails = workStationDetails;
    };
    CheckinOrderService.prototype.GetWorkingStation = function () {
        return this.WorkStationDetails;
    };
    CheckinOrderService.prototype.GetBagTag = function () {
        return this.GetBagTags;
    };
    CheckinOrderService.prototype.SetBagTag = function (bagtag) {
        this.GetBagTags = bagtag;
    };
    CheckinOrderService.prototype.SetSeatMap = function (seatMap) {
        this.Seatmap = seatMap;
    };
    CheckinOrderService.prototype.GetSeatMap = function () {
        return this.Seatmap;
    };
    CheckinOrderService = __decorate([
        core_1.Injectable()
    ], CheckinOrderService);
    return CheckinOrderService;
}());
exports.CheckinOrderService = CheckinOrderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tpbm9yZGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjaGVja2lub3JkZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHNDQUFtRjtBQVVuRjtJQURBO1FBcUJXLGVBQVUsR0FBUSxvQkFBb0IsQ0FBQztRQUN2QyxlQUFVLEdBQVEseUVBQXlFLENBQUM7UUFnQzVGLGVBQVUsR0FBMkMsRUFBRSxDQUFDO0lBb1luRSxDQUFDO0lBL1hHLDZDQUFlLEdBQWYsVUFBZ0IsWUFBMEI7UUFDdEMsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7SUFDckMsQ0FBQztJQUNELDZDQUFlLEdBQWY7UUFDSSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDN0IsQ0FBQztJQUVELGlEQUFtQixHQUFuQixVQUFvQixZQUEwQjtRQUMxQyxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztJQUNyQyxDQUFDO0lBQ0QsaURBQW1CLEdBQW5CO1FBQ0ksT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzdCLENBQUM7SUFFRCx3Q0FBVSxHQUFWLFVBQVcsT0FBcUM7UUFDNUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7SUFDL0IsQ0FBQztJQUVELHdDQUFVLEdBQVY7UUFDSSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDNUIsQ0FBQztJQUVELDBDQUFZLEdBQVosVUFBYSxnQkFBa0M7UUFDM0MsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO0lBQzdDLENBQUM7SUFFRCwwQ0FBWSxHQUFaO1FBQ0ksT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDakMsQ0FBQztJQUVELDZDQUFlLEdBQWYsVUFBZ0IsVUFBbUI7UUFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUM7SUFDbkMsQ0FBQztJQUVELDZDQUFlLEdBQWY7UUFDSSxPQUFPLElBQUksQ0FBQyxZQUFZLENB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Q0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO0lBQzlCLENBQUM7SUFDRCw2Q0FBZSxHQUFmO1FBQ0ksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFDRCw0Q0FBYyxHQUFkLFVBQWUsa0JBQXdCO1FBQ25DLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztJQUNqRCxDQUFDO0lBQ0QsK0NBQWlCLEdBQWpCO1FBQ0ksT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUM7SUFDbkMsQ0FBQztJQUVELHVDQUFTLEdBQVQ7UUFDSSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUNELHVDQUFTLEdBQVQsVUFBVSxNQUFVO1FBQ2hCLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO0lBQzdCLENBQUM7SUFDRCx3Q0FBVSxHQUFWLFVBQVcsT0FBYTtRQUNwQixJQUFJLENBQUMsT0FBTyxHQUFFLE9BQU8sQ0FBQztJQUMxQixDQUFDO0lBQ0Qsd0NBQVUsR0FBVjtRQUNJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBeGJRLG1CQUFtQjtRQUQvQixpQkFBVSxFQUFFO09BQ0EsbUJBQW1CLENBeWIvQjtJQUFELDBCQUFDO0NBQUEsQUF6YkQsSUF5YkM7QUF6Ylksa0RBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiLy9hbmd1bGFyICYgbmF0aXZlc2NyaXB0IHJlZmVyZW5jZXNcbmltcG9ydCAqIGFzIGFwcGludGVyZmFjZSBmcm9tIFwiLi4vLi4vc2hhcmVkL2ludGVyZmFjZS9pbmRleFwiO1xuaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3RhYmxlLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCAqIGFzIEFwcGxpY2F0aW9uU2V0dGluZ3MgZnJvbSBcImFwcGxpY2F0aW9uLXNldHRpbmdzXCI7XG5cbi8vYXBwIHJlZmVyZW5jZXNcbmltcG9ydCB7IEFQSVNEb2N1bWVudCwgT3JkZXIsIFNlY3VyaXR5VmFsaWRhdGlvbiwgQ291bnRyeUNvbGxlY3Rpb24sIEludmVudG9yeSB9IGZyb20gJy4uL21vZGVsL2luZGV4JztcbmltcG9ydCB7IFBheFRlbXBsYXRlLCBBY2NvbnRQcm9maWxlTW9kZWwgfSBmcm9tICcuLi9pbnRlcmZhY2UvaW5kZXgnO1xuXG5cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENoZWNraW5PcmRlclNlcnZpY2Uge1xuXG4gICAgcHVibGljIEFQSVNEb2N1bWVudDogQVBJU0RvY3VtZW50O1xuICAgIHB1YmxpYyBDb3VudHJ5TGlzdDogQ291bnRyeUNvbGxlY3Rpb24uQ29sbGVjdGlvbjtcbiAgICBwdWJsaWMgUGFzc2VuZ2VyRGV0YWlsczogT3JkZXIuUm9vdE9iamVjdDtcbiAgICBwdWJsaWMgQVBJU0RvY3VtZW50RGV0YWlsczogYW55O1xuICAgIHB1YmxpYyBQYXNzZW5nZXJFVGlja2V0RGV0YWlsczogT3JkZXIuUm9vdE9iamVjdDtcbiAgICBwdWJsaWMgVGlja2V0OiBhbnk7XG4gICAgcHVibGljIEludmVudG9yeTogYW55O1xuICAgIHB1YmxpYyBJbmJvdW5kOiBhbnk7XG4gICAgcHVibGljIE91dGJvdW5kOiBhbnk7XG4gICAgcHVibGljIEZRVFY6IGFueTtcbiAgICBwdWJsaWMgRmxpZ2h0U3RhdHVzOiBhbnk7XG4gICAgcHVibGljIEJhZ2dhZ2VjYXRhbG9nOiBhbnk7XG4gICAgcHVibGljIEJhZ3NUb1ByaWNlOiBhbnk7XG4gICAgcHVibGljIFN0YW5kYXJkUHJvZHVjdHM6IGFueVtdO1xuICAgIHB1YmxpYyBDYXRhbG9nUHJvZHVjdHM6IGFueVtdO1xuICAgIHB1YmxpYyBTZWdtZW50RGV0YWlsOiBhbnk7XG4gICAgcHVibGljIFByaW50ZXJJbmZvcm1hdGlvbjogYW55O1xuICAgIHB1YmxpYyBQcm9maWxlRGF0YTogYW55O1xuICAgIHB1YmxpYyBEYXRlRm9ybWF0OiBhbnkgPSBcIlNlbGVjdCBEYXRlIEZvcm1hdFwiO1xuICAgIHB1YmxpYyBMaWNlbnNlS2V5OiBhbnkgPSBcIkdaUjVSSTY3LUZaN05SR0JVLU9KQk5QTTRVLUtHRUtMWEVWLVJZTlVDTjJSLVJDUzVaRk1PLUROQVRQNElELU0yNDZCRUhZXCI7XG4gICAgcHVibGljIFNlbGVjdGVkUGFzc2VuZ2VyOiBhbnk7XG4gICAgcHVibGljIEFQSVNQYXNzZW5nZXI6IGFueTtcbiAgICBwdWJsaWMgU2VjdXJpdHlQYXNzZW5nZXI6YW55O1xuICAgIHB1YmxpYyBEb2N1bWVudFR5cGU6IGFueTtcbiAgICBwdWJsaWMgRG9jdW1lbnRUeXBlTGlzdDogYW55W107XG4gICAgcHVibGljIEFEQ0J5UGFzcyA6IGFueTtcbiAgICBwdWJsaWMgQURDQnlQYXNzTGlzdDphbnlbXTtcbiAgICBwdWJsaWMgRmxpZ2h0RGV0YWlsczogYW55O1xuICAgIHB1YmxpYyBNdWx0aVNlZ21lbnRQYXg6IGFueTtcbiAgICBwdWJsaWMgRmxpZ2h0SGVhZGVySW5mbyA6IGFueTtcbiAgICBwdWJsaWMgQ29tcGVuc2F0aW9uTGlzdDphbnk7XG4gICAgcHVibGljIENvbXBlbnNhdGlvbkZsaWdodEluZm8gOiBhbnk7XG4gICAgcHVibGljIENvbXBlbnNhdGlvbk9yZGVyTGlzdCA6YW55O1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25GUVRWU3RhdHVzTGlzdCA6YW55W107XG4gICAgcHVibGljIEZsaWdodEhlYWRlckluZm9PcmRlcklkIDogYW55O1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25QYXhMaXN0IDogYW55O1xuICAgIHB1YmxpYyBDb21wZW5zYXRpb25QYXNzZW5nZXJMaXN0OiBhbnk7XG4gICAgcHVibGljIEJyZUNvbXBQYXggOiBhbnk7XG4gICAgcHVibGljIFByb2ZpbGVBcnJheTogYW55O1xuICAgIHB1YmxpYyBDdXJyZW5jeTogYW55O1xuICAgIHB1YmxpYyBQb2ludE9mU2FsZTogYW55O1xuICAgIHB1YmxpYyBEZWxpdmVyeURldGFpbHM6IGFueTtcbiAgICBwdWJsaWMgU3RhcnRUaW1lOmFueTtcbiAgICBwdWJsaWMgU3RhcnRVcFRhYmxlOmFueTtcbiAgICBwdWJsaWMgQWRkaXRpb25hbERvY3VtZW50cztcbiAgICBwdWJsaWMgQWdlbnRQcml2aWxhZ2U6IGFueTtcbiAgICBwdWJsaWMgQWR0U2VjdXJpdHlEYXRhOmFueTtcbiAgICBwdWJsaWMgQ2l0eUxpc3QgOiBhbnk7XG4gICAgcHVibGljIFBhc3NlbmdlclR5cGVMaXN0IDogYW55O1xuICAgIHB1YmxpYyBTZWdtZW50UGF4IDogYW55O1xuICAgIHB1YmxpYyBXb3JrU3RhdGlvbkRldGFpbHMgOmFueTtcbiAgICBwdWJsaWMgR2V0QmFnVGFnczpBcnJheTxhcHBpbnRlcmZhY2UuQmFndGFnLlBhc3Nlbmdlckxpc3QgPj1bXTtcbiAgICBwdWJsaWMgSXNXYWl0TGlzdGVkOiBib29sZWFuO1xuICAgIHB1YmxpYyBBZ2VudFByb2ZpbGVMaXN0OmFueTtcbiAgICBwdWJsaWMgU2VhdG1hcCA6IGFueTtcblxuICAgIFNldEFQSVNEb2N1bWVudChhcGlzRG9jdW1lbnQ6IEFQSVNEb2N1bWVudCkge1xuICAgICAgICB0aGlzLkFQSVNEb2N1bWVudCA9IGFwaXNEb2N1bWVudDtcbiAgICB9XG4gICAgR2V0QVBJU0RvY3VtZW50KCk6IEFQSVNEb2N1bWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLkFQSVNEb2N1bWVudDtcbiAgICB9XG5cbiAgICBTZXRTY2FuQVBJU0RvY3VtZW50KGFwaXNEb2N1bWVudDogQVBJU0RvY3VtZW50KSB7XG4gICAgICAgIHRoaXMuQVBJU0RvY3VtZW50ID0gYXBpc0RvY3VtZW50O1xuICAgIH1cbiAgICBHZXRTY2FuQVBJU0RvY3VtZW50KCk6IEFQSVNEb2N1bWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLkFQSVNEb2N1bWVudDtcbiAgICB9XG5cbiAgICBTZXRDb3VudHJ5KGNvdW50cnk6IENvdW50cnlDb2xsZWN0aW9uLkNvbGxlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5Db3VudHJ5TGlzdCA9IGNvdW50cnk7XG4gICAgfVxuXG4gICAgR2V0Q291bnRyeSgpOiBDb3VudHJ5Q29sbGVjdGlvbi5Db2xsZWN0aW9uIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQ291bnRyeUxpc3Q7XG4gICAgfVxuXG4gICAgU2V0UGFzc2VuZ2VyKHBhc3NlbmdlckRldGFpbHM6IE9yZGVyLlJvb3RPYmplY3QpIHtcbiAgICAgICAgdGhpcy5QYXNzZW5nZXJEZXRhaWxzID0gcGFzc2VuZ2VyRGV0YWlscztcbiAgICB9XG5cbiAgICBHZXRQYXNzZW5nZXIoKTogT3JkZXIuUm9vdE9iamVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLlBhc3NlbmdlckRldGFpbHM7XG4gICAgfVxuXG4gICAgU2V0SXNXYWl0bGlzdGVkKGlzV2FpdGxpc3Q6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5Jc1dhaXRMaXN0ZWQgPSBpc1dhaXRsaXN0O1xuICAgIH1cblxuICAgIEdldElzV2FpdGxpc3RlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuSXNXYWl0TGlzdGVkO1xuICAgIH1cblxuICAgIFNldFNlY3VyaXR5RG9jdW1lbnQoYXBpc0RvY3VtZW50OiBhbnkpIHtcbiAgICAgICAgdGhpcy5BUElTRG9jdW1lbnREZXRhaWxzID0gYXBpc0RvY3VtZW50O1xuICAgIH1cblxuICAgIEdldFNlY3VyaXR5RG9jdW1lbnQoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQVBJU0RvY3VtZW50RGV0YWlscztcbiAgICB9XG5cbiAgICBTZXRTZWxlY3RlZFBhc3NlbmdlcihzZWxlY3RlZFBhc3NlbmdlcjogYW55KSB7XG4gICAgICAgIHRoaXMuU2VsZWN0ZWRQYXNzZW5nZXIgPSBzZWxlY3RlZFBhc3NlbmdlcjtcbiAgICB9XG5cbiAgICBHZXRTZWxlY3RlZFBhc3NlbmdlcigpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5TZWxlY3RlZFBhc3NlbmdlcjtcbiAgICB9XG5cbiAgICBTZXRBUElTUGFzc2VuZ2VyTGlzdChhcGlzUGFzc2VuZ2VyOiBhbnkpIHtcbiAgICAgICAgdGhpcy5BUElTUGFzc2VuZ2VyID0gYXBpc1Bhc3NlbmdlcjtcbiAgICB9XG5cbiAgICBHZXRBUElTUGFzc2VuZ2VyTGlzdCgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5BUElTUGFzc2VuZ2VyO1xuICAgIH1cblxuICAgIFNldFNlY3VyaXR5UGFzc2VuZ2VyTGlzdChzZWN1cml0eVBhc3NlbmdlcjogYW55KSB7XG4gICAgICAgIHRoaXMuU2VjdXJpdHlQYXNzZW5nZXIgPSBzZWN1cml0eVBhc3NlbmdlcjtcbiAgICB9XG5cbiAgICBHZXRTZWN1cml0eVBhc3Nlbmdlckxpc3QoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuU2VjdXJpdHlQYXNzZW5nZXI7XG4gICAgfVxuXG4gICAgU2V0RG9jdW1lbnRUeXBlKGRvY3VtZW50VHlwZTogYW55KSB7XG4gICAgICAgIHRoaXMuRG9jdW1lbnRUeXBlID0gZG9jdW1lbnRUeXBlO1xuICAgIH1cblxuICAgIEdldERvY3VtZW50VHlwZSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5Eb2N1bWVudFR5cGU7XG4gICAgfVxuXG4gICAgU2V0RG9jdW1lbnRUeXBlTGlzdChkb2N1bWVudFR5cGVMaXN0OiBhbnlbXSkge1xuICAgICAgICB0aGlzLkRvY3VtZW50VHlwZUxpc3QgPSBkb2N1bWVudFR5cGVMaXN0O1xuICAgIH1cblxuICAgIEdldERvY3VtZW50VHlwZUxpc3QoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRG9jdW1lbnRUeXBlTGlzdDtcbiAgICB9XG5cbiAgICBTZXRBRENCeVBhc3NOYW1lTGlzdChCeVBhc3M6IGFueSkge1xuICAgICAgICB0aGlzLkFEQ0J5UGFzcyA9IEJ5UGFzcztcbiAgICB9XG5cbiAgICBHZXRBRENCeVBhc3NOYW1lTGlzdCgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5BRENCeVBhc3M7XG4gICAgfVxuXG4gICAgU2V0QURDQnlQYXNzTGlzdChCeVBhc3NMaXN0OiBhbnlbXSkge1xuICAgICAgICB0aGlzLkFEQ0J5UGFzc0xpc3QgPSBCeVBhc3NMaXN0O1xuICAgIH1cblxuICAgIEdldEFEQ0J5UGFzc0xpc3QoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQURDQnlQYXNzTGlzdDtcbiAgICB9XG5cbiAgICBTZXRGbGlnaHREZXRhaWxzKGZsaWdodERldGFpbHM6IGFueSkge1xuICAgICAgICB0aGlzLkZsaWdodERldGFpbHMgPSBmbGlnaHREZXRhaWxzO1xuICAgIH1cblxuICAgIEdldEZsaWdodERldGFpbHMoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRmxpZ2h0RGV0YWlscztcbiAgICB9XG5cbiAgICBTZXRNdWx0aVNlZ21lbnRQYXgobXVsdGlTZWdtZW50UGF4OiBhbnkpIHtcbiAgICAgICAgdGhpcy5NdWx0aVNlZ21lbnRQYXggPSBtdWx0aVNlZ21lbnRQYXg7XG4gICAgfVxuXG4gICAgR2V0TXVsdGlTZWdtZW50UGF4KCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLk11bHRpU2VnbWVudFBheDtcbiAgICB9XG5cbiAgICBTZXRUaWVyKHRpY2tldDogYW55KSB7XG4gICAgICAgIHRoaXMuVGlja2V0ID0gdGlja2V0O1xuICAgIH1cblxuICAgIEdldFRpZXIoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuVGlja2V0O1xuICAgIH1cblxuICAgIFNldEludmVudG9yeShpbnZlbnRvcnk6IGFueSkge1xuICAgICAgICB0aGlzLkludmVudG9yeSA9IGludmVudG9yeTtcbiAgICB9XG5cbiAgICBHZXRJbnZlbnRvcnkoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuSW52ZW50b3J5O1xuICAgIH1cblxuICAgIFNldEluYm91bmQoaW5ib3VuZDogYW55KSB7XG4gICAgICAgIHRoaXMuSW5ib3VuZCA9IGluYm91bmQ7XG4gICAgfVxuXG4gICAgR2V0SW5ib3VuZCgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5JbmJvdW5kO1xuICAgIH1cblxuICAgIFNldE91dGJvdW5kKG91dGJvdW5kOiBhbnkpIHtcbiAgICAgICAgdGhpcy5PdXRib3VuZCA9IG91dGJvdW5kO1xuICAgIH1cblxuICAgIEdldE91dGJvdW5kKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLk91dGJvdW5kO1xuICAgIH1cblxuICAgIFNldEZRVFYoZnF0djogYW55KSB7XG4gICAgICAgIHRoaXMuRlFUViA9IGZxdHY7XG4gICAgfVxuXG4gICAgR2V0RlFUVigpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5GUVRWO1xuICAgIH1cblxuICAgIFNldFN0YXR1cyhmbGlnaHRTdGF0dXM6IGFueSkge1xuXG4gICAgICAgIHRoaXMuRmxpZ2h0U3RhdHVzID0gZmxpZ2h0U3RhdHVzO1xuICAgIH1cbiAgICBHZXRTdGF0dXMoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuRmxpZ2h0U3RhdHVzO1xuICAgIH1cblxuICAgIFNldFVzZXJQcm9maWxlKHByb2ZpbGVEYXRhOiBhbnkpIHtcbiAgICAgICAgdGhpcy5Qcm9maWxlRGF0YSA9IHByb2ZpbGVEYXRhO1xuICAgIH1cblxuICAgIEdldFVzZXJQcm9maWxlKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLlByb2ZpbGVEYXRhO1xuICAgIH1cblxuICAgIFNldFBhc3NlbmdlckVUaWNrZXQocGFzc2VuZ2VyRGV0YWlsczogT3JkZXIuUm9vdE9iamVjdCkge1xuICAgICAgICB0aGlzLlBhc3NlbmdlckVUaWNrZXREZXRhaWxzID0gcGFzc2VuZ2VyRGV0YWlscztcbiAgICB9XG5cbiAgICBHZXRQYXNzZW5nZXJFVGlja2V0KCk6IE9yZGVyLlJvb3RPYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5QYXNzZW5nZXJFVGlja2V0RGV0YWlscztcbiAgICB9XG4gICAgU2V0QmFnZ2FnZWNhdGFsb2coYmFnZ2FnZWNhdGFsb2c6IGFueSkge1xuICAgICAgICB0aGlzLkJhZ2dhZ2VjYXRhbG9nID0gYmFnZ2FnZWNhdGFsb2c7XG4gICAgfVxuICAgIEdldEJhZ2dhZ2VjYXRhbG9nKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLkJhZ2dhZ2VjYXRhbG9nO1xuICAgIH1cbiAgICBTZXRCYWdzVG9QcmljZShiYWdzVG9QcmljZTogYW55KSB7XG4gICAgICAgIHRoaXMuQmFnc1RvUHJpY2UgPSBiYWdzVG9QcmljZTtcbiAgICB9XG4gICAgR2V0QmFnc1RvUHJpY2UoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQmFnc1RvUHJpY2U7XG4gICAgfVxuICAgIFNldFN0YW5kYXJkUHJvZHVjdHMoc3RhbmRhcmRQcm9kdWN0czogYW55W10pIHtcbiAgICAgICAgdGhpcy5TdGFuZGFyZFByb2R1Y3RzID0gc3RhbmRhcmRQcm9kdWN0cztcbiAgICB9XG4gICAgR2V0U3RhbmRhcmRQcm9kdWN0cygpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLlN0YW5kYXJkUHJvZHVjdHM7XG4gICAgfVxuXG4gICAgU2V0Q2F0YWxvZ1Byb2R1Y3RzKGNhdGFsb2dQcm9kdWN0czogYW55W10pIHtcbiAgICAgICAgdGhpcy5DYXRhbG9nUHJvZHVjdHMgPSBjYXRhbG9nUHJvZHVjdHM7XG4gICAgfVxuICAgIEdldENhdGFsb2dQcm9kdWN0cygpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLkNhdGFsb2dQcm9kdWN0cztcbiAgICB9XG5cbiAgICBHZXRTZWdtZW50RGV0YWlsKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLlNlZ21lbnREZXRhaWw7XG4gICAgfVxuICAgIFNldFNlZ21lbnREZXRhaWwoc2VnbWVudERldGFpbDogYW55KSB7XG4gICAgICAgIHRoaXMuU2VnbWVudERldGFpbCA9IHNlZ21lbnREZXRhaWw7XG4gICAgfVxuICAgIEdldERldmljZVByaW50ZXJEZWF0aWxzKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLlByaW50ZXJJbmZvcm1hdGlvbjtcbiAgICB9XG4gICAgU2V0RGV2aWNlUHJpbnRlckRlYXRpbHMocHJpbnRlckluZm86IGFueSkge1xuICAgICAgICB0aGlzLlByaW50ZXJJbmZvcm1hdGlvbiA9IHByaW50ZXJJbmZvO1xuICAgIH1cbiAgICBTZXREYXRlRm9ybWF0KGRhdGVGb3JtYXQ6IGFueSkge1xuICAgICAgICB0aGlzLkRhdGVGb3JtYXQgPSBkYXRlRm9ybWF0O1xuICAgIH1cbiAgICBHZXREYXRlRm9ybWF0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5EYXRlRm9ybWF0O1xuICAgIH1cbiAgICBTZXRMaWNlbnNlS2V5KGxpY2Vuc2VrZXk6IGFueSkge1xuICAgICAgICB0aGlzLkxpY2Vuc2VLZXkgPSBsaWNlbnNla2V5XG4gICAgfVxuICAgIEdldExpY2Vuc2VLZXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkxpY2Vuc2VLZXk7XG4gICAgfVxuXG4gICAgc2V0Q29tcGVuc2F0aW9uRlFUVlN0YXR1c0RldGFpbHMoRlFUVlN0YXR1cyA6YW55W10pe1xuICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbkZRVFZTdGF0dXNMaXN0ID0gRlFUVlN0YXR1cztcbiAgICB9XG4gICAgZ2V0Q29tcGVuc2F0aW9uRlFUVlN0YXR1c0RldGFpbHMoKXtcbiAgICAgICAgcmV0dXJuICB0aGlzLkNvbXBlbnNhdGlvbkZRVFZTdGF0dXNMaXN0O1xuICAgIH1cbiAgICBzZXRGbGlnaHRIZWFkZXJJbmZvKEhlYWRlckluZm8pe1xuICAgICAgICB0aGlzLkZsaWdodEhlYWRlckluZm8gPSBIZWFkZXJJbmZvO1xuICAgIH1cbiAgICBnZXRGbGlnaHRIZWFkZXJJbmZvKCl7XG4gICAgICAgIHJldHVybiB0aGlzLkZsaWdodEhlYWRlckluZm87XG4gICAgfVxuICAgIHNldFNlbGVjdFNlZ2VtZW50SGVhZGVySW5mbyhmbGlnaHRJbmZvKXtcbiAgICAgICAgdGhpcy5GbGlnaHRIZWFkZXJJbmZvT3JkZXJJZCA9IGZsaWdodEluZm87XG4gICAgfVxuICAgIGdldFNlbGVjdFNlZ2VtZW50SGVhZGVySW5mbygpe1xuICAgICAgICByZXR1cm4gdGhpcy5GbGlnaHRIZWFkZXJJbmZvT3JkZXJJZDtcbiAgICB9XG4gICAgc2V0SXNzdWVDb21wZW5zYXRpb24oY29tcHBheGxpc3Qpe1xuICAgICAgICB0aGlzLkNvbXBlbnNhdGlvblBheExpc3QgPSBjb21wcGF4bGlzdDtcbiAgICB9XG4gICAgZ2V0SXNzdWVDb21wZW5zYXRpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuQ29tcGVuc2F0aW9uUGF4TGlzdDtcbiAgICB9XG4gICAgc2V0Q29tcGVuc2F0aW9uUGF4TGlzdChwYXhMaXN0KXtcbiAgICAgICAgdGhpcy5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0ID0gcGF4TGlzdDtcbiAgICB9XG4gICAgZ2V0Q29tcGVuc2F0aW9uUGF4TGlzdCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5Db21wZW5zYXRpb25QYXNzZW5nZXJMaXN0O1xuICAgIH1cbiAgICBzZXRCcmVDb21wUGF4TGlzdChwYXgpe1xuICAgICAgICB0aGlzLkJyZUNvbXBQYXggPSBwYXg7XG4gICAgfVxuICAgIGdldEJyZUNvbXBQYXhMaXN0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLkJyZUNvbXBQYXg7XG4gICAgfVxuXG4gICAgU2V0Q3VycmVuY3koY3VycmVuY3k6IGFueSkge1xuICAgICAgICB0aGlzLkN1cnJlbmN5ID0gY3VycmVuY3k7XG4gICAgfVxuICAgIEdldEN1cnJlbmN5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5DdXJyZW5jeTtcbiAgICB9XG4gICAgU2V0QWdlbnRQcm9maWxlTGlzdChwcm9maWxlOmFueSl7XG4gICAgICAgIHRoaXMuQWdlbnRQcm9maWxlTGlzdCA9IHByb2ZpbGU7XG4gICAgfVxuICAgIEdldEFnZW50UHJvZmlsZUxpc3QoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWdlbnRQcm9maWxlTGlzdDtcbiAgICB9XG4gICAgU2V0VXNlclBvaW50b2ZTYWxlKHBvaW50T2ZTYWxlKSB7XG4gICAgICAgIHRoaXMuUG9pbnRPZlNhbGUgPSBwb2ludE9mU2FsZTtcbiAgICB9XG4gICAgR2V0VXNlclBvaW50b2ZTYWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5Qb2ludE9mU2FsZTtcbiAgICB9XG4gICAgU2V0RGVsaXZlckRldGFpbHMocHJpbnRlcmRldGFpbHM6IGFueSkge1xuICAgICAgICB0aGlzLkRlbGl2ZXJ5RGV0YWlscyA9IHByaW50ZXJkZXRhaWxzO1xuICAgIH1cbiAgICBHZXREZWxpdmVyeURldGFpbHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkRlbGl2ZXJ5RGV0YWlscztcblxuICAgIH1cbiAgICBTZXRTdGFydFRpbWUoc3RhcnRUaW1lOmFueSl7XG4gICAgdGhpcy5TdGFydFRpbWUgPSBzdGFydFRpbWU7XG4gICAgfVxuICAgIEdldFN0YXJ0VGltZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5TdGFydFRpbWU7XG4gICAgfVxuXG4gICAgU2V0U3RhcnR1cFRhYmxlKHRhYmxlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5TdGFydFVwVGFibGUgPSB0YWJsZTtcbiAgICB9XG4gICAgR2V0U3RhcnR1cFRhYmxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5TdGFydFVwVGFibGU7XG4gICAgfVxuICAgIFNldEFkZGl0aW9uYWxEb2N1bWVudHMoZGF0YSl7XG4gICAgICAgIHRoaXMuQWRkaXRpb25hbERvY3VtZW50cyA9IGRhdGE7XG4gICAgfVxuICAgIEdldEFkZGl0aW9uYWxEb2N1bWVudHMoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWRkaXRpb25hbERvY3VtZW50cztcbiAgICB9XG4gICAgXG5cbiAgICBzZXRDb21wZW5zYXRpb25MaXN0KGNvbXBlbnNhdGlvbmxpc3QgOiBhbnkpe1xuICAgICAgICB0aGlzLkNvbXBlbnNhdGlvbkxpc3QgPSBjb21wZW5zYXRpb25saXN0O1xuICAgIH1cbiAgICBnZXRDb21wZW5zYXRpb25MaXN0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLkNvbXBlbnNhdGlvbkxpc3Q7XG4gICAgfVxuICAgIHNldENvbXBlbnNhdGlvbkZsaWdodERldGFpbHMoZmxpZ2h0aW5mbyA6IGFueSl7XG4gICAgICAgIHRoaXMuQ29tcGVuc2F0aW9uRmxpZ2h0SW5mbyA9IGZsaWdodGluZm87XG4gICAgfVxuICAgIGdldENvbXBlbnNhdGlvbkZsaWdodERldGFpbHMoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuQ29tcGVuc2F0aW9uRmxpZ2h0SW5mbztcbiAgICB9XG4gICAgc2V0Q29tcGVuc2F0aW9uT3JkZXJEZWF0aWxzKE9yZGVyRGV0YWlscyA6YW55KXtcbiAgICAgICAgdGhpcy5Db21wZW5zYXRpb25PcmRlckxpc3QgPSBPcmRlckRldGFpbHM7XG4gICAgfVxuICAgIGdldENvbXBlbnNhdGlvbk9yZGVyRGVhdGlscygpe1xuICAgICAgICByZXR1cm4gIHRoaXMuQ29tcGVuc2F0aW9uT3JkZXJMaXN0O1xuICAgIH1cbiAgICBnZXRBZ2VudFByaXZpbGFnZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5BZ2VudFByaXZpbGFnZTtcbiAgICB9XG4gICAgc2V0QWdlbnRQcml2aWxhZ2UoIHByaXZpbGFnZSA6IGFueSl7ICAgICAgICBcbiAgICAgICAgdGhpcy5BZ2VudFByaXZpbGFnZSA9IHByaXZpbGFnZTtcbiAgICB9XG4gICAgR2V0QWR1bHRTZWN1cml0eURhdGEoKXtcbiAgICAgICAgcmV0dXJuICB0aGlzLkFkdFNlY3VyaXR5RGF0YTsgICBcbiAgICB9XG4gICAgU2V0QWR1bHRTZWN1cml0eURhdGEoZGF0YTphbnkpe1xuICAgICAgICB0aGlzLkFkdFNlY3VyaXR5RGF0YSA9ZGF0YTtcblxuICAgIH1cbiAgICBzZXRDaXR5TGlzdChkYXRhICA6YW55KXtcbiAgICAgICAgdGhpcy5DaXR5TGlzdCA9IGRhdGE7XG4gICAgfVxuICAgIGdldENpdHlMaXN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5DaXR5TGlzdDtcbiAgICB9XG4gICAgU2V0UGFzc2VuZ2VyVHlwZVNlcnZpY2UocGF4TGlzdCA6IGFueSl7XG4gICAgICAgIHRoaXMuUGFzc2VuZ2VyVHlwZUxpc3QgPSBwYXhMaXN0O1xuICAgIH1cbiAgICBHZXRQYXNzZW5nZXJUeXBlU2VydmljZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5QYXNzZW5nZXJUeXBlTGlzdDtcbiAgICB9XG4gICAgU2V0UmVzaWRlbnRDYXJkKHNlZ21lbnQgOiBhbnkpe1xuICAgICAgICB0aGlzLlNlZ21lbnRQYXggPSBzZWdtZW50O1xuICAgIH1cbiAgICBHZXRSZXNpZGVudENhcmQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuU2VnbWVudFBheDtcbiAgICB9XG4gICAgU2V0V29ya1N0YXRpb24od29ya1N0YXRpb25EZXRhaWxzIDogYW55KXtcbiAgICAgICAgdGhpcy5Xb3JrU3RhdGlvbkRldGFpbHMgPSB3b3JrU3RhdGlvbkRldGFpbHM7XG4gICAgfVxuICAgIEdldFdvcmtpbmdTdGF0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLldvcmtTdGF0aW9uRGV0YWlscztcbiAgICB9XG5cbiAgICBHZXRCYWdUYWcoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuR2V0QmFnVGFncztcbiAgICB9XG4gICAgU2V0QmFnVGFnKGJhZ3RhZzphbnkpe1xuICAgICAgICB0aGlzLkdldEJhZ1RhZ3MgPSBiYWd0YWc7XG4gICAgfVxuICAgIFNldFNlYXRNYXAoc2VhdE1hcCA6IGFueSl7XG4gICAgICAgIHRoaXMuU2VhdG1hcCA9c2VhdE1hcDtcbiAgICB9XG4gICAgR2V0U2VhdE1hcCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5TZWF0bWFwO1xuICAgIH1cbn0iXX0=