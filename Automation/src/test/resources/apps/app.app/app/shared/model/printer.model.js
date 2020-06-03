"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrintModel;
(function (PrintModel) {
    var Departure = /** @class */ (function () {
        function Departure() {
        }
        return Departure;
    }());
    PrintModel.Departure = Departure;
    var Arrival = /** @class */ (function () {
        function Arrival() {
        }
        return Arrival;
    }());
    PrintModel.Arrival = Arrival;
    var Flight = /** @class */ (function () {
        function Flight() {
        }
        return Flight;
    }());
    PrintModel.Flight = Flight;
    var Passenger = /** @class */ (function () {
        function Passenger() {
        }
        return Passenger;
    }());
    PrintModel.Passenger = Passenger;
    var Boarding = /** @class */ (function () {
        function Boarding() {
        }
        return Boarding;
    }());
    PrintModel.Boarding = Boarding;
    var Order = /** @class */ (function () {
        function Order() {
        }
        return Order;
    }());
    PrintModel.Order = Order;
    var Document = /** @class */ (function () {
        function Document() {
        }
        return Document;
    }());
    PrintModel.Document = Document;
    var AirlineVendor = /** @class */ (function () {
        function AirlineVendor() {
        }
        return AirlineVendor;
    }());
    PrintModel.AirlineVendor = AirlineVendor;
    var Printer = /** @class */ (function () {
        function Printer() {
        }
        return Printer;
    }());
    PrintModel.Printer = Printer;
    var OutputRequest = /** @class */ (function () {
        function OutputRequest() {
            this.id = null;
            this.self = null;
            this.resolved = true;
        }
        return OutputRequest;
    }());
    PrintModel.OutputRequest = OutputRequest;
    var RootObject = /** @class */ (function () {
        function RootObject() {
        }
        return RootObject;
    }());
    PrintModel.RootObject = RootObject;
})(PrintModel = exports.PrintModel || (exports.PrintModel = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbnRlci5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByaW50ZXIubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFjLFVBQVUsQ0E0R3ZCO0FBNUdELFdBQWMsVUFBVTtJQUVwQjtRQUFBO1FBYUEsQ0FBQztRQUFELGdCQUFDO0lBQUQsQ0FBQyxBQWJELElBYUM7SUFiWSxvQkFBUyxZQWFyQixDQUFBO0lBRUQ7UUFBQTtRQWFBLENBQUM7UUFBRCxjQUFDO0lBQUQsQ0FBQyxBQWJELElBYUM7SUFiWSxrQkFBTyxVQWFuQixDQUFBO0lBRUQ7UUFBQTtRQXVCQSxDQUFDO1FBQUQsYUFBQztJQUFELENBQUMsQUF2QkQsSUF1QkM7SUF2QlksaUJBQU0sU0F1QmxCLENBQUE7SUFFRDtRQUFBO1FBT0EsQ0FBQztRQUFELGdCQUFDO0lBQUQsQ0FBQyxBQVBELElBT0M7SUFQWSxvQkFBUyxZQU9yQixDQUFBO0lBRUQ7UUFBQTtRQUVBLENBQUM7UUFBRCxlQUFDO0lBQUQsQ0FBQyxBQUZELElBRUM7SUFGWSxtQkFBUSxXQUVwQixDQUFBO0lBRUQ7UUFBQTtRQUdBLENBQUM7UUFBRCxZQUFDO0lBQUQsQ0FBQyxBQUhELElBR0M7SUFIWSxnQkFBSyxRQUdqQixDQUFBO0lBRUQ7UUFBQTtRQUVBLENBQUM7UUFBRCxlQUFDO0lBQUQsQ0FBQyxBQUZELElBRUM7SUFGWSxtQkFBUSxXQUVwQixDQUFBO0lBRUQ7UUFBQTtRQUdBLENBQUM7UUFBRCxvQkFBQztJQUFELENBQUMsQUFIRCxJQUdDO0lBSFksd0JBQWEsZ0JBR3pCLENBQUE7SUFFRDtRQUFBO1FBS0EsQ0FBQztRQUFELGNBQUM7SUFBRCxDQUFDLEFBTEQsSUFLQztJQUxZLGtCQUFPLFVBS25CLENBQUE7SUFFRDtRQUFBO1lBQ0ksT0FBRSxHQUFPLElBQUksQ0FBQztZQUNkLFNBQUksR0FBTyxJQUFJLENBQUM7WUFDaEIsYUFBUSxHQUFVLElBQUksQ0FBQztRQVEzQixDQUFDO1FBQUQsb0JBQUM7SUFBRCxDQUFDLEFBWEQsSUFXQztJQVhZLHdCQUFhLGdCQVd6QixDQUFBO0lBRUQ7UUFBQTtRQUVBLENBQUM7UUFBRCxpQkFBQztJQUFELENBQUMsQUFGRCxJQUVDO0lBRlkscUJBQVUsYUFFdEIsQ0FBQTtBQUVMLENBQUMsRUE1R2EsVUFBVSxHQUFWLGtCQUFVLEtBQVYsa0JBQVUsUUE0R3ZCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IG1vZHVsZSBQcmludE1vZGVsIHtcblxuICAgIGV4cG9ydCBjbGFzcyBEZXBhcnR1cmUge1xuICAgICAgICBBaXJwb3J0Q29kZTogc3RyaW5nO1xuICAgICAgICBBaXJwb3J0TmFtZTogc3RyaW5nO1xuICAgICAgICBDaXR5Q29kZTogc3RyaW5nO1xuICAgICAgICBDaXR5TmFtZTogc3RyaW5nO1xuICAgICAgICBTdGF0ZUNvZGU6IHN0cmluZztcbiAgICAgICAgU3RhdGVOYW1lOiBzdHJpbmc7XG4gICAgICAgIENvdW50cnlDb2RlOiBzdHJpbmc7XG4gICAgICAgIENvdW50cnlOYW1lOiBzdHJpbmc7XG4gICAgICAgIFRlcm1pbmFsOiBzdHJpbmc7XG4gICAgICAgIERhdGU6IHN0cmluZztcbiAgICAgICAgVGltZTogc3RyaW5nO1xuICAgICAgICBEYXk6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQXJyaXZhbCB7XG4gICAgICAgIEFpcnBvcnRDb2RlOiBzdHJpbmc7XG4gICAgICAgIEFpcnBvcnROYW1lOiBzdHJpbmc7XG4gICAgICAgIENpdHlDb2RlOiBzdHJpbmc7XG4gICAgICAgIENpdHlOYW1lOiBzdHJpbmc7XG4gICAgICAgIFN0YXRlQ29kZTogc3RyaW5nO1xuICAgICAgICBTdGF0ZU5hbWU6IHN0cmluZztcbiAgICAgICAgQ291bnRyeUNvZGU6IHN0cmluZztcbiAgICAgICAgQ291bnRyeU5hbWU6IHN0cmluZztcbiAgICAgICAgVGVybWluYWw6IHN0cmluZztcbiAgICAgICAgRGF0ZTogc3RyaW5nO1xuICAgICAgICBUaW1lOiBzdHJpbmc7XG4gICAgICAgIERheTogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBGbGlnaHQge1xuICAgICAgICBPcGVyYXRpbmdDYXJyaWVyQ29kZTogc3RyaW5nO1xuICAgICAgICBPcGVyYXRpbmdDYXJyaWVyTnVtYmVyOiBzdHJpbmc7XG4gICAgICAgIE9wZXJhdGluZ0NhcnJpZXJOYW1lOiBzdHJpbmc7XG4gICAgICAgIE1hcmtldGluZ0NhcnJpZXJOdW1iZXI6IHN0cmluZztcbiAgICAgICAgTWFya2V0aW5nQ2Fycmllck5hbWU6IHN0cmluZztcbiAgICAgICAgTWFya2V0aW5nQ2FycmllckNvZGU6IHN0cmluZztcbiAgICAgICAgQm9va2luZ1N0YXR1czogc3RyaW5nO1xuICAgICAgICBEZXBhcnR1cmU6IERlcGFydHVyZTtcbiAgICAgICAgQXJyaXZhbDogQXJyaXZhbDtcbiAgICAgICAgQ2FiaW5DbGFzczogc3RyaW5nO1xuICAgICAgICBTZWF0U3RhdHVzOiBzdHJpbmc7XG4gICAgICAgIER1cmF0aW9uOiBzdHJpbmc7XG4gICAgICAgIEFpcmNyYWZ0VHlwZTogc3RyaW5nO1xuICAgICAgICBMYXlvdmVyVGltZTogc3RyaW5nO1xuICAgICAgICBUZXJtaW5hbDogc3RyaW5nO1xuICAgICAgICBHYXRlOiBzdHJpbmc7XG4gICAgICAgIFNlYXROdW1iZXI6IHN0cmluZztcbiAgICAgICAgR2F0ZVRpbWU6IHN0cmluZztcbiAgICAgICAgR3JvdXA6IHN0cmluZztcbiAgICAgICAgUHJlZmVyQWNjZXNzSW5kOiBzdHJpbmc7XG4gICAgICAgIFNlcU51bTogc3RyaW5nO1xuICAgICAgICBUaWNrZXROdW1iZXI6IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUGFzc2VuZ2VyIHtcbiAgICAgICAgRmlyc3ROYW1lOiBzdHJpbmc7XG4gICAgICAgIExhc3ROYW1lOiBzdHJpbmc7XG4gICAgICAgIFByZWZpeDogc3RyaW5nO1xuICAgICAgICBFbGl0ZVN0YXR1czogc3RyaW5nO1xuICAgICAgICBMb3lhbHR5SWQ6IHN0cmluZztcbiAgICAgICAgRmxpZ2h0OiBGbGlnaHQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEJvYXJkaW5nIHtcbiAgICAgICAgUGFzc2VuZ2VyOiBQYXNzZW5nZXI7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIE9yZGVyIHtcbiAgICAgICAgT3JkZXJJZDogc3RyaW5nO1xuICAgICAgICBCb2FyZGluZzogQm9hcmRpbmdbXTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRG9jdW1lbnQge1xuICAgICAgICBPcmRlcjogT3JkZXI7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEFpcmxpbmVWZW5kb3Ige1xuICAgICAgICBWZW5kb3JJZDogc3RyaW5nO1xuICAgICAgICBWZW5kb3JOYW1lOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFByaW50ZXIge1xuICAgICAgICBDbGllbnRDb2RlOiBzdHJpbmc7XG4gICAgICAgIERldmljZU5hbWU6IHN0cmluZztcbiAgICAgICAgV29ya3N0YXRpb25OYW1lOiBzdHJpbmc7XG4gICAgICAgIFBlY3RhYlZlcnNpb246IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgT3V0cHV0UmVxdWVzdCB7XG4gICAgICAgIGlkPzogYW55PW51bGw7XG4gICAgICAgIHNlbGY/OiBhbnk9bnVsbDtcbiAgICAgICAgcmVzb2x2ZWQ6IGJvb2xlYW49dHJ1ZTtcbiAgICAgICAgR2F0ZXdheTogc3RyaW5nO1xuICAgICAgICBEb2N1bWVudFR5cGU6IHN0cmluZztcbiAgICAgICAgU291cmNlOiBzdHJpbmc7XG4gICAgICAgIFJlcXVlc3RJZDogc3RyaW5nO1xuICAgICAgICBEb2N1bWVudDogRG9jdW1lbnQ7XG4gICAgICAgIEFpcmxpbmVWZW5kb3I6IEFpcmxpbmVWZW5kb3I7XG4gICAgICAgIFByaW50ZXI6IFByaW50ZXI7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFJvb3RPYmplY3Qge1xuICAgICAgICBPdXRwdXRSZXF1ZXN0OiBPdXRwdXRSZXF1ZXN0W107XG4gICAgfVxuXG59XG5cbiJdfQ==