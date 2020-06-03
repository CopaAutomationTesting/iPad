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
import { CreatingListPickerComponent } from "../../components/country/country-modal";
import { DataService, PassengerService, CheckinOrderService } from "../../shared/services/index";
import { LoaderProgress, PassengerListTemplate, PassengerList, AccontProfileModel } from "../../shared/interface/index"
import { CompensationService } from "../../shared/services/index";
import { Order, CountryCollection, FlightServiceInfo, Flight, Search, AccountProfile, PassengerTypeListTable, Compansation, CityCodeCollection, PassengerTypeModel } from "../../shared/model/index";
import { Converters } from "../../shared/utils/index";
import { DatePickerModal, DatePicketContext } from "../../components/date-picker/date-picker-modal";
import { Configuration } from '../../app.constants';
import { AppExecutiontime } from "../../app.executiontime";
import { isAndroid, isIOS, device, screen } from "platform";
import { TimeOutService } from "../../shared/services/timeOut.service";
import { elementDef } from "@angular/core/src/view/element";

@Component({
    selector: "compensationsearch-page",
    providers: [Configuration, CompensationService, DataService, PassengerService],
    templateUrl: "./components/compensationsearch/compensationsearch.component.html",
    styleUrls: ["./components/compensationsearch/compensationsearch.component.css"]

})

export class CompensationSearchComponent implements OnInit {
    @ViewChild('pagecontainer') pageCont: ElementRef;
    public isError: boolean;
    public errorMessage: string;
    public loaderProgress: LoaderProgress;
    public startDate: Date;
    public SearchFields: Search = new Search();
    public curDate: Date;
    public FlightDate: string;
    public FlightNumber: string = "";
    public userdetails: string;
    public PassengerType: string = "";
    public isTextField: boolean = true;
    public isLabelField: boolean = false;
    public PassengerTypeList: PassengerTypeModel.RootObject = new PassengerTypeModel.RootObject();
    public PaxTypeList: Array<string> = [];
    public isAnySearchEmpty: boolean = false;
    public isFlightEmpty: boolean = false;
    public isLastNameEmpty: boolean = false;
    public isButtonEnabled = false;
    public isnumber: boolean;
    public isLastdirty: boolean;
    public isFlightdirty: boolean;
    public isSearchanydirty: boolean
    public iserror: boolean;
    public isDigit: boolean;
    public cityList: Array<CityCodeCollection.CollectionEntity> = [];
    public filterCityList: Array<CityCodeCollection.CollectionEntity> = [];
    public filterCityCode: Array<string> = [];
    public isCityEmpty: boolean = false;
    public isCityDirty: boolean = false;
    public isValid: boolean = false;
    public isCheckinDisabled: boolean = false;
    public isGateDisabled: boolean = false;
    public static COMPENSATIONPRINTLISTPAX: string = "Print List";
    public static COMPENSATIONLISTPAX: string = "Compensation List";
    public static DATANOTFOUNDTOAST: string = "Data not found";
    public static FLIGHTNOTFOUNDTOAST: string = " Flight Details not found";
    public static RESERVATIONNOTFOUNDTOAST: string = "No Reservation found";
    public static RESERVATIONNOTFOUNDTOASTFORETKT: string = "ETKT not found";
    public static FQTVNOTFOUNDTOAST: string = "No FQTV found";
    public static INVALIDFLIGHTENTERED: string = "Invalid input. Enter airline code and flight number.";

    constructor(private _configuration: Configuration, public _services: PassengerService, public _dataService: DataService, public _shared: CheckinOrderService, private page: Page, private routerExtensions: RouterExtensions, public _timeoutService: TimeOutService, private router: Router, public _service: CompensationService, private route: ActivatedRoute, private vcRef: ViewContainerRef, private _modalService: ModalDialogService) {
        this.isError = false;
        this.errorMessage = "";
        this.userdetails = ApplicationSettings.getString("userdetails", "");
        this.SearchFields.Location = this.userdetails.substr(0, 3);
        ApplicationSettings.setString("SearchLocation",this.SearchFields.Location);
        this.SearchFields.FlightDate = moment().format("DD MMMM YYYY");
        this.curDate = moment().toDate();
        this.startDate = new Date();
        this.loaderProgress = new LoaderProgress();
    }
    ngOnInit() {
        this.page.style.backgroundImage = "url('~/images/login_back.jpeg')";
        this.page.style.backgroundSize = "cover ";
        console.log("IN");
        this.loaderProgress.initLoader(this.pageCont);
        this.getPassengerType();
        this.isCheckinDisabled = ApplicationSettings.getBoolean("checkinDisabled");
        this.isGateDisabled = ApplicationSettings.getBoolean("gateDisabled");
        this.cityList = this._shared.getCityList();
        this.cityList.forEach((data, index) => {
            this.filterCityCode.push(data.Code + "-" + data.Name);
        })
        console.log("in search screen");
        console.log(this.filterCityCode);

        this.isButtonEnabled = false;
    }
    displayCityListActionDialog() {
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: [{ country: this.filterCityCode }],
            fullscreen: false
        };

        this._modalService
            .showModal(CreatingListPickerComponent, options)
            .then(result => {
                console.log("date result " + result);
                if (result) {
                    this.SearchFields.Location = result.substr(0, 3);
                    ApplicationSettings.setString("SearchLocation",this.SearchFields.Location);
                    console.log("out" + result);
                }
            });
    }
    getPassengerType(): void {
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetPassengerType Service --------------- Start Date Time : ' + sDate);
            this.PassengerTypeList = null;
            this._service.getPassengerType()
                .subscribe(data => {
                    let CompansationDetails: any = data;
                    console.dir(CompansationDetails);
                    this.PassengerTypeList = CompansationDetails;
                    this._shared.SetPassengerTypeService(this.PassengerTypeList);
                    this.PassengerTypeList.PassengerTypeListTable.forEach((element, index) => {
                        this.PaxTypeList.push(element.Value.Description);
                    });
                    this.loaderProgress.hideLoader();
                },
                    err => {
                        this.handleServiceError(err);
                        this.loaderProgress.hideLoader();
                    });
        }
        catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }
        finally {
            var eDate = new Date();
            console.log('Get GetPassengerType Service --------------- End Date Time : ' + eDate);
            console.log('Get GetPassengerType Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }

    }
    createModelView(args) {
        let that = this;
        let currentDate = this.curDate;
        console.log(this.startDate);
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                currentDate: currentDate.toDateString(),
                displayHeader: true,
                minDate: moment(new Date()).subtract(1, 'years').toDate().toDateString(),
                maxDate: moment(new Date()).add(1, 'years').toDate().toDateString()
            },
            fullscreen: false
        };

        this._modalService.showModal(DatePickerModal, options)
            .then((dateresult: Date) => {
                if (dateresult) {
                    console.log("date result " + dateresult);
                    if (dateresult.toDateString() != 'undefined') {
                        this.curDate = dateresult;
                    }
                }
            });
    }
    displayPassengerTypeDialog() {
        let options = {
            title: "Passenger Type",
            cancelButtonText: "Cancel",
            actions: this.PaxTypeList,
        };
        dialogs.action(options).then((result) => {
            if (result != "Cancel") {
                this.PassengerType = result;
                this.isLabelField = true;
                this.isTextField = false;
            }
        });
    }
    clear(): void {
        this.SearchFields.SearchAny = "";
        this.FlightNumber = "";
        this.PassengerType = "";
        this.isButtonEnabled = false;
        this.isLabelField = false;
        this.isTextField = true;
        this.isLastdirty = false;
        this.isFlightdirty = false;
        this.isSearchanydirty = false;
    }
    flightEmpty(): boolean {
        if (this.isFlightEmpty && this.isFlightdirty) {
            return true;
        }
        else return false;
    }
    searchempty(): boolean {
        if (this.isAnySearchEmpty && this.isSearchanydirty) {
            return true;
        }
        else return false;

    }
    onChange(args: any, index: any) {
        this._timeoutService.resetWatch();
        switch (index) {
            case 0:
                this.isFlightEmpty = false;
                this.isLastNameEmpty = false;
                if (this.SearchFields.SearchAny != "") {
                    this.isAnySearchEmpty = false;
                    this.isSearchanydirty = true;
                }
                if (this.SearchFields.SearchAny.length >= 6 && this.SearchFields.SearchAny.length <= 18) {
                    this.isValid = true;
                }
                else
                    this.isValid = false;
                var reg = new RegExp('^[a-zA-Z0-9-/]*$');
                var test = reg.test(this.SearchFields.SearchAny);
                if (test == false) {
                    this.isAnySearchEmpty = true;
                    this.isValid = false;
                }
                else
                    this.isAnySearchEmpty = false;
                break;
            case 1:
                this.isAnySearchEmpty = false;
                if (this.FlightNumber == "") {
                    this.isFlightEmpty = true;
                    this.isButtonEnabled = false;
                }
                else {
                    this.isFlightEmpty = false;
                    this.isFlightdirty = true;
                    if (this.FlightNumber.length <= 2) {
                        var reg = new RegExp('^[a-zA-Z0-9]*$');
                        var test = reg.test(this.FlightNumber);
                        if (test == false) {
                            Toast.makeText(CompensationSearchComponent.INVALIDFLIGHTENTERED).show();
                            this.isFlightEmpty = true;
                        }
                    } else {
                        var reg = /(^([A-Za-z]{0,2})\d{2,4})$/;
                        var test = reg.test(this.FlightNumber);
                        console.log("flightnum" + test);
                        if (test == false) {
                            Toast.makeText(CompensationSearchComponent.INVALIDFLIGHTENTERED).show();
                            this.isFlightEmpty = true;
                        }
                    }
                }
                // else {
                //     if (this.FlightNumber.length >= 3) {
                //         var reg = new RegExp(/^[a-zA-Z]+$/);
                //         var test = reg.test(this.FlightNumber);
                //         if (test == true) {
                //             this.isFlightEmpty = true;
                //             Toast.makeText(CompensationSearchComponent.INVALIDFLIGHTENTERED).show();
                //         } else {
                //             this.isFlightEmpty = false;
                //         }
                //     } else {
                //         this.isFlightEmpty = false;
                //     }
                // }

                break;
            default:
        }
        if (this.isFlightEmpty == false && this.PassengerType != "") {
            this.isButtonEnabled = true;
        } else {
            this.isButtonEnabled = false;
        }

    }
    searchButtonEnabled(): boolean {
        if (this.PassengerType != "" && this.isFlightEmpty == false && this.FlightNumber != "") {
            this.isButtonEnabled = true;
        }
        if (this.isButtonEnabled) {
            return true;
        }
        else return false;
    }
    searchPaxByFlight(): void {
        this.FlightDate = moment(this.curDate).format("YYYY-MM-DD");
        var PaxType;
        var AgentLocation = this.SearchFields.Location;
        
        // if (this.FlightNumber.substring(0, 2).toUpperCase() != 'CM') this.FlightNumber = "CM" + this.FlightNumber;
        let reg = new RegExp('^[0-9]*$');
        let test = reg.test(this.FlightNumber);
        if (test == true) {
            console.log("R1");
            this.FlightNumber = ApplicationSettings.getString("carrierCode", "") + this.FlightNumber;
        }
        if (this.FlightNumber.substr(0, 2).toUpperCase() != "CM") {
            Toast.makeText("Invalid Carrier Code").show();
            this.isFlightEmpty = true;
            this.FlightNumber = "";
        }
        else {
            if (this.PassengerType == CompensationSearchComponent.COMPENSATIONPRINTLISTPAX) {
                PaxType = this.PassengerTypeList.PassengerTypeListTable.filter(m => m.Value.Description == this.PassengerType)[0].Key;
                this.getCompensationList(this.FlightDate, this.FlightNumber, AgentLocation, PaxType);
            } else if (this.PassengerType == CompensationSearchComponent.COMPENSATIONLISTPAX) {
                PaxType = this.PassengerTypeList.PassengerTypeListTable.filter(m => m.Value.Description == this.PassengerType)[0].Key;
                this.getCompensationList(this.FlightDate, this.FlightNumber, AgentLocation, "reasonwiseget");
            } else {
                PaxType = this.PassengerTypeList.PassengerTypeListTable.filter(m => m.Value.Description == this.PassengerType)[0].Key;
                this.getPassengerList(this.FlightDate, this.FlightNumber, AgentLocation, PaxType);
            }
        }
    }
    searchPax(): void {
        var reg = new RegExp(/^[0-9]+$/);
        var test = reg.test(this.SearchFields.SearchAny);
        if (test == true) {
            this.isDigit = true;
        }
        if (this.SearchFields.SearchAny.length == 6) {
            // Toast.makeText("Order Id Search").show();
            this.getPassengerOrderDetails(this.SearchFields.SearchAny);
        }
        else if (this.SearchFields.SearchAny.length == 13 && this.isDigit) {
            // Toast.makeText("Eticket Search").show();
            this.getPassengerETKTDetails(this.SearchFields.SearchAny);
        }
        else if (this.SearchFields.SearchAny.length >= 7 && this.SearchFields.SearchAny.length <= 18) {
            // Toast.makeText("FQTV Search").show();
            let fqtvnum1 = this.SearchFields.SearchAny.toString().substr(0, 2);
            let fqtvnum2 = this.SearchFields.SearchAny.toString().substr(2);
            let fqtvnum3 = fqtvnum1 + "%2F" + fqtvnum2;
            console.log("FQTV" + fqtvnum3);
            this.getPassengerFQTVDetails(fqtvnum3);
        }
        else {
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
                        this._shared.setCompensationList(CompansationDetails);
                        this.flightStatus();
                    } else {
                        Toast.makeText(data.Errors.message).show();
                        this.loaderProgress.hideLoader();
                        this.clear();
                    }
                } else {
                    Toast.makeText(data.errMessage).show();
                    this.clear();
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
            console.log('Get CompensationDetails Service --------------- End Date Time : ' + eDate);
            console.log('Get CompensationDetails Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
    }
    getCompensationList(date, flight, location, paxtype): void {
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetPassengerType Service --------------- Start Date Time : ' + sDate);
            this._service.getCompensationPaxList(date, flight, location, paxtype).subscribe((data) => {
                if (data.Results) {
                    
                    if (data.Results[0].FlightSegments[0].Passengers == null) {
                        Toast.makeText(CompensationSearchComponent.DATANOTFOUNDTOAST).show();
                        this.loaderProgress.hideLoader();
                        this.clear();
                    } else {
                        let CompansationDetails: any = data;
                        this.flightStatusForCompensationList(CompansationDetails);
                    }
                } else {
                    if (data.Errors[0].Message == "Data not found") {
                        Toast.makeText("No passenger found").show();
                    } else {
                        Toast.makeText(data.Errors[0].Message).show();
                    }
                    this.loaderProgress.hideLoader();
                    this.clear();
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
    flightStatusForCompensationList(CompPax): void {
        try {
            var sDate = new Date();
            console.log('Get CompensationDetails Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            var date = this.FlightDate;
            var flightnumber = this.FlightNumber;
            var location = this.SearchFields.Location;
            this._shared.setFlightHeaderInfo(null);
            this._shared.setCompensationList(null);
            this._service.status(date, flightnumber,location).subscribe((data) => {
                if (data.BadRequest != 400) {
                    if (data.Flights != null) {
                        let status: any = data;
                        console.log("IN1" + JSON.stringify(status));
                        this._shared.setCompensationFlightDetails(status);
                        let flightStatus = Converters.convertToFlightHeaderInfo(status,ApplicationSettings.getString("SearchLocation",""));
                        this._shared.setFlightHeaderInfo(flightStatus);
                        console.log("before flight convertor");
                        console.log(ApplicationSettings.getString("SearchLocation",""));
                        let CompaxList = Converters.convertoCompensationPassengerList(CompPax, status,ApplicationSettings.getString("SearchLocation",""));
                        console.log("IN 1");
                        console.dir(CompaxList);
                        this._shared.setCompensationList(CompaxList);
                        if (this.PassengerType == CompensationSearchComponent.COMPENSATIONPRINTLISTPAX) {
                            this.naviagatetoCompensationPrintListwithtab();
                        } else {
                            this.naviagatetoCompensationListwithtab();
                        }
                        this.loaderProgress.hideLoader();
                    } else {
                        // let status: any = data;
                        // console.log("IN1" + JSON.stringify(data));
                        this._shared.setCompensationFlightDetails(data);
                        console.log("before flight convertor");
                        console.log(ApplicationSettings.getString("SearchLocation",""));
                        let CompaxList = Converters.convertoCompensationPassengerList(CompPax, data, ApplicationSettings.getString("SearchLocation",""));
                        this._shared.setCompensationList(CompaxList);
                        console.log("IN 2");
                        console.dir(CompaxList);
                        if (this.PassengerType == CompensationSearchComponent.COMPENSATIONPRINTLISTPAX) {
                            this.naviagatetoCompensationPrintListwithtab();
                        } else {
                            this.naviagatetoCompensationListwithtab();
                        }
                        this.loaderProgress.hideLoader();
                    }

                } else {
                    Toast.makeText(data.errMessage).show();
                    this.clear();
                    this.loaderProgress.hideLoader();
                }
            },
                err => {
                    console.log("Couldnt find information" + err);
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
    flightStatus(): void {
        try {
            var sDate = new Date();
            console.log('Get CompensationDetails Service --------------- Start Date Time : ' + sDate);
            this.loaderProgress.showLoader();
            var date = this.FlightDate;
            var flightnumber = this.FlightNumber;
            var location = this.SearchFields.Location;
            this._service.status(date, flightnumber,location).subscribe((data) => {
                if (data.Flights != null) {
                    let status: any = data
                    this._shared.setCompensationFlightDetails(status);
                    this.navigatetoCompensationSearchResult();
                    this.loaderProgress.hideLoader();
                } else {
                    this._shared.setCompensationFlightDetails(data);
                    this.navigatetoCompensationSearchResult();
                    this.loaderProgress.hideLoader();
                    // this.clear();
                    Toast.makeText(CompensationSearchComponent.FLIGHTNOTFOUNDTOAST).show();
                }
            },
                err => {
                    console.log("Couldnt find information" + err);
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
    getPassengerOrderDetails(orderID: string): void {
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetPassengerOrderDetails Service --------------- Start Date Time : ' + sDate);
            this._service.getPassengerByOrder(orderID)
                .subscribe(data => {
                    if (data.BadRequest == 400) {
                        console.log("1 bad");
                        Toast.makeText(data.ErrorMessage).show();
                    } else {
                        if (data.FlightSegments) {
                            let CompansationDetails: any = data;
                            console.dir(CompansationDetails);
                            // let CompensationPassengers: any = Converters.ConvertToCompPaxTemplateByOrderId(CompansationDetails);
                            // console.dir(CompensationPassengers);
                            this._shared.setCompensationOrderDeatils(CompansationDetails);
                            this.loaderProgress.hideLoader();
                            this.navigatetoCompensationSelectSegment();
                            var eDate = new Date();
                            console.log('Get GetPassengerOrderDetails Service --------------- End Date Time : ' + eDate);
                            console.log('Get GetPassengerOrderDetails Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
                        } else {
                            Toast.makeText(CompensationSearchComponent.RESERVATIONNOTFOUNDTOAST).show();
                            this.clear();
                            this.loaderProgress.hideLoader();
                        }
                    }
                },
                    err => {
                        console.log("Couldnt find information" + err);
                        this.handleServiceError(err);
                        this.loaderProgress.hideLoader();
                    });
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }

    }

    getPassengerETKTDetails(eticketNumber: string): void {
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetPassengerETKTDetails Service --------------- Start Date Time : ' + sDate);
            this._service.getETKT(eticketNumber)
                .subscribe(data => {
                    if (data.FlightSegments) {
                        let CompansationDetails: any = data;
                        console.dir(CompansationDetails);
                        this._shared.setCompensationOrderDeatils(CompansationDetails);
                        this.loaderProgress.hideLoader();
                        this.navigatetoCompensationSelectSegment();
                        var eDate = new Date();
                        console.log('Get GetPassengerOrderDetails Service --------------- End Date Time : ' + eDate);
                        console.log('Get GetPassengerOrderDetails Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
                    } else {
                        Toast.makeText(CompensationSearchComponent.RESERVATIONNOTFOUNDTOAST).show();
                        this.loaderProgress.hideLoader();
                        this.clear();
                    }
                },
                    err => {
                        console.log("Couldnt find information" + err);
                        this.handleServiceError(err);
                        this.loaderProgress.hideLoader();
                    });
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }

    }

    getPassengerFQTVDetails(fqtvNumber: string): void {
        try {
            this.loaderProgress.showLoader();
            var sDate = new Date();
            console.log('Get GetPassengerFQTVDetails Service --------------- Start Date Time : ' + sDate);
            this._service.getFQTV(fqtvNumber)
                .subscribe(data => {
                    console.log("FQTV" + JSON.stringify(data));
                    if (data.BadRequest == 400) {
                        Toast.makeText(data.errMessage).show();
                        this.clear();
                        this.loaderProgress.hideLoader();
                    }
                    else if (data.OrderFQTVStatus.length > 0) {
                        let CompansationFQTVDetails: Array<any> = [];
                        data.OrderFQTVStatus.forEach((segData, Index) => {
                            if (segData.FlightNumber != "") {
                                CompansationFQTVDetails.push(segData);
                            }
                        })
                        // if(data.OrderFQTVStatus)
                        if (CompansationFQTVDetails.length > 0) {
                            let CompensationFQTVStatus: any = Converters.ConvertToCompPaxTemplateByFQTV(CompansationFQTVDetails);
                            console.dir(CompensationFQTVStatus);
                            this._shared.setCompensationFQTVStatusDetails(CompensationFQTVStatus);
                            this.loaderProgress.hideLoader();
                            this.navigatetoCompensationFQTVList();
                            this.loaderProgress.hideLoader();
                        } else {
                            Toast.makeText("Segments not available").show();
                            this.loaderProgress.hideLoader();
                        }
                    } else {
                        Toast.makeText(CompensationSearchComponent.FQTVNOTFOUNDTOAST).show();
                        this.clear();
                        this.loaderProgress.hideLoader();
                    }
                    var eDate = new Date();
                    console.log('Get GetPassengerFQTVDetails Service --------------- End Date Time : ' + eDate);
                    console.log('Get GetPassengerFQTVDetails Service Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
                },
                    err => {
                        Toast.makeText(err).show();
                        console.log("Couldnt find information" + err);
                        this.handleServiceError(err);
                        this.loaderProgress.hideLoader();
                    });
        } catch (error) {
            console.log(error.message);
            this.loaderProgress.hideLoader();
        }

    }
    navigatetoCompensationSearchResult(): void {
        this.routerExtensions.navigate(["compensationresult"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }, queryParams: {
                "data": this.PassengerType
            }
        });

    }
    navigatetoCompensationSelectSegment() {
        this.routerExtensions.navigate(["compensationselectsegment"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }, queryParams: {
                "data": this.SearchFields.SearchAny
            }
        });
    }
    navigatetoCompensationFQTVList() {
        this.routerExtensions.navigate(["compensationfqtv"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }, queryParams: {
                "data": this.SearchFields.SearchAny
            }
        });
    }
    naviagatetoCompensationListwithtab() {
        this.routerExtensions.navigate(["compensationsearchresultwithtab"], {
            animated: true,
            transition: {
                name: "slide",
                duration: 600,
                curve: "linear"
            }
        });
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
    navigateToHome() {
        this.routerExtensions.navigate(["home"], {
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

