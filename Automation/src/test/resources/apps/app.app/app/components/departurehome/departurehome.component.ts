//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import * as dialogs from "ui/dialogs"
import * as gestures from "ui/gestures";
import * as moment from "moment";

//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as Toast from 'nativescript-toast';

//app references
import { DataService, PassengerService, TimeOutService, CheckinOrderService, DepartureService } from "../../shared/services/index";
import { DepartureInfo, DepartureInfo1, LoaderProgress } from "../../shared/interface/index";
import { Departures } from "../../shared/model/index";
import { Converters } from "../../shared/utils/index";
import { AppExecutiontime } from "../../app.executiontime";
import { Configuration } from '../../app.constants';

@Component({
    selector: "departurehome-app",
    providers: [DataService, Configuration, PassengerService, DepartureService],
    templateUrl: "./components/departurehome/departurehome.component.html"
})

export class DepartureHomeComponent implements OnInit {

    @ViewChild('pagecontainer') pageCont: ElementRef;
    public isError: boolean;
    public errorMessage: string;
    private DepartureDetails: any;
    private DepartureArray: Array<DepartureInfo1.Departure> = [];
    private DepartureArraylatest: Array<DepartureInfo1.Departure> = [];
    public locationcode: string;
    public destination: string;
    public gatenumber: string;
    public destinationinput: string;
    private date: string;
    public userdetails: any;
    public isCompensationEnabled: boolean = false;
    public loaderProgress: LoaderProgress;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    GateEmpty: boolean;

    DestEmpty: boolean;

    Gatedirty: boolean;

    Destdirty: boolean;
    constructor(public _service: PassengerService, private page: Page, public _shared: CheckinOrderService, public _timeoutService: TimeOutService, private routerExtensions: RouterExtensions, public _dataService: DataService, private router: Router, private location: Location, private activatedRouter: ActivatedRoute, public departureService: DepartureService) {
        this.isError = false;
        this.errorMessage = "";
        this.loaderProgress = new LoaderProgress();
    }

    ngOnInit() {

        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        this.loaderProgress.initLoader(this.pageCont);
        this.destination = "LAX";
        this.destinationinput = "";
        this.gatenumber = "";
        let departureDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
        this.date = departureDate.toString();
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled", );
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled", );
        this.isCompensationEnabled = ApplicationSettings.getBoolean("compensationEnabled", );
        let userlocation: String = this.userdetails;
        this.locationcode = userlocation.substring(0, 3);
        this.searchByDestination();
        var label = this.pageCont.nativeElement
        var self = this;
        var observer = label.on("loaded, tap, longPress, swipe, ngModelChange", function (args: gestures.GestureEventData) {
            console.log("Event: " + args.eventName);
            console.log(self._timeoutService.timer);
            self._timeoutService.resetWatch();

        });
    }

    showAllDepartures() {
        this.navigateToAllDepartures();
    }

    searchByDestination(refresh:boolean = false) {
        try {
            var sDate = new Date();
            console.log('SearchDeparturesByLocationcode Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader('Loading Data...');
            var startTime = moment(sDate).format('HH:MM:SS');
            this.departureService.SearchDeparturesByLocationcode(this.locationcode, this.date, startTime,refresh)
                .subscribe((data) => {
                    this.DepartureDetails = <Departures.RootObject>data;
                    this.DepartureArray = Converters.ConvertToDepartureTemplate(this.DepartureDetails, this.destinationinput, this.gatenumber,"des");
                    if (this.DepartureArray.length == 0) {
                        Toast.makeText("No flights found").show();
                        //  this.navigateToSearch();

                    }
                    this.DepartureArraylatest = this.DepartureArray.slice(0, 12);
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

                    //         this.navigateTologin();

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

    searchbygatenumber(args,refresh:boolean=false) {
        try {
            var sDate = new Date();
            console.log('SearchDeparturesByLocationcode Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader('Loading Data...');
            var startTime = moment(sDate).format('HH:MM:SS');
            this._shared.SetStartTime(sDate);
            // if (args == "") {
                this.departureService.SearchDeparturesByLocationcode(this.locationcode, this.date, startTime,refresh)
                    .subscribe((data) => {
                        this.DepartureDetails = <Departures.RootObject>data;
                        this.DepartureArray = Converters.ConvertToDepartureTemplate(this.DepartureDetails, this.destinationinput, this.gatenumber,args);
                        if (this.DepartureArray.length == 0) {
                            Toast.makeText("No flights found").show();
                            //  this.navigateToSearch();
                        }
                        if(this.destinationinput==""){
                            this.DepartureArraylatest = this.DepartureArray.slice(0, 12);
                        }else{
                            this.DepartureArraylatest = this.DepartureArray;
                        }
                        console.log(this.DepartureArray)
                        this.loaderProgress.hideLoader();
                    },
                    error => {
                        console.log("Couldnt find information for this OrderID " + error);
                        this.handleServiceError(error);
                        this.loaderProgress.hideLoader();
                    },
                    () => {
                        console.log(this.DepartureArray.length);
                        this.loaderProgress.hideLoader();
                    })
            // } 
            // else {

            //     var nextInterval = moment(this._shared.GetStartTime()).add(12, 'hours').toString();
            //     var date = moment(nextInterval).format("YYYY-MM-DD").toString();
            //     var nextStartTime = moment(nextInterval).format('HH:MM:SS').toString();
            //     this.departureService.SearchDeparturesByLocationcode(this.locationcode, date, nextStartTime,refresh)
            //         .subscribe((data) => {
            //             this.DepartureDetails = <Departures.RootObject>data;
            //             this.DepartureArray = Converters.ConvertToDepartureTemplate(this.DepartureDetails, this.destinationinput, this.gatenumber);
            //             if (this.DepartureArray.length == 0) {
            //                 Toast.makeText("No flights found").show();
            //             }
            //             this.DepartureArraylatest = this.DepartureArray;

            //             this.loaderProgress.hideLoader();
            //         },
            //         error => {
            //             console.log("Couldnt find information for this OrderID " + error);
            //             this.handleServiceError(error);
            //             this.loaderProgress.hideLoader();
                        
            //         },
            //         () => {
            //             console.log(this.DepartureArray.length);
            //             this.loaderProgress.hideLoader();
            //         })

            // }
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

    refresh(){
        this.searchByDestination(true); 
    }
    simpleTap() {
        //  alert("Its Tapped");
    }
    onChange(args: any, index: any) {
        this._timeoutService.resetWatch();
        switch (index) {

            // case 0:

            //     if (this.gatenumber == "") {

            //         Toast.makeText("Please Enter Correct Gate number").show();

            //         //this.GateEmpty = true;



            //     }

            //     else {

            //         this.GateEmpty = false;

            //          this.Gatedirty = true;

            //     }

            case 1:

                if (this.destinationinput.length > 3) {

                    Toast.makeText("Please Enter Correct Destination").show();
                    //  this.DestEmpty = true;
                }

                else {
                    this.DestEmpty = false;
                    this.Destdirty = true;
                }
                break;

            case 2:
                if (this.gatenumber.length > 0) {
                    var reg = new RegExp('^[a-zA-Z0-9]*$');
                    var test = reg.test(this.gatenumber);
                    if (test == false) {
                        Toast.makeText("Please Enter correct Gate number").show();
                    }
                }
                else {
                    this.GateEmpty = false;
                    this.Gatedirty = true;

                }





        }



    }

    navigateToAllDepartures() {
        this.routerExtensions.navigate(["departall"], {
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
    toggleChecked(args: any) {


        this.DepartureArray.forEach((element, index) => {
            element.IsChecked = false;
        });
        var pax = <DepartureInfo1.Departure>args;
        pax.IsChecked = true;
        this.navigateToPaxList(pax.FlightNumber, pax);


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

}

