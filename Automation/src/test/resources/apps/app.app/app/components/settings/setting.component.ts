import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { RouterExtensions, } from "nativescript-angular/router";
import { Page } from "ui/page";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { DeviceListPickComponent } from "../../components/deviceList/deviceList-modal";
import dialogs = require("ui/dialogs");
import * as gestures from "ui/gestures";
import * as Toast from 'nativescript-toast';
import * as switchModule from "tns-core-modules/ui/switch";

//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as moment from "moment";
import * as zebra from 'nativescript-print-zebra';


//app references
// import { UpgradeInfoArray, PaxTemplate, PassengerCheckin, InBound, FlightInfo, MultiSegmentTemplate, FQTVInfo, FQTVPro, CheckInPostTemplate, DepartureInfo, OutBound, LoaderProgress, SecurityDocument, Document, PhoneNumber, Address, ApisRequirement, EmergencyDetails, EmergencyPhone, AssociatedPassenger } from '../../shared/interface/index';

import { DataService, CheckinOrderService, PassengerService, TimeOutService } from "../../shared/services/index";
import { PrinterDevice, LoaderProgress, PassengerListTemplate, PassengerList, AccontProfileModel, BoardingPass, PrinterDeviceModel } from "../../shared/interface/index"
import { Order, Search } from "../../shared/model/index";
import { Converters } from "../../shared/utils/index";
import { AppExecutiontime } from "../../app.executiontime";
import { Configuration } from '../../app.constants';



ApplicationSettings.setString('apiurl', "http://ustlssoam316.airservices.svcs.entsvcs.net:8980/");
declare var NSHTTPCookieStorage, NSHTTPCookie;

export class PrinterDetails {
    public isHostPrinter: boolean;
    public
}

@Component({
    selector: "home-page",
    providers: [DataService, Configuration, PassengerService],
    templateUrl: "./components/settings/setting.component.html",
    styleUrls: ["./components/settings/setting.component.css"]
})
export class SettingComponent implements OnInit {
    @ViewChild('pagecontainer') pageCont: ElementRef;
    @ViewChild('hostprinter') hostprinter: ElementRef;
    @ViewChild('bluetoothprinter') bluetoothprinter: ElementRef;
    @ViewChild('default') default: ElementRef;
    @ViewChild('mypreference') mypreference: ElementRef;
    @ViewChild('selectboardingprinter') selectboardingprinter: ElementRef;
    @ViewChild('selectbagprinter') selectbagprinter: ElementRef;
    @ViewChild('plugin') plugin: ElementRef;
    @ViewChild('SettingScroller') SettingScroller: ElementRef;
    public FirstBlock: boolean = true;
    public SecondBlock: boolean = false;
    public ThirdBlock: boolean = false;
    public FourthBlock: boolean = false;
    public FifthBlock: boolean = false;
    public SelectPrinter: boolean = true;
    public SelectPrinter1: boolean = false;
    public SelectPrinter2: boolean = false;
    public newDeviceList: Array<PrinterDeviceModel.Device> = [];
    public ProfileArray: AccontProfileModel.AccountProfileTemplate = new AccontProfileModel.AccountProfileTemplate();
    public ProfileDetails: any;
    public userdetails: any;
    public SearchFields: Search = new Search();
    public DateFormat: any;
    public PrinterDeviceList: PrinterDeviceModel.Workstation = new PrinterDeviceModel.Workstation();
    public BoardingPassDeviceName: any = "";
    public BagtagDeviceName: any = "";
    public Date: any;
    public workStationList: any;
    public SelectedDeviceSetting: PrinterDevice.Device = new PrinterDevice.Device();
    loaderProgress: LoaderProgress;
    isError: boolean;
    errorMessage: string;
    public WorkstationName: any;
    public OfficeName: any;
    public BlinkIDLicenseKey: string;
    public URL: string = "http://ustlssoam316.airservices.svcs.entsvcs.net:8980/";
    public lableVisible: boolean = true;
    public changeLicenseKey: boolean = true;
    public bltPrinter: any;
    public BoardingPassPrinterList: Array<PrinterDeviceModel.Device> = [];
    public BagtagPrinterList: Array<PrinterDeviceModel.Device> = [];
    public someProperty: boolean = false;
    public isHostBoardingPass: boolean = false;
    public isBluetoothBoardingPass: boolean = true;
    public isBluetoothBagtag: boolean = true;
    public isDefault: boolean = false;
    public DeliverDetails: BoardingPass.BoardingPassDeliveryDetail = new BoardingPass.BoardingPassDeliveryDetail();

    public isHostBoarding: boolean = false;
    public isHostBagtag: boolean = false;
    public hostBoardingOffice: string;
    public hostBoardingWS: string;
    public hostBoardingPrinter: string;
    public bluetoothBoardingPrinter: string;
    public hostBagtagOffice: string;
    public hostBagtagWS: string;
    public hostBagtagPrinter: string;
    public bluetoothBagtagPrinter: string;
    public isCompensationEnabled: boolean = false;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;

    constructor(private _dataService: DataService, public _service: PassengerService, public _timeoutService: TimeOutService, private page: Page, private routerExtensions: RouterExtensions, private router: Router, private location: Location, public _shared: CheckinOrderService, private vcRef: ViewContainerRef, private _modalService: ModalDialogService) {
        this.isError = false;
        this.errorMessage = "";
        this.loaderProgress = new LoaderProgress();
        this.URL = ApplicationSettings.getString('apiurl', '');
        this.DateFormat = ApplicationSettings.getString("dateFormat", "");
        var sDate = new Date();
        this.Date = moment(sDate).format(this.DateFormat);
        this.BoardingPassDeviceName = ApplicationSettings.getString("boardingPassDeviceName", '');
        this.BagtagDeviceName = ApplicationSettings.getString("bagtagDeviceName", "")

        if (ApplicationSettings.getString("licenseKey", '')) {
            this.BlinkIDLicenseKey = ApplicationSettings.getString("licenseKey", '');
            this._shared.SetLicenseKey(this.BlinkIDLicenseKey);
        }
        else {
            this.BlinkIDLicenseKey = this._shared.GetLicenseKey();
        }


    }

    ngOnInit() {
        this.page.style.backgroundSize = "cover ";
        this.ProfileArray = this._shared.GetUserProfile();
        this.loaderProgress.initLoader(this.pageCont);
        this.SearchFields.Location = this.ProfileArray.PointOfSales[0].AirportCode;
        this.SelectedDeviceSetting = this._shared.GetDevicePrinterDeatils();
        if (this.SelectedDeviceSetting != null) {
            this.BoardingPassDeviceName = this.SelectedDeviceSetting.DeviceName;
        }
        this.WorkstationName = ApplicationSettings.getString("hostPrinter", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled", );
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled", );
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled", );
        // this.WorkstationName = "HDQITPRES69";
        // console.log("WorkstationName:" + this.WorkstationName);
        // if (this.WorkstationName == "" || this.WorkstationName == null) {
        //     console.log("Inside new Condition");
        //     this.WorkstationName = "HDQITPRES69";
        // }
        // this.bltPrinter = "XFGJDMFDK";
        // this.getPrinterDetails(this.WorkstationName);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.Date = this.userdetails.split(' | ')[1];
        this.bltPrinter = ApplicationSettings.getString("printer", "");
        // this.getPrinterDetails();
        var label = this.pageCont.nativeElement
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args: gestures.GestureEventData) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();

        });
        // this.OfficeName = ApplicationSettings.getString("OfficeName");


        this.isHostBoarding = ApplicationSettings.getBoolean("isHostBoarding", false);
        this.isHostBagtag = ApplicationSettings.getBoolean("isHostBagtag", false);
        this.hostBoardingOffice = ApplicationSettings.getString("hostBoardingOffice", "");
        this.hostBoardingWS = ApplicationSettings.getString("hostBoardingWS", "");
        this.hostBoardingPrinter = ApplicationSettings.getString("hostBoardingPrinter", "");
        this.bluetoothBoardingPrinter = ApplicationSettings.getString("bluetoothBagtagPrinter", "");
        this.hostBagtagOffice = ApplicationSettings.getString("hostBagtagOffice", "");
        this.hostBagtagWS = ApplicationSettings.getString("hostBagtagWS", "");
        this.hostBagtagPrinter = ApplicationSettings.getString("hostBagtagPrinter", "");
        this.bluetoothBagtagPrinter = ApplicationSettings.getString("bluetoothBagtagPrinter", "");


        // if(!isHostBoarding)
        // {
        //     ApplicationSettings.setBoolean("isBluetoothBoarding",true);
        //     ApplicationSettings.setBoolean("isHostBoarding",false);
        //     this.isBluetoothBoardingPass = true;
        //     this.isHostBoardingPass = false;
        // }
        // else
        // {
        //     ApplicationSettings.setBoolean("isBluetoothBoarding",false);
        //     ApplicationSettings.setBoolean("isHostBoarding",true);
        //     this.isBluetoothBoardingPass = false;
        //     this.isHostBoardingPass = true;
        // }
        // if(!isHostBagtag){
        //     ApplicationSettings.setBoolean("isBluetoothBagtag",true);
        //     ApplicationSettings.setBoolean("isHostBagtag",false);
        //     this.isBluetoothBagtag = true;
        //     this.isHostBagtag = false; 
        // }else{
        //     ApplicationSettings.setBoolean("isBluetoothBagtag",false);
        //     ApplicationSettings.setBoolean("isHostBagtag",true);
        //     this.isBluetoothBagtag = false;
        //     this.isHostBagtag = true;
        // }


    }

    FirstLayout() {
        this.SelectPrinter = true;
        this.FirstBlock = true;
        this.SecondBlock = false;
        this.ThirdBlock = false;
        this.FourthBlock = false;
        this.FifthBlock = false;
        this.SelectPrinter1 = false;
    }
    SecondLayout() {
        this.SelectPrinter = false;
        this.FirstBlock = false;
        this.SecondBlock = true;
        this.ThirdBlock = false;
        this.FourthBlock = false;
        this.FifthBlock = false;
        this.SelectPrinter1 = false;
    }
    ThirdLayout() {
        this.SelectPrinter = false;
        this.FirstBlock = false;
        this.SecondBlock = false;
        this.ThirdBlock = true;
        this.FourthBlock = false;
        this.FifthBlock = false;
        this.SelectPrinter1 = false;
    }
    FourthLayout() {
        this.SelectPrinter = false;
        this.FirstBlock = false;
        this.SecondBlock = false;
        this.ThirdBlock = false;
        this.FourthBlock = true;
        this.FifthBlock = false;
        this.SelectPrinter1 = false;
    }
    FifthLayout() {
        this.SelectPrinter = false;
        this.FirstBlock = false;
        this.SecondBlock = false;
        this.ThirdBlock = false;
        this.FourthBlock = false;
        this.FifthBlock = true;
        this.SelectPrinter1 = false;
    }
    navigateToSearch() {
        if (this.isCheckinDisabled == true) {
            var profile: string = JSON.stringify(this.ProfileArray)
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

    getBluetoothPrinterDetails() {
        let discovery = new zebra.Discovery();
        let self = this;
        discovery.searchBluetooth().then(function (printers) {
            var count = printers.length;

            if (count === 0) {
                console.log("message", "Unable to find");
                Toast.makeText("No Device found").show();
            } else if (count >= 1) {
                // We found a valid printer
                var actions: Array<string> = [];
                console.dir(printers);
                printers.forEach(element => {
                    actions.push(element.address);
                });
                let options = {
                    title: "Bluetooth Printer",
                    message: "Select Printer",
                    actions: actions
                };
                dialogs.action(options).then((result) => {
                    console.log(result);
                    ApplicationSettings.setString('printer', result);
                    self.bltPrinter = result;
                }, (err) => {

                });
            }
        });
    }

    SearchOffice(officeName: string, isBagtag: boolean): void {
        var officeName = officeName.toString().toUpperCase();
        this.getWorkstationList(officeName, isBagtag);
    }

    SearchPrinter(WorkstationName: string, isBagtag: boolean): void {
        // var OldWorkStation = ApplicationSettings.getString("hostPrinter", "");
        // if (WorkstationName != OldWorkStation) {
        if (isBagtag) {
            this.hostBagtagWS = WorkstationName
            ApplicationSettings.setString("hostBagtagWS", WorkstationName);
            // this.getPrinterDetails(WorkstationName.toString().toUpperCase()
        } else {
            this.hostBoardingWS = WorkstationName
            ApplicationSettings.setString("hostBoardingWS", WorkstationName);
        }
        this.loaderProgress.showLoader();
        WorkstationName = WorkstationName.toString().toUpperCase();
        try {
            this._dataService.SearchPrinterDeviceByWorkStation(WorkstationName)
                .subscribe((data) => {
                    if (data.workstation != null) {
                        this.PrinterDeviceList = data.workstation.filter(m => m.workstationName == WorkstationName)[0];
                        if (isBagtag) {
                            this.BagtagPrinterList = this.PrinterDeviceList.device.filter(m => m.Description == "BagTag Printer");
                            this.loaderProgress.hideLoader();
                            this.onChangePrinter2();
                        } else {
                            this.BoardingPassPrinterList = this.PrinterDeviceList.device.filter(m => m.Description == "BoardingPass Printer");
                            this.loaderProgress.hideLoader();
                            this.onChangePrinter();
                        }
                        // console.dir(this.PrinterDeviceList);
                    } else {
                        Toast.makeText("No Printer Found").show();
                        this.PrinterDeviceList = new PrinterDeviceModel.Workstation();
                        if (isBagtag) {
                            this.BagtagPrinterList = []
                            this.BagtagDeviceName = "";
                            ApplicationSettings.setString("bagtagDeviceName", this.BagtagDeviceName);
                        } else {
                            this.BoardingPassPrinterList = []
                            this.BoardingPassDeviceName = "";
                            ApplicationSettings.setString("boardingPassDeviceName", this.BoardingPassDeviceName)
                        }

                    }
                    this.loaderProgress.hideLoader();
                },
                err => {
                    console.log("Couldnt find information for this Profile " + err);
                    this.loaderProgress.hideLoader();
                }, () => {
                    this.loaderProgress.hideLoader();
                })
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }


        // this.WorkstationName = WorkstationName;
        // ApplicationSettings.setString("hostPrinter", WorkstationName);
        // var WorkStation = WorkstationName.toString().toUpperCase();
        // this.isDefault = true;
        // this.getPrinterDetails(WorkStation);
        // this.BoardingPassDeviceName = "";
        // this.BagtagDeviceName = "";
        // ApplicationSettings.setString("boardingPassDeviceName", this.BoardingPassDeviceName);
        // ApplicationSettings.setString("pectabVersion", "");
        // ApplicationSettings.setString("bagtagDeviceName", this.BoardingPassDeviceName);
        // ApplicationSettings.setString("pectabVersion", "");
        // this.lableVisible = true;
        // }
    }

    getPrinterDetails(WorkstationName: string): void {
        try {
            var sDate = new Date();
            this.loaderProgress.showLoader();

            this._dataService.SearchPrinterDeviceByWorkStation(WorkstationName)
                .subscribe((data) => {
                    if (data.workstation != null) {
                        this.PrinterDeviceList = data.workstation.filter(m => m.workstationName == WorkstationName)[0];
                        this.BoardingPassPrinterList = this.PrinterDeviceList.device.filter(m => m.Description == "BoardingPass Printer");
                        this.BagtagPrinterList = this.PrinterDeviceList.device.filter(m => m.Description == "BagTag Printer");
                        if (this.isDefault) {
                            ApplicationSettings.setBoolean("isHost", true);
                            ApplicationSettings.setBoolean("isBluetooth", false);
                        }
                        console.dir(this.PrinterDeviceList);
                    } else {
                        Toast.makeText("No Printer Found").show();
                    }

                },
                err => {
                    console.log("Couldnt find information for this Profile " + err);
                    this.loaderProgress.hideLoader();
                }, () => {
                    this.loaderProgress.hideLoader();
                })


        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();

        }
        finally {
            var eDate = new Date();
            console.log('GetAccountProfile Service --------------- End Date Time : ' + eDate);
            console.log('GetAccountProfile Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    }

    toggleBagtagDefault() {
        this.isHostBagtag = !this.isHostBagtag;
        ApplicationSettings.setBoolean("isHostBagtag", this.isHostBagtag);
        if (this.isHostBagtag) {
            Toast.makeText("Default Bagtag Printer Changed: Host Printer").show();
            if (this.hostBagtagWS.trim() === '' || this.hostBagtagOffice.trim() === '' || this.hostBagtagPrinter.trim() === '') {
                Toast.makeText("Please set the Office, Workstation and Printer").show();
            }
        } else {
            Toast.makeText("Default Bagtag Printer Changed: Bluetooth Printer").show();
            if (this.bluetoothBagtagPrinter.trim() !== '') {
                Toast.makeText("Please set the Bluetooth Printer").show();
            }
        }
    }

    toggleBoardingDefault() {
        this.isHostBoarding = !this.isHostBoarding;
        ApplicationSettings.setBoolean("isHostBoarding", this.isHostBoarding);
        if (this.isHostBoarding) {
            Toast.makeText("Default Boarding Printer Changed: Host Printer").show();
            if (this.hostBoardingWS.trim() === '' || this.hostBoardingOffice.trim() === '' || this.hostBoardingPrinter.trim() === '') {
                Toast.makeText("Please set the Office, Workstation and Printer").show();
            }
        } else {
            Toast.makeText("Default Borading Printer Changed: Bluetooth Printer").show();
            if (this.bluetoothBoardingPrinter.trim() !== '') {
                Toast.makeText("Please set the Bluetooth Printer").show();
            }
        }
    }



    getWorkstationList(officeName: string, isBagTag: boolean): void {
        try {
            this.loaderProgress.showLoader();
            if (isBagTag) {
                this.hostBagtagOffice = officeName
                ApplicationSettings.setString("hostBagtagOffice", officeName);
                // this.getPrinterDetails(WorkstationName.toString().toUpperCase()
            } else {
                this.hostBoardingOffice = officeName
                ApplicationSettings.setString("hostBoardingOffice", officeName);
            }
            let office: any = { "Office": [{ "OfficeName": officeName }] };
            this._dataService.SearchOfficeNameByWorkStation(officeName)
                .subscribe((data) => {
                    console.log("data");
                    console.log(data);
                    // if (data.Office.length > 0) {
                    if (data.workstation != undefined) {
                        let workStationList: Array<string> = [];
                        workStationList.length = 0;
                        data.workstation.forEach((item) => {
                            workStationList.push(item.workstationName);
                        })
                        this.workStationList = workStationList;
                        // this._shared.SetWorkStation(data.Office[0].Workstation); 
                        // ApplicationSettings.setString("OfficeName", this.OfficeName);
                        this.loaderProgress.hideLoader();
                        this.searchWorkStation(isBagTag);

                    }
                    else {
                        Toast.makeText("No Work Station Found").show();
                    }

                    // } else {
                    //     Toast.makeText("No Work Station Found").show();
                    // }
                },
                err => {
                    console.log("Couldnt find information for this Profile " + err);
                    this.handleServiceError(err);
                    this.loaderProgress.hideLoader();
                }, () => {
                    this.loaderProgress.hideLoader();
                })


        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();

        }
        finally {
            var eDate = new Date();
            console.log('getOfficeNameList Service --------------- End Date Time : ' + eDate);
        }
    }
    searchWorkStation(isBagTag) {
        let options = {
            title: "Change Sales Office",
            message: "Select Sales Office",
            cancelButtonText: "Cancel",
            actions: this.workStationList
        };
        dialogs.action(options).then((result) => {
            if (result != "Cancel") {
                this.SearchPrinter(result, isBagTag);
            }

        });
    }

    loginSubmit() {
        ApplicationSettings.setString('apiurl', this.URL);
        this.routerExtensions.navigate([""], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
        this.lableVisible = true;
    }
    change() {
        this.lableVisible = false;
    }
    changeLicense() {
        this.changeLicenseKey = false;
    }
    deleteCookies() {
        const cookies: any = NSHTTPCookieStorage.sharedHTTPCookieStorage.cookies;
        if (typeof cookies !== 'undefined') {
            for (let i = 0; i < cookies.count; i++) {
                const cookie: any = cookies.objectAtIndex(i);
                console.log(cookie);
                NSHTTPCookieStorage.sharedHTTPCookieStorage.deleteCookie(cookie);
            }
        }
        console.log("Cookies Deleted");
    }
    onChangePrinter() {
        if (this.BoardingPassPrinterList.length > 0) {
            this.SelectPrinter = true;
            this.FirstBlock = false;
            this.SelectPrinter1 = true;
            console.log(this.BoardingPassPrinterList);
            this.newDeviceList = this.BoardingPassPrinterList;
            var PectabValue = ApplicationSettings.getString("pectabVersion", "");
            var PreviousPrinter = ApplicationSettings.getString("boardingPassDeviceName", "");
            this.newDeviceList.filter(m => m.DeviceName == PreviousPrinter && m.Pectab == PectabValue)[0].IsSelectedDevice = true;
        } else {
            Toast.makeText("No Device Found").show();
        }
    }
    onChangePrinter2() {
        if (this.BagtagPrinterList.length > 0) {
            this.SelectPrinter = true;
            this.FirstBlock = false;
            this.SelectPrinter2 = true;
            console.log(this.BoardingPassPrinterList);
            this.newDeviceList = this.BagtagPrinterList;
            var PectabValue = ApplicationSettings.getString("bagtagpectabVersion", "");
            var PreviousPrinter = ApplicationSettings.getString("bagtagDeviceName", "");
            this.newDeviceList.filter(m => m.DeviceName == PreviousPrinter && m.Pectab == PectabValue)[0].IsSelectedDevice = true;
        } else {
            Toast.makeText("No Device Found").show();
        }
    }

    toggleChecked(devicelist: PrinterDeviceModel.Device) {
        this.newDeviceList.forEach((element, index) => {
            element.IsSelectedDevice = false;
        });
        var Device = devicelist;
        Device.IsSelectedDevice = true;
        this.BoardingPassDeviceName = Device.DeviceName;
        this.BoardingPassDeviceName = this.newDeviceList.filter(m => m.IsSelectedDevice == true)[0].DeviceName;
        var Pectab = Device.Pectab;
        var DeviceType = Device.DeviceType;
        console.log("DeviceType : " + JSON.stringify(Device.DeviceType));
        console.log("DeviceType : " + JSON.stringify(Device.Pectab));
        ApplicationSettings.setString("hostBagtagOffice",this.hostBagtagOffice);
        ApplicationSettings.setString("boardingPassDeviceName", this.BoardingPassDeviceName);
        ApplicationSettings.setString("deviceType", DeviceType);        
        ApplicationSettings.setString("pectabVersion", Pectab);
        this.SelectPrinter1 = false;
        this.FirstBlock = true;
    }

    togglebagtagChecked(devicelist: PrinterDeviceModel.Device) {
        this.newDeviceList.forEach((element, index) => {
            element.IsSelectedDevice = false;
        });
        var Device = devicelist;
        Device.IsSelectedDevice = true;
        this.BagtagDeviceName = Device.DeviceName;
        this.BagtagDeviceName = Device.DeviceName;
        var Pectab = Device.Pectab;
        var DeviceType = Device.DeviceType;
        ApplicationSettings.setString("hostBoardingOffice",this.hostBoardingOffice);
        ApplicationSettings.setString("bagtagDeviceName", this.BagtagDeviceName);
        ApplicationSettings.setString("BTdeviceType", DeviceType);        
        ApplicationSettings.setString("bagtagpectabVersion", Pectab);
        this.SelectPrinter2 = false;
        this.FirstBlock = true;
    }
    SavePrinter(): void {
        this.BoardingPassDeviceName = this.newDeviceList.filter(m => m.IsSelectedDevice == true)[0].DeviceName;
        var Pectab = this.newDeviceList.filter(m => m.IsSelectedDevice == true)[0].Pectab;
        ApplicationSettings.setString("boardingPassDeviceName", this.BoardingPassDeviceName);
        ApplicationSettings.setString("pectabVersion", Pectab);
        this.SelectPrinter1 = false;
        this.FirstBlock = true;

    }
    SaveBagtagPrinter(): void {
        this.BagtagDeviceName = this.newDeviceList.filter(m => m.IsSelectedDevice == true)[0].DeviceName;
        var Pectab = this.newDeviceList.filter(m => m.IsSelectedDevice == true)[0].Pectab;
        ApplicationSettings.setString("bagtagDeviceName", this.BagtagDeviceName);
        ApplicationSettings.setString("bagtagpectabVersion", Pectab);
        this.SelectPrinter2 = false;
        this.FirstBlock = true;

    }
    changeDate() {
        let options = {
            title: "Date Formats",
            // message: "Choose  catalog",
            cancelButtonText: "Cancel",
            actions: ["MM-DD-YYYY", "DD-MMM-YYYY", "DD-MM-YYYY"]
        };
        dialogs.action(options).then((result) => {
            if (result != "Cancel") {
                console.log(result);
                this._shared.SetDateFormat(result);
                this.DateFormat = result;
                this.userdetails = this.ProfileArray.PointOfSales[0].AirportCode + " | " + moment().format(result) + " | " + this.ProfileArray.Username;
                console.log("V" + this.userdetails);
                console.log("V" + this.userdetails.substr(4, 10));
                this.Date = moment(new Date()).format(result);
                ApplicationSettings.setString("dateFormat", this.DateFormat);
                ApplicationSettings.setString("userdetails", this.userdetails);
            }
        });

    }
    licenseKey() {
        ApplicationSettings.setString("licenseKey", this.BlinkIDLicenseKey);
        this._shared.SetLicenseKey(this.BlinkIDLicenseKey);
        this.changeLicenseKey = true;

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
