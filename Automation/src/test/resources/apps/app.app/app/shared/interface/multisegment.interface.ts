export module MultiSegmentTemplate {
    export class RootObject {
        public Segment: Array<FlightWithPax> = [];
        public Warning:any;
        // public CheckInType: string = "CheckIn";
        // public SegmentList: Array<SegmentList> = null;
        // public PassengerList: Array<PassengerList> = null;

    }

    export class FqtTraveler {

        public ProgramID: string = null;
        public MembershipID: string = null;
    }
    export class FlightWithPax {
        // public PaxDetails: Array<PaxTemplate> = [];
        public FlightNumber: string = "";
        public MarketingFlight: string = "";
        public FlightDate: string = "";
        public FlightStatus: string = "";
        public Origin: string = "";
        public Destination: string = "";
        public OriginCity: string = "";
        public InboundDetail:string = "";
        public DestinationCity: string = "";
        public STD: string = "";
        public ETD: string = "";
        public ETA: string = "";
        public Legs: any = null;
        // Properties needed to check in the pax
        public RPH: string = "";
        public RBD: string = "";

        public date: string = "";
        public DepartureDateTime: Date = null;
        public ArrivalDateTime: Date = null;

        public DepartureCity: string = "";
        public Seats: string = null;
        public StatusCategory: string = "Confirmed";

        public PassengerRPHs: Array<string> = [];
        public SegmentRPH: string = "";
        public FlightCheckIn: string = null;
        public FlightInfo: any = null;
        public Selected: boolean = true;
        public IsThroughOrChangeOfGaugeFlight: boolean = false;
        public Connection: string = "";
        public Stopover: string = "";
        public StatusNumber: string = "";
        public Turnaround: string = "";
        public OperatingFlight: string = "";
        public Passenger: Array<Passenger> = [];
        public inbound: number = 0;
        public outbound: number = 0;
        public inven: Array<inven> = [];
        public status: string = "";
        public IsInternational:boolean;
        public APISRequired:boolean =false;
        public isAPISSeatBagDisabled : boolean = true;
        public IsInterline:boolean=false;
        public ETKTStatusNOTOK:boolean = false;
        public IsFlightRestricted:boolean = false;
        public isShortCheckin : boolean = false;
        

    }
    export class inven {
        public Booking: string = "";
        public Capacity: string = "";
        public CodeLetter: string = "";
    }
    export class Passenger {
        public FirstName: string = "";
        public LastName: string = "";
        public FullName: string = "";
        public OrderID: string = "";
        public PassengerType: string = "";
        public StandbyPassengerType: string = "";
        public TierLevel: string = "";
        public StarLevel:string="";
        public FQTVNumber: string = "";
        public IsSecurityDocsComplete: boolean = false;
        public SecurityDocStatus: string = "";
        public BagCount: number = 0;
        public UnitOfMeasureQuantity: number;
        public UnitOfMeasureCode: string = "";
        public SeatNumber: string = "";
        public Cabin : string = "";
        public TotalWeight: number = 0;
        public SSR: Array<string> = [];
        public EMD: string = "";
        public Documents:any[];
        public CheckinPassengerType: string="";
        // public FlightDetails: Array<FlightInfo> = [];
        // Properties needed to check in the pax
        public SurnameRefNumber: string = "";
        public SurnameRefNumberCount: number;
        public SurName: string = "";
        public RPH: string = "";
        public Selected: boolean = false;
        public FQTVAirline: string = "";
        public ApisDocoStatus: string = "";
        public AdcDecisionStatus:string= "";
        public SecurityCode:string="";
        public SecurityCodeDesc:string="";
        public SecurityValue:any=null;
        public PassengerTypeCode: string = "";
        public ProgramIDxx: string = "";
        public PassengerRefNumber: string = null;
        public PhoneNumbers: Array<PhoneNumber> = [];
        public Emails: string = "";
        public DateOfBirth: any = "";
        public CheckinStatus: boolean = false;
        public BaggageInfo: any;
        public NewSeatNumber: any;
        public IsSelected: boolean = false;
        public IsChecked: boolean = false;
        public INFwithoutSeat: boolean = false;
        public fqtv: Array<string> = [];
        public FqtTravelers:any;
        public PrevSeat : string ="";
        public FqtvPrograms: Array<FqtvClassPrograms> =[];
        public serviceText: string = "";
        public PassengerSeqNumber: string = "";
        public SyncTicket: boolean = false;
        public Oversold: boolean = false;
        public LoyalLevel: string = "";
        public AssociatedInfantRPH:string="";
        public AssociatedAdultRPH:string="";
	    public TicketNumbers: string = "";
        public OnStandby : boolean = false;
        public FlightLegDepartureAirportCode:string="";
        public Seats:Array<Seat>=[];
        public ShortCheckinArrivalCodesByFlights:any;
        public NoSeat:boolean=false;
        public seatCode:string="";
        public seatPreference: Array<string> =[];
        public GivenNameRefNumber:string="";
        public Age:string = "";
        public EmergencyDetails:any;
        public BoardingPriority: string ="";
        public ShortCheckAirportCode:string="";
        //test
    }


    export class Status {
        StatusCode: string;
        StatusNumber?: any;
        ChangeStatusNumber?: any;
        StatusCategory: string;
        StatusDescription: string;
        Alert?: any;
        IsEligibleForConfirmedCheckIn?: any;
    }

    export class Seat {
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
    export class FqtvClassPrograms {
        public ProgramID: string;
        public ProgramName: string;
    }
    export enum FlightStatus {
        Open,
        Closed,
        OnHold,
        Unknown
    }
    //
    export class PhoneNumber {
        public IsRefValue: boolean = false;
        public Type: string = "";
        public TypeText: string = "";
        public TechType: string = "";
        public TechTypeText: string = "";
        public Value: string = "";
        public Operation: string = "";
        public OSIText: string = "";
        public CarrierCode: string = "";
        public Remark: string = "";
        public LocationCode: string = "";
        public AreaCityCode: string = "";
    }

    export class FlightInfo {
        public FlightNumber: string = "";
        public MarketingFlight: string = "";
        public FlightDate: string = "";
        public FlightStatus: string = "";
        public Origin: string = "";
        public Destination: string = "";
        public OriginCity: string = "";
        public DestinationCity: string = "";
        public STD: string = "";
        public ETD: string = "";
        public ETA: string = "";
        // Properties needed to check in the pax
        public RPH: string = "";
        public RBD: string = "";


        public DepartureDateTime: Date = null;
        public ArrivalDateTime: Date = null;

        public DepartureCity: string = "";
        public Seats: string = null;
        public StatusCategory: string = "Confirmed";

        public PassengerRPHs: string = "[\"1\"]";
        public SegmentRPH: string = "";
        public FlightCheckIn: string = null;
        public FlightInfo: string = null;
        public Selected: boolean = true;
        public IsThroughOrChangeOfGaugeFlight: boolean = false;
        public Connection: string = "";
        public Stopover: string = "";
        public StatusNumber: string = "";
        public Turnaround: string = "";
        public OperatingFlight: string = "";


    }
}
export module UpgradeInfo {

    export class SegmentList {
        public RPH: string = "";
        public DepartureDateTime: Date = null;
        public MarketingFlight: string = "";
        public Selected: boolean = false;
        public DepartureCity: string = "";
    }

    export class FqtTraveler {
        public ProgramID?: any;
        public MembershipID?: any;
    }

    export class PassengerList {
        public GivenName: string = "";
        public Surname: string = "";
        public Emails: string = "";
        public PassengerTypeCode: string = "";
        public PassengerRefNumber: string = "";
        public PhoneNumbers: any[];
        public FqtTravelers: Array<FqtTraveler> = [];
        public EmergencyDetails: any[];
        public Status: string = "";
        public IsHeldSeat: boolean = false;
        public OrderId: string = "";
        public CheckedBagCount: number;
        public RPH: string = "";
        public Firstname: string = "";
        public Lastname: string = "";
        public Selected: boolean = false;
        public AssociatedInfantRPH?: any;
    }

    export class UpgradeDowngradeInfo {
        public IsVoluntary: boolean = false;
        public BookingClass: string = "";
        public ReasonCode?: any;
    }

    export class Seat {
        public SeatAvailability?: any;
        public SeatNumber: string = "";
        public SeatCharacteristics?: any;
        public DepartureCode: string = "";
        public ArrivalCode: string = "";
        public Cabin: string = "";
        public IsThruSeatNeeded: boolean = false;
        public NewSeatNumber: string = "";
    }

    export class CheckinInfo {
        public OriginalBookingClass: string = "";
    }

    export class SegmentTravelerInfo {
        public PassengerRPH: string = "";
        public SegmentRPH: string = "";
        public Seats: Array<Seat> = [];
        public PassengerFullName: string = "";
        public CheckinInfos: Array<CheckinInfo> = [];
        public Selected: boolean = false;
    }

    export class RootObject {
        public CheckInType: string = "";
        public SegmentList: Array<SegmentList> = [];
        public PassengerList: Array<PassengerList> = [];
        public UpgradeDowngradeInfo: UpgradeDowngradeInfo;
        public SegmentTravelerInfo: Array<SegmentTravelerInfo> = [];
    }

}
export class UpgradeInfoArray {
    public IsVoluntary: boolean;
    public BookingClass: string = "";
    public ReasonCode?: any = null;
}
