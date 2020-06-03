import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import * as moment from "moment";
import * as connectivity from "connectivity";
import textField = require("ui/text-field");
import * as gestures from "ui/gestures";
import * as zebra from 'nativescript-print-zebra';
import dialogs = require("ui/dialogs");

// import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';

//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as Toast from 'nativescript-toast';
// import * as IQKeyboardManager from 'nativescript-iqkeyboardmanager'

//app references
import { LoaderProgress,AccontProfileModel} from "../../shared/interface/index"
import { DataService, TimeOutService, CheckinOrderService,LoginService,HomePageService,CompensationService } from "../../shared/services/index";
import { AppExecutiontime } from "../../app.executiontime";
import { Configuration } from '../../app.constants';
import { Order, CityCodeCollection } from "../../shared/model/index";
import { Http, Headers, RequestOptions } from '@angular/http';
import { Converters } from "../../shared/utils/index";


declare var NSHTTPCookieStorage, NSHTTPCookie;
console.log(ApplicationSettings.getString('printer', ''));
var passwordTextField: textField.TextField
@Component({
    selector: "login-page",
    providers: [DataService, Configuration,LoginService,HomePageService,CompensationService],
    templateUrl: "./components/login/login.component.html",
    styleUrls: ["./components/login/login.component.css"]
})
export class LoginComponent implements OnInit {
    public iqKeyboard = IQKeyboardManager.sharedManager();
    // const iqKeyboard = IQKeyboardManager.sharedManager();
    isError: boolean;
    errorMessage: string;
    isButtonEnabled = false;
    UserName: string = "";
    PassWord: string = "";
    public index: any = null;
    loaderProgress: LoaderProgress;
    public profileDetails: any[] = [];
    idleState = 'Not started.';
    timedOut = false;
    Output: string = ""
    public ProfileArray: AccontProfileModel.AccountProfileTemplate = new AccontProfileModel.AccountProfileTemplate();
    public ProfileDetails: any;
    public userdetails: any;
    public getDateFormat: any;
    public cityList: Array<CityCodeCollection.CollectionEntity> = [];
    public filterCityList: Array<CityCodeCollection.CollectionEntity> = [];
    public filterCityCode: Array<string> = [];
    public AgentProfileList: Array<any> = [];
    public isCompensationDisabled: boolean = false;
    public isPrevDaySalesReportNotClosed: boolean = false;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    @ViewChild('pagecontainer') pageCont: ElementRef;
    constructor(public _compservices: CompensationService,public _homepage: HomePageService,private _http: Http, public _login:LoginService, private page: Page, private routerExtensions: RouterExtensions, public _timeoutService: TimeOutService, private route: ActivatedRoute, private router: Router, public _dataService: DataService, private location: Location,public _shared: CheckinOrderService) {
        this.iqKeyboard.enableAutoToolbar = true;
        ApplicationSettings.setString('apiurl', "http://ustlssoam316.airservices.svcs.entsvcs.net:8980/");
        this.iqKeyboard.goNext(),
            this.isError = false;
        this.errorMessage = "";
        this.loaderProgress = new LoaderProgress();
        let connectionType = connectivity.getConnectionType();
        switch (connectionType) {
            case connectivity.connectionType.none:
                alert("No internet connection ");
                break;
            case connectivity.connectionType.wifi:
                console.log("wifi");
                break;
            case connectivity.connectionType.mobile:
                console.log("mobile");
                break;
            default:
                break;
        }


    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.page.style.backgroundImage = "url('~/images/clouds_body.jpg')";
        this.page.style.backgroundSize = "cover ";
        this.page.style.backgroundPosition = "-10";
        UIApplication.sharedApplication.setStatusBarHiddenAnimated(true, false);
        this.loaderProgress.initLoader(this.pageCont);
        let date = this._shared.GetDateFormat();
        if (date != "Select Date Format") {
            this.getDateFormat = date;
        }
        else {
            this.getDateFormat = "DD MMM YYYY";
        }
        connectivity.startMonitoring((newConnectionType: number) => {
            switch (newConnectionType) {
                case connectivity.connectionType.none:
                    // this.connectionType = "None";
                    alert("No internet connection");
                    break;
                case connectivity.connectionType.wifi:
                    // this.connectionType = "Wi-Fi";
                    console.log("Connection type changed to WiFi.");
                    break;
                case connectivity.connectionType.mobile:
                    // this.connectionType = "Mobile";
                    console.log("Connection type changed to mobile.");
                    break;
                default:
                    break;
            }

        });
        this.getBluetoothPrinterDetails();
        console.log(ApplicationSettings.getString('apiurl', ''));
        var label = this.pageCont.nativeElement
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args: gestures.GestureEventData) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();

        });
    }

    // getProfile(): void {

    //     try {
    //         var sDate = new Date();
    //         console.log('GetAccountProfile Service --------------- Start Date Time : ' + sDate);
    //         this.loaderProgress.showLoader();
    //         this.profileDetails.push({ userName: "cm.pty.agent", apiUserKey: "osOk7lupocQBiED/uZtYPYWkaqlL06bvmKtSWJoUlPY=" });
    //         this.profileDetails.push({ userName: "cm.lax.agent", apiUserKey: "zs9c+D35ChVxt5Y40jUsaQBmslSeVv2Rk2k4Vh+jSe0=" });
    //         this.profileDetails.push({ userName: "cm.crc.agent", apiUserKey: "74/sNpCdU/063cGV30YiihV4SnpBGdee3vF0A02/8EU=" });
    //         this.profileDetails.push({ userName: "cm.mex.agent", apiUserKey: "b4ASfQ+INPYNUwJhzUu0ykb4pzFSSLP0snuA4KP5W+8=" });
    //         this.profileDetails.push({ userName: "cm.bog.agent", apiUserKey: "I3GilbrWqYtCZSj20Ofc4Q8wO2WymKDfDzMiQs4OWGw=" });
    //         this.profileDetails.push({ userName: "cm.gru.agent", apiUserKey: "t+HuOwt45+MJBmLkOPSLduYS2X3/yBAmq3953xlCWCs=" });
    //         this.profileDetails.push({ userName: "cm.scl.agent", apiUserKey: "lidWAJLNBL/h+4e/IBDQCGTce9e09ZotmjPyTWtdfD8=" });
    //         this.profileDetails.push({ userName: "cm.eze.agent", apiUserKey: "8f2ogbvrbobfPiptMNXnSsR7C9QG3hjxpyMYZGZu9iE=" });
    //         this.profileDetails.push({ userName: "cm.yyz.agent", apiUserKey: "C0dLacDdgW8wBBMk26KE1+jxRYLlegw2MrGEw1B8Ghw=" });
    //         this.profileDetails.push({ userName: "cm.mvd.agent", apiUserKey: "q/BPx4Wk1UeBnDKuRNEA2kMbJ1H7dO3+Bf1XW8/J4fQ=" });
    //         this.profileDetails.push({ userName: "cm.puj.agent", apiUserKey: "ov68V7zyS74SklDCdVo6WQEzWWCtbKNHLvw8fCXzb/k=" });
    //         this.profileDetails.push({ userName: "cm.sju.agent", apiUserKey: "DuIBPFxkEvD1ec2kLgW50VyPea9ghxCWi82X+UzVpcE=" });
    //         this.profileDetails.push({ userName: "cm.pty.sr", apiUserKey: "xOTd5k5OpW+lOiGi/8BYJjWLUHVD+emmKLMrSs5RWqE=" });
    //         this.profileDetails.push({ userName: "cm.lax.sr", apiUserKey: "IbF2ZNkYZmN3595PeuQD0XtJQFZzzL/MHt0RvxJVXeQ=" });
    //         this.profileDetails.push({ userName: "cm.cor.agent1", apiUserKey: "LOe1LhDb08a6NAaUwu8oBBHc2jEFyJnrqNswb9xhcgs=" });
    //         this.profileDetails.push({ userName: "cm.cor.agent2", apiUserKey: "DUcRXYhYX//Kl23oiYAIXfA3OEdwPrFWco+YEQa9xc0=" });
    //         this.profileDetails.push({ userName: "cm.cor.sprvsr", apiUserKey: "6GPvjz2kWJL8w+7cBKgd8FMXIy6VY6WTW7BDsnyVzZk=" });
    //         var profile = this.profileDetails.filter(m => m.userName == this.UserName.trim().toLowerCase());
    //         console.dir(profile);
    //         if (profile != null && profile.length > 0) {

    //             ApplicationSettings.setString("apiUserKey", profile[0].apiUserKey);
    //             this.routerExtensions.navigate(["home"], {
    //                 transition: {
    //                     name: "fade",
    //                     duration: 600,
    //                     curve: "linear"
    //                 },
    //                 queryParams:
    //                     {
    //                         "data": profile,
    //                     }
    //             });

    //         }
    //         else {
    //             this.isError = true;
    //             this.errorMessage = "Invalid UserID or Password";


    //         }
    //         this.loaderProgress.hideLoader();
    //     }

    //     catch (error) {
    //         console.log(error.message);
    //         this.loaderProgress.hideLoader();
    //     }
    //     finally {
    //         var eDate = new Date();
    //         console.log('GetAccountProfile Service --------------- End Date Time : ' + eDate);
    //         console.log('GetAccountProfile Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
    //     }
    // }

    private getProfile(salesOffice: string = "", currency: string = ""): void {
        try {
            var sDate = new Date();
            console.log('GetAccountProfile Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            this._homepage.GetAccountProfile(salesOffice, currency)
                .subscribe((data) => {
                    ApplicationSettings.setString("UserName", data.Username);
                    // console.log("Privilage:" + JSON.stringify(data));
                    this.isCheckinDisabled = false;
                    this.isGateDisabled = false;
                    this.isCompensationDisabled = false;
                    this._shared.setAgentPrivilage(data.Privileges);
                    data.Privileges.forEach((privilage, Index) => {
                        if (privilage.Name == "IssueLowerCompensationAirport" || privilage.Name == "IssueHigherCompensationAirport" || privilage.Name == "IssueLowerCompensationCustomerCare" || privilage.Name == "IssueMediumCompensationCustomerCare" || privilage.Name == "IssueHigherCompensationCustomerCare") {
                            console.log("inside privilage");
                            this.isCompensationDisabled = true;
                        }
                        if (privilage.Name == "AccessCheckinWorkflow") {
                            this.isCheckinDisabled = true;
                        } if (privilage.Name == "AccessGateWorkflow") {
                            this.isGateDisabled = true;
                        }
                    })
                    ApplicationSettings.setString("carrierCode", data.CarrierCode);
                    ApplicationSettings.setBoolean("checkinDisabled", this.isCheckinDisabled);
                    ApplicationSettings.setBoolean("gateDisabled", this.isGateDisabled);
                    ApplicationSettings.setBoolean("compensationEnabled", this.isCompensationDisabled);
                    // this.ProfileDetails = <Order.RootObject>data;
                    this.ProfileArray = new AccontProfileModel.AccountProfileTemplate();
                    this.ProfileArray = Converters.ConvertToAccountProfileTemplate(data);
                    // this.userdetails = this.ProfileArray.PointOfSales[0].AirportCode + " | " + moment().format(this.getDateFormat) + " | " + this.ProfileArray.Username;
                    let defaultPOS = this.ProfileArray.PointOfSales.filter(m => m.AgentCode === this.ProfileArray.Requestor_ID && m.AirportCode === this.ProfileArray.PhysicalLocation);
                    if (defaultPOS.length > 0) {
                        this.userdetails = defaultPOS[0].AirportCode + " | " + moment().format(this.getDateFormat) + " | " + this.ProfileArray.Username;
                        this._shared.SetUserPointofSale(defaultPOS[0].ID);
                    } else {
                        this.userdetails = this.ProfileArray.PointOfSales[0].AirportCode + " | " + moment().format(this.getDateFormat) + " | " + this.ProfileArray.Username;
                        this._shared.SetUserPointofSale(this.ProfileArray.PointOfSales[0].ID);
                    }
                    ApplicationSettings.setString("userdetails", this.userdetails);
                    this._shared.SetUserProfile(this.ProfileArray);
                    this._shared.SetCurrency(this.ProfileArray.ISOCurrencyCode);
                    this.AgentProfileList = [];
                    this.ProfileArray.PointOfSales.forEach((agentData, agentIndex) => {
                        var agentList = agentData.AirportCode + "  " + agentData.Name
                        this.AgentProfileList.push(agentList);
                    })
                    this._shared.SetAgentProfileList(this.ProfileArray);
                    this.getCity();
                },
                    error => {
                        console.log("Couldnt find information for this Profile " + error);
                        this.loaderProgress.hideLoader();
                    },
                    () => {
                        // sthis.loaderProgress.hideLoader();
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

    getCity() {
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetCityType Service --------------- Start Date Time : ' + sDate);
            this._homepage.getCityService()
                .subscribe(data => {
                    // console.dir(data);
                    let CompansationDetails: any = data;
                    console.log(CompansationDetails);
                    this.cityList = data.Collection;

                    this._shared.setCityList(this.cityList);
                    // console.dir(this.cityList);
                    // setTimeout(() =>, 5000);
                    this.getSalesReport();
                    // this.loaderProgress.hideLoader()

                },
                    err => {
                        console.log("c");
                        this.loaderProgress.hideLoader();
                    });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('Get GetCityType Service --------------- End Date Time : ' + eDate);
            console.log('Get GetCityType Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    }
    getSalesReport() {
        this.loaderProgress.showLoader();
        this._compservices.getSaleOfficeReport().subscribe((data) => {
            console.log("Sales report:" + JSON.stringify(data));
            if (data.HasOpenPastDueSalesReports) {
                this.isPrevDaySalesReportNotClosed = true;
                this.isCompensationDisabled = false;
                this.loaderProgress.hideLoader();
                Toast.makeText("Close previous day Sales Reporting to proceed.").show();
            }
            this.loaderProgress.hideLoader();
            this.navigatetohome();
        }, err => {
            console.log("Couldnt find information" + err);
            this.handleServiceError(err);
            this.loaderProgress.hideLoader();
        })
    } 
    getBluetoothPrinterDetails() {
        let discovery = new zebra.Discovery();
        let self = this;
        discovery.searchBluetooth().then(function (printers) {
            var count = printers.length;

            if (count === 0) {
                console.log("message", "Unable to find");
                // Toast.makeText("No Device found").show();
            } else if (count >= 1) {
                // We found a valid printer
                var actions: Array<string> = [];
                console.dir(printers);
                printers.forEach(element => {
                    actions.push(element.address);
                });
                ApplicationSettings.setString('printer', actions[0]);
                // let options = {
                //     title: "Bluetooth Printer",
                //     message: "Select Printer",
                //     cancelButtonText: "Cancel",
                //     actions: actions
                // };
                // dialogs.action(options).then((result) => {
                //     console.log(result);
                //     ApplicationSettings.setString('printer', result);
                //     // self.bltPrinter = result;
                // }, (err) => {

                // });
            }
        });
    }
    loginSubmit() {

        if (this.UserName != "" && this.PassWord != "") {
            this.authenticateUser();
        }
        else {
            this.isError = true;
            // this.errorMessage = "Invalid UserName/Password";
            if (this.PassWord == "" && this.UserName != "") {
                this.errorMessage = "Please enter a Password";
            }
            else if (this.UserName == "" && this.PassWord != "") {
                this.errorMessage = "Please enter a UserName";
            }
            else {
                this.errorMessage = "Please enter a UserName and Password";
            }
        }

    }

    authenticateUser() {
        console.log("Start Login");
        this.loaderProgress.showLoader();
        //    let requestData = 
        //     "USER=" + this.UserName.toString()+
        //     "&PASSWORD=" + encodeURIComponent(this.PassWord.toString())+
        //     "&TARGET=" + encodeURIComponent("http://pssguicmm.airservices.svcs.entsvcs.net:8980/api/account/profile") +
        //     "&LOCATION=" + encodeURIComponent("/css") ;
        // console.log(JSON.stringify(requestData));
        this._login.login(this.UserName, this.PassWord).subscribe((res) => {
            var result = res;
            console.dir(result);
           
                console.log("success");
                this._login.StatupTable().subscribe((result)=>{
                    this._shared.SetStartupTable(result);
                })
                // this.navigatetohome();
                this.getProfile();
           

        },
            err => {
                //  this.isError = true;
                //  this.errorMessage = "Invalid Username/Password";
                this.handleServiceError(err);
                this.loaderProgress.hideLoader();
                // var errorMessage = err.toString();

                // if (errorMessage.indexOf("Unrecognized token '<'") != -1) {
                //     console.log(err);
                //     this.isError = true;
                //     this.errorMessage = "Invalid Username/Password";
                //     this.loaderProgress.hideLoader();

                // } else {
                //     Toast.makeText("Unable to connect to the server").show();
                //     this.loaderProgress.hideLoader();
                // }
            })

    }
    // Siteminder Code ends

    isCookieSet() {
        const cookies: any = NSHTTPCookieStorage.sharedHTTPCookieStorage.cookies;
        if (typeof cookies !== 'undefined') {
            this.Output = "No Cookie(s) Available";
            for (let i = 0; i < cookies.count; i++) {
                const cookie: any = cookies.objectAtIndex(i);
                if (cookie.name == "SMSESSION") {
                    this.Output = cookie.name + ":\n" + cookie.value;
                    console.log("Cookie Value");
                    // ApplicationSettings.setString("cookievalue","cookie.value");
                    console.log(cookie.value);
                }
            }
        } else {
            this.Output = "No Cookie(s) Available"
        }
    }
    onChange(args: any) {
        if (this.UserName == "" && this.PassWord == "") {
            this.isButtonEnabled = false;
        }
        else {
            this.isButtonEnabled = true;
        }
    }


    navigatetohome() {
        this.loaderProgress.hideLoader();
        this.routerExtensions.navigate(["home"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
    }

    userNameReturnPress(args: any) {
        passwordTextField = this.page.getViewById<textField.TextField>("password");
        passwordTextField.focus();
    }

    handleServiceError(error: any) {
        var errorMessage = error.toString();
        if (errorMessage.indexOf("SessionTimeout") > -1) {
            Toast.makeText("Invalid Username or Password").show();
            // this.loaderProgress.hideLoader();
        }
        else{
            Toast.makeText(errorMessage).show();
        }
    }

}