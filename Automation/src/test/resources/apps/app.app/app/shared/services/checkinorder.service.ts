//angular & nativescript references
import * as appinterface from "../../shared/interface/index";
import { Component, Injectable, Input, Output, EventEmitter } from '@angular/core';
import * as ApplicationSettings from "application-settings";

//app references
import { APISDocument, Order, SecurityValidation, CountryCollection, Inventory } from '../model/index';
import { PaxTemplate, AccontProfileModel } from '../interface/index';



@Injectable()
export class CheckinOrderService {

    public APISDocument: APISDocument;
    public CountryList: CountryCollection.Collection;
    public PassengerDetails: Order.RootObject;
    public APISDocumentDetails: any;
    public PassengerETicketDetails: Order.RootObject;
    public Ticket: any;
    public Inventory: any;
    public Inbound: any;
    public Outbound: any;
    public FQTV: any;
    public FlightStatus: any;
    public Baggagecatalog: any;
    public BagsToPrice: any;
    public StandardProducts: any[];
    public CatalogProducts: any[];
    public SegmentDetail: any;
    public PrinterInformation: any;
    public ProfileData: any;
    public DateFormat: any = "Select Date Format";
    public LicenseKey: any = "GZR5RI67-FZ7NRGBU-OJBNPM4U-KGEKLXEV-RYNUCN2R-RCS5ZFMO-DNATP4ID-M246BEHY";
    public SelectedPassenger: any;
    public APISPassenger: any;
    public SecurityPassenger:any;
    public DocumentType: any;
    public DocumentTypeList: any[];
    public ADCByPass : any;
    public ADCByPassList:any[];
    public FlightDetails: any;
    public MultiSegmentPax: any;
    public FlightHeaderInfo : any;
    public CompensationList:any;
    public CompensationFlightInfo : any;
    public CompensationOrderList :any;
    public CompensationFQTVStatusList :any[];
    public FlightHeaderInfoOrderId : any;
    public CompensationPaxList : any;
    public CompensationPassengerList: any;
    public BreCompPax : any;
    public ProfileArray: any;
    public Currency: any;
    public PointOfSale: any;
    public DeliveryDetails: any;
    public StartTime:any;
    public StartUpTable:any;
    public AdditionalDocuments;
    public AgentPrivilage: any;
    public AdtSecurityData:any;
    public CityList : any;
    public PassengerTypeList : any;
    public SegmentPax : any;
    public WorkStationDetails :any;
    public GetBagTags:Array<appinterface.Bagtag.PassengerList >=[];
    public IsWaitListed: boolean;
    public AgentProfileList:any;
    public Seatmap : any;

    SetAPISDocument(apisDocument: APISDocument) {
        this.APISDocument = apisDocument;
    }
    GetAPISDocument(): APISDocument {
        return this.APISDocument;
    }

    SetScanAPISDocument(apisDocument: APISDocument) {
        this.APISDocument = apisDocument;
    }
    GetScanAPISDocument(): APISDocument {
        return this.APISDocument;
    }

    SetCountry(country: CountryCollection.Collection) {
        this.CountryList = country;
    }

    GetCountry(): CountryCollection.Collection {
        return this.CountryList;
    }

    SetPassenger(passengerDetails: Order.RootObject) {
        this.PassengerDetails = passengerDetails;
    }

    GetPassenger(): Order.RootObject {
        return this.PassengerDetails;
    }

    SetIsWaitlisted(isWaitlist: boolean) {
        this.IsWaitListed = isWaitlist;
    }

    GetIsWaitlisted(): boolean {
        return this.IsWaitListed;
    }

    SetSecurityDocument(apisDocument: any) {
        this.APISDocumentDetails = apisDocument;
    }

    GetSecurityDocument(): any {
        return this.APISDocumentDetails;
    }

    SetSelectedPassenger(selectedPassenger: any) {
        this.SelectedPassenger = selectedPassenger;
    }

    GetSelectedPassenger(): any {
        return this.SelectedPassenger;
    }

    SetAPISPassengerList(apisPassenger: any) {
        this.APISPassenger = apisPassenger;
    }

    GetAPISPassengerList(): any {
        return this.APISPassenger;
    }

    SetSecurityPassengerList(securityPassenger: any) {
        this.SecurityPassenger = securityPassenger;
    }

    GetSecurityPassengerList(): any {
        return this.SecurityPassenger;
    }

    SetDocumentType(documentType: any) {
        this.DocumentType = documentType;
    }

    GetDocumentType(): any {
        return this.DocumentType;
    }

    SetDocumentTypeList(documentTypeList: any[]) {
        this.DocumentTypeList = documentTypeList;
    }

    GetDocumentTypeList(): any {
        return this.DocumentTypeList;
    }

    SetADCByPassNameList(ByPass: any) {
        this.ADCByPass = ByPass;
    }

    GetADCByPassNameList(): any {
        return this.ADCByPass;
    }

    SetADCByPassList(ByPassList: any[]) {
        this.ADCByPassList = ByPassList;
    }

    GetADCByPassList(): any {
        return this.ADCByPassList;
    }

    SetFlightDetails(flightDetails: any) {
        this.FlightDetails = flightDetails;
    }

    GetFlightDetails(): any {
        return this.FlightDetails;
    }

    SetMultiSegmentPax(multiSegmentPax: any) {
        this.MultiSegmentPax = multiSegmentPax;
    }

    GetMultiSegmentPax(): any {
        return this.MultiSegmentPax;
    }

    SetTier(ticket: any) {
        this.Ticket = ticket;
    }

    GetTier(): any {
        return this.Ticket;
    }

    SetInventory(inventory: any) {
        this.Inventory = inventory;
    }

    GetInventory(): any {
        return this.Inventory;
    }

    SetInbound(inbound: any) {
        this.Inbound = inbound;
    }

    GetInbound(): any {
        return this.Inbound;
    }

    SetOutbound(outbound: any) {
        this.Outbound = outbound;
    }

    GetOutbound(): any {
        return this.Outbound;
    }

    SetFQTV(fqtv: any) {
        this.FQTV = fqtv;
    }

    GetFQTV(): any {
        return this.FQTV;
    }

    SetStatus(flightStatus: any) {

        this.FlightStatus = flightStatus;
    }
    GetStatus(): any {
        return this.FlightStatus;
    }

    SetUserProfile(profileData: any) {
        this.ProfileData = profileData;
    }

    GetUserProfile(): any {
        return this.ProfileData;
    }

    SetPassengerETicket(passengerDetails: Order.RootObject) {
        this.PassengerETicketDetails = passengerDetails;
    }

    GetPassengerETicket(): Order.RootObject {
        return this.PassengerETicketDetails;
    }
    SetBaggagecatalog(baggagecatalog: any) {
        this.Baggagecatalog = baggagecatalog;
    }
    GetBaggagecatalog(): any {
        return this.Baggagecatalog;
    }
    SetBagsToPrice(bagsToPrice: any) {
        this.BagsToPrice = bagsToPrice;
    }
    GetBagsToPrice(): any {
        return this.BagsToPrice;
    }
    SetStandardProducts(standardProducts: any[]) {
        this.StandardProducts = standardProducts;
    }
    GetStandardProducts(): any[] {
        return this.StandardProducts;
    }

    SetCatalogProducts(catalogProducts: any[]) {
        this.CatalogProducts = catalogProducts;
    }
    GetCatalogProducts(): any[] {
        return this.CatalogProducts;
    }

    GetSegmentDetail(): any {
        return this.SegmentDetail;
    }
    SetSegmentDetail(segmentDetail: any) {
        this.SegmentDetail = segmentDetail;
    }
    GetDevicePrinterDeatils(): any {
        return this.PrinterInformation;
    }
    SetDevicePrinterDeatils(printerInfo: any) {
        this.PrinterInformation = printerInfo;
    }
    SetDateFormat(dateFormat: any) {
        this.DateFormat = dateFormat;
    }
    GetDateFormat() {
        return this.DateFormat;
    }
    SetLicenseKey(licensekey: any) {
        this.LicenseKey = licensekey
    }
    GetLicenseKey() {
        return this.LicenseKey;
    }

    setCompensationFQTVStatusDetails(FQTVStatus :any[]){
        this.CompensationFQTVStatusList = FQTVStatus;
    }
    getCompensationFQTVStatusDetails(){
        return  this.CompensationFQTVStatusList;
    }
    setFlightHeaderInfo(HeaderInfo){
        this.FlightHeaderInfo = HeaderInfo;
    }
    getFlightHeaderInfo(){
        return this.FlightHeaderInfo;
    }
    setSelectSegementHeaderInfo(flightInfo){
        this.FlightHeaderInfoOrderId = flightInfo;
    }
    getSelectSegementHeaderInfo(){
        return this.FlightHeaderInfoOrderId;
    }
    setIssueCompensation(comppaxlist){
        this.CompensationPaxList = comppaxlist;
    }
    getIssueCompensation(){
        return this.CompensationPaxList;
    }
    setCompensationPaxList(paxList){
        this.CompensationPassengerList = paxList;
    }
    getCompensationPaxList(){
        return this.CompensationPassengerList;
    }
    setBreCompPaxList(pax){
        this.BreCompPax = pax;
    }
    getBreCompPaxList(){
        return this.BreCompPax;
    }

    SetCurrency(currency: any) {
        this.Currency = currency;
    }
    GetCurrency() {
        return this.Currency;
    }
    SetAgentProfileList(profile:any){
        this.AgentProfileList = profile;
    }
    GetAgentProfileList(){
        return this.AgentProfileList;
    }
    SetUserPointofSale(pointOfSale) {
        this.PointOfSale = pointOfSale;
    }
    GetUserPointofSale() {
        return this.PointOfSale;
    }
    SetDeliverDetails(printerdetails: any) {
        this.DeliveryDetails = printerdetails;
    }
    GetDeliveryDetails() {
        return this.DeliveryDetails;

    }
    SetStartTime(startTime:any){
    this.StartTime = startTime;
    }
    GetStartTime(){
        return this.StartTime;
    }

    SetStartupTable(table: any) {
        this.StartUpTable = table;
    }
    GetStartupTable() {
        return this.StartUpTable;
    }
    SetAdditionalDocuments(data){
        this.AdditionalDocuments = data;
    }
    GetAdditionalDocuments(){
        return this.AdditionalDocuments;
    }
    

    setCompensationList(compensationlist : any){
        this.CompensationList = compensationlist;
    }
    getCompensationList(){
        return this.CompensationList;
    }
    setCompensationFlightDetails(flightinfo : any){
        this.CompensationFlightInfo = flightinfo;
    }
    getCompensationFlightDetails(){
        return this.CompensationFlightInfo;
    }
    setCompensationOrderDeatils(OrderDetails :any){
        this.CompensationOrderList = OrderDetails;
    }
    getCompensationOrderDeatils(){
        return  this.CompensationOrderList;
    }
    getAgentPrivilage(){
        return this.AgentPrivilage;
    }
    setAgentPrivilage( privilage : any){        
        this.AgentPrivilage = privilage;
    }
    GetAdultSecurityData(){
        return  this.AdtSecurityData;   
    }
    SetAdultSecurityData(data:any){
        this.AdtSecurityData =data;

    }
    setCityList(data  :any){
        this.CityList = data;
    }
    getCityList() {
        return this.CityList;
    }
    SetPassengerTypeService(paxList : any){
        this.PassengerTypeList = paxList;
    }
    GetPassengerTypeService(){
        return this.PassengerTypeList;
    }
    SetResidentCard(segment : any){
        this.SegmentPax = segment;
    }
    GetResidentCard(){
        return this.SegmentPax;
    }
    SetWorkStation(workStationDetails : any){
        this.WorkStationDetails = workStationDetails;
    }
    GetWorkingStation(){
        return this.WorkStationDetails;
    }

    GetBagTag(){
        return this.GetBagTags;
    }
    SetBagTag(bagtag:any){
        this.GetBagTags = bagtag;
    }
    SetSeatMap(seatMap : any){
        this.Seatmap =seatMap;
    }
    GetSeatMap(){
        return this.Seatmap;
    }
}