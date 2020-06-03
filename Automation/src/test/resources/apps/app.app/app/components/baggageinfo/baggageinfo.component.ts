//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import * as imageModule from "image-source";
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
import { PercentLength } from "ui/styling/style-properties"
import * as fs from "file-system";
import * as zebra from "nativescript-print-zebra";

//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as Toast from 'nativescript-toast';
import * as moment from "moment";
// import { scanCardClicked } from "nativescript-cardio";

//app references
import { Order, Inventory, PaymentData } from "../../shared/model/index"
import { DataService, CheckinOrderService, PassengerService, PrintEmailService, PaymentService, TimeOutService, CheckinService } from "../../shared/services/index";
import { baggageTemplate, PaxTemplate, LoaderProgress, order, OutBound, InBound, MultiSegmentTemplate } from '../../shared/interface/index';
import { PaymentComponent } from "../../components/payment/payment-modal"
import { Converters } from "../../shared/utils/index";
import { CheckInComponent } from "../../components/checkin/checkin.component";
import { Configuration } from '../../app.constants';
import { AppExecutiontime } from "../../app.executiontime";
import { StackLayout } from "ui/layouts/stack-layout";

var passwordTextField: textField.TextField

@Component({
    selector: "baggageinfo-app",
    providers: [DataService, PassengerService, Configuration, PrintEmailService, PaymentService, CheckinService],
    templateUrl: "components/baggageinfo/baggageinfo.component.html",
    styleUrls: ["components/baggageinfo/baggageinfo.component.css"],
})
export class BaggageinfoComponent implements OnInit {

    @ViewChild('pagecontainer') pageCont: ElementRef;
    @ViewChild('lv') lv: ElementRef;
    @ViewChild('baggageScroller') baggageScroller: ElementRef;
    @ViewChild('baggageContainer') baggageContainer: ElementRef;

    isError: boolean;
    errorMessage: string;
    public CardNumber: any;
    public cvv: any;
    public expiryMonth: any;
    public expiryYear: any;
    public btnList: Array<any>;
    public count = 0;
    public cash: boolean = false;
    public dCard: boolean = false;
    public cCard: boolean = false;
    public cart: boolean;
    private price: any;
    public baggagecatalog: any;
    public conver: Converters;
    public PassengerArray: Array<PaxTemplate> = [];
    public PassengerD: order;
    public searchString: any;
    public standardproducts: Array<any> = [];
    public catalogproducts: Array<any> = [];
    public standardproductsList: Array<string> = [];
    public catalogproductsList: Array<string> = [];
    public loaderProgress: LoaderProgress;
    public BagtagElement: any;
    public BagtagList: any;
    public refresh: boolean = false;
    public isContinuebtnEnabled = false;
    public Bagtagmessage: string = " ";
    public AddBaggegeDetailsarray: Array<baggageTemplate.AddBaggegeDetails> = [];
    public BaggageDetailarray: Array<baggageTemplate.BaggageDetail> = [];
    public bagsToPrices: baggageTemplate.BagsToPrices = null;
    public FlightSegment: any[];
    public Passenger: any[];
    public PricingInfo: any[];
    public PNR: any;
    public userdetails: any;
    public totalAmount: any = 0;
    public AmountArray: Array<number> = [];
    public date: any;
    public Paid: boolean = false;
    public items: Array<string>;
    public productitems: Array<string>;
    public tagitems: Array<string>;
    public selectedproduct: string;
    public weight: Array<boolean> = [false];
    public Tag: Array<boolean> = [false];
    public totalweight: number = 0;
    public totalweightcode: string;
    public isbagExist: boolean = false;
    public isRemoveBtnEnabled: boolean = true;
    public FBA: any;
    public Oversize: boolean = false;
    public OversizeCount: number = 0;
    public maxBagCount: number = 999;
    public bagCount: number = 0;
    public enableRemoveBag: boolean = true;
    isButtonEnabled: boolean;
    isCartButtonEnabled = false;
    public paymentCardDetails: any;
    public ShortCheckAirportCode: any = "";
    public ShortCheckRequired: boolean;
    PassedPassengerDetail: any;
    public isRemoveBag: boolean = false;
    public enableAddBag: boolean = true;
    public isCompensationEnabled: boolean = false;
    public filterargs = {
        "Origin.AirportCode": 'PTY'
    };
    public FlightInfo: MultiSegmentTemplate.FlightWithPax = new MultiSegmentTemplate.FlightWithPax;
    public MultiSegmentPaxArray: MultiSegmentTemplate.RootObject = new MultiSegmentTemplate.RootObject;
    public index: any;
    isEnabled: boolean = false;
    public CatalogServiceDetail: any;
    public ticketNumber: string;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    public navigateButtonEnabled: boolean = true;
    public static BAGGAGECHECK: string = "Kindly Add or Delete Baggage Details"
    public static BAGGAGEPAID: string = "PAID"
    public SharedBag: any;
    public FlightDate: any;
    public BaggageInfo: any;
    public isShortCheck :boolean;
    constructor(public _printemail: PrintEmailService, public _checkin: CheckinService, private _configuration: Configuration, private page: Page, public _timeoutService: TimeOutService, private routerExtensions: RouterExtensions, public _dataService: DataService, private router: Router, private location: Location, private activatedRouter: ActivatedRoute, private _modalService: ModalDialogService,
        private vcRef: ViewContainerRef, public _shared: CheckinOrderService, public _service: PassengerService, public _paymentService: PaymentService) {

        this.isError = false;
        this.errorMessage = "";
        this.btnList = ["1"];
        this.loaderProgress = new LoaderProgress();
        this.productitems = [];
        this.productitems.push("Standard");
        this.productitems.push("Catalog");
        this.selectedproduct = "Select Product";
        this.tagitems = [];
        this.tagitems.push("Auto");
        this.tagitems.push("Manual");
        this.isButtonEnabled = false;
    }

    ngOnInit() {

        this.loaderProgress.initLoader(this.pageCont);
        this.activatedRouter.queryParams.subscribe((params) => {
            this.PassedPassengerDetail = JSON.parse(params["data"]);
            console.log(this.PassedPassengerDetail)
            this.baggagecatalog = JSON.parse(params["baggagecatalog"]);
            if (this.PassedPassengerDetail.CheckinStatus) {
                this.isRemoveBtnEnabled = false;
                this.isButtonEnabled = false;
                console.log(this.isButtonEnabled)
            } else {
                this.isButtonEnabled = true;
            }
            console.log(this.isButtonEnabled)
            console.dir(this.baggagecatalog);
            this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
            this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
            // this.MultiSegmentPaxArray = JSON.parse(params["multiSegmentPaxArray"]);
            this.MultiSegmentPaxArray = this._shared.GetSegmentDetail();
            this.index = JSON.parse(params["currentPage"]);
            this.ticketNumber = JSON.parse(params["ticketNumber"]);
            this.ShortCheckAirportCode = JSON.parse(params["shortcheckin"]);
            this.isShortCheck= params["isShortCheck"];
            this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled");
            this.BaggageInfo = this._shared.GetPassenger().SegmentTravelerInfos.filter(m => m.SegmentRPH == this.MultiSegmentPaxArray.Segment[this.index].RPH && m.PassengerRPH == this.PassedPassengerDetail.RPH)[0].BaggageInfo;
            this.MultiSegmentPaxArray.Segment.forEach((data, index) => {
                if (data.MarketingFlight == this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight) {
                    this.FlightInfo = data;
                }
            });
            this.FlightDate = moment(this.MultiSegmentPaxArray.Segment[this.index].FlightDate).format("DD-MMM-YYYY");
            this.FlightInfo.Passenger.forEach((paxData, paxIndex) => {

                if (paxData.RPH == this.PassedPassengerDetail.RPH) {
                    this.totalweight = paxData.UnitOfMeasureQuantity;
                    this.totalweightcode = paxData.UnitOfMeasureCode;
                }
            })

            this.userdetails = ApplicationSettings.getString("userdetails", "");
            this.date = moment(new Date()).format("DD MMM YYYY");

        });
        this.standardproductsList.push("Standard");
        this.getBaggage();

        if (this.PassedPassengerDetail != null && this.PassedPassengerDetail.BagCount == 0) {
            if (this._shared.GetBagTag() != null) {
                this.AddBag();
            } else {
                this.AddBaggage();
            }
        } else {
            if (this._shared.GetBagTag() != null) {
                this.AddExistingBaggage(this.PassedPassengerDetail.BaggageInfo);
                this.AddBag();
            } else {
                this.AddExistingBaggage(this.PassedPassengerDetail.BaggageInfo);
            }
        }
        var label = this.pageCont.nativeElement
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args: gestures.GestureEventData) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();

        });
        this.SharedBag = this._shared.GetPassenger();
        this.loaderProgress.hideLoader();
    }
    AddBag() {
        this.enableAddBag = true;
        if (this._shared.GetBagTag().filter(m => m.RPH == this.PassedPassengerDetail.RPH).length > 0) {
            this._shared.GetBagTag().filter(m => m.RPH == this.PassedPassengerDetail.RPH)[0].CheckedBags.forEach((element, index) => {
                element.BaggageInfo.BagTagDetails.forEach((bagElement, Bagindex) => {
                    var addBaggegeDetails: baggageTemplate.AddBaggegeDetails = null;
                    addBaggegeDetails = new baggageTemplate.AddBaggegeDetails();
                    addBaggegeDetails.bagTag = null;
                    addBaggegeDetails.weight = bagElement.Weight;
                    addBaggegeDetails.weightUnit = null;
                    addBaggegeDetails.tagNumber = null;
                    addBaggegeDetails.fees = bagElement.fess;
                    addBaggegeDetails.destination = null;
                    addBaggegeDetails.standard = bagElement.isStandard;
                    addBaggegeDetails.catalog = !bagElement.isStandard;
                    addBaggegeDetails.auto = true;
                    addBaggegeDetails.manual = false;
                    addBaggegeDetails.status = "";
                    addBaggegeDetails.StdProduct = addBaggegeDetails.standard ? bagElement.productDescription : "";
                    addBaggegeDetails.Code = "";
                    addBaggegeDetails.CtlgProduct = addBaggegeDetails.standard ? "" : bagElement.productDescription;
                    addBaggegeDetails.AlreadyExisting = false;
                    addBaggegeDetails.selectedproduct = "Select product";
                    this.isContinuebtnEnabled = false;
                    this.AddBaggegeDetailsarray.push(addBaggegeDetails);
                    for (; this.count < 1; this.count++) {
                        this.btnList.push({
                            btn: "2"
                        });
                    }
                    this.isbagExist = false;
                    this.isButtonEnabled = true;
                    let scrView = <ScrollView>this.baggageScroller.nativeElement;
                    let contView = <StackLayout>this.baggageContainer.nativeElement;
                    scrView.scrollToVerticalOffset(PercentLength.toDevicePixels(contView.height), true);
                })
            })
        } else {
            this.AddBaggage();
        }

    }
    onContinue = function () {
        var self = this;
        let orderId: string = self.PassedPassengerDetail.OrderID;
        var self = this;
        if (this.PassedPassengerDetail)
            console.dir(this._shared.GetPassenger().SegmentTravelerInfos);
        if (!this.PassedPassengerDetail.CheckinStatus) {
            this.loaderProgress.hideLoader();
            self.routerExtensions.navigate(["checkin"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                },
                queryParams: {
                    "data": orderId,
                    "index": this.index,
                    "shortcheckin": this.PassedPassengerDetail.ShortCheckAirportCode
                }
            });
        } else {
            this.GetOrderDetails(orderId);
        }

    }
    cancel() {
        var self = this;
        let orderId: string = self.PassedPassengerDetail.OrderID;
        this._shared.SetBagTag(null);
        this.loaderProgress.hideLoader();
        self.routerExtensions.navigate(["checkin"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "data": orderId,
                "index": this.index
            }
        });
    }

    GetOrderDetails(id: string): void {

        this.loaderProgress.showLoader();
        try {
            var sDate = new Date();
            console.log('Get Passenger Service --------------- Start Date Time : ' + sDate);
            this._service.GetPassenger(id)
                .subscribe(data => {
                    if (data.Success != false) {
                        this._shared.SetPassenger(<Order.RootObject>data);
                        let scTable: any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
                        let PassengerArray: any = Converters.ConvertToFlightWithPaxTemplate(this._shared.GetPassenger(), null, scTable, "");
                        if (PassengerArray.Segment.length > 0) {
                            let setdepartureDate: string = moment(PassengerArray.Segment[0].DepartureDateTime.toString()).format("YYYY-MM-DD");
                            let setflightnumber: string = PassengerArray.Segment[0].MarketingFlight;
                            let setcity: string = PassengerArray.Segment[0].DepartureCity;
                            this.routerExtensions.navigate(["checkin"], {
                                animated: true,
                                transition: {
                                    name: "slide",
                                    duration: 600,
                                    curve: "linear"
                                },
                                queryParams: {
                                    "baggage": id,
                                    "index": this.index
                                }
                            });
                            // PassengerArray.Segment.forEach((SegEle, SegInndex) => {

                            //     let departureDate: string = moment(SegEle.DepartureDateTime.toString()).format("YYYY-MM-DD");
                            //     let flightnumber: string;
                            //     if (SegEle.MarketingFlight.substr(0, 2) == "CM") {
                            //         flightnumber = SegEle.MarketingFlight;
                            //     } else if (SegEle.OperatingFlight != null && SegEle.OperatingFlight.substr(0, 2) == "CM") {
                            //         flightnumber = SegEle.OperatingFlight;
                            //     } else {
                            //         flightnumber = SegEle.MarketingFlight;
                            //     }
                            //     let city: string = SegEle.DepartureCity;
                            //     SegEle.date = moment(SegEle.DepartureDateTime.toString()).format("DD-MMM-YYYY");
                            //     var destination = SegEle.Destination;
                            //     // //Inventory
                            //     // this._checkin.BookingCountDisplay(departureDate, flightnumber, city)
                            //     //     .subscribe((data) => {
                            //     //         if (data.Success != false) {
                            //     //             let inventory: any = data;
                            //     //             SegEle.inven = Converters.ConvertToInventory(inventory);
                            //     //         }
                            //     //     });

                            //     // //Inbound
                            //     // this._checkin.InBound(departureDate, flightnumber, city)
                            //     //     .subscribe((data) => {
                            //     //         if (data.Success != false) {
                            //     //             let inBound: any = data;
                            //     //             SegEle.inbound = Converters.ConvertToInBound(inBound);
                            //     //         }
                            //     //     })

                            //     // //Outbound
                            //     // this._checkin.OutBound(departureDate, flightnumber, destination)
                            //     //     .subscribe((data) => {
                            //     //         if (data.Success != false) {
                            //     //             let OutBound: any = data;
                            //     //             SegEle.outbound = Converters.ConvertToOutBound(OutBound);
                            //     //         }
                            //     //     })

                            //     // //status
                            //     // this._dataService.Status(departureDate, flightnumber, city)
                            //         .subscribe((data) => {
                            //             if (data.Success != false) {
                            //                 let status: any = data;
                            //                 SegEle.status = status.Flights[0].Legs[0].Status;
                            //                 SegEle.Legs = status.Flights[0].Legs;
                            //             }
                            //         })

                            // });

                            // this._dataService.GetBaggage(id).subscribe((data) => {
                            //     if (data.Success != false) {
                            //         this._shared.SetBaggagecatalog(data);
                            //     }
                            // });

                            //Tier
                            // this._dataService.Tier(setdepartureDate, setflightnumber, setcity)
                            //     .subscribe((data) => {
                            //         if (data.Success != false) {
                            //             let tier: any = data;
                            //             this._shared.SetTier(tier);
                            //             this._shared.SetSegmentDetail(PassengerArray);
                            //             var self = this;
                            //             this.loaderProgress.hideLoader();
                            //             // self.routerExtensions.navigate(["checkin"], {
                            //             //     animated: true,
                            //             //     transition: {
                            //             //         name: "slide",
                            //             //         duration: 600,
                            //             //         curve: "linear"
                            //             //     },
                            //             //     queryParams: {
                            //             //         "baggage": id,
                            //             //         "index": this.index
                            //             //     }
                            //             // });
                            //             self.routerExtensions.backToPreviousPage();
                            //         }
                            //     });

                        }
                        else {
                            this.loaderProgress.hideLoader();
                            Toast.makeText("Record Not Found").show();
                        }
                    }
                    else {
                        Toast.makeText(data.ErrorMessage).show();
                    }
                    // this.loaderProgress.hideLoader();
                },
                    err => {
                        console.log(err)
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
                    });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('Get Passenger Service --------------- End Date Time : ' + eDate);
            console.log('Get Passenger Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    }

    GetOrder(): void {

        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get Passenger Service --------------- Start Date Time : ' + sDate);
            var id = this.PassedPassengerDetail.OrderID;
            this._service.GetPassenger(id)
                .subscribe(data => {
                    if (data.Success != false) {
                        this._shared.SetPassenger(<Order.RootObject>data);
                        let scTable: any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
                        let PassengerArray: any = Converters.ConvertToFlightWithPaxTemplate(this._shared.GetPassenger(), null, scTable, "");
                        if (PassengerArray.Segment.length > 0) {

                            PassengerArray.Segment[this.index].Passenger.forEach((paxData, paxIndex) => {
                                if (paxData.RPH == this.PassedPassengerDetail.RPH) {
                                    this.totalweight = paxData.UnitOfMeasureQuantity;
                                    console.log(paxData.UnitOfMeasureQuantity + " converter weight");
                                    this.totalweightcode = paxData.UnitOfMeasureCode;
                                }
                            })
                        }
                        else {
                            //  this.loaderProgress.hideLoader();
                            Toast.makeText("Record Not Found").show();
                        }
                        this.loaderProgress.hideLoader();
                    }
                    else {
                        //  this.loaderProgress.hideLoader();                                                
                        Toast.makeText(data.ErrorMessage).show();

                    }


                },
                    err => {
                        console.log(err)
                        this.handleServiceError(err);
                        this.loaderProgress.hideLoader();
                    });


        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('Get Passenger Service --------------- End Date Time : ' + eDate);
            console.log('Get Passenger Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }



    }


    onSubmit = function () {
        try {
            this.navigateButtonEnabled = false;
            var startDate = new Date();
            console.log('Getbag Service --------------- Start Date Time : ' + startDate);
            let valid: boolean = true;
            valid = this.Validate()
            this.refresh = false;
            var deleteConfirmed: boolean = false;
            var reg = new RegExp(/^[0-9]+$/);
            console.log(this.AddBaggegeDetailsarray);
            if (this.AddBaggegeDetailsarray.length > 0 && valid) {
                this.BaggageDetailarray = [];
                console.log()
                this.AddBaggegeDetailsarray.forEach((Detail, index) => {

                    if (reg.test(Detail.weight)) {

                        // if (deleteConfirmed == true) {
                        this.weight[index] = false;
                        if (this.AddBaggegeDetailsarray.filter(m => m.status == "Pending Delete").length > 0) {
                            console.log("delete bag 1");
                            this.refresh = true;
                            if (this.AddBaggegeDetailsarray.filter(m => m.status == "").length > 0) {
                                this.refresh = false;
                            }
                            dialogs.confirm("Refund Baggage Fees, if any").then(result => {
                                console.log("Dialog result: " + result);
                                if (result) {
                                    deleteConfirmed = true;
                                    if (this.AddBaggegeDetailsarray.filter(m => m.status == "Pending Delete").length > 0) {
                                        console.log("delete bag 0");
                                        this.BagtagElement = Converters.DeleteBagTag(this.PassedPassengerDetail, this.FlightInfo, this.AddBaggegeDetailsarray);
                                        this.BagTag();
                                    }
                                }
                            });
                            // if (deleteConfirmed == true) {
                            // this.BagtagElement = Converters.DeleteBagTag(this.PassedPassengerDetail, this.FlightInfo, this.AddBaggegeDetailsarray);
                            // this.BagTag();
                            // }
                        }
                        if (this.AddBaggegeDetailsarray.filter(m => m.status == "").length > 0) {

                            this.refresh = true;

                            // this.AddBaggegeDetailsarray.forEach((Detail, Index) => {

                            if (!Detail.AlreadyExisting) {
                                var baggageDetail: baggageTemplate.BaggageDetail = null;
                                baggageDetail = new baggageTemplate.BaggageDetail();
                                baggageDetail.BaggageRPH = (index + 1).toString();
                                let FlifoStatus = this._shared.GetPassenger().Segments.filter(m => m.RPH == this.FlightInfo.SegmentRPH)[0].Status.StatusCode;
                                if (FlifoStatus == "SC") {
                                    baggageDetail.FlightSegmentRPH = this._shared.GetPassenger().Segments.filter(m => m.Status.StatusCode == "WK")[0].RPH;
                                    baggageDetail.LastFlightSegmentRPH = this._shared.GetPassenger().Segments.filter(m => m.Status.StatusCode == "WK")[0].RPH;
                                } else {
                                    baggageDetail.FlightSegmentRPH = this.FlightInfo.SegmentRPH;
                                    baggageDetail.LastFlightSegmentRPH = this.FlightInfo.SegmentRPH;
                                }

                                baggageDetail.PassengerRPH = this.PassedPassengerDetail.RPH;
                                baggageDetail.CheckedInIndicator = "N";
                                baggageDetail.Weight = Detail.weight;
                                if (Detail.Code != "") {
                                    baggageDetail.RFISC_SubCode = Detail.Code

                                } else {
                                    // Detail.Code = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].Code;
                                    // this.standardproducts.filter(m => m.weight==Detail.weight||m.weight>Detail.weight)[0].Code;
                                    // baggageDetail.RFISC_SubCode = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].Code;
                                
                                Detail.Code = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].RFIC;                                    
                                    baggageDetail.RFISC_Code = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].RFIC;
                                    baggageDetail.RFISC_SubCode = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].Code;
                                    console.log(baggageDetail.RFISC_SubCode);
                                
                                }
                                if(Detail.selectedproduct == "Standard"){
                                    baggageDetail.CommercialName = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].CommercialName;
                                    baggageDetail.LongDescription = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].LongDescription
                                    baggageDetail.WeightUnit = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].WeightUnit
                                    baggageDetail.ShortDescription = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].ShortDescription;
                                    baggageDetail.ServiceCode = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].ServiceCode;
                                    baggageDetail.SSRCode = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].SSRCode;
                                    baggageDetail.EMD_TypeCode = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].EMD_TypeCode;
                                    baggageDetail.DefaultInd = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].DefaultInd;
                                    baggageDetail.ProductGroupCode = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].ProductGroupCode;
                                    baggageDetail.RFISC_SubCode = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].Code;
                                    baggageDetail.RFISC_Code = this.standardproducts.filter(m => m.weight == Detail.weight || m.weight > Detail.weight)[0].RFIC;
                                    }else{
                                    baggageDetail.CommercialName = this.catalogproducts.filter(m => m.CommercialName == Detail.CtlgProduct )[0].CommercialName;
                                    baggageDetail.LongDescription = this.catalogproducts.filter(m => m.CommercialName == Detail.CtlgProduct)[0].LongDescription
                                    baggageDetail.WeightUnit = this.catalogproducts.filter(m => m.CommercialName == Detail.CtlgProduct )[0].WeightUnit
                                    baggageDetail.ShortDescription = this.catalogproducts.filter(m => m.CommercialName == Detail.CtlgProduct)[0].ShortDescription;
                                    baggageDetail.ServiceCode = this.catalogproducts.filter(m => m.CommercialName == Detail.CtlgProduct)[0].ServiceCode;
                                    baggageDetail.SSRCode = this.catalogproducts.filter(m => m.CommercialName == Detail.CtlgProduct)[0].SSRCode;
                                    baggageDetail.EMD_TypeCode = this.catalogproducts.filter(m => m.CommercialName == Detail.CtlgProduct)[0].EMD_TypeCode;
                                    baggageDetail.DefaultInd = this.catalogproducts.filter(m => m.CommercialName == Detail.CtlgProduct)[0].DefaultInd;
                                    baggageDetail.ProductGroupCode = this.catalogproducts.filter(m => m.CommercialName == Detail.CtlgProduct)[0].ProductGroupCode;
                                    baggageDetail.RFISC_SubCode = this.catalogproducts.filter(m => m.CommercialName == Detail.CtlgProduct)[0].Code;
                                    baggageDetail.RFISC_Code = this.catalogproducts.filter(m => m.CommercialName == Detail.CtlgProduct)[0].RFIC;
                                    }
                                
                                if (Detail.Oversize == true) {
                                    baggageDetail.IsOversized = true;
                                } else {
                                    baggageDetail.IsOversized = false;
                                }
                                baggageDetail.Pieces = 1;
                                this.BaggageDetailarray.push(baggageDetail);
                            }
                            if (Detail.AlreadyExisting) {
                                var baggageDetail: baggageTemplate.BaggageDetail = null;
                                baggageDetail = new baggageTemplate.BaggageDetail();
                                baggageDetail.BaggageRPH = (index + 1).toString();
                                baggageDetail.FlightSegmentRPH = this.FlightInfo.SegmentRPH;
                                baggageDetail.LastFlightSegmentRPH = this.FlightInfo.SegmentRPH;
                                baggageDetail.PassengerRPH = this.PassedPassengerDetail.RPH;
                                if (Detail && Detail.CheckedInIndicator)
                                    baggageDetail.CheckedInIndicator = Detail.CheckedInIndicator;

                                if (Detail && Detail.RFISC_SubCode)
                                    baggageDetail.RFISC_SubCode = Detail.RFISC_SubCode;
                                if(Detail.PieceOccurrenceType && Detail.PieceOccurrence){
                                    baggageDetail.PieceOccurrenceType = Detail.PieceOccurrenceType;
                                    baggageDetail.PieceOccurrence =  Detail.PieceOccurrence;
                                }
                                baggageDetail.IsOversized = false;
                                baggageDetail.Pieces = 1;
                                baggageDetail.Weight = 0;
                                this.BaggageDetailarray.push(baggageDetail);
                            }
                            // });

                            var bagsToPrice: baggageTemplate.BagsToPrice = null;
                            bagsToPrice = new baggageTemplate.BagsToPrice();
                            bagsToPrice.FlightSegment = this.FlightSegment;
                            bagsToPrice.Passenger = this.Passenger;
                            bagsToPrice.Passenger[0].freeBaggageAllowance = { "Pieces": this.FBA }
                            bagsToPrice.PricingInfo = this.PricingInfo;
                            bagsToPrice.PNR = this.PNR;
                            bagsToPrice.BaggageDetail = this.BaggageDetailarray;

                            this.bagsToPrices = new baggageTemplate.BagsToPrices();
                            this.bagsToPrices.BagsToPrice = [];
                            this.bagsToPrices.BagsToPrice.push(bagsToPrice);
                        }
                        else {
                            if (!this.refresh) {
                                Toast.makeText(BaggageinfoComponent.BAGGAGECHECK).show();
                            }
                        }
                        // }
                    } else {
                        Toast.makeText("Only numbers").show();
                        this.weight[index] = true;
                    }
                })
                // if (this.AddBaggegeDetailsarray.filter(m => m.status == "Pending Delete").length > 0) {
                //     console.log("delete bag 2");
                //     this.BagTag();
                // }

                if (this.AddBaggegeDetailsarray.filter(m => m.status == "").length > 0) {
                    this.GetPrice(this.bagsToPrices);
                }

            }

        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var endDate = new Date();
            console.log('Gebag Service --------------- End Date Time : ' + endDate);
            console.log('Gebag Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(startDate), new Date(endDate)));
        }
    }


    GetPrice(bagsToPrices: baggageTemplate.BagsToPrices): void {
        try {
            this.navigateButtonEnabled = false;
            var startDate = new Date();
            this.loaderProgress.showLoader();
            console.log('GetPrice Service --------------- Start Date Time : ' + startDate);
            console.log(JSON.stringify(bagsToPrices));
            let isPrice: boolean = false;
            let currency = this._shared.GetCurrency();
            this._dataService.GetPrice(bagsToPrices, currency).subscribe((data) => {
                if (data.Success != false) {
                    this.isEnabled = false;
                    this.price = <any>data;
                    console.dir(this.price);
                    // this._shared.GetPassenger().SegmentTravelerInfos.forEach((element, index) => {
                    //     if (element.PassengerRPH == this.PassedPassengerDetail.RPH) {
                    //         this._shared.GetPassenger().SegmentTravelerInfos[index].BaggageInfo = Object.assign({}, this.price);
                    //         console.log(this._shared.GetPassenger());
                    //     }
                    // });
                    if (this.price.Collection != null) {
                        this.price.Collection.forEach((data, SegIndex) => {
                            if (data.OriginDestination != null) {
                                data.OriginDestination[0].BaggageDetail.some((Baggagedata, OriginDestinationIndex) => {
                                    this.AddBaggegeDetailsarray.forEach((BaggegeDetail, Detailndex) => {
                                        if (BaggegeDetail.status == "" && OriginDestinationIndex == Detailndex) {
                                            if(Baggagedata.CheckedInIndicator){
                                                BaggegeDetail.CheckedInIndicator = Baggagedata.CheckedInIndicator;
                                            }
                                            if(Baggagedata.PriceData && Baggagedata.PriceData.PieceOccurrenceType && Baggagedata.PriceData.PieceOccurrence){
                                                BaggegeDetail.PieceOccurrenceType = Baggagedata.PriceData.PieceOccurrenceType;
                                                BaggegeDetail.PieceOccurrence = Baggagedata.PriceData.PieceOccurrence;
                                            }
                                            if (Baggagedata.PriceData.PriceType && Baggagedata.PriceData.PriceType != null) {
                                                console.log(Baggagedata.PriceData.PriceType)
                                                BaggegeDetail.fees = Baggagedata.PriceData.PriceType;
                                            } else {
                                                BaggegeDetail.fees = Baggagedata.PriceData.ServiceFeeInfo.Amount == null ? "--" : Baggagedata.PriceData.ServiceFeeInfo.Amount + " " + Baggagedata.PriceData.ServiceFeeInfo.Currency;
                                                alert("baggage fees currently not supported - contact check-in desk");
                                                isPrice = true;
                                                // this.AddBaggegeDetailsarray.forEach((Detail, index) => {
                                                //     if (!Detail.AlreadyExisting) {
                                                // var index = this.AddBaggegeDetailsarray.indexOf(BaggegeDetail);
                                                // this.AddBaggegeDetailsarray.splice(index, 1);
                                                //     }
                                                // })
                                                return true;
                                            }
                                            // if (Baggagedata.PriceData.ServiceFeeInfo.Amount != null) {
                                            //     this.AmountArray.push(Baggagedata.PriceData.ServiceFeeInfo.Amount);
                                            // }
                                            // this.totalAmount = this.totalAmount + Baggagedata.PriceData.ServiceFeeInfo.Amount;
                                        }
                                    });
                                });

                            }

                        });
                    }
                    if (isPrice) {
                        this.AddBaggegeDetailsarray = this.AddBaggegeDetailsarray.filter(m => m.AlreadyExisting === true);
                        // this.AddBaggegeDetailsarray.forEach((Detail, index) => {
                        //     if (!Detail.AlreadyExisting) {
                        //         var index = this.AddBaggegeDetailsarray.indexOf(Detail);
                        //         this.AddBaggegeDetailsarray.splice(index, 1);
                        //     }
                        // })
                    }
                    if (this.price.Errors != null) {
                        Toast.makeText(this.price.Errors[0].Message).show();
                        this.loaderProgress.hideLoader();
                    }

                }
                else {
                    this.loaderProgress.hideLoader();
                    Toast.makeText(data.Errors[0].Message).show();
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

                    // if (this.AmountArray.length > 0) {
                    //     this.isEnabled = true;
                    //     this.isButtonEnabled = true;
                    //     this.isCartButtonEnabled = true;
                    //     this.loaderProgress.hideLoader();
                    // }
                    // else {
                    if (this.price.Errors == null) {
                        if (this.AddBaggegeDetailsarray.filter(m => m.AlreadyExisting == false).length > 0) {
                            this.BagtagElement = Converters.GetBagTag(this.PassedPassengerDetail, this.FlightInfo, this.AddBaggegeDetailsarray, this.FlightInfo, this.ShortCheckAirportCode);
                            var PassengerList: any = [];
                            if (this._shared.GetBagTag() != null) {
                                PassengerList = this._shared.GetBagTag();
                            }
                            if (PassengerList.length > 0 && PassengerList.filter(m => m.RPH == this.BagtagElement.PassengerList[0].RPH).length > 0) {
                                // PassengerList.filter(m => m.RPH == this.BagtagElement.PassengerList[0].RPH)[0] = this.BagtagElement.PassengerList[0]
                                PassengerList.splice(PassengerList.indexOf(PassengerList.filter(m => m.RPH == this.BagtagElement.PassengerList[0].RPH)[0]), 1);
                                PassengerList.push(this.BagtagElement.PassengerList[0])
                            } else {
                                PassengerList.push(this.BagtagElement.PassengerList[0])
                            }
                            console.log(PassengerList);
                            if (this.PassedPassengerDetail.CheckinStatus) {
                                this.BagTag();
                            } else {
                                this._shared.SetBagTag(PassengerList);
                                this.isContinuebtnEnabled = true;
                                this.navigateButtonEnabled = true;
                                this.loaderProgress.hideLoader();
                            }
                        } else {
                            this.AddBaggage();
                            console.log(this.AddBaggegeDetailsarray);
                            this.loaderProgress.hideLoader();
                        }


                    } else {
                        this.loaderProgress.hideLoader();
                        Toast.makeText(this.price.Errors[0].Message).show();
                    }
                    // }
                });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var endDate = new Date();
            console.log('GetPrice Service --------------- End Date Time : ' + endDate);
            console.log('GetPrice Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(startDate), new Date(endDate)));
        }

    }

    isShortCheckin(args: MultiSegmentTemplate.Passenger, item: any): boolean {
        // console.log(args.ShortCheckinArrivalCodesByFlights);
        // console.log(this.MultiSegmentPaxArray.Segment[this.index].FlightNumber);
        if (args.ShortCheckinArrivalCodesByFlights != null && args.ShortCheckinArrivalCodesByFlights.filter(m => m.FlightNumber == this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight || m.FlightNumber == this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight).length > 0 && args.ShortCheckinArrivalCodesByFlights.filter(m => m.FlightNumber == this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight || m.FlightNumber == this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight)[0].ShortCheckinArrivalCodes.IsEligibleForShortCheckin && item.AlreadyExisting == false) {
            this.ShortCheckRequired = true;
            return true;
        } else {
            this.ShortCheckRequired = false;
            return false;
        }
    }
    selectShortCheckCode(args: MultiSegmentTemplate.Passenger,item) {
        let ShortcheckCodes: Array<string> = args.ShortCheckinArrivalCodesByFlights.filter(m => m.FlightNumber == this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight)[0].ShortCheckinArrivalCodes.ShortCheckInArrivalCodes;
        if(ShortcheckCodes!=null&& ShortcheckCodes!=[]){
            let options = {
                title: "ShortCheck",
                message: "Choose Destination",
                actions: ShortcheckCodes
            };
            dialogs.action(options).then(result => {
                console.log(result);
                if (result) {                   
                    args.ShortCheckAirportCode = result;
                    item.ShortCheckAirportCode = result;
                } else {                  
                    args.ShortCheckAirportCode = ShortcheckCodes[0];
                    item.ShortCheckAirportCode = ShortcheckCodes[0];

                }
            })
        }
        
    }

    getBaggage(): void {
        try {
            var startDate = new Date();
            console.log('GetBaggage Service --------------- Start Date Time : ' + startDate);
            this.loaderProgress.showLoader();
            if (this.baggagecatalog != null && this.baggagecatalog.Collection != null) {
                this.baggagecatalog.Collection.forEach((data, SegIndex) => {

                    if (data.Passenger[0].PassengerRPH == this.PassedPassengerDetail.RPH) {
                        if (data.Passenger[0].MaxBagCount) {
                            this.maxBagCount = data.Passenger[0].MaxBagCount
                        }
                        this.FlightSegment = data.FlightSegment;
                        // this.Passenger = data.Passenger;
                        this.PricingInfo = data.PricingInfo;
                        data.PNR.CheckedInIndicator = true;
                        this.PNR = data.PNR;
                        console.dir(this.index);
                        console.dir(data.OriginDestination.filter(m => m.OriginDestinationRPH == this.MultiSegmentPaxArray.Segment[this.index].RPH)[0])
                        if (data.OriginDestination.filter(m => m.OriginDestinationRPH == this.MultiSegmentPaxArray.Segment[this.index].RPH).length > 0) {
                            this.FBA = data.OriginDestination.filter(m => m.OriginDestinationRPH == this.MultiSegmentPaxArray.Segment[this.index].RPH)[0].BaggageCatalog.FreeBaggageAllowance.Pieces
                        } else {
                            this.FBA = data.OriginDestination[0].BaggageCatalog.FreeBaggageAllowance.Pieces
                        }
                        if ((this.MultiSegmentPaxArray.Segment[this.index].Passenger.filter(m => m.RPH == this.PassedPassengerDetail.RPH)[0].AssociatedInfantRPH)) {
                            this.Passenger = data.Passenger;
                            this.Passenger.push({ PassengerRPH: this.MultiSegmentPaxArray.Segment[this.index].Passenger.filter(m => m.RPH == this.PassedPassengerDetail.RPH)[0].AssociatedInfantRPH, Type: "INF", freeBaggageAllowance: { Pieces: this.FBA } })
                        } else {
                            this.Passenger = data.Passenger;
                        }
                        data.OriginDestination[0].BaggageCatalog.SubGrpDetail.forEach((GrpDetail, SegIndex) => {


                            GrpDetail.BaggageDetail.forEach((Product, SegIndex) => {

                                if (GrpDetail.SubGrpCode == null && Product.IsStandardBag) {
                                    let standardproduct = new baggageTemplate.ProductDetail();
                                    standardproduct.CommercialName = Product.EmdProduct.CommercialName;
                                    standardproduct.Code = Product.EmdProduct.RFISC_SubCode;
                                    standardproduct.RFIC = Product.EmdProduct.RFIC;
                                    standardproduct.SubType = Product.EmdProduct.SubType; // EMDType
                                    standardproduct.ServiceCode = Product.ServiceCode;// TypeOfService
                                    standardproduct.SSRCode = Product.EmdProduct.SSRCode;
                                    standardproduct.ShortDescription = Product.EmdProduct.ShortDescription;
                                    standardproduct.LongDescription = Product.EmdProduct.LongDescription;
                                    standardproduct.EMD_TypeCode = Product.EmdProduct.EMD_TypeCode;
                                    standardproduct.weight = Product.Weight;
                                    standardproduct.WeightUnit = Product.WeightUnit;
                                    standardproduct.DefaultInd = Product.DefaultInd;
                                    standardproduct.ProductGroupCode = GrpDetail.ProductGroupCode;
                                    standardproduct.EMD_TypeCode = Product.EmdProduct.EMD_TypeCode;
                                    if (standardproduct.weight >= 100) {
                                        this.standardproductsList.push(standardproduct.CommercialName);
                                    }
                                    this.standardproducts.push(standardproduct);
                                    this.standardproducts.sort(function (a, b) {
                                        var val1 = a.weight;
                                        var val2 = b.weight;
                                        console.log(val1 + " " + val2);

                                        if (val1 < val2) {
                                            return -1;
                                        } else {
                                            return 1;
                                        }

                                    });
                                    console.log(this.standardproducts);

                                }
                                else {
                                    try{
                                    let catalogproduct = new baggageTemplate.ProductDetail();
                                    catalogproduct.CommercialName = Product.EmdProduct.CommercialName;
                                    catalogproduct.Code = Product.EmdProduct.RFISC_SubCode;
                                    catalogproduct.RFIC = Product.EmdProduct.RFIC;
                                    catalogproduct.SubType = Product.EmdProduct.SubType; // EMDType
                                    catalogproduct.ServiceCode = Product.EmdProduct.ServiceCode;// TypeOfService
                                    catalogproduct.SSRCode = Product.EmdProduct.SSRCode;
                                    catalogproduct.weight = Product.Weight;
                                    catalogproduct.DefaultInd = Product.DefaultInd;
                                    catalogproduct.ProductGroupCode = GrpDetail.ProductGroupCode
                                    catalogproduct.LongDescription = Product.EmdProduct.LongDescription;
                                    catalogproduct.ShortDescription = Product.EmdProduct.ShortDescription; 
                                    catalogproduct.EMD_TypeCode = Product.EmdProduct.EMD_TypeCode;
                                    this.catalogproductsList.push(catalogproduct.CommercialName);
                                    this.catalogproducts.push(catalogproduct);
                                }
                                catch(e){
                                    console.log(e);
                                }
                            }

                            });

                        });
                    }
                });
            }
            else {
                Toast.makeText("Catalog not found");
            }
            this.loaderProgress.hideLoader();

        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var endDate = new Date();
            // this.loaderProgress.hideLoader();
            console.log('GetBaggage Service --------------- End Date Time : ' + endDate);
            console.log('GetBaggage Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(startDate), new Date(endDate)));
        }


    }
    public AddBaggage(): void {
        if (this.enableAddBag) {
            this.enableAddBag = true;
            this.enableRemoveBag = false;
            this.bagCount = this.AddBaggegeDetailsarray.length + 1;
            if (this.bagCount <= this.maxBagCount) {
                var addBaggegeDetails: baggageTemplate.AddBaggegeDetails = null;
                addBaggegeDetails = new baggageTemplate.AddBaggegeDetails();
                addBaggegeDetails.bagTag = null;
                addBaggegeDetails.weight = null;
                addBaggegeDetails.weightUnit = null;
                addBaggegeDetails.tagNumber = null;
                addBaggegeDetails.fees = null;
                addBaggegeDetails.destination = null;
                addBaggegeDetails.standard = false;
                addBaggegeDetails.catalog = false;
                addBaggegeDetails.auto = true;
                addBaggegeDetails.manual = false;
                addBaggegeDetails.status = "";
                addBaggegeDetails.StdProduct = "";
                addBaggegeDetails.Code = "";
                addBaggegeDetails.CtlgProduct = "";
                addBaggegeDetails.AlreadyExisting = false;
                addBaggegeDetails.selectedproduct = "Select product";
                this.isContinuebtnEnabled = false;
                this.AddBaggegeDetailsarray.push(addBaggegeDetails);
                for (; this.count < 1; this.count++) {
                    this.btnList.push({
                        btn: "2"
                    });
                }
                this.isbagExist = false;
                this.isButtonEnabled = true;
                let scrView = <ScrollView>this.baggageScroller.nativeElement;
                let contView = <StackLayout>this.baggageContainer.nativeElement;
                scrView.scrollToVerticalOffset(PercentLength.toDevicePixels(contView.height), true);
            } else {
                Toast.makeText("Maximum number of baggage reached").show();
            }
        }

    }

    onChange(args: any, argsindex: any, index, item: any) {
        this._timeoutService.resetWatch();
        console.log(args);
        // if (this.isButtonEnabled) {
        switch (index) {

            case 0:
                console.log(args)
                if (args == "") {
                    Toast.makeText(this._configuration.FieldValidationText).show();
                }
                var reg = new RegExp(/^[0-9]+$/);

                var test = reg.test(args);
                console.log(test);
                if (test == false) {

                    this.weight[argsindex] = true;
                    this.validateFeild(item);
                    // this.isButtonEnabled = false;
                    Toast.makeText("Only number").show();
                }
                else {
                    this.weight[argsindex] = false;
                    this.validateFeild(item);
                    //this.isButtonEnabled = true;
                }
                // else this.weight = false;
                let testWeight = Number(args);
                if (item.standard && item.StdProduct == "Standard") {
                    let length = this.standardproducts.filter(m => m.weight <= 45).length - 1
                    if (length > 0 && testWeight > this.standardproducts.filter(m => m.weight <= 45)[length].weight) {
                        Toast.makeText("Baggage weight exceeds allowable (100KG) for standard baggage.Extra baggage needs to be transported as cargo.").show();
                        item.weight = "";
                        this.weight[argsindex] = true;
                        this.validateFeild(item);
                    } else if (test == false) {
                        this.weight[argsindex] = true;
                        this.validateFeild(item);
                    } else {
                        this.weight[argsindex] = false;
                        this.validateFeild(item);
                    }

                } else if (item.standard && item.StdProduct != "Standard" && item.catalog == false) {
                    if (this.standardproducts.filter(m => m.Name == item.StdProduct).length > 0 && testWeight > this.standardproducts.filter(m => m.Name == item.StdProduct)[0].weight) {
                        Toast.makeText("Baggage weight exceeds allowable (100KG) for standard baggage.Extra baggage needs to be transported as cargo.").show();
                        item.weight = "";
                        this.weight[argsindex] = true;
                        this.validateFeild(item);
                    } else if (test == false) {
                        this.weight[argsindex] = true;
                        this.validateFeild(item);
                    } else {
                        this.weight[argsindex] = false;
                        this.validateFeild(item);
                    }
                } else {
                    if (this.catalogproducts.filter(m => m.Name == item.CtlgProduct).length > 0 && testWeight > this.catalogproducts.filter(m => m.Name == item.CtlgProduct)[0].weight) {
                        Toast.makeText("Baggage weight exceeds allowable size.Extra baggage needs to be transported as cargo..").show();
                        item.weight = "";
                        this.weight[argsindex] = true;
                        this.validateFeild(item);
                    } else if (test == false) {
                        this.weight[argsindex] = true;
                        this.validateFeild(item);
                    } else {
                        this.weight[argsindex] = false;
                        this.validateFeild(item);
                    }
                }

                // console.log(this.weight);
                break;
            case 1:
                if (args == "" && item.manual) {
                    Toast.makeText(this._configuration.FieldValidationText).show();
                }
                var reg = new RegExp(/^[0-9]+$/);
                var regs = new RegExp(/^[a-zA-Z]{2}[0-9]{6}$/);
                var test = reg.test(args);
                var tests = regs.test(args);
                console.log(test);
                if ((test == false && tests == false) && item.manual) {

                    this.Tag[argsindex] = true;
                    this.validateFeild(item);
                    // this.isButtonEnabled = false;
                }
                else {
                    this.Tag[argsindex] = false;
                    this.validateFeild(item);
                    //this.isButtonEnabled = true;
                }

        }
        // }

    }
    public validateFeild(item: any) {
        if (this.weight.filter(m => m == true).length > 0 || ((item.manual) && (this.Tag.filter(m => m == true).length > 0))) {
            this.isButtonEnabled = false;
        } else {
            this.isButtonEnabled = true;
        }
    }
    public Validate(): boolean {
        try {
            let msg: string = "";
            let checktag: boolean = false;
            let productcheck: boolean = false;
            let weightcheck: boolean = false;
            let destinationCheck: boolean = false;
            let bagtagnumber: boolean = false;
            if (this.AddBaggegeDetailsarray.filter(m => m.status == "").length > 0) {

                this.AddBaggegeDetailsarray.forEach((Detail, Index) => {
                    if (!Detail.AlreadyExisting) {
                        if (Detail.auto == false && Detail.manual == false) {
                            msg = msg == "" ? "auto or manual" : (msg + " ," + "auto or manual");
                            checktag = true;
                        }
                        if (Detail.StdProduct == "" && Detail.CtlgProduct == "") {
                            msg = msg == "" ? "product" : (msg + " ," + "product");
                            productcheck = true;
                        }
                        if (Detail.weight == null) {
                            msg = msg == "" ? "weight" : (msg + " ," + "weight")
                            weightcheck = true;
                        }
                        if (this.ShortCheckRequired && (Detail.ShortCheckAirportCode == ""||Detail.ShortCheckAirportCode == null)) {
                            msg = msg == "" ? "destination city" : (msg + " ," + "destination city");
                            destinationCheck = true;
                        }
                        if (Detail.manual == true) {
                            if (Detail.tagNumber != null && Detail.tagNumber != "") {
                                if (Detail.tagNumber.length == 6 || Detail.tagNumber.length == 8) {
                                } else {
                                    msg = msg == "" ? " Invalid bagtag number " + Detail.tagNumber + ". Tag number should be 6 " : (msg + " ," + " Invalid bagtag number" + Detail.tagNumber + ". Tag number should be 6 ")
                                    bagtagnumber = true;
                                }
                            } else {
                                msg = msg == "" ? "Tag number should be 6  " : (msg + " ," + "Tag number should be 6 ")
                                bagtagnumber = true;
                            }

                        }

                    }

                });


            } else {
                if (this.AddBaggegeDetailsarray.filter(m => m.status == "Pending Delete").length > 0) {
                    return true;

                } else {
                    if (this.AddBaggegeDetailsarray.length > 0) {
                        Toast.makeText("Kindly add or Remove baggage").show();

                    } else {
                        Toast.makeText("Kindly add baggage").show();

                    }

                    return false


                }

            }
            if (msg == "") {
                return true;

            } else {
                if (checktag != false) {
                    Toast.makeText("Auto or Manual required").show();
                }
                if (productcheck != false) {
                    Toast.makeText("Product required").show();
                }
                if (weightcheck != false) {
                    Toast.makeText("Weight required").show();
                }
                if (destinationCheck) {
                    Toast.makeText("destination city required").show();
                }
                if (bagtagnumber) {
                    Toast.makeText("bagtagnumber is not valid").show();
                }

                // Toast.makeText(msg + " required").show();
                return false;

            }
        }
        catch (error) {
            console.log(error.message);

        }
        finally {
            var endDate = new Date();
            console.log('Validate--------------- End Date Time : ' + endDate);
            console.log('Validate Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(endDate), new Date(endDate)));
        }


    }
    public AddExistingBaggage(BaggageDetail: any): void {
        // this.isRemoveBtnEnabled = false

        if (BaggageDetail != null && BaggageDetail.BagTagDetails != null) {
            let MeasureQuantit: number = 0;
            let weight: number = 0;

            if (BaggageDetail.UnitOfMeasureQuantity != null && BaggageDetail.UnitOfMeasureQuantity > 0) {
                MeasureQuantit = BaggageDetail.UnitOfMeasureQuantity;
                weight = ((MeasureQuantit) / (this.PassedPassengerDetail.BagCount));
            }
            else {
                weight = BaggageDetail.UnitOfMeasureQuantity;
            }

            this.PassedPassengerDetail.TotalWeight = MeasureQuantit;
            this.AddBaggegeDetailsarray = [];
            BaggageDetail.BagTagDetails.forEach((Detail, DetailIndex) => {
                var addBaggegeDetails: baggageTemplate.AddBaggegeDetails = null;
                addBaggegeDetails = new baggageTemplate.AddBaggegeDetails();
                addBaggegeDetails.bagTag = null;
                addBaggegeDetails.weight = Math.round(weight);
                addBaggegeDetails.weightUnit = BaggageDetail.UnitOfMeasureCode;
                addBaggegeDetails.tagNumber = Detail.CarrierCode + Detail.SerialNumber;
                addBaggegeDetails.fees = null;
                addBaggegeDetails.destination = null;
                addBaggegeDetails.standard = true;
                addBaggegeDetails.catalog = false,
                    addBaggegeDetails.auto = true,
                    addBaggegeDetails.manual = false,
                    addBaggegeDetails.status = "CheckedIn";
                addBaggegeDetails.StdProduct = "";
                addBaggegeDetails.Code = "";
                addBaggegeDetails.CtlgProduct = "";
                addBaggegeDetails.AlreadyExisting = true;
                addBaggegeDetails.CheckedInIndicator =  Detail.CheckedInIndicator;
                if(Detail.RFISC_SubCode)
                addBaggegeDetails.RFISC_SubCode = Detail.RFISC_SubCode
                if(Detail.PieceOccurrence && Detail.PieceOccurrenceType){
                    addBaggegeDetails.PieceOccurrence = Detail.PieceOccurrence
                    addBaggegeDetails.PieceOccurrenceType = Detail.PieceOccurrenceType
                }

                addBaggegeDetails.BagTagDetails = Detail;
                console.log(addBaggegeDetails);
                this.AddBaggegeDetailsarray.push(addBaggegeDetails);

            });
            this.isbagExist = true;

            for (; this.count < 1; this.count++) {
                this.btnList.push({
                    btn: "2"
                });
            }
        }
    };
    public AddManualBaggage(BaggageInfo: any): void {

        if (BaggageInfo.BaggageDetails != null) {
            let MeasureQuantit: number = 0;
            let weight: number = 0;

            if (BaggageInfo.CheckedBagWeightTotal != null && BaggageInfo.CheckedBagWeightTotal > 0) {
                MeasureQuantit = BaggageInfo.CheckedBagWeightTotal;
                weight = ((MeasureQuantit) / (BaggageInfo.CheckedBagCountTotal));
            }
            else {
                weight = BaggageInfo.CheckedBagWeightTotal;
            }
            this.PassedPassengerDetail.TotalWeight = MeasureQuantit;
            this.AddBaggegeDetailsarray = [];
            BaggageInfo.BaggageDetails.forEach((Detail, DetailIndex) => {
                var addBaggegeDetails: baggageTemplate.AddBaggegeDetails = null;
                addBaggegeDetails = new baggageTemplate.AddBaggegeDetails();
                addBaggegeDetails.bagTag = null;
                addBaggegeDetails.weight = Math.round(weight);
                addBaggegeDetails.weightUnit = BaggageInfo.UnitOfMeasureCode;
                addBaggegeDetails.tagNumber = Detail.CarrierCode + Detail.SerialNumber;
                addBaggegeDetails.fees = null;
                addBaggegeDetails.destination = null;
                addBaggegeDetails.standard = true;
                addBaggegeDetails.catalog = false,
                    addBaggegeDetails.auto = true,
                    addBaggegeDetails.manual = false,
                    addBaggegeDetails.status = "CheckedIn";
                addBaggegeDetails.StdProduct = "";
                addBaggegeDetails.Code = "";
                addBaggegeDetails.CtlgProduct = "";
                addBaggegeDetails.AlreadyExisting = true;
                addBaggegeDetails.BagTagDetails = Detail;
                this.AddBaggegeDetailsarray.push(addBaggegeDetails);
            });
            this.isbagExist = true;
            for (; this.count < 1; this.count++) {
                this.btnList.push({
                    btn: "2"
                });
            }
        }
    };

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
    displayCatalogproductsDialog(item: baggageTemplate.AddBaggegeDetails) {

        let options = {
            title: "Catalog",
            // message: "Choose  catalog",
            cancelButtonText: "Cancel",
            actions: this.catalogproductsList
        };
        dialogs.action(options).then((result) => {
            if (result != "Cancel") {

                item.catalog = true;
                item.StdProduct = "";
                item.CtlgProduct = "";
                item.Code = "";
                item.CtlgProduct = result;
                item.Code = this.catalogproducts.filter(m => m.Name == result)[0].Code;
                this.CatalogServiceDetail = this.catalogproducts.filter(m => m.Name == result)[0];
            }

        });

    }
    displayStandardproductsDialog(item: baggageTemplate.AddBaggegeDetails) {

        let options = {
            title: "Standard",
            //message: "Choose  standard",
            cancelButtonText: "Cancel",
            actions: this.standardproductsList
        };
        dialogs.action(options).then((result) => {
            if (result != "Cancel") {

                item.standard = true;
                item.StdProduct = "";
                item.CtlgProduct = "";
                item.Code = "";
                item.StdProduct = result;
                if (this.standardproducts.filter(m => m.Name == result).length > 0) {
                    item.Code = this.standardproducts.filter(m => m.Name == result)[0].Code;
                    this.CatalogServiceDetail = this.standardproducts.filter(m => m.Name == result)[0];
                }

            }

        });


    }
    displayTagActionDialog(item: baggageTemplate.AddBaggegeDetails) {
        let options = {
            title: "Bag Tag",
            // message: "Choose  Bag Tag",
            cancelButtonText: "Cancel",
            actions: this.tagitems
        };
        dialogs.action(options).then((result) => {
            if (result != "Cancel") {

                if (result == "Auto") {
                    item.auto = true;
                    item.manual = false;
                } else {
                    item.manual = true;
                    item.auto = false;
                }
            }
        });
    }
    displayProductActionDialog(item: baggageTemplate.AddBaggegeDetails) {
        let options = {
            title: "Product",
            // message: "Choose  Product",
            cancelButtonText: "Cancel",
            actions: this.productitems
        };
        dialogs.action(options).then((result) => {
            if (result != "Cancel") {
                item.selectedproduct = result;

                if (result == "Standard") {

                    item.standard = true;
                    item.StdProduct = "";
                    item.CtlgProduct = "";
                    item.Code = "";
                    item.StdProduct = result;
                    if (this.standardproducts.filter(m => m.Name == result).length > 0) {
                        item.Code = this.standardproducts.filter(m => m.Name == result)[0].Code;
                        this.CatalogServiceDetail = this.standardproducts.filter(m => m.Name == result)[0];
                    }

                }
                if (result == "Catalog") {
                    this.displayCatalogproductsDialog(item);
                }
                if (result == "Select Product") {
                    item.standard = false;
                    item.catalog = false;
                    item.StdProduct = "";
                    item.CtlgProduct = "";
                    item.Code = "";

                }

            }

        });


    }
    // displayScanOptionDialog() {
    //     let options = {
    //         title: "Credit Card",
    //         // message: "Choose  Product",
    //         cancelButtonText: "Cancel",
    //         actions: ["Scan Credit Card", "Manual Entry"]
    //     };
    //     dialogs.action(options).then((result) => {
    //         if (result == "Scan Credit Card") {
    //             scanCardClicked().then((number) => {
    //                 console.log(number);
    //                 this.CardNumber = number.cardNumber;
    //                 this.cvv = number.cvv;
    //                 this.expiryMonth = number.expiryMonth;
    //                 this.expiryYear = number.expiryYear
    //                 console.log(this.CardNumber);
    //                 let options: ModalDialogOptions = {
    //                     viewContainerRef: this.vcRef,
    //                     context: [{ "cardNumber": this.CardNumber, "cvv": this.cvv }],
    //                     fullscreen: false
    //                 };

    //                 this._modalService.showModal(PaymentComponent, options)
    //                     .then((result) => {
    //                         this.paymentCardDetails = result;
    //                         this.isButtonEnabled = true;
    //                         this.confirm(null);
    //                     });
    //             });
    //         }

    //         if (result == "Manual Entry") {
    //             let options: ModalDialogOptions = {
    //                 viewContainerRef: this.vcRef,
    //                 context: [{ "cardNumber": this.CardNumber }],
    //                 fullscreen: false
    //             };

    //             this._modalService.showModal(PaymentComponent, options)
    //                 .then((result) => {
    //                     this.paymentCardDetails = result;
    //                     this.isButtonEnabled = true;
    //                     this.confirm(null);
    //                 });
    //         }

    //     });


    // }
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

    public BagTag(): void {
        try {
            this.loaderProgress.showLoader();
            console.log(JSON.stringify(this.BagtagElement));
            let bagtagElement = Object.assign({}, this.BagtagElement)
            this._shared.SetBagTag(null);
            this._dataService.GetBagTag(this.BagtagElement).subscribe((data) => {
                console.log(JSON.stringify(data));
                console.dir(this._shared.GetPassenger().SegmentTravelerInfos[this.index].BaggageInfo)
                if (data.Success != false) {
                    this.BagtagList = <any>data;
                    let bagtagList = Object.assign({}, data);
                    console.dir(this.BagtagList);
                    if (data.Warnings != null && data.Warnings.length > 0) {
                        data.Warnings.forEach((warning, index) => {
                            Toast.makeText(warning.Message).show();
                           
                        })
                    }
                    if (this.isRemoveBag == true) {
                        this._shared.SetBagTag(null);
                        this._service.GetPassenger(this.MultiSegmentPaxArray.Segment[this.index].Passenger[0].OrderID)
                            .subscribe(data => {
                                this._shared.SetPassenger(<Order.RootObject>data);
                                let scTable: any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
                                this.MultiSegmentPaxArray = Converters.ConvertToFlightWithPaxTemplate(this._shared.GetPassenger(), null, scTable, "");
                                this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((paxData, paxIndex) => {
                                    if (paxData.RPH == this.PassedPassengerDetail.RPH) {
                                        this.PassedPassengerDetail = paxData;
                                        this.totalweight = paxData.UnitOfMeasureQuantity;
                                        this.totalweightcode = paxData.UnitOfMeasureCode;
                                    }
                                })
                                this.AddBaggegeDetailsarray = [];
                                this.standardproductsList.push("Standard");
                                this.getBaggage();
                                this.enableAddBag = true;
                                if (this.PassedPassengerDetail != null && this.PassedPassengerDetail.BagCount == 0) {
                                    if (this._shared.GetBagTag() != null) {
                                        this.AddBag();
                                    } else {
                                        this.AddBaggage();
                                    }
                                } else {
                                    if (this._shared.GetBagTag() != null) {
                                        this.AddExistingBaggage(this.PassedPassengerDetail.BaggageInfo);
                                        this.AddBag();
                                    } else {
                                        this.AddExistingBaggage(this.PassedPassengerDetail.BaggageInfo);
                                        this.AddBaggage();
                                    }
                                }
                                this.loaderProgress.hideLoader();
                                this.routerExtensions.navigate(["checkin"], {
                                    animated: true,
                                    transition: {
                                        name: "slide",
                                        duration: 600,
                                        curve: "linear"
                                    },
                                    queryParams: {
                                        "data": this.PassedPassengerDetail.OrderID,
                                        "index": this.index,
                                        
                                    }
                                });
                                // this.AddExistingBaggage(this.PassedPassengerDetail.BaggageInfo);
                            }, err => {
                                console.log(err)
                                this.handleServiceError(err);
                                this.loaderProgress.hideLoader();
                            });
                    }
                    else {
                        if (!ApplicationSettings.getBoolean("isHostBagtag")) {
                            if (data.BagTagPrintResponse && data.BagTagPrintResponse.BagTagOutput[0].PicRawData) {
                                let image = imageModule.fromBase64(data.BagTagPrintResponse.BagTagOutput[0].PicRawData);
                                let folder = fs.knownFolders.documents();
                                let filename: string = moment(new Date()).format("hhmmss");
                                let path = fs.path.join(folder.path, "tempBPImage" + filename + ".jpg");
                                try {
                                    image.saveToFile(path, "jpeg");
                                    let printerID = this.getPrinter();
                                    if (printerID.trim() != "") {
                                        let self = this;
                                        new zebra.Printer({ address: printerID, language: "CPCL", debugging: false }).then(function (curPrinter, result) {
                                            var document = curPrinter.createDocument();
                                            document.image(fs.path.join(folder.path, "tempBPImage" + filename + ".jpg"), 0);
                                            curPrinter.getStatus().then(function (result) {
                                                console.log(result);
                                                if (result.ready && !result.latchOpen && !result.lowBattery && !result.paperOut) {
                                                    //printing
                                                    curPrinter.print(document).catch(function (status) {
                                                        console.log(status);
                                                        Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
                                                    });
                                                        console.log("Printing Done");
                                                        let file = folder.getFile("tempBPImage" + filename + ".jpg");
                                                        file.remove().then((res) => {
                                                            console.log("file removed")
                                                        })
                                                        Toast.makeText("Bagtag printed sucessfully").show();
                                                        let Remakrequest: any = Converters.BluetoothPrinterResponse(bagtagElement, bagtagList, true);
                                                        console.log(JSON.stringify(Remakrequest));
                                                        self._printemail.Remarks(Remakrequest).subscribe((data) => {
                                                            console.log(data);
                                                            if (data.Information != null && data.Information.length > 0) {
                                                                Toast.makeText(data.Information[0].Message).show();
                                                            }
                                                            self.printerResponse();
                                                        }, error => {
                                                            this.handleServiceError(error);
                                                            this.AddBaggegeDetailsarray.forEach((Detail, index) => {
                                                                if (!Detail.AlreadyExisting) {
                                                                    var index = this.AddBaggegeDetailsarray.indexOf(Detail);
                                                                    this.AddBaggegeDetailsarray.splice(index, 1);
                                                                }
                                                            })

                                                        });

                                                        curPrinter.close().then(function () {
                                                            Toast.makeText("Printer is ready to print").show();
                                                            this.loaderProgress.hideLoader();

                                                        }).catch(function (err) {
                                                            Toast.makeText("Error Occured while Printing:").show();
                                                            // console.log("Printing Error: ", err);
                                                            curPrinter.close();
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
                                                Toast.makeText(CheckInComponent.PRINTERSESSION).show();
                                                console.log("HI");
                                                self.PrintFail(bagtagElement, bagtagList);
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
                            } else if (this.AddBaggegeDetailsarray.filter(m => m.AlreadyExisting == false && m.manual == true).length > 0) {
                                this.printerResponse();
                            } else {
                                Toast.makeText(CheckInComponent.UNABLETOPRINT).show();
                                this.PrintFail(bagtagElement, bagtagList);

                            }
                        } else {
                            if (this.BagtagList.Errors != null && this.BagtagList.Errors.length > 0) {
                                if (this.BagtagList.Errors.filter(m => m.Message.indexOf("BAG TAG PRINT FAILED") >= 0)) {
                                    console.log("nij");
                                    this.AddBaggegeDetailsarray = this.AddBaggegeDetailsarray.filter(m => m.AlreadyExisting === true);
                                    // this.AddBaggegeDetailsarray.forEach((Detail, index) => {
                                    //     if (!Detail.AlreadyExisting) {
                                    //         var index = this.AddBaggegeDetailsarray.indexOf(Detail);
                                    //         this.AddBaggegeDetailsarray.splice(index, 1);
                                    //     }
                                    // })
                                    this.AddBaggage();
                                    this.loaderProgress.hideLoader();
                                }
                            } else {
                                this.printerResponse();
                            }
                        }
                    }
                }
                else {
                    this.loaderProgress.hideLoader();
                    Toast.makeText(data.Errors[0].Message).show();
                    if (data.Errors != null && data.Errors.length > 0) {
                        if (data.Errors.filter(m => m.Message.indexOf("BAG TAG PRINT FAILED") >= 0)) {
                            console.log("nij");
                            this.AddBaggegeDetailsarray = this.AddBaggegeDetailsarray.filter(m => m.AlreadyExisting === true);
                            // this.AddBaggegeDetailsarray.forEach((Detail, index) => {
                            //     if (!Detail.AlreadyExisting) {
                            //         var index = this.AddBaggegeDetailsarray.indexOf(Detail);
                            //         this.AddBaggegeDetailsarray.splice(index, 1);
                            //     }
                            // })
                            this.AddBaggage();
                            this.loaderProgress.hideLoader();
                        }
                    }
                    this._shared.SetBagTag(null);
                    this._service.GetPassenger(this.MultiSegmentPaxArray.Segment[this.index].Passenger[0].OrderID)
                        .subscribe(data => {
                            this._shared.SetPassenger(<Order.RootObject>data);
                            let scTable: any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
                            this.MultiSegmentPaxArray = Converters.ConvertToFlightWithPaxTemplate(this._shared.GetPassenger(), null, scTable, "");
                            this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((paxData, paxIndex) => {
                                if (paxData.RPH == this.PassedPassengerDetail.RPH) {
                                    this.PassedPassengerDetail = paxData;
                                    this.totalweight = paxData.UnitOfMeasureQuantity;
                                    this.totalweightcode = paxData.UnitOfMeasureCode;
                                }
                            })
                            this.AddBaggegeDetailsarray = [];
                            this.standardproductsList.push("Standard");
                            this.getBaggage();
                            this.enableAddBag = true;
                            if (this.PassedPassengerDetail != null && this.PassedPassengerDetail.BagCount == 0) {
                                if (this._shared.GetBagTag() != null) {
                                    this.AddBag();
                                } else {
                                    this.AddBaggage();
                                }
                            } else {
                                if (this._shared.GetBagTag() != null) {
                                    this.AddExistingBaggage(this.PassedPassengerDetail.BaggageInfo);
                                    this.AddBag();
                                } else {
                                    this.AddExistingBaggage(this.PassedPassengerDetail.BaggageInfo);
                                    this.AddBaggage();
                                }
                            }
                            // this.AddExistingBaggage(this.PassedPassengerDetail.BaggageInfo);
                        }, err => {
                            console.log(err)
                            this.handleServiceError(err);
                            this.loaderProgress.hideLoader();
                        });
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
                    this._shared.SetBagTag(null);
                    // this.AddBaggegeDetailsarray = [];
                    this._service.GetPassenger(this.MultiSegmentPaxArray.Segment[this.index].Passenger[0].OrderID)
                        .subscribe(data => {
                            this._shared.SetPassenger(<Order.RootObject>data);
                            let scTable: any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
                            this.MultiSegmentPaxArray = Converters.ConvertToFlightWithPaxTemplate(this._shared.GetPassenger(), null, scTable, "");
                            this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((paxData, paxIndex) => {
                                if (paxData.RPH == this.PassedPassengerDetail.RPH) {
                                    this.PassedPassengerDetail = paxData;
                                    this.totalweight = paxData.UnitOfMeasureQuantity;
                                    this.totalweightcode = paxData.UnitOfMeasureCode;
                                }
                            })
                            this.AddBaggegeDetailsarray = [];
                            this.standardproductsList.push("Standard");
                            this.getBaggage();

                            if (this.PassedPassengerDetail != null && this.PassedPassengerDetail.BagCount == 0) {
                                if (this._shared.GetBagTag() != null) {
                                    this.AddBag();
                                } else {
                                    this.AddBaggage();
                                }
                            } else {
                                if (this._shared.GetBagTag() != null) {
                                    this.AddExistingBaggage(this.PassedPassengerDetail.BaggageInfo);
                                    this.AddBag();
                                } else {
                                    this.AddExistingBaggage(this.PassedPassengerDetail.BaggageInfo);
                                }
                            }
                            // this.AddExistingBaggage(this.PassedPassengerDetail.BaggageInfo);
                        }, err => {
                            console.log(err)
                            this.handleServiceError(err);
                            this.loaderProgress.hideLoader();
                        });

                    this.loaderProgress.hideLoader();

                },
                () => {
                    if (this.refresh) {
                        this.isContinuebtnEnabled = true;
                        if (this.Bagtagmessage != " ") {
                            //  alert(message);
                            //   Toast.makeText(message).show();
                            //alert(this.Bagtagmessage);
                        }
                        // this.loaderProgress.hideLoader();

                    }

                })
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        } finally {
            var endDate = new Date();
            console.log('SearchPaxByOrderID Service --------------- End Date Time : ' + endDate);
            console.log('SearchPaxByOrderID Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(endDate), new Date(endDate)));

        }
        this.navigateButtonEnabled = true;
    }

    public PrintEmailService(Remakrequest: any): void {
        this._printemail.Remarks(Remakrequest).subscribe((data) => {
            console.log(data);
            this.printerResponse();
        });
    }
    printerResponse() {

        if (this.BagtagList.SegmentTravelerInfos != null) {
            this._shared.GetPassenger().SegmentTravelerInfos.forEach((element, index) => {
                if (element.PassengerRPH == this.PassedPassengerDetail.RPH) {
                    this._shared.GetPassenger().SegmentTravelerInfos[index].BaggageInfo = this.BagtagList.SegmentTravelerInfos[0].BaggageInfo;
                    this._shared.GetPassenger().SegmentTravelerInfos[index].BaggageInfo.CheckedBagWeightTotal = this.BagtagList.ManualBagTag.BaggageInfo.CheckedBagWeightTotal;
                    this._shared.GetPassenger().SegmentTravelerInfos[index].BaggageInfo.UnitOfMeasureQuantity = this.BagtagList.ManualBagTag.BaggageInfo.CheckedBagWeightTotal;
                }
            });
            // this.SharedBag = this._shared.GetPassenger().SegmentTravelerInfos;
        }
        this.Bagtagmessage = " ";
        if (this.BagtagList.Warnings != null) {
            this.BagtagList.Warnings.forEach((msg, Index) => {
                //this.Bagtagmessage = this.Bagtagmessage + "  " + msg.Message;
                Toast.makeText(msg.Message).show();
                // Toast.makeText(this.Bagtagmessage).show();
                this.loaderProgress.hideLoader();
            });

        }
        if (this.refresh) {


            if (this.BagtagList.ManualBagTag != null && this.BagtagList.ManualBagTag.BaggageInfo != null) {
                if (this.BagtagList.ManualBagTag.BaggageInfo.CheckedBagCountTotal != null && this.BagtagList.ManualBagTag.BaggageInfo.CheckedBagCountTotal != 0) {
                    this.PassedPassengerDetail.BaggageInfo = this.BagtagList.ManualBagTag.BaggageInfo;
                    this.AddManualBaggage(this.BagtagList.ManualBagTag.BaggageInfo);

                } else {
                    this.AddBaggegeDetailsarray = [];
                    this.AddBaggage();
                }
            } else {
                // this.AddBaggegeDetailsarray = [];
                // this.AddBaggage();
                if (this.BagtagList.Errors != null) {
                    Toast.makeText(this.BagtagList.Errors[0].Message).show();
                } else {
                    this.AddBaggegeDetailsarray = [];
                }
                //  this.loaderProgress.hideLoader();
            }
        }
        this.cart = false;
        this.Paid = false;
        let scTable: any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
        let PassengerArray: any = Converters.ConvertToFlightWithPaxTemplate(this._shared.GetPassenger(), null, scTable, "");
        console.dir(this._shared.GetPassenger());
        console.dir(PassengerArray);
        if (PassengerArray.Segment.length > 0) {
            PassengerArray.Segment[this.index].Passenger.forEach((paxData, paxIndex) => {
                if (paxData.RPH == this.PassedPassengerDetail.RPH) {
                    this.totalweight = paxData.UnitOfMeasureQuantity;
                    this.totalweightcode = paxData.UnitOfMeasureCode;
                }
            })
            this.loaderProgress.hideLoader();
        }
        else {
            Toast.makeText("Record Not Found").show();
            this.loaderProgress.hideLoader();

        }
    }

    PrintFail(bagtagElement, bagtagList) {
        let Remakrequest: any = Converters.BluetoothPrinterResponse(bagtagElement, bagtagList, false);
        console.log(JSON.stringify(Remakrequest));
        this._printemail.Remarks(Remakrequest).subscribe((data) => {
            console.log(data);
            this.AddBaggegeDetailsarray.forEach((Detail, index) => {
                if (!Detail.AlreadyExisting) {
                    var index = this.AddBaggegeDetailsarray.indexOf(Detail);
                    console.log(index)
                    this.AddBaggegeDetailsarray.splice(index, 1);
                    console.log(this.AddBaggegeDetailsarray)
                }
            })
            this.AddBaggage();
            // this._shared.GetPassenger().SegmentTravelerInfos = this.SharedBag;
            this.loaderProgress.hideLoader();
            // this.printerResponse();
        }, error => {
            this.handleServiceError(error);
            // this.AddBaggegeDetailsarray.forEach((Detail, index) => {
            //     if (!Detail.AlreadyExisting) {
            //         var index = this.AddBaggegeDetailsarray.indexOf(Detail);
            //         this.AddBaggegeDetailsarray.splice(index, 1);
            //     }
            // })
            console.log(error);
            this.loaderProgress.hideLoader();

        });
    }
    getPrinter(): string {
        if (ApplicationSettings.hasKey("printer")) {
            return ApplicationSettings.getString("printer");
        } else {
            return "";
        }
    }
    public remove(item: baggageTemplate.AddBaggegeDetails) {
        console.log("inside remove:" + JSON.stringify(this.isRemoveBtnEnabled) + "R:" + JSON.stringify(item.AlreadyExisting));
        console.log("inside remove:" + JSON.stringify(item.status));
        if (this.isRemoveBtnEnabled || !item.AlreadyExisting) {
            if (item.status != "CheckedIn" && item.status != "Pending Delete") {
                var index = this.AddBaggegeDetailsarray.indexOf(item);
                this.AddBaggegeDetailsarray.splice(index, 1);
                if (this.AddBaggegeDetailsarray.filter(m => m.AlreadyExisting == false).length > 0) {
                    this.isButtonEnabled = true;
                } else if (this.PassedPassengerDetail.CheckinStatus) {
                    // this.isButtonEnabled = false;
                } else {
                    this.isButtonEnabled = true;
                }
                if (this.AddBaggegeDetailsarray.filter(m => m.status == '').length > 0) {
                    this.enableRemoveBag = false
                } else {
                    this.enableRemoveBag = true
                }
                if (this.AddBaggegeDetailsarray.filter(m => m.AlreadyExisting == false).length > 0) {
                    this.BagtagElement = Converters.GetBagTag(this.PassedPassengerDetail, this.FlightInfo, this.AddBaggegeDetailsarray, this.FlightInfo, this.ShortCheckAirportCode);
                    var PassengerList: any = [];
                    if (this._shared.GetBagTag() != null) {
                        PassengerList = this._shared.GetBagTag();
                    }
                    if (PassengerList.length > 0 && PassengerList.filter(m => m.RPH == this.BagtagElement.PassengerList[0].RPH).length > 0) {
                        // PassengerList.filter(m => m.RPH == this.BagtagElement.PassengerList[0].RPH)[0] = this.BagtagElement.PassengerList[0]
                        PassengerList.splice(PassengerList.indexOf(PassengerList.filter(m => m.RPH == this.BagtagElement.PassengerList[0].RPH)[0]), 1);
                        PassengerList.push(this.BagtagElement.PassengerList[0])
                    } else {
                        PassengerList.push(this.BagtagElement.PassengerList[0])
                    }
                    if (!this.PassedPassengerDetail.CheckinStatus) {
                        this._shared.SetBagTag(PassengerList);
                    }
                } else {
                    this._shared.SetBagTag(null);

                }
            }
            else {
                if (this.enableRemoveBag) {
                    this.isRemoveBag = true;
                    this.enableAddBag = false;
                    item.status = "Pending Delete";
                    this.isContinuebtnEnabled = false;
                }
            }
        } else {
            if (this.enableRemoveBag) {
                this.isRemoveBag = true;
                item.status = "Pending Delete";
                this.isContinuebtnEnabled = false;
                this.enableAddBag = false;
            }

        }




    }

    public removeAll() {
        this.AddBaggegeDetailsarray.forEach((Detail, Index) => {
            if (Detail.status != "CheckedIn" && Detail.status != "Pending Delete") {
                var index = this.AddBaggegeDetailsarray.indexOf(Detail);
                this.AddBaggegeDetailsarray.splice(index, 1);
                if (this.AddBaggegeDetailsarray.filter(m => m.AlreadyExisting == false).length > 0) {
                    this.isButtonEnabled = true;
                } else {
                    this.isButtonEnabled = false;
                }
            }
            // else {
            //     Detail.status = "Pending Delete";
            //     this.isContinuebtnEnabled = false;
            // }

        });

    }
    public oversizeCheck(args: any) {
        // args.Oversize = !args.Oversize;
        // if (this.AddBaggegeDetailsarray.filter(m => m.Oversize == true).length > this.FBA) {
        //     Toast.makeText("Maximum number of oversized baggage reached.Extra baggage needs to be transported as cargo.").show();
        //     args.Oversize = false;
        // }
        alert("baggage fees currently not supported - contact check-in desk");
    }
    public onopen() {
        console.log("Drop Down opened.");
    }

    isItemVisible(args): string {

        if (args.toString().substr(0, 2) == 'CM' && args.toString().length <= 5) {
            return "visible";
        }
        else return "collapsed";
    }

    btnclicked(cardType: string) {
        if (cardType == "Cash") {
            this.cash = true;
            this.dCard = false;
            this.cCard = false;
            this.paymentCardDetails = null;
        }
        else if (cardType == "CCard") {
            this.cash = false;
            this.dCard = false;
            this.cCard = true;
            // let options: ModalDialogOptions = {
            //     viewContainerRef: this.vcRef,
            //     context: [],
            //     fullscreen: false
            // };

            // this._modalService.showModal(PaymentComponent, options)
            //     .then((result) => {
            //         this.paymentCardDetails = result;
            //         this.isButtonEnabled = true;
            //         this.confirm(null);
            //     });
            // this.displayScanOptionDialog();
        }
        else if (cardType == "DCard") {
            this.cash = false;
            this.dCard = true;
            this.cCard = false;
        }
    }
    cartclicked(btn: any) {
        console.log("clicked" + btn);
        if (btn == "2") {
            this.cart = true;
        }
        else
            this.cart = false;
        //    this.visibileVar();
    }
    public visibileVar(): string {
        if (this.cart == true) {
            return 'visible';
        }
        else return 'collapsed';
    }
    close() {
        this.cart = false;
    }
    confirm(paymentDatail: any): void {
        try {
            this.loaderProgress.showLoader();
            var RootObject: PaymentData.RootObject = null;
            RootObject = new PaymentData.RootObject();
            //RootObject.Segments = [new PaymentData.Segments()];
            // RootObject.Passengers = [new PaymentData.Passengers()];
            // RootObject.Payments = [new PaymentData.Payment()];
            // RootObject.Services = [new PaymentData.Services()];
            RootObject.ReceiptDelivery = new PaymentData.ReceiptDelivery();

            // var  paymentAddress: PaymentData. PaymentAddress = null;
            // paymentAddress = new PaymentData. PaymentAddress();
            var payment: PaymentData.Payment;
            payment = new PaymentData.Payment();
            var amount = "0";
            var Currency;
            this.AddBaggegeDetailsarray.filter(m => m.fees != null).forEach((BaggegeDetail, Detailndex) => {
                amount = amount + BaggegeDetail.fees.split(' ')[0];
                Currency = BaggegeDetail.fees.split(' ')[1];
            });


            RootObject.OrderId = this.PassedPassengerDetail.OrderID;

            if (this.paymentCardDetails != null) {

                let cardData = new PaymentData.Payment();
                cardData.Type = this.paymentCardDetails.paymentType;
                cardData.CardCode = this.paymentCardDetails.cardType;
                cardData.CurrencyCode = Currency;
                cardData.Amount = amount.toString();
                cardData.MaskedCardNumber = this.paymentCardDetails.cardNumber;
                cardData.ApprovalCode = this.paymentCardDetails.cvv;
                cardData.SecurityCode = "";
                cardData.CardIssuerBankID = "MX";
                var month = this.paymentCardDetails.expiryDate;
                var year = this.paymentCardDetails.expiryDate;
                cardData.ExpirationDateMMYY = month.substr(0, 2) + year.substr(2, 6);
                cardData.CardHolderName = this.paymentCardDetails.cardHolder;
                cardData.FirstName = this.PassedPassengerDetail.FirstName;
                cardData.LastName = this.PassedPassengerDetail.LastName;
                cardData.BillingAddress = new PaymentData.PaymentAddress();
                cardData.BillingAddress.AddressLine = this.paymentCardDetails.address;
                cardData.BillingAddress.City = this.paymentCardDetails.city;;
                cardData.BillingAddress.StateCode = this.paymentCardDetails.state;
                cardData.BillingAddress.PostalCode = this.paymentCardDetails.zipcode;
                cardData.BillingAddress.CountryCode = this.paymentCardDetails.country;
                RootObject.Payments.push(cardData);
            }
            let passenger = new PaymentData.Passengers();
            passenger.Firstname = this.PassedPassengerDetail.FirstName;
            passenger.Lastname = this.PassedPassengerDetail.LastName;
            passenger.PassengerTypeCode = this.PassedPassengerDetail.PassengerType;
            passenger.RPH = this.PassedPassengerDetail.RPH;
            RootObject.Passengers.push(passenger);

            let segment = new PaymentData.Segments();
            segment.ArrivalDateTime = moment(this.FlightInfo.ArrivalDateTime).format("YYYY-MM-DD") + "T" + this.FlightInfo.ETA + ":00";
            segment.DepartureDateTime = moment(this.FlightInfo.DepartureDateTime).format("YYYY-MM-DD") + "T" + this.FlightInfo.ETD + ":00";
            let originCode = new PaymentData.Origin();
            originCode.LocationCode = this.FlightInfo.Origin;
            segment.Origin = originCode;
            let destinationCode = new PaymentData.Origin();
            destinationCode.LocationCode = this.FlightInfo.Destination;
            segment.Destination = destinationCode;
            segment.RPH = this.FlightInfo.RPH;
            segment.Flight = this.FlightInfo.MarketingFlight;
            segment.OperatingFlight = null;
            segment.HasStopover = true;
            RootObject.Segments.push(segment);

            let serviceDetails = new PaymentData.Services();
            serviceDetails.selectedService = new PaymentData.SelectedService();
            serviceDetails.ticketNumber = this.ticketNumber.toString();
            serviceDetails.passengerRPH = this.PassedPassengerDetail.RPH;
            serviceDetails.currencyCode = Currency;
            var rphItem: any = this.FlightInfo.SegmentRPH;
            serviceDetails.SegmentRPH.push(rphItem);
            serviceDetails.amount = this.totalAmount.toString();
            serviceDetails.EmdTaxes = [];
            serviceDetails.selectedService.EmdType = this.CatalogServiceDetail.SubType;
            serviceDetails.selectedService.IsRefundable = false;
            serviceDetails.selectedService.NoofItems = "1";
            serviceDetails.selectedService.RFISC_code = this.CatalogServiceDetail.RFIC;
            serviceDetails.selectedService.RFISC_subCode = this.CatalogServiceDetail.Code;
            serviceDetails.selectedService.SSRCode = this.CatalogServiceDetail.SSRCode;
            serviceDetails.selectedService.TypeOfService = this.CatalogServiceDetail.ServiceCode;
            serviceDetails.selectedService.commercialName = this.CatalogServiceDetail.Name;
            RootObject.Services.push(serviceDetails);

            RootObject.ReceiptDelivery.gateway = "EMAIL";
            RootObject.ReceiptDelivery.LanguageID = null;
            RootObject.ReceiptDelivery.Name = this.PassedPassengerDetail.Firstname;
            let emailId = new PaymentData.Email();
            emailId.emailAddress = "noreply@hpe.com";
            RootObject.ReceiptDelivery.email.push(emailId);
            RootObject.ReceiptDelivery.phonenumber = null;
            RootObject.ReceiptDelivery.printerAddress = "";

            console.dir(RootObject);
            this.loaderProgress.hideLoader();
            this._paymentService.PostPayment(RootObject, "")
                .subscribe((data) => {
                    if (data.Success != false) {
                        console.log(JSON.stringify(data));
                        let result: any = data;
                        if (result.PassengerDocuments[0].PassengerDocument[0].Status == "Issued") {
                            this.Paid = true;
                            this.loaderProgress.hideLoader();
                            this.BagtagElement = Converters.GetBagTag(this.PassedPassengerDetail, this.FlightInfo, this.AddBaggegeDetailsarray, this.FlightInfo, this.ShortCheckAirportCode);
                            this.BagTag();
                            this.totalAmount = 0;
                            this.AmountArray = [];
                            this.isEnabled = false;
                            this.cash = false;
                            this.cCard = false;
                            this.cart = false;
                            this.isCartButtonEnabled = false;
                            // this.totalAmount = 0;
                        }
                    }
                    else {
                        Toast.makeText(data.ErrorMessage).show();
                    }
                },
                    error => {
                        console.log("Couldnt find information for this OrderID " + error)
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
                        //alert("sucess");


                    })
            this.loaderProgress.hideLoader();
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    }
    public checkPayment(): string {
        if (this.Paid == true) {
            //this.BagTag();
            this.isButtonEnabled = false;
            return 'visible';
        }
        else return 'collapsed';
    }
    // public listviewLoaded() {
    //     console.log("listview loaded ");
    //     var that = this;
    //     setTimeout(function () {
    //         var listView: View = <StackLayout>that.page.getViewById("lv");
    //         // var listView = this.lv.nativeElement;
    //         var index = that.AddBaggegeDetailsarray.length - 1;
    //         console.log(index);
    //         listView[index].focus();
    //     }, 1);

    // }
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



