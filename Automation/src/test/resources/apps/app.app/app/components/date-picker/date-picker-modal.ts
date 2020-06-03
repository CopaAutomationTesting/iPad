//angular & nativescript references
import { Component, OnInit, NgModule, ChangeDetectorRef } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { PropertyChangeData } from "data/observable";
import { Observable } from "data/observable";
import { DatePicker } from "ui/date-picker";
import { Page } from "ui/page";


export class DatePicketContext{
    public currentDate:string;
    public minDate?:string;
    public maxDate?: string;
    public displayHeader:boolean = false;
}

@Component({
    moduleId: module.id,
    templateUrl: "./date-picker-modal.html",
    styleUrls: ["./date-picker-modal.css"],
})
export class DatePickerModal implements OnInit {
    public currentdate: Date;
    public nowdate: Date;
    public yesterday: Date;
    public tomorrow: Date;
    public thedays = ["Yesterday", "Today", "Tomorrow","TheDayAfter"];
    public theday: string = this.thedays[1];
    private datePickerContext: DatePicketContext = new DatePicketContext();
    private selectedDate: Date;
    private isSelected: boolean = false;

    constructor(private params: ModalDialogParams, private page: Page, private ref: ChangeDetectorRef) {
        this.datePickerContext = params.context;
        this.currentdate = new Date(this.datePickerContext.currentDate);
        this.nowdate = new Date();
        
        if(this.datePickerContext.displayHeader){
            this.yesterday = new Date(this.datePickerContext.minDate);
            this.tomorrow = new Date(this.datePickerContext.maxDate);
            this.gettheDay(this.currentdate);
        }
    }

    ngOnInit() {
        let datePicker: DatePicker = <DatePicker>this.page.getViewById<DatePicker>("datePicker");
        datePicker.year = this.currentdate.getFullYear();
        datePicker.month = this.currentdate.getMonth() + 1;
        datePicker.day = this.currentdate.getDate();
        var dp:UIDatePicker = datePicker.nativeView;
        this.selectedDate = new Date(this.datePickerContext.currentDate);
        // dp.minimumDate = new Date(this.datePickerContext.minDate);
        if(this.datePickerContext.minDate) {
            dp.minimumDate = new Date(this.datePickerContext.minDate);
            // datePicker.minDate = new Date(this.datePickerContext.minDate); 
        }
        if(this.datePickerContext.maxDate){
            dp.maximumDate = new Date(this.datePickerContext.maxDate);
            // datePicker.maxDate = new Date(this.datePickerContext.maxDate);
        }
        datePicker.addEventListener(Observable.propertyChangeEvent, ( ) => {
            if(this.datePickerContext.displayHeader) this.gettheDay(datePicker.date);
            console.log(this.theday);
            this.ref.detectChanges();
        })
    }

    public gettheDay( date1: any) {
        if (date1.getDate() === this.yesterday.getDate()) {
            this.theday = this.thedays[0];
        }
        else if (date1.getDate() === this.tomorrow.getDate()) {
            this.theday = this.thedays[2];
        }
        else  if (date1.getDate() === this.nowdate.getDate()) {
            this.theday = this.thedays[1];
        }
        else {
            this.theday = this.thedays[2];
        }
    }

    public isValidDate(){
        let datePicker: DatePicker = <DatePicker>this.page.getViewById<DatePicker>("datePicker");
        console.log(datePicker.date.toString())
        if(datePicker.date.toDateString() === "Invalid Date"){
            return false;
        }
        return true;
    }
    onDateChange(args){
        this.selectedDate = args.value;
        this.isSelected = true;
    }
    
    public submit() {
        // let datePicker: DatePicker = <DatePicker>this.page.getViewById<DatePicker>("datePicker");
        // if(this.selectedDate.getDate().toString() == "Invalid Date")
        // {
        //     this.selectedDate = new Date();
        // }
        if(this.selectedDate.toString() == "Invalid Date")
        {
            this.selectedDate = new Date(this.datePickerContext.currentDate);
        }
        this.params.closeCallback(this.selectedDate);
        
        console.log(this.selectedDate)
    }
    cancel(){
        this.params.closeCallback(); 
    }
}
