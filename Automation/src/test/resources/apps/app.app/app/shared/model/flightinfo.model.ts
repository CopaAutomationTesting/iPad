
    export class AirportInfo{
        LocationCode: string;
        AirportName?: string;
        Country?: string;
    }
    export class Leg{
        DepartureAirport: AirportInfo;
        ArrivalAirport: AirportInfo;
        ScheduledDeparture: Date;
        EstimatedDeparture: Date;
        ActualDeparture?: Date;

    }
    export class Flight{
        FlightNumber: string;
        DepartureDate: Date;
        Legs: Leg[];
    }