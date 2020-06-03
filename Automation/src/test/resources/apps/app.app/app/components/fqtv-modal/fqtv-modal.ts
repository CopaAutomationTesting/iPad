//angular & nativescript references
import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { ListView, ItemEventData } from "ui/list-view";



@Component({
    moduleId: module.id,
    templateUrl: "./fqtv-modal.html"
})


export class CreatingListPickComponent {

    public FQTVList: Array<string>;
    public picked: string;
    public Search: string;
    constructor(private params: ModalDialogParams) {
        this.FQTVList = params.context;
    }
    onChange(args: any) {
        if (args.length > 3) {
            let array: Array<string> = this.FQTVList.filter(m => m.toString().concat(args));
            console.dir(array);
        }
    }
    public selected(picker: ItemEventData) {
        console.log("picker selection: " + picker);
        let countryName = picker.view.bindingContext;
        if (countryName != "Select") {
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
