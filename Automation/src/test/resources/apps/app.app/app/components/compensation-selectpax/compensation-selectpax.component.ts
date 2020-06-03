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
import { LoaderProgress, PassengerListTemplate, PassengerList, AccontProfileModel, CompensationOrderID, CompensationSearchModule, CompensationReasonModule } from "../../shared/interface/index"
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
    templateUrl: "./components/compensation-selectpax/compensation-selectpax.component.html",
    styleUrls: ["./components/compensation-selectpax/compensation-selectpax.component.css"]

})

export class CompensationSelectPax implements OnInit {
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
    public IsPaxReasonSelected: boolean = false;
    public AgentPrivilage: AgentPrivilage.RootObject = new AgentPrivilage.RootObject();
    public checkedCount: number = 0;
    public FlightDetails: any;
    public CompensationList: Compansation;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    public SelectedPassenger: Array<CompensationOrderID.Passenger> = [];
    public CompensationPassengerList: Array<any> = [];
    public CompensationFullPaxList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompensationModel: CompensationSearchModule.CompensationRootObject = new CompensationSearchModule.CompensationRootObject;
    public CompensationReason: Array<string> = [];
    public CompensationReasonList: Array<CompensationReasonModule.CompensationReason> = [];
    public PaxInfo: Array<CompensationOrderID.Passenger> = [];
    public CompensationOrderDetails: CompensationOrderID.RootObject = new CompensationOrderID.RootObject();
    public BreResponse: Array<CompensationOrderID.FlightSegment> = [];
    public static COMPENSATIONREASON:string= "Select Reason";
    public static COMPENSATIONREASONTOAST : string = "Compensation Reason:" ;
    constructor(private _configuration: Configuration,private _services :PassengerService, private _shared: CheckinOrderService, private page: Page, private routerExtensions: RouterExtensions, public _timeoutService: TimeOutService, private router: Router, public _dataService: DataService, public _service: CompensationService, private route: ActivatedRoute, private vcRef: ViewContainerRef, private _modalService: ModalDialogService) {
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
        this.ComensationReason = CompensationSelectPax.COMPENSATIONREASON;
        this.loaderProgress.initLoader(this.pageCont);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled", );
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled", );
        this.getCompensationReason();
        this.CompensationOrderDetails = this._shared.getCompensationOrderDeatils();
        console.log(JSON.stringify(this.CompensationOrderDetails));
        this.PaxInfo = this._shared.getCompensationPaxList();
        this.OrderId = this.CompensationOrderDetails.FlightSegments[0].Passengers[0].OrderId;
    }
    toggleChecked(Pax: CompensationOrderID.Passenger) {
        console.log("Pax:" + JSON.stringify(Pax.Isselected));
        if (Pax.Isselected == false) {
            Pax.Isselected = true;
            this.checkedCount = this.checkedCount + 1;
            this.SelectedPassenger.push(Pax);
            if (this.ComensationReason != CompensationSelectPax.COMPENSATIONREASON) {
                Pax.CompensationReason = this.ComensationReason;
                Pax.CompensationReasonId = this.CompensationReasonList.filter(m => m.CompReasonText == this.ComensationReason)[0].CompReasonId;
            }
        } else {
            this.SelectedPassenger.splice(this.SelectedPassenger.indexOf(Pax), 1);
            Pax.CompensationReason = "";
            Pax.CompensationReasonId = null;
            Pax.Isselected = false;
        }
        console.log("Pax:" + JSON.stringify(this.SelectedPassenger));
    }
    displayProductActionDialog() {
        if (this.SelectedPassenger == []) {
            Toast.makeText("Please Select the Passenger");
        } else {
            let options = {
                title: "Compensation Reason",
                cancelButtonText: "Cancel",
                actions: this.CompensationReason,
            };
            dialogs.action(options).then((result) => {
                if (result != "Cancel") {
                    this.ComensationReason = result;
                    this.PaxInfo.filter(m => m.Isselected == true).forEach((data, Index) => {
                        if (data.Isselected) {
                            data.CompensationReason = this.ComensationReason;
                            data.CompensationReasonId = this.CompensationReasonList.filter(m => m.CompReasonText == this.ComensationReason)[0].CompReasonId;
                            console.log("Obj" + JSON.stringify(data));
                        }
                    })
                }
            });
        }
    }

    getCompensationReason(): void {
        try {
            console.log("Reason 1");
            let ReasonRequest = this._shared.getAgentPrivilage();
            this.AgentPrivilage.Privileges = ReasonRequest;
            console.log("Pri:" + JSON.stringify(this.AgentPrivilage));
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetCompensationReason Service --------------- Start Date Time : ' + sDate);
            this._service.getCompensationReasons(this.AgentPrivilage)
                .subscribe(data => {
                    if (data.CompensationReason != null) {
                        let CompansationDetails: any = data;
                        CompansationDetails.CompensationReason.forEach((KeyValue, Index) => {
                            let compreason = new CompensationReasonModule.CompensationReason();
                            compreason.CompReasonText = KeyValue.CompReasonText;
                            compreason.CompReasonId = KeyValue.CompReasonId;
                            this.CompensationReasonList.push(compreason);
                            // console.log("Reason :" + JSON.stringify(this.CompensationReasonList));
                            this.CompensationReason.push(KeyValue.CompReasonText);
                        })
                        this.loaderProgress.hideLoader();
                    } else {
                        Toast.makeText(CompensationSelectPax.COMPENSATIONREASONTOAST + data.Errors[0].Message).show();
                        this.loaderProgress.hideLoader();
                    }
                },
                err => {
                    this.handleServiceError(err);
                    this.loaderProgress.hideLoader();
                });
        }
        catch (error) {
            
            console.log(error.message);
            this.loaderProgress.hideLoader();
        } finally {
            var endDate = new Date();
            console.log('CheckInPax Service --------------- End Date Time : ' + endDate);
            console.log('CheckInPax Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(endDate)));
        }

    }

    navigatetoadditionaldetails(Paxitem: CompensationOrderID.Passenger) {
        console.log("Pax:" + JSON.stringify(Paxitem));
        var prePage: string = "SearchResult";
        this.routerExtensions.navigate(["compensationadditionaldetails"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }, queryParams: {
                "data": JSON.stringify(Paxitem),
                "prepage": prePage,
            }
        })
    }
    saveEnabled(): boolean {
        if (this.SelectedPassenger && this.SelectedPassenger.length == 0) {
            this.IsPaxReasonSelected = false;
        } else {
            this.SelectedPassenger.forEach((data, index) => {
                if (data.CompensationReason != "") {
                    this.IsPaxReasonSelected = true;
                }
            })
        } if (this.IsPaxReasonSelected == true) {
            return true;
        }
        else return false;
    }
    continueEnabled(): boolean {
        if (this.SelectedPassenger && this.SelectedPassenger.length == 0) {
            this.IsPaxReasonSelected = false;
        } else {
            this.SelectedPassenger.forEach((data, index) => {
                if (data.CompensationReason != "") {
                    this.IsPaxReasonSelected = true;
                } else {
                    this.IsPaxReasonSelected = false;
                }
            })
        } if (this.IsPaxReasonSelected == true) {
            return true;
        }
        else return false;
    }
    continue() {
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('IssueCompensation Service --------------- Start Date Time : ' + sDate);
            this.SelectedPassenger = this.PaxInfo.filter(obj => obj.Isselected == true);
            if (this.SelectedPassenger.filter(m => m.CompensationReason != CompensationSelectPax.COMPENSATIONREASON)) {
                let privilage = this._shared.getAgentPrivilage();
                let IssueComptemplate: any = Converters.convertToBRERequestForOrderID(this.CompensationOrderDetails, this.SelectedPassenger, privilage, this.CompensationModel.FlightModel);
                console.log("IssueComptemplate:" + JSON.stringify(IssueComptemplate));
                this._service.postBreRequest(IssueComptemplate)
                    .subscribe(data => {
                        console.log("Data:" + JSON.stringify(data));
                        if (data.Results != [] && data.Success == true) {
                            if (data.Results[0].FlightSegments[0].Passengers[0].BRE_Compensations.length > 0 || data.Results[0].FlightSegments[0].Passengers[0].BRE_Compensations != []) {
                                this.BreResponse = Converters.convertToBREResponseForOrderId(data, this.SelectedPassenger);
                                this._shared.setCompensationPaxList(this.BreResponse[0].Passengers);
                                this._shared.setCompensationOrderDeatils(this.BreResponse);
                                console.log("BRECompResponse1:" + JSON.stringify(this.BreResponse[0].Passengers));
                                this.navigatetoissuecompensation();
                                this.loaderProgress.hideLoader();
                            } else {
                                this.loaderProgress.hideLoader();
                                Toast.makeText("Compensation not issued for this particular Reason").show();
                            }
                        } else {
                            this.loaderProgress.hideLoader();
                            Toast.makeText(data.Errors[0].Message).show();
                        }
                    }, err => {
                        this.handleServiceError(err);
                        this.loaderProgress.hideLoader();
                    });
            } else {
                Toast.makeText("Please choose the reason").show();
            }
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        } finally {
            var endDate = new Date();
            console.log('IssueCompensation Service --------------- End Date Time : ' + endDate);
            console.log('IssueCompensation Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(endDate)));
        }
    }
    // save() {
    //     try {
    //         this.loaderProgress.showLoader();
    //         var sDate = new Date();
    //         console.log('SaveCompensation Service --------------- Start Date Time : ' + sDate);
    //         this.SelectedPassenger = this.PaxInfo.filter(obj => obj.Isselected == true);
    //         let SaveComptemplate: any = Converters.convertToSaveCompensationTemplate(this.SelectedPassenger, this.CompensationModel.FlightModel);
    //         console.log("Data1:" + JSON.stringify(SaveComptemplate));
    //         this._service.saveCompensationReasons(SaveComptemplate)
    //             .subscribe(data => {
    //                 let CompansationDetails: any = data;
    //                 console.log("Data:" + JSON.stringify(data));
    //                 this.SelectedPassenger.forEach((data, index) => {
    //                     data.IsSelected = false;
    //                 });
    //             }, err => {
    //                 this.loaderProgress.hideLoader();
    //             });

    //     } catch (error) {
    //         console.log(error.message);
    //         this.loaderProgress.hideLoader();

    //     }
    //     finally {
    //         var endDate = new Date();
    //         console.log('SaveCompensation Service --------------- End Date Time : ' + endDate);
    //         console.log('SaveCompensation Service Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(endDate)));
    //     }
    // }
    navigatetoissuecompensation(): void {
        var prePage: string = "OrderId";
        this.routerExtensions.navigate(["issuecompensation"], {
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