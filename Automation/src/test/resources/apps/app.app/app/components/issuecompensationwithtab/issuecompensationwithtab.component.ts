//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import * as imageModule from "image-source";
import * as fs from "file-system";
import { ObservableArray } from "data/observable-array";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { TextField } from "tns-core-modules/ui/text-field";
import { GestureEventData } from "ui/gestures";
import { ListView, ItemEventData } from "ui/list-view";
import { StackLayout } from "ui/layouts/stack-layout";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import * as dialogs from "ui/dialogs";
import * as gestures from "ui/gestures";
import { SegmentedBar, SegmentedBarItem } from "ui/segmented-bar";
var timer = require("timer");


//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as moment from "moment";
import * as Toast from 'nativescript-toast';
import * as zebra from "nativescript-print-zebra";

//app references
import { LoaderProgress, order, PassengerListTemplate, DeparturePaxList, PassengerList, DepartureInfo1, IssueCompensationList, InBound, OutBound, CompensationSearchModule } from "../../shared/interface/index"
import { Passenger, Order, Inventory, CountryCollection, PrintModule } from '../../shared/model/index';
import { DataService, CheckinOrderService, PassengerService, TimeOutService, CompensationService } from "../../shared/services/index";
import { Converters } from "../../shared/utils/index";
import { AppExecutiontime } from "../../app.executiontime";
import { Configuration } from '../../app.constants';

@Component({
    selector: "compensationadditionaldetails-page",
    providers: [DataService, PassengerService, Configuration, CompensationService],
    templateUrl: "./components/issuecompensationwithtab/issuecompensationwithtab.component.html",
    styleUrls: ["./components/issuecompensationwithtab/issuecompensationwithtab.component.css"]

})

export class IssueCompensationWithTabComponent implements OnInit {
    @ViewChild('pagecontainer') pageCont: ElementRef;
    @ViewChild('segbar') segbar: ElementRef;
    public apisdetails: Array<SegmentedBarItem>;
    public firsttab = new SegmentedBarItem();
    public secondtab = new SegmentedBarItem();
    public errorMessage: string;
    public loaderProgress: LoaderProgress;
    public CompensationIssuedList: boolean = true;
    public CompensationNotIssuedList: boolean = false;
    public FlightInfoNotSet: boolean = false;
    public searchField: any;
    public SelectedPaxcount: number = 0;
    public PaxList: CompensationSearchModule.CompensationRootObject = new CompensationSearchModule.CompensationRootObject();
    public flightdate: any;
    public userdetails: any;
    public selectedEMDs: number = 0;
    public TotalPassengerCount: number = 0;
    public selectedPassengerCount: number = 0;
    public SelectedPassenger: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public flightnumber: any;
    public IsHeaderInfo: boolean = false;
    public IsFlightInfo: boolean = false;
    public PreviousPage: any;
    public IsPaxReasonSelected: boolean = false;
    public SearchCriteria: any = "Name";
    public PassengerFliterCriteria: any = "All Passengers";
    public OrderId: any;
    public EmailId: any = "";
    public isEmailCopytoSelectPaxTrue: boolean = false;
    public EmailIdSelectedPax: any = "";
    public SelectAllPax: boolean = false;
    public mealdirty: boolean = false;
    public isOverrideReasonBlank: boolean = false;
    public ValidMonetary: Array<boolean> = [];
    public ValidHotel: Array<boolean> = [];
    public ValidMeal: Array<boolean> = [];
    public Validtransport: Array<boolean> = [];
    public totalIssuedMonetary: number = 0;
    public totalIssuedHotel: number = 0;
    public totalIssuedMeal: number = 0;
    public totalIssuedTransport: number = 0;
    public totalNotIssuedMonetary: number = 0;
    public totalNotIssuedHotel: number = 0;
    public totalNotIssuedMeal: number = 0;
    public totalNotIssuedTransport: number = 0;
    public isButtonEnabled: boolean = false;
    public CompensatedPaxCount: number = 0;
    public totalMonetary: number = 0;
    public totalHotel: number = 0;
    public totalMeal: number = 0;
    public SaveComptemplate: any;
    public totalTransport: number = 0;
    public CompensationNotIssuedPaxCount: number = 0;
    public nameSortIndicator: number = -1;
    public ssrSortIndicator: number = -1;
    public MonetraryEmpty: boolean = false;
    public Monetarydirty: boolean = false;
    public hotelEmpty: boolean = false;
    public hoteldirty: boolean = false;
    public mealEmpty: boolean = false;
    public SelectAllPaxVar: boolean = false;
    // public isButtonEnabled: boolean = false;
    public isEmailNotAvailable: boolean = false;
    IsEditable: boolean = false;
    IsLabelField: boolean = true;
    public tierSortIndicator: number = -1;
    public isEmailEnabled: boolean = false;
    public classSortIndicator: number = -1;
    public orderIdSortIndicator: number = -1;
    public SelectedMonetary: any;
    public SelctedHotel: any;
    public SelectedMeal: any;
    public OverRideReason: any;
    public SelectedTransport: any;
    public transportEmpty: boolean = false;
    public transportdirty: boolean = false;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    public FlightHeaderInfo: CompensationSearchModule.FlightModel = new CompensationSearchModule.FlightModel();
    public CompPaxList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompPaxListIssued: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompPaxListIssuedFulList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompPaxListNotIssued: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompPaxListNotIssuedFulList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompensationPassengerList: Array<IssueCompensationList> = [];
    public IssueCompPaxList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public static MaxEMDIssued: number = 50;
    public static ISSUECOMPENSATIONTOAST: string = "Are you ready to issue compensation?";
    public static NUMBERVALIDATIONTOAST: string = "Invalid. Enter value in numbers";
    public static COMPENSATIONNATOAST: string = "Compensation not applicable";
    public static MUSTBETOAST: string = "Must be:";
    public static COMPENSATIONFIRSTTAB: string = "Compensation Issued";
    public static COMPENSATIONSECONDTAB: string = "Compensation Not Issued";
    public static NOBLUETOOTHDEVICE: string = "No Bluetooth Printer Found. Please set the Printer in Settings Page";
    public static UNABLETOPRINT: string = "Unable to Print";
    public static PRINTERSESSION: string = "Unable to connect to printer session, try again later";
    // public IssueCompensationResponse: any;
    constructor(private _configuration: Configuration, private _services: PassengerService, private activatedRouter: ActivatedRoute, private _shared: CheckinOrderService, private page: Page, private routerExtensions: RouterExtensions, public _timeoutService: TimeOutService, private router: Router, public _dataService: DataService, public _service: CompensationService, private route: ActivatedRoute) {
        this.loaderProgress = new LoaderProgress();
        this.apisdetails = [];

        this.firsttab.title = IssueCompensationWithTabComponent.COMPENSATIONFIRSTTAB;
        this.apisdetails.push(this.firsttab);

        this.secondtab.title = IssueCompensationWithTabComponent.COMPENSATIONSECONDTAB;
        this.apisdetails.push(this.secondtab);
    }
    ngOnInit() {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.loaderProgress.initLoader(this.pageCont);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
        console.log("Flight" + JSON.stringify(this.FlightHeaderInfo));
        this.IssueCompPaxList = this._shared.getCompensationPaxList();
        this.activatedRouter.queryParams.subscribe((params) => {
            if (params["date"] != null && params["date"] != "" && params["date"] != "undefined") {
                this.flightdate = params["date"];
                console.log("new" + this.flightdate);
            }
            if (params["flightnumber"] != null && params["flightnumber"] != "" && params["flightnumber"] != "undefined") {
                this.flightnumber = params["flightnumber"];
                console.log("new 1" + this.flightnumber)
            }
        })
        this.activatedRouter.queryParams.subscribe((params) => {
            // this.PaxItem = JSON.parse(params["data"]);
            this.PreviousPage = params["prepage"];
            this.OrderId = params["data"]
            // this.PassengerName = this.PaxItem.FullName;
            console.log("v" + JSON.stringify(this.OrderId));
        })
        if (this.PreviousPage == "OrderId") {
            this.IsHeaderInfo = true;
            this.IsFlightInfo = false;
            // this.CompensationOrderDetails = this._shared.GetCompensationOrderDeatils();
        }
        else {
            this.IsHeaderInfo = false;
            this.IsFlightInfo = true;
        }
        this.IssueCompPaxList.forEach((data, Index) => {
            if (data.IsCompensationIssued == true) {
                if (data.monetary == 0 && data.hotel == 0 && data.meal == 0 && data.transportation == 0) {
                    this.CompPaxListNotIssued.push(data);
                } else {
                    this.CompPaxListIssued.push(data);
                    this.TotalPassengerCount = this.CompPaxListIssued.length;
                    this.totalIssuedMonetary = this.totalIssuedMonetary + Number(data.monetary);
                    this.totalIssuedHotel += Number(data.hotel);
                    this.totalIssuedMeal += Number(data.meal);
                    this.totalIssuedTransport += Number(data.transportation);
                }
            } else {
                this.CompPaxListNotIssued.push(data);
                this.TotalPassengerCount = this.CompPaxListNotIssued.length;
                this.totalNotIssuedMonetary = this.totalNotIssuedMonetary + Number(data.monetary);
                this.totalNotIssuedHotel += Number(data.hotel);
                this.totalNotIssuedMeal += Number(data.meal);
                this.totalNotIssuedTransport += Number(data.transportation);
            }
        });
        this.CompPaxListIssuedFulList = this.CompPaxListIssued;
        this.CompPaxListNotIssuedFulList = this.CompPaxListNotIssued;
        this.apisdetails = [];
        this.CompensatedPaxCount = this.CompPaxListIssued.length;
        this.firsttab.title = IssueCompensationWithTabComponent.COMPENSATIONFIRSTTAB + "(" + this.CompensatedPaxCount + ")";;
        this.apisdetails.push(this.firsttab);
        this.CompensationNotIssuedPaxCount = this.CompPaxListNotIssued.length;
        this.secondtab.title = IssueCompensationWithTabComponent.COMPENSATIONSECONDTAB + "(" + this.CompensationNotIssuedPaxCount + ")";;
        this.apisdetails.push(this.secondtab);

    }
    printEnabled(): boolean {
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
            return true;
        }
        else return false;
    }
    isEditEnabled(): boolean {
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
            return true;
        } else return false;
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
    displayProductActionDialogForSmartFilter() {
        let options = {
            title: "Smart filter option",
            cancelButtonText: "Cancel",
            actions: ["Name", "Order ID", "Class"],
        };
        dialogs.action(options).then((result) => {
            if (result != "Cancel") {
                this.SearchCriteria = result;
                console.log("res:" + JSON.stringify(this.SearchCriteria));
            }
        });
    }
    displayProductActionDialogForPrinter() {
        var hostedcheck = ApplicationSettings.getBoolean("isHostBoarding");
        if (hostedcheck) {
            this.printEMD();
        } else {
            this.bluetoothEMD();
        }
    }
    displayDialogForFliterPassengerType() {
        let options = {
            title: "Passenger type filter",
            cancelButtonText: "Cancel",
            actions: ["All Passengers", "ETKT Passengers", "Checked-In Passengers", "Not Checked-In Passengers"],
        };
        dialogs.action(options).then((result) => {
            if (result != "Cancel") {
                this.PassengerFliterCriteria = result;
            }
        });
    }
    filter(args: any) {
        console.log("Name:" + JSON.stringify(args));
        let segBarElm = <SegmentedBar>this.segbar.nativeElement;
        let index = segBarElm.selectedIndex;
        if (index == 0) {
            this.CompPaxListIssued = this.CompPaxListIssuedFulList;
            if (this.SearchCriteria == "Name") {
                if (args) {
                    let name = args.toString().toUpperCase();
                    this.CompPaxListIssued = this.CompPaxListIssued.filter(r => r.GivenName.indexOf(name.trim()) >= 0 || r.LastName.indexOf(name.trim()) >= 0);
                    this.CompPaxList = this.CompPaxListIssued;
                } else {
                    this.CompPaxListIssued = this.CompPaxListIssuedFulList;
                    this.CompPaxList = this.CompPaxListIssued;
                }
            } else if (this.SearchCriteria == "Order ID") {
                if (args) {
                    let name = args.toString().toUpperCase();
                    this.CompPaxListIssued = this.CompPaxListIssued.filter(r => r.OrderId.indexOf(name.trim()) >= 0);
                    this.CompPaxList = this.CompPaxListIssued;
                } else {
                    this.CompPaxListIssued = this.CompPaxListIssuedFulList;
                    this.CompPaxList = this.CompPaxListIssued;
                }
            } else {
                if (args) {
                    let name = args.toString().toUpperCase();
                    this.CompPaxListIssued = this.CompPaxListIssued.filter(r => r.Cabin.indexOf(name.trim()) >= 0);
                    this.CompPaxList = this.CompPaxListIssued;
                } else {
                    this.CompPaxListIssued = this.CompPaxListIssuedFulList;
                    this.CompPaxList = this.CompPaxListIssued;
                }
            }
            this.TotalPassengerCount = this.CompPaxList.length;
        } else {
            this.CompPaxListNotIssued = this.CompPaxListNotIssuedFulList;
            if (this.SearchCriteria == "Name") {
                if (args) {
                    let name = args.toString().toUpperCase();
                    this.CompPaxListNotIssued = this.CompPaxListNotIssued.filter(r => r.GivenName.indexOf(name.trim()) >= 0 || r.LastName.indexOf(name.trim()) >= 0);
                    this.CompPaxList = this.CompPaxListNotIssued;
                } else {
                    this.CompPaxListNotIssued = this.CompPaxListNotIssuedFulList;
                    this.CompPaxList = this.CompPaxListNotIssued;
                }
            } else if (this.SearchCriteria == "Order ID") {
                if (args) {
                    let name = args.toString().toUpperCase();
                    this.CompPaxListNotIssued = this.CompPaxListNotIssued.filter(r => r.OrderId.indexOf(name.trim()) >= 0);
                    this.CompPaxList = this.CompPaxListNotIssued;
                } else {
                    this.CompPaxListNotIssued = this.CompPaxListNotIssuedFulList;
                    this.CompPaxList = this.CompPaxListNotIssued;
                }
            } else {
                if (args) {
                    let name = args.toString().toUpperCase();
                    this.CompPaxListNotIssued = this.CompPaxListNotIssued.filter(r => r.Cabin.indexOf(name.trim()) >= 0);
                    this.CompPaxList = this.CompPaxListNotIssued;
                } else {
                    this.CompPaxListNotIssued = this.CompPaxListNotIssuedFulList;
                    this.CompPaxList = this.CompPaxListNotIssued;
                }
            }
            this.TotalPassengerCount = this.CompPaxList.length;
        }

    }
    issueEnabled(): boolean {
        if (this.SelectedPassenger && this.SelectedPassenger.length == 0) {
            this.IsPaxReasonSelected = false;
        }
        else {
            // this.IsPaxReasonSelected = true;
            if (this.IsEditable == true) {
                this.IsPaxReasonSelected = false;
            } else {
                this.SelectedPassenger.forEach((data, index) => {
                    if (data.monetary == 0 && data.hotel == 0 && data.meal == 0 && data.transportation == 0) {
                        this.IsPaxReasonSelected = false;
                        // this.SelectAllPax = false;
                    } else {
                        this.IsPaxReasonSelected = true;
                    }
                })
            }

        } if (this.IsPaxReasonSelected == true) {
            return true;
        }
        else return false;
    }
    toggleChecked(pax: CompensationSearchModule.CompensationPassengerList) {
        if (this.IsLabelField == true && this.CompensationNotIssuedList == true) {
            if (this.IsLabelField == true) {

                if (pax.IsSelected == false) {
                    this.selectedEMDs = 0;
                    this.SelectedPassenger.forEach((data, Index) => {
                        if (data.monetary) {
                            this.selectedEMDs += Number(data.hotel) + Number(data.meal) + Number(data.transportation) + 1;
                        } else {
                            this.selectedEMDs += Number(data.hotel) + Number(data.meal) + Number(data.transportation);
                        }
                    })

                    console.log("countEMD:" + JSON.stringify(this.selectedEMDs));
                    console.dir(this.SelectedPassenger);
                    if (pax.monetary == 0 && pax.hotel == 0 && pax.meal == 0 && pax.transportation == 0) {
                        pax.IsSelected = true;
                        this.SelectedPassenger.push(pax);
                        Toast.makeText("Ineligible Passenger(s) is selected.").show();
                    } else {
                        if (pax.monetary) {
                            if ((this.selectedEMDs + Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation) + 1) <= IssueCompensationWithTabComponent.MaxEMDIssued) {
                                pax.IsSelected = true;
                                this.SelectedPassenger.push(pax);
                                this.selectedEMDs += Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation) + 1;
                            }
                        } else {
                            if ((this.selectedEMDs + Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation)) <= IssueCompensationWithTabComponent.MaxEMDIssued) {
                                pax.IsSelected = true;
                                this.SelectedPassenger.push(pax);
                                this.selectedEMDs += Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation);
                            }
                        }
                    }
                    if (this.CompPaxListNotIssued.length === this.SelectedPassenger.length) this.SelectAllPax = true;
                } else {
                    this.SelectedPassenger.splice(this.SelectedPassenger.indexOf(pax), 1);
                    // if (pax.monetary) {
                    //     this.selectedEMDs = this.selectedEMDs - (Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation) + 1);
                    // } else {
                    //     this.selectedEMDs = this.selectedEMDs - (Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation));
                    // }
                    this.selectedEMDs = 0;
                    this.SelectedPassenger.forEach((data, Index) => {
                        if (pax.monetary) {
                            this.selectedEMDs += Number(data.hotel) + Number(data.meal) + Number(data.transportation) + 1;
                        } else {
                            this.selectedEMDs += Number(data.hotel) + Number(data.meal) + Number(data.transportation);
                        }
                    })
                    console.log("countEMD:" + JSON.stringify(this.selectedEMDs));
                    pax.CompensationReason = "";
                    pax.IsSelected = false;
                    this.SelectAllPax = false;
                }
            }
            // this.SelectedPaxcount = this.SelectedPassenger.length;
            this.selectedPassengerCount = this.SelectedPassenger.length;
            console.log("Count1:" + this.selectedEMDs);
            console.log(this.SelectedPassenger);
        }
        if (this.CompensationIssuedList == true) {
            if (pax.IsSelected == false) {
                pax.IsSelected = true;
                if (this.isEmailCopytoSelectPaxTrue) {
                    pax.Email = this.EmailIdSelectedPax;
                }
                this.SelectedPassenger.push(pax);
                if (this.CompPaxListIssuedFulList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
                console.log("Len" + this.SelectedPassenger.length);
            } else {
                this.SelectedPassenger.splice(this.SelectedPassenger.indexOf(pax), 1);
                pax.IsSelected = false;
                this.SelectAllPax = false;
            }
            this.selectedPassengerCount = this.SelectedPassenger.length;
        }
    }
    editable(): void {
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
            this.IsEditable = true;
            this.IsLabelField = false;
            console.log("Edit: " + this.IsEditable);
            console.log("Done:" + this.IsLabelField);
        }
    }
    done(): void {
        if (this.isButtonEnabled == true) {
            this.selectedEMDs = 0;
            this.isOverrideReasonBlank = false;
            this.SelectedPassenger.forEach((data, Index) => {
                if (data.isMonetaryOverridden == true && data.MonetaryOverrideReason == "") {
                    this.isOverrideReasonBlank = true;
                    this.overidereasonformonetary(data, 1);
                } else if (data.isHotelOverridden == true && data.HotelOverrideReason == "") {
                    this.isOverrideReasonBlank = true;
                    this.overidereasonforhotel(data, 1);
                } else if (data.isMealOverridden == true && data.MealOverrideReason == "") {
                    this.isOverrideReasonBlank = true;
                    this.overidereasonformeal(data, 1);
                } else if (data.isTransportOverridden == true && data.TransportOverrideReason == "") {
                    this.isOverrideReasonBlank = true;
                    this.overidereasonfortransport(data, 1);
                }
                if (!this.isOverrideReasonBlank) {
                    this.IsEditable = false;
                    this.IsLabelField = true;
                }
                console.log("count:" + JSON.stringify(this.selectedEMDs));
                if (data.monetary) {
                    this.selectedEMDs = this.selectedEMDs + Number(data.hotel) + Number(data.meal) + Number(data.transportation) + 1;
                } else {
                    this.selectedEMDs = this.selectedEMDs + Number(data.hotel) + Number(data.meal) + Number(data.transportation);
                }
                if (this.selectedEMDs > IssueCompensationWithTabComponent.MaxEMDIssued) {
                    data.IsSelected = false;
                    // this.SelectedPassenger.splice(this.SelectedPassenger.indexOf(data), 1)
                }


            })
            this.SelectedPassenger = [];
            this.CompPaxListNotIssued.forEach((paxData, Index) => {
                if (paxData.IsSelected) {
                    this.SelectedPassenger.push(paxData);
                }
            });
            this.selectedEMDs = 0;
            this.SelectedPassenger.forEach((data, Index) => {
                if (data.monetary) {
                    this.selectedEMDs = this.selectedEMDs + Number(data.hotel) + Number(data.meal) + Number(data.transportation) + 1;
                } else {
                    this.selectedEMDs = this.selectedEMDs + Number(data.hotel) + Number(data.meal) + Number(data.transportation);
                }
            })
            // this.SelectedPaxcount = this.SelectedPassenger.length;
            console.dir(this.SelectedPassenger);
            console.log("Edit: " + this.IsEditable);
            console.log("Done:" + this.IsLabelField);
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
    selectingAllPax() {
        if (this.CompensationIssuedList == true) {
            // this.SelectedPassenger = [];
            if (this.SelectAllPax == false && this.SelectAllPaxVar == false) {
                this.SelectAllPaxVar = true;
                this.SelectAllPax = true;
                this.CompPaxListIssued.forEach((data, index) => {
                    if (!data.IsSelected) {
                        data.IsSelected = true;
                        if (this.isEmailCopytoSelectPaxTrue) {
                            data.Email = this.EmailIdSelectedPax;
                        }
                        this.SelectedPassenger.push(data);
                    }
                })
            } else {
                this.SelectAllPaxVar = false;
                this.SelectAllPax = false;
                this.CompPaxListIssued.forEach((data, index) => {
                    data.IsSelected = false;
                })
                this.SelectedPassenger = [];
            }
            if (this.CompPaxListIssuedFulList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
            this.selectedPassengerCount = this.SelectedPassenger.length;
        } if (this.IsLabelField == true && this.CompensationNotIssuedList == true) {
            if (this.IsLabelField == true) {
                var isIneligibleSelected = false;
                if (this.SelectAllPax == false && this.SelectAllPaxVar == false) {
                    this.SelectAllPaxVar = true;
                    var exceedLimit: boolean = false;
                    this.CompPaxListNotIssued.forEach((data, index) => {
                        if (!data.IsSelected) {
                            var totalEmds: number = 0;
                            if (data.monetary) {
                                totalEmds = Number(this.selectedEMDs) + Number(data.hotel) + Number(data.meal) + Number(data.transportation) + 1;
                            } else {
                                totalEmds = Number(this.selectedEMDs) + Number(data.hotel) + Number(data.meal) + Number(data.transportation);
                            }
                            if (totalEmds <= IssueCompensationWithTabComponent.MaxEMDIssued) {
                                if (data.monetary == 0 && data.hotel == 0 && data.meal == 0 && data.transportation == 0) {
                                    isIneligibleSelected = true;
                                    data.IsSelected = false;
                                    this.SelectAllPax = false;
                                } else {
                                    if (data.monetary) {
                                        this.selectedEMDs += Number(data.hotel) + Number(data.meal) + Number(data.transportation) + 1;
                                    } else {
                                        this.selectedEMDs += Number(data.hotel) + Number(data.meal) + Number(data.transportation);
                                    }
                                    data.IsSelected = true;
                                    this.SelectedPassenger.push(data);
                                }
                            } else {
                                exceedLimit = true;
                                // Toast.makeText(IssueCompensationComponent.MaxEMDIssued + "EMD's selected").show();
                            }
                        }
                    })
                    if (exceedLimit) {
                        Toast.makeText(IssueCompensationWithTabComponent.MaxEMDIssued + " EMD's selected").show();
                    }
                } else {
                    this.SelectAllPaxVar = false;
                    this.SelectAllPax = false;
                    this.CompPaxListNotIssued.forEach((data, index) => {
                        data.IsSelected = false;
                        this.SelectedPassenger = [];
                        this.selectedEMDs = 0;
                    })
                }
                if (this.CompPaxListNotIssuedFulList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
            }
            if (isIneligibleSelected) {
                Toast.makeText("Ineligible Passenger(s) are not selected.").show();
            }
            this.SelectedPaxcount = this.SelectedPassenger.length;
            this.selectedPassengerCount = this.SelectedPassenger.length;
            console.log(this.SelectedPassenger);
        }
        this.selectedPassengerCount = this.SelectedPassenger.length;

    }
    public selectSegment(e: any) {
        var selInd = e.newIndex;
        this.SelectedPassenger = [];
        if (selInd == 0) {
            this.CompensationIssuedList = true;
            this.CompensationNotIssuedList = false;
            this.SelectAllPax = false;
            this.SearchCriteria = "Name";
            this.searchField = undefined;
            this.CompPaxList = this.CompPaxListIssuedFulList;
            this.CompPaxList.forEach((data, i) => { data.IsSelected = false; })
            this.CompPaxListIssued = this.CompPaxListIssuedFulList;
            this.CompPaxListNotIssued = this.CompPaxListNotIssuedFulList;
            this.selectedPassengerCount = 0;
            this.TotalPassengerCount = this.CompPaxListIssuedFulList.length;

            console.log("Issued" + this.CompPaxListIssued.length);
        } else {
            this.CompensationIssuedList = false;
            this.CompensationNotIssuedList = true;
            this.SelectAllPax = false;
            this.SearchCriteria = "Name";
            this.searchField = undefined;
            this.selectedPassengerCount = 0;
            this.CompPaxList = this.CompPaxListNotIssuedFulList;
            this.CompPaxList.forEach((data, i) => { data.IsSelected = false; })
            this.CompPaxListIssued = this.CompPaxListIssuedFulList;
            this.CompPaxListNotIssued = this.CompPaxListNotIssuedFulList;
            this.TotalPassengerCount = this.CompPaxListNotIssuedFulList.length;
            console.log("Not Issued" + this.CompPaxListNotIssued.length);
        }
    }
    issueCompensationConfirmation() {
        dialogs.confirm(IssueCompensationWithTabComponent.ISSUECOMPENSATIONTOAST).then(result => {
            console.log("Dialog result: " + result);
            if (result) {
                this.issueCompensation();
            }
        });
    }
    issueCompensation() {
        try {
            this.loaderProgress.showLoader();
            this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
            var startDate = new Date();
            var CurDate = moment(startDate).format("YYYY-MM-DD");
            console.log(CurDate)
            let agentProfile = this._shared.GetUserProfile();
            let IssueCompensationStructure = Converters.convertToIssueCompensation(this.SelectedPassenger, this.FlightHeaderInfo, CurDate, agentProfile);
            console.log("IssueCompensation Req:" + JSON.stringify(IssueCompensationStructure));

            this._service.PostIssueCompensations(IssueCompensationStructure).subscribe((data) => {
                console.log("IssueCompensation Res:" + JSON.stringify(data));
                if (data.Success) {
                    if (data.Results) {
                        var PaxResponse = Converters.convertToIssueCompensationResponse(data, this.IssueCompPaxList);
                        console.log("before");
                        console.log(this.IssueCompPaxList);
                        this.IssueCompPaxList = [];

                        this.IssueCompPaxList = PaxResponse;
                        // this.IssueCompPaxList = IssueCompensationResponse;
                        this.CompPaxListIssued = [];
                        this.CompPaxListNotIssued = [];
                        this.totalIssuedMonetary = 0;
                        this.totalIssuedHotel = 0;
                        this.totalIssuedMeal = 0;
                        this.totalIssuedTransport = 0;
                        this.totalNotIssuedMonetary = 0;
                        this.totalNotIssuedHotel = 0;
                        this.totalNotIssuedMeal = 0;
                        this.totalNotIssuedTransport = 0;
                        console.log("after");
                        console.log(this.IssueCompPaxList);  
                        this.IssueCompPaxList.forEach((data, Index) => {
                            if (data.IsCompensationIssued == true) {
                                this.CompPaxListIssued.push(data);
                                this.totalIssuedMonetary = this.totalIssuedMonetary + Number(data.monetary);
                                this.totalIssuedHotel += Number(data.hotel);
                                this.totalIssuedMeal += Number(data.meal);
                                this.totalIssuedTransport += Number(data.transportation);
                            } else {
                                this.CompPaxListNotIssued.push(data);
                                this.totalNotIssuedMonetary = this.totalNotIssuedMonetary + Number(data.monetary);
                                this.totalNotIssuedHotel += Number(data.hotel);
                                this.totalNotIssuedMeal += Number(data.meal);
                                this.totalNotIssuedTransport += Number(data.transportation);
                            }
                        })

                        this.apisdetails = [];
                        this.CompPaxListIssuedFulList = [];
                        this.CompPaxListNotIssuedFulList = [];
                        this.CompPaxListIssuedFulList = this.CompPaxListIssued;
                        this.CompPaxListNotIssuedFulList = this.CompPaxListNotIssued;
                        this.CompensatedPaxCount = this.CompPaxListIssued.length;
                        this.CompPaxList = this.CompPaxListIssuedFulList;
                        this.firsttab.title = "Compensation Issued" + "(" + this.CompensatedPaxCount + ")";;
                        this.apisdetails.push(this.firsttab);
                        this.CompensationNotIssuedPaxCount = this.CompPaxListNotIssued.length;
                        this.secondtab.title = "Compensation Not Issued" + "(" + this.CompensationNotIssuedPaxCount + ")";;
                        this.apisdetails.push(this.secondtab);
                        // this._shared.setCompensationPaxList(IssueCompensationResponse);
                        // this.navigatetoissuecompensation();
                        this.loaderProgress.hideLoader();
                        Toast.makeText(data.Errors[0].Message).show();
                    } else {
                        this.loaderProgress.hideLoader();
                    }
                }else{
                    Toast.makeText(data.Errors[0].Message).show();
                    this.loaderProgress.hideLoader();
                }
            }, err => {
                this.handleServiceError(err);
                this.loaderProgress.hideLoader();
            })
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
    }
    onFocus(args) {
        // focus event will be triggered when the users enters the TextField
        console.log("onFocus");
        let textField = <TextField>args.object;
    }
    onChangeForAmount(args: any, index: any, field: any, item: CompensationSearchModule.CompensationPassengerList) {
        console.log("V:" + args);
        console.log("R:" + index);
        if (this.IsEditable == true) {
            this.MonetraryEmpty = false;
            if (field == "") {
                this.MonetraryEmpty = true;
                this.ValidMonetary[index] = true;
            }
            else {
                this.MonetraryEmpty = false;
                this.Monetarydirty = true;
                this.ValidMonetary[index] = false;
            }
            var reg = new RegExp(/^[0-9]+$/);
            var test = reg.test(field);
            console.log("flightnum" + test);
            if (test == false) {
                if (field != "") {
                    this.ValidMonetary[index] = true;
                    Toast.makeText(IssueCompensationWithTabComponent.NUMBERVALIDATIONTOAST).show();
                    this.isButtonEnabled = false;
                    this.MonetraryEmpty = true;
                } else {
                    this.isButtonEnabled = false;
                    this.ValidMonetary[index] = true;
                }

            }
            else {
                this.MonetraryEmpty = false;
                this.isButtonEnabled = true;
                this.ValidMonetary[index] = false;
                this.SelectedMonetary = field;
                if (item.monetaryInitialValue != field) {
                    item.isMonetaryOverridden = true;
                } else {
                    item.isMonetaryOverridden = false;
                    item.MonetaryOverrideReason = "";
                    item.monetaryTempValue = field;
                    this.totalMonetary = 0;
                    this.totalHotel = 0;
                    this.totalMeal = 0;
                    this.totalTransport = 0;
                    this.CompPaxListNotIssued.forEach((data, index) => {
                        this.totalMonetary += Number(data.monetary);
                        this.totalHotel += Number(data.hotel);
                        this.totalMeal += Number(data.meal);
                        this.totalTransport += Number(data.transportation);
                    });
                }
            }
            if (field > item.monetaryHigherLimit || field < item.monetaryLowerLimit) {
                if (field != 0) {
                    this.MonetraryEmpty = true;
                    this.isButtonEnabled = false;
                    this.ValidMonetary[index] = true;
                    this.IsPaxReasonSelected = false;

                    if (item.monetaryLowerLimit == 0 && item.monetaryHigherLimit == 0) {
                        const id = timer.setTimeout(() => {
                            item.monetary = 0;
                        }, 1000);
                        Toast.makeText(IssueCompensationWithTabComponent.COMPENSATIONNATOAST).show();
                    } else {
                        Toast.makeText(IssueCompensationWithTabComponent.MUSTBETOAST + item.monetaryLowerLimit + " to " + item.monetaryHigherLimit).show();
                    }
                }
            }
            console.log("V:" + JSON.stringify(this.MonetraryEmpty));
            console.log("R:" + JSON.stringify(this.Monetarydirty));
        }// item.IsSelected = true;

    }
    onChangeForHotel(args: any, index: any, field: any, item: CompensationSearchModule.CompensationPassengerList) {
        if (this.IsEditable == true) {
            this.hotelEmpty = false;
            if (field == "") {
                this.hotelEmpty = true;
                this.ValidHotel[index] = true;
            }
            else {
                this.hotelEmpty = false;
                this.hoteldirty = true;
                this.ValidHotel[index] = false;
            }
            var reg = new RegExp(/^[0-9]+$/);
            var test = reg.test(field);
            console.log("flightnum" + test);
            if (test == false) {
                if (field != "") {
                    Toast.makeText(IssueCompensationWithTabComponent.NUMBERVALIDATIONTOAST).show();
                    this.isButtonEnabled = false;
                    this.ValidHotel[index] = true;
                    this.hotelEmpty = true;
                } else {
                    this.isButtonEnabled = false;
                    this.ValidHotel[index] = true;
                }
            }
            else {
                this.hotelEmpty = false;
                this.isButtonEnabled = true;
                this.ValidHotel[index] = false;
                this.SelctedHotel = field;
                if (item.hotelInitialValue != field) {
                    item.isHotelOverridden = true;
                } else {
                    item.isHotelOverridden = false;
                    item.HotelOverrideReason = "";
                    item.hotelTempValue = field;
                    this.totalMonetary = 0;
                    this.totalHotel = 0;
                    this.totalMeal = 0;
                    this.totalTransport = 0;
                    this.CompPaxListNotIssued.forEach((data, index) => {
                        this.totalMonetary += Number(data.monetary);
                        this.totalHotel += Number(data.hotel);
                        this.totalMeal += Number(data.meal);
                        this.totalTransport += Number(data.transportation);
                    });
                }
            }
            if (field > item.hotelHigherLimit || field < item.hotelLowerLimit) {
                if (field != 0) {
                    this.hotelEmpty = true;
                    this.isButtonEnabled = false;
                    this.ValidHotel[index] = true;
                    this.IsPaxReasonSelected = false;

                    if (item.hotelLowerLimit == 0 && item.hotelHigherLimit == 0) {
                        const id = timer.setTimeout(() => {
                            item.hotel = 0;
                        }, 1000);
                        Toast.makeText(IssueCompensationWithTabComponent.COMPENSATIONNATOAST).show();
                    } else {
                        Toast.makeText(IssueCompensationWithTabComponent.MUSTBETOAST + item.hotelLowerLimit + " to " + item.hotelHigherLimit).show();
                    }
                }
            }
        }
    }
    onChangeForMeal(args: any, index: any, field: any, item: CompensationSearchModule.CompensationPassengerList) {
        if (this.IsEditable == true) {
            this.mealEmpty = false;
            if (field == "") {
                this.mealEmpty = true;
                this.ValidMeal[index] = true;
            }
            else {
                this.mealEmpty = false;
                this.mealdirty = true;
                this.ValidMeal[index] = false;
            }
            var reg = new RegExp(/^[0-9]+$/);
            var test = reg.test(field);
            console.log("flightnum" + test);
            if (test == false) {
                if (field != "") {
                    Toast.makeText(IssueCompensationWithTabComponent.NUMBERVALIDATIONTOAST).show();
                    this.isButtonEnabled = false;
                    this.ValidMeal[index] = true;
                    this.mealEmpty = true;
                } else {
                    this.isButtonEnabled = false;
                    this.ValidMeal[index] = true;
                }

            }
            else {
                this.mealEmpty = false;
                this.isButtonEnabled = true;
                this.ValidMeal[index] = false;
                this.SelectedMeal = field;
                if (item.mealInitialValue != field) {
                    item.isMealOverridden = true;
                } else {
                    item.isMealOverridden = false;
                    item.MealOverrideReason = "";
                    item.mealTempValue = field;
                    this.totalMonetary = 0;
                    this.totalHotel = 0;
                    this.totalMeal = 0;
                    this.totalTransport = 0;
                    this.CompPaxListNotIssued.forEach((data, index) => {
                        this.totalMonetary += Number(data.monetary);
                        this.totalHotel += Number(data.hotel);
                        this.totalMeal += Number(data.meal);
                        this.totalTransport += Number(data.transportation);
                    });
                }
            }
            if (field > item.mealHigherLimit || field < item.mealLowerLimit) {
                if (field != 0) {
                    this.mealEmpty = true;
                    this.isButtonEnabled = false;
                    this.ValidMeal[index] = true;
                    this.IsPaxReasonSelected = false;
                    if (item.mealLowerLimit == 0 && item.mealHigherLimit == 0) {
                        const id = timer.setTimeout(() => {
                            item.meal = 0;
                        }, 1000);
                        Toast.makeText(IssueCompensationWithTabComponent.COMPENSATIONNATOAST).show();
                    } else {
                        Toast.makeText(IssueCompensationWithTabComponent.MUSTBETOAST + item.mealLowerLimit + " to " + item.mealHigherLimit).show();
                    }
                }
            }
        }
    }
    onChangeForTransport(args: any, index: any, field: any, item: CompensationSearchModule.CompensationPassengerList) {
        if (this.IsEditable == true) {
            this.transportEmpty = false;
            if (field == "") {
                this.transportEmpty = true;
                this.Validtransport[index] = true;
            }
            else {
                this.transportEmpty = false;
                this.transportdirty = true;
                this.Validtransport[index] = false;
            }
            var reg = new RegExp(/^[0-9]+$/);
            var test = reg.test(field);
            console.log("flightnum" + test);
            if (test == false) {
                if (field != "") {
                    Toast.makeText(IssueCompensationWithTabComponent.NUMBERVALIDATIONTOAST).show();
                    this.isButtonEnabled = false;
                    this.Validtransport[index] = true;
                    this.transportEmpty = true;
                } else {
                    this.isButtonEnabled = false;
                    this.Validtransport[index] = true;
                }

            }
            else {
                this.transportEmpty = false;
                this.isButtonEnabled = true;
                this.Validtransport[index] = false;
                this.SelectedTransport = field;
                if (item.transportationInitialValue != field) {
                    item.isTransportOverridden = true;
                } else {
                    item.isTransportOverridden = false;
                    item.TransportOverrideReason = "";
                    item.transportationTempValue = field;
                    this.totalMonetary = 0;
                    this.totalHotel = 0;
                    this.totalMeal = 0;
                    this.totalTransport = 0;
                    this.CompPaxListNotIssued.forEach((data, index) => {
                        this.totalMonetary += Number(data.monetary);
                        this.totalHotel += Number(data.hotel);
                        this.totalMeal += Number(data.meal);
                        this.totalTransport += Number(data.transportation);
                    });
                }
            }
            if (field > item.transportationHigherLimit || field < item.transportationLowerLimit) {
                if (field != 0) {
                    this.transportEmpty = true;
                    this.isButtonEnabled = false;
                    this.IsPaxReasonSelected = false;
                    this.Validtransport[index] = true;
                    if (item.transportationLowerLimit == 0 && item.transportationHigherLimit == 0) {
                        const id = timer.setTimeout(() => {
                            item.transportation = 0;
                        }, 1000);
                        Toast.makeText(IssueCompensationWithTabComponent.COMPENSATIONNATOAST).show();
                    } else {
                        Toast.makeText(IssueCompensationWithTabComponent.MUSTBETOAST + item.transportationLowerLimit + " to " + item.transportationHigherLimit).show();
                    }
                }
            }
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
                                                        this.EmailIdSelectedPax = result.text;
                                                        this.isEmailCopytoSelectPaxTrue = true;
                                                        item.Email = result.text;
                                                        this.CompPaxList.forEach((data, Index) => {
                                                            data.Email = this.EmailIdSelectedPax;
                                                        })
                                                        console.log("Email:" + JSON.stringify(item.Email));
                                                    } else {
                                                        this.isEmailCopytoSelectPaxTrue = true;
                                                        item.Email = result.text;
                                                        this.EmailIdSelectedPax = result.text;
                                                        this.CompPaxList.forEach((paxData, Index) => {
                                                            if (paxData.IsSelected) {
                                                                paxData.Email = this.EmailIdSelectedPax;
                                                            }
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
                            // this.loaderProgress.hideLoader();

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
                        let CompaxFilteredList = new CompensationSearchModule.CompensationRootObject();
                        this.CompPaxListIssued.forEach((SelPax, Index) => {
                            CompaxList.PassengerList.forEach((AllPax, Index) => {
                                if (SelPax.OrderId == AllPax.OrderId && SelPax.GivenName == AllPax.GivenName && SelPax.LastName == AllPax.LastName && SelPax.Compensations[0].CompReasonText == AllPax.Compensations[0].CompReasonText) {
                                    CompaxFilteredList.FlightModel = CompaxList.FlightModel;
                                    CompaxFilteredList.PassengerList.push(AllPax);
                                }
                            });
                        })
                        this._shared.setCompensationList(CompaxFilteredList);
                        this.naviagatetoCompensationPrintListwithtab();
                        this.loaderProgress.hideLoader();
                    } else {
                        Toast.makeText(data.Warnings[0].Message).show();
                        this._shared.setCompensationFlightDetails(data);
                        let CompaxList = Converters.convertoCompensationPassengerList(CompPax, data, ApplicationSettings.getString("SearchLocation", ""));
                        let CompaxFilteredList = new CompensationSearchModule.CompensationRootObject();
                        this.CompPaxListIssued.forEach((SelPax, Index) => {
                            CompaxList.PassengerList.forEach((AllPax, Index) => {
                                if (SelPax.OrderId == AllPax.OrderId && SelPax.GivenName == AllPax.GivenName && SelPax.LastName == AllPax.LastName && SelPax.Compensations[0].CompReasonText == AllPax.Compensations[0].CompReasonText) {
                                    CompaxFilteredList.FlightModel = CompaxList.FlightModel;
                                    CompaxFilteredList.PassengerList.push(AllPax);
                                }
                            });
                        })
                        this._shared.setCompensationList(CompaxFilteredList);
                        this.naviagatetoCompensationPrintListwithtab();
                        this.loaderProgress.hideLoader();
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
                                                        Toast.makeText(IssueCompensationWithTabComponent.UNABLETOPRINT).show();
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
                                            Toast.makeText(IssueCompensationWithTabComponent.PRINTERSESSION).show();
                                            self.loaderProgress.hideLoader();
                                            console.log(err);
                                        });
                                } else {
                                    Toast.makeText(IssueCompensationWithTabComponent.NOBLUETOOTHDEVICE).show();
                                    this.loaderProgress.hideLoader();
                                }
                            } catch (e) {
                                Toast.makeText(IssueCompensationWithTabComponent.UNABLETOPRINT).show();
                                this.loaderProgress.hideLoader();
                            }
                        } else {
                            Toast.makeText(IssueCompensationWithTabComponent.UNABLETOPRINT).show();
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
                            Toast.makeText("Printed successfully").show();
                            this.loaderProgress.hideLoader();
                            this.getCompensationList(this.FlightHeaderInfo.DepartureDate, this.FlightHeaderInfo.FlightNumber, this.SelectedPassenger[0].Origin, "ReasonWiseGet");
                            // Toast.makeText(data.Errors[0].Message).show();
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
    overidereasonformonetary(item: CompensationSearchModule.CompensationPassengerList, n: number) {
        if (this.isButtonEnabled == true && item.isMonetaryOverridden == true) {
            var options = {
                title: "Other Details",
                message: "* required field",
                defaultText: item.MonetaryOverrideReason,
                okButtonText: "Copy to selected passenger & Save",
                cancelButtonText: "Save",
                neutralButtonText: "Cancel",
                inputType: dialogs.inputType.text
            };
            dialogs.prompt(options).then((result: dialogs.PromptResult) => {
                if (result.result != undefined) {
                    if (result.text.trim().length <= 0) {
                        this.overidereasonformonetary(item, n);
                    } else {
                        console.log("Hello, " + result.result);
                        console.log("Hello, " + result.text);
                        item.OverrideReason = result.text;
                        this.OverRideReason = result.text;
                        if (result.result == true) {
                            this.SelectedPassenger.forEach((data, Index) => {
                                data.monetary = this.SelectedMonetary;
                                data.MonetaryOverrideReason = this.OverRideReason;
                                data.monetaryTempValue = this.SelectedMonetary;
                            });
                        } else {
                            item.monetaryTempValue = this.SelectedMonetary;
                            item.MonetaryOverrideReason = this.OverRideReason;
                        }
                    }
                    this.totalMonetary = 0;
                    this.totalHotel = 0;
                    this.totalMeal = 0;
                    this.totalTransport = 0;
                    this.CompPaxListNotIssued.forEach((data, index) => {
                        this.totalMonetary += Number(data.monetary);
                        this.totalHotel += Number(data.hotel);
                        this.totalMeal += Number(data.meal);
                        this.totalTransport += Number(data.transportation);
                    });
                } else {
                    item.monetary = item.monetaryTempValue;
                }
            });
        }
    }
    overidereasonforhotel(item: CompensationSearchModule.CompensationPassengerList, n: number) {
        if (this.isButtonEnabled == true && item.isHotelOverridden == true) {
            var options = {
                title: "Other Details",
                message: "* required field",
                defaultText: item.HotelOverrideReason,
                okButtonText: "Copy to selected passenger & Save",
                cancelButtonText: "Save",
                neutralButtonText: "Cancel",
                inputType: dialogs.inputType.text
            };
            dialogs.prompt(options).then((result: dialogs.PromptResult) => {
                if (result.result != undefined) {
                    if (result.text.trim().length <= 0) {
                        this.overidereasonforhotel(item, n);
                    } else {
                        console.log("Hello, " + result.result);
                        console.log("Hello, " + result.text);
                        item.OverrideReason = result.text;
                        this.OverRideReason = result.text;
                        if (result.result == true) {
                            this.SelectedPassenger.forEach((data, Index) => {
                                data.hotel = this.SelctedHotel;
                                data.HotelOverrideReason = this.OverRideReason;
                                data.hotelTempValue = this.SelctedHotel;
                            });
                        } else {
                            item.HotelOverrideReason = this.OverRideReason;
                            item.hotelTempValue = this.SelctedHotel;
                        }
                    }
                    this.totalMonetary = 0;
                    this.totalHotel = 0;
                    this.totalMeal = 0;
                    this.totalTransport = 0;
                    this.CompPaxListNotIssued.forEach((data, index) => {
                        this.totalMonetary += Number(data.monetary);
                        this.totalHotel += Number(data.hotel);
                        this.totalMeal += Number(data.meal);
                        this.totalTransport += Number(data.transportation);
                    });
                } else {
                    item.hotel = item.hotelTempValue;
                }
            });
        }
    }
    overidereasonformeal(item: CompensationSearchModule.CompensationPassengerList, n: number) {
        if (this.isButtonEnabled == true && item.isMealOverridden == true) {
            var options = {
                title: "Other Details",
                message: "* required field",
                defaultText: item.MealOverrideReason,
                okButtonText: "Copy to selected passenger & Save",
                cancelButtonText: "Save",
                neutralButtonText: "Cancel",
                inputType: dialogs.inputType.text
            };
            dialogs.prompt(options).then((result: dialogs.PromptResult) => {
                if (result.result != undefined) {
                    if (result.text.trim().length <= 0) {
                        this.overidereasonformeal(item, n);
                    } else {
                        console.log("Hello, " + result.result);
                        console.log("Hello, " + result.text);
                        item.OverrideReason = result.text;
                        this.OverRideReason = result.text;
                        if (result.result == true) {
                            this.SelectedPassenger.forEach((data, Index) => {
                                data.meal = this.SelectedMeal;
                                data.mealTempValue = this.SelectedMeal;
                                data.MealOverrideReason = this.OverRideReason;
                            });
                        } else {
                            item.mealTempValue = this.SelectedMeal;
                            item.MealOverrideReason = this.OverRideReason;
                        }
                    }
                    this.totalMonetary = 0;
                    this.totalHotel = 0;
                    this.totalMeal = 0;
                    this.totalTransport = 0;
                    this.CompPaxListNotIssued.forEach((data, index) => {
                        this.totalMonetary += Number(data.monetary);
                        this.totalHotel += Number(data.hotel);
                        this.totalMeal += Number(data.meal);
                        this.totalTransport += Number(data.transportation);
                    });
                } else {
                    item.meal = item.mealTempValue;
                }
            });
        }
    }
    overidereasonfortransport(item: CompensationSearchModule.CompensationPassengerList, n: number) {
        if (this.isButtonEnabled == true && item.isTransportOverridden == true) {
            var options = {
                title: "Other Details",
                message: "* required field",
                defaultText: item.TransportOverrideReason,
                okButtonText: "Copy to selected passenger & Save",
                cancelButtonText: "Save",
                neutralButtonText: "Cancel",
                inputType: dialogs.inputType.text
            };
            dialogs.prompt(options).then((result: dialogs.PromptResult) => {
                if (result.result != undefined) {
                    if (result.text.trim().length <= 0) {
                        this.overidereasonfortransport(item, n);
                    } else {
                        console.log("Hello, " + result.result);
                        console.log("Hello, " + result.text);
                        item.OverrideReason = result.text;
                        this.OverRideReason = result.text;
                        if (result.result == true) {
                            this.SelectedPassenger.forEach((data, Index) => {
                                data.transportation = this.SelectedTransport;
                                data.TransportOverrideReason = this.OverRideReason;
                                data.transportationTempValue = this.SelectedTransport;
                            });
                        } else {
                            item.transportationTempValue = this.SelectedTransport;
                            item.TransportOverrideReason = this.OverRideReason;
                        }
                    }
                    this.totalMonetary = 0;
                    this.totalHotel = 0;
                    this.totalMeal = 0;
                    this.totalTransport = 0;
                    this.CompPaxListNotIssued.forEach((data, index) => {
                        this.totalMonetary += Number(data.monetary);
                        this.totalHotel += Number(data.hotel);
                        this.totalMeal += Number(data.meal);
                        this.totalTransport += Number(data.transportation);
                    });
                } else {
                    item.transportation = item.transportationTempValue;
                }
            });

        }
    }
    navigatetoadditionaldetails(Paxitem: CompensationSearchModule.CompensationPassengerList): void {
        console.log("V" + Paxitem);
        if ((this.IsEditable && Paxitem.IsSelected) || (this.CompensationIssuedList && Paxitem.IsSelected)) {
            var prePage: string = "IssueCompensationTab";
            this.routerExtensions.navigate(["compensationadditionaldetails"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                }, queryParams: {
                    "data": JSON.stringify(Paxitem),
                    "prepage": prePage,
                    "selectedPAx": JSON.stringify(this.SelectedPassenger),
                }
            })
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
    naviagatetoCompensationPrintListwithtab() {
        this.routerExtensions.navigate(["compensationprintscreen"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }, queryParams: {
                "prepage": "issueCompensation",
                "selectedPAx": JSON.stringify(this.CompPaxListIssued),
            }
        });
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
