//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { ObservableArray } from "data/observable-array";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { GestureEventData } from "ui/gestures";
import { ListView, ItemEventData } from "ui/list-view";
import { StackLayout } from "ui/layouts/stack-layout";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import * as dialogs from "ui/dialogs";
import * as gestures from "ui/gestures";
import { SegmentedBar, SegmentedBarItem } from "ui/segmented-bar";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { DatePickerModal, DatePicketContext } from "../../components/date-picker/date-picker-modal";


//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as moment from "moment";
import * as Toast from 'nativescript-toast';

//app references
import { LoaderProgress, order, PassengerListTemplate, DeparturePaxList, PassengerList, DepartureInfo1, InBound, OutBound, CompensationSearchModule } from "../../shared/interface/index"
import { Passenger, Order, Inventory, CountryCollection, BRECompensation } from '../../shared/model/index';
import { DataService, CheckinOrderService, PassengerService, TimeOutService } from "../../shared/services/index";
import { Converters } from "../../shared/utils/index";
import { AppExecutiontime } from "../../app.executiontime";
import { Configuration } from '../../app.constants';

@Component({
    selector: "compensationadditionaldetails-page",
    providers: [DataService, PassengerService, Configuration],
    templateUrl: "./components/compensationadditionaldetails/compensationadditionaldetails.component.html",
    styleUrls: ["./components/compensationadditionaldetails/compensationadditionaldetails.component.css"]

})

export class CompensationAdditionalDetailsComponent implements OnInit {
    @ViewChild('pagecontainer') pageCont: ElementRef;
    @ViewChild('segbar1') segbar1: ElementRef;
    @ViewChild('segbar2') segbar2: ElementRef;
    @ViewChild('firstLayer') firstLayer: ElementRef;
    @ViewChild('secondLayer') secondLayer: ElementRef;
    @ViewChild('thirdLayer') thirdLayer: ElementRef;
    @ViewChild('fourthLayer') fourthLayer: ElementRef;
    @ViewChild('compensationhistory') compensationhistory: ElementRef;
    @ViewChild('reaccomodationdetails') reaccomodationdetails: ElementRef;
    @ViewChild('compensationdetails') compensationdetails: ElementRef;
    @ViewChild('otherdetails') otherdetails: ElementRef;
    @ViewChild('fromflight') fromflight: ElementRef;
    @ViewChild('toflight') toflight: ElementRef;
    @ViewChild('monetoryemd') monetoryemd: ElementRef;
    @ViewChild('hotelemd') hotelemd: ElementRef;
    @ViewChild('mealemd') mealemd: ElementRef;
    @ViewChild('transportemd') transportemd: ElementRef;
    public isError: boolean;
    public errorMessage: string;
    public loaderProgress: LoaderProgress;
    public startDate: Date;
    public CurDate: string;
    public userdetails: any;
    public PassengerType: any;
    public FirstLayer: string;
    public SecondLayer: string;
    public ThirdLayer: string;
    public FirstBlock: boolean = true;
    public SecondBlock: boolean = false;
    public ThirdBlock: boolean = false;
    public FourthBlock: boolean = false;
    public IsFromFlight: boolean = false;
    public IsToFlight: boolean = false;
    public IsMonetoryEmd: boolean = false;
    public IsHotelEmd: boolean = false;
    public IsMealEmd: boolean = false;
    public copyToSelectPax: boolean = false;
    public copyToSelectPaxReacc: boolean = false;
    public IsTransportEmd: boolean = false;
    public FlightHeaderInfo: CompensationSearchModule.FlightModel = new CompensationSearchModule.FlightModel();
    public CompensationHistory: boolean = true;
    public ReaccomodationDetails: boolean = false;
    public CompensationDetails: boolean = false;
    public OtherDetails: boolean = false;
    public IssueCompensationResponse: BRECompensation.BREResponse = new BRECompensation.BREResponse();
    public IssueCompensationPaxList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public selectedPassenger: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public apisdetails: Array<SegmentedBarItem>;
    public firsttab = new SegmentedBarItem();
    public secondtab = new SegmentedBarItem();
    public thridtab = new SegmentedBarItem();
    public fourthtab = new SegmentedBarItem();
    public Endorsementstring: any;
    public CompensationReason: any;
    public FromOneChanged: boolean = false;
    public FromTwoChanged: boolean = false;
    public ToOneChanged: boolean = false;
    public ToTwoChanged: boolean = false;
    public PassengerName: string;
    public PaxItem: CompensationSearchModule.CompensationPassengerList;
    public PreviousPage: string;
    public MonetaryText: Array<string> = [];
    public HotelText: Array<string> = [];
    public MealText: Array<string> = [];
    public TransportText: Array<string> = [];
    public IsVisibleAllTab: boolean = false;
    public TabNotVisible: boolean = false;
    public FromFlightOneError: boolean = false;
    public FromDestOneError: boolean = false;
    public FromOriginOneError: boolean = false;
    public FromFlightTwoError: boolean = false;
    public FromDestTwoError: boolean = false;
    public FromOriginTwoError: boolean = false;
    public ToFlightOneError: boolean = false;
    public ToDestOneError: boolean = false;
    public ToOriginOneError: boolean = false;
    public ToFlightTwoError: boolean = false;
    public ToDestTwoError: boolean = false;
    public ToOriginTwoError: boolean = false;
    public CurrentFlightStatus: string;
    public FromFlightOneNumber: string = "";
    public FromFlightOneDate: string;
    public FromFlightTwoNumber: string = "";
    public FromFlightTwoDate: string;
    public ToFlightOneNumber: string = "";
    public ToFlightOneDate: string;
    public ToFlightTwoNumber: string = "";
    public ToFlightTwoDate: string;

    public IsHistoryVisible: boolean = false;
    public IsMonetaryHistoryVisible: boolean = false;
    public IsHotelHistoryVisible: boolean = false;
    public IsMealHistoryVisible: boolean = false;
    public IsTransportHistoryVisible: boolean = false;
    public isMealDetailValid: boolean = false;
    public isTransportEMDValid: boolean = false;
    public IsHeaderInfo: boolean = false;
    public IsSubmitEnabled: boolean = true;
    public EndorsmentTextMonetary: Array<string> = [];
    public EndorsmentTextHotel: Array<string> = [];
    public EndorsmentTextMeal: Array<string> = [];
    public EndorsmentTextTransport: Array<string> = [];
    public IsFlightInfo: boolean = false;
    public IsWorldTraceValid: boolean = false;
    public IsCustomerCareValid: boolean = false;
    public IsMonetaryTextValid: boolean = false;
    public IsHotelTextValid: boolean = false;
    public IsHotelNameValid: boolean = false;
    public IsMealTextValid: boolean = false;
    public IsTransportTextValid: boolean = false;
    public selectPaxVisible: boolean = false;
    public FromFlightOne: CompensationSearchModule.ReaccomDetail = new CompensationSearchModule.ReaccomDetail();
    public FromFlightTwo: CompensationSearchModule.ReaccomDetail = new CompensationSearchModule.ReaccomDetail();
    public ToFlightOne: CompensationSearchModule.ReaccomDetail = new CompensationSearchModule.ReaccomDetail();
    public ToFlightTwo: CompensationSearchModule.ReaccomDetail = new CompensationSearchModule.ReaccomDetail();
    public MonetaryCompenstion: Array<CompensationSearchModule.ExistingCompensation> = [];
    public MealCompenstion: Array<CompensationSearchModule.ExistingCompensation> = [];
    public HotelCompenstion: Array<CompensationSearchModule.ExistingCompensation> = [];
    public TransportCompenstion: Array<CompensationSearchModule.ExistingCompensation> = [];
    public CompensationPassengerList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    public static ADDITIONALDETAILSFIRSTTAB: string = "Compensation History";
    public static ADDITIONALDETAILSSECONDTAB: string = "Re-accomodation";
    public static ADDITIONALDETAILSTHIRDTAB: string = "Compensation Details";
    public static ADDITIONALDETAILSFOURTHTAB: string = "Other Details";
    public static PREVIOUSSCREENCHECK: string = "SearchResult";
    public static COMPTYPEMONETARY: string = "Monetary";
    public static COMPTYPEHOTEL: string = "Hotel";
    public static COMPTYPEMEAL: string = "Meal";
    public static COMPTYPETRANSPORT: string = "Transportation";
    public static INVALIDAIRLINECODE: string = "Invalid input. Enter airline code and flight number";
    public static INVALIDDEPACODE: string = "Invalid input. Enter departure station code. ";
    public static INVALIDARRICODE: string = "Invalid input. Enter arrival station code. ";
    public static INVALIDCUSTOMERCARECODE: string = "Invalid input. Enter customer care number.";
    public static INVALIDWORLDTRACENUMBER: string = "Invalid input. Enter world trace number.";
    public isLabelField: boolean = false;
    constructor(private _configuration: Configuration, private _services: PassengerService, private activatedRouter: ActivatedRoute, private _modalService: ModalDialogService, private _shared: CheckinOrderService, private vcRef: ViewContainerRef, private page: Page, private routerExtensions: RouterExtensions, public _timeoutService: TimeOutService, private router: Router, public _dataService: DataService, public _service: PassengerService, private route: ActivatedRoute) {
        this.isError = false;
        this.errorMessage = "";
        // this.CurDate = moment().format("YYYY-MM-DD");
        this.startDate = new Date();
        this.CurDate = moment(this.startDate).format("YYYY-MM-DD");
        // this.FromFlightOneDate = moment(this.startDate).format("YYYY-MM-DD");
        // this.FromFlightTwoDate = moment(this.startDate).format("YYYY-MM-DD");
        // this.ToFlightOneDate = moment(this.startDate).format("YYYY-MM-DD");
        // this.ToFlightTwoDate = moment(this.startDate).format("YYYY-MM-DD");
        this.loaderProgress = new LoaderProgress();
        // this.apisdetails = [];

        // this.firsttab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFIRSTTAB;
        // this.apisdetails.push(this.firsttab);

        // this.secondtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSSECONDTAB;
        // this.apisdetails.push(this.secondtab);

        // this.thridtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSTHIRDTAB;
        // this.apisdetails.push(this.thridtab);

        // this.fourthtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFOURTHTAB;
        // this.apisdetails.push(this.fourthtab);
    }
    ngOnInit() {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.CompensationPassengerList = this._shared.getCompensationPaxList();
        if (this.FlightHeaderInfo == null) {
            this.IsHeaderInfo = true;
            this.IsFlightInfo = false;
        } else {
            this.IsHeaderInfo = false;
            this.IsFlightInfo = true;
            this.CurrentFlightStatus = this.FlightHeaderInfo.FlightNumber + " " + this.FlightHeaderInfo.DepartureAirport + " > " + this.FlightHeaderInfo.DestinationAirport;

        }
        this.activatedRouter.queryParams.subscribe((params) => {
            this.PaxItem = JSON.parse(params["data"]);
            this.PreviousPage = params["prepage"];
            this.PassengerName = this.PaxItem.FullName;
            console.log("v" + JSON.stringify(this.PreviousPage));
        })
        this.activatedRouter.queryParams.subscribe((params) => {
            if (params["selectedPAx"] != null &&
                params["selectedPAx"] != "" &&
                params["selectedPAx"] != "undefined") {

                this.selectedPassenger = JSON.parse(params["selectedPAx"]);
                // console.dir(this.selectedPassenger[0].ReaccomDetails);
                console.log("Vcount:" + this.selectedPassenger.length);
            }
        })
        console.log("Var:" + JSON.stringify(this.PaxItem));
        if (this.PreviousPage == "SearchResult") {
            // console.log("Cond 1" + JSON.stringify(this.PreviousPage));
            this.IsVisibleAllTab = true;
            this.copyToSelectPaxReacc = true;
            this.apisdetails = [];
            this.firsttab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFIRSTTAB;
            this.apisdetails.push(this.firsttab);
            this.secondtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSSECONDTAB;
            this.apisdetails.push(this.secondtab);
        } else if (this.PreviousPage == "CompensationList") {
            this.apisdetails = [];
            this.firsttab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFIRSTTAB;
            this.apisdetails.push(this.firsttab);
            this.secondtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSSECONDTAB;
            this.apisdetails.push(this.secondtab);
            this.thridtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSTHIRDTAB;
            this.apisdetails.push(this.thridtab);
            this.fourthtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFOURTHTAB;
            this.apisdetails.push(this.fourthtab);

            if (this.PaxItem.IsCompensationIssued == true) {
                console.log("in here 1");
                this.isLabelField = true;
                this.IsVisibleAllTab = false;
                this.copyToSelectPax = false;
                this.copyToSelectPaxReacc = false;
            } else {
                console.log("in here 12");
                this.isLabelField = false;
                this.IsVisibleAllTab = true;
                this.copyToSelectPaxReacc = true;
                this.apisdetails = [];
                this.firsttab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFIRSTTAB;
                this.apisdetails.push(this.firsttab);
                this.secondtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSSECONDTAB;
                this.apisdetails.push(this.secondtab);
            }
        } else if (this.PreviousPage == "BREPage") {
            this.apisdetails = [];
            this.firsttab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFIRSTTAB;
            this.apisdetails.push(this.firsttab);
            this.secondtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSSECONDTAB;
            this.apisdetails.push(this.secondtab);
            this.thridtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSTHIRDTAB;
            this.apisdetails.push(this.thridtab);
            this.fourthtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFOURTHTAB;
            this.apisdetails.push(this.fourthtab);
            this.isLabelField = false;
            this.IsVisibleAllTab = false;
            this.copyToSelectPax = true;
            this.copyToSelectPaxReacc = true;
        } else if (this.PreviousPage == "IssueCompensationTab") {
            this.apisdetails = [];
            this.firsttab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFIRSTTAB;
            this.apisdetails.push(this.firsttab);
            this.secondtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSSECONDTAB;
            this.apisdetails.push(this.secondtab);
            this.thridtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSTHIRDTAB;
            this.apisdetails.push(this.thridtab);
            this.fourthtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFOURTHTAB;
            this.apisdetails.push(this.fourthtab);
            if (this.PaxItem.IsCompensationIssued == true) {
                this.isLabelField = true;
                this.IsVisibleAllTab = false;
                this.copyToSelectPax = false;
                this.copyToSelectPaxReacc = false;
            } else {
                this.isLabelField = false;
                this.IsVisibleAllTab = false;
                this.copyToSelectPax = true;
                this.copyToSelectPaxReacc = true;
            }
        } else if (this.PreviousPage == "PrintList") {
            this.apisdetails = [];
            this.firsttab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFIRSTTAB;
            this.apisdetails.push(this.firsttab);
            this.secondtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSSECONDTAB;
            this.apisdetails.push(this.secondtab);
            this.thridtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSTHIRDTAB;
            this.apisdetails.push(this.thridtab);
            this.fourthtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFOURTHTAB;
            this.apisdetails.push(this.fourthtab);
            this.isLabelField = true;
            this.IsVisibleAllTab = false;
            this.copyToSelectPax = false;
            this.copyToSelectPaxReacc = false;
        } else {
            console.log("in here 2");
            this.apisdetails = [];
            this.firsttab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSFIRSTTAB;
            this.apisdetails.push(this.firsttab);
            this.secondtab.title = CompensationAdditionalDetailsComponent.ADDITIONALDETAILSSECONDTAB;
            this.apisdetails.push(this.secondtab);
            this.IsVisibleAllTab = true;
            this.copyToSelectPax = false;
            this.copyToSelectPaxReacc = false;
        }
        if (this.IsVisibleAllTab == false) {
            this.IssueCompensationPaxList = this._shared.getIssueCompensation();
            this.MonetaryText = this.PaxItem.monetaryendorsementTextItems;
            this.HotelText = this.PaxItem.hotelendorsementTextItems;
            this.MealText = this.PaxItem.mealendorsementTextItems;
            this.TransportText = this.PaxItem.transportationendorsementTextItems;
            this.CompensationReason = this.PaxItem.Compensations[0].CompReasonText;
        }
        if (this.PaxItem.ExistingCompensations == null) {
            this.IsHistoryVisible = false;
        } else {
            this.IsHistoryVisible = true;
            if (this.PaxItem.ExistingCompensations.length > 0) {
                console.log("Inside history");
                this.MonetaryCompenstion = this.PaxItem.ExistingCompensations.filter(m => m.CompTypeText == CompensationAdditionalDetailsComponent.COMPTYPEMONETARY);
                console.log("inside" + JSON.stringify(this.MonetaryCompenstion));
                if (this.MonetaryCompenstion != null) {
                    this.MonetaryCompenstion.forEach((data, Index) => {
                        data.Emds[0].Endorsements1Txt.replace('?.', '.');
                        if(data.Emds[0].Endorsements1Txt.indexOf('?')>0){
                            this.PaxItem.monetaryfreeText = data.Emds[0].Endorsements1Txt.substr(data.Emds[0].Endorsements1Txt.indexOf('?') + 2);
                        }else{
                            this.PaxItem.monetaryfreeText = data.Emds[0].Endorsements1Txt.substr(data.Emds[0].Endorsements1Txt.indexOf('|') + 1);
                        }   
                        this.EndorsmentTextMonetary = data.Emds[0].Endorsements1Txt.split('.') ;
                        this.IsMonetaryHistoryVisible = true;
                    })
                }
                this.HotelCompenstion = this.PaxItem.ExistingCompensations.filter(m => m.CompTypeText == CompensationAdditionalDetailsComponent.COMPTYPEHOTEL);
                if (this.HotelCompenstion != null) {
                    this.HotelCompenstion.forEach((data, Index) => {
                        data.Emds[0].Endorsements1Txt.replace('?', '.');
                        this.EndorsmentTextHotel = data.Emds[0].Endorsements1Txt.split('.');
                        if(data.Emds[0].Endorsements1Txt.indexOf('?')>0){
                            this.PaxItem.hotelFreeText = data.Emds[0].Endorsements1Txt.substr(data.Emds[0].Endorsements1Txt.indexOf('?') + 2);
                        }else{
                            this.PaxItem.hotelFreeText = data.Emds[0].Endorsements1Txt.substr(data.Emds[0].Endorsements1Txt.indexOf('|') + 1);
                        }  
                        this.IsHotelHistoryVisible = true;
                    })
                }
                this.MealCompenstion = this.PaxItem.ExistingCompensations.filter(m => m.CompTypeText == CompensationAdditionalDetailsComponent.COMPTYPEMEAL);
                if (this.MealCompenstion != null) {
                    this.MealCompenstion.forEach((data, Index) => {
                        data.Emds[0].Endorsements1Txt.replace('?', '.');
                        this.EndorsmentTextMeal = data.Emds[0].Endorsements1Txt.split('.');
                        if(data.Emds[0].Endorsements1Txt.indexOf('?')>0){
                            this.PaxItem.mealFreeText = data.Emds[0].Endorsements1Txt.substr(data.Emds[0].Endorsements1Txt.indexOf('?') + 2);
                        }else{
                            this.PaxItem.mealFreeText = data.Emds[0].Endorsements1Txt.substr(data.Emds[0].Endorsements1Txt.indexOf('|') + 1);
                        }
                        this.IsMealHistoryVisible = true;
                    })
                }
                this.TransportCompenstion = this.PaxItem.ExistingCompensations.filter(m => m.CompTypeText == CompensationAdditionalDetailsComponent.COMPTYPETRANSPORT);
                if (this.TransportCompenstion != null) {
                    this.TransportCompenstion.forEach((data, Index) => {
                        data.Emds[0].Endorsements1Txt.replace('?', '.');
                        this.EndorsmentTextTransport = data.Emds[0].Endorsements1Txt.split('.');
                        if(data.Emds[0].Endorsements1Txt.indexOf('?')>0){
                            this.PaxItem.transportFreeText = data.Emds[0].Endorsements1Txt.substr(data.Emds[0].Endorsements1Txt.indexOf('?') + 2);
                        }else{
                            this.PaxItem.transportFreeText = data.Emds[0].Endorsements1Txt.substr(data.Emds[0].Endorsements1Txt.indexOf('|') + 1);
                        }
                        this.IsTransportHistoryVisible = true;
                    })
                }

            }
        }
        if (this.PaxItem.ReaccomDetails) {
            this.FromFlightOne = this.PaxItem.ReaccomDetails.filter(m => m.FromToFlag == "FROM" && m.GUIDisplayFlag == "1")[0];
            if (this.FromFlightOne != null || this.FromFlightOne != undefined) {
                if (this.FromFlightOne.ReaccomAirlineCode == null && this.FromFlightOne.ReaccomFlightNo == '0') {
                    this.FromFlightOneNumber = "";
                } else {
                    if (this.FromFlightOne.ReaccomAirlineCode == null) {
                        this.FromFlightOneNumber = this.FromFlightOne.ReaccomFlightNo;
                    } else {
                        this.FromFlightOneNumber = this.FromFlightOne.ReaccomAirlineCode + this.FromFlightOne.ReaccomFlightNo;
                    }
                }
                this.FromFlightOneDate = this.FromFlightOne.ReaccomFlightDt;
            } else {
                this.FromFlightOneNumber = "";
                this.FromFlightOne = new CompensationSearchModule.ReaccomDetail();
                this.FromFlightOne.ReaccomBoardCityCd = "";
                this.FromFlightOne.ReaccomOffCityCd = "";
                this.FromFlightOne.ReaccomFlightDt = "";
            }
            console.log("FLIGHT:" + JSON.stringify(this.FromFlightOne));
            this.FromFlightTwo = this.PaxItem.ReaccomDetails.filter(m => m.FromToFlag == "FROM" && m.GUIDisplayFlag == "2")[0];
            if (this.FromFlightTwo != null || this.FromFlightTwo != undefined) {
                if (this.FromFlightTwo.ReaccomAirlineCode == null && this.FromFlightTwo.ReaccomFlightNo == '0') {
                    this.FromFlightTwoNumber = "";
                } else {
                    if (this.FromFlightTwo.ReaccomAirlineCode == null) {
                        this.FromFlightTwoNumber = this.FromFlightTwo.ReaccomFlightNo;
                    } else {
                        this.FromFlightTwoNumber = this.FromFlightTwo.ReaccomAirlineCode + this.FromFlightTwo.ReaccomFlightNo;
                    }
                }
                this.FromFlightTwoDate = this.FromFlightTwo.ReaccomFlightDt;
            } else {
                this.FromFlightTwoNumber = "";
                this.FromFlightTwo = new CompensationSearchModule.ReaccomDetail();
                this.FromFlightTwo.ReaccomBoardCityCd = "";
                this.FromFlightTwo.ReaccomOffCityCd = "";
                this.FromFlightTwo.ReaccomFlightDt ="";
            }
            this.ToFlightOne = this.PaxItem.ReaccomDetails.filter(m => m.FromToFlag == "TO" && m.GUIDisplayFlag == "3")[0];
            if (this.ToFlightOne != null || this.ToFlightOne != undefined) {
                if (this.ToFlightOne.ReaccomAirlineCode == null && this.ToFlightOne.ReaccomFlightNo == '0') {
                    this.ToFlightOneNumber = "";
                } else {
                    if (this.ToFlightOne.ReaccomAirlineCode == null) {
                        this.ToFlightOneNumber = this.ToFlightOne.ReaccomFlightNo;
                    } else {
                        this.ToFlightOneNumber = this.ToFlightOne.ReaccomAirlineCode + this.ToFlightOne.ReaccomFlightNo;
                    }
                }
                this.ToFlightOneDate = this.ToFlightOne.ReaccomFlightDt;
            } else {
                this.ToFlightOneNumber = "";
                this.ToFlightOne = new CompensationSearchModule.ReaccomDetail();
                this.ToFlightOne.ReaccomBoardCityCd = "";
                this.ToFlightOne.ReaccomOffCityCd = "";
                this.ToFlightOne.ReaccomFlightDt = moment(this.startDate).format("YYYY-MM-DD");
            }
            this.ToFlightTwo = this.PaxItem.ReaccomDetails.filter(m => m.FromToFlag == "TO" && m.GUIDisplayFlag == "4")[0];
            if (this.ToFlightTwo != null || this.ToFlightTwo != undefined) {
                if (this.ToFlightTwo.ReaccomAirlineCode == null && this.ToFlightTwo.ReaccomFlightNo == '0') {
                    this.ToFlightTwoNumber = "";
                } else {
                    if (this.ToFlightTwo.ReaccomAirlineCode == null) {
                        this.ToFlightTwoNumber = this.ToFlightTwo.ReaccomFlightNo;
                    } else {
                        this.ToFlightTwoNumber = this.ToFlightTwo.ReaccomAirlineCode + this.ToFlightTwo.ReaccomFlightNo;
                    }
                }
                this.ToFlightTwoDate = this.ToFlightTwo.ReaccomFlightDt;
            } else {
                this.ToFlightTwoNumber = "";
                this.ToFlightTwo = new CompensationSearchModule.ReaccomDetail();
                this.ToFlightTwo.ReaccomBoardCityCd = "";
                this.ToFlightTwo.ReaccomOffCityCd = "";
                this.ToFlightTwo.ReaccomFlightDt = moment(this.startDate).format("YYYY-MM-DD");
            }
        }


    }
    submitEnabled(): boolean {

        if (this.IsSubmitEnabled == true) {
            return true;
        } else return false;
    }
    copyToSelectedPax() {
        if (this.PaxItem.copyToSelectedPax == true) {
            this.PaxItem.copyToSelectedPax = false;
            this.selectedPassenger.forEach((data, Index) => {
                data.copyToSelectedPax = true;
            })
        } else {
            this.PaxItem.copyToSelectedPax = true;
            this.selectedPassenger.forEach((data, Index) => {
                data.copyToSelectedPax = true;
                data.hotelFreeText = this.PaxItem.hotelFreeText;
                data.monetaryfreeText = this.PaxItem.monetaryfreeText;
                data.mealFreeText = this.PaxItem.mealFreeText;
                data.transportFreeText = this.PaxItem.transportFreeText;
                data.mealDetails = this.PaxItem.mealDetails;
                data.hotelDetails = this.PaxItem.hotelDetails;
                data.transportEMD = this.PaxItem.transportEMD;
            })
        }
    }
    copyReaccomodationToSelectedPax() {
        if (this.PaxItem.copyToSelectedPaxReaccom == true) {
            this.PaxItem.copyToSelectedPaxReaccom = false;
            this.selectedPassenger.forEach((data, Index) => {
                data.copyToSelectedPaxReaccom = true;
            })
        } else {
            this.PaxItem.copyToSelectedPaxReaccom = true;
            // this.selectedPassenger.forEach((data, Index) => {
            //     data.copyToSelectedPaxReaccom = true;
            //     data.ReaccomDetails =this.PaxItem.ReaccomDetails;
            // })

        }
    }
    onChange(args: any, index: any) {
        console.log(index);
        switch (index) {
            case 1:
                // if (this.FromFlightOneNumber.length > 6) {
                //     this.FromFlightOneError = true;
                // } else {
                if (this.FromFlightOneNumber != "") {
                    // var reg = new RegExp'/([A-Z]{2,3})\d{3,4}/');
                    var REG_EXP = /(^([A-Za-z]{0,2})\d{1,4})$/;
                    var test = REG_EXP.test(this.FromFlightOneNumber);
                    if (test == false) {
                        this.FromFlightOneError = true;
                        // Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDAIRLINECODE).show();
                    } else {
                        this.FromFlightOneError = false;
                    }
                }
                else {
                    this.FromFlightOneError = false;
                }
                // }
                break;
            case 2:
                if (this.FromFlightOne.ReaccomBoardCityCd != undefined) {
                    if (this.FromFlightOne.ReaccomBoardCityCd.length > 3) {
                        this.FromOriginOneError = true;
                    } else {
                        if (this.FromFlightOne.ReaccomBoardCityCd != null) {
                            var reg = new RegExp('^[a-zA-Z]*$');
                            var test = reg.test(this.FromFlightOne.ReaccomBoardCityCd);
                            if (test == false) {
                                this.FromOriginOneError = true;
                                Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDDEPACODE).show();
                            } else {
                                this.FromOriginOneError = false;
                            }
                        } else {
                            this.FromOriginOneError = false;
                        }
                    }
                }
                break;
            case 3:
                if (this.FromFlightOne.ReaccomOffCityCd != undefined) {
                    if (this.FromFlightOne.ReaccomOffCityCd.length > 3) {
                        this.FromDestOneError = true;
                    } else {
                        if (this.FromFlightOne.ReaccomOffCityCd != null) {
                            var reg = new RegExp('^[a-zA-Z]*$');
                            var test = reg.test(this.FromFlightOne.ReaccomOffCityCd);
                            if (test == false) {
                                this.FromDestOneError = true;
                                Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDARRICODE).show();
                            } else {
                                this.FromDestOneError = false;
                            }
                        } else {
                            this.FromDestOneError = false;
                        }
                    }
                }
                break;
            case 4:
                // if (this.FromFlightTwoNumber.length > 6) {
                //     this.FromFlightTwoError = true;
                // } else {
                if (this.FromFlightTwoNumber != "") {
                    var REG_EXP = /(^([A-Za-z]{0,2})\d{1,4})$/;
                    var test = REG_EXP.test(this.FromFlightTwoNumber);
                    if (test == false) {
                        this.FromFlightTwoError = true;
                        // Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDAIRLINECODE).show();
                    } else {
                        this.FromFlightTwoError = false;
                    }
                }
                else {
                    this.FromFlightTwoError = false;
                }
                // }
                break;
            case 5:
                if (this.FromFlightTwo.ReaccomBoardCityCd != undefined) {
                    if (this.FromFlightTwo.ReaccomBoardCityCd.length > 3) {
                        this.FromOriginTwoError = true;
                    } else {
                        if (this.FromFlightTwo.ReaccomBoardCityCd != null) {
                            var reg = new RegExp('^[a-zA-Z]*$');
                            var test = reg.test(this.FromFlightTwo.ReaccomBoardCityCd);
                            if (test == false) {
                                this.FromOriginTwoError = true;
                                Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDDEPACODE).show();
                            } else {
                                this.FromOriginTwoError = false;
                            }
                        } else {
                            this.FromOriginTwoError = false;
                        }
                    }
                }
                break;
            case 6:
                if (this.FromFlightTwo.ReaccomOffCityCd != undefined) {
                    if (this.FromFlightTwo.ReaccomOffCityCd.length > 3) {
                        this.FromDestTwoError = true;
                    } else {
                        if (this.FromFlightTwo.ReaccomOffCityCd != null) {
                            var reg = new RegExp('^[a-zA-Z]*$');
                            var test = reg.test(this.FromFlightTwo.ReaccomOffCityCd);
                            if (test == false) {
                                this.FromDestTwoError = true;
                                Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDARRICODE).show();
                            } else {
                                this.FromDestTwoError = false;
                            }
                        } else {
                            this.FromDestTwoError = false;
                        }
                    }
                }
                break;
            case 7:
                // if (this.ToFlightOneNumber.length > 6) {
                //     this.ToFlightOneError = true;
                // } else {
                if (this.ToFlightOneNumber != "") {
                    var REG_EXP = /(^([A-Za-z]{0,2})\d{1,4})$/;
                    var test = REG_EXP.test(this.ToFlightOneNumber);
                    if (test == false) {
                        this.ToFlightOneError = true;
                        // Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDAIRLINECODE).show();
                    } else {
                        this.ToFlightOneError = false;
                    }
                }
                else {
                    this.ToFlightOneError = false;
                }
                // }
                break;
            case 8:
                if (this.ToFlightOne.ReaccomBoardCityCd != undefined) {
                    if (this.ToFlightOne.ReaccomBoardCityCd.length > 3) {
                        this.ToOriginOneError = true;
                    } else {
                        if (this.ToFlightOne.ReaccomBoardCityCd != null) {
                            var reg = new RegExp('^[a-zA-Z]*$');
                            var test = reg.test(this.ToFlightOne.ReaccomBoardCityCd);
                            if (test == false) {
                                this.ToOriginOneError = true;
                                Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDDEPACODE).show();
                            } else {
                                this.ToOriginOneError = false;
                            }
                        } else {
                            this.ToOriginOneError = false;
                        }
                    }
                }
                break;
            case 9:
            if (this.ToFlightOne.ReaccomOffCityCd != undefined) {
                if (this.ToFlightOne.ReaccomOffCityCd.length > 3) {
                    this.ToDestOneError = true;
                } else {
                    if (this.ToFlightOne.ReaccomOffCityCd != null) {
                        var reg = new RegExp('^[a-zA-Z]*$');
                        var test = reg.test(this.ToFlightOne.ReaccomOffCityCd);
                        if (test == false) {
                            this.ToDestOneError = true;
                            Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDARRICODE).show();
                        } else {
                            this.ToDestOneError = false;
                        }
                    } else {
                        this.ToDestOneError = false;
                    }
                }
            }
                break;
            case 10:
                // if (this.ToFlightTwoNumber.length > 6) {
                //     this.ToFlightTwoError = true;
                // } else {
                if (this.ToFlightTwoNumber != "") {
                    var REG_EXP = /(^([A-Za-z]{0,2})\d{1,4})$/;
                    var test = REG_EXP.test(this.ToFlightTwoNumber);
                    if (test == false) {
                        this.ToFlightTwoError = true;
                        // Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDAIRLINECODE).show();
                    } else {
                        this.ToFlightTwoError = false;
                    }
                }
                else {
                    this.ToFlightTwoError = false;
                }
                // }
                break;
            case 11:
            if (this.ToFlightTwo.ReaccomBoardCityCd != undefined){
                if (this.ToFlightTwo.ReaccomBoardCityCd.length > 3) {
                    this.ToOriginTwoError = true;
                } else {
                    if (this.ToFlightTwo.ReaccomBoardCityCd != null) {
                        var reg = new RegExp('^[a-zA-Z]*$');
                        var test = reg.test(this.ToFlightTwo.ReaccomBoardCityCd);
                        if (test == false) {
                            this.ToOriginTwoError = true;
                            Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDDEPACODE).show();
                        } else {
                            this.ToOriginTwoError = false;
                        }
                    } else {
                        this.ToOriginTwoError = false;
                    }
                }
            }
                break;
            case 12:
            if (this.ToFlightTwo.ReaccomOffCityCd != undefined){
                if (this.ToFlightTwo.ReaccomOffCityCd.length > 3) {
                    this.ToDestTwoError = true;
                } else {
                    if (this.ToFlightTwo.ReaccomOffCityCd != null) {
                        var reg = new RegExp('^[a-zA-Z]*$');
                        var test = reg.test(this.ToFlightTwo.ReaccomOffCityCd);
                        if (test == false) {
                            this.ToDestTwoError = true;
                            Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDARRICODE).show();
                        } else {
                            this.ToDestTwoError = false;
                        }
                    } else {
                        this.ToDestTwoError = false;
                    }
                }
            }
                break;
            case 13:
                if (this.PaxItem.WorldTracerNum.length > 10) {
                    this.IsWorldTraceValid = true;
                } else {
                    if (this.PaxItem.WorldTracerNum != "") {
                        var reg = new RegExp('^[a-zA-Z0-9]*$');
                        var test = reg.test(this.PaxItem.WorldTracerNum);
                        if (test == false) {
                            this.IsWorldTraceValid = true;
                            Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDWORLDTRACENUMBER).show();
                        } else {
                            this.IsWorldTraceValid = false;
                        }
                    }
                    else {
                        this.IsWorldTraceValid = false;
                    }
                }
                break;
            case 14:
                if (this.PaxItem.CustomerCareCaseNum.length > 15) {
                    this.IsCustomerCareValid = true;
                } else {
                    if (this.PaxItem.CustomerCareCaseNum != "") {
                        var reg = new RegExp('^[0-9]*$');
                        var test = reg.test(this.PaxItem.CustomerCareCaseNum);
                        if (test == false) {
                            this.IsCustomerCareValid = true;
                            Toast.makeText(CompensationAdditionalDetailsComponent.INVALIDCUSTOMERCARECODE).show();
                        } else {
                            this.IsCustomerCareValid = false;
                        }
                    }
                    else {
                        this.IsCustomerCareValid = false;
                    }
                }
                break;
            case 15:
                if (this.PaxItem.monetaryfreeText.length > 50) {
                    this.IsMonetaryTextValid = true;
                    Toast.makeText("Maximum 50 characters").show();
                } else {
                    if (this.PaxItem.monetaryfreeText != "") {
                        var reg = new RegExp('^[a-zA-Z0-9 ,.]*$');
                        var test = reg.test(this.PaxItem.monetaryfreeText);
                        if (test == false) {
                            this.IsMonetaryTextValid = true;
                        } else {
                            this.IsMonetaryTextValid = false;
                        }
                    }
                    else {
                        this.IsMonetaryTextValid = false;
                    }
                }
                break;
            case 16:
                if (this.PaxItem.hotelFreeText.length > 50) {
                    this.IsHotelTextValid = true;
                    Toast.makeText("Maximum 50 characters").show();
                } else {
                    if (this.PaxItem.hotelFreeText != "") {
                        var reg = new RegExp('^[a-zA-Z0-9 ,.]*$');
                        var test = reg.test(this.PaxItem.hotelFreeText);
                        if (test == false) {
                            this.IsHotelTextValid = true;
                        } else {
                            this.IsHotelTextValid = false;
                        }
                    }
                    else {
                        this.IsHotelTextValid = false;
                    }
                }
                break;
            case 17:
                if (this.PaxItem.hotelDetails.length > 26) {
                    this.IsHotelNameValid = true;
                    Toast.makeText("Maximum 26 characters").show();
                } else {
                    if (this.PaxItem.hotelDetails != "") {
                        var reg = new RegExp('^[a-zA-Z0-9 ,.]*$');
                        var test = reg.test(this.PaxItem.hotelDetails);
                        if (test == false) {
                            this.IsHotelNameValid = true;
                        } else {
                            this.IsHotelNameValid = false;
                        }
                    }
                    else {
                        this.IsHotelNameValid = false;
                    }
                }
                break;
            case 18:
                if (this.PaxItem.mealFreeText.length > 50) {
                    this.IsMealTextValid = true;
                    Toast.makeText("Maximum 50 characters").show();
                } else {
                    if (this.PaxItem.mealFreeText != "") {
                        var reg = new RegExp('^[a-zA-Z0-9 ,.]*$');
                        var test = reg.test(this.PaxItem.mealFreeText);
                        if (test == false) {
                            this.IsMealTextValid = true;
                        } else {
                            this.IsMealTextValid = false;
                        }
                    }
                    else {
                        this.IsMealTextValid = false;
                    }
                }
                break;
            case 19:
                if (this.PaxItem.transportFreeText.length > 50) {
                    this.IsTransportTextValid = true;
                    Toast.makeText("Maximum 50 characters").show();
                } else {
                    if (this.PaxItem.transportFreeText != "") {
                        var reg = new RegExp('^[a-zA-Z0-9 ,.]*$');
                        var test = reg.test(this.PaxItem.transportFreeText);
                        if (test == false) {
                            this.IsTransportTextValid = true;
                        } else {
                            this.IsTransportTextValid = false;
                        }
                    }
                    else {
                        this.IsTransportTextValid = false;
                    }
                }
                break;
            case 20:
                if (this.PaxItem.mealDetails.length > 50) {
                    this.isMealDetailValid = true;
                    Toast.makeText("Maximum 26 characters").show();
                } else {
                    if (this.PaxItem.mealDetails != "") {
                        var reg = new RegExp('^[a-zA-Z0-9 ,.]*$');
                        var test = reg.test(this.PaxItem.mealDetails);
                        if (test == false) {
                            this.isMealDetailValid = true;
                        } else {
                            this.isMealDetailValid = false;
                        }
                    }
                    else {
                        this.isMealDetailValid = false;
                    }
                }
                break;
            case 21:
                if (this.PaxItem.transportEMD.length > 50) {
                    this.isTransportEMDValid = true;
                    Toast.makeText("Maximum 26 characters").show();
                } else {
                    if (this.PaxItem.transportEMD != "") {
                        var reg = new RegExp('^[a-zA-Z0-9 ,.]*$');
                        var test = reg.test(this.PaxItem.transportEMD);
                        if (test == false) {
                            this.isTransportEMDValid = true;
                        } else {
                            this.isTransportEMDValid = false;
                        }
                    }
                    else {
                        this.isTransportEMDValid = false;
                    }
                }
                break;
            default:
                break;
        }
        // if (this.FromFlightOneError == false && this.FromOriginOneError == false && this.FromDestOneError == false && this.FromFlightTwoError == false && this.FromOriginTwoError == false && this.FromDestTwoError == false && this.ToFlightOneError == false && this.ToOriginOneError == false && this.ToDestOneError == false && this.ToFlightTwoError == false && this.ToOriginTwoError == false && this.ToDestTwoError == false && this.IsCustomerCareValid == false && this.IsWorldTraceValid == false && this.IsTransportTextValid == false && this.IsMealTextValid == false && this.IsHotelNameValid == false && this.IsHotelTextValid == false && this.IsMonetaryTextValid == false && this.isTransportEMDValid == false && this.isMealDetailValid == false) {
        //     this.IsSubmitEnabled = true;
        // } else {
        //     this.IsSubmitEnabled = false;
        // }
        // console.log("flight date:" + this.FromFlightOneDate);
        this.IsSubmitEnabled = true;
        if (this.FromFlightOneNumber != "") {
            if (this.FromFlightOne.ReaccomBoardCityCd != null && this.FromFlightOne.ReaccomOffCityCd != null && this.FromFlightOneDate != undefined && this.FromFlightOne.ReaccomBoardCityCd != "" && this.FromFlightOne.ReaccomOffCityCd != "" && this.FromFlightOneDate != "") {
                if (this.FromFlightOneError == false && this.FromOriginOneError == false && this.FromDestOneError == false) {
                    // this.IsSubmitEnabled = true;
                } else {
                    this.IsSubmitEnabled = false;
                }
            }else{
                this.IsSubmitEnabled = false;
            }
        }
        if (this.FromFlightTwoNumber != "") {
            // this.IsSubmitEnabled = false;
            if (this.FromFlightTwo.ReaccomBoardCityCd != null && this.FromFlightTwo.ReaccomOffCityCd != null && this.FromFlightTwoDate != undefined && this.FromFlightTwo.ReaccomBoardCityCd != "" && this.FromFlightTwo.ReaccomOffCityCd != "" && this.FromFlightTwoDate != "") {
                if (this.FromFlightTwoError == false && this.FromOriginTwoError == false && this.FromDestTwoError == false) {
                        // this.IsSubmitEnabled = true;
                    } else {
                        this.IsSubmitEnabled = false;
                    }
            }else{
                this.IsSubmitEnabled = false;
            }
        }
        if (this.ToFlightOneNumber != "") {
            // this.IsSubmitEnabled = false;
            if (this.ToFlightOne.ReaccomBoardCityCd != null && this.ToFlightOne.ReaccomOffCityCd != null && this.ToFlightOneDate != undefined && this.ToFlightOne.ReaccomBoardCityCd != "" && this.ToFlightOne.ReaccomOffCityCd != "" && this.ToFlightOneDate != "") {
                if (this.ToFlightOneError == false && this.ToOriginOneError == false && this.ToDestOneError == false) {
                        // this.IsSubmitEnabled = true;
                    } else {
                        this.IsSubmitEnabled = false;
                    }
            }else{
                this.IsSubmitEnabled = false;
            }
        }
        if (this.ToFlightTwoNumber != "") {
            // this.IsSubmitEnabled = false;
            if (this.ToFlightTwo.ReaccomBoardCityCd != null && this.ToFlightTwo.ReaccomOffCityCd != null && this.ToFlightTwoDate != undefined && this.ToFlightTwo.ReaccomBoardCityCd != "" && this.ToFlightTwo.ReaccomOffCityCd != "" && this.ToFlightTwoDate != "") {
                if (  this.ToFlightTwoError == false && this.ToOriginTwoError == false && this.ToDestTwoError == false ) {
                        // this.IsSubmitEnabled = true;
                    } else {
                        this.IsSubmitEnabled = false;
                    }
            }else{
                this.IsSubmitEnabled = false;
            }
        }


    }
    monetaryLayout(): void {
        this.FirstBlock = true;
        this.SecondBlock = false;
        this.ThirdBlock = false;
        this.FourthBlock = false;
    }
    hotelLayout(): void {
        this.FirstBlock = false;
        this.SecondBlock = true;
        this.ThirdBlock = false;
        this.FourthBlock = false;
    }
    mealLayout(): void {
        this.FirstBlock = false;
        this.SecondBlock = false;
        this.ThirdBlock = true;
        this.FourthBlock = false;
    }
    transportLayout(): void {
        this.FirstBlock = false;
        this.SecondBlock = false;
        this.ThirdBlock = false;
        this.FourthBlock = true;
    }
    public selectSegment(e: any) {
        console.dir(e);
        var selInd = e.newIndex;
        if (this.IsVisibleAllTab == true) {
            console.log("Cond 2" + JSON.stringify(this.IsVisibleAllTab));
            if (selInd == 0) {
                this.CompensationHistory = true;
                this.CompensationDetails = false;
                this.ReaccomodationDetails = false;
                this.OtherDetails = false;
                this.FirstBlock = true;
                this.SecondBlock = false;
                this.ThirdBlock = false;
                this.FourthBlock = false;
            } else if (selInd == 1) {
                this.CompensationHistory = false;
                this.CompensationDetails = false;
                this.ReaccomodationDetails = true;
                this.OtherDetails = false;
                this.IsFromFlight = true;
                this.IsToFlight = false;
            }
            else {

            }
        } else {
            console.log("Cond 3" + JSON.stringify(this.IsVisibleAllTab));
            if (selInd == 0) {
                this.CompensationHistory = true;
                this.CompensationDetails = false;
                this.ReaccomodationDetails = false;
                this.OtherDetails = false;
                this.FirstBlock = true;
                this.SecondBlock = false;
                this.ThirdBlock = false;
                this.FourthBlock = false;
            } else if (selInd == 1) {
                this.CompensationHistory = false;
                this.CompensationDetails = false;
                this.ReaccomodationDetails = true;
                this.OtherDetails = false;
                this.IsFromFlight = true;
                this.IsToFlight = false;
            }
            else if (selInd == 2) {
                this.CompensationHistory = false;
                this.CompensationDetails = true;
                this.ReaccomodationDetails = false;
                this.OtherDetails = false;
                this.IsMonetoryEmd = true;
                this.IsHotelEmd = false;
                this.IsTransportEmd = false;
                this.IsMealEmd = false;

            } else {
                this.CompensationHistory = false;
                this.CompensationDetails = false;
                this.ReaccomodationDetails = false;
                this.OtherDetails = true;
            }
        }
    }

    public selectedBackgroundColor(e: any) {
        var selColor = e.Color
    }

    createModelViewForFrom1Date(args) {
        let that = this;
        let currentDate = this.CurDate;
        console.log(this.startDate);
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                currentDate: currentDate,
                displayHeader: true,
                minDate: moment(new Date()).subtract(1, 'years').toDate().toDateString(),
                maxDate: moment(new Date()).add(2, 'years').toDate().toDateString()
            },
            fullscreen: false
        };

        this._modalService.showModal(DatePickerModal, options)
            .then((dateresult: Date) => {
                if (dateresult) {
                    console.log("date result " + dateresult);
                    if (dateresult.toDateString() != 'undefined') {
                        this.FromFlightOneDate = moment(dateresult).format("YYYY-MM-DD");
                    }
                }
            });
    }
    createModelViewFrom2Date(args) {
        let that = this;
        let currentDate = this.CurDate;
        console.log(this.startDate);
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                currentDate: currentDate,
                displayHeader: true,
                minDate: moment(new Date()).subtract(1, 'years').toDate().toDateString(),
                maxDate: moment(new Date()).add(2, 'years').toDate().toDateString()
            },
            fullscreen: false
        };

        this._modalService.showModal(DatePickerModal, options)
            .then((dateresult: Date) => {
                if (dateresult) {
                    console.log("date result " + dateresult);
                    if (dateresult.toDateString() != 'undefined') {
                        this.FromFlightTwoDate = moment(dateresult).format("YYYY-MM-DD");
                    }
                }
            });
    }
    createModelViewTo1Date(args) {
        let that = this;
        let currentDate = this.CurDate;
        console.log(this.startDate);
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                currentDate: currentDate,
                displayHeader: true,
                minDate: moment(new Date()).subtract(1, 'years').toDate().toDateString(),
                maxDate: moment(new Date()).add(2, 'years').toDate().toDateString()
            },
            fullscreen: false
        };

        this._modalService.showModal(DatePickerModal, options)
            .then((dateresult: Date) => {
                if (dateresult) {
                    console.log("date result " + dateresult);
                    if (dateresult.toDateString() != 'undefined') {
                        this.ToFlightOneDate = moment(dateresult).format("YYYY-MM-DD");
                    }
                }
            });
    }
    createModelViewTo2Date(args) {
        let that = this;
        let currentDate = this.CurDate;
        console.log(this.startDate);
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                currentDate: currentDate,
                displayHeader: true,
                minDate: moment(new Date()).subtract(1, 'years').toDate().toDateString(),
                maxDate: moment(new Date()).add(2, 'years').toDate().toDateString()
            },
            fullscreen: false
        };

        this._modalService.showModal(DatePickerModal, options)
            .then((dateresult: Date) => {
                if (dateresult) {
                    console.log("date result " + dateresult);
                    if (dateresult.toDateString() != 'undefined') {
                        this.ToFlightTwoDate = moment(dateresult).format("YYYY-MM-DD");
                    }
                }
            });
    }

    selectFromFlight() {
        this.IsFromFlight = true;
        this.IsToFlight = false;
    }
    selectToFlight() {
        this.IsFromFlight = false;
        this.IsToFlight = true;
    }
    selectMonetoryEmd() {
        this.IsMonetoryEmd = true;
        this.IsHotelEmd = false;
        this.IsTransportEmd = false;
        this.IsMealEmd = false;
    }
    selectHotelEmd() {
        this.IsMonetoryEmd = false;
        this.IsHotelEmd = true;
        this.IsTransportEmd = false;
        this.IsMealEmd = false;
    }
    selectMealEmd() {
        this.IsMonetoryEmd = false;
        this.IsHotelEmd = false;
        this.IsTransportEmd = false;
        this.IsMealEmd = true;
    }
    selectTransportEmd() {
        this.IsMonetoryEmd = false;
        this.IsHotelEmd = false;
        this.IsTransportEmd = true;
        this.IsMealEmd = false;
    }
    navigateToCompensation() {
        this.routerExtensions.navigate(["compensation"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        })
    }
    save() {
        this.CompensationPassengerList.forEach((data, Index) => {
            if (data.GivenName == this.PaxItem.GivenName && data.LastName == this.PaxItem.LastName && data.OrderId == this.PaxItem.OrderId) {
                // data.ReaccomDetails = [];
                data.ReaccomDetails = [new CompensationSearchModule.ReaccomDetail()];
                data.ReaccomDetails.length = 0;
                if (this.FromFlightOneNumber != "") {
                    //  this.PaxItem.ReaccomDetails = [new CompensationSearchModule.ReaccomDetail()];
                    this.FromFlightOne.FromToFlag = "FROM";
                    this.FromFlightOne.GUIDisplayFlag = "1";
                    let reg = new RegExp('^[0-9]*$');
                    let test = reg.test(this.FromFlightOneNumber);
                    if (test == true) {
                        this.FromFlightOne.ReaccomAirlineCode = ApplicationSettings.getString("carrierCode", "");
                        this.FromFlightOne.ReaccomFlightNo = this.FromFlightOneNumber;
                    } else {
                        let stringArr: Array<string> = []
                        stringArr = this.FromFlightOneNumber.match(/[a-zA-Z]+|[0-9]+/g);
                        console.log("arr" + JSON.stringify(stringArr));
                        this.FromFlightOne.ReaccomAirlineCode = stringArr[0];
                        this.FromFlightOne.ReaccomFlightNo = stringArr[1];
                    }
                    this.FromFlightOne.ReaccomFlightDt = this.FromFlightOneDate;
                    console.log("Flight One:" + JSON.stringify(this.FromFlightOne));
                    data.ReaccomDetails.push(this.FromFlightOne);
                } if (this.FromFlightTwoNumber != "") {
                    this.FromFlightTwo.FromToFlag = "FROM";
                    this.FromFlightTwo.GUIDisplayFlag = "2";
                    let reg = new RegExp('^[0-9]*$');
                    let test = reg.test(this.FromFlightTwoNumber);
                    if (test == true) {
                        this.FromFlightTwo.ReaccomAirlineCode = ApplicationSettings.getString("carrierCode", "");
                        this.FromFlightTwo.ReaccomFlightNo = this.FromFlightTwoNumber;
                    } else {
                        let stringArr: Array<string> = []
                        stringArr = this.FromFlightTwoNumber.match(/[a-zA-Z]+|[0-9]+/g);
                        console.log("arr" + JSON.stringify(stringArr));
                        this.FromFlightTwo.ReaccomAirlineCode = stringArr[0];
                        this.FromFlightTwo.ReaccomFlightNo = stringArr[1];
                    }
                    this.FromFlightTwo.ReaccomFlightDt = this.FromFlightTwoDate;
                    data.ReaccomDetails.push(this.FromFlightTwo);
                } if (this.ToFlightOneNumber != "") {
                    this.ToFlightOne.FromToFlag = "TO";
                    this.ToFlightOne.GUIDisplayFlag = "3";
                    let reg = new RegExp('^[0-9]*$');
                    let test = reg.test(this.ToFlightOneNumber);
                    if (test == true) {
                        this.ToFlightOne.ReaccomAirlineCode = ApplicationSettings.getString("carrierCode", "");
                        this.ToFlightOne.ReaccomFlightNo = this.ToFlightOneNumber;
                    } else {
                        let stringArr: Array<string> = []
                        stringArr = this.ToFlightOneNumber.match(/[a-zA-Z]+|[0-9]+/g);
                        console.log("arr" + JSON.stringify(stringArr));
                        this.ToFlightOne.ReaccomAirlineCode = stringArr[0];
                        this.ToFlightOne.ReaccomFlightNo = stringArr[1];
                    }
                    this.ToFlightOne.ReaccomFlightDt = this.ToFlightOneDate;
                    data.ReaccomDetails.push(this.ToFlightOne);
                    // this.PaxItem.ReaccomDetails = data.ReaccomDetails;
                } if (this.ToFlightTwoNumber != "") {
                    this.ToFlightTwo.FromToFlag = "TO";
                    this.ToFlightTwo.GUIDisplayFlag = "4";
                    let reg = new RegExp('^[0-9]*$');
                    let test = reg.test(this.ToFlightTwoNumber);
                    if (test == true) {
                        this.ToFlightTwo.ReaccomAirlineCode = ApplicationSettings.getString("carrierCode", "");
                        this.ToFlightTwo.ReaccomFlightNo = this.ToFlightTwoNumber;
                    } else {
                        let stringArr: Array<string> = []
                        stringArr = this.ToFlightTwoNumber.match(/[a-zA-Z]+|[0-9]+/g);
                        console.log("arr" + JSON.stringify(stringArr));
                        this.ToFlightTwo.ReaccomAirlineCode = stringArr[0];
                        this.ToFlightTwo.ReaccomFlightNo = stringArr[1];
                    }
                    this.ToFlightTwo.ReaccomFlightDt = this.ToFlightTwoDate;
                    data.ReaccomDetails.push(this.ToFlightTwo);
                }
                this.PaxItem.ReaccomDetails = data.ReaccomDetails;
                if (this.PaxItem.CustomerCareCaseNum != "") {
                    data.CustomerCareCaseNum = this.PaxItem.CustomerCareCaseNum;
                }
                if (this.PaxItem.WorldTracerNum != "") {
                    data.WorldTracerNum = this.PaxItem.WorldTracerNum;
                }
                if (this.PaxItem.monetaryfreeText != "") {
                    data.monetaryfreeText = this.PaxItem.monetaryfreeText;
                }
                if (this.PaxItem.hotelFreeText != "") {
                    data.hotelFreeText = this.PaxItem.hotelFreeText;
                }
                if (this.PaxItem.hotelDetails != "") {
                    data.hotelDetails = this.PaxItem.hotelDetails;
                }
                if (this.PaxItem.mealFreeText != "") {
                    data.mealFreeText = this.PaxItem.mealFreeText;
                }
                if (this.PaxItem.mealDetails != "") {
                    data.mealDetails = this.PaxItem.mealDetails;
                }
                if (this.PaxItem.transportFreeText != "") {
                    data.transportFreeText = this.PaxItem.transportFreeText;
                }
                if (this.PaxItem.transportEMD != "") {
                    data.transportEMD = this.PaxItem.transportEMD;
                }
            }
            if (this.PaxItem.copyToSelectedPax == true) {
                this.CompensationPassengerList.forEach((paxData, paxIndex) => {

                    this.selectedPassenger.forEach((seldata, Index) => {
                        if (paxData.GivenName == seldata.GivenName && paxData.LastName == seldata.LastName && paxData.OrderId == seldata.OrderId) {
                            paxData.copyToSelectedPax = true;
                            paxData.hotelFreeText = this.PaxItem.hotelFreeText;
                            paxData.monetaryfreeText = this.PaxItem.monetaryfreeText;
                            paxData.mealFreeText = this.PaxItem.mealFreeText;
                            paxData.transportFreeText = this.PaxItem.transportFreeText;
                            paxData.mealDetails = this.PaxItem.mealDetails;
                            paxData.hotelDetails = this.PaxItem.hotelDetails;
                            paxData.transportEMD = this.PaxItem.transportEMD;
                        }
                    })
                })
            }
            // console.log("R@:" + JSON.stringify(data.ReaccomDetails));
            if (this.PaxItem.copyToSelectedPaxReaccom == true) {
                this.CompensationPassengerList.forEach((paxData, paxIndex) => {
                    this.selectedPassenger.forEach((seldata, Index) => {
                        if (paxData.GivenName == seldata.GivenName && paxData.LastName == seldata.LastName && paxData.OrderId == seldata.OrderId) {
                            paxData.copyToSelectedPaxReaccom = true;
                            console.log("V:" + JSON.stringify(data.ReaccomDetails));
                            paxData.ReaccomDetails = this.PaxItem.ReaccomDetails;
                        }
                    })
                })
            }

        });
        this._shared.setCompensationPaxList(this.CompensationPassengerList);
        this.navigateBack();
    }
    clearFrom1FlightInfo() {
        this.FromFlightOneNumber = "";
        this.FromFlightOne.ReaccomBoardCityCd = "";
        this.FromFlightOne.ReaccomOffCityCd = "";
        this.FromFlightOneDate = "";
    }
    clearFrom2FlightInfo() {
        this.FromFlightTwoNumber = "";
        this.FromFlightTwo.ReaccomBoardCityCd = "";
        this.FromFlightTwo.ReaccomOffCityCd = "";
        this.FromFlightTwoDate = "";
    }
    clearTo1FlightInfo() {
        this.ToFlightOneNumber = "";
        this.ToFlightOne.ReaccomBoardCityCd = "";
        this.ToFlightOne.ReaccomOffCityCd = "";
        this.ToFlightOneDate = "";
        this.onChange(this.ToFlightOneNumber,1)
    }
    clearTo2FlightInfo() {
        this.ToFlightTwoNumber = "";
        this.ToFlightTwo.ReaccomBoardCityCd = "";
        this.ToFlightTwo.ReaccomOffCityCd = "";
        this.ToFlightTwoDate = "";
    }
    navigateBack() {
        this.routerExtensions.back();
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
        }
    }
}
