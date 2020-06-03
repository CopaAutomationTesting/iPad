export class PassengerTemplate {
    private _firstName: string = "";
    private _lastName: string = "";
    private _fullName: string = "";
    private _orderID: string = "";
    private _isSecurityDocsComplete: boolean = false;
    private _from: string;
    private _to: string;
    private _bagCount: number = 0;
    private _seatNumber: string = "";
    private _ssr: string = "";
    private _emd: string = "";
    //
    get FirstName(): string {
        return this._firstName;
    }
    set FirstName(_firstName: string) {
        this._firstName = _firstName;
    }
    //
    get LastName(): string {
        return this._lastName;
    }
    set LastName(_lastName: string) {
        this._lastName = _lastName;
    }
    //
    get FullName(): string {
        return this._fullName;
    }
    set FullName(_fullName: string) {
        this._fullName = _fullName;
    }
    //
    get OrderID(): string {
        return this._orderID;
    }
    set OrderID(_orderID: string) {
        this._firstName = _orderID;
    }

    get IsSecurityDocsComplete(): boolean {
        return this._isSecurityDocsComplete;
    }
    set IsSecurityDocsComplete(_isSecurityDocsComplete: boolean) {
        this._isSecurityDocsComplete = _isSecurityDocsComplete;
    }
    //
    get BagCount(): number {
        return this._bagCount;
    }
    set BagCount(_bagCount: number) {
        this._bagCount = _bagCount;
    }
    //
    get SeatNumber(): string {
        return this._seatNumber;
    }
    set SeatNumber(_seatNumber: string) {
        this._seatNumber = _seatNumber;
    }
    //
    get From(): string {
        return this._from;
    }
    set From(_from: string) {
        this._from = _from;
    }
    //
    get To(): string {
        return this._to;
    }
    set To(_to: string) {
        this._to = _to;
    }
    //
    get SSR(): string {
        return this._ssr;
    }
    set SSR(_ssr: string) {
        this._ssr = _ssr;
    }
    //
    get EMD(): string {
        return this._emd;
    }
    set EMD(_emd: string) {
        this._emd = _emd;
    }

}

export class PassengerListTemplate {
    private _isChecked: boolean = false;
    private _firstName: string = "";
    private _lastName: string = "";
    private _fullName: string = "";
    private _orderID: string = "";
    private _isSecurityDocsComplete: boolean = false;
    private _from: string;
    private _to: string;
    private _bagCount: number = 0;
    private _seatNumber: string = "";
    private _ssr: string = "";
    private _emd: string = "";

    get IsChecked(): boolean {
        return this._isChecked;
    }
    set IsChecked(_isChecked: boolean) {
        this._isChecked = _isChecked;
    }
    //
    get FirstName(): string {
        return this._firstName;
    }
    set FirstName(_firstName: string) {
        this._firstName = _firstName;
    }
    //
    get LastName(): string {
        return this._lastName;
    }
    set LastName(_lastName: string) {
        this._lastName = _lastName;
    }
    //
    get FullName(): string {
        return this._fullName;
    }
    set FullName(_fullName: string) {
        this._fullName = _fullName;
    }
    //
    get OrderID(): string {
        return this._orderID;
    }
    set OrderID(_orderID: string) {
        this._orderID = _orderID;
    }

    get IsSecurityDocsComplete(): boolean {
        return this._isSecurityDocsComplete;
    }
    set IsSecurityDocsComplete(_isSecurityDocsComplete: boolean) {
        this._isSecurityDocsComplete = _isSecurityDocsComplete;
    }
    //
    get BagCount(): number {
        return this._bagCount;
    }
    set BagCount(_bagCount: number) {
        this._bagCount = _bagCount;
    }
    //
    get SeatNumber(): string {
        return this._seatNumber;
    }
    set SeatNumber(_seatNumber: string) {
        this._seatNumber = _seatNumber;
    }
    //
    get From(): string {
        return this._from;
    }
    set From(_from: string) {
        this._from = _from;
    }
    //
    get To(): string {
        return this._to;
    }
    set To(_to: string) {
        this._to = _to;
    }
    //
    get SSR(): string {
        return this._ssr;
    }
    set SSR(_ssr: string) {
        this._ssr = _ssr;
    }
    //
    get EMD(): string {
        return this._emd;
    }
    set EMD(_emd: string) {
        this._emd = _emd;
    }

}

export class PassengerList {
    public IsChecked: boolean = false;
    public FirstName: string = "";
    public LastName: string = "";
    public FullName: string = "";
    public OrderID: string = "";
    public PassengerType:string="";
    public IsSecurityDocsComplete: boolean = false;
    public From: string;
    public To: string;
    public BagCount: number = 0;
    public SeatNumber: string = "";
    public SSR: string = "";
    public SSRCount : number = 0;
    public EMD: string = "";
    public InfantName: string = "";
    public AssociatedAdultRPH : string = "";
    public CheckinStatus: Boolean = false;
    public TierLevel: string = "";
    public BoardPriority: string = "";
    public InfantIndicator:string = "";
    public Oversold: boolean = false;
    public SyncTicket: boolean = false; 
    public OnStandby: boolean = false;
}

export class Passenger {
    constructor(
        public Firstname: string,
        public Lastname: string,
        public PassengerTypeCodeDesc: string,
        public FqtTravelers: string,
        public MembershipID: string
    ) { }
}


export class order {
    constructor(
        public ID: string,
        public Passenge: Passenger[],
        public TotalCount: string
    ) { }

}

export class GetPassenger {
    constructor(
        public OrderID: string,
    ) { }

}