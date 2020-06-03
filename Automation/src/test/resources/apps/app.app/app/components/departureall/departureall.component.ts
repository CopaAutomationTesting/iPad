//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import * as dialogs from "ui/dialogs";
import * as gestures from "ui/gestures";

//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as moment from "moment";
import * as Toast from 'nativescript-toast';

//app references
import { DataService, TimeOutService, PassengerService, DepartureService } from "../../shared/services/index";
import { DepartureInfo, DepartureInfo1, LoaderProgress } from "../../shared/interface/index";
import { Departures } from "../../shared/model/index";
import { Converters } from "../../shared/utils/converter.util";
import { Configuration } from '../../app.constants';
import { AppExecutiontime } from "../../app.executiontime";


@Component({
    selector: "departureall-app",
    providers: [DataService, Configuration, PassengerService,DepartureService],
    templateUrl: "./components/departureall/departureall.component.html"
})

export class DepartureAllComponent implements OnInit {

    public isError: boolean;
    public errorMessage: string;
    public Config: Array<DepartureInfo1.Configuration> = [];
    private DepartureDetails: any;
    private DepartureArray: Array<DepartureInfo1.Departure> = [];
    private locationcode: string;
    private date: string;
    private Flightdate: string;
    public userdetails: any;
    public flightSortIndicator: number = -1;
    public StdSortIndicator: number = -1;
    public EtdSortIndicator: number = -1;
    public StatusSortIndicator: number = -1;
    public gateSortIndicator: number = -1;
    public toSortIndicator: number = -1;
    public isCompensationEnabled: boolean = false;  
    public loaderProgress: LoaderProgress;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    @ViewChild('pagecontainer') pageCont: ElementRef;

    constructor(private page: Page, public _timeoutService: TimeOutService, public _service: PassengerService, private routerExtensions: RouterExtensions, public _dataService: DataService, private router: Router, private location: Location, private activatedRouter: ActivatedRoute,public _departureService:DepartureService ) {
        this.isError = false;
        this.errorMessage = "";
        this.loaderProgress = new LoaderProgress();
    }
    ngOnInit() {

        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.loaderProgress.initLoader(this.pageCont);
        let departureDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
        this.date = departureDate.toString();
        this.Flightdate = moment(departureDate, "YYYY-MM-DD").format("MM/DD/YY");
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled", );
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled", );
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled", );
        let userlocation: String = this.userdetails;
        this.locationcode = userlocation.substring(0, 3);
        this.searchFlightByDestination(this.locationcode, this.date);
        var label = this.pageCont.nativeElement
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args: gestures.GestureEventData) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();

        });

    }
    refresh(){
        this.searchFlightByDestination(this.locationcode, this.date,true);
    }

    searchFlightByDestination(location: string, date: string,refresh:boolean=false): void {

        try {
            var sDate = new Date();
            console.log('SearchDeparturesByLocationcode Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader('Loading Data...');
            var startTime = moment(sDate).format('HH:MM:SS');
            this.loaderProgress.showLoader();
            this._departureService.SearchDeparturesByLocationcode(this.locationcode, this.date, startTime,refresh)
                .subscribe((data) => {
                    this.DepartureDetails = <Departures.RootObject>data;
                    this.DepartureArray = Converters.ConvertToDepartureTemplate(this.DepartureDetails, "", "","des");

                    if (this.DepartureArray.length == 0) {
                        var self = this;
                        Toast.makeText("No flights found").show();
                        this.navigateToDepartures();
                    }
                    this.loaderProgress.hideLoader();
                },
                error => {
                    console.log("Couldnt find information for this OrderID " + error);
                    this.handleServiceError(error);
                    // var errorMessage = error.toString();
                    // if (errorMessage.indexOf("Unrecognized token '<'") != -1) {
                    //     var options = {
                    //         title: "Session Time Out",
                    //         message: "Your session has been time out",
                    //         okButtonText: "OK"
                    //     };
                    //     dialogs.alert(options).then(() => {

                    //         this.navigateToLogin();

                    //     });
                    // }
                    this.loaderProgress.hideLoader();
                },
                () => {
                    console.log(this.DepartureArray.length);
                    this.loaderProgress.hideLoader();
                }
                )
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('SearchDeparturesByLocationcode Service --------------- End Date Time : ' + eDate);
            console.log('SearchDeparturesByLocationcode Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    }
    sortFlight() {
        // var isAsc: number = this.flightSortIndicator == -1 ? 0 : this.flightSortIndicator;
        var isAsc: number = this.flightSortIndicator == 0 ? 1 : 0;
        this.flightSortIndicator = this.flightSortIndicator == 0 ? 1 : 0;
        this.toSortIndicator = -1;
        this.EtdSortIndicator = -1;
        this.StatusSortIndicator = -1;
        this.StdSortIndicator = -1;
        this.gateSortIndicator = -1;
        // console.dir(this.DepartureArray);
        this.DepartureArray.sort(function (a, b) {
            var val1 = Number(a.FlightNumber.substr(2));
            var val2 = Number(b.FlightNumber.substr(2)) == Number.NaN ? 0 : Number(b.FlightNumber.substr(2));
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
        console.log("Sort Done");
        this.loaderProgress.hideLoader();
    }

    icon(): any {
        if (this.flightSortIndicator == -1) {
            return '&#xe902;'
        } else if (this.flightSortIndicator == 0)
            return '&#xe900;'
        else return '&#xE5C5;'
    }

    sortTo() {
        // var isAsc: number = this.toSortIndicator == -1 ? 0 : this.toSortIndicator;
        var isAsc: number = this.toSortIndicator == 0 ? 1 : 0;
        this.toSortIndicator = this.toSortIndicator == 0 ? 1 : 0;
        this.flightSortIndicator = -1;
        this.EtdSortIndicator = -1;
        this.StatusSortIndicator = -1;
        this.StdSortIndicator = -1;
        this.gateSortIndicator = -1;
        this.DepartureArray.sort(function (a, b) {
            var val1 = a.Destination;
            var val2 = b.Destination;
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
    sortGate() {
        // var isAsc: number = this.gateSortIndicator == -1 ? 0 : this.gateSortIndicator;
        var isAsc: number = this.gateSortIndicator == 0 ? 1 : 0;
        this.gateSortIndicator = this.gateSortIndicator == 0 ? 1 : 0;
        this.flightSortIndicator = -1;
        this.EtdSortIndicator = -1;
        this.StatusSortIndicator = -1;
        this.StdSortIndicator = -1;
        this.toSortIndicator = -1;
        this.DepartureArray.sort(function (a, b) {
            // var val1 = a.Destination;
            // var val2 = b.Destination;
            var val1 = Number(a.Gate.split(/[a-zA-Z]/)[0]);
            var val2 = Number(b.Gate.split(/[a-zA-Z]/)[0]) == Number.NaN ? 0 : Number(b.Gate.split(/[a-zA-Z]/)[0])
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

    sortStatus() {
        // var isAsc: number = this.StatusSortIndicator == -1 ? 0 : this.StatusSortIndicator;
        var isAsc: number = this.StatusSortIndicator == 0 ? 1 : 0;
        this.StatusSortIndicator = this.StatusSortIndicator == 0 ? 1 : 0;
        this.flightSortIndicator = -1;
        this.EtdSortIndicator = -1;
        this.toSortIndicator = -1;
        this.StdSortIndicator = -1;
        this.gateSortIndicator = -1;
        this.DepartureArray.sort(function (a, b) {
            var val1 = a.FlightStatus;
            var val2 = b.FlightStatus;
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

    sortSTD() {
        // var isAsc: number = this.StdSortIndicator == -1 ? 0 : this.StdSortIndicator;
        var isAsc: number = this.StdSortIndicator == 0 ? 1 : 0;
        this.StdSortIndicator = this.StdSortIndicator == 0 ? 1 : 0;
        this.toSortIndicator = -1;
        this.EtdSortIndicator = -1;
        this.flightSortIndicator = -1;
        this.StatusSortIndicator = -1;
        this.gateSortIndicator = -1;
        this.DepartureArray.sort(function (a, b) {

            var val1 = Number(a.STD.replace(':', ''));
            var val2 = Number(b.STD.replace(':', '')) == Number.NaN ? 0 : Number(b.STD.replace(':', ''))
            console.log(val1 + " " + val2);
            //   this.sort();

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
    sortETD() {
        this.loaderProgress.showLoader();
        // var isAsc: number = this.EtdSortIndicator == -1 ? 0 : this.EtdSortIndicator;
        var isAsc: number = this.EtdSortIndicator == 0 ? 1 : 0;
        console.log(isAsc);
        this.EtdSortIndicator = this.EtdSortIndicator == 0 ? 1 : 0;
        this.toSortIndicator = -1;
        this.StdSortIndicator = -1;
        this.flightSortIndicator = -1;
        this.StatusSortIndicator = -1;
        this.gateSortIndicator = -1;
        this.DepartureArray.sort(function (a, b) {
            // console.log(Number(a.ETD.toString().slice(/)));
            var val1 = Number(a.ETD.replace(':', ''));
            // let val3 = a.ETD.toString().slice(:);

            var val2 = Number(b.ETD.replace(':', '')) == Number.NaN ? 0 : Number(b.ETD.replace(':', ''));
            console.log(val1 + " " + val2);
            //   this.sort();

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
        console.log(this.DepartureArray);
        this.loaderProgress.hideLoader();
    }

    displaypaxlist(args: any) {
        var pax = <DepartureInfo1.Departure>args.view.bindingContext;
        this.navigateToPaxList(pax.FlightNumber, pax);

    }

    toggleChecked(args: any) {


        this.DepartureArray.forEach((element, index) => {
            element.IsChecked = false;
        });
        var pax = <DepartureInfo1.Departure>args.view.bindingContext;
        pax.IsChecked = true;
        this.navigateToPaxList(pax.FlightNumber, pax);


    }

    simpleTap() {

    }

    navigateToPaxList(param: string, pax: DepartureInfo1.Departure) {

        this.routerExtensions.navigate(["deppaxlist"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            },
            queryParams: {
                "data": param,
                "pax": JSON.stringify(pax)
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
    navigateToLogin() {
        this.routerExtensions.navigate([""], {
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
        else{
            Toast.makeText(errorMessage).show();
        }
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
        }else{
            Toast.makeText("Compensation Not applicable").show();
        }
    }

}


