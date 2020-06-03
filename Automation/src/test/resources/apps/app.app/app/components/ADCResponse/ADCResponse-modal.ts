import { OnInit, NgModule, ChangeDetectorRef } from "@angular/core";
// import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { ListView, ItemEventData } from "ui/list-view";
import { Page } from "ui/page";
import * as Toast from 'nativescript-toast';
import {ADCResponse} from '../../shared/model/apis.model'

@Component({
    moduleId: module.id,
    templateUrl: "./ADCResponse-modal.html",
    styleUrls: ["./ADCResponse-modal.css"]
})
export class ADCResponseComponent implements OnInit {
    public Response:any;
    public ADCResponse:Array<any>;
    public Name:any;
    public Nationality:any;
    public DecisionArray:any =[];
    public Description:Array<any>=[{DecisionMessage:[]}];
    public OrderID:string;
    public icon:Array<any>;
    constructor(private params: ModalDialogParams, private page: Page) {
        console.log(params.context)
        this.Response = params.context[0]
        this.OrderID=params.context[1]
        this.ADCResponse=[];
        this.icon=[];
        // if(this.Response.ApisStatusList.length>1){
        //     this.ADCResponse = this.Response.ApisStatusList[1].AdcStatus;
        //     this.Nationality = this.Response.ApisStatusList[1].Nationality;
        //     this.Name = this.Response.ApisStatusList[1].LastName+"/"+this.Response.ApisStatusList[1].FirstName;
        //     this.DecisionArray = this.Response.ApisStatusList[1].Decisions;
        // }else{
        //     this.ADCResponse = this.Response.ApisStatusList[0].AdcStatus;
        //     this.Nationality = this.Response.ApisStatusList[0].Nationality;
        //     this.Name = this.Response.ApisStatusList[0].LastName+"/"+this.Response.ApisStatusList[0].FirstName;
        //     this.DecisionArray = this.Response.ApisStatusList[0].Decisions;
        // }

        this.Response.ApisStatusList.forEach((apisStatus,index)=>{

            switch(apisStatus.AdcStatus){
                case "NOTOK": this.ADCResponse.push("NOT OK");
                    // this.ADCResponse[index].Color = "#DA3923"
                    // this.icon.push("&#xE8B2;")
                    // this.icon[index].Color = "#DA3923"
                    break;
                case "ERR": this.ADCResponse.push("ERROR");
                    // this.ADCResponse[index].Color = "#DA3923"
                    // this.icon.push("&#xE8B2;")
                    // this.icon[index].Color = "#DA3923"
                    break;
                case "COK": this.ADCResponse.push("Conditional OK");
                    // this.ADCResponse[index].Color = "#19A874"
                    // this.icon.push("&#xE876;")
                    // this.icon[index].Color = "#19A874"
                    break;
                case "OK": this.ADCResponse.push("OK");
                    // this.ADCResponse[index].Color = "#19A874"
                    // this.icon[index].Color = "#19A874"
                    // this.icon.push("&#xE876;")
                default: 
                    // this.icon.push("&#xE876;")
                    this.ADCResponse.push(apisStatus.AdcStatus);

            }
            console.log(this.ADCResponse)
        })
    }
    ngOnInit(){
        if(this.Response.Errors!=null && this.Response.Errors.length>0){
            this.Response.Errors.forEach((element, index) => {
                // if(this.Description.length > 0)
                // {
                //     if(this.Description[index]!=null && this.Description[index].DecisionMessage != null)
                //     {
                //         this.Description[index].DecisionMessage.push(element.Message);  
                //     }
                    
                // }else{
                    this.Description.push({DecisionMessage:[]});
                    this.Description[index].DecisionMessage.push(element.Message);
                // }           
            }); 
            console.dir(this.Description);
        }else{
           console.log("this.Description");           
            this.Response.ApisStatusList.forEach((ApisStatus,indexs)=>{
                ApisStatus.Decisions.forEach((element,ind) => {
                    if(element.DecisionMessage!=""){
                        this.Description.push({DecisionMessage:[]});
                        this.Description[indexs].DecisionMessage.push(element.DecisionMessage)
                    }
                    if(element.ConditionsList!=null){
                     element.ConditionsList.forEach((list,index) => {
                        this.Description.push({DecisionMessage:[]});                        
                        this.Description[indexs].DecisionMessage.push(list);
                     });
                    } 
                });
            })
           console.dir(this.Description);
        }
    }
    close(){
        this.params.closeCallback(); 
    }



}