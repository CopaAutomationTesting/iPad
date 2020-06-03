export module CompensationSearchModule {
    export class CompensationRootObject {
        public FlightModel: FlightModel;
        public PassengerList: Array<CompensationPassengerList> = [];

    }

    export class FlightModel {
        public FlightSegmentId: number;
        public DestinationAirport: string = "";
        public DepartureAirport: string = "";
        public FlightNumber: string = "";
        public DepartureDate: string = "";
        public STA: string = "";
        public ETD: string = "";
        public STD: string = "";
        public Status: string = "";
        public DepartureDateTime:  string = "";
        public ArrivalDateTime: Date;
        public finalDestination = "";
        public multiLegFlight : boolean = false;
        public Legs: Array<string> =[];
    }
    export class CompensationPassengerList {
        public GivenName: string = "";
        public LastName: string = "";
        public FullName: string = "";
        public SSRs: Array<string> = [];
        public Tier: string = "";
        public Cabin: string ;
        public CheckedInIndicator: string = "";
        public OrderId: string = "";
        public PaxType: string = "";
        public CompensationReason: string = "";
        public AdditionalDetails: string = "";
        public OutboundIndicator : string = "";
        public IsSelected: boolean = false;
        public PassengerType: string = "";
        public TierName: string = "";
        public isParitallyPrinted : boolean = false;
        public isEmailParitallySent : boolean = false;
        public isNotPrinted : boolean =false;
        public isEmailSent: boolean = false;
        public CompensationReasonId: number;
        public monetarycount : number;
        public IsExistingCompensation: boolean = false;
        public SSR?: SSR[];
        public SSRsCount : number;
        public FlightSegmentId: number;
        public PassengerSeq?: any;
        public SurnameNum?: any;
        public WorldTracerNum : string = "";
        public CustomerCareCaseNum: string = "";
        public FirstnameNum?: any;
        public FqtvCc?: any;
        public FqtvTier: any;
        public FqtvNumber?: any;
        public PaxStatus?: any;
        public PaxRPH: any;
        public Dest : string;
        public PaxSplChar : string;
        public Origin : string;
        public EticketIndicator :boolean = false;
        public OverrideReason : string ="";
        public isMonetaryOverridden :boolean = false;
        public MonetaryOverrideReason : string = "";
        public isMonetaryParitallyPrinted : boolean = false;
        public isMealParitallyPrinted : boolean = false;
        public isHotelsParitallyPrinted : boolean = false;
        public isTransportParitallyPrinted : boolean = false;
        public isHotelOverridden :boolean = false;
        public HotelOverrideReason : string = "";
        public isMealOverridden :boolean = false;
        public MealOverrideReason : string = "";
        public isTransportOverridden :boolean = false;
        public TransportOverrideReason : string = "";
        public PaxEmailAddress?: any;
        public UpdateLockNbr?: any;
        public BoardingIndicator : any;
        public NonRevenueIndicator: any;
        public EticketStatus: any;
        public IsCompensationIssued: boolean = false;
        public IsCompensationNotIssued : boolean = false;
        public Etkt?: Etkt[];
        public EtktNumbr : string = "";
        public EticketOutofSyncIndicator : any;
        public ReaccomDetails?: ReaccomDetail[];
        public Bags?: Bag[];
        public Compensations?: Compensation[];
        public ExistingCompensations?: ExistingCompensation[];
        public BRECompensation: BRECompensation[];
        public type: string;
        public monetary: number =0;
        public monetaryInitialValue : number;
        public monetaryTempValue : number;
        public monetaryLowerLimit: number;
        public monetaryHigherLimit: number;
        public monetaryPrintStatus : boolean = false;
        public monetaryEmailStatus :boolean = false;
        public hotel: number =0;
        public hotelInitialValue : number;
        public hotelTempValue : number;
        public hotelLowerLimit: number;
        public hotelHigherLimit: number;
        public hotelPrintStatus : boolean = false;
        public meal: number =0;
        public mealInitialValue : number;
        public mealTempValue : number;
        public mealLowerLimit: number;
        public mealHigherLimit: number;
        public mealPrintStatus : boolean = false;
        public transportation: number =0;
        public transportationInitialValue : number;
        public transportationTempValue : number;
        public transportationLowerLimit: number;
        public transportationHigherLimit: number;
        public transportPrintStatus : boolean = false;
        public BREEmd: BREEmd[];
        public Email: string = "";
        public monetaryendorsementTextItems: string[];
        public monetaryfreeText : string = "";
        public hotelendorsementTextItems: string[];
        public hotelFreeText : string = "";
        public hotelDetails : string ="";
        public mealendorsementTextItems: string[];
        public mealFreeText : string = "";
        public mealDetails : string = "";
        public transportEMD : string = "";
        public transportationendorsementTextItems: string[];
        public transportFreeText : string = "";
        public copyToSelectedPax : boolean = false;
        public copyToSelectedPaxReaccom : boolean = false;
    }
    export class BREEmd {
        public compensationCause: string;
        public compensationType: string;
        // public emdEndorsable: boolean;
        // public emdExchangeable: boolean;
        public currency: string;
        public emdRefundable: boolean;
        public emdType: string;
        // public emdUsedAtIssuance: boolean;
        public endorsementTextItems: string[];
        public formOfPayment: string;
        public productCode: string;
        public productName: string;
        public subProductCode: string;
        public accountCode:string;
        public emdEndorsable:string;
        public emdExchangeable: string;
        public emdUsedAtIssuance : string;
        public IsRefundable: string;
    }
    export class BRECompensation {
        public amount: number;
        public compensationType: string;
        public lowerLimit: number;
        public upperLimit: number;
    }
    export class SSR {
        public FlightSegmentId: number;
        public PassengerSeq: number;
        public SsrCode: string;
    }

    export class Etkt {
        public FlightSegmentId: number;
        public PassengerSeq: number;
        public TicketNbr: string;
        public CpnNum: string;
    }

    export class ReaccomDetail {
        public FlightSegmentId: number;
        public PassengerSeq: number;
        public ReacomSeq: number;
        public FromToFlag: string;
        public GUIDisplayFlag: string;
        public ReaccomAirlineCode: string;
        public ReaccomFlightNo: string="";
        public ReaccomFlightDt: string;
        public ReaccomBoardCityCd: string;
        public ReaccomOffCityCd: string;
        public UpdateLockNbr: number;
    }

    export class Bag {
        public FlightSegmentId: number;
        public PassengerSeq: number;
        public BagtagNbr: string;
        public UpdateLockNbr: number;
    }

    export class CompEmd {
        public FlightSegmentId: number;
        public PassengerSeq: number;
        public CompSeq: string;
        public PrimaryDocumentNbr: string;
        public PrimaryAirlineCd: string;
        public IssueDt: string;
        public FirstNm: string;
        public LastNm: string;
        public UserId: string;
        public ReasonForIssuanceSubCd: string;
        public ReasonForIssuanceCd: string;
        public Endorsements1Txt: string;
        public RemarkTxt: string;
        public CompAmt: number;
        public CompCurrencyCd: string;
        public VoucherCnt: string;
        public OverrideReason?: any;
        public PrintStatus: string;
        public EmailStatus: string;
    }

    export class Compensation {
        public FlightSegmentId: number;
        public PassengerSeq: number;
        public CompSeq: string;
        public CompReasonId: number;
        public CompReasonText: string;
        public CompTypeId: string;
        public CompTypeText: string;
        public AirlineCode: string;
        public FlightNo: string;
        public DepartureDt: string;
        public CompAmt: number;
        public CompCurrencyCd: string;
        public VoucherCnt: string;
        public OverrideReason: string;
        public UpdateLockNbr: number;
        public Emds: CompEmd[];
    }

    export class ExistCompEmd {
        public FlightSegmentId: number;
        public PassengerSeq: number;
        public CompSeq: string;
        public PrimaryDocumentNbr: string;
        public PrimaryAirlineCd: string;
        public IssueDt: string;
        public FirstNm: string;
        public LastNm: string;
        public UserId: string;
        public ReasonForIssuanceSubCd: string;
        public ReasonForIssuanceCd: string;
        public Endorsements1Txt: string;
        public RemarkTxt: string;
        public CompAmt: number;
        public CompCurrencyCd: string;
        public VoucherCnt: string;
        public OverrideReason?: any;
        public PrintStatus: string;
        public EmailStatus: string;
    }

    export class ExistingCompensation {
        public FlightSegmentId: number;
        public PassengerSeq: number;
        public CompSeq: string;
        public CompReasonId: string;
        public CompReasonText: string;
        public CompTypeId: string;
        public CompTypeText: string;
        public CompAmt: number;
        public AirlineCode: string;
        public DepartureDt: string;
        public FlightNo : any;
        public CompCurrencyCd: string;
        public VoucherCnt: string;
        public OverrideReason: string;
        public UpdateLockNbr: number;
        public Emds: ExistCompEmd[];
    }
}

export class OrderFQTVStatus {
    public OrderID: string;
    public PassengerName: string;
    public Status: string;
    public FlightNumber: string;
    public FlightDate: Date;
    public RPH: string;
    public Origin: string;
    public Destination: string;
    public IsSelected: boolean = false;
}

export module CompensationOrderID {

    export class BREEmd {
        public compensationCause: string;
        public compensationType: string;
        public emdEndorsable: boolean;
        public emdExchangeable: boolean;
        public currency: string;
        public emdRefundable: boolean;
        public emdType: string;
        public emdUsedAtIssuance: boolean;
        public endorsementTextItems: string[];
        public formOfPayment: string;
        public productCode: string;
        public productName: string;
        public subProductCode: string;
    }
    export class BRECompensation {
        public amount: number;
        public compensationType: string;
        public lowerLimit: number;
        public upperLimit: number;
    }
    export class SSR {
        public FlightSegmentId: number;
        public PassengerSeq: number;
        public SsrCode: string;
    }

    export class Etkt {
        public FlightSegmentId: number;
        public PassengerSeq: number;
        public TicketNbr: string;
        public CpnNum: string;
    }

    export class ReaccomDetail {
        public FlightSegmentId: number;
        public PassengerSeq: number;
        public ReacomSeq: number;
        public FromToFlag: string;
        public GUIDisplayFlag: string;
        public ReaccomAirlineCode: string;
        public ReaccomFlightNo: string="";
        public ReaccomFlightDt: string;
        public ReaccomBoardCityCd: string;
        public ReaccomOffCityCd: string;
        public UpdateLockNbr: number;
    }

    export class Bag {
        public FlightSegmentId: number;
        public PassengerSeq: number;
        public BagtagNbr: string;
        public UpdateLockNbr: number;
    }

    export class CompEmd {
        public FlightSegmentId: number;
        public PassengerSeq: number;
        public CompSeq: string;
        public PrimaryDocumentNbr: string;
        public PrimaryAirlineCd: string;
        public IssueDt: string;
        public FirstNm: string;
        public LastNm: string;
        public UserId: string;
        public ReasonForIssuanceSubCd: string;
        public ReasonForIssuanceCd: string;
        public Endorsements1Txt: string;
        public RemarkTxt: string;
        public CompAmt: number;
        public CompCurrencyCd: string;
        public VoucherCnt: string;
        public OverrideReason?: any;
    }

    export class Compensation {
        public FlightSegmentId: number;
        public PassengerSeq: number;
        public CompSeq: string;
        public CompReasonId: number;
        public CompReasonText: string;
        public CompTypeId: string;
        public CompTypeText: string;
        public AirlineCode: string;
        public FlightNo: string;
        public DepartureDt: string;
        public CompAmt: number;
        public CompCurrencyCd: string;
        public VoucherCnt: string;
        public OverrideReason: string;
        public UpdateLockNbr: number;
        public Emds: CompEmd[];
    }

    export class ExistCompEmd {
        public FlightSegmentId: number;
        public PassengerSeq: number;
        public CompSeq: string;
        public PrimaryDocumentNbr: string;
        public PrimaryAirlineCd: string;
        public IssueDt: string;
        public FirstNm: string;
        public LastNm: string;
        public UserId: string;
        public ReasonForIssuanceSubCd: string;
        public ReasonForIssuanceCd: string;
        public Endorsements1Txt: string;
        public RemarkTxt: string;
        public CompAmt: number;
        public CompCurrencyCd: string;
        public VoucherCnt: string;
        public OverrideReason?: any;
    }

    export class ExistingCompensation {
        public FlightSegmentId: number;
        public PassengerSeq: number;
        public CompSeq: string;
        public CompReasonId: string;
        public CompReasonText: string;
        public CompTypeId: string;
        public CompTypeText: string;
        public CompAmt: number;
        public AirlineCode: string;
        public DepartureDt: string;
        public FlightNo : any;
        public CompCurrencyCd: string;
        public VoucherCnt: string;
        public OverrideReason: string;
        public UpdateLockNbr: number;
        public Emds: ExistCompEmd[];
    }
    
    export class Passenger {
        Isselected : boolean =false;
        FlightSegmentId?: number;
        PassengerSeq?: number;
        OrderId: string;
        FullName :string;
        GivenName : string;
        LastName : string;
        PaxLastNm: string;
        PaxFirstNm: string;
        PaxType: string;
        FqtvCc?: any;
        FqtvNumber?: any;
        PaxStatus?: any;
        PaxEmailAddress?: any;
        PaxCompReasonID: string;
        WorldTracerNum : string;
        CustomerCareCaseNum: string;
        IsExistingCompensation: boolean = false;
        CompensationReason : string;
        UpdateLockNbr?: number;
        AdditionalDetails : string;
        FqtvTier: string;
        CompensationReasonId : number;
        Cabin: string;
        PaxRPH: string;
        IsCompensationIssued: boolean;
        SSR?: SSR[];
        Etkt?: Etkt[];
        ReaccomDetails?: ReaccomDetail[];
        Bags?: Bag[];
        Compensations?: Compensation[];
        ExistingCompensations?: ExistingCompensation[];
        BRECompensation: BRECompensation[];
        type: string;
        monetary: number;
        monetaryLowerLimit: number;
        monetaryHigherLimit: number;
        hotel: number;
        hotelLowerLimit: number;
        hotelHigherLimit: number;
        meal: number;
        mealLowerLimit: number;
        mealHigherLimit: number;
        transportation: number;
        transportationLowerLimit: number;
        transportationHigherLimit: number;
        BREEmd: BREEmd[];
        Email: string;
        public monetaryendorsementTextItems: string[];
        public monetaryfreeText : string = "";
        public hotelendorsementTextItems: string[];
        public hotelFreeText : string = "";
        public hotelDetails : string ="";
        public mealendorsementTextItems: string[];
        public mealFreeText : string = "";
        public transportationendorsementTextItems: string[];
        public transportFreeText : string = "";
    }

    export class FlightSegment {
        IsSegSelected : boolean;
        FlightSegmentId?: number;
        AirlineCode: string;
        FlightNo: string;
        DepartureDt: string;
        Departure: string;
        Arrival: string;
        FlightSegmentRPH?: any;
        Passengers: Passenger[];
    }

    export class RootObject {
        FlightSegments: FlightSegment[];
        Errors?: any;
    }

}


export class IssueCompensationList {
    public IsSelected: boolean = false;
    public FullName: string = "";
    public SSR: string = "";
    public Tier: string = "";
    public Cabin: string = "";
    public OrderId: string = "";
    public Amt: string = "";
    public Hotel: string = "";
    public Meal: string = "";
    public Trans: string = "";
    public Email: string = "Edit";
    public AdditionalDetails: string = "Edit";
}
declare module namespace {

    export class Passenger {
        givenName: string;
        orderId: string;
        surname: string;
        passengerType: string;
        tierLevel: string;
        cabinClass: string;
        compensationCause: string;
        flightNumber: string;
    }

    export class Flight {
        flightNumber: string;
        fromCountry?: any;
        toCountry?: any;
    }

    export class RootObject {
        carrierCode: string;
        privilege: string;
        passengers: Passenger[];
        flights: Flight[];
    }

}
export module CompensationReasonModule {

    export class CompensationReason {
        CompReasonId: number;
        CompReasonText: string;
    }

    export class RootObject {
        ResponseFor?: any;
        CompensationReason: CompensationReason[];
        Success: boolean;
        Errors?: any;
        Information?: any;
        Warnings?: any;
    }

}


