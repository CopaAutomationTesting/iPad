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
import { SegmentedBar, SegmentedBarItem } from "ui/segmented-bar";
import * as imageModule from "image-source";
import * as fs from "file-system";

//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as moment from "moment";
import * as Toast from 'nativescript-toast';
import * as zebra from "nativescript-print-zebra";

//app references
import { CreatingListPickerComponent } from "../../components/country/country-modal";
import { LoaderProgress, PassengerListTemplate, PassengerList, AccontProfileModel, CompensationSearchModule, CompensationReasonModule } from "../../shared/interface/index"
import { DataService, CheckinOrderService, PassengerService, CompensationService } from "../../shared/services/index";
import { Order, CountryCollection, FlightServiceInfo, Flight, Search, AccountProfile, APISDocument, Compansation, CompensationPaxList, AgentPrivilage, PrintModule } from "../../shared/model/index";
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
    templateUrl: "./components/compensation-searchresultwithtab/compensation-searchresultwithtab.component.html",
    styleUrls: ["./components/compensation-searchresultwithtab/compensation-searchresultwithtab.component.css"]

})

export class CompensationSearchResultWithTabComponent implements OnInit {
    @ViewChild('pagecontainer') pageCont: ElementRef;
    @ViewChild('segbar') segbar: ElementRef;
    public apisdetails: Array<SegmentedBarItem>;
    public firsttab = new SegmentedBarItem();
    public secondtab = new SegmentedBarItem();
    public isError: boolean;
    public errorMessage: string;
    public loaderProgress: LoaderProgress;
    public startDate: Date;
    public SearchFields: Search = new Search();
    public CurDate: Date;
    public userdetails: any;
    public ComensationReason: any;
    public CompensationReason: Array<string> = [];
    public SelectAllPax: boolean = false;
    public checkedCount: number = 0;
    public FlightDetails: any;
    public PassengerType: any;
    public TotalPassengerCount: number = 0;
    public selectedPassengerCount: number = 0;
    public CompensationList: CompensationPaxList.RootObject;
    public SelectedPassenger: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public SelectedIssuePassenger: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompensationPassengerList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompensationFullPaxList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompensationModel: CompensationSearchModule.CompensationRootObject = new CompensationSearchModule.CompensationRootObject;
    public CompensationReasonList: Array<CompensationReasonModule.CompensationReason> = [];
    public AgentPrivilage: AgentPrivilage.RootObject = new AgentPrivilage.RootObject();
    public PaxList: CompensationSearchModule.CompensationRootObject = new CompensationSearchModule.CompensationRootObject();
    public flightdate: any;
    public SelectAllPaxVar: boolean = false;
    public IsPaxReasonSelected: boolean = false;
    public flightnumber: any;
    public nameSortIndicator: number = -1;
    public ssrSortIndicator: number = -1;
    public tierSortIndicator: number = -1;
    public classSortIndicator: number = -1;
    public orderIdSortIndicator: number = -1;
    public CompensationIssuedList: boolean = true;
    public CompensationNotIssuedList: boolean = false;
    public CompensatedPaxCount: number = 0;
    public SearchCriteria: any = "Name";
    public searchField: any;
    public PassengerFliterCriteria: any = "All Passengers";
    public CompensationNotIssuedPaxCount: number = 0;
    public FlightHeaderInfo: CompensationSearchModule.FlightModel = new CompensationSearchModule.FlightModel();
    public CompPaxList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public ConstCompPaxList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompPaxListIssued: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompPaxListNotIssued: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompPaxListIssuedFulList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public CompPaxListNotIssuedFulList: Array<CompensationSearchModule.CompensationPassengerList> = [];
    public static COMPENSATIONREASON: string = "Select Reason";
    public static COMPENSATIONREASONTOAST: string = "Compensation Reason:";
    public static PAXTYPE: string = "ReasonWiseGet";
    public static COMPENSATEDPAXTABTITLE: string = "Compensation Issued";
    public static NOTCOMPENSATEDPAXTABTITLE: string = "Compensation Not Issued";
    public static DATANOTFOUNDTOAST: string = "Data not found";
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    constructor(private _configuration: Configuration, private _services: PassengerService, private activatedRouter: ActivatedRoute, private _shared: CheckinOrderService, private page: Page, private routerExtensions: RouterExtensions, public _timeoutService: TimeOutService, private router: Router, public _dataService: DataService, public _service: CompensationService, private route: ActivatedRoute, private vcRef: ViewContainerRef, private _modalService: ModalDialogService) {
        this.isError = false;
        this.errorMessage = "";
        this.SearchFields.FlightDate = moment().format("DD MMMM YYYY");
        this.CurDate = moment().toDate();
        this.startDate = new Date();
        this.apisdetails = [];

        this.firsttab.title = CompensationSearchResultWithTabComponent.COMPENSATEDPAXTABTITLE;
        this.apisdetails.push(this.firsttab);

        this.secondtab.title = CompensationSearchResultWithTabComponent.NOTCOMPENSATEDPAXTABTITLE;
        this.apisdetails.push(this.secondtab);
        this.loaderProgress = new LoaderProgress();
    }
    ngOnInit() {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.ComensationReason = CompensationSearchResultWithTabComponent.COMPENSATIONREASON;
        this.loaderProgress.initLoader(this.pageCont);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.getCompensationReason();
        this.PaxList = this._shared.getCompensationList();
        console.log("PAX new" + JSON.stringify(this.PaxList.FlightModel));
        this.CompPaxList = this.PaxList.PassengerList;
        this.ConstCompPaxList = this.CompPaxList;
        this._shared.setCompensationPaxList(this.CompPaxList);
        this._shared.setFlightHeaderInfo(this.PaxList.FlightModel);
        this.FlightHeaderInfo = this.PaxList.FlightModel;
        this.CompPaxList.forEach((data, Index) => {
            if (data.IsCompensationIssued == true) {
                this.CompPaxListIssued.push(data);


            } else {
                this.CompPaxListNotIssued.push(data);
            }
        })
        this.apisdetails = [];

        this.CompPaxListIssuedFulList = this.CompPaxListIssued;
        this.CompPaxList = this.CompPaxListIssuedFulList;
        this.CompensatedPaxCount = this.CompPaxListIssuedFulList.length;
        this.firsttab.title = CompensationSearchResultWithTabComponent.COMPENSATEDPAXTABTITLE + "(" + this.CompensatedPaxCount + ")";
        this.apisdetails.push(this.firsttab);
        this.CompPaxListNotIssuedFulList = this.CompPaxListNotIssued;
        this.CompensationNotIssuedPaxCount = this.CompPaxListNotIssuedFulList.length;
        this.secondtab.title = CompensationSearchResultWithTabComponent.NOTCOMPENSATEDPAXTABTITLE + "(" + this.CompensationNotIssuedPaxCount + ")";
        this.apisdetails.push(this.secondtab);
        // console.log("Comp Issued" + JSON.stringify(this.CompPaxListIssued));
        // console.log("Comp Not Issued" + JSON.stringify(this.CompensationNotIssuedPaxCount));
        // console.log("Res:" + JSON.stringify(this.FlightDetails));
    }

    toggleChecked(pax: CompensationSearchModule.CompensationPassengerList) {
        if (this.CompensationNotIssuedList == true) {
            if (pax.IsSelected == false) {
                pax.IsSelected = true;
                this.SelectedPassenger.push(pax);
                // if (this.CompPaxList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
                if (this.ComensationReason != CompensationSearchResultWithTabComponent.COMPENSATIONREASON) {
                    pax.CompensationReason = this.ComensationReason;
                    pax.CompensationReasonId = this.CompensationReasonList.filter(m => m.CompReasonText == this.ComensationReason)[0].CompReasonId;
                }
            } else {
                this.SelectedPassenger.splice(this.SelectedPassenger.indexOf(pax), 1);
                this.IsPaxReasonSelected = false;
                pax.IsSelected = false;
                this.SelectAllPax = false;
            }
            if (this.CompPaxListNotIssuedFulList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
        }

        this.selectedPassengerCount = this.SelectedPassenger.length;
        // else {
        //     if (pax.IsSelected == false) {
        //         pax.IsSelected = true;
        //         this.SelectedIssuePassenger.push(pax);
        //     } else {
        //         this.SelectedIssuePassenger.splice(this.SelectedIssuePassenger.indexOf(pax), 1);
        //         pax.IsSelected = false;
        //     }

        // }

        // console.log(JSON.stringify(this.SelectedPassenger));
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
            // this.CompPaxListIssued = this.CompPaxList.filter(m=>m.IsCompensationIssued == true);
            this.CompPaxListNotIssued.forEach((data, Index) => {
                data.IsSelected = false;
            })
            this.CompPaxList = this.CompPaxListIssuedFulList;

            this.selectedPassengerCount = 0;
            this.TotalPassengerCount = this.CompPaxListIssuedFulList.length;
            console.log("Issued" + this.CompPaxListIssued.length);
        } else {
            this.CompensationIssuedList = false;
            this.CompensationNotIssuedList = true;
            this.SearchCriteria = "Name";
            this.searchField = undefined;
            // this.CompPaxListNotIssued = this.CompPaxList.filter(m=>m.IsCompensationIssued == false);
            this.CompPaxList = this.CompPaxListNotIssuedFulList;
            this.selectedPassengerCount = 0;

            this.TotalPassengerCount = this.CompPaxListNotIssuedFulList.length;
            console.log("Not Issued" + this.CompPaxListNotIssued.length);

        }
    }
    printEnabled(): boolean {
        if (this.SelectedPassenger.length != 0) {
            this.SelectedPassenger.forEach((data, index) => {
                if (data.IsCompensationIssued == true) {
                    this.IsPaxReasonSelected = true;
                }
            })
        } if (this.IsPaxReasonSelected == true) {
            return true;
        }
        else return false;
    }
    emailEnabled(): boolean {
        if (this.SelectedPassenger.length != 0) {
            this.SelectedPassenger.forEach((data, index) => {
                if (data.IsCompensationIssued == true) {
                    this.IsPaxReasonSelected = true;
                }
            })
        } if (this.IsPaxReasonSelected == true) {
            return true;
        }
        else return false;
    }
    saveEnabled(): boolean {
        if (this.SelectedPassenger != []) {
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
        if (this.SelectedPassenger != []) {
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
    deleteEnabled(): boolean {
        if (this.SelectedPassenger.length > 0) {
            this.IsPaxReasonSelected = true;
        } else {
            this.IsPaxReasonSelected = false;
        } if (this.IsPaxReasonSelected == true) {
            return true;
        }
        else return false;
    }
    filter(args: any) {
        // console.log("Name:" + JSON.stringify(args));
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
            if (this.CompPaxListNotIssuedFulList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
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
                        })
                        this.loaderProgress.hideLoader();
                    } else {
                        Toast.makeText(CompensationSearchResultWithTabComponent.COMPENSATIONREASONTOAST + data.Errors[0].Message).show();
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
    displayProductActionDialogForPrinter() {
        let options = {
            title: "Smart filter option",
            cancelButtonText: "Cancel",
            actions: ["Bluetooth Printer", "Host Printer"],
        };
        dialogs.action(options).then((result) => {
            if (result != "Cancel") {
                if (result == "Bluetooth Printer") {
                    this.bluetoothEMD();
                } else {
                    this.printEMD()
                }
            }
        });
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
                    if (data.Success) {
                        this.loaderProgress.hideLoader();
                        if (data.RawData) {
                            let image = imageModule.fromBase64(data.RawData);
                            let folder = fs.knownFolders.ios.library();
                            let path = fs.path.join(folder.path, "tempBPImage.jpg");
                            try {
                                image.saveToFile(path, "jpeg");
                                let printerID = this.getPrinter();
                                if (printerID.trim() != "") {
                                    new zebra.Printer({ address: printerID, language: "CPCL", debugging: false })
                                        .then(function (curPrinter, result) {
                                            var document = curPrinter.createDocument();
                                            document.image(fs.path.join(folder.path, "tempBPImage.jpg"), 0);
                                            Toast.makeText("Bluetooth printed sucessfully").show();
                                            curPrinter.print(document).then(function () {
                                                console.log("Printing Done");
                                                curPrinter.close().then(function () {
                                                    Toast.makeText("Printer is ready to print").show();
                                                })
                                                    .catch(function (err) {
                                                        Toast.makeText("Error Occured while Printing:").show();
                                                        curPrinter.close();
                                                    });
                                            })
                                                .catch(function (status) {
                                                    console.log(status);
                                                    Toast.makeText("CheckInComponent.UNABLETOPRINT").show();
                                                });
                                        }).catch(function (err) {
                                            Toast.makeText("CheckInComponent.PRINTERSESSION").show();
                                            console.log(err);
                                        });
                                } else {
                                    Toast.makeText("CheckInComponent.NOBLUETOOTHDEVICE").show();
                                }
                            } catch (e) {
                                Toast.makeText("CheckInComponent.UNABLETOPRINT").show();
                            }
                        } else {
                            Toast.makeText("CheckInComponent.UNABLETOPRINT").show();
                        }
                        // this.getCompensationList(this.FlightHeaderInfo.DepartureDate,this.FlightHeaderInfo.FlightNumber,this.FlightHeaderInfo.DepartureAirport,"ReasonWiseGet");
                        // Toast.makeText(data.Errors[0].Message).show();
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
            this.FlightHeaderInfo = this._shared.getFlightHeaderInfo();
            let EmailCompensationStructure: PrintModule.RootObject = Converters.convertToPrintEMDCompensation(this.SelectedPassenger, this.FlightHeaderInfo);
            console.log("Email Req:" + JSON.stringify(EmailCompensationStructure));
            if (EmailCompensationStructure.Passengers != []) {
                this._service.printEMDCompensationService(EmailCompensationStructure).subscribe((data) => {
                    console.log("Email Res:" + JSON.stringify(data));
                    if (data.Success) {
                        this.loaderProgress.hideLoader();
                        this.getCompensationList(this.FlightHeaderInfo.DepartureDate, this.FlightHeaderInfo.FlightNumber, this.FlightHeaderInfo.DepartureAirport, "ReasonWiseGet");
                        // Toast.makeText(data.Errors[0].Message).show();
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
    selectingAllPax() {
        if (this.SelectAllPax == false && this.SelectAllPaxVar == false) {
            this.SelectAllPaxVar = true;
            this.CompPaxList.forEach((data, index) => {
                if (!data.IsSelected) {
                    data.IsSelected = true;
                    this.SelectedPassenger.push(data);
                    if (this.ComensationReason != CompensationSearchResultWithTabComponent.COMPENSATIONREASON) {
                        data.CompensationReason = this.ComensationReason;
                    }
                }
            })
            if (this.CompPaxListNotIssuedFulList.length === this.SelectedPassenger.length) this.SelectAllPax = true;
        } else {
            this.SelectAllPaxVar = false;
            this.SelectAllPax = false;
            this.SelectedPassenger = [];
            this.CompPaxList.forEach((data, index) => {
                data.IsSelected = false;
                // data.CompensationReason = "";
            })
        }
        this.selectedPassengerCount = this.SelectedPassenger.length;
    }
    delete() {
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('SaveCompensation Service --------------- Start Date Time : ' + sDate);
            let SaveComptemplate: any = Converters.convertToDeleteCompensationTemplate(this.SelectedPassenger, this.FlightHeaderInfo);
            console.log("Data1:" + JSON.stringify(SaveComptemplate));
            this._service.deleteCompensationReasons(SaveComptemplate)
                .subscribe(data => {
                    if (data.Results != null) {
                        let CompansationDetails: any = data;
                        console.log("Data:" + JSON.stringify(data));
                        this.SelectedPassenger.forEach((data, index) => {
                            data.IsSelected = false;
                        })
                        Toast.makeText("Deleted successfully").show();
                        this.SelectedPassenger = [];
                        this.loaderProgress.hideLoader();
                    } else {
                        let CompansationDetails: any = data;
                        console.log("Data:" + JSON.stringify(data));
                        this.SelectedPassenger.forEach((data, index) => {
                            data.IsSelected = false;
                        })
                        this.SelectedPassenger = [];
                        Toast.makeText(data.Errors[0].Message).show();
                        this.loaderProgress.hideLoader();
                    }
                    this.SelectedPassenger = [];
                    var flightDate = this.PaxList.FlightModel.DepartureDate;
                    var flightNumber = this.PaxList.FlightModel.FlightNumber;
                    var location = this.PaxList.FlightModel.DepartureAirport;
                    this.getCompensationList(flightDate, flightNumber, location, CompensationSearchResultWithTabComponent.PAXTYPE);
                }, err => {
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
    save() {
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('SaveCompensation Service --------------- Start Date Time : ' + sDate);
            let SaveComptemplate: any = Converters.convertToSaveCompensationTemplate(this.SelectedPassenger, this.FlightHeaderInfo);
            console.log("Data1:" + JSON.stringify(SaveComptemplate));
            this._service.saveCompensationReasons(SaveComptemplate)
                .subscribe(data => {
                    let CompansationDetails: any = data;
                    console.log("Data:" + JSON.stringify(data));
                    this.SelectedPassenger.forEach((data, index) => {
                        data.IsSelected = false;
                    })
                    this.SelectedPassenger = [];
                    var flightDate = this.PaxList.FlightModel.DepartureDate;
                    var flightNumber = this.PaxList.FlightModel.FlightNumber;
                    var location = this.PaxList.FlightModel.DepartureAirport;
                    this.getCompensationList(flightDate, flightNumber, location, CompensationSearchResultWithTabComponent.PAXTYPE);
                }, err => {
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
    getCompensationList(date, flight, location, paxtype): void {
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetPassengerType Service --------------- Start Date Time : ' + sDate);
            this._service.getCompensationPaxList(date, flight, location, paxtype).subscribe((data) => {
                if (data.Results) {
                    if (data.Results[0].FlightSegments[0].Passengers != undefined) {
                        console.log("Comp list new logic ");
                        let CompansationDetails: any = data;
                        this.flightStatusForCompensationList(date, flight, CompansationDetails);

                    } else {
                        console.log("Comp list new logic else");
                        Toast.makeText(CompensationSearchResultWithTabComponent.DATANOTFOUNDTOAST).show();
                        this.navigateToCompensation();
                    }
                } else {
                    Toast.makeText(data.Errors[0].message).show();
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
    flightStatusForCompensationList(date, flight, CompPax): void {
        try {
            var sDate = new Date();
            console.log('Get CompensationDetails Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            var date = date;
            var flightnumber = flight;
            var location = ApplicationSettings.getString("SearchLocation", "");
            this._service.status(date, flightnumber, location).subscribe((data) => {
                if (data.BadRequest != 400) {
                    if (data.Flights != null) {
                        let status: any = data;
                        // console.log("IN1" + JSON.stringify(status));
                        this._shared.setCompensationFlightDetails(data);
                        let flightStatus = Converters.convertToFlightHeaderInfo(data, ApplicationSettings.getString("SearchLocation", ""));
                        this._shared.setFlightHeaderInfo(flightStatus);
                        this.CompPaxList.length = 0;
                        this.PaxList = Converters.convertoCompensationPassengerList(CompPax, data, ApplicationSettings.getString("SearchLocation", ""));
                        this.CompPaxList = this.PaxList.PassengerList;
                        this.CompPaxListIssued.length = 0;
                        this.CompPaxListNotIssued.length = 0;
                        this.CompPaxList.forEach((data, Index) => {
                            if (data.IsCompensationIssued == true) {
                                this.CompPaxListIssued.push(data);
                            } else {
                                this.CompPaxListNotIssued.push(data);
                            }
                        })
                        this.apisdetails = [];
                        this.CompensatedPaxCount = this.CompPaxListIssued.length;
                        this.firsttab.title = CompensationSearchResultWithTabComponent.COMPENSATEDPAXTABTITLE + "(" + this.CompensatedPaxCount + ")";
                        this.apisdetails.push(this.firsttab);
                        this.CompensationNotIssuedPaxCount = this.CompPaxListNotIssued.length;
                        this.secondtab.title = CompensationSearchResultWithTabComponent.NOTCOMPENSATEDPAXTABTITLE + "(" + this.CompensationNotIssuedPaxCount + ")";
                        this.apisdetails.push(this.secondtab);
                        this.TotalPassengerCount = this.CompPaxListNotIssuedFulList.length;
                        // console.log("Comp Issued" + JSON.stringify(this.CompPaxListIssued));
                        this.loaderProgress.hideLoader();
                        let e: any;
                        e.newIndex = 1;
                        this.selectSegment(e);
                    } else {
                        let status: any = data;
                        // console.log("IN1" + JSON.stringify(status));
                        this._shared.setCompensationFlightDetails(data);
                        this.CompPaxList.length = 0;
                        this.PaxList = Converters.convertoCompensationPassengerList(CompPax, data, ApplicationSettings.getString("SearchLocation", ""));
                        this.CompPaxList = this.PaxList.PassengerList;
                        this.CompPaxListIssued.length = 0;
                        this.CompPaxListNotIssued.length = 0;
                        this.CompPaxList.forEach((data, Index) => {
                            if (data.IsCompensationIssued == true) {
                                this.CompPaxListIssued.push(data);
                            } else {
                                this.CompPaxListNotIssued.push(data);
                            }
                        })
                        this.apisdetails = [];
                        this.CompensatedPaxCount = this.CompPaxListIssued.length;
                        this.firsttab.title = CompensationSearchResultWithTabComponent.COMPENSATEDPAXTABTITLE + "(" + this.CompensatedPaxCount + ")";
                        this.apisdetails.push(this.firsttab);
                        this.CompensationNotIssuedPaxCount = this.CompPaxListNotIssued.length;
                        this.secondtab.title = CompensationSearchResultWithTabComponent.NOTCOMPENSATEDPAXTABTITLE + "(" + this.CompensationNotIssuedPaxCount + ")";
                        this.apisdetails.push(this.secondtab);
                        this.TotalPassengerCount = this.CompPaxListNotIssuedFulList.length;
                        // console.log("Comp Issued" + JSON.stringify(this.CompPaxListIssued));
                        this.loaderProgress.hideLoader();
                        let e: any;
                        e.newIndex = 1;
                        this.selectSegment(e);
                    }
                } else {
                    Toast.makeText(data.errMessage).show();
                    this.loaderProgress.hideLoader();
                }
            },
                err => {
                    this.handleServiceError(err);
                    console.log("Couldnt find information" + err);
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
    continue() {
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('IssueCompensation Service --------------- Start Date Time : ' + sDate);
            // this.SelectedPassenger = this.CompPaxList.filter(obj => obj.IsSelected == true);
            if (this.SelectedPassenger.filter(m => m.CompensationReason != CompensationSearchResultWithTabComponent.COMPENSATIONREASON)) {
                let privilage = this._shared.getAgentPrivilage();
                let IssueComptemplate: any = Converters.convertToBRERequest(this.SelectedPassenger, privilage, this.FlightHeaderInfo);
                console.log("IssueComptemplate:" + JSON.stringify(IssueComptemplate));
                this._service.postBreRequest(IssueComptemplate)
                    .subscribe(data => {
                        console.log("Data:" + JSON.stringify(data));
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
    navigatetoissuecompensation(): void {
        this._shared.setFlightHeaderInfo(this.FlightHeaderInfo);
        this.routerExtensions.navigate(["issuecompensation"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        })

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
    navigatetoadditionaldetails(Paxitem: CompensationSearchModule.CompensationPassengerList): void {
        console.log("V" + Paxitem)
        var prePage: string = "CompensationList";
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
    naviagatetoCompensationPrintListwithtab() {
        this.routerExtensions.navigate(["compensationprintscreen"], {
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

}
