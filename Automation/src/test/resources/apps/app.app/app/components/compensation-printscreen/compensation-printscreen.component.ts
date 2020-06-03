//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { Page } from "ui/page";
import dialogs = require("ui/dialogs");
import { ScrollView } from "ui/scroll-view";
import { ListView } from "ui/list-view";
import { View } from "ui/core/view";
import textField = require("ui/text-field");
import * as gestures from "ui/gestures";
import { SegmentedBar, SegmentedBarItem } from "ui/segmented-bar";
import * as imageModule from "image-source";
import * as fs from "file-system";

//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as moment from "moment";
import * as Toast from 'nativescript-toast';
import * as zebra from "nativescript-print-zebra";

//app references
import { LoaderProgress, PassengerListTemplate, PassengerList, AccontProfileModel, CompensationSearchModule, CompensationReasonModule } from "../../shared/interface/index"
import { DataService, CheckinOrderService, PassengerService, CompensationService } from "../../shared/services/index";
import { Order, CountryCollection, FlightServiceInfo, Flight, Search, AccountProfile, APISDocument, Compansation, CompensationPaxList, AgentPrivilage, PrintModule } from "../../shared/model/index";
import { Converters } from "../../shared/utils/index";
import { DatePickerModal, DatePicketContext } from "../../components/date-picker/date-picker-modal";
import { Configuration } from '../../app.constants';
import { AppExecutiontime } from "../../app.executiontime";
import { isAndroid, isIOS, device, screen } from "platform";
import { FQTV } from "../../shared/model/index"
import { TimeOutService } from "../../shared/services/timeOut.service";


@Component({
    selector: "compensation-printscreen",
    providers: [DataService, PassengerService, Configuration, CompensationService],
    templateUrl: "./components/compensation-printscreen/compensation-printscreen.component.html",
    styleUrls: ["./components/compensation-printscreen/compensation-printscreen.component.css"]

})

export class CompensationPrintScreenComponent implements OnInit {
    @ViewChild('pagecontainer') pageCont: ElementRef;
    @ViewChild('segbar') segbar: ElementRef;
    public apisdetails: Array<SegmentedBarItem>;
    public firsttab = new SegmentedBarItem();
    public secondtab = new SegmentedBarItem();
    public isError: boolean;
    public errorMessage: string;
    public loaderProgress: LoaderProgress;
    public startDate: Date;
    public SearchFields: Search = new Search();
    public CurDate: Date;
    public userdetails: any;
    public ComensationReason: any;
    public CompensationReason: Array<string> = [];
    public SelectAllPax: boolean = false;
    public SelectAllPaxVar: boolean = false;
    public checkedCount: number = 0;
    public EmailId: any = "";
    public EmailIdSelectedPax: any = "";
    public isEmailCopytoSelectPaxTrue: boolean = false;
    public PreviousPage: string = "";
    public totalIssuedMonetary: number = 0;
    public totalIssuedHotel: number = 0;
    public totalIssuedMeal: number = 0;
    public totalIssuedTransport: number = 0;
    public totalNotIssuedMonetary: number = 0;
    public totalNotIssuedHotel: number = 0;
    public totalNotIssuedMeal: number = 0;
    public totalNotIssuedTransport: number = 0;
    public nameSortIndicator: number = -1;
    public ssrSortIndicator: number = -1;
    public TotalPassengerCount: number = 0;
    public selectedPassengerCount: number = 0;
    public isEmailEnabled: boolean = false;
    public classSortIndicator: number = -1;
    public orderIdSortIndicator: number = -1;
    public SearchCriteria: any = "Name";
    public tierSortIndicator: number = -1;
    public CompensationIssuedList: boolean = true;
    public CompensationNotIssuedList: boolean = false;
    public isEmailNotAvailable: boolean = false;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    public searchField: any;
    public selectedPassenger: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public SelectedPassenger: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public ComPaxPrintFullList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public ComPaxNotPrintFullList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public FlightHeaderInfo: CompensationSearchModule.FlightModel = new CompensationSearchModule.FlightModel();
    public PaxList: CompensationSearchModule.CompensationRootObject = new CompensationSearchModule.CompensationRootObject();
    public CompPaxList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompPaxListIssued: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompPaxListNotIssued: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public static NOBLUETOOTHDEVICE: string = "No Bluetooth Printer Found. Please set the Printer in Settings Page";
    public static UNABLETOPRINT: string = "Unable to Print";
    public static PRINTERSESSION: string = "Unable to connect to printer session, try again later";
    constructor(private _configuration: Configuration, private _services: PassengerService, private activatedRouter: ActivatedRoute, private _shared: CheckinOrderService, private page: Page, private routerExtensions: RouterExtensions, public _timeoutService: TimeOutService, private router: Router, public _dataService: DataService, public _service: CompensationService, private route: ActivatedRoute, private vcRef: ViewContainerRef, private _modalService: ModalDialogService) {
        this.isError = false;
        this.errorMessage = "";
        this.SearchFields.FlightDate = moment().format("DD MMMM YYYY");
        this.CurDate = moment().toDate();
        this.startDate = new Date();
        this.apisdetails = [];

        this.firsttab.title = "EMD Printed";
        this.apisdetails.push(this.firsttab);

        this.secondtab.title = "EMD Available for Print";
        this.apisdetails.push(this.secondtab);
        this.loaderProgress = new LoaderProgress();
    }
    ngOnInit() {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.ComensationReason = "Select Reason";
        this.loaderProgress.initLoader(this.pageCont);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.PaxList = this._shared.getCompensationList();
        this.CompPaxList = this.PaxList.PassengerList.filter(m => m.IsCompensationIssued == true);
        // this.CompPaxList = this.PaxList.PassengerList;
        this._shared.setCompensationPaxList(this.CompPaxList);
        this._shared.setFlightHeaderInfo(this.PaxList.FlightModel);
        console.log("Pax List:" + JSON.stringify(this.CompPaxList));
        this.FlightHeaderInfo = this.PaxList.FlightModel;
        this.activatedRouter.queryParams.subscribe((params) => {
            if (params["selectedPAx"] != null &&
                params["selectedPAx"] != "" &&
                params["selectedPAx"] != "undefined") {
                this.selectedPassenger = JSON.parse(params["selectedPAx"]);
            }
        })
        this.activatedRouter.queryParams.subscribe((params) => {
            if (params["prepage"] != null &&
                params["prepage"] != "" &&
                params["prepage"] != "undefined") {
                this.PreviousPage = params["prepage"];
            }
        })
        console.dir(this.selectedPassenger);
        console.log("V:" + JSON.stringify(this.PreviousPage));
        this.CompPaxList.forEach((compData, Index) => {
            compData.Compensations.forEach((exiEMD, exiIndex) => {
                if (compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds) {
                    compData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                }
                else {
                    compData.monetarycount = 0;
                }
                if (exiEMD.Emds) {
                    exiEMD.Emds.forEach((emdData, emdIndex) => {
                        // if (exiEMD.CompTypeText != "Monetary") {
                        if (emdData.PrintStatus == "n") {
                            compData.isNotPrinted = true;
                        }
                        if (emdData.EmailStatus == "y") {
                            compData.isEmailSent = true;
                        }
                        // }
                    })
                }
            })
            if (compData.isNotPrinted == true) {
                compData.Compensations.forEach((exiEMD, exiIndex) => {
                    if (exiEMD.Emds) {
                        exiEMD.Emds.forEach((emdData, emdIndex) => {
                            if (emdData.PrintStatus == "y") {
                                compData.isParitallyPrinted = true;
                            }
                        })
                    }
                    if (exiEMD.CompTypeText == "Monetary") {
                        if (exiEMD.Emds) {
                            exiEMD.Emds.forEach((emdData, emdIndex) => {
                                if (emdData.PrintStatus == "y" && exiEMD.Emds.filter(m => m.PrintStatus == "y").length < exiEMD.Emds.length) {
                                    console.log(exiEMD.Emds.length);
                                    console.log(exiEMD.Emds.filter(m => m.PrintStatus == "y").length);
                                    compData.isParitallyPrinted = true;
                                    compData.monetaryPrintStatus = true;
                                    compData.isMonetaryParitallyPrinted = true;
                                    compData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                                }
                            })

                        }
                    }

                });
                if (compData.isParitallyPrinted == true) {
                    console.log("isParitallyPrinted Printed" + compData.FullName);
                    let paxData = new CompensationSearchModule.CompensationPassengerList();
                    paxData.FlightSegmentId = compData.FlightSegmentId;
                    paxData.PassengerSeq = compData.PassengerSeq;
                    paxData.OrderId = compData.OrderId;
                    paxData.GivenName = compData.GivenName;
                    paxData.LastName = compData.LastName;
                    paxData.FullName = compData.LastName + "/" + compData.GivenName;
                    paxData.PaxType = compData.PaxType;
                    paxData.FqtvCc = compData.FqtvCc;
                    paxData.FqtvNumber = compData.FqtvNumber;
                    paxData.PaxStatus = compData.PaxStatus;
                    paxData.PaxEmailAddress = compData.PaxEmailAddress;
                    paxData.CompensationReasonId = compData.CompensationReasonId;
                    paxData.IsExistingCompensation = compData.IsExistingCompensation;
                    paxData.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                    paxData.WorldTracerNum = compData.WorldTracerNum;
                    paxData.UpdateLockNbr = compData.UpdateLockNbr;
                    paxData.FqtvTier = compData.FqtvTier;
                    paxData.Cabin = compData.Cabin;
                    paxData.PaxRPH = compData.PaxRPH;
                    paxData.Origin = compData.Origin;
                    paxData.Dest = compData.Dest;
                    paxData.IsCompensationIssued = compData.IsCompensationIssued;
                    paxData.SSR = compData.SSR;
                    paxData.Etkt = compData.Etkt;
                    paxData.ReaccomDetails = compData.ReaccomDetails;
                    paxData.AdditionalDetails = compData.AdditionalDetails;
                    paxData.monetary = compData.monetary;
                    paxData.monetaryPrintStatus = compData.monetaryPrintStatus;
                    paxData.Compensations = compData.Compensations;
                    paxData.ExistingCompensations = compData.ExistingCompensations;
                    paxData.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                    paxData.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                    paxData.mealendorsementTextItems = compData.mealendorsementTextItems;
                    paxData.mealFreeText = compData.mealFreeText;
                    paxData.mealDetails = compData.mealDetails;
                    paxData.MealOverrideReason = compData.MealOverrideReason;
                    paxData.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                    paxData.hotelFreeText = compData.hotelFreeText;
                    paxData.HotelOverrideReason = compData.HotelOverrideReason;
                    paxData.hotelDetails = compData.hotelDetails;
                    paxData.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                    paxData.transportFreeText = compData.transportFreeText;
                    paxData.transportEMD = compData.transportEMD;
                    paxData.TransportOverrideReason = compData.TransportOverrideReason;
                    paxData.monetaryEmailStatus = compData.monetaryEmailStatus;
                    paxData.Email = compData.Email;
                    paxData.isEmailSent = compData.isEmailSent;
                    paxData.isEmailParitallySent = compData.isEmailParitallySent;
                    console.log("New Inside:" + compData.isParitallyPrinted);
                    paxData.monetaryPrintStatus = compData.monetaryPrintStatus;
                    paxData.isParitallyPrinted = compData.isParitallyPrinted;
                    paxData.isMonetaryParitallyPrinted = compData.isMonetaryParitallyPrinted;
                    paxData.isMealParitallyPrinted = compData.isMealParitallyPrinted;
                    paxData.isHotelsParitallyPrinted = compData.isHotelsParitallyPrinted;
                    paxData.isTransportParitallyPrinted = compData.isTransportParitallyPrinted;
                    paxData.monetarycount = compData.monetarycount;
                    // if(compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds){
                    //     paxData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                    // }
                    compData.Compensations.forEach((newcompData, Index) => {
                        if (newcompData.Emds) {
                            if (newcompData.CompTypeText == "Hotel") {
                                paxData.hotel = newcompData.Emds.filter(m => m.PrintStatus == "y").length;
                                if (paxData.hotel > 0) {
                                    paxData.hotelPrintStatus = true;
                                }
                            }
                            if (newcompData.CompTypeText == "Meal") {
                                paxData.meal = newcompData.Emds.filter(m => m.PrintStatus == "y").length;
                                if (paxData.meal > 0) {
                                    paxData.mealPrintStatus = true;
                                }
                            }
                            // paxData.mealPrintStatus = false;
                            if (newcompData.CompTypeText == "Transportation") {
                                paxData.transportation = newcompData.Emds.filter(m => m.PrintStatus == "y").length;
                                if (paxData.transportation > 0) {
                                    paxData.transportPrintStatus = true;
                                }
                            }
                        }
                    })
                    if (compData.isEmailSent == true) {
                        compData.Compensations.forEach((exiEMD, exiIndex) => {
                            if (exiEMD.Emds) {
                                exiEMD.Emds.forEach((emdData, emdIndex) => {
                                    if (emdData.EmailStatus == "n") {
                                        paxData.isEmailSent = true;
                                        paxData.monetaryEmailStatus = true;
                                        paxData.isEmailParitallySent = true;
                                    }
                                })

                            }
                        });
                    }
                    this.CompPaxList.push(paxData);
                    this.CompPaxListIssued.push(paxData);
                    paxData.monetaryPrintStatus = compData.monetaryPrintStatus;
                    compData.Compensations.forEach((newcompData, Index) => {
                        if (newcompData.Emds) {
                            if (newcompData.CompTypeText == "Hotel") {
                                compData.hotel = newcompData.Emds.filter(m => m.PrintStatus == "n").length;
                                compData.hotelPrintStatus = false;
                            }
                            if (newcompData.CompTypeText == "Meal") {
                                compData.meal = newcompData.Emds.filter(m => m.PrintStatus == "n").length;
                                compData.mealPrintStatus = false;
                            }
                            if (newcompData.CompTypeText == "Transportation") {
                                compData.transportation = newcompData.Emds.filter(m => m.PrintStatus == "n").length;
                                compData.transportPrintStatus = false;
                            }
                        }
                    })
                    if (compData.isEmailSent == true) {
                        compData.Compensations.forEach((exiEMD, exiIndex) => {
                            if (exiEMD.Emds) {
                                exiEMD.Emds.forEach((emdData, emdIndex) => {
                                    if (emdData.EmailStatus == "n") {
                                        compData.isEmailSent = true;
                                        compData.monetaryEmailStatus = true;
                                        compData.isEmailParitallySent = true;
                                    }
                                })

                            }
                        });
                    }
                    this.CompPaxListNotIssued.push(compData);
                } else {
                    console.log("Not Printed" + compData.FullName);
                    if (compData.isEmailSent == true) {
                        compData.Compensations.forEach((exiEMD, exiIndex) => {
                            if (exiEMD.Emds) {
                                exiEMD.Emds.forEach((emdData, emdIndex) => {
                                    if (emdData.EmailStatus == "n" && exiEMD.Emds.filter(m => m.EmailStatus == "y").length < exiEMD.Emds.length) {
                                        console.log("in here");
                                        compData.isEmailSent = true;
                                        compData.monetaryEmailStatus = true;
                                        compData.isEmailParitallySent = true;
                                    }
                                })

                            }
                        });
                    }
                    this.CompPaxListNotIssued.push(compData);
                }

            } else {
                console.log("Printed" + compData.FullName);
                if (compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds) {
                    compData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                }
                else {
                    compData.monetarycount = 0;
                }
                if (compData.isEmailSent == true) {
                    compData.Compensations.forEach((exiEMD, exiIndex) => {
                        if (exiEMD.Emds) {
                            exiEMD.Emds.forEach((emdData, emdIndex) => {
                                if (emdData.EmailStatus == "n") {
                                    compData.isEmailSent = true;
                                    compData.monetaryEmailStatus = true;
                                    compData.isEmailParitallySent = true;
                                }
                            })

                        }
                    });
                }
                this.CompPaxListIssued.push(compData);
                if (compData.monetary > 0) {
                    console.log("Printed monetary > 0" + compData.FullName);
                    let paxData = new CompensationSearchModule.CompensationPassengerList();
                    paxData.FlightSegmentId = compData.FlightSegmentId;
                    paxData.PassengerSeq = compData.PassengerSeq;
                    paxData.OrderId = compData.OrderId;
                    paxData.GivenName = compData.GivenName;
                    paxData.LastName = compData.LastName;
                    paxData.FullName = compData.LastName + "/" + compData.GivenName;
                    paxData.PaxType = compData.PaxType;
                    paxData.FqtvCc = compData.FqtvCc;
                    paxData.FqtvNumber = compData.FqtvNumber;
                    paxData.PaxStatus = compData.PaxStatus;
                    paxData.PaxEmailAddress = compData.PaxEmailAddress;
                    paxData.CompensationReasonId = compData.CompensationReasonId;
                    paxData.IsExistingCompensation = compData.IsExistingCompensation;
                    paxData.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                    paxData.WorldTracerNum = compData.WorldTracerNum;
                    paxData.UpdateLockNbr = compData.UpdateLockNbr;
                    paxData.FqtvTier = compData.FqtvTier;
                    paxData.Cabin = compData.Cabin;
                    paxData.PaxRPH = compData.PaxRPH;
                    paxData.Origin = compData.Origin;
                    paxData.Dest = compData.Dest;
                    paxData.IsCompensationIssued = compData.IsCompensationIssued;
                    paxData.SSR = compData.SSR;
                    paxData.Etkt = compData.Etkt;
                    paxData.ReaccomDetails = compData.ReaccomDetails;
                    paxData.AdditionalDetails = compData.AdditionalDetails;
                    paxData.monetary = compData.monetary;
                    paxData.monetaryPrintStatus = compData.monetaryPrintStatus;
                    paxData.Compensations = compData.Compensations;
                    paxData.ExistingCompensations = compData.ExistingCompensations;
                    paxData.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                    paxData.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                    paxData.mealendorsementTextItems = compData.mealendorsementTextItems;
                    paxData.mealFreeText = compData.mealFreeText;
                    paxData.mealDetails = compData.mealDetails;
                    paxData.MealOverrideReason = compData.MealOverrideReason;
                    paxData.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                    paxData.hotelFreeText = compData.hotelFreeText;
                    paxData.HotelOverrideReason = compData.HotelOverrideReason;
                    paxData.hotelDetails = compData.hotelDetails;
                    paxData.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                    paxData.transportFreeText = compData.transportFreeText;
                    paxData.transportEMD = compData.transportEMD;
                    paxData.TransportOverrideReason = compData.TransportOverrideReason;
                    paxData.monetaryEmailStatus = compData.monetaryEmailStatus;
                    paxData.hotel = 0;
                    paxData.hotelPrintStatus = false;
                    paxData.meal = 0;
                    paxData.mealPrintStatus = false;
                    paxData.transportation = 0;
                    paxData.transportPrintStatus = false;
                    paxData.Email = compData.Email;
                    paxData.isEmailSent = compData.isEmailSent;
                    paxData.isParitallyPrinted = compData.isParitallyPrinted;
                    if (paxData.isParitallyPrinted) {
                        paxData.monetaryPrintStatus = true;
                    }
                    if (compData.isEmailSent == true) {
                        compData.Compensations.forEach((exiEMD, exiIndex) => {
                            if (exiEMD.Emds) {
                                exiEMD.Emds.forEach((emdData, emdIndex) => {
                                    if (emdData.EmailStatus == "n") {
                                        paxData.isEmailSent = true;
                                        paxData.monetaryEmailStatus = true;
                                        paxData.isEmailParitallySent = true;
                                    }
                                })

                            }
                        });
                    }
                    paxData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                    this.CompPaxList.push(paxData);
                    this.CompPaxListNotIssued.push(paxData);
                }
            }
            if (compData.isEmailSent == true && compData.isNotPrinted == true && compData.isParitallyPrinted == false) {
                console.log("isEmailSent && isNotPrinted" + compData.FullName);
                let paxData = new CompensationSearchModule.CompensationPassengerList();
                paxData.isEmailSent = compData.isEmailSent;
                paxData.monetaryEmailStatus = compData.monetaryEmailStatus;
                compData.Compensations.forEach((exiEMD, exiIndex) => {
                    if (exiEMD.Emds) {
                        exiEMD.Emds.forEach((emdData, emdIndex) => {
                            console.log("in here isEmailSent && isNotPrinted 1:" + compData.FullName + JSON.stringify(exiEMD.Emds.filter(m => m.EmailStatus == "n").length));
                            console.log("in here isEmailSent && isNotPrinted 2:" + compData.FullName + JSON.stringify(exiEMD.Emds.length));
                            if (emdData.EmailStatus == "n" && exiEMD.Emds.filter(m => m.EmailStatus == "n").length < exiEMD.Emds.length) {
                                paxData.isEmailSent = true;
                                paxData.monetaryEmailStatus = true;
                                paxData.isEmailParitallySent = true;
                            }
                        })

                    }
                });
                paxData.FlightSegmentId = compData.FlightSegmentId;
                paxData.PassengerSeq = compData.PassengerSeq;
                paxData.OrderId = compData.OrderId;
                paxData.GivenName = compData.GivenName;
                paxData.LastName = compData.LastName;
                paxData.FullName = compData.LastName + "/" + compData.GivenName;
                paxData.PaxType = compData.PaxType;
                paxData.FqtvCc = compData.FqtvCc;
                paxData.FqtvNumber = compData.FqtvNumber;
                paxData.PaxStatus = compData.PaxStatus;
                paxData.PaxEmailAddress = compData.PaxEmailAddress;
                paxData.CompensationReasonId = compData.CompensationReasonId;
                paxData.IsExistingCompensation = compData.IsExistingCompensation;
                paxData.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                paxData.WorldTracerNum = compData.WorldTracerNum;
                paxData.UpdateLockNbr = compData.UpdateLockNbr;
                paxData.FqtvTier = compData.FqtvTier;
                paxData.Cabin = compData.Cabin;
                paxData.PaxRPH = compData.PaxRPH;
                paxData.Origin = compData.Origin;
                paxData.Dest = compData.Dest;
                paxData.IsCompensationIssued = compData.IsCompensationIssued;
                paxData.SSR = compData.SSR;
                paxData.Etkt = compData.Etkt;
                paxData.ReaccomDetails = compData.ReaccomDetails;
                paxData.AdditionalDetails = compData.AdditionalDetails;
                paxData.monetary = compData.monetary;
                paxData.monetaryPrintStatus = compData.monetaryPrintStatus;
                paxData.Compensations = compData.Compensations;
                paxData.ExistingCompensations = compData.ExistingCompensations;
                paxData.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                paxData.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                paxData.mealendorsementTextItems = compData.mealendorsementTextItems;
                paxData.mealFreeText = compData.mealFreeText;
                paxData.mealDetails = compData.mealDetails;
                paxData.MealOverrideReason = compData.MealOverrideReason;
                paxData.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                paxData.hotelFreeText = compData.hotelFreeText;
                paxData.HotelOverrideReason = compData.HotelOverrideReason;
                paxData.hotelDetails = compData.hotelDetails;
                paxData.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                paxData.transportFreeText = compData.transportFreeText;
                paxData.transportEMD = compData.transportEMD;
                paxData.TransportOverrideReason = compData.TransportOverrideReason;
                // paxData.monetaryEmailStatus = compData.monetaryEmailStatus;
                paxData.hotel = 0;
                paxData.hotelPrintStatus = false;
                paxData.meal = 0;
                paxData.mealPrintStatus = false;
                paxData.transportation = 0;
                paxData.transportPrintStatus = false;
                paxData.Email = compData.Email;
                paxData.isParitallyPrinted = compData.isParitallyPrinted;
                paxData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                console.log("Email :" + JSON.stringify(paxData));
                this.CompPaxList.push(paxData);
                this.CompPaxListIssued.push(paxData);

            }
        })
        // console.log("Email 1:" + JSON.stringify(this.CompPaxList));
        // console.log("Email 2:" + JSON.stringify(this.CompPaxListIssued));
        // console.log("Email 3:" + JSON.stringify(this.CompPaxListNotIssued));
        this.apisdetails = [];
        this.ComPaxPrintFullList = this.CompPaxListIssued;
        this.firsttab.title = "EMD Printed" + "(" + this.CompPaxListIssued.length + ")";
        this.apisdetails.push(this.firsttab);
        this.ComPaxNotPrintFullList = this.CompPaxListNotIssued;
        this.secondtab.title = "EMD Available for Print" + "(" + this.CompPaxListNotIssued.length + ")";
        this.apisdetails.push(this.secondtab);
    }
    public selectSegment(e: any) {
        console.dir(e);
        var selInd = e.newIndex;
        this.SelectedPassenger = [];
        if (selInd == 0) {
            this.totalIssuedMonetary = 0;
            this.totalIssuedHotel = 0;
            this.totalIssuedMeal = 0;
            this.totalIssuedTransport = 0;
            this.CompensationIssuedList = true;
            this.CompensationNotIssuedList = false;
            this.SelectAllPax = false;
            this.SearchCriteria = "Name";
            this.searchField = undefined;
            this.CompPaxListNotIssued.forEach((data, Index) => {
                data.IsSelected = false;
            })
            this.CompPaxListIssued.forEach((compData, Index) => {
                this.totalIssuedMonetary = this.totalIssuedMonetary + Number(compData.monetary);
                this.totalIssuedHotel += Number(compData.hotel);
                this.totalIssuedMeal += Number(compData.meal);
                this.totalIssuedTransport += Number(compData.transportation);
            });
            this.CompPaxList = this.ComPaxPrintFullList;
            this.selectedPassengerCount = 0;
            this.TotalPassengerCount = this.ComPaxPrintFullList.length;
            console.log("Issued" + this.CompPaxListIssued.length);
        } else {
            this.CompensationIssuedList = false;
            this.CompensationNotIssuedList = true;
            this.SearchCriteria = "Name";
            this.searchField = undefined;
            this.totalNotIssuedMonetary = 0;
            this.totalNotIssuedHotel = 0;
            this.totalNotIssuedMeal = 0;
            this.totalNotIssuedTransport = 0;
            this.CompPaxListNotIssued.forEach((compData, Index) => {
                this.totalNotIssuedMonetary = this.totalNotIssuedMonetary + Number(compData.monetary);
                this.totalNotIssuedHotel += Number(compData.hotel);
                this.totalNotIssuedMeal += Number(compData.meal);
                this.totalNotIssuedTransport += Number(compData.transportation);
            });
            this.CompPaxList = this.ComPaxNotPrintFullList;
            this.selectedPassengerCount = 0;
            this.TotalPassengerCount = this.ComPaxNotPrintFullList.length;
            console.log("Not Issued" + this.CompPaxListNotIssued.length);

        }
    }
    toggleChecked(pax: CompensationSearchModule.CompensationPassengerList) {
        // if ((this.IsLabelField == true && this.CompensationNotIssuedList == true)  || this.CompensationIssuedList ==true) {
        if (this.CompensationNotIssuedList == true) {
            if (pax.IsSelected == false) {
                pax.IsSelected = true;
                if (this.isEmailCopytoSelectPaxTrue) {
                    pax.Email = this.EmailIdSelectedPax;
                }
                this.SelectedPassenger.push(pax);
                // if (this.CompPaxList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
                console.log("Len" + this.SelectedPassenger.length);
            } else {
                this.SelectedPassenger.splice(this.SelectedPassenger.indexOf(pax), 1);
                pax.IsSelected = false;
                this.SelectAllPax = false;
            }
            this.selectedPassengerCount = this.SelectedPassenger.length;
            console.log(this.SelectedPassenger);
        }
        if (this.ComPaxNotPrintFullList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
    }
    printEnabled(): boolean {
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
            return true;
        }
        else return false;
    }
    selectingAllPax() {
        if (this.SelectAllPax == false && this.SelectAllPaxVar == false) {
            this.SelectAllPaxVar = true;
            this.CompPaxList.forEach((data, index) => {
                if (!data.IsSelected) {
                    data.IsSelected = true;
                    if (this.isEmailCopytoSelectPaxTrue) {
                        data.Email = this.EmailIdSelectedPax;
                    }
                    this.SelectedPassenger.push(data);
                    // if (this.ComensationReason != "Select Reason") {
                    //     data.CompensationReason = this.ComensationReason;
                }
                // }
            })
            if (this.ComPaxNotPrintFullList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
        } else {
            this.SelectAllPaxVar = false;
            this.SelectAllPax = false;
            this.SelectedPassenger = [];
            this.CompPaxList.forEach((data, index) => {
                data.IsSelected = false;
                data.CompensationReason = "";
            })
        }

        this.selectedPassengerCount = this.SelectedPassenger.length;
    }
    emailEnabled(): boolean {
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
            this.SelectedPassenger.forEach((data, Index) => {
                if (data.monetary == 0) {
                    this.isEmailEnabled = false;
                } else {
                    this.isEmailEnabled = true;
                }
            })
        } else {
            this.isEmailEnabled = false;
        }
        if (this.isEmailEnabled == true) {
            return true;
        }
        else return false;
    }
    filter(args: any) {
        console.log("Name:" + JSON.stringify(args));
        // this.CompPaxList = this.CompensationFullPaxList;
        let segBarElm = <SegmentedBar>this.segbar.nativeElement;
        let index = segBarElm.selectedIndex;
        if (index == 0) {
            this.CompPaxListIssued = this.ComPaxPrintFullList;
            if (this.SearchCriteria == "Name") {
                if (args) {
                    let name = args.toString().toUpperCase();
                    this.CompPaxListIssued = this.CompPaxListIssued.filter(r => r.GivenName.indexOf(name.trim()) >= 0 || r.LastName.indexOf(name.trim()) >= 0);
                    this.CompPaxList = this.CompPaxListIssued;
                } else {
                    this.CompPaxListIssued = this.ComPaxPrintFullList;
                    this.CompPaxList = this.CompPaxListIssued;

                }
            } else if (this.SearchCriteria == "Order ID") {
                if (args) {
                    let name = args.toString().toUpperCase();
                    this.CompPaxListIssued = this.CompPaxListIssued.filter(r => r.OrderId.indexOf(name.trim()) >= 0);
                    this.CompPaxList = this.CompPaxListIssued;
                } else {
                    this.CompPaxListIssued = this.ComPaxPrintFullList;
                    this.CompPaxList = this.CompPaxListIssued;

                }
            } else {
                if (args) {
                    let name = args.toString().toUpperCase();
                    this.CompPaxListIssued = this.CompPaxListIssued.filter(r => r.Cabin.indexOf(name.trim()) >= 0);
                    this.CompPaxList = this.CompPaxListIssued;
                } else {
                    this.CompPaxListIssued = this.ComPaxPrintFullList;
                    this.CompPaxList = this.CompPaxListIssued;

                }
            }
            this.TotalPassengerCount = this.CompPaxListIssued.length;
        } else {
            this.CompPaxListNotIssued = this.ComPaxNotPrintFullList;
            if (this.SearchCriteria == "Name") {
                if (args) {
                    let name = args.toString().toUpperCase();
                    this.CompPaxListNotIssued = this.CompPaxListNotIssued.filter(r => r.GivenName.indexOf(name.trim()) >= 0 || r.LastName.indexOf(name.trim()) >= 0);
                    this.CompPaxList = this.CompPaxListNotIssued;
                } else {
                    this.CompPaxListNotIssued = this.ComPaxNotPrintFullList;
                    this.CompPaxList = this.CompPaxListNotIssued;

                }
            } else if (this.SearchCriteria == "Order ID") {
                if (args) {
                    let name = args.toString().toUpperCase();
                    this.CompPaxListNotIssued = this.CompPaxListNotIssued.filter(r => r.OrderId.indexOf(name.trim()) >= 0);
                    this.CompPaxList = this.CompPaxListNotIssued;
                } else {
                    this.CompPaxListNotIssued = this.ComPaxNotPrintFullList;
                    this.CompPaxList = this.CompPaxListNotIssued;

                }
            } else {
                if (args) {
                    let name = args.toString().toUpperCase();
                    this.CompPaxListNotIssued = this.CompPaxListNotIssued.filter(r => r.Cabin.indexOf(name.trim()) >= 0);
                    this.CompPaxList = this.CompPaxListNotIssued;
                } else {
                    this.CompPaxListNotIssued = this.ComPaxNotPrintFullList;
                    this.CompPaxList = this.CompPaxListNotIssued;

                }
            }
            if (this.ComPaxNotPrintFullList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
            this.TotalPassengerCount = this.CompPaxListNotIssued.length;
        }

    }
    sortBasedOnPaxName() {
        var isAsc: number = this.nameSortIndicator == 0 ? 1 : 0;
        this.nameSortIndicator = this.nameSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.CompPaxList.sort(function (a, b) {
            var val1 = a.FullName;
            var val2 = b.FullName;
            console.log(val1 + " " + val2);
            if (isAsc == 0) {
                if (val1 < val2) {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                if (val1 > val2) {
                    return -1;
                } else {
                    return 1;
                }
            }

        });
    }
    sortBasedOnSSR() {
        var isAsc: number = this.ssrSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = this.ssrSortIndicator == 0 ? 1 : 0;
        this.nameSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.CompPaxList.sort(function (a, b) {
            var val1 = a.SSR;
            var val2 = b.SSR;
            console.log(val1 + " " + val2);
            if (isAsc == 0) {
                if (val1 < val2) {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                if (val1 > val2) {
                    return -1;
                } else {
                    return 1;
                }
            }

        });
    }
    sortBasedOnTier() {
        var isAsc: number = this.tierSortIndicator == 0 ? 1 : 0;
        this.tierSortIndicator = this.tierSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.nameSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.CompPaxList.sort(function (a, b) {
            var val1 = a.Tier;
            var val2 = b.Tier;
            console.log(val1 + " " + val2);
            if (isAsc == 0) {
                if (val1 < val2) {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                if (val1 > val2) {
                    return -1;
                } else {
                    return 1;
                }
            }

        });
    }
    sortBasedOnClass() {
        var isAsc: number = this.classSortIndicator == 0 ? 1 : 0;
        this.classSortIndicator = this.classSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.nameSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.CompPaxList.sort(function (a, b) {
            var val1 = a.Cabin;
            var val2 = b.Cabin;
            console.log(val1 + " " + val2);
            if (isAsc == 0) {
                if (val1 < val2) {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                if (val1 > val2) {
                    return -1;
                } else {
                    return 1;
                }
            }

        });
    }
    sortBasedOnOrderId() {
        var isAsc: number = this.orderIdSortIndicator == 0 ? 1 : 0;
        this.orderIdSortIndicator = this.orderIdSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.nameSortIndicator = -1;
        this.CompPaxList.sort(function (a, b) {
            var val1 = a.OrderId;
            var val2 = b.OrderId;
            console.log(val1 + " " + val2);
            if (isAsc == 0) {
                if (val1 < val2) {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                if (val1 > val2) {
                    return -1;
                } else {
                    return 1;
                }
            }

        });
    }
    email(item: CompensationSearchModule.CompensationPassengerList) {
        try {
            // item.IsSelected = true;
            if (item.IsSelected) {
                this.loaderProgress.showLoader();
                var sDate = new Date();
                console.log('Get GetPassengerOrderDetails Service --------------- Start Date Time : ' + sDate);
                this._service.getEmailByOrderId(item.OrderId)
                    .subscribe(data => {
                        if (data.ID != null) {
                            let CompansationDetails: any = data;
                            if (data.Passengers != null) {
                                console.log("Email in 1");
                                data.Passengers.forEach((paxData, Index) => {
                                    if (paxData.Firstname == item.GivenName && paxData.Lastname == item.LastName) {
                                        console.log("Email in 2");
                                        if (paxData.PrimaryTickets) {
                                            console.log("etkt:" + JSON.stringify(paxData.PrimaryTickets[0].PrimaryTicketNumber));
                                            item.EtktNumbr = paxData.PrimaryTickets[0].PrimaryTicketNumber;
                                        }
                                        if (paxData.Emails.length > 0) {
                                            console.log("Email in 3");
                                            var n = paxData.Emails.length;
                                            this.EmailId = paxData.Emails[n - 1].Value;
                                            item.Email = paxData.Emails[n - 1].Value;
                                            this.EmailIdSelectedPax = paxData.Emails[n - 1].Value;
                                        } else {
                                            item.Email = ""
                                        }
                                    }
                                })
                                var options = {
                                    title: "Email",
                                    message: "* required field",
                                    okButtonText: "Save",
                                    cancelButtonText: "Copy to selected passenger & Save",
                                    neutralButtonText: "Cancel",
                                    defaultText: item.Email,
                                    inputType: dialogs.inputType.text
                                };
                                dialogs.prompt(options).then((result: dialogs.PromptResult) => {
                                    console.log("Hello, " + result.text);
                                    if (result.result != undefined) {
                                        if (result.result == true) {
                                            if (result.text.trim().length <= 0) {
                                                this.email(item);
                                            } else {
                                                var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
                                                var test = EMAIL_REGEXP.test(result.text);
                                                if (test) {
                                                    if (this.EmailId == result.text) {
                                                        item.Email = result.text;
                                                        console.log("Email:" + JSON.stringify(item.Email));
                                                    } else {
                                                        item.Email = result.text;
                                                        this.updateEmail(CompansationDetails, item);
                                                        console.log("Email:" + JSON.stringify(item.Email));
                                                    }
                                                } else {
                                                    Toast.makeText("Enter a valid email address").show();
                                                    this.email(item);
                                                }

                                            }
                                        } else {
                                            if (result.text.trim().length <= 0) {
                                                this.email(item);
                                            } else {
                                                var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
                                                var test = EMAIL_REGEXP.test(result.text);
                                                if (test) {
                                                    if (this.EmailId == result.text) {
                                                        item.Email = result.text;
                                                        this.isEmailCopytoSelectPaxTrue = true;
                                                        this.EmailIdSelectedPax = result.text;
                                                        item.Email = result.text;
                                                        this.SelectedPassenger.forEach((data, Index) => {
                                                            data.Email = this.EmailIdSelectedPax;
                                                        })
                                                        console.log("Email:" + JSON.stringify(item.Email));
                                                    } else {
                                                        this.isEmailCopytoSelectPaxTrue = true;
                                                        item.Email = result.text;
                                                        this.EmailIdSelectedPax = result.text;
                                                        this.SelectedPassenger.forEach((data, Index) => {
                                                            data.Email = this.EmailIdSelectedPax;
                                                        })
                                                        this.updateEmail(CompansationDetails, item);
                                                        console.log("Email:" + JSON.stringify(item.Email));
                                                    }
                                                } else {
                                                    Toast.makeText("Enter a valid email address").show();
                                                    this.email(item);
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                            console.dir(CompansationDetails);
                            var eDate = new Date();
                            this.loaderProgress.hideLoader();
                            console.log('Get GetPassengerOrderDetails Service --------------- End Date Time : ' + eDate);
                            console.log('Get GetPassengerOrderDetails Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
                        } else {
                            Toast.makeText("No Reservation found").show();
                            this.loaderProgress.hideLoader();
                        }

                    },
                        err => {
                            Toast.makeText(err).show();
                            console.log("Couldnt find information" + err);
                            this.handleServiceError(err);
                            this.loaderProgress.hideLoader();
                        });
            }
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    }
    updateEmail(orderResposne: any, item: CompensationSearchModule.CompensationPassengerList) {
        try {
            this.loaderProgress.showLoader();
            var startDate = new Date();
            var CurDate = moment(startDate).format("YYYY-MM-DD");
            console.log(CurDate)
            this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
            let EmailCompensationStructure = Converters.convertToUpdateEmailId(item, orderResposne);
            console.log("Email Req:" + JSON.stringify(EmailCompensationStructure));
            if (EmailCompensationStructure != null) {
                this._service.updateEmailId(item.OrderId, EmailCompensationStructure).subscribe((data) => {
                    console.log("Email Res:" + JSON.stringify(data));
                    if (data.BadRequest == 400) {
                        Toast.makeText(data.ErrorMessage).show();
                        this.loaderProgress.hideLoader();
                    } else {
                        if (data.Success) {
                            this.loaderProgress.hideLoader();
                            Toast.makeText("Email updated successfully").show();
                        } else {
                            Toast.makeText("Email Not updated").show();
                            this.loaderProgress.hideLoader();
                        }
                    }
                }, err => {
                    Toast.makeText(err).show();
                    this.handleServiceError(err);
                    this.loaderProgress.hideLoader();
                })
            } else {
                Toast.makeText("Monetary not avilable").show();
                this.loaderProgress.hideLoader();
            }
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    }
    sendEmail() {
        try {
            this.loaderProgress.showLoader();
            var startDate = new Date();
            var CurDate = moment(startDate).format("YYYY-MM-DD");
            console.log(CurDate)
            this.isEmailNotAvailable = false;
            this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
            var paxName: string;
            this.SelectedPassenger.forEach((data, Index) => {
                if (data.Email == null || data.Email == "") {
                    this.isEmailNotAvailable = true;
                    paxName = data.FullName;
                }
            });
            if (!this.isEmailNotAvailable) {
                let EmailCompensationStructure = Converters.convertToEmailCompensation(this.SelectedPassenger, this.FlightHeaderInfo);
                console.log("Email Req:" + JSON.stringify(EmailCompensationStructure));
                if (EmailCompensationStructure != null) {
                    this._service.PostEmailCompensation(EmailCompensationStructure).subscribe((data) => {
                        console.log("Email Res:" + JSON.stringify(data));
                        if (data.Success) {
                            this.loaderProgress.hideLoader();
                            Toast.makeText("Email Sent Successfully").show();
                            this.getCompensationList(this.FlightHeaderInfo.DepartureDate, this.FlightHeaderInfo.FlightNumber, this.SelectedPassenger[0].Origin, "ReasonWiseGet");
                        } else {
                            this.loaderProgress.hideLoader();
                        }
                    }, err => {
                        this.handleServiceError(err);
                        this.loaderProgress.hideLoader();
                    })
                } else {
                    Toast.makeText("Monetary not avilable").show();
                    this.loaderProgress.hideLoader();
                }
            } else {
                Toast.makeText(paxName + " :Email ID is not available").show();
                this.loaderProgress.hideLoader();
            }

        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    }
    getCompensationList(date, flight, location, paxtype): void {
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetPassengerType Service --------------- Start Date Time : ' + sDate);
            this._service.getCompensationPaxList(date, flight, location, paxtype).subscribe((data) => {
                if (data.Results) {
                    if (data.Results[0].FlightSegments[0].Passengers == null) {
                        Toast.makeText("Data not found").show();
                        this.loaderProgress.hideLoader();
                        // this.clear();
                    } else {
                        let CompansationDetails: any = data;
                        this.flightStatusForCompensationList(CompansationDetails);
                    }
                } else {
                    if (data.Errors[0].Message == "Data not found") {
                        Toast.makeText("No passenger found").show();
                    } else {
                        Toast.makeText(data.Errors[0].Message).show();
                    }
                    this.loaderProgress.hideLoader();
                    // this.clear();
                }
            }, err => {
                console.log("Couldnt find information" + err);
                this.handleServiceError(err);
                this.loaderProgress.hideLoader();
            })
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('Get GetPassengerType Service --------------- End Date Time : ' + eDate);
            console.log('Get GetPassengerType Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    }
    flightStatusForCompensationList(CompPax): void {
        try {
            var sDate = new Date();
            console.log('Get CompensationDetails Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            var date = this.FlightHeaderInfo.DepartureDate;
            var flightnumber = this.FlightHeaderInfo.FlightNumber;
            var location = ApplicationSettings.getString("SearchLocation", "");
            this._service.status(date, flightnumber, location).subscribe((data) => {
                if (data.BadRequest != 400) {
                    if (data.Flights != null) {
                        let status: any = data;
                        console.log("IN1" + JSON.stringify(status));
                        this._shared.setCompensationFlightDetails(status);
                        let flightStatus = Converters.convertToFlightHeaderInfo(status, ApplicationSettings.getString("SearchLocation", ""));
                        this._shared.setFlightHeaderInfo(flightStatus);
                        let CompaxList = Converters.convertoCompensationPassengerList(CompPax, status, ApplicationSettings.getString("SearchLocation", ""));
                        if (this.PreviousPage == "issueCompensation") {
                            let CompaxFilteredList = new CompensationSearchModule.CompensationRootObject();
                            this.selectedPassenger.forEach((SelPax, Index) => {
                                CompaxList.PassengerList.forEach((AllPax, Index) => {
                                    if (SelPax.OrderId == AllPax.OrderId && SelPax.GivenName == AllPax.GivenName && SelPax.LastName == AllPax.LastName && SelPax.Compensations[0].CompReasonText == AllPax.Compensations[0].CompReasonText) {
                                        CompaxFilteredList.FlightModel = CompaxList.FlightModel;
                                        CompaxFilteredList.PassengerList.push(AllPax);
                                    }
                                });
                            })
                            CompaxList = null;
                            CompaxList = CompaxFilteredList;
                            this._shared.setCompensationList(CompaxFilteredList);
                        } else {
                            this._shared.setCompensationList(CompaxList);
                        }
                        this.PaxList = new CompensationSearchModule.CompensationRootObject();
                        this.CompPaxListNotIssued = [];
                        this.CompPaxListIssued = [];
                        // this.naviagatetoCompensationPrintListwithtab();
                        this.PaxList = CompaxList;
                        this.CompPaxList = this.PaxList.PassengerList.filter(m => m.IsCompensationIssued == true);
                        // console.log("Pax List:" + JSON.stringify(this.CompPaxList));
                        this.FlightHeaderInfo = this.PaxList.FlightModel;
                        this.totalIssuedMonetary = 0;
                        this.totalIssuedHotel = 0;
                        this.totalIssuedMeal = 0;
                        this.totalIssuedTransport = 0;
                        this.totalNotIssuedMonetary = 0;
                        this.totalNotIssuedHotel = 0;
                        this.totalNotIssuedMeal = 0;
                        this.totalNotIssuedTransport = 0;
                        this.CompPaxList.forEach((compData, Index) => {
                            compData.Compensations.forEach((exiEMD, exiIndex) => {
                                if (compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds) {
                                    compData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                                }
                                else {
                                    compData.monetarycount = 0;
                                }
                                if (exiEMD.Emds) {
                                    exiEMD.Emds.forEach((emdData, emdIndex) => {
                                        // if (exiEMD.CompTypeText != "Monetary") {
                                        if (emdData.PrintStatus == "n") {
                                            compData.isNotPrinted = true;
                                        }
                                        if (emdData.EmailStatus == "y") {
                                            compData.isEmailSent = true;
                                        }
                                        // }
                                    })
                                }
                            })
                            if (compData.isNotPrinted == true) {
                                compData.Compensations.forEach((exiEMD, exiIndex) => {
                                    if (exiEMD.Emds) {
                                        exiEMD.Emds.forEach((emdData, emdIndex) => {
                                            if (emdData.PrintStatus == "y") {
                                                compData.isParitallyPrinted = true;
                                            }
                                        })
                                    }
                                    if (exiEMD.CompTypeText == "Monetary") {
                                        if (exiEMD.Emds) {
                                            exiEMD.Emds.forEach((emdData, emdIndex) => {
                                                if (emdData.PrintStatus == "y" && exiEMD.Emds.filter(m => m.PrintStatus == "y").length < exiEMD.Emds.length) {
                                                    console.log(exiEMD.Emds.length);
                                                    console.log(exiEMD.Emds.filter(m => m.PrintStatus == "y").length);
                                                    compData.isParitallyPrinted = true;
                                                    compData.monetaryPrintStatus = true;
                                                    compData.isMonetaryParitallyPrinted = true;
                                                }
                                            })

                                        }
                                    }

                                });
                                if (compData.isParitallyPrinted == true) {
                                    console.log("isParitallyPrinted Printed" + compData.FullName);
                                    let paxData = new CompensationSearchModule.CompensationPassengerList();
                                    paxData.FlightSegmentId = compData.FlightSegmentId;
                                    paxData.PassengerSeq = compData.PassengerSeq;
                                    paxData.OrderId = compData.OrderId;
                                    paxData.GivenName = compData.GivenName;
                                    paxData.LastName = compData.LastName;
                                    paxData.FullName = compData.LastName + "/" + compData.GivenName;
                                    paxData.PaxType = compData.PaxType;
                                    paxData.FqtvCc = compData.FqtvCc;
                                    paxData.FqtvNumber = compData.FqtvNumber;
                                    paxData.PaxStatus = compData.PaxStatus;
                                    paxData.PaxEmailAddress = compData.PaxEmailAddress;
                                    paxData.CompensationReasonId = compData.CompensationReasonId;
                                    paxData.IsExistingCompensation = compData.IsExistingCompensation;
                                    paxData.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                                    paxData.WorldTracerNum = compData.WorldTracerNum;
                                    paxData.UpdateLockNbr = compData.UpdateLockNbr;
                                    paxData.FqtvTier = compData.FqtvTier;
                                    paxData.Cabin = compData.Cabin;
                                    paxData.PaxRPH = compData.PaxRPH;
                                    paxData.Origin = compData.Origin;
                                    paxData.Dest = compData.Dest;
                                    paxData.IsCompensationIssued = compData.IsCompensationIssued;
                                    paxData.SSR = compData.SSR;
                                    paxData.Etkt = compData.Etkt;
                                    paxData.ReaccomDetails = compData.ReaccomDetails;
                                    paxData.AdditionalDetails = compData.AdditionalDetails;
                                    paxData.monetary = compData.monetary;
                                    paxData.monetaryPrintStatus = compData.monetaryPrintStatus;
                                    paxData.Compensations = compData.Compensations;
                                    paxData.ExistingCompensations = compData.ExistingCompensations;
                                    paxData.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                                    paxData.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                                    paxData.mealendorsementTextItems = compData.mealendorsementTextItems;
                                    paxData.mealFreeText = compData.mealFreeText;
                                    paxData.mealDetails = compData.mealDetails;
                                    paxData.MealOverrideReason = compData.MealOverrideReason;
                                    paxData.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                                    paxData.hotelFreeText = compData.hotelFreeText;
                                    paxData.HotelOverrideReason = compData.HotelOverrideReason;
                                    paxData.hotelDetails = compData.hotelDetails;
                                    paxData.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                                    paxData.transportFreeText = compData.transportFreeText;
                                    paxData.transportEMD = compData.transportEMD;
                                    paxData.TransportOverrideReason = compData.TransportOverrideReason;
                                    paxData.monetaryEmailStatus = compData.monetaryEmailStatus;
                                    paxData.Email = compData.Email;
                                    paxData.isEmailSent = compData.isEmailSent;
                                    paxData.isEmailParitallySent = compData.isEmailParitallySent;
                                    console.log("New Inside:" + compData.isParitallyPrinted);
                                    paxData.monetaryPrintStatus = compData.monetaryPrintStatus;
                                    paxData.isParitallyPrinted = compData.isParitallyPrinted;
                                    paxData.isMonetaryParitallyPrinted = compData.isMonetaryParitallyPrinted;
                                    paxData.isMealParitallyPrinted = compData.isMealParitallyPrinted;
                                    paxData.isHotelsParitallyPrinted = compData.isHotelsParitallyPrinted;
                                    paxData.isTransportParitallyPrinted = compData.isTransportParitallyPrinted;
                                    if (compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds) {
                                        paxData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                                    }
                                    compData.Compensations.forEach((newcompData, Index) => {
                                        if (newcompData.Emds) {
                                            if (newcompData.CompTypeText == "Hotel") {
                                                paxData.hotel = newcompData.Emds.filter(m => m.PrintStatus == "y").length;
                                                if (paxData.hotel > 0) {
                                                    paxData.hotelPrintStatus = true;
                                                }
                                            }
                                            if (newcompData.CompTypeText == "Meal") {
                                                paxData.meal = newcompData.Emds.filter(m => m.PrintStatus == "y").length;
                                                if (paxData.meal > 0) {
                                                    paxData.mealPrintStatus = true;
                                                }
                                            }
                                            // paxData.mealPrintStatus = false;
                                            if (newcompData.CompTypeText == "Transportation") {
                                                paxData.transportation = newcompData.Emds.filter(m => m.PrintStatus == "y").length;
                                                if (paxData.transportation > 0) {
                                                    paxData.transportPrintStatus = true;
                                                }
                                            }
                                        }
                                    })
                                    if (compData.isEmailSent == true) {
                                        compData.Compensations.forEach((exiEMD, exiIndex) => {
                                            if (exiEMD.Emds) {
                                                exiEMD.Emds.forEach((emdData, emdIndex) => {
                                                    if (emdData.EmailStatus == "n") {
                                                        paxData.isEmailSent = true;
                                                        paxData.monetaryEmailStatus = true;
                                                        paxData.isEmailParitallySent = true;
                                                    }
                                                })

                                            }
                                        });
                                    }
                                    this.CompPaxList.push(paxData);
                                    this.CompPaxListIssued.push(paxData);
                                    paxData.monetaryPrintStatus = compData.monetaryPrintStatus;
                                    compData.Compensations.forEach((newcompData, Index) => {
                                        if (newcompData.Emds) {
                                            if (newcompData.CompTypeText == "Hotel") {
                                                compData.hotel = newcompData.Emds.filter(m => m.PrintStatus == "n").length;
                                                compData.hotelPrintStatus = false;
                                            }
                                            if (newcompData.CompTypeText == "Meal") {
                                                compData.meal = newcompData.Emds.filter(m => m.PrintStatus == "n").length;
                                                compData.mealPrintStatus = false;
                                            }
                                            if (newcompData.CompTypeText == "Transportation") {
                                                compData.transportation = newcompData.Emds.filter(m => m.PrintStatus == "n").length;
                                                compData.transportPrintStatus = false;
                                            }
                                        }
                                    })
                                    if (compData.isEmailSent == true) {
                                        compData.Compensations.forEach((exiEMD, exiIndex) => {
                                            if (exiEMD.Emds) {
                                                exiEMD.Emds.forEach((emdData, emdIndex) => {
                                                    if (emdData.EmailStatus == "n") {
                                                        compData.isEmailSent = true;
                                                        compData.monetaryEmailStatus = true;
                                                        compData.isEmailParitallySent = true;
                                                    }
                                                })

                                            }
                                        });
                                    }
                                    this.CompPaxListNotIssued.push(compData);
                                } else {
                                    console.log("Not Printed" + compData.FullName);
                                    if (compData.isEmailSent == true) {
                                        compData.Compensations.forEach((exiEMD, exiIndex) => {
                                            if (exiEMD.Emds) {
                                                exiEMD.Emds.forEach((emdData, emdIndex) => {
                                                    if (emdData.EmailStatus == "n") {
                                                        compData.isEmailSent = true;
                                                        compData.monetaryEmailStatus = true;
                                                        compData.isEmailParitallySent = true;
                                                    }
                                                })

                                            }
                                        });
                                    }
                                    this.CompPaxListNotIssued.push(compData);
                                }

                            } else {
                                console.log("Printed" + compData.FullName);
                                if (compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds) {
                                    compData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                                }
                                else {
                                    compData.monetarycount = 0;
                                }
                                if (compData.isEmailSent == true) {
                                    compData.Compensations.forEach((exiEMD, exiIndex) => {
                                        if (exiEMD.Emds) {
                                            exiEMD.Emds.forEach((emdData, emdIndex) => {
                                                if (emdData.EmailStatus == "n") {
                                                    compData.isEmailSent = true;
                                                    compData.monetaryEmailStatus = true;
                                                    compData.isEmailParitallySent = true;
                                                }
                                            })

                                        }
                                    });
                                }
                                this.CompPaxListIssued.push(compData);
                                if (compData.monetary > 0) {
                                    console.log("Printed monetary > 0" + compData.FullName);
                                    let paxData = new CompensationSearchModule.CompensationPassengerList();
                                    paxData.FlightSegmentId = compData.FlightSegmentId;
                                    paxData.PassengerSeq = compData.PassengerSeq;
                                    paxData.OrderId = compData.OrderId;
                                    paxData.GivenName = compData.GivenName;
                                    paxData.LastName = compData.LastName;
                                    paxData.FullName = compData.LastName + "/" + compData.GivenName;
                                    paxData.PaxType = compData.PaxType;
                                    paxData.FqtvCc = compData.FqtvCc;
                                    paxData.FqtvNumber = compData.FqtvNumber;
                                    paxData.PaxStatus = compData.PaxStatus;
                                    paxData.PaxEmailAddress = compData.PaxEmailAddress;
                                    paxData.CompensationReasonId = compData.CompensationReasonId;
                                    paxData.IsExistingCompensation = compData.IsExistingCompensation;
                                    paxData.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                                    paxData.WorldTracerNum = compData.WorldTracerNum;
                                    paxData.UpdateLockNbr = compData.UpdateLockNbr;
                                    paxData.FqtvTier = compData.FqtvTier;
                                    paxData.Cabin = compData.Cabin;
                                    paxData.PaxRPH = compData.PaxRPH;
                                    paxData.Origin = compData.Origin;
                                    paxData.Dest = compData.Dest;
                                    paxData.IsCompensationIssued = compData.IsCompensationIssued;
                                    paxData.SSR = compData.SSR;
                                    paxData.Etkt = compData.Etkt;
                                    paxData.ReaccomDetails = compData.ReaccomDetails;
                                    paxData.AdditionalDetails = compData.AdditionalDetails;
                                    paxData.monetary = compData.monetary;
                                    paxData.monetaryPrintStatus = compData.monetaryPrintStatus;
                                    paxData.Compensations = compData.Compensations;
                                    paxData.ExistingCompensations = compData.ExistingCompensations;
                                    paxData.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                                    paxData.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                                    paxData.mealendorsementTextItems = compData.mealendorsementTextItems;
                                    paxData.mealFreeText = compData.mealFreeText;
                                    paxData.mealDetails = compData.mealDetails;
                                    paxData.MealOverrideReason = compData.MealOverrideReason;
                                    paxData.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                                    paxData.hotelFreeText = compData.hotelFreeText;
                                    paxData.HotelOverrideReason = compData.HotelOverrideReason;
                                    paxData.hotelDetails = compData.hotelDetails;
                                    paxData.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                                    paxData.transportFreeText = compData.transportFreeText;
                                    paxData.transportEMD = compData.transportEMD;
                                    paxData.TransportOverrideReason = compData.TransportOverrideReason;
                                    paxData.monetaryEmailStatus = compData.monetaryEmailStatus;
                                    paxData.hotel = 0;
                                    paxData.hotelPrintStatus = false;
                                    paxData.meal = 0;
                                    paxData.mealPrintStatus = false;
                                    paxData.transportation = 0;
                                    paxData.transportPrintStatus = false;
                                    paxData.Email = compData.Email;
                                    paxData.isEmailSent = compData.isEmailSent;
                                    paxData.isParitallyPrinted = compData.isParitallyPrinted;
                                    if (paxData.isParitallyPrinted) {
                                        paxData.monetaryPrintStatus = true;
                                    }
                                    if (compData.isEmailSent == true) {
                                        compData.Compensations.forEach((exiEMD, exiIndex) => {
                                            if (exiEMD.Emds) {
                                                exiEMD.Emds.forEach((emdData, emdIndex) => {
                                                    if (emdData.EmailStatus == "n") {
                                                        paxData.isEmailSent = true;
                                                        paxData.monetaryEmailStatus = true;
                                                        paxData.isEmailParitallySent = true;
                                                    }
                                                })

                                            }
                                        });
                                    }
                                    paxData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                                    this.CompPaxList.push(paxData);
                                    this.CompPaxListNotIssued.push(paxData);
                                }
                            }
                            if (compData.isEmailSent == true && compData.isNotPrinted == true && compData.isParitallyPrinted == false) {
                                console.log("isEmailSent && isNotPrinted" + compData.FullName);
                                let paxData = new CompensationSearchModule.CompensationPassengerList();
                                paxData.isEmailSent = compData.isEmailSent;
                                paxData.monetaryEmailStatus = compData.monetaryEmailStatus;
                                compData.Compensations.forEach((exiEMD, exiIndex) => {
                                    if (exiEMD.Emds) {
                                        exiEMD.Emds.forEach((emdData, emdIndex) => {
                                            if (emdData.EmailStatus == "n") {
                                                paxData.isEmailSent = true;
                                                paxData.monetaryEmailStatus = true;
                                                paxData.isEmailParitallySent = true;
                                            }
                                        })

                                    }
                                });
                                paxData.FlightSegmentId = compData.FlightSegmentId;
                                paxData.PassengerSeq = compData.PassengerSeq;
                                paxData.OrderId = compData.OrderId;
                                paxData.GivenName = compData.GivenName;
                                paxData.LastName = compData.LastName;
                                paxData.FullName = compData.LastName + "/" + compData.GivenName;
                                paxData.PaxType = compData.PaxType;
                                paxData.FqtvCc = compData.FqtvCc;
                                paxData.FqtvNumber = compData.FqtvNumber;
                                paxData.PaxStatus = compData.PaxStatus;
                                paxData.PaxEmailAddress = compData.PaxEmailAddress;
                                paxData.CompensationReasonId = compData.CompensationReasonId;
                                paxData.IsExistingCompensation = compData.IsExistingCompensation;
                                paxData.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                                paxData.WorldTracerNum = compData.WorldTracerNum;
                                paxData.UpdateLockNbr = compData.UpdateLockNbr;
                                paxData.FqtvTier = compData.FqtvTier;
                                paxData.Cabin = compData.Cabin;
                                paxData.PaxRPH = compData.PaxRPH;
                                paxData.Origin = compData.Origin;
                                paxData.Dest = compData.Dest;
                                paxData.IsCompensationIssued = compData.IsCompensationIssued;
                                paxData.SSR = compData.SSR;
                                paxData.Etkt = compData.Etkt;
                                paxData.ReaccomDetails = compData.ReaccomDetails;
                                paxData.AdditionalDetails = compData.AdditionalDetails;
                                paxData.monetary = compData.monetary;
                                paxData.monetaryPrintStatus = compData.monetaryPrintStatus;
                                paxData.Compensations = compData.Compensations;
                                paxData.ExistingCompensations = compData.ExistingCompensations;
                                paxData.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                                paxData.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                                paxData.mealendorsementTextItems = compData.mealendorsementTextItems;
                                paxData.mealFreeText = compData.mealFreeText;
                                paxData.mealDetails = compData.mealDetails;
                                paxData.MealOverrideReason = compData.MealOverrideReason;
                                paxData.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                                paxData.hotelFreeText = compData.hotelFreeText;
                                paxData.HotelOverrideReason = compData.HotelOverrideReason;
                                paxData.hotelDetails = compData.hotelDetails;
                                paxData.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                                paxData.transportFreeText = compData.transportFreeText;
                                paxData.transportEMD = compData.transportEMD;
                                paxData.TransportOverrideReason = compData.TransportOverrideReason;
                                // paxData.monetaryEmailStatus = compData.monetaryEmailStatus;
                                paxData.hotel = 0;
                                paxData.hotelPrintStatus = false;
                                paxData.meal = 0;
                                paxData.mealPrintStatus = false;
                                paxData.transportation = 0;
                                paxData.transportPrintStatus = false;
                                paxData.Email = compData.Email;
                                paxData.isParitallyPrinted = compData.isParitallyPrinted;
                                paxData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                                console.log("Email :" + JSON.stringify(paxData));
                                this.CompPaxList.push(paxData);
                                this.CompPaxListIssued.push(paxData);

                            }
                        })
                        this.apisdetails = [];
                        this.firsttab.title = "EMD Printed" + "(" + this.CompPaxListIssued.length + ")";
                        this.apisdetails.push(this.firsttab);
                        this.ComPaxPrintFullList = this.CompPaxListIssued;
                        this.ComPaxNotPrintFullList = this.CompPaxListNotIssued;
                        this.secondtab.title = "EMD Available for Print" + "(" + this.CompPaxListNotIssued.length + ")";
                        this.apisdetails.push(this.secondtab);
                        this.loaderProgress.hideLoader();
                        let e: any = { eventName: "selectedIndexChanged", newIndex: 0, oldIndex: -1 };
                        this.selectSegment(e);
                    } else {
                        let status: any = data;
                        console.log("IN1" + JSON.stringify(status));
                        this._shared.setCompensationFlightDetails(status);
                        let CompaxList = Converters.convertoCompensationPassengerList(CompPax, status, ApplicationSettings.getString("SearchLocation", ""));
                        if (this.PreviousPage == "issueCompensation") {
                            let CompaxFilteredList = new CompensationSearchModule.CompensationRootObject();
                            this.selectedPassenger.forEach((SelPax, Index) => {
                                CompaxList.PassengerList.forEach((AllPax, Index) => {
                                    if (SelPax.OrderId == AllPax.OrderId && SelPax.GivenName == AllPax.GivenName && SelPax.LastName == AllPax.LastName && SelPax.Compensations[0].CompReasonText == AllPax.Compensations[0].CompReasonText) {
                                        CompaxFilteredList.FlightModel = CompaxList.FlightModel;
                                        CompaxFilteredList.PassengerList.push(AllPax);
                                    }
                                });
                            })
                            CompaxList = null;
                            CompaxList = CompaxFilteredList;
                            this._shared.setCompensationList(CompaxFilteredList);
                        } else {
                            this._shared.setCompensationList(CompaxList);
                        }
                        this.PaxList = new CompensationSearchModule.CompensationRootObject();
                        this.CompPaxListNotIssued = [];
                        this.CompPaxListIssued = [];
                        // this.naviagatetoCompensationPrintListwithtab();
                        this.PaxList = CompaxList;
                        this.CompPaxList = this.PaxList.PassengerList.filter(m => m.IsCompensationIssued == true);
                        // console.log("Pax List:" + JSON.stringify(this.CompPaxList));
                        this.FlightHeaderInfo = this.PaxList.FlightModel;
                        this.totalIssuedMonetary = 0;
                        this.totalIssuedHotel = 0;
                        this.totalIssuedMeal = 0;
                        this.totalIssuedTransport = 0;
                        this.totalNotIssuedMonetary = 0;
                        this.totalNotIssuedHotel = 0;
                        this.totalNotIssuedMeal = 0;
                        this.totalNotIssuedTransport = 0;
                        this.CompPaxList.forEach((compData, Index) => {
                            compData.Compensations.forEach((exiEMD, exiIndex) => {
                                if (compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds) {
                                    compData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                                }
                                else {
                                    compData.monetarycount = 0;
                                }
                                if (exiEMD.Emds) {
                                    exiEMD.Emds.forEach((emdData, emdIndex) => {
                                        // if (exiEMD.CompTypeText != "Monetary") {
                                        if (emdData.PrintStatus == "n") {
                                            compData.isNotPrinted = true;
                                        }
                                        if (emdData.EmailStatus == "y") {
                                            compData.isEmailSent = true;
                                        }
                                        // }
                                    })
                                }
                            })
                            if (compData.isNotPrinted == true) {
                                compData.Compensations.forEach((exiEMD, exiIndex) => {
                                    if (exiEMD.Emds) {
                                        exiEMD.Emds.forEach((emdData, emdIndex) => {
                                            if (emdData.PrintStatus == "y") {
                                                compData.isParitallyPrinted = true;
                                            }
                                        })
                                    }
                                    if (exiEMD.CompTypeText == "Monetary") {
                                        if (exiEMD.Emds) {
                                            exiEMD.Emds.forEach((emdData, emdIndex) => {
                                                if (emdData.PrintStatus == "y" && exiEMD.Emds.filter(m => m.PrintStatus == "y").length < exiEMD.Emds.length) {
                                                    console.log(exiEMD.Emds.length);
                                                    console.log(exiEMD.Emds.filter(m => m.PrintStatus == "y").length);
                                                    compData.isParitallyPrinted = true;
                                                    compData.monetaryPrintStatus = true;
                                                    compData.isMonetaryParitallyPrinted = true;
                                                }
                                            })

                                        }
                                    }

                                });
                                if (compData.isParitallyPrinted == true) {
                                    console.log("isParitallyPrinted Printed" + compData.FullName);
                                    let paxData = new CompensationSearchModule.CompensationPassengerList();
                                    paxData.FlightSegmentId = compData.FlightSegmentId;
                                    paxData.PassengerSeq = compData.PassengerSeq;
                                    paxData.OrderId = compData.OrderId;
                                    paxData.GivenName = compData.GivenName;
                                    paxData.LastName = compData.LastName;
                                    paxData.FullName = compData.LastName + "/" + compData.GivenName;
                                    paxData.PaxType = compData.PaxType;
                                    paxData.FqtvCc = compData.FqtvCc;
                                    paxData.FqtvNumber = compData.FqtvNumber;
                                    paxData.PaxStatus = compData.PaxStatus;
                                    paxData.PaxEmailAddress = compData.PaxEmailAddress;
                                    paxData.CompensationReasonId = compData.CompensationReasonId;
                                    paxData.IsExistingCompensation = compData.IsExistingCompensation;
                                    paxData.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                                    paxData.WorldTracerNum = compData.WorldTracerNum;
                                    paxData.UpdateLockNbr = compData.UpdateLockNbr;
                                    paxData.FqtvTier = compData.FqtvTier;
                                    paxData.Cabin = compData.Cabin;
                                    paxData.PaxRPH = compData.PaxRPH;
                                    paxData.Origin = compData.Origin;
                                    paxData.Dest = compData.Dest;
                                    paxData.IsCompensationIssued = compData.IsCompensationIssued;
                                    paxData.SSR = compData.SSR;
                                    paxData.Etkt = compData.Etkt;
                                    paxData.ReaccomDetails = compData.ReaccomDetails;
                                    paxData.AdditionalDetails = compData.AdditionalDetails;
                                    paxData.monetary = compData.monetary;
                                    paxData.monetaryPrintStatus = compData.monetaryPrintStatus;
                                    paxData.Compensations = compData.Compensations;
                                    paxData.ExistingCompensations = compData.ExistingCompensations;
                                    paxData.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                                    paxData.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                                    paxData.mealendorsementTextItems = compData.mealendorsementTextItems;
                                    paxData.mealFreeText = compData.mealFreeText;
                                    paxData.mealDetails = compData.mealDetails;
                                    paxData.MealOverrideReason = compData.MealOverrideReason;
                                    paxData.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                                    paxData.hotelFreeText = compData.hotelFreeText;
                                    paxData.HotelOverrideReason = compData.HotelOverrideReason;
                                    paxData.hotelDetails = compData.hotelDetails;
                                    paxData.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                                    paxData.transportFreeText = compData.transportFreeText;
                                    paxData.transportEMD = compData.transportEMD;
                                    paxData.TransportOverrideReason = compData.TransportOverrideReason;
                                    paxData.monetaryEmailStatus = compData.monetaryEmailStatus;
                                    paxData.Email = compData.Email;
                                    paxData.isEmailSent = compData.isEmailSent;
                                    paxData.isEmailParitallySent = compData.isEmailParitallySent;
                                    console.log("New Inside:" + compData.isParitallyPrinted);
                                    paxData.monetaryPrintStatus = compData.monetaryPrintStatus;
                                    paxData.isParitallyPrinted = compData.isParitallyPrinted;
                                    paxData.isMonetaryParitallyPrinted = compData.isMonetaryParitallyPrinted;
                                    paxData.isMealParitallyPrinted = compData.isMealParitallyPrinted;
                                    paxData.isHotelsParitallyPrinted = compData.isHotelsParitallyPrinted;
                                    paxData.isTransportParitallyPrinted = compData.isTransportParitallyPrinted;
                                    if (compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds) {
                                        paxData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                                    }
                                    compData.Compensations.forEach((newcompData, Index) => {
                                        if (newcompData.Emds) {
                                            if (newcompData.CompTypeText == "Hotel") {
                                                paxData.hotel = newcompData.Emds.filter(m => m.PrintStatus == "y").length;
                                                if (paxData.hotel > 0) {
                                                    paxData.hotelPrintStatus = true;
                                                }
                                            }
                                            if (newcompData.CompTypeText == "Meal") {
                                                paxData.meal = newcompData.Emds.filter(m => m.PrintStatus == "y").length;
                                                if (paxData.meal > 0) {
                                                    paxData.mealPrintStatus = true;
                                                }
                                            }
                                            // paxData.mealPrintStatus = false;
                                            if (newcompData.CompTypeText == "Transportation") {
                                                paxData.transportation = newcompData.Emds.filter(m => m.PrintStatus == "y").length;
                                                if (paxData.transportation > 0) {
                                                    paxData.transportPrintStatus = true;
                                                }
                                            }
                                        }
                                    })
                                    if (compData.isEmailSent == true) {
                                        compData.Compensations.forEach((exiEMD, exiIndex) => {
                                            if (exiEMD.Emds) {
                                                exiEMD.Emds.forEach((emdData, emdIndex) => {
                                                    if (emdData.EmailStatus == "n") {
                                                        paxData.isEmailSent = true;
                                                        paxData.monetaryEmailStatus = true;
                                                        paxData.isEmailParitallySent = true;
                                                    }
                                                })

                                            }
                                        });
                                    }
                                    this.CompPaxList.push(paxData);
                                    this.CompPaxListIssued.push(paxData);
                                    paxData.monetaryPrintStatus = compData.monetaryPrintStatus;
                                    compData.Compensations.forEach((newcompData, Index) => {
                                        if (newcompData.Emds) {
                                            if (newcompData.CompTypeText == "Hotel") {
                                                compData.hotel = newcompData.Emds.filter(m => m.PrintStatus == "n").length;
                                                compData.hotelPrintStatus = false;
                                            }
                                            if (newcompData.CompTypeText == "Meal") {
                                                compData.meal = newcompData.Emds.filter(m => m.PrintStatus == "n").length;
                                                compData.mealPrintStatus = false;
                                            }
                                            if (newcompData.CompTypeText == "Transportation") {
                                                compData.transportation = newcompData.Emds.filter(m => m.PrintStatus == "n").length;
                                                compData.transportPrintStatus = false;
                                            }
                                        }
                                    })
                                    if (compData.isEmailSent == true) {
                                        compData.Compensations.forEach((exiEMD, exiIndex) => {
                                            if (exiEMD.Emds) {
                                                exiEMD.Emds.forEach((emdData, emdIndex) => {
                                                    if (emdData.EmailStatus == "n") {
                                                        compData.isEmailSent = true;
                                                        compData.monetaryEmailStatus = true;
                                                        compData.isEmailParitallySent = true;
                                                    }
                                                })

                                            }
                                        });
                                    }
                                    this.CompPaxListNotIssued.push(compData);
                                } else {
                                    console.log("Not Printed" + compData.FullName);
                                    if (compData.isEmailSent == true) {
                                        compData.Compensations.forEach((exiEMD, exiIndex) => {
                                            if (exiEMD.Emds) {
                                                exiEMD.Emds.forEach((emdData, emdIndex) => {
                                                    if (emdData.EmailStatus == "n") {
                                                        compData.isEmailSent = true;
                                                        compData.monetaryEmailStatus = true;
                                                        compData.isEmailParitallySent = true;
                                                    }
                                                })

                                            }
                                        });
                                    }
                                    this.CompPaxListNotIssued.push(compData);
                                }

                            } else {
                                console.log("Printed" + compData.FullName);
                                if (compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds) {
                                    compData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                                }
                                else {
                                    compData.monetarycount = 0;
                                }
                                if (compData.isEmailSent == true) {
                                    compData.Compensations.forEach((exiEMD, exiIndex) => {
                                        if (exiEMD.Emds) {
                                            exiEMD.Emds.forEach((emdData, emdIndex) => {
                                                if (emdData.EmailStatus == "n") {
                                                    compData.isEmailSent = true;
                                                    compData.monetaryEmailStatus = true;
                                                    compData.isEmailParitallySent = true;
                                                }
                                            })

                                        }
                                    });
                                }
                                this.CompPaxListIssued.push(compData);
                                if (compData.monetary > 0) {
                                    console.log("Printed monetary > 0" + compData.FullName);
                                    let paxData = new CompensationSearchModule.CompensationPassengerList();
                                    paxData.FlightSegmentId = compData.FlightSegmentId;
                                    paxData.PassengerSeq = compData.PassengerSeq;
                                    paxData.OrderId = compData.OrderId;
                                    paxData.GivenName = compData.GivenName;
                                    paxData.LastName = compData.LastName;
                                    paxData.FullName = compData.LastName + "/" + compData.GivenName;
                                    paxData.PaxType = compData.PaxType;
                                    paxData.FqtvCc = compData.FqtvCc;
                                    paxData.FqtvNumber = compData.FqtvNumber;
                                    paxData.PaxStatus = compData.PaxStatus;
                                    paxData.PaxEmailAddress = compData.PaxEmailAddress;
                                    paxData.CompensationReasonId = compData.CompensationReasonId;
                                    paxData.IsExistingCompensation = compData.IsExistingCompensation;
                                    paxData.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                                    paxData.WorldTracerNum = compData.WorldTracerNum;
                                    paxData.UpdateLockNbr = compData.UpdateLockNbr;
                                    paxData.FqtvTier = compData.FqtvTier;
                                    paxData.Cabin = compData.Cabin;
                                    paxData.PaxRPH = compData.PaxRPH;
                                    paxData.Origin = compData.Origin;
                                    paxData.Dest = compData.Dest;
                                    paxData.IsCompensationIssued = compData.IsCompensationIssued;
                                    paxData.SSR = compData.SSR;
                                    paxData.Etkt = compData.Etkt;
                                    paxData.ReaccomDetails = compData.ReaccomDetails;
                                    paxData.AdditionalDetails = compData.AdditionalDetails;
                                    paxData.monetary = compData.monetary;
                                    paxData.monetaryPrintStatus = compData.monetaryPrintStatus;
                                    paxData.Compensations = compData.Compensations;
                                    paxData.ExistingCompensations = compData.ExistingCompensations;
                                    paxData.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                                    paxData.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                                    paxData.mealendorsementTextItems = compData.mealendorsementTextItems;
                                    paxData.mealFreeText = compData.mealFreeText;
                                    paxData.mealDetails = compData.mealDetails;
                                    paxData.MealOverrideReason = compData.MealOverrideReason;
                                    paxData.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                                    paxData.hotelFreeText = compData.hotelFreeText;
                                    paxData.HotelOverrideReason = compData.HotelOverrideReason;
                                    paxData.hotelDetails = compData.hotelDetails;
                                    paxData.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                                    paxData.transportFreeText = compData.transportFreeText;
                                    paxData.transportEMD = compData.transportEMD;
                                    paxData.TransportOverrideReason = compData.TransportOverrideReason;
                                    paxData.monetaryEmailStatus = compData.monetaryEmailStatus;
                                    paxData.hotel = 0;
                                    paxData.hotelPrintStatus = false;
                                    paxData.meal = 0;
                                    paxData.mealPrintStatus = false;
                                    paxData.transportation = 0;
                                    paxData.transportPrintStatus = false;
                                    paxData.Email = compData.Email;
                                    paxData.isEmailSent = compData.isEmailSent;
                                    paxData.isParitallyPrinted = compData.isParitallyPrinted;
                                    if (paxData.isParitallyPrinted) {
                                        paxData.monetaryPrintStatus = true;
                                    }
                                    if (compData.isEmailSent == true) {
                                        compData.Compensations.forEach((exiEMD, exiIndex) => {
                                            if (exiEMD.Emds) {
                                                exiEMD.Emds.forEach((emdData, emdIndex) => {
                                                    if (emdData.EmailStatus == "n") {
                                                        paxData.isEmailSent = true;
                                                        paxData.monetaryEmailStatus = true;
                                                        paxData.isEmailParitallySent = true;
                                                    }
                                                })

                                            }
                                        });
                                    }
                                    paxData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                                    this.CompPaxList.push(paxData);
                                    this.CompPaxListNotIssued.push(paxData);
                                }
                            }
                            if (compData.isEmailSent == true && compData.isNotPrinted == true && compData.isParitallyPrinted == false) {
                                console.log("isEmailSent && isNotPrinted" + compData.FullName);
                                let paxData = new CompensationSearchModule.CompensationPassengerList();
                                paxData.isEmailSent = compData.isEmailSent;
                                paxData.monetaryEmailStatus = compData.monetaryEmailStatus;
                                compData.Compensations.forEach((exiEMD, exiIndex) => {
                                    if (exiEMD.Emds) {
                                        exiEMD.Emds.forEach((emdData, emdIndex) => {
                                            if (emdData.EmailStatus == "n") {
                                                paxData.isEmailSent = true;
                                                paxData.monetaryEmailStatus = true;
                                                paxData.isEmailParitallySent = true;
                                            }
                                        })

                                    }
                                });
                                paxData.FlightSegmentId = compData.FlightSegmentId;
                                paxData.PassengerSeq = compData.PassengerSeq;
                                paxData.OrderId = compData.OrderId;
                                paxData.GivenName = compData.GivenName;
                                paxData.LastName = compData.LastName;
                                paxData.FullName = compData.LastName + "/" + compData.GivenName;
                                paxData.PaxType = compData.PaxType;
                                paxData.FqtvCc = compData.FqtvCc;
                                paxData.FqtvNumber = compData.FqtvNumber;
                                paxData.PaxStatus = compData.PaxStatus;
                                paxData.PaxEmailAddress = compData.PaxEmailAddress;
                                paxData.CompensationReasonId = compData.CompensationReasonId;
                                paxData.IsExistingCompensation = compData.IsExistingCompensation;
                                paxData.CustomerCareCaseNum = compData.CustomerCareCaseNum;
                                paxData.WorldTracerNum = compData.WorldTracerNum;
                                paxData.UpdateLockNbr = compData.UpdateLockNbr;
                                paxData.FqtvTier = compData.FqtvTier;
                                paxData.Cabin = compData.Cabin;
                                paxData.PaxRPH = compData.PaxRPH;
                                paxData.Origin = compData.Origin;
                                paxData.Dest = compData.Dest;
                                paxData.IsCompensationIssued = compData.IsCompensationIssued;
                                paxData.SSR = compData.SSR;
                                paxData.Etkt = compData.Etkt;
                                paxData.ReaccomDetails = compData.ReaccomDetails;
                                paxData.AdditionalDetails = compData.AdditionalDetails;
                                paxData.monetary = compData.monetary;
                                paxData.monetaryPrintStatus = compData.monetaryPrintStatus;
                                paxData.Compensations = compData.Compensations;
                                paxData.ExistingCompensations = compData.ExistingCompensations;
                                paxData.monetaryendorsementTextItems = compData.monetaryendorsementTextItems;
                                paxData.MonetaryOverrideReason = compData.MonetaryOverrideReason;
                                paxData.mealendorsementTextItems = compData.mealendorsementTextItems;
                                paxData.mealFreeText = compData.mealFreeText;
                                paxData.mealDetails = compData.mealDetails;
                                paxData.MealOverrideReason = compData.MealOverrideReason;
                                paxData.hotelendorsementTextItems = compData.hotelendorsementTextItems;
                                paxData.hotelFreeText = compData.hotelFreeText;
                                paxData.HotelOverrideReason = compData.HotelOverrideReason;
                                paxData.hotelDetails = compData.hotelDetails;
                                paxData.transportationendorsementTextItems = compData.transportationendorsementTextItems;
                                paxData.transportFreeText = compData.transportFreeText;
                                paxData.transportEMD = compData.transportEMD;
                                paxData.TransportOverrideReason = compData.TransportOverrideReason;
                                // paxData.monetaryEmailStatus = compData.monetaryEmailStatus;
                                paxData.hotel = 0;
                                paxData.hotelPrintStatus = false;
                                paxData.meal = 0;
                                paxData.mealPrintStatus = false;
                                paxData.transportation = 0;
                                paxData.transportPrintStatus = false;
                                paxData.Email = compData.Email;
                                paxData.isParitallyPrinted = compData.isParitallyPrinted;
                                paxData.monetarycount = compData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].Emds.length;
                                console.log("Email :" + JSON.stringify(paxData));
                                this.CompPaxList.push(paxData);
                                this.CompPaxListIssued.push(paxData);

                            }
                        })
                        this.apisdetails = [];
                        this.firsttab.title = "EMD Printed" + "(" + this.CompPaxListIssued.length + ")";
                        this.apisdetails.push(this.firsttab);
                        this.ComPaxPrintFullList = this.CompPaxListIssued;
                        this.ComPaxNotPrintFullList = this.CompPaxListNotIssued;
                        this.secondtab.title = "EMD Available for Print" + "(" + this.CompPaxListNotIssued.length + ")";
                        this.apisdetails.push(this.secondtab);
                        this.loaderProgress.hideLoader();
                        let e: any = { eventName: "selectedIndexChanged", newIndex: 0, oldIndex: -1 };
                        this.selectSegment(e);
                    }
                } else {
                    Toast.makeText(data.errMessage).show();
                    // this.clear();
                    this.loaderProgress.hideLoader();
                }
            },
                err => {
                    console.log("Couldnt find information" + err);
                    this.handleServiceError(err);
                    this.loaderProgress.hideLoader();
                });
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('Get CompensationDetails Service --------------- End Date Time : ' + eDate);
            console.log('Get CompensationDetails Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }

    }
    displayProductActionDialogForPrinter() {
        var hostedcheck = ApplicationSettings.getBoolean("isHostBoarding");
        if (hostedcheck) {
            this.printEMD();
        } else {
            this.bluetoothEMD();
        }
    }
    bluetoothEMD() {
        try {
            this.loaderProgress.showLoader();
            var startDate = new Date();
            var CurDate = moment(startDate).format("YYYY-MM-DD");
            console.log(CurDate)
            this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
            let EmailCompensationStructure: PrintModule.RootObject = Converters.convertToBluetoothPrintEMDCompensation(this.SelectedPassenger, this.FlightHeaderInfo);
            console.log("Email Req:" + JSON.stringify(EmailCompensationStructure));
            if (EmailCompensationStructure.Passengers != []) {
                this._service.printEMDBluetoothCompensationService(EmailCompensationStructure).subscribe((data) => {
                    console.log("Email Res:" + JSON.stringify(data));

                    // this.loaderProgress.hideLoader();
                    if (data.RawData) {
                        // this.loaderProgress.hideLoader();
                        if (data.RawData) {
                            let image = imageModule.fromBase64(data.RawData);
                            let folder = fs.knownFolders.documents();
                            let filename: string = moment(new Date()).format("hhmmss");
                            let path = fs.path.join(folder.path, "tempBPImage" + filename + ".jpg");
                            try {
                                image.saveToFile(path, "jpeg");
                                let printerID = this.getPrinter();
                                if (printerID.trim() != "") {
                                    let self = this;
                                    new zebra.Printer({ address: printerID, language: "CPCL", debugging: false })
                                        .then(function (curPrinter, result) {
                                            var document = curPrinter.createDocument();
                                            document.image(fs.path.join(folder.path, "tempBPImage" + filename + ".jpg"), 0);
                                            curPrinter.getStatus().then(function (result) {
                                                console.log(result);
                                                if (result.ready && !result.latchOpen && !result.lowBattery && !result.paperOut) {
                                                    //printing
                                                    curPrinter.print(document).then(function () {
                                                        console.log("Printing Done");
                                                        let file = folder.getFile("tempBPImage" + filename + ".jpg");
                                                        file.remove().then((res) => {
                                                            console.log("file removed")
                                                        })
                                                        Toast.makeText("Bluetooth printed sucessfully").show();
                                                        let SaveComptemplate = Converters.convertToSaveCompensationTemplateForPrint(self.SelectedPassenger, self.FlightHeaderInfo);
                                                        console.log("save" + JSON.stringify(SaveComptemplate));
                                                        self._service.saveBluetoothPrint(SaveComptemplate).subscribe((data) => {
                                                            self.getCompensationList(self.FlightHeaderInfo.DepartureDate, self.FlightHeaderInfo.FlightNumber, self.SelectedPassenger[0].Origin, "ReasonWiseGet");
                                                            console.log("Email Res:" + JSON.stringify(data));
                                                        }, error => {
                                                            self.handleServiceError(error);
                                                            self.loaderProgress.hideLoader();
                                                        });

                                                        curPrinter.close().then(function () {
                                                            Toast.makeText("Printer is ready to print").show();
                                                            // this.loaderProgress.hideLoader();
                                                        })
                                                            .catch(function (err) {
                                                                Toast.makeText("Error Occured while Printing:").show();
                                                                curPrinter.close();
                                                                self.loaderProgress.hideLoader();
                                                            });
                                                        // this.loaderProgress.hideLoader();
                                                    }).catch(function (status) {
                                                        console.log(status);
                                                        // self._service.saveBluetoothPrint(self.SaveComptemplate).subscribe((data) => {
                                                        //     self.getCompensationList(this.FlightHeaderInfo.DepartureDate, this.FlightHeaderInfo.FlightNumber, this.FlightHeaderInfo.DepartureAirport, "ReasonWiseGet");
                                                        //     console.log("Email Res:" + JSON.stringify(data));
                                                        // });
                                                        Toast.makeText(CompensationPrintScreenComponent.UNABLETOPRINT).show();
                                                        self.loaderProgress.hideLoader();
                                                    });
                                                } else {
                                                    if (result.latchOpen) {
                                                        Toast.makeText("!!!!LatchOpen").show();

                                                    }
                                                    if (result.lowBattery) {
                                                        Toast.makeText("!!!!LowBattery").show();

                                                    }
                                                    if (result.paperOut) {
                                                        Toast.makeText("!!!!PaperOut").show();

                                                    }
                                                    self.loaderProgress.hideLoader();
                                                }
                                            }).catch(function (status) {
                                                console.log(status);
                                            })
                                        }).catch(function (err) {
                                            Toast.makeText(CompensationPrintScreenComponent.PRINTERSESSION).show();
                                            self.loaderProgress.hideLoader();
                                            console.log(err);
                                        });
                                } else {
                                    Toast.makeText(CompensationPrintScreenComponent.NOBLUETOOTHDEVICE).show();
                                    this.loaderProgress.hideLoader();
                                }
                            } catch (e) {
                                Toast.makeText(CompensationPrintScreenComponent.UNABLETOPRINT).show();
                                this.loaderProgress.hideLoader();
                            }
                        } else {
                            Toast.makeText(CompensationPrintScreenComponent.UNABLETOPRINT).show();
                            this.loaderProgress.hideLoader();
                        }
                        // this.getCompensationList(this.FlightHeaderInfo.DepartureDate,this.FlightHeaderInfo.FlightNumber,this.FlightHeaderInfo.DepartureAirport,"ReasonWiseGet");
                        // Toast.makeText(data.Errors[0].Message).show();
                        // this.loaderProgress.hideLoader();
                    } else {
                        Toast.makeText(data.Errors[0].Message).show();
                        this.loaderProgress.hideLoader();
                    }
                }, err => {
                    this.handleServiceError(err);
                    this.loaderProgress.hideLoader();
                })
            } else {
                Toast.makeText("No EMD avilable for print").show();
                this.loaderProgress.hideLoader();
            }
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    }
    getPrinter(): string {
        if (ApplicationSettings.hasKey("printer")) {
            return ApplicationSettings.getString("printer");
        } else {
            return "";
        }
    }
    displayProductActionDialogForSmartFilter() {
        let options = {
            title: "Smart filter option",
            cancelButtonText: "Cancel",
            actions: ["Name", "Order ID", "Class"],
        };
        dialogs.action(options).then((result) => {
            if (result != "Cancel") {
                this.SearchCriteria = result;
            }
        });
    }
    printEMD() {
        try {
            this.loaderProgress.showLoader();
            var startDate = new Date();
            var CurDate = moment(startDate).format("YYYY-MM-DD");
            console.log(CurDate)
            var DeviceName = ApplicationSettings.getString("boardingPassDeviceName", "");
            if (DeviceName == "") {
                Toast.makeText("Please set printer in setting").show();
                this.loaderProgress.hideLoader();
            } else {
                this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
                let EmailCompensationStructure: PrintModule.RootObject = Converters.convertToPrintEMDCompensation(this.SelectedPassenger, this.FlightHeaderInfo);
                console.log("Email Req:" + JSON.stringify(EmailCompensationStructure));
                if (EmailCompensationStructure.Passengers != []) {
                    this._service.printEMDCompensationService(EmailCompensationStructure).subscribe((data) => {
                        console.log("Email Res:" + JSON.stringify(data));
                        if (data.Success) {
                            this.loaderProgress.hideLoader();
                            Toast.makeText("Printed successfully").show();
                            this.getCompensationList(this.FlightHeaderInfo.DepartureDate, this.FlightHeaderInfo.FlightNumber, this.SelectedPassenger[0].Origin, "ReasonWiseGet");

                        } else {
                            this.loaderProgress.hideLoader();
                            Toast.makeText(data.Errors[0].Message).show();
                        }
                    }, err => {
                        this.handleServiceError(err);
                        this.loaderProgress.hideLoader();
                    })
                } else {
                    Toast.makeText("No EMD avilable for print").show();
                    this.loaderProgress.hideLoader();
                }
            }
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    }
    navigatetoadditionaldetails(Paxitem: CompensationSearchModule.CompensationPassengerList): void {
        console.log("V" + Paxitem);
        if (Paxitem.IsSelected) {
            var prePage: string = "PrintList";
            this.routerExtensions.navigate(["compensationadditionaldetails"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                }, queryParams: {
                    "data": JSON.stringify(Paxitem),
                    "prepage": prePage,
                }
            })
        }
    }
    displaySSRs(item: CompensationSearchModule.CompensationPassengerList) {
        if (item.SSRsCount > 0) {
            console.log("R" + JSON.stringify(item.SSRs));
            let options = {
                title: "SSRs",
                cancelButtonText: "Cancel",
                actions: item.SSRs,
            };
            dialogs.action(options).then((result) => {

            });
        }
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