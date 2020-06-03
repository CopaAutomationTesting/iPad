export module PrintResponse {

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

    export class RootObject {
        addManualBagTagRequest:any;
        bagTagVMDetails: any;
        BluetoothPrintStatus: boolean;
    }

}

export module CheckinPrintResponse {

    export class RootObject {
        CheckinRequest:any;
        CheckinResponse: any;
        BluetoothPrintStatus: boolean;
    }

}

