"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DeparturePaxList = /** @class */ (function () {
    function DeparturePaxList() {
        //public IsChecked: boolean = false;
        this.OrderId = "";
        this.GivenName = "";
        this.Surname = "";
        this.FullName = "";
        this.DepartureCode = "";
        this.Dest = "";
        this.SeatNumber = "";
        this.Cabin = "";
        this.IsSecurityDocsComplete = false;
        this.CheckedBagCount = 0;
        this.SSRcount = "";
        this.ssrcount = 0;
        this.Status = "";
        this.CheckinStatus = false;
        this.InfantName = "";
        this.IsChecked = false;
        this.TierLevel = "";
        this.BoardPriority = "";
        this.InfantIndicator = "";
        this.Oversold = false;
        this.SyncTicket = false;
        this.OnStandby = false;
        this.PassengerType = "";
    }
    return DeparturePaxList;
}());
exports.DeparturePaxList = DeparturePaxList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwYXJ0dXJlLmludGVyZmFjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcGFydHVyZS5pbnRlcmZhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtJQUFBO1FBQ0ksb0NBQW9DO1FBQzdCLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFDckIsY0FBUyxHQUFXLEVBQUUsQ0FBQztRQUN2QixZQUFPLEdBQVcsRUFBRSxDQUFDO1FBQ3JCLGFBQVEsR0FBVyxFQUFFLENBQUM7UUFDdEIsa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFDM0IsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUNsQixlQUFVLEdBQVcsRUFBRSxDQUFDO1FBQ3hCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsMkJBQXNCLEdBQVksS0FBSyxDQUFDO1FBQ3hDLG9CQUFlLEdBQVcsQ0FBQyxDQUFDO1FBQzVCLGFBQVEsR0FBVyxFQUFFLENBQUM7UUFDdEIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixXQUFNLEdBQVcsRUFBRSxDQUFDO1FBQ3BCLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBQy9CLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFDeEIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUMzQixjQUFTLEdBQVcsRUFBRSxDQUFDO1FBQ3ZCLGtCQUFhLEdBQVcsRUFBRSxDQUFDO1FBQzNCLG9CQUFlLEdBQVEsRUFBRSxDQUFDO1FBQzFCLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDMUIsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUM1QixjQUFTLEdBQVksS0FBSyxDQUFDO1FBQzNCLGtCQUFhLEdBQVEsRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFBRCx1QkFBQztBQUFELENBQUMsQUF6QkQsSUF5QkM7QUF6QlksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIERlcGFydHVyZVBheExpc3Qge1xuICAgIC8vcHVibGljIElzQ2hlY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBPcmRlcklkOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBHaXZlbk5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFN1cm5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIEZ1bGxOYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBEZXBhcnR1cmVDb2RlOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBEZXN0OiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBTZWF0TnVtYmVyOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBDYWJpbjogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgSXNTZWN1cml0eURvY3NDb21wbGV0ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBDaGVja2VkQmFnQ291bnQ6IG51bWJlciA9IDA7XG4gICAgcHVibGljIFNTUmNvdW50OiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBzc3Jjb3VudDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgU3RhdHVzOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBDaGVja2luU3RhdHVzOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIEluZmFudE5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIElzQ2hlY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBUaWVyTGV2ZWw6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIEJvYXJkUHJpb3JpdHk6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIEluZmFudEluZGljYXRvcjpzdHJpbmc9XCJcIjtcbiAgICBwdWJsaWMgT3ZlcnNvbGQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgU3luY1RpY2tldDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBPblN0YW5kYnk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgUGFzc2VuZ2VyVHlwZTpzdHJpbmc9XCJcIjtcbn1cblxuIl19