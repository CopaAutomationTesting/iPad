//angular & nativescript references
import { Component,OnInit,ViewChild,ElementRef,ViewContainerRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import {ModalDialogService,ModalDialogOptions} from "nativescript-angular/modal-dialog";
import { isAndroid, isIOS, device, screen } from "platform";
import { Page } from "ui/page";
import * as dialogs from "ui/dialogs";
import { GridLayout } from "ui/layouts/grid-layout";
import * as gestures from "ui/gestures";
import { StackLayout } from "ui/layouts/stack-layout";
import { ScrollView } from "ui/scroll-view";
import { SegmentedBar, SegmentedBarItem } from "ui/segmented-bar";
import { ADCResponseComponent } from "../ADCResponse/ADCResponse-modal";
import { didTapScan } from 'nativescript-blinkid'

//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as moment from "moment";
import * as Toast from "nativescript-toast";

//app references
import { DocumentType, Order, CountryCollection, ADCByPass, APISValidation, Validation, APISEnabled, ToastMessages, APISDocument } from '../../shared/model/index';
import { LoaderProgress, MultiSegmentTemplate, Document, PhoneNumber, Address, ApisRequirement, ApisAddressRequirements, EmergencyDetail, EmergencyPhone, Country, PaxTemplate, InBound, OutBound, AssociatedPassenger, SecurityModel, ApisUpdateRequest, Nationality, IssuingCountry, ResidenceCountry } from '../../shared/interface/index';
import { DataService, PassengerService, CheckinOrderService, TimeOutService, CheckinService, MessageService } from "../../shared/services/index";
import { Converters } from "../../shared/utils/index";
import {
    DatePickerModal
} from "../../components/date-picker/date-picker-modal";
import { CreatingListPickerComponent } from "../../components/country/country-modal";
import { Configuration } from "../../app.constants";
import { AppExecutiontime } from "../../app.executiontime";
import { PercentLength } from "ui/styling/style-properties";

@Component({
    selector: "search-page",
    providers: [DataService, PassengerService, Configuration, SecurityModel, CheckinService, MessageService, APISDocument],
    templateUrl: "./components/apis/apis.component.html",
    styleUrls: ["./components/apis/apis.component.css"]
})
export class ApisComponent implements OnInit {

    @ViewChild('tabTravelDoc') tabTravelDoc: ElementRef;
    @ViewChild('tabSecondDoc') tabSecondDoc: ElementRef;
    @ViewChild('tabAddress') tabAddress: ElementRef;
    @ViewChild('pagecontainer') pageCont: ElementRef;
    @ViewChild('APIScroller') APIScroller: ElementRef;
    @ViewChild('contentContainer') contentContainer: ElementRef;
    @ViewChild('contentSecondContainer') contentSecondContainer: ElementRef;
    @ViewChild('contentThirdContainer') contentThirdContainer: ElementRef;
    public apisdetails: Array<SegmentedBarItem>;
    @ViewChild("segbar") segbar: ElementRef;

    // documentName: string = "Secondary Document";
    CountryAddress: string = "Select";
    Nationality: string = "";
    CountryOfResidence: string = "";
    CountryCode: string = "";
    expands: boolean;
    isError: boolean;
    errorMessage: string;
    loaderProgress: LoaderProgress;
    icon: boolean;
    SelectDocumentType: string;
    DocumentType: Array<any>;
    DocumentTypeList: Array<DocumentType>;
    PrimaryDocumentType: Array<any>;
    PrimaryDocumentTypeList: Array<DocumentType>;
    SecondaryDocumentType: Array<any>;
    SecondaryDocumentTypeList: Array<DocumentType>;
    ADCByPassName: Array<any>;
    ADCByPassList: Array<ADCByPass>;
    GetDocumentTypeList: any;
    DocTypeIndex: Array<any>;
    SelectedDocTypeIndex: number;
    DocIssueCountryIndex: Array<any>;
    ResidenceCodeIndex: Array<any>;
    NationalityIndex: Array<any>;
    CountryItems: any[];
    PageDocumentList: Array<string>;
    CountryList: Array<string>;
    OrderId: string;
    ResponseStatus: string;
    Firstname: string;
    Lastname: string;
    Fullname: string;
    currentDate: string;
    curDate: Date;
    PurposeOfVisit: Array<string>;
    isAPISComplete: boolean = false;
    isDeleteShown :boolean = false;
    isInputEnabled: boolean = true;
    date: any;
    checks: boolean = false;
    adcCheck: boolean = false;
    trusted: boolean = false;
    verified: boolean = false;
    isAddresses: boolean = false;
    SelectedCountryOfIssue: any[] = [];
    PassedPassengerDetail: PaxTemplate = new PaxTemplate();
    APISPassengerList: any;
    //PassedPassengerDetail: PaxTemplate = new PaxTemplate();
    FlightDetailData: any;
    emergencyExitDate: Date = new Date();
    exitDate: string = moment(this.emergencyExitDate).format("MM/DD/YYYY");
    emergencyName: string = "";
    emergencyContact: string = "";
    knownTraveler: string = "";
    reDress: string = "";
    public ApisIndex: number;
    public ButtonText: string;
    public MultiInitialIndex: number;
    public FlightInfo: MultiSegmentTemplate.FlightWithPax = new MultiSegmentTemplate.FlightWithPax;
    public FlightWithPaxArray: Array<MultiSegmentTemplate.FlightWithPax> = [];
    public MultiSegmentPaxArray: MultiSegmentTemplate.RootObject = new MultiSegmentTemplate.RootObject;
    public ApisValidation: Array<APISValidation> = [];
    public ApisValidationHighlight: Array<Validation> = [];
    public APISEnabled: APISEnabled;
    public isFirstTime: Array<boolean> = [];
    public Messages: ToastMessages;
    public APISSelection: Array<boolean> = [];
    public ArrayIndex: number = 0;
    public PassengerFirstName: string = '';
    public PassengerLastName: string = '';
    public IsChangeField: boolean = false;
    public isCompensationEnabled: boolean = false;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    public static EXITDATE: string = "PLEASE PROVIDE EXIT DATE TIME"
    public static APISCOMPLETE: string = "Complete"
    public static APISSTATUSINCOMPLETE: string = "NotComplete"
    public static VALIDDATEOFBITH: string = "Please enter the valid Date of Birth"
    public static VALIDFIRSTNAME: string = "Please enter the valid First Name "
    public static VALIDLASTNAME: string = "Please enter the valid Last Name"
    public static VALIDEXPIREDATE: string = "Please enter the valid Expiring Date"

    public static VALIDDOCUMENTNUMBER: string = "Enter the valid Document Number"
    public static VALIDCITY: string = "Please enter the valid City Name "
    public static VALIDSTATE: string = "Please enter the valid State"

    public SuffixList: Array<string> = ["MSS", "DR", "MSTR", "MS", "MRS", "MR"]
    public FlightDate: any;

    constructor(public _apisDocument: APISDocument, public _checkin: CheckinService, private _configuration: Configuration, private page: Page, private routerExtensions: RouterExtensions, public _timeoutService: TimeOutService, private router: Router, private location: Location, public securityDatas: SecurityModel, public _dataService: DataService, public _service: PassengerService, private route: ActivatedRoute, private vcRef: ViewContainerRef, private _modalService: ModalDialogService, public _shared: CheckinOrderService, public _serviceMessage: MessageService) {
        this.isError = false;
        this.errorMessage = "";
        this.loaderProgress = new LoaderProgress();
        securityDatas.ApisUpdateRequests = [new ApisUpdateRequest()];
        securityDatas.ApisUpdateRequests[0].Documents = [new Document()];
        securityDatas.ApisUpdateRequests[0].ApisRequirements = [new ApisRequirement()];
        securityDatas.ApisUpdateRequests[0].ApisAddressRequirements = [new ApisAddressRequirements()];
        securityDatas.ApisUpdateRequests[0].PhoneNumbers = [new PhoneNumber()];
        securityDatas.ApisUpdateRequests[0].Addresses = [new Address()];
        securityDatas.BypassADC = null;
        this.date = moment(new Date()).format("DD MMM YYYY");
        this.curDate = moment().toDate();
        this.route.queryParams.subscribe(params => {
            this.OrderId = params["OrderId"] != undefined ? params["OrderId"] : "";
        });
        this.icon = false;
        this.DocumentType = [];
        this.DocumentTypeList = [];
        this.PrimaryDocumentType = [];
        this.PrimaryDocumentTypeList = [];
        this.SecondaryDocumentType = [];
        this.SecondaryDocumentTypeList = [];
        this.PageDocumentList = [];
        this.DocTypeIndex = [];
        this.DocIssueCountryIndex = [];
        this.ResidenceCodeIndex = [];
        this.NationalityIndex = [];
        this.CountryItems = [];
        this.CountryList = [];
        this.apisdetails = [];
        this.PurposeOfVisit = [];
        const item = new SegmentedBarItem();
        item.title = "Primary Document";
        this.apisdetails.push(item);
        const secondItem = new SegmentedBarItem();
        secondItem.title = "Secondary Document";
        this.apisdetails.push(secondItem);
        const thirdItem = new SegmentedBarItem();
        thirdItem.title = "Destination Address";
        this.apisdetails.push(thirdItem);
    }
    isEmergencyName: boolean = false;
    isEmergencyContact: boolean = false;
    isFirstName: boolean = false;
    isCity: boolean = false;
    isAddress: boolean = false;
    isState: boolean = false;
    isLastName: boolean = false;
    isDOB: boolean = false;
    isExpiryDate: Array<boolean> = [];
    isExitDate: boolean = false;
    isDocumentNumber: Array<boolean> = [];
    isDocType: boolean = false;
    isButtonEnabled = false;
    isScanEnabled = false;
    isDeleteEnable = true;
    isNation = false;
    isResid = false;
    isDoc = false;
    isRes = false;
    isCountry = false;
    iscon = false;
    isNat = false;
    isINHIBIT = false;
    public PassengerDetail: SecurityModel;
    public ResponseData: Order.ResponseData;
    // public PassengerListNew: Array<PassengerList> = [];
    public gender: any;
    public userdetails: any;
    public index: any;
    public Visit: string;
    public isDisplayExitDate: boolean = false;
    public PassengerIndex: Array<any> = [];
    public PassengerINFIndex: Array<any> = [];
    public isSubmit: boolean = false;
    public isResidentRequired: boolean = false;
    public isVisaRequired: boolean = false;
    public isCleared: boolean = false;
    public isScannedDisabled: boolean = false;
    public ErrorResponse: number = 0;
    public IsExitDateCheck: boolean = false;
    ngOnInit() {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.loaderProgress.initLoader(this.pageCont);
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled");
        this.MultiSegmentPaxArray = this._shared.GetSegmentDetail();
        // console.dump(this.MultiSegmentPaxArray.Segment[0].Passenger[0])
        this.onLoaded();
    }
    onLoaded() {
        this.route.queryParams.subscribe(params => {
            this.index = JSON.parse(params["index"]);
            var isInhibit = params["isInhibit"];
            if (isInhibit == "NB" || isInhibit == "NM" || isInhibit == "VU" || isInhibit == "NE" || isInhibit == "ED") {
                console.log("NB");
                this.isINHIBIT = true;
            } else {
                this.isINHIBIT = false
            }
            this.FlightDate = moment(this.MultiSegmentPaxArray.Segment[this.index].FlightDate).format("DD-MMM-YYYY");
            this.MultiInitialIndex = 0;
            this.PassengerIndex = params["PassengerIndex"];
            this.PassengerINFIndex = params["PassengerINFIndex"];
            this.ApisIndex = this.PassengerIndex[0];
            this.ArrayIndex = this.PassengerIndex[0];
            console.log(this.ApisIndex)
            console.log(this.PassengerIndex)
        });
        let isMultiplePass: boolean = false;
        if (this._shared.GetSelectedPassenger().length > 1) {
            this.PassedPassengerDetail = this._shared.GetAPISPassengerList()[this.ApisIndex];
            isMultiplePass = true;
        } else {
            this.PassedPassengerDetail = this._shared.GetAPISPassengerList()[this.ApisIndex];
        }
        console.dir(this.PassedPassengerDetail);
        this.APISPassengerList = this._shared.GetAPISPassengerList();
        console.dir(this.APISPassengerList);
        this.APISSelection.length = 0;
        let orderID: string;
        let toastMessage: string = '';

        //console.log(this.PassedPassengerDetail[0].FirstName);
        //console.log(this.PassedPassengerDetail[0].LastName);
        this.securityDatas = this._shared.GetSecurityDocument();
        if (this.PassengerIndex.length > 1) {
            if (this.securityDatas.ApisUpdateRequests.length > 1) {
                this.ButtonText = "Next"
            }
        }
        else {
            this.ButtonText = "Submit"
        }
        console.log(this._shared.GetSecurityDocument())
        let apisStatus = this._shared.GetSecurityDocument().ApisDocoStatus;
        let adcStatus = this._shared.GetSecurityDocument().ADCStatus;
        //console.log(params["securityDocument"]);
        this.DocumentTypeList = this._shared.GetDocumentTypeList();
        this.DocumentType = this._shared.GetDocumentType();
        console.log("1+2");
        console.dir(this.DocumentTypeList);
        console.dir(this.DocumentTypeList.length);
        console.dir(this.DocumentType);
        console.dir(this.DocumentType.length);
        if (this.DocumentTypeList.length == 0 && this.DocumentType.length == 0) {
            let dType = this.DocumentType.length;
            if (this._shared.GetStartupTable().Tables.AdcDocumentsToAppend != null)
                this._shared.GetStartupTable().Tables.AdcDocumentsToAppend.forEach((element, index) => {
                    if (dType == 0) {
                        console.log("indexs " + index);
                        this.DocumentType.push(element.DocumentName);
                        let docList: DocumentType = new DocumentType();
                        console.log('Text ' + element.DocumentName);
                        console.log('Value ' + element.DocumentCode);
                        docList.DocType = element.DocumentCode;
                        docList.DocTypeText = element.DocumentName;
                        docList.DocLevel = element.DocumentLevel;
                        this.DocumentTypeList.push(docList);
                        console.log('docc ' + this.DocumentTypeList[index].DocTypeText);
                    }
                    else {
                        if (this.DocumentType.filter(m => m == element.Text).length == 0) {
                            this.DocumentType.push(element.DocumentName);
                            let docList: DocumentType = new DocumentType();
                            docList.DocType = element.DocumentCode;
                            docList.DocTypeText = element.DocumentName;
                            docList.DocLevel = element.DocumentLevel;
                            this.DocumentTypeList.push(docList);
                        }
                    }

                });
            this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocTypeText = this.DocumentTypeList[0].DocTypeText;
            this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocType = this.DocumentTypeList[0].DocType;
        }
        else {
            console.log('Add1');
            this._shared.GetStartupTable().Tables.AdcDocumentsToAppend.forEach((element, index) => {
                console.log('Add2');
                if (this.DocumentType.filter(m => m == element.DocumentName).length == 0) {
                    this.DocumentType.push(element.DocumentName);
                    let docList: DocumentType = new DocumentType();
                    docList.DocType = element.DocumentCode;
                    docList.DocTypeText = element.DocumentName;
                    docList.DocLevel = element.DocumentLevel;
                    this.DocumentTypeList.push(docList);
                }
            });
        }
        console.log('ddoc')
        console.log(this.DocumentTypeList.length);
        console.dir(this.DocumentTypeList);
        this.DocumentTypeList.forEach((elements, index) => {
            console.log("dc02");
            console.log(elements.DocTypeText + ' ' + elements.DocLevel.toUpperCase());
            if (elements.DocLevel.toUpperCase() == "PRIMARY") {
                this.PrimaryDocumentType.push(elements.DocTypeText);
                this.PrimaryDocumentTypeList.push(elements);
            }
            else if (elements.DocLevel.toUpperCase() == "BOTH") {
                this.PrimaryDocumentType.push(elements.DocTypeText);
                this.PrimaryDocumentTypeList.push(elements);
                this.SecondaryDocumentType.push(elements.DocTypeText);
                this.SecondaryDocumentTypeList.push(elements);
            }
            else {
                this.SecondaryDocumentType.push(elements.DocTypeText);
                this.SecondaryDocumentTypeList.push(elements);
            }
        })


        this.ADCByPassList = this._shared.GetADCByPassList();
        this.ADCByPassName = this._shared.GetADCByPassNameList();
        console.dir(this.ADCByPassList);
        console.dir(this.ADCByPassName);
        this.FlightInfo = this._shared.GetFlightDetails();
        this.Country();
        console.dir(this.FlightInfo);

        console.log("ExitDate : " + moment(new Date(), "MM/DD/YYYY").toString());
        orderID = this.PassedPassengerDetail.OrderID;
        this.OrderId = orderID;
        this._shared.GetStartupTable().Tables.PurposeOfVisit.forEach((item, index) => {
            let visitText: string = item.Text;
            this.PurposeOfVisit.push(visitText);
        })
        //this.PurposeOfVisit.push = this._shared.GetStartupTable().Tables.PurposeOfVisit;
        console.dir(this._shared.GetStartupTable().Tables.PurposeOfVisit);
        let isTrust: string = '';
        this.ApisValidation = [new APISValidation()]
        this.ApisValidation.length = 0;
        this.ApisValidationHighlight = [new Validation()]
        this.ApisValidationHighlight.length = 0;
        this.securityDatas.ApisUpdateRequests.forEach((element, apisIndex) => {
            let apisDocValiation: APISValidation = new APISValidation();
            let apisValiation: Validation = new Validation();
            if (apisStatus == ApisComponent.APISCOMPLETE && adcStatus == "OK") {
                if (isTrust == null) {
                    this.SelectedCountryOfIssue.length = 0;
                    this.securityDatas.ApisUpdateRequests[apisIndex].Documents.forEach((element, index) => {
                        this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].inputType = "Manual";
                        this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].BirthDate = "";
                        this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].DocHolderGender = "0";
                        this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].DocID = "";
                        this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].ExpireDate = "";
                        this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].IsTrustedData = false;
                        this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].CountryOfResidence = "";
                        this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].DocHolderNationality = "";
                        this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].DocIssueCountry = "";
                        this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].Firstname = "";
                        this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].Surname = "";
                        this.trusted = false;
                        apisDocValiation.CountryOfResidence = "Select";
                        apisDocValiation.Nationality = "Select";
                        apisDocValiation.CountryOfIssue.push("Select");
                        apisDocValiation.FirstName.push(true);
                        apisDocValiation.LastName.push(true);
                        apisValiation.FirstName.push(false);
                        apisValiation.LastName.push(false);

                    });
                    this.securityDatas.ApisUpdateRequests[apisIndex].Addresses.forEach((element, index) => {
                        this.securityDatas.ApisUpdateRequests[apisIndex].Addresses[0].Address = "";
                        this.securityDatas.ApisUpdateRequests[apisIndex].Addresses[0].PostalCode = "";
                        this.securityDatas.ApisUpdateRequests[apisIndex].Addresses[0].City = "";
                        this.securityDatas.ApisUpdateRequests[apisIndex].Addresses[0].State = "";
                        this.securityDatas.ApisUpdateRequests[apisIndex].Addresses[0].CountryCode = "";
                        this.securityDatas.ApisUpdateRequests[apisIndex].Addresses[0].Country = "";
                        apisDocValiation.CountryAddress = "Select";
                    });
                }
            }

            if (this.securityDatas.ApisUpdateRequests[apisIndex].Documents.length > 0) {
                this.SelectedCountryOfIssue.length = 0;
                this.securityDatas.ApisUpdateRequests[apisIndex].Documents.forEach((item, index) => {
                    if (item.DocIssueCountry != "" && item.DocIssueCountry != null) {
                        if (this.CountryItems.filter(m => m.CountryCode == item.DocIssueCountry)[0] != null) {
                            apisDocValiation.CountryOfIssue.push(this.CountryItems.filter(m => m.CountryCode == item.DocIssueCountry)[0].CountryName);
                            apisDocValiation.FirstName.push(false);
                            apisDocValiation.LastName.push(false);
                            apisValiation.FirstName.push(false);
                            apisValiation.LastName.push(false);
                            this.trusted = item.IsTrustedData;
                            this.securityDatas.ApisUpdateRequests[apisIndex].Documents[0].inputType = item.inputType;
                        }
                    } else {
                        apisDocValiation.CountryOfIssue.push("Select");
                        apisDocValiation.FirstName.push(true);
                        apisDocValiation.LastName.push(true);
                        apisValiation.FirstName.push(false);
                        apisValiation.LastName.push(false);
                    }
                    if (index == 0) {
                        if (item.DocHolderNationality != "" && item.DocHolderNationality != null) {

                            if (this.CountryItems.filter(m => m.CountryCode == item.DocHolderNationality)[0] != null) {
                                apisDocValiation.Nationality = this.CountryItems.filter(m => m.CountryCode == item.DocHolderNationality)[0].CountryName;
                                this.securityDatas.ApisUpdateRequests[apisIndex].Nationality = this.CountryItems.filter(m => m.CountryCode == item.DocHolderNationality)[0].CountryCode;
                            }
                        }
                        else {
                            apisDocValiation.Nationality = "Select";
                        }
                        if (item.CountryOfResidence != null && item.CountryOfResidence.trim() != "") {
                            if (this.CountryItems.filter(m => m.CountryCode == item.CountryOfResidence)[0] != null) {
                                apisDocValiation.CountryOfResidence = this.CountryItems.filter(m => m.CountryCode == item.CountryOfResidence)[0].CountryName
                            }
                        }
                        else {
                            apisDocValiation.CountryOfResidence = "Select";
                        }
                    }
                    this.verified = this.securityDatas.ApisUpdateRequests[apisIndex].Documents[0].IsVerifiedData;
                });
            }
            if (this.securityDatas.ApisUpdateRequests[apisIndex].Addresses.length == 0) {
                let address = new Address();
                address.Address = "";
                address.City = null;
                address.Country = null;
                address.State = null;
                address.PostalCode = null;
                this.securityDatas.ApisUpdateRequests[apisIndex].Addresses.push(address);
            }
            if (apisStatus == ApisComponent.APISCOMPLETE) {
                if ((this.securityDatas.ApisUpdateRequests[apisIndex].Documents[0].DocHolderNationality != null) && (this.securityDatas.ApisUpdateRequests[apisIndex].Documents[0].CountryOfResidence != null) && (this.securityDatas.ApisUpdateRequests[apisIndex].Documents[0].DocIssueCountry != null) && (this.securityDatas.ApisUpdateRequests[apisIndex].Documents[0].BirthDate != null) && (this.securityDatas.ApisUpdateRequests[apisIndex].Documents[0].DocID != "")) {
                    this.isAPISComplete = true;
                    this.isDeleteShown = true;
                    this.isInputEnabled = false;
                    this.isScanEnabled = false;
                }
                else {
                    this.isAPISComplete = false;
                    this.isDeleteShown = false;
                    this.isScanEnabled = true;
                }
            }
            apisDocValiation.EmergencyName = this.securityDatas.ApisUpdateRequests[apisIndex].EmergencyDetails[0].EmergencyContactName;
            apisDocValiation.EmergencyContact = this.securityDatas.ApisUpdateRequests[apisIndex].EmergencyDetails[0].EmergencyPhone.Value;
            // if(this.securityDatas.ApisUpdateRequests[apisIndex].EmergencyDetails!=null && this.securityDatas.ApisUpdateRequests[apisIndex].EmergencyDetails.length>0){
            //     apisDocValiation.EmergencyName = this.securityDatas.ApisUpdateRequests[apisIndex].EmergencyDetails[0].EmergencyContactName;
            //     apisDocValiation.EmergencyContact = this.securityDatas.ApisUpdateRequests[apisIndex].EmergencyDetails[0].EmergencyPhone.Value;
            // }
            // else
            // {
            //     this.securityDatas.ApisUpdateRequests[apisIndex].EmergencyDetails = [new EmergencyDetail()];
            //     this.securityDatas.ApisUpdateRequests[apisIndex].EmergencyDetails[0].EmergencyPhone = new EmergencyPhone();
            //     apisDocValiation.EmergencyName = this.securityDatas.ApisUpdateRequests[apisIndex].EmergencyDetails[0].EmergencyContactName;
            //     apisDocValiation.EmergencyContact = this.securityDatas.ApisUpdateRequests[apisIndex].EmergencyDetails[0].EmergencyPhone.Value;
            // }
            apisDocValiation.KnownTraveler = this.securityDatas.ApisUpdateRequests[apisIndex].KnownTravelerNumber;
            apisDocValiation.ReDress = this.securityDatas.ApisUpdateRequests[apisIndex].RedressNumber;
            this.ApisValidation.push(apisDocValiation);
            this.ApisValidationHighlight.push(apisValiation);
        });
        let pIndex = this.PassengerINFIndex[0];
        this.securityDatas.ApisUpdateRequests.forEach((element, apisIndex) => {
            this.securityDatas.ApisUpdateRequests[apisIndex].Documents.forEach((item, index) => {
                if (item.IsTrustedData == null || item.IsTrustedData == false) {
                    isTrust = null;
                    //if (apisStatus == ApisComponent.APISCOMPLETE) {
                    this.postClear(apisIndex);
                    //}
                }
            });
        });
        console.dir(this.ApisValidation);
        let messageList: any;
        // this._serviceMessage.getMessage(messageList);
        // console.dir(messageList);
        console.log("apisStatus" + apisStatus);
        console.log("adcStatus" + adcStatus);
        if (apisStatus == ApisComponent.APISCOMPLETE && adcStatus == "OK") {
            if (isTrust != null) {
                //Toast.makeText("ADC OK;APIS Complete").show();
                this.isAPISComplete = true;
                this.isDeleteShown = true;
                this.isInputEnabled = false;
                this.isScanEnabled = false;
                this.isCleared = true;
            }
        }
        else if (apisStatus == ApisComponent.APISSTATUSINCOMPLETE && adcStatus == "OK") {
            this.isInputEnabled = true;
            this.isAPISComplete = false;
            this.isDeleteShown = false;
            this.isScanEnabled = true;
            this.isCleared = true;
            //Toast.makeText("ADC OK;APIS Incomplete").show();
        }
        else if (apisStatus == ApisComponent.APISCOMPLETE && adcStatus == null) {
            ////Toast.makeText("APIS Complete").show();
            if (isTrust != null) {
                this.isAPISComplete = true;
                this.isDeleteShown = true;
                this.isInputEnabled = false;
                this.isScanEnabled = true;
                this.isCleared = true;
            }
        }
        else if (apisStatus == null && adcStatus == null) {
            this.isInputEnabled = true;
            //Toast.makeText("APIS Incomplete").show();
        }
        this.APISPassengerList.forEach((element, index) => {
            if (element.AdcDecisionStatus == "OK" && element.ApisDocoStatus == "Complete") {
                this.isAPISComplete = true;
                this.isDeleteShown = true;
                toastMessage = 'ADC OK;APIS Complete'
                if (isTrust != null) {
                    this.trusted = true;
                }
                this.isScanEnabled = false;
                this.isCleared = true;
            }
            else if (element.AdcDecisionStatus == null && element.ApisDocoStatus == "Complete") {
                this.isAPISComplete = true;
                this.isDeleteShown = true;
                toastMessage = 'APIS Complete'
                if (isTrust != null) {
                    this.trusted = true;
                }
                this.isScanEnabled = false;
                this.isCleared = true;
            }
            else if (element.AdcDecisionStatus == "COK" && element.ApisDocoStatus == "Complete") {
                this.isAPISComplete = true;
                this.isDeleteShown = true;
                toastMessage = 'ADC COK;APIS Complete'
                this.trusted = true;
                this.isScanEnabled = false;
                this.isCleared = true;

            }
            else if ((element.AdcDecisionStatus == "BYPASSED" || element.AdcDecisionStatus=="AUTOBYPASSED")&& element.ApisDocoStatus == "Complete") {
                this.isAPISComplete = true;
                this.isDeleteShown = true;
                toastMessage = 'APIS Complete'
                this.trusted = true;
                this.adcCheck = true;
                this.isScanEnabled = false;
                this.isCleared = true;

            }
            else if (element.ApisDocoStatus == "Complete") {
                this.isAPISComplete = true;
                this.isDeleteShown = true;
                toastMessage = 'APIS Complete'
                this.isScanEnabled = false;
                if (isTrust) {
                    this.trusted = true;
                    this.isCleared = true;
                }
                else {
                    this.trusted = false;
                }
            }
            else if (element.AdcDecisionStatus == 'OK' && element.ApisDocoStatus == 'NotComplete') {
                this.isAPISComplete = false;
                this.isDeleteShown = false;
                this.isScanEnabled = true;
                this.isInputEnabled = true;
                toastMessage = 'ADC OK;APIS Incomplete'
                if (this._shared.GetAPISDocument() != null) {
                    if (this._shared.GetAPISDocument().Firstname.replace(" ", "") != this.SuffixCheck(element.FirstName) && (this._shared.GetAPISDocument().Surname.replace(" ", "") == element.LastName || this._shared.GetAPISDocument().Surname.replace(" ", "") != element.LastName)) {
                        this.postClear(index);
                    }

                }
                else {
                    this.postClear(index);
                }

            }
            else {
                if (this._shared.GetAPISDocument() != null) {
                    if (this._shared.GetAPISDocument().Firstname.replace(" ", "") != this.SuffixCheck(element.FirstName) && (this._shared.GetAPISDocument().Surname.replace(" ", "") == element.LastName || this._shared.GetAPISDocument().Surname.replace(" ", "") != element.LastName)) {
                        this.securityDatas.ApisUpdateRequests[index].Documents.forEach((passData, passIndex) => {
                            passData.Firstname = '';
                            passData.Surname = '';
                        })
                        this.postClear(index);
                    }

                }
                else {
                    this.securityDatas.ApisUpdateRequests[index].Documents.forEach((passData, passIndex) => {
                        passData.Firstname = '';
                        passData.Surname = '';
                    })
                    this.postClear(index);
                }
            }
        });
        console.dir(this.securityDatas.ApisUpdateRequests[0].Documents);
        this.APISCompletionStatus(toastMessage, orderID, pIndex);
        this.ApisIndex = this.PassengerINFIndex[0];
        console.dir(this.APISPassengerList);
        console.dir(this.APISSelection);
        console.dir(this.PassedPassengerDetail);
        console.log(this._shared.GetSecurityDocument())
        this.ResponseStatus = "";
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        let docType: any = this.SelectDocumentType;
        let docindex: any = 0;
        var label = this.pageCont.nativeElement;
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args: gestures.GestureEventData) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();

        });
        this.PassengerFirstName = this.securityDatas.ApisUpdateRequests[this.ApisIndex].Firstname;
        this.PassengerLastName = this.securityDatas.ApisUpdateRequests[this.ApisIndex].Lastname;
        //this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].OCRString = this.PassedPassengerDetail[this.ApisIndex].Documents[0].ScanOCRString.split('\n')[0];
        this.Visit = this.securityDatas.ApisUpdateRequests[0].PurposeOfVisit == "" ? "Tourist" : this.securityDatas.ApisUpdateRequests[0].PurposeOfVisit;
        this.loaderProgress.hideLoader();
        console.dir(this.securityDatas.ApisUpdateRequests);
        this.securityDatas.ApisUpdateRequests.forEach((data, index) => {
            //this.securityDatas.ApisUpdateRequests[index].AssociatedAdultRPH = this._shared.GetAPISPassengerList()[index].AssociatedAdultRPH;
            //this.securityDatas.ApisUpdateRequests[index].AssociatedInfantRPH = this._shared.GetAPISPassengerList()[index].AssociatedInfantRPH;
        });
        this.securityDatas.ApisUpdateRequests.forEach((data, index) => {
            if (this.securityDatas.ApisUpdateRequests[index].Addresses != null) {
                if (this.securityDatas.ApisUpdateRequests[index].Addresses.length > 0) {
                    if (this.securityDatas.ApisUpdateRequests[index].Addresses[0].Address != null) {
                        if (this.securityDatas.ApisUpdateRequests[index].Addresses.length > 0) {
                            console.dir(this.securityDatas.ApisUpdateRequests[index].Addresses);
                            this.securityDatas.ApisUpdateRequests[index].Addresses.forEach((item, index) => {
                                if (item.Address != "" && item.Address != null) {
                                    if (this.CountryItems.filter(m => m.CountryCode == item.Country)[0] != null) {
                                        this.CountryAddress = this.CountryItems.filter(m => m.CountryCode == item.Country)[0].CountryName;
                                        this.securityDatas.ApisUpdateRequests[index].Addresses[0].CountryCode = this.CountryItems.filter(m => m.CountryName == this.CountryAddress)[0].CountryCode;
                                        this.securityDatas.ApisUpdateRequests[index].Addresses[0].Country = this.CountryItems.filter(m => m.CountryName == this.CountryAddress)[0].CountryName;
                                    }
                                }
                                else {
                                    this.CountryAddress = "Select";
                                }
                            });
                        }
                    }
                }
            }
        });
        this.isAPISScanned(this.isScannedDisabled);
    }
    SuffixCheck(firstName: string): string {
        let suffixList = firstName.split(this._shared.GetAPISDocument().Firstname.replace(" ", ""));
        let givenName: string = ''
        if (suffixList.length > 1) {
            givenName = this._shared.GetAPISDocument().Firstname.replace(" ", "");
        }
        else {
            givenName = firstName;
        }
        return givenName;
    }

    refreshFlifo() {
        this.loaderProgress.showLoader();
        this.MultiSegmentPaxArray.Segment.forEach((SegEle, SegInndex) => {

            let departureDate: string = moment(SegEle.DepartureDateTime.toString()).format("YYYY-MM-DD");
            let flightnumber: string;
            if (SegEle.MarketingFlight.substr(0, 2) == "CM") {
                flightnumber = SegEle.MarketingFlight;
            } else if (SegEle.OperatingFlight != null && SegEle.OperatingFlight.substr(0, 2) == "CM") {
                flightnumber = SegEle.OperatingFlight;
            } else {
                flightnumber = SegEle.MarketingFlight;
            }
            let city: string = SegEle.DepartureCity;
            SegEle.date = moment(SegEle.DepartureDateTime.toString()).format("DD-MMM-YYYY");
            var destination = SegEle.Destination;
            // //Inventory
            this._checkin.BookingCountDisplay(departureDate, flightnumber, city)
                .subscribe((data) => {
                    let inventory: any = data;
                    SegEle.inven = Converters.ConvertToInventory(inventory);
                });

            //Inbound
            this._checkin.InBound(departureDate, flightnumber, city)
                .subscribe((data) => {
                    let inBound: any = data;
                    SegEle.inbound = Converters.ConvertToInBound(inBound);
                })

            //Outbound
            this._checkin.OutBound(departureDate, flightnumber, destination)
                .subscribe((data) => {
                    let OutBound: any = data;
                    SegEle.outbound = Converters.ConvertToOutBound(OutBound);
                })

            //status
            this._dataService.Status(departureDate, flightnumber, city)
                .subscribe((data) => {
                    let status: any = data;
                    SegEle.status = status.Flights[0].Legs[0].Status;
                    SegEle.Legs = status.Flights[0].Legs;
                    SegEle.ETD = status.Flights[0].Legs[0].DepartureDateTime.Estimated.toString().substr(11, 5);
                    SegEle.STD = status.Flights[0].Legs[0].DepartureDateTime.Scheduled.toString().substr(11, 5);
                    SegEle.ETA = status.Flights[0].Legs[0].ArrivalDateTime.Scheduled.toString().substr(11, 5);
                    console.log(status.Flights[0].Legs[0].DepartureDateTime.Estimated.toString().substr(11, 5) + "llll");

                    let passengerLength = this.MultiSegmentPaxArray.Segment.length - 1;
                    if (passengerLength == SegInndex) {
                        this._shared.SetBagTag(null);
                        this._shared.SetSegmentDetail(this.MultiSegmentPaxArray);
                        this.loaderProgress.hideLoader();
                    }
                })

        });
    }
    ResidenceCheck(docIndex: any): boolean {
        let isResidence: boolean = true;
        let multiNational: any = this._shared.GetResidentCard();
        if (multiNational.IsInternational) {
            //if (this.securityDatas.ApisUpdateRequests[docIndex].Documents[0].DocTypeText == "Passport" || this.securityDatas.ApisUpdateRequests[docIndex].Documents[0].DocTypeText == "Diplomatic Passport" || this.securityDatas.ApisUpdateRequests[docIndex].Documents[0].DocTypeText == "Official Passport" || this.securityDatas.ApisUpdateRequests[docIndex].Documents[0].DocTypeText == "Aliens Passport") {
            let issueCountry = this.securityDatas.ApisUpdateRequests[docIndex].Documents[0].DocIssueCountry;
            let nationality = this.securityDatas.ApisUpdateRequests[docIndex].Documents[0].DocHolderNationality;
            let residence = this.securityDatas.ApisUpdateRequests[docIndex].Documents[0].CountryOfResidence;
            let destinationCountry: string = '';
            let segDestination: string = '';
            let segDestinationCry: string = '';
            let segOrigin: string = '';
            let isOrigin: boolean = false;
            this._shared.GetPassenger().Segments.forEach((segs, index) => {
                if (segs.FlightCheckIn.CheckInStatus != "NotApplicable" && segs.FlightCheckIn.CheckInStatus != "NotOpen" && segs.FlightCheckIn.CheckInStatus != "CancelledThisCity" &&
                    segs.FlightCheckIn.CheckInStatus != "ReaccommodationInProcess" &&
                    segs.FlightCheckIn.CheckInStatus != "FinalFCBIssued" &&
                    segs.FlightCheckIn.CheckInStatus != "DepartedBypassPD" &&
                    segs.FlightCheckIn.CheckInStatus != "Closed") {
                    if (!isOrigin) {
                        segOrigin = segs.Origin.AirportCode
                        isOrigin = true;
                    }
                }
            })
            let origin: string = segOrigin;
            this._shared.GetPassenger().Segments.forEach((seg, index) => {
                if (seg.FlightCheckIn.CheckInStatus != "NotApplicable" && seg.FlightCheckIn.CheckInStatus != "NotOpen" && seg.FlightCheckIn.CheckInStatus != "CancelledThisCity" && seg.FlightCheckIn.CheckInStatus != "ReaccommodationInProcess" && seg.FlightCheckIn.CheckInStatus != "FinalFCBIssued" && seg.FlightCheckIn.CheckInStatus != "DepartedBypassPD" && seg.FlightCheckIn.CheckInStatus != "Closed") {
                    if (seg.Destination.AirportCode != origin) {
                        segDestination = seg.Destination.AirportCode;
                        segDestinationCry = seg.Destination.CountryCode;
                    }
                }
            })
            let segIndex = this._shared.GetPassenger().Segments.length - 1;
            let destination = segDestination;//this._shared.GetPassenger().Segments[segIndex].Destination.AirportCode
            destinationCountry = segDestinationCry;//this._shared.GetPassenger().Segments[segIndex].Destination.CountryCode;
            let secondaryResidence: string = '';
            console.log(this.securityDatas.ApisUpdateRequests[docIndex].Documents.length);
            if (this.securityDatas.ApisUpdateRequests[docIndex].Documents.length == 2) {
                secondaryResidence = this.securityDatas.ApisUpdateRequests[docIndex].Documents[1].DocIssueCountry;
                this.securityDatas.ApisUpdateRequests[docIndex].Documents[1].IsTrustedData = true;
            }
            let isValid: boolean = true;
            let isRes: boolean = false;
            if (destinationCountry == "US") {
                isRes = true;
            }
            else if (destinationCountry == "CA") {
                isRes = true;
            }
            if (isRes) {
                if (secondaryResidence != "US" && secondaryResidence != "CA") {
                    if (destinationCountry == residence) {
                        let isDocCheck: boolean = false;
                        if (issueCountry != nationality && issueCountry == residence) {
                            isDocCheck = true;
                        }
                        else if (issueCountry == nationality && issueCountry != residence) {
                            isDocCheck = true;
                        }
                        if (isDocCheck) {
                            if (this.securityDatas.ApisUpdateRequests[docIndex].Documents.filter(m => m.DocType == "14").length > 0) {
                                let secDocument: Document = this.securityDatas.ApisUpdateRequests[docIndex].Documents.filter(m => m.DocType == "14")[0];
                                if (secDocument.DocID != "" &&
                                    secDocument.DocID != null &&
                                    secDocument.ExpireDate != "" &&
                                    secDocument.ExpireDate != null &&
                                    secDocument.Firstname != "" &&
                                    secDocument.Surname != "" &&
                                    secDocument.DocIssueCountry != null &&
                                    secDocument.DocIssueCountry != "") {
                                    isValid = true;
                                }
                                else {
                                    isValid = false;
                                }
                            }
                            else {
                                isValid = false;
                                if (this.securityDatas.ApisUpdateRequests[docIndex].Documents.length == 1) {
                                    this.add();
                                }
                            }
                        }
                        else {
                            isValid = true;
                        }
                        if (!isValid) {
                            this.securityDatas.ApisUpdateRequests[docIndex].Documents[1].DocType = "14";
                            this.securityDatas.ApisUpdateRequests[docIndex].Documents[1].DocTypeText = this.SecondaryDocumentTypeList.filter(m => m.DocType == "14").length > 0 ? this.SecondaryDocumentTypeList.filter(m => m.DocType == "14")[0].DocTypeText : '';
                            Toast.makeText("Enter Resident Card/Alien Card for " + this.securityDatas.ApisUpdateRequests[docIndex].Lastname + ", " + this.securityDatas.ApisUpdateRequests[docIndex].Firstname).show();
                            this.loaderProgress.hideLoader();
                            let segBarElm = <SegmentedBar>this.segbar.nativeElement;
                            segBarElm.selectedIndex = 1;
                            isResidence = false;
                            this.isResidentRequired = true;
                            this.isButtonEnabled = false;
                        }
                        else {
                            this.isResidentRequired = false;
                        }

                    }
                }
            }
            //}


        }
        return isResidence;
    }

    APISCompletionStatus(toastMessage: string, orderID: string, pIndex: any): void {
        this.isDeleteEnable = true;
        this.APISPassengerList.forEach((element, passIndex) => {
            console.log(element.FirstName);
            console.log(element.LastName);
            let Fname: string;
            let Lname: string;
            Fname = this.PassedPassengerDetail.FirstName;
            Lname = this.PassedPassengerDetail.LastName;
            orderID = this.PassedPassengerDetail.OrderID;
            let passenger = this._shared.GetPassenger().Passengers[pIndex];

            if (Fname == element.FirstName && Lname == element.LastName && this.PassedPassengerDetail.RPH == element.RPH) {
                this.isAPISComplete = false;
                this.isScanEnabled = true;
                if (element.AdcDecisionStatus == "OK" && element.ApisDocoStatus == "Complete") {
                    toastMessage = 'ADC OK;APIS Complete'
                    if (passenger.Documents[0].IsTrustedData != null) {
                        this.trusted = true;
                        this.isInputEnabled = false;
                        this.isAPISComplete = true;
                        this.isCleared = true;
                        this.isScanEnabled = false;
                    }
                    else {
                        this.isAPISComplete = false;
                        this.isCleared = false;
                        this.isScanEnabled = true;
                    }
                }
                else if (element.AdcDecisionStatus == null && element.ApisDocoStatus == "Complete") {
                    toastMessage = 'APIS Complete'
                    if (passenger.Documents[0].IsTrustedData != null) {
                        this.trusted = true;
                        if (passenger.Documents[0].IsTrustedData) {
                            this.isInputEnabled = false;
                            this.isAPISComplete = true;
                            this.isScanEnabled = false;
                        }
                        else {
                            this.isInputEnabled = true;
                            this.isAPISComplete = false;
                            this.isScanEnabled = true;
                        }
                        this.isCleared = true;
                    }
                    else {
                        this.isAPISComplete = false;
                        this.isScanEnabled = true;
                        this.isCleared = false;
                    }


                }
                else if (element.AdcDecisionStatus == "COK" && element.ApisDocoStatus == "Complete") {
                    this.isAPISComplete = true;
                    this.isInputEnabled = false;
                    toastMessage = 'ADC COK;APIS Complete'
                    this.trusted = true;
                    this.isCleared = true;
                    this.isScanEnabled = false;
                }
                else if ((element.AdcDecisionStatus == "BYPASSED"||element.AdcDecisionStatus=="AUTOBYPASSED") && element.ApisDocoStatus == "Complete") {
                    this.isAPISComplete = true;
                    this.isInputEnabled = false;
                    toastMessage = 'APIS Complete'
                    this.trusted = true;
                    this.isCleared = true;
                    this.isScanEnabled = false;
                }
                else if (element.AdcDecisionStatus == 'OK' && element.ApisDocoStatus == 'NotComplete') {
                    this.isAPISComplete = false;
                    this.isScanEnabled = true;
                    this.isInputEnabled = true;
                    toastMessage = 'ADC OK;APIS Incomplete'
                    this.isCleared = false;
                    if (this._shared.GetAPISDocument() != null) {
                        if (this._shared.GetAPISDocument().Firstname.replace(" ", "") != this.SuffixCheck(element.FirstName) && (this._shared.GetAPISDocument().Surname.replace(" ", "") == element.LastName || this._shared.GetAPISDocument().Surname.replace(" ", "") != element.LastName)) {
                            this.postClear(passIndex);
                        }
                        else {
                            this.isScannedDisabled = true;
                        }
                    }
                    else {
                        this.postClear(passIndex);
                    }
                }
                else if (element.ApisDocoStatus == "Complete") {

                    toastMessage = 'APIS Complete'
                    if (passenger.Documents[0].IsTrustedData != null) {
                        this.trusted = true;
                        if (passenger.Documents[0].IsTrustedData) {
                            this.isInputEnabled = false;
                            this.isAPISComplete = true;
                            this.isScanEnabled = false;
                        }
                        else {
                            this.isInputEnabled = true;
                            this.isAPISComplete = false;
                            this.isScanEnabled = true;
                        }
                    }
                    else {
                        this.isAPISComplete = false;
                        this.isScanEnabled = true;
                        this.isCleared = true;
                    }
                }
                else if (element.AdcDecisionStatus == null && element.ApisDocoStatus == null) {
                    if (this._shared.GetAPISDocument() != null) {
                        if (this._shared.GetAPISDocument().Firstname.replace(" ", "") != this.SuffixCheck(element.FirstName) && (this._shared.GetAPISDocument().Surname.replace(" ", "") == element.LastName || this._shared.GetAPISDocument().Surname.replace(" ", "") != element.LastName)) {
                            this.securityDatas.ApisUpdateRequests.forEach((doc, docIndex) => {
                                if (doc.Firstname == element.FirstName && doc.Lastname == element.LastName) {
                                    this.securityDatas.ApisUpdateRequests[docIndex].Documents.forEach((doc, dIndex) => {
                                        this.securityDatas.ApisUpdateRequests[docIndex].Documents[dIndex].Firstname = "";
                                        this.securityDatas.ApisUpdateRequests[docIndex].Documents[dIndex].Surname = "";
                                    });
                                }
                            })
                        }
                        else {
                            this.isScannedDisabled = true;
                        }
                    }
                    else {
                        this.securityDatas.ApisUpdateRequests.forEach((doc, docIndex) => {
                            if (doc.Firstname == element.FirstName && doc.Lastname == element.LastName) {
                                this.securityDatas.ApisUpdateRequests[docIndex].Documents.forEach((doc, dIndex) => {
                                    this.securityDatas.ApisUpdateRequests[docIndex].Documents[dIndex].Firstname = "";
                                    this.securityDatas.ApisUpdateRequests[docIndex].Documents[dIndex].Surname = "";
                                });
                            }
                        })
                    }
                    this.isAPISComplete = false;
                    this.isScanEnabled = true;
                    this.isInputEnabled = true;
                    toastMessage = 'APIS Incomplete'
                    this.isCleared = true;
                }
                else {
                    if (this._shared.GetAPISDocument() != null) {
                        if (this._shared.GetAPISDocument().Firstname.replace(" ", "") != this.SuffixCheck(element.FirstName) && (this._shared.GetAPISDocument().Surname.replace(" ", "") == element.LastName || this._shared.GetAPISDocument().Surname.replace(" ", "") != element.LastName)) {
                            this.securityDatas.ApisUpdateRequests.forEach((doc, docIndex) => {
                                if (doc.Firstname == element.FirstName && doc.Lastname == element.LastName) {
                                    this.securityDatas.ApisUpdateRequests[docIndex].Documents.forEach((doc, dIndex) => {
                                        this.securityDatas.ApisUpdateRequests[docIndex].Documents[dIndex].Firstname = "";
                                        this.securityDatas.ApisUpdateRequests[docIndex].Documents[dIndex].Surname = "";
                                    });

                                }
                            })
                        }
                        else {
                            this.isScannedDisabled = true;
                        }

                    }
                    else {
                        this.securityDatas.ApisUpdateRequests.forEach((doc, docIndex) => {
                            if (doc.Firstname == element.FirstName && doc.Lastname == element.LastName) {
                                this.securityDatas.ApisUpdateRequests[docIndex].Documents.forEach((doc, dIndex) => {
                                    this.securityDatas.ApisUpdateRequests[docIndex].Documents[dIndex].Firstname = "";
                                    this.securityDatas.ApisUpdateRequests[docIndex].Documents[dIndex].Surname = "";
                                });

                            }
                        })
                    }
                    this.isCleared = false;
                }
                if (element.CheckinStatus) {
                    console.log(element.CheckinStatus);
                    // this.isDeleteEnable = false
                }
                this.APISSelection.push(true);
                this.isAPISEnabled(this.isAPISComplete, passenger.Documents[0].IsTrustedData, this.ApisIndex);
            }
            else {
                this.APISSelection.push(false);
            }
        });
        if (toastMessage != '') {
            //Toast.makeText(toastMessage).show();
        }
    }

    GroupName(args: any, isData: boolean, ApisIndex: number): void {
        this.isScannedDisabled = false;
        let fName: string = args.FirstName != undefined ? args.FirstName : args.Firstname;
        let lName: string = args.LastName != undefined ? args.LastName : args.Lastname;
        let apisPassenger: any = this._shared.GetSecurityPassengerList();
        let groupedName: string = apisPassenger.filter(m => m.Firstname == fName && m.Lastname == lName)[0].GroupedGivenName;
        let lastName: string = apisPassenger.filter(m => m.Firstname == fName && m.Lastname == lName)[0].Lastname;
        let passengerNames: Array<any> = apisPassenger.filter(m => m.GroupedGivenName == groupedName);
        let groupArray: Array<string> = groupedName.split('/');
        console.dir(groupArray);
        let selectedGroupArray: Array<any> = [];
        let selectedINFGroupArray: Array<any> = [];
        selectedGroupArray.length = 0;
        selectedINFGroupArray.length = 0;
        this.PassengerIndex.length = 0;
        this.PassengerINFIndex.length = 0;
        this.isInputEnabled = true;
        let isDone: boolean = false;
        let isNotComplete: boolean = false;
        let gName: Array<string> = [];
        gName.length = 0;
        groupedName.split('/').forEach(name => {
            if (name == fName) {
                gName.push(name)
            }
            else {
                gName.push(name)
            }
        })
        this.APISEnabled = new APISEnabled();
        console.dir(this.APISPassengerList)
        if (groupedName != "" && groupedName.split('/').length > 1) {
            groupedName.split('/').forEach((element, gIndex) => {
                // gName.forEach(fname =>{
                if (fName == element) {
                    apisPassenger.forEach((pass, i) => {
                        if (pass.Firstname == fName && pass.Lastname == lastName) {
                            this.isAPISComplete = false;
                            if (pass.AdcDecisionStatus == "OK" && pass.ApisDocoStatus == "Complete") {
                                this.isAPISComplete = true;
                                this.isScanEnabled = false;
                                this.isInputEnabled = false;
                                this.isDeleteShown = true;
                                //Toast.makeText("ADC OK; APIS Complete").show();
                                isDone = true;
                                this.trusted = true;
                                this.isCleared = true;
                            }
                            else if (pass.AdcDecisionStatus == null && pass.ApisDocoStatus == "Complete") {
                                this.isAPISComplete = false;
                                this.isDeleteShown = true;
                                this.isScanEnabled = false;
                                this.isInputEnabled = false;
                                //Toast.makeText("APIS Complete").show();
                                isDone = true;
                                this.trusted = true;
                                this.isInputEnabled = false;
                                this.isCleared = true;

                                if (pass.Documents[0].IsTrustedData == null || pass.Documents[0].IsTrustedData == false) {
                                    this.trusted = false;
                                    this.isAPISComplete = false;
                                    this.isDeleteShown = false;

                                    this.isScanEnabled = true;
                                    isDone = false;
                                    this.isCleared = false;
                                }
                            }
                            else if (pass.AdcDecisionStatus == "COK" && pass.ApisDocoStatus == "Complete") {
                                this.isAPISComplete = true;
                                this.isDeleteShown = true;
                                this.isInputEnabled = false;
                                this.isScanEnabled = false;
                                //Toast.makeText("ADC COK; APIS Complete").show();
                                isDone = true;
                                this.trusted = true;
                                this.isCleared = true;
                            }
                            else if ((pass.AdcDecisionStatus == "BYPASSED"||pass.AdcDecisionStatus=="AUTOBYPASSED") && pass.ApisDocoStatus == "Complete") {
                                this.isAPISComplete = true;
                                this.isDeleteShown = true;
                                this.isScanEnabled = false;
                                this.isInputEnabled = false;
                                //Toast.makeText("APIS Complete").show();
                                isDone = true;
                                this.trusted = true;
                                this.isCleared = true;
                            }
                            else if (pass.ApisDocoStatus == "Complete") {
                                this.isAPISComplete = true;
                                this.isDeleteShown = true;
                                this.isScanEnabled = false;
                                this.isInputEnabled = false;
                                //Toast.makeText("APIS Complete").show();
                                isDone = true;
                                this.trusted = true;
                                this.isCleared = true;
                            }
                            else if (pass.AdcDecisionStatus == "OK" && pass.ApisDocoStatus == "NotComplete") {
                                //Toast.makeText("ADC OK;APIS Incomplete").show();
                                if (this._shared.GetAPISDocument() != null) {
                                    if (this._shared.GetAPISDocument().Firstname.replace(" ", "") != this.SuffixCheck(fName) && (this._shared.GetAPISDocument().Surname.replace(" ", "") == lName || this._shared.GetAPISDocument().Surname.replace(" ", "") != lName)) {
                                        if (!isData) {
                                            isNotComplete = true;
                                        }
                                    }
                                    else {
                                        this.isScannedDisabled = true;
                                    }

                                }
                                else {
                                    if (!isData) {
                                        isNotComplete = true;
                                    }
                                }
                                this.isCleared = false;
                                this.trusted = false;
                                this.isScanEnabled = true;
                            }
                            else {
                                if (this._shared.GetAPISDocument() != null) {
                                    if (this._shared.GetAPISDocument().Firstname.replace(" ", "") != this.SuffixCheck(fName) && (this._shared.GetAPISDocument().Surname.replace(" ", "") == lName || this._shared.GetAPISDocument().Surname.replace(" ", "") != lName)) {
                                        if (!isData) {
                                            isNotComplete = true;
                                        }
                                    }
                                    else {
                                        this.isScannedDisabled = true;
                                    }
                                }
                                else {
                                    if (!isData) {
                                        isNotComplete = true;
                                    }
                                }
                                this.trusted = false;
                                this.isCleared = false;
                            }
                            this.PassengerIndex.push(i);
                            this.PassengerINFIndex.push(i);

                            this.isAPISEnabled(this.isAPISComplete, pass.Documents[0].IsTrustedData, ApisIndex);
                        }
                    });
                }
                else {
                    let groupNameList = passengerNames.filter(m => m.Firstname == element)[0];
                    let groupInitial: any = { 'Firstname': '', 'Lastname': '' };
                    groupInitial.Firstname = groupNameList.Firstname;
                    groupInitial.Lastname = groupNameList.Lastname;
                    //if(!isDone)
                    //{
                    apisPassenger.forEach((pass, i) => {
                        if (pass.Firstname == groupInitial.Firstname && pass.Lastname == groupInitial.Lastname) {
                            this.isAPISComplete = false;
                            this.isScanEnabled = true;
                            if (pass.AdcDecisionStatus == "OK" && pass.ApisDocoStatus == "Complete") {
                                this.trusted = true;
                                this.isAPISComplete = true;
                                this.isCleared = true;
                                this.isScanEnabled = false;
                            }
                            else if (pass.AdcDecisionStatus == null && pass.ApisDocoStatus == "Complete") {
                                this.trusted = true;
                                this.isAPISComplete = false;
                                this.isScanEnabled = false;
                                this.isCleared = true;
                                if (pass.Documents[0].IsTrustedData == null || pass.Documents[0].IsTrustedData == false) {
                                    this.trusted = false;
                                    this.isAPISComplete = false;
                                    this.isScanEnabled = true;
                                    this.isCleared = false;
                                }
                            }
                            else if (pass.AdcDecisionStatus == "COK" && pass.ApisDocoStatus == "Complete") {
                                this.trusted = true;
                                this.isAPISComplete = true;
                                this.isScanEnabled = false;
                                this.isCleared = true;
                            }
                            else if ((pass.AdcDecisionStatus == "BYPASSED"|| pass.AdcDecisionStatus=="AUTOBYPASSED")&& pass.ApisDocoStatus == "Complete") {
                                this.trusted = true;
                                this.isAPISComplete = true;
                                this.isScanEnabled = false;
                                this.isCleared = true;
                            }
                            selectedGroupArray.push(groupInitial);
                            selectedINFGroupArray.push(groupInitial);
                        }
                    });

                    //}
                }
                // })

            })
        }
        else {
            apisPassenger.forEach((pass, index) => {
                if (pass.Firstname == fName && pass.Lastname == lName && pass.RPH == args.RPH) {
                    this.isAPISComplete = false;
                    this.isScanEnabled = true;
                    if (pass.AdcDecisionStatus == "OK" && pass.ApisDocoStatus == "Complete") {
                        this.isAPISComplete = true;
                        this.isScanEnabled = false;
                        this.isInputEnabled = false;
                        this.trusted = true;
                        this.isCleared = true;
                        //Toast.makeText("ADC OK; APIS Complete").show();
                    }
                    else if (pass.AdcDecisionStatus == null && pass.ApisDocoStatus == "Complete") {
                        this.isAPISComplete = false;
                        this.isScanEnabled = false;
                        this.isInputEnabled = false;
                        this.trusted = true;
                        this.isCleared = true;
                        if (pass.Documents[0].IsTrustedData == null || pass.Documents[0].IsTrustedData == false) {
                            this.trusted = false;
                            this.isAPISComplete = false;
                            this.isScanEnabled = true;
                            this.isCleared = false;
                        }
                        //Toast.makeText("APIS Complete").show();
                    }
                    else if (pass.AdcDecisionStatus == "COK" && pass.ApisDocoStatus == "Complete") {
                        this.isAPISComplete = true;
                        this.isScanEnabled = false;
                        this.isInputEnabled = false;
                        this.trusted = true;
                        this.isCleared = true;
                        //Toast.makeText("ADC COK; APIS Complete").show();
                    }
                    else if ((pass.AdcDecisionStatus == "BYPASSED"|| pass.AdcDecisionStatus=="AUTOBYPASSED") && pass.ApisDocoStatus == "Complete") {
                        this.isAPISComplete = true;
                        this.isScanEnabled = false;
                        this.isInputEnabled = false;
                        this.trusted = true;
                        this.isCleared = true;
                        //Toast.makeText("APIS Complete").show();
                    }
                    else if (pass.AdcDecisionStatus == "OK" && pass.ApisDocoStatus == "NotComplete") {

                        //Toast.makeText("ADC OK;APIS Incomplete").show();
                        if (!isData) {
                            isNotComplete = true;
                        }
                        this.trusted = false;
                        this.isCleared = false;
                    }
                    else {
                        this.trusted = false;
                        if (!isData) {
                            isNotComplete = true;
                        }
                        this.isCleared = false;
                    }
                    //if ((pass.AdcDecisionStatus != "OK" && pass.AdcDecisionStatus != "COK" && pass.AdcDecisionStatus != "BYPASSED") && pass.ApisDocoStatus != "Complete") {
                    if(pass.ApisDocoStatus == "NotComplete"){
                        this.isCleared = false;
                    }
                    this.PassengerIndex.push(index);
                    this.PassengerINFIndex.push(index);
                    this.isAPISEnabled(this.isAPISComplete, pass.Documents[0].IsTrustedData, ApisIndex);
                }
            })
        }
        apisPassenger.forEach((element, index) => {
            if (groupArray.length > 1) {
                let isContinue: boolean = false;
                if (element.AdcDecisionStatus == "OK" && element.ApisDocoStatus == "Complete") {
                    isContinue = true;
                }
                else if (element.AdcDecisionStatus == "COK" && element.ApisDocoStatus == "Complete") {
                    isContinue = true;
                }
                else if ((element.AdcDecisionStatus == "BYPASSED"|| element.AdcDecisionStatus=="AUTOBYPASSED") && element.ApisDocoStatus == "Complete") {
                    isContinue = true;
                }

                if (this.PassengerIndex[0] != index) {
                    if (!isContinue) {
                        if (selectedGroupArray.length > 0) {
                            selectedGroupArray.forEach(groupName => {
                                if (groupName.Firstname == element.Firstname && groupName.Lastname == element.Lastname) {
                                    this.PassengerIndex.push(index);
                                }
                            })
                        }
                    }
                    if (selectedINFGroupArray.length > 0) {
                        selectedINFGroupArray.forEach(groupName => {
                            if (groupName.Firstname == element.Firstname && groupName.Lastname == element.Lastname) {
                                this.PassengerINFIndex.push(index);
                            }
                        })

                    }
                }
            }
        });

        console.dir(selectedGroupArray);
        console.dir(apisPassenger);
        console.dir(this.PassengerIndex);
        if (isNotComplete) {
            if (this._shared.GetAPISDocument() != null) {
                if (this._shared.GetAPISDocument().Firstname.replace(" ", "") != this.SuffixCheck(fName) && (this._shared.GetAPISDocument().Surname.replace(" ", "") == lName || this._shared.GetAPISDocument().Surname.replace(" ", "") != lName)) {
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents.forEach((doc, index) => {
                        if (index == 0) {
                            if (doc.Firstname == '' || doc.Surname == '') {
                                this.postClear(this.ApisIndex);
                            }
                        }
                    })
                }
                else {
                    this.isScannedDisabled = true;
                }
            }
            else {
                this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents.forEach((doc, index) => {
                    if (index == 0) {
                        if (doc.Firstname == '' || doc.Surname == '') {
                            this.postClear(this.ApisIndex);
                        }
                    }
                })
            }

        }
        else {
            let apisPassenger: any = this._shared.GetPassenger().Passengers;
            let groupedName: string = this._shared.GetPassenger().Passengers.filter(m => m.Firstname == this.securityDatas.ApisUpdateRequests[this.ApisIndex].Firstname && m.Lastname == this.securityDatas.ApisUpdateRequests[this.ApisIndex].Lastname)[0].GroupedGivenName;
            let passengerNames: Array<any> = apisPassenger.filter(m => m.GroupedGivenName == groupedName);
            let groupArray: Array<string> = groupedName.split('/');
            let selectedGroupArray: Array<any> = [];
            let selectedINFGroupArray: Array<any> = [];
            selectedGroupArray.length = 0;
            selectedINFGroupArray.length = 0;
            if (groupedName != "" && groupedName.split('/').length > 1) {
                this.PassengerIndex.length = 0;
                //this.PassengerINFIndex.length = 0;
                groupedName.split('/').forEach((element, gIndex) => {
                    if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Firstname == element) {
                        apisPassenger.forEach((pass, i) => {
                            if (pass.Firstname == this.securityDatas.ApisUpdateRequests[this.ApisIndex].Firstname && pass.Lastname == this.securityDatas.ApisUpdateRequests[this.ApisIndex].Lastname) {
                                let isContinue: boolean = false;
                                if (pass.AdcDecisionStatus == "OK" && pass.ApisDocoStatus == "Complete") {
                                    isContinue = true;
                                }
                                else if (pass.AdcDecisionStatus == "COK" && pass.ApisDocoStatus == "Complete") {
                                    isContinue = true;
                                }
                                else if ((pass.AdcDecisionStatus == "BYPASSED"||pass.AdcDecisionStatus=="AUTOBYPASSED") && pass.ApisDocoStatus == "Complete") {
                                    isContinue = true;
                                }
                                this.PassengerIndex.push(i);
                                //this.PassengerINFIndex.push(i);
                            }
                        });
                    }
                    else {
                        let groupNameList = passengerNames.filter(m => m.Firstname == element)[0];
                        let groupInitial: any = { 'Firstname': '', 'Lastname': '' };
                        groupInitial.Firstname = groupNameList.Firstname;
                        groupInitial.Lastname = groupNameList.Lastname;
                        //if (!isDone) {
                        apisPassenger.forEach((pass, i) => {
                            if (pass.Firstname == groupInitial.Firstname && pass.Lastname == groupInitial.Lastname) {
                                selectedGroupArray.push(groupInitial);
                                selectedINFGroupArray.push(groupInitial);
                            }
                        });
                        //}
                    }

                })
            }

            this._shared.GetPassenger().Passengers.forEach((element, index) => {
                if (groupArray.length > 1) {
                    let isContinue: boolean = false;
                    if (element.AdcDecisionStatus == "OK" && element.ApisDocoStatus == "Complete") {
                        isContinue = true;
                    }
                    else if (element.AdcDecisionStatus == "COK" && element.ApisDocoStatus == "Complete") {
                        isContinue = true;
                    }
                    else if ((element.AdcDecisionStatus == "BYPASSED"||element.AdcDecisionStatus=="AUTOBYPASSED") && element.ApisDocoStatus == "Complete") {
                        isContinue = true;
                    }
                    if (!isContinue) {
                        if (this.PassengerIndex[0] != index) {
                            if (selectedGroupArray.length > 0) {
                                selectedGroupArray.forEach(groupName => {
                                    if (groupName.Firstname == element.Firstname && groupName.Lastname == element.Lastname) {
                                        this.PassengerIndex.push(index);
                                    }
                                })
                            }
                        }
                    }
                }
            });

            this.ApisIndex = this.PassengerIndex[0];
            if (this.PassengerIndex.length > 1) {
                if (this.securityDatas.ApisUpdateRequests.length > 1) {
                    this.ButtonText = "Next"
                }
            }
        }
        let segBarElm = <SegmentedBar>this.segbar.nativeElement;
        segBarElm.selectedIndex = 0;

        this.APISPassengerList.forEach((element, passIndex) => {


            if (fName == element.FirstName && lName == element.LastName && args.RPH == element.RPH) {
                this.isAPISComplete = false;
                this.isScanEnabled = true;
                if (element.AdcDecisionStatus == "OK" && element.ApisDocoStatus == "Complete") {
                    if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].IsTrustedData != null && this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].IsTrustedData != false) {
                        this.trusted = true;
                        this.isInputEnabled = false;
                        this.isAPISComplete = true;
                        this.isScanEnabled = false;
                        this.isCleared = true;
                    }
                    else {
                        this.isAPISComplete = false;
                        this.isScanEnabled = true;
                        this.isCleared = false;
                        this.trusted = false;
                    }
                }
                else if (element.AdcDecisionStatus == null && element.ApisDocoStatus == "Complete") {

                    if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].IsTrustedData != null && this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].IsTrustedData != false) {
                        this.trusted = true;
                        if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].IsTrustedData) {
                            this.isInputEnabled = false;
                            this.isAPISComplete = true;
                            this.isScanEnabled = false;
                        }
                        else {
                            this.isInputEnabled = true;
                            this.isAPISComplete = false;
                            this.isScanEnabled = true;
                        }
                        this.isCleared = true;
                    }
                    else {
                        this.isAPISComplete = false;
                        this.isScanEnabled = true;
                        this.isCleared = false;
                        this.trusted = false;
                    }


                }
                else if (element.AdcDecisionStatus == "COK" && element.ApisDocoStatus == "Complete") {
                    this.isAPISComplete = true;
                    this.isScanEnabled = false;
                    this.isInputEnabled = false;
                    this.trusted = true;
                    this.isCleared = true;
                }
                else if ((element.AdcDecisionStatus == "BYPASSED"|| element.AdcDecisionStatus=="AUTOBYPASSED" )&& element.ApisDocoStatus == "Complete") {
                    this.isAPISComplete = true;
                    this.isScanEnabled = false;
                    this.isInputEnabled = false;
                    this.trusted = true;
                    this.isCleared = true;
                }
                else if (element.AdcDecisionStatus == 'OK' && element.ApisDocoStatus == 'NotComplete') {
                    this.isAPISComplete = false;
                    this.isScanEnabled = true;
                    this.isInputEnabled = true;
                    this.isCleared = false;
                }
                else if (element.ApisDocoStatus == "Complete") {

                    if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].IsTrustedData != null && this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].IsTrustedData != false) {
                        this.trusted = true;
                        if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].IsTrustedData) {
                            this.isInputEnabled = false;
                            this.isAPISComplete = true;
                            this.isScanEnabled = false;
                        }
                        else {
                            this.isInputEnabled = true;
                            this.isAPISComplete = false;
                            this.isScanEnabled = true;
                        }
                        this.isCleared = true;
                    }
                    else {
                        this.isAPISComplete = false;
                        this.isScanEnabled = true;
                        this.isCleared = false;
                    }
                    this.isAPISComplete = false;
                    this.isScanEnabled = true;
                    this.isInputEnabled = true;
                }
                else if (element.AdcDecisionStatus == null && element.ApisDocoStatus == null) {
                    if (this._shared.GetAPISDocument() != null) {
                        if (this._shared.GetAPISDocument().Firstname.replace(" ", "") != this.SuffixCheck(element.FirstName) && (this._shared.GetAPISDocument().Surname.replace(" ", "") == element.LastName || this._shared.GetAPISDocument().Surname.replace(" ", "") != element.LastName)) {
                            this.securityDatas.ApisUpdateRequests.forEach((doc, docIndex) => {
                                if (doc.Firstname == element.FirstName && doc.Lastname == element.LastName) {
                                    this.securityDatas.ApisUpdateRequests[docIndex].Documents.forEach((doc, dIndex) => {
                                        this.securityDatas.ApisUpdateRequests[docIndex].Documents[dIndex].Firstname = "";
                                        this.securityDatas.ApisUpdateRequests[docIndex].Documents[dIndex].Surname = "";
                                    });
                                }
                            })
                        }
                    }
                    else {
                        this.securityDatas.ApisUpdateRequests.forEach((doc, docIndex) => {
                            if (doc.Firstname == element.FirstName && doc.Lastname == element.LastName) {
                                this.securityDatas.ApisUpdateRequests[docIndex].Documents.forEach((doc, dIndex) => {
                                    this.securityDatas.ApisUpdateRequests[docIndex].Documents[dIndex].Firstname = "";
                                    this.securityDatas.ApisUpdateRequests[docIndex].Documents[dIndex].Surname = "";
                                });
                            }
                        })
                    }
                    this.isAPISComplete = false;
                    this.isScanEnabled = true;
                    this.isInputEnabled = true;

                    this.isCleared = false;
                }
                this.isAPISEnabled(this.isAPISComplete, this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].IsTrustedData, ApisIndex);
            }

        });
        this.isAPISScanned(this.isScannedDisabled);

    }

    Country(): void {
        this.CountryList.length = 0;
        let countryCollections: any = this._shared.GetCountry().Collection;
        for (var cnt = 0; cnt < countryCollections.length; cnt++) {
            this.CountryList.push(countryCollections[cnt].CountryName);
        }
        this.CountryItems.length = 0;
        for (var i = 0; i < countryCollections.length; i++) {
            if (countryCollections[i].CountryCode != "00") {
                let objCountry = new CountryCollection.CountrDetail();
                objCountry.CountryCode = countryCollections[i].CountryCode;
                objCountry.CountryName = countryCollections[i].CountryName;
                objCountry.PhoneAccessCode = countryCollections[i].PhoneAccessCode;
                this.CountryItems.push(objCountry);
            }
        }
    }

    displayDocumentTypeActionDialog(id: any) {
        this.loaderProgress.showLoader();
        console.log(this.PrimaryDocumentType);
        console.log(id);
        let options = {
            title: "Document Type",
            message: "Choose  Document Type",
            cancelButtonText: "Cancel",
            actions: this.PrimaryDocumentType
        };
        dialogs.action(options).then(result => {
            if (result != "Cancel") {
                this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocTypeText = result;
                this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocType = this.PrimaryDocumentTypeList.filter(m => m.DocTypeText == result)[0].DocType;;
                console.log(this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocTypeText);
                console.log(this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocType);
            }
        });
        this.loaderProgress.hideLoader();
    }
    displaySecondaryDocumentTypeActionDialog(id: any) {
        this.loaderProgress.showLoader();
        console.log(this.DocumentType);
        console.log(id);
        let options = {
            title: "Document Type",
            message: "Choose  Document Type",
            cancelButtonText: "Cancel",
            actions: this.SecondaryDocumentType
        };
        dialogs.action(options).then(result => {
            if (result != "Cancel") {
                this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocTypeText = result;
                this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocType = this.SecondaryDocumentTypeList.filter(m => m.DocTypeText == result)[0].DocType;;
                console.log(this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocTypeText);
                console.log(this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocType);
            }
        });
        this.loaderProgress.hideLoader();
    }
    displayADCByPassActionDialog() {
        this.loaderProgress.showLoader();
        let options = {
            title: "ADC ByPass Type",
            message: "",
            cancelButtonText: "Cancel",
            actions: this.ADCByPassName
        };
        this.adcCheck = false;
        dialogs.action(options).then((result) => {
            if (result != "Cancel") {
                this.securityDatas.BypassADC = this.ADCByPassList.filter(m => m.Text == result)[0].Text;
                this.isAPISComplete = false;
                this.isScanEnabled = true;
                this.adcCheck = true;
            }
        });
        this.loaderProgress.hideLoader();
    }

    isAPISEnabled(isComplete: boolean, isTrust: boolean, ApisIndex: number) {
        let apis = this.securityDatas.ApisUpdateRequests[ApisIndex].Documents[0];
        this.APISEnabled = new APISEnabled();
        if (isComplete && isTrust) {
            if (apis.Firstname != null && apis.Firstname != "") {
                this.APISEnabled.FirstName = false;
            }
            else {
                this.APISEnabled.FirstName = true;
            }
            if (apis.Surname != null && apis.Surname != "") {
                this.APISEnabled.LastName = false;
            }
            else {
                this.APISEnabled.LastName = true;
            }
            if (apis.DocID != null && apis.DocID != "") {
                this.APISEnabled.DocID = false;
            }
            else {
                this.APISEnabled.DocID = true;
            }
            if (apis.BirthDate != null && apis.BirthDate != "") {
                this.APISEnabled.DateOfBirth = false;
            }
            else {
                this.APISEnabled.DateOfBirth = true;
            }
            if (apis.ExpireDate != null && apis.ExpireDate != "") {
                this.APISEnabled.ExpireDate = false;
            }
            else {
                this.APISEnabled.ExpireDate = true;
            }
            if (apis.DocIssueCountry != null && apis.DocIssueCountry != "") {
                this.APISEnabled.CountryOfIssue = false;
            }
            else {
                this.APISEnabled.CountryOfIssue = true;
            }
            if (apis.DocHolderNationality != null && apis.DocHolderNationality != "") {
                this.APISEnabled.Nationality = false;
            }
            else {
                this.APISEnabled.Nationality = true;
            }
            if (apis.CountryOfResidence != null && apis.CountryOfResidence != "") {
                this.APISEnabled.CountryOfResidence = false;
            }
            else {
                this.APISEnabled.CountryOfResidence = true;
            }
            if (apis.DocType != null && apis.DocType != "") {
                this.APISEnabled.DocType = false;
            }
            else {
                this.APISEnabled.DocType = true;
            }
            if (apis.DocHolderGender != null && apis.DocHolderGender != "") {
                this.APISEnabled.Gender = false;
            }
            else {
                this.APISEnabled.Gender = true;
            }
        }
    }

    isAPISScanned(isScanned: boolean) {
        if (isScanned) {
            this.APISEnabled = new APISEnabled();
            this.APISEnabled.FirstName = false;
            this.APISEnabled.LastName = false;
            this.APISEnabled.Nationality = false;
            this.APISEnabled.ExpireDate = false;
            this.APISEnabled.DocType = false;
            this.APISEnabled.DocID = false;
            this.APISEnabled.DateOfBirth = false;
            this.APISEnabled.CountryOfIssue = false;
            this.APISEnabled.Gender = false;
            this.APISEnabled.CountryOfResidence = true;
        }
    }

    ValidateDocuments(array: any) {
        if (array != -1) {
            if (array == 0) {
                if (!this.ApisValidation[this.ApisIndex].FirstName[array] &&
                    !this.ApisValidation[this.ApisIndex].LastName[array] &&
                    !this.ApisValidation[this.ApisIndex].DocID[array] &&
                    !this.ApisValidation[this.ApisIndex].ExpireDate[array] &&
                    !this.ApisValidation[this.ApisIndex].DateOfBirth &&
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocIssueCountry != null &&
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocHolderNationality != null &&
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].CountryOfResidence != "" &&
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocIssueCountry != "" &&
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocHolderNationality != "" &&
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].CountryOfResidence != null
                ) {
                    this.isButtonEnabled = true;
                    this.isAPISComplete = false;
                    this.isScanEnabled = true;
                }
                else {
                    this.isButtonEnabled = false;
                }
            }
            else {
                if (this.ApisValidation[this.ApisIndex].DocID[array] &&
                    this.ApisValidation[this.ApisIndex].FirstName[array] &&
                    this.ApisValidation[this.ApisIndex].LastName[array] &&
                    this.ApisValidation[this.ApisIndex].ExpireDate[array] &&
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocIssueCountry == null &&
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocIssueCountry == "") {

                    if (!this.ApisValidation[this.ApisIndex].FirstName[0] &&
                        !this.ApisValidation[this.ApisIndex].LastName[0] &&
                        !this.ApisValidation[this.ApisIndex].DocID[0] &&
                        !this.ApisValidation[this.ApisIndex].ExpireDate[0] &&
                        !this.ApisValidation[this.ApisIndex].DateOfBirth &&
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocIssueCountry != null &&
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocHolderNationality != null &&
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].CountryOfResidence != "" &&
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocIssueCountry != "" &&
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocHolderNationality != "" &&
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].CountryOfResidence != null
                    ) {
                        this.isButtonEnabled = true;
                    }
                    else {
                        this.isButtonEnabled = false;
                    }
                }
                else {
                    if (!this.ApisValidation[this.ApisIndex].FirstName[array] &&
                        !this.ApisValidation[this.ApisIndex].LastName[array] &&
                        !this.ApisValidation[this.ApisIndex].DocID[array] &&
                        !this.ApisValidation[this.ApisIndex].ExpireDate[array] &&
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocIssueCountry != null &&
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocIssueCountry != "") {
                        this.isButtonEnabled = true;
                    }
                    else {
                        this.isButtonEnabled = false;
                    }
                }
            }
        }


    }

    displayNationalityActionDialog(id: any) {
        let sortCountry = this.CountryList.sort((n1, n2) => {
            if (n1 > n2) {
                return 1;
            }

            if (n1 < n2) {
                return -1;
            }
            return 0;
        });
        let countryItem: string[] = sortCountry;

        let selectedCountryList: string[] = [];

        if (this.ApisValidation[this.ApisIndex].Nationality != "Select") {
            //selectedCountryList.length = 0;
            countryItem.forEach((elements, index) => {
                if (selectedCountryList.length == 0) {
                    selectedCountryList.push(this.ApisValidation[this.ApisIndex].Nationality);
                    selectedCountryList.push(elements);
                } else {
                    if (elements != this.ApisValidation[this.ApisIndex].Nationality) {
                        selectedCountryList.push(elements);
                    }
                }
            });
            sortCountry = [];
            sortCountry = selectedCountryList;
            console.dir(sortCountry);
        }
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: [{ country: sortCountry, selected: this.ApisValidation[this.ApisIndex].Nationality }],
            fullscreen: false
        };

        this._modalService
            .showModal(CreatingListPickerComponent, options)
            .then(result => {
                console.log("date result " + result);
                if (result) {
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocHolderNationality = this.CountryItems.filter(m => m.CountryName == result)[0].CountryCode;
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Nationality = this.CountryItems.filter(m => m.CountryName == result)[0].CountryCode;
                    // if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocIssueCountry == "" || this.ApisValidation[this.ApisIndex].CountryOfIssue[id] == "Select") {
                    //     this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocIssueCountry = this.CountryItems.filter(m => m.CountryName == result)[0].CountryCode;
                    //     this.ApisValidation[this.ApisIndex].CountryOfIssue[id] = result;
                    // }
                    // if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].CountryOfResidence == "" || this.ApisValidation[this.ApisIndex].CountryOfResidence == "Select") {
                    //     this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].CountryOfResidence = this.CountryItems.filter(m => m.CountryName == result)[0].CountryCode;
                    //     this.ApisValidation[this.ApisIndex].CountryOfResidence = result;
                    // }
                    this.ApisValidation[this.ApisIndex].Nationality = result;
                    this.ValidateDocuments(id);
                }
            });


    }

    displayCountryOfResidenceActionDialog(id: any) {
        let sortCountry = this.CountryList.sort((n1, n2) => {
            if (n1 > n2) {
                return 1;
            }

            if (n1 < n2) {
                return -1;
            }
            return 0;
        });
        let countryItem: string[] = sortCountry;

        let selectedCountryList: string[] = [];

        if (this.ApisValidation[this.ApisIndex].CountryOfResidence != "Select") {
            //selectedCountryList.length = 0;
            countryItem.forEach((elements, index) => {
                if (selectedCountryList.length == 0) {
                    selectedCountryList.push(this.ApisValidation[this.ApisIndex].CountryOfResidence);
                    selectedCountryList.push(elements);
                } else {
                    if (elements != this.ApisValidation[this.ApisIndex].CountryOfResidence) {
                        selectedCountryList.push(elements);
                    }
                }
            });
            sortCountry = [];
            sortCountry = selectedCountryList;
        }
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: [{ country: sortCountry, selected: this.ApisValidation[this.ApisIndex].CountryOfResidence }],
            fullscreen: false
        };

        this._modalService
            .showModal(CreatingListPickerComponent, options)
            .then(result => {
                // console.log(this.CountryItems.filter(m => m.CountryName == result)[0].CountryCode);
                if (result) {
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].CountryOfResidence = this.CountryItems.filter(m => m.CountryName == result)[0].CountryCode;
                    //this.securityDatas.ApisUpdateRequests[this.ApisIndex].Nationality = this.CountryItems.filter(m => m.CountryName == result)[0].CountryCode;
                    // if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocIssueCountry == "" || this.ApisValidation[this.ApisIndex].CountryOfIssue[id] == "Select") {
                    //     this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocIssueCountry = this.CountryItems.filter(m => m.CountryName == result)[0].CountryCode;
                    //     this.ApisValidation[this.ApisIndex].CountryOfIssue[id] = result;
                    // }
                    // if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocHolderNationality == "" || this.ApisValidation[this.ApisIndex].Nationality == "Select") {
                    //     this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocHolderNationality = this.CountryItems.filter(m => m.CountryName == result)[0].CountryCode;
                    //     this.ApisValidation[this.ApisIndex].Nationality = result;
                    // }
                    this.ApisValidation[this.ApisIndex].CountryOfResidence = result;
                    this.ValidateDocuments(id);
                }
            });
    }

    displayDocumentIssueActionDialog(id: any) {
        console.log(id);
        let sortCountry = this.CountryList.sort((n1, n2) => {
            if (n1 > n2) {
                return 1;
            }

            if (n1 < n2) {
                return -1;
            }
            return 0;
        });
        let countryItem: string[] = sortCountry;

        let selectedCountryList: string[] = [];

        if (this.ApisValidation[this.ApisIndex].CountryOfIssue[0] != "Select") {
            //selectedCountryList.length = 0;
            countryItem.forEach((elements, index) => {
                if (selectedCountryList.length == 0) {
                    selectedCountryList.push(this.ApisValidation[this.ApisIndex].CountryOfIssue[0]);
                    selectedCountryList.push(elements);
                } else {
                    if (elements != this.ApisValidation[this.ApisIndex].CountryOfIssue[0]) {
                        selectedCountryList.push(elements);
                    }
                }
            });
            sortCountry = [];
            sortCountry = selectedCountryList;
        }
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: [
                { country: sortCountry, selected: this.ApisValidation[this.ApisIndex].CountryOfIssue[id] }
            ],
            fullscreen: false
        };

        this._modalService.showModal(CreatingListPickerComponent, options)
            .then((result) => {
                if (result) {
                    console.log(this.CountryItems.filter(m => m.CountryName == result)[0].CountryCode);
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocIssueCountry = this.CountryItems.filter(m => m.CountryName == result)[0].CountryCode;
                    this.ApisValidation[this.ApisIndex].CountryOfIssue[id] = result;
                    // if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocHolderNationality == "" || this.ApisValidation[this.ApisIndex].Nationality == "Select") {
                    //     this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].DocHolderNationality = this.CountryItems.filter(m => m.CountryName == result)[0].CountryCode;
                    //     this.ApisValidation[this.ApisIndex].Nationality = result;
                    // }
                    // if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].CountryOfResidence == "" || this.ApisValidation[this.ApisIndex].CountryOfResidence == "Select") {
                    //     this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[id].CountryOfResidence = this.CountryItems.filter(m => m.CountryName == result)[0].CountryCode;
                    //     this.ApisValidation[this.ApisIndex].CountryOfResidence = result;
                    // }
                    this.ValidateDocuments(id);
                }
            });
    }


    displayVisitActionDialog(id: any) {
        let options = {
            title: "Purpose of Visit",
            actions: this.PurposeOfVisit
        };
        dialogs.action(options).then((result) => {
            if (result) {
                this.Visit = result;
                this.securityDatas.ApisUpdateRequests[this.ApisIndex].PurposeOfVisit = this.Visit;
            }
        });
    }

    displayCountryActionDialog() {
        console.log("country");
        let sortCountry = this.CountryList.sort((n1, n2) => {
            if (n1 > n2) {
                return 1;
            }

            if (n1 < n2) {
                return -1;
            }
            return 0;
        });
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: [{ country: sortCountry, selected: this.CountryAddress }],
            fullscreen: false
        };

        this._modalService.showModal(CreatingListPickerComponent, options)
            .then((result) => {
                if (result) {
                    console.log(this.CountryItems.filter(m => m.CountryName == result)[0].CountryAddress);
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].CountryCode = this.CountryItems.filter(m => m.CountryName == result)[0].CountryCode;
                    this.CountryAddress = result;
                    if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].CountryCode == "" || this.ApisValidation[this.ApisIndex].CountryAddress == "Select") {
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].CountryCode = this.CountryItems.filter(m => m.CountryName == result)[0].CountryCode;
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].Country = this.CountryItems.filter(m => m.CountryName == result)[0].CountryName;
                        this.ApisValidation[this.ApisIndex].CountryAddress = result;
                    }
                }



            });
    }
    public selectSegment(e: any) {
        var selInd = e.newIndex;
        var tabtc = this.tabTravelDoc.nativeElement;
        var tabsd = <StackLayout>this.tabSecondDoc.nativeElement;
        var taba = <StackLayout>this.tabAddress.nativeElement;
        if (selInd == 0) {
            tabtc.visibility = "visible";
            taba.visibility = "collapse";
            tabsd.visibility = "collapse";
        }
        else if (selInd == 1) {
            tabsd.visibility = "visible";
            tabtc.visibility = "collapse";
            taba.visibility = "collapse";
        }
        else if (selInd == 2) {
            // if (this.ResponseData.ApisStatusList[this.ApisIndex].AllowToAddAddress) {
            tabtc.visibility = "collapse";
            taba.visibility = "visible";
            tabsd.visibility = "collapse";
            //} else {
            // let segBarElm = <SegmentedBar>this.segbar.nativeElement;
            // segBarElm.selectedIndex = 0;
            //}

        }
    }
    add(apisIndex:any = this.ApisIndex) {
        this.loaderProgress.showLoader();
        if (this.securityDatas.ApisUpdateRequests[0].Documents.length < this.DocumentType.length) {
            this.icon = true;
            let objDoc = new Document();
            objDoc.Surname = "";//this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].Surname;
            objDoc.Firstname = ""; //this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].Firstname;
            objDoc.DocID = null;
            objDoc.BirthDate = this.securityDatas.ApisUpdateRequests[apisIndex].Documents[0].BirthDate;
            objDoc.ExpireDate = null;
            objDoc.DocIssueCountry = null;
            objDoc.DocHolderNationality = this.securityDatas.ApisUpdateRequests[apisIndex].Documents[0].DocHolderNationality;
            objDoc.DocHolderGender = this.securityDatas.ApisUpdateRequests[apisIndex].Documents[0].DocHolderGender;
            //objDoc.EffectiveDate = this.securityDatas.Documents[0].EffectiveDate;
            objDoc.CountryOfResidence = this.securityDatas.ApisUpdateRequests[apisIndex].Documents[0].CountryOfResidence;
            //objDoc.IsTrustedData = true;
            //objDoc.IsVerifiedData = true;
            objDoc.DocType = this.SecondaryDocumentType[this.SecondaryDocumentType.length - 2].DocType;
            objDoc.DocTypeText = this.SecondaryDocumentTypeList[this.SecondaryDocumentType.length - 2].DocTypeText;
            objDoc.DocLevelInd = this.securityDatas.ApisUpdateRequests[apisIndex].Documents[0].DocLevelInd;
            this.securityDatas.ApisUpdateRequests[apisIndex].Documents.push(objDoc);
            let setIndex: any = 0;
            this.securityDatas.ApisUpdateRequests[apisIndex].Documents.forEach((doctype, index) => {
                setIndex = index;
            });
            this.DocTypeIndex.push(setIndex);
            this.SelectedCountryOfIssue.push("Select");
            if (objDoc.CountryOfResidence == null && objDoc.CountryOfResidence == '') {
                this.ApisValidation[apisIndex].CountryOfIssue.push("Select");
                this.ApisValidationHighlight[apisIndex].CountryOfIssue.push("Select");
            }
            this.ApisValidation[apisIndex].FirstName.push(true);
            this.ApisValidation[apisIndex].LastName.push(true);
            this.ApisValidation[apisIndex].DocID.push(true);
            this.ApisValidation[apisIndex].ExpireDate.push(true);


            this.ApisValidationHighlight[apisIndex].FirstName.push(true);
            this.ApisValidationHighlight[apisIndex].LastName.push(true);
            this.ApisValidationHighlight[apisIndex].DocID.push(true);
            this.ApisValidationHighlight[apisIndex].ExpireDate.push(true);


        }
        let scrView = <ScrollView>this.APIScroller.nativeElement;
        let scrSecondView = <ScrollView>this.APIScroller.nativeElement;
        let contView = <GridLayout>this.contentContainer.nativeElement;
        let contSecondView = <GridLayout>this.contentSecondContainer.nativeElement;

        scrView.scrollToVerticalOffset(PercentLength.toDevicePixels(contView.height), true);
        scrSecondView.scrollToVerticalOffset(PercentLength.toDevicePixels(contSecondView.height), true);
        this.loaderProgress.hideLoader();
    }

    public remove(item: Document, i: any) {
        this.loaderProgress.showLoader();
        var index = this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents.indexOf(item);
        if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[index].DocType == "14") {
            this.isResidentRequired = false;
        }
        if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[index].DocType != "") {
            this.isVisaRequired = false;
        }
        if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].Firstname != '' &&
            this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].Surname != '' &&
            this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocID != null &&
            this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].ExpireDate != null &&
            this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocIssueCountry != null &&
            this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocHolderNationality != null &&
            this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].CountryOfResidence != null &&
            this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].BirthDate != '') {
            this.isButtonEnabled = true;
        }
        else {
            this.isButtonEnabled = false;
        }
        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents.splice(index, 1);
        this.ApisValidation[this.ApisIndex].CountryOfIssue.splice(index, 1);
        this.loaderProgress.hideLoader();
        this.isDocumentNumber[i] = false;
        this.isExpiryDate[i] = false;

    }

    navigateToSearch() {
        if (this.isCheckinDisabled == true) {
            this.routerExtensions.navigate(["search"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                }
            });
        }
    }

    navigateToDepartures() {
        if (this.isGateDisabled == true) {
            this.routerExtensions.navigate(["departhome"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                }
            });
        }
    }

    onChange(args: any, index: any, array: any) {
        this._timeoutService.resetWatch();
        console.log(index);
        let isBulid: boolean = false;
        let isEdit: boolean = false;
        if (this.PassengerIndex.length == 1) {
            this.ButtonText = 'Submit';
        }
        let isExitDateValidateJustification: boolean = false;
        let isExitValidateDate: boolean = false;
        let exitDateValue: string = "";
        let exitJusitification: string = "";
        let addressDetails: boolean = false;
        switch (index) {
            case 0:
                if (args.trim() === '') {
                    isBulid = true;
                    this.ApisValidationHighlight[this.ApisIndex].FirstName[array] = false;
                    this.ApisValidation[this.ApisIndex].FirstName[array] = true;
                }
                else {
                    this.ApisValidation[this.ApisIndex].FirstName[array] = false;
                    this.ApisValidationHighlight[this.ApisIndex].FirstName[array] = false;
                    var reg = new RegExp('^[a-zA-Z ]+$');
                    var test = reg.test(args);
                    if (test == false) {
                        this.ApisValidation[this.ApisIndex].FirstName[array] = true;
                        this.ApisValidationHighlight[this.ApisIndex].FirstName[array] = true;
                        Toast.makeText(ApisComponent.VALIDFIRSTNAME).show();
                        this.isButtonEnabled = false;
                        //this.isAPISComplete = false;
                    }
                }
                break;
            case 1:
                if (args == "") {
                    this.isButtonEnabled = false;
                    isBulid = true;
                    this.ApisValidationHighlight[this.ApisIndex].LastName[array] = false;
                    this.ApisValidation[this.ApisIndex].LastName[array] = true;
                }
                else if (args != "") {
                    this.ApisValidation[this.ApisIndex].LastName[array] = false;
                    this.ApisValidationHighlight[this.ApisIndex].LastName[array] = false;
                    var reg = new RegExp("^[a-zA-Z ]+$");
                    var test = reg.test(args);
                    if (test == false) {
                        this.ApisValidation[this.ApisIndex].LastName[array] = true;
                        this.ApisValidationHighlight[this.ApisIndex].LastName[array] = true;
                        this.isButtonEnabled = false;
                        //this.isAPISComplete = false;
                        Toast.makeText(ApisComponent.VALIDLASTNAME).show();
                    }
                }
                break;
            case 2:
                // if (this.securityDatas.Documents[0].BirthDate == "") this.isDOB = true;
                // else this.isDOB = false;
                if (args == "") {
                    isBulid = true;
                    this.ApisValidationHighlight[this.ApisIndex].DateOfBirth = false;
                    this.ApisValidation[this.ApisIndex].DateOfBirth = true;
                }
                else if (args != "") {
                    var curDate = moment(new Date());
                    var birthDate = moment(args, "MM/DD/YYYY");
                    console.log(birthDate);
                    if (birthDate.isValid()) {
                        var regex = new RegExp(/\d{1,2}[/]\d{1,2}[/]\d{4}/g);
                        var rtest = regex.test(args)
                        console.log(regex.test(args));
                        if (rtest) {
                            if (birthDate > curDate) {
                                Toast.makeText(ApisComponent.VALIDDATEOFBITH).show();
                                this.ApisValidation[this.ApisIndex].DateOfBirth = true;
                                this.ApisValidationHighlight[this.ApisIndex].DateOfBirth = true;
                            }
                            else {
                                this.ApisValidation[this.ApisIndex].DateOfBirth = false;
                                this.ApisValidationHighlight[this.ApisIndex].DateOfBirth = false;
                                //this.isAPISComplete = false;
                            }
                        } else {
                            Toast.makeText(ApisComponent.VALIDDATEOFBITH).show();
                            this.ApisValidation[this.ApisIndex].DateOfBirth = true;
                            this.ApisValidationHighlight[this.ApisIndex].DateOfBirth = true;
                            this.isButtonEnabled = false;
                        }
                    } else {
                        Toast.makeText(ApisComponent.VALIDDATEOFBITH).show();
                        this.ApisValidation[this.ApisIndex].DateOfBirth = true;
                        this.ApisValidationHighlight[this.ApisIndex].DateOfBirth = true;
                        this.isButtonEnabled = false;
                    }
                }
                break;
            case 3:
                if (args == "") {
                    let dates: Date
                    isBulid = true;
                    this.ApisValidationHighlight[this.ApisIndex].DocID[array] = false;
                    this.ApisValidation[this.ApisIndex].DocID[array] = true;
                    //Toast.makeText(this._configuration.FieldValidationText).show();
                } else if (args != "") {
                    this.ApisValidationHighlight[this.ApisIndex].DocID[array] = false;
                    this.ApisValidation[this.ApisIndex].DocID[array] = false;
                    var reg = new RegExp("^[a-zA-Z0-9]*$");
                    var test = reg.test(args);
                    if (test == false) {
                        this.ApisValidation[this.ApisIndex].DocID[array] = true;
                        this.ApisValidationHighlight[this.ApisIndex].DocID[array] = true;
                        Toast.makeText(ApisComponent.VALIDDOCUMENTNUMBER).show();
                    } else {
                        if (args != "") {
                            this.ApisValidation[this.ApisIndex].DocID[array] = false;
                            this.ApisValidationHighlight[this.ApisIndex].DocID[array] = false;
                        }
                        // this.isAPISComplete = false;
                    }
                }
                break;
            case 4:
                // if (args) this.isExpiryDate[array] = true;
                // else this.isExpiryDate[array] = false;
                if (args == "") {
                    isBulid = true;
                    this.ApisValidationHighlight[this.ApisIndex].ExpireDate[array] = false;
                    this.ApisValidation[this.ApisIndex].ExpireDate[array] = true;
                }
                else if (args != "") {
                    var curDate = moment(new Date());
                    var expDate = moment(args, "MM/DD/YYYY");
                    console.log(expDate);
                    if (expDate.isValid()) {
                        var regex = new RegExp(/\d{1,2}[/]\d{1,2}[/]\d{4}/g);
                        var rtest = regex.test(args)
                        //console.log(regex.test(this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].ExpireDate));
                        if (rtest) {
                            if (curDate > expDate) {
                                if (curDate.format("MM/DD/YYYY") == expDate.format("MM/DD/YYYY")) {
                                    this.ApisValidation[this.ApisIndex].ExpireDate[array] = false;
                                    this.ApisValidationHighlight[this.ApisIndex].ExpireDate[array] = false;
                                }
                                else {
                                    Toast.makeText(ApisComponent.VALIDEXPIREDATE).show();
                                    this.ApisValidation[this.ApisIndex].ExpireDate[array] = true;
                                    this.ApisValidationHighlight[this.ApisIndex].ExpireDate[array] = true;
                                }
                            }
                            else {
                                this.ApisValidation[this.ApisIndex].ExpireDate[array] = false;
                                this.ApisValidationHighlight[this.ApisIndex].ExpireDate[array] = false;
                                //this.isAPISComplete = false;
                            }
                        } else {
                            Toast.makeText(ApisComponent.VALIDEXPIREDATE).show();
                            this.ApisValidation[this.ApisIndex].ExpireDate[array] = true;
                            this.ApisValidationHighlight[this.ApisIndex].ExpireDate[array] = true;
                        }
                    } else {
                        Toast.makeText(ApisComponent.VALIDEXPIREDATE).show();
                        this.ApisValidation[this.ApisIndex].ExpireDate[array] = true;
                        this.ApisValidationHighlight[this.ApisIndex].ExpireDate[array] = true;
                        this.isButtonEnabled = false;
                    }
                }
                break;
            case 5:
                if (this.ApisValidation[this.ApisIndex].Nationality == "") {
                    this.isNation = true;
                } else {
                    this.isNation = false;
                }
                break;
            case 6:
                if (this.ApisValidation[this.ApisIndex].CountryOfResidence == "") {
                    this.isResid = true;
                } else {
                    this.isResid = false;
                }
                break;
            case 7:
                if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocTypeText == "") {
                    this.isDoc = true;
                } else {
                    this.isDoc = false;
                    //this.isAPISComplete = false;
                }
                break;
            case 8:
                if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocIssueCountry == "" || this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocIssueCountry == null) {
                    this.isCountry = true;
                } else {
                    this.isCountry = false;
                }
                break;
            case 9:
                // if (args) this.isExpiryDate[array] = true;
                // else this.isExpiryDate[array] = false;
                console.log("1++" + args + this.exitDate);
                var curDate = moment(new Date());
                var expDate = moment(args, "MM/DD/YYYY");
                console.log(expDate);
                exitJusitification = this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDateJustification;
                if (args == "") {
                    this.isExitDate = false;
                    if (this.IsExitDateCheck) {
                        if (args == "") {
                            // this.isButtonEnabled = false;
                            isExitValidateDate = true;
                        } else {
                            // this.isButtonEnabled = true;
                            isExitValidateDate = false;
                        }
                    }
                    exitDateValue = "";
                }
                else {
                    if (args != "") {
                        var curDate = moment(new Date());
                        var expDate = moment(args, "MM/DD/YYYY");
                        console.log(expDate);
                        if (expDate.isValid()) {
                            var regex = new RegExp(/\d{1,2}[/]\d{1,2}[/]\d{4}/g);
                            var rtest = regex.test(args);
                            console.log(rtest);
                            if (rtest) {
                                if (args < curDate) {
                                    //Toast.makeText("Please enter the valid Exit Date").show();
                                    this.isExitDate = true;
                                } else {
                                    this.isExitDate = false;
                                    //this.isAPISComplete = false;
                                }
                            } else {
                                //Toast.makeText("Please enter the valid Exit Date").show();
                                this.isExitDate = true;
                            }

                        } else {
                            //Toast.makeText("Please enter the valid Exit Date").show();
                            this.isExitDate = true;
                            // this.isButtonEnabled = false;
                        }
                        if (this.IsExitDateCheck) {
                            if (this.isExitDate) {
                                // this.isButtonEnabled = false;
                                isExitValidateDate = true;
                                exitDateValue = "";
                            } else {
                                // this.isButtonEnabled = true;
                                isExitValidateDate = false;
                                exitDateValue = "Date";
                            }
                        }
                    }
                }
                break;
            case 10:
                var reg = new RegExp('^[a-zA-Z]+$');
                var test = reg.test(this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].City);
                if (test == false && this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].City) {
                    this.ApisValidation[this.ApisIndex].isCity = true;
                }
                else {
                    this.ApisValidation[this.ApisIndex].isCity = false;
                }
                // var reg = new RegExp('^[a-zA-Z ]+$');
                // var test = reg.test(this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].City);
                // if (test == false) {
                //     console.log("city");
                //     this.ApisValidation[this.ApisIndex].isCity = true;
                //     Toast.makeText(ApisComponent.VALIDCITY).show();
                // }
                break;
            case 11:
                var reg = new RegExp('[a-zA-Z]+$');
                var test = reg.test(this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].State);
                if (test == false && this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].State) {
                    this.ApisValidation[this.ApisIndex].isState = true;
                }
                else {
                    this.ApisValidation[this.ApisIndex].isState = false;
                }
                // var reg = new RegExp('^[a-zA-Z ]+$');
                // var test = reg.test(this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].State);
                // if (test == false) {
                //     console.log("State");
                //     this.ApisValidation[this.ApisIndex].isState = true;
                //     Toast.makeText(ApisComponent.VALIDSTATE).show();
                // }
                console.log(this.ApisValidation[this.ApisIndex].isState);
                break;
            case 12:
                // if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].PostalCode == "" || this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].PostalCode.length != 5) {
                //     //this.ApisValidation[this.ApisIndex].isPostal = true;
                // }
                // else {
                //     //this.ApisValidation[this.ApisIndex].isPostal = false;
                //     //this.isAPISComplete = false;
                // }
                var reg = new RegExp('[0-9a-zA-Z]+$');
                var test = reg.test(this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].PostalCode);
                if (test == false && this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].PostalCode) {
                    // console.log("Please enter the valid PostalCode");
                    this.ApisValidation[this.ApisIndex].isPostal = true;
                    //Toast.makeText("Please enter the valid PostalCode ").show();
                } else {
                    console.log("valid PostalCode");
                    this.ApisValidation[this.ApisIndex].isPostal = false;
                }
                break;
            case 13:
                var reg = new RegExp('[0-9a-zA-Z]+$');
                var test = reg.test(this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].Address);
                if (test == false) {
                    this.ApisValidation[this.ApisIndex].isAddress = true;
                } else {
                    this.ApisValidation[this.ApisIndex].isAddress = false;
                }
                break;
            case 14:
                if (this.ApisValidation[this.ApisIndex].EmergencyName != args) {
                    //this.isAPISComplete = false;
                    isEdit = true;
                }
                if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].EmergencyDetails[0].EmergencyContactName == "") {
                    this.isEmergencyName = false;
                    isEdit = true;
                    //Toast.makeText(this._configuration.FieldValidationText).show();
                }
                else {
                    this.isEmergencyName = false;
                    var reg = new RegExp('^[a-zA-Z0-9 ]+$');
                    var test = reg.test(this.securityDatas.ApisUpdateRequests[this.ApisIndex].EmergencyDetails[0].EmergencyContactName);
                    if (test == false) {
                        this.isEmergencyName = true;
                        this.isButtonEnabled = false;
                        isEdit = true;
                        //Toast.makeText("Please enter the valid Contact Name ").show();
                    }
                    else {
                        isEdit = true;
                        this.isButtonEnabled = true;
                    }
                    console.log(this.isEmergencyName);
                }
                break;
            case 15:
                if (this.ApisValidation[this.ApisIndex].EmergencyContact != args) {
                    //this.isAPISComplete = false;
                    isEdit = true;
                }
                if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].EmergencyDetails[0].EmergencyPhone.Value == "") {
                    this.isEmergencyContact = false;
                    isEdit = true;
                    //Toast.makeText(this._configuration.FieldValidationText).show();
                }
                else {
                    this.isEmergencyContact = false;
                    var reg = new RegExp('^[0-9 ]+$');
                    var test = reg.test(this.securityDatas.ApisUpdateRequests[this.ApisIndex].EmergencyDetails[0].EmergencyPhone.Value);
                    if (test == false) {
                        this.isEmergencyContact = true;
                        isEdit = true;
                        this.isButtonEnabled = false;
                        //Toast.makeText("Please enter the valid Contact Phone ").show();
                    }
                    else {
                        isEdit = true;
                        this.isButtonEnabled = true;
                    }
                    console.log(this.isEmergencyContact);
                }
                break;
            case 16:
                var reg = new RegExp("^[0-9 ]*$");
                var test = true;
                if (this.ApisValidation[this.ApisIndex].KnownTraveler != args) {
                    //this.isAPISComplete = false;
                    test = reg.test(args);
                    isEdit = true;
                }
                if (this.ApisValidation[this.ApisIndex].KnownTraveler == "") {
                    isEdit = true;
                }
                if (test == false) {
                    this.ApisValidation[this.ApisIndex].isKnownTraveler = true
                    this.ApisValidationHighlight[this.ApisIndex].isKnownTraveler = true
                    this.isButtonEnabled = false;
                    isEdit = true;
                } else {
                    this.ApisValidation[this.ApisIndex].isKnownTraveler = false
                    this.ApisValidationHighlight[this.ApisIndex].isKnownTraveler = false
                    this.isButtonEnabled = true;
                    isEdit = true;
                }
                break;
            case 17:
                console.log("args" + args);
                if (this.ApisValidation[this.ApisIndex].ReDress != args) {
                    //this.isAPISComplete = false;
                    isEdit = true;
                }
                else {
                    isEdit = true;
                }
                if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].RedressNumber != "" || this.securityDatas.ApisUpdateRequests[this.ApisIndex].RedressNumber != null) {
                    var reg = new RegExp('^[0-9 ]+$');
                    var test = reg.test(this.securityDatas.ApisUpdateRequests[this.ApisIndex].RedressNumber);
                    if (test == true) {
                        isEdit = true;
                        this.isButtonEnabled = true;
                    }
                    else {
                        isEdit = true;
                        this.isButtonEnabled = false;
                    }
                }
                break;
            case 18:
                console.log("R:" + args);
                if (this.IsExitDateCheck) {
                    exitDateValue = this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDate;
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDateJustification = args;
                    if (args == "" || args == undefined || args == null) {
                        this.isButtonEnabled = false;
                        isExitDateValidateJustification = true;
                        exitJusitification = "";
                    } else {
                        isExitDateValidateJustification = false;
                        exitJusitification = args;
                    }
                }

                break;
            default:
                break;
        }
        if (this.IsExitDateCheck) {
            isExitDateValidateJustification = true;
            isExitValidateDate = true;
            if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDate == "" || this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDate == undefined) {
                isExitValidateDate = true;
            }
            else {
                isExitValidateDate = false;
            }
            if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDateJustification == "" || this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDateJustification == undefined) {
                isExitDateValidateJustification = true;
            }
            else {
                isExitDateValidateJustification = false;
            }

        }
        if (this.isAddresses) {
            console.log("Address:" + this.ApisValidation[this.ApisIndex].isCity);
            console.log("Address:" + this.ApisValidation[this.ApisIndex].isPostal);
            console.log("Address:" + addressDetails);
            if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].Address && (!this.ApisValidation[this.ApisIndex].isCity && !this.ApisValidation[this.ApisIndex].isPostal && !this.ApisValidation[this.ApisIndex].isState)) {
                addressDetails = false;
            } else {
                addressDetails = true;
            }
        }else{
            addressDetails= false;
        }
        if (array == 0) {
            //if (index != "14" && index != "15" && index != "16" && index != "17") {
            if (!this.ApisValidation[this.ApisIndex].FirstName[array] &&
                !this.ApisValidation[this.ApisIndex].LastName[array] &&
                !this.ApisValidation[this.ApisIndex].DocID[array] &&
                !this.ApisValidation[this.ApisIndex].ExpireDate[array] &&
                !this.ApisValidation[this.ApisIndex].DateOfBirth &&
                this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocIssueCountry != null &&
                this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocHolderNationality != null &&
                this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].CountryOfResidence != "" &&
                this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocIssueCountry != "" &&
                this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocHolderNationality != "" &&
                this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].CountryOfResidence != null &&
                !isExitDateValidateJustification &&
                !isExitValidateDate &&
                !addressDetails
            ) {
                this.isButtonEnabled = true;
                this.isAPISComplete = false;
                this.isScanEnabled = true;
                console.log("test1");
            }
            else {
                this.isButtonEnabled = false;
                console.log("test2");
            }
            if (this._shared.GetScanAPISDocument() != null) {
                this.isButtonEnabled = false;
                //this._shared.SetScanAPISDocument(null);
            }
            //}
        }
        else {
            let apisDocId: boolean = this.ApisValidation[this.ApisIndex].DocID[array] == undefined ? true : this.ApisValidation[this.ApisIndex].DocID[array];
            let apisExpId: boolean = this.ApisValidation[this.ApisIndex].ExpireDate[array] == undefined ? true : this.ApisValidation[this.ApisIndex].ExpireDate[array];
            if (apisDocId &&
                this.ApisValidation[this.ApisIndex].FirstName[array] &&
                this.ApisValidation[this.ApisIndex].LastName[array] &&
                apisExpId &&
                (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocIssueCountry == null ||
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocIssueCountry == "")) {
                if (!this.ApisValidation[this.ApisIndex].FirstName[0] &&
                    !this.ApisValidation[this.ApisIndex].LastName[0] &&
                    !this.ApisValidation[this.ApisIndex].DocID[0] &&
                    !this.ApisValidation[this.ApisIndex].ExpireDate[0] &&
                    !this.ApisValidation[this.ApisIndex].DateOfBirth &&
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocIssueCountry != null &&
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocHolderNationality != null &&
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].CountryOfResidence != "" &&
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocIssueCountry != "" &&
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocHolderNationality != "" &&
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].CountryOfResidence != null
                ) {
                    console.log("Doc2")
                    this.isButtonEnabled = true;
                }
                else {
                    console.log("Doc3")
                    this.isButtonEnabled = false;
                }
            }
            else {
                if (!this.ApisValidation[this.ApisIndex].FirstName[array] &&
                    !this.ApisValidation[this.ApisIndex].LastName[array] &&
                    !this.ApisValidation[this.ApisIndex].DocID[array] &&
                    !this.ApisValidation[this.ApisIndex].ExpireDate[array] &&
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocIssueCountry != null &&
                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocIssueCountry != "") {
                    this.isButtonEnabled = true;
                }
                else {
                    let apisDocId: boolean = this.ApisValidation[this.ApisIndex].DocID[array] == undefined ? true : this.ApisValidation[this.ApisIndex].DocID[array];
                    let apisExpId: boolean = this.ApisValidation[this.ApisIndex].ExpireDate[array] == undefined ? true : this.ApisValidation[this.ApisIndex].ExpireDate[array];
                    if (apisDocId &&
                        this.ApisValidation[this.ApisIndex].FirstName[array] &&
                        this.ApisValidation[this.ApisIndex].LastName[array] &&
                        apisExpId &&
                        (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocIssueCountry == null ||
                            this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[array].DocIssueCountry == "")) {
                        this.isButtonEnabled = true;
                    }
                    else {
                        this.isButtonEnabled = false;
                    }
                }
            }
            if (this._shared.GetScanAPISDocument() != null) {
                this.isButtonEnabled = false;
                console.log(this._shared.GetScanAPISDocument());
                console.log('Doc3')
                //this._shared.SetScanAPISDocument(null);
            }

        }
        let isTData: boolean = this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].IsTrustedData != null ?
            this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].IsTrustedData : false;
        let apisComplete = this._shared.GetPassenger().Passengers[this.ApisIndex].ApisDocoStatus
        let adcComplete = this._shared.GetPassenger().Passengers[this.ApisIndex].AdcDecisionStatus;
        if (apisComplete == "Complete" && (adcComplete == "OK" || adcComplete == "COK" || adcComplete == "BYPASSED"|| adcComplete == "AUTOBYPASSED") && isTData) {
            this.isAPISComplete = true;
            this.isScanEnabled = false;
            if (isEdit) {

                this.isButtonEnabled = true;
                if (index == 15) {
                    var reg = new RegExp('^[0-9 ]+$');
                    if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].EmergencyDetails[0].EmergencyPhone.Value != null && this.securityDatas.ApisUpdateRequests[this.ApisIndex].EmergencyDetails[0].EmergencyPhone.Value != "" && this.securityDatas.ApisUpdateRequests[this.ApisIndex].EmergencyDetails[0].EmergencyPhone.Value != undefined) {
                        var test = reg.test(this.securityDatas.ApisUpdateRequests[this.ApisIndex].EmergencyDetails[0].EmergencyPhone.Value);
                        if (test == false) {
                            this.isEmergencyContact = true;
                            isEdit = true;
                            this.isButtonEnabled = false;
                            //Toast.makeText("Please enter the valid Contact Phone ").show();
                        }
                        else {
                            this.isButtonEnabled = true;
                        }
                    }
                }
                if (index == 14) {
                    var contacts = new RegExp('^[a-zA-Z0-9 ]+$');
                    if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].EmergencyDetails[0].EmergencyContactName != "" && this.securityDatas.ApisUpdateRequests[this.ApisIndex].EmergencyDetails[0].EmergencyContactName != null) {
                        var test = contacts.test(this.securityDatas.ApisUpdateRequests[this.ApisIndex].EmergencyDetails[0].EmergencyContactName);
                        if (test == false) {
                            this.isEmergencyContact = true;
                            isEdit = true;
                            this.isButtonEnabled = false;
                            //Toast.makeText("Please enter the valid Contact Phone ").show();
                        }
                        else {
                            this.isButtonEnabled = true;
                        }
                    }
                }
                if (index == 16) {
                    var known = new RegExp("^[0-9 ]*$");
                    if (this.ApisValidation[this.ApisIndex].KnownTraveler != "" && this.ApisValidation[this.ApisIndex].KnownTraveler != null) {
                        var test = known.test(args);
                        if (test == false) {
                            this.isButtonEnabled = false;
                        } else {
                            this.isButtonEnabled = true;
                        }
                    }
                }
                if (index == 17) {
                    if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].RedressNumber != "" && this.securityDatas.ApisUpdateRequests[this.ApisIndex].RedressNumber != null) {
                        var reg = new RegExp('^[0-9 ]+$');
                        var test = reg.test(this.securityDatas.ApisUpdateRequests[this.ApisIndex].RedressNumber);
                        if (test == true) {
                            this.isButtonEnabled = true;
                        }
                        else {
                            this.isButtonEnabled = false;
                        }
                    }
                }
                this.isAPISComplete = false;
                this.isScanEnabled = true;
            }
        }
        else {
            this.isAPISComplete = false;
            this.isScanEnabled = true;
        }
        if (this._shared.GetScanAPISDocument() != null) {
            this.isButtonEnabled = false;
            this._shared.SetScanAPISDocument(null);
        }
        console.dir(this.ApisValidation[this.ApisIndex]);
        console.dir(this.ApisValidationHighlight[this.ApisIndex]);
        //}
    }

    createModelView(args, arg1) {
        let that = this;
        let index: number = arg1;
        let minDateValue: Date = new Date();
        console.log(this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[index].ExpireDate);
        let currentDate = this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[index].ExpireDate == null ? new Date() : this.securityDatas.ApisUpdateRequests[0].Documents[index].ExpireDate;
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                currentDate: currentDate,
                displayHeader: false,
                minDate: moment(minDateValue),
                maxDate: moment(new Date())
                    .add(100, "year")
                    .toDate()
                    .toDateString()
            },
            fullscreen: false
        };

        this._modalService
            .showModal(DatePickerModal, options)
            .then((dateresult: Date) => {
                if (dateresult) {
                    console.log("date result " + dateresult);
                    if (dateresult.toDateString() == "Invalid Date") {
                        dateresult = new Date();
                    }
                    else if (dateresult < new Date()) {
                        dateresult = new Date();
                    }
                    if (dateresult.toDateString() != 'undefined') {
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[index].ExpireDate = moment(dateresult).format("MM/DD/YYYY") != "01/01/0001" ? moment(dateresult).format("MM/DD/YYYY") : "";
                    }
                    this.ValidateDocuments(-1);
                }
            });
    }

    createModelViewExitDate(args) {
        let that = this;
        //let index: number = arg1;
        let minDateValue: Date = new Date();
        console.log(this.exitDate);
        let currentDate = this.exitDate == null ? new Date() : this.exitDate;
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                currentDate: currentDate,
                displayHeader: false,
                minDate: moment(minDateValue),
                maxDate: moment(new Date())
                    .add(100, "year")
                    .toDate()
                    .toDateString()
            },
            fullscreen: false
        };

        this._modalService
            .showModal(DatePickerModal, options)
            .then((dateresult: Date) => {
                if (dateresult) {
                    console.log("date result " + dateresult);
                    if (dateresult.toDateString() != 'undefined') {
                        this.exitDate = moment(dateresult).format("MM/DD/YYYY") != "01/01/0001" ? moment(dateresult).format("MM/DD/YYYY") : "";
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDate = moment(dateresult).format("MM/DD/YYYY") != "01/01/0001" ? moment(dateresult).format("MM/DD/YYYY") : "";
                    }
                    this.ValidateDocuments(-1);
                }
            });
    }

    DateOfBirthModelView(args) {
        let that = this;
        let currentDate = this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].BirthDate == "" ? new Date() : this.securityDatas.ApisUpdateRequests[0].Documents[0].BirthDate;
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                currentDate: currentDate,
                displayHeader: false,
                minDate: moment(new Date())
                    .subtract(117, "year")
                    .toDate()
                    .toDateString(),
                maxDate: moment(new Date())
            },
            fullscreen: false
        };

        this._modalService
            .showModal(DatePickerModal, options)
            .then((dateresult: Date) => {
                if (dateresult) {
                    console.log("date result " + dateresult);
                    if (dateresult.toDateString() != 'undefined') {
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].BirthDate = moment(dateresult).format("MM/DD/YYYY") != "01/01/0001" ? moment(dateresult).format("MM/DD/YYYY") : "";
                    }
                    this.ValidateDocuments(-1);
                }
            });
    }
    confirmationPopup() {
        dialogs.confirm("Do you want to DELETE?").then(result => {
            console.log("Dialog result: " + result);
            if (result) {
                this.postDelete();
            }
        });
    }
    postDelete(): void {

        this.loaderProgress.showLoader();
        let isValid: boolean = true;
        if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].Firstname.trim() == "") {
            isValid = false;
            //Toast.makeText("Please enter the valid Firstname");
        }
        else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].Surname.trim() == "") {
            isValid = false;
            //Toast.makeText("Please enter the valid Surname");
        }
        else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocHolderGender == null) {
            isValid = false;
            //Toast.makeText("Please select Gender");
        }
        else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].BirthDate == "") {
            isValid = false;
            //Toast.makeText("Please enter the valid BirthDate");
        }
        else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].CountryOfResidence == "") {
            isValid = false;
            //Toast.makeText("Please select Citizenship");
        }
        else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocTypeText == "") {
            isValid = false;
            //Toast.makeText("Please select DocumentType");
        }
        else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocID == "") {
            isValid = false;
            //Toast.makeText("Please enter the valid Document Number");
        }
        else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].ExpireDate == null || this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].ExpireDate == "") {
            isValid = false;
            //Toast.makeText("Please enter the valid Expire date");
        }
        else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocIssueCountry == null) {
            isValid = false;
            //Toast.makeText("Please enter Country of Issue");
        }
        if (!isValid) {
            this.loaderProgress.hideLoader();
        }
        if (isValid) {

            try {
                var sDate = new Date();
                console.log('Add Passenger Service --------------- Start Date Time : ' + sDate);
                let deleteRequestList: Array<any> = [];
                deleteRequestList.length = 0;
                // this.PassengerIndex.forEach(element => {
                    let apisPassenger: any = this._shared.GetSecurityPassengerList();
                    let groupedName: string = apisPassenger.filter(m => m.Firstname == this.securityDatas.ApisUpdateRequests[this.ApisIndex].Firstname && m.Lastname == this.securityDatas.ApisUpdateRequests[this.ApisIndex].Lastname)[0].GroupedGivenName;
                    let grpArray: any = groupedName.split('/');
                    if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].AssociatedInfantRPH != null) {
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].PSS_GivenName = this.securityDatas.ApisUpdateRequests[this.ApisIndex].Firstname + "/" + this._shared.GetPassenger().Passengers.filter(m => m.RPH == this.securityDatas.ApisUpdateRequests[this.ApisIndex].AssociatedInfantRPH)[0].Firstname
                    } else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].AssociatedAdultRPH != null) {
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].PSS_GivenName = this._shared.GetPassenger().Passengers.filter(m => m.RPH == this.securityDatas.ApisUpdateRequests[this.ApisIndex].AssociatedAdultRPH)[0].Firstname + "/" + this.securityDatas.ApisUpdateRequests[this.ApisIndex].Firstname
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].IsAddedInfant = true;
                    }else if(grpArray.length>1){
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].PSS_GivenName = groupedName; 
                    }
                    else {
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].PSS_GivenName = this.securityDatas.ApisUpdateRequests[this.ApisIndex].Firstname;
                    }
                    if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses != null) {
                        if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses.length > 0) {
                            if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].Address != null) {
                                if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses.length > 0) {
                                    console.dir(this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses);
                                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses.forEach((item, index) => {
                                        if (item.Address != "" && item.Address != null) {
                                            if (this.CountryItems.filter(m => m.CountryCode == item.Country)[0] != null) {
                                                this.CountryAddress = this.CountryItems.filter(m => m.CountryCode == item.Country)[0].CountryName;
                                                this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].CountryCode = this.CountryItems.filter(m => m.CountryName == this.CountryAddress)[0].CountryCode;
                                                this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].Country = this.CountryItems.filter(m => m.CountryName == this.CountryAddress)[0].CountryName;
                                            }
                                        }
                                        else {
                                            this.CountryAddress = "Select";
                                        }
                                    })
                                }
                                this.isAddresses = true;
                            }
                        }
                    }

                    if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses.length > 0) {
                        // this.securityDatas.Addresses[0].CountryCode = this.CountryItems.filter(m => m.CountryName == this.CountryAddress)[0].CountryCode;
                        // this.securityDatas.Addresses[0].Country = this.CountryItems.filter(m => m.CountryName == this.CountryAddress)[0].CountryName;
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].Operation = "ADD";
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].AddressRequired = true;
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].AgencyName = this.securityDatas.ApisUpdateRequests[this.ApisIndex].ApisRequirements.length > 1 ? this.securityDatas.ApisUpdateRequests[this.ApisIndex].ApisRequirements.filter(m => m.DocType == this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocType).length > 0 ? this.securityDatas.ApisUpdateRequests[this.ApisIndex].ApisRequirements.filter(m => m.DocType == this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocType)[0].AgencyName : null : null;
                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].DocLevelInd = this.securityDatas.ApisUpdateRequests[this.ApisIndex].ApisRequirements.length > 1 ? this.securityDatas.ApisUpdateRequests[this.ApisIndex].ApisRequirements.filter(m => m.DocType == this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocType).length > 0 ? this.securityDatas.ApisUpdateRequests[this.ApisIndex].ApisRequirements.filter(m => m.DocType == this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocType)[0].DocLevelInd : null : null;
                        if (this.CountryAddress != "Select") {
                            this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].CountryCode = this.CountryItems.filter(m => m.CountryName == this.CountryAddress)[0].CountryCode;
                            this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].Country = this.CountryItems.filter(m => m.CountryName == this.CountryAddress)[0].CountryName;
                        }
                    }

                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents.forEach((element, sIndex) => {
                        if (element.DocID == "" && element.ExpireDate == null) {
                            responseIndex.push(sIndex);
                        }
                    })

                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDate = this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDate
                    deleteRequestList.push(this.securityDatas.ApisUpdateRequests[this.ApisIndex]);
                // })

                let request = this.securityDatas;
                console.log(JSON.stringify(request));
                let responseIndex = [];
                let requestModel = new SecurityModel();
                console.log(this.securityDatas)
                requestModel.ApisUpdateRequests = [new ApisUpdateRequest()]
                requestModel.ApisUpdateRequests.length = 0;
                requestModel.ApisUpdateRequests = deleteRequestList;
                requestModel.ApisUpdateRequests.forEach((ApisUpdate, apisIndex) => {
                    let requestDocument: Document[] = [new Document()];
                    requestDocument.length = 0;
                    ApisUpdate.Documents.forEach((data, index) => {
                        if (data.DocIssueCountry != null && data.DocID != null && data.ExpireDate != null) {
                            let inputDocument = new Document();
                            if (index == 0) {
                                inputDocument.Surname = data.Surname;
                                inputDocument.Firstname = data.Firstname;
                                inputDocument.DocType = data.DocType;
                                inputDocument.DocTypeText = data.DocTypeText;
                                inputDocument.Operation = "DELETE";
                                inputDocument.isPrimary = data.isPrimary;
                                inputDocument.inputType = data.inputType;
                                inputDocument.BirthDate = data.BirthDate;
                                inputDocument.DocHolderGender = data.DocHolderGender;
                                inputDocument.DocID = data.DocID;
                                inputDocument.ExpireDate = data.ExpireDate;
                                inputDocument.IsTrustedData = data.IsTrustedData;
                                inputDocument.CountryOfResidence = data.CountryOfResidence;
                                inputDocument.DocHolderNationality = data.DocHolderNationality;
                                inputDocument.DocIssueCountry = data.DocIssueCountry;
                                inputDocument.DocLevel = this._shared.GetPassenger().Passengers.filter(m=>m.RPH==ApisUpdate.RPH)[0].Documents[0].DocLevel;
                                inputDocument.EffectiveDate = this._shared.GetPassenger().Passengers.filter(m=>m.RPH==ApisUpdate.RPH)[0].Documents[0].EffectiveDate;
                                inputDocument.isPrimaryDoc = data.isPrimary? true:false;
                                inputDocument.isSecondaryDoc = data.isPrimary?false:true;
                            }
                            else {
                                inputDocument.Surname = data.Surname;
                                inputDocument.Firstname = data.Firstname;
                                inputDocument.DocType = data.DocType;
                                inputDocument.DocTypeText = data.DocTypeText;
                                inputDocument.Operation = "DELETE"
                                inputDocument.isPrimary = ApisUpdate.Documents[0].isPrimary;
                                inputDocument.inputType = ApisUpdate.Documents[0].inputType;
                                inputDocument.BirthDate = ApisUpdate.Documents[0].BirthDate;
                                inputDocument.DocHolderGender = ApisUpdate.Documents[0].DocHolderGender;
                                inputDocument.DocID = data.DocID;
                                inputDocument.ExpireDate = data.ExpireDate;
                                inputDocument.IsTrustedData = ApisUpdate.Documents[0].IsTrustedData;
                                inputDocument.CountryOfResidence = ApisUpdate.Documents[0].CountryOfResidence;
                                inputDocument.DocHolderNationality = ApisUpdate.Documents[0].DocHolderNationality;
                                inputDocument.DocIssueCountry = data.DocIssueCountry;
                            }
                            requestDocument.push(inputDocument);
                        }
                    });
                    ApisUpdate.Documents.length = 0;
                    ApisUpdate.Documents = requestDocument;
                    ApisUpdate.ExitDate = (this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDate||this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDate=="")?this._shared.GetPassenger().Passengers.filter(m=>m.RPH==ApisUpdate.RPH)[0].ExitDate:this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDate;
                    ApisUpdate.ExitDateJustification = (this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDateJustification==""||this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDateJustification)?this._shared.GetPassenger().Passengers.filter(m=>m.RPH==ApisUpdate.RPH)[0].ExitDateJustification:this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDateJustification;
                    ApisUpdate.GivenNameReferenceNumber = this._shared.GetPassenger().Passengers.filter(m=>m.RPH==ApisUpdate.RPH)[0].GivenNameRefNumber;
                    ApisUpdate.DateOfBirth = this.securityDatas.ApisUpdateRequests[this.ApisIndex].DateOfBirth;
                    ApisUpdate.Surname = this._shared.GetPassenger().Passengers.filter(m=>m.RPH==ApisUpdate.RPH)[0].Lastname;                })
                
                requestModel.messageLogs = true;
                requestModel.DepartureAirport = this.FlightInfo.Origin;
                requestModel.DepartureDate = this.FlightInfo.DepartureDateTime.toString();
                requestModel.FlightNumber = this.FlightInfo.MarketingFlight.substr(0, 2) == "CM" ? this.FlightInfo.MarketingFlight : (this.FlightInfo.OperatingFlight != null && this.FlightInfo.OperatingFlight.substr(0, 2) == "CM") ? this.FlightInfo.OperatingFlight : this.FlightInfo.MarketingFlight;
                requestModel.BypassADC = this.securityDatas.BypassADC;
                console.log(JSON.stringify(requestModel));
                console.dir(deleteRequestList);
                this._service.AddPassenger(requestModel, this.OrderId)
                    .subscribe(data => {

                        console.log("Response : " + JSON.stringify(data))
                        console.log(this.OrderId);
                        this.ResponseData = <any>data;
                        if (this.ResponseData.ApisStatusList[0].Status == ApisComponent.APISSTATUSINCOMPLETE && this.ResponseData.ApisStatusList[0].Decisions == null) {
                            Toast.makeText("APIS Incomplete").show();
                            this.isAPISComplete = false;
                            this.isScanEnabled = true;
                            this.MultiInitialIndex = 0;
                            if (this.PassengerIndex.length > 1) {
                                if (this.securityDatas.ApisUpdateRequests.length > 1) {
                                    this.ButtonText = "Next"
                                }
                            }
                            this.loaderProgress.hideLoader();
                        }


                        this.PassengerIndex.forEach(passIndex => {
                            this.ResponseData.ApisStatusList.forEach((apis, index) => {
                                if (this._shared.GetPassenger().Passengers[passIndex].RPH == apis.PassengerRPH) {
                                    this._shared.GetPassenger().Passengers[passIndex].ApisDocoStatus = "";
                                    this._shared.GetPassenger().Passengers[passIndex].AdcDecisionStatus = "";
                                    // this._shared.GetPassenger().SegmentTravelerInfos[passIndex].SecurityCode = null;
                                    // this._shared.GetPassenger().SegmentTravelerInfos[passIndex].SecurityCodeDesc = '';
                                    // let emergencyDetails: any;
                                    // this._shared.GetPassenger().Passengers[passIndex].EmergencyDetails.push(emergencyDetails);
                                    if (this.APISPassengerList[passIndex].RPH == apis.PassengerRPH) {
                                        this.APISPassengerList[passIndex].AdcDecisionStatus = "";
                                        this.APISPassengerList[passIndex].ApisDocoStatus = "";
                                        this.APISPassengerList[passIndex].Documents[0].IsTrustedData = true;
                                    }
                                    this.postClear(passIndex);
                                }

                            })
                        })

                        this.loaderProgress.hideLoader();
                        this.isAPISComplete = false;
                        this.isDeleteShown = false;
                        this.isScanEnabled = true;
                        this.isInputEnabled = true;
                        this.APISEnabled = new APISEnabled();
                        this.isCleared = false;
                        console.dir(this._shared.GetPassenger());
                    },
                        err => {
                            console.log(err);
                            var errorMessage = err.toString();
                            if (errorMessage.indexOf("Unrecognized token '<'") != -1) {
                                var options = {
                                    title: "Session Time Out",
                                    message: "Your session has been time out",
                                    okButtonText: "OK"
                                };
                                dialogs.alert(options).then(() => {

                                    this.navigateToLogin();

                                });
                            }
                            this.handleServiceError(err);
                            this.loaderProgress.hideLoader();
                        },
                        () => {
                            console.log("Country" + this.CountryAddress);
                            console.log("Load Success ");
                            //this.loaderProgress.hideLoader();
                        });

            }
            catch (error) {
                console.log(error.message);
                this.loaderProgress.hideLoader();
            }
            finally {
                var eDate = new Date();
                console.log('Add Passenger Service --------------- End Date Time : ' + eDate);
                console.log('Add Passenger Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            }
        }
    }


    postCheckin(): void {
        //this.routerExtensions.backToPreviousPage();
        console.dir(this._shared.GetPassenger());
        this.GetOrderDetails(this.OrderId);
    }

    postClear(apisIndex: number): void {
        console.log("clear");

        this.securityDatas.ApisUpdateRequests[apisIndex].Documents.forEach((element, index) => {
            this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].Firstname = '';
            this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].Surname = '';
            this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].inputType = "Manual";
            this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].BirthDate = "";
            this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].DocHolderGender = "0";
            this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].DocID = "";
            this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].ExpireDate = "";
            this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].IsTrustedData = false;
            this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].CountryOfResidence = "";
            this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].DocHolderNationality = "";
            this.securityDatas.ApisUpdateRequests[apisIndex].Documents[index].DocIssueCountry = "";
            this.trusted = false;
        });
        this.securityDatas.ApisUpdateRequests[apisIndex].Addresses = [new Address()]
        this.securityDatas.ApisUpdateRequests[apisIndex].ExitDate = "";
        this.securityDatas.ApisUpdateRequests[apisIndex].ExitDateJustification = "" ;
        this.ApisValidation[apisIndex].CountryOfIssue.forEach((data, dIndex) => {
            this.ApisValidation[apisIndex].CountryOfIssue[dIndex] = "Select";
            this.ApisValidation[apisIndex].FirstName[dIndex] = true;
            this.ApisValidation[apisIndex].LastName[dIndex] = true;
            this.ApisValidation[apisIndex].DocID[dIndex] = true;
            this.ApisValidation[apisIndex].ExpireDate[dIndex] = true;
        })
        this.ApisValidation[apisIndex].CountryOfResidence = "Select";
        this.ApisValidation[apisIndex].Nationality = "Select";
        this.ApisValidation[apisIndex].DateOfBirth = true;


        this.isInputEnabled = true;
        this.MultiInitialIndex = 0;
        let apisPassenger: any = this._shared.GetPassenger().Passengers;
        let groupedName: string = this._shared.GetPassenger().Passengers.filter(m => m.Firstname == this.securityDatas.ApisUpdateRequests[this.ApisIndex].Firstname && m.Lastname == this.securityDatas.ApisUpdateRequests[this.ApisIndex].Lastname)[0].GroupedGivenName;
        let passengerNames: Array<any> = apisPassenger.filter(m => m.GroupedGivenName == groupedName);
        let groupArray: Array<string> = groupedName.split('/');
        let selectedGroupArray: Array<any> = [];
        let selectedINFGroupArray: Array<any> = [];
        selectedGroupArray.length = 0;
        selectedINFGroupArray.length = 0;
        if (groupedName != "" && groupedName.split('/').length > 1) {
            apisIndex = this.PassengerIndex[0];
            this.PassengerIndex.length = 0;
            //this.PassengerINFIndex.length = 0;
            groupedName.split('/').forEach((element, gIndex) => {
                if (this.securityDatas.ApisUpdateRequests[apisIndex].Firstname == element) {
                    apisPassenger.forEach((pass, i) => {
                        if (pass.Firstname == this.securityDatas.ApisUpdateRequests[apisIndex].Firstname && pass.Lastname == this.securityDatas.ApisUpdateRequests[apisIndex].Lastname) {
                            let isContinue: boolean = false;
                            if (pass.AdcDecisionStatus == "OK" && pass.ApisDocoStatus == "Complete") {
                                isContinue = true;
                            }
                            else if (pass.AdcDecisionStatus == "COK" && pass.ApisDocoStatus == "Complete") {
                                isContinue = true;
                            }
                            else if ((pass.AdcDecisionStatus == "BYPASSED"|| pass.AdcDecisionStatus=="AUTOBYPASSED") && pass.ApisDocoStatus == "Complete") {
                                isContinue = true;
                            }
                            this.PassengerIndex.push(i);
                            //this.PassengerINFIndex.push(i);
                        }
                    });
                }
                else {
                    let groupNameList = passengerNames.filter(m => m.Firstname == element)[0];
                    let groupInitial: any = { 'Firstname': '', 'Lastname': '' };
                    groupInitial.Firstname = groupNameList.Firstname;
                    groupInitial.Lastname = groupNameList.Lastname;
                    //if (!isDone) {
                    apisPassenger.forEach((pass, i) => {
                        if (pass.Firstname == groupInitial.Firstname && pass.Lastname == groupInitial.Lastname) {
                            selectedGroupArray.push(groupInitial);
                            selectedINFGroupArray.push(groupInitial);
                        }
                    });
                    //}
                }

            })
        }

        this._shared.GetPassenger().Passengers.forEach((element, index) => {
            if (groupArray.length > 1) {
                let isContinue: boolean = false;
                if (element.AdcDecisionStatus == "OK" && element.ApisDocoStatus == "Complete") {
                    isContinue = true;
                }
                else if (element.AdcDecisionStatus == "COK" && element.ApisDocoStatus == "Complete") {
                    isContinue = true;
                }
                else if ((element.AdcDecisionStatus == "BYPASSED"||element.AdcDecisionStatus=="AUTOBYPASSED") && element.ApisDocoStatus == "Complete") {
                    isContinue = true;
                }
                if (!isContinue) {
                    if (this.PassengerIndex[0] != index) {
                        if (selectedGroupArray.length > 0) {
                            selectedGroupArray.forEach(groupName => {
                                if (groupName.Firstname == element.Firstname && groupName.Lastname == element.Lastname) {
                                    this.PassengerIndex.push(index);
                                }
                            })
                        }
                    }
                }
            }
        });

        this.ApisIndex = this.PassengerIndex[0];
        if (this.PassengerIndex.length > 1) {
            if (this.securityDatas.ApisUpdateRequests.length > 1) {
                this.ButtonText = "Next"
            }
        }
        console.dir(this.securityDatas.ApisUpdateRequests);
        console.dir(this.ApisValidation);
    }
    APISSelectionLink(apisIndex: any): void {
        this.PassedPassengerDetail = this._shared.GetAPISPassengerList()[apisIndex]
        this.APISSelection.length = 0;
        this.APISPassengerList.forEach((element, passIndex) => {
            if (this.PassedPassengerDetail.FirstName == element.FirstName && this.PassedPassengerDetail.LastName == element.LastName) {
                this.APISSelection.push(true);
            }
            else {
                this.APISSelection.push(false);
            }
        });
    }
    PopupModel(responseData: any, requestModel: any, orderId: string, isPopup: boolean): void {
        if (isPopup) {
            let options: ModalDialogOptions = {
                viewContainerRef: this.vcRef,
                context: [responseData, orderId],
                fullscreen: true
            };
            this._modalService
                .showModal(ADCResponseComponent, options)
                .then(result => {
                    console.log("date result " + result);
                });
        }
        let isResponse: boolean = true;
        let passengerRequest: any;
        let requestData: any;
        this.ResponseData.ApisStatusList.forEach((responseData, resIndex) => {
            if (this.ResponseData.ApisStatusList[resIndex].VisaRequired == true) {
                passengerRequest = requestModel.ApisUpdateRequests[resIndex];
            }
            else if (this.ResponseData.ApisStatusList[resIndex].AllowToAddAddress == true) {
                passengerRequest = requestModel.ApisUpdateRequests[resIndex];
            }
            else {
                if (this.ErrorResponse == 1) {
                    requestData = requestModel.ApisUpdateRequests[resIndex];
                    this.ErrorResponse = -1;
                }
                else if (this.ErrorResponse == 0) {
                    requestData = requestModel.ApisUpdateRequests[resIndex];
                }
            }
        });
        let sendData: any;
        if (passengerRequest == null) {
            sendData = requestData;
        }
        else {
            sendData = passengerRequest;
        }
        console.dir(sendData);
        this.onPassengerSelector(sendData, isResponse);
    }
    BindModel(requestModel: any, responseData: any, orderId: string, isBind: boolean): void {
        if (isBind) {
            this.isAPISComplete = true;
            this.isScanEnabled = false;
            this._shared.GetPassenger().Passengers.forEach((element, index) => {
                // requestModel.ApisUpdateRequests.forEach((request, reqIndex) => {
                if (requestModel.Firstname == element.Firstname && requestModel.Lastname == element.Lastname && element.RPH == requestModel.RPH) {
                    console.log("ppp")
                    console.dir(requestModel);
                    this._shared.GetPassenger().Passengers[index].KnownTravelerNumber = requestModel.KnownTravelerNumber;
                    this._shared.GetPassenger().Passengers[index].RedressNumber = requestModel.RedressNumber;
                    this._shared.GetPassenger().Passengers[index].OldKnownTravelerNumber = requestModel.OldKnownTravelerNumber;
                    this._shared.GetPassenger().Passengers[index].Documents = requestModel.Documents;
                    this._shared.GetPassenger().Passengers[index].Nationality = requestModel.Nationality;
                    this._shared.GetPassenger().Passengers[index].ApisDocoStatus = responseData.Status;
                    this._shared.GetPassenger().Passengers[index].AdcDecisionStatus = responseData.AdcStatus;
                    this._shared.GetPassenger().SegmentTravelerInfos[index].SecurityCode = responseData.SecurityCode;
                    this._shared.GetPassenger().SegmentTravelerInfos[index].SecurityCodeDesc = responseData.SecurityCode != null ? this._shared.GetStartupTable().Tables.SecurityCodeTable.filter(m => m.Key == responseData.SecurityCode)[0].Value.Description : '';
                    this._shared.GetPassenger().Passengers[index].EmergencyDetails = [new EmergencyDetail()];
                    this._shared.GetPassenger().Passengers[index].EmergencyDetails[0].EmergencyPhone = new EmergencyPhone();
                    this._shared.GetPassenger().Passengers[index].EmergencyDetails[0].EmergencyContactName = requestModel.EmergencyDetails[0].EmergencyContactName;
                    this._shared.GetPassenger().Passengers[index].EmergencyDetails[0].EmergencyPhone.Value = requestModel.EmergencyDetails[0].EmergencyPhone.Value;
                    console.log(this.APISPassengerList);
                    if (this.APISPassengerList[index].FirstName == element.Firstname && this.APISPassengerList[index].LastName == element.Lastname) {
                        this.APISPassengerList[index].AdcDecisionStatus = responseData.AdcStatus;
                        this.APISPassengerList[index].ApisDocoStatus = responseData.Status != null ? responseData.Status : "";
                        if (this.APISPassengerList[index].Documents.length > 0) {
                            this.APISPassengerList[index].Documents[0].IsTrustedData = true;
                        }

                        // this.adcCheck = false;
                    }
                    console.dir(this._shared.GetPassenger());
                    console.dir(requestModel.KnownTravelerNumber);
                    this.reloadProcess(requestModel);


                }
                // })

            })
            console.dir(this._shared.GetPassenger());
        }
        this.loaderProgress.hideLoader();
        console.dir(this._shared.GetPassenger());
    }

    postSecurityDoc(): void {

        if (this.ResidenceCheck(this.ArrayIndex)) {
            if (this.PassengerIndex.length > 1) {
                this.MultiInitialIndex++;
                let passengerCount = this.PassengerIndex.length - 1;
                console.log(passengerCount);
                //this.ArrayIndex = this.MultiInitialIndex;
                if (passengerCount == this.MultiInitialIndex) {
                    this.ButtonText = "Submit"
                    this.ArrayIndex = this.PassengerIndex[this.MultiInitialIndex];
                }
                if (this.ButtonText == "Submit" && this.PassengerIndex.length != this.MultiInitialIndex) {
                    let pIndex: number;
                    this.PassengerIndex.forEach((element, index) => {
                        pIndex = index;
                    })
                    this.ApisIndex = this.PassengerIndex[pIndex];
                    this.PassedPassengerDetail = this._shared.GetAPISPassengerList()[this.ApisIndex]
                    this.APISSelectionLink(this.ApisIndex);
                }
                else {
                    if (this.ButtonText == "Submit") {
                        let pIndex: number;
                        this.PassengerIndex.forEach((element, index) => {
                            pIndex = index;
                        })
                        this.ApisIndex = this.PassengerIndex[pIndex];
                        //this.PassedPassengerDetail = this._shared.GetAPISPassengerList()[this.ApisIndex]
                        this.APISSelectionLink(this.ApisIndex);
                    }
                    else {
                        this.ApisIndex = this.PassengerIndex[this.MultiInitialIndex];
                        //this.PassedPassengerDetail = this._shared.GetAPISPassengerList()[this.ApisIndex]
                        this.APISSelectionLink(this.ApisIndex);
                    }
                }
                console.dir(this.PassedPassengerDetail);
                console.log(this.ApisIndex)
                let segBarElm = <SegmentedBar>this.segbar.nativeElement;
                segBarElm.selectedIndex = 0;

            }
            else {
                this.ButtonText = "Submit"
                this.ApisIndex = this.PassengerIndex[this.MultiInitialIndex];
                let segBarElm = <SegmentedBar>this.segbar.nativeElement;
                segBarElm.selectedIndex = 0;
            }
            let isValidate: boolean = false;
            if (this.PassengerIndex.length == 1) {
                isValidate = true;
            }

            let isCondition = false;
            let isAPISSubmit = false;
            this.PassengerFirstName = this.securityDatas.ApisUpdateRequests[this.ApisIndex].Firstname;
            this.PassengerLastName = this.securityDatas.ApisUpdateRequests[this.ApisIndex].Lastname;
            if (this.PassengerIndex.length > 1) {
                if (this.ButtonText == "Submit" && this.PassengerIndex.length == this.MultiInitialIndex) {
                    console.log('Last Render');
                    let pIndex: number;
                    this.PassengerIndex.forEach((element, index) => {
                        pIndex = index;
                    })
                    isAPISSubmit = true;
                    //this.PassedPassengerDetail = this._shared.GetAPISPassengerList()[this.PassengerIndex[pIndex]];
                    this.ApisIndex = this.PassengerIndex[pIndex];
                    this.APISSelectionLink(this.ApisIndex);
                    console.log('Completed the process')
                }
            }
            else {

                this.APISSelectionLink(this.ApisIndex);
            }

            if (this.PassengerIndex.length == 1) {
                console.log('test2');

                isCondition = true;
            }
            else {
                // if (this.PassengerIndex.length == this.MultiInitialIndex) {
                //     isCondition = true;
                // }
                isCondition = isAPISSubmit;
            }
            if (isCondition) {
                this.loaderProgress.showLoader();
                let isValid: boolean = true;
                //this.securityDatas.BypassADC = null;
                this.securityDatas.OrderUpdateRequests = null;
                if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].Firstname.trim() == "") {
                    isValid = false;
                    Toast.makeText("Please enter the valid Firstname");
                }
                else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].Surname.trim() == "") {
                    isValid = false;
                    Toast.makeText("Please enter the valid Surname");
                }
                else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocHolderGender == null) {
                    isValid = false;
                    Toast.makeText("Please select Gender");
                }
                else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].BirthDate == "") {
                    isValid = false;
                    Toast.makeText("Please enter the valid BirthDate");
                }
                else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].CountryOfResidence == "") {
                    isValid = false;
                    Toast.makeText("Please select Citizenship");
                }
                else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocTypeText == "") {
                    isValid = false;
                    Toast.makeText("Please select DocumentType");
                }
                else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocID == "") {
                    isValid = false;
                    Toast.makeText(ApisComponent.VALIDDOCUMENTNUMBER);
                }
                else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].ExpireDate == null || this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].ExpireDate == "") {
                    isValid = false;
                    Toast.makeText("Please enter the valid Expire date");
                }
                else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocIssueCountry == null) {
                    isValid = false;
                    Toast.makeText("Please enter Country of Issue");
                } else if (moment(this.exitDate).format("MM/DD/YYYY") < moment(new Date()).format("MM/DD/YYYY")) {
                    console.log(this.exitDate + moment(new Date()).format("MM/DD/YYYY"));
                    isValid = false;
                    Toast.makeText("Passed Date not allowed").show();
                    this.isExitDate = true;
                } else if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses != null && this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses.length > 0) {
                    if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses[0].Address != null) {
                        //this.isPostal = false;
                        // Toast.makeText("Invalid Postal Code").show();
                        isValid = true;
                    } else {
                        //this.isPostal = false;
                    }

                }
                if (!isValid) {
                    console.log("valid")
                    this.loaderProgress.hideLoader();
                }
                if (isValid) {

                    try {
                        var sDate = new Date();
                        console.log('Add Passenger Service --------------- Start Date Time : ' + sDate);

                        let request = this.securityDatas;
                        console.dir(this._shared.GetSecurityPassengerList());

                        let responseIndex = [];
                        let apisPassenger: any = this._shared.GetSecurityPassengerList();
                        this.securityDatas.ApisUpdateRequests.forEach((ApisUpdate, index) => {
                            let groupedName: string = apisPassenger.filter(m => m.Firstname == ApisUpdate.Firstname && m.Lastname == ApisUpdate.Lastname)[0].GroupedGivenName;
                            let grpArray: any = groupedName.split('/');
                            if (ApisUpdate.AssociatedInfantRPH != null) {
                                ApisUpdate.PSS_GivenName = ApisUpdate.Firstname + "/" + this._shared.GetPassenger().Passengers.filter(m => m.RPH == ApisUpdate.AssociatedInfantRPH)[0].Firstname
                            } else if (ApisUpdate.AssociatedAdultRPH != null) {
                                ApisUpdate.PSS_GivenName = this._shared.GetPassenger().Passengers.filter(m => m.RPH == ApisUpdate.AssociatedAdultRPH)[0].Firstname + "/" + ApisUpdate.Firstname
                                ApisUpdate.IsAddedInfant = true;
                            }
                            else if (grpArray.length > 1) {
                                ApisUpdate.PSS_GivenName = groupedName;
                            } else {
                                ApisUpdate.PSS_GivenName = "";
                            }
                            if (ApisUpdate.Addresses != null) {
                                if (ApisUpdate.Addresses.length > 0) {
                                    if (ApisUpdate.Addresses[0].Address != null) {
                                        if (ApisUpdate.Addresses.length > 0) {
                                            console.dir(ApisUpdate.Addresses);
                                            ApisUpdate.Addresses.forEach((item, index) => {
                                                if (item.Address != "" && item.Address != null) {
                                                    if (this.CountryItems.filter(m => m.CountryCode == item.Country)[0] != null) {
                                                        this.CountryAddress = this.CountryItems.filter(m => m.CountryCode == item.Country)[0].CountryName;
                                                        ApisUpdate.Addresses[0].CountryCode = this.CountryItems.filter(m => m.CountryName == this.CountryAddress)[0].CountryCode;
                                                        ApisUpdate.Addresses[0].Country = this.CountryItems.filter(m => m.CountryName == this.CountryAddress)[0].CountryName;
                                                    }
                                                    // this.isAddresses = true;

                                                }
                                                else {
                                                    this.CountryAddress = "Select";
                                                }
                                            })
                                        }
                                        /***this.isAddresses = true; */


                                        //this.tabListWithDistination();
                                        //let segBarElm = <SegmentedBar>this.segbar.nativeElement;
                                        //segBarElm.selectedIndex = 2;
                                        // this.selectSegment(1);
                                    }
                                }
                            }

                            if (ApisUpdate.Addresses.length > 0) {
                                // this.securityDatas.Addresses[0].CountryCode = this.CountryItems.filter(m => m.CountryName == this.CountryAddress)[0].CountryCode;
                                // this.securityDatas.Addresses[0].Country = this.CountryItems.filter(m => m.CountryName == this.CountryAddress)[0].CountryName;
                                ApisUpdate.Addresses[0].Operation = "ADD";
                                ApisUpdate.Addresses[0].AddressRequired = true;
                                ApisUpdate.Addresses[0].AgencyName = ApisUpdate.ApisRequirements.length > 1 ? ApisUpdate.ApisRequirements.filter(m => m.DocType == ApisUpdate.Documents[0].DocType).length > 0 ? ApisUpdate.ApisRequirements.filter(m => m.DocType == ApisUpdate.Documents[0].DocType)[0].AgencyName : null : null;
                                ApisUpdate.Addresses[0].DocLevelInd = ApisUpdate.ApisRequirements.length > 1 ? ApisUpdate.ApisRequirements.filter(m => m.DocType == ApisUpdate.Documents[0].DocType).length > 0 ? ApisUpdate.ApisRequirements.filter(m => m.DocType == ApisUpdate.Documents[0].DocType)[0].DocLevelInd : null : null;
                                if (this.CountryAddress != "Select") {
                                    ApisUpdate.Addresses[0].CountryCode = this.CountryItems.filter(m => m.CountryName == this.CountryAddress)[0].CountryCode;
                                    ApisUpdate.Addresses[0].Country = this.CountryItems.filter(m => m.CountryName == this.CountryAddress)[0].CountryName;
                                }
                            }

                            ApisUpdate.Documents.forEach((element, sIndex) => {
                                if (element.DocID == "" && element.ExpireDate == null) {
                                    responseIndex.push(sIndex);
                                }
                            })

                        })

                        let requestModel = new SecurityModel();
                        requestModel.ApisUpdateRequests = [new ApisUpdateRequest()]
                        requestModel.ApisUpdateRequests.length = 0;
                        if (this.PassengerINFIndex.length > 1) {
                            let passengerList: any;
                            let isINF: boolean = false;
                            this.PassengerINFIndex.forEach((item, index) => {
                                if (index == 0) {
                                    if (this.securityDatas.ApisUpdateRequests[item].PassengerTypeCode == "INF") {
                                        let adultRPH = this.securityDatas.ApisUpdateRequests[item].AssociatedAdultRPH;
                                        let infantRPH = this.securityDatas.ApisUpdateRequests[item].AssociatedInfantRPH;
                                        passengerList = this.securityDatas.ApisUpdateRequests.filter(m => m.RPH == adultRPH)[0];
                                        requestModel.ApisUpdateRequests.push(passengerList);
                                        isINF = true;
                                    }
                                    else {
                                        // let givenName = this.securityDatas.ApisUpdateRequests[item].PSS_GivenName.split('/')[index];
                                        // let apisUpdateData = this.securityDatas.ApisUpdateRequests.filter(m=>m.GivenName == givenName)[0];
                                        requestModel.ApisUpdateRequests.push(this.securityDatas.ApisUpdateRequests[item]);
                                    }

                                }
                                else {
                                    let infantRPH = this.securityDatas.ApisUpdateRequests[item].AssociatedInfantRPH;


                                    if (infantRPH != null) {
                                        if (isINF) {
                                            let adultName = this.securityDatas.ApisUpdateRequests.filter(m => m.PassengerTypeCode == "INF")[0].PSS_GivenName.split("/")[0];
                                            let passName = this.securityDatas.ApisUpdateRequests[item].Firstname;
                                            if (adultName == passName) {
                                                passengerList = this.securityDatas.ApisUpdateRequests.filter(m => m.RPH == infantRPH)[0];
                                                requestModel.ApisUpdateRequests.push(passengerList);
                                            }
                                            else {
                                                requestModel.ApisUpdateRequests.push(this.securityDatas.ApisUpdateRequests[item]);
                                            }

                                        }
                                        else {
                                            requestModel.ApisUpdateRequests.push(this.securityDatas.ApisUpdateRequests[item]);
                                        }

                                    }
                                    else {
                                        // let givenName = this.securityDatas.ApisUpdateRequests[item].PSS_GivenName.split('/')[index];
                                        // let apisUpdateData = this.securityDatas.ApisUpdateRequests.filter(m=>m.GivenName == givenName)[0];
                                        // requestModel.ApisUpdateRequests.push(apisUpdateData);
                                        requestModel.ApisUpdateRequests.push(this.securityDatas.ApisUpdateRequests[item]);
                                    }
                                }
                            })

                        }
                        else {
                            requestModel.ApisUpdateRequests.push(this.securityDatas.ApisUpdateRequests[this.ApisIndex]);
                        }
                        let rowindex = 0;
                        console.log(requestModel.ApisUpdateRequests)
                        requestModel.ApisUpdateRequests.forEach((element, index) => {
                            //requestModel.ApisUpdateRequests[index].AssociatedAdultRPH = this._shared.GetAPISPassengerList().filter(m => m.RPH == element.RPH)[0].AssociatedAdultRPH;
                            //requestModel.ApisUpdateRequests[index].AssociatedInfantRPH = this._shared.GetAPISPassengerList().filter(m => m.RPH == element.RPH)[0].AssociatedInfantRPH;
                        });

                        requestModel.ApisUpdateRequests.forEach((ApisUpdate, apisIndex) => {
                            let requestDocument: Document[] = [new Document()];
                            requestDocument.length = 0;
                            requestModel.ApisUpdateRequests[apisIndex].Documents.forEach((data, index) => {
                                if (data.DocIssueCountry != null && data.DocID != null && data.ExpireDate != null) {
                                    let inputDocument = new Document();
                                    if (index == 0) {
                                        inputDocument.Surname = data.Surname;
                                        inputDocument.Firstname = data.Firstname;
                                        inputDocument.DocType = data.DocType;
                                        inputDocument.DocTypeText = data.DocTypeText;
                                        inputDocument.Operation = "ADD";
                                        inputDocument.isPrimary = data.isPrimary;
                                        inputDocument.inputType = data.inputType;
                                        if (data.inputType != "Manual") {
                                            console.log(data.OCRString);
                                            inputDocument.OCRString = data.OCRString.replace("\n", "");
                                        }
                                        inputDocument.BirthDate = data.BirthDate;
                                        requestModel.ApisUpdateRequests[apisIndex].DateOfBirth = data.BirthDate;
                                        console.log(requestModel.ApisUpdateRequests[apisIndex].DateOfBirth);
                                        requestModel.ApisUpdateRequests[apisIndex].Nationality = data.DocHolderNationality;
                                        inputDocument.DocHolderGender = data.DocHolderGender;
                                        inputDocument.DocID = data.DocID;
                                        inputDocument.ExpireDate = data.ExpireDate;
                                        inputDocument.IsTrustedData = !data.IsTrustedData ? true : data.IsTrustedData;
                                        if (this.verified) {
                                            inputDocument.IsVerifiedData = this.verified
                                        }
                                        inputDocument.CountryOfResidence = data.CountryOfResidence;
                                        inputDocument.DocHolderNationality = data.DocHolderNationality;
                                        inputDocument.DocIssueCountry = data.DocIssueCountry;
                                        requestDocument.push(inputDocument);
                                    }
                                    else {
                                        if (data.DocID != '' && data.DocID != null &&
                                            data.Surname != '' && data.Firstname != '' &&
                                            data.DocIssueCountry != '' && data.DocIssueCountry != null &&
                                            data.ExpireDate != '' && data.ExpireDate != null
                                        ) {
                                            inputDocument.Surname = data.Surname;
                                            inputDocument.Firstname = data.Firstname;
                                            inputDocument.DocType = data.DocType;
                                            inputDocument.DocTypeText = data.DocTypeText;
                                            // inputDocument.Operation = requestModel.ApisUpdateRequests[rowindex].Documents[0].Operation;
                                            inputDocument.Operation = "ADD";
                                            inputDocument.isPrimary = ApisUpdate.Documents[0].isPrimary;
                                            // inputDocument.inputType = ApisUpdate.Documents[0].inputType;
                                            inputDocument.inputType = "Manual"
                                            inputDocument.BirthDate = ApisUpdate.Documents[0].BirthDate;
                                            inputDocument.DocHolderGender = ApisUpdate.Documents[0].DocHolderGender;
                                            inputDocument.DocID = data.DocID;
                                            inputDocument.ExpireDate = data.ExpireDate;
                                            inputDocument.IsTrustedData = requestDocument[0].IsTrustedData;
                                            if (this.verified) {
                                                inputDocument.IsVerifiedData = this.verified
                                            }
                                            inputDocument.CountryOfResidence = ApisUpdate.Documents[0].CountryOfResidence;
                                            inputDocument.DocHolderNationality = ApisUpdate.Documents[0].DocHolderNationality;
                                            inputDocument.DocIssueCountry = data.DocIssueCountry;
                                            requestDocument.push(inputDocument);
                                        }

                                    }

                                }
                            });
                            requestModel.ApisUpdateRequests[apisIndex].Documents.length = 0;
                            requestModel.ApisUpdateRequests[apisIndex].Documents = requestDocument;
                            requestModel.ApisUpdateRequests[apisIndex].OldKnownTravelerNumber = this.securityDatas.ApisUpdateRequests[0].OldKnownTravelerNumber;
                            requestModel.ApisUpdateRequests[apisIndex].OldRedressNumber = this.securityDatas.ApisUpdateRequests[0].OldRedressNumber;
                            if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDateJustification == "") {
                                requestModel.ApisUpdateRequests[apisIndex].ExitDateJustification = undefined;
                            }
                            else {
                                requestModel.ApisUpdateRequests[apisIndex].ExitDateJustification = this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDateJustification;
                            }
                            if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDate != "") {
                                requestModel.ApisUpdateRequests[apisIndex].ExitDate = this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDate == "" ? null : this.securityDatas.ApisUpdateRequests[this.ApisIndex].ExitDate;
                            }
                            else {
                                requestModel.ApisUpdateRequests[apisIndex].ExitDate = undefined;
                            }
                            if (requestModel.ApisUpdateRequests[apisIndex].ApisAddressRequirements == null || requestModel.ApisUpdateRequests[apisIndex].ApisAddressRequirements.length == 0) {
                                requestModel.ApisUpdateRequests[apisIndex].ApisAddressRequirements = null;
                            }
                        })
                        requestModel.messageLogs = true;
                        requestModel.DepartureAirport = this.FlightInfo.Origin;
                        requestModel.DepartureDate = this.FlightInfo.DepartureDateTime.toString();
                        requestModel.FlightNumber = this.FlightInfo.MarketingFlight.substr(0, 2) == "CM" ? this.FlightInfo.MarketingFlight : (this.FlightInfo.OperatingFlight != null && this.FlightInfo.OperatingFlight.substr(0, 2) == "CM") ? this.FlightInfo.OperatingFlight : this.FlightInfo.MarketingFlight;
                        if (this.adcCheck) {
                            requestModel.BypassADC = this.securityDatas.BypassADC;
                        }
                        else {
                            requestModel.BypassADC = null;
                        }
                        requestModel.OrderUpdateRequests = this.securityDatas.OrderUpdateRequests;
                        console.log(JSON.stringify(requestModel));
                        console.dir(this.securityDatas.ApisUpdateRequests);
                        console.dir(requestModel);
                        let isPassengerAddress: boolean = false;
                        let isSecondary: boolean = false;
                        let secondaryIndex: any;
                        let passengerDocument: any;
                        let fName: string = '';
                        let lName: string = '';
                        let rph: string = '';
                        this._service.AddPassenger(requestModel, this.OrderId)
                            .subscribe(data => {
                                console.log("Response : " + JSON.stringify(data))
                                console.log(this.OrderId);
                                this.ResponseData = <any>data;
                                let isPopup: boolean = false;
                                let isBind: boolean = false;
                                if (this.ResponseData.ApisStatusList.length > 0) {
                                    this.ErrorResponse = 0;
                                    this.ResponseData.ApisStatusList.forEach((responseData, resIndex) => {

                                        if (this.ResponseData.ApisStatusList[resIndex].Status == ApisComponent.APISCOMPLETE) {
                                            this.isAPISEnabled(true, true, resIndex);
                                        }
                                        if (this.ResponseData.ApisStatusList != null && this.ResponseData.ApisStatusList.length > 0) {
                                            this.loaderProgress.hideLoader();
                                            if (this.ResponseData.Errors == null) {
                                                if (this.ResponseData.Warnings != null) {
                                                    this.loaderProgress.hideLoader();
                                                }
                                                if (this.ResponseData.ApisStatusList[resIndex].VisaRequired == true) {
                                                    this.isInputEnabled = true;
                                                    this.ApisIndex = this.PassengerIndex[resIndex];
                                                    this.MultiInitialIndex = 0;
                                                    if (this.PassengerIndex.length > 1) {
                                                        if (this.securityDatas.ApisUpdateRequests.length > 1) {
                                                            this.ButtonText = "Next"
                                                        }
                                                    }
                                                    console.log("check" + this._shared.GetAdditionalDocuments())
                                                    // this._shared.GetAdditionalDocuments().forEach((element, index) => {
                                                    //     if (this.DocumentType.filter(m => m == element.Text).length == 0) {
                                                    //         this.DocumentType.push(element.Text);
                                                    //         let docList: DocumentType = new DocumentType();
                                                    //         docList.DocType = element.Value;
                                                    //         docList.DocTypeText = element.Text;
                                                    //         this.DocumentTypeList.push(docList);
                                                    //     }
                                                    // } );
                                                    //this.APISSelectionLink(this.ApisIndex);
                                                    isSecondary = true;
                                                    secondaryIndex = this.ApisIndex;
                                                    // if(requestModel.ApisUpdateRequests[resIndex].Documents.length == 1)
                                                    // {
                                                    //     this.add();
                                                    // }
                                                    this.isVisaRequired = true;
                                                    this.isButtonEnabled = false;
                                                }
                                                if (this.ResponseData.ApisStatusList[resIndex].Status == ApisComponent.APISSTATUSINCOMPLETE || this.ResponseData.ApisStatusList[resIndex].Status == null) {
                                                    //this.tabListWithoutDistination();
                                                    if (this.ResponseData.ApisStatusList[resIndex].AllowToAddAddress == true) {
                                                        this.isInputEnabled = true;
                                                        this.isButtonEnabled = false;
                                                        this.isAddresses = true;
                                                        this.tabListWithDistination();
                                                        this.ApisIndex = this.PassengerIndex[resIndex];
                                                        this.MultiInitialIndex = 0;
                                                        if (this.PassengerIndex.length > 1) {
                                                            if (this.securityDatas.ApisUpdateRequests.length > 1) {
                                                                this.ButtonText = "Next"
                                                            }
                                                        }
                                                        if (this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses.length == 0) {
                                                            this.securityDatas.ApisUpdateRequests[this.ApisIndex].Addresses = [new Address()];
                                                            this.loaderProgress.hideLoader();
                                                        }
                                                        let segBarElm = <SegmentedBar>this.segbar.nativeElement;
                                                        segBarElm.selectedIndex = 2;
                                                        //this.APISSelectionLink(this.ApisIndex);
                                                        isPassengerAddress = true;
                                                    }
                                                    if (this.ResponseData.ApisStatusList[resIndex].ResidentCardRequired == true) {
                                                        this.ApisIndex = this.PassengerIndex[resIndex];
                                                        this.MultiInitialIndex = 0;
                                                        if (this.PassengerIndex.length > 1) {
                                                            if (this.securityDatas.ApisUpdateRequests.length > 1) {
                                                                this.ButtonText = "Next"
                                                            }
                                                        }
                                                        if (this.securityDatas.ApisUpdateRequests[resIndex].Documents.filter(m => m.DocType == "14").length < 1) {
                                                            Toast.makeText("Please Add the Permanent ResidentCard Information").show();
                                                            this.loaderProgress.hideLoader();
                                                        }
                                                        let segBarElm = <SegmentedBar>this.segbar.nativeElement;
                                                        segBarElm.selectedIndex = 1;
                                                        this.APISSelectionLink(this.ApisIndex);
                                                    }
                                                    if (this.ResponseData.ApisStatusList.filter(m => m.VisaRequired == true).length > 0) {
                                                        this.ApisIndex = this.PassengerIndex[resIndex];
                                                        this.MultiInitialIndex = 0;
                                                        if (this.PassengerIndex.length > 1) {
                                                            if (this.securityDatas.ApisUpdateRequests.length > 1) {
                                                                this.ButtonText = "Next"
                                                            }
                                                        }
                                                        let segBarElm = <SegmentedBar>this.segbar.nativeElement;
                                                        segBarElm.selectedIndex = 1;
                                                        Toast.makeText("Visa Required").show();
                                                        this.APISSelectionLink(this.ApisIndex);
                                                        this.loaderProgress.hideLoader();
                                                    }

                                                }
                                                if (this.ResponseData.ApisStatusList[resIndex].Status == ApisComponent.APISCOMPLETE) {
                                                    console.log('test1');
                                                    let segBarElm = <SegmentedBar>this.segbar.nativeElement;
                                                    segBarElm.selectedIndex = 0;
                                                    fName = this.ResponseData.ApisStatusList[resIndex].FirstName;
                                                    lName = this.ResponseData.ApisStatusList[resIndex].LastName;
                                                    rph = this.ResponseData.ApisStatusList[resIndex].PassengerRPH;
                                                    if (this.ResponseData.ApisStatusList[resIndex].Status == ApisComponent.APISCOMPLETE && this.ResponseData.ApisStatusList[resIndex].Decisions != null) {
                                                        if (this.ResponseData.ApisStatusList[resIndex].AdcStatus == "OK" && this.ResponseData.ApisStatusList[resIndex].Status == ApisComponent.APISCOMPLETE) {
                                                            Toast.makeText("ADC OK;APIS Complete").show();
                                                            this._shared.SetAPISDocument(null);
                                                            this.isAddresses = false;
                                                            this.IsExitDateCheck = false;
                                                            if (this.ResponseData.ApisStatusList[resIndex].Decisions.filter(m => m.DecisionMessage != "").length > 0 || this.ResponseData.ApisStatusList[resIndex].AdcStatus == "COK") {
                                                                isPopup = true;
                                                                isBind = true;
                                                                this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                                this.tabListWithDistination();
                                                            } else {
                                                                //this.GetOrderDetails(this.OrderId);
                                                                isPopup = false;
                                                                isBind = true;
                                                                this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                                this.tabListWithDistination();
                                                            }

                                                            this._shared.SetAdultSecurityData(null);
                                                        }
                                                        else if (this.ResponseData.ApisStatusList[resIndex].AdcStatus == "COK" && this.ResponseData.ApisStatusList[resIndex].Status == ApisComponent.APISCOMPLETE) {

                                                            Toast.makeText("ADC COK;APIS Complete").show();
                                                            this._shared.SetAPISDocument(null);
                                                            this.isAddresses = false;
                                                            this.IsExitDateCheck = false;
                                                            if (this.ResponseData.ApisStatusList[resIndex].Decisions.filter(m => m.DecisionMessage != "").length > 0 || this.ResponseData.ApisStatusList[resIndex].AdcStatus == "COK") {
                                                                isPopup = true;
                                                                isBind = true;
                                                                this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                                this.tabListWithDistination();
                                                            } else {
                                                                isPopup = false;
                                                                isBind = true;
                                                                this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                                this.tabListWithDistination();
                                                            }



                                                        } else if (this.ResponseData.ApisStatusList[resIndex].AdcStatus == "BYPASSED" && this.ResponseData.ApisStatusList[resIndex].Status == ApisComponent.APISCOMPLETE) {
                                                            Toast.makeText("ADC BYPASSED;APIS Complete").show();
                                                            this._shared.SetAPISDocument(null);
                                                            this.isAddresses = false;
                                                            this.IsExitDateCheck = false;
                                                            if (this.ResponseData.ApisStatusList[resIndex].Decisions.filter(m => m.DecisionMessage != "").length > 0 || this.ResponseData.ApisStatusList[resIndex].AdcStatus == "BYPASSED") {
                                                                isPopup = true;
                                                                isBind = true;
                                                                this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                                this.tabListWithDistination();
                                                            } else {
                                                                isPopup = false;
                                                                isBind = true;
                                                                this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                                this.tabListWithDistination();
                                                            }
                                                        }else if (this.ResponseData.ApisStatusList[resIndex].AdcStatus == "AUTOBYPASSED" && this.ResponseData.ApisStatusList[resIndex].Status == ApisComponent.APISCOMPLETE) {
                                                            Toast.makeText("ADC AUTOBYPASSED;APIS Complete").show();
                                                            this._shared.SetAPISDocument(null);
                                                            this.isAddresses = false;
                                                            this.IsExitDateCheck = false;
                                                            if (this.ResponseData.ApisStatusList[resIndex].Decisions.filter(m => m.DecisionMessage != "").length > 0 || this.ResponseData.ApisStatusList[resIndex].AdcStatus == "AUTOBYPASSED") {
                                                                isPopup = true;
                                                                isBind = true;
                                                                this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                                this.tabListWithDistination();
                                                            } else {
                                                                isPopup = false;
                                                                isBind = true;
                                                                this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                                this.tabListWithDistination();
                                                            }
                                                         } else if (this.ResponseData.ApisStatusList[resIndex].Status == ApisComponent.APISCOMPLETE) {

                                                            Toast.makeText("APIS Complete").show();
                                                            this._shared.SetAPISDocument(null);
                                                            if (this.ResponseData.ApisStatusList[resIndex].Decisions.filter(m => m.DecisionMessage != "").length > 0 || this.ResponseData.ApisStatusList[resIndex].AdcStatus == "COK") {
                                                                isPopup = true;
                                                                isBind = true;
                                                                this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                                this.tabListWithDistination();
                                                            } else {
                                                                isPopup = false;
                                                                isBind = true;
                                                                this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                                this.tabListWithDistination();
                                                                // this.navigateToCheckin(this.OrderId);
                                                            }
                                                            this._shared.SetAdultSecurityData(null);


                                                        }
                                                    }
                                                    else {
                                                        if (this.ResponseData.ApisStatusList[resIndex].Status == ApisComponent.APISCOMPLETE) {
                                                            if (this.ResponseData.ApisStatusList[resIndex].AdcStatus == "BYPASSED" && this.ResponseData.ApisStatusList[resIndex].Status == ApisComponent.APISCOMPLETE) {
                                                                this.loaderProgress.hideLoader();
                                                                Toast.makeText("ADC BYPASSED;APIS Complete").show();
                                                                this.isAddresses = false;
                                                                this.IsExitDateCheck = false;
                                                                this._shared.SetAPISDocument(null);
                                                                if ((this.ResponseData.ApisStatusList[resIndex].Decisions != null && this.ResponseData.ApisStatusList[resIndex].Decisions.filter(m => m.DecisionMessage != "").length > 0) || this.ResponseData.ApisStatusList[resIndex].AdcStatus == "COK") {
                                                                    isPopup = true;
                                                                    isBind = true;
                                                                    this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                                    this.tabListWithDistination();

                                                                } else {
                                                                    //this.GetOrderDetails(this.OrderId);
                                                                    console.log('test');

                                                                    isPopup = false;
                                                                    isBind = true;
                                                                    this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                                    this.tabListWithDistination();
                                                                    this.loaderProgress.hideLoader();
                                                                    // this.navigateToCheckin(this.OrderId);
                                                                }
                                                            }else if (this.ResponseData.ApisStatusList[resIndex].AdcStatus == "AUTOBYPASSED" && this.ResponseData.ApisStatusList[resIndex].Status == ApisComponent.APISCOMPLETE) {
                                                                this.loaderProgress.hideLoader();
                                                                Toast.makeText("ADC AUTOBYPASSED;APIS Complete").show();
                                                                this.isAddresses = false;
                                                                this.IsExitDateCheck = false;
                                                                this._shared.SetAPISDocument(null);
                                                                if ((this.ResponseData.ApisStatusList[resIndex].Decisions != null && this.ResponseData.ApisStatusList[resIndex].Decisions.filter(m => m.DecisionMessage != "").length > 0) || this.ResponseData.ApisStatusList[resIndex].AdcStatus == "COK") {
                                                                    isPopup = true;
                                                                    isBind = true;
                                                                    this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                                    this.tabListWithDistination();

                                                                } else {
                                                                    //this.GetOrderDetails(this.OrderId);
                                                                    console.log('test');

                                                                    isPopup = false;
                                                                    isBind = true;
                                                                    this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                                    this.tabListWithDistination();
                                                                    this.loaderProgress.hideLoader();
                                                                    // this.navigateToCheckin(this.OrderId);
                                                                }
                                                            } else {
                                                                this.loaderProgress.hideLoader();
                                                                Toast.makeText("APIS Complete").show();
                                                                this.isAddresses = false;
                                                                this.IsExitDateCheck = false;
                                                                this._shared.SetAPISDocument(null);
                                                                if ((this.ResponseData.ApisStatusList[resIndex].Decisions != null && this.ResponseData.ApisStatusList[resIndex].Decisions.filter(m => m.DecisionMessage != "").length > 0) || this.ResponseData.ApisStatusList[resIndex].AdcStatus == "COK") {
                                                                    isPopup = true;
                                                                    isBind = true;
                                                                    this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                                    this.tabListWithDistination();

                                                                } else {
                                                                    //this.GetOrderDetails(this.OrderId);
                                                                    console.log('test');

                                                                    isPopup = false;
                                                                    isBind = true;
                                                                    this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                                    this.tabListWithDistination();
                                                                    this.loaderProgress.hideLoader();
                                                                    // this.navigateToCheckin(this.OrderId);
                                                                }
                                                            }


                                                        }
                                                        this._shared.SetAdultSecurityData(null);
                                                    }

                                                }
                                                else {
                                                    if (this.ResponseData.ApisStatusList[resIndex].Status != null && this.ResponseData.ApisStatusList[resIndex].Decisions != null) {
                                                        Toast.makeText("ADC:" + this.ResponseData.ApisStatusList[resIndex].AdcStatus + " " + "APIS:" + this.ResponseData.ApisStatusList[resIndex].Status).show();
                                                        this.ApisIndex = this.PassengerIndex[resIndex];
                                                        this.MultiInitialIndex = 0;
                                                    }
                                                    this.loaderProgress.hideLoader();

                                                }
                                                if (((this.ResponseData.ApisStatusList[resIndex].Decisions != null && this.ResponseData.ApisStatusList[resIndex].Decisions.filter(m => m.DecisionMessage != "").length > 0) || this.ResponseData.ApisStatusList[resIndex].AdcStatus == "COK") && this.ResponseData.ApisStatusList[resIndex].Status != ApisComponent.APISCOMPLETE) {
                                                    fName = this.ResponseData.ApisStatusList[resIndex].FirstName;
                                                    lName = this.ResponseData.ApisStatusList[resIndex].LastName;
                                                    rph = this.ResponseData.ApisStatusList[resIndex].PassengerRPH;
                                                    this.MultiInitialIndex = 0;
                                                    if (this.PassengerIndex.length > 1) {
                                                        if (this.securityDatas.ApisUpdateRequests.length > 1) {
                                                            this.ButtonText = "Next"
                                                            this.ErrorResponse++;
                                                        }
                                                    }

                                                    isPopup = true;
                                                    isBind = true;
                                                    this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                    this.tabListWithDistination();

                                                }

                                                if (this.ResponseData.ApisStatusList[resIndex].AdcStatus == "OK" && this.ResponseData.ApisStatusList[resIndex].Status == ApisComponent.APISSTATUSINCOMPLETE) {
                                                    fName = this.ResponseData.ApisStatusList[resIndex].FirstName;
                                                    lName = this.ResponseData.ApisStatusList[resIndex].LastName;
                                                    rph = this.ResponseData.ApisStatusList[resIndex].PassengerRPH;
                                                    Toast.makeText("ADC OK;APIS Incomplete").show();
                                                    this._shared.SetAPISDocument(null);
                                                    isPopup = false;
                                                    isBind = true;
                                                    this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                    this._shared.SetAdultSecurityData(null);
                                                }
                                            }
                                            else {

                                                if (this.ResponseData.Errors != null && this.ResponseData.Errors.length > 0) {
                                                    if (this.ResponseData.Errors[0].Message == ApisComponent.EXITDATE) {
                                                        this.IsExitDateCheck = true;
                                                        this.isDisplayExitDate = true;
                                                        this.isDeleteShown = false;
                                                        this.isAPISComplete = false;
                                                        this.isInputEnabled = true;
                                                        this.isButtonEnabled = false;
                                                        let apisPassenger: any = this._shared.GetSecurityPassengerList();
                                                        let PassengerIndex: Array<any> = [];
                                                        apisPassenger.forEach((pass, i) => {
                                                            if (pass.Firstname == responseData.FirstName && pass.Lastname == responseData.LastName) {
                                                                PassengerIndex.push(i);
                                                            }
                                                        });
                                                        this.ApisIndex = PassengerIndex[resIndex];
                                                        this.MultiInitialIndex = 0;
                                                        this.securityDatas.ApisUpdateRequests.forEach((apis, index) => {
                                                            if (apis.ExitDate == "") {
                                                                this.isButtonEnabled = false;
                                                            }
                                                            if (apis.ExitDateJustification == "") {
                                                                this.isButtonEnabled = false;
                                                            }
                                                        })
                                                        if (this.PassengerIndex.length > 1) {
                                                            if (this.securityDatas.ApisUpdateRequests.length > 1) {
                                                                this.ButtonText = "Next"
                                                                this.ErrorResponse = 1;
                                                            }
                                                        }

                                                        isPopup = true;
                                                        isBind = true;
                                                        this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                    }
                                                    this.loaderProgress.hideLoader();
                                                    Toast.makeText(this.ResponseData.Errors[0].Message).show();
                                                }

                                                this.loaderProgress.hideLoader();
                                            }
                                        }
                                        else {
                                            if (this.ResponseData.Errors != null && this.ResponseData.Errors.length > 0) {

                                                if (this.ResponseData.Errors[0].Message == ApisComponent.EXITDATE) {
                                                    this.IsExitDateCheck = true;
                                                    this.isDisplayExitDate = true;
                                                    this.isInputEnabled = true;
                                                    this.securityDatas.ApisUpdateRequests.forEach((apis, index) => {
                                                        if (apis.ExitDate == "") {
                                                            this.isButtonEnabled = false;
                                                        }
                                                        if (apis.ExitDateJustification == "") {
                                                            this.isButtonEnabled = false;
                                                        }
                                                    })
                                                    this.ApisIndex = this.PassengerIndex[resIndex];
                                                    this.MultiInitialIndex = 0;
                                                    if (this.PassengerIndex.length > 1) {
                                                        if (this.securityDatas.ApisUpdateRequests.length > 1) {
                                                            this.ButtonText = "Next"
                                                            this.ErrorResponse = 1;
                                                        }
                                                    }

                                                    isPopup = true;
                                                    isBind = true;
                                                    this.BindModel(requestModel.ApisUpdateRequests[resIndex], responseData, this.OrderId, isBind);
                                                }
                                                this.loaderProgress.hideLoader();
                                                Toast.makeText(this.ResponseData.Errors[0].Message).show();



                                            }
                                        }
                                    })
                                }
                                else {
                                    if (this.ResponseData.Errors != null && this.ResponseData.Errors.length > 0) {
                                        this.MultiInitialIndex = 0;
                                        this.ApisIndex = this.PassengerIndex[this.MultiInitialIndex];
                                        this.securityDatas.ApisUpdateRequests.forEach((apis, index) => {
                                            apis.ExitDate = moment(new Date()).format("MM/DD/YYYY");
                                        })
                                        if (this.PassengerIndex.length > 1) {
                                            if (this.securityDatas.ApisUpdateRequests.length > 1) {
                                                this.ButtonText = "Next"
                                            }
                                        }
                                        Toast.makeText(this.ResponseData.Errors[0].Message).show();
                                        this.loaderProgress.hideLoader();
                                    }
                                }
                                console.dir(this.ResponseData);
                                console.log(isPopup);
                                console.log(isBind)
                                console.log(this.OrderId)
                                this.PopupModel(this.ResponseData, requestModel, this.OrderId, isPopup);
                                this.ApisValidation[this.ApisIndex].EmergencyContact = this.securityDatas.ApisUpdateRequests[this.ApisIndex].EmergencyDetails[0].EmergencyPhone.Value;
                                this.ApisValidation[this.ApisIndex].EmergencyName = this.securityDatas.ApisUpdateRequests[this.ApisIndex].EmergencyDetails[0].EmergencyContactName;
                                if (isPassengerAddress) {
                                    let segBarElm = <SegmentedBar>this.segbar.nativeElement;
                                    segBarElm.selectedIndex = 2;
                                }
                                else if (isSecondary) {
                                    // if (this.isVisaRequired) {
                                    //     if (this.securityDatas.ApisUpdateRequests[secondaryIndex].Documents.length == 1) {
                                    //         this.add();
                                    //         this.securityDatas.ApisUpdateRequests[secondaryIndex].Documents[1].DocType = this.DocumentTypeList.filter(m => m.DocTypeText == "Visa").length > 0 ? this.DocumentTypeList.filter(m => m.DocTypeText == "Visa")[0].DocType : '14';
                                    //         this.securityDatas.ApisUpdateRequests[secondaryIndex].Documents[1].DocTypeText = 'Visa';
                                    //     }
                                    //     else if (this.securityDatas.ApisUpdateRequests[secondaryIndex].Documents.length == 2) {
                                    //         let typeLength: any = this.securityDatas.ApisUpdateRequests[secondaryIndex].Documents.filter(m => m.DocTypeText == 'Visa').length;
                                    //         if (typeLength == 0) {
                                    //             if (this.securityDatas.ApisUpdateRequests[secondaryIndex].Documents.length == 2) {
                                    //                 this.add();
                                    //                 this.securityDatas.ApisUpdateRequests[secondaryIndex].Documents[2].DocType = this.DocumentTypeList.filter(m => m.DocTypeText == "Visa").length > 0 ? this.DocumentTypeList.filter(m => m.DocTypeText == "Visa")[0].DocType : '14';
                                    //                 this.securityDatas.ApisUpdateRequests[secondaryIndex].Documents[2].DocTypeText = 'Visa';
                                    //             }
                                    //         }
                                    //     }
                                    //     let segBarElm = <SegmentedBar>this.segbar.nativeElement;
                                    //     segBarElm.selectedIndex = 1;

                                    // }

                                    this.ResponseData.ApisStatusList.forEach((data,index)=>{
                                        if(data.VisaRequired){
                                            this.securityDatas.ApisUpdateRequests.forEach((element,docindex)=>{
                                                if(element.RPH == data.PassengerRPH){
                                                    if (element.Documents.length == 1) {
                                                        this.add(docindex);
                                                        element.Documents[1].DocType = this.DocumentTypeList.filter(m => m.DocTypeText == "Visa").length > 0 ? this.DocumentTypeList.filter(m => m.DocTypeText == "Visa")[0].DocType : '14';
                                                        element.Documents[1].DocTypeText = 'Visa';
                                                    }
                                                    else if (element.Documents.length == 2) {
                                                        let typeLength: any = element.Documents.filter(m => m.DocTypeText == 'Visa').length;
                                                        if (typeLength == 0) {
                                                            if (element.Documents.length == 2) {
                                                                this.add(docindex);
                                                                element.Documents[2].DocType = this.DocumentTypeList.filter(m => m.DocTypeText == "Visa").length > 0 ? this.DocumentTypeList.filter(m => m.DocTypeText == "Visa")[0].DocType : '14';
                                                                element.Documents[2].DocTypeText = 'Visa';
                                                            }
                                                        }
                                                    }
                                                }
                                               
                                            })
                                           
                                            let segBarElm = <SegmentedBar>this.segbar.nativeElement;
                                            segBarElm.selectedIndex = 1;
                                        }
                                       
                                    })

                                }
                                else {
                                    let segBarElm = <SegmentedBar>this.segbar.nativeElement;
                                    segBarElm.selectedIndex = 0;
                                }
                                console.dir(this.APISSelection);
                                console.dir(isSecondary);
                                // this.APISPassengerList.forEach((element, passIndex) => {
                                //     if (fName == element.FirstName && lName == element.LastName && rph == element.RPH) {
                                //         this.APISSelection.push(true);
                                //     }
                                //     else {
                                //         this.APISSelection.push(false);
                                //     }
                                // });
                            },
                                err => {
                                    console.log(err);
                                    this.handleServiceError(err);
                                    this.loaderProgress.hideLoader();
                                },
                                () => {
                                    console.log("Country" + this.CountryAddress);
                                    console.dir(this._shared.GetPassenger());
                                    console.log("Load Success ");
                                    //this.loaderProgress.hideLoader();
                                });

                    }
                    catch (error) {
                        console.log(error.message);
                        this.loaderProgress.hideLoader();
                    }
                    finally {
                        var eDate = new Date();
                        console.log('Add Passenger Service --------------- End Date Time : ' + eDate);
                        console.log('Add Passenger Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
                    }
                }
            }
        }
    }

    GetOrderDetails(id: string): void {
        this.loaderProgress.showLoader();
        try {
            var sDate = new Date();
            console.log(
                "Get Passenger Service --------------- Start Date Time : " + sDate
            );
            this._service.GetPassenger(id).subscribe(
                data => {
                    if (data.Success != false) {
                        this._shared.SetPassenger(<Order.RootObject>data);
                        this.loaderProgress.hideLoader();
                        this.navigateToCheckin(this.OrderId);
                    }
                },
                err => {
                    console.log(err);
                    this.handleServiceError(err);
                    this.loaderProgress.hideLoader();
                }
            );
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        } finally {
            var eDate = new Date();
            console.log(
                "Get Passenger Service --------------- End Date Time : " + eDate
            );
            console.log(
                "Get Passenger Service Execution Time : " +
                AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate))
            );
        }
    }
    onPassengerSelector(args: any, isData: boolean) {
        this.isAddresses= false;
        this.APISSelection.length = 0;
        this.MultiInitialIndex = 0;
        let fName: string = args.FirstName != undefined ? args.FirstName : args.Firstname;
        let lName: string = args.LastName != undefined ? args.LastName : args.Lastname;
        this.APISPassengerList.forEach((element, index) => {
            this.APISPassengerList[index].IsChecked = false;
            if (element.FirstName == fName && element.LastName == lName && element.RPH == args.RPH) {
                let emergencyDetails: any = this._shared.GetPassenger().Passengers.filter(m => m.Firstname == fName && m.Lastname == lName)[0].EmergencyDetails;

                this.securityDatas.ApisUpdateRequests.forEach((data, dIndex) => {
                    if (data.Firstname == fName && data.Lastname == lName && data.RPH == args.RPH) {
                        console.dir(emergencyDetails);
                        if (emergencyDetails.length > 0) {
                            emergencyDetails.forEach(element => {
                                this.securityDatas.ApisUpdateRequests[index].EmergencyDetails[0].EmergencyContactName = element.EmergencyContactName;
                                this.securityDatas.ApisUpdateRequests[index].EmergencyDetails[0].EmergencyPhone.Value = element.EmergencyPhone.Value;
                            });
                        }
                    }
                })
                this.APISSelection.push(true);
                this.ApisIndex = index;
                this.ArrayIndex = index;
                this.isAPISComplete = false;
                this.isScanEnabled = true;
                this.PassengerFirstName = this.securityDatas.ApisUpdateRequests[this.ApisIndex].Firstname;
                this.PassengerLastName = this.securityDatas.ApisUpdateRequests[this.ApisIndex].Lastname;
                this.GroupName(args, isData, this.ApisIndex);
            }
            else {
                this.APISSelection.push(false);
            }
        });
        if (this.PassengerIndex.length == 1) {
            if (!this.isAPISComplete) {
                this.ButtonText = "Submit";
            }
        }
        else if (this.PassengerIndex.length > 1) {
            if (!this.isAPISComplete) {
                this.ButtonText = "Next";
            }
        }
        this.isDeleteEnable = true;

        if (this.APISPassengerList.filter(m => m.FirstName == fName && m.LastName == lName)[0].CheckinStatus) {
            // this.isDeleteEnable = false;
        }
        console.dir(args.FirstName);
        console.dir(args.LastName);
        console.dir(this.APISPassengerList);
        console.dir(this.securityDatas.ApisUpdateRequests);
    }
    expand() {
        this.expands = !this.expands;
    }
    check(item: any) {
        this.checks = !this.checks;
        if (this.checks) {
            this.securityDatas.ApisUpdateRequests.forEach((items, index) => {
                this.securityDatas.ApisUpdateRequests[index].EmergencyDetails[0].EmergencyContactName = item.EmergencyDetails[0].EmergencyContactName;
                this.securityDatas.ApisUpdateRequests[index].EmergencyDetails[0].EmergencyPhone.Value = item.EmergencyDetails[0].EmergencyPhone.Value;
            })
        }
    }

    adccheck() {
        this.adcCheck = !this.adcCheck;
        if (this.adcCheck) {
            this.displayADCByPassActionDialog();
        }
        else {
            this.isAPISComplete = false;
            this.isScanEnabled = true;
        }
    }


    trustedCheck() {
        this.trusted = !this.trusted;
    }
    verifiedCheck() {
        this.verified = !this.verified;
    }
    // CheckVerifiedData() {
    //     if (this.securityDatas.Documents[0].IsVerifiedData) {
    //         this.securityDatas.Documents[0].IsVerifiedData = false;
    //     }
    //     else {
    //         this.securityDatas.Documents[0].IsVerifiedData = true;
    //     }
    // }
    // CheckTrustedData() {
    //     if (this.securityDatas.Documents[0].IsTrustedData) {
    //         this.securityDatas.Documents[0].IsTrustedData = false;
    //     }
    //     else {
    //         this.securityDatas.Documents[0].IsTrustedData = true;
    //     }
    // }
    male(index: number) {
        this.securityDatas.ApisUpdateRequests[index].Documents[0].DocHolderGender = '0';
    }
    female(index: number) {
        this.securityDatas.ApisUpdateRequests[index].Documents[0].DocHolderGender = '1';
    }

    Manual() {
        this.securityDatas.ApisUpdateRequests[0].Documents[0].inputType = 'Manual';
    }
    Machine() {
        // this.securityDatas.ApisUpdateRequests[0].Documents[0].inputType = 'Machine Readable';
        this.securityDatas.ApisUpdateRequests[0].Documents[0].inputType = 'Manual';
    }

    isItemVisible(args): string {
        if (args.toString().substr(0, 2) == "CM") {
            return "visible";
        } else return "collapsed";
    }

    reloadProcess(args: any): void {
        this.APISSelection.length = 0;
        this.APISPassengerList.forEach((element, index) => {
            this.APISPassengerList[index].IsChecked = false;
            if (element.FirstName == args.FirstName && element.LastName == args.LastName && element.RPH == args.RPH) {
                this.APISSelection.push(true);
                this.ApisIndex = index;
            }
            else if (element.FirstName == args.Firstname && element.LastName == args.Lastname && element.RPH == args.RPH) {
                this.APISSelection.push(true);
                this.ApisIndex = index;
            }
            else {
                this.APISSelection.push(false);
            }
        })
        this.loaderProgress.hideLoader();
    }

    navigateToCheckin(id: string) {
        this.loaderProgress.hideLoader();
        this.routerExtensions.navigate(["checkin"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                apidata: id,
                index: this.index
            }
        });
    }
    navigateToSetting() {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    }
    navigateToLogin() {
        this.routerExtensions.navigate([""], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    }
    onNavBtnTap(orderID: string = this.OrderId) {
        // This code will be called only in Android.
        this.routerExtensions.navigate(["checkin"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                apidata: orderID,
                index: this.index
            }
        });
    }

    handleServiceError(error: any) {
        var errorMessage = error.toString();
        if (errorMessage.indexOf("SessionTimeout") > -1) {
            var options = {
                title: "Session Time Out",
                message: "Your session has been time out",
                okButtonText: "OK"
            };
            dialogs.alert(options).then(() => {
                this.routerExtensions.navigate([""], {
                    animated: true,
                    transition: {
                        name: "slide",
                        duration: 600,
                        curve: "linear"
                    }
                });
            });
            // this.loaderProgress.hideLoader();
        }
        else {
            Toast.makeText(errorMessage).show();
            this.loaderProgress.hideLoader();

        }
    }
    navigateToCompensation() {
        if (this.isCompensationEnabled == true) {
            this.routerExtensions.navigate(["compensation"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                }
            });
        } else {
            Toast.makeText("Compensation Not applicable").show();
        }
    }

    // tabListWithoutDistination() {
    //     this.apisdetails = [];
    //     this.apisdetails.length = 0;
    //     const item = new SegmentedBarItem();
    //     item.title = "Primary Document";
    //     this.apisdetails.push(item);
    //     const secondItem = new SegmentedBarItem();
    //     secondItem.title = "Secondary Document";
    //     this.apisdetails.push(secondItem);
    // }
    tabListWithDistination() {
        this.apisdetails = [];
        this.apisdetails.length = 0;
        const item = new SegmentedBarItem();
        item.title = "Primary Document";
        this.apisdetails.push(item);
        const secondItem = new SegmentedBarItem();
        secondItem.title = "Secondary Document";
        this.apisdetails.push(secondItem);
        const thirdItem = new SegmentedBarItem();
        thirdItem.title = "Destination Address";
        this.apisdetails.push(thirdItem);
    }
    Scan(type: string) {
        if (isIOS) {
            console.log("inside SCAN");
            let lastname: String = "";
            this._shared.SetAPISDocument(null);
            this._shared.SetScanAPISDocument(null);
            // let licenseKey = ApplicationSettings.getString("licenseKey",'');
            let licenseKey = "ODSJCENK-YQJ6PN2A-CPWRPD2M-SLX6ASMA-O42XS6DH-QYM7NTDP-NTCZLGSP-MD2HBMAY";
            console.log(licenseKey);
            if (type == "Passport") {
                didTapScan(type, licenseKey).then((mrtddata) => {
                    console.dir(mrtddata);
                    console.dir(mrtddata.mrzText())
                    //mrtddata.documentCode()+mrtddata.nationality()+mrtddata
                    console.log(mrtddata.documentCode().split('<')[0]);
                    console.log(mrtddata.documentCode().split(';')[0]);
                    let docType: string;
                    if (mrtddata.documentCode().split('<')[0].length > 0) {
                        docType = mrtddata.documentCode().split('<')[0];
                    }
                    else if (mrtddata.documentCode().split(';').length > 0) {
                        docType = mrtddata.documentCode().split(';')[0];
                    }
                    if (docType.substr(0, 1) == "P") {
                        lastname = mrtddata.primaryId();
                        this._apisDocument.Surname = mrtddata.primaryId();
                        this._apisDocument.Firstname = mrtddata.secondaryId();
                        this._apisDocument.DocHolderNationality = mrtddata.nationality();
                        this._apisDocument.BirthDate = moment(mrtddata.dateOfBirth().split('/')[1] + "/" + mrtddata.dateOfBirth().split('/')[0] + "/" + mrtddata.dateOfBirth().split('/')[2]).format("MM/DD/YYYY");
                        this._apisDocument.ExpireDate = moment(mrtddata.dateOfExpiry().split('/')[1] + "/" + mrtddata.dateOfExpiry().split('/')[0] + "/" + mrtddata.dateOfExpiry().split('/')[2]).format("MM/DD/YYYY");
                        // if(this.CountryDetails.Collection.filter(m =>m.CountryCode==mrtddata.issuer().substr(0, 2)))
                        this._apisDocument.DocIssueCountry = mrtddata.issuer();//.substr(0, 2);
                        console.log(this._apisDocument.DocIssueCountry)
                        this._apisDocument.CountryOfResidence = null//.substr(0, 2);
                        this._apisDocument.OCRString = mrtddata.mrzText().replace("\n", "");
                        if (mrtddata.sex() == "M") {
                            this._apisDocument.DocHolderGender = "0";
                        }
                        else {
                            this._apisDocument.DocHolderGender = "1";
                        }
                        this._apisDocument.DocID = mrtddata.documentNumber().split('<')[0];
                        console.log(JSON.stringify(this._apisDocument));
                        this._shared.SetAPISDocument(this._apisDocument);
                        this._shared.SetScanAPISDocument(this._apisDocument);
                        //this._shared.GetPassenger().Passengers.forEach((element, index) => {
                        if (this._shared.GetPassenger().Passengers[this.ApisIndex].ApisDocoStatus != "Complete" || (this._shared.GetPassenger().Passengers[this.ApisIndex].ApisDocoStatus == "Complete" && this._shared.GetPassenger().Passengers[this.ApisIndex].Documents.length > 0 && this._shared.GetPassenger().Passengers[this.ApisIndex].Documents[0].IsTrustedData != true)) {
                            if (this._shared.GetAPISDocument() != null) {
                                let suffixList = this._shared.GetPassenger().Passengers[this.ApisIndex].Firstname.split(this._shared.GetAPISDocument().Firstname.replace(" ", ""));
                                let suffix = '';
                                if (suffixList.length > 1) {
                                    suffix = suffixList[1];
                                }
                                console.log(suffix);
                                if ((this._shared.GetPassenger().Passengers[this.ApisIndex].Firstname == this._shared.GetAPISDocument().Firstname.replace(" ", "") && this._shared.GetPassenger().Passengers[this.ApisIndex].Lastname == this._shared.GetAPISDocument().Surname.replace(" ", "")) || (this._shared.GetPassenger().Passengers[this.ApisIndex].Lastname == this._shared.GetAPISDocument().Surname.replace(" ", "") && this.SuffixList.filter(m => m == suffix.toUpperCase()).length > 0)) {
                                    console.log("inside");
                                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].Firstname = this._shared.GetAPISDocument().Firstname;
                                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].Surname = this._shared.GetAPISDocument().Surname;
                                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocHolderNationality = this._shared.GetAPISDocument().DocHolderNationality;
                                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].BirthDate = this._shared.GetAPISDocument().BirthDate;
                                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].ExpireDate = this._shared.GetAPISDocument().ExpireDate;
                                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocIssueCountry = this._shared.GetAPISDocument().DocIssueCountry;
                                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].CountryOfResidence = null;
                                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].OCRString = this._shared.GetAPISDocument().OCRString;
                                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocHolderGender = this._shared.GetAPISDocument().DocHolderGender;
                                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocID = this._shared.GetAPISDocument().DocID;

                                    console.log('OCR ' + this._shared.GetAPISDocument().OCRString);
                                    //this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].CountryOfResidence = null;
                                    this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].inputType = "Machine Readable"
                                    if (this._shared.GetCountry().Collection.filter(m => m.ISO3CountryCode == this._shared.GetAPISDocument().DocIssueCountry).length > 0) {
                                        let issueCountry = this._shared.GetCountry().Collection.filter(m => m.ISO3CountryCode == this._shared.GetAPISDocument().DocIssueCountry)[0].CountryCode.toString();
                                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocIssueCountry = issueCountry
                                        console.log("1 " + this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocIssueCountry);
                                        this.ApisValidation[this.ApisIndex].CountryOfIssue[0] = this._shared.GetCountry().Collection.filter(m => m.CountryCode == issueCountry)[0].CountryName.toString();
                                        console.log(this.ApisValidation[this.ApisIndex].CountryOfIssue[0]);
                                    }
                                    if (this._shared.GetCountry().Collection.filter(m => m.ISO3CountryCode == this._shared.GetAPISDocument().CountryOfResidence).length > 0) {
                                        let residenceCountry = this._shared.GetCountry().Collection.filter(m => m.ISO3CountryCode == this._shared.GetAPISDocument().CountryOfResidence)[0].CountryCode.toString();
                                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].CountryOfResidence = residenceCountry;
                                    }
                                    if (this._shared.GetCountry().Collection.filter(m => m.ISO3CountryCode == this._shared.GetAPISDocument().DocHolderNationality).length > 0) {
                                        let docHolderNationality = this._shared.GetCountry().Collection.filter(m => m.ISO3CountryCode == this._shared.GetAPISDocument().DocHolderNationality)[0].CountryCode.toString();
                                        this.securityDatas.ApisUpdateRequests[this.ApisIndex].Documents[0].DocHolderNationality = docHolderNationality;
                                        this.ApisValidation[this.ApisIndex].Nationality = this._shared.GetCountry().Collection.filter(m => m.CountryCode == docHolderNationality)[0].CountryName.toString();
                                        console.log(this.ApisValidation[this.ApisIndex].Nationality);
                                    }
                                    this.isScannedDisabled = true;
                                    this.isAPISScanned(this.isScannedDisabled);
                                    this.isButtonEnabled = false;
                                }
                                else {
                                    Toast.makeText("Scan Document is not matching").show();
                                }
                            }
                        }
                        else {
                            Toast.makeText("APIS is Completed/Trusted").show();
                        }
                        // });
                    }
                    else {
                        Toast.makeText("Scan Document is not valid").show();
                    }


                });

            }
        }
        else {
            Toast.makeText("Supported only in IOS").show();
        }

    }
}

