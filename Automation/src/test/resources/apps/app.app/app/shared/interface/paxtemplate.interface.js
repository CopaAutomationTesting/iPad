"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PaxTemplate = /** @class */ (function () {
    function PaxTemplate() {
        this.FirstName = "";
        this.LastName = "";
        this.FullName = "";
        this.OrderID = "";
        this.PassengerType = "";
        this.TierLevel = "";
        this.FQTVNumber = "";
        this.IsSecurityDocsComplete = false;
        this.SecurityDocStatus = "";
        this.BagCount = 0;
        this.TotalWeight = 0;
        this.SeatNumber = "";
        this.SSR = [];
        this.EMD = "";
        this.FlightDetails = [];
        // Properties needed to check in the pax
        this.SurnameRefNumber = "";
        this.SurName = "";
        this.RPH = "";
        this.Selected = false;
        this.FQTVAirline = "";
        this.ApisDocoStatus = "";
        this.PassengerTypeCode = "";
        this.ProgramIDxx = "";
        this.PassengerRefNumber = null;
        this.PhoneNumbers = [];
        this.DateOfBirth = "";
        this.CheckinStatus = false;
        this.IsSelected = false;
        this.IsChecked = false;
        this.INFwithoutSeat = false;
        this.fqtv = [];
        this.serviceText = "";
        this.LoyalLevel = "";
        //test
    }
    return PaxTemplate;
}());
exports.PaxTemplate = PaxTemplate;
var FlightStatus;
(function (FlightStatus) {
    FlightStatus[FlightStatus["Open"] = 0] = "Open";
    FlightStatus[FlightStatus["Closed"] = 1] = "Closed";
    FlightStatus[FlightStatus["OnHold"] = 2] = "OnHold";
    FlightStatus[FlightStatus["Unknown"] = 3] = "Unknown";
})(FlightStatus = exports.FlightStatus || (exports.FlightStatus = {}));
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
exports.PhoneNumber = PhoneNumber;
var FqtvClassPrograms = /** @class */ (function () {
    function FqtvClassPrograms() {
    }
    return FqtvClassPrograms;
}());
exports.FqtvClassPrograms = FqtvClassPrograms;
var FQTVRootObject = /** @class */ (function () {
    function FQTVRootObject() {
    }
    return FQTVRootObject;
}());
exports.FQTVRootObject = FQTVRootObject;
var FlightInfo = /** @class */ (function () {
    function FlightInfo() {
        this.FlightNumber = "";
        this.MarketingFlight = "";
        this.FlightDate = "";
        this.FlightStatus = "";
        this.status = "";
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
exports.FlightInfo = FlightInfo;
var FQTVInfo = /** @class */ (function () {
    function FQTVInfo() {
        this.OrderID = "";
        this.PassengerName = "";
        this.Status = "";
        this.FlightNumber = "";
        this.IsChecked = false;
    }
    return FQTVInfo;
}());
exports.FQTVInfo = FQTVInfo;
var CheckInPostTemplate;
(function (CheckInPostTemplate) {
    var RootObject = /** @class */ (function () {
        function RootObject() {
            this.Source = "";
            this.BluetoothBagTag = false;
            this.CheckInType = "CheckIn";
            this.SegmentList = null;
            this.PassengerList = null;
            this.BoardingPassDeliveryDetail = null;
        }
        return RootObject;
    }());
    CheckInPostTemplate.RootObject = RootObject;
    var WaitlistRootObject = /** @class */ (function () {
        function WaitlistRootObject() {
            this.CheckInType = "Waitlist";
            this.SegmentList = null;
            this.PassengerList = null;
            this.BoardingPassDeliveryDetail = null;
        }
        return WaitlistRootObject;
    }());
    CheckInPostTemplate.WaitlistRootObject = WaitlistRootObject;
    var BoardingPassDeliveryDetail = /** @class */ (function () {
        function BoardingPassDeliveryDetail() {
        }
        return BoardingPassDeliveryDetail;
    }());
    CheckInPostTemplate.BoardingPassDeliveryDetail = BoardingPassDeliveryDetail;
    var Printer = /** @class */ (function () {
        function Printer() {
        }
        return Printer;
    }());
    CheckInPostTemplate.Printer = Printer;
    var PassengerList = /** @class */ (function () {
        function PassengerList() {
            this.GivenName = "";
            this.Surname = "";
            this.PassengerTypeCode = "";
            this.PassengerRefNumber = "";
            this.AssociatedInfantRPH = "";
            this.AssociatedAdultRPH = "";
            this.FqtTravelers = [];
            this.EmergencyDetails = [];
            this.OrderId = "";
            this.RPH = "";
            this.Firstname = "";
            this.Lastname = "";
            this.Selected = true;
            this.PhoneNumbers = [];
            this.CheckedBagCount = 0;
            this.Status = "";
            this.Age = "";
            this.CheckinRePrint = false;
            this.addPartialMember = false;
            this.UnitOfMeasureCode = null;
            this.UnitOfMeasureQuantity = null;
            this.OldKnownTravelerNumber = null;
            this.OldRedressNumber = null;
            this.FOID = null;
        }
        return PassengerList;
    }());
    CheckInPostTemplate.PassengerList = PassengerList;
    var WaitListPassenger = /** @class */ (function () {
        function WaitListPassenger() {
            this.GivenName = "";
            this.Surname = "";
            this.RPH = "";
            this.Emails = [];
            this.PassengerTypeCode = "";
            this.PassengerRefNumber = "";
            this.PhoneNumbers = [];
            this.AssociatedInfantRPH = "";
            this.AssociatedAdultRPH = "";
            this.FqtTravelers = [];
            this.EmergencyDetails = [];
            this.Status = "";
            this.OldEmergencyDetails = [];
            this.OrderId = "";
            this.CheckedBagCount = 0;
            this.addPartialMember = false;
            this.UnitOfMeasureCode = null;
            this.UnitOfMeasureQuantity = null;
            this.OldKnownTravelerNumber = null;
            this.OldRedressNumber = null;
            this.FOID = null;
            this.CheckinRePrint = false;
            this.Firstname = "";
            this.Lastname = "";
            this.Selected = true;
            this.OldFqtTravelers = null;
        }
        return WaitListPassenger;
    }());
    CheckInPostTemplate.WaitListPassenger = WaitListPassenger;
    var CheckInOptions = /** @class */ (function () {
        function CheckInOptions() {
            this.UnaccompaniedMinor = false;
            this.DisabledPassenger = false;
            this.PreferredPassenger = false;
            this.StandbyUpgrade = false;
            this.Standby = false;
            this.ExtraSeat = false;
            this.NonRevenueCategory = null;
        }
        return CheckInOptions;
    }());
    CheckInPostTemplate.CheckInOptions = CheckInOptions;
    var FqtTraveler = /** @class */ (function () {
        function FqtTraveler() {
            this.ProgramID = null;
            this.MembershipID = null;
        }
        return FqtTraveler;
    }());
    CheckInPostTemplate.FqtTraveler = FqtTraveler;
    var SegmentList = /** @class */ (function () {
        function SegmentList() {
            this.RPH = "";
            this.DepartureDateTime = null;
            this.MarketingFlight = null;
            this.OperatingFlight = null;
            this.Selected = null;
            this.DepartureCity = null;
            this.ArrivalCity = null;
            this.OrderId = "";
        }
        return SegmentList;
    }());
    CheckInPostTemplate.SegmentList = SegmentList;
    var FlightCheckIn = /** @class */ (function () {
        function FlightCheckIn() {
            this.CheckInStatus = "Open";
        }
        return FlightCheckIn;
    }());
    CheckInPostTemplate.FlightCheckIn = FlightCheckIn;
})(CheckInPostTemplate = exports.CheckInPostTemplate || (exports.CheckInPostTemplate = {}));
var DepartureInfo1;
(function (DepartureInfo1) {
    var Departure = /** @class */ (function () {
        function Departure() {
            this.FlightStatus = "";
            this.CheckinStatus = "";
            this.Destination = "";
            this.Gate = "";
            this.FlightNumber = "";
            this.STD = "";
            this.ETD = "";
            this.Color = "";
            this.IsChecked = false;
            this.STA = "";
            this.configuration = [];
            this.DestinationAirport = "";
            // public EconomyInventary:string ="";
            // public BussinessInventary:string ="";
        }
        return Departure;
    }());
    DepartureInfo1.Departure = Departure;
    var Configuration = /** @class */ (function () {
        function Configuration() {
            this.Booked = "";
            this.BoardingTime = "";
            this.CodeLetter = "";
            this.Capacity = "";
        }
        return Configuration;
    }());
    DepartureInfo1.Configuration = Configuration;
})(DepartureInfo1 = exports.DepartureInfo1 || (exports.DepartureInfo1 = {}));
var DepartureInfo = /** @class */ (function () {
    function DepartureInfo() {
        this.FlightStatus = "";
        this.CheckinStatus = "";
        this.Destination = "";
        this.Gate = "";
        this.FlightNumber = "";
        this.ExpectedDepartureDate = "";
        this.STD = "";
        this.ETD = "";
        this.IsChecked = false;
        this.Color = "";
        this.EconomyInventary = "";
        this.BussinessInventary = "";
    }
    return DepartureInfo;
}());
exports.DepartureInfo = DepartureInfo;
var AccontProfileModel;
(function (AccontProfileModel) {
    var AccountProfileTemplate = /** @class */ (function () {
        function AccountProfileTemplate() {
            this.Username = "";
            this.FirstName = "";
            this.LastName = "";
            this.AgentDutyCode = "";
            this.AgentSine = "";
            this.AirportCode = "";
            this.PhysicalLocation = "";
            this.Requestor_ID = "";
            this.PointOfSales = [];
            this.Currencies = [];
            this.ISOCurrencyCode = "";
        }
        return AccountProfileTemplate;
    }());
    AccontProfileModel.AccountProfileTemplate = AccountProfileTemplate;
    var PointOfSales = /** @class */ (function () {
        function PointOfSales() {
            this.AirportCode = "";
            this.Name = "";
            this.ID = "";
            this.currencies = [];
            this.AgentCode = "";
        }
        return PointOfSales;
    }());
    AccontProfileModel.PointOfSales = PointOfSales;
})(AccontProfileModel = exports.AccontProfileModel || (exports.AccontProfileModel = {}));
var SeatMap;
(function (SeatMap) {
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    SeatMap.RootObject = RootObject;
    var Item = /** @class */ (function () {
        function Item() {
        }
        return Item;
    }());
    SeatMap.Item = Item;
    var SeatProductInformation = /** @class */ (function () {
        function SeatProductInformation() {
        }
        return SeatProductInformation;
    }());
    SeatMap.SeatProductInformation = SeatProductInformation;
    var FlightSegment = /** @class */ (function () {
        function FlightSegment() {
        }
        return FlightSegment;
    }());
    SeatMap.FlightSegment = FlightSegment;
    var Origin = /** @class */ (function () {
        function Origin() {
        }
        return Origin;
    }());
    SeatMap.Origin = Origin;
    var Destination = /** @class */ (function () {
        function Destination() {
        }
        return Destination;
    }());
    SeatMap.Destination = Destination;
    // export class SeatList {
    //     public CabinList: Array<CabinList> = [];
    // }
    var CabinList = /** @class */ (function () {
        function CabinList() {
            this.AirRowList = [];
        }
        return CabinList;
    }());
    SeatMap.CabinList = CabinList;
    var AirRowList = /** @class */ (function () {
        function AirRowList() {
            this.AirSeatList = [];
            this.HeaderRow = false;
            this.StyleClass = "";
        }
        return AirRowList;
    }());
    SeatMap.AirRowList = AirRowList;
    var AirSeatList = /** @class */ (function () {
        function AirSeatList() {
            this.SeatNumber = "";
            this.SeatCharacteristics = [];
            this.MidCol = false;
            this.StyleClass = "";
            this.IsSeatSelected = false;
            this.IsSelectedAdvanceDisplay = false;
            this.AdvanceDisplayStyleClass = "";
            this.SeatNum = "";
            this.SeatCode = "";
            this.IsPaxSelected = false;
            this.PaxRPH = "";
            this.isSpecialSeat = false;
            this.FlightLegDepartureAirportCode = "";
        }
        return AirSeatList;
    }());
    SeatMap.AirSeatList = AirSeatList;
})(SeatMap = exports.SeatMap || (exports.SeatMap = {}));
var AssignSeat;
(function (AssignSeat) {
    var seat = /** @class */ (function () {
        function seat() {
            this.SeatList = [];
            this.IsInterlineSeatMap = false;
            this.DeliveryDetail = null;
        }
        return seat;
    }());
    AssignSeat.seat = seat;
    var seats = /** @class */ (function () {
        function seats() {
            this.SeatPreference = [];
            this.DepartureDateTime = null;
            this.NoSeat = false;
            this.HasPrice = false;
        }
        return seats;
    }());
    AssignSeat.seats = seats;
})(AssignSeat = exports.AssignSeat || (exports.AssignSeat = {}));
// export module AssignSeat{
//     export class SeatList {
//         OrderId: string;
//         SeatNo: string;
//         SeatCheckInStatus?: any;
//         SeatPreference: Array<string> = [];
//         PreviousSeatNo: string;
//         FlightNo: string;
//         DepartureAirportCode: string;
//         DepartureDateTime: Date;
//         PassengerFirstName: string;
//         PassengerLastName: string;
//         ResBookDesigCode: string;
//         GivenNameRefNumber?: any;
//         SurnameRefNumber: string;
//         PassengerTypeCode?: any;
//         NoSeat: boolean;
//         HasPrice: boolean;
//         FlightLegDepartureAirportCode: string;
//         PassengerRPH: string;
//         IsCheckedIn: string;
//         INFGivenName?: any;
//         INFSurname?: any;
//     }
//     export class RootObject {
//         SeatList: Array<SeatList>=[];
//         DeliveryDetail?: any;
//     }
// }
var PassengerCheckin;
(function (PassengerCheckin) {
    var SelectedPassenger = /** @class */ (function () {
        function SelectedPassenger() {
            this.FirstName = "";
            this.LastName = "";
        }
        return SelectedPassenger;
    }());
    PassengerCheckin.SelectedPassenger = SelectedPassenger;
})(PassengerCheckin = exports.PassengerCheckin || (exports.PassengerCheckin = {}));
var FQTVPro;
(function (FQTVPro) {
    var FqtvPrograms = /** @class */ (function () {
        function FqtvPrograms() {
        }
        return FqtvPrograms;
    }());
    FQTVPro.FqtvPrograms = FqtvPrograms;
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    FQTVPro.RootObject = RootObject;
})(FQTVPro = exports.FQTVPro || (exports.FQTVPro = {}));
var InBound;
(function (InBound) {
    var Inbou = /** @class */ (function () {
        function Inbou() {
        }
        return Inbou;
    }());
    InBound.Inbou = Inbou;
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    InBound.RootObject = RootObject;
})(InBound = exports.InBound || (exports.InBound = {}));
var OutBound;
(function (OutBound) {
    var Outbou = /** @class */ (function () {
        function Outbou() {
        }
        return Outbou;
    }());
    OutBound.Outbou = Outbou;
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    OutBound.RootObject = RootObject;
})(OutBound = exports.OutBound || (exports.OutBound = {}));
var BoardingPass;
(function (BoardingPass) {
    var RootObject = /** @class */ (function () {
        function RootObject() {
            this.Source = "Tab";
            this.Segments = [];
            this.Passengers = [];
        }
        return RootObject;
    }());
    BoardingPass.RootObject = RootObject;
    var BoardingPassDeliveryDetail = /** @class */ (function () {
        function BoardingPassDeliveryDetail() {
            this.Gateway = "";
            this.Email = null;
            this.PrinterAddress = "";
        }
        return BoardingPassDeliveryDetail;
    }());
    BoardingPass.BoardingPassDeliveryDetail = BoardingPassDeliveryDetail;
    var Printer = /** @class */ (function () {
        function Printer() {
            this.ClientCode = "";
            this.OfficeName = "";
            this.DeviceName = "";
            this.WorkstationName = "";
            this.PectabVersion = "";
            this.DeviceType = "";
        }
        return Printer;
    }());
    BoardingPass.Printer = Printer;
    var PassengerList = /** @class */ (function () {
        function PassengerList() {
            this.SurnameRefNumber = "";
            this.FqtTravelers = [];
            this.OrderId = "";
            this.Firstname = "";
            this.Lastname = "";
            this.Selected = true;
            this.AssociatedAdultRPH = null;
            this.AssociatedInfantRPH = null;
        }
        return PassengerList;
    }());
    BoardingPass.PassengerList = PassengerList;
    var FqtTraveler = /** @class */ (function () {
        function FqtTraveler() {
            this.ProgramID = null;
            this.MembershipID = null;
        }
        return FqtTraveler;
    }());
    BoardingPass.FqtTraveler = FqtTraveler;
    var SegmentList = /** @class */ (function () {
        function SegmentList() {
            this.RPH = "";
            this.DepartureDateTime = null;
            //public ArrivalTime: Date = null;
            this.MarketingFlight = "";
            this.DepartureCity = null;
            // public Gate: string = "";
            //public BoardingTime: Date = null;
            this.Selected = true;
            this.ArrivalCity = "";
        }
        return SegmentList;
    }());
    BoardingPass.SegmentList = SegmentList;
})(BoardingPass = exports.BoardingPass || (exports.BoardingPass = {}));
var BagTagPrint;
(function (BagTagPrint) {
    var RootObject = /** @class */ (function () {
        function RootObject() {
            this.Source = "Tab";
            this.Segments = [];
            this.Passengers = [];
        }
        return RootObject;
    }());
    BagTagPrint.RootObject = RootObject;
    var BoardingPassDeliveryDetail = /** @class */ (function () {
        function BoardingPassDeliveryDetail() {
            this.Gateway = "";
            this.Email = null;
            this.PrinterAddress = "";
        }
        return BoardingPassDeliveryDetail;
    }());
    BagTagPrint.BoardingPassDeliveryDetail = BoardingPassDeliveryDetail;
    var Printer = /** @class */ (function () {
        function Printer() {
        }
        return Printer;
    }());
    BagTagPrint.Printer = Printer;
    var PassengerList = /** @class */ (function () {
        function PassengerList() {
            this.PassengerTypeCode = "";
            this.PassengerRefNumber = "";
            this.FqtTravelers = [];
            this.OrderId = "";
            this.CheckedBagCount = 1;
            this.RPH = "";
            this.Firstname = "";
            this.Lastname = "";
            this.Selected = true;
            this.AssociatedInfantRPH = null;
            this.CheckinAirportCode = "";
            this.CheckedBags = [];
            this.CheckInBagCountTotal = "";
        }
        return PassengerList;
    }());
    BagTagPrint.PassengerList = PassengerList;
    var CheckedBags = /** @class */ (function () {
        function CheckedBags() {
            this.CancelOperation = false;
        }
        return CheckedBags;
    }());
    BagTagPrint.CheckedBags = CheckedBags;
    var BaggageInfo = /** @class */ (function () {
        function BaggageInfo() {
            this.BagTagDetails = [];
            this.PassengerRPH = "";
        }
        return BaggageInfo;
    }());
    BagTagPrint.BaggageInfo = BaggageInfo;
    var BagTagDetail = /** @class */ (function () {
        function BagTagDetail() {
        }
        return BagTagDetail;
    }());
    BagTagPrint.BagTagDetail = BagTagDetail;
    var FqtTraveler = /** @class */ (function () {
        function FqtTraveler() {
            this.ProgramID = null;
            this.MembershipID = null;
        }
        return FqtTraveler;
    }());
    BagTagPrint.FqtTraveler = FqtTraveler;
    var SegmentList = /** @class */ (function () {
        function SegmentList() {
            this.RPH = "";
            this.DepartureDateTime = null;
            this.ArrivalDateTime = null;
            this.MarketingFlight = "";
            this.DepartureCity = null;
            this.OperatingFlight = null;
            this.Selected = true;
            this.Gate = null;
            this.BoardingTime = null;
        }
        return SegmentList;
    }());
    BagTagPrint.SegmentList = SegmentList;
})(BagTagPrint = exports.BagTagPrint || (exports.BagTagPrint = {}));
var PrinterDevice;
(function (PrinterDevice) {
    var Device = /** @class */ (function () {
        function Device() {
            this.DeviceName = "";
            this.DeviceType = "";
            this.Description = "";
            this.Status = "";
            this.QueueCount = "";
            this.Port = "";
            this.Pectab = "";
            this.workstationName = "";
        }
        return Device;
    }());
    PrinterDevice.Device = Device;
})(PrinterDevice = exports.PrinterDevice || (exports.PrinterDevice = {}));
var InterlineThroughCheckin;
(function (InterlineThroughCheckin) {
    var SegmentList = /** @class */ (function () {
        function SegmentList() {
        }
        return SegmentList;
    }());
    InterlineThroughCheckin.SegmentList = SegmentList;
    var FqtTraveler = /** @class */ (function () {
        function FqtTraveler() {
        }
        return FqtTraveler;
    }());
    InterlineThroughCheckin.FqtTraveler = FqtTraveler;
    var FlightNumber = /** @class */ (function () {
        function FlightNumber() {
        }
        return FlightNumber;
    }());
    InterlineThroughCheckin.FlightNumber = FlightNumber;
    var SeatList = /** @class */ (function () {
        function SeatList() {
        }
        return SeatList;
    }());
    InterlineThroughCheckin.SeatList = SeatList;
    var FqtTraveler2 = /** @class */ (function () {
        function FqtTraveler2() {
        }
        return FqtTraveler2;
    }());
    InterlineThroughCheckin.FqtTraveler2 = FqtTraveler2;
    var OutBoundConnectingFlightInfo = /** @class */ (function () {
        function OutBoundConnectingFlightInfo() {
            this.FlightNumber = [];
            this.SeatList = [];
            this.FqtTravelers = [];
        }
        return OutBoundConnectingFlightInfo;
    }());
    InterlineThroughCheckin.OutBoundConnectingFlightInfo = OutBoundConnectingFlightInfo;
    var PassengerList = /** @class */ (function () {
        function PassengerList() {
            this.FqtTravelers = [];
            this.OutBoundConnectingFlightInfo = [];
        }
        return PassengerList;
    }());
    InterlineThroughCheckin.PassengerList = PassengerList;
    var RootObject = /** @class */ (function () {
        function RootObject() {
            this.SegmentList = [];
            this.PassengerList = [];
            this.Source = "";
            this.BluetoothBagTag = false;
            this.BoardingPassDeliveryDetail = null;
        }
        return RootObject;
    }());
    InterlineThroughCheckin.RootObject = RootObject;
    var BoardingPassDeliveryDetail = /** @class */ (function () {
        function BoardingPassDeliveryDetail() {
            this.Gateway = "";
            this.Email = null;
            this.PrinterAddress = "";
        }
        return BoardingPassDeliveryDetail;
    }());
    InterlineThroughCheckin.BoardingPassDeliveryDetail = BoardingPassDeliveryDetail;
    var Printer = /** @class */ (function () {
        function Printer() {
            this.ClientCode = "";
            this.OfficeName = "";
            this.DeviceName = "";
            this.WorkstationName = "";
            this.PectabVersion = "";
            this.DeviceType = "";
        }
        return Printer;
    }());
    InterlineThroughCheckin.Printer = Printer;
})(InterlineThroughCheckin = exports.InterlineThroughCheckin || (exports.InterlineThroughCheckin = {}));
var PrinterDeviceModel;
(function (PrinterDeviceModel) {
    var Device = /** @class */ (function () {
        function Device() {
            this.IsSelectedDevice = false;
            this.DeviceName = "";
            this.DeviceType = "";
            this.Description = "";
            this.Status = "";
            this.QueueCount = "";
            this.Port = "";
            this.Pectab = "";
            this.PectabType = "";
        }
        return Device;
    }());
    PrinterDeviceModel.Device = Device;
    var Workstation = /** @class */ (function () {
        function Workstation() {
            this.device = [];
            this.workstationName = "";
        }
        return Workstation;
    }());
    PrinterDeviceModel.Workstation = Workstation;
    var RootObject = /** @class */ (function () {
        function RootObject() {
            this.workstation = [];
        }
        return RootObject;
    }());
    PrinterDeviceModel.RootObject = RootObject;
})(PrinterDeviceModel = exports.PrinterDeviceModel || (exports.PrinterDeviceModel = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF4dGVtcGxhdGUuaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGF4dGVtcGxhdGUuaW50ZXJmYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0E7SUFBQTtRQUNXLGNBQVMsR0FBVyxFQUFFLENBQUM7UUFDdkIsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQUN0QixhQUFRLEdBQVcsRUFBRSxDQUFDO1FBQ3RCLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFDckIsa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFDM0IsY0FBUyxHQUFXLEVBQUUsQ0FBQztRQUN2QixlQUFVLEdBQVcsRUFBRSxDQUFDO1FBQ3hCLDJCQUFzQixHQUFZLEtBQUssQ0FBQztRQUN4QyxzQkFBaUIsR0FBVyxFQUFFLENBQUM7UUFDL0IsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixnQkFBVyxHQUFXLENBQUMsQ0FBQztRQUN4QixlQUFVLEdBQVcsRUFBRSxDQUFDO1FBQ3hCLFFBQUcsR0FBa0IsRUFBRSxDQUFDO1FBQ3hCLFFBQUcsR0FBVyxFQUFFLENBQUM7UUFDakIsa0JBQWEsR0FBc0IsRUFBRSxDQUFDO1FBQzdDLHdDQUF3QztRQUNqQyxxQkFBZ0IsR0FBVyxFQUFFLENBQUM7UUFDOUIsWUFBTyxHQUFXLEVBQUUsQ0FBQztRQUNyQixRQUFHLEdBQVcsRUFBRSxDQUFDO1FBQ2pCLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDMUIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFDekIsbUJBQWMsR0FBVyxFQUFFLENBQUM7UUFDNUIsc0JBQWlCLEdBQVcsRUFBRSxDQUFDO1FBQy9CLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBQ3pCLHVCQUFrQixHQUFXLElBQUksQ0FBQztRQUNsQyxpQkFBWSxHQUF1QixFQUFFLENBQUM7UUFDdEMsZ0JBQVcsR0FBUSxFQUFFLENBQUM7UUFDdEIsa0JBQWEsR0FBWSxLQUFLLENBQUM7UUFHL0IsZUFBVSxHQUFZLEtBQUssQ0FBQztR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VSxFQUFFLENBQUM7WUFDeEIsV0FBTSxHQUFVLEVBQUUsQ0FBQztZQUNuQixlQUFVLEdBQVUsRUFBRSxDQUFDO1lBQ3ZCLFNBQUksR0FBVSxFQUFFLENBQUM7WUFDakIsV0FBTSxHQUFVLEVBQUUsQ0FBQztZQUNuQixlQUFVLEdBQVUsRUFBRSxDQUFDO1FBQ2xDLENBQUM7UUFBRCxhQUFDO0lBQUQsQ0FBQyxBQVZELElBVUM7SUFWWSx5QkFBTSxTQVVsQixDQUFBO0lBRUQ7UUFBQTtZQUNXLFdBQU0sR0FBZ0IsRUFBRSxDQUFDO1lBQ3pCLG9CQUFlLEdBQVUsRUFBRSxDQUFDO1FBQ3ZDLENBQUM7UUFBRCxrQkFBQztJQUFELENBQUMsQUFIRCxJQUdDO0lBSFksOEJBQVcsY0FHdkIsQ0FBQTtJQUVEO1FBQUE7WUFDVyxnQkFBVyxHQUFxQixFQUFFLENBQUM7UUFDOUMsQ0FBQztRQUFELGlCQUFDO0lBQUQsQ0FBQyxBQUZELElBRUM7SUFGWSw2QkFBVSxhQUV0QixDQUFBO0FBRUwsQ0FBQyxFQXZCUyxrQkFBa0IsR0FBbEIsMEJBQWtCLEtBQWxCLDBCQUFrQixRQXVCM0IiLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBjbGFzcyBQYXhUZW1wbGF0ZSB7XG4gICAgcHVibGljIEZpcnN0TmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgTGFzdE5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIEZ1bGxOYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBPcmRlcklEOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBQYXNzZW5nZXJUeXBlOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBUaWVyTGV2ZWw6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIEZRVFZOdW1iZXI6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIElzU2VjdXJpdHlEb2NzQ29tcGxldGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgU2VjdXJpdHlEb2NTdGF0dXM6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIEJhZ0NvdW50OiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyBUb3RhbFdlaWdodDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgU2VhdE51bWJlcjogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgU1NSOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgcHVibGljIEVNRDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgRmxpZ2h0RGV0YWlsczogQXJyYXk8RmxpZ2h0SW5mbz4gPSBbXTtcbiAgICAvLyBQcm9wZXJ0aWVzIG5lZWRlZCB0byBjaGVjayBpbiB0aGUgcGF4XG4gICAgcHVibGljIFN1cm5hbWVSZWZOdW1iZXI6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFN1ck5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFJQSDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgU2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgRlFUVkFpcmxpbmU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIEFwaXNEb2NvU3RhdHVzOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBQYXNzZW5nZXJUeXBlQ29kZTogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgUHJvZ3JhbUlEeHg6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFBhc3NlbmdlclJlZk51bWJlcjogc3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgUGhvbmVOdW1iZXJzOiBBcnJheTxQaG9uZU51bWJlcj4gPSBbXTtcbiAgICBwdWJsaWMgRGF0ZU9mQmlydGg6IGFueSA9IFwiXCI7XG4gICAgcHVibGljIENoZWNraW5TdGF0dXM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgQmFnZ2FnZUluZm86IGFueTtcbiAgICBwdWJsaWMgTmV3U2VhdE51bWJlcjogYW55O1xuICAgIHB1YmxpYyBJc1NlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIElzQ2hlY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBJTkZ3aXRob3V0U2VhdDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBGcXR2Um9vdFByb2dyYW1zOiBGUVRWUm9vdE9iamVjdDtcbiAgICBwdWJsaWMgZnF0dlByb2dyYW1zOiBGcXR2Q2xhc3NQcm9ncmFtcztcbiAgICBwdWJsaWMgZnF0djogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgIHB1YmxpYyBzZXJ2aWNlVGV4dDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgU3luY1RpY2tldDogYm9vbGVhbjtcbiAgICBwdWJsaWMgTG95YWxMZXZlbDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgT3ZlcnNvbGQ6IGJvb2xlYW47XG4gICAgLy90ZXN0XG59XG5leHBvcnQgZW51bSBGbGlnaHRTdGF0dXMge1xuICAgIE9wZW4sXG4gICAgQ2xvc2VkLFxuICAgIE9uSG9sZCxcbiAgICBVbmtub3duXG59XG4vL1xuZXhwb3J0IGNsYXNzIFBob25lTnVtYmVyIHtcbiAgICBwdWJsaWMgSXNSZWZWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBUeXBlOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBUeXBlVGV4dDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgVGVjaFR5cGU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFRlY2hUeXBlVGV4dDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgVmFsdWU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIE9wZXJhdGlvbjogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgT1NJVGV4dDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgQ2FycmllckNvZGU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFJlbWFyazogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgTG9jYXRpb25Db2RlOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBBcmVhQ2l0eUNvZGU6IHN0cmluZyA9IFwiXCI7XG59XG5cbmV4cG9ydCBjbGFzcyBGcXR2Q2xhc3NQcm9ncmFtcyB7XG4gICAgcHVibGljIFByb2dyYW1JRDogc3RyaW5nO1xuICAgIHB1YmxpYyBQcm9ncmFtTmFtZTogc3RyaW5nO1xufVxuZXhwb3J0IGNsYXNzIEZRVFZSb290T2JqZWN0IHtcbiAgICBwdWJsaWMgRnF0dlByb2dyYW1zOiBBcnJheTxGcXR2Q2xhc3NQcm9ncmFtcz47XG59XG5cbmV4cG9ydCBjbGFzcyBGbGlnaHRJbmZvIHtcbiAgICBwdWJsaWMgRmxpZ2h0TnVtYmVyOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBNYXJrZXRpbmdGbGlnaHQ6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIEZsaWdodERhdGU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIEZsaWdodFN0YXR1czogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgc3RhdHVzOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBPcmlnaW46IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIERlc3RpbmF0aW9uOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBPcmlnaW5DaXR5OiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBEZXN0aW5hdGlvbkNpdHk6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFNURDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgRVREOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBFVEE6IHN0cmluZyA9IFwiXCI7XG4gICAgLy8gUHJvcGVydGllcyBuZWVkZWQgdG8gY2hlY2sgaW4gdGhlIHBheFxuICAgIHB1YmxpYyBSUEg6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFJCRDogc3RyaW5nID0gXCJcIjtcblxuXG4gICAgcHVibGljIERlcGFydHVyZURhdGVUaW1lOiBEYXRlID0gbnVsbDtcbiAgICBwdWJsaWMgQXJyaXZhbERhdGVUaW1lOiBEYXRlID0gbnVsbDtcblxuICAgIHB1YmxpYyBEZXBhcnR1cmVDaXR5OiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBTZWF0czogc3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgU3RhdHVzQ2F0ZWdvcnk6IHN0cmluZyA9IFwiQ29uZmlybWVkXCI7XG5cbiAgICBwdWJsaWMgUGFzc2VuZ2VyUlBIczogc3RyaW5nID0gXCJbXFxcIjFcXFwiXVwiO1xuICAgIHB1YmxpYyBTZWdtZW50UlBIOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBGbGlnaHRDaGVja0luOiBzdHJpbmcgPSBudWxsO1xuICAgIHB1YmxpYyBGbGlnaHRJbmZvOiBzdHJpbmcgPSBudWxsO1xuICAgIHB1YmxpYyBTZWxlY3RlZDogYm9vbGVhbiA9IHRydWU7XG4gICAgcHVibGljIElzVGhyb3VnaE9yQ2hhbmdlT2ZHYXVnZUZsaWdodDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBDb25uZWN0aW9uOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBTdG9wb3Zlcjogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgU3RhdHVzTnVtYmVyOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBUdXJuYXJvdW5kOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBPcGVyYXRpbmdGbGlnaHQ6IHN0cmluZyA9IFwiXCI7XG59XG5cbmV4cG9ydCBjbGFzcyBGUVRWSW5mbyB7XG4gICAgcHVibGljIE9yZGVySUQ6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFBhc3Nlbmdlck5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFN0YXR1czogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgRmxpZ2h0TnVtYmVyOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBJc0NoZWNrZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbn1cbmV4cG9ydCBtb2R1bGUgQ2hlY2tJblBvc3RUZW1wbGF0ZSB7XG4gICAgZXhwb3J0IGNsYXNzIFJvb3RPYmplY3Qge1xuICAgICAgICBwdWJsaWMgU291cmNlOnN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBCbHVldG9vdGhCYWdUYWc6IGJvb2xlYW49IGZhbHNlO1xuICAgICAgICBwdWJsaWMgQ2hlY2tJblR5cGU6IHN0cmluZyA9IFwiQ2hlY2tJblwiO1xuICAgICAgICBwdWJsaWMgU2VnbWVudExpc3Q6IEFycmF5PFNlZ21lbnRMaXN0PiA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBQYXNzZW5nZXJMaXN0OiBBcnJheTxQYXNzZW5nZXJMaXN0PiA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBCb2FyZGluZ1Bhc3NEZWxpdmVyeURldGFpbDogQXJyYXk8Qm9hcmRpbmdQYXNzRGVsaXZlcnlEZXRhaWw+ID0gbnVsbDtcbiAgICAgICAgcHVibGljIGlzTWFudWFsQmFnOmJvb2xlYW47XG4gICAgICAgIHB1YmxpYyBJc0ludGVybGluZUNoZWNraW46Ym9vbGVhbjtcbiAgICAgICAgcHVibGljIElzRlFUVlVwZGF0ZTpib29sZWFuO1xuXG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBXYWl0bGlzdFJvb3RPYmplY3Qge1xuICAgICAgICBwdWJsaWMgQ2hlY2tJblR5cGU6IHN0cmluZyA9IFwiV2FpdGxpc3RcIjtcbiAgICAgICAgcHVibGljIFNlZ21lbnRMaXN0OiBBcnJheTxTZWdtZW50TGlzdD4gPSBudWxsO1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyTGlzdDogQXJyYXk8V2FpdExpc3RQYXNzZW5nZXI+ID0gbnVsbDtcbiAgICAgICAgcHVibGljIEJvYXJkaW5nUGFzc0RlbGl2ZXJ5RGV0YWlsOiBBcnJheTxCb2FyZGluZ1Bhc3NEZWxpdmVyeURldGFpbD4gPSBudWxsO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgQm9hcmRpbmdQYXNzRGVsaXZlcnlEZXRhaWwge1xuICAgICAgICBwdWJsaWMgUHJpbnRlcjogUHJpbnRlcjtcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIFByaW50ZXIge1xuICAgICAgICBwdWJsaWMgRGV2aWNlVHlwZTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgRGV2aWNlTmFtZTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgV29ya3N0YXRpb25OYW1lOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBQZWN0YWJWZXJzaW9uOiBzdHJpbmc7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBQYXNzZW5nZXJMaXN0IHtcbiAgICAgICAgcHVibGljIEdpdmVuTmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFN1cm5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBQYXNzZW5nZXJUeXBlQ29kZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlclJlZk51bWJlcjogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIEFzc29jaWF0ZWRJbmZhbnRSUEg6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBBc3NvY2lhdGVkQWR1bHRSUEg6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBGcXRUcmF2ZWxlcnM6IGFueVtdID0gW107XG4gICAgICAgIHB1YmxpYyBFbWVyZ2VuY3lEZXRhaWxzOiBhbnlbXSA9IFtdO1xuICAgICAgICBwdWJsaWMgT3JkZXJJZDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFJQSDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIEZpcnN0bmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIExhc3RuYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgU2VsZWN0ZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgICAgICBwdWJsaWMgUGhvbmVOdW1iZXJzOiBhbnlbXSA9IFtdO1xuICAgICAgICBwdWJsaWMgQ2hlY2tlZEJhZ0NvdW50OiBudW1iZXIgPSAwO1xuICAgICAgICBwdWJsaWMgSXNCYWdnYWdlQ2hlY2tlZDogYm9vbGVhbjtcbiAgICAgICAgcHVibGljIFN0YXR1czogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFNob3J0Q2hlY2tBaXJwb3J0Q29kZTpzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBTdXJuYW1lUmVmTnVtYmVyOnN0cmluZztcbiAgICAgICAgcHVibGljIFN1cm5hbWVSZWZOdW1iZXJDb3VudDpudW1iZXI7XG4gICAgICAgIHB1YmxpYyBDaGVja2VkQmFncz86YW55O1xuICAgICAgICBwdWJsaWMgQ2hlY2tJbkJhZ0NvdW50VG90YWwgOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBDaGVja0luQmFnV2VpZ2h0VG90YWwgOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBBZ2U6c3RyaW5nPVwiXCI7XG4gICAgICAgIHB1YmxpYyBDaGVja2luUmVQcmludDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgRnJlZUJhZ2dhZ2VDb3VudDphbnk7XG4gICAgICAgIHB1YmxpYyBBcGlzU3RhdHVzOmFueTtcbiAgICAgICAgcHVibGljIGFkZFBhcnRpYWxNZW1iZXI6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgVW5pdE9mTWVhc3VyZUNvZGU6YW55ID0gbnVsbDtcbiAgICAgICAgcHVibGljIFVuaXRPZk1lYXN1cmVRdWFudGl0eTphbnkgPSBudWxsO1xuICAgICAgICBwdWJsaWMgT2xkS25vd25UcmF2ZWxlck51bWJlcjphbnkgPSBudWxsO1xuICAgICAgICBwdWJsaWMgT2xkUmVkcmVzc051bWJlcjphbnkgPSBudWxsO1xuICAgICAgICBwdWJsaWMgRk9JRDphbnkgPSBudWxsO1xuXG4gICAgICAgIFxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBXYWl0TGlzdFBhc3NlbmdlciB7XG4gICAgICAgIHB1YmxpYyBHaXZlbk5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBTdXJuYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgU3VybmFtZVJlZk51bWJlcjpzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBSUEg6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBFbWFpbHM6YW55W109W107XG4gICAgICAgIHB1YmxpYyBQYXNzZW5nZXJUeXBlQ29kZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlclJlZk51bWJlcjogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFBob25lTnVtYmVyczogYW55W10gPSBbXTtcbiAgICAgICAgcHVibGljIEFzc29jaWF0ZWRJbmZhbnRSUEg6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBBc3NvY2lhdGVkQWR1bHRSUEg6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBGcXRUcmF2ZWxlcnM6IGFueVtdID0gW107XG4gICAgICAgIHB1YmxpYyBFbWVyZ2VuY3lEZXRhaWxzOiBhbnlbXSA9IFtdO1xuICAgICAgICBwdWJsaWMgU3RhdHVzOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgT2xkRW1lcmdlbmN5RGV0YWlsczogYW55W109W107XG4gICAgICAgIHB1YmxpYyBPcmRlcklkOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgQ2hlY2tlZEJhZ0NvdW50OiBudW1iZXIgPSAwO1xuICAgICAgICBwdWJsaWMgYWRkUGFydGlhbE1lbWJlcjpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBVbml0T2ZNZWFzdXJlQ29kZTphbnkgPSBudWxsO1xuICAgICAgICBwdWJsaWMgVW5pdE9mTWVhc3VyZVF1YW50aXR5OmFueSA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBPbGRLbm93blRyYXZlbGVyTnVtYmVyOmFueSA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBPbGRSZWRyZXNzTnVtYmVyOmFueSA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBGT0lEOmFueSA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBDaGVja2luUmVQcmludDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBGaXJzdG5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBMYXN0bmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFNlbGVjdGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgcHVibGljIE9sZEZxdFRyYXZlbGVyczphbnkgPSBudWxsO1xuICAgICAgICBwdWJsaWMgU3VybmFtZVJlZk51bWJlckNvdW50OmFueTtcbiAgICAgICAgcHVibGljIEZyZWVCYWdnYWdlQ291bnQ6YW55O1xuICAgICAgICBwdWJsaWMgQXBpc1N0YXR1czphbnk7XG4gICAgICAgIFxuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgQ2hlY2tJbk9wdGlvbnMge1xuICAgICAgICBwdWJsaWMgVW5hY2NvbXBhbmllZE1pbm9yOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBEaXNhYmxlZFBhc3NlbmdlcjogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgUHJlZmVycmVkUGFzc2VuZ2VyOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBTdGFuZGJ5VXBncmFkZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgU3RhbmRieTogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgRXh0cmFTZWF0OiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBOb25SZXZlbnVlQ2F0ZWdvcnk6IHN0cmluZyA9IG51bGw7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBGcXRUcmF2ZWxlciB7XG5cbiAgICAgICAgcHVibGljIFByb2dyYW1JRDogc3RyaW5nID0gbnVsbDtcbiAgICAgICAgcHVibGljIE1lbWJlcnNoaXBJRDogc3RyaW5nID0gbnVsbDtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgU2VnbWVudExpc3Qge1xuICAgICAgICBwdWJsaWMgUlBIOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgRGVwYXJ0dXJlRGF0ZVRpbWU6IERhdGUgPSBudWxsO1xuICAgICAgICBwdWJsaWMgTWFya2V0aW5nRmxpZ2h0OiBzdHJpbmcgPSBudWxsO1xuICAgICAgICBwdWJsaWMgT3BlcmF0aW5nRmxpZ2h0OnN0cmluZz1udWxsO1xuICAgICAgICBwdWJsaWMgU2VsZWN0ZWQ6IGJvb2xlYW4gPSBudWxsO1xuICAgICAgICBwdWJsaWMgRGVwYXJ0dXJlQ2l0eTogc3RyaW5nID0gbnVsbDtcbiAgICAgICAgcHVibGljIEFycml2YWxDaXR5OnN0cmluZyA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBPcmRlcklkOnN0cmluZyA9IFwiXCI7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBGbGlnaHRDaGVja0luIHtcbiAgICAgICAgcHVibGljIENoZWNrSW5TdGF0dXM6IHN0cmluZyA9IFwiT3BlblwiO1xuICAgIH1cbn1cblxuZXhwb3J0IG1vZHVsZSBEZXBhcnR1cmVJbmZvMSB7XG5cbiAgICBleHBvcnQgY2xhc3MgRGVwYXJ0dXJlIHtcbiAgICAgICAgcHVibGljIEZsaWdodFN0YXR1czogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIENoZWNraW5TdGF0dXM6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBEZXN0aW5hdGlvbjogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIEdhdGU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBGbGlnaHROdW1iZXI6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBTVEQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBFVEQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBDb2xvcjogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIElzQ2hlY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgU1RBOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgY29uZmlndXJhdGlvbjogQXJyYXk8Q29uZmlndXJhdGlvbj4gPSBbXTtcbiAgICAgICAgcHVibGljIERlc3RpbmF0aW9uQWlycG9ydDpzdHJpbmc9XCJcIjtcbiAgICAgICAgcHVibGljIERhdGU6YW55O1xuICAgICAgICAvLyBwdWJsaWMgRWNvbm9teUludmVudGFyeTpzdHJpbmcgPVwiXCI7XG4gICAgICAgIC8vIHB1YmxpYyBCdXNzaW5lc3NJbnZlbnRhcnk6c3RyaW5nID1cIlwiO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uIHtcbiAgICAgICAgcHVibGljIEJvb2tlZDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIEJvYXJkaW5nVGltZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIENvZGVMZXR0ZXI6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBDYXBhY2l0eTogc3RyaW5nID0gXCJcIjtcblxuICAgIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgRGVwYXJ0dXJlSW5mbyB7XG4gICAgcHVibGljIEZsaWdodFN0YXR1czogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgQ2hlY2tpblN0YXR1czogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgRGVzdGluYXRpb246IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIEdhdGU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIEZsaWdodE51bWJlcjogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgRXhwZWN0ZWREZXBhcnR1cmVEYXRlOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBTVEQ6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIEVURDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgSXNDaGVja2VkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIENvbG9yOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBFY29ub215SW52ZW50YXJ5OiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBCdXNzaW5lc3NJbnZlbnRhcnk6IHN0cmluZyA9IFwiXCI7XG5cbn1cblxuZXhwb3J0IG1vZHVsZSBBY2NvbnRQcm9maWxlTW9kZWwge1xuICAgIGV4cG9ydCBjbGFzcyBBY2NvdW50UHJvZmlsZVRlbXBsYXRlIHtcbiAgICAgICAgcHVibGljIFVzZXJuYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgRmlyc3ROYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgTGFzdE5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBBZ2VudER1dHlDb2RlOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgQWdlbnRTaW5lOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgQWlycG9ydENvZGUgOnN0cmluZyA9XCJcIjtcbiAgICAgICAgcHVibGljIFBoeXNpY2FsTG9jYXRpb24gOiBzdHJpbmcgPVwiXCI7XG4gICAgICAgIHB1YmxpYyBSZXF1ZXN0b3JfSUQgOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgUG9pbnRPZlNhbGVzOiBBcnJheTxQb2ludE9mU2FsZXM+ID0gW107XG4gICAgICAgIHB1YmxpYyBDdXJyZW5jaWVzOkFycmF5PGFueT49W107XG4gICAgICAgIHB1YmxpYyBJU09DdXJyZW5jeUNvZGU6IHN0cmluZyA9IFwiXCI7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBQb2ludE9mU2FsZXMge1xuICAgICAgICBwdWJsaWMgQWlycG9ydENvZGU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBOYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgSUQ6c3RyaW5nPVwiXCI7XG4gICAgICAgIHB1YmxpYyBjdXJyZW5jaWVzOkFycmF5PHN0cmluZz49W107XG4gICAgICAgIHB1YmxpYyBBZ2VudENvZGU6IHN0cmluZz1cIlwiO1xuICAgIH1cbn1cbmV4cG9ydCBtb2R1bGUgU2VhdE1hcCB7XG5cbiAgICBleHBvcnQgY2xhc3MgUm9vdE9iamVjdCB7XG4gICAgICAgIEl0ZW1zOiBJdGVtW107XG4gICAgICAgIEVycm9ycz86IGFueTtcbiAgICAgICAgSW5mb3JtYXRpb24/OiBhbnk7XG4gICAgICAgIFdhcm5pbmdzPzogYW55O1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgSXRlbSB7XG4gICAgICAgIEZsaWdodFNlZ21lbnQ6IEZsaWdodFNlZ21lbnQ7XG4gICAgICAgIENhYmluTGlzdDogQ2FiaW5MaXN0W107XG4gICAgICAgIFNlYXRQcm9kdWN0SW5mb3JtYXRpb246IFNlYXRQcm9kdWN0SW5mb3JtYXRpb25bXTtcbiAgICAgICAgRW5hYmxlU2VhdENoYXJnZXM6IGJvb2xlYW47XG4gICAgICAgIEVycm9ycz86IGFueTtcbiAgICAgICAgSW5mb3JtYXRpb24/OiBhbnk7XG4gICAgICAgIFdhcm5pbmdzPzogYW55O1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgU2VhdFByb2R1Y3RJbmZvcm1hdGlvbiB7XG4gICAgICAgIFNTUkNvZGU/OiBhbnk7XG4gICAgICAgIFR5cGVPZlNlcnZpY2U6IHN0cmluZztcbiAgICAgICAgU3ViQ29kZTogc3RyaW5nO1xuICAgICAgICBSRklDOiBzdHJpbmc7XG4gICAgICAgIEVNRF9UeXBlQ29kZTogc3RyaW5nO1xuICAgICAgICBPVEFDb2RlOiBzdHJpbmc7XG4gICAgICAgIERlc2NyaXB0aW9uOiBzdHJpbmc7XG4gICAgICAgIFRvb2xUaXA6IHN0cmluZztcbiAgICAgICAgU0hBUkVTQ29kZTogc3RyaW5nO1xuICAgICAgICBQcm9kdWN0TmFtZTogc3RyaW5nO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgRmxpZ2h0U2VnbWVudCB7XG4gICAgICAgIFJQSDogbnVtYmVyO1xuICAgICAgICBEZXBhcnR1cmVEYXRlVGltZTogRGF0ZTtcbiAgICAgICAgQXJyaXZhbERhdGVUaW1lOiBEYXRlO1xuICAgICAgICBFcXVpcG1lbnRUeXBlOiBzdHJpbmc7XG4gICAgICAgIEZsaWdodDogc3RyaW5nO1xuICAgICAgICBPcGVyYXRpbmdGbGlnaHQ/OiBhbnk7XG4gICAgICAgIE9yaWdpbjogT3JpZ2luO1xuICAgICAgICBEZXN0aW5hdGlvbjogRGVzdGluYXRpb247XG4gICAgICAgIElzVVRDOiBib29sZWFuO1xuICAgICAgICBIYXNTdXJuYW1lUHJlZml4OiBib29sZWFuO1xuICAgICAgICBIYXNTdG9wb3ZlcjogYm9vbGVhbjtcbiAgICAgICAgUmVzQm9va0Rlc2lnQ29kZT86IGFueTtcbiAgICAgICAgU3RhdHVzPzogYW55O1xuICAgICAgICBDb3Vwb25JbmZvPzogYW55O1xuICAgICAgICBJc0NoYW5nZU9mR2F1Z2U6IGJvb2xlYW47XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBPcmlnaW4ge1xuICAgICAgICBBaXJwb3J0TmFtZTogc3RyaW5nO1xuICAgICAgICBGbGFnU3RvcEluZD86IGFueTtcbiAgICAgICAgQ2l0eU5hbWU6IHN0cmluZztcbiAgICAgICAgTG9jYXRpb25Db2RlOiBzdHJpbmc7XG4gICAgICAgIENvdW50cnlOYW1lOiBzdHJpbmc7XG4gICAgICAgIENvdW50cnlDb2RlOiBzdHJpbmc7XG4gICAgICAgIFBob25lQWNjZXNzQ29kZT86IGFueTtcbiAgICAgICAgSVNPM0NvdW50cnlDb2RlPzogYW55O1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBEZXN0aW5hdGlvbiB7XG4gICAgICAgIEFpcnBvcnROYW1lOiBzdHJpbmc7XG4gICAgICAgIEZsYWdTdG9wSW5kPzogYW55O1xuICAgICAgICBDaXR5TmFtZTogc3RyaW5nO1xuICAgICAgICBMb2NhdGlvbkNvZGU6IHN0cmluZztcbiAgICAgICAgQ291bnRyeU5hbWU6IHN0cmluZztcbiAgICAgICAgQ291bnRyeUNvZGU6IHN0cmluZztcbiAgICAgICAgUGhvbmVBY2Nlc3NDb2RlPzogYW55O1xuICAgICAgICBJU08zQ291bnRyeUNvZGU/OiBhbnk7XG4gICAgfVxuICAgIC8vIGV4cG9ydCBjbGFzcyBTZWF0TGlzdCB7XG4gICAgLy8gICAgIHB1YmxpYyBDYWJpbkxpc3Q6IEFycmF5PENhYmluTGlzdD4gPSBbXTtcbiAgICAvLyB9XG5cblxuICAgIGV4cG9ydCBjbGFzcyBDYWJpbkxpc3Qge1xuICAgICAgICBwdWJsaWMgQ2FiaW5UeXBlOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBDYWJpbk5hbWU6IHN0cmluZztcbiAgICAgICAgcHVibGljIEFpclJvd0xpc3Q6IEFycmF5PEFpclJvd0xpc3Q+ID0gW107XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEFpclJvd0xpc3Qge1xuICAgICAgICBwdWJsaWMgUm93TnVtYmVyOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBSb3dDaGFyYWN0ZXJpc3RpY3M6IEFycmF5PHN0cmluZz47XG4gICAgICAgIHB1YmxpYyBBaXJTZWF0TGlzdDogQXJyYXk8QWlyU2VhdExpc3Q+ID0gW107XG4gICAgICAgIHB1YmxpYyBIZWFkZXJSb3c/OiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBTdHlsZUNsYXNzPzogc3RyaW5nID0gXCJcIjtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQWlyU2VhdExpc3Qge1xuICAgICAgICBwdWJsaWMgU2VhdEF2YWlsYWJpbGl0eTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgU2VhdE51bWJlcjogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFNlYXRDaGFyYWN0ZXJpc3RpY3M6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAgICAgcHVibGljIFJlY29uY2lsZWRTdGF0dXM6IG51bWJlcjtcbiAgICAgICAgcHVibGljIFNlYXRQcmljZUxpc3Q/OiBhbnk7XG4gICAgICAgIHB1YmxpYyBNaWRDb2w/OiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBTdHlsZUNsYXNzPzogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIElzU2VhdFNlbGVjdGVkPzogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgSXNTZWxlY3RlZEFkdmFuY2VEaXNwbGF5PzogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgQWR2YW5jZURpc3BsYXlTdHlsZUNsYXNzPzogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFNlYXROdW0gOiBzdHJpbmcgPVwiXCI7XG4gICAgICAgIHB1YmxpYyBTZWF0Q29kZSA6IHN0cmluZyA9XCJcIjtcbiAgICAgICAgcHVibGljIElzUGF4U2VsZWN0ZWQ/OiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBQYXhSUEggOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgaXNTcGVjaWFsU2VhdCA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgcHVibGljIEZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlOnN0cmluZz1cIlwiO1xuICAgIH1cblxufVxuXG5cblxuZXhwb3J0IG1vZHVsZSBBc3NpZ25TZWF0IHtcbiAgICBleHBvcnQgY2xhc3Mgc2VhdCB7XG4gICAgICAgIHB1YmxpYyBTZWF0TGlzdDogQXJyYXk8c2VhdHM+ID0gW107XG4gICAgICAgIHB1YmxpYyBJc0ludGVybGluZVNlYXRNYXAgOiBib29sZWFuID1mYWxzZTtcbiAgICAgICAgcHVibGljIERlbGl2ZXJ5RGV0YWlsOmFueSA9IG51bGw7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIHNlYXRzIHtcbiAgICAgICAgcHVibGljIE9yZGVySWQ6IHN0cmluZztcbiAgICAgICAgcHVibGljIFNlYXRObzogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgU2VhdFByZWZlcmVuY2U6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAgICAgcHVibGljIFNlYXRDaGVja0luU3RhdHVzOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBQcmV2aW91c1NlYXRObzogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgSU5GR2l2ZW5OYW1lIDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgSU5GU3VybmFtZTpzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBGbGlnaHRObzogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgRGVwYXJ0dXJlQWlycG9ydENvZGU6IHN0cmluZztcbiAgICAgICAgcHVibGljIEFycml2YWxBaXJwb3J0Q29kZSA6IHN0cmluZztcbiAgICAgICAgcHVibGljIERlcGFydHVyZURhdGVUaW1lOiBEYXRlID0gbnVsbDtcbiAgICAgICAgcHVibGljIFBhc3NlbmdlckZpcnN0TmFtZTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyTGFzdE5hbWU6IHN0cmluZztcbiAgICAgICAgcHVibGljIFJlc0Jvb2tEZXNpZ0NvZGU6IHN0cmluZztcbiAgICAgICAgcHVibGljIEZsaWdodExlZ0RlcGFydHVyZUFpcnBvcnRDb2RlOnN0cmluZztcbiAgICAgICAgcHVibGljIE5vU2VhdDpib29sZWFuPWZhbHNlO1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyUmVmTnVtYmVyOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBQYXNzZW5nZXJUeXBlQ29kZTpzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBIYXNQcmljZTpib29sZWFuPWZhbHNlO1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyUlBIOnN0cmluZztcbiAgICAgICAgcHVibGljIFN1cm5hbWVSZWZOdW1iZXI6c3RyaW5nO1xuICAgICAgICBwdWJsaWMgR2l2ZW5OYW1lUmVmTnVtYmVyOnN0cmluZztcbiAgICAgICAgcHVibGljIElzQ2hlY2tlZEluOnN0cmluZztcblxuICAgIH1cblxufVxuXG4vLyBleHBvcnQgbW9kdWxlIEFzc2lnblNlYXR7XG5cbi8vICAgICBleHBvcnQgY2xhc3MgU2VhdExpc3Qge1xuLy8gICAgICAgICBPcmRlcklkOiBzdHJpbmc7XG4vLyAgICAgICAgIFNlYXRObzogc3RyaW5nO1xuLy8gICAgICAgICBTZWF0Q2hlY2tJblN0YXR1cz86IGFueTtcbi8vICAgICAgICAgU2VhdFByZWZlcmVuY2U6IEFycmF5PHN0cmluZz4gPSBbXTtcbi8vICAgICAgICAgUHJldmlvdXNTZWF0Tm86IHN0cmluZztcbi8vICAgICAgICAgRmxpZ2h0Tm86IHN0cmluZztcbi8vICAgICAgICAgRGVwYXJ0dXJlQWlycG9ydENvZGU6IHN0cmluZztcbi8vICAgICAgICAgRGVwYXJ0dXJlRGF0ZVRpbWU6IERhdGU7XG4vLyAgICAgICAgIFBhc3NlbmdlckZpcnN0TmFtZTogc3RyaW5nO1xuLy8gICAgICAgICBQYXNzZW5nZXJMYXN0TmFtZTogc3RyaW5nO1xuLy8gICAgICAgICBSZXNCb29rRGVzaWdDb2RlOiBzdHJpbmc7XG4vLyAgICAgICAgIEdpdmVuTmFtZVJlZk51bWJlcj86IGFueTtcbi8vICAgICAgICAgU3VybmFtZVJlZk51bWJlcjogc3RyaW5nO1xuLy8gICAgICAgICBQYXNzZW5nZXJUeXBlQ29kZT86IGFueTtcbi8vICAgICAgICAgTm9TZWF0OiBib29sZWFuO1xuLy8gICAgICAgICBIYXNQcmljZTogYm9vbGVhbjtcbi8vICAgICAgICAgRmxpZ2h0TGVnRGVwYXJ0dXJlQWlycG9ydENvZGU6IHN0cmluZztcbi8vICAgICAgICAgUGFzc2VuZ2VyUlBIOiBzdHJpbmc7XG4vLyAgICAgICAgIElzQ2hlY2tlZEluOiBzdHJpbmc7XG4vLyAgICAgICAgIElORkdpdmVuTmFtZT86IGFueTtcbi8vICAgICAgICAgSU5GU3VybmFtZT86IGFueTtcbi8vICAgICB9XG5cbi8vICAgICBleHBvcnQgY2xhc3MgUm9vdE9iamVjdCB7XG4vLyAgICAgICAgIFNlYXRMaXN0OiBBcnJheTxTZWF0TGlzdD49W107XG4vLyAgICAgICAgIERlbGl2ZXJ5RGV0YWlsPzogYW55O1xuLy8gICAgIH1cblxuLy8gfVxuXG5cblxuZXhwb3J0IG1vZHVsZSBQYXNzZW5nZXJDaGVja2luIHtcbiAgICBleHBvcnQgY2xhc3MgU2VsZWN0ZWRQYXNzZW5nZXIge1xuICAgICAgICBwdWJsaWMgRmlyc3ROYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgTGFzdE5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgfVxufVxuZXhwb3J0IG1vZHVsZSBGUVRWUHJvIHtcbiAgICBleHBvcnQgY2xhc3MgRnF0dlByb2dyYW1zIHtcbiAgICAgICAgcHVibGljIFByb2dyYW1JRDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgUHJvZ3JhbU5hbWU6IHN0cmluZztcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIFJvb3RPYmplY3Qge1xuICAgICAgICBwdWJsaWMgRnF0dlByb2dyYW1zOiBBcnJheTxGcXR2UHJvZ3JhbXM+O1xuXG4gICAgfVxufVxuXG5cblxuZXhwb3J0IG1vZHVsZSBJbkJvdW5kIHtcbiAgICBleHBvcnQgY2xhc3MgSW5ib3Uge1xuICAgICAgICBwdWJsaWMgRmxpZ2h0TnVtYmVyOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBMb2NhdGlvbkNvZGU6IHN0cmluZztcbiAgICAgICAgcHVibGljIFBhc3NlbmdlckNvdW50OiBudW1iZXI7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBSb290T2JqZWN0IHtcbiAgICAgICAgcHVibGljIEluYm91OiBJbmJvdTtcbiAgICB9XG59XG5leHBvcnQgbW9kdWxlIE91dEJvdW5kIHtcbiAgICBleHBvcnQgY2xhc3MgT3V0Ym91IHtcbiAgICAgICAgcHVibGljIEZsaWdodE51bWJlcjogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgTG9jYXRpb25Db2RlOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBQYXNzZW5nZXJDb3VudDogbnVtYmVyO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgUm9vdE9iamVjdCB7XG4gICAgICAgIHB1YmxpYyBPdXRib3U6IE91dGJvdTtcbiAgICB9XG59XG5cbmV4cG9ydCBtb2R1bGUgQm9hcmRpbmdQYXNzIHtcblxuICAgIGV4cG9ydCBjbGFzcyBSb290T2JqZWN0IHtcbiAgICAgICAgcHVibGljIFNvdXJjZTpzdHJpbmcgPSBcIlRhYlwiO1xuICAgICAgICBwdWJsaWMgRGVsaXZlcnlEZXRhaWw6IEJvYXJkaW5nUGFzc0RlbGl2ZXJ5RGV0YWlsO1xuICAgICAgICBwdWJsaWMgU2VnbWVudHM6IEFycmF5PFNlZ21lbnRMaXN0PiA9IFtdO1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyczogQXJyYXk8UGFzc2VuZ2VyTGlzdD4gPSBbXTtcblxuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgQm9hcmRpbmdQYXNzRGVsaXZlcnlEZXRhaWwge1xuICAgICAgICBwdWJsaWMgR2F0ZXdheTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIEVtYWlsOiBzdHJpbmcgPSBudWxsO1xuICAgICAgICBwdWJsaWMgUHJpbnRlckFkZHJlc3M6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBQcmludGVyOiBQcmludGVyO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgUHJpbnRlciB7XG4gICAgICAgIHB1YmxpYyBDbGllbnRDb2RlOiBzdHJpbmc9XCJcIjtcbiAgICAgICAgcHVibGljIE9mZmljZU5hbWU6IHN0cmluZz1cIlwiO1xuICAgICAgICBwdWJsaWMgRGV2aWNlTmFtZTogc3RyaW5nPVwiXCI7XG4gICAgICAgIHB1YmxpYyBXb3Jrc3RhdGlvbk5hbWU6IHN0cmluZz1cIlwiO1xuICAgICAgICBwdWJsaWMgUGVjdGFiVmVyc2lvbjogc3RyaW5nPVwiXCI7XG4gICAgICAgIHB1YmxpYyBEZXZpY2VUeXBlOnN0cmluZz1cIlwiO1xuXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFBhc3Nlbmdlckxpc3Qge1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyVHlwZUNvZGU6c3RyaW5nO1xuICAgICAgICBwdWJsaWMgU3VybmFtZVJlZk51bWJlcjogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIEVtYWlsczphbnlbXTtcbiAgICAgICAgcHVibGljIEZxdFRyYXZlbGVyczogQXJyYXk8RnF0VHJhdmVsZXI+ID0gW107XG4gICAgICAgIHB1YmxpYyBPcmRlcklkOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgQ2hlY2tlZEJhZ0NvdW50Om51bWJlcjtcbiAgICAgICAgcHVibGljIFJQSDogc3RyaW5nIDtcbiAgICAgICAgcHVibGljIEZpcnN0bmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIExhc3RuYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgU2VsZWN0ZWQ6Ym9vbGVhbiA9IHRydWU7XG4gICAgICAgIHB1YmxpYyBBc3NvY2lhdGVkQWR1bHRSUEg6c3RyaW5nPW51bGw7XG4gICAgICAgIHB1YmxpYyBBc3NvY2lhdGVkSW5mYW50UlBIOnN0cmluZz1udWxsO1xuICAgICAgICBwdWJsaWMgRW1lcmdlbmN5RGV0YWlsczphbnlbXTtcbiAgICAgICAgcHVibGljIFN0YXR1czpzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBQaG9uZU51bWJlcnM6YW55W107XG4gICAgICAgIHB1YmxpYyBJTkZTdXJuYW1lOmFueTtcbiAgICAgICAgcHVibGljIElORkdpdmVuTmFtZTphbnk7XG4gICAgICAgIHB1YmxpYyBQYXNzZW5nZXJSZWZOdW1iZXI6YW55O1xuICAgICAgICBwdWJsaWMgQXBpc1N0YXR1czpzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBHaXZlbk5hbWU6c3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBGcXRUcmF2ZWxlciB7XG4gICAgICAgIHB1YmxpYyBQcm9ncmFtSUQ6IHN0cmluZyA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBNZW1iZXJzaGlwSUQ6IHN0cmluZyA9IG51bGw7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFNlZ21lbnRMaXN0IHtcbiAgICAgICAgcHVibGljIFJQSDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIERlcGFydHVyZURhdGVUaW1lOiBEYXRlID0gbnVsbDtcbiAgICAgICAgLy9wdWJsaWMgQXJyaXZhbFRpbWU6IERhdGUgPSBudWxsO1xuICAgICAgICBwdWJsaWMgTWFya2V0aW5nRmxpZ2h0OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgRGVwYXJ0dXJlQ2l0eTogc3RyaW5nID0gbnVsbDtcbiAgICAgICAgLy8gcHVibGljIEdhdGU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIC8vcHVibGljIEJvYXJkaW5nVGltZTogRGF0ZSA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBTZWxlY3RlZDpib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgcHVibGljIEFycml2YWxDaXR5OnN0cmluZz1cIlwiO1xuICAgICAgICBwdWJsaWMgT3JkZXJJZDpzdHJpbmc7XG4gICAgfVxuXG5cbn1cblxuXG5leHBvcnQgbW9kdWxlIEJhZ1RhZ1ByaW50IHtcbiAgICBcbiAgICAgICAgZXhwb3J0IGNsYXNzIFJvb3RPYmplY3Qge1xuICAgICAgICAgICAgcHVibGljIFNvdXJjZTpzdHJpbmcgPSBcIlRhYlwiO1xuICAgICAgICAgICAgcHVibGljIERlbGl2ZXJ5RGV0YWlsOiBCb2FyZGluZ1Bhc3NEZWxpdmVyeURldGFpbDtcbiAgICAgICAgICAgIHB1YmxpYyBTZWdtZW50czogQXJyYXk8U2VnbWVudExpc3Q+ID0gW107XG4gICAgICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyczogQXJyYXk8UGFzc2VuZ2VyTGlzdD4gPSBbXTtcbiAgICBcbiAgICAgICAgfVxuICAgICAgICBleHBvcnQgY2xhc3MgQm9hcmRpbmdQYXNzRGVsaXZlcnlEZXRhaWwge1xuICAgICAgICAgICAgcHVibGljIEdhdGV3YXk6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICBwdWJsaWMgRW1haWw6IHN0cmluZyA9IG51bGw7XG4gICAgICAgICAgICBwdWJsaWMgUHJpbnRlckFkZHJlc3M6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICBwdWJsaWMgUHJpbnRlcjogUHJpbnRlcjtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnQgY2xhc3MgUHJpbnRlciB7XG4gICAgICAgICAgICBwdWJsaWMgQ2xpZW50Q29kZTogc3RyaW5nO1xuICAgICAgICAgICAgcHVibGljIE9mZmljZU5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIHB1YmxpYyBEZXZpY2VOYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwdWJsaWMgV29ya3N0YXRpb25OYW1lOiBzdHJpbmc7XG4gICAgICAgICAgICBwdWJsaWMgUGVjdGFiVmVyc2lvbjogc3RyaW5nO1xuICAgICAgICAgICAgcHVibGljIERldmljZVR5cGU6c3RyaW5nO1xuICAgIFxuICAgICAgICB9XG4gICAgXG4gICAgICAgIGV4cG9ydCBjbGFzcyBQYXNzZW5nZXJMaXN0IHtcbiAgICAgICAgICAgIHB1YmxpYyBQYXNzZW5nZXJUeXBlQ29kZTpzdHJpbmcgPVwiXCI7XG4gICAgICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyUmVmTnVtYmVyOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgcHVibGljIEZxdFRyYXZlbGVyczogQXJyYXk8RnF0VHJhdmVsZXI+ID0gW107XG4gICAgICAgICAgICBwdWJsaWMgT3JkZXJJZDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIHB1YmxpYyBDaGVja2VkQmFnQ291bnQ6bnVtYmVyPTE7XG4gICAgICAgICAgICBwdWJsaWMgUlBIOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgcHVibGljIEZpcnN0bmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIHB1YmxpYyBMYXN0bmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIHB1YmxpYyBTZWxlY3RlZDpib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgICAgIHB1YmxpYyBBc3NvY2lhdGVkSW5mYW50UlBIOnN0cmluZz1udWxsO1xuICAgICAgICAgICAgcHVibGljIENoZWNraW5BaXJwb3J0Q29kZTpzdHJpbmc9XCJcIjtcbiAgICAgICAgICAgIHB1YmxpYyBDaGVja2VkQmFnczpBcnJheTxDaGVja2VkQmFncz49W107XG4gICAgICAgICAgICBwdWJsaWMgQ2hlY2tJbkJhZ0NvdW50VG90YWw6c3RyaW5nPVwiXCI7XG4gICAgICAgICAgICBwdWJsaWMgQ2hlY2tJbkJhZ1dlaWdodFRvdGFsOmFueTtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnQgY2xhc3MgQ2hlY2tlZEJhZ3NcbiAgICAgICAge1xuICAgICAgICAgICAgcHVibGljIEJhZ2dhZ2VJbmZvOkJhZ2dhZ2VJbmZvO1xuICAgICAgICAgICAgcHVibGljIENhbmNlbE9wZXJhdGlvbjpib29sZWFuID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBleHBvcnQgY2xhc3MgQmFnZ2FnZUluZm8ge1xuICAgICAgICAgICAgcHVibGljIEJhZ1RhZ0RldGFpbHM6IEFycmF5PEJhZ1RhZ0RldGFpbD4gPSBbXTtcbiAgICAgICAgICAgIHB1YmxpYyBDaGVja2VkQmFnV2VpZ2h0VG90YWw6IHN0cmluZztcbiAgICAgICAgICAgIHB1YmxpYyBVbml0T2ZNZWFzdXJlQ29kZTogc3RyaW5nO1xuICAgICAgICAgICAgcHVibGljIENoZWNrZWRCYWdDb3VudFRvdGFsOiBzdHJpbmc7XG4gICAgICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyUlBIOnN0cmluZz1cIlwiO1xuICAgICAgICAgIH1cblxuICAgICAgICBleHBvcnQgY2xhc3MgQmFnVGFnRGV0YWlsIHtcbiAgICAgICAgICAgIHB1YmxpYyBCYWdUYWdUeXBlOiBzdHJpbmc7XG4gICAgICAgICAgICBwdWJsaWMgU2VyaWFsTnVtYmVyPzogYW55O1xuICAgICAgICAgICAgcHVibGljIEJhZ1RhZ0NvdW50OiBzdHJpbmc7XG4gICAgICAgICAgICBwdWJsaWMgQ2FycmllckNvZGU6IHN0cmluZztcbiAgICAgICAgICAgIHB1YmxpYyBJc3N1ZXJDb2RlOiBzdHJpbmc7XG4gICAgICAgICAgICBwdWJsaWMgV2VpZ2h0VG9EZWxldGU6IHN0cmluZztcbiAgICAgICAgICAgIHB1YmxpYyBXZWlnaHRUb0RlbGV0ZV9FZGl0YWJsZTogYm9vbGVhbjtcbiAgICAgICAgICAgIHB1YmxpYyBTZWdtZW50UlBIOiBzdHJpbmc7XG4gICAgICAgIFxuICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgZXhwb3J0IGNsYXNzIEZxdFRyYXZlbGVyIHtcbiAgICAgICAgICAgIHB1YmxpYyBQcm9ncmFtSUQ6IHN0cmluZyA9IG51bGw7XG4gICAgICAgICAgICBwdWJsaWMgTWVtYmVyc2hpcElEOiBzdHJpbmcgPSBudWxsO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTZWdtZW50TGlzdCB7XG4gICAgICAgICAgICBwdWJsaWMgUlBIOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgcHVibGljIERlcGFydHVyZURhdGVUaW1lOiBEYXRlID0gbnVsbDtcbiAgICAgICAgICAgIHB1YmxpYyBBcnJpdmFsRGF0ZVRpbWU6IERhdGUgPSBudWxsO1xuICAgICAgICAgICAgcHVibGljIE1hcmtldGluZ0ZsaWdodDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIHB1YmxpYyBEZXBhcnR1cmVDaXR5OiBzdHJpbmcgPSBudWxsO1xuICAgICAgICAgICAgcHVibGljIE9wZXJhdGluZ0ZsaWdodDpzdHJpbmc9bnVsbDtcbiAgICAgICAgICAgIHB1YmxpYyBTZWxlY3RlZDpib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgICAgIHB1YmxpYyBHYXRlOiBzdHJpbmcgPSBudWxsO1xuICAgICAgICAgICAgcHVibGljIEJvYXJkaW5nVGltZTogRGF0ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICBcbiAgICBcbiAgICB9XG5cblxuZXhwb3J0IG1vZHVsZSBQcmludGVyRGV2aWNlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBEZXZpY2Uge1xuICAgICAgICBwdWJsaWMgRGV2aWNlTmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIERldmljZVR5cGU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBEZXNjcmlwdGlvbjogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFN0YXR1czogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFF1ZXVlQ291bnQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBQb3J0OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgUGVjdGFiOiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgd29ya3N0YXRpb25OYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgIH1cblxuXG5cbn1cblxuZXhwb3J0IG1vZHVsZSBJbnRlcmxpbmVUaHJvdWdoQ2hlY2tpbiB7XG4gICAgIGV4cG9ydCBjbGFzcyBTZWdtZW50TGlzdCB7XG4gICAgICAgICBwdWJsaWMgUlBIOiBzdHJpbmc7XG4gICAgICAgICBwdWJsaWMgRGVwYXJ0dXJlRGF0ZVRpbWU6IERhdGU7XG4gICAgICAgICBwdWJsaWMgTWFya2V0aW5nRmxpZ2h0OiBzdHJpbmc7XG4gICAgICAgICBwdWJsaWMgU2VsZWN0ZWQ6IGJvb2xlYW47XG4gICAgICAgICBwdWJsaWMgRGVwYXJ0dXJlQ2l0eTogc3RyaW5nO1xuICAgICAgICAgcHVibGljIE9yZGVySWQ6c3RyaW5nO1xuICAgICB9XG4gICAgZXhwb3J0IGNsYXNzIEZxdFRyYXZlbGVyIHtcbiAgICAgICAgcHVibGljIFByb2dyYW1JRD86IGFueTtcbiAgICAgICAgcHVibGljIE1lbWJlcnNoaXBJRD86IGFueTtcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIEZsaWdodE51bWJlciB7XG4gICAgICAgIHB1YmxpYyBBaXJsaW5lQ29kZTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgTnVtYmVyOiBzdHJpbmc7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBTZWF0TGlzdCB7XG4gICAgICAgIHB1YmxpYyBTZWF0TnVtYmVyPzogYW55O1xuICAgICAgICBwdWJsaWMgQ2FiaW4/OiBhbnk7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBGcXRUcmF2ZWxlcjIge1xuICAgICAgICBwdWJsaWMgTWVtYmVyc2hpcElEPzogYW55O1xuICAgICAgICBwdWJsaWMgUHJvZ3JhbUlEOiBzdHJpbmc7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBPdXRCb3VuZENvbm5lY3RpbmdGbGlnaHRJbmZvIHtcbiAgICAgICAgcHVibGljIEZsaWdodFJQSDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgRmxpZ2h0TnVtYmVyOiBBcnJheTxGbGlnaHROdW1iZXI+ID0gW107XG4gICAgICAgIHB1YmxpYyBBY3R1YWxEZXBhcnR1cmVEYXRlVGltZTogRGF0ZTtcbiAgICAgICAgcHVibGljIERlcGFydHVyZUNvZGU6IHN0cmluZztcbiAgICAgICAgcHVibGljIEFycml2YWxDb2RlOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBTZWF0TGlzdDogQXJyYXk8U2VhdExpc3Q+ID0gW107XG4gICAgICAgIHB1YmxpYyBSZXNCb29rRGVzaWdDb2RlOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBGcXRUcmF2ZWxlcnM6IEFycmF5PEZxdFRyYXZlbGVyMj4gPSBbXTtcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIFBhc3Nlbmdlckxpc3Qge1xuICAgICAgICBwdWJsaWMgR2l2ZW5OYW1lOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBTdXJuYW1lOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBFbWFpbHM6IGFueVtdO1xuICAgICAgICBwdWJsaWMgUGFzc2VuZ2VyVHlwZUNvZGU6IHN0cmluZztcbiAgICAgICAgcHVibGljIFBhc3NlbmdlclJlZk51bWJlcjogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgUGhvbmVOdW1iZXJzOiBhbnlbXTtcbiAgICAgICAgcHVibGljIEZxdFRyYXZlbGVyczogQXJyYXk8RnF0VHJhdmVsZXI+ID0gW107XG4gICAgICAgIHB1YmxpYyBFbWVyZ2VuY3lEZXRhaWxzOiBhbnlbXTtcbiAgICAgICAgcHVibGljIFN0YXR1czogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgT3JkZXJJZDogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgQ2hlY2tlZEJhZ0NvdW50OiBudW1iZXI7XG4gICAgICAgIHB1YmxpYyBPdXRCb3VuZENvbm5lY3RpbmdGbGlnaHRJbmZvOiBBcnJheTxPdXRCb3VuZENvbm5lY3RpbmdGbGlnaHRJbmZvPiA9IFtdO1xuICAgICAgICBwdWJsaWMgUmVzQm9va0Rlc2lnQ29kZTogc3RyaW5nO1xuICAgICAgICBwdWJsaWMgUlBIOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBGaXJzdG5hbWU6IHN0cmluZztcbiAgICAgICAgcHVibGljIExhc3RuYW1lOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBTZWxlY3RlZDogYm9vbGVhbjtcbiAgICAgICAgcHVibGljIEFzc29jaWF0ZWRJbmZhbnRSUEg/OiBhbnk7XG4gICAgICAgIHB1YmxpYyBJc0JhZ2dhZ2VDaGVja2VkOmFueTtcbiAgICAgICAgcHVibGljIFN1cm5hbWVSZWZOdW1iZXI6c3RyaW5nO1xuICAgICAgICBwdWJsaWMgU3VybmFtZVJlZk51bWJlckNvdW50Om51bWJlcjtcbiAgICAgICAgcHVibGljIGFkZFBhcnRpYWxNZW1iZXI6Ym9vbGVhbjtcbiAgICAgICAgcHVibGljIENoZWNrZWRCYWdzPzphbnk7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBSb290T2JqZWN0IHtcbiAgICAgICAgcHVibGljIENoZWNrSW5UeXBlOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBTZWdtZW50TGlzdDogQXJyYXk8U2VnbWVudExpc3Q+ID0gW107XG4gICAgICAgIHB1YmxpYyBQYXNzZW5nZXJMaXN0OiBBcnJheTxQYXNzZW5nZXJMaXN0PiA9IFtdO1xuICAgICAgICBwdWJsaWMgU291cmNlOnN0cmluZyA9IFwiXCI7XG4gICAgICAgIHB1YmxpYyBCbHVldG9vdGhCYWdUYWc6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgQm9hcmRpbmdQYXNzRGVsaXZlcnlEZXRhaWw6IEFycmF5PEJvYXJkaW5nUGFzc0RlbGl2ZXJ5RGV0YWlsPiA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBpc01hbnVhbEJhZzpib29sZWFuOyAgICAgICAgXG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBCb2FyZGluZ1Bhc3NEZWxpdmVyeURldGFpbCB7XG4gICAgICAgIHB1YmxpYyBHYXRld2F5OiBzdHJpbmcgPSBcIlwiO1xuICAgICAgICBwdWJsaWMgRW1haWw6IHN0cmluZyA9IG51bGw7XG4gICAgICAgIHB1YmxpYyBQcmludGVyQWRkcmVzczogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgcHVibGljIFByaW50ZXI6IFByaW50ZXI7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBQcmludGVyIHtcbiAgICAgICAgcHVibGljIENsaWVudENvZGU6IHN0cmluZz1cIlwiO1xuICAgICAgICBwdWJsaWMgT2ZmaWNlTmFtZTogc3RyaW5nPVwiXCI7XG4gICAgICAgIHB1YmxpYyBEZXZpY2VOYW1lOiBzdHJpbmc9XCJcIjtcbiAgICAgICAgcHVibGljIFdvcmtzdGF0aW9uTmFtZTogc3RyaW5nPVwiXCI7XG4gICAgICAgIHB1YmxpYyBQZWN0YWJWZXJzaW9uOiBzdHJpbmc9XCJcIjtcbiAgICAgICAgcHVibGljIERldmljZVR5cGU6c3RyaW5nPVwiXCI7XG5cbiAgICB9XG594oCLXG5leHBvcnQgbW9kdWxlIFByaW50ZXJEZXZpY2VNb2RlbCB7XG4gICAgXG4gICAgICAgIGV4cG9ydCBjbGFzcyBEZXZpY2Uge1xuICAgICAgICAgICAgcHVibGljIElzU2VsZWN0ZWREZXZpY2UgOmJvb2xlYW4gPWZhbHNlO1xuICAgICAgICAgICAgcHVibGljIERldmljZU5hbWU6IHN0cmluZyA9XCJcIjtcbiAgICAgICAgICAgIHB1YmxpYyBEZXZpY2VUeXBlOiBzdHJpbmcgPVwiXCI7XG4gICAgICAgICAgICBwdWJsaWMgRGVzY3JpcHRpb246IHN0cmluZyA9XCJcIjtcbiAgICAgICAgICAgIHB1YmxpYyBTdGF0dXM6IHN0cmluZyA9XCJcIjtcbiAgICAgICAgICAgIHB1YmxpYyBRdWV1ZUNvdW50OiBzdHJpbmcgPVwiXCI7XG4gICAgICAgICAgICBwdWJsaWMgUG9ydDogc3RyaW5nID1cIlwiO1xuICAgICAgICAgICAgcHVibGljIFBlY3RhYjogc3RyaW5nID1cIlwiO1xuICAgICAgICAgICAgcHVibGljIFBlY3RhYlR5cGU6IHN0cmluZyA9XCJcIjtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBleHBvcnQgY2xhc3MgV29ya3N0YXRpb24ge1xuICAgICAgICAgICAgcHVibGljIGRldmljZTogQXJyYXk8RGV2aWNlPj1bXTtcbiAgICAgICAgICAgIHB1YmxpYyB3b3Jrc3RhdGlvbk5hbWU6IHN0cmluZyA9XCJcIjtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBleHBvcnQgY2xhc3MgUm9vdE9iamVjdCB7XG4gICAgICAgICAgICBwdWJsaWMgd29ya3N0YXRpb246IEFycmF5PFdvcmtzdGF0aW9uPj1bXTtcbiAgICAgICAgfVxuICAgIFxuICAgIH0iXX0=