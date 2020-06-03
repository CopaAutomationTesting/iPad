"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PaymentData;
(function (PaymentData) {
    var Segments = /** @class */ (function () {
        function Segments() {
            this.RPH = "";
            this.DepartureDateTime = null;
            this.ArrivalDateTime = null;
            this.Flight = "";
            this.OperatingFlight = null;
            this.Origin = null;
            this.Destination = null;
        }
        return Segments;
    }());
    PaymentData.Segments = Segments;
    var Origin = /** @class */ (function () {
        function Origin() {
            this.LocationCode = "";
        }
        return Origin;
    }());
    PaymentData.Origin = Origin;
    var Destination = /** @class */ (function () {
        function Destination() {
            this.LocationCode = "";
        }
        return Destination;
    }());
    PaymentData.Destination = Destination;
    var Passengers = /** @class */ (function () {
        function Passengers() {
            this.Firstname = "";
            this.Lastname = "";
            this.PassengerTypeCode = "";
            this.RPH = "";
        }
        return Passengers;
    }());
    PaymentData.Passengers = Passengers;
    var PaymentAddress = /** @class */ (function () {
        function PaymentAddress() {
            this.AddressLine = "";
            this.City = "";
            this.StateCode = "";
            this.PostalCode = "";
            this.CountryCode = "";
            this.CountryName = "";
        }
        return PaymentAddress;
    }());
    PaymentData.PaymentAddress = PaymentAddress;
    var Payment = /** @class */ (function () {
        function Payment() {
            this.Type = "CA";
            this.TransactionType = "Charge";
            this.Amount = "";
            this.CurrencyCode = "";
            this.CardCode = "";
            this.MaskedCardNumber = "";
            this.ApprovalCode = "";
            this.SecurityCode = "";
            this.ExpirationDateMMYY = "";
            this.CardHolderName = "";
            this.CardIssuerBankID = "";
            this.FirstName = "";
            this.LastName = "";
        }
        return Payment;
    }());
    PaymentData.Payment = Payment;
    var Email = /** @class */ (function () {
        function Email() {
            this.emailAddress = "noreply@hpe.com";
        }
        return Email;
    }());
    PaymentData.Email = Email;
    var ReceiptDelivery = /** @class */ (function () {
        function ReceiptDelivery() {
            this.gateway = "EMAIL";
            this.Name = "";
            this.phonenumber = "";
            this.email = [];
            this.LanguageID = null;
            this.printerAddress = "";
        }
        return ReceiptDelivery;
    }());
    PaymentData.ReceiptDelivery = ReceiptDelivery;
    var Services = /** @class */ (function () {
        function Services() {
            this.passengerRPH = "";
            this.SegmentRPH = [];
            this.currencyCode = "";
            this.amount = "";
            this.ticketNumber = "";
            this.EmdTaxes = [];
        }
        return Services;
    }());
    PaymentData.Services = Services;
    var SelectedService = /** @class */ (function () {
        function SelectedService() {
            this.RFISC_code = "";
            this.RFISC_subCode = "";
            this.SSRCode = null;
            this.commercialName = "";
            this.EmdType = "";
            this.TypeOfService = "";
            this.NoofItems = "";
            this.IsRefundable = false;
        }
        return SelectedService;
    }());
    PaymentData.SelectedService = SelectedService;
    var RootObject = /** @class */ (function () {
        function RootObject() {
            this.OrderId = "";
            this.Segments = [];
            this.Passengers = [];
            this.Payments = [];
            this.Services = [];
        }
        return RootObject;
    }());
    PaymentData.RootObject = RootObject;
})(PaymentData = exports.PaymentData || (exports.PaymentData = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bWVudC5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBheW1lbnQubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFjLFdBQVcsQ0FpR3hCO0FBakdELFdBQWMsV0FBVztJQUVyQjtRQUFBO1lBQ1csUUFBRyxHQUFXLEVBQUUsQ0FBQztZQUNqQixzQkFBaUIsR0FBVyxJQUFJLENBQUM7WUFDakMsb0JBQWUsR0FBVyxJQUFJLENBQUM7WUFDL0IsV0FBTSxHQUFXLEVBQUUsQ0FBQztZQUNwQixvQkFBZSxHQUFXLElBQUksQ0FBQztZQUMvQixXQUFNLEdBQVcsSUFBSSxDQUFDO1lBQ3RCLGdCQUFXLEdBQWdCLElBQUksQ0FBQztRQUUzQyxDQUFDO1FBQUQsZUFBQztJQUFELENBQUMsQUFURCxJQVNDO0lBVFksb0JBQVEsV0FTcEIsQ0FBQTtJQUVEO1FBQUE7WUFDVyxpQkFBWSxHQUFRLEVBQUUsQ0FBQztRQUNsQyxDQUFDO1FBQUQsYUFBQztJQUFELENBQUMsQUFGRCxJQUVDO0lBRlksa0JBQU0sU0FFbEIsQ0FBQTtJQUVEO1FBQUE7WUFDVyxpQkFBWSxHQUFRLEVBQUUsQ0FBQztRQUNsQyxDQUFDO1FBQUQsa0JBQUM7SUFBRCxDQUFDLEFBRkQsSUFFQztJQUZZLHVCQUFXLGNBRXZCLENBQUE7SUFFRDtRQUFBO1lBQ1csY0FBUyxHQUFRLEVBQUUsQ0FBQztZQUNwQixhQUFRLEdBQVEsRUFBRSxDQUFDO1lBQ25CLHNCQUFpQixHQUFRLEVBQUUsQ0FBQztZQUM1QixRQUFHLEdBQVEsRUFBRSxDQUFDO1FBQ3pCLENBQUM7UUFBRCxpQkFBQztJQUFELENBQUMsQUFMRCxJQUtDO0lBTFksc0JBQVUsYUFLdEIsQ0FBQTtJQUVEO1FBQUE7WUFDVyxnQkFBVyxHQUFXLEVBQUUsQ0FBQztZQUN6QixTQUFJLEdBQVcsRUFBRSxDQUFDO1lBQ2xCLGNBQVMsR0FBVyxFQUFFLENBQUM7WUFDdkIsZUFBVSxHQUFXLEVBQUUsQ0FBQztZQUN4QixnQkFBVyxHQUFXLEVBQUUsQ0FBQztZQUN6QixnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUNwQyxDQUFDO1FBQUQscUJBQUM7SUFBRCxDQUFDLEFBUEQsSUFPQztJQVBZLDBCQUFjLGlCQU8xQixDQUFBO0lBRUQ7UUFBQTtZQUNXLFNBQUksR0FBVyxJQUFJLENBQUM7WUFDcEIsb0JBQWUsR0FBUSxRQUFRLENBQUM7WUFDaEMsV0FBTSxHQUFRLEVBQUUsQ0FBQztZQUNqQixpQkFBWSxHQUFRLEVBQUUsQ0FBQztZQUN2QixhQUFRLEdBQVcsRUFBRSxDQUFDO1lBQ3RCLHFCQUFnQixHQUFXLEVBQUUsQ0FBQztZQUM5QixpQkFBWSxHQUFXLEVBQUUsQ0FBQztZQUMxQixpQkFBWSxHQUFRLEVBQUUsQ0FBQztZQUN2Qix1QkFBa0IsR0FBVyxFQUFFLENBQUM7WUFDaEMsbUJBQWMsR0FBVyxFQUFFLENBQUM7WUFDNUIscUJBQWdCLEdBQVEsRUFBRSxDQUFDO1lBRTNCLGNBQVMsR0FBUyxFQUFFLENBQUM7WUFDckIsYUFBUSxHQUFVLEVBQUUsQ0FBQztRQUNoQyxDQUFDO1FBQUQsY0FBQztJQUFELENBQUMsQUFmRCxJQWVDO0lBZlksbUJBQU8sVUFlbkIsQ0FBQTtJQUVEO1FBQUE7WUFDVyxpQkFBWSxHQUFXLGlCQUFpQixDQUFDO1FBQ3BELENBQUM7UUFBRCxZQUFDO0lBQUQsQ0FBQyxBQUZELElBRUM7SUFGWSxpQkFBSyxRQUVqQixDQUFBO0lBRUQ7UUFBQTtZQUNXLFlBQU8sR0FBVyxPQUFPLENBQUM7WUFDMUIsU0FBSSxHQUFVLEVBQUUsQ0FBQztZQUNqQixnQkFBVyxHQUFRLEVBQUUsQ0FBQztZQUN0QixVQUFLLEdBQVksRUFBRSxDQUFDO1lBQ3BCLGVBQVUsR0FBUSxJQUFJLENBQUM7WUFDdkIsbUJBQWMsR0FBVyxFQUFFLENBQUM7UUFDdkMsQ0FBQztRQUFELHNCQUFDO0lBQUQsQ0FBQyxBQVBELElBT0M7SUFQWSwyQkFBZSxrQkFPM0IsQ0FBQTtJQUVEO1FBQUE7WUFFVyxpQkFBWSxHQUFRLEVBQUUsQ0FBQztZQUN2QixlQUFVLEdBQU8sRUFBRSxDQUFDO1lBQ3BCLGlCQUFZLEdBQVEsRUFBRSxDQUFDO1lBQ3ZCLFdBQU0sR0FBUSxFQUFFLENBQUM7WUFDakIsaUJBQVksR0FBUSxFQUFFLENBQUM7WUFDdkIsYUFBUSxHQUFPLEVBQUUsQ0FBQztRQUM3QixDQUFDO1FBQUQsZUFBQztJQUFELENBQUMsQUFSRCxJQVFDO0lBUlksb0JBQVEsV0FRcEIsQ0FBQTtJQUVEO1FBQUE7WUFDSSxlQUFVLEdBQVUsRUFBRSxDQUFDO1lBQ3ZCLGtCQUFhLEdBQVUsRUFBRSxDQUFDO1lBQzFCLFlBQU8sR0FBVSxJQUFJLENBQUM7WUFDdEIsbUJBQWMsR0FBVSxFQUFFLENBQUM7WUFDM0IsWUFBTyxHQUFVLEVBQUUsQ0FBQztZQUNwQixrQkFBYSxHQUFVLEVBQUUsQ0FBQztZQUMxQixjQUFTLEdBQVUsRUFBRSxDQUFDO1lBQ3RCLGlCQUFZLEdBQVcsS0FBSyxDQUFDO1FBQ2pDLENBQUM7UUFBRCxzQkFBQztJQUFELENBQUMsQUFURCxJQVNDO0lBVFksMkJBQWUsa0JBUzNCLENBQUE7SUFFRDtRQUFBO1lBQ1csWUFBTyxHQUFVLEVBQUUsQ0FBQztZQUNwQixhQUFRLEdBQWUsRUFBRSxDQUFDO1lBQzFCLGVBQVUsR0FBYyxFQUFFLENBQUM7WUFDM0IsYUFBUSxHQUFjLEVBQUUsQ0FBQztZQUN6QixhQUFRLEdBQWUsRUFBRSxDQUFDO1FBRXJDLENBQUM7UUFBRCxpQkFBQztJQUFELENBQUMsQUFQRCxJQU9DO0lBUFksc0JBQVUsYUFPdEIsQ0FBQTtBQUVMLENBQUMsRUFqR2EsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFpR3hCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IG1vZHVsZSBQYXltZW50RGF0YSB7XG5cbiAgICBleHBvcnQgY2xhc3MgU2VnbWVudHMge1xuICAgICAgICBwdWJsaWMgUlBIOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgRGVwYXJ0dXJlRGF0ZVRpbWU6IHN0cmluZyA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBBcnJpdmFsRGF0ZVRpbWU6IHN0cmluZyA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBGbGlnaHQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBPcGVyYXRpbmdGbGlnaHQ6IHN0cmluZyA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBPcmlnaW46IE9yaWdpbiA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBEZXN0aW5hdGlvbjogRGVzdGluYXRpb24gPSBudWxsO1xuICAgICAgICBwdWJsaWMgSGFzU3RvcG92ZXI6IHRydWVcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgT3JpZ2luIHtcbiAgICAgICAgcHVibGljIExvY2F0aW9uQ29kZTpzdHJpbmc9XCJcIjtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRGVzdGluYXRpb24ge1xuICAgICAgICBwdWJsaWMgTG9jYXRpb25Db2RlOnN0cmluZz1cIlwiO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQYXNzZW5nZXJzIHtcbiAgICAgICAgcHVibGljIEZpcnN0bmFtZTpzdHJpbmc9XCJcIjtcbiAgICAgICAgcHVibGljIExhc3RuYW1lOnN0cmluZz1cIlwiO1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyVHlwZUNvZGU6c3RyaW5nPVwiXCI7XG4gICAgICAgIHB1YmxpYyBSUEg6c3RyaW5nPVwiXCI7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFBheW1lbnRBZGRyZXNzIHtcbiAgICAgICAgcHVibGljIEFkZHJlc3NMaW5lOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgQ2l0eTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFN0YXRlQ29kZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFBvc3RhbENvZGU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBDb3VudHJ5Q29kZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIENvdW50cnlOYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQYXltZW50IHtcbiAgICAgICAgcHVibGljIFR5cGU6IHN0cmluZyA9IFwiQ0FcIjtcbiAgICAgICAgcHVibGljIFRyYW5zYWN0aW9uVHlwZTpzdHJpbmc9XCJDaGFyZ2VcIjtcbiAgICAgICAgcHVibGljIEFtb3VudDogYW55ID0gXCJcIjtcbiAgICAgICAgcHVibGljIEN1cnJlbmN5Q29kZTogYW55ID0gXCJcIjtcbiAgICAgICAgcHVibGljIENhcmRDb2RlOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgTWFza2VkQ2FyZE51bWJlcjogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIEFwcHJvdmFsQ29kZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFNlY3VyaXR5Q29kZTpzdHJpbmc9XCJcIjtcbiAgICAgICAgcHVibGljIEV4cGlyYXRpb25EYXRlTU1ZWTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIENhcmRIb2xkZXJOYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgQ2FyZElzc3VlckJhbmtJRDpzdHJpbmc9XCJcIjtcbiAgICAgICAgcHVibGljIEJpbGxpbmdBZGRyZXNzOiBQYXltZW50QWRkcmVzcztcbiAgICAgICAgcHVibGljIEZpcnN0TmFtZTpzdHJpbmcgPVwiXCI7XG4gICAgICAgIHB1YmxpYyBMYXN0TmFtZTpzdHJpbmcgPSBcIlwiO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFbWFpbCB7XG4gICAgICAgIHB1YmxpYyBlbWFpbEFkZHJlc3M6IHN0cmluZyA9IFwibm9yZXBseUBocGUuY29tXCI7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFJlY2VpcHREZWxpdmVyeSB7XG4gICAgICAgIHB1YmxpYyBnYXRld2F5OiBzdHJpbmcgPSBcIkVNQUlMXCI7XG4gICAgICAgIHB1YmxpYyBOYW1lOnN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBwaG9uZW51bWJlcjpzdHJpbmc9XCJcIjtcbiAgICAgICAgcHVibGljIGVtYWlsOiBFbWFpbFtdID0gW107XG4gICAgICAgIHB1YmxpYyBMYW5ndWFnZUlEOnN0cmluZz1udWxsO1xuICAgICAgICBwdWJsaWMgcHJpbnRlckFkZHJlc3M6IHN0cmluZyA9IFwiXCI7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFNlcnZpY2VzIHtcbiAgICAgICAgcHVibGljIHNlbGVjdGVkU2VydmljZTogU2VsZWN0ZWRTZXJ2aWNlO1xuICAgICAgICBwdWJsaWMgcGFzc2VuZ2VyUlBIOnN0cmluZz1cIlwiO1xuICAgICAgICBwdWJsaWMgU2VnbWVudFJQSDphbnlbXT1bXTtcbiAgICAgICAgcHVibGljIGN1cnJlbmN5Q29kZTpzdHJpbmc9XCJcIjtcbiAgICAgICAgcHVibGljIGFtb3VudDpzdHJpbmc9XCJcIjtcbiAgICAgICAgcHVibGljIHRpY2tldE51bWJlcjpzdHJpbmc9XCJcIjtcbiAgICAgICAgcHVibGljIEVtZFRheGVzOmFueVtdPVtdO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBTZWxlY3RlZFNlcnZpY2Uge1xuICAgICAgICBSRklTQ19jb2RlOnN0cmluZyA9IFwiXCI7XG4gICAgICAgIFJGSVNDX3N1YkNvZGU6c3RyaW5nID0gXCJcIjtcbiAgICAgICAgU1NSQ29kZTpzdHJpbmcgPSBudWxsO1xuICAgICAgICBjb21tZXJjaWFsTmFtZTpzdHJpbmcgPSBcIlwiO1xuICAgICAgICBFbWRUeXBlOnN0cmluZyA9IFwiXCI7XG4gICAgICAgIFR5cGVPZlNlcnZpY2U6c3RyaW5nID0gXCJcIjtcbiAgICAgICAgTm9vZkl0ZW1zOnN0cmluZyA9IFwiXCI7XG4gICAgICAgIElzUmVmdW5kYWJsZTpib29sZWFuID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFJvb3RPYmplY3Qge1xuICAgICAgICBwdWJsaWMgT3JkZXJJZDpzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgU2VnbWVudHM6IFNlZ21lbnRzW10gPSBbXTtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlcnM6UGFzc2VuZ2Vyc1tdPVtdO1xuICAgICAgICBwdWJsaWMgUGF5bWVudHM6IFBheW1lbnRbXSA9IFtdO1xuICAgICAgICBwdWJsaWMgU2VydmljZXM6IFNlcnZpY2VzW10gPSBbXTtcbiAgICAgICAgcHVibGljIFJlY2VpcHREZWxpdmVyeTogUmVjZWlwdERlbGl2ZXJ5O1xuICAgIH1cblxufSJdfQ==