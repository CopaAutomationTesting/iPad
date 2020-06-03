export module baggageTemplate {
  export class SelectedSegment {
    public Origin: Origin = null;
    public Destination: Destination = null;
    public DepartureDateTime: Date = null;
    public ArrivalDateTime: Date = null;
    public MarketingFlight: string = "";
    public OperatingFlight: string = "";
    public RBD: string = "";
    public BookingClass: string = null;
    public RPH: string = "";
    public Status: Status = null;
    public Connection: string = null;
    public Stopover: string = null;
    public Turnaround: string = null;
    public DateOfIssue: Date = null;
    public ResBookDesigCode: string = "";
  }
  export class Origin {

    public AirportCode: string; "";
  }

  export class Destination {
    public AirportCode: string; "";

  }

  export class Status {
    public StatusNumber: string; "";

  }
  export class SelectedSegments {
    selectedSegments: SelectedSegment[];
  }
  export class AddBaggegeDetails {

    public bagTag: string = null;
    public weight: number = 0;
    public weightUnit: string = null;
    public tagNumber: string = null;
    public fees: string = null;
    public destination: string = null;
    public standard: boolean = false;
    public catalog: boolean = false;
    public auto: boolean = false;
    public manual: boolean = false;
    public status: string = "";
    public StdProduct: string = "";
    public CtlgProduct: string = "";
    public Code: string = "";
    public AlreadyExisting: boolean = false;
    public BagTagDetails: any = [];
    public selectedproduct: string = "";
    public Oversize:boolean=false;
    public RFISC_SubCode: string = null; 
    public ShortCheckAirportCode: string = null;
    public CheckedInIndicator:string = "";
    public PieceOccurrenceType:string = null;
    public PieceOccurrence:string = null;

  }

  export class BaggageDetail {

    public BaggageRPH: string = null;
    public FlightSegmentRPH: string = null;
    public LastFlightSegmentRPH: string = null;
    public PassengerRPH: string = null;
    public CheckedInIndicator: string = "";
    public RFISC_SubCode: string = null;
    public IsOversized:boolean;
    public Pieces: number = 1;
    public Weight:number;
    public WeightUnit : string;
    public CommercialName? : string;
    public EMD_TypeCode : string = "";
    public LongDescription? : string ;
    public RFISC_Code? :  string = "";
    public ServiceCode? : string;
    public ShortDescription? : string;
    public SSRCode : string;
    public PieceOccurrenceType:string = null;
    public PieceOccurrence:string = null;
    public DefaultInd:boolean=false;
    public ProductGroupCode:String="";



  }
  export class BagsToPrice {
    public FlightSegment: any[];
    public Passenger: any[];
    public PricingInfo: any[];
    public PNR: any;
    public BaggageDetail: any[];
    public PriceRPH:String="1";
  }
  export class BagsToPrices {

    public BagsToPrice: BagsToPrice[];
  }
  export class ProductDetail {
    Name: string;
    Code: string;
    RFIC:string;
    SubType:string;
    SSRCode:string;
    ServiceCode:string;
    weight:number;
    CommercialName:string;
    WeightUnit:string;
    ShortDescription:string;
    LongDescription:string;
    EMD_TypeCode:string;
    public DefaultInd:boolean;
    public ProductGroupCode:String;

  }
  export class ProductDetails {
    ProductDetail: ProductDetail[];
    Errors: null;
    Information: null;
    Warnings: null;
  }

}
export module Bagtag {

  export class ClientViewModel {
    public MessageFunction: number;
    public BaggageInfo?: any;
  }


  export class PhoneNumber {
    public IsRefValue: boolean;
    public Type: string;
    public TypeText: string;
    public TechType: string;
    public TechTypeText: string;
    public Value: string;
    public Operation?: any;
    public OSIText?: any;
    public CarrierCode?: any;
    public Remark: string;
    public LocationCode?: any;
    public AreaCityCode: string;
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
    public ShortCheckAirportCode: string;
    public RFISC_SubCode:string;
    public Weight:number;
    public Amount:number=0;
    public IsAutoBag:boolean;
    public fess :string;
    public isStandard :boolean;
    public productDescription:string;
    public BaggageRPH:string;
    public CheckedInIndicator:string;
    public PieceOccurrenceType:string;
    public PieceOccurrence:string;s

  }

  export class BaggageInfo {
    public BagTagDetails: Array<BagTagDetail> = [];
    public CheckedBagWeightTotal: string;
    public UnitOfMeasureCode: string;
    public PassengerRPH : string;
    public CheckedBagCountTotal: string;
  }


  export class CheckedBag {
    public BaggageInfo: BaggageInfo;
    public CancelOperation: boolean;
    public MessageFunction: number;
  }

  export class PassengerList {
    public Firstname: string;
    public Lastname: string;
    public SurnameRefNumber: string;
    public PassengerRefNumber:string;
    public Prefix?: any;
    public RPH: string;
    public Emails: any[];
    public PassengerTypeCode: string;
    public PhoneNumbers: Array<PhoneNumber> = [];
    public DateOfBirth: string;
    public OrderId:string;
    public Age?: any;
    public AssociatedInfantRPH?: any;
    public AssociatedAdultRPH?: any;
    public FqtTravelers: Array<FqtTravelers> = [];
    public Nationality?: any;
    public EmergencyDetails: any[];
    public CheckedBags: Array<CheckedBag> = [];
    public CheckInBagCountTotal: string;
    public CheckInBagWeightTotal: string;
    public Selected: boolean;
    public GivenNameRefNumber: number;
    public isManualBag:boolean;
  }
  export class FqtTravelers {
    public IsRefValue: boolean;
    public LoyalLevel: string;
    public LoyaltyLevelName: string;
    public MembershipID: number;
    public ProgramID: string;
    public AwardInformation: string;
    public VendorCodes: string;
    public Operation: string;
  }
  export class FlightCheckIn {
    public CheckInStatus: string;
  }
  export class PassengerListDelete {
    public Firstname: string;
    public Lastname: string;
    public SurnameRefNumber: string;
    public Prefix?: any;
    public RPH: string;
    public Emails: any[];
    public PassengerTypeCode: string;
    public PhoneNumbers: Array<PhoneNumber> = [];
    public DateOfBirth: string;
    public OrderId: string;
    public Age?: any;
    public Gender: string;
    public AssociatedInfantRPH?: any;
    public AssociatedAdultRPH?: any;
    public FqtTravelers: Array<FqtTravelers> = [];
    public Nationality?: any;
    public EmergencyDetails: any[];
    public KnownTravelerNumber?: any;
    public RedressNumber?: any;
    public FOID?: any;
    public GivenName : any;
    public Surname:any;
    public OldNationality?: any;
    public OldDateOfBirth?: any;
    public OldGender?: any;
    public OldFOID?: any;
    public PassengerRefNumber: any;
    public CheckedBags: Array<CheckedBag> = [];
    public CheckInBagCountTotal: string;
    public CheckInBagWeightTotal: string;
    public CheckinRePrint: boolean = false;
    public Selected: boolean;
    public CancelOperation: boolean;
    public GivenNameRefNumber: string;

    public BaggageInfoToDelete: BaggageInfoToDelete

  }


  export class SegmentList {
    public RPH: string;
    public DepartureDateTime: Date;
    public ArrivalDateTime: Date;
    public MarketingFlight: string;
    public DepartureCity: string;
    public OperatingFlight?: any;
    public StatusCategory: string;
    public RBD: string;
    public OriginRBD?: any;
    public UpgradeRBD?: any;
    public UpgradeType: number;
    public Cabin?: any;
    public PassengerRPHs: string;
    public SegmentRPH: string;
    public FlightCheckIn: FlightCheckIn;
    public FlightInfo?: any;
    public Selected: boolean;
    public IsThroughOrChangeOfGaugeFlight: boolean;
  }

  export class SegmentTravelerInfo {
    public PassengerRPH: string;
    public PassengerRefNumber:string;
    public SegmentRPH: string;
    public Seats: any;
    public PassengerFullName: string;
    public Selected: boolean;
  }

  export class RootObject {
    public ID: string = "";
    public CheckInType: string = "";
    public CheckInMessageFunctionType: string;
    public DeliveryDetail:any;
    public ClientViewModel: ClientViewModel = null;
    public PassengerList: Array<PassengerList> = [];
    public SegmentList: Array<SegmentList> = [];
    public SegmentTravelerInfo: Array<SegmentTravelerInfo> = [];
    public Source:string;
  }


  export class BaggageInfoToDelete {
    public BagTagDetails: Array<BagTagDetailDelete> = [];
    public CheckedBagWeightTotal: string;
    public UnitOfMeasureCode: string;
    public CheckedBagCountTotal: string;
    public PassengerRPH : any;
  }


  export class ClientViewModelDelete {
    public MessageFunction: number;

  }
  export class BagTagDetailDelete {
    public BagTagType: string;
    public SerialNumber?: any;
    public BagTagCount: string;
    public CarrierCode: string;
    public IssuerCode: string;
    public WeightToDelete: number;
    public WeightToDelete_Editable: boolean;
    public SegmentRPH: string;
    public RFISC_SubCode: string;
    public Weight: string;
    public Amount: string;
    public IsAutoBag: boolean = false;
  }

  export class DeleteObject {
    public ID: string = "";
    public CheckInType: string = "";
    public CheckInMessageFunctionType: string;
    public ClientViewModel: ClientViewModelDelete = null;
    public PassengerList: Array<PassengerListDelete> = [];
    public SegmentList: Array<SegmentList> = [];
    public DeliveryDetail:any;
    public SegmentTravelerInfo: Array<SegmentTravelerInfo> = [];
    public Source:string= "TAB";    
  }
}
