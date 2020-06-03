import { Injectable } from '@angular/core';
import * as ApplicationSettings from "application-settings"; 
import { Observable } from 'data/observable';
var printId , binding = new Observable();

@Injectable()

export class Configuration {
    // http://ustlssoat258.airservices.svcs.entsvcs.net:12499 (dev)
    // http://ustlssoat114.airservices.svcs.entsvcs.com:8980/api409(dev)
    // http://ustlssoat258.airservices.svcs.entsvcs.net:12449/
    // http://ustlssoat114.airservices.svcs.entsvcs.com:8980/api439/account/profile
    // public CLTURL = "http://pssguicmmb.airservices.svcs.entsvcs.com:8970/"; 
    //==============================================URL=========================================================//
    // https://pssgui.copauat.travel.airservices.svcs.entsvcs.com/api/ **(UAT)**                                //
    // http://ustlssoat114.airservices.svcs.entsvcs.com:8980/api409/ **(dev)**                                  // 
    // https://pssguicmt.airservices.svcs.entsvcs.com/api/ **(jsit)**                                           // 
    // https://pssguicmmb.airservices.svcs.entsvcs.com/api/ **(sit)**                                           //
    // https://pssguicmt.airservices.svcs.entsvcs.com/api449/ **(tab sit)**                                     //
    //==========================================================================================================//
    public Server: string = "https://pssgui.copauat.travel.airservices.svcs.entsvcs.com/"; 
    public ApiUrl: string = "api/";
    public ServerWithApiUrlForSiteminderLogin = this.Server;
    public ServerWithApiUrlCheckin = this.Server + this.ApiUrl + checkin;
    public ServerWithApiUrlEmd = this.Server + this.ApiUrl + emds;
    public ServerWithApiUrlFlights = this.Server + this.ApiUrl + flights;
    public ServerWithApiUrlOrders = this.Server + this.ApiUrl + orders; 
    public ServerWithApiUrlBaggage = this.Server + this.ApiUrl + baggage;
    public ServerWithApiUrlPrice = this.Server + this.ApiUrl + price;
    public ServerWithApiUrlGetPassenger = this.Server + this.ApiUrl + getPassenger;
    public ServerWithApiUrlGetReqDocuments = this.Server + this.ApiUrl + getReq;
    public ServerWithApiUrlValidatePassenger = this.Server + this.ApiUrl + validate;
    public ServerWithApiUrlAddPassenger = this.Server + this.ApiUrl + orders;
    public ServerWithApiUrlProfile = this.Server + this.ApiUrl + profile;
    public ServerWithApiUrlCountries = this.Server + this.ApiUrl + contries;
    public ServerWithApiUrlCities = this.Server + this.ApiUrl + cities;
    public ServerWithApiUrlSeatMap = this.Server + this.ApiUrl + seatmap;
    public ServerWithApiUrlAssignSeat = this.Server + this.ApiUrl + assignseat;
    public ServerWithApiUrlbookingcount = this.Server + this.ApiUrl + flights;
    public ServerWithApiUrlOffload = this.Server + this.ApiUrl + offload;
    public ServerWithApiUrlBagTag = this.Server + this.ApiUrl + bagtag;
    public ServerWithApiUrlFQTV = this.Server + this.ApiUrl + fqtv;
    public ServerWithApiUrlPrinterDevice = this.Server + this.ApiUrl + printer;
    public ServerWithApiUrlWorkStation = this.Server;
    public HeaderApiuser =ApplicationSettings.getString("apiUserKey","");
    public FieldValidationText = emptyFieldWarning;
    public ApisDataRequired ="APIS Data Required";
    public HostPrinter = this.Server+this.ApiUrl;
    public Remarks = this.Server+this.ApiUrl +remarks;
    public RemarksCheckin = this.Server+this.ApiUrl + remarksCheckin;
    public checkin = this.Server+this.ApiUrl+passengerCheckin;
    public CompensationType = this.Server + this.ApiUrl;
    public CompensationPassengers = this.Server +  this.ApiUrl + flights;
    public CompensationOrders = this.Server + this.ApiUrl + orders;
    public CompensationCLT = "";
    public CompensationPrint = this.Server + this.ApiUrl + printreceipt;
    public CompensationEmail = this.Server + this.ApiUrl + emailreceipt;
}

const checkin:string="checkin/";
const passengerCheckin:string="checkin";
const emds:string="emds/";
const flights:string="flights/";
const orders:string="orders/";
const baggage:string="baggage/catalog/";
const price:string="baggage/price";
const getPassenger:string="orders/";
const getReq:string="orders/";
const validate:string="orders/";
const apis:string="apis";
const profile:string="account/profile";
const contries:string="countries";
const cities:string="cities/";
const seatmap:string="flights/";
const assignseat:string="seats/assign";
const offload:string ="checkin/offload";
const bagtag:string ="checkin/tags/manualbagtag";
const fqtv:string="reference?get=fqtv";
const printer: string ="delivery/printers/";
const printreceipt:string = "delivery/printreceipt/emd";
const emailreceipt:string = "delivery/emailreceipt/emd";
const emptyFieldWarning:string ="mandatory fields should not be empty";
const passengerReference:string = "reference/"
const remarks:string="checkin/tags/bagtagprintaction";
const remarksCheckin:string = "checkin/tags/checkinbagtagprint";



