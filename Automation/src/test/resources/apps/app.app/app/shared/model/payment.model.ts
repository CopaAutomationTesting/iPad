export module PaymentData {

    export class Segments {
        public RPH: string = "";
        public DepartureDateTime: string = null;
        public ArrivalDateTime: string = null;
        public Flight: string = "";
        public OperatingFlight: string = null;
        public Origin: Origin = null;
        public Destination: Destination = null;
        public HasStopover: true
    }

    export class Origin {
        public LocationCode:string="";
    }

    export class Destination {
        public LocationCode:string="";
    }

    export class Passengers {
        public Firstname:string="";
        public Lastname:string="";
        public PassengerTypeCode:string="";
        public RPH:string="";
    }

    export class PaymentAddress {
        public AddressLine: string = "";
        public City: string = "";
        public StateCode: string = "";
        public PostalCode: string = "";
        public CountryCode: string = "";
        public CountryName: string = "";
    }

    export class Payment {
        public Type: string = "CA";
        public TransactionType:string="Charge";
        public Amount: any = "";
        public CurrencyCode: any = "";
        public CardCode: string = "";
        public MaskedCardNumber: string = "";
        public ApprovalCode: string = "";
        public SecurityCode:string="";
        public ExpirationDateMMYY: string = "";
        public CardHolderName: string = "";
        public CardIssuerBankID:string="";
        public BillingAddress: PaymentAddress;
        public FirstName:string ="";
        public LastName:string = "";
    }

    export class Email {
        public emailAddress: string = "noreply@hpe.com";
    }

    export class ReceiptDelivery {
        public gateway: string = "EMAIL";
        public Name:string = "";
        public phonenumber:string="";
        public email: Email[] = [];
        public LanguageID:string=null;
        public printerAddress: string = "";
    }

    export class Services {
        public selectedService: SelectedService;
        public passengerRPH:string="";
        public SegmentRPH:any[]=[];
        public currencyCode:string="";
        public amount:string="";
        public ticketNumber:string="";
        public EmdTaxes:any[]=[];
    }

    export class SelectedService {
        RFISC_code:string = "";
        RFISC_subCode:string = "";
        SSRCode:string = null;
        commercialName:string = "";
        EmdType:string = "";
        TypeOfService:string = "";
        NoofItems:string = "";
        IsRefundable:boolean = false;
    }

    export class RootObject {
        public OrderId:string = "";
        public Segments: Segments[] = [];
        public Passengers:Passengers[]=[];
        public Payments: Payment[] = [];
        public Services: Services[] = [];
        public ReceiptDelivery: ReceiptDelivery;
    }

}