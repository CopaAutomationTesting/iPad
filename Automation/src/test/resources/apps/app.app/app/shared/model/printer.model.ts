export module PrintModel {

    export class Departure {
        AirportCode: string;
        AirportName: string;
        CityCode: string;
        CityName: string;
        StateCode: string;
        StateName: string;
        CountryCode: string;
        CountryName: string;
        Terminal: string;
        Date: string;
        Time: string;
        Day: string;
    }

    export class Arrival {
        AirportCode: string;
        AirportName: string;
        CityCode: string;
        CityName: string;
        StateCode: string;
        StateName: string;
        CountryCode: string;
        CountryName: string;
        Terminal: string;
        Date: string;
        Time: string;
        Day: string;
    }

    export class Flight {
        OperatingCarrierCode: string;
        OperatingCarrierNumber: string;
        OperatingCarrierName: string;
        MarketingCarrierNumber: string;
        MarketingCarrierName: string;
        MarketingCarrierCode: string;
        BookingStatus: string;
        Departure: Departure;
        Arrival: Arrival;
        CabinClass: string;
        SeatStatus: string;
        Duration: string;
        AircraftType: string;
        LayoverTime: string;
        Terminal: string;
        Gate: string;
        SeatNumber: string;
        GateTime: string;
        Group: string;
        PreferAccessInd: string;
        SeqNum: string;
        TicketNumber: string;
    }

    export class Passenger {
        FirstName: string;
        LastName: string;
        Prefix: string;
        EliteStatus: string;
        LoyaltyId: string;
        Flight: Flight;
    }

    export class Boarding {
        Passenger: Passenger;
    }

    export class Order {
        OrderId: string;
        Boarding: Boarding[];
    }

    export class Document {
        Order: Order;
    }

    export class AirlineVendor {
        VendorId: string;
        VendorName: string;
    }

    export class Printer {
        ClientCode: string;
        DeviceName: string;
        WorkstationName: string;
        PectabVersion: string;
    }

    export class OutputRequest {
        id?: any=null;
        self?: any=null;
        resolved: boolean=true;
        Gateway: string;
        DocumentType: string;
        Source: string;
        RequestId: string;
        Document: Document;
        AirlineVendor: AirlineVendor;
        Printer: Printer;
    }

    export class RootObject {
        OutputRequest: OutputRequest[];
    }

}

