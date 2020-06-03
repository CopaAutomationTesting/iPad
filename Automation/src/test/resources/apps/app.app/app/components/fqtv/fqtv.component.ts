//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { Page } from "ui/page";
import * as dialogs from "ui/dialogs"
import { ListView, ItemEventData } from "ui/list-view";
import * as gestures from "ui/gestures";

//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as moment from "moment";
import * as Toast from "nativescript-toast";

//app references
import { Passenger, Order, Inventory, FQTV, Departures } from "../../shared/model/index"
import { DataService, CheckinOrderService, PassengerService, TimeOutService, CheckinService } from "../../shared/services/index";
import { PaxTemplate, MultiSegmentTemplate, PassengerCheckin, InBound, OutBound, FlightInfo, FQTVInfo, FQTVPro, CheckInPostTemplate, DepartureInfo, LoaderProgress, PassengerList } from '../../shared/interface/index';
import { Converters } from "../../shared/utils/index";
import { CreatingListPickComponent } from "../../components/fqtv-modal/fqtv-modal";
import { Configuration } from '../../app.constants';



@Component({
    selector: "fqtv-page",
    providers: [DataService, Configuration, PassengerService, CheckinService],
    templateUrl: "./components/fqtv/fqtv.component.html",
    styleUrls: ["./components/fqtv/fqtv.component.css"]
})


export class FqtvComponent implements OnInit {
    @ViewChild('pagecontainer') pageCont: ElementRef;
    isError: boolean;
    errorMessage: string;
    public index: any;
    loaderProgress: LoaderProgress;
    //    public PassengerList: Array<PaxTemplate> = [];
    PassedPassengerDetail: MultiSegmentTemplate.Passenger = new MultiSegmentTemplate.Passenger();
    public AllPassengerDeatils: any;
    public airlineprogramcode: any;
    public fqtvnum: any;
    public fqtv1: any;
    public userdetails: any;
    public fqtv2: FQTVPro.RootObject = new FQTVPro.RootObject();
    public fqtv: Array<string> = [];
    public fullname: any;
    public tier: any;
    public star: any = "";
    public fqtvProgramID: any = "CM";
    private date: string;
    public SelectedPassengerList: Array<PassengerCheckin.SelectedPassenger>;
    public OrderId: string;
    public isButtonEnabled: boolean;
    public FQTVList: Array<string> = [];
    public isFqtvEmpty: boolean;
    public isCompensationEnabled: boolean = false;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    public FlightInfo: MultiSegmentTemplate.FlightWithPax = new MultiSegmentTemplate.FlightWithPax;
    public MultiSegmentPaxArray: MultiSegmentTemplate.RootObject = new MultiSegmentTemplate.RootObject;
    public FlightDate: any;
    // public SelectedPassengerList: Array<PassengerCheckin.SelectedPassenger>;
    public PassengerArray: any;
    public SegmentList: any;

    constructor(public _checkin: CheckinService, private page: Page, public _timeoutService: TimeOutService, public _service: PassengerService, private routerExtensions: RouterExtensions, private _modalService: ModalDialogService, public _dataService: DataService, private router: Router, private location: Location, private activatedRouter: ActivatedRoute, private vcRef: ViewContainerRef,
        public _shared: CheckinOrderService) {
        this.isError = false;
        this.loaderProgress = new LoaderProgress();
        this.errorMessage = "";
        this.isButtonEnabled = false;
        this.SelectedPassengerList = [];
    }

    ngOnInit() {

        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.date = moment(new Date()).format("DD MMM YYYY");
        this.loaderProgress.initLoader(this.pageCont);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled");
        this.activatedRouter.queryParams.subscribe((params) => {
            try {
                var RPHValue = JSON.parse(params["RPHValue"]);
                this.index = JSON.parse(params["index"]);
                this.MultiSegmentPaxArray = this._shared.GetSegmentDetail();
                this.MultiSegmentPaxArray.Segment.forEach((data, index) => {
                    if (data.MarketingFlight == this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight) {
                        this.FlightInfo = data;
                    }
                });
                this.FlightDate = moment(this.MultiSegmentPaxArray.Segment[this.index].FlightDate).format("DD-MMM-YYYY");
                this.PassedPassengerDetail = this.MultiSegmentPaxArray.Segment[this.index].Passenger.filter(m => m.RPH == RPHValue)[0];
                console.dir(this.PassedPassengerDetail);
                //this.Tier();
                this.FQTV();
                this.fullname = this.PassedPassengerDetail.FullName;
                this.fqtvnum = this.PassedPassengerDetail.FQTVNumber;
                this.PassengerArray = this.MultiSegmentPaxArray.Segment;
                this.SegmentList = this.MultiSegmentPaxArray.Segment[this.index];
                let obj = new PassengerCheckin.SelectedPassenger();
                obj.FirstName = this.PassedPassengerDetail.FirstName;
                obj.LastName = this.PassedPassengerDetail.LastName;
                this.SelectedPassengerList.push(obj);
                let fqtvProgramName: string = "";
                if (this.PassedPassengerDetail.ProgramIDxx != "") {
                    if (this.MultiSegmentPaxArray.Segment[this.index].Passenger[0].FqtvPrograms.filter(m => m.ProgramID == this.PassedPassengerDetail.ProgramIDxx)[0] != null) {
                        fqtvProgramName = this.MultiSegmentPaxArray.Segment[0].Passenger[0].FqtvPrograms.filter(m => m.ProgramID == this.PassedPassengerDetail.ProgramIDxx)[0].ProgramName;
                    }
                }
                else {
                    fqtvProgramName = "CM/Copa Airlines";
                }

                if (this.MultiSegmentPaxArray.Segment[0] != null) {
                    console.log(fqtvProgramName);
                    if (fqtvProgramName != "") {
                        this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((PaxData, PaxIndex) => {
                            console.log("FQTV Programe Name" + PaxData.FqtvPrograms.length);
                            this.fqtvProgramID = PaxData.FqtvPrograms.filter(m => m.ProgramName == fqtvProgramName)[0].ProgramID;
                        })
                        this._shared.GetPassenger().Passengers.forEach((element, index) => {
                            if (element.Firstname == this.PassedPassengerDetail.FirstName && element.Lastname == this.PassedPassengerDetail.LastName) {
                                //element.FqtTravelers[0].ProgramID = this.fqtvProgramID;
                                this.tier = '-';
                                if (element.FqtTravelers != null && element.FqtTravelers.length > 0) {
                                    if (element.FqtTravelers[0].AllianceTierLevel.Name != null && element.FqtTravelers[0].AllianceTierLevel != null) {
                                        this.tier = element.FqtTravelers[0].TierLevel.Name;
                                        this.star = element.FqtTravelers[0].AllianceTierLevel.Name;
                                        console.log(this.star);

                                    } else {
                                        this.tier = element.FqtTravelers[0].TierLevel.Name;
                                    }
                                }
                            }
                        })
                    }

                }
                this.OrderId = this.MultiSegmentPaxArray.Segment[this.index].Passenger[0].OrderID;
                this.airlineprogramcode = fqtvProgramName;

                console.log("Airlineprogramcode:" + this.airlineprogramcode);
                console.log(this.fqtvnum);
            }
            catch (Exception) {
                console.log(Exception.message);
            }
        });
        var label = this.pageCont.nativeElement
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args: gestures.GestureEventData) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();

        });
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
                    // this.loaderProgress.hideLoader();

                });

            //Inbound
            this._checkin.InBound(departureDate, flightnumber, city)
                .subscribe((data) => {
                    let inBound: any = data;
                    SegEle.inbound = Converters.ConvertToInBound(inBound);
                }, error => {
                    this.handleServiceError(error);
                    console.log(error);
                    // this.loaderProgress.hideLoader();

                })

            //Outbound
            this._checkin.OutBound(departureDate, flightnumber, destination)
                .subscribe((data) => {
                    let OutBound: any = data;
                    SegEle.outbound = Converters.ConvertToOutBound(OutBound);
                }, error => {
                    this.handleServiceError(error);
                    console.log(error);
                    // this.loaderProgress.hideLoader();

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
                    // this.loaderProgress.hideLoader();

                })

        });
    }
    FQTV(): void {
        this.fqtv1 = this._shared.GetFQTV();
        this.fqtv.length = 0;
        this.MultiSegmentPaxArray.Segment.forEach((SegEle, SegIndex) => {
            SegEle.Passenger.forEach((PaxEle, PaxIndex) => {
                PaxEle.FqtvPrograms = Converters.ConvertToFQTV(this.fqtv1);
                console.dir(PaxEle.FqtvPrograms);
            })
        })
        this.MultiSegmentPaxArray.Segment[this.index].Passenger[0].FqtvPrograms.forEach((data, index) => {
            this.FQTVList.push(data.ProgramName);
        })
    }

    Tier(): void {

        var date = this.MultiSegmentPaxArray.Segment[this.index].DepartureDateTime.toString();
        var tierDate = date.substr(0, 10);
        var flightnumber = this.MultiSegmentPaxArray.Segment[this.index].MarketingFlight;
        var city = this.MultiSegmentPaxArray.Segment[this.index].DepartureCity;
        this._dataService.Tier(tierDate, flightnumber, city)
            .subscribe((data) => {
                this.AllPassengerDeatils = data;
                this.AllPassengerDeatils.PassengerList.forEach((Paxdata, index) => {
                    if (this.PassedPassengerDetail.OrderID == Paxdata.OrderId) {
                        if (Paxdata.FqtTravelers == null) {
                            this.tier = "-";
                        }
                        this.tier = Paxdata.FqtTravelers[0].Allia;
                    }
                })

            }, error => {
                this.handleServiceError(error);
                console.log(error);
                this.loaderProgress.hideLoader();

            })

    }
    confirmUpdate(id: string) {
        if (this._shared.GetBagTag() != null) {
            dialogs.confirm("Updating FQTV information would cause any pending transaction to be invalid. Baggage would need to be re-entered and re-priced").then(result => {
                console.log(result);
                if (result) {
                    this._shared.SetBagTag(null);
                    this.FQTVUpdate(id);
                }
            })
        } else {
            this.FQTVUpdate(id);
        }
    }

    FQTVUpdate(id: string) {
        try {
            this.loaderProgress.showLoader();
            var PassengerArray = this.MultiSegmentPaxArray.Segment;
            var SegmentList = this.MultiSegmentPaxArray.Segment[this.index];
            SegmentList.Passenger.filter(m => m.RPH === this.PassedPassengerDetail.RPH)[0].FQTVNumber = this.PassedPassengerDetail.FQTVNumber;
            SegmentList.Passenger.filter(m => m.RPH === this.PassedPassengerDetail.RPH)[0].ProgramIDxx = this.airlineprogramcode.substr(0, 2);
            console.log(this.SelectedPassengerList);
            var rcheckreq: CheckInPostTemplate.RootObject = Converters.ConvertToCheckInPostTemplate(PassengerArray, "CheckIn", this.SelectedPassengerList, SegmentList, "UpdatePassengerInfo", "", this._shared.GetBagTag());
            console.log(rcheckreq);
            this._checkin.CheckInPaxWithFqtv(rcheckreq).subscribe((data) => {
                if(data.Warnings){
                    data.Warnings.forEach((message,index)=>{
                        Toast.makeText(message.Message).show();
                    })
                }
                if(data.Errors){
                    data.Errors.forEach((message,index)=>{
                        Toast.makeText(message.Message).show();
                    })
                }
                this.GetOrderDetails(this.PassedPassengerDetail.OrderID);
            }), err => {

                console.log(err)
                this.handleServiceError(err);
                this.loaderProgress.hideLoader();
            },
                () => {

                };

        } catch (Exception) {
            console.log(Exception.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            // this.loaderProgress.hideLoader();
            var eDate = new Date();
            console.log('Get Passenger Service --------------- End Date Time : ' + eDate);
            // console.log('Get Passenger Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));

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
                    this.loaderProgress.hideLoader();
                    this.navigateToCheckin();
                },
                    err => {
                        console.log(err)
                        this.loaderProgress.hideLoader();
                        this.navigateToCheckin();
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

    displayFQTVActionDialog() {

        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: this.FQTVList,
            fullscreen: false

        };
        this._modalService.showModal(CreatingListPickComponent, options).then((result) => {
            if (result) {
                this.airlineprogramcode = result;
            }
        });
    }

    Submit() {
        var Segment = this._shared.GetPassenger();
        console.log("V1");
        Segment.Passengers.forEach((paxEle, paxindex) => {
            this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((data, index) => {
                if (data.RPH == paxEle.RPH) {
                    if (paxEle.FqtTravelers != []) {
                        paxEle.FqtTravelers.forEach((Fqtvele, fqtvIndex) => {
                            console.log("New" + JSON.stringify(this.fqtvnum));
                            Fqtvele.MembershipID = this.fqtvnum;
                            Fqtvele.ProgramID = this.airlineprogramcode.toString().substr(0, 2);
                        });
                    }
                }
            });
        });

        this._shared.SetPassenger(Segment);
        // this.GetOrderDetails(this.OrderId);
        // this.MultiSegmentPaxArray.Segment[this.index].Passenger.forEach((data, index) => {
        //      if (data.RPH == this.PassedPassengerDetail.RPH){
        //          data.FQTVNumber = this.fqtvnum;
        //          data.ProgramIDxx = this.airlineprogramcode;
        //      }
        //     });
        // console.dir(this.MultiSegmentPaxArray.Segment[this.index]);            
        this.navigateToCheckin();

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
                "data": this.OrderId,
                "index": this.index


            }
        });
    }
    onChange(args: any, index: any) {
        this._timeoutService.resetWatch();
        switch (index) {
            case 0:
                this.isFqtvEmpty = false;
                var reg = new RegExp('^[a-zA-Z0-9]*$');
                var test = reg.test(this.PassedPassengerDetail.FQTVNumber);
                if (test == false) {
                    this.isFqtvEmpty = true;
                    Toast.makeText("Please enter valid fqtv number").show();
                }
                else this.isFqtvEmpty = false;
                break;
            default:
        }
        if (test == true && this.PassedPassengerDetail.FQTVNumber.length > 4 && this.PassedPassengerDetail.FQTVNumber != null) {
            this.isButtonEnabled = true;
        } else {
            this.isButtonEnabled = false;
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
