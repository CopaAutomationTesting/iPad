//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, AnimationKeyframe } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Location, PathLocationStrategy } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import * as imageModule from "image-source";
import * as fs from "file-system";
import * as gestures from "ui/gestures";
import * as dialogs from "ui/dialogs";
import { Image } from "ui/image";
import { Page } from "ui/page";
import { View } from "ui/core/view";
import { ListView, ItemEventData } from "ui/list-view";
import { SwipeGestureEventData } from "ui/gestures";
import { Animation } from "ui/animation";
import { AnimationCurve } from "ui/enums";
import { StackLayout } from "ui/layouts/stack-layout";
//external modules and plugins
import * as ApplicationSettings from "application-settings";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import * as Toast from "nativescript-toast";
import * as moment from "moment";
import * as zebra from "nativescript-print-zebra";

//app references
import { DataService, PassengerService, CheckinOrderService, SeatMapService, TimeOutService, PrintEmailService, CheckinService } from "../../shared/services/index";
import { Passenger, Order, SecurityValidation, SeatMapOAPax, CountryCollection, Inventory, FqtvPrograms, FQTV, Departures, DocumentType, SecurityModel, ApisUpdateRequest, ADCByPass, Legs, ApisAddressRequirements } from "../../shared/model/index"
import { UpgradeInfoArray, PaxTemplate, PassengerCheckin, InBound, FlightInfo, MultiSegmentTemplate, FQTVInfo, SeatMap, FQTVPro, CheckInPostTemplate, DepartureInfo, OutBound, LoaderProgress, Document, PhoneNumber, Address, ApisRequirement, EmergencyPhone, EmergencyDetail, AssociatedPassenger } from '../../shared/interface/index';
// import { MultiSegmentTemplate.Passenger as PassengerIntf } from "../../shared/interface/multisegment.interface"
import { Converters } from "../../shared/utils/index";
import { AppExecutiontime } from "../../app.executiontime";
import { Configuration } from "../../app.constants";
import { InterlineThroughCheckin } from "../../shared/interface/paxtemplate.interface";
import { DRSComponent } from "../DRSPage/DrsPage-modal";


@Component({
    selector: "checkin-page",
    moduleId: module.id,
    providers: [DataService, PassengerService, ModalDialogService, Configuration, SecurityModel, PrintEmailService, CheckinService, SeatMapService],
    templateUrl: "./checkin.component.html",
    styleUrls: ["./checkin.component.css"]
})
export class CheckInComponent implements OnInit {
    @ViewChild("pagecontainer") pageCont: ElementRef;
    public isError: boolean;
    public errorMessage: string;
    public isAddresses: boolean = false;
    public DocumentTypeList: Array<DocumentType>;
    public DocumentType: Array<any>;
    public ADCByPassList: Array<ADCByPass>;
    public ADCByPassNameList: Array<any>;
    public GetDocumentTypeList: any;
    public checkedCount: number = 0;
    public DocTypeIndex: Array<any>;
    public SelectedDocTypeIndex: number;
    public DocIssueCountryIndex: Array<any>;
    public ResidenceCodeIndex: Array<any>;
    public NationalityIndex: Array<any>;
    public CNCodeIndex: number;
    public CountryItems: any[];
    public startDate: Date;
    public PageDocumentList: Array<string>;
    public CountryList: Array<string>;
    public SelectDocumentType: string;
    public SelectedPassengerList: Array<PassengerCheckin.SelectedPassenger>;
    public isOffloadButtonEnabled: boolean = false;
    public isContinueButtonEnabled: boolean = false;
    public paxList: Array<Passenger>;
    public OrderID: string = "";
    public searchString = "";
    public userdetails: any;
    public PassengerDetails: any;
    public shortCheckin: boolean = false;
    public PassengerDetail: SecurityModel;
    public PassengerList: Array<PaxTemplate> = [];
    public PassengerArray: Array<MultiSegmentTemplate.FlightWithPax> = [];
    public FQTVArray: Array<FQTVInfo> = [];
    public FlightInformation: Array<MultiSegmentTemplate.FlightWithPax> = [];
    public CheckInResponse: any;
    public orderID: string;
    public loaderProgress: LoaderProgress;
    public selectedPassenger: MultiSegmentTemplate.Passenger = new MultiSegmentTemplate.Passenger();
    public dots: Array<any>;
    public currentPage: number = 0;
    public SecurityDetails: Order.RootObject;
    public gender: any;
    public CountryDetails: CountryCollection.Collection;
    public selectedSegment: any;
    public fqtv1: any;
    private seatmapDetails: any;
    public Profile: any;
    public check: boolean = false
    public firstFlightTime: Date;
    public lastFlightTime: Date;
    public DifferenceInTimeDuration: any;
    public fqtv: Array<FqtvPrograms.RootObject> = [];
    public SegmentList: MultiSegmentTemplate.FlightWithPax = new MultiSegmentTemplate.FlightWithPax();
    public tagitems: Array<string>;
    public FlightWithPaxArray: Array<MultiSegmentTemplate.FlightWithPax> = [];
    public index: any = null;
    public MultiSegmentPaxArray: MultiSegmentTemplate.RootObject = new MultiSegmentTemplate.RootObject();
    private DepartureDetails: any;
    public StdCheckIn: boolean = false;
    public UpDownGradeCheckIn: boolean = false;
    public UpDownGradeArray: UpgradeInfoArray = new UpgradeInfoArray();
    public NewUpDownGradeArray: UpgradeInfoArray = new UpgradeInfoArray();
    private DepartureArray: Array<DepartureInfo> = [];
    private DepartureArrayforFQTV: Array<DepartureInfo> = [];
    private locationcode: string;
    public docCheckForCheckin: boolean = false;
    public ShortCheckAirportCode: string = "";
    public SeatProductInfo: Array<SeatMap.SeatProductInformation> = [];
    private date: string;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    public ticketNumbers: string;
    public SSRinArray: Array<string>;
    public printerID: string;
    public isCompensationEnabled: boolean = false;
    public isCheckinPrint: boolean = true;
    public syncTicket: boolean = false;
    public legsInfo: Array<Legs> = [];
    public PassengerLists: Array<MultiSegmentTemplate.Passenger> = [];
    public SeatMapList: SeatMap.RootObject = new SeatMap.RootObject();
    public ShowSeatMapList: SeatMap.Item = new SeatMap.Item();
    public isMultiLegFLight: boolean = false;
    public isSegSelected: Array<boolean> = [];
    public isSecondSegSelected: boolean = true;
    public FirstSegOrigin: string;
    public FirstSegDest: string;
    public SecondSegOrigin: string;
    public SecondSegDest: string;
    public PassengerListForOASeatMap: SeatMapOAPax.RootObject = new SeatMapOAPax.RootObject();
    public static WARNING: string = "Ticket is out of sync with booked itinerary"
    public static TKTOUTOFSYNC: string = "Selected passengers are ticket out of sync passengers. Checkin will be allowed only when those passengers ticket is synced. If you want to checkin non e-ticketed passengers, click 'OK' and unselect the ticket out of sync passenger and proceed to checkin"
    public static APISDATAREQUIRED: string = "ApisDataRequired"
    public static SEATWARNING: string = "Seat selection is not allowed for this passenger type"
    public static NOBLUETOOTHDEVICE: string = "No Bluetooth Printer Found. Please set the Printer in Settings Page"
    public static UNABLETOPRINT: string = "Unable to Print"
    public static PRINTERSESSION: string = "Unable to connect to printer session, try again later"
    public SuffixList: Array<string> = ["MSS", "DR", "MSTR", "MS", "MRS", "MR"]
    public FlightDate: any;
    public isInternational: boolean = false;
    public isShortCheck: boolean = false;
    constructor(private _checkin: CheckinService, public _seatmap: SeatMapService, private _printemail: PrintEmailService, private _configuration: Configuration, private page: Page, public _timeoutService: TimeOutService, private routerExtensions: RouterExtensions, public _dataService: DataService, private router: Router, private _modalService: ModalDialogService, private vcRef: ViewContainerRef, private location: Location, private activatedRouter: ActivatedRoute, public _service: PassengerService, public securityDatas: SecurityModel, public _shared: CheckinOrderService) {
        this.isError = false;
        this.errorMessage = "";
        this.paxList = [];
        this.loaderProgress = new LoaderProgress();
        this.DocumentType = [];
        this.DocumentTypeList = [];
        this.PageDocumentList = [];
        this.DocTypeIndex = [];
        this.DocIssueCountryIndex = [];
        this.ResidenceCodeIndex = [];
        this.NationalityIndex = [];
        this.CountryItems = [];
        this.CountryList = [];
        this.SelectedPassengerList = [];
        this.startDate = new Date();
        this.tagitems = [];
        this.tagitems.push("Standard CheckIn");
        this.tagitems.push("Up/Down Grade Change");
        securityDatas.ApisUpdateRequests = [new ApisUpdateRequest];
        securityDatas.ApisUpdateRequests[0].Documents = [new Document()];
        securityDatas.ApisUpdateRequests[0].ApisRequirements = [new ApisRequirement()];
        securityDatas.ApisUpdateRequests[0].ApisAddressRequirements = [];
        securityDatas.ApisUpdateRequests[0].PhoneNumbers = [new PhoneNumber()];
        securityDatas.ApisUpdateRequests[0].Addresses = [new Address()];

    }

    ngOnInit() {
        // this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.locationcode = "PTY";
        let date1 = new Date()
            .toJSON()
            .slice(0, 10)
            .replace(/-/g, "-");
        this.date = moment(new Date()).format("DD MMM YYYY");
        this.loaderProgress.initLoader(this.pageCont);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled");
        this.router.events.subscribe(() => {
            console.log("checking back");
        });
        this.activatedRouter.queryParams.subscribe(params => {
            if (
                params["data"] != null &&
                params["data"] != "" &&
                params["data"] != "undefined"
            ) {
                this.searchString = params["data"];
                this.index = params["index"];
            }
            if (
                params["profile"] != null &&
                params["profile"] != "" &&
                params["profile"] != "undefined"
            ) {
                this.Profile = params["profile"];
            }
            if (
                params["Paxdata"] != null &&
                params["Paxdata"] != "" &&
                params["Paxdata"] != "undefined"
            ) {
                this.searchString = params["Paxdata"];
            }
            if (
                params["apidata"] != null &&
                params["apidata"] != "" &&
                params["apidata"] != "undefined"
            ) {
                this.searchString = params["apidata"];
            }
            if (
                params["baggage"] != null &&
                params["baggage"] != "" &&
                params["baggage"] != "undefined"
            ) {
                this.searchString = params["baggage"];
                this.index = params["index"];
            }
            if (
                params["PassengerArray"] != null &&
                params["PassengerArray"] != "" &&
                params["PassengerArray"] != "undefined"
            ) {
                this.searchString = params["PassengerArray"];
                this.index = params["index"];
                // this.searchString = this.MultiSegmentPaxArray.Segment[0].Passenger[0].OrderID;
            }
            if (params["shortcheckin"] != null &&
                params["shortcheckin"] != "" &&
                params["shortcheckin"] != "undefined") {
                this.ShortCheckAirportCode = params["shortcheckin"];
            }

            this.OrderID = this.searchString;
        });
        if (
            this.searchString != "" &&
            this.MultiSegmentPaxArray.Segment.length == 0
        ) {
            if (this.searchString.length > 0) {
                if (this.searchString.length == 6) {
                    console.log("inside pnr");
                    // this.isShortCheckin(false);
                    this.getPaxbyOrderID(this.searchString);
                } else if (this.searchString.length == 13) {
                    console.log("inside getPaxbyEticket");
                    this.getPaxbyEticket(this.searchString);
                }
            }
        } else {
            this.FQTV();
        }
        if (this.index != null) {
            if (this.index != this.currentPage) {
                this.currentPage = this.index;

                this.visiblityVal(this.index);
            }
        }
        this.ShowEtktStatus()
        var label = this.pageCont.nativeElement;
        var self = this;
        var observer = label.on(
            "loaded, tap, longPress, swipe, ngModelChange",
            function (args: gestures.GestureEventData) {
                console.log("Event: " + args.eventName);
                console.log(self._timeoutService.timer);
                self._timeoutService.resetWatch();
            }
        );
    }
    ShowEtktStatus() {
        if (this._shared.GetPassenger().Passengers[0].PrimaryTickets != null && this._shared.GetPassenger().Passengers[0].PrimaryTickets.length > 0) {
            if (this._shared.GetPassenger().Passengers[0].PrimaryTickets[0].Tickets != null && this._shared.GetPassenger().Passengers[0].PrimaryTickets[0].Tickets.length > 0) {
                if (this._shared.GetPassenger().Passengers[0].PrimaryTickets[0].Tickets[0].TicketCoupons != null && this._shared.GetPassenger().Passengers[0].PrimaryTickets[0].Tickets[0].TicketCoupons.length > 0) {
                    this.MultiSegmentPaxArray.Segment.forEach((Segment, index) => {
                        if (this._shared.GetPassenger().Passengers[0].PrimaryTickets[0].Tickets[0].TicketCoupons.filter(m => (m.Origin == Segment.Origin && m.Destination == Segment.Destination) || m.SegmentNumber == Segment.RPH).length > 0) {
                            let TicketCoupon = this._shared.GetPassenger().Passengers[0].PrimaryTickets[0].Tickets[0].TicketCoupons.filter(m => m.SegmentNumber == Segment.RPH && m.Origin == this._shared.GetPassenger().Segments.filter(m => m.RPH == Segment.RPH)[0].Origin.AirportCode)[0];
                            if (TicketCoupon) {
                                if (TicketCoupon.CouponStatusText == "Open" || TicketCoupon.CouponStatusText == "ADJUSTED" || TicketCoupon.CouponStatusText == "CHECKED-IN" || TicketCoupon.CouponStatusText == "LIFTED" || TicketCoupon.CouponStatusText == "BOARDED") {
                                    Segment.ETKTStatusNOTOK = false;
                                } else {
                                    Segment.ETKTStatusNOTOK = true;
                                }
                            }
                        } else {
                            Segment.ETKTStatusNOTOK = true;
                        }
                        if (this.MultiSegmentPaxArray.Segment[this.currentPage].isAPISSeatBagDisabled) {
                            this.isContinueButtonEnabled = false;
                            this.isOffloadButtonEnabled = false;
                        }

                    })

                }
            }
        }
    }
    isBaggageAvailable(item: any): boolean {
        if (item.SecurityCode == 'NB' || item.SecurityCode == 'NM' || item.SecurityCode == 'VU' || item.SecurityCode == 'NE' || item.SecurityCode == 'ED' || item.SyncTicket || this.MultiSegmentPaxArray.Segment[this.currentPage].IsInterline || (this.MultiSegmentPaxArray.Warning != null && this.MultiSegmentPaxArray.Warning[0].Message == 'Ticket is out of sync with booked itinerary') || this.MultiSegmentPaxArray.Segment[this.currentPage].ETKTStatusNOTOK || this.MultiSegmentPaxArray.Segment[this.currentPage].isAPISSeatBagDisabled || this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted) {
            return true;
        } else return false;
    }
    isSeatAvailable(item: any): boolean {
        if (item.SecurityCode == 'NB' || item.SecurityCode == 'NM' || item.SecurityCode == 'VU' || item.SecurityCode == 'NE' || item.SecurityCode == 'ED' || item.SyncTicket || (this.MultiSegmentPaxArray.Warning != null && this.MultiSegmentPaxArray.Warning[0].Message == 'Ticket is out of sync with booked itinerary') || this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted) {
            return true
        } else {
            let previousSeg = this.currentPage - 1;
            if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsInterline && !item.CheckinStatus && (previousSeg >= 0 && this.MultiSegmentPaxArray.Segment[previousSeg].Passenger.filter(m => m.RPH == item.RPH)[0].CheckinStatus)) {
                return true;
            } else {
                return false;
            }
        }
    }
    getPrinter(): string {
        if (ApplicationSettings.hasKey("printer")) {
            return ApplicationSettings.getString("printer");
        } else {
            return "";
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

                    this._shared.SetPassenger(<Order.RootObject>data);
                    let scTable: any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
                    let PassengerArray: any = Converters.ConvertToFlightWithPaxTemplate(this._shared.GetPassenger(), null, scTable, "");
                    console.log("PassengerArray Test");
                    console.dir(PassengerArray);
                    if (PassengerArray.Segment.length > 0) {
                        let setdepartureDate: string = moment(PassengerArray.Segment[0].DepartureDateTime.toString()).format("YYYY-MM-DD");
                        let setflightnumber: string;
                        if (PassengerArray.Segment[0].MarketingFlight.substr(0, 2) == "CM") {
                            setflightnumber = PassengerArray.Segment[0].MarketingFlight
                        } else if (PassengerArray.Segment[0].OperatingFlight != null && PassengerArray.Segment[0].OperatingFlight.substr(0, 2) == "CM") {
                            setflightnumber = PassengerArray.Segment[0].OperatingFlight
                        } else {
                            setflightnumber = PassengerArray.Segment[0].MarketingFlight
                        }
                        let setcity: string = PassengerArray.Segment[0].DepartureCity;
                        let AssociatedInfantRPH: string = null;
                        PassengerArray.Segment.forEach((SegEle, SegInndex) => {
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
                            // this._checkin
                            //     .BookingCountDisplay(departureDate, flightnumber, city)
                            //     .subscribe(data => {
                            //         let inventory: any = data;
                            SegEle.inven = this.MultiSegmentPaxArray.Segment[SegInndex].inven;
                            // });

                            //Inbound
                            // this._checkin
                            //     .InBound(departureDate, flightnumber, city)
                            //     .subscribe(data => {
                            //         let inBound: any = data;
                            SegEle.inbound = this.MultiSegmentPaxArray.Segment[SegInndex].inbound;
                            // });

                            //Outbound
                            // this._checkin
                            //     .OutBound(departureDate, flightnumber, destination)
                            //     .subscribe(data => {
                            //         let OutBound: any = data;
                            SegEle.outbound = this.MultiSegmentPaxArray.Segment[SegInndex].outbound;
                            // });

                            //status
                            // this._dataService
                            //     .Status(departureDate, flightnumber, city)
                            //     .subscribe(data => {
                            //         let status: any = data;
                            // console.log(status.Flights);
                            SegEle.status = this.MultiSegmentPaxArray.Segment[SegInndex].status;
                            SegEle.Legs = this.MultiSegmentPaxArray.Segment[SegInndex].Legs;
                            SegEle.STD = this.MultiSegmentPaxArray.Segment[SegInndex].STD;
                            SegEle.ETA = this.MultiSegmentPaxArray.Segment[SegInndex].ETA;
                            SegEle.ETD = this.MultiSegmentPaxArray.Segment[SegInndex].ETD;
                            // });
                        });

                        // this._dataService.GetBaggage(id).subscribe(data => {
                        //     this._shared.SetBaggagecatalog(data);
                        // }, err => {
                        //     console.log(err);
                        // });
                        //Tier
                        // this._dataService
                        //     .Tier(setdepartureDate, setflightnumber, setcity)
                        //     .subscribe(data => {
                        this.ShowEtktStatus()
                        // let tier: any = data;
                        // this._shared.SetTier(tier);
                        this._shared.SetSegmentDetail(PassengerArray);
                        this.MultiSegmentPaxArray = PassengerArray;
                        this._shared.GetSegmentDetail().Segment.forEach((SegEle, SegInndex) => {
                            this.MultiSegmentPaxArray.Segment[SegInndex].status = SegEle.status;
                            this.MultiSegmentPaxArray.Segment[SegInndex].outbound = SegEle.outbound;
                            this.MultiSegmentPaxArray.Segment[SegInndex].inbound = SegEle.inbound;
                            this.MultiSegmentPaxArray.Segment[SegInndex].inven = SegEle.inven;
                        });
                        this.PassengerArray = this.MultiSegmentPaxArray.Segment;
                        this.MultiSegmentPaxArray.Segment.forEach((SegData, SegIndex) => {
                            var setdepartureDate = moment(
                                SegData.DepartureDateTime.toString()
                            ).format("YYYY-MM-DD");
                            var setflightnumber = SegData.MarketingFlight;
                            var setcity = SegData.DepartureCity;
                            console.log("FLight:" + setflightnumber);
                            console.log(SegData.OperatingFlight);
                            if (setflightnumber.substr(0, 2) == "CM" && SegData.OperatingFlight == null) {
                                SegData.IsInterline = false;
                                this.loaderProgress.hideLoader();
                                //     });
                            } else {
                                this.loaderProgress.hideLoader();
                                if (SegData.OperatingFlight != null && SegData.OperatingFlight.substr(0, 2) == "CM") {
                                    SegData.IsInterline = false
                                } else {
                                    SegData.IsInterline = true
                                }
                            }
                        });
                        this.routerExtensions.navigate(["checkin"], {
                            animated: false,
                            transition: {
                                name: "fade",
                                duration: 10,
                                curve: "linear"
                            },
                            queryParams: {
                                data: id,
                                index: this.index
                            }
                        });

                        // }, err => {
                        //     console.log(err);
                        //     this.loaderProgress.hideLoader();
                        // });
                        this.dots = [];
                        for (var i = 0; i < this.MultiSegmentPaxArray.Segment.length; i++) {
                            this.dots.push({ check: false });
                        }
                        this.dots[0].check = true;
                        this.check = false;
                        this.isPrintbtnEnabled();
                        console.log("SSR" + PassengerArray.Passenger.SSR);
                    } else {
                        this.loaderProgress.hideLoader();
                        Toast.makeText("Record Not Found").show();
                    }
                },
                err => {
                    console.log("Couldnt find information for this OrderID " + err);
                    this.handleServiceError(err);
                    // var errorMessage = err.toString();
                    // if (errorMessage.indexOf("Unrecognized token '<'") != -1) {
                    //     var options = {
                    //         title: "Session Time Out",
                    //         message: "Your session has been time out",
                    //         okButtonText: "OK"
                    //     };
                    //     dialogs.alert(options).then(() => {
                    //         this.navigateToLogin();
                    //     });
                    // }
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

    getPaxbyEticket(id: string): void {
        try {
            this.loaderProgress.showLoader();
            var startDate = new Date();
            this.PassengerDetails = this._shared.GetPassengerETicket();
            let scTable: any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
            this.MultiSegmentPaxArray = Converters.ConvertToFlightWithPaxTemplate(
                this.PassengerDetails,
                this._shared.GetStatus(),
                scTable, ""
            );
            console.dir(this.MultiSegmentPaxArray);
            this._shared.GetSegmentDetail().Segment.forEach((SegEle, SegInndex) => {
                this.MultiSegmentPaxArray.Segment[SegInndex].status = SegEle.status;
                this.MultiSegmentPaxArray.Segment[SegInndex].outbound = SegEle.outbound;
                this.MultiSegmentPaxArray.Segment[SegInndex].inbound = SegEle.inbound;
                this.MultiSegmentPaxArray.Segment[SegInndex].inven = SegEle.inven;
                this.MultiSegmentPaxArray.Segment[SegInndex].date = SegEle.date;
                this.MultiSegmentPaxArray.Segment[SegInndex].ETA = SegEle.ETA;
                this.MultiSegmentPaxArray.Segment[SegInndex].ETD = SegEle.ETD;
                this.MultiSegmentPaxArray.Segment[SegInndex].STD = SegEle.STD;
                this.MultiSegmentPaxArray.Segment[SegInndex].Legs = SegEle.Legs;
            });
            this.PassengerArray = this.MultiSegmentPaxArray.Segment;
            this.dots = [];
            for (var i = 0; i < this.MultiSegmentPaxArray.Segment.length; i++) {
                this.dots.push({ check: false });
            }
            this.dots[0].check = true;
            if (this.PassengerArray.length > 0) {
                let orderID: string = this.PassengerArray[0].Passenger[0].OrderID;
                this.FlightInformation = new Array<
                    MultiSegmentTemplate.FlightWithPax
                >();
                this.MultiSegmentPaxArray.Segment.forEach((SegData, SegIndex) => {
                    var setdepartureDate = moment(
                        SegData.DepartureDateTime.toString()
                    ).format("YYYY-MM-DD");
                    var setflightnumber = SegData.MarketingFlight;
                    var setcity = SegData.DepartureCity;
                    if (setflightnumber.substr(0, 2) == "CM" && SegData.OperatingFlight == null) {
                        SegData.IsInterline = false;
                        this._dataService
                            .Tier(setdepartureDate, setflightnumber, setcity)
                            .subscribe(data => {
                                let tier: any = data;
                                console.log("All" + JSON.stringify(tier.FlightInfo.FlightNumber));
                                SegData.Passenger.forEach((PaxData, PaxIndex) => {
                                    console.log("in");
                                    tier.PassengerList.forEach((AllPaxdata, AllIndex) => {
                                        if (AllPaxdata.OrderId == PaxData.OrderID) {
                                            console.log("in");
                                            if (
                                                PaxData.FirstName == AllPaxdata.GivenName &&
                                                PaxData.LastName == AllPaxdata.Surname
                                            ) {
                                                console.log("in");
                                                AllPaxdata.PassengerCharacteristics.forEach(
                                                    (tierData, tierIndex) => {
                                                        if (tierData == "TicketOutOfSync") {
                                                            PaxData.SyncTicket = true;
                                                        }
                                                        if (this.MultiSegmentPaxArray.Warning != null && this.MultiSegmentPaxArray.Warning[0].Message == 'Ticket is out of sync with booked itinerary') {
                                                            PaxData.SyncTicket = true;
                                                        }
                                                        if (tierData == "OnStandby") {
                                                            PaxData.OnStandby = true;
                                                        }
                                                        if (tierData == "Oversold") {
                                                            PaxData.Oversold = true;
                                                        }
                                                        if (AllPaxdata.SeatList != null) {
                                                            PaxData.Cabin = AllPaxdata.SeatList[0].Cabin;
                                                            console.log(AllPaxdata.SeatList[0].Cabin + "Cabin");
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    });
                                });
                                this.loaderProgress.hideLoader();
                            }, err => {
                                console.log(err)
                                this.handleServiceError(err);
                                this.loaderProgress.hideLoader();
                            });
                    } else {
                        this.loaderProgress.hideLoader();
                        if (SegData.OperatingFlight != null && SegData.OperatingFlight.substr(0, 2) == "CM") {
                            SegData.IsInterline = false
                        } else {
                            SegData.IsInterline = true
                        }
                    }
                });
                this.FQTV();
                this.loaderProgress.hideLoader();
            } else {
                this.loaderProgress.hideLoader();
            }
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        } finally {
            var endDate = new Date();
            console.log(
                "SearchPaxByEticket Service --------------- End Date Time : " + endDate
            );
            console.log(
                "SearchPaxByEticket Service Execution Time : " +
                AppExecutiontime.ExecutionTime(new Date(startDate), new Date(endDate))
            );
            // setTimeout(() => {
            //     this.loaderProgress.hideLoader();
            // }, 1490);
        }
    }
    SSrmore(item) {
        let options = {
            title: "SSR",

            cancelButtonText: "BACK",
            actions: item
        };
        dialogs.action(options).then(result => {
            console.log("ssr");
        });
    }
    getPaxbyOrderID(id: string): void {
        try {
            this.loaderProgress.showLoader();
            console.log("here");
            var startDate = new Date();
            console.log(
                "SearchPaxByOrderID Service --------------- Start Date Time : " +
                startDate
            );
            this.PassengerDetails = null;
            this.PassengerDetails = this._shared.GetPassenger();
            this.MultiSegmentPaxArray = this._shared.GetSegmentDetail();
            this.FlightDate = moment(this.MultiSegmentPaxArray.Segment[0].FlightDate).format("DD-MMM-YYYY");
            console.dir(this.PassengerDetails);
            let scTable: any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
            this.MultiSegmentPaxArray = Converters.ConvertToFlightWithPaxTemplate(this.PassengerDetails, this._shared.GetStatus(), scTable, "");
            console.log("SSR" + this.MultiSegmentPaxArray.Segment[0].Passenger[0].SSR[0]);
            this.ticketNumbers = this.MultiSegmentPaxArray.Segment[0].Passenger[0].TicketNumbers;
            console.log(this.ticketNumbers);
            let AssociatedInfantRPH: string = null;
            this._shared.GetSegmentDetail().Segment.forEach((SegEle, SegInndex) => {
                this.MultiSegmentPaxArray.Segment[SegInndex].outbound = SegEle.outbound;
                this.MultiSegmentPaxArray.Segment[SegInndex].inbound = SegEle.inbound;
                this.MultiSegmentPaxArray.Segment[SegInndex].inven = SegEle.inven;
                this.MultiSegmentPaxArray.Segment[SegInndex].date = SegEle.date;
                this.MultiSegmentPaxArray.Segment[SegInndex].Legs = SegEle.Legs;
                if (SegEle.Legs) {
                    this.MultiSegmentPaxArray.Segment[SegInndex].status = SegEle.status;
                    let OriginlocDetails = SegEle.Legs.filter(m => m.DepartureAirport.LocationCode == SegEle.Origin)[0];
                    this.MultiSegmentPaxArray.Segment[SegInndex].ETD = OriginlocDetails.DepartureDateTime.Estimated.toString().substr(11, 5);
                    this.MultiSegmentPaxArray.Segment[SegInndex].STD = OriginlocDetails.DepartureDateTime.Scheduled.toString().substr(11, 5);
                    this.MultiSegmentPaxArray.Segment[SegInndex].ETA = OriginlocDetails.ArrivalDateTime.Scheduled.toString().substr(11, 5);
                }else{
                    this.MultiSegmentPaxArray.Segment[SegInndex].status = "N/A";
                    this.MultiSegmentPaxArray.Segment[SegInndex].ETD = "N/A";
                    this.MultiSegmentPaxArray.Segment[SegInndex].STD = "N/A";
                    this.MultiSegmentPaxArray.Segment[SegInndex].ETA = "N/A"; 
                }
                console.log("legs" + SegEle.ETA);
                console.log("legs" + SegEle.ETD);
                console.log("legs" + SegEle.Legs);
                console.log("legs" + JSON.stringify(this.MultiSegmentPaxArray.Segment[SegInndex].Legs));
                if (SegEle.CheckinStatus && SegEle.AssociatedInfantRPH != null) {
                    AssociatedInfantRPH = SegEle.AssociatedInfantRPH;
                }
                if (AssociatedInfantRPH != null) {
                    if (AssociatedInfantRPH == SegEle.RPH) {
                        SegEle.CheckinStatus = true;
                        AssociatedInfantRPH = null;
                    }
                }
            });

            this.PassengerArray = this.MultiSegmentPaxArray.Segment;
            console.log(this.PassengerArray);
            this.dots = [];
            for (var i = 0; i < this.MultiSegmentPaxArray.Segment.length; i++) {
                this.dots.push({ check: false });
            }
            this.dots[0].check = true;
            if (this.PassengerArray.length > 0) {
                let orderID: string = id;
                this.FlightInformation = new Array<MultiSegmentTemplate.FlightWithPax>();

                this.MultiSegmentPaxArray.Segment.forEach((SegData, SegIndex) => {
                    var setdepartureDate = moment(SegData.DepartureDateTime.toString()).format("YYYY-MM-DD");
                    var setflightnumber = SegData.MarketingFlight;
                    var setcity = SegData.DepartureCity;
                    console.log("FLight:" + setflightnumber);
                    console.log(SegData.OperatingFlight);
                    if (setflightnumber.substr(0, 2) == "CM" && SegData.OperatingFlight == null) {
                        // this._dataService
                        //     .Tier(setdepartureDate, setflightnumber, setcity)
                        //     .subscribe(data => {
                        // let tier: any = this._shared.GetTier();
                        SegData.IsInterline = false;
                        // SegData.Passenger.forEach((PaxData, PaxIndex) => {
                        //     console.log("in1");
                        //     if (tier.PassengerList != null) {
                        //         tier.PassengerList.forEach((AllPaxdata, AllIndex) => {
                        //             if (AllPaxdata.OrderId == PaxData.OrderID) {
                        //                 console.log("in2" + PaxData.OrderID);
                        //                 if (
                        //                     PaxData.FirstName == AllPaxdata.GivenName &&
                        //                     PaxData.LastName == AllPaxdata.Surname
                        //                 ) {

                        //                     PaxData.PassengerSeqNumber = AllPaxdata.PassengerRefNumber;
                        //                     console.log("in3" + PaxData.PassengerSeqNumber);
                        //                     if (AllPaxdata.PassengerCharacteristics != null) {
                        //                         AllPaxdata.PassengerCharacteristics.forEach(
                        //                             (tierData, tierIndex) => {
                        //                                 console.log("in4");
                        //                                 if (tierData == "TicketOutOfSync") {
                        //                                     console.log("in5");
                        //                                     PaxData.SyncTicket = true;
                        //                                 }
                        //                                 if (this.MultiSegmentPaxArray.Warning != null && this.MultiSegmentPaxArray.Warning[0].Message == 'Ticket is out of sync with booked itinerary') {
                        //                                     PaxData.SyncTicket = true;
                        //                                 }
                        //                                 if (tierData == "OnStandby") {
                        //                                     PaxData.OnStandby = true;
                        //                                 }
                        //                                 if (tierData == "Oversold") {
                        //                                     PaxData.Oversold = true;
                        //                                 }
                        //                                 if (AllPaxdata.SeatList != null) {
                        //                                     PaxData.Cabin = AllPaxdata.SeatList[0].Cabin;
                        //                                     console.log(
                        //                                         AllPaxdata.SeatList[0].Cabin + "Cabin"
                        //                                     );
                        //                                 }
                        //                             }
                        //                         );
                        //                     }
                        //                 }
                        //             }
                        //         });
                        //     }
                        // });

                        this.loaderProgress.hideLoader();
                        // },
                        // error => {
                        //     console.log("Couldnt find information for this OrderID " + error);
                        //     this.handleServiceError(error);
                        //     this.loaderProgress.hideLoader();
                        // });
                    } else {
                        this.loaderProgress.hideLoader();
                        if (SegData.OperatingFlight != null && SegData.OperatingFlight.substr(0, 2) == "CM") {
                            SegData.IsInterline = false
                        } else {
                            SegData.IsInterline = true
                        }
                    }
                });
            } else {
                this.loaderProgress.hideLoader();
            }
            this.FQTV();
            // this.loaderProgress.hideLoader();
            if (this._shared.GetIsWaitlisted()) {
                this._shared.GetPassenger().Passengers.forEach((passenger, index) => {
                    if (passenger.PassengerTypeCode != "INF") {
                        let obj = new PassengerCheckin.SelectedPassenger();
                        obj.FirstName = passenger.Firstname;
                        obj.LastName = passenger.Lastname;
                        this.SelectedPassengerList.push(obj);
                    }
                })
                console.log(this.SelectedPassengerList);
                this.SegmentList = this.MultiSegmentPaxArray.Segment[this.currentPage];
                let checkintype = "Waitlist";
                let request: CheckInPostTemplate.WaitlistRootObject = Converters.ConvertToWaitlistCheckInPostTemplate(this.PassengerArray, "CheckIn", this.SelectedPassengerList, this.SegmentList, checkintype, this.ShortCheckAirportCode, this._shared.GetBagTag());
                this.loaderProgress.showLoader();
                this._checkin.CheckInPax(request).subscribe(data => {
                    this.CheckInResponse = data;
                    console.dir(this.CheckInResponse);
                    this._service.GetPassengerrefresh(id)
                        .subscribe(data => {
                            this._shared.SetPassenger(<Order.RootObject>data);
                            var POSLocation = ApplicationSettings.getString("userdetails", "").substr(0, 3);
                            if (!data.Segments.filter(m => m.Origin.AirportCode == POSLocation)[0].Status.isWaitlistedPassenger) {
                                this._shared.SetIsWaitlisted(false);
                            }
                            this.loaderProgress.hideLoader();
                        }, err => {
                            console.log(err)
                            this.handleServiceError(err);
                            this.loaderProgress.hideLoader();
                        });
                },
                    error => {
                        console.log("Couldnt find information for this OrderID " + error);
                        this.loaderProgress.hideLoader();
                        if (error != null) {
                            Toast.makeText(error).show();
                            this.MultiSegmentPaxArray.Segment.forEach((seg, index) => {
                                seg.ETKTStatusNOTOK = true
                            })
                        }
                    },
                    () => {
                        console.log("Done");
                        // this.loaderProgress.hideLoader();
                    });
            }
            else {

            }

        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        } finally {
            var endDate = new Date();
            console.log(
                "SearchPaxByOrderID Service --------------- End Date Time : " + endDate
            );
            console.log(
                "SearchPaxByOrderID Service Execution Time : " +
                AppExecutiontime.ExecutionTime(new Date(startDate), new Date(endDate))
            );
            // setTimeout(() => {
            //     this.loaderProgress.hideLoader();
            // }, 15000);
        }
    }

    FQTV(): void {
        this.fqtv1 = this._shared.GetFQTV();
        this.fqtv.length = 0;
        this.MultiSegmentPaxArray.Segment.forEach((SegEle, SegIndex) => {
            SegEle.Passenger.forEach((PaxEle, PaxIndex) => {
                PaxEle.FqtvPrograms = Converters.ConvertToFQTV(this.fqtv1);
                //  console.dir(PaxEle.FqtvPrograms);
            });
        });
    }
    getSecurityDoc(id: string, item: MultiSegmentTemplate.Passenger, indexOfPassener: any): void {
        try {
            console.log(indexOfPassener);
            var sDate = new Date();
            console.log(
                "Get Passenger Service --------------- Start Date Time : " + sDate
            );
            this._shared.SetAdultSecurityData(null);
            this._shared.SetSecurityDocument(null);
            this.loaderProgress.showLoader();
            let board = this.MultiSegmentPaxArray.Segment[this.currentPage].Origin
            this._service.GetPassenger(id, board).subscribe(data => {
                this._shared.SetPassenger(data);
                let scTable: any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
                let PassengerArray: any = Converters.ConvertToFlightWithPaxTemplate(this._shared.GetPassenger(), null, scTable, "");
                let multiSegment = PassengerArray;
                multiSegment.Segment.forEach((seg, index) => {
                    seg.Legs = this.MultiSegmentPaxArray.Segment[index].Legs;
                    seg.inbound = this.MultiSegmentPaxArray.Segment[index].inbound;
                    seg.outbound = this.MultiSegmentPaxArray.Segment[index].outbound;
                    seg.inven = this.MultiSegmentPaxArray.Segment[index].inven;
                    seg.status = this.MultiSegmentPaxArray.Segment[index].status;
                    seg.FlightDate = this.MultiSegmentPaxArray.Segment[index].FlightDate;
                });
                this._shared.SetSegmentDetail(multiSegment);
                this.SecurityDetails = this._shared.GetPassenger();
                if (this.SecurityDetails.Passengers.length > 0) {
                    this.SecurityDetails.Passengers.forEach((passenger, index) => {
                        if (passenger.Documents.length == 0) {
                            passenger.Documents = [new Document()];
                        }
                    })
                }
                //this._shared.SetPassenger(data);
                this.SecurityDetails.Passengers.forEach((element, index) => {
                    if (element.ApisDocoStatus != "Complete" || (element.ApisDocoStatus == "Complete" && element.Documents.length > 0 && element.Documents[0].IsTrustedData != true)) {
                        if (this._shared.GetAPISDocument() != null) {
                            let suffixList = element.Firstname.split(this._shared.GetAPISDocument().Firstname.replace(" ", ""));
                            let suffix = '';
                            if (suffixList.length > 1) {
                                suffix = suffixList[1];
                            }
                            console.log(suffix);
                            if ((element.Firstname == this._shared.GetAPISDocument().Firstname.replace(" ", "") && element.Lastname == this._shared.GetAPISDocument().Surname.replace(" ", "")) || (element.Lastname == this._shared.GetAPISDocument().Surname.replace(" ", "") && this.SuffixList.filter(m => m == suffix.toUpperCase()).length > 0)) {
                                console.log("inside");
                                this.SecurityDetails.Passengers[index].Documents[0] = this._shared.GetAPISDocument();
                                this.SecurityDetails.Passengers[index].Documents[0].CountryOfResidence = null;
                                // if (this.SuffixList.filter(m => m == suffix.toUpperCase()).length > 0) {
                                //     this._shared.GetAPISDocument().Firstname = this._shared.GetScanAPISDocument().Firstname.replace(" ", "") + suffix;
                                // }
                                this.SecurityDetails.Passengers[index].Documents[0].inputType = "Machine Readable"
                                if (this._shared.GetCountry().Collection.filter(m => m.ISO3CountryCode == this._shared.GetAPISDocument().DocIssueCountry).length > 0) {
                                    let issueCountry = this._shared.GetCountry().Collection.filter(m => m.ISO3CountryCode == this._shared.GetAPISDocument().DocIssueCountry)[0].CountryCode.toString();
                                    this.SecurityDetails.Passengers[index].Documents[0].DocIssueCountry = issueCountry
                                }
                                if (this._shared.GetCountry().Collection.filter(m => m.ISO3CountryCode == this._shared.GetAPISDocument().CountryOfResidence).length > 0) {
                                    let residenceCountry = this._shared.GetCountry().Collection.filter(m => m.ISO3CountryCode == this._shared.GetAPISDocument().CountryOfResidence)[0].CountryCode.toString();
                                    this.SecurityDetails.Passengers[index].Documents[0].CountryOfResidence = residenceCountry;
                                }
                                if (this._shared.GetCountry().Collection.filter(m => m.ISO3CountryCode == this._shared.GetAPISDocument().DocHolderNationality).length > 0) {
                                    let docHolderNationality = this._shared.GetCountry().Collection.filter(m => m.ISO3CountryCode == this._shared.GetAPISDocument().DocHolderNationality)[0].CountryCode.toString();
                                    this.SecurityDetails.Passengers[index].Documents[0].DocHolderNationality = docHolderNationality;
                                }
                            } else {
                                this.SecurityDetails.Passengers[index].Documents[0].inputType = "Manual"
                            }
                        }
                    }
                });
                let apisPassenger: any = this.SecurityDetails.Passengers;
                console.dir(this.SecurityDetails);
                let groupedName: string = this.SecurityDetails.Passengers.filter(m => m.Firstname == item.FirstName && m.Lastname == item.LastName)[0].GroupedGivenName;
                let passengerNames: Array<any> = apisPassenger.filter(m => m.GroupedGivenName == groupedName);
                let groupArray: Array<string> = groupedName.split('/')
                let selectedGroupArray: Array<any> = [];
                let selectedINFGroupArray: Array<any> = [];
                selectedGroupArray.length = 0;
                selectedINFGroupArray.length = 0;
                let PassengerIndex: Array<number> = [];
                let PassengerINFIndex: Array<number> = [];
                PassengerIndex.length = 0;
                PassengerINFIndex.length = 0;
                // this.PassengerArray.forEach((element,index)=>{
                // let passenger:MultiSegmentTemplate.Passenger = new MultiSegmentTemplate.Passenger();
                // })
                let isDone: boolean = false;
                if (groupedName != "" && groupedName.split('/').length > 1) {
                    groupedName.split('/').forEach((element, gIndex) => {
                        if (item.FirstName == element) {
                            apisPassenger.forEach((pass, i) => {
                                if (pass.Firstname == item.FirstName && pass.Lastname == item.LastName) {
                                    if (pass.AdcDecisionStatus == "OK" && pass.ApisDocoStatus == "Complete") {
                                        isDone = true;
                                    }
                                    else if (pass.AdcDecisionStatus == null && pass.ApisDocoStatus == "Complete") {
                                        isDone = true;
                                    }
                                    else if (pass.AdcDecisionStatus == "COK" && pass.ApisDocoStatus == "Complete") {
                                        isDone = true;
                                    }
                                    else if ((pass.AdcDecisionStatus == "BYPASSED" || pass.AdcDecisionStatus == "AUTOBYPASSED") && pass.ApisDocoStatus == "Complete") {
                                        isDone = true;
                                    }
                                    PassengerIndex.push(i);
                                    PassengerINFIndex.push(i);
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
                                    if (pass.AdcDecisionStatus == "OK" && pass.ApisDocoStatus == "Complete") {
                                        //isDone = true;
                                    }
                                    else if (pass.AdcDecisionStatus == null && pass.ApisDocoStatus == "Complete") {
                                        //isDone = true;
                                    }
                                    else if (pass.AdcDecisionStatus == "COK" && pass.ApisDocoStatus == "Complete") {
                                        //isDone = true;
                                    }
                                    else if ((pass.AdcDecisionStatus == "BYPASSED" || pass.AdcDecisionStatus == "AUTOBYPASSED") && pass.ApisDocoStatus == "Complete") {
                                        //isDone = true;
                                    }
                                    selectedGroupArray.push(groupInitial);
                                    selectedINFGroupArray.push(groupInitial);
                                }
                            });
                            //}
                        }
                    })
                }
                else {
                    this.SecurityDetails.Passengers.forEach((pass, index) => {
                        if (pass.Firstname == item.FirstName && pass.Lastname == item.LastName && pass.RPH == item.RPH) {
                            PassengerIndex.push(index);
                            PassengerINFIndex.push(index);
                        }
                    })
                }
                let selectedPassengerList: Array<MultiSegmentTemplate.Passenger> = [new MultiSegmentTemplate.Passenger()];
                selectedPassengerList.length = 0;
                this.MultiSegmentPaxArray.Segment.forEach((element, index) => {
                    if (groupedName != null && groupedName != "") {
                        groupedName.split('/').forEach((groups, gIndex) => {
                            selectedPassengerList.push(element.Passenger.filter(m => m.FirstName == groups)[0])
                        });
                    }
                });
                //let itemIndex:any = 0;
                console.dir(selectedPassengerList);
                console.dir(groupArray);
                this.securityDatas.ApisUpdateRequests.length = 0;
                //let securityDataList: Array<SecurityModel> = []
                //securityDataList.length = 0;
                // securityDataList[0].ApisUpdateRequests.length = 0;
                //this.securityDatas.ApisUpdateRequests[0].Documents.length = 0;
                let isInternational: boolean = false;
                this.MultiSegmentPaxArray.Segment.forEach((seg, index) => {
                    if (seg.IsInternational) {
                        isInternational = true;
                    }
                });
                if (isInternational) {
                    let apisItem: Array<MultiSegmentTemplate.Passenger> = [new MultiSegmentTemplate.Passenger()];
                    apisItem.length = 0;
                    this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.forEach((passElements, index) => {
                        apisItem.push(passElements);
                    });
                    let ADCbyPass: any[] = this._shared.GetStartupTable().Tables.ByPass;
                    this.SecurityDetails.Passengers.forEach((element, index) => {
                        if (groupArray.length > 1) {
                            if (groupArray.filter(m => m == this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger[index].FirstName).length > 0) {
                                item = this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger[index];
                            }
                            let isContinue: boolean = false;
                            if (element.AdcDecisionStatus == "OK" && element.ApisDocoStatus == "Complete") {
                                isContinue = true;
                            }
                            else if (element.AdcDecisionStatus == "COK" && element.ApisDocoStatus == "Complete") {
                                isContinue = true;
                            }
                            else if ((element.AdcDecisionStatus == "BYPASSED" || element.AdcDecisionStatus == "AUTOBYPASSED") && element.ApisDocoStatus == "Complete") {
                                isContinue = true;
                            }
                            if (!isContinue) {
                                if (PassengerIndex[0] != index) {
                                    if (selectedGroupArray.length > 0) {
                                        selectedGroupArray.forEach(groupName => {
                                            if (groupName.Firstname == element.Firstname && groupName.Lastname == element.Lastname) {
                                                PassengerIndex.push(index);
                                                PassengerINFIndex.push(index);
                                            }
                                        })
                                    }
                                }
                            }
                        }
                        // item.LastName = this.SecurityDetails.Passengers[0].Lastname;
                        //if (element.Firstname == item.FirstName && element.Lastname == item.LastName) {
                        //if(this.SecurityDetails.Passengers[0].Documents[0].Firstname != null)
                        //{
                        console.log(this.SecurityDetails);
                        let apisUpdateRequests: ApisUpdateRequest = new ApisUpdateRequest()
                        this.PassengerDetail = Converters.ConvertToPassengersDetail(this.SecurityDetails, apisItem[index], this.CountryList, this.CountryItems, ADCbyPass);
                        console.dir(this.PassengerDetail);
                        this.securityDatas.ApisDocoStatus = element.ApisDocoStatus;
                        this.securityDatas.ADCStatus = element.AdcDecisionStatus;
                        this.securityDatas.BypassADC = null;
                        this.securityDatas.OrderUpdateRequests = null;
                        //securityDataList.push(this.securityDatas);
                        apisUpdateRequests.Lastname = this.PassengerDetail.ApisUpdateRequests[0].Lastname;
                        apisUpdateRequests.Firstname = this.PassengerDetail.ApisUpdateRequests[0].Firstname;
                        apisUpdateRequests.SurnameRefNumber = this.PassengerDetail.ApisUpdateRequests[0].SurnameRefNumber;
                        apisUpdateRequests.Prefix = this.PassengerDetail.ApisUpdateRequests[0].Prefix;
                        apisUpdateRequests.RPH = this.PassengerDetail.ApisUpdateRequests[0].RPH;
                        apisUpdateRequests.Emails = this.PassengerDetail.ApisUpdateRequests[0].Emails;
                        apisUpdateRequests.Gender = this.PassengerDetail.ApisUpdateRequests[0].Gender;
                        apisUpdateRequests.PassengerTypeCode = this.PassengerDetail.ApisUpdateRequests[0].PassengerTypeCode;
                        apisUpdateRequests.DateOfBirth = this.PassengerDetail.ApisUpdateRequests[0].DateOfBirth;
                        apisUpdateRequests.Age = this.PassengerDetail.ApisUpdateRequests[0].Age;
                        apisUpdateRequests.FqtTravelers = this.PassengerDetail.ApisUpdateRequests[0].FqtTravelers;
                        apisUpdateRequests.AssociatedInfantRPH = this.PassengerDetail.ApisUpdateRequests[0].AssociatedInfantRPH;
                        apisUpdateRequests.AssociatedAdultRPH = this.PassengerDetail.ApisUpdateRequests[0].AssociatedAdultRPH;
                        apisUpdateRequests.Nationality = this.PassengerDetail.ApisUpdateRequests[0].Nationality;
                        apisUpdateRequests.ApisRequirements = [new ApisRequirement()];
                        apisUpdateRequests.ApisAddressRequirements = []
                        apisUpdateRequests.PhoneNumbers = [new PhoneNumber()];
                        apisUpdateRequests.PhoneNumbers = item.PhoneNumbers;
                        apisUpdateRequests.Addresses = [new Address()];
                        apisUpdateRequests.Addresses = this.PassengerDetail.ApisUpdateRequests[0].Addresses;
                        apisUpdateRequests.Documents = [new Document()];
                        apisUpdateRequests.EmergencyDetails = [new EmergencyDetail()];
                        apisUpdateRequests.EmergencyDetails[0].EmergencyPhone = new EmergencyPhone();
                        apisUpdateRequests.KnownTravelerNumber = this.PassengerDetail.ApisUpdateRequests[0].KnownTravelerNumber;
                        apisUpdateRequests.OldKnownTravelerNumber = this.PassengerDetail.ApisUpdateRequests[0].KnownTravelerNumber;
                        apisUpdateRequests.RedressNumber = this.PassengerDetail.ApisUpdateRequests[0].RedressNumber;
                        apisUpdateRequests.OldRedressNumber = this.PassengerDetail.ApisUpdateRequests[0].OldRedressNumber;
                        apisUpdateRequests.FOID = this.PassengerDetail.ApisUpdateRequests[0].FOID;
                        apisUpdateRequests.OldNationality = this.PassengerDetail.ApisUpdateRequests[0].OldNationality;
                        apisUpdateRequests.OldDateOfBirth = this.PassengerDetail.ApisUpdateRequests[0].OldDateOfBirth;
                        apisUpdateRequests.OldGender = this.PassengerDetail.ApisUpdateRequests[0].OldGender;
                        apisUpdateRequests.OldEmergencyDetails = this.PassengerDetail.ApisUpdateRequests[0].EmergencyDetails;
                        apisUpdateRequests.Nationality = this.PassengerDetail.ApisUpdateRequests[0].Nationality;
                        apisUpdateRequests.GivenName = this.PassengerDetail.ApisUpdateRequests[0].GivenName;
                        // this.securityDatas.ApisUpdateRequests[0].AssociatedPassenger = this.PassengerDetail.ApisUpdateRequests[0].AssociatedPassenger;
                        apisUpdateRequests.EmergencyDetails = this.PassengerDetail.ApisUpdateRequests[0].EmergencyDetails;
                        apisUpdateRequests.PurposeOfVisit = this.PassengerDetail.ApisUpdateRequests[0].PurposeOfVisit != "" ? "Tourist" : this.PassengerDetail.ApisUpdateRequests[0].PurposeOfVisit;
                        apisUpdateRequests.ExitDateJustification = this.PassengerDetail.ApisUpdateRequests[0].ExitDateJustification;
                        apisUpdateRequests.ExitDate = this.PassengerDetail.ApisUpdateRequests[0].ExitDate;
                        if (this._shared.GetAPISDocument() != null) {
                            console.dir(this.PassengerDetail);
                            this.PassengerDetail.ApisUpdateRequests.forEach((passengerElement, passIndex) => {
                                passengerElement.Documents.forEach((element, apisIndex) => {
                                    let suffixList = passengerElement.Firstname.split(this._shared.GetAPISDocument().Firstname.replace(" ", ""));
                                    let suffix = '';
                                    if (suffixList.length > 1) {
                                        suffix = suffixList[1];
                                    }
                                    console.log(suffix);
                                    if ((this._shared.GetAPISDocument().Surname.replace(" ", "") == item.LastName && this._shared.GetAPISDocument().Firstname.replace(" ", "") == item.FirstName) || (item.LastName == this._shared.GetAPISDocument().Surname.replace(" ", "") && this.SuffixList.filter(m => m == suffix.toUpperCase()).length > 0)) {
                                        // this.PassengerDetail.ApisUpdateRequests[passIndex].Documents[0] = this._shared.GetAPISDocument();
                                        // this.PassengerDetail.ApisUpdateRequests[passIndex].Documents[0].inputType = "Machine Readable"
                                        // console.log(this._shared.GetAPISDocument().DocIssueCountry);
                                        // console.log(this._shared.GetCountry().Collection.filter(m => m.ISO3CountryCode == this._shared.GetAPISDocument().DocIssueCountry)[0])
                                        // console.log(this._shared.GetCountry().Collection.filter(m => m.ISO3CountryCode == this._shared.GetAPISDocument().CountryOfResidence)[0])
                                        // console.log(this._shared.GetCountry().Collection.filter(m => m.ISO3CountryCode == this._shared.GetAPISDocument().DocHolderNationality)[0])
                                        if (this.PassengerDetail.ApisDocoStatus != "Complete" || (this.PassengerDetail.ApisDocoStatus == "Complete" && passengerElement.Documents.length > 0 && passengerElement.Documents[0].IsTrustedData != true)) {
                                            this.PassengerDetail.ApisUpdateRequests[passIndex].Documents[0].CountryOfResidence = null;
                                            this.PassengerDetail.ApisUpdateRequests[passIndex].Documents[0].OCRString = this._shared.GetAPISDocument().OCRString.split('\n')[0];
                                            this.PassengerDetail.ApisUpdateRequests[passIndex].Documents[0].IsTrustedData = true;
                                        }
                                        // this.PassengerDetail.ApisUpdateRequests[passIndex].Documents.forEach((element, index) => {
                                        //     this.PassengerDetail.ApisUpdateRequests[passIndex].Documents[index].Firstname = this._shared.GetAPISDocument().Firstname.replace(" ", "");
                                        // })
                                    }
                                    else if (element.Surname == item.LastName && element.Firstname == item.FirstName) {
                                        element.OCRString = null;
                                        this.PassengerDetail.ApisUpdateRequests[passIndex].Documents.push(element);
                                    }
                                });
                            })
                        }
                        apisUpdateRequests.Documents = this.PassengerDetail.ApisUpdateRequests[0].Documents;
                        if (this.PassengerDetail.ApisUpdateRequests[0].ApisRequirements != null && this.PassengerDetail.ApisUpdateRequests[0].ApisRequirements.length > 0) {
                            apisUpdateRequests.ApisRequirements.length = 0;
                            apisUpdateRequests.ApisRequirements = this.PassengerDetail.ApisUpdateRequests[0].ApisRequirements;
                        }
                        if (this.PassengerDetail.ApisUpdateRequests[0].ApisAddressRequirements != null && this.PassengerDetail.ApisUpdateRequests[0].ApisAddressRequirements.length > 0) {
                            apisUpdateRequests.ApisAddressRequirements.length = 0;
                            apisUpdateRequests.ApisAddressRequirements = this.PassengerDetail.ApisUpdateRequests[0].ApisAddressRequirements;
                        }
                        if (apisUpdateRequests.Addresses.length > 0) {
                            this.isAddresses = true;
                        }
                        // this.securityDatas.FqtTravelers = [];
                        // this.securityDatas.FqtTravelers=this.PassengerDetail.FqtTravelers;
                        this.OrderID = this.OrderID;
                        this.DocumentTypeList = this.PassengerDetail.DocumentTypeList;
                        this.DocumentType = this.PassengerDetail.DocumentType;
                        this.DocTypeIndex = this.PassengerDetail.DocTypeIndex;
                        this.DocIssueCountryIndex = this.PassengerDetail.DocIssueCountryIndex;
                        this.NationalityIndex = this.PassengerDetail.NationalityIndex;
                        this.ResidenceCodeIndex = this.PassengerDetail.ResidenceCodeIndex;
                        this.SelectDocumentType = this.PassengerDetail.ApisUpdateRequests[0].Documents.length > 0 ? this.PassengerDetail.ApisUpdateRequests[0].Documents[0].DocType : "2";
                        this.ADCByPassList = this.PassengerDetail.ADCByPassList;
                        this.ADCByPassNameList = this.PassengerDetail.ADCByPassNameList;
                        this._shared.SetDocumentType(this.PassengerDetail.DocumentType);
                        if (apisUpdateRequests.Documents.length > 0) {
                            if (apisUpdateRequests.Documents[0].DocHolderGender == "Male" || apisUpdateRequests.Documents[0].DocHolderGender == "0") {
                                this.gender = "0";
                                apisUpdateRequests.Documents[0].DocHolderGender = "0";
                            }
                            else if (apisUpdateRequests.Documents[0].DocHolderGender == "Female" || apisUpdateRequests.Documents[0].DocHolderGender == "1") {
                                this.gender = "1";
                                apisUpdateRequests.Documents[0].DocHolderGender = "1";
                            }
                        }
                        else {
                            this.gender = "0";
                        }
                        this.loaderProgress.hideLoader();
                        //securityDataList[index].ApisUpdateRequests.length = 0;
                        //securityDataList[index].ApisUpdateRequests.push(apisUpdateRequests);
                        this.securityDatas.ApisUpdateRequests.push(apisUpdateRequests);
                        //}
                        // else {
                        // Toast.makeText("API data is not available for the Passenger").show();
                        // this.loaderProgress.hideLoader();
                        // }
                        //}
                    });
                    let flightDetails: MultiSegmentTemplate.FlightWithPax = this.MultiSegmentPaxArray.Segment[this.currentPage];
                    //this._shared.SetSecurityDocument(this.securityDatas);
                    this._shared.GetPassenger().Passengers.forEach((element, index) => {
                        this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.RPH == element.RPH)[0].AdcDecisionStatus = element.AdcDecisionStatus;
                        this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.RPH == element.RPH)[0].ApisDocoStatus = element.ApisDocoStatus;
                    })
                    this._shared.SetSecurityDocument(this.securityDatas);
                    if (this.securityDatas.ApisUpdateRequests.length > 1) {
                        let item: Array<any> = [];
                        groupArray.forEach((name) => {
                            item.push(this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == name)[0])
                        })
                        this._shared.SetSelectedPassenger(item);
                    } else {
                        this._shared.SetSelectedPassenger(item);
                    }
                    this._shared.SetAPISPassengerList(apisItem);
                    this._shared.SetSecurityPassengerList(this.SecurityDetails.Passengers);
                    console.dir(apisItem);
                    console.dir(item);
                    this._shared.SetDocumentTypeList(this.DocumentTypeList);
                    this._shared.SetADCByPassNameList(this.ADCByPassNameList);
                    this._shared.SetADCByPassList(this.ADCByPassList);
                    this._shared.SetMultiSegmentPax(this.MultiSegmentPaxArray);
                    // this._shared.SetUserProfile(this.Profile);
                    this._shared.SetFlightDetails(flightDetails);
                    let segIndex: any;
                    this.MultiSegmentPaxArray.Segment.forEach((seg, index) => {
                        if (seg.IsInternational) {
                            segIndex = index;
                        }
                    })
                    this._shared.SetResidentCard(this.MultiSegmentPaxArray.Segment[segIndex]);
                    console.dir(this.securityDatas);
                    //console.dir(this.securityDatas);
                    let isINHIBIT = item.SecurityCode;
                    if (this.securityDatas.ApisUpdateRequests[0].AssociatedAdultRPH != null) {
                        let docStatus = this.SecurityDetails.Passengers.filter(m => m.RPH == this.securityDatas.ApisUpdateRequests[0].AssociatedAdultRPH)[0].ApisDocoStatus
                        let adultitem: MultiSegmentTemplate.Passenger = new MultiSegmentTemplate.Passenger();
                        let adultAndInfant: any = this.SecurityDetails.Passengers.filter(m => m.RPH == this.securityDatas.ApisUpdateRequests[0].AssociatedAdultRPH)[0];
                        adultitem.FirstName = adultAndInfant.Firstname;
                        adultitem.RPH = adultAndInfant.RPH;
                        adultitem.SurnameRefNumber = adultAndInfant.SurnameRefNumber;
                        adultitem.PassengerTypeCode = adultAndInfant.PassengerTypeCode;
                        if (docStatus == "Complete") {
                            let AdultPassengerDetail = Converters.ConvertToPassengersDetail(this.SecurityDetails, adultitem, this.CountryList, this.CountryItems, ADCbyPass);
                            this._shared.SetAdultSecurityData(AdultPassengerDetail);
                            console.dir(PassengerIndex + "indexxxxx")
                            this.navigateToApis(isINHIBIT, PassengerIndex, indexOfPassener, PassengerINFIndex);
                        } else {
                            Toast.makeText("Complete APIS Associated Adult Passenger").show();
                        }
                    } else {
                        console.dir(PassengerIndex)
                        this.navigateToApis(isINHIBIT, PassengerIndex, indexOfPassener, PassengerINFIndex);
                    }
                }
                else if (this.SecurityDetails.Segments[this.currentPage].Status.StatusCategory == "Waitlist") {
                    Toast.makeText("ADC/APIS collection is not allowed at this time. If needed, ADC/APIS informaiton will be collected after the check in button is clicked.").show();
                    this.loaderProgress.hideLoader();
                } else {
                    Toast.makeText("API data is not available for the Passenger").show();
                    this.loaderProgress.hideLoader();
                }
            },
                err => {
                    console.log(err)
                    this.handleServiceError(err);
                    this.loaderProgress.hideLoader();
                });
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


    InterLineThroughCheckin(Flightdeatils: string): void {
        try {
            this.SegmentList = this.MultiSegmentPaxArray.Segment[this.currentPage];
            let checkintype = this.PassengerDetails.Segments[this.currentPage].Status
                .StatusCategory;
            let request: InterlineThroughCheckin.RootObject = Converters.ConvertToInterlineThroughCheckInPostTemplate(
                this.PassengerArray,
                this.SelectedPassengerList,
                this.MultiSegmentPaxArray,
                this.currentPage,
                Flightdeatils,
                checkintype,
                this._shared.GetPassenger(),
                this._shared.GetBagTag()
            );
            console.dir(request);
            this.SecurityDetails = this._shared.GetPassenger();
            console.log(this.SecurityDetails.Passengers[0]);
            if (this.SecurityDetails.Passengers[0].Documents.length != 0) {
                this.SelectedPassengerList.forEach((PaxData, PaxIndex) => {
                    if (this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(obj => obj.FirstName == PaxData.FirstName && obj.LastName == PaxData.LastName)[0].IsSecurityDocsComplete == false) {
                        // let passengerType = this.SecurityDetails.Passengers.filter(m => m.Firstname == PaxData.FirstName && m.Lastname == PaxData.LastName)[0].PassengerTypeCode;
                        // if (passengerType != "INF") {
                        if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsInternational == true) {
                            this.docCheckForCheckin = true;
                        }
                        // }
                    }
                });
            }
            if (!this.docCheckForCheckin) {
                if (request != null) {
                    this._checkin.CheckInPax(request).subscribe(
                        data => {
                            this.CheckInResponse = data;
                            console.log(JSON.stringify(this.CheckInResponse));
                            if (this.CheckInResponse.SegmentTravelerInfoList != null) {
                                console.log("SegmentTravellerInfo Avilable");
                                let selectedSegment = this.MultiSegmentPaxArray.Segment[this.currentPage];
                                let selSegTravellerInfoList = this.CheckInResponse.SegmentTravelerInfoList.filter(m => m.SegmentRPH == selectedSegment.SegmentRPH);
                                if (selSegTravellerInfoList) {
                                    if (request.BluetoothBagTag && request.isManualBag == false) {
                                        this._shared.SetBagTag(null);
                                        this.BluetoothPrinter(request, this.CheckInResponse);
                                    } else {
                                        this._shared.SetBagTag(null);
                                        this.GetOrderDetails(this.SegmentList.Passenger[0].OrderID);
                                    }
                                    // this.GetOrderDetails(this.SegmentList.Passenger[0].OrderID);
                                } else {
                                    Toast.makeText("Unbale to find Segments").show();
                                    this.loaderProgress.hideLoader();
                                }
                            } else {
                                // this.loaderProgress.hideLoader();
                                if (request.BluetoothBagTag && request.isManualBag == false) {
                                    this._shared.SetBagTag(null);
                                    this.BluetoothPrinter(request, this.CheckInResponse);
                                } else {
                                    this._shared.SetBagTag(null);
                                    this.GetOrderDetails(this.SegmentList.Passenger[0].OrderID);
                                }
                                // this.GetOrderDetails(this.SegmentList.Passenger[0].OrderID);
                            }
                            // else if (this.CheckInResponse.Warnings.length > 0) {
                            if (this.CheckInResponse.Warnings && this.CheckInResponse.Warnings.length > 0) {
                                Toast.makeText(this.CheckInResponse.Warnings[0].Message).show();
                            }
                            // }
                            this.SelectedPassengerList.forEach((pass, index) => {
                                this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == pass.FirstName)[0].IsChecked = false;
                            });
                            this.SelectedPassengerList.length = 0;
                            // this.loaderProgress.hideLoader();
                        },
                        error => {
                            console.log("Couldnt find information for this OrderID " + error);
                            this.handleServiceError(error);
                            this.loaderProgress.hideLoader();
                        },
                        () => {
                            console.log("Done");
                        }
                    );
                }
            } else {
                Toast.makeText("Apis Data is Required").show();
                this.docCheckForCheckin = false;
                this.loaderProgress.hideLoader();
            }
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        } finally {
            var endDate = new Date();
            console.log(
                "Get Passenger Service --------------- End Date Time : " + endDate
            );
            // console.log('Get Passenger Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(startDate), new Date(endDate)));
        }
    }
    gotoDRS(item: any, index: any) {
        this.loaderProgress.showLoader();
        let Page = item.SecurityValue.Help.Page;
        let Subject = item.SecurityValue.Help.Subject;
        let category = item.SecurityValue.Help.Category;
        console.log(Page + " " + Subject + " " + category);
        this._checkin.DrsPage("", "", "").subscribe(data => {
            this.loaderProgress.hideLoader();
            let categoryName = data.Categories.filter(m => m.Value == category)[0].Text
            this._checkin.DrsPage(category, "", "").subscribe(data => {
                let SubjectName = data.Subjects.filter(m => m.Value == Subject)[0].Text
                this._checkin.DrsPage(category, Subject, "").subscribe(data => {
                    let PageName = data.Pages.filter(m => m.Value == Page)[0].Text
                    this._checkin.DrsPage(category, Subject, Page).subscribe(data => {
                        this.loaderProgress.hideLoader();
                        let options: ModalDialogOptions = {
                            viewContainerRef: this.vcRef,
                            context: [data.Contents[0].Text, PageName, SubjectName, categoryName],
                            fullscreen: true
                        };
                        this._modalService
                            .showModal(DRSComponent, options)
                            .then(result => {
                                console.log("date result " + result);

                            });
                    }, err => {
                        console.log(err)
                        this.handleServiceError(err);
                        this.loaderProgress.hideLoader();
                    })

                }, err => {
                    console.log(err)
                    this.handleServiceError(err);
                    this.loaderProgress.hideLoader();
                })
            }, err => {
                console.log(err)
                this.handleServiceError(err);
                this.loaderProgress.hideLoader();
            })

        }, err => {
            console.log(err)
            this.loaderProgress.hideLoader();
        })

    }
    OAOffload(): void {
        try {
            this.SegmentList = this.MultiSegmentPaxArray.Segment[this.currentPage];
            let checkintype = this.PassengerDetails.Segments[this.currentPage].Status
                .StatusCategory;
            let request: InterlineThroughCheckin.RootObject = Converters.ConvertToOAOffloadTemplate(
                this.PassengerArray,
                this.SelectedPassengerList,
                this.MultiSegmentPaxArray,
                this.currentPage,
                checkintype
            );
            console.dir(request);
            if (request != null) {
                this._checkin.Offload(request).subscribe(
                    data => {
                        this.CheckInResponse = data;
                        console.dir(this.CheckInResponse);
                        if (this.CheckInResponse != null) {
                            if (this.CheckInResponse.Warnings != null) {
                                if (
                                    this.CheckInResponse.Warnings[0].Message == CheckInComponent.APISDATAREQUIRED
                                ) {
                                    Toast.makeText(this._configuration.ApisDataRequired).show();
                                    this.GetOrderDetails(request.PassengerList[0].OrderId);
                                } else {
                                    if (
                                        this.CheckInResponse.Warnings[0].Message.indexOf(
                                            " ERROR-REPORT ENTRY"
                                        ) == -1
                                    ) {
                                        Toast.makeText(
                                            this.CheckInResponse.Warnings[0].Message
                                        ).show();
                                    }
                                    this.SelectedPassengerList.forEach((pass, index) => {
                                        this.MultiSegmentPaxArray.Segment[
                                            this.currentPage
                                        ].Passenger.filter(
                                            m => m.FirstName == pass.FirstName
                                        )[0].IsChecked = false;
                                        this.MultiSegmentPaxArray.Segment[
                                            this.currentPage
                                        ].Passenger.forEach((element, index) => {
                                            this.MultiSegmentPaxArray.Segment[
                                                this.currentPage
                                            ].Passenger.filter(
                                                m => m.FirstName == pass.FirstName
                                            )[0].IsChecked = false;
                                        });
                                    });
                                    this.isContinueButtonEnabled = false;
                                    this.isOffloadButtonEnabled = false;
                                    this.SelectedPassengerList.length = 0;
                                    this.GetOrderDetails(request.PassengerList[0].OrderId);
                                }
                            } else if (this.CheckInResponse.Errors != null) {
                                //alert(this.CheckInResponse.Errors);
                                this.SelectedPassengerList.forEach((pass, index) => {
                                    this.MultiSegmentPaxArray.Segment[
                                        this.currentPage
                                    ].Passenger.filter(
                                        m => m.FirstName == pass.FirstName
                                    )[0].IsChecked = false;
                                    this.MultiSegmentPaxArray.Segment[
                                        this.currentPage
                                    ].Passenger.forEach((element, index) => {
                                        this.MultiSegmentPaxArray.Segment[
                                            this.currentPage
                                        ].Passenger.filter(
                                            m => m.FirstName == pass.FirstName
                                        )[0].IsChecked = false;
                                    });
                                });
                                this.isContinueButtonEnabled = false;
                                this.isOffloadButtonEnabled = false;
                                this.SelectedPassengerList.length = 0;
                                this.GetOrderDetails(request.PassengerList[0].OrderId);
                            } else {
                                console.log(
                                    "after checkin" + JSON.stringify(this.CheckInResponse)
                                );
                                this.SelectedPassengerList.forEach((pass, index) => {
                                    this.MultiSegmentPaxArray.Segment[
                                        this.currentPage
                                    ].Passenger.filter(
                                        m => m.FirstName == pass.FirstName
                                    )[0].IsChecked = false;
                                    this.MultiSegmentPaxArray.Segment[
                                        this.currentPage
                                    ].Passenger.forEach((element, index) => {
                                        this.MultiSegmentPaxArray.Segment[
                                            this.currentPage
                                        ].Passenger.filter(
                                            m => m.FirstName == pass.FirstName
                                        )[0].IsChecked = false;
                                    });
                                });
                                this.isContinueButtonEnabled = false;
                                this.isOffloadButtonEnabled = false;
                                this.SelectedPassengerList.length = 0;
                                let AssociatedInfantRPH: string = null;
                                this.CheckInResponse.SegmentTravelerInfoList.forEach(
                                    (SegmentTraveler, Detailndex) => {
                                        this.MultiSegmentPaxArray.Segment[
                                            this.currentPage
                                        ].Passenger.forEach((data, SegIndex) => {
                                            if (
                                                data.RPH == SegmentTraveler.PassengerRPH &&
                                                this.MultiSegmentPaxArray.Segment[this.currentPage]
                                                    .SegmentRPH == SegmentTraveler.SegmentRPH
                                            ) {
                                                if (
                                                    SegmentTraveler.CheckinInfos[0].Status ==
                                                    "Checkedin" ||
                                                    SegmentTraveler.CheckinInfos[0].Status ==
                                                    "CheckedinNonRevSpaceAvailable"
                                                ) {
                                                    data.CheckinStatus = true;
                                                }
                                                data.SeatNumber = SegmentTraveler.Seats[0].SeatNumber;
                                            }
                                            // if (data.RPH == SegmentTraveler.PassengerRPH && this.MultiSegmentPaxArray.Segment[this.currentPage].SegmentRPH == SegmentTraveler.SegmentRPH) {
                                            //     data.CheckinStatus = SegmentTraveler.CheckinInfos[0].Status == "Checkedin" ? true : false;
                                            //     data.SeatNumber = SegmentTraveler.Seats[0].SeatNumber;
                                            // }
                                            if (
                                                !data.CheckinStatus &&
                                                data.AssociatedInfantRPH != null
                                            ) {
                                                AssociatedInfantRPH = data.AssociatedInfantRPH;
                                            }
                                            if (AssociatedInfantRPH != null) {
                                                if (AssociatedInfantRPH == data.RPH) {
                                                    data.CheckinStatus = false;
                                                    AssociatedInfantRPH = null;
                                                }
                                            }
                                        });
                                    }
                                );

                                this.GetOrderDetails(request.PassengerList[0].OrderId);
                            }
                        }
                        // this.loaderProgress.hideLoader();
                    },
                    error => {
                        console.log("Couldnt find information for this OrderID " + error);
                        this.handleServiceError(error);
                        // var errorMessage = error.toString();
                        // if (errorMessage.indexOf("Unrecognized token '<'") != -1) {
                        //     var options = {
                        //         title: "Session Time Out",
                        //         message: "Your session has been time out",
                        //         okButtonText: "OK"
                        //     };
                        //     dialogs.alert(options).then(() => {
                        //         this.navigateToLogin();
                        //     });
                        // }
                        this.loaderProgress.hideLoader();
                    },
                    () => {
                        console.log("Done");
                        // this.loaderProgress.hideLoader();
                    }
                );
            }
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        } finally {
            var endDate = new Date();
            console.log(
                "Get Passenger Service --------------- End Date Time : " + endDate
            );
            // console.log('Get Passenger Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(startDate), new Date(endDate)));
        }
    }

    CheckinOrInterLineThroughCheck(id): void {
        this.loaderProgress.showLoader();
        if (this.syncTicket != true && (this.MultiSegmentPaxArray.Warning == null || this.MultiSegmentPaxArray.Warning.length == 0 || this.MultiSegmentPaxArray.Warning[0].Message != CheckInComponent.WARNING)) {
            if (id == "CheckIn") {
                var nPage = this.MultiSegmentPaxArray.Segment.length;
                console.log("Page :" + nPage);
                var nextLeg = this.currentPage + 1;
                if (nextLeg < nPage) {
                    console.log(
                        "C1 :" +
                        this.MultiSegmentPaxArray.Segment[this.currentPage]
                            .DepartureDateTime
                    );
                    console.log(
                        "N1 :" + this.MultiSegmentPaxArray.Segment[nextLeg].DepartureDateTime
                    );
                    console.log(
                        "C :" +
                        moment(
                            this.MultiSegmentPaxArray.Segment[this.currentPage]
                                .ArrivalDateTime
                        ).format("HH:mm:ss")
                    );
                    console.log(
                        "N :" +
                        moment(
                            this.MultiSegmentPaxArray.Segment[nextLeg].DepartureDateTime
                        ).format("HH:mm:ss")
                    );
                    let sTime = moment(
                        this.MultiSegmentPaxArray.Segment[this.currentPage].ArrivalDateTime
                    );
                    let eTime = moment(
                        this.MultiSegmentPaxArray.Segment[nextLeg].DepartureDateTime
                    );
                    let diffTime = moment.duration(eTime.diff(sTime)).asHours();
                    console.log("DiffTime :" + diffTime);
                    this.DifferenceInTimeDuration = diffTime;
                    console.log("Test Time :" + this.DifferenceInTimeDuration);
                    console.log(
                        "Test Leg1 :" +
                        this.MultiSegmentPaxArray.Segment[
                            this.currentPage
                        ].MarketingFlight.substr(0, 2)
                    );
                    console.log(
                        "Test Leg2 :" +
                        this.MultiSegmentPaxArray.Segment[nextLeg].MarketingFlight.substr(
                            0,
                            2
                        )
                    );
                    // if (this.MultiSegmentPaxArray.Segment[this.currentPage].MarketingFlight.substr(0, 2) == "CM" && this.MultiSegmentPaxArray.Segment[nextLeg].MarketingFlight.substr(0, 2) == "CM" && this.DifferenceInTimeDuration <= 12.0 && this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight == null) {
                    //     if (this.MultiSegmentPaxArray.Segment[this.currentPage].DepartureCity == this.MultiSegmentPaxArray.Segment[nextLeg].Destination) {
                    //         this.ShortCheckAirportCode = this.MultiSegmentPaxArray.Segment[this.currentPage].Destination
                    //     } else {
                    //         this.ShortCheckAirportCode = ""
                    //     }
                    // }
                    if (this.MultiSegmentPaxArray.Segment[this.currentPage].MarketingFlight.substr(0, 2) == "CM" && this.MultiSegmentPaxArray.Segment[nextLeg].MarketingFlight.substr(0, 2) != "CM" && this.DifferenceInTimeDuration <= 12.0) {
                        console.log(" Checkin type 1");
                        var nextMarketingFlight = this.MultiSegmentPaxArray.Segment[nextLeg]
                            .MarketingFlight;
                        this.InterLineThroughCheckin(nextMarketingFlight);
                    } else if (
                        this.MultiSegmentPaxArray.Segment[nextLeg].OperatingFlight != null
                    ) {
                        if (
                            this.MultiSegmentPaxArray.Segment[
                                this.currentPage
                            ].MarketingFlight.substr(0, 2) == "CM" &&
                            this.MultiSegmentPaxArray.Segment[nextLeg].OperatingFlight.substr(
                                0,
                                2
                            ) != "CM" &&
                            this.DifferenceInTimeDuration <= 12.0
                        ) {
                            console.log("Check in type 2A");
                            var nextOperatingFlight = this.MultiSegmentPaxArray.Segment[nextLeg]
                                .OperatingFlight;
                            this.InterLineThroughCheckin(nextOperatingFlight);
                        } else {
                            console.log("Checkin type 2");
                            this.CheckInPax(id);
                        }
                    } else {
                        console.log("Checkin type 2");
                        this.CheckInPax(id);
                    }
                } else {
                    this.CheckInPax(id);
                }
            } else {
                console.log("Checkin type 3");
                if (
                    (this.MultiSegmentPaxArray.Segment[
                        this.currentPage
                    ].MarketingFlight.substr(0, 2) == "CM" &&
                        this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight ==
                        null) || (this.MultiSegmentPaxArray.Segment[
                            this.currentPage
                        ].MarketingFlight.substr(0, 2) != "CM" &&
                            this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight !=
                            null && this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight.substr(0, 2) == "CM")
                ) {
                    this.CheckInPax(id);
                } else {
                    this.OAOffload();
                }
            }
        } else {
            this.loaderProgress.hideLoader();
            // Toast.makeText(" passengers are ticket out of sync passengers. Checkin will be allowed only when those passengers ticket is synced. If you want to checkin non e-ticketed passengers, click 'OK' and unselect the ticket out of sync passenger and proceed to checkin").show();
            dialogs.alert(CheckInComponent.TKTOUTOFSYNC).then(result => {
                console.log("Dialog result: " + result);
            });
        }
    }

    CheckInPax(id: string): void {
        this.loaderProgress.showLoader();
        console.dir(this.MultiSegmentPaxArray.Segment);
        this.SegmentList = this.MultiSegmentPaxArray.Segment[this.currentPage];
        //console.dir(this.PassengerArray);

        let checkintype = this.PassengerDetails.Segments[this.currentPage].Status
            .StatusCategory;
        let request: CheckInPostTemplate.RootObject = Converters.ConvertToCheckInPostTemplate(this.PassengerArray, id, this.SelectedPassengerList, this.SegmentList, checkintype, this.ShortCheckAirportCode, this._shared.GetBagTag());
        if (id == "CheckIn") {
            try {
                this.SecurityDetails = this._shared.GetPassenger();
                if (this.SecurityDetails.Passengers[0].Documents.length != 0) {
                    this.SelectedPassengerList.forEach((PaxData, PaxIndex) => {
                        if (
                            this.MultiSegmentPaxArray.Segment[
                                this.currentPage
                            ].Passenger.filter(
                                obj =>
                                    obj.FirstName == PaxData.FirstName &&
                                    obj.LastName == PaxData.LastName
                            )[0].IsSecurityDocsComplete == false
                        ) {
                            // let passengerType = this.SecurityDetails.Passengers.filter(m => m.Firstname == PaxData.FirstName && m.Lastname == PaxData.LastName)[0].PassengerTypeCode;
                            // if (passengerType != "INF") {
                            if (
                                this.MultiSegmentPaxArray.Segment[
                                    this.currentPage
                                ].IsInternational == true
                            ) {
                                this.docCheckForCheckin = true;
                            }
                            // }
                        }
                    });
                }
                if (!this.docCheckForCheckin) {
                    var startDate = new Date();
                    console.log("CheckInPax Service --------------- Start Date Time : " + startDate);
                    console.dir(request);
                    if (request != null) {
                        console.time("checkin");
                        this._checkin.CheckInPax(request).subscribe(data => {
                            console.timeEnd("checkin");
                            this.CheckInResponse = data;
                            console.dir(this.CheckInResponse);
                            if (this.CheckInResponse != null && this.CheckInResponse.Success) {
                                console.log("inside check in response not equal null");
                                if (this.CheckInResponse.Warnings != null && this.CheckInResponse.Warnings.length > 0) {
                                    // this.CheckInResponse.Warnings.forEach((message, index) => {
                                        if (this.CheckInResponse.Warnings[0].Message == CheckInComponent.APISDATAREQUIRED) {
                                            console.log("Toast 1");
                                            Toast.makeText(this._configuration.ApisDataRequired).show();
                                            this.loaderProgress.hideLoader();
                                            // this.GetOrderDetails(request.PassengerList[0].OrderId);
                                        } else {
                                            this.CheckInResponse.Warnings.forEach((message, index) => {
                                            Toast.makeText(message.Message).show();
                                            })
                                            this.SelectedPassengerList.forEach((pass, index) => {
                                                this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == pass.FirstName)[0].IsChecked = false;
                                            });
                                            this.SelectedPassengerList.length = 0;
                                            this.isContinueButtonEnabled = false;
                                            this.isOffloadButtonEnabled = false;
                                            let AssociatedInfantRPH: string = null;
                                            if (this.CheckInResponse.SegmentTravelerInfoList != null && this.CheckInResponse.SegmentTravelerInfoList.length > 0) {
                                                this.CheckInResponse.SegmentTravelerInfoList.forEach((SegmentTraveler, Detailndex) => {
                                                    this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.forEach((data, SegIndex) => {
                                                        if (data.RPH == SegmentTraveler.PassengerRPH && this.MultiSegmentPaxArray.Segment[this.currentPage].SegmentRPH == SegmentTraveler.SegmentRPH) {
                                                            if (SegmentTraveler.CheckinInfos != null) {
                                                                if (SegmentTraveler.CheckinInfos[0].Status == "Checkedin" || SegmentTraveler.CheckinInfos[0].Status == "CheckedinNonRevSpaceAvailable" || SegmentTraveler.CheckinInfos[0].Status == "CheckedinStandby") {
                                                                    data.CheckinStatus = true;
                                                                    Toast.makeText("Passenger Checkedin Sucessfully").show();
                                                                }
                                                            }
                                                            if (SegmentTraveler.Seats != null) {
                                                                if (SegmentTraveler.Seats[0].SeatNumber != null) {
                                                                    data.SeatNumber = SegmentTraveler.Seats[0].SeatNumber;
                                                                    data.Seats = SegmentTraveler.Seats;
                                                                    data.Cabin = SegmentTraveler.Seats[0].Cabin;
                                                                }
                                                            }
                                                            if (SegmentTraveler.IsShortCheckin) {
                                                                this.isShortCheck = true;
                                                            }
                                                        }
                                                        if (data.CheckinStatus && data.AssociatedInfantRPH != null) {
                                                            AssociatedInfantRPH = data.AssociatedInfantRPH;
                                                        }
                                                        if (AssociatedInfantRPH != null) {
                                                            if (AssociatedInfantRPH == data.RPH) {
                                                                data.CheckinStatus = true;
                                                                AssociatedInfantRPH = null;
                                                            }
                                                        }
                                                    });
                                                }
                                                );
                                            }
                                            var ErrorMessage: string = " ERROR-REPORT ENTRY>";
                                            ErrorMessage.toString();
                                            console.log(" inside Toast else 2");
                                            if (request.BluetoothBagTag && request.isManualBag == false) {
                                                console.log("bluetooth Toast else 1");
                                                this._shared.SetBagTag(null);
                                                this.BluetoothPrinter(request, this.CheckInResponse);
                                            } else {
                                                console.log("bluetooth Toast else 2");
                                                this._shared.SetBagTag(null);
                                                this.GetOrderDetails(request.PassengerList[0].OrderId);
                                            }
                                            if (this.CheckInResponse.Information != null) {
                                                this.CheckInResponse.Information.forEach((message, index) => {
                                                    console.log("Toast 2");
                                                    console.log(message.Message);
                                                    Toast.makeText(message.Message).show();
                                                }
                                                );
                                            }

                                            if (this.CheckInResponse.Errors != null && this.CheckInResponse.Errors.length > 0) {
                                                this.CheckInResponse.Errors.forEach((message, index) => {
                                                    console.log("Toast err");
                                                    console.log(message.Message);
                                                    Toast.makeText(message.Message).show();

                                                });
                                            }
                                        }
                                    // })
                                    
                                } else {
                                    console.log("Checkin Completed 1");

                                    this.SelectedPassengerList.forEach((pass, index) => {
                                        this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == pass.FirstName)[0].IsChecked = false;
                                    });
                                    this.SelectedPassengerList.length = 0;
                                    this.isContinueButtonEnabled = false;
                                    this.isOffloadButtonEnabled = false;
                                    let AssociatedInfantRPH: string = null;
                                    if (this.CheckInResponse.SegmentTravelerInfoList != null && this.CheckInResponse.SegmentTravelerInfoList.length > 0) {
                                        this.CheckInResponse.SegmentTravelerInfoList.forEach(
                                            (SegmentTraveler, Detailndex) => {
                                                this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.forEach((data, SegIndex) => {
                                                    if (data.RPH == SegmentTraveler.PassengerRPH && this.MultiSegmentPaxArray.Segment[this.currentPage].SegmentRPH == SegmentTraveler.SegmentRPH) {
                                                        if (SegmentTraveler.CheckinInfos[0].Status == "Checkedin" || SegmentTraveler.CheckinInfos[0].Status == "CheckedinNonRevSpaceAvailable" || SegmentTraveler.CheckinInfos[0].Status == "CheckedinStandby") {
                                                            data.CheckinStatus = true;
                                                            Toast.makeText("Passenger Checkedin Sucessfully").show();
                                                        }
                                                        data.SeatNumber = SegmentTraveler.Seats[0].SeatNumber;
                                                        data.Seats = SegmentTraveler.Seats
                                                        data.Cabin = SegmentTraveler.Seats[0].Cabin;

                                                    }
                                                    if (data.CheckinStatus && data.AssociatedInfantRPH != null) {
                                                        AssociatedInfantRPH = data.AssociatedInfantRPH;
                                                    }
                                                    if (AssociatedInfantRPH != null) {
                                                        if (AssociatedInfantRPH == data.RPH) {
                                                            data.CheckinStatus = true;
                                                            AssociatedInfantRPH = null;
                                                        }
                                                    }
                                                });
                                            }
                                        );
                                    }
                                    if (request.BluetoothBagTag && request.isManualBag == false) {
                                        this._shared.SetBagTag(null);
                                        this.BluetoothPrinter(request, this.CheckInResponse);
                                    } else {
                                        this._shared.SetBagTag(null);
                                        this.GetOrderDetails(request.PassengerList[0].OrderId);
                                    }
                                }
                            } else {

                                if (this.CheckInResponse.Errors != null) {
                                    this.loaderProgress.hideLoader();
                                    this.CheckInResponse.Errors.forEach((errors, index) => {
                                        Toast.makeText(errors.Message).show();
                                    })
                                }
                                this.GetOrderDetails(request.PassengerList[0].OrderId);
                            }
                        },
                            error => {
                                console.log("Couldnt find information for this OrderID " + error);
                                this.handleServiceError(error);
                                // var errorMessage = error.toString();
                                // if (errorMessage.indexOf("Unrecognized token '<'") != -1) {
                                //     var options = {
                                //         title: "Session Time Out",
                                //         message: "Your session has been time out",
                                //         okButtonText: "OK"
                                //     };
                                //     dialogs.alert(options).then(() => {
                                //         this.navigateToLogin();
                                //     });
                                // }
                                this.loaderProgress.hideLoader();
                            },
                            () => {
                                console.log("Done");
                                // this.loaderProgress.hideLoader();
                            }
                        );
                    }
                } else {
                    Toast.makeText("Apis Data is Required").show();
                    this.docCheckForCheckin = false;
                    this.loaderProgress.hideLoader();
                }
            } catch (error) {
                console.log(error.message);
                this.loaderProgress.hideLoader();
            } finally {
                var endDate = new Date();
                console.log(
                    "CheckInPax Service --------------- End Date Time : " + endDate
                );
                console.log(
                    "CheckInPax Service Execution Time : " +
                    AppExecutiontime.ExecutionTime(
                        new Date(startDate),
                        new Date(endDate)
                    )
                );
            }
        } else {
            try {
                var startDate = new Date();
                console.log(
                    "Offload Service --------------- Start Date Time : " + startDate
                );
                this.loaderProgress.showLoader();
                console.log(JSON.stringify(request));
                if (request != null) {
                    this._checkin.Offload(request).subscribe(
                        data => {
                            this.CheckInResponse = data;
                            console.dir(this.CheckInResponse);
                            if (this.CheckInResponse != null) {
                                if (this.CheckInResponse.Warnings != null) {
                                    if (
                                        this.CheckInResponse.Warnings[0].Message ==
                                        CheckInComponent.APISDATAREQUIRED
                                    ) {
                                        Toast.makeText(this._configuration.ApisDataRequired).show();
                                        this.GetOrderDetails(request.PassengerList[0].OrderId);
                                    } else {
                                        if (
                                            this.CheckInResponse.Warnings[0].Message.indexOf(
                                                " ERROR-REPORT ENTRY"
                                            ) == -1
                                        ) {
                                            Toast.makeText(
                                                this.CheckInResponse.Warnings[0].Message
                                            ).show();
                                        }
                                        this.SelectedPassengerList.forEach((pass, index) => {
                                            this.MultiSegmentPaxArray.Segment[
                                                this.currentPage
                                            ].Passenger.filter(
                                                m => m.FirstName == pass.FirstName
                                            )[0].IsChecked = false;
                                            this.MultiSegmentPaxArray.Segment[
                                                this.currentPage
                                            ].Passenger.forEach((element, index) => {
                                                this.MultiSegmentPaxArray.Segment[
                                                    this.currentPage
                                                ].Passenger.filter(
                                                    m => m.FirstName == pass.FirstName
                                                )[0].IsChecked = false;
                                            });
                                        });
                                        this.isContinueButtonEnabled = false;
                                        this.isOffloadButtonEnabled = false;
                                        this.SelectedPassengerList.length = 0;
                                        this.GetOrderDetails(request.PassengerList[0].OrderId);
                                    }
                                } else if (this.CheckInResponse.Errors != null && this.CheckInResponse.Errors.length > 0) {
                                    //alert(this.CheckInResponse.Errors);
                                    this.SelectedPassengerList.forEach((pass, index) => {
                                        this.MultiSegmentPaxArray.Segment[
                                            this.currentPage
                                        ].Passenger.filter(
                                            m => m.FirstName == pass.FirstName
                                        )[0].IsChecked = false;
                                        this.MultiSegmentPaxArray.Segment[
                                            this.currentPage
                                        ].Passenger.forEach((element, index) => {
                                            this.MultiSegmentPaxArray.Segment[
                                                this.currentPage
                                            ].Passenger.filter(
                                                m => m.FirstName == pass.FirstName
                                            )[0].IsChecked = false;
                                        });
                                    });
                                    this.isContinueButtonEnabled = false;
                                    this.isOffloadButtonEnabled = false;
                                    this.SelectedPassengerList.length = 0;
                                    this.GetOrderDetails(request.PassengerList[0].OrderId);
                                } else {
                                    console.log(
                                        "after checkin" + JSON.stringify(this.CheckInResponse)
                                    );
                                    this.SelectedPassengerList.forEach((pass, index) => {
                                        this.MultiSegmentPaxArray.Segment[
                                            this.currentPage
                                        ].Passenger.filter(
                                            m => m.FirstName == pass.FirstName
                                        )[0].IsChecked = false;
                                        this.MultiSegmentPaxArray.Segment[
                                            this.currentPage
                                        ].Passenger.forEach((element, index) => {
                                            this.MultiSegmentPaxArray.Segment[
                                                this.currentPage
                                            ].Passenger.filter(
                                                m => m.FirstName == pass.FirstName
                                            )[0].IsChecked = false;
                                        });
                                    });
                                    this.isContinueButtonEnabled = false;
                                    this.isOffloadButtonEnabled = false;
                                    this.SelectedPassengerList.length = 0;
                                    let AssociatedInfantRPH: string = null;
                                    this.CheckInResponse.SegmentTravelerInfoList.forEach(
                                        (SegmentTraveler, Detailndex) => {
                                            this.MultiSegmentPaxArray.Segment[
                                                this.currentPage
                                            ].Passenger.forEach((data, SegIndex) => {
                                                if (
                                                    data.RPH == SegmentTraveler.PassengerRPH &&
                                                    this.MultiSegmentPaxArray.Segment[this.currentPage]
                                                        .SegmentRPH == SegmentTraveler.SegmentRPH
                                                ) {
                                                    if (
                                                        SegmentTraveler.CheckinInfos[0].Status ==
                                                        "Checkedin" ||
                                                        SegmentTraveler.CheckinInfos[0].Status ==
                                                        "CheckedinNonRevSpaceAvailable"
                                                    ) {
                                                        data.CheckinStatus = true;
                                                    }
                                                    data.SeatNumber = SegmentTraveler.Seats[0].SeatNumber;
                                                }
                                                // if (data.RPH == SegmentTraveler.PassengerRPH && this.MultiSegmentPaxArray.Segment[this.currentPage].SegmentRPH == SegmentTraveler.SegmentRPH) {
                                                //     data.CheckinStatus = SegmentTraveler.CheckinInfos[0].Status == "Checkedin" ? true : false;
                                                //     data.SeatNumber = SegmentTraveler.Seats[0].SeatNumber;
                                                // }
                                                if (
                                                    !data.CheckinStatus &&
                                                    data.AssociatedInfantRPH != null
                                                ) {
                                                    AssociatedInfantRPH = data.AssociatedInfantRPH;
                                                }
                                                if (AssociatedInfantRPH != null) {
                                                    if (AssociatedInfantRPH == data.RPH) {
                                                        data.CheckinStatus = false;
                                                        AssociatedInfantRPH = null;
                                                    }
                                                }
                                            });
                                        }
                                    );

                                    this.GetOrderDetails(request.PassengerList[0].OrderId);
                                }
                            }
                            // this.loaderProgress.hideLoader();
                        },
                        error => {
                            console.log("Couldnt find information for this OrderID " + error);
                            this.handleServiceError(error);
                            // var errorMessage = error.toString();
                            // if (errorMessage.indexOf("Unrecognized token '<'") != -1) {
                            //     var options = {
                            //         title: "Session Time Out",
                            //         message: "Your session has been time out",
                            //         okButtonText: "OK"
                            //     };
                            //     dialogs.alert(options).then(() => {
                            //         this.navigateToLogin();
                            //     });
                            // }
                            this.loaderProgress.hideLoader();
                        },
                        () => {
                            console.log("Done");
                            // this.loaderProgress.hideLoader();
                        }
                    );
                }
            } catch (error) {
                console.log(error.message);
                this.loaderProgress.hideLoader();
            } finally {
                var endDate = new Date();
                console.log(
                    "Offload Service --------------- End Date Time : " + endDate
                );
                console.log(
                    "Offload Service Execution Time : " +
                    AppExecutiontime.ExecutionTime(
                        new Date(startDate),
                        new Date(endDate)
                    )
                );
            }
        }
        // this.isPrintbtnEnabled();
    }

    isShortCheckin(args: MultiSegmentTemplate.Passenger): boolean {
        // console.log(args.ShortCheckinArrivalCodesByFlights);
        // console.log(this.MultiSegmentPaxArray.Segment[this.index].FlightNumber);
        if (args.ShortCheckinArrivalCodesByFlights != null && args.ShortCheckinArrivalCodesByFlights.filter(m => m.FlightNumber == this.MultiSegmentPaxArray.Segment[this.currentPage].MarketingFlight || m.FlightNumber == this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight).length > 0 && args.ShortCheckinArrivalCodesByFlights.filter(m => m.FlightNumber == this.MultiSegmentPaxArray.Segment[this.currentPage].MarketingFlight || m.FlightNumber == this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight)[0].ShortCheckinArrivalCodes.IsEligibleForShortCheckin) {
            this.isShortCheck = true;
            return true;
        } else {
            return false;
        }
        // console.log("chckargs:");
        // if (this.isShortCheck === true && index == 0) {
        //     console.log("chckargs:");
        //     return 'visible';
        // } else {
        //     return 'collapse';
        // }
    }
    selectShortCheckCode(args: MultiSegmentTemplate.Passenger, i: any) {
        console.log("i:" + i);
        let ShortcheckCodes: Array<string> = args.ShortCheckinArrivalCodesByFlights.filter(m => m.FlightNumber == this.MultiSegmentPaxArray.Segment[this.currentPage].MarketingFlight)[0].ShortCheckinArrivalCodes.ShortCheckInArrivalCodes;
        if (ShortcheckCodes != null && ShortcheckCodes != []) {
            let options = {
                title: "ShortCheck",
                message: "Choose Destination",
                actions: ShortcheckCodes
            };
            dialogs.action(options).then(result => {
                console.log(result);
                if (result) {
                    this.ShortCheckAirportCode = result;
                    args.ShortCheckAirportCode = result;
                } else {
                    this.ShortCheckAirportCode = ShortcheckCodes[0];
                    args.ShortCheckAirportCode = ShortcheckCodes[0];

                }
            })

        }

    }

    SendBaordingPassEmail() {
        try {
            var sDate = new Date();
            this.SegmentList = this.MultiSegmentPaxArray.Segment[this.currentPage];
            if (this.SelectedPassengerList.length > 0) {
                // if (this.SelectedPassengerList.length == 1) {
                this.SelectedPassengerList.forEach((elements, index) => {
                    this.selectedPassenger = this.SegmentList.Passenger.filter(
                        m =>
                            m.FirstName == elements.FirstName &&
                            m.LastName == elements.LastName
                    )[0];
                    if (this.selectedPassenger != null) {
                        if (this.selectedPassenger.CheckinStatus == true) {
                            this.loaderProgress.showLoader();
                            let request: any = Converters.ConvertToPrintBoardingPass(
                                this.SelectedPassengerList,
                                this.SegmentList,
                                this.PassengerDetails,
                                "",
                                this.MultiSegmentPaxArray,
                                this.currentPage
                            );
                            try {
                                var sDate = new Date();
                                console.log(
                                    "SendBaordingPassEmail Services --------------- Start Date Time : " +
                                    sDate
                                );
                                if (request != null) {
                                    this._printemail.SendBaordingPassEmail(request).subscribe(
                                        data => {
                                            console.dir(data);
                                            if (
                                                data != null &&
                                                data != "undefined" &&
                                                data.JobResponse != null &&
                                                data.JobResponse != "undefined"
                                            ) {
                                                if (data.JobResponse.Status != "Failed") {
                                                    alert("BaordingPass Email Sent Succesfully ");
                                                } else {
                                                    alert(data.JobResponse.Message);
                                                }
                                            }
                                        },
                                        error => {
                                            console.log(
                                                "Couldnt find information for this OrderID " + error
                                            );
                                            var errorMessage = error.toString();
                                            if (
                                                errorMessage.indexOf("Unrecognized token '<'") != -1
                                            ) {
                                                var options = {
                                                    title: "Session Time Out",
                                                    message: "Your session has been time out",
                                                    okButtonText: "OK"
                                                };
                                                dialogs.alert(options).then(() => {
                                                    this.navigateToLogin();
                                                });
                                            }
                                            this.loaderProgress.hideLoader();
                                        },
                                        () => {
                                            this.loaderProgress.hideLoader();
                                        }
                                    );
                                }
                            } catch (error) {
                                console.log(error.message);
                                this.loaderProgress.hideLoader();
                            } finally {
                                var eDate = new Date();
                                console.log(
                                    "SendBaordingPassEmail Service --------------- End Date Time : " +
                                    eDate
                                );
                                console.log(
                                    "SendBaordingPassEmail Service Execution Time : " +
                                    AppExecutiontime.ExecutionTime(
                                        new Date(sDate),
                                        new Date(eDate)
                                    )
                                );
                            }
                            // }
                        } else {
                            Toast.makeText("check in is not completed").show();
                        }
                    }
                });
                // } else {
                //     Toast.makeText("Kindly DeSelect passengers.BoardingPass Applicable only for single passenger").show();
                // }
            } else {
                Toast.makeText("Select Passenger").show();
            }
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        } finally {
            var eDate = new Date();
            console.log(
                "SendBaordingPassEmail Service --------------- End Date Time : " + eDate
            );
            console.log(
                "SendBaordsingPassEmail Service Execution Time : " +
                AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate))
            );
        }
    }

    BluetoothPrinter(request: any, CheckInResponse: any) {
        if (!ApplicationSettings.getBoolean("isHostBagtag")) {
            let bagtagElement = Object.assign({}, request);
            let bagtagList = Object.assign({}, CheckInResponse);
            console.log("Bluetooth before");
            console.log(CheckInResponse);
            if (CheckInResponse.BagTagOutput && CheckInResponse.BagTagOutput.length > 0) {
                console.log("Bluetooth before in 1");
                if (CheckInResponse.BagTagOutput[0].PicRawData) {
                    console.log("Bluetooth before in 1")
                    console.log("Bluetooth inside before");
                    let image = imageModule.fromBase64(CheckInResponse.BagTagOutput[0].PicRawData);
                    let paths = fs.path.join(fs.knownFolders.temp().path, "stuff");
                    let dest = fs.path.join(fs.knownFolders.currentApp().path, "/assets");
                    // Zip.zip(paths,dest,);
                    let folder = fs.knownFolders.documents();
                    let filename: string = moment(new Date()).format("hhmmss");
                    let path = fs.path.join(folder.path, "tempBPImage" + filename + ".jpg");
                    try {
                        image.saveToFile(path, "jpeg");
                        let printerID = this.getPrinter();
                        if (printerID.trim() != "") {
                            let self = this;
                            console.time("PrintBagtag");
                            new zebra.Printer({ address: printerID, language: "CPCL", debugging: false }).then(function (curPrinter, result) {
                                var document = curPrinter.createDocument();
                                document.image(fs.path.join(folder.path, "tempBPImage" + filename + ".jpg"), 0);
                                curPrinter.getStatus().then(function (result) {
                                    console.log(result);
                                    if (result.ready && !result.latchOpen && !result.lowBattery && !result.paperOut) {
                                        curPrinter.print(document).then(function () {
                                            console.log("Printing Done");

                                            let file = folder.getFile("tempBPImage" + filename + ".jpg");
                                            file.remove().then((res) => {
                                                console.log("file removed")
                                            })
                                            Toast.makeText("BagTag printed sucessfully").show();
                                            let Remakrequest: any = Converters.BluetoothPrinterResponseCheckin(bagtagElement, bagtagList, true);
                                            console.log(JSON.stringify(Remakrequest));
                                            console.time("RemarksCheckin");
                                            self._printemail.RemarksCheckin(Remakrequest).subscribe((data) => {
                                                console.log(data);
                                                console.timeEnd("RemarksCheckin");
                                                if (data.Information != null && data.Information.length > 0) {
                                                    Toast.makeText(data.Information[0].Message).show();
                                                }
                                                self.GetOrderDetails(self.OrderID);
                                            }, error => {
                                                Toast.makeText("Error in adding remarks").show();
                                                self.GetOrderDetails(self.OrderID);
                                                // this.handleServiceError(error);
                                                // this.loaderProgress.hideLoader();

                                            });

                                            curPrinter.close().then(function () {
                                                console.timeEnd("PrintBagtag");
                                                Toast.makeText("Printer is ready to print").show();
                                                // this.loaderProgress.hideLoader();
                                            }).catch(function (err) {
                                                Toast.makeText("Error Occured while Printing:").show();
                                                // console.log("Printing Error: ", err);
                                                curPrinter.close();
                                                self.PrintFail(bagtagElement, bagtagList);

                                            });
                                        }).catch(function (status) {
                                            Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
                                            self.PrintFail(bagtagElement, bagtagList);
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
                                        self.PrintFail(bagtagElement, bagtagList);

                                    }

                                }).catch(function (status) {
                                    console.log(status);
                                })
                            }).catch(function (err) {
                                Toast.makeText(CheckInComponent.PRINTERSESSION).show();
                                console.log("HI");
                                self.PrintFail(bagtagElement, bagtagList);
                            });
                        } else {
                            Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
                            this.PrintFail(bagtagElement, bagtagList);

                        }
                    } catch (e) {
                        console.log(e);
                        Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
                        this.PrintFail(bagtagElement, bagtagList);

                    }

                }
                else {
                    console.log("Bluetooth inside else before 1");
                    Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
                    this.PrintFail(bagtagElement, bagtagList);

                }
            } else {
                console.log("Bluetooth inside else before  2");
                Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
                this.PrintFail(bagtagElement, bagtagList);

            }
        } else {
            this.GetOrderDetails(this.OrderID);
        }
    }
    PrintFail(bagtagElement, bagtagList) {
        let Remakrequest: any = Converters.BluetoothPrinterResponseCheckin(bagtagElement, bagtagList, false);
        console.log(JSON.stringify(Remakrequest));
        this._printemail.RemarksCheckin(Remakrequest).subscribe((data) => {
            console.log(data);
            if (data.Information != null && data.Information.length > 0) {
                Toast.makeText(data.Information[0].Message).show();
            }
            this.GetOrderDetails(this.OrderID);
        }, error => {
            this.handleServiceError(error);
            console.log(error);
            this.loaderProgress.hideLoader();

        });
    }
    // PrintBaordingPassPopup() {
    //     if (this.SelectedPassengerList.length > 0) {
    //         let checkedInData: boolean = true;
    //         this.SegmentList = this.MultiSegmentPaxArray.Segment[this.currentPage];
    //         this.SelectedPassengerList.forEach((elements, index) => {
    //             let selectedPassenger = this.SegmentList.Passenger.filter(
    //                 m =>
    //                     m.FirstName == elements.FirstName && m.LastName == elements.LastName
    //             )[0];
    //             console.dir(selectedPassenger);
    //             if (selectedPassenger != null) {
    //                 if (selectedPassenger.CheckinStatus == false) {
    //                     checkedInData = false;
    //                 }
    //             }
    //         });
    //         if (checkedInData) {
    //             let options = {
    //                 title: "Printer",
    //                 message: "Choose Printer Type",
    //                 cancelButtonText: "Cancel",
    //                 actions: ["Boarding Pass"]
    //             };
    //             dialogs.action(options).then(result => {
    //                 console.log(result);
    //                 if (result == "Boarding Pass") {

    //                     let isHost:boolean = ApplicationSettings.getBoolean("isHost");
    //                     if(isHost)
    //                     {
    //                         this.hostPrinter("hosted");
    //                     }
    //                     else
    //                     {
    //                         this.hostPrinter("bluetooth");
    //                     }
    //                     //this.PrintBaordingPass();
    //                 }
    //                 if (result == "Bag Tag") {
    //                     //this.PrintBagTag();
    //                     let isHost:boolean = ApplicationSettings.getBoolean("isHost");
    //                     if (isHost) {
    //                         this.hostBagTagPrinter("hosted");
    //                     }
    //                     else {
    //                         this.hostBagTagPrinter("bluetooth");
    //                     }
    //                     //this.hostPrinter('bluetooth')
    //                 }
    //             });
    //         } else {
    //             Toast.makeText("Please select only checkedIn Passenger").show();
    //         }
    //     } else {
    //         Toast.makeText("Select Passenger").show();
    //     }
    // }

    // PrintBagTag() {
    //     let options = {
    //         title: "Printer",
    //         message: "Choose Printer Type",
    //         cancelButtonText: "Cancel",
    //         actions: ["Bluetooth Printer", "Host Printer"]
    //     };
    //     dialogs.action(options).then(result => {
    //         console.log(result);
    //         if (result == "Host Printer") {
    //             this.hostBagTagPrinter("hosted");
    //         }
    //         if (result == "Bluetooth Printer") {
    //             //this.Bluetoothprint();
    //             this.hostBagTagPrinter("bluetooth");
    //         }
    //     });
    // }

    // PrintBaordingPass() {
    //     let options = {
    //         title: "Printer",
    //         message: "Choose Printer Type",
    //         cancelButtonText: "Cancel",
    //         actions: ["Bluetooth Printer", "Host Printer"]
    //     };
    //     dialogs.action(options).then(result => {
    //         console.log(result);
    //         if (result == "Host Printer") {
    //             this.hostPrinter("hosted");
    //         } else if ((result = "Bluetooth Printer")) {
    //             //this.Bluetoothprint();
    //             this.hostPrinter("bluetooth");
    //         }
    //     });
    // }
    hostPrinter() {
        try {
            var hostedcheck = ApplicationSettings.getBoolean("isHostBoarding");
            var hosted;
            if (hostedcheck) {
                hosted = "hosted";
            } else {
                hosted = "bluetooth";
            }
            var sDate = new Date();
            this.SegmentList = this.MultiSegmentPaxArray.Segment[this.currentPage];
            if (this.SelectedPassengerList.length > 0) {
                // if (this.SelectedPassengerList.length == 1) {
                if (this.isCheckinPrint) {
                    this.loaderProgress.showLoader();
                    // this.SelectedPassengerList.forEach((selectedPax, index) => {
                    let request: any = Converters.ConvertToPrintBoardingPass(this.SelectedPassengerList, this.SegmentList, this.PassengerDetails, hosted, this.MultiSegmentPaxArray, this.currentPage);

                    if (request != null) {
                        try {
                            var sDate = new Date();
                            console.log(
                                "PrintBaordingPass Service --------------- Start Date Time : " +
                                sDate
                            );
                            if (request != null) {
                                console.log(JSON.stringify(request));

                                this._printemail.PrintBoardingPass(request).subscribe(
                                    data => {
                                        console.dir(data);
                                        console.log(JSON.stringify(data));
                                        if (hosted === "bluetooth") {
                                            console.log("printing to bluetooth");
                                            if (data.BoardingPassOutput && data.BoardingPassOutput.length > 0 && data.BoardingPassOutput[0].Success) {
                                                let image = imageModule.fromBase64(data.BoardingPassOutput[0].PicRawData);
                                                let folder = fs.knownFolders.documents();
                                                let filename: string = moment(new Date()).format("hhmmss");
                                                let path = fs.path.join(folder.path, "tempBPImage" + filename + ".jpg");
                                                try {
                                                    image.saveToFile(path, "jpeg");
                                                    let printerID = this.getPrinter();
                                                    if (printerID.trim() != "") {
                                                        //setting printer 
                                                        console.time("printboardinpass");
                                                        new zebra.Printer({ address: printerID, language: "CPCL", debugging: true }).then(function (curPrinter, result) {
                                                            //getting document to be printed
                                                            var document = curPrinter.createDocument();

                                                            document.image(fs.path.join(folder.path, "tempBPImage" + filename + ".jpg"), 0);
                                                            //getting Status of the Printer

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
                                                                        Toast.makeText("BoardingPass printed sucessfully").show();

                                                                        curPrinter.close().then(function () {
                                                                            console.timeEnd("printboardinpass");
                                                                            Toast.makeText("Printer is ready to print").show();
                                                                        }).catch(function (err) {
                                                                            Toast.makeText("Error Occured while Printing:").show();
                                                                            console.log("Printing Error: ", err);
                                                                            curPrinter.close();
                                                                        });
                                                                    }, err => {
                                                                        console.log(err);
                                                                    }).catch(function (status) {
                                                                        console.log(status);
                                                                        Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
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
                                                                }

                                                            }).catch(function (status) {
                                                                console.log(status);
                                                            })
                                                        }).catch(function (err) {
                                                            Toast.makeText(CheckInComponent.PRINTERSESSION).show();
                                                            console.log(err);
                                                        });
                                                    } else {
                                                        Toast.makeText(CheckInComponent.NOBLUETOOTHDEVICE).show();
                                                    }
                                                } catch (e) {
                                                    console.log(e)
                                                    Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
                                                }
                                            } else if (data.Errors && data.Errors.length > 0) {
                                                Toast.makeText(data.Errors[0].Message).show();
                                            }
                                            else {
                                                Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
                                            }
                                        } else {
                                            console.log("printing to host");
                                            if (data.BoardingPassOutput && data.BoardingPassOutput.length > 0) {
                                                if (data.BoardingPassOutput[0].Message != null) {
                                                    Toast.makeText(data.BoardingPassOutput[0].Message).show();
                                                    if (data.BoardingPassOutput[0].Message == "Sent for Print" || data.BoardingPassOutput[0].Message == "Delivered") {
                                                        Toast.makeText("Boarding Pass Printed Succesfully ").show();
                                                    }
                                                } else {
                                                    Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
                                                }
                                            } else if (data.Errors && data.Errors.length > 0) {
                                                Toast.makeText(data.Errors[0].Message).show();
                                            }
                                            else {
                                                Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
                                            }
                                        }
                                    },
                                    error => {
                                        console.log(
                                            "Couldnt find information for this OrderID " + error
                                        );
                                        this.handleServiceError(error);
                                        this.loaderProgress.hideLoader();
                                    },
                                    () => {
                                        this.loaderProgress.hideLoader();
                                    }
                                );
                            }
                        } catch (error) {
                            console.log(error.message);
                            this.loaderProgress.hideLoader();
                        } finally {
                            var eDate = new Date();
                            console.log(
                                "SendBaordingPassEmail Service --------------- End Date Time : " +
                                eDate
                            );
                            console.log(
                                "SendBaordingPassEmail Service Execution Time : " +
                                AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate))
                            );
                        }
                        // }
                    } else {
                        this.loaderProgress.hideLoader();
                    }


                }
                else {
                    this.loaderProgress.hideLoader();
                    Toast.makeText("APIS Data Required").show();
                }
                // } else {
                //     Toast.makeText("Kindly DeSelect passengers.BoardingPass Applicable only for single passenger").show();
                // }
            } else {
                Toast.makeText("Select Passenger").show();
            }
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        } finally {
            var eDate = new Date();
            //this.loaderProgress.hideLoader();
            console.log(
                "SendBaordingPassEmail Service --------------- End Date Time : " + eDate
            );
            console.log(
                "SendBaordingPassEmail Service Execution Time : " +
                AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate))
            );
        }
    }

    hostBagTagPrinter(hosted: string) {
        try {
            var sDate = new Date();
            this.SegmentList = this.MultiSegmentPaxArray.Segment[this.currentPage];
            if (this.SelectedPassengerList.length > 0) {
                // if (this.SelectedPassengerList.length == 1) {

                this.loaderProgress.showLoader();
                let request: any = Converters.ConvertToPrintBagTag(
                    this.SelectedPassengerList,
                    this.SegmentList,
                    this.PassengerDetails,
                    hosted,
                    this._shared.GetPassenger().SegmentTravelerInfos
                );
                if (request != null) {
                    try {
                        var sDate = new Date();
                        console.log(
                            "PrintBagTag Service --------------- Start Date Time : " + sDate
                        );
                        if (request != null) {
                            console.log(JSON.stringify(request));
                            console.time("boardinPassReq");
                            this._printemail.PrintBagTag(request).subscribe(
                                data => {
                                    console.timeEnd("boardinPassReq");
                                    console.dir(data);
                                    console.log(JSON.stringify(data));
                                    if (hosted === "bluetooth") {
                                        console.log("printing to bluetooth");
                                        if (
                                            data.BagTagOutput &&
                                            data.BagTagOutput.length > 0 &&
                                            data.BagTagOutput[0].PicRawData
                                        ) {
                                            let image = imageModule.fromBase64(
                                                data.BagTagOutput[0].PicRawData
                                            );
                                            let folder = fs.knownFolders.ios.library();
                                            let filename: string = moment(new Date()).format("hhmmss");
                                            let path = fs.path.join(folder.path, "tempBPImage" + filename + ".jpg");
                                            try {
                                                image.saveToFile(path, "jpeg");
                                                let printerID = this.getPrinter();
                                                if (printerID.trim() != "") {
                                                    new zebra.Printer({
                                                        address: printerID,
                                                        language: "CPCL",
                                                        debugging: false
                                                    }).then(function (curPrinter, result) {
                                                        var document = curPrinter.createDocument();
                                                        document.image(
                                                            fs.path.join(folder.path, "tempBPImage" + filename + ".jpg"),
                                                            0
                                                        );
                                                        curPrinter
                                                            .print(document)
                                                            .then(function () {
                                                                console.log("Printing Done");
                                                                curPrinter
                                                                    .close()
                                                                    .then(function () {
                                                                        Toast.makeText(
                                                                            "BagTag Printed Succesfully "
                                                                        ).show();
                                                                    })
                                                                    .catch(function (err) {
                                                                        Toast.makeText(
                                                                            "Error Occured while Printing:"
                                                                        ).show();
                                                                        // console.log("Printing Error: ", err);
                                                                        curPrinter.close();
                                                                    });
                                                            })
                                                            .catch(function (status) {
                                                                Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
                                                            });
                                                    });
                                                } else {
                                                    Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
                                                }
                                            } catch (e) {
                                                Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
                                            }
                                        } else {
                                            Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
                                        }
                                    } else {
                                        console.log("printing to host");
                                        console.log(JSON.stringify(data));
                                        if (data && data.BagTagOutput[0].Status == "Success") {
                                            Toast.makeText("BagTag Printed Succesfully ").show();
                                        } else {
                                            let noBags: boolean = false;
                                            request.Passengers.forEach((element, index) => {
                                                if (element.CheckedBagCount == "0") {
                                                    noBags = true;
                                                }
                                            });
                                            if (noBags) {
                                                Toast.makeText("No Baggage Found").show();
                                                this.loaderProgress.hideLoader();
                                            } else {
                                                Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
                                            }
                                        }
                                    }
                                },
                                error => {
                                    console.log(
                                        "Couldnt find information for this OrderID " + error
                                    );
                                    this.handleServiceError(error);
                                    // var errorMessage = error.toString();
                                    // if (errorMessage.indexOf("Unrecognized token '<'") != -1) {
                                    //     var options = {
                                    //         title: "Session Time Out",
                                    //         message: "Your session has been time out",
                                    //         okButtonText: "OK"
                                    //     };
                                    //     dialogs.alert(options).then(() => {
                                    //         this.navigateToLogin();
                                    //     });
                                    // }
                                    // Toast.makeText("Unable to Print").show();
                                    this.loaderProgress.hideLoader();
                                },
                                () => {
                                    this.loaderProgress.hideLoader();
                                }
                            );
                        } else {
                            Toast.makeText("No Baggage Found").show();
                            this.loaderProgress.hideLoader();
                        }
                    } catch (error) {
                        console.log(error.message);
                        this.loaderProgress.hideLoader();
                    } finally {
                        var eDate = new Date();
                        console.log(
                            "PrintBagTag Service --------------- End Date Time : " + eDate
                        );
                        console.log(
                            "PrintBagTag Service Execution Time : " +
                            AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate))
                        );
                    }
                    // }
                } else {
                    Toast.makeText("check in is not completed").show();
                    this.loaderProgress.hideLoader();
                }

                // } else {
                //     Toast.makeText("Kindly DeSelect passengers.BoardingPass Applicable only for single passenger").show();
                // }
            } else {
                Toast.makeText("Select Passenger").show();
                this.loaderProgress.hideLoader();
            }
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        } finally {
            var eDate = new Date();
            //this.loaderProgress.hideLoader();
            console.log(
                "PrintBagTag Service --------------- End Date Time : " + eDate
            );
            console.log(
                "PrintBagTag Service Execution Time : " +
                AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate))
            );
        }
    }
    Bluetoothprint() {
        console.log("here");
        this.SegmentList = this.MultiSegmentPaxArray.Segment[this.currentPage];
        let printer = this._shared.GetDevicePrinterDeatils();
        let SecurityDetail = this._shared.GetPassenger();
        if (this.SelectedPassengerList.length > 0) {
            if (this.SelectedPassengerList.length == 1) {
                this.SelectedPassengerList.forEach((elements, index) => {
                    this.selectedPassenger = this.SegmentList.Passenger.filter(
                        m =>
                            m.FirstName == elements.FirstName &&
                            m.LastName == elements.LastName
                    )[0];
                    if (this.selectedPassenger != null) {
                        if (this.selectedPassenger.CheckinStatus == true) {
                            this.loaderProgress.showLoader();
                            // let request: any = Converters.ConverToBluetoothPrinter(printer, this.selectedPassenger, SecurityDetail,this.SegmentList);
                        }
                    }
                });
            }
        }
    }

    getBaggage(item: any): void {
        try {
            var startDate = new Date();
            console.log(
                "GetBaggage Service --------------- Start Date Time : " + startDate
            );
            this.loaderProgress.showLoader();
            let baggagecatalog: any = this._shared.GetBaggagecatalog();
            console.dir(baggagecatalog);
            console.log("bag Warning");
            // console.dir(baggagecatalog.Warnings);
            // if(baggagecatalog.Success!=){
            if (baggagecatalog.Success != false) {
                if (baggagecatalog.Warnings == null) {
                    this.navigateToBaggage(
                        JSON.stringify(item),
                        JSON.stringify(baggagecatalog),
                        JSON.stringify(this.MultiSegmentPaxArray),
                        JSON.stringify(this.currentPage),
                        JSON.stringify(this.ticketNumbers),
                        JSON.stringify(item.ShortCheckAirportCode),
                        this.isShortCheck

                    );
                } else if(baggagecatalog.Warnings != null && baggagecatalog.Warnings.filter(m=>m.Message.indexOf("The supplied itinerary is not valid for the pricing operation")!= -1).length>0){
                    Toast.makeText(baggagecatalog.Warnings[0].Message).show();

                } else if (baggagecatalog.Warnings != null) {
                    this.navigateToBaggage(
                        JSON.stringify(item),
                        JSON.stringify(baggagecatalog),
                        JSON.stringify(this.MultiSegmentPaxArray),
                        JSON.stringify(this.currentPage),
                        JSON.stringify(this.ticketNumbers),
                        JSON.stringify(this.ShortCheckAirportCode),
                        this.isShortCheck

                    );
                    Toast.makeText(baggagecatalog.Warnings[0].Message).show();
                }
            } else {
                Toast.makeText(baggagecatalog.Errors[0].Message).show();
            }
            // }
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        } finally {
            this.loaderProgress.hideLoader();
            var endDate = new Date();
            console.log(
                "GetBaggage Service --------------- End Date Time : " + endDate
            );
            console.log(
                "GetBaggage Service Execution Time : " +
                AppExecutiontime.ExecutionTime(new Date(startDate), new Date(endDate))
            );
        }
    }

    gotoApis(item: any, indexOfPassener: any) {
        var param = JSON.stringify(item);

        this.MultiSegmentPaxArray.Segment.forEach((seg, index) => {
            if (seg.IsInternational) {
                this.isInternational = true;
            }
        });
        if (!this.MultiSegmentPaxArray.Segment[this.currentPage].IsInterline && !this.MultiSegmentPaxArray.Segment[this.currentPage].ETKTStatusNOTOK) {
            if (!this.MultiSegmentPaxArray.Segment[this.currentPage].isAPISSeatBagDisabled) {
                if (this.isInternational) {
                    this.getSecurityDoc(item.OrderID, item, indexOfPassener);
                }
                else {
                    Toast.makeText("API data is not available for the Passenger").show();
                }
            }
        } else {
            Toast.makeText("Cannot Process Interline flight").show();
        }
    }

    navigateToApis(isINHIBIT, PassengerIndex, indexOfPassener, PassengerINFIndex) {
        var profile: string = this.Profile;
        this.routerExtensions.navigate(["apis"], {
            animated: false,
            transition: {
                name: "fade",
                duration: 10,
                curve: "linear"
            },
            queryParams: {
                index: JSON.stringify(this.currentPage),
                isInhibit: isINHIBIT,
                ApisIndex: indexOfPassener,
                PassengerIndex: PassengerIndex,
                PassengerINFIndex: PassengerINFIndex
            }
        });
    }

    onMultipleSelector(args: any, index: any) {
        console.log("inside select");
        this.syncTicket = false;
        let obj = new PassengerCheckin.SelectedPassenger();
        let selectedNames: Array<string> = [];
        selectedNames.length = 0;
        let AssociatedInfantRPH: string = null;
        let associatedAdultRPH: string = null
        let associatedAdultINFRPH: string = null;
        if (args.AssociatedInfantRPH != "" && args.AssociatedInfantRPH != null) {
            associatedAdultRPH = this._shared.GetPassenger().Passengers.filter(m => m.Firstname == args.FirstName && m.Lastname == args.LastName)[0].RPH;
            associatedAdultINFRPH = this._shared.GetPassenger().Passengers.filter(m => m.Firstname == args.FirstName && m.Lastname == args.LastName)[0].AssociatedInfantRPH;
        }
        if (args.AssociatedAdultRPH != "" && args.AssociatedAdultRPH != null) {
            associatedAdultINFRPH = this._shared.GetPassenger().Passengers.filter(m => m.Firstname == args.FirstName && m.Lastname == args.LastName)[0].RPH;
            associatedAdultRPH = this._shared.GetPassenger().Passengers.filter(m => m.Firstname == args.FirstName && m.Lastname == args.LastName)[0].AssociatedAdultRPH;
        }

        this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.forEach((arrayElements, arrIndex) => {
            if (arrayElements.AssociatedInfantRPH != "" && arrayElements.AssociatedInfantRPH != null) {
                if (associatedAdultINFRPH == arrayElements.AssociatedInfantRPH) {
                    console.log(arrayElements.serviceText);
                    let AdultName: string = arrayElements.AssociatedInfantRPH; //.split('/')[1];
                    let INFName: string = arrayElements.FirstName; //.split('/').length == 2 ? SecondSelectdText.split('/')[1] : "";
                    if (AdultName != "") {
                        console.log("adultNsme" + AdultName);
                        selectedNames.push(AdultName);
                    }
                }
            } else if (arrayElements.AssociatedAdultRPH != "" && arrayElements.AssociatedAdultRPH != null) {

                if (associatedAdultRPH == arrayElements.AssociatedAdultRPH) {
                    console.log(arrayElements.serviceText);
                    let INFName: string = arrayElements.AssociatedAdultRPH; //.split('/').length == 2 ? SecondSelectdText.split('/')[1] : "";
                    if (INFName != "") {
                        console.log("infanttNsme" + INFName);
                        selectedNames.push(INFName);
                    }
                }
            }
            if (arrayElements.CheckinStatus && arrayElements.AssociatedInfantRPH == associatedAdultINFRPH) {
                AssociatedInfantRPH = associatedAdultINFRPH;
                console.log("AssociateInfant" + AssociatedInfantRPH);
            }
            if (AssociatedInfantRPH != null) {
                if (AssociatedInfantRPH == arrayElements.RPH) {
                    // arrayElements.CheckinStatus = true;
                    AssociatedInfantRPH = null;
                }
            }
        });

        if (selectedNames.filter(m => m.toString() == args.RPH)[0] == null) {
            selectedNames.length = 0;
        }

        obj.FirstName = args.FirstName;
        obj.LastName = args.LastName;
        if (selectedNames.length == 0) {
            if (this.SelectedPassengerList.filter(m => m.FirstName == args.FirstName && m.LastName == args.LastName)[0] == null) {
                this.SelectedPassengerList.push(obj);
                console.dir(this.SelectedPassengerList);
            }
        } else if (selectedNames.length > 0) {
            selectedNames.forEach((element, index) => {
                if (this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.RPH == element)[0] != null) {
                    let objSelected = new PassengerCheckin.SelectedPassenger();
                    objSelected.FirstName = this.MultiSegmentPaxArray.Segment[
                        this.currentPage
                    ].Passenger.filter(m => m.RPH == element.trim())[0].FirstName;
                    objSelected.LastName = this.MultiSegmentPaxArray.Segment[
                        this.currentPage
                    ].Passenger.filter(m => m.RPH == element.trim())[0].LastName;
                    if (
                        this.SelectedPassengerList.filter(m => m.FirstName == objSelected.FirstName && m.LastName == objSelected.LastName)[0] ==
                        null
                    ) {
                        this.SelectedPassengerList.push(objSelected);
                        console.dir(this.SelectedPassengerList);
                    }
                }
            });
        }

        if (args.IsChecked != false) {
            if (this.SelectedPassengerList.filter(m => m.FirstName == args.FirstName && m.LastName == args.LastName)[0] != null
            ) {
                if (selectedNames.length == 0) {

                    this.SelectedPassengerList.forEach((elements, index) => {
                        if (
                            elements.FirstName == args.FirstName &&
                            elements.LastName == args.LastName
                        ) {
                            this.SelectedPassengerList.splice(index, 1);
                        }
                    });
                } else if (selectedNames.length > 0) {

                    selectedNames.forEach((element, index) => {
                        let Firstname = this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.RPH == element)[0].FirstName
                        let Lastname = this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.RPH == element)[0].LastName
                        this.SelectedPassengerList.forEach((elements, index) => {
                            if (elements.FirstName == Firstname.trim() && elements.LastName == Lastname.trim()) {
                                this.SelectedPassengerList.splice(index, 1);
                            }
                        });
                    });
                }
            }
        }
        console.log(args.IsChecked);
        this.isContinueButtonEnabled = false;
        this.isOffloadButtonEnabled = false;
        let checkedInStatus: boolean = false;
        let isCheckedApisStatus: boolean = true;
        let nonCheckedInStatus: boolean = false;
        if (this.SelectedPassengerList.length > 0) {
            this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.forEach((pass, index) => {
                this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == pass.FirstName && m.LastName == pass.LastName)[0].IsChecked = false;
            });

            this.SelectedPassengerList.forEach((Selectedpass, index) => {
                // this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.forEach((pass, index) => {
                this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == Selectedpass.FirstName && m.LastName == Selectedpass.LastName)[0].IsChecked = true;
                if (this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == Selectedpass.FirstName && m.LastName == Selectedpass.LastName)[0].CheckinStatus) {
                    checkedInStatus = true;
                    this.isContinueButtonEnabled = false;
                }
                else if (!this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == Selectedpass.FirstName && m.LastName == Selectedpass.LastName)[0].CheckinStatus) {
                    if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsInternational && this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == Selectedpass.FirstName && m.LastName == Selectedpass.LastName)[0].ApisDocoStatus != "NotComplete") {
                        nonCheckedInStatus = true;
                        this.isContinueButtonEnabled = true;
                    } else if (!this.MultiSegmentPaxArray.Segment[this.currentPage].IsInternational) {
                        nonCheckedInStatus = true;
                        this.isContinueButtonEnabled = true;
                    }
                }

                if (
                    !this.MultiSegmentPaxArray.Segment[
                        this.currentPage
                    ].Passenger.filter(m => m.FirstName == Selectedpass.FirstName && m.LastName == Selectedpass.LastName)[0]
                        .CheckinStatus
                ) {
                    nonCheckedInStatus = true;
                    this.isOffloadButtonEnabled = false;
                }
                // });

                // this.isContinueButtonEnabled = true;
            });
        } else {
            this.MultiSegmentPaxArray.Segment[
                this.currentPage
            ].Passenger.forEach((pass, index) => {
                this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(
                    m => m.FirstName == pass.FirstName && m.LastName == pass.LastName
                )[0].IsChecked = false;
            });
        }

        if (checkedInStatus && nonCheckedInStatus) {
            this.isContinueButtonEnabled = false;
            this.isOffloadButtonEnabled = false;
        } else if (checkedInStatus) {
            this.isContinueButtonEnabled = false;
            this.isOffloadButtonEnabled = true;
        }
        let passenger: Order.RootObject = this._shared.GetPassenger();
        this.SelectedPassengerList.forEach((name, index) => {
            if (this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == name.FirstName && m.LastName == name.LastName)[0].SyncTicket == true) {
                this.syncTicket = true;
            }
            if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsInternational) {
                if (this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == name.FirstName && m.LastName == name.LastName)[0].ApisDocoStatus != "Complete") {
                    isCheckedApisStatus = false;
                }

                if ((this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == name.FirstName && m.LastName == name.LastName)[0].ApisDocoStatus == "Complete" &&
                    this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == name.FirstName && m.LastName == name.LastName)[0].AdcDecisionStatus != "OK" &&
                    this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == name.FirstName && m.LastName == name.LastName)[0].AdcDecisionStatus != "BYPASSED" &&
                    this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == name.FirstName && m.LastName == name.LastName)[0].AdcDecisionStatus != "AUTOBYPASSED" &&
                    this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == name.FirstName && m.LastName == name.LastName)[0].AdcDecisionStatus != "COK") ||
                    (this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == name.FirstName && m.LastName == name.LastName)[0].SecurityCode == 'NB' ||
                        this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == name.FirstName && m.LastName == name.LastName)[0].SecurityCode == 'NM' ||
                        this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == name.FirstName && m.LastName == name.LastName)[0].SecurityCode == 'VU' ||
                        this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == name.FirstName && m.LastName == name.LastName)[0].SecurityCode == 'NE' ||
                        this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(m => m.FirstName == name.FirstName && m.LastName == name.LastName)[0].SecurityCode == 'ED')) {
                    isCheckedApisStatus = false;
                }
            } else {
                isCheckedApisStatus = true;
            }
        })
        if (!isCheckedApisStatus) {
            this.isContinueButtonEnabled = false;
            this.isCheckinPrint = false;
        }
        else {
            this.isCheckinPrint = true;
        }
        if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsInterline || this.MultiSegmentPaxArray.Segment[this.currentPage].ETKTStatusNOTOK) {
            this.isContinueButtonEnabled = false;
            this.isOffloadButtonEnabled = false;
        }
        // this.SelectedPassengerList.forEach((name,index)=>{
        //     if(this.MultiSegmentPaxArray.Segment[
        //         this.currentPage
        //     ].Passenger.filter(m=>m.FirstName==name.FirstName&&m.LastName==name.LastName)[0].SecurityCode=="NB"||this.MultiSegmentPaxArray.Segment[
        //         this.currentPage
        //     ].Passenger.filter(m=>m.FirstName==name.FirstName&&m.LastName==name.LastName)[0].SecurityCode=="NM"||this.MultiSegmentPaxArray.Segment[
        //         this.currentPage
        //     ].Passenger.filter(m=>m.FirstName==name.FirstName&&m.LastName==name.LastName)[0].SecurityCode=="VU" || this.MultiSegmentPaxArray.Segment[
        //         this.currentPage
        //     ].Passenger.filter(m=>m.FirstName==name.FirstName&&m.LastName==name.LastName)[0].SecurityCode=="NE" || this.MultiSegmentPaxArray.Segment[
        //         this.currentPage
        //     ].Passenger.filter(m=>m.FirstName==name.FirstName&&m.LastName==name.LastName)[0].SecurityCode=="ED" ){
        //         this.isContinueButtonEnabled = false
        //     }
        // })
        if (this.MultiSegmentPaxArray.Segment[this.currentPage].isAPISSeatBagDisabled || this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted) {
            this.isContinueButtonEnabled = false;
            this.isOffloadButtonEnabled = false;
        }
    }

    gotoBaggage(item: any, btn: any) {
        if (item.INFwithoutSeat != true) {
            this.loaderProgress.showLoader();
            let previousSeg = this.currentPage - 1;
            if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsInternational) {
                if ((!this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted && (this.MultiSegmentPaxArray.Warning == null || this.MultiSegmentPaxArray.Warning[0].Message != CheckInComponent.WARNING)) && (item.SecurityCode != "NB" && item.SecurityCode != "NM" && item.SecurityCode != "VU" && item.SecurityCode != 'NE' && item.SecurityCode != 'ED') && (item.AdcDecisionStatus == "OK" || item.AdcDecisionStatus == "COK" || item.AdcDecisionStatus == "BYPASSED" || item.AdcDecisionStatus == "AUTOBYPASSED") && item.ApisDocoStatus == "Complete") {
                    if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsInterline && !item.CheckinStatus && (previousSeg >= 0 && this.MultiSegmentPaxArray.Segment[previousSeg].Passenger.filter(m => m.RPH == item.RPH)[0].CheckinStatus)) {
                        Toast.makeText("Cannot Process Interline flight").show();
                        this.loaderProgress.hideLoader();
                    } else {
                        let catalogReq = Converters.GetBagCatalog(this._shared.GetPassenger());
                        this._dataService.GetBaggage(catalogReq, this.OrderID).subscribe((data) => {
                            this.loaderProgress.hideLoader();
                            this._shared.SetBaggagecatalog(data);
                            console.log("err")
                            if (!this.MultiSegmentPaxArray.Segment[this.currentPage].IsInterline && !this.MultiSegmentPaxArray.Segment[this.currentPage].ETKTStatusNOTOK && !this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted) {
                                if (!this.MultiSegmentPaxArray.Segment[this.currentPage].isAPISSeatBagDisabled) {
                                    this.GetOrderService(this.OrderID, item, this.MultiSegmentPaxArray, btn)
                                }
                            }
                        },
                            err => {
                                console.log(err)
                                let error: any = { "Errors": [{ "Message": err }], "Success": false }
                                this._shared.SetBaggagecatalog(error);
                                this.loaderProgress.hideLoader();
                            });
                    }
                } else if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted) {
                    Toast.makeText("Flight is Restricted for this agent").show();
                    this.loaderProgress.hideLoader();
                } else if (!this._shared.GetIsWaitlisted() && !this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted) {
                    Toast.makeText("APIS Data Required").show();
                    this.loaderProgress.hideLoader();
                }
            } else {
                if ((!this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted && (this.MultiSegmentPaxArray.Warning == null || this.MultiSegmentPaxArray.Warning[0].Message != CheckInComponent.WARNING))) {
                    if (!this.isInternational) {
                        if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsInterline && !item.CheckinStatus && (previousSeg >= 0 && this.MultiSegmentPaxArray.Segment[previousSeg].Passenger.filter(m => m.RPH == item.RPH)[0].CheckinStatus)) {
                            Toast.makeText("Cannot Process Interline flight").show();
                            this.loaderProgress.hideLoader();
                        } else {

                            let catalogReq = Converters.GetBagCatalog(this._shared.GetPassenger());
                            this._dataService.GetBaggage(catalogReq, this.OrderID).subscribe((data) => {
                                this.loaderProgress.hideLoader();
                                this._shared.SetBaggagecatalog(data);
                                console.log("err")
                                if (!this.MultiSegmentPaxArray.Segment[this.currentPage].IsInterline && !this.MultiSegmentPaxArray.Segment[this.currentPage].ETKTStatusNOTOK && !this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted) {
                                    if (!this.MultiSegmentPaxArray.Segment[this.currentPage].isAPISSeatBagDisabled) {
                                        this.GetOrderService(this.OrderID, item, this.MultiSegmentPaxArray, btn)
                                    }
                                }
                            },
                                err => {
                                    console.log(err)
                                    let error: any = { "Errors": [{ "Message": err }], "Success": false }
                                    this._shared.SetBaggagecatalog(error);
                                    this.loaderProgress.hideLoader();
                                });
                        }

                    } else {
                        if ((item.AdcDecisionStatus == "OK" || item.AdcDecisionStatus == "COK" || item.AdcDecisionStatus == "BYPASSED" || item.AdcDecisionStatus == "AUTOBYPASSED") && item.ApisDocoStatus == "Complete") {
                            let catalogReq = Converters.GetBagCatalog(this._shared.GetPassenger());
                            this._dataService.GetBaggage(catalogReq, this.OrderID).subscribe((data) => {
                                this.loaderProgress.hideLoader();
                                this._shared.SetBaggagecatalog(data);
                                console.log("err")
                                if (!this.MultiSegmentPaxArray.Segment[this.currentPage].IsInterline && !this.MultiSegmentPaxArray.Segment[this.currentPage].ETKTStatusNOTOK && !this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted) {
                                    if (!this.MultiSegmentPaxArray.Segment[this.currentPage].isAPISSeatBagDisabled) {
                                        this.GetOrderService(this.OrderID, item, this.MultiSegmentPaxArray, btn)
                                    }
                                }
                            },
                                err => {
                                    console.log(err)
                                    let error: any = { "Errors": [{ "Message": err }], "Success": false }
                                    this._shared.SetBaggagecatalog(error);
                                    this.loaderProgress.hideLoader();
                                });
                        } else {
                            console.log(":1");
                            Toast.makeText("API Data Required").show();
                            this.loaderProgress.hideLoader();
                        }
                        // console.log(":2");
                        // Toast.makeText("API Data Required").show();
                        // this.loaderProgress.hideLoader();
                    }
                } else if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted) {
                    Toast.makeText("Flight is Restricted for this agent").show();
                    this.loaderProgress.hideLoader();
                }
            }
        } else {
            Toast.makeText('Baggage is not allowed for this passenger type').show();
        }





    }

    TicketBag(passengerDtl: any, multiSegment: any): void {
        try {
            // let ticket: any = this._shared.GetTier();
            // console.dir(ticket);
            // if (ticket.Success != false) {
            //     ticket.PassengerList.forEach((Paxdata, index) => {
            //         if (passengerDtl.OrderID == Paxdata.OrderId) {
            //             Paxdata.PassengerCharacteristics.forEach((tierData, tierIndex) => {
            //                 console.log(JSON.stringify(tierData));
            //                 if (tierData == "TicketOutOfSync") {
            //                     passengerDtl.SyncTicket = true;
            //                 }
            //             });
            //         }
            //     });
            // }
            this.MultiSegmentPaxArray = multiSegment;
            if (!passengerDtl.INFwithoutSeat) {
                this.SecurityDetails = this._shared.GetPassenger();
                this.securityDatas.ApisUpdateRequests[0].Documents.length = 0;
                let grpName = this.SecurityDetails.Passengers.filter(m => m.Firstname == passengerDtl.FirstName && m.Lastname == passengerDtl.LastName)[0].GroupedGivenName.split('/');
                if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsInternational) {
                    console.log(grpName)
                    if (((this.MultiSegmentPaxArray.Warning == null || this.MultiSegmentPaxArray.Warning[0].Message != CheckInComponent.WARNING)) && grpName.length <= 1 && (passengerDtl.SecurityCode != "NB" && passengerDtl.SecurityCode != "NM" && passengerDtl.SecurityCode != "VU" && passengerDtl.SecurityCode != 'NE' && passengerDtl.SecurityCode != 'ED') && (passengerDtl.AdcDecisionStatus == "OK" || passengerDtl.AdcDecisionStatus == "COK" || passengerDtl.AdcDecisionStatus == "BYPASSED" || passengerDtl.AdcDecisionStatus == "AUTOBYPASSED") && passengerDtl.ApisDocoStatus == "Complete" && (this.SecurityDetails.Passengers[0].Documents.length == 0 || passengerDtl.IsSecurityDocsComplete)) {
                        this.getBaggage(passengerDtl);
                    } else if (grpName.length > 2) {
                        alert("Multi-initial surname passenger. Please divide names before adding bags");
                        this.loaderProgress.hideLoader();
                    } else if (grpName.length == 2) {
                        if (passengerDtl.AssociatedInfantRPH != null || passengerDtl.AssociatedAdultRPH != null) {
                            this.getBaggage(passengerDtl);
                        } else {
                            alert("Multi-initial surname passenger. Please divide names before adding bags");
                            this.loaderProgress.hideLoader();
                        }
                    } else if ((this.MultiSegmentPaxArray.Warning != null && this.MultiSegmentPaxArray.Warning[0].Message == CheckInComponent.WARNING)) {
                        Toast.makeText("Ticket is out of SYNC").show();
                        this.loaderProgress.hideLoader();
                    }
                    else {
                        Toast.makeText(this._configuration.ApisDataRequired).show();
                        this.loaderProgress.hideLoader();
                    }
                }
                else {
                    if (((this.MultiSegmentPaxArray.Warning == null || this.MultiSegmentPaxArray.Warning[0].Message != CheckInComponent.WARNING)) && grpName.length <= 1) {
                        this.getBaggage(passengerDtl);
                    } else if (grpName.length > 2) {
                        alert("Multi-initial surname passenger. Please divide names before adding bags");
                        this.loaderProgress.hideLoader();
                    } else if (grpName.length == 2) {
                        if (passengerDtl.AssociatedInfantRPH != null || passengerDtl.AssociatedAdultRPH != null) {
                            this.getBaggage(passengerDtl);
                        } else {
                            alert("Multi-initial surname passenger. Please divide names before adding bags");
                            this.loaderProgress.hideLoader();

                        }
                    } else if ((this.MultiSegmentPaxArray.Warning != null && this.MultiSegmentPaxArray.Warning[0].Message == CheckInComponent.WARNING)) {
                        Toast.makeText("Ticket is out of SYNC").show();
                        this.loaderProgress.hideLoader();
                    }
                }
            }

            //     if (passengerDtl.IsSecurityDocsComplete) {
            //         this.getBaggage(passengerDtl);
            //     }
            //     else {
            //         Toast.makeText(this._configuration.ApisDataRequired).show();
            //     }
        } catch (error) {
            Toast.makeText(error).show();
            this.loaderProgress.hideLoader();
        }
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
                }, error => {
                    this.handleServiceError(error);
                    console.log(error);
                    this.loaderProgress.hideLoader();

                });

            //Inbound
            this._checkin.InBound(departureDate, flightnumber, city)
                .subscribe((data) => {
                    let inBound: any = data;
                    SegEle.inbound = Converters.ConvertToInBound(inBound);
                }, error => {
                    this.handleServiceError(error);
                    console.log(error);
                    this.loaderProgress.hideLoader();

                })

            //Outbound
            this._checkin.OutBound(departureDate, flightnumber, destination)
                .subscribe((data) => {
                    let OutBound: any = data;
                    SegEle.outbound = Converters.ConvertToOutBound(OutBound);
                }, error => {
                    this.handleServiceError(error);
                    console.log(error);
                    this.loaderProgress.hideLoader();

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
                }, error => {
                    this.handleServiceError(error);
                    console.log(error);
                    this.loaderProgress.hideLoader();

                })

        });
    }
    navigateToBaggage(item: string, baggagecatalog: string, multiSegmentPaxArray: string, currentPage: string, ticketNumber: string, shortcheckin: string, isShortCheck: boolean) {
        this.routerExtensions.navigate(["/baggageinfo"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                data: item,
                baggagecatalog: baggagecatalog,
                multiSegmentPaxArray: multiSegmentPaxArray,
                currentPage: currentPage,
                ticketNumber: ticketNumber,
                shortcheckin: shortcheckin,
                isShortCheck: isShortCheck
            }
        });
    }

    gotofqtv(item: MultiSegmentTemplate.Passenger, btn: any) {
        if (item.INFwithoutSeat != true) {
            console.dir(this.MultiSegmentPaxArray.Segment);
            console.log("R1:" + JSON.stringify(this.MultiSegmentPaxArray.Segment[this.currentPage].isAPISSeatBagDisabled));
            if ((!this.MultiSegmentPaxArray.Segment[this.currentPage].IsInterline && !this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted && !this.MultiSegmentPaxArray.Segment[this.currentPage].ETKTStatusNOTOK)) {
                if (!this.MultiSegmentPaxArray.Segment[this.currentPage].isAPISSeatBagDisabled) {
                    this.GetOrderService(this.OrderID, item, this.MultiSegmentPaxArray, btn)
                }
            } else {
                if (!this._shared.GetIsWaitlisted()) {
                    Toast.makeText("Cannot Process Interline flight").show();
                }
            }
        } else {
            Toast.makeText('Cannot add Fqtv number for this passenger type').show();
        }
    }
    Ticket(passengerDtl: MultiSegmentTemplate.Passenger, multiSegment: any): void {
        var param = JSON.stringify(passengerDtl.RPH);
        this.MultiSegmentPaxArray = multiSegment;
        var profile: string = this.Profile;
        this.loaderProgress.hideLoader();
        if (!passengerDtl.INFwithoutSeat) {
            if((this.MultiSegmentPaxArray.Segment[this.currentPage].IsInternational&&passengerDtl.ApisDocoStatus=="Complete"&&(passengerDtl.AdcDecisionStatus == "OK" || passengerDtl.AdcDecisionStatus == "COK" || passengerDtl.AdcDecisionStatus == "BYPASSED" || passengerDtl.AdcDecisionStatus == "AUTOBYPASSED"))||!this.MultiSegmentPaxArray.Segment[this.currentPage].IsInternational) {
            this.routerExtensions.navigate(["fqtv"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                },
                queryParams: {
                    RPHValue: param,
                    index: JSON.stringify(this.currentPage)
                }
            });
            }
        else{
            Toast.makeText(CheckInComponent.APISDATAREQUIRED).show();
                    this.loaderProgress.hideLoader();
        }
        }
    }
    verifyIDCheck(args: any): boolean {
        if (args.SecurityValue != null && args.SecurityValue.Help != null) {
            if (args.Documents.length > 0 && args.Documents[0].IsVerifiedData == true) {
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    }
    GetOrderService(orderID: any, item: any, legList: any, btn: any) {
        var board = this.MultiSegmentPaxArray.Segment[this.currentPage].Origin
        this.loaderProgress.showLoader();
        if ((this.MultiSegmentPaxArray.Segment[this.currentPage].MarketingFlight.substr(0, 2) == "CM" && this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight == null) || (this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight != null && this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight.substr(0, 2) == "CM")) {
            var board = this.MultiSegmentPaxArray.Segment[this.currentPage].Origin
            console.log("inside new conditon 1:" + board);

        } else {
            let previousIndex = this.currentPage - 1;
            board = this.MultiSegmentPaxArray.Segment[previousIndex].Origin;
            console.log("inside new conditon 1:" + board);
        }
        console.log("inside new conditon" + board);
        this._service.GetPassenger(orderID, board).subscribe(data => {
            this._shared.SetPassenger(data);
            let scTable: any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
            let PassengerArray: any = Converters.ConvertToFlightWithPaxTemplate(this._shared.GetPassenger(), null, scTable, "");
            let multiSegment = PassengerArray;
            multiSegment.Segment.forEach((seg, index) => {
                seg.Legs = legList.Segment[index].Legs;
                seg.inbound = legList.Segment[index].inbound;
                seg.outbound = legList.Segment[index].outbound;
                seg.inven = legList.Segment[index].inven;
                seg.status = legList.Segment[index].status;
                seg.FlightDate = legList.Segment[index].FlightDate;
                // let OriginlocDetails = status.Flights[0].Legs.filter(m => m.DepartureAirport.LocationCode == SegEle.Origin)[0];
                // SegEle.Legs = status.Flights[0].Legs;
                seg.ETD = legList.Segment[index].ETD;
                seg.STD = legList.Segment[index].STD;
                seg.ETA = legList.Segment[index].ETA;
            });
            item = multiSegment.Segment[this.currentPage].Passenger.filter(m => m.RPH == item.RPH)[0];
            if (btn == 'Seat') {
                this._shared.SetSegmentDetail(multiSegment)
                this.getSeatmap(true, item, multiSegment);
            }
            else if (btn == 'Bag') {
                this._shared.SetSegmentDetail(multiSegment);
                this.TicketBag(item, multiSegment);
            }
            else if (btn == 'FQTV') {
                this._shared.SetSegmentDetail(multiSegment);
                this.Ticket(item, multiSegment);
                this.loaderProgress.hideLoader();
            }
        },
            err => {
                console.log(err)
                this.handleServiceError(err);
                this.loaderProgress.hideLoader();
            });
    }
    gotoSeat(item: any, btn: any) {
        if (item.INFwithoutSeat != true) {
            // let ticket: any = this._shared.GetTier();
            // console.dir(ticket);
            // if (ticket.Success != false) {
            //     ticket.PassengerList.forEach((Paxdata, index) => {
            //         if (item.OrderID == Paxdata.OrderId) {
            //             Paxdata.PassengerCharacteristics.forEach((tierData, tierIndex) => {
            //                 console.log(JSON.stringify(tierData));
            //                 if (tierData == "TicketOutOfSync") {
            //                     item.SyncTicket = true;
            //                 }
            //             });
            //         }
            //     });
            // }
            let previousSeg = this.currentPage - 1;
            if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsInternational) {
                if ((!this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted && (this.MultiSegmentPaxArray.Warning == null || this.MultiSegmentPaxArray.Warning[0].Message != CheckInComponent.WARNING)) && (item.SecurityCode != "NB" && item.SecurityCode != "NM" && item.SecurityCode != "VU" && item.SecurityCode != 'NE' && item.SecurityCode != 'ED') && (item.AdcDecisionStatus == "OK" || item.AdcDecisionStatus == "COK" || item.AdcDecisionStatus == "BYPASSED" || item.AdcDecisionStatus == "AUTOBYPASSED") && item.ApisDocoStatus == "Complete") {
                    if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsInterline && !item.CheckinStatus && (previousSeg >= 0 && this.MultiSegmentPaxArray.Segment[previousSeg].Passenger.filter(m => m.RPH == item.RPH)[0].CheckinStatus)) {
                        //do not allow seatMap
                        this.loaderProgress.hideLoader();
                    } else {
                        this.GetOrderService(this.OrderID, item, this.MultiSegmentPaxArray, btn)
                        // this.TicketSeat(item);
                    }
                } else if ((this.MultiSegmentPaxArray.Warning != null && this.MultiSegmentPaxArray.Warning[0].Message == CheckInComponent.WARNING)) {
                    Toast.makeText("Ticket is out of SYNC").show();
                    this.loaderProgress.hideLoader();
                } else if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted) {
                    Toast.makeText("Flight is Restricted for this agent").show();
                    this.loaderProgress.hideLoader();
                } else if (!this._shared.GetIsWaitlisted() && !this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted) {
                    Toast.makeText("APIS Data Required").show();
                    this.loaderProgress.hideLoader();
                }
            }
            else if ((this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight != null && this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight.substr(0, 2) != 'CM') || (this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight == null && this.MultiSegmentPaxArray.Segment[this.currentPage].MarketingFlight != null && this.MultiSegmentPaxArray.Segment[this.currentPage].MarketingFlight.substr(0, 2) != 'CM')) {
                if ((this.MultiSegmentPaxArray.Warning == null || this.MultiSegmentPaxArray.Warning[0].Message != CheckInComponent.WARNING) && (item.SecurityCode != "NB" && item.SecurityCode != "NM" && item.SecurityCode != "VU" && item.SecurityCode != 'NE' && item.SecurityCode != 'ED') && (item.AdcDecisionStatus == "OK" || item.AdcDecisionStatus == "COK" || item.AdcDecisionStatus == "BYPASSED" || item.AdcDecisionStatus == "AUTOBYPASSED") && item.ApisDocoStatus == "Complete") {
                    if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsInterline && !item.CheckinStatus && (previousSeg >= 0 && this.MultiSegmentPaxArray.Segment[previousSeg].Passenger.filter(m => m.RPH == item.RPH)[0].CheckinStatus)) {
                        //do not allow seatMap
                        this.loaderProgress.hideLoader();
                    } else {
                        this.GetOrderService(this.OrderID, item, this.MultiSegmentPaxArray, btn)
                        // this.TicketSeat(item);
                    }
                }
            }
            else {
                if ((this.MultiSegmentPaxArray.Warning != null && this.MultiSegmentPaxArray.Warning[0].Message == CheckInComponent.WARNING) || this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted) {
                    if ((this.MultiSegmentPaxArray.Warning != null && this.MultiSegmentPaxArray.Warning[0].Message == CheckInComponent.WARNING)) {
                        Toast.makeText("Ticket is out of SYNC").show();
                        this.loaderProgress.hideLoader();
                    }
                    if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsFlightRestricted) {
                        Toast.makeText("Flight is Restricted for this agent").show();
                        this.loaderProgress.hideLoader();
                    }
                } else if (this.MultiSegmentPaxArray.Segment[this.currentPage].IsInterline && !item.CheckinStatus && (previousSeg >= 0 && this.MultiSegmentPaxArray.Segment[previousSeg].Passenger.filter(m => m.RPH == item.RPH)[0].CheckinStatus)) {
                    //do not allow seatMap

                    this.loaderProgress.hideLoader();
                } else {
                    if (!this.isInternational) {
                        this.GetOrderService(this.OrderID, item, this.MultiSegmentPaxArray, btn)
                    }
                    else {
                        if ((item.AdcDecisionStatus == "OK" || item.AdcDecisionStatus == "COK" || item.AdcDecisionStatus == "BYPASSED" || item.AdcDecisionStatus == "AUTOBYPASSED") && item.ApisDocoStatus == "Complete") {
                            this.GetOrderService(this.OrderID, item, this.MultiSegmentPaxArray, btn)
                        } else {
                            Toast.makeText("API Data Required").show();
                        }

                    }

                    // this.TicketSeat(item);
                }
            }

        } else {
            if (item.INFwithoutSeat) {
                Toast.makeText(CheckInComponent.SEATWARNING).show();
            }
        }
    }

    getSeatmap(isInit: boolean = false, item: PaxTemplate, multiSegment: any): void {
        this.loaderProgress.showLoader();
        console.log("getSeatMap called here ");
        // this.MultiSegmentPaxArray = multiSegment;
        var FlightNumber = this.MultiSegmentPaxArray.Segment[this.currentPage].MarketingFlight;
        var OperatingFlight = this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight;
        var date = this.MultiSegmentPaxArray.Segment[this.currentPage].DepartureDateTime.toString();
        var Date1 = date.slice(0, 10);
        var origin = this.MultiSegmentPaxArray.Segment[this.currentPage].Origin;
        var destination = this.MultiSegmentPaxArray.Segment[this.currentPage].Destination;
        console.log("Legs" + JSON.stringify(this.MultiSegmentPaxArray.Segment[this.currentPage].Legs));
        console.log("dest" + JSON.stringify(FlightNumber.substr(0, 2)));
        if ((FlightNumber.substr(0, 2) == "CM" && this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight == null) || (this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight != null && this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight.substr(0, 2) == "CM")) {
            if (this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight != null && this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight.substr(0, 2) == "CM") {
                FlightNumber = this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight
            }
            let selPax = this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(pax => pax.RPH == item.RPH);
            let passengerList = this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger;
            let legs = this.MultiSegmentPaxArray.Segment[this.currentPage].Legs;
            this._seatmap.GetSeatMap(FlightNumber, Date1, origin, selPax[0].FirstName, selPax[0].LastName, Number(selPax[0].PassengerSeqNumber), selPax[0].OrderID)
                .subscribe((result) => {
                    this.seatmapDetails = result;
                    // this._service.GetPassenger(this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger[0].OrderID)
                    //     .subscribe(data => {
                    // this._shared.SetPassenger(<Order.RootObject>data);
                    // this.legsInfo = this.MultiSegmentPaxArray.Segment[this.currentPage].Legs;
                    // let scTable: any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
                    // this.MultiSegmentPaxArray = Converters.ConvertToFlightWithPaxTemplate(this._shared.GetPassenger(), null, scTable, "");
                    // this.MultiSegmentPaxArray.Segment[this.currentPage].Legs = this.legsInfo;
                    //this.PassengerLists = passengerList
                    let selPax = this.PassengerLists.filter(pax => pax.RPH == item.RPH);
                    this.SeatMapList = Converters.ConvertToSeatMap(this.seatmapDetails, passengerList, FlightNumber, legs, origin, destination);
                    this._shared.SetSeatMap(this.SeatMapList);
                    this.TicketSeat(item);
                    this.loaderProgress.hideLoader();
                    if (result.Warnings.length > 0 || result.Warnings != null) {
                        console.log("toast");
                        result.Warnings.forEach((warning, index) => {
                            Toast.makeText(warning.Message).show();
                        })
                    }
                    // })


                },
                    error => {
                        console.log("Couldnt find seat information " + error);
                        this.handleServiceError(error);
                        this.loaderProgress.hideLoader();
                    },
                    () => {
                        console.log('Seat Map Retrieved successfully')
                    }
                )
        }
        else {
            console.log("OA SeatMap call");
            if (FlightNumber.substr(0, 2) == "CM") {
                var FlightNum = OperatingFlight;
            }
            else {
                FlightNum = FlightNumber;
            }
            let PaxArray = [new SeatMapOAPax.Passenger()];
            PaxArray.length = 0;
            this.PassengerLists.forEach((paxData, Index) => {
                let pax: SeatMapOAPax.Passenger = new SeatMapOAPax.Passenger();
                pax.Firstname = paxData.FirstName;
                pax.Lastname = paxData.LastName;
                pax.GroupPNR = false;
                pax.OrderId = paxData.OrderID;
                pax.PassengerTypeCode = paxData.PassengerTypeCode;
                pax.RPH = paxData.RPH;
                PaxArray.push(pax);
            })
            this.PassengerListForOASeatMap.Passengers = PaxArray;
            let optionalRef: SeatMapOAPax.OptionalFeeOptions = new SeatMapOAPax.OptionalFeeOptions();
            optionalRef.AccountCode = null;
            optionalRef.TicketDateOfIssue = null;
            optionalRef.TicketDesignator = null;
            optionalRef.TourCode = null;
            this.PassengerListForOASeatMap.OptionalFeeOptions = optionalRef;
            console.log("new Pax st:" + JSON.stringify(this.PassengerListForOASeatMap));
            var previousIndex = this.currentPage - 1;
            var FlightNumber = this.MultiSegmentPaxArray.Segment[previousIndex].MarketingFlight;
            var OperatingFlight = this.MultiSegmentPaxArray.Segment[previousIndex].OperatingFlight;
            var date = this.MultiSegmentPaxArray.Segment[previousIndex].DepartureDateTime.toString();
            var Date1 = date.slice(0, 10);
            var origin = this.MultiSegmentPaxArray.Segment[previousIndex].Origin;
            var destination = this.MultiSegmentPaxArray.Segment[previousIndex].Destination;
            var isSeatMapExists: boolean = false;
            let selPax = this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(pax => pax.RPH == item.RPH);
            this._seatmap.GetSeatMap(FlightNumber, Date1, origin, selPax[0].FirstName, selPax[0].LastName, Number(selPax[0].PassengerSeqNumber), selPax[0].OrderID)
                .subscribe((result) => {
                    if (result.Items != null) {
                        console.log("Inside 1st if");
                        result.Items.forEach((seatData, index) => {
                            if (seatData.FlightSegment.Flight == this.MultiSegmentPaxArray.Segment[this.currentPage].MarketingFlight || seatData.FlightSegment.Flight == this.MultiSegmentPaxArray.Segment[this.currentPage].OperatingFlight) {
                                console.log("Inside 2nd if");
                                isSeatMapExists = true;
                                this.seatmapDetails = result;
                                var curorigin = this.MultiSegmentPaxArray.Segment[this.currentPage].Origin;
                                var curdestination = this.MultiSegmentPaxArray.Segment[this.currentPage].Destination;
                                this.PassengerLists = this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger;
                                this.SeatMapList = Converters.OAseatmap(this.seatmapDetails, this.PassengerLists, FlightNum, this.MultiSegmentPaxArray.Segment[this.currentPage].Legs, curorigin, curdestination);
                                this._shared.SetSeatMap(this.SeatMapList);
                                this.TicketSeat(item);
                                this.loaderProgress.hideLoader();
                                if (result.Warnings.length > 0 || result.Warnings != null) {
                                    result.Warnings.forEach((warning, index) => {
                                        Toast.makeText(warning.Message).show();
                                    })
                                }
                            }
                        })
                        if (!isSeatMapExists) {
                            this.loaderProgress.hideLoader();
                            console.log("Seat map cannot be displayed");
                            Toast.makeText("Seat map cannot be displayed").show();

                        }

                    } else {
                        Toast.makeText(result.Warnings[0].Message).show();
                        this.loaderProgress.hideLoader();
                    }
                },
                    error => {
                        console.log("Couldnt find seat information " + error);
                        this.handleServiceError(error);
                        this.loaderProgress.hideLoader();
                    },
                    () => {
                        console.log('Seat Map Retrieved successfully')
                    }
                )
        }
        console.log("successfull");
    }

    TicketSeat(passengerDtl: PaxTemplate): void {
        var param = JSON.stringify(passengerDtl.RPH);
        if (!passengerDtl.INFwithoutSeat) {
            this.routerExtensions.navigate(["seatmap"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                },
                queryParams: {
                    RPHValue: param,
                    index: JSON.stringify(this.currentPage)
                }
            });
        }
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

    public gotoNextLeg(arg: any, FlightWithPax: any) {
        console.log("Direction: " + arg.direction);
        console.log("PageNumber: " + arg.object.pageindex);
        // console.log("Page:" + JSON.stringify(this.currentPage));


        if (arg.direction == 1 || arg.direction == 2) {
            this.SelectedPassengerList = [];
            this.MultiSegmentPaxArray.Segment[
                this.currentPage
            ].Passenger.forEach((pass, index) => {
                this.MultiSegmentPaxArray.Segment[this.currentPage].Passenger.filter(
                    m => m.FirstName == pass.FirstName
                )[0].IsChecked = false;
            });
        }
        if (arg.direction == 1 && this.currentPage > 0) {
            this.currentPage--;
        }
        if (
            arg.direction == 2 &&
            this.currentPage < this.MultiSegmentPaxArray.Segment.length - 1
        ) {
            console.log("++");
            this.currentPage++;
        }

        this.dots[arg.object.pageindex].check = true;
        this.check = false;
        console.log("P1:" + JSON.stringify(this.MultiSegmentPaxArray.Segment[this.currentPage].isAPISSeatBagDisabled));
        console.log("P2:" + JSON.stringify(this.isContinueButtonEnabled));
        if (this.MultiSegmentPaxArray.Segment[this.currentPage].isAPISSeatBagDisabled) {
            this.isContinueButtonEnabled = false;
            this.isOffloadButtonEnabled = false;
        }
        console.log("R1:" + JSON.stringify(this.MultiSegmentPaxArray.Segment[this.currentPage].isAPISSeatBagDisabled));
        console.log("R2:" + JSON.stringify(this.isContinueButtonEnabled));
        this.FlightDate = moment(this.MultiSegmentPaxArray.Segment[this.currentPage].FlightDate).format("DD-MMM-YYYY");
        this.isPrintbtnEnabled();
    }

    public visiblityVal(pageNumber: number): string {
        if (pageNumber == this.currentPage) {
            return "visible";
        } else return "collapsed";
    }

    public pageTabVal(pageNumber: number): boolean {
        if (pageNumber == this.currentPage) {
            return true;
        } else return false;
    }
    isItemVisible(args): string {
        if (args.toString().substr(0, 2) == "CM" && args.toString().length <= 5) {
            return "visible";
        } else return "collapsed";
    }
    isPrintbtnEnabled(): string {
        // console.log("Page:" + this.currentPage);
        // this.check = false;
        // console.log("isPrintbtnEnabled");
        this.MultiSegmentPaxArray.Segment[
            this.currentPage
        ].Passenger.forEach((pass, index) => {
            if (this.currentPage == 0) {
                if (pass.CheckinStatus == true) {
                    this.check = true;
                }
            }
        });

        if (this.check == true) {
            return "visible";
        } else {
            return "collapsed";
        }

    }

    Standby(args: any): string {
        if (args == "NRP" || args == "NRS") {
            return "visible";
        } else {
            return "collapsed";
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
}
