//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { ObservableArray } from "data/observable-array";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { GestureEventData } from "ui/gestures";
import { ListView, ItemEventData } from "ui/list-view";
import * as gestures from "ui/gestures";
import * as dialogs from "ui/dialogs";

//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as Toast from 'nativescript-toast';
import * as moment from "moment";

//app references
import { LoaderProgress, order, PassengerListTemplate, PassengerList } from "../../shared/interface/index"
import { Search, Passenger, Order } from "../../shared/model/index"
import { DataService, CheckinOrderService, PassengerService, TimeOutService,CheckinService } from "../../shared/services/index";
import { Converters } from "../../shared/utils/index";
import { Configuration } from '../../app.constants';



@Component({
    selector: "search-page",
    providers: [DataService, Configuration, PassengerService,CheckinService],
    templateUrl: "./components/searchresult/searchresult.component.html",
    styleUrls: ["./components/searchresult/searchresult.component.css"]
})


export class SearchResultComponent implements OnInit {
    public isError: boolean;
    public errorMessage: string;
    public loaderProgress: LoaderProgress;
    public orderID: string;
    public checkedCount: number = 0;

    public PassengerDetails: any;
    public PassengerListOld: Array<PassengerListTemplate>;
    public PassengerList: Array<PassengerList> = [];
    public nl: any;
    public SearchFields: Search = new Search();
    public userdetails: any;
    public Profile: any;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    public isCompensationEnabled: boolean = false;  
    
    @ViewChild('pagecontainer') pageCont: ElementRef;

    public paxList: Array<Passenger>;

    constructor(public _checkin:CheckinService,private page: Page, public _timeoutService: TimeOutService, private routerExtensions: RouterExtensions, public _dataService: DataService, private router: Router, private location: Location, private activatedRouter: ActivatedRoute, public _shared: CheckinOrderService, public _service: PassengerService, ) {
        this.isError = false;
        this.errorMessage = "";
        this.paxList = [];
        this.loaderProgress = new LoaderProgress();
    }

    ngOnInit() {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.loaderProgress.initLoader(this.pageCont);
        this.loaderProgress.showLoader('Loading Data...');
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled", );
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled", );
        this.activatedRouter.queryParams.subscribe((params) => {
            if (params["profile"] != null && params["profile"] != "" && params["profile"] != "undefined") {
                this.Profile = params["profile"];
            }
        });
        // this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled", );
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled", );
        this.getPassangerList();
        this._shared.SetBagTag(null);        
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.loaderProgress.hideLoader();
        var label = this.pageCont.nativeElement
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args: gestures.GestureEventData) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();

        });

    }

    private getPassangerList() {
        this.location.subscribe(() => {
            this.SearchFields = JSON.parse(ApplicationSettings.getString("searchdata", ""));
            this.activatedRouter.queryParams.subscribe((params) => {
                this.PassengerList = JSON.parse(params["data"]);

            });
        });

        this.SearchFields = JSON.parse(ApplicationSettings.getString("searchdata", ""));
        this.activatedRouter.queryParams.subscribe((params) => {
            this.PassengerList = JSON.parse(params["data"]);

        });
        

        // let multiplePassenger:number = 0;
        // this.PassengerList.forEach((pass,index)=>{
        //     if(this._shared.GetAPISDocument()!=null)
        //     {
        //         if (this._shared.GetAPISDocument().Firstname.replace(" ", "") == this.SuffixCheck(pass.FirstName) && this._shared.GetAPISDocument().Surname.replace(" ", "") == pass.LastName) {
        //             multiplePassenger++;
        //         }
        //     }
        // });
        // if(multiplePassenger > 1)
        // {
        //     Toast.makeText("Multiple match found. Scanned data is ignored").show();
        //     this._shared.SetAPISDocument(null);
        // }
    }

    SuffixCheck(firstName:string):string{
        let suffixList = firstName.split(this._shared.GetAPISDocument().Firstname.replace(" ", ""));
        let givenName:string = ''
        if(suffixList.length > 1)
        {
            givenName = this._shared.GetAPISDocument().Firstname.replace(" ", "");
        }
        else
        {
            givenName = firstName;
        }
        return givenName;
    }
    GetOrderDetails(id: string): void {
        this.loaderProgress.showLoader();
        try {
            var sDate = new Date();
            console.log('Get Passenger Service --------------- Start Date Time : ' + sDate);
            this._service.GetPassenger(id)
                .subscribe(data => {
                    //console.dir(data);
                    if (data.ID != null) {
                        if (data.TicketingStatus != "Not Ticketed" && data.TicketingStatus !="Partially Ticketed" && data.IsOutOfSyncTicket != true) {    
                            if (data.Segments != null && data.Segments.length > 0) {
                                var POSLocation = ApplicationSettings.getString("userdetails", "").substr(0, 3);
                                if (data.Segments.filter(m => m.Origin.AirportCode == POSLocation).length>0 &&data.Segments.filter(m => m.Origin.AirportCode == POSLocation)[0].Status.isWaitlistedPassenger) {
                                    this._shared.SetIsWaitlisted(true);
                                    Toast.makeText("Waitlisted Passenger").show();
                                }
                                else
                                {
                                    this._shared.SetIsWaitlisted(false);
                                    console.log("isWaitlistedPassenger : false")
                                }
                            }                        
                        this._shared.SetPassenger(<Order.RootObject>data);
                        console.dir(this._shared.GetPassenger().Passengers[0].Documents);
                        let scTable:any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
                        let PassengerArray: any = Converters.ConvertToFlightWithPaxTemplate(this._shared.GetPassenger(), null,scTable,"");
                        if (PassengerArray.Segment.length > 0) {
                            let setdepartureDate: string = moment(PassengerArray.Segment[0].DepartureDateTime.toString()).format("YYYY-MM-DD");
                            let setflightnumber: string = PassengerArray.Segment[0].MarketingFlight;
                            let setcity: string = PassengerArray.Segment[0].DepartureCity;

                            PassengerArray.Segment.forEach((SegEle, SegInndex) => {

                                let departureDate: string = moment(SegEle.DepartureDateTime.toString()).format("YYYY-MM-DD");
                                let flightnumber: string = SegEle.MarketingFlight;
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
                                this._dataService.Status(departureDate, flightnumber,city)
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
                                                this._shared.GetPassenger().Passengers.forEach((pass, index) => {
                                                    if (this._shared.GetAPISDocument() != null) {
                                                        if (this._shared.GetAPISDocument().Firstname.replace(" ", "") == this.SuffixCheck(pass.Firstname) && this._shared.GetAPISDocument().Surname.replace(" ", "") == pass.Lastname) {
                                                            multiplePassenger++;
                                                        }
                                                    }
                                                });
                                                if (multiplePassenger > 1) {
                                                    Toast.makeText("Multiple match found. Scanned data is ignored").show();
                                                    this._shared.SetAPISDocument(null);
                                                }
                                                else {
                                                    this.loaderProgress.hideLoader();
                                                    this.navigateToCheckin();
                                                }
                                            }
                                        } else {
                                            Toast.makeText(data.Warnings[0].Message).show();
                                            let passengerLength = PassengerArray.Segment.length - 1;
                                            if (passengerLength == SegInndex) {
                                                this._shared.SetBagTag(null);
                                                this._shared.SetSegmentDetail(PassengerArray);
                                                let multiplePassenger: number = 0;
                                                this._shared.GetPassenger().Passengers.forEach((pass, index) => {
                                                    if (this._shared.GetAPISDocument() != null) {
                                                        if (this._shared.GetAPISDocument().Firstname.replace(" ", "") == this.SuffixCheck(pass.Firstname) && this._shared.GetAPISDocument().Surname.replace(" ", "") == pass.Lastname) {
                                                            multiplePassenger++;
                                                        }
                                                    }
                                                });
                                                if (multiplePassenger > 1) {
                                                    Toast.makeText("Multiple match found. Scanned data is ignored").show();
                                                    this._shared.SetAPISDocument(null);
                                                }
                                                else {
                                                    this.loaderProgress.hideLoader();
                                                    this.navigateToCheckin();
                                                }
                                            }
                                        }


                                    }, err => {
                                        console.log(err);
                                       
                                        this.loaderProgress.hideLoader();
                                        this.handleServiceError(err);
                                        
                                    
                                    })

                            });

                            // this._dataService.GetBaggage(id).subscribe((data) => {
                            //     this._shared.SetBaggagecatalog(data);
                            // });

                            //Tier
                            // this._dataService.Tier(setdepartureDate, setflightnumber, setcity)
                            //     .subscribe((data) => {
                            //         let tier: any = data;
                            //         this._shared.SetTier(tier);
                            //         this.loaderProgress.hideLoader();
                            //         this._shared.SetSegmentDetail(PassengerArray);
                            //         this.navigateToCheckin();
                            //     });

                        }
                        else {
                            this.loaderProgress.hideLoader();
                            Toast.makeText("No reservations are found").show();
                        }
                        }else{
                            Toast.makeText("Not able to process - go to counter").show();
                            this.loaderProgress.hideLoader();                                                       
                        }

                    }
                    
                    else {
                        this.loaderProgress.hideLoader();
                        Toast.makeText("No reservations are found").show();
                    }
                }
                ,
                err => {
                    console.log(err);
                    this.handleServiceError(err);
                    // if (err.indexOf("Unrecognized token '<'") != -1) {
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


    // GetOrderDetails(id: string): void {
    //     this.loaderProgress.showLoader();
    //     try {
    //         var sDate = new Date();
    //         console.log('Get Passenger Service --------------- Start Date Time : ' + sDate);
    //         this._service.GetPassenger(id)
    //             .subscribe(data => {
    //                 this._shared.SetPassenger(<Order.RootObject>data);
    //                 let PassengerArray: any = Converters.ConvertToPassengerTemplate(this._shared.GetPassenger(), null);
    //                 if (PassengerArray.length > 0) {
    //                     let departureDate: string = moment(PassengerArray[0].FlightDetails[0].DepartureDateTime.toString()).format("YYYY-MM-DD");
    //                     let flightnumber: string = PassengerArray[0].FlightDetails[0].MarketingFlight;
    //                     let city: string = PassengerArray[0].FlightDetails[0].DepartureCity;
    //                     //Inventory
    //                     this._dataService.Inventory(departureDate, flightnumber)
    //                         .subscribe((data) => {
    //                             let inventory: any = data;
    //                             this._shared.SetInventory(inventory);
    //                         })
    //                     //Inbound
    //                     this._dataService.InBound(departureDate, flightnumber, city)
    //                         .subscribe((data) => {
    //                             let inBound: any = data;
    //                             this._shared.SetInbound(inBound);
    //                         })

    //                     //Outbound
    //                     this._dataService.OutBound(departureDate, flightnumber, city)
    //                         .subscribe((data) => {
    //                             let OutBound: any = data;
    //                             this._shared.SetOutbound(OutBound);
    //                         })

    //                     //status
    //                     this._dataService.Status(departureDate, flightnumber)
    //                         .subscribe((data) => {
    //                             let status: any = data;
    //                             this._shared.SetStatus(status);
    //                         })

    //                     //Tier
    //                     this._dataService.Tier(departureDate, flightnumber, city)
    //                         .subscribe((data) => {
    //                             this._shared.SetTier(data);
    //                             this.loaderProgress.hideLoader();
    //                             this.navigateToCheckin();
    //                         });
    //                 }
    //                 else {
    //                     this.loaderProgress.hideLoader();
    //                     Toast.makeText("Record Not Found").show();
    //                 }

    //             },
    //             err => {
    //                 console.log(err)
    //                 this.loaderProgress.hideLoader();
    //             });
    //     }
    //     catch (error) {
    //         console.log(error.message);
    //         this.loaderProgress.hideLoader();
    //     }
    //     finally {
    //         var eDate = new Date();
    //         console.log('Get Passenger Service --------------- End Date Time : ' + eDate);
    //     }

    // }

    toggleChecked(args: ItemEventData) {
        var pax = <PassengerListTemplate>args.view.bindingContext;
        if (pax.IsChecked) {
            pax.IsChecked = false;
            this.checkedCount--;
        } else {
            if (this.orderID) {
                this.checkedCount++;
                if (pax.OrderID === this.orderID) {
                    pax.IsChecked = true;
                } else {
                    this.orderID = pax.OrderID;
                    this.PassengerList.forEach((element, index) => {
                        element.IsChecked = false;
                    });
                    pax.IsChecked = true;
                    this.checkedCount = 1;
                }
            } else {
                this.orderID = pax.OrderID;
                pax.IsChecked = true;
                this.checkedCount++;
            }
        }
        console.log("checkedCount: " + this.checkedCount)
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


    gotoCheckin() {
        if (this.checkedCount > 0) {
            var PaxList = Array<PassengerList>();
            PaxList = [];
            this.PassengerList.forEach((element, index) => {
                if (element.IsChecked) PaxList.push(element);
            });
            this.GetOrderDetails(this.orderID);
        } else {
            Toast.makeText("Please select atleast one Passengers").show();
        }
    }
    navigateToCheckin() {
        var profile: string = this.Profile
        this.routerExtensions.navigate(["checkin"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "data": this.orderID,
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
        }else{
            Toast.makeText("Compensation Not applicable").show();
        }
    }
}