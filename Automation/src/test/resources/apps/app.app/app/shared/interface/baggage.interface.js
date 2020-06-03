"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baggageTemplate;
(function (baggageTemplate) {
    var SelectedSegment = /** @class */ (function () {
        function SelectedSegment() {
            this.Origin = null;
            this.Destination = null;
            this.DepartureDateTime = null;
            this.ArrivalDateTime = null;
            this.MarketingFlight = "";
            this.OperatingFlight = "";
            this.RBD = "";
            this.BookingClass = null;
            this.RPH = "";
            this.Status = null;
            this.Connection = null;
            this.Stopover = null;
            this.Turnaround = null;
            this.DateOfIssue = null;
            this.ResBookDesigCode = "";
        }
        return SelectedSegment;
    }());
    baggageTemplate.SelectedSegment = SelectedSegment;
    var Origin = /** @class */ (function () {
        function Origin() {
        }
        return Origin;
    }());
    baggageTemplate.Origin = Origin;
    var Destination = /** @class */ (function () {
        function Destination() {
        }
        return Destination;
    }());
    baggageTemplate.Destination = Destination;
    var Status = /** @class */ (function () {
        function Status() {
        }
        return Status;
    }());
    baggageTemplate.Status = Status;
    var SelectedSegments = /** @class */ (function () {
        function SelectedSegments() {
        }
        return SelectedSegments;
    }());
    baggageTemplate.SelectedSegments = SelectedSegments;
    var AddBaggegeDetails = /** @class */ (function () {
        function AddBaggegeDetails() {
            this.bagTag = null;
            this.weight = 0;
            this.weightUnit = null;
            this.tagNumber = null;
            this.fees = null;
            this.destination = null;
            this.standard = false;
            this.catalog = false;
            this.auto = false;
            this.manual = false;
            this.status = "";
            this.StdProduct = "";
            this.CtlgProduct = "";
            this.Code = "";
            this.AlreadyExisting = false;
            this.BagTagDetails = [];
            this.selectedproduct = "";
            this.Oversize = false;
            this.RFISC_SubCode = null;
            this.ShortCheckAirportCode = null;
            this.CheckedInIndicator = "";
            this.PieceOccurrenceType = null;
            this.PieceOccurrence = null;
        }
        return AddBaggegeDetails;
    }());
    baggageTemplate.AddBaggegeDetails = AddBaggegeDetails;
    var BaggageDetail = /** @class */ (function () {
        function BaggageDetail() {
            this.BaggageRPH = null;
            this.FlightSegmentRPH = null;
            this.LastFlightSegmentRPH = null;
            this.PassengerRPH = null;
            this.CheckedInIndicator = "";
            this.RFISC_SubCode = null;
            this.Pieces = 1;
            this.EMD_TypeCode = "";
            this.RFISC_Code = "";
            this.PieceOccurrenceType = null;
            this.PieceOccurrence = null;
            this.DefaultInd = false;
            this.ProductGroupCode = "";
        }
        return BaggageDetail;
    }());
    baggageTemplate.BaggageDetail = BaggageDetail;
    var BagsToPrice = /** @class */ (function () {
        function BagsToPrice() {
            this.PriceRPH = "1";
        }
        return BagsToPrice;
    }());
    baggageTemplate.BagsToPrice = BagsToPrice;
    var BagsToPrices = /** @class */ (function () {
        function BagsToPrices() {
        }
        return BagsToPrices;
    }());
    baggageTemplate.BagsToPrices = BagsToPrices;
    var ProductDetail = /** @class */ (function () {
        function ProductDetail() {
        }
        return ProductDetail;
    }());
    baggageTemplate.ProductDetail = ProductDetail;
    var ProductDetails = /** @class */ (function () {
        function ProductDetails() {
        }
        return ProductDetails;
    }());
    baggageTemplate.ProductDetails = ProductDetails;
})(baggageTemplate = exports.baggageTemplate || (exports.baggageTemplate = {}));
var Bagtag;
(function (Bagtag) {
    var ClientViewModel = /** @class */ (function () {
        function ClientViewModel() {
        }
        return ClientViewModel;
    }());
    Bagtag.ClientViewModel = ClientViewModel;
    var PhoneNumber = /** @class */ (function () {
        function PhoneNumber() {
        }
        return PhoneNumber;
    }());
    Bagtag.PhoneNumber = PhoneNumber;
    var BagTagDetail = /** @class */ (function () {
        function BagTagDetail() {
            this.Amount = 0;
        }
        return BagTagDetail;
    }());
    Bagtag.BagTagDetail = BagTagDetail;
    var BaggageInfo = /** @class */ (function () {
        function BaggageInfo() {
            this.BagTagDetails = [];
        }
        return BaggageInfo;
    }());
    Bagtag.BaggageInfo = BaggageInfo;
    var CheckedBag = /** @class */ (function () {
        function CheckedBag() {
        }
        return CheckedBag;
    }());
    Bagtag.CheckedBag = CheckedBag;
    var PassengerList = /** @class */ (function () {
        function PassengerList() {
            this.PhoneNumbers = [];
            this.FqtTravelers = [];
            this.CheckedBags = [];
        }
        return PassengerList;
    }());
    Bagtag.PassengerList = PassengerList;
    var FqtTravelers = /** @class */ (function () {
        function FqtTravelers() {
        }
        return FqtTravelers;
    }());
    Bagtag.FqtTravelers = FqtTravelers;
    var FlightCheckIn = /** @class */ (function () {
        function FlightCheckIn() {
        }
        return FlightCheckIn;
    }());
    Bagtag.FlightCheckIn = FlightCheckIn;
    var PassengerListDelete = /** @class */ (function () {
        function PassengerListDelete() {
            this.PhoneNumbers = [];
            this.FqtTravelers = [];
            this.CheckedBags = [];
            this.CheckinRePrint = false;
        }
        return PassengerListDelete;
    }());
    Bagtag.PassengerListDelete = PassengerListDelete;
    var SegmentList = /** @class */ (function () {
        function SegmentList() {
        }
        return SegmentList;
    }());
    Bagtag.SegmentList = SegmentList;
    var SegmentTravelerInfo = /** @class */ (function () {
        function SegmentTravelerInfo() {
        }
        return SegmentTravelerInfo;
    }());
    Bagtag.SegmentTravelerInfo = SegmentTravelerInfo;
    var RootObject = /** @class */ (function () {
        function RootObject() {
            this.ID = "";
            this.CheckInType = "";
            this.ClientViewModel = null;
            this.PassengerList = [];
            this.SegmentList = [];
            this.SegmentTravelerInfo = [];
        }
        return RootObject;
    }());
    Bagtag.RootObject = RootObject;
    var BaggageInfoToDelete = /** @class */ (function () {
        function BaggageInfoToDelete() {
            this.BagTagDetails = [];
        }
        return BaggageInfoToDelete;
    }());
    Bagtag.BaggageInfoToDelete = BaggageInfoToDelete;
    var ClientViewModelDelete = /** @class */ (function () {
        function ClientViewModelDelete() {
        }
        return ClientViewModelDelete;
    }());
    Bagtag.ClientViewModelDelete = ClientViewModelDelete;
    var BagTagDetailDelete = /** @class */ (function () {
        function BagTagDetailDelete() {
            this.IsAutoBag = false;
        }
        return BagTagDetailDelete;
    }());
    Bagtag.BagTagDetailDelete = BagTagDetailDelete;
    var DeleteObject = /** @class */ (function () {
        function DeleteObject() {
            this.ID = "";
            this.CheckInType = "";
            this.ClientViewModel = null;
            this.PassengerList = [];
            this.SegmentList = [];
            this.SegmentTravelerInfo = [];
            this.Source = "TAB";
        }
        return DeleteObject;
    }());
    Bagtag.DeleteObject = DeleteObject;
})(Bagtag = exports.Bagtag || (exports.Bagtag = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFnZ2FnZS5pbnRlcmZhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYWdnYWdlLmludGVyZmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQWMsZUFBZSxDQThINUI7QUE5SEQsV0FBYyxlQUFlO0lBQzNCO1FBQUE7WUFDUyxXQUFNLEdBQVcsSUFBSSxDQUFDO1lBQ3RCLGdCQUFXLEdBQWdCLElBQUksQ0FBQztZQUNoQyxzQkFBaUIsR0FBUyxJQUFJLENBQUM7WUFDL0Isb0JBQWUsR0FBUyxJQUFJLENBQUM7WUFDN0Isb0JBQWUsR0FBVyxFQUFFLENBQUM7WUFDN0Isb0JBQWUsR0FBVyxFQUFFLENBQUM7WUFDN0IsUUFBRyxHQUFXLEVBQUUsQ0FBQztZQUNqQixpQkFBWSxHQUFXLElBQUksQ0FBQztZQUM1QixRQUFHLEdBQVcsRUFBRSxDQUFDO1lBQ2pCLFdBQU0sR0FBVyxJQUFJLENBQUM7WUFDdEIsZUFBVSxHQUFXLElBQUksQ0FBQztZQUMxQixhQUFRLEdBQVcsSUFBSSxDQUFDO1lBQ3hCLGVBQVUsR0FBVyxJQUFJLENBQUM7WUFDMUIsZ0JBQVcsR0FBUyxJQUFJLENBQUM7WUFDekIscUJBQWdCLEdBQVcsRUFBRSxDQUFDO1FBQ3ZDLENBQUM7UUFBRCxzQkFBQztJQUFELENBQUMsQUFoQkQsSUFnQkM7SUFoQlksK0JBQWUsa0JBZ0IzQixDQUFBO0lBQ0Q7UUFBQTtRQUdBLENBQUM7UUFBRCxhQUFDO0lBQUQsQ0FBQyxBQUhELElBR0M7SUFIWSxzQkFBTSxTQUdsQixDQUFBO0lBRUQ7UUFBQTtRQUdBLENBQUM7UUFBRCxrQkFBQztJQUFELENBQUMsQUFIRCxJQUdDO0lBSFksMkJBQVcsY0FHdkIsQ0FBQTtJQUVEO1FBQUE7UUFHQSxDQUFDO1FBQUQsYUFBQztJQUFELENBQUMsQUFIRCxJQUdDO0lBSFksc0JBQU0sU0FHbEIsQ0FBQTtJQUNEO1FBQUE7UUFFQSxDQUFDO1FBQUQsdUJBQUM7SUFBRCxDQUFDLEFBRkQs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O1lBR3pCLG9CQUFlLEdBQW9CLElBQUksQ0FBQztZQUN4QyxrQkFBYSxHQUF5QixFQUFFLENBQUM7WUFDekMsZ0JBQVcsR0FBdUIsRUFBRSxDQUFDO1lBQ3JDLHdCQUFtQixHQUErQixFQUFFLENBQUM7UUFFOUQsQ0FBQztRQUFELGlCQUFDO0lBQUQsQ0FBQyxBQVZELElBVUM7SUFWWSxpQkFBVSxhQVV0QixDQUFBO0lBR0Q7UUFBQTtZQUNTLGtCQUFhLEdBQThCLEVBQUUsQ0FBQztRQUt2RCxDQUFDO1FBQUQsMEJBQUM7SUFBRCxDQUFDLEFBTkQsSUFNQztJQU5ZLDBCQUFtQixzQkFNL0IsQ0FBQTtJQUdEO1FBQUE7UUFHQSxDQUFDO1FBQUQsNEJBQUM7SUFBRCxDQUFDLEFBSEQsSUFHQztJQUhZLDRCQUFxQix3QkFHakMsQ0FBQTtJQUNEO1FBQUE7WUFZUyxjQUFTLEdBQVksS0FBSyxDQUFDO1FBQ3BDLENBQUM7UUFBRCx5QkFBQztJQUFELENBQUMsQUFiRCxJQWFDO0lBYlkseUJBQWtCLHFCQWE5QixDQUFBO0lBRUQ7UUFBQTtZQUNTLE9BQUUsR0FBVyxFQUFFLENBQUM7WUFDaEIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7WUFFekIsb0JBQWUsR0FBMEIsSUFBSSxDQUFDO1lBQzlDLGtCQUFhLEdBQStCLEVBQUUsQ0FBQztZQUMvQyxnQkFBVyxHQUF1QixFQUFFLENBQUM7WUFFckMsd0JBQW1CLEdBQStCLEVBQUUsQ0FBQztZQUNyRCxXQUFNLEdBQVMsS0FBSyxDQUFDO1FBQzlCLENBQUM7UUFBRCxtQkFBQztJQUFELENBQUMsQUFWRCxJQVVDO0lBVlksbUJBQVksZUFVeEIsQ0FBQTtBQUNILENBQUMsRUEvTmEsTUFBTSxHQUFOLGNBQU0sS0FBTixjQUFNLFFBK05uQiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBtb2R1bGUgYmFnZ2FnZVRlbXBsYXRlIHtcbiAgZXhwb3J0IGNsYXNzIFNlbGVjdGVkU2VnbWVudCB7XG4gICAgcHVibGljIE9yaWdpbjogT3JpZ2luID0gbnVsbDtcbiAgICBwdWJsaWMgRGVzdGluYXRpb246IERlc3RpbmF0aW9uID0gbnVsbDtcbiAgICBwdWJsaWMgRGVwYXJ0dXJlRGF0ZVRpbWU6IERhdGUgPSBudWxsO1xuICAgIHB1YmxpYyBBcnJpdmFsRGF0ZVRpbWU6IERhdGUgPSBudWxsO1xuICAgIHB1YmxpYyBNYXJrZXRpbmdGbGlnaHQ6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIE9wZXJhdGluZ0ZsaWdodDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgUkJEOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBCb29raW5nQ2xhc3M6IHN0cmluZyA9IG51bGw7XG4gICAgcHVibGljIFJQSDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgU3RhdHVzOiBTdGF0dXMgPSBudWxsO1xuICAgIHB1YmxpYyBDb25uZWN0aW9uOiBzdHJpbmcgPSBudWxsO1xuICAgIHB1YmxpYyBTdG9wb3Zlcjogc3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgVHVybmFyb3VuZDogc3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgRGF0ZU9mSXNzdWU6IERhdGUgPSBudWxsO1xuICAgIHB1YmxpYyBSZXNCb29rRGVzaWdDb2RlOiBzdHJpbmcgPSBcIlwiO1xuICB9XG4gIGV4cG9ydCBjbGFzcyBPcmlnaW4ge1xuXG4gICAgcHVibGljIEFpcnBvcnRDb2RlOiBzdHJpbmc7IFwiXCI7XG4gIH1cblxuICBleHBvcnQgY2xhc3MgRGVzdGluYXRpb24ge1xuICAgIHB1YmxpYyBBaXJwb3J0Q29kZTogc3RyaW5nOyBcIlwiO1xuXG4gIH1cblxuICBleHBvcnQgY2xhc3MgU3RhdHVzIHtcbiAgICBwdWJsaWMgU3RhdHVzTnVtYmVyOiBzdHJpbmc7IFwiXCI7XG5cbiAgfVxuICBleHBvcnQgY2xhc3MgU2VsZWN0ZWRTZWdtZW50cyB7XG4gICAgc2VsZWN0ZWRTZWdtZW50czogU2VsZWN0ZWRTZWdtZW50W107XG4gIH1cbiAgZXhwb3J0IGNsYXNzIEFkZEJhZ2dlZ2VEZXRhaWxzIHtcblxuICAgIHB1YmxpYyBiYWdUYWc6IHN0cmluZyA9IG51bGw7XG4gICAgcHVibGljIHdlaWdodDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgd2VpZ2h0VW5pdDogc3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgdGFnTnVtYmVyOiBzdHJpbmcgPSBudWxsO1xuICAgIHB1YmxpYyBmZWVzOiBzdHJpbmcgPSBudWxsO1xuICAgIHB1YmxpYyBkZXN0aW5hdGlvbjogc3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgc3RhbmRhcmQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgY2F0YWxvZzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBhdXRvOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIG1hbnVhbDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBzdGF0dXM6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFN0ZFByb2R1Y3Q6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIEN0bGdQcm9kdWN0OiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBDb2RlOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBBbHJlYWR5RXhpc3Rpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgQmFnVGFnRGV0YWlsczogYW55ID0gW107XG4gICAgcHVibGljIHNlbGVjdGVkcHJvZHVjdDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgT3ZlcnNpemU6Ym9vbGVhbj1mYWxzZTtcbiAgICBwdWJsaWMgUkZJU0NfU3ViQ29kZTogc3RyaW5nID0gbnVsbDsgXG4gICAgcHVibGljIFNob3J0Q2hlY2tBaXJwb3J0Q29kZTogc3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgQ2hlY2tlZEluSW5kaWNhdG9yOnN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFBpZWNlT2NjdXJyZW5jZVR5cGU6c3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgUGllY2VPY2N1cnJlbmNlOnN0cmluZyA9IG51bGw7XG5cbiAgfVxuXG4gIGV4cG9ydCBjbGFzcyBCYWdnYWdlRGV0YWlsIHtcblxuICAgIHB1YmxpYyBCYWdnYWdlUlBIOiBzdHJpbmcgPSBudWxsO1xuICAgIHB1YmxpYyBGbGlnaHRTZWdtZW50UlBIOiBzdHJpbmcgPSBudWxsO1xuICAgIHB1YmxpYyBMYXN0RmxpZ2h0U2VnbWVudFJQSDogc3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgUGFzc2VuZ2VyUlBIOiBzdHJpbmcgPSBudWxsO1xuICAgIHB1YmxpYyBDaGVja2VkSW5JbmRpY2F0b3I6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFJGSVNDX1N1YkNvZGU6IHN0cmluZyA9IG51bGw7XG4gICAgcHVibGljIElzT3ZlcnNpemVkOmJvb2xlYW47XG4gICAgcHVibGljIFBpZWNlczogbnVtYmVyID0gMTtcbiAgICBwdWJsaWMgV2VpZ2h0Om51bWJlcjtcbiAgICBwdWJsaWMgV2VpZ2h0VW5pdCA6IHN0cmluZztcbiAgICBwdWJsaWMgQ29tbWVyY2lhbE5hbWU/IDogc3RyaW5nO1xuICAgIHB1YmxpYyBFTURfVHlwZUNvZGUgOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBMb25nRGVzY3JpcHRpb24/IDogc3RyaW5nIDtcbiAgICBwdWJsaWMgUkZJU0NfQ29kZT8gOiAgc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgU2VydmljZUNvZGU/IDogc3RyaW5nO1xuICAgIHB1YmxpYyBTaG9ydERlc2NyaXB0aW9uPyA6IHN0cmluZztcbiAgICBwdWJsaWMgU1NSQ29kZSA6IHN0cmluZztcbiAgICBwdWJsaWMgUGllY2VPY2N1cnJlbmNlVHlwZTpzdHJpbmcgPSBudWxsO1xuICAgIHB1YmxpYyBQaWVjZU9jY3VycmVuY2U6c3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgRGVmYXVsdEluZDpib29sZWFuPWZhbHNlO1xuICAgIHB1YmxpYyBQcm9kdWN0R3JvdXBDb2RlOlN0cmluZz1cIlwiO1xuXG5cblxuICB9XG4gIGV4cG9ydCBjbGFzcyBCYWdzVG9QcmljZSB7XG4gICAgcHVibGljIEZsaWdodFNlZ21lbnQ6IGFueVtdO1xuICAgIHB1YmxpYyBQYXNzZW5nZXI6IGFueVtdO1xuICAgIHB1YmxpYyBQcmljaW5nSW5mbzogYW55W107XG4gICAgcHVibGljIFBOUjogYW55O1xuICAgIHB1YmxpYyBCYWdnYWdlRGV0YWlsOiBhbnlbXTtcbiAgICBwdWJsaWMgUHJpY2VSUEg6U3RyaW5nPVwiMVwiO1xuICB9XG4gIGV4cG9ydCBjbGFzcyBCYWdzVG9QcmljZXMge1xuXG4gICAgcHVibGljIEJhZ3NUb1ByaWNlOiBCYWdzVG9QcmljZVtdO1xuICB9XG4gIGV4cG9ydCBjbGFzcyBQcm9kdWN0RGV0YWlsIHtcbiAgICBOYW1lOiBzdHJpbmc7XG4gICAgQ29kZTogc3RyaW5nO1xuICAgIFJGSUM6c3RyaW5nO1xuICAgIFN1YlR5cGU6c3RyaW5nO1xuICAgIFNTUkNvZGU6c3RyaW5nO1xuICAgIFNlcnZpY2VDb2RlOnN0cmluZztcbiAgICB3ZWlnaHQ6bnVtYmVyO1xuICAgIENvbW1lcmNpYWxOYW1lOnN0cmluZztcbiAgICBXZWlnaHRVbml0OnN0cmluZztcbiAgICBTaG9ydERlc2NyaXB0aW9uOnN0cmluZztcbiAgICBMb25nRGVzY3JpcHRpb246c3RyaW5nO1xuICAgIEVNRF9UeXBlQ29kZTpzdHJpbmc7XG4gICAgcHVibGljIERlZmF1bHRJbmQ6Ym9vbGVhbjtcbiAgICBwdWJsaWMgUHJvZHVjdEdyb3VwQ29kZTpTdHJpbmc7XG5cbiAgfVxuICBleHBvcnQgY2xhc3MgUHJvZHVjdERldGFpbHMge1xuICAgIFByb2R1Y3REZXRhaWw6IFByb2R1Y3REZXRhaWxbXTtcbiAgICBFcnJvcnM6IG51bGw7XG4gICAgSW5mb3JtYXRpb246IG51bGw7XG4gICAgV2FybmluZ3M6IG51bGw7XG4gIH1cblxufVxuZXhwb3J0IG1vZHVsZSBCYWd0YWcge1xuXG4gIGV4cG9ydCBjbGFzcyBDbGllbnRWaWV3TW9kZWwge1xuICAgIHB1YmxpYyBNZXNzYWdlRnVuY3Rpb246IG51bWJlcjtcbiAgICBwdWJsaWMgQmFnZ2FnZUluZm8/OiBhbnk7XG4gIH1cblxuXG4gIGV4cG9ydCBjbGFzcyBQaG9uZU51bWJlciB7XG4gICAgcHVibGljIElzUmVmVmFsdWU6IGJvb2xlYW47XG4gICAgcHVibGljIFR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgVHlwZVRleHQ6IHN0cmluZztcbiAgICBwdWJsaWMgVGVjaFR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgVGVjaFR5cGVUZXh0OiBzdHJpbmc7XG4gICAgcHVibGljIFZhbHVlOiBzdHJpbmc7XG4gICAgcHVibGljIE9wZXJhdGlvbj86IGFueTtcbiAgICBwdWJsaWMgT1NJVGV4dD86IGFueTtcbiAgICBwdWJsaWMgQ2FycmllckNvZGU/OiBhbnk7XG4gICAgcHVibGljIFJlbWFyazogc3RyaW5nO1xuICAgIHB1YmxpYyBMb2NhdGlvbkNvZGU/OiBhbnk7XG4gICAgcHVibGljIEFyZWFDaXR5Q29kZTogc3RyaW5nO1xuICB9XG5cbiAgZXhwb3J0IGNsYXNzIEJhZ1RhZ0RldGFpbCB7XG4gICAgcHVibGljIEJhZ1RhZ1R5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgU2VyaWFsTnVtYmVyPzogYW55O1xuICAgIHB1YmxpYyBCYWdUYWdDb3VudDogc3RyaW5nO1xuICAgIHB1YmxpYyBDYXJyaWVyQ29kZTogc3RyaW5nO1xuICAgIHB1YmxpYyBJc3N1ZXJDb2RlOiBzdHJpbmc7XG4gICAgcHVibGljIFdlaWdodFRvRGVsZXRlOiBzdHJpbmc7XG4gICAgcHVibGljIFdlaWdodFRvRGVsZXRlX0VkaXRhYmxlOiBib29sZWFuO1xuICAgIHB1YmxpYyBTZWdtZW50UlBIOiBzdHJpbmc7XG4gICAgcHVibGljIFNob3J0Q2hlY2tBaXJwb3J0Q29kZTogc3RyaW5nO1xuICAgIHB1YmxpYyBSRklTQ19TdWJDb2RlOnN0cmluZztcbiAgICBwdWJsaWMgV2VpZ2h0Om51bWJlcjtcbiAgICBwdWJsaWMgQW1vdW50Om51bWJlcj0wO1xuICAgIHB1YmxpYyBJc0F1dG9CYWc6Ym9vbGVhbjtcbiAgICBwdWJsaWMgZmVzcyA6c3RyaW5nO1xuICAgIHB1YmxpYyBpc1N0YW5kYXJkIDpib29sZWFuO1xuICAgIHB1YmxpYyBwcm9kdWN0RGVzY3JpcHRpb246c3RyaW5nO1xuICAgIHB1YmxpYyBCYWdnYWdlUlBIOnN0cmluZztcbiAgICBwdWJsaWMgQ2hlY2tlZEluSW5kaWNhdG9yOnN0cmluZztcbiAgICBwdWJsaWMgUGllY2VPY2N1cnJlbmNlVHlwZTpzdHJpbmc7XG4gICAgcHVibGljIFBpZWNlT2NjdXJyZW5jZTpzdHJpbmc7c1xuXG4gIH1cblxuICBleHBvcnQgY2xhc3MgQmFnZ2FnZUluZm8ge1xuICAgIHB1YmxpYyBCYWdUYWdEZXRhaWxzOiBBcnJheTxCYWdUYWdEZXRhaWw+ID0gW107XG4gICAgcHVibGljIENoZWNrZWRCYWdXZWlnaHRUb3RhbDogc3RyaW5nO1xuICAgIHB1YmxpYyBVbml0T2ZNZWFzdXJlQ29kZTogc3RyaW5nO1xuICAgIHB1YmxpYyBQYXNzZW5nZXJSUEggOiBzdHJpbmc7XG4gICAgcHVibGljIENoZWNrZWRCYWdDb3VudFRvdGFsOiBzdHJpbmc7XG4gIH1cblxuXG4gIGV4cG9ydCBjbGFzcyBDaGVja2VkQmFnIHtcbiAgICBwdWJsaWMgQmFnZ2FnZUluZm86IEJhZ2dhZ2VJbmZvO1xuICAgIHB1YmxpYyBDYW5jZWxPcGVyYXRpb246IGJvb2xlYW47XG4gICAgcHVibGljIE1lc3NhZ2VGdW5jdGlvbjogbnVtYmVyO1xuICB9XG5cbiAgZXhwb3J0IGNsYXNzIFBhc3Nlbmdlckxpc3Qge1xuICAgIHB1YmxpYyBGaXJzdG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgTGFzdG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgU3VybmFtZVJlZk51bWJlcjogc3RyaW5nO1xuICAgIHB1YmxpYyBQYXNzZW5nZXJSZWZOdW1iZXI6c3RyaW5nO1xuICAgIHB1YmxpYyBQcmVmaXg/OiBhbnk7XG4gICAgcHVibGljIFJQSDogc3RyaW5nO1xuICAgIHB1YmxpYyBFbWFpbHM6IGFueVtdO1xuICAgIHB1YmxpYyBQYXNzZW5nZXJUeXBlQ29kZTogc3RyaW5nO1xuICAgIHB1YmxpYyBQaG9uZU51bWJlcnM6IEFycmF5PFBob25lTnVtYmVyPiA9IFtdO1xuICAgIHB1YmxpYyBEYXRlT2ZCaXJ0aDogc3RyaW5nO1xuICAgIHB1YmxpYyBPcmRlcklkOnN0cmluZztcbiAgICBwdWJsaWMgQWdlPzogYW55O1xuICAgIHB1YmxpYyBBc3NvY2lhdGVkSW5mYW50UlBIPzogYW55O1xuICAgIHB1YmxpYyBBc3NvY2lhdGVkQWR1bHRSUEg/OiBhbnk7XG4gICAgcHVibGljIEZxdFRyYXZlbGVyczogQXJyYXk8RnF0VHJhdmVsZXJzPiA9IFtdO1xuICAgIHB1YmxpYyBOYXRpb25hbGl0eT86IGFueTtcbiAgICBwdWJsaWMgRW1lcmdlbmN5RGV0YWlsczogYW55W107XG4gICAgcHVibGljIENoZWNrZWRCYWdzOiBBcnJheTxDaGVja2VkQmFnPiA9IFtdO1xuICAgIHB1YmxpYyBDaGVja0luQmFnQ291bnRUb3RhbDogc3RyaW5nO1xuICAgIHB1YmxpYyBDaGVja0luQmFnV2VpZ2h0VG90YWw6IHN0cmluZztcbiAgICBwdWJsaWMgU2VsZWN0ZWQ6IGJvb2xlYW47XG4gICAgcHVibGljIEdpdmVuTmFtZVJlZk51bWJlcjogbnVtYmVyO1xuICAgIHB1YmxpYyBpc01hbnVhbEJhZzpib29sZWFuO1xuICB9XG4gIGV4cG9ydCBjbGFzcyBGcXRUcmF2ZWxlcnMge1xuICAgIHB1YmxpYyBJc1JlZlZhbHVlOiBib29sZWFuO1xuICAgIHB1YmxpYyBMb3lhbExldmVsOiBzdHJpbmc7XG4gICAgcHVibGljIExveWFsdHlMZXZlbE5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgTWVtYmVyc2hpcElEOiBudW1iZXI7XG4gICAgcHVibGljIFByb2dyYW1JRDogc3RyaW5nO1xuICAgIHB1YmxpYyBBd2FyZEluZm9ybWF0aW9uOiBzdHJpbmc7XG4gICAgcHVibGljIFZlbmRvckNvZGVzOiBzdHJpbmc7XG4gICAgcHVibGljIE9wZXJhdGlvbjogc3RyaW5nO1xuICB9XG4gIGV4cG9ydCBjbGFzcyBGbGlnaHRDaGVja0luIHtcbiAgICBwdWJsaWMgQ2hlY2tJblN0YXR1czogc3RyaW5nO1xuICB9XG4gIGV4cG9ydCBjbGFzcyBQYXNzZW5nZXJMaXN0RGVsZXRlIHtcbiAgICBwdWJsaWMgRmlyc3RuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIExhc3RuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIFN1cm5hbWVSZWZOdW1iZXI6IHN0cmluZztcbiAgICBwdWJsaWMgUHJlZml4PzogYW55O1xuICAgIHB1YmxpYyBSUEg6IHN0cmluZztcbiAgICBwdWJsaWMgRW1haWxzOiBhbnlbXTtcbiAgICBwdWJsaWMgUGFzc2VuZ2VyVHlwZUNvZGU6IHN0cmluZztcbiAgICBwdWJsaWMgUGhvbmVOdW1iZXJzOiBBcnJheTxQaG9uZU51bWJlcj4gPSBbXTtcbiAgICBwdWJsaWMgRGF0ZU9mQmlydGg6IHN0cmluZztcbiAgICBwdWJsaWMgT3JkZXJJZDogc3RyaW5nO1xuICAgIHB1YmxpYyBBZ2U/OiBhbnk7XG4gICAgcHVibGljIEdlbmRlcjogc3RyaW5nO1xuICAgIHB1YmxpYyBBc3NvY2lhdGVkSW5mYW50UlBIPzogYW55O1xuICAgIHB1YmxpYyBBc3NvY2lhdGVkQWR1bHRSUEg/OiBhbnk7XG4gICAgcHVibGljIEZxdFRyYXZlbGVyczogQXJyYXk8RnF0VHJhdmVsZXJzPiA9IFtdO1xuICAgIHB1YmxpYyBOYXRpb25hbGl0eT86IGFueTtcbiAgICBwdWJsaWMgRW1lcmdlbmN5RGV0YWlsczogYW55W107XG4gICAgcHVibGljIEtub3duVHJhdmVsZXJOdW1iZXI/OiBhbnk7XG4gICAgcHVibGljIFJlZHJlc3NOdW1iZXI/OiBhbnk7XG4gICAgcHVibGljIEZPSUQ/OiBhbnk7XG4gICAgcHVibGljIEdpdmVuTmFtZSA6IGFueTtcbiAgICBwdWJsaWMgU3VybmFtZTphbnk7XG4gICAgcHVibGljIE9sZE5hdGlvbmFsaXR5PzogYW55O1xuICAgIHB1YmxpYyBPbGREYXRlT2ZCaXJ0aD86IGFueTtcbiAgICBwdWJsaWMgT2xkR2VuZGVyPzogYW55O1xuICAgIHB1YmxpYyBPbGRGT0lEPzogYW55O1xuICAgIHB1YmxpYyBQYXNzZW5nZXJSZWZOdW1iZXI6IGFueTtcbiAgICBwdWJsaWMgQ2hlY2tlZEJhZ3M6IEFycmF5PENoZWNrZWRCYWc+ID0gW107XG4gICAgcHVibGljIENoZWNrSW5CYWdDb3VudFRvdGFsOiBzdHJpbmc7XG4gICAgcHVibGljIENoZWNrSW5CYWdXZWlnaHRUb3RhbDogc3RyaW5nO1xuICAgIHB1YmxpYyBDaGVja2luUmVQcmludDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBTZWxlY3RlZDogYm9vbGVhbjtcbiAgICBwdWJsaWMgQ2FuY2VsT3BlcmF0aW9uOiBib29sZWFuO1xuICAgIHB1YmxpYyBHaXZlbk5hbWVSZWZOdW1iZXI6IHN0cmluZztcblxuICAgIHB1YmxpYyBCYWdnYWdlSW5mb1RvRGVsZXRlOiBCYWdnYWdlSW5mb1RvRGVsZXRlXG5cbiAgfVxuXG5cbiAgZXhwb3J0IGNsYXNzIFNlZ21lbnRMaXN0IHtcbiAgICBwdWJsaWMgUlBIOiBzdHJpbmc7XG4gICAgcHVibGljIERlcGFydHVyZURhdGVUaW1lOiBEYXRlO1xuICAgIHB1YmxpYyBBcnJpdmFsRGF0ZVRpbWU6IERhdGU7XG4gICAgcHVibGljIE1hcmtldGluZ0ZsaWdodDogc3RyaW5nO1xuICAgIHB1YmxpYyBEZXBhcnR1cmVDaXR5OiBzdHJpbmc7XG4gICAgcHVibGljIE9wZXJhdGluZ0ZsaWdodD86IGFueTtcbiAgICBwdWJsaWMgU3RhdHVzQ2F0ZWdvcnk6IHN0cmluZztcbiAgICBwdWJsaWMgUkJEOiBzdHJpbmc7XG4gICAgcHVibGljIE9yaWdpblJCRD86IGFueTtcbiAgICBwdWJsaWMgVXBncmFkZVJCRD86IGFueTtcbiAgICBwdWJsaWMgVXBncmFkZVR5cGU6IG51bWJlcjtcbiAgICBwdWJsaWMgQ2FiaW4/OiBhbnk7XG4gICAgcHVibGljIFBhc3NlbmdlclJQSHM6IHN0cmluZztcbiAgICBwdWJsaWMgU2VnbWVudFJQSDogc3RyaW5nO1xuICAgIHB1YmxpYyBGbGlnaHRDaGVja0luOiBGbGlnaHRDaGVja0luO1xuICAgIHB1YmxpYyBGbGlnaHRJbmZvPzogYW55O1xuICAgIHB1YmxpYyBTZWxlY3RlZDogYm9vbGVhbjtcbiAgICBwdWJsaWMgSXNUaHJvdWdoT3JDaGFuZ2VPZkdhdWdlRmxpZ2h0OiBib29sZWFuO1xuICB9XG5cbiAgZXhwb3J0IGNsYXNzIFNlZ21lbnRUcmF2ZWxlckluZm8ge1xuICAgIHB1YmxpYyBQYXNzZW5nZXJSUEg6IHN0cmluZztcbiAgICBwdWJsaWMgUGFzc2VuZ2VyUmVmTnVtYmVyOnN0cmluZztcbiAgICBwdWJsaWMgU2VnbWVudFJQSDogc3RyaW5nO1xuICAgIHB1YmxpYyBTZWF0czogYW55O1xuICAgIHB1YmxpYyBQYXNzZW5nZXJGdWxsTmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBTZWxlY3RlZDogYm9vbGVhbjtcbiAgfVxuXG4gIGV4cG9ydCBjbGFzcyBSb290T2JqZWN0IHtcbiAgICBwdWJsaWMgSUQ6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIENoZWNrSW5UeXBlOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBDaGVja0luTWVzc2FnZUZ1bmN0aW9uVHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBEZWxpdmVyeURldGFpbDphbnk7XG4gICAgcHVibGljIENsaWVudFZpZXdNb2RlbDogQ2xpZW50Vmlld01vZGVsID0gbnVsbDtcbiAgICBwdWJsaWMgUGFzc2VuZ2VyTGlzdDogQXJyYXk8UGFzc2VuZ2VyTGlzdD4gPSBbXTtcbiAgICBwdWJsaWMgU2VnbWVudExpc3Q6IEFycmF5PFNlZ21lbnRMaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBTZWdtZW50VHJhdmVsZXJJbmZvOiBBcnJheTxTZWdtZW50VHJhdmVsZXJJbmZvPiA9IFtdO1xuICAgIHB1YmxpYyBTb3VyY2U6c3RyaW5nO1xuICB9XG5cblxuICBleHBvcnQgY2xhc3MgQmFnZ2FnZUluZm9Ub0RlbGV0ZSB7XG4gICAgcHVibGljIEJhZ1RhZ0RldGFpbHM6IEFycmF5PEJhZ1RhZ0RldGFpbERlbGV0ZT4gPSBbXTtcbiAgICBwdWJsaWMgQ2hlY2tlZEJhZ1dlaWdodFRvdGFsOiBzdHJpbmc7XG4gICAgcHVibGljIFVuaXRPZk1lYXN1cmVDb2RlOiBzdHJpbmc7XG4gICAgcHVibGljIENoZWNrZWRCYWdDb3VudFRvdGFsOiBzdHJpbmc7XG4gICAgcHVibGljIFBhc3NlbmdlclJQSCA6IGFueTtcbiAgfVxuXG5cbiAgZXhwb3J0IGNsYXNzIENsaWVudFZpZXdNb2RlbERlbGV0ZSB7XG4gICAgcHVibGljIE1lc3NhZ2VGdW5jdGlvbjogbnVtYmVyO1xuXG4gIH1cbiAgZXhwb3J0IGNsYXNzIEJhZ1RhZ0RldGFpbERlbGV0ZSB7XG4gICAgcHVibGljIEJhZ1RhZ1R5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgU2VyaWFsTnVtYmVyPzogYW55O1xuICAgIHB1YmxpYyBCYWdUYWdDb3VudDogc3RyaW5nO1xuICAgIHB1YmxpYyBDYXJyaWVyQ29kZTogc3RyaW5nO1xuICAgIHB1YmxpYyBJc3N1ZXJDb2RlOiBzdHJpbmc7XG4gICAgcHVibGljIFdlaWdodFRvRGVsZXRlOiBudW1iZXI7XG4gICAgcHVibGljIFdlaWdodFRvRGVsZXRlX0VkaXRhYmxlOiBib29sZWFuO1xuICAgIHB1YmxpYyBTZWdtZW50UlBIOiBzdHJpbmc7XG4gICAgcHVibGljIFJGSVNDX1N1YkNvZGU6IHN0cmluZztcbiAgICBwdWJsaWMgV2VpZ2h0OiBzdHJpbmc7XG4gICAgcHVibGljIEFtb3VudDogc3RyaW5nO1xuICAgIHB1YmxpYyBJc0F1dG9CYWc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgfVxuXG4gIGV4cG9ydCBjbGFzcyBEZWxldGVPYmplY3Qge1xuICAgIHB1YmxpYyBJRDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgQ2hlY2tJblR5cGU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIENoZWNrSW5NZXNzYWdlRnVuY3Rpb25UeXBlOiBzdHJpbmc7XG4gICAgcHVibGljIENsaWVudFZpZXdNb2RlbDogQ2xpZW50Vmlld01vZGVsRGVsZXRlID0gbnVsbDtcbiAgICBwdWJsaWMgUGFzc2VuZ2VyTGlzdDogQXJyYXk8UGFzc2VuZ2VyTGlzdERlbGV0ZT4gPSBbXTtcbiAgICBwdWJsaWMgU2VnbWVudExpc3Q6IEFycmF5PFNlZ21lbnRMaXN0PiA9IFtdO1xuICAgIHB1YmxpYyBEZWxpdmVyeURldGFpbDphbnk7XG4gICAgcHVibGljIFNlZ21lbnRUcmF2ZWxlckluZm86IEFycmF5PFNlZ21lbnRUcmF2ZWxlckluZm8+ID0gW107XG4gICAgcHVibGljIFNvdXJjZTpzdHJpbmc9IFwiVEFCXCI7ICAgIFxuICB9XG59XG4iXX0=