"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MultiSegmentTemplate;
(function (MultiSegmentTemplate) {
    var RootObject = /** @class */ (function () {
        function RootObject() {
            this.Segment = [];
            // public CheckInType: string = "CheckIn";
            // public SegmentList: Array<SegmentList> = null;
            // public PassengerList: Array<PassengerList> = null;
        }
        return RootObject;
    }());
    MultiSegmentTemplate.RootObject = RootObject;
    var FqtTraveler = /** @class */ (function () {
        function FqtTraveler() {
            this.ProgramID = null;
            this.MembershipID = null;
        }
        return FqtTraveler;
    }());
    MultiSegmentTemplate.FqtTraveler = FqtTraveler;
    var FlightWithPax = /** @class */ (function () {
        function FlightWithPax() {
            // public PaxDetails: Array<PaxTemplate> = [];
            this.FlightNumber = "";
            this.MarketingFlight = "";
            this.FlightDate = "";
            this.FlightStatus = "";
            this.Origin = "";
            this.Destination = "";
            this.OriginCity = "";
            this.InboundDetail = "";
            this.DestinationCity = "";
            this.STD = "";
            this.ETD = "";
            this.ETA = "";
            this.Legs = null;
            // Properties needed to check in the pax
            this.RPH = "";
            this.RBD = "";
            this.date = "";
            this.DepartureDateTime = null;
            this.ArrivalDateTime = null;
            this.DepartureCity = "";
            this.Seats = null;
            this.StatusCategory = "Confirmed";
            this.PassengerRPHs = [];
            this.SegmentRPH = "";
            this.FlightCheckIn = null;
            this.FlightInfo = null;
            this.Selected = true;
            this.IsThroughOrChangeOfGaugeFlight = false;
            this.Connection = "";
            this.Stopover = "";
            this.StatusNumber = "";
            this.Turnaround = "";
            this.OperatingFlight = "";
            this.Passenger = [];
            this.inbound = 0;
            this.outbound = 0;
            this.inven = [];
            this.status = "";
            this.APISRequired = false;
            this.isAPISSeatBagDisabled = true;
            this.IsInterline = false;
            this.ETKTStatusNOTOK = false;
            this.IsFlightRestricted = false;
            this.isShortCheckin = false;
        }
        return FlightWithPax;
    }());
    MultiSegmentTemplate.FlightWithPax = FlightWithPax;
    var inven = /** @class */ (function () {
        function inven() {
            this.Booking = "";
            this.Capacity = "";
            this.CodeLetter = "";
        }
        return inven;
    }());
    MultiSegmentTemplate.inven = inven;
    var Passenger = /** @class */ (function () {
        function Passenger() {
            this.FirstName = "";
            this.LastName = "";
            this.FullName = "";
            this.OrderID = "";
            this.PassengerType = "";
            this.StandbyPassengerType = "";
            this.TierLevel = "";
            this.StarLevel = "";
            this.FQTVNumber = "";
            this.IsSecurityDocsComplete = false;
            this.SecurityDocStatus = "";
            this.BagCount = 0;
            this.UnitOfMeasureCode = "";
            this.SeatNumber = "";
            this.Cabin = "";
            this.TotalWeight = 0;
            this.SSR = [];
            this.EMD = "";
            this.CheckinPassengerType = "";
            // public FlightDetails: Array<FlightInfo> = [];
            // Properties needed to check in the pax
            this.SurnameRefNumber = "";
            this.SurName = "";
            this.RPH = "";
            this.Selected = false;
            this.FQTVAirline = "";
            this.ApisDocoStatus = "";
            this.AdcDecisionStatus = "";
            this.SecurityCode = "";
            this.SecurityCodeDesc = "";
            this.SecurityValue = null;
            this.PassengerTypeCode = "";
            this.ProgramIDxx = "";
            this.PassengerRefNumber = null;
            this.PhoneNumbers = [];
            this.Emails = "";
            this.DateOfBirth = "";
            this.CheckinStatus = false;
            this.IsSelected = false;
            this.IsChecked = false;
            this.INFwithoutSeat = false;
            this.fqtv = [];
            this.PrevSeat = "";
            this.FqtvPrograms = [];
            this.serviceText = "";
            this.PassengerSeqNumber = "";
            this.SyncTicket = false;
            this.Oversold = false;
            this.LoyalLevel = "";
            this.AssociatedInfantRPH = "";
            this.AssociatedAdultRPH = "";
            this.TicketNumbers = "";
            this.OnStandby = false;
            this.FlightLegDepartureAirportCode = "";
            this.Seats = [];
            this.NoSeat = false;
            this.seatCode = "";
            this.seatPreference = [];
            this.GivenNameRefNumber = "";
            this.Age = "";
            this.BoardingPriority = "";
            this.ShortCheckAirportCode = "";
            //test
        }
        return Passenger;
    }());
    MultiSegmentTemplate.Passenger = Passenger;
    var Status = /** @class */ (function () {
        function Status() {
        }
        return Status;
    }());
    MultiSegmentTemplate.Status = Status;
    var Seat = /** @class */ (function () {
        function Seat() {
        }
        return Seat;
    }());
    MultiSegmentTemplate.Seat = Seat;
    var FqtvClassPrograms = /** @class */ (function () {
        function FqtvClassPrograms() {
        }
        return FqtvClassPrograms;
    }());
    MultiSegmentTemplate.FqtvClassPrograms = FqtvClassPrograms;
    var FlightStatus;
    (function (FlightStatus) {
        FlightStatus[FlightStatus["Open"] = 0] = "Open";
        FlightStatus[FlightStatus["Closed"] = 1] = "Closed";
        FlightStatus[FlightStatus["OnHold"] = 2] = "OnHold";
        FlightStatus[FlightStatus["Unknown"] = 3] = "Unknown";
    })(FlightStatus = MultiSegmentTemplate.FlightStatus || (MultiSegmentTemplate.FlightStatus = {}));
    //
    var PhoneNumber = /** @class */ (function () {
        function PhoneNumber() {
            this.IsRefValue = false;
            this.Type = "";
            this.TypeText = "";
            this.TechType = "";
            this.TechTypeText = "";
            this.Value = "";
            this.Operation = "";
            this.OSIText = "";
            this.CarrierCode = "";
            this.Remark = "";
            this.LocationCode = "";
            this.AreaCityCode = "";
        }
        return PhoneNumber;
    }());
    MultiSegmentTemplate.PhoneNumber = PhoneNumber;
    var FlightInfo = /** @class */ (function () {
        function FlightInfo() {
            this.FlightNumber = "";
            this.MarketingFlight = "";
            this.FlightDate = "";
            this.FlightStatus = "";
            this.Origin = "";
            this.Destination = "";
            this.OriginCity = "";
            this.DestinationCity = "";
            this.STD = "";
            this.ETD = "";
            this.ETA = "";
            // Properties needed to check in the pax
            this.RPH = "";
            this.RBD = "";
            this.DepartureDateTime = null;
            this.ArrivalDateTime = null;
            this.DepartureCity = "";
            this.Seats = null;
            this.StatusCategory = "Confirmed";
            this.PassengerRPHs = "[\"1\"]";
            this.SegmentRPH = "";
            this.FlightCheckIn = null;
            this.FlightInfo = null;
            this.Selected = true;
            this.IsThroughOrChangeOfGaugeFlight = false;
            this.Connection = "";
            this.Stopover = "";
            this.StatusNumber = "";
            this.Turnaround = "";
            this.OperatingFlight = "";
        }
        return FlightInfo;
    }());
    MultiSegmentTemplate.FlightInfo = FlightInfo;
})(MultiSegmentTemplate = exports.MultiSegmentTemplate || (exports.MultiSegmentTemplate = {}));
var UpgradeInfo;
(function (UpgradeInfo) {
    var SegmentList = /** @class */ (function () {
        function SegmentList() {
            this.RPH = "";
            this.DepartureDateTime = null;
            this.MarketingFlight = "";
            this.Selected = false;
            this.DepartureCity = "";
        }
        return SegmentList;
    }());
    UpgradeInfo.SegmentList = SegmentList;
    var FqtTraveler = /** @class */ (function () {
        function FqtTraveler() {
        }
        return FqtTraveler;
    }());
    UpgradeInfo.FqtTraveler = FqtTraveler;
    var PassengerList = /** @class */ (function () {
        function PassengerList() {
            this.GivenName = "";
            this.Surname = "";
            this.Emails = "";
            this.PassengerTypeCode = "";
            this.PassengerRefNumber = "";
            this.FqtTravelers = [];
            this.Status = "";
            this.IsHeldSeat = false;
            this.OrderId = "";
            this.RPH = "";
            this.Firstname = "";
            this.Lastname = "";
            this.Selected = false;
        }
        return PassengerList;
    }());
    UpgradeInfo.PassengerList = PassengerList;
    var UpgradeDowngradeInfo = /** @class */ (function () {
        function UpgradeDowngradeInfo() {
            this.IsVoluntary = false;
            this.BookingClass = "";
        }
        return UpgradeDowngradeInfo;
    }());
    UpgradeInfo.UpgradeDowngradeInfo = UpgradeDowngradeInfo;
    var Seat = /** @class */ (function () {
        function Seat() {
            this.SeatNumber = "";
            this.DepartureCode = "";
            this.ArrivalCode = "";
            this.Cabin = "";
            this.IsThruSeatNeeded = false;
            this.NewSeatNumber = "";
        }
        return Seat;
    }());
    UpgradeInfo.Seat = Seat;
    var CheckinInfo = /** @class */ (function () {
        function CheckinInfo() {
            this.OriginalBookingClass = "";
        }
        return CheckinInfo;
    }());
    UpgradeInfo.CheckinInfo = CheckinInfo;
    var SegmentTravelerInfo = /** @class */ (function () {
        function SegmentTravelerInfo() {
            this.PassengerRPH = "";
            this.SegmentRPH = "";
            this.Seats = [];
            this.PassengerFullName = "";
            this.CheckinInfos = [];
            this.Selected = false;
        }
        return SegmentTravelerInfo;
    }());
    UpgradeInfo.SegmentTravelerInfo = SegmentTravelerInfo;
    var RootObject = /** @class */ (function () {
        function RootObject() {
            this.CheckInType = "";
            this.SegmentList = [];
            this.PassengerList = [];
            this.SegmentTravelerInfo = [];
        }
        return RootObject;
    }());
    UpgradeInfo.RootObject = RootObject;
})(UpgradeInfo = exports.UpgradeInfo || (exports.UpgradeInfo = {}));
var UpgradeInfoArray = /** @class */ (function () {
    function UpgradeInfoArray() {
        this.BookingClass = "";
        this.ReasonCode = null;
    }
    return UpgradeInfoArray;
}());
exports.UpgradeInfoArray = UpgradeInfoArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlzZWdtZW50LmludGVyZmFjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm11bHRpc2VnbWVudC5pbnRlcmZhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFjLG9CQUFvQixDQWtQakM7QUFsUEQsV0FBYyxvQkFBb0I7SUFDOUI7UUFBQTtZQUNXLFlBQU8sR0FBeUIsRUFBRSxDQUFDO1lBRTFDLDBDQUEwQztZQUMxQyxpREFBaUQ7WUFDakQscURBQXFEO1FBRXpELENBQUM7UUFBRCxpQkFBQztJQUFELENBQUMsQUFQRCxJQU9DO0lBUFksK0JBQVUsYUFPdEIsQ0FBQTtJQUVEO1FBQUE7WUFFVyxjQUFTLEdBQVcsSUFBSSxDQUFDO1lBQ3pCLGlCQUFZLEdBQVcsSUFBSSxDQUFDO1FBQ3ZDLENBQUM7UUFBRCxrQkFBQztJQUFELENBQUMsQUFKRCxJQUlDO0lBSlksZ0NBQVcsY0FJdkIsQ0FBQTtJQUNEO1FBQUE7WUFDSSw4Q0FBOEM7WUFDdkMsaUJBQVksR0FBVyxFQUFFLENBQUM7WUFDMUIsb0JBQWUsR0FBVyxFQUFFLENBQUM7WUFDN0IsZUFBVSxHQUFXLEVBQUUsQ0FBQztZQUN4QixpQkFBWSxHQUFXLEVBQUUsQ0FBQztZQUMxQixXQUFNLEdBQVcsRUFBRSxDQUFDO1lBQ3BCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1lBQ3pCLGVBQVUsR0FBVyxFQUFFLENBQUM7WUFDeEIsa0JBQWEsR0FBVSxFQUFFLENBQUM7WUFDMUIsb0JBQWUsR0FBVyxFQUFFLENBQUM7WUFDN0IsUUFBRyxHQUFXLEVBQUUsQ0FBQztZQUNqQixRQUFHLEdBQVcsRUFBRSxDQUFDO1lBQ2pCLFFBQUcsR0FBVyxFQUFFLENBQUM7WUFDakIsU0FBSSxHQUFRLElBQUksQ0FBQztZQUN4Qix3Q0FBd0M7WUFDakMsUUFBRyxHQUFXLEVBQUUsQ0FBQztZQUNqQixRQUFHLEdBQVcsRUFBRSxDQUFDO1lBRWpCLFNBQUksR0FBVyxFQUFFLENBQUM7WUFDbEIs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RCxXQUFDO0lBQUQsQ0FBQyxBQVRELElBU0M7SUFUWSxnQkFBSSxPQVNoQixDQUFBO0lBRUQ7UUFBQTtZQUNXLHlCQUFvQixHQUFXLEVBQUUsQ0FBQztRQUM3QyxDQUFDO1FBQUQsa0JBQUM7SUFBRCxDQUFDLEFBRkQsSUFFQztJQUZZLHVCQUFXLGNBRXZCLENBQUE7SUFFRDtRQUFBO1lBQ1csaUJBQVksR0FBVyxFQUFFLENBQUM7WUFDMUIsZUFBVSxHQUFXLEVBQUUsQ0FBQztZQUN4QixVQUFLLEdBQWdCLEVBQUUsQ0FBQztZQUN4QixzQkFBaUIsR0FBVyxFQUFFLENBQUM7WUFDL0IsaUJBQVksR0FBdUIsRUFBRSxDQUFDO1lBQ3RDLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDckMsQ0FBQztRQUFELDBCQUFDO0lBQUQsQ0FBQyxBQVBELElBT0M7SUFQWSwrQkFBbUIsc0JBTy9CLENBQUE7SUFFRDtRQUFBO1lBQ1csZ0JBQVcsR0FBVyxFQUFFLENBQUM7WUFDekIsZ0JBQVcsR0FBdUIsRUFBRSxDQUFDO1lBQ3JDLGtCQUFhLEdBQXlCLEVBQUUsQ0FBQztZQUV6Qyx3QkFBbUIsR0FBK0IsRUFBRSxDQUFDO1FBQ2hFLENBQUM7UUFBRCxpQkFBQztJQUFELENBQUMsQUFORCxJQU1DO0lBTlksc0JBQVUsYUFNdEIsQ0FBQTtBQUVMLENBQUMsRUF6RWEsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUF5RXhCO0FBQ0Q7SUFBQTtRQUVXLGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBQzFCLGVBQVUsR0FBUyxJQUFJLENBQUM7SUFDbkMsQ0FBQztJQUFELHVCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKWSw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgbW9kdWxlIE11bHRpU2VnbWVudFRlbXBsYXRlIHtcbiAgICBleHBvcnQgY2xhc3MgUm9vdE9iamVjdCB7XG4gICAgICAgIHB1YmxpYyBTZWdtZW50OiBBcnJheTxGbGlnaHRXaXRoUGF4PiA9IFtdO1xuICAgICAgICBwdWJsaWMgV2FybmluZzphbnk7XG4gICAgICAgIC8vIHB1YmxpYyBDaGVja0luVHlwZTogc3RyaW5nID0gXCJDaGVja0luXCI7XG4gICAgICAgIC8vIHB1YmxpYyBTZWdtZW50TGlzdDogQXJyYXk8U2VnbWVudExpc3Q+ID0gbnVsbDtcbiAgICAgICAgLy8gcHVibGljIFBhc3Nlbmdlckxpc3Q6IEFycmF5PFBhc3Nlbmdlckxpc3Q+ID0gbnVsbDtcblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBGcXRUcmF2ZWxlciB7XG5cbiAgICAgICAgcHVibGljIFByb2dyYW1JRDogc3RyaW5nID0gbnVsbDtcbiAgICAgICAgcHVibGljIE1lbWJlcnNoaXBJRDogc3RyaW5nID0gbnVsbDtcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIEZsaWdodFdpdGhQYXgge1xuICAgICAgICAvLyBwdWJsaWMgUGF4RGV0YWlsczogQXJyYXk8UGF4VGVtcGxhdGU+ID0gW107XG4gICAgICAgIHB1YmxpYyBGbGlnaHROdW1iZXI6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBNYXJrZXRpbmdGbGlnaHQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBGbGlnaHREYXRlOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgRmxpZ2h0U3RhdHVzOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgT3JpZ2luOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgRGVzdGluYXRpb246IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBPcmlnaW5DaXR5OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgSW5ib3VuZERldGFpbDpzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgRGVzdGluYXRpb25DaXR5OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgU1REOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgRVREOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgRVRBOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgTGVnczogYW55ID0gbnVsbDtcbiAgICAgICAgLy8gUHJvcGVydGllcyBuZWVkZWQgdG8gY2hlY2sgaW4gdGhlIHBheFxuICAgICAgICBwdWJsaWMgUlBIOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgUkJEOiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgIHB1YmxpYyBkYXRlOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgRGVwYXJ0dXJlRGF0ZVRpbWU6IERhdGUgPSBudWxsO1xuICAgICAgICBwdWJsaWMgQXJyaXZhbERhdGVUaW1lOiBEYXRlID0gbnVsbDtcblxuICAgICAgICBwdWJsaWMgRGVwYXJ0dXJlQ2l0eTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFNlYXRzOiBzdHJpbmcgPSBudWxsO1xuICAgICAgICBwdWJsaWMgU3RhdHVzQ2F0ZWdvcnk6IHN0cmluZyA9IFwiQ29uZmlybWVkXCI7XG5cbiAgICAgICAgcHVibGljIFBhc3NlbmdlclJQSHM6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAgICAgcHVibGljIFNlZ21lbnRSUEg6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBGbGlnaHRDaGVja0luOiBzdHJpbmcgPSBudWxsO1xuICAgICAgICBwdWJsaWMgRmxpZ2h0SW5mbzogYW55ID0gbnVsbDtcbiAgICAgICAgcHVibGljIFNlbGVjdGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgcHVibGljIElzVGhyb3VnaE9yQ2hhbmdlT2ZHYXVnZUZsaWdodDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgQ29ubmVjdGlvbjogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFN0b3BvdmVyOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgU3RhdHVzTnVtYmVyOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgVHVybmFyb3VuZDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIE9wZXJhdGluZ0ZsaWdodDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlcjogQXJyYXk8UGFzc2VuZ2VyPiA9IFtdO1xuICAgICAgICBwdWJsaWMgaW5ib3VuZDogbnVtYmVyID0gMDtcbiAgICAgICAgcHVibGljIG91dGJvdW5kOiBudW1iZXIgPSAwO1xuICAgICAgICBwdWJsaWMgaW52ZW46IEFycmF5PGludmVuPiA9IFtdO1xuICAgICAgICBwdWJsaWMgc3RhdHVzOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgSXNJbnRlcm5hdGlvbmFsOmJvb2xlYW47XG4gICAgICAgIHB1YmxpYyBBUElTUmVxdWlyZWQ6Ym9vbGVhbiA9ZmFsc2U7XG4gICAgICAgIHB1YmxpYyBpc0FQSVNTZWF0QmFnRGlzYWJsZWQgOiBib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgcHVibGljIElzSW50ZXJsaW5lOmJvb2xlYW49ZmFsc2U7XG4gICAgICAgIHB1YmxpYyBFVEtUU3RhdHVzTk9UT0s6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgSXNGbGlnaHRSZXN0cmljdGVkOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIGlzU2hvcnRDaGVja2luIDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBcblxuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgaW52ZW4ge1xuICAgICAgICBwdWJsaWMgQm9va2luZzogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIENhcGFjaXR5OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgQ29kZUxldHRlcjogc3RyaW5nID0gXCJcIjtcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIFBhc3NlbmdlciB7XG4gICAgICAgIHB1YmxpYyBGaXJzdE5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBMYXN0TmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIEZ1bGxOYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgT3JkZXJJRDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlclR5cGU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBTdGFuZGJ5UGFzc2VuZ2VyVHlwZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFRpZXJMZXZlbDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFN0YXJMZXZlbDpzdHJpbmc9XCJcIjtcbiAgICAgICAgcHVibGljIEZRVFZOdW1iZXI6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBJc1NlY3VyaXR5RG9jc0NvbXBsZXRlOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBTZWN1cml0eURvY1N0YXR1czogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIEJhZ0NvdW50OiBudW1iZXIgPSAwO1xuICAgICAgICBwdWJsaWMgVW5pdE9mTWVhc3VyZVF1YW50aXR5OiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBVbml0T2ZNZWFzdXJlQ29kZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFNlYXROdW1iZXI6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBDYWJpbiA6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBUb3RhbFdlaWdodDogbnVtYmVyID0gMDtcbiAgICAgICAgcHVibGljIFNTUjogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgICAgICBwdWJsaWMgRU1EOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgRG9jdW1lbnRzOmFueVtdO1xuICAgICAgICBwdWJsaWMgQ2hlY2tpblBhc3NlbmdlclR5cGU6IHN0cmluZz1cIlwiO1xuICAgICAgICAvLyBwdWJsaWMgRmxpZ2h0RGV0YWlsczogQXJyYXk8RmxpZ2h0SW5mbz4gPSBbXTtcbiAgICAgICAgLy8gUHJvcGVydGllcyBuZWVkZWQgdG8gY2hlY2sgaW4gdGhlIHBheFxuICAgICAgICBwdWJsaWMgU3VybmFtZVJlZk51bWJlcjogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFN1cm5hbWVSZWZOdW1iZXJDb3VudDogbnVtYmVyO1xuICAgICAgICBwdWJsaWMgU3VyTmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFJQSDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFNlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBGUVRWQWlybGluZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIEFwaXNEb2NvU3RhdHVzOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgQWRjRGVjaXNpb25TdGF0dXM6c3RyaW5nPSBcIlwiO1xuICAgICAgICBwdWJsaWMgU2VjdXJpdHlDb2RlOnN0cmluZz1cIlwiO1xuICAgICAgICBwdWJsaWMgU2VjdXJpdHlDb2RlRGVzYzpzdHJpbmc9XCJcIjtcbiAgICAgICAgcHVibGljIFNlY3VyaXR5VmFsdWU6YW55PW51bGw7XG4gICAgICAgIHB1YmxpYyBQYXNzZW5nZXJUeXBlQ29kZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFByb2dyYW1JRHh4OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyUmVmTnVtYmVyOiBzdHJpbmcgPSBudWxsO1xuICAgICAgICBwdWJsaWMgUGhvbmVOdW1iZXJzOiBBcnJheTxQaG9uZU51bWJlcj4gPSBbXTtcbiAgICAgICAgcHVibGljIEVtYWlsczogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIERhdGVPZkJpcnRoOiBhbnkgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgQ2hlY2tpblN0YXR1czogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgQmFnZ2FnZUluZm86IGFueTtcbiAgICAgICAgcHVibGljIE5ld1NlYXROdW1iZXI6IGFueTtcbiAgICAgICAgcHVibGljIElzU2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIElzQ2hlY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgSU5Gd2l0aG91dFNlYXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIGZxdHY6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAgICAgcHVibGljIEZxdFRyYXZlbGVyczphbnk7XG4gICAgICAgIHB1YmxpYyBQcmV2U2VhdCA6IHN0cmluZyA9XCJcIjtcbiAgICAgICAgcHVibGljIEZxdHZQcm9ncmFtczogQXJyYXk8RnF0dkNsYXNzUHJvZ3JhbXM+ID1bXTtcbiAgICAgICAgcHVibGljIHNlcnZpY2VUZXh0OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyU2VxTnVtYmVyOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgU3luY1RpY2tldDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgT3ZlcnNvbGQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIExveWFsTGV2ZWw6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBBc3NvY2lhdGVkSW5mYW50UlBIOnN0cmluZz1cIlwiO1xuICAgICAgICBwdWJsaWMgQXNzb2NpYXRlZEFkdWx0UlBIOnN0cmluZz1cIlwiO1xuXHQgICAgcHVibGljIFRpY2tldE51bWJlcnM6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBPblN0YW5kYnkgOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBGbGlnaHRMZWdEZXBhcnR1cmVBaXJwb3J0Q29kZTpzdHJpbmc9XCJcIjtcbiAgICAgICAgcHVibGljIFNlYXRzOkFycmF5PFNlYXQ+PVtdO1xuICAgICAgICBwdWJsaWMgU2hvcnRDaGVja2luQXJyaXZhbENvZGVzQnlGbGlnaHRzOmFueTtcbiAgICAgICAgcHVibGljIE5vU2VhdDpib29sZWFuPWZhbHNlO1xuICAgICAgICBwdWJsaWMgc2VhdENvZGU6c3RyaW5nPVwiXCI7XG4gICAgICAgIHB1YmxpYyBzZWF0UHJlZmVyZW5jZTogQXJyYXk8c3RyaW5nPiA9W107XG4gICAgICAgIHB1YmxpYyBHaXZlbk5hbWVSZWZOdW1iZXI6c3RyaW5nPVwiXCI7XG4gICAgICAgIHB1YmxpYyBBZ2U6c3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIEVtZXJnZW5jeURldGFpbHM6YW55O1xuICAgICAgICBwdWJsaWMgQm9hcmRpbmdQcmlvcml0eTogc3RyaW5nID1cIlwiO1xuICAgICAgICBwdWJsaWMgU2hvcnRDaGVja0FpcnBvcnRDb2RlOnN0cmluZz1cIlwiO1xuICAgICAgICAvL3Rlc3RcbiAgICB9XG5cblxuICAgIGV4cG9ydCBjbGFzcyBTdGF0dXMge1xuICAgICAgICBTdGF0dXNDb2RlOiBzdHJpbmc7XG4gICAgICAgIFN0YXR1c051bWJlcj86IGFueTtcbiAgICAgICAgQ2hhbmdlU3RhdHVzTnVtYmVyPzogYW55O1xuICAgICAgICBTdGF0dXNDYXRlZ29yeTogc3RyaW5nO1xuICAgICAgICBTdGF0dXNEZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgICAgICBBbGVydD86IGFueTtcbiAgICAgICAgSXNFbGlnaWJsZUZvckNvbmZpcm1lZENoZWNrSW4/OiBhbnk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFNlYXQge1xuICAgICAgICBTZWF0TnVtYmVyOiBzdHJpbmc7XG4gICAgICAgIENhYmluOiBzdHJpbmc7XG4gICAgICAgIFN0YXR1czogU3RhdHVzO1xuICAgICAgICBDaGFyYWN0ZXJpc3RpY3M/OiBhbnk7XG4gICAgICAgIElzQXNzaWduZWQ6IGJvb2xlYW47XG4gICAgICAgIFNlZ21lbnRSUEg6IHN0cmluZztcbiAgICAgICAgUGFzc2VuZ2VyUlBIOiBzdHJpbmc7XG4gICAgICAgIEZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlPzogYW55O1xuICAgICAgICBBc3NvY2lhdGVkU2VydmljZT86IGFueTtcbiAgICAgICAgRGVwYXJ0dXJlQ29kZTogc3RyaW5nO1xuICAgICAgICBBcnJpdmFsQ29kZTogc3RyaW5nO1xuICAgICAgICBDaGVja2luU3RhdHVzOiBzdHJpbmc7XG4gICAgICAgIENoZWNraW5TdGF0dXNEZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgICAgICBCb2FyZGluZ1ByaW9yaXR5PzogYW55O1xuICAgICAgICBUaW1lc3RhbXA/OiBhbnk7XG4gICAgICAgIElzQ2hhcmdhYmxlOiBib29sZWFuO1xuICAgICAgICBJc1BhaWQ6IGJvb2xlYW47XG4gICAgICAgIEhhc1ByaWNlPzogYW55O1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgRnF0dkNsYXNzUHJvZ3JhbXMge1xuICAgICAgICBwdWJsaWMgUHJvZ3JhbUlEOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBQcm9ncmFtTmFtZTogc3RyaW5nO1xuICAgIH1cbiAgICBleHBvcnQgZW51bSBGbGlnaHRTdGF0dXMge1xuICAgICAgICBPcGVuLFxuICAgICAgICBDbG9zZWQsXG4gICAgICAgIE9uSG9sZCxcbiAgICAgICAgVW5rbm93blxuICAgIH1cbiAgICAvL1xuICAgIGV4cG9ydCBjbGFzcyBQaG9uZU51bWJlciB7XG4gICAgICAgIHB1YmxpYyBJc1JlZlZhbHVlOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBUeXBlOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgVHlwZVRleHQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBUZWNoVHlwZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFRlY2hUeXBlVGV4dDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFZhbHVlOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgT3BlcmF0aW9uOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgT1NJVGV4dDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIENhcnJpZXJDb2RlOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgUmVtYXJrOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgTG9jYXRpb25Db2RlOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgQXJlYUNpdHlDb2RlOiBzdHJpbmcgPSBcIlwiO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBGbGlnaHRJbmZvIHtcbiAgICAgICAgcHVibGljIEZsaWdodE51bWJlcjogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIE1hcmtldGluZ0ZsaWdodDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIEZsaWdodERhdGU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBGbGlnaHRTdGF0dXM6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBPcmlnaW46IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBEZXN0aW5hdGlvbjogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIE9yaWdpbkNpdHk6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBEZXN0aW5hdGlvbkNpdHk6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBTVEQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBFVEQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBFVEE6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIC8vIFByb3BlcnRpZXMgbmVlZGVkIHRvIGNoZWNrIGluIHRoZSBwYXhcbiAgICAgICAgcHVibGljIFJQSDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFJCRDogc3RyaW5nID0gXCJcIjtcblxuXG4gICAgICAgIHB1YmxpYyBEZXBhcnR1cmVEYXRlVGltZTogRGF0ZSA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBBcnJpdmFsRGF0ZVRpbWU6IERhdGUgPSBudWxsO1xuXG4gICAgICAgIHB1YmxpYyBEZXBhcnR1cmVDaXR5OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgU2VhdHM6IHN0cmluZyA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBTdGF0dXNDYXRlZ29yeTogc3RyaW5nID0gXCJDb25maXJtZWRcIjtcblxuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyUlBIczogc3RyaW5nID0gXCJbXFxcIjFcXFwiXVwiO1xuICAgICAgICBwdWJsaWMgU2VnbWVudFJQSDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIEZsaWdodENoZWNrSW46IHN0cmluZyA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBGbGlnaHRJbmZvOiBzdHJpbmcgPSBudWxsO1xuICAgICAgICBwdWJsaWMgU2VsZWN0ZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgICAgICBwdWJsaWMgSXNUaHJvdWdoT3JDaGFuZ2VPZkdhdWdlRmxpZ2h0OiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBDb25uZWN0aW9uOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgU3RvcG92ZXI6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBTdGF0dXNOdW1iZXI6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBUdXJuYXJvdW5kOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgT3BlcmF0aW5nRmxpZ2h0OiBzdHJpbmcgPSBcIlwiO1xuXG5cbiAgICB9XG59XG5leHBvcnQgbW9kdWxlIFVwZ3JhZGVJbmZvIHtcblxuICAgIGV4cG9ydCBjbGFzcyBTZWdtZW50TGlzdCB7XG4gICAgICAgIHB1YmxpYyBSUEg6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBEZXBhcnR1cmVEYXRlVGltZTogRGF0ZSA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBNYXJrZXRpbmdGbGlnaHQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBTZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgRGVwYXJ0dXJlQ2l0eTogc3RyaW5nID0gXCJcIjtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRnF0VHJhdmVsZXIge1xuICAgICAgICBwdWJsaWMgUHJvZ3JhbUlEPzogYW55O1xuICAgICAgICBwdWJsaWMgTWVtYmVyc2hpcElEPzogYW55O1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQYXNzZW5nZXJMaXN0IHtcbiAgICAgICAgcHVibGljIEdpdmVuTmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFN1cm5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBFbWFpbHM6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBQYXNzZW5nZXJUeXBlQ29kZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlclJlZk51bWJlcjogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFBob25lTnVtYmVyczogYW55W107XG4gICAgICAgIHB1YmxpYyBGcXRUcmF2ZWxlcnM6IEFycmF5PEZxdFRyYXZlbGVyPiA9IFtdO1xuICAgICAgICBwdWJsaWMgRW1lcmdlbmN5RGV0YWlsczogYW55W107XG4gICAgICAgIHB1YmxpYyBTdGF0dXM6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBJc0hlbGRTZWF0OiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBPcmRlcklkOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgQ2hlY2tlZEJhZ0NvdW50OiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBSUEg6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBGaXJzdG5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBMYXN0bmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFNlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBBc3NvY2lhdGVkSW5mYW50UlBIPzogYW55O1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBVcGdyYWRlRG93bmdyYWRlSW5mbyB7XG4gICAgICAgIHB1YmxpYyBJc1ZvbHVudGFyeTogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgQm9va2luZ0NsYXNzOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgUmVhc29uQ29kZT86IGFueTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgU2VhdCB7XG4gICAgICAgIHB1YmxpYyBTZWF0QXZhaWxhYmlsaXR5PzogYW55O1xuICAgICAgICBwdWJsaWMgU2VhdE51bWJlcjogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFNlYXRDaGFyYWN0ZXJpc3RpY3M/OiBhbnk7XG4gICAgICAgIHB1YmxpYyBEZXBhcnR1cmVDb2RlOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgQXJyaXZhbENvZGU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBDYWJpbjogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIElzVGhydVNlYXROZWVkZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIE5ld1NlYXROdW1iZXI6IHN0cmluZyA9IFwiXCI7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIENoZWNraW5JbmZvIHtcbiAgICAgICAgcHVibGljIE9yaWdpbmFsQm9va2luZ0NsYXNzOiBzdHJpbmcgPSBcIlwiO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBTZWdtZW50VHJhdmVsZXJJbmZvIHtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlclJQSDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFNlZ21lbnRSUEg6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBTZWF0czogQXJyYXk8U2VhdD4gPSBbXTtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlckZ1bGxOYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgQ2hlY2tpbkluZm9zOiBBcnJheTxDaGVja2luSW5mbz4gPSBbXTtcbiAgICAgICAgcHVibGljIFNlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFJvb3RPYmplY3Qge1xuICAgICAgICBwdWJsaWMgQ2hlY2tJblR5cGU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBTZWdtZW50TGlzdDogQXJyYXk8U2VnbWVudExpc3Q+ID0gW107XG4gICAgICAgIHB1YmxpYyBQYXNzZW5nZXJMaXN0OiBBcnJheTxQYXNzZW5nZXJMaXN0PiA9IFtdO1xuICAgICAgICBwdWJsaWMgVXBncmFkZURvd25ncmFkZUluZm86IFVwZ3JhZGVEb3duZ3JhZGVJbmZvO1xuICAgICAgICBwdWJsaWMgU2VnbWVudFRyYXZlbGVySW5mbzogQXJyYXk8U2VnbWVudFRyYXZlbGVySW5mbz4gPSBbXTtcbiAgICB9XG5cbn1cbmV4cG9ydCBjbGFzcyBVcGdyYWRlSW5mb0FycmF5IHtcbiAgICBwdWJsaWMgSXNWb2x1bnRhcnk6IGJvb2xlYW47XG4gICAgcHVibGljIEJvb2tpbmdDbGFzczogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgUmVhc29uQ29kZT86IGFueSA9IG51bGw7XG59XG4iXX0=