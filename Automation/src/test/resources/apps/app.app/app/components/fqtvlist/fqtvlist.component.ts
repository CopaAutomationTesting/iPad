//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { ObservableArray } from "data/observable-array";
import { Page } from "ui/page";
import { GestureEventData } from "ui/gestures";
import { ListView, ItemEventData } from "ui/list-view";
import * as dialogs from "ui/dialogs"
import * as gestures from "ui/gestures";

//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as Toast from 'nativescript-toast';
import * as moment from "moment";

//app references
import { FQTV, Order } from '../../shared/model/index';
import { FQTVInfo } from "../../shared/interface/index";
import { DataService, CheckinOrderService, PassengerService, CheckinService, SearchService } from "../../shared/services/index";
import { Converters } from "../../shared/utils/index";
import { Configuration } from '../../app.constants';
import { AppExecutiontime } from "../../app.executiontime";
import { LoaderProgress } from '../../shared/interface/index';
@Component({
    selector: "list-page",
    providers: [DataService, PassengerService, Configuration, CheckinService, SearchService],
    templateUrl: "./components/fqtvlist/fqtvlist.component.html",
    styleUrls: ["./components/fqtvlist/fqtvlist.component.css"]
})


export class FqtvListComponent implements OnInit {
    isError: boolean;
    errorMessage: string;
    public FQTVArray: Array<FQTVInfo>;
    public searchString: string;
    public userdetails: any;
    public loaderProgress: LoaderProgress;
    public orderID: string;
    public FqtvSearchString: string;
    public isCompensationEnabled: boolean = false;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    @ViewChild('pagecontainer') pageCont: ElementRef;

    constructor(public _search: SearchService, public _checkin: CheckinService, private page: Page, private routerExtensions: RouterExtensions, private router: Router, private location: Location, public _dataService: DataService, private activatedRouter: ActivatedRoute, public _service: PassengerService, public _shared: CheckinOrderService) {
        this.isError = false;
        this.errorMessage = "";
        this.loaderProgress = new LoaderProgress();
    }

    ngOnInit() {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        console.log("inside fqtv search");
        this.loaderProgress.initLoader(this.pageCont);
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled", );
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled", );
        this.activatedRouter.queryParams.subscribe((params) => {
            this.FQTVArray = JSON.parse(params["data"]);
            this.searchString = params["fqtvnum"];
            this.FqtvSearchString = this.searchString.toLocaleUpperCase();
        });
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled", );
        // this.getPaxbyFQTVID(this.searchString);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this._shared.SetBagTag(null);        
    }

    getPaxbyFQTVID(id: string): void {
        this.loaderProgress.showLoader();
        try {
            var sDate = new Date();
            console.log('SearchPaxByFQTVID Service --------------- Start Date Time : ' + sDate);
            console.log("getPaxbyFQTVID called " + id);
            this._search.SearchPaxByFQTVID(id)
                .subscribe((data) => {
                    this.FQTVArray = Converters.ConvertToFQTVTemplate(<FQTV.RootObject>data);
                    if (this.FQTVArray == null || this.FQTVArray.length == 0) {
                        var self = this;
                        Toast.makeText("Record Not Found").show();
                        this.navigateToSearch();
                    }

                    this.loaderProgress.hideLoader();
                },
                error => {
                    var self = this;
                    this.handleServiceError(error);
                    this.navigateToSearch();
                    console.log("Couldnt find information for this OrderID " + error);
                },
                () => {
                    //console.log('Data Retrievesuccessfully' + this.PassengerDetails);     
                    //console.log(this.PassengerArray.length);             
                    this.loaderProgress.hideLoader();
                }
                )
        }
        catch (error) {
            console.log(error.message)
        }
        finally {
            var eDate = new Date();
            console.log('SearchPaxByFQTVID Service --------------- End Date Time : ' + eDate);
            console.log('SearchPaxByFQTVID Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    }

    toggleChecked(args: ItemEventData) {
        this.FQTVArray.forEach((element, index) => {
            element.IsChecked = false;
        });
        var pax = <FQTVInfo>args.view.bindingContext;
        pax.IsChecked = true;
        this.orderID = pax.OrderID;
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
                                                    this.navigateToCheckin();

                                                }
                                            } else {
                                                Toast.makeText(data.Warnings[0].Message).show();
                                                let passengerLength = PassengerArray.Segment.length - 1;
                                                if (passengerLength == SegInndex) {
                                                    this._shared.SetBagTag(null);
                                                    this._shared.SetSegmentDetail(PassengerArray);
                                                    this.loaderProgress.hideLoader();
                                                    this.navigateToCheckin();
                                                    
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

    gotoCheckIn() {

        this.GetOrderDetails(this.orderID);
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

    navigateToCheckin() {
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
        });
    }

    navigateToItinerary() {
        this.routerExtensions.navigate(["checkin"], {
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
