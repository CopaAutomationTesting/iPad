"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { ModalDialogParams } from "nativescript-angular/modal-dialog";
var core_1 = require("@angular/core");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var page_1 = require("ui/page");
var ADCResponseComponent = /** @class */ (function () {
    function ADCResponseComponent(params, page) {
        var _this = this;
        this.params = params;
        this.page = page;
        this.DecisionArray = [];
        this.Description = [{ DecisionMessage: [] }];
        console.log(params.context);
        this.Response = params.context[0];
        this.OrderID = params.context[1];
        this.ADCResponse = [];
        this.icon = [];
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
        this.Response.ApisStatusList.forEach(function (apisStatus, index) {
            switch (apisStatus.AdcStatus) {
                case "NOTOK":
                    _this.ADCResponse.push("NOT OK");
                    // this.ADCResponse[index].Color = "#DA3923"
                    // this.icon.push("&#xE8B2;")
                    // this.icon[index].Color = "#DA3923"
                    break;
                case "ERR":
                    _this.ADCResponse.push("ERROR");
                    // this.ADCResponse[index].Color = "#DA3923"
                    // this.icon.push("&#xE8B2;")
                    // this.icon[index].Color = "#DA3923"
                    break;
                case "COK":
                    _this.ADCResponse.push("Conditional OK");
                    // this.ADCResponse[index].Color = "#19A874"
                    // this.icon.push("&#xE876;")
                    // this.icon[index].Color = "#19A874"
                    break;
                case "OK": _this.ADCResponse.push("OK");
                // this.ADCResponse[index].Color = "#19A874"
                // this.icon[index].Color = "#19A874"
                // this.icon.push("&#xE876;")
                default:
                    // this.icon.push("&#xE876;")
                    _this.ADCResponse.push(apisStatus.AdcStatus);
            }
            console.log(_this.ADCResponse);
        });
    }
    ADCResponseComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.Response.Errors != null && this.Response.Errors.length > 0) {
            this.Response.Errors.forEach(function (element, index) {
                // if(this.Description.length > 0)
                // {
                //     if(this.Description[index]!=null && this.Description[index].DecisionMessage != null)
                //     {
                //         this.Description[index].DecisionMessage.push(element.Message);  
                //     }
                // }else{
                _this.Description.push({ DecisionMessage: [] });
                _this.Description[index].DecisionMessage.push(element.Message);
                // }           
            });
            console.dir(this.Description);
        }
        else {
            console.log("this.Description");
            this.Response.ApisStatusList.forEach(function (ApisStatus, indexs) {
                ApisStatus.Decisions.forEach(function (element, ind) {
                    if (element.DecisionMessage != "") {
                        _this.Description.push({ DecisionMessage: [] });
                        _this.Description[indexs].DecisionMessage.push(element.DecisionMessage);
                    }
                    if (element.ConditionsList != null) {
                        element.ConditionsList.forEach(function (list, index) {
                            _this.Description.push({ DecisionMessage: [] });
                            _this.Description[indexs].DecisionMessage.push(list);
                        });
                    }
                });
            });
            console.dir(this.Description);
        }
    };
    ADCResponseComponent.prototype.close = function () {
        this.params.closeCallback();
    };
    ADCResponseComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: "./ADCResponse-modal.html",
            styleUrls: ["./ADCResponse-modal.css"]
        }),
        __metadata("design:paramtypes", [modal_dialog_1.ModalDialogParams, page_1.Page])
    ], ADCResponseComponent);
    return ADCResponseComponent;
}());
exports.ADCResponseComponent = ADCResponseComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQURDUmVzcG9uc2UtbW9kYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJBRENSZXNwb25zZS1tb2RhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHlFQUF5RTtBQUN6RSxzQ0FBMEM7QUFDMUMsa0VBQXNFO0FBRXRFLGdDQUErQjtBQVMvQjtJQVNJLDhCQUFvQixNQUF5QixFQUFVLElBQVU7UUFBakUsaUJBK0NDO1FBL0NtQixXQUFNLEdBQU4sTUFBTSxDQUFtQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQU07UUFKMUQsa0JBQWEsR0FBTSxFQUFFLENBQUM7UUFDdEIsZ0JBQVcsR0FBWSxDQUFDLEVBQUMsZUFBZSxFQUFDLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFJakQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM5QixJQUFJLENBQUMsV0FBVyxHQUFDLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFDLEVBQUUsQ0FBQztRQUNiLDZDQUE2QztRQUM3QyxvRUFBb0U7UUFDcEUsc0VBQXNFO1FBQ3RFLDBHQUEwRztRQUMxRyxzRUFBc0U7UUFDdEUsU0FBUztRQUNULG9FQUFvRTtRQUNwRSxzRUFBc0U7UUFDdEUsMEdBQTBHO1FBQzFHLHNFQUFzRTtRQUN0RSxJQUFJO1FBRUosSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQUMsVUFBVSxFQUFDLEtBQUs7WUFFbEQsUUFBTyxVQUFVLENBQUMsU0FBUyxFQUFDO2dCQUN4QixLQUFLLE9BQU87b0JBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7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QUE7WUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUNoQztJQUNMLENBQUM7SUFDRCxvQ0FBSyxHQUFMO1FBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBOUZRLG9CQUFvQjtRQUxoQyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSwwQkFBMEI7WUFDdkMsU0FBUyxFQUFFLENBQUMseUJBQXlCLENBQUM7U0FDekMsQ0FBQzt5Q0FVOEIsZ0NBQWlCLEVBQWdCLFdBQUk7T0FUeEQsb0JBQW9CLENBa0doQztJQUFELDJCQUFDO0NBQUEsQUFsR0QsSUFrR0M7QUFsR1ksb0RBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT25Jbml0LCBOZ01vZHVsZSwgQ2hhbmdlRGV0ZWN0b3JSZWYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuLy8gaW1wb3J0IHsgTW9kYWxEaWFsb2dQYXJhbXMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nXCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgTW9kYWxEaWFsb2dQYXJhbXMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nXCI7XG5pbXBvcnQgeyBMaXN0VmlldywgSXRlbUV2ZW50RGF0YSB9IGZyb20gXCJ1aS9saXN0LXZpZXdcIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSAnbmF0aXZlc2NyaXB0LXRvYXN0JztcbmltcG9ydCB7QURDUmVzcG9uc2V9IGZyb20gJy4uLy4uL3NoYXJlZC9tb2RlbC9hcGlzLm1vZGVsJ1xuXG5AQ29tcG9uZW50KHtcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vQURDUmVzcG9uc2UtbW9kYWwuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogW1wiLi9BRENSZXNwb25zZS1tb2RhbC5jc3NcIl1cbn0pXG5leHBvcnQgY2xhc3MgQURDUmVzcG9uc2VDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHB1YmxpYyBSZXNwb25zZTphbnk7XG4gICAgcHVibGljIEFEQ1Jlc3BvbnNlOkFycmF5PGFueT47XG4gICAgcHVibGljIE5hbWU6YW55O1xuICAgIHB1YmxpYyBOYXRpb25hbGl0eTphbnk7XG4gICAgcHVibGljIERlY2lzaW9uQXJyYXk6YW55ID1bXTtcbiAgICBwdWJsaWMgRGVzY3JpcHRpb246QXJyYXk8YW55Pj1be0RlY2lzaW9uTWVzc2FnZTpbXX1dO1xuICAgIHB1YmxpYyBPcmRlcklEOnN0cmluZztcbiAgICBwdWJsaWMgaWNvbjpBcnJheTxhbnk+O1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyYW1zOiBNb2RhbERpYWxvZ1BhcmFtcywgcHJpdmF0ZSBwYWdlOiBQYWdlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHBhcmFtcy5jb250ZXh0KVxuICAgICAgICB0aGlzLlJlc3BvbnNlID0gcGFyYW1zLmNvbnRleHRbMF1cbiAgICAgICAgdGhpcy5PcmRlcklEPXBhcmFtcy5jb250ZXh0WzFdXG4gICAgICAgIHRoaXMuQURDUmVzcG9uc2U9W107XG4gICAgICAgIHRoaXMuaWNvbj1bXTtcbiAgICAgICAgLy8gaWYodGhpcy5SZXNwb25zZS5BcGlzU3RhdHVzTGlzdC5sZW5ndGg+MSl7XG4gICAgICAgIC8vICAgICB0aGlzLkFEQ1Jlc3BvbnNlID0gdGhpcy5SZXNwb25zZS5BcGlzU3RhdHVzTGlzdFsxXS5BZGNTdGF0dXM7XG4gICAgICAgIC8vICAgICB0aGlzLk5hdGlvbmFsaXR5ID0gdGhpcy5SZXNwb25zZS5BcGlzU3RhdHVzTGlzdFsxXS5OYXRpb25hbGl0eTtcbiAgICAgICAgLy8gICAgIHRoaXMuTmFtZSA9IHRoaXMuUmVzcG9uc2UuQXBpc1N0YXR1c0xpc3RbMV0uTGFzdE5hbWUrXCIvXCIrdGhpcy5SZXNwb25zZS5BcGlzU3RhdHVzTGlzdFsxXS5GaXJzdE5hbWU7XG4gICAgICAgIC8vICAgICB0aGlzLkRlY2lzaW9uQXJyYXkgPSB0aGlzLlJlc3BvbnNlLkFwaXNTdGF0dXNMaXN0WzFdLkRlY2lzaW9ucztcbiAgICAgICAgLy8gfWVsc2V7XG4gICAgICAgIC8vICAgICB0aGlzLkFEQ1Jlc3BvbnNlID0gdGhpcy5SZXNwb25zZS5BcGlzU3RhdHVzTGlzdFswXS5BZGNTdGF0dXM7XG4gICAgICAgIC8vICAgICB0aGlzLk5hdGlvbmFsaXR5ID0gdGhpcy5SZXNwb25zZS5BcGlzU3RhdHVzTGlzdFswXS5OYXRpb25hbGl0eTtcbiAgICAgICAgLy8gICAgIHRoaXMuTmFtZSA9IHRoaXMuUmVzcG9uc2UuQXBpc1N0YXR1c0xpc3RbMF0uTGFzdE5hbWUrXCIvXCIrdGhpcy5SZXNwb25zZS5BcGlzU3RhdHVzTGlzdFswXS5GaXJzdE5hbWU7XG4gICAgICAgIC8vICAgICB0aGlzLkRlY2lzaW9uQXJyYXkgPSB0aGlzLlJlc3BvbnNlLkFwaXNTdGF0dXNMaXN0WzBdLkRlY2lzaW9ucztcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIHRoaXMuUmVzcG9uc2UuQXBpc1N0YXR1c0xpc3QuZm9yRWFjaCgoYXBpc1N0YXR1cyxpbmRleCk9PntcblxuICAgICAgICAgICAgc3dpdGNoKGFwaXNTdGF0dXMuQWRjU3RhdHVzKXtcbiAgICAgICAgICAgICAgICBjYXNlIFwiTk9UT0tcIjogdGhpcy5BRENSZXNwb25zZS5wdXNoKFwiTk9UIE9LXCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLkFEQ1Jlc3BvbnNlW2luZGV4XS5Db2xvciA9IFwiI0RBMzkyM1wiXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuaWNvbi5wdXNoKFwiJiN4RThCMjtcIilcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5pY29uW2luZGV4XS5Db2xvciA9IFwiI0RBMzkyM1wiXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJFUlJcIjogdGhpcy5BRENSZXNwb25zZS5wdXNoKFwiRVJST1JcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuQURDUmVzcG9uc2VbaW5kZXhdLkNvbG9yID0gXCIjREEzOTIzXCJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5pY29uLnB1c2goXCImI3hFOEIyO1wiKVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmljb25baW5kZXhdLkNvbG9yID0gXCIjREEzOTIzXCJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkNPS1wiOiB0aGlzLkFEQ1Jlc3BvbnNlLnB1c2goXCJDb25kaXRpb25hbCBPS1wiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5BRENSZXNwb25zZVtpbmRleF0uQ29sb3IgPSBcIiMxOUE4NzRcIlxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmljb24ucHVzaChcIiYjeEU4NzY7XCIpXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuaWNvbltpbmRleF0uQ29sb3IgPSBcIiMxOUE4NzRcIlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiT0tcIjogdGhpcy5BRENSZXNwb25zZS5wdXNoKFwiT0tcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuQURDUmVzcG9uc2VbaW5kZXhdLkNvbG9yID0gXCIjMTlBODc0XCJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5pY29uW2luZGV4XS5Db2xvciA9IFwiIzE5QTg3NFwiXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuaWNvbi5wdXNoKFwiJiN4RTg3NjtcIilcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5pY29uLnB1c2goXCImI3hFODc2O1wiKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLkFEQ1Jlc3BvbnNlLnB1c2goYXBpc1N0YXR1cy5BZGNTdGF0dXMpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLkFEQ1Jlc3BvbnNlKVxuICAgICAgICB9KVxuICAgIH1cbiAgICBuZ09uSW5pdCgpe1xuICAgICAgICBpZih0aGlzLlJlc3BvbnNlLkVycm9ycyE9bnVsbCAmJiB0aGlzLlJlc3BvbnNlLkVycm9ycy5sZW5ndGg+MCl7XG4gICAgICAgICAgICB0aGlzLlJlc3BvbnNlLkVycm9ycy5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGlmKHRoaXMuRGVzY3JpcHRpb24ubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGlmKHRoaXMuRGVzY3JpcHRpb25baW5kZXhdIT1udWxsICYmIHRoaXMuRGVzY3JpcHRpb25baW5kZXhdLkRlY2lzaW9uTWVzc2FnZSAhPSBudWxsKVxuICAgICAgICAgICAgICAgIC8vICAgICB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB0aGlzLkRlc2NyaXB0aW9uW2luZGV4XS5EZWNpc2lvbk1lc3NhZ2UucHVzaChlbGVtZW50Lk1lc3NhZ2UpOyAgXG4gICAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRGVzY3JpcHRpb24ucHVzaCh7RGVjaXNpb25NZXNzYWdlOltdfSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuRGVzY3JpcHRpb25baW5kZXhdLkRlY2lzaW9uTWVzc2FnZS5wdXNoKGVsZW1lbnQuTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgLy8gfSAgICAgICAgICAgXG4gICAgICAgICAgICB9KTsgXG4gICAgICAgICAgICBjb25zb2xlLmRpcih0aGlzLkRlc2NyaXB0aW9uKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgIGNvbnNvbGUubG9nKFwidGhpcy5EZXNjcmlwdGlvblwiKTsgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5SZXNwb25zZS5BcGlzU3RhdHVzTGlzdC5mb3JFYWNoKChBcGlzU3RhdHVzLGluZGV4cyk9PntcbiAgICAgICAgICAgICAgICBBcGlzU3RhdHVzLkRlY2lzaW9ucy5mb3JFYWNoKChlbGVtZW50LGluZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZihlbGVtZW50LkRlY2lzaW9uTWVzc2FnZSE9XCJcIil7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkRlc2NyaXB0aW9uLnB1c2goe0RlY2lzaW9uTWVzc2FnZTpbXX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5EZXNjcmlwdGlvbltpbmRleHNdLkRlY2lzaW9uTWVzc2FnZS5wdXNoKGVsZW1lbnQuRGVjaXNpb25NZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmKGVsZW1lbnQuQ29uZGl0aW9uc0xpc3QhPW51bGwpe1xuICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5Db25kaXRpb25zTGlzdC5mb3JFYWNoKChsaXN0LGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkRlc2NyaXB0aW9uLnB1c2goe0RlY2lzaW9uTWVzc2FnZTpbXX0pOyAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5EZXNjcmlwdGlvbltpbmRleHNdLkRlY2lzaW9uTWVzc2FnZS5wdXNoKGxpc3QpO1xuICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICBjb25zb2xlLmRpcih0aGlzLkRlc2NyaXB0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjbG9zZSgpe1xuICAgICAgICB0aGlzLnBhcmFtcy5jbG9zZUNhbGxiYWNrKCk7IFxuICAgIH1cblxuXG5cbn0iXX0=