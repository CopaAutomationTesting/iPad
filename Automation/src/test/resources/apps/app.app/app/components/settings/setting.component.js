"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var router_2 = require("nativescript-angular/router");
var page_1 = require("ui/page");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var dialogs = require("ui/dialogs");
var Toast = require("nativescript-toast");
//external modules and plugins
var ApplicationSettings = require("application-settings");
var moment = require("moment");
var zebra = require("nativescript-print-zebra");
//app references
// import { UpgradeInfoArray, PaxTemplate, PassengerCheckin, InBound, FlightInfo, MultiSegmentTemplate, FQTVInfo, FQTVPro, CheckInPostTemplate, DepartureInfo, OutBound, LoaderProgress, SecurityDocument, Document, PhoneNumber, Address, ApisRequirement, EmergencyDetails, EmergencyPhone, AssociatedPassenger } from '../../shared/interface/index';
var index_1 = require("../../shared/services/index");
var index_2 = require("../../shared/interface/index");
var index_3 = require("../../shared/model/index");
var app_executiontime_1 = require("../../app.executiontime");
var app_constants_1 = require("../../app.constants");
ApplicationSettings.setString('apiurl', "http://ustlssoam316.airservices.svcs.entsvcs.net:8980/");
var PrinterDetails = /** @class */ (function () {
    function PrinterDetails() {
    }
    return PrinterDetails;
}());
exports.PrinterDetails = PrinterDetails;
var SettingComponent = /** @class */ (function () {
    function SettingComponent(_dataService, _service, _timeoutService, page, routerExtensions, router, location, _shared, vcRef, _modalService) {
        this._dataService = _dataService;
        this._service = _service;
        this._timeoutService = _timeoutService;
        this.page = page;
        this.routerExtensions = routerExtensions;
        this.router = router;
        this.location = location;
        this._shared = _shared;
        this.vcRef = vcRef;
        this._modalService = _modalService;
        this.FirstBlock = true;
        this.SecondBlock = false;
        this.ThirdBlock = false;
        this.FourthBlock = false;
        this.FifthBlock = false;
        this.SelectPrinter = true;
        this.SelectPrinter1 = false;
        this.SelectPrinter2 = false;
        this.newDeviceList = [];
        this.ProfileArray = new index_2.AccontProfileModel.AccountProfileTemplate();
        this.SearchFields = new index_3.Search();
        this.PrinterDeviceList = new index_2.PrinterDeviceModel.Workstation();
        this.BoardingPassDeviceName = "";
        this.BagtagDeviceName = "";
        this.SelectedDeviceSetting = new index_2.PrinterDevice.Device();
        this.URL = "http://ustlssoam316.airservices.svcs.entsvcs.net:8980/";
        this.lableVisible = true;
        this.changeLicenseKey = true;
        this.BoardingPassPrinterList = [];
        this.BagtagPrinterList = [];
        this.someProperty = false;
        this.isHostBoardingPass = false;
        this.isBluetoothBoardingPass = true;
        this.isBluetoothBagtag = true;
        this.isDefault = false;
        this.DeliverDetails = new index_2.BoardingPass.BoardingPassDeliveryDetail();
        this.isHostBoarding = false;
        this.isHostBagtag = false;
        this.isCompensationEnabled = false;
        this.isCheckinDisabled = false;
        this.isGateDisabled = false;
        this.isError = false;
        this.errorMessage = "";
        this.loaderProgress = new index_2.LoaderProgress();
        this.URL = ApplicationSettings.getString('apiurl', '');
        this.DateFormat = ApplicationSettings.getString("dateFormat", "");
        var sDate = new Date();
        this.Date = moment(sDate).format(this.DateFormat);
        this.BoardingPassDeviceName = ApplicationSettings.getString("boardingPassDeviceName", '');
        this.BagtagDeviceName = ApplicationSettings.getString("bagtagDeviceName", "");
        if (ApplicationSettings.getString("licenseKey", '')) {
            this.BlinkIDLicenseKey = ApplicationSettings.getString("licenseKey", '');
            this._shared.SetLicenseKey(this.BlinkIDLicenseKey);
        }
        else {
            this.BlinkIDLicenseKey = this._shared.GetLicenseKey();
        }
    }
    SettingComponent.prototype.ngOnInit = function () {
        this.page.style.backgroundSize = "cover ";
        this.ProfileArray = this._shared.GetUserProfile();
        this.loaderProgress.initLoader(this.pageCont);
        this.SearchFields.Location = this.ProfileArray.PointOfSales[0].AirportCode;
        this.SelectedDeviceSetting = this._shared.GetDevicePrinterDeatils();
        if (this.SelectedDeviceSetting != null) {
            this.BoardingPassDeviceName = this.SelectedDeviceSetting.DeviceName;
        }
        this.WorkstationName = ApplicationSettings.getString("hostPrinter", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled");
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
        var label = this.pageCont.nativeElement;
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args) {
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
    };
    SettingComponent.prototype.FirstLayout = function () {
        this.SelectPrinter = true;
        this.FirstBlock = true;
        this.SecondBlock = false;
        this.ThirdBlock = false;
        this.FourthBlock = false;
        this.FifthBlock = false;
        this.SelectPrinter1 = false;
    };
    SettingComponent.prototype.SecondLayout = function () {
        this.SelectPrinter = false;
        this.FirstBlock = false;
        this.SecondBlock = true;
        this.ThirdBlock = false;
        this.FourthBlock = false;
        this.FifthBlock = false;
        this.SelectPrinter1 = false;
    };
    SettingComponent.prototype.ThirdLayout = function () {
        this.SelectPrinter = false;
        this.FirstBlock = false;
        this.SecondBlock = false;
        this.ThirdBlock = true;
        this.FourthBlock = false;
        this.FifthBlock = false;
        this.SelectPrinter1 = false;
    };
    SettingComponent.prototype.FourthLayout = function () {
        this.SelectPrinter = false;
        this.FirstBlock = false;
        this.SecondBlock = false;
        this.ThirdBlock = false;
        this.FourthBlock = true;
        this.FifthBlock = false;
        this.SelectPrinter1 = false;
    };
    SettingComponent.prototype.FifthLayout = function () {
        this.SelectPrinter = false;
        this.FirstBlock = false;
        this.SecondBlock = false;
        this.ThirdBlock = false;
        this.FourthBlock = false;
        this.FifthBlock = true;
        this.SelectPrinter1 = false;
    };
    SettingComponent.prototype.navigateToSearch = function () {
        if (this.isCheckinDisabled == true) {
            var profile = JSON.stringify(this.ProfileArray);
            this.routerExtensions.navigate(["search"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                }
            });
        }
    };
    SettingComponent.prototype.getBluetoothPrinterDetails = function () {
        var discovery = new zebra.Discovery();
        var self = this;
        discovery.searchBluetooth().then(function (printers) {
            var count = printers.length;
            if (count === 0) {
                console.log("message", "Unable to find");
                Toast.makeText("No Device found").show();
            }
            else if (count >= 1) {
                // We found a valid printer
                var actions = [];
                console.dir(printers);
                printers.forEach(function (element) {
                    actions.push(element.address);
                });
                var options = {
                    title: "Bluetooth Printer",
                    message: "Select Printer",
                    actions: actions
                };
                dialogs.action(options).then(function (result) {
                    console.log(result);
                    ApplicationSettings.setString('printer', result);
                    self.bltPrinter = result;
                }, function (err) {
                });
            }
        });
    };
    SettingComponent.prototype.SearchOffice = function (officeName, isBagtag) {
        var officeName = officeName.toString().toUpperCase();
        this.getWorkstationList(officeName, isBagtag);
    };
    SettingComponent.prototype.SearchPrinter = function (WorkstationName, isBagtag) {
        var _this = this;
        // var OldWorkStation = ApplicationSettings.getString("hostPrinter", "");
        // if (WorkstationName != OldWorkStation) {
        if (isBagtag) {
            this.hostBagtagWS = WorkstationName;
            ApplicationSettings.setString("hostBagtagWS", WorkstationName);
            // this.getPrinterDetails(WorkstationName.toString().toUpperCase()
        }
        else {
            this.hostBoardingWS = WorkstationName;
            ApplicationSettings.setString("hostBoardingWS", WorkstationName);
        }
        this.loaderProgress.showLoader();
        WorkstationName = WorkstationName.toString().toUpperCase();
        try {
            this._dataService.SearchPrinterDeviceByWorkStation(WorkstationName)
                .subscribe(function (data) {
                if (data.workstation != null) {
                    _this.PrinterDeviceList = data.workstation.filter(function (m) { return m.workstationName == WorkstationName; })[0];
                    if (isBagtag) {
                        _this.BagtagPrinterList = _this.PrinterDeviceList.device.filter(function (m) { return m.Description == "BagTag Printer"; });
                        _this.loaderProgress.hideLoader();
                        _this.onChangePrinter2();
                    }
                    else {
                        _this.BoardingPassPrinterList = _this.PrinterDeviceList.device.filter(function (m) { return m.Description == "BoardingPass Printer"; });
                        _this.loaderProgress.hideLoader();
                        _this.onChangePrinter();
                    }
                    // console.dir(this.PrinterDeviceList);
                }
                else {
                    Toast.makeText("No Printer Found").show();
                    _this.PrinterDeviceList = new index_2.PrinterDeviceModel.Workstation();
                    if (isBagtag) {
                        _this.BagtagPrinterList = [];
                        _this.BagtagDeviceName = "";
                        ApplicationSettings.setString("bagtagDeviceName", _this.BagtagDeviceName);
                    }
                    else {
                        _this.BoardingPassPrinterList = [];
                        _this.BoardingPassDeviceName = "";
                        ApplicationSettings.setString("boardingPassDeviceName", _this.BoardingPassDeviceName);
                    }
                }
                _this.loaderProgress.hideLoader();
            }, function (err) {
                console.log("Couldnt find information for this Profile " + err);
                _this.loaderProgress.hideLoader();
            }, function () {
                _this.loaderProgress.hideLoader();
            });
        }
        catch (error) {
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
    };
    SettingComponent.prototype.getPrinterDetails = function (WorkstationName) {
        var _this = this;
        try {
            var sDate = new Date();
            this.loaderProgress.showLoader();
            this._dataService.SearchPrinterDeviceByWorkStation(WorkstationName)
                .subscribe(function (data) {
                if (data.workstation != null) {
                    _this.PrinterDeviceList = data.workstation.filter(function (m) { return m.workstationName == WorkstationName; })[0];
                    _this.BoardingPassPrinterList = _this.PrinterDeviceList.device.filter(function (m) { return m.Description == "BoardingPass Printer"; });
                    _this.BagtagPrinterList = _this.PrinterDeviceList.device.filter(function (m) { return m.Description == "BagTag Printer"; });
                    if (_this.isDefault) {
                        ApplicationSettings.setBoolean("isHost", true);
                        ApplicationSettings.setBoolean("isBluetooth", false);
                    }
                    console.dir(_this.PrinterDeviceList);
                }
                else {
                    Toast.makeText("No Printer Found").show();
                }
            }, function (err) {
                console.log("Couldnt find information for this Profile " + err);
                _this.loaderProgress.hideLoader();
            }, function () {
                _this.loaderProgress.hideLoader();
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('GetAccountProfile Service --------------- End Date Time : ' + eDate);
            console.log('GetAccountProfile Service Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    };
    SettingComponent.prototype.toggleBagtagDefault = function () {
        this.isHostBagtag = !this.isHostBagtag;
        ApplicationSettings.setBoolean("isHostBagtag", this.isHostBagtag);
        if (this.isHostBagtag) {
            Toast.makeText("Default Bagtag Printer Changed: Host Printer").show();
            if (this.hostBagtagWS.trim() === '' || this.hostBagtagOffice.trim() === '' || this.hostBagtagPrinter.trim() === '') {
                Toast.makeText("Please set the Office, Workstation and Printer").show();
            }
        }
        else {
            Toast.makeText("Default Bagtag Printer Changed: Bluetooth Printer").show();
            if (this.bluetoothBagtagPrinter.trim() !== '') {
                Toast.makeText("Please set the Bluetooth Printer").show();
            }
        }
    };
    SettingComponent.prototype.toggleBoardingDefault = function () {
        this.isHostBoarding = !this.isHostBoarding;
        ApplicationSettings.setBoolean("isHostBoarding", this.isHostBoarding);
        if (this.isHostBoarding) {
            Toast.makeText("Default Boarding Printer Changed: Host Printer").show();
            if (this.hostBoardingWS.trim() === '' || this.hostBoardingOffice.trim() === '' || this.hostBoardingPrinter.trim() === '') {
                Toast.makeText("Please set the Office, Workstation and Printer").show();
            }
        }
        else {
            Toast.makeText("Default Borading Printer Changed: Bluetooth Printer").show();
            if (this.bluetoothBoardingPrinter.trim() !== '') {
                Toast.makeText("Please set the Bluetooth Printer").show();
            }
        }
    };
    SettingComponent.prototype.getWorkstationList = function (officeName, isBagTag) {
        var _this = this;
        try {
            this.loaderProgress.showLoader();
            if (isBagTag) {
                this.hostBagtagOffice = officeName;
                ApplicationSettings.setString("hostBagtagOffice", officeName);
                // this.getPrinterDetails(WorkstationName.toString().toUpperCase()
            }
            else {
                this.hostBoardingOffice = officeName;
                ApplicationSettings.setString("hostBoardingOffice", officeName);
            }
            var office = { "Office": [{ "OfficeName": officeName }] };
            this._dataService.SearchOfficeNameByWorkStation(officeName)
                .subscribe(function (data) {
                console.log("data");
                console.log(data);
                // if (data.Office.length > 0) {
                if (data.workstation != undefined) {
                    var workStationList_1 = [];
                    workStationList_1.length = 0;
                    data.workstation.forEach(function (item) {
                        workStationList_1.push(item.workstationName);
                    });
                    _this.workStationList = workStationList_1;
                    // this._shared.SetWorkStation(data.Office[0].Workstation); 
                    // ApplicationSettings.setString("OfficeName", this.OfficeName);
                    _this.loaderProgress.hideLoader();
                    _this.searchWorkStation(isBagTag);
                }
                else {
                    Toast.makeText("No Work Station Found").show();
                }
                // } else {
                //     Toast.makeText("No Work Station Found").show();
                // }
            }, function (err) {
                console.log("Couldnt find information for this Profile " + err);
                _this.handleServiceError(err);
                _this.loaderProgress.hideLoader();
            }, function () {
                _this.loaderProgress.hideLoader();
            });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('getOfficeNameList Service --------------- End Date Time : ' + eDate);
        }
    };
    SettingComponent.prototype.searchWorkStation = function (isBagTag) {
        var _this = this;
        var options = {
            title: "Change Sales Office",
            message: "Select Sales Office",
            cancelButtonText: "Cancel",
            actions: this.workStationList
        };
        dialogs.action(options).then(function (result) {
            if (result != "Cancel") {
                _this.SearchPrinter(result, isBagTag);
            }
        });
    };
    SettingComponent.prototype.loginSubmit = function () {
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
    };
    SettingComponent.prototype.change = function () {
        this.lableVisible = false;
    };
    SettingComponent.prototype.changeLicense = function () {
        this.changeLicenseKey = false;
    };
    SettingComponent.prototype.deleteCookies = function () {
        var cookies = NSHTTPCookieStorage.sharedHTTPCookieStorage.cookies;
        if (typeof cookies !== 'undefined') {
            for (var i = 0; i < cookies.count; i++) {
                var cookie = cookies.objectAtIndex(i);
                console.log(cookie);
                NSHTTPCookieStorage.sharedHTTPCookieStorage.deleteCookie(cookie);
            }
        }
        console.log("Cookies Deleted");
    };
    SettingComponent.prototype.onChangePrinter = function () {
        if (this.BoardingPassPrinterList.length > 0) {
            this.SelectPrinter = true;
            this.FirstBlock = false;
            this.SelectPrinter1 = true;
            console.log(this.BoardingPassPrinterList);
            this.newDeviceList = this.BoardingPassPrinterList;
            var PectabValue = ApplicationSettings.getString("pectabVersion", "");
            var PreviousPrinter = ApplicationSettings.getString("boardingPassDeviceName", "");
            this.newDeviceList.filter(function (m) { return m.DeviceName == PreviousPrinter && m.Pectab == PectabValue; })[0].IsSelectedDevice = true;
        }
        else {
            Toast.makeText("No Device Found").show();
        }
    };
    SettingComponent.prototype.onChangePrinter2 = function () {
        if (this.BagtagPrinterList.length > 0) {
            this.SelectPrinter = true;
            this.FirstBlock = false;
            this.SelectPrinter2 = true;
            console.log(this.BoardingPassPrinterList);
            this.newDeviceList = this.BagtagPrinterList;
            var PectabValue = ApplicationSettings.getString("bagtagpectabVersion", "");
            var PreviousPrinter = ApplicationSettings.getString("bagtagDeviceName", "");
            this.newDeviceList.filter(function (m) { return m.DeviceName == PreviousPrinter && m.Pectab == PectabValue; })[0].IsSelectedDevice = true;
        }
        else {
            Toast.makeText("No Device Found").show();
        }
    };
    SettingComponent.prototype.toggleChecked = function (devicelist) {
        this.newDeviceList.forEach(function (element, index) {
            element.IsSelectedDevice = false;
        });
        var Device = devicelist;
        Device.IsSelectedDevice = true;
        this.BoardingPassDeviceName = Device.DeviceName;
        this.BoardingPassDeviceName = this.newDeviceList.filter(function (m) { return m.IsSelectedDevice == true; })[0].DeviceName;
        var Pectab = Device.Pectab;
        var DeviceType = Device.DeviceType;
        console.log("DeviceType : " + JSON.stringify(Device.DeviceType));
        console.log("DeviceType : " + JSON.stringify(Device.Pectab));
        ApplicationSettings.setString("hostBagtagOffice", this.hostBagtagOffice);
        ApplicationSettings.setString("boardingPassDeviceName", this.BoardingPassDeviceName);
        ApplicationSettings.setString("deviceType", DeviceType);
        ApplicationSettings.setString("pectabVersion", Pectab);
        this.SelectPrinter1 = false;
        this.FirstBlock = true;
    };
    SettingComponent.prototype.togglebagtagChecked = function (devicelist) {
        this.newDeviceList.forEach(function (element, index) {
            element.IsSelectedDevice = false;
        });
        var Device = devicelist;
        Device.IsSelectedDevice = true;
        this.BagtagDeviceName = Device.DeviceName;
        this.BagtagDeviceName = Device.DeviceName;
        var Pectab = Device.Pectab;
        var DeviceType = Device.DeviceType;
        ApplicationSettings.setString("hostBoardingOffice", this.hostBoardingOffice);
        ApplicationSettings.setString("bagtagDeviceName", this.BagtagDeviceName);
        ApplicationSettings.setString("BTdeviceType", DeviceType);
        ApplicationSettings.setString("bagtagpectabVersion", Pectab);
        this.SelectPrinter2 = false;
        this.FirstBlock = true;
    };
    SettingComponent.prototype.SavePrinter = function () {
        this.BoardingPassDeviceName = this.newDeviceList.filter(function (m) { return m.IsSelectedDevice == true; })[0].DeviceName;
        var Pectab = this.newDeviceList.filter(function (m) { return m.IsSelectedDevice == true; })[0].Pectab;
        ApplicationSettings.setString("boardingPassDeviceName", this.BoardingPassDeviceName);
        ApplicationSettings.setString("pectabVersion", Pectab);
        this.SelectPrinter1 = false;
        this.FirstBlock = true;
    };
    SettingComponent.prototype.SaveBagtagPrinter = function () {
        this.BagtagDeviceName = this.newDeviceList.filter(function (m) { return m.IsSelectedDevice == true; })[0].DeviceName;
        var Pectab = this.newDeviceList.filter(function (m) { return m.IsSelectedDevice == true; })[0].Pectab;
        ApplicationSettings.setString("bagtagDeviceName", this.BagtagDeviceName);
        ApplicationSettings.setString("bagtagpectabVersion", Pectab);
        this.SelectPrinter2 = false;
        this.FirstBlock = true;
    };
    SettingComponent.prototype.changeDate = function () {
        var _this = this;
        var options = {
            title: "Date Formats",
            // message: "Choose  catalog",
            cancelButtonText: "Cancel",
            actions: ["MM-DD-YYYY", "DD-MMM-YYYY", "DD-MM-YYYY"]
        };
        dialogs.action(options).then(function (result) {
            if (result != "Cancel") {
                console.log(result);
                _this._shared.SetDateFormat(result);
                _this.DateFormat = result;
                _this.userdetails = _this.ProfileArray.PointOfSales[0].AirportCode + " | " + moment().format(result) + " | " + _this.ProfileArray.Username;
                console.log("V" + _this.userdetails);
                console.log("V" + _this.userdetails.substr(4, 10));
                _this.Date = moment(new Date()).format(result);
                ApplicationSettings.setString("dateFormat", _this.DateFormat);
                ApplicationSettings.setString("userdetails", _this.userdetails);
            }
        });
    };
    SettingComponent.prototype.licenseKey = function () {
        ApplicationSettings.setString("licenseKey", this.BlinkIDLicenseKey);
        this._shared.SetLicenseKey(this.BlinkIDLicenseKey);
        this.changeLicenseKey = true;
    };
    SettingComponent.prototype.navigateToSetting = function () {
        this.routerExtensions.navigate(["setting"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    SettingComponent.prototype.navigateToDepartures = function () {
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
    };
    SettingComponent.prototype.navigateTologin = function () {
        this.routerExtensions.navigate([""], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    };
    SettingComponent.prototype.navigateToCompensation = function () {
        if (this.isCompensationEnabled == true) {
            this.routerExtensions.navigate(["compensation"], {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 600,
                    curve: "linear"
                }
            });
        }
        else {
            Toast.makeText("Compensation Not applicable").show();
        }
    };
    SettingComponent.prototype.handleServiceError = function (error) {
        var _this = this;
        var errorMessage = error.toString();
        if (errorMessage.indexOf("SessionTimeout") > -1) {
            var options = {
                title: "Session Time Out",
                message: "Your session has been time out",
                okButtonText: "OK"
            };
            dialogs.alert(options).then(function () {
                _this.routerExtensions.navigate([""], {
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
    };
    __decorate([
        core_1.ViewChild('pagecontainer'),
        __metadata("design:type", core_1.ElementRef)
    ], SettingComponent.prototype, "pageCont", void 0);
    __decorate([
        core_1.ViewChild('hostprinter'),
        __metadata("design:type", core_1.ElementRef)
    ], SettingComponent.prototype, "hostprinter", void 0);
    __decorate([
        core_1.ViewChild('bluetoothprinter'),
        __metadata("design:type", core_1.ElementRef)
    ], SettingComponent.prototype, "bluetoothprinter", void 0);
    __decorate([
        core_1.ViewChild('default'),
        __metadata("design:type", core_1.ElementRef)
    ], SettingComponent.prototype, "default", void 0);
    __decorate([
        core_1.ViewChild('mypreference'),
        __metadata("design:type", core_1.ElementRef)
    ], SettingComponent.prototype, "mypreference", void 0);
    __decorate([
        core_1.ViewChild('selectboardingprinter'),
        __metadata("design:type", core_1.ElementRef)
    ], SettingComponent.prototype, "selectboardingprinter", void 0);
    __decorate([
        core_1.ViewChild('selectbagprinter'),
        __metadata("design:type", core_1.ElementRef)
    ], SettingComponent.prototype, "selectbagprinter", void 0);
    __decorate([
        core_1.ViewChild('plugin'),
        __metadata("design:type", core_1.ElementRef)
    ], SettingComponent.prototype, "plugin", void 0);
    __decorate([
        core_1.ViewChild('SettingScroller'),
        __metadata("design:type", core_1.ElementRef)
    ], SettingComponent.prototype, "SettingScroller", void 0);
    SettingComponent = __decorate([
        core_1.Component({
            selector: "home-page",
            providers: [index_1.DataService, app_constants_1.Configuration, index_1.PassengerService],
            templateUrl: "./components/settings/setting.component.html",
            styleUrls: ["./components/settings/setting.component.css"]
        }),
        __metadata("design:paramtypes", [index_1.DataService, index_1.PassengerService, index_1.TimeOutService, page_1.Page, router_2.RouterExtensions, router_1.Router, common_1.Location, index_1.CheckinOrderService, core_1.ViewContainerRef, modal_dialog_1.ModalDialogService])
    ], SettingComponent);
    return SettingComponent;
}());
exports.SettingComponent = SettingComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR0aW5nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyRjtBQUMzRiwwQ0FBMkU7QUFDM0UsMENBQTJDO0FBQzNDLHNEQUFnRTtBQUNoRSxnQ0FBK0I7QUFDL0Isa0VBQTJGO0FBRTNGLG9DQUF1QztBQUV2QywwQ0FBNEM7QUFHNUMsOEJBQThCO0FBQzlCLDBEQUE0RDtBQUM1RCwrQkFBaUM7QUFDakMsZ0RBQWtEO0FBR2xELGdCQUFnQjtBQUNoQix3VkFBd1Y7QUFFeFYscURBQWlIO0FBQ2pILHNEQUF3SztBQUN4SyxrREFBeUQ7QUFFekQsNkRBQTJEO0FBQzNELHFEQUFvRDtBQUlwRCxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLHdEQUF3RCxDQUFDLENBQUM7QUFHbEc7SUFBQTtJQUdBLENBQUM7SUFBRCxxQkFBQztBQUFELENBQUMsQUFIRCxJQUdDO0FBSFksd0NBQWM7QUFXM0I7SUErREksMEJBQW9CLFlBQXlCLEVBQVMsUUFBMEIsRUFBUyxlQUErQixFQUFVLElBQVUsRUFBVSxnQkFBa0MsRUFBVSxNQUFjLEVBQVUsUUFBa0IsRUFBUyxPQUE0QixFQUFVLEtBQXVCLEVBQVUsYUFBaUM7UUFBelUsaUJBQVksR0FBWixZQUFZLENBQWE7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFrQjtRQUFTLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVU7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFxQjtRQUFVLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQW9CO1FBckR0VixlQUFVLEdBQVksSUFBSSxDQUFDO1FB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d0NoaWxkLCBFbGVtZW50UmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFJvdXRlciwgTmF2aWdhdGlvbkV4dHJhcywgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zLCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHsgTW9kYWxEaWFsb2dTZXJ2aWNlLCBNb2RhbERpYWxvZ09wdGlvbnMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nXCI7XG5pbXBvcnQgeyBEZXZpY2VMaXN0UGlja0NvbXBvbmVudCB9IGZyb20gXCIuLi8uLi9jb21wb25lbnRzL2RldmljZUxpc3QvZGV2aWNlTGlzdC1tb2RhbFwiO1xuaW1wb3J0IGRpYWxvZ3MgPSByZXF1aXJlKFwidWkvZGlhbG9nc1wiKTtcbmltcG9ydCAqIGFzIGdlc3R1cmVzIGZyb20gXCJ1aS9nZXN0dXJlc1wiO1xuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcbmltcG9ydCAqIGFzIHN3aXRjaE1vZHVsZSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9zd2l0Y2hcIjtcblxuLy9leHRlcm5hbCBtb2R1bGVzIGFuZCBwbHVnaW5zXG5pbXBvcnQgKiBhcyBBcHBsaWNhdGlvblNldHRpbmdzIGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcbmltcG9ydCAqIGFzIHplYnJhIGZyb20gJ25hdGl2ZXNjcmlwdC1wcmludC16ZWJyYSc7XG5cblxuLy9hcHAgcmVmZXJlbmNlc1xuLy8gaW1wb3J0IHsgVXBncmFkZUluZm9BcnJheSwgUGF4VGVtcGxhdGUsIFBhc3NlbmdlckNoZWNraW4sIEluQm91bmQsIEZsaWdodEluZm8sIE11bHRpU2VnbWVudFRlbXBsYXRlLCBGUVRWSW5mbywgRlFUVlBybywgQ2hlY2tJblBvc3RUZW1wbGF0ZSwgRGVwYXJ0dXJlSW5mbywgT3V0Qm91bmQsIExvYWRlclByb2dyZXNzLCBTZWN1cml0eURvY3VtZW50LCBEb2N1bWVudCwgUGhvbmVOdW1iZXIsIEFkZHJlc3MsIEFwaXNSZXF1aXJlbWVudCwgRW1lcmdlbmN5RGV0YWlscywgRW1lcmdlbmN5UGhvbmUsIEFzc29jaWF0ZWRQYXNzZW5nZXIgfSBmcm9tICcuLi8uLi9zaGFyZWQvaW50ZXJmYWNlL2luZGV4JztcblxuaW1wb3J0IHsgRGF0YVNlcnZpY2UsIENoZWNraW5PcmRlclNlcnZpY2UsIFBhc3NlbmdlclNlcnZpY2UsIFRpbWVPdXRTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9pbmRleFwiO1xuaW1wb3J0IHsgUHJpbnRlckRldmljZSwgTG9hZGVyUHJvZ3Jlc3MsIFBhc3Nlbmdlckxpc3RUZW1wbGF0ZSwgUGFzc2VuZ2VyTGlzdCwgQWNjb250UHJvZmlsZU1vZGVsLCBCb2FyZGluZ1Bhc3MsIFByaW50ZXJEZXZpY2VNb2RlbCB9IGZyb20gXCIuLi8uLi9zaGFyZWQvaW50ZXJmYWNlL2luZGV4XCJcbmltcG9ydCB7IE9yZGVyLCBTZWFyY2ggfSBmcm9tIFwiLi4vLi4vc2hhcmVkL21vZGVsL2luZGV4XCI7XG5pbXBvcnQgeyBDb252ZXJ0ZXJzIH0gZnJvbSBcIi4uLy4uL3NoYXJlZC91dGlscy9pbmRleFwiO1xuaW1wb3J0IHsgQXBwRXhlY3V0aW9udGltZSB9IGZyb20gXCIuLi8uLi9hcHAuZXhlY3V0aW9udGltZVwiO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uLy4uL2FwcC5jb25zdGFudHMnO1xuXG5cblxuQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ2FwaXVybCcsIFwiaHR0cDovL3VzdGxzc29hbTMxNi5haXJzZXJ2aWNlcy5zdmNzLmVudHN2Y3MubmV0Ojg5ODAvXCIpO1xuZGVjbGFyZSB2YXIgTlNIVFRQQ29va2llU3RvcmFnZSwgTlNIVFRQQ29va2llO1xuXG5leHBvcnQgY2xhc3MgUHJpbnRlckRldGFpbHMge1xuICAgIHB1YmxpYyBpc0hvc3RQcmludGVyOiBib29sZWFuO1xuICAgIHB1YmxpY1xufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJob21lLXBhZ2VcIixcbiAgICBwcm92aWRlcnM6IFtEYXRhU2VydmljZSwgQ29uZmlndXJhdGlvbiwgUGFzc2VuZ2VyU2VydmljZV0sXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9jb21wb25lbnRzL3NldHRpbmdzL3NldHRpbmcuY29tcG9uZW50Lmh0bWxcIixcbiAgICBzdHlsZVVybHM6IFtcIi4vY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5nLmNvbXBvbmVudC5jc3NcIl1cbn0pXG5leHBvcnQgY2xhc3MgU2V0dGluZ0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgQFZpZXdDaGlsZCgncGFnZWNvbnRhaW5lcicpIHBhZ2VDb250OiBFbGVtZW50UmVmO1xuICAgIEBWaWV3Q2hpbGQoJ2hvc3RwcmludGVyJykgaG9zdHByaW50ZXI6IEVsZW1lbnRSZWY7XG4gICAgQFZpZXdDaGlsZCgnYmx1ZXRvb3RocHJpbnRlcicpIGJsdWV0b290aHByaW50ZXI6IEVsZW1lbnRSZWY7XG4gICAgQFZpZXdDaGlsZCgnZGVmYXVsdCcpIGRlZmF1bHQ6IEVsZW1lbnRSZWY7XG4gICAgQFZpZXdDaGlsZCgnbXlwcmVmZXJlbmNlJykgbXlwcmVmZXJlbmNlOiBFbGVtZW50UmVmO1xuICAgIEBWaWV3Q2hpbGQoJ3NlbGVjdGJvYXJkaW5ncHJpbnRlcicpIHNlbGVjdGJvYXJkaW5ncHJpbnRlcjogRWxlbWVudFJlZjtcbiAgICBAVmlld0NoaWxkKCdzZWxlY3RiYWdwcmludGVyJykgc2VsZWN0YmFncHJpbnRlcjogRWxlbWVudFJlZjtcbiAgICBAVmlld0NoaWxkKCdwbHVnaW4nKSBwbHVnaW46IEVsZW1lbnRSZWY7XG4gICAgQFZpZXdDaGlsZCgnU2V0dGluZ1Njcm9sbGVyJykgU2V0dGluZ1Njcm9sbGVyOiBFbGVtZW50UmVmO1xuICAgIHB1YmxpYyBGaXJzdEJsb2NrOiBib29sZWFuID0gdHJ1ZTtcbiAgICBwdWJsaWMgU2Vjb25kQmxvY2s6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgVGhpcmRCbG9jazogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBGb3VydGhCbG9jazogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBGaWZ0aEJsb2NrOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIFNlbGVjdFByaW50ZXI6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHB1YmxpYyBTZWxlY3RQcmludGVyMTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBTZWxlY3RQcmludGVyMjogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBuZXdEZXZpY2VMaXN0OiBBcnJheTxQcmludGVyRGV2aWNlTW9kZWwuRGV2aWNlPiA9IFtdO1xuICAgIHB1YmxpYyBQcm9maWxlQXJyYXk6IEFjY29udFByb2ZpbGVNb2RlbC5BY2NvdW50UHJvZmlsZVRlbXBsYXRlID0gbmV3IEFjY29udFByb2ZpbGVNb2RlbC5BY2NvdW50UHJvZmlsZVRlbXBsYXRlKCk7XG4gICAgcHVibGljIFByb2ZpbGVEZXRhaWxzOiBhbnk7XG4gICAgcHVibGljIHVzZXJkZXRhaWxzOiBhbnk7XG4gICAgcHVibGljIFNlYXJjaEZpZWxkczogU2VhcmNoID0gbmV3IFNlYXJjaCgpO1xuICAgIHB1YmxpYyBEYXRlRm9ybWF0OiBhbnk7XG4gICAgcHVibGljIFByaW50ZXJEZXZpY2VMaXN0OiBQcmludGVyRGV2aWNlTW9kZWwuV29ya3N0YXRpb24gPSBuZXcgUHJpbnRlckRldmljZU1vZGVsLldvcmtzdGF0aW9uKCk7XG4gICAgcHVibGljIEJvYXJkaW5nUGFzc0RldmljZU5hbWU6IGFueSA9IFwiXCI7XG4gICAgcHVibGljIEJhZ3RhZ0RldmljZU5hbWU6IGFueSA9IFwiXCI7XG4gICAgcHVibGljIERhdGU6IGFueTtcbiAgICBwdWJsaWMgd29ya1N0YXRpb25MaXN0OiBhbnk7XG4gICAgcHVibGljIFNlbGVjdGVkRGV2aWNlU2V0dGluZzogUHJpbnRlckRldmljZS5EZXZpY2UgPSBuZXcgUHJpbnRlckRldmljZS5EZXZpY2UoKTtcbiAgICBsb2FkZXJQcm9ncmVzczogTG9hZGVyUHJvZ3Jlc3M7XG4gICAgaXNFcnJvcjogYm9vbGVhbjtcbiAgICBlcnJvck1lc3NhZ2U6IHN0cmluZztcbiAgICBwdWJsaWMgV29ya3N0YXRpb25OYW1lOiBhbnk7XG4gICAgcHVibGljIE9mZmljZU5hbWU6IGFueTtcbiAgICBwdWJsaWMgQmxpbmtJRExpY2Vuc2VLZXk6IHN0cmluZztcbiAgICBwdWJsaWMgVVJMOiBzdHJpbmcgPSBcImh0dHA6Ly91c3Rsc3NvYW0zMTYuYWlyc2VydmljZXMuc3Zjcy5lbnRzdmNzLm5ldDo4OTgwL1wiO1xuICAgIHB1YmxpYyBsYWJsZVZpc2libGU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHB1YmxpYyBjaGFuZ2VMaWNlbnNlS2V5OiBib29sZWFuID0gdHJ1ZTtcbiAgICBwdWJsaWMgYmx0UHJpbnRlcjogYW55O1xuICAgIHB1YmxpYyBCb2FyZGluZ1Bhc3NQcmludGVyTGlzdDogQXJyYXk8UHJpbnRlckRldmljZU1vZGVsLkRldmljZT4gPSBbXTtcbiAgICBwdWJsaWMgQmFndGFnUHJpbnRlckxpc3Q6IEFycmF5PFByaW50ZXJEZXZpY2VNb2RlbC5EZXZpY2U+ID0gW107XG4gICAgcHVibGljIHNvbWVQcm9wZXJ0eTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBpc0hvc3RCb2FyZGluZ1Bhc3M6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgaXNCbHVldG9vdGhCb2FyZGluZ1Bhc3M6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHB1YmxpYyBpc0JsdWV0b290aEJhZ3RhZzogYm9vbGVhbiA9IHRydWU7XG4gICAgcHVibGljIGlzRGVmYXVsdDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBEZWxpdmVyRGV0YWlsczogQm9hcmRpbmdQYXNzLkJvYXJkaW5nUGFzc0RlbGl2ZXJ5RGV0YWlsID0gbmV3IEJvYXJkaW5nUGFzcy5Cb2FyZGluZ1Bhc3NEZWxpdmVyeURldGFpbCgpO1xuXG4gICAgcHVibGljIGlzSG9zdEJvYXJkaW5nOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzSG9zdEJhZ3RhZzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBob3N0Qm9hcmRpbmdPZmZpY2U6IHN0cmluZztcbiAgICBwdWJsaWMgaG9zdEJvYXJkaW5nV1M6IHN0cmluZztcbiAgICBwdWJsaWMgaG9zdEJvYXJkaW5nUHJpbnRlcjogc3RyaW5nO1xuICAgIHB1YmxpYyBibHVldG9vdGhCb2FyZGluZ1ByaW50ZXI6IHN0cmluZztcbiAgICBwdWJsaWMgaG9zdEJhZ3RhZ09mZmljZTogc3RyaW5nO1xuICAgIHB1YmxpYyBob3N0QmFndGFnV1M6IHN0cmluZztcbiAgICBwdWJsaWMgaG9zdEJhZ3RhZ1ByaW50ZXI6IHN0cmluZztcbiAgICBwdWJsaWMgYmx1ZXRvb3RoQmFndGFnUHJpbnRlcjogc3RyaW5nO1xuICAgIHB1YmxpYyBpc0NvbXBlbnNhdGlvbkVuYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgaXNDaGVja2luRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgaXNHYXRlRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RhdGFTZXJ2aWNlOiBEYXRhU2VydmljZSwgcHVibGljIF9zZXJ2aWNlOiBQYXNzZW5nZXJTZXJ2aWNlLCBwdWJsaWMgX3RpbWVvdXRTZXJ2aWNlOiBUaW1lT3V0U2VydmljZSwgcHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uLCBwdWJsaWMgX3NoYXJlZDogQ2hlY2tpbk9yZGVyU2VydmljZSwgcHJpdmF0ZSB2Y1JlZjogVmlld0NvbnRhaW5lclJlZiwgcHJpdmF0ZSBfbW9kYWxTZXJ2aWNlOiBNb2RhbERpYWxvZ1NlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5pc0Vycm9yID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gXCJcIjtcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcyA9IG5ldyBMb2FkZXJQcm9ncmVzcygpO1xuICAgICAgICB0aGlzLlVSTCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKCdhcGl1cmwnLCAnJyk7XG4gICAgICAgIHRoaXMuRGF0ZUZvcm1hdCA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiZGF0ZUZvcm1hdFwiLCBcIlwiKTtcbiAgICAgICAgdmFyIHNEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgdGhpcy5EYXRlID0gbW9tZW50KHNEYXRlKS5mb3JtYXQodGhpcy5EYXRlRm9ybWF0KTtcbiAgICAgICAgdGhpcy5Cb2FyZGluZ1Bhc3NEZXZpY2VOYW1lID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJib2FyZGluZ1Bhc3NEZXZpY2VOYW1lXCIsICcnKTtcbiAgICAgICAgdGhpcy5CYWd0YWdEZXZpY2VOYW1lID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJiYWd0YWdEZXZpY2VOYW1lXCIsIFwiXCIpXG5cbiAgICAgICAgaWYgKEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwibGljZW5zZUtleVwiLCAnJykpIHtcbiAgICAgICAgICAgIHRoaXMuQmxpbmtJRExpY2Vuc2VLZXkgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcImxpY2Vuc2VLZXlcIiwgJycpO1xuICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldExpY2Vuc2VLZXkodGhpcy5CbGlua0lETGljZW5zZUtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLkJsaW5rSURMaWNlbnNlS2V5ID0gdGhpcy5fc2hhcmVkLkdldExpY2Vuc2VLZXkoKTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5wYWdlLnN0eWxlLmJhY2tncm91bmRTaXplID0gXCJjb3ZlciBcIjtcbiAgICAgICAgdGhpcy5Qcm9maWxlQXJyYXkgPSB0aGlzLl9zaGFyZWQuR2V0VXNlclByb2ZpbGUoKTtcbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5pbml0TG9hZGVyKHRoaXMucGFnZUNvbnQpO1xuICAgICAgICB0aGlzLlNlYXJjaEZpZWxkcy5Mb2NhdGlvbiA9IHRoaXMuUHJvZmlsZUFycmF5LlBvaW50T2ZTYWxlc1swXS5BaXJwb3J0Q29kZTtcbiAgICAgICAgdGhpcy5TZWxlY3RlZERldmljZVNldHRpbmcgPSB0aGlzLl9zaGFyZWQuR2V0RGV2aWNlUHJpbnRlckRlYXRpbHMoKTtcbiAgICAgICAgaWYgKHRoaXMuU2VsZWN0ZWREZXZpY2VTZXR0aW5nICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuQm9hcmRpbmdQYXNzRGV2aWNlTmFtZSA9IHRoaXMuU2VsZWN0ZWREZXZpY2VTZXR0aW5nLkRldmljZU5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5Xb3Jrc3RhdGlvbk5hbWUgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcImhvc3RQcmludGVyXCIsIFwiXCIpO1xuICAgICAgICB0aGlzLmlzQ2hlY2tpbkRpc2FibGVkID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRCb29sZWFuKFwiY2hlY2tpbkRpc2FibGVkXCIsICk7XG4gICAgICAgIHRoaXMuaXNHYXRlRGlzYWJsZWQgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJnYXRlRGlzYWJsZWRcIiwgKTtcbiAgICAgICAgdGhpcy5pc0NvbXBlbnNhdGlvbkVuYWJsZWQgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJjb21wZW5zYXRpb25FbmFibGVkXCIsICk7XG4gICAgICAgIC8vIHRoaXMuV29ya3N0YXRpb25OYW1lID0gXCJIRFFJVFBSRVM2OVwiO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIldvcmtzdGF0aW9uTmFtZTpcIiArIHRoaXMuV29ya3N0YXRpb25OYW1lKTtcbiAgICAgICAgLy8gaWYgKHRoaXMuV29ya3N0YXRpb25OYW1lID09IFwiXCIgfHwgdGhpcy5Xb3Jrc3RhdGlvbk5hbWUgPT0gbnVsbCkge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJJbnNpZGUgbmV3IENvbmRpdGlvblwiKTtcbiAgICAgICAgLy8gICAgIHRoaXMuV29ya3N0YXRpb25OYW1lID0gXCJIRFFJVFBSRVM2OVwiO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIHRoaXMuYmx0UHJpbnRlciA9IFwiWEZHSkRNRkRLXCI7XG4gICAgICAgIC8vIHRoaXMuZ2V0UHJpbnRlckRldGFpbHModGhpcy5Xb3Jrc3RhdGlvbk5hbWUpO1xuICAgICAgICB0aGlzLnVzZXJkZXRhaWxzID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJ1c2VyZGV0YWlsc1wiLCBcIlwiKTtcbiAgICAgICAgdGhpcy5EYXRlID0gdGhpcy51c2VyZGV0YWlscy5zcGxpdCgnIHwgJylbMV07XG4gICAgICAgIHRoaXMuYmx0UHJpbnRlciA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwicHJpbnRlclwiLCBcIlwiKTtcbiAgICAgICAgLy8gdGhpcy5nZXRQcmludGVyRGV0YWlscygpO1xuICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLnBhZ2VDb250Lm5hdGl2ZUVsZW1lbnRcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBsYWJlbC5vbihcImxvYWRlZCwgdGFwLCBsb25nUHJlc3MsIHN3aXBlLCBuZ01vZGVsQ2hhbmdlXCIsIGZ1bmN0aW9uIChhcmdzOiBnZXN0dXJlcy5HZXN0dXJlRXZlbnREYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkV2ZW50OiBcIiArIGFyZ3MuZXZlbnROYW1lKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuX3RpbWVvdXRTZXJ2aWNlLnRpbWVyKTtcbiAgICAgICAgICAgIHNlbGYuX3RpbWVvdXRTZXJ2aWNlLnJlc2V0V2F0Y2goKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgLy8gdGhpcy5PZmZpY2VOYW1lID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJPZmZpY2VOYW1lXCIpO1xuXG5cbiAgICAgICAgdGhpcy5pc0hvc3RCb2FyZGluZyA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0Qm9vbGVhbihcImlzSG9zdEJvYXJkaW5nXCIsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5pc0hvc3RCYWd0YWcgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldEJvb2xlYW4oXCJpc0hvc3RCYWd0YWdcIiwgZmFsc2UpO1xuICAgICAgICB0aGlzLmhvc3RCb2FyZGluZ09mZmljZSA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiaG9zdEJvYXJkaW5nT2ZmaWNlXCIsIFwiXCIpO1xuICAgICAgICB0aGlzLmhvc3RCb2FyZGluZ1dTID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJob3N0Qm9hcmRpbmdXU1wiLCBcIlwiKTtcbiAgICAgICAgdGhpcy5ob3N0Qm9hcmRpbmdQcmludGVyID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJob3N0Qm9hcmRpbmdQcmludGVyXCIsIFwiXCIpO1xuICAgICAgICB0aGlzLmJsdWV0b290aEJvYXJkaW5nUHJpbnRlciA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiYmx1ZXRvb3RoQmFndGFnUHJpbnRlclwiLCBcIlwiKTtcbiAgICAgICAgdGhpcy5ob3N0QmFndGFnT2ZmaWNlID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJob3N0QmFndGFnT2ZmaWNlXCIsIFwiXCIpO1xuICAgICAgICB0aGlzLmhvc3RCYWd0YWdXUyA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwiaG9zdEJhZ3RhZ1dTXCIsIFwiXCIpO1xuICAgICAgICB0aGlzLmhvc3RCYWd0YWdQcmludGVyID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJob3N0QmFndGFnUHJpbnRlclwiLCBcIlwiKTtcbiAgICAgICAgdGhpcy5ibHVldG9vdGhCYWd0YWdQcmludGVyID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJibHVldG9vdGhCYWd0YWdQcmludGVyXCIsIFwiXCIpO1xuXG5cbiAgICAgICAgLy8gaWYoIWlzSG9zdEJvYXJkaW5nKVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldEJvb2xlYW4oXCJpc0JsdWV0b290aEJvYXJkaW5nXCIsdHJ1ZSk7XG4gICAgICAgIC8vICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldEJvb2xlYW4oXCJpc0hvc3RCb2FyZGluZ1wiLGZhbHNlKTtcbiAgICAgICAgLy8gICAgIHRoaXMuaXNCbHVldG9vdGhCb2FyZGluZ1Bhc3MgPSB0cnVlO1xuICAgICAgICAvLyAgICAgdGhpcy5pc0hvc3RCb2FyZGluZ1Bhc3MgPSBmYWxzZTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBlbHNlXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0Qm9vbGVhbihcImlzQmx1ZXRvb3RoQm9hcmRpbmdcIixmYWxzZSk7XG4gICAgICAgIC8vICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldEJvb2xlYW4oXCJpc0hvc3RCb2FyZGluZ1wiLHRydWUpO1xuICAgICAgICAvLyAgICAgdGhpcy5pc0JsdWV0b290aEJvYXJkaW5nUGFzcyA9IGZhbHNlO1xuICAgICAgICAvLyAgICAgdGhpcy5pc0hvc3RCb2FyZGluZ1Bhc3MgPSB0cnVlO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGlmKCFpc0hvc3RCYWd0YWcpe1xuICAgICAgICAvLyAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiaXNCbHVldG9vdGhCYWd0YWdcIix0cnVlKTtcbiAgICAgICAgLy8gICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0Qm9vbGVhbihcImlzSG9zdEJhZ3RhZ1wiLGZhbHNlKTtcbiAgICAgICAgLy8gICAgIHRoaXMuaXNCbHVldG9vdGhCYWd0YWcgPSB0cnVlO1xuICAgICAgICAvLyAgICAgdGhpcy5pc0hvc3RCYWd0YWcgPSBmYWxzZTsgXG4gICAgICAgIC8vIH1lbHNle1xuICAgICAgICAvLyAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiaXNCbHVldG9vdGhCYWd0YWdcIixmYWxzZSk7XG4gICAgICAgIC8vICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldEJvb2xlYW4oXCJpc0hvc3RCYWd0YWdcIix0cnVlKTtcbiAgICAgICAgLy8gICAgIHRoaXMuaXNCbHVldG9vdGhCYWd0YWcgPSBmYWxzZTtcbiAgICAgICAgLy8gICAgIHRoaXMuaXNIb3N0QmFndGFnID0gdHJ1ZTtcbiAgICAgICAgLy8gfVxuXG5cbiAgICB9XG5cbiAgICBGaXJzdExheW91dCgpIHtcbiAgICAgICAgdGhpcy5TZWxlY3RQcmludGVyID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5GaXJzdEJsb2NrID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5TZWNvbmRCbG9jayA9IGZhbHNlO1xuICAgICAgICB0aGlzLlRoaXJkQmxvY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5Gb3VydGhCbG9jayA9IGZhbHNlO1xuICAgICAgICB0aGlzLkZpZnRoQmxvY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5TZWxlY3RQcmludGVyMSA9IGZhbHNlO1xuICAgIH1cbiAgICBTZWNvbmRMYXlvdXQoKSB7XG4gICAgICAgIHRoaXMuU2VsZWN0UHJpbnRlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLkZpcnN0QmxvY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5TZWNvbmRCbG9jayA9IHRydWU7XG4gICAgICAgIHRoaXMuVGhpcmRCbG9jayA9IGZhbHNlO1xuICAgICAgICB0aGlzLkZvdXJ0aEJsb2NrID0gZmFsc2U7XG4gICAgICAgIHRoaXMuRmlmdGhCbG9jayA9IGZhbHNlO1xuICAgICAgICB0aGlzLlNlbGVjdFByaW50ZXIxID0gZmFsc2U7XG4gICAgfVxuICAgIFRoaXJkTGF5b3V0KCkge1xuICAgICAgICB0aGlzLlNlbGVjdFByaW50ZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5GaXJzdEJsb2NrID0gZmFsc2U7XG4gICAgICAgIHRoaXMuU2Vjb25kQmxvY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5UaGlyZEJsb2NrID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5Gb3VydGhCbG9jayA9IGZhbHNlO1xuICAgICAgICB0aGlzLkZpZnRoQmxvY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5TZWxlY3RQcmludGVyMSA9IGZhbHNlO1xuICAgIH1cbiAgICBGb3VydGhMYXlvdXQoKSB7XG4gICAgICAgIHRoaXMuU2VsZWN0UHJpbnRlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLkZpcnN0QmxvY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5TZWNvbmRCbG9jayA9IGZhbHNlO1xuICAgICAgICB0aGlzLlRoaXJkQmxvY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5Gb3VydGhCbG9jayA9IHRydWU7XG4gICAgICAgIHRoaXMuRmlmdGhCbG9jayA9IGZhbHNlO1xuICAgICAgICB0aGlzLlNlbGVjdFByaW50ZXIxID0gZmFsc2U7XG4gICAgfVxuICAgIEZpZnRoTGF5b3V0KCkge1xuICAgICAgICB0aGlzLlNlbGVjdFByaW50ZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5GaXJzdEJsb2NrID0gZmFsc2U7XG4gICAgICAgIHRoaXMuU2Vjb25kQmxvY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5UaGlyZEJsb2NrID0gZmFsc2U7XG4gICAgICAgIHRoaXMuRm91cnRoQmxvY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5GaWZ0aEJsb2NrID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5TZWxlY3RQcmludGVyMSA9IGZhbHNlO1xuICAgIH1cbiAgICBuYXZpZ2F0ZVRvU2VhcmNoKCkge1xuICAgICAgICBpZiAodGhpcy5pc0NoZWNraW5EaXNhYmxlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICB2YXIgcHJvZmlsZTogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodGhpcy5Qcm9maWxlQXJyYXkpXG4gICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wic2VhcmNoXCJdLCB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRCbHVldG9vdGhQcmludGVyRGV0YWlscygpIHtcbiAgICAgICAgbGV0IGRpc2NvdmVyeSA9IG5ldyB6ZWJyYS5EaXNjb3ZlcnkoKTtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBkaXNjb3Zlcnkuc2VhcmNoQmx1ZXRvb3RoKCkudGhlbihmdW5jdGlvbiAocHJpbnRlcnMpIHtcbiAgICAgICAgICAgIHZhciBjb3VudCA9IHByaW50ZXJzLmxlbmd0aDtcblxuICAgICAgICAgICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtZXNzYWdlXCIsIFwiVW5hYmxlIHRvIGZpbmRcIik7XG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJObyBEZXZpY2UgZm91bmRcIikuc2hvdygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb3VudCA+PSAxKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgZm91bmQgYSB2YWxpZCBwcmludGVyXG4gICAgICAgICAgICAgICAgdmFyIGFjdGlvbnM6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihwcmludGVycyk7XG4gICAgICAgICAgICAgICAgcHJpbnRlcnMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9ucy5wdXNoKGVsZW1lbnQuYWRkcmVzcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkJsdWV0b290aCBQcmludGVyXCIsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiU2VsZWN0IFByaW50ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uczogYWN0aW9uc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKCdwcmludGVyJywgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5ibHRQcmludGVyID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH0sIChlcnIpID0+IHtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBTZWFyY2hPZmZpY2Uob2ZmaWNlTmFtZTogc3RyaW5nLCBpc0JhZ3RhZzogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICB2YXIgb2ZmaWNlTmFtZSA9IG9mZmljZU5hbWUudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICB0aGlzLmdldFdvcmtzdGF0aW9uTGlzdChvZmZpY2VOYW1lLCBpc0JhZ3RhZyk7XG4gICAgfVxuXG4gICAgU2VhcmNoUHJpbnRlcihXb3Jrc3RhdGlvbk5hbWU6IHN0cmluZywgaXNCYWd0YWc6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgLy8gdmFyIE9sZFdvcmtTdGF0aW9uID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJob3N0UHJpbnRlclwiLCBcIlwiKTtcbiAgICAgICAgLy8gaWYgKFdvcmtzdGF0aW9uTmFtZSAhPSBPbGRXb3JrU3RhdGlvbikge1xuICAgICAgICBpZiAoaXNCYWd0YWcpIHtcbiAgICAgICAgICAgIHRoaXMuaG9zdEJhZ3RhZ1dTID0gV29ya3N0YXRpb25OYW1lXG4gICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcImhvc3RCYWd0YWdXU1wiLCBXb3Jrc3RhdGlvbk5hbWUpO1xuICAgICAgICAgICAgLy8gdGhpcy5nZXRQcmludGVyRGV0YWlscyhXb3Jrc3RhdGlvbk5hbWUudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhvc3RCb2FyZGluZ1dTID0gV29ya3N0YXRpb25OYW1lXG4gICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcImhvc3RCb2FyZGluZ1dTXCIsIFdvcmtzdGF0aW9uTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XG4gICAgICAgIFdvcmtzdGF0aW9uTmFtZSA9IFdvcmtzdGF0aW9uTmFtZS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl9kYXRhU2VydmljZS5TZWFyY2hQcmludGVyRGV2aWNlQnlXb3JrU3RhdGlvbihXb3Jrc3RhdGlvbk5hbWUpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS53b3Jrc3RhdGlvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlByaW50ZXJEZXZpY2VMaXN0ID0gZGF0YS53b3Jrc3RhdGlvbi5maWx0ZXIobSA9PiBtLndvcmtzdGF0aW9uTmFtZSA9PSBXb3Jrc3RhdGlvbk5hbWUpWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQmFndGFnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5CYWd0YWdQcmludGVyTGlzdCA9IHRoaXMuUHJpbnRlckRldmljZUxpc3QuZGV2aWNlLmZpbHRlcihtID0+IG0uRGVzY3JpcHRpb24gPT0gXCJCYWdUYWcgUHJpbnRlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbmdlUHJpbnRlcjIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Cb2FyZGluZ1Bhc3NQcmludGVyTGlzdCA9IHRoaXMuUHJpbnRlckRldmljZUxpc3QuZGV2aWNlLmZpbHRlcihtID0+IG0uRGVzY3JpcHRpb24gPT0gXCJCb2FyZGluZ1Bhc3MgUHJpbnRlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbmdlUHJpbnRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5kaXIodGhpcy5QcmludGVyRGV2aWNlTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk5vIFByaW50ZXIgRm91bmRcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5QcmludGVyRGV2aWNlTGlzdCA9IG5ldyBQcmludGVyRGV2aWNlTW9kZWwuV29ya3N0YXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0JhZ3RhZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQmFndGFnUHJpbnRlckxpc3QgPSBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQmFndGFnRGV2aWNlTmFtZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJiYWd0YWdEZXZpY2VOYW1lXCIsIHRoaXMuQmFndGFnRGV2aWNlTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQm9hcmRpbmdQYXNzUHJpbnRlckxpc3QgPSBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQm9hcmRpbmdQYXNzRGV2aWNlTmFtZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJib2FyZGluZ1Bhc3NEZXZpY2VOYW1lXCIsIHRoaXMuQm9hcmRpbmdQYXNzRGV2aWNlTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZG50IGZpbmQgaW5mb3JtYXRpb24gZm9yIHRoaXMgUHJvZmlsZSBcIiArIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIHRoaXMuV29ya3N0YXRpb25OYW1lID0gV29ya3N0YXRpb25OYW1lO1xuICAgICAgICAvLyBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcImhvc3RQcmludGVyXCIsIFdvcmtzdGF0aW9uTmFtZSk7XG4gICAgICAgIC8vIHZhciBXb3JrU3RhdGlvbiA9IFdvcmtzdGF0aW9uTmFtZS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIC8vIHRoaXMuaXNEZWZhdWx0ID0gdHJ1ZTtcbiAgICAgICAgLy8gdGhpcy5nZXRQcmludGVyRGV0YWlscyhXb3JrU3RhdGlvbik7XG4gICAgICAgIC8vIHRoaXMuQm9hcmRpbmdQYXNzRGV2aWNlTmFtZSA9IFwiXCI7XG4gICAgICAgIC8vIHRoaXMuQmFndGFnRGV2aWNlTmFtZSA9IFwiXCI7XG4gICAgICAgIC8vIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwiYm9hcmRpbmdQYXNzRGV2aWNlTmFtZVwiLCB0aGlzLkJvYXJkaW5nUGFzc0RldmljZU5hbWUpO1xuICAgICAgICAvLyBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcInBlY3RhYlZlcnNpb25cIiwgXCJcIik7XG4gICAgICAgIC8vIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwiYmFndGFnRGV2aWNlTmFtZVwiLCB0aGlzLkJvYXJkaW5nUGFzc0RldmljZU5hbWUpO1xuICAgICAgICAvLyBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcInBlY3RhYlZlcnNpb25cIiwgXCJcIik7XG4gICAgICAgIC8vIHRoaXMubGFibGVWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgLy8gfVxuICAgIH1cblxuICAgIGdldFByaW50ZXJEZXRhaWxzKFdvcmtzdGF0aW9uTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc0RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5zaG93TG9hZGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2RhdGFTZXJ2aWNlLlNlYXJjaFByaW50ZXJEZXZpY2VCeVdvcmtTdGF0aW9uKFdvcmtzdGF0aW9uTmFtZSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLndvcmtzdGF0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUHJpbnRlckRldmljZUxpc3QgPSBkYXRhLndvcmtzdGF0aW9uLmZpbHRlcihtID0+IG0ud29ya3N0YXRpb25OYW1lID09IFdvcmtzdGF0aW9uTmFtZSlbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkJvYXJkaW5nUGFzc1ByaW50ZXJMaXN0ID0gdGhpcy5QcmludGVyRGV2aWNlTGlzdC5kZXZpY2UuZmlsdGVyKG0gPT4gbS5EZXNjcmlwdGlvbiA9PSBcIkJvYXJkaW5nUGFzcyBQcmludGVyXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5CYWd0YWdQcmludGVyTGlzdCA9IHRoaXMuUHJpbnRlckRldmljZUxpc3QuZGV2aWNlLmZpbHRlcihtID0+IG0uRGVzY3JpcHRpb24gPT0gXCJCYWdUYWcgUHJpbnRlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRGVmYXVsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0Qm9vbGVhbihcImlzSG9zdFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldEJvb2xlYW4oXCJpc0JsdWV0b290aFwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRpcih0aGlzLlByaW50ZXJEZXZpY2VMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiTm8gUHJpbnRlciBGb3VuZFwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb3VsZG50IGZpbmQgaW5mb3JtYXRpb24gZm9yIHRoaXMgUHJvZmlsZSBcIiArIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuICAgICAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgfSlcblxuXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3MuaGlkZUxvYWRlcigpO1xuXG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB2YXIgZURhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldEFjY291bnRQcm9maWxlIFNlcnZpY2UgLS0tLS0tLS0tLS0tLS0tIEVuZCBEYXRlIFRpbWUgOiAnICsgZURhdGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dldEFjY291bnRQcm9maWxlIFNlcnZpY2UgRXhlY3V0aW9uIFRpbWUgOiAnICsgQXBwRXhlY3V0aW9udGltZS5FeGVjdXRpb25UaW1lKG5ldyBEYXRlKHNEYXRlKSwgbmV3IERhdGUoZURhdGUpKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b2dnbGVCYWd0YWdEZWZhdWx0KCkge1xuICAgICAgICB0aGlzLmlzSG9zdEJhZ3RhZyA9ICF0aGlzLmlzSG9zdEJhZ3RhZztcbiAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiaXNIb3N0QmFndGFnXCIsIHRoaXMuaXNIb3N0QmFndGFnKTtcbiAgICAgICAgaWYgKHRoaXMuaXNIb3N0QmFndGFnKSB7XG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkRlZmF1bHQgQmFndGFnIFByaW50ZXIgQ2hhbmdlZDogSG9zdCBQcmludGVyXCIpLnNob3coKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmhvc3RCYWd0YWdXUy50cmltKCkgPT09ICcnIHx8IHRoaXMuaG9zdEJhZ3RhZ09mZmljZS50cmltKCkgPT09ICcnIHx8IHRoaXMuaG9zdEJhZ3RhZ1ByaW50ZXIudHJpbSgpID09PSAnJykge1xuICAgICAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiUGxlYXNlIHNldCB0aGUgT2ZmaWNlLCBXb3Jrc3RhdGlvbiBhbmQgUHJpbnRlclwiKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkRlZmF1bHQgQmFndGFnIFByaW50ZXIgQ2hhbmdlZDogQmx1ZXRvb3RoIFByaW50ZXJcIikuc2hvdygpO1xuICAgICAgICAgICAgaWYgKHRoaXMuYmx1ZXRvb3RoQmFndGFnUHJpbnRlci50cmltKCkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJQbGVhc2Ugc2V0IHRoZSBCbHVldG9vdGggUHJpbnRlclwiKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b2dnbGVCb2FyZGluZ0RlZmF1bHQoKSB7XG4gICAgICAgIHRoaXMuaXNIb3N0Qm9hcmRpbmcgPSAhdGhpcy5pc0hvc3RCb2FyZGluZztcbiAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRCb29sZWFuKFwiaXNIb3N0Qm9hcmRpbmdcIiwgdGhpcy5pc0hvc3RCb2FyZGluZyk7XG4gICAgICAgIGlmICh0aGlzLmlzSG9zdEJvYXJkaW5nKSB7XG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIkRlZmF1bHQgQm9hcmRpbmcgUHJpbnRlciBDaGFuZ2VkOiBIb3N0IFByaW50ZXJcIikuc2hvdygpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaG9zdEJvYXJkaW5nV1MudHJpbSgpID09PSAnJyB8fCB0aGlzLmhvc3RCb2FyZGluZ09mZmljZS50cmltKCkgPT09ICcnIHx8IHRoaXMuaG9zdEJvYXJkaW5nUHJpbnRlci50cmltKCkgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJQbGVhc2Ugc2V0IHRoZSBPZmZpY2UsIFdvcmtzdGF0aW9uIGFuZCBQcmludGVyXCIpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KFwiRGVmYXVsdCBCb3JhZGluZyBQcmludGVyIENoYW5nZWQ6IEJsdWV0b290aCBQcmludGVyXCIpLnNob3coKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmJsdWV0b290aEJvYXJkaW5nUHJpbnRlci50cmltKCkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJQbGVhc2Ugc2V0IHRoZSBCbHVldG9vdGggUHJpbnRlclwiKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG4gICAgZ2V0V29ya3N0YXRpb25MaXN0KG9mZmljZU5hbWU6IHN0cmluZywgaXNCYWdUYWc6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyUHJvZ3Jlc3Muc2hvd0xvYWRlcigpO1xuICAgICAgICAgICAgaWYgKGlzQmFnVGFnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ob3N0QmFndGFnT2ZmaWNlID0gb2ZmaWNlTmFtZVxuICAgICAgICAgICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwiaG9zdEJhZ3RhZ09mZmljZVwiLCBvZmZpY2VOYW1lKTtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLmdldFByaW50ZXJEZXRhaWxzKFdvcmtzdGF0aW9uTmFtZS50b1N0cmluZygpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ob3N0Qm9hcmRpbmdPZmZpY2UgPSBvZmZpY2VOYW1lXG4gICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJob3N0Qm9hcmRpbmdPZmZpY2VcIiwgb2ZmaWNlTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgb2ZmaWNlOiBhbnkgPSB7IFwiT2ZmaWNlXCI6IFt7IFwiT2ZmaWNlTmFtZVwiOiBvZmZpY2VOYW1lIH1dIH07XG4gICAgICAgICAgICB0aGlzLl9kYXRhU2VydmljZS5TZWFyY2hPZmZpY2VOYW1lQnlXb3JrU3RhdGlvbihvZmZpY2VOYW1lKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkYXRhXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGRhdGEuT2ZmaWNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEud29ya3N0YXRpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgd29ya1N0YXRpb25MaXN0OiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JrU3RhdGlvbkxpc3QubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEud29ya3N0YXRpb24uZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtTdGF0aW9uTGlzdC5wdXNoKGl0ZW0ud29ya3N0YXRpb25OYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmtTdGF0aW9uTGlzdCA9IHdvcmtTdGF0aW9uTGlzdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuX3NoYXJlZC5TZXRXb3JrU3RhdGlvbihkYXRhLk9mZmljZVswXS5Xb3Jrc3RhdGlvbik7IFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJPZmZpY2VOYW1lXCIsIHRoaXMuT2ZmaWNlTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoV29ya1N0YXRpb24oaXNCYWdUYWcpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk5vIFdvcmsgU3RhdGlvbiBGb3VuZFwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgVG9hc3QubWFrZVRleHQoXCJObyBXb3JrIFN0YXRpb24gRm91bmRcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvdWxkbnQgZmluZCBpbmZvcm1hdGlvbiBmb3IgdGhpcyBQcm9maWxlIFwiICsgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTZXJ2aWNlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG4gICAgICAgICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgICAgICAgICB9KVxuXG5cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJQcm9ncmVzcy5oaWRlTG9hZGVyKCk7XG5cbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHZhciBlRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZ2V0T2ZmaWNlTmFtZUxpc3QgU2VydmljZSAtLS0tLS0tLS0tLS0tLS0gRW5kIERhdGUgVGltZSA6ICcgKyBlRGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2VhcmNoV29ya1N0YXRpb24oaXNCYWdUYWcpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0aXRsZTogXCJDaGFuZ2UgU2FsZXMgT2ZmaWNlXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIlNlbGVjdCBTYWxlcyBPZmZpY2VcIixcbiAgICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgICBhY3Rpb25zOiB0aGlzLndvcmtTdGF0aW9uTGlzdFxuICAgICAgICB9O1xuICAgICAgICBkaWFsb2dzLmFjdGlvbihvcHRpb25zKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT0gXCJDYW5jZWxcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuU2VhcmNoUHJpbnRlcihyZXN1bHQsIGlzQmFnVGFnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2dpblN1Ym1pdCgpIHtcbiAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoJ2FwaXVybCcsIHRoaXMuVVJMKTtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIlwiXSwge1xuICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA2MDAsXG4gICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubGFibGVWaXNpYmxlID0gdHJ1ZTtcbiAgICB9XG4gICAgY2hhbmdlKCkge1xuICAgICAgICB0aGlzLmxhYmxlVmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgICBjaGFuZ2VMaWNlbnNlKCkge1xuICAgICAgICB0aGlzLmNoYW5nZUxpY2Vuc2VLZXkgPSBmYWxzZTtcbiAgICB9XG4gICAgZGVsZXRlQ29va2llcygpIHtcbiAgICAgICAgY29uc3QgY29va2llczogYW55ID0gTlNIVFRQQ29va2llU3RvcmFnZS5zaGFyZWRIVFRQQ29va2llU3RvcmFnZS5jb29raWVzO1xuICAgICAgICBpZiAodHlwZW9mIGNvb2tpZXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb2tpZXMuY291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvb2tpZTogYW55ID0gY29va2llcy5vYmplY3RBdEluZGV4KGkpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvb2tpZSk7XG4gICAgICAgICAgICAgICAgTlNIVFRQQ29va2llU3RvcmFnZS5zaGFyZWRIVFRQQ29va2llU3RvcmFnZS5kZWxldGVDb29raWUoY29va2llKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIkNvb2tpZXMgRGVsZXRlZFwiKTtcbiAgICB9XG4gICAgb25DaGFuZ2VQcmludGVyKCkge1xuICAgICAgICBpZiAodGhpcy5Cb2FyZGluZ1Bhc3NQcmludGVyTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdFByaW50ZXIgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5GaXJzdEJsb2NrID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLlNlbGVjdFByaW50ZXIxID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuQm9hcmRpbmdQYXNzUHJpbnRlckxpc3QpO1xuICAgICAgICAgICAgdGhpcy5uZXdEZXZpY2VMaXN0ID0gdGhpcy5Cb2FyZGluZ1Bhc3NQcmludGVyTGlzdDtcbiAgICAgICAgICAgIHZhciBQZWN0YWJWYWx1ZSA9IEFwcGxpY2F0aW9uU2V0dGluZ3MuZ2V0U3RyaW5nKFwicGVjdGFiVmVyc2lvblwiLCBcIlwiKTtcbiAgICAgICAgICAgIHZhciBQcmV2aW91c1ByaW50ZXIgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcImJvYXJkaW5nUGFzc0RldmljZU5hbWVcIiwgXCJcIik7XG4gICAgICAgICAgICB0aGlzLm5ld0RldmljZUxpc3QuZmlsdGVyKG0gPT4gbS5EZXZpY2VOYW1lID09IFByZXZpb3VzUHJpbnRlciAmJiBtLlBlY3RhYiA9PSBQZWN0YWJWYWx1ZSlbMF0uSXNTZWxlY3RlZERldmljZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIk5vIERldmljZSBGb3VuZFwiKS5zaG93KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgb25DaGFuZ2VQcmludGVyMigpIHtcbiAgICAgICAgaWYgKHRoaXMuQmFndGFnUHJpbnRlckxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RQcmludGVyID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuRmlyc3RCbG9jayA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RQcmludGVyMiA9IHRydWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLkJvYXJkaW5nUGFzc1ByaW50ZXJMaXN0KTtcbiAgICAgICAgICAgIHRoaXMubmV3RGV2aWNlTGlzdCA9IHRoaXMuQmFndGFnUHJpbnRlckxpc3Q7XG4gICAgICAgICAgICB2YXIgUGVjdGFiVmFsdWUgPSBBcHBsaWNhdGlvblNldHRpbmdzLmdldFN0cmluZyhcImJhZ3RhZ3BlY3RhYlZlcnNpb25cIiwgXCJcIik7XG4gICAgICAgICAgICB2YXIgUHJldmlvdXNQcmludGVyID0gQXBwbGljYXRpb25TZXR0aW5ncy5nZXRTdHJpbmcoXCJiYWd0YWdEZXZpY2VOYW1lXCIsIFwiXCIpO1xuICAgICAgICAgICAgdGhpcy5uZXdEZXZpY2VMaXN0LmZpbHRlcihtID0+IG0uRGV2aWNlTmFtZSA9PSBQcmV2aW91c1ByaW50ZXIgJiYgbS5QZWN0YWIgPT0gUGVjdGFiVmFsdWUpWzBdLklzU2VsZWN0ZWREZXZpY2UgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJObyBEZXZpY2UgRm91bmRcIikuc2hvdygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9nZ2xlQ2hlY2tlZChkZXZpY2VsaXN0OiBQcmludGVyRGV2aWNlTW9kZWwuRGV2aWNlKSB7XG4gICAgICAgIHRoaXMubmV3RGV2aWNlTGlzdC5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgZWxlbWVudC5Jc1NlbGVjdGVkRGV2aWNlID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgRGV2aWNlID0gZGV2aWNlbGlzdDtcbiAgICAgICAgRGV2aWNlLklzU2VsZWN0ZWREZXZpY2UgPSB0cnVlO1xuICAgICAgICB0aGlzLkJvYXJkaW5nUGFzc0RldmljZU5hbWUgPSBEZXZpY2UuRGV2aWNlTmFtZTtcbiAgICAgICAgdGhpcy5Cb2FyZGluZ1Bhc3NEZXZpY2VOYW1lID0gdGhpcy5uZXdEZXZpY2VMaXN0LmZpbHRlcihtID0+IG0uSXNTZWxlY3RlZERldmljZSA9PSB0cnVlKVswXS5EZXZpY2VOYW1lO1xuICAgICAgICB2YXIgUGVjdGFiID0gRGV2aWNlLlBlY3RhYjtcbiAgICAgICAgdmFyIERldmljZVR5cGUgPSBEZXZpY2UuRGV2aWNlVHlwZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJEZXZpY2VUeXBlIDogXCIgKyBKU09OLnN0cmluZ2lmeShEZXZpY2UuRGV2aWNlVHlwZSkpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRldmljZVR5cGUgOiBcIiArIEpTT04uc3RyaW5naWZ5KERldmljZS5QZWN0YWIpKTtcbiAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJob3N0QmFndGFnT2ZmaWNlXCIsdGhpcy5ob3N0QmFndGFnT2ZmaWNlKTtcbiAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJib2FyZGluZ1Bhc3NEZXZpY2VOYW1lXCIsIHRoaXMuQm9hcmRpbmdQYXNzRGV2aWNlTmFtZSk7XG4gICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwiZGV2aWNlVHlwZVwiLCBEZXZpY2VUeXBlKTsgICAgICAgIFxuICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcInBlY3RhYlZlcnNpb25cIiwgUGVjdGFiKTtcbiAgICAgICAgdGhpcy5TZWxlY3RQcmludGVyMSA9IGZhbHNlO1xuICAgICAgICB0aGlzLkZpcnN0QmxvY2sgPSB0cnVlO1xuICAgIH1cblxuICAgIHRvZ2dsZWJhZ3RhZ0NoZWNrZWQoZGV2aWNlbGlzdDogUHJpbnRlckRldmljZU1vZGVsLkRldmljZSkge1xuICAgICAgICB0aGlzLm5ld0RldmljZUxpc3QuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGVsZW1lbnQuSXNTZWxlY3RlZERldmljZSA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIERldmljZSA9IGRldmljZWxpc3Q7XG4gICAgICAgIERldmljZS5Jc1NlbGVjdGVkRGV2aWNlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5CYWd0YWdEZXZpY2VOYW1lID0gRGV2aWNlLkRldmljZU5hbWU7XG4gICAgICAgIHRoaXMuQmFndGFnRGV2aWNlTmFtZSA9IERldmljZS5EZXZpY2VOYW1lO1xuICAgICAgICB2YXIgUGVjdGFiID0gRGV2aWNlLlBlY3RhYjtcbiAgICAgICAgdmFyIERldmljZVR5cGUgPSBEZXZpY2UuRGV2aWNlVHlwZTtcbiAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJob3N0Qm9hcmRpbmdPZmZpY2VcIix0aGlzLmhvc3RCb2FyZGluZ09mZmljZSk7XG4gICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwiYmFndGFnRGV2aWNlTmFtZVwiLCB0aGlzLkJhZ3RhZ0RldmljZU5hbWUpO1xuICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcIkJUZGV2aWNlVHlwZVwiLCBEZXZpY2VUeXBlKTsgICAgICAgIFxuICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcImJhZ3RhZ3BlY3RhYlZlcnNpb25cIiwgUGVjdGFiKTtcbiAgICAgICAgdGhpcy5TZWxlY3RQcmludGVyMiA9IGZhbHNlO1xuICAgICAgICB0aGlzLkZpcnN0QmxvY2sgPSB0cnVlO1xuICAgIH1cbiAgICBTYXZlUHJpbnRlcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5Cb2FyZGluZ1Bhc3NEZXZpY2VOYW1lID0gdGhpcy5uZXdEZXZpY2VMaXN0LmZpbHRlcihtID0+IG0uSXNTZWxlY3RlZERldmljZSA9PSB0cnVlKVswXS5EZXZpY2VOYW1lO1xuICAgICAgICB2YXIgUGVjdGFiID0gdGhpcy5uZXdEZXZpY2VMaXN0LmZpbHRlcihtID0+IG0uSXNTZWxlY3RlZERldmljZSA9PSB0cnVlKVswXS5QZWN0YWI7XG4gICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwiYm9hcmRpbmdQYXNzRGV2aWNlTmFtZVwiLCB0aGlzLkJvYXJkaW5nUGFzc0RldmljZU5hbWUpO1xuICAgICAgICBBcHBsaWNhdGlvblNldHRpbmdzLnNldFN0cmluZyhcInBlY3RhYlZlcnNpb25cIiwgUGVjdGFiKTtcbiAgICAgICAgdGhpcy5TZWxlY3RQcmludGVyMSA9IGZhbHNlO1xuICAgICAgICB0aGlzLkZpcnN0QmxvY2sgPSB0cnVlO1xuXG4gICAgfVxuICAgIFNhdmVCYWd0YWdQcmludGVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLkJhZ3RhZ0RldmljZU5hbWUgPSB0aGlzLm5ld0RldmljZUxpc3QuZmlsdGVyKG0gPT4gbS5Jc1NlbGVjdGVkRGV2aWNlID09IHRydWUpWzBdLkRldmljZU5hbWU7XG4gICAgICAgIHZhciBQZWN0YWIgPSB0aGlzLm5ld0RldmljZUxpc3QuZmlsdGVyKG0gPT4gbS5Jc1NlbGVjdGVkRGV2aWNlID09IHRydWUpWzBdLlBlY3RhYjtcbiAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJiYWd0YWdEZXZpY2VOYW1lXCIsIHRoaXMuQmFndGFnRGV2aWNlTmFtZSk7XG4gICAgICAgIEFwcGxpY2F0aW9uU2V0dGluZ3Muc2V0U3RyaW5nKFwiYmFndGFncGVjdGFiVmVyc2lvblwiLCBQZWN0YWIpO1xuICAgICAgICB0aGlzLlNlbGVjdFByaW50ZXIyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuRmlyc3RCbG9jayA9IHRydWU7XG5cbiAgICB9XG4gICAgY2hhbmdlRGF0ZSgpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0aXRsZTogXCJEYXRlIEZvcm1hdHNcIixcbiAgICAgICAgICAgIC8vIG1lc3NhZ2U6IFwiQ2hvb3NlICBjYXRhbG9nXCIsXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIkNhbmNlbFwiLFxuICAgICAgICAgICAgYWN0aW9uczogW1wiTU0tREQtWVlZWVwiLCBcIkRELU1NTS1ZWVlZXCIsIFwiREQtTU0tWVlZWVwiXVxuICAgICAgICB9O1xuICAgICAgICBkaWFsb2dzLmFjdGlvbihvcHRpb25zKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT0gXCJDYW5jZWxcIikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkLlNldERhdGVGb3JtYXQocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB0aGlzLkRhdGVGb3JtYXQgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgdGhpcy51c2VyZGV0YWlscyA9IHRoaXMuUHJvZmlsZUFycmF5LlBvaW50T2ZTYWxlc1swXS5BaXJwb3J0Q29kZSArIFwiIHwgXCIgKyBtb21lbnQoKS5mb3JtYXQocmVzdWx0KSArIFwiIHwgXCIgKyB0aGlzLlByb2ZpbGVBcnJheS5Vc2VybmFtZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZcIiArIHRoaXMudXNlcmRldGFpbHMpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVlwiICsgdGhpcy51c2VyZGV0YWlscy5zdWJzdHIoNCwgMTApKTtcbiAgICAgICAgICAgICAgICB0aGlzLkRhdGUgPSBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJkYXRlRm9ybWF0XCIsIHRoaXMuRGF0ZUZvcm1hdCk7XG4gICAgICAgICAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJ1c2VyZGV0YWlsc1wiLCB0aGlzLnVzZXJkZXRhaWxzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9XG4gICAgbGljZW5zZUtleSgpIHtcbiAgICAgICAgQXBwbGljYXRpb25TZXR0aW5ncy5zZXRTdHJpbmcoXCJsaWNlbnNlS2V5XCIsIHRoaXMuQmxpbmtJRExpY2Vuc2VLZXkpO1xuICAgICAgICB0aGlzLl9zaGFyZWQuU2V0TGljZW5zZUtleSh0aGlzLkJsaW5rSURMaWNlbnNlS2V5KTtcbiAgICAgICAgdGhpcy5jaGFuZ2VMaWNlbnNlS2V5ID0gdHJ1ZTtcblxuICAgIH1cbiAgICBuYXZpZ2F0ZVRvU2V0dGluZygpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcInNldHRpbmdcIl0sIHtcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBuYXZpZ2F0ZVRvRGVwYXJ0dXJlcygpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNHYXRlRGlzYWJsZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImRlcGFydGhvbWVcIl0sIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBuYXZpZ2F0ZVRvbG9naW4oKSB7XG4gICAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbXCJcIl0sIHtcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgIGN1cnZlOiBcImxpbmVhclwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBuYXZpZ2F0ZVRvQ29tcGVuc2F0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5pc0NvbXBlbnNhdGlvbkVuYWJsZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcImNvbXBlbnNhdGlvblwiXSwge1xuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzbGlkZVwiLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTogXCJsaW5lYXJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgVG9hc3QubWFrZVRleHQoXCJDb21wZW5zYXRpb24gTm90IGFwcGxpY2FibGVcIikuc2hvdygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlU2VydmljZUVycm9yKGVycm9yOiBhbnkpIHtcbiAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IGVycm9yLnRvU3RyaW5nKCk7XG4gICAgICAgIGlmIChlcnJvck1lc3NhZ2UuaW5kZXhPZihcIlNlc3Npb25UaW1lb3V0XCIpID4gLTEpIHtcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBcIlNlc3Npb24gVGltZSBPdXRcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIllvdXIgc2Vzc2lvbiBoYXMgYmVlbiB0aW1lIG91dFwiLFxuICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPS1wiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGlhbG9ncy5hbGVydChvcHRpb25zKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlckV4dGVuc2lvbnMubmF2aWdhdGUoW1wiXCJdLCB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNsaWRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogNjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3VydmU6IFwibGluZWFyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyB0aGlzLmxvYWRlclByb2dyZXNzLmhpZGVMb2FkZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFRvYXN0Lm1ha2VUZXh0KGVycm9yTWVzc2FnZSkuc2hvdygpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iXX0=