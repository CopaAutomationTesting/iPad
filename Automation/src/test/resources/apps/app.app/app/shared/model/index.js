"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var Search = require("../model/search.model");
var SecurityModel = require("../model/apis.model");
var APISValidation = require("../model/apis.model");
var Passenger = require("../model/passenger.model");
var flightinfo = require("../model/flightinfo.model");
var FlightServiceInfo = require("../model/flightinfoservice.model");
var model = require("../model/checkin.model");
var payment = require("../model/payment.model");
var print = require("../model/printer.model");
var compansation = require("../model/compansation.model");
var PassengerTypeListTable = require("../model/compansation.model");
var CompensationPassengerList = require("../model/compansation.model");
var CompensationOrderList = require("../model/compansation.model");
var BRECompensation = require("../model/compansation.model");
var ToastMessages = require("../model/message.model");
exports.APP_MODEL = [
    Search,
    SecurityModel,
    Passenger,
    flightinfo,
    FlightServiceInfo,
    model,
    payment,
    print,
    compansation,
    PassengerTypeListTable,
    CompensationPassengerList,
    CompensationOrderList,
    BRECompensation,
    APISValidation,
    ToastMessages
];
__export(require("../model/search.model"));
__export(require("../model/apis.model"));
__export(require("../model/flightinfo.model"));
__export(require("../model/checkin.model"));
__export(require("../model/payment.model"));
__export(require("../model/printer.model"));
__export(require("../model/compansation.model"));
__export(require("../model/passenger.model"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhDQUFnRDtBQUNoRCxtREFBcUQ7QUFDckQsb0RBQXNEO0FBQ3RELG9EQUFzRDtBQUN0RCxzREFBd0Q7QUFDeEQsb0VBQXNFO0FBQ3RFLDhDQUFnRDtBQUNoRCxnREFBa0Q7QUFDbEQsOENBQWdEO0FBQ2hELDBEQUE0RDtBQUM1RCxvRUFBc0U7QUFDdEUsdUVBQXlFO0FBQ3pFLG1FQUFxRTtBQUNyRSw2REFBK0Q7QUFDL0Qsc0RBQXdEO0FBRTNDLFFBQUEsU0FBUyxHQUFVO0lBQy9CLE1BQU07SUFDTixhQUFhO0lBQ2IsU0FBUztJQUNULFVBQVU7SUFDVixpQkFBaUI7SUFDakIsS0FBSztJQUNMLE9BQU87SUFDUCxLQUFLO0lBQ0wsWUFBWTtJQUNaLHNCQUFzQjtJQUN0Qix5QkFBeUI7SUFDekIscUJBQXFCO0lBQ3JCLGVBQWU7SUFDZixjQUFjO0lBQ2QsYUFBYTtDQUNiLENBQUM7QUFFRiwyQ0FBc0M7QUFDdEMseUNBQW9DO0FBRXBDLCtDQUEwQztBQUMxQyw0Q0FBdUM7QUFDdkMsNENBQXVDO0FBQ3ZDLDRDQUF1QztBQUN2QyxpREFBNEM7QUFDNUMsOENBQXlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgU2VhcmNoIGZyb20gXCIuLi9tb2RlbC9zZWFyY2gubW9kZWxcIjtcbmltcG9ydCAqIGFzIFNlY3VyaXR5TW9kZWwgZnJvbSBcIi4uL21vZGVsL2FwaXMubW9kZWxcIjtcbmltcG9ydCAqIGFzIEFQSVNWYWxpZGF0aW9uIGZyb20gXCIuLi9tb2RlbC9hcGlzLm1vZGVsXCI7XG5pbXBvcnQgKiBhcyBQYXNzZW5nZXIgZnJvbSBcIi4uL21vZGVsL3Bhc3Nlbmdlci5tb2RlbFwiO1xuaW1wb3J0ICogYXMgZmxpZ2h0aW5mbyBmcm9tIFwiLi4vbW9kZWwvZmxpZ2h0aW5mby5tb2RlbFwiO1xuaW1wb3J0ICogYXMgRmxpZ2h0U2VydmljZUluZm8gZnJvbSBcIi4uL21vZGVsL2ZsaWdodGluZm9zZXJ2aWNlLm1vZGVsXCI7XG5pbXBvcnQgKiBhcyBtb2RlbCBmcm9tIFwiLi4vbW9kZWwvY2hlY2tpbi5tb2RlbFwiO1xuaW1wb3J0ICogYXMgcGF5bWVudCBmcm9tIFwiLi4vbW9kZWwvcGF5bWVudC5tb2RlbFwiO1xuaW1wb3J0ICogYXMgcHJpbnQgZnJvbSBcIi4uL21vZGVsL3ByaW50ZXIubW9kZWxcIjtcbmltcG9ydCAqIGFzIGNvbXBhbnNhdGlvbiBmcm9tIFwiLi4vbW9kZWwvY29tcGFuc2F0aW9uLm1vZGVsXCI7XG5pbXBvcnQgKiBhcyBQYXNzZW5nZXJUeXBlTGlzdFRhYmxlIGZyb20gXCIuLi9tb2RlbC9jb21wYW5zYXRpb24ubW9kZWxcIjtcbmltcG9ydCAqIGFzIENvbXBlbnNhdGlvblBhc3Nlbmdlckxpc3QgZnJvbSBcIi4uL21vZGVsL2NvbXBhbnNhdGlvbi5tb2RlbFwiO1xuaW1wb3J0ICogYXMgQ29tcGVuc2F0aW9uT3JkZXJMaXN0IGZyb20gXCIuLi9tb2RlbC9jb21wYW5zYXRpb24ubW9kZWxcIjtcbmltcG9ydCAqIGFzIEJSRUNvbXBlbnNhdGlvbiBmcm9tIFwiLi4vbW9kZWwvY29tcGFuc2F0aW9uLm1vZGVsXCI7XG5pbXBvcnQgKiBhcyBUb2FzdE1lc3NhZ2VzIGZyb20gXCIuLi9tb2RlbC9tZXNzYWdlLm1vZGVsXCI7XG5cbmV4cG9ydCBjb25zdCBBUFBfTU9ERUw6IGFueVtdID0gW1xuIFNlYXJjaCxcbiBTZWN1cml0eU1vZGVsLFxuIFBhc3NlbmdlcixcbiBmbGlnaHRpbmZvLFxuIEZsaWdodFNlcnZpY2VJbmZvLFxuIG1vZGVsLFxuIHBheW1lbnQsXG4gcHJpbnQsXG4gY29tcGFuc2F0aW9uLFxuIFBhc3NlbmdlclR5cGVMaXN0VGFibGUsXG4gQ29tcGVuc2F0aW9uUGFzc2VuZ2VyTGlzdCxcbiBDb21wZW5zYXRpb25PcmRlckxpc3QsXG4gQlJFQ29tcGVuc2F0aW9uLFxuIEFQSVNWYWxpZGF0aW9uLFxuIFRvYXN0TWVzc2FnZXNcbl07XG5cbmV4cG9ydCAqIGZyb20gXCIuLi9tb2RlbC9zZWFyY2gubW9kZWxcIjtcbmV4cG9ydCAqIGZyb20gXCIuLi9tb2RlbC9hcGlzLm1vZGVsXCI7XG5leHBvcnQgKiBmcm9tIFwiLi4vbW9kZWwvZmxpZ2h0aW5mb3NlcnZpY2UubW9kZWxcIjtcbmV4cG9ydCAqIGZyb20gXCIuLi9tb2RlbC9mbGlnaHRpbmZvLm1vZGVsXCI7XG5leHBvcnQgKiBmcm9tIFwiLi4vbW9kZWwvY2hlY2tpbi5tb2RlbFwiO1xuZXhwb3J0ICogZnJvbSBcIi4uL21vZGVsL3BheW1lbnQubW9kZWxcIjtcbmV4cG9ydCAqIGZyb20gXCIuLi9tb2RlbC9wcmludGVyLm1vZGVsXCI7XG5leHBvcnQgKiBmcm9tIFwiLi4vbW9kZWwvY29tcGFuc2F0aW9uLm1vZGVsXCI7XG5leHBvcnQgKiBmcm9tIFwiLi4vbW9kZWwvcGFzc2VuZ2VyLm1vZGVsXCI7XG5leHBvcnQgKiBmcm9tIFwiLi4vbW9kZWwvbWVzc2FnZS5tb2RlbFwiOyJdfQ==