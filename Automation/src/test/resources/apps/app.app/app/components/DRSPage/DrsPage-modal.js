"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { ModalDialogParams } from "nativescript-angular/modal-dialog";
var core_1 = require("@angular/core");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var page_1 = require("ui/page");
var DRSComponent = /** @class */ (function () {
    function DRSComponent(params, page) {
        this.params = params;
        this.page = page;
        console.log(params.context);
        this.content = params.context[0];
        this.pageName = params.context[1];
        this.subjectName = params.context[2];
        this.categoryName = params.context[3];
    }
    DRSComponent.prototype.ngOnInit = function () {
    };
    DRSComponent.prototype.close = function () {
        this.params.closeCallback();
    };
    DRSComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: "./DrsPage-modal.html",
            styleUrls: ["./DrsPage-modal.css"]
        }),
        __metadata("design:paramtypes", [modal_dialog_1.ModalDialogParams, page_1.Page])
    ], DRSComponent);
    return DRSComponent;
}());
exports.DRSComponent = DRSComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHJzUGFnZS1tb2RhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkRyc1BhZ2UtbW9kYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx5RUFBeUU7QUFDekUsc0NBQTBDO0FBQzFDLGtFQUFzRTtBQUV0RSxnQ0FBK0I7QUFRL0I7SUFLSSxzQkFBb0IsTUFBeUIsRUFBVSxJQUFVO1FBQTdDLFdBQU0sR0FBTixNQUFNLENBQW1CO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUM3RCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxXQUFXLEdBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsWUFBWSxHQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUNELCtCQUFRLEdBQVI7SUFFQSxDQUFDO0lBQ0QsNEJBQUssR0FBTDtRQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQWpCUSxZQUFZO1FBTHhCLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLHNCQUFzQjtZQUNuQyxTQUFTLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztTQUNyQyxDQUFDO3lDQU04QixnQ0FBaUIsRUFBZ0IsV0FBSTtPQUx4RCxZQUFZLENBbUJ4QjtJQUFELG1CQUFDO0NBQUEsQUFuQkQsSUFtQkM7QUFuQlksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPbkluaXQsIE5nTW9kdWxlLCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG4vLyBpbXBvcnQgeyBNb2RhbERpYWxvZ1BhcmFtcyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9tb2RhbC1kaWFsb2dcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBNb2RhbERpYWxvZ1BhcmFtcyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9tb2RhbC1kaWFsb2dcIjtcbmltcG9ydCB7IExpc3RWaWV3LCBJdGVtRXZlbnREYXRhIH0gZnJvbSBcInVpL2xpc3Qtdmlld1wiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJ1aS9wYWdlXCI7XG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICduYXRpdmVzY3JpcHQtdG9hc3QnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vRHJzUGFnZS1tb2RhbC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL0Ryc1BhZ2UtbW9kYWwuY3NzXCJdXG59KVxuZXhwb3J0IGNsYXNzIERSU0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgcHVibGljIGNvbnRlbnQ6YW55O1xuICAgIHB1YmxpYyBwYWdlTmFtZTpzdHJpbmc7XG4gICAgcHVibGljIHN1YmplY3ROYW1lOnN0cmluZztcbiAgICBwdWJsaWMgY2F0ZWdvcnlOYW1lOnN0cmluZztcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhcmFtczogTW9kYWxEaWFsb2dQYXJhbXMsIHByaXZhdGUgcGFnZTogUGFnZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhwYXJhbXMuY29udGV4dClcbiAgICAgICAgdGhpcy5jb250ZW50PXBhcmFtcy5jb250ZXh0WzBdO1xuICAgICAgICB0aGlzLnBhZ2VOYW1lPXBhcmFtcy5jb250ZXh0WzFdO1xuICAgICAgICB0aGlzLnN1YmplY3ROYW1lPXBhcmFtcy5jb250ZXh0WzJdO1xuICAgICAgICB0aGlzLmNhdGVnb3J5TmFtZT1wYXJhbXMuY29udGV4dFszXTtcbiAgICB9XG4gICAgbmdPbkluaXQoKXtcbiAgICAgICAgICBcbiAgICB9XG4gICAgY2xvc2UoKXtcbiAgICAgICAgdGhpcy5wYXJhbXMuY2xvc2VDYWxsYmFjaygpOyBcbiAgICB9XG5cbn0iXX0=