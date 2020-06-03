export module Order {

    export interface ResponseData {
        ApisStatusList: any[];
        Errors?: any;
        Information?: any;
        Warnings?: any;
    }

    export interface ResponseValidationStatus {
        Decisions: Decision[];
        Errors?: any;
        Information?: any;
        Warnings?: any;
    }

    export interface Decision {
        DepartureAirport: string;
        ArrivalAirport: any;
        DecisionCode: any;
        DecisionMessage: any;
        Errors: any;
        Information: any;
        Warnings?: any;
    }

    export interface Origin {
        City: string;
        Country: string;
        CountryCode: string;
        AirportCode: string;
        AirportFullName?: any;
    }

     export interface FqtTraveler {
        IsRefValue: boolean;
        LoyalLevel?: any;
        LoyaltyLevelName?: any;
        MembershipID: string;
        ProgramID: string;
        AwardInformation?: any;
        MembershipNumber: string;
        VendorCodes: string;
        Operation?: any;
    }
    
    export interface Destination {
        City: string;
        Country: string;
        CountryCode: string;
        AirportCode: string;
        AirportFullName?: any;
    }

    // export interface Status {
    //     StatusCode: string;
    //     StatusNumber: string;
    //     ChangeStatusNumber?: any;
    //     StatusCategory: string;
    //     StatusDescription: string;
    //     Alert?: any;
    // }
    export class Status {
        StatusCode: string;
        StatusNumber?: string;
        ChangeStatusNumber?: any;
        StatusCategory: string;
        StatusDescription: string;
        Alert?: any;
        IsEligibleForConfirmedCheckIn?: any;
    }

    export interface MarriageGrp {
        Text: string;
        Number: string;
        Value?: any;
    }

    export interface FlightCheckIn {
        CheckInStatus: string;
    }

    export interface FlightInfo {
        ScheduledDepartureTime?: any;
        ScheduledArrivalTime?: any;
        ScheduledArrivalDiffDays?: any;
        EstimatedOrActualDepartureType: string;
        EstimatedOrActualDepartureTime?: any;
        EstimatedOrActualDepartureDiffDays?: any;
        EstimatedOrActualArrivalType: string;
        EstimatedOrActualArrivalTime?: any;
        EstimatedOrActualArrivalDiffDays?: any;
        DepartureDelay?: any;
        ArrivalDelay?: any;
        FlightStatus: string;
        TimeAtLayover?: any;
        TimeToBoard?: any;
        DepartureTerminalGateLabel: string;
        DepartureTerminalGate?: any;
        ArrivalTerminalGateLabel: string;
        ArrivalTerminalGate?: any;
        AircraftTailNumberLabel: string;
        AircraftTailNumber?: any;
        Equipment?: any;
        DepartureCode?: any;
        ArrivalCode?: any;
        MarketingFlightList?: any;
    }

    export interface Segment {
        RPH: string;
        RPHsave?: any;
        Origin: Origin;
        Destination: Destination;
        DepartureDateTime: Date;
        ArrivalDateTime: Date;
        MarketingFlight: string;
        OperatingFlight?: any;
        Status: Status;
        RBD: string;
        OriginRBD?: any;
        UpgradeRBD?: any;
        UpgradeType: number;
        Cabin?: any;
        PassengerRPHs: string[];
        NumberInParty: string;
        MarriageGrp: MarriageGrp;
        Info?: any;
        SelectedOnServiceTab: boolean;
        Comments?: any;
        Active: boolean;
        IsBooked: boolean;
        IsFirstSegment: boolean;
        Equipment?: any;
        IsWithinCheckInWindow: boolean;
        IsARNKOrOPENSegment: boolean;
        FlightCheckIn: FlightCheckIn;
        FlightInfo: FlightInfo[];
        Selected: boolean;
        Operation?: any;
        DepartureDay?: any;
        E_TicketEligibility?: any;
        IsThroughOrChangeOfGaugeFlight?: any;
        Connection?: any;
        Stopover?: any;
        Turnaround?: any;
        IsInternational:boolean;
        IsFlightRestricted:boolean;
    }

    export interface PhoneNumber {
        IsRefValue: boolean;
        Type: string;
        TypeText: string;
        TechType: string;
        TechTypeText: string;
        Value: string;
        Operation?: any;
        OSIText?: any;
        CarrierCode?: any;
        Remark: string;
        LocationCode?: any;
        AreaCityCode: string;
    }

    export interface ApisRequirement {
        DocLevelInd:string;
        AgencyName:string;
        RequiredCodeList:["0","1","3","4","6","7","9","10","11"];
        DocType:string;
        DocTypeText:string;
        DocLevel:string;
    }
    export interface ApisAddressRequirements {
       AgencyName:string;
       Type:string;
    }

    export interface Address {
        IsRefValue: boolean;
        Type: string;
        TypeText: string;
        CityCode?: any;
        Address?: any;
        PostalCode?: any;
        City?: any;
        State?: any;
        CarrierCode?: any;
        Operation: string;
        OSIText?: any;
        AgencyName: string;
        DocLevelInd: string;
        AddressLineRequired: boolean;
        AddressCityRequired?: any;
        AddressStateProvRequired?: any;
        AddressPostalCodeRequired?: any;
        AddressCountryNameRequired?: any;
        AddressCountryCodeRequired?: any;
        AddressRequired?: any;
        CountryCode: string;
        Country: string; 
    }

    export interface Passenger {
        Firstname: string;
        Lastname: string;
        Prefix?: any;
        RPH: string;
        SurnameRefNumber: string;
        SurnameCount: number;
        PassengerTypeCode: string;
        PassengerTypeCodeDesc: string;
        CheckinPassengerType?: any;
        GroupCode?: any;
        GroupedGivenName?: any;
        GivenNameRefNumber:string;
        allowAddPassenger: boolean;
        Fullname: string;
        Selected: boolean;
        AddressDataExists: boolean;
        Addresses: Address[];
        PhoneNumbers: PhoneNumber[];
        OtherAddress: any[];
        Emails: any[];
        SSRDetails?: any;
        PrimaryTickets: any[];
        DateOfBirth: Date;
        Age: string;
        AssociatedAdultRPH?: any;
        AssociatedInfantRPH?: any;
        ApisDocoStatus: string;
        AdcDecisionStatus: string;
        Documents: any[];
        TSTs?: any;
        EMDs?: any;
        FqtTravelers: any[];
        SSRs: any[];
        EmergencyDetails: any[];
        Nationality?: any;
        ExitDate: any;
        ExitDateJustification :any;
        AllowToAddAddress: boolean;
        AgencyForPassenger?: any;
        ApisRequirements: ApisRequirement[];
        ApisAddressRequirements:ApisAddressRequirements[];
        ResidentCardRequired: boolean;
        Operation?: any;
        IsPaxNameHistory: boolean;
        IsPaxTelephoneHistory: boolean;
        IsPaxLoyaltyHistory: boolean;
        CheckInBagCountTotal?: any;
        CheckInBagWeightTotal?: any;
        CheckInAirportCode?: any;
        BaggageInfoToDelete?: any;
        KnownTravelerNumber:string;
        RedressNumber:string;
        OldDateOfBirth: Date;
        OldEmails: any[];
        OldEmergencyDetails: any[]
        OldKnownTravelerNumber: string;
        OldPhoneNumbers: PhoneNumber[];
        OldRedressNumber: string;
        Errors?: any;
        Information?: any;
        Warnings?: any;
        SurnameRefNumberCount:number;
        ShortCheckinArrivalCodesByFlights:any;
    }
    export interface FqtTravelers{
        IsRefValue:boolean;
        LoyalLevel:string;
        MembershipID:string;
        ProgramID:string;
        LoyaltyLevelName:string;
        AwardInformation:string;
        VendorCodes:string;
        Operation:string;
        AllianceTierLevelName:string;
    }

    export interface Status2 {
        StatusCode: string;
        StatusNumber: string;
        ChangeStatusNumber?: any;
        StatusCategory?: any;
        StatusDescription: string;
        Alert?: any;
    }

    export interface Airline {
        Code: string;
        Value?: any;
    }

    export interface OrderRelatedInfo {
        IsRefValue: boolean;
        PassengerRPH?: any;
        Category: string;
        Code: string;
        Description: string;
        AutocompleteText?: any;
        AutocompleteValue?: any;
        Comment: string;
        Status: Status2;
        Quantity: number;
        SegmentRPH?: any;
        Text?: any;
        Airline: Airline;
        Selected: boolean;
        CurrencyCode?: any;
        Amount?: any;
        FlightNumber?: any;
        FreeTextPermission: string;
        FreeTextValidation: string;
        Precondition?: any;
        SampleText: string;
        OldText?: any;
        IsUpdated: boolean;
        IsNonSegmentRelatedService: boolean;
        ReasonForIssuanceCode?: any;
        Operation?: any;
        Seat?: any;
        SeatPreference?: any;
        SeatNumber?: any;
        AirportService: boolean;
        HoverText?: any;
        IsSeatRequestHistory?: boolean;
        IsSSRHistory?: boolean;
        IsOSIHistory?: boolean;
    }

    export interface Status3 {
        StatusCode: string;
        StatusNumber: string;
        ChangeStatusNumber?: any;
        StatusCategory?: any;
        StatusDescription: string;
        Alert: boolean;
    }

    export interface Airline2 {
        Code: string;
        Value?: any;
    }

    export interface Service {
        IsRefValue: boolean;
        PassengerRPH: string;
        Category: string;
        Code: string;
        Description: string;
        AutocompleteText?: any;
        AutocompleteValue?: any;
        Comment?: any;
        Status: Status3;
        Quantity: number;
        SegmentRPH: string;
        Text: string;
        Airline: Airline2;
        Selected: boolean;
        CurrencyCode: string;
        Amount?: any;
        FlightNumber: string;
        FreeTextPermission?: any;
        FreeTextValidation?: any;
        Precondition?: any;
        SampleText?: any;
        OldText?: any;
        IsUpdated: boolean;
        IsNonSegmentRelatedService: boolean;
        ReasonForIssuanceCode?: any;
        Operation?: any;
        Seat?: any;
        SeatPreference?: any;
        SeatNumber: string;
        AirportService: boolean;
        HoverText?: any;
        IsSeatRequestHistory?: any;
        IsSSRHistory?: any;
        IsOSIHistory?: any;
    }

    export interface Airline3 {
        Code: string;
        Value?: any;
    }

    export interface AssociatedService {
        IsRefValue: boolean;
        PassengerRPH: string;
        Category: string;
        Code: string;
        Description: string;
        AutocompleteText?: any;
        AutocompleteValue?: any;
        Comment?: any;
        Status?: any;
        Quantity: number;
        SegmentRPH: string;
        Text?: any;
        Airline: Airline3;
        Selected: boolean;
        CurrencyCode?: any;
        Amount?: any;
        FlightNumber?: any;
        FreeTextPermission?: any;
        FreeTextValidation?: any;
        Precondition?: any;
        SampleText?: any;
        OldText?: any;
        IsUpdated: boolean;
        IsNonSegmentRelatedService: boolean;
        ReasonForIssuanceCode?: any;
        Operation?: any;
        Seat?: any;
        SeatPreference?: any;
        SeatNumber: string;
        AirportService: boolean;
        HoverText?: any;
        IsSeatRequestHistory?: any;
        IsSSRHistory?: any;
        IsOSIHistory?: any;
    }
    
    export interface Seat {
        SeatNumber: string;
        Cabin: string;
        Status: Status;
        Characteristics?: any;
        IsAssigned: boolean;
        SegmentRPH: string;
        PassengerRPH: string;
        FlightLegDepartureAirportCode?: any;
        AssociatedService?: any;
        DepartureCode: string;
        ArrivalCode: string;
        CheckinStatus: string;
        CheckinStatusDescription: string;
        BoardingPriority?: any;
        Timestamp?: any;
        IsChargable: boolean;
        IsPaid: boolean;
        HasPrice?: any;
    }

    export interface BaggageInfo {
        CheckedBagCountTotal?: any;
        HandBagCountTotal?: any;
        UnitOfMeasureQuantity: number;
        UnitOfMeasureCode?: any;
        BaggageDetails?: any;
        BagNumberToDelete?: any;
        BagWeightToDelete?: any;
        SegmentRPH?: any;
        CheckedBagWeightTotal?: any;
        BagTagDetails?:any;
    }

    export interface SegmentTravelerInfo {
        GivenName?: any;
        LastName?: any;
        PassengerRPH: string;
        SegmentRPH: string;
        Services: Service[];
        PaidServices?: any;
        Seats: Seat[];
        CheckinInfos?: CheckinInfo[];
        CheckinPassengerTypeCode:any;
        CheckinPassengerTypeCodeDesc:any;
        BaggageInfo: BaggageInfo;
        TicketNumbers: string[];
        ShortPassDesc: string;
        PassengerFullName?: any;
        Selected: boolean;
        SecurityCode?: any;
        SecurityCodeDesc?: any;
        PassengerRefNumber:string;
    }

    export interface CheckinInfo {
        Status: string;
        StatusDescription: string;
        SequenceNumber?: any;
        PassengerRefNumber: string;
        Timestamp: Date;
        BoardingPriority: string;
        IsOnStandByList: boolean;
        ResBookDesigCode: string;
        UpgradeResBookDesigCode?: any;
        OriginalResBookDesigCode?: any;
        AlternateFlightNumber?: any;
        BookedOnAlternateFlight?: any;
        RebookedToAlternateFlight?: any;
        PassengerMessages?: any;
        PassengerAdditionalInfo: PassengerAdditionalInfo;
    }
    export interface PassengerAdditionalInfo {
        IsDiplomatOrLEO: boolean;
        IsArmedPassenger: boolean;
        IsDisabled: boolean;
        IsInCapacitated: boolean;
        IsMilitary: boolean;
        IsOnOxygen: boolean;
        IsPrisonerGuard: boolean;
        IsUnaccompaniedMinor: boolean;
        IsEticketed: boolean;
        IsFlightDeckJumpSeatIndicator: boolean;
        IsCabinJumpSeatIndicator: boolean;
    }
    export interface Remark {
        IsRefValue: boolean;
        Type: string;
        TypeText: string;
        ID: number;
        Number: number;
        Text: string;
        RPH: string;
        Operation?: any;
    }

    export interface ConfidentialRemark {
        IsRefValue: boolean;
        Type?: any;
        TypeText?: any;
        ID: number;
        Number: number;
        Text?: any;
        RPH?: any;
        Operation?: any;
    }

    export interface AgencyRemark {
        IsRefValue: boolean;
        Type?: any;
       TypeText?: any;
        ID: number;
        Number: number;
        Text?: any;
        RPH?: any;
        Operation?: any;
    }

    export interface Status4 {
        StatusCode?: any;
        StatusNumber?: any;
        ChangeStatusNumber?: any;
        StatusCategory?: any;
        StatusDescription?: any;
        Alert?: any;
    }

    export interface TimeLimit {
        CityCode: string;
        AirlineCode: string;
        QueueNumber?: any;
        AlertDate: Date;
        AlertTime: Date;
        AlertText?: any;
        Operation?: any;
        IsTmpData: boolean;
        Status: Status4;
    }

    export interface RootObject {
        ID: string;
        Segments: Segment[];
        OrderHistory?: any;
        TravelerData?: any;
        FareQuoteHistory?: any;
        OrderFQTVStatus?: any;
        ModifiedDateOnly?: any;
        ModifiedTime?: any;
        Passengers: Passenger[];
        OrderRelatedInfos: OrderRelatedInfo[];
        SegmentTravelerInfos: SegmentTravelerInfo[];
        Remarks: Remark[];
        ConfidentialRemarks: ConfidentialRemark[];
        AgencyRemarks: AgencyRemark[];
        Split?: any;
        TimeLimits: TimeLimit[];
        Claim?: any;
        SearchOrderResult?: any;
        SearchType?: any;
        IsStandaloneTicket?: any;
        IsStandaloneEmd?: any;
        AdditionalTickets?: any;
        IsOutOfSyncTicket?: any;
        AdditionalTSTs?: any;
        ReceivedFrom?: any;
        OrderSource?: any;
        PricingInformation?: any;
        IsSSRHistoryIncluded?: any;
        IsSeatRequestHistoryIncluded?: any;
        IsOSIHistoryIncluded?: any;
        IsPaxNameHistoryIncluded?: any;
        IsPaxTelephoneHistoryIncluded?: any;
        IsPaxLoyaltyHistoryIncluded?: any;
        IsSeatmapRequestedFromInputWindow?: any;
        Warnings?:any;      
    }

    /* Flight Models */

    
    export interface PassengerFlightInfo {
        IsInternational: boolean;
        BoardingInitiated: boolean;
        StandbyClearanceInitiated: boolean;
        DepartureTime: Date;
        DestinationAirport: string;
        IsUTC: boolean;
        OperatingFlightNumber?: any;
        FlightNumber: string;
        BookingClass?: any;
        NewFlightNumber?: any;
        DepartureDate: Date;
        DepartureAirport: string;
    }

    export interface InboundConnectingFlight {
        FlightNumber: string;
        LocationCode: string;
    }

    export interface SpecialServiceRequest {
        Text: string;
        Airline?: any;
        Operation: number;
        SSRCode: string;
        ServiceQuantity: number;
        Status: string;
    }

    export interface PassengerList {
        OrderId: string;
        PassengerType?: any;
        PassengerRPH: string;
        FlightRPH?: any;
        SeatList?: any;
        SequenceNumber?: any;
        PassengerRefNumber: string;
        CheckinDateTime?: any;
        Status: string;
        GivenName: string;
        Surname: string;
        AlternateFlightNumber?: any;
        Dest: string;
        BoardingPriority?: any;
        SeatNumber?: any;
        ResBookDesigCode: string;
        UpgradeResBookDesigCode?: any;
        InboundConnectingFlight: InboundConnectingFlight;
        OutboundConnectingFlight?: any;
        ServiceCombinedString: string;
        SSRs: string[];
        StandbyPassengerType: string;
        StandbyRank: number;
        IsStandbyForUpgrade: boolean;
        SecurityCode?: any;
        CheckedBagCount: number;
        BagTags?: any;
        PassengerCharacteristics: string[];
        INFGivenName?: any;
        INFSurname?: any;
        INFDOB?: any;
        PassengerMessages?: any;
        SpecialServiceRequest: SpecialServiceRequest[];
        AssociatedAdultRPH: string;
        FqtTravelers:  any[];
        InfantIndicator: string;
        Oversold: boolean;
        SyncTicket: boolean;
        OnStandby: boolean;
    }

    export interface PassengerDetailList {
        FlightInfo: PassengerFlightInfo;
        GroupedPassengerList?: any;
        PassengerList: PassengerList[];
        Errors?: any;
        Information?: any;
        Warnings?: any;
    }

/* Checkin Models */

export interface CheckInOptions {
        UnaccompaniedMinor: boolean;
        DisabledPassenger: boolean;
        PreferredPassenger: boolean;
        StandbyUpgrade: boolean;
        Standby: boolean;
        ExtraSeat: boolean;
        NonRevenueCategory?: any;
    }

    export interface FrequentFlyerProgram {
        ProgramIDxx?: any;
        MembershipID?: any;
    }

    export interface CheckinPassengerList {
        OrderID: string;
        PassengerRefNumber: string;
        Firstname: string;
        Surname: string;
        Lastname: string;
        RPH: string;
        SurnameRefNumber: string;
        PassengerTypeCode: string;
        Selected: boolean;
        CheckInOptions: CheckInOptions;
        FrequentFlyerProgram: FrequentFlyerProgram;
    }

    export interface SegmentList {
        RPH: string;
        DepartureDateTime: Date;
        ArrivalDateTime: Date;
        MarketingFlight: string;
        DepartureCity: string;
        Seats: Seat[];
        StatusCategory: string;
        RBD: string;
        PassengerRPHs: string[];
        SegmentRPH: string;
        FlightCheckIn: FlightCheckIn;
        FlightInfo?: any;
        Selected: boolean;
        IsThroughOrChangeOfGaugeFlight: boolean;
    }

    export interface CheckinObject {
        CheckInType: string;
        PassengerList: CheckinPassengerList[];
        SegmentList: SegmentList[];
    }



}
export module FlightPassengerList {

    export interface Equipment {
        AirEquipType: string;
        AircraftTailNumber: string;
    }

    export interface FlightInfo {
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
        FlightNumber: string;
        BookingClass?: any;
        NewFlightNumber?: any;
        EndPassengerSeqNumber?: any;
        GivenName?: any;
        Surname?: any;
        PassengerSeqNumber?: any;
        RPH?: any;
        Option?: any;
        BagTagOption?: any;
        DepartureDate: Date;
        DepartureAirport: string;
    }

    export interface SeatList {
        SeatAvailability?: any;
        SeatNumber: string;
        SeatCharacteristics?: any;
        DepartureCode: string;
        Cabin: string;
        IsThruSeatNeeded: boolean;
    }

    export interface InboundConnectingFlight {
        FlightNumber: string;
        LocationCode: string;
    }

    export interface SpecialServiceRequest {
        Text: string;
        Airline?: any;
        Operation: number;
        SSRCode: string;
        ServiceQuantity: number;
        Status: string;
    }

    export interface FqtTraveler {
        IsRefValue: boolean;
        LoyalLevel?: any;
        LoyaltyLevelName?: any;
        MembershipID: string;
        ProgramID: string;
        AwardInformation?: any;
        MembershipNumber?: any;
        VendorCodes?: any;
        Operation?: any;
    }

    export interface OtherServiceInfo {
        Text: string;
        Airline?: any;
        Operation: number;
        SSRCode?: any;
        ServiceQuantity: number;
        Status?: any;
    }

    export interface PassengerList {
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
        BoardingPriority?: any;
        SeatNumber?: any;
        ResBookDesigCode: string;
        UpgradeResBookDesigCode?: any;
        InboundConnectingFlight: InboundConnectingFlight;
        OutboundConnectingFlight?: any;
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
        FqtTravelers: any[];
        OtherServiceInfo: OtherServiceInfo[];
        InfantIndicator:string;
        SyncTicket: boolean;
        OnStandby: boolean;

    }

    export interface RootObject {
        FlightInfo: FlightInfo;
        GroupedPassengerList?: any;
        PassengerList: PassengerList[];
        Errors?: any;
        Information?: any;
        Warnings?: any;
    }

}


export module Departures
{
      export interface AirportDeparture {
        ScheduledDepartureDate: Date;
        ScheduledArrivalDate: Date;
        ExpectedDepartureDate: Date;
        ExpectedArrivalDate: Date;
        DestinationAirport: string;
        Carrier: string;
        FlightNumber: string;
        CheckInStatus: string;
        Gate?: any;
        Destination: string;
        FlightStatus: string;
        configurations: Configuration[];
    }

    export interface RootObject {
        AirportDepartures: AirportDeparture[];
        Errors?: any;
        Information?: any;
        Warnings?: any;
    }
         export interface Configuration{
        CodeLetter: string;
        Capacity: string;
        Booked: string;
        BoardingTime: string;
     }

}

export module FQTV {

    export interface OrderFQTVStatus {
        OrderID: string;
        PassengerName: string;
        Status: string;
        FlightNumber: string;
        RPH: string;
        Origin:string;
    }

    export interface RootObject {
        ID?: any;
        Segments?: any;
        OrderHistory?: any;
        TravelerData?: any;
        FareQuoteHistory?: any;
        OrderFQTVStatus: OrderFQTVStatus[];
        ModifiedDateOnly?: any;
        ModifiedTime?: any;
        Passengers?: any;
        OrderRelatedInfos?: any;
        SegmentTravelerInfos?: any;
        Remarks?: any;
        ConfidentialRemarks?: any;
        AgencyRemarks?: any;
        Split?: any;
        TimeLimits?: any;
        Claim?: any;
        SearchOrderResult?: any;
        SearchType?: any;
        IsStandaloneTicket?: any;
        IsStandaloneEmd?: any;
        AdditionalTickets?: any;
        IsOutOfSyncTicket?: any;
        AdditionalTSTs?: any;
        ReceivedFrom?: any;
        OrderSource?: any;
        PricingInformation?: any;
        IsSSRHistoryIncluded?: any;
        IsSeatRequestHistoryIncluded?: any;
        IsOSIHistoryIncluded?: any;
        IsPaxNameHistoryIncluded?: any;
        IsPaxTelephoneHistoryIncluded?: any;
        IsPaxLoyaltyHistoryIncluded?: any;
        IsSeatmapRequestedFromInputWindow?: any;
        Errors?: any;
        Information?: any;
        Warnings?: any;
    }
}

export module AccountProfile 
{
    export interface Link {
        URL: string;
        Description: string;
    }

    export interface Privilege {
        Name: string;
        Constraints: string[];
    }

    export interface RootObject {
        Username: string;
        FirstName: string;
        LastName: string;
        AgentDutyCode: string;
        AgentSine: string;
        AirportCode: string;
        PseudoCityCode: string;
        Requestor_ID: string;
        Requestor_Type: string;
        CarrierCode: string;
        LblIataCodeOnly: number;
        ERSP_UserID: string;
        Language: string;
        Links: Link[];
        Roles: string[];
        Privileges: Privilege[];
        EmailAddress: string;
        Currencies: string[];
    }
}

export module SecurityValidation {

    export class PhoneNumber {
        IsRefValue: boolean;
        Type: string;
        TypeText: string;
        TechType: string;
        TechTypeText: string;
        Value: string;
        Operation?: any;
        OSIText?: any;
        CarrierCode?: any;
        Remark?: any;
        LocationCode?: any;
        AreaCityCode: string;
    }

    export class FqtTraveler {
        IsRefValue: boolean;
        LoyalLevel?: any;
        LoyaltyLevelName?: any;
        MembershipID: string;
        ProgramID: string;
        AwardInformation?: any;
        MembershipNumber: string;
        VendorCodes: string;
        Operation?: any;
    }
     export class AssociatedPassenger
    {
        SurnameRefNumber:string;
        Firstname:string;
        Lastname:string;
        RPH:string;
    }

    export class Document {
        DocFeature: string;
        DocType: string;
        DocId: string;
        ExpireDate: string;
        MrzString: string;
    }

    export class RootObject {
        Firstname: string;
        Lastname: string;
        SurnameRefNumber: string;
        RPH: string;
        Emails: any[];
        PassengerTypeCode: string;
        PhoneNumbers: PhoneNumber[];
        DateOfBirth: Date=null;
        Age?: any;
        FqtTravelers: FqtTraveler[];
        EmergencyDetails: any[];
        OldEmergencyDetails:any[]=[];
        documents: Document[];
    }

}

export module CountryCollection {

    export class CountrDetail{
        CountryName:string;
        CountryCode:string;
        PhoneAccessCode:string;
        ISO3CountryCode:string;
    }
    export class Collection {
        Collection:CountrDetail[];
        Errors: null;
        Information: null;
        Warnings: null;
    }
}


export module CityCollection
{
    export class CityDetail{
        CityName:string;
        LocationCode:string;
        CountryName:string;
        CountryCode:string;
    }
    export class Collection{
        Collection:CityDetail[];
    }
}

export module seatModel {
    
    export interface Origin {
        AirportName: string;
        CityName: string;
        LocationCode: string;
        CountryName: string;
        CountryCode: string;
    }


    export interface Destination {
        AirportName: string;
        CityName: string;
        LocationCode: string;
        CountryName: string;
        CountryCode: string;
    }

    export interface SeatProductInformation {
        SSRCode?: any;
        TypeOfService: string;
        SubCode: string;
        RFIC: string;
        EMD_TypeCode: string;
        OTACode: string;
        Description: string;
        ToolTip: string;
        SHARESCode: string;
        ProductName: string;
    }
    export interface FlightSegment {
        RPH: number;
        DepartureDateTime: Date;
        ArrivalDateTime: Date;
        EquipmentType: string;
        Flight: string;
        OperatingFlight?: any;
        Origin: Origin;
        Destination: Destination;
        IsUTC: boolean;
        HasSurnamePrefix: boolean;
        HasStopover: boolean;
        ResBookDesigCode?: any;
        Status?: any;
        CouponInfo?: any;
        IsChangeOfGauge: boolean;
    }

    export interface AirSeatList {
        SeatAvailability: string;
        SeatNumber: string;
        SeatCharacteristics: string[];
        ReconciledStatus: number;
        SeatPriceList?: any;
    }


    export interface AirRowList {
        RowNumber: string;
        AirSeatList: AirSeatList[];
        RowCharacteristics: string[];
    }

    export interface CabinList {
        CabinType: string;
        Name: string;
        AirRowList: AirRowList[];
    }

    export interface RootObject {
        Items: Item[];
       
        Errors?: any;
        Information?: any;
        Warnings?: any;
    }
      export interface Item {
        FlightSegment: FlightSegment;
        CabinList: CabinList[];
        SeatProductInformation: SeatProductInformation[];
        Errors?: any;
        Information?: any;
        Warnings?: any;
    }

    
}


export module Inventory{
    export class inven{
        Booking:string;
        Capacity:string;
        CodeLetter:string;
    }
    export class RootObject{
        inven : inven[];
    }
}

export module FqtvPrograms {

    export interface Value {
        ProgramID: string;
        ProgramName: string;
        Carrier: string;
        Alliance: string;
    }

    export interface FqtvProgram {
        Key: string;
        Value: Value;
    }

    export interface ReferenceInfo {
        FqtvPrograms: FqtvProgram[];
    }

    export interface RootObject {
        ReferenceInfo: ReferenceInfo[];
    }

}

export module FQTVUpdate {

    export class FqtTraveler {
       public MembershipID: string;
       public  IsRefValue: boolean;
       public  Operation: string;
        public VendorCodes: string;
        public ProgramID : string;
    }

    export class Traveler {
        public Firstname: string;
        public Lastname: string;
        public Prefix?: any;
        public PrefixText?: any;
        public RPH: number;
        public SurnameRefNumber: number;
        public PassengerTypeCode: string;
        public FqtTravelers: Array<FqtTraveler>= [];
        public DateOfBirth: Date;
        public Age?: any;
        public AssociatedInfantRPH: number;
    }

    export class RootObject {
       public  OrderId: string;
        public Changes: string[];
        public ReturnOrder: boolean;
        public Traveler: Traveler;
    }


}

export class Legs {
    SequenceNumber: number;
    DepartureAirport: DepartureAirport;
    ArrivalAirport: ArrivalAirport;
    DepartureGate?: any;
    ArrivalGate?: any;
    DepartureDateTime: DepartureDateTime;
    ArrivalDateTime: ArrivalDateTime;
    UtcOffset: string;
    isActualDepartureDateExist: boolean;
    isEstimatedDepartureDateExist: boolean;
    isActualArrivalDateExist: boolean;
    isEstimatedArrivalDateExist: boolean;
    DepartureOperationText?: any;
    ArrivalOperationText?: any;
    AircraftType: string;
    Tail: string;
    DepartureDelay: string;
    ArrivalDelay: string;
    Status: string;
    isLegSelected : boolean = false;
}
export class DepartureAirport {
    AirportName: string;
    FlagStopInd?: any;
    CityName?: any;
    LocationCode: string;
    CountryName?: any;
    CountryCode?: any;
    PhoneAccessCode?: any;
    ISO3CountryCode?: any;
}

export class ArrivalAirport {
    AirportName: string;
    FlagStopInd: boolean;
    CityName?: any;
    LocationCode: string;
    CountryName?: any;
    CountryCode?: any;
    PhoneAccessCode?: any;
    ISO3CountryCode?: any;
}

export class DepartureDateTime {
    Scheduled: Date;
    Estimated: Date;
    Actual: Date;
}

export class ArrivalDateTime {
    Scheduled: Date;
    Estimated: Date;
    Actual: Date;
}





export  module SeatMapOAPax {
    
        export class Passenger {
            Firstname: string;
            Lastname: string;
            PassengerTypeCode: string;
            OrderId: string;
            RPH: string;
            GroupPNR: boolean;
        }
    
        export class OptionalFeeOptions {
            TicketDateOfIssue?: any;
            AccountCode?: any;
            TicketDesignator?: any;
            TourCode?: any;
        }
    
        export class RootObject {
            Passengers: Passenger[];
            OptionalFeeOptions: OptionalFeeOptions;
        }
    
    }