//angular & nativescript references
import { OnInit, NgModule, ChangeDetectorRef } from "@angular/core";
// import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { ListView, ItemEventData } from "ui/list-view";
import { Page } from "ui/page";
import * as Toast from 'nativescript-toast';

@Component({
    moduleId: module.id,
    templateUrl: "./payment-modal.html",
    styleUrls: ["./payment-modal.css"]
})
export class PaymentComponent implements OnInit {
    public paymentType: string;
    public cardType: string;
    public cardNumber: string;
    public cvv: string;
    public expiryDate: string;
    public cardHolder: string;
    public isButtonEnabled: boolean;
    public address: string = "Ville";
    public city: string = "Chennai";
    public state: string = "";
    public country: string = "India";
    public zipcode: string = "600053";
    isCardNumber: boolean = false;
    mCard: boolean = false;
    vCard: boolean = false;
    aCard: boolean = false;
    constructor(private params: ModalDialogParams, private page: Page) {
        params.context.paymentType = "Credit Card"
        this.paymentType = params.context.paymentType;
        this.cardType = params.context[0].cardType;
        this.cardNumber = params.context[0].cardNumber;
        this.cvv = params.context[0].cvv;
        this.expiryDate = params.context[0].expiryDate;
        this.cardHolder = params.context[0].cardHolder;

        this.address = params.context.address;
        this.city = params.context.city;
        this.state = params.context.state;
        this.country = params.context.country;
        this.zipcode = params.context.zipcode;
    }

    ngOnInit() {

    }
    public submit() {
        if (this.cardNumber != "") {
            let paymentDetails: any = {
                "paymentType": "CC",
                "cardType": this.cardType,
                "cardNumber": this.cardNumber,
                "cvv": this.cvv,
                "expiryDate": this.expiryDate,
                "cardHolder": this.cardHolder,
                "address": this.address,
                "city": this.city,
                "state": this.state,
                "country": this.country,
                "zipcode": this.zipcode
            }
            this.params.closeCallback(paymentDetails);
        }
        else {
            if (this.cardNumber == "") {
                this.isCardNumber = true;
            }
            else this.isCardNumber = false;
            var reg = new RegExp('^[0-9]+$');
            var test = reg.test(this.cardNumber);
            if (test == false) {
                this.isCardNumber = true;
            }
        }
    }

    btnclicked(cardType: string) {
        if (cardType == "MCard") {
            this.mCard = true;
            this.vCard = false;
            this.aCard = false;
            this.cardType = "MC";
        }
        else if (cardType == "VCard") {
            this.mCard = false;
            this.vCard = true;
            this.aCard = false;
            this.cardType = "VC";
        }
        else if (cardType == "ACard") {
            this.mCard = false;
            this.vCard = false;
            this.aCard = true;
            this.cardType = "AX";
        }

        if ( this.zipcode == "" || this.country == "" || this.city == "" || this.address == ""|| this.cardHolder == "" || this.expiryDate == "" || this.cvv == "" || this.cardType == ""  || this.zipcode == null || this.country == null || this.city == null || this.address == null|| this.cardHolder == null || this.expiryDate == null || this.cvv == null || this.cardType == null ) {

            this.isButtonEnabled = false;
        } else {
            this.isButtonEnabled = true;
        }
    }
onChange(args: any, index: any) {
        console.log(index);
        switch (index) {
            case 0:
                if (this.paymentType == "") {
                    Toast.makeText("mandatory field shoud not be empty").show();
                }
                 
                break;
            case 1:
                if (this.cardType == ""){ 
                    Toast.makeText("mandatory field shoud not be empty").show();
                }
                
            case 2:
                if (this.cardNumber == ""){ 
                    Toast.makeText("mandatory field shoud not be empty").show();
                }
                
            case 3:
                if (this.cvv == ""){ 
                    Toast.makeText("mandatory field shoud not be empty").show();
                }
                
            case 4:
                if (this.expiryDate == ""){ 
                    Toast.makeText("mandatory field shoud not be empty").show();
                }
                
            case 5:
                if (this.cardHolder == ""){ 
                    Toast.makeText("mandatory field shoud not be empty").show();
                }
                
            case 6:
                if (this.address == ""){ 
                    Toast.makeText("mandatory field shoud not be empty").show();
                }
                
            case 7:
                if (this.city == ""){ 
                    Toast.makeText("mandatory field shoud not be empty").show();
                }

            case 8:
                if (this.state == ""){ 
                    Toast.makeText("mandatory field shoud not be empty").show();
                }
                
            case 9:
                if (this.country == ""){ 
                    Toast.makeText("mandatory field shoud not be empty").show();
                }
                
            case 10:
                if (this.zipcode == ""){ 
                    Toast.makeText("mandatory field shoud not be empty").show();
                }
                
            default:
                break;
        }
        if ( this.zipcode == "" || this.country == "" || this.city == "" || this.address == ""|| this.cardHolder == "" || this.expiryDate == "" || this.cvv == "" || this.cardType == "" || this.zipcode == null || this.country == null || this.city == null || this.address == null|| this.cardHolder == null || this.expiryDate == null || this.cvv == null || this.cardType == null ) {

            this.isButtonEnabled = false;
        } else {
            this.isButtonEnabled = true;
        }

    }
    cancel(){
        this.params.closeCallback(); 
    }

}
