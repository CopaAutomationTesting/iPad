//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { Page } from "ui/page";
import * as frame from "ui/frame";
import { GridLayout } from "ui/layouts/grid-layout";
import * as dialogs from "ui/dialogs"

//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as Toast from 'nativescript-toast';
import { didTapScan } from 'nativescript-blinkid'
import * as moment from "moment";
import * as gestures from "ui/gestures";

//app references
import { CreatingListPickerComponent } from "../../components/country/country-modal";
import { LoaderProgress, PassengerListTemplate, PassengerList, AccontProfileModel } from "../../shared/interface/index"
import { FQTVInfo } from '../../shared/interface/index';
import { DataService, CheckinOrderService, PassengerService, DepartureService, HomePageService, SearchService, CheckinService } from "../../shared/services/index";
import { Order, CountryCollection, FlightServiceInfo, Flight, Search, AccountProfile, APISDocument, CityCodeCollection } from "../../shared/model/index";
import { Converters } from "../../shared/utils/index";
import { DatePickerModal, DatePicketContext } from "../../components/date-picker/date-picker-modal";
import { Configuration } from '../../app.constants';
import { AppExecutiontime } from "../../app.executiontime";
import { isAndroid, isIOS, device, screen } from "platform";
import { FQTV } from "../../shared/model/index"
import { TimeOutService } from "../../shared/services/timeOut.service";
var licenseKeys = ApplicationSettings.getString("licenseKey", '');
console.log(licenseKeys);
@Component({
    selector: "search-page",
    providers: [DataService, Configuration, ModalDialogService, APISDocument, PassengerService, DepartureService, HomePageService, SearchService, CheckinService],
    templateUrl: "./components/search/search.component.html",
    styleUrls: ["./components/search/search.component.css"]
})

export class SearchComponent implements OnInit {
    @ViewChild('pagecontainer') pageCont: ElementRef;
    public isError: boolean;
    public errorMessage: string;
    public loaderProgress: LoaderProgress;
    public startDate: Date;
    public isLastdirty: boolean;
    public isFlightdirty: boolean;
    public isSearchanydirty: boolean
    public iserror: boolean;
    public PassengerDetails: any;
    public FQTVArray: Array<FQTVInfo>;
    public cityList: Array<CityCodeCollection.CollectionEntity> = [];
    public filterCityList: Array<CityCodeCollection.CollectionEntity> = [];
    public PassengerList: Array<PassengerListTemplate> = [];
    public PassengerListNew: Array<PassengerList> = [];
    public FlightDetails: Flight = new Flight();
    public SearchFields: Search = new Search();
    public ProfileArray: AccontProfileModel.AccountProfileTemplate = new AccontProfileModel.AccountProfileTemplate();
    public ProfileDetails: any;
    public userdetails: any;
    public clearclicked: boolean = false;
    public PassengerDetailsFlight = [];
    public CountryDetails: CountryCollection.Collection;
    public PassengerstringArray = [];
    public name: any;
    public filterCityCode: Array<string> = [];
    public searchOrderID: string;
    public curDate: Date;
    public selectedIndex = 1;
    public items: Array<string>;
    public isAnySearchEmpty: boolean = false;
    public isFlightEmpty: boolean = false;
    public isLastNameEmpty: boolean = false;
    public isButtonEnabled = false;
    public isnumber: boolean;
    public isValid: boolean = false;
    public CountryList: Array<string>;
    public CountryItems: any[];
    public isScanned: boolean = false;
    public AdditionalDocuments: any;
    public isCompensationEnabled: boolean = false;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    public ETKTNumber: string = "";
    constructor(public _checkin: CheckinService, private _search: SearchService, private _homepage: HomePageService, private page: Page, private routerExtensions: RouterExtensions, public _timeoutService: TimeOutService, private activatedRouter: ActivatedRoute, private router: Router, private location: Location, public _dataService: DataService, private _modalService: ModalDialogService, private vcRef: ViewContainerRef, public apisDocument: APISDocument, public _shared: CheckinOrderService, public _service: PassengerService, public departureService: DepartureService) {
        this.isError = false;
        this.errorMessage = "";
        this.SearchFields.FlightDate = moment().format("DD MMMM YYYY");
        this.curDate = moment().toDate();
        this.loaderProgress = new LoaderProgress();
        var self = this;
        this.items = [];
        this.selectedIndex = 0;
        this.startDate = new Date();
        this.CountryList = [];
        this.CountryItems = [];

        this.activatedRouter.queryParams.subscribe((params) => {
            if (params["data"] != null && params["data"] != "" && params["data"] != "undefined") {
                this.ProfileArray = JSON.parse(params["data"]);
                this.SearchFields.Location = this.ProfileArray.PointOfSales[0].AirportCode;
                this.userdetails = ApplicationSettings.getString("userdetails", "");
            }
        })

    }


    ngOnInit() {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        for (var i = 0; i < 5; i++) {
            this.items.push("data item " + i);
        }
        this.location.subscribe(() => {
            this.selectedIndex = 1;
        })
        this.cityList = this._shared.getCityList();
        this.cityList.forEach((data, index) => {
            this.filterCityCode.push(data.Code + "-" + data.Name);
        })
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        var Location = ApplicationSettings.getString("userdetails", "");
        this.SearchFields.Location = Location.substr(0, 3);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled");
        this.selectedIndex = 1;
        this.loaderProgress.initLoader(this.pageCont);
        this.GetCountry();
        this.GetFQTV();
        this._shared.GetStartupTable();
        this._shared.SetBagTag(null);
        console.dir(this._shared.GetStartupTable());
        console.log(this._timeoutService.getTimer());
        var label = this.pageCont.nativeElement
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args: gestures.GestureEventData) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();

        });
        this.getDocumentType();

    }
    getDocumentType() {
        console.log("doctype");
        this._dataService.documentType().subscribe(data => {
            this.AdditionalDocuments = data.ReferenceInfo[0].AdcDocumentsToAppend;

            console.log("doctype" + this.AdditionalDocuments)
            this._shared.SetAdditionalDocuments(this.AdditionalDocuments);
        }, err => {
            this.handleServiceError(err);
            console.log(err)
        })
    }
    displayCityListActionDialog() {
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: [{ country: this.filterCityCode }],
            fullscreen: false
        };

        this._modalService
            .showModal(CreatingListPickerComponent, options)
            .then(result => {
                console.log("date result " + result);
                if (result) {
                    this.SearchFields.Location = result.substr(0, 3);
                    console.log("out" + result);
                }
            });
    }
    GetCountry(): void {

        try {
            var sDate = new Date();
            console.log('Get Countries Service --------------- Start Date Time : ' + sDate);
            this._service.GetCountries()
                .subscribe(data => {
                    this.CountryDetails = <CountryCollection.Collection>data;
                    this._shared.SetCountry(this.CountryDetails);
                },
                    err => {
                        this.handleServiceError(err);
                        console.log(err)
                    });
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
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


    GetOrderDetails(id: string, etktNumber: string = ""): void {
        this.loaderProgress.showLoader();

        try {
            var sDate = new Date();
            console.log('Get Passenger Service --------------- Start Date Time : ' + sDate);
            this._service.GetPassenger(id)
                .subscribe(data => {
                    console.log(data);
                    if (data.ID != null) {
                        if (data.TicketingStatus != "Not Ticketed" && data.TicketingStatus != "Partially Ticketed" && data.IsOutOfSyncTicket != true) {
                            this._shared.SetPassenger(<Order.RootObject>data);
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
                            console.dir(this._shared.GetPassenger().Passengers[0].Documents);
                            // this._shared.GetPassenger().Passengers.forEach((passInfo, passIndex) => {
                            //     if (passInfo.PassengerTypeCode == "INF") {
                            //         let passengers: any = this._shared.GetPassenger().Passengers.filter(m => m.GroupedGivenName == passInfo.GroupedGivenName);
                            //         passengers.forEach((pass, index) => {
                            //             if (pass.PassengerTypeCode != "INF") {
                            //                 let infRPH = this._shared.GetPassenger().Passengers.filter(m => m.PassengerTypeCode == "INF")[0].RPH
                            //                 this._shared.GetPassenger().Passengers.filter(m => m.Firstname == pass.Firstname && m.Lastname == pass.Lastname)[0].AssociatedInfantRPH = infRPH
                            //             }
                            //             else {
                            //                 let adultRPH = this._shared.GetPassenger().Passengers.filter(m => m.PassengerTypeCode != "INF")[0].RPH
                            //                 this._shared.GetPassenger().Passengers.filter(m => m.Firstname == pass.Firstname && m.Lastname == pass.Lastname)[0].AssociatedAdultRPH = adultRPH
                            //             }
                            //         });
                            //     }
                            // })

                            // let scTable:any[] = this._shared.GetStartupTable().Tables.SecurityCodeTable;
                            var isErrorOccured: boolean = false;
                            console.log(this._shared.GetStartupTable().Tables.SecurityCodeTable)
                            let PassengerArray: any = Converters.ConvertToFlightWithPaxTemplate(this._shared.GetPassenger(), null, this._shared.GetStartupTable().Tables.SecurityCodeTable, etktNumber);
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
                                //let departureCity:string=
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
                                    if (!isErrorOccured) {
                                        this._checkin.BookingCountDisplay(departureDate, flightnumber, city)
                                            .subscribe((data) => {
                                                let inventory: any = data;
                                                SegEle.inven = Converters.ConvertToInventory(inventory);
                                            }, err => {
                                                console.log(err);
                                                isErrorOccured = true;
                                                this.loaderProgress.hideLoader();
                                                this.handleServiceError(err);

                                            });

                                        //Inbound
                                        this._checkin.InBound(departureDate, flightnumber, city)
                                            .subscribe((data) => {
                                                let inBound: any = data;
                                                SegEle.inbound = Converters.ConvertToInBound(inBound);
                                            }, err => {
                                                console.log(err);
                                                isErrorOccured = true;
                                                this.loaderProgress.hideLoader();
                                                this.handleServiceError(err);

                                            });

                                        //Outbound
                                        this._checkin.OutBound(departureDate, flightnumber, destination)
                                            .subscribe((data) => {
                                                let OutBound: any = data;
                                                SegEle.outbound = Converters.ConvertToOutBound(OutBound);
                                            }, err => {
                                                console.log(err);
                                                isErrorOccured = true;
                                                this.loaderProgress.hideLoader();
                                                this.handleServiceError(err);

                                            });

                                        //status
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
                                                            this.navigateToCheckin(id);
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
                                                            this.navigateToCheckin(id);
                                                        }
                                                    }
                                                }


                                            }, err => {
                                                console.log(err);
                                                isErrorOccured = true;
                                                this.loaderProgress.hideLoader();
                                                this.handleServiceError(err);

                                            })

                                    } else {
                                        this.loaderProgress.hideLoader();
                                    }
                                });

                                // this._dataService.GetBaggage(id).subscribe((data) => {
                                //     this._shared.SetBaggagecatalog(data);
                                //     console.log("err")
                                // },
                                //     err => {
                                //         console.log(err)
                                //         let error: any = { "Errors": [{ "Message": err }], "Success": false }
                                //         this._shared.SetBaggagecatalog(error);
                                //     });

                                //Tier
                                // this._dataService.Tier(setdepartureDate, setflightnumber, setcity)
                                //     .subscribe((data) => {
                                //         this._shared.SetBagTag(null);
                                //         let tier: any = data;
                                //         this._shared.SetTier(tier);
                                //         this.loaderProgress.hideLoader();
                                //         this._shared.SetSegmentDetail(PassengerArray);
                                //         let multiplePassenger:number = 0;
                                //         this._shared.GetPassenger().Passengers.forEach((pass,index)=>{
                                //             if(this._shared.GetAPISDocument()!=null)
                                //             {
                                //                 if (this._shared.GetAPISDocument().Firstname.replace(" ", "") == this.SuffixCheck(pass.Firstname) && this._shared.GetAPISDocument().Surname.replace(" ", "") == pass.Lastname) {
                                //                     multiplePassenger++;
                                //                 }
                                //             }
                                //         });
                                //         if (multiplePassenger > 1) {
                                //             Toast.makeText("Multiple match found. Scanned data is ignored").show();
                                //             this._shared.SetAPISDocument(null);
                                //         }
                                //         else
                                //         {
                                //             this.navigateToCheckin(id);
                                //         }
                                //     },
                                //     err => {
                                //         console.log(err)
                                //         this.navigateToCheckin(id);
                                //         this._shared.SetSegmentDetail(PassengerArray);
                                //         this.handleServiceError(err);
                                //         this.loaderProgress.hideLoader();
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
                        if (data.Errors != null) {
                            data.Errors.forEach((error, index) => {
                                Toast.makeText(error.Message).show();

                            });
                        } else if (data.Segments != null && data.Segments.length > 0) {
                            Toast.makeText("Not able to process - go to counter").show();
                        } else {
                            Toast.makeText("No reservations are found").show();
                        }
                    }
                }
                    ,
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
    GetPaxbyEticket(id: string): void {
        this.loaderProgress.showLoader();
        this.ETKTNumber = id.toString();
        try {
            var sDate = new Date();
            console.log('Get SearchPaxByEticket Service --------------- Start Date Time : ' + sDate);
            this._search.SearchPaxByEticket(id)
                .subscribe(data => {
                    this._shared.SetPassengerETicket(<Order.RootObject>data);
                    console.dir(data);
                    if (data.ID != null && data.Segments.length > 0) {
                        this.GetOrderDetails(data.ID, this.ETKTNumber);
                    }
                    else {
                        // if (data.Segments.length>0){
                        Toast.makeText("unable to process - Go to counter").show();
                        // }else{
                        // Toast.makeText("No reservations are found").show();                            
                        // }
                        this.loaderProgress.hideLoader();
                    }
                },
                    err => {
                        console.log(err)
                        this.handleServiceError(err)
                        this.loaderProgress.hideLoader();
                    });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('Get SearchPaxByEticket Service --------------- End Date Time : ' + eDate);
            console.log('Get SearchPaxByEticket Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }

    }

    search() {

        ApplicationSettings.setString("searchdata", JSON.stringify(this.SearchFields));
        this.ETKTNumber = "";
        if (this.SearchFields.FlightNo.trim() != "" && this.SearchFields.LastName.trim() != "") {
            if (this.SearchFields.FlightNo.substring(0, 2).toUpperCase() != 'CM') this.SearchFields.FlightNo = "CM" + this.SearchFields.FlightNo;
            this.getPaxbyFlight(this.SearchFields.LastName, moment(this.startDate, "MM/dd/yy").format("YYYY-MM-DD"), this.SearchFields.FlightNo, "PTY");
        }
        else {
            Toast.makeText("Please enter Search strings").show();
        }

    }

    SearchAny() {
        if (this.SearchFields.SearchAny.trim() != "" || this.isAnySearchEmpty == false) {
            if (this.SearchFields.SearchAny.length == 6 || this.SearchFields.SearchAny.length > 0 || this.SearchFields.SearchAny.length == 13 || this.SearchFields.SearchAny.length == 11) {
                if (this.SearchFields.SearchAny.length == 6) {
                    this._shared.SetAPISDocument(null);
                    this._shared.SetScanAPISDocument(null);
                    this.ETKTNumber = "";
                    this.GetOrderDetails(this.SearchFields.SearchAny);
                }
                else if (this.SearchFields.SearchAny.length == 13) {
                    let reg = new RegExp('^[a-zA-Z]+$')
                    if (reg.test(this.SearchFields.SearchAny.toString().substr(0, 1))) {
                        let fqtvnum1 = this.SearchFields.SearchAny.toString().substr(0, 2);
                        let fqtvnum2 = this.SearchFields.SearchAny.toString().substr(2);
                        let fqtvnum3
                        if (fqtvnum2.split('/').length > 1) {
                            fqtvnum3 = fqtvnum1 + "%2F" + fqtvnum2.split('/')[1];
                        } else {
                            fqtvnum3 = fqtvnum1 + "%2F" + fqtvnum2.split('/')[0];
                        }
                        console.log("fqtv" + fqtvnum3);
                        // this.SearchFields.SearchAny = fqtvnum3;
                        this.getPaxbyFQTVID(fqtvnum3);
                    } else {
                        this._shared.SetPassengerETicket(null);
                        this.GetPaxbyEticket(this.SearchFields.SearchAny);
                    }

                }
                // else if (this.SearchFields.SearchAny.length == 12) {
                //     this.loaderProgress.showLoader();
                //     this.ETKTNumber="";
                //     let fqtvnum1 = this.SearchFields.SearchAny.toString().substr(0, 2);

                //     let fqtvnum2 = this.SearchFields.SearchAny.toString().substr(2);
                //     let fqtvnum3 = fqtvnum1 + "%2F" + fqtvnum2.split('/')[1];
                //     console.log("fqtv" + fqtvnum3);
                //     this.SearchFields.SearchAny = fqtvnum3;
                //     this.getPaxbyFQTVID(this.SearchFields.SearchAny);
                //     // this.navigateToFQTV(this.SearchFields.SearchAny);

                // }
                else {
                    this.loaderProgress.showLoader();
                    let reg = new RegExp('^[a-zA-Z]+$')
                    if (reg.test(this.SearchFields.SearchAny.toString().substr(0, 1))) {
                        let fqtvnum1 = this.SearchFields.SearchAny.toString().substr(0, 2);
                        let fqtvnum2 = this.SearchFields.SearchAny.toString().substr(2);
                        let fqtvnum3
                        if (fqtvnum2.split('/').length > 1) {
                            fqtvnum3 = fqtvnum1 + "%2F" + fqtvnum2.split('/')[1];
                        } else {
                            fqtvnum3 = fqtvnum1 + "%2F" + fqtvnum2.split('/')[0];
                        }
                        console.log("fqtv" + fqtvnum3);
                        // this.SearchFields.SearchAny = fqtvnum3;
                        this.getPaxbyFQTVID(fqtvnum3);
                    } else {
                        this.isAnySearchEmpty = true;
                        this.loaderProgress.hideLoader();
                        Toast.makeText("Please enter valid input").show();
                    }
                }
            }
            else {
                this.isAnySearchEmpty = true;
                Toast.makeText("Please enter valid input").show();
            }
        }
    }

    Scan(type: string) {
        if (isIOS) {
            console.log("inside SCAN");
            let lastname: String = "";
            this._shared.SetAPISDocument(null);
            this._shared.SetScanAPISDocument(null);
            // let licenseKey = ApplicationSettings.getString("licenseKey",'');
            let licenseKey = "sRwAAAEjY29tLmNvcGFhaXIuY3NzbW9iaWxlYWlycG9ydHRhYmxldHM4x9IvBwHUD7JcC/TkHlqBmTm5fPOxEbRRIjDctpKRVPpo+4n3YWfd2eH32UCQ1GQsDGDiDQ2nNoFaUYunmhI88WJeuFd/gd8JOxoxrUXvNbPSqdZti7O6p3VBRal0NxV5TZpMHEXG6r/1q6gHy4Ub3+MxcMb332cMYs2d52hJPdWu2YuHQryFVVmSWR3x33Nir9euOI1yjgf9ezlRACgxt4BkZamn3Dr/WqCjJ3mhOJlQev8Z5fAY4UO6Y5mzqhHyfqztMZcjuQ==";
            console.log(licenseKey);
            if (type == "Passport") {
                didTapScan(type, licenseKey).then((mrtddata) => {
                    console.dir(mrtddata);
                    console.dir(mrtddata.mrzText())
                    //mrtddata.documentCode()+mrtddata.nationality()+mrtddata
                    console.log(mrtddata.documentCode().split('<')[0]);
                    console.log(mrtddata.documentCode().split(';')[0]);
                    this.isScanned = true;
                    let docType: string;
                    this.SearchFields.LastName = '';
                    if (mrtddata.documentCode().split('<')[0].length > 0) {
                        docType = mrtddata.documentCode().split('<')[0];
                    }
                    else if (mrtddata.documentCode().split(';').length > 0) {
                        docType = mrtddata.documentCode().split(';')[0];
                    }
                    if (docType.substr(0, 1) == "P") {
                        lastname = mrtddata.primaryId();
                        this.apisDocument.Surname = mrtddata.primaryId();
                        this.apisDocument.Firstname = mrtddata.secondaryId();
                        this.apisDocument.DocHolderNationality = mrtddata.nationality();
                        this.apisDocument.BirthDate = moment(mrtddata.dateOfBirth().split('/')[1] + "/" + mrtddata.dateOfBirth().split('/')[0] + "/" + mrtddata.dateOfBirth().split('/')[2]).format("MM/DD/YYYY");
                        this.apisDocument.ExpireDate = moment(mrtddata.dateOfExpiry().split('/')[1] + "/" + mrtddata.dateOfExpiry().split('/')[0] + "/" + mrtddata.dateOfExpiry().split('/')[2]).format("MM/DD/YYYY");
                        // if(this.CountryDetails.Collection.filter(m =>m.CountryCode==mrtddata.issuer().substr(0, 2)))
                        this.apisDocument.DocIssueCountry = mrtddata.issuer();//.substr(0, 2);

                        this.apisDocument.CountryOfResidence = null//.substr(0, 2);

                        this.apisDocument.OCRString = mrtddata.mrzText().replace("\n", "");

                        if (mrtddata.sex() == "M") {
                            this.apisDocument.DocHolderGender = "0";
                        }
                        else {
                            this.apisDocument.DocHolderGender = "1";

                        }
                        this.apisDocument.DocID = mrtddata.documentNumber().split('<')[0];
                        this.SearchFields.LastName = lastname.toString();
                        console.log(JSON.stringify(this.apisDocument));

                        this._shared.SetAPISDocument(this.apisDocument);
                        this._shared.SetScanAPISDocument(this.apisDocument);
                    }
                    else {
                        Toast.makeText("Scan Document is not valid").show();
                    }


                });

            }
            else {

                didTapScan(type, licenseKey).then((pdf417data) => {
                    this.isScanned = true;
                    let message: String;
                    message = pdf417data.stringUsingGuessedEncoding();
                    Toast.makeText(JSON.stringify(message)).show();
                    this.SearchFields.SearchAny = message.toString().substr(23, 6);
                    console.log(this.SearchFields.SearchAny);
                    this.GetOrderDetails(this.SearchFields.SearchAny);

                });
            }
        }
        else {
            Toast.makeText("Supported only in IOS").show();
        }

    }

    clear() {
        this.isLastdirty = false;
        this.isFlightdirty = false;
        this.isSearchanydirty = false;
        this.SearchFields.SearchAny = "";
        this.SearchFields.FlightNo = "";
        this.SearchFields.LastName = "";

    }

    private getPaxbyFlight(name: string, date: string, flightcode: string, locationcode: string): void {

        try {
            var sDate = new Date();
            console.log('SearchAllPaxByFlight Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            this.departureService.SearchAllPaxByFlight(name.replace(" ", ""), date, flightcode, this.SearchFields.Location)
                .subscribe((data) => {
                    if (data.Success != false) {
                        // console.dir(<Order.PassengerDetailList>data);
                        this.PassengerDetails = <Order.PassengerDetailList>data
                        this.PassengerListNew = Converters.ConvertToPaxByFlightTemplateNew(this.PassengerDetails);
                        if (this.PassengerListNew.length == 1) {
                            // this.SearchFields.SearchAny = this.PassengerListNew[0].OrderID;
                            // this.SearchAny();
                            if (this.isScanned) {
                                // this._shared.SetAPISDocument(null);
                                this.GetOrderDetails(this.PassengerListNew[0].OrderID);
                            }
                            else {
                                this._shared.SetAPISDocument(null);
                                this._shared.SetScanAPISDocument(null);
                                this.GetOrderDetails(this.PassengerListNew[0].OrderID);
                            }
                        }
                        else if (this.PassengerListNew.length > 1) {
                            var PaxCount = 0;
                            this.PassengerListNew.forEach((PaxData, PaxIndex) => {
                                if (PaxData.OrderID == this.PassengerListNew[0].OrderID) {
                                    PaxCount = PaxCount + 1;
                                }
                            })
                            console.log(PaxCount);
                            if (PaxCount == this.PassengerListNew.length) {
                                if (this.isScanned) {
                                    console.log("HERE")
                                    this.GetOrderDetails(this.PassengerListNew[0].OrderID);
                                } else {
                                    this._shared.SetAPISDocument(null);
                                    this._shared.SetScanAPISDocument(null);
                                    this.GetOrderDetails(this.PassengerListNew[0].OrderID);
                                }
                            }
                            else {
                                ApplicationSettings.setString("passengerlist", JSON.stringify(this.PassengerListNew));
                                let multiplePassenger: number = 0;
                                this.PassengerListNew.forEach((pass, index) => {
                                    if (this._shared.GetAPISDocument() != null) {
                                        if (this._shared.GetAPISDocument().Firstname.replace(" ", "") == this.SuffixCheck(pass.FirstName) && this._shared.GetAPISDocument().Surname.replace(" ", "") == pass.LastName) {
                                            multiplePassenger++;
                                        }
                                    }
                                });
                                if (multiplePassenger > 1) {
                                    Toast.makeText("Multiple match found. Scanned data is ignored").show();
                                    this._shared.SetAPISDocument(null);
                                }
                                else {
                                    this.navigateToSearchResults(JSON.stringify(this.PassengerListNew));
                                }
                                this.loaderProgress.hideLoader();
                            }
                        } else {
                            Toast.makeText("Passenger details are not found").show();
                            this.loaderProgress.hideLoader();
                        }

                    }
                    else {
                        // Toast.makeText(data.ErrorMessage).show();
                        Toast.makeText("Passenger details are not found").show();
                        this.loaderProgress.hideLoader();
                    }
                },
                    error => {
                        console.log("Couldnt fin information for this search " + error);
                        this.handleServiceError(error);
                        this.loaderProgress.hideLoader();
                        Toast.makeText("Couldnt find information for this search " + error).show();
                    },
                    () => {
                        console.log('Data Retrieved successfully' + this.PassengerDetails);
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
        }
    }
    LastNameEmpty(): boolean {
        if (this.isLastNameEmpty && this.isLastdirty && this.isnumber == false) {
            return true;
        }
        else if (this.isnumber == true) {
            return true;
        }
        else
            return false;
    }
    FlightEmpty(): boolean {
        if (this.isFlightEmpty && this.isFlightdirty) {
            return true;
        }
        else return false;
    }
    Searchempty(): boolean {
        if (this.isAnySearchEmpty && this.isSearchanydirty) {
            return true;
        }
        else return false;

    }

    getProfile(): void {

        try {
            var sDate = new Date();
            console.log('GetAccountProfile Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            this._homepage.GetAccountProfile()
                .subscribe((data) => {
                    console.log("Test1");
                    this.ProfileDetails = <Order.RootObject>data;
                    this.ProfileArray = Converters.ConvertToAccountProfileTemplate(this.ProfileDetails);
                    this.SearchFields.Location = this.ProfileArray[0].AirportCode;
                    this.userdetails = this.SearchFields.Location + " | " + moment().format("DD MMM YYYY") + " | " + this.ProfileArray[0].Username;
                    ApplicationSettings.setString("userdetails", this.userdetails);
                    this.loaderProgress.hideLoader();
                },
                    error => {
                        console.log("Couldnt find information for this Profile " + error);
                        this.handleServiceError(error)
                        this.loaderProgress.hideLoader();
                    },
                    () => {
                        console.log('Data Retrieved successfully' + this.SearchFields.Location);
                        this.loaderProgress.hideLoader();
                    }
                )
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('GetAccountProfile Service --------------- End Date Time : ' + eDate);
            console.log('GetAccountProfile Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    }

    getPaxbyFQTVID(id: string): void {
        this.loaderProgress.showLoader();
        this.ETKTNumber = "";
        try {
            var sDate = new Date();
            console.log('SearchPaxByFQTVID Service --------------- Start Date Time : ' + sDate);
            console.log("getPaxbyFQTVID called " + id);
            this._search.SearchPaxByFQTVID(id)
                .subscribe((data) => {
                    this.FQTVArray = Converters.ConvertToFQTVTemplate(<FQTV.RootObject>data);
                    if (this.FQTVArray == null || this.FQTVArray.length == 0) {
                        var self = this;
                        Toast.makeText("No reservations are found").show();
                        this.loaderProgress.hideLoader();
                        // this.navigateToSearch();
                    }
                    else {
                        this.navigateToFQTV(JSON.stringify(this.FQTVArray), this.SearchFields.SearchAny);
                    }
                    //this.router.navigate(["/checkin"])
                    this.loaderProgress.hideLoader();
                },
                    error => {
                        var self = this;
                        this.handleServiceError(error);
                        Toast.makeText("No reservations are found").show();
                        // this.navigateToSearch();
                        console.log("Couldnt find information for this OrderID " + error);
                        this.loaderProgress.hideLoader();
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

    navigateToCheckin(param: string) {
        this.routerExtensions.navigate(["checkin"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "data": param,
            }
        });
    }
    navigateToFQTV(param: string, fqtvnum) {
        this.loaderProgress.hideLoader();
        this.routerExtensions.navigate(["fqtvlist"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "data": param,
                "fqtvnum": fqtvnum
            }
        });
    }


    navigateToSearchResults(param: string) {
        this.routerExtensions.navigate(["searchresult"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "data": param
            }
        });
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

    navigateToHome() {
        this.routerExtensions.navigate(["home"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    }


    mCallback = ((result) => {
        if (result) {
            var c = moment(result, "DD MM YYYY HH:mm ZZ").format("DD MMMM YYYY");
            this.SearchFields.FlightDate = c;
        }
    });

    createModelView(args) {
        let that = this;
        let currentDate = this.startDate;
        console.log(this.startDate);
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                currentDate: currentDate.toDateString(),
                displayHeader: true,
                minDate: moment(new Date()).subtract(1, 'days').toDate().toDateString(),
                maxDate: moment(new Date()).add(2, 'days').toDate().toDateString()
            },
            fullscreen: false
        };

        this._modalService.showModal(DatePickerModal, options)
            .then((dateresult: Date) => {
                if (dateresult) {
                    console.log("date result " + dateresult);
                    if (dateresult.toDateString() != 'undefined') {
                        this.startDate = dateresult;
                    }
                }
            });
    }


    public onopen() {
        console.log("Drop Down opened.");
    }
    onChange(args: any, index: any) {
        this._timeoutService.resetWatch();
        switch (index) {
            case 0:

                this.isFlightEmpty = false;
                this.isLastNameEmpty = false;
                if (this.SearchFields.SearchAny != "") {
                    this.isAnySearchEmpty = false;
                    this.isSearchanydirty = true;
                }
                if (this.SearchFields.SearchAny.length >= 6) {
                    this.isValid = true;
                }
                else
                    this.isValid = false;
                var reg = new RegExp('^[a-zA-Z0-9-/]*$');
                var test = reg.test(this.SearchFields.SearchAny);
                if (test == false)
                    this.isAnySearchEmpty = true;
                else
                    this.isAnySearchEmpty = false;
                break;
            case 1:
                this.isAnySearchEmpty = false;
                if (this.SearchFields.FlightNo == "") {
                    this.isFlightEmpty = true;
                }
                else {
                    this.isFlightEmpty = false;
                    this.isFlightdirty = true;
                }
                var reg = new RegExp('^[a-zA-Z0-9]*$');
                var test = reg.test(this.SearchFields.FlightNo);
                console.log("flightnum" + test);
                if (test == false || this.SearchFields.FlightNo == "") {
                    if (test == false) {
                        Toast.makeText("Proper flight number").show();
                    }
                    this.isFlightEmpty = true;
                }
                else {
                    this.isFlightEmpty = false;
                }

                break;
            case 2:
                this.isAnySearchEmpty = false;
                if (this.SearchFields.LastName == "") {
                    this.isLastNameEmpty = true;

                }
                else { this.isLastNameEmpty = false; this.isLastdirty = true; }
                var reg = new RegExp('^[a-zA-Z ]+$');

                var test = reg.test(this.SearchFields.LastName);
                if (test == false && this.SearchFields.LastName != "") {
                    this.isnumber = true;
                    Toast.makeText("Only alphabets").show();
                }
                else { this.isnumber = false; }
                // console.log(test);
                // console.log(this.SearchFields.LastName.length);
                break;
            default:
        }
        if (this.isnumber == true || this.SearchFields.FlightNo == "" || this.SearchFields.LastName == "" || this.isLastNameEmpty == true || this.isFlightEmpty == true) {
            this.isButtonEnabled = false;
        } else {
            this.isButtonEnabled = true;
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