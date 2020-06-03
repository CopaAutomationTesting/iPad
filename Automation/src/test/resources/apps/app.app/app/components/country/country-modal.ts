//angular & nativescript references
import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { ListView, ItemEventData } from "ui/list-view";
import {ObservableArray} from "data/observable-array"


@Component({
    moduleId: module.id,
    templateUrl: "./country-modal.html"
})
export class CreatingListPickerComponent implements OnInit {
    public filteredCountryList: Array<string> = [];
    public fCountryList: ObservableArray<string>;
    public countryList: Array<string>;
    public picked: string = "";
    public Search: string = "";
    constructor(private params: ModalDialogParams) {
        this.countryList = this.params.context[0].country;   
        this.filteredCountryList = this.countryList;
        
    }

    ngOnInit() {
        this.countryList = this.params.context[0].country;
        console.dir(this.countryList);
        // this.fCountryList.push(this.countryList);
        this.filteredCountryList = this.countryList;
    }

    onChange(args: any) {
        this.filteredCountryList = this.countryList.filter(m => m.toLocaleLowerCase().indexOf(this.Search.toLocaleLowerCase())>= 0);
    }
    public selected(picker: ItemEventData) {
        let countryName = picker.view.bindingContext;
        if (countryName != "Select" && countryName != "Cancel") {
            this.picked = picker.view.bindingContext;
        }
        else {
            this.picked = "";
        }
        this.params.closeCallback(this.picked);
    }
    cancel(){
        this.params.closeCallback(); 
    }

}
