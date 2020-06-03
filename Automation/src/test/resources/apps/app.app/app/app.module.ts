import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import {NativeScriptFormsModule} from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import {NativeScriptRouterModule} from "nativescript-angular/router";
import { AppRoutes, AppComponents } from "./components/app.routing";
import { DataService, CheckinOrderService, } from "./shared/services/index";
import { ModalDialogService } from "nativescript-angular/modal-dialog";
import { DatePickerModal, DatePicketContext } from "./components/date-picker/date-picker-modal";
import { CreatingListPickerComponent } from "./components/country/country-modal";
import { CreatingListPickComponent } from "./components/fqtv-modal/fqtv-modal";
import { DeviceListPickComponent } from "./components/deviceList/deviceList-modal";
import { PaymentComponent } from "./components/payment/payment-modal";
import { ADCResponseComponent } from "./components/ADCResponse/ADCResponse-modal";
import { DRSComponent } from "./components/DrsPage/DrsPage-modal";
import { AppComponent } from "./app.component";
import { registerElement } from "nativescript-angular/element-registry";
import { TimeOutService } from "./shared/services/timeOut.service";
import {LoginService } from "./shared/services/login.service";

@NgModule({
    declarations: [AppComponent, ...AppComponents,DatePickerModal,CreatingListPickerComponent,CreatingListPickComponent,PaymentComponent,DeviceListPickComponent,ADCResponseComponent,DRSComponent],
    bootstrap: [AppComponent],
    imports: [NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptHttpModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(AppRoutes)],
    schemas: [NO_ERRORS_SCHEMA],
     providers:[ModalDialogService,CheckinOrderService,TimeOutService,LoginService],
    entryComponents:[DatePickerModal,CreatingListPickerComponent,CreatingListPickComponent,PaymentComponent,DeviceListPickComponent,ADCResponseComponent,DRSComponent]
})
export class AppModule { }
