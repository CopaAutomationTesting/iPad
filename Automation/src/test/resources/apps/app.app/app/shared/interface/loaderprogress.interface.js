"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var activity_indicator_1 = require("ui/activity-indicator");
var stack_layout_1 = require("ui/layouts/stack-layout");
var label_1 = require("ui/label");
var LoaderProgress = /** @class */ (function () {
    function LoaderProgress() {
        this._isLoading = false;
        this._loadingText = "Please Wait...";
    }
    Object.defineProperty(LoaderProgress.prototype, "IsLoading", {
        get: function () {
            return this._isLoading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoaderProgress.prototype, "LoadingText", {
        get: function () {
            return this._loadingText;
        },
        enumerable: true,
        configurable: true
    });
    LoaderProgress.prototype.showLoader = function (loadingText) {
        this._isLoading = true;
        if (loadingText) {
            this.loader_label.text = loadingText;
        }
        this.activityInd.busy = true;
        this.back_container.visibility = 'visible';
    };
    LoaderProgress.prototype.hideLoader = function () {
        this._isLoading = false;
        this.activityInd.busy = false;
        this.back_container.visibility = 'collapse';
    };
    // <StackLayout [visibility]="loaderProgress.IsLoading ? 'visible' : 'collapsed'" style="vertical-align:middle;background-color: rgba(0,0,0,0.6); "
    //         height="100%" width="100%">
    //         <StackLayout width="200" style="horizontal-align:center;background-color:#DDD; padding:20;">
    //             <ActivityIndicator busy="{{ loaderProgress.IsLoading }}" width="100%"></ActivityIndicator>
    //             <Label text="{{loaderProgress.LoadingText}}" textWrap="true" style="horizontal-align:center; font-size:13;color:#AAA; padding-top:10"></Label>
    //         </StackLayout>
    //     </StackLayout>  
    LoaderProgress.prototype.initLoader = function (currentView, loadingText) {
        var indView = currentView.nativeElement;
        this.loader_label = new label_1.Label;
        this.loader_label.className = "loader-label";
        if (loadingText) {
            this.loader_label.text = loadingText;
        }
        else {
            this.loader_label.text = this._loadingText;
        }
        this.activityInd = new activity_indicator_1.ActivityIndicator();
        this.activityInd.className = "loader";
        this.activityInd.busy = false;
        this.loader_container = new stack_layout_1.StackLayout();
        this.loader_container.className = "loader-container";
        if (this.activityInd.ios)
            this.activityInd.ios.activityIndicatorViewStyle = "0";
        this.loader_container.addChild(this.activityInd);
        // this.loader_container.addChild(this.loader_label);
        this.back_container = new stack_layout_1.StackLayout();
        this.back_container.className = "loader-back";
        this.back_container.visibility = 'collapse';
        this.back_container.addChild(this.loader_container);
        indView.addChild(this.back_container);
    };
    return LoaderProgress;
}());
exports.LoaderProgress = LoaderProgress;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVycHJvZ3Jlc3MuaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hZGVycHJvZ3Jlc3MuaW50ZXJmYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNERBQTBEO0FBQzFELHdEQUFzRDtBQUN0RCxrQ0FBaUM7QUFJakM7SUFBQTtRQUNZLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFDNUIsaUJBQVksR0FBVyxnQkFBZ0IsQ0FBQTtJQXlFbkQsQ0FBQztJQWpFRyxzQkFBSSxxQ0FBUzthQUFiO1lBQ0ksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQzNCLENBQUM7OztPQUFBO0lBRUQsc0JBQUksdUNBQVc7YUFBZjtZQUNJLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztRQUM3QixDQUFDOzs7T0FBQTtJQUVNLG1DQUFVLEdBQWpCLFVBQWtCLFdBQW9CO1FBQ2xDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksV0FBVyxFQUFFO1lBQ2IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO1NBQ3hDO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQzdCLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUMvQyxDQUFDO0lBRU0sbUNBQVUsR0FBakI7UUFDSSxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQ2hELENBQUM7SUFJRCxtSkFBbUo7SUFDbkosc0NBQXNDO0lBQ3RDLHVHQUF1RztJQUN2Ryx5R0FBeUc7SUFDekcsNkpBQTZKO0lBQzdKLHlCQUF5QjtJQUN6Qix1QkFBdUI7SUFDaEIsbUNBQVUsR0FBakIsVUFBa0IsV0FBdUIsRUFBRSxXQUFvQjtRQUczRCxJQUFJLE9BQU8sR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDO1FBRXhDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxhQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsY0FBYyxDQUFDO1FBQzdDLElBQUksV0FBVyxFQUFFO1lBQ2IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO1NBQ3hDO2FBQU07WUFDSCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1NBQzlDO1FBR0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLHNDQUFpQixFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUU5QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSwwQkFBVyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQztRQUNyRCxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRztZQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLDBCQUEwQixHQUFHLEdBQUcsQ0FBQTtRQUMvRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNqRCxxREFBcUQ7UUFFckQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLDBCQUFXLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUM7UUFDOUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzVDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXBELE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFHTCxxQkFBQztBQUFELENBQUMsQUEzRUQsSUEyRUM7QUEzRVksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEFjdGl2aXR5SW5kaWNhdG9yIH0gZnJvbSBcInVpL2FjdGl2aXR5LWluZGljYXRvclwiO1xuaW1wb3J0IHsgU3RhY2tMYXlvdXQgfSBmcm9tIFwidWkvbGF5b3V0cy9zdGFjay1sYXlvdXRcIjtcbmltcG9ydCB7IExhYmVsIH0gZnJvbSBcInVpL2xhYmVsXCI7XG5pbXBvcnQgeyBWaWV3IH0gZnJvbSBcInVpL2NvcmUvdmlld1wiO1xuXG5cbmV4cG9ydCBjbGFzcyBMb2FkZXJQcm9ncmVzcyB7XG4gICAgcHJpdmF0ZSBfaXNMb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfbG9hZGluZ1RleHQ6IHN0cmluZyA9IFwiUGxlYXNlIFdhaXQuLi5cIlxuICAgIHB1YmxpYyBhY3Rpdml0eUluZDogQWN0aXZpdHlJbmRpY2F0b3I7XG4gICAgcHVibGljIGJhY2tfY29udGFpbmVyOiBTdGFja0xheW91dDtcbiAgICBwdWJsaWMgbG9hZGVyX2NvbnRhaW5lcjogU3RhY2tMYXlvdXQ7XG4gICAgcHVibGljIGxvYWRlcl9sYWJlbDogTGFiZWw7XG5cblxuXG4gICAgZ2V0IElzTG9hZGluZygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzTG9hZGluZztcbiAgICB9XG5cbiAgICBnZXQgTG9hZGluZ1RleHQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRpbmdUZXh0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzaG93TG9hZGVyKGxvYWRpbmdUZXh0Pzogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2lzTG9hZGluZyA9IHRydWU7XG4gICAgICAgIGlmIChsb2FkaW5nVGV4dCkge1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJfbGFiZWwudGV4dCA9IGxvYWRpbmdUZXh0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWN0aXZpdHlJbmQuYnVzeSA9IHRydWU7XG4gICAgICAgIHRoaXMuYmFja19jb250YWluZXIudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICB9XG5cbiAgICBwdWJsaWMgaGlkZUxvYWRlcigpIHtcbiAgICAgICAgdGhpcy5faXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWN0aXZpdHlJbmQuYnVzeSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJhY2tfY29udGFpbmVyLnZpc2liaWxpdHkgPSAnY29sbGFwc2UnO1xuICAgIH1cblxuXG5cbiAgICAvLyA8U3RhY2tMYXlvdXQgW3Zpc2liaWxpdHldPVwibG9hZGVyUHJvZ3Jlc3MuSXNMb2FkaW5nID8gJ3Zpc2libGUnIDogJ2NvbGxhcHNlZCdcIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOm1pZGRsZTtiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsMCwwLDAuNik7IFwiXG4gICAgLy8gICAgICAgICBoZWlnaHQ9XCIxMDAlXCIgd2lkdGg9XCIxMDAlXCI+XG4gICAgLy8gICAgICAgICA8U3RhY2tMYXlvdXQgd2lkdGg9XCIyMDBcIiBzdHlsZT1cImhvcml6b250YWwtYWxpZ246Y2VudGVyO2JhY2tncm91bmQtY29sb3I6I0RERDsgcGFkZGluZzoyMDtcIj5cbiAgICAvLyAgICAgICAgICAgICA8QWN0aXZpdHlJbmRpY2F0b3IgYnVzeT1cInt7IGxvYWRlclByb2dyZXNzLklzTG9hZGluZyB9fVwiIHdpZHRoPVwiMTAwJVwiPjwvQWN0aXZpdHlJbmRpY2F0b3I+XG4gICAgLy8gICAgICAgICAgICAgPExhYmVsIHRleHQ9XCJ7e2xvYWRlclByb2dyZXNzLkxvYWRpbmdUZXh0fX1cIiB0ZXh0V3JhcD1cInRydWVcIiBzdHlsZT1cImhvcml6b250YWwtYWxpZ246Y2VudGVyOyBmb250LXNpemU6MTM7Y29sb3I6I0FBQTsgcGFkZGluZy10b3A6MTBcIj48L0xhYmVsPlxuICAgIC8vICAgICAgICAgPC9TdGFja0xheW91dD5cbiAgICAvLyAgICAgPC9TdGFja0xheW91dD4gIFxuICAgIHB1YmxpYyBpbml0TG9hZGVyKGN1cnJlbnRWaWV3OiBFbGVtZW50UmVmLCBsb2FkaW5nVGV4dD86IHN0cmluZykge1xuXG5cbiAgICAgICAgdmFyIGluZFZpZXcgPSBjdXJyZW50Vmlldy5uYXRpdmVFbGVtZW50O1xuXG4gICAgICAgIHRoaXMubG9hZGVyX2xhYmVsID0gbmV3IExhYmVsO1xuICAgICAgICB0aGlzLmxvYWRlcl9sYWJlbC5jbGFzc05hbWUgPSBcImxvYWRlci1sYWJlbFwiO1xuICAgICAgICBpZiAobG9hZGluZ1RleHQpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyX2xhYmVsLnRleHQgPSBsb2FkaW5nVGV4dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyX2xhYmVsLnRleHQgPSB0aGlzLl9sb2FkaW5nVGV4dDtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdGhpcy5hY3Rpdml0eUluZCA9IG5ldyBBY3Rpdml0eUluZGljYXRvcigpO1xuICAgICAgICB0aGlzLmFjdGl2aXR5SW5kLmNsYXNzTmFtZSA9IFwibG9hZGVyXCI7XG4gICAgICAgIHRoaXMuYWN0aXZpdHlJbmQuYnVzeSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMubG9hZGVyX2NvbnRhaW5lciA9IG5ldyBTdGFja0xheW91dCgpO1xuICAgICAgICB0aGlzLmxvYWRlcl9jb250YWluZXIuY2xhc3NOYW1lID0gXCJsb2FkZXItY29udGFpbmVyXCI7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2aXR5SW5kLmlvcykgdGhpcy5hY3Rpdml0eUluZC5pb3MuYWN0aXZpdHlJbmRpY2F0b3JWaWV3U3R5bGUgPSBcIjBcIlxuICAgICAgICB0aGlzLmxvYWRlcl9jb250YWluZXIuYWRkQ2hpbGQodGhpcy5hY3Rpdml0eUluZCk7XG4gICAgICAgIC8vIHRoaXMubG9hZGVyX2NvbnRhaW5lci5hZGRDaGlsZCh0aGlzLmxvYWRlcl9sYWJlbCk7XG5cbiAgICAgICAgdGhpcy5iYWNrX2NvbnRhaW5lciA9IG5ldyBTdGFja0xheW91dCgpO1xuICAgICAgICB0aGlzLmJhY2tfY29udGFpbmVyLmNsYXNzTmFtZSA9IFwibG9hZGVyLWJhY2tcIjtcbiAgICAgICAgdGhpcy5iYWNrX2NvbnRhaW5lci52aXNpYmlsaXR5ID0gJ2NvbGxhcHNlJztcbiAgICAgICAgdGhpcy5iYWNrX2NvbnRhaW5lci5hZGRDaGlsZCh0aGlzLmxvYWRlcl9jb250YWluZXIpO1xuXG4gICAgICAgIGluZFZpZXcuYWRkQ2hpbGQodGhpcy5iYWNrX2NvbnRhaW5lcik7XG4gICAgfVxuXG5cbn1cbiJdfQ==