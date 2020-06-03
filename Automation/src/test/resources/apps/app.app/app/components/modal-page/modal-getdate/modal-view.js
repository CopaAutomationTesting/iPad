"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var observable_1 = require("data/observable");
var page_1 = require("ui/page");
var ModalViewComponent = /** @class */ (function () {
    function ModalViewComponent(params, page, ref) {
        this.params = params;
        this.page = page;
        this.ref = ref;
        this.thedays = ["Yesterday", "Today", "Tomorrow"];
        this.theday = this.thedays[0];
        this.currentdate = new Date(params.context);
        this.nowdate = new Date();
        this.yesterday = new Date("01/01/1990"); //new Date(this.nowdate.getFullYear(), this.nowdate.getMonth(), this.nowdate.getDate() - 1)
        this.tomorrow = new Date("01/01/2100"); //new Date(this.nowdate.getFullYear(), this.nowdate.getMonth(), this.nowdate.getDate() + 1);
        this.gettheDay(this.currentdate);
    }
    ModalViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        var datePicker = this.page.getViewById("datePicker");
        datePicker.year = this.currentdate.getFullYear();
        datePicker.month = this.currentdate.getMonth() + 1;
        datePicker.day = this.currentdate.getDate();
        datePicker.minDate = this.yesterday;
        datePicker.maxDate = this.tomorrow;
        datePicker.addEventListener(observable_1.Observable.propertyChangeEvent, function () {
            _this.gettheDay(datePicker.date);
            console.log(_this.theday);
            _this.ref.detectChanges();
        });
    };
    ModalViewComponent.prototype.gettheDay = function (date1) {
        if (date1.getDate() === this.yesterday.getDate()) {
            this.theday = this.thedays[0];
        }
        else if (date1.getDate() === this.tomorrow.getDate()) {
            this.theday = this.thedays[2];
        }
        else {
            this.theday = this.thedays[1];
        }
    };
    ModalViewComponent.prototype.submit = function () {
        var datePicker = this.page.getViewById("datePicker");
        this.params.closeCallback(datePicker.date);
    };
    ModalViewComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: "./modal-view.html",
            styleUrls: ["./modal-view.css"],
        }),
        __metadata("design:paramtypes", [modal_dialog_1.ModalDialogParams, page_1.Page, core_1.ChangeDetectorRef])
    ], ModalViewComponent);
    return ModalViewComponent;
}());
exports.ModalViewComponent = ModalViewComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtdmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1vZGFsLXZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsc0NBQStFO0FBQy9FLGtFQUFzRTtBQUV0RSw4Q0FBNkM7QUFFN0MsZ0NBQStCO0FBTy9CO0lBUUksNEJBQW9CLE1BQXlCLEVBQVUsSUFBVSxFQUFVLEdBQXNCO1FBQTdFLFdBQU0sR0FBTixNQUFNLENBQW1CO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFVLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBSDFGLFlBQU8sR0FBRyxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDN0MsV0FBTSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFHcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUEsQ0FBQSwyRkFBMkY7UUFDbEksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLDRGQUE0RjtRQUNwSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQscUNBQVEsR0FBUjtRQUFBLGlCQVlDO1FBWEcsSUFBSSxVQUFVLEdBQTJCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFhLFlBQVksQ0FBQyxDQUFDO1FBQ3pGLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNqRCxVQUFVLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELFVBQVUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM1QyxVQUFVLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDcEMsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ25DLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBVSxDQUFDLG1CQUFtQixFQUFFO1lBQ3hELEtBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLEtBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRU0sc0NBQVMsR0FBaEIsVUFBa0IsS0FBVztRQUN6QixJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzlDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqQzthQUNJLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDbEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pDO2FBQ0k7WUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDakM7SUFDTCxDQUFDO0lBRU0sbUNBQU0sR0FBYjtRQUNJLElBQUksVUFBVSxHQUEyQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBYSxZQUFZLENBQUMsQ0FBQztRQUN6RixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQTdDUSxrQkFBa0I7UUFMOUIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUsbUJBQW1CO1lBQ2hDLFNBQVMsRUFBRSxDQUFDLGtCQUFrQixDQUFDO1NBQ2xDLENBQUM7eUNBUzhCLGdDQUFpQixFQUFnQixXQUFJLEVBQWUsd0JBQWlCO09BUnhGLGtCQUFrQixDQThDOUI7SUFBRCx5QkFBQztDQUFBLEFBOUNELElBOENDO0FBOUNZLGdEQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8vYW5ndWxhciAmIG5hdGl2ZXNjcmlwdCByZWZlcmVuY2VzXHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBOZ01vZHVsZSwgQ2hhbmdlRGV0ZWN0b3JSZWYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBNb2RhbERpYWxvZ1BhcmFtcyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9tb2RhbC1kaWFsb2dcIjtcclxuaW1wb3J0IHsgUHJvcGVydHlDaGFuZ2VEYXRhIH0gZnJvbSBcImRhdGEvb2JzZXJ2YWJsZVwiO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSBcImRhdGEvb2JzZXJ2YWJsZVwiO1xyXG5pbXBvcnQgeyBEYXRlUGlja2VyIH0gZnJvbSBcInVpL2RhdGUtcGlja2VyXCI7XHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9tb2RhbC12aWV3Lmh0bWxcIixcclxuICAgIHN0eWxlVXJsczogW1wiLi9tb2RhbC12aWV3LmNzc1wiXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIE1vZGFsVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgICBwdWJsaWMgY3VycmVudGRhdGU6IERhdGU7XHJcbiAgICBwdWJsaWMgbm93ZGF0ZTogRGF0ZTtcclxuICAgIHB1YmxpYyB5ZXN0ZXJkYXk6IERhdGU7XHJcbiAgICBwdWJsaWMgdG9tb3Jyb3c6IERhdGU7XHJcbiAgICBwdWJsaWMgdGhlZGF5cyA9IFtcIlllc3RlcmRheVwiLCBcIlRvZGF5XCIsIFwiVG9tb3Jyb3dcIl07XHJcbiAgICBwdWJsaWMgdGhlZGF5OiBzdHJpbmcgPSB0aGlzLnRoZWRheXNbMF07XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYXJhbXM6IE1vZGFsRGlhbG9nUGFyYW1zLCBwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgcmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xyXG4gICAgICAgIHRoaXMuY3VycmVudGRhdGUgPSBuZXcgRGF0ZShwYXJhbXMuY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5ub3dkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLnllc3RlcmRheSA9IG5ldyBEYXRlKFwiMDEvMDEvMTk5MFwiKS8vbmV3IERhdGUodGhpcy5ub3dkYXRlLmdldEZ1bGxZZWFyKCksIHRoaXMubm93ZGF0ZS5nZXRNb250aCgpLCB0aGlzLm5vd2RhdGUuZ2V0RGF0ZSgpIC0gMSlcclxuICAgICAgICB0aGlzLnRvbW9ycm93ID0gbmV3IERhdGUoXCIwMS8wMS8yMTAwXCIpOyAvL25ldyBEYXRlKHRoaXMubm93ZGF0ZS5nZXRGdWxsWWVhcigpLCB0aGlzLm5vd2RhdGUuZ2V0TW9udGgoKSwgdGhpcy5ub3dkYXRlLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIHRoaXMuZ2V0dGhlRGF5KHRoaXMuY3VycmVudGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGxldCBkYXRlUGlja2VyOiBEYXRlUGlja2VyID0gPERhdGVQaWNrZXI+dGhpcy5wYWdlLmdldFZpZXdCeUlkPERhdGVQaWNrZXI+KFwiZGF0ZVBpY2tlclwiKTtcclxuICAgICAgICBkYXRlUGlja2VyLnllYXIgPSB0aGlzLmN1cnJlbnRkYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgZGF0ZVBpY2tlci5tb250aCA9IHRoaXMuY3VycmVudGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgICAgICAgZGF0ZVBpY2tlci5kYXkgPSB0aGlzLmN1cnJlbnRkYXRlLmdldERhdGUoKTtcclxuICAgICAgICBkYXRlUGlja2VyLm1pbkRhdGUgPSB0aGlzLnllc3RlcmRheTtcclxuICAgICAgICBkYXRlUGlja2VyLm1heERhdGUgPSB0aGlzLnRvbW9ycm93O1xyXG4gICAgICAgIGRhdGVQaWNrZXIuYWRkRXZlbnRMaXN0ZW5lcihPYnNlcnZhYmxlLnByb3BlcnR5Q2hhbmdlRXZlbnQsICggKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0dGhlRGF5KGRhdGVQaWNrZXIuZGF0ZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMudGhlZGF5KTtcclxuICAgICAgICAgICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldHRoZURheSggZGF0ZTE6IERhdGUpIHtcclxuICAgICAgICBpZiAoZGF0ZTEuZ2V0RGF0ZSgpID09PSB0aGlzLnllc3RlcmRheS5nZXREYXRlKCkpIHtcclxuICAgICAgICAgICAgdGhpcy50aGVkYXkgPSB0aGlzLnRoZWRheXNbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGRhdGUxLmdldERhdGUoKSA9PT0gdGhpcy50b21vcnJvdy5nZXREYXRlKCkpIHtcclxuICAgICAgICAgICAgdGhpcy50aGVkYXkgPSB0aGlzLnRoZWRheXNbMl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnRoZWRheSA9IHRoaXMudGhlZGF5c1sxXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN1Ym1pdCgpIHtcclxuICAgICAgICBsZXQgZGF0ZVBpY2tlcjogRGF0ZVBpY2tlciA9IDxEYXRlUGlja2VyPnRoaXMucGFnZS5nZXRWaWV3QnlJZDxEYXRlUGlja2VyPihcImRhdGVQaWNrZXJcIik7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMuY2xvc2VDYWxsYmFjayhkYXRlUGlja2VyLmRhdGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG4iXX0=