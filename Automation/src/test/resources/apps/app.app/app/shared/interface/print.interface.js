"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrintResponse;
(function (PrintResponse) {
    // export class ClientViewModel {
    //     BaggageInfo?: any;
    //     MessageFunction: number;
    // }
    // export class PhoneNumber {
    //     IsRefValue: boolean;
    //     Type: string;
    //     TypeText: string;
    //     TechTypeText: string;
    //     Value: string;
    //     Operation?: any;
    //     OSIText?: any;
    //     CarrierCode?: any;
    //     Remark?: any;
    //     AreaCityCode?: any;
    // }
    // export class BagTagDetail {
    //     BagTagType: string;
    //     SerialNumber?: any;
    //     BagTagCount: string;
    //     CarrierCode: string;
    //     IssuerCode: string;
    //     WeightToDelete: string;
    //     WeightToDelete_Editable: boolean;
    //     SegmentRPH: string;
    //     ShortCheckAirportCode: string;
    // }
    // export class BaggageInfo {
    //     BagTagDetails: BagTagDetail[];
    //     CheckedBagWeightTotal: string;
    //     UnitOfMeasureCode: string;
    //     CheckedBagCountTotal: string;
    // }
    // export class CheckedBag {
    //     BaggageInfo: BaggageInfo;
    //     CancelOperation: boolean;
    //     MessageFunction: number;
    // }
    // export class PassengerList {
    //     PhoneNumbers: PhoneNumber[];
    //     FqtTravelers: any[];
    //     CheckedBags: CheckedBag[];
    //     Firstname: string;
    //     Lastname: string;
    //     SurnameRefNumber: string;
    //     Prefix?: any;
    //     RPH: string;
    //     OrderId: string;
    //     Emails: any[];
    //     PassengerTypeCode: string;
    //     DateOfBirth?: any;
    //     Age?: any;
    //     AssociatedAdultRPH?: any;
    //     AssociatedInfantRPH?: any;
    //     Nationality?: any;
    //     EmergencyDetails: any[];
    //     CheckInBagCountTotal: string;
    //     CheckInBagWeightTotal: string;
    //     Selected: boolean;
    //     GivenNameRefNumber: number;
    // }
    // export class FlightCheckIn {
    //     CheckInStatus: string;
    // }
    // export class FlightInfo {
    //     ScheduledDepartureTime: Date;
    //     ScheduledArrivalTime: Date;
    //     ScheduledArrivalDiffDays: number;
    //     EstimatedOrActualDepartureType: string;
    //     EstimatedOrActualDepartureTime: Date;
    //     EstimatedOrActualDepartureDiffDays: number;
    //     EstimatedOrActualArrivalType: string;
    //     EstimatedOrActualArrivalTime: Date;
    //     EstimatedOrActualArrivalDiffDays: number;
    //     DepartureDelay: string;
    //     ArrivalDelay: string;
    //     FlightStatus: string;
    //     TimeAtLayover?: any;
    //     TimeToBoard: string;
    //     DepartureTerminalGateLabel: string;
    //     DepartureTerminalGate: string;
    //     ArrivalTerminalGateLabel: string;
    //     ArrivalTerminalGate?: any;
    //     AircraftTailNumberLabel: string;
    //     AircraftTailNumber: string;
    //     Equipment: string;
    //     DepartureCode: string;
    //     ArrivalCode: string;
    //     MarketingFlightList: string[];
    //     FlightType: string;
    // }
    // export class SegmentList {
    //     RPH: string;
    //     DepartureDateTime: Date;
    //     ArrivalDateTime: Date;
    //     MarketingFlight: string;
    //     DepartureCity: string;
    //     OperatingFlight?: any;
    //     StatusCategory: string;
    //     RBD: string;
    //     OriginRBD?: any;
    //     UpgradeRBD?: any;
    //     UpgradeType: number;
    //     Cabin?: any;
    //     PassengerRPHs: string;
    //     SegmentRPH: string;
    //     FlightCheckIn: FlightCheckIn;
    //     FlightInfo: FlightInfo[];
    //     Selected: boolean;
    //     IsThroughOrChangeOfGaugeFlight?: any;
    // }
    // export class SegmentTravelerInfo {
    //     PassengerRPH: string;
    //     SegmentRPH: string;
    //     Seats?: any;
    //     PassengerFullName: string;
    //     Selected: boolean;
    // }
    // export class Printer {
    //     ClientCode: string;
    //     OfficeName: string;
    //     DeviceName: string;
    //     WorkstationName: string;
    //     PectabVersion: string;
    //     DeviceType: string;
    // }
    // export class DeliveryDetail {
    //     Gateway: string;
    //     Email?: any;
    //     PrinterAddress: string;
    //     Printer: Printer;
    // }
    // export class AddManualBagTagRequest {
    //     ID: string;
    //     CheckInType: string;
    //     ClientViewModel: ClientViewModel;
    //     PassengerList: PassengerList[];
    //     SegmentList: SegmentList[];
    //     SegmentTravelerInfo: SegmentTravelerInfo[];
    //     Source: string;
    //     CheckInMessageFunctionType: string;
    //     DeliveryDetail: DeliveryDetail;
    // }
    // export class BagTagDetail2 {
    //     BagTagType: number;
    //     IsAutoBag?: any;
    //     SerialNumber: string;
    //     BagTagCount: number;
    //     CarrierCode: string;
    //     IssuerCode?: any;
    //     WeightToDelete?: any;
    //     WeightToDelete_Editable: boolean;
    //     SegmentRPH?: any;
    //     SegmentTravelerInfos?: any;
    //     ManualBagTag?: any;
    //     BagTagPrintResponse?: any;
    //     BluetoothPrintStatus: boolean;
    //     Success: boolean;
    //     Errors?: any;
    //     Information?: any;
    //     Warnings?: any;
    // }
    // export class BaggageInfo2 {
    //     CheckedBagCountTotal: string;
    //     HandBagCountTotal?: any;
    //     UnitOfMeasureQuantity: number;
    //     UnitOfMeasureCode: string;
    //     BagTagDetails: BagTagDetail2[];
    //     BagNumberToDelete?: any;
    //     BagWeightToDelete?: any;
    //     SegmentRPH?: any;
    //     BaggageRules?: any;
    //     BaggageAllowance?: any;
    // }
    // export class SegmentTravelerInfo2 {
    //     GivenName: string;
    //     LastName: string;
    //     OrderId: string;
    //     IsWheelChair: boolean;
    //     PassengerRPH: string;
    //     SegmentRPH: string;
    //     Services?: any;
    //     PaidServices?: any;
    //     Seats?: any;
    //     CheckinInfos?: any;
    //     BaggageInfo: BaggageInfo2;
    //     TicketNumbers?: any;
    //     ShortPassDesc?: any;
    //     PassengerFullName?: any;
    //     Selected: boolean;
    //     SecurityCode?: any;
    //     SecurityCodeDesc?: any;
    //     PassengerRefNumber?: any;
    //     CheckinPassengerTypeCode?: any;
    //     CheckinPassengerTypeCodeDesc?: any;
    //     MultiInitialPassengerTypes?: any;
    //     ConnectingFlightSeats: any[];
    // }
    // export class FlightSegment {
    //     RPH: number;
    //     CarrierCode: string;
    //     FlightNumber: string;
    //     DepartureDate: Date;
    //     From: string;
    //     To: string;
    //     IsVoid: boolean;
    //     IsOpen: boolean;
    // }
    // export class BaggageDetail {
    //     BagTagType: number;
    //     IsAutoBag?: any;
    //     SerialNumber: string;
    //     BagTagCount: number;
    //     CarrierCode: string;
    //     IssuerCode?: any;
    //     WeightToDelete?: any;
    //     WeightToDelete_Editable: boolean;
    //     SegmentRPH?: any;
    //     SegmentTravelerInfos?: any;
    //     ManualBagTag?: any;
    //     BagTagPrintResponse?: any;
    //     BluetoothPrintStatus: boolean;
    //     Success: boolean;
    //     Errors?: any;
    //     Information?: any;
    //     Warnings?: any;
    // }
    // export class BaggageInfo3 {
    //     PassengerRPH: number;
    //     CheckedBagCountTotal: number;
    //     CheckedBagWeightTotal: number;
    //     UnitOfMeasureCode: string;
    //     BaggageDetails: BaggageDetail[];
    // }
    // export class ManualBagTag {
    //     MessageFunction: string;
    //     FlightSegments: FlightSegment[];
    //     PassengerInfo?: any;
    //     PassengerFlightInfo?: any;
    //     BaggageInfo: BaggageInfo3;
    //     CancelOperation: boolean;
    // }
    // export class BagTagOutput {
    //     RequestId?: any;
    //     Status?: any;
    //     JobId?: any;
    //     PrinterStatus?: any;
    //     Expectedtimetodeliver?: any;
    //     Message?: any;
    //     Errors?: any;
    //     PicRawData: string;
    //     Success: boolean;
    //     Information?: any;
    //     Warnings?: any;
    // }
    // export class BagTagPrintResponse {
    //     BoardingPassOutput?: any;
    //     BagTagOutput: BagTagOutput[];
    //     Success: boolean;
    //     Errors?: any;
    //     Information?: any;
    //     Warnings?: any;
    // }
    // export class Warning {
    //     RecordID: string;
    //     RPH?: any;
    //     Tag: string;
    //     Message: string;
    //     Status: boolean;
    // }
    // export class BagTagVMDetails {
    //     BagTagType: number;
    //     IsAutoBag?: any;
    //     SerialNumber?: any;
    //     BagTagCount: number;
    //     CarrierCode?: any;
    //     IssuerCode?: any;
    //     WeightToDelete?: any;
    //     WeightToDelete_Editable: boolean;
    //     SegmentRPH?: any;
    //     SegmentTravelerInfos: SegmentTravelerInfo2[];
    //     ManualBagTag: ManualBagTag;
    //     BagTagPrintResponse: BagTagPrintResponse;
    //     Success: boolean;
    //     Errors?: any;
    //     Information?: any;
    //     Warnings: Warning[];
    // }
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    PrintResponse.RootObject = RootObject;
})(PrintResponse = exports.PrintResponse || (exports.PrintResponse = {}));
var CheckinPrintResponse;
(function (CheckinPrintResponse) {
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    CheckinPrintResponse.RootObject = RootObject;
})(CheckinPrintResponse = exports.CheckinPrintResponse || (exports.CheckinPrintResponse = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbnQuaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJpbnQuaW50ZXJmYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBYyxhQUFhLENBZ1UxQjtBQWhVRCxXQUFjLGFBQWE7SUFFdkIsaUNBQWlDO0lBQ2pDLHlCQUF5QjtJQUN6QiwrQkFBK0I7SUFDL0IsSUFBSTtJQUVKLDZCQUE2QjtJQUM3QiwyQkFBMkI7SUFDM0Isb0JBQW9CO0lBQ3BCLHdCQUF3QjtJQUN4Qiw0QkFBNEI7SUFDNUIscUJBQXFCO0lBQ3JCLHVCQUF1QjtJQUN2QixxQkFBcUI7SUFDckIseUJBQXlCO0lBQ3pCLG9CQUFvQjtJQUNwQiwwQkFBMEI7SUFDMUIsSUFBSTtJQUVKLDhCQUE4QjtJQUM5QiwwQkFBMEI7SUFDMUIsMEJBQTBCO0lBQzFCLDJCQUEyQjtJQUMzQiwyQkFBMkI7SUFDM0IsMEJBQTBCO0lBQzFCLDhCQUE4QjtJQUM5Qix3Q0FBd0M7SUFDeEMsMEJBQTBCO0lBQzFCLHFDQUFxQztJQUNyQyxJQUFJO0lBRUosNkJBQTZCO0lBQzdCLHFDQUFxQztJQUNyQyxxQ0FBcUM7SUFDckMsaUNBQWlDO0lBQ2pDLG9DQUFvQztJQUNwQyxJQUFJO0lBRUosNEJBQTRCO0lBQzVCLGdDQUFnQztJQUNoQyxnQ0FBZ0M7SUFDaEMsK0JBQStCO0lBQy9CLElBQUk7SUFFSiwrQkFBK0I7SUFDL0IsbUNBQW1DO0lBQ25DLDJCQUEyQjtJQUMzQixpQ0FBaUM7SUFDakMseUJBQXlCO0lBQ3pCLHdCQUF3QjtJQUN4QixnQ0FBZ0M7SUFDaEMsb0JBQW9CO0lBQ3BCLG1CQUFtQjtJQUNuQix1QkFBdUI7SUFDdkIscUJBQXFCO0lBQ3JCLGlDQUFpQztJQUNqQyx5QkFBeUI7SUFDekIsaUJBQWlCO0lBQ2pCLGdDQUFnQztJQUNoQyxpQ0FBaUM7SUFDakMseUJBQXlCO0lBQ3pCLCtCQUErQjtJQUMvQixvQ0FBb0M7SUFDcEMscUNBQXFDO0lBQ3JDLHlC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aUNBQWlDO0lBQ2pDLDBCQUEwQjtJQUMxQix1QkFBdUI7SUFDdkIsMEJBQTBCO0lBQzFCLDJCQUEyQjtJQUMzQix5QkFBeUI7SUFDekIsd0JBQXdCO0lBQ3hCLDRCQUE0QjtJQUM1Qix3Q0FBd0M7SUFDeEMsd0JBQXdCO0lBQ3hCLG9EQUFvRDtJQUNwRCxrQ0FBa0M7SUFDbEMsZ0RBQWdEO0lBQ2hELHdCQUF3QjtJQUN4QixvQkFBb0I7SUFDcEIseUJBQXlCO0lBQ3pCLDJCQUEyQjtJQUMzQixJQUFJO0lBRUo7UUFBQTtRQUlBLENBQUM7UUFBRCxpQkFBQztJQUFELENBQUMsQUFKRCxJQUlDO0lBSlksd0JBQVUsYUFJdEIsQ0FBQTtBQUVMLENBQUMsRUFoVWEsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUFnVTFCO0FBRUQsSUFBYyxvQkFBb0IsQ0FRakM7QUFSRCxXQUFjLG9CQUFvQjtJQUU5QjtRQUFBO1FBSUEsQ0FBQztRQUFELGlCQUFDO0lBQUQsQ0FBQyxBQUpELElBSUM7SUFKWSwrQkFBVSxhQUl0QixDQUFBO0FBRUwsQ0FBQyxFQVJhLG9CQUFvQixHQUFwQiw0QkFBb0IsS0FBcEIsNEJBQW9CLFFBUWpDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IG1vZHVsZSBQcmludFJlc3BvbnNlIHtcblxuICAgIC8vIGV4cG9ydCBjbGFzcyBDbGllbnRWaWV3TW9kZWwge1xuICAgIC8vICAgICBCYWdnYWdlSW5mbz86IGFueTtcbiAgICAvLyAgICAgTWVzc2FnZUZ1bmN0aW9uOiBudW1iZXI7XG4gICAgLy8gfVxuXG4gICAgLy8gZXhwb3J0IGNsYXNzIFBob25lTnVtYmVyIHtcbiAgICAvLyAgICAgSXNSZWZWYWx1ZTogYm9vbGVhbjtcbiAgICAvLyAgICAgVHlwZTogc3RyaW5nO1xuICAgIC8vICAgICBUeXBlVGV4dDogc3RyaW5nO1xuICAgIC8vICAgICBUZWNoVHlwZVRleHQ6IHN0cmluZztcbiAgICAvLyAgICAgVmFsdWU6IHN0cmluZztcbiAgICAvLyAgICAgT3BlcmF0aW9uPzogYW55O1xuICAgIC8vICAgICBPU0lUZXh0PzogYW55O1xuICAgIC8vICAgICBDYXJyaWVyQ29kZT86IGFueTtcbiAgICAvLyAgICAgUmVtYXJrPzogYW55O1xuICAgIC8vICAgICBBcmVhQ2l0eUNvZGU/OiBhbnk7XG4gICAgLy8gfVxuXG4gICAgLy8gZXhwb3J0IGNsYXNzIEJhZ1RhZ0RldGFpbCB7XG4gICAgLy8gICAgIEJhZ1RhZ1R5cGU6IHN0cmluZztcbiAgICAvLyAgICAgU2VyaWFsTnVtYmVyPzogYW55O1xuICAgIC8vICAgICBCYWdUYWdDb3VudDogc3RyaW5nO1xuICAgIC8vICAgICBDYXJyaWVyQ29kZTogc3RyaW5nO1xuICAgIC8vICAgICBJc3N1ZXJDb2RlOiBzdHJpbmc7XG4gICAgLy8gICAgIFdlaWdodFRvRGVsZXRlOiBzdHJpbmc7XG4gICAgLy8gICAgIFdlaWdodFRvRGVsZXRlX0VkaXRhYmxlOiBib29sZWFuO1xuICAgIC8vICAgICBTZWdtZW50UlBIOiBzdHJpbmc7XG4gICAgLy8gICAgIFNob3J0Q2hlY2tBaXJwb3J0Q29kZTogc3RyaW5nO1xuICAgIC8vIH1cblxuICAgIC8vIGV4cG9ydCBjbGFzcyBCYWdnYWdlSW5mbyB7XG4gICAgLy8gICAgIEJhZ1RhZ0RldGFpbHM6IEJhZ1RhZ0RldGFpbFtdO1xuICAgIC8vICAgICBDaGVja2VkQmFnV2VpZ2h0VG90YWw6IHN0cmluZztcbiAgICAvLyAgICAgVW5pdE9mTWVhc3VyZUNvZGU6IHN0cmluZztcbiAgICAvLyAgICAgQ2hlY2tlZEJhZ0NvdW50VG90YWw6IHN0cmluZztcbiAgICAvLyB9XG5cbiAgICAvLyBleHBvcnQgY2xhc3MgQ2hlY2tlZEJhZyB7XG4gICAgLy8gICAgIEJhZ2dhZ2VJbmZvOiBCYWdnYWdlSW5mbztcbiAgICAvLyAgICAgQ2FuY2VsT3BlcmF0aW9uOiBib29sZWFuO1xuICAgIC8vICAgICBNZXNzYWdlRnVuY3Rpb246IG51bWJlcjtcbiAgICAvLyB9XG5cbiAgICAvLyBleHBvcnQgY2xhc3MgUGFzc2VuZ2VyTGlzdCB7XG4gICAgLy8gICAgIFBob25lTnVtYmVyczogUGhvbmVOdW1iZXJbXTtcbiAgICAvLyAgICAgRnF0VHJhdmVsZXJzOiBhbnlbXTtcbiAgICAvLyAgICAgQ2hlY2tlZEJhZ3M6IENoZWNrZWRCYWdbXTtcbiAgICAvLyAgICAgRmlyc3RuYW1lOiBzdHJpbmc7XG4gICAgLy8gICAgIExhc3RuYW1lOiBzdHJpbmc7XG4gICAgLy8gICAgIFN1cm5hbWVSZWZOdW1iZXI6IHN0cmluZztcbiAgICAvLyAgICAgUHJlZml4PzogYW55O1xuICAgIC8vICAgICBSUEg6IHN0cmluZztcbiAgICAvLyAgICAgT3JkZXJJZDogc3RyaW5nO1xuICAgIC8vICAgICBFbWFpbHM6IGFueVtdO1xuICAgIC8vICAgICBQYXNzZW5nZXJUeXBlQ29kZTogc3RyaW5nO1xuICAgIC8vICAgICBEYXRlT2ZCaXJ0aD86IGFueTtcbiAgICAvLyAgICAgQWdlPzogYW55O1xuICAgIC8vICAgICBBc3NvY2lhdGVkQWR1bHRSUEg/OiBhbnk7XG4gICAgLy8gICAgIEFzc29jaWF0ZWRJbmZhbnRSUEg/OiBhbnk7XG4gICAgLy8gICAgIE5hdGlvbmFsaXR5PzogYW55O1xuICAgIC8vICAgICBFbWVyZ2VuY3lEZXRhaWxzOiBhbnlbXTtcbiAgICAvLyAgICAgQ2hlY2tJbkJhZ0NvdW50VG90YWw6IHN0cmluZztcbiAgICAvLyAgICAgQ2hlY2tJbkJhZ1dlaWdodFRvdGFsOiBzdHJpbmc7XG4gICAgLy8gICAgIFNlbGVjdGVkOiBib29sZWFuO1xuICAgIC8vICAgICBHaXZlbk5hbWVSZWZOdW1iZXI6IG51bWJlcjtcbiAgICAvLyB9XG5cbiAgICAvLyBleHBvcnQgY2xhc3MgRmxpZ2h0Q2hlY2tJbiB7XG4gICAgLy8gICAgIENoZWNrSW5TdGF0dXM6IHN0cmluZztcbiAgICAvLyB9XG5cbiAgICAvLyBleHBvcnQgY2xhc3MgRmxpZ2h0SW5mbyB7XG4gICAgLy8gICAgIFNjaGVkdWxlZERlcGFydHVyZVRpbWU6IERhdGU7XG4gICAgLy8gICAgIFNjaGVkdWxlZEFycml2YWxUaW1lOiBEYXRlO1xuICAgIC8vICAgICBTY2hlZHVsZWRBcnJpdmFsRGlmZkRheXM6IG51bWJlcjtcbiAgICAvLyAgICAgRXN0aW1hdGVkT3JBY3R1YWxEZXBhcnR1cmVUeXBlOiBzdHJpbmc7XG4gICAgLy8gICAgIEVzdGltYXRlZE9yQWN0dWFsRGVwYXJ0dXJlVGltZTogRGF0ZTtcbiAgICAvLyAgICAgRXN0aW1hdGVkT3JBY3R1YWxEZXBhcnR1cmVEaWZmRGF5czogbnVtYmVyO1xuICAgIC8vICAgICBFc3RpbWF0ZWRPckFjdHVhbEFycml2YWxUeXBlOiBzdHJpbmc7XG4gICAgLy8gICAgIEVzdGltYXRlZE9yQWN0dWFsQXJyaXZhbFRpbWU6IERhdGU7XG4gICAgLy8gICAgIEVzdGltYXRlZE9yQWN0dWFsQXJyaXZhbERpZmZEYXlzOiBudW1iZXI7XG4gICAgLy8gICAgIERlcGFydHVyZURlbGF5OiBzdHJpbmc7XG4gICAgLy8gICAgIEFycml2YWxEZWxheTogc3RyaW5nO1xuICAgIC8vICAgICBGbGlnaHRTdGF0dXM6IHN0cmluZztcbiAgICAvLyAgICAgVGltZUF0TGF5b3Zlcj86IGFueTtcbiAgICAvLyAgICAgVGltZVRvQm9hcmQ6IHN0cmluZztcbiAgICAvLyAgICAgRGVwYXJ0dXJlVGVybWluYWxHYXRlTGFiZWw6IHN0cmluZztcbiAgICAvLyAgICAgRGVwYXJ0dXJlVGVybWluYWxHYXRlOiBzdHJpbmc7XG4gICAgLy8gICAgIEFycml2YWxUZXJtaW5hbEdhdGVMYWJlbDogc3RyaW5nO1xuICAgIC8vICAgICBBcnJpdmFsVGVybWluYWxHYXRlPzogYW55O1xuICAgIC8vICAgICBBaXJjcmFmdFRhaWxOdW1iZXJMYWJlbDogc3RyaW5nO1xuICAgIC8vICAgICBBaXJjcmFmdFRhaWxOdW1iZXI6IHN0cmluZztcbiAgICAvLyAgICAgRXF1aXBtZW50OiBzdHJpbmc7XG4gICAgLy8gICAgIERlcGFydHVyZUNvZGU6IHN0cmluZztcbiAgICAvLyAgICAgQXJyaXZhbENvZGU6IHN0cmluZztcbiAgICAvLyAgICAgTWFya2V0aW5nRmxpZ2h0TGlzdDogc3RyaW5nW107XG4gICAgLy8gICAgIEZsaWdodFR5cGU6IHN0cmluZztcbiAgICAvLyB9XG5cbiAgICAvLyBleHBvcnQgY2xhc3MgU2VnbWVudExpc3Qge1xuICAgIC8vICAgICBSUEg6IHN0cmluZztcbiAgICAvLyAgICAgRGVwYXJ0dXJlRGF0ZVRpbWU6IERhdGU7XG4gICAgLy8gICAgIEFycml2YWxEYXRlVGltZTogRGF0ZTtcbiAgICAvLyAgICAgTWFya2V0aW5nRmxpZ2h0OiBzdHJpbmc7XG4gICAgLy8gICAgIERlcGFydHVyZUNpdHk6IHN0cmluZztcbiAgICAvLyAgICAgT3BlcmF0aW5nRmxpZ2h0PzogYW55O1xuICAgIC8vICAgICBTdGF0dXNDYXRlZ29yeTogc3RyaW5nO1xuICAgIC8vICAgICBSQkQ6IHN0cmluZztcbiAgICAvLyAgICAgT3JpZ2luUkJEPzogYW55O1xuICAgIC8vICAgICBVcGdyYWRlUkJEPzogYW55O1xuICAgIC8vICAgICBVcGdyYWRlVHlwZTogbnVtYmVyO1xuICAgIC8vICAgICBDYWJpbj86IGFueTtcbiAgICAvLyAgICAgUGFzc2VuZ2VyUlBIczogc3RyaW5nO1xuICAgIC8vICAgICBTZWdtZW50UlBIOiBzdHJpbmc7XG4gICAgLy8gICAgIEZsaWdodENoZWNrSW46IEZsaWdodENoZWNrSW47XG4gICAgLy8gICAgIEZsaWdodEluZm86IEZsaWdodEluZm9bXTtcbiAgICAvLyAgICAgU2VsZWN0ZWQ6IGJvb2xlYW47XG4gICAgLy8gICAgIElzVGhyb3VnaE9yQ2hhbmdlT2ZHYXVnZUZsaWdodD86IGFueTtcbiAgICAvLyB9XG5cbiAgICAvLyBleHBvcnQgY2xhc3MgU2VnbWVudFRyYXZlbGVySW5mbyB7XG4gICAgLy8gICAgIFBhc3NlbmdlclJQSDogc3RyaW5nO1xuICAgIC8vICAgICBTZWdtZW50UlBIOiBzdHJpbmc7XG4gICAgLy8gICAgIFNlYXRzPzogYW55O1xuICAgIC8vICAgICBQYXNzZW5nZXJGdWxsTmFtZTogc3RyaW5nO1xuICAgIC8vICAgICBTZWxlY3RlZDogYm9vbGVhbjtcbiAgICAvLyB9XG5cbiAgICAvLyBleHBvcnQgY2xhc3MgUHJpbnRlciB7XG4gICAgLy8gICAgIENsaWVudENvZGU6IHN0cmluZztcbiAgICAvLyAgICAgT2ZmaWNlTmFtZTogc3RyaW5nO1xuICAgIC8vICAgICBEZXZpY2VOYW1lOiBzdHJpbmc7XG4gICAgLy8gICAgIFdvcmtzdGF0aW9uTmFtZTogc3RyaW5nO1xuICAgIC8vICAgICBQZWN0YWJWZXJzaW9uOiBzdHJpbmc7XG4gICAgLy8gICAgIERldmljZVR5cGU6IHN0cmluZztcbiAgICAvLyB9XG5cbiAgICAvLyBleHBvcnQgY2xhc3MgRGVsaXZlcnlEZXRhaWwge1xuICAgIC8vICAgICBHYXRld2F5OiBzdHJpbmc7XG4gICAgLy8gICAgIEVtYWlsPzogYW55O1xuICAgIC8vICAgICBQcmludGVyQWRkcmVzczogc3RyaW5nO1xuICAgIC8vICAgICBQcmludGVyOiBQcmludGVyO1xuICAgIC8vIH1cblxuICAgIC8vIGV4cG9ydCBjbGFzcyBBZGRNYW51YWxCYWdUYWdSZXF1ZXN0IHtcbiAgICAvLyAgICAgSUQ6IHN0cmluZztcbiAgICAvLyAgICAgQ2hlY2tJblR5cGU6IHN0cmluZztcbiAgICAvLyAgICAgQ2xpZW50Vmlld01vZGVsOiBDbGllbnRWaWV3TW9kZWw7XG4gICAgLy8gICAgIFBhc3Nlbmdlckxpc3Q6IFBhc3Nlbmdlckxpc3RbXTtcbiAgICAvLyAgICAgU2VnbWVudExpc3Q6IFNlZ21lbnRMaXN0W107XG4gICAgLy8gICAgIFNlZ21lbnRUcmF2ZWxlckluZm86IFNlZ21lbnRUcmF2ZWxlckluZm9bXTtcbiAgICAvLyAgICAgU291cmNlOiBzdHJpbmc7XG4gICAgLy8gICAgIENoZWNrSW5NZXNzYWdlRnVuY3Rpb25UeXBlOiBzdHJpbmc7XG4gICAgLy8gICAgIERlbGl2ZXJ5RGV0YWlsOiBEZWxpdmVyeURldGFpbDtcbiAgICAvLyB9XG5cbiAgICAvLyBleHBvcnQgY2xhc3MgQmFnVGFnRGV0YWlsMiB7XG4gICAgLy8gICAgIEJhZ1RhZ1R5cGU6IG51bWJlcjtcbiAgICAvLyAgICAgSXNBdXRvQmFnPzogYW55O1xuICAgIC8vICAgICBTZXJpYWxOdW1iZXI6IHN0cmluZztcbiAgICAvLyAgICAgQmFnVGFnQ291bnQ6IG51bWJlcjtcbiAgICAvLyAgICAgQ2FycmllckNvZGU6IHN0cmluZztcbiAgICAvLyAgICAgSXNzdWVyQ29kZT86IGFueTtcbiAgICAvLyAgICAgV2VpZ2h0VG9EZWxldGU/OiBhbnk7XG4gICAgLy8gICAgIFdlaWdodFRvRGVsZXRlX0VkaXRhYmxlOiBib29sZWFuO1xuICAgIC8vICAgICBTZWdtZW50UlBIPzogYW55O1xuICAgIC8vICAgICBTZWdtZW50VHJhdmVsZXJJbmZvcz86IGFueTtcbiAgICAvLyAgICAgTWFudWFsQmFnVGFnPzogYW55O1xuICAgIC8vICAgICBCYWdUYWdQcmludFJlc3BvbnNlPzogYW55O1xuICAgIC8vICAgICBCbHVldG9vdGhQcmludFN0YXR1czogYm9vbGVhbjtcbiAgICAvLyAgICAgU3VjY2VzczogYm9vbGVhbjtcbiAgICAvLyAgICAgRXJyb3JzPzogYW55O1xuICAgIC8vICAgICBJbmZvcm1hdGlvbj86IGFueTtcbiAgICAvLyAgICAgV2FybmluZ3M/OiBhbnk7XG4gICAgLy8gfVxuXG4gICAgLy8gZXhwb3J0IGNsYXNzIEJhZ2dhZ2VJbmZvMiB7XG4gICAgLy8gICAgIENoZWNrZWRCYWdDb3VudFRvdGFsOiBzdHJpbmc7XG4gICAgLy8gICAgIEhhbmRCYWdDb3VudFRvdGFsPzogYW55O1xuICAgIC8vICAgICBVbml0T2ZNZWFzdXJlUXVhbnRpdHk6IG51bWJlcjtcbiAgICAvLyAgICAgVW5pdE9mTWVhc3VyZUNvZGU6IHN0cmluZztcbiAgICAvLyAgICAgQmFnVGFnRGV0YWlsczogQmFnVGFnRGV0YWlsMltdO1xuICAgIC8vICAgICBCYWdOdW1iZXJUb0RlbGV0ZT86IGFueTtcbiAgICAvLyAgICAgQmFnV2VpZ2h0VG9EZWxldGU/OiBhbnk7XG4gICAgLy8gICAgIFNlZ21lbnRSUEg/OiBhbnk7XG4gICAgLy8gICAgIEJhZ2dhZ2VSdWxlcz86IGFueTtcbiAgICAvLyAgICAgQmFnZ2FnZUFsbG93YW5jZT86IGFueTtcbiAgICAvLyB9XG5cbiAgICAvLyBleHBvcnQgY2xhc3MgU2VnbWVudFRyYXZlbGVySW5mbzIge1xuICAgIC8vICAgICBHaXZlbk5hbWU6IHN0cmluZztcbiAgICAvLyAgICAgTGFzdE5hbWU6IHN0cmluZztcbiAgICAvLyAgICAgT3JkZXJJZDogc3RyaW5nO1xuICAgIC8vICAgICBJc1doZWVsQ2hhaXI6IGJvb2xlYW47XG4gICAgLy8gICAgIFBhc3NlbmdlclJQSDogc3RyaW5nO1xuICAgIC8vICAgICBTZWdtZW50UlBIOiBzdHJpbmc7XG4gICAgLy8gICAgIFNlcnZpY2VzPzogYW55O1xuICAgIC8vICAgICBQYWlkU2VydmljZXM/OiBhbnk7XG4gICAgLy8gICAgIFNlYXRzPzogYW55O1xuICAgIC8vICAgICBDaGVja2luSW5mb3M/OiBhbnk7XG4gICAgLy8gICAgIEJhZ2dhZ2VJbmZvOiBCYWdnYWdlSW5mbzI7XG4gICAgLy8gICAgIFRpY2tldE51bWJlcnM/OiBhbnk7XG4gICAgLy8gICAgIFNob3J0UGFzc0Rlc2M/OiBhbnk7XG4gICAgLy8gICAgIFBhc3NlbmdlckZ1bGxOYW1lPzogYW55O1xuICAgIC8vICAgICBTZWxlY3RlZDogYm9vbGVhbjtcbiAgICAvLyAgICAgU2VjdXJpdHlDb2RlPzogYW55O1xuICAgIC8vICAgICBTZWN1cml0eUNvZGVEZXNjPzogYW55O1xuICAgIC8vICAgICBQYXNzZW5nZXJSZWZOdW1iZXI/OiBhbnk7XG4gICAgLy8gICAgIENoZWNraW5QYXNzZW5nZXJUeXBlQ29kZT86IGFueTtcbiAgICAvLyAgICAgQ2hlY2tpblBhc3NlbmdlclR5cGVDb2RlRGVzYz86IGFueTtcbiAgICAvLyAgICAgTXVsdGlJbml0aWFsUGFzc2VuZ2VyVHlwZXM/OiBhbnk7XG4gICAgLy8gICAgIENvbm5lY3RpbmdGbGlnaHRTZWF0czogYW55W107XG4gICAgLy8gfVxuXG4gICAgLy8gZXhwb3J0IGNsYXNzIEZsaWdodFNlZ21lbnQge1xuICAgIC8vICAgICBSUEg6IG51bWJlcjtcbiAgICAvLyAgICAgQ2FycmllckNvZGU6IHN0cmluZztcbiAgICAvLyAgICAgRmxpZ2h0TnVtYmVyOiBzdHJpbmc7XG4gICAgLy8gICAgIERlcGFydHVyZURhdGU6IERhdGU7XG4gICAgLy8gICAgIEZyb206IHN0cmluZztcbiAgICAvLyAgICAgVG86IHN0cmluZztcbiAgICAvLyAgICAgSXNWb2lkOiBib29sZWFuO1xuICAgIC8vICAgICBJc09wZW46IGJvb2xlYW47XG4gICAgLy8gfVxuXG4gICAgLy8gZXhwb3J0IGNsYXNzIEJhZ2dhZ2VEZXRhaWwge1xuICAgIC8vICAgICBCYWdUYWdUeXBlOiBudW1iZXI7XG4gICAgLy8gICAgIElzQXV0b0JhZz86IGFueTtcbiAgICAvLyAgICAgU2VyaWFsTnVtYmVyOiBzdHJpbmc7XG4gICAgLy8gICAgIEJhZ1RhZ0NvdW50OiBudW1iZXI7XG4gICAgLy8gICAgIENhcnJpZXJDb2RlOiBzdHJpbmc7XG4gICAgLy8gICAgIElzc3VlckNvZGU/OiBhbnk7XG4gICAgLy8gICAgIFdlaWdodFRvRGVsZXRlPzogYW55O1xuICAgIC8vICAgICBXZWlnaHRUb0RlbGV0ZV9FZGl0YWJsZTogYm9vbGVhbjtcbiAgICAvLyAgICAgU2VnbWVudFJQSD86IGFueTtcbiAgICAvLyAgICAgU2VnbWVudFRyYXZlbGVySW5mb3M/OiBhbnk7XG4gICAgLy8gICAgIE1hbnVhbEJhZ1RhZz86IGFueTtcbiAgICAvLyAgICAgQmFnVGFnUHJpbnRSZXNwb25zZT86IGFueTtcbiAgICAvLyAgICAgQmx1ZXRvb3RoUHJpbnRTdGF0dXM6IGJvb2xlYW47XG4gICAgLy8gICAgIFN1Y2Nlc3M6IGJvb2xlYW47XG4gICAgLy8gICAgIEVycm9ycz86IGFueTtcbiAgICAvLyAgICAgSW5mb3JtYXRpb24/OiBhbnk7XG4gICAgLy8gICAgIFdhcm5pbmdzPzogYW55O1xuICAgIC8vIH1cblxuICAgIC8vIGV4cG9ydCBjbGFzcyBCYWdnYWdlSW5mbzMge1xuICAgIC8vICAgICBQYXNzZW5nZXJSUEg6IG51bWJlcjtcbiAgICAvLyAgICAgQ2hlY2tlZEJhZ0NvdW50VG90YWw6IG51bWJlcjtcbiAgICAvLyAgICAgQ2hlY2tlZEJhZ1dlaWdodFRvdGFsOiBudW1iZXI7XG4gICAgLy8gICAgIFVuaXRPZk1lYXN1cmVDb2RlOiBzdHJpbmc7XG4gICAgLy8gICAgIEJhZ2dhZ2VEZXRhaWxzOiBCYWdnYWdlRGV0YWlsW107XG4gICAgLy8gfVxuXG4gICAgLy8gZXhwb3J0IGNsYXNzIE1hbnVhbEJhZ1RhZyB7XG4gICAgLy8gICAgIE1lc3NhZ2VGdW5jdGlvbjogc3RyaW5nO1xuICAgIC8vICAgICBGbGlnaHRTZWdtZW50czogRmxpZ2h0U2VnbWVudFtdO1xuICAgIC8vICAgICBQYXNzZW5nZXJJbmZvPzogYW55O1xuICAgIC8vICAgICBQYXNzZW5nZXJGbGlnaHRJbmZvPzogYW55O1xuICAgIC8vICAgICBCYWdnYWdlSW5mbzogQmFnZ2FnZUluZm8zO1xuICAgIC8vICAgICBDYW5jZWxPcGVyYXRpb246IGJvb2xlYW47XG4gICAgLy8gfVxuXG4gICAgLy8gZXhwb3J0IGNsYXNzIEJhZ1RhZ091dHB1dCB7XG4gICAgLy8gICAgIFJlcXVlc3RJZD86IGFueTtcbiAgICAvLyAgICAgU3RhdHVzPzogYW55O1xuICAgIC8vICAgICBKb2JJZD86IGFueTtcbiAgICAvLyAgICAgUHJpbnRlclN0YXR1cz86IGFueTtcbiAgICAvLyAgICAgRXhwZWN0ZWR0aW1ldG9kZWxpdmVyPzogYW55O1xuICAgIC8vICAgICBNZXNzYWdlPzogYW55O1xuICAgIC8vICAgICBFcnJvcnM/OiBhbnk7XG4gICAgLy8gICAgIFBpY1Jhd0RhdGE6IHN0cmluZztcbiAgICAvLyAgICAgU3VjY2VzczogYm9vbGVhbjtcbiAgICAvLyAgICAgSW5mb3JtYXRpb24/OiBhbnk7XG4gICAgLy8gICAgIFdhcm5pbmdzPzogYW55O1xuICAgIC8vIH1cblxuICAgIC8vIGV4cG9ydCBjbGFzcyBCYWdUYWdQcmludFJlc3BvbnNlIHtcbiAgICAvLyAgICAgQm9hcmRpbmdQYXNzT3V0cHV0PzogYW55O1xuICAgIC8vICAgICBCYWdUYWdPdXRwdXQ6IEJhZ1RhZ091dHB1dFtdO1xuICAgIC8vICAgICBTdWNjZXNzOiBib29sZWFuO1xuICAgIC8vICAgICBFcnJvcnM/OiBhbnk7XG4gICAgLy8gICAgIEluZm9ybWF0aW9uPzogYW55O1xuICAgIC8vICAgICBXYXJuaW5ncz86IGFueTtcbiAgICAvLyB9XG5cbiAgICAvLyBleHBvcnQgY2xhc3MgV2FybmluZyB7XG4gICAgLy8gICAgIFJlY29yZElEOiBzdHJpbmc7XG4gICAgLy8gICAgIFJQSD86IGFueTtcbiAgICAvLyAgICAgVGFnOiBzdHJpbmc7XG4gICAgLy8gICAgIE1lc3NhZ2U6IHN0cmluZztcbiAgICAvLyAgICAgU3RhdHVzOiBib29sZWFuO1xuICAgIC8vIH1cblxuICAgIC8vIGV4cG9ydCBjbGFzcyBCYWdUYWdWTURldGFpbHMge1xuICAgIC8vICAgICBCYWdUYWdUeXBlOiBudW1iZXI7XG4gICAgLy8gICAgIElzQXV0b0JhZz86IGFueTtcbiAgICAvLyAgICAgU2VyaWFsTnVtYmVyPzogYW55O1xuICAgIC8vICAgICBCYWdUYWdDb3VudDogbnVtYmVyO1xuICAgIC8vICAgICBDYXJyaWVyQ29kZT86IGFueTtcbiAgICAvLyAgICAgSXNzdWVyQ29kZT86IGFueTtcbiAgICAvLyAgICAgV2VpZ2h0VG9EZWxldGU/OiBhbnk7XG4gICAgLy8gICAgIFdlaWdodFRvRGVsZXRlX0VkaXRhYmxlOiBib29sZWFuO1xuICAgIC8vICAgICBTZWdtZW50UlBIPzogYW55O1xuICAgIC8vICAgICBTZWdtZW50VHJhdmVsZXJJbmZvczogU2VnbWVudFRyYXZlbGVySW5mbzJbXTtcbiAgICAvLyAgICAgTWFudWFsQmFnVGFnOiBNYW51YWxCYWdUYWc7XG4gICAgLy8gICAgIEJhZ1RhZ1ByaW50UmVzcG9uc2U6IEJhZ1RhZ1ByaW50UmVzcG9uc2U7XG4gICAgLy8gICAgIFN1Y2Nlc3M6IGJvb2xlYW47XG4gICAgLy8gICAgIEVycm9ycz86IGFueTtcbiAgICAvLyAgICAgSW5mb3JtYXRpb24/OiBhbnk7XG4gICAgLy8gICAgIFdhcm5pbmdzOiBXYXJuaW5nW107XG4gICAgLy8gfVxuXG4gICAgZXhwb3J0IGNsYXNzIFJvb3RPYmplY3Qge1xuICAgICAgICBhZGRNYW51YWxCYWdUYWdSZXF1ZXN0OmFueTtcbiAgICAgICAgYmFnVGFnVk1EZXRhaWxzOiBhbnk7XG4gICAgICAgIEJsdWV0b290aFByaW50U3RhdHVzOiBib29sZWFuO1xuICAgIH1cblxufVxuXG5leHBvcnQgbW9kdWxlIENoZWNraW5QcmludFJlc3BvbnNlIHtcblxuICAgIGV4cG9ydCBjbGFzcyBSb290T2JqZWN0IHtcbiAgICAgICAgQ2hlY2tpblJlcXVlc3Q6YW55O1xuICAgICAgICBDaGVja2luUmVzcG9uc2U6IGFueTtcbiAgICAgICAgQmx1ZXRvb3RoUHJpbnRTdGF0dXM6IGJvb2xlYW47XG4gICAgfVxuXG59XG5cbiJdfQ==