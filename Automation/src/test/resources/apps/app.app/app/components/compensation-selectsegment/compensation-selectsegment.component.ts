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
import { LoaderProgress, PassengerListTemplate, PassengerList, AccontProfileModel, CompensationOrderID, CompensationSearchModule } from "../../shared/interface/index"
import { DataService, CheckinOrderService, PassengerService, CompensationService } from "../../shared/services/index";
import { Order, CountryCollection, FlightServiceInfo, Flight, Search, AccountProfile, APISDocument, Compansation, AgentPrivilage } from "../../shared/model/index";
import { Converters } from "../../shared/utils/index";
import { DatePickerModal, DatePicketContext } from "../../components/date-picker/date-picker-modal";
import { Configuration } from '../../app.constants';
import { AppExecutiontime } from "../../app.executiontime";
import { isAndroid, isIOS, device, screen } from "platform";
import { FQTV } from "../../shared/model/index"
import { TimeOutService } from "../../shared/services/timeOut.service";

@Component({
    selector: "compensation-selectsegment-page",
    providers: [DataService, PassengerService, Configuration, CompensationService],
    templateUrl: "./components/compensation-selectsegment/compensation-selectsegment.component.html",
    styleUrls: ["./components/compensation-selectsegment/compensation-selectsegment.component.css"]

})

export class CompensationSelectSegment implements OnInit {
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
    public OrderIdOrETKt: string;
    public AgentPrivilage: AgentPrivilage.RootObject = new AgentPrivilage.RootObject();
    public CompensationList: Compansation;
    public continueWithoutSegment: boolean = false;
    public SelectedPassenger: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompensationPassengerList: Array<any> = [];
    public CompensationFullPaxList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompensationModel: CompensationSearchModule.CompensationRootObject = new CompensationSearchModule.CompensationRootObject;
    public CompensationReasonList: Array<string> = [];
    public SelectedSegment: Array<any> = [];
    public isContinueEnabled: boolean = false;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    public SegementInfo: Array<CompensationOrderID.FlightSegment> = [];
    public CompensationOrderDetails: CompensationOrderID.RootObject = new CompensationOrderID.RootObject();
    public static COMPENSATIONSEGMENTTOAST: string = "Continue to compensate without flight";

    constructor(private _configuration: Configuration, private _services: PassengerService, private activatedRouter: ActivatedRoute, private _shared: CheckinOrderService, private page: Page, private routerExtensions: RouterExtensions, public _timeoutService: TimeOutService, private router: Router, public _dataService: DataService, public _service: CompensationService, private route: ActivatedRoute, private vcRef: ViewContainerRef, private _modalService: ModalDialogService) {
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
        this.ComensationReason = "Select Reason";
        this.loaderProgress.initLoader(this.pageCont);
        this.activatedRouter.queryParams.subscribe((params) => {
            if (params["data"] != null && params["data"] != "" && params["data"] != "undefined") {
                var OrderIdOrETK: string = params["data"];
                this.OrderIdOrETKt = OrderIdOrETK.toUpperCase();
            }
        });
        let ReasonRequest = this._shared.getAgentPrivilage();
        this.AgentPrivilage.Privileges = ReasonRequest;
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.CompensationOrderDetails = this._shared.getCompensationOrderDeatils();
        this.CompensationOrderDetails.FlightSegments.forEach((data, Index) => {
            data.IsSegSelected = false;
        })
        this.SegementInfo = this.CompensationOrderDetails.FlightSegments;
        this.OrderId = this.CompensationOrderDetails.FlightSegments[0].Passengers[0].OrderId;
        this.AgentPrivilage.Privileges.forEach((data, Index) => {
            if (data.Name == "IssueCompensationNotBasedOnFlight") {
                Toast.makeText(CompensationSelectSegment.COMPENSATIONSEGMENTTOAST).show();
            }
        })

    }
    continue() {
        if (this.SelectedSegment.length == 0) {
            this.CompensationOrderDetails.FlightSegments.forEach((SegData, SegIndex) => {
                SegData.Passengers.forEach((data, Index) => {
                    data.Isselected = false;
                    data.GivenName = data.PaxFirstNm;
                    data.LastName = data.PaxLastNm;
                    data.FullName = data.PaxFirstNm + "/" + data.PaxLastNm;
                    data.UpdateLockNbr = data.UpdateLockNbr;
                    data.IsExistingCompensation = data.IsExistingCompensation;
                    data.IsCompensationIssued = data.IsCompensationIssued;
                    data.Compensations = data.Compensations;
                    data.ExistingCompensations = data.ExistingCompensations;
                    data.CompensationReason = "";
                })
            })
            this._shared.SetPassengerTypeService(this.CompensationOrderDetails.FlightSegments[0].Passengers)
            this._shared.setCompensationPaxList(this.CompensationOrderDetails.FlightSegments[0].Passengers);
            this.navigatetoCompensationSelectPax();
        } else {
            var flightDate = this.SelectedSegment[0].DepartureDt;
            var flightNumber = this.SelectedSegment[0].FlightNo;
            var departure = this.SelectedSegment[0].Departure;
            ApplicationSettings.setString("SearchLocation", departure);
            this.flightStatus(flightDate, flightNumber, departure);
        }
    }
    continueEnabled(): boolean {
        this.AgentPrivilage.Privileges.forEach((data, Index) => {
            if (data.Name == "IssueCompensationNotBasedOnFlight") {
                this.continueWithoutSegment = true;
            }
        })
        if (this.continueWithoutSegment) {
            return true;
        } else {
            if (this.isContinueEnabled) {
                return true;
            } else {
                return false;
            }
        }
    }
    flightStatus(date, flightnumber, departure): void {
        try {
            var sDate = new Date();
            console.log('Get CompensationDetails Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            var flightddate = moment(date).format("YYYY-MM-DD");
            console.log("Date" + flightddate);
            var location = ApplicationSettings.getString("SearchLocation", "");
            this._service.status(flightddate, flightnumber, departure).subscribe((data) => {
                if (data.Flights != null) {
                    let status: any = data
                    let CompensationFlightInfo: any = Converters.convertToFlightHeaderInfo(status, departure);
                    this._shared.setCompensationFlightDetails(status);
                    var SelectedSegment = this.CompensationOrderDetails.FlightSegments.filter(m => m.FlightNo == this.SelectedSegment[0].FlightNo)[0];
                    this.CompensationOrderDetails.FlightSegments = [];
                    this.CompensationOrderDetails.FlightSegments.push(SelectedSegment);
                    console.log("v" + JSON.stringify(this.CompensationOrderDetails));
                    this._shared.setCompensationList(this.CompensationOrderDetails);
                    this._shared.SetPassengerTypeService(SelectedSegment.Passengers)
                    this.navigatetoCompensationSearchResult();
                    this.loaderProgress.hideLoader();
                } else {
                    Toast.makeText(data.Warnings[0].Message).show();
                    this._shared.setCompensationFlightDetails(data);
                    var SelectedSegment = this.CompensationOrderDetails.FlightSegments.filter(m => m.FlightNo == this.SelectedSegment[0].FlightNo)[0];
                    this.CompensationOrderDetails.FlightSegments = [];
                    this.CompensationOrderDetails.FlightSegments.push(SelectedSegment);
                    console.log("v" + JSON.stringify(this.CompensationOrderDetails));
                    this._shared.setCompensationList(this.CompensationOrderDetails);
                    this._shared.SetPassengerTypeService(SelectedSegment.Passengers)
                    this.navigatetoCompensationSearchResult();
                    this.loaderProgress.hideLoader();
                }
            },
                err => {
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
    toggleChecked(items: CompensationOrderID.FlightSegment) {
        // console.log(args);
        // var segment : CompensationOrderID.FlightSegment;
        if (items.IsSegSelected == false) {
            this.SegementInfo.forEach((data, Index) => {
                this.SelectedSegment = [];
                data.IsSegSelected = false;
            })
            if (items.FlightNo.substr(0, 2) == "CM") {
                items.IsSegSelected = true;
                this.isContinueEnabled = true;
                this.SelectedSegment.push(items);
            } else {
                items.IsSegSelected = true;
                this.isContinueEnabled = false;
                this.SelectedSegment = [];
                Toast.makeText("Not eligible for compensation").show();
            }
        } else {
            items.IsSegSelected = false;
            this.isContinueEnabled = false;
            this.SelectedSegment = [];
        }

    }

    navigatetoCompensationSelectPax(): void {
        this.routerExtensions.navigate(["compensationselectpax"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    }
    navigatetoCompensationPaxWithSeg() {
        this.routerExtensions.navigate(["compensationpaxwithseg"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
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