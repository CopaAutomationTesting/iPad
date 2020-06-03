
export class PaxTemplate {
    public FirstName: string = "";
    public LastName: string = "";
    public FullName: string = "";
    public OrderID: string = "";
    public PassengerType: string = "";
    public TierLevel: string = "";
    public FQTVNumber: string = "";
    public IsSecurityDocsComplete: boolean = false;
    public SecurityDocStatus: string = "";
    public BagCount: number = 0;
    public TotalWeight: number = 0;
    public SeatNumber: string = "";
    public SSR: Array<string> = [];
    public EMD: string = "";
    public FlightDetails: Array<FlightInfo> = [];
    // Properties needed to check in the pax
    public SurnameRefNumber: string = "";
    public SurName: string = "";
    public RPH: string = "";
    public Selected: boolean = false;
    public FQTVAirline: string = "";
    public ApisDocoStatus: string = "";
    public PassengerTypeCode: string = "";
    public ProgramIDxx: string = "";
    public PassengerRefNumber: string = null;
    public PhoneNumbers: Array<PhoneNumber> = [];
    public DateOfBirth: any = "";
    public CheckinStatus: boolean = false;
    public BaggageInfo: any;
    public NewSeatNumber: any;
    public IsSelected: boolean = false;
    public IsChecked: boolean = false;
    public INFwithoutSeat: boolean = false;
    public FqtvRootPrograms: FQTVRootObject;
    public fqtvPrograms: FqtvClassPrograms;
    public fqtv: Array<string> = [];
    public serviceText: string = "";
    public SyncTicket: boolean;
    public LoyalLevel: string = "";
    public Oversold: boolean;
    //test
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

export class FqtvClassPrograms {
    public ProgramID: string;
    public ProgramName: string;
}
export class FQTVRootObject {
    public FqtvPrograms: Array<FqtvClassPrograms>;
}

export class FlightInfo {
    public FlightNumber: string = "";
    public MarketingFlight: string = "";
    public FlightDate: string = "";
    public FlightStatus: string = "";
    public status: string = "";
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

export class FQTVInfo {
    public OrderID: string = "";
    public PassengerName: string = "";
    public Status: string = "";
    public FlightNumber: string = "";
    public IsChecked: boolean = false;
}
export module CheckInPostTemplate {
    export class RootObject {
        public Source:string = "";
        public BluetoothBagTag: boolean= false;
        public CheckInType: string = "CheckIn";
        public SegmentList: Array<SegmentList> = null;
        public PassengerList: Array<PassengerList> = null;
        public BoardingPassDeliveryDetail: Array<BoardingPassDeliveryDetail> = null;
        public isManualBag:boolean;
        public IsInterlineCheckin:boolean;
        public IsFQTVUpdate:boolean;

    }
    export class WaitlistRootObject {
        public CheckInType: string = "Waitlist";
        public SegmentList: Array<SegmentList> = null;
        public PassengerList: Array<WaitListPassenger> = null;
        public BoardingPassDeliveryDetail: Array<BoardingPassDeliveryDetail> = null;
    }
    export class BoardingPassDeliveryDetail {
        public Printer: Printer;
    }
    export class Printer {
        public DeviceType: string;
        public DeviceName: string;
        public WorkstationName: string;
        public PectabVersion: string;
    }
    export class PassengerList {
        public GivenName: string = "";
        public Surname: string = "";
        public PassengerTypeCode: string = "";
        public PassengerRefNumber: string = "";
        public AssociatedInfantRPH: string = "";
        public AssociatedAdultRPH: string = "";
        public FqtTravelers: any[] = [];
        public EmergencyDetails: any[] = [];
        public OrderId: string = "";
        public RPH: string = "";
        public Firstname: string = "";
        public Lastname: string = "";
        public Selected: boolean = true;
        public PhoneNumbers: any[] = [];
        public CheckedBagCount: number = 0;
        public IsBaggageChecked: boolean;
        public Status: string = "";
        public ShortCheckAirportCode:string;
        public SurnameRefNumber:string;
        public SurnameRefNumberCount:number;
        public CheckedBags?:any;
        public CheckInBagCountTotal : string;
        public CheckInBagWeightTotal : string;
        public Age:string="";
        public CheckinRePrint: boolean = false;
        public FreeBaggageCount:any;
        public ApisStatus:any;
        public addPartialMember:boolean = false;
        public UnitOfMeasureCode:any = null;
        public UnitOfMeasureQuantity:any = null;
        public OldKnownTravelerNumber:any = null;
        public OldRedressNumber:any = null;
        public FOID:any = null;

        
    }

    export class WaitListPassenger {
        public GivenName: string = "";
        public Surname: string = "";
        public SurnameRefNumber:string;
        public RPH: string = "";
        public Emails:any[]=[];
        public PassengerTypeCode: string = "";
        public PassengerRefNumber: string = "";
        public PhoneNumbers: any[] = [];
        public AssociatedInfantRPH: string = "";
        public AssociatedAdultRPH: string = "";
        public FqtTravelers: any[] = [];
        public EmergencyDetails: any[] = [];
        public Status: string = "";
        public OldEmergencyDetails: any[]=[];
        public OrderId: string = "";
        public CheckedBagCount: number = 0;
        public addPartialMember:boolean = false;
        public UnitOfMeasureCode:any = null;
        public UnitOfMeasureQuantity:any = null;
        public OldKnownTravelerNumber:any = null;
        public OldRedressNumber:any = null;
        public FOID:any = null;
        public CheckinRePrint:boolean = false;
        public Firstname: string = "";
        public Lastname: string = "";
        public Selected: boolean = true;
        public OldFqtTravelers:any = null;
        public SurnameRefNumberCount:any;
        public FreeBaggageCount:any;
        public ApisStatus:any;
        
    }
    export class CheckInOptions {
        public UnaccompaniedMinor: boolean = false;
        public DisabledPassenger: boolean = false;
        public PreferredPassenger: boolean = false;
        public StandbyUpgrade: boolean = false;
        public Standby: boolean = false;
        public ExtraSeat: boolean = false;
        public NonRevenueCategory: string = null;
    }
    export class FqtTraveler {

        public ProgramID: string = null;
        public MembershipID: string = null;
    }

    export class SegmentList {
        public RPH: string = "";
        public DepartureDateTime: Date = null;
        public MarketingFlight: string = null;
        public OperatingFlight:string=null;
        public Selected: boolean = null;
        public DepartureCity: string = null;
        public ArrivalCity:string = null;
        public OrderId:string = "";
    }
    export class FlightCheckIn {
        public CheckInStatus: string = "Open";
    }
}

export module DepartureInfo1 {

    export class Departure {
        public FlightStatus: string = "";
        public CheckinStatus: string = "";
        public Destination: string = "";
        public Gate: string = "";
        public FlightNumber: string = "";
        public STD: string = "";
        public ETD: string = "";
        public Color: string = "";
        public IsChecked: boolean = false;
        public STA: string = "";
        public configuration: Array<Configuration> = [];
        public DestinationAirport:string="";
        public Date:any;
        // public EconomyInventary:string ="";
        // public BussinessInventary:string ="";
    }

    export class Configuration {
        public Booked: string = "";
        public BoardingTime: string = "";
        public CodeLetter: string = "";
        public Capacity: string = "";

    }
}


export class DepartureInfo {
    public FlightStatus: string = "";
    public CheckinStatus: string = "";
    public Destination: string = "";
    public Gate: string = "";
    public FlightNumber: string = "";
    public ExpectedDepartureDate: string = "";
    public STD: string = "";
    public ETD: string = "";
    public IsChecked: boolean = false;
    public Color: string = "";
    public EconomyInventary: string = "";
    public BussinessInventary: string = "";

}

export module AccontProfileModel {
    export class AccountProfileTemplate {
        public Username: string = "";
        public FirstName: string = "";
        public LastName: string = "";
        public AgentDutyCode: string = "";
        public AgentSine: string = "";
        public AirportCode :string ="";
        public PhysicalLocation : string ="";
        public Requestor_ID : string = "";
        public PointOfSales: Array<PointOfSales> = [];
        public Currencies:Array<any>=[];
        public ISOCurrencyCode: string = "";
    }
    export class PointOfSales {
        public AirportCode: string = "";
        public Name: string = "";
        public ID:string="";
        public currencies:Array<string>=[];
        public AgentCode: string="";
    }
}
export module SeatMap {

    export class RootObject {
        Items: Item[];
        Errors?: any;
        Information?: any;
        Warnings?: any;
    }
    export class Item {
        FlightSegment: FlightSegment;
        CabinList: CabinList[];
        SeatProductInformation: SeatProductInformation[];
        EnableSeatCharges: boolean;
        Errors?: any;
        Information?: any;
        Warnings?: any;
    }
    export class SeatProductInformation {
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
    export class FlightSegment {
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
    export class Origin {
        AirportName: string;
        FlagStopInd?: any;
        CityName: string;
        LocationCode: string;
        CountryName: string;
        CountryCode: string;
        PhoneAccessCode?: any;
        ISO3CountryCode?: any;
    }

    export class Destination {
        AirportName: string;
        FlagStopInd?: any;
        CityName: string;
        LocationCode: string;
        CountryName: string;
        CountryCode: string;
        PhoneAccessCode?: any;
        ISO3CountryCode?: any;
    }
    // export class SeatList {
    //     public CabinList: Array<CabinList> = [];
    // }


    export class CabinList {
        public CabinType: string;
        public CabinName: string;
        public AirRowList: Array<AirRowList> = [];
    }

    export class AirRowList {
        public RowNumber: string;
        public RowCharacteristics: Array<string>;
        public AirSeatList: Array<AirSeatList> = [];
        public HeaderRow?: boolean = false;
        public StyleClass?: string = "";
    }

    export class AirSeatList {
        public SeatAvailability: string;
        public SeatNumber: string = "";
        public SeatCharacteristics: Array<string> = [];
        public ReconciledStatus: number;
        public SeatPriceList?: any;
        public MidCol?: boolean = false;
        public StyleClass?: string = "";
        public IsSeatSelected?: boolean = false;
        public IsSelectedAdvanceDisplay?: boolean = false;
        public AdvanceDisplayStyleClass?: string = "";
        public SeatNum : string ="";
        public SeatCode : string ="";
        public IsPaxSelected?: boolean = false;
        public PaxRPH : string = "";
        public isSpecialSeat : boolean = false;
        public FlightLegDepartureAirportCode:string="";
    }

}



export module AssignSeat {
    export class seat {
        public SeatList: Array<seats> = [];
        public IsInterlineSeatMap : boolean =false;
        public DeliveryDetail:any = null;
    }

    export class seats {
        public OrderId: string;
        public SeatNo: string;
        public SeatPreference: Array<string> = [];
        public SeatCheckInStatus: string;
        public PreviousSeatNo: string;
        public INFGivenName : string;
        public INFSurname:string;
        public FlightNo: string;
        public DepartureAirportCode: string;
        public ArrivalAirportCode : string;
        public DepartureDateTime: Date = null;
        public PassengerFirstName: string;
        public PassengerLastName: string;
        public ResBookDesigCode: string;
        public FlightLegDepartureAirportCode:string;
        public NoSeat:boolean=false;
        public PassengerRefNumber: string;
        public PassengerTypeCode:string;
        public HasPrice:boolean=false;
        public PassengerRPH:string;
        public SurnameRefNumber:string;
        public GivenNameRefNumber:string;
        public IsCheckedIn:string;

    }

}

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



export module PassengerCheckin {
    export class SelectedPassenger {
        public FirstName: string = "";
        public LastName: string = "";
    }
}
export module FQTVPro {
    export class FqtvPrograms {
        public ProgramID: string;
        public ProgramName: string;
    }
    export class RootObject {
        public FqtvPrograms: Array<FqtvPrograms>;

    }
}



export module InBound {
    export class Inbou {
        public FlightNumber: string;
        public LocationCode: string;
        public PassengerCount: number;
    }
    export class RootObject {
        public Inbou: Inbou;
    }
}
export module OutBound {
    export class Outbou {
        public FlightNumber: string;
        public LocationCode: string;
        public PassengerCount: number;
    }
    export class RootObject {
        public Outbou: Outbou;
    }
}

export module BoardingPass {

    export class RootObject {
        public Source:string = "Tab";
        public DeliveryDetail: BoardingPassDeliveryDetail;
        public Segments: Array<SegmentList> = [];
        public Passengers: Array<PassengerList> = [];

    }
    export class BoardingPassDeliveryDetail {
        public Gateway: string = "";
        public Email: string = null;
        public PrinterAddress: string = "";
        public Printer: Printer;
    }
    export class Printer {
        public ClientCode: string="";
        public OfficeName: string="";
        public DeviceName: string="";
        public WorkstationName: string="";
        public PectabVersion: string="";
        public DeviceType:string="";

    }

    export class PassengerList {
        public PassengerTypeCode:string;
        public SurnameRefNumber: string = "";
        public Emails:any[];
        public FqtTravelers: Array<FqtTraveler> = [];
        public OrderId: string = "";
        public CheckedBagCount:number;
        public RPH: string ;
        public Firstname: string = "";
        public Lastname: string = "";
        public Selected:boolean = true;
        public AssociatedAdultRPH:string=null;
        public AssociatedInfantRPH:string=null;
        public EmergencyDetails:any[];
        public Status:string;
        public PhoneNumbers:any[];
        public INFSurname:any;
        public INFGivenName:any;
        public PassengerRefNumber:any;
        public ApisStatus:string;
        public GivenName:string;
    }

    export class FqtTraveler {
        public ProgramID: string = null;
        public MembershipID: string = null;
    }

    export class SegmentList {
        public RPH: string = "";
        public DepartureDateTime: Date = null;
        //public ArrivalTime: Date = null;
        public MarketingFlight: string = "";
        public DepartureCity: string = null;
        // public Gate: string = "";
        //public BoardingTime: Date = null;
        public Selected:boolean = true;
        public ArrivalCity:string="";
        public OrderId:string;
    }


}


export module BagTagPrint {
    
        export class RootObject {
            public Source:string = "Tab";
            public DeliveryDetail: BoardingPassDeliveryDetail;
            public Segments: Array<SegmentList> = [];
            public Passengers: Array<PassengerList> = [];
    
        }
        export class BoardingPassDeliveryDetail {
            public Gateway: string = "";
            public Email: string = null;
            public PrinterAddress: string = "";
            public Printer: Printer;
        }
        export class Printer {
            public ClientCode: string;
            public OfficeName: string;
            public DeviceName: string;
            public WorkstationName: string;
            public PectabVersion: string;
            public DeviceType:string;
    
        }
    
        export class PassengerList {
            public PassengerTypeCode:string ="";
            public PassengerRefNumber: string = "";
            public FqtTravelers: Array<FqtTraveler> = [];
            public OrderId: string = "";
            public CheckedBagCount:number=1;
            public RPH: string = "";
            public Firstname: string = "";
            public Lastname: string = "";
            public Selected:boolean = true;
            public AssociatedInfantRPH:string=null;
            public CheckinAirportCode:string="";
            public CheckedBags:Array<CheckedBags>=[];
            public CheckInBagCountTotal:string="";
            public CheckInBagWeightTotal:any;
        }
        export class CheckedBags
        {
            public BaggageInfo:BaggageInfo;
            public CancelOperation:boolean = false;
        }

        export class BaggageInfo {
            public BagTagDetails: Array<BagTagDetail> = [];
            public CheckedBagWeightTotal: string;
            public UnitOfMeasureCode: string;
            public CheckedBagCountTotal: string;
            public PassengerRPH:string="";
          }

        export class BagTagDetail {
            public BagTagType: string;
            public SerialNumber?: any;
            public BagTagCount: string;
            public CarrierCode: string;
            public IssuerCode: string;
            public WeightToDelete: string;
            public WeightToDelete_Editable: boolean;
            public SegmentRPH: string;
        
          }
    
        export class FqtTraveler {
            public ProgramID: string = null;
            public MembershipID: string = null;
        }
    
        export class SegmentList {
            public RPH: string = "";
            public DepartureDateTime: Date = null;
            public ArrivalDateTime: Date = null;
            public MarketingFlight: string = "";
            public DepartureCity: string = null;
            public OperatingFlight:string=null;
            public Selected:boolean = true;
            public Gate: string = null;
            public BoardingTime: Date = null;
        }
    
    
    }


export module PrinterDevice {

    export class Device {
        public DeviceName: string = "";
        public DeviceType: string = "";
        public Description: string = "";
        public Status: string = "";
        public QueueCount: string = "";
        public Port: string = "";
        public Pectab: string = "";
        public workstationName: string = "";
    }



}

export module InterlineThroughCheckin {
     export class SegmentList {
         public RPH: string;
         public DepartureDateTime: Date;
         public MarketingFlight: string;
         public Selected: boolean;
         public DepartureCity: string;
         public OrderId:string;
     }
    export class FqtTraveler {
        public ProgramID?: any;
        public MembershipID?: any;
    }
    export class FlightNumber {
        public AirlineCode: string;
        public Number: string;
    }
    export class SeatList {
        public SeatNumber?: any;
        public Cabin?: any;
    }
    export class FqtTraveler2 {
        public MembershipID?: any;
        public ProgramID: string;
    }
    export class OutBoundConnectingFlightInfo {
        public FlightRPH: string;
        public FlightNumber: Array<FlightNumber> = [];
        public ActualDepartureDateTime: Date;
        public DepartureCode: string;
        public ArrivalCode: string;
        public SeatList: Array<SeatList> = [];
        public ResBookDesigCode: string;
        public FqtTravelers: Array<FqtTraveler2> = [];
    }
    export class PassengerList {
        public GivenName: string;
        public Surname: string;
        public Emails: any[];
        public PassengerTypeCode: string;
        public PassengerRefNumber: string;
        public PhoneNumbers: any[];
        public FqtTravelers: Array<FqtTraveler> = [];
        public EmergencyDetails: any[];
        public Status: string;
        public OrderId: string;
        public CheckedBagCount: number;
        public OutBoundConnectingFlightInfo: Array<OutBoundConnectingFlightInfo> = [];
        public ResBookDesigCode: string;
        public RPH: string;
        public Firstname: string;
        public Lastname: string;
        public Selected: boolean;
        public AssociatedInfantRPH?: any;
        public IsBaggageChecked:any;
        public SurnameRefNumber:string;
        public SurnameRefNumberCount:number;
        public addPartialMember:boolean;
        public CheckedBags?:any;
    }
    export class RootObject {
        public CheckInType: string;
        public SegmentList: Array<SegmentList> = [];
        public PassengerList: Array<PassengerList> = [];
        public Source:string = "";
        public BluetoothBagTag:boolean = false;
        public BoardingPassDeliveryDetail: Array<BoardingPassDeliveryDetail> = null;
        public isManualBag:boolean;        
    }
    export class BoardingPassDeliveryDetail {
        public Gateway: string = "";
        public Email: string = null;
        public PrinterAddress: string = "";
        public Printer: Printer;
    }
    export class Printer {
        public ClientCode: string="";
        public OfficeName: string="";
        public DeviceName: string="";
        public WorkstationName: string="";
        public PectabVersion: string="";
        public DeviceType:string="";

    }
}​
export module PrinterDeviceModel {
    
        export class Device {
            public IsSelectedDevice :boolean =false;
            public DeviceName: string ="";
            public DeviceType: string ="";
            public Description: string ="";
            public Status: string ="";
            public QueueCount: string ="";
            public Port: string ="";
            public Pectab: string ="";
            public PectabType: string ="";
        }
    
        export class Workstation {
            public device: Array<Device>=[];
            public workstationName: string ="";
        }
    
        export class RootObject {
            public workstation: Array<Workstation>=[];
        }
    
    }