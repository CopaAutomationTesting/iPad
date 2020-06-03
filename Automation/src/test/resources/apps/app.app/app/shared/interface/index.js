"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var baggageTemplate = require("../interface/baggage.interface");
var departurePaxList = require("../interface/departure.interface");
var loaderProgress = require("../interface/loaderprogress.interface");
var passenger = require("../interface/passenger.interface");
var paxTemplate = require("../interface/paxtemplate.interface");
var multisegment = require("../interface/multisegment.interface");
var apisdocument = require("../interface/apis.interface");
var compensation = require("../interface/compensation.interface");
var PrintResponse = require("../interface/print.interface");
exports.APP_INTERFACE = [
    baggageTemplate,
    departurePaxList,
    loaderProgress,
    passenger,
    paxTemplate,
    multisegment,
    apisdocument,
    compensation,
    PrintResponse,
];
__export(require("../interface/baggage.interface"));
__export(require("../interface/departure.interface"));
__export(require("../interface/loaderprogress.interface"));
__export(require("../interface/passenger.interface"));
__export(require("../interface/paxtemplate.interface"));
__export(require("../interface/multisegment.interface"));
__export(require("../interface/apis.interface"));
__export(require("../interface/compensation.interface"));
__export(require("../interface/print.interface"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdFQUFtRTtBQUNuRSxtRUFBcUU7QUFDckUsc0VBQXlFO0FBQ3pFLDREQUErRDtBQUMvRCxnRUFBa0U7QUFDbEUsa0VBQW9FO0FBQ3BFLDBEQUE0RDtBQUM1RCxrRUFBb0U7QUFDcEUsNERBQThEO0FBRWpELFFBQUEsYUFBYSxHQUFVO0lBQ25DLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsY0FBYztJQUNkLFNBQVM7SUFDVCxXQUFXO0lBQ1gsWUFBWTtJQUNaLFlBQVk7SUFDWixZQUFZO0lBQ1osYUFBYTtDQUNiLENBQUM7QUFFRixvREFBK0M7QUFDL0Msc0RBQWlEO0FBQ2pELDJEQUFzRDtBQUN0RCxzREFBaUQ7QUFDakQsd0RBQW1EO0FBQ25ELHlEQUFvRDtBQUNwRCxpREFBNEM7QUFDNUMseURBQW9EO0FBQ3BELGtEQUE2QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGJhZ2dhZ2VUZW1wbGF0ZSAgZnJvbSBcIi4uL2ludGVyZmFjZS9iYWdnYWdlLmludGVyZmFjZVwiO1xuaW1wb3J0ICogYXMgZGVwYXJ0dXJlUGF4TGlzdCBmcm9tIFwiLi4vaW50ZXJmYWNlL2RlcGFydHVyZS5pbnRlcmZhY2VcIjtcbmltcG9ydCAqIGFzIGxvYWRlclByb2dyZXNzICBmcm9tIFwiLi4vaW50ZXJmYWNlL2xvYWRlcnByb2dyZXNzLmludGVyZmFjZVwiO1xuaW1wb3J0ICogYXMgcGFzc2VuZ2VyICBmcm9tIFwiLi4vaW50ZXJmYWNlL3Bhc3Nlbmdlci5pbnRlcmZhY2VcIjtcbmltcG9ydCAqIGFzIHBheFRlbXBsYXRlIGZyb20gXCIuLi9pbnRlcmZhY2UvcGF4dGVtcGxhdGUuaW50ZXJmYWNlXCI7XG5pbXBvcnQgKiBhcyBtdWx0aXNlZ21lbnQgZnJvbSBcIi4uL2ludGVyZmFjZS9tdWx0aXNlZ21lbnQuaW50ZXJmYWNlXCI7XG5pbXBvcnQgKiBhcyBhcGlzZG9jdW1lbnQgZnJvbSBcIi4uL2ludGVyZmFjZS9hcGlzLmludGVyZmFjZVwiO1xuaW1wb3J0ICogYXMgY29tcGVuc2F0aW9uIGZyb20gXCIuLi9pbnRlcmZhY2UvY29tcGVuc2F0aW9uLmludGVyZmFjZVwiO1xuaW1wb3J0ICogYXMgUHJpbnRSZXNwb25zZSBmcm9tIFwiLi4vaW50ZXJmYWNlL3ByaW50LmludGVyZmFjZVwiO1xuXG5leHBvcnQgY29uc3QgQVBQX0lOVEVSRkFDRTogYW55W10gPSBbXG4gYmFnZ2FnZVRlbXBsYXRlLFxuIGRlcGFydHVyZVBheExpc3QsXG4gbG9hZGVyUHJvZ3Jlc3MsXG4gcGFzc2VuZ2VyLFxuIHBheFRlbXBsYXRlLFxuIG11bHRpc2VnbWVudCxcbiBhcGlzZG9jdW1lbnQsXG4gY29tcGVuc2F0aW9uLFxuIFByaW50UmVzcG9uc2UsXG5dO1xuXG5leHBvcnQgKiBmcm9tIFwiLi4vaW50ZXJmYWNlL2JhZ2dhZ2UuaW50ZXJmYWNlXCI7XG5leHBvcnQgKiBmcm9tIFwiLi4vaW50ZXJmYWNlL2RlcGFydHVyZS5pbnRlcmZhY2VcIjtcbmV4cG9ydCAqIGZyb20gXCIuLi9pbnRlcmZhY2UvbG9hZGVycHJvZ3Jlc3MuaW50ZXJmYWNlXCI7XG5leHBvcnQgKiBmcm9tIFwiLi4vaW50ZXJmYWNlL3Bhc3Nlbmdlci5pbnRlcmZhY2VcIjtcbmV4cG9ydCAqIGZyb20gXCIuLi9pbnRlcmZhY2UvcGF4dGVtcGxhdGUuaW50ZXJmYWNlXCI7XG5leHBvcnQgKiBmcm9tIFwiLi4vaW50ZXJmYWNlL211bHRpc2VnbWVudC5pbnRlcmZhY2VcIjtcbmV4cG9ydCAqIGZyb20gXCIuLi9pbnRlcmZhY2UvYXBpcy5pbnRlcmZhY2VcIjtcbmV4cG9ydCAqIGZyb20gXCIuLi9pbnRlcmZhY2UvY29tcGVuc2F0aW9uLmludGVyZmFjZVwiO1xuZXhwb3J0ICogZnJvbSBcIi4uL2ludGVyZmFjZS9wcmludC5pbnRlcmZhY2VcIjtcbiJdfQ==