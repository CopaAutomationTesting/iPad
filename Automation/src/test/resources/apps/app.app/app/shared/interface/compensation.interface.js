"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CompensationSearchModule;
(function (CompensationSearchModule) {
    var CompensationRootObject = /** @class */ (function () {
        function CompensationRootObject() {
            this.PassengerList = [];
        }
        return CompensationRootObject;
    }());
    CompensationSearchModule.CompensationRootObject = CompensationRootObject;
    var FlightModel = /** @class */ (function () {
        function FlightModel() {
            this.DestinationAirport = "";
            this.DepartureAirport = "";
            this.FlightNumber = "";
            this.DepartureDate = "";
            this.STA = "";
            this.ETD = "";
            this.STD = "";
            this.Status = "";
            this.DepartureDateTime = "";
            this.finalDestination = "";
            this.multiLegFlight = false;
            this.Legs = [];
        }
        return FlightModel;
    }());
    CompensationSearchModule.FlightModel = FlightModel;
    var CompensationPassengerList = /** @class */ (function () {
        function CompensationPassengerList() {
            this.GivenName = "";
            this.LastName = "";
            this.FullName = "";
            this.SSRs = [];
            this.Tier = "";
            this.CheckedInIndicator = "";
            this.OrderId = "";
            this.PaxType = "";
            this.CompensationReason = "";
            this.AdditionalDetails = "";
            this.OutboundIndicator = "";
            this.IsSelected = false;
            this.PassengerType = "";
            this.TierName = "";
            this.isParitallyPrinted = false;
            this.isEmailParitallySent = false;
            this.isNotPrinted = false;
            this.isEmailSent = false;
            this.IsExistingCompensation = false;
            this.WorldTracerNum = "";
            this.CustomerCareCaseNum = "";
            this.EticketIndicator = false;
            this.OverrideReason = "";
            this.isMonetaryOverridden = false;
            this.MonetaryOverrideReason = "";
            this.isMonetaryParitallyPrinted = false;
            this.isMealParitallyPrinted = false;
            this.isHotelsParitallyPrinted = false;
            this.isTransportParitallyPrinted = false;
            this.isHotelOverridden = false;
            this.HotelOverrideReason = "";
            this.isMealOverridden = false;
            this.MealOverrideReason = "";
            this.isTransportOverridden = false;
            this.TransportOverrideReason = "";
            this.IsCompensationIssued = false;
            this.IsCompensationNotIssued = false;
            this.EtktNumbr = "";
            this.monetary = 0;
            this.monetaryPrintStatus = false;
            this.monetaryEmailStatus = false;
            this.hotel = 0;
            this.hotelPrintStatus = false;
            this.meal = 0;
            this.mealPrintStatus = false;
            this.transportation = 0;
            this.transportPrintStatus = false;
            this.Email = "";
            this.monetaryfreeText = "";
            this.hotelFreeText = "";
            this.hotelDetails = "";
            this.mealFreeText = "";
            this.mealDetails = "";
            this.transportEMD = "";
            this.transportFreeText = "";
            this.copyToSelectedPax = false;
            this.copyToSelectedPaxReaccom = false;
        }
        return CompensationPassengerList;
    }());
    CompensationSearchModule.CompensationPassengerList = CompensationPassengerList;
    var BREEmd = /** @class */ (function () {
        function BREEmd() {
        }
        return BREEmd;
    }());
    CompensationSearchModule.BREEmd = BREEmd;
    var BRECompensation = /** @class */ (function () {
        function BRECompensation() {
        }
        return BRECompensation;
    }());
    CompensationSearchModule.BRECompensation = BRECompensation;
    var SSR = /** @class */ (function () {
        function SSR() {
        }
        return SSR;
    }());
    CompensationSearchModule.SSR = SSR;
    var Etkt = /** @class */ (function () {
        function Etkt() {
        }
        return Etkt;
    }());
    CompensationSearchModule.Etkt = Etkt;
    var ReaccomDetail = /** @class */ (function () {
        function ReaccomDetail() {
            this.ReaccomFlightNo = "";
        }
        return ReaccomDetail;
    }());
    CompensationSearchModule.ReaccomDetail = ReaccomDetail;
    var Bag = /** @class */ (function () {
        function Bag() {
        }
        return Bag;
    }());
    CompensationSearchModule.Bag = Bag;
    var CompEmd = /** @class */ (function () {
        function CompEmd() {
        }
        return CompEmd;
    }());
    CompensationSearchModule.CompEmd = CompEmd;
    var Compensation = /** @class */ (function () {
        function Compensation() {
        }
        return Compensation;
    }());
    CompensationSearchModule.Compensation = Compensation;
    var ExistCompEmd = /** @class */ (function () {
        function ExistCompEmd() {
        }
        return ExistCompEmd;
    }());
    CompensationSearchModule.ExistCompEmd = ExistCompEmd;
    var ExistingCompensation = /** @class */ (function () {
        function ExistingCompensation() {
        }
        return ExistingCompensation;
    }());
    CompensationSearchModule.ExistingCompensation = ExistingCompensation;
})(CompensationSearchModule = exports.CompensationSearchModule || (exports.CompensationSearchModule = {}));
var OrderFQTVStatus = /** @class */ (function () {
    function OrderFQTVStatus() {
        this.IsSelected = false;
    }
    return OrderFQTVStatus;
}());
exports.OrderFQTVStatus = OrderFQTVStatus;
var CompensationOrderID;
(function (CompensationOrderID) {
    var BREEmd = /** @class */ (function () {
        function BREEmd() {
        }
        return BREEmd;
    }());
    CompensationOrderID.BREEmd = BREEmd;
    var BRECompensation = /** @class */ (function () {
        function BRECompensation() {
        }
        return BRECompensation;
    }());
    CompensationOrderID.BRECompensation = BRECompensation;
    var SSR = /** @class */ (function () {
        function SSR() {
        }
        return SSR;
    }());
    CompensationOrderID.SSR = SSR;
    var Etkt = /** @class */ (function () {
        function Etkt() {
        }
        return Etkt;
    }());
    CompensationOrderID.Etkt = Etkt;
    var ReaccomDetail = /** @class */ (function () {
        function ReaccomDetail() {
            this.ReaccomFlightNo = "";
        }
        return ReaccomDetail;
    }());
    CompensationOrderID.ReaccomDetail = ReaccomDetail;
    var Bag = /** @class */ (function () {
        function Bag() {
        }
        return Bag;
    }());
    CompensationOrderID.Bag = Bag;
    var CompEmd = /** @class */ (function () {
        function CompEmd() {
        }
        return CompEmd;
    }());
    CompensationOrderID.CompEmd = CompEmd;
    var Compensation = /** @class */ (function () {
        function Compensation() {
        }
        return Compensation;
    }());
    CompensationOrderID.Compensation = Compensation;
    var ExistCompEmd = /** @class */ (function () {
        function ExistCompEmd() {
        }
        return ExistCompEmd;
    }());
    CompensationOrderID.ExistCompEmd = ExistCompEmd;
    var ExistingCompensation = /** @class */ (function () {
        function ExistingCompensation() {
        }
        return ExistingCompensation;
    }());
    CompensationOrderID.ExistingCompensation = ExistingCompensation;
    var Passenger = /** @class */ (function () {
        function Passenger() {
            this.Isselected = false;
            this.IsExistingCompensation = false;
            this.monetaryfreeText = "";
            this.hotelFreeText = "";
            this.hotelDetails = "";
            this.mealFreeText = "";
            this.transportFreeText = "";
        }
        return Passenger;
    }());
    CompensationOrderID.Passenger = Passenger;
    var FlightSegment = /** @class */ (function () {
        function FlightSegment() {
        }
        return FlightSegment;
    }());
    CompensationOrderID.FlightSegment = FlightSegment;
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    CompensationOrderID.RootObject = RootObject;
})(CompensationOrderID = exports.CompensationOrderID || (exports.CompensationOrderID = {}));
var IssueCompensationList = /** @class */ (function () {
    function IssueCompensationList() {
        this.IsSelected = false;
        this.FullName = "";
        this.SSR = "";
        this.Tier = "";
        this.Cabin = "";
        this.OrderId = "";
        this.Amt = "";
        this.Hotel = "";
        this.Meal = "";
        this.Trans = "";
        this.Email = "Edit";
        this.AdditionalDetails = "Edit";
    }
    return IssueCompensationList;
}());
exports.IssueCompensationList = IssueCompensationList;
var CompensationReasonModule;
(function (CompensationReasonModule) {
    var CompensationReason = /** @class */ (function () {
        function CompensationReason() {
        }
        return CompensationReason;
    }());
    CompensationReasonModule.CompensationReason = CompensationReason;
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    CompensationReasonModule.RootObject = RootObject;
})(CompensationReasonModule = exports.CompensationReasonModule || (exports.CompensationReasonModule = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGVuc2F0aW9uLmludGVyZmFjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbXBlbnNhdGlvbi5pbnRlcmZhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFjLHdCQUF3QixDQWtSckM7QUFsUkQsV0FBYyx3QkFBd0I7SUFDbEM7UUFBQTtZQUVXLGtCQUFhLEdBQXFDLEVBQUUsQ0FBQztRQUVoRSxDQUFDO1FBQUQsNkJBQUM7SUFBRCxDQUFDLEFBSkQsSUFJQztJQUpZLCtDQUFzQix5QkFJbEMsQ0FBQTtJQUVEO1FBQUE7WUFFVyx1QkFBa0IsR0FBVyxFQUFFLENBQUM7WUFDaEMscUJBQWdCLEdBQVcsRUFBRSxDQUFDO1lBQzlCLGlCQUFZLEdBQVcsRUFBRSxDQUFDO1lBQzFCLGtCQUFhLEdBQVcsRUFBRSxDQUFDO1lBQzNCLFFBQUcsR0FBVyxFQUFFLENBQUM7WUFDakIsUUFBRyxHQUFXLEVBQUUsQ0FBQztZQUNqQixRQUFHLEdBQVcsRUFBRSxDQUFDO1lBQ2pCLFdBQU0sR0FBVyxFQUFFLENBQUM7WUFDcEIsc0JBQWlCLEdBQVksRUFBRSxDQUFDO1lBRWhDLHFCQUFnQixHQUFHLEVBQUUsQ0FBQztZQUN0QixtQkFBYyxHQUFhLEtBQUssQ0FBQztZQUNqQyxTQUFJLEdBQWlCLEVBQUUsQ0FBQztRQUNuQyxDQUFDO1FBQUQsa0JBQUM7SUFBRCxDQUFDLEFBZkQsSUFlQztJQWZZLG9DQUFXLGNBZXZCLENBQUE7SUFDRDtRQUFBO1lBQ1csY0FBUyxHQUFXLEVBQUUsQ0FBQztZQUN2QixhQUFRLEdBQVcsRUFBRSxDQUFDO1lBQ3RCLGFBQVEsR0FBVyxFQUFFLENBQUM7WUFDdEIsU0FBSSxHQUFrQixFQUFFLENBQUM7WUFDekIsU0FBSSxHQUFXLEVBQUUsQ0FBQztZQUVsQix1QkFBa0IsR0FBVyxFQUFFLENBQUM7WUFDaEMsWUFBTyxHQUFXLEVBQUUsQ0FBQztZQUNyQixZQUFPLEdBQVcsRUFBRSxDQUFDO1lBQ3JCLHVC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QixLQUFuQiwyQkFBbUIsUUFvTmhDO0FBR0Q7SUFBQTtRQUNXLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFDNUIsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQUN0QixRQUFHLEdBQVcsRUFBRSxDQUFDO1FBQ2pCLFNBQUksR0FBVyxFQUFFLENBQUM7UUFDbEIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUNuQixZQUFPLEdBQVcsRUFBRSxDQUFDO1FBQ3JCLFFBQUcsR0FBVyxFQUFFLENBQUM7UUFDakIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUNuQixTQUFJLEdBQVcsRUFBRSxDQUFDO1FBQ2xCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsVUFBSyxHQUFXLE1BQU0sQ0FBQztRQUN2QixzQkFBaUIsR0FBVyxNQUFNLENBQUM7SUFDOUMsQ0FBQztJQUFELDRCQUFDO0FBQUQsQ0FBQyxBQWJELElBYUM7QUFiWSxzREFBcUI7QUF5Q2xDLElBQWMsd0JBQXdCLENBZ0JyQztBQWhCRCxXQUFjLHdCQUF3QjtJQUVsQztRQUFBO1FBR0EsQ0FBQztRQUFELHlCQUFDO0lBQUQsQ0FBQyxBQUhELElBR0M7SUFIWSwyQ0FBa0IscUJBRzlCLENBQUE7SUFFRDtRQUFBO1FBT0EsQ0FBQztRQUFELGlCQUFDO0lBQUQsQ0FBQyxBQVBELElBT0M7SUFQWSxtQ0FBVSxhQU90QixDQUFBO0FBRUwsQ0FBQyxFQWhCYSx3QkFBd0IsR0FBeEIsZ0NBQXdCLEtBQXhCLGdDQUF3QixRQWdCckMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgbW9kdWxlIENvbXBlbnNhdGlvblNlYXJjaE1vZHVsZSB7XG4gICAgZXhwb3J0IGNsYXNzIENvbXBlbnNhdGlvblJvb3RPYmplY3Qge1xuICAgICAgICBwdWJsaWMgRmxpZ2h0TW9kZWw6IEZsaWdodE1vZGVsO1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyTGlzdDogQXJyYXk8Q29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdD4gPSBbXTtcblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBGbGlnaHRNb2RlbCB7XG4gICAgICAgIHB1YmxpYyBGbGlnaHRTZWdtZW50SWQ6IG51bWJlcjtcbiAgICAgICAgcHVibGljIERlc3RpbmF0aW9uQWlycG9ydDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIERlcGFydHVyZUFpcnBvcnQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBGbGlnaHROdW1iZXI6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBEZXBhcnR1cmVEYXRlOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgU1RBOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgRVREOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgU1REOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgU3RhdHVzOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgRGVwYXJ0dXJlRGF0ZVRpbWU6ICBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgQXJyaXZhbERhdGVUaW1lOiBEYXRlO1xuICAgICAgICBwdWJsaWMgZmluYWxEZXN0aW5hdGlvbiA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBtdWx0aUxlZ0ZsaWdodCA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIExlZ3M6IEFycmF5PHN0cmluZz4gPVtdO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCB7XG4gICAgICAgIHB1YmxpYyBHaXZlbk5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBMYXN0TmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIEZ1bGxOYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgU1NSczogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgICAgICBwdWJsaWMgVGllcjogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIENhYmluOiBzdHJpbmcgO1xuICAgICAgICBwdWJsaWMgQ2hlY2tlZEluSW5kaWNhdG9yOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgT3JkZXJJZDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFBheFR5cGU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBDb21wZW5zYXRpb25SZWFzb246IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBBZGRpdGlvbmFsRGV0YWlsczogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIE91dGJvdW5kSW5kaWNhdG9yIDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIElzU2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlclR5cGU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBUaWVyTmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIGlzUGFyaXRhbGx5UHJpbnRlZCA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIGlzRW1haWxQYXJpdGFsbHlTZW50IDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgaXNOb3RQcmludGVkIDogYm9vbGVhbiA9ZmFsc2U7XG4gICAgICAgIHB1YmxpYyBpc0VtYWlsU2VudDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgQ29tcGVuc2F0aW9uUmVhc29uSWQ6IG51bWJlcjtcbiAgICAgICAgcHVibGljIG1vbmV0YXJ5Y291bnQgOiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBJc0V4aXN0aW5nQ29tcGVuc2F0aW9uOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBTU1I/OiBTU1JbXTtcbiAgICAgICAgcHVibGljIFNTUnNDb3VudCA6IG51bWJlcjtcbiAgICAgICAgcHVibGljIEZsaWdodFNlZ21lbnRJZDogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyU2VxPzogYW55O1xuICAgICAgICBwdWJsaWMgU3VybmFtZU51bT86IGFueTtcbiAgICAgICAgcHVibGljIFdvcmxkVHJhY2VyTnVtIDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIEN1c3RvbWVyQ2FyZUNhc2VOdW06IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBGaXJzdG5hbWVOdW0/OiBhbnk7XG4gICAgICAgIHB1YmxpYyBGcXR2Q2M/OiBhbnk7XG4gICAgICAgIHB1YmxpYyBGcXR2VGllcjogYW55O1xuICAgICAgICBwdWJsaWMgRnF0dk51bWJlcj86IGFueTtcbiAgICAgICAgcHVibGljIFBheFN0YXR1cz86IGFueTtcbiAgICAgICAgcHVibGljIFBheFJQSDogYW55O1xuICAgICAgICBwdWJsaWMgRGVzdCA6IHN0cmluZztcbiAgICAgICAgcHVibGljIFBheFNwbENoYXIgOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBPcmlnaW4gOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBFdGlja2V0SW5kaWNhdG9yIDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBPdmVycmlkZVJlYXNvbiA6IHN0cmluZyA9XCJcIjtcbiAgICAgICAgcHVibGljIGlzTW9uZXRhcnlPdmVycmlkZGVuIDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBNb25ldGFyeU92ZXJyaWRlUmVhc29uIDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIGlzTW9uZXRhcnlQYXJpdGFsbHlQcmludGVkIDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgaXNNZWFsUGFyaXRhbGx5UHJpbnRlZCA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIGlzSG90ZWxzUGFyaXRhbGx5UHJpbnRlZCA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIGlzVHJhbnNwb3J0UGFyaXRhbGx5UHJpbnRlZCA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIGlzSG90ZWxPdmVycmlkZGVuIDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBIb3RlbE92ZXJyaWRlUmVhc29uIDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIGlzTWVhbE92ZXJyaWRkZW4gOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIE1lYWxPdmVycmlkZVJlYXNvbiA6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBpc1RyYW5zcG9ydE92ZXJyaWRkZW4gOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIFRyYW5zcG9ydE92ZXJyaWRlUmVhc29uIDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFBheEVtYWlsQWRkcmVzcz86IGFueTtcbiAgICAgICAgcHVibGljIFVwZGF0ZUxvY2tOYnI/OiBhbnk7XG4gICAgICAgIHB1YmxpYyBCb2FyZGluZ0luZGljYXRvciA6IGFueTtcbiAgICAgICAgcHVibGljIE5vblJldmVudWVJbmRpY2F0b3I6IGFueTtcbiAgICAgICAgcHVibGljIEV0aWNrZXRTdGF0dXM6IGFueTtcbiAgICAgICAgcHVibGljIElzQ29tcGVuc2F0aW9uSXNzdWVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBJc0NvbXBlbnNhdGlvbk5vdElzc3VlZCA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIEV0a3Q/OiBFdGt0W107XG4gICAgICAgIHB1YmxpYyBFdGt0TnVtYnIgOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgRXRpY2tldE91dG9mU3luY0luZGljYXRvciA6IGFueTtcbiAgICAgICAgcHVibGljIFJlYWNjb21EZXRhaWxzPzogUmVhY2NvbURldGFpbFtdO1xuICAgICAgICBwdWJsaWMgQmFncz86IEJhZ1tdO1xuICAgICAgICBwdWJsaWMgQ29tcGVuc2F0aW9ucz86IENvbXBlbnNhdGlvbltdO1xuICAgICAgICBwdWJsaWMgRXhpc3RpbmdDb21wZW5zYXRpb25zPzogRXhpc3RpbmdDb21wZW5zYXRpb25bXTtcbiAgICAgICAgcHVibGljIEJSRUNvbXBlbnNhdGlvbjogQlJFQ29tcGVuc2F0aW9uW107XG4gICAgICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBtb25ldGFyeTogbnVtYmVyID0wO1xuICAgICAgICBwdWJsaWMgbW9uZXRhcnlJbml0aWFsVmFsdWUgOiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBtb25ldGFyeVRlbXBWYWx1ZSA6IG51bWJlcjtcbiAgICAgICAgcHVibGljIG1vbmV0YXJ5TG93ZXJMaW1pdDogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgbW9uZXRhcnlIaWdoZXJMaW1pdDogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgbW9uZXRhcnlQcmludFN0YXR1cyA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIG1vbmV0YXJ5RW1haWxTdGF0dXMgOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIGhvdGVsOiBudW1iZXIgPTA7XG4gICAgICAgIHB1YmxpYyBob3RlbEluaXRpYWxWYWx1ZSA6IG51bWJlcjtcbiAgICAgICAgcHVibGljIGhvdGVsVGVtcFZhbHVlIDogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgaG90ZWxMb3dlckxpbWl0OiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBob3RlbEhpZ2hlckxpbWl0OiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBob3RlbFByaW50U3RhdHVzIDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgbWVhbDogbnVtYmVyID0wO1xuICAgICAgICBwdWJsaWMgbWVhbEluaXRpYWxWYWx1ZSA6IG51bWJlcjtcbiAgICAgICAgcHVibGljIG1lYWxUZW1wVmFsdWUgOiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBtZWFsTG93ZXJMaW1pdDogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgbWVhbEhpZ2hlckxpbWl0OiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBtZWFsUHJpbnRTdGF0dXMgOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyB0cmFuc3BvcnRhdGlvbjogbnVtYmVyID0wO1xuICAgICAgICBwdWJsaWMgdHJhbnNwb3J0YXRpb25Jbml0aWFsVmFsdWUgOiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyB0cmFuc3BvcnRhdGlvblRlbXBWYWx1ZSA6IG51bWJlcjtcbiAgICAgICAgcHVibGljIHRyYW5zcG9ydGF0aW9uTG93ZXJMaW1pdDogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgdHJhbnNwb3J0YXRpb25IaWdoZXJMaW1pdDogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgdHJhbnNwb3J0UHJpbnRTdGF0dXMgOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBCUkVFbWQ6IEJSRUVtZFtdO1xuICAgICAgICBwdWJsaWMgRW1haWw6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBtb25ldGFyeWVuZG9yc2VtZW50VGV4dEl0ZW1zOiBzdHJpbmdbXTtcbiAgICAgICAgcHVibGljIG1vbmV0YXJ5ZnJlZVRleHQgOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgaG90ZWxlbmRvcnNlbWVudFRleHRJdGVtczogc3RyaW5nW107XG4gICAgICAgIHB1YmxpYyBob3RlbEZyZWVUZXh0IDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIGhvdGVsRGV0YWlscyA6IHN0cmluZyA9XCJcIjtcbiAgICAgICAgcHVibGljIG1lYWxlbmRvcnNlbWVudFRleHRJdGVtczogc3RyaW5nW107XG4gICAgICAgIHB1YmxpYyBtZWFsRnJlZVRleHQgOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgbWVhbERldGFpbHMgOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgdHJhbnNwb3J0RU1EIDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIHRyYW5zcG9ydGF0aW9uZW5kb3JzZW1lbnRUZXh0SXRlbXM6IHN0cmluZ1tdO1xuICAgICAgICBwdWJsaWMgdHJhbnNwb3J0RnJlZVRleHQgOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgY29weVRvU2VsZWN0ZWRQYXggOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBjb3B5VG9TZWxlY3RlZFBheFJlYWNjb20gOiBib29sZWFuID0gZmFsc2U7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBCUkVFbWQge1xuICAgICAgICBwdWJsaWMgY29tcGVuc2F0aW9uQ2F1c2U6IHN0cmluZztcbiAgICAgICAgcHVibGljIGNvbXBlbnNhdGlvblR5cGU6IHN0cmluZztcbiAgICAgICAgLy8gcHVibGljIGVtZEVuZG9yc2FibGU6IGJvb2xlYW47XG4gICAgICAgIC8vIHB1YmxpYyBlbWRFeGNoYW5nZWFibGU6IGJvb2xlYW47XG4gICAgICAgIHB1YmxpYyBjdXJyZW5jeTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgZW1kUmVmdW5kYWJsZTogYm9vbGVhbjtcbiAgICAgICAgcHVibGljIGVtZFR5cGU6IHN0cmluZztcbiAgICAgICAgLy8gcHVibGljIGVtZFVzZWRBdElzc3VhbmNlOiBib29sZWFuO1xuICAgICAgICBwdWJsaWMgZW5kb3JzZW1lbnRUZXh0SXRlbXM6IHN0cmluZ1tdO1xuICAgICAgICBwdWJsaWMgZm9ybU9mUGF5bWVudDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgcHJvZHVjdENvZGU6IHN0cmluZztcbiAgICAgICAgcHVibGljIHByb2R1Y3ROYW1lOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBzdWJQcm9kdWN0Q29kZTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgYWNjb3VudENvZGU6c3RyaW5nO1xuICAgICAgICBwdWJsaWMgZW1kRW5kb3JzYWJsZTpzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBlbWRFeGNoYW5nZWFibGU6IHN0cmluZztcbiAgICAgICAgcHVibGljIGVtZFVzZWRBdElzc3VhbmNlIDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgSXNSZWZ1bmRhYmxlOiBzdHJpbmc7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBCUkVDb21wZW5zYXRpb24ge1xuICAgICAgICBwdWJsaWMgYW1vdW50OiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBjb21wZW5zYXRpb25UeXBlOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBsb3dlckxpbWl0OiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyB1cHBlckxpbWl0OiBudW1iZXI7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBTU1Ige1xuICAgICAgICBwdWJsaWMgRmxpZ2h0U2VnbWVudElkOiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBQYXNzZW5nZXJTZXE6IG51bWJlcjtcbiAgICAgICAgcHVibGljIFNzckNvZGU6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRXRrdCB7XG4gICAgICAgIHB1YmxpYyBGbGlnaHRTZWdtZW50SWQ6IG51bWJlcjtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlclNlcTogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgVGlja2V0TmJyOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBDcG5OdW06IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUmVhY2NvbURldGFpbCB7XG4gICAgICAgIHB1YmxpYyBGbGlnaHRTZWdtZW50SWQ6IG51bWJlcjtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlclNlcTogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgUmVhY29tU2VxOiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBGcm9tVG9GbGFnOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBHVUlEaXNwbGF5RmxhZzogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgUmVhY2NvbUFpcmxpbmVDb2RlOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBSZWFjY29tRmxpZ2h0Tm86IHN0cmluZz1cIlwiO1xuICAgICAgICBwdWJsaWMgUmVhY2NvbUZsaWdodER0OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBSZWFjY29tQm9hcmRDaXR5Q2Q6IHN0cmluZztcbiAgICAgICAgcHVibGljIFJlYWNjb21PZmZDaXR5Q2Q6IHN0cmluZztcbiAgICAgICAgcHVibGljIFVwZGF0ZUxvY2tOYnI6IG51bWJlcjtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQmFnIHtcbiAgICAgICAgcHVibGljIEZsaWdodFNlZ21lbnRJZDogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyU2VxOiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBCYWd0YWdOYnI6IHN0cmluZztcbiAgICAgICAgcHVibGljIFVwZGF0ZUxvY2tOYnI6IG51bWJlcjtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ29tcEVtZCB7XG4gICAgICAgIHB1YmxpYyBGbGlnaHRTZWdtZW50SWQ6IG51bWJlcjtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlclNlcTogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgQ29tcFNlcTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgUHJpbWFyeURvY3VtZW50TmJyOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBQcmltYXJ5QWlybGluZUNkOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBJc3N1ZUR0OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBGaXJzdE5tOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBMYXN0Tm06IHN0cmluZztcbiAgICAgICAgcHVibGljIFVzZXJJZDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgUmVhc29uRm9ySXNzdWFuY2VTdWJDZDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgUmVhc29uRm9ySXNzdWFuY2VDZDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgRW5kb3JzZW1lbnRzMVR4dDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgUmVtYXJrVHh0OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBDb21wQW10OiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBDb21wQ3VycmVuY3lDZDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgVm91Y2hlckNudDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgT3ZlcnJpZGVSZWFzb24/OiBhbnk7XG4gICAgICAgIHB1YmxpYyBQcmludFN0YXR1czogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgRW1haWxTdGF0dXM6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ29tcGVuc2F0aW9uIHtcbiAgICAgICAgcHVibGljIEZsaWdodFNlZ21lbnRJZDogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyU2VxOiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBDb21wU2VxOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBDb21wUmVhc29uSWQ6IG51bWJlcjtcbiAgICAgICAgcHVibGljIENvbXBSZWFzb25UZXh0OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBDb21wVHlwZUlkOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBDb21wVHlwZVRleHQ6IHN0cmluZztcbiAgICAgICAgcHVibGljIEFpcmxpbmVDb2RlOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBGbGlnaHRObzogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgRGVwYXJ0dXJlRHQ6IHN0cmluZztcbiAgICAgICAgcHVibGljIENvbXBBbXQ6IG51bWJlcjtcbiAgICAgICAgcHVibGljIENvbXBDdXJyZW5jeUNkOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBWb3VjaGVyQ250OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBPdmVycmlkZVJlYXNvbjogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgVXBkYXRlTG9ja05icjogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgRW1kczogQ29tcEVtZFtdO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFeGlzdENvbXBFbWQge1xuICAgICAgICBwdWJsaWMgRmxpZ2h0U2VnbWVudElkOiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBQYXNzZW5nZXJTZXE6IG51bWJlcjtcbiAgICAgICAgcHVibGljIENvbXBTZXE6IHN0cmluZztcbiAgICAgICAgcHVibGljIFByaW1hcnlEb2N1bWVudE5icjogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgUHJpbWFyeUFpcmxpbmVDZDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgSXNzdWVEdDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgRmlyc3RObTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgTGFzdE5tOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBVc2VySWQ6IHN0cmluZztcbiAgICAgICAgcHVibGljIFJlYXNvbkZvcklzc3VhbmNlU3ViQ2Q6IHN0cmluZztcbiAgICAgICAgcHVibGljIFJlYXNvbkZvcklzc3VhbmNlQ2Q6IHN0cmluZztcbiAgICAgICAgcHVibGljIEVuZG9yc2VtZW50czFUeHQ6IHN0cmluZztcbiAgICAgICAgcHVibGljIFJlbWFya1R4dDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgQ29tcEFtdDogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgQ29tcEN1cnJlbmN5Q2Q6IHN0cmluZztcbiAgICAgICAgcHVibGljIFZvdWNoZXJDbnQ6IHN0cmluZztcbiAgICAgICAgcHVibGljIE92ZXJyaWRlUmVhc29uPzogYW55O1xuICAgICAgICBwdWJsaWMgUHJpbnRTdGF0dXM6IHN0cmluZztcbiAgICAgICAgcHVibGljIEVtYWlsU3RhdHVzOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEV4aXN0aW5nQ29tcGVuc2F0aW9uIHtcbiAgICAgICAgcHVibGljIEZsaWdodFNlZ21lbnRJZDogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyU2VxOiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBDb21wU2VxOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBDb21wUmVhc29uSWQ6IHN0cmluZztcbiAgICAgICAgcHVibGljIENvbXBSZWFzb25UZXh0OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBDb21wVHlwZUlkOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBDb21wVHlwZVRleHQ6IHN0cmluZztcbiAgICAgICAgcHVibGljIENvbXBBbXQ6IG51bWJlcjtcbiAgICAgICAgcHVibGljIEFpcmxpbmVDb2RlOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBEZXBhcnR1cmVEdDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgRmxpZ2h0Tm8gOiBhbnk7XG4gICAgICAgIHB1YmxpYyBDb21wQ3VycmVuY3lDZDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgVm91Y2hlckNudDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgT3ZlcnJpZGVSZWFzb246IHN0cmluZztcbiAgICAgICAgcHVibGljIFVwZGF0ZUxvY2tOYnI6IG51bWJlcjtcbiAgICAgICAgcHVibGljIEVtZHM6IEV4aXN0Q29tcEVtZFtdO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE9yZGVyRlFUVlN0YXR1cyB7XG4gICAgcHVibGljIE9yZGVySUQ6IHN0cmluZztcbiAgICBwdWJsaWMgUGFzc2VuZ2VyTmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBTdGF0dXM6IHN0cmluZztcbiAgICBwdWJsaWMgRmxpZ2h0TnVtYmVyOiBzdHJpbmc7XG4gICAgcHVibGljIEZsaWdodERhdGU6IERhdGU7XG4gICAgcHVibGljIFJQSDogc3RyaW5nO1xuICAgIHB1YmxpYyBPcmlnaW46IHN0cmluZztcbiAgICBwdWJsaWMgRGVzdGluYXRpb246IHN0cmluZztcbiAgICBwdWJsaWMgSXNTZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xufVxuXG5leHBvcnQgbW9kdWxlIENvbXBlbnNhdGlvbk9yZGVySUQge1xuXG4gICAgZXhwb3J0IGNsYXNzIEJSRUVtZCB7XG4gICAgICAgIHB1YmxpYyBjb21wZW5zYXRpb25DYXVzZTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgY29tcGVuc2F0aW9uVHlwZTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgZW1kRW5kb3JzYWJsZTogYm9vbGVhbjtcbiAgICAgICAgcHVibGljIGVtZEV4Y2hhbmdlYWJsZTogYm9vbGVhbjtcbiAgICAgICAgcHVibGljIGN1cnJlbmN5OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBlbWRSZWZ1bmRhYmxlOiBib29sZWFuO1xuICAgICAgICBwdWJsaWMgZW1kVHlwZTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgZW1kVXNlZEF0SXNzdWFuY2U6IGJvb2xlYW47XG4gICAgICAgIHB1YmxpYyBlbmRvcnNlbWVudFRleHRJdGVtczogc3RyaW5nW107XG4gICAgICAgIHB1YmxpYyBmb3JtT2ZQYXltZW50OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBwcm9kdWN0Q29kZTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgcHJvZHVjdE5hbWU6IHN0cmluZztcbiAgICAgICAgcHVibGljIHN1YlByb2R1Y3RDb2RlOiBzdHJpbmc7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBCUkVDb21wZW5zYXRpb24ge1xuICAgICAgICBwdWJsaWMgYW1vdW50OiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBjb21wZW5zYXRpb25UeXBlOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBsb3dlckxpbWl0OiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyB1cHBlckxpbWl0OiBudW1iZXI7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBTU1Ige1xuICAgICAgICBwdWJsaWMgRmxpZ2h0U2VnbWVudElkOiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBQYXNzZW5nZXJTZXE6IG51bWJlcjtcbiAgICAgICAgcHVibGljIFNzckNvZGU6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRXRrdCB7XG4gICAgICAgIHB1YmxpYyBGbGlnaHRTZWdtZW50SWQ6IG51bWJlcjtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlclNlcTogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgVGlja2V0TmJyOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBDcG5OdW06IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUmVhY2NvbURldGFpbCB7XG4gICAgICAgIHB1YmxpYyBGbGlnaHRTZWdtZW50SWQ6IG51bWJlcjtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlclNlcTogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgUmVhY29tU2VxOiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBGcm9tVG9GbGFnOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBHVUlEaXNwbGF5RmxhZzogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgUmVhY2NvbUFpcmxpbmVDb2RlOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBSZWFjY29tRmxpZ2h0Tm86IHN0cmluZz1cIlwiO1xuICAgICAgICBwdWJsaWMgUmVhY2NvbUZsaWdodER0OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBSZWFjY29tQm9hcmRDaXR5Q2Q6IHN0cmluZztcbiAgICAgICAgcHVibGljIFJlYWNjb21PZmZDaXR5Q2Q6IHN0cmluZztcbiAgICAgICAgcHVibGljIFVwZGF0ZUxvY2tOYnI6IG51bWJlcjtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQmFnIHtcbiAgICAgICAgcHVibGljIEZsaWdodFNlZ21lbnRJZDogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyU2VxOiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBCYWd0YWdOYnI6IHN0cmluZztcbiAgICAgICAgcHVibGljIFVwZGF0ZUxvY2tOYnI6IG51bWJlcjtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ29tcEVtZCB7XG4gICAgICAgIHB1YmxpYyBGbGlnaHRTZWdtZW50SWQ6IG51bWJlcjtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlclNlcTogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgQ29tcFNlcTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgUHJpbWFyeURvY3VtZW50TmJyOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBQcmltYXJ5QWlybGluZUNkOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBJc3N1ZUR0OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBGaXJzdE5tOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBMYXN0Tm06IHN0cmluZztcbiAgICAgICAgcHVibGljIFVzZXJJZDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgUmVhc29uRm9ySXNzdWFuY2VTdWJDZDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgUmVhc29uRm9ySXNzdWFuY2VDZDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgRW5kb3JzZW1lbnRzMVR4dDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgUmVtYXJrVHh0OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBDb21wQW10OiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBDb21wQ3VycmVuY3lDZDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgVm91Y2hlckNudDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgT3ZlcnJpZGVSZWFzb24/OiBhbnk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIENvbXBlbnNhdGlvbiB7XG4gICAgICAgIHB1YmxpYyBGbGlnaHRTZWdtZW50SWQ6IG51bWJlcjtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlclNlcTogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgQ29tcFNlcTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgQ29tcFJlYXNvbklkOiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBDb21wUmVhc29uVGV4dDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgQ29tcFR5cGVJZDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgQ29tcFR5cGVUZXh0OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBBaXJsaW5lQ29kZTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgRmxpZ2h0Tm86IHN0cmluZztcbiAgICAgICAgcHVibGljIERlcGFydHVyZUR0OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBDb21wQW10OiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBDb21wQ3VycmVuY3lDZDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgVm91Y2hlckNudDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgT3ZlcnJpZGVSZWFzb246IHN0cmluZztcbiAgICAgICAgcHVibGljIFVwZGF0ZUxvY2tOYnI6IG51bWJlcjtcbiAgICAgICAgcHVibGljIEVtZHM6IENvbXBFbWRbXTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRXhpc3RDb21wRW1kIHtcbiAgICAgICAgcHVibGljIEZsaWdodFNlZ21lbnRJZDogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyU2VxOiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBDb21wU2VxOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBQcmltYXJ5RG9jdW1lbnROYnI6IHN0cmluZztcbiAgICAgICAgcHVibGljIFByaW1hcnlBaXJsaW5lQ2Q6IHN0cmluZztcbiAgICAgICAgcHVibGljIElzc3VlRHQ6IHN0cmluZztcbiAgICAgICAgcHVibGljIEZpcnN0Tm06IHN0cmluZztcbiAgICAgICAgcHVibGljIExhc3RObTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgVXNlcklkOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBSZWFzb25Gb3JJc3N1YW5jZVN1YkNkOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBSZWFzb25Gb3JJc3N1YW5jZUNkOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBFbmRvcnNlbWVudHMxVHh0OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBSZW1hcmtUeHQ6IHN0cmluZztcbiAgICAgICAgcHVibGljIENvbXBBbXQ6IG51bWJlcjtcbiAgICAgICAgcHVibGljIENvbXBDdXJyZW5jeUNkOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBWb3VjaGVyQ250OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBPdmVycmlkZVJlYXNvbj86IGFueTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRXhpc3RpbmdDb21wZW5zYXRpb24ge1xuICAgICAgICBwdWJsaWMgRmxpZ2h0U2VnbWVudElkOiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBQYXNzZW5nZXJTZXE6IG51bWJlcjtcbiAgICAgICAgcHVibGljIENvbXBTZXE6IHN0cmluZztcbiAgICAgICAgcHVibGljIENvbXBSZWFzb25JZDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgQ29tcFJlYXNvblRleHQ6IHN0cmluZztcbiAgICAgICAgcHVibGljIENvbXBUeXBlSWQ6IHN0cmluZztcbiAgICAgICAgcHVibGljIENvbXBUeXBlVGV4dDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgQ29tcEFtdDogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgQWlybGluZUNvZGU6IHN0cmluZztcbiAgICAgICAgcHVibGljIERlcGFydHVyZUR0OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBGbGlnaHRObyA6IGFueTtcbiAgICAgICAgcHVibGljIENvbXBDdXJyZW5jeUNkOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBWb3VjaGVyQ250OiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBPdmVycmlkZVJlYXNvbjogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgVXBkYXRlTG9ja05icjogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgRW1kczogRXhpc3RDb21wRW1kW107XG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBQYXNzZW5nZXIge1xuICAgICAgICBJc3NlbGVjdGVkIDogYm9vbGVhbiA9ZmFsc2U7XG4gICAgICAgIEZsaWdodFNlZ21lbnRJZD86IG51bWJlcjtcbiAgICAgICAgUGFzc2VuZ2VyU2VxPzogbnVtYmVyO1xuICAgICAgICBPcmRlcklkOiBzdHJpbmc7XG4gICAgICAgIEZ1bGxOYW1lIDpzdHJpbmc7XG4gICAgICAgIEdpdmVuTmFtZSA6IHN0cmluZztcbiAgICAgICAgTGFzdE5hbWUgOiBzdHJpbmc7XG4gICAgICAgIFBheExhc3RObTogc3RyaW5nO1xuICAgICAgICBQYXhGaXJzdE5tOiBzdHJpbmc7XG4gICAgICAgIFBheFR5cGU6IHN0cmluZztcbiAgICAgICAgRnF0dkNjPzogYW55O1xuICAgICAgICBGcXR2TnVtYmVyPzogYW55O1xuICAgICAgICBQYXhTdGF0dXM/OiBhbnk7XG4gICAgICAgIFBheEVtYWlsQWRkcmVzcz86IGFueTtcbiAgICAgICAgUGF4Q29tcFJlYXNvbklEOiBzdHJpbmc7XG4gICAgICAgIFdvcmxkVHJhY2VyTnVtIDogc3RyaW5nO1xuICAgICAgICBDdXN0b21lckNhcmVDYXNlTnVtOiBzdHJpbmc7XG4gICAgICAgIElzRXhpc3RpbmdDb21wZW5zYXRpb246IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgQ29tcGVuc2F0aW9uUmVhc29uIDogc3RyaW5nO1xuICAgICAgICBVcGRhdGVMb2NrTmJyPzogbnVtYmVyO1xuICAgICAgICBBZGRpdGlvbmFsRGV0YWlscyA6IHN0cmluZztcbiAgICAgICAgRnF0dlRpZXI6IHN0cmluZztcbiAgICAgICAgQ29tcGVuc2F0aW9uUmVhc29uSWQgOiBudW1iZXI7XG4gICAgICAgIENhYmluOiBzdHJpbmc7XG4gICAgICAgIFBheFJQSDogc3RyaW5nO1xuICAgICAgICBJc0NvbXBlbnNhdGlvbklzc3VlZDogYm9vbGVhbjtcbiAgICAgICAgU1NSPzogU1NSW107XG4gICAgICAgIEV0a3Q/OiBFdGt0W107XG4gICAgICAgIFJlYWNjb21EZXRhaWxzPzogUmVhY2NvbURldGFpbFtdO1xuICAgICAgICBCYWdzPzogQmFnW107XG4gICAgICAgIENvbXBlbnNhdGlvbnM/OiBDb21wZW5zYXRpb25bXTtcbiAgICAgICAgRXhpc3RpbmdDb21wZW5zYXRpb25zPzogRXhpc3RpbmdDb21wZW5zYXRpb25bXTtcbiAgICAgICAgQlJFQ29tcGVuc2F0aW9uOiBCUkVDb21wZW5zYXRpb25bXTtcbiAgICAgICAgdHlwZTogc3RyaW5nO1xuICAgICAgICBtb25ldGFyeTogbnVtYmVyO1xuICAgICAgICBtb25ldGFyeUxvd2VyTGltaXQ6IG51bWJlcjtcbiAgICAgICAgbW9uZXRhcnlIaWdoZXJMaW1pdDogbnVtYmVyO1xuICAgICAgICBob3RlbDogbnVtYmVyO1xuICAgICAgICBob3RlbExvd2VyTGltaXQ6IG51bWJlcjtcbiAgICAgICAgaG90ZWxIaWdoZXJMaW1pdDogbnVtYmVyO1xuICAgICAgICBtZWFsOiBudW1iZXI7XG4gICAgICAgIG1lYWxMb3dlckxpbWl0OiBudW1iZXI7XG4gICAgICAgIG1lYWxIaWdoZXJMaW1pdDogbnVtYmVyO1xuICAgICAgICB0cmFuc3BvcnRhdGlvbjogbnVtYmVyO1xuICAgICAgICB0cmFuc3BvcnRhdGlvbkxvd2VyTGltaXQ6IG51bWJlcjtcbiAgICAgICAgdHJhbnNwb3J0YXRpb25IaWdoZXJMaW1pdDogbnVtYmVyO1xuICAgICAgICBCUkVFbWQ6IEJSRUVtZFtdO1xuICAgICAgICBFbWFpbDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgbW9uZXRhcnllbmRvcnNlbWVudFRleHRJdGVtczogc3RyaW5nW107XG4gICAgICAgIHB1YmxpYyBtb25ldGFyeWZyZWVUZXh0IDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIGhvdGVsZW5kb3JzZW1lbnRUZXh0SXRlbXM6IHN0cmluZ1tdO1xuICAgICAgICBwdWJsaWMgaG90ZWxGcmVlVGV4dCA6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBob3RlbERldGFpbHMgOiBzdHJpbmcgPVwiXCI7XG4gICAgICAgIHB1YmxpYyBtZWFsZW5kb3JzZW1lbnRUZXh0SXRlbXM6IHN0cmluZ1tdO1xuICAgICAgICBwdWJsaWMgbWVhbEZyZWVUZXh0IDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIHRyYW5zcG9ydGF0aW9uZW5kb3JzZW1lbnRUZXh0SXRlbXM6IHN0cmluZ1tdO1xuICAgICAgICBwdWJsaWMgdHJhbnNwb3J0RnJlZVRleHQgOiBzdHJpbmcgPSBcIlwiO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBGbGlnaHRTZWdtZW50IHtcbiAgICAgICAgSXNTZWdTZWxlY3RlZCA6IGJvb2xlYW47XG4gICAgICAgIEZsaWdodFNlZ21lbnRJZD86IG51bWJlcjtcbiAgICAgICAgQWlybGluZUNvZGU6IHN0cmluZztcbiAgICAgICAgRmxpZ2h0Tm86IHN0cmluZztcbiAgICAgICAgRGVwYXJ0dXJlRHQ6IHN0cmluZztcbiAgICAgICAgRGVwYXJ0dXJlOiBzdHJpbmc7XG4gICAgICAgIEFycml2YWw6IHN0cmluZztcbiAgICAgICAgRmxpZ2h0U2VnbWVudFJQSD86IGFueTtcbiAgICAgICAgUGFzc2VuZ2VyczogUGFzc2VuZ2VyW107XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFJvb3RPYmplY3Qge1xuICAgICAgICBGbGlnaHRTZWdtZW50czogRmxpZ2h0U2VnbWVudFtdO1xuICAgICAgICBFcnJvcnM/OiBhbnk7XG4gICAgfVxuXG59XG5cblxuZXhwb3J0IGNsYXNzIElzc3VlQ29tcGVuc2F0aW9uTGlzdCB7XG4gICAgcHVibGljIElzU2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgRnVsbE5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFNTUjogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgVGllcjogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgQ2FiaW46IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIE9yZGVySWQ6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIEFtdDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgSG90ZWw6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIE1lYWw6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFRyYW5zOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBFbWFpbDogc3RyaW5nID0gXCJFZGl0XCI7XG4gICAgcHVibGljIEFkZGl0aW9uYWxEZXRhaWxzOiBzdHJpbmcgPSBcIkVkaXRcIjtcbn1cbmRlY2xhcmUgbW9kdWxlIG5hbWVzcGFjZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgUGFzc2VuZ2VyIHtcbiAgICAgICAgZ2l2ZW5OYW1lOiBzdHJpbmc7XG4gICAgICAgIG9yZGVySWQ6IHN0cmluZztcbiAgICAgICAgc3VybmFtZTogc3RyaW5nO1xuICAgICAgICBwYXNzZW5nZXJUeXBlOiBzdHJpbmc7XG4gICAgICAgIHRpZXJMZXZlbDogc3RyaW5nO1xuICAgICAgICBjYWJpbkNsYXNzOiBzdHJpbmc7XG4gICAgICAgIGNvbXBlbnNhdGlvbkNhdXNlOiBzdHJpbmc7XG4gICAgICAgIGZsaWdodE51bWJlcjogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBGbGlnaHQge1xuICAgICAgICBmbGlnaHROdW1iZXI6IHN0cmluZztcbiAgICAgICAgZnJvbUNvdW50cnk/OiBhbnk7XG4gICAgICAgIHRvQ291bnRyeT86IGFueTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUm9vdE9iamVjdCB7XG4gICAgICAgIGNhcnJpZXJDb2RlOiBzdHJpbmc7XG4gICAgICAgIHByaXZpbGVnZTogc3RyaW5nO1xuICAgICAgICBwYXNzZW5nZXJzOiBQYXNzZW5nZXJbXTtcbiAgICAgICAgZmxpZ2h0czogRmxpZ2h0W107XG4gICAgfVxuXG59XG5leHBvcnQgbW9kdWxlIENvbXBlbnNhdGlvblJlYXNvbk1vZHVsZSB7XG5cbiAgICBleHBvcnQgY2xhc3MgQ29tcGVuc2F0aW9uUmVhc29uIHtcbiAgICAgICAgQ29tcFJlYXNvbklkOiBudW1iZXI7XG4gICAgICAgIENvbXBSZWFzb25UZXh0OiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFJvb3RPYmplY3Qge1xuICAgICAgICBSZXNwb25zZUZvcj86IGFueTtcbiAgICAgICAgQ29tcGVuc2F0aW9uUmVhc29uOiBDb21wZW5zYXRpb25SZWFzb25bXTtcbiAgICAgICAgU3VjY2VzczogYm9vbGVhbjtcbiAgICAgICAgRXJyb3JzPzogYW55O1xuICAgICAgICBJbmZvcm1hdGlvbj86IGFueTtcbiAgICAgICAgV2FybmluZ3M/OiBhbnk7XG4gICAgfVxuXG59XG5cblxuIl19