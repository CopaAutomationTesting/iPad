"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var dialogs = require("ui/dialogs");
var router_1 = require("nativescript-angular/router");
var Toast = require("nativescript-toast");
var TimeOutService = /** @class */ (function () {
    function TimeOutService(routerExtensions) {
        this.routerExtensions = routerExtensions;
        this.timer = 0;
    }
    TimeOutService_1 = TimeOutService;
    TimeOutService.prototype.getTimer = function () {
        return this.timer;
    };
    TimeOutService.prototype.setTimer = function (timer) {
        this.timer = timer;
    };
    TimeOutService.prototype.startWatch = function () {
        var _this = this;
        var self = this;
        this.timer = TimeOutService_1.TIMER_DURATION;
        this.id = setInterval(function () {
            _this.timer--;
            // console.log(this.timer);
            if (_this.timer == 0) {
                dialogs.alert({
                    title: "Session Time OUT",
                    message: "Your session has timed out. Please login again.",
                    okButtonText: "Ok",
                }).then(function (result) {
                    // result argument is boolean
                    console.log("called");
                    clearInterval(self.id);
                    self.routerExtensions.navigate([""]);
                });
            }
            else if (_this.timer == TimeOutService_1.WARNING_DURATION) {
                Toast.makeText("Your session will expire in " + TimeOutService_1.WARNING_DURATION + " seconds").show();
            }
        }, 1000);
    };
    TimeOutService.prototype.resetWatch = function () {
        this.timer = TimeOutService_1.TIMER_DURATION;
        ;
    };
    TimeOutService.prototype.stopWatch = function () {
        var _this = this;
        var id = setInterval(function () {
            clearInterval(_this.id);
        }, 50);
    };
    var TimeOutService_1;
    TimeOutService.TIMER_DURATION = 1800000;
    TimeOutService.WARNING_DURATION = 60000;
    TimeOutService = TimeOutService_1 = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.RouterExtensions])
    ], TimeOutService);
    return TimeOutService;
}());
exports.TimeOutService = TimeOutService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZU91dC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGltZU91dC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLHNDQUEyQztBQUczQyxpQ0FBK0I7QUFDL0IsbUNBQWlDO0FBQ2pDLG9DQUFzQztBQUN0QyxzREFBZ0U7QUFNaEUsMENBQTRDO0FBRzVDO0lBQ0ksd0JBQW9CLGdCQUFrQztRQUFsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBRy9DLFVBQUssR0FBVyxDQUFDLENBQUM7SUFEekIsQ0FBQzt1QkFIUSxjQUFjO0lBU2hCLGlDQUFRLEdBQWY7UUFDSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVNLGlDQUFRLEdBQWYsVUFBZ0IsS0FBYTtRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBRU0sbUNBQVUsR0FBakI7UUFBQSxpQkF1QkM7UUF0QkcsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsZ0JBQWMsQ0FBQyxjQUFjLENBQUM7UUFDM0MsSUFBSSxDQUFDLEVBQUUsR0FBRyxXQUFXLENBQUM7WUFDbEIsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2IsMkJBQTJCO1lBQzNCLElBQUksS0FBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUU7Z0JBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUM7b0JBQ1YsS0FBSyxFQUFFLGtCQUFrQjtvQkFDekIsT0FBTyxFQUFFLGlEQUFpRDtvQkFDMUQsWUFBWSxFQUFFLElBQUk7aUJBQ3JCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxNQUFNO29CQUNwQiw2QkFBNkI7b0JBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3RCLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM3QyxDQUFDLENBQUMsQ0FBQzthQUNOO2lCQUFLLElBQUksS0FBSSxDQUFDLEtBQUssSUFBSSxnQkFBYyxDQUFDLGdCQUFnQixFQUFDO2dCQUNwRCxLQUFLLENBQUMsUUFBUSxDQUFDLDhCQUE4QixHQUFFLGdCQUFjLENBQUMsZ0JBQWdCLEdBQUUsVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDdEc7UUFDTCxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFHYixDQUFDO0lBQ00sbUNBQVUsR0FBakI7UUFDSSxJQUFJLENBQUMsS0FBSyxHQUFHLGdCQUFjLENBQUMsY0FBYyxDQUFDO1FBQUEsQ0FBQztJQUNoRCxDQUFDO0lBQ00sa0NBQVMsR0FBaEI7UUFBQSxpQkFJQztRQUhHLElBQU0sRUFBRSxHQUFHLFdBQVcsQ0FBQztZQUNuQixhQUFhLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNYLENBQUM7O0lBMUNhLDZCQUFjLEdBQVUsT0FBTyxDQUFDO0lBQ2hDLCtCQUFnQixHQUFVLEtBQUssQ0FBQztJQVByQyxjQUFjO1FBRDFCLGlCQUFVLEVBQUU7eUNBRTZCLHlCQUFnQjtPQUQ3QyxjQUFjLENBa0QxQjtJQUFELHFCQUFDO0NBQUEsQUFsREQsSUFrREM7QUFsRFksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvL2FuZ3VsYXIgJiBuYXRpdmVzY3JpcHQgcmVmZXJlbmNlc1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cCwgUmVzcG9uc2UsIEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9odHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL1J4JztcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvbWFwJztcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvY2F0Y2gnO1xuaW1wb3J0ICogYXMgZGlhbG9ncyBmcm9tIFwidWkvZGlhbG9nc1wiO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucywgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyXCI7XG5cbi8vYXBwIHJlZmVyZW5jZXNcbmltcG9ydCB7IFBhc3NlbmdlciB9IGZyb20gJy4uL2ludGVyZmFjZS9pbmRleCc7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vLi4vYXBwLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBBcHBFeGVjdXRpb250aW1lIH0gZnJvbSBcIi4uLy4uL2FwcC5leGVjdXRpb250aW1lXCI7XG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tICduYXRpdmVzY3JpcHQtdG9hc3QnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVGltZU91dFNlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9ucykge1xuXG4gICAgfVxuICAgIHB1YmxpYyB0aW1lcjogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgaWQ6IGFueTtcbiAgICBwdWJsaWMgc3RhdGljIFRJTUVSX0RVUkFUSU9OOm51bWJlciA9IDE4MDAwMDA7XG4gICAgcHVibGljIHN0YXRpYyBXQVJOSU5HX0RVUkFUSU9OOm51bWJlciA9IDYwMDAwO1xuXG4gICAgcHVibGljIGdldFRpbWVyKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnRpbWVyO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRUaW1lcih0aW1lcjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudGltZXIgPSB0aW1lcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhcnRXYXRjaCgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLnRpbWVyID0gVGltZU91dFNlcnZpY2UuVElNRVJfRFVSQVRJT047XG4gICAgICAgIHRoaXMuaWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRpbWVyLS07XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnRpbWVyKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVyID09IDApIHtcbiAgICAgICAgICAgICAgICBkaWFsb2dzLmFsZXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiU2Vzc2lvbiBUaW1lIE9VVFwiLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIllvdXIgc2Vzc2lvbiBoYXMgdGltZWQgb3V0LiBQbGVhc2UgbG9naW4gYWdhaW4uXCIsXG4gICAgICAgICAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPa1wiLFxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAvLyByZXN1bHQgYXJndW1lbnQgaXMgYm9vbGVhblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYWxsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHNlbGYuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFtcIlwiXSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9ZWxzZSBpZiAodGhpcy50aW1lciA9PSBUaW1lT3V0U2VydmljZS5XQVJOSU5HX0RVUkFUSU9OKXtcbiAgICAgICAgICAgICAgICBUb2FzdC5tYWtlVGV4dChcIllvdXIgc2Vzc2lvbiB3aWxsIGV4cGlyZSBpbiBcIisgVGltZU91dFNlcnZpY2UuV0FSTklOR19EVVJBVElPTisgXCIgc2Vjb25kc1wiKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMDApO1xuXG5cbiAgICB9XG4gICAgcHVibGljIHJlc2V0V2F0Y2goKSB7XG4gICAgICAgIHRoaXMudGltZXIgPSBUaW1lT3V0U2VydmljZS5USU1FUl9EVVJBVElPTjs7XG4gICAgfVxuICAgIHB1YmxpYyBzdG9wV2F0Y2goKSB7XG4gICAgICAgIGNvbnN0IGlkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmlkKTtcbiAgICAgICAgfSwgNTApO1xuICAgIH1cblxufSJdfQ==