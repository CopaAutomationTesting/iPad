"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var CreatingListPickerComponent = /** @class */ (function () {
    function CreatingListPickerComponent(params) {
        this.params = params;
        this.filteredCountryList = [];
        this.picked = "";
        this.Search = "";
        this.countryList = this.params.context[0].country;
        this.filteredCountryList = this.countryList;
    }
    CreatingListPickerComponent.prototype.ngOnInit = function () {
        this.countryList = this.params.context[0].country;
        console.dir(this.countryList);
        // this.fCountryList.push(this.countryList);
        this.filteredCountryList = this.countryList;
    };
    CreatingListPickerComponent.prototype.onChange = function (args) {
        var _this = this;
        this.filteredCountryList = this.countryList.filter(function (m) { return m.toLocaleLowerCase().indexOf(_this.Search.toLocaleLowerCase()) >= 0; });
    };
    CreatingListPickerComponent.prototype.selected = function (picker) {
        var countryName = picker.view.bindingContext;
        if (countryName != "Select" && countryName != "Cancel") {
            this.picked = picker.view.bindingContext;
        }
        else {
            this.picked = "";
        }
        this.params.closeCallback(this.picked);
    };
    CreatingListPickerComponent.prototype.cancel = function () {
        this.params.closeCallback();
    };
    CreatingListPickerComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: "./country-modal.html"
        }),
        __metadata("design:paramtypes", [modal_dialog_1.ModalDialogParams])
    ], CreatingListPickerComponent);
    return CreatingListPickerComponent;
}());
exports.CreatingListPickerComponent = CreatingListPickerComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyeS1tb2RhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvdW50cnktbW9kYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsc0NBQWtEO0FBQ2xELGtFQUFzRTtBQVN0RTtJQU1JLHFDQUFvQixNQUF5QjtRQUF6QixXQUFNLEdBQU4sTUFBTSxDQUFtQjtRQUx0Qyx3QkFBbUIsR0FBa0IsRUFBRSxDQUFDO1FBR3hDLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFDcEIsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUV2QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUNsRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUVoRCxDQUFDO0lBRUQsOENBQVEsR0FBUjtRQUNJLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzlCLDRDQUE0QztRQUM1QyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUNoRCxDQUFDO0lBRUQsOENBQVEsR0FBUixVQUFTLElBQVM7UUFBbEIsaUJBRUM7UUFERyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLElBQUcsQ0FBQyxFQUFsRSxDQUFrRSxDQUFDLENBQUM7SUFDaEksQ0FBQztJQUNNLDhDQUFRLEdBQWYsVUFBZ0IsTUFBcUI7UUFDakMsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDN0MsSUFBSSxXQUFXLElBQUksUUFBUSxJQUFJLFdBQVcsSUFBSSxRQUFRLEVBQUU7WUFDcEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztTQUM1QzthQUNJO1lBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7U0FDcEI7UUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNELDRDQUFNLEdBQU47UUFDSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFsQ1EsMkJBQTJCO1FBSnZDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLHNCQUFzQjtTQUN0QyxDQUFDO3lDQU84QixnQ0FBaUI7T0FOcEMsMkJBQTJCLENBb0N2QztJQUFELGtDQUFDO0NBQUEsQUFwQ0QsSUFvQ0M7QUFwQ1ksa0VBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiLy9hbmd1bGFyICYgbmF0aXZlc2NyaXB0IHJlZmVyZW5jZXNcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IE1vZGFsRGlhbG9nUGFyYW1zIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL21vZGFsLWRpYWxvZ1wiO1xuaW1wb3J0IHsgTGlzdFZpZXcsIEl0ZW1FdmVudERhdGEgfSBmcm9tIFwidWkvbGlzdC12aWV3XCI7XG5pbXBvcnQge09ic2VydmFibGVBcnJheX0gZnJvbSBcImRhdGEvb2JzZXJ2YWJsZS1hcnJheVwiXG5cblxuQENvbXBvbmVudCh7XG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2NvdW50cnktbW9kYWwuaHRtbFwiXG59KVxuZXhwb3J0IGNsYXNzIENyZWF0aW5nTGlzdFBpY2tlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgcHVibGljIGZpbHRlcmVkQ291bnRyeUxpc3Q6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICBwdWJsaWMgZkNvdW50cnlMaXN0OiBPYnNlcnZhYmxlQXJyYXk8c3RyaW5nPjtcbiAgICBwdWJsaWMgY291bnRyeUxpc3Q6IEFycmF5PHN0cmluZz47XG4gICAgcHVibGljIHBpY2tlZDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgU2VhcmNoOiBzdHJpbmcgPSBcIlwiO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyYW1zOiBNb2RhbERpYWxvZ1BhcmFtcykge1xuICAgICAgICB0aGlzLmNvdW50cnlMaXN0ID0gdGhpcy5wYXJhbXMuY29udGV4dFswXS5jb3VudHJ5OyAgIFxuICAgICAgICB0aGlzLmZpbHRlcmVkQ291bnRyeUxpc3QgPSB0aGlzLmNvdW50cnlMaXN0O1xuICAgICAgICBcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5jb3VudHJ5TGlzdCA9IHRoaXMucGFyYW1zLmNvbnRleHRbMF0uY291bnRyeTtcbiAgICAgICAgY29uc29sZS5kaXIodGhpcy5jb3VudHJ5TGlzdCk7XG4gICAgICAgIC8vIHRoaXMuZkNvdW50cnlMaXN0LnB1c2godGhpcy5jb3VudHJ5TGlzdCk7XG4gICAgICAgIHRoaXMuZmlsdGVyZWRDb3VudHJ5TGlzdCA9IHRoaXMuY291bnRyeUxpc3Q7XG4gICAgfVxuXG4gICAgb25DaGFuZ2UoYXJnczogYW55KSB7XG4gICAgICAgIHRoaXMuZmlsdGVyZWRDb3VudHJ5TGlzdCA9IHRoaXMuY291bnRyeUxpc3QuZmlsdGVyKG0gPT4gbS50b0xvY2FsZUxvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5TZWFyY2gudG9Mb2NhbGVMb3dlckNhc2UoKSk+PSAwKTtcbiAgICB9XG4gICAgcHVibGljIHNlbGVjdGVkKHBpY2tlcjogSXRlbUV2ZW50RGF0YSkge1xuICAgICAgICBsZXQgY291bnRyeU5hbWUgPSBwaWNrZXIudmlldy5iaW5kaW5nQ29udGV4dDtcbiAgICAgICAgaWYgKGNvdW50cnlOYW1lICE9IFwiU2VsZWN0XCIgJiYgY291bnRyeU5hbWUgIT0gXCJDYW5jZWxcIikge1xuICAgICAgICAgICAgdGhpcy5waWNrZWQgPSBwaWNrZXIudmlldy5iaW5kaW5nQ29udGV4dDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGlja2VkID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhcmFtcy5jbG9zZUNhbGxiYWNrKHRoaXMucGlja2VkKTtcbiAgICB9XG4gICAgY2FuY2VsKCl7XG4gICAgICAgIHRoaXMucGFyYW1zLmNsb3NlQ2FsbGJhY2soKTsgXG4gICAgfVxuXG59XG4iXX0=