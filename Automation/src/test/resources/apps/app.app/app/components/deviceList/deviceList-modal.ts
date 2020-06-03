//angular & nativescript references
import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { ListView, ItemEventData } from "ui/list-view";
import * as Toast from 'nativescript-toast';

@Component({
    moduleId: module.id,
    templateUrl: "./deviceList-modal.html"
})


export class DeviceListPickComponent {
    public DeviceList:any;
    public newDeviceList:any;
    public SelectedDevice : any;
   
    constructor(private params: ModalDialogParams) {
        this.DeviceList = params.context;
        this.newDeviceList = this.DeviceList;
        console.dir(this.DeviceList);
        console.log(JSON.stringify(this.DeviceList.workstation));
    }
    
 public SelectPrinter(picker: any) {
       
        let deviceName = picker.DeviceName;
        console.log(deviceName);
        if (deviceName != "") {
            this.SelectedDevice = picker;
            console.log(this.SelectedDevice);
        }
        this.params.closeCallback(this.SelectedDevice);
    }
    cancel(){
        this.params.closeCallback(); 
    }
}
