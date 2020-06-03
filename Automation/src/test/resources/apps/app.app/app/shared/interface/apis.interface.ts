export class EmergencyPhone {

    IsRefValue: boolean;

    Type: string;

    TypeText?: any;

    Operation?: any;

    TechType?: any;

    TechTypeText?: any;

    Value: string;

    OSIText?: any;

    CarrierCode?: any;

    Remark?: any;

    AreaCityCode: string;

    Country: string;

    CountryAccessCode: string;

}



export class EmergencyDetail {

    EmergencyContactName: string;

    EmergencyPhone: EmergencyPhone;

    EmergencyRelationship: string = "";

}



export class OldEmergencyDetail {

    EmergencyPhone: EmergencyPhone;

    EmergencyRelationship: string;

    EmergencyContactName: string;

}



export class Country {

    CountryName: string;

    CountryCode: string;

    PhoneAccessCode: string;

}



export class IssuingCountry {

    item: string = "CountryCode";

    items: any[] = ["CountryCode", "CountryName"];

    length: number = 2;

    isAlphaOnly: boolean = true;

    country: Country = new Country;

}

export class Nationality {

    item: string = "CountryCode";

    items: any[] = ["CountryCode", "CountryName"];

    length: number = 2;

    isAlphaOnly: boolean = true;

    country: Country = new Country;

}

export class ResidenceCountry {

    item: string = "CountryCode";

    items: any[] = ["CountryCode", "CountryName"];

    length: number = 2;

    isAlphaOnly: boolean = true;

    country: Country = new Country;

}



export class Document {

    Firstname: string;

    Surname: string;

    DocLevelInd: string = "1";

    DocType: string = "2";
    DocLevel :  string = "";
    EffectiveDate : Date;
    isCountryOfResEntered : boolean = false;
    IsDisabled : boolean = false;
    isPrimaryDoc : boolean = false;
    IsRefValue : boolean = false;
    isSecondaryDoc : boolean = false;
    DocTypeText: string = "Passport";

    DocHolderGender: string;

    inputType: string;

    isPrimary: boolean = true;

    // issuingCountry: IssuingCountry;
    // nationality: Nationality;
    // residenceCountry: ResidenceCountry;
    BirthDate: string;

    DocID: string;

    ExpireDate: string;

    IsTrustedData: boolean = true;
    IsVerifiedData :boolean= false;

    CountryOfResidence: string;

    DocHolderNationality: string;

    DocIssueCountry: string;

    Operation: string = "ADD"; 
    
    OCRString: string;

}



export class ApisRequirement {

    DocLevelInd: string;

    AgencyName: string;

    RequiredCodeList: ["0", "1", "3", "4", "6", "7", "9", "10", "11"];

    DocType: string;

    DocTypeText: string;

}

export class ApisAddressRequirements {
    AgencyName:string;
    Type:string;
}



export class ApisUpdateRequest {

    Firstname: string;

    Lastname: string;

    SurnameRefNumber: string;

    Prefix?: any;

    RPH: string;

    Emails: any[];

    Gender: string;

    GivenName:string;

    Surname:string;

    GivenNameReferenceNumber:string;

    PassengerTypeCode: string;

    PhoneNumbers: any[];

    DateOfBirth: string;

    Age?: any;

    AssociatedInfantRPH?: any;

    AssociatedAdultRPH?: any;

    FqtTravelers: any[];

    Nationality: string;

    EmergencyDetails: EmergencyDetail[];

    KnownTravelerNumber?: any;

    RedressNumber?: any;

    OldKnownTravelerNumber?: any;
    
    OldRedressNumber?: any;

    FOID?: any;

    OldNationality?: any;

    OldDateOfBirth?: any;

    OldGender?: any;

    OldFOID?: any;

    OldEmergencyDetails: any[];

    // AssociatedPassenger: AssociatedPassenger;
    Documents: Document[];

    ApisRequirements: ApisRequirement[];

    ApisAddressRequirements:ApisAddressRequirements[];

    Addresses: any[];

    PSS_GivenName: string;

    ExitDate: string = "";

    ExitDateJustification: string = "";

    PurposeOfVisit: string;

    IsAddedInfant?:boolean;
   

}



export class AssociatedPassenger {

    SurnameRefNumber: string = "";

    Firstname: string = "";

    Lastname: string = "";

    RPH: string = ""

}



export class Address {

    public IsRefValue: boolean = false;

    public Type: string = "4";

    public TypeText: string = "Destination";

    public Address?: any = null;

    public PostalCode?: any = null;

    public City?: any = null;

    public State?: any = null;

    public Operation: string = "ADD";

    public AgencyName: string = "";

    public DocLevelInd: string = "1";

    public AddressLineRequired: boolean = true;

    public AddressCityRequired?: any = false;

    public AddressPostalCodeRequired?: any = null;

    public AddressCountryCodeRequired?: any = false;

    public AddressRequired?: any = true;

    public CountryCode: string = "";

    public Country: string = "";

}



export class SecurityModel {

    FlightNumber: string;

    DepartureDate: string;

    DepartureAirport: string;

    BypassADC: string;

    ApisUpdateRequests: ApisUpdateRequest[] = [];

    OrderUpdateRequests?: any;

    messageLogs: boolean = true;

}