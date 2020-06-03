import * as Search from "../model/search.model";
import * as SecurityModel from "../model/apis.model";
import * as APISValidation from "../model/apis.model";
import * as Passenger from "../model/passenger.model";
import * as flightinfo from "../model/flightinfo.model";
import * as FlightServiceInfo from "../model/flightinfoservice.model";
import * as model from "../model/checkin.model";
import * as payment from "../model/payment.model";
import * as print from "../model/printer.model";
import * as compansation from "../model/compansation.model";
import * as PassengerTypeListTable from "../model/compansation.model";
import * as CompensationPassengerList from "../model/compansation.model";
import * as CompensationOrderList from "../model/compansation.model";
import * as BRECompensation from "../model/compansation.model";
import * as ToastMessages from "../model/message.model";

export const APP_MODEL: any[] = [
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

export * from "../model/search.model";
export * from "../model/apis.model";
export * from "../model/flightinfoservice.model";
export * from "../model/flightinfo.model";
export * from "../model/checkin.model";
export * from "../model/payment.model";
export * from "../model/printer.model";
export * from "../model/compansation.model";
export * from "../model/passenger.model";
export * from "../model/message.model";