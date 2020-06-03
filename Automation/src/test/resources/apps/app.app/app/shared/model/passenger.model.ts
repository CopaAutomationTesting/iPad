
export class Passenger {
    public isChecked: boolean;
    public passangerName: string;
    public OrderID: string;
    public from: string;
    public to: string;
    public isSecurityDocs: boolean;
    public bags: string;
    public seat: string;
    public ssr: string;
    public emd?: string;
}
export class SeatMapTemplate{
    public seatRowNumber: string;
    public seatColumnNumber: string;
    public seatAvailability: string;
}