//angular & nativescript references
import { Component, OnInit, NgModule, ChangeDetectorRef } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { PropertyChangeData } from "data/observable";
import { Observable } from "data/observable";
import { DatePicker } from "ui/date-picker";
import { Page } from "ui/page";

@Component({
    moduleId: module.id,
    templateUrl: "./modal-view.html",
    styleUrls: ["./modal-view.css"],
})
export class ModalViewComponent implements OnInit {
    public currentdate: Date;
    public nowdate: Date;
    public yesterday: Date;
    public tomorrow: Date;
    public thedays = ["Yesterday", "Today", "Tomorrow"];
    public theday: string = this.thedays[0];

    constructor(private params: ModalDialogParams, private page: Page, private ref: ChangeDetectorRef) {
        this.currentdate = new Date(params.context);
        this.nowdate = new Date();
        this.yesterday = new Date("01/01/1990")//new Date(this.nowdate.getFullYear(), this.nowdate.getMonth(), this.nowdate.getDate() - 1)
        this.tomorrow = new Date("01/01/2100"); //new Date(this.nowdate.getFullYear(), this.nowdate.getMonth(), this.nowdate.getDate() + 1);
        this.gettheDay(this.currentdate);
    }

    ngOnInit() {
        let datePicker: DatePicker = <DatePicker>this.page.getViewById<DatePicker>("datePicker");
        datePicker.year = this.currentdate.getFullYear();
        datePicker.month = this.currentdate.getMonth() + 1;
        datePicker.day = this.currentdate.getDate();
        datePicker.minDate = this.yesterday;
        datePicker.maxDate = this.tomorrow;
        datePicker.addEventListener(Observable.propertyChangeEvent, ( ) => {
            this.gettheDay(datePicker.date);
            console.log(this.theday);
            this.ref.detectChanges();
        })
    }

    public gettheDay( date1: Date) {
        if (date1.getDate() === this.yesterday.getDate()) {
            this.theday = this.thedays[0];
        }
        else if (date1.getDate() === this.tomorrow.getDate()) {
            this.theday = this.thedays[2];
        }
        else {
            this.theday = this.thedays[1];
        }
    }

    public submit() {
        let datePicker: DatePicker = <DatePicker>this.page.getViewById<DatePicker>("datePicker");
        this.params.closeCallback(datePicker.date);
    }
}

