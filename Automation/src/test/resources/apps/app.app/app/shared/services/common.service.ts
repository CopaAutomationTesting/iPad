//angular & nativescript references
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import * as dialogs from "ui/dialogs"
import { ListView, ItemEventData } from "ui/list-view";
import { Page } from "ui/page";
import { SwipeGestureEventData } from "ui/gestures";

//external modules and plugins
import * as ApplicationSettings from "application-settings";
import * as Toast from 'nativescript-toast';
import * as moment from "moment";

//app references
import { DataService, PassengerService, CheckinOrderService } from "../../shared/services/index";
import { Passenger,Order, SecurityValidation, CountryCollection, Inventory, FqtvPrograms,FQTV,Departures, DocumentType } from "../../shared/model/index"
import { PaxTemplate, PassengerCheckin, InBound,FlightInfo,MultiSegmentTemplate,FQTVInfo, FQTVPro,CheckInPostTemplate,DepartureInfo, OutBound,LoaderProgress,Document, PhoneNumber, Address, ApisRequirement,SecurityModel,EmergencyDetail,EmergencyPhone } from '../../shared/interface/index';
import { Converters } from "../../shared/utils/index";
import { AppExecutiontime } from "../../app.executiontime";
import { Configuration } from '../../app.constants';

@Component({
    providers: [DataService, PassengerService, Configuration]
})

export class Common {
      
    public isError: boolean;
    public errorMessage: string;
    public PassengerArray: Array<MultiSegmentTemplate.FlightWithPax> = [];
    public loaderProgress: LoaderProgress;
    public MultiSegmentPaxArray: MultiSegmentTemplate.RootObject = new MultiSegmentTemplate.RootObject;
    private routerExtensions: RouterExtensions;
    constructor(private _service : PassengerService,private _shared : CheckinOrderService,private _dataService : DataService,private activatedRouter: ActivatedRoute)
    {
        this.isError = false;
        this.errorMessage = "";
        this.loaderProgress = new LoaderProgress();
    }

 


}


