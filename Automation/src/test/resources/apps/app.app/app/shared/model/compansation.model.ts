export class Equipment {
    AirEquipType: string;
    AircraftTailNumber: string;
}

export class FlightInfo {
    IsInternational: boolean;
    BoardingInitiated: boolean;
    BoardingDateTime: Date;
    StandbyClearanceInitiated: boolean;
    Equipment: Equipment;
    DepartureTime: Date;
    DestinationAirport: string;
    IsUTC: boolean;
    OperatingFlightNumber?: any;
    ConnectionFlightNumber?: any;
    OptionalFlightNumber?: any;
    SegmentRPH?: any;
    BookingClass?: any;
    FlightNumber: string;
    DepartureDate: Date;
    DepartureAirport: string;
}

export class SeatList {
    SeatAvailability?: any;
    SeatNumber: string;
    SeatCharacteristics?: any;
    DepartureCode: string;
    ArrivalCode: string;
    Cabin: string;
    IsThruSeatNeeded: boolean;
}

export class InboundConnectingFlight {
    DepartureDateTime?: any;
    FlightNumber: string;
    LocationCode: string;
}

export class OutboundConnectingFlight {
    DepartureDateTime?: any;
    FlightNumber: string;
    LocationCode: string;
}

export class SpecialServiceRequest {
    Text: string;
    Airline?: any;
    Operation: number;
    SSRCode: string;
    ServiceQuantity: number;
    Status: string;
}

export class AllianceTierLevel {
    Name: string;
    Code: string;
    Number?: any;
}

export class FqtTraveler {
    IsStarAlliance: boolean;
    IsRefValue: boolean;
    MembershipID: string;
    ProgramID: string;
    AwardInformation?: any;
    VendorCodes?: any;
    Operation?: any;
    LoyaltyProgramCode?: any;
    MilesBalance?: any;
    AllianceTierLevel: AllianceTierLevel;
    TierLevel?: any;
}

export class OtherServiceInfo {
    Text: string;
    Airline?: any;
    Operation: number;
    SSRCode?: any;
    ServiceQuantity: number;
    Status?: any;
}

export class PassengerList {
    OrderId: string;
    PassengerType?: any;
    PassengerRPH: string;
    FlightRPH?: any;
    SeatList: SeatList[];
    SequenceNumber: string;
    PassengerRefNumber: string;
    CheckinDateTime?: Date;
    Status: string;
    GivenName: string;
    Surname: string;
    AlternateFlightNumber: string;
    Dest: string;
    Orgin: string;
    BoardingPriority?: any;
    SeatNumber?: any;
    ResBookDesigCode: string;
    UpgradeResBookDesigCode?: any;
    InfwithSeat?: any;
    InfantIndicator?: any;
    IsWaitList: boolean;
    InboundConnectingFlight: InboundConnectingFlight;
    OutboundConnectingFlight: OutboundConnectingFlight;
    ServiceCombinedString: string;
    SSRs: string[];
    StandbyPassengerType: string;
    StandbyRank: number;
    IsStandbyForUpgrade: boolean;
    SecurityCode: string;
    CheckedBagCount: number;
    BagTags: string[];
    PassengerCharacteristics: string[];
    INFGivenName?: any;
    INFSurname?: any;
    INFDOB?: any;
    PassengerMessages?: any;
    SpecialServiceRequest: SpecialServiceRequest[];
    FqtTravelers: FqtTraveler[];
    OldFlightSeatingInformation?: any;
    OtherServiceInfo: OtherServiceInfo[];
}

export class Compansation {
    FlightInfo: FlightInfo;
    GroupedPassengerList?: any;
    PassengerList: PassengerList[];
}

export class PassengerTypeListTable {
    Key: string;
    Value: Value;
}

export class Value {
    Description: string;
    ListType: string;
}


// Request Issue Compensation Model


export module BreRequest {

    export class Passenger {
        FlightSegmentId: string;
        PassengerSeq?: any;
        OrderId: string;
        PaxLastNm: string;
        PaxFirstNm: string;
        Origin: string;
        Dest: string;
        PaxType?: any;
        PaxCompReasonId: string;
        FqtvCc?: any;
        FqtvNumber?: any;
        PaxStatus?: any;
        PaxEmailAddress?: any;
        UpdateLockNbr?: any;
        FqtvTier?: any;
        CabinClass: string;
        PaxRPH: string;
        CompReasonText: string;
        SSR: SSRs[];
        Etkt: any[];
        ReaccomDetails: any[];
        Bags: any[];
        Compensations: any[];
    }
    export class SSRs {
        FlightSegmentId: number;
        PassengerSeq: number;
        SsrCode: string;
    }
    export class FlightSegment {
        FlightSegmentId: number;
        AirlineCode: string;
        FlightNo: string;
        DepartureDt: string;
        Departure: string;
        Arrival: string;
        FlightSegmentRPH?: any;
        Passengers: Passenger[];
    }

    export class RootObject {
        SourceId: string;
        privilege: Array<string> = [];
        UserId: string;
        FlightSegments: FlightSegment[];
    }

}



// Response Issue Compensation Model

export module BRECompensation {

    export class Emd {
        compensationCause: string;
        compensationType: string;
        emdEndorsable: boolean;
        emdExchangeable: boolean;
        emdRefundable: boolean;
        emdType: string;
        emdUsedAtIssuance: boolean;
        endorsementTextItems: string[];
        formOfPayment: string;
        productCode: string;
        subProductCode: string;
    }

    export class Compensation {
        amount: number;
        compensationType: string;
        lowerLimit: number;
        upperLimit: number;
    }

    export class Passenger {
        cabinClass: string;
        compensationCause: string;
        compensations: Compensation[];
        flightNumber: string;
        givenName: string;
        orderId: string;
        passengerType: string;
        surname: string;
        tierLevel: string;
        IsSelected: boolean = false;
        fullname: string;
        email: string;
        additionaldetails: string;
        monetary: number;
        hotel: number;
        meal: number;
        transportation: number;
        additionalDetailsTexts: Array<string> = [];
    }

    export class BREResponse {
        type: string;
        emd: Emd[];
        passengers: Passenger[];
    }

}

export module CompensationPaxList {

    export class SSR {
        FlightSegmentId: number;
        PassengerSeq: number;
        SsrCode: string;
    }

    export class Etkt {
        FlightSegmentId: number;
        PassengerSeq: number;
        TicketNbr: string;
        CpnNum: string;
    }

    export class ReaccomDetail {
        FlightSegmentId: number;
        PassengerSeq: number;
        ReacomSeq: number;
        FromToFlag: string;
        ReaccomAirlineCode: string;
        ReaccomFlightNo: string;
        ReaccomFlightDt: string;
        ReaccomBoardCityCd: string;
        ReaccomOffCityCd: string;
        UpdateLockNbr: number;
    }

    export class Bag {
        FlightSegmentId: number;
        PassengerSeq: number;
        BagtagNbr: string;
        UpdateLockNbr: number;
    }

    export class Emd {
        FlightSegmentId: number;
        PassengerSeq: number;
        CompSeq: string;
        PrimaryDocumentNbr: string;
        PrimaryAirlineCd: string;
        IssueDt: string;
        FirstNm: string;
        LastNm: string;
        UserId: string;
        ReasonForIssuanceSubCd: string;
        ReasonForIssuanceCd: string;
        Endorsements1Txt: string;
        RemarkTxt: string;
    }

    export class Compensation {
        FlightSegmentId: number;
        PassengerSeq: number;
        CompSeq: string;
        CompReasonId: string;
        CompReasonText: string;
        CompTypeId: string;
        CompTypeText: string;
        CompAmt: number;
        CompCurrencyCd: string;
        VoucherCnt: string;
        OverrideReason: string;
        UpdateLockNbr: number;
        Emds: Emd[];
    }

    export class Emd2 {
        FlightSegmentId: number;
        PassengerSeq: number;
        CompSeq: string;
        PrimaryDocumentNbr: string;
        PrimaryAirlineCd: string;
        IssueDt: string;
        FirstNm: string;
        LastNm: string;
        UserId: string;
        ReasonForIssuanceSubCd: string;
        ReasonForIssuanceCd: string;
        Endorsements1Txt: string;
        RemarkTxt: string;
    }

    export class ExistingCompensation {
        FlightSegmentId: number;
        PassengerSeq: number;
        CompSeq: string;
        CompReasonId: string;
        CompReasonText: string;
        CompTypeId: string;
        CompTypeText: string;
        CompAmt: number;
        CompCurrencyCd: string;
        VoucherCnt: string;
        OverrideReason: string;
        UpdateLockNbr: number;
        Emds: Emd2[];
    }

    export class Passenger {
        FlightSegmentId: number;
        PassengerSeq?: number;
        OrderId: string;
        SurnameNum?: number;
        FirstnameNum: string;
        PaxLastNm: string;
        PaxFirstNm: string;
        PaxType: string;
        FqtvCc?: any;
        FqtvNumber?: any;
        PaxStatus: string;
        PaxEmailAddress: string;
        IsExistingCompensation: boolean;
        UpdateLockNbr?: number;
        FqtvTier: string;
        CabinClass: string;
        IsCompensationIssued: boolean;
        SSR: SSR[];
        Etkt: Etkt[];
        ReaccomDetails: ReaccomDetail[];
        Bags: Bag[];
        Compensations: Compensation[];
        ExistingCompensations: ExistingCompensation[];
    }

    export class FlightSegment {
        FlightSegmentId: number;
        AirlineCode: string;
        FlightNo: string;
        DepartureDt: string;
        Departure: string;
        Arrival: string;
        Passengers: Passenger[];
    }

    export class RootObject {
        FlightSegments: FlightSegment[];
        Errors?: any;
    }

}



export module SaveCompensationRequest {

    export class SSR {
        FlightSegmentId?: any;
        PassengerSeq?: any;
        SsrCode: string;
    }

    export class Etkt {
        FlightSegmentId?: any;
        PassengerSeq?: any;
        TicketNbr: string;
        CpnNum: number;
    }

    export class ReaccomDetail {
        FlightSegmentId?: any;
        PassengerSeq?: any;
        ReacomSeq?: any;
        FromToFlag: string;
        GUIDisplayFlag: string;
        ReaccomAirlineCode: string;
        ReaccomFlightNo: string;
        ReaccomFlightDt: string;
        ReaccomBoardCityCd: string;
        ReaccomOffCityCd: string;
        UpdateLockNbr?: any;
    }

    export class Bag {
        FlightSegmentId?: any;
        PassengerSeq?: any;
        BagtagNbr: string;
        UpdateLockNbr?: any;
    }

    export class Emd {
        FlightSegmentId?: any;
        PassengerSeq?: any;
        CompSeq?: any;
        PrimaryDocumentNbr: string;
        PrimaryAirlineCd: string;
        IssueDt: string;
        FirstNm: string;
        LastNm: string;
        UserId: string;
        ReasonForIssuanceSubCd: string;
        ReasonForIssuanceCd: string;
        Endorsements1Txt: string;
        RemarkTxt: string;
        PrintStatus: string;
        EmailStatus: string;
    }

    export class Compensation {
        FlightSegmentId?: number;
        PassengerSeq?: number;
        CompSeq?: string;
        CompReasonId: number;
        CompTypeId?: string;
        CompAmt: number;
        CompCurrencyCd: string;
        VoucherCnt: string;
        OverrideReason: string;
        UpdateLockNbr?: number;
        CompReasonText: string;
        CompTypeText: string;
        Emds: Emd[];
    }

    export class Passenger {
        FlightSegmentId?: any;
        PassengerSeq?: any;
        OrderId: string;
        SurnameNum: number;
        FirstnameNum: number;
        PaxLastNm: string;
        PaxFirstNm: string;
        PaxType: string;
        FqtvCc: string;
        FqtvNumber: string;
        PaxCompReasonID: string;
        PaxCompReasonText: string;
        IsExistingCompensation: boolean = false;
        Origin: string;
        Dest: string;
        WorldTracerNum: string;
        CustomerCareCaseNum: string;
        PaxRPH: string;
        IsCompensationIssued: boolean = false;
        IsCompensationNotIssued: boolean = false;
        PaxStatus: string;
        PaxEmailAddress: string;
        UpdateLockNbr?: any;
        FqtvTier: string;
        CabinClass: string;
        SSR: SSR[];
        Etkt: Etkt[];
        ReaccomDetails: ReaccomDetail[];
        Bags: Bag[];
        Compensations: Compensation[];
    }

    export class FlightSegment {
        FlightSegmentId?: any;
        AirlineCode: string;
        FlightNo: string;
        DepartureDt: string;
        Departure: string;
        Arrival: string;
        Passengers: Passenger[];
    }

    export class RootObject {
        SourceId: string;
        UserId: string;
        FlightSegments: FlightSegment[];
    }

}
export module IssueCompensationRequest {
    export class SelectedService {
        RFISC_code: string;
        RFISC_subCode: string;
        SSRCode?: any;
        commercialName: string;
        EmdType: string;
        TypeOfService?: any;
        emdEndorsable: string;
        emdRefundable: boolean;
        emdExchangeable: string;
        emdUsedAtIssuance: string;
        IsRefundable: string;
    }
    export class Services {
        Taxes?: any;
        passengerRPH: string;
        segmentRPH?: any;
        currencyCode: string;
        amount: string;
        ticketNumber?: any;
        Remarks?: any;
        Endorsement: string;
        selectedService: SelectedService;
    }

    export class Payments {
        Type: string;
        TransactionType: string;
        SubType: string;
        Description: string;
        Amount: string;
        CurrencyCode: string;
        AccountCode: string;

    }

    export class Emd {
        FlightSegmentId: string;
        PassengerSeq: string;
        CompSeq: string;
        PrimaryDocumentNbr?: any;
        PrimaryAirlineCd: string;
        IssueDt: string;
        FirstNm: string;
        LastNm: string;
        UserId: string;
        ReasonForIssuanceSubCd: string;
        OverrideReason: string;
        ReasonForIssuanceCd: string;
        Endorsements1Txt: string = "";
        RemarkTxt: string;
        CompAmt: any;
        CompCurrencyCd: any;
        VoucherCnt: any;
        PointOfSale: any;
    }

    export class Compensation {
        FlightSegmentId: string;
        PassengerSeq: string;
        CompSeq: string;
        CompReasonId: string;
        CompReasonText: string;
        CompTypeId: string;
        CompTypeText: string;
        // CompAmt: string;
        // CompCurrencyCd: string;
        // VoucherCnt: string;
        // OverrideReason?: any;
        UpdateLockNbr?: any;
        Remarks?: any;
        Endorsement: string;
        Services: Services;
        Payments: Payments;
        Emds: Emd[];
    }

    export class Passenger {
        FlightSegmentId: string;
        PassengerSeq: string;
        OrderId: string;
        PaxLastNm: string;
        PaxFirstNm: string;
        PaxType?: any;
        FqtvCc?: any;
        FqtvNumber?: any;
        PaxStatus?: any;
        PaxEmailAddress?: any;
        PaxCompReasonID: any;
        IsExistingCompensation: boolean;
        UpdateLockNbr?: any;
        FqtvTier?: any;
        CabinClass?: any;
        PaxRPH: string;
        DummyCompOrderFlag :string;
        WorldTracerNum: string;
        CustomerCareCaseNum: string;
        IsCompensationIssued?: any;
        SSR: any[];
        SSRs: SSRs[];
        Etkt: any[];
        ExistingCompensations: any[];
        ReaccomDetails: any[];
        Bags: any[];
        Compensations: Compensation[];
    }
    export class SSRs {
        FlightSegmentId: number;
        PassengerSeq: number;
        SsrCode: string;
    }
    export class FlightSegment {
        FlightSegmentId: number;
        AirlineCode: string;
        FlightNo: string;
        DepartureDt: string;
        Departure: string;
        Arrival: string;
        FlightSegmentRPH: string;
        DepartureDateTime: string;
        ArrivalDateTime: Date;
        HasStopover: boolean;
        Passengers: Passenger[];
    }

    export class RootObject {
        SourceId: any;
        UserId: any;
        AddOrderFlow :any;
        FlightSegments: FlightSegment[];
    }

}


export module AgentPrivilage {

    export class Privilege {
        Name: string;
        Constraints?: any;
    }

    export class RootObject {
        // AirlineCode: "CM";
        Privileges: Privilege[];
    }
}

export module CityCodeCollection {
    export class RootObject {
        Collection: CollectionEntity[];
        BoardingPassOutput?: null;
        BagTagOutput?: null;
        Success: boolean;
        Errors?: null;
        Information?: null;
        Warnings?: null;
    }
    export class CollectionEntity {
        Code: string;
        Name: string;
        Type: string;
    }
}

export module EmailModule {
    export class RootObject {
        OrderId?: null;
        Gateway: string;
        ListType: string;
        DocumentType: string;
        Source: string;
        Segments?: (SegmentsEntity)[] | null;
        Passengers?: (Passenger)[] | null;
    }
    export class SegmentsEntity {
        OperatingCarrierCode: string;
        OperatingCarrierNumber: string;
        Departure: DepartureOrArrival;
        Arrival: DepartureOrArrival;
    }
    export class DepartureOrArrival {
        CityName: string;
        Date :  string;
    }
    export class Passenger {
        FlightSegmentId: string;
        PassengerSeq: string;
        OrderId: string;
        CompSeq: string;
        PrimaryDocumentNbr: string;
        PrimaryAirlineCd: string;
        IssueDt?: any;
        FirstNm: string;
        LastNm: string;
        ReasonForIssuanceSubCd: string;
        ReasonForIssuanceCd: string;
        PrintStatus?: any;
        EmailStatus?: any;
        CustomerCareNumber: string;
        EticketNumber: string;
        WorldTraceNumber: string;
        DeliveryDetail: DeliveryDetail;
    }

    export class Coupon {
        CommercialName: string;
        CompensationType: string;
    }
    export class DeliveryDetail {
        Email: Email;
    }
    export class Email {
        To?: (ToEntity)[] | null;
    }
    export class ToEntity {
        ToAddr: string;
    }

}

export module updateEmailModel {
    export class RootObject {
        ReturnOrder: boolean;
        ReceivedFrom?: null;
        Changes?: (string)[] | null;
        Traveler: Traveler;
    }
    export class Traveler {
        Firstname: string;
        Lastname: string;
        SurnameRefNumber: string;
        Prefix?: null;
        RPH: string;
        Gender: string;
        PassengerTypeCode: string;
        AssociatedInfantRPH?: null;
        DateOfBirth: string;
        Age?: null;
        AssociatedAdultRPH?: null;
        FOID?: null;
        OldPhoneNumbers?: (null)[] | null;
        OldFirstname: string;
        OldLastname: string;
        OldEmergencyDetails?: (null)[] | null;
        IsContactRefused: boolean;
        PhoneNumbers?: (null)[] | null;
        Emails?: (EmailsEntity)[] | null;
        EmergencyDetails?: (null)[] | null;
    }
    export class EmailsEntity {
        Value: string;
        Type: string;
    }
}


export module PrintModule {
    export class RootObject {
        OrderId?: null;
        Gateway: string;
        DocumentType: string;
        ListType: string;
        Source: string;
        Segments: Segment[];
        Passengers: Passenger[];
        DeliveryDetail: DeliveryDetail;
    }
    export class Segment {
        OperatingCarrierCode: string;
        OperatingCarrierNumber: string;
        Departure: Departure;
        Arrival: Arrival;
    }
    export class Departure {
        CityName: string;
    }

    export class Arrival {
        CityName: string;
    }

    export class Passenger {
        FlightSegmentId: string;
        PassengerSeq: string;
        OrderId: string;
        CompSeq: string;
        PrimaryDocumentNbr: string;
        PrimaryAirlineCd: string;
        IssueDt?: any;
        FirstNm: string;
        LastNm: string;
        ReasonForIssuanceSubCd: string;
        ReasonForIssuanceCd: string;
        PrintStatus?: any;
        EmailStatus?: any;
    }

    export class EMDEntity {
        EMDDocumentNumber: string;
        IssuingDate: string;
    }
    export class DeliveryDetail {
        Email?: null;
        Printer: Printer;
    }
    export class Printer {
        ClientCode: string;
        DeviceName: string;
        WorkstationName: string;
        OfficeName: string;
        DeviceType: string;
        PectabVersion: string;
    }
}
export module PassengerTypeModel {

    export class Value {
        Description: string;
        ListType: string;
    }

    export class PassengerTypeListTable {
        Key: string;
        Value: Value;
    }

    export class RootObject {
        PassengerTypeListTable: PassengerTypeListTable[];
    }

}





