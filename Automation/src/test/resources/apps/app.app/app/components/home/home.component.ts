//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { RouterExtensions, } from "nativescript-angular/router";
import { Page } from "ui/page";
import { GridLayout } from "ui/layouts/grid-layout";
import dialogs = require("ui/dialogs");
//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as moment from "moment";
import * as gestures from "ui/gestures";
import * as LabelModule from "ui/label";
import * as Toast from 'nativescript-toast';
//app references
import { DataService, CheckinOrderService, PassengerService, TimeOutService, CompensationService, HomePageService } from "../../shared/services/index";
import { LoaderProgress, AccontProfileModel } from "../../shared/interface/index"
import { Order, CityCodeCollection } from "../../shared/model/index";
import { Converters } from "../../shared/utils/index";
import { AppExecutiontime } from "../../app.executiontime";
import { Configuration } from '../../app.constants';


@Component({
    selector: "home-page",
    providers: [DataService, Configuration, PassengerService, HomePageService, CompensationService],
    templateUrl: "./components/home/home.component.html",
    styleUrls: ["./components/home/home.component.css"]
})
export class HomeComponent implements OnInit {

    @ViewChild('pagecontainer') pageCont: ElementRef;
    public isError: boolean;
    public errorMessage: string;
    public loaderProgress: LoaderProgress;
    public ProfileArray: AccontProfileModel.AccountProfileTemplate = new AccontProfileModel.AccountProfileTemplate();
    public ProfileDetails: any;
    public userdetails: any;
    public searchString = "";
    public index: any = null;
    public getDateFormat: any;
    public cityList: Array<CityCodeCollection.CollectionEntity> = [];
    public filterCityList: Array<CityCodeCollection.CollectionEntity> = [];
    public filterCityCode: Array<string> = [];
    public AgentProfileList: Array<any> = [];
    public isCompensationDisabled: boolean = false;
    public isPrevDaySalesReportNotClosed: boolean = false;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    constructor(public _homepage: HomePageService,
        private page: Page,
        public _service: PassengerService,
        private routerExtensions: RouterExtensions,
        public _dataService: DataService,
        public _timeoutService: TimeOutService,
        private activatedRouter: ActivatedRoute,
        private router: Router, private location: Location, public _shared: CheckinOrderService, public _compservices: CompensationService) {
        this.isError = false;
        this.errorMessage = "";
        this.loaderProgress = new LoaderProgress();

    }

    ngOnInit() {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover";
        this.loaderProgress.initLoader(this.pageCont);
        UIApplication.sharedApplication.setStatusBarHiddenAnimated(false, false);
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this._shared.SetBagTag(null);
        // this.getCity();
        let date = this._shared.GetDateFormat();
        if (date != "Select Date Format") {
            this.getDateFormat = date;
        }
        else {
            this.getDateFormat = "DD MMM YYYY";
        }
        this._timeoutService.startWatch();

        var label = this.pageCont.nativeElement
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe", function (args: gestures.GestureEventData) {
            self._timeoutService.resetWatch();
        });
        this.loaderProgress.hideLoader();
        this.isCompensationDisabled = ApplicationSettings.getBoolean("compensationEnabled",false);;
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled",false);
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled", false);
        this.ProfileArray =this._shared.GetAgentProfileList();
        this.ProfileArray.PointOfSales.forEach((agentData, agentIndex) => {
            var agentList = agentData.AirportCode + "  " + agentData.Name
            this.AgentProfileList.push(agentList);
        })
        // this.getProfile();
        // this.getPrinterDetails();
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

        }, err => {
            console.log("Couldnt find information" + err);
            this.handleServiceError(err);
            this.loaderProgress.hideLoader();
        })
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

                }, error => {
                    this.handleServiceError(error);
                    console.log(error);
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

    /**
     * get profile information of the logged in user
     **/
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
                    this.getCity();
                }, error => {
                    this.handleServiceError(error);
                    console.log(error);
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


    changeAgentLocation() {
        let options = {
            title: "Change Sales Office",
            message: "Select Sales Office",
            cancelButtonText: "Cancel",
            actions: this.AgentProfileList
        };
        dialogs.action(options).then((result) => {
            if (result != "Cancel") {
                var SelectedAgent = result;
                let airportCode = result.substr(0, 3);
                let posName = result.substr(5);
                let posId = this.ProfileArray.PointOfSales.filter(m => m.AirportCode === airportCode && m.Name === posName);
                // this.ProfileArray.PointOfSales[0].AirportCode = result.substr(0, 3);
                // console.log(result.substr(5));
                // let Id = this.ProfileArray.PointOfSales.filter(m => m.Name == result.substr(5))[0].ID;
                // this._shared.SetUserPointofSale(posId);
                // this.userdetails = this.ProfileArray.PointOfSales[0].AirportCode + " | " + moment().format("DD MMM YYYY") + " | " + this.ProfileArray.Username;
                // ApplicationSettings.setString("userdetails", this.userdetails);
                if (posId.length > 0) this.changeAgentCurrency(posId[0].ID);
                else Toast.makeText('Invalid Point Of Sales.');

            }

        });
    }

    changeAgentCurrency(posID: string) {
        let currency = this.ProfileArray.PointOfSales.filter(m => m.ID == posID)[0].currencies;
        let options = {
            title: "Change Currencies",
            message: "Select Currency",
            cancelButtonText: "Cancel",
            actions: currency
        };
        dialogs.action(options).then((result) => {
            if (result != "Cancel") {
                var SelectedAgent = result;
                console.log(result);
                this._shared.SetCurrency(result);
                this.getProfile(posID, result)
            }
        });

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
    navigateToCompensation() {
        if (this.isCompensationDisabled == true) {
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