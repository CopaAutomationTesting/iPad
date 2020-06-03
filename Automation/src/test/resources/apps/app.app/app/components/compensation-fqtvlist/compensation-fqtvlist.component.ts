//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
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

//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as moment from "moment";
import * as Toast from 'nativescript-toast';

//app references
import { LoaderProgress, PassengerListTemplate, PassengerList, AccontProfileModel, CompensationOrderID, CompensationSearchModule ,OrderFQTVStatus} from "../../shared/interface/index"
import { DataService, CheckinOrderService, PassengerService, CompensationService } from "../../shared/services/index";
import { Order, CountryCollection, FlightServiceInfo, Flight, Search, AccountProfile, APISDocument, Compansation } from "../../shared/model/index";
import { Converters } from "../../shared/utils/index";
import { DatePickerModal, DatePicketContext } from "../../components/date-picker/date-picker-modal";
import { Configuration } from '../../app.constants';
import { AppExecutiontime } from "../../app.executiontime";
import { isAndroid, isIOS, device, screen } from "platform";
import { FQTV } from "../../shared/model/index"
import { TimeOutService } from "../../shared/services/timeOut.service";

@Component({
    selector: "compensation-fqtvlist-page",
    providers: [DataService, PassengerService, Configuration, CompensationService],
    templateUrl: "./components/compensation-fqtvlist/compensation-fqtvlist.component.html",
    styleUrls: ["./components/compensation-fqtvlist/compensation-fqtvlist.component.css"]

})

export class CompensationFQTVList implements OnInit {
    @ViewChild('pagecontainer') pageCont: ElementRef;
    public isError: boolean;
    public errorMessage: string;
    public loaderProgress: LoaderProgress;
    public startDate: Date;
    public SearchFields: Search = new Search();
    public CurDate: Date;
    public userdetails: any;
    public ComensationReason: any;
    public OrderId: any;
    public checkedCount: number = 0;
    public FlightDetails: any;
    public FQTVNum: any;
    public FlightNumber : any;
    public FLightDate : any;
    public CompensationList: Compansation;
    public SelectedPassenger: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompensationPassengerList: Array<any> = [];
    public CompensationFullPaxList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompensationModel: CompensationSearchModule.CompensationRootObject = new CompensationSearchModule.CompensationRootObject;
    public CompensationReasonList: Array<string> = [];
    public SegementInfo: Array<CompensationOrderID.FlightSegment> = [];
    public CompensationOrderDetails: Array<OrderFQTVStatus>=[];
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    public CompensationOrderList : CompensationOrderID.RootObject = new CompensationOrderID.RootObject();
    constructor(private _configuration: Configuration, private _services :PassengerService,private activatedRouter: ActivatedRoute,private _shared: CheckinOrderService, private page: Page, private routerExtensions: RouterExtensions, public _timeoutService: TimeOutService, private router: Router, public _dataService: DataService, public _service: CompensationService, private route: ActivatedRoute, private vcRef: ViewContainerRef, private _modalService: ModalDialogService) {
        this.isError = false;
        this.errorMessage = "";
        this.SearchFields.FlightDate = moment().format("DD MMMM YYYY");
        this.CurDate = moment().toDate();
        this.startDate = new Date();
        this.loaderProgress = new LoaderProgress();
    }
    ngOnInit() {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        // this.ComensationReason = "Select Reason";
        this.loaderProgress.initLoader(this.pageCont);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled", );
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled", );
        this.activatedRouter.queryParams.subscribe((params) => {
            if (params["data"] != null && params["data"] != "" && params["data"] != "undefined") {
                this.FQTVNum = params["data"];
            }
        });
        this.CompensationOrderDetails = this._shared.getCompensationFQTVStatusDetails();
        this.CompensationOrderDetails[0].Destination;
    }
    continue(){
        this.getPassengerOrderDetails(this.OrderId);
    }
    toggleChecked(item: OrderFQTVStatus) {
        this.CompensationOrderDetails.forEach((data, Index) => {
            data.IsSelected = false;
        })
        item.IsSelected = true;
        this.FlightNumber = item.FlightNumber;
        this.FLightDate = item.FlightDate;
        this.OrderId = item.OrderID;
    }
    //  getPassengerOrderDetails(orderID: string): void {
    //     try {
    //         this.loaderProgress.showLoader();
    //         var sDate = new Date();
    //         console.log('Get GetPassengerOrderDetails Service --------------- Start Date Time : ' + sDate);
    //         this._service.getPassengerByOrder(orderID)
    //             .subscribe(data => {
    //                 if (data.FlightSegments) {
    //                     this.CompensationOrderList = data;
    //                     // this.flightStatus();
    //                     var eDate = new Date();
    //                     console.log('Get GetPassengerOrderDetails Service --------------- End Date Time : ' + eDate);
    //                     console.log('Get GetPassengerOrderDetails Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
    //                 } else {
    //                     Toast.makeText("No Reservation found").show();
    //                     this.loaderProgress.hideLoader();
    //                 }
    //             },
    //             err => {
    //                 this.loaderProgress.hideLoader();
    //             });
    //     } catch (error) {
    //         console.log(error.message);
    //         this.loaderProgress.hideLoader();
    //     }

    // }
    getPassengerOrderDetails(orderID: string): void {
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetPassengerOrderDetails Service --------------- Start Date Time : ' + sDate);
            this._service.getPassengerByOrder(orderID)
                .subscribe(data => {
                    if (data.BadRequest == 400) {
                        console.log("1 bad");
                        Toast.makeText(data.ErrorMessage).show();
                    } else {
                        if (data.FlightSegments) {
                            let CompansationDetails: any = data;
                            console.dir(CompansationDetails);
                            // let CompensationPassengers: any = Converters.ConvertToCompPaxTemplateByOrderId(CompansationDetails);
                            // console.dir(CompensationPassengers);
                            this._shared.setCompensationOrderDeatils(CompansationDetails);
                            this.loaderProgress.hideLoader();
                            this.navigatetoCompensationSelectSegment();
                            var eDate = new Date();
                            console.log('Get GetPassengerOrderDetails Service --------------- End Date Time : ' + eDate);
                            console.log('Get GetPassengerOrderDetails Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
                        } else {
                            Toast.makeText("DATA NOT FOUND").show();
                            // this.clear();
                            this.loaderProgress.hideLoader();
                        }
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

    }
   
    navigatetoCompensationSelectSegment() {
        this.routerExtensions.navigate(["compensationselectsegment"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },queryParams: {
                "data": this.OrderId
            }
        });
    }
    navigatetoCompensationSearchResult(): void {
        this.routerExtensions.navigate(["compensationresult"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    }
    navigateToCompensation(){
        this.routerExtensions.navigate(["compensation"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        })
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