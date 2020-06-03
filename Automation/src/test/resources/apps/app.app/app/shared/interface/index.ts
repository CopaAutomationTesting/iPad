import * as baggageTemplate  from "../interface/baggage.interface";
import * as departurePaxList from "../interface/departure.interface";
import * as loaderProgress  from "../interface/loaderprogress.interface";
import * as passenger  from "../interface/passenger.interface";
import * as paxTemplate from "../interface/paxtemplate.interface";
import * as multisegment from "../interface/multisegment.interface";
import * as apisdocument from "../interface/apis.interface";
import * as compensation from "../interface/compensation.interface";
import * as PrintResponse from "../interface/print.interface";

export const APP_INTERFACE: any[] = [
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

export * from "../interface/baggage.interface";
export * from "../interface/departure.interface";
export * from "../interface/loaderprogress.interface";
export * from "../interface/passenger.interface";
export * from "../interface/paxtemplate.interface";
export * from "../interface/multisegment.interface";
export * from "../interface/apis.interface";
export * from "../interface/compensation.interface";
export * from "../interface/print.interface";
