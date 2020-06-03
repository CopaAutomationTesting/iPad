//angular & nativescript references
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as dialogs from "ui/dialogs";
import { RouterExtensions, } from "nativescript-angular/router";

//app references
import { Passenger } from '../interface/index';
import { Configuration } from '../../app.constants';
import { AppExecutiontime } from "../../app.executiontime";
import * as Toast from 'nativescript-toast';

@Injectable()
export class TimeOutService {
    constructor(private routerExtensions: RouterExtensions) {

    }
    public timer: number = 0;
    public id: any;
    public static TIMER_DURATION:number = 1800000;
    public static WARNING_DURATION:number = 60000;

    public getTimer(): number {
        return this.timer;
    }

    public setTimer(timer: number) {
        this.timer = timer;
    }

    public startWatch() {
        var self = this;
        this.timer = TimeOutService.TIMER_DURATION;
        this.id = setInterval(() => {
            this.timer--;
            // console.log(this.timer);
            if (this.timer == 0) {
                dialogs.alert({
                    title: "Session Time OUT",
                    message: "Your session has timed out. Please login again.",
                    okButtonText: "Ok",
                }).then(function (result) {
                    // result argument is boolean
                        console.log("called");
                        clearInterval(self.id);
                        self.routerExtensions.navigate([""]);
                });
            }else if (this.timer == TimeOutService.WARNING_DURATION){
                Toast.makeText("Your session will expire in "+ TimeOutService.WARNING_DURATION+ " seconds").show();
            }
        }, 1000);


    }
    public resetWatch() {
        this.timer = TimeOutService.TIMER_DURATION;;
    }
    public stopWatch() {
        const id = setInterval(() => {
            clearInterval(this.id);
        }, 50);
    }

}