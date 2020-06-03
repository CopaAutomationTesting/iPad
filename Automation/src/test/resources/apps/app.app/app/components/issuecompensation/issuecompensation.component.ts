//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { ObservableArray } from "data/observable-array";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { GestureEventData } from "ui/gestures";
import { ListView, ItemEventData } from "ui/list-view";
import { StackLayout } from "ui/layouts/stack-layout";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import * as dialogs from "ui/dialogs";
import * as gestures from "ui/gestures";
import { SegmentedBar, SegmentedBarItem } from "ui/segmented-bar";
var timer = require("timer");

//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as moment from "moment";
import * as Toast from 'nativescript-toast';

//app references
import { LoaderProgress, order, PassengerListTemplate, DeparturePaxList, PassengerList, DepartureInfo1, InBound, OutBound, IssueCompensationList, CompensationSearchModule, CompensationOrderID } from "../../shared/interface/index"
import { Passenger, Order, Inventory, CountryCollection, BRECompensation, } from '../../shared/model/index';
import { DataService, CheckinOrderService, PassengerService, CompensationService, } from "../../shared/services/index";
import { Converters } from "../../shared/utils/index";
import { AppExecutiontime } from "../../app.executiontime";
import { Configuration } from '../../app.constants';


@Component({
    selector: "compensationadditionaldetails-page",
    providers: [DataService, PassengerService, Configuration, CompensationService],
    templateUrl: "./components/issuecompensation/issuecompensation.component.html",
    styleUrls: ["./components/issuecompensation/issuecompensation.component.css"]

})

export class IssueCompensationComponent implements OnInit {
    @ViewChild('pagecontainer') pageCont: ElementRef;
    public CompensationPassengerList: Array<IssueCompensationList> = [];
    public FlightInfoNotSet: boolean = false;
    public loaderProgress: LoaderProgress;
    public FlightHeaderInfo: CompensationSearchModule.FlightModel = new CompensationSearchModule.FlightModel();
    public IssueCompensationResponse: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public IssueCompensationPaxList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public IssueCompensationFullPaxList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public SelectedPassenger: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompensationReason: any;
    public SearchCriteria: any = "Name";
    public PassengerFliterCriteria: any = "All Passengers";
    public IsPaxReasonSelected: boolean = false;
    public MonetraryEmpty: boolean = false;
    public Monetarydirty: boolean = false;
    public hotelEmpty: boolean = false;
    public hoteldirty: boolean = false;
    public mealEmpty: boolean = false;
    public OverrideReason: string;
    public userdetails: any;
    public OrderId: any;
    public isPrevDaySalesReportNotClosed: boolean = false;
    // public IsEditEnabled : boolean = false;
    public ValidMonetary: Array<boolean> = [];
    public ValidHotel: Array<boolean> = [];
    public ValidMeal: Array<boolean> = [];
    public Validtransport: Array<boolean> = [];
    public TotalPassengerCount: number = 0;
    public selectedPassengerCount: number = 0;
    public mealdirty: boolean = false;
    public SelectAllPax: boolean = false;
    public SelectAllPaxVar: boolean =false;
    public CopySelected: boolean = false;
    public transportEmpty: boolean = false;
    public transportdirty: boolean = false;
    public isOverrideReasonBlank: boolean = false;
    public SelectedMonetary: any;
    public SelctedHotel: any;
    public SelectedMeal: any;
    public OverRideReason: any;
    public SelectedPaxcount: number = 0;
    public SelectedTransport: any;
    IsEditable: boolean = false;
    public copyToAllPax: boolean = false;
    public IsHeaderInfo: boolean = false;
    public IsFlightInfo: boolean = false;
    public PreviousPage: any;
    public totalMonetary: number = 0;
    public totalHotel: number = 0;
    public totalMeal: number = 0;
    public totalTransport: number = 0;
    public isButtonEnabled: boolean = false;
    IsLabelField: boolean = true;
    public nameSortIndicator: number = -1;
    public ssrSortIndicator: number = -1;
    public tierSortIndicator: number = -1;
    public classSortIndicator: number = -1;
    public orderIdSortIndicator: number = -1;
    public BREInitialMonetaryValue: number;
    public BREInitialHotelValue: number;
    public BREInitialMealValue: number;
    public selectedEMDs: number = 0;
    public BREInitialTransportValue: number;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    public CompensationOrderDetails: Array<CompensationOrderID.FlightSegment> = [];
    public static MaxEMDIssued: number = 50;
    public static ISSUECOMPENSATIONTOAST: string = "Are you ready to issue compensation?";
    public static NUMBERVALIDATIONTOAST: string = "Invalid. Enter value in numbers";
    public static COMPENSATIONNATOAST: string = "Compensation not applicable";
    public static MUSTBETOAST: string = "Must be:";

    constructor(private _configuration: Configuration, private _services: PassengerService, private activatedRouter: ActivatedRoute, private _shared: CheckinOrderService, private page: Page, private routerExtensions: RouterExtensions, private router: Router, public _dataService: DataService, public _service: CompensationService, private route: ActivatedRoute, private vcRef: ViewContainerRef, private _modalService: ModalDialogService) {
        this.loaderProgress = new LoaderProgress();
    }
    ngOnInit() {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
        console.log("Flight" + JSON.stringify(this.FlightHeaderInfo));
        this.IssueCompensationResponse = this._shared.getCompensationPaxList();
        this.loaderProgress.initLoader(this.pageCont);
        this.IssueCompensationPaxList = this.IssueCompensationResponse;
        this.IssueCompensationFullPaxList = this.IssueCompensationPaxList;
        this.IssueCompensationPaxList.forEach((data, index) => {
            this.totalMonetary = this.totalMonetary + data.monetary;
            this.totalHotel += data.hotel;
            this.totalMeal += data.meal;
            this.totalTransport += data.transportation;
            this.ValidMonetary.push(false);
            this.ValidHotel.push(false);
            this.ValidMeal.push(false);
            this.Validtransport.push(false);
            // this.BREInitialMonetaryValue = data.monetary;
            // this.BREInitialHotelValue = data.hotel;
            // this.BREInitialMealValue = data.meal;
            // this.BREInitialTransportValue = data.transportation;
        })
        this.TotalPassengerCount = this.IssueCompensationPaxList.length;
        this.isButtonEnabled = true;
        this.activatedRouter.queryParams.subscribe((params) => {
            this.PreviousPage = params["prepage"];
            this.OrderId = params["data"];
            console.log("v" + JSON.stringify(this.OrderId));
        })
        console.log("v" + JSON.stringify(this.OrderId));
        console.log("r" + JSON.stringify(this.PreviousPage));
        if (this.PreviousPage == "OrderId") {
            this.IsHeaderInfo = true;
            this.IsFlightInfo = false;
            this.CompensationOrderDetails = this._shared.getCompensationOrderDeatils();
            console.log("V" + JSON.stringify(this.CompensationOrderDetails));
        }
        else {
            this.IsHeaderInfo = false;
            this.IsFlightInfo = true;
        }
        this.IssueCompensationPaxList.forEach((data, index) => { data.IsSelected = false; });
        if (this.FlightHeaderInfo == null || this.FlightHeaderInfo == undefined) {
            console.log("flag");
            this.FlightInfoNotSet = true;
        }
        this.getSalesReport();
    }
    getSalesReport() {
        this.loaderProgress.showLoader();
        this._service.getSaleOfficeReport().subscribe((data) => {
            console.log("Sales report:" + JSON.stringify(data));
            if (data.HasOpenPastDueSalesReports) {
                this.isPrevDaySalesReportNotClosed = true;
                this.loaderProgress.hideLoader();
                Toast.makeText("Close previous day Sales Reporting to proceed.").show();
            }
            this.loaderProgress.hideLoader();

        }, err => {
            console.log("Couldnt find information" + err);
            this.handleServiceError(err);
            this.loaderProgress.hideLoader();
        })
    }
    editable(): void {
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
            this.IsEditable = true;
            this.IsLabelField = false;
            console.log("Edit: " + this.IsEditable);
            console.log("Done:" + this.IsLabelField);
        }
    }
    filter(args: any) {
        console.log("Name:" + JSON.stringify(args));
        // this.CompensationPassengerList = this.CompensationFullPaxList;
        this.IssueCompensationPaxList = this.IssueCompensationFullPaxList;
        if (this.SearchCriteria == "Name") {
            if (args) {
                let name = args.toString().toUpperCase();
                this.IssueCompensationPaxList = this.IssueCompensationPaxList.filter(r => r.GivenName.indexOf(name.trim()) >= 0 || r.LastName.indexOf(name.trim()) >= 0);
            } else {
                this.IssueCompensationPaxList = this.IssueCompensationFullPaxList;
            }
        } else if (this.SearchCriteria == "Order ID") {
            if (args) {
                let name = args.toString().toUpperCase();
                this.IssueCompensationPaxList = this.IssueCompensationPaxList.filter(r => r.OrderId.indexOf(name.trim()) >= 0);
            } else {
                this.IssueCompensationPaxList = this.IssueCompensationFullPaxList;
            }
        } else {
            if (args) {
                let name = args.toString().toUpperCase();
                this.IssueCompensationPaxList = this.IssueCompensationPaxList.filter(r => r.Cabin.indexOf(name.trim()) >= 0);
            } else {
                this.IssueCompensationPaxList = this.IssueCompensationFullPaxList;
            }
        }
        this.TotalPassengerCount = this.IssueCompensationPaxList.length;
        if (this.SelectedPassenger.length == this.IssueCompensationFullPaxList.length) {
            this.SelectAllPax = true;
        } else {
            this.SelectAllPax = false;
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
                if (this.selectedEMDs > IssueCompensationComponent.MaxEMDIssued) {
                    data.IsSelected = false;
                    // this.SelectedPassenger.splice(this.SelectedPassenger.indexOf(data), 1)
                }


            })
            this.SelectedPassenger = [];
            this.IssueCompensationPaxList.forEach((paxData, Index) => {
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
            this.SelectedPaxcount = this.SelectedPassenger.length;
            console.dir(this.SelectedPassenger);
            console.log("Edit: " + this.IsEditable);
            console.log("Done:" + this.IsLabelField);
        }
    }
    continueEnabled(): boolean {
        // console.log("Button :" + JSON.stringify( this.IsPaxReasonSelected));
        var isInEligiblePaxSelected: boolean = false;
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
                        isInEligiblePaxSelected = true;
                        this.IsPaxReasonSelected = false;
                    } else {
                        this.IsPaxReasonSelected = true;
                    }
                })
            }

        } if (this.IsPaxReasonSelected && !this.isPrevDaySalesReportNotClosed && !isInEligiblePaxSelected) {
            return true;
        }
        else return false;
    }
    isEditEnabled(): boolean {
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
            return true;
        } else return false;
    }
    toggleChecked(pax: CompensationSearchModule.CompensationPassengerList) {
        console.log("Count:" + this.selectedEMDs);
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
                }
                else {
                    if (pax.monetary) {
                        if ((this.selectedEMDs + Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation) + 1) <= IssueCompensationComponent.MaxEMDIssued) {
                            pax.IsSelected = true;
                            this.SelectedPassenger.push(pax);
                            this.selectedEMDs += Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation) + 1;
                        }
                    } else {
                        if ((this.selectedEMDs + Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation)) <= IssueCompensationComponent.MaxEMDIssued) {
                            pax.IsSelected = true;
                            this.SelectedPassenger.push(pax);
                            this.selectedEMDs += Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation);
                        }
                    }
                }

                if (this.IssueCompensationFullPaxList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
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
        this.SelectedPaxcount = this.SelectedPassenger.length;
        this.selectedPassengerCount = this.SelectedPassenger.length;
        console.log("Count1:" + this.selectedEMDs);
        console.log(this.SelectedPassenger);
    }


    issueCompensationConfirmation() {
        dialogs.confirm(IssueCompensationComponent.ISSUECOMPENSATIONTOAST).then(result => {
            console.log("Dialog result: " + result);
            if (result) {
                this.issueCompensation();
            }
        });
    }
    issueCompensationForOrderIdConfirmation() {
        dialogs.confirm(IssueCompensationComponent.ISSUECOMPENSATIONTOAST).then(result => {
            console.log("Dialog result: " + result);
            if (result) {
                this.issueCompensationForOrderId();
            }
        });
    }
    onChangeForAmount(args: any, index: any, field: any, item: CompensationSearchModule.CompensationPassengerList) {
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
            // console.log("flightnum" + test);
            if (test == false) {
                if (field != "") {
                    this.ValidMonetary[index] = true;
                    Toast.makeText(IssueCompensationComponent.NUMBERVALIDATIONTOAST).show();
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
                    this.IssueCompensationPaxList.forEach((data, index) => {
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
                        Toast.makeText(IssueCompensationComponent.COMPENSATIONNATOAST).show();
                    } else {
                        Toast.makeText(IssueCompensationComponent.MUSTBETOAST + item.monetaryLowerLimit + " to " + item.monetaryHigherLimit).show();
                    }
                }
            }
            // console.log("V:" + JSON.stringify(this.MonetraryEmpty));
            // console.log("R:" + JSON.stringify(this.Monetarydirty));
            // }// item.IsSelected = true;
        }
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
            // console.log("flightnum" + test);
            if (test == false) {
                if (field != "") {
                    Toast.makeText(IssueCompensationComponent.NUMBERVALIDATIONTOAST).show();
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
                    this.IssueCompensationPaxList.forEach((data, index) => {
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
                        Toast.makeText(IssueCompensationComponent.COMPENSATIONNATOAST).show();
                    } else {
                        Toast.makeText(IssueCompensationComponent.MUSTBETOAST + item.hotelLowerLimit + " to " + item.hotelHigherLimit).show();
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
            // console.log("flightnum" + test);
            if (test == false) {
                if (field != "") {
                    Toast.makeText(IssueCompensationComponent.NUMBERVALIDATIONTOAST).show();
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
                    this.IssueCompensationPaxList.forEach((data, index) => {
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
                        Toast.makeText(IssueCompensationComponent.COMPENSATIONNATOAST).show();
                    } else {
                        Toast.makeText(IssueCompensationComponent.MUSTBETOAST + item.mealLowerLimit + " to " + item.mealHigherLimit).show();
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
            // console.log("flightnum" + test);
            if (test == false) {
                if (field != "") {
                    Toast.makeText(IssueCompensationComponent.NUMBERVALIDATIONTOAST).show();
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
                    this.IssueCompensationPaxList.forEach((data, index) => {
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
                        Toast.makeText(IssueCompensationComponent.COMPENSATIONNATOAST).show();
                    } else {
                        Toast.makeText(IssueCompensationComponent.MUSTBETOAST + item.transportationLowerLimit + " to " + item.transportationHigherLimit).show();
                    }
                }
            }
        }
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
                if (data.BadRequest != 400) {
                    if (data.Results) {
                        var IssueCompensationResponse = Converters.convertToIssueCompensationResponse(data, this.IssueCompensationFullPaxList);
                        this._shared.setCompensationPaxList(IssueCompensationResponse);
                        this.navigatetoissuecompensation();
                        this.loaderProgress.hideLoader();
                        Toast.makeText(data.Errors[0].Message).show();
                        Toast.makeText(data.Warnings[0].Message).show();
                    } else {
                        Toast.makeText(data.Errors[0].Message).show();
                        this.loaderProgress.hideLoader();
                    }
                } else {
                    Toast.makeText(data.errMessage).show();
                    this.loaderProgress.hideLoader();
                }
            }, err => {
                // var flightDate =  moment(this.FlightHeaderInfo.DepartureDate).format("YYYY-MM-DD");;
                // var flightNumber =this.FlightHeaderInfo.FlightNumber;
                // var AgentLocation = ApplicationSettings.getString("SearchLocation","");
                // var PaxType= "Compensation List";
                // console.log(flightDate);
                // console.log(flightNumber);
                // console.log(AgentLocation);
                // console.log(PaxType);
                // this.getCompensationList(flightDate, flightNumber, AgentLocation, PaxType);
                console.log("Couldnt find information" + err);
                this.handleServiceError(err);
                this.loaderProgress.hideLoader();
            })
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
                        Toast.makeText("Network Error").show();
                        this.loaderProgress.hideLoader();
                        // this.clear();
                    } else {
                        var IssueCompensationResponse = Converters.convertToIssueCompensationResponse(data, this.IssueCompensationFullPaxList);
                        this._shared.setCompensationPaxList(IssueCompensationResponse);
                        this.navigatetoissuecompensation();
                        this.loaderProgress.hideLoader();
                        // this.flightStatusForCompensationList(CompansationDetails);
                    }
                } else {
                    if (data.Errors[0].Message == "Data not found") {
                        Toast.makeText("No passenger found").show();
                    } else {
                        Toast.makeText(data.Errors[0].Message).show();
                    }
                    this.loaderProgress.hideLoader();
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
  
    sortBasedOnPaxName() {
        var isAsc: number = this.nameSortIndicator == 0 ? 1 : 0;
        this.nameSortIndicator = this.nameSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.IssueCompensationPaxList.sort(function (a, b) {
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
        this.IssueCompensationPaxList.sort(function (a, b) {
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
        this.IssueCompensationPaxList.sort(function (a, b) {
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
        this.IssueCompensationPaxList.sort(function (a, b) {
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
        this.IssueCompensationPaxList.sort(function (a, b) {
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
    issueCompensationForOrderId() {
        try {
            this.loaderProgress.showLoader();
            this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
            var startDate = new Date();
            var CurDate = moment(startDate).format("YYYY-MM-DD");
            console.log(CurDate)
            let IssueCompensationStructure = Converters.convertToIssueCompensationForOrderId(this.CompensationOrderDetails, this.SelectedPassenger, this.FlightHeaderInfo, CurDate);
            console.log("IssueCompensation Req:" + JSON.stringify(IssueCompensationStructure));
            this._service.PostIssueCompensations(IssueCompensationStructure).subscribe((data) => {
                console.log("IssueCompensation Res:" + JSON.stringify(data));
                if (data.BadRequest != 400) {
                    if (data.Results) {
                        var IssueCompensationResponse = Converters.convertToIssueCompensationResponse(data, this.SelectedPassenger);
                        this._shared.setCompensationPaxList(IssueCompensationResponse);
                        this.navigatetoissuecompensationForOrderId();
                        this.loaderProgress.hideLoader();
                        Toast.makeText(data.Errors[0].Message).show();
                    } else {
                        Toast.makeText(data.Errors[0].Message).show();
                        this.loaderProgress.hideLoader();
                    }
                } else {
                    Toast.makeText(data.errMessage).show();
                    this.loaderProgress.hideLoader();
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
    }
    selectingAllPax() {
        if (this.IsLabelField == true) {
            // this.selectedEMDs = 0;
            // this.SelectedPassenger = [];
            // this.IssueCompensationPaxList.forEach((data, Index) => {
            //     data.IsSelected = false;
            // })
            // this.IssueCompensationFullPaxList.forEach((data, Index) => {
            //     data.IsSelected = false;
            // })
            var isIneligibleSelected = false;
            if (this.SelectAllPax == false && this.SelectAllPaxVar == false) {
                this.SelectAllPaxVar = true;
                var exceedLimit: boolean = false;
                this.IssueCompensationPaxList.forEach((data, index) => {
                    if (!data.IsSelected) {
                        var totalEmds: number = 0;
                        if (data.monetary) {
                            totalEmds = Number(this.selectedEMDs) + Number(data.hotel) + Number(data.meal) + Number(data.transportation) + 1;
                        } else {
                            totalEmds = Number(this.selectedEMDs) + Number(data.hotel) + Number(data.meal) + Number(data.transportation);
                        }
                        if (totalEmds <= IssueCompensationComponent.MaxEMDIssued) {
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
                    Toast.makeText(IssueCompensationComponent.MaxEMDIssued + " EMD's selected").show();
                }
            } else {
                this.SelectAllPaxVar = false;
                this.SelectAllPax = false;
                this.IssueCompensationFullPaxList.forEach((data, index) => {
                    data.IsSelected = false;
                });
                this.IssueCompensationPaxList.forEach((data, index) => {
                    data.IsSelected = false;
                    this.SelectedPassenger = [];
                    this.selectedEMDs = 0;
                })
            }
            if (this.IssueCompensationFullPaxList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
        }
        if(isIneligibleSelected){
            Toast.makeText("Ineligible Passenger(s) are not selected.").show();
        }
        this.SelectedPaxcount = this.SelectedPassenger.length;
        this.selectedPassengerCount = this.SelectedPassenger.length;
        console.log(this.SelectedPassenger);
    }
    // onBlur(args) {
    //     // blur event will be triggered when the user leaves the TextField
    //     // const textField = args.object;
    //     // textField.dismissSoftInput();
    //     this.overidereasonformeal(args,3);
    //     console.log("onBlur event");
    // }
    navigatetoadditionaldetails(Paxitem: CompensationSearchModule.CompensationPassengerList): void {
        if (this.IsEditable == true && Paxitem.IsSelected == true) {
            // Paxitem.IsSelected = true;
            var prePage: string = "BREPage";
            console.log("V" + Paxitem);
            this.routerExtensions.navigate(["compensationadditionaldetails"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                }, queryParams: {
                    "data": JSON.stringify(Paxitem),
                    "selectedPAx": JSON.stringify(this.SelectedPassenger),
                    "prepage": prePage,
                }
            })
        }
    }
    navigatetoissuecompensation(): void {
        this.routerExtensions.navigate(["issuecompensationwithtab"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }, queryParams: {
                "data": this.OrderId,
                // "prepage": prePage,
            }
        })

    }
    navigatetoissuecompensationForOrderId(): void {
        var prePage: string = "OrderId";
        this.routerExtensions.navigate(["issuecompensationwithtab"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }, queryParams: {
                "data": this.OrderId,
                "prepage": prePage,
            }
        })

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
                    this.IssueCompensationPaxList.forEach((data, index) => {
                        this.totalMonetary += Number(data.monetary);
                        this.totalHotel += Number(data.hotel);
                        this.totalMeal += Number(data.meal);
                        this.totalTransport += Number(data.transportation);
                    });
                } else {
                    item.monetary = item.monetaryTempValue;
                    item.isMonetaryOverridden = false;
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
                    this.IssueCompensationPaxList.forEach((data, index) => {
                        this.totalMonetary += Number(data.monetary);
                        this.totalHotel += Number(data.hotel);
                        this.totalMeal += Number(data.meal);
                        this.totalTransport += Number(data.transportation);
                    });
                } else {
                    item.hotel = item.hotelTempValue;
                    item.isHotelOverridden = false;
                }
            });
            this.selectedEMDs = 0;
            this.IssueCompensationPaxList.forEach((data, index) => {
                this.SelectedPassenger.forEach((pax, Index) => {
                    if (pax.monetary) {
                        this.selectedEMDs = Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation) + 1;
                    } else {
                        this.selectedEMDs = Number(pax.hotel) + Number(pax.meal) + Number(pax.transportation);
                    }
                    if (this.selectedEMDs > IssueCompensationComponent.MaxEMDIssued) {
                        this.SelectedPassenger = [];
                        data.IsSelected = false;

                    }
                })
            })
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
                    this.IssueCompensationPaxList.forEach((data, index) => {
                        this.totalMonetary += Number(data.monetary);
                        this.totalHotel += Number(data.hotel);
                        this.totalMeal += Number(data.meal);
                        this.totalTransport += Number(data.transportation);
                    });
                } else {
                    item.meal = item.mealTempValue;
                    item.isMealOverridden = false;
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
                    this.IssueCompensationPaxList.forEach((data, index) => {
                        this.totalMonetary += Number(data.monetary);
                        this.totalHotel += Number(data.hotel);
                        this.totalMeal += Number(data.meal);
                        this.totalTransport += Number(data.transportation);
                    });
                } else {
                    item.transportation = item.transportationTempValue;
                    item.isTransportOverridden = false;
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
