//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
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
//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as moment from "moment";
import * as Toast from 'nativescript-toast';

//app references
import { LoaderProgress, order, PassengerListTemplate, DeparturePaxList, PassengerList, DepartureInfo1, InBound, OutBound } from "../../shared/interface/index"
import { Passenger, Order, Inventory, CountryCollection } from '../../shared/model/index';
import { DataService, CheckinOrderService, PassengerService, TimeOutService, DepartureService, CheckinService } from "../../shared/services/index";
import { Converters } from "../../shared/utils/index";
import { AppExecutiontime } from "../../app.executiontime";
import { Configuration } from '../../app.constants';

@Component({
    selector: "list-page",
    providers: [DataService, PassengerService, Configuration, DepartureService, CheckinService],
    templateUrl: "./components/departurepaxlist/departurepaxlist.component.html",
    styleUrls: ["./components/departurepaxlist/departurepaxlist.component.css"]
})

export class DeparturePaxListComponent implements OnInit {
    isError: boolean;
    errorMessage: string;
    loaderProgress: LoaderProgress;
    orderID: string;

    public PassengerDetails: any;
    public CountryDetails: CountryCollection.Collection;
    public SearchByName: string;
    public PassengerListOld: Array<PassengerListTemplate>;
    public PassengerList: Array<DeparturePaxList> = [];
    public NewPassengerList: Array<DeparturePaxList> = [];
    public NotCheckedInPassengerList: Array<DeparturePaxList> = [];
    public CheckedInPassengerList: Array<DeparturePaxList> = [];
    public nl: any;
    private locationcode: string;
    private flightcode: string;
    private date: string;
    private date1: string;
    private date2: string;
    public checkedPaxCount: number = 0;
    public notCheckedPaxCount: number = 0;
    private flightDate: string;
    public userdetails: any;
    public DepartureArray: Array<DepartureInfo1.Departure> = [];
    private dd: string; private mm: string; private yyyy: string;
    public checkinind: number = 1;
    public ind1: boolean = true;
    public ind2: boolean = false;
    public DestinationCode: string = "";
    public DestinationCode1: string = null;
    public OriginCode: string = "";
    public FlightInfo: any;
    checkedCount: number = 0;
    public invent: any;
    public inbound: any;
    public outbound: any;
    public status: any;
    public outboun1: OutBound.Outbou = new OutBound.Outbou();
    public inboun1: InBound.Inbou = new InBound.Inbou();
    public invent1: Inventory.RootObject = new Inventory.RootObject();
    public SecondLegDestination: string = "";
    public isMulitLegFlight: boolean = false;
    public AdditionalDocuments: any;
    public isCompensationEnabled: boolean = false;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    @ViewChild('pagecontainer') pageCont: ElementRef;
    @ViewChild('segbar') segbar: ElementRef;

    // @ViewChild('tabnotcheckin') tabnotcheckin: ElementRef;
    public paxList: Array<Passenger>;
    public apisdetails: Array<SegmentedBarItem>;
    public item = new SegmentedBarItem();
    public secondItem = new SegmentedBarItem();
    constructor(public _checkin: CheckinService, private page: Page, public _timeoutService: TimeOutService, private routerExtensions: RouterExtensions, public _dataService: DataService, private router: Router, private location: Location, private activatedRouter: ActivatedRoute, public _shared: CheckinOrderService, public _service: PassengerService, public departureService: DepartureService) {
        this.isError = false;
        this.errorMessage = "";
        this.paxList = [];
        this.apisdetails = [];
        this.loaderProgress = new LoaderProgress();

        this.item.title = "Checkedin";
        this.apisdetails.push(this.item);

        this.secondItem.title = "Not Checkedin";
        this.apisdetails.push(this.secondItem);

    }

    ngOnInit() {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.loaderProgress.initLoader(this.pageCont);
        this.date = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
        this.date1 = moment(new Date()).format("DD MMM YYYY");
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        let userlocation: String = this.userdetails;
        this.locationcode = userlocation.substring(0, 3);
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled");
        this.activatedRouter.queryParams.subscribe((params) => {
            this.flightcode = params["data"];
            this.DepartureArray = JSON.parse(params["pax"]);
        });

        this.GetCountry();
        this.getDocumentType();
        this.GetFQTV();
        this.getPassangerList(this.DepartureArray);
        var label = this.pageCont.nativeElement
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args: gestures.GestureEventData) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();

        });
        this._shared.SetBagTag(null);

    }

    getDocumentType() {
        this._dataService.documentType().subscribe(data => {
            this.AdditionalDocuments = data.ReferenceInfo[0].AdcDocumentsToAppend;
            this._shared.SetAdditionalDocuments(this.AdditionalDocuments);
            // this.loaderProgress.hideLoader();            
        }, error => {
            this.handleServiceError(error);
            console.log(error);
            this.loaderProgress.hideLoader();

        })

    }
    public getPassangerList(departure: any): void {
        this.loaderProgress.showLoader();
        console.log(departure);
        this.flightDate = departure.Date;
        console.log("dates" + JSON.stringify(this.flightDate));
        this._dataService.GetFlightInfo(this.flightcode, this.flightDate).subscribe((data) => {
            this.FlightInfo = data;
            if (data.Success != false) {
                if (data.Flights[0].Legs.length > 1) {
                    this.isMulitLegFlight = true;
                    // this.loaderProgress.showLoader();
                    this.OriginCode = data.Flights[0].Legs[0].DepartureAirport.LocationCode;
                    this.DestinationCode = data.Flights[0].Legs[0].ArrivalAirport.LocationCode;

                    this.SecondLegDestination = data.Flights[0].Legs[1].ArrivalAirport.LocationCode;
                    // this.DepartureArray[0].FlightStatus = data.Flights[0].Legs[0].Status;                    
                    this.FlightDeatils();
                    console.log("NextDests" + JSON.stringify(this.DestinationCode));


                } else {

                    this.OriginCode = data.Flights[0].Legs[0].DepartureAirport.LocationCode;
                    this.DestinationCode = data.Flights[0].Legs[0].ArrivalAirport.LocationCode;
                    this.FlightDeatils();
                }
            }
            else {
                Toast.makeText(data.ErrorMessage).show();
            }

        },
            error => {
                console.log("Couldnt find information for this search " + error);
                this.handleServiceError(error);
                // var errorMessage = error.toString();
                // if (errorMessage.indexOf("Unrecognized token '<'") != -1) {
                //     var options = {
                //         title: "Session Time Out",
                //         message: "Your session has been time out",
                //         okButtonText: "OK"
                //     };
                //     dialogs.alert(options).then(() => {

                //         this.navigateTologin();

                //     });
                // }
                this.loaderProgress.hideLoader();
                // Toast.makeText("Couldnt find information for this search " + error).show();
            });


    }
    filter(args: any) {
        let segBarElm = <SegmentedBar>this.segbar.nativeElement;
        let index = segBarElm.selectedIndex;
        console.log(index);
        if (args != "") {
            if (index == 0) {
                let name = args.toString().toUpperCase();
                this.NewPassengerList = this.CheckedInPassengerList.filter(r => r.Surname.indexOf(name.trim()) >= 0 || r.GivenName.indexOf(name.trim()) >= 0);

            } else {
                let name = args.toString().toUpperCase();
                this.NewPassengerList = this.NotCheckedInPassengerList.filter(r => r.Surname.indexOf(name.trim()) >= 0 || r.GivenName.indexOf(name.trim()) >= 0);
            }
        } else {
            if (index == 0) {
                this.NewPassengerList = this.CheckedInPassengerList;
            } else {
                this.NewPassengerList = this.NotCheckedInPassengerList
            }
        }


    }
    public FlightDeatils(): void {
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log("V" + JSON.stringify(this.date2));
            console.log("V" + JSON.stringify(this.flightcode));
            console.log("V" + JSON.stringify(this.locationcode));
            console.log("V" + JSON.stringify(this.date2));
            console.log('SearchAllPaxByFlight Service --------------- Start Date Time : ' + sDate);
            this._checkin.BookingCountDisplay(this.flightDate, this.flightcode, this.locationcode)
                .subscribe((data) => {
                    let inventory: any = data;
                    this.invent1.inven = Converters.ConvertToInventory(inventory);
                    console.dir(this.invent1);
                }, error => {
                    this.handleServiceError(error);
                    console.log(error);
                    // this.loaderProgress.hideLoader();

                });

            //Inbound
            this._checkin.InBound(this.flightDate, this.flightcode, this.locationcode)
                .subscribe((data) => {
                    let inBound: any = data;
                    this.inbound = Converters.ConvertToInBound(inBound);
                    console.dir(this.inbound);
                }, error => {
                    this.handleServiceError(error);
                    console.log(error);
                    // this.loaderProgress.hideLoader();

                })

            //Outbound
            this._checkin.OutBound(this.flightDate, this.flightcode, this.DestinationCode)
                .subscribe((data) => {
                    let OutBound: any = data;
                    this.outbound = Converters.ConvertToOutBound(OutBound);
                    console.dir(this.outbound);
                }, error => {
                    this.handleServiceError(error);
                    console.log(error);
                    // this.loaderProgress.hideLoader();

                })

            //status
            this._dataService.Status(this.flightDate, this.flightcode, this.locationcode)
                .subscribe((data) => {
                    let status: any = data;
                    this.status = status.Flights[0].Legs[0].Status;
                    console.log(status);
                    this.DepartureArray[0].FlightStatus = status.Flights[0].Legs[0].Status;
                    console.log(this.DepartureArray[0].FlightStatus);
                }, error => {
                    this.handleServiceError(error);
                    console.log(error);
                    // this.loaderProgress.hideLoader();

                })
            this.getPaxbyFlight("ALL", this.flightDate, this.flightcode, this.locationcode, this.checkinind);

            // setTimeout(() => {
            //     this.loaderProgress.hideLoader();
            // }, 10000);
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        // this.loaderProgress.hideLoader();
    }

    public getPaxbyFlight(name: string, date: string, flightcode: string, locationcode: string, checkind: number): void {

        try {
            var sDate = new Date();
            console.log('SearchAllPaxByFlight Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            this.departureService.SearchAllPaxByFlight(name, date, flightcode, this.locationcode)
                .subscribe((data) => {
                    console.dir(data);
                    this._shared.SetAPISDocument(null);
                    this._shared.SetScanAPISDocument(null);
                    if (data.Success != false) {
                        let tier: any = data;
                        this._shared.SetTier(tier);
                        this.PassengerDetails = <Order.PassengerDetailList>data;
                        this.PassengerList = Converters.ConvertToPaxByFlightforDepartureTemplate(this.PassengerDetails, checkind, this.locationcode);
                        this.CheckedInPassengerList = this.PassengerList.filter(r => r.CheckinStatus);
                        this.checkedPaxCount = this.CheckedInPassengerList.length;
                        // this.item.title =+ " ("+ this.checkedPaxCount + ")"
                        this.NotCheckedInPassengerList = this.PassengerList.filter(r => r.CheckinStatus == false);
                        this.notCheckedPaxCount = this.NotCheckedInPassengerList.length;
                        console.log("checked in:" + JSON.stringify(this.checkedPaxCount));
                        console.log("Not checked in:" + JSON.stringify(this.notCheckedPaxCount));
                        //const item = new SegmentedBarItem();
                        this.item.title = "Checkedin " + "(" + this.checkedPaxCount + ")";
                        this.apisdetails.push(this.item);
                        // const secondItem = new SegmentedBarItem();
                        this.secondItem.title = "Not Checkedin " + "(" + this.notCheckedPaxCount + ")";
                        this.apisdetails.push(this.secondItem);

                        this.NewPassengerList = this.CheckedInPassengerList;
                        this.loaderProgress.hideLoader();
                        // if (this.CheckedInPassengerList.length == 0) {
                        //     Toast.makeText("No CheckedIn Passenger in this FLight").show();
                        // }
                        if (data.Warnings != null) {
                            Toast.makeText(data.Warnings[0].Message).show();
                        }
                    }
                    else {
                        if (data.Warnings != null) {
                            Toast.makeText(data.Warnings[0].Message).show();
                        }
                        this.loaderProgress.hideLoader();
                        // this.naviteToDepartureall();
                    }

                },
                    error => {
                        console.log("Couldnt find information for this search " + error);
                        this.handleServiceError(error);
                        // var errorMessage = error.toString();
                        // if (errorMessage.indexOf("Unrecognized token '<'") != -1) {
                        //     var options = {
                        //         title: "Session Time Out",
                        //         message: "Your session has been time out",
                        //         okButtonText: "OK"
                        //     };
                        //     dialogs.alert(options).then(() => {

                        //         this.navigateTologin();

                        //     });
                        // }
                        this.loaderProgress.hideLoader();
                        // Toast.makeText("Couldnt find information for this search " + error).show();
                    },
                    () => {
                        console.log('Data Retrieved successfully' + this.PassengerDetails)
                        // this.loaderProgress.hideLoader();
                    }
                )
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('SearchAllPaxByFlight Service --------------- End Date Time : ' + eDate);
            console.log('SearchAllPaxByFlight Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            // this.loaderProgress.hideLoader();
        }
    }


    public GetCountry(): void {
        this.loaderProgress.showLoader();
        try {
            var sDate = new Date();
            console.log('Get Countries Service --------------- Start Date Time : ' + sDate);
            this._service.GetCountries()
                .subscribe(data => {
                    this.CountryDetails = <CountryCollection.Collection>data;
                    this._shared.SetCountry(this.CountryDetails);
                },
                    err => {
                        console.log(err)
                        this.handleServiceError(err);
                        this.loaderProgress.hideLoader();
                        // var errorMessage = err.toString();
                        // if (errorMessage.indexOf("Unrecognized token '<'") != -1) {
                        //     var options = {
                        //         title: "Session Time Out",
                        //         message: "Your session has been time out",
                        //         okButtonText: "OK"
                        //     };
                        //     dialogs.alert(options).then(() => {

                        //         this.navigateTologin();

                        //     });
                        // }

                    });
            // this.loaderProgress.hideLoader();
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();

        }
        finally {
            this.loaderProgress.hideLoader();
            var eDate = new Date();
            console.log('Get Countries Service --------------- End Date Time : ' + eDate);
            console.log('Get Countries Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    }

    GetFQTV(): void {
        this._dataService.FQTV()
            .subscribe((data) => {
                console.dir(data);
                this._shared.SetFQTV(data);
            }, error => {
                this.handleServiceError(error);
                console.log(error);
                this.loaderProgress.hideLoader();

            })
    }

    GetOrderDetails(id: string): void {
        this.loaderProgress.showLoader();
        try {
            var sDate = new Date();
            console.log('Get Passenger Service --------------- Start Date Time : ' + sDate);
            this._service.GetPassenger(id)
                .subscribe(data => {
                    //console.dir(data);
                    this._shared.SetAPISDocument(null);
                    this._shared.SetScanAPISDocument(null);
                    if (data.ID != null) {
                        if (data.TicketingStatus != "Not Ticketed" && data.TicketingStatus != "Partially Ticketed" && data.IsOutOfSyncTicket != true) {
                            if (data.Segments != null && data.Segments.length > 0) {
                                var POSLocation = ApplicationSettings.getString("userdetails", "").substr(0, 3);
                                if (data.Segments.filter(m => m.Origin.AirportCode == POSLocation).length > 0 && data.Segments.filter(m => m.Origin.AirportCode == POSLocation)[0].Status.isWaitlistedPassenger) {
                                    this._shared.SetIsWaitlisted(true);
                                    Toast.makeText("Waitlisted Passenger").show();
                                }
                                else {
                                    this._shared.SetIsWaitlisted(false);
                                    console.log("isWaitlistedPassenger : false")
                                }
                            }
                            this._shared.SetPassenger(<Order.RootObject>data);
                            console.dir(this._shared.GetPassenger().Passengers[0].Documents);
                            let scTable: any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
                            let PassengerArray: any = Converters.ConvertToFlightWithPaxTemplate(this._shared.GetPassenger(), null, scTable, "");
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
                                    var isCompleted : boolean = false;
                                    this._dataService.Status(departureDate, flightnumber, city)
                                        .subscribe((data) => {

                                            if (data.Flights) {
                                                let status: any = data;
                                                SegEle.status = status.Flights[0].Legs[0].Status;
                                                let OriginlocDetails = status.Flights[0].Legs.filter(m => m.DepartureAirport.LocationCode == SegEle.Origin)[0];
                                                console.log("Flight origin:" + SegEle.Origin);
                                                console.log("Flight origin:" + JSON.stringify(OriginlocDetails));
                                                // if(SegEle.Origin == status.Flights[0].Legs.filter(m=> m.DepartureAirport))
                                                SegEle.Legs = status.Flights[0].Legs;
                                                SegEle.ETD = OriginlocDetails.DepartureDateTime.Estimated.toString().substr(11, 5);
                                                SegEle.STD = OriginlocDetails.DepartureDateTime.Scheduled.toString().substr(11, 5);
                                                SegEle.ETA = OriginlocDetails.ArrivalDateTime.Scheduled.toString().substr(11, 5);

                                                console.log(status.Flights[0].Legs[0].DepartureDateTime.Estimated.toString().substr(11, 5) + "llll");
                                                let passengerLength = PassengerArray.Segment.length - 1;
                                                if (passengerLength == SegInndex) {
                                                    this._shared.SetBagTag(null);
                                                    this._shared.SetSegmentDetail(PassengerArray);
                                                    let multiplePassenger: number = 0;
                                                     this.loaderProgress.hideLoader();
                                                    this.navigateToCheckIn();

                                                }
                                            } else {
                                                Toast.makeText(data.Warnings[0].Message).show();
                                                let passengerLength = PassengerArray.Segment.length - 1;
                                                if (passengerLength == SegInndex) {
                                                    this._shared.SetBagTag(null);
                                                    this._shared.SetSegmentDetail(PassengerArray);
                                                    this.loaderProgress.hideLoader();
                                                    this.navigateToCheckIn();
                                                    
                                                }
                                            }


                                        }, err => {
                                            console.log(err);
                                            // isErrorOccured = true;
                                            this.loaderProgress.hideLoader();
                                            this.handleServiceError(err);

                                        })

                                });

                                // this._dataService.GetBaggage(id).subscribe((data) => {
                                //     this._shared.SetBaggagecatalog(data);
                                //     this.loaderProgress.hideLoader();
                                //     this._shared.SetSegmentDetail(PassengerArray);
                                //     this._shared.SetBagTag(null);
                                //     this.navigateToCheckIn();
                                // }, err => {
                                //     this.loaderProgress.hideLoader();
                                //     console.log(err)
                                //     let error: any = { "Errors": [{ "Message": err }], "Success": false }
                                //     this._shared.SetBaggagecatalog(error);                                   
                                //     this._shared.SetSegmentDetail(PassengerArray);
                                //     this._shared.SetBagTag(null);
                                //     this.navigateToCheckIn();
                                // });

                                //Tier
                                // this._dataService.Tier(setdepartureDate, setflightnumber, setcity)
                                //     .subscribe((data) => {
                                //         let tier: any = data;
                                //         this._shared.SetTier(tier);
                                //         this.loaderProgress.hideLoader();
                                //         this._shared.SetSegmentDetail(PassengerArray);
                                //         this.navigateToCheckIn();
                                //     });

                            }
                            else {
                                this.loaderProgress.hideLoader();
                                if (data.Segments != null && data.Segments.length > 0) {
                                    Toast.makeText("Not able to process - go to counter").show();
                                } else {
                                    Toast.makeText("No reservations are found").show();
                                }
                            }
                        } else {
                            Toast.makeText("Not able to process - go to counter").show();
                            this.loaderProgress.hideLoader();
                        }
                    }
                    else {
                        this.loaderProgress.hideLoader();
                        if (data.Segments != null && data.Segments.length > 0) {
                            Toast.makeText("Not able to process - go to counter").show();
                        } else {
                            Toast.makeText("No reservations are found").show();
                        }
                    }
                },
                    err => {
                        console.log(err);
                        this.handleServiceError(err);
                        // var errorMessage = err.toString();
                        // if (errorMessage.indexOf("Unrecognized token '<'") != -1) {
                        //     var options = {
                        //         title: "Session Time Out",
                        //         message: "Your session has been time out",
                        //         okButtonText: "OK"
                        //     };
                        //     dialogs.alert(options).then(() => {

                        //         this.navigateTologin();

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
            // console.log('Get Passenger Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }

    }

    toggleChecked(args: any) {
        console.log(args);
        this.PassengerList.forEach((element, index) => {
            element.IsChecked = false;
            this.checkedCount--;
        });
        var pax = <DeparturePaxList>args.view.bindingContext;
        pax.IsChecked = true;
        this.checkedCount = 1;
        this.orderID = pax.OrderId;
        args.view.bindingContext = pax;

    }

    gotoCheckIn() {
        this.GetOrderDetails(this.orderID);
    }
    navigateToCheckIn() {
        this.routerExtensions.navigate(["checkin"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "data": this.orderID
            }
        })
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
    navigateToDepartureall() {
        this.routerExtensions.navigate(["departall"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    }
    public selectSegment(e: any) {
        console.log("inside");

        var selInd = e.newIndex;
        // var tabtc = this.tabcheckin.nativeElement;
        // var taba = <StackLayout>this.tabnotcheckin.nativeElement;
        if (selInd == 0) {
            this.NewPassengerList = this.CheckedInPassengerList;


        } else {

            this.NewPassengerList = this.NotCheckedInPassengerList;



        }
    }
    // loader(args:ItemEventData){
    //     console.log("loded");
    //     this.loaderProgress.hideLoader();
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
