"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Equipment = /** @class */ (function () {
    function Equipment() {
    }
    return Equipment;
}());
exports.Equipment = Equipment;
var FlightInfo = /** @class */ (function () {
    function FlightInfo() {
    }
    return FlightInfo;
}());
exports.FlightInfo = FlightInfo;
var SeatList = /** @class */ (function () {
    function SeatList() {
    }
    return SeatList;
}());
exports.SeatList = SeatList;
var InboundConnectingFlight = /** @class */ (function () {
    function InboundConnectingFlight() {
    }
    return InboundConnectingFlight;
}());
exports.InboundConnectingFlight = InboundConnectingFlight;
var OutboundConnectingFlight = /** @class */ (function () {
    function OutboundConnectingFlight() {
    }
    return OutboundConnectingFlight;
}());
exports.OutboundConnectingFlight = OutboundConnectingFlight;
var SpecialServiceRequest = /** @class */ (function () {
    function SpecialServiceRequest() {
    }
    return SpecialServiceRequest;
}());
exports.SpecialServiceRequest = SpecialServiceRequest;
var AllianceTierLevel = /** @class */ (function () {
    function AllianceTierLevel() {
    }
    return AllianceTierLevel;
}());
exports.AllianceTierLevel = AllianceTierLevel;
var FqtTraveler = /** @class */ (function () {
    function FqtTraveler() {
    }
    return FqtTraveler;
}());
exports.FqtTraveler = FqtTraveler;
var OtherServiceInfo = /** @class */ (function () {
    function OtherServiceInfo() {
    }
    return OtherServiceInfo;
}());
exports.OtherServiceInfo = OtherServiceInfo;
var PassengerList = /** @class */ (function () {
    function PassengerList() {
    }
    return PassengerList;
}());
exports.PassengerList = PassengerList;
var Compansation = /** @class */ (function () {
    function Compansation() {
    }
    return Compansation;
}());
exports.Compansation = Compansation;
var PassengerTypeListTable = /** @class */ (function () {
    function PassengerTypeListTable() {
    }
    return PassengerTypeListTable;
}());
exports.PassengerTypeListTable = PassengerTypeListTable;
var Value = /** @class */ (function () {
    function Value() {
    }
    return Value;
}());
exports.Value = Value;
// Request Issue Compensation Model
var BreRequest;
(function (BreRequest) {
    var Passenger = /** @class */ (function () {
        function Passenger() {
        }
        return Passenger;
    }());
    BreRequest.Passenger = Passenger;
    var SSRs = /** @class */ (function () {
        function SSRs() {
        }
        return SSRs;
    }());
    BreRequest.SSRs = SSRs;
    var FlightSegment = /** @class */ (function () {
        function FlightSegment() {
        }
        return FlightSegment;
    }());
    BreRequest.FlightSegment = FlightSegment;
    var RootObject = /** @class */ (function () {
        function RootObject() {
            this.privilege = [];
        }
        return RootObject;
    }());
    BreRequest.RootObject = RootObject;
})(BreRequest = exports.BreRequest || (exports.BreRequest = {}));
// Response Issue Compensation Model
var BRECompensation;
(function (BRECompensation) {
    var Emd = /** @class */ (function () {
        function Emd() {
        }
        return Emd;
    }());
    BRECompensation.Emd = Emd;
    var Compensation = /** @class */ (function () {
        function Compensation() {
        }
        return Compensation;
    }());
    BRECompensation.Compensation = Compensation;
    var Passenger = /** @class */ (function () {
        function Passenger() {
            this.IsSelected = false;
            this.additionalDetailsTexts = [];
        }
        return Passenger;
    }());
    BRECompensation.Passenger = Passenger;
    var BREResponse = /** @class */ (function () {
        function BREResponse() {
        }
        return BREResponse;
    }());
    BRECompensation.BREResponse = BREResponse;
})(BRECompensation = exports.BRECompensation || (exports.BRECompensation = {}));
var CompensationPaxList;
(function (CompensationPaxList) {
    var SSR = /** @class */ (function () {
        function SSR() {
        }
        return SSR;
    }());
    CompensationPaxList.SSR = SSR;
    var Etkt = /** @class */ (function () {
        function Etkt() {
        }
        return Etkt;
    }());
    CompensationPaxList.Etkt = Etkt;
    var ReaccomDetail = /** @class */ (function () {
        function ReaccomDetail() {
        }
        return ReaccomDetail;
    }());
    CompensationPaxList.ReaccomDetail = ReaccomDetail;
    var Bag = /** @class */ (function () {
        function Bag() {
        }
        return Bag;
    }());
    CompensationPaxList.Bag = Bag;
    var Emd = /** @class */ (function () {
        function Emd() {
        }
        return Emd;
    }());
    CompensationPaxList.Emd = Emd;
    var Compensation = /** @class */ (function () {
        function Compensation() {
        }
        return Compensation;
    }());
    CompensationPaxList.Compensation = Compensation;
    var Emd2 = /** @class */ (function () {
        function Emd2() {
        }
        return Emd2;
    }());
    CompensationPaxList.Emd2 = Emd2;
    var ExistingCompensation = /** @class */ (function () {
        function ExistingCompensation() {
        }
        return ExistingCompensation;
    }());
    CompensationPaxList.ExistingCompensation = ExistingCompensation;
    var Passenger = /** @class */ (function () {
        function Passenger() {
        }
        return Passenger;
    }());
    CompensationPaxList.Passenger = Passenger;
    var FlightSegment = /** @class */ (function () {
        function FlightSegment() {
        }
        return FlightSegment;
    }());
    CompensationPaxList.FlightSegment = FlightSegment;
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    CompensationPaxList.RootObject = RootObject;
})(CompensationPaxList = exports.CompensationPaxList || (exports.CompensationPaxList = {}));
var SaveCompensationRequest;
(function (SaveCompensationRequest) {
    var SSR = /** @class */ (function () {
        function SSR() {
        }
        return SSR;
    }());
    SaveCompensationRequest.SSR = SSR;
    var Etkt = /** @class */ (function () {
        function Etkt() {
        }
        return Etkt;
    }());
    SaveCompensationRequest.Etkt = Etkt;
    var ReaccomDetail = /** @class */ (function () {
        function ReaccomDetail() {
        }
        return ReaccomDetail;
    }());
    SaveCompensationRequest.ReaccomDetail = ReaccomDetail;
    var Bag = /** @class */ (function () {
        function Bag() {
        }
        return Bag;
    }());
    SaveCompensationRequest.Bag = Bag;
    var Emd = /** @class */ (function () {
        function Emd() {
        }
        return Emd;
    }());
    SaveCompensationRequest.Emd = Emd;
    var Compensation = /** @class */ (function () {
        function Compensation() {
        }
        return Compensation;
    }());
    SaveCompensationRequest.Compensation = Compensation;
    var Passenger = /** @class */ (function () {
        function Passenger() {
            this.IsExistingCompensation = false;
            this.IsCompensationIssued = false;
            this.IsCompensationNotIssued = false;
        }
        return Passenger;
    }());
    SaveCompensationRequest.Passenger = Passenger;
    var FlightSegment = /** @class */ (function () {
        function FlightSegment() {
        }
        return FlightSegment;
    }());
    SaveCompensationRequest.FlightSegment = FlightSegment;
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    SaveCompensationRequest.RootObject = RootObject;
})(SaveCompensationRequest = exports.SaveCompensationRequest || (exports.SaveCompensationRequest = {}));
var IssueCompensationRequest;
(function (IssueCompensationRequest) {
    var SelectedService = /** @class */ (function () {
        function SelectedService() {
        }
        return SelectedService;
    }());
    IssueCompensationRequest.SelectedService = SelectedService;
    var Services = /** @class */ (function () {
        function Services() {
        }
        return Services;
    }());
    IssueCompensationRequest.Services = Services;
    var Payments = /** @class */ (function () {
        function Payments() {
        }
        return Payments;
    }());
    IssueCompensationRequest.Payments = Payments;
    var Emd = /** @class */ (function () {
        function Emd() {
            this.Endorsements1Txt = "";
        }
        return Emd;
    }());
    IssueCompensationRequest.Emd = Emd;
    var Compensation = /** @class */ (function () {
        function Compensation() {
        }
        return Compensation;
    }());
    IssueCompensationRequest.Compensation = Compensation;
    var Passenger = /** @class */ (function () {
        function Passenger() {
        }
        return Passenger;
    }());
    IssueCompensationRequest.Passenger = Passenger;
    var SSRs = /** @class */ (function () {
        function SSRs() {
        }
        return SSRs;
    }());
    IssueCompensationRequest.SSRs = SSRs;
    var FlightSegment = /** @class */ (function () {
        function FlightSegment() {
        }
        return FlightSegment;
    }());
    IssueCompensationRequest.FlightSegment = FlightSegment;
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    IssueCompensationRequest.RootObject = RootObject;
})(IssueCompensationRequest = exports.IssueCompensationRequest || (exports.IssueCompensationRequest = {}));
var AgentPrivilage;
(function (AgentPrivilage) {
    var Privilege = /** @class */ (function () {
        function Privilege() {
        }
        return Privilege;
    }());
    AgentPrivilage.Privilege = Privilege;
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    AgentPrivilage.RootObject = RootObject;
})(AgentPrivilage = exports.AgentPrivilage || (exports.AgentPrivilage = {}));
var CityCodeCollection;
(function (CityCodeCollection) {
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    CityCodeCollection.RootObject = RootObject;
    var CollectionEntity = /** @class */ (function () {
        function CollectionEntity() {
        }
        return CollectionEntity;
    }());
    CityCodeCollection.CollectionEntity = CollectionEntity;
})(CityCodeCollection = exports.CityCodeCollection || (exports.CityCodeCollection = {}));
var EmailModule;
(function (EmailModule) {
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    EmailModule.RootObject = RootObject;
    var SegmentsEntity = /** @class */ (function () {
        function SegmentsEntity() {
        }
        return SegmentsEntity;
    }());
    EmailModule.SegmentsEntity = SegmentsEntity;
    var DepartureOrArrival = /** @class */ (function () {
        function DepartureOrArrival() {
        }
        return DepartureOrArrival;
    }());
    EmailModule.DepartureOrArrival = DepartureOrArrival;
    var Passenger = /** @class */ (function () {
        function Passenger() {
        }
        return Passenger;
    }());
    EmailModule.Passenger = Passenger;
    var Coupon = /** @class */ (function () {
        function Coupon() {
        }
        return Coupon;
    }());
    EmailModule.Coupon = Coupon;
    var DeliveryDetail = /** @class */ (function () {
        function DeliveryDetail() {
        }
        return DeliveryDetail;
    }());
    EmailModule.DeliveryDetail = DeliveryDetail;
    var Email = /** @class */ (function () {
        function Email() {
        }
        return Email;
    }());
    EmailModule.Email = Email;
    var ToEntity = /** @class */ (function () {
        function ToEntity() {
        }
        return ToEntity;
    }());
    EmailModule.ToEntity = ToEntity;
})(EmailModule = exports.EmailModule || (exports.EmailModule = {}));
var updateEmailModel;
(function (updateEmailModel) {
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    updateEmailModel.RootObject = RootObject;
    var Traveler = /** @class */ (function () {
        function Traveler() {
        }
        return Traveler;
    }());
    updateEmailModel.Traveler = Traveler;
    var EmailsEntity = /** @class */ (function () {
        function EmailsEntity() {
        }
        return EmailsEntity;
    }());
    updateEmailModel.EmailsEntity = EmailsEntity;
})(updateEmailModel = exports.updateEmailModel || (exports.updateEmailModel = {}));
var PrintModule;
(function (PrintModule) {
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    PrintModule.RootObject = RootObject;
    var Segment = /** @class */ (function () {
        function Segment() {
        }
        return Segment;
    }());
    PrintModule.Segment = Segment;
    var Departure = /** @class */ (function () {
        function Departure() {
        }
        return Departure;
    }());
    PrintModule.Departure = Departure;
    var Arrival = /** @class */ (function () {
        function Arrival() {
        }
        return Arrival;
    }());
    PrintModule.Arrival = Arrival;
    var Passenger = /** @class */ (function () {
        function Passenger() {
        }
        return Passenger;
    }());
    PrintModule.Passenger = Passenger;
    var EMDEntity = /** @class */ (function () {
        function EMDEntity() {
        }
        return EMDEntity;
    }());
    PrintModule.EMDEntity = EMDEntity;
    var DeliveryDetail = /** @class */ (function () {
        function DeliveryDetail() {
        }
        return DeliveryDetail;
    }());
    PrintModule.DeliveryDetail = DeliveryDetail;
    var Printer = /** @class */ (function () {
        function Printer() {
        }
        return Printer;
    }());
    PrintModule.Printer = Printer;
})(PrintModule = exports.PrintModule || (exports.PrintModule = {}));
var PassengerTypeModel;
(function (PassengerTypeModel) {
    var Value = /** @class */ (function () {
        function Value() {
        }
        return Value;
    }());
    PassengerTypeModel.Value = Value;
    var PassengerTypeListTable = /** @class */ (function () {
        function PassengerTypeListTable() {
        }
        return PassengerTypeListTable;
    }());
    PassengerTypeModel.PassengerTypeListTable = PassengerTypeListTable;
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    PassengerTypeModel.RootObject = RootObject;
})(PassengerTypeModel = exports.PassengerTypeModel || (exports.PassengerTypeModel = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGFuc2F0aW9uLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tcGFuc2F0aW9uLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7SUFBQTtJQUdBLENBQUM7SUFBRCxnQkFBQztBQUFELENBQUMsQUFIRCxJQUdDO0FBSFksOEJBQVM7QUFLdEI7SUFBQTtJQWlCQSxDQUFDO0lBQUQsaUJBQUM7QUFBRCxDQUFDLEFBakJELElBaUJDO0FBakJZLGdDQUFVO0FBbUJ2QjtJQUFBO0lBUUEsQ0FBQztJQUFELGVBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQVJZLDRCQUFRO0FBVXJCO0lBQUE7SUFJQSxDQUFDO0lBQUQsOEJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpZLDBEQUF1QjtBQU1wQztJQUFBO0lBSUEsQ0FBQztJQUFELCtCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKWSw0REFBd0I7QUFNckM7SUFBQTtJQU9BLENBQUM7SUFBRCw0QkFBQztBQUFELENBQUMsQUFQRCxJQU9DO0FBUFksc0RBQXFCO0FBU2xDO0lBQUE7SUFJQSxDQUFDO0lBQUQsd0JBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpZLDhDQUFpQjtBQU05QjtJQUFBO0lBWUEsQ0FBQztJQUFELGtCQUFDO0FBQUQsQ0FBQyxBQVpELElBWUM7QUFaWSxrQ0FBVztBQWN4QjtJQUFBO0lBT0EsQ0FBQztJQUFELHVCQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFQWSw0Q0FBZ0I7QUFTN0I7SUFBQTtJQXlDQSxDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUFDLEFBekNELElBeUNDO0FBekNZLHNDQUFhO0FBMkMxQjtJQUFBO0lBSUEsQ0FBQztJQUFELG1CQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKWSxvQ0FBWTtBQU16QjtJQUFBO0lBR0EsQ0FBQztJQUFELDZCQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFIWSx3REFBc0I7QUFLbkM7SUFB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SUFIWSxxQkFBUyxZQUdyQixDQUFBO0lBQ0Q7UUFBQTtRQUdBLENBQUM7UUFBRCxxQkFBQztJQUFELENBQUMsQUFIRCxJQUdDO0lBSFksMEJBQWMsaUJBRzFCLENBQUE7SUFDRDtRQUFBO1FBT0EsQ0FBQztRQUFELGNBQUM7SUFBRCxDQUFDLEFBUEQsSUFPQztJQVBZLG1CQUFPLFVBT25CLENBQUE7QUFDTCxDQUFDLEVBekRhLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBeUR4QjtBQUNELElBQWMsa0JBQWtCLENBZ0IvQjtBQWhCRCxXQUFjLGtCQUFrQjtJQUU1QjtRQUFBO1FBR0EsQ0FBQztRQUFELFlBQUM7SUFBRCxDQUFDLEFBSEQsSUFHQztJQUhZLHdCQUFLLFFBR2pCLENBQUE7SUFFRDtRQUFBO1FBR0EsQ0FBQztRQUFELDZCQUFDO0lBQUQsQ0FBQyxBQUhELElBR0M7SUFIWSx5Q0FBc0IseUJBR2xDLENBQUE7SUFFRDtRQUFBO1FBRUEsQ0FBQztRQUFELGlCQUFDO0lBQUQsQ0FBQyxBQUZELElBRUM7SUFGWSw2QkFBVSxhQUV0QixDQUFBO0FBRUwsQ0FBQyxFQWhCYSxrQkFBa0IsR0FBbEIsMEJBQWtCLEtBQWxCLDBCQUFrQixRQWdCL0IiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgRXF1aXBtZW50IHtcbiAgICBBaXJFcXVpcFR5cGU6IHN0cmluZztcbiAgICBBaXJjcmFmdFRhaWxOdW1iZXI6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEZsaWdodEluZm8ge1xuICAgIElzSW50ZXJuYXRpb25hbDogYm9vbGVhbjtcbiAgICBCb2FyZGluZ0luaXRpYXRlZDogYm9vbGVhbjtcbiAgICBCb2FyZGluZ0RhdGVUaW1lOiBEYXRlO1xuICAgIFN0YW5kYnlDbGVhcmFuY2VJbml0aWF0ZWQ6IGJvb2xlYW47XG4gICAgRXF1aXBtZW50OiBFcXVpcG1lbnQ7XG4gICAgRGVwYXJ0dXJlVGltZTogRGF0ZTtcbiAgICBEZXN0aW5hdGlvbkFpcnBvcnQ6IHN0cmluZztcbiAgICBJc1VUQzogYm9vbGVhbjtcbiAgICBPcGVyYXRpbmdGbGlnaHROdW1iZXI/OiBhbnk7XG4gICAgQ29ubmVjdGlvbkZsaWdodE51bWJlcj86IGFueTtcbiAgICBPcHRpb25hbEZsaWdodE51bWJlcj86IGFueTtcbiAgICBTZWdtZW50UlBIPzogYW55O1xuICAgIEJvb2tpbmdDbGFzcz86IGFueTtcbiAgICBGbGlnaHROdW1iZXI6IHN0cmluZztcbiAgICBEZXBhcnR1cmVEYXRlOiBEYXRlO1xuICAgIERlcGFydHVyZUFpcnBvcnQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFNlYXRMaXN0IHtcbiAgICBTZWF0QXZhaWxhYmlsaXR5PzogYW55O1xuICAgIFNlYXROdW1iZXI6IHN0cmluZztcbiAgICBTZWF0Q2hhcmFjdGVyaXN0aWNzPzogYW55O1xuICAgIERlcGFydHVyZUNvZGU6IHN0cmluZztcbiAgICBBcnJpdmFsQ29kZTogc3RyaW5nO1xuICAgIENhYmluOiBzdHJpbmc7XG4gICAgSXNUaHJ1U2VhdE5lZWRlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIEluYm91bmRDb25uZWN0aW5nRmxpZ2h0IHtcbiAgICBEZXBhcnR1cmVEYXRlVGltZT86IGFueTtcbiAgICBGbGlnaHROdW1iZXI6IHN0cmluZztcbiAgICBMb2NhdGlvbkNvZGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIE91dGJvdW5kQ29ubmVjdGluZ0ZsaWdodCB7XG4gICAgRGVwYXJ0dXJlRGF0ZVRpbWU/OiBhbnk7XG4gICAgRmxpZ2h0TnVtYmVyOiBzdHJpbmc7XG4gICAgTG9jYXRpb25Db2RlOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBTcGVjaWFsU2VydmljZVJlcXVlc3Qge1xuICAgIFRleHQ6IHN0cmluZztcbiAgICBBaXJsaW5lPzogYW55O1xuICAgIE9wZXJhdGlvbjogbnVtYmVyO1xuICAgIFNTUkNvZGU6IHN0cmluZztcbiAgICBTZXJ2aWNlUXVhbnRpdHk6IG51bWJlcjtcbiAgICBTdGF0dXM6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEFsbGlhbmNlVGllckxldmVsIHtcbiAgICBOYW1lOiBzdHJpbmc7XG4gICAgQ29kZTogc3RyaW5nO1xuICAgIE51bWJlcj86IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIEZxdFRyYXZlbGVyIHtcbiAgICBJc1N0YXJBbGxpYW5jZTogYm9vbGVhbjtcbiAgICBJc1JlZlZhbHVlOiBib29sZWFuO1xuICAgIE1lbWJlcnNoaXBJRDogc3RyaW5nO1xuICAgIFByb2dyYW1JRDogc3RyaW5nO1xuICAgIEF3YXJkSW5mb3JtYXRpb24/OiBhbnk7XG4gICAgVmVuZG9yQ29kZXM/OiBhbnk7XG4gICAgT3BlcmF0aW9uPzogYW55O1xuICAgIExveWFsdHlQcm9ncmFtQ29kZT86IGFueTtcbiAgICBNaWxlc0JhbGFuY2U/OiBhbnk7XG4gICAgQWxsaWFuY2VUaWVyTGV2ZWw6IEFsbGlhbmNlVGllckxldmVsO1xuICAgIFRpZXJMZXZlbD86IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIE90aGVyU2VydmljZUluZm8ge1xuICAgIFRleHQ6IHN0cmluZztcbiAgICBBaXJsaW5lPzogYW55O1xuICAgIE9wZXJhdGlvbjogbnVtYmVyO1xuICAgIFNTUkNvZGU/OiBhbnk7XG4gICAgU2VydmljZVF1YW50aXR5OiBudW1iZXI7XG4gICAgU3RhdHVzPzogYW55O1xufVxuXG5leHBvcnQgY2xhc3MgUGFzc2VuZ2VyTGlzdCB7XG4gICAgT3JkZXJJZDogc3RyaW5nO1xuICAgIFBhc3NlbmdlclR5cGU/OiBhbnk7XG4gICAgUGFzc2VuZ2VyUlBIOiBzdHJpbmc7XG4gICAgRmxpZ2h0UlBIPzogYW55O1xuICAgIFNlYXRMaXN0OiBTZWF0TGlzdFtdO1xuICAgIFNlcXVlbmNlTnVtYmVyOiBzdHJpbmc7XG4gICAgUGFzc2VuZ2VyUmVmTnVtYmVyOiBzdHJpbmc7XG4gICAgQ2hlY2tpbkRhdGVUaW1lPzogRGF0ZTtcbiAgICBTdGF0dXM6IHN0cmluZztcbiAgICBHaXZlbk5hbWU6IHN0cmluZztcbiAgICBTdXJuYW1lOiBzdHJpbmc7XG4gICAgQWx0ZXJuYXRlRmxpZ2h0TnVtYmVyOiBzdHJpbmc7XG4gICAgRGVzdDogc3RyaW5nO1xuICAgIE9yZ2luOiBzdHJpbmc7XG4gICAgQm9hcmRpbmdQcmlvcml0eT86IGFueTtcbiAgICBTZWF0TnVtYmVyPzogYW55O1xuICAgIFJlc0Jvb2tEZXNpZ0NvZGU6IHN0cmluZztcbiAgICBVcGdyYWRlUmVzQm9va0Rlc2lnQ29kZT86IGFueTtcbiAgICBJbmZ3aXRoU2VhdD86IGFueTtcbiAgICBJbmZhbnRJbmRpY2F0b3I/OiBhbnk7XG4gICAgSXNXYWl0TGlzdDogYm9vbGVhbjtcbiAgICBJbmJvdW5kQ29ubmVjdGluZ0ZsaWdodDogSW5ib3VuZENvbm5lY3RpbmdGbGlnaHQ7XG4gICAgT3V0Ym91bmRDb25uZWN0aW5nRmxpZ2h0OiBPdXRib3VuZENvbm5lY3RpbmdGbGlnaHQ7XG4gICAgU2VydmljZUNvbWJpbmVkU3RyaW5nOiBzdHJpbmc7XG4gICAgU1NSczogc3RyaW5nW107XG4gICAgU3RhbmRieVBhc3NlbmdlclR5cGU6IHN0cmluZztcbiAgICBTdGFuZGJ5UmFuazogbnVtYmVyO1xuICAgIElzU3RhbmRieUZvclVwZ3JhZGU6IGJvb2xlYW47XG4gICAgU2VjdXJpdHlDb2RlOiBzdHJpbmc7XG4gICAgQ2hlY2tlZEJhZ0NvdW50OiBudW1iZXI7XG4gICAgQmFnVGFnczogc3RyaW5nW107XG4gICAgUGFzc2VuZ2VyQ2hhcmFjdGVyaXN0aWNzOiBzdHJpbmdbXTtcbiAgICBJTkZHaXZlbk5hbWU/OiBhbnk7XG4gICAgSU5GU3VybmFtZT86IGFueTtcbiAgICBJTkZET0I/OiBhbnk7XG4gICAgUGFzc2VuZ2VyTWVzc2FnZXM/OiBhbnk7XG4gICAgU3BlY2lhbFNlcnZpY2VSZXF1ZXN0OiBTcGVjaWFsU2VydmljZVJlcXVlc3RbXTtcbiAgICBGcXRUcmF2ZWxlcnM6IEZxdFRyYXZlbGVyW107XG4gICAgT2xkRmxpZ2h0U2VhdGluZ0luZm9ybWF0aW9uPzogYW55O1xuICAgIE90aGVyU2VydmljZUluZm86IE90aGVyU2VydmljZUluZm9bXTtcbn1cblxuZXhwb3J0IGNsYXNzIENvbXBhbnNhdGlvbiB7XG4gICAgRmxpZ2h0SW5mbzogRmxpZ2h0SW5mbztcbiAgICBHcm91cGVkUGFzc2VuZ2VyTGlzdD86IGFueTtcbiAgICBQYXNzZW5nZXJMaXN0OiBQYXNzZW5nZXJMaXN0W107XG59XG5cbmV4cG9ydCBjbGFzcyBQYXNzZW5nZXJUeXBlTGlzdFRhYmxlIHtcbiAgICBLZXk6IHN0cmluZztcbiAgICBWYWx1ZTogVmFsdWU7XG59XG5cbmV4cG9ydCBjbGFzcyBWYWx1ZSB7XG4gICAgRGVzY3JpcHRpb246IHN0cmluZztcbiAgICBMaXN0VHlwZTogc3RyaW5nO1xufVxuXG5cbi8vIFJlcXVlc3QgSXNzdWUgQ29tcGVuc2F0aW9uIE1vZGVsXG5cblxuZXhwb3J0IG1vZHVsZSBCcmVSZXF1ZXN0IHtcblxuICAgIGV4cG9ydCBjbGFzcyBQYXNzZW5nZXIge1xuICAgICAgICBGbGlnaHRTZWdtZW50SWQ6IHN0cmluZztcbiAgICAgICAgUGFzc2VuZ2VyU2VxPzogYW55O1xuICAgICAgICBPcmRlcklkOiBzdHJpbmc7XG4gICAgICAgIFBheExhc3RObTogc3RyaW5nO1xuICAgICAgICBQYXhGaXJzdE5tOiBzdHJpbmc7XG4gICAgICAgIE9yaWdpbjogc3RyaW5nO1xuICAgICAgICBEZXN0OiBzdHJpbmc7XG4gICAgICAgIFBheFR5cGU/OiBhbnk7XG4gICAgICAgIFBheENvbXBSZWFzb25JZDogc3RyaW5nO1xuICAgICAgICBGcXR2Q2M/OiBhbnk7XG4gICAgICAgIEZxdHZOdW1iZXI/OiBhbnk7XG4gICAgICAgIFBheFN0YXR1cz86IGFueTtcbiAgICAgICAgUGF4RW1haWxBZGRyZXNzPzogYW55O1xuICAgICAgICBVcGRhdGVMb2NrTmJyPzogYW55O1xuICAgICAgICBGcXR2VGllcj86IGFueTtcbiAgICAgICAgQ2FiaW5DbGFzczogc3RyaW5nO1xuICAgICAgICBQYXhSUEg6IHN0cmluZztcbiAgICAgICAgQ29tcFJlYXNvblRleHQ6IHN0cmluZztcbiAgICAgICAgU1NSOiBTU1JzW107XG4gICAgICAgIEV0a3Q6IGFueVtdO1xuICAgICAgICBSZWFjY29tRGV0YWlsczogYW55W107XG4gICAgICAgIEJhZ3M6IGFueVtdO1xuICAgICAgICBDb21wZW5zYXRpb25zOiBhbnlbXTtcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIFNTUnMge1xuICAgICAgICBGbGlnaHRTZWdtZW50SWQ6IG51bWJlcjtcbiAgICAgICAgUGFzc2VuZ2VyU2VxOiBudW1iZXI7XG4gICAgICAgIFNzckNvZGU6IHN0cmluZztcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIEZsaWdodFNlZ21lbnQge1xuICAgICAgICBGbGlnaHRTZWdtZW50SWQ6IG51bWJlcjtcbiAgICAgICAgQWlybGluZUNvZGU6IHN0cmluZztcbiAgICAgICAgRmxpZ2h0Tm86IHN0cmluZztcbiAgICAgICAgRGVwYXJ0dXJlRHQ6IHN0cmluZztcbiAgICAgICAgRGVwYXJ0dXJlOiBzdHJpbmc7XG4gICAgICAgIEFycml2YWw6IHN0cmluZztcbiAgICAgICAgRmxpZ2h0U2VnbWVudFJQSD86IGFueTtcbiAgICAgICAgUGFzc2VuZ2VyczogUGFzc2VuZ2VyW107XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFJvb3RPYmplY3Qge1xuICAgICAgICBTb3VyY2VJZDogc3RyaW5nO1xuICAgICAgICBwcml2aWxlZ2U6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAgICAgVXNlcklkOiBzdHJpbmc7XG4gICAgICAgIEZsaWdodFNlZ21lbnRzOiBGbGlnaHRTZWdtZW50W107XG4gICAgfVxuXG59XG5cblxuXG4vLyBSZXNwb25zZSBJc3N1ZSBDb21wZW5zYXRpb24gTW9kZWxcblxuZXhwb3J0IG1vZHVsZSBCUkVDb21wZW5zYXRpb24ge1xuXG4gICAgZXhwb3J0IGNsYXNzIEVtZCB7XG4gICAgICAgIGNvbXBlbnNhdGlvbkNhdXNlOiBzdHJpbmc7XG4gICAgICAgIGNvbXBlbnNhdGlvblR5cGU6IHN0cmluZztcbiAgICAgICAgZW1kRW5kb3JzYWJsZTogYm9vbGVhbjtcbiAgICAgICAgZW1kRXhjaGFuZ2VhYmxlOiBib29sZWFuO1xuICAgICAgICBlbWRSZWZ1bmRhYmxlOiBib29sZWFuO1xuICAgICAgICBlbWRUeXBlOiBzdHJpbmc7XG4gICAgICAgIGVtZFVzZWRBdElzc3VhbmNlOiBib29sZWFuO1xuICAgICAgICBlbmRvcnNlbWVudFRleHRJdGVtczogc3RyaW5nW107XG4gICAgICAgIGZvcm1PZlBheW1lbnQ6IHN0cmluZztcbiAgICAgICAgcHJvZHVjdENvZGU6IHN0cmluZztcbiAgICAgICAgc3ViUHJvZHVjdENvZGU6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ29tcGVuc2F0aW9uIHtcbiAgICAgICAgYW1vdW50OiBudW1iZXI7XG4gICAgICAgIGNvbXBlbnNhdGlvblR5cGU6IHN0cmluZztcbiAgICAgICAgbG93ZXJMaW1pdDogbnVtYmVyO1xuICAgICAgICB1cHBlckxpbWl0OiBudW1iZXI7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFBhc3NlbmdlciB7XG4gICAgICAgIGNhYmluQ2xhc3M6IHN0cmluZztcbiAgICAgICAgY29tcGVuc2F0aW9uQ2F1c2U6IHN0cmluZztcbiAgICAgICAgY29tcGVuc2F0aW9uczogQ29tcGVuc2F0aW9uW107XG4gICAgICAgIGZsaWdodE51bWJlcjogc3RyaW5nO1xuICAgICAgICBnaXZlbk5hbWU6IHN0cmluZztcbiAgICAgICAgb3JkZXJJZDogc3RyaW5nO1xuICAgICAgICBwYXNzZW5nZXJUeXBlOiBzdHJpbmc7XG4gICAgICAgIHN1cm5hbWU6IHN0cmluZztcbiAgICAgICAgdGllckxldmVsOiBzdHJpbmc7XG4gICAgICAgIElzU2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZnVsbG5hbWU6IHN0cmluZztcbiAgICAgICAgZW1haWw6IHN0cmluZztcbiAgICAgICAgYWRkaXRpb25hbGRldGFpbHM6IHN0cmluZztcbiAgICAgICAgbW9uZXRhcnk6IG51bWJlcjtcbiAgICAgICAgaG90ZWw6IG51bWJlcjtcbiAgICAgICAgbWVhbDogbnVtYmVyO1xuICAgICAgICB0cmFuc3BvcnRhdGlvbjogbnVtYmVyO1xuICAgICAgICBhZGRpdGlvbmFsRGV0YWlsc1RleHRzOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEJSRVJlc3BvbnNlIHtcbiAgICAgICAgdHlwZTogc3RyaW5nO1xuICAgICAgICBlbWQ6IEVtZFtdO1xuICAgICAgICBwYXNzZW5nZXJzOiBQYXNzZW5nZXJbXTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IG1vZHVsZSBDb21wZW5zYXRpb25QYXhMaXN0IHtcblxuICAgIGV4cG9ydCBjbGFzcyBTU1Ige1xuICAgICAgICBGbGlnaHRTZWdtZW50SWQ6IG51bWJlcjtcbiAgICAgICAgUGFzc2VuZ2VyU2VxOiBudW1iZXI7XG4gICAgICAgIFNzckNvZGU6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRXRrdCB7XG4gICAgICAgIEZsaWdodFNlZ21lbnRJZDogbnVtYmVyO1xuICAgICAgICBQYXNzZW5nZXJTZXE6IG51bWJlcjtcbiAgICAgICAgVGlja2V0TmJyOiBzdHJpbmc7XG4gICAgICAgIENwbk51bTogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBSZWFjY29tRGV0YWlsIHtcbiAgICAgICAgRmxpZ2h0U2VnbWVudElkOiBudW1iZXI7XG4gICAgICAgIFBhc3NlbmdlclNlcTogbnVtYmVyO1xuICAgICAgICBSZWFjb21TZXE6IG51bWJlcjtcbiAgICAgICAgRnJvbVRvRmxhZzogc3RyaW5nO1xuICAgICAgICBSZWFjY29tQWlybGluZUNvZGU6IHN0cmluZztcbiAgICAgICAgUmVhY2NvbUZsaWdodE5vOiBzdHJpbmc7XG4gICAgICAgIFJlYWNjb21GbGlnaHREdDogc3RyaW5nO1xuICAgICAgICBSZWFjY29tQm9hcmRDaXR5Q2Q6IHN0cmluZztcbiAgICAgICAgUmVhY2NvbU9mZkNpdHlDZDogc3RyaW5nO1xuICAgICAgICBVcGRhdGVMb2NrTmJyOiBudW1iZXI7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEJhZyB7XG4gICAgICAgIEZsaWdodFNlZ21lbnRJZDogbnVtYmVyO1xuICAgICAgICBQYXNzZW5nZXJTZXE6IG51bWJlcjtcbiAgICAgICAgQmFndGFnTmJyOiBzdHJpbmc7XG4gICAgICAgIFVwZGF0ZUxvY2tOYnI6IG51bWJlcjtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRW1kIHtcbiAgICAgICAgRmxpZ2h0U2VnbWVudElkOiBudW1iZXI7XG4gICAgICAgIFBhc3NlbmdlclNlcTogbnVtYmVyO1xuICAgICAgICBDb21wU2VxOiBzdHJpbmc7XG4gICAgICAgIFByaW1hcnlEb2N1bWVudE5icjogc3RyaW5nO1xuICAgICAgICBQcmltYXJ5QWlybGluZUNkOiBzdHJpbmc7XG4gICAgICAgIElzc3VlRHQ6IHN0cmluZztcbiAgICAgICAgRmlyc3RObTogc3RyaW5nO1xuICAgICAgICBMYXN0Tm06IHN0cmluZztcbiAgICAgICAgVXNlcklkOiBzdHJpbmc7XG4gICAgICAgIFJlYXNvbkZvcklzc3VhbmNlU3ViQ2Q6IHN0cmluZztcbiAgICAgICAgUmVhc29uRm9ySXNzdWFuY2VDZDogc3RyaW5nO1xuICAgICAgICBFbmRvcnNlbWVudHMxVHh0OiBzdHJpbmc7XG4gICAgICAgIFJlbWFya1R4dDogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBDb21wZW5zYXRpb24ge1xuICAgICAgICBGbGlnaHRTZWdtZW50SWQ6IG51bWJlcjtcbiAgICAgICAgUGFzc2VuZ2VyU2VxOiBudW1iZXI7XG4gICAgICAgIENvbXBTZXE6IHN0cmluZztcbiAgICAgICAgQ29tcFJlYXNvbklkOiBzdHJpbmc7XG4gICAgICAgIENvbXBSZWFzb25UZXh0OiBzdHJpbmc7XG4gICAgICAgIENvbXBUeXBlSWQ6IHN0cmluZztcbiAgICAgICAgQ29tcFR5cGVUZXh0OiBzdHJpbmc7XG4gICAgICAgIENvbXBBbXQ6IG51bWJlcjtcbiAgICAgICAgQ29tcEN1cnJlbmN5Q2Q6IHN0cmluZztcbiAgICAgICAgVm91Y2hlckNudDogc3RyaW5nO1xuICAgICAgICBPdmVycmlkZVJlYXNvbjogc3RyaW5nO1xuICAgICAgICBVcGRhdGVMb2NrTmJyOiBudW1iZXI7XG4gICAgICAgIEVtZHM6IEVtZFtdO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFbWQyIHtcbiAgICAgICAgRmxpZ2h0U2VnbWVudElkOiBudW1iZXI7XG4gICAgICAgIFBhc3NlbmdlclNlcTogbnVtYmVyO1xuICAgICAgICBDb21wU2VxOiBzdHJpbmc7XG4gICAgICAgIFByaW1hcnlEb2N1bWVudE5icjogc3RyaW5nO1xuICAgICAgICBQcmltYXJ5QWlybGluZUNkOiBzdHJpbmc7XG4gICAgICAgIElzc3VlRHQ6IHN0cmluZztcbiAgICAgICAgRmlyc3RObTogc3RyaW5nO1xuICAgICAgICBMYXN0Tm06IHN0cmluZztcbiAgICAgICAgVXNlcklkOiBzdHJpbmc7XG4gICAgICAgIFJlYXNvbkZvcklzc3VhbmNlU3ViQ2Q6IHN0cmluZztcbiAgICAgICAgUmVhc29uRm9ySXNzdWFuY2VDZDogc3RyaW5nO1xuICAgICAgICBFbmRvcnNlbWVudHMxVHh0OiBzdHJpbmc7XG4gICAgICAgIFJlbWFya1R4dDogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFeGlzdGluZ0NvbXBlbnNhdGlvbiB7XG4gICAgICAgIEZsaWdodFNlZ21lbnRJZDogbnVtYmVyO1xuICAgICAgICBQYXNzZW5nZXJTZXE6IG51bWJlcjtcbiAgICAgICAgQ29tcFNlcTogc3RyaW5nO1xuICAgICAgICBDb21wUmVhc29uSWQ6IHN0cmluZztcbiAgICAgICAgQ29tcFJlYXNvblRleHQ6IHN0cmluZztcbiAgICAgICAgQ29tcFR5cGVJZDogc3RyaW5nO1xuICAgICAgICBDb21wVHlwZVRleHQ6IHN0cmluZztcbiAgICAgICAgQ29tcEFtdDogbnVtYmVyO1xuICAgICAgICBDb21wQ3VycmVuY3lDZDogc3RyaW5nO1xuICAgICAgICBWb3VjaGVyQ250OiBzdHJpbmc7XG4gICAgICAgIE92ZXJyaWRlUmVhc29uOiBzdHJpbmc7XG4gICAgICAgIFVwZGF0ZUxvY2tOYnI6IG51bWJlcjtcbiAgICAgICAgRW1kczogRW1kMltdO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQYXNzZW5nZXIge1xuICAgICAgICBGbGlnaHRTZWdtZW50SWQ6IG51bWJlcjtcbiAgICAgICAgUGFzc2VuZ2VyU2VxPzogbnVtYmVyO1xuICAgICAgICBPcmRlcklkOiBzdHJpbmc7XG4gICAgICAgIFN1cm5hbWVOdW0/OiBudW1iZXI7XG4gICAgICAgIEZpcnN0bmFtZU51bTogc3RyaW5nO1xuICAgICAgICBQYXhMYXN0Tm06IHN0cmluZztcbiAgICAgICAgUGF4Rmlyc3RObTogc3RyaW5nO1xuICAgICAgICBQYXhUeXBlOiBzdHJpbmc7XG4gICAgICAgIEZxdHZDYz86IGFueTtcbiAgICAgICAgRnF0dk51bWJlcj86IGFueTtcbiAgICAgICAgUGF4U3RhdHVzOiBzdHJpbmc7XG4gICAgICAgIFBheEVtYWlsQWRkcmVzczogc3RyaW5nO1xuICAgICAgICBJc0V4aXN0aW5nQ29tcGVuc2F0aW9uOiBib29sZWFuO1xuICAgICAgICBVcGRhdGVMb2NrTmJyPzogbnVtYmVyO1xuICAgICAgICBGcXR2VGllcjogc3RyaW5nO1xuICAgICAgICBDYWJpbkNsYXNzOiBzdHJpbmc7XG4gICAgICAgIElzQ29tcGVuc2F0aW9uSXNzdWVkOiBib29sZWFuO1xuICAgICAgICBTU1I6IFNTUltdO1xuICAgICAgICBFdGt0OiBFdGt0W107XG4gICAgICAgIFJlYWNjb21EZXRhaWxzOiBSZWFjY29tRGV0YWlsW107XG4gICAgICAgIEJhZ3M6IEJhZ1tdO1xuICAgICAgICBDb21wZW5zYXRpb25zOiBDb21wZW5zYXRpb25bXTtcbiAgICAgICAgRXhpc3RpbmdDb21wZW5zYXRpb25zOiBFeGlzdGluZ0NvbXBlbnNhdGlvbltdO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBGbGlnaHRTZWdtZW50IHtcbiAgICAgICAgRmxpZ2h0U2VnbWVudElkOiBudW1iZXI7XG4gICAgICAgIEFpcmxpbmVDb2RlOiBzdHJpbmc7XG4gICAgICAgIEZsaWdodE5vOiBzdHJpbmc7XG4gICAgICAgIERlcGFydHVyZUR0OiBzdHJpbmc7XG4gICAgICAgIERlcGFydHVyZTogc3RyaW5nO1xuICAgICAgICBBcnJpdmFsOiBzdHJpbmc7XG4gICAgICAgIFBhc3NlbmdlcnM6IFBhc3NlbmdlcltdO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBSb290T2JqZWN0IHtcbiAgICAgICAgRmxpZ2h0U2VnbWVudHM6IEZsaWdodFNlZ21lbnRbXTtcbiAgICAgICAgRXJyb3JzPzogYW55O1xuICAgIH1cblxufVxuXG5cblxuZXhwb3J0IG1vZHVsZSBTYXZlQ29tcGVuc2F0aW9uUmVxdWVzdCB7XG5cbiAgICBleHBvcnQgY2xhc3MgU1NSIHtcbiAgICAgICAgRmxpZ2h0U2VnbWVudElkPzogYW55O1xuICAgICAgICBQYXNzZW5nZXJTZXE/OiBhbnk7XG4gICAgICAgIFNzckNvZGU6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRXRrdCB7XG4gICAgICAgIEZsaWdodFNlZ21lbnRJZD86IGFueTtcbiAgICAgICAgUGFzc2VuZ2VyU2VxPzogYW55O1xuICAgICAgICBUaWNrZXROYnI6IHN0cmluZztcbiAgICAgICAgQ3BuTnVtOiBudW1iZXI7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFJlYWNjb21EZXRhaWwge1xuICAgICAgICBGbGlnaHRTZWdtZW50SWQ/OiBhbnk7XG4gICAgICAgIFBhc3NlbmdlclNlcT86IGFueTtcbiAgICAgICAgUmVhY29tU2VxPzogYW55O1xuICAgICAgICBGcm9tVG9GbGFnOiBzdHJpbmc7XG4gICAgICAgIEdVSURpc3BsYXlGbGFnOiBzdHJpbmc7XG4gICAgICAgIFJlYWNjb21BaXJsaW5lQ29kZTogc3RyaW5nO1xuICAgICAgICBSZWFjY29tRmxpZ2h0Tm86IHN0cmluZztcbiAgICAgICAgUmVhY2NvbUZsaWdodER0OiBzdHJpbmc7XG4gICAgICAgIFJlYWNjb21Cb2FyZENpdHlDZDogc3RyaW5nO1xuICAgICAgICBSZWFjY29tT2ZmQ2l0eUNkOiBzdHJpbmc7XG4gICAgICAgIFVwZGF0ZUxvY2tOYnI/OiBhbnk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEJhZyB7XG4gICAgICAgIEZsaWdodFNlZ21lbnRJZD86IGFueTtcbiAgICAgICAgUGFzc2VuZ2VyU2VxPzogYW55O1xuICAgICAgICBCYWd0YWdOYnI6IHN0cmluZztcbiAgICAgICAgVXBkYXRlTG9ja05icj86IGFueTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRW1kIHtcbiAgICAgICAgRmxpZ2h0U2VnbWVudElkPzogYW55O1xuICAgICAgICBQYXNzZW5nZXJTZXE/OiBhbnk7XG4gICAgICAgIENvbXBTZXE/OiBhbnk7XG4gICAgICAgIFByaW1hcnlEb2N1bWVudE5icjogc3RyaW5nO1xuICAgICAgICBQcmltYXJ5QWlybGluZUNkOiBzdHJpbmc7XG4gICAgICAgIElzc3VlRHQ6IHN0cmluZztcbiAgICAgICAgRmlyc3RObTogc3RyaW5nO1xuICAgICAgICBMYXN0Tm06IHN0cmluZztcbiAgICAgICAgVXNlcklkOiBzdHJpbmc7XG4gICAgICAgIFJlYXNvbkZvcklzc3VhbmNlU3ViQ2Q6IHN0cmluZztcbiAgICAgICAgUmVhc29uRm9ySXNzdWFuY2VDZDogc3RyaW5nO1xuICAgICAgICBFbmRvcnNlbWVudHMxVHh0OiBzdHJpbmc7XG4gICAgICAgIFJlbWFya1R4dDogc3RyaW5nO1xuICAgICAgICBQcmludFN0YXR1czogc3RyaW5nO1xuICAgICAgICBFbWFpbFN0YXR1czogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBDb21wZW5zYXRpb24ge1xuICAgICAgICBGbGlnaHRTZWdtZW50SWQ/OiBudW1iZXI7XG4gICAgICAgIFBhc3NlbmdlclNlcT86IG51bWJlcjtcbiAgICAgICAgQ29tcFNlcT86IHN0cmluZztcbiAgICAgICAgQ29tcFJlYXNvbklkOiBudW1iZXI7XG4gICAgICAgIENvbXBUeXBlSWQ/OiBzdHJpbmc7XG4gICAgICAgIENvbXBBbXQ6IG51bWJlcjtcbiAgICAgICAgQ29tcEN1cnJlbmN5Q2Q6IHN0cmluZztcbiAgICAgICAgVm91Y2hlckNudDogc3RyaW5nO1xuICAgICAgICBPdmVycmlkZVJlYXNvbjogc3RyaW5nO1xuICAgICAgICBVcGRhdGVMb2NrTmJyPzogbnVtYmVyO1xuICAgICAgICBDb21wUmVhc29uVGV4dDogc3RyaW5nO1xuICAgICAgICBDb21wVHlwZVRleHQ6IHN0cmluZztcbiAgICAgICAgRW1kczogRW1kW107XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFBhc3NlbmdlciB7XG4gICAgICAgIEZsaWdodFNlZ21lbnRJZD86IGFueTtcbiAgICAgICAgUGFzc2VuZ2VyU2VxPzogYW55O1xuICAgICAgICBPcmRlcklkOiBzdHJpbmc7XG4gICAgICAgIFN1cm5hbWVOdW06IG51bWJlcjtcbiAgICAgICAgRmlyc3RuYW1lTnVtOiBudW1iZXI7XG4gICAgICAgIFBheExhc3RObTogc3RyaW5nO1xuICAgICAgICBQYXhGaXJzdE5tOiBzdHJpbmc7XG4gICAgICAgIFBheFR5cGU6IHN0cmluZztcbiAgICAgICAgRnF0dkNjOiBzdHJpbmc7XG4gICAgICAgIEZxdHZOdW1iZXI6IHN0cmluZztcbiAgICAgICAgUGF4Q29tcFJlYXNvbklEOiBzdHJpbmc7XG4gICAgICAgIFBheENvbXBSZWFzb25UZXh0OiBzdHJpbmc7XG4gICAgICAgIElzRXhpc3RpbmdDb21wZW5zYXRpb246IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgT3JpZ2luOiBzdHJpbmc7XG4gICAgICAgIERlc3Q6IHN0cmluZztcbiAgICAgICAgV29ybGRUcmFjZXJOdW06IHN0cmluZztcbiAgICAgICAgQ3VzdG9tZXJDYXJlQ2FzZU51bTogc3RyaW5nO1xuICAgICAgICBQYXhSUEg6IHN0cmluZztcbiAgICAgICAgSXNDb21wZW5zYXRpb25Jc3N1ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgSXNDb21wZW5zYXRpb25Ob3RJc3N1ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgUGF4U3RhdHVzOiBzdHJpbmc7XG4gICAgICAgIFBheEVtYWlsQWRkcmVzczogc3RyaW5nO1xuICAgICAgICBVcGRhdGVMb2NrTmJyPzogYW55O1xuICAgICAgICBGcXR2VGllcjogc3RyaW5nO1xuICAgICAgICBDYWJpbkNsYXNzOiBzdHJpbmc7XG4gICAgICAgIFNTUjogU1NSW107XG4gICAgICAgIEV0a3Q6IEV0a3RbXTtcbiAgICAgICAgUmVhY2NvbURldGFpbHM6IFJlYWNjb21EZXRhaWxbXTtcbiAgICAgICAgQmFnczogQmFnW107XG4gICAgICAgIENvbXBlbnNhdGlvbnM6IENvbXBlbnNhdGlvbltdO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBGbGlnaHRTZWdtZW50IHtcbiAgICAgICAgRmxpZ2h0U2VnbWVudElkPzogYW55O1xuICAgICAgICBBaXJsaW5lQ29kZTogc3RyaW5nO1xuICAgICAgICBGbGlnaHRObzogc3RyaW5nO1xuICAgICAgICBEZXBhcnR1cmVEdDogc3RyaW5nO1xuICAgICAgICBEZXBhcnR1cmU6IHN0cmluZztcbiAgICAgICAgQXJyaXZhbDogc3RyaW5nO1xuICAgICAgICBQYXNzZW5nZXJzOiBQYXNzZW5nZXJbXTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUm9vdE9iamVjdCB7XG4gICAgICAgIFNvdXJjZUlkOiBzdHJpbmc7XG4gICAgICAgIFVzZXJJZDogc3RyaW5nO1xuICAgICAgICBGbGlnaHRTZWdtZW50czogRmxpZ2h0U2VnbWVudFtdO1xuICAgIH1cblxufVxuZXhwb3J0IG1vZHVsZSBJc3N1ZUNvbXBlbnNhdGlvblJlcXVlc3Qge1xuICAgIGV4cG9ydCBjbGFzcyBTZWxlY3RlZFNlcnZpY2Uge1xuICAgICAgICBSRklTQ19jb2RlOiBzdHJpbmc7XG4gICAgICAgIFJGSVNDX3N1YkNvZGU6IHN0cmluZztcbiAgICAgICAgU1NSQ29kZT86IGFueTtcbiAgICAgICAgY29tbWVyY2lhbE5hbWU6IHN0cmluZztcbiAgICAgICAgRW1kVHlwZTogc3RyaW5nO1xuICAgICAgICBUeXBlT2ZTZXJ2aWNlPzogYW55O1xuICAgICAgICBlbWRFbmRvcnNhYmxlOiBzdHJpbmc7XG4gICAgICAgIGVtZFJlZnVuZGFibGU6IGJvb2xlYW47XG4gICAgICAgIGVtZEV4Y2hhbmdlYWJsZTogc3RyaW5nO1xuICAgICAgICBlbWRVc2VkQXRJc3N1YW5jZTogc3RyaW5nO1xuICAgICAgICBJc1JlZnVuZGFibGU6IHN0cmluZztcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIFNlcnZpY2VzIHtcbiAgICAgICAgVGF4ZXM/OiBhbnk7XG4gICAgICAgIHBhc3NlbmdlclJQSDogc3RyaW5nO1xuICAgICAgICBzZWdtZW50UlBIPzogYW55O1xuICAgICAgICBjdXJyZW5jeUNvZGU6IHN0cmluZztcbiAgICAgICAgYW1vdW50OiBzdHJpbmc7XG4gICAgICAgIHRpY2tldE51bWJlcj86IGFueTtcbiAgICAgICAgUmVtYXJrcz86IGFueTtcbiAgICAgICAgRW5kb3JzZW1lbnQ6IHN0cmluZztcbiAgICAgICAgc2VsZWN0ZWRTZXJ2aWNlOiBTZWxlY3RlZFNlcnZpY2U7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFBheW1lbnRzIHtcbiAgICAgICAgVHlwZTogc3RyaW5nO1xuICAgICAgICBUcmFuc2FjdGlvblR5cGU6IHN0cmluZztcbiAgICAgICAgU3ViVHlwZTogc3RyaW5nO1xuICAgICAgICBEZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgICAgICBBbW91bnQ6IHN0cmluZztcbiAgICAgICAgQ3VycmVuY3lDb2RlOiBzdHJpbmc7XG4gICAgICAgIEFjY291bnRDb2RlOiBzdHJpbmc7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRW1kIHtcbiAgICAgICAgRmxpZ2h0U2VnbWVudElkOiBzdHJpbmc7XG4gICAgICAgIFBhc3NlbmdlclNlcTogc3RyaW5nO1xuICAgICAgICBDb21wU2VxOiBzdHJpbmc7XG4gICAgICAgIFByaW1hcnlEb2N1bWVudE5icj86IGFueTtcbiAgICAgICAgUHJpbWFyeUFpcmxpbmVDZDogc3RyaW5nO1xuICAgICAgICBJc3N1ZUR0OiBzdHJpbmc7XG4gICAgICAgIEZpcnN0Tm06IHN0cmluZztcbiAgICAgICAgTGFzdE5tOiBzdHJpbmc7XG4gICAgICAgIFVzZXJJZDogc3RyaW5nO1xuICAgICAgICBSZWFzb25Gb3JJc3N1YW5jZVN1YkNkOiBzdHJpbmc7XG4gICAgICAgIE92ZXJyaWRlUmVhc29uOiBzdHJpbmc7XG4gICAgICAgIFJlYXNvbkZvcklzc3VhbmNlQ2Q6IHN0cmluZztcbiAgICAgICAgRW5kb3JzZW1lbnRzMVR4dDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgUmVtYXJrVHh0OiBzdHJpbmc7XG4gICAgICAgIENvbXBBbXQ6IGFueTtcbiAgICAgICAgQ29tcEN1cnJlbmN5Q2Q6IGFueTtcbiAgICAgICAgVm91Y2hlckNudDogYW55O1xuICAgICAgICBQb2ludE9mU2FsZTogYW55O1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBDb21wZW5zYXRpb24ge1xuICAgICAgICBGbGlnaHRTZWdtZW50SWQ6IHN0cmluZztcbiAgICAgICAgUGFzc2VuZ2VyU2VxOiBzdHJpbmc7XG4gICAgICAgIENvbXBTZXE6IHN0cmluZztcbiAgICAgICAgQ29tcFJlYXNvbklkOiBzdHJpbmc7XG4gICAgICAgIENvbXBSZWFzb25UZXh0OiBzdHJpbmc7XG4gICAgICAgIENvbXBUeXBlSWQ6IHN0cmluZztcbiAgICAgICAgQ29tcFR5cGVUZXh0OiBzdHJpbmc7XG4gICAgICAgIC8vIENvbXBBbXQ6IHN0cmluZztcbiAgICAgICAgLy8gQ29tcEN1cnJlbmN5Q2Q6IHN0cmluZztcbiAgICAgICAgLy8gVm91Y2hlckNudDogc3RyaW5nO1xuICAgICAgICAvLyBPdmVycmlkZVJlYXNvbj86IGFueTtcbiAgICAgICAgVXBkYXRlTG9ja05icj86IGFueTtcbiAgICAgICAgUmVtYXJrcz86IGFueTtcbiAgICAgICAgRW5kb3JzZW1lbnQ6IHN0cmluZztcbiAgICAgICAgU2VydmljZXM6IFNlcnZpY2VzO1xuICAgICAgICBQYXltZW50czogUGF5bWVudHM7XG4gICAgICAgIEVtZHM6IEVtZFtdO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBQYXNzZW5nZXIge1xuICAgICAgICBGbGlnaHRTZWdtZW50SWQ6IHN0cmluZztcbiAgICAgICAgUGFzc2VuZ2VyU2VxOiBzdHJpbmc7XG4gICAgICAgIE9yZGVySWQ6IHN0cmluZztcbiAgICAgICAgUGF4TGFzdE5tOiBzdHJpbmc7XG4gICAgICAgIFBheEZpcnN0Tm06IHN0cmluZztcbiAgICAgICAgUGF4VHlwZT86IGFueTtcbiAgICAgICAgRnF0dkNjPzogYW55O1xuICAgICAgICBGcXR2TnVtYmVyPzogYW55O1xuICAgICAgICBQYXhTdGF0dXM/OiBhbnk7XG4gICAgICAgIFBheEVtYWlsQWRkcmVzcz86IGFueTtcbiAgICAgICAgUGF4Q29tcFJlYXNvbklEOiBhbnk7XG4gICAgICAgIElzRXhpc3RpbmdDb21wZW5zYXRpb246IGJvb2xlYW47XG4gICAgICAgIFVwZGF0ZUxvY2tOYnI/OiBhbnk7XG4gICAgICAgIEZxdHZUaWVyPzogYW55O1xuICAgICAgICBDYWJpbkNsYXNzPzogYW55O1xuICAgICAgICBQYXhSUEg6IHN0cmluZztcbiAgICAgICAgRHVtbXlDb21wT3JkZXJGbGFnIDpzdHJpbmc7XG4gICAgICAgIFdvcmxkVHJhY2VyTnVtOiBzdHJpbmc7XG4gICAgICAgIEN1c3RvbWVyQ2FyZUNhc2VOdW06IHN0cmluZztcbiAgICAgICAgSXNDb21wZW5zYXRpb25Jc3N1ZWQ/OiBhbnk7XG4gICAgICAgIFNTUjogYW55W107XG4gICAgICAgIFNTUnM6IFNTUnNbXTtcbiAgICAgICAgRXRrdDogYW55W107XG4gICAgICAgIEV4aXN0aW5nQ29tcGVuc2F0aW9uczogYW55W107XG4gICAgICAgIFJlYWNjb21EZXRhaWxzOiBhbnlbXTtcbiAgICAgICAgQmFnczogYW55W107XG4gICAgICAgIENvbXBlbnNhdGlvbnM6IENvbXBlbnNhdGlvbltdO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgU1NScyB7XG4gICAgICAgIEZsaWdodFNlZ21lbnRJZDogbnVtYmVyO1xuICAgICAgICBQYXNzZW5nZXJTZXE6IG51bWJlcjtcbiAgICAgICAgU3NyQ29kZTogc3RyaW5nO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgRmxpZ2h0U2VnbWVudCB7XG4gICAgICAgIEZsaWdodFNlZ21lbnRJZDogbnVtYmVyO1xuICAgICAgICBBaXJsaW5lQ29kZTogc3RyaW5nO1xuICAgICAgICBGbGlnaHRObzogc3RyaW5nO1xuICAgICAgICBEZXBhcnR1cmVEdDogc3RyaW5nO1xuICAgICAgICBEZXBhcnR1cmU6IHN0cmluZztcbiAgICAgICAgQXJyaXZhbDogc3RyaW5nO1xuICAgICAgICBGbGlnaHRTZWdtZW50UlBIOiBzdHJpbmc7XG4gICAgICAgIERlcGFydHVyZURhdGVUaW1lOiBzdHJpbmc7XG4gICAgICAgIEFycml2YWxEYXRlVGltZTogRGF0ZTtcbiAgICAgICAgSGFzU3RvcG92ZXI6IGJvb2xlYW47XG4gICAgICAgIFBhc3NlbmdlcnM6IFBhc3NlbmdlcltdO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBSb290T2JqZWN0IHtcbiAgICAgICAgU291cmNlSWQ6IGFueTtcbiAgICAgICAgVXNlcklkOiBhbnk7XG4gICAgICAgIEFkZE9yZGVyRmxvdyA6YW55O1xuICAgICAgICBGbGlnaHRTZWdtZW50czogRmxpZ2h0U2VnbWVudFtdO1xuICAgIH1cblxufVxuXG5cbmV4cG9ydCBtb2R1bGUgQWdlbnRQcml2aWxhZ2Uge1xuXG4gICAgZXhwb3J0IGNsYXNzIFByaXZpbGVnZSB7XG4gICAgICAgIE5hbWU6IHN0cmluZztcbiAgICAgICAgQ29uc3RyYWludHM/OiBhbnk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFJvb3RPYmplY3Qge1xuICAgICAgICAvLyBBaXJsaW5lQ29kZTogXCJDTVwiO1xuICAgICAgICBQcml2aWxlZ2VzOiBQcml2aWxlZ2VbXTtcbiAgICB9XG59XG5cbmV4cG9ydCBtb2R1bGUgQ2l0eUNvZGVDb2xsZWN0aW9uIHtcbiAgICBleHBvcnQgY2xhc3MgUm9vdE9iamVjdCB7XG4gICAgICAgIENvbGxlY3Rpb246IENvbGxlY3Rpb25FbnRpdHlbXTtcbiAgICAgICAgQm9hcmRpbmdQYXNzT3V0cHV0PzogbnVsbDtcbiAgICAgICAgQmFnVGFnT3V0cHV0PzogbnVsbDtcbiAgICAgICAgU3VjY2VzczogYm9vbGVhbjtcbiAgICAgICAgRXJyb3JzPzogbnVsbDtcbiAgICAgICAgSW5mb3JtYXRpb24/OiBudWxsO1xuICAgICAgICBXYXJuaW5ncz86IG51bGw7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBDb2xsZWN0aW9uRW50aXR5IHtcbiAgICAgICAgQ29kZTogc3RyaW5nO1xuICAgICAgICBOYW1lOiBzdHJpbmc7XG4gICAgICAgIFR5cGU6IHN0cmluZztcbiAgICB9XG59XG5cbmV4cG9ydCBtb2R1bGUgRW1haWxNb2R1bGUge1xuICAgIGV4cG9ydCBjbGFzcyBSb290T2JqZWN0IHtcbiAgICAgICAgT3JkZXJJZD86IG51bGw7XG4gICAgICAgIEdhdGV3YXk6IHN0cmluZztcbiAgICAgICAgTGlzdFR5cGU6IHN0cmluZztcbiAgICAgICAgRG9jdW1lbnRUeXBlOiBzdHJpbmc7XG4gICAgICAgIFNvdXJjZTogc3RyaW5nO1xuICAgICAgICBTZWdtZW50cz86IChTZWdtZW50c0VudGl0eSlbXSB8IG51bGw7XG4gICAgICAgIFBhc3NlbmdlcnM/OiAoUGFzc2VuZ2VyKVtdIHwgbnVsbDtcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIFNlZ21lbnRzRW50aXR5IHtcbiAgICAgICAgT3BlcmF0aW5nQ2FycmllckNvZGU6IHN0cmluZztcbiAgICAgICAgT3BlcmF0aW5nQ2Fycmllck51bWJlcjogc3RyaW5nO1xuICAgICAgICBEZXBhcnR1cmU6IERlcGFydHVyZU9yQXJyaXZhbDtcbiAgICAgICAgQXJyaXZhbDogRGVwYXJ0dXJlT3JBcnJpdmFsO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgRGVwYXJ0dXJlT3JBcnJpdmFsIHtcbiAgICAgICAgQ2l0eU5hbWU6IHN0cmluZztcbiAgICAgICAgRGF0ZSA6ICBzdHJpbmc7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBQYXNzZW5nZXIge1xuICAgICAgICBGbGlnaHRTZWdtZW50SWQ6IHN0cmluZztcbiAgICAgICAgUGFzc2VuZ2VyU2VxOiBzdHJpbmc7XG4gICAgICAgIE9yZGVySWQ6IHN0cmluZztcbiAgICAgICAgQ29tcFNlcTogc3RyaW5nO1xuICAgICAgICBQcmltYXJ5RG9jdW1lbnROYnI6IHN0cmluZztcbiAgICAgICAgUHJpbWFyeUFpcmxpbmVDZDogc3RyaW5nO1xuICAgICAgICBJc3N1ZUR0PzogYW55O1xuICAgICAgICBGaXJzdE5tOiBzdHJpbmc7XG4gICAgICAgIExhc3RObTogc3RyaW5nO1xuICAgICAgICBSZWFzb25Gb3JJc3N1YW5jZVN1YkNkOiBzdHJpbmc7XG4gICAgICAgIFJlYXNvbkZvcklzc3VhbmNlQ2Q6IHN0cmluZztcbiAgICAgICAgUHJpbnRTdGF0dXM/OiBhbnk7XG4gICAgICAgIEVtYWlsU3RhdHVzPzogYW55O1xuICAgICAgICBDdXN0b21lckNhcmVOdW1iZXI6IHN0cmluZztcbiAgICAgICAgRXRpY2tldE51bWJlcjogc3RyaW5nO1xuICAgICAgICBXb3JsZFRyYWNlTnVtYmVyOiBzdHJpbmc7XG4gICAgICAgIERlbGl2ZXJ5RGV0YWlsOiBEZWxpdmVyeURldGFpbDtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ291cG9uIHtcbiAgICAgICAgQ29tbWVyY2lhbE5hbWU6IHN0cmluZztcbiAgICAgICAgQ29tcGVuc2F0aW9uVHlwZTogc3RyaW5nO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgRGVsaXZlcnlEZXRhaWwge1xuICAgICAgICBFbWFpbDogRW1haWw7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBFbWFpbCB7XG4gICAgICAgIFRvPzogKFRvRW50aXR5KVtdIHwgbnVsbDtcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIFRvRW50aXR5IHtcbiAgICAgICAgVG9BZGRyOiBzdHJpbmc7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBtb2R1bGUgdXBkYXRlRW1haWxNb2RlbCB7XG4gICAgZXhwb3J0IGNsYXNzIFJvb3RPYmplY3Qge1xuICAgICAgICBSZXR1cm5PcmRlcjogYm9vbGVhbjtcbiAgICAgICAgUmVjZWl2ZWRGcm9tPzogbnVsbDtcbiAgICAgICAgQ2hhbmdlcz86IChzdHJpbmcpW10gfCBudWxsO1xuICAgICAgICBUcmF2ZWxlcjogVHJhdmVsZXI7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBUcmF2ZWxlciB7XG4gICAgICAgIEZpcnN0bmFtZTogc3RyaW5nO1xuICAgICAgICBMYXN0bmFtZTogc3RyaW5nO1xuICAgICAgICBTdXJuYW1lUmVmTnVtYmVyOiBzdHJpbmc7XG4gICAgICAgIFByZWZpeD86IG51bGw7XG4gICAgICAgIFJQSDogc3RyaW5nO1xuICAgICAgICBHZW5kZXI6IHN0cmluZztcbiAgICAgICAgUGFzc2VuZ2VyVHlwZUNvZGU6IHN0cmluZztcbiAgICAgICAgQXNzb2NpYXRlZEluZmFudFJQSD86IG51bGw7XG4gICAgICAgIERhdGVPZkJpcnRoOiBzdHJpbmc7XG4gICAgICAgIEFnZT86IG51bGw7XG4gICAgICAgIEFzc29jaWF0ZWRBZHVsdFJQSD86IG51bGw7XG4gICAgICAgIEZPSUQ/OiBudWxsO1xuICAgICAgICBPbGRQaG9uZU51bWJlcnM/OiAobnVsbClbXSB8IG51bGw7XG4gICAgICAgIE9sZEZpcnN0bmFtZTogc3RyaW5nO1xuICAgICAgICBPbGRMYXN0bmFtZTogc3RyaW5nO1xuICAgICAgICBPbGRFbWVyZ2VuY3lEZXRhaWxzPzogKG51bGwpW10gfCBudWxsO1xuICAgICAgICBJc0NvbnRhY3RSZWZ1c2VkOiBib29sZWFuO1xuICAgICAgICBQaG9uZU51bWJlcnM/OiAobnVsbClbXSB8IG51bGw7XG4gICAgICAgIEVtYWlscz86IChFbWFpbHNFbnRpdHkpW10gfCBudWxsO1xuICAgICAgICBFbWVyZ2VuY3lEZXRhaWxzPzogKG51bGwpW10gfCBudWxsO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgRW1haWxzRW50aXR5IHtcbiAgICAgICAgVmFsdWU6IHN0cmluZztcbiAgICAgICAgVHlwZTogc3RyaW5nO1xuICAgIH1cbn1cblxuXG5leHBvcnQgbW9kdWxlIFByaW50TW9kdWxlIHtcbiAgICBleHBvcnQgY2xhc3MgUm9vdE9iamVjdCB7XG4gICAgICAgIE9yZGVySWQ/OiBudWxsO1xuICAgICAgICBHYXRld2F5OiBzdHJpbmc7XG4gICAgICAgIERvY3VtZW50VHlwZTogc3RyaW5nO1xuICAgICAgICBMaXN0VHlwZTogc3RyaW5nO1xuICAgICAgICBTb3VyY2U6IHN0cmluZztcbiAgICAgICAgU2VnbWVudHM6IFNlZ21lbnRbXTtcbiAgICAgICAgUGFzc2VuZ2VyczogUGFzc2VuZ2VyW107XG4gICAgICAgIERlbGl2ZXJ5RGV0YWlsOiBEZWxpdmVyeURldGFpbDtcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIFNlZ21lbnQge1xuICAgICAgICBPcGVyYXRpbmdDYXJyaWVyQ29kZTogc3RyaW5nO1xuICAgICAgICBPcGVyYXRpbmdDYXJyaWVyTnVtYmVyOiBzdHJpbmc7XG4gICAgICAgIERlcGFydHVyZTogRGVwYXJ0dXJlO1xuICAgICAgICBBcnJpdmFsOiBBcnJpdmFsO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgRGVwYXJ0dXJlIHtcbiAgICAgICAgQ2l0eU5hbWU6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQXJyaXZhbCB7XG4gICAgICAgIENpdHlOYW1lOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFBhc3NlbmdlciB7XG4gICAgICAgIEZsaWdodFNlZ21lbnRJZDogc3RyaW5nO1xuICAgICAgICBQYXNzZW5nZXJTZXE6IHN0cmluZztcbiAgICAgICAgT3JkZXJJZDogc3RyaW5nO1xuICAgICAgICBDb21wU2VxOiBzdHJpbmc7XG4gICAgICAgIFByaW1hcnlEb2N1bWVudE5icjogc3RyaW5nO1xuICAgICAgICBQcmltYXJ5QWlybGluZUNkOiBzdHJpbmc7XG4gICAgICAgIElzc3VlRHQ/OiBhbnk7XG4gICAgICAgIEZpcnN0Tm06IHN0cmluZztcbiAgICAgICAgTGFzdE5tOiBzdHJpbmc7XG4gICAgICAgIFJlYXNvbkZvcklzc3VhbmNlU3ViQ2Q6IHN0cmluZztcbiAgICAgICAgUmVhc29uRm9ySXNzdWFuY2VDZDogc3RyaW5nO1xuICAgICAgICBQcmludFN0YXR1cz86IGFueTtcbiAgICAgICAgRW1haWxTdGF0dXM/OiBhbnk7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEVNREVudGl0eSB7XG4gICAgICAgIEVNRERvY3VtZW50TnVtYmVyOiBzdHJpbmc7XG4gICAgICAgIElzc3VpbmdEYXRlOiBzdHJpbmc7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBEZWxpdmVyeURldGFpbCB7XG4gICAgICAgIEVtYWlsPzogbnVsbDtcbiAgICAgICAgUHJpbnRlcjogUHJpbnRlcjtcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIFByaW50ZXIge1xuICAgICAgICBDbGllbnRDb2RlOiBzdHJpbmc7XG4gICAgICAgIERldmljZU5hbWU6IHN0cmluZztcbiAgICAgICAgV29ya3N0YXRpb25OYW1lOiBzdHJpbmc7XG4gICAgICAgIE9mZmljZU5hbWU6IHN0cmluZztcbiAgICAgICAgRGV2aWNlVHlwZTogc3RyaW5nO1xuICAgICAgICBQZWN0YWJWZXJzaW9uOiBzdHJpbmc7XG4gICAgfVxufVxuZXhwb3J0IG1vZHVsZSBQYXNzZW5nZXJUeXBlTW9kZWwge1xuXG4gICAgZXhwb3J0IGNsYXNzIFZhbHVlIHtcbiAgICAgICAgRGVzY3JpcHRpb246IHN0cmluZztcbiAgICAgICAgTGlzdFR5cGU6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUGFzc2VuZ2VyVHlwZUxpc3RUYWJsZSB7XG4gICAgICAgIEtleTogc3RyaW5nO1xuICAgICAgICBWYWx1ZTogVmFsdWU7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFJvb3RPYmplY3Qge1xuICAgICAgICBQYXNzZW5nZXJUeXBlTGlzdFRhYmxlOiBQYXNzZW5nZXJUeXBlTGlzdFRhYmxlW107XG4gICAgfVxuXG59XG5cblxuXG5cblxuIl19