//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { ObservableArray } from "data/observable-array";
import * as dialogs from "ui/dialogs"
import { Page } from "ui/page";
import { GestureEventData } from "ui/gestures";
import { ListView, ItemEventData } from "ui/list-view";
import * as gestures from "ui/gestures";

//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as Toast from 'nativescript-toast';
import * as moment from "moment";

//app references
import { seatModel, Inventory, Order, SeatMapTemplate, Legs, SeatMapOAPax } from "../../shared/model/index";
import { SeatMap, LoaderProgress, MultiSegmentTemplate, PaxTemplate, OutBound, InBound } from "../../shared/interface/index";
import { DataService, CheckinOrderService, PassengerService, TimeOutService, SeatMapService, CheckinService } from "../../shared/services/index";
import { Converters } from "../../shared/utils/index";
import { Configuration } from '../../app.constants';
import { AppExecutiontime } from "../../app.executiontime";

@Component({
    selector: "list-page",
    providers: [DataService, Configuration, PassengerService, SeatMapService, CheckinService],
    templateUrl: "./components/seatmap/seatmap.component.html",
    styleUrls: ["./components/seatmap/seatmap.component.css"]
})


export class SeatMapComponent implements OnInit {
    isError: boolean;
    errorMessage: string;
    loaderProgress: LoaderProgress;
    private seatmapDetails: any;
    public SeatMapList: SeatMap.RootObject = new SeatMap.RootObject();
    public ShowSeatMapList: SeatMap.Item = new SeatMap.Item();
    private items: Array<any> = [];
    private crow: string;
    private seat: Array<SeatMap.AirSeatList> = [new SeatMap.AirSeatList()]
    private rowNumber: string = "";
    public SeatCharacteristic: any;
    private previousSeat: SeatMap.AirSeatList = new SeatMap.AirSeatList();
    private SelectedSeat: string = "";
    private seatRequest: any;
    public MultiSegmentPaxArray: MultiSegmentTemplate.RootObject = new MultiSegmentTemplate.RootObject;
    PassedPassengerDetail: PaxTemplate = new PaxTemplate();
    public PassengerArray: Array<PaxTemplate> = [];
    public ButtonContinue: boolean = true;
    public invent: any;
    public inboun: any;
    public outboun: any;
    public outboun1: OutBound.Outbou = new OutBound.Outbou();
    public inboun1: InBound.Inbou = new InBound.Inbou();
    public invent1: Inventory.RootObject = new Inventory.RootObject();
    public showSeatMapKey: boolean = true;
    public showAdvanceDisplay: boolean = true;
    public seatlist: Array<any>;
    public date: any;
    public fqtvnum: any;
    public fullname: any;
    public NoSeat: boolean;
    // public isContinue 
    private seatResponse: any;
    public index: any;
    public userdetails: any;
    public FlightNumber: string;
    public AllSegSelected: boolean = true;
    public AllSegNotSelected: boolean = false;
    public PassengerList: Array<MultiSegmentTemplate.Passenger> = [];
    public NewPassengerList: Array<MultiSegmentTemplate.Passenger> = [];
    public FlightInfo: MultiSegmentTemplate.FlightWithPax = new MultiSegmentTemplate.FlightWithPax;
    public previousFlightInfo: MultiSegmentTemplate.FlightWithPax = new MultiSegmentTemplate.FlightWithPax;
    public SeatProductInfo: Array<SeatMap.SeatProductInformation> = [];
    public IsChecked1: boolean = false;
    public IsChecked2: boolean = false;
    public IsChecked3: boolean = false;
    public IsChecked4: boolean = false;
    public IsExitRowSelected: boolean = false;
    public IsSeatSelected: boolean = false;
    public IsInfantNotAllowedSelected: boolean = false;
    public num: number = 0;
    public isMultiLegFLight: boolean = false;
    public isSegSelected: Array<boolean> = [];
    public isSecondSegSelected: boolean = true;
    public FirstSegOrigin: string;
    public FirstSegDest: string;
    public SecondSegOrigin: string;
    public SecondSegDest: string;
    public PassengerRPH: any;
    public SelectedRPH: any;
    public legsInfo: Array<Legs> = [];
    public infantExitrowSeat: boolean = false;
    public isMultiInitialPassengerCheck: boolean = false;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    private SelectedPassenger: MultiSegmentTemplate.Passenger = new MultiSegmentTemplate.Passenger();
    private SelectedPassengerList: Array<any> = [];
    public isall: boolean;
    public isCompensationEnabled: boolean = false;
    public MultiIntialPax: boolean = false;
    public MultiInitalNoSeatAssign: boolean = false;
    public PassengerListForOASeatMap: SeatMapOAPax.RootObject = new SeatMapOAPax.RootObject();
    public FlightDate: any = "";
    @ViewChild('pagecontainer') pageCont: ElementRef;
    constructor(public _checkin: CheckinService, private page: Page, public _seatmap: SeatMapService, public _timeoutService: TimeOutService, private routerExtensions: RouterExtensions, private router: Router, private location: Location, public _dataService: DataService, private activatedRouter: ActivatedRoute,
        public _shared: CheckinOrderService, public _service: PassengerService) {
        this.isError = false;
        this.errorMessage = "";
        this.loaderProgress = new LoaderProgress();
        // this.SeatMapList = new SeatMap.SeatList();

    }

    ngOnInit() {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.loaderProgress.initLoader(this.pageCont);
        this.date = moment(new Date()).format("DD MMM YYYY");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled", );
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled", );
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled", );
        this.MultiSegmentPaxArray = this._shared.GetSegmentDetail();
        this.activatedRouter.queryParams.subscribe((params) => {
            try {
                this.SelectedRPH = JSON.parse(params["RPHValue"]);
                this.index = JSON.parse(params["index"]);

                this.MultiSegmentPaxArray = this._shared.GetSegmentDetail();
                this.PassengerList = this.MultiSegmentPaxArray.Segment[this.index].Passenger;
                this.FlightDate = moment(this.MultiSegmentPaxArray.Segment[this.index].FlightDate).format("DD-MMM-YYYY");
                this.MultiSegmentPaxArray.Segment.forEach((data, index) => {
                    if (data.MarketingFlight == this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight) {
                        this.FlightInfo = data;
                    }
                });
                this.legsInfo = this.MultiSegmentPaxArray.Segment[this.index].Legs;
                this.legsInfo.forEach((data, index) => {
                    this.isSegSelected[index] = true;
                    data.isLegSelected = true;
                })
                this.PassengerList.forEach((data, Index) => {
                    data.PrevSeat = data.SeatNumber;
                    data.SeatNumber = data.Seats[0].SeatNumber;
                    var nexIndex = Index + 1;
                    console.log("nexIndex:" + nexIndex);
                    if (this.PassengerList[nexIndex].PassengerRefNumber) {
                        if (data.PassengerRefNumber == this.PassengerList[nexIndex].PassengerRefNumber) {
                            this.isMultiInitialPassengerCheck = true;
                            console.log("Inside MultiInitial");

                        }
                    }
                })
                this.FlightNumber = this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight;
                console.log("RPH:" + this.SelectedRPH);

            }
            catch (Exception) {

            }
        });
        // let selPax = this.PassengerList.filter(pax => pax.RPH == this.SelectedRPH);
        // if (selPax && selPax.length > 0) {
        //     this.select(selPax[0]);
        // }
        // this.getSeatMap(true);
        let selPax = this.PassengerList.filter(pax => pax.RPH == this.SelectedRPH);
        if (selPax && selPax.length > 0) {
            this.select(selPax[0]);
        }
        var origin = this.MultiSegmentPaxArray.Segment[this.index].Origin;
        var destination = this.MultiSegmentPaxArray.Segment[this.index].Destination;
        this.SeatMapList = this._shared.GetSeatMap()
        this.ShowSeatMapList = this.SeatMapList.Items[0];
        this.SeatProductInfo = this.SeatMapList.Items[0].SeatProductInformation;
        if (this.SeatMapList.Items.length > 1) {
            this.isMultiLegFLight = true;
            this.legsInfo = this.MultiSegmentPaxArray.Segment[this.index].Legs;
            this.legsInfo.forEach((data, index) => {
                this.isSegSelected[index] = true;
                data.isLegSelected = true;
            })
            console.log("this.SeatMapList" + JSON.stringify(this.SeatMapList));
            this.ShowSeatMapList = this.SeatMapList.Items.filter(m => m.FlightSegment.Origin.LocationCode == origin && m.FlightSegment.Destination.LocationCode == destination)[0];
            console.log("this.ShowSeatMapList" + JSON.stringify(this.ShowSeatMapList));
            this.FirstSegOrigin = this.SeatMapList.Items[0].FlightSegment.Origin.LocationCode;
            this.FirstSegDest = this.SeatMapList.Items[0].FlightSegment.Destination.LocationCode;
            this.SecondSegOrigin = this.SeatMapList.Items[2].FlightSegment.Origin.LocationCode;
            this.SecondSegDest = this.SeatMapList.Items[2].FlightSegment.Destination.LocationCode;
        }
        var label = this.pageCont.nativeElement
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args: gestures.GestureEventData) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();

        });
        this.isMultiInitialPassenger()

    }


    getSeatMap(isInit: boolean = false): void {
        this.loaderProgress.showLoader();
        console.log("getSeatMap called here ");
        var FlightNumber = this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight;
        var OperatingFlight = this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight;
        var date = this.MultiSegmentPaxArray.Segment[this.index].DepartureDateTime.toString();
        var Date1 = date.slice(0, 10);
        var origin = this.MultiSegmentPaxArray.Segment[this.index].Origin;
        var destination = this.MultiSegmentPaxArray.Segment[this.index].Destination;
        console.log("Legs" + JSON.stringify(this.MultiSegmentPaxArray.Segment[this.index].Legs));
        console.log("dest" + JSON.stringify(FlightNumber.substr(0, 2)));
        if ((FlightNumber.substr(0, 2) == "CM" && this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight == null) || (this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight != null && this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight.substr(0, 2) == "CM")) {
            if (this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight != null && this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight.substr(0, 2) == "CM") {
                FlightNumber = this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight
            }
            let selPax = this.PassengerList.filter(pax => pax.RPH == this.SelectedRPH);
            this._seatmap.GetSeatMap(FlightNumber, Date1, origin, selPax[0].FirstName, selPax[0].LastName, Number(selPax[0].PassengerSeqNumber), selPax[0].OrderID)
                .subscribe((result) => {
                    this.seatmapDetails = <SeatMapTemplate>result;
                    this._service.GetPassenger(this.MultiSegmentPaxArray.Segment[this.index].Passenger[0].OrderID)
                        .subscribe(data => {
                            this._shared.SetPassenger(<Order.RootObject>data);
                            this.legsInfo = this.MultiSegmentPaxArray.Segment[this.index].Legs;
                            this.legsInfo.forEach((data, index) => {
                                this.isSegSelected[index] = true;
                                data.isLegSelected = true;
                            })
                            let scTable: any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
                            this.MultiSegmentPaxArray = Converters.ConvertToFlightWithPaxTemplate(this._shared.GetPassenger(), null, scTable, "");
                            this.MultiSegmentPaxArray.Segment[this.index].Legs = this.legsInfo;
                            this.PassengerList = this.MultiSegmentPaxArray.Segment[this.index].Passenger;
                            this.PassengerList.forEach((data, Index) => {
                                // data.PrevSeat = data.SeatNumber;
                                data.SeatNumber = data.Seats[0].SeatNumber;
                            })
                            let selPax = this.PassengerList.filter(pax => pax.RPH == this.SelectedRPH);
                            if (selPax && selPax.length > 0) {
                                this.select(selPax[0]);
                            }
                            // console.log("SeatMap:" + JSON.stringify(this.seatmapDetails ));
                            this.SeatMapList = Converters.ConvertToSeatMap(this.seatmapDetails, this.PassengerList, FlightNumber, this.MultiSegmentPaxArray.Segment[this.index].Legs, origin, destination);
                            console.log("SeatMap:" + JSON.stringify(this.SeatMapList));
                            this.ShowSeatMapList = this.SeatMapList.Items[0];
                            this.SeatProductInfo = this.SeatMapList.Items[0].SeatProductInformation;
                            if (this.SeatMapList.Items.length > 1) {
                                this.isMultiLegFLight = true;
                                this.legsInfo = this.MultiSegmentPaxArray.Segment[this.index].Legs;
                                this.legsInfo.forEach((data, index) => {
                                    this.isSegSelected[index] = true;
                                    data.isLegSelected = true;
                                })
                                this.ShowSeatMapList = this.SeatMapList.Items.filter(m => m.FlightSegment.Origin.LocationCode == origin && m.FlightSegment.Destination.LocationCode == destination)[0];
                                this.FirstSegOrigin = this.SeatMapList.Items[0].FlightSegment.Origin.LocationCode;
                                this.FirstSegDest = this.SeatMapList.Items[0].FlightSegment.Destination.LocationCode;
                                this.SecondSegOrigin = this.SeatMapList.Items[2].FlightSegment.Origin.LocationCode;
                                this.SecondSegDest = this.SeatMapList.Items[2].FlightSegment.Destination.LocationCode;
                            }
                            this.loaderProgress.hideLoader();
                            if (result.Warnings.length > 0 || result.Warnings != null) {
                                console.log("toast");
                                result.Warnings.forEach((warning, index) => {
                                    Toast.makeText(warning.Message).show();
                                })
                            }
                        }, error => {
                            this.handleServiceError(error);
                            console.log(error);
                            this.loaderProgress.hideLoader();
                
                        })


                },
                    error => {
                        console.log("Couldnt find seat information " + error);
                        this.handleServiceError(error);
                        this.loaderProgress.hideLoader();
                    },
                    () => {
                        console.log('Seat Map Retrieved successfully')
                        // console.log('lenght' + this.SeatMapList.CabinList[0].AirRowList[0].AirSeatList.length.toString());
                    }
                )
        }
        else {
            if (FlightNumber.substr(0, 2) == "CM") {
                var FlightNum = OperatingFlight;
            }
            else {
                FlightNum = FlightNumber;
            }
            let PaxArray = [new SeatMapOAPax.Passenger()];
            PaxArray.length = 0;
            this.PassengerList.forEach((paxData, Index) => {
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
            var previousIndex = this.index - 1;
            var FlightNumber = this.MultiSegmentPaxArray.Segment[previousIndex].MarketingFlight;
            var OperatingFlight = this.MultiSegmentPaxArray.Segment[previousIndex].OperatingFlight;
            var date = this.MultiSegmentPaxArray.Segment[previousIndex].DepartureDateTime.toString();
            var Date1 = date.slice(0, 10);
            var origin = this.MultiSegmentPaxArray.Segment[previousIndex].Origin;
            var destination = this.MultiSegmentPaxArray.Segment[previousIndex].Destination;
            let selPax = this.PassengerList.filter(pax => pax.RPH == this.SelectedRPH);
            this._seatmap.GetSeatMap(FlightNumber, Date1, origin, selPax[0].FirstName, selPax[0].LastName, Number(selPax[0].PassengerSeqNumber), selPax[0].OrderID)
                .subscribe((result) => {
                    if (result.Items != null) {
                        this.seatmapDetails = <SeatMapTemplate>result;
                        var curorigin = this.MultiSegmentPaxArray.Segment[this.index].Origin;
                        var curdestination = this.MultiSegmentPaxArray.Segment[this.index].Destination;
                        this.PassengerList = this.MultiSegmentPaxArray.Segment[this.index].Passenger
                        this.SeatMapList = Converters.OAseatmap(this.seatmapDetails, this.PassengerList, FlightNum, this.MultiSegmentPaxArray.Segment[this.index].Legs, curorigin, curdestination);
                        if (this.SeatMapList.Items.length > 0) {
                            this.ShowSeatMapList = this.SeatMapList.Items[0];
                            this.SeatProductInfo = this.SeatMapList.Items[0].SeatProductInformation;
                        }

                        console.log("Outside seatmap")
                        this.loaderProgress.hideLoader();
                        if (result.Warnings.length > 0 || result.Warnings != null) {
                            result.Warnings.forEach((warning, index) => {
                                Toast.makeText(warning.Message).show();
                            })
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
    catch(error) {
        console.log(error.message);
        this.loaderProgress.hideLoader();
    }

    isMultiInitialPassenger() {
        console.log(this._shared.GetPassenger().Passengers.filter(m => m.GroupedGivenName.split('/').length >= 2).length);
        if (this._shared.GetPassenger().Passengers.filter(m => m.GroupedGivenName.split('/').length >= 2).length > 0) {
            if (this._shared.GetPassenger().Passengers.filter(m => m.GroupedGivenName.split('/').length == 2).length > 0 && this._shared.GetPassenger().Passengers.filter(m => m.AssociatedAdultRPH == null && m.AssociatedInfantRPH == null).length > 0) {
                this.MultiIntialPax = true;
            } else if (this._shared.GetPassenger().Passengers.filter(m => m.GroupedGivenName.split('/').length > 2).length > 0) {
                this.MultiIntialPax = true;
            } else this.MultiIntialPax = false;
        } else this.MultiIntialPax = false;
        console.log(this.MultiIntialPax);
    }

    noSeat(passengerls: MultiSegmentTemplate.Passenger) {
        passengerls.NoSeat = !passengerls.NoSeat;
        this.select(passengerls, true)
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
    assignSeat(passengerList: MultiSegmentTemplate.Passenger[], SeatCharacteristic: any) {
        try {
            this.MultiInitalNoSeatAssign = false;
            if (this.isMultiInitialPassengerCheck) {
                this.PassengerList.forEach((paxData, Index) => {
                    if (paxData.SeatNumber == null && paxData.NoSeat == false) {
                        this.MultiInitalNoSeatAssign = true;
                        Toast.makeText("Invalid Request - Multi-type seat request multi initial surname are not allowed.").show();
                    }else if(paxData.SeatNumber == paxData.PrevSeat && paxData.NoSeat == false){
                        this.MultiInitalNoSeatAssign = true;
                        Toast.makeText("Invalid Request - Multi-type seat request multi initial surname are not allowed.").show();
                    }
                })
            }
            if (!this.MultiInitalNoSeatAssign) {
                var FlightNumber = this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight;
                if ((FlightNumber.substr(0, 2) == "CM" && this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight == null) || (this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight != null && this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight.substr(0, 2) == "CM")) {
                    this.loaderProgress.showLoader();
                    let Orders = this._shared.GetPassenger();
                    this.seatRequest = Converters.ConvertToAssignSeat(passengerList, this.FlightInfo, Orders, this.MultiSegmentPaxArray);
                    this.SelectedPassengerList = [];
                    console.log("Request : " + JSON.stringify(this.seatRequest));
                    this._seatmap.AssignSeat(this.seatRequest).subscribe((data) => {
                        this.seatResponse = data;
                        console.dir(data);
                        if (this.seatResponse.Success != false) {
                            if (this.seatResponse.CheckInResponse == null) {
                                console.log("3");
                                this.seatResponse.ServiceResponse[0].Order.SegmentTravelerInfos.forEach((data, index) => {
                                    if (data.SegmentRPH == this.MultiSegmentPaxArray.Segment[this.index].RPH) {
                                        this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((PAxData, PaxIndex) => {
                                            if (data.PassengerRPH == PAxData.RPH) {
                                                if (data.Seats[0].SeatNumber != null) {
                                                    PAxData.SeatNumber = data.Seats[0].SeatNumber;
                                                    PAxData.Seats = data.Seats;
                                                    var Passengers = this._shared.GetPassenger();
                                                    Passengers.SegmentTravelerInfos.forEach((segEle, segindex) => {
                                                        if (segEle.SegmentRPH == this.MultiSegmentPaxArray.Segment[this.index].RPH && segEle.PassengerRPH == data.PassengerRPH) {
                                                            segEle.Seats = PAxData.Seats;
                                                            this._shared.GetPassenger().SegmentTravelerInfos[segindex].Seats = PAxData.Seats;
                                                        }
                                                    });
                                                }
                                                else {

                                                    // passengerList.IsSelected = false;
                                                    this.getSeatMap();
                                                }
                                            }
                                        });
                                    }
                                });
                                // Toast.makeText(JSON.stringify(this.seatResponse.ServiceResponse[0].Warnings[0].Message)).show();
                                this.seatResponse.CheckInResponse.Warnings.forEach((warning, index) => {
                                    Toast.makeText(JSON.stringify(warning.Message)).show();
                                })
                                // passengerList.IsSelected = false;
                                this.getSeatMap();
                            }
                            else if (this.seatResponse.CheckInResponse.SegmentTravelerList == null) {
                                console.log("2");
                                if (this.seatResponse.CheckInResponse.Errors != null) {
                                    this.seatResponse.CheckInResponse.Errors.forEach((error, index) => {
                                        Toast.makeText(JSON.stringify(error.Message)).show();
                                    })
                                    this.getSeatMap();
                                } else {
                                    if (this.seatResponse.CheckInResponse.Warnings == null) {
                                        this.getSeatMap();
                                    }
                                    else {
                                        // Toast.makeText(JSON.stringify(this.seatResponse.CheckInResponse.Warnings[0].Message)).show();
                                        this.seatResponse.CheckInResponse.Warnings.forEach((warning, index) => {
                                            Toast.makeText(JSON.stringify(warning.Message)).show();
                                        })
                                        // passengerList.IsSelected = false;
                                        this.getSeatMap();
                                    }
                                }

                            }
                            else {
                                console.log("3");
                                if (this.seatResponse.CheckInResponse.Warnings == null) {
                                    this.seatResponse.CheckInResponse.SegmentTravelerList.forEach((segmentTravelinfo, index) => {
                                        if (segmentTravelinfo.Seats[0].DepartureCode == this.MultiSegmentPaxArray.Segment[this.index].Origin && segmentTravelinfo.Seats[0].ArrivalCode == this.MultiSegmentPaxArray.Segment[this.index].Destination) {
                                            this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((data, SegIndex) => {
                                                if (data.FirstName == segmentTravelinfo.GivenName && data.LastName == segmentTravelinfo.LastName) {
                                                    data.SeatNumber = segmentTravelinfo.Seats[0].SeatNumber;
                                                    data.Seats = segmentTravelinfo.Seats;
                                                    var Passengers = this._shared.GetPassenger();
                                                    Passengers.SegmentTravelerInfos.forEach((segEle, segindex) => {
                                                        if (segEle.SegmentRPH == this.MultiSegmentPaxArray.Segment[this.index].RPH && segEle.PassengerRPH == segmentTravelinfo.PassengerRPH) {
                                                            segEle.Seats = data.Seats;
                                                            this._shared.GetPassenger().SegmentTravelerInfos[segindex].Seats = data.Seats;
                                                        }
                                                    })
                                                }
                                            });
                                        }
                                    })
                                }
                                else {
                                    this.seatResponse.CheckInResponse.Warnings.forEach((warning, index) => {
                                        Toast.makeText(JSON.stringify(warning.Message)).show();
                                    })
                                    this.seatResponse.CheckInResponse.SegmentTravelerList.forEach((segmentTravelinfo, index) => {
                                        if (segmentTravelinfo.Seats) {
                                        if (segmentTravelinfo.Seats[0].DepartureCode == this.MultiSegmentPaxArray.Segment[this.index].Origin && segmentTravelinfo.Seats[0].ArrivalCode == this.MultiSegmentPaxArray.Segment[this.index].Destination) {
                                            this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((data, SegIndex) => {
                                                if (data.FirstName == segmentTravelinfo.GivenName && data.LastName == segmentTravelinfo.LastName) {
                                                 
                                                        console.log("init");
                                                        if (segmentTravelinfo.Seats[0].SeatNumber != null) {
                                                            data.SeatNumber = segmentTravelinfo.Seats[0].SeatNumber;
                                                            data.Seats = segmentTravelinfo.Seats;
                                                            var Passengers = this._shared.GetPassenger();
                                                            Passengers.SegmentTravelerInfos.forEach((segEle, segindex) => {
                                                                if (segEle.SegmentRPH == this.MultiSegmentPaxArray.Segment[this.index].RPH && segEle.PassengerRPH == segmentTravelinfo.PassengerRPH) {
                                                                    segEle.Seats = data.Seats;
                                                                    this._shared.GetPassenger().SegmentTravelerInfos[segindex].Seats = data.Seats;
                                                                }
                                                            })
                                                            //this._shared.SetPassenger(Passengers);
                                                        
                                                    }
                                                    // Toast.makeText(JSON.stringify(this.seatResponse.CheckInResponse.Warnings[0].Message)).show();
                                                 
                                                    // passengerList.IsSelected = false;
                                                    this.getSeatMap();
                                                }
                                            });
                                        }
                                    }
                                    })

                                }

                                this.loaderProgress.hideLoader();
                                console.log("Response : " + JSON.stringify(this.seatResponse));
                                if (this.seatResponse.CheckInResponse.Errors != null) {
                                    this.seatResponse.CheckInResponse.Errors.forEach((error, index) => {
                                        Toast.makeText(JSON.stringify(error.Message)).show();
                                    })
                                    this.getSeatMap();
                                } else {
                                    if (this.seatResponse.CheckInResponse.Warnings == null) {
                                        this.getSeatMap();
                                    }
                                    else {
                                        // Toast.makeText(JSON.stringify(this.seatResponse.CheckInResponse.Warnings[0].Message)).show();
                                        this.seatResponse.CheckInResponse.Warnings.forEach((warning, index) => {
                                            Toast.makeText(JSON.stringify(warning.Message)).show();
                                        })
                                        // passengerList.IsSelected = false;
                                        this.getSeatMap();
                                    }
                                }
                            }
                        } else {
                            this.loaderProgress.hideLoader();
                            if (this.seatResponse.Errors != null && this.seatResponse.Errors.length > 0) {
                                this.seatResponse.Errors.forEach((error, index) => {
                                    Toast.makeText(error.Message).show();
                                })
                            }
                        }
                        // this.GetOrderDetails(this.MultiSegmentPaxArray.Segment[this.index].Passenger[0].OrderID);                    

                    },
                        error => {
                            console.log("Seat assignment/update error " + error);
                            this.handleServiceError(error)
                            this.loaderProgress.hideLoader();
                        },
                        () => {
                            console.log(this.seatRequest.length);
                            this.ButtonContinue = true
                        }
                    )
                    console.log("successfull");
                }
                else {
                    var isAllPaxCheckedIn = false;
                    this.SelectedPassengerList.forEach((paxData, Index) => {
                        if (paxData.CheckinStatus == true) {
                            isAllPaxCheckedIn = true;
                        } else {
                            isAllPaxCheckedIn = false;
                        }
                    })
                    if (isAllPaxCheckedIn) {
                        this.loaderProgress.showLoader();
                        let Orders = this._shared.GetPassenger();
                        console.dir(Orders);
                        // this.seatRequest = null;
                        this.seatRequest = Converters.ConvertToAssignSeat(passengerList, this.FlightInfo, Orders, this.MultiSegmentPaxArray);
                        this.SelectedPassengerList = [];
                        console.log("Request : " + JSON.stringify(this.seatRequest));
                        this._seatmap.AssignSeat(this.seatRequest).subscribe((data) => {
                            this.seatResponse = data;
                            console.dir(data);
                            if (this.seatResponse.Success != false) {
                                if (this.seatResponse.BadRequest == 400) {
                                    Toast.makeText(JSON.stringify(this.seatResponse.ErrorMessage)).show();;
                                    this.getSeatMap();
                                }
                                if (this.seatResponse.CheckInResponse == null) {
                                    console.log("3");
                                    this.seatResponse.ServiceResponse[0].Order.SegmentTravelerInfos.forEach((data, index) => {
                                        if (data.SegmentRPH == this.MultiSegmentPaxArray.Segment[this.index].RPH) {
                                            this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((PAxData, PaxIndex) => {
                                                if (data.PassengerRPH == PAxData.RPH) {
                                                    if (data.Seats[0].SeatNumber != null) {
                                                        PAxData.SeatNumber = data.Seats[0].SeatNumber;
                                                        PAxData.Seats = data.Seats;
                                                        var Passengers = this._shared.GetPassenger();
                                                        Passengers.SegmentTravelerInfos.forEach((segEle, segindex) => {
                                                            if (segEle.SegmentRPH == this.MultiSegmentPaxArray.Segment[this.index].RPH && segEle.PassengerRPH == data.PassengerRPH) {
                                                                segEle.Seats = PAxData.Seats;
                                                                this._shared.GetPassenger().SegmentTravelerInfos[segindex].Seats = PAxData.Seats;
                                                            }
                                                        });
                                                    }
                                                    else {

                                                        // passengerList.IsSelected = false;
                                                        this.getSeatMap();
                                                    }
                                                }
                                            });
                                        }
                                    });
                                    // Toast.makeText(JSON.stringify(this.seatResponse.ServiceResponse[0].Warnings[0].Message)).show();
                                    this.seatResponse.CheckInResponse.Warnings.forEach((warning, index) => {
                                        Toast.makeText(JSON.stringify(warning.Message)).show();
                                    })
                                    // passengerList.IsSelected = false;
                                    this.getSeatMap();
                                }
                                else if (this.seatResponse.CheckInResponse.SegmentTravelerList == null) {
                                    console.log("2");
                                    if (this.seatResponse.CheckInResponse.Errors != null) {
                                        this.seatResponse.CheckInResponse.Errors.forEach((error, index) => {
                                            Toast.makeText(JSON.stringify(error.Message)).show();
                                        })
                                        this.getSeatMap();
                                    } else {
                                        if (this.seatResponse.CheckInResponse.Warnings == null) {
                                            this.getSeatMap();
                                        }
                                        else {
                                            // Toast.makeText(JSON.stringify(this.seatResponse.CheckInResponse.Warnings[0].Message)).show();
                                            this.seatResponse.CheckInResponse.Warnings.forEach((warning, index) => {
                                                Toast.makeText(JSON.stringify(warning.Message)).show();
                                            })
                                            // passengerList.IsSelected = false;
                                            this.getSeatMap();
                                        }
                                    }

                                }
                                else {
                                    if (this.seatResponse.CheckInResponse.Warnings == null) {
                                        this.seatResponse.CheckInResponse.SegmentTravelerList.forEach((segmentTravelinfo, index) => {
                                            if (segmentTravelinfo.SegmentRPH == this.MultiSegmentPaxArray.Segment[this.index].RPH) {
                                                this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((data, SegIndex) => {
                                                    if (data.FirstName == segmentTravelinfo.GivenName && data.LastName == segmentTravelinfo.LastName) {
                                                        data.SeatNumber = segmentTravelinfo.Seats[0].SeatNumber;
                                                        data.Seats = segmentTravelinfo.Seats;
                                                        var Passengers = this._shared.GetPassenger();
                                                        Passengers.SegmentTravelerInfos.forEach((segEle, segindex) => {
                                                            if (segEle.SegmentRPH == this.MultiSegmentPaxArray.Segment[this.index].RPH && segEle.PassengerRPH == segmentTravelinfo.PassengerRPH) {
                                                                segEle.Seats = data.Seats;
                                                                this._shared.GetPassenger().SegmentTravelerInfos[segindex].Seats = data.Seats;
                                                            }
                                                        })
                                                    }
                                                });
                                            }
                                        })
                                    }
                                    else {
                                        this.seatResponse.CheckInResponse.SegmentTravelerList.forEach((segmentTravelinfo, index) => {
                                            if (segmentTravelinfo.SegmentRPH == this.MultiSegmentPaxArray.Segment[this.index].RPH) {
                                                this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((data, SegIndex) => {
                                                    if (data.FirstName == segmentTravelinfo.GivenName && data.LastName == segmentTravelinfo.LastName) {
                                                        if (segmentTravelinfo.Seats != null) {
                                                            if (segmentTravelinfo.Seats[0].SeatNumber != null) {
                                                                data.SeatNumber = segmentTravelinfo.Seats[0].SeatNumber;
                                                                data.Seats = segmentTravelinfo.Seats;
                                                                var Passengers = this._shared.GetPassenger();
                                                                Passengers.SegmentTravelerInfos.forEach((segEle, segindex) => {
                                                                    if (segEle.SegmentRPH == this.MultiSegmentPaxArray.Segment[this.index].RPH && segEle.PassengerRPH == segmentTravelinfo.PassengerRPH) {
                                                                        segEle.Seats = data.Seats;
                                                                        this._shared.GetPassenger().SegmentTravelerInfos[segindex].Seats = data.Seats;
                                                                    }
                                                                })
                                                                //this._shared.SetPassenger(Passengers);
                                                            }
                                                        }
                                                        // Toast.makeText(JSON.stringify(this.seatResponse.CheckInResponse.Warnings[0].Message)).show();
                                                        this.seatResponse.CheckInResponse.Warnings.forEach((warning, index) => {
                                                            Toast.makeText(JSON.stringify(warning.Message)).show();
                                                        })
                                                        // passengerList.IsSelected = false;
                                                        this.getSeatMap();
                                                    }
                                                });
                                            }
                                        })

                                    }

                                    this.loaderProgress.hideLoader();
                                    console.log("Response : " + JSON.stringify(this.seatResponse));
                                    if (this.seatResponse.CheckInResponse.Errors != null) {
                                        this.seatResponse.CheckInResponse.Errors.forEach((error, index) => {
                                            Toast.makeText(JSON.stringify(error.Message)).show();
                                        })
                                        this.getSeatMap();
                                    } else {
                                        if (this.seatResponse.CheckInResponse.Warnings == null) {
                                            this.getSeatMap();
                                        }
                                        else {
                                            // Toast.makeText(JSON.stringify(this.seatResponse.CheckInResponse.Warnings[0].Message)).show();
                                            this.seatResponse.CheckInResponse.Warnings.forEach((warning, index) => {
                                                Toast.makeText(JSON.stringify(warning.Message)).show();
                                            })
                                            // passengerList.IsSelected = false;
                                            this.getSeatMap();
                                        }
                                    }
                                }
                            } else {
                                this.loaderProgress.hideLoader();
                                if (this.seatResponse.Errors != null && this.seatResponse.Errors.length > 0) {
                                    this.seatResponse.Errors.forEach((error, index) => {
                                        Toast.makeText(error.Message).show();
                                    })
                                }
                            }
                            // this.GetOrderDetails(this.MultiSegmentPaxArray.Segment[this.index].Passenger[0].OrderID);                    

                        },
                            error => {
                                console.log("Seat assignment/update error " + error);
                                this.handleServiceError(error)
                                this.loaderProgress.hideLoader();
                            },
                            () => {
                                console.log(this.seatRequest.length);
                                this.ButtonContinue = true
                            }
                        )
                    }
                    else {
                        this.ButtonContinue = true;
                        // this.SelectedPassengerList.forEach((selectedPassenger, index) => {
                        //     this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((PaxData, PaxIndex) => {
                        //         if (PaxData.RPH == selectedPassenger.RPH) {
                        //             PaxData.SeatNumber = selectedPassenger.NewSeatNumber;
                        //             PaxData.Seats[0].SeatNumber = selectedPassenger.NewSeatNumber
                        //         }
                        //     });
                        var Passengers = this._shared.GetPassenger();
                        Passengers.SegmentTravelerInfos.forEach((segEle, segindex) => {
                            this.SelectedPassengerList.forEach((selectedPassenger, index) => {
                                if (segEle.SegmentRPH == this.MultiSegmentPaxArray.Segment[this.index].RPH && segEle.PassengerRPH == selectedPassenger.RPH) {
                                    segEle.Seats[0].SeatNumber = selectedPassenger.NewSeatNumber;
                                    this._shared.GetPassenger().SegmentTravelerInfos[segindex].Seats[0].SeatNumber = selectedPassenger.NewSeatNumber;
                                }
                            })
                        })
                        // })
                    }
                }
            }
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }

    }
    GetOrderDetails(id: string): void {
        this.loaderProgress.showLoader();
        try {
            var sDate = new Date();
            console.log('Get Passenger Service --------------- Start Date Time : ' + sDate);
            this._service.GetPassenger(id)
                .subscribe(data => {
                    this._shared.SetPassenger(<Order.RootObject>data);
                    let scTable: any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
                    this.MultiSegmentPaxArray = Converters.ConvertToFlightWithPaxTemplate(this._shared.GetPassenger(), null, scTable, "");
                    // if (PassengerArray.Segment.length > 0) {
                    //     let setdepartureDate: string = moment(PassengerArray.Segment[0].DepartureDateTime.toString()).format("YYYY-MM-DD");
                    //     let setflightnumber: string = PassengerArray.Segment[0].MarketingFlight;
                    //     let setcity: string = PassengerArray.Segment[0].DepartureCity;

                    //     // PassengerArray.Segment.forEach((SegEle, SegInndex) => {

                    //     //     let departureDate: string = moment(SegEle.DepartureDateTime.toString()).format("YYYY-MM-DD");
                    //     //     let flightnumber: string;
                    //     //     if (SegEle.MarketingFlight.substr(0, 2) == "CM") {
                    //     //         flightnumber = SegEle.MarketingFlight;
                    //     //     } else if (SegEle.OperatingFlight != null && SegEle.OperatingFlight.substr(0, 2) == "CM") {
                    //     //         flightnumber = SegEle.OperatingFlight;
                    //     //     } else {
                    //     //         flightnumber = SegEle.MarketingFlight;
                    //     //     }
                    //     //     let city: string = SegEle.DepartureCity;
                    //     //     SegEle.date = moment(SegEle.DepartureDateTime.toString()).format("DD-MMM-YYYY");
                    //     //     var destination = SegEle.Destination;
                    //     //     // //Inventory
                    //     //     // this._checkin.BookingCountDisplay(departureDate, flightnumber, city)
                    //     //     //     .subscribe((data) => {
                    //     //     //         let inventory: any = data;
                    //     //     //         SegEle.inven = Converters.ConvertToInventory(inventory);
                    //     //     //     });

                    //     //     // //Inbound
                    //     //     // this._checkin.InBound(departureDate, flightnumber, city)
                    //     //     //     .subscribe((data) => {
                    //     //     //         let inBound: any = data;
                    //     //     //         SegEle.inbound = Converters.ConvertToInBound(inBound);
                    //     //     //     })

                    //     //     // //Outbound
                    //     //     // this._checkin.OutBound(departureDate, flightnumber, destination)
                    //     //     //     .subscribe((data) => {
                    //     //     //         let OutBound: any = data;
                    //     //     //         SegEle.outbound = Converters.ConvertToOutBound(OutBound);
                    //     //     //     })

                    //     //     // //status
                    //     //     // this._dataService.Status(departureDate, flightnumber, city)
                    //     //         .subscribe((data) => {
                    //     //             let status: any = data;
                    //     //             SegEle.status = status.Flights[0].Legs[0].Status;
                    //     //             SegEle.Legs = status.Flights[0].Legs;
                    //     //         })

                    //     // });

                    //     // this._dataService.GetBaggage(id).subscribe((data) => {
                    //     //     this._shared.SetBaggagecatalog(data);
                    //     // });

                    //     //Tier
                    //     // this._dataService.Tier(setdepartureDate, setflightnumber, setcity)
                    //     //     .subscribe((data) => {
                    //     //         let tier: any = data;
                    //     //         this._shared.SetTier(tier);
                    //     //         this.loaderProgress.hideLoader();
                    //     //         this._shared.SetSegmentDetail(PassengerArray);
                    //     //         var self = this;
                    //     //         this.loaderProgress.hideLoader();
                    //     //         // this.routerExtensions.navigate(["checkin"], {
                    //     //         //     animated: true,
                    //     //         //     transition: {
                    //     //         //         name: "slide",
                    //     //         //         duration: 600,
                    //     //         //         curve: "linear"
                    //     //         //     },
                    //     //         //     queryParams: {
                    //     //         //         "data": id,
                    //     //         //         "index": this.index
                    //     //         //     }
                    //     //         // });
                    //     //     });

                    // }
                    // else {
                    //     this.loaderProgress.hideLoader();
                    //     Toast.makeText("Record Not Found").show();
                    // }

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

    simpleTap(seat: SeatMap.AirSeatList, rownumber: string) {
 console.log(SeatMap.CabinList);
        if (this.SelectedPassenger.IsSelected == false) {
            Toast.makeText("Please select a passenger to assign seat").show();
        } else if (this.SelectedPassenger.NoSeat) {
            // no code
        }
        else {
            this.ButtonContinue = false
            if ((this.SelectedPassenger.PassengerType == "Adult" && this.SelectedPassenger.AssociatedInfantRPH != null) || this.SelectedPassenger.PassengerType != "Adult" || (this.SelectedPassenger.SSR.filter(m => m == "WCHR").length > 0) || (this.SelectedPassenger.SSR.filter(m => m == "WCHS").length > 0) || (this.SelectedPassenger.SSR.filter(m => m == "WCHC").length > 0) || this.SelectedPassenger.SSR.filter(m => m == "UMNR").length > 0) {
                seat.SeatCharacteristics.forEach((characteristics, index) => {
                    if (characteristics == "17") {
                        console.log("clear");
                        this.infantExitrowSeat = true;

                    }
                });
            }
            if (this.infantExitrowSeat != true) {
                if (this.seat[this.seat.length - 1].SeatNumber == seat.SeatNumber && rownumber == this.rowNumber) {
                    seat.IsSeatSelected = true;
                    this.seat[this.seat.length - 1] = new SeatMap.AirSeatList();
                    seat.IsPaxSelected = true;
                    // seat.PaxRPH = "";
                    // this.rowNumber = '';
                } else if (seat.SeatAvailability == '1' || seat.SeatAvailability == '15') {
                    if (seat.SeatCharacteristics.filter(m => m == '17').length > 0) {
                        dialogs.confirm("Do you want to proceed with Exit Seat").then(result => {
                            console.log("Dialog result: " + result);
                            if (result) {
                                this.selectSeat(seat, rownumber);
                            }
                        });
                    } else {
                        this.selectSeat(seat, rownumber);
                    }
                }
            }
            else {
                Toast.makeText("UNABLE TO ASSIGN EXIT ROW SEAT FOR THIS PASSENGER").show()
                this.ButtonContinue = true;
                this.infantExitrowSeat = false;
            }
        }
    }

    selectSeat(seat: SeatMap.AirSeatList, rownumber: string) {
        console.log(this.seat);
        if (this.seat.filter(m => m.PaxRPH == this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == this.SelectedPassenger.FlightLegDepartureAirportCode).length > 0) {
            this.seat.filter(m => m.PaxRPH == this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == this.SelectedPassenger.FlightLegDepartureAirportCode)[0].IsSeatSelected = false
            this.seat.filter(m => m.PaxRPH == this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == this.SelectedPassenger.FlightLegDepartureAirportCode)[0].IsPaxSelected = false
            this.seat.filter(m => m.PaxRPH == this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == this.SelectedPassenger.FlightLegDepartureAirportCode)[0].PaxRPH = ""
        }
        seat.IsPaxSelected = true;
        seat.IsSeatSelected = true;
        seat.PaxRPH = this.SelectedPassenger.RPH;
        let productList = this.ShowSeatMapList.SeatProductInformation;
        this.SelectedPassenger.seatPreference = [];
        productList.forEach((product, productIndex) => {
            const seatCharacter = seat.SeatCharacteristics.filter(sc => sc === product.OTACode)
            if (seatCharacter.length > 0) {
                this.SelectedPassenger.seatPreference.push(seatCharacter[0])
            }
        });
        seat.FlightLegDepartureAirportCode = this.SelectedPassenger.FlightLegDepartureAirportCode
        this.seat.push(seat);
        this.rowNumber = rownumber;
        this.SeatCharacteristic = seat.SeatCharacteristics;
        this.SelectedSeat = this.rowNumber + seat.SeatNumber;
        this.SelectedPassenger.NewSeatNumber = this.SelectedSeat;
        this.SelectedPassenger.SeatNumber = this.SelectedSeat;
        // this.PassengerList.filter(m=> m.RPH == this.SelectedPassenger.RPH)[0].SeatNumber = this.SelectedSeat;
        this.SelectedPassenger.seatCode = seat.SeatCode;
        console.log(this.SelectedPassengerList);
        console.log(this.SelectedPassenger)
        if (this.SelectedPassengerList.length > 0 && this.SelectedPassengerList.filter(m => m.RPH == this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == this.SelectedPassenger.FlightLegDepartureAirportCode).length > 0) {
            // this.SelectedPassengerList.filter(m => m.RPH == this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == this.SelectedPassenger.FlightLegDepartureAirportCode)[0] = Object.assign({}, this.SelectedPassenger);
            this.SelectedPassengerList.splice(this.SelectedPassengerList.indexOf(this.SelectedPassengerList.filter(m => m.RPH == this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == this.SelectedPassenger.FlightLegDepartureAirportCode)[0]), 1);
            this.SelectedPassengerList.push(this.SelectedPassenger);
        } else {
            this.SelectedPassengerList.push(Object.assign({}, this.SelectedPassenger));
        }

        console.log(this.SelectedPassengerList);
    }

    select(passengerList: MultiSegmentTemplate.Passenger, isNoSeat: boolean = false) {
        if (passengerList.INFwithoutSeat == true) {
            Toast.makeText("Seat cannot be assigned to this particular passenger type").show();
        }
        else {
            if (!isNoSeat) {
                passengerList.IsSelected = true;
                if (passengerList.AssociatedInfantRPH != null) {
                    let infPax = this.MultiSegmentPaxArray.Segment[this.index].Passenger.filter(m => m.AssociatedAdultRPH === passengerList.RPH);
                    if (infPax.length > 0) infPax[0].IsSelected = true;
                    // this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((Paxdata, PaxIndex) => {
                    //     if (Paxdata.AssociatedAdultRPH == passengerList.RPH && passengerList.IsSelected == true) {
                    //         Paxdata.IsSelected = true;
                    //     } else {
                    //         Paxdata.IsSelected = false;
                    //     }
                    // })
                }
                if (passengerList.RPH == this.SelectedPassenger.RPH) {
                    this.num++;
                    console.log("1");
                    if (this.num % 2 == 1) {
                        passengerList.IsSelected = false;
                        if (passengerList.AssociatedInfantRPH != null) {
                            let infPax = this.MultiSegmentPaxArray.Segment[this.index].Passenger.filter(m => m.AssociatedAdultRPH === passengerList.RPH);
                            if (infPax.length > 0) infPax[0].IsSelected = false;
                            // this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((Paxdata, PaxIndex) => {
                            //     if (Paxdata.AssociatedAdultRPH == passengerList.RPH && Paxdata.IsSelected == true) {
                            //         Paxdata.IsSelected = false;
                            //     }
                            // })
                        }
                    }
                    else {
                        passengerList.IsSelected = true;
                    }
                }
                if (passengerList.RPH != this.SelectedPassenger.RPH && this.SelectedPassenger.IsSelected) {
                    this.SelectedPassenger.IsSelected = !this.SelectedPassenger.IsSelected;
                    if (this.SelectedPassenger.AssociatedInfantRPH != null) {
                        let infPax = this.MultiSegmentPaxArray.Segment[this.index].Passenger.filter(m => m.AssociatedAdultRPH === this.SelectedPassenger.RPH);
                        if (infPax.length > 0) infPax[0].IsSelected = false;
                        // this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((Paxdata, PaxIndex) => {
                        //     if (Paxdata.AssociatedAdultRPH == this.SelectedPassenger.RPH && Paxdata.IsSelected == true) {
                        //         Paxdata.IsSelected = false;
                        //     }
                        // })
                    }
                }
                // if (passengerList.IsSelected == false && this.SelectedPassenger.IsSelected == false) {
                //     this.num = 0;
                //     this.num++;
                // }
                this.SelectedPassenger = passengerList;
                if (((this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight != null && this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight.substr(0, 2) == "CM")||(this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight != null && this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight.substr(0, 2) == "CM")) && this.legsInfo!=null&&this.legsInfo.length > 1) {
                    if (this.legsInfo.filter(m => m.isLegSelected == true).length == 1) {
                        this.SelectedPassenger.FlightLegDepartureAirportCode = this.legsInfo.filter(m => m.isLegSelected == true)[0].DepartureAirport.LocationCode;
                    } else {
                        this.SelectedPassenger.FlightLegDepartureAirportCode = this.legsInfo[0].DepartureAirport.LocationCode;
                    }
                } else {
                    this.SelectedPassenger.FlightLegDepartureAirportCode = this.MultiSegmentPaxArray.Segment[this.index].Origin;
                }
                if (this.SelectedPassenger.NoSeat) {
                    this.SelectedPassenger.NewSeatNumber = ""
                    this.SelectedPassengerList.push(Object.assign({}, this.SelectedPassenger))
                } else {
                    if (this.SelectedPassengerList.filter(m => m.RPH == this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == this.SelectedPassenger.FlightLegDepartureAirportCode).length > 0 && this.SelectedPassengerList.filter(m => m.RPH == this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == this.SelectedPassenger.FlightLegDepartureAirportCode)[0].NewSeatNumber == "") {
                        var item = this.SelectedPassengerList.filter(m => m.RPH == this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == this.SelectedPassenger.FlightLegDepartureAirportCode && m.NewSeatNumber == "")[0]
                        var index = this.SelectedPassengerList.indexOf(item);
                        this.SelectedPassengerList.splice(index, 1);
                    }

                }
            } else {
                this.ShowSeatMapList.CabinList.forEach((cabin, cabinIndex) => {
                    cabin.AirRowList.forEach((row, rowIndex) => {
                        if (row.AirSeatList.filter(m => m.PaxRPH == passengerList.RPH && m.FlightLegDepartureAirportCode == passengerList.FlightLegDepartureAirportCode).length > 0) {
                            row.AirSeatList.filter(m => m.PaxRPH == passengerList.RPH && m.FlightLegDepartureAirportCode == passengerList.FlightLegDepartureAirportCode)[0].IsSeatSelected = false
                            row.AirSeatList.filter(m => m.PaxRPH == passengerList.RPH && m.FlightLegDepartureAirportCode == passengerList.FlightLegDepartureAirportCode)[0].IsPaxSelected = false
                            row.AirSeatList.filter(m => m.PaxRPH == passengerList.RPH && m.FlightLegDepartureAirportCode == passengerList.FlightLegDepartureAirportCode)[0].PaxRPH = ""
                        }
                    })
                });
                if (((this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight != null && this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight.substr(0, 2) == "CM")||(this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight != null && this.MultiSegmentPaxArray.Segment[this.index].OperatingFlight.substr(0, 2) == "CM")) && this.legsInfo!=null&& this.legsInfo.length > 1) {
                    if (this.legsInfo.filter(m => m.isLegSelected == true).length == 1) {
                        passengerList.FlightLegDepartureAirportCode = this.legsInfo.filter(m => m.isLegSelected == true)[0].DepartureAirport.LocationCode;
                    } else {
                        passengerList.FlightLegDepartureAirportCode = this.legsInfo[0].DepartureAirport.LocationCode;
                    }
                }
                if (passengerList.NoSeat) {
                    passengerList.NewSeatNumber = ""
                    this.SelectedPassengerList.push(Object.assign({}, passengerList))
                } else {
                    if (this.SelectedPassengerList.filter(m => m.RPH == this.SelectedPassenger.RPH && m.FlightLegDepartureAirportCode == passengerList.FlightLegDepartureAirportCode).length > 0 && this.SelectedPassengerList.filter(m => m.RPH == passengerList.RPH && m.FlightLegDepartureAirportCode == passengerList.FlightLegDepartureAirportCode)[0].NewSeatNumber == "") {
                        var item = this.SelectedPassengerList.filter(m => m.RPH == passengerList.RPH && m.FlightLegDepartureAirportCode == passengerList.FlightLegDepartureAirportCode && m.NewSeatNumber == "")[0]
                        var index = this.SelectedPassengerList.indexOf(item);
                        this.SelectedPassengerList.splice(index, 1);
                    }

                }
            }

            console.log(this.SelectedPassengerList)
        }
    }

    check1() {
        if (this.IsChecked1) {
            this.IsChecked1 = false;
        }
        else {
            this.IsChecked1 = true;

        }
    }
    check2() {
        if (this.IsChecked2) {
            this.IsChecked2 = false;
            this.disablebulkhead();
        }
        else {
            this.IsChecked2 = true;
            this.enablebulkhead();
        }
    }
    check3() {
        if (this.IsChecked3) {
            this.IsChecked3 = false;
            this.disableINfNotAllowed();
        }
        else {
            this.IsChecked3 = true;
            this.enableINfNotAllowed();
        }
    }
    check4() {
        if (this.IsChecked4) {
            this.IsChecked4 = false;
            console.log("false Part");
            this.disableExitRow();
        }
        else {
            this.IsChecked4 = true;
            this.enableExitRow();
        }
    }

    selectSeg(selectindex: any, index: any) {
        console.log("Index:" + index);
        this.PassengerList.forEach((passengerlist, index) => {
            passengerlist.IsSelected = false;
        })
        if (selectindex[index] == true) {
            this.isSegSelected[index] = false;
            this.legsInfo[index].isLegSelected = false;
        } else {
            this.isSegSelected[index] = true;
            this.legsInfo[index].isLegSelected = true;
        }
        this.isall = this.allTheSame(this.isSegSelected);
        this.SelectedPassenger = new MultiSegmentTemplate.Passenger();
        this.showSeatMap(this.isall);
        console.log("Obj:" + JSON.stringify(this.isall));
    }
    showSeatMap(isall) {
        if (isall == true) {
            if (this.legsInfo[0].isLegSelected == true) {
                this.ShowSeatMapList = this.SeatMapList.Items.filter(m => m.FlightSegment.Origin.LocationCode == this.MultiSegmentPaxArray.Segment[this.index].Origin && m.FlightSegment.Destination.LocationCode == this.MultiSegmentPaxArray.Segment[this.index].Destination)[0];
                this.PassengerList.forEach((paxdata, Index) => {
                    paxdata.SeatNumber = paxdata.Seats[0].SeatNumber;
                })
            } else {
                this.ShowSeatMapList = new SeatMap.Item();
                Toast.makeText("No Seatmap selected").show();
            }
        }
        else {
            var Origin = this.legsInfo.filter(m => m.isLegSelected == true)[0].DepartureAirport.LocationCode;
            var Dest = this.legsInfo.filter(m => m.isLegSelected == true)[0].ArrivalAirport.LocationCode;
            this.ShowSeatMapList = this.SeatMapList.Items.filter(m => m.FlightSegment.Origin.LocationCode == Origin && m.FlightSegment.Destination.LocationCode == Dest)[0];
            this.PassengerList.forEach((paxdata, Index) => {
                paxdata.Seats.forEach((seats, seatIndex) => {
                    if (seats.ArrivalCode == Dest && seats.DepartureCode == Origin) {
                        paxdata.SeatNumber = seats.SeatNumber;
                    }
                })
            })
        }
    }

    allTheSame(array): boolean {
        var first = array[0];
        return array.every(function (element) {
            return element === first;
        });
    }
    enableExitRow() {
        console.log("inside");
        this.ShowSeatMapList.CabinList.forEach((cabEle, cabindex) => {
            cabEle.AirRowList.forEach((RowEle, RowIndex) => {
                RowEle.AirSeatList.forEach((seatEle, seatIndex) => {
                    seatEle.SeatCharacteristics.forEach((charEle, charIndex) => {
                        if (charEle == '17') {
                            if (seatEle.StyleClass != 'noSeat') {
                                seatEle.IsSelectedAdvanceDisplay = true;
                                this.IsExitRowSelected = true;
                                seatEle.AdvanceDisplayStyleClass = 'exitrow';
                            }
                        }
                    });
                });
            });
        });
    }
    disableExitRow() {
        console.log("OutSide")
        this.ShowSeatMapList.CabinList.forEach((cabEle, cabindex) => {
            cabEle.AirRowList.forEach((RowEle, RowIndex) => {
                RowEle.AirSeatList.forEach((seatEle, seatIndex) => {
                    seatEle.SeatCharacteristics.forEach((charEle, charIndex) => {
                        if (charEle == '17') {
                            console.log("exit row");
                            if (seatEle.StyleClass != 'noSeat') {
                                this.IsExitRowSelected = false;
                                seatEle.IsSelectedAdvanceDisplay = false;
                                if (this.IsInfantNotAllowedSelected == true) {
                                    seatEle.IsSelectedAdvanceDisplay = true;
                                    seatEle.AdvanceDisplayStyleClass = 'infantnotallowed';
                                }
                            }
                        }
                    });
                });
            });
        });

    }
    enableINfNotAllowed() {
        console.log("inside");
        this.ShowSeatMapList.CabinList.forEach((cabEle, cabindex) => {
            cabEle.AirRowList.forEach((RowEle, RowIndex) => {
                RowEle.AirSeatList.forEach((seatEle, seatIndex) => {
                    seatEle.SeatCharacteristics.forEach((charEle, charIndex) => {
                        if (charEle == '51') {
                            console.log("infant not allowed");
                            if (seatEle.StyleClass != 'noSeat') {
                                seatEle.IsSelectedAdvanceDisplay = true;
                                this.IsInfantNotAllowedSelected = true;
                                seatEle.AdvanceDisplayStyleClass = 'infantnotallowed';
                                if (this.IsExitRowSelected == true) {
                                    seatEle.AdvanceDisplayStyleClass = 'exitrow';
                                }
                            }
                        }
                    });
                })
            });
        });
    }
    disableINfNotAllowed() {
        console.log("OutSide")
        this.ShowSeatMapList.CabinList.forEach((cabEle, cabindex) => {
            cabEle.AirRowList.forEach((RowEle, RowIndex) => {
                RowEle.AirSeatList.forEach((seatEle, seatIndex) => {
                    seatEle.SeatCharacteristics.forEach((charEle, charIndex) => {
                        if (charEle == '51') {
                            // console.log("exit row");
                            if (seatEle.StyleClass != 'noSeat') {
                                this.IsInfantNotAllowedSelected = false;
                                seatEle.IsSelectedAdvanceDisplay = false;
                                if (this.IsExitRowSelected == true) {
                                    seatEle.IsSelectedAdvanceDisplay = true;
                                    seatEle.AdvanceDisplayStyleClass = 'exitrow';
                                }
                            }
                        }
                    });
                });
            });
        });

    }
    enablebulkhead() {
        console.log("inside");
        this.ShowSeatMapList.CabinList.forEach((cabEle, cabindex) => {
            cabEle.AirRowList.forEach((RowEle, RowIndex) => {
                RowEle.AirSeatList.forEach((seatEle, seatIndex) => {
                    seatEle.SeatCharacteristics.forEach((charEle, charIndex) => {
                        if (charEle == '10') {
                            console.log("bulkhead");
                            if (seatEle.StyleClass != 'noSeat') {
                                seatEle.IsSelectedAdvanceDisplay = true;
                                seatEle.AdvanceDisplayStyleClass = 'bulkhead';
                            }
                        }
                    });
                })
            });
        });
    }
    disablebulkhead() {
        console.log("OutSide")
        this.ShowSeatMapList.CabinList.forEach((cabEle, cabindex) => {
            cabEle.AirRowList.forEach((RowEle, RowIndex) => {
                RowEle.AirSeatList.forEach((seatEle, seatIndex) => {
                    seatEle.SeatCharacteristics.forEach((charEle, charIndex) => {
                        if (charEle == '10') {
                            console.log("exit row");
                            if (seatEle.StyleClass != 'noSeat') {
                                seatEle.IsSelectedAdvanceDisplay = false;
                            }
                        }
                    });
                });
            });
        });

    }
    gotonotify() {
        this.routerExtensions.navigate(["notify"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    }
    hideShowLedgerd() {
        if (this.showSeatMapKey) {
            this.showSeatMapKey = false;
        } else {
            this.showSeatMapKey = true;
        }
    }
    hideShowAdavanceDisplay() {
        if (this.showAdvanceDisplay) {
            this.showAdvanceDisplay = false;
        } else {
            this.showAdvanceDisplay = true;
        }
    }
    navigateToCheckIn() {
        let orderId: string = this.MultiSegmentPaxArray.Segment[this.index].Passenger[0].OrderID;
        if (this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight.substr(0, 2) == "CM" && this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight.length <= 5) {
            this.navigateToCheckInPage(orderId);
        } else {
            this.navigateToCheckInPage(orderId);
        }
    }
    GetOrderDetailsforReferesh(id: string): void {
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
                        this.navigateToCheckInPage(id);
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
    navigateToCheckInPage(orderId: string) {
        this.loaderProgress.hideLoader();
        this.routerExtensions.navigate(["checkin"], {
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

    navigatetoChechkinforOtherFlight() {
        this.routerExtensions.navigate(["checkin"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "PassengerArray": this.MultiSegmentPaxArray.Segment[0].Passenger[0].OrderID,
                "index": this.index
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



    isItemVisible(args): string {

        if (args.toString().substr(0, 2) == 'CM' && args.toString().length <= 5) {
            return "visible";
        }
        else return "collapsed";
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

    navigateTologin() {
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
