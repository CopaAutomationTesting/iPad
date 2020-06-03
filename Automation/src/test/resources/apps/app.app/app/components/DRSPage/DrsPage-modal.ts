import { OnInit, NgModule, ChangeDetectorRef } from "@angular/core";
// import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { ListView, ItemEventData } from "ui/list-view";
import { Page } from "ui/page";
import * as Toast from 'nativescript-toast';

@Component({
    moduleId: module.id,
    templateUrl: "./DrsPage-modal.html",
    styleUrls: ["./DrsPage-modal.css"]
})
export class DRSComponent implements OnInit {
    public content:any;
    public pageName:string;
    public subjectName:string;
    public categoryName:string;
    constructor(private params: ModalDialogParams, private page: Page) {
        console.log(params.context)
        this.content=params.context[0];
        this.pageName=params.context[1];
        this.subjectName=params.context[2];
        this.categoryName=params.context[3];
    }
    ngOnInit(){
          
    }
    close(){
        this.params.closeCallback(); 
    }

}