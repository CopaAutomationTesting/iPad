"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PassengerTemplate = /** @class */ (function () {
    function PassengerTemplate() {
        this._firstName = "";
        this._lastName = "";
        this._fullName = "";
        this._orderID = "";
        this._isSecurityDocsComplete = false;
        this._bagCount = 0;
        this._seatNumber = "";
        this._ssr = "";
        this._emd = "";
    }
    Object.defineProperty(PassengerTemplate.prototype, "FirstName", {
        //
        get: function () {
            return this._firstName;
        },
        set: function (_firstName) {
            this._firstName = _firstName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerTemplate.prototype, "LastName", {
        //
        get: function () {
            return this._lastName;
        },
        set: function (_lastName) {
            this._lastName = _lastName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerTemplate.prototype, "FullName", {
        //
        get: function () {
            return this._fullName;
        },
        set: function (_fullName) {
            this._fullName = _fullName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerTemplate.prototype, "OrderID", {
        //
        get: function () {
            return this._orderID;
        },
        set: function (_orderID) {
            this._firstName = _orderID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerTemplate.prototype, "IsSecurityDocsComplete", {
        get: function () {
            return this._isSecurityDocsComplete;
        },
        set: function (_isSecurityDocsComplete) {
            this._isSecurityDocsComplete = _isSecurityDocsComplete;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerTemplate.prototype, "BagCount", {
        //
        get: function () {
            return this._bagCount;
        },
        set: function (_bagCount) {
            this._bagCount = _bagCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerTemplate.prototype, "SeatNumber", {
        //
        get: function () {
            return this._seatNumber;
        },
        set: function (_seatNumber) {
            this._seatNumber = _seatNumber;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerTemplate.prototype, "From", {
        //
        get: function () {
            return this._from;
        },
        set: function (_from) {
            this._from = _from;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerTemplate.prototype, "To", {
        //
        get: function () {
            return this._to;
        },
        set: function (_to) {
            this._to = _to;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerTemplate.prototype, "SSR", {
        //
        get: function () {
            return this._ssr;
        },
        set: function (_ssr) {
            this._ssr = _ssr;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerTemplate.prototype, "EMD", {
        //
        get: function () {
            return this._emd;
        },
        set: function (_emd) {
            this._emd = _emd;
        },
        enumerable: true,
        configurable: true
    });
    return PassengerTemplate;
}());
exports.PassengerTemplate = PassengerTemplate;
var PassengerListTemplate = /** @class */ (function () {
    function PassengerListTemplate() {
        this._isChecked = false;
        this._firstName = "";
        this._lastName = "";
        this._fullName = "";
        this._orderID = "";
        this._isSecurityDocsComplete = false;
        this._bagCount = 0;
        this._seatNumber = "";
        this._ssr = "";
        this._emd = "";
    }
    Object.defineProperty(PassengerListTemplate.prototype, "IsChecked", {
        get: function () {
            return this._isChecked;
        },
        set: function (_isChecked) {
            this._isChecked = _isChecked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerListTemplate.prototype, "FirstName", {
        //
        get: function () {
            return this._firstName;
        },
        set: function (_firstName) {
            this._firstName = _firstName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerListTemplate.prototype, "LastName", {
        //
        get: function () {
            return this._lastName;
        },
        set: function (_lastName) {
            this._lastName = _lastName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerListTemplate.prototype, "FullName", {
        //
        get: function () {
            return this._fullName;
        },
        set: function (_fullName) {
            this._fullName = _fullName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerListTemplate.prototype, "OrderID", {
        //
        get: function () {
            return this._orderID;
        },
        set: function (_orderID) {
            this._orderID = _orderID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerListTemplate.prototype, "IsSecurityDocsComplete", {
        get: function () {
            return this._isSecurityDocsComplete;
        },
        set: function (_isSecurityDocsComplete) {
            this._isSecurityDocsComplete = _isSecurityDocsComplete;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerListTemplate.prototype, "BagCount", {
        //
        get: function () {
            return this._bagCount;
        },
        set: function (_bagCount) {
            this._bagCount = _bagCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerListTemplate.prototype, "SeatNumber", {
        //
        get: function () {
            return this._seatNumber;
        },
        set: function (_seatNumber) {
            this._seatNumber = _seatNumber;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerListTemplate.prototype, "From", {
        //
        get: function () {
            return this._from;
        },
        set: function (_from) {
            this._from = _from;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerListTemplate.prototype, "To", {
        //
        get: function () {
            return this._to;
        },
        set: function (_to) {
            this._to = _to;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerListTemplate.prototype, "SSR", {
        //
        get: function () {
            return this._ssr;
        },
        set: function (_ssr) {
            this._ssr = _ssr;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PassengerListTemplate.prototype, "EMD", {
        //
        get: function () {
            return this._emd;
        },
        set: function (_emd) {
            this._emd = _emd;
        },
        enumerable: true,
        configurable: true
    });
    return PassengerListTemplate;
}());
exports.PassengerListTemplate = PassengerListTemplate;
var PassengerList = /** @class */ (function () {
    function PassengerList() {
        this.IsChecked = false;
        this.FirstName = "";
        this.LastName = "";
        this.FullName = "";
        this.OrderID = "";
        this.PassengerType = "";
        this.IsSecurityDocsComplete = false;
        this.BagCount = 0;
        this.SeatNumber = "";
        this.SSR = "";
        this.SSRCount = 0;
        this.EMD = "";
        this.InfantName = "";
        this.AssociatedAdultRPH = "";
        this.CheckinStatus = false;
        this.TierLevel = "";
        this.BoardPriority = "";
        this.InfantIndicator = "";
        this.Oversold = false;
        this.SyncTicket = false;
        this.OnStandby = false;
    }
    return PassengerList;
}());
exports.PassengerList = PassengerList;
var Passenger = /** @class */ (function () {
    function Passenger(Firstname, Lastname, PassengerTypeCodeDesc, FqtTravelers, MembershipID) {
        this.Firstname = Firstname;
        this.Lastname = Lastname;
        this.PassengerTypeCodeDesc = PassengerTypeCodeDesc;
        this.FqtTravelers = FqtTravelers;
        this.MembershipID = MembershipID;
    }
    return Passenger;
}());
exports.Passenger = Passenger;
var order = /** @class */ (function () {
    function order(ID, Passenge, TotalCount) {
        this.ID = ID;
        this.Passenge = Passenge;
        this.TotalCount = TotalCount;
    }
    return order;
}());
exports.order = order;
var GetPassenger = /** @class */ (function () {
    function GetPassenger(OrderID) {
        this.OrderID = OrderID;
    }
    return GetPassenger;
}());
exports.GetPassenger = GetPassenger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc2VuZ2VyLmludGVyZmFjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhc3Nlbmdlci5pbnRlcmZhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtJQUFBO1FBQ1ksZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUN4QixjQUFTLEdBQVcsRUFBRSxDQUFDO1FBQ3ZCLGNBQVMsR0FBVyxFQUFFLENBQUM7UUFDdkIsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQUN0Qiw0QkFBdUIsR0FBWSxLQUFLLENBQUM7UUFHekMsY0FBUyxHQUFXLENBQUMsQ0FBQztRQUN0QixnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUN6QixTQUFJLEdBQVcsRUFBRSxDQUFDO1FBQ2xCLFNBQUksR0FBVyxFQUFFLENBQUM7SUErRTlCLENBQUM7SUE3RUcsc0JBQUksd0NBQVM7UUFEYixFQUFFO2FBQ0Y7WUFDSSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDM0IsQ0FBQzthQUNELFVBQWMsVUFBa0I7WUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDakMsQ0FBQzs7O09BSEE7SUFLRCxzQkFBSSx1Q0FBUTtRQURaLEVBQUU7YUFDRjtZQUNJLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQixDQUFDO2FBQ0QsVUFBYSxTQUFpQjtZQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMvQixDQUFDOzs7T0FIQTtJQUtELHNCQUFJLHVDQUFRO1FBRFosRUFBRTthQUNGO1lBQ0ksT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzFCLENBQUM7YUFDRCxVQUFhLFNBQWlCO1lBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQy9CLENBQUM7OztPQUhBO0lBS0Qsc0JBQUksc0NBQU87UUFEWCxFQUFFO2FBQ0Y7WUFDSSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDekIsQ0FBQzthQUNELFVBQVksUUFBZ0I7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ZSxHQUFVLEVBQUUsQ0FBQztRQUM1QixhQUFRLEdBQVksS0FBSyxDQUFDO1FBQzFCLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFDNUIsY0FBUyxHQUFZLEtBQUssQ0FBQztJQUN0QyxDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUFDLEFBeEJELElBd0JDO0FBeEJZLHNDQUFhO0FBMEIxQjtJQUNJLG1CQUNXLFNBQWlCLEVBQ2pCLFFBQWdCLEVBQ2hCLHFCQUE2QixFQUM3QixZQUFvQixFQUNwQixZQUFvQjtRQUpwQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLGFBQVEsR0FBUixRQUFRLENBQVE7UUFDaEIsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUFRO1FBQzdCLGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQ3BCLGlCQUFZLEdBQVosWUFBWSxDQUFRO0lBQzNCLENBQUM7SUFDVCxnQkFBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBUlksOEJBQVM7QUFXdEI7SUFDSSxlQUNXLEVBQVUsRUFDVixRQUFxQixFQUNyQixVQUFrQjtRQUZsQixPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1YsYUFBUSxHQUFSLFFBQVEsQ0FBYTtRQUNyQixlQUFVLEdBQVYsVUFBVSxDQUFRO0lBQ3pCLENBQUM7SUFFVCxZQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFQWSxzQkFBSztBQVNsQjtJQUNJLHNCQUNXLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO0lBQ3RCLENBQUM7SUFFVCxtQkFBQztBQUFELENBQUMsQUFMRCxJQUtDO0FBTFksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgUGFzc2VuZ2VyVGVtcGxhdGUge1xuICAgIHByaXZhdGUgX2ZpcnN0TmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICBwcml2YXRlIF9sYXN0TmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICBwcml2YXRlIF9mdWxsTmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICBwcml2YXRlIF9vcmRlcklEOiBzdHJpbmcgPSBcIlwiO1xuICAgIHByaXZhdGUgX2lzU2VjdXJpdHlEb2NzQ29tcGxldGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9mcm9tOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfdG86IHN0cmluZztcbiAgICBwcml2YXRlIF9iYWdDb3VudDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIF9zZWF0TnVtYmVyOiBzdHJpbmcgPSBcIlwiO1xuICAgIHByaXZhdGUgX3Nzcjogc3RyaW5nID0gXCJcIjtcbiAgICBwcml2YXRlIF9lbWQ6IHN0cmluZyA9IFwiXCI7XG4gICAgLy9cbiAgICBnZXQgRmlyc3ROYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9maXJzdE5hbWU7XG4gICAgfVxuICAgIHNldCBGaXJzdE5hbWUoX2ZpcnN0TmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2ZpcnN0TmFtZSA9IF9maXJzdE5hbWU7XG4gICAgfVxuICAgIC8vXG4gICAgZ2V0IExhc3ROYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sYXN0TmFtZTtcbiAgICB9XG4gICAgc2V0IExhc3ROYW1lKF9sYXN0TmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2xhc3ROYW1lID0gX2xhc3ROYW1lO1xuICAgIH1cbiAgICAvL1xuICAgIGdldCBGdWxsTmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZnVsbE5hbWU7XG4gICAgfVxuICAgIHNldCBGdWxsTmFtZShfZnVsbE5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9mdWxsTmFtZSA9IF9mdWxsTmFtZTtcbiAgICB9XG4gICAgLy9cbiAgICBnZXQgT3JkZXJJRCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3JkZXJJRDtcbiAgICB9XG4gICAgc2V0IE9yZGVySUQoX29yZGVySUQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9maXJzdE5hbWUgPSBfb3JkZXJJRDtcbiAgICB9XG5cbiAgICBnZXQgSXNTZWN1cml0eURvY3NDb21wbGV0ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzU2VjdXJpdHlEb2NzQ29tcGxldGU7XG4gICAgfVxuICAgIHNldCBJc1NlY3VyaXR5RG9jc0NvbXBsZXRlKF9pc1NlY3VyaXR5RG9jc0NvbXBsZXRlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2lzU2VjdXJpdHlEb2NzQ29tcGxldGUgPSBfaXNTZWN1cml0eURvY3NDb21wbGV0ZTtcbiAgICB9XG4gICAgLy9cbiAgICBnZXQgQmFnQ291bnQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JhZ0NvdW50O1xuICAgIH1cbiAgICBzZXQgQmFnQ291bnQoX2JhZ0NvdW50OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fYmFnQ291bnQgPSBfYmFnQ291bnQ7XG4gICAgfVxuICAgIC8vXG4gICAgZ2V0IFNlYXROdW1iZXIoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlYXROdW1iZXI7XG4gICAgfVxuICAgIHNldCBTZWF0TnVtYmVyKF9zZWF0TnVtYmVyOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fc2VhdE51bWJlciA9IF9zZWF0TnVtYmVyO1xuICAgIH1cbiAgICAvL1xuICAgIGdldCBGcm9tKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mcm9tO1xuICAgIH1cbiAgICBzZXQgRnJvbShfZnJvbTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2Zyb20gPSBfZnJvbTtcbiAgICB9XG4gICAgLy9cbiAgICBnZXQgVG8oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvO1xuICAgIH1cbiAgICBzZXQgVG8oX3RvOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fdG8gPSBfdG87XG4gICAgfVxuICAgIC8vXG4gICAgZ2V0IFNTUigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3NyO1xuICAgIH1cbiAgICBzZXQgU1NSKF9zc3I6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9zc3IgPSBfc3NyO1xuICAgIH1cbiAgICAvL1xuICAgIGdldCBFTUQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VtZDtcbiAgICB9XG4gICAgc2V0IEVNRChfZW1kOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fZW1kID0gX2VtZDtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIFBhc3Nlbmdlckxpc3RUZW1wbGF0ZSB7XG4gICAgcHJpdmF0ZSBfaXNDaGVja2VkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfZmlyc3ROYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgIHByaXZhdGUgX2xhc3ROYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgIHByaXZhdGUgX2Z1bGxOYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgIHByaXZhdGUgX29yZGVySUQ6IHN0cmluZyA9IFwiXCI7XG4gICAgcHJpdmF0ZSBfaXNTZWN1cml0eURvY3NDb21wbGV0ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX2Zyb206IHN0cmluZztcbiAgICBwcml2YXRlIF90bzogc3RyaW5nO1xuICAgIHByaXZhdGUgX2JhZ0NvdW50OiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgX3NlYXROdW1iZXI6IHN0cmluZyA9IFwiXCI7XG4gICAgcHJpdmF0ZSBfc3NyOiBzdHJpbmcgPSBcIlwiO1xuICAgIHByaXZhdGUgX2VtZDogc3RyaW5nID0gXCJcIjtcblxuICAgIGdldCBJc0NoZWNrZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0NoZWNrZWQ7XG4gICAgfVxuICAgIHNldCBJc0NoZWNrZWQoX2lzQ2hlY2tlZDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9pc0NoZWNrZWQgPSBfaXNDaGVja2VkO1xuICAgIH1cbiAgICAvL1xuICAgIGdldCBGaXJzdE5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpcnN0TmFtZTtcbiAgICB9XG4gICAgc2V0IEZpcnN0TmFtZShfZmlyc3ROYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fZmlyc3ROYW1lID0gX2ZpcnN0TmFtZTtcbiAgICB9XG4gICAgLy9cbiAgICBnZXQgTGFzdE5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhc3ROYW1lO1xuICAgIH1cbiAgICBzZXQgTGFzdE5hbWUoX2xhc3ROYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fbGFzdE5hbWUgPSBfbGFzdE5hbWU7XG4gICAgfVxuICAgIC8vXG4gICAgZ2V0IEZ1bGxOYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mdWxsTmFtZTtcbiAgICB9XG4gICAgc2V0IEZ1bGxOYW1lKF9mdWxsTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2Z1bGxOYW1lID0gX2Z1bGxOYW1lO1xuICAgIH1cbiAgICAvL1xuICAgIGdldCBPcmRlcklEKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vcmRlcklEO1xuICAgIH1cbiAgICBzZXQgT3JkZXJJRChfb3JkZXJJRDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX29yZGVySUQgPSBfb3JkZXJJRDtcbiAgICB9XG5cbiAgICBnZXQgSXNTZWN1cml0eURvY3NDb21wbGV0ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzU2VjdXJpdHlEb2NzQ29tcGxldGU7XG4gICAgfVxuICAgIHNldCBJc1NlY3VyaXR5RG9jc0NvbXBsZXRlKF9pc1NlY3VyaXR5RG9jc0NvbXBsZXRlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2lzU2VjdXJpdHlEb2NzQ29tcGxldGUgPSBfaXNTZWN1cml0eURvY3NDb21wbGV0ZTtcbiAgICB9XG4gICAgLy9cbiAgICBnZXQgQmFnQ291bnQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JhZ0NvdW50O1xuICAgIH1cbiAgICBzZXQgQmFnQ291bnQoX2JhZ0NvdW50OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fYmFnQ291bnQgPSBfYmFnQ291bnQ7XG4gICAgfVxuICAgIC8vXG4gICAgZ2V0IFNlYXROdW1iZXIoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlYXROdW1iZXI7XG4gICAgfVxuICAgIHNldCBTZWF0TnVtYmVyKF9zZWF0TnVtYmVyOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fc2VhdE51bWJlciA9IF9zZWF0TnVtYmVyO1xuICAgIH1cbiAgICAvL1xuICAgIGdldCBGcm9tKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mcm9tO1xuICAgIH1cbiAgICBzZXQgRnJvbShfZnJvbTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2Zyb20gPSBfZnJvbTtcbiAgICB9XG4gICAgLy9cbiAgICBnZXQgVG8oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvO1xuICAgIH1cbiAgICBzZXQgVG8oX3RvOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fdG8gPSBfdG87XG4gICAgfVxuICAgIC8vXG4gICAgZ2V0IFNTUigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3NyO1xuICAgIH1cbiAgICBzZXQgU1NSKF9zc3I6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9zc3IgPSBfc3NyO1xuICAgIH1cbiAgICAvL1xuICAgIGdldCBFTUQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VtZDtcbiAgICB9XG4gICAgc2V0IEVNRChfZW1kOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fZW1kID0gX2VtZDtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIFBhc3Nlbmdlckxpc3Qge1xuICAgIHB1YmxpYyBJc0NoZWNrZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgRmlyc3ROYW1lOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBMYXN0TmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgRnVsbE5hbWU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIE9yZGVySUQ6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIFBhc3NlbmdlclR5cGU6c3RyaW5nPVwiXCI7XG4gICAgcHVibGljIElzU2VjdXJpdHlEb2NzQ29tcGxldGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgRnJvbTogc3RyaW5nO1xuICAgIHB1YmxpYyBUbzogc3RyaW5nO1xuICAgIHB1YmxpYyBCYWdDb3VudDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgU2VhdE51bWJlcjogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgU1NSOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBTU1JDb3VudCA6IG51bWJlciA9IDA7XG4gICAgcHVibGljIEVNRDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgSW5mYW50TmFtZTogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgQXNzb2NpYXRlZEFkdWx0UlBIIDogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgQ2hlY2tpblN0YXR1czogQm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBUaWVyTGV2ZWw6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIEJvYXJkUHJpb3JpdHk6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIEluZmFudEluZGljYXRvcjpzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBPdmVyc29sZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBTeW5jVGlja2V0OiBib29sZWFuID0gZmFsc2U7IFxuICAgIHB1YmxpYyBPblN0YW5kYnk6IGJvb2xlYW4gPSBmYWxzZTtcbn1cblxuZXhwb3J0IGNsYXNzIFBhc3NlbmdlciB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBGaXJzdG5hbWU6IHN0cmluZyxcbiAgICAgICAgcHVibGljIExhc3RuYW1lOiBzdHJpbmcsXG4gICAgICAgIHB1YmxpYyBQYXNzZW5nZXJUeXBlQ29kZURlc2M6IHN0cmluZyxcbiAgICAgICAgcHVibGljIEZxdFRyYXZlbGVyczogc3RyaW5nLFxuICAgICAgICBwdWJsaWMgTWVtYmVyc2hpcElEOiBzdHJpbmdcbiAgICApIHsgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBvcmRlciB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBJRDogc3RyaW5nLFxuICAgICAgICBwdWJsaWMgUGFzc2VuZ2U6IFBhc3NlbmdlcltdLFxuICAgICAgICBwdWJsaWMgVG90YWxDb3VudDogc3RyaW5nXG4gICAgKSB7IH1cblxufVxuXG5leHBvcnQgY2xhc3MgR2V0UGFzc2VuZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIE9yZGVySUQ6IHN0cmluZyxcbiAgICApIHsgfVxuXG59Il19