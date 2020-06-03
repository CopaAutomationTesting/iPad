"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var CreatingListPickComponent = /** @class */ (function () {
    function CreatingListPickComponent(params) {
        this.params = params;
        this.FQTVList = params.context;
    }
    CreatingListPickComponent.prototype.onChange = function (args) {
        if (args.length > 3) {
            var array = this.FQTVList.filter(function (m) { return m.toString().concat(args); });
            console.dir(array);
        }
    };
    CreatingListPickComponent.prototype.selected = function (picker) {
        console.log("picker selection: " + picker);
        var countryName = picker.view.bindingContext;
        if (countryName != "Select") {
            this.picked = picker.view.bindingContext;
        }
        else {
            this.picked = "";
        }
        this.params.closeCallback(this.picked);
    };
    CreatingListPickComponent.prototype.cancel = function () {
        this.params.closeCallback();
    };
    CreatingListPickComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: "./fqtv-modal.html"
        }),
        __metadata("design:paramtypes", [modal_dialog_1.ModalDialogParams])
    ], CreatingListPickComponent);
    return CreatingListPickComponent;
}());
exports.CreatingListPickComponent = CreatingListPickComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnF0di1tb2RhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZxdHYtbW9kYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsc0NBQTBDO0FBQzFDLGtFQUFzRTtBQVd0RTtJQUtJLG1DQUFvQixNQUF5QjtRQUF6QixXQUFNLEdBQU4sTUFBTSxDQUFtQjtRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDbkMsQ0FBQztJQUNELDRDQUFRLEdBQVIsVUFBUyxJQUFTO1FBQ2QsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNqQixJQUFJLEtBQUssR0FBa0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUF6QixDQUF5QixDQUFDLENBQUM7WUFDaEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0QjtJQUNMLENBQUM7SUFDTSw0Q0FBUSxHQUFmLFVBQWdCLE1BQXFCO1FBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDM0MsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDN0MsSUFBSSxXQUFXLElBQUksUUFBUSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDNUM7YUFDSTtZQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1NBQ3BCO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDRCwwQ0FBTSxHQUFOO1FBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBM0JRLHlCQUF5QjtRQU5yQyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSxtQkFBbUI7U0FDbkMsQ0FBQzt5Q0FROEIsZ0NBQWlCO09BTHBDLHlCQUF5QixDQTRCckM7SUFBRCxnQ0FBQztDQUFBLEFBNUJELElBNEJDO0FBNUJZLDhEQUF5QiIsInNvdXJjZXNDb250ZW50IjpbIi8vYW5ndWxhciAmIG5hdGl2ZXNjcmlwdCByZWZlcmVuY2VzXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgTW9kYWxEaWFsb2dQYXJhbXMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nXCI7XG5pbXBvcnQgeyBMaXN0VmlldywgSXRlbUV2ZW50RGF0YSB9IGZyb20gXCJ1aS9saXN0LXZpZXdcIjtcblxuXG5cbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9mcXR2LW1vZGFsLmh0bWxcIlxufSlcblxuXG5leHBvcnQgY2xhc3MgQ3JlYXRpbmdMaXN0UGlja0NvbXBvbmVudCB7XG5cbiAgICBwdWJsaWMgRlFUVkxpc3Q6IEFycmF5PHN0cmluZz47XG4gICAgcHVibGljIHBpY2tlZDogc3RyaW5nO1xuICAgIHB1YmxpYyBTZWFyY2g6IHN0cmluZztcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhcmFtczogTW9kYWxEaWFsb2dQYXJhbXMpIHtcbiAgICAgICAgdGhpcy5GUVRWTGlzdCA9IHBhcmFtcy5jb250ZXh0O1xuICAgIH1cbiAgICBvbkNoYW5nZShhcmdzOiBhbnkpIHtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgbGV0IGFycmF5OiBBcnJheTxzdHJpbmc+ID0gdGhpcy5GUVRWTGlzdC5maWx0ZXIobSA9PiBtLnRvU3RyaW5nKCkuY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKGFycmF5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgc2VsZWN0ZWQocGlja2VyOiBJdGVtRXZlbnREYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicGlja2VyIHNlbGVjdGlvbjogXCIgKyBwaWNrZXIpO1xuICAgICAgICBsZXQgY291bnRyeU5hbWUgPSBwaWNrZXIudmlldy5iaW5kaW5nQ29udGV4dDtcbiAgICAgICAgaWYgKGNvdW50cnlOYW1lICE9IFwiU2VsZWN0XCIpIHtcbiAgICAgICAgICAgIHRoaXMucGlja2VkID0gcGlja2VyLnZpZXcuYmluZGluZ0NvbnRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBpY2tlZCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXJhbXMuY2xvc2VDYWxsYmFjayh0aGlzLnBpY2tlZCk7XG4gICAgfVxuICAgIGNhbmNlbCgpe1xuICAgICAgICB0aGlzLnBhcmFtcy5jbG9zZUNhbGxiYWNrKCk7IFxuICAgIH1cbn1cbiJdfQ==