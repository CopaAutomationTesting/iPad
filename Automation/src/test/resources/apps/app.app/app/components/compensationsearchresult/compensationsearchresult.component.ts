//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { Page } from "ui/page";
import dialogs = require("ui/dialogs")
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
import { CreatingListPickerComponent } from "../../components/country/country-modal";
import { LoaderProgress, PassengerListTemplate, PassengerList, AccontProfileModel, CompensationSearchModule, CompensationReasonModule } from "../../shared/interface/index"
import { DataService, CheckinOrderService, PassengerService, CompensationService } from "../../shared/services/index";
import { Order, CountryCollection, FlightServiceInfo, Flight, Search, AccountProfile, APISDocument, Compansation, CompensationPaxList, AgentPrivilage, PassengerTypeModel } from "../../shared/model/index";
import { Converters } from "../../shared/utils/index";
import { DatePickerModal, DatePicketContext } from "../../components/date-picker/date-picker-modal";
import { Configuration } from '../../app.constants';
import { AppExecutiontime } from "../../app.executiontime";
import { isAndroid, isIOS, device, screen } from "platform";
import { FQTV } from "../../shared/model/index"
import { TimeOutService } from "../../shared/services/timeOut.service";

@Component({
    selector: "compensationsearch-page",
    providers: [DataService, PassengerService, Configuration, CompensationService],
    templateUrl: "./components/compensationsearchresult/compensationsearchresult.component.html",
    styleUrls: ["./components/compensationsearchresult/compensationsearchresult.component.css"]

})

export class CompensationSearchResultComponent implements OnInit {
    @ViewChild('pagecontainer') pageCont: ElementRef;
    @ViewChild('Scroller') Scroller: ElementRef;
    public isError: boolean;
    public errorMessage: string;
    public loaderProgress: LoaderProgress;
    public startDate: Date;
    public SearchFields: Search = new Search();
    public CurDate: Date;
    public userdetails: any;
    public ComensationReason: any;
    public PassengerTypeList: PassengerTypeModel.RootObject = new PassengerTypeModel.RootObject();
    public SelectAllPax: boolean = false;
    public SelectAllPaxVar: boolean = false;
    public checkedCount: number = 0;
    public FlightDetails: any;
    public PassengerType: any;
    public TotalPassengerCount: number = 0;
    public selectedPassengerCount: number = 0;
    public SearchCriteria: any = "Name";
    public PassengerFliterCriteria: any = "All Passengers";
    public AgentPrivilage: AgentPrivilage.RootObject = new AgentPrivilage.RootObject();
    public IsPaxReasonSelected: boolean = false;
    public CompensationReasonList: Array<CompensationReasonModule.CompensationReason> = [];
    public CompensationList: CompensationPaxList.RootObject;
    public SelectedPassenger: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompensationPassengerList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompensationFullPaxList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompensationModel: CompensationSearchModule.CompensationRootObject = new CompensationSearchModule.CompensationRootObject;
    public CompensationReason: Array<string> = [];
    public nameSortIndicator: number = -1;
    public ssrSortIndicator: number = -1;
    public tierSortIndicator: number = -1;
    public classSortIndicator: number = -1;
    public orderIdSortIndicator: number = -1;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    public showSmartSearchField: boolean = true;
    public static COMPENSATIONREASON: string = "Select Reason";
    public static COMPENSATIONREASONTOAST: string = "Compensation Reason:";

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
        this.ComensationReason = CompensationSearchResultComponent.COMPENSATIONREASON;
        this.loaderProgress.initLoader(this.pageCont);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.FlightDetails = this._shared.getCompensationFlightDetails();
        this.CompensationList = this._shared.getCompensationList();
        console.log("before flight convertor");
        console.log(ApplicationSettings.getString("SearchLocation", ""));
        this.CompensationModel = Converters.convertoCompensationPassengerList(this.CompensationList, this.FlightDetails, ApplicationSettings.getString("SearchLocation", ""));
        this._shared.setFlightHeaderInfo(this.CompensationModel.FlightModel);
        this._shared.setCompensationPaxList(this.CompensationModel.PassengerList);
        console.log("Came here");
        this.CompensationPassengerList = this._shared.getCompensationPaxList();
        console.dir(this.CompensationPassengerList);
        this.TotalPassengerCount = this.CompensationPassengerList.length;
        this.CompensationFullPaxList = this.CompensationPassengerList;
        this.activatedRouter.queryParams.subscribe((params) => {
            if (params["data"] != null && params["data"] != "" && params["data"] != "undefined") {
                this.PassengerType = params["data"];
            }
        });
        this.getCompensationReason();
    }
    toggleChecked(pax: CompensationSearchModule.CompensationPassengerList) {
        if (pax.IsSelected == false) {
            pax.IsSelected = true;
            this.SelectedPassenger.push(pax);
            if (this.ComensationReason != CompensationSearchResultComponent.COMPENSATIONREASON) {
                pax.CompensationReason = this.ComensationReason;
                pax.CompensationReasonId = this.CompensationReasonList.filter(m => m.CompReasonText == this.ComensationReason)[0].CompReasonId;
            }
            if (this.CompensationFullPaxList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
        } else {
            this.SelectedPassenger.splice(this.SelectedPassenger.indexOf(pax), 1);
            if (pax.Compensations == null) {
                pax.CompensationReason = "";
                pax.CompensationReasonId = null;
            } else {
                this.CompensationPassengerList.forEach((data, Index) => {
                    if (data.GivenName == pax.GivenName && data.LastName == pax.LastName && data.OrderId == pax.OrderId) {
                        pax.CompensationReason = data.Compensations[0].CompReasonText;
                        pax.CompensationReasonId = data.Compensations[0].CompReasonId;
                    }
                })
            }
            this.IsPaxReasonSelected = false;
            pax.IsSelected = false;
            this.SelectAllPax = false;

        }
        this.selectedPassengerCount = this.SelectedPassenger.length;
        console.log(JSON.stringify(this.SelectedPassenger.length));
    }
    filter(args: any) {
        console.log("Name:" + JSON.stringify(args));
        this.CompensationPassengerList = this.CompensationFullPaxList;
        if (this.SearchCriteria == "Name") {
            if (args) {
                let name = args.toString().toUpperCase();
                this.CompensationPassengerList = this.CompensationPassengerList.filter(r => r.GivenName.indexOf(name.trim()) >= 0 || r.LastName.indexOf(name.trim()) >= 0);
            } else {
                this.CompensationPassengerList = this.CompensationFullPaxList;
            }
        } else if (this.SearchCriteria == "Order ID") {
            if (args) {
                let name = args.toString().toUpperCase();
                this.CompensationPassengerList = this.CompensationPassengerList.filter(r => r.OrderId.indexOf(name.trim()) >= 0);

            } else {
                this.CompensationPassengerList = this.CompensationFullPaxList;
            }
        } else {
            console.log("Class search");
            if (args) {
                let name = args.toString().toUpperCase();
                if (this.CompensationPassengerList.filter(r => r.Cabin != null)) {
                    this.CompensationPassengerList = this.CompensationPassengerList.filter(r => r.Cabin.indexOf(name.trim()) >= 0);
                }
            } else {
                this.CompensationPassengerList = this.CompensationFullPaxList;
            }
        }
        this.TotalPassengerCount = this.CompensationPassengerList.length;
        if (this.SelectedPassenger.length === this.CompensationFullPaxList.length) {
            this.SelectAllPax = true;
        } else {
            this.SelectAllPax = false;
        }
    }

    saveEnabled(): boolean {
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
            this.SelectedPassenger.forEach((data, index) => {
                if (data.CompensationReason != "") {
                    this.IsPaxReasonSelected = true;
                } else {
                    this.IsPaxReasonSelected = false;
                }
            })
        } else {
            this.IsPaxReasonSelected = false;
        } if (this.IsPaxReasonSelected == true) {
            return true;
        }
        else return false;
    }
    continueEnabled(): boolean {
        if (this.SelectedPassenger && this.SelectedPassenger.length > 0) {
            this.SelectedPassenger.forEach((data, index) => {
                if (data.CompensationReason != "") {
                    this.IsPaxReasonSelected = true;
                } else {
                    this.IsPaxReasonSelected = false;
                }
            })
        } else {
            this.IsPaxReasonSelected = false;
        } if (this.IsPaxReasonSelected == true) {
            return true;
        }
        else return false;
    }
    displayProductActionDialogForSmartFilter() {
        let options = {
            title: "Smart filter option",
            cancelButtonText: "Cancel",
            actions: ["Name", "Order ID", "Class", "All Passengers", "ETKT Passengers", "Checked-In Passengers", "Not Checked-In Passengers", "Outbound Passenger"],
        };
        dialogs.action(options).then((result) => {
            if (result != "Cancel") {
                this.SearchCriteria = result;
                if (this.SearchCriteria == "Name" || this.SearchCriteria == "Order ID" || this.SearchCriteria == "Class") {
                    this.showSmartSearchField = true;
                    this.CompensationPassengerList = this.CompensationFullPaxList;
                } else {
                    this.showSmartSearchField = false;
                    if (this.SearchCriteria == "All Passengers") {
                        this.CompensationPassengerList = this.CompensationFullPaxList;
                    } else if (this.SearchCriteria == "ETKT Passengers") {
                        this.CompensationPassengerList = this.CompensationFullPaxList.filter(m => m.EticketStatus == "True");
                    } else if (this.SearchCriteria == "Checked-In Passengers") {
                        this.CompensationPassengerList = this.CompensationFullPaxList.filter(m => m.CheckedInIndicator.indexOf('Checkedin') > -1 && m.CheckedInIndicator !== 'CheckedinSeatDeleted');
                    } else if (this.SearchCriteria == "Not Checked-In Passengers") {
                        this.CompensationPassengerList = this.CompensationFullPaxList.filter(m => m.CheckedInIndicator != "Checkedin");
                    } else {
                        this.CompensationPassengerList = this.CompensationFullPaxList.filter(m => m.OutboundIndicator == "true");
                    }
                }
            }
        });
        this.TotalPassengerCount = this.CompensationPassengerList.length;
        if (this.SelectedPassenger.length >= this.CompensationPassengerList.length) {
            this.SelectAllPax = true;
        } else {
            this.SelectAllPax = false;
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
    displayProductActionDialog() {

        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: [{ country: this.CompensationReason }],
            fullscreen: false
        };
        this._modalService
            .showModal(CreatingListPickerComponent, options)
            .then(result => {
                console.log("date result " + result);
                if (result) {
                    this.ComensationReason = result;
                    this.SelectedPassenger.forEach((data, Index) => {
                        data.CompensationReason = result;
                        data.CompensationReasonId = this.CompensationReasonList.filter(m => m.CompReasonText == this.ComensationReason)[0].CompReasonId;
                    })
                    // this.SearchFields.Location = result.substr(0, 3);
                    console.log("out" + result);
                }
            });
    }
    getCompensationReason(): void {
        try {
            console.log("Reason 1");
            let ReasonRequest = this._shared.getAgentPrivilage();
            this.AgentPrivilage.Privileges = ReasonRequest;
            // console.log("Pri:" + JSON.stringify(this.AgentPrivilage));
            this.loaderProgress.showLoader();
            var sDate = new Date();
            var CompensationRequestObj: any;
            CompensationRequestObj = { "Privileges": this.AgentPrivilage.Privileges, "AirlineCode": ApplicationSettings.getString("carrierCode", "") }
            console.log('Get GetCompensationReason Service --------------- Start Date Time : ' + sDate);
            this._service.getCompensationReasons(CompensationRequestObj)
                .subscribe(data => {
                    if (data.CompensationReason != null) {
                        let CompansationDetails: any = data;
                        CompansationDetails.CompensationReason.forEach((KeyValue, Index) => {
                            let compreason = new CompensationReasonModule.CompensationReason();
                            compreason.CompReasonText = KeyValue.CompReasonText;
                            compreason.CompReasonId = KeyValue.CompReasonId;
                            this.CompensationReasonList.push(compreason);
                            this.CompensationReason.push(KeyValue.CompReasonText);
                            this.CompensationReason.sort(function (a, b) {
                                if (a < b) return -1;
                                if (a > b) return 1;
                                return 0;
                            })
                            // console.log("Reason :" + JSON.stringify(this.CompensationReasonList));

                        })
                        this.loaderProgress.hideLoader();
                    } else {
                        Toast.makeText(CompensationSearchResultComponent.COMPENSATIONREASONTOAST + data.Errors[0].Message).show();
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
    selectingAllPax() {
        if (this.SelectAllPax == false && this.SelectAllPaxVar == false) {
            this.SelectAllPaxVar = true;
            this.CompensationPassengerList.forEach((data, index) => {
                if (!data.IsSelected) {
                    if (this.ComensationReason != CompensationSearchResultComponent.COMPENSATIONREASON) {
                        data.CompensationReason = this.ComensationReason;
                        data.CompensationReasonId = this.CompensationReasonList.filter(m => m.CompReasonText == this.ComensationReason)[0].CompReasonId;
                    }
                    data.IsSelected = true;
                    this.SelectedPassenger.push(data);
                }
            })
        } else {
            this.SelectAllPaxVar = false;
            this.SelectedPassenger = [];
            this.CompensationFullPaxList.forEach((data, index) => {
                data.IsSelected = false;
            });
            this.SelectAllPax = false;
            this.CompensationPassengerList.forEach((data, index) => {
                data.IsSelected = false;
                if (data.Compensations == null) {
                    data.CompensationReason = "";
                    data.CompensationReasonId = null;
                }
            })
        }
        this.selectedPassengerCount = this.SelectedPassenger.length;
        if (this.CompensationFullPaxList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
    }
    save() {
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('SaveCompensation Service --------------- Start Date Time : ' + sDate);
            let SaveComptemplate: any = Converters.convertToSaveCompensationTemplate(this.SelectedPassenger, this.CompensationModel.FlightModel);
            console.log("Data1:" + JSON.stringify(SaveComptemplate));
            this._service.saveCompensationReasons(SaveComptemplate)
                .subscribe(data => {
                    if (data.Results != null) {
                        let CompansationDetails: any = data;
                        Toast.makeText("Saved Successfully").show();
                        console.log("Data:" + JSON.stringify(data));
                        this.SelectedPassenger.forEach((data, index) => {
                            data.IsSelected = false;
                        })
                        this.SelectedPassenger = [];
                        var flightDate = this.CompensationModel.FlightModel.DepartureDate;
                        var flightNumber = this.CompensationModel.FlightModel.FlightNumber;
                        var location = this.CompensationModel.FlightModel.DepartureAirport;
                        this.PassengerTypeList = this._shared.GetPassengerTypeService();
                        if (this.PassengerType) {
                            var PaxType;
                            PaxType = this.PassengerTypeList.PassengerTypeListTable.filter(m => m.Value.Description == this.PassengerType)[0].Key;
                            this.getPassengerList(flightDate, flightNumber, location, PaxType);
                        } else {
                            this.CompensationModel = Converters.convertoCompensationPassengerList(data, this.FlightDetails, location);
                            this.CompensationPassengerList = this.CompensationModel.PassengerList;
                            console.log(this.CompensationModel);
                            this.loaderProgress.hideLoader();
                        }
                    } else {
                        Toast.makeText(data.Errors[0].Message).show();
                        this.loaderProgress.hideLoader();
                    }
                }, err => {
                    Toast.makeText(err).show();
                    this.handleServiceError(err);
                    this.loaderProgress.hideLoader();
                });

        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();

        }
        finally {
            var endDate = new Date();
            console.log('SaveCompensation Service --------------- End Date Time : ' + endDate);
            console.log('SaveCompensation Service Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(endDate)));
        }
    }
    getPassengerList(flightDate, flightNumber, location, PaxType) {
        try {

            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get CompensationDetails Service --------------- Start Date Time : ' + sDate);
            this._service.getPassengerTypeList(flightDate, flightNumber, location, PaxType).subscribe(data => {
                if (data.BadRequest != 400) {
                    if (data.FlightSegments) {
                        let CompansationDetails: any = data;
                        this.CompensationModel = Converters.convertoCompensationPassengerList(CompansationDetails, this.FlightDetails, ApplicationSettings.getString("SearchLocation", ""));
                        this.CompensationPassengerList = this.CompensationModel.PassengerList;
                        this.loaderProgress.hideLoader();
                        var eDate = new Date();
                        console.log('Get CompensationDetails Service --------------- End Date Time : ' + eDate);
                        console.log('Get CompensationDetails Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
                    } else {
                        Toast.makeText(data.Errors.message).show();
                        this.loaderProgress.hideLoader();
                    }
                } else {
                    Toast.makeText(data.errMessage).show();
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
        finally {
            var eDate = new Date();
            console.log('Get CompensationDetails Service --------------- End Date Time : ' + eDate);
            console.log('Get CompensationDetails Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    }
    sortBasedOnPaxName() {
        var isAsc: number = this.nameSortIndicator == 0 ? 1 : 0;
        this.nameSortIndicator = this.nameSortIndicator == 0 ? 1 : 0;
        this.ssrSortIndicator = -1;
        this.tierSortIndicator = -1;
        this.classSortIndicator = -1;
        this.orderIdSortIndicator = -1;
        this.CompensationPassengerList.sort(function (a, b) {
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
        this.CompensationPassengerList.sort(function (a, b) {
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
        this.CompensationPassengerList.sort(function (a, b) {
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
        this.CompensationPassengerList.sort(function (a, b) {
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
        this.CompensationPassengerList.sort(function (a, b) {
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
    continue() {
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('IssueCompensation Service --------------- Start Date Time : ' + sDate);
            // this.SelectedPassenger = this.CompensationPassengerList.filter(obj => obj.IsSelected == true);
            // if (this.SelectedPassenger.filter(m => m.CompensationReason != CompensationSearchResultComponent.COMPENSATIONREASON)) {
            let privilage = this._shared.getAgentPrivilage();
            let IssueComptemplate: any = Converters.convertToBRERequest(this.SelectedPassenger, privilage, this.CompensationModel.FlightModel);
            console.log("IssueComptemplate:" + JSON.stringify(IssueComptemplate));
            this._service.postBreRequest(IssueComptemplate)
                .subscribe(data => {
                    console.log("Data:" + JSON.stringify(data));
                    if (data.BadRequest != 400) {
                        if (data.Results != [] && data.Success == true) {
                            if (data.Results[0].FlightSegments[0].Passengers[0].BRE_Compensations != null) {
                                let IssueCompResponse = Converters.convertToBREResponse(data, this.SelectedPassenger);
                                this._shared.setCompensationPaxList(IssueCompResponse);
                                console.log("BRECompResponse:" + JSON.stringify(data));
                                console.log("BRECompResponse:" + JSON.stringify(IssueCompResponse));
                                this.navigatetoissuecompensation();
                                this.loaderProgress.hideLoader();
                            } else {
                                this.loaderProgress.hideLoader();
                                Toast.makeText("Unable to process - Please try again later").show();
                            }
                        } else {
                            this.loaderProgress.hideLoader();
                            Toast.makeText(data.Warnings[0].Message).show();
                            if (data.Errors) {
                                Toast.makeText(data.Errors[0].Message).show();
                            }
                        }
                    } else {
                        Toast.makeText(data.errMessage).show();
                        this.loaderProgress.hideLoader();
                    }

                }, err => {
                    this.handleServiceError(err);
                    this.loaderProgress.hideLoader();
                });
            // } 
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
    navigatetoissuecompensation(): void {
        var prePage: string = "normal";
        this.routerExtensions.navigate(["issuecompensation"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }, queryParams: {
                "prepage": JSON.stringify(prePage),
            }
        })
    }
    navigatetoadditionaldetails(Paxitem: CompensationSearchModule.CompensationPassengerList): void {
        if (Paxitem.IsSelected) {
            console.dir(this.SelectedPassenger);
            var prePage: string = "SearchResult";
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
        // }
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
